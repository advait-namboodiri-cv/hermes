interface HomeProps {
  onBegin: () => void;
  begun?: boolean;
  resumeHint?: string;
}

export default function Home({ onBegin, begun, resumeHint }: HomeProps) {
  return (
    <div className="screen fade-up">
      <div
        style={{
          position: "absolute",
          width: "min(680px, 130vmin)",
          height: "min(680px, 130vmin)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(216,177,90,.10),transparent 62%)",
          filter: "blur(8px)",
        }}
      />
      <span
        style={{
          fontSize: "clamp(44px, 9vw, 58px)",
          color: "var(--accent)",
          lineHeight: 1,
          marginBottom: 30,
          textShadow: "0 0 40px rgba(216,177,90,.4)",
        }}
      >
        ☤
      </span>
      <div
        style={{
          font: "600 13px 'Hanken Grotesk'",
          letterSpacing: ".32em",
          textTransform: "uppercase",
          color: "#7c7a73",
          position: "relative",
        }}
      >
        Ready when you are
      </div>
      <div
        style={{
          font: "400 clamp(34px, 7.5vw, 70px)/1.06 Fraunces,serif",
          color: "#f2efe7",
          letterSpacing: "-.01em",
          marginTop: 20,
          textAlign: "center",
          position: "relative",
        }}
      >
        Start a reading session
      </div>
      <div
        style={{
          font: "400 clamp(16px, 2.6vw, 21px)/1.5 'Hanken Grotesk'",
          color: "#9c998f",
          marginTop: 20,
          maxWidth: 580,
          textAlign: "center",
          position: "relative",
        }}
      >
        Hermes listens while you read. Say{" "}
        <span style={{ color: "#efece4", fontWeight: 600 }}>“Hermes”</span> and a
        word — it reads the definition aloud.
      </div>
      <button
        onClick={onBegin}
        style={{
          marginTop: 42,
          background: "var(--accent)",
          color: "#211803",
          font: "600 clamp(17px, 2.6vw, 21px) 'Hanken Grotesk'",
          padding: "clamp(15px, 2.4vw, 20px) clamp(36px, 6vw, 54px)",
          borderRadius: 46,
          border: "none",
          cursor: "pointer",
          position: "relative",
          boxShadow: "0 14px 44px rgba(216,177,90,.32)",
          transition: "filter .15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
      >
        {begun ? "Resume session" : "Begin session"}
      </button>
      {resumeHint && (
        <div
          style={{
            font: "400 15px 'Hanken Grotesk'",
            color: "#76736c",
            marginTop: 20,
            position: "relative",
          }}
        >
          {resumeHint}
        </div>
      )}
    </div>
  );
}
