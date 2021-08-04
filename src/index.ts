
import express from "express";
import winston from 'winston';

const app = express();
const PORT = 8080; // default PORT to listen

// * Logging

const { createLogger, format, transports } = winston;

const winstonFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// Logger for the WEB component
const webLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'WEB' }),
        winston.format.timestamp(),
        winstonFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log.log' })
    ]
});
// Logger for the ROS component
const rosLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'ROS' }),
        winston.format.timestamp(),
        winstonFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log.log' })
    ]
});

// * Express Init

//Sets view engine to ejs
app.set("view engine", "ejs");
//Sets public folder
app.use(express.static("public"));

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.render("main")

});

// start the Express server
app.listen(PORT, () => {
    webLogger.info(`Server started at http://localhost:${PORT}`);
});