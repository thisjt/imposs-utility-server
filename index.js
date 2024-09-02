import express from 'express';
import 'dotenv/config';
import backup from './endpoints/backup/index.js';
import analytics from './endpoints/analytics/index.js';
import logging from './endpoints/logging/index.js';
import status from './endpoints/status/index.js';

const PORT = 3030;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

backup(app);
analytics(app);
logging(app);
status(app);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
