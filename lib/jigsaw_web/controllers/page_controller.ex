defmodule JigsawWeb.PageController do
  use JigsawWeb, :controller

  def home(conn, _params) do
    path = "priv/static/images/puzzle-pieces/img-1-pieces"
    files = File.ls!(path)
    filtered_files = Enum.filter(files, fn file -> file != ".DS_Store" end)
    shuffled_files = Enum.shuffle(filtered_files)
    render(conn, "home.html", puzzle_pieces: shuffled_files)
  end
end
