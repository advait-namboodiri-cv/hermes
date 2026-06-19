interface WakeProps {
  wakeWord: string;
  heard?: string;
}

export default function Wake({ wakeWord, heard }: WakeProps) {
  return (
    <div className="screen fade-up">
      <div
        style={{
          position: "absolute",
          width: "min(380px, 76vmin)",
          height: "min(380px, 76vmin)",
          borderRadius: "50%",
          border: "1px solid rgba(216,177,90,.3)",
          animation: "ringpulse 3s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "min(420px, 84vmin)",
          height: "min(420px, 84vmin)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 46%, rgba(224,182,96,.62), rgba(176,128,48,.2) 46%, transparent 70%)",
          filter: "blur(6px)",
          animation: "breathe 2.6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            font: "300 clamp(48px, 11vw, 80px)/1 Fraunces,serif",
            color: "#f4f1e9",
          }}
        >
          Yes?
        </div>
        <div
          style={{
            font: "400 clamp(16px, 3vw, 22px) 'Hanken Grotesk'",
            color: "#a9a59a",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          say the word you want defined
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "clamp(16px, 4vw, 40px)",
          right: "clamp(16px, 4vw, 40px)",
          bottom: 28,
          border: "1px solid rgba(216,177,90,.34)",
          background: "rgba(216,177,90,.08)",
          borderRadius: 14,
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            font: "600 12px 'Hanken Grotesk'",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Heard
        </span>
        <span style={{ font: "400 18px 'Hanken Grotesk'", color: "#efece4" }}>
          “{heard?.trim() || wakeWord}…”
        </span>
      </div>
    </div>
  );
}
