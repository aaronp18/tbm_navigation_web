import protobuf from "protobufjs";

let { webLogger, rosLogger, telemLogger } = require("./logger");

import udp from "dgram"
var client = udp.createSocket('udp4');

// Connection details for the boring
const TELEMIP = 'localhost';
const TELEMPORT = 2222;

// Telemetry Type
type TelemJS = {
    cutterheadSpeed: number,  // RPM
    cutterheadTorque: number, // ft x lb
    totalThrust: number,      // N
    pitch: number,            // Radians
    distanceTravelled: Progress, // rate: mm / s, total: m
    energyConsumption: Progress, // rate: kW, total: kWh
    waterConsumption: Progress, // rate: L/s, total: L
    on: boolean, // true if the machine is powered up, false otherwise
    latitude: number,
    longitude: number,
    depth: number, // depth below the surface in meters
    heading: number,
}
type Progress = {
    rate: number,
    total: number,
}
type TelemMessage = {
    teamCode: number,
    unixTimestamp: number, // Floating point unix timestamp
    telem: TelemJS,
}

// Sends the given telem message
function sendTelem(telem: TelemMessage) {
    // Loads the format
    protobuf.load("./src/telem.proto")
        .then(function (root) {
            // Obtain a message type
            var TelemMsg = root.lookupType("tbc.TelemMessage");

            // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
            var errMsg = TelemMsg.verify(telem);
            if (errMsg) {
                telemLogger.error(errMsg);
                throw Error(errMsg);
            }

            // Create a new message
            var message = TelemMsg.create(telem);

            // Encode a message to an Uint8Array (browser) or Buffer (node)
            var buffer = TelemMsg.encode(message).finish();

            //Sending msg
            client.send(buffer, TELEMPORT, TELEMIP, function (error) {
                if (error) {
                    telemLogger.error("TELEM ERROR!!! - " + error);
                    client.close();
                } else {
                    // console.log('Data sent !!!');
                }
            });


        }).catch((err) => {
            telemLogger.error(err);
        });
}

// Gets the telemetry data and returns in a formatted object
function getTelem(): TelemMessage {
    return {
        "teamCode": 1,
        "unixTimestamp": Date.now(), // Gets the current UNIX timestamp
        "telem": {
            "cutterheadSpeed": 1,  // RPM
            "cutterheadTorque": 1, // ft x lb
            "totalThrust": 1,      // N
            "pitch": 1,            // Radians
            "distanceTravelled": { // rate: mm / s, total: m
                "rate": 1,
                "total": 1,
            },
            "energyConsumption": { // rate: kW, total: kWh
                "rate": 1,
                "total": 1,
            },
            "waterConsumption": { // rate: L/s, total: L
                "rate": 1,
                "total": 1,
            },
            "on": true, // true if the machine is powered up, false otherwise
            "latitude": 1,
            "longitude": 1,
            "depth": 1, // depth below the surface in meters
            "heading": 1,

        }
    }
}

module.exports = {
    sendTelem: sendTelem,
    getTelem: getTelem,
}