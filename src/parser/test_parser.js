import * as fs from "node:fs";
import * as readline from "node:readline";
import axios from "axios";

// Test File
// const filePath = 'src/parser/test_markdown.md';

const URL =
  "http://noco.andrewleeofficial.com/api/v2/tables/m87s2ylc5jc3r34/records";
const VIEW_ID = "vwe4ecbjvasdfbzj";
const SECTION_TITLE = "People";
















// Global Variable To Check For State
let inSection = false;

/**
 * Higher Order Function
 * Creates a line parser
 * 
 * @param {*} filePath 
 * @returns 
 */
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
      const fileName = "";
      parseLine(line, fileName);
    }
  };
}

/**
 * Top-Level Function to parse through a daily note
 * 
 * Looks only in the section for the CRM
 * Looks through each line for links. If it finds any backlinks to people in the CRM, updates last-contacted
 *  
 * @param {*} filePath 
 */
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
    const personId = findPersonExistsReturnId(personName, listOfNames)
    if (personId !== null) {
      // Add a Try/Catch
      const date = "" //TODO: Change Filename -> Date
      updateLastContact(personId, date)
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

/**
 * Sends request to NocoDB to change "Last Contact" column date
 * @argument id: id of the row
 * @argument date: date in "YYYY-MM-DD" format
 *
 */
function updateLastContact(id, date) {
  // Validate Date
  return new Promise((resolve, reject) => {
    var options = {
      method: "PATCH",
      url: URL,
      params: { offset: "0", fields: "Id,Name", viewId: VIEW_ID },
      headers: {
        "xc-token": process.env.NOCO_API,
      }, 
      data: {
        "Id": id,
        "Last Contact": date,
      },
    };
    axios.request(options).then(function (response) {
      console.log(response.data);
      resolve(response.data);
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

function findPersonExistsReturnID(name, list) {
  const person = list.find((person) => person.Name === name)
  return person ? person.Id : null;
}


// Function to validate date into API

// Function to convert "" -> date


















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
//await getAllNames();
//updateLastContact(82, "2024-08-05");
// console.log(findPersonExistsReturnID("Zach Zhang",[
//     { Id: 1, Name: 'Tameem Hourani' },
//     { Id: 2, Name: 'Sean Park' },
//     { Id: 3, Name: 'Ethan Lee' },
//     { Id: 4, Name: 'Louis Karipis' },
//     { Id: 5, Name: 'Ajish George' },
//     { Id: 6, Name: 'Evelyn Cooper' },
//     { Id: 7, Name: 'Shefali Mukerji' },
//     { Id: 8, Name: 'Jay Bhambhani' },
//     { Id: 9, Name: 'Kyle Throsell' },
//     { Id: 10, Name: 'Josh Linnett' },
//     { Id: 11, Name: 'Nathan Sanders' },
//     { Id: 22, Name: 'Alex Park' },
//     { Id: 47, Name: 'Jean-Philippe Michel' },
//     { Id: 48, Name: 'Connor Grant' },
//     { Id: 50, Name: 'Jeongwon Cho' },
//     { Id: 55, Name: 'Joe Little' },
//     { Id: 61, Name: 'Jason Frishman' },
//     { Id: 65, Name: 'Jill Neff' },
//     { Id: 69, Name: 'John Fanning' },
//     { Id: 71, Name: 'Caroline Wilkinson' },
//     { Id: 82, Name: 'Zach Zhang' }
//   ]))