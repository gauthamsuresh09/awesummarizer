'use strict';
require('dotenv').config();

const os = require("os");
const async = require('async');
const util = require('util');
const uuidv4 = require('uuid/v4');
const path = require('path');
const url = require('url');
const fs = require('fs');
const axios = require('axios');

const MediaServices = require('azure-arm-mediaservices');
const msRestAzure = require('ms-rest-azure');
const msRest = require('ms-rest');
const azureStorage = require('azure-storage');

const setTimeoutPromise = util.promisify(setTimeout);

const armAadAudience = process.env.armAadAudience;
const armEndpoint = process.env.armEndpoint;
const subscriptionId = process.env.subscriptionId;
const accountName = process.env.accountName;
const region = process.env.region;
const aadEndpoint = process.env.aadEndpoint;
const aadClientId = process.env.aadClientId;
const aadSecret = process.env.aadSecret;
const aadTenantId = process.env.aadTenantId;
const resourceGroup = process.env.resourceGroup;
var multer = require('multer')

const express = require('express')
const cors = require('cors')

var storage = multer.diskStorage({
    "destination": __dirname,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
const port = 3000

const app = express();
app.use(cors())

// default video path name
let working_dir = `${__dirname}`;
let video_path = `${__dirname}/end.mp4`;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/upload', upload.single('video'), function (req, res) {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const promise = new Promise(function (resolve, reject) {
        try {
            upload.single("video");
            resolve("saved")
        } catch {
            reject();
        }
    })
    video_path = `${__dirname}/${req.file.originalname}`;

    promise
        .then(function (response) {

            let microservicePromise;
            let amsPromise;

            // call BERT microservice
            const video_url = 'http://127.0.0.1:5000/callbert'
            // microservicePromise = new Promise((resolve, reject) => {
            //     resolve('microservice promise fulfilled!');
            // })
            microservicePromise = axios.get(video_url, {
                params: {
                    'working_dir': working_dir,
                    'videofilepath': video_path,
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then((response) => {
              return response.data;
            });

            // amsPromise = new Promise((resolve, reject) => {
            //     resolve('amsPromise promise fulfilled!');
            // });
            amsPromise = new Promise( (resolve, reject) => {
                console.log(response);

                const namePrefix = "prefix";

                const inputFile = `${__dirname}/${req.file.originalname}`;

                const encodingTransformName = "TransformWithAdaptiveStreamingPreset";

                // constants
                const timeoutSeconds = 60 * 10;
                const sleepInterval = 1000 * 15;

                let azureMediaServicesClient;
                let blobName = null;

                ///////////////////////////////////////////
                //     Entrypoint for sample script      //
                ///////////////////////////////////////////

                msRestAzure.loginWithServicePrincipalSecret(aadClientId, aadSecret, aadTenantId, {
                    environment: {
                        activeDirectoryResourceId: armAadAudience,
                        resourceManagerEndpointUrl: armEndpoint,
                        activeDirectoryEndpointUrl: aadEndpoint
                    }
                }, async function (err, credentials, subscriptions) {
                    if (err) return console.log(err);
                    azureMediaServicesClient = new MediaServices(credentials, subscriptionId, armEndpoint, { noRetryPolicy: true });
                    let urls;

                    try {

                        // Ensure that you have the desired encoding Transform. This is really a one time setup operation.
                        console.log("creating encoding transform...");
                        let adaptiveStreamingTransform = {
                            odatatype: "#Microsoft.Media.BuiltInStandardEncoderPreset",
                            presetName: "AdaptiveStreaming"
                        };
                        let encodingTransform = await ensureTransformExists(resourceGroup, accountName, encodingTransformName, adaptiveStreamingTransform);

                        console.log("getting job input from arguments...");
                        let uniqueness = uuidv4();
                        let input = await getJobInputFromArguments(resourceGroup, accountName, uniqueness);
                        let outputAssetName = namePrefix + '-output-' + uniqueness;
                        let jobName = namePrefix + '-job-' + uniqueness;
                        let locatorName = "locator" + uniqueness;

                        console.log("creating output asset...");
                        let outputAsset = await createOutputAsset(resourceGroup, accountName, outputAssetName);

                        console.log("submitting job...");
                        let job = await submitJob(resourceGroup, accountName, encodingTransformName, jobName, input, outputAsset.name);

                        console.log("waiting for job to finish...");
                        job = await waitForJobToFinish(resourceGroup, accountName, encodingTransformName, jobName);

                        if (job.state == "Finished") {
                            // await downloadResults(resourceGroup, accountName, outputAsset.name, outputFolder);

                            let locator = await createStreamingLocator(resourceGroup, accountName, outputAsset.name, locatorName);

                            urls = await getStreamingUrls(resourceGroup, accountName, locator.name);

                            console.log("deleting jobs ...");
                            await azureMediaServicesClient.jobs.deleteMethod(resourceGroup, accountName, encodingTransformName, jobName);
                            // await azureMediaServicesClient.assets.deleteMethod(resourceGroup, accountName, outputAsset.name);

                            let jobInputAsset = input;
                            if (jobInputAsset && jobInputAsset.assetName) {
                                await azureMediaServicesClient.assets.deleteMethod(resourceGroup, accountName, jobInputAsset.assetName);
                            }
                        } else if (job.state == "Error") {
                            console.log(`${job.name} failed. Error details:`);
                            console.log(job.outputs[0].error);
                        } else if (job.state == "Canceled") {
                            console.log(`${job.name} was unexpectedly canceled.`);
                        } else {
                            console.log(`${job.name} is still in progress.  Current state is ${job.state}.`);
                        }
                        console.log("done with sample");
                        resolve(urls);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                });
                async function waitForJobToFinish(resourceGroup, accountName, transformName, jobName) {
                    let timeout = new Date();
                    timeout.setSeconds(timeout.getSeconds() + timeoutSeconds);

                    async function pollForJobStatus() {
                        let job = await azureMediaServicesClient.jobs.get(resourceGroup, accountName, transformName, jobName);
                        console.log(job.state);
                        if (job.state == 'Finished' || job.state == 'Error' || job.state == 'Canceled') {
                            return job;
                        } else if (new Date() > timeout) {
                            console.log(`Job ${job.name} timed out.`);
                            return job;
                        } else {
                            await setTimeoutPromise(sleepInterval, null);
                            return pollForJobStatus();
                        }
                    }

                    return await pollForJobStatus();
                }

                async function submitJob(resourceGroup, accountName, transformName, jobName, jobInput, outputAssetName) {
                    let jobOutputs = [
                        {
                            odatatype: "#Microsoft.Media.JobOutputAsset",
                            assetName: outputAssetName
                        }
                    ];

                    return await azureMediaServicesClient.jobs.create(resourceGroup, accountName, transformName, jobName, {
                        input: jobInput,
                        outputs: jobOutputs
                    });
                }


                async function getJobInputFromArguments(resourceGroup, accountName, uniqueness) {
                    if (inputFile) {
                        let assetName = namePrefix + "-input-" + uniqueness;
                        await createInputAsset(resourceGroup, accountName, assetName, inputFile);
                        return {
                            odatatype: "#Microsoft.Media.JobInputAsset",
                            assetName: assetName
                        }
                    } else {
                        return {
                            odatatype: "#Microsoft.Media.JobInputHttp",
                            files: [inputUrl]
                        }
                    }
                }

                async function createOutputAsset(resourceGroup, accountName, assetName) {
                    return await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});
                }

                async function createInputAsset(resourceGroup, accountName, assetName, fileToUpload) {
                    let asset = await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});
                    let date = new Date();
                    date.setHours(date.getHours() + 1);
                    let input = {
                        permissions: "ReadWrite",
                        expiryTime: date
                    }
                    let response = await azureMediaServicesClient.assets.listContainerSas(resourceGroup, accountName, assetName, input);
                    let uploadSasUrl = response.assetContainerSasUrls[0] || null;
                    let fileName = path.basename(fileToUpload);
                    let sasUri = url.parse(uploadSasUrl);
                    let sharedBlobService = azureStorage.createBlobServiceWithSas(sasUri.host, sasUri.search);
                    let containerName = sasUri.pathname.replace(/^\/+/g, '');
                    let randomInt = Math.round(Math.random() * 100);
                    blobName = fileName + randomInt;
                    console.log("uploading to blob...");
                    function createBlobPromise() {
                        return new Promise(function (resolve, reject) {
                            sharedBlobService.createBlockBlobFromLocalFile(containerName, blobName, fileToUpload, resolve);
                        });
                    }
                    await createBlobPromise();
                    return asset;
                }

                async function ensureTransformExists(resourceGroup, accountName, transformName, preset) {
                    let transform = await azureMediaServicesClient.transforms.get(resourceGroup, accountName, transformName);
                    if (!transform) {
                        transform = await azureMediaServicesClient.transforms.createOrUpdate(resourceGroup, accountName, transformName, {
                            name: transformName,
                            location: region,
                            outputs: [{
                                preset: preset
                            }]
                        });
                    }
                    return transform;
                }

                async function createStreamingLocator(resourceGroup, accountName, assetName, locatorName) {
                    let streamingLocator = {
                        assetName: assetName,
                        streamingPolicyName: "Predefined_ClearStreamingOnly"
                    };

                    let locator = await azureMediaServicesClient.streamingLocators.create(
                      resourceGroup,
                      accountName,
                      locatorName,
                      streamingLocator);

                    return locator;
                }

                async function getStreamingUrls(resourceGroup, accountName, locatorName) {
                    // Make sure the streaming endpoint is in the "Running" state.

                    let streamingEndpoint = await azureMediaServicesClient.streamingEndpoints.get(resourceGroup, accountName, "default");

                    let paths = await azureMediaServicesClient.streamingLocators.listPaths(resourceGroup, accountName, locatorName);
                    let final_urls = [];
                    for (let i = 0; i < paths.streamingPaths.length; i++) {
                        let path = paths.streamingPaths[i].paths[0];
                        console.log("https://" + streamingEndpoint.hostName + "//" + path);
                        final_urls[i] = "https://" + streamingEndpoint.hostName + "//" + path;
                    }
                    return final_urls
                }
            });

            Promise.all([amsPromise, microservicePromise]).then( (values) => {
                console.log('All promises resolved!')
                // res.send("success!")
                let ret = {};
                ret['urls'] = values[0];
                ret['summary'] = values[1][0] // timestamps and summary text
                ret['transcript'] = values[1][1] // timestamps and summary text
                console.log(ret)
                res.send(ret)
            });


        })
        .catch(function () {
            res.status(500).send('Server Error');
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})