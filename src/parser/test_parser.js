import * as fs from 'node:fs';
import * as readline from 'node:readline';

// fs.readFile('src/parser/test_markdown.md', 'utf8', (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log(data);
//     console.log(typeof(data))
// })

const filePath = 'src/parser/test_markdown.md'
const fileStream = fs.createReadStream(filePath);

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});


let inSection = false;
let sectionTitle = "People"
const content = [];
rl.on('line', processLine)

function findAllMarkdownLinks(text) {
    const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = text.match(markdownLinkPattern);
    return matches || [];
}

function getFilePathFromLink(link) {
    const markdownLinkPattern = /\[.*?\]\(([^)]+)\)/;
    const match = markdownLinkPattern.exec(link);

    if (match) {
        return match[1].split('/').filter(part => part.length > 0);
    } else {
        return null; // Return null if no match is found
    }
}

function processLine(line) {
    if (line.startsWith('# ')) { // Markdown Heading 1
        if (line.slice(2).trim() === sectionTitle) { // Enter People Heading 1
            inSection = true;
        } else { // Left People Heading 1
            inSection = false;
        }
    }
    if (inSection) { // In Section
        const links = findAllMarkdownLinks(line);
        links.forEach(link => {
            linkParts = getFilePathFromLink(link);
            linkFile = linkParts[linkParts.length - 1];
            linkPath = linkParts[linkParts.length - 2];
            // Check if the link is within CRM
            // If it is ... Need to update the database
            // NocoDB API (Name, Date, Column)



        });
    }



}


rl.on('line', (line) => {
    console.log(`Line from file: ${line}`);
})

rl.on('close', () => {
    console.log('File reading completed.');
});



/*
Note on File Structure:
- /
    - /crm
    - /plans/daily


*/
/* What Other Work To Do
- When link found in the daily note, parse the CRM
- Function To Wrap Everything (given file)

- Whole Function to do this for every file
    - 



- Automated call to a 

*/