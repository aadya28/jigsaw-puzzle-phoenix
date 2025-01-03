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
    piece.setAttribute("draggable", "true");
    piece.style.opacity = "1";
    cell.style.border = "none"; // Reset the border when the piece is placed
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

// Function to check puzzle correctness
function checkPuzzleCorrectness() {
  const cells = document.querySelectorAll(".grid-cell");
  let correct = true;

  cells.forEach(cell => {
    const piece = cell.querySelector(".puzzle_piece");
    const cellIndex = cell.getAttribute("data-index");

    if (!piece || piece.id.replace("piece_", "") !== cellIndex) {
      correct = false;
    }
  });

  return correct;
}

function createSuccessModal() {
  // Create a container for the modal
  const modal = document.createElement('div');
  modal.classList.add('success-modal');

  // Create the message
  const message = document.createElement('p');
  message.innerText = 'You solved this, now go solve world peace!';
  
  // Create the OK button
  const okButton = document.createElement('button');
  okButton.innerText = 'OK';
  okButton.classList.add('ok-button');
  
  // Create the Go to Medium button
  const mediumButton = document.createElement('button');
  mediumButton.innerText = 'Go to Medium';
  mediumButton.classList.add('redirect-button');
  mediumButton.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:4000/medium';  // Replace this URL with the one you want
  });

  // Append elements to modal
  modal.appendChild(message);
  modal.appendChild(okButton);
  modal.appendChild(mediumButton);

  // Append the modal to the body
  document.body.appendChild(modal);

  // Handle OK button click (close the modal)
  okButton.addEventListener('click', () => {
    document.body.removeChild(modal); // Remove modal
  });
}


// Function to check if the grid is full
function isGridFull() {
  const cells = document.querySelectorAll(".grid-cell");
  return Array.from(cells).every(cell => cell.querySelector(".puzzle_piece"));
}

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

      if (piece && !cell.querySelector(".puzzle_piece")) {
        // Place the piece inside the grid cell
        cell.appendChild(piece);
        piece.setAttribute("draggable", "true"); // Allow re-dragging
        piece.style.opacity = "1";
        cell.style.border = "none";

        // Check if the grid is full
        if (isGridFull()) {
          setTimeout(() => {
            const isCorrect = checkPuzzleCorrectness();
            if (isCorrect) {
              createSuccessModal();
            } else {
              alert("Don't stress, some puzzles just require brains, not vibes :)");
            }
          }, 1000); // 1-second delay
        }

        // Send the piece drop event over the channel
        channel.push("piece_dropped", { pieceId, cellIndex });
      }
    });
  });
});
