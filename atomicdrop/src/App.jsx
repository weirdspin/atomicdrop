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
  const [balls, setBalls] = useState([]); // Array of active balls
  const [multipliers, setMultipliers] = useState([]);

  useEffect(() => {
    // Generate an initial server seed when the app loads
    generateServerSeed().then(setServerSeed);
    generateServerSeed().then(setServerSeed);
    // Calculate multipliers whenever rows changes
    setMultipliers(calculateMultipliers(rows));
  }, [rows]);


  const handleBet = async () => {
    if (betAmount > balance) return;

    setIsBetting(true);
    setBalance(prev => prev - betAmount);

    const { path: ballPath, bucket } = await getPlinkoOutcome(serverSeed, clientSeed, nonce, rows);

    const ballId = `ball_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBall = { id: ballId, path: ballPath, rows };

    setBalls(prev => [...prev, newBall]);

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
      setGameHistory(prev => [newGameResult, ...prev]);

      // Prepare for the next game
      // In a real app, you would generate a new server seed and show its hash
      // generateServerSeed().then(setServerSeed);

      // Remove the ball from the board
      setBalls(prev => prev.filter(ball => ball.id !== ballId));

      setIsBetting(false); // This might need to be smarter if we want to track "any active bet"
    }, animationDuration); // Wait for animation to finish

    setNonce(prev => prev + 1);
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
            isBetting={false} // Always allow betting
            handleBet={handleBet}
          />
        </div>
        <div className="game-column board-column">
          <PlinkoBoard
            rows={rows}
            balls={balls}
            multipliers={multipliers}
          />
        </div>
        <div className="game-column info-column">
          <GameHistory history={gameHistory} />
        </div>
      </main>
      <div className="provably-fair-container">
        <div className="game-column">
          <ProvablyFair
            serverSeed={serverSeed} // In a real game, you'd show the hashed seed before the bet
            clientSeed={clientSeed}
            nonce={nonce}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

