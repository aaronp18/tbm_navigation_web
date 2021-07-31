

function log(text = "", showToast = true, header = "TBM Notification", delay = 5000) {
    console.log(text);
    if (showToast)
        createToast(text, header, delay);
}

// Creates a toast and adds it to the stack
function createToast(body = "", header = "TBM Notification", delay = 5000) {
    let id = Math.random().toString(36).substring(2, 15);

    let toastText = `<div class="toast" id="${id}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${delay}">
    <div class="toast-header">
     
      <strong class="me-auto">${header}</strong>
      <small class="text-muted">just now</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        ${body}
    </div>
  </div>`;

    // Add to DOM
    let t = $(".toast-container").prepend(toastText);

    // Get toast
    var tElem = document.getElementById(id)

    // Init toast
    // let toast = new bootstrap.Toast.getOrCreateInstance(tElem)
    let toast = bootstrap.Toast.getOrCreateInstance(tElem)

    toast.show();


}
