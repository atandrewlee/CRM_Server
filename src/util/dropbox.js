import { Dropbox } from "dropbox";
import { dropboxConfig } from "./constants.js";
import { redirectUri } from "./constants.js";

let instance;

export class DropboxCommands {
  constructor() {
    if (instance) {
      return instance;
    }
    this.dbx = new Dropbox(dropboxConfig);
    instance = this;
  }

  /**
   *
   * @param {string} filePath - Dropbox.filesDownload (file path argument)
   * Refer to docs: https://www.dropbox.com/developers/documentation/http/documentation#files-download
   * 
   * @returns {BinaryData} a Binary containing the text file
   */
  async dropboxGetFile(filePath) {
    try {
      const response = await this.dbx.filesDownload({ path: filePath });
      console.log(response);
      return response.result.fileBinary;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *
   * @param {*} path
   * @param {*} content
   */
  async dropboxUploadFile(path, content) {
    try {
      const response = await this.dbx.filesUpload({
        path: path,
        contents: content,
        mode: { ".tag": "overwrite" },
      });
      console.log(response);
    } catch (error) {
      console.error;
    }
  }

  dropbox_auth(req, res) {
    const { code } = req.query;
    console.log(`code:${code}`);

    this.dbx.auth
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

  dropbox_gen_access_token(req, res) {
    this.dbx.auth
      .getAuthenticationUrl(
        redirectUri,
        null,
        "code",
        "offline",
        null,
        "none",
        false
      )
      .then((authUrl) => {
        res.writeHead(302, { Location: authUrl });
        res.end();
      });
  }
}
