import * as React from "react";
import { WORD_LENGTH } from "~/lib/constants";

// const allLetters = "abcdefghijklmnñopqrstuvwxyz";
const letterRows = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];

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
        <div className="row">
          {letterRows[0].split("").map((letter) => (
            <button className="key" key={letter} onClick={onAddLetter(letter)}>
              {letter}
            </button>
          ))}
        </div>
        <div className="row">
          {letterRows[1].split("").map((letter) => (
            <button className="key" key={letter} onClick={onAddLetter(letter)}>
              {letter}
            </button>
          ))}
        </div>
        <div className="row">
          <button className="key" onClick={onPressEnter}>
            Enter
          </button>

          {letterRows[2].split("").map((letter) => (
            <button className="key" key={letter} onClick={onAddLetter(letter)}>
              {letter}
            </button>
          ))}
          <button className="key" onClick={onRemoveLastLetter}>
            &larr;
          </button>
        </div>
      </div>
    </>
  );
}
