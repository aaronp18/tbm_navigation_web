import express from "express";
import ROSLIB from "roslib";
var router = express.Router();

const { webLogger, rosLogger } = require("./logger");

var { publishRoutes } = require("./store");

router.get("/", (req, res) => {
    // res.render("main");
    res.send("This is the api route for publishing topics and keeping state");

});



router.post("/publish/:key/:value", (req, res) => {
    try {
        if (req.params.key in publishRoutes) {
            let msg = new ROSLIB.Message(req.params.value);
            publishRoutes[req.params.key].topic.publish(msg);
            rosLogger.info(`Published ${req.params.value} to ${req.params.value}`);
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


module.exports = router;