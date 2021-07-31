
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


