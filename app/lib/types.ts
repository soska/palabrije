import { gameStatus } from "~/lib/constants";

export type PossibleGameStatus = typeof gameStatus[keyof typeof gameStatus];

export type LetterGuess = {
  letter: string;
  level: number;
};

export type Play = {
  letters: LetterGuess[];
};

export type SessionState = {
  status: PossibleGameStatus;
  plays: Play[];
  currentRound: number;
  error?: string | null;
  date: string;
};
