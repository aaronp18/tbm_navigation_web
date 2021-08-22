import protobuf from "protobufjs";

import * as options from "./options";

import { webLogger, rosLogger, telemLogger } from "./logger";
import { listenerTopics } from "./rosRoutes";

import udp from "dgram"
var client = udp.createSocket('udp4');



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
    return {
        "teamCode": options.TEAM_ID,
        "unixTimestamp": Date.now(), // Gets the current UNIX timestamp
        "telem": {
            "cutterheadSpeed": listenerTopics.cutterheadSpeed.lastData,  // RPM
            "cutterheadTorque": listenerTopics.cutterheadTorque.lastData, // ft x lb
            "totalThrust": listenerTopics.totalThrust.lastData,      // N
            "pitch": null,            // Radians
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
            "latitude": null,
            "longitude": null,
            "depth": null, // depth below the surface in meters
            "heading": null,

        }
    }
}

export {
    sendTelem,
    getTelem,
}