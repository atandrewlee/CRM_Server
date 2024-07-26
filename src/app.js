import cron from "node-cron";
import express from "express";
import bodyParser from "body-parser";
import { createNewUser } from "./listener/listener.js";
import { Dropbox } from "dropbox";
import fetch from 'node-fetch';


// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const port = 3000;
const config = {
    clientId: 'm6oyxerwdomtjv7',
    clientSecret: 'g4drdaz6ahxtmbu'
};
export const dbx = new Dropbox(config);
const redirectUri = `http://localhost:3000/auth`

app.post("/", 
    bodyParser.json({inflate: true, strict: false, type: "application/json"}), 
    createNewUser)

app.get("/", (req, res) => {
    dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)
    .then((authUrl) => {
        res.writeHead(302, {Location: authUrl });
        res.end();
    })
})

app.get('/auth', (req, res) => { // eslint-disable-line no-unused-vars
    const { code } = req.query;
    console.log(`code:${code}`);
  
    dbx.auth.getAccessTokenFromCode(redirectUri, code)
      .then((token) => {
        console.log(`Token Result:${JSON.stringify(token)}`);
        dbx.auth.setRefreshToken(token.result.refresh_token);
      });
    res.end();
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
