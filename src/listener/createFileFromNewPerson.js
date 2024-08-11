import { STARTING_CRM_PAGE_TEMPLATE } from "../util/constants.js"
import { DropboxCommands } from "../util/dropbox.js"



export function createNewUserUpdate(req, res) {
    const dbx = new DropboxCommands();    
    const before_row = req.body.data.previous_rows[0]
    const after_row = req.body.data.rows[0]

    // New Row is Created w/ a Name
    if (before_row.Name === null && after_row.Name !== null && typeof(after_row.Name) === 'string') {
        res.send(dbx.dropboxUploadFile(process.env.CRM_FILE_PATH + after_row.Name + ".md", STARTING_CRM_PAGE_TEMPLATE))
    }
}

export function createNewUserInsert(req, res) {
    const dbx = new DropboxCommands(); 
    const row = req.body.data.rows[0]
    if (row.Name !== null) {
        res.send(dbx.dropboxUploadFile(process.env.CRM_FILE_PATH + row.Name + ".md"), STARTING_CRM_PAGE_TEMPLATE);
    }
}