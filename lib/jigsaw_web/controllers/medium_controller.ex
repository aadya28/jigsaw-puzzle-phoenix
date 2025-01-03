defmodule JigsawWeb.MediumController do
  use JigsawWeb, :controller

  def index(conn, _params) do
    path = "priv/static/images/puzzle-pieces/medium"
    files = File.ls!(path)

    filtered_files = Enum.filter(files, fn file ->
      Regex.match?(~r/-[a-f0-9]+/, file)
    end)

    shuffled_files = Enum.shuffle(filtered_files)
    render(conn, "index.html", puzzle_pieces: shuffled_files)
  end
end
