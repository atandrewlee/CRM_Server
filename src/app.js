import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUserUpdate, createNewUserInsert } from "./listener/createFileFromNewPerson.js";
import { databaseToFileCRMYAML } from "./listener/update-yaml.js";
import { DailyNoteParser } from "./cron/dailyNoteParser.js";
import { DropboxCommands } from "./util/dropbox.js";
// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const DATE_OPTIONS = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}

// Process Daily Note Each Day (Update Last-Contacted)
cron.schedule('55 23 * * *', (now) => {
    const dateFileName = now.toLocaleString(DATE_OPTIONS);
    const parser = new DailyNoteParser(process.env.CRM_FILE_PATH + dateFileName + ".md");
    parser.parseDailyNote();
})




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
