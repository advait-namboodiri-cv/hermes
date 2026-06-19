// Top-level screen shown in the window body.
export type Screen =
  | "home"
  | "session"
  | "settings"
  | "journal"
  | "records";

// Voice-flow sub-state, meaningful while the session screen is shown.
export type Flow =
  | "listening"
  | "wake"
  | "fetching"
  | "definition"
  | "notfound";

// A normalized dictionary result, decoupled from the API shape.
export interface Definition {
  word: string;
  pronunciation?: string;
  partOfSpeech?: string;
  definition: string;
  example?: string;
}

// One persisted journal entry (a word looked up in a session).
export interface JournalEntry extends Definition {
  id: string;
  at: number; // epoch ms
  sessionId: string;
}

export interface Settings {
  wakeWord: string;
  stopWord: string;
  fuzzyMatching: boolean;
  voiceURI: string; // empty = system default
  speechRate: number; // 0.5 - 2.0
}
