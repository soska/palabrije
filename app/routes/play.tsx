import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  Session,
  useActionData,
  useLoaderData,
} from "remix";
import { words } from "../data/words";
import globalStylesUrl from "~/styles/styles.css";

import { createCookieSessionStorage } from "remix";
import React from "react";

const WORD_LENGTH = 5;
const MAX_ROUNDS = 6;

const letterStatus = {
  GREEN: 2,
  YELLOW: 1,
  BLACK: 0,
};

const gameStatus = {
  WON: "WON",
  LOST: "LOST",
  PLAYING: "PLAYING",
} as const;

type PossibleGameStatus = typeof gameStatus[keyof typeof gameStatus];

type LetterGuess = {
  letter: string;
  level: number;
};

type Play = {
  letters: LetterGuess[];
};

type SessionState = {
  status: PossibleGameStatus;
  plays: Play[];
  currentRound: number;
  error?: string | null;
  date: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "plbrjssn",
      secrets: ["p4l4br1j3.r0ck5"],
      sameSite: "lax",
    },
  });

const allLetters = "abcdefghijklmnñopqrstuvwxyz";

function stringHash(str: string) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function dateToIndex(date: Date, total: number) {
  const s = date.toDateString();
  let n = stringHash(s);
  n = Math.abs(n);
  n = n % total;
  return n;
}

function getTodaysWord() {
  const d = new Date();
  const index = dateToIndex(d, words.length);
  return words[index];
}

function isWordInList(guess: string) {
  return words.includes(guess);
}

function isStateFresh(state: SessionState) {
  const d = new Date();
  const date = d.toDateString();
  return state.date === date;
}

async function jsonWithSession(data: any, session: Session) {
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// https://remix.run/api/app#links
export let links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      // crossOrigin: "true",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;400;600;700;900&family=Rubik&display=swap",
      rel: "stylesheet",
    },
    // { rel: "stylesheet", href: normalize },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const gameState = session.get("gameState") as SessionState;
  const word = getTodaysWord();
  if (!isStateFresh(gameState)) {
    gameState.status = gameStatus.PLAYING;
    gameState.currentRound = 0;
    gameState.plays = [];
    gameState.date = new Date().toDateString();
    return jsonWithSession({ word, gameState }, session);
  }

  return { word, gameState };
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const gameState = session.get("gameState") as SessionState;

  console.log("gameState", gameState);

  const form = await request.formData();
  const guess = form.get("guess");

  if (typeof guess !== "string") {
    throw new Error("Word was not a string");
  }

  if (guess.length > WORD_LENGTH) {
    throw new Error("Word was too long");
  }

  if (!isWordInList(guess)) {
    const newGameState = {
      ...gameState,
      error: "That word is not in the list",
    };
    return jsonWithSession(newGameState, session);
  }

  const word = getTodaysWord();

  const { plays = [], currentRound = 0 } = gameState ?? {};

  const letters = guess.split("").map((guessLetter, index) => {
    const level =
      guessLetter === word[index]
        ? letterStatus.GREEN
        : word.includes(guessLetter)
        ? letterStatus.YELLOW
        : letterStatus.BLACK;
    return {
      letter: guessLetter.toLowerCase(),
      level,
    };
  });

  let status: PossibleGameStatus = gameStatus.PLAYING;
  if (
    letters.filter((l) => l.level === letterStatus.GREEN).length === WORD_LENGTH
  ) {
    status = gameStatus.WON;
  } else {
    if (currentRound === MAX_ROUNDS) {
      status = gameStatus.LOST;
    }
  }

  const newGameState: SessionState = {
    ...gameState,
    error: null,
    status,
    plays: [
      ...plays,
      {
        letters,
      },
    ],
    currentRound: currentRound + 1,
  };

  session.set("gameState", newGameState);

  return jsonWithSession(newGameState, session);
};

// array of five
const rows = Array(MAX_ROUNDS).fill(null);
const columns = Array(WORD_LENGTH).fill(null);

function Keyboard() {
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

export default function Index() {
  const { word, gameState: loaderGameState } = useLoaderData<{
    word: string;
    gameState: SessionState;
  }>();

  const actionGameState = useActionData<SessionState>() ?? {};

  const gameState = {
    ...loaderGameState,
    ...actionGameState,
  };

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
