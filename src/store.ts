import ROSLIB from "roslib"


const { webLogger, rosLogger } = require("./logger");


type PublishRoute = {
    name: string,
    topicName: string,
    type: string,
    latch: boolean,
    topic: any
}

var publishRoutes: { [topicName: string]: PublishRoute } = {
    "pitch-target": {
        "name": "Target Pitch",
        "topicName": "/set_angles/pitch/target",
        "type": "std_msgs/Float32",
        "latch": true,
        "topic": null,
    },
    "pitch-enabled": {
        "name": "Pitch Enabled",
        "topicName": "/set_angles/pitch/enabled/",
        "type": "std_msgs/Bool",
        "latch": true,
        "topic": null,
    },
    "yaw-target": {
        "name": "Target Yaw",
        "topicName": "/set_angles/yaw/target",
        "type": "std_msgs/Float32",
        "latch": true,
        "topic": null,
    },
    "yaw-enabled": {
        "name": "Yaw Enabled",
        "topicName": "/set_angles/yaw/enabled/",
        "type": "std_msgs/Bool",
        "latch": true,
        "topic": null,
    },
}
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

}

var listenerTopics: { [id: string]: ListenerTopic } = {
    "cutterheadPose": {
        "name": "Cutterhead Pose",
        "topic": "/ch",
        "type": "geometry_msgs/Pose",
        "lastData": null,
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

}


function initPublishers(ros: any) {
    Object.entries(publishRoutes).forEach(
        ([key, value]) => {
            var topic = new ROSLIB.Topic({
                ros: ros,
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
            var topic = new ROSLIB.Topic({
                ros: ros,
                name: value.topic,
                messageType: value.type,
            });

            topic.subscribe((message) => {
                value.lastData = message;
            })

            rosLogger.info(`Listen initiated  "${value.name}" on "${value.topic}"`);
        }
    );
}


module.exports = {
    publishRoutes: publishRoutes,
    initPublishers: initPublishers,
    initListeners: initListeners,
    listenerTopics: listenerTopics,
}