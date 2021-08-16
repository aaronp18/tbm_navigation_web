
import express from "express";
import winston from 'winston';

const store = require("./store")
const { sendTelem, getTelem } = require("./sendPackets")

const { webLogger, rosLogger } = require("./logger");

import path from 'path';
import ROSLIB from "roslib";


const app = express();
const PORT = 8080; // default PORT to listen
const IP = process.env.ROSWEBIP || "localhost" // IP of the rosweb server



// * Logging


// * Initiate ROS
// * Initial ROS start

rosLogger.info("Connecting to ROS server...")

const rosURL = `ws://${IP}:9090`;
let isReconnecting = false;

var ros = new ROSLIB.Ros({
    url: rosURL,
});

ros.on('connection', function () {
    rosLogger.info('Connected to websocket server.');
    store.initPublishers(ros);
    store.initListeners(ros);

    setInterval(() => {
        // Get relavent telem
        var telem = getTelem();
        // Send telem
        sendTelem(telem);
    }, 5000);


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
        rosLogger.info(" == Retrying connection to " + rosURL)
        ros.connect(rosURL)
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
app.listen(PORT, () => {
    webLogger.info(`Server started at http://${IP}:${PORT}`);
});