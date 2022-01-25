import * as React from "react";
import { WORD_LENGTH } from "~/lib/constants";

const allLetters = "abcdefghijklmnñopqrstuvwxyz";

export function Keyboard({
  onAddLetter,
  onRemoveLastLetter,
  onPressEnter,
}: {
  onAddLetter: (letter: string) => () => void;
  onRemoveLastLetter: () => void;
  onPressEnter: () => void;
}) {
  return (
    <>
      <div className="keyboard">
        {allLetters.split("").map((letter) => (
          <button className="key" key={letter} onClick={onAddLetter(letter)}>
            {letter}
          </button>
        ))}
        <button className="key" onClick={onRemoveLastLetter}>
          &larr;
        </button>
        <button className="key" onClick={onPressEnter}>
          Enter
        </button>
      </div>
    </>
  );
}
