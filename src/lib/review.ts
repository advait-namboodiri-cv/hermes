// Spaced-repetition review over the words you've looked up. A light Leitner
// scheme: getting a card right pushes it to a longer interval; missing it
// resets it. Pure data + localStorage, decoupled from the UI.

import type { JournalEntry } from "../types";
import { loadEntries } from "./journal/store";

const KEY = "hermes.review";
const DAY = 86_400_000;
// Days until a card is due again, indexed by level.
const INTERVALS = [0, 1, 3, 7, 16, 35];

export interface ReviewState {
  level: number;
  due: number; // epoch ms
  last: number;
}
type ReviewMap = Record<string, ReviewState>;

export interface ReviewCard {
  entry: JournalEntry;
  state: ReviewState;
}

const norm = (w: string) => w.trim().toLowerCase();

function load(): ReviewMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as ReviewMap;
  } catch {
    return {};
  }
}

function save(map: ReviewMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/** Latest journal entry per distinct word (the card faces). */
export function uniqueWords(entries: JournalEntry[] = loadEntries()): JournalEntry[] {
  const map = new Map<string, JournalEntry>();
  for (const e of entries) {
    const k = norm(e.word);
    const prev = map.get(k);
    if (!prev || e.at > prev.at) map.set(k, e);
  }
  return [...map.values()];
}

/** The cards to study now — due ones (or all, for practice), soonest first. */
export function buildDeck(all = false): ReviewCard[] {
  const map = load();
  const now = Date.now();
  const cards = uniqueWords().map((entry) => ({
    entry,
    state: map[norm(entry.word)] ?? { level: 0, due: 0, last: 0 },
  }));
  return cards
    .filter((c) => all || c.state.due <= now)
    .sort((a, b) => a.state.due - b.state.due);
}

export function dueCount(): number {
  const map = load();
  const now = Date.now();
  return uniqueWords().filter((e) => {
    const s = map[norm(e.word)];
    return !s || s.due <= now;
  }).length;
}

export function totalWords(): number {
  return uniqueWords().length;
}

/** Record a recall result and schedule the next review. */
export function grade(word: string, knew: boolean) {
  const map = load();
  const k = norm(word);
  const now = Date.now();
  const cur = map[k] ?? { level: 0, due: 0, last: 0 };
  const level = knew ? Math.min(cur.level + 1, INTERVALS.length - 1) : 0;
  // Missed cards come back within the same session; known ones jump ahead.
  const due = knew ? now + INTERVALS[level] * DAY : now + 60_000;
  map[k] = { level, due, last: now };
  save(map);
}
