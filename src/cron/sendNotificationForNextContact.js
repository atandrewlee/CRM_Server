import axios from "axios";
import { getAllRowsSelectColumns, addDaysToDate } from "./dailyNoteParser.js";


export function remindOfNextContact() {
    const people = getAllRowsSelectColumns("Id,Name,Next_Contact");

}

function getPeopleToRemind(listOfPeople) {
    let today = new Date().toISOString().split('T')[0]
    const dateToCheck = addDaysToDate(today, 7);

    const criteria = person => person.Next_Contact === dateToCheck;
    listOfPeople.filter(criteria)
    listOfPeople.forEach((person) => {
        sendNotificationToTodoist(person.Name, person.Next_Contact)
    })

}




export function sendNotificationToTodoist(content, due_date) {
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

console.log(getPeopleToRemind([]));