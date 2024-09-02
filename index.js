import express from 'express';
import 'dotenv/config';
import backup from './endpoints/backup/index.js';

const PORT = 3030;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

backup(app);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
