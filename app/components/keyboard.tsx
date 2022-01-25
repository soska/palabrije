import * as React from "react";
import { WORD_LENGTH } from "~/lib/constants";

const allLetters = "abcdefghijklmnñopqrstuvwxyz";

export function Keyboard() {
  const [letters, setLetters] = React.useState<string[]>([]);
  const addLetter = (letter: string) => () => {
    if (letters.length < WORD_LENGTH) {
      setLetters([...letters, letter]);
    }
  };

  const removeLastLetter = () => {
    if (letters.length > 0) {
      setLetters(letters.slice(0, -1));
    }
  };

  React.useEffect(() => {
    if (letters.length === WORD_LENGTH) {
      setLetters([]);
      console.log("submit");
    }
  }, [letters]);

  return (
    <>
      {letters.join("")}
      <div className="keyboard">
        {allLetters.split("").map((letter) => (
          <button className="key" key={letter} onClick={addLetter(letter)}>
            {letter}
          </button>
        ))}
        <button className="key" onClick={removeLastLetter}>
          &larr;
        </button>
      </div>
    </>
  );
}
