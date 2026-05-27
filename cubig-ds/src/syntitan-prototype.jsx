import { useState, useRef, useEffect } from "react";
import { T } from "./tokens";
import { McpSettingsModal } from "./syntitan-UI/mcp-settings";

/* =========================================================
 *  Syntitan Prototype – Upload Flow
 *  - LNB (expanded / collapsed)
 *  - Empty state → Upload modal → Toast
 *  - Design tokens: ./tokens.jsx
 * ========================================================= */

// Token-driven palette (DS와 동기화)
const C = {
  white: T.white,
  bg: T.white,
  text: T.gray990,         // #171719
  textSub: T.gray800,      // #7B7E85
  textMute: T.gray700,     // #8F9298
  border: T.gray200,       // #E6E7E9
  borderLight: T.gray100,  // #F0F0F2
  hover: T.gray50,         // #F7F7F8
  selected: T.gray100,
  primary: T.gray990,
  blue: T.blue500,         // #2B7FFF
  blueLight: T.blue50,     // #EFF6FF
  red: T.red600,
  popoverBg: T.gray990,
  popoverText: T.white,
  popoverSub: T.gray500,
  popoverHover: "rgba(255,255,255,0.08)",
  popoverDivider: "rgba(255,255,255,0.12)",
};

const FONT = "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* ========== ICONS ========== */
const Icon = {
  Toggle: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  ),
  Home: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Database: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  ),
  AgentAnalysis: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="8,4 13,12 3,12" />
      <circle cx="17" cy="8" r="3" />
      <circle cx="11" cy="18" r="2.5" />
    </svg>
  ),
  Users: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3.5" />
      <circle cx="17.5" cy="10" r="2.5" />
      <path d="M2.5 19v-1.2A4 4 0 0 1 6.5 14h5a4 4 0 0 1 4 3.8V19" />
      <path d="M16 19v-1a3 3 0 0 1 2.7-3l1.3-.1a2.5 2.5 0 0 1 2.5 2.5V19" />
    </svg>
  ),
  ReportHub: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <line x1="8" y1="17" x2="8" y2="11" />
      <line x1="12" y1="17" x2="12" y2="7" />
      <line x1="16" y1="17" x2="16" y2="13" />
    </svg>
  ),
  Upload: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  File: ({ size = 16, color = "#16A34A" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(22, 163, 74, 0.12)" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Close: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowOut: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  ChevronRight: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Plus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCircle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#16A34A">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l3 3 5-6" stroke="#FFF" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  XCircle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#DC2626">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  Sparkle: ({ size = 14, color = "#7C3AED" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z" />
    </svg>
  ),
};

/* ========== Sidebar / LNB ========== */
function Sidebar({ collapsed, onToggle, activeKey, onSelect, profileOpen, onProfileToggle, profileRef, onAudit, onSettings }) {
  const NAV_HOME = { key: "home", label: "Home", Icon: Icon.Home };
  const NAV_WORKSPACE = [
    { key: "edit_dataset",   label: "Edit Dataset",     Icon: Icon.Database },
    { key: "agent_analysis", label: "Agent Analysis",   Icon: Icon.AgentAnalysis },
    { key: "discussion",     label: "Discussion Room",  Icon: Icon.Users },
  ];
  const NAV_ANALYZE = [
    { key: "report_hub", label: "Report Hub", Icon: Icon.ReportHub },
  ];

  const sidebarWidth = collapsed ? 56 : 248;

  const navItem = (item) => {
    const active = activeKey === item.key;
    const base = {
      display: "flex", alignItems: "center", gap: 10,
      padding: collapsed ? "9px 0" : "9px 12px",
      borderRadius: 8,
      cursor: "pointer",
      color: active ? C.text : C.textSub,
      background: active ? C.selected : "transparent",
      fontSize: 13.5, fontWeight: active ? 600 : 500,
      transition: "background 0.15s",
      justifyContent: collapsed ? "center" : "flex-start",
      width: collapsed ? 36 : "100%",
      margin: collapsed ? "0 auto" : 0,
      boxSizing: "border-box",
    };
    return (
      <div key={item.key} style={base} onClick={() => onSelect(item.key)}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = C.hover; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
        <span style={{ display: "inline-flex", color: active ? C.text : C.textSub }}>
          <item.Icon size={collapsed ? 19 : 18} />
        </span>
        {!collapsed && <span>{item.label}</span>}
      </div>
    );
  };

  return (
    <div style={{
      width: sidebarWidth, height: "100%",
      background: C.white,
      borderRight: `1px solid ${C.borderLight}`,
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.2s",
      position: "relative",
      fontFamily: FONT,
    }}>
      {/* Header: Brand + toggle */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: collapsed ? "16px 0" : "16px 18px",
        justifyContent: collapsed ? "center" : "space-between",
      }}>
        {!collapsed && <div style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: "-0.2px" }}>SynTitan</div>}
        <button onClick={onToggle} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, padding: 0,
          background: "transparent", border: "none", cursor: "pointer",
          color: C.textSub, borderRadius: 6,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          aria-label="Toggle sidebar">
          <Icon.Toggle size={18} />
        </button>
      </div>

      {/* Nav body */}
      <div style={{ flex: 1, overflowY: "auto", padding: collapsed ? "4px 0" : "4px 12px" }}>
        {/* Home (no section header) */}
        {navItem(NAV_HOME)}

        {/* Workspace section */}
        <div style={{ height: 14 }} />
        {!collapsed && <div style={{ fontSize: 11, color: C.textMute, padding: "0 12px", marginBottom: 6, letterSpacing: 0.2 }}>Workspace</div>}
        {NAV_WORKSPACE.map(navItem)}

        {/* Analyze section */}
        <div style={{ height: 14 }} />
        {!collapsed && <div style={{ fontSize: 11, color: C.textMute, padding: "0 12px", marginBottom: 6, letterSpacing: 0.2 }}>Analyze</div>}
        {NAV_ANALYZE.map(navItem)}
      </div>

      {/* Plan card (expanded only) */}
      {!collapsed && (
        <div style={{ padding: "0 12px 10px" }}>
          <div style={{
            background: C.white,
            border: `1px solid ${C.borderLight}`,
            borderRadius: 12,
            padding: "10px 12px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, #6FA8FF 0%, #C5DEFF 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: C.white, letterSpacing: 0.2,
                fontStyle: "italic",
              }}>Basic</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 9.5, color: C.textMute, lineHeight: 1.2 }}>Current plan</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Basic</div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 9.5, color: C.textMute }}>Credits</div>
                <div style={{ fontSize: 10, color: C.text }}>
                  <span style={{ fontWeight: 700 }}>50,000</span>
                  <span style={{ color: C.textMute }}>/600,000</span>
                </div>
              </div>
              <div style={{ height: 4, background: C.borderLight, borderRadius: 999 }}>
                <div style={{ width: `${(50000 / 600000) * 100}%`, height: "100%", background: C.text, borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile button */}
      <div ref={profileRef} style={{
        position: "relative",
        padding: collapsed ? "10px 0 14px" : "0 12px 14px",
      }}>
        <button onClick={onProfileToggle} style={{
          width: collapsed ? 32 : "100%",
          margin: collapsed ? "0 auto" : 0,
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? 0 : "8px 10px",
          background: "transparent",
          border: collapsed ? "none" : `1px solid ${C.borderLight}`,
          borderRadius: collapsed ? "50%" : 999,
          cursor: "pointer",
          fontFamily: FONT,
        }}
          onMouseEnter={(e) => { if (!collapsed) e.currentTarget.style.background = C.hover; }}
          onMouseLeave={(e) => { if (!collapsed) e.currentTarget.style.background = "transparent"; }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "#3B3D42", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
            }}>A</div>
            {!collapsed && <span style={{ fontSize: 12.5, color: C.text, fontWeight: 600 }}>Cubig Kim</span>}
          </div>
          {!collapsed && <span style={{ color: C.textMute }}><Icon.ChevronRight size={14} /></span>}
        </button>

        {profileOpen && (
          <ProfilePopover collapsed={collapsed} onAudit={onAudit} onSettings={onSettings} />
        )}
      </div>
    </div>
  );
}

function ProfilePopover({ collapsed, onAudit, onSettings }) {
  const itemStyle = {
    padding: "8px 14px",
    fontSize: 12.5,
    color: C.popoverText,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
  };
  const onHover = (e) => { e.currentTarget.style.background = C.popoverHover; };
  const onLeave = (e) => { e.currentTarget.style.background = "transparent"; };

  return (
    <div style={{
      position: "absolute",
      bottom: 8,
      left: collapsed ? "calc(100% + 8px)" : "calc(100% + 8px)",
      width: 230,
      background: C.popoverBg,
      borderRadius: 12,
      padding: "12px 0 6px",
      boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
      fontFamily: FONT,
      zIndex: 50,
    }}>
      <div style={{ padding: "0 14px 10px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.popoverText, lineHeight: 1.3 }}>Cubig Kim</div>
        <div style={{ fontSize: 11.5, color: C.popoverSub, marginTop: 2 }}>email@company.com</div>
      </div>
      <div style={{ padding: "0 12px 8px" }}>
        <button
          onClick={onSettings}
          style={{
            width: "100%", padding: "7px 0",
            background: "rgba(255,255,255,0.06)", color: C.popoverText, border: "none",
            borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}
        >Settings</button>
      </div>
      <div style={itemStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>Members</div>
      <div style={itemStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>Pricing</div>
      <div
        style={itemStyle}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onAudit}
      >Audit log</div>
      <div style={{ ...itemStyle, borderBottom: `1px solid ${C.popoverDivider}`, paddingBottom: 10, marginBottom: 4 }} onMouseEnter={onHover} onMouseLeave={onLeave}>
        <span>Term &amp; policies</span>
        <span style={{ color: C.popoverSub }}><Icon.ArrowOut size={11} /></span>
      </div>
      <div style={itemStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>Log out</div>
    </div>
  );
}

/* ========== Datasets list (배경 화면 — 업로드 완료 후) ========== */
function DatasetsList({ datasets, onUploadClick, onSelectDataset, onBulkDelete }) {
  const [selected, setSelected] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleAll = () => {
    if (selected.size === datasets.length) setSelected(new Set());
    else setSelected(new Set(datasets.map((d) => d.id)));
  };
  const toggleRow = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const allChecked = datasets.length > 0 && selected.size === datasets.length;
  const someChecked = selected.size > 0 && selected.size < datasets.length;
  const hasSelection = selected.size > 0;

  const counts = datasets.reduce((acc, d) => {
    if (d.readiness >= 90) acc.aiReady++;
    else if (d.readiness >= 40) acc.caution++;
    else acc.critical++;
    return acc;
  }, { aiReady: 0, caution: 0, critical: 0 });

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "28px 32px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: "-0.3px" }}>Datasets</div>
          <div style={{ fontSize: 12, color: C.textSub, fontFamily: FONT, marginTop: 4 }}>Upload your dataset to diagnose AI Readiness and optimize data gaps.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <StatusCount color="#16A34A" label="AI Ready"  range="≥90%"   count={counts.aiReady} />
          <StatusCount color="#D9A300" label="Caution"   range="40-89%" count={counts.caution} />
          <StatusCount color={C.red}    label="Critical"  range="0-39%"  count={counts.critical} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ flex: 1, maxWidth: 320, position: "relative" }}>
          <input placeholder="Search" style={{
            width: "100%", padding: "9px 14px 9px 36px",
            border: `1px solid ${C.border}`, borderRadius: 10,
            fontSize: 13, fontFamily: FONT, color: C.text, outline: "none", background: C.white,
          }} />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMute }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {selected.size > 0 && (
            <button onClick={() => setConfirmOpen(true)} style={{
              padding: "9px 14px", background: C.white, color: C.red,
              border: `1px solid ${C.red}`, borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
              {selected.size}개 삭제
            </button>
          )}
          <button onClick={onUploadClick} style={{
            padding: "9px 14px", background: C.text, color: C.white,
            border: "none", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: FONT,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon.Plus size={14} />
            Upload Data
          </button>
        </div>
      </div>

      <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 12, overflow: "hidden", background: C.white }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px minmax(220px, 2.4fr) minmax(160px, 1.6fr) 0.8fr 1fr 0.9fr 0.9fr 32px", padding: "11px 16px", fontSize: 11, fontWeight: 600, color: C.textSub, borderBottom: `1px solid ${C.borderLight}`, alignItems: "center" }}>
          {/* 헤더 체크박스: 선택이 있을 때만 노출 */}
          <div onClick={toggleAll} style={{ visibility: hasSelection ? "visible" : "hidden" }}>
            <CheckBox checked={allChecked} indeterminate={someChecked} />
          </div>
          <div>Dataset</div>
          <div>AI Readiness</div>
          <div>Version</div>
          <div>Owner</div>
          <div>Created</div>
          <div>Updated</div>
          <div></div>
        </div>
        {datasets.map((d) => {
          const isSel = selected.has(d.id);
          const isHover = hoveredId === d.id;
          // 체크박스 노출 조건: 행 호버 OR 본인 선택됨 OR 다른 행에 선택이 있음
          const showCheckbox = isHover || isSel || hasSelection;
          return (
          <div key={d.id}
            onMouseEnter={(e) => { setHoveredId(d.id); if (!isSel) e.currentTarget.style.background = C.hover; }}
            onMouseLeave={(e) => { setHoveredId(null); if (!isSel) e.currentTarget.style.background = "transparent"; }}
            onClick={(e) => {
              if (e.target.closest("[data-checkbox]")) return;
              onSelectDataset && onSelectDataset(d);
            }}
            style={{ display: "grid", gridTemplateColumns: "32px minmax(220px, 2.4fr) minmax(160px, 1.6fr) 0.8fr 1fr 0.9fr 0.9fr 32px", padding: "12px 16px", fontSize: 12, color: C.text, borderBottom: `1px solid ${C.borderLight}`, alignItems: "center", cursor: onSelectDataset ? "pointer" : "default", background: isSel ? "#F5FAFF" : "transparent" }}>
            <div data-checkbox onClick={(e) => { e.stopPropagation(); toggleRow(d.id); }} style={{ visibility: showCheckbox ? "visible" : "hidden" }}>
              <CheckBox checked={isSel} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: C.borderLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon.Database size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                <div style={{ fontSize: 10.5, color: C.textMute, marginTop: 1 }}>{d.size} · {d.cols} columns · {d.rows} rows</div>
              </div>
            </div>
            <ReadinessBar value={d.readiness} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontWeight: 600 }}>v1</span>
              {d.changes ? <span style={{ fontSize: 10, padding: "1.5px 6px", border: `1px solid ${C.border}`, borderRadius: 4, color: C.textSub }}>{d.changes} changes</span> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#3B3D42", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{d.ownerInitial || "A"}</div>
              <span>{d.owner}</span>
            </div>
            <DatePill text={d.created} />
            <DatePill text={d.updated} />
            <div style={{ color: C.textMute, textAlign: "center" }}>⋮</div>
          </div>
          );
        })}
      </div>

      {confirmOpen && (
        <BulkDeleteDialog
          count={selected.size}
          onConfirm={() => {
            onBulkDelete && onBulkDelete([...selected]);
            setSelected(new Set());
            setConfirmOpen(false);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}

function CheckBox({ checked, indeterminate }) {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: 4,
      border: `1.5px solid ${checked || indeterminate ? C.blue : C.border}`,
      background: checked || indeterminate ? C.blue : C.white,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0, boxSizing: "border-box",
    }}>
      {indeterminate ? (
        <svg width="10" height="10" viewBox="0 0 12 12"><line x1="2" y1="6" x2="10" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
      ) : checked ? (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6.5 5 9 10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : null}
    </span>
  );
}

function BulkDeleteDialog({ count, onConfirm, onCancel }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,23,25,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
      <div style={{ width: "min(420px, 92%)", background: C.white, borderRadius: 16, padding: "20px 22px", boxShadow: "0 24px 48px rgba(0,0,0,0.16)", fontFamily: FONT }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{count}개 데이터셋 삭제</div>
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.55, marginBottom: 16 }}>
          선택한 {count}개의 데이터셋이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "7px 14px", background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "7px 14px", background: C.red, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>삭제</button>
        </div>
      </div>
    </div>
  );
}

function StatusCount({ color, label, range, count }) {
  return (
    <div style={{ minWidth: 120, padding: "10px 12px", border: `1px solid ${C.borderLight}`, borderRadius: 10, background: C.white }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: C.textSub, marginBottom: 6, fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
          <span style={{ color: C.text, fontWeight: 600 }}>{label}</span>
        </div>
        <span>{range}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FONT }}>{count}</div>
    </div>
  );
}

function ReadinessBar({ value }) {
  let color = C.red;
  if (value >= 90) color = "#16A34A";
  else if (value >= 40) color = "#D9A300";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: C.borderLight, borderRadius: 999, maxWidth: 130 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{value}%</span>
    </div>
  );
}

function DatePill({ text }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textSub }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      {text}
    </div>
  );
}

/* ========== Data Profiling Modal ========== */
function DataProfilingModal({ datasets, activeIdx, onSelect, onClose }) {
  const d = datasets[activeIdx];
  if (!d) return null;
  const dims = d.dims || [];
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,23,25,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 35, padding: 20 }}>
      <div style={{ width: "min(900px, 96%)", maxHeight: "calc(100% - 24px)", background: C.white, borderRadius: 16, boxShadow: "0 28px 56px rgba(0,0,0,0.18)", display: "flex", flexDirection: "row", overflow: "hidden", fontFamily: FONT }}>
        {/* Left list */}
        <div style={{ width: 180, borderRight: `1px solid ${C.borderLight}`, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 4, background: C.hover }}>
          <button onClick={onClose} style={{ alignSelf: "flex-start", background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4, marginBottom: 6 }}>
            <Icon.Close size={16} />
          </button>
          {datasets.map((it, i) => (
            <div key={i} onClick={() => onSelect(i)} style={{
              padding: "8px 10px", borderRadius: 8, fontSize: 12, fontWeight: i === activeIdx ? 700 : 500,
              color: i === activeIdx ? C.text : C.textSub,
              background: i === activeIdx ? C.white : "transparent",
              border: i === activeIdx ? `1px solid ${C.borderLight}` : "1px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{it.name}</div>
          ))}
        </div>

        {/* Right body */}
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>Data Profiling</div>
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 14, lineHeight: 1.55 }}>
            AI analyzes your data to assess its current state and evaluate whether it meets the 'AI Ready' standard for model training.
          </div>

          {/* Dataset card + purpose */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "12px 14px", border: `1px solid ${C.borderLight}`, borderRadius: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: C.borderLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon.Database size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                <div style={{ fontSize: 10.5, color: C.textMute, marginTop: 1 }}>{d.size} · {d.cols} columns · {d.rows} rows</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2, lineHeight: 1.4 }}>{d.purpose || "—"}</div>
              <div style={{ fontSize: 10.5, color: C.textMute }}>Data purpose</div>
            </div>
          </div>

          {/* AI Readiness header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>AI Readiness</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{d.readiness}%</div>
              {d.readiness >= 90 && (
                <div style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999 }}>AI Ready</div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, alignItems: "center", marginBottom: 14 }}>
            {/* Score bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dims.map((dim) => (
                <div key={dim.label} style={{ display: "grid", gridTemplateColumns: "120px 1fr 30px", gap: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 11.5, color: C.text }}>{dim.label}</div>
                  <div style={{ height: 5, background: C.borderLight, borderRadius: 999 }}>
                    <div style={{ width: `${dim.value}%`, height: "100%", background: dim.value < 20 ? "#FFA2A2" : dim.value < 60 ? "#FFD466" : "#16A34A", borderRadius: 999 }} />
                  </div>
                  <div style={{ fontSize: 11, color: C.text, textAlign: "right" }}>{dim.value}%</div>
                </div>
              ))}
            </div>
            {/* Radar */}
            <RadarChart dims={dims} />
          </div>

          {/* Analysis result banner */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#F0FDF4", border: `1px solid #DCFCE7`, borderRadius: 10, marginBottom: 8 }}>
            <Icon.CheckCircle size={16} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>AI analysis results</div>
              <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.55 }}>
                The AI Readiness of the data is generally good, but all three items are at a critically low level of just 10%.
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: C.textMute, textAlign: "right" }}>*Detailed information is available in the AI Readiness tab.</div>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ dims }) {
  // 6-axis radar (hexagon). Order matters: Privacy(top) → Traceability → Operational Reliability → Conciseness → Contextuality → Integrity
  const order = ["Privacy", "Traceability", "Operational Reliability", "Conciseness", "Contextuality", "Integrity"];
  const ordered = order.map((label) => dims.find((d) => d.label === label) || { label, value: 0 });
  const cx = 100, cy = 100, R = 72;
  const angleFor = (i) => -Math.PI / 2 + (i * Math.PI * 2) / 6;
  const point = (val, i) => {
    const r = (R * val) / 100;
    const a = angleFor(i);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const polyPoints = ordered.map((d, i) => point(d.value, i).join(",")).join(" ");
  const labelPoint = (i, off = 14) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * (R + off), cy + Math.sin(a) * (R + off)];
  };
  const gridLevels = [0.25, 0.5, 0.75, 1].map((s) => ordered.map((_, i) => point(100 * s, i).join(",")).join(" "));

  return (
    <div style={{ position: "relative", width: 220, height: 200, margin: "0 auto" }}>
      <svg width="220" height="200" viewBox="0 0 200 200" aria-hidden="true">
        {gridLevels.map((p, i) => (
          <polygon key={i} points={p} fill="none" stroke="#E6E7E9" strokeWidth="0.6" strokeDasharray={i < 3 ? "2 2" : "0"} />
        ))}
        {ordered.map((_, i) => {
          const [x, y] = point(100, i);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E6E7E9" strokeWidth="0.5" />;
        })}
        <polygon points={polyPoints} fill="rgba(34,197,94,0.18)" stroke="#16A34A" strokeWidth="1.2" />
        {ordered.map((d, i) => {
          const [px, py] = point(d.value, i);
          return <circle key={i} cx={px} cy={py} r="2" fill="#16A34A" />;
        })}
      </svg>
      {/* Axis labels */}
      {ordered.map((d, i) => {
        const [lx, ly] = labelPoint(i, 0);
        // Adjust offset relative to direction
        const a = angleFor(i);
        const dx = Math.cos(a) * 18;
        const dy = Math.sin(a) * 18;
        return (
          <div key={d.label} style={{
            position: "absolute",
            left: `${lx + dx - 50}px`,
            top: `${ly + dy - 7}px`,
            width: 100, textAlign: "center",
            fontSize: 9.5, color: C.textSub, fontFamily: FONT,
            pointerEvents: "none",
          }}>{d.label}</div>
        );
      })}
    </div>
  );
}

/* ========== Audit Log Panel (프로필 팝오버 → Audit log) ========== */
const AUDIT_CATEGORIES = ["Authentication", "Permissions", "Dataset", "Agent", "Report"];

const CATEGORY_STYLES = {
  Authentication: { bg: "#F0F0F2", color: "#525459", icon: "auth" },
  Permissions:    { bg: "#F0F0F2", color: "#525459", icon: "person" },
  Dataset:        { bg: "#DBEAFE", color: "#155DFC", icon: "db" },
  Agent:          { bg: "#EFEBFF", color: "#7A65D0", icon: "agent" },
  Report:         { bg: "#DCFCE7", color: "#16A34A", icon: "report" },
};

const SAMPLE_USERS = [
  { name: "Mina", email: "Mina@cubig.ai", me: true },
  { name: "Mina", email: "Mina@cubig.ai" },
  { name: "Mina", email: "Mina@cubig.ai" },
  { name: "Mina", email: "Mina@cubig.ai" },
  { name: "Mina", email: "Mina@cubig.ai" },
  { name: "Mina", email: "Mina@cubig.ai" },
  { name: "Mina", email: "Mina@cubig.ai" },
];

const AUDIT_ROWS = [
  { dt: "2026-04-06\n14:23:05", category: "Authentication", event: "로그인 성공",        resource: "-",                                    result: "Success", who: "김민수", detail: null },
  { dt: "2026-04-06\n14:23:05", category: "Authentication", event: "로그인 실패",        resource: "-",                                    result: "Failure", who: "김민수", detail: null },
  { dt: "2026-04-06\n14:23:05", category: "Permissions",    event: "사용자 제거",       resource: "formeruser@company.com",                result: "Success", who: "김민수", detail: null },
  { dt: "2026-04-06\n14:23:05", category: "Permissions",    event: "역할 변경",          resource: { kind: "user", initial: "J", color: "#16A34A", name: "박지영" }, result: "Success", who: "김민수", detail: null },
  { dt: "2026-04-06\n14:23:05", category: "Dataset",        event: "데이터셋 권한 변경", resource: "고객_이탈_2024Q4",                       result: "Success", who: "김민수", detail: null },
  { dt: "2026-04-06\n14:23:05", category: "Dataset",        event: "전처리",             resource: "고객_이탈_2024Q4고객_이탈_2024Q4",      result: "Failure", who: "김민수", detail: {
    "Module": "Outlier, Distribution & Category Refinement",
    "Content": "컬럼 '과금액' 데이터 타입 불일치",
    "Snapshot Hash": "a3f8c2da3f8c2da3f8c2da3f8c2da3f8c2d",
    "IP": "10.0.1.10",
  }},
  { dt: "2026-04-06\n14:23:05", category: "Agent",          event: "에이전트 실행 시작", resource: "고객_이탈_2024Q4",                       result: "Success", who: "김민수", detail: null },
  { dt: "2026-04-06\n14:23:05", category: "Report",         event: "리포트 조회",         resource: "고객_이탈_2024Q4",                       result: "Success", who: "김민수", detail: null },
];

function AuditCategoryBadge({ name }) {
  const s = CATEGORY_STYLES[name] || { bg: "#F0F0F2", color: "#525459" };
  const iconNode = (() => {
    if (s.icon === "auth") return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
    );
    if (s.icon === "person") return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
    );
    if (s.icon === "db") return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></svg>
    );
    if (s.icon === "agent") return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="8,4 13,12 3,12"/><circle cx="17" cy="8" r="3"/><circle cx="11" cy="18" r="2.5"/></svg>
    );
    if (s.icon === "report") return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    );
    return null;
  })();
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, fontFamily: FONT,
    }}>
      {iconNode}
      {name}
    </span>
  );
}

function AuditResultPill({ result }) {
  const ok = result === "Success";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      border: `1px solid ${C.border}`,
      background: C.white,
      color: C.textSub,
      fontSize: 11, fontFamily: FONT,
    }}>
      {ok ? null : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      )}
      {result}
    </span>
  );
}

function AuditDropdown({ label, open, onToggle, children }) {
  return (
    <div style={{ position: "relative" }}>
      <button onClick={onToggle} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 8,
        background: C.white, color: C.text, fontSize: 12.5, fontWeight: 500,
        fontFamily: FONT, cursor: "pointer",
      }}>
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 10,
          minWidth: 160, background: C.white,
          border: `1px solid ${C.border}`, borderRadius: 10,
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          padding: "6px 0",
          fontFamily: FONT,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function AuditLogPanel() {
  const [openDrop, setOpenDrop] = useState(null); // 'category' | 'updatedBy' | 'date'
  const [expanded, setExpanded] = useState(null);

  const toggleDrop = (k) => setOpenDrop(openDrop === k ? null : k);

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "28px 32px", boxSizing: "border-box", fontFamily: FONT }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.3px" }}>
            Audit log
            <span style={{ color: C.textMute }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 4 }}>Track all activity across your organization in chronological order.</div>
        </div>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "9px 14px", border: "none", borderRadius: 10,
          background: C.text, color: C.white,
          fontSize: 12.5, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Export CSV
        </button>
      </div>

      {/* Filters + search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8 }} onMouseLeave={() => setOpenDrop(null)}>
          <AuditDropdown label="Category" open={openDrop === "category"} onToggle={() => toggleDrop("category")}>
            {AUDIT_CATEGORIES.map((c) => (
              <div key={c} style={{ padding: "8px 16px", fontSize: 13, color: C.text, cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                {c}
              </div>
            ))}
          </AuditDropdown>

          <AuditDropdown label="Updated by" open={openDrop === "updatedBy"} onToggle={() => toggleDrop("updatedBy")}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.borderLight}` }}>
              <div style={{ position: "relative" }}>
                <input placeholder="Search" style={{
                  width: "100%", padding: "7px 10px 7px 32px", border: `1px solid ${C.border}`,
                  borderRadius: 8, fontSize: 12, fontFamily: FONT, color: C.text, outline: "none", boxSizing: "border-box",
                }} />
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMute }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.textMute, marginTop: 6 }}>0 selected</div>
            </div>
            <div style={{ maxHeight: 230, overflowY: "auto" }}>
              {SAMPLE_USERS.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.borderLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.textMute }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: C.text }}>{u.name}{u.me && <span style={{ color: C.textMute, fontWeight: 400 }}> (me)</span>}</div>
                    <div style={{ fontSize: 10.5, color: C.textMute }}>{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </AuditDropdown>

          <AuditDropdown label="Date Range" open={openDrop === "date"} onToggle={() => toggleDrop("date")}>
            {["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "Custom range"].map((d) => (
              <div key={d} style={{ padding: "8px 16px", fontSize: 13, color: C.text, cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                {d}
              </div>
            ))}
          </AuditDropdown>
        </div>

        <div style={{ position: "relative", maxWidth: 320, width: "100%" }}>
          <input placeholder="Search" style={{
            width: "100%", padding: "9px 14px 9px 36px",
            border: `1px solid ${C.border}`, borderRadius: 10,
            fontSize: 13, fontFamily: FONT, color: C.text, outline: "none", background: C.white, boxSizing: "border-box",
          }} />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMute }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 12, overflow: "hidden", background: C.white }}>
        <div style={{ display: "grid", gridTemplateColumns: "150px 160px 1fr 1.4fr 110px 1fr 36px", padding: "11px 16px", fontSize: 11.5, fontWeight: 600, color: C.textSub, borderBottom: `1px solid ${C.borderLight}` }}>
          <div>Date and time</div>
          <div>Category</div>
          <div>Event</div>
          <div>Updated resources</div>
          <div>Result</div>
          <div>Updated by</div>
          <div></div>
        </div>
        {AUDIT_ROWS.map((r, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} style={{ borderBottom: i < AUDIT_ROWS.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "150px 160px 1fr 1.4fr 110px 1fr 36px", padding: "12px 16px", fontSize: 12, color: C.text, alignItems: "center" }}>
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.45, color: C.textSub, fontSize: 11.5 }}>{r.dt}</div>
                <div><AuditCategoryBadge name={r.category} /></div>
                <div>{r.event}</div>
                <div>
                  {typeof r.resource === "string" ? r.resource : (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: r.resource.color, color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{r.resource.initial}</span>
                      {r.resource.name}
                    </div>
                  )}
                </div>
                <div><AuditResultPill result={r.result} /></div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#3B3D42", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>A</span>
                  {r.who}
                </div>
                <div style={{ textAlign: "right", color: C.textMute, cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : i)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              {isOpen && r.detail && (
                <div style={{ padding: "10px 16px 14px 16px", background: C.hover, borderTop: `1px solid ${C.borderLight}` }}>
                  {Object.entries(r.detail).map(([k, v]) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: "150px 1fr", padding: "5px 0", fontSize: 12 }}>
                      <div style={{ color: C.textSub }}>{k}</div>
                      <div style={{ color: C.text }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========== Dataset Detail (행 클릭 → 디테일 페이지) ========== */
function DatasetDetail({ dataset, onBack }) {
  const [tab, setTab] = useState("readiness"); // 'readiness' | 'detail'
  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", boxSizing: "border-box", fontFamily: FONT, background: C.white }}>
      {/* Top bar — breadcrumb + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${C.borderLight}`, position: "sticky", top: 0, background: C.white, zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.textSub }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 0, fontSize: 12.5, fontFamily: FONT }}>Datasets</button>
          <span>›</span>
          <span style={{ color: C.text, fontWeight: 600 }}>{dataset.name}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["History", "Share", "Reload"].map((b, i) => (
            <button key={b} style={{
              padding: "6px 12px",
              border: `1px solid ${C.border}`,
              borderRadius: 8, background: i === 2 ? C.text : C.white, color: i === 2 ? C.white : C.text,
              fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
            }}>{b}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 28px 0", borderBottom: `1px solid ${C.borderLight}` }}>
        <div style={{ display: "flex", gap: 18 }}>
          {[
            { k: "readiness", l: "AI Readiness" },
            { k: "detail",    l: "Detail" },
          ].map((t) => {
            const active = tab === t.k;
            return (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                padding: "10px 0",
                border: "none", background: "transparent",
                borderBottom: active ? `2px solid ${C.text}` : "2px solid transparent",
                color: active ? C.text : C.textSub,
                fontSize: 13.5, fontWeight: active ? 700 : 500, fontFamily: FONT, cursor: "pointer",
              }}>{t.l}</button>
            );
          })}
        </div>
        {tab === "readiness" && (
          <button style={{
            padding: "8px 14px", background: C.text, color: C.white,
            border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
            fontFamily: FONT, cursor: "pointer", marginBottom: 8,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon.Sparkle size={12} color="#fff" />
            Get AI Ready
          </button>
        )}
      </div>

      {/* Body */}
      {tab === "readiness" ? (
        <ReadinessTab dataset={dataset} />
      ) : (
        <DetailTab dataset={dataset} />
      )}
    </div>
  );
}

function ReadinessTab({ dataset }) {
  const dims = dataset.dims || [];
  const SECTIONS = [
    {
      key: "privacy",     title: "Privacy",                 score: 100,
      desc: "4 sensitive columns detected and processed",
      list: ["Full Name", "Phone Number", "National ID", "Passport Number", "Email Address", "Bank Account Number", "Credit Card Number"],
      tags: ["가명화", "가명화", "가명화", "가명화", "가명화", "가명화", "가명화"],
    },
    {
      key: "integrity",   title: "Integrity",               score: 90,
      desc: "Data quality issues detected.",
      list: ["Duplicate Records", "Format Errors", "Distribution Issues"],
      tags: ["N cases", "N cases", "N cases"],
      footer: "Recommended in AI Readiness Actions: Missing Pattern Imputation, Outlier & Skew Correction",
    },
    {
      key: "contextuality", title: "Contextuality",         score: 80,
      desc: "N columns lack descriptions.",
      list: ["Column Description Coverage", "Columns Missing for Context"],
      tags: ["N%", "N cases"],
      footer: "Recommended in AI Readiness Actions: Document Augmentation",
    },
    {
      key: "conciseness", title: "Conciseness",             score: 99,
      desc: "Low signal columns detected.",
      list: ["Low Cardinality Columns", "High Cardinality Columns", "Redundant Test Fields"],
      tags: ["N cases", "N cases", "N cases"],
      footer: "Recommended in AI Readiness Actions: Multicollinearity Reduction",
    },
    {
      key: "operational", title: "Operational Reliability", score: 100,
      desc: "Whether dataset is being managed in a reliable and consistent state.",
      list: [],
      tags: [],
      grid: [
        ["Patterns Provided Features", ""],
        ["✓ AI Readiness Actions", "✓ AI Readiness Achievement Tracking"],
        ["✓ Snapshot Consistency", ""],
      ],
    },
    {
      key: "traceability", title: "Traceability",           score: 100,
      desc: "All changes are being recorded and are fully traceable.",
      list: [],
      tags: [],
      grid: [
        ["Patterns Provided Features", ""],
        ["✓ User Snapshot Histories", "✓ Release Version Labeling"],
        ["✓ Audit Log",                ""],
      ],
    },
  ];
  return (
    <div style={{ padding: "20px 28px" }}>
      {/* Top: AI Readiness summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>AI Readiness</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{dataset.readiness}%</div>
          {dataset.readiness >= 90 && (
            <div style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999 }}>AI Ready</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dims.map((dim) => (
            <div key={dim.label} style={{ display: "grid", gridTemplateColumns: "150px 1fr 36px", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 12, color: C.text }}>{dim.label}</div>
              <div style={{ height: 6, background: C.borderLight, borderRadius: 999 }}>
                <div style={{ width: `${dim.value}%`, height: "100%", background: dim.value < 20 ? "#FFA2A2" : dim.value < 60 ? "#FFD466" : "#16A34A", borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 11, color: C.text, textAlign: "right" }}>{dim.value}%</div>
            </div>
          ))}
        </div>
        <RadarChart dims={dims} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "#F0FDF4", border: `1px solid #DCFCE7`, borderRadius: 10, marginBottom: 24 }}>
        <Icon.CheckCircle size={16} />
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.55 }}>
          <span style={{ fontWeight: 700, color: C.text }}>AI analysis results</span>
          <span style={{ marginLeft: 8 }}>The AI Readiness of the data is generally good, but all three items are at a critically low level of just 10%.</span>
        </div>
      </div>

      {/* Detail sections grid (6 cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {SECTIONS.map((s) => (
          <ReadinessCard key={s.key} {...s} />
        ))}
      </div>
    </div>
  );
}

function ReadinessCard({ title, score, desc, list, tags, footer, grid }) {
  return (
    <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: "14px 16px", background: C.white }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</span>
          <span style={{ color: C.textMute, fontSize: 11 }}>ⓘ</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: score >= 90 ? "#16A34A" : score >= 60 ? "#D9A300" : "#DC2626" }}>{score}%</div>
      </div>
      <div style={{ fontSize: 11.5, color: C.textSub, marginBottom: 10, lineHeight: 1.5 }}>{desc}</div>

      {grid && (
        <div>
          {grid.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "5px 0", fontSize: 11.5, color: C.text, borderTop: ri === 0 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ color: ri === 0 ? C.textSub : C.text, fontWeight: ri === 0 ? 600 : 500 }}>{row[0]}</div>
              <div>{row[1]}</div>
            </div>
          ))}
        </div>
      )}

      {!!(list && list.length) && (
        <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 8 }}>
          {list.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "4px 0", fontSize: 11.5, color: C.text }}>
              <div>{item}</div>
              <div style={{ color: C.textSub }}>{tags[i] || ""}</div>
            </div>
          ))}
        </div>
      )}

      {footer && (
        <div style={{ marginTop: 8, padding: "6px 8px", background: C.hover, borderRadius: 6, fontSize: 10.5, color: C.textSub, lineHeight: 1.45 }}>{footer}</div>
      )}
    </div>
  );
}

function DetailTab({ dataset }) {
  // 미니 히스토그램 + 데이터 테이블
  const COLUMNS = [
    { name: "customer_name", chart: [3,5,7,4,6,4] },
    { name: "time_zone",     chart: [4,5,3,5,6,7] },
    { name: "company_size",  chart: [5,7,4,6,5,8] },
    { name: "devices",       chart: [6,4,5,3,5,4] },
    { name: "signup_date",   chart: [5,6,7,8,7,9] },
    { name: "avg_session_duration", chart: [4,5,4,3,4,5] },
  ];
  const ROWS = Array.from({ length: 14 }, (_, i) => ({
    customer_name: "***",
    time_zone: "UTC + 9",
    company_size: 100 + i * 100,
    devices: "Android",
    signup_date: "2026.12.0" + ((i % 9) + 1),
    avg_session_duration: 5 + (i % 4),
  }));

  return (
    <div style={{ padding: "20px 28px" }}>
      {/* File card */}
      <div style={{ padding: "14px 16px", border: `1px solid ${C.borderLight}`, borderRadius: 12, marginBottom: 14, background: C.white, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>Sample ___voc_data.csv.tar <span style={{ color: C.textMute, fontWeight: 400, fontSize: 11.5 }}>(58.0KB)</span></div>
          <div style={{ fontSize: 11, color: C.textMute, marginTop: 4 }}>Snapshot · 23MB · {dataset.cols} columns · {dataset.rows} rows · Updated Mar 30, 10:41 AM</div>
        </div>
      </div>

      {/* Column header with mini histogram */}
      <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 12, overflow: "hidden", background: C.white }}>
        <div style={{ display: "grid", gridTemplateColumns: `40px repeat(${COLUMNS.length}, minmax(110px, 1fr))`, padding: "8px 8px", background: C.hover, borderBottom: `1px solid ${C.borderLight}` }}>
          <div></div>
          {COLUMNS.map((col) => (
            <div key={col.name} style={{ padding: "4px 8px", fontSize: 11, color: C.textSub, fontWeight: 600 }}>
              {col.name}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `40px repeat(${COLUMNS.length}, minmax(110px, 1fr))`, padding: "6px 8px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div></div>
          {COLUMNS.map((col) => (
            <div key={col.name} style={{ padding: "0 8px" }}>
              <MiniHistogram values={col.chart} />
            </div>
          ))}
        </div>

        {/* Row count */}
        <div style={{ padding: "8px 12px", background: C.hover, borderBottom: `1px solid ${C.borderLight}`, fontSize: 11, color: C.textSub, display: "flex", alignItems: "center", gap: 6 }}>
          <strong style={{ color: C.text, fontSize: 13 }}>8935</strong> total rows
        </div>

        {/* Data rows */}
        {ROWS.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: `40px repeat(${COLUMNS.length}, minmax(110px, 1fr))`, padding: "8px 8px", borderBottom: i < ROWS.length - 1 ? `1px solid ${C.borderLight}` : "none", fontSize: 12, color: C.text }}>
            <div style={{ color: C.textMute, textAlign: "center" }}>{i + 1}</div>
            <div>{r.customer_name}</div>
            <div>{r.time_zone}</div>
            <div>{r.company_size}</div>
            <div>{r.devices}</div>
            <div>{r.signup_date}</div>
            <div>{r.avg_session_duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniHistogram({ values }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24 }}>
      {values.map((v, i) => (
        <div key={i} style={{ width: 6, height: `${(v / max) * 100}%`, background: "#BEDBFF", borderRadius: 1.5 }} />
      ))}
    </div>
  );
}

/* ========== Action Review Dialog (5개 mixed 케이스 통합) ========== */
function ActionReviewDialog({ tasks, onChangeTask, onConfirm, onCancel }) {
  const summary = (() => {
    let newCount = 0, existingMerges = 0;
    tasks.forEach((t) => {
      if (t.mode === "union-new") newCount += 1;
      else if (t.mode === "union-existing") existingMerges += 1;
      else if (t.mode === "standard") newCount += t.files.length;
    });
    return { newCount, existingMerges };
  })();

  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "rgba(23,23,25,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ width: "min(640px, 96%)", maxHeight: "calc(100% - 32px)", background: C.white, borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,0.16)", fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 22px 6px" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>업로드 처리 방식 확인</div>
            <div style={{ fontSize: 12, color: C.textSub, marginTop: 4, lineHeight: 1.5 }}>자동 분류된 그룹입니다. 필요하면 그룹별로 변경하세요.</div>
          </div>
          <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }}>
            <Icon.Close size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
          {tasks.map((t, idx) => (
            <ActionGroupCard key={idx} task={t} onChange={(next) => onChangeTask(idx, next)} index={idx} />
          ))}
        </div>

        <div style={{ padding: "10px 22px", background: C.hover, borderTop: `1px solid ${C.borderLight}`, fontSize: 11.5, color: C.textSub }}>
          처리 결과 미리보기: <span style={{ color: C.text, fontWeight: 600 }}>새 데이터셋 {summary.newCount}개 추가</span>
          {summary.existingMerges > 0 && <> · <span style={{ color: C.text, fontWeight: 600 }}>기존 {summary.existingMerges}개에 행 추가</span></>}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
          <button onClick={onCancel} style={{ padding: "8px 14px", background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>뒤로</button>
          <button onClick={onConfirm} style={{ padding: "8px 14px", background: C.text, color: C.white, border: "none", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>업로드 시작</button>
        </div>
      </div>
    </div>
  );
}

function ActionGroupCard({ task, onChange, index }) {
  const isMatchExisting = !!task.target;       // 기존 데이터셋 매칭 그룹
  const isMultiNew      = task.files.length >= 2 && !isMatchExisting; // 새 파일끼리 같은 형식

  // 그룹 라벨
  const headerLabel = isMatchExisting
    ? `Group ${index + 1} — 기존 데이터셋과 매칭 (${task.files.length}개)`
    : isMultiNew
      ? `Group ${index + 1} — 같은 형식 (${task.files.length}개)`
      : task.files.length === 1
        ? `Group ${index + 1} — 단일 업로드`
        : `Group ${index + 1} — 단일 업로드 (${task.files.length}개)`;

  // 통합 목적 노출 여부: union-new/union-existing이거나, standard인데 파일이 1개일 때
  const showSingleInput = task.mode === "union-new" || task.mode === "union-existing" || (task.mode === "standard" && task.files.length === 1);
  // standard + 다중 파일 → 파일별 입력
  const showPerFileInput = task.mode === "standard" && task.files.length >= 2;

  return (
    <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: "12px 14px", background: C.white }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, marginBottom: 4 }}>{headerLabel}</div>
      {isMatchExisting && (
        <div style={{ fontSize: 11.5, color: C.textSub, marginBottom: 8 }}>
          <span style={{ fontWeight: 600, color: C.text }}>"{task.target}"</span> 와 같은 스키마로 감지됨
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {task.files.map((f, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px 3px 6px", border: `1px solid ${C.borderLight}`, borderRadius: 6, fontSize: 11, color: C.text, background: C.hover }}>
            <Icon.File size={11} />
            {f.name}
          </span>
        ))}
      </div>

      {/* 액션 토글 */}
      {isMatchExisting && (
        <RadioRow
          options={[
            { v: "union-existing", label: "기존 Union (행 추가)",  desc: `"${task.target}" 끝에 합쳐짐` },
            { v: "standard",       label: "새 데이터셋으로 분리",   desc: "기존과 별개로 등록" },
          ]}
          value={task.mode}
          onChange={(v) => onChange({ mode: v })}
        />
      )}
      {isMultiNew && (
        <RadioRow
          options={[
            { v: "union-new", label: `Union 단일 데이터셋`,        desc: `${task.files.length}개 파일이 행으로 합쳐짐` },
            { v: "standard",  label: `각각 단일 업로드`,             desc: `${task.files.length}개 데이터셋으로 별개 등록` },
          ]}
          value={task.mode}
          onChange={(v) => onChange({ mode: v })}
        />
      )}

      {/* Union-new 데이터셋 이름 (편집 가능, default는 첫 파일명) */}
      {task.mode === "union-new" && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.borderLight}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            데이터셋 이름 <span style={{ fontWeight: 400, color: C.textMute }}>(자동 생성됨 — 필요 시 변경)</span>
          </div>
          <input
            type="text"
            value={task.name || ""}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={task.files[0]?.name?.replace(/\.[^.]+$/, "") || "Union Dataset"}
            style={{
              width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 8,
              fontSize: 12, color: C.text, fontFamily: FONT, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* 목적 입력 */}
      {showSingleInput && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.borderLight}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>
              {task.mode === "union-existing" ? "통합 Data purpose" : task.mode === "union-new" ? "통합 Data purpose" : "Data purpose"}
            </span>
            <span style={{ color: "#DC2626", fontSize: 11 }}>*</span>
            {task.mode === "union-existing" && task.existingPurpose && (
              <span style={{ fontSize: 10, color: C.textMute }}>(기존 목적과 자동 병합됨)</span>
            )}
          </div>
          {task.mode === "union-existing" && task.existingPurpose && (
            <div style={{ fontSize: 10.5, color: C.textSub, marginBottom: 6, padding: "5px 8px", background: C.hover, borderRadius: 6 }}>
              <strong style={{ color: C.text }}>기존:</strong> {task.existingPurpose}
            </div>
          )}
          <textarea
            value={task.purpose || ""}
            onChange={(e) => onChange({ purpose: e.target.value })}
            rows={2}
            style={{
              width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 8,
              fontSize: 11.5, color: C.text, fontFamily: FONT, outline: "none", resize: "vertical",
              boxSizing: "border-box",
            }}
            placeholder={task.mode === "standard" ? "e.g. Revenue Strategy Analysis by Customer Segment" : "통합 목적을 입력하세요"}
          />
        </div>
      )}

      {showPerFileInput && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.borderLight}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            Data purpose <span style={{ color: "#DC2626" }}>*</span> <span style={{ fontWeight: 400, color: C.textMute }}>(파일별로 입력)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {task.files.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 0.7fr) 1.3fr", gap: 8, alignItems: "center" }}>
                <div style={{ fontSize: 11, color: C.textSub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                <input
                  type="text"
                  value={(task.purposes && task.purposes[i]) || ""}
                  onChange={(e) => {
                    const next = [...(task.purposes || task.files.map(() => ""))];
                    next[i] = e.target.value;
                    onChange({ purposes: next });
                  }}
                  placeholder="이 파일의 목적"
                  style={{
                    width: "100%", padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 8,
                    fontSize: 11.5, color: C.text, fontFamily: FONT, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RadioRow({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {options.map((o) => (
        <label key={o.v} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "8px 10px", border: `1px solid ${value === o.v ? C.blue : C.border}`, borderRadius: 8, background: value === o.v ? "#F5FAFF" : C.white }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${value === o.v ? C.blue : C.border}`, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            {value === o.v && <span style={{ width: 6, height: 6, background: C.blue, borderRadius: "50%" }} />}
          </span>
          <input type="radio" checked={value === o.v} onChange={() => onChange(o.v)} style={{ display: "none" }} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{o.label}</div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{o.desc}</div>
          </div>
        </label>
      ))}
    </div>
  );
}

/* ========== Union dialogs (병합 케이스 — legacy, 사용 안 함) ========== */
// 케이스 A: 새로 올린 파일이 기존 데이터셋과 같은 형식 → "기존 데이터셋에 Union 할래?"
function UnionWithExistingDialog({ matchName, onConfirm, onCancel }) {
  const [choice, setChoice] = useState("union"); // 'union' | 'new'
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,23,25,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 24 }}>
      <div style={{ width: "min(480px, 92%)", background: C.white, borderRadius: 16, padding: "20px 22px", boxShadow: "0 24px 48px rgba(0,0,0,0.16)", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>유사한 데이터셋 발견</div>
          <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }}>
            <Icon.Close size={16} />
          </button>
        </div>
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.55, marginBottom: 14 }}>
          업로드한 파일이 기존 데이터셋 <span style={{ fontWeight: 700, color: C.text }}>"{matchName}"</span> 와 동일한 스키마입니다. 어떻게 처리하시겠습니까?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[
            { v: "union", label: "기존 데이터셋에 Union (행 추가)", desc: `"${matchName}" 끝에 새 행으로 합쳐집니다.` },
            { v: "new",   label: "새 데이터셋으로 분리 업로드",      desc: "기존과 별개의 새 데이터셋으로 등록됩니다." },
          ].map((o) => (
            <label key={o.v} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "8px 10px", border: `1px solid ${choice === o.v ? C.blue : C.border}`, borderRadius: 8, background: choice === o.v ? "#F5FAFF" : C.white }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${choice === o.v ? C.blue : C.border}`, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {choice === o.v && <span style={{ width: 6, height: 6, background: C.blue, borderRadius: "50%" }} />}
              </span>
              <input type="radio" checked={choice === o.v} onChange={() => setChoice(o.v)} style={{ display: "none" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{o.label}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2, lineHeight: 1.4 }}>{o.desc}</div>
              </div>
            </label>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "7px 14px", background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
          <button onClick={() => onConfirm(choice)} style={{ padding: "7px 14px", background: C.text, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>다음</button>
        </div>
      </div>
    </div>
  );
}

// 케이스 B: 방금 올린 파일들끼리 같은 형식 → "이번 N개를 Union 할래?"
function UnionNewFilesDialog({ count, onConfirm, onCancel }) {
  const [choice, setChoice] = useState("union"); // 'union' | 'separate'
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,23,25,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 24 }}>
      <div style={{ width: "min(480px, 92%)", background: C.white, borderRadius: 16, padding: "20px 22px", boxShadow: "0 24px 48px rgba(0,0,0,0.16)", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>같은 형식의 파일이 감지됨</div>
          <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }}>
            <Icon.Close size={16} />
          </button>
        </div>
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.55, marginBottom: 14 }}>
          업로드한 <span style={{ fontWeight: 700, color: C.text }}>{count}개 파일</span>이 동일한 스키마입니다. 하나의 데이터셋으로 Union 하시겠습니까?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[
            { v: "union",    label: `Union으로 단일 데이터셋 생성`,     desc: `${count}개 파일이 행으로 합쳐져 하나의 데이터셋이 됩니다.` },
            { v: "separate", label: `각각 단일 파일로 업로드`,           desc: `${count}개 데이터셋으로 별개 등록됩니다.` },
          ].map((o) => (
            <label key={o.v} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "8px 10px", border: `1px solid ${choice === o.v ? C.blue : C.border}`, borderRadius: 8, background: choice === o.v ? "#F5FAFF" : C.white }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${choice === o.v ? C.blue : C.border}`, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {choice === o.v && <span style={{ width: 6, height: 6, background: C.blue, borderRadius: "50%" }} />}
              </span>
              <input type="radio" checked={choice === o.v} onChange={() => setChoice(o.v)} style={{ display: "none" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{o.label}</div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2, lineHeight: 1.4 }}>{o.desc}</div>
              </div>
            </label>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "7px 14px", background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
          <button onClick={() => onConfirm(choice)} style={{ padding: "7px 14px", background: C.text, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>다음</button>
        </div>
      </div>
    </div>
  );
}

/* ========== Coming soon placeholder (다른 메뉴 임시 화면) ========== */
function ComingSoonPanel({ sectionLabel }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: FONT }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.3px" }}>{sectionLabel}</div>
        <div style={{ fontSize: 12, color: C.textSub, marginTop: 6 }}>이 화면은 아직 구현되지 않았습니다. (Coming soon)</div>
      </div>
    </div>
  );
}

/* ========== Empty state main view ========== */
function EmptyState({ onUploadClick }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, maxWidth: 760 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: "-0.4px", lineHeight: 1.3 }}>Start by Adding Your Data Source</div>
          <div style={{ fontSize: 13, color: C.textSub, fontFamily: FONT, marginTop: 6 }}>Add a master dataset to power profiling, enrichment, and dataset creation for your workflows.</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <DataSourceCard
            label="Upload data"
            onClick={onUploadClick}
            iconBg="#DBE7F8"
            tint="#B6CCE6"
          />
          <DataSourceCard
            label="AWS integration"
            badge="Coming soon"
            iconBg="#F7F7F8"
            tint="#E6E7E9"
            disabled
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#FF9900", fontFamily: "system-ui, sans-serif", letterSpacing: "-0.4px" }}>aws</div>
          </DataSourceCard>
        </div>
      </div>
    </div>
  );
}

function DataSourceCard({ label, onClick, badge, iconBg, tint, disabled, children }) {
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      width: 244, padding: 18,
      background: C.white,
      border: "none", borderRadius: 14,
      display: "flex", flexDirection: "column", gap: 16,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: FONT,
      textAlign: "left",
      position: "relative",
      filter: disabled ? "saturate(0.85)" : "none",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      {/* Stacked card visual */}
      <div style={{ position: "relative", width: 168, height: 110, margin: "0 auto" }}>
        <div style={{ position: "absolute", inset: 0, background: tint, borderRadius: 12, transform: "translate(8px, 6px) rotate(2deg)" }} />
        <div style={{ position: "absolute", inset: 0, background: iconBg, borderRadius: 12, transform: "translate(4px, 3px) rotate(1deg)" }} />
        <div style={{ position: "absolute", inset: 0, background: C.white, borderRadius: 12, border: `1px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {children || <span style={{ color: C.textMute }}><Icon.Upload size={36} /></span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{label}</div>
        {badge && (
          <div style={{ background: C.blueLight, color: C.blue, fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 999 }}>{badge}</div>
        )}
      </div>
    </button>
  );
}

/* ========== Upload modal ========== */
function UploadModal({ files, onClose, onAddData, onRemoveFile, onStart, duplicate, onConfirmDuplicate, onCancelDuplicate }) {
  const fileInputRef = useRef(null);
  const isEmpty = files.length === 0;
  // 모든 목적 입력은 다음 단계(Action Review)에서 받음 — 모달은 파일만 다룸
  const canStart = !isEmpty;

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(23, 23, 25, 0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 30,
      padding: 24,
    }}>
      <div style={{
        width: "min(720px, 92%)",
        maxHeight: "calc(100% - 24px)",
        background: C.white, borderRadius: 16,
        boxShadow: "0 24px 48px rgba(0,0,0,0.16)",
        display: "flex", flexDirection: "column",
        fontFamily: FONT,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 12px" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Upload data</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }} aria-label="Close">
            <Icon.Close size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 8px" }}>
          {isEmpty ? (
            <Dropzone onClick={() => onAddData([])} onDrop={onAddData} />
          ) : (
            <FileList files={files} onRemove={onRemoveFile} onAddMore={() => onAddData([])} />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            multiple
            style={{ display: "none" }}
            onChange={(e) => onAddData(Array.from(e.target.files || []))}
          />

          {!isEmpty && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              padding: "10px 12px",
              background: "#F7F5FF",
              border: `1px solid #EFEBFF`,
              borderRadius: 10,
              marginTop: 12,
            }}>
              <span><Icon.Sparkle size={14} /></span>
              <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>
                다음 단계에서 처리 방식과 데이터 목적을 입력합니다.<br/>
                <span style={{ color: C.textSub }}>같은 형식의 파일은 자동으로 그룹핑되어 한 번에 입력할 수 있습니다.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
          <div style={{ fontSize: 11.5, color: C.textMute }}>Maximum 5 files</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              padding: "8px 14px", background: C.white, color: C.text,
              border: `1px solid ${C.border}`, borderRadius: 999,
              fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ display: "inline-flex" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M3 10h18" />
                  <path d="M9 3v18" />
                </svg>
              </span>
              Upload guide
            </button>
            <button onClick={canStart ? onStart : undefined} disabled={!canStart} style={{
              padding: "8px 14px",
              background: canStart ? C.text : "#BFC1C6",
              color: C.white, border: "none", borderRadius: 999,
              fontSize: 12.5, fontWeight: 600,
              cursor: canStart ? "pointer" : "not-allowed", fontFamily: FONT,
            }}>Start Data Profiling</button>
          </div>
        </div>
      </div>

      {/* Nested duplicate dialog */}
      {duplicate && (
        <DuplicateDialog onConfirm={onConfirmDuplicate} onCancel={onCancelDuplicate} />
      )}
    </div>
  );
}

function Dropzone({ onClick, onDrop }) {
  const [over, setOver] = useState(false);
  return (
    <div
      onClick={onClick}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = Array.from(e.dataTransfer.files || []);
        if (f.length) onDrop(f);
      }}
      style={{
        border: `1.5px dashed ${over ? C.text : C.border}`,
        borderRadius: 12,
        padding: "60px 20px",
        textAlign: "center",
        cursor: "pointer",
        background: over ? C.hover : C.white,
        transition: "border-color 0.15s, background 0.15s",
      }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, color: C.textSub }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Click or drag files to upload</div>
      <div style={{ fontSize: 11.5, color: C.textMute }}>Up to 100MB · 100~10,000 rows / 100 columns</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {["CSV", "XLSX", "XLS"].map((ext) => (
          <span key={ext} style={{ fontSize: 10, fontWeight: 700, color: C.textSub, padding: "2px 8px", border: `1px solid ${C.border}`, borderRadius: 4 }}>{ext}</span>
        ))}
      </div>
    </div>
  );
}

function FileList({ files, onRemove, onAddMore }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
      <div style={{ fontSize: 11, color: C.textSub, padding: "4px 4px 0", fontWeight: 600 }}>Uploaded Data</div>
      {files.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 8 }}>
          <button onClick={() => onRemove(i)} style={{ background: "transparent", border: "none", color: C.textMute, cursor: "pointer", padding: 2 }} aria-label="Remove">
            <Icon.Close size={14} />
          </button>
          <Icon.File />
          <div style={{ minWidth: 0, overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
            <div style={{ fontSize: 10.5, color: C.textMute }}>{f.ext} · {f.size}</div>
          </div>
        </div>
      ))}
      {files.length < 5 && (
        <button onClick={onAddMore} style={{
          padding: "10px 0", background: C.white,
          border: `1px dashed ${C.border}`, borderRadius: 8,
          color: C.textSub, fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", fontFamily: FONT,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.white; }}>
          <Icon.Plus size={13} />
          Add data
        </button>
      )}
    </div>
  );
}

function DuplicateDialog({ onConfirm, onCancel }) {
  const [choice, setChoice] = useState("replace");
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(23, 23, 25, 0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 40, padding: 24,
    }}>
      <div style={{
        width: "min(440px, 92%)",
        background: C.white, borderRadius: 16,
        padding: "20px 22px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.16)",
        fontFamily: FONT,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>업로드 옵션</div>
          <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }}>
            <Icon.Close size={16} />
          </button>
        </div>
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.55, marginBottom: 14 }}>
          하나 이상의 항목이 이미 존재합니다. 기존 항목을 새 버전으로 대체하시겠습니까, 아니면 두 항목 모두 유지하시겠습니까?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[
            { v: "replace", label: "기존 항목 대체" },
            { v: "keep",    label: "모든 항목 유지" },
          ].map((o) => (
            <label key={o.v} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 12.5, color: C.text }}>
              <span style={{
                width: 14, height: 14, borderRadius: "50%",
                border: `2px solid ${choice === o.v ? C.blue : C.border}`,
                position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                {choice === o.v && <span style={{ width: 6, height: 6, background: C.blue, borderRadius: "50%" }} />}
              </span>
              <input type="radio" checked={choice === o.v} onChange={() => setChoice(o.v)} style={{ display: "none" }} />
              {o.label}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{
            padding: "7px 14px", background: C.white, color: C.text,
            border: `1px solid ${C.border}`, borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}>Cancel</button>
          <button onClick={() => onConfirm(choice)} style={{
            padding: "7px 14px", background: C.text, color: C.white,
            border: "none", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}>Upload</button>
        </div>
      </div>
    </div>
  );
}

/* ========== Toast ========== */
function Toast({ visible, items, onClose, isDone, mode }) {
  if (!visible) return null;
  const titlePrefix = mode === "union-new" ? "Union" : mode === "union-existing" ? "기존 데이터셋에 Union" : mode === "mixed" ? "처리" : "항목";
  const titleNoun = mode === "union-existing" ? "" : `${items.length}건`;
  return (
    <div style={{
      position: "absolute", right: 24, bottom: 24,
      width: 300,
      background: C.white,
      borderRadius: 12,
      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
      border: `1px solid ${C.borderLight}`,
      fontFamily: FONT,
      overflow: "hidden",
      zIndex: 25,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${C.borderLight}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>
          {isDone ? `${titlePrefix} ${titleNoun} 업로드 완료`.replace(/  +/g, " ") : `${titlePrefix} ${titleNoun} 업로드 중...`.replace(/  +/g, " ")}
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 2 }}>
          <Icon.Close size={14} />
        </button>
      </div>
      <div style={{ padding: "4px 0" }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 14px" }}>
            <div style={{ fontSize: 12, color: C.text }}>Context Enrichment</div>
            {it.status === "ok" ? <Icon.CheckCircle /> : it.status === "fail" ? <Icon.XCircle /> : <Spinner />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: "50%",
      border: `2px solid ${C.borderLight}`, borderTopColor: C.text,
      animation: "stsp 0.7s linear infinite",
    }}>
      <style>{`@keyframes stsp { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ========== Helpers ========== */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
function makeFileEntry(f) {
  const name = f.name || "[SAPLE] CUBIG Data";
  const ext = (name.split(".").pop() || "csv").toUpperCase();
  return {
    name,
    ext,
    size: f.size ? formatSize(f.size) : "58.2KB",
    purpose: "",
  };
}

/* ========== Root ========== */
const DEFAULT_DIMS = [
  { label: "Privacy",                value: 8 },
  { label: "Integrity",              value: 10 },
  { label: "Contextuality",          value: 30 },
  { label: "Conciseness",            value: 50 },
  { label: "Operational Reliability", value: 100 },
  { label: "Traceability",            value: 100 },
];

/* =========================================================
 *  Union / Join 합치기 플로우 (신규 업로드 ↔ 기존 데이터셋)
 *  - 새 데이터셋 업로드 → PK 후보 감지 → 매칭 데이터셋 목록
 *    → 합치기/건너뛰기 → 결합 방식(Union/Join) → 확인 → 결과
 *  - 단일 파일 업로드 + 기존 데이터셋 1개 이상일 때 트리거됨 (데모)
 * ========================================================= */

// 결합 결과 차단 기준 (PRD 7번)
const UJ_ROW_LIMIT = 10000;
const UJ_COL_LIMIT = 100;

// Join 시 동일 컬럼명 충돌 suffix: _{datasetName 앞 8자}
// REVIEW: suffix 규칙 — 데이터셋명 앞 8자 vs 전체명 vs 사용자 지정 (미확정, 우선 앞 8자로 적용)
const ujSuffix = (datasetName) => `_${(datasetName || "").slice(0, 8)}`;

// 데모용 PK 매칭 정보 — 신규 업로드 데이터셋(A)과 기존 데이터셋(B)의 컬럼/행
// A: 방금 업로드한 파일, B: 기존 데이터셋 (둘 다 user_id 라는 PK 공유)
const buildUjContext = (uploadedFile, targetDataset) => {
  const aName = (uploadedFile?.name || "new_dataset").replace(/\.[^.]+$/, "");
  const bName = targetDataset?.name || "existing_dataset";
  return {
    pk: "user_id",
    a: {
      name: aName,
      rows: 3200,
      cols: ["user_id", "name", "score", "region"],
    },
    b: {
      name: bName,
      rows: 2800,
      cols: ["user_id", "name", "score", "department"],
    },
    // 중복 PK fanout 데모용: 중복 PK별 (A행수 × B행수) 합 + 단독 행
    dupFanout: { pairsSum: 1800, aOnly: 1400, bOnly: 1000 },
  };
};

function UjRadioCard({ value, selected, onSelect, label, desc, badge, visual }) {
  const on = selected === value;
  return (
    <label onClick={() => onSelect(value)} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "10px 12px", border: `1px solid ${on ? C.blue : C.border}`, borderRadius: 8, background: on ? "#F5FAFF" : C.white }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${on ? C.blue : C.border}`, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        {on && <span style={{ width: 6, height: 6, background: C.blue, borderRadius: "50%" }} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
          {badge && <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, background: C.blueLight, padding: "1.5px 6px", borderRadius: 999 }}>{badge}</span>}
        </div>
        <div style={{ fontSize: 11, color: C.textSub, marginTop: 2, lineHeight: 1.45 }}>{desc}</div>
      </div>
      {visual && <div style={{ flexShrink: 0, marginLeft: 8, alignSelf: "center" }}>{visual}</div>}
    </label>
  );
}

// 컬럼 칩 (스키마 미리보기)
function UjColChip({ label, tone }) {
  const map = {
    pk:     { bg: "#EFF6FF", border: "#BEDBFF", color: "#155DFC" },
    fill:   { bg: "#F7F5FF", border: "#EFEBFF", color: "#7A65D0" },
    rename: { bg: "#FEF9C3", border: "#FDE68A", color: "#A16207" },
    plain:  { bg: C.hover,   border: C.borderLight, color: C.text },
  };
  const s = map[tone] || map.plain;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", border: `1px solid ${s.border}`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: s.color, background: s.bg }}>
      {tone === "pk" && <span style={{ fontSize: 9, fontWeight: 800 }}>PK</span>}
      {label}
    </span>
  );
}

// 결합 방식 미니 다이어그램 — Union: 행이 위아래로 쌓임 / Join: 컬럼이 좌우로 확장
function UjUnionViz() {
  const a = { height: 6, borderRadius: 2, background: "#93C5FD" };
  const b = { height: 6, borderRadius: 2, background: "#C4B5FD" };
  return (
    <div style={{ width: 52, display: "flex", flexDirection: "column", gap: 3 }} aria-hidden="true">
      <div style={a} /><div style={a} />
      <div style={{ height: 1, background: C.border, margin: "1px 0" }} />
      <div style={b} /><div style={b} />
    </div>
  );
}
function UjJoinViz() {
  const a = { flex: 1, borderRadius: 2, background: "#93C5FD" };
  const b = { flex: 1, borderRadius: 2, background: "#C4B5FD" };
  return (
    <div style={{ width: 52, height: 30, display: "flex", gap: 3 }} aria-hidden="true">
      <div style={a} /><div style={a} />
      <div style={{ width: 1, background: C.border }} />
      <div style={b} />
    </div>
  );
}

/* ========== Union/Join 통합 모달 (내부 step state로 구동) ========== */
function UnionJoinModal({ ctx, onClose, onComplete }) {
  // step: 'match' → 'mode' → ('union-confirm' | 'join-confirm') → 'result'
  const [step, setStep] = useState("match");
  const [mode, setMode] = useState("union");        // 'union' | 'join'
  const [pkConfirmed] = useState(ctx.pk);            // PK 매핑 (데모: 자동 확정)
  const [blocked, setBlocked] = useState(false);     // 결과 크기 초과 차단 팝업
  const [acceptedConflict, setAcceptedConflict] = useState(false); // Join 충돌 suffix 확인 완료

  // ----- 결합 결과 추정 -----
  // Union(행 병합): 행 = A + B, 열 = 이름 기준 합집합
  const unionRows = ctx.a.rows + ctx.b.rows;
  const unionColSet = Array.from(new Set([...ctx.a.cols, ...ctx.b.cols]));
  const unionCols = unionColSet.length;

  // Join(FULL OUTER JOIN on PK): 행 = Σ(중복PK별 A×B) + A단독 + B단독
  const joinRows = ctx.dupFanout.pairsSum + ctx.dupFanout.aOnly + ctx.dupFanout.bOnly;
  // 비-PK 동일 컬럼명 → 양쪽 모두 suffix 부여
  const nonPkA = ctx.a.cols.filter((c) => c !== ctx.pk);
  const nonPkB = ctx.b.cols.filter((c) => c !== ctx.pk);
  const conflictCols = nonPkA.filter((c) => nonPkB.includes(c)); // name, score
  const joinColList = [
    ctx.pk,
    ...nonPkA.map((c) => (conflictCols.includes(c) ? `${c}${ujSuffix(ctx.a.name)}` : c)),
    ...nonPkB.map((c) => (conflictCols.includes(c) ? `${c}${ujSuffix(ctx.b.name)}` : c)),
  ];
  const joinCols = joinColList.length;

  const resultRows = mode === "union" ? unionRows : joinRows;
  const resultCols = mode === "union" ? unionCols : joinCols;
  const rowOver = resultRows > UJ_ROW_LIMIT;
  const colOver = resultCols > UJ_COL_LIMIT;

  // 결합 실행 — 크기 검사 후 결과 단계로
  const runCombine = () => {
    if (rowOver || colOver) { setBlocked(true); return; }
    setStep("result");
  };

  const shell = (children, opts = {}) => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,23,25,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 24 }}>
      <div style={{ width: opts.wide ? "min(620px, 94%)" : "min(520px, 92%)", maxHeight: "calc(100% - 32px)", background: C.white, borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,0.16)", fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );

  const header = (title, sub) => (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 22px 6px" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: C.textSub, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }} aria-label="Close">
        <Icon.Close size={18} />
      </button>
    </div>
  );

  const btnGhost = { padding: "8px 14px", background: C.white, color: C.text, border: `1px solid ${C.border}`, borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT };
  const btnPrimary = { padding: "8px 14px", background: C.text, color: C.white, border: "none", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT };

  // ===== STEP 1: 매칭 데이터셋 발견 → 합치기/건너뛰기 =====
  if (step === "match") {
    return shell(
      <>
        {header("같은 Primary Key를 가진 데이터셋 발견", "업로드한 데이터를 기존 데이터셋과 합칠 수 있습니다.")}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 12px" }}>
          {/* REVIEW: PK 감지 방식 — 데이터타입+유니크 비율 vs 컬럼명 일치 vs 복합 (미확정, 데모는 컬럼명 일치 가정) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: C.blueLight, border: `1px solid #BEDBFF`, borderRadius: 10, marginBottom: 12 }}>
            <Icon.Sparkle size={14} color={C.blue} />
            <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>
              공통 Primary Key <strong>"{ctx.pk}"</strong> 가 감지되었습니다. 합칠 데이터셋을 선택하세요.
            </div>
          </div>

          {/* 매칭 데이터셋 목록 (데모: 1건) */}
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textSub, marginBottom: 6 }}>합칠 수 있는 데이터셋</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `1px solid ${C.blue}`, borderRadius: 10, background: "#F5FAFF", marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: C.white, border: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon.Database size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ctx.b.name}</div>
              <div style={{ fontSize: 10.5, color: C.textMute, marginTop: 1 }}>{ctx.b.cols.length} columns · {ctx.b.rows.toLocaleString()} rows · PK: {ctx.pk}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, background: C.white, border: `1px solid #BEDBFF`, padding: "2px 8px", borderRadius: 999 }}>매칭</span>
          </div>
          {/* REVIEW: DTS 노출 정책 — 목록 미노출 vs 선택 차단 (미확정, 데모는 목록 미노출 가정) */}
          <div style={{ fontSize: 10.5, color: C.textMute, lineHeight: 1.5 }}>
            DTS(가명화·합성) 적용 데이터셋 및 열람 권한이 없는 데이터셋은 목록에서 제외됩니다.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
          {/* 건너뛰기 → 기존 단일 업로드 플로우로 진행 */}
          <button onClick={() => onComplete({ skipped: true })} style={btnGhost}>건너뛰기 (단일 등록)</button>
          <button onClick={() => setStep("mode")} style={btnPrimary}>합치기</button>
        </div>
      </>
    );
  }

  // ===== STEP 2: 결합 방식 선택 (Union vs Join) + PK 매핑 확인 =====
  if (step === "mode") {
    return shell(
      <>
        {header("결합 방식 선택", `Primary Key "${pkConfirmed}" 기준으로 두 데이터셋을 결합합니다.`)}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 12px" }}>
          {/* PK 매핑 확인 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", border: `1px solid ${C.borderLight}`, borderRadius: 10, marginBottom: 14, fontSize: 12, color: C.text }}>
            <UjColChip label={`${ctx.a.name}.${ctx.pk}`} tone="pk" />
            <span style={{ color: C.textMute }}><Icon.ChevronRight size={14} /></span>
            <UjColChip label={`${ctx.b.name}.${ctx.pk}`} tone="pk" />
            <span style={{ marginLeft: "auto", fontSize: 11, color: C.textSub }}>PK 매핑 확인됨</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <UjRadioCard
              value="union" selected={mode} onSelect={(v) => { setMode(v); setAcceptedConflict(false); }}
              label="Union · 행 병합" badge="ROW"
              desc="두 데이터셋의 행을 위아래로 합칩니다. 컬럼명 기준으로 정렬되며 한쪽에만 있는 컬럼은 null로 채워집니다."
              visual={<UjUnionViz />}
            />
            <UjRadioCard
              value="join" selected={mode} onSelect={(v) => { setMode(v); setAcceptedConflict(false); }}
              label="Join · 컬럼 확장" badge="COLUMN"
              desc="Primary Key 기준 FULL OUTER JOIN으로 컬럼을 확장합니다. 이름이 겹치는 비-PK 컬럼은 suffix가 붙습니다."
              visual={<UjJoinViz />}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
          <button onClick={() => setStep("match")} style={btnGhost}>뒤로</button>
          <button onClick={() => setStep(mode === "union" ? "union-confirm" : "join-confirm")} style={btnPrimary}>다음</button>
        </div>
      </>
    );
  }

  // ===== STEP 3a: Union 확인 (이름 기준 스키마 정렬) =====
  if (step === "union-confirm") {
    return shell(
      <>
        {header("Union 결과 미리보기", "컬럼명 기준으로 스키마를 정렬합니다. 한쪽에만 있는 컬럼은 null로 채워집니다.")}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textSub, marginBottom: 6 }}>정렬된 스키마 ({unionCols} columns)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {unionColSet.map((c) => {
              const inA = ctx.a.cols.includes(c);
              const inB = ctx.b.cols.includes(c);
              const both = inA && inB;
              return <UjColChip key={c} label={both ? c : `${c} (null 채움)`} tone={c === ctx.pk ? "pk" : both ? "plain" : "fill"} />;
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "10px 12px", border: `1px solid ${C.borderLight}`, borderRadius: 10 }}>
              <div style={{ fontSize: 10.5, color: C.textMute }}>예상 행 수</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: rowOver ? C.red : C.text }}>{unionRows.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: C.textMute, marginTop: 2 }}>{ctx.a.rows.toLocaleString()} + {ctx.b.rows.toLocaleString()}</div>
            </div>
            <div style={{ padding: "10px 12px", border: `1px solid ${C.borderLight}`, borderRadius: 10 }}>
              <div style={{ fontSize: 10.5, color: C.textMute }}>예상 열 수</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: colOver ? C.red : C.text }}>{unionCols}</div>
              <div style={{ fontSize: 10, color: C.textMute, marginTop: 2 }}>합집합 (이름 기준)</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
          <button onClick={() => setStep("mode")} style={btnGhost}>뒤로</button>
          <button onClick={runCombine} style={btnPrimary}>이 설정으로 합치기</button>
        </div>
        {blocked && (
          <UjSizeBlock rows={unionRows} cols={unionCols} rowOver={rowOver} colOver={colOver} onClose={() => setBlocked(false)} />
        )}
      </>
    , { wide: true });
  }

  // ===== STEP 3b: Join 확인 (컬럼 충돌 suffix + fanout 경고) =====
  if (step === "join-confirm") {
    return shell(
      <>
        {header("Join 결과 확인", `Primary Key "${ctx.pk}" 기준 FULL OUTER JOIN. 이름이 겹치는 컬럼에 suffix가 적용됩니다.`)}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 12px" }}>
          {/* (a) 중복 PK fanout 경고 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: "#FEF9C3", border: `1px solid #FDE68A`, borderRadius: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>⚠️</span>
            <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>
              중복 Primary Key가 있으면 행이 늘어날 수 있습니다.<br />
              <span style={{ color: C.textSub }}>예상 행 수 = Σ(중복 PK별 A행수 × B행수) + A단독 + B단독 = {ctx.dupFanout.pairsSum.toLocaleString()} + {ctx.dupFanout.aOnly.toLocaleString()} + {ctx.dupFanout.bOnly.toLocaleString()} = </span>
              <strong>{joinRows.toLocaleString()} rows</strong>
            </div>
          </div>

          {/* (b) 컬럼 충돌 suffix 확인 리스트 */}
          {/* REVIEW: 충돌 UX — 자동적용+확인팝업 vs 사전경고+선택 (미확정, 데모는 자동적용+확인 리스트) */}
          {conflictCols.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textSub, marginBottom: 6 }}>이름이 겹쳐 suffix가 적용되는 컬럼 ({conflictCols.length})</div>
              <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
                {conflictCols.map((c, i) => (
                  <div key={c} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "8px 12px", fontSize: 11.5, color: C.text, borderTop: i === 0 ? "none" : `1px solid ${C.borderLight}`, alignItems: "center" }}>
                    <UjColChip label={`${c}${ujSuffix(ctx.a.name)}`} tone="rename" />
                    <UjColChip label={`${c}${ujSuffix(ctx.b.name)}`} tone="rename" />
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ fontSize: 11, fontWeight: 600, color: C.textSub, marginBottom: 6 }}>결합 스키마 ({joinCols} columns)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {joinColList.map((c) => (
              <UjColChip key={c} label={c} tone={c === ctx.pk ? "pk" : /_/.test(c) && (c.includes(ujSuffix(ctx.a.name)) || c.includes(ujSuffix(ctx.b.name))) ? "rename" : "plain"} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: "10px 12px", border: `1px solid ${C.borderLight}`, borderRadius: 10 }}>
              <div style={{ fontSize: 10.5, color: C.textMute }}>예상 행 수</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: rowOver ? C.red : C.text }}>{joinRows.toLocaleString()}</div>
            </div>
            <div style={{ padding: "10px 12px", border: `1px solid ${C.borderLight}`, borderRadius: 10 }}>
              <div style={{ fontSize: 10.5, color: C.textMute }}>예상 열 수</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: colOver ? C.red : C.text }}>{joinCols}</div>
            </div>
          </div>

          {conflictCols.length > 0 && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 11.5, color: C.text }}>
              <span onClick={() => setAcceptedConflict(!acceptedConflict)}>
                <CheckBox checked={acceptedConflict} />
              </span>
              suffix 적용 내용을 확인했습니다.
            </label>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
          <button onClick={() => setStep("mode")} style={btnGhost}>뒤로</button>
          <button
            onClick={runCombine}
            disabled={conflictCols.length > 0 && !acceptedConflict}
            style={{ ...btnPrimary, background: (conflictCols.length > 0 && !acceptedConflict) ? "#BFC1C6" : C.text, cursor: (conflictCols.length > 0 && !acceptedConflict) ? "not-allowed" : "pointer" }}
          >이 설정으로 합치기</button>
        </div>
        {blocked && (
          <UjSizeBlock rows={joinRows} cols={joinCols} rowOver={rowOver} colOver={colOver} onClose={() => setBlocked(false)} />
        )}
      </>
    , { wide: true });
  }

  // ===== STEP 4: 결과 (새 독립 데이터셋 생성) =====
  return shell(
    <>
      {header("새 데이터셋이 생성됩니다", "결합 결과는 원본과 별개의 독립 데이터셋으로 등록됩니다.")}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#F0FDF4", border: `1px solid #DCFCE7`, borderRadius: 10, marginBottom: 14 }}>
          <Icon.CheckCircle size={16} />
          <div style={{ fontSize: 11.5, color: C.textSub, lineHeight: 1.5 }}>
            <strong style={{ color: C.text }}>{mode === "union" ? "Union (행 병합)" : "Join (컬럼 확장)"}</strong> 방식으로 결합됩니다.
          </div>
        </div>
        <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          {[
            ["결합 방식", mode === "union" ? "Union · 행 병합" : "Join · 컬럼 확장 (FULL OUTER)"],
            ["Primary Key", pkConfirmed],
            ["예상 행 수", resultRows.toLocaleString()],
            ["예상 열 수", String(resultCols)],
            ["Resource Owner", "Luna Hart (나)"],
            ["조직 기본 권한", "Viewer"],
          ].map((row, i) => (
            <div key={row[0]} style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "9px 14px", fontSize: 12, borderTop: i === 0 ? "none" : `1px solid ${C.borderLight}` }}>
              <div style={{ color: C.textSub }}>{row[0]}</div>
              <div style={{ color: C.text, fontWeight: 600 }}>{row[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "14px 22px 18px", borderTop: `1px solid ${C.borderLight}` }}>
        <button onClick={() => setStep(mode === "union" ? "union-confirm" : "join-confirm")} style={btnGhost}>뒤로</button>
        <button
          onClick={() => onComplete({
            skipped: false,
            mode,
            pk: pkConfirmed,
            rows: resultRows,
            cols: resultCols,
            name: `${ctx.a.name} ⨝ ${ctx.b.name}`,
            joinColList: mode === "join" ? joinColList : unionColSet,
          })}
          style={btnPrimary}
        >데이터셋 생성</button>
      </div>
    </>
  );
}

// (c) 결과 크기 초과 차단 안내 (단순 팝업)
function UjSizeBlock({ rows, cols, rowOver, colOver, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,23,25,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, padding: 24 }}>
      <div style={{ width: "min(420px, 92%)", background: C.white, borderRadius: 16, padding: "20px 22px", boxShadow: "0 24px 48px rgba(0,0,0,0.16)", fontFamily: FONT }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>결합할 수 없습니다</div>
        <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.55, marginBottom: 12 }}>
          결합 결과가 허용 크기를 초과했습니다. 데이터 범위를 줄인 뒤 다시 시도하세요.
        </div>
        <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "8px 12px", fontSize: 11.5, color: C.textSub, background: C.hover }}>
            <div>항목</div><div style={{ paddingRight: 16 }}>결과</div><div>한도</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "8px 12px", fontSize: 12, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ color: C.text }}>행 수</div>
            <div style={{ paddingRight: 16, color: rowOver ? C.red : C.text, fontWeight: 700 }}>{rows.toLocaleString()}</div>
            <div style={{ color: C.textMute }}>{UJ_ROW_LIMIT.toLocaleString()}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "8px 12px", fontSize: 12, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ color: C.text }}>열 수</div>
            <div style={{ paddingRight: 16, color: colOver ? C.red : C.text, fontWeight: 700 }}>{cols.toLocaleString()}</div>
            <div style={{ color: C.textMute }}>{UJ_COL_LIMIT.toLocaleString()}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 14px", background: C.text, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default function SyntitanPrototype() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("edit_dataset");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mcpOpen, setMcpOpen] = useState(false);
  const profileRef = useRef(null);

  // 메인 화면 상태
  const [view, setView] = useState("empty"); // 'empty' | 'datasets' | 'detail'
  const [datasets, setDatasets] = useState([]); // 업로드 완료된 데이터셋들
  const [detailIdx, setDetailIdx] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [pendingDuplicates, setPendingDuplicates] = useState([]);

  const [toast, setToast] = useState(null); // { items: [{name, status}], done: bool, mode: 'standard'|'union-existing'|'union-new' }
  const [profilingOpen, setProfilingOpen] = useState(false);
  const [profilingActiveIdx, setProfilingActiveIdx] = useState(0);
  const [profilingClosedOnce, setProfilingClosedOnce] = useState(false); // 닫으면 다시 못 봄

  // Action Review (통합 다이얼로그) 상태
  const [actionTasks, setActionTasks] = useState(null); // [{ mode, files, target? }]

  // Union/Join 합치기 플로우 상태 — { ctx, file } 또는 null
  const [unionJoinFlow, setUnionJoinFlow] = useState(null);

  // Close profile popover on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

  const openModal = () => { setShowModal(true); };
  const closeModal = () => { setShowModal(false); setFiles([]); setDuplicate(false); };

  const addFiles = (newFs) => {
    if (!newFs || newFs.length === 0) {
      // Demo: 클릭마다 다른 샘플 파일 이름 (중복 다이얼로그 회피)
      const SAMPLES = [
        "voc_data_2024-04.csv",
        "voc_data_2024-05.csv",
        "user_signup.xlsx",
        "transactions_q1.csv",
        "[SAPLE] CUBIG Data.csv",
      ];
      const used = new Set(files.map((f) => f.name));
      const next = SAMPLES.find((s) => !used.has(s)) || `sample_${Date.now()}.csv`;
      newFs = [{ name: next, size: 58.2 * 1024 }];
    }
    const newEntries = newFs.map(makeFileEntry);
    const existing = files.map((f) => f.name);
    const dups = newEntries.filter((n) => existing.includes(n.name));
    const room = 5 - files.length;
    const accepted = newEntries.slice(0, room);
    if (dups.length > 0) {
      setPendingDuplicates(accepted);
      setDuplicate(true);
      return;
    }
    setFiles([...files, ...accepted]);
  };

  const confirmDuplicate = (choice) => {
    if (choice === "replace") {
      const replaced = files.map((f) => {
        const dup = pendingDuplicates.find((p) => p.name === f.name);
        return dup ? dup : f;
      });
      const newOnes = pendingDuplicates.filter((p) => !files.some((f) => f.name === p.name));
      setFiles([...replaced, ...newOnes].slice(0, 5));
    } else {
      // keep both — append with (1) suffix
      const renamed = pendingDuplicates.map((p) => {
        if (files.some((f) => f.name === p.name)) {
          const baseDot = p.name.lastIndexOf(".");
          const base = baseDot >= 0 ? p.name.slice(0, baseDot) : p.name;
          const ext = baseDot >= 0 ? p.name.slice(baseDot) : "";
          return { ...p, name: `${base} (1)${ext}` };
        }
        return p;
      });
      setFiles([...files, ...renamed].slice(0, 5));
    }
    setDuplicate(false);
    setPendingDuplicates([]);
  };

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));
  const changePurpose = (i, val) => setFiles(files.map((f, idx) => idx === i ? { ...f, purpose: val } : f));

  // 여러 purpose를 중복 제거 + 빈 값 제거 후 " · "로 합침
  const mergePurposes = (...all) => {
    const seen = new Set();
    return all
      .map((p) => (p || "").trim())
      .filter((p) => {
        if (!p || seen.has(p)) return false;
        seen.add(p);
        return true;
      })
      .join(" · ");
  };

  // 실제 프로파일링 시작 (모든 다이얼로그 끝난 뒤 호출)
  const doProfiling = (toRun, mode) => {
    // Union 모드는 결과가 1개 데이터셋이므로 토스트도 1개 항목으로 표시
    const items =
      mode === "union-new" || mode === "union-existing"
        ? [{ name: mode === "union-new" ? `Union (${toRun.length})` : `기존 데이터셋 Union (${toRun.length})`, status: "loading" }]
        : toRun.map((f) => ({ name: f.name, status: "loading" }));
    // 시뮬레이션 단계 수: union이면 1번, 표준이면 파일 수만큼
    const ticks = items.length;
    setToast({ items, done: false, mode });
    for (let idx = 0; idx < ticks; idx++) {
      setTimeout(() => {
        setToast((cur) => {
          if (!cur) return cur;
          const next = cur.items.map((it, i) => i === idx ? { ...it, status: (mode === "standard" && idx === 1 && ticks >= 4) ? "fail" : "ok" } : it);
          return { ...cur, items: next };
        });
        if (idx === ticks - 1) {
          setTimeout(() => {
            setToast((cur) => cur ? { ...cur, done: true } : cur);
            const today = new Date();
            const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            // mode 별로 데이터셋 생성 결과 다르게
            let newDatasets = [];
            if (mode === "union-new") {
              // 여러 파일이 하나의 union 데이터셋이 됨 — 각 파일의 purpose를 모두 병합
              const baseName = toRun[0].name.replace(/\.[^.]+$/, "").replace(/[-_]\d{4}.*$/, "") || "Union Dataset";
              const mergedPurpose = mergePurposes(...toRun.map((f) => f.purpose)) || "Revenue Strategy Analysis by Customer Segment";
              newDatasets = [{
                id: `union-${Date.now()}`,
                name: `${baseName} (Union ${toRun.length})`,
                size: "12.6GB", cols: 247, rows: 47 * toRun.length,
                readiness: 99, changes: 0, owner: "Luna Hart", ownerInitial: "L",
                created: fmt(today), updated: fmt(today),
                purpose: mergedPurpose,
                dims: DEFAULT_DIMS,
              }];
            } else if (mode === "union-existing") {
              // 기존 데이터셋에 행만 추가 + purpose는 기존 + 새로 올린 각 파일 purpose 병합
              setDatasets((prev) => prev.map((d, i) => i === 0 ? {
                ...d,
                rows: d.rows + 47 * toRun.length,
                updated: fmt(today),
                changes: (d.changes || 0) + 1,
                purpose: mergePurposes(d.purpose, ...toRun.map((f) => f.purpose)),
              } : d));
            } else {
              // 표준: 각 파일 = 별개 데이터셋
              newDatasets = toRun.map((f, i) => ({
                id: `${f.name}-${Date.now()}-${i}`,
                name: f.name.replace(/\.[^.]+$/, ""),
                size: "4.8GB", cols: 247, rows: 47,
                readiness: i === 0 ? 99 : i === 1 ? 50 : i === 2 ? 20 : 100,
                changes: i < 2 ? 1 : 0,
                owner: "Luna Hart", ownerInitial: "L",
                created: fmt(today), updated: fmt(today),
                purpose: f.purpose || "Revenue Strategy Analysis by Customer Segment",
                dims: DEFAULT_DIMS,
              }));
            }
            if (newDatasets.length > 0) setDatasets((prev) => [...prev, ...newDatasets]);
            setView("datasets");
            setProfilingActiveIdx(0);
            // 새 데이터셋이 있을 때만 프로파일링 모달 자동 노출 (union-existing은 패스)
            if (newDatasets.length > 0 && !profilingClosedOnce) setProfilingOpen(true);
            setTimeout(() => setToast(null), 2200);
          }, 200);
        }
      }, 700 + idx * 700);
    }
  };

  // 그룹 자동 분류 (데모용 단순 휴리스틱)
  // - 기존 데이터셋이 있으면 첫 1개 파일은 그 기존과 union 후보
  // - 남은 파일이 2개 이상이면 그 묶음은 union-new 후보
  // - 나머지는 standard
  // 첫 번째 파일명을 default 데이터셋 이름으로 사용 (확장자 제거)
  const firstFileStem = (files) => {
    if (!files || files.length === 0) return "Union Dataset";
    return (files[0].name || "Union Dataset").replace(/\.[^.]+$/, "");
  };

  const classifyTasks = (submitted) => {
    const tasks = [];
    let pool = [...submitted];
    if (datasets.length > 0 && pool.length > 0) {
      tasks.push({
        mode: "union-existing",
        target: datasets[0].name,
        existingPurpose: datasets[0].purpose || "",
        files: [pool.shift()],
        purpose: "",
      });
    }
    if (pool.length >= 2) {
      const half = Math.min(pool.length, Math.max(2, Math.ceil(pool.length / 2)));
      const groupFiles = pool.slice(0, half);
      tasks.push({
        mode: "union-new",
        files: groupFiles,
        purpose: "",
        name: commonPrefix(groupFiles.map((f) => f.name)),
      });
      pool = pool.slice(half);
    }
    if (pool.length > 0) {
      // standard 그룹: 1개면 단일 입력, 2개 이상이면 파일별 입력
      tasks.push({
        mode: "standard",
        files: pool,
        purpose: "",
        purposes: pool.map(() => ""),
      });
    }
    return tasks;
  };

  // Union/Join 플로우 완료 콜백 — 건너뛰면 단일 업로드, 합치면 새 독립 데이터셋 생성
  const completeUnionJoin = (file, result) => {
    setUnionJoinFlow(null);
    if (!result || result.skipped) {
      // 건너뛰기 → 기존 단일 업로드 플로우 그대로 진행
      runTasks([{ mode: "standard", files: [file], purpose: "" }]);
      return;
    }
    // 합치기 → 결합 결과를 새 독립 데이터셋으로 생성 (runTasks 데이터셋 shape과 일치)
    const today = new Date();
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const ds = {
      id: `merge-${Date.now()}`,
      name: result.name,
      size: "9.4GB",
      cols: result.cols,
      rows: result.rows,
      readiness: 99,
      changes: 0,
      owner: "Luna Hart",       // Resource Owner = 현재 사용자
      ownerInitial: "L",
      created: fmt(today),
      updated: fmt(today),
      purpose: result.mode === "union"
        ? "Union(행 병합)으로 결합된 데이터셋"
        : "Join(컬럼 확장)으로 결합된 데이터셋",
      dims: DEFAULT_DIMS,
    };
    setToast({ items: [{ name: ds.name, status: "ok" }], done: true, mode: "union-new" });
    setDatasets((prev) => [...prev, ds]);
    setView("datasets");
    setProfilingActiveIdx(0);
    if (!profilingClosedOnce) setProfilingOpen(true);
    setTimeout(() => setToast(null), 2200);
  };

  const startProfiling = () => {
    const submitted = [...files];
    setShowModal(false);
    setFiles([]);
    // 데모 트리거: 파일이 정확히 1개 + 기존 데이터셋이 1개 이상이면
    // PK 매칭 데이터셋 발견 시나리오로 Union/Join 플로우 진입
    if (submitted.length === 1 && datasets.length > 0) {
      const file = submitted[0];
      // REVIEW: DTS 노출 정책 — 여기서는 DTS/권한 없는 데이터셋을 후보에서 제외했다고 가정하고
      //         첫 번째 기존 데이터셋을 매칭 대상으로 사용
      const target = datasets[0];
      setUnionJoinFlow({ file, ctx: buildUjContext(file, target) });
      return;
    }
    const tasks = classifyTasks(submitted);
    // 단순 케이스: standard 그룹 1개 + 파일 1개 → Action Review 생략하고 바로 업로드
    const isSimple = tasks.length === 1 && tasks[0].mode === "standard" && tasks[0].files.length === 1;
    if (isSimple) {
      runTasks(tasks);
      return;
    }
    setActionTasks(tasks);
  };

  const onChangeReviewTask = (idx, patch) => {
    setActionTasks((prev) => prev.map((t, i) => i === idx ? { ...t, ...patch } : t));
  };

  // 그룹 task 전체를 하나의 토스트로 처리
  const runTasks = (tasks) => {
    setActionTasks(null);
    // 각 task = 토스트의 1행. mode가 'standard' 이면서 파일 여러 개면 파일별 분리.
    const items = [];
    const flatTasks = [];
    tasks.forEach((t) => {
      if (t.mode === "standard") {
        t.files.forEach((f, fi) => {
          items.push({ name: f.name, status: "loading" });
          // 파일별 purpose: 다중일 때 purposes[fi], 단일이면 t.purpose
          const perFilePurpose = (t.purposes && t.purposes[fi]) || t.purpose || "";
          flatTasks.push({ mode: "standard", files: [f], purpose: perFilePurpose });
        });
      } else if (t.mode === "union-new") {
        const labelName = (t.name && t.name.trim()) || (t.files[0]?.name?.replace(/\.[^.]+$/, "")) || "Union";
        items.push({ name: `${labelName} (Union ${t.files.length})`, status: "loading" });
        flatTasks.push(t);
      } else if (t.mode === "union-existing") {
        items.push({ name: `${t.target} Union`, status: "loading" });
        flatTasks.push(t);
      }
    });
    setToast({ items, done: false, mode: "mixed" });

    // 시뮬레이션: 각 행 단계적으로 완료 처리 + 데이터셋 반영
    const today = new Date();
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    flatTasks.forEach((t, idx) => {
      setTimeout(() => {
        // 행 상태 업데이트
        setToast((cur) => {
          if (!cur) return cur;
          const next = cur.items.map((it, i) => i === idx ? { ...it, status: "ok" } : it);
          return { ...cur, items: next };
        });
        // 결과 반영
        if (t.mode === "union-existing") {
          // 기존 데이터셋의 purpose + Action Review에서 입력한 통합 purpose 병합
          setDatasets((prev) => prev.map((d) => d.name === t.target ? {
            ...d,
            rows: d.rows + 47 * t.files.length,
            updated: fmt(today),
            changes: (d.changes || 0) + 1,
            purpose: mergePurposes(d.purpose, t.purpose),
          } : d));
        } else if (t.mode === "union-new") {
          // 사용자 편집된 이름 우선, 없으면 첫 파일명 stem 사용
          const baseName = (t.name && t.name.trim())
            || (t.files[0]?.name?.replace(/\.[^.]+$/, ""))
            || "Union Dataset";
          const merged = (t.purpose && t.purpose.trim()) || "Revenue Strategy Analysis by Customer Segment";
          setDatasets((prev) => [...prev, {
            id: `union-${Date.now()}-${idx}`,
            name: `${baseName} (Union ${t.files.length})`,
            size: "12.6GB", cols: 247, rows: 47 * t.files.length,
            readiness: 99, changes: 0, owner: "Luna Hart", ownerInitial: "L",
            created: fmt(today), updated: fmt(today),
            purpose: merged, dims: DEFAULT_DIMS,
          }]);
        } else {
          // standard
          const f = t.files[0];
          // 파일이 1개면 task.purpose, 여러 개면 task.purposes[i] (각 파일별)
          // runTasks에서 standard는 파일 단위로 분리되어 들어오므로 항상 1개
          const itemPurpose = (t.purpose && t.purpose.trim())
            || (t.purposes && t.purposes[0] && t.purposes[0].trim())
            || "Revenue Strategy Analysis by Customer Segment";
          setDatasets((prev) => [...prev, {
            id: `${f.name}-${Date.now()}-${idx}`,
            name: f.name.replace(/\.[^.]+$/, ""),
            size: "4.8GB", cols: 247, rows: 47,
            readiness: 90 + ((idx * 7) % 10),
            changes: 0, owner: "Luna Hart", ownerInitial: "L",
            created: fmt(today), updated: fmt(today),
            purpose: itemPurpose, dims: DEFAULT_DIMS,
          }]);
        }
        // 마지막 행이면 완료 처리 + 화면 전환
        if (idx === flatTasks.length - 1) {
          setTimeout(() => {
            setToast((cur) => cur ? { ...cur, done: true } : cur);
            setView("datasets");
            setProfilingActiveIdx(0);
            if (!profilingClosedOnce) setProfilingOpen(true);
            setTimeout(() => setToast(null), 2200);
          }, 200);
        }
      }, 700 + idx * 700);
    });
  };

  const cancelReview = () => setActionTasks(null);

  return (
    <div style={{
      display: "flex",
      width: "100%",
      height: "100%",
      minHeight: 720,
      background: C.bg,
      fontFamily: FONT,
      position: "relative",
      overflow: "hidden",
    }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeKey={activeKey}
        onSelect={setActiveKey}
        profileOpen={profileOpen}
        onProfileToggle={() => setProfileOpen(!profileOpen)}
        profileRef={profileRef}
        onAudit={() => { setActiveKey("audit"); setProfileOpen(false); }}
        onSettings={() => { setMcpOpen(true); setProfileOpen(false); }}
      />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {activeKey === "audit" ? (
          <AuditLogPanel />
        ) : activeKey === "edit_dataset" ? (
          view === "empty" ? (
            <EmptyState onUploadClick={openModal} />
          ) : view === "detail" ? (
            <DatasetDetail
              dataset={datasets[detailIdx] || datasets[0]}
              onBack={() => setView("datasets")}
            />
          ) : (
            <DatasetsList
              datasets={datasets}
              onUploadClick={openModal}
              onSelectDataset={(d) => {
                const idx = datasets.findIndex((x) => x.id === d.id);
                if (idx >= 0) {
                  setDetailIdx(idx);
                  setView("detail");
                }
              }}
              onBulkDelete={(ids) => {
                const set = new Set(ids);
                setDatasets((prev) => prev.filter((d) => !set.has(d.id)));
                if (datasets.length - set.size === 0) setView("empty");
              }}
            />
          )
        ) : (
          <ComingSoonPanel sectionLabel={
            activeKey === "home" ? "Home"
            : activeKey === "agent_analysis" ? "Agent Analysis"
            : activeKey === "discussion" ? "Discussion Room"
            : activeKey === "report_hub" ? "Report Hub"
            : ""
          } />
        )}
      </div>

      {showModal && (
        <UploadModal
          files={files}
          onClose={closeModal}
          onAddData={addFiles}
          onRemoveFile={removeFile}
          onChangePurpose={changePurpose}
          onStart={startProfiling}
          duplicate={duplicate}
          onConfirmDuplicate={confirmDuplicate}
          onCancelDuplicate={() => { setDuplicate(false); setPendingDuplicates([]); }}
        />
      )}

      {toast && (
        <Toast
          visible
          items={toast.items}
          onClose={() => setToast(null)}
          isDone={toast.done}
          mode={toast.mode}
        />
      )}

      {profilingOpen && !profilingClosedOnce && datasets.length > 0 && (
        <DataProfilingModal
          datasets={datasets}
          activeIdx={Math.min(profilingActiveIdx, datasets.length - 1)}
          onSelect={setProfilingActiveIdx}
          onClose={() => { setProfilingOpen(false); setProfilingClosedOnce(true); }}
        />
      )}

      {actionTasks && (
        <ActionReviewDialog
          tasks={actionTasks}
          onChangeTask={onChangeReviewTask}
          onConfirm={() => runTasks(actionTasks)}
          onCancel={cancelReview}
        />
      )}

      {unionJoinFlow && (
        <UnionJoinModal
          ctx={unionJoinFlow.ctx}
          onClose={() => setUnionJoinFlow(null)}
          onComplete={(result) => completeUnionJoin(unionJoinFlow.file, result)}
        />
      )}

      <McpSettingsModal open={mcpOpen} onClose={() => setMcpOpen(false)} />
    </div>
  );
}
