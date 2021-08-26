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


let exported = {
    statsTemp,
    consumptions,
}

export default exported