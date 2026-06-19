// Definition source. Wraps the Free Dictionary API and maps its response to
// our own `Definition` shape, so swapping providers later (Wordnik, Merriam,
// an offline dictionary for the native app) only touches this file.

import type { Definition } from "../types";

const ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en/";

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

/**
 * Look up a word. Resolves to a normalized `Definition`, or `null` when the
 * word has no entry (the API 404s). Throws only on network/parse failure so
 * the caller can distinguish "not found" from "lookup broke".
 */
export async function fetchDefinition(
  word: string,
  signal?: AbortSignal
): Promise<Definition | null> {
  const clean = word.trim().toLowerCase();
  if (!clean) return null;

  const res = await fetch(ENDPOINT + encodeURIComponent(clean), { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`dictionary lookup failed (${res.status})`);

  const data = (await res.json()) as ApiEntry[];
  if (!Array.isArray(data) || data.length === 0) return null;

  // Prefer the first entry that actually carries a meaning.
  const entry = data.find((e) => e.meanings?.length) ?? data[0];
  const meaning = entry.meanings?.[0];
  const sense = meaning?.definitions?.[0];
  if (!meaning || !sense) return null;

  return {
    word: entry.word || clean,
    pronunciation: pickPhonetic(entry),
    partOfSpeech: meaning.partOfSpeech,
    definition: sense.definition,
    example: sense.example,
  };
}
