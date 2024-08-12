import axios from "axios";


function sendNotificationToTodoist(content, due_date) {
    return new Promise((resolve, reject) => {
        var options = {
            method: "POST",
            url: process.env.TODOIST_URL + "/tasks",
            headers : {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.TODOIST_API,
            },
            data: {
                "project_id": process.env.TODOIST_PROJECT_ID,
                "content": content,
                "due_date": due_date,
                "labels": ["noco"],
            }
        }
        axios.request(options).then(function (response) {
            console.log(response.data);
            resolve(response.data);
          }).catch(function (error) {
            console.error(error);
            reject(error);
          }); 
    })
}
