defmodule JigsawWeb.PageController do
  use JigsawWeb, :controller

  def home(conn, _params) do
    path = "priv/static/images/original"
    files = File.ls!(path)

    filtered_files = Enum.filter(files, fn file ->
      Regex.match?(~r/-[a-f0-9]+/, file)
    end)

    shuffled_files = Enum.shuffle(filtered_files)
    render(conn, "home.html", original_images: shuffled_files, layout: false)
  end

end
