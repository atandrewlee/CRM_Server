import { TodoistApi } from "@doist/todoist-api-typescript";



// 1. Call the information from the database and ensure it is in the correct format
// 2. Process The Data To Know What To Ping
// 3. Ping Todoist


/*
// Function "Get From NocoDB"
    // Why Separate Function?: To be able to mock the response
    // During testing, we have to assume that API will give us the response

    - Parameters
        - column: what column to query (goes into fields)
        - query: where statement
    - Things To Validate
        - 



    - Logic
        - Setup call to API
        - https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-list 
            - Query Parameters
                - Fields
                - Sort (Most Recent Date)
                - Where (Only Date)
                - Limit
                - viewID
    - What To Remember
        - await
        - error handling
*/


/*
// Function To Validate & Check Every Field





*/
function create_date_reminder() {
    // nocodb(birthday, "lq", "week")

    // convert response into a list

    // call todoist api




};





/*
function to call POST to Todoist





*/
function create_task(dueString, taskTitle) {
    const api = new TodoistApi(process.env.TODOIST_API);

    api.addTask(
        {
            content: "",
            projectID: process.env.TODOIST_PROJECT_ID,
            due_date: "",
            due_string: ""
        }
    ).then((task) => {
        // Completed
    }).catch((error) => {
        // Error
    })
}

