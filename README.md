# CRM_Server
This is a web server & job runner for my personal CRM.



## Tech Stack
- Database: PostgreSQL server on a [Vultr](https://www.vultr.com/) instance.
  - (07/11/24) It is on a Vultr cloud instance. I'm considering moving it to my local HomeLab if it makes sense.
- Database UI: [NocoDB](https://www.nocodb.com/)
  - TLDR >> Open-Source, Self-Hosted Notion/Airtable alternative that can be run on your own database (SQLite, Postgres)
  - This allows me the flexibility, control, & freedom of hosting my own PostgreSQL database with the convienence of a nice UI with extra features.
- Server: Node.js


## How to deploy?
- DockerFile
- .env file

### What environment variables do you need?
- FILE_PATH= File Path to the CRM directory
  - POSIX Format
  - Root: Dropbox Root
  - Example: `/directory/crm_files
- NOCO_API= Noco API key [docs](https://docs.nocodb.com/account-settings/api-tokens) about API tokens in NocoDB.
- TODOIST_API= Todoist API Key [docs](https://developer.todoist.com/rest/v2/#authorization) about API tokens in Todoist.

- DROPBOX_APP_KEY
- DROPBOX_APP_SECRET
- DROPBOX_REFRESH_TOKEN
  - Refer to [Link](https://www.codemzy.com/blog/dropbox-long-lived-access-refresh-token) for information



## How to test?

There is a directory called `/tests` that contain all the tests for the code.
To run the tests, run `npm run test` which launches the jest testing suite.

