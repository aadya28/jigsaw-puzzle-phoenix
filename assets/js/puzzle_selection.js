// Image gallery and level selection UI
// Used on: /jigsaw page

document.addEventListener("DOMContentLoaded", function() {
  // Only run if we're on the image selection page
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
  }

  // Level selection handling
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
      // Redirect to the constructed URL
      window.location.href = `/jigsaw/${imageId}/${selectedLevel}`;
    });
  });
});
