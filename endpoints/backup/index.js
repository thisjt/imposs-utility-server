import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';

const authKey = process.env.BACKUPAUTHKEY;
const uniqueRuntimeId = crypto.randomBytes(40).toString('hex');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './endpoints/backup/files');
	},
	filename: (req, file, callback) => {
		const filename = todaysFilename(req, file);
		callback(null, filename);
	},
});

const upload = multer({ storage, fileFilter });

/**
 * @param {import('express').Request} req
 * @param {Express.Multer.File} file
 * @returns {string}
 */
function todaysFilename(req, file) {
	const uniqid = new Date().toDateString().replaceAll(' ', '-');
	const slug = req.query.slug || 'imposs';
	const filename = `${uniqid} - ${slug} - ${file.originalname}`;
	return filename;
}

/**
 * @param {import('express').Request} req
 * @param {Express.Multer.File} file
 * @param {(error:null, accept:boolean) => void} callback
 */
function fileFilter(req, file, callback) {
	const filename = todaysFilename(req, file);
	const authorization = req.headers.authorization.replaceAll('Bearer ', '');
	if (fs.existsSync(`./files/${filename}`) || authorization !== authKey) {
		callback(null, false);
	} else {
		req.query[uniqueRuntimeId] = filename;
		callback(null, true);
	}
}

/** @param {import('express').Express} app */
export default function backup(app) {
	app.post('/backup', upload.single('file'), (req, res) => {
		const filename = req.query[uniqueRuntimeId] || '';

		if (filename) {
			res.status(200).json({ isBackedUp: true, newlyCreated: true });
		} else {
			res.status(200).json({ isBackedUp: true, newlyCreated: false });
		}
	});
}
