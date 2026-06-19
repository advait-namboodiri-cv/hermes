import { useState } from "react";
import Header from "./components/Header";
import Home from "./components/screens/Home";
import Listening from "./components/screens/Listening";
import Wake from "./components/screens/Wake";
import LookingUp from "./components/screens/LookingUp";
import Definition from "./components/screens/Definition";
import NotFound from "./components/screens/NotFound";
import Settings from "./components/screens/Settings";
import Journal from "./components/screens/Journal";
import type {
  Definition as Def,
  Flow,
  Screen,
  Settings as SettingsType,
} from "./types";

// Placeholder data until the persistent journal store is wired in.
const SAMPLE_GROUPS = [
  {
    label: "Today",
    meta: "5 words · 47 min",
    rows: [
      { id: "1", word: "ephemeral", gloss: "adjective · lasting a very short time", time: "2:31 pm" },
      { id: "2", word: "sonder", gloss: "noun · the realization each passerby has a life", time: "2:24 pm" },
      { id: "3", word: "petrichor", gloss: "noun · the smell of rain on dry earth", time: "2:09 pm" },
      { id: "4", word: "liminal", gloss: "adjective · occupying a threshold", time: "1:58 pm" },
      { id: "5", word: "quotidian", gloss: "adjective · daily; ordinary", time: "1:44 pm" },
    ],
  },
  {
    label: "Yesterday",
    meta: "3 words · 33 min",
    rows: [
      { id: "6", word: "susurrus", gloss: "noun · a soft murmuring or rustling", time: "9:48 pm" },
      { id: "7", word: "apricity", gloss: "noun · the warmth of the sun in winter", time: "9:31 pm" },
    ],
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [flow, setFlow] = useState<Flow>("listening");
  const [lookupWord] = useState("");
  const [def] = useState<Def | null>(null);
  const [settings, setSettings] = useState<SettingsType>({
    wakeWord: "Hermes",
    stopWord: "Cipher",
    fuzzyMatching: true,
    voiceURI: "",
    speechRate: 1,
  });

  const wakeWord = settings.wakeWord;
  const stopWord = settings.stopWord;
  const onSettings = (patch: Partial<SettingsType>) =>
    setSettings((s) => ({ ...s, ...patch }));

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 1280,
          height: 800,
          background: "#0c0c0f",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 22,
          boxShadow:
            "0 50px 130px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.02) inset",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          onHome={() => setScreen("home")}
          onJournal={() => setScreen("journal")}
          onSettings={() => setScreen("settings")}
        />
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {screen === "home" && (
            <Home
              onBegin={() => {
                setScreen("session");
                setFlow("listening");
              }}
              resumeHint="resume last · 12 words, 47 min"
            />
          )}

          {screen === "session" && flow === "listening" && (
            <Listening wakeWord={wakeWord} />
          )}
          {screen === "session" && flow === "wake" && (
            <Wake wakeWord={wakeWord} />
          )}
          {screen === "session" && flow === "fetching" && (
            <LookingUp word={lookupWord} />
          )}
          {screen === "session" && flow === "definition" && def && (
            <Definition def={def} stopWord={stopWord} />
          )}
          {screen === "session" && flow === "notfound" && (
            <NotFound word={lookupWord} />
          )}

          {screen === "settings" && (
            <Settings settings={settings} voices={[]} onChange={onSettings} />
          )}
          {screen === "journal" && (
            <Journal
              groups={SAMPLE_GROUPS}
              onTab={(t) => setScreen(t)}
              onReplay={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
