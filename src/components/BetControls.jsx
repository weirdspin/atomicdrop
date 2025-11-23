import React from 'react';
import './BetControls.css'; // Assuming a CSS file for styling

const BetControls = ({
  betAmount,
  setBetAmount,
  rows,
  setRows,
  riskLevel,
  setRiskLevel,
  balance,
  isBetting,
  handleBet, // This function will be passed from App.jsx later
}) => {
  const handleBetAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBetAmount(value);
    }
  };

  const handleRowsChange = (e) => {
    setRows(parseInt(e.target.value, 10));
  };

  const handleRiskLevelChange = (e) => {
    setRiskLevel(e.target.value);
  };

  return (
    <div className="bet-controls">
      <h2>Place Your Bet</h2>
      <div className="control-group">
        <label htmlFor="balance">Balance:</label>
        <span id="balance">${balance.toFixed(2)}</span>
      </div>

      <div className="control-group">
        <label htmlFor="betAmount">Bet Amount:</label>
        <input
          type="number"
          id="betAmount"
          value={betAmount}
          onChange={handleBetAmountChange}
          min="0.01"
          step="0.01"
          disabled={isBetting}
        />
      </div>

      <div className="control-group">
        <label htmlFor="rows">Rows:</label>
        <input
          type="range"
          id="rows"
          min="8"
          max="16"
          value={rows}
          onChange={handleRowsChange}
          disabled={isBetting}
        />
        <span>{rows}</span>
      </div>

      <div className="control-group">
        <label htmlFor="riskLevel">Risk Level:</label>
        <select
          id="riskLevel"
          value={riskLevel}
          onChange={handleRiskLevelChange}
          disabled={isBetting}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button onClick={handleBet} disabled={isBetting || betAmount <= 0 || betAmount > balance}>
        {isBetting ? 'Dropping...' : 'Drop Ball'}
      </button>
    </div>
  );
};

export default BetControls;
