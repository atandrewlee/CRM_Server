import axios from "axios";
import { getAllRowsSelectColumns, addDaysToDate } from "../util/noco.js";

export async function remindOfNextContact() {
    const people = await getAllRowsSelectColumns("Id,Name,Next_Contact");
    getPeopleToRemind(people);
}

async function getPeopleToRemind(listOfPeople) {
    let today = new Date().toISOString().split('T')[0]
    const dateToCheck = addDaysToDate(today, 7);
    listOfPeople = listOfPeople.filter(person => person.Next_Contact === dateToCheck);
    listOfPeople.forEach(async (person) => {
        await sendNotificationToTodoist(person.Name, person.Next_Contact)
    })

}



export async function sendNotificationToTodoist(content, due_date) {
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
                "content": "Reach out to : " + content,
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
