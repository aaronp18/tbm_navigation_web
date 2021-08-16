

function log(text = "", showToast = true, header = "TBM Notification", delay = 2000) {
  console.log(text);
  if (showToast)
    createToast(text, header, delay);
}

// Creates a toast and adds it to the stack
function createToast(body = "", header = "TBM Notification", delay = 2000) {

  let id = generateRandomID();

  // Smaller toast
  toastText = `<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="${id}" data-bs-delay="${delay}">
    <div class="d-flex">
      <div class="toast-body">
      ${body}
     </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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

function generateRandomID() {
  return Math.random().toString(36).substring(2, 15);
}