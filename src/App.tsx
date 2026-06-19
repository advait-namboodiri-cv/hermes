import { useState } from "react";
import Header from "./components/Header";
import Home from "./components/screens/Home";
import type { Screen } from "./types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

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
              onBegin={() => setScreen("session")}
              resumeHint="resume last · 12 words, 47 min"
            />
          )}
        </div>
      </div>
    </div>
  );
}
