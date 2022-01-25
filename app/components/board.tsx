import * as React from "react";
import {
  gameStatus,
  letterStatus,
  MAX_ROUNDS,
  WORD_LENGTH,
} from "~/lib/constants";
import { Keyboard } from "~/components/keyboard";
import type { SessionState } from "~/lib/types";

// array of five
const rows = Array(MAX_ROUNDS).fill(null);
const columns = Array(WORD_LENGTH).fill(null);

export function Tiles({ gameState }: { gameState: SessionState }) {
  const { plays = [] } = gameState;

  return (
    <>
      {rows.map((_, i) => (
        <div className="tiles-row" key={"row_" + i}>
          {columns.map((_, j) => {
            const currentLetter = plays[i]?.letters[j];
            let className = ["tile"];
            if (currentLetter?.level === letterStatus.GREEN) {
              className.push("green");
            }
            if (currentLetter?.level === letterStatus.YELLOW) {
              className.push("yellow");
            }

            return (
              <div className={className.join(" ")} key={"card_" + i + j}>
                {plays[i]?.letters[j]?.letter ?? ""}
              </div>
            );
          })}
        </div>
      ))}
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
  const { status = gameStatus.PLAYING, plays = [], error } = gameState;

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
      <Tiles gameState={gameState} />
      <form method="POST">
        <input type="text" name="guess" />
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
