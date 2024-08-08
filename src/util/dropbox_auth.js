import { dbx } from "../app.js";
const redirectUri = `${process.env.HOST}/auth`;

export function dropbox_gen_access_token(req, res) {
  dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)
    .then((authUrl) => {
      res.writeHead(302, { Location: authUrl });
      res.end();
    });
}

export function dropbox_auth(req, res) {
  const { code } = req.query;
  console.log(`code:${code}`);

  dbx.auth
    .getAccessTokenFromCode(redirectUri, code)
    .then((token) => {
      console.log(`Token Result:${JSON.stringify(token)}`);
      dbx.auth.setRefreshToken(token.result.refresh_token); 
    })
    .catch((error) => {
      console.error(error);
    });
  res.end();
}
