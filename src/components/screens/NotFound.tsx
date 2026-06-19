interface NotFoundProps {
  word: string;
}

export default function NotFound({ word }: NotFoundProps) {
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
          font: "400 clamp(18px, 3.4vw, 26px) 'Hanken Grotesk'",
          color: "#9c998f",
          position: "relative",
        }}
      >
        No definition for
      </div>
      <div
        style={{
          position: "relative",
          marginTop: 24,
          maxWidth: "100%",
          border: "1px solid rgba(224,138,106,.4)",
          borderRadius: 16,
          padding: "14px clamp(20px, 5vw, 34px)",
          font: "500 clamp(36px, 9vw, 68px) Fraunces",
          color: "#efece4",
          textDecoration: "line-through",
          textDecorationColor: "rgba(224,138,106,.7)",
          wordBreak: "break-word",
        }}
      >
        “{word}”
      </div>
      <div
        style={{
          font: "400 16px/1.5 'Hanken Grotesk'",
          color: "#827f78",
          marginTop: 26,
          maxWidth: 360,
          textAlign: "center",
          position: "relative",
        }}
      >
        say it again, or try another word — returns to listening on its own
      </div>
    </div>
  );
}
