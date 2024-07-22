import axios from "axios";

const DROPBOX_URL =  "https://content.dropboxapi.com/2/files/upload";

export function dropbox_create_file(title) {
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