// Contains all of the constants / options

// * Main

const WEB_PORT = process.env.WEB_PORT || 3000; // Webserver port to run on
const ROS_IP = process.env.ROSWEBIP || process.env.WSLIP || "localhost" // IP of the rosweb server

const ROS_URL = `ws://${ROS_IP}:9090`; // URL that is used to connect to the ROS Bridge

const AUTO_RECONNECT_INTERVAL = 10000; // Interval of auto reconnect, 
const SILENT_RECONNECT = true; // If true, then reconnects aren't printed to console

// * Telem

const TELEM_IP = 'localhost';
const TELEM_PORT = 2222;

const TELEM_INTERVAL = 5000; // The delay between each telemetry send
const TELEM_ON = false; // Determines whether telemetry is sent
const TEAM_ID = 1;

// * Consumption
const AVERAGE_PERIOD = 5000; // ms
// Number of consumption points to keep before pruning. This needs to be large enough to allow for all points in
// average period to be considered
const CONSUMPTION_CACHE_SIZE = 5000;


export {
    WEB_PORT,
    ROS_IP,
    AUTO_RECONNECT_INTERVAL,
    SILENT_RECONNECT,
    TELEM_INTERVAL,
    ROS_URL,
    TELEM_IP,
    TELEM_PORT,
    TEAM_ID,
    TELEM_ON,
    AVERAGE_PERIOD,
    CONSUMPTION_CACHE_SIZE,
}