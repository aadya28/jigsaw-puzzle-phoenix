// Real-time multiplayer synchronization via Phoenix Channels
// Used on: /jigsaw/:image_id/:level page
// Exports: channel object for use by game_mechanics.js

import { Socket } from "phoenix";

// Set up WebSocket connection
let socket = new Socket("/socket", { params: { token: window.userToken } });
socket.connect();

// Join the "puzzle:lobby" channel
let channel = socket.channel("puzzle:lobby", {});

// Listen for "piece_dropped" events from other players
channel.on("piece_dropped", payload => {
  const { pieceId, cellIndex } = payload;
  const piece = document.getElementById(pieceId);
  const cell = document.querySelector(`[data-index='${cellIndex}']`);

  if (piece && cell) {
    cell.appendChild(piece);
    piece.setAttribute("draggable", "true");
    piece.style.opacity = "1";
    cell.style.border = "none"; // Reset the border when the piece is placed
  }
});

// Listen for puzzle completion from any player
channel.on("puzzle_solved", (payload) => {
  // Import createSuccessModal dynamically to avoid circular dependencies
  if (window.createSuccessModal) {
    window.createSuccessModal();
  }
});

// Listen for puzzle validation failure
channel.on("puzzle_failed", (payload) => {
  alert("Don't stress, some puzzles just require brains, not vibes :)");
});

// Join the channel
channel.join()
  .receive("ok", resp => { 
    console.log("Joined puzzle channel successfully", resp); 
  })
  .receive("error", resp => { 
    console.log("Unable to join puzzle channel", resp); 
  });

// Export channel for use by other modules
export { channel };
