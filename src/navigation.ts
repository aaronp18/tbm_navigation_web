// File for all navigation related functions / processes

import * as options from "./options";

import { webLogger, rosLogger, telemLogger } from "./logger";
import { publishRoutes } from "./rosRoutes";

import * as THREE from 'three';
import ROSLIB from "roslib";

const R_EARTH = 6371000; //m

// Converts the pose quart orientation to radiens
function getRotationFromPose(pose: any) {
    var quart = new THREE.Quaternion(pose.orientation.x, pose.orientation.y, pose.orientation.z, pose.orientation.w);
    var rotation = new THREE.Euler().setFromQuaternion(quart, 'XYZ');
    return rotation;
}

// Takes origin lat lon, and adds on the displacement to calculate the current lat long 
function calculatePosition(dx: number, dy: number) {
    // Get the origin position
    let { lat, long } = getOrigin();

    // https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
    let new_latitude = lat + (dy / R_EARTH) * (180 / Math.PI);
    let new_longitude = long + (dx / R_EARTH) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {
        lat: new_latitude,
        long: new_longitude,
    }
}

function getOrigin() {
    return { lat: 36.925815, long: -76.274069 };
}

function publishPosition(lat: number, long: number) {
    // Publish Lat
    publishRoutes["latitude"].topic.publish(new ROSLIB.Message(lat));
    publishRoutes["longitude"].topic.publish(new ROSLIB.Message(long));
}


export {
    calculatePosition,
    getRotationFromPose,
    publishPosition,
}