defmodule JigsawWeb.PageController do
  use JigsawWeb, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end
end
