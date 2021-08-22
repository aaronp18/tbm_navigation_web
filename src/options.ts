// Contains all of the constants / options

// * Main

const WEBPORT = process.env.WEBPORT || 8080; // Webserver port to run on
const ROSIP = process.env.ROSWEBIP || "localhost" // IP of the rosweb server



const ROSURL = `ws://${ROSIP}:9090`; // URL that is used to connect to the ROS Bridge

// * Telem

const TELEMIP = 'localhost';
const TELEMPORT = 2222;

const TELEMINTERVAL = 5000; // The delay between each telemetry send
const TELEMON = false; // Determines whether telemetry is sent
const TEAMID = 1;



export {
    WEBPORT,
    ROSIP,
    TELEMINTERVAL,
    ROSURL,
    TELEMIP,
    TELEMPORT,
    TEAMID,
    TELEMON,

}