
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (player1Name: string, player2Name:string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');

  const handleStart = () => {
    onStart(p1Name.trim(), p2Name.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-4">Bem-vindos, desafiantes!</h2>
      <p className="text-slate-300 mb-8 max-w-md">Preparem-se para um desafio de lógica e matemática. Insiram seus nomes para começar a aventura e equilibrar a balança do conhecimento!</p>
      
      <div className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="player1" className="block text-left text-cyan-400 font-medium mb-1">Nome do Jogador 1</label>
          <input
            id="player1"
            type="text"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
            placeholder="Ex: Ana"
            className="w-full bg-slate-800 border-2 border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>
        <div>
          <label htmlFor="player2" className="block text-left text-cyan-400 font-medium mb-1">Nome do Jogador 2</label>
          <input
            id="player2"
            type="text"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
            placeholder="Ex: Beto"
            className="w-full bg-slate-800 border-2 border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>
      </div>

      <button
        onClick={handleStart}
        className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-10 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
      >
        Começar a Jogar
      </button>
    </div>
  );
};
