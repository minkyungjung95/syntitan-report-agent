import { useState } from "react";
import { T, CheckCircleIcon, PersonIcon, ArrowUpIcon, ArrowDownIcon, WarnIcon, InfoIcon, InfoFillIcon, WarnFillIcon } from "./tokens.jsx";
import { Badge, Btn, Chip, ChipTabs, Callout } from "./ui-components.jsx";
import { CHART_COLORS } from "./charts";

const F = "Pretendard, sans-serif";

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1: LAYOUT
// ═══════════════════════════════════════════════════════════════════════════

export function PageWrapper({ children, style }) {
  return (
    <div style={{ padding: 32, background: T.white, fontFamily: F, maxWidth: 1544, minWidth: 0, width: "100%", boxSizing: "border-box", ...style }}>
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
export function SectionHeading({ title, description, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16, fontFamily: F, ...style }}>
      <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: T.gray990 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>{description}</div>
      )}
    </div>
  );
}

// ── ReportSection: border 라인 감싸기 (padding 40, radius 20, 내부 gap 24) ──
export function ReportSection({ children, gap = 24, style }) {
  return (
    <div style={{
      border: `1px solid ${T.gray200}`,
      borderRadius: 20,
      padding: 40,
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

// ── ContentHeader: 세미 타이틀 (border 안, gray50 밖) ──
export function ContentHeader({ title, description, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: F, ...style }}>
      <div style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: T.gray990 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>{description}</div>
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
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>{description}</div>
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
export function InfoCard({ label, value, suffix, description, variant = "solid", icon, style }) {
  const isSolid = variant === "solid";
  return (
    <div style={{
      flex: "1 1 0%", minWidth: 160,
      padding: "16px 20px",
      background: isSolid ? T.gray50 : T.white,
      border: isSolid ? "none" : `1px solid ${T.gray200}`,
      borderRadius: 16,
      fontFamily: F,
      boxSizing: "border-box",
      ...style,
    }}>
      <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990 }}>{value}</span>
        {suffix && <span style={{ fontSize: 16, fontWeight: 400, color: T.gray400 }}>{suffix}</span>}
        {icon}
      </div>
      {description && <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800, marginTop: 4 }}>{description}</div>}
    </div>
  );
}

// ── InfoCardRow: InfoCard 여러개를 감싸는 row (gap 8) ──
export function InfoCardRow({ children, style }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", ...style }}>
      {children}
    </div>
  );
}

// 하위호환을 위한 alias
export function UserCard({ label, value, subValue, variant = "solid", style }) {
  return <InfoCard label={label} value={value} description={subValue} variant={variant} style={style} />;
}
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
      border: `1px solid ${T.gray200}`,
      borderRadius: 16,
      fontFamily: F,
      boxSizing: "border-box",
      padding: 24,
      display: "flex", flexDirection: "column", gap: 16,
      boxShadow: "0px 1px 2px rgba(0,0,0,0.06)",
      ...style,
    }}>
      {/* Header: icon + name + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: T.gray50, border: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon || <PersonIcon size={24} color={T.gray800} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
          {subtitle && <Badge type="Outline" variant="Secondary" size="Small" text={subtitle} />}
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

export function PersonaSummaryCard({ name, trait, items = [], style }) {
  return (
    <div style={{
      flex: "1 1 calc(50% - 8px)", minWidth: 380,
      border: `1px solid ${T.gray200}`,
      borderRadius: 12,
      padding: "20px 24px",
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
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 0, fontFamily: F, background: T.gray50, borderRadius: 16, padding: "16px 20px", ...style }}>
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
    <div style={{ padding: "20px 24px", fontFamily: F, border: bordered ? `1px solid ${T.gray200}` : "none", borderRadius: bordered ? 16 : 0, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
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
  return (
    <div style={{ width: "100%", overflowX: "auto", fontFamily: F, ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ height: 48, background: T.gray25 }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: "12px 16px",
                fontSize: 14, fontWeight: 500, lineHeight: "20px",
                color: T.gray800, textAlign: col.align || "left",
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
              {columns.map((col, ci) => (
                <td key={ci} style={{
                  padding: "16px 16px",
                  fontSize: 14, fontWeight: ci === 0 ? 400 : 600, lineHeight: "20px",
                  color: ci === 0 ? T.gray800 : T.gray990,
                  textAlign: col.align || "left",
                  borderBottom: ri < data.length - 1 ? `1px solid ${T.gray100}` : "none",
                }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GroupedTable({ columns = [], groups = [], style }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", fontFamily: F, ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ height: 56, background: T.gray50, borderBottom: `1px solid ${T.gray200}` }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: "16px 16px",
                fontSize: 13, fontWeight: 600, lineHeight: "18px",
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
                    fontSize: 14, fontWeight: 400, lineHeight: "22px",
                    color: T.gray800, textAlign: col.align || "center",
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
            <th style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, color: T.gray800, textAlign: "left", borderBottom: `1px solid ${T.gray200}`, borderTopLeftRadius: 16 }}>Intersection</th>
            <th style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, color: T.gray800, textAlign: "left", borderBottom: `1px solid ${T.gray200}` }}>Definition</th>
            <th style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, color: T.gray800, textAlign: "left", borderBottom: `1px solid ${T.gray200}`, borderTopRightRadius: 16 }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: "16px 16px", borderBottom: i < items.length - 1 ? `1px solid ${T.gray100}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.gray990 }}>{item.abbr}</div>
                    <div style={{ fontSize: 12, fontWeight: 400, color: T.gray800 }}>{item.fullName}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "16px 16px", borderBottom: i < items.length - 1 ? `1px solid ${T.gray100}` : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>{item.definition}</div>
                {item.note && <div style={{ fontSize: 12, fontWeight: 400, color: T.gray400, marginTop: 2 }}>{item.note}</div>}
              </td>
              <td style={{ padding: "16px 16px", fontSize: 16, fontWeight: 600, color: T.gray990, borderBottom: i < items.length - 1 ? `1px solid ${T.gray100}` : "none" }}>{item.price}</td>
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px", fontFamily: F, ...style }}>
      {badge && <div style={{ marginBottom: 8 }}><Badge type="Solid" variant={badge.variant || "Cautionary"} size="Small" text={badge.text} /></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && <div style={{ width: 40, height: 40, borderRadius: 8, background: T.gray100, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>}
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: "26px", color: T.gray990 }}>{name}</div>
          {description && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800, marginTop: 4 }}>{description}</div>}
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

export function SignalCard({ number, title, items = [], alert, alertVariant = "Cautionary", bordered = true, style }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      border: bordered ? `1px solid ${T.gray200}` : "none",
      borderRadius: 16,
      fontFamily: F,
      display: "flex", flexDirection: "column",
      padding: 24,
      gap: 0,
      background: T.white,
      ...style,
    }}>
      {/* Badge */}
      <div style={{ display: "flex" }}>
        <Badge type="Solid" variant="Secondary" size="Medium" text={`Signal ${number}`} />
      </div>
      {/* gap 24 */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: T.gray990 }}>{title}</div>
      </div>
      <div style={{ height: 16, borderBottom: `1px solid ${T.gray200}` }} />
      <div style={{ height: 16 }} />
      {/* Description bullets */}
      <div style={{ flex: 1 }}>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 14, fontWeight: 400, lineHeight: "24px", color: T.gray800, marginBottom: 2 }}>{item}</li>
          ))}
        </ul>
      </div>
      {/* gap 24 + Callout */}
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
      padding: "20px 24px",
      fontFamily: F,
      background: T.white,
      ...style,
    }}>
      {badge && <div style={{ marginBottom: 12 }}><Badge type={badge.type || "Outline"} variant={badge.variant || "Primary"} size={badge.size || "Small"} text={badge.text} /></div>}
      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990 }}>{price}</div>
      {priceLabel && <div style={{ fontSize: 14, fontWeight: 400, color: T.gray800, marginTop: 2, marginBottom: 16 }}>{priceLabel}</div>}
      <div style={{ borderTop: `1px solid ${T.gray200}`, paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>{children}</div>
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
      {/* Header + Divider + Response */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: T.gray50, border: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <PersonIcon size={24} color={T.gray800} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990 }}>{name}</div>
            {profile && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800 }}>{profile}</div>}
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: T.gray200 }} />
        {/* Response */}
        <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray990 }}>{response}</div>
      </div>
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
  const textStyle = { fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray990, textAlign: "center", fontFamily: F };

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", fontFamily: F, ...style }}>
      {/* 헤더 */}
      <div style={{ display: "flex", height: 56, background: T.gray25, borderBottom: border }}>
        <div style={{ width: PERIOD_W, flexShrink: 0 }} />
        {COLS.map((col, i) => (
          <div key={col} style={{ ...colStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", borderRight: i < COLS.length - 1 ? border : "none" }}>
            <span style={{ fontSize: 16, fontWeight: 400, color: T.gray800, fontFamily: F }}>{col}</span>
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
              <div style={{
                background: T.blue50, borderRadius: 8, padding: "4px 8px",
                fontSize: 14, fontWeight: 500, color: T.blue500, lineHeight: "20px", whiteSpace: "nowrap",
              }}>
                {period.badge}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray1000 || T.strong, textAlign: "center" }}>
                {period.period}
              </div>
            </div>
            {/* 로우들 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {period.rows.map((row, ri) => {
                const isLastRow = ri === period.rows.length - 1;
                return (
                  <div key={ri} style={{ display: "flex", borderBottom: isLastRow ? "none" : border }}>
                    <div style={{ ...cellStyle }}><span style={textStyle}>{row.strategy}</span></div>
                    <div style={{ ...cellStyle }}><span style={textStyle}>{row.objective}</span></div>
                    <div style={{ ...cellStyle }}><span style={textStyle}>{row.actionPlan}</span></div>
                    <div style={{ ...cellStyle, borderRight: "none" }}><span style={textStyle}>{row.expectedImpact}</span></div>
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
