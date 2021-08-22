
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
SILENT_RECONNECT: ${options.SILENT_RECONNECT}
AUTO_RECONNECTINTERVAL: ${options.AUTO_RECONNECT_INTERVAL}

- TELEM -
TEAMID: ${options.TEAM_ID}
TELEM_ON: ${options.TELEM_ON}
TELEM_INTERVAL: ${options.TELEM_INTERVAL}
 ==============
`;

rosLogger.info(startupText);

rosLogger.info("Connecting to ROS server...")


let isReconnecting = false;

var ros = new ROSLIB.Ros({
    url: options.ROS_URL,
});

ros.on('connection', function () {
    rosLogger.info('Connected to websocket server.');
    store.initPublishers(ros);
    store.initListeners(ros);

    setInterval(() => {
        //If telemetry is off, pass;
        if (!options.TELEM_ON)
            return;
        // Get relavent telem
        var telem = getTelem();
        // Send telem
        sendTelem(telem);
    }, options.TELEM_INTERVAL);


});

ros.on('error', function (e) {
    // Only print if silent reconnect is off

    if (!options.SILENT_RECONNECT || e.error.code != "ECONNREFUSED")
        rosLogger.error(e);
});

ros.on('close', function () {
    if (!options.SILENT_RECONNECT)
        rosLogger.info('Connection to websocket server closed. Waiting before retrying...');

    // Retry connect on close every 5 seconds
    if (isReconnecting)
        return;

    isReconnecting = true;
    let reconnectID = setInterval(() => {
        if (!options.SILENT_RECONNECT)
            rosLogger.info(" == Retrying connection to " + options.ROS_URL)
        ros.connect(options.ROS_URL)
        ros.on("connection", () => {
            // Kill reconnect interval
            clearInterval(reconnectID);
            isReconnecting = false;

            if (!options.SILENT_RECONNECT)
                rosLogger.info("Killed reconnect");
        })
    }, options.AUTO_RECONNECT_INTERVAL);
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
app.listen(options.WEB_PORT, () => {
    webLogger.info(`Server started at http://${options.ROS_IP}:${options.WEB_PORT}`);
});