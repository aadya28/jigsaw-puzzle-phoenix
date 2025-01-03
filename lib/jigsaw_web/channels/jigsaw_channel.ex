defmodule JigsawWeb.JigsawChannel do
  use JigsawWeb, :channel

  # When a participant joins the channel
  def join("puzzle:lobby", _payload, socket) do
    {:ok, socket}
  end

  # Handle piece movement (optional, but this is where the event is currently being sent)
  def handle_in("move_piece", %{"piece_id" => piece_id, "position" => position}, socket) do
    # Broadcast the event to all connected clients
    broadcast!(socket, "piece_moved", %{
      piece_id: piece_id,
      position: position
    })
    {:noreply, socket}
  end

  # Handle the piece drop event (new event)
  def handle_in("piece_dropped", %{"pieceId" => piece_id, "cellIndex" => cell_index}, socket) do
    # Broadcast the piece drop event to all clients
    broadcast!(socket, "piece_dropped", %{
      pieceId: piece_id,
      cellIndex: cell_index,
    })

    {:noreply, socket}
  end

  def handle_in("presence_state", _payload, socket) do
    push(socket, "presence_state", %{state: "connected"})
    {:noreply, socket}
  end

  # Handle piece locking (optional)
  def handle_in("lock_piece", %{"piece_id" => piece_id}, socket) do
    # Broadcast the event to all connected clients
    broadcast!(socket, "piece_locked", %{
      piece_id: piece_id
    })
    {:noreply, socket}
  end

  def handle_in("puzzle_solved", _payload, socket) do
    broadcast!(socket, "puzzle_solved", %{
      message: "Puzzle is solved!"
    })
    {:noreply, socket}
  end

  def handle_in("puzzle_failed", _payload, socket) do
    broadcast!(socket, "puzzle_failed", %{
      message: "Puzzle is failed!"
    })
    {:noreply, socket}
  end
end
