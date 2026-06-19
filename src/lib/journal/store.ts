// Persistent vocabulary log. Every word ever defined is appended here and
// survives restarts (localStorage). Also derives the Journal grouping and the
// Records aggregates. Pure data + browser storage — no UI, no engine coupling.

import type { Definition, JournalEntry } from "../../types";

const KEY = "hermes.journal";

export interface JournalRow {
  id: string;
  word: string;
  gloss: string;
  time: string;
}
export interface JournalGroup {
  label: string;
  meta: string;
  rows: JournalRow[];
}
export interface DayCount {
  label: string;
  count: number;
}
export interface RecordsSummary {
  wordsThisWeek: number;
  hoursRead: number;
  perDay: DayCount[];
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as JournalEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function appendEntry(
  def: Definition,
  sessionId: string,
  at = Date.now()
): JournalEntry {
  const entry: JournalEntry = { ...def, id: newId(), at, sessionId };
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  return entry;
}

export function findEntry(id: string): JournalEntry | undefined {
  return loadEntries().find((e) => e.id === id);
}

// ---- derivations ----

export function gloss(def: Definition): string {
  const d = def.definition.trim().replace(/\.$/, "");
  const lowered = d.charAt(0).toLowerCase() + d.slice(1);
  return def.partOfSpeech ? `${def.partOfSpeech} · ${lowered}` : lowered;
}

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayLabel(dayStart: number, todayStart: number): string {
  const diffDays = Math.round((todayStart - dayStart) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return new Date(dayStart)
    .toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .replace(",", " ·");
}

function timeLabel(ms: number): string {
  return new Date(ms)
    .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}

/** Group entries by calendar day, newest day and newest word first. */
export function groupForJournal(entries: JournalEntry[]): JournalGroup[] {
  const todayStart = startOfDay(Date.now());
  const byDay = new Map<number, JournalEntry[]>();
  for (const e of entries) {
    const key = startOfDay(e.at);
    (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(e);
  }

  return [...byDay.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([dayStart, group]) => {
      const sorted = [...group].sort((a, b) => b.at - a.at);
      const spanMin = Math.round(
        (Math.max(...group.map((e) => e.at)) -
          Math.min(...group.map((e) => e.at))) /
          60_000
      );
      const meta =
        spanMin > 0
          ? `${group.length} words · ${spanMin} min`
          : `${group.length} word${group.length === 1 ? "" : "s"}`;
      return {
        label: dayLabel(dayStart, todayStart),
        meta,
        rows: sorted.map((e) => ({
          id: e.id,
          word: e.word,
          gloss: gloss(e),
          time: timeLabel(e.at),
        })),
      };
    });
}

/** Aggregate the current Monday-start week for the Records view. */
export function recordsSummary(entries: JournalEntry[]): RecordsSummary {
  const todayStart = startOfDay(Date.now());
  const dow = (new Date(todayStart).getDay() + 6) % 7; // 0 = Monday
  const weekStart = todayStart - dow * 86_400_000;
  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  const perDay: DayCount[] = labels.map((label) => ({ label, count: 0 }));
  let spanTotalMs = 0;
  const byDay = new Map<number, number[]>();

  for (const e of entries) {
    if (e.at < weekStart) continue;
    const idx = Math.floor((startOfDay(e.at) - weekStart) / 86_400_000);
    if (idx < 0 || idx > 6) continue;
    perDay[idx].count += 1;
    (byDay.get(idx) ?? byDay.set(idx, []).get(idx)!).push(e.at);
  }

  for (const times of byDay.values()) {
    spanTotalMs += Math.max(...times) - Math.min(...times);
  }

  return {
    wordsThisWeek: perDay.reduce((sum, d) => sum + d.count, 0),
    hoursRead: spanTotalMs / 3_600_000,
    perDay,
  };
}
