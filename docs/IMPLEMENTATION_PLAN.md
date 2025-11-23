# Atomic Drop: Step-by-Step Implementation Plan

This document outlines the development process for the Plinko game, breaking it down into distinct phases.

## Phase 1: Core Logic (`src/gameLogic.js`)

The first priority is to build the deterministic, non-visual core of the game.

1.  **Provably Fair Foundation:**
    *   Implement `generateServerSeed()` to create a cryptographically secure random string.
    *   Implement a hashing function (e.g., SHA-256) to create a `hashedServerSeed` from the server seed.
    *   This ensures the house cannot manipulate the outcome after a bet is placed.

2.  **Path & Outcome Generation:**
    *   Create a core function: `getPlinkoOutcome(serverSeed, clientSeed, nonce, rows)`.
    *   Inside this function, combine the seeds and nonce to create a single hexadecimal string.
    *   Iterate through this string to generate a deterministic path for the ball. For each row, consume a character from the hex string. If the character's integer value is even, the ball goes right; if odd, it goes left.
    *   The final position (slot) is determined by the sum of left/right moves. A path of `(rows / 2)` lefts and `(rows / 2)` rights ends in the center.

3.  **Multiplier Calculation:**
    *   Create a function: `calculateMultipliers(rows, riskLevel)`.
    *   This function will calculate the payout multiplier for each of the `rows + 1` possible landing slots.
    *   The probability of landing in a given slot follows a binomial distribution (Pascal's Triangle). Multipliers should be the inverse of the probability.
    *   Incorporate a house edge (e.g., 1-2%) by slightly reducing all calculated multipliers.

## Phase 2: UI Scaffolding & State (`src/App.jsx`)

With the logic defined, set up the React application structure.

1.  **Initialize Project:** Set up a new Vite + React project.
2.  **State Management:** In `App.jsx`, use the `useState` hook to manage all critical application states:
    *   `balance`, `betAmount`, `rows`, `riskLevel`
    *   `serverSeed`, `clientSeed`, `nonce`
    *   `gameHistory` (an array of game result objects)
    *   `isBetting` (to disable controls during animation)
3.  **Component Structure:** Create empty placeholder files for the main UI components:
    *   `components/BetControls.jsx`
    *   `components/PlinkoBoard.jsx`
    *   `components/GameHistory.jsx`
    *   `components/ProvablyFair.jsx`
4.  **Layout:** Implement the basic three-column CSS grid or flexbox layout in `App.css`.

## Phase 3: Component Implementation

Build out the individual React components.

1.  **`BetControls.jsx`:**
    *   Create the form with inputs for bet amount, a select dropdown for risk level, and a range slider for the number of rows.
    *   Pass state values and setter functions from `App.jsx` as props.
    *   Implement the "Bet" button, which will call the main game execution function in `App.jsx`.

2.  **`PlinkoBoard.jsx`:**
    *   Render the pegs in a pyramid formation using CSS, dynamically based on the `rows` prop.
    *   Render the `multipliers` array at the bottom of the pyramid.
    *   Create the ball element. Its animation path will be determined later.

3.  **`GameHistory.jsx` & `ProvablyFair.jsx`:**
    *   Build these components to display the game history and the seed information, respectively. Their structure can be heavily based on the Quantum Dice project.

## Phase 4: Integration & Animation

Connect the logic, state, and UI.

1.  **Main Game Function:** In `App.jsx`, create the `handleBet` function. This function will:
    *   Call `getPlinkoOutcome` from `gameLogic.js` to get the result (final slot and multiplier).
    *   Calculate the win/loss amount and update the `balance` state.
    *   Add the new result object to the `gameHistory` state.
    *   Increment the `nonce`.
    *   Pass the calculated path (the series of left/right moves) as a prop to the `PlinkoBoard` component.

2.  **Animation:**
    *   In `PlinkoBoard.jsx`, use the path prop to animate the ball.
    *   This can be achieved by creating a series of CSS keyframe animations or by using a library like `react-spring` to dynamically update the ball's `transform: translate(x, y)` style. The path determines the `x` translation at each `y` step (row).

3.  **Audio:**
    *   In `App.jsx`, use the `useEffect` hook to play sounds when the game state changes (e.g., a win or loss is registered).

## Phase 5: Finalization & Deployment

1.  **Styling:** Refine the CSS to match the dark-mode aesthetic. Ensure the application is responsive and looks good on various screen sizes.
2.  **Testing:** Manually test all functionality, including the provably fair verification.
3.  **Build:** Run `npm run build` to generate the production assets.
4.  **Deploy:** Push the `dist` directory to the `gh-pages` branch of the GitHub repository to deploy the site.
