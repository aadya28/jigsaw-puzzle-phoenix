defmodule JigsawWeb.UserSocket do
  use Phoenix.Socket

  # Define channels
  channel "puzzle:lobby", JigsawWeb.JigsawChannel
  # Optional connection handling
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
