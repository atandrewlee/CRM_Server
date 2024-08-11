import { DropboxCommands } from "../src/util/dropbox.js";
import { findAllMarkdownLinks, breakMDLinkToFilePathComponents } from "../src/cron/dailyNoteParser.js";
import dotenv from "dotenv";


jest.mock("../src/util/dropbox.js")
dotenv.config();


describe('DailyNoteParser', () => {
    let DropboxCommandsInstance = new DropboxCommands();
    beforeEach(() => {
        DropboxCommands.mockClear();

        dropboxUploadFileMock = jest.fn()
        DropboxCommands.mockImplementation(() => {
            return {
                dropboxUploadFile: dropboxUploadFileMock,
            }
        })
    })
    describe("Helper Functions", () => {
        describe("findAllMarkdownLinks", () => {
            it("Finds all markdown links with the format [title](link)", () => {
                const exampleLine = "here is some ()beginning[] text [hello](../../README.md) This is an example line."
                const matches = findAllMarkdownLinks(exampleLine);
                expect(matches).toEqual(["[hello](../../README.md)"]);
            });
            it("Another One", () => {
                const exampleLine = "1a2b3c4d5e6f7;ah 89H:FSD(hf9)SUD Hf;8shdf;a9u1 [eawfds][sa3a]sa dfas;fij 99l;ao;3 [12!@2528ash3432619h$%!@e$l%l^&o*\|d_=-](../../README.md) aos;dfioa;gh320r9 j;asodifh;a"
                const matches = findAllMarkdownLinks(exampleLine);
                expect(matches).toEqual(["[12!@2528ash3432619h$%!@e$l%l^&o*\|d_=-](../../README.md)"])
            })
            // TODO: Write more tests that cover "Not Matches" & "Multiple Links" & "Random Characters"
        })
        describe("getFilePathFromLink", () => {
            it("Return the file path from the markdown link", () => {
                const exampleLink = "[hello-world](../../README.md)"
                const returnVal = breakMDLinkToFilePathComponents(exampleLink);
                expect(returnVal).toEqual(["..", "..", "README.md"]);
            })
            it("Should return null if there is no markdown link", () => {
                expect(breakMDLinkToFilePathComponents("[hello-world]((..))")).toEqual(null);



            })
        })
    })


})