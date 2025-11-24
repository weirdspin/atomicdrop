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
            return (
              <li key={index}>
                Bet: {game.bet}, Outcome: {formatNumber(game.outcome)}, Win: {formatNumber(game.winAmount)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GameHistory;
