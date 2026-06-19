import TabHeader from "./TabHeader";
import type { JournalGroup } from "../../lib/journal/store";

interface JournalProps {
  groups: JournalGroup[];
  onTab: (tab: "journal" | "records") => void;
  onReplay: (id: string) => void;
}

export default function Journal({ groups, onTab, onReplay }: JournalProps) {
  return (
    <div
      className="fade-up"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TabHeader active="journal" onTab={onTab} meta="all sessions" />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {groups.length === 0 && (
          <div
            style={{
              padding: "80px 40px",
              textAlign: "center",
              font: "400 18px 'Hanken Grotesk'",
              color: "#76736c",
            }}
          >
            No words yet. Begin a session and say “Hermes” to look one up.
          </div>
        )}
        {groups.map((g) => (
          <div key={g.label}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                padding: "24px 40px 12px",
              }}
            >
              <span
                style={{
                  font: "600 12px 'Hanken Grotesk'",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "#7c7a73",
                }}
              >
                {g.label}
              </span>
              <span style={{ font: "500 12px 'Hanken Grotesk'", color: "#5c594f" }}>
                {g.meta}
              </span>
            </div>
            {g.rows.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 40px",
                  borderBottom: "1px solid rgba(255,255,255,.045)",
                }}
              >
                <div>
                  <div
                    style={{ font: "500 22px Spectral", color: "#f1eee6" }}
                  >
                    {r.word}
                  </div>
                  <div
                    style={{
                      font: "400 14px 'Hanken Grotesk'",
                      color: "#827f78",
                      marginTop: 3,
                    }}
                  >
                    {r.gloss}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <span
                    style={{ font: "400 14px 'Hanken Grotesk'", color: "#5c594f" }}
                  >
                    {r.time}
                  </span>
                  <button
                    aria-label={`Replay ${r.word}`}
                    onClick={() => onReplay(r.id)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "1px solid rgba(216,177,90,.4)",
                      color: "var(--accent)",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "background .15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(216,177,90,.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    ▷
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
