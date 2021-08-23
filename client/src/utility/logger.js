// Adds logging to the web client

function log(text = "", showToast = true, header = "TBM Notification", delay = 2000) {
    console.log(text);
    if (showToast) {
        // console.log("Toast")
    }

}

export {
    log,
}