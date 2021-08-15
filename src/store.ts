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
type ListenerTopic = {
    name: string,
    topicName: string,
    type: string,
    value: any,
}

var listenerTopics: { [topicName: string]: ListenerTopic } = {
    "cutterheadSpeed": {
        "name": "Speed of the Cutterhead RPM",
        "topicName": "/telem/cutterheadSpeed",
        "type": "std_msgs/Float32",
        "value": null,
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
                name: value.topicName,
                messageType: value.type,
            });

            rosLogger.info(`Listen initiated  "${value.name}" on "${value.topicName}"`);
        }
    );
}


module.exports = {
    publishRoutes: publishRoutes,
    initPublishers: initPublishers,
    initListeners: initListeners,
}