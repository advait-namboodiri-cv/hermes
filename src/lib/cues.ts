// Audio earcons — short, distinct tones that confirm a voice event by ear, so
// you don't have to glance at the screen while reading. Pure WebAudio, no asset
// files. Like the TTS, it's behind an interface so a native port can swap it.

export type CueKind = "wake" | "found" | "notfound" | "stop";

export interface CuePlayer {
  play(kind: CueKind): void;
}

// [frequency Hz, duration s] notes played in sequence.
const SEQUENCES: Record<CueKind, [number, number][]> = {
  wake: [
    [587.33, 0.1],
    [784, 0.12],
  ], // D5 → G5, a light "listening?" rise
  found: [
    [523.25, 0.1],
    [659.25, 0.1],
    [784, 0.14],
  ], // C5 → E5 → G5, a pleasant resolve
  notfound: [
    [392, 0.12],
    [311.13, 0.18],
  ], // G4 → E♭4, a soft fall
  stop: [[329.63, 0.16]], // a single quiet E4
};

export class BrowserCues implements CuePlayer {
  private ctx: AudioContext | null = null;

  private ensureCtx(): AudioContext | null {
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return null;
        this.ctx = new Ctor();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  play(kind: CueKind) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    let t = ctx.currentTime;
    for (const [freq, dur] of SEQUENCES[kind]) {
      this.tone(ctx, freq, t, dur);
      t += dur * 0.92;
    }
  }

  private tone(ctx: AudioContext, freq: number, start: number, dur: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const peak = 0.075;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }
}
