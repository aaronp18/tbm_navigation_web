
let statsTemp = [
    // {
    //     "name": "Heading",
    //     "id": "heading",
    //     "value": "N/A"
    {
        "name": "Pitch",
        "id": "pitch",
        "value": "N/A",
        "rosignore": true,
    },
    {
        "id": "energyPulse",
        "name": "Energy Pulse",
        "topic": "/restapi/energy/ping",
        "messageType": 'std_msgs/Int64',
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
    {
        "id": "on",
        "name": "TBM Status",
        "topic": "/tbm/status",
        "messageType": 'std_msgs/Bool',
    },

];

let exported = {
    statsTemp,
}

export default exported