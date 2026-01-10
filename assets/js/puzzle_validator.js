// Puzzle validation and completion handling
// Used on: /jigsaw/:image_id/:level page
// Exports: checkPuzzleCorrectness, isGridFull, createSuccessModal

// Check if all pieces are placed in correct positions
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

// Check if all grid cells have pieces placed
function isGridFull() {
  const cells = document.querySelectorAll(".grid-cell");
  return Array.from(cells).every(cell => cell.querySelector(".puzzle_piece"));
}

// Create success modal with navigation options
function createSuccessModal() {
  // Create a container for the modal
  const modal = document.createElement('div');
  modal.classList.add('success-modal');

  // Create the message
  const message = document.createElement('p');
  message.innerText = 'You solved this, now go solve world peace!';
  
  // Create the Home button
  const homeButton = document.createElement('button');
  homeButton.innerText = 'Home';
  homeButton.classList.add('home-button');
  
  // Add click handler to Home button to redirect to home page
  homeButton.addEventListener('click', () => {
    window.location.href = `${window.location.origin}/jigsaw`;
  });
  
  // Create the Next Puzzle button
  const nextPuzzleButton = document.createElement('button');
  const levels = ["easy", "medium", "hard"];

  // Parse the path from the current URL
  const path = window.location.pathname;
  console.log(window.location.href);
  console.log(path);

  // Split the path to extract the selected image and level
  const pathSegments = path.split('/');
  const selectedImage = decodeURIComponent(pathSegments[2]);
  const selectedLevel = decodeURIComponent(pathSegments[3]);

  // Log the values for debugging
  console.log("Selected Image:", selectedImage);
  console.log("Selected Level:", selectedLevel);

  // Initialize nextLevel in outer scope
  let nextLevel = null;

  // Find the index of the selected level and set the next level
  let idx = -1;
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] === selectedLevel) {
      idx = i + 1;
      break; // Exit loop once match is found
    }
  }

  if (idx !== -1 && idx < levels.length) {
    nextLevel = levels[idx];
    console.log("Next Level:", nextLevel);
  } else if (idx === levels.length) {
    // At the end of levels (hard level completed), show only Home button
    console.log("No next level available. At the last level (hard).");
  } else {
    console.error("Selected level not found in levels array.");
  }

  // Append message and Home button to modal
  modal.appendChild(message);
  modal.appendChild(homeButton);

  // Only add Next Puzzle button if there is a next level
  if (nextLevel) {
    nextPuzzleButton.innerText = 'Next Puzzle';
    nextPuzzleButton.classList.add('next-puzzle-button');
    nextPuzzleButton.addEventListener('click', () => {
      const targetUrl = `${window.location.origin}/jigsaw/${selectedImage}/${nextLevel}`;
      console.log("Redirecting to: " + targetUrl);
      window.location.href = targetUrl;
    });

    modal.appendChild(nextPuzzleButton);
  }

  // Append the modal to the body
  document.body.appendChild(modal);
}

// Create failure modal with retry option
function createFailureModal() {
  // Create a container for the modal
  const modal = document.createElement('div');
  modal.classList.add('failure-modal');

  // Create the message
  const message = document.createElement('p');
  message.innerText = "Don't stress, some puzzles just require brains, not vibes :)";

  // Create the Home button
  const homeButton = document.createElement('button');
  homeButton.innerText = 'Home';
  homeButton.classList.add('home-button');

  // Add click handler to Home button to redirect to home page
  homeButton.addEventListener('click', () => {
    window.location.href = `${window.location.origin}/jigsaw`;
  });
  
  // Create the Retry button
  const retryButton = document.createElement('button');
  retryButton.innerText = 'Retry';
  retryButton.classList.add('retry-button');
  
  // Add click handler to Retry button to reload the current page
  retryButton.addEventListener('click', () => {
    window.location.reload();
  });

  // Append elements to modal
  modal.appendChild(message);
  modal.appendChild(homeButton);
  modal.appendChild(retryButton);

  // Append the modal to the body
  document.body.appendChild(modal);
}

// Export functions for use by other modules
export { checkPuzzleCorrectness, isGridFull, createSuccessModal, createFailureModal };

// Make functions available globally for multiplayer_sync.js
window.createSuccessModal = createSuccessModal;
window.createFailureModal = createFailureModal;
