import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import globalStylesUrl from "~/styles/styles.css";

import {
  gameStatus,
  letterStatus,
  MAX_ROUNDS,
  WORD_LENGTH,
} from "~/lib/constants";
import type { SessionState, PossibleGameStatus } from "~/lib/types";
import { getTodaysWord, isWordInList } from "~/lib/word-utils.server";
import {
  getSession,
  isStateFresh,
  jsonWithSession,
} from "~/lib/session.server";
import { Board } from "~/components/board";

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

  return <Board gameState={gameState} word={word} />;
}
