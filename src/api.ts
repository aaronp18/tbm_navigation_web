import express from "express";
import ROSLIB from "roslib";
const router = express.Router();

import { webLogger, rosLogger } from "./logger";
import { publishRoutes, msgTypes, refreshAllParameters, params } from './rosRoutes';



router.get("/", (req, res) => {
    // res.render("main");
    res.send("This is the api route for publishing topics and keeping state");

});
router.get("/params/refresh", (req, res) => {
    // Refreshes all parameters
    rosLogger.info(`Refreshing all (${Object.keys(params).length}) parameters...`)
    refreshAllParameters();
    res.send({ success: true, message: `Refreshing all (${Object.keys(params).length}) parameters...` })
});



router.post("/publish/:key/:value", (req, res) => {
    try {
        if (req.params.key in publishRoutes) {
            // Extract the value
            let value: any;

            // Parse if required
            switch (publishRoutes[req.params.key].type) {
                case (msgTypes.FLOAT): {
                    value = parseFloat(req.params.value);
                    break;
                }
                default: {
                    value = req.params.value;
                }
            }



            let msg = new ROSLIB.Message({ data: value });
            publishRoutes[req.params.key].topic.publish(msg);
            rosLogger.info(`Published ${value} to ${publishRoutes[req.params.key].name} `);
            res.send({
                success: true,
                message: `Published ${value} to ${publishRoutes[req.params.key].name} `,

            });
        }
        else {
            rosLogger.info("Invalid Topic " + req.params.key);
            res.send({
                success: false,
                message: "Invalid Topic " + req.params.key,

            });
        }
    } catch (err) {
        rosLogger.error("Error: " + err);
        res.send({
            success: false,
            message: "Error: " + err,

        });
    }

})

router.get("/test/energy", (req, res) => {

    const func = () => {
        if (!send)
            return;
        setTimeout(() => func(), period + Math.random() * (period));

        publishRoutes["energy-consumption-pulse"].topic?.publish(new ROSLIB.Message({ data: Date.now() }));


    }
    // res.render("main");
    const period = 25; // 50ms
    const timeout = 5000; // 10 Seconds
    let send = true;



    func();

    setTimeout(() => {
        // Clear interval
        send = false;
        res.send({ message: `Running energy test with a period of ${period} ms for ${timeout / 1000} seconds... `, timeout, });
    }, timeout)


});



module.exports = router;