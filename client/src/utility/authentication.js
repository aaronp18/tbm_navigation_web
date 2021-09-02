
// Implemented authentication code to prevent spectators from unknowingly changing values
const AUTH = "warwickboring";

// Checks to see if the given authcode is correct.
const isAuthenticated = (authCode) => {
    if (authCode == AUTH) {
        // Then success!
        return true;
    }
    // Otherwise inform user
    console.log("Authentication error. Auth Code is incorrect.");
    return false;

}

let exports = {
    isAuthenticated,
}
export default exports