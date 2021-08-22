
import express from "express";
import winston from 'winston';

import * as store from "./rosRoutes";

import * as options from './options'

import { sendTelem, getTelem } from "./sendPackets";

import { webLogger, rosLogger } from "./logger";

import path from 'path';
import ROSLIB from "roslib";


const app = express();

// * Initiate ROS
// * Initial ROS start
let startupText = ` \n === Options ===
- ROS -
SILENTRECONNECT: ${options.SILENTRECONNECT}
AUTORECONNECTINTERVAL: ${options.AUTORECONNECT}

- TELEM -
TEAMID: ${options.TEAMID}
TELEMON: ${options.TELEMON}
TELEMINTERVAL: ${options.TELEMINTERVAL}
 ==============
`;

rosLogger.info(startupText);

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

ros.on('error', function (e) {
    // Only print if silent reconnect is off

    if (!options.SILENTRECONNECT || e.error.code != "ECONNREFUSED")
        rosLogger.error(e);
});

ros.on('close', function () {
    if (!options.SILENTRECONNECT)
        rosLogger.info('Connection to websocket server closed. Waiting before retrying...');

    // Retry connect on close every 5 seconds
    if (isReconnecting)
        return;

    isReconnecting = true;
    let reconnectID = setInterval(() => {
        if (!options.SILENTRECONNECT)
            rosLogger.info(" == Retrying connection to " + options.ROSURL)
        ros.connect(options.ROSURL)
        ros.on("connection", () => {
            // Kill reconnect interval
            clearInterval(reconnectID);
            isReconnecting = false;

            if (!options.SILENTRECONNECT)
                rosLogger.info("Killed reconnect");
        })
    }, options.AUTORECONNECT);
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