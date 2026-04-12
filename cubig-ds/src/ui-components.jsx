import { useState } from "react";
import { T, InfoIcon, WarnIcon, InfoFillIcon, ErrorFillIcon, WarnFillIcon, StarAiFillIcon, CloseIcon, StarIcon } from "./tokens.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════════════════
const BTN_SIZE = {
  lg: { h:48, px:16, py:12, fs:16, lh:24, br:8 },
  md: { h:40, px:16, py:10, fs:14, lh:22, br:8 },
  sm: { h:32, px:12, py:6,  fs:14, lh:22, br:8 },
};
const BTN_RADIUS = { sm:8, md:12, full:9999 };

export const BTN_STYLES = {
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

export function Btn({ variant="solid-primary", size="lg", radius="sm", disabled=false, icon=false, children, style:extStyle }) {
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
// BADGE
// ═══════════════════════════════════════════════════════════════════════════
export const BADGE_SIZE = {
  Small:  { h:20, px:6, py:2, fs:12, lh:16 },
  Medium: { h:24, px:6, py:4, fs:12, lh:16 },
  Large:  { h:28, px:8, py:4, fs:14, lh:20 },
};
export const BADGE_RADIUS = { Small:8, Large:9999 };

export const BADGE_COLORS = {
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

export function Badge({ type="Solid", variant="Primary", size="Medium", radius="Small", text="텍스트", leadingIcon=false, trailingIcon=false }) {
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
  Primary:    { bg:T.gray50,     border:"transparent", icon:T.gray990,  title:T.gray990,  desc:T.gray800,  IconComp:InfoFillIcon },
  Secondary:  { bg:T.gray50,     border:"transparent", icon:T.gray800,  title:T.gray800,  desc:T.gray800,  IconComp:InfoFillIcon },
  Positive:   { bg:T.green50,    border:"transparent", icon:T.green600, title:T.green600, desc:T.green600, IconComp:InfoFillIcon },
  Negative:   { bg:T.red50,      border:"transparent", icon:T.red500,   title:T.red500,   desc:T.red500,   IconComp:ErrorFillIcon },
  Cautionary: { bg:T.orange50,   border:"transparent", icon:T.orange,   title:T.orange,   desc:T.gray800,  IconComp:WarnFillIcon },
  Info:       { bg:T.blue50,     border:"transparent", icon:T.blue500,  title:T.blue500,  desc:T.blue500,  IconComp:InfoFillIcon },
  Brand:      { bg:T.purple50,   border:"transparent", icon:T.dp600,    title:T.dp600,    desc:T.dp600,    IconComp:StarAiFillIcon },
};
const CALLOUT_SZ = {
  Small:  { px:"12px", py:"10px", tsz:"13px", tlh:"18px", tw:500, dsz:"11px", dlh:"15px", dw:400, isz:14, gap:"6px" },
  Medium: { px:"12px", py:"14px", tsz:"14px", tlh:"20px", tw:600, dsz:"12px", dlh:"16px", dw:400, isz:16, gap:"8px" },
};

export function Callout({ variant="Primary", size="Medium", title="텍스트를 입력해 주세요.", description="안내 텍스트를 입력해 주세요.", showDesc=true, showIcon=true, width=240 }) {
  const v = CALLOUT[variant] || CALLOUT.Primary;
  const s = CALLOUT_SZ[size] || CALLOUT_SZ.Medium;
  const Icon = v.IconComp;
  return (
    <div style={{ display:"flex", background:v.bg, border:`1px solid ${v.border!=="transparent"?v.border:"transparent"}`, borderRadius:8, padding:`${s.py} ${s.px}`, width, minWidth:0, maxWidth:"100%", boxSizing:"border-box", fontFamily:"Pretendard, sans-serif" }}>
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
export function Chip({ type="Solid", size="Medium", disabled=false, active=false, label="텍스트", showTrailing=false, onClick }) {
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
export function TabBar({ tabs, activeIndex, onChange }) {
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", gap:24 }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:T.gray200 }}/>
      {tabs.map((t,i) => <TabItem key={i} label={t} active={activeIndex===i} onClick={()=>onChange(i)}/>)}
    </div>
  );
}
export function ChipTabs({ tabs, activeIndex, onChange, size="Medium", type="Solid" }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      {tabs.map((t,i) => <Chip key={i} label={t} type={type} size={size} active={activeIndex===i} onClick={()=>onChange(i)}/>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════════════════════════
export function Divider({ spacing = 0, vertical = false, color = T.gray200, style }) {
  if (vertical) {
    return <div style={{ width: 1, background: color, alignSelf: "stretch", margin: `0 ${spacing}px`, ...style }} />;
  }
  return <div style={{ height: 1, background: color, width: "100%", margin: `${spacing}px 0`, ...style }} />;
}
