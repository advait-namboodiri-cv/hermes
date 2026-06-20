type Tab = "journal" | "records" | "review";

interface TabHeaderProps {
  active: Tab;
  onTab: (tab: Tab) => void;
  meta: string;
}

export default function TabHeader({ active, onTab, meta }: TabHeaderProps) {
  const tab = (key: Tab, label: string) => {
    const isActive = active === key;
    return (
      <button
        onClick={() => onTab(key)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0 0 14px",
          font: `${isActive ? 600 : 500} 18px 'Hanken Grotesk'`,
          color: isActive ? "#f1eee6" : "#76736c",
          borderBottom: isActive
            ? "2px solid var(--accent)"
            : "2px solid transparent",
          transition: "color .15s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.color = "#b6b3aa";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = "#76736c";
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        flex: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "24px 40px 0",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div style={{ display: "flex", gap: 26 }}>
        {tab("journal", "Journal")}
        {tab("records", "Records")}
        {tab("review", "Review")}
      </div>
      <div
        style={{
          font: "500 13px 'Hanken Grotesk'",
          color: "#76736c",
          paddingBottom: 14,
        }}
      >
        {meta}
      </div>
    </div>
  );
}
