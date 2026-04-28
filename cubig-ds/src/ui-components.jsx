import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { T, InfoIcon, WarnIcon, InfoFillIcon, ErrorFillIcon, WarnFillIcon, StarAiFillIcon, CloseIcon, StarIcon, IdentityPlatformIcon } from "./tokens.jsx";

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
  "solid-primary":   { bg:T.gray990,    text:T.white,       border:T.gray950,   hBg:T.gray950,    aBg:T.gray800,    dBg:T.gray700,    dText:T.gray500,    dBorder:T.gray700 },
  "solid-secondary": { bg:T.white,      text:T.gray990,     border:T.gray200,   hBg:T.gray50,     hBorder:T.gray300,aBg:T.gray100,    dBg:T.gray50,     dText:T.gray400,    dBorder:T.gray200 },
  "solid-tertiary":  { bg:T.gray50,      text:T.gray990,     border:T.gray200,   hBg:T.gray100,    aBg:T.gray200,    dText:T.gray300,  dBg:T.gray50, dBorder:T.gray200 },
};

export function Btn({ variant="solid-primary", size="lg", radius="sm", disabled=false, icon=false, children, onClick, style:extStyle }) {
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
      onClick={onClick}
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
    Negative:   { bg:T.red600,     text:T.white },
    Cautionary: { bg:T.yellow400,  text:T.white },
    Info:       { bg:T.blue600,    text:T.white },
  },
  Outline: {
    Primary:    { border:T.gray200,  text:T.strong },
    Secondary:  { border:T.gray200,  text:T.gray800 },
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
      <div style={{ display:"flex", alignItems:"center", gap:4, height:"100%" }}>
        {leadingIcon && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"2px 0" }}>
            {leadingIcon === true
              ? <StarIcon size={size==="Large"?14:12} color={colors.text}/>
              : leadingIcon}
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
  Positive:   { bg:T.green50,    border:"transparent", icon:T.green500, title:T.green500, desc:T.gray800,  IconComp:InfoFillIcon },
  Negative:   { bg:T.red50,      border:"transparent", icon:T.red500,   title:T.red500,   desc:T.gray800,  IconComp:ErrorFillIcon },
  Cautionary: { bg:T.orange50,   border:"transparent", icon:T.orange500, title:T.orange500, desc:T.gray800,  IconComp:WarnFillIcon },
  Info:       { bg:T.blue50,     border:"transparent", icon:T.blue500,  title:T.blue500,  desc:T.gray800,  IconComp:InfoFillIcon },
  Brand:      { bg:T.purple50,   border:"transparent", icon:T.dp600,    title:T.dp600,    desc:T.gray800,  IconComp:StarAiFillIcon },
};
const CALLOUT_SZ = {
  Small:  { px:"12px", py:"10px", tsz:"13px", tlh:"18px", tw:500, dsz:"11px", dlh:"15px", dw:400, isz:14, gap:"6px" },
  Medium: { px:"12px", py:"14px", tsz:"14px", tlh:"20px", tw:500, dsz:"12px", dlh:"16px", dw:400, isz:16, gap:"8px" },
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
  if (disabled) return { bg:solid?T.gray50:"transparent", text:T.gray300, border:solid?"transparent":T.gray200 };
  if (active)   return { bg:solid?T.gray925:"transparent", text:solid?T.white:T.gray990, border:solid?"transparent":T.gray950 };
  if (state==="Pressed") return { bg:solid?T.gray300:T.gray100, text:solid?T.gray800:T.gray990, border:solid?"transparent":T.gray300 };
  if (state==="Hovered") return { bg:solid?T.gray200:T.gray50,  text:solid?T.gray800:T.gray990, border:solid?"transparent":T.gray300 };
  return { bg:solid?T.gray100:"transparent", text:T.gray800, border:solid?"transparent":T.gray200 };
}
export function Chip({ type="Solid", size="Medium", disabled=false, active=false, label="텍스트", showTrailing=false, onClick }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const s = CHIP_SZ[size] || CHIP_SZ.Medium;
  const st = disabled || active ? "Default"
    : press ? "Pressed"
    : hov ? "Hovered"
    : "Default";
  const col = chipCol(type, st, disabled, active);
  return (
    <div onClick={!disabled?onClick:undefined}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>{ setHov(false); setPress(false); }}
      onMouseDown={()=>setPress(true)}
      onMouseUp={()=>setPress(false)}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:4, height:s.h, padding:`0 ${s.px}`, background:col.bg, border:`1px solid ${col.border!=="transparent"?col.border:"transparent"}`, borderRadius:9999, fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:s.fs, lineHeight:s.lh, color:col.text, cursor:disabled?"not-allowed":"pointer", whiteSpace:"nowrap", userSelect:"none", boxSizing:"border-box", transition:"all .12s" }}>
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
// SEGMENTED CONTROL (Figma 11221:3643)
//   - items: string[] 또는 [{ label, disabled }]
//   - size: "md"(기본) | "sm"
//   - 선택된 세그먼트: white 배경 + shadow, 나머지는 투명 배경
// ═══════════════════════════════════════════════════════════════════════════
const SEG_SIZE = {
  md: { h: 36, px: 14, fs: 14, lh: 20, radius: 8, pad: 2 },
  sm: { h: 28, px: 10, fs: 13, lh: 18, radius: 6, pad: 2 },
};

export function SegmentedControl({ items = [], activeIndex = 0, onChange, size = "md", style }) {
  const s = SEG_SIZE[size] || SEG_SIZE.md;
  const normalized = items.map(it => typeof it === "string" ? { label: it } : it);
  return (
    <div style={{
      display: "inline-flex", gap: 0,
      padding: s.pad, background: T.gray100, borderRadius: s.radius,
      fontFamily: "Pretendard, sans-serif",
      ...style,
    }}>
      {normalized.map((it, i) => {
        const active = i === activeIndex;
        const disabled = it.disabled;
        return (
          <button
            key={i}
            disabled={disabled}
            onClick={() => !disabled && onChange?.(i)}
            style={{
              height: s.h - s.pad * 2, padding: `0 ${s.px}px`,
              border: "none", background: active ? T.white : "transparent",
              borderRadius: s.radius - 2,
              boxShadow: active ? "0 1px 2px rgba(15,15,16,0.08)" : "none",
              fontSize: s.fs, lineHeight: `${s.lh}px`,
              fontWeight: active ? 600 : 500,
              color: disabled ? T.gray400 : active ? T.gray990 : T.gray800,
              cursor: disabled ? "not-allowed" : "pointer",
              fontFamily: "Pretendard, sans-serif",
              whiteSpace: "nowrap",
              transition: "background .15s, color .15s",
            }}
          >
            {it.label}
          </button>
        );
      })}
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

// ═══════════════════════════════════════════════════════════════════════════
// MODAL (Figma 11220:1004)
//   - Backdrop(fixed, rgba 0,0,0,.4) + centered dialog
//   - Header: title(18/600) + X close button
//   - Body: children (default padding 0 — caller로부터 받음)
//   - Footer: 우측 정렬 취소/확인 버튼 (onConfirm/onClose 제공 시 노출)
//   - size: "xs"(320) | "sm"(480) | "md"(640) | "lg"(960) | "xl"(1200)
//   - width prop으로 직접 지정 시 size 무시
//   - ESC 키 + backdrop 클릭으로 닫기
//
// Action Area (하단 버튼) 스펙:
//   - actionType:       "single" | "dual"                     (default: "dual")
//   - buttonLayout:     "hug" | "fill"                        (default: "hug")
//   - buttonAlignment:  "start" | "end" | "space-between"     (default: "end")
// ═══════════════════════════════════════════════════════════════════════════
export const MODAL_SIZES = { xs: 320, sm: 480, md: 640, lg: 960, xl: 1200 };

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = "확인",
  cancelLabel = "취소",
  size = "sm",
  width,
  showFooter = true,
  closeOnBackdrop = true,
  actionType = "dual",
  buttonLayout = "hug",
  buttonAlignment = "end",
  divider = false,
  bodyStyle,
  style,
}) {
  const resolvedWidth = width ?? MODAL_SIZES[size] ?? MODAL_SIZES.sm;
  const justifyMap = { start: "flex-start", end: "flex-end", "space-between": "space-between" };
  const isFill = buttonLayout === "fill";
  const btnStyle = isFill ? { flex: 1, width: "100%" } : undefined;
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={() => closeOnBackdrop && onClose?.()}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,15,16,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: resolvedWidth,
          background: T.white, borderRadius: 12,
          boxShadow: "0 10px 32px rgba(15,15,16,0.16)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          ...style,
        }}
      >
        {/* Header — Figma: padding 24/24/12 (상 24, 좌우 24, 하 12) */}
        {(title || description || onClose) && (
          <div style={{
            padding: "24px 24px 12px",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: 12,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
              {title && (
                <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>
                  {title}
                </div>
              )}
              {description && (
                <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>
                  {description}
                </div>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="닫기"
                style={{
                  width: 24, height: 24, border: "none", background: "transparent",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: T.gray990, padding: 0, flexShrink: 0, alignSelf: "flex-start",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Divider (optional) — Header와 Body 사이 1px gray200 */}
        {divider && <div style={{ height: 1, background: T.gray200 }} />}

        {/* Body — Figma: padding 12px 24px */}
        <div style={{ padding: "12px 24px", flex: 1, minHeight: 0, ...bodyStyle }}>
          {children}
        </div>

        {/* Footer (Action Area) — Figma: padding 12/24/24/24, gap 10 */}
        {showFooter && (
          <div style={{
            display: "flex", justifyContent: justifyMap[buttonAlignment] || "flex-end", gap: 10,
            padding: "12px 24px 24px",
          }}>
            {actionType === "dual" && onClose && (
              <Btn variant="solid-secondary" size="md" onClick={onClose} style={btnStyle}>{cancelLabel}</Btn>
            )}
            {onConfirm && (
              <Btn variant="solid-primary" size="md" onClick={onConfirm} style={btnStyle}>{confirmLabel}</Btn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL CONTENT BLOCKS (Figma 239:14640 ~ 모달 내부 레이아웃)
//
//   1) ModalUserCard — 아이콘 + name + subtitle (프로필 헤더 카드)
//   2) ModalField    — label(회색) + 본문 텍스트 카드
//   3) ModalStat     — label + value + unit (수치 필드)
//   4) ModalGrid     — columns 1~4 래퍼 (좌우/2단/4단 레이아웃)
//
//   모두 gray200 1px border + borderRadius 12 + padding 16 기본 카드 스타일.
// ═══════════════════════════════════════════════════════════════════════════
const MODAL_CARD = {
  background: T.white,
  border: `1px solid ${T.gray200}`,
  borderRadius: 12,
  padding: 16,
  boxSizing: "border-box",
  fontFamily: "Pretendard, sans-serif",
};

export function ModalUserCard({ icon, name, subtitle, style }) {
  return (
    <div style={{ ...MODAL_CARD, display: "flex", alignItems: "center", gap: 16, ...style }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: T.gray50, border: `1px solid ${T.gray200}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon || <IdentityPlatformIcon size={24} color={T.gray800} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: T.gray990 }}>{name}</div>
        {subtitle && (
          <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

export function ModalField({ label, children, style }) {
  return (
    <div style={{ ...MODAL_CARD, display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {label && (
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: "18px", color: T.gray800 }}>{label}</div>
      )}
      <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray990 }}>{children}</div>
    </div>
  );
}

export function ModalStat({ label, value, unit, style }) {
  return (
    <div style={{ ...MODAL_CARD, display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: "18px", color: T.gray800 }}>{label}</div>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: "26px", color: T.gray990 }}>{value}</span>
        {unit && (
          <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800 }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

export function ModalGrid({ columns = 2, gap = 8, children, style }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOOLTIP (Figma 11235:164)
//   - variant: "dark" (T.strong 배경 + white 텍스트) | "light" (white + border + shadow)
//   - placement: 12종 — top/bottom/left/right × start/center/end
//   - content: 간단 문자열 또는 ReactNode
//   - title + description: 카드형 툴팁 (2단 구성)
//   - shortcut: 단일 라인 툴팁 오른쪽에 키힌트 (예: "⌘V")
//   - trigger: children (hover 시 노출)
// ═══════════════════════════════════════════════════════════════════════════
const ARROW = 6;                      // 삼각형 반변
const TOOLTIP_GAP = 4;                 // 단일 툴팁: 트리거 ↔ 툴팁 간격
const TOOLTIP_ARROW_TIP_GAP = 4;      // 화살표 툴팁: 트리거 ↔ 화살표 tip 간격
const TOOLTIP_ALIGN_OFFSET = 14;       // start/end 기준점 (꼭지가 트리거 쪽에서 살짝 들어간 위치)

function getTooltipPos(placement, hasArrow = false) {
  const [dir, align = "center"] = placement.split("-");
  // hasArrow 시: 트리거↔arrow tip 간격 = TOOLTIP_ARROW_TIP_GAP (2px)
  // → tooltip 본체까지 거리 = ARROW(6) + TOOLTIP_ARROW_TIP_GAP(2) = 8px
  const gap = hasArrow ? ARROW + TOOLTIP_ARROW_TIP_GAP : TOOLTIP_GAP;
  const s = {}; // container 기준 absolute
  if (dir === "top") {
    s.bottom = `calc(100% + ${gap}px)`;
    if (align === "start") s.left = 0;
    else if (align === "end") s.right = 0;
    else { s.left = "50%"; s.transform = "translateX(-50%)"; }
  } else if (dir === "bottom") {
    s.top = `calc(100% + ${gap}px)`;
    if (align === "start") s.left = 0;
    else if (align === "end") s.right = 0;
    else { s.left = "50%"; s.transform = "translateX(-50%)"; }
  } else if (dir === "left") {
    s.right = `calc(100% + ${gap}px)`;
    if (align === "start") s.top = 0;
    else if (align === "end") s.bottom = 0;
    else { s.top = "50%"; s.transform = "translateY(-50%)"; }
  } else if (dir === "right") {
    s.left = `calc(100% + ${gap}px)`;
    if (align === "start") s.top = 0;
    else if (align === "end") s.bottom = 0;
    else { s.top = "50%"; s.transform = "translateY(-50%)"; }
  }
  return { dir, align, style: s };
}

function getArrowStyle(dir, align, bg, borderColor) {
  // 삼각형 절반 크기 base. 트리거 방향으로 나감.
  const common = {
    position: "absolute",
    width: 0, height: 0,
    borderStyle: "solid",
  };
  if (dir === "top") {
    // tooltip 아래쪽 변에서 아래로 삼각형
    Object.assign(common, {
      bottom: -ARROW, borderWidth: `${ARROW}px ${ARROW}px 0 ${ARROW}px`,
      borderColor: `${bg} transparent transparent transparent`,
    });
    if (align === "start") common.left = TOOLTIP_ALIGN_OFFSET;
    else if (align === "end") common.right = TOOLTIP_ALIGN_OFFSET;
    else { common.left = "50%"; common.transform = "translateX(-50%)"; }
  } else if (dir === "bottom") {
    Object.assign(common, {
      top: -ARROW, borderWidth: `0 ${ARROW}px ${ARROW}px ${ARROW}px`,
      borderColor: `transparent transparent ${bg} transparent`,
    });
    if (align === "start") common.left = TOOLTIP_ALIGN_OFFSET;
    else if (align === "end") common.right = TOOLTIP_ALIGN_OFFSET;
    else { common.left = "50%"; common.transform = "translateX(-50%)"; }
  } else if (dir === "left") {
    Object.assign(common, {
      right: -ARROW, borderWidth: `${ARROW}px 0 ${ARROW}px ${ARROW}px`,
      borderColor: `transparent transparent transparent ${bg}`,
    });
    if (align === "start") common.top = TOOLTIP_ALIGN_OFFSET;
    else if (align === "end") common.bottom = TOOLTIP_ALIGN_OFFSET;
    else { common.top = "50%"; common.transform = "translateY(-50%)"; }
  } else if (dir === "right") {
    Object.assign(common, {
      left: -ARROW, borderWidth: `${ARROW}px ${ARROW}px ${ARROW}px 0`,
      borderColor: `transparent ${bg} transparent transparent`,
    });
    if (align === "start") common.top = TOOLTIP_ALIGN_OFFSET;
    else if (align === "end") common.bottom = TOOLTIP_ALIGN_OFFSET;
    else { common.top = "50%"; common.transform = "translateY(-50%)"; }
  }
  return common;
}

export function Tooltip({
  children,
  content,
  title,
  description,
  shortcut,
  image,                     // Visual Tooltip: 이미지 URL 또는 true(placeholder)
  imageHeight = 126,
  placement,                 // 미지정 시: 카드형은 "top", 단일형은 "bottom" + 자동 좌우 정렬
  variant = "dark",
  open: controlledOpen,
  style,
}) {
  const [hover, setHover] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : hover;

  const isDark = variant === "dark";
  const bg = isDark ? T.strong : T.white;
  const fg = isDark ? T.white : T.gray990;
  const subFg = isDark ? "#B6B8BD" : T.gray800;
  const border = isDark ? "none" : `1px solid ${T.gray200}`;
  const shadow = isDark ? "0 4px 14px rgba(0,0,0,0.12)" : "0 6px 20px rgba(0,0,0,0.1)";
  const isVisual = !!image;
  const isCard = !isVisual && !!(title || description);

  /* ── 자동 placement ───────────────────────────────────────────
     - placement 명시: 그대로 사용
     - 카드형 (title/desc): 기본 "top"
     - 단일형: 기본 "bottom" + 트리거 X 위치로 start / center / end 자동 결정
        · 뷰포트 좌측 1/3 → "bottom-start"
        · 우측 1/3        → "bottom-end"
        · 그 외           → "bottom"
  ─────────────────────────────────────────────────────────────── */
  const triggerRef = useRef(null);
  const [autoAlign, setAutoAlign] = useState("");

  useLayoutEffect(() => {
    if (!open) return;
    if (placement) return;           // 명시된 경우 스킵
    if (isCard || isVisual) return;  // 카드/비주얼형은 top 기본
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const centerX = rect.left + rect.width / 2;
    if (centerX < vw / 3) setAutoAlign("-start");
    else if (centerX > (vw * 2) / 3) setAutoAlign("-end");
    else setAutoAlign("");
  }, [open, placement, isCard, isVisual]);

  const resolvedPlacement =
    placement || ((isCard || isVisual) ? "top" : `bottom${autoAlign}`);

  const hasArrow = isCard || isVisual;
  const { dir, align, style: posStyle } = getTooltipPos(resolvedPlacement, hasArrow);
  const arrowStyle = getArrowStyle(dir, align, bg);

  return (
    <span
      ref={triggerRef}
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 100,
            padding: isVisual ? "8px 8px 10px" : isCard ? "10px 12px" : "4px 8px",
            background: bg,
            color: fg,
            border,
            borderRadius: (isCard || isVisual) ? 8 : 6,
            boxShadow: shadow,
            fontFamily: "Pretendard, sans-serif",
            fontSize: 14, fontWeight: 500, lineHeight: "20px",
            whiteSpace: (isCard || isVisual) ? "normal" : "nowrap",
            width: isVisual ? 240 : undefined,
            minWidth: isCard ? 180 : undefined,
            maxWidth: isCard ? 260 : undefined,
            pointerEvents: "none",
            ...posStyle,
          }}
        >
          {isVisual ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              {/* 이미지 (boolean=true 이면 placeholder, URL이면 실제 이미지) */}
              <div style={{
                width: "100%",
                height: imageHeight,
                background: T.gray200,
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {typeof image === "string" ? (
                  <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  // Placeholder icon (산/이미지 아이콘)
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="5" y="7" width="30" height="26" rx="2" stroke="#8F9298" strokeWidth="1.5" />
                    <circle cx="14" cy="16" r="2.5" stroke="#8F9298" strokeWidth="1.5" />
                    <path d="M8 28 L16 20 L22 26 L28 20 L32 24 V31 H8 Z" stroke="#8F9298" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {/* 라벨 영역 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                {title && (
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: fg }}>{title}</div>
                )}
                {description && (
                  <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: isDark ? T.gray700 : T.gray800 }}>
                    {description}
                  </div>
                )}
              </div>
            </div>
          ) : isCard ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {title && (
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px", color: fg }}>{title}</div>
              )}
              {description && (
                <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: subFg }}>{description}</div>
              )}
            </div>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>{content}</span>
              {shortcut && (
                <span style={{ color: subFg, fontSize: 12, fontWeight: 500 }}>{shortcut}</span>
              )}
            </span>
          )}
          {/* Arrow — Card / Visual 타입만 표시 */}
          {(isCard || isVisual) && (
            <>
              <span style={arrowStyle} />
              {!isDark && (
                <span style={{
                  ...arrowStyle,
                  filter: "drop-shadow(0 0 0 transparent)",
                }} />
              )}
            </>
          )}
        </div>
      )}
    </span>
  );
}
