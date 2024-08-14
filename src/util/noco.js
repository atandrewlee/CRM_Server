import axios from "axios";

/**
 * Sends request to change Last Contact & Next Contact
 * @argument id: id of the row
 * @argument date: date in "YYYY-MM-DD" format
 * @argument nextContactAdj {integer}: number of days to adjust
 */
export async function updateLastAndNextContact(id, date, nextContactAdj) {
  // Validate Date
  const nextContactDate = addDaysToDate(date, nextContactAdj);

  return new Promise((resolve, reject) => {
    var options = {
      method: "PATCH",
      url:
        process.env.NOCO_URL +
        process.env.NOCO_URL_API +
        process.env.NOCO_TABLE_ID +
        "/records",
      headers: {
        "xc-token": process.env.NOCO_API,
      },
      data: {
        Id: id,
        Last_Contact: date,
        Next_Contact: nextContactDate,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export function addDaysToDate(dateString, num) {
  let date = new Date(dateString);
  date.setDate(date.getDate() + num);
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  let day = String(date.getDate() + 1).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function getAllRowsSelectColumns(columns) {
  return new Promise((resolve, reject) => {
    let res = [];
    var options = {
      method: "GET",
      url:
        process.env.NOCO_URL +
        process.env.NOCO_URL_API +
        process.env.NOCO_TABLE_ID +
        "/records",
      params: {
        offset: "0",
        fields: columns,
        viewId: process.env.NOCO_VIEW_ID,
      },
      headers: {
        "xc-token": process.env.NOCO_API,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        response.data.list.forEach((row) => {
          res.push(row);
        });
        resolve(res);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
