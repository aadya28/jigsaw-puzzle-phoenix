defmodule Jigsaw.Images do
  @images_path Path.join(:code.priv_dir(:jigsaw), "static/images/original")

  def list_images do
    File.ls!(@images_path)
    |> Enum.reject(&hidden_or_junk?/1)
    |> Enum.sort()
    |> Enum.with_index(1)
    |> Enum.into(%{}, fn {filename, idx} ->
      {Integer.to_string(idx), filename}
    end)
  end

  defp hidden_or_junk?(filename) do
    String.starts_with?(filename, ".") or filename == ".DS_Store"
  end
end
