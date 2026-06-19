// Continuous speech recognition wrapper around the Web Speech API.
//
// This is the ONE browser-specific module by design — everything downstream
// (wake matching, dictionary, TTS) consumes plain strings, so a native port
// only needs to swap this file for an Apple Speech / Vosk / Whisper source.

// Minimal typings for the (still non-standard) SpeechRecognition API.
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface Heard {
  /** Best-guess text of the current utterance (interim or final). */
  transcript: string;
  /** True once the engine has committed this utterance. */
  isFinal: boolean;
}

export interface RecognizerHandlers {
  onHeard?: (h: Heard) => void;
  onStateChange?: (running: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * A recognizer that listens forever: it transparently restarts whenever the
 * browser ends a recognition turn (the API stops itself periodically), so a
 * reading session can stay open for hours without the mic going quiet.
 */
export class ContinuousRecognizer {
  private rec: SpeechRecognitionLike | null = null;
  private active = false;
  private restartTimer: number | null = null;

  constructor(private handlers: RecognizerHandlers = {}) {}

  static isSupported(): boolean {
    return getCtor() !== null;
  }

  setHandlers(handlers: RecognizerHandlers) {
    this.handlers = handlers;
  }

  start() {
    if (this.active) return;
    const Ctor = getCtor();
    if (!Ctor) {
      this.handlers.onError?.("unsupported");
      return;
    }
    this.active = true;
    this.spinUp(Ctor);
    this.handlers.onStateChange?.(true);
  }

  stop() {
    this.active = false;
    if (this.restartTimer !== null) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.rec) {
      this.rec.onend = null; // prevent auto-restart
      try {
        this.rec.abort();
      } catch {
        /* ignore */
      }
      this.rec = null;
    }
    this.handlers.onStateChange?.(false);
  }

  get running() {
    return this.active;
  }

  /**
   * Tear down the current recognition turn and immediately open a fresh one.
   * Used when speech playback starts: it gives the user's "stop" word a clean
   * new buffer to land in instead of being appended to (and lost in) the echo
   * of the audio currently playing.
   */
  kick() {
    if (!this.active) return;
    const Ctor = getCtor();
    if (!Ctor) return;
    if (this.restartTimer !== null) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.rec) {
      this.rec.onend = null;
      try {
        this.rec.abort();
      } catch {
        /* ignore */
      }
      this.rec = null;
    }
    this.spinUp(Ctor);
  }

  private spinUp(Ctor: SpeechRecognitionCtor) {
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const r = e.results[e.results.length - 1];
      if (!r) return;
      this.handlers.onHeard?.({
        transcript: r[0].transcript.trim(),
        isFinal: r.isFinal,
      });
    };

    rec.onerror = (e) => {
      // "no-speech" / "aborted" are routine; let onend handle the restart.
      if (e.error !== "no-speech" && e.error !== "aborted") {
        this.handlers.onError?.(e.error);
      }
    };

    rec.onend = () => {
      if (!this.active) return;
      // The API ends turns on its own (and Chrome cuts it off while TTS plays)
      // — restart quickly to minimize any deaf gap.
      this.restartTimer = window.setTimeout(() => this.spinUp(Ctor), 120);
    };

    this.rec = rec;
    try {
      rec.start();
    } catch {
      // start() throws if called too soon after a previous instance; retry.
      if (this.active) {
        this.restartTimer = window.setTimeout(() => this.spinUp(Ctor), 200);
      }
    }
  }
}
