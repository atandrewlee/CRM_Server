import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const router = express.Router();
const port = 3000;

// Create new file when ...
router.post("/", bodyParser.json({inflate: true, strict: false, type: "application/json"}), (req, res) => {
    const before_row = req.body.data.previous_rows[0]
    const after_row = req.body.data.rows[0]

    // New Row is Created w/ a Name
    if (before_row.Name === null && after_row.Name !== null && typeof(after_row.Name) === 'string') {
        res.send(dropbox_create_file(after_row.Name))
    }
})

app.use(router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});




// New File Creation ((MOVE TO NEW FILE))
const DROPBOX_URL =  "https://content.dropboxapi.com/2/files/upload";

function dropbox_create_file(title) {
    const options = {
        method: 'POST',
        url: DROPBOX_URL,
        headers: {
            'Authorization': `Bearer ${process.env.DROPBOX_API}`,
            'Dropbox-API-Arg': JSON.stringify({
                mode: "add",
                path: `/ionia/crm/${title}`
            }), 
            'Content-Type': "application/octet-stream"
        }
    }
    axios(options).then((response) => {
        console.log(response.data);
        return response.data;
    }).catch((error) => {
        console.log(error);
        return error;
    })
}