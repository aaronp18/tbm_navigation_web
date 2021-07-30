//* This file contains all the logic for the pitch and yaw sliders

// * Intial ROS start
console.log("Connecting to ROS server...")

var ros = new ROSLIB.Ros({
    url: 'ws://172.19.210.225:9090' // Change to localhost on prod
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
        "currentLabel": "#pitch-current",
        "targetLabel": "#pitch-target",
        "slider": "#pitch-slider",
    },
    'yaw': {
        "client": yawClient,
        "currentLabel": "#yaw-current",
        "targetLabel": "#yaw-target",
        "slider": "#yaw-slider",
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
        updateAngle(axis.currentLabel, feedback.current_angle);
    });
    goal.on('result', function (result) {
        console.log('Reached final result!');
        updateAngle(axis.currentLabel, result.final_angle);
    });

    // Send goal
    goal.send();

}
function updateAngle(id, angle) {

    // Update the Current angle text
    $(id).val(round2dp(angle));
    $(id).text(round2dp(angle));

    // Update and animate simulation
    //TODO
}





// TODO - foreach through

for (const key in axes) {

    $(axes[key].slider).on("change", (elem) => {
        let angle = parseFloat($(elem.currentTarget).val());

        updateAngle(axes[key].targetLabel, angle);
        setAngle(key, angle);
    })
    $(axes[key].targetLabel).on("change", (elem) => {
        let angle = parseFloat($(elem.currentTarget).val());

        $(axes[key].slider).val(angle);
        $(axes[key].slider).trigger("change");

    })

    // Set Slider position

}

