import fs from 'fs';

if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');

let loggerFilename = `logging-${new Date().toLocaleDateString().replaceAll('/', '-')}.log`;
setInterval(() => {
	loggerFilename = `logging-${new Date().toLocaleDateString().replaceAll('/', '-')}.log`;
}, 1000 * 60 * 30);

function writeToFile(data, retries = 0) {
	fs.appendFile(`./logs/${loggerFilename}`, `${data}`, (err) => {
		if (err && retries < 10) {
			retries++;
			setTimeout(() => writeToFile(data, retries), 100 + Math.floor(Math.random() * 1000));
		}
	});
}

/** @param {import('express').Express} app */
export default function logging(app) {
	app.post('/logging', (req, res) => {
		console.log('logging accessed');
		writeToFile(JSON.stringify(req.body));
		res.status(200).json({});
	});
}
