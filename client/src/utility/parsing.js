// This file contains all the necessary functions to parse data for the UI such as rounding and conversion to degrees.

function convertToDegrees(radians) {
    return (radians) * 180 / Math.PI;
}
function convertToRadians(degrees) {
    return (degrees) * Math.PI / 180;
}

function roundTo2dp(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
function roundTo5dp(value) {
    return Math.round((value + Number.EPSILON) * 100000) / 100000;
}
function roundTo7dp(value) {
    return Math.round((value + Number.EPSILON) * 10000000) / 10000000;
}

// Returns actual value (rounded) + degree
function parseAngle(radian) {
    return `${roundTo5dp(radian)} (${roundTo2dp(convertToDegrees(radian))}°)`
}

const exported = {
    convertToDegrees,
    convertToRadians,
    roundTo2dp,
    roundTo5dp,
    roundTo7dp,
    parseAngle,
}

export default exported