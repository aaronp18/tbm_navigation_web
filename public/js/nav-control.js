//* This file contains all the logic for the pitch and yaw sliders


// * Intial ROS start
log("Connecting to ROS server...", true, "ROS")

var ros = new ROSLIB.Ros({
    url: 'ws://172.19.223.49:9090' // Change to localhost on prod
});

ros.on('connection', function () {
    log('Connected to websocket server.', true, "ROS");
    loadParams();

});

ros.on('error', function (error) {
    log('Error connecting to websocket server: ', true, "ROS");
    log(error, false);
});

ros.on('close', function () {
    log('Connection to websocket server closed.', true, "ROS");
});





// Array of listenTopics 
var listenTopics = [
    {
        "name": "Current Pitch", // The user friendly name of the topic
        "topic": "/set_angles/current_pitch", // The actual topic name
        "messageType": 'std_msgs/Float32', // The message type
        "labelID": "#pitch-current", // The id of the label to update
        "updateFunction": updateAngleText, // The function to use when updating the label
    },
    {
        "name": "Longitude",
        "topic": "/set_angles/longitude",
        "messageType": 'std_msgs/Float32',
        "labelID": "#longitude",
        "updateFunction": updateText,
    },
]

// Iterate and subscribe to each topic
listenTopics.forEach(elem => {
    // Init a new topic and subscribe to it
    new ROSLIB.Topic({
        ros: ros,
        name: elem.topic,
        messageType: elem.messageType
    }).subscribe(function (message) {
        // Uses the defined function in the listener topic
        // Allows for different treatment for different values
        elem.updateFunction(elem.labelID, message.data);
    });
    log(`Subscribed to "${elem.name}" on "${elem.topic}"`);

});

// * Publish Topics
var publishTopics = {
    "pitch-enabled": {
        "name": "Pitch Enabled", // The user friendly name of the topic
        "topicName": "/set_angles/pitch_enabled", // The actual topic name
        "messageType": 'std_msgs/Bool', // The message type
        "topic": null,
    },

};

for (const key in publishTopics) {
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: publishTopics[key].topicName,
        messageType: publishTopics[key].messageType,
        latch: true,

    })
    log(`Publish initiated  "${publishTopics[key].name}" on "${publishTopics[key].topicName}"`);
    publishTopics[key].topic = topic;
}

// * Action Clients

var pitchClient = new ROSLIB.ActionClient({
    ros: ros,
    serverName: '/set_angles/set_pitch',
    actionName: 'commander/SetAngleAction'
})
var yawClient = new ROSLIB.ActionClient({
    ros: ros,
    serverName: '/set_angles/set_yaw',
    actionName: 'commander/SetAngleAction'
})

var axes = {
    'pitch': {
        "client": pitchClient,
        "currentLabel": "#pitch-current",
        "targetLabel": "#pitch-target",
        "slider": "#pitch-slider",
        "currentAngleTopic": "/set_angles/current_pitch",
        "enabled-topic": publishTopics["pitch-enabled"],
    },
    'yaw': {
        "client": yawClient,
        "currentLabel": "#yaw-current",
        "targetLabel": "#yaw-target",
        "slider": "#yaw-slider",
        "currentAngleTopic": "/set_angles/current_yaw",
        "enabled-topic": "/set_angles/yaw_enabled",
    },

};

// Iterates through each axis and carries out relevant initialisation
for (const key in axes) {

    $(axes[key].slider).on("change", (elem) => {
        let angle = parseFloat($(elem.currentTarget).val());

        updateAngleText(axes[key].targetLabel, angle);
        sendAngle(key, angle);
    })
    $(axes[key].targetLabel).on("change", (elem) => {
        let angle = parseFloat($(elem.currentTarget).val());

        setSliderPosition(axes[key].slider, angle)

    });




}

$(".angle-set-buttons").on("click", (e) => {
    elem = $(e.target);
    // Set slider position
    setSliderPosition(axes[elem.data("axis")].slider, elem.data("value"));
})

$(".target-enable-button").on("click", (e) => {
    elem = $(e.target);
    res = elem.is(':checked') ? true : false;
    msg = new ROSLIB.Message(res);

    // Publish chanegd
    publishTopics[elem.data("axis")].topic.publish(msg);

})

// * Functions

function loadParams() {
    // Set slider min max
    // ros.getParams(function (params) {
    //     console.log(params);

    // });

    // Axis min / max
    var params = [
        {
            "name": "pitch/max",
            "callback": setElementAttr,
            "args": {
                "attr": "max",
                "element": "#pitch-slider"
            },
        },
        {
            "name": "pitch/min",
            "callback": setElementAttr,
            "args": {
                "attr": "min",
                "element": "#pitch-slider"
            },
        },
        {
            "name": "yaw/max",
            "callback": setElementAttr,
            "args": {
                "attr": "max",
                "element": "#yaw-slider"
            },
        },
        {
            "name": "yaw/min",
            "callback": setElementAttr,
            "args": {
                "attr": "min",
                "element": "#yaw-slider"
            },
        },

    ];

    params.forEach((param) => {
        var rosParam = new ROSLIB.Param({
            ros: ros,
            name: param.name
        });
        rosParam.get((value) => {
            param.args.value = value;
            param.callback(param.args)
            log(`Parameter: ${param.name} = ${value}`)
        })
    })

}

function setElementAttr({ element = "", value = 0, attr }) {
    // Gets the element and sets the given attributes value
    $(element).attr(attr, value)
}

// Initialises and sets a axis goal
function sendAngle(axisName, targetAngle) {
    var axis = axes[axisName];

    // Init the goal with the target angle
    var goal = new ROSLIB.Goal({
        actionClient: axis.client,
        goalMessage: {
            target_angle: targetAngle
        }
    })
    goal.on('feedback', function (feedback) {
        updateAngleText(axis.currentLabel, feedback.current_angle);
    });
    goal.on('result', function (result) {
        log('Reached ' + axisName + ' result: ' + round2dp(result.final_angle));
        updateAngleText(axis.currentLabel, result.final_angle);
    });

    // Send goal
    goal.send();

}


