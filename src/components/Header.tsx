interface HeaderProps {
  onHome: () => void;
  onJournal: () => void;
  onSettings: () => void;
}

const iconBtn: React.CSSProperties = {
  width: 38,
  height: 30,
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#8f8c85",
  fontSize: 15,
  cursor: "pointer",
  background: "transparent",
  transition: "background .15s ease, color .15s ease",
};

export default function Header({ onHome, onJournal, onSettings }: HeaderProps) {
  const hover = (e: React.MouseEvent<HTMLButtonElement>, on: boolean) => {
    e.currentTarget.style.background = on ? "rgba(255,255,255,.05)" : "transparent";
    e.currentTarget.style.color = on ? "#efece4" : "#8f8c85";
  };

  return (
    <div
      style={{
        height: 58,
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 26px",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        onClick={onHome}
        style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}
      >
        <span style={{ fontSize: 22, color: "var(--accent)", lineHeight: 1 }}>☤</span>
        <span
          style={{
            font: "700 15px 'Hanken Grotesk'",
            letterSpacing: ".26em",
            color: "#efece4",
          }}
        >
          HERMES
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          aria-label="Journal"
          onClick={onJournal}
          style={iconBtn}
          onMouseEnter={(e) => hover(e, true)}
          onMouseLeave={(e) => hover(e, false)}
        >
          ☰
        </button>
        <button
          aria-label="Settings"
          onClick={onSettings}
          style={iconBtn}
          onMouseEnter={(e) => hover(e, true)}
          onMouseLeave={(e) => hover(e, false)}
        >
          ⚙
        </button>
      </div>
    </div>
  );
}
