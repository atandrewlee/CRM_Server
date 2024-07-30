import { dropbox_create_file } from "./createDropboxFile.js"

export function createNewUserUpdate(req, res) {
    const before_row = req.body.data.previous_rows[0]
    const after_row = req.body.data.rows[0]

    // New Row is Created w/ a Name
    if (before_row.Name === null && after_row.Name !== null && typeof(after_row.Name) === 'string') {
        res.send(dropbox_create_file(after_row.Name))
    }
}

export function createNewUserInsert(req, res) {
    const row = req.body.data.rows[0]
    if (row.Name !== null) {
        res.send(dropbox_create_file(row.Name))
    }
}