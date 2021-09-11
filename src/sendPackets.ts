import protobuf from "protobufjs";

import * as options from "./options";

import { webLogger, rosLogger, telemLogger } from "./logger";
import { listenerTopics, params } from "./rosRoutes";

import udp from "dgram"
const client = udp.createSocket('udp4');

import Long from 'long';

let i = 0;
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
    teamCode: Long,
    unixTimestamp: number, // Floating point unix timestamp
    telem: TelemJS,
}

// Sends the given telem message
function sendTelem(telem: TelemMessage) {
    // Loads the format
    protobuf.load("./src/telem.proto")
        .then(function (root) {
            // Obtain a message type
            const TelemMsg = root.lookupType("tbc.TelemMessage");

            // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
            const errMsg = TelemMsg.verify(telem);
            if (errMsg) {
                telemLogger.error(errMsg);
                throw Error(errMsg);
            }

            // Create a new message
            const message = TelemMsg.create(telem);

            // Encode a message to an Uint8Array (browser) or Buffer (node)
            const buffer = TelemMsg.encode(message).finish();

            // Sending msg
            client.send(buffer, options.TELEM_PORT, options.TELEM_IP, function (error) {
                if (error) {
                    telemLogger.error("TELEM ERROR!!! - " + error);
                    client.close();
                } else {
                    // telemLogger.info("Sent Telem Packet...")
                    console.log(message.toJSON());
                }
            });


        }).catch((err) => {
            telemLogger.error(err);
        });
}

// Gets the telemetry data and returns in a formatted object
function getTelem(): TelemMessage {
    let t = {
        "teamCode": options.TEAM_ID,
        "unixTimestamp": Date.now(), // Gets the current UNIX timestamp
        "telem": {
            "cutterheadSpeed": listenerTopics.cutterheadSpeed.lastData,  // RPM
            "cutterheadTorque": listenerTopics.cutterheadTorque.lastData, // ft x lb
            "totalThrust": listenerTopics.totalThrust.lastData,      // N
            "pitch": listenerTopics.pitchCurrent.lastData,            // Radians
            "distanceTravelled": { // rate: mm / s, total: m
                "rate": listenerTopics.distanceTravelledRate.lastData,
                "total": listenerTopics.distanceTravelledTotal.lastData,
            },
            "energyConsumption": { // rate: kW, total: kWh
                "rate": listenerTopics.energyConsumptionRate.lastData,
                "total": listenerTopics.energyConsumptionTotal.lastData,
            },
            "waterConsumption": { // rate: L/s, total: L
                "rate": listenerTopics.waterConsumptionRate.lastData,
                "total": listenerTopics.waterConsumptionTotal.lastData,
            },
            "on": listenerTopics.on.lastData, // true if the machine is powered up, false otherwise
            "latitude": listenerTopics.latitude.lastData,
            "longitude": listenerTopics.longitude.lastData,
            "depth": listenerTopics.z.lastData, // depth below the surface in meters
            "heading": listenerTopics.yawCurrent.lastData,

        }
    };

    // * Header things
    // t.teamCode = options.TEAM_ID;
    // t.unixTimestamp = Date.now(); // Gets the current UNIX timestamp

    // * TBM
    // t.telem.cutterheadSpeed = ++i;  // RPM
    // t.telem.cutterheadTorque = listenerTopics.cutterheadTorque.lastData; // ft x lb
    // t.telem.totalThrust = listenerTopics.totalThrust.lastData;      // N

    // * Distance
    // t.telem.distanceTravelled.rate = listenerTopics.distanceTravelledRate.lastData;
    // t.telem.distanceTravelled.total = listenerTopics.distanceTravelledTotal.lastData;

    // * Energy
    // t.telem.energyConsumption.rate = listenerTopics.energyConsumptionRate.lastData;
    // t.telem.energyConsumption.total = listenerTopics.energyConsumptionTotal.lastData;

    // * Water Consumption
    // t.telem.waterConsumption.rate = listenerTopics.waterConsumptionRate.lastData;
    // t.telem.waterConsumption.total = listenerTopics.waterConsumptionTotal.lastData;

    // t.telem.on = listenerTopics.on.lastData; // true if the machine is powered up; false otherwise

    // * Position
    // t.telem.latitude = listenerTopics.latitude.lastData;
    // t.telem.longitude = listenerTopics.longitude.lastData;
    // t.telem.depth = listenerTopics.z.lastData; // depth below the surface in meters
    // t.telem.heading = listenerTopics.yawCurrent.lastData;
    // t.telem.pitch = listenerTopics.pitchCurrent.lastData;          



    return t;
}

function initiateTelem() {
    setInterval(() => {
        // If telemetry is off, pass;
        if (!params.sendTelem.value)
            return;
        // Get relavent telem
        const telem = getTelem();
        // Send telem
        sendTelem(telem);
    }, options.TELEM_INTERVAL);
}

export {
    sendTelem,
    getTelem,
    initiateTelem
}