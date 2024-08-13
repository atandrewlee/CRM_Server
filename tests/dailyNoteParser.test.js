import { DropboxCommands } from "../src/util/dropbox.js";
import { DailyNoteParser, getAllRowsSelectColumns } from "../src/cron/dailyNoteParser.js";
import * as NOCO_UTIL from "../src/util/noco.js";
import { findAllMarkdownLinks, breakMDLinkToFilePathComponents } from "../src/cron/dailyNoteParser.js";
import * as axios from "axios";
import path from "path";
import dotenv from "dotenv";
import * as fs from "node:fs/promises";
import { nocoAPIGetAll, nocoAPIGetSpecificColumns, nocoAPIGetSpecificColumnsError, nocoAPIChangeLastContactNextContact } from "./data/nocoApiCalls.js";

jest.mock("../src/util/dropbox.js");
jest.mock("axios");
dotenv.config();

dropboxUploadFileMock = jest.fn();
dropboxGetFileMock = jest.fn((file) => {
    return new Promise((resolve, reject) => {
    try {
        const contents = fs.readFile(file);
        resolve(contents);
    } catch (error) {
        throw new Error();
    }
    });
});
DropboxCommands.mockImplementation(() => {
    return {
    dropboxUploadFile: dropboxUploadFileMock,
    dropboxGetFile: dropboxGetFileMock,
    };
});


describe("DailyNoteParser", () => {
  let DropboxCommandsInstance = new DropboxCommands();

  beforeEach(() => {
    // Dropbox Mock
    jest.clearAllMocks();
    DropboxCommands.mockClear();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe("Helper Functions", () => {
    describe("findAllMarkdownLinks", () => {
      it("Finds all markdown links with the format [title](link)", () => {
        const exampleLine =
          "here is some ()beginning[] text [hello](../../README.md) This is an example line.";
        const matches = findAllMarkdownLinks(exampleLine);
        expect(matches).toEqual(["[hello](../../README.md)"]);
      });
      it("Another One", () => {
        const exampleLine =
          "1a2b3c4d5e6f7;ah 89H:FSD(hf9)SUD Hf;8shdf;a9u1 [eawfds][sa3a]sa dfas;fij 99l;ao;3 [12!@2528ash3432619h$%!@e$l%l^&o*|d_=-](../../README.md) aos;dfioa;gh320r9 j;asodifh;a";
        const matches = findAllMarkdownLinks(exampleLine);
        expect(matches).toEqual([
          "[12!@2528ash3432619h$%!@e$l%l^&o*|d_=-](../../README.md)",
        ]);
      });
      // TODO: Write more tests that cover "Not Matches" & "Multiple Links" & "Random Characters"
    });
    describe("breakMDLinkToFilePathComponents", () => {
      it("Return the file path from the markdown link", () => {
        const exampleLink = "[hello-world](../../README.md)";
        const returnVal = breakMDLinkToFilePathComponents(exampleLink);
        expect(returnVal).toEqual(["..", "..", "README.md"]);
      });
      it("Should return null if there is no markdown link", () => {
        expect(breakMDLinkToFilePathComponents("[hello-world]((..))")).toEqual(
          null
        );
        expect(
          breakMDLinkToFilePathComponents("iosa;d [[]]() tex [(0])")
        ).toEqual(null);
        expect(breakMDLinkToFilePathComponents("This is a test [](()"));
        expect(
          breakMDLinkToFilePathComponents("test file link [[]() []()) []")
        );
      });
      it(`When a valid link is there but there's an extra character at the beginning 
                '[' or end ')', do not recognize but still recognize valid links right next to it`, () => {
        expect(
          breakMDLinkToFilePathComponents(`test [hello](../../README.md))[hello]
                    (../../README.md)aii3a[[anotherlink](../../README.md)world`)
        ).toEqual(["..", "..", "README.md"]);
      });
    });
  });

  describe("Calls To NocoDB API", () => {
    beforeEach(() => {
      axiosSpy = jest.spyOn(axios, "request");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe("getAllRowsSelectColumns", () => {
      it("Makes a request with no given columns (empty string) and returns all available rows & columns", async () => {
        axios.request.mockResolvedValue(nocoAPIGetAll);

        await NOCO_UTIL.getAllRowsSelectColumns("");
        expect(axiosSpy).toHaveBeenCalled();
        const options = {
          method: "GET",
          url:
            process.env.NOCO_URL +
            process.env.NOCO_URL_API +
            process.env.NOCO_TABLE_ID +
            "/records",
          params: {
            offset: "0",
            fields: "",
            viewId: process.env.NOCO_VIEW_ID,
          },
          headers: {
            "xc-token": process.env.NOCO_API,
          },
        };
        expect(axiosSpy).toHaveBeenCalledWith(options);
      });
      it("Makes a request with specific columns (columns is given a string) and returns all available rows with specific columns", async () => {
        axios.request.mockResolvedValue(nocoAPIGetSpecificColumns);
        await NOCO_UTIL.getAllRowsSelectColumns("Id,Name,Last_Contact");
        const options = {
          method: "GET",
          url:
            process.env.NOCO_URL +
            process.env.NOCO_URL_API +
            process.env.NOCO_TABLE_ID +
            "/records",
          params: {
            offset: "0",
            fields: "Id,Name,Last_Contact",
            viewId: process.env.NOCO_VIEW_ID,
          },
          headers: {
            "xc-token": process.env.NOCO_API,
          },
        };
        expect(axiosSpy).toHaveBeenCalledWith(options);
      });
      it("Makes a request with bad columns (columns is given a bad string according to NocoAPI) and returns error", async () => {
        axios.request.mockRejectedValue(new Error("Bad Request"));

        await expect(NOCO_UTIL.getAllRowsSelectColumns("Id,Hello")).rejects.toThrow("Bad Request");
      });
    });
    describe("updateLastAndNextContact", () => {
        it("makes a PATCH request to NocoDB and returns correct response", async () => {
            axios.request.mockResolvedValue(nocoAPIChangeLastContactNextContact);
            await NOCO_UTIL.updateLastAndNextContact(101, "2024-08-12", 7);
            const options = {
                method: "PATCH",
                url:
                  process.env.NOCO_URL +
                  process.env.NOCO_URL_API +
                  process.env.NOCO_TABLE_ID +
                  "/records",
                headers: {
                  "xc-token": process.env.NOCO_API,
                },
                data: {
                  Id: 101,
                  Last_Contact: "2024-08-12",
                  Next_Contact: "2024-08-19",
                },
              };
            expect(axiosSpy).toHaveBeenCalledWith(options);
        })
    })
  });

  describe("Daily Note Parser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        DropboxCommands.mockClear();
    });
    it("When a note is created, it only calls parseLine on the lines in the section", async () => {
        const forTest = new DailyNoteParser("tests/data/dailyNote-test-only-interactions.md");
        mockParseLine = jest.spyOn(forTest, 'parseLine').mockImplementation(async (line, fileName) => {
            console.log('mock');
        });
        mockLineParser = jest.spyOn(forTest, 'lineParser').mockImplementation(async (line) => {
            if (line.startsWith("# ")) {
                // Markdown Heading 1
                if (line.slice(2).trim() === process.env.CRM_SECTION_TITLE) {
                  // Enter People Heading 1
                  forTest.inSection = true;
                } else {
                  // Left People Heading 1
                  forTest.inSection = false;
                }
              }
              if (forTest.inSection) { // In Section
                try {
                  await mockParseLine(line, forTest.fileName);
                } catch (error) {
                  console.error(error);
                }
              }
        })
        await forTest.parseDailyNote();
        await new Promise(resolve => setImmediate(resolve));
        
        expect(mockParseLine).toHaveBeenCalledTimes(14);

    });

    describe("Parse Line", () => {
        // Given A Line of Text -> How many calls to updateLastAndNextContact
        beforeEach(() => {
            NOCO_UTIL.updateLastAndNextContact = jest.fn();
            NOCO_UTIL.getAllRowsSelectColumns = jest.fn().mockResolvedValue([{
                "Id": 1,
                "Name": "Example Person",
                "Last_Contact": "2024-08-10",
                "Next_Contact": null,
                "Next_Contact_Interval": 7,
            }]);
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        it("", async () => {
            const parser = new DailyNoteParser("filename.md");
            await parser.parseLine("Hello World", "filename");
            NOCO_UTIL.getAllRowsSelectColumns = jest.fn().mockResolvedValue([])
            expect(NOCO_UTIL.updateLastAndNextContact).toHaveBeenCalledTimes(0);
        })
        it("", async () => {
            const parser = new DailyNoteParser("filename.md");
            await parser.parseLine("worked with [Example Person](../../Example Person.md) and other text", "filename");
            //NOCO_UTIL.updateLastAndNextContact("","","")
            expect(NOCO_UTIL.updateLastAndNextContact).toHaveBeenCalledTimes(1);
            
        });
    });
  });
});
