// Definition source. Primary: the Free Dictionary API (richest data — IPA,
// example sentences). It's a community service that has bad days (slow origins,
// Cloudflare 522s), so every attempt gets a short timeout and failures fall
// back silently to Datamuse (fast, no key, definitions + POS + IPA, no
// example). Only when BOTH fail do we throw DictionaryUnavailableError, so the
// caller can distinguish "the word doesn't exist" (null) from "the dictionary
// is unreachable" (throw).

import type { Definition } from "../types";

const PRIMARY = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const FALLBACK = "https://api.datamuse.com/words";
const ATTEMPT_TIMEOUT_MS = 4000;

/** Thrown when no dictionary source could be reached at all. */
export class DictionaryUnavailableError extends Error {
  constructor() {
    super("no dictionary source reachable");
    this.name = "DictionaryUnavailableError";
  }
}

// ---- primary: dictionaryapi.dev ----

interface ApiPhonetic {
  text?: string;
}
interface ApiDefinition {
  definition: string;
  example?: string;
}
interface ApiMeaning {
  partOfSpeech: string;
  definitions: ApiDefinition[];
}
interface ApiEntry {
  word: string;
  phonetic?: string;
  phonetics?: ApiPhonetic[];
  meanings: ApiMeaning[];
}

function pickPhonetic(entry: ApiEntry): string | undefined {
  if (entry.phonetic) return entry.phonetic;
  return entry.phonetics?.find((p) => p.text)?.text;
}

/** Combine the caller's abort signal with a per-attempt timeout. */
function attemptSignal(signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(ATTEMPT_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

async function fromPrimary(
  word: string,
  signal?: AbortSignal
): Promise<Definition | null> {
  const res = await fetch(PRIMARY + encodeURIComponent(word), {
    signal: attemptSignal(signal),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`primary lookup failed (${res.status})`);

  const data = (await res.json()) as ApiEntry[];
  if (!Array.isArray(data) || data.length === 0) return null;

  const entry = data.find((e) => e.meanings?.length) ?? data[0];
  const meaning = entry.meanings?.[0];
  const sense = meaning?.definitions?.[0];
  if (!meaning || !sense) return null;

  return {
    word: entry.word || word,
    pronunciation: pickPhonetic(entry),
    partOfSpeech: meaning.partOfSpeech,
    definition: sense.definition,
    example: sense.example,
  };
}

// ---- fallback: datamuse ----

interface DatamuseHit {
  word: string;
  defs?: string[]; // "pos\tdefinition"
  tags?: string[]; // includes "ipa_pron:..."
}

const DATAMUSE_POS: Record<string, string> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
};

async function fromDatamuse(
  word: string,
  signal?: AbortSignal
): Promise<Definition | null> {
  const url = `${FALLBACK}?sp=${encodeURIComponent(word)}&md=dr&ipa=1&max=1`;
  const res = await fetch(url, { signal: attemptSignal(signal) });
  if (!res.ok) throw new Error(`fallback lookup failed (${res.status})`);

  const data = (await res.json()) as DatamuseHit[];
  const hit = data?.[0];
  if (!hit?.defs?.length) return null;

  const [rawPos, ...defParts] = hit.defs[0].split("\t");
  const definition = defParts.join("\t").trim();
  if (!definition) return null;

  const ipa = hit.tags
    ?.find((t) => t.startsWith("ipa_pron:"))
    ?.slice("ipa_pron:".length);

  return {
    word: hit.word || word,
    pronunciation: ipa ? `/${ipa}/` : undefined,
    partOfSpeech: DATAMUSE_POS[rawPos] ?? rawPos,
    definition: definition.endsWith(".") ? definition : `${definition}.`,
    example: undefined,
  };
}

// ---- public API ----

/**
 * Look up a word. Resolves to a normalized `Definition`, `null` when no source
 * has an entry for it, and throws `DictionaryUnavailableError` only when every
 * source failed to respond — so callers can tell a genuine miss from an outage.
 */
export async function fetchDefinition(
  word: string,
  signal?: AbortSignal
): Promise<Definition | null> {
  const clean = word.trim().toLowerCase();
  if (!clean) return null;

  let primaryFailed = false;
  try {
    const def = await fromPrimary(clean, signal);
    if (def) return def;
    // Primary 404: fall through — Datamuse's vocabulary is larger, so give the
    // word a second opinion before declaring it missing.
  } catch (err) {
    if (signal?.aborted) throw err; // caller cancelled — don't mask it
    primaryFailed = true;
  }

  try {
    return await fromDatamuse(clean, signal);
  } catch (err) {
    if (signal?.aborted) throw err;
    // Fallback also unreachable. If the primary answered (a real 404), treat
    // it as not-found; if both sources failed, surface the outage.
    if (primaryFailed) throw new DictionaryUnavailableError();
    return null;
  }
}
