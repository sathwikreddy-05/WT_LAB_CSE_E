const express = require('express');
//import module to parse JSON data
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Move this above the router middleware
const router = require('./route/bookRoute');
app.use('/books', router);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});