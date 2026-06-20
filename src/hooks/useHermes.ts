// React binding for HermesEngine. Keeps engine state in sync with React,
// owns persisted settings, and exposes the voice list + control actions.
// All real logic lives in the engine; this is a thin adapter.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HermesEngine, type EngineState } from "../lib/engine";
import { BrowserTts } from "../lib/tts/browserTts";
import { BrowserCues } from "../lib/cues";
import { loadSettings, saveSettings } from "../lib/settings";
import type { TtsVoice } from "../lib/tts/types";
import type { Definition, Settings } from "../types";

export function useHermes() {
  const tts = useMemo(() => new BrowserTts(), []);
  const cues = useMemo(() => new BrowserCues(), []);
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings());

  const engine = useMemo(
    () => new HermesEngine({ settings, tts, cues }),
    // engine is created once; settings updates flow through updateSettings below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [state, setState] = useState<EngineState>(() => engine.getState());
  const [voices, setVoices] = useState<TtsVoice[]>(() => tts.listVoices());
  const settingsRef = useRef(settings);

  // Mirror engine state into React.
  useEffect(() => engine.subscribe(setState), [engine]);

  // Keep the engine + storage in step with settings, and refresh voices.
  useEffect(() => {
    settingsRef.current = settings;
    engine.updateSettings(settings);
    saveSettings(settings);
  }, [engine, settings]);

  useEffect(() => {
    const refresh = () => setVoices(tts.listVoices());
    tts.onVoicesChanged(refresh);
    refresh();
  }, [tts]);

  // Stop everything when the app unmounts.
  useEffect(() => () => engine.stop(), [engine]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((s) => ({ ...s, ...patch }));
  }, []);

  return {
    state,
    settings,
    voices,
    updateSettings,
    start: useCallback(() => engine.start(), [engine]),
    stop: useCallback(() => engine.stop(), [engine]),
    endSession: useCallback(() => engine.endSession(), [engine]),
    replay: useCallback(() => engine.replayLast(), [engine]),
    readSentence: useCallback(() => engine.readSentence(), [engine]),
    cancelSpeech: useCallback(() => engine.cancelSpeech(), [engine]),
    play: useCallback((def: Definition) => engine.playDefinition(def), [engine]),
  };
}
