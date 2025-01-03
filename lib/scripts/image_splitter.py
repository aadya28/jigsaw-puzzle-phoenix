import cv2
import numpy as np
import os
from random import randint

def create_jigsaw_pieces(image_path, output_dir, level):
    # Load the image
    if level == "easy": 
        rows, cols = 3, 3
    elif level == "medium":
        rows, cols = 5, 5
    else:
        rows, cols = 10, 10
    image = cv2.imread(image_path)
    height, width, _ = image.shape

    # Calculate the size of each piece
    piece_height = height // rows
    piece_width = width // cols

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Create jigsaw pieces
    for i in range(rows):
        for j in range(cols):
            y1 = i * piece_height
            y2 = (i + 1) * piece_height if i < rows - 1 else height
            x1 = j * piece_width
            x2 = (j + 1) * piece_width if j < cols - 1 else width

            # Extract the piece
            piece = image[y1:y2, x1:x2]

            piece_path = os.path.join(output_dir, level, f"piece_{i}_{j}.png")
            cv2.imwrite(piece_path, piece)

    print(f"Jigsaw pieces saved in '{output_dir}'")

# Usage
image_path = "priv/static/images/original/-c55c6fdbb4c100a54d30d4177c9e858e.png"  # Replace with your image path
output_dir = "priv/static/images/puzzle-pieces/"
create_jigsaw_pieces(image_path, output_dir, "easy")
create_jigsaw_pieces(image_path, output_dir, "medium")
create_jigsaw_pieces(image_path, output_dir, "hard")
