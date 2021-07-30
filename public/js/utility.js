
// Rounds to 2 decimal points
function round2dp(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;

}