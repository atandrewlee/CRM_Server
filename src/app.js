import cron from "node-cron";
import express from "express";

// cron.schedule('* * * * * *', () => {
//     console.log('run task every second');
// })

const app = express();
const port = 3000;

// Webhook Print
app.get('/', (req, res) => {
    console.log(req.data);
    res.status(200);
    res.send("Hello, World!");
})

app.post('/', (req, res) => {
    console.log(req.data)
    console.log(res.data)
    res.status(200);
    res.send("Post Request");
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
