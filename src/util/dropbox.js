import { dbx } from "../app.js";
/**
 * 
 * @param {*} filePath - Dropbox.filesDownload (file path argument)
 * Refer to docs: https://www.dropbox.com/developers/documentation/http/documentation#files-download
 */
export async function dropboxGetFile(filePath) {
    try {
        const response = await dbx.filesDownload({ path: filePath })
        console.log(response)
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
export async function dropboxUploadFile(path, content) {
    try {
      const response = await dbx.filesUpload({
        path: path,
        contents: content,
        mode: { '.tag': 'overwrite' },
      })
      console.log(response); 
    } catch (error) {
      console.error
    }
  }