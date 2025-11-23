import React from 'react';
import './PlinkoBoard.css'; // Assuming a CSS file for styling

const PlinkoBoard = ({ rows }) => {
  // Placeholder multipliers - will be dynamically generated later
  const multipliers = [0.5, 2, 0.5, 4, 0.5, 2, 0.5, 10, 0.5, 2, 0.5, 4, 0.5, 2, 0.5]; // Example for 8 rows

  const renderPegs = () => {
    let pegs = [];
    for (let i = 0; i < rows; i++) {
      let rowPegs = [];
      // Each row has i + 1 pegs
      for (let j = 0; j <= i; j++) {
        rowPegs.push(<div key={`${i}-${j}`} className="peg"></div>);
      }
      pegs.push(
        <div key={i} className="peg-row">
          {rowPegs}
        </div>
      );
    }
    return pegs;
  };

  const renderMultipliers = () => {
    // The number of landing slots is 'rows + 1'
    // Ensure the placeholder multipliers array has enough values
    const displayedMultipliers = multipliers.slice(0, rows + 1);

    return (
      <div className="multipliers-row">
        {displayedMultipliers.map((multiplier, index) => (
          <div key={index} className="multiplier-slot">
            {multiplier.toFixed(1)}x
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="plinko-board">
      <div className="ball-container">
        {/* Ball element - its position will be animated */}
        <div className="plinko-ball"></div>
      </div>
      <div className="pegs-container">
        {renderPegs()}
      </div>
      {renderMultipliers()}
    </div>
  );
};

export default PlinkoBoard;
