// File for all navigation related functions / processes

import * as options from "./options";

import { webLogger, rosLogger, telemLogger } from "./logger";
import { publishRoutes, params, listenerTopics } from "./rosRoutes";

import { DoublyLinkedList, DoublyLinkedListNode } from "@datastructures-js/linked-list";


import * as THREE from 'three';
import ROSLIB, { Ros } from "roslib";

const R_EARTH = 6371000; // m

type PositionStamped = {
    position: THREE.Vector3,
    time: number,
}

type Delta = {
    delta: number,
    time: number,
}

let prevPoses: DoublyLinkedList<PositionStamped> = new DoublyLinkedList(); // Previous positions with timestamp.
let deltas: DoublyLinkedList<Delta> = new DoublyLinkedList(); // Previous positions with timestamp.

let totalDistance = 0;

type Phase = {
    id: string,
    title: string,
    option?: {
        targetPitch?: number,
        on?: boolean
    },
    color: string,

}

const phases: { [id: string]: Phase } = {
    // Gets     
    launch: {
        id: "launch",
        title: "Launch",
        option: {
            targetPitch: null,
        },
        color: "green",
    },
    cruise: {
        id: "cruise",
        title: "Cruise",
        option: {
            targetPitch: 0,
        },
        color: "grey",
    },
    exit: {
        id: "exit",
        title: "Exit",
        option: {
            targetPitch: null,
        },
        color: "grey",
    },
    stop: {
        id: "stop",
        title: "Stop",
        option: {
            on: false,
        },
        color: "grey",
    },
}
// Converts the pose quart orientation to radiens
function getRotationFromPose(pose: any) {
    const quart = new THREE.Quaternion(pose.orientation.x, pose.orientation.y, pose.orientation.z, pose.orientation.w);
    const rotation = new THREE.Euler().setFromQuaternion(quart, 'XYZ');
    return rotation;
}

function publishRotation(rotation: THREE.Euler) {
    publishRoutes.roll.topic.publish(new ROSLIB.Message({ data: rotation.x }));
    publishRoutes.pitch.topic.publish(new ROSLIB.Message({ data: rotation.y }));
    publishRoutes.yaw.topic.publish(new ROSLIB.Message({ data: rotation.z }));
}

// Takes origin lat lon, and adds on the displacement to calculate the current lat long
function calculatePosition(dx: number, dy: number) {
    // Get the origin position
    const { lat, long } = getOrigin();

    // https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
    const new_latitude = lat + (dy / R_EARTH) * (180 / Math.PI);
    const new_longitude = long + (dx / R_EARTH) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {
        lat: new_latitude,
        long: new_longitude,
    }
}

// Get the origin from parameters
function getOrigin() {
    return { lat: params.originLat.value, long: params.originLong.value };
}

function publishPosition(lat: number, long: number) {
    // Publish Lat
    publishRoutes.latitude.topic.publish(new ROSLIB.Message({ data: lat }));
    publishRoutes.longitude.topic.publish(new ROSLIB.Message({ data: long }));
}

function publishDisplacement(displacement: ROSLIB.Vector3) {
    publishRoutes.x.topic.publish(new ROSLIB.Message({ data: displacement.x }));
    publishRoutes.y.topic.publish(new ROSLIB.Message({ data: displacement.y }));
    publishRoutes.z.topic.publish(new ROSLIB.Message({ data: displacement.z }));

}

// Calcualtes and publishes data obtained from the given cutterhead pose.
function poseUpdate(pose: ROSLIB.Pose) {
    // Calculate rotation
    publishRotation(getRotationFromPose(pose));

    // Calculate latLong from origin
    const { lat, long } = calculatePosition(pose.position.x, pose.position.y);
    publishPosition(lat, long);

    // Publish position/displacement (x,y,z)
    publishDisplacement(pose.position);

    let newStampedPosition: PositionStamped = {
        position: new THREE.Vector3(pose.position.x, pose.position.y, pose.position.z),
        time: Date.now(),
    }

    // Add pose to list
    let node = prevPoses.insertFirst(newStampedPosition);

    let previouseNode = node.getNext();
    if (previouseNode !== null) {
        // Calculate the difference
        let delta = newStampedPosition.position.distanceTo(previouseNode?.getValue().position);

        // Add delta to linked list
        deltas.insertFirst({
            delta: delta,
            time: Date.now(),
        });

        // Update total distance with the delta
        totalDistance += delta;


    }



}

function startDistanceSend() {
    setInterval(() => {
        if (params["distanceGraphOn"].value === true)
            distanceCalculate();
    }, options.CONSUMPTION_UPDATE_INTERVAL);
}

// Calculates from the last second of poses
function distanceCalculate() {
    const now = Date.now();

    // Calculate rate from last 1 second
    const recentDeltas = deltas.filter((node, position) => {
        // Get all from last second
        return node.getValue().time > (now - options.AVERAGE_PERIOD);
    })

    let subtotal = 0;

    recentDeltas.forEach((node, pos) => {
        subtotal += node.getValue().delta;

    })

    const rate = (subtotal / (options.AVERAGE_PERIOD / 1000.0)) * 1000; // x1000 to get mm/s

    publishRoutes["distance-rate"].topic.publish(new ROSLIB.Message({ data: rate }));

    // Update distance total
    publishRoutes["distance-total"].topic.publish(new ROSLIB.Message({ data: totalDistance }));


}

function handlePhaseChange(message: any) {
    let phaseID = message.data;
    let phase = phases[phaseID];

    if (phase.option.targetPitch !== undefined) {

        publishRoutes["pitch-target"].topic.publish(new ROSLIB.Message({ data: phase.option.targetPitch }));

        calculateDelta(phase.option.targetPitch, "pitch");
    }


}

// Calculates the delta between the target and current and publishes to the delta topic.
function calculateDelta(target: number, axis: string) {
    // Then set target pitch by calculating delta required
    let current = listenerTopics[axis + "Current"].lastData || 0;

    let delta = target - current;

    publishRoutes[axis + "-delta"].topic.publish(new ROSLIB.Message({ data: delta }));
}


export {
    poseUpdate,
    handlePhaseChange,
    phases,
    calculateDelta,
    startDistanceSend,
}