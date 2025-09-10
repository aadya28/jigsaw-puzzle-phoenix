defmodule JigsawWeb.PageController do
  use JigsawWeb, :controller

  def redirect_to_jigsaw(conn, _params) do
    redirect(conn, to: "/jigsaw")
  end
end
