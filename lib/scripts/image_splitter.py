import cv2
import numpy as np
import os
from random import randint

def create_jigsaw_pieces(image_path, rows, cols, output_dir):
    # Load the image
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

            # Optionally, add irregular edges (simulate jigsaw shapes)
            mask = np.zeros_like(piece, dtype=np.uint8)
            irregular_shape = cv2.rectangle(mask, (randint(0, 10), randint(0, 10)),
                                            (piece_width - randint(0, 10), piece_height - randint(0, 10)),
                                            (255, 255, 255), -1)
            piece = cv2.bitwise_and(piece, irregular_shape)

            # Save the piece
            piece_filename = f"piece_{i}_{j}.png"
            piece_path = os.path.join(output_dir, piece_filename)
            cv2.imwrite(piece_path, piece)

    print(f"Jigsaw pieces saved in '{output_dir}'")

# Usage
image_path = "priv/static/images/original/jigsaw-img-1.jpeg"  # Replace with your image path
output_dir = "priv/static/images/puzzle-pieces/img-1-pieces"   # Update path to priv/static/images/puzzle-pieces
rows, cols = 4, 4  # Number of rows and columns
create_jigsaw_pieces(image_path, rows, cols, output_dir)