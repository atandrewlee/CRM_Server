# CRM_Server
This project is a backend server for my personal CRM.


- Documentation about my system is located in the `/docs` directory. These docs are mainly for myself.


## Current Status
- I'm still deciding many of the protocols, systems, and needs for my CRM. Information about these decisions are located in the `/docs` directory.

- Server is deployed onto a GCP Cloud Run instance.
- Look at [tech stack](#tech-stack) for information about what the whole CRM system is (with this server)



Refer to [my setup](./docs/how-to-use/MySetup.md) for reference as to how this code works for me.







## Tech Stack
The CRM contains multiple parts (of which this server is one of them).

### Backend
> Look in package.json

- Node.js
- Javascript

### Non-Backend

- Text Editor/Notes Application: [Obsidian](https://www.obsidian.md)
- Files: [Markdown](https://www.markdownguide.org/) files

### External APIs
- Dropbox: My file 
- Todoist: My note-taking application


### Future Tech Stack Enhancements
(as of 08/10/24) 

- Terminal Tools: Vim, Scripts, CLI Tools





## How to deploy?
- DockerFile
- .env file


### What environment variables do you need
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

