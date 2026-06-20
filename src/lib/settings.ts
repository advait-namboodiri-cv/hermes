// Settings persistence. Recognition + voice preferences survive restarts.

import type { Settings } from "../types";

const KEY = "hermes.settings";
const MIGRATION_KEY = "hermes.settings.migrated";

export const DEFAULT_SETTINGS: Settings = {
  wakeWord: "Hermes",
  stopWord: "Halt",
  endWord: "Goodbye",
  fuzzyMatching: true,
  soundCues: true,
  spokenConfirm: true,
  voiceURI: "",
  speechRate: 1,
};

// Words that earlier shipped as defaults but proved unreliable for recognition.
const RETIRED_STOP_DEFAULTS = ["Cipher"];

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    const settings: Settings = raw
      ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) }
      : { ...DEFAULT_SETTINGS };

    // One-time migration: move anyone still on a retired default stop word
    // (e.g. "Cipher") onto the current default. Runs once so a deliberate
    // re-selection later is never overridden.
    if (!localStorage.getItem(MIGRATION_KEY)) {
      if (RETIRED_STOP_DEFAULTS.includes(settings.stopWord)) {
        settings.stopWord = DEFAULT_SETTINGS.stopWord;
      }
      localStorage.setItem(MIGRATION_KEY, "1");
      saveSettings(settings);
    }

    return settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}
