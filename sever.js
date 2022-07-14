const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + '/pub'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// setting up path for html pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./pub/index.html"))
})