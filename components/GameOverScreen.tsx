
import React, { useMemo } from 'react';
import type { Player } from '../types';

interface GameOverScreenProps {
  players: Player[];
  onReset: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, onReset }) => {
  const winner = useMemo(() => {
    if (players[0].score > players[1].score) {
      return players[0];
    }
    if (players[1].score > players[0].score) {
      return players[1];
    }
    return null; // Tie
  }, [players]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <h2 className="text-4xl font-bold text-yellow-300 mb-4">Fim de Jogo!</h2>
      
      {winner ? (
        <p className="text-2xl text-white mb-8">
          Parabéns, <span className="font-bold text-cyan-400">{winner.name}</span>! Você venceu!
        </p>
      ) : (
        <p className="text-2xl text-white mb-8">
          Incrível! Foi um empate!
        </p>
      )}

      <div className="w-full max-w-md bg-slate-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Placar Final</h3>
        <div className="flex justify-around text-lg">
          <div className="p-4">
            <p className="font-bold text-xl">{players[0].name}</p>
            <p className="text-3xl font-bold mt-1">{players[0].score} <span className="text-base font-normal">pontos</span></p>
          </div>
          <div className="border-l border-slate-600"></div>
          <div className="p-4">
            <p className="font-bold text-xl">{players[1].name}</p>
            <p className="text-3xl font-bold mt-1">{players[1].score} <span className="text-base font-normal">pontos</span></p>
          </div>
        </div>
      </div>
      
      <button
        onClick={onReset}
        className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-10 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
      >
        Jogar Novamente
      </button>
    </div>
  );
};
