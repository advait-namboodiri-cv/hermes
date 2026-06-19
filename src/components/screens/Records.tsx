import TabHeader from "./TabHeader";

export interface DayCount {
  label: string;
  count: number;
}

interface RecordsProps {
  wordsThisWeek: number;
  hoursRead: number;
  perDay: DayCount[];
  onTab: (tab: "journal" | "records") => void;
}

const card: React.CSSProperties = {
  flex: 1,
  background: "#131318",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 14,
  padding: 24,
};

export default function Records({
  wordsThisWeek,
  hoursRead,
  perDay,
  onTab,
}: RecordsProps) {
  const peak = Math.max(1, ...perDay.map((d) => d.count));
  const peakIdx = perDay.findIndex((d) => d.count === peak);

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
      <TabHeader active="records" onTab={onTab} meta="this week ▾" />
      <div style={{ flex: 1, overflowY: "auto", padding: 40 }}>
        <div style={{ display: "flex", gap: 18 }}>
          <div style={card}>
            <div style={{ font: "500 58px Spectral", color: "#f1eee6" }}>
              {wordsThisWeek}
            </div>
            <div
              style={{
                font: "400 15px 'Hanken Grotesk'",
                color: "#827f78",
                marginTop: 4,
              }}
            >
              words this week
            </div>
          </div>
          <div style={card}>
            <div style={{ font: "500 58px Spectral", color: "#f1eee6" }}>
              {hoursRead.toFixed(1)}
              <span style={{ fontSize: 24, color: "#827f78" }}> h</span>
            </div>
            <div
              style={{
                font: "400 15px 'Hanken Grotesk'",
                color: "#827f78",
                marginTop: 4,
              }}
            >
              time read
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            background: "#131318",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 14,
            padding: 24,
          }}
        >
          <div
            style={{
              font: "600 12px 'Hanken Grotesk'",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#7c7a73",
              marginBottom: 24,
            }}
          >
            Words per day
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              height: 200,
            }}
          >
            {perDay.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${(d.count / peak) * 100}%`,
                    minHeight: 4,
                    borderRadius: "6px 6px 0 0",
                    background:
                      i === peakIdx ? "var(--accent)" : "rgba(255,255,255,.12)",
                    transformOrigin: "bottom",
                    animation: `barrise .6s ease ${i * 0.05}s both`,
                  }}
                />
                <span
                  style={{ font: "400 13px 'Hanken Grotesk'", color: "#5c594f" }}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
