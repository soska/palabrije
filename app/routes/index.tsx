import { ActionFunction, LoaderFunction, useLoaderData } from "remix";
import { words } from "../data/words";

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

export const loader: LoaderFunction = ({ request }) => {
  const word = getTodaysWord();
  return { word };
};

export default function Index() {
  const { word } = useLoaderData<{ word: string }>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>word of the day!</h1>
      <h2>{word}</h2>
      <form method="POST">
        <input type="text" name="guess" />
      </form>
    </div>
  );
}
