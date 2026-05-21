import { useState, lazy, Suspense } from "react";
import { DonutChart, PieChart, MaleIcon, FemaleIcon, SemiDonutChart, HBarChart, VBarChart, StackedHBar, LineChart, MultiLineChart, LabeledLineChart, FlowTable, QuadrantChart, GroupedBarChart, RadarChart, PSMChart, FunnelChart, ComboChart, TimelineBarChart, KPITrendCard, NormalDistributionChart, CHART_COLORS } from "./charts";
import { T, Semantic, Radius, Gap, Opacity, InfoIcon, WarnIcon, CloseIcon, PlusIcon, DownIcon, ChevronR, StarIcon, StarRateFilledIcon, IdentityPlatformOutlineIcon } from "./tokens.jsx";
import { Btn, Badge, Callout, Chip, ChipTabs, TabBar, Modal, SegmentedControl, ModalUserCard, ModalField, ModalStat, ModalGrid, Tooltip, BTN_STYLES, BADGE_COLORS, BADGE_SIZE, BADGE_RADIUS } from "./ui-components.jsx";
import { IconsTab } from "./icons.jsx";
const ReportDemo = lazy(() => import("./ReportDemo"));
const AuditLog = lazy(() => import("./syntitan-UI/audit-log.jsx"));
const AgentThumbnails = lazy(() => import("./agent-thumbnails.jsx"));
const SyntitanPrototype = lazy(() => import("./syntitan-prototype.jsx"));

// ═══════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function PillBtn({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:"4px 12px", borderRadius:9999, border:"none", cursor:"pointer", fontSize:12, fontFamily:"Pretendard, sans-serif", fontWeight:500, background:active?(color||T.gray990):T.gray100, color:active?T.white:T.gray990, transition:"all .15s" }}>{label}</button>
  );
}
function Toggle({ label, on, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:"5px 14px", borderRadius:9999, border:`1px solid ${on?T.gray990:T.gray200}`, background:on?T.gray990:T.white, color:on?T.white:T.gray800, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"Pretendard, sans-serif" }}>{on?"✓ ":""}{label}</button>
  );
}
function Card({ title, subtitle, children }) {
  return (
    <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:24, marginBottom:20 }}>
      <h2 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>{title}</h2>
      {subtitle?<p style={{ fontSize:12, color:T.gray800, margin:"0 0 20px" }}>{subtitle}</p>:<div style={{marginBottom:20}}/>}
      {children}
    </div>
  );
}
function RowGroup({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>{label}</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{children}</div>
    </div>
  );
}
function Row({ children, wrap=false }) {
  return <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:wrap?"wrap":"nowrap", marginBottom:12 }}>{children}</div>;
}
function Col({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
      {label && <span style={{ fontSize:11, color:T.gray800, fontWeight:400 }}>{label}</span>}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UI PAGE (각 화면을 새 창으로 열기)
// ═══════════════════════════════════════════════════════════════════════════
const UI_FLOWS = [
  {
    key: "syntitan",
    label: "Syntitan 프로토타입 — 업로드 흐름",
    description: "Edit Dataset → Upload data → Profiling → Datasets · 프로필 팝오버 Audit log 까지 전부 한 흐름. 새 창에서 풀스크린으로 열립니다.",
  },
];

function UIPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {UI_FLOWS.map((it) => (
        <div
          key={it.key}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: 16,
            border: `1px solid ${T.gray200}`,
            borderRadius: 12,
            background: T.white,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.gray990, marginBottom: 4 }}>{it.label}</div>
            <div style={{ fontSize: 12, color: T.gray800 }}>{it.description}</div>
          </div>
          <Btn
            variant="solid-primary"
            size="sm"
            onClick={() => window.open(`${window.location.origin}/#/${it.key}`, "_blank")}
          >
            새 창으로 열기
          </Btn>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════
const CALLOUT_KEYS = ["Primary","Secondary","Positive","Negative","Cautionary","Info","Brand"];
const CHIP_SIZE_KEYS = ["X-Small","Small","Medium","Large"];
const CHIP_TYPES = ["Solid","Outline"];
const BADGE_VARIANT_KEYS = ["Primary","Secondary","Brand","Positive","Negative","Cautionary","Info"];
const BADGE_TYPE_KEYS = ["Solid","Outline","Strong"];
const BADGE_SIZE_KEYS = ["Small","Medium","Large"];
const BADGE_RADIUS_KEYS = ["Small","Large"];
const VARIANT_ACCENT = { Primary:T.gray990, Secondary:T.gray800, Brand:T.dp600, Positive:T.green600, Negative:T.red500, Info:T.blue500, Cautionary:T.orange500 };

const th = { padding:"8px 14px", textAlign:"left", fontSize:12, fontWeight:600, color:"#7B7E85", borderBottom:"1px solid #E6E7E9", whiteSpace:"nowrap" };
const td = { padding:"10px 14px", borderBottom:"1px solid #F0F0F2", verticalAlign:"middle" };

// 환경 배지 — Vercel 시스템 env(__VERCEL_ENV__/__VERCEL_BRANCH__)로 환경 구분
function EnvBadge() {
  // eslint-disable-next-line no-undef
  const env = typeof __VERCEL_ENV__ !== "undefined" ? __VERCEL_ENV__ : "local";
  const label = env === "production" ? "PROD"
    : env === "preview" ? "DEV"
    : "LOCAL";
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, lineHeight: "16px",
      padding: "2px 8px", borderRadius: 4,
      background: "#F0F0F2", color: "#7B7E85",
      letterSpacing: 0.4, textTransform: "uppercase",
      fontFamily: "Pretendard, sans-serif",
    }}>{label}</span>
  );
}

// 모달 시각 프리뷰 카드 — 옵션 데모용 미니 모달 모양
function ModalPreview({ width = "100%", label, hasDescription = true, hasDivider = false, footer = null, active = false, onClick, bodyHeight = 28 }) {
  return (
    <div onClick={onClick} style={{
      cursor: onClick ? "pointer" : "default",
      width, minWidth: 0, flexShrink: 0,
      border: `1px solid ${active ? "#2B7FFF" : "#E6E7E9"}`,
      borderRadius: 12, background: "#FFFFFF",
      overflow: "hidden",
      transition: "border 0.15s, box-shadow 0.15s",
      boxShadow: active ? "0 0 0 2px rgba(43,127,255,0.12)" : "none",
      fontFamily: "Pretendard, sans-serif",
    }}>
      <div style={{ padding: "12px 16px 10px" }}>
        {label && <div style={{ fontSize: 10, fontWeight: 600, color: "#7B7E85", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>}
        <div style={{ fontSize: 13, fontWeight: 600, color: "#171719", marginBottom: hasDescription ? 2 : 0 }}>제목</div>
        {hasDescription && <div style={{ fontSize: 11, color: "#7B7E85", lineHeight: "16px" }}>Description 텍스트</div>}
      </div>
      {hasDivider && <div style={{ height: 1, background: "#E6E7E9" }} />}
      <div style={{ padding: "8px 16px 12px" }}>
        <div style={{ height: bodyHeight, background: "#EFF6FF", borderRadius: 4 }} />
      </div>
      {footer && (
        <div style={{ padding: "8px 16px 12px", borderTop: `1px solid #F0F0F2` }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// 환경 전환 링크 — production이면 Local로, 그 외면 Production으로 우측 상단 노출
function ProdLink() {
  // eslint-disable-next-line no-undef
  const env = typeof __VERCEL_ENV__ !== "undefined" ? __VERCEL_ENV__ : "local";
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const isProd = env === "production";
  const targetUrl = isProd
    ? `http://localhost:5173/${hash}`
    : `https://syntitan-report-agent.vercel.app/${hash}`;
  const label = isProd ? "Local 화면 보기 →" : "Production 화면 보기 →";
  return (
    <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
      marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 12, fontWeight: 500, lineHeight: "18px",
      padding: "6px 12px", borderRadius: 8,
      border: "1px solid #E6E7E9", background: "#FFFFFF", color: "#171719",
      textDecoration: "none", fontFamily: "Pretendard, sans-serif",
      transition: "background 0.15s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F7F8"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
    >
      {label}
    </a>
  );
}

export default function App() {
  const [page, setPage] = useState("charts");

  // button
  const [btnVariant, setBtnVariant] = useState("solid-primary");
  const [btnSize, setBtnSize] = useState("lg");
  const [btnRadius, setBtnRadius] = useState("sm");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnIcon, setBtnIcon] = useState(false);

  // badge
  const [badgeType, setBadgeType] = useState("Solid");
  const [badgeVariant, setBadgeVariant] = useState("Primary");
  const [badgeSize, setBadgeSize] = useState("Medium");
  const [badgeRadius, setBadgeRadius] = useState("Small");
  const [badgeText, setBadgeText] = useState("텍스트");
  const [badgeLeading, setBadgeLeading] = useState(false);
  const [badgeTrailing, setBadgeTrailing] = useState(false);

  // tab
  const [tabItems] = useState(["홈","소개","서비스","포트폴리오","문의"]);
  const [activeTab, setActiveTab] = useState(0);
  const [chipTabItems] = useState(["전체","디자인","개발","마케팅"]);
  const [activeChipTab, setActiveChipTab] = useState(0);
  const [chipTabSize, setChipTabSize] = useState("Medium");
  const [segMdIdx, setSegMdIdx] = useState(0);

  // visual tooltip
  const [vtDesc, setVtDesc] = useState(true);

  // callout
  const [cVariant, setCVariant] = useState("Primary");
  const [cSize, setCSize] = useState("Medium");
  const [cTitle, setCTitle] = useState("텍스트를 입력해 주세요.");
  const [cDesc, setCDesc] = useState("안내 텍스트를 입력해 주세요.");
  const [cShowDesc, setCShowDesc] = useState(true);
  const [cShowIcon, setCShowIcon] = useState(true);

  // chip
  const [chipType, setChipType] = useState("Solid");
  const [chipSize, setChipSize] = useState("Medium");
  const [chipLabel, setChipLabel] = useState("텍스트");
  const [chipActive, setChipActive] = useState(false);
  const [chipDisabled, setChipDisabled] = useState(false);
  const [chipTrailing, setChipTrailing] = useState(false);

  // modal
  const [modalSize, setModalSize] = useState(null); // "xs" | "sm" | "md" | "lg" | "xl" | null
  const [modalDesc, setModalDesc] = useState(true);
  const [modalActionType, setModalActionType] = useState("dual"); // "single" | "dual"
  const [modalBtnLayout, setModalBtnLayout] = useState("hug"); // "hug" | "fill"
  const [modalBtnAlign, setModalBtnAlign] = useState("end"); // "start" | "end" | "space-between"
  const [modalActionOpen, setModalActionOpen] = useState(false);
  const [modalDivider, setModalDivider] = useState(false);
  const [modalDividerVariant, setModalDividerVariant] = useState(null); // "off" | "on" | null
  const [modalContentOpen, setModalContentOpen] = useState(null); // "user" | "stats" | "4col" | null
  const [modalContentTab, setModalContentTab] = useState(0);
  const [modalContent4colTab, setModalContent4colTab] = useState(1);
  const [modalContent4colChip, setModalContent4colChip] = useState(0);

  const PAGES = ["charts","color","button","badge","callout","chip","tab","modal","tooltip","icons","report","reports","ui","thumbnails"];
  const PAGE_LABELS = { charts:"Charts", color:"Color", button:"Button", badge:"Badge", callout:"Callout", chip:"Chip", tab:"Tab", modal:"Modal", tooltip:"Tooltip", icons:"Icons", report:"Report Components", reports:"Reports", ui:"UI", thumbnails:"Thumbnails" };
  const BTN_VARIANTS = Object.keys(BTN_STYLES);
  const RADII = ["sm","md","full"];
  const SIZES_BTN = ["lg","md","sm"];

  return (
    <div style={{ minHeight:"100vh", background:T.gray50, fontFamily:"Pretendard, sans-serif", boxSizing:"border-box" }}>

      {/* Header */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.gray200}`, padding:"0 24px", display:"flex", alignItems:"center", gap:8, position:"sticky", top:0, zIndex:11 }}>
        <span style={{ fontSize:14, fontWeight:700, color:T.gray990, padding:"14px 0", flexShrink:0 }}>CUBIG</span>
        <EnvBadge />
        <ProdLink />
      </div>

      {/* DS Sub Nav */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.gray200}`, padding:"0 24px", display:"flex", alignItems:"center", gap:0, position:"sticky", top:45, zIndex:10, overflowX:"auto" }}>
        {PAGES.map(p => (
          <button key={p} onClick={()=>setPage(p)} style={{ height:44, padding:"0 16px", border:"none", background:"none", cursor:"pointer", fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:14, color:page===p?T.gray990:T.gray800, borderBottom:page===p?`2px solid ${T.gray990}`:"2px solid transparent", transition:"all .15s", whiteSpace:"nowrap", flexShrink:0 }}>
            {PAGE_LABELS[p]}
          </button>
        ))}
      </div>

      <div style={{ padding:"28px 24px", maxWidth: (page === "report" || page === "ui" || page === "thumbnails") ? "none" : 960, margin:"0 auto" }}>

        {/* ══ COLOR ══ */}
        {page==="color" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Color Palette</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Figma Variables 기반 팔레트 · 시맨틱 · 사이징 토큰입니다.</p>
          </div>

          {/* ── Palette Colors (Figma 163색 전체) ── */}
          {[
            { name:"Gray", colors:[
              {k:"25",v:T.gray25},{k:"50",v:T.gray50},{k:"100",v:T.gray100},{k:"200",v:T.gray200},{k:"300",v:T.gray300},{k:"400",v:T.gray400},
              {k:"500",v:T.gray500},{k:"600",v:T.gray600},{k:"700",v:T.gray700},{k:"800",v:T.gray800},{k:"850",v:T.gray850},{k:"900",v:T.gray900},
              {k:"925",v:T.gray925},{k:"950",v:T.gray950},{k:"975",v:T.gray975},{k:"990",v:T.gray990},{k:"1000",v:T.gray1000},
            ]},
            { name:"Neutral", colors:[
              {k:"50",v:T.neutral50},{k:"100",v:T.neutral100},{k:"200",v:T.neutral200},{k:"300",v:T.neutral300},{k:"400",v:T.neutral400},
              {k:"500",v:T.neutral500},{k:"600",v:T.neutral600},{k:"700",v:T.neutral700},{k:"800",v:T.neutral800},{k:"900",v:T.neutral900},{k:"950",v:T.neutral950},
            ]},
            { name:"Red", colors:[
              {k:"50",v:T.red50},{k:"100",v:T.red100},{k:"200",v:T.red200},{k:"300",v:T.red300},{k:"400",v:T.red400},
              {k:"500",v:T.red500},{k:"600",v:T.red600},{k:"700",v:T.red700},{k:"800",v:T.red800},{k:"900",v:T.red900},{k:"950",v:T.red950},
            ]},
            { name:"Orange", colors:[
              {k:"50",v:T.orange50},{k:"100",v:T.orange100},{k:"200",v:T.orange200},{k:"300",v:T.orange300},{k:"400",v:T.orange400},
              {k:"500",v:T.orange500},{k:"600",v:T.orange600},{k:"700",v:T.orange700},{k:"800",v:T.orange800},{k:"900",v:T.orange900},{k:"950",v:T.orange950},
            ]},
            { name:"Yellow", colors:[
              {k:"50",v:T.yellow50},{k:"100",v:T.yellow100},{k:"200",v:T.yellow200},{k:"300",v:T.yellow300},{k:"400",v:T.yellow400},
              {k:"500",v:T.yellow500},{k:"600",v:T.yellow600},{k:"700",v:T.yellow700},{k:"800",v:T.yellow800},{k:"900",v:T.yellow900},{k:"950",v:T.yellow950},
            ]},
            { name:"Lime", colors:[
              {k:"50",v:T.lime50},{k:"100",v:T.lime100},{k:"200",v:T.lime200},{k:"300",v:T.lime300},{k:"400",v:T.lime400},
              {k:"500",v:T.lime500},{k:"600",v:T.lime600},{k:"700",v:T.lime700},{k:"800",v:T.lime800},{k:"900",v:T.lime900},{k:"950",v:T.lime950},
            ]},
            { name:"Green", colors:[
              {k:"50",v:T.green50},{k:"100",v:T.green100},{k:"200",v:T.green200},{k:"300",v:T.green300},{k:"400",v:T.green400},
              {k:"500",v:T.green500},{k:"600",v:T.green600},{k:"700",v:T.green700},{k:"800",v:T.green800},{k:"900",v:T.green900},{k:"950",v:T.green950},
            ]},
            { name:"Emerald", colors:[
              {k:"50",v:T.emerald50},{k:"100",v:T.emerald100},{k:"200",v:T.emerald200},{k:"300",v:T.emerald300},{k:"400",v:T.emerald400},
              {k:"500",v:T.emerald500},{k:"600",v:T.emerald600},{k:"700",v:T.emerald700},{k:"800",v:T.emerald800},{k:"900",v:T.emerald900},{k:"950",v:T.emerald950},
            ]},
            { name:"Teal", colors:[
              {k:"50",v:T.teal50},{k:"100",v:T.teal100},{k:"200",v:T.teal200},{k:"300",v:T.teal300},{k:"400",v:T.teal400},
              {k:"500",v:T.teal500},{k:"600",v:T.teal600},{k:"700",v:T.teal700},{k:"800",v:T.teal800},{k:"900",v:T.teal900},{k:"950",v:T.teal950},
            ]},
            { name:"Cyan", colors:[
              {k:"50",v:T.cyan50},{k:"100",v:T.cyan100},{k:"200",v:T.cyan200},{k:"300",v:T.cyan300},{k:"400",v:T.cyan400},
              {k:"500",v:T.cyan500},{k:"600",v:T.cyan600},{k:"700",v:T.cyan700},{k:"800",v:T.cyan800},{k:"900",v:T.cyan900},{k:"950",v:T.cyan950},
            ]},
            { name:"Blue", colors:[
              {k:"50",v:T.blue50},{k:"100",v:T.blue100},{k:"200",v:T.blue200},{k:"300",v:T.blue300},{k:"400",v:T.blue400},
              {k:"500",v:T.blue500},{k:"600",v:T.blue600},{k:"700",v:T.blue700},{k:"800",v:T.blue800},{k:"900",v:T.blue900},{k:"950",v:T.blue950},
            ]},
            { name:"Purple", colors:[
              {k:"50",v:T.purple50},{k:"100",v:T.purple100},{k:"200",v:T.purple200},{k:"300",v:T.purple300},{k:"400",v:T.purple400},
              {k:"500",v:T.purple500},{k:"600",v:T.purple600},{k:"700",v:T.purple700},{k:"800",v:T.purple800},{k:"900",v:T.purple900},{k:"950",v:T.purple950},
            ]},
            { name:"Deep Purple", colors:[
              {k:"50",v:T.dp50},{k:"100",v:T.dp100},{k:"200",v:T.dp200},{k:"300",v:T.dp300},{k:"400",v:T.dp400},
              {k:"500",v:T.dp500},{k:"600",v:T.dp600},{k:"700",v:T.dp700},{k:"800",v:T.dp800},{k:"900",v:T.dp900},{k:"950",v:T.dp950},
            ]},
            { name:"Pink", colors:[
              {k:"50",v:T.pink50},{k:"100",v:T.pink100},{k:"200",v:T.pink200},{k:"300",v:T.pink300},{k:"400",v:T.pink400},
              {k:"500",v:T.pink500},{k:"600",v:T.pink600},{k:"700",v:T.pink700},{k:"800",v:T.pink800},{k:"900",v:T.pink900},{k:"950",v:T.pink950},
            ]},
          ].map(group => (
            <div key={group.name} style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 12px" }}>{group.name}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {group.colors.map(c => (
                  <div key={c.k} style={{ textAlign:"center" }}>
                    <div style={{ width:56, height:56, borderRadius:8, background:c.v, border:`1px solid ${T.gray200}` }} />
                    <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>{c.k}</div>
                    <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{c.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ── Semantic: Foreground ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 16px" }}>Semantic · Foreground (fg)</h3>
            {Object.entries(Semantic.fg).map(([group, tokens]) => (
              <div key={group} style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.gray800, marginBottom:8 }}>fg / {group}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {Object.entries(tokens).map(([name, hex]) => (
                    <div key={name} style={{ textAlign:"center" }}>
                      <div style={{ width:48, height:48, borderRadius:8, background:hex, border:`1px solid ${T.gray200}` }} />
                      <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>{name}</div>
                      <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{hex}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Semantic: Background ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 16px" }}>Semantic · Background (bg)</h3>
            {Object.entries(Semantic.bg).map(([group, tokens]) => (
              <div key={group} style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.gray800, marginBottom:8 }}>bg / {group}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {Object.entries(tokens).map(([name, hex]) => (
                    <div key={name} style={{ textAlign:"center" }}>
                      <div style={{ width:48, height:48, borderRadius:8, background:hex, border:`1px solid ${T.gray200}` }} />
                      <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>{name}</div>
                      <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{hex}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Sizing: Radius ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 12px" }}>Sizing · Radius</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"end" }}>
              {["1", "1.5", "2", "3", "4", "5", "6", "full"].map((name) => {
                const val = Radius[name];
                return (
                  <div key={name} style={{ textAlign:"center" }}>
                    <div style={{ width:48, height:48, borderRadius:val, background:T.blue500, border:`1px solid ${T.gray200}` }} />
                    <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>rounded-{name}</div>
                    <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{val}px</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Sizing: Spacing (Gap) ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 12px" }}>Sizing · Spacing (Gap)</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {Object.entries(Gap)
                .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
                .map(([name, val]) => (
                <div key={name} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, color:T.gray800, width:48, textAlign:"right" }}>gap-{name}</span>
                  <div style={{ width:val, height:12, borderRadius:2, background:T.blue500, minWidth:val === 0 ? 2 : val }} />
                  <span style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{val}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Opacity ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 12px" }}>Opacity</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {Object.entries(Opacity).map(([name, val]) => (
                <div key={name} style={{ textAlign:"center" }}>
                  <div style={{ width:48, height:48, borderRadius:8, background:`rgba(15,15,16,${val/100})`, border:`1px solid ${T.gray200}` }} />
                  <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>opacity-{name}</div>
                  <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{val}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Chart Colors ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Chart Colors</h3>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 12px" }}>데이터 시리즈 팔레트 8종 + 회색(비강조/중립) + 빗금(미분류/기타)</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {CHART_COLORS.map((c, i) => (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ width:56, height:56, borderRadius:8, background:c, border:`1px solid ${T.gray200}` }} />
                  <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>{i+1}번</div>
                  <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>{c}</div>
                </div>
              ))}
              {/* Gray — 비강조·중립 세그먼트용 */}
              <div style={{ textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:8, background:T.gray200, border:`1px solid ${T.gray300}` }} />
                <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>Gray</div>
                <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>#E0E0E2</div>
              </div>
              {/* Hatched — 미분류/기타 빗금 패턴 (SemiDonut/Donut/Pie 공통) */}
              <div style={{ textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:8, border:`1px solid ${T.gray200}`, background: `repeating-linear-gradient(45deg, ${T.gray100}, ${T.gray100} 3px, ${T.gray200} 3px, ${T.gray200} 6px)` }} />
                <div style={{ fontSize:10, color:T.gray800, marginTop:4 }}>Hatched</div>
                <div style={{ fontSize:9, color:T.gray600, fontFamily:"monospace" }}>Unclassified</div>
              </div>
            </div>
          </div>

          {/* ── Shadow Tokens ── */}
          <div style={{ marginBottom:24, background:T.white, borderRadius:12, border:`1px solid ${T.gray200}`, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Shadow (Light)</h3>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 16px" }}>컴포넌트 계층을 표현하는 그림자 엘리베이션 토큰입니다.</p>
            <div style={{ border:`1px solid ${T.gray200}`, borderRadius:8, overflow:"hidden" }}>
              <div style={{
                display:"grid",
                gridTemplateColumns:"220px 140px 100px 180px 1fr",
                background:T.gray25,
                borderBottom:`1px solid ${T.gray200}`,
                fontSize:12, fontWeight:500, color:T.gray800, fontFamily:"Pretendard, sans-serif",
              }}>
                <div style={{ padding:"14px 16px" }}>명칭</div>
                <div style={{ padding:"14px 16px" }}>위치(px)</div>
                <div style={{ padding:"14px 16px" }}>블러(px)</div>
                <div style={{ padding:"14px 16px" }}>컬러</div>
                <div style={{ padding:"14px 16px" }}>역할</div>
              </div>
              {[
                { name:"shadow-xs-light", offset:"0, 1", blur:"2",  color:"rgba(0,0,0,0.06)", role:"버튼 호버 등 미세 인터랙션의 은은한 그림자",  shadow:"0px 1px 2px rgba(0,0,0,0.06)" },
                { name:"shadow-sm-light", offset:"0, 2", blur:"12", color:"rgba(0,0,0,0.06)", role:"라이트 컴포넌트 계층을 표현하는 기본 그림자",   shadow:"0px 2px 12px rgba(0,0,0,0.06)" },
                { name:"shadow-md-light", offset:"0, 4", blur:"16", color:"rgba(0,0,0,0.08)", role:"표준 계층에 사용하는 중간 강도의 그림자",      shadow:"0px 4px 16px rgba(0,0,0,0.08)" },
                { name:"shadow-lg-light", offset:"0, 6", blur:"20", color:"rgba(0,0,0,0.10)", role:"상위 계층 컴포넌트에 사용하는 깊은 그림자",   shadow:"0px 6px 20px rgba(0,0,0,0.10)" },
              ].map((row, i, arr) => (
                <div key={row.name} style={{
                  display:"grid",
                  gridTemplateColumns:"220px 140px 100px 180px 1fr",
                  alignItems:"center",
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.gray200}` : "none",
                  fontSize:13, color:T.gray990, fontFamily:"Pretendard, sans-serif",
                }}>
                  <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:28, height:28, borderRadius:6, background:T.white, border:`1px solid ${T.gray100}`, boxShadow:row.shadow, flexShrink:0 }} />
                    <span style={{ fontFamily:"monospace", fontSize:12 }}>{row.name}</span>
                  </div>
                  <div style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12, color:T.gray800 }}>{row.offset}</div>
                  <div style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12, color:T.gray800 }}>{row.blur}</div>
                  <div style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:11, color:T.gray800 }}>{row.color}</div>
                  <div style={{ padding:"14px 16px", fontSize:13, color:T.gray800 }}>{row.role}</div>
                </div>
              ))}
            </div>
          </div>

        </>}

        {/* ══ BUTTON ══ */}
        {page==="button" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Button</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Solid · Outline · Text · Icon 버튼 컴포넌트입니다.</p>
          </div>

          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:110 }}>
            <Btn variant={btnVariant} size={btnSize} radius={btnRadius} disabled={btnDisabled} icon={btnIcon}>
              {btnIcon ? <PlusIcon size={btnSize==="sm"?16:btnSize==="md"?20:24}/> : "텍스트"}
            </Btn>
          </div>
          <Card title="Button 커스텀">
            <RowGroup label="Variant">
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {BTN_VARIANTS.map(v => <PillBtn key={v} label={v} active={btnVariant===v} onClick={()=>setBtnVariant(v)}/>)}
              </div>
            </RowGroup>
            <RowGroup label="Size">
              {SIZES_BTN.map(s => <PillBtn key={s} label={s.toUpperCase()} active={btnSize===s} onClick={()=>setBtnSize(s)}/>)}
            </RowGroup>
            <RowGroup label="Radius">
              {RADII.map(r => <PillBtn key={r} label={r} active={btnRadius===r} onClick={()=>setBtnRadius(r)}/>)}
            </RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
              <Toggle label="Disabled" on={btnDisabled} onClick={()=>setBtnDisabled(p=>!p)}/>
              <Toggle label="Icon Only" on={btnIcon} onClick={()=>setBtnIcon(p=>!p)}/>
            </div>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 16px" }}>아이콘 포함</p>
            <Row wrap>
              <Col label="Leading"><Btn variant="solid-primary" size="lg"><PlusIcon size={20}/>추가하기</Btn></Col>
              <Col label="Trailing"><Btn variant="solid-secondary" size="lg">다운로드<DownIcon size={20}/></Btn></Col>
            </Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>아이콘 전용</p>
            <Row wrap>
              <Col label="Primary LG"><Btn variant="solid-primary" size="lg" icon><PlusIcon size={24}/></Btn></Col>
              <Col label="Secondary MD"><Btn variant="solid-secondary" size="md" icon><PlusIcon size={20}/></Btn></Col>
            </Row>
          </Card>

          <Card title="Solid">
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 16px" }}>Primary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-primary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-primary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-primary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-primary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius MD"><Btn variant="solid-primary" size="lg" radius="md">텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-primary" size="lg" radius="full">텍스트</Btn></Col></Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>Secondary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-secondary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-secondary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-secondary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-secondary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius MD"><Btn variant="solid-secondary" size="lg" radius="md">텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-secondary" size="lg" radius="full">텍스트</Btn></Col></Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>Tertiary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-tertiary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-tertiary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-tertiary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-tertiary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius MD"><Btn variant="solid-tertiary" size="lg" radius="md">텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-tertiary" size="lg" radius="full">텍스트</Btn></Col></Row>
          </Card>

        </>}

        {/* ══ BADGE ══ */}
        {page==="badge" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Badge</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Solid · Outline · Strong 타입의 라벨/상태 표시 컴포넌트입니다.</p>
          </div>

          {/* Preview */}
          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:100 }}>
            <Badge type={badgeType} variant={badgeVariant} size={badgeSize} radius={badgeRadius} text={badgeText||"텍스트"} leadingIcon={badgeLeading} trailingIcon={badgeTrailing}/>
          </div>

          <Card title="Badge 커스텀">
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>Text</p>
              <input value={badgeText} onChange={e=>setBadgeText(e.target.value)} style={{ border:`1px solid ${T.gray200}`, borderRadius:8, padding:"6px 12px", fontSize:14, fontFamily:"Pretendard, sans-serif", outline:"none", color:T.gray990, width:200 }}/>
            </div>
            <RowGroup label="Type">{BADGE_TYPE_KEYS.map(v=><PillBtn key={v} label={v} active={badgeType===v} onClick={()=>setBadgeType(v)}/>)}</RowGroup>
            <RowGroup label="Variant">{BADGE_VARIANT_KEYS.map(v=><PillBtn key={v} label={v} active={badgeVariant===v} color={VARIANT_ACCENT[v]} onClick={()=>setBadgeVariant(v)}/>)}</RowGroup>
            <RowGroup label="Size">{BADGE_SIZE_KEYS.map(v=><PillBtn key={v} label={v} active={badgeSize===v} onClick={()=>setBadgeSize(v)}/>)}</RowGroup>
            <RowGroup label="Radius">{BADGE_RADIUS_KEYS.map(v=><PillBtn key={v} label={v} active={badgeRadius===v} onClick={()=>setBadgeRadius(v)}/>)}</RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Leading Icon" on={badgeLeading} onClick={()=>setBadgeLeading(p=>!p)}/>
              <Toggle label="Trailing Icon" on={badgeTrailing} onClick={()=>setBadgeTrailing(p=>!p)}/>
            </div>
          </Card>

          {/* Solid */}
          <Card title="Solid" subtitle="연한 배경 + 컬러 텍스트">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Variant","Small","Medium","Large","Radius Large","With Icons"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{BADGE_VARIANT_KEYS.map(v=>(
                  <tr key={v}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{v}</td>
                    <td style={td}><Badge type="Solid" variant={v} size="Small"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Medium"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Large"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Medium" radius="Large"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Medium" leadingIcon trailingIcon/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>

          {/* Strong */}
          <Card title="Strong" subtitle="진한 배경 + 흰 텍스트">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Variant","Small","Medium","Large","Radius Large","With Icons"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{BADGE_VARIANT_KEYS.map(v=>(
                  <tr key={v}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{v}</td>
                    <td style={td}><Badge type="Strong" variant={v} size="Small"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Medium"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Large"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Medium" radius="Large"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Medium" leadingIcon trailingIcon/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>

          {/* Outline */}
          <Card title="Outline" subtitle="테두리만 + 컬러 텍스트">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Variant","Small","Medium","Large","Radius Large","With Icons"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{BADGE_VARIANT_KEYS.map(v=>(
                  <tr key={v}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{v}</td>
                    <td style={td}><Badge type="Outline" variant={v} size="Small"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Medium"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Large"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Medium" radius="Large"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Medium" leadingIcon trailingIcon/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ══ CALLOUT ══ */}
        {page==="callout" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Callout</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>안내 메시지를 표시하는 컴포넌트입니다.</p>
          </div>
          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:110 }}>
            <Callout variant={cVariant} size={cSize} title={cTitle} description={cDesc} showDesc={cShowDesc} showIcon={cShowIcon}/>
          </div>
          <Card title="Callout 커스텀">
            {[["Title",cTitle,setCTitle],["Description",cDesc,setCDesc]].map(([fl,fv,fs])=>(
              <div key={fl} style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>{fl}</p>
                <input value={fv} onChange={e=>fs(e.target.value)} style={{ border:`1px solid ${T.gray200}`, borderRadius:8, padding:"6px 12px", fontSize:14, fontFamily:"Pretendard, sans-serif", outline:"none", color:T.gray990, width:"100%", maxWidth:360, boxSizing:"border-box" }}/>
              </div>
            ))}
            <RowGroup label="Size">{["Small","Medium"].map(v=><PillBtn key={v} label={v} active={cSize===v} onClick={()=>setCSize(v)}/>)}</RowGroup>
            <RowGroup label="Variant">{CALLOUT_KEYS.map(v=><PillBtn key={v} label={v} active={cVariant===v} color={VARIANT_ACCENT[v]} onClick={()=>setCVariant(v)}/>)}</RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Description" on={cShowDesc} onClick={()=>setCShowDesc(p=>!p)}/>
              <Toggle label="Leading Icon" on={cShowIcon} onClick={()=>setCShowIcon(p=>!p)}/>
            </div>
          </Card>
          <Card title="Variant × Size (전체)">
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {CALLOUT_KEYS.map(v=>(
                <div key={v} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <span style={{ fontSize:11, color:T.gray800, fontWeight:600 }}>{v}</span>
                  {["Small","Medium"].map(s=><Callout key={s} variant={v} size={s} title="텍스트를 입력해 주세요." description="안내 텍스트를 입력해 주세요." showDesc showIcon={cShowIcon} width={220}/>)}
                </div>
              ))}
            </div>
          </Card>
        </>}

        {/* ══ CHIP ══ */}
        {page==="chip" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Chip</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>클릭 가능한 선택·필터 컴포넌트입니다.</p>
          </div>
          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:100 }}>
            <Chip type={chipType} size={chipSize} disabled={chipDisabled} active={chipActive} label={chipLabel||"텍스트"} showTrailing={chipTrailing}/>
          </div>
          <Card title="Chip 커스텀">
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>Label</p>
              <input value={chipLabel} onChange={e=>setChipLabel(e.target.value)} style={{ border:`1px solid ${T.gray200}`, borderRadius:8, padding:"6px 12px", fontSize:14, fontFamily:"Pretendard, sans-serif", outline:"none", color:T.gray990, width:200 }}/>
            </div>
            <RowGroup label="Type">{CHIP_TYPES.map(v=><PillBtn key={v} label={v} active={chipType===v} onClick={()=>setChipType(v)}/>)}</RowGroup>
            <RowGroup label="Size">{CHIP_SIZE_KEYS.map(v=><PillBtn key={v} label={v} active={chipSize===v} onClick={()=>setChipSize(v)}/>)}</RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Active" on={chipActive} onClick={()=>setChipActive(p=>!p)}/>
              <Toggle label="Disabled" on={chipDisabled} onClick={()=>setChipDisabled(p=>!p)}/>
              <Toggle label="Trailing ×" on={chipTrailing} onClick={()=>setChipTrailing(p=>!p)}/>
            </div>
          </Card>
          <Card title="Chip Matrix" subtitle="hover로 상태 확인 가능">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Size","Solid","Solid Active","Solid Disabled","Outline","Outline Active","Outline Disabled","With ×"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{CHIP_SIZE_KEYS.map(sz=>(
                  <tr key={sz}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{sz}</td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"}/></td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"} active/></td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"} disabled/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"}/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} active/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} disabled/></td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"} showTrailing/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ══ TAB ══ */}
        {page==="tab" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Tab</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Tab Bar와 Chip Tabs 두 가지 탭 패턴입니다.</p>
          </div>
          <Card title="Tab Bar" subtitle="탭을 클릭해 보세요.">
            <TabBar tabs={tabItems} activeIndex={activeTab} onChange={setActiveTab}/>
            <div style={{ marginTop:20, padding:14, background:T.gray50, borderRadius:8, fontSize:14, color:T.gray990 }}>선택된 탭: <strong>{tabItems[activeTab]}</strong></div>
          </Card>
          <Card title="Chip Tabs">
            <RowGroup label="Size">{CHIP_SIZE_KEYS.map(s=><PillBtn key={s} label={s} active={chipTabSize===s} onClick={()=>setChipTabSize(s)}/>)}</RowGroup>
            <ChipTabs tabs={chipTabItems} activeIndex={activeChipTab} onChange={setActiveChipTab} size={chipTabSize} type="Solid"/>
            <div style={{ marginTop:16, padding:14, background:T.gray50, borderRadius:8, fontSize:14, color:T.gray990 }}>선택된 항목: <strong>{chipTabItems[activeChipTab]}</strong></div>
          </Card>

          <Card title="Segmented Control" subtitle="md (기본) / sm · disabled 개별 지정 가능">
            <RowGroup label="Size md">
              <SegmentedControl
                items={["텍스트","텍스트","텍스트","텍스트","텍스트","텍스트"]}
                activeIndex={segMdIdx}
                onChange={setSegMdIdx}
                size="md"
              />
            </RowGroup>
          </Card>
        </>}

        {/* ══ CHARTS ══ */}
        {page==="charts" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Charts (Nivo)</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>리포트에 사용되는 Nivo 기반 차트 컴포넌트입니다.</p>
          </div>

          {/* Color Palette */}
          <Card title="Chart 색상 팔레트" subtitle="데이터 시리즈에 순서대로 적용">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              {["Blue 500","Lime 500","DeepPurple 400","Blue 300","Teal 500","Yellow 400","Purple 400","Pink 300"].map((name,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:8 }}>
                  <div style={{ width:16, height:16, borderRadius:4, background:CHART_COLORS[i] }}/>
                  <span style={{ fontSize:12, color:T.gray990, fontWeight:500 }}>{i+1}번</span>
                  <span style={{ fontSize:11, color:T.gray800 }}>{name}</span>
                  <code style={{ fontSize:11, color:T.gray800, background:T.gray50, padding:"1px 4px", borderRadius:3 }}>{CHART_COLORS[i]}</code>
                </div>
              ))}
            </div>
          </Card>

          {/* Donut */}
          <Card title="Donut Chart" subtitle="원그래프 - 비율 표시에 적합 (기타 항목은 hatched:true 로 빗금 렌더)">
            <div style={{ display:"flex", gap:40, flexWrap:"wrap" }}>
              <DonutChart
                title="Response Rate by Age Group"
                data={[
                  { id:"Age 15-19", value:1200 },
                  { id:"Age 20-24", value:360 },
                  { id:"Age 25-29", value:450 },
                  { id:"Age 30-39", value:240 },
                  { id:"Age 40-49", value:750 },
                  { id:"Age 50-59", value:240 },
                ]}
              />
              <DonutChart
                title="Response Distribution by Gender"
                data={[
                  { id:"Male", value:2800 },
                  { id:"Female", value:2200 },
                ]}
              />
              <DonutChart
                title="Category Share (with 기타)"
                data={[
                  { id:"가성비", value:57 },
                  { id:"바퀴/이동성", value:56 },
                  { id:"디자인/색상", value:48 },
                  { id:"내구성", value:46 },
                  { id:"기타", value:21, hatched:true },
                ]}
              />
            </div>
          </Card>

          {/* Donut — Vertical (legend bottom) */}
          <Card title="Donut Chart — Vertical (legend bottom)" subtitle="좁은 컬럼 / 가로 배치된 두 카드 안 등 폭이 제한된 곳에 적합. legendPosition='bottom'">
            <div style={{ display:"flex", gap:40, flexWrap:"wrap" }}>
              <DonutChart
                title="부정 리뷰 영역별 비중"
                size={200}
                legendPosition="bottom"
                data={[
                  { id:"배송/CS", value:44.3 },
                  { id:"지퍼/잠금장치", value:35.4 },
                  { id:"파손/내구성", value:39.2 },
                  { id:"기타", value:16.5, hatched:true },
                ]}
              />
              <DonutChart
                title="긍정 리뷰 영역별 비중"
                size={200}
                legendPosition="bottom"
                data={[
                  { id:"가성비", value:57 },
                  { id:"바퀴/이동성", value:56 },
                  { id:"디자인/색상", value:48 },
                  { id:"내구성", value:46 },
                  { id:"기타", value:21, hatched:true },
                ]}
              />
            </div>
          </Card>

          {/* Pie Chart */}
          <Card title="Pie Chart (원형)" subtitle="전체 비율 표시 - 최대 6색상, 호버 툴팁 (기타 항목은 hatched:true 로 빗금)">
            <div style={{ display:"flex", gap:40, flexWrap:"wrap" }}>
              <PieChart
                title="Market Share by Brand"
                data={[
                  { id:"Brand A", value:350 },
                  { id:"Brand B", value:280 },
                  { id:"Brand C", value:190 },
                  { id:"Brand D", value:120 },
                  { id:"Brand E", value:80 },
                  { id:"Brand F", value:60 },
                ]}
              />
              <PieChart
                title="Satisfaction Level"
                data={[
                  { id:"매우 만족", value:420 },
                  { id:"만족", value:310 },
                  { id:"보통", value:180 },
                  { id:"불만족", value:90 },
                ]}
              />
              <PieChart
                title="Gender Distribution"
                data={[
                  { id:"남성", value:2800, color:"#2B7FFF" },
                  { id:"여성", value:2200, color:"#7CCF00" },
                ]}
                showInnerLabels
                hideValues
              />
              <PieChart
                title="Negative Review Breakdown (with 기타)"
                data={[
                  { id:"배송/CS", value:44 },
                  { id:"파손/내구성", value:39 },
                  { id:"지퍼/잠금장치", value:35 },
                  { id:"기타", value:17, hatched:true },
                ]}
              />
            </div>
          </Card>

          {/* Semi Donut */}
          <Card title="Semi Donut Chart (반원)" subtitle="감성 분석, 만족도 등 비율 분포에 적합">
            <SemiDonutChart
              title="Sentiment Analysis"
              data={[
                { id: "Positive", value: 65, description: "간편하고 빠른 결제 시스템에 높은 만족도를 보임." },
                { id: "Neutral", value: 18, description: "결제 과정의 편리함과 속도가 긍정적으로 평가되나, 얼굴 인식 오류와 보안 우려가 지적됨." },
                { id: "Negative", value: 7, description: "전반적으로 불편함을 느끼며, 인증 과정에서의 부담감도 지적됨." },
                { id: "Unclassified", value: 8, hatched: true },
              ]}
              size={320}
            />
          </Card>

          {/* Semi Donut — Legend Only (description 없이 범례만) */}
          <Card title="Semi Donut Chart — Legend Only" subtitle="하단 범례 설명 없이 범례만 (description 필드 생략)">
            <SemiDonutChart
              title="Sentiment Analysis"
              data={[
                { id: "Positive", value: 65 },
                { id: "Neutral", value: 18 },
                { id: "Negative", value: 7 },
                { id: "Unclassified", value: 8, hatched: true },
              ]}
              size={320}
            />
          </Card>

          {/* Flow Table */}
          <Card title="Flow Table (전환율 테이블)" subtitle="기능별 사용 경험 → 전환율 → 현재 사용률 흐름">
            <FlowTable
              columns={{ left: "사용해 본 기능", right: "사용 중인 기능" }}
              groups={[
                { label: "자동기능", rows: [
                  { label: "자동 감지 기능", description: "세척량, 오염도, 식재료 등 스스로 감지", left: "35.5", rate: 84.6, right: "30.0" },
                  { label: "자동 추천 기능", description: "세척 코스, 요리 모드, 레시피 등 추천", left: "35.5", rate: 69.2, right: "24.5" },
                  { label: "자동 실행 기능", description: "추천/예약 설정을 알아서 실행", left: "29.1", rate: 82.8, right: "24.1" },
                ]},
                { label: "원격제어", rows: [
                  { label: "음성 제어/조작", left: "28.2", rate: 67.7, right: "19.1" },
                  { label: "원격 제어/조작", description: "모바일 앱 등", left: "44.1", rate: 77.3, right: "34.1" },
                  { label: "다른 기기와의 연결 기능", description: "연동 및 통합 제어", left: "30.9", rate: 67.6, right: "20.9" },
                ]},
                { label: "상태 알림", rows: [
                  { label: "고장 발생/관리 필요 시 알림", left: "26.4", rate: 79.3, right: "20.9" },
                  { label: "사용 기록/상태를 보여주는 리포트 제공", left: "26.8", rate: 71.2, right: "19.1" },
                ]},
                { label: "맞춤 기능", rows: [
                  { label: "사용자 맞춤형 학습 기능", description: "사용 습관, 환경 등", left: "22.7", rate: 72.0, right: "16.4" },
                ]},
              ]}
            />
          </Card>

          {/* Horizontal Bar */}
          <Card title="Horizontal Bar" subtitle="가로 막대 - 카테고리 비교에 적합">
            <HBarChart
              title="Satisfaction Level Distribution"
              maxValue={100}
              data={[
                { label:"Very High", value:32, count:9999 },
                { label:"High", value:32, count:9999 },
                { label:"Medium", value:14, count:123 },
                { label:"Low", value:10, count:99 },
                { label:"Very Low", value:0, count:0 },
              ]}
            />
          </Card>

          {/* Horizontal Bar — Inline Value (값이 막대 내부에) */}
          <Card title="Horizontal Bar — Inline Value" subtitle="우측 카운터 제거 + 값(% / count)을 막대 내부 우측에 표시 (maxValue 미지정 시 데이터 최댓값 기준 자동 — 가장 긴 막대가 끝까지)">
            <HBarChart
              title="Satisfaction Level Distribution"
              valueInside
              data={[
                { label:"Very High", value:32, count:9999 },
                { label:"High", value:32, count:9999 },
                { label:"Medium", value:14, count:123 },
                { label:"Low", value:10, count:99 },
                { label:"Very Low", value:0, count:0 },
              ]}
            />
          </Card>

          {/* Stacked Horizontal Bar */}
          <Card title="Stacked Horizontal Bar" subtitle="100% 누적 막대 - 구성비 비교 (값 개수에 따라 2~8개 자동 대응)">
            <StackedHBar
              title="Feature Importance by Segment"
              data={[
                { label:"Customer Satisfaction", seg1:35, seg2:30, seg3:20, seg4:15 },
                { label:"Response Time",          seg1:25, seg2:40, seg3:20, seg4:15 },
                { label:"Price Sensitivity",      seg1:20, seg2:35, seg3:25, seg4:20 },
                { label:"Feature Completeness",   seg1:30, seg2:45, seg3:15, seg4:10 },
                { label:"Brand Trust",            seg1:40, seg2:25, seg3:20, seg4:15 },
              ]}
              keys={["seg1","seg2","seg3","seg4"]}
            />
          </Card>

          {/* Stacked Horizontal Bar — 감성 색상 (부정/중립/긍정) */}
          <Card title="Stacked Horizontal Bar — Sentiment" subtitle="감성 색상 variant (부정=Red / 중립=Gray / 긍정=Lime)">
            <StackedHBar
              title="영역별 감성 분포"
              data={[
                { label: "응답 품질",      부정: 63, 중립: 8,  긍정: 29 },
                { label: "가격/한도",     부정: 56, 중립: 7,  긍정: 37 },
                { label: "UI/UX",       부정: 45, 중립: 15, 긍정: 40 },
                { label: "콘텐츠 품질",   부정: 33, 중립: 12, 긍정: 55 },
                { label: "편의성",        부정: 15, 중립: 10, 긍정: 75 },
              ]}
              keys={["부정", "중립", "긍정"]}
              colors={["#FF6467", "#E6E7E9", "#7CCF00"]}
            />
          </Card>

          {/* Stacked Vertical Bar — Sentiment (세로 형태) */}
          <Card title="Stacked Vertical Bar — Sentiment" subtitle="세로 스택형 — 각 카테고리를 컬럼으로 (부정=Red / 중립=Gray / 긍정=Lime)">
            <GroupedBarChart
              title="영역별 감성 분포"
              stacked
              colors={["#FF6467", "#E6E7E9", "#7CCF00"]}
              data={[
                { label: "응답 품질",      부정: 63, 중립: 8,  긍정: 29 },
                { label: "가격/한도",     부정: 56, 중립: 7,  긍정: 37 },
                { label: "UI/UX",       부정: 45, 중립: 15, 긍정: 40 },
                { label: "콘텐츠 품질",   부정: 33, 중립: 12, 긍정: 55 },
                { label: "편의성",        부정: 15, 중립: 10, 긍정: 75 },
              ]}
              keys={["부정", "중립", "긍정"]}
            />
          </Card>

          {/* KPI Trend Card — 텍스트 + 추이 차트 */}
          <Card title="KPI Trend Card — 텍스트 + 추이 라인" subtitle="좌측 KPI 블록 + 우측 미니 추이 차트 · 상승(blue) / 하락(red)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KPITrendCard
                title="UX 패턴 북마크 수"
                subtitle="관심을 갖고 저장해둔 UX 패턴 수예요."
                value="24건"
                delta={{ value: "+ 112%", positive: true }}
                variant="blue"
                suffix="건"
                data={[
                  { x: "11일", y: 12 },
                  { x: "12일", y: 18 },
                  { x: "13일", y: 20 },
                  { x: "14일", y: 19 },
                  { x: "15일", y: 22 },
                  { x: "16일", y: 25 },
                  { x: "17일", y: 30 },
                ]}
              />
              <KPITrendCard
                title="사용자 평균 체류시간"
                subtitle="페이지에 머문 평균 시간이에요."
                value="3분 12초"
                delta={{ value: "- 82%", positive: false }}
                variant="red"
                suffix="초"
                data={[
                  { x: "11일", y: 115 },
                  { x: "12일", y: 100 },
                  { x: "13일", y: 92 },
                  { x: "14일", y: 78 },
                  { x: "15일", y: 70 },
                  { x: "16일", y: 45 },
                  { x: "17일", y: 20 },
                ]}
              />
            </div>
          </Card>

          {/* Timeline Bar — Past/Current/Forecast */}
          <Card title="Timeline Bar — Past / Current / Forecast" subtitle="시계열 지표 · 과거(회색) · 현재(파랑+배경) · 미래 예측(빨강+배경)">
            <TimelineBarChart
              title="월별 이탈율 추이"
              data={[
                { label: "2021-10", value: 30.3, type: "past" },
                { label: "2021-11", value: 24,   type: "past" },
                { label: "2021-12", value: 18.4, type: "past" },
                { label: "2022-01", value: 25.1, type: "past" },
                { label: "2022-02", value: 26.3, type: "past" },
                { label: "2022-03", value: 23.1, type: "current" },
                { label: "2022-04", value: 24.8, type: "forecast" },
              ]}
            />
          </Card>

          {/* Vertical Bar - Single */}
          <Card title="Vertical Bar (Single)" subtitle="단일 막대 - 항목별 비교">
            <VBarChart
              title="Churn Rate by Cluster"
              height={280}
              data={[
                { label:"Premium Enthusiasts", value:65 },
                { label:"Dormant Potential", value:60 },
                { label:"Value Optimizers", value:55 },
                { label:"Occasional Buyers", value:45 },
              ]}
              keys={["value"]}
            />
          </Card>

          {/* Vertical Bar - Single (Blue) */}
          <Card title="Vertical Bar (Single) — Blue" subtitle="Blue 500 → 400 → 300 → 200 → 100 5단계 · 값 % 표기">
            <VBarChart
              title="별점 분포"
              height={280}
              colors={["#DBEAFE", "#BEDBFF", "#8EC5FF", "#51A2FF", "#2B7FFF"]}
              valueFormat={(v) => `${v}%`}
              data={[
                { label:"1점", value:28, count:5612 },
                { label:"2점", value:42, count:8419 },
                { label:"3점", value:54, count:10824 },
                { label:"4점", value:68, count:13631 },
                { label:"5점", value:82, count:16437 },
              ]}
              keys={["value"]}
            />
          </Card>

          {/* Vertical Bar - Single (Red) */}
          <Card title="Vertical Bar (Single) — Red" subtitle="Red 500 → 400 → 300 → 200 → 100 5단계 · 많은 값부터 내림차순 · 부정 지표 강조용">
            <VBarChart
              title="카테고리별 SLA 위반율 (24h 초과 비율)"
              height={280}
              colors={["#FB2C36", "#FF6467", "#FFA2A2", "#FFC9C9", "#FFE2E2"]}
              valueFormat={(v) => `${v}%`}
              data={[
                { label:"기능 오류", value:55, count:160 },
                { label:"결제/환불", value:35, count:133 },
                { label:"사용 방법", value:15, count:36 },
                { label:"일반 문의", value:8, count:9 },
                { label:"계정/인증", value:5, count:9 },
              ]}
              keys={["value"]}
            />
          </Card>

          {/* Vertical Bar - Stacked */}
          <Card title="Vertical Bar (Stacked)" subtitle="스택형 세로 막대 - 여러 시리즈 누적">
            <VBarChart
              title="Food Consumption by Country"
              stacked
              height={360}
              data={[
                { label:"AD", donut:40, fries:77, kebab:22, sandwich:35, burger:193, "hot dog":77 },
                { label:"AE", donut:164, fries:141, kebab:169, sandwich:111, burger:77, "hot dog":111 },
                { label:"AF", donut:70, fries:127, kebab:140, sandwich:111, burger:190, "hot dog":71 },
                { label:"AG", donut:113, fries:55, kebab:86, sandwich:134, burger:180, "hot dog":139 },
                { label:"AI", donut:121, fries:138, kebab:74, sandwich:106, burger:135, "hot dog":89 },
                { label:"AL", donut:172, fries:89, kebab:85, sandwich:80, burger:21, "hot dog":187 },
                { label:"AM", donut:136, fries:83, kebab:184, sandwich:24, burger:110, "hot dog":136 },
              ]}
              keys={["hot dog","burger","sandwich","kebab","fries","donut"]}
            />
          </Card>

          {/* Vertical Bar - Grouped */}
          <Card title="Vertical Bar (Grouped)" subtitle="그룹형 세로 막대 - 항목 간 비교">
            <VBarChart
              title="Satisfaction Score by Category"
              height={300}
              data={[
                { label:"디자인", "만족도":82, "기대치":70 },
                { label:"성능", "만족도":68, "기대치":85 },
                { label:"가격", "만족도":75, "기대치":60 },
                { label:"서비스", "만족도":90, "기대치":78 },
                { label:"편의성", "만족도":72, "기대치":65 },
              ]}
              keys={["만족도","기대치"]}
            />
          </Card>

          {/* Line / Area - Blue */}
          <Card title="Line / Area Chart (Blue)" subtitle="블루 라인 차트 - 시계열 추이 · metricType='count' (최소 표시 폭 자동)">
            <LineChart
              title="Monthly Revenue Trend"
              variant="blue"
              enableArea
              metricType="count"
              data={[{
                id: "Revenue",
                data: [
                  { x:"2024-01", y:1200 },
                  { x:"2024-02", y:1800 },
                  { x:"2024-03", y:2400 },
                  { x:"2024-04", y:3200 },
                  { x:"2024-05", y:2800 },
                  { x:"2024-06", y:3600 },
                ],
              }]}
            />
          </Card>

          {/* Line / Area - Red */}
          <Card title="Line / Area Chart (Red)" subtitle="레드 라인 차트 - 위험 지표 추이 · metricType='percent' · 호버 시 이탈 수 뱃지 · disableBadge 옵션 사용 시 x/y 기본 툴팁으로 대체 표시">
            <LineChart
              title="Churn Rate Trend"
              variant="red"
              enableArea
              metricType="percent"
              data={[{
                id: "Churn Rate",
                data: [
                  { x:"2024-05", y:77, churn: -12 },
                  { x:"2024-06", y:83, churn: -15 },
                  { x:"2024-07", y:90, churn: -18 },
                  { x:"2024-08", y:95, churn: -22 },
                  { x:"2024-09", y:100, churn: -28 },
                ],
              }]}
            />
          </Card>

          {/* Line Chart — Multi Series (CHART_COLORS 팔레트 자동 · 점선 크로스헤어 · x/y 키-값 툴팁 · curve=linear · 음수 스케일 지원 · 평균 시리즈 회색) */}
          <Card title="Line Chart — Multi Series" subtitle="여러 시리즈 비교 — CHART_COLORS 팔레트 자동 / linear 직선 / 음수 스케일 지원 / 점선 크로스헤어 / X,Y 좌표 툴팁 / 하단 가로 선형 범례 · 평균값 시리즈는 회색(#B6B8BD)으로 통일">
            <MultiLineChart
              title="지표 추이 (음수 스케일 포함)"
              curve="linear"
              data={[
                { id: "A", data: [
                  { x: "2017", y: 10 }, { x: "2018", y: 50 }, { x: "2019", y: 80 }, { x: "2020", y: 100 },
                ]},
                { id: "B", data: [
                  { x: "2017", y: 5 }, { x: "2018", y: 10 }, { x: "2019", y: 12 }, { x: "2020", y: 16 },
                ]},
                { id: "C", data: [
                  { x: "2017", y: -10 }, { x: "2018", y: -20 }, { x: "2019", y: -30 }, { x: "2020", y: -32 },
                ]},
                { id: "전체 평균", data: [
                  { x: "2017", y: 30 }, { x: "2018", y: 30 }, { x: "2019", y: 30 }, { x: "2020", y: 30 },
                ]},
              ]}
              colors={[...CHART_COLORS.slice(0, 3), "#B6B8BD"]}
            />
          </Card>

          {/* Labeled Line Chart */}
          <Card title="Labeled Line Chart" subtitle="데이터 포인트 라벨 + 하단 테이블 + 어노테이션">
            <LabeledLineChart
              title="AI 생성 정보/리뷰성 콘텐츠 신뢰도"
              series={[
                { id: "신뢰도 높음", color: "#2B7FFF", data: [
                  { x: "전체", y: 35.2 }, { x: "15~24세", y: 39.7 }, { x: "24~34세", y: 34.7 },
                  { x: "35~44세", y: 36.4 }, { x: "45~54세", y: 34.5 }, { x: "55~59세", y: 30.1 },
                ]},
                { id: "신뢰도 낮음", color: "#B0B3B8", labelColor: "#7B7E85", data: [
                  { x: "전체", y: 27.6 }, { x: "15~24세", y: 25.5 }, { x: "24~34세", y: 28.7 },
                  { x: "35~44세", y: 28.0 }, { x: "45~54세", y: 25.7 }, { x: "55~59세", y: 31.1 },
                ]},
              ]}
              categories={[
                { label: "전체", count: 3000 },
                { label: "15~24세", count: 466 },
                { label: "24~34세", count: 654 },
                { label: "35~44세", count: 667 },
                { label: "45~54세", count: 795 },
                { label: "55~59세", count: 418 },
              ]}
              annotations={[{ fromSeries: 1, toSeries: 0, index: 1 }]}
            />
          </Card>

          <Card title="Quadrant Chart (Segment Matrix)" subtitle="2×2 매트릭스 - 세그먼트 분석에 적합">
            <QuadrantChart
              title="Segment Matrix"
              yAxis={{ label: "Expectation", low: "Low", high: "High" }}
              xAxis={{ label: "Concern", low: "Low", high: "High" }}
              quadrants={[
                { label: "Cautious Adopter", value: "39.7", tag: "High expectation, High concern", color: T.lime100, labelColor: T.lime700 },
                { label: "Positive Adopter", value: "41.1", tag: "High expectation, Low concern", color: T.blue100, labelColor: T.blue500 },
                { label: "Negative Perceiver", value: "5.4", tag: "Low expectation, High concern", color: T.red100, labelColor: T.red700 },
                { label: "Low Interest", value: "13.8", tag: "Low expectation, Low concern", color: T.gray100, labelColor: T.gray800 },
              ]}
            />
          </Card>

          {/* Cluster Profile Table 은 ReportDemo (6. Tables) 로 이동됨 */}

          {/* Grouped Bar */}
          <Card title="Grouped Bar" subtitle="그룹형 세로 막대 - 여러 시리즈 비교">
            <GroupedBarChart
              title="Cluster Comparison"
              data={[
                { label:"Q1", revenue:120, cost:80, profit:40 },
                { label:"Q2", revenue:180, cost:95, profit:85 },
                { label:"Q3", revenue:220, cost:110, profit:110 },
                { label:"Q4", revenue:280, cost:130, profit:150 },
              ]}
              keys={["revenue","cost","profit"]}
            />
          </Card>

          {/* Stacked Bar */}
          <Card title="Stacked Bar" subtitle="스택형 세로 막대 - 구성비 누적">
            <GroupedBarChart
              title="Revenue Breakdown"
              stacked
              data={[
                { label:"Q1", product:60, service:35, other:25 },
                { label:"Q2", product:80, service:55, other:45 },
                { label:"Q3", product:90, service:70, other:60 },
                { label:"Q4", product:110, service:90, other:80 },
              ]}
              keys={["product","service","other"]}
            />
          </Card>

          {/* Grouped Bar — Negative Values (3년 × 3지표, 막대 외부 값 라벨 표기) */}
          <Card title="Grouped Bar — Negative Values" subtitle="음수 데이터 지원 · 매출액/영업이익/당기순이익 (2021·2022·2023) · 0 기준선 + 막대 외부 값 라벨 · CHART_COLORS 자동">
            <GroupedBarChart
              title="연도별 손익 추이 (단위: 억원)"
              showValueLabels
              data={[
                { label:"2021년", 매출액: 86,   영업이익: -778, 당기순이익: -783 },
                { label:"2022년", 매출액: 1276, 영업이익: -322, 당기순이익: -325 },
                { label:"2023년", 매출액: 2020, 영업이익: -9,   당기순이익: 15 },
              ]}
              keys={["매출액", "영업이익", "당기순이익"]}
            />
          </Card>

          {/* Radar */}
          <Card title="Radar Chart" subtitle="레이더 차트 - 다차원 지표 비교">
            <RadarChart
              title="Data Quality Score"
              data={[
                { category:"Privacy", score:85 },
                { category:"Traceability", score:72 },
                { category:"Operational Reliability", score:68 },
                { category:"Conciseness", score:90 },
                { category:"Contextuality", score:78 },
                { category:"Integrity", score:82 },
              ]}
              keys={["score"]}
            />
          </Card>

          {/* PSM */}
          <Card title="PSM Chart" subtitle="가격 수요 곡선 - 교차점 기반 최적 가격 분석">
            <PSMChart
              title="PSM 가격 수요 곡선 기반 주요 교차점 그래프"
              data={[
                { id:"Too Cheap", data:[{x:800,y:90},{x:1000,y:72},{x:1200,y:48},{x:1400,y:25},{x:1600,y:12},{x:1800,y:5},{x:2000,y:2},{x:2400,y:0},{x:3000,y:0}] },
                { id:"Cheap", data:[{x:800,y:95},{x:1000,y:82},{x:1200,y:62},{x:1400,y:40},{x:1600,y:22},{x:1800,y:10},{x:2000,y:4},{x:2400,y:1},{x:3000,y:0}] },
                { id:"Expensive", data:[{x:800,y:2},{x:1000,y:8},{x:1200,y:18},{x:1400,y:35},{x:1600,y:55},{x:1800,y:72},{x:2000,y:85},{x:2400,y:95},{x:3000,y:99}] },
                { id:"Too Expensive", data:[{x:800,y:0},{x:1000,y:2},{x:1200,y:6},{x:1400,y:15},{x:1600,y:28},{x:1800,y:45},{x:2000,y:62},{x:2400,y:82},{x:3000,y:95}] },
              ]}
              /* intersections 자동 계산 */
            />
          </Card>

          {/* Funnel Chart - 전환율 퍼널 */}
          <Card title="Funnel Chart" subtitle="단계별 전환율 + 이탈율 퍼널 차트">
            <FunnelChart
              title="사용자 전환 퍼널"
              steps={[
                { label: "앱 실행", value: 322341 },
                { label: "검색/탐색", value: 292343 },
                { label: "상품 클릭", value: 189520 },
                { label: "장바구니", value: 86250 },
                { label: "결제 시작", value: 52100 },
                { label: "결제 완료", value: 38420 },
              ]}
            />
          </Card>

          {/* Normal Distribution Chart - 이상치(Anomaly) 분포 */}
          <Card title="Normal Distribution Chart" subtitle="가우시안 종 곡선 + σ 구간 강조 — 이상치 예측·분포 시각화">
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              <NormalDistributionChart
                title="68-95-99.7 룰 (1σ / 2σ / 3σ)"
                sigmaRange={4}
                anomalyThreshold={2}
                zones={[
                  { from: -1, to: 1,  label: "68.27%", color: "#2B7FFF" },
                  { from: -2, to: -1, label: "13.59%", color: "#8EC5FF" },
                  { from: 1,  to: 2,  label: "13.59%", color: "#8EC5FF" },
                  { from: -3, to: -2, label: "2.14%",  color: "#C5C6CA" },
                  { from: 2,  to: 3,  label: "2.14%",  color: "#C5C6CA" },
                ]}
              />
              <NormalDistributionChart
                title="중앙 50% 구간 (-0.6745σ ~ +0.6745σ)"
                sigmaRange={4}
                zones={[
                  { from: -0.6745, to: 0.6745, label: "50%",   color: "#2B7FFF" },
                  { from: -2.698,  to: -0.6745, label: "24.65%", color: "#8EC5FF" },
                  { from: 0.6745,  to: 2.698,   label: "24.65%", color: "#8EC5FF" },
                ]}
                ticks={[-4, -3, -2.698, -1, -0.6745, 0, 0.6745, 1, 2.698, 3, 4]}
              />
            </div>
          </Card>

          {/* Combo Chart - 바 + 선 (이중 Y축) */}
          <Card title="Combo Chart (Bar + Line)" subtitle="이중 Y축: 주 지표(바) + 비교 지표(선)">
            <ComboChart
              title="연도별 매출액/종업원수 현황"
              data={[
                { label: "2016", bar: 955, line: 125 },
                { label: "2017", bar: 951, line: 105 },
                { label: "2018", bar: 951, line: 103 },
                { label: "2019", bar: 958, line: 95 },
                { label: "2020", bar: 956, line: 128 },
                { label: "2021", bar: 954, line: 102 },
                { label: "2022", bar: 955, line: 104 },
                { label: "2023", bar: 956, line: 95 },
              ]}
              barKey="bar"
              lineKey="line"
              barLabel="매출액(억원)"
              lineLabel="직원수(명)"
              barAxisLabel="매출액"
              lineAxisLabel="직원수"
            />
          </Card>

        </>}

        {page==="modal" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Modal</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Figma 11220:1004 · Backdrop + 중앙 정렬 다이얼로그. ESC / backdrop 클릭으로 닫힘.</p>
          </div>

          <Card title="Sizes" subtitle="xs 320 · sm 480 · md 640 · lg 960 · xl 1200 · radius 12">
            {/* 카드 안 미니 프리뷰 — 너비를 비례로 표현 */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-start", marginBottom: 16 }}>
              {[
                { key:"xs", label:"xs · 320", width: 88 },
                { key:"sm", label:"sm · 480", width: 132 },
                { key:"md", label:"md · 640", width: 176 },
                { key:"lg", label:"lg · 960", width: 220 },
                { key:"xl", label:"xl · 1200", width: 264 },
              ].map(s => (
                <ModalPreview
                  key={s.key}
                  width={s.width}
                  label={s.label}
                  hasDescription={true}
                  active={modalSize === s.key}
                  onClick={() => setModalSize(s.key)}
                />
              ))}
            </div>
            <div style={{ fontSize: 12, color: T.gray800 }}>미니 프리뷰 클릭 시 실제 크기 모달이 열립니다.</div>
          </Card>

          <Modal
            open={modalSize !== null}
            onClose={()=>setModalSize(null)}
            onConfirm={()=>setModalSize(null)}
            title={`제목 (${modalSize ?? ""})`}
            description={modalDesc ? "Description 텍스트입니다. 우측 상단 토글로 껐다 켰다 할 수 있어요." : undefined}
            size={modalSize ?? "sm"}
            actionType={modalActionType}
            buttonLayout={modalBtnLayout}
            buttonAlignment={modalBtnAlign}
            divider={modalDivider}
          >
            <div style={{ height:200, background:T.blue50, borderRadius:8 }} />
          </Modal>

          <Card title="Action Area" subtitle="description · type · buttonLayout · alignment 조합 — 선택 즉시 미니 프리뷰 반영">
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", alignItems:"flex-start" }}>
              {/* 좌측: 옵션 선택 */}
              <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth: 200, flex: "0 0 auto" }}>
                <div>
                  <p style={{ fontSize:12, color:T.gray800, margin:"0 0 6px", fontWeight:500 }}>Description</p>
                  <div style={{ display:"flex", gap:6 }}>
                    <PillBtn label="On" active={modalDesc===true} onClick={()=>setModalDesc(true)} />
                    <PillBtn label="Off" active={modalDesc===false} onClick={()=>setModalDesc(false)} />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:12, color:T.gray800, margin:"0 0 6px", fontWeight:500 }}>Type</p>
                  <div style={{ display:"flex", gap:6 }}>
                    {["dual","single"].map(v => (
                      <PillBtn key={v} label={v} active={modalActionType===v} onClick={()=>setModalActionType(v)} />
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:12, color:T.gray800, margin:"0 0 6px", fontWeight:500 }}>ButtonLayout</p>
                  <div style={{ display:"flex", gap:6 }}>
                    {["hug","fill"].map(v => (
                      <PillBtn key={v} label={v} active={modalBtnLayout===v} onClick={()=>setModalBtnLayout(v)} />
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize:12, color:T.gray800, margin:"0 0 6px", fontWeight:500 }}>ButtonAlignment</p>
                  <div style={{ display:"flex", gap:6 }}>
                    {["start","end","space-between"].map(v => (
                      <PillBtn key={v} label={v} active={modalBtnAlign===v} onClick={()=>setModalBtnAlign(v)} />
                    ))}
                  </div>
                </div>
                <Btn variant="solid-primary" size="md" onClick={()=>setModalActionOpen(true)}>현재 설정으로 모달 열기</Btn>
              </div>
              {/* 우측: 미니 프리뷰 — 옵션 변경 시 즉시 반영 */}
              <div style={{ flex: "1 1 280px", minWidth: 280 }}>
                <ModalPreview
                  width="100%"
                  label={`${modalActionType} · ${modalBtnLayout} · ${modalBtnAlign}`}
                  hasDescription={modalDesc}
                  footer={
                    <div style={{
                      display: "flex",
                      flexDirection: modalBtnLayout === "fill" ? "row" : "row",
                      gap: 6,
                      justifyContent:
                        modalBtnAlign === "start" ? "flex-start" :
                        modalBtnAlign === "space-between" ? "space-between" :
                        "flex-end",
                    }}>
                      {modalActionType === "dual" && (
                        <div style={{
                          flex: modalBtnLayout === "fill" ? 1 : "0 0 auto",
                          height: 24,
                          width: modalBtnLayout === "fill" ? undefined : 56,
                          background: T.white,
                          border: `1px solid ${T.gray200}`,
                          borderRadius: 6,
                        }} />
                      )}
                      <div style={{
                        flex: modalBtnLayout === "fill" ? 1 : "0 0 auto",
                        height: 24,
                        width: modalBtnLayout === "fill" ? undefined : 56,
                        background: T.gray990,
                        borderRadius: 6,
                      }} />
                    </div>
                  }
                />
              </div>
            </div>
          </Card>

          <Modal
            open={modalActionOpen}
            onClose={()=>setModalActionOpen(false)}
            onConfirm={()=>setModalActionOpen(false)}
            title="제목"
            description={modalDesc ? `${modalActionType} · ${modalBtnLayout} · ${modalBtnAlign}` : undefined}
            size="lg"
            actionType={modalActionType}
            buttonLayout={modalBtnLayout}
            buttonAlignment={modalBtnAlign}
            divider={modalDivider}
          >
            <div style={{ height:200, background:T.blue50, borderRadius:8 }} />
          </Modal>

          <Card title="Content Blocks" subtitle="모달 내부 레이아웃 — UserCard / Field / Stat / Grid (1~4단)">
            {/* 카드 안 미니 프리뷰 — 3가지 패턴 시각적으로 즉시 비교 */}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom: 16 }}>
              {/* Pattern 1: 유저 헤더 + Field 반복 */}
              <div onClick={()=>setModalContentOpen("user")} style={{
                cursor:"pointer", flex:"1 1 220px", minWidth:220,
                border:`1px solid ${T.gray200}`, borderRadius:12, padding:12, background:T.white,
                fontFamily:"Pretendard, sans-serif",
              }}>
                <div style={{ fontSize:10, fontWeight:600, color:T.gray800, marginBottom:8, textTransform:"uppercase", letterSpacing:0.4 }}>Pattern 1 · UserCard + Field</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", border:`1px solid ${T.gray200}`, borderRadius:8, marginBottom:8 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:T.gray100 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ height:8, width:"60%", background:T.gray200, borderRadius:2, marginBottom:4 }} />
                    <div style={{ height:6, width:"80%", background:T.gray100, borderRadius:2 }} />
                  </div>
                </div>
                <div style={{ background:T.gray50, borderRadius:8, padding:6, display:"flex", flexDirection:"column", gap:4 }}>
                  {[0,1,2].map(i => (
                    <div key={i}>
                      <div style={{ height:6, width:"40%", background:T.gray200, borderRadius:2, marginBottom:3 }} />
                      <div style={{ height:5, width:"90%", background:T.gray100, borderRadius:2 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern 2: 탭 + Persona + Overview Stat 그리드 */}
              <div onClick={()=>setModalContentOpen("stats")} style={{
                cursor:"pointer", flex:"1 1 220px", minWidth:220,
                border:`1px solid ${T.gray200}`, borderRadius:12, padding:12, background:T.white,
                fontFamily:"Pretendard, sans-serif",
              }}>
                <div style={{ fontSize:10, fontWeight:600, color:T.gray800, marginBottom:8, textTransform:"uppercase", letterSpacing:0.4 }}>Pattern 2 · Tab + Persona + Stats</div>
                {/* tab */}
                <div style={{ display:"flex", gap:2, marginBottom:8 }}>
                  <div style={{ flex:1, height:18, background:T.gray990, borderRadius:4, color:T.white, fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:0.2 }}>카테고리 1</div>
                  <div style={{ flex:1, height:18, background:T.gray100, borderRadius:4, color:T.gray800, fontSize:9, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:0.2 }}>카테고리 2</div>
                  <div style={{ flex:1, height:18, background:T.gray100, borderRadius:4, color:T.gray800, fontSize:9, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:0.2 }}>카테고리 3</div>
                </div>
                {/* persona label (primary) */}
                <div style={{ fontSize:9, fontWeight:600, color:T.blue500, marginBottom:4 }}>Persona</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 6px", border:`1px solid ${T.gray200}`, borderRadius:6, marginBottom:8 }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background:T.gray100 }} />
                  <div style={{ flex:1, height:6, background:T.gray200, borderRadius:2 }} />
                </div>
                {/* overview label (primary) + wrapping */}
                <div style={{ fontSize:9, fontWeight:600, color:T.blue500, marginBottom:4 }}>Overview</div>
                <div style={{ background:T.gray50, borderRadius:8, padding:6, display:"flex", flexDirection:"column", gap:4 }}>
                  <div style={{ display:"flex", gap:4 }}>
                    <div style={{ flex:1, height:18, background:T.white, border:`1px solid ${T.gray200}`, borderRadius:4 }} />
                    <div style={{ flex:1, height:18, background:T.white, border:`1px solid ${T.gray200}`, borderRadius:4 }} />
                  </div>
                  <div style={{ height:14, background:T.white, border:`1px solid ${T.gray200}`, borderRadius:4 }} />
                </div>
              </div>

              {/* Pattern 3: 4단 Stat 그리드 */}
              <div onClick={()=>setModalContentOpen("4col")} style={{
                cursor:"pointer", flex:"1 1 220px", minWidth:220,
                border:`1px solid ${T.gray200}`, borderRadius:12, padding:12, background:T.white,
                fontFamily:"Pretendard, sans-serif",
              }}>
                <div style={{ fontSize:10, fontWeight:600, color:T.gray800, marginBottom:8, textTransform:"uppercase", letterSpacing:0.4 }}>Pattern 3 · 4-col Stats</div>
                {/* 1. Tab 카테고리 */}
                <div style={{ display:"flex", gap:2, marginBottom:16 }}>
                  <div style={{ flex:1, height:18, background:T.gray990, borderRadius:4, color:T.white, fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:0.2 }}>카테고리 1</div>
                  <div style={{ flex:1, height:18, background:T.gray100, borderRadius:4, color:T.gray800, fontSize:9, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:0.2 }}>카테고리 2</div>
                  <div style={{ flex:1, height:18, background:T.gray100, borderRadius:4, color:T.gray800, fontSize:9, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", letterSpacing:0.2 }}>카테고리 3</div>
                </div>
                {/* 2. Chip 형태 카테고리 탭 */}
                <div style={{ display:"flex", gap:4, marginBottom:8, flexWrap:"wrap" }}>
                  <div style={{ height:16, padding:"0 8px", background:T.gray990, borderRadius:99, color:T.white, fontSize:9, fontWeight:600, display:"inline-flex", alignItems:"center", letterSpacing:0.2 }}>칩 1</div>
                  <div style={{ height:16, padding:"0 8px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:99, color:T.gray800, fontSize:9, fontWeight:500, display:"inline-flex", alignItems:"center", letterSpacing:0.2 }}>칩 2</div>
                  <div style={{ height:16, padding:"0 8px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:99, color:T.gray800, fontSize:9, fontWeight:500, display:"inline-flex", alignItems:"center", letterSpacing:0.2 }}>칩 3</div>
                </div>
                {/* 3. 4-col grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:4 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ background:T.gray50, borderRadius:6, padding:6 }}>
                      <div style={{ height:5, width:"70%", background:T.gray200, borderRadius:2, marginBottom:3 }} />
                      <div style={{ height:8, width:"50%", background:T.gray990, borderRadius:2 }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:8, height:30, background:T.gray50, borderRadius:6 }} />
              </div>
            </div>
          </Card>

          {/* Pattern 1: 유저 카드 + Field 반복 (Synthetic Respondent Samples) */}
          <Modal
            open={modalContentOpen === "user"}
            onClose={()=>setModalContentOpen(null)}
            title="Synthetic Respondent Samples"
            size="lg"
            actionType="single"
            confirmLabel="Close"
            onConfirm={()=>setModalContentOpen(null)}
          >
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <ModalUserCard
                icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
                name="Kim Seoyeon"
                subtitle="Female, Age 28, Marketing Manager"
              />
              <div style={{
                display:"flex", flexDirection:"column", gap:8, padding:8,
                borderRadius:16, background:T.gray50,
              }}>
                <ModalField label="Personality Traits" style={{ border: "none" }}>
                  Early adopter highly sensitive to trends, actively exploring new services. Values efficiency and carefully analyzes price-to-quality ratios.
                </ModalField>
                <ModalField label="Lifestyle" style={{ border: "none" }}>
                  Frequent overtime on weekdays leads to concentrated content consumption on weekends. Mobile viewing during 2-hour daily commute.
                </ModalField>
                <ModalField label="Consumption Patterns" style={{ border: "none" }}>
                  Average monthly entertainment spending: $85. High willingness to pay for premium services. Started 3 new subscriptions in past 6 months.
                </ModalField>
              </div>
            </div>
          </Modal>

          {/* Pattern 2: 탭 + 2단 Stat 그리드 (Detailed Analysis) */}
          <Modal
            open={modalContentOpen === "stats"}
            onClose={()=>setModalContentOpen(null)}
            title="Detailed Analysis"
            size="lg"
            actionType="single"
            confirmLabel="Close"
            onConfirm={()=>setModalContentOpen(null)}
          >
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              <TabBar
                tabs={["Customer Overview", "Behavior Insights", "Strategic Analysis"]}
                activeIndex={modalContentTab}
                onChange={setModalContentTab}
              />
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:T.gray990, marginBottom:8 }}>Persona</div>
                  <ModalUserCard
                    icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
                    name="Premium Enthusiasts"
                    subtitle="Early adopters driven by quality and brand value."
                  />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:T.gray990, marginBottom:8 }}>Overview</div>
                  <div style={{
                    display:"flex", flexDirection:"column", gap:8, padding:8,
                    borderRadius:16, background:T.gray50,
                  }}>
                    <ModalGrid columns={2}>
                      <ModalStat label="Size" value="28.4K" unit="users" style={{ border: "none" }} />
                      <ModalStat label="Average Age" value="35 – 45" style={{ border: "none" }} />
                    </ModalGrid>
                    <ModalField label="Gender Distribution" style={{ border: "none" }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:16 }}>
                        <div><strong style={{ fontSize:16, color:T.gray990 }}>62%</strong> <span style={{ color:T.gray800, fontSize:13 }}> female</span></div>
                        <div style={{ width:1, height:12, background:T.gray200 }} />
                        <div><strong style={{ fontSize:16, color:T.gray990 }}>38%</strong> <span style={{ color:T.gray800, fontSize:13 }}> male</span></div>
                      </div>
                    </ModalField>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          {/* Pattern 3: Tabs + Chip Tabs + 다중 Stat 그리드 */}
          <Modal
            open={modalContentOpen === "4col"}
            onClose={()=>setModalContentOpen(null)}
            title="Detailed Analysis"
            size="lg"
            actionType="single"
            confirmLabel="Close"
            onConfirm={()=>setModalContentOpen(null)}
          >
            {(() => {
              const cardStyle = {
                background: T.white, borderRadius: 12, padding: 20,
                display: "flex", flexDirection: "column", gap: 12,
                flex: 1, minWidth: 0,
              };
              const cardLabel = {
                fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray800,
              };
              const Bullet = ({ alignTop }) => (
                <div style={{ display:"flex", alignItems: alignTop ? "flex-start" : "center", paddingTop: alignTop ? 8 : 0 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.gray400, flexShrink: 0 }} />
                </div>
              );
              const BulletRow = ({ label, value }) => (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Bullet />
                  <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 14, lineHeight: "20px", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 500, color: T.gray990 }}>{label}</span>
                    {value && <span style={{ fontWeight: 400, color: T.gray800 }}>{value}</span>}
                  </div>
                </div>
              );
              const BulletStack = ({ title, sub }) => (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Bullet alignTop />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990 }}>{title}</div>
                    {sub && <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: T.gray800 }}>{sub}</div>}
                  </div>
                </div>
              );
              const grayContainer = {
                background: T.gray50, border: `1px solid ${T.gray100}`, borderRadius: 16,
                padding: 8, display: "flex", flexDirection: "column", gap: 8,
              };
              const StatCard = ({ label, value, unit }) => (
                <div style={cardStyle}>
                  <div style={cardLabel}>{label}</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "baseline" }}>
                    <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990, whiteSpace: "nowrap" }}>{value}</span>
                    {unit && <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800 }}>{unit}</span>}
                  </div>
                </div>
              );

              const renderChip0 = () => (
                <div style={grayContainer}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <StatCard label="Average Order Value" value="₩ 421,000" />
                    <StatCard label="Purchase Frequency" value="2.3" unit="purchases /mo (27.6 /yr)" />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <StatCard label="Total Annual Spend" value="₩ 11,619,600" />
                    <StatCard label="Predicted LTV (12-Month Forecast)" value="₩ 8,450,000" />
                  </div>
                </div>
              );

              const renderChip1 = () => (
                <>
                  <div style={grayContainer}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={cardStyle}>
                        <div style={cardLabel}>Preferred Categories (Purchase Share)</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <BulletRow label="Fashion" value="42%" />
                          <BulletRow label="Beauty" value="28%" />
                          <BulletRow label="Home Décor" value="18%" />
                          <BulletRow label="Electronics" value="8%" />
                          <BulletRow label="Others" value="4%" />
                        </div>
                      </div>
                      <div style={cardStyle}>
                        <div style={cardLabel}>Brand Preferences</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <BulletStack title="Chanel, Dior, Hermès, Burberry, Gucci" sub="Top 5 Brands Purchased" />
                          <BulletStack title="High" sub="Brand Loyalty" />
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <Bullet alignTop />
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: T.gray800 }}>New Brand Adoption</div>
                              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990 }}>34%</span>
                                <Badge label="Early Adopter" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={cardStyle}>
                        <div style={cardLabel}>Purchase Timing</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <BulletRow label="Weekday Evenings" value="45% (7–10 PM)" />
                          <BulletRow label="Weekends" value="38% (Sat–Sun Afternoons)" />
                          <BulletRow label="Weekday Daytime" value="12% (Lunchtime)" />
                          <BulletRow label="Others" value="5%" />
                        </div>
                      </div>
                      <div style={cardStyle}>
                        <div style={cardLabel}>Seasonality Trends</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <BulletRow label="Higher Activity in Spring & Fall" />
                          <BulletRow label="Lower Spend During Sale Seasons" />
                          <BulletRow label="Full-Price Purchases Dominant" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={grayContainer}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={cardStyle}>
                        <div style={cardLabel}>Channel Preference</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <BulletRow label="Online" value="78% (Mobile App 62%, Web 16%)" />
                          <BulletRow label="Offline" value="22% (Premium Store Visits)" />
                        </div>
                      </div>
                      <div style={cardStyle}>
                        <div style={cardLabel}>Device Usage</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <BulletRow label="iOS" value="84% (iPhone, iPad)" />
                          <BulletRow label="Android" value="12%" />
                          <BulletRow label="PC" value="4%" />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ ...cardStyle, flex: "0 0 calc(50% - 4px)" }}>
                        <div style={cardLabel}>Payment Methods</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <BulletRow label="Credit Cards (Premium)" value="67% (Platinum / Black Cards)" />
                          <BulletRow label="Digital Wallets" value="28% (Apple Pay, Samsung Pay)" />
                          <BulletRow label="Others" value="5%" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );

              const renderChip2 = () => (
                <div style={grayContainer}>
                  <div style={cardStyle}>
                    <div style={cardLabel}>Core Values</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <BulletStack title="“Quality is an investment.”" sub="Willing to pay more when value is clear" />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Bullet />
                        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990 }}>Values brand story and heritage</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Bullet />
                        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990 }}>Seeks exclusivity and differentiated experiences</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Bullet />
                        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990 }}>Consumes as a form of self-expression and social identity</span>
                      </div>
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={cardLabel}>Purchase Consistency</div>
                    <div style={{
                      background: T.gray50, borderRadius: 12,
                      padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                    }}>
                      <span style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: T.gray990 }}>0.89</span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", padding: "2px 6px",
                        border: `1px solid #2B7FFF`, borderRadius: 8,
                        fontSize: 12, fontWeight: 500, lineHeight: "16px", color: "#2B7FFF",
                      }}>Very High</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <BulletStack title="Regular buying pattern" sub="about 2–3 purchases per month" />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Bullet />
                        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990 }}>Predictable and stable spending behavior</span>
                      </div>
                    </div>
                  </div>
                </div>
              );

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <TabBar
                    tabs={["Customer Overview", "Behavior Insights", "Strategic Analysis"]}
                    activeIndex={modalContent4colTab}
                    onChange={setModalContent4colTab}
                  />
                  <ChipTabs
                    tabs={["Purchase Behavior Metrics", "Preference & Patterns", "Behavioral Traits & Psychographic Profile"]}
                    activeIndex={modalContent4colChip}
                    onChange={setModalContent4colChip}
                  />
                  {modalContent4colChip === 0 && renderChip0()}
                  {modalContent4colChip === 1 && renderChip1()}
                  {modalContent4colChip === 2 && renderChip2()}
                </div>
              );
            })()}
          </Modal>
        </>}

        {page==="tooltip" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Tooltip</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Figma 11235:164 · Dark / Light variant · 12 placement · hover trigger.</p>
          </div>

          {/* Hover 상호작용 */}
          <Card title="Hover 상호작용" subtitle="마우스를 올리면 노출됩니다">
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", padding:"30px 24px" }}>
              <Tooltip variant="dark" content="Copy" shortcut="⌘C">
                <Btn variant="solid-secondary" size="md">Copy</Btn>
              </Tooltip>
              <Tooltip variant="light" content="Paste" shortcut="⌘V">
                <Btn variant="solid-secondary" size="md">Paste</Btn>
              </Tooltip>
              <Tooltip variant="dark" title="Delete item" description="이 항목을 영구적으로 삭제합니다." placement="right">
                <Btn variant="solid-secondary" size="md">Delete</Btn>
              </Tooltip>
            </div>
          </Card>

          {/* Figma 376:126408 — Requirement 케이스 (Dark + Light × Label + Icon × Left + Right) */}
          <Card
            title="Requirement 케이스 (Figma 376:126408)"
            subtitle="아래로 나오는 단일 툴팁. 트리거가 왼쪽이면 좌측정렬(bottom-start), 오른쪽이면 우측정렬(bottom-end)."
          >
            <div style={{ display:"flex", flexDirection:"column", gap:40, padding:"32px 24px" }}>

              {/* Row 1: Dark + Label */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                  <span style={{ fontSize:12, color:T.gray800 }}>Requirement</span>
                  <Tooltip variant="dark" content="Required columns are essential for running Agent Analysis." placement="bottom-start" open>
                    <span style={{ width:0, height:0 }} />
                  </Tooltip>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ fontSize:12, color:T.gray800 }}>Requirement</span>
                  <Tooltip variant="dark" content="Required columns are essential for running Agent Analysis." placement="bottom-end" open>
                    <span style={{ width:0, height:0 }} />
                  </Tooltip>
                </div>
              </div>

              {/* Row 2: Dark + Icon */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ display:"flex", justifyContent:"flex-start" }}>
                  <Tooltip variant="dark" content="Required columns are essential for running Agent Analysis." placement="bottom-start" open>
                    <span style={{ display:"inline-flex", alignItems:"center", cursor:"help" }}>
                      <InfoIcon size={16} color={T.gray800} />
                    </span>
                  </Tooltip>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <Tooltip variant="dark" content="Required columns are essential for running Agent Analysis." placement="bottom-end" open>
                    <span style={{ display:"inline-flex", alignItems:"center", cursor:"help" }}>
                      <InfoIcon size={16} color={T.gray800} />
                    </span>
                  </Tooltip>
                </div>
              </div>

              {/* Row 3: Light + Label */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                  <span style={{ fontSize:12, color:T.gray800 }}>Requirement</span>
                  <Tooltip variant="light" content="Required columns are essential for running Agent Analysis." placement="bottom-start" open>
                    <span style={{ width:0, height:0 }} />
                  </Tooltip>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ fontSize:12, color:T.gray800 }}>Requirement</span>
                  <Tooltip variant="light" content="Required columns are essential for running Agent Analysis." placement="bottom-end" open>
                    <span style={{ width:0, height:0 }} />
                  </Tooltip>
                </div>
              </div>

              {/* Row 4: Light + Icon */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ display:"flex", justifyContent:"flex-start" }}>
                  <Tooltip variant="light" content="Required columns are essential for running Agent Analysis." placement="bottom-start" open>
                    <span style={{ display:"inline-flex", alignItems:"center", cursor:"help" }}>
                      <InfoIcon size={16} color={T.gray800} />
                    </span>
                  </Tooltip>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <Tooltip variant="light" content="Required columns are essential for running Agent Analysis." placement="bottom-end" open>
                    <span style={{ display:"inline-flex", alignItems:"center", cursor:"help" }}>
                      <InfoIcon size={16} color={T.gray800} />
                    </span>
                  </Tooltip>
                </div>
              </div>

            </div>
          </Card>

          {/* Visual Tooltip (Figma 11235:164) — 이미지 + 제목 + 설명 + 화살표, 240w */}
          <Card
            title="Visual Tooltip (Figma 11235:164)"
            subtitle="이미지 + 제목 + 설명. dark bg · width 240 · radius 8 · padding 8/8/10 · arrow 4px gap"
          >
            {/* Controls */}
            <RowGroup label="옵션">
              <Toggle label="Description" on={vtDesc} onClick={()=>setVtDesc(v=>!v)}/>
            </RowGroup>

            {/* Preview — 항상 열려 있는 기본 예시 (right 방향 → 아래 영역 안 침범) */}
            <div style={{
              display:"flex", alignItems:"center",
              gap:0,
              padding:"32px 24px",
              borderBottom:`1px solid ${T.gray100}`,
              minHeight: 220,
            }}>
              <Tooltip
                variant="dark"
                image={true}
                title="텍스트를 입력해 주세요."
                description={vtDesc ? "안내 텍스트를 입력해 주세요." : undefined}
                placement="right"
                open
              >
                <div style={{
                  width:100, height:60,
                  background:T.gray100, borderRadius:8,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, color:T.gray800, fontFamily:"Pretendard, sans-serif",
                }}>Preview</div>
              </Tooltip>
            </div>

            {/* Placement 12종 — 호버로 개별 확인 */}
            <div style={{ padding:"24px 24px 8px 24px" }}>
              <p style={{ fontSize:12, color:T.gray800, margin:"0 0 16px" }}>Placement 12종 — 트리거에 호버하세요.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }}>
                {[
                  "top-start","top","top-end","right-start",
                  "bottom-start","bottom","bottom-end","right",
                  "left-start","left","left-end","right-end",
                ].map(p => (
                  <div key={p} style={{ display:"flex", justifyContent:"center" }}>
                    <Tooltip
                      variant="dark"
                      image={true}
                      title="텍스트를 입력해 주세요."
                      description={vtDesc ? "안내 텍스트를 입력해 주세요." : undefined}
                      placement={p}
                    >
                      <div style={{
                        width:100, height:60,
                        background:T.gray100, borderRadius:8,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, color:T.gray800, fontFamily:"Pretendard, sans-serif",
                        cursor:"help",
                      }}>{p}</div>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </Card>


          {/* 기존 Chart Tooltip 5종 — 참고용 스타일 프리뷰 */}
          <Card title="Chart Tooltips (A~E)" subtitle="차트 호버 시 사용되는 스타일 프리뷰 — 공통: 배경 #FFF · border gray200 · radius 6 · padding 10/12 · shadow 0 6 20 rgba(0,0,0,.1)">
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
              {/* Style A */}
              <div>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px" }}>Style A — 상단 라벨 + 하단 값</p>
                <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:6, padding:"10px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:6, boxShadow:"0 6px 20px rgba(0,0,0,0.1)", fontFamily:"Pretendard, sans-serif", whiteSpace:"nowrap" }}>
                  <span style={{ fontSize:14, fontWeight:500, lineHeight:"20px", color:T.gray800 }}>2026년 3월</span>
                  <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990 }}>-18 pt</span>
                </div>
              </div>
              {/* Style B */}
              <div>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px" }}>Style B — Label + Value + Badge</p>
                <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:6, padding:"10px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:6, boxShadow:"0 6px 20px rgba(0,0,0,0.1)", fontFamily:"Pretendard, sans-serif", whiteSpace:"nowrap" }}>
                  <span style={{ fontSize:14, fontWeight:500, lineHeight:"20px", color:T.gray800 }}>2026년 3월</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990 }}>1,248</span>
                    <span style={{ display:"inline-flex", alignItems:"center", height:24, padding:"4px 6px", borderRadius:8, background:"#FEF2F2", color:T.red500, fontSize:12, fontWeight:500, lineHeight:"16px" }}>-42명 이탈</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
              {/* Style C */}
              <div>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px" }}>Style C — Multi Series with dot</p>
                <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"flex-start", gap:6, padding:"10px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:6, boxShadow:"0 6px 20px rgba(0,0,0,0.1)", fontFamily:"Pretendard, sans-serif", whiteSpace:"nowrap" }}>
                  <span style={{ fontSize:14, fontWeight:500, lineHeight:"20px", color:T.gray800 }}>35~44세</span>
                  <div style={{ display:"grid", gridTemplateColumns:"max-content max-content", columnGap:16, rowGap:4, alignItems:"center" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:CHART_COLORS[0], flexShrink:0 }} />
                      <span style={{ fontSize:14, fontWeight:500, color:T.gray800 }}>신뢰도 높음</span>
                    </span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990, justifySelf:"end" }}>28.0</span>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:"#B0B3B8", flexShrink:0 }} />
                      <span style={{ fontSize:14, fontWeight:500, color:T.gray800 }}>신뢰도 낮음</span>
                    </span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990, justifySelf:"end" }}>36.4</span>
                  </div>
                </div>
              </div>
              {/* Style D */}
              <div>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px" }}>Style D — Funnel Multi-Row</p>
                <div style={{ display:"inline-flex", flexDirection:"column", gap:6, padding:"10px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:6, boxShadow:"0 6px 20px rgba(0,0,0,0.1)", fontFamily:"Pretendard, sans-serif", whiteSpace:"nowrap" }}>
                  <div style={{ fontSize:14, fontWeight:500, lineHeight:"20px", color:T.gray800 }}>Step 3: 결제 완료</div>
                  <div style={{ display:"grid", gridTemplateColumns:"max-content max-content", columnGap:16, rowGap:4, alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:400, lineHeight:"20px", color:T.gray800 }}>유저 수</span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990, justifySelf:"end" }}>1,248</span>
                    <span style={{ fontSize:14, fontWeight:400, lineHeight:"20px", color:T.gray800 }}>전환율</span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.blue500, justifySelf:"end" }}>68.4%</span>
                    <span style={{ fontSize:14, fontWeight:400, lineHeight:"20px", color:T.gray800 }}>직전 대비 이탈</span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.red500, justifySelf:"end" }}>-192 (13.3%)</span>
                  </div>
                </div>
              </div>
              {/* Style E */}
              <div>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px" }}>Style E — Combo (Bar + Line)</p>
                <div style={{ display:"inline-flex", flexDirection:"column", gap:6, padding:"10px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:6, boxShadow:"0 6px 20px rgba(0,0,0,0.1)", fontFamily:"Pretendard, sans-serif", whiteSpace:"nowrap" }}>
                  <div style={{ fontSize:14, fontWeight:500, lineHeight:"20px", color:T.gray800 }}>2023</div>
                  <div style={{ display:"grid", gridTemplateColumns:"max-content max-content", columnGap:16, rowGap:4, alignItems:"center" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:20, display:"inline-flex", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ width:16, height:10, background:CHART_COLORS[0], display:"inline-block", borderRadius:2 }} />
                      </span>
                      <span style={{ fontSize:14, fontWeight:500, color:T.gray800 }}>매출액(억원)</span>
                    </span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990, justifySelf:"end" }}>956</span>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
                      <svg width={20} height={12} style={{ display:"inline-block", flexShrink:0 }}>
                        <line x1={0} y1={6} x2={20} y2={6} stroke={CHART_COLORS[1]} strokeWidth={2.5} />
                        <circle cx={10} cy={6} r={5} fill={T.white} stroke={CHART_COLORS[1]} strokeWidth={2.5} />
                      </svg>
                      <span style={{ fontSize:14, fontWeight:500, color:T.gray800 }}>직원수(명)</span>
                    </span>
                    <span style={{ fontSize:16, fontWeight:600, lineHeight:"24px", color:T.gray990, justifySelf:"end" }}>95</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </Card>
        </>}

        {page==="icons" && <IconsTab />}

        {page==="report" && <Suspense fallback={<div style={{padding:40,color:T.gray800}}>Loading...</div>}><ReportDemo /></Suspense>}

        {page==="ui" && <UIPage />}

        {page==="thumbnails" && <Suspense fallback={<div style={{padding:40,color:T.gray800}}>Loading...</div>}><AgentThumbnails /></Suspense>}

        {page==="reports" && <>
          <Card title="완료된 리포트" subtitle="토픽별 리포트 안에서 데이터 사례나 분석 변형을 골라 확인할 수 있습니다.">
            {(() => {
              const reportsByCategory = [
                {
                  category: "Customer Success",
                  badgeVariant: "Brand",
                  topics: [{
                    title: "리뷰 분석",
                    description: "VOC 데이터의 별점·감성·영역별 분포로 만족 동력과 부정 토픽을 진단",
                    variants: [
                      { name: "쿠팡 캐리어 리뷰", subtitle: "이커머스 제품 리뷰 1,000건", route: "/#/coupang", jsonPath: "/json/coupang.json" },
                      { name: "ChatGPT 리뷰",    subtitle: "AI 서비스 한국어 리뷰",     route: "/#/chatgpt", jsonPath: "/json/chatgpt.json" },
                    ],
                  }],
                },
                {
                  category: "Operations",
                  badgeVariant: "Brand",
                  topics: [{
                    title: "고객센터 티켓 분석",
                    description: "CS 티켓 처리시간·SLA·채널별 성과 진단",
                    variants: [
                      { name: "기본 사례", subtitle: "처리시간·우선순위·채널 분포", route: "/#/cs", jsonPath: "/json/cs.json" },
                    ],
                  }],
                },
                {
                  category: "Marketing",
                  badgeVariant: "Positive",
                  topics: [{
                    title: "광고 성과 분석",
                    description: "매체·캠페인별 효율을 진단하고 예산 재배분 방향 제시",
                    variants: [
                      { name: "CPA 중심",   subtitle: "전환수만 있을 때 — 비용 효율(CPA·CTR·CVR) 기반", route: "/#/ad",      jsonPath: "/json/ad-performance.json" },
                      { name: "ROAS 포함", subtitle: "매출 데이터까지 있을 때 — 수익성(ROAS) 추가 진단", route: "/#/ad-roas", jsonPath: "/json/ad-roas.json" },
                    ],
                  }],
                },
                {
                  category: "Negative Case",
                  badgeVariant: "Negative",
                  topics: [{
                    title: "이탈 예측 (Churn)",
                    description: "신규 가입자의 시청 행동 신호로 이탈 위험 군집 식별 + 리텐션 시나리오 제시",
                    variants: [
                      { name: "Global SVOD", subtitle: "OTT 신규 가입자 60K — 군집·신호·전략·매출 시나리오", route: "/#/churn", jsonPath: "/json/churn-prediction.json" },
                    ],
                  }],
                },
                {
                  category: "Persona Survey",
                  badgeVariant: "Info",
                  topics: [{
                    title: "페르소나 서베이",
                    description: "CUBIG DB 연동 가상 인구 시뮬레이션 기반 응답 분포·해석·합성 응답자 카드 + 상관 패턴",
                    variants: [
                      { name: "AI Wellness Membership", subtitle: "5K 가상 응답자 — 인구 분포 / 질문별 분석 / 패턴 교차", route: "/#/persona", jsonPath: "/json/persona-survey.json" },
                    ],
                  }],
                },
                {
                  category: "Audience Strategy",
                  badgeVariant: "Positive",
                  topics: [{
                    title: "오디언스 전략",
                    description: "120K 고객 4 페르소나 클러스터 + 시나리오 비교(보수/기준/공격) + 30일 실행 로드맵 + 세그먼트 상세 모달",
                    variants: [
                      { name: "Luxury Beauty & Fashion", subtitle: "분석 리포트 + 오디언스 확장 2탭", route: "/#/audience", jsonPath: "/json/audience-strategy.json" },
                    ],
                  }],
                },
                {
                  category: "Pricing",
                  badgeVariant: "Cautionary",
                  topics: [{
                    title: "신제품 가격 전략 (PSM)",
                    description: "PSM 4 곡선으로 PMC·OPP·IPP·PME 도출 + 진입/메인/프리미엄 3옵션 + 페르소나 인구·예산 매칭",
                    variants: [
                      { name: "Premium OLED 65\" TV", subtitle: "PSM 분석 200명 응답 + 가격 전략 인사이트", route: "/#/pricing", jsonPath: "/json/new-pricing-product.json" },
                    ],
                  }],
                },
              ];
              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: 16 }}>
                  {reportsByCategory.flatMap(cat => cat.topics.map((topic, ti) => (
                    <div key={`${cat.category}-${ti}`} style={{
                      border: `1px solid ${T.gray200}`, borderRadius: 16, padding: 24,
                      background: T.white, display: "flex", flexDirection: "column", gap: 16,
                    }}>
                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <Badge type="Solid" variant={cat.badgeVariant} size="Medium" text={cat.category} />
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: T.gray990, lineHeight: "28px", marginBottom: 4 }}>{topic.title}</div>
                        <div style={{ fontSize: 14, fontWeight: 400, color: T.gray800, lineHeight: "22px" }}>{topic.description}</div>
                      </div>
                      <div style={{ height: 1, background: T.gray100 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {topic.variants.map((v, vi) => (
                          <div key={vi} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: T.gray990, marginBottom: 2 }}>{v.name}</div>
                              <div style={{ fontSize: 13, fontWeight: 400, color: T.gray800, lineHeight: "20px" }}>{v.subtitle}</div>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                              <Btn variant="solid-primary" size="md" onClick={() => window.open(`${window.location.origin}${v.route}`, "_blank")}>Preview</Btn>
                              <Btn variant="solid-secondary" size="md" onClick={() => window.open(`${window.location.origin}${v.jsonPath}`, "_blank")} disabled={!v.jsonPath}>JSON</Btn>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )))}
                </div>
              );
            })()}
          </Card>
        </>}
      </div>
    </div>
  );
}
