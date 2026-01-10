// Puzzle board initialization - grid generation, piece placement, and background
// Used on: /jigsaw/:image_id/:level page

document.addEventListener("DOMContentLoaded", function() {
  // Only run if we're on the puzzle page
  if (typeof window.puzzlePiecesData !== 'undefined' && typeof window.puzzlePiecesPath !== 'undefined') {
    const puzzlePieces = window.puzzlePiecesData;
    const puzzlePiecesPath = window.puzzlePiecesPath;
    const level = window.level;

    // Set background image based on difficulty level
    function setBackground(level) {
      document.body.style.backgroundImage = `url('/images/backgrounds/${level}-bg.jpg')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    }
  
    // Generate puzzle pieces and distribute them to left/right containers
    function generatePuzzlePieces() {
      let counter = 0; 
      puzzlePieces.forEach(piece => {
        const img = document.createElement('img');
        img.src = '/' + puzzlePiecesPath + '/' + piece;
        img.id = piece.split('.')[0];  // Use the filename (without extension) as the ID
        img.className = "puzzle_piece";
        img.draggable = true;

        // Alternate pieces between left and right containers
        const containerId = counter % 2 === 0 ? "left-pieces" : "right-pieces";
        document.getElementById(containerId).appendChild(img);
        counter++;
      });
    }

    // Generate grid cells based on difficulty level
    function generateGrid(rows, columns) {
      const gridContainer = document.querySelector('.grid-line');
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          cell.dataset.index = `${i}_${j}`;
          gridContainer.appendChild(cell);
        }
      }
    }

    // Initialize puzzle board
    setBackground(level);
    generatePuzzlePieces();
    
    // Generate appropriate grid based on difficulty
    if (level === "easy") {
      generateGrid(3, 3);
    } else if (level === "medium") {
      generateGrid(5, 5);
    } else if (level === "hard") {
      generateGrid(10, 10);
    } else {
      console.error("Unknown level:", level);
    }
  }
});
