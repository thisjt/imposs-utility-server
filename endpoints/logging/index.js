/** @param {import('express').Express} app */
export default function logging(app) {
	app.post('/logging', (req, res) => {
		console.log('logging accessed');
		res.status(200).json({});
	});
}
