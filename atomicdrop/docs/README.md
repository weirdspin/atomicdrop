# Project: Atomic Drop

## Project Overview

Plinko is a minimalist, provably fair casino game designed as a single-page web application. This project serves as a portfolio piece to showcase proficiency in frontend development, game logic animation, and iGaming concepts like House Edge and Provably Fair systems.

The application allows a player to bet on the outcome of a ball dropped from the top of a pegged pyramid. The player can configure their bet by setting a bet amount and the number of pins on the board. The payout is determined by the final slot the ball lands in, with riskier (less probable) slots offering higher rewards. The UI will feature a clean, dark-themed layout.

The core technologies used are React with Vite for the frontend. The project emphasizes a clean separation of concerns, with game logic isolated from the UI components.

## Building and Running

### Setup

Install the necessary dependencies:

```bash
npm install
```

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start a local development server, typically at `http://localhost:5173`.

### Production

To build the application for production:

```bash
npm run build
```

The production-ready files will be placed in the `dist` directory. The project is intended to be deployed to a static site hosting service like GitHub Pages.

## Development Conventions

The project will follow a structured, sequential implementation plan:

1.  **Core Logic First:** The core game logic (payout calculation, path generation, provably fair algorithm) will be implemented in a separate, plain JavaScript file (`gameLogic.js`) before building the UI.
2.  **Component-Based UI:** The user interface will be built with React, with distinct components for different parts of the UI (`BetControls.jsx`, `PlinkoBoard.jsx`, `GameHistory.jsx`).
3.  **State Management:** The application state (balance, bet amount, number of rows, etc.) will be managed using React's `useState` hook in the main `App.jsx` component.
4.  **Provably Fair System:** A functional "Provably Fair" system will be implemented using a server seed, a client seed, and a nonce.
5.  **Styling:** The project will use a dark-mode theme, with styling implemented via CSS.
