import ROSLIB, { Ros } from "roslib"


import { webLogger, rosLogger } from "./logger";

import { addConsumptionPulse } from "./consumption";

import * as navigation from './navigation';



function initiateParams(ros: Ros) {
    Object.entries(params).forEach(
        ([key, param]) => {
            var rosParam = new ROSLIB.Param({
                ros: ros,
                name: param.route,
            });
            // Save to object
            param.param = rosParam;

            // Get inital value
            getParam(param);

        });
}

type ParamUpdateFunction = (value: any,) => void;

type Param = {
    route: string,
    value: any,
    param?: ROSLIB.Param,
    update?: ParamUpdateFunction,
}
let params: { [id: string]: Param } = {
    pitchMax: {
        route: "pitch/max",
        value: null,
        update: (value) => {
            navigation.phases["launch"].option.targetPitch = value;
        }

    },
    pitchMin: {
        route: "pitch/min",
        value: null,
        update: (value) => {
            navigation.phases["exit"].option.targetPitch = value;
        }
    },
    yawMax: {
        route: "yaw/max",
        value: null,
    },
    yawMin: {
        route: "yaw/min",
        value: null,
    },
    originLat: {
        route: "origin/lat",
        value: null,
    },
    originLong: {
        route: "origin/long",
        value: null,
    }


}

// Gets the given parameter and saves it to itself
function getParam(param: Param) {
    param.param?.get((value) => {
        param.value = value;
        // Update function
        if (param.update !== undefined)
            param.update(value);
    });

}

// Gets values of all parameters (can be used to update / refresh without restarting)
function refreshAllParameters() {
    Object.entries(params).forEach(
        ([key, param]) => {
            // Get inital value
            getParam(param);
        });
}


type PublishRoute = {
    name: string,
    topicName: string,
    type: string,
    latch?: boolean,
    topic: ROSLIB.Topic
}

const msgTypes = {
    FLOAT: "std_msgs/Float32",
    STRING: "std_msgs/String",
    INT64: "std_msgs/Int64",
    BOOL: "std_msgs/Bool",
}

const publishRoutes: { [topicName: string]: PublishRoute } = {
    "pitch-target": {
        "name": "Target Pitch",
        "topicName": "/nav/pitch/target",
        "type": msgTypes.FLOAT,
        "latch": true,
        "topic": null,
    },
    "pitch-enabled": {
        "name": "Pitch Enabled",
        "topicName": "/nav/pitch/enabled/",
        "type": msgTypes.BOOL,
        "latch": true,
        "topic": null,
    },
    "yaw-target": {
        "name": "Target Yaw",
        "topicName": "/nav/yaw/target",
        "type": msgTypes.FLOAT,
        "latch": true,
        "topic": null,
    },
    "yaw-enabled": {
        "name": "Yaw Enabled",
        "topicName": "/nav/yaw/enabled/",
        "type": msgTypes.BOOL,
        "latch": true,
        "topic": null,
    },
    "water-consumption-rate": {
        "name": "Rate of Water Consumption",
        "topicName": "/tbm/telem/water/rate",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "water-consumption-total": {
        "name": "Total Water Consumption",
        "topicName": "/tbm/telem/water/total",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "energy-consumption-pulse": {
        "name": "Energy Consumption Pulse",
        "topicName": "/restapi/energy/ping/",
        "type": msgTypes.INT64,
        "topic": null,
        "latch": false,
    },
    "energy-consumption-rate": {
        "name": "Rate of Energy Consumption",
        "topicName": "/tbm/telem/energy/rate",
        "type": msgTypes.FLOAT,
        "topic": null,
        "latch": false,
    },
    "energy-consumption-total": {
        "name": "Total Energy Consumption",
        "topicName": "/tbm/telem/energy/total",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "latitude": {
        "name": "Latitude",
        "topicName": "/tbm/pos/lat",
        "type": msgTypes.FLOAT,
        "latch": false,
        "topic": null,
    },
    "longitude": {
        "name": "Longitude",
        "topicName": "/tbm/pos/long",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "pitch": {
        "name": "Pitch",
        "topicName": "/tbm/rot/pitch",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "roll": {
        "name": "Roll",
        "topicName": "/tbm/rot/roll",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "yaw": {
        "name": "Yaw",
        "topicName": "/tbm/rot/yaw",
        "type": msgTypes.FLOAT,
        "topic": null,
    },
    "phase": {
        "name": "Phase",
        "topicName": "/nav/phase",
        "type": "std_msgs/String",
        "topic": null,
        "latch": true,
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
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "cutterheadTorque": {
        "name": "Cutterhead Torque (ft x lb)",
        "topic": "/ch/torque",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "totalThrust": {
        "name": "Total Thrust (N)",
        "topic": "/tbm/thrust",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "distanceTravelledRate": {
        "name": "Distance Travelled Rate (mm/s)",
        "topic": "/tbm/telem/distance/rate",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "distanceTravelledTotal": {
        "name": "Distance Travelled Total (m)",
        "topic": "/tbm/telem/distance/total",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "energyConsumptionRate": {
        "name": "Energy Consumption Rate (kW)",
        "topic": "/tbm/telem/energy/rate",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "energyConsumptionTotal": {
        "name": "Energy Consumption Total (kWh)",
        "topic": "/tbm/telem/energy/total",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "waterConsumptionRate": {
        "name": "Water Consumption Rate (L/s)",
        "topic": "/tbm/telem/water/rate",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "waterConsumptionTotal": {
        "name": "Water Consumption Total (L)",
        "topic": "/tbm/telem/water/total",
        "type": msgTypes.FLOAT,
        "lastData": null,
    },
    "on": {
        "name": "TBM Status",
        "topic": "/tbm/status",
        "type": msgTypes.BOOL,
        "lastData": null,
    },
    "energyPulse": {
        "name": "Energy Pulse",
        "topic": "/restapi/energy/ping",
        "type": msgTypes.INT64,
        "lastData": null,
        "update": addConsumptionPulse,
        "options": {
            "consumptionType": "energy",
        }
    },
    "waterPulse": {
        "name": "Water Pulse",
        "topic": "/restapi/water/ping",
        "type": msgTypes.INT64,
        "lastData": null,
        "update": addConsumptionPulse,
        "options": {
            "consumptionType": "water",
        }
    },
    "phase": {
        "name": "Phase",
        "topic": "/nav/phase",
        "type": msgTypes.STRING,
        "lastData": null,
        "update": navigation.handlePhaseChange,
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
        ([key, listener]) => {
            const topic = new ROSLIB.Topic({
                ros,
                name: listener.topic,
                messageType: listener.type,
            });

            topic.subscribe((message) => {
                listener.lastData = message;

                // Check if it has an update function
                if (typeof listener.update !== 'undefined') {
                    if (typeof listener.options !== "undefined") {
                        listener.update(message, listener.options);
                    }
                    else {
                        listener.update(message);
                    }
                }
            })

            rosLogger.info(`Listen initiated  "${listener.name}" on "${listener.topic}"`);
        }
    );
}



export {
    publishRoutes,
    initiateParams,
    params,
    initPublishers,
    initListeners,
    listenerTopics,
    msgTypes,
    refreshAllParameters,
}