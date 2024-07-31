import * as fs from "node:fs";
import * as readline from "node:readline";
import axios from "axios";

// Test File
// const filePath = 'src/parser/test_markdown.md';

const URL =
  "http://noco.andrewleeofficial.com/api/v2/tables/m87s2ylc5jc3r34/records";
const VIEW_ID = "vwe4ecbjvasdfbzj";
const SECTION_TITLE = "People";

let inSection = false;

// Higher-Order Function
function createLineParser(filePath) {
  return function processLine(line) {
    if (line.startsWith("# ")) {
      // Markdown Heading 1
      if (line.slice(2).trim() === SECTION_TITLE) {
        // Enter People Heading 1
        inSection = true;
      } else {
        // Left People Heading 1
        inSection = false;
      }
    }
    if (inSection) {
      // In Section
      fileName = "";
      parseLine(line, fileName);
    }
  };
}

function parseDailyNote(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  rl.on("line", createLineParser(filePath));
}

function parseLine(line, fileName) {
  const links = findAllMarkdownLinks(line);
  links.forEach(async (link) => {
    let linkParts = getFilePathFromLink(link);
    if (linkParts === null) {
      return;
    }
    let linkName = linkParts[linkParts.length - 1];
    let personName = decodeURIComponent(linkName).replace(".md", "");

    // COMMENT: Don't check the `/crm/...` yet because we don't have things standardized with links in Obsidian
    //let linkPath = linkParts[linkParts.length - 2];
    let listOfNames = await getAllNames();
    const isNameInList = listOfNames.some(
      (person) => person.Name === personName
    );
    if (isNameInList) {
      // Update Last-Interaction w/
    }
  });
}

// Helper Functions
/**
 * Gets all names + id's from the database
 *
 * @returns {id: number, name: String}
 */
function getAllNames() {
  return new Promise((resolve, reject) => {
    let listNames = [];
    var options = {
      method: "GET",
      url: URL,
      params: { offset: "0", fields: "Id,Name", viewId: VIEW_ID },
      headers: {
        "xc-token": process.env.NOCO_API,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        response.data.list.forEach((row) => {
          listNames.push(row);
        });
        resolve(listNames);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
}

function findAllMarkdownLinks(text) {
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = text.match(markdownLinkPattern);
  return matches || [];
}

function getFilePathFromLink(link) {
  const markdownLinkPattern = /\[.*?\]\(([^)]+)\)/;
  const match = markdownLinkPattern.exec(link);

  if (match) {
    return match[1].split("/").filter((part) => part.length > 0);
  } else {
    return null;
  }
}

function updateLastContact(id, date) {
    return new Promise((resolve, reject) => {
        const options = {
            method: "PATCH",
            url: URL,
            headers: {
                "xc-token": process.env.NOCO_API,
            },
            data: {
                "Id": id,
                "Last Contact": date,
            }
        }



    })

}





















// rl.on('line', (line) => {
//     console.log(`Line from file: ${line}`);
// })

// rl.on('close', () => {
//     console.log('File reading completed.');
// });

/*
Note on File Structure:
- /
    - /crm
    - /plans/daily

Note on Naming
- CRM File Names: `First Last.md`




*/
/* What Other Work To Do
- When link found in the daily note, parse the CRM
- Function To Wrap Everything (given file)

- Whole Function to do this for every file
    - 



- Automated call to a 

*/
//parseLine("[Oksana Sokolova](../../crm/Oksana%20Sokolova.md)");
await getAllNames();