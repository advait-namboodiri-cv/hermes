interface NotFoundProps {
  word: string;
}

export default function NotFound({ word }: NotFoundProps) {
  return (
    <div
      className="fade-up"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(224,138,106,.10),transparent 62%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          font: "400 26px 'Hanken Grotesk'",
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
          border: "1px solid rgba(224,138,106,.4)",
          borderRadius: 16,
          padding: "14px 34px",
          font: "500 68px Spectral",
          color: "#efece4",
          textDecoration: "line-through",
          textDecorationColor: "rgba(224,138,106,.7)",
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
