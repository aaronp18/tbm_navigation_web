import ROSLIB from "roslib"


import { webLogger, rosLogger } from "./logger";

import { addConsumptionPulse } from "./consumption";

import * as navigation from './navigation';


type PublishRoute = {
    name: string,
    topicName: string,
    type: string,
    latch?: boolean,
    topic: ROSLIB.Topic
}

const publishRoutes: { [topicName: string]: PublishRoute } = {
    "pitch-target": {
        "name": "Target Pitch",
        "topicName": "/nav/pitch/target",
        "type": "std_msgs/Float32",
        "latch": true,
        "topic": null,
    },
    "pitch-enabled": {
        "name": "Pitch Enabled",
        "topicName": "/nav/pitch/enabled/",
        "type": "std_msgs/Bool",
        "latch": true,
        "topic": null,
    },
    "yaw-target": {
        "name": "Target Yaw",
        "topicName": "/nav/yaw/target",
        "type": "std_msgs/Float32",
        "latch": true,
        "topic": null,
    },
    "yaw-enabled": {
        "name": "Yaw Enabled",
        "topicName": "/nav/yaw/enabled/",
        "type": "std_msgs/Bool",
        "latch": true,
        "topic": null,
    },
    "water-consumption-rate": {
        "name": "Rate of Water Consumption",
        "topicName": "/tbm/telem/water/rate",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "water-consumption-total": {
        "name": "Total Water Consumption",
        "topicName": "/tbm/telem/water/total",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "energy-consumption-pulse": {
        "name": "Energy Consumption Pulse",
        "topicName": "/restapi/energy/ping/",
        "type": "std_msgs/Int64",
        "topic": null,
        "latch": false,
    },
    "energy-consumption-rate": {
        "name": "Rate of Energy Consumption",
        "topicName": "/tbm/telem/energy/rate",
        "type": "std_msgs/Float32",
        "topic": null,
        "latch": false,
    },
    "energy-consumption-total": {
        "name": "Total Energy Consumption",
        "topicName": "/tbm/telem/energy/total",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "latitude": {
        "name": "Latitude",
        "topicName": "/tbm/pos/lat",
        "type": "std_msgs/Float32",
        "latch": false,
        "topic": null,
    },
    "longitude": {
        "name": "Longitude",
        "topicName": "/tbm/pos/long",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "pitch": {
        "name": "Pitch",
        "topicName": "/tbm/rot/pitch",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "roll": {
        "name": "Roll",
        "topicName": "/tbm/rot/roll",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "yaw": {
        "name": "Yaw",
        "topicName": "/tbm/rot/yaw",
        "type": "std_msgs/Float32",
        "topic": null,
    },
    "phase": {
        "name": "Phase",
        "topicName": "/nav/phase",
        "type": "std_msgs/String",
        "topic": null,
    },

}

type UpdateFunction = (value: any, options?: {}) => void;
/**
 * name: User friendly name of the topic
 * topic: the topic address
 * messageType: A string of the message type eg: std_msgs/Float32
 * lastData: The last data received. Is null if no data

 */
type ListenerTopic = {
    name: string,
    topic: string,
    type: string,
    lastData?: any,
    update?: UpdateFunction,
    options?: {},

}

const listenerTopics: { [id: string]: ListenerTopic } = {
    "cutterheadPose": {
        "name": "Cutterhead Pose",
        "topic": "/ch",
        "type": "geometry_msgs/Pose",
        "lastData": null,
        "update": navigation.poseUpdate,
    },
    "cutterheadSpeed": {
        "name": "Cutterhead Seed (RPM)",
        "topic": "/ch/speed",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "cutterheadTorque": {
        "name": "Cutterhead Torque (ft x lb)",
        "topic": "/ch/torque",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "totalThrust": {
        "name": "Total Thrust (N)",
        "topic": "/tbm/thrust",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "distanceTravelledRate": {
        "name": "Distance Travelled Rate (mm/s)",
        "topic": "/tbm/telem/distance/rate",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "distanceTravelledTotal": {
        "name": "Distance Travelled Total (m)",
        "topic": "/tbm/telem/distance/total",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "energyConsumptionRate": {
        "name": "Energy Consumption Rate (kW)",
        "topic": "/tbm/telem/energy/rate",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "energyConsumptionTotal": {
        "name": "Energy Consumption Total (kWh)",
        "topic": "/tbm/telem/energy/total",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "waterConsumptionRate": {
        "name": "Water Consumption Rate (L/s)",
        "topic": "/tbm/telem/water/rate",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "waterConsumptionTotal": {
        "name": "Water Consumption Total (L)",
        "topic": "/tbm/telem/water/total",
        "type": "std_msgs/Float32",
        "lastData": null,
    },
    "on": {
        "name": "TBM Status",
        "topic": "/tbm/status",
        "type": "std_msgs/Bool",
        "lastData": null,
    },
    "energyPulse": {
        "name": "Energy Pulse",
        "topic": "/restapi/energy/ping",
        "type": "std_msgs/Int64",
        "lastData": null,
        "update": addConsumptionPulse,
        "options": {
            "consumptionType": "energy",
        }
    },
    "waterPulse": {
        "name": "Water Pulse",
        "topic": "/restapi/water/ping",
        "type": "std_msgs/Int64",
        "lastData": null,
        "update": addConsumptionPulse,
        "options": {
            "consumptionType": "water",
        }
    },


}


function initPublishers(ros: any) {
    Object.entries(publishRoutes).forEach(
        ([key, value]) => {
            const topic = new ROSLIB.Topic({
                ros,
                name: value.topicName,
                messageType: value.type,
                latch: value.latch,

            });
            publishRoutes[key].topic = topic;
            rosLogger.info(`Publish initiated  "${value.name}" on "${value.topicName}"`);


            value.topic = topic;

        }
    );


}


function initListeners(ros: any) {
    Object.entries(listenerTopics).forEach(
        ([key, value]) => {
            const topic = new ROSLIB.Topic({
                ros,
                name: value.topic,
                messageType: value.type,
            });

            topic.subscribe((message) => {
                value.lastData = message;

                // Check if it has an update function
                if (typeof value.update !== 'undefined') {
                    if (typeof value.options !== "undefined") {
                        value.update(message, value.options);
                    }
                    else {
                        value.update(message);
                    }
                }
            })

            rosLogger.info(`Listen initiated  "${value.name}" on "${value.topic}"`);
        }
    );
}




export {
    publishRoutes,
    initPublishers,
    initListeners,
    listenerTopics,
}