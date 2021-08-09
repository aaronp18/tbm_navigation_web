

// Rounds to 2 decimal points
function round2dp(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;

}

// Updates angle text which is rounded to 2 dp
function updateAngleText(id, value) {

    // Update the Current value text
    $(id).val(round2dp(value));
    $(id).text(round2dp(value));

    // Update and animate simulation
    //TODO
}
// Sets slider postion
function setSliderPosition(elemID, angle) {
    $(elemID).val(angle);
    $(elemID).trigger("change");
}

// Updates the given element with the given text
function updateText(id, value) {
    $(id).text(value);
}

// Updates the position text
function updatePositionText(id, pose) {

    // Convert quart -> euler
    var quart = new THREE.Quaternion(pose.orientation.x, pose.orientation.y, pose.orientation.z, pose.orientation.w)
    var rotation = new THREE.Euler().setFromQuaternion(quart, 'XYZ');

    var { lat, long } = calculatePosition(getOrigin().lat, getOrigin.long, pose.position.x, pose.position.y)
    // console.log(quart)
    var labels = [

        {
            "name": "Longitude",
            "labelID": "#longitude",
            "updateFunction": updateText,
            "value": lat,
        },
        {
            "name": "Latitude",
            "labelID": "#latitude",
            "updateFunction": updateText,
            "value": long,
        },
        {
            "name": "X",
            "labelID": "#x",
            "updateFunction": updateText,
            "value": pose.position.x
        },
        {
            "name": "Y",
            "labelID": "#y",
            "updateFunction": updateText,
            "value": pose.position.y
        },
        {
            "name": "Z",
            "labelID": "#z",
            "updateFunction": updateText,
            "value": pose.position.z
        },

        {
            "name": "Roll",
            "labelID": "#roll",
            "updateFunction": updateText,
            "value": rotation.x
        },
        {
            "name": "Pitch",
            "labelID": "#pitch",
            "updateFunction": updateText,
            "value": rotation.y
        },
        {
            "name": "Yaw",
            "labelID": "#heading",
            "updateFunction": updateText,
            "value": rotation.z
        },

    ];

    labels.forEach((elem) => {
        elem.updateFunction(elem.labelID, elem.value)
    })
}

// Takes orgin lat lon, and adds on the displacement to calculate the current lat long 
function calculatePosition(lat, long, dx, dy) {
    // https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
    new_latitude = lat + (dy / r_earth) * (180 / pi);
    new_longitude = long + (dx / r_earth) * (180 / pi) / cos(lat * pi / 180);

    return {
        lat: new_latitude,
        long: new_longitude,
    }
}

function getOrigin() {
    return { lat: 36.925815, long: -76.274069 }
}