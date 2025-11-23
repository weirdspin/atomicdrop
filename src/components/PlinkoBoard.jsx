import React, { useState, useEffect } from 'react';
import './PlinkoBoard.css';

const PlinkoBoard = ({ rows, path, multipliers = [] }) => {
  const [animationStyle, setAnimationStyle] = useState('');

  useEffect(() => {
    if (path) {
      // All these values are based on the CSS and need to be kept in sync.
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
    } else {
      setAnimationStyle('');
    }
  }, [path, rows]);

  const renderPegs = () => {
    let pegs = [];
    for (let i = 0; i < rows; i++) {
      let rowPegs = [];
      for (let j = 0; j <= i + 2; j++) {
        rowPegs.push(<div key={`${i}-${j}`} className="peg"></div>);
      }
      pegs.push(<div key={i} className="peg-row" style={{ marginTop: `${i === 0 ? 30 : 15}px` }}>{rowPegs}</div>);
    }
    return pegs;
  };

  const renderMultipliers = () => {
    return (
      <div className="multipliers-row">
        {multipliers.map((multiplier, index) => {
          let formattedMultiplier;
          if (Number.isInteger(multiplier)) {
            formattedMultiplier = multiplier.toFixed(0); // Display as integer
          } else {
            formattedMultiplier = multiplier.toFixed(1); // Display with one decimal
          }
          return (
            <div key={index} className="multiplier-slot">
              {formattedMultiplier}
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
        {path && <div className="plinko-ball" style={{ animation: `drop-animation 4s forwards` }}></div>}
      </div>
      <div className="pegs-container">{renderPegs()}</div>
      {renderMultipliers()}
    </div>
  );
};

export default PlinkoBoard;
