defmodule JigsawWeb.MediumController do
  use JigsawWeb, :controller

  def index(conn, _params) do
    render(conn, :index, layout: false)
  end
end
