import cv2
import os
import glob
from pathlib import Path

def create_jigsaw_pieces(image_path, output_dir, level):
    """Create jigsaw pieces for a single image at a specific difficulty level."""
    # Load the image
    if level == "easy": 
        rows, cols = 3, 3
    elif level == "medium":
        rows, cols = 5, 5
    else:
        rows, cols = 10, 10
    
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image from {image_path}")
        return False
    
    height, width, _ = image.shape

    # Calculate the size of each piece
    piece_height = height // rows
    piece_width = width // cols

    # Get image filename without extension for organizing pieces
    image_name = Path(image_path).stem
    
    # Create output directory structure: output_dir/level/image_name/
    level_output_dir = os.path.join(output_dir, level, image_name)
    if not os.path.exists(level_output_dir):
        os.makedirs(level_output_dir)

    # Create jigsaw pieces
    for i in range(rows):
        for j in range(cols):
            y1 = i * piece_height
            y2 = (i + 1) * piece_height if i < rows - 1 else height
            x1 = j * piece_width
            x2 = (j + 1) * piece_width if j < cols - 1 else width

            # Extract the piece
            piece = image[y1:y2, x1:x2]

            piece_path = os.path.join(level_output_dir, f"piece_{i}_{j}.png")
            cv2.imwrite(piece_path, piece)

    print(f"Created {rows}x{cols} pieces for {image_name} ({level})")
    return True

def process_all_images(input_dir="priv/static/images/original/", 
                      output_dir="priv/static/images/puzzle-pieces/",
                      levels=["easy", "medium", "hard"],
                      supported_formats=["*.png", "*.jpg", "*.jpeg", "*.bmp", "*.tiff"]):
    """Process all images in the input directory and create puzzle pieces for each difficulty level."""
    
    # Find all image files
    image_files = []
    for format_pattern in supported_formats:
        image_files.extend(glob.glob(os.path.join(input_dir, format_pattern)))
        # Also check for uppercase extensions
        image_files.extend(glob.glob(os.path.join(input_dir, format_pattern.upper())))
    
    if not image_files:
        print(f"No image files found in {input_dir}")
        print(f"Supported formats: {', '.join(supported_formats)}")
        return
    
    print(f"Found {len(image_files)} image(s) to process:")
    for img in image_files:
        print(f"  - {os.path.basename(img)}")
    print()
    
    # Process each image
    total_processed = 0
    for image_path in image_files:
        print(f"Processing: {os.path.basename(image_path)}")
        
        success_count = 0
        for level in levels:
            if create_jigsaw_pieces(image_path, output_dir, level):
                success_count += 1
        
        if success_count == len(levels):
            total_processed += 1
            print(f"Successfully processed {os.path.basename(image_path)} for all levels")
        else:
            print(f"Partially processed {os.path.basename(image_path)} ({success_count}/{len(levels)} levels)")
        print()
    
    print(f"Summary: {total_processed}/{len(image_files)} images fully processed")

def process_single_image(image_path, output_dir="priv/static/images/puzzle-pieces/", 
                        levels=["easy", "medium", "hard"]):
    """Process a single image file."""
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        return
    
    print(f"Processing single image: {os.path.basename(image_path)}")
    
    for level in levels:
        create_jigsaw_pieces(image_path, output_dir, level)

if __name__ == "__main__":
    # Configuration
    INPUT_DIR = "priv/static/images/original/"
    OUTPUT_DIR = "priv/static/images/puzzle-pieces/"
    LEVELS = ["easy", "medium", "hard"]
    
    # Process all images in the directory
    print("=== Processing All Images ===")
    process_all_images(INPUT_DIR, OUTPUT_DIR, LEVELS)
    
    # Process a specific image (uncomment to use)
    # print("\n=== Processing Single Image ===")
    # process_single_image("priv/static/images/original/img-1.png", OUTPUT_DIR, LEVELS)
    
    # Process specific images (uncomment and modify to use)
    # specific_images = [
    #     "priv/static/images/original/img-1.png",
    #     "priv/static/images/original/img-2.png",
    # ]
    # print("\n=== Processing Specific Images ===")
    # for img_path in specific_images:
    #     process_single_image(img_path, OUTPUT_DIR, LEVELS)