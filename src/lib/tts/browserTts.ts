// Browser SpeechSynthesis implementation of TtsProvider — the default voice.
// A future ElevenLabsTts (or native AVSpeechSynthesizer bridge) implements the
// same interface and is swapped in at the engine's construction site.

import type { SpeakOptions, TtsProvider, TtsVoice } from "./types";

export class BrowserTts implements TtsProvider {
  private synth: SpeechSynthesis | null =
    typeof window !== "undefined" ? window.speechSynthesis : null;
  private current: SpeechSynthesisUtterance | null = null;

  constructor() {
    // Voices populate asynchronously in most browsers.
    if (this.synth) {
      this.synth.onvoiceschanged = () => this.voicesCb?.();
    }
  }

  private voicesCb: (() => void) | null = null;

  speak(text: string, opts: SpeakOptions = {}) {
    if (!this.synth || !text) return;
    this.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts.rate ?? 1;
    if (opts.voiceURI) {
      const voice = this.synth
        .getVoices()
        .find((v) => v.voiceURI === opts.voiceURI);
      if (voice) u.voice = voice;
    }
    u.onend = () => {
      if (this.current === u) this.current = null;
      opts.onend?.();
    };
    u.onerror = (e) => {
      if (this.current === u) this.current = null;
      // "interrupted"/"canceled" are expected when we cancel on purpose.
      if (e.error !== "interrupted" && e.error !== "canceled") {
        opts.onerror?.(e.error);
      }
    };

    this.current = u;
    this.synth.speak(u);
  }

  cancel() {
    if (!this.synth) return;
    this.current = null;
    this.synth.cancel();
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  listVoices(): TtsVoice[] {
    if (!this.synth) return [];
    return this.synth
      .getVoices()
      .filter((v) => v.lang.startsWith("en"))
      .map((v) => ({ uri: v.voiceURI, label: `${v.name} · ${v.lang}` }));
  }

  onVoicesChanged(cb: () => void) {
    this.voicesCb = cb;
  }
}
