interface UnreachableProps {
  word: string;
}

export default function Unreachable({ word }: UnreachableProps) {
  return (
    <div className="screen fade-up">
      <div
        style={{
          position: "absolute",
          width: "min(620px, 120vmin)",
          height: "min(620px, 120vmin)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(224,138,106,.10),transparent 62%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          font: "400 clamp(28px, 5vw, 44px) Fraunces,serif",
          color: "#efece4",
          position: "relative",
          textAlign: "center",
          maxWidth: 620,
        }}
      >
        the dictionary isn’t responding
      </div>
      {word && (
        <div
          style={{
            font: "400 clamp(16px, 2.8vw, 22px) 'Hanken Grotesk'",
            color: "#9c998f",
            marginTop: 18,
            position: "relative",
          }}
        >
          couldn’t look up <span style={{ color: "#cfccc3" }}>“{word}”</span>
        </div>
      )}
      <div
        style={{
          font: "400 16px/1.5 'Hanken Grotesk'",
          color: "#827f78",
          marginTop: 24,
          maxWidth: 400,
          textAlign: "center",
          position: "relative",
        }}
      >
        check your connection, or try again in a moment — returns to listening on
        its own
      </div>
    </div>
  );
}
