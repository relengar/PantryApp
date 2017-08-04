const express = require('express');
    morgan = require('morgan');
    async = require('async');
    db = require('./db');

const bodyParser = require('body-parser')
const _port = 8080;
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/pantryFront"));
app.set("title", "Pantry");

require("./routes")(app);

console.log('starting server');
app.listen(_port);
