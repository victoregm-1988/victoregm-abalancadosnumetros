
import React, { useState, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import type { Player, GameState, Equation } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [players, setPlayers] = useState<Player[]>([
    { name: 'Jogador 1', score: 0 },
    { name: 'Jogador 2', score: 0 },
  ]);
  const [round, setRound] = useState(1);
  const [creatorIndex, setCreatorIndex] = useState(0);
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [lastResult, setLastResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [endGameFlag, setEndGameFlag] = useState(false);

  const solverIndex = (creatorIndex + 1) % 2;

  const handleStart = useCallback((p1Name: string, p2Name: string) => {
    setPlayers([
      { name: p1Name || 'Jogador 1', score: 0 },
      { name: p2Name || 'Jogador 2', score: 0 },
    ]);
    setGameState('CREATING');
  }, []);

  const handleReset = useCallback(() => {
    setGameState('WELCOME');
    setPlayers([
      { name: 'Jogador 1', score: 0 },
      { name: 'Jogador 2', score: 0 },
    ]);
    setRound(1);
    setCreatorIndex(0);
    setCurrentEquation(null);
    setLastResult(null);
    setEndGameFlag(false);
  }, []);

  const handleCreate = useCallback((equation: Equation) => {
    setCurrentEquation(equation);
    setGameState('SOLVING');
  }, []);

  const handleSolve = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        newPlayers[solverIndex].score += 1;
        return newPlayers;
      });
      setLastResult({ correct: true, message: 'Balança equilibrada! Ponto para você!' });
    } else {
      setLastResult({ correct: false, message: 'Ops! A balança não equilibrou. Tente na próxima.' });
    }
    setGameState('SHOWING_RESULT');
  }, [solverIndex]);

  const handleNextTurn = useCallback(() => {
    setLastResult(null);
    const nextCreatorIndex = (creatorIndex + 1) % 2;

    if (creatorIndex === 1 && nextCreatorIndex === 0) { // Round over
      if (endGameFlag) {
        setGameState('GAME_OVER');
        return;
      }
      setRound(r => r + 1);
    }
    
    setCreatorIndex(nextCreatorIndex);
    setCurrentEquation(null);
    setGameState('CREATING');
  }, [creatorIndex, endGameFlag]);

  const handleEndGameRequest = useCallback(() => {
    setEndGameFlag(true);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'WELCOME':
        return <WelcomeScreen onStart={handleStart} />;
      case 'CREATING':
      case 'SOLVING':
      case 'SHOWING_RESULT':
        return (
          <GameScreen
            gameState={gameState}
            players={players}
            creator={players[creatorIndex]}
            solver={players[solverIndex]}
            round={round}
            equation={currentEquation}
            lastResult={lastResult}
            endGameFlag={endGameFlag}
            onCreate={handleCreate}
            onSolve={handleSolve}
            onNextTurn={handleNextTurn}
            onEndGameRequest={handleEndGameRequest}
          />
        );
      case 'GAME_OVER':
        return <GameOverScreen players={players} onReset={handleReset} />;
      default:
        return <div>Carregando...</div>;
    }
  };

  return (
    <div className="bg-slate-800 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            A Balança dos Números
          </h1>
        </header>
        <main className="bg-slate-700 rounded-2xl shadow-2xl p-4 md:p-8">
          {renderContent()}
        </main>
         <footer className="text-center mt-6 text-slate-400 text-sm">
          <p>Um jogo para praticar o pensamento algébrico.</p>
        </footer>
      </div>
    </div>
  );
}
