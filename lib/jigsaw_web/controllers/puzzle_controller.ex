defmodule JigsawWeb.PuzzleController do
  use JigsawWeb, :controller
  alias Jason

  def puzzle(conn, %{"image_id" => image_id, "level" => level}) do
    # Step 1: Read the image_mapping.json file from priv/data
    image_mapping_path = Path.join(["priv", "data", "image_mapping.json"])

    # Step 2: Decode the JSON file into a map
    image_mapping =
      image_mapping_path
      |> File.read!()
      |> Jason.decode!()

    # Step 3: Fetch the image filename from the mapping using the image_id
    case Map.fetch(image_mapping, image_id) do
      {:ok, image_filename} ->
        # Step 4: Construct the full path to the original image
        original_image_path = Path.join(["images", "original", image_filename])

        # Step 5: Handle the puzzle pieces path
        base_path = Path.join(["priv", "static", "images", "puzzle-pieces"])

        base_filename = String.split(image_filename, "-")
        |> Enum.take(2)
        |> Enum.join("-")

        puzzle_pieces_path = Path.join([base_path, base_filename <> "-pieces", level])
        puzzle_pieces_relative_path = Path.join(["images", "puzzle-pieces", base_filename <> "-pieces", level])

        # Check if the directory exists and list files, else return an empty list
        files =
          case File.ls(puzzle_pieces_path) do
            {:ok, files} -> files
            {:error, _reason} -> []
          end


        # Filter and shuffle puzzle piece files
        filtered_files =
          files
          |> Enum.filter(fn file -> String.match?(file, ~r/.*-[a-f0-9]{32}\.\w+$/) end)
          |> Enum.shuffle()

        # Step 6: Render the puzzle page
        render(conn, "puzzle.html", layout: false,
          puzzle_pieces_path: puzzle_pieces_relative_path,
          puzzle_pieces: filtered_files,
          image_id: image_id, level: level,
          original_image_path: original_image_path
          )

      :error ->
        # If image_id doesn't exist in the mapping, return a 404
        send_resp(conn, 404, "Image not found")
    end
  end
end
