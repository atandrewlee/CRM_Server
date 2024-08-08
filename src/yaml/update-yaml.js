/*
1. Route to a webhook (on Update)
2. Parse The Rows
3. Only Include The Rows I Need
4. Parse the YAML

*/
import fs from "node:fs"
import yaml from 'js-yaml';
import { dbx } from "../app.js";

function dropbox_get_daily_note(filePath) {
  return dbx.filesDownload({ path: filePath })
      .then(response => response.result.fileBinary)
      .catch(error => {
          console.error(error);
      });
}



const LIST_FIELDS = ['interests', 'relationship']

function route(req, res) {
    const items = req.body.data.rows[0]
    updateYAMLInFile(items)
}

function updateYAMLInFile(row) {
    // Get Dropbox File
    const filePath = process.env.CRM_FILE_PATH + row.Name + ".md" // get file from the name
    dropbox_get_daily_note(filePath).then(fileBinary => {
      const fileString = fileBinary.toString('utf8');
      // Convert All comma-separated lists into actual lists
      LIST_FIELDS.forEach((item, index) => {
        const str = row[item];
        const arr = str.split(',');
        row[item] = arr
      })
      // Convert All Date/Date-Time into proper format
      
      // Write new YAMl to the file
      const yamlString = yaml.dump(row)
      const updatedData = fileString.replace(/---\s*[\s\S]*?\s*---/, `---\n${yamlString}\n---`);

      // Upload File to Dropbox
      uploadFileToDropbox(filePath, updatedData);
    })
}


/**
 * 
 * @param {*} path 
 * @param {*} content 
 */
async function uploadFileToDropbox(path, content) {
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

updateYAMLInFile(jsonObject)