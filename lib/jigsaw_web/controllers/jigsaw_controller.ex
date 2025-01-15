defmodule JigsawWeb.JigsawController do
  use JigsawWeb, :controller

  def index(conn, _params) do
    base_path = "priv/static/images/original/"
    files = File.ls!(base_path)

    filtered_files = Enum.filter(files, fn file ->
      String.match?(file, ~r/.*-[a-f0-9]{32}\.\w+$/)
    end)

    shuffled_files = Enum.shuffle(filtered_files)
    relative_base_path = "images/original/"

    render(conn, "index.html", base_path: relative_base_path, images: shuffled_files, layout: false)
  end

end
