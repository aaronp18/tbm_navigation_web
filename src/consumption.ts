import { DoublyLinkedList, DoublyLinkedListNode } from "@datastructures-js/linked-list";
import ROSLIB from "roslib";

import { webLogger, rosLogger } from "./logger";
import { publishRoutes, params } from "./rosRoutes";

import * as optionsF from './options' // Options from file


type Consumption = {
    "rate": number,
    "total": number,
    "previous": DoublyLinkedList<number>, // Timestamps of all consumption pulses
    "pulseValue": number, // Value of one pulse
    "rateTopicName": string,
    "totalTopicName": string,
}



const consumptions: { [name: string]: Consumption; } = {
    "water": {
        "rate": 0,
        "total": 0,
        "previous": new DoublyLinkedList(),
        "pulseValue": 1,
        "rateTopicName": "water-consumption-rate",
        "totalTopicName": "water-consumption-total",
    },
    "energy": {
        "rate": 0,
        "total": 0,
        "previous": new DoublyLinkedList(),
        "pulseValue": 1,
        "rateTopicName": "energy-consumption-rate",
        "totalTopicName": "energy-consumption-total",
    },
}

function startConsumptionSend() {
    Object.entries(consumptions).forEach(([key, consumption]) => {
        setInterval(() => {
            if (params[key + "GraphOn"].value === true)
                calculateRateTotal(key);
        }, optionsF.CONSUMPTION_UPDATE_INTERVAL);
    })
}

function addConsumptionPulse(timestamp: any, options: { consumptionType: string },) {
    // Check if exists in map
    if (!(options.consumptionType in consumptions)) {
        webLogger.error(`No ${options.consumptionType} in consumptions`);
        return;

    }
    timestamp = timestamp.data;
    // console.log(timestamp);

    // Add to the list of consumptions
    consumptions[options.consumptionType].previous.insertFirst(timestamp);

    if (consumptions[options.consumptionType].previous.count() > optionsF.CONSUMPTION_CACHE_SIZE) {
        // Remove last
        consumptions[options.consumptionType].previous.removeLast();
    }

    // Add to total
    consumptions[options.consumptionType].total += consumptions[options.consumptionType].pulseValue;





}

function calculateRateTotal(consumptionType: string) {
    const now = Date.now();

    // Calculate rate from last 1 second
    const recentPulses = consumptions[consumptionType].previous.filter((node, position) => {
        // Get all from last second
        return node.getValue() > (now - optionsF.AVERAGE_PERIOD);
    })

    const x = (recentPulses.count() / (optionsF.AVERAGE_PERIOD / 1000.0));
    consumptions[consumptionType].rate = x;

    // console.log("Count: " + recentPulses.count() + "/" + consumptions[consumptionType].previous.count() + " >>> " + consumptions[consumptionType].rate)



    // Publish new value
    const rateTopicName = consumptions[consumptionType].rateTopicName;
    const totalTopicName = consumptions[consumptionType].totalTopicName;

    // console.log(consumptions[consumptionType].rate);
    publishRoutes[rateTopicName].topic.publish(new ROSLIB.Message({ data: consumptions[consumptionType].rate }));
    publishRoutes[totalTopicName].topic.publish(new ROSLIB.Message({ data: consumptions[consumptionType].total }));
}

export {
    addConsumptionPulse,
    calculateRateTotal,
    startConsumptionSend,
}