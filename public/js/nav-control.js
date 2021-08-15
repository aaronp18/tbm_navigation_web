//* This file contains all the logic for the pitch and yaw sliders

let isReconnecting = false;
const rosURL = 'ws://localhost:9090';


// * Intial ROS start
log("Connecting to ROS server...", true, "ROS")

var ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090' // Change to localhost on prod
});

ros.on('connection', function () {
    log('Connected to websocket server.', true, "ROS");
    loadParams();
    loadListeners();

});

ros.on('error', function (error) {
    log('Error connecting to websocket server: ', true, "ROS");
    log(error, false);
});


ros.on('close', function () {
    log('Connection to websocket server closed. Waiting before retrying...', true, "ROS", 3000);
    // Retry connect on close every 5 seconds
    if (isReconnecting)
        return;

    isReconnecting = true;
    let reconnectID = setInterval(() => {
        log("Retrying connection to " + rosURL, true, "ROS", 3000)
        ros.connect(rosURL)
        ros.on("connection", () => {
            // Kill reconnect interval
            clearInterval(reconnectID);
            isReconnecting = false;
            log("Killed reconnect");
        })
    }, 10000);
});



// Array of listenTopics 
var listenTopics = [

    {
        "name": "Cutterhead Pose",
        "topic": "/ch",
        "messageType": 'geometry_msgs/Pose',
        "labelID": "#length",
        "updateFunction": updatePositionText,
    },
];

// * Publish Topics
var publishTopics = {
    "pitch-enabled": {
        "name": "pitch-enabled",
        "messageType": 'std_msgs/Bool', // The message type

    },
    "yaw-enabled": {
        "name": "yaw-enabled",
        "messageType": 'std_msgs/Bool', // The message type

    },
    "pitch-target": {
        "name": "pitch-target",
        "messageType": 'std_msgs/Float32', // The message type

    },
    "yaw-target": {
        "name": "yaw-target",
        "messageType": 'std_msgs/Float32', // The message type

    },


};

var axes = {
    'pitch': {

        "targetPublisher": publishTopics["pitch-target"],
        "currentLabel": "#pitch-current",
        "targetLabel": "#pitch-target",
        "slider": "#pitch-slider",
        "currentAngleTopic": "/set_angles/pitch/current",
        "current-value": null,
        "enabled-topic": publishTopics["pitch-enabled"],
    },
    'yaw': {

        "targetPublisher": publishTopics["yaw-target"],
        "currentLabel": "#yaw-current",
        "targetLabel": "#yaw-target",
        "slider": "#yaw-slider",
        "currentAngleTopic": "/set_angles/pitch/current",
        "current-value": null,
        "enabled-topic": publishTopics["yaw-enabled"],
    },

};



$(".angle-set-buttons").on("click", (e) => {
    elem = $(e.target);
    // Set slider position
    setSliderPosition(axes[elem.data("axis")].slider, elem.data("value"));
})

$(".target-enable-button").on("click", (e) => {
    elem = $(e.target);
    res = elem.is(':checked') ? true : false;

    publish(publishTopics[elem.data("axis")].name, res);

})

// * Functions

function loadListeners() {


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
            if (elem.name == "Cutterhead Pose")
                elem.updateFunction(elem.labelID, message);
            else
                elem.updateFunction(elem.labelID, message.data);
        });
        log(`Subscribed to "${elem.name}" on "${elem.topic}"`);

    });

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
}

function loadParams() {
    loadAxisMinMax();
}

function loadAxisMinMax() {
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
    });
}

// Sets a given elements attrtibute with the given value
function setElementAttr({ element = "", value, attr }) {
    // Gets the element and sets the given attributes value
    $(element).attr(attr, value)
}

// Initialises and sets a axis angle
function sendAngle(axisName, targetAngle) {

    let change = targetAngle - axes[axisName].currentValue;
    publish(axes[axisName].targetPublisher.name, change);


}

function publish(topicName, value) {
    $.ajax({
        type: "POST",
        url: `api/publish/${topicName}/${value}`,
        success: handleResponse

    });
}

function handleResponse(response) {
    if (response?.success) {
        log(response?.message, false);
    }
    else {
        log("ERROR: " + response?.message);
    }
}


