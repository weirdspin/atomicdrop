import React, { useState, useEffect } from 'react';
import './PlinkoBoard.css';

const PlinkoBall = ({ id, path, rows, onPegHit }) => {
  const [animationStyle, setAnimationStyle] = useState('');

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

      let keyframes = `@keyframes drop-animation-${id} { 0% { transform: translate(0, 0); opacity: 1; }`;

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
      keyframes += `}`;

      setAnimationStyle(keyframes);

      // Calculate peg hits
      let currentPegIndex = 1;
      // Hit Row 0
      const hitRow0 = () => {
        onPegHit(`0-1`);
      };
      hitRow0();

      const timeouts = [];

      path.forEach((direction, index) => {
        if (direction === 1) currentPegIndex++;

        if (index < rows - 1) {
          const row = index + 1;
          const peg = currentPegIndex;
          const time = ((index + 1) / (path.length + 1)) * TOTAL_DURATION;

          const t1 = setTimeout(() => {
            onPegHit(`${row}-${peg}`);
          }, time);

          timeouts.push(t1);
        }
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [path, rows, id, onPegHit]);

  if (!path) return null;

  return (
    <>
      <style>{animationStyle}</style>
      <div
        className="plinko-ball"
        style={{ animation: `drop-animation-${id} ${rows * 250}ms forwards` }}
      ></div>
    </>
  );
};

const PlinkoBoard = ({ rows, balls = [], multipliers = [], hitBucket }) => {
  const [activePegs, setActivePegs] = useState(new Set());

  const handlePegHit = (pegId) => {
    setActivePegs(prev => new Set(prev).add(pegId));
    setTimeout(() => {
      setActivePegs(prev => {
        const next = new Set(prev);
        next.delete(pegId);
        return next;
      });
    }, 300);
  };

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
          const isHit = index === hitBucket;

          return (
            <div
              key={index}
              className={`multiplier-slot ${isHit ? 'hit' : ''}`}
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
      <div className="ball-container">
        {balls.map(ball => (
          <PlinkoBall
            key={ball.id}
            {...ball}
            onPegHit={handlePegHit}
          />
        ))}
      </div>
      <div className="pegs-container">{renderPegs()}</div>
      {renderMultipliers()}
    </div>
  );
};

export default PlinkoBoard;
