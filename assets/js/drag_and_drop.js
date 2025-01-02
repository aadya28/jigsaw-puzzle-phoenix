
document.addEventListener("DOMContentLoaded", () => {
    const pieces = document.querySelectorAll(".puzzle_piece");
    const gridCells = document.querySelectorAll(".grid-cell");

    let draggedPiece = null;

    pieces.forEach(piece => {
        piece.addEventListener("dragstart", (e) => {
            draggedPiece = e.target;
            e.dataTransfer.setData("pieceId", e.target.id);
            // Make the image slightly transparent during dragging
            e.target.style.opacity = "0.5";
            setTimeout(() => {
                draggedPiece.style.visibility = "hidden"; // Hide piece during drag
            }, 0);
        });


        piece.addEventListener("dragend", (e) => {
            // Reset opacity when dragging ends
            e.target.style.opacity = "1";
            setTimeout(() => {
                draggedPiece.style.visibility = "visible"; // Make piece visible again
                draggedPiece = null; // Reset dragged piece
            }, 0);
        });
    });

    // Handle drag over
    gridCells.forEach(cell => {
        cell.addEventListener("dragover", (e) => {
            e.preventDefault(); // Allow drop
            cell.style.border = "1px solid #000"; // Change border style when hovering
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
            }
        });
    });
});