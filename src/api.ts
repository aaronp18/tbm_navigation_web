import express from "express";
import ROSLIB from "roslib";
const router = express.Router();

import { webLogger, rosLogger } from "./logger";
import { publishRoutes, msgTypes, refreshAllParameters, params, listenerTopics } from './rosRoutes';

import { isConnectedMiddleWare } from './middleware';

import { calculateDelta } from './navigation'



router.get("/", (req, res) => {
    // res.render("main");
    res.send("This is the api route for publishing topics and keeping state");

});
router.get("/params/refresh", isConnectedMiddleWare, (req, res) => {
    // Refreshes all parameters
    rosLogger.info(`Refreshing all (${Object.keys(params).length}) parameters...`)
    refreshAllParameters();
    res.send({ success: true, message: `Refreshing all (${Object.keys(params).length}) parameters...` })
});



router.post("/publish/:key/:value", isConnectedMiddleWare, (req, res) => {
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
                case (msgTypes.BOOL): {
                    value = req.params.value === "true";
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

// Routes to recalcuate pitch and yaw
router.get("/recalculate/pitch", isConnectedMiddleWare, (req, res) => {
    calculateDelta(listenerTopics.pitchTarget.lastData || 0, "pitch")
    res.send({
        success: true,
        message: `Recalculated Pitch Delta`,

    });
});
router.get("/recalculate/yaw", isConnectedMiddleWare, (req, res) => {
    calculateDelta(listenerTopics.yawTarget.lastData || 0, "yaw")
    res.send({
        success: true,
        message: `Recalculated Yaw Delta`,

    });
});



module.exports = router;