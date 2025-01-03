document.addEventListener("DOMContentLoaded", function() {
    if (typeof window.puzzlePiecesData !== 'undefined' && typeof window.puzzlePiecesBasePath !== 'undefined') {
      const puzzlePieces = window.puzzlePiecesData;
      const basePath = window.puzzlePiecesBasePath;
      console.log(puzzlePieces);  
  
      // Function to generate puzzle pieces
      function generatePuzzlePieces() {
        let counter = 0; //
        puzzlePieces.forEach(piece => {
          const img = document.createElement('img');
          img.src = basePath + piece;
          img.id = piece.split('.')[0];  // Use the filename (without extension) as the ID
          img.className = "puzzle_piece";
          img.draggable = true;
  
          // Append to the appropriate container based on piece name (you can modify the condition)
          const containerId = counter % 2 === 0 ? "left-pieces" : "right-pieces";
          document.getElementById(containerId).appendChild(img);
          counter++;
        });
      }
  
      // Function to generate grid cells
      function generateGrid() {
        const gridContainer = document.querySelector('.grid-line');
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = `${i}_${j}`;
            gridContainer.appendChild(cell);
          }
        }
      }
  
      // Initialize puzzle once the page is loaded
      generatePuzzlePieces();
      generateGrid();
    } else {
      console.error("puzzlePiecesData or puzzlePiecesBasePath is undefined");
    }
  });
  