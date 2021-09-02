import express from "express";
import ROSLIB from "roslib";
const router = express.Router();

import { webLogger, rosLogger } from "./logger";
import { publishRoutes, msgTypes, refreshAllParameters, params } from './rosRoutes';

import { isConnectedMiddleWare } from './middleware';


router.get("/energy", isConnectedMiddleWare, (req, res) => {

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

router.get("/pos", isConnectedMiddleWare, (req, res) => {

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