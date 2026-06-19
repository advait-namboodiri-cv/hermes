import { useEffect, useState } from "react";
import type { Command } from "../lib/engine";

// A brief top-center pill that confirms a voice command registered — the
// "every command gives visual confirmation" requirement for commands that
// don't otherwise change the screen (stop / again / sentence).

const LABELS: Record<Command, { text: string; color: string }> = {
  wake: { text: "✦ Hermes", color: "#d8b15a" },
  stop: { text: "■ stopped", color: "#e08a6a" },
  again: { text: "↺ replaying", color: "#b69ce8" },
  sentence: { text: "¶ sentence", color: "#5ec8d8" },
  end: { text: "✕ session ended", color: "#b6b3aa" },
};

interface CommandFlashProps {
  command: Command | null;
  seq: number;
}

export default function CommandFlash({ command, seq }: CommandFlashProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (seq === 0 || !command) return;
    setShown(true);
    const t = setTimeout(() => setShown(false), 1600);
    return () => clearTimeout(t);
  }, [seq, command]);

  if (!command) return null;
  const { text, color } = LABELS[command];

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: `translateX(-50%) translateY(${shown ? 0 : -12}px)`,
        opacity: shown ? 1 : 0,
        transition: "opacity .25s ease, transform .25s ease",
        pointerEvents: "none",
        zIndex: 20,
        background: "rgba(20,20,24,.9)",
        border: `1px solid ${color}55`,
        color,
        borderRadius: 22,
        padding: "8px 18px",
        font: "600 13px 'Hanken Grotesk'",
        letterSpacing: ".04em",
        boxShadow: `0 8px 30px rgba(0,0,0,.4)`,
      }}
    >
      {text}
    </div>
  );
}
