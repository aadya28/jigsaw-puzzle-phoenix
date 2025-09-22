defmodule JigsawWeb.ImageController do
  use JigsawWeb, :controller
  alias Jigsaw.Images

  def index(conn, _params) do
    images = Images.list_images()
    json(conn, images)
  end
end
