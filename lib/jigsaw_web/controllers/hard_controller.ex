defmodule JigsawWeb.HardController do
  use JigsawWeb, :controller

  def main(conn, _params) do
    path = "priv/static/images/puzzle-pieces/hard"
    files = File.ls!(path)

    filtered_files = Enum.filter(files, fn file ->
      Regex.match?(~r/-[a-f0-9]+/, file)
    end)

    shuffled_files = Enum.shuffle(filtered_files)
    render(conn, "main.html", puzzle_pieces: shuffled_files)
  end
end
