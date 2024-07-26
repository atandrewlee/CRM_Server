import { dbx } from "./app.js";
const redirectUri = `${process.env.HOST}/auth`
let accessCode = "";


export function dropbox_auth(req, res) {
    dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)
    .then((authUrl) => {
      accessCode = req.query;
        res.writeHead(302, {Location: authUrl });
        res.end();
    })
}

export function dropbox_access_token(req, res) {
    const { code } = req.query;
    console.log(`code:${code}`);
  
    dbx.auth.getAccessTokenFromCode(redirectUri, code)
      .then((token) => {
        console.log(`Token Result:${JSON.stringify(token)}`);
        dbx.auth.setRefreshToken(token.result.refresh_token);
      });
    res.end();
}
