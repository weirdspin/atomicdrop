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
          {history.map((game, index) => (
            <li key={index}>
              Bet: {game.bet}, Outcome: {game.outcome}, Win: {game.winAmount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameHistory;
