import { useState } from "react";

/* =========================================================
 *  SynTitan LNB (Figma 384:126636)
 *  - collapsed: 56w
 *  - expanded:  260w
 * ========================================================= */

const C = {
  white: "#FFFFFF",
  gray25: "#FBFBFB",
  gray50: "#F7F7F8",
  gray100: "#F0F0F2",
  gray200: "#E6E7E9",
  gray300: "#DCDDDF",
  gray800: "#7B7E85",
  gray900: "#525459",
  gray990: "#171719",
  strong: "#171719",
  blue100: "#DBEAFE",
  blue500: "#2B7FFF",
};

const F = "Pretendard, sans-serif";

const NAV = [
  { key: "home", label: "Home", icon: IconHome, section: null },
  { key: "edit", label: "Edit Dataset", icon: IconDataset, section: "Workspace" },
  { key: "agent", label: "Agent Analysis", icon: IconAgent, section: "Workspace" },
  { key: "discussion", label: "Discussion Room", icon: IconDiscussion, section: "Workspace" },
  { key: "report", label: "Report Hub", icon: IconReport, section: "Analyze" },
];

/* =========================================================
 *  LNB
 * ========================================================= */
export default function LNB({
  active = "home",
  onChange,
  defaultOpen = true,
  user = { name: "Cubig Kim", email: "email@company.com", initial: "A" },
  plan = { name: "Basic", credits: 50000, creditsMax: 600000 },
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoverKey, setHoverKey] = useState(null);

  const width = open ? 260 : 56;
  // 섹션별로 그룹핑
  const sections = [];
  NAV.forEach((it) => {
    const last = sections[sections.length - 1];
    if (!last || last.name !== it.section) {
      sections.push({ name: it.section, items: [] });
    }
    sections[sections.length - 1].items.push(it);
  });

  return (
    <aside
      style={{
        width,
        minWidth: width,
        height: "100vh",
        background: C.white,
        borderRight: `1px solid ${C.gray200}`,
        display: "flex",
        flexDirection: "column",
        fontFamily: F,
        transition: "width .18s ease",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          padding: open ? "0 16px" : 0,
          flexShrink: 0,
        }}
      >
        {open && (
          <span style={{ fontSize: 16, fontWeight: 700, color: C.gray990, letterSpacing: "-0.01em" }}>
            SynTitan
          </span>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: 28,
            height: 28,
            border: "none",
            background: "transparent",
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.gray800,
          }}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
          title={open ? "Close sidebar" : "Open sidebar"}
        >
          <IconSidebar />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: open ? "8px 12px" : "8px 8px", overflowY: "auto" }}>
        {sections.map((sec, si) => (
          <div key={si} style={{ marginBottom: 8 }}>
            {sec.name && open && (
              <div
                style={{
                  fontSize: 12,
                  color: C.gray800,
                  fontWeight: 500,
                  padding: "12px 12px 6px",
                }}
              >
                {sec.name}
              </div>
            )}
            {sec.name && !open && si > 0 && (
              <div style={{ height: 1, background: C.gray200, margin: "8px 6px" }} />
            )}
            {sec.items.map((it) => {
              const isActive = active === it.key;
              const isHover = hoverKey === it.key;
              const Icon = it.icon;
              return (
                <div key={it.key} style={{ position: "relative" }}>
                  <button
                    onClick={() => onChange?.(it.key)}
                    onMouseEnter={() => setHoverKey(it.key)}
                    onMouseLeave={() => setHoverKey(null)}
                    style={{
                      width: "100%",
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: open ? "0 12px" : 0,
                      justifyContent: open ? "flex-start" : "center",
                      background: isActive ? C.gray100 : isHover ? C.gray50 : "transparent",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      color: isActive ? C.gray990 : C.gray900,
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      fontFamily: F,
                      transition: "background .12s",
                    }}
                  >
                    <Icon />
                    {open && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span>}
                  </button>
                  {/* Collapsed 툴팁 */}
                  {!open && isHover && (
                    <div
                      style={{
                        position: "absolute",
                        left: "calc(100% + 8px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: C.strong,
                        color: C.white,
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: "18px",
                        padding: "4px 8px",
                        borderRadius: 6,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      {it.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer — Plan card + User */}
      <div style={{ borderTop: `1px solid ${C.gray200}`, padding: open ? 12 : 8, flexShrink: 0 }}>
        {/* Plan */}
        {open ? (
          <div
            style={{
              background: C.gray50,
              border: `1px solid ${C.gray200}`,
              borderRadius: 12,
              padding: 12,
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: C.blue100,
                  color: C.blue500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: F,
                }}
              >
                {plan.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontSize: 11, color: C.gray800, lineHeight: "14px" }}>Current plan</span>
                <span style={{ fontSize: 13, color: C.gray990, fontWeight: 600 }}>{plan.name}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.gray800 }}>Credits</span>
              <span style={{ fontSize: 11, color: C.gray990, fontWeight: 500 }}>
                {plan.credits.toLocaleString()} / {plan.creditsMax.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 4, background: C.gray200, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min(100, (plan.credits / plan.creditsMax) * 100)}%`,
                  height: "100%",
                  background: C.gray990,
                }}
              />
            </div>
          </div>
        ) : null}

        {/* User */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            style={{
              width: "100%",
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: open ? "0 8px" : 0,
              justifyContent: open ? "space-between" : "center",
              background: profileOpen ? C.gray100 : "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: F,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: C.gray990,
                  color: C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user.initial}
              </div>
              {open && (
                <span style={{ fontSize: 13, color: C.gray990, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </span>
              )}
            </div>
            {open && <IconChevronR />}
          </button>

          {profileOpen && open && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: C.white,
                border: `1px solid ${C.gray200}`,
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
                padding: 12,
                zIndex: 20,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.gray990 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: C.gray800 }}>{user.email}</div>
              </div>
              <button
                style={{
                  width: "100%",
                  height: 32,
                  border: "none",
                  borderRadius: 8,
                  background: C.gray990,
                  color: C.white,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: F,
                  marginBottom: 8,
                }}
              >
                Settings
              </button>
              {["Members & Teams", "Pricing", "Term & policies", "Log out"].map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 4px",
                    fontSize: 13,
                    color: C.gray990,
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.gray50)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
 *  Icons (20px outline)
 * ========================================================= */
function IconSidebar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="4" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9.5L10 3.5L17 9.5V16a1 1 0 01-1 1h-3v-5H7v5H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function IconDataset() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconAgent() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 16V9M8 16V5M12 16v-9M16 16v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconDiscussion() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16c0-2 1.8-4 4-4s4 2 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 16c0-1.5 1.3-3 3-3s3 1.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconReport() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="3" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8h6M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconChevronR() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="#7B7E85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
