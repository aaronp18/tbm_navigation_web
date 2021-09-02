
import express from "express";
import { webLogger, rosLogger } from "./logger";


import { isConnected } from './index';


const isConnectedMiddleWare = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (isConnected) {
        next();
    }
    else {
        res.send({
            success: false,
            message: "Not connected to ROS Bridge Server. Is it on?",

        });
        rosLogger.error("Not connected to ROS Bridge Server. Is it on?")
        return;
    }
}

export {
    isConnectedMiddleWare,
}