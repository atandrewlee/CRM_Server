import { Logging } from "@google-cloud/logging";



export async function writeLog(message) {
    const projectId = process.env.GCP_PROJECT_ID;
    const logName = process.env.GCP_LOG_NAME;
    
    const logging = new Logging({projectId});
    const log = logging.log(logName);

    const metadata = {
        resource: {type: 'global'},
        // See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
        severity: 'INFO',
      };
    
      const entry = log.entry(metadata, message);

      await log.write(entry)
      console.log(message)
}
