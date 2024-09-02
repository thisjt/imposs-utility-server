/** @param {import('express').Express} app */
export default function status(app) {
	app.post('/status', (req, res) => {
		console.log('status accessed');
		res.status(200).json({});
	});
}
