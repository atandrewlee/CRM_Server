/*
Parses Daily Note To Update Last-Contacted

*/
import * as readline from "node:readline";
import axios from "axios";
import { Readable } from "stream";
import path from "path";
import { DropboxCommands } from "../util/dropbox.js";
import { updateLastAndNextContact, getAllRowsSelectColumns } from "../util/noco.js";

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
    this.fileName = path.basename(this.file);
  }

  /**
   * Top-Level Function to parse through a daily note
   *
   * Looks only in the section for the CRM
   * Looks through each line for links. If it finds any backlinks to people in the CRM, updates last-contacted
   *
   * @param {*} filePath
   */
  async parseDailyNote() {
    const dbx = new DropboxCommands();

    try {
      const fileBinary = await dbx.dropboxGetFile(this.file);

      const binaryStream = new Readable();
      binaryStream._read = () => {};
      binaryStream.push(fileBinary);

      const rl = readline.createInterface({
        input: binaryStream,
        crlfDelay: Infinity,
      });

      rl.on("line", async (line) => {
        try {
          await this.lineParser(line);
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async lineParser(line) {
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
    if (this.inSection) { // In Section
      try {
        await this.parseLine(line, this.fileName);
      } catch (error) {
        console.error(error);
      }
    }
  }

  parseLine(line, fileName) {
    const links = findAllMarkdownLinks(line);
    const promises = links.map(async (link) => {
      let linkParts = breakMDLinkToFilePathComponents(link);
      if (linkParts === null) {
        return;
      }
      let linkName = linkParts[linkParts.length - 1];
      let personName = decodeURIComponent(linkName).replace(".md", "");

      // COMMENT: Don't check the `/crm/...` yet because we don't have things standardized with links in Obsidian
      //let linkPath = linkParts[linkParts.length - 2];

      try {
        const listOfNames = await getAllRowsSelectColumns("Id,Name,Last_Contact,Next_Contact,Next_Contact_Interval")
        const foundPerson = findPersonExistsReturnPerson(personName, listOfNames);
        if (foundPerson !== null) {
          const date = fileName.replace(".md", ""); // TODO: Check the fileName
          try {
            await updateLastAndNextContact(
              foundPerson.Id,
              date,
              foundPerson.Next_Contact_Interval
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch(error) {
        console.error(error);
        return;
      }
    });
    return Promise.all(promises)
  }

}






function findPersonExistsReturnPerson(name, list) {
  const person = list.find((person) => person.Name === name);
  return person ? person : null;
}

// Text Utilities
export function findAllMarkdownLinks(text) {
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = text.match(markdownLinkPattern);
  return matches || [];
}


// Text Utilities
/**
 * If given a markdown link, it breaks the components of the file_path
 * @param {*} link
 * @returns
 */
export function breakMDLinkToFilePathComponents(link) {
  //TODO: Add check for a link
  const markdownLinkPattern = /\[([^\[\]]+)\]\(([^()]+)\)/;
  const match = markdownLinkPattern.exec(link);

  if (match) {
    const splitMarkdownLink = /\[.*?\]\(([^)]+)\)/;
    const linkBreak = splitMarkdownLink.exec(link);
    return linkBreak[1].split("/").filter((part) => part.length > 0);
  } else {
    return null;
  }
}

// Function to validate date into API

// Function to convert "" -> date
