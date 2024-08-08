// File containing all the webhooks in NocoDB

import axios from "axios";

// Example
const example_hook = {
    method: "POST",
    url: "...",
    data: {
        active: true,
        async: true,
        description: "a description",
        event: "after", // Required (after, before)
        notification, 
        operation, //Required

    }
}


// {
//     type: "URL",
//     payload: {
//         method: "POST",
//         body: {{json data}},
//         headers: [{}],
//         parameters: [{}],
//         auth: ...axios,
//         path: http://example.com
//     }
// }