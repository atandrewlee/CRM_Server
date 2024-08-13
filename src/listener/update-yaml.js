import yaml from "js-yaml";
import { DropboxCommands } from "../util/dropbox.js";

const LIST_FIELDS = ["interests", "relationship"];
const DELETE_FIELDS = [
  "CreatedAt",
  "UpdatedAt",
  "Company",
  "Instagram",
  "Twitter",
];

export async function databaseToFileCRMYAML(req, res) {
  const items = req.body.data.rows[0];
  await updateYAMLInFile(items);
}

/**
 *
 * @param {*} row
 */
async function updateYAMLInFile(row) {
  const dbx = new DropboxCommands();
  // Get Dropbox File
  const filePath = process.env.CRM_FILE_PATH + row.Name + ".md";
  try {
    const fileBinary = await dbx.dropboxGetFile(filePath);
    const fileString = fileBinary.toString("utf8");
    // Delete Unnecessary Fields
    DELETE_FIELDS.forEach((item, index) => {
      delete row[item];
    });

    // Convert All comma-separated lists into actual lists
    LIST_FIELDS.forEach((item, index) => {
      const str = row[item];
      if (str != null) {
        const arr = str.split(",");
        row[item] = arr;
      }
    });
    // Convert All Date/Date-Time into proper format

    // Write new YAMl to the file
    const yamlString = yaml.dump(row);
    const updatedData = fileString.replace(
      /---\s*[\s\S]*?\s*---/,
      `---\n${yamlString}\n---`
    );

    // Upload File to Dropbox
    await dbx.dropboxUploadFile(filePath, updatedData);
  } catch (error) {
    console.error(error);
  }
}
