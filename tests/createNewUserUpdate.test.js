import { DropboxCommands } from "../src/util/dropbox.js"
import { createNewUserInsert, createNewUserUpdate } from "../src/listener/createFileFromNewPerson"
import { userCreateInsert, userCreateUpdate } from "./test-constants.js";
import dotenv from 'dotenv';
import { STARTING_CRM_PAGE_TEMPLATE } from "../src/util/constants.js";

jest.mock("../src/util/dropbox.js")
dotenv.config();
  
describe('Create a new person in the CRM', () => { 
    let DropboxCommandsInstance = new DropboxCommands();

    beforeEach(() => {
        DropboxCommands.mockClear();

        dropboxUploadFileMock = jest.fn().mockResolvedValue({ success: true });
        DropboxCommands.mockImplementation(() => {
            return {
                dropboxUploadFile: dropboxUploadFileMock,
            };
        });
    });
    afterEach(() => {
    });
    afterAll(() => {
    });
    describe("From Update", () => {
        it("Sends the correct information to the dropboxUploadFile function", () => {
            createNewUserUpdate(userCreateUpdate, "");
            // expect(DropboxCommandsInstance.dropboxGetFile).toHaveBeenCalled();
            expect(dropboxUploadFileMock).toHaveBeenCalled();
            expect(dropboxUploadFileMock).toHaveBeenCalledWith(process.env.CRM_FILE_PATH + "Coraline.md", STARTING_CRM_PAGE_TEMPLATE)
        })
    describe("From Insert", () => {
        it("Sends the correct information to the dropboxUploadFile function", () => {
            createNewUserInsert(userCreateInsert, "");
            expect(dropboxUploadFileMock).toHaveBeenCalled();
            expect(dropboxUploadFileMock).toHaveBeenCalledWith(process.env.CRM_FILE_PATH + "Sample Text.md", STARTING_CRM_PAGE_TEMPLATE)
        })
    })
    })
});