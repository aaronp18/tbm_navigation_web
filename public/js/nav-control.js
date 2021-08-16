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
/**
 * id: ID for getting later if required
 * name: User friendly name of the topic
 * topic: the topic address
 * messageType: A string of the message type eg: std_msgs/Float32
 * labelID: The id to be passed to the updatefunction. (Optional if programmed)
 * updateFunction(labelID, data): The function that is called with the new data. The data is extracted using getData() .
 * lastData: The last data received. Is null if no data
 * getData(message): Returns the required data from the message and passes it to the updateFunction. (Optional, otherwise the message is passed directly.)
 * disablePrint: [TODO]
 */
var listenTopics = [

    {
        "id": "cutterheadPose",
        "name": "Cutterhead Pose",
        "topic": "/ch",
        "messageType": 'geometry_msgs/Pose',
        "labelID": "#length",
        "updateFunction": updatePositionText,
        "getData": (message) => message.data, // The method to run to get the data from the publish (so can filter out header etc if needed)
    },
    {
        "id": "cutterheadSpeed",
        "name": "Cutterhead Seed (RPM)",
        "topic": "/ch/speed",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,
    },
    {
        "id": "cutterheadTorque",
        "name": "Cutterhead Torque (ft x lb)",
        "topic": "/ch/torque",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },
    {
        "id": "totalThrust",
        "name": "Total Thrust (N)",
        "topic": "/tbm/thrust",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },

    // Rates
    {
        "id": "distanceTravelledRate",
        "name": "Distance Travelled Rate (mm/s)",
        "topic": "/tbm/telem/distance/rate",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },
    {
        "id": "distanceTravelledTotal",
        "name": "Distance Travelled Total (m)",
        "topic": "/tbm/telem/distance/total",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },

    {
        "id": "energyConsumptionRate",
        "name": "Energy Consumption Rate (kW)",
        "topic": "/tbm/telem/energy/rate",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },
    {
        "id": "energyConsumptionTotal",
        "name": "Energy Consumption Total (kWh)",
        "topic": "/tbm/telem/energy/total",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },
    {
        "id": "waterConsumptionRate",
        "name": "Water Consumption Rate (L/s)",
        "topic": "/tbm/telem/water/rate",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },
    {
        "id": "waterConsumptionTotal",
        "name": "Water Consumption Total (L)",
        "topic": "/tbm/telem/water/total",
        "messageType": 'std_msgs/Float32',
        "labelID": undefined, //
        "updateFunction": updateText,

    },
    {
        "id": "on",
        "name": "TBM Status",
        "topic": "/tbm/status",
        "messageType": 'std_msgs/Bool',
        "labelID": undefined, //
        "updateFunction": updateText,

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
        // Generate label ID if none exists
        if (elem.labelID === undefined)
            elem.labelID = generateRandomID();


        let temp = `<p>"${elem.id}": {
            "name": "${elem.name}",
            "topic": "${elem.topic}",
            "type": "${elem.messageType}",
        }, </p> `
        // Create label for it in the listeners and add it to the dom
        // $("#listenDiv").append(createNewLabel(elem.name, elem.labelID))
        $("#listenDiv").append(temp)



        // Init a new topic and subscribe to it
        new ROSLIB.Topic({
            ros: ros,
            name: elem.topic,
            messageType: elem.messageType
        }).subscribe(function (message) {
            // Uses the defined function in the listener topic
            // Allows for different treatment for different values
            let data;

            // Extract required data
            if (elem.getData === undefined)
                data = message;
            else
                data = elem.getData(message);

            elem.updateFunction(elem.labelID, data);


            // Save data to object for last received
            elem.lastData = data;

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


