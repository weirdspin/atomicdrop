import React, { useState, useEffect } from 'react';
import './PlinkoBoard.css';

const PlinkoBoard = ({ rows, path, multipliers = [] }) => {
  const [animationStyle, setAnimationStyle] = useState('');
  const [activePegs, setActivePegs] = useState(new Set());

  useEffect(() => {
    if (path) {
      // All these values are based on the CSS and need to be kept in sync.
      const DROP_TIME_PER_ROW = 250; // ms per row
      const TOTAL_DURATION = rows * DROP_TIME_PER_ROW;

      const PEG_DIAMETER = 10;
      const PEG_MARGIN = 20; // This is 10px on each side
      const PEG_ROW_HEIGHT = 25; // 10px peg height + 15px margin-bottom
      const STARTING_OFFSET_Y = 40; // Initial vertical position

      const PEG_SPACING_X = PEG_DIAMETER + PEG_MARGIN;

      let keyframes = `@keyframes drop-animation { 0% { transform: translate(0, 0); opacity: 1; }`;

      let currentX = 0;
      let currentY = STARTING_OFFSET_Y;

      path.forEach((direction, index) => {
        const stepPercentage = ((index + 1) / (path.length + 1)) * 100;

        // Move horizontally: -0.5 for left, +0.5 for right from the center of the gap
        currentX += (direction === 0 ? -0.5 : 0.5) * PEG_SPACING_X;
        // Move down one row
        currentY += PEG_ROW_HEIGHT;

        keyframes += `${stepPercentage}% { transform: translate(${currentX}px, ${currentY}px); }`;
      });

      keyframes += `100% { transform: translate(${currentX}px, ${currentY + 20}px); }`; // Final drop into bucket
      keyframes += `}`;;

      setAnimationStyle(keyframes);

      // Calculate peg hits
      let pegIndex = 0; // Start at the first peg of the first row (index 0 relative to that row)
      // Actually, the rows are 0-indexed.
      // Row 0 has 3 pegs (indices 0, 1, 2). The ball starts between index 0 and 1?
      // Wait, let's look at renderPegs.
      // Row i has i + 3 pegs.
      // Row 0: 3 pegs.
      // The ball starts at x=0.
      // In renderPegs:
      // Row 0: 3 pegs.
      // The ball drops from top.
      // Let's re-read the movement logic.
      // currentX starts at 0.
      // direction 0 (left) -> -0.5 * spacing.
      // direction 1 (right) -> +0.5 * spacing.
      //
      // Visualizing the grid:
      // Row 0:  .   .   .
      //        / \ / \
      // Row 1: .   .   .   .
      //
      // If the ball is at "index" k in row r, it can go to k or k+1 in row r+1.
      // But the current rendering has `i + 3` pegs for row `i`.
      // Let's assume the ball starts above the middle peg of row -1 (if it existed).
      // Actually, let's look at the visual structure.
      // Row 0 has 3 pegs.
      // If the ball goes left, it hits the peg to the left?
      //
      // Let's trace the path logic again.
      // currentX += (direction === 0 ? -0.5 : 0.5) * PEG_SPACING_X;
      //
      // If we assume the ball hits a peg at each row:
      // The ball is "at" a specific peg in the current row before it falls to the next.
      // Or does it fall *between* pegs?
      // Plinko usually falls between pegs, hits one, and bounces left or right.
      //
      // In this implementation:
      // The ball moves from (0, STARTING_OFFSET_Y).
      // Row 0 is at `marginTop: 30px`.
      // `PEG_ROW_HEIGHT` is 25px.
      // `STARTING_OFFSET_Y` is 40px.
      //
      // It seems the ball moves *between* the pegs.
      // If it moves left (-0.5), it hits the left peg?
      // If it moves right (+0.5), it hits the right peg?
      //
      // Let's assume a standard triangular lattice.
      // We need to map the "path" (0s and 1s) to specific peg indices.
      //
      // Let `currentPegIndex` be the index of the peg in the current row that the ball hits.
      // Wait, if the ball falls *between* pegs, it hits the ones below it.
      //
      // Let's simplify. The ball hits a peg at row `i`.
      // Which peg?
      // Let's say we start at "center".
      // Row 0 has 3 pegs. Indices 0, 1, 2. Center is 1.
      // So we start at index 1 of Row 0.
      // If path[0] is 0 (left), we go to index 1 of Row 1? No.
      //
      // Standard Plinko:
      //      .
      //     . .
      //    . . .
      //
      // Here:
      // Row 0: . . . (3 pegs)
      //
      // If we start at index 1 (middle of 3).
      // Left (0) -> falls to left side.
      // Right (1) -> falls to right side.
      //
      // Actually, the `currentX` logic:
      // `currentX` changes by +/- 0.5 * spacing.
      // Pegs are at integer multiples of spacing?
      // `renderPegs` doesn't specify x-coordinates, it uses flexbox `justify-content: center`.
      // So the pegs are centered.
      //
      // If Row 0 has 3 pegs, they are at x = -spacing, 0, +spacing relative to center?
      // No, flex center.
      // Row 0 (3 pegs):  -1, 0, 1  (times spacing)
      // Row 1 (4 pegs): -1.5, -0.5, 0.5, 1.5
      //
      // The ball starts at 0.
      // Step 1: moves to +/- 0.5.
      // This aligns with Row 1 pegs (-0.5 or 0.5).
      // So at Step 1 (index 0 of path), the ball is at Row 1.
      // It hits a peg in Row 1.
      //
      // Which peg in Row 1?
      // Row 1 has 4 pegs. Indices 0, 1, 2, 3.
      // Positions: -1.5, -0.5, 0.5, 1.5.
      // If ball is at -0.5, it's index 1.
      // If ball is at 0.5, it's index 2.
      //
      // Let's generalize.
      // Row `r` has `r + 3` pegs.
      // Positions are centered.
      //
      // Let `pegIndex` be the index in the row.
      // Start at Row 0. Ball is at 0.
      // Row 0 has 3 pegs. Positions -1, 0, 1.
      // Ball is at 0 -> Index 1.
      //
      // So, at start (before any move), ball hits Row 0, Index 1.
      //
      // Then move 1 (path[0]):
      // 0 (Left) -> x = -0.5.
      // Row 1 (4 pegs): -1.5, -0.5, 0.5, 1.5.
      // Ball at -0.5 is Index 1.
      //
      // 1 (Right) -> x = 0.5.
      // Ball at 0.5 is Index 2.
      //
      // So:
      // Start: `currentPegIndex` = 1.
      // For each step `dir` (0 or 1):
      //   If `dir` == 1 (Right), `currentPegIndex` += 1.
      //   If `dir` == 0 (Left), `currentPegIndex` stays same?
      //
      // Let's check:
      // Start (Row 0): Index 1.
      // Left -> Row 1, Index 1. (Correct)
      // Right -> Row 1, Index 2. (Correct)
      //
      // Next step (Row 2, 5 pegs): -2, -1, 0, 1, 2.
      // From Row 1, Index 1 (-0.5):
      //   Left -> -1. (Index 1).
      //   Right -> 0. (Index 2).
      //
      // So the logic is:
      // `currentPegIndex` starts at 1.
      // For each row `i` (from 0 to rows-1):
      //   The ball hits Row `i` at `currentPegIndex`.
      //   Then it moves based on `path[i]`.
      //   If `path[i] == 1`, `currentPegIndex` increments.
      //   (If `path[i] == 0`, it stays same).
      //   The *next* hit will be at Row `i+1` with the new `currentPegIndex`.
      //
      // Wait, the `path` array has length `rows`.
      // `path[i]` is the move *after* hitting Row `i`?
      // Or is it the move to get *to* Row `i`?
      //
      // `getPlinkoOutcome` returns `path` of length `rows`.
      // Loop `i` from 0 to `rows`.
      //
      // In `PlinkoBoard`:
      // `path.forEach` loop runs `rows` times.
      // `currentY` starts at `STARTING_OFFSET_Y`.
      // Inside loop: `currentY += PEG_ROW_HEIGHT`.
      //
      // So the ball moves *down* to the next row.
      //
      // Sequence:
      // Time 0: Ball at top (Row 0). Hits Row 0, Index 1.
      // Animation starts.
      //
      // `stepPercentage` calculation:
      // `((index + 1) / (path.length + 1)) * 100`.
      // `path.length` is `rows`.
      //
      // Let's say rows=8.
      // index=0. Percentage = 1/9.
      // This is when the ball reaches Row 1.
      //
      // So:
      // T=0: Hit Row 0, Index 1.
      // T=1/9: Hit Row 1, Index (1 + path[0]).
      // T=2/9: Hit Row 2, Index (prev + path[1]).
      // ...
      // T=8/9: Hit Row 8?
      // Wait, there are `rows` steps in `path`.
      // Last step (index 7) moves to Row 8.
      // Row 8 is the last row of pegs?
      // `renderPegs` loops `i` from 0 to `rows - 1`.
      // So there are `rows` rows of pegs.
      // Indices 0 to 7.
      //
      // So the ball hits Row 0, then moves to Row 1... then moves to Row 7.
      // Then moves to Row 8 (which is the bucket).
      //
      // So we have `rows` hits.
      // Hit 0: Row 0.
      // Hit 1: Row 1.
      // ...
      // Hit `rows-1`: Row `rows-1`.
      //
      // Timing:
      // The animation duration is 4000ms.
      // The keyframes are defined by `stepPercentage`.
      // `stepPercentage` for index `i` corresponds to reaching Row `i+1`.
      //
      // Wait, `currentY` starts at `STARTING_OFFSET_Y` (Row 0).
      // `path.forEach`:
      //   Move to Row `i+1`.
      //   Keyframe at `stepPercentage`.
      //
      // So at `stepPercentage`, the ball is at Row `i+1`.
      // It hits the peg at Row `i+1`?
      // Or does it hit the peg at Row `i` before moving?
      //
      // Visually, the ball slides down. It hits the peg, then bounces.
      // So the "hit" happens *at* the keyframe?
      // No, the keyframe is the *end* of the segment.
      // Segment 0: From Row 0 to Row 1.
      // At 0%, it's at Row 0.
      // At `stepPercentage` (index 0), it's at Row 1.
      //
      // So:
      // At 0ms: Hit Row 0.
      // At (1 / (rows+1)) * 4000 ms: Hit Row 1.
      // At (2 / (rows+1)) * 4000 ms: Hit Row 2.
      // ...
      // At (rows / (rows+1)) * 4000 ms: Hit Row `rows`. (Wait, Row `rows` doesn't exist as pegs, it's buckets).
      //
      // `renderPegs` creates rows 0 to `rows-1`.
      // So the last peg hit is at Row `rows-1`.
      // This happens at index `rows-2`?
      //
      // Let's trace index.
      // path has length `rows`.
      // index 0: Move to Row 1.
      // index `rows-1`: Move to Row `rows`. (Bucket).
      //
      // So:
      // Hit Row 0 at T=0.
      // Hit Row 1 at T corresponding to index 0.
      // Hit Row 2 at T corresponding to index 1.
      // ...
      // Hit Row `rows-1` at T corresponding to index `rows-2`.
      //
      // The last move (index `rows-1`) moves to the bucket. No peg hit there.
      //
      // So we have hits for Row 0 to Row `rows-1`.
      //
      // Logic:
      // 1. Hit Row 0, Index 1 at T=0.
      // 2. Loop `i` from 0 to `rows - 2`.
      //    Calculate `currentPegIndex` based on `path[0...i]`.
      //    Hit Row `i+1`, Index `currentPegIndex` at T = ((i + 1) / (rows + 1)) * 4000.
      //
      // Wait, let's verify `currentPegIndex` update.
      // Start: Index 1.
      // Move 0 (path[0]): Update Index.
      // This new Index is for Row 1.
      // So for loop `i` (representing step index in path):
      //   Update `currentPegIndex` += path[i].
      //   This is the peg at Row `i+1`.
      //   Schedule hit for Row `i+1` at T(i).
      //
      // Correct.
      //
      // Implementation details:
      // `timeouts` array to clear on unmount.
      //
      const timeouts = [];
      // const TOTAL_DURATION = 4000; // Now calculated above

      // Hit Row 0
      let currentPegIndex = 1;
      const hitRow0 = () => {
        setActivePegs(prev => new Set(prev).add(`0-1`));
        setTimeout(() => setActivePegs(prev => {
          const next = new Set(prev);
          next.delete(`0-1`);
          return next;
        }), 300);
      };
      hitRow0();

      // Hits for subsequent rows
      path.forEach((direction, index) => {
        // Calculate target peg index for the NEXT row
        if (direction === 1) currentPegIndex++;

        // We only have pegs up to row `rows - 1`.
        // The path has `rows` steps.
        // Step 0 moves to Row 1.
        // Step `rows-1` moves to Row `rows` (buckets).
        // So we process hits for index 0 to `rows - 2`.

        if (index < rows - 1) {
          const row = index + 1;
          const peg = currentPegIndex;
          const time = ((index + 1) / (path.length + 1)) * TOTAL_DURATION;

          const t1 = setTimeout(() => {
            setActivePegs(prev => new Set(prev).add(`${row}-${peg}`));
          }, time);

          const t2 = setTimeout(() => {
            setActivePegs(prev => {
              const next = new Set(prev);
              next.delete(`${row}-${peg}`);
              return next;
            });
          }, time + 300);

          timeouts.push(t1, t2);
        }
      });

      return () => timeouts.forEach(clearTimeout);

    } else {
      setAnimationStyle('');
      setActivePegs(new Set());
    }
  }, [path, rows]);

  const renderPegs = () => {
    let pegs = [];
    for (let i = 0; i < rows; i++) {
      let rowPegs = [];
      for (let j = 0; j <= i + 2; j++) {
        const isHit = activePegs.has(`${i}-${j}`);
        rowPegs.push(
          <div
            key={`${i}-${j}`}
            className={`peg ${isHit ? 'hit' : ''}`}
          ></div>
        );
      }
      pegs.push(<div key={i} className="peg-row" style={{ marginTop: `${i === 0 ? 30 : 15}px` }}>{rowPegs}</div>);
    }
    return pegs;
  };

  const renderMultipliers = () => {
    return (
      <div className="multipliers-row">
        {multipliers.map((multiplier, index) => {
          // Calculate color gradient: Red (0) at edges, Yellow (60) at center
          const centerIndex = (multipliers.length - 1) / 2;
          const distance = Math.abs(index - centerIndex);
          const fraction = distance / centerIndex;
          const hue = 60 * (1 - fraction);
          const backgroundColor = `hsl(${hue}, 100%, 60%)`;
          // Darker text for lighter backgrounds might be needed, but white usually works on these

          return (
            <div
              key={index}
              className="multiplier-slot"
              style={{ backgroundColor, boxShadow: `0 0 5px hsl(${hue}, 100%, 60%)` }}
            >
              {multiplier}x
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="plinko-board">
      <style>{animationStyle}</style>
      <div className="ball-container">
        {path && <div className="plinko-ball" style={{ animation: `drop-animation ${rows * 250}ms forwards` }}></div>}
      </div>
      <div className="pegs-container">{renderPegs()}</div>
      {renderMultipliers()}
    </div>
  );
};

export default PlinkoBoard;
