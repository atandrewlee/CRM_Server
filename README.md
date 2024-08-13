# CRM_Server
This project is a backend server for my personal CRM.

> Refer to my [post](https://andrewleeofficial.com/projects/crm_project) for a more general overview about this project + the whole system.
> - I want to potentially write a detailed overview of the whole system in a blog post (but that's for another day).

- Documentation about my system is located in the `/docs` directory. These docs are mainly for myself.


## Current Status
- I'm still deciding many of the protocols, systems, and needs for my CRM. Information about these decisions are located in the `/docs` directory.

- Server is deployed onto a GCP Cloud Run instance.
- Look at [tech stack](#tech-stack) for information about what the whole CRM system is (with this server)



Refer to [my setup](./docs/how-to-use/MySetup.md) for reference as to how this code works for me.



## How to deploy?
Components
1. DockerFile
2. Way to add environment variables: .env file, "Cloud Provider" (AWS,GCP,Azure) method of handling secrets/env-variables

How To Build?
1. 


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



## How to test?
All tests are located in `tests`.
1. `npm install`
2. `npm run test`