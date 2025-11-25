import React from 'react';
import './GameHistory.css';

const GameHistory = ({ history }) => {
  return (
    <div className="game-history">
      <h2>Game History</h2>
      {history.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <ul>
          {history.map((game, index) => {
            const formatNumber = (num) => parseFloat(Number(num).toFixed(1));
            let color;
            if (game.outcome < 1) color = '#ff4d4d'; // Red
            else if (game.outcome === 1) color = '#ffc107'; // Yellow (Amber)
            else color = '#4caf50'; // Green

            return (
              <li key={index} style={{ color: color }}>
                Bet: {game.bet}, Outcome: {formatNumber(game.outcome)}x, Win: {formatNumber(game.winAmount)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GameHistory;
