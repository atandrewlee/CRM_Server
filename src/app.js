import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUserUpdate, createNewUserInsert } from "./listener/createFileFromNewPerson.js";
import { databaseToFileCRMYAML } from "./listener/update-yaml.js";
import { DropboxCommands } from "./util/dropbox.js";
// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const port = 3000;
const dropboxInstance = Object.freeze(new DropboxCommands());

// Webhook Routes
app.post("/create-user-update", bodyParser.json({inflate: true, strict: false, type: "application/json"}), 
    createNewUserUpdate)
app.post("/create-user-new", bodyParser.json({inflate: true, strict: false, type: "application/json"}),
    createNewUserInsert)
app.post("/crm-yaml", bodyParser.json({inflate: true, strict: false, type: "application/json"}),
    databaseToFileCRMYAML
)


// Authentication Path's
app.get("/", dropboxInstance.dropbox_gen_access_token);
app.get('/auth', dropboxInstance.dropbox_auth);

app.listen(port, () => { 
    console.log(`Example app listening on port ${port}!`);
});
