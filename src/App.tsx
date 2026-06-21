import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import CommandFlash from "./components/CommandFlash";
import Home from "./components/screens/Home";
import Listening from "./components/screens/Listening";
import Wake from "./components/screens/Wake";
import LookingUp from "./components/screens/LookingUp";
import Definition from "./components/screens/Definition";
import NotFound from "./components/screens/NotFound";
import Settings from "./components/screens/Settings";
import Journal from "./components/screens/Journal";
import Records from "./components/screens/Records";
import Review from "./components/screens/Review";
import { useHermes } from "./hooks/useHermes";
import { useOnline } from "./hooks/useOnline";
import {
  groupForJournal,
  loadEntries,
  recordsSummary,
  findEntry,
} from "./lib/journal/store";
import { clearAllProgress } from "./lib/reset";
import type { Screen } from "./types";

export default function App() {
  const online = useOnline();
  const [screen, setScreen] = useState<Screen>("home");
  const {
    state,
    settings,
    voices,
    updateSettings,
    start,
    endSession,
    replay,
    readSentence,
    cancelSpeech,
    play,
  } = useHermes();

  // Recompute journal/records whenever a new word lands or we open the view.
  const entries = useMemo(
    () => loadEntries(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.definition, screen]
  );
  const groups = useMemo(() => groupForJournal(entries), [entries]);
  const records = useMemo(() => recordsSummary(entries), [entries]);

  // Bring the live session forward when a voice command fires from elsewhere.
  const prevFlow = useRef(state.flow);
  useEffect(() => {
    const active =
      state.flow === "wake" ||
      state.flow === "fetching" ||
      state.flow === "definition" ||
      state.flow === "notfound";
    if (active && prevFlow.current !== state.flow && screen !== "session") {
      setScreen("session");
    }
    // Session ended (e.g. "Goodbye") — return to the start screen.
    const wasActive = prevFlow.current !== "idle";
    if (state.flow === "idle" && wasActive) {
      setScreen("home");
    }
    prevFlow.current = state.flow;
  }, [state.flow, screen]);

  const wordsToday = groups[0]?.label === "Today" ? groups[0].rows.length : 0;
  const resumeHint = state.listening
    ? `listening · ${wordsToday} word${wordsToday === 1 ? "" : "s"} today`
    : entries.length > 0
      ? `${entries.length} words logged`
      : undefined;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0c0c0f",
        overflow: "hidden",
      }}
    >
      <Header
        onHome={() => setScreen("home")}
        onJournal={() => setScreen("journal")}
        onSettings={() => setScreen("settings")}
        sessionActive={state.listening}
        onEndSession={() => {
          endSession();
          setScreen("home");
        }}
        offline={!online}
      />
      <div
        style={{
          flex: 1,
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <CommandFlash command={state.lastCommand} seq={state.commandSeq} />
          {screen === "home" && (
            <Home
              begun={state.listening}
              onBegin={() => {
                if (!state.listening) start();
                setScreen("session");
              }}
              resumeHint={resumeHint}
            />
          )}

          {screen === "session" && state.flow === "listening" && (
            <Listening
              wakeWord={settings.wakeWord}
              transcript={state.transcript}
              error={state.error}
            />
          )}
          {screen === "session" && state.flow === "wake" && (
            <Wake wakeWord={settings.wakeWord} heard={state.transcript} />
          )}
          {screen === "session" && state.flow === "fetching" && (
            <LookingUp word={state.lookupWord} />
          )}
          {screen === "session" && state.flow === "definition" && state.definition && (
            <Definition
              def={state.definition}
              stopWord={settings.stopWord}
              onReplay={replay}
              onSentence={readSentence}
              onStop={cancelSpeech}
            />
          )}
          {screen === "session" && state.flow === "notfound" && (
            <NotFound word={state.lookupWord} />
          )}
          {/* If a session view is requested but flow is idle, show listening shell. */}
          {screen === "session" && state.flow === "idle" && (
            <Listening
              wakeWord={settings.wakeWord}
              transcript={state.transcript}
              error={state.error}
            />
          )}

          {screen === "settings" && (
            <Settings
              settings={settings}
              voices={voices}
              onChange={updateSettings}
              onResetProgress={() => {
                clearAllProgress();
                window.location.reload();
              }}
            />
          )}
          {screen === "journal" && (
            <Journal
              groups={groups}
              onTab={(t) => setScreen(t)}
              onReplay={(id) => {
                const e = findEntry(id);
                if (e) play(e);
              }}
            />
          )}
          {screen === "records" && (
            <Records
              wordsThisWeek={records.wordsThisWeek}
              hoursRead={records.hoursRead}
              perDay={records.perDay}
              onTab={(t) => setScreen(t)}
            />
          )}
          {screen === "review" && (
            <Review onTab={(t) => setScreen(t)} onPlay={play} />
          )}
        </div>
      </div>
  );
}
