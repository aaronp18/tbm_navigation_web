import { log } from './logger'
import ROSLIB from 'roslib';
import { rosURL } from './options';


function initiateROS(state, setState) {
    // * Intial ROS start
    log("Connecting to ROS server...", true, "ROS")

    var ros = new ROSLIB.Ros({
        url: rosURL // Change to localhost on prod
    });

    ros.on('connection', function () {
        log('Connected to websocket server.', true, "ROS");
        // loadParams();
        loadListeners(state, setState, ros);

    });

    ros.on('error', function (error) {
        log('Error connecting to websocket server: ', true, "ROS");
        log(error, false);
    });


    ros.on('close', async function () {
        log('Connection to websocket server closed. Waiting before retrying...', true, "ROS", 3000);
        // Retry connect on close every 5 seconds
        if (state.isReconnecting)
            return;

        await setState((prevState) => { return { ...prevState, isReconnecting: true, } })
        let reconnectID = setInterval(async () => {
            log("Retrying connection to " + rosURL, true, "ROS", 3000)
            ros.connect(rosURL)
            ros.on("connection", async () => {
                // Kill reconnect interval
                clearInterval(reconnectID);
                await setState((prevState) => { return { ...prevState, isReconnecting: false, } })
                log("Killed reconnect");
            })
        }, 10000);
    });


}


function loadListeners(state, setState, ros) {
    // Iterate and subscribe to each topic

    state.stats.forEach(stat => {

        // Ignore stat
        if (stat?.rosignore)
            return;

        // Create label for it in the listeners and add it to the dom
        // TODO

        // Init a new topic and subscribe to it
        new ROSLIB.Topic({
            ros: ros,
            name: stat.topic,
            messageType: stat.messageType
        }).subscribe(function (message) {
            // Uses the defined function in the listener topic
            // Allows for different treatment for different values
            let data;

            // Extract required data
            if (stat.getData === undefined)
                data = message.data;
            else
                data = stat.getData(message);

            setState((prevState) => {
                let found = prevState.stats.find((elem) => elem.id === stat.id);
                found.value = data;
                found.lastData = data;
                return { ...prevState, }
            })


        });
        log(`Subscribed to "${stat.name}" on "${stat.topic}"`);

    });

}

let exported = {
    initiateROS,
}

export default exported