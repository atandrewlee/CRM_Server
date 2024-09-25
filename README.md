# CRM_Server
This project is a backend server for my personal CRM.

> Refer to my [post](https://andrewleeofficial.com/projects/crm_project) for a more general overview about this project + the whole system.
> - I want to potentially write a detailed overview of the whole system in a blog post (but that's for another day).
> NOTE: This is still a work-in-progress. Hopefully there will come a point where it's developed enough where I don't have to be actively building/tinkering with it.



## How to deploy?
There are multiple ways to deploy. A few of them are
1. Build & Deploy the provided Docker Container (make adjustments as necessary)
2. Run directly using `npm run start`

A Few Considerations
1. Environment variables: .env file, "Cloud Provider" (AWS,GCP,Azure) method of handling secrets/env-variables
2. `npm run start` uses a `.env` file. If you have another way of loading env variables, use `npm run start-no-env`


### What environment variables do you need
- CRM_FILE_PATH= File path to the CRM directory
  - POSIX Format
  - Root: Dropbox Root
  - Example: `/directory/crm_files
  - NOTE: Prefix + Postfix with "/"
- DAILY_NOTE_PATH= File path to the daily notes directory
  - POSIX Format
  - Root: Dropbox Root
  - Example: `/directory/daily_notes/
  - NOTE: Prefix + Postfix with "/"


- NOCO_API= Noco API key [docs](https://docs.nocodb.com/account-settings/api-tokens) about API tokens in NocoDB.
- NOCO_URL= Noco URL to your self hosted or cloud run instance
- NOCO_URL_API = Noco URL to the API
  - Set it to `/api/v2/tables`
- NOCO_TABLE_ID= The table to interact with (the CRM database)
  - NOTE: need leading `/`
  - Example: `/idu0h0s0919h` (I chose random characters)
- NOCO_VIEW_ID= A specific view to interact with
  - NOTE: no leading or trailing `/`
  - Example: 93oad8f0adhaf (I chose random characters)

- TODOIST_API= Todoist API Key [docs](https://developer.todoist.com/rest/v2/#authorization) about API tokens in Todoist.
- TODOIST_PROJECT_ID= The Todoist project to put all of the created tasks in
- TODOIST_URL=This is the base URL for Todoist API
  - Set it to `https://api.todoist.com/rest/v2`

- DROPBOX_APP_KEY ((Not Needed)) To produce DROPBOX_REFRESH_TOKEN
- DROPBOX_APP_SECRET ((Not Needed)) To produce DROPBOX_REFRESH_TOKEN
- DROPBOX_REFRESH_TOKEN
  - Refer to [Link](https://www.codemzy.com/blog/dropbox-long-lived-access-refresh-token) for information

- GCP_PROJECT_ID= For GCP Logging
- GCP_LOG_NAME= Log Name for GCP Logging

### My Current Deployment
- Every new commit to `main` -> build new Docker Container
- I then launch the new container in GCP Cloud Run (environment variables are set through the GUI)

> FUTURE: Want a better way to handle secrets + continuous deployment


## How to test?

There is a directory called `/tests` that contain all the tests for the code.
To run the tests, run `npm run test` which launches the jest testing suite.