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

channel.on("puzzle_solved", (payload) => {
  createSuccessModal();
});

channel.on("puzzle_failed", (payload) => {
  alert("Don't stress, some puzzles just require brains, not vibes :)");
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
    const cellIndex = cell.getAttribute("data-index"); // e.g., "2_2"

    // Log the original data for debugging
    console.log(piece, cellIndex);

    if (!piece) {
      console.log("No piece in cell", cellIndex);
      correct = false;
    } else {
      // Extract only the numeric portion from piece.id (e.g., "2_2" from "piece_2_2-368e468c26ff8cc776f727dbd057b970")
      const pieceIndex = piece.id.match(/\d+_\d+/)?.[0]; // Extract "2_2"

      // Compare the extracted values
      if (pieceIndex !== cellIndex) {
        console.log(`Mismatch: pieceIndex (${pieceIndex}) != cellIndex (${cellIndex})`);
        correct = false;
      }
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

document.addEventListener("DOMContentLoaded", () => {
  const pieces = document.querySelectorAll(".puzzle_piece");
  const gridCells = document.querySelectorAll(".grid-cell");
  const containers = document.querySelectorAll(".pieces-container"); // Left and right containers

  let draggedPiece = null;

  // Handle drag start and end for pieces
  pieces.forEach(piece => {
    piece.addEventListener("dragstart", (e) => {
      draggedPiece = e.target;
      e.dataTransfer.setData("pieceId", e.target.id);
      e.target.style.opacity = "0.5";
      setTimeout(() => {
        draggedPiece.style.visibility = "hidden";
      }, 0);
    });

    piece.addEventListener("dragend", (e) => {
      e.target.style.opacity = "1";
      setTimeout(() => {
        draggedPiece.style.visibility = "visible";
        draggedPiece = null;
      }, 0);
    });
  });

  // Handle drag over for grid cells
  gridCells.forEach(cell => {
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
      cell.style.border = "2px solid #000";
    });

    cell.addEventListener("dragleave", () => {
      cell.style.border = "none";
    });

    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      const pieceId = e.dataTransfer.getData("pieceId");
      const piece = document.getElementById(pieceId);

      if (piece && !cell.querySelector(".puzzle_piece")) {
        cell.appendChild(piece);
        piece.setAttribute("draggable", "true");
        piece.style.opacity = "1";
        cell.style.border = "none";

        if (isGridFull()) {
          setTimeout(() => {
            const isCorrect = checkPuzzleCorrectness();

            if (isCorrect) {
              createSuccessModal();
              channel.push("puzzle_solved");
            } else {
              channel.push("puzzle_failed");
              alert("Don't stress, some puzzles just require brains, not vibes :)");
            }
          }, 1000);
        }

        channel.push("piece_dropped", { pieceId, cellIndex: cell.getAttribute("data-index") });
      }
    });
  });

  // Handle drag over and drop for containers
  containers.forEach(container => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop
      container.style.border = "2px dashed #ccc"; // Visual feedback
    });

    container.addEventListener("dragleave", () => {
      container.style.border = "none"; // Reset border
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();
      const pieceId = e.dataTransfer.getData("pieceId");
      const piece = document.getElementById(pieceId);

      if (piece) {
        container.appendChild(piece); // Move piece back to the container
        piece.setAttribute("draggable", "true");
        piece.style.opacity = "1";
        container.style.border = "none";

        // Notify the server about the change
        channel.push("piece_dropped", { pieceId, cellIndex: null }); // `cellIndex: null` indicates it’s back in the container
      }
    });
  });
});
