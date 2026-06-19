import type { Definition as Def } from "../../types";

interface DefinitionProps {
  def: Def;
  stopWord: string;
  onReplay?: () => void;
  onSentence?: () => void;
  onStop?: () => void;
}

function Equalizer() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 18 }}>
      {[0, 0.2, 0.4, 0.6].map((d, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 18,
            background: "var(--accent)",
            transformOrigin: "bottom",
            animation: `eq 1s ease-in-out ${d}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const chip: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.13)",
  borderRadius: 24,
  padding: "9px 20px",
  color: "#b6b3aa",
  font: "400 15px 'Hanken Grotesk'",
  background: "transparent",
  cursor: "pointer",
};

export default function Definition({
  def,
  stopWord,
  onReplay,
  onSentence,
  onStop,
}: DefinitionProps) {
  return (
    <div
      className="fade-up"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(28px, 5vw, 60px) clamp(22px, 5vw, 70px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: "min(460px, 100vmin)",
          height: "min(460px, 100vmin)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(216,177,90,.12),transparent 62%)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Equalizer />
        <span
          style={{
            font: "600 13px 'Hanken Grotesk'",
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Speaking aloud
        </span>
      </div>

      <div
        style={{
          font: "500 clamp(46px, 14vw, 124px)/.92 Fraunces,serif",
          color: "#f4f1e9",
          letterSpacing: "-.02em",
          marginTop: 18,
          position: "relative",
          maxWidth: "100%",
          wordBreak: "break-word",
        }}
      >
        {def.word}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 22,
          marginTop: 16,
          position: "relative",
        }}
      >
        {def.pronunciation && (
          <span
            style={{
              font: "italic 400 clamp(20px, 4vw, 32px) Fraunces",
              color: "var(--accent)",
            }}
          >
            {def.pronunciation}
          </span>
        )}
        {def.partOfSpeech && (
          <span
            style={{
              font: "600 14px 'Hanken Grotesk'",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#8d8a80",
            }}
          >
            {def.partOfSpeech}
          </span>
        )}
      </div>

      <div
        style={{
          font: "400 clamp(24px, 6vw, 54px)/1.16 'Hanken Grotesk'",
          color: "#eae7de",
          maxWidth: 1050,
          marginTop: 26,
          position: "relative",
        }}
      >
        {def.definition}
      </div>

      {def.example && (
        <div
          style={{
            font: "italic 400 clamp(18px, 4.4vw, 38px)/1.28 Fraunces",
            color: "#9d9990",
            maxWidth: 980,
            marginTop: 22,
            position: "relative",
          }}
        >
          “{def.example}”
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          marginTop: "clamp(28px, 5vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={chip} onClick={onReplay}>
            ↺ “again”
          </button>
          {def.example && (
            <button style={chip} onClick={onSentence}>
              ¶ “sentence”
            </button>
          )}
        </div>
        <button
          onClick={onStop}
          title="stop speaking"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            font: "400 15px 'Hanken Grotesk'",
            color: "#76736c",
            padding: 0,
          }}
        >
          say{" "}
          <span style={{ color: "#cfccc3", fontWeight: 500 }}>“{stopWord}”</span> to
          stop
        </button>
      </div>
    </div>
  );
}
