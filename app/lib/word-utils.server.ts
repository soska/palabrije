import { words } from "../data/words";

export function stringHash(str: string) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function dateToIndex(date: Date, total: number) {
  const s = date.toDateString();
  let n = stringHash(s);
  n = Math.abs(n);
  n = n % total;
  return n;
}

export function getTodaysWord() {
  const d = new Date();
  const index = dateToIndex(d, words.length);
  return words[index];
}

export function isWordInList(guess: string) {
  return words.includes(guess);
}
