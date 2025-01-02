// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken}
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

document.addEventListener("DOMContentLoaded", () => {
  const pieces = document.querySelectorAll(".pieces-container img");
  const gridCells = document.querySelectorAll(".grid-cell");

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("pieceId", e.target.id);
      // Make the image slightly transparent during dragging
      e.target.style.opacity = "0.5";
  });

  piece.addEventListener("dragend", (e) => {
      // Reset opacity when dragging ends
      e.target.style.opacity = "1";
  });
});

  gridCells.forEach(cell => {
      cell.addEventListener("dragover", (e) => {
          e.preventDefault();
      });

      cell.addEventListener("drop", (e) => {
          e.preventDefault();
          const pieceId = e.dataTransfer.getData("pieceId");
          const piece = document.getElementById(pieceId);
          const cellIndex = cell.getAttribute("data-index");

          // Check if the dropped piece's id matches the cell's data-index
          if (pieceId.replace('piece_', '') === cellIndex) {
              // Place the piece inside the grid cell
              cell.appendChild(piece);
              piece.setAttribute("draggable", "false"); // Disable further dragging
              piece.style.opacity = "1";
          }
      });
  });
});



