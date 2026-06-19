interface ListeningProps {
  wakeWord: string;
  transcript?: string;
  error?: string | null;
}

const ring: React.CSSProperties = {
  position: "absolute",
  width: 420,
  height: 420,
  borderRadius: "50%",
  border: "1px solid rgba(150,175,205,.16)",
  animation: "ringpulse 4.5s ease-out infinite",
};

export default function Listening({
  wakeWord,
  transcript,
  error,
}: ListeningProps) {
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
      <div style={ring} />
      <div style={{ ...ring, animationDelay: "2.2s" }} />
      <div
        style={{
          position: "absolute",
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 46%, rgba(150,178,208,.5), rgba(90,112,145,.16) 45%, transparent 70%)",
          filter: "blur(7px)",
          animation: "breathe 5.5s ease-in-out infinite",
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
        <div style={{ font: "300 68px/1 'Hanken Grotesk'", color: "#eceae3" }}>
          Listening
        </div>
        <div
          style={{
            font: "400 22px 'Hanken Grotesk'",
            color: "#94918a",
            marginTop: 8,
          }}
        >
          Say{" "}
          <span style={{ color: "#cfccc3", fontWeight: 500 }}>“{wakeWord}”</span> + a
          word
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 0,
          right: 0,
          textAlign: "center",
          font: "400 15px 'Hanken Grotesk'",
          color: "#56534d",
          padding: "0 40px",
        }}
      >
        {error === "unsupported" ? (
          <span style={{ color: "#c08c6a" }}>
            speech recognition isn’t available in this browser — try Chrome
          </span>
        ) : transcript ? (
          <span style={{ color: "#74716a", fontStyle: "italic" }}>
            “{transcript}”
          </span>
        ) : (
          <>
            engages on{" "}
            <span style={{ color: "#94918a", fontWeight: 500 }}>
              “{wakeWord}”
            </span>
          </>
        )}
      </div>
    </div>
  );
}
