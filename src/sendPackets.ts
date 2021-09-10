import protobuf from "protobufjs";

import * as options from "./options";

import { webLogger, rosLogger, telemLogger } from "./logger";
import { listenerTopics, params } from "./rosRoutes";

import udp from "dgram"
const client = udp.createSocket('udp4');



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
                    // console.log(message.toJSON());
                }
            });


        }).catch((err) => {
            telemLogger.error(err);
        });
}

// Gets the telemetry data and returns in a formatted object
function getTelem(): TelemMessage {
    let telem: TelemMessage;

    // Header things
    telem.teamCode = options.TEAM_ID;

    telem.teamCode = options.TEAM_ID;
    telem.unixTimestamp = Date.now(); // Gets the current UNIX timestamp

    telem.telem.cutterheadSpeed = listenerTopics.cutterheadSpeed.lastData;  // RPM
    telem.telem.cutterheadTorque = listenerTopics.cutterheadTorque.lastData; // ft x lb
    telem.telem.totalThrust = listenerTopics.totalThrust.lastData;      // N

    telem.telem.distanceTravelled.rate = listenerTopics.distanceTravelledRate.lastData;
    telem.telem.distanceTravelled.total = listenerTopics.distanceTravelledTotal.lastData;

    telem.telem.energyConsumption.rate = listenerTopics.energyConsumptionRate.lastData;
    telem.telem.energyConsumption.total = listenerTopics.energyConsumptionTotal.lastData;

    telem.telem.waterConsumption.rate = listenerTopics.waterConsumptionRate.lastData;
    telem.telem.waterConsumption.total = listenerTopics.waterConsumptionTotal.lastData;

    telem.telem.on = listenerTopics.on.lastData; // true if the machine is powered up; false otherwise

    telem.telem.latitude = listenerTopics.latitude.lastData;
    telem.telem.longitude = listenerTopics.longitude.lastData;
    telem.telem.depth = listenerTopics.z.lastData; // depth below the surface in meters
    telem.telem.heading = listenerTopics.yawCurrent.lastData;
    telem.telem.pitch = listenerTopics.pitchCurrent.lastData;            // Radians



    return telem;
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