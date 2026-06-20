import { useState } from "react";
import type { Settings as SettingsType } from "../../types";

interface SettingsProps {
  settings: SettingsType;
  voices: { uri: string; label: string }[];
  onChange: (patch: Partial<SettingsType>) => void;
  onResetProgress: () => void;
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

function ToggleRow({
  title,
  hint,
  on,
  onToggle,
  topGap = 20,
}: {
  title: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
  topGap?: number;
}) {
  return (
    <div
      style={{
        marginTop: topGap,
        border: "1px solid rgba(255,255,255,.07)",
        background: "#131318",
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <div style={{ font: "500 17px 'Hanken Grotesk'", color: "#f1eee6" }}>
          {title}
        </div>
        <div
          style={{
            font: "400 13px 'Hanken Grotesk'",
            color: "#76736c",
            marginTop: 4,
          }}
        >
          {hint}
        </div>
      </div>
      <button
        aria-label={`Toggle ${title}`}
        onClick={onToggle}
        style={{
          flex: "none",
          width: 50,
          height: 28,
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          position: "relative",
          background: on ? "var(--accent)" : "rgba(255,255,255,.12)",
          boxShadow: on ? "0 0 18px rgba(216,177,90,.35)" : "none",
          transition: "background .2s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: on ? 25 : 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#f1eee6",
            transition: "left .2s ease",
          }}
        />
      </button>
    </div>
  );
}

export default function Settings({
  settings,
  voices,
  onChange,
  onResetProgress,
}: SettingsProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  return (
    <div
      className="fade-up"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "clamp(28px, 5vw, 40px) clamp(20px, 5vw, 70px)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            font: "400 clamp(32px, 6vw, 44px) Fraunces,serif",
            color: "#f2efe7",
            marginBottom: 36,
          }}
        >
          Settings
        </div>

        {/* Recognition */}
        <div style={{ marginBottom: 36 }}>
          <div style={sectionLabel}>Recognition</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px" }}>
              <div style={fieldLabel}>Wake word</div>
              <input
                style={field}
                value={settings.wakeWord}
                onChange={(e) => onChange({ wakeWord: e.target.value })}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <div style={fieldLabel}>Stop word</div>
              <input
                style={field}
                value={settings.stopWord}
                onChange={(e) => onChange({ stopWord: e.target.value })}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <div style={fieldLabel}>End session word</div>
              <input
                style={field}
                value={settings.endWord}
                onChange={(e) => onChange({ endWord: e.target.value })}
              />
            </div>
          </div>

          <ToggleRow
            title="Fuzzy wake-word matching"
            hint="catches near-misses like “homies” → “Hermes”"
            on={settings.fuzzyMatching}
            onToggle={() => onChange({ fuzzyMatching: !settings.fuzzyMatching })}
          />
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: 36 }}>
          <div style={sectionLabel}>Feedback</div>
          <ToggleRow
            title="Sound cues"
            hint="soft tones for wake, found, and not-found — confirmation by ear"
            on={settings.soundCues}
            onToggle={() => onChange({ soundCues: !settings.soundCues })}
            topGap={0}
          />
          <ToggleRow
            title="Spoken confirmations"
            hint="says “got it” when it hears your word, and acknowledges commands"
            on={settings.spokenConfirm}
            onToggle={() => onChange({ spokenConfirm: !settings.spokenConfirm })}
          />
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
              { c: "#d8b15a", l: `“${settings.wakeWord}” wake` },
              { c: "#5ec8d8", l: "speaking" },
              { c: "#b69ce8", l: "“again” replay" },
              { c: "#e08a6a", l: `“${settings.stopWord}” stop` },
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

        {/* Danger zone */}
        <div style={{ marginTop: 48 }}>
          <div style={{ ...sectionLabel, color: "#c07556" }}>Danger zone</div>
          <div
            style={{
              border: "1px solid rgba(224,138,106,.28)",
              background: "rgba(224,138,106,.06)",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ font: "500 17px 'Hanken Grotesk'", color: "#e9a98f" }}>
                Delete all progress
              </div>
              <div
                style={{
                  font: "400 13px 'Hanken Grotesk'",
                  color: "#9a7563",
                  marginTop: 4,
                  maxWidth: 460,
                }}
              >
                {confirmingReset
                  ? "This erases every word you’ve learned and resets Hermes to a brand-new account. This can’t be undone."
                  : "Clears your journal, records, and settings saved in this browser — like starting over."}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {confirmingReset && (
                <button
                  onClick={() => setConfirmingReset(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    font: "500 14px 'Hanken Grotesk'",
                    color: "#827f78",
                  }}
                >
                  cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (confirmingReset) onResetProgress();
                  else setConfirmingReset(true);
                }}
                style={{
                  flex: "none",
                  cursor: "pointer",
                  font: "600 14px 'Hanken Grotesk'",
                  padding: "11px 18px",
                  borderRadius: 11,
                  border: "1px solid rgba(224,138,106,.5)",
                  background: confirmingReset ? "#b0432a" : "rgba(224,138,106,.1)",
                  color: confirmingReset ? "#fdeee8" : "#e08a6a",
                  transition: "background .15s ease, color .15s ease",
                }}
              >
                {confirmingReset ? "Yes, delete everything" : "Delete all progress"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
