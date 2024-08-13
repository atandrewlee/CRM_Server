import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUserUpdate, createNewUserInsert } from "./listener/createFileFromNewPerson.js";
import { databaseToFileCRMYAML } from "./listener/update-yaml.js";
import { DailyNoteParser } from "./cron/dailyNoteParser.js";
import { DropboxCommands } from "./util/dropbox.js";
import { remindOfNextContact } from "./cron/sendNotificationForNextContact.js";
// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })



// Process Daily Note Each Day (Update Last-Contacted)
cron.schedule('55 23 * * *', async (now) => {
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const dateFileName = `${year}-${month}-${day}`;

    console.log(dateFileName);
    const filePath = process.env.DAILY_NOTE_PATH + dateFileName + ".md";
    console.log(filePath);
    const parser = new DailyNoteParser(filePath);
    await parser.parseDailyNote();

    await remindOfNextContact();
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
