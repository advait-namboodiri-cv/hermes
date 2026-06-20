// Wipe everything Hermes has saved in this browser — the journal, settings, and
// any migration flags — returning the app to a brand-new state.

export function clearAllProgress() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("hermes.")) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
