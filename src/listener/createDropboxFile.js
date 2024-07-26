// import axios from "axios";
import { dbx } from "../app.js";

export function dropbox_create_file(title) {
    dbx.filesUpload({ path: process.env.CRM_FILE_PATH + title + ".md"}).then((response) => {
        console.log(response);
    }).catch((uploadErr) => {
        console.log(uploadErr);
    })