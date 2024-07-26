import { dropbox_create_file } from "./createDropboxFile.js"
import { dropbox_gen_access_token } from "../dropbox_auth.js"

export async function createNewUser(req, res) {
    const before_row = req.body.data.previous_rows[0]
    const after_row = req.body.data.rows[0]

    // New Row is Created w/ a Name
    if (before_row.Name === null && after_row.Name !== null && typeof(after_row.Name) === 'string') {
        await dropbox_gen_access_token(req, res)
        res.send(dropbox_create_file(after_row.Name))
    }
}

