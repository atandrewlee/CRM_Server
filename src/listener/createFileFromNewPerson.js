import { dropboxUploadFile } from "../util/dropbox.js"
export function createNewUser(req, res) {
    const before_row = req.body.data.previous_rows[0]
    const after_row = req.body.data.rows[0]

    // New Row is Created w/ a Name
    if (before_row.Name === null && after_row.Name !== null && typeof(after_row.Name) === 'string') {
        res.send(dropboxUploadFile(process.env.CRM_FILE_PATH + after_row.Name + ".md", ""))
    }
}
