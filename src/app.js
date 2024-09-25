import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUserUpdate, createNewUserInsert } from "./listener/createFileFromNewPerson.js";
import { databaseToFileCRMYAML } from "./listener/update-yaml.js";
import { DailyNoteParser } from "./cron/dailyNoteParser.js";
import { DropboxCommands } from "./util/dropbox.js";
import { remindOfNextContact } from "./cron/sendNotificationForNextContact.js";
import { writeLog } from "./util/logging.js";

// Intialization
const app = express();
const port = 3000;
const dropboxInstance = Object.freeze(new DropboxCommands());

// Process Daily Note Each Day (Update Last-Contacted)
cron.schedule('18 21 * * *', async (now) => {
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const dateFileName = `${year}-${month}-${day}`;

    const filePath = process.env.DAILY_NOTE_PATH + dateFileName + ".md";

    writeLog({
        key: "END-OF-DAY CRON TASK",
        month: month,
        day: day,
        year: year,
        dateFileName: dateFileName,
        filePath: filePath
    })
    const parser = new DailyNoteParser(filePath);
    await parser.parseDailyNote();

    await remindOfNextContact();
})


// Webhook Routes
app.post("/create-user-update", bodyParser.json({inflate: true, strict: false, type: "application/json"}), 
    createNewUserUpdate)
app.post("/create-user-new", bodyParser.json({inflate: true, strict: false, type: "application/json"}),
    createNewUserInsert)
app.post("/crm-yaml", bodyParser.json({inflate: true, strict: false, type: "application/json"}),
    databaseToFileCRMYAML
)
app.get("/test-logging", writeLog("THIS IS A TEST TO SEE IF LOGGING WORKS ON GCP"));


// Authentication Path's
app.get("/", dropboxInstance.dropbox_gen_access_token);
app.get('/auth', dropboxInstance.dropbox_auth);

app.listen(port, () => { 
    console.log(`Example app listening on port ${port}!`);
});
