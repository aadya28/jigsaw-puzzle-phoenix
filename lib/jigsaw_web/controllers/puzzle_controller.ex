defmodule JigsawWeb.PuzzleController do
  use JigsawWeb, :controller
  alias Jigsaw.Images

  @spec puzzle(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def puzzle(conn, %{"image_id" => image_id, "level" => level}) do
    # Fetch the dynamic image mapping
    image_mapping = Images.list_images()

    # Fetch the image filename from the mapping using the image_id
    case Map.fetch(image_mapping, image_id) do
      {:ok, image_filename} ->
        # Construct the full path to the original image
        original_image_path = Path.join(["images", "original", image_filename])

        # Handle the puzzle pieces path
        # Extract image name without extension for the directory name
        image_name = Path.basename(image_filename, Path.extname(image_filename))

        # New path structure: priv/static/images/puzzle-pieces/{level}/{image_name}/
        puzzle_pieces_path =
          Path.join(["priv", "static", "images", "puzzle-pieces", level, image_name])

        # Relative path for web serving
        puzzle_pieces_relative_path =
          Path.join(["images", "puzzle-pieces", level, image_name])

        # Check if the directory exists and list files, else return an empty list
        files =
          case File.ls(puzzle_pieces_path) do
            {:ok, files} -> files
            {:error, _reason} -> []
          end

        # Filter and shuffle puzzle piece files
        filtered_files =
          files
          |> Enum.filter(fn file -> String.match?(file, ~r/^piece_\d+_\d+\.png$/) end)
          |> Enum.shuffle()

        # Render the puzzle page
        render(conn, "puzzle.html",
          layout: false,
          puzzle_pieces_path: puzzle_pieces_relative_path,
          puzzle_pieces: filtered_files,
          image_id: image_id,
          level: level,
          original_image_path: original_image_path
        )

      :error ->
        # If image_id doesn't exist in the mapping, return a 404
        send_resp(conn, 404, "Image not found")
    end
  end
end
