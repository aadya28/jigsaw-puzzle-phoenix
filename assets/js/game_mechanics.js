// Drag and drop game mechanics
// Used on: /jigsaw/:image_id/:level page
// Imports: channel from multiplayer_sync.js, validation functions from puzzle_validator.js

import { channel } from "./multiplayer_sync.js";
import { checkPuzzleCorrectness, isGridFull, createSuccessModal, createFailureModal } from "./puzzle_validator.js";

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

        // Check if puzzle is complete after placing piece
        if (isGridFull()) {
          setTimeout(() => {
            const isCorrect = checkPuzzleCorrectness();

            if (isCorrect) {
              createSuccessModal();
              channel.push("puzzle_solved");
            } else {
              createFailureModal();
              channel.push("puzzle_failed");
            }
          }, 1000);
        }

        // Broadcast piece placement to other players
        channel.push("piece_dropped", { pieceId, cellIndex: cell.getAttribute("data-index") });
      }
    });
  });

  // Handle drag over and drop for containers (return pieces to side)
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
        channel.push("piece_dropped", { pieceId, cellIndex: null }); // `cellIndex: null` indicates it's back in the container
      }
    });
  });
});
