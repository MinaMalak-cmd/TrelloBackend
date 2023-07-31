import express from 'express';
import dotenv from 'dotenv';

import sendEmail from './src/utils/email.js';
import bootstrap from './src/index.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

bootstrap(app, express);

await sendEmail({
    to:"minamalak6300@gmail.com",
    subject:"textttt",
    html:"<h1>Hello dear friend 2</h1>",
    cc:"engmina65@gmail.com"
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))