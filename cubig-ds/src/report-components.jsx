import React, { useState } from "react";
import { T, CheckCircleIcon, PersonIcon, IdentityPlatformIcon, IdentityPlatformOutlineIcon, ArrowUpIcon, ArrowDownIcon, WarnIcon, InfoIcon, InfoFillIcon, WarnFillIcon, SentimentSatisfiedIcon, SentimentNeutralIcon, SentimentDissatisfiedIcon, FaceIcon } from "./tokens.jsx";
import { Badge, Btn, Chip, ChipTabs, Callout } from "./ui-components.jsx";
import { CHART_COLORS } from "./charts";

const F = "Pretendard, sans-serif";

// ─── Responsive Layout Constants ──────────────────────────────────────────
export const LAYOUT = {
  maxWidth: 1864,     // 리포트 최대 폭
  minWidth: 838,      // 리포트 최소 폭
};

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1: LAYOUT
// ═══════════════════════════════════════════════════════════════════════════

export function PageWrapper({ children, style }) {
  return (
    <div style={{
      padding: "32px clamp(16px, 4vw, 32px) 100px",
      background: T.white,
      fontFamily: F,
      maxWidth: LAYOUT.maxWidth,
      minWidth: LAYOUT.minWidth,
      width: "100%",
      boxSizing: "border-box",
      margin: "0 auto",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── ReportPage: 섹션들을 감싸는 페이지 (섹션 간 gap 70) ──
export function ReportPage({ children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 70, ...style }}>
      {children}
    </div>
  );
}

// ── SectionHeading: 대 타이틀 (border 밖, 완전 바깥) ──
export function SectionHeading({ overline, title, description, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 24, fontFamily: F, ...style }}>
      {overline && (
        <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray800, marginBottom: 4 }}>{overline}</div>
      )}
      <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: T.gray990 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 15, fontWeight: 400, lineHeight: "24px", color: T.gray990 }}>{description}</div>
      )}
    </div>
  );
}

// ── ReportSection: border 라인 감싸기 (padding 40, radius 20, 내부 gap 24) ──
export function ReportSection({ children, gap = 24, style }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap,
      fontFamily: F,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── ContentHeader: 콘텐츠 제목 (기본 좌측 정렬) ──
// overline: 타이틀 위에 노출되는 작은 회색 라벨 (14px gray800)
// actions: 우측 영역에 들어갈 버튼/요소 (예: [Download PDF, Create Discussion])
export function ContentHeader({ overline, title, description, actions, badges, style }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24, fontFamily: F, ...style }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {overline && (
          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray800, marginBottom: 4 }}>{overline}</div>
        )}
        <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: T.gray990 }}>{title}</div>
        {description && (
          <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray900 }}>{description}</div>
        )}
        {badges && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {badges}
          </div>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}

export function SectionCard({ children, style }) {
  return (
    <div style={{
      background: T.gray50,
      borderRadius: 20,
      padding: 8,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxSizing: "border-box",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function ContentCard({ children, padding = 0, style }) {
  return (
    <div style={{
      background: T.white,
      borderRadius: 16,
      padding,
      boxSizing: "border-box",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INSIGHT CONTENT CARD (Figma 17206:36716)
//   - Icon header (wrap + container + 20px icon) + title (18 Medium)
//   - Divider
//   - Subtitle (18 SemiBold) + Description (16 Regular)
//   - `wrap` toggle: true → standalone white rounded card (32 padding),
//                    false → bare inner layout (to embed inside another ContentArea)
// ═══════════════════════════════════════════════════════════════════════════
export function InsightContent({
  layout = "vertical",
  // vertical
  icon, header, title, description,
  // horizontal
  label, value, items,
  wrap = true, style,
}) {
  if (layout === "horizontal") {
    const inner = (
      <div style={{ display: "flex", gap: 32, alignItems: "stretch", width: "100%", fontFamily: F }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 240, flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: T.gray800 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 600, lineHeight: "30px", color: T.gray990 }}>{value}</div>
        </div>
        <div style={{ width: 1, background: T.gray200, alignSelf: "stretch" }} />
        <ul style={{ flex: 1, minWidth: 0, margin: 0, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: T.gray990, fontSize: 16, fontWeight: 400, lineHeight: "24px" }}>
          {(items || []).map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      </div>
    );
    return (
      <div style={{
        background: wrap ? T.white : "transparent",
        borderRadius: wrap ? 16 : 0,
        padding: wrap ? 24 : 0,
        border: "none",
        width: "100%", boxSizing: "border-box",
        display: "flex", flexDirection: "column",
        ...style,
      }}>
        {inner}
      </div>
    );
  }
  const inner = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", fontFamily: F }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {icon && (
          <div style={{
            background: T.white, border: `1px solid ${T.gray200}`, borderRadius: 8,
            padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, boxSizing: "border-box", flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray800 }}>{header}</div>
      </div>
      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{title}</div>}
        {description && <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray900 }}>{description}</div>}
      </div>
    </div>
  );
  return (
    <div style={{
      background: wrap ? T.white : "transparent",
      borderRadius: wrap ? 16 : 0,
      padding: wrap ? 24 : 0,
      border: "none",
      width: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      ...style,
    }}>
      {inner}
    </div>
  );
}

// ContentArea: vertical stack wrapper for InsightContent items (gap 8)
//   wrap prop — true: each child kept as-is (assumes each is a wrapped card)
//               false: renders a single outer white card containing all children separated by Divider
export function ContentArea({ children, wrap = true, gap = 8, style }) {
  if (wrap) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap, width: "100%",
        background: T.gray50, padding: 8, borderRadius: 20, boxSizing: "border-box",
        ...style,
      }}>
        {children}
      </div>
    );
  }
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap, width: "100%", boxSizing: "border-box",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Divider({ spacing = 0, vertical = false, style }) {
  if (vertical) {
    return <div style={{ width: 1, background: T.gray200, alignSelf: "stretch", margin: `0 ${spacing}px`, ...style }} />;
  }
  return <div style={{ height: 1, background: T.gray200, width: "100%", margin: `${spacing}px 0`, ...style }} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2: TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════════════

export function SectionTitle({ title, description, titleSize = 28, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: F, ...style }}>
      <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: "36px", color: T.gray990 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 15, fontWeight: 400, lineHeight: "24px", color: T.gray900 }}>{description}</div>
      )}
    </div>
  );
}

export function CardTitle({ children, size = 18, style }) {
  return (
    <div style={{ fontSize: size, fontWeight: 600, lineHeight: "26px", color: T.gray990, fontFamily: F, ...style }}>
      {children}
    </div>
  );
}

export function QuestionTitle({ number, text, style }) {
  return (
    <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990, fontFamily: F, ...style }}>
      <span style={{ fontWeight: 700 }}>Q{number}. </span>{text}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: DATA SUMMARY CARDS
// ═══════════════════════════════════════════════════════════════════════════

// ── InfoCard: 통합 카드 (solid / outline 두 가지 variant) ──
// variant="solid" → gray50 배경, 보더 없음
// variant="outline" → white 배경, gray200 보더
// description 있으면 value 아래에 표시
// size: "lg" (기본, 20/700 bold) | "md" (16/600 semibold)
export function InfoCard({ label, value, suffix, description, variant = "solid", size = "lg", icon, style }) {
  const isSolid = variant === "solid";
  const isLg = size === "lg";
  const valueSize = isLg ? (isSolid ? 20 : 18) : 16;
  const valueWeight = isLg ? (isSolid ? 700 : 600) : 600;
  const valueLh = isLg ? (isSolid ? "28px" : "26px") : "24px";
  const suffixSize = isLg ? 16 : 14;
  return (
    <div style={{
      flex: "1 1 0%", minWidth: 160,
      padding: "16px 20px",
      background: isSolid ? T.gray50 : T.white,
      border: "none",
      borderRadius: 16,
      fontFamily: F,
      boxSizing: "border-box",
      ...style,
    }}>
      <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{ fontSize: valueSize, fontWeight: valueWeight, lineHeight: valueLh, color: T.gray990 }}>{value}</span>
        {suffix && <span style={{ fontSize: suffixSize, fontWeight: 400, color: T.gray400 }}>{suffix}</span>}
        {icon}
      </div>
      {description && <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray900, marginTop: 4 }}>{description}</div>}
    </div>
  );
}

// ── InfoCardRow: InfoCard 여러개를 감싸는 row (gap 8) ──
export function InfoCardRow({ children, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, ...style }}>
      {children}
    </div>
  );
}

// 하위호환을 위한 alias
export function ScoreCard({ label, score, total = 10, variant = "solid", style }) {
  return <InfoCard label={label} value={<>{score}<span style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>/{total}</span></>} variant={variant} style={style} />;
}
export function MetricCard({ label, value, change, changeLabel, style }) {
  const isPositive = typeof change === "number" ? change >= 0 : String(change).startsWith("+");
  const arrow = change !== undefined ? (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {isPositive ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
    </span>
  ) : null;
  return <InfoCard label={label} value={value} description={changeLabel} variant="outline" icon={arrow} style={style} />;
}
export function InvestmentCard({ items, style }) {
  return (
    <InfoCardRow style={style}>
      {items.map((item, i) => (
        <InfoCard key={i} label={item.label} value={item.value} description={item.description} variant="solid" />
      ))}
    </InfoCardRow>
  );
}

export function PersonaCard({ name, subtitle, metrics = [], icon, style }) {
  return (
    <div style={{
      flex: "1 1 calc(50% - 8px)", minWidth: 380,
      background: T.white,
      borderRadius: 16,
      fontFamily: F,
      boxSizing: "border-box",
      padding: 24,
      display: "flex", flexDirection: "column", gap: 16,
      ...style,
    }}>
      {/* Header: icon + name + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: T.gray50, border: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon || <IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
          {subtitle && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{subtitle}</div>}
        </div>
      </div>
      {/* Divider */}
      <div style={{ height: 1, background: T.gray200 }} />
      {/* Metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray800, width: 200, flexShrink: 0 }}>{m.key}</span>
            <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990, flex: 1, textAlign: "right" }}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USER CARD — 3 types (Figma 17206:50474)
//   type="simple":  bg gray25, name + subtitle + description
//   type="stats":   bg white, title + badge + detail rows (4개)
//   type="detail":  bg white, name + subtitle + description + CTA button
// ═══════════════════════════════════════════════════════════════════════════
export function UserCard({
  type = "simple",
  icon,
  name,
  subtitle,
  subtitleColor, // 있으면 subtitle 을 컬러 dot + chip 으로 렌더 (Section 3 badgeColor 같은 케이스)
  badge,
  description,
  quote, // quote 타입 — 말풍선에 들어갈 유저 의견
  sentiment, // quote 타입용: "positive" | "neutral" | "negative" → sentiment 아이콘 자동 선택
  reverse = false, // quote 타입용: 아바타를 우측에 배치 (말풍선은 좌측)
  details = [],
  stats = [],
  buttonLabel = "View Detail",
  onButtonClick,
  style,
}) {
  const isQuote = type === "quote";
  // quote 타입: 사람 얼굴 아이콘 (Material face) — 공통 사용
  const Icon = icon || (isQuote
    ? <FaceIcon size={24} color={T.gray700} />
    : <IdentityPlatformIcon size={24} color={T.gray800} />);
  // quote 타입 아바타 배경 — 통일 (gray25 + 테두리)
  const avatarBg = isQuote ? T.gray25 : T.gray50;
  const IconContainer = (
    <div style={{
      width: isQuote ? 40 : 48, height: isQuote ? 40 : 48,
      borderRadius: 12,
      background: avatarBg,
      border: `1px solid ${isQuote ? T.gray100 : T.gray200}`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{Icon}</div>
  );
  const Divider = <div style={{ height: 1, background: T.gray200, width: "100%" }} />;

  if (type === "quote") {
    const AvatarBlock = IconContainer;
    const BubbleBlock = (
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          background: T.gray50,
          borderRadius: reverse ? "20px 6px 20px 20px" : "6px 20px 20px 20px",
          padding: "14px 20px",
          fontSize: 15, fontWeight: 400, lineHeight: "24px", color: T.gray990,
        }}>
          {quote}
        </div>
        {(name || subtitle) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 4, justifyContent: reverse ? "flex-end" : "flex-start" }}>
            {name && (
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "3px 8px", borderRadius: 6,
                background: T.gray100,
                fontSize: 13, fontWeight: 500, lineHeight: "18px", color: T.gray990,
              }}>{name}</span>
            )}
            {subtitle && <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>{subtitle}</span>}
          </div>
        )}
      </div>
    );
    return (
      <div style={{
        width: "100%", height: "100%", background: T.white,
        borderRadius: 16,
        padding: 24, fontFamily: F, boxSizing: "border-box",
        display: "flex", alignItems: "flex-start", gap: 16,
        ...style,
      }}>
        {reverse ? <>{BubbleBlock}{AvatarBlock}</> : <>{AvatarBlock}{BubbleBlock}</>}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div style={{
        width: "100%", background: T.white,
        borderRadius: 16,
        padding: 24, fontFamily: F, boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: 16,
        ...style,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {IconContainer}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
            {badge && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{badge}</div>}
          </div>
        </div>
        {Divider}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {details.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray800, width: 200, flexShrink: 0 }}>{d.key}</span>
              <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990, flex: 1, textAlign: "right" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "compact") {
    return (
      <div style={{
        width: "100%", background: T.white,
        borderRadius: 16,
        padding: 24, fontFamily: F, boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: 24,
        ...style,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {IconContainer}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
            {stats.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {stats.map((s, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div style={{ width: 1, height: 12, background: T.gray200 }} />}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990 }}>{s.value}</span>
                      <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{s.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
        <Btn variant="solid-secondary" size="lg" radius="sm" style={{ width: "100%" }} onClick={onButtonClick}>
          {buttonLabel}
        </Btn>
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div style={{
        width: "100%", background: T.white,
        borderRadius: 16,
        padding: 24, fontFamily: F, boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: 20,
        ...style,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {IconContainer}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
            {subtitle && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{subtitle}</div>}
          </div>
        </div>
        {Divider}
        {description && <div style={{ flex: 1, fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray900 }}>{description}</div>}
        <Btn variant="solid-secondary" size="lg" radius="sm" style={{ width: "100%" }} onClick={onButtonClick}>
          {buttonLabel}
        </Btn>
      </div>
    );
  }

  // simple
  return (
    <div style={{
      width: "100%", background: T.white,
      borderRadius: 16,
      padding: 24, fontFamily: F, boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: 20,
      ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {IconContainer}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: "26px", color: T.gray990 }}>{name}</div>
          {subtitle && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{subtitle}</div>}
        </div>
      </div>
      {Divider}
      {description && <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray900 }}>{description}</div>}
    </div>
  );
}

export function PersonaSummaryCard({ name, trait, items = [], style }) {
  return (
    <div style={{
      flex: "1 1 calc(50% - 8px)", minWidth: 380,
      border: `1px solid ${T.gray200}`,
      borderRadius: 12,
      padding: 24,
      fontFamily: F,
      boxSizing: "border-box",
      ...style,
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: T.gray990, marginBottom: 4 }}>{name}</div>
      {trait && <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800, marginBottom: 12 }}>{trait}</div>}
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 13, fontWeight: 400, lineHeight: "22px", color: T.gray800, marginBottom: 2 }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function MiniStatGrid({ items = [], columns = 2, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`, gap: 0, fontFamily: F, background: T.gray50, borderRadius: 16, padding: "16px 20px", ...style }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: "8px 0" }}>
          <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800, marginBottom: 4 }}>{item.label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: T.gray990 }}>{item.value}</span>
            {item.sub && (
              <>
                <span style={{ fontSize: 13, fontWeight: 400, color: T.gray300 }}>|</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: T.gray800 }}>{item.sub}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GrowthCard({ label, amount, color = CHART_COLORS[0], percentage = 100, style }) {
  return (
    <div style={{ flex: "1 1 0%", minWidth: 120, textAlign: "center", fontFamily: F, ...style }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: T.gray990, marginBottom: 12 }}>{amount}</div>
      <div style={{ height: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{
          width: "70%", height: `${Math.max(percentage, 10)}%`,
          background: color, borderRadius: "4px 4px 0 0", opacity: 0.85,
        }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: T.gray800, marginTop: 8 }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4: INSIGHT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ── TextBlock: 통합 텍스트 블록 (아이콘 + 타이틀 + 본문/리스트) ──
// children: 문단 텍스트 or null
// items: bullet 리스트 or []
export function TextBlock({ title, icon, children, items = [], bordered = true, style }) {
  return (
    <div style={{ padding: 24, fontFamily: F, border: bordered ? `1px solid ${T.gray200}` : "none", borderRadius: bordered ? 16 : 0, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon || <CheckCircleIcon size={20} color={T.gray990} />}
        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: T.gray990 }}>{title}</span>
      </div>
      {items.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray990, marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      )}
      {children && <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray990 }}>{children}</div>}
    </div>
  );
}

// 하위호환 alias
export function KeyFindings(props) { return <TextBlock {...props} />; }
export function Interpretation(props) { return <TextBlock {...props} />; }

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 5: TABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export function DataTable({ columns = [], data = [], style }) {
  // 컬럼별 highlight — col.highlight: true|"blue" → 블루, "red" → 레드, "green" → 그린
  const blue500 = "#2B7FFF";
  const red500 = T.red500 || "#FB2C36";
  const green500 = T.green500 || "#00C950";
  const hlColor = (col) => col.highlight === "red" ? red500
    : col.highlight === "green" ? green500
    : blue500;
  const hlBg = (col) => col.highlight === "red"
    ? "rgba(254, 242, 242, 0.7)"   // red50 70%
    : col.highlight === "green"
    ? "rgba(240, 253, 244, 0.7)"   // green50 70%
    : "rgba(239, 246, 255, 0.7)";  // blue50 70%
  return (
    <div style={{ width: "100%", overflowX: "auto", fontFamily: F, ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ height: 48, background: T.gray25 }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: "12px 16px",
                fontSize: 14, fontWeight: 500, lineHeight: "20px",
                color: col.highlight ? T.gray990 : T.gray800,
                textAlign: col.align || "left",
                width: col.width, whiteSpace: "nowrap",
                borderBottom: `1px solid ${T.gray200}`,
                borderTopLeftRadius: i === 0 ? 16 : 0,
                borderTopRightRadius: i === columns.length - 1 ? 16 : 0,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col, ci) => {
                // col.highlight → 컬럼 전체 강조 (기본)
                // col.highlightWhen(row) → 해당 row 에만 강조 (col.highlight 없이도 동작)
                const active = col.highlight && (typeof col.highlightWhen === "function" ? col.highlightWhen(row) : true);
                return (
                  <td key={ci} style={{
                    padding: "16px 16px",
                    fontSize: 14,
                    fontWeight: active ? 700 : (ci === 0 ? 500 : 400),
                    lineHeight: "20px",
                    color: active ? hlColor(col) : T.gray990,
                    background: active ? hlBg(col) : "transparent",
                    textAlign: col.align || "left",
                    width: col.width,
                    borderBottom: ri < data.length - 1 ? `1px solid ${T.gray100}` : "none",
                    borderLeft: col.divider ? `1px solid ${T.gray100}` : undefined,
                  }}>
                    {row[col.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 2-column Q&A table (Figma 17206:36795)
//   rows: [{ question, prefix, answer }]  — prefix is bolded (e.g. "{유저 입력값}"), answer is medium
export function QATable({ columns = ["Question", "Answer"], rows = [], bordered = true, style }) {
  return (
    <div style={{
      width: "100%", background: T.white,
      border: bordered ? `1px solid ${T.gray200}` : "none",
      borderRadius: 16, overflow: "hidden", fontFamily: F, ...style,
    }}>
      <div style={{ display: "flex", height: 48, background: T.gray25, borderBottom: `1px solid ${T.gray200}` }}>
        {columns.map((c, i) => (
          <div key={i} style={{
            flex: 1, minWidth: 0, display: "flex", alignItems: "center",
            padding: "0 16px",
            fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800,
          }}>{c}</div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{
          display: "flex", minHeight: 56, alignItems: "stretch",
          borderBottom: ri < rows.length - 1 ? `1px solid ${T.gray100}` : "none",
        }}>
          <div style={{
            flex: 1, minWidth: 0, display: "flex", alignItems: "center",
            padding: "16px",
            fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990,
          }}>{r.question}</div>
          <div style={{
            flex: 1, minWidth: 0, display: "flex", alignItems: "center",
            padding: "16px",
            fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray990,
          }}>
            {r.prefix && <span style={{ fontWeight: 700, marginRight: 4 }}>{r.prefix}</span>}
            <span>{r.answer}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GroupedTable({ columns = [], groups = [], style }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", fontFamily: F, ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ height: 48, background: T.gray25, borderBottom: `1px solid ${T.gray200}` }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: "12px 16px",
                fontSize: 14, fontWeight: 500, lineHeight: "20px",
                color: T.gray800, textAlign: col.align || "center",
                width: col.width,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, gi) => (
            group.rows.map((row, ri) => (
              <tr key={`${gi}-${ri}`} style={{ borderBottom: `1px solid ${T.gray100}` }}>
                {ri === 0 && (
                  <td rowSpan={group.rows.length} style={{
                    padding: "16px 16px", verticalAlign: "middle", textAlign: "center",
                    borderRight: `1px solid ${T.gray100}`,
                  }}>
                    {group.badge && <Badge type="Solid" variant={group.badge.variant || "Info"} size="Small" text={group.badge.text} />}
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.gray990, marginTop: 4 }}>{group.title}</div>
                  </td>
                )}
                {columns.slice(1).map((col, ci) => (
                  <td key={ci} style={{
                    padding: "16px 16px",
                    fontSize: 14, fontWeight: 400, lineHeight: "20px",
                    color: T.gray990, textAlign: col.align || "center",
                  }}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DefinitionTable({ items = [], style }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", fontFamily: F, ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ height: 48, background: T.gray25 }}>
            <th style={{ padding: "12px 16px", fontSize: 14, fontWeight: 400, color: T.gray800, textAlign: "left", borderBottom: `1px solid ${T.gray200}`, borderTopLeftRadius: 16 }}>Intersection</th>
            <th style={{ padding: "12px 16px", fontSize: 14, fontWeight: 400, color: T.gray800, textAlign: "left", borderBottom: `1px solid ${T.gray200}` }}>Definition</th>
            <th style={{ padding: "12px 16px", fontSize: 14, fontWeight: 400, color: T.gray800, textAlign: "left", borderBottom: `1px solid ${T.gray200}`, borderTopRightRadius: 16 }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: "16px 16px", borderBottom: i < items.length - 1 ? `1px solid ${T.gray100}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: "20px", color: T.gray990 }}>{item.abbr}</div>
                    <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: T.gray800 }}>{item.fullName}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "16px 16px", borderBottom: i < items.length - 1 ? `1px solid ${T.gray100}` : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray990 }}>{item.definition}</div>
                {item.note && <div style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: T.gray400, marginTop: 2 }}>{item.note}</div>}
              </td>
              <td style={{ padding: "16px 16px", fontSize: 14, fontWeight: 700, lineHeight: "20px", color: T.gray990, borderBottom: i < items.length - 1 ? `1px solid ${T.gray100}` : "none" }}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// PHASE 6: CHART EXTENSIONS
// ═══════════════════════════════════════════════════════════════════════════

export function PriceRangeBar({ points = [], leftZone, rightZone, style }) {
  const min = Math.min(...points.map(p => p.value));
  const max = Math.max(...points.map(p => p.value));
  const range = max - min || 1;

  return (
    <div style={{ padding: "40px 20px", fontFamily: F, ...style }}>
      <div style={{ position: "relative", height: 60, margin: "0 40px" }}>
        <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 4, background: T.gray200, borderRadius: 2 }} />
        {points.map((p, i) => {
          const pct = ((p.value - min) / range) * 100;
          return (
            <div key={i} style={{ position: "absolute", left: `${pct}%`, transform: "translateX(-50%)", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: p.color || CHART_COLORS[i], marginBottom: 4 }}>{p.label}</div>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color || CHART_COLORS[i], margin: "0 auto 4px" }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: T.gray990 }}>{p.display || `$${p.value.toLocaleString()}`}</div>
              {p.desc && <div style={{ fontSize: 11, fontWeight: 400, color: T.gray800, marginTop: 2 }}>{p.desc}</div>}
            </div>
          );
        })}
      </div>
      {(leftZone || rightZone) && (
        <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 40px 0", fontSize: 12, color: T.gray800 }}>
          {leftZone && <span>{leftZone}</span>}
          {rightZone && <span>{rightZone}</span>}
        </div>
      )}
    </div>
  );
}

export function ROIComparisonChart({ items = [], style }) {
  const maxRoi = Math.max(...items.map(i => i.roi));
  return (
    <div style={{ display: "flex", gap: 40, justifyContent: "center", alignItems: "flex-end", padding: "20px 0", fontFamily: F, ...style }}>
      {items.map((item, i) => (
        <div key={i} style={{ textAlign: "center", flex: "1 1 0%", maxWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: T.gray990 }}>{item.roi}%</span>
            {item.risk && <Badge type="Solid" variant="Negative" size="Small" text={`Risk ${item.risk}%`} />}
          </div>
          <div style={{
            height: Math.max((item.roi / maxRoi) * 120, 30),
            background: item.color || T.gray200,
            borderRadius: "4px 4px 0 0",
            margin: "0 20px",
            opacity: 0.85,
          }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: T.gray990, marginTop: 8 }}>{item.label}</div>
          {item.recommended && <div style={{ fontSize: 12, fontWeight: 400, color: T.gray800 }}>(Recommended)</div>}
        </div>
      ))}
    </div>
  );
}

export function HorizontalBarChart({ items = [], style }) {
  const maxValue = Math.max(...items.map(i => i.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: F, ...style }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 80, fontSize: 14, fontWeight: 400, color: T.gray800, textAlign: "right", flexShrink: 0 }}>{item.label}</div>
          <div style={{ flex: 1, height: 32, background: T.gray100, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
              background: item.color || CHART_COLORS[i % CHART_COLORS.length],
              borderRadius: 4,
              transition: "width 0.3s ease",
            }} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, minWidth: 80, flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.gray990 }}>{item.percent}%</span>
            {item.count !== undefined && <span style={{ fontSize: 13, fontWeight: 400, color: T.gray800 }}>({item.count.toLocaleString()})</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 7: CARD COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export function ClusterHeader({ badge, name, description, icon, style }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 24, fontFamily: F, ...style }}>
      {badge && <div style={{ marginBottom: 8 }}><Badge type="Solid" variant={badge.variant || "Cautionary"} size="Small" text={badge.text} /></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && <div style={{ width: 40, height: 40, borderRadius: 8, background: T.gray100, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>}
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: "26px", color: T.gray990 }}>{name}</div>
          {description && <div style={{ fontSize: 15, fontWeight: 400, lineHeight: "24px", color: T.gray900, marginTop: 4 }}>{description}</div>}
        </div>
      </div>
    </div>
  );
}

// ── StatRowGroup: StatRow들을 divider로 구분, 패딩으로 묶음 ──
export function StatRowGroup({ children, style }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children];
  return (
    <div style={{ padding: "0 24px", fontFamily: F, ...style }}>
      {items.map((child, i) => (
        <div key={i}>
          {child}
          {i < items.length - 1 && <div style={{ height: 1, background: T.gray200 }} />}
        </div>
      ))}
    </div>
  );
}

export function StatRow({ label, value, items = [], style }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", flexWrap: "wrap",
      padding: "20px 0",
      fontFamily: F,
      ...style,
    }}>
      <div style={{ minWidth: 180, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990 }}>{value}</div>
      </div>
      <div style={{ flex: 1 }}>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 14, fontWeight: 400, lineHeight: "24px", color: T.gray800, marginBottom: 2 }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SignalCard({ number, title, items = [], alert, alertVariant = "Cautionary", variant, badgePrefix = "Insight", badgeVariant: badgeVariantOverride, bordered = true, style }) {
  // alert 있음 → Secondary(기본). alert 없음 → variant prop 사용. badgeVariant override 가 있으면 최우선
  const badgeVariant = badgeVariantOverride || (alert ? "Secondary" : (variant || "Primary"));
  return (
    <div style={{
      flex: "1 1 320px", minWidth: 320,
      border: bordered ? `1px solid ${T.gray200}` : "none",
      borderRadius: 16,
      fontFamily: F,
      display: "flex", flexDirection: "column",
      padding: 24,
      gap: 0,
      background: T.white,
      ...style,
    }}>
      {/* Badge — badgePrefix prop (default "Insight", "Signal" 등 context 에 따라 override) */}
      <div style={{ display: "flex" }}>
        <Badge type="Solid" variant={badgeVariant} size="Medium" text={`${badgePrefix} ${number}`} />
      </div>
      {/* Badge → Title gap 24 */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: T.gray990 }}>{title}</div>
      </div>
      {/* Title ↔ Line ↔ Description gap 16 total (8+8) */}
      <div style={{ height: 8, borderBottom: `1px solid ${T.gray200}` }} />
      <div style={{ height: 8 }} />
      {/* Description bullets (flex:1 → 카드 높이 맞춤, Callout 하단 정렬) */}
      <div style={{ flex: 1 }}>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 14, fontWeight: 400, lineHeight: "24px", color: T.gray990, marginBottom: 2 }}>{item}</li>
          ))}
        </ul>
      </div>
      {/* Description → Callout 최소 간격 24 */}
      {alert && (
        <div style={{ marginTop: 24 }}>
          <Callout variant={alertVariant} size="Small" title={alert} showDesc={false} width="100%" />
        </div>
      )}
    </div>
  );
}

export function ScenarioCard({ title, badge, metrics = [], color = CHART_COLORS[0], footer, style }) {
  return (
    <div style={{
      flex: "1 1 calc(33.33% - 12px)", minWidth: 240,
      border: `1px solid ${T.gray200}`,
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: F,
      textAlign: "center",
      ...style,
    }}>
      <div style={{ padding: "16px 20px" }}>
        {badge && <div style={{ marginBottom: 8 }}><Badge type="Outline" variant="Primary" size="Small" text={badge} /></div>}
        {metrics.map((m, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: T.gray800 }}>{m.label}: </span>
            <span style={{ fontSize: 14, fontWeight: m.bold ? 700 : 500, color: T.gray990 }}>{m.value}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 100, margin: "0 24px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ height: "70%", background: color, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
      </div>
      {footer && <div style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: T.gray800 }}>{footer}</div>}
    </div>
  );
}

export function ScenarioComparisonCard({ scenarios = [], style }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: F, ...style }}>
      {scenarios.map((s, i) => (
        <div key={i} style={{
          flex: "1 1 calc(33.33% - 16px)", minWidth: 300,
          border: `1px solid ${T.gray200}`,
          borderRadius: 12,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "16px 20px", flex: 1 }}>
            {s.badge && <div style={{ marginBottom: 8 }}><Badge type={s.recommended ? "Strong" : "Outline"} variant={s.recommended ? "Primary" : "Primary"} size="Small" text={s.badge} /></div>}
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: T.gray990, marginBottom: 2 }}>{s.title}</div>
            {s.subtitle && <div style={{ fontSize: 13, fontWeight: 400, color: T.gray800, marginBottom: 12 }}>{s.subtitle}</div>}
            {s.sections && s.sections.map((sec, si) => (
              <div key={si} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.gray990, marginBottom: 4 }}>{sec.label}</div>
                <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{sec.content}</div>
              </div>
            ))}
          </div>
          {s.footer && (
            <div style={{ padding: "12px 20px", background: T.gray50, borderTop: `1px solid ${T.gray100}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, fontWeight: 400, color: T.gray800 }}>
                <span style={{ flexShrink: 0 }}>●</span>
                <span>{s.footer}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function InsightCard({ icon, title, children, items, style }) {
  return <TextBlock title={title} icon={icon || <InfoFillIcon size={20} color={T.gray800} />} items={items} style={style}>{children}</TextBlock>;
}

export function StrategyCard({ badge, price, priceLabel, children, bordered = true, style }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      border: bordered ? `1px solid ${T.gray200}` : "none",
      borderRadius: 16,
      padding: 24,
      fontFamily: F,
      background: T.white,
      ...style,
    }}>
      {badge && <div style={{ marginBottom: 12 }}><Badge type={badge.type || "Outline"} variant={badge.variant || "Primary"} size={badge.size || "Small"} text={badge.text} /></div>}
      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990 }}>{price}</div>
      {priceLabel && <div style={{ fontSize: 14, fontWeight: 400, color: T.gray800, marginTop: 2, marginBottom: 16 }}>{priceLabel}</div>}
      <div style={{ borderTop: `1px solid ${T.gray200}`, paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray990 }}>{children}</div>
      </div>
    </div>
  );
}

export function RespondentCard({ name, profile, response, onViewDetail, style }) {
  return (
    <div style={{
      flex: "1 1 calc(50% - 8px)", minWidth: 380,
      border: `1px solid ${T.gray200}`,
      borderRadius: 20,
      padding: "32px 32px 26px",
      fontFamily: F,
      display: "flex", flexDirection: "column", gap: 20,
      ...style,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: T.gray50, border: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <IdentityPlatformOutlineIcon size={24} color={T.gray800} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
          {profile && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{profile}</div>}
        </div>
      </div>
      {/* Divider */}
      <div style={{ height: 1, background: T.gray200 }} />
      {/* Response (flex-grow 1 so short cards push the button to the bottom) */}
      <div style={{ flex: 1, fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray990 }}>{response}</div>
      {/* View Detail Button */}
      <button
        onClick={onViewDetail}
        style={{
          width: "100%", height: 48, padding: "12px 16px",
          background: T.gray50, border: `1px solid ${T.gray200}`,
          borderRadius: 8, fontSize: 16, fontWeight: 500, lineHeight: "24px",
          color: T.strong, cursor: "pointer", fontFamily: F,
          boxSizing: "border-box",
        }}
      >
        View Detail
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STRATEGY ROADMAP TABLE (피그마 17132:517)
//   periods: [{ badge, period, rows: [{ strategy, objective, actionPlan, expectedImpact }] }]
// ═══════════════════════════════════════════════════════════════════════════
export function StrategyRoadmapTable({ periods = [], style }) {
  const PERIOD_W = 232;
  const COLS = ["Strategy", "Objective", "Action Plan", "Expected Impact"];
  const border = `1px solid ${T.gray200}`;
  const colStyle = { width: "25%", boxSizing: "border-box" };
  const cellStyle = {
    ...colStyle, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "18px 16px", borderRight: border,
  };
  const bulletCellStyle = {
    ...colStyle, display: "flex", alignItems: "flex-start", justifyContent: "flex-start",
    padding: "18px 16px", borderRight: border,
  };
  const textStyle = { fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray990, textAlign: "center", fontFamily: F };
  const bulletTextStyle = { fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray990, textAlign: "left", fontFamily: F };

  const renderBulletCell = (v) => {
    if (typeof v !== "string") return <span style={bulletTextStyle}>{v}</span>;
    const items = v.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    if (items.length <= 1) {
      return <span style={bulletTextStyle}>{items[0] ?? ""}</span>;
    }
    return (
      <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6, listStyle: "none" }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.gray990, flexShrink: 0, marginTop: 8 }} />
            <span style={bulletTextStyle}>{it}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", fontFamily: F, ...style }}>
      {/* 헤더 — 세로 선 없음 */}
      <div style={{ display: "flex", height: 48, background: T.gray25, borderBottom: border }}>
        <div style={{ width: PERIOD_W, flexShrink: 0 }} />
        {COLS.map((col) => (
          <div key={col} style={{ ...colStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
            <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800, fontFamily: F }}>{col}</span>
          </div>
        ))}
      </div>
      {/* 본문 */}
      {periods.map((period, pi) => {
        const isLast = pi === periods.length - 1;
        return (
          <div key={pi} style={{ display: "flex", borderBottom: isLast ? "none" : border }}>
            {/* 타임라인 셀 */}
            <div style={{
              width: PERIOD_W, flexShrink: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 6,
              padding: 16, borderRight: border,
            }}>
              <Badge type="Solid" variant="Info" size="Small" text={period.badge} />
              {period.period && (
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: T.gray990, textAlign: "center" }}>
                  {period.period}
                </div>
              )}
            </div>
            {/* 로우들 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {period.rows.map((row, ri) => {
                const isLastRow = ri === period.rows.length - 1;
                return (
                  <div key={ri} style={{ display: "flex", borderBottom: isLastRow ? "none" : border }}>
                    <div style={{ ...cellStyle }}><span style={textStyle}>{row.strategy}</span></div>
                    <div style={{ ...cellStyle }}><span style={textStyle}>{row.objective}</span></div>
                    <div style={{ ...bulletCellStyle }}>{renderBulletCell(row.actionPlan)}</div>
                    <div style={{ ...bulletCellStyle, borderRight: "none" }}>{renderBulletCell(row.expectedImpact)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ActionList({ items = [], style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: F, ...style }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: T.gray990,
              color: T.white, fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.gray990 }}>{item.title}</span>
            {item.priority && <Badge type="Solid" variant={item.priority === "High" ? "Negative" : "Cautionary"} size="Small" text={item.priority} />}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingLeft: 32 }}>
            {item.columns.map((col, ci) => (
              <div key={ci} style={{ flex: "1 1 calc(33.33% - 16px)", minWidth: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.gray800, marginBottom: 4 }}>{col.label}</div>
                <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>{col.content}</div>
              </div>
            ))}
          </div>
          {i < items.length - 1 && <Divider spacing={12} />}
        </div>
      ))}
    </div>
  );
}

export function TaskItem({ title, priority, items = [], style }) {
  return (
    <div style={{ padding: "16px 0", borderBottom: `1px solid ${T.gray100}`, fontFamily: F, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.gray990 }}>{title}</span>
        {priority && <Badge type="Solid" variant={priority === "High" ? "Info" : "Cautionary"} size="Small" text={priority} />}
      </div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 13, fontWeight: 400, lineHeight: "22px", color: T.gray800, marginBottom: 2 }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 8: COMMON UI
// ═══════════════════════════════════════════════════════════════════════════

// AlertBanner는 DS Callout을 래핑
export function AlertBanner({ message, variant = "Negative", style }) {
  return (
    <div style={style}>
      <Callout variant={variant} size="Small" title={message} showDesc={false} width="100%" />
    </div>
  );
}

export function LegendTag({ color, label, value, count, style }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F, ...style }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>{label}</span>
      {value !== undefined && <span style={{ fontSize: 14, fontWeight: 700, color: T.gray990 }}>{value}</span>}
      {count !== undefined && <span style={{ fontSize: 13, fontWeight: 400, color: T.gray800 }}>({count.toLocaleString()})</span>}
    </div>
  );
}

export function WeekTabs({ weeks = 4, activeWeek = 1, onChange, style }) {
  const tabs = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
  const [active, setActive] = useState(activeWeek - 1);
  const handleChange = (i) => {
    setActive(i);
    onChange?.(i + 1);
  };
  return <ChipTabs tabs={tabs} activeIndex={active} onChange={handleChange} size="Small" type="Solid" />;
}

export function ExpectedResultsGrid({ items = [], columns = 2, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 0, fontFamily: F, ...style }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${T.gray100}`,
          borderRight: (i % columns < columns - 1) ? `1px solid ${T.gray100}` : "none",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.gray990, marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 13, fontWeight: 400, color: T.gray800 }}>
            {typeof item.value === "string" ? `• ${item.value}` : item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTIVE SUMMARY CARD  (Figma 17748-89837)
//   - 외곽: white, 1px gray200 border, radius 16, padding 40, shadow-xs-light
//   - title (18 SemiBold)
//   - ContentArea wrap=true (gray50 bg, 8px padding, 20 radius) 내부:
//     - 상단 요약 카드 row (label 16/Medium + value 20/SemiBold)
//     - Key Findings (checkCircle + title + bullet list)
// ═══════════════════════════════════════════════════════════════════════════
export function ExecutiveSummaryCard({ title = "Executive Summary", summaryItems = [], findings, style }) {
  return (
    <div style={{
      fontFamily: F,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      ...style,
    }}>
      {/* Title */}
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{title}</div>}

      {/* Wrapped content area */}
      <div style={{
        background: T.gray50, borderRadius: 20, padding: 8,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {/* Summary row */}
        {summaryItems.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            {summaryItems.map((item, i) => (
              <div key={i} style={{
                flex: "1 1 0%", minWidth: 0,
                background: T.white, borderRadius: 16, padding: 20,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: T.gray990 }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Key Findings */}
        {findings && (
          <div style={{
            background: T.white, borderRadius: 16, padding: 24,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircleIcon size={20} color={T.gray990} />
              <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: T.gray990 }}>{findings.title || "Key Findings"}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 4 }}>
              {(findings.items || []).map((item, i) => (
                <li key={i} style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray990 }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION ROADMAP  (Figma 17236-55398)
// ═══════════════════════════════════════════════════════════════════════════
export function ExecutionRoadmap({ title, subtitle, weeks = [], style }) {
  const [active, setActive] = useState(0);
  const current = weeks[active] || {};
  const priorityVariant = (p) => {
    if (p === "High") return "Info";
    if (p === "Medium") return "Positive";
    if (p === "Low") return "Neutral";
    return "Neutral";
  };
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      fontFamily: F,
      display: "flex",
      flexDirection: "column",
      gap: 24,
      ...style,
    }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {title && <div style={{ fontSize: 18, fontWeight: 600, color: T.gray990, lineHeight: "26px" }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 16, fontWeight: 500, color: T.gray800, lineHeight: "24px" }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {weeks.map((w, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  height: 36,
                  padding: "8px 12px",
                  borderRadius: 9999,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  background: isActive ? T.gray925 : T.gray100,
                  color: isActive ? "#fff" : T.gray800,
                }}
              >
                {w.tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Content — SectionCard 패턴: 회색 배경 + padding 8 + 내부 흰 카드 */}
      {current.weekLabel && (
        <div style={{ background: T.gray50, borderRadius: 20, padding: 8 }}>
          <div style={{ background: T.white, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#171719", lineHeight: "26px" }}>
              {current.weekLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {(current.items || []).map((it, idx) => {
                const isLastItem = idx === (current.items || []).length - 1;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: isLastItem ? "16px 0 0" : "16px 0",
                      borderTop: `1px solid ${T.gray200}`,
                      borderBottom: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 16, fontWeight: 500, color: "#0f0f10", lineHeight: "24px" }}>{it.title}</span>
                      {it.priority && (
                        <Badge type="Outline" size="Large" variant={priorityVariant(it.priority)} text={it.priority} />
                      )}
                    </div>
                    {it.bullets && it.bullets.length > 0 && (
                      <ul style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
                        {it.bullets.map((b, bi) => (
                          <li key={bi} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.gray990, flexShrink: 0, marginTop: 10 }} />
                            <span style={{ fontSize: 16, fontWeight: 400, color: T.gray990, lineHeight: "24px" }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WEEKLY PLAN TABLE  (Figma 17737-89373)
// ═══════════════════════════════════════════════════════════════════════════
export function WeeklyPlanTable({ weeks = [], columns = ["Owner", "Define", "Output"], style }) {
  const WEEK_W = 232;
  const border = `1px solid ${T.gray200}`;
  const cellPad = "16px";
  const headText = { fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800, fontFamily: F, textAlign: "center" };
  const bodyText = { fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray990, fontFamily: F, textAlign: "center" };

  const priorityBadge = (p) => (
    <Badge type="Solid" variant="Info" size="Small" text={p} />
  );

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: T.white, fontFamily: F, ...style }}>
      {/* 헤더 — 세로 선 없음 */}
      <div style={{ display: "flex", height: 48, background: T.gray25, borderBottom: border }}>
        <div style={{ width: WEEK_W, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
          <span style={headText}>Task</span>
        </div>
        {columns.map((col) => (
          <div key={col} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
            <span style={headText}>{col}</span>
          </div>
        ))}
      </div>

      {/* 주차별 본문 */}
      {weeks.map((week, wi) => {
        const rows = week.items || [];
        const isLastWeek = wi === weeks.length - 1;
        return (
          <div key={wi} style={{ display: "flex", borderBottom: isLastWeek ? "none" : border }}>
            {/* 주차 라벨 (세로 머지) — 중앙 정렬 */}
            <div style={{
              width: WEEK_W, flexShrink: 0, borderRight: border,
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center",
              padding: "18px 16px", gap: 4,
            }}>
              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: "#0F0F10", fontFamily: F }}>{week.weekLabel || `Week ${wi + 1}`}</div>
              {week.subtitle && <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: T.gray990, fontFamily: F }}>{week.subtitle}</div>}
            </div>

            {/* 행들 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {rows.map((row, ri) => {
                const isLastRow = ri === rows.length - 1;
                return (
                  <div key={ri} style={{ display: "flex", borderBottom: isLastRow ? "none" : border }}>
                    {/* Task + Priority */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: cellPad, borderRight: border }}>
                      {row.priority && priorityBadge(row.priority)}
                      <span style={{ ...bodyText, fontWeight: 500, color: "#0F0F10" }}>{row.task}</span>
                    </div>
                    {/* data columns */}
                    {columns.map((col, ci) => {
                      const key = col.toLowerCase();
                      return (
                        <div key={col} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: cellPad, borderRight: ci < columns.length - 1 ? border : "none" }}>
                          <span style={bodyText}>{row[key] || ""}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLUSTER PROFILE TABLE — clusters x categories matrix (charts.jsx 에서 이동)
// ═══════════════════════════════════════════════════════════════════════════
export function ClusterProfileTable({ title, data }) {
  const { clusters, categories } = data;
  const colCount = clusters.length;
  const blue50 = T.blue50 || "#EFF6FF";
  const blue500 = "#2B7FFF";

  // 표준: 헤더 14/400/gray800, 본문 14/400/gray990, highlight 14/700/blue500
  const cellBase = {
    fontFamily: F, fontSize: 14, fontWeight: 400, lineHeight: "20px",
    color: T.gray990, textAlign: "center", padding: "12px 16px",
  };
  const highlightCell = { ...cellBase, fontWeight: 700, color: blue500, background: "rgba(239, 246, 255, 0.7)" };
  const headerCell = {
    fontFamily: F, fontSize: 14, fontWeight: 400, lineHeight: "20px",
    color: T.gray800, textAlign: "center",
    padding: "12px 16px", background: T.gray25 || "#FAFAFA",
  };
  const labelCellBase = {
    fontFamily: F, fontSize: 14, fontWeight: 500, lineHeight: "20px",
    color: T.gray990, padding: "12px 16px", textAlign: "left", whiteSpace: "nowrap",
  };
  const rankLabelStyle = {
    fontFamily: F, fontSize: 14, fontWeight: 400, lineHeight: "20px",
    color: T.gray800, padding: "12px 16px", textAlign: "center", whiteSpace: "nowrap",
  };
  const rankTextStyle = (idx) => ({
    fontFamily: F, fontSize: 14,
    fontWeight: idx === 0 ? 700 : 400,
    color: idx === 0 ? blue500 : T.gray800,
  });
  const gridCols = `100px 64px ${"1fr ".repeat(colCount).trim()}`;

  return (
    <div style={{ fontFamily: F }}>
      {title && (
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990, textAlign: "center", marginBottom: 60 }}>
          {title}
        </div>
      )}
      <div style={{
        display: "grid", gridTemplateColumns: gridCols,
        borderRadius: 12, overflow: "hidden", background: T.white,
      }}>
        <div style={{ ...labelCellBase, color: T.gray800, background: T.gray25, borderBottom: `1px solid ${T.gray200}`, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>Keyword</span>
        </div>
        <div style={{ background: T.gray25, borderBottom: `1px solid ${T.gray200}` }} />
        {clusters.map((c, ci) => (
          <div key={ci} style={{
            ...headerCell, color: T.gray990,
            borderBottom: `1px solid ${T.gray200}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap",
          }}>
            {c.keywords.map((kw, ki) => (
              <span key={ki} style={{ fontWeight: ki === 0 ? 700 : 500, fontSize: 14 }}>{ki > 0 ? " " : ""}{kw}</span>
            ))}
          </div>
        ))}
        {categories.map((cat, catIdx) => {
          const rowCount = cat.ranks.length;
          const isLastCat = catIdx === categories.length - 1;
          return cat.ranks.map((rank, ri) => {
            const isFirstInCat = ri === 0;
            const isLastInCat = ri === rowCount - 1;
            // 마지막 카테고리의 마지막 row 는 하단 선 제거
            const borderBot = (isLastInCat && isLastCat)
              ? "none"
              : (isLastInCat ? `1px solid ${T.gray200}` : `1px solid ${T.gray100}`);
            return (
              <div key={`${catIdx}-${ri}`} style={{ display: "contents" }}>
                {isFirstInCat ? (
                  <div style={{
                    ...labelCellBase, fontSize: 15, display: "flex", alignItems: "center",
                    gridRow: `span ${rowCount}`,
                    borderBottom: isLastCat ? "none" : `1px solid ${T.gray200}`,
                    borderRight: `1px solid ${T.gray200}`,
                  }}>{cat.label}</div>
                ) : null}
                <div style={{ ...rankLabelStyle, borderBottom: borderBot }}>
                  <span style={rankTextStyle(ri)}>{rank}</span>
                </div>
                {clusters.map((_c, ci) => {
                  const val = cat.values[ci]?.[ri] ?? "";
                  const isTop = ri === 0;
                  return (
                    <div key={ci} style={{
                      ...(isTop ? highlightCell : cellBase),
                      borderBottom: borderBot, borderLeft: `1px solid ${T.gray200}`,
                    }}>{val}</div>
                  );
                })}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
