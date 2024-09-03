import fs from 'fs';

if (!fs.existsSync('./endpoints/analytics/logs')) fs.mkdirSync('./endpoints/analytics/logs');

let loggerFilename = `analytics-${new Date().toLocaleDateString().replaceAll('/', '-')}.log`;
setInterval(() => {
	loggerFilename = `analytics-${new Date().toLocaleDateString().replaceAll('/', '-')}.log`;
}, 1000 * 60 * 30);

function writeToFile(data, retries = 0) {
	fs.appendFile(`./endpoints/analytics/logs/${loggerFilename}`, `${data}\n`, (err) => {
		if (err && retries < 10) {
			retries++;
			setTimeout(() => writeToFile(data, retries), 100 + Math.floor(Math.random() * 1000));
		}
	});
}

/** @param {import('express').Express} app */
export default function analytics(app) {
	app.post('/analytics', (req, res) => {
		console.log('analytics accessed');
		writeToFile(JSON.stringify(req.body));
		res.status(200).json({});
	});
}
