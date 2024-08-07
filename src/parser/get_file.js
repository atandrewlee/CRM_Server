import { dbx } from "../app.js";
import * as fs from "node:fs";
import * as readline from "node:readline";
import { Readable } from 'stream';

function dropbox_get_daily_note(title) {
  return dbx
    .filesDownload({ path: title })
    .then((response) => response.result.fileBinary)
    .catch((error) => {
      console.error(error);
    });
}
/*
.then((response) => {
        fs.createReadStream(response.result.fileBinary, { encoding: 'utf8'});
        
        const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
        });
        rl.on('line', (line) => {
            console.log(`Line from file: ${line}`);
        })
    }).catch((error) => {
        console.error(error);
    })


*/

dropbox_get_daily_note('/ionia/plans/daily/2024-08-07.md').then((fileBinary) => {
  try {
    console.log("1");
    const binaryStream = new Readable();
    binaryStream._read = () => {};
    binaryStream.push(fileBinary)

    const rl = readline.createInterface({
        input: binaryStream,
        crlfDelay: Infinity,}
    )
    rl.on('line', (line) => {
        console.log(`Line from file: ${line}`)
    })

    // binaryStream.on('data', (chunk) => {
    //     console.log('Received data:', chunk.toString('utf8'));
    // })

    //const fileStream = fs.createReadStream(fileBinary, { encoding: "utf8" });
    // console.log("2");
    // const rl = readline.createInterface({
    //   input: fileBinary,
    //   crlfDelay: Infinity,
    // });

  } catch (err) {
    console.log("4")
    console.error(err);
    console.log('6')
  }
});

// const binaryStream = new Readable();
// binaryStream._read = () => {};
// binaryStream.push(fileBinary)
// const fileStream = fs.createReadStream(binaryStream);
// const rl = readline.createInterface({
//   input: fileStream,
//   crlfDelay: Infinity,
// });
// rl.on('line', (line) => {
//     console.log(`Line from file: ${line}`);
// })