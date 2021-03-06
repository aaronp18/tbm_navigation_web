

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
    var rotation = getRotationFromPose(pose);

    var labels = [
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
            "labelID": ".pitch-label",
            "updateFunction": updateText,
            "value": rotation.y
        },
        {
            "name": "Yaw",
            "labelID": ".yaw-label",
            "updateFunction": updateText,
            "value": rotation.z
        },

    ];

    labels.forEach((elem) => {
        elem.updateFunction(elem.labelID, elem.value)
    });


    // Update both current values
    axes.pitch["current-value"] = rotation.y;
    axes.yaw["current-value"] = rotation.z;



}

// Converts the pose quart orientation to radiens
function getRotationFromPose(pose) {
    var quart = new THREE.Quaternion(pose.orientation.x, pose.orientation.y, pose.orientation.z, pose.orientation.w);
    var rotation = new THREE.Euler().setFromQuaternion(quart, 'XYZ');
    return rotation;
}

// Creates a new label html for a topic and returns the html
function createNewLabel(name, id) {
    return `<p>${name}: <span id=${id}>N/A</span></p>`
}