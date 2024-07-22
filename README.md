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
- DROPBOX_API=<dropbox-api key>
- FILE_PATH=<file_path to my CRM files>



## How to test?



