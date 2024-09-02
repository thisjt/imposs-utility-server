import express from 'express';
import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import 'dotenv/config';

const PORT = 3030;
const app = express();
const uniqueRuntimeId = crypto.randomBytes(40).toString('hex');
const authKey = process.env.AUTHKEY;

/**
 * @param {express.Request} req
 * @param {Express.Multer.File} file
 * @returns {string}
 */
const todaysFilename = (req, file) => {
	const uniqid = new Date().toDateString().replaceAll(' ', '-');
	const slug = req.query.slug || 'imposs';
	const filename = `${uniqid} - ${slug} - ${file.originalname}`;
	return filename;
};

/**
 * @param {express.Request} req
 * @param {Express.Multer.File} file
 * @param {(error:null, accept:boolean) => void} callback
 */
const fileFilter = (req, file, callback) => {
	const filename = todaysFilename(req, file);
	const authorization = req.headers.authorization.replaceAll('Bearer ', '');
	if (fs.existsSync(`./files/${filename}`) || authorization !== authKey) {
		callback(null, false);
	} else {
		req.query[uniqueRuntimeId] = filename;
		callback(null, true);
	}
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './files');
	},
	filename: (req, file, callback) => {
		const filename = todaysFilename(req, file);
		callback(null, filename);
	},
});

const upload = multer({ storage, fileFilter });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('file'), (req, res) => {
	const filename = req.query[uniqueRuntimeId] || '';

	if (filename) {
		res.status(200).json({ isBackedUp: true, newlyCreated: true });
	} else {
		res.status(200).json({ isBackedUp: true, newlyCreated: false });
	}
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
