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
    }
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


module.exports = {
    publishRoutes: publishRoutes,
    initPublishers: initPublishers,
}