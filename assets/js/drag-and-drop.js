document.addEventListener("DOMContentLoaded", () => {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const dropZones = document.querySelectorAll(".drop-zone");

    let draggedPiece = null;

    // Handle drag start
    pieces.forEach(piece => {
        piece.addEventListener("dragstart", (e) => {
            draggedPiece = e.target;
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    });

    // Handle drag over
    dropZones.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault(); // Allow drop
        });

        // Handle drop
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            const pieceId = e.dataTransfer.getData("text/plain");
            const piece = document.getElementById(pieceId);

            // Append the piece to the drop zone
            if (zone.children.length === 0) {
                zone.appendChild(piece);
            }
        });
    });
});
