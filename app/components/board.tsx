import * as React from "react";
import {
  gameStatus,
  letterStatus,
  MAX_ROUNDS,
  WORD_LENGTH,
} from "~/lib/constants";
import { Keyboard } from "~/components/keyboard";
import type { LetterGuess, Play, SessionState } from "~/lib/types";

// array of five
const rows = Array(MAX_ROUNDS).fill(null);
const columns = Array(WORD_LENGTH).fill(null);

export function PlayRow({ play }: { play?: Play }) {
  const letters = play?.letters ?? [];
  console.log("letters", letters);
  return (
    <div className="tiles-row">
      {columns.map((_, j) => {
        const currentLetter = letters[j];
        let className = ["tile"];
        if (currentLetter?.level === letterStatus.GREEN) {
          className.push("green");
        }
        if (currentLetter?.level === letterStatus.YELLOW) {
          className.push("yellow");
        }

        if (currentLetter?.level === letterStatus.BLACK) {
          className.push("gray");
        }

        return (
          <div className={className.join(" ")} key={"card_" + j}>
            {letters[j]?.letter ?? ""}
          </div>
        );
      })}
    </div>
  );
}

export function GuessRow({ guess = [] }: { guess: string[] }) {
  return (
    <div className="tiles-row">
      {columns.map((_, j) => {
        return (
          <div className={"tile"} key={"guess-card_" + j}>
            {guess[j] ?? ""}
          </div>
        );
      })}
    </div>
  );
}

export function Tiles({
  gameState,
  guess,
}: {
  gameState: SessionState;
  guess: string[];
}) {
  const { plays = [], currentRound } = gameState;

  return (
    <>
      {rows.map((_, round) => {
        if (round === currentRound) {
          return <GuessRow key={"row_" + round} guess={guess} />;
        }
        return <PlayRow play={plays[round]} key={"row_" + round} />;
      })}
    </>
  );
}

export function Board({
  gameState,
  word,
}: {
  gameState: SessionState;
  word: string;
}) {
  const { error } = gameState;

  const [letters, setLetters] = React.useState<string[]>([]);
  const onAddLetter = (letter: string) => () => {
    if (letters.length < WORD_LENGTH) {
      setLetters([...letters, letter]);
    }
  };

  const onRemoveLastLetter = () => {
    if (letters.length > 0) {
      setLetters(letters.slice(0, -1));
    }
  };

  const handlePressEnter = () => {
    console.log(letters);
  };

  return (
    <div className="board">
      <h1>word of the day!</h1>
      <h2>{word}</h2>
      <div className="flash">{error}</div>
      <Tiles gameState={gameState} guess={letters} />
      <form method="POST">
        <input type="text" name="guess" value={letters.join("")} readOnly />
        <input type="hidden" name="round" value="2" />
        <button>Go</button>
      </form>
      {letters.join("")}
      <Keyboard
        onAddLetter={onAddLetter}
        onRemoveLastLetter={onRemoveLastLetter}
        onPressEnter={handlePressEnter}
      />
    </div>
  );
}
