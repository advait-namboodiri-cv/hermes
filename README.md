# Hermes

An always-on, voice-activated dictionary for reading physical books. Leave it
open beside you while you read

- say the wake word **"Hermes"** followed by the word and it fetches the definition and reads it
aloud in a natural voice. Say **"Cipher"** to stop. Fully hands-free.

## How it works

1. **Begin a session** — the mic opens and listens continuously.
2. Say **"Hermes" + a word** ("Hermes ephemeral", or "Hermes, define ephemeral").
   Wake-word detection is **fuzzy**, so common mishearings ("homies") still works.
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

Use a **Chromium-based browser (Chrome/Edge)** for reliable recognition. 

Stack: Vite + React + TypeScript. Dark theme; Spectral + Hanken Grotesk.
