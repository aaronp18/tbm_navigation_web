//* This file contains all the logic for the pitch and yaw sliders

// * Intial ROS start
log("Connecting to ROS server...", true, "ROS")

var ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090' // Change to localhost on prod
});

ros.on('connection', function () {
    log('Connected to websocket server.', true, "ROS");

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
    },
    'yaw': {
        "client": yawClient,
        "currentLabel": "#yaw-current",
        "targetLabel": "#yaw-target",
        "slider": "#yaw-slider",
        "currentAngleTopic": "/set_angles/current_yaw",
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

    })


}


// * Functions

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


