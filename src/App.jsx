import React, { useState, useEffect } from 'react';
import './App.css';
import BetControls from './components/BetControls';
import PlinkoBoard from './components/PlinkoBoard';
import GameHistory from './components/GameHistory';
import ProvablyFair from './components/ProvablyFair';
import { getPlinkoOutcome, calculateMultipliers, generateServerSeed } from './gameLogic.js';

function App() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(1);
  const [rows, setRows] = useState(8);
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('initialClientSeed'); // Placeholder
  const [nonce, setNonce] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [isBetting, setIsBetting] = useState(false);
  const [path, setPath] = useState(null); // The path for the ball animation
  const [multipliers, setMultipliers] = useState([]);

  useEffect(() => {
    // Generate an initial server seed when the app loads
    generateServerSeed().then(setServerSeed);
    generateServerSeed().then(setServerSeed);
    // Calculate multipliers whenever rows changes
    setMultipliers(calculateMultipliers(rows));
  }, [rows]);


  const handleBet = async () => {
    if (isBetting || betAmount > balance) return;

    setIsBetting(true);
    setBalance(prev => prev - betAmount);

    const { path: ballPath, bucket } = await getPlinkoOutcome(serverSeed, clientSeed, nonce, rows);
    setPath(ballPath);

    setPath(ballPath);

    const currentMultipliers = calculateMultipliers(rows);
    const multiplier = currentMultipliers[bucket];
    const winAmount = betAmount * multiplier;

    // Calculate animation duration based on rows to ensure constant speed
    const DROP_TIME_PER_ROW = 250; // ms per row
    const animationDuration = rows * DROP_TIME_PER_ROW;

    // Simulate animation time before updating results
    setTimeout(() => {
      setBalance(prev => prev + winAmount);

      const newGameResult = {
        bet: betAmount,
        outcome: multiplier,
        winAmount: winAmount,
        nonce: nonce,
      };
      setGameHistory([newGameResult, ...gameHistory]);

      // Prepare for the next game
      setNonce(prev => prev + 1);
      // In a real app, you would generate a new server seed and show its hash
      // generateServerSeed().then(setServerSeed);
      setIsBetting(false);
      setPath(null); // Reset path after animation
    }, animationDuration); // Wait for animation to finish
  };


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
            balance={balance}
            isBetting={isBetting}
            handleBet={handleBet}
          />
        </div>
        <div className="game-column board-column">
          <PlinkoBoard
            rows={rows}
            path={path}
            multipliers={multipliers}
          />
        </div>
        <div className="game-column info-column">
          <GameHistory history={gameHistory} />
          <ProvablyFair
            serverSeed={serverSeed} // In a real game, you'd show the hashed seed before the bet
            clientSeed={clientSeed}
            nonce={nonce}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

