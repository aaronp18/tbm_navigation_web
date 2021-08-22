// Contains all of the constants / options

// * Main

const WEBPORT = process.env.WEBPORT || 8080; // Webserver port to run on
const ROSIP = process.env.ROSWEBIP || process.env.WSLIP || "localhost" // IP of the rosweb server

const ROSURL = `ws://${ROSIP}:9090`; // URL that is used to connect to the ROS Bridge

const AUTORECONNECT = 10000; // Interval of auto reconnect, 
const SILENTRECONNECT = true; // If true, then reconnects aren't printed to console

// * Telem

const TELEMIP = 'localhost';
const TELEMPORT = 2222;

const TELEMINTERVAL = 5000; // The delay between each telemetry send
const TELEMON = false; // Determines whether telemetry is sent
const TEAMID = 1;

// * Consumption
const AVERAGEPERIOD = 5000; // ms



export {
    WEBPORT,
    ROSIP,
    AUTORECONNECT,
    SILENTRECONNECT,
    TELEMINTERVAL,
    ROSURL,
    TELEMIP,
    TELEMPORT,
    TEAMID,
    TELEMON,
    AVERAGEPERIOD,

}