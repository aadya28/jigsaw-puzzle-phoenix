import { Socket } from "phoenix";

// Set up WebSocket connection
let socket = new Socket("/socket", { params: { token: window.userToken } });
socket.connect();

// Join the "puzzle:lobby" channel
let channel = socket.channel("puzzle:lobby", {});

// Listen for a "piece_dropped" event from the channel
channel.on("piece_dropped", payload => {
  const { pieceId, cellIndex } = payload;
  const piece = document.getElementById(pieceId);
  const cell = document.querySelector(`[data-index='${cellIndex}']`);

  if (piece && cell) {
    cell.appendChild(piece);
    piece.setAttribute("draggable", "false");
    piece.style.opacity = "1";
    cell.style.border = "none"; // Reset the border when the piece is placed correctly
  }
});

// Join the channel
channel.join()
  .receive("ok", resp => { 
    console.log("Joined successfully", resp); 
  })
  .receive("error", resp => { 
    console.log("Unable to join", resp); 
  });

// Handle drag and drop logic
document.addEventListener("DOMContentLoaded", () => {
  const pieces = document.querySelectorAll(".puzzle_piece");
  const gridCells = document.querySelectorAll(".grid-cell");

  let draggedPiece = null;

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", (e) => {
      draggedPiece = e.target;
      e.dataTransfer.setData("pieceId", e.target.id);
      e.target.style.opacity = "0.5"; // Make the image slightly transparent during dragging
      setTimeout(() => {
        draggedPiece.style.visibility = "hidden"; // Hide piece during drag
      }, 0);
    });

    piece.addEventListener("dragend", (e) => {
      e.target.style.opacity = "1"; // Reset opacity when dragging ends
      setTimeout(() => {
        draggedPiece.style.visibility = "visible"; // Make piece visible again
        draggedPiece = null; // Reset dragged piece
      }, 0);
    });
  });

  // Handle drag over for grid cells
  gridCells.forEach(cell => {
    cell.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop
      cell.style.border = "2px solid #000"; // Change border style when hovering
    });

    // Handle drag leave
    cell.addEventListener("dragleave", () => {
      cell.style.border = "none"; // Reset border style when leaving
    });

    // Handle drop
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
        cell.style.border = "none";

        // Send the piece drop event over the channel
        channel.push("piece_dropped", { pieceId, cellIndex });
      } else {
        cell.style.border = "none"; // Reset border when not matching
      }
    });
  });
});
