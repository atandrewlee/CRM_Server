import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUser } from "./listener/listener.js";
import { Dropbox } from "dropbox";
import { dropbox_auth, dropbox_gen_access_token } from "./dropbox_auth.js";

// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const port = 3000;
const config = {
    clientId: 'm6oyxerwdomtjv7',
    clientSecret: 'g4drdaz6ahxtmbu'
};
export const dbx = new Dropbox(config);

app.post("/", 
    bodyParser.json({inflate: true, strict: false, type: "application/json"}), 
    await createNewUser)

app.get("/", dropbox_gen_access_token);

app.get('/auth', dropbox_auth);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
