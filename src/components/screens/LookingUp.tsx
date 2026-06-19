interface LookingUpProps {
  word: string;
}

export default function LookingUp({ word }: LookingUpProps) {
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
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(216,177,90,.06),transparent 62%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          font: "600 13px 'Hanken Grotesk'",
          letterSpacing: ".32em",
          textTransform: "uppercase",
          color: "#8a8475",
          position: "relative",
          textAlign: "center",
        }}
      >
        Looking up
      </div>
      <div
        style={{
          font: "500 96px/.95 Spectral,serif",
          color: "#f3f0e8",
          marginTop: 18,
          position: "relative",
          textAlign: "center",
        }}
      >
        {word}
      </div>
      <div
        style={{
          position: "relative",
          width: 300,
          height: 4,
          marginTop: 24,
          background: "rgba(255,255,255,.08)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, var(--accent), transparent)",
            animation: "sweep 1.2s ease-in-out infinite",
          }}
        />
      </div>
      <div
        style={{
          font: "400 16px 'Hanken Grotesk'",
          color: "#76736c",
          marginTop: 22,
          position: "relative",
        }}
      >
        confirming what it heard…
      </div>
    </div>
  );
}
