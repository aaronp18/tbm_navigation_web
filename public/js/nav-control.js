//* This file contains all the logic for the pitch and yaw sliders

// * Intial ROS start
console.log("Connecting to ROS server...")

var ros = new ROSLIB.Ros({
    url: 'ws://192.168.186.91:9090' // Change to localhost on prod
});

ros.on('connection', function () {
    console.log('Connected to websocket server.');
});

ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ');
    console.log(error);
});

ros.on('close', function () {
    console.log('Connection to websocket server closed.');
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
        "currentName": "#pitch-current"
    },
    'yaw': {
        "client": yawClient,
        "currentName": "#yaw-current"
    },

};

// Initialises and sets a axis goal
function setAngle(axisName, targetAngle) {
    var axis = axes[axisName];

    // Init the goal with the target angle
    var goal = new ROSLIB.Goal({
        actionClient: axis.client,
        goalMessage: {
            target_angle: targetAngle
        }
    })
    goal.on('feedback', function (feedback) {
        updateCurrentAngle(axis.currentName, feedback.current_angle);
    });
    goal.on('result', function (result) {
        console.log('Reached final result!');
        updateCurrentAngle(axis.currentName, result.final_angle);
    });

    // Send goal
    goal.send();

}
function updateCurrentAngle(id, angle) {

    // Update the Current angle text
    $(id).text(angle);

    // Update and animate simulation
    //TODO
}

