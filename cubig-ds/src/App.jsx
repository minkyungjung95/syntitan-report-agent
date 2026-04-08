import { useState } from "react";
import { DonutChart, HBarChart, VBarChart, StackedHBar, LineChart, CHART_COLORS } from "./charts";

// ─── Design Tokens (컬러칩 HTML 1:1 매핑) ────────────────────────────────
const T = {
  gray990:"#171719", gray950:"#303135", gray800:"#7B7E85",
  gray400:"#CACCCF", gray300:"#DCDDDF", gray200:"#E6E7E9",
  gray100:"#F0F0F2", gray50:"#F7F7F8",  white:"#FFFFFF",
  black:"#000000", strong:"#0F0F10",
  purple900:"#59168B", purple800:"#6E11B0", purple700:"#8200DB",
  purple500:"#AD46FF", purple100:"#F3E8FF", purple50:"#FAF5FF",
  dp700:"#6C58BE", dp600:"#7A65D0", dp500:"#8A77E0",
  dp300:"#B5ABF2", dp100:"#EFEBFF",
  green900:"#0D542B", green600:"#00A63E", green500:"#00C950",
  green400:"#05DF72", green50:"#F0FDF4",
  red900:"#82181A",  red600:"#E7000B",  red500:"#FB2C36", red50:"#FEF2F2",
  orange50:"#fff7ed", orange:"#ff6900",
  yellow400:"#FDC700", yellow50:"#FEFCE8",
  blue600:"#155DFC", blue500:"#2B7FFF", blue50:"#EFF6FF",
};

// ─── Icons ────────────────────────────────────────────────────────────────
const InfoIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2"/>
    <rect x="7.3" y="6.8" width="1.4" height="4.6" rx="0.7" fill={color}/>
    <circle cx="8" cy="4.8" r="0.8" fill={color}/>
  </svg>
);
const WarnIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
    <rect x="7.3" y="6.5" width="1.4" height="3.8" rx="0.7" fill={color}/>
    <circle cx="8" cy="11.5" r="0.8" fill={color}/>
  </svg>
);
const CloseIcon = ({ size=12, color }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M2 2L10 10M10 2L2 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const PlusIcon  = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const DownIcon  = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M10 4v8M6 9l4 4 4-4M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevronR  = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const StarIcon  = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 12 12" fill={color}><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.44L6 8.885 2.91 10.51l.59-3.44L1 4.635l3.455-.505L6 1z"/></svg>;

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════════════════
const BTN_SIZE = {
  lg: { h:48, px:16, py:12, fs:16, lh:24, br:8 },
  md: { h:40, px:16, py:10, fs:14, lh:22, br:8 },
  sm: { h:32, px:12, py:6,  fs:14, lh:22, br:8 },
};
const BTN_RADIUS = { sm:8, md:12, full:9999 };

const BTN_STYLES = {
  "solid-primary":   { bg:T.gray990,    text:T.white,       border:T.gray950,   hBg:T.gray950,    aBg:T.gray800,    dBg:T.gray200,    dText:T.gray400,    dBorder:T.gray200 },
  "solid-secondary": { bg:T.white,      text:T.gray990,     border:T.gray200,   hBg:T.gray50,     hBorder:T.gray300,aBg:T.gray100,    dBg:T.gray50,     dText:T.gray400,    dBorder:T.gray100 },
  "solid-brand":     { bg:T.purple800,  text:T.white,       border:T.purple800, hBg:T.purple700,  aBg:T.purple900,  dBg:T.gray50,     dText:T.gray300,    dBorder:T.gray200 },
  "solid-positive":  { bg:T.green600,   text:T.white,       border:T.green600,  hBg:T.green500,   aBg:T.green400,   dBg:T.gray50,     dText:T.gray300,    dBorder:T.gray200 },
  "solid-negative":  { bg:T.red500,     text:T.white,       border:T.red500,    hBg:T.red600,     aBg:T.red600,     dBg:T.gray50,     dText:T.gray300,    dBorder:T.gray200 },
  "solid-tertiary":  { bg:"transparent",text:T.gray990,     border:"transparent",hBg:T.gray100,   aBg:T.gray200,    dText:T.gray300 },
  "outline-primary": { bg:"transparent",text:T.gray990,     border:T.gray800,   hBg:T.gray50,     aBg:T.gray100,    dText:T.gray300,  dBorder:T.gray200 },
  "outline-brand":   { bg:"transparent",text:T.purple800,   border:T.purple500, hBg:T.purple50,   dText:T.purple500,dBorder:T.purple100,dOpacity:0.5 },
  "outline-positive":{ bg:"transparent",text:T.green600,    border:T.green500,  hBg:T.green50,    dOpacity:0.4 },
  "outline-negative":{ bg:"transparent",text:T.red500,      border:T.red500,    hBg:T.red50,      dOpacity:0.4 },
  "text-secondary":  { bg:"transparent",text:T.gray800,     border:"transparent",hText:T.gray990,  dText:T.gray300,  isText:true },
  "text-brand":      { bg:"transparent",text:T.purple800,   border:"transparent",hText:T.purple700,dOpacity:0.4,     isText:true },
};

function Btn({ variant="solid-primary", size="lg", radius="sm", disabled=false, icon=false, children, style:extStyle }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const s = BTN_SIZE[size] || BTN_SIZE.lg;
  const v = BTN_STYLES[variant] || BTN_STYLES["solid-primary"];
  const br = BTN_RADIUS[radius] ?? 8;

  let bg     = v.bg     || "transparent";
  let text   = v.text   || T.gray990;
  let border = v.border || "transparent";
  let opacity = 1;

  if (disabled) {
    bg     = v.dBg     || v.bg     || "transparent";
    text   = v.dText   || v.text;
    border = v.dBorder || v.border || "transparent";
    opacity = v.dOpacity || 1;
  } else if (press) {
    bg     = v.aBg     || v.bg;
    text   = v.aText   || v.text;
  } else if (hov) {
    bg     = v.hBg     || v.bg;
    text   = v.hText   || v.text;
    border = v.hBorder || v.border || "transparent";
  }

  const px = v.isText ? 8 : s.px;

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        gap:4, border:`1px solid ${border}`, borderRadius: br,
        height: s.h, width: icon ? s.h : undefined,
        padding: icon ? 0 : `${s.py}px ${px}px`,
        fontSize:s.fs, lineHeight:`${s.lh}px`, fontWeight:500,
        fontFamily:"Pretendard, sans-serif", letterSpacing:0,
        background:bg, color:text, opacity,
        cursor:disabled ? "not-allowed" : "pointer",
        whiteSpace:"nowrap", userSelect:"none",
        transition:"background .15s, border-color .15s, color .15s",
        ...extStyle,
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BADGE (피그마 스펙 기반)
// ═══════════════════════════════════════════════════════════════════════════
const BADGE_SIZE = {
  Small:  { h:20, px:6, py:2, fs:12, lh:16 },
  Medium: { h:24, px:6, py:4, fs:12, lh:16 },
  Large:  { h:28, px:8, py:4, fs:14, lh:20 },
};
const BADGE_RADIUS = { Small:8, Large:9999 };

const BADGE_COLORS = {
  Solid: {
    Primary:    { bg:T.gray100,  text:T.strong },
    Secondary:  { bg:T.gray100,  text:T.gray800 },
    Brand:      { bg:T.dp100,    text:T.dp700 },
    Positive:   { bg:T.green50,  text:T.green500 },
    Negative:   { bg:T.red50,    text:T.red500 },
    Cautionary: { bg:T.yellow50, text:T.yellow400 },
    Info:       { bg:T.blue50,   text:T.blue500 },
  },
  Strong: {
    Primary:    { bg:T.gray950,    text:T.white },
    Secondary:  { bg:T.gray800,    text:T.white },
    Brand:      { bg:T.dp500,      text:T.white },
    Positive:   { bg:T.green600,   text:T.white },
    Negative:   { bg:T.red500,     text:T.white },
    Cautionary: { bg:T.yellow400,  text:T.strong },
    Info:       { bg:T.blue600,    text:T.white },
  },
  Outline: {
    Primary:    { border:T.gray200,  text:T.strong },
    Secondary:  { border:T.gray400,  text:T.gray800 },
    Brand:      { border:T.dp300,    text:T.dp600 },
    Positive:   { border:T.green500, text:T.green500 },
    Negative:   { border:T.red500,   text:T.red500 },
    Cautionary: { border:T.yellow400,text:T.yellow400 },
    Info:       { border:T.blue500,  text:T.blue500 },
  },
};

function Badge({ type="Solid", variant="Primary", size="Medium", radius="Small", text="텍스트", leadingIcon=false, trailingIcon=false }) {
  const s = BADGE_SIZE[size] || BADGE_SIZE.Medium;
  const r = BADGE_RADIUS[radius] ?? 8;
  const colors = (BADGE_COLORS[type] || BADGE_COLORS.Solid)[variant] || BADGE_COLORS.Solid.Primary;

  const isOutline = type === "Outline";
  const bg = isOutline ? "transparent" : (colors.bg || "transparent");
  const borderColor = isOutline ? (colors.border || T.gray200) : "transparent";

  return (
    <div style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      height:s.h, padding:`${s.py}px ${s.px}px`,
      background:bg,
      border: isOutline ? `1px solid ${borderColor}` : "1px solid transparent",
      borderRadius:r,
      overflow:"hidden",
      fontFamily:"Pretendard, sans-serif",
      boxSizing:"border-box",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:2, height:"100%" }}>
        {leadingIcon && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"2px 0" }}>
            <StarIcon size={size==="Large"?14:12} color={colors.text}/>
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{
            fontWeight:500, fontSize:s.fs, lineHeight:`${s.lh}px`,
            color:colors.text, whiteSpace:"nowrap", letterSpacing:0,
          }}>{text}</span>
        </div>
        {trailingIcon && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"2px 0" }}>
            <CloseIcon size={size==="Large"?12:10} color={colors.text}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CALLOUT
// ═══════════════════════════════════════════════════════════════════════════
const CALLOUT = {
  Primary:    { bg:T.gray50,     border:"transparent", icon:T.gray800,  title:T.gray800,  desc:T.gray800,  IconComp:InfoIcon },
  Secondary:  { bg:T.gray50,     border:"transparent", icon:T.gray800,  title:T.gray800,  desc:T.gray800,  IconComp:InfoIcon },
  Positive:   { bg:T.green50,    border:"transparent", icon:T.green600, title:T.green600, desc:T.green600, IconComp:InfoIcon },
  Negative:   { bg:T.red50,      border:"transparent", icon:T.red500,   title:T.red500,   desc:T.red500,   IconComp:InfoIcon },
  Cautionary: { bg:T.orange50,   border:"transparent", icon:T.orange,   title:T.orange,   desc:T.gray800,  IconComp:WarnIcon },
  Info:       { bg:T.blue50,     border:"transparent", icon:T.blue500,  title:T.blue500,  desc:T.blue500,  IconComp:InfoIcon },
  Brand:      { bg:T.purple50,   border:"transparent", icon:T.dp600,    title:T.dp600,    desc:T.dp600,    IconComp:InfoIcon },
};
const CALLOUT_SZ = {
  Small:  { px:"12px", py:"10px", tsz:"13px", tlh:"18px", tw:500, dsz:"11px", dlh:"15px", dw:400, isz:14, gap:"6px" },
  Medium: { px:"12px", py:"14px", tsz:"14px", tlh:"20px", tw:600, dsz:"12px", dlh:"16px", dw:400, isz:16, gap:"8px" },
};

function Callout({ variant="Primary", size="Medium", title="텍스트를 입력해 주세요.", description="안내 텍스트를 입력해 주세요.", showDesc=true, showIcon=true, width=240 }) {
  const v = CALLOUT[variant] || CALLOUT.Primary;
  const s = CALLOUT_SZ[size] || CALLOUT_SZ.Medium;
  const Icon = v.IconComp;
  return (
    <div style={{ display:"flex", background:v.bg, border:`1px solid ${v.border!=="transparent"?v.border:"transparent"}`, borderRadius:8, padding:`${s.py} ${s.px}`, width, minWidth:200, boxSizing:"border-box", fontFamily:"Pretendard, sans-serif" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:s.gap, width:"100%" }}>
        {showIcon && <div style={{paddingTop:"2px"}}><Icon size={s.isz} color={v.icon}/></div>}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          <span style={{ fontSize:s.tsz, lineHeight:s.tlh, fontWeight:s.tw, color:v.title, wordBreak:"break-word" }}>{title}</span>
          {showDesc && <span style={{ fontSize:s.dsz, lineHeight:s.dlh, fontWeight:s.dw, color:v.desc, wordBreak:"break-word" }}>{description}</span>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHIP
// ═══════════════════════════════════════════════════════════════════════════
const CHIP_SZ = {
  "X-Small":{ h:"24px", px:"8px",  fs:"12px", lh:"16px", isz:10 },
  "Small":  { h:"32px", px:"10px", fs:"13px", lh:"18px", isz:12 },
  "Medium": { h:"36px", px:"12px", fs:"14px", lh:"20px", isz:14 },
  "Large":  { h:"40px", px:"14px", fs:"14px", lh:"20px", isz:14 },
};
function chipCol(type, state, disabled, active) {
  const solid = type==="Solid";
  if (disabled) return { bg:solid?T.gray100:"transparent", text:T.gray400, border:solid?"transparent":T.gray200 };
  if (active)   return { bg:solid?T.gray990:"transparent", text:solid?T.white:T.gray990, border:solid?"transparent":T.gray950 };
  if (state==="Hovered") return { bg:solid?T.gray200:T.gray50,  text:T.gray990, border:solid?"transparent":T.gray300 };
  if (state==="Pressed") return { bg:solid?T.gray950:T.gray100, text:solid?T.white:T.gray990, border:solid?"transparent":T.gray300 };
  return { bg:solid?T.gray100:"transparent", text:T.gray800, border:solid?"transparent":T.gray200 };
}
function Chip({ type="Solid", size="Medium", disabled=false, active=false, label="텍스트", showTrailing=false, onClick }) {
  const [hov, setHov] = useState(false);
  const s = CHIP_SZ[size] || CHIP_SZ.Medium;
  const st = hov && !disabled && !active ? "Hovered" : "Default";
  const col = chipCol(type, st, disabled, active);
  return (
    <div onClick={!disabled?onClick:undefined} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:4, height:s.h, padding:`0 ${s.px}`, background:col.bg, border:`1px solid ${col.border!=="transparent"?col.border:"transparent"}`, borderRadius:9999, fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:s.fs, lineHeight:s.lh, color:col.text, opacity:disabled?0.5:1, cursor:disabled?"not-allowed":"pointer", whiteSpace:"nowrap", userSelect:"none", boxSizing:"border-box", transition:"all .12s" }}>
      {label}
      {showTrailing && !disabled && <span style={{display:"flex",alignItems:"center",marginLeft:2}}><CloseIcon size={s.isz} color={col.text}/></span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB
// ═══════════════════════════════════════════════════════════════════════════
function TabItem({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ position:"relative", display:"flex", alignItems:"center", height:40, padding:"8px 0", cursor:"pointer", flexShrink:0, userSelect:"none" }}>
      <span style={{ fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:16, lineHeight:"24px", color:active?T.gray990:T.gray800, whiteSpace:"nowrap", transition:"color .15s" }}>{label}</span>
      {active && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:T.gray990, borderRadius:1 }}/>}
    </div>
  );
}
function TabBar({ tabs, activeIndex, onChange }) {
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", gap:24 }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:T.gray200 }}/>
      {tabs.map((t,i) => <TabItem key={i} label={t} active={activeIndex===i} onClick={()=>onChange(i)}/>)}
    </div>
  );
}
function ChipTabs({ tabs, activeIndex, onChange, size="Medium", type="Solid" }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      {tabs.map((t,i) => <Chip key={i} label={t} type={type} size={size} active={activeIndex===i} onClick={()=>onChange(i)}/>)}
    </div>
  );
}

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
// APP
// ═══════════════════════════════════════════════════════════════════════════
const CALLOUT_KEYS = Object.keys(CALLOUT);
const CHIP_SIZE_KEYS = ["X-Small","Small","Medium","Large"];
const CHIP_TYPES = ["Solid","Outline"];
const BADGE_VARIANT_KEYS = ["Primary","Secondary","Brand","Positive","Negative","Cautionary","Info"];
const BADGE_TYPE_KEYS = ["Solid","Outline","Strong"];
const BADGE_SIZE_KEYS = ["Small","Medium","Large"];
const BADGE_RADIUS_KEYS = ["Small","Large"];
const VARIANT_ACCENT = { Primary:T.gray990, Secondary:T.gray800, Brand:T.dp600, Positive:T.green600, Negative:T.red500, Info:T.blue500, Cautionary:T.orange };

const th = { padding:"8px 14px", textAlign:"left", fontSize:12, fontWeight:600, color:"#7B7E85", borderBottom:"1px solid #E6E7E9", whiteSpace:"nowrap" };
const td = { padding:"10px 14px", borderBottom:"1px solid #F0F0F2", verticalAlign:"middle" };

export default function App() {
  const [page, setPage] = useState("button");

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
  const [chipTabType, setChipTabType] = useState("Solid");

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

  const PAGES = ["button","badge","callout","chip","tab","charts"];
  const PAGE_LABELS = { button:"Button", badge:"Badge", callout:"Callout", chip:"Chip", tab:"Tab", charts:"Charts" };
  const BTN_VARIANTS = Object.keys(BTN_STYLES);
  const RADII = ["sm","md","full"];
  const SIZES_BTN = ["lg","md","sm"];

  return (
    <div style={{ minHeight:"100vh", background:T.gray50, fontFamily:"Pretendard, sans-serif", boxSizing:"border-box" }}>

      {/* Top Nav */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.gray200}`, padding:"0 24px", display:"flex", alignItems:"center", gap:0, position:"sticky", top:0, zIndex:10 }}>
        <span style={{ fontSize:13, fontWeight:700, color:T.gray990, marginRight:24, padding:"12px 0", flexShrink:0 }}>CUBIG DS</span>
        {PAGES.map(p => (
          <button key={p} onClick={()=>setPage(p)} style={{ height:44, padding:"0 16px", border:"none", background:"none", cursor:"pointer", fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:14, color:page===p?T.gray990:T.gray800, borderBottom:page===p?`2px solid ${T.gray990}`:"2px solid transparent", transition:"all .15s" }}>
            {PAGE_LABELS[p]}
          </button>
        ))}
      </div>

      <div style={{ padding:"28px 24px", maxWidth:960, margin:"0 auto" }}>

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
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Disabled" on={btnDisabled} onClick={()=>setBtnDisabled(p=>!p)}/>
              <Toggle label="Icon Only" on={btnIcon} onClick={()=>setBtnIcon(p=>!p)}/>
            </div>
          </Card>

          <Card title="Solid">
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 16px" }}>Primary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-primary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-primary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-primary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-primary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius MD"><Btn variant="solid-primary" size="lg" radius="md">텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-primary" size="lg" radius="full">텍스트</Btn></Col></Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>Secondary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-secondary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-secondary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-secondary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-secondary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-secondary" size="lg" radius="full">텍스트</Btn></Col></Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>Brand / Positive / Negative / Tertiary</p>
            <Row wrap><Col label="Brand"><Btn variant="solid-brand" size="lg">텍스트</Btn></Col><Col label="Positive"><Btn variant="solid-positive" size="lg">텍스트</Btn></Col><Col label="Negative"><Btn variant="solid-negative" size="lg">텍스트</Btn></Col><Col label="Tertiary"><Btn variant="solid-tertiary" size="lg">텍스트</Btn></Col><Col label="Brand disabled"><Btn variant="solid-brand" size="lg" disabled>텍스트</Btn></Col><Col label="Positive disabled"><Btn variant="solid-positive" size="lg" disabled>텍스트</Btn></Col><Col label="Negative disabled"><Btn variant="solid-negative" size="lg" disabled>텍스트</Btn></Col></Row>
          </Card>

          <Card title="Outline">
            <Row wrap>
              <Col label="Primary"><Btn variant="outline-primary" size="lg">텍스트</Btn></Col>
              <Col label="Brand"><Btn variant="outline-brand" size="lg">텍스트</Btn></Col>
              <Col label="Positive"><Btn variant="outline-positive" size="lg">텍스트</Btn></Col>
              <Col label="Negative"><Btn variant="outline-negative" size="lg">텍스트</Btn></Col>
              <Col label="Primary disabled"><Btn variant="outline-primary" size="lg" disabled>텍스트</Btn></Col>
              <Col label="Brand disabled"><Btn variant="outline-brand" size="lg" disabled>텍스트</Btn></Col>
            </Row>
            <Row wrap>
              <Col label="MD"><Btn variant="outline-primary" size="md">텍스트</Btn></Col>
              <Col label="SM"><Btn variant="outline-primary" size="sm">텍스트</Btn></Col>
              <Col label="Radius MD"><Btn variant="outline-primary" size="lg" radius="md">텍스트</Btn></Col>
              <Col label="Radius Full"><Btn variant="outline-brand" size="lg" radius="full">텍스트</Btn></Col>
            </Row>
          </Card>

          <Card title="Text">
            <Row wrap>
              <Col label="Secondary LG"><Btn variant="text-secondary" size="lg">텍스트</Btn></Col>
              <Col label="Secondary MD"><Btn variant="text-secondary" size="md">텍스트</Btn></Col>
              <Col label="Secondary SM"><Btn variant="text-secondary" size="sm">텍스트</Btn></Col>
              <Col label="Brand"><Btn variant="text-brand" size="lg">텍스트</Btn></Col>
              <Col label="Disabled"><Btn variant="text-secondary" size="lg" disabled>텍스트</Btn></Col>
            </Row>
          </Card>

          <Card title="아이콘 포함">
            <Row wrap>
              <Col label="Leading"><Btn variant="solid-primary" size="lg"><PlusIcon size={20}/>추가하기</Btn></Col>
              <Col label="Trailing"><Btn variant="solid-secondary" size="lg">다운로드<DownIcon size={20}/></Btn></Col>
              <Col label="Both"><Btn variant="solid-brand" size="lg"><PlusIcon size={20}/>예약하기<ChevronR size={16}/></Btn></Col>
              <Col label="Outline+icon"><Btn variant="outline-primary" size="md"><PlusIcon size={16}/>추가</Btn></Col>
            </Row>
          </Card>

          <Card title="아이콘 전용">
            <Row wrap>
              <Col label="Primary LG"><Btn variant="solid-primary" size="lg" icon><PlusIcon size={24}/></Btn></Col>
              <Col label="Secondary MD"><Btn variant="solid-secondary" size="md" icon><PlusIcon size={20}/></Btn></Col>
              <Col label="Brand SM"><Btn variant="solid-brand" size="sm" icon><PlusIcon size={16}/></Btn></Col>
              <Col label="Outline LG"><Btn variant="outline-primary" size="lg" icon radius="md"><PlusIcon size={24}/></Btn></Col>
              <Col label="Negative SM"><Btn variant="solid-negative" size="sm" icon><CloseIcon size={14} color={T.white}/></Btn></Col>
            </Row>
          </Card>

          <div style={{ background:T.gray990, borderRadius:12, padding:20, display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn variant="solid-secondary" size="lg">Secondary</Btn>
            <Btn variant="outline-primary" size="lg" style={{ color:T.white, borderColor:T.gray800 }}>Outline</Btn>
            <Btn variant="solid-brand" size="lg">Brand</Btn>
            <Btn variant="text-secondary" size="lg" style={{ color:"#A2A4AA" }}>Text</Btn>
          </div>
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
            <RowGroup label="Type">{CHIP_TYPES.map(t=><PillBtn key={t} label={t} active={chipTabType===t} onClick={()=>setChipTabType(t)}/>)}</RowGroup>
            <ChipTabs tabs={chipTabItems} activeIndex={activeChipTab} onChange={setActiveChipTab} size={chipTabSize} type={chipTabType}/>
            <div style={{ marginTop:16, padding:14, background:T.gray50, borderRadius:8, fontSize:14, color:T.gray990 }}>선택된 항목: <strong>{chipTabItems[activeChipTab]}</strong></div>
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
              {["Blue 500","Lime 500","DeepPurple 400","Blue 300","Teal 500","Yellow 400"].map((name,i)=>(
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
          <Card title="Donut Chart" subtitle="원그래프 - 비율 표시에 적합">
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
            </div>
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

          {/* Stacked Horizontal Bar */}
          <Card title="Stacked Horizontal Bar" subtitle="100% 누적 막대 - 구성비 비교">
            <StackedHBar
              title="Feature Importance by Segment"
              data={[
                { label:"Concerns about company size", seg1:30, seg2:45, seg3:15, seg4:10 },
                { label:"Interest in premium features", seg1:20, seg2:35, seg3:25, seg4:20 },
              ]}
              keys={["seg1","seg2","seg3","seg4"]}
            />
          </Card>

          {/* Vertical Bar */}
          <Card title="Vertical Bar" subtitle="세로 막대 - 클러스터/시나리오 비교">
            <VBarChart
              title="Churn Rate by Cluster"
              data={[
                { label:"Premium Enthusiasts", value:65 },
                { label:"Dormant Potential", value:60 },
                { label:"Value Optimizers", value:65 },
                { label:"Occasional Buyers", value:45 },
              ]}
              keys={["value"]}
            />
          </Card>

          {/* Line / Area - Blue */}
          <Card title="Line / Area Chart (Blue)" subtitle="블루 라인 차트 - 시계열 추이">
            <LineChart
              title="Monthly Revenue Trend"
              variant="blue"
              enableArea
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
          <Card title="Line / Area Chart (Red)" subtitle="레드 라인 차트 - 위험 지표 추이">
            <LineChart
              title="Churn Rate Trend"
              variant="red"
              enableArea
              data={[{
                id: "Churn Rate",
                data: [
                  { x:"2024-01", y:5 },
                  { x:"2024-02", y:8 },
                  { x:"2024-03", y:12 },
                  { x:"2024-04", y:18 },
                  { x:"2024-05", y:22 },
                  { x:"2024-06", y:28 },
                ],
              }]}
            />
          </Card>

        </>}
      </div>
    </div>
  );
}
