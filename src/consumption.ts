import { DoublyLinkedList, DoublyLinkedListNode } from "@datastructures-js/linked-list";
import ROSLIB from "roslib";

import { webLogger, rosLogger } from "./logger";
import { publishRoutes } from "./rosRoutes";

import * as optionsF from './options' // Options from file


type Consumption = {
    "rate": number,
    "total": number,
    "previous": DoublyLinkedList<number>, // Timestamps of all consumption pulses
    "pulseValue": number, // Value of one pulse
    "rateTopicName": string,
    "totalTopicName": string,
}



let consumptions: { [name: string]: Consumption; } = {
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

function addConsumptionPulse(timestamp: number, options: { consumptionType: string },) {
    // Check if exists in map
    if (!(options.consumptionType in consumptions)) {
        webLogger.error(`No ${options.consumptionType} in consumptions`);
        return;

    }
    console.log(timestamp);

    // Add to the list of consumptions
    consumptions[options.consumptionType].previous.insertFirst(timestamp);

    // Add to total
    consumptions[options.consumptionType].total += consumptions[options.consumptionType].pulseValue;



    // Calculate rate from last 1 second
    let recentPulses = consumptions[options.consumptionType].previous.filter((node, position) => {
        // Get all from last second
        return node.getValue() > Date.now() - optionsF.AVERAGEPERIOD;
    })

    consumptions[options.consumptionType].rate = recentPulses.count() / optionsF.AVERAGEPERIOD;

    // Publish new value
    let rateTopicName = consumptions[options.consumptionType].rateTopicName;
    let totalTopicName = consumptions[options.consumptionType].rateTopicName;

    publishRoutes[rateTopicName].topic.publish(new ROSLIB.Message(consumptions[options.consumptionType].rate));
    publishRoutes[totalTopicName].topic.publish(new ROSLIB.Message(consumptions[options.consumptionType].total));


}

export {
    addConsumptionPulse
}