import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUserUpdate, createNewUserInsert } from "./listener/listener.js";
import { Dropbox } from "dropbox";
import { dropbox_auth, dropbox_gen_access_token } from "./dropbox_auth.js";

// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const port = 3000;
const config = {
    clientId: process.env.DROPBOX_APP_KEY,
    clientSecret: process.env.DROPBOX_APP_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
};
export const dbx = new Dropbox(config);

// Webhooks
app.post("/", 
    bodyParser.json({inflate: true, strict: false, type: "application/json"}), 
    createNewUserUpdate)
app.post("/new",
    bodyParser.json({inflate: true, strict: false, type: "application/json"}),
    createNewUserInsert
)

// Authentication Path's
app.get("/", dropbox_gen_access_token);
app.get('/auth', dropbox_auth);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
