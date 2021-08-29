import rosLogic from './rosLogic'

// Inital template for stats
let statsTemp = [
    {
        "id": "orientation-subtitle",
        "name": "Orientation",
        "isSubtitle": true,
    },
    {
        "id": "pitch",
        "name": "Pitch",
        "topic": "/tbm/rot/pitch",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "yaw",
        "name": "Heading",
        "topic": "/tbm/rot/yaw",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "roll",
        "name": "Roll",
        "topic": "/tbm/rot/roll",
        "messageType": 'std_msgs/Float32',
    },


    {
        "id": "position-subtitle",
        "name": "Position",
        "isSubtitle": true,
    },
    {
        "id": "x",
        "name": "X",
        "topic": "/tbm/pos/x",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "y",
        "name": "Y",
        "topic": "/tbm/pos/y",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "z",
        "name": "Z",
        "topic": "/tbm/pos/z",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "latitude",
        "name": "Latitude of Cutterhead",
        "topic": "/tbm/pos/lat",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "longitude",
        "name": "Longitude of Cutterhead",
        "topic": "/tbm/pos/long",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "cutterheadPose",
        "name": "Cutterhead Pose",
        "topic": "/ch",
        "messageType": 'geometry_msgs/Pose',
        "getData": (message) => message.data, // The method to run to get the data from the publish (so can filter out header etc if needed)
    },

    {
        "id": "status-subtitle",
        "name": "Statuses",
        "isSubtitle": true,
    },
    {
        "id": "ros-status",
        "name": "ROS Bridge Server",
        "rosignore": true,
    },
    {
        "id": "web-status",
        "name": "Web Server",
        "rosignore": true,
    },

    {
        "id": "tbm-subtitle",
        "name": "TBM",
        "isSubtitle": true,
    },
    {
        "id": "on",
        "name": "TBM Status",
        "topic": "/tbm/status",
        "messageType": 'std_msgs/Bool',
    },
    {
        "id": "cutterheadSpeed",
        "name": "Cutterhead Seed (RPM)",
        "topic": "/ch/speed",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "cutterheadTorque",
        "name": "Cutterhead Torque (ft x lb)",
        "topic": "/ch/torque",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "totalThrust",
        "name": "Total Thrust (N)",
        "topic": "/tbm/thrust",
        "messageType": 'std_msgs/Float32',
    },

    // Rates
    {
        "id": "rates-subtitle",
        "name": "Rates",
        "isSubtitle": true,
    },
    {
        "id": "distanceTravelledRate",
        "name": "Distance Travelled Rate (mm/s)",
        "topic": "/tbm/telem/distance/rate",
        "messageType": 'std_msgs/Float32',
        "consumptionName": "distance",
        "update": handleRateConsumptionUpdate,
    },
    {
        "id": "distanceTravelledTotal",
        "name": "Distance Travelled Total (m)",
        "topic": "/tbm/telem/distance/total",
        "messageType": 'std_msgs/Float32',
        "consumptionName": "distance",
        "update": handleTotalConsumptionUpdate,
    },

    {
        "id": "energyConsumptionRate",
        "name": "Energy Consumption Rate (kW)",
        "topic": "/tbm/telem/energy/rate",
        "messageType": 'std_msgs/Float32',
        "consumptionName": "energy",
        "update": handleRateConsumptionUpdate,
    },
    {
        "id": "energyConsumptionTotal",
        "name": "Energy Consumption Total (kWh)",
        "topic": "/tbm/telem/energy/total",
        "messageType": 'std_msgs/Float32',
        "consumptionName": "energy",
        "update": handleTotalConsumptionUpdate,
    },
    {
        "id": "waterConsumptionRate",
        "name": "Water Consumption Rate (L/s)",
        "topic": "/tbm/telem/water/rate",
        "messageType": 'std_msgs/Float32',
        "consumptionName": "water",
        "update": handleRateConsumptionUpdate,
    },
    {
        "id": "waterConsumptionTotal",
        "name": "Water Consumption Total (L)",
        "topic": "/tbm/telem/water/total",
        "messageType": 'std_msgs/Float32',
        "consumptionName": "water",
        "update": handleTotalConsumptionUpdate,
    },



];
function handleTotalConsumptionUpdate({ data, topic, setState }) {
    rosLogic.handleMessageStat({ data, topic, setState });
    setState((prevState) => {
        prevState.consumptions.find((elem) => elem.name === topic.consumptionName).total = data;
        return { ...prevState }
    });
}
function handleRateConsumptionUpdate({ data, topic, setState }) {

    rosLogic.handleMessageStat({ data, topic, setState });
    setState((prevState) => {
        let found = prevState.consumptions.find((elem) => elem.name === topic.consumptionName)
        found.rate = data;
        found.dataPoints.push({ timestamp: Date.now(), value: data })
        return { ...prevState }
    });
}

let consumptions = [
    {
        "name": "energy",
        "header": "Energy Consumption Rate (kW)",
        "dataPoints": [{ timestamp: Date.now(), value: Math.random() * 10 }],
        "average": 0,
        "total": 4898,
    },
    {
        "name": "water",
        "header": "Water Consumption Rate (L/s)",
        "dataPoints": [{ timestamp: Date.now(), value: Math.random() * 10 }],
        "average": 0,
        "total": 0,
    },
    {
        "name": "distance",
        "header": "Distance Travelled (m)",
        "dataPoints": [{ timestamp: Date.now(), value: Math.random() * 10 }],
        "average": 0,
        "total": 0,
    },
]

let navigationPhases = [
    {
        id: "launch",
        title: "Launch",
        color: "green",
        selected: false,
    },
    {
        id: "cruise",
        title: "Cruise",
        color: "grey",
        selected: false,
    },
    {
        id: "exit",
        title: "Exit",
        color: "grey",
        selected: false,
    },
    {
        id: "stop",
        title: "Stop",
        color: "grey",
        selected: true,
    },
]

let otherListeners = {

    pitchTarget: {
        "id": "pitchTarget",
        "name": "Target Pitch",
        "topic": "/nav/pitch/target",
        "messageType": 'std_msgs/Float32',
        "value": "N/A"
    },
    pitchEnabled: {
        "id": "pitchEnabled",
        "name": "Pitch Enabled",
        "topic": "/nav/pitch/enabled",
        "messageType": 'std_msgs/Bool',
        "value": null
    },

    yawTarget: {
        "id": "yawTarget",
        "name": "Target Yaw",
        "topic": "/nav/yaw/target",
        "messageType": 'std_msgs/Float32',
        "value": null
    },
    yawEnabled: {
        "id": "yawEnabled",
        "name": "Yaw Enabled",
        "topic": "/nav/yaw/enabled",
        "messageType": 'std_msgs/Bool',
        "value": null
    },
    phase: {
        "id": "phase",
        "name": "Phase",
        "topic": "/nav/phase/",
        "messageType": 'std_msgs/String',
        "value": null
    },

}


let statuses = {
    connected: {
        color: "green",
        text: "Connected"
    },
    connecting: {
        color: "yellow",
        text: "Connecting..."

    },
    notconnected: {
        color: "red",
        text: "Not Connected",

    },
    on: {
        color: "green",
        text: "ON",

    },
    off: {
        color: "red",
        text: "OFF",

    },
}

// Routes to use to publish values (basically the name on the server)
let publishRoutes = {
    pitchTarget: "pitch-target",
    pitchEnabled: "pitch-enabled",
    yawTarget: "yaw-target",
    yawEnabled: "yaw-enabled",
    phase: "phase",
}


let paramsTemplate = {
    pitchMax: {
        name: "Maximum Pitch",
        route: "pitch/max",
        value: null,

    },
    pitchMin: {
        name: "Minimum Pitch",
        route: "pitch/min",
        value: null,
    },
    yawMax: {
        name: "Maximum Yaw",
        route: "yaw/max",
        value: null,
    },
    yawMin: {
        name: "Minimum Yaw",
        route: "yaw/min",
        value: null,
    },
    originLat: {
        name: "Origin - Latitude",
        route: "origin/lat",
        value: null,
    },
    originLong: {
        name: "Origin - Longitude",
        route: "origin/long",
        value: null,
    }


}


let exported = {
    statsTemp,
    consumptions,
    navigationPhases,
    statuses,
    otherListeners,
    publishRoutes,
    paramsTemplate,
}

export default exported