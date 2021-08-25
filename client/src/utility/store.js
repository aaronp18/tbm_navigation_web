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
    },
    {
        "id": "distanceTravelledTotal",
        "name": "Distance Travelled Total (m)",
        "topic": "/tbm/telem/distance/total",
        "messageType": 'std_msgs/Float32',
    },

    {
        "id": "energyConsumptionRate",
        "name": "Energy Consumption Rate (kW)",
        "topic": "/tbm/telem/energy/rate",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "energyConsumptionTotal",
        "name": "Energy Consumption Total (kWh)",
        "topic": "/tbm/telem/energy/total",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "waterConsumptionRate",
        "name": "Water Consumption Rate (L/s)",
        "topic": "/tbm/telem/water/rate",
        "messageType": 'std_msgs/Float32',
    },
    {
        "id": "waterConsumptionTotal",
        "name": "Water Consumption Total (L)",
        "topic": "/tbm/telem/water/total",
        "messageType": 'std_msgs/Float32',
    },



];

let exported = {
    statsTemp,
}

export default exported