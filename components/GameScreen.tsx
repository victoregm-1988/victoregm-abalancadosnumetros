import React, { useState, useMemo, useEffect } from 'react';
import type { GameState, Player, Equation, Operation, HiddenPart, BalanceState } from '../types';
import { PlusIcon, MinusIcon, MultiplyIcon, DivideIcon } from './icons';

interface GameScreenProps {
  gameState: GameState;
  players: Player[];
  creator: Player;
  solver: Player;
  round: number;
  equation: Equation | null;
  lastResult: { correct: boolean; message: string } | null;
  endGameFlag: boolean;
  onCreate: (equation: Equation) => void;
  onSolve: (isCorrect: boolean) => void;
  onNextTurn: () => void;
  onEndGameRequest: () => void;
}

const OperationButton: React.FC<{op: Operation, selectedOp: Operation | null, onClick: (op: Operation) => void}> = ({op, selectedOp, onClick}) => {
    const icons = {
        '+': <PlusIcon />,
        '-': <MinusIcon />,
        '*': <MultiplyIcon />,
        '/': <DivideIcon />,
    };
    const colors = {
        '+': 'bg-green-500 hover:bg-green-400',
        '-': 'bg-red-500 hover:bg-red-400',
        '*': 'bg-blue-500 hover:bg-blue-400',
        '/': 'bg-yellow-500 hover:bg-yellow-400',
    }
    const isSelected = selectedOp === op;

    return (
        <button 
            onClick={() => onClick(op)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-transform transform hover:scale-110 ${colors[op]} ${isSelected ? 'ring-4 ring-offset-2 ring-offset-slate-700 ring-white' : ''}`}
        >
            {icons[op]}
        </button>
    )
};

const BalanceScale: React.FC<{ state: BalanceState, leftContent: React.ReactNode, rightContent: React.ReactNode }> = ({ state, leftContent, rightContent }) => {
    const rotationClass = {
        'level': 'rotate-0',
        'left-down': '-rotate-[5deg]',
        'right-down': 'rotate-[5deg]',
    }[state];

    // Counter-rotation to keep pans level
    const counterRotationClass = {
        'level': 'rotate-0',
        'left-down': 'rotate-[5deg]',
        'right-down': '-rotate-[5deg]',
    }[state];

    return (
        <div className="relative flex flex-col items-center my-8 h-64 w-full">
            {/* Fulcrum (the stand) */}
            <div className="absolute bottom-0 flex flex-col items-center">
                <div className="w-4 h-24 bg-slate-600"></div>
                <div className="w-40 h-4 bg-slate-700 rounded-md"></div>
            </div>
             {/* A small triangle on top of the fulcrum */}
            <div className="absolute" style={{bottom: '96px', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '15px solid rgb(71 85 105)'}}></div>

            {/* Beam assembly (this part rotates) */}
            <div className={`absolute w-[90%] max-w-xl h-40 top-0 transition-transform duration-700 ease-in-out ${rotationClass}`} style={{ transformOrigin: 'center 110px' }}>
                {/* The horizontal beam */}
                <div className="absolute top-[102px] left-0 right-0 h-2 bg-slate-500 rounded-full mx-auto w-full"></div>
                
                {/* Left side */}
                <div className="absolute left-0 top-0 h-full flex flex-col items-center">
                    {/* Hanger */}
                    <div className="w-0.5 h-[102px] bg-slate-400"></div>
                    {/* Pan */}
                    <div className={`w-32 min-h-[5rem] bg-slate-600 border-4 border-slate-500 text-cyan-300 rounded-lg p-2 text-center text-2xl font-bold flex items-center justify-center shadow-lg transition-transform duration-700 ease-in-out ${counterRotationClass}`}>
                        {leftContent}
                    </div>
                </div>

                {/* Right side */}
                <div className="absolute right-0 top-0 h-full flex flex-col items-center">
                    {/* Hanger */}
                    <div className="w-0.5 h-[102px] bg-slate-400"></div>
                    {/* Pan */}
                     <div className={`w-32 min-h-[5rem] bg-slate-600 border-4 border-slate-500 text-cyan-300 rounded-lg p-2 text-center text-2xl font-bold flex items-center justify-center shadow-lg transition-transform duration-700 ease-in-out ${counterRotationClass}`}>
                        {rightContent}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const GameScreen: React.FC<GameScreenProps> = ({ gameState, players, creator, solver, round, equation, lastResult, endGameFlag, onCreate, onSolve, onNextTurn, onEndGameRequest }) => {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [operator, setOperator] = useState<Operation | null>(null);
    const [result, setResult] = useState('');
    const [hiddenPart, setHiddenPart] = useState<HiddenPart>('num1');
    const [error, setError] = useState('');
    
    const [guessNum, setGuessNum] = useState('');
    const [guessOp, setGuessOp] = useState<Operation | null>(null);
    
    const [balanceState, setBalanceState] = useState<BalanceState>('level');
    const [showGuessOnBalance, setShowGuessOnBalance] = useState(false);

    useEffect(() => {
        const n1 = parseInt(num1);
        const n2 = parseInt(num2);

        if (!isNaN(n1) && !isNaN(n2) && operator && n1 > 0 && n2 > 0) {
            let calculatedResult;
            let currentError = '';

            switch (operator) {
                case '+':
                    calculatedResult = n1 + n2;
                    break;
                case '-':
                    if (n1 < n2) {
                        currentError = 'O 1º número deve ser maior ou igual ao 2º na subtração.';
                    } else {
                        calculatedResult = n1 - n2;
                    }
                    break;
                case '*':
                    calculatedResult = n1 * n2;
                    break;
                case '/':
                    if (n1 % n2 !== 0) {
                        currentError = 'A divisão deve ter um resultado inteiro.';
                    } else {
                        calculatedResult = n1 / n2;
                    }
                    break;
            }

            setError(currentError);
            if (calculatedResult !== undefined) {
                setResult(String(calculatedResult));
            } else {
                setResult('');
            }
        } else {
            setResult(''); // Clear result if inputs are not valid
        }
    }, [num1, num2, operator]);

    const resetForm = () => {
        setNum1(''); setNum2(''); setOperator(null); setResult(''); setHiddenPart('num1'); setError('');
        setGuessNum(''); setGuessOp(null); setBalanceState('level');
        setShowGuessOnBalance(false);
    }

    const handleCreateSubmit = () => {
        const n1 = parseInt(num1);
        const n2 = parseInt(num2);
        const res = parseInt(result);

        if (error) {
            return; // Don't submit if there's a live validation error
        }
        
        if (isNaN(n1) || isNaN(n2) || isNaN(res) || !operator) {
            setError('Todos os campos da equação devem ser preenchidos.');
            return;
        }

        onCreate({ num1: n1, num2: n2, operator, result: res, hiddenPart });
        resetForm();
    };

    const handleSolveSubmit = () => {
        if (!equation) return;
        const guessN = parseInt(guessNum);
        
        if (isNaN(guessN) || !guessOp) {
             setError('Você precisa escolher um número e uma operação.');
             return;
        }
        if (guessN <= 0) {
            setError('O número deve ser maior que zero.');
            return;
        }
        
        setShowGuessOnBalance(true);

        let solvedNum1, solvedNum2;
        const solvedResult = equation.result;
        
        if(equation.hiddenPart === 'num1') {
            solvedNum1 = guessN;
            solvedNum2 = equation.num2;
        } else { // hiddenPart === 'num2'
            solvedNum1 = equation.num1;
            solvedNum2 = guessN;
        }
        
        let isCorrect = false;
        let calculatedResult;
        switch (guessOp) {
            case '+': calculatedResult = solvedNum1 + solvedNum2; break;
            case '-': calculatedResult = solvedNum1 - solvedNum2; break;
            case '*': calculatedResult = solvedNum1 * solvedNum2; break;
            case '/': calculatedResult = solvedNum1 / solvedNum2; break;
        }
        
        if (calculatedResult === solvedResult) {
            isCorrect = true;
        }

        if(isCorrect){
            setBalanceState('level');
        } else if (calculatedResult > solvedResult) {
            setBalanceState('left-down');
        } else {
            setBalanceState('right-down');
        }
        
        setTimeout(() => onSolve(isCorrect), 1000);
    };
    
    let leftBalanceContent: React.ReactNode = '';
    let rightBalanceContent: React.ReactNode = '';

    if (equation) {
        rightBalanceContent = `${equation.result}`;

        const opIcon = guessOp ? {
            '+': <PlusIcon />,
            '-': <MinusIcon />,
            '*': <MultiplyIcon />,
            '/': <DivideIcon />,
        }[guessOp] : null;

        if (showGuessOnBalance && opIcon && guessNum) {
            const n1 = equation.hiddenPart === 'num1' ? <span className="text-yellow-300">{guessNum}</span> : equation.num1;
            const n2 = equation.hiddenPart === 'num2' ? <span className="text-yellow-300">{guessNum}</span> : equation.num2;
            const opElement = <div className="inline-block w-6 h-6 text-yellow-300">{opIcon}</div>;

            leftBalanceContent = (
                <div className="flex items-center justify-center gap-1 text-2xl">
                    {n1}
                    {opElement}
                    {n2}
                </div>
            );
        } else {
            const n1 = equation.hiddenPart === 'num1' ? '?' : equation.num1;
            const n2 = equation.hiddenPart === 'num2' ? '?' : equation.num2;
            leftBalanceContent = `${n1} ? ${n2}`;
        }
    }

    const renderHeader = () => (
        <div className="mb-6 text-center">
            <div className="flex justify-between items-center mb-4 text-lg">
                <div className="text-left">
                    <div className="font-bold text-cyan-400">{players[0].name}</div>
                    <div className="text-2xl font-bold">{players[0].score} Pts</div>
                </div>
                <div className="text-yellow-300 font-bold text-xl">Rodada {round}</div>
                 <div className="text-right">
                    <div className="font-bold text-pink-400">{players[1].name}</div>
                    <div className="text-2xl font-bold">{players[1].score} Pts</div>
                </div>
            </div>
            {gameState === 'CREATING' && <h2 className="text-2xl font-semibold"><span className="font-bold text-yellow-300">{creator.name}</span>, crie um desafio!</h2>}
            {gameState === 'SOLVING' && <h2 className="text-2xl font-semibold"><span className="font-bold text-yellow-300">{solver.name}</span>, equilibre a balança!</h2>}
        </div>
    );
    
    const renderCreateForm = () => (
        <div className="flex flex-col items-center animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-cyan-400 mb-3 text-center">1. Monte a sua equação</h3>
                    <div className="flex items-center justify-center space-x-2">
                        <input type="number" min="1" value={num1} onChange={e => setNum1(e.target.value)} className="w-20 text-center bg-slate-900 rounded p-2 text-2xl" />
                        <span className="text-2xl w-8 text-center">{operator || '?'}</span>
                        <input type="number" min="1" value={num2} onChange={e => setNum2(e.target.value)} className="w-20 text-center bg-slate-900 rounded p-2 text-2xl" />
                        <span className="text-2xl">=</span>
                        <input type="number" value={result} readOnly className="w-20 text-center bg-slate-950 text-slate-400 rounded p-2 text-2xl" placeholder="..." />
                    </div>
                    <div className="flex justify-center space-x-2 mt-4">
                        {(['+', '-', '*', '/'] as Operation[]).map(op => <OperationButton key={op} op={op} selectedOp={operator} onClick={setOperator} />)}
                    </div>
                </div>
                 <div className="bg-slate-800 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-cyan-400 mb-3 text-center">2. Qual número esconder?</h3>
                    <div className="flex justify-around items-center h-full">
                        {(['num1', 'num2'] as HiddenPart[]).map(part => (
                             <label key={part} className="flex flex-col items-center space-y-1 cursor-pointer">
                                <input type="radio" name="hidden" checked={hiddenPart === part} onChange={() => setHiddenPart(part)} className="w-5 h-5" />
                                <span className={`font-medium px-3 py-1 rounded-full ${hiddenPart === part ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-white'}`}>{part === 'num1' ? "1º Número" : "2º Número"}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <button onClick={handleCreateSubmit} className="mt-6 bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-10 rounded-full text-lg transform hover:scale-105 transition-all duration-300">Criar Desafio</button>
        </div>
    );
    
    const renderSolveForm = () => (
        <div className="flex flex-col items-center animate-fade-in">
             <BalanceScale state={balanceState} leftContent={leftBalanceContent} rightContent={rightBalanceContent} />

            <div className="bg-slate-800 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6 mt-4">
                <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-2 text-center">Sua Resposta</h3>
                     <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <label className="text-sm text-slate-400 mb-1">Número</label>
                            <input type="number" min="1" value={guessNum} onChange={e => setGuessNum(e.target.value)} className="w-24 text-center bg-slate-900 rounded p-2 text-2xl" />
                        </div>
                        <div className="flex flex-col items-center">
                             <label className="text-sm text-slate-400 mb-1">Operação</label>
                            <div className="flex justify-center space-x-2">
                                {(['+', '-', '*', '/'] as Operation[]).map(op => <OperationButton key={op} op={op} selectedOp={guessOp} onClick={setGuessOp} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {error && <p className="text-red-400 mt-4">{error}</p>}
            <button onClick={handleSolveSubmit} className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-10 rounded-full text-lg transform hover:scale-105 transition-all duration-300">Verificar</button>
        </div>
    );

    const renderResultScreen = () => (
         <div className="flex flex-col items-center text-center animate-fade-in">
            <BalanceScale state={lastResult?.correct ? 'level' : balanceState} leftContent={leftBalanceContent} rightContent={rightBalanceContent} />
            <h2 className={`text-3xl font-bold mt-4 ${lastResult?.correct ? 'text-green-400' : 'text-red-400'}`}>{lastResult?.message}</h2>
             <button onClick={() => { onNextTurn(); resetForm(); }} className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-10 rounded-full text-lg transform hover:scale-105 transition-all duration-300">Próximo Turno</button>
        </div>
    );

    return (
        <div>
            {renderHeader()}
            <div className="mt-4 min-h-[350px] flex flex-col justify-center">
                {gameState === 'CREATING' && renderCreateForm()}
                {gameState === 'SOLVING' && renderSolveForm()}
                {gameState === 'SHOWING_RESULT' && renderResultScreen()}
            </div>
             <div className="text-center mt-8">
                {!endGameFlag ? (
                    <button onClick={onEndGameRequest} className="text-slate-400 hover:text-white underline transition">Acabar neste turno</button>
                ) : (
                    <p className="text-yellow-400 font-semibold animate-pulse">O jogo terminará no final desta rodada!</p>
                )}
            </div>
        </div>
    );
};