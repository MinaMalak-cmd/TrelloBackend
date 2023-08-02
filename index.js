import express from 'express';
import dotenv from 'dotenv';

import sendEmail from './src/utils/email.js';
import bootstrap from './src/index.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))