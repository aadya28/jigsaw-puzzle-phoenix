# lib/jigsaw_web/channels/jigsaw_channel.ex
defmodule JigsawWeb.JigsawChannel do
  use JigsawWeb, :channel

  # When a participant joins the channel
  def join("jigsaw:lobby", _payload, socket) do
    {:ok, socket}
  end

  # Handle piece movement
  def handle_in("move_piece", %{"piece_id" => piece_id, "position" => position}, socket) do
    # Broadcast the event to all connected clients
    broadcast!(socket, "piece_moved", %{
      piece_id: piece_id,
      position: position
    })
    {:noreply, socket}
  end

  def handle_in("presence_state", _payload, socket) do
    push(socket, "presence_state", %{state: "connected"})
    {:noreply, socket}
  end

  # Handle piece locking
  def handle_in("lock_piece", %{"piece_id" => piece_id}, socket) do
    # Broadcast the event to all connected clients
    broadcast!(socket, "piece_locked", %{
      piece_id: piece_id
    })
    {:noreply, socket}
  end
end
