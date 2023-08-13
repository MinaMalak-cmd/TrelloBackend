import express from 'express';
import dotenv from 'dotenv';

import bootstrap from './src/index.router.js';
import { croneOne, croneTwo, croneThree } from './src/utils/crons.js';
import { gracefulShutdown } from 'node-schedule';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

bootstrap(app, express);

croneOne();
croneTwo();

// gracefulShutdown();

croneThree();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))