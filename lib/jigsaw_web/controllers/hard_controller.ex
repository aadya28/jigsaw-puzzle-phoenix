defmodule JigsawWeb.HardController do
  use JigsawWeb, :controller

  def hard(conn, %{"imagePath" => image_path}) do
    # Extract the base image name (e.g., 'img-2' from 'img-2-b2e0a61976c6d3f9bf6252408488d8a0.png')
    base_image_name = String.split(image_path, "-")
    |> Enum.take(2)
    |> Enum.join("-")

    # Construct the path for puzzle pieces based on the base image name
    # puzzle_pieces_path = "priv/static/images/puzzle-pieces/hard/#{base_image_name}-pieces/"
    puzzle_pieces_path = "priv/static/images/puzzle-pieces/hard/"
    relative_image_path = "images/original/#{image_path}"
    level = "hard"

    files = File.ls!(puzzle_pieces_path)
    filtered_files = Enum.filter(files, fn file -> file != ".DS_Store" end)
    filtered_files = Enum.filter(filtered_files, fn file ->
      Regex.match?(~r/-[a-f0-9]+/, file)
    end)
    shuffled_files = Enum.shuffle(filtered_files)

    IO.inspect(relative_image_path, label: "Image Path")
    IO.inspect(base_image_name, label: "Base Image Name")
    IO.inspect(puzzle_pieces_path, label: "Puzzle Pieces Path")
    IO.inspect(shuffled_files, label: "Shuffled Puzzle Pieces")

    render(conn, "hard.html", layout: false, image_path: relative_image_path, puzzle_pieces: shuffled_files, level: level)
  end
end
