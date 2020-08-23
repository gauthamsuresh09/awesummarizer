const axios = require('axios');

const promise1 = new Promise( (resolve, reject) => {
	resolve(1)
})

const promise2 = new Promise( (resolve, reject) => {
	resolve(2)
})

let working_dir = `${__dirname}`;
let video_path = `${__dirname}/end.mp4`;
const url = 'http://127.0.0.1:5000/callbert'
const promise3 = axios.get(url, {
	params: {
		'working_dir': working_dir,
		'videofilepath': video_path,
	}
}).catch((error) => console.log(error));

Promise.all([promise1, promise2, promise3]).then( (values) => {
	console.log('All promise resolved!')
	console.log(values[0] + values[1])
		// console.log('done POST')
		// console.log(response);
		// res.send(urls)
		// res.send(response.data)
		// console.log(response.data);

		// res.send("success!")
		let ret = {}
		ret['summary'] = values[2].data
		console.log(ret)
		// res.send(ret)
})