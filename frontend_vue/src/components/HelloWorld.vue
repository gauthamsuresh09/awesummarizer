<template>
    <v-app id="inspire">
        <v-app-bar app clipped-right color="white" light>
            <v-toolbar-title>Timestamp Generation</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-container fluid>
            <v-row align="center" justify='center'>
                <v-col cols=5 class="text-center">
                    <v-form>
                        <v-file-input v-model="file" label="Select a file!"></v-file-input>
                        <v-btn color="primary" @click="submitFile">Upload</v-btn>
                    </v-form>
                </v-col>
            </v-row>
            <v-row align="center" justify='center'>
                <v-col cols=10>
                    <v-skeleton-loader v-if='url == "" && submitted == true' type="image" width="640" height="400"></v-skeleton-loader>
                    <v-card v-else>
                        <video id="vid1" class="azuremediaplayer amp-default-skin" autoplay controls width="auto" height="auto" poster="poster.jpg" data-setup='{"nativeControlsForTouch": false}' cea708CaptionsSettings='{ enabled: true, srclang: "en", label: "CC"}'>
                            <source :src="url" type=".ism/manifest" />
                            <p class="amp-no-js">
                                To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
                            </p>
                        </video>
                        <v-card>
                            <v-tabs v-model="tab" background-color="primary" dark centered>
                                <v-tab key="transcript">
                                    Transcript
                                </v-tab>
                                <v-tab key="summary">
                                    Summary with Timestamps
                                </v-tab>
                            </v-tabs>

                            <v-tabs-items v-model="tab">
                                <v-tab-item>
                                    <v-card v-if="transcript" flat>
                                        <v-card-text>{{ transcript }}</v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item>
                                    <v-card v-for="item in summary" :key="item.timestamp" flat>
                                        <v-card-text>{{ item.timestamp }}: {{ item.text }}</v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-card>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-navigation-drawer v-model="right" fixed right temporary></v-navigation-drawer>

        <v-footer app color="blue-grey" class="white--text">
            <span>Vuetify</span>
            <v-spacer></v-spacer>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script>
import axios from "axios";

export default {
    props: {
        source: String,
        id: String
    },
    data: () => ({
        drawer: null,
        drawerRight: null,
        submitted: false,
        right: false,
        left: false,
        file: null,
        transcript: '',
        summary: [],
        url: "test",
        tab: null,
        items: [
            { tab: 'Transcript', content: 'Tab 1 Content' },
            { tab: 'Summary with Timestamps', content: 'Tab 2 Content' },
        ],
    }),

    methods: {

        submitFile() {
            console.log('uploading file...')
            let formData = new FormData();
            this.submitted = true;
            formData.append('video', this.file);
            axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function (res) {
                console.log('SUCCESS!!');
                this.transcript = res.data['transcript'];
                this.summary = res.data['summary'];
                this.url = res.data['urls'][2];
                this.submitted = false;
            }).catch(function (err) {
                console.error(err);
            });
        }
    }
}
</script>
