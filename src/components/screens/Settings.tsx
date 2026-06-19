import type { Settings as SettingsType } from "../../types";

interface SettingsProps {
  settings: SettingsType;
  voices: { uri: string; label: string }[];
  onChange: (patch: Partial<SettingsType>) => void;
}

const sectionLabel: React.CSSProperties = {
  font: "600 12px 'Hanken Grotesk'",
  letterSpacing: ".24em",
  textTransform: "uppercase",
  color: "#7c7a73",
  marginBottom: 16,
};

const fieldLabel: React.CSSProperties = {
  font: "400 13px 'Hanken Grotesk'",
  color: "#827f78",
  marginBottom: 8,
};

const field: React.CSSProperties = {
  width: "100%",
  background: "#15151a",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 11,
  padding: "15px 17px",
  font: "400 20px 'Hanken Grotesk'",
  color: "#f1eee6",
  outline: "none",
};

export default function Settings({ settings, voices, onChange }: SettingsProps) {
  return (
    <div
      className="fade-up"
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        padding: "40px 70px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            font: "400 44px Spectral,serif",
            color: "#f2efe7",
            marginBottom: 36,
          }}
        >
          Settings
        </div>

        {/* Recognition */}
        <div style={{ marginBottom: 36 }}>
          <div style={sectionLabel}>Recognition</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={fieldLabel}>Wake word</div>
              <input
                style={field}
                value={settings.wakeWord}
                onChange={(e) => onChange({ wakeWord: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={fieldLabel}>Stop word</div>
              <input
                style={field}
                value={settings.stopWord}
                onChange={(e) => onChange({ stopWord: e.target.value })}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              border: "1px solid rgba(255,255,255,.07)",
              background: "#131318",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ font: "500 17px 'Hanken Grotesk'", color: "#f1eee6" }}>
                Fuzzy wake-word matching
              </div>
              <div
                style={{
                  font: "400 13px 'Hanken Grotesk'",
                  color: "#76736c",
                  marginTop: 4,
                }}
              >
                catches near-misses like “homies” → “Hermes”
              </div>
            </div>
            <button
              aria-label="Toggle fuzzy matching"
              onClick={() => onChange({ fuzzyMatching: !settings.fuzzyMatching })}
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: settings.fuzzyMatching
                  ? "var(--accent)"
                  : "rgba(255,255,255,.12)",
                boxShadow: settings.fuzzyMatching
                  ? "0 0 18px rgba(216,177,90,.35)"
                  : "none",
                transition: "background .2s ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: settings.fuzzyMatching ? 25 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#f1eee6",
                  transition: "left .2s ease",
                }}
              />
            </button>
          </div>
        </div>

        {/* Voice */}
        <div style={{ marginBottom: 36 }}>
          <div style={sectionLabel}>Voice</div>
          <div style={fieldLabel}>Voice</div>
          <div style={{ position: "relative" }}>
            <select
              style={{
                ...field,
                appearance: "none",
                cursor: "pointer",
                paddingRight: 44,
              }}
              value={settings.voiceURI}
              onChange={(e) => onChange({ voiceURI: e.target.value })}
            >
              <option value="">System default</option>
              {voices.map((v) => (
                <option key={v.uri} value={v.uri}>
                  {v.label}
                </option>
              ))}
            </select>
            <span
              style={{
                position: "absolute",
                right: 17,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#8f8c85",
                pointerEvents: "none",
              }}
            >
              ▾
            </span>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={fieldLabel}>Speech rate</div>
            <div style={{ font: "500 14px 'Hanken Grotesk'", color: "var(--accent)" }}>
              {settings.speechRate.toFixed(1)}×
            </div>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={settings.speechRate}
            onChange={(e) => onChange({ speechRate: Number(e.target.value) })}
            className="rate-slider"
            style={{
              width: "100%",
              ["--fill" as string]: `${((settings.speechRate - 0.5) / 1.5) * 100}%`,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              font: "400 12px 'Hanken Grotesk'",
              color: "#5c594f",
              marginTop: 6,
            }}
          >
            <span>0.5×</span>
            <span>2.0×</span>
          </div>
        </div>

        {/* Command colors */}
        <div>
          <div style={sectionLabel}>Command colors</div>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            {[
              { c: "#d8b15a", l: "“Hermes” wake" },
              { c: "#5ec8d8", l: "speaking" },
              { c: "#b69ce8", l: "“again” replay" },
              { c: "#e08a6a", l: "“Cipher” stop" },
            ].map((d) => (
              <div
                key={d.l}
                style={{ display: "flex", alignItems: "center", gap: 9 }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: d.c,
                  }}
                />
                <span style={{ font: "400 14px 'Hanken Grotesk'", color: "#b6b3aa" }}>
                  {d.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
