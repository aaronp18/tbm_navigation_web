import express from "express";
import ROSLIB from "roslib";
const router = express.Router();

import { webLogger, rosLogger } from "./logger";
import { publishRoutes, msgTypes, refreshAllParameters, params } from './rosRoutes';

import { isConnectedMiddleWare } from './middleware';

import * as THREE from 'three'
import { Euler, Vector3 } from "three";
import { calculateRealPosition } from "./navigation";


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
        res.send({ message: `Running energy test with a period of ${period} ms for ${timeout / 1000} seconds... `, timeout, success: true, });
    }, timeout)


});

// Sends a series of position values to be mapped on the client
router.get("/3d", isConnectedMiddleWare, (req, res) => {
    let intervalID: NodeJS.Timer;

    let pos = new THREE.Vector3(0, 0, 0);
    let b = new THREE.Vector3(0.1, 0, 0);
    let o = new THREE.Euler()

    let pose;

    intervalID = setInterval(() => {
        pos.addVectors(pos, b);

        pose = new ROSLIB.Pose({
            position: pos,
            orientation: o,
        })

        publishRoutes["ch"].topic?.publish(new ROSLIB.Message(pose));


        // Publish

    }, 100)

    // Set a timeout on when to stop
    setTimeout(() => {
        res.send({ message: `Running 3D Model Test for ${5000}ms`, success: true, });
        clearInterval(intervalID);
    }, 5000)


});

router.get("/realposition/", (req, res) => {
    let position = new Vector3(0,5,0);
    let rotation = new Euler(0,0,Math.PI / 6); // 30 degs

    let real = calculateRealPosition(position, rotation, Math.PI / 6);

    let msg = `Initial Position: ${position.toArray()}
    Rotation: ${rotation.toArray()}
    Real: ${real.toArray()}
    `;

    webLogger.info(msg);

    res.send({message: msg, success: true})



})


module.exports = router;