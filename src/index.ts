
import express from "express";
import winston from 'winston';


const store = require("./store")
const { webLogger, rosLogger } = require("./logger");

import path from 'path';
import ROSLIB from "roslib";


const app = express();
const PORT = 8080; // default PORT to listen

// * Logging


// * Initatie ROS
// * Intial ROS start

rosLogger.info("Connecting to ROS server...")

var ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090' // Change to localhost on prod
});

ros.on('connection', function () {
    rosLogger.info('Connected to websocket server.');
    store.initPublishers(ros);

});

ros.on('error', function (error) {
    rosLogger.error('Error connecting to websocket server: ');
    rosLogger.error(error);
});

ros.on('close', function () {
    rosLogger.info('Connection to websocket server closed.');
});


// * Express Init

//Sets view engine to ejs
app.set("view engine", "ejs");
//Sets public folder
app.use(express.static("public"));

// * Routes
var apiRoute = require("./api");

app.use("/api", apiRoute);


// define a route handler for the default home page
app.get("/", (req, res) => {
    // res.render("main");
    res.sendFile(path.join(__dirname, '/../public/test.html'));

});

// start the Express server
app.listen(PORT, () => {
    webLogger.info(`Server started at http://localhost:${PORT}`);
});