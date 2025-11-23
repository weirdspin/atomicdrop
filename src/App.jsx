import React, { useState } from 'react';
import './App.css';
import BetControls from './components/BetControls';
import PlinkoBoard from './components/PlinkoBoard';
import GameHistory from './components/GameHistory';
import ProvablyFair from './components/ProvablyFair';

function App() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(1);
  const [rows, setRows] = useState(8);
  const [riskLevel, setRiskLevel] = useState('medium'); // 'low', 'medium', 'high'
  const [serverSeed, setServerSeed] = useState('initialServerSeed'); // Placeholder
  const [clientSeed, setClientSeed] = useState('initialClientSeed'); // Placeholder
  const [nonce, setNonce] = useState(0);
  const [gameHistory, setGameHistory] = useState([]); // Array of { bet, outcome, winAmount, nonce }
  const [isBetting, setIsBetting] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Atomic Drop - Plinko</h1>
      </header>
      <main className="game-container">
        <div className="game-column controls-column">
          <BetControls
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            rows={rows}
            setRows={setRows}
            riskLevel={riskLevel}
            setRiskLevel={setRiskLevel}
            balance={balance}
            isBetting={isBetting}
            // Add handleBet function here later
          />
        </div>
        <div className="game-column board-column">
          <PlinkoBoard
            rows={rows}
            // Add path for animation later
          />
        </div>
        <div className="game-column info-column">
          <GameHistory history={gameHistory} />
          <ProvablyFair
            serverSeed={serverSeed}
            clientSeed={clientSeed}
            nonce={nonce}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
