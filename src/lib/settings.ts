// Settings persistence. Recognition + voice preferences survive restarts.

import type { Settings } from "../types";

const KEY = "hermes.settings";

export const DEFAULT_SETTINGS: Settings = {
  wakeWord: "Hermes",
  stopWord: "Cipher",
  fuzzyMatching: true,
  voiceURI: "",
  speechRate: 1,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
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
