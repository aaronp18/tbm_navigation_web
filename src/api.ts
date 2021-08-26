import express from "express";
import ROSLIB from "roslib";
const router = express.Router();

import { webLogger, rosLogger } from "./logger";
import { publishRoutes } from './rosRoutes';

router.get("/", (req, res) => {
    // res.render("main");
    res.send("This is the api route for publishing topics and keeping state");

});



router.post("/publish/:key/:value", (req, res) => {
    try {
        if (req.params.key in publishRoutes) {
            const msg = new ROSLIB.Message(req.params.value);
            publishRoutes[req.params.key].topic.publish(msg);
            rosLogger.info(`Published ${req.params.value} to ${publishRoutes[req.params.key].name}`);
            res.send({
                success: true,
                message: `Published ${req.params.value} to ${publishRoutes[req.params.key].name}`,

            });
        }
        else {
            res.send({
                success: false,
                message: "Invalid Topic " + req.params.key,

            });
        }
    } catch (err) {
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
    let period = 20; // 50ms
    let timeout = 10000; // 10 Seconds
    let send = true;
    func();

    setTimeout(() => {
        // Clear interval
        send = false;
    }, timeout)

    res.send(`Running energy test with a period of ${period}ms for ${timeout / 1000} seconds... `);

});



module.exports = router;