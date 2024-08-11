export const STARTING_CRM_PAGE_TEMPLATE = `---

---
`
export const dropboxConfig = {
    clientId: process.env.DROPBOX_APP_KEY,
    clientSecret: process.env.DROPBOX_APP_SECRET,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
};
export const redirectUri = `${process.env.HOST}/auth`;