defmodule JigsawWeb.PageController do
  use JigsawWeb, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end

  def get_pieces(conn, _params) do
    pieces = File.ls!("priv/static/images/puzzle-pieces/img-1-pieces")
    pieces = pieces
         |> Enum.filter(fn piece -> String.ends_with?(piece, ".png") && String.contains?(piece, "piece") end)
         |> Enum.uniq()
    IO.inspect(pieces, label: "Filtered Pieces")
    json(conn, pieces)
  end
end
