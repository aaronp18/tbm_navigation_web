
import express from "express";
import winston from 'winston';

import * as store from "./rosRoutes";

import * as options from './options'

import { sendTelem, getTelem } from "./sendPackets";

import { webLogger, rosLogger } from "./logger";

import path from 'path';
import ROSLIB from "roslib";


const app = express();





// * Logging


// * Initiate ROS
// * Initial ROS start

rosLogger.info("Connecting to ROS server...")


let isReconnecting = false;

var ros = new ROSLIB.Ros({
    url: options.ROSURL,
});

ros.on('connection', function () {
    rosLogger.info('Connected to websocket server.');
    store.initPublishers(ros);
    store.initListeners(ros);

    setInterval(() => {
        //If telemetry is off, pass;
        if (!options.TELEMON)
            return;
        // Get relavent telem
        var telem = getTelem();
        // Send telem
        sendTelem(telem);
    }, options.TELEMINTERVAL);


});

ros.on('error', function (error) {
    rosLogger.error(error);
});

ros.on('close', function () {
    rosLogger.info('Connection to websocket server closed. Waiting before retrying...');

    // Retry connect on close every 5 seconds
    if (isReconnecting)
        return;

    isReconnecting = true;
    let reconnectID = setInterval(() => {
        rosLogger.info(" == Retrying connection to " + options.ROSURL)
        ros.connect(options.ROSURL)
        ros.on("connection", () => {
            // Kill reconnect interval
            clearInterval(reconnectID);
            isReconnecting = false;
            rosLogger.info("Killed reconnect");
        })
    }, 10000);
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
app.listen(options.WEBPORT, () => {
    webLogger.info(`Server started at http://${options.ROSIP}:${options.WEBPORT}`);
});