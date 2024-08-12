/*
Parses Daily Note To Update Last-Contacted

*/
import * as readline from "node:readline";
import axios from "axios";
import { Readable } from 'stream';
import path from 'path';
import { DropboxCommands } from "../util/dropbox.js";
import { DATE_OPTIONS } from "../util/constants.js";


/** @constructor
 * Parser for a Daily Note to check for when I last contacted people
 * 
 * @param {string} file - The whole filepath (from /../../../file.md)
 * 
 * # How to use?
 * 1. Create DailyNoteParser(file)
 * 2. run parseDailyNote() 
 */
export class DailyNoteParser {
  constructor(file) {
    this.file = file;
    this.inSection = false;
  }

  /**
   * Top-Level Function to parse through a daily note
   * 
   * Looks only in the section for the CRM
   * Looks through each line for links. If it finds any backlinks to people in the CRM, updates last-contacted
   *  
   * @param {*} filePath 
   */
  parseDailyNote() {
    const dbx = new DropboxCommands();
    dbx.dropboxGetFile(this.file).then(fileBinary => {
      const binaryStream = new Readable();
      binaryStream._read = () => {};
      binaryStream.push(fileBinary)
      const rl = readline.createInterface({
        input: binaryStream,
        crlfDelay: Infinity,
      });
    rl.on("line", this.createLineParser(this.file));
  })
}

  /**
   * Higher Order Function
   * Creates a line parser
   * The line parser only parses lines that are in the section
   * 
   * @param {*} filePath 
   * @returns 
   */
  createLineParser(filePath) {
    return (line) => {
      if (line.startsWith("# ")) {
        // Markdown Heading 1
        if (line.slice(2).trim() === process.env.CRM_SECTION_TITLE) {
          // Enter People Heading 1
          this.inSection = true;
        } else {
          // Left People Heading 1
          this.inSection = false;
        }
      }
      if (this.inSection) {
        // In Section
        const fileName = path.basename(filePath)
        this.parseLine(line, fileName);
      }
    };
  }

  /**
   * 
   * @param {*} line 
   * @param {*} fileName 
   */
  parseLine(line, fileName) {
    const links = findAllMarkdownLinks(line);
    links.forEach(async (link) => {
      let linkParts = breakMDLinkToFilePathComponents(link);
      if (linkParts === null) {
        return;
      }
      let linkName = linkParts[linkParts.length - 1];
      let personName = decodeURIComponent(linkName).replace(".md", "");
  
      // COMMENT: Don't check the `/crm/...` yet because we don't have things standardized with links in Obsidian
      //let linkPath = linkParts[linkParts.length - 2];
      let listOfNames = await getAllRowsSelectColumns("Id,Name");
      const foundPerson = findPersonExistsReturnPerson(personName, listOfNames)
      if (foundPerson !== null) {
        // Add a Try/Catch
        const date = fileName.replace(".md", ""); // TODO: Check the fileName
        updateLastAndNextContact(foundPerson.Id, date, foundPerson.Next_Contact_Interval);
        return;
      }
    });
  }
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
      url: process.env.NOCO_URL +process.env.NOCO_URL_API + process.env.NOCO_TABLE_ID + "/records",
      params: { offset: "0", fields: "Id,Name", viewId: process.env.NOCO_VIEW_ID },
      headers: {
        "xc-token": process.env.NOCO_API,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        response.data.list.forEach((row) => {
          listNames.push(row);
        });
        resolve(listNames);
      })
      .catch(function (error) {
        console.error(error);
        reject(error);
      });
  });
}

function getAllRowsSelectColumns(columns) {
  return new Promise((resolve, reject) => {
    let res = [];
    var options = {
      method: "GET",
      url: process.env.NOCO_URL +process.env.NOCO_URL_API + process.env.NOCO_TABLE_ID + "/records",
      params: { offset: "0", fields: columns, viewId: process.env.NOCO_VIEW_ID },
      headers: {
        "xc-token": process.env.NOCO_API,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        response.data.list.forEach((row) => {
          listNames.push(row);
        });
        resolve(res);
      })
      .catch(function (error) {
        console.error(error);
        reject(error);
      });
  })
}

export function findAllMarkdownLinks(text) {
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = text.match(markdownLinkPattern);
  return matches || [];
}
/**
 * If given a markdown link, it breaks the components of the file_path
 * @param {*} link 
 * @returns 
 */
export function breakMDLinkToFilePathComponents(link) {
  //TODO: Add check for a link
  const markdownLinkPattern = /\[[^\[\]]+\]\([^()\s]+\)/;
  const match = markdownLinkPattern.exec(link);

  if (match) {
    const splitMarkdownLink = /\[.*?\]\(([^)]+)\)/;
    const linkBreak = splitMarkdownLink.exec(link);
    return linkBreak[1].split("/").filter((part) => part.length > 0);
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
function updateLastAndNextContact(id, date, nextContact) {
  // Validate Date
  const nextContactDate = addDaysToDate(date, nextContact)

  return new Promise((resolve, reject) => {
    var options = {
      method: "PATCH",
      url: process.env.NOCO_URL + process.env.NOCO_URL_API + process.env.NOCO_TABLE_ID + "/records",
      params: { offset: "0", fields: "Id,Name", viewId: process.env.NOCO_VIEW_ID },
      headers: {
        "xc-token": process.env.NOCO_API,
      }, 
      data: {
        "Id": id,
        "Last_Contact": date,
        "Next_Contact": nextContactDate,
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

function findPersonExistsReturnId(name, list) {
  const person = list.find((person) => person.Name === name)
  return person ? person.Id : null;
}

function findPersonExistsReturnPerson(name, list) {
  const person = list.find((person) => person.Name === name)
  return person ? person : null;
}

function addDaysToDate(dateString, num) {
  let date = new Date(dateString);
  date.setDate(date.getDate() + num);
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  let day = String(date.getDate() + 1).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}


// Function to validate date into API

// Function to convert "" -> date


