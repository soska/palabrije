import { letterStatus, MAX_ROUNDS, WORD_LENGTH } from "~/lib/constants";
import type { Play } from "~/lib/types";

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
