// This js file has code to insert images in easy page, select images and choose level

document.addEventListener("DOMContentLoaded", function() {
  if (typeof window.originalImagesData !== 'undefined' && typeof window.originalImagesBasePath !== 'undefined') {
      const originalImages = window.originalImagesData;
      const basePath = window.originalImagesBasePath;

      // Function to generate image selection items dynamically
      function generateImageSelection() {
          const gridContainer = document.getElementById("image-selection-grid");

          if (gridContainer) {
              originalImages.forEach(image => {
                  const imageSelectItem = document.createElement("div");
                  imageSelectItem.classList.add("image-select-item");
                  imageSelectItem.dataset.image = image;

                  const img = document.createElement("img");
                  img.src = basePath + image;
                  img.alt = "Puzzle Image " + image;

                  // Add click event listener to image select item
                  imageSelectItem.addEventListener("click", function() {
                      // Extract the base part of the filename
                      console.log(image);

                      const image_name_list = image.split('-'); 
                      console.log(image_name_list);

                      const selectedImageId = image_name_list[1];
                      console.log(selectedImageId);

                      window.selectedImageId = selectedImageId;
                      console.log(window.selectedImageId);

                      // Hide the image selection grid and header
                      gridContainer.style.display = 'none';
                      document.querySelector('h1').style.display = 'none';

                      // Show the level selection and header
                      document.getElementById('level-selection').style.display = 'flex';
                      document.querySelectorAll('h1')[1].style.display = 'block';
                  });

                  imageSelectItem.appendChild(img);
                  gridContainer.appendChild(imageSelectItem);
              });
          } else {
              console.error("image-selection-grid container not found.");
          }
      }

      // Initialize the image selection
      generateImageSelection();
  } else {
      console.error("originalImagesData or originalImagesBasePath is undefined");
  }

  // Select all level items
  const levelItems = document.querySelectorAll('.level-item');

  // Add click event listener to each level item
  levelItems.forEach(item => {
      item.addEventListener('click', function () {
          // Remove 'selected' class from all items
          levelItems.forEach(item => item.classList.remove('selected'));

          // Add 'selected' class to the clicked item
          this.classList.add('selected');

          // Get the selected level
          const selectedLevel = this.dataset.level;

          // Store the selected level data
          window.selectedLevel = selectedLevel;

          // Construct the URL in the format /jigsaw/:image_id/:level
          const imageId = window.selectedImageId;
          const targetUrl = `/jigsaw/${imageId}/${selectedLevel}`;

          // Redirect to the constructed URL
          window.location.href = targetUrl;
      });
  });

  if (typeof window.puzzlePiecesData !== 'undefined' && typeof window.puzzlePiecesPath !== 'undefined') {
    const puzzlePieces = window.puzzlePiecesData;
    const puzzlePiecesPath = window.puzzlePiecesPath;
    const level = window.level;

    function setBackground(level) {
      document.body.style.backgroundImage = `url('/images/backgrounds/${level}-bg.jpg')`;
      document.body.style.backgroundSize = 'cover';  // Make the background cover the entire body
      document.body.style.backgroundPosition = 'center';  // Center the background
      document.body.style.backgroundRepeat = 'no-repeat';  // Ensure the background does not repeat
    }
  
    // Function to generate puzzle pieces
    function generatePuzzlePieces() {
      let counter = 0; 
      puzzlePieces.forEach(piece => {
        const img = document.createElement('img');
        img.src = '/' + puzzlePiecesPath + '/' + piece;
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

    setBackground(level);
    // Initialize puzzle once the page is loaded
    generatePuzzlePieces();
    if(level === "easy"){
      generateGrid(3, 3);
    }
    else if(level === "medium"){
      generateGrid(5, 5);
    }
    else if(level === "hard"){
      generateGrid(10, 10);
    } else {
      console.log("level not found");
    }
  } else {
    console.error("puzzlePiecesData or puzzlePiecesBasePath is undefined");
  }
});