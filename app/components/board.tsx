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

export function Board({
  gameState,
  word,
}: {
  gameState: SessionState;
  word: string;
}) {
  const { status = gameStatus.PLAYING, plays = [], error } = gameState;

  return (
    <div className="board">
      <h1>word of the day!</h1>
      <h2>{word}</h2>
      <div className="flash">{error}</div>
      {rows.map((row, i) => (
        <div className="tiles-row" key={"row_" + i}>
          {columns.map((column, j) => {
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

      <form method="POST">
        <input type="text" name="guess" />
        <input type="hidden" name="round" value="2" />
        <button>Go</button>
      </form>
      <Keyboard />
    </div>
  );
}
