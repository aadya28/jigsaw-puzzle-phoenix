# Jigsaw Puzzle Game

A real-time multiplayer jigsaw puzzle game built with Phoenix Framework and Elixir. Solve beautiful puzzles with friends
using WebSocket-powered live collaboration.

---

## Demo

**Choose from multiple beautiful images**

<img src="docs/screenshots/select_image.png" alt="Image Selection Screen" style="border-radius: 8px;">

**Select your difficulty level: Easy, Medium, or Hard**

<img src="docs/screenshots/select_level.png" alt="Level Selection" style="border-radius: 8px;">

**Easy Level (3x3 grid) - Perfect for beginners**

<img src="docs/screenshots/easy_level.png" alt="Easy Level Gameplay" style="border-radius: 8px;">

**Medium Level (5x5 grid) - Moderate challenge**

<img src="docs/screenshots/medium_level.png" alt="Medium Level Gameplay" style="border-radius: 8px;">

**Hard Level (10x10 grid) - Expert mode with 100 pieces**

<img src="docs/screenshots/hard_level.png" alt="Hard Level Gameplay" style="border-radius: 8px;">

**Celebrate your victory and progress to the next level!**

<img src="docs/screenshots/success_modal.png" alt="Success Modal" style="border-radius: 8px;">

**Don't give up! Retry or go back home to try a different puzzle**

<img src="docs/screenshots/failure_modal.png" alt="Failure Modal" style="border-radius: 8px;">

---
## About

This is a modern multiplayer jigsaw puzzle game where players can collaborate in real-time to solve puzzles together.
Built as a learning project to explore **Elixir and Phoenix Framework** - we had never used functional programming or
Phoenix Channels before, so this was our first dive into real-time WebSocket communication and Elixir's concurrency
model.

---

## Features

- **Multiple puzzle images** with curated collection
- **Real-time collaboration** to see other players' moves instantly
- **Three difficulty levels** with progressive unlocking
- **Drag-and-drop interface** with visual feedback
- **Automatic validation** with success/failure modals
- **Custom backgrounds** for each difficulty level
- **Pre-split puzzle pieces** for fast loading

---

## Tech Stack

### Backend:

- Elixir ~> 1.14
- Phoenix Framework ~> 1.7.18
- Phoenix Channels (WebSocket)
- Bandit HTTP Server

### Frontend:

- Vanilla JavaScript (ES6+)
- HTML5 Drag & Drop API
- Phoenix JS Client

### Tools:

- esbuild (bundler)
- Python (image processing)

**Why this stack?**
We chose Elixir/Phoenix specifically to learn functional programming and understand how real-time systems work. Phoenix
Channels made multiplayer trivial compared to rolling our own WebSocket solution, and going with vanilla JavaScript kept
things lightweight without framework overhead.

---

## Getting started

To run the Jigsaw App locally, follow these steps:

### Prerequisites:

- Elixir and Erlang installed
- Phoenix installed

### Setup

1. Clone this repository to your local machine

```
git clone https://github.com/aadya28/jigsaw-puzzle-phoenix.git
```

2. Install Elixir dependencies

```
mix deps.get
```

3. Setup assets

```
mix assets.setup
```

4. Compile dependencies

```
mix deps.compile
```

5. Start Phoenix server

```
mix phx.server
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

---

## How to Play

### Single Player:

1. Select an image from the gallery
2. Choose difficulty (Easy/Medium/Hard)
3. Drag pieces from the right panel onto the grid
4. Complete the puzzle to unlock the next difficulty

### Multiplayer:

1. Share your game URL with friends: `http://localhost:4000/jigsaw/{image_id}/{level}`
2. All players see real-time updates as pieces are moved
3. Work together to solve faster!

---

## Architecture

```
Browser 1 ──WebSocket──▶ Phoenix Server ◀──WebSocket── Browser 2
                              │
                         JigsawChannel
                              │
                    Broadcasting to all clients
```

**Key Components:**

- **Controllers:** Handle image selection and puzzle page rendering
- **JigsawChannel:** Manages WebSocket connections and broadcasts piece movements
- **JavaScript Modules:**
    - `puzzle_board.js` - Grid initialization
    - `game_mechanics.js` - Drag/drop logic
    - `multiplayer_sync.js` - WebSocket client
    - `puzzle_validator.js` - Completion detection

**Critical Design Decisions:**

- **No Database:** Fully stateless - all state lives in WebSocket connections
- **Pre-split Images:** Pieces generated offline using Python for instant loading
- **Phoenix Channels over REST:** True real-time updates without polling

---

## Challenges & Learnings

### Technical Challenges

**1. Programmatic Image Splitting**

- **Challenge:** We needed to split images into puzzle pieces for three different difficulty levels (9, 25, and 100 pieces per image). Initially tried design tools like Canva and Figma, but they required manually splitting each image for every difficulty level - extremely time-consuming and error-prone when you have multiple images.
- **Solution:** Wrote a Python script using the Pillow library to automate the entire process. The script reads source images and generates all puzzle pieces for all difficulty levels in one go.
- **Learning:** Sometimes the best tool is the one you build yourself. Automation saved hours of repetitive work and ensured consistency across all puzzle pieces.

**2. Understanding WebSockets and Real-time Communication**

- **Challenge:** None of us had worked with WebSockets before. We didn't even understand the difference between polling and WebSocket connections, let alone how Phoenix Channels worked under the hood.
- **Solution:** Spent time reading Phoenix Channels documentation, understanding the publish-subscribe pattern, and experimenting with broadcasting events between clients. Gradually learned how Phoenix abstracts WebSocket complexity while still giving full control.
- **Learning:** WebSockets enable true bidirectional real-time communication - far more efficient than polling. Phoenix Channels make multiplayer features almost trivial compared to implementing raw WebSockets from scratch.

**3. URL Structure and Routing Conventions**

- **Challenge:** Initially, our routes were unstructured and inconsistent - not intuitive to read or maintain. After looking at well-designed URLs (like GitHub's clean /user/repo/issues pattern), I realized ours felt random and confusing.
- **Solution:** Refactored the entire routing structure to follow RESTful conventions: `/jigsaw/:image_id/:level` instead of scattered, unclear paths. This made the app much more intuitive - you can understand what page you're on just by reading the URL.
- **Learning:** Good URL design isn't just cosmetic - it improves maintainability, makes debugging easier, and creates a better user experience. Clean, predictable routes are a sign of a well-architected application.

**4. Real-time State Synchronization Without a Database**

- **Challenge:** We needed to keep the puzzle state consistent across multiple players working on the same puzzle simultaneously, but we didn't want to add database complexity to our learning project. The question was: how do we ensure everyone sees the same puzzle state without persisting it anywhere?
- **Solution:** Realized that Phoenix Channels' PubSub system was perfect for this. Every time a player moves a piece, we broadcast that event to all connected clients. The "truth" lives in the shared channel, not in a database. Each client maintains its own local state and updates it based on broadcast events.
- **Learning:** You don't always need a database! Stateless architectures can be incredibly powerful when you have reliable event broadcasting. This approach made our app instantly scalable - no database means no bottleneck.

### What We'd Do Differently

- Add a database layer for saving progress and user stats
- Implement presence tracking to show active players
- Add puzzle piece rotation for extra difficulty

---

## Future Enhancements

- User authentication and saved progress
- Leaderboard with completion times
- Custom image uploads
- Hint system
- In-game chat for multiplayer
- Mobile app with LiveView Native
- More difficulty levels (Very Easy 2×2, Expert 15×15)

---

## Deployment

[**Live Demo**](https://jigsaw-puzzle-phoenix.onrender.com)

This app is deployed on Render. For detailed deployment instructions, see [DEPLOYMENT.md](https://github.com/aadya28/jigsaw-puzzle-phoenix/blob/main/DEPLOYMENT.md).

---