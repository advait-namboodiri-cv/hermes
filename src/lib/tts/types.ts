// Text-to-speech provider contract.
//
// The app talks to TTS only through this interface, so the built-in browser
// voice can later be swapped for ElevenLabs (or any other provider) without
// touching the engine or UI — implement `TtsProvider` and drop it in.

export interface TtsVoice {
  /** Stable id used to select the voice in settings. */
  uri: string;
  /** Human-readable label, e.g. "Samantha · en-US". */
  label: string;
}

export interface SpeakOptions {
  /** Voice id from `listVoices()`; empty/undefined = provider default. */
  voiceURI?: string;
  /** 0.5–2.0, 1 = normal. */
  rate?: number;
  /** Queue after current speech instead of cancelling it (e.g. ack → definition). */
  queue?: boolean;
  /** Called once speech finishes naturally (not when cancelled). */
  onend?: () => void;
  /** Called if speech fails to play. */
  onerror?: (err: unknown) => void;
}

export interface TtsProvider {
  /** Speak the given text. Cancels anything already speaking. */
  speak(text: string, opts?: SpeakOptions): void;
  /** Immediately stop any speech in progress (the "Cipher" command). */
  cancel(): void;
  /** Whether speech is currently playing. */
  isSpeaking(): boolean;
  /** Available voices (may be empty until the provider has loaded them). */
  listVoices(): TtsVoice[];
  /** Notify when the voice list becomes available/changes. */
  onVoicesChanged(cb: () => void): void;
}
