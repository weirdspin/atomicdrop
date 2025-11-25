# Product Requirements Document (PRD): Atomic Drop

## 1. Overview

*   **Project Goal:** To create a visually engaging, provably fair Atomic Drop game as a single-page web application. This project will serve as a portfolio piece to demonstrate skills in frontend development, UI animation, and core iGaming principles.
*   **Target Audience:** Potential employers, technical recruiters, and the open-source community.
*   **Core Concept:** A ball is dropped from the top of a triangular pyramid of pegs. It bounces left or right at each row of pegs until it settles in one of the slots at the bottom. The player places a bet on the outcome. Payouts are awarded based on the final slot, with slots further from the center yielding higher multipliers due to their lower probability.

## 2. Core Features

### 2.1. Game Board & Animation
*   **Peg Pyramid:** A visually rendered pyramid of pegs. The number of rows should be configurable by the player.
*   **Ball Drop Animation:** A smooth animation will show the ball dropping from the top, bouncing off pegs according to a predetermined path, and landing in a final slot.
*   **Payout Display:** The payout multipliers for each possible finishing slot will be clearly displayed at the bottom of the pyramid.

### 2.2. Bet Controls
*   **Bet Amount:** An input field allowing the player to specify their wager for each ball drop.
*   **Rows/Pins:** A slider or selector that allows the player to choose the number of rows in the pyramid (e.g., from 8 to 16). Changing the rows will dynamically update the payout multipliers.
*   **Risk Level:** A selector (Low, Medium, High) that adjusts the spread of payout multipliers.
*   **Bet Button:** A primary button to initiate the game by placing the bet and starting the ball drop.

### 2.3. Gameplay & State
*   **Balance:** The player's total balance will be displayed and updated after each game.
*   **Win/Loss Notification:** Clear feedback will be provided to the player showing the outcome of their bet and the amount won or lost.
*   **Game History:** A sidebar or section will display a list of recent games, showing the bet amount, the resulting multiplier, and the profit/loss for each.

### 2.4. Provably Fair System
*   **Seed Generation:** The game will use a Server Seed (hashed), a Client Seed, and a Nonce to generate outcomes deterministically.
*   **User Interaction:** The player will be able to view and change their Client Seed.
*   **Verification:** A mechanism will be provided for the player to verify the integrity of each game's result by revealing the unhashed server seed and explaining the outcome calculation.

### 2.5. Audio & UI/UX
*   **Sound Effects:** Audio feedback for key events: ball hitting a peg, winning a bet, and losing a bet.
*   **Theme:** A modern, dark-mode theme inspired by popular iGaming platforms.
*   **Layout:** A responsive three-column layout is preferred: Bet Controls (left), Plinko Board (center), and Game History (right).

## 3. Technical Requirements

*   **Framework:** React with Vite.
*   **Language:** JavaScript (ES6+).
*   **Styling:** Plain CSS or a CSS-in-JS solution. No component libraries.
*   **State Management:** Utilize core React hooks (`useState`, `useEffect`, `useContext`) for all state.
*   **Game Logic:** All core game mechanics (path generation, outcome calculation, provably fair algorithm) must be encapsulated in a pure JavaScript module (`gameLogic.js`), completely separate from the React UI components.
*   **Deployment:** The final application will be built and deployed to GitHub Pages.
