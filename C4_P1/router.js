const express = require('express');
const route = express.Router();
route.get('/', (req,res) => {
    res.status(200);
    res.send('Hello, World! in GET');
});
route.post('/', (req,res) => {
    res.status(201);
    res.send('Hello, Worls! in POST');
});

module.exports = route;