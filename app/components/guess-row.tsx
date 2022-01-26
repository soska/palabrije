import * as React from "react";
import { WORD_LENGTH } from "~/lib/constants";

const columns = Array(WORD_LENGTH).fill(null);

export function GuessRow({ guess = [] }: { guess: string[] }) {
  return (
    <div className="tiles-row">
      {columns.map((_, j) => {
        const currentLetter = guess[j];
        return (
          <div
            className={`tile ${currentLetter ? "--not-empty" : "--empty"}`}
            key={"guess-card_" + j}
          >
            {currentLetter ?? ""}
          </div>
        );
      })}
    </div>
  );
}
