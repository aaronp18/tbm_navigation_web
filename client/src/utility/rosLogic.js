import { log } from './logger'
import ROSLIB from 'roslib';
import { rosURL } from './options';
import store from './store'

let reconnectIntervalID = null;

async function initiateROS(state, setState) {
    // * Intial ROS start
    log("Connecting to ROS server...", true, "ROS")
    setState((prevState) => {
        prevState.status = store.statuses["connecting"];
        prevState.stats.find((stat) => stat.id === "ros-status").value = prevState.status.text;
        return { ...prevState }
    });

    var ros = new ROSLIB.Ros({
        url: rosURL // Change to localhost on prod
    });


    ros.on('connection', async function () {
        log('Connected to websocket server.', true, "ROS");
        // loadParams();
        loadListeners(state, setState, ros);

        setState((prevState) => {
            prevState.status = store.statuses["connected"];
            prevState.stats.find((stat) => stat.id === "ros-status").value = prevState.status.text;
            return { ...prevState }
        });

        // Reset isConnecting
        if (reconnectIntervalID != null) {
            clearInterval(reconnectIntervalID);
            reconnectIntervalID = null;
        }


    });

    ros.on('error', async function (error) {
        log('Error connecting to websocket server: ', true, "ROS");
        log(error, false);

    });


    ros.on('close', async () => {
        setState((prevState) => {
            prevState.status = store.statuses["notconnected"];
            return { ...prevState }
        });
        log('Connection to websocket server closed. Waiting before retrying...', true, "ROS", 3000);
        // Retry connect on close every 5 seconds
        if (reconnectIntervalID != null)
            return;


        let reconnectID = setInterval(async () => {
            log("Retrying connection to " + rosURL, true, "ROS", 3000)
            setState((prevState) => {

                prevState.status = store.statuses["connecting"];
                prevState.stats.find((stat) => stat.id === "ros-status").value = prevState.status.text;

                return { ...prevState }
            });
            ros.connect(rosURL);

        }, 10000);

        reconnectIntervalID = reconnectID;
    });


}


function loadListeners(state, setState, ros) {
    // Iterate and subscribe to each topic
    state.stats.forEach(stat => subscribeToTopic({ topic: stat, ros: ros, setState: setState }));

    for (const [key, listener] of Object.entries(state.otherListeners)) {
        subscribeToTopic({ topic: listener, ros: ros, setState: setState })
    }


}
// Is called for each topic and subscribes
function subscribeToTopic({ topic, ros, setState }) {
    // Ignore stat
    if (topic?.rosignore)
        return;

    // Init a new topic and subscribe to it
    new ROSLIB.Topic({
        ros: ros,
        name: topic.topic,
        messageType: topic.messageType,
    }).subscribe(function (message) {
        // Uses the defined function in the listener topic
        // Allows for different treatment for different values
        let data;

        // Extract required data
        if (topic.getData === undefined)
            data = message.data;
        else
            data = topic.getData(message);

        // Run necessary update function
        topic.update({ data: data, topic: topic, setState: setState });


    });
    log(`Subscribed to "${topic.name}" on "${topic.topic}"`);

}

// Handle the subscribe with data for a stat
function handleMessageStat({ data, topic, setState }) {
    setState((prevState) => {
        // Find the stat
        let found = prevState.stats.find((elem) => elem.id === topic.id);
        // Update values
        found.value = data;
        found.lastData = data;

        return { ...prevState, }
    })
}
// Handle the subscribe with data for a stat
function handleOtherListener({ data, topic, setState }) {
    setState((prevState) => {
        // Find the stat
        let found = prevState.otherListeners[topic.id];
        // Update values
        found.value = data;
        found.lastData = data;

        return { ...prevState, }
    })
}

let exported = {
    initiateROS,
    handleMessageStat,
    handleOtherListener,
}

export default exported