/** @param {import('express').Express} app */
export default function analytics(app) {
	app.post('/analytics', (req, res) => {
		console.log('analytics accessed');
		res.status(200).json({});
	});
}
