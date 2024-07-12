// Call API from NocoDB
// Check Dates
// Anyone within 1 week, create task in Todoist

// Fields: Name, Birthday
import axios from "axios";
import 'dotenv/config';

console.log(process.env.NOCO_API);

const options = {
  method: 'GET',
  url: 'http://noco.andrewleeofficial.com/api/v2/tables/m87s2ylc5jc3r34/records',
  params: {offset: '0', limit: '25', where: '', viewId: 'vwe4ecbjvasdfbzj', fields: 'Name,Birthday'},
  headers: {
    'xc-token': process.env.NOCO_API
  }
};

//const getData = async () => {
//  const response = await axios.request(options);
//  console.log(response);
//}


async function getUser() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

await getUser();


// Whole File .env variables
// URL Link to API ("http://noco.andrewleeofficial.com")
// table_id


async function sendReminderOnDate() {
  // Args: Column Name, Interval, etc.

  // 1. Get all people from the CRM
  // 

}
