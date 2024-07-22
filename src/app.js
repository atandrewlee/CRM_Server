import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUser } from "./listener/listener.js";

// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const port = 3000;

app.post("/", 
    bodyParser.json({inflate: true, strict: false, type: "application/json"}), 
    createNewUser)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

