defmodule JigsawWeb.EasyController do
  use JigsawWeb, :controller

  def easy(conn, %{"imagePath" => image_path}) do
    # Extract the base image name (e.g., 'img-2' from 'img-2-b2e0a61976c6d3f9bf6252408488d8a0.png')
    base_image_name = String.split(image_path, "-")
    |> Enum.take(2)
    |> Enum.join("-")

    # Construct the path for puzzle pieces based on the base image name
    puzzle_pieces_path = "priv/static/images/puzzle-pieces/#{base_image_name}-pieces/"
    relative_image_path = "images/original/#{image_path}"

    files = File.ls!(puzzle_pieces_path)
    filtered_files = Enum.filter(files, fn file -> file != ".DS_Store" end)
    shuffled_files = Enum.shuffle(filtered_files)

    IO.inspect(relative_image_path, label: "Image Path")
  IO.inspect(base_image_name, label: "Base Image Name")
  IO.inspect(puzzle_pieces_path, label: "Puzzle Pieces Path")
  IO.inspect(shuffled_files, label: "Shuffled Puzzle Pieces")


    render(conn, "easy.html", image_path: relative_image_path, puzzle_pieces: shuffled_files)
  end
end