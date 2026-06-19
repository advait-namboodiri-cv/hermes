import type { Definition as Def } from "../../types";

interface DefinitionProps {
  def: Def;
  stopWord: string;
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
};

export default function Definition({ def, stopWord }: DefinitionProps) {
  return (
    <div
      className="fade-up"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 70px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 460,
          height: 460,
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
          font: "500 124px/.9 Spectral,serif",
          color: "#f4f1e9",
          letterSpacing: "-.02em",
          marginTop: 18,
          position: "relative",
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
            style={{ font: "italic 400 32px Spectral", color: "var(--accent)" }}
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
          font: "400 54px/1.16 'Hanken Grotesk'",
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
            font: "italic 400 38px/1.28 Spectral",
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
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <span style={chip}>↺ “again”</span>
          <span style={chip}>¶ “sentence”</span>
        </div>
        <span style={{ font: "400 15px 'Hanken Grotesk'", color: "#76736c" }}>
          say{" "}
          <span style={{ color: "#cfccc3", fontWeight: 500 }}>“{stopWord}”</span> to
          stop
        </span>
      </div>
    </div>
  );
}
