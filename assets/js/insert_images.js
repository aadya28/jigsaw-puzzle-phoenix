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
                  imageSelectItem.dataset.image = basePath + image;

                  const img = document.createElement("img");
                  img.src = basePath + image;
                  img.alt = "Puzzle Image " + image;

                  // Add click event listener to image select item
                  imageSelectItem.addEventListener("click", function() {
                      // Extract the base part of the filename (e.g., 'img-1' from 'img-1-c55c6fdbb4c100a54d30d4177c9e858e.png')
                      const filename = image; 
                      
                      // Store the selected image data
                      window.selectedImage = filename;

                      // Log the selected image
                      console.log("Selected Image: " + window.selectedImage);

                      // Hide the image selection grid
                      gridContainer.style.display = 'none';
                      
                      // Hide the "Select Your Puzzle" header
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

          // Get the selected level (easy, medium, or hard)
          const selectedLevel = this.dataset.level;

          // Store the selected level data
          window.selectedLevel = selectedLevel;

          // Log the selected level
          console.log("Selected Level: " + window.selectedLevel);

          // Trigger the URL based on the selected level
          const targetUrl = `/${selectedLevel}?imagePath=${encodeURIComponent(window.selectedImage)}`;
          console.log("Redirecting to: " + targetUrl);

          // Redirect to the target URL
          window.location.href = targetUrl;
      });
  });

    if (typeof window.puzzlePiecesData !== 'undefined' && typeof window.puzzlePiecesBasePath !== 'undefined') {
      const puzzlePieces = window.puzzlePiecesData;
      const basePath = window.puzzlePiecesBasePath;
      console.log("hellp")
      const level = window.level;
      console.log(level);
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

        console.log(gridContainer)
      }
  
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
  