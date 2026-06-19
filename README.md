# Hermes

An always-on, voice-activated dictionary for reading physical books. Leave it
open beside you while you read; when you hit a word you don't know, say the wake
word **"Hermes"** followed by the word and it fetches the definition and reads it
aloud in a natural voice. Say **"Cipher"** to stop. Fully hands-free.

## How it works

1. **Begin a session** — the mic opens and listens continuously.
2. Say **"Hermes" + a word** ("Hermes ephemeral", or "Hermes, define ephemeral").
   Wake-word detection is **fuzzy**, so common mishearings ("homies") still fire.
3. Hermes looks the word up and **speaks the definition** aloud.
4. While it speaks: say **"again"** to replay, **"sentence"** to hear the example,
   or **"Cipher"** to stop.
5. Every word is saved to a persistent **Journal**, with weekly **Records**.

## Voice commands

| Say | Does |
| --- | --- |
| "Hermes" + word | Look up and speak a definition |
| "Cipher" | Stop speaking, return to listening |
| "again" | Replay the last definition |
| "sentence" | Read the example sentence |

Wake word, stop word, fuzzy matching, voice, and speech rate are all editable in
**Settings**.

## Browser support

Built on the Web Speech API (`SpeechRecognition` + `SpeechSynthesis`). Use a
**Chromium-based browser (Chrome/Edge)** for reliable recognition. The app stays
open for long reading sessions — recognition auto-restarts so listening never
stops.

## Architecture

Concerns are split into self-contained, portable modules so the logic can be
reused when this is ported to a native macOS menu-bar app (only the UI and the
speech source would change):

- `src/lib/speech/recognition.ts` — continuous recognition with auto-restart
  (the one browser-specific module).
- `src/lib/speech/match.ts` — fuzzy wake / stop / command matching (pure).
- `src/lib/dictionary.ts` — definition source (Free Dictionary API), normalized.
- `src/lib/tts/` — a `TtsProvider` interface + a browser `SpeechSynthesis`
  implementation, swappable for ElevenLabs etc.
- `src/lib/journal/store.ts` — persistent vocabulary log + Records aggregation.
- `src/lib/engine.ts` — the framework-agnostic state machine that ties it all
  together. React binds to it via `src/hooks/useHermes.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

Stack: Vite + React + TypeScript. Dark theme; Spectral + Hanken Grotesk.
