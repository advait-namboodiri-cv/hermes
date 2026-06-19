// HermesEngine — the brain. A framework-agnostic state machine that turns a
// continuous transcript into the wake → capture → lookup → speak loop. It owns
// no React and no DOM beyond the modules it composes, so the macOS port reuses
// this file verbatim and only reskins the UI on top of its state.

import { ContinuousRecognizer, type Heard } from "./speech/recognition";
import {
  findWake,
  hasReplayWord,
  hasSentenceWord,
  hasStopWord,
  hasWord,
  isCommandWord,
  tokenize,
} from "./speech/match";
import { fetchDefinition } from "./dictionary";
import { appendEntry, newId } from "./journal/store";
import type { TtsProvider } from "./tts/types";
import type { Definition, Settings } from "../types";

export type EngineFlow =
  | "idle"
  | "listening"
  | "wake"
  | "fetching"
  | "definition"
  | "notfound";

export type Command = "wake" | "stop" | "again" | "sentence" | "end";

export interface EngineState {
  flow: EngineFlow;
  listening: boolean;
  transcript: string;
  lookupWord: string;
  definition: Definition | null;
  speaking: boolean;
  error: string | null;
  /** Last voice command recognized + a counter so the UI can flash it. */
  lastCommand: Command | null;
  commandSeq: number;
}

const NOTFOUND_RETURN_MS = 3500;
const AWAIT_TARGET_MS = 9000;

export interface EngineOptions {
  settings: Settings;
  tts: TtsProvider;
}

export class HermesEngine {
  private state: EngineState = {
    flow: "idle",
    listening: false,
    transcript: "",
    lookupWord: "",
    definition: null,
    speaking: false,
    error: null,
    lastCommand: null,
    commandSeq: 0,
  };

  private settings: Settings;
  private tts: TtsProvider;
  private recognizer: ContinuousRecognizer;
  private subscribers = new Set<(s: EngineState) => void>();

  private sessionId = newId();
  private awaitingTarget = false;
  private awaitTimer: number | null = null;
  private notFoundTimer: number | null = null;
  private lastDefinition: Definition | null = null;
  private fetchAbort: AbortController | null = null;
  private lookupSeq = 0;

  constructor(opts: EngineOptions) {
    this.settings = opts.settings;
    this.tts = opts.tts;
    this.recognizer = new ContinuousRecognizer({
      onHeard: (h) => this.onHeard(h),
      onError: (e) => this.patch({ error: e }),
    });
  }

  // ---- public API ----

  subscribe(cb: (s: EngineState) => void): () => void {
    this.subscribers.add(cb);
    cb(this.state);
    return () => this.subscribers.delete(cb);
  }

  getState(): EngineState {
    return this.state;
  }

  updateSettings(settings: Settings) {
    this.settings = settings;
  }

  start() {
    if (this.state.listening) return;
    this.sessionId = newId();
    this.recognizer.start();
    this.patch({ flow: "listening", listening: true, error: null });
  }

  stop() {
    this.clearTimers();
    this.fetchAbort?.abort();
    this.tts.cancel();
    this.recognizer.stop();
    this.awaitingTarget = false;
    this.patch({
      flow: "idle",
      listening: false,
      speaking: false,
      transcript: "",
    });
  }

  /** "Goodbye" / end-session button — close the mic and end the session. */
  endSession() {
    this.signal("end");
    this.stop();
  }

  /** "Cipher" — stop speech and go back to listening. */
  cancelSpeech() {
    this.tts.cancel();
    this.signal("stop");
    this.toListening();
  }

  /** "again" — replay the last definition. */
  replayLast() {
    if (!this.lastDefinition) return;
    this.signal("again");
    this.patch({ flow: "definition", definition: this.lastDefinition });
    this.speak(`${this.lastDefinition.word}. ${this.lastDefinition.definition}`);
  }

  /** Replay a specific logged entry (Journal replay button). */
  playDefinition(def: Definition) {
    this.lastDefinition = def;
    this.speak(`${def.word}. ${def.definition}`);
  }

  /** "sentence" — read the example sentence, if any. */
  readSentence() {
    const ex = this.lastDefinition?.example;
    if (!ex) return;
    this.signal("sentence");
    this.speak(ex);
  }

  // ---- the brain ----

  private onHeard(h: Heard) {
    this.patch({ transcript: h.transcript });
    const text = h.transcript;
    const { wakeWord, stopWord, endWord, fuzzyMatching } = this.settings;

    // "Goodbye" ends the whole session from anywhere.
    if (h.isFinal && endWord && hasWord(text, endWord, fuzzyMatching)) {
      this.endSession();
      return;
    }

    // While a definition is up, listen for control commands.
    if (this.state.flow === "definition" || this.state.flow === "notfound") {
      if (hasStopWord(text, stopWord, fuzzyMatching)) {
        this.cancelSpeech();
        return;
      }
      if (h.isFinal && hasReplayWord(text)) {
        this.replayLast();
        return;
      }
      if (h.isFinal && hasSentenceWord(text)) {
        this.readSentence();
        return;
      }
    }

    // Stop word also works any time speech is playing.
    if (this.state.speaking && hasStopWord(text, stopWord, fuzzyMatching)) {
      this.cancelSpeech();
      return;
    }

    // Don't start a new lookup mid-fetch.
    if (this.state.flow === "fetching") return;

    // We already heard the wake word and are waiting for the target word.
    if (this.awaitingTarget) {
      if (!h.isFinal) return;
      const target = tokenize(text).find(
        (t) => !isCommandWord(t, wakeWord, fuzzyMatching)
      );
      if (target) {
        this.startLookup(target);
      }
      return;
    }

    // Fresh wake-word scan.
    const hit = findWake(text, wakeWord, fuzzyMatching);
    if (!hit) return;

    if (hit.target && h.isFinal) {
      this.signal("wake");
      this.startLookup(hit.target);
    } else {
      // Heard the wake word; show "Yes?" and wait for the word.
      this.signal("wake");
      this.patch({ flow: "wake" });
      if (h.isFinal && !hit.target) this.beginAwaitTarget();
    }
  }

  private startLookup(word: string) {
    this.clearTimers();
    this.awaitingTarget = false;
    const seq = ++this.lookupSeq;
    this.fetchAbort?.abort();
    this.fetchAbort = new AbortController();

    this.patch({ flow: "fetching", lookupWord: word, definition: null });

    fetchDefinition(word, this.fetchAbort.signal)
      .then((def) => {
        if (seq !== this.lookupSeq) return; // superseded
        if (def) {
          this.onDefinition(def);
        } else {
          this.onNotFound();
        }
      })
      .catch((err) => {
        if (seq !== this.lookupSeq) return;
        if ((err as Error)?.name === "AbortError") return;
        this.onNotFound();
      });
  }

  private onDefinition(def: Definition) {
    this.lastDefinition = def;
    appendEntry(def, this.sessionId);
    this.patch({ flow: "definition", definition: def, lookupWord: def.word });
    this.speak(`${def.word}. ${def.definition}`);
  }

  private onNotFound() {
    this.patch({ flow: "notfound" });
    this.notFoundTimer = window.setTimeout(
      () => this.toListening(),
      NOTFOUND_RETURN_MS
    );
  }

  private speak(text: string) {
    this.patch({ speaking: true });
    this.tts.speak(text, {
      voiceURI: this.settings.voiceURI,
      rate: this.settings.speechRate,
      onend: () => this.patch({ speaking: false }),
      onerror: () => this.patch({ speaking: false }),
    });
  }

  private toListening() {
    this.clearTimers();
    this.awaitingTarget = false;
    this.patch({ flow: "listening", speaking: false });
  }

  private beginAwaitTarget() {
    this.awaitingTarget = true;
    this.awaitTimer = window.setTimeout(() => {
      this.awaitingTarget = false;
      if (this.state.flow === "wake") this.toListening();
    }, AWAIT_TARGET_MS);
  }

  private signal(cmd: Command) {
    this.patch({ lastCommand: cmd, commandSeq: this.state.commandSeq + 1 });
  }

  private clearTimers() {
    if (this.awaitTimer !== null) clearTimeout(this.awaitTimer);
    if (this.notFoundTimer !== null) clearTimeout(this.notFoundTimer);
    this.awaitTimer = null;
    this.notFoundTimer = null;
  }

  private patch(part: Partial<EngineState>) {
    this.state = { ...this.state, ...part };
    for (const cb of this.subscribers) cb(this.state);
  }
}
