// Fuzzy word matching for wake / stop commands.
//
// Speech recognition mishears short proper-noun-ish words constantly
// ("Hermes" came back as "homies" in testing), so command detection cannot be
// an exact string compare. We normalize, then accept close-sounding variants
// via edit-distance similarity. Pure functions, no DOM — trivially portable.

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
}

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((t) => t.trim())
    .filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** 0..1, where 1 is identical. */
export function similarity(a: string, b: string): number {
  const an = normalize(a);
  const bn = normalize(b);
  if (!an && !bn) return 1;
  const max = Math.max(an.length, bn.length);
  if (max === 0) return 1;
  return 1 - levenshtein(an, bn) / max;
}

/**
 * Does `candidate` count as the `target` command word?
 * Exact (normalized) always matches. With fuzzy on, we accept a same-first-
 * letter near-miss (catches "homies"→"hermes") or a high overall similarity.
 */
export function isCommandWord(
  candidate: string,
  target: string,
  fuzzy: boolean
): boolean {
  const c = normalize(candidate);
  const t = normalize(target);
  if (!c || !t) return false;
  if (c === t) return true;
  if (!fuzzy) return false;

  const sim = similarity(c, t);
  const sameFirst = c[0] === t[0];
  const closeLen = Math.abs(c.length - t.length) <= 2;
  return (sameFirst && closeLen && sim >= 0.5) || sim >= 0.72;
}

export interface WakeHit {
  /** Index of the wake token within the transcript's tokens. */
  index: number;
  /** The word spoken immediately after the wake word, if any (the target). */
  target: string | null;
}

// Words people slip in between the wake word and the actual term
// ("Hermes, define X" / "Hermes what is X") — skip them when grabbing target.
const FILLERS = new Set([
  "define",
  "definition",
  "defined",
  "the",
  "a",
  "an",
  "what",
  "whats",
  "is",
  "of",
  "means",
  "meaning",
  "for",
  "me",
  "word",
]);

/** Find the wake word in a transcript and grab the first real word after it. */
export function findWake(
  transcript: string,
  wakeWord: string,
  fuzzy: boolean
): WakeHit | null {
  const tokens = tokenize(transcript);
  for (let i = 0; i < tokens.length; i++) {
    if (isCommandWord(tokens[i], wakeWord, fuzzy)) {
      let target: string | null = null;
      for (let j = i + 1; j < tokens.length; j++) {
        if (!FILLERS.has(tokens[j])) {
          target = tokens[j];
          break;
        }
      }
      return { index: i, target };
    }
  }
  return null;
}

/** True if the stop word appears anywhere in the transcript. */
export function hasStopWord(
  transcript: string,
  stopWord: string,
  fuzzy: boolean
): boolean {
  return tokenize(transcript).some((tok) => isCommandWord(tok, stopWord, fuzzy));
}

/** True if any token loosely means "again" (replay the last definition). */
export function hasReplayWord(transcript: string): boolean {
  return tokenize(transcript).some(
    (tok) => isCommandWord(tok, "again", true) || tok === "repeat"
  );
}

/** True if any token loosely means "sentence" (read the example). */
export function hasSentenceWord(transcript: string): boolean {
  return tokenize(transcript).some(
    (tok) => isCommandWord(tok, "sentence", true) || tok === "example"
  );
}
