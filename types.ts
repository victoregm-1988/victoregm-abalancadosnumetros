export type Operation = '+' | '-' | '*' | '/';
export type HiddenPart = 'num1' | 'num2';

export interface Player {
  name: string;
  score: number;
}

export interface Equation {
  num1: number;
  num2: number;
  operator: Operation;
  result: number;
  hiddenPart: HiddenPart;
}

export type GameState = 'WELCOME' | 'CREATING' | 'SOLVING' | 'SHOWING_RESULT' | 'GAME_OVER';

export type BalanceState = 'level' | 'left-down' | 'right-down';