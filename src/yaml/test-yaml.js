import yaml from 'js-yaml';

const str = `Tier: "t1"
Last-Contact: "2024-08-07"`

const params = {
    name: "John Doe",
    age: 30,
    job: "Developer",
    skills: ["JavaScript", "Node.js", "React"],
    address: {
      street: "123 Main St",
      city: "Hometown",
      zip: "12345"
    }
  };

const doc = yaml.load(str)


const yamlStr = yaml.dump(params)
console.log(yamlStr)



// const jsonObject = {
//     "Id": 3,
//     "Name": "Ethan Lee",
//     "CreatedAt": "2024-07-09 19:28:21+00:00",
//     "UpdatedAt": "2024-08-07 23:59:25+00:00",
//     "URL": null,
//     "Linkedin": null,
//     "Email": null,
//     "Phone": null,
//     "Last_Contact": null,
//     "Company": 0,
//     "Tags": null,
//     "Birthday": null,
//     "relationship": "family",
//     "Markdown_File": null,
//     "Instagram": null,
//     "Twitter": null,
//     "Location": null,
//     "Connection": 0,
//     "interests": ["golf", "test"],
//     "Next_Contact": null,
//     "Tier": null,
//     "Company-Title": []
//   }
// const yamlStr = yaml.dump(jsonObject)
// console.log(yamlStr)
