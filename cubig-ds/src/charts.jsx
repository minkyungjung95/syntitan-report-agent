import React, { useState, useRef, useEffect, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveRadar } from "@nivo/radar";
import { useTooltip } from "@nivo/tooltip";
import { T } from "./tokens.jsx";

// ─── Chart Color Palette ──────────────────────────────────────────────
export const CHART_COLORS = [
  "#2B7FFF", // 1. Blue 500
  "#7CCF00", // 2. Lime 500
  "#9F8DEB", // 3. DeepPurple 400
  "#8EC5FF", // 4. Blue 300
  "#00BBA7", // 5. Teal 500
  "#FDC700", // 6. Yellow 400
  "#C27AFF", // 7. Purple 400
  "#FDA5D5", // 8. Pink 300
];

const GRAY200 = "#E6E7E9";
const GRAY300 = "#C5C6CA";
const GRAY100 = "#F0F0F2";
const GRAY500 = "#B6B8BD";
const GRAY800 = "#7B7E85";
const GRAY990 = "#171719";
const WHITE = "#FFFFFF";
const RED500 = "#FB2C36";
const RED100 = "#FEE2E2";

// ─── Hover 색상 유틸 (기준색 + #000000 10%) ──────────────────────────
function darken(hex, amount = 0.1) {
  const c = hex.startsWith("#") ? hex : "#000000";
  const r = parseInt(c.slice(1,3),16);
  const g = parseInt(c.slice(3,5),16);
  const b = parseInt(c.slice(5,7),16);
  return `rgb(${Math.round(r*(1-amount))},${Math.round(g*(1-amount))},${Math.round(b*(1-amount))})`;
}

// ─── Common Theme ─────────────────────────────────────────────────────
const baseTheme = {
  fontFamily: "Pretendard, sans-serif",
  fontSize: 12,
  textColor: GRAY800,
  axis: {
    ticks: { text: { fontSize: 12, fill: GRAY800, fontFamily: "Pretendard, sans-serif" } },
    legend: { text: { fontSize: 14, fill: GRAY990, fontWeight: 500, fontFamily: "Pretendard, sans-serif" } },
  },
  grid: { line: { stroke: GRAY100, strokeWidth: 1 } },
  labels: { text: { fontSize: 12, fontFamily: "Pretendard, sans-serif" } },
  tooltip: { container: { background: "transparent", padding: 0, boxShadow: "none", border: "none" } },
};

// ─── Tooltip (피그마 1:1) ─────────────────────────────────────────────
const tooltipBox = {
  background: WHITE,
  border: `1px solid ${GRAY200}`,
  borderRadius: 6,
  padding: "10px 12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  fontFamily: "Pretendard, sans-serif",
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  whiteSpace: "nowrap",
};

function Tooltip({ label, value }) {
  return (
    <div style={tooltipBox}>
      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{label}</span>
      {value != null && <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{value}</span>}
    </div>
  );
}

// ─── Legend Dot ────────────────────────────────────────────────────────
function LegendDot({ color }) {
  return <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

// ═══════════════════════════════════════════════════════════════════════
// 1. DONUT CHART
//    - padAngle 0 (간격 없음), 호버 시 해당 슬라이스만 cornerRadius + 흰 stroke
//    - 나머지 슬라이스 opacity 0.2
// ═══════════════════════════════════════════════════════════════════════
export function DonutChart({ data, title, size = 180, legendPosition = "right", hideValues = false }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hoverActive, setHoverActive] = useState(false);
  const isBottom = legendPosition === "bottom";
  // color override + hatched 패턴 지원
  // hatched(기타) → 회색, color override 있으면 해당 색, 없으면 팔레트 순서
  const donutColors = data.map((d, i) => d.hatched ? GRAY200 : (d.color || CHART_COLORS[i % CHART_COLORS.length]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ display: "flex", flexDirection: isBottom ? "column" : "row", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ width: size, height: size, flexShrink: 0 }}>
          <ResponsivePie
            data={data}
            colors={donutColors}
            defs={[{ id: "donut-hatch", type: "patternLines", background: GRAY100, color: GRAY200, rotation: 45, lineWidth: 1.5, spacing: 6 }]}
            fill={[{ match: (d) => d.data.hatched, id: "donut-hatch" }]}
            innerRadius={0.6}
            padAngle={0}
            cornerRadius={hoverActive ? 6 : 0}
            borderWidth={0}
            enableArcLabels={true}
            arcLabel={d => `${((d.value / total) * 100).toFixed(0)}%`}
            arcLabelsTextColor={(d) => d.data.hatched ? GRAY500 : WHITE}
            arcLabelsSkipAngle={20}
            enableArcLinkLabels={false}
            activeOuterRadiusOffset={0}
            activeInnerRadiusOffset={0}
            onMouseEnter={(_datum, event) => {
              setHoverActive(true);
              const svg = event.currentTarget.closest("svg");
              if (!svg) return;
              svg.querySelectorAll("path").forEach(p => {
                p.style.transition = "opacity 0.15s ease";
                p.style.opacity = "0.5";
                p.style.stroke = "none";
                p.style.strokeWidth = "0";
                p.style.paintOrder = "";
              });
              const el = event.currentTarget;
              el.style.opacity = "1";
              el.style.stroke = WHITE;
              el.style.strokeWidth = "4";
              el.style.paintOrder = "stroke";
            }}
            onMouseLeave={(_datum, event) => {
              setHoverActive(false);
              const svg = event.currentTarget.closest("svg");
              if (!svg) return;
              svg.querySelectorAll("path").forEach(p => {
                p.style.opacity = "1";
                p.style.stroke = "none";
                p.style.strokeWidth = "0";
                p.style.paintOrder = "";
              });
            }}
            animate
            motionConfig="gentle"
            theme={{ ...baseTheme, labels: { text: { fontSize: 14, fontWeight: 600, fontFamily: "Pretendard, sans-serif" } } }}
            tooltip={({ datum }) => (
              <Tooltip
                label={datum.id}
                value={`${((datum.value / total) * 100).toFixed(1)}%${datum.data.count != null ? ` (${datum.data.count.toLocaleString()}원)` : ""}`}
              />
            )}
          />
        </div>
        <div style={{
          display: "flex",
          flexDirection: isBottom ? "row" : "column",
          flexWrap: isBottom ? "wrap" : "nowrap",
          justifyContent: isBottom ? "center" : "flex-start",
          gap: isBottom ? "8px 20px" : 10,
          minWidth: 0,
        }}>
          {data.map((d, i) => (
            <div key={d.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Pretendard, sans-serif", whiteSpace: "nowrap" }}>
              {d.hatched ? (
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: `repeating-linear-gradient(45deg, ${GRAY100}, ${GRAY100} 2px, ${GRAY200} 2px, ${GRAY200} 4px)` }} />
              ) : (
                <LegendDot color={donutColors[i]} />
              )}
              <span style={{ fontSize: 14, fontWeight: 400, color: GRAY800 }}>{d.id}</span>
              {d.count != null && (
                <span style={{ fontSize: 13, fontWeight: 400, color: GRAY800 }}>
                  ({d.count.toLocaleString()}원)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 1-1. PIE CHART (풀 원형 차트)
//    - innerRadius 0, 호버 시 흰색 stroke + 나머지 opacity 0.2
//    - 범례: DonutChart와 동일
// ═══════════════════════════════════════════════════════════════════════
export function PieChart({ data, title, size = 180, showInnerLabels = false, hideValues = false, legendPosition = "right" }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hoverActive, setHoverActive] = useState(false);
  // hatched(기타) → 회색, color override 있으면 해당 색, 없으면 팔레트 순서
  const pieColors = data.map((d, i) => d.hatched ? GRAY200 : (d.color || CHART_COLORS[i % CHART_COLORS.length]));
  const isBottom = legendPosition === "bottom";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ display: "flex", flexDirection: isBottom ? "column" : "row", alignItems: "center", justifyContent: "center", gap: isBottom ? 24 : 40 }}>
        <div style={{ width: size, height: size, flexShrink: 0 }}>
          <ResponsivePie
            data={data}
            colors={pieColors}
            defs={[{ id: "pie-hatch", type: "patternLines", background: GRAY100, color: GRAY200, rotation: 45, lineWidth: 1.5, spacing: 6 }]}
            fill={[{ match: (d) => d.data.hatched, id: "pie-hatch" }]}
            innerRadius={0}
            padAngle={0}
            cornerRadius={hoverActive ? 4 : 0}
            borderWidth={0}
            enableArcLabels={true}
            arcLabel={d => `${((d.value / total) * 100).toFixed(0)}%`}
            arcLabelsTextColor={(d) => d.data.hatched ? GRAY500 : WHITE}
            arcLabelsSkipAngle={30}
            theme={{ ...baseTheme, labels: { text: { fontSize: 14, fontWeight: 600, fontFamily: "Pretendard, sans-serif" } } }}
            enableArcLinkLabels={false}
            activeOuterRadiusOffset={0}
            activeInnerRadiusOffset={0}
            onMouseEnter={(_datum, event) => {
              setHoverActive(true);
              const svg = event.currentTarget.closest("svg");
              if (!svg) return;
              svg.querySelectorAll("path").forEach(p => {
                p.style.transition = "opacity 0.15s ease";
                p.style.opacity = "0.5";
                p.style.stroke = "none";
                p.style.strokeWidth = "0";
                p.style.paintOrder = "";
              });
              const el = event.currentTarget;
              el.style.opacity = "1";
              el.style.stroke = WHITE;
              el.style.strokeWidth = "4";
              el.style.paintOrder = "stroke";
            }}
            onMouseLeave={(_datum, event) => {
              setHoverActive(false);
              const svg = event.currentTarget.closest("svg");
              if (!svg) return;
              svg.querySelectorAll("path").forEach(p => {
                p.style.opacity = "1";
                p.style.stroke = "none";
                p.style.strokeWidth = "0";
                p.style.paintOrder = "";
              });
            }}
            animate
            motionConfig="gentle"
            tooltip={({ datum }) => (
              <Tooltip label={datum.id} value={`${((datum.value / total) * 100).toFixed(1)}%${hideValues ? "" : ` (${datum.value.toLocaleString()})`}`} />
            )}
          />
        </div>
        <div style={{
          display: "flex",
          flexDirection: isBottom ? "row" : "column",
          flexWrap: isBottom ? "wrap" : "nowrap",
          justifyContent: isBottom ? "center" : "flex-start",
          gap: isBottom ? "8px 20px" : 10,
          minWidth: 0,
        }}>
          {data.map((d, i) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", fontFamily: "Pretendard, sans-serif", flexWrap: "nowrap", minWidth: 0, whiteSpace: "nowrap" }}>
              {d.hatched ? (
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: `repeating-linear-gradient(45deg, ${GRAY100}, ${GRAY100} 2px, ${GRAY200} 2px, ${GRAY200} 4px)` }} />
              ) : (
                <LegendDot color={pieColors[i]} />
              )}
              {d.icon && <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>{d.icon}</span>}
              <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800, marginLeft: 8 }}>{d.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Gender Icons ───────────────────────────────────────────────────
export const MaleIcon = ({ size = 16, color = "#2B7FFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="6" />
    <path d="M22 2l-5.5 5.5" />
    <path d="M16 2h6v6" />
  </svg>
);

export const FemaleIcon = ({ size = 16, color = "#F43F5E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6" />
    <path d="M12 15v7" />
    <path d="M9 19h6" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════
// 1-2. SEMI DONUT CHART (반원 도넛)
//    - 상단 반원, 슬라이스별 라벨(% + 건수)
//    - 하단 범례: 컬러 + 라벨명 + 설명
//    - hatched 패턴(Unclassified 등) 지원
// ═══════════════════════════════════════════════════════════════════════

// 빗금 패턴용 SVG 정의 — 배경 gray100, stripe gray200
function HatchPattern({ id, color = GRAY200 }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={GRAY100} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1.5" />
    </pattern>
  );
}

export function SemiDonutChart({
  data,        // [{ id, value, color?, description?, hatched? }]
  title,
  size = 320,
}) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const FF = "Pretendard, sans-serif";
  const hatchId = "semi-donut-hatch";
  const outerR = size / 2;
  const innerR = outerR * 0.55;
  const labelR = (outerR + innerR) / 2;

  const getColor = (d, i) => d.color || CHART_COLORS[i % CHART_COLORS.length];

  // 슬라이스 데이터 계산 (상단 반원: 180° → 360°, 즉 9시→12시→3시)
  const slices = [];
  let cumDeg = 180; // 9시 방향에서 시작
  data.forEach((d, i) => {
    const sweep = (d.value / total) * 180;
    const startDeg = cumDeg;
    const endDeg = cumDeg + sweep;
    const midDeg = cumDeg + sweep / 2;
    const midRad = (midDeg * Math.PI) / 180;
    const isSmall = sweep < 22;
    const lr = isSmall ? outerR + 30 : labelR;
    slices.push({
      d, i, startDeg, endDeg, sweep,
      labelX: Math.cos(midRad) * lr,
      labelY: Math.sin(midRad) * lr,
      isSmall,
    });
    cumDeg = endDeg;
  });

  // SVG viewBox: 중심 (0,0), 상단 반원 + 라벨 여유
  const vbPad = 40;
  const vbW = (outerR + vbPad) * 2;
  const vbH = outerR + vbPad + 20; // 상단만 + 아래 약간

  // 툴팁 위치
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleArcEnter = (idx, e) => {
    setHovered(idx);
    const rect = e.currentTarget.closest("svg").getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleArcMove = (e) => {
    const rect = e.currentTarget.closest("svg").getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleArcLeave = () => { setHovered(null); setTooltipPos(null); };

  return (
    <div style={{ fontFamily: FF }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", marginBottom: 16 }}>{title}</div>}

      {/* 반원 차트 */}
      <div style={{ maxWidth: size + 80, margin: "0 auto", position: "relative" }}>
        <svg viewBox={`${-(outerR + vbPad)} ${-(outerR + vbPad)} ${vbW} ${vbH}`} width="100%" style={{ display: "block", overflow: "visible" }}>
          <defs><HatchPattern id={hatchId} /></defs>

          {slices.map((s, idx) => {
            const startRad = (s.startDeg * Math.PI) / 180;
            const endRad = (s.endDeg * Math.PI) / 180;
            const large = s.sweep > 180 ? 1 : 0;
            const fill = s.d.hatched ? `url(#${hatchId})` : getColor(s.d, idx);
            const isH = hovered === idx;
            const isOH = hovered !== null && hovered !== idx;

            const x1o = Math.cos(startRad) * outerR, y1o = Math.sin(startRad) * outerR;
            const x2o = Math.cos(endRad) * outerR, y2o = Math.sin(endRad) * outerR;
            const x1i = Math.cos(endRad) * innerR, y1i = Math.sin(endRad) * innerR;
            const x2i = Math.cos(startRad) * innerR, y2i = Math.sin(startRad) * innerR;

            // 첫 번째 슬라이스: 왼쪽 아래(start-outer) 코너만 라운드 4
            let flatD;
            if (idx === 0) {
              const cr = 4;
              const aoO = cr / outerR;
              const p = (a, rad) => `${Math.cos(a) * rad} ${Math.sin(a) * rad}`;
              flatD = [
                `M ${p(startRad, outerR - cr)}`,
                `A ${cr} ${cr} 0 0 1 ${p(startRad + aoO, outerR)}`,
                `A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o}`,
                `L ${x1i} ${y1i}`,
                `A ${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i}`,
                'Z',
              ].join(' ');
            } else {
              flatD = `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i} Z`;
            }

            // 호버 시에만 라운드 코너
            let roundD = flatD;
            if (isH) {
              const cr = 6;
              const r = Math.min(cr, (outerR - innerR) / 2);
              const aoO = r / outerR, aoI = r / innerR;
              const sweepRad = (s.sweep * Math.PI) / 180;
              if (sweepRad > aoO * 4 && r > 0) {
                const p = (a, rad) => `${Math.cos(a) * rad} ${Math.sin(a) * rad}`;
                roundD = [
                  `M ${p(startRad, outerR - r)}`,
                  `A ${r} ${r} 0 0 1 ${p(startRad + aoO, outerR)}`,
                  `A ${outerR} ${outerR} 0 ${large} 1 ${p(endRad - aoO, outerR)}`,
                  `A ${r} ${r} 0 0 1 ${p(endRad, outerR - r)}`,
                  `L ${p(endRad, innerR + r)}`,
                  `A ${r} ${r} 0 0 1 ${p(endRad - aoI, innerR)}`,
                  `A ${innerR} ${innerR} 0 ${large} 0 ${p(startRad + aoI, innerR)}`,
                  `A ${r} ${r} 0 0 1 ${p(startRad, innerR + r)}`,
                  'Z',
                ].join(' ');
              }
            }

            return (
              <path key={idx}
                d={isH ? roundD : flatD}
                fill={fill} stroke={isH ? WHITE : "none"} strokeWidth={isH ? 3 : 0}
                style={{ cursor: "default", transition: "opacity 0.15s", opacity: isOH ? 0.3 : 1 }}
                onMouseEnter={(e) => handleArcEnter(idx, e)}
                onMouseMove={handleArcMove}
                onMouseLeave={handleArcLeave}
              />
            );
          })}

          {/* 슬라이스 라벨 */}
          {slices.map((s, idx) => {
            const pct = ((s.d.value / total) * 100).toFixed(1);
            const textColor = s.d.hatched ? GRAY800 : (s.isSmall ? GRAY990 : WHITE);
            const isOH = hovered !== null && hovered !== idx;
            const anchor = s.isSmall ? "start" : "middle";
            return (
              <g key={`lbl-${idx}`} style={{ opacity: isOH ? 0.3 : 1, transition: "opacity 0.15s", pointerEvents: "none" }}>
                {s.isSmall ? (
                  <text x={s.labelX} y={s.labelY} textAnchor="start" dominantBaseline="central"
                    style={{ fontSize: 14, fontWeight: 700, fill: textColor, fontFamily: FF }}>
                    {pct}% ({s.d.value})
                  </text>
                ) : (
                  <>
                    <text x={s.labelX} y={s.labelY - 6} textAnchor="middle" dominantBaseline="auto"
                      style={{ fontSize: 18, fontWeight: 700, fill: textColor, fontFamily: FF }}>
                      {pct}%
                    </text>
                    <text x={s.labelX} y={s.labelY + 14} textAnchor="middle" dominantBaseline="auto"
                      style={{ fontSize: 14, fontWeight: 400, fill: textColor, fontFamily: FF, opacity: 0.85 }}>
                      ({s.d.value})
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* 툴팁 */}
        {hovered !== null && tooltipPos && (() => {
          const d = data[hovered];
          const pct = ((d.value / total) * 100).toFixed(1);
          return (
            <div style={{ position: "absolute", left: tooltipPos.x, top: tooltipPos.y - 8, transform: "translate(-50%, -100%)", pointerEvents: "none", zIndex: 10 }}>
              <Tooltip label={d.id} value={`${pct}% (${d.value.toLocaleString()})`} />
            </div>
          );
        })()}
      </div>

      {(() => {
        const allEmpty = data.every((d) => !d.description);
        if (allEmpty) {
          // Legend Only — DonutChart bottom 스타일의 가로 wrap 범례
          return (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", marginTop: 24 }}>
              {data.map((d, i) => {
                const color = d.hatched ? GRAY200 : getColor(d, i);
                return (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", fontFamily: FF, whiteSpace: "nowrap" }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                      background: d.hatched
                        ? `repeating-linear-gradient(45deg, ${GRAY100}, ${GRAY100} 2px, ${GRAY200} 2px, ${GRAY200} 4px)`
                        : color,
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800, marginLeft: 8 }}>{d.id}</span>
                  </div>
                );
              })}
            </div>
          );
        }
        return (
          <>
            {/* 구분선 */}
            <div style={{ height: 1.5, background: GRAY200, margin: "24px 0 0" }} />
            {/* 범례 테이블 (2컬럼 grid: 라벨 | 설명) */}
            <div>
              {data.map((d, i) => {
                const color = d.hatched ? GRAY200 : getColor(d, i);
                return (
                  <div key={d.id}
                    style={{
                      display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center",
                      padding: "12px 0", borderBottom: `1px solid ${GRAY200}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: d.hatched ? `repeating-linear-gradient(45deg, ${GRAY200}, ${GRAY200} 2px, ${GRAY300} 2px, ${GRAY300} 4px)` : color }} />
                      <span style={{ fontSize: 16, fontWeight: 600, color: GRAY990, lineHeight: "24px" }}>{d.id}</span>
                    </div>
                    {d.description ? (
                      <div style={{ fontSize: 14, fontWeight: 400, color: GRAY800, lineHeight: "22px" }}>{d.description}</div>
                    ) : <div />}
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 2. HORIZONTAL BAR (커스텀 - 피그마 1:1)
//    - 색상: 1번 Blue, 2번 Lime, 나머지 Gray200
//    - 배경 트랙 없음 (바만 표시)
//    - 퍼센트 색상: 항상 GRAY990 (색상 없음)
//    - 필터로 2~6개 항목 선택 가능
// ═══════════════════════════════════════════════════════════════════════
// Graph_item (피그마 1:1)
// row: height 72, gap 60 (label~container)
// Label: width 220, 16px Medium #171719, vertically centered in 48px
// Container: border-left 1px #E6E7E9, flex-1, gap 16, padding 12px
// Bar: height 48, borderRadius 0 8 8 0 (우측만), 색상별
// Percent: 20px Medium #171719
// Count: 18px Regular #7B7E85, gap 4
// Grid 기반 HBar — 라벨 컬럼은 가장 긴 라벨에 맞춰 자동, maxWidth 200 에서 ellipsis
function HBarItem({ label, value, count, barColor, maxPct, valueInside, valueSuffix = "%", valueFormat }) {
  const displayValue = valueFormat ? valueFormat(value) : value;
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const pct = maxPct > 0 ? (value / maxPct) * 100 : 0;
  const displayColor = hovered ? darken(barColor, 0.1) : barColor;
  const c = (barColor || "").toLowerCase();
  const isGrayBar = c === "#e6e7e9" || c === "#e0e0e2" || c === GRAY200.toLowerCase() || c === GRAY100.toLowerCase();
  const insideTextColor = isGrayBar ? GRAY500 : WHITE;
  const hoverHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onMouseMove: (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
  };

  return (
    <>
      {/* 라벨 셀 (grid col 1) */}
      <div {...hoverHandlers} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: 48 }}>
        <span title={label} style={{
          fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY990,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: 200, textAlign: "right",
        }}>{label}</span>
      </div>
      {/* 바 셀 (grid col 2) */}
      <div {...hoverHandlers} style={{
        display: "flex", alignItems: "center", gap: 16,
        borderLeft: `1px solid ${GRAY200}`, padding: "4px 12px 4px 0",
        position: "relative", height: 48,
      }}>
        <div style={{ flex: 1, minWidth: 0, position: "relative", height: 40 }}>
          <div style={{
            width: `${Math.max(pct, 0.5)}%`, height: 40,
            background: displayColor,
            borderRadius: "0 8px 8px 0",
            transition: "width 0.6s ease, background 0.15s ease",
            display: valueInside ? "flex" : "block",
            alignItems: valueInside ? "center" : undefined,
            justifyContent: valueInside ? "flex-end" : undefined,
            paddingRight: valueInside ? 12 : undefined,
            boxSizing: "border-box",
          }}>
            {valueInside && pct > 5 && (
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: insideTextColor, fontFamily: "Pretendard, sans-serif", whiteSpace: "nowrap" }}>
                {displayValue}{valueSuffix}{count != null ? ` (${count.toLocaleString()})` : ""}
              </span>
            )}
          </div>
          {hovered && pct > 0 && (
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: `${Math.max(pct, 0.5)}%`, height: 40,
              background: "rgba(0,0,0,0.10)",
              borderRadius: "0 8px 8px 0", pointerEvents: "none",
            }} />
          )}
        </div>
        {!valueInside && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990 }}>{displayValue}{valueSuffix}</span>
            {count != null && <span style={{ fontSize: 18, fontWeight: 400, lineHeight: "26px", color: GRAY800 }}>({count.toLocaleString()})</span>}
          </div>
        )}
        {hovered && (
          <div style={{
            position: "absolute",
            left: mousePos.x + 12,
            top: mousePos.y - 12,
            pointerEvents: "none",
            zIndex: 10,
            transform: "translateY(-100%)",
          }}>
            <Tooltip label={label} value={`${displayValue}${valueSuffix}${count != null ? ` (${count.toLocaleString()})` : ""}`} />
          </div>
        )}
      </div>
    </>
  );
}

// HBarChart variant:
//   default → [Blue500, Lime500, Gray, Gray, ...]
//   "blue"   → [Blue500, Blue400, Blue300, Gray, ...]
//   "green"  → [Green500, Green400, Green300, Gray, ...]
//   "red"    → [Red400,  Red300,  Red200,  Gray, ...]
const HBAR_VARIANT_COLORS = {
  default: [CHART_COLORS[0], CHART_COLORS[1]],
  blue:    ["#2B7FFF", "#51A2FF", "#8EC5FF"], // Blue 500 → 400 → 300
  green:   ["#00C950", "#05DF72", "#7BF1A8"], // Green 500 → 400 → 300
  red:     ["#FF6467", "#FFA2A2", "#FFC9C9"], // Red 400 → 300 → 200
};

export function HBarChart({ data, title, maxValue, valueInside = false, minRows = 0, variant = "default", valueSuffix = "%", valueFormat }) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const emptyCount = Math.max(minRows - data.length, 0);
  const palette = HBAR_VARIANT_COLORS[variant] || HBAR_VARIANT_COLORS.default;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 24, paddingRight: valueInside ? 40 : 0 }}>
        {data.map((d, i) => {
          let barColor;
          if (d.color) barColor = d.color;
          else if (i < palette.length) barColor = palette[i];
          else barColor = GRAY200;
          return <HBarItem key={d.label} label={d.label} value={d.value} count={d.count} barColor={barColor} maxPct={max} valueInside={valueInside} valueSuffix={valueSuffix} valueFormat={valueFormat} />;
        })}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <React.Fragment key={`empty-${i}`}>
            <div style={{ height: 48 }} />
            <div style={{ height: 48 }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3. VERTICAL BAR (Nivo) - 각 바에 다른 색상
// ═══════════════════════════════════════════════════════════════════════
// VBar 개별 바 — 위치별 라운드(단일/그룹 → 상단만, 스택 → 맨위 세그먼트만)
function VBarItem({ bar, isStacked, actualKeys, valueFormat, isSingleKey, setHoverActive }) {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const v = bar.data.value;
  const isNeg = v < 0;
  const R = Math.max(0, Math.min(8, bar.width / 2, bar.height / 2));
  let corners;
  if (isStacked) {
    const isLastKey = bar.data.id === actualKeys[actualKeys.length - 1];
    corners = isLastKey
      ? (isNeg
          ? { tl: 0, tr: 0, br: R, bl: R }
          : { tl: R, tr: R, br: 0, bl: 0 })
      : { tl: 0, tr: 0, br: 0, bl: 0 };
  } else {
    corners = isNeg
      ? { tl: 0, tr: 0, br: R, bl: R }
      : { tl: R, tr: R, br: 0, bl: 0 };
  }
  // 라벨이 막대 밖으로 잘리지 않도록 — 폰트 16 + labelY 14 기준 텍스트 하단이 ~25 → 28 이상 확보
  const showLabel = bar.width >= 24 && bar.height >= 28;
  const labelY = isNeg ? bar.height - 14 : 14;
  const c = (bar.color || "").toLowerCase();
  const isGrayBar = c === "#e6e7e9" || c === "#e0e0e2" || c === GRAY200.toLowerCase() || c === GRAY100.toLowerCase();
  const labelColor = isGrayBar ? GRAY500 : WHITE;
  const showTip = (e) => {
    showTooltipFromEvent(
      <Tooltip
        label={isSingleKey ? bar.data.indexValue : `${bar.data.indexValue} — ${bar.data.id}`}
        value={`${valueFormat ? valueFormat(v) : v}${bar.data.data?.count != null ? ` (${Number(bar.data.data.count).toLocaleString()}건)` : ""}`}
      />,
      e
    );
  };
  return (
    <g
      transform={`translate(${bar.x},${bar.y})`}
      onMouseEnter={(e) => { setHoverActive?.(true); e.currentTarget.style.filter = "brightness(0.85)"; e.currentTarget.style.transition = "filter 0.15s ease"; showTip(e); }}
      onMouseMove={showTip}
      onMouseLeave={(e) => { setHoverActive?.(false); e.currentTarget.style.filter = "none"; hideTooltip(); }}
      style={{ cursor: "pointer" }}
    >
      <path d={roundedRectPath(bar.width, bar.height, corners)} fill={bar.color} />
      {showLabel && (
        <text
          x={bar.width / 2} y={labelY}
          textAnchor="middle" dominantBaseline="central"
          fill={labelColor}
          style={{ fontSize: 16, fontWeight: 600, fontFamily: "Pretendard, sans-serif", pointerEvents: "none" }}
        >
          {valueFormat ? valueFormat(v) : v}
        </text>
      )}
    </g>
  );
}

export function VBarChart({ data, keys, indexBy = "label", title, groupMode = "grouped", layout = "vertical", stacked = false, valueFormat, height = 320, colors, hideLegend = false }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);
  const [hoverActive, setHoverActive] = useState(false);
  const isStacked = stacked || groupMode === "stacked";
  const isSingleKey = actualKeys.length === 1;
  const palette = colors || CHART_COLORS;
  const colorMap = {};
  actualKeys.forEach((k, i) => { colorMap[k] = palette[i % palette.length]; });

  // 차트 너비 추적 (X축 라벨 ellipsis용)
  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setChartWidth(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  const MARGIN_L = 60, MARGIN_R = 20;
  const bandW = chartWidth > 0 ? (chartWidth - MARGIN_L - MARGIN_R) / data.length : 0;

  // 음수 포함 여부 + nice min/max 계산
  const flatVals = data.flatMap(d => actualKeys.map(k => Number(d[k])).filter(v => Number.isFinite(v)));
  const hasNegative = flatVals.some(v => v < 0) && !isStacked;
  const rawMin = Math.min(...flatVals, 0);
  const rawMax = Math.max(...flatVals, 0);
  const step = niceStepValue(rawMax - rawMin || 1);
  const niceMin = hasNegative ? Math.floor(rawMin / step) * step : undefined;
  const niceMax = hasNegative ? Math.ceil(rawMax / step) * step : undefined;
  const tickArr = [];
  if (hasNegative) {
    for (let v = niceMin; v <= niceMax + 1e-9; v += step) tickArr.push(Math.round(v * 1e6) / 1e6);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div ref={containerRef} style={{ width: "100%", height }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={isSingleKey ? (({ index }) => palette[index % palette.length]) : (({ id }) => colorMap[id] || palette[0])}
          groupMode={isStacked ? "stacked" : groupMode}
          layout={layout}
          margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
          padding={0.25}
          borderRadius={0}
          enableLabel
          label={d => valueFormat ? valueFormat(d.value) : d.value}
          labelTextColor={WHITE}
          labelSkipWidth={24}
          labelSkipHeight={16}
          animate
          motionConfig="gentle"
          theme={{ ...baseTheme, labels: { text: { fontSize: 16, fontWeight: 600, fontFamily: "Pretendard, sans-serif" } } }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            // 각 슬롯 가로 너비(bandW)에 맞춰 라벨 ellipsis 처리 — 반응형
            renderTick: (tick) => {
              const maxW = bandW > 0 ? Math.max(bandW - 8, 24) : 100;
              const text = String(tick.value);
              return (
                <g transform={`translate(${tick.x},${tick.y})`}>
                  <foreignObject x={-maxW / 2} y={12} width={maxW} height={28} style={{ overflow: "visible" }}>
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      title={text}
                      style={{
                        fontSize: 12,
                        color: GRAY800,
                        fontFamily: "Pretendard, sans-serif",
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                        lineHeight: "16px",
                      }}
                    >
                      {text}
                    </div>
                  </foreignObject>
                </g>
              );
            },
          }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: hasNegative ? tickArr : 5, format: valueFormat }}
          enableGridX={false}
          enableGridY
          gridYValues={hasNegative ? tickArr : 5}
          valueScale={hasNegative ? { type: "linear", min: niceMin, max: niceMax } : { type: "linear" }}
          markers={hasNegative ? [{ axis: "y", value: 0, lineStyle: { stroke: GRAY500, strokeWidth: 1 } }] : []}
          barComponent={(props) => (
            <VBarItem {...props} isStacked={isStacked} actualKeys={actualKeys} valueFormat={valueFormat} isSingleKey={isSingleKey} setHoverActive={setHoverActive} />
          )}
        />
      </div>
      {/* 범례 */}
      {!hideLegend && (
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: -30 }}>
        {isSingleKey ? data.map((d, i) => (
          <div key={d[indexBy]} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: palette[i % palette.length] }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{d[indexBy]}</span>
          </div>
        )) : actualKeys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: palette[i % palette.length] }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{k}</span>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 5. STACKED HORIZONTAL BAR (100%) - 라운드 없음
// ═══════════════════════════════════════════════════════════════════════
// 커스텀 바 컴포넌트 — useTooltip 훅은 Nivo 컨텍스트 내부에서만 동작하므로 별도 컴포넌트로 분리
// 부분 라운드 rect path — r: { tl, tr, br, bl }
function roundedRectPath(w, h, r) {
  const { tl = 0, tr = 0, br = 0, bl = 0 } = r || {};
  return `M${tl},0 L${w - tr},0 Q${w},0 ${w},${tr} L${w},${h - br} Q${w},${h} ${w - br},${h} L${bl},${h} Q0,${h} 0,${h - bl} L0,${tl} Q0,0 ${tl},0 Z`;
}

function StackedHBarItem({ bar, hoveredId, setHoveredId, keys }) {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const myId = `${bar.data.indexValue}__${bar.data.id}`;
  const isThisHovered = myId === hoveredId;
  const showTooltip = (e) => {
    showTooltipFromEvent(
      <Tooltip label={`${bar.data.indexValue} — ${bar.data.id}`} value={`${bar.data.value}%`} />,
      e
    );
  };
  const isFirst = keys && bar.data.id === keys[0];
  const isLast = keys && bar.data.id === keys[keys.length - 1];
  const R = Math.max(0, Math.min(8, bar.width / 2, bar.height / 2));
  const corners = {
    tl: isFirst ? R : 0, bl: isFirst ? R : 0,
    tr: isLast ? R : 0, br: isLast ? R : 0,
  };
  return (
    <g
      transform={`translate(${bar.x},${bar.y})`}
      onMouseEnter={(e) => { setHoveredId(myId); showTooltip(e); }}
      onMouseMove={showTooltip}
      onMouseLeave={() => { setHoveredId(null); hideTooltip(); }}
      style={{ cursor: "pointer" }}
    >
      <path
        d={roundedRectPath(bar.width, bar.height, corners)}
        fill={bar.color}
        style={{
          filter: isThisHovered ? "brightness(0.85)" : "none",
          transition: "filter 0.15s ease",
        }}
      />
      {bar.data.value > 5 && (() => {
        // 회색 배경(중립) 위에는 GRAY500 라벨 — 원형 그래프 hatched 와 통일
        const c = (bar.color || "").toLowerCase();
        const isGrayBg = c === "#e6e7e9" || c === "#e0e0e2" || c === GRAY200.toLowerCase() || c === GRAY100.toLowerCase();
        return (
          <text x={bar.width / 2} y={bar.height / 2} textAnchor="middle" dominantBaseline="central"
            fill={isGrayBg ? GRAY500 : WHITE} fontSize={12} fontFamily="Pretendard, sans-serif" fontWeight={500} style={{ pointerEvents: "none" }}>
            {bar.data.value}%
          </text>
        );
      })()}
    </g>
  );
}

export function StackedHBar({ data, keys, indexBy = "label", title, colors }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);
  const paletteColors = colors || CHART_COLORS;
  // 호버된 바의 고유 ID — "행라벨__시리즈키" 조합 (같은 색 다른 행은 영향 없게)
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && (
        // 전체 폭(라벨 + 차트) 기준으로 제목 중앙 정렬 — 괄호 부가설명은 한 단계 얇고 연한 색
        <div style={{ width: "100%", fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>
          {(() => {
            if (typeof title === "string") {
              const m = title.match(/^(.*?)\s*(\(.+\))\s*$/);
              if (m) {
                return (<>{m[1]}<span style={{ fontWeight: 400, color: GRAY990, marginLeft: 6 }}>{m[2]}</span></>);
              }
            }
            return title;
          })()}
        </div>
      )}
      {/* 라벨(가변) + 차트(flex:1) 레이아웃 — 라벨 길이에 따라 자동 조정 (우측 여백 40, 타이틀 제외) */}
      <div style={{ display: "flex", width: "100%", gap: 0, alignItems: "stretch", paddingRight: 40 }}>
        {/* 왼쪽 라벨 — 컨텐츠 크기만큼 (고정 아님) */}
        {(() => {
          const mTop = 4, mBot = 4;
          return (
            <div style={{ flex: "0 0 auto", maxWidth: 220, display: "flex", flexDirection: "column-reverse", paddingRight: 24, paddingTop: mTop, paddingBottom: mBot }}>
              {data.map((d, i) => (
                <div key={i} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end",
                  minWidth: 0,
                }}>
                  <span title={d[indexBy]} style={{
                    fontSize: 14, fontWeight: 500, color: GRAY990, fontFamily: "Pretendard, sans-serif",
                    textAlign: "right", whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis",
                    maxWidth: 200,
                  }}>{d[indexBy]}</span>
                </div>
              ))}
            </div>
          );
        })()}
        {/* 오른쪽 그래프 — 남은 공간 전부 사용 */}
        <div style={{ flex: 1, minWidth: 0, height: Math.max(54 * data.length + 20, 120) }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={paletteColors}
          groupMode="stacked"
          layout="horizontal"
          maxValue={100}
          margin={{ top: 4, right: 20, bottom: 4, left: 0 }}
          padding={0.25}
          borderRadius={0}
          enableLabel
          label={d => d.value > 5 ? `${d.value}%` : ""}
          labelTextColor={WHITE}
          animate
          motionConfig="gentle"
          theme={{
            ...baseTheme,
            axis: {
              ...baseTheme.axis,
              ticks: { text: { fontSize: 14, fill: GRAY990, fontFamily: "Pretendard, sans-serif", fontWeight: 500 } },
            },
          }}
          axisBottom={null}
          axisLeft={null}
          enableGridX={false}
          enableGridY={false}
          barComponent={(props) => (
            <StackedHBarItem bar={props.bar} hoveredId={hoveredId} setHoveredId={setHoveredId} keys={actualKeys} />
          )}
        />
        </div>
      </div>

      {/* 하단 범례 — VBarChart와 동일한 간격 (outer gap:60 + marginTop:-30 = 순 30px) */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: -30 }}>
        {actualKeys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: paletteColors[i % paletteColors.length] }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 6. LINE / AREA CHART (피그마 1:1)
//    - 포인트: 항상 표시 (빈 원형, border만), 호버 시 세로 점선 + 툴팁
//    - 툴팁: 날짜 + 값 + 뱃지(옵션)
//    - X축: 좌측 시작점/우측 끝점 정렬
// ═══════════════════════════════════════════════════════════════════════
function LineTooltip({ point, valueLabel, valuePrefix, valueSuffix = "", badge, badgeVariant = "red" }) {
  const badgeColors = badgeVariant === "red"
    ? { bg: "#FEF2F2", color: RED500 }
    : { bg: GRAY100, color: GRAY990 };
  return (
    <div style={{
      background: WHITE,
      border: `1px solid ${GRAY200}`,
      borderRadius: 6,
      padding: "10px 12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      fontFamily: "Pretendard, sans-serif",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{point.data.x}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>
          {valuePrefix}{valueLabel || point.data.yFormatted}{valueSuffix}
        </span>
        {badge && (
          <span style={{
            display: "inline-flex", alignItems: "center",
            height: 24, padding: "4px 6px", borderRadius: 8,
            background: badgeColors.bg, color: badgeColors.color,
            fontSize: 12, fontWeight: 500, lineHeight: "16px",
          }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Y축 스케일 규칙 (chart-yscale-spec.md 기반) ─────────────────────────────
// 메트릭별 최소 표시 폭 + 15% 패딩 + nice step 반올림
// 작은 변화가 과장되지 않고, 큰 변화는 그대로 보이게
const METRIC_CONFIG = {
  nps:     { minDisplayRange: 10,  bounds: [-100, 100] },
  csat:    { minDisplayRange: 0.5, bounds: [1, 5] },
  time:    { minDisplayRange: (m) => Math.max(2, m * 0.2), bounds: [0, Infinity] },
  percent: { minDisplayRange: 5,   bounds: [0, 100] },
  count:   { minDisplayRange: (m) => Math.max(m * 0.2, 1), bounds: [0, Infinity] },
};
// ~5 ticks 가 되도록 1/2/5 × 10^n 중 선택
function niceStepValue(range) {
  if (range <= 0) return 1;
  const target = range / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
  const normalized = target / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return magnitude * 2;
  if (normalized <= 5) return magnitude * 5;
  return magnitude * 10;
}
export function computeYScale(values, metricType) {
  const cfg = METRIC_CONFIG[metricType];
  if (!cfg || !values?.length) return null;
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const minRange = typeof cfg.minDisplayRange === "function" ? cfg.minDisplayRange(dataMax) : cfg.minDisplayRange;
  const effectiveRange = Math.max(dataMax - dataMin, minRange);
  const center = (dataMin + dataMax) / 2;
  const padding = effectiveRange * 0.15;
  const rawMin = center - effectiveRange / 2 - padding;
  const rawMax = center + effectiveRange / 2 + padding;
  const step = niceStepValue(rawMax - rawMin);
  const yMin = Math.max(Math.floor(rawMin / step) * step, cfg.bounds[0]);
  const yMax = Math.min(Math.ceil(rawMax / step) * step, cfg.bounds[1]);
  return { yMin, yMax, tickStep: step };
}

export function LineChart({ data, title, enableArea = true, curve = "monotoneX", variant = "blue", valuePrefix = "", valueSuffix = "", badgeFormatter, badgeLabel, disableTooltip = false, disableBadge = false, yMin: yMinOverride, yMax: yMaxOverride, tickStep, metricType }) {
  const isRed = variant === "red";
  // 차트 데이터 color — 레드는 Red 400(#FF6467) 사용 (그래프 전용 규칙)
  const lineColor = isRed ? "#FF6467" : CHART_COLORS[0];

  // metricType 있으면 자동 계산 (명시적 yMin/yMax 있으면 그쪽 우선)
  const autoScale = metricType ? computeYScale(data.flatMap(s => s.data.map(d => d.y)), metricType) : null;
  const resolvedYMin = yMinOverride != null ? yMinOverride : autoScale?.yMin;
  const resolvedYMax = yMaxOverride != null ? yMaxOverride : autoScale?.yMax;
  const resolvedStep = tickStep != null ? tickStep : autoScale?.tickStep;

  const allY = data.flatMap(s => s.data.map(d => d.y));
  const yMin = Math.min(...allY);
  const yFormat = undefined;

  const scaleMin = resolvedYMin != null ? resolvedYMin : (isRed && yMin >= 0 ? 0 : yMin);
  const scaleMax = resolvedYMax != null ? resolvedYMax : "auto";
  const gridValues = resolvedStep != null && resolvedYMin != null && resolvedYMax != null
    ? (() => { const a = []; for (let v = resolvedYMin; v <= resolvedYMax; v += resolvedStep) a.push(v); return a; })()
    : 5;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveLine
          data={data}
          colors={[lineColor]}
          curve={curve}
          lineWidth={2}
          enableArea={enableArea}
          areaOpacity={isRed ? 0.08 : 0.12}
          areaBaselineValue={scaleMin}
          margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
          yScale={{ type: "linear", min: scaleMin, max: scaleMax }}
          enablePoints
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={lineColor}
          pointColor={WHITE}
          enableGridX={false}
          enableGridY
          gridYValues={gridValues}
          animate
          motionConfig="gentle"
          theme={{ ...baseTheme }}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: gridValues, format: yFormat }}
          useMesh
          enableCrosshair={false}
          layers={[
            "grid",
            "markers",
            "axes",
            "areas",
            ({ currentPoint, innerWidth, innerHeight }) => {
              if (!currentPoint) return null;
              return (
                <svg x={0} y={0} width={innerWidth} height={innerHeight} style={{ overflow: "hidden" }}>
                  <line
                    x1={currentPoint.x} y1={0}
                    x2={currentPoint.x} y2={innerHeight}
                    stroke={GRAY800} strokeWidth={1} strokeOpacity={0.8} strokeDasharray="4 4"
                  />
                </svg>
              );
            },
            "lines",
            "points",
            "slices",
            "mesh",
            "legends",
          ]}
          tooltip={disableTooltip ? () => null : ({ point }) => {
            let badge = null;
            // badge 는 disableBadge 가 false 일 때만, 명시적으로 전달된 경우 표시
            if (!disableBadge) {
              if (typeof badgeFormatter === "function") {
                badge = badgeFormatter(point.data);
              } else if (point.data.badge) {
                badge = point.data.badge;
              } else if (point.data.churn != null) {
                badge = `${point.data.churn > 0 ? "+" : ""}${point.data.churn}${badgeLabel || "명 이탈"}`;
              }
            }
            return (
              <LineTooltip
                point={point}
                valuePrefix={valuePrefix || ""}
                valueSuffix={valueSuffix || ""}
                valueLabel={undefined}
                badge={badge}
                badgeVariant={isRed ? "red" : undefined}
              />
            );
          }}
          legends={data.length > 1 ? [{
            anchor: "bottom", direction: "row", translateY: 50,
            itemWidth: 120, itemHeight: 20, symbolSize: 10, symbolShape: "circle",
          }] : []}
        />
      </div>
    </div>
  );
}

// ─── MultiLineChart: 다중 시리즈 전용 — CHART_COLORS 자동 매핑, cross 점선 크로스헤어,
//                   x/y 키-값 툴팁, PSM 차트 스타일의 하단 가로 선형 범례 (직선 연결)
export function MultiLineChart({ data, title, curve = "linear", height = 280, colors }) {
  const palette = colors || CHART_COLORS;

  const allY = data.flatMap(s => s.data.map(d => d.y));
  const yMin = Math.min(...allY);
  const scaleMin = yMin < 0 ? yMin : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height }}>
        <ResponsiveLine
          data={data}
          colors={palette}
          curve={curve}
          lineWidth={2}
          enableArea={false}
          areaBaselineValue={scaleMin}
          margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
          yScale={{ type: "linear", min: scaleMin, max: "auto" }}
          enablePoints
          pointSize={10}
          pointSymbol={({ size, color }) => (
            <circle r={size / 2} fill={WHITE} stroke={color} strokeWidth={2} />
          )}
          enableGridX={false}
          enableGridY
          gridYValues={5}
          animate
          motionConfig="gentle"
          theme={{
            ...baseTheme,
            crosshair: { line: { stroke: GRAY800, strokeWidth: 1, strokeOpacity: 0.8, strokeDasharray: "4 4" } },
          }}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: 5 }}
          enableSlices="x"
          enableCrosshair={true}
          sliceTooltip={({ slice }) => (
            <div style={{
              background: WHITE,
              border: `1px solid ${GRAY200}`,
              borderRadius: 8,
              padding: "10px 12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              fontFamily: "Pretendard, sans-serif",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              whiteSpace: "nowrap",
              minWidth: 140,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, lineHeight: "18px", color: GRAY800 }}>
                {slice.points[0]?.data.xFormatted}
              </span>
              {[...slice.points]
                .sort((a, b) => Number(b.data.y) - Number(a.data.y))
                .map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.seriesColor || p.serieColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: GRAY800 }}>{p.seriesId || p.serieId}</span>
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: GRAY990 }}>{p.data.yFormatted}</span>
                </div>
              ))}
            </div>
          )}
        />
      </div>
      {/* 하단 가로 범례 — PSM 스타일 (실선만, 4개, CHART_COLORS 순서) */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
        {data.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width={32} height={3}>
              <line x1={0} y1={1.5} x2={32} y2={1.5}
                stroke={palette[i % palette.length]} strokeWidth={2.5}
                strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: GRAY990, fontFamily: "Pretendard, sans-serif" }}>{s.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. FLOW TABLE (전환율 테이블)
//    - 좌측 값 → 전환율(미니바+뱃지) → 우측 값
//    - 전환율 높을수록 진한 색, 낮으면 경고색
// ═══════════════════════════════════════════════════════════════════════════

// 전환율 뱃지 + 대시 연결
// variant: "normal" 회색 아웃라인, "best" 핑크, "worst" 블루
function RateBadge({ rate, variant = "normal" }) {
  const styles = {
    best:   { bg: RED100, border: RED500, color: RED500, fontWeight: 800, fontSize: 18 },
    worst:  { bg: "#EFF6FF", border: CHART_COLORS[0], color: CHART_COLORS[0], fontWeight: 800, fontSize: 18 },
    normal: { bg: WHITE, border: GRAY200, color: GRAY990, fontWeight: 600, fontSize: 15 },
  };
  const s = styles[variant] || styles.normal;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 대시선 */}
      <div style={{ width: 16, height: 1, background: GRAY200, flexShrink: 0 }} />
      {/* 뱃지 */}
      <div style={{
        padding: "4px 12px", borderRadius: 20,
        background: s.bg, border: `1.5px solid ${s.border}`,
        fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color,
        whiteSpace: "nowrap", lineHeight: "22px", minWidth: 52, textAlign: "center",
      }}>
        {rate}
      </div>
      {/* 화살표 (살짝 둥글게) */}
      <svg width="8" height="10" viewBox="0 0 8 10" style={{ marginLeft: 2, flexShrink: 0 }}>
        <path d="M1 1.5L6 5L1 8.5" stroke={GRAY800} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7-1. LABELED LINE CHART (데이터 포인트 라벨 라인 차트)
//    - 커스텀 SVG, 데이터 포인트에 값 라벨 표시
//    - 첫 번째 항목 하이라이트 컬럼 (옵션)
//    - 하단 테이블 (카테고리 + 건수)
//    - 범례, 어노테이션 화살표 지원
// ═══════════════════════════════════════════════════════════════════════════
export function LabeledLineChart({
  title,
  subtitle,
  series,       // [{ id, color, data: [{ x, y }], labelColor? }]
  categories,   // [{ label, count }]
  highlightFirst = false,
  height: chartH = 260,
  annotations,  // [{ fromIdx, toIdx, seriesIdx }]  점선 화살표
}) {
  const FF = "Pretendard, sans-serif";
  const [hovered, setHovered] = useState(null); // { si, di }
  const [hoveredCol, setHoveredCol] = useState(null); // column index
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    setContainerW(containerRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // 좌측 margin 확대 — Y축 tick 라벨 들어갈 자리 (Nivo LineChart와 일관)
  const margin = { top: 40, right: 40, bottom: 10, left: 60 };
  const catCount = categories?.length || (series[0]?.data.length || 0);

  // 값 범위 계산
  const allY = series.flatMap(s => s.data.map(d => d.y));
  const minY = Math.floor(Math.min(...allY) - 3);
  const maxY = Math.ceil(Math.max(...allY) + 3);

  // SVG 영역 크기 (컨테이너 너비 기반)
  const totalW = containerW;
  const plotW = totalW - margin.left - margin.right;
  const plotH = chartH - margin.top - margin.bottom;

  const xStep = catCount > 1 ? plotW / (catCount - 1) : plotW;
  const toX = (i) => margin.left + i * xStep;
  const toY = (v) => margin.top + plotH - ((v - minY) / (maxY - minY)) * plotH;

  // Y축 tick — Nivo LineChart 와 동일하게 5개 균등
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => {
    const v = minY + ((maxY - minY) / (yTickCount - 1)) * i;
    return Math.round(v);
  });

  // 하이라이트 컬럼 너비
  const hlW = xStep;

  return (
    <div ref={containerRef} style={{ fontFamily: FF, width: "100%" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", marginBottom: 16 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 14, fontWeight: 400, color: GRAY800, marginBottom: 20 }}>{subtitle}</div>}

      <div style={{ position: "relative" }}>
        {/* 범례 (우측 상단, 그래프 호버와 안 겹치게 약간 위로) */}
        <div style={{ position: "absolute", top: -24, right: 0, display: "flex", flexDirection: "column", gap: 8, zIndex: 2 }}>
          {series.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="30" height="12">
                <line x1="0" y1="6" x2="22" y2="6" stroke={s.color} strokeWidth="2" />
                <circle cx="11" cy="6" r="4" fill={WHITE} stroke={s.color} strokeWidth="2" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 500, color: GRAY990 }}>{s.id}</span>
            </div>
          ))}
        </div>

        <svg viewBox={`0 0 ${totalW} ${chartH}`} width="100%" style={{ display: "block", overflow: "hidden" }}>
          {/* Y축 grid + tick (Nivo LineChart 와 일관) */}
          {yTicks.map((tv, ti) => (
            <g key={`yt-${ti}`}>
              <line
                x1={margin.left} x2={totalW - margin.right}
                y1={toY(tv)} y2={toY(tv)}
                stroke={GRAY200} strokeWidth={1}
              />
              <text
                x={margin.left - 12} y={toY(tv)}
                textAnchor="end" dominantBaseline="middle"
                style={{ fontSize: 12, fill: GRAY800, fontFamily: FF }}
              >{tv}</text>
            </g>
          ))}
          {/* 호버 시 세로 점선 (다른 라인차트 crosshair 와 통일) */}
          {hoveredCol !== null && (
            <line
              x1={toX(hoveredCol)} x2={toX(hoveredCol)}
              y1={margin.top - 4} y2={margin.top + plotH + 4}
              stroke={GRAY800} strokeWidth={1} strokeOpacity={0.8}
              strokeDasharray="4 4"
            />
          )}

          {/* 라인 + 포인트 */}
          {series.map((s, si) => {
            const pts = s.data.map((d, di) => ({ x: toX(di), y: toY(d.y), val: d.y, di }));
            const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            const isOtherHovered = hovered !== null && hovered.si !== si;

            return (
              <g key={s.id} style={{ opacity: isOtherHovered ? 0.5 : 1, transition: "opacity 0.15s" }}>
                {/* 라인 */}
                <path d={linePath} fill="none" stroke={s.color} strokeWidth={2} />
                {/* 포인트 + 라벨 */}
                {pts.map((p) => {
                  const isH = hovered?.si === si && hovered?.di === p.di;
                  const lblColor = s.labelColor || s.color;
                  // 라벨 위치: 첫 번째 시리즈는 점 위, 나머지는 점 아래 (라인 겹침 방지)
                  const labelAbove = series.length === 1 ? true : si === 0;
                  const ly = labelAbove ? p.y - 14 : p.y + 22;
                  // 첫/마지막 점은 Y축 tick / 차트 우측과 겹치지 않게 라벨 anchor 조정
                  const isFirst = p.di === 0;
                  const isLast = p.di === catCount - 1;
                  const lAnchor = isFirst ? "start" : isLast ? "end" : "middle";
                  const lOffsetX = isFirst ? 6 : isLast ? -6 : 0;

                  return (
                    <g key={p.di}
                      onMouseEnter={() => setHovered({ si, di: p.di })}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "default" }}
                    >
                      <circle cx={p.x} cy={p.y} r={isH ? 6 : 5} fill={WHITE} stroke={s.color} strokeWidth={2}
                        style={{ transition: "r 0.15s" }} />
                      <text x={p.x + lOffsetX} y={ly} textAnchor={lAnchor} dominantBaseline="auto"
                        style={{ fontSize: isH ? 16 : 14, fontWeight: 700, fill: lblColor, fontFamily: FF }}>
                        {p.val}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* 컬럼별 호버 영역 (투명 rect) */}
          {Array.from({ length: catCount }).map((_, ci) => (
            <rect
              key={`hover-col-${ci}`}
              x={toX(ci) - hlW / 2}
              y={0}
              width={hlW}
              height={chartH}
              fill="transparent"
              style={{ cursor: "default" }}
              onMouseEnter={(e) => {
                setHoveredCol(ci);
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
              onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
              onMouseLeave={() => {
                setHoveredCol(null);
              }}
            />
          ))}

          {/* 어노테이션 화살표 (점선 + 삼각형) */}
          {annotations?.map((ann, ai) => {
            const fromS = series[ann.fromSeries ?? 1];
            const toS = series[ann.toSeries ?? 0];
            if (!fromS || !toS) return null;
            const idx = ann.index ?? 1;
            const fromY = toY(fromS.data[idx].y);
            const toYPos = toY(toS.data[idx].y);
            const x = toX(idx);
            const color = toS.color || CHART_COLORS[0];
            const topY = Math.min(fromY, toYPos);
            const botY = Math.max(fromY, toYPos);
            const gap = 9; // 원 중심에서 반지름5 + 간격4
            return (
              <g key={`ann-${ai}`}>
                {/* 점선 */}
                <line x1={x} y1={topY + gap + 6} x2={x} y2={botY - gap - 6}
                  stroke={color} strokeWidth={1.5} strokeDasharray="4 3" />
                {/* 위쪽 화살표 (▲) */}
                <polygon points={`${x},${topY + gap} ${x - 4},${topY + gap + 6} ${x + 4},${topY + gap + 6}`}
                  fill={color} />
                {/* 아래쪽 화살표 (▼) */}
                <polygon points={`${x - 4},${botY - gap - 6} ${x + 4},${botY - gap - 6} ${x},${botY - gap}`}
                  fill={color} />
              </g>
            );
          })}
        </svg>

        {/* 호버 툴팁 */}
        {hoveredCol !== null && categories && (
          <div style={{
            position: "absolute",
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
            background: WHITE,
            border: `1px solid ${GRAY200}`,
            borderRadius: 6,
            padding: "10px 12px",
            fontFamily: FF,
            zIndex: 10,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800, marginBottom: 6 }}>
              {categories[hoveredCol]?.label}
              {categories[hoveredCol]?.count != null && (
                <span style={{ fontWeight: 400, color: GRAY800, marginLeft: 4 }}>
                  ({categories[hoveredCol].count.toLocaleString()})
                </span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "max-content max-content", columnGap: 16, rowGap: 4, alignItems: "center" }}>
              {series.map((s, si) => (
                <React.Fragment key={si}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800 }}>{s.id}</span>
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990, justifySelf: "end" }}>{s.data[hoveredCol]?.y}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 카테고리 라벨 — Nivo axisBottom 스타일 (별도 라인 없이 라벨만) */}
      {categories && (
        <div style={{ marginTop: 4, padding: `0 ${(margin.right / totalW) * 100}% 0 ${(margin.left / totalW) * 100}%` }}>
          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", padding: "8px 0" }}>
            {categories.map((c, i) => (
              <span key={i} style={{ flex: "0 0 auto", width: 0, display: "flex", justifyContent: "center", whiteSpace: "nowrap", fontSize: 12, fontWeight: 500, color: GRAY800 }}>{c.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FlowTable({
  title,
  subtitle,
  groups = [],
  // groups: [{ label: "자동기능", rows: [{ label, description?, left, rate, right }] }]
  // 또는 flat data:
  data = [],   // [{ label, description?, left, rate, right, group? }]
  columns = { left: "사용해 본 기능", right: "사용 중인 기능" },
  style,
}) {
  const FF = "Pretendard, sans-serif";

  // flat data → groups 변환
  const resolvedGroups = groups.length > 0 ? groups : [{ label: null, rows: data }];

  // 전체 rates에서 max/min 구하기
  const allRates = resolvedGroups.flatMap(g => g.rows.map(r => r.rate));
  const maxR = Math.max(...allRates);
  const minR = Math.min(...allRates);

  const getVariant = (rate) => {
    if (rate === maxR) return "best";
    if (rate === minR) return "worst";
    return "normal";
  };

  return (
    <div style={{ fontFamily: FF, ...style }}>
      {title && <div style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: GRAY990, marginBottom: 2 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: GRAY800, marginBottom: 16 }}>{subtitle}</div>}

      {/* 범례 (우측 상단) */}
      <div style={{ display: "flex", gap: 20, justifyContent: "flex-end", marginBottom: 12 }}>
        {[
          { fill: GRAY200, label: "전환율" },
          { fill: RED500, label: "우수 전환율" },
          { fill: CHART_COLORS[0], label: "병목 전환율" },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.fill }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {(() => {
        // 공통 그리드 컬럼 정의 (헤더 + 행 동일)
        const COL = "100px 1fr 90px 110px 90px";
        return (
          <>
            {/* 헤더 */}
            <div style={{ display: "grid", gridTemplateColumns: COL, gap: 0, alignItems: "end", padding: "10px 0", borderBottom: `1px solid ${GRAY800}` }}>
              <div />
              <div />
              <div style={{ fontSize: 13, fontWeight: 700, color: GRAY990, textAlign: "center", whiteSpace: "nowrap" }}>{columns.left}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: GRAY990, textAlign: "center", whiteSpace: "nowrap" }}>전환율</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: GRAY990, textAlign: "center", whiteSpace: "nowrap" }}>{columns.right}</div>
            </div>

            {/* 그룹 + 행 */}
            {resolvedGroups.map((group, gi) => (
              <div key={gi}>
                {group.rows.map((row, ri) => (
                  <div key={ri} style={{
                    display: "grid", gridTemplateColumns: COL, gap: 0, alignItems: "center",
                    padding: "14px 0", borderBottom: `1px solid ${GRAY200}`,
                  }}>
                    {/* 그룹 라벨 (첫 번째 행에만) */}
                    <div style={{ fontSize: 14, fontWeight: 700, color: GRAY990 }}>
                      {ri === 0 && group.label ? group.label : ""}
                    </div>
                    {/* 기능명 + 설명 */}
                    <div style={{ paddingRight: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: GRAY990 }}>{row.label}</span>
                      {row.description && (
                        <span style={{ fontSize: 12, fontWeight: 400, color: GRAY800, marginLeft: 6 }}>{row.description}</span>
                      )}
                    </div>
                    {/* 좌측 값 */}
                    <div style={{ fontSize: 15, fontWeight: 500, color: GRAY990, textAlign: "center" }}>
                      {row.left}
                    </div>
                    {/* 전환율 뱃지 */}
                    <RateBadge rate={row.rate} variant={getVariant(row.rate)} />
                    {/* 우측 값 */}
                    <div style={{ fontSize: 15, fontWeight: 500, color: GRAY990, textAlign: "center" }}>
                      {row.right}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QuadrantChart (Segment Matrix – 2×2 매트릭스)
// Figma: 축 화살표 라인 + 균등 4분할 그리드
// ═══════════════════════════════════════════════════════════════════════════

const F = "Pretendard, sans-serif";
const AXIS_COLOR = T.gray800;

export function QuadrantChart({
  title,
  subtitle,
  xAxis = { label: "X Axis", low: "Low", high: "High" },
  yAxis = { label: "Y Axis", low: "Low", high: "High" },
  quadrants = [],
  footnote,
  style,
}) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 값 기반 행/열 비율 계산 (quadrants: [topLeft, topRight, bottomLeft, bottomRight])
  const vals = quadrants.map(q => Math.max(parseFloat(q.value) || 1, 0.5));
  const colLeft  = vals[0] + vals[2]; // 왼쪽 열
  const colRight = vals[1] + vals[3]; // 오른쪽 열
  const rowTop   = vals[0] + vals[1]; // 위 행
  const rowBot   = vals[2] + vals[3]; // 아래 행
  // 최소 25% 보장 (작은 영역에서도 라벨+값 표시 가능하도록)
  const clamp = (a, b) => {
    const min = 0.25, total = a + b, ra = a / total;
    return ra < min ? [min, 1 - min] : ra > (1 - min) ? [1 - min, min] : [ra, 1 - ra];
  };
  const [cL, cR] = clamp(colLeft, colRight);
  const [rT, rB] = clamp(rowTop, rowBot);

  /*
   * Layout: 축 L자 + 값 비례 그리드
   */

  return (
    <div style={{ fontFamily: F, ...style }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990, textAlign: "center", marginBottom: 60 }}>{title}</div>}

      {/* 전체를 table-like 구조로: Y라벨 | Y축선 | [그리드+X축선+X라벨] */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1.5px 1fr", gridTemplateRows: "auto auto auto", columnGap: 0, rowGap: 0 }}>

        {/* ── Row 0: 화살표 팁 ── */}
        <div style={{ gridColumn: "1", gridRow: "1" }} />
        <div style={{ gridColumn: "2", gridRow: "1", display: "flex", justifyContent: "center", paddingBottom: 2 }}>
          <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: `7px solid ${AXIS_COLOR}` }} />
        </div>
        <div style={{ gridColumn: "3", gridRow: "1" }} />

        {/* ── Row 1: Y라벨 | Y축선 | 사분면 그리드 ── */}
        <div style={{ gridColumn: "1", gridRow: "2", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", paddingRight: 8 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.gray990, lineHeight: "22px" }}>{yAxis.label}</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>({yAxis.high})</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>({yAxis.low})</div>
        </div>
        <div style={{ gridColumn: "2", gridRow: "2", background: AXIS_COLOR, position: "relative", zIndex: 5 }} />
        {/* 사분면 그리드: 고정 높이로 빈 공간 제거 */}
        <div style={{ gridColumn: "3", gridRow: "2" }}>
          {(() => {
            // 상단/하단 행 높이를 값 비례로 계산 (px 기준)
            const totalH = 400;
            const topH = Math.max(totalH * rT, 70);
            const botH = Math.max(totalH * rB, 70);
            return (
              <div style={{
                display: "grid",
                gridTemplateColumns: `${cL}fr ${cR}fr`,
                gridTemplateRows: `${topH}px ${botH}px`,
                width: "100%",
              }}>
                {quadrants.map((q, i) => {
                  const isHovered = hovered === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={(e) => {
                        setHovered(i);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: q.color || T.gray100,
                        borderRadius: i === 1 ? "0 4px 0 0" : 0,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: 16, cursor: "default", overflow: "visible",
                        transition: "filter 0.15s",
                        filter: isHovered ? "brightness(0.96)" : "none",
                        position: "relative", zIndex: isHovered ? 2 : 1,
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: q.labelColor || T.gray990, textAlign: "center" }}>
                        {q.label}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: "36px", color: q.labelColor || T.gray990, textAlign: "center" }}>
                        {q.value}<span style={{ fontSize: 18, fontWeight: 400 }}>%</span>
                      </div>
                      {/* 호버 팝업 툴팁: 마우스 따라다님 */}
                      {isHovered && (
                        <div style={{
                          position: "absolute",
                          left: mousePos.x + 12,
                          top: mousePos.y - 12,
                          transform: "translateY(-100%)",
                          zIndex: 9999, pointerEvents: "none",
                        }}>
                          <div style={{ ...tooltipBox, whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>
                              {q.tag ? `${q.tag} · ${q.label}` : q.label}
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>
                              {q.value}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* ── Row 2: X축선 (col 2~3 연결로 Y축선과 정확히 교차) ── */}
        <div style={{ gridColumn: "1", gridRow: "3" }} />
        <div style={{ gridColumn: "2 / 4", gridRow: "3", position: "relative", zIndex: 5 }}>
          {/* X축 가로선 — Y축선(col2)부터 시작하여 화살표까지 */}
          <div style={{ position: "relative", height: 1.5, background: AXIS_COLOR, marginRight: 10 }}>
            <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${AXIS_COLOR}` }} />
          </div>
          {/* X축 라벨 */}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>({xAxis.high})</span>
            <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800 }}>
              ({xAxis.low})&ensp;<span style={{ fontSize: 16, fontWeight: 600, color: T.gray990 }}>{xAxis.label}</span>
            </span>
          </div>
        </div>
      </div>

      {footnote && <div style={{ fontSize: 13, fontWeight: 400, color: T.gray800, marginTop: 16 }}>{footnote}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CLUSTER PROFILE TABLE
//   클러스터별 프로필 비교 테이블
//   - 헤더: 클러스터 이름 + 키워드
//   - 카테고리별 순위 비교 (1순위 하이라이트)
//   data: {
//     clusters: [{ name:"클러스터1", keywords:["30대 초중반","재미있고","트렌디한 사람"] }],
//     categories: [
//       { label:"성별", ranks:["1순위","2순위"],
//         values:[["중성","남성"],["여성","중성"],["여성","중성"]] },
//     ]
//   }
// ═══════════════════════════════════════════════════════════════════════
// ClusterProfileTable 은 report-components.jsx 로 이동됨


// ═══════════════════════════════════════════════════════════════════════
// GROUPED BAR (Nivo - 세로 그룹/스택 막대)
// ═══════════════════════════════════════════════════════════════════════
// GroupedBarChart 개별 바 — 라운드 + 툴팁
function GroupedBarItem({ bar, isStacked, actualKeys, valueSuffix }) {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const v = bar.data.value;
  const isNeg = v < 0;
  const R = Math.max(0, Math.min(8, bar.width / 2, bar.height / 2));
  let corners;
  if (isStacked) {
    const isLastKey = bar.data.id === actualKeys[actualKeys.length - 1];
    corners = isLastKey
      ? (isNeg ? { tl: 0, tr: 0, br: R, bl: R } : { tl: R, tr: R, br: 0, bl: 0 })
      : { tl: 0, tr: 0, br: 0, bl: 0 };
  } else {
    corners = isNeg
      ? { tl: 0, tr: 0, br: R, bl: R }
      : { tl: R, tr: R, br: 0, bl: 0 };
  }
  const showTip = (e) => {
    showTooltipFromEvent(
      <Tooltip label={`${bar.data.indexValue} — ${bar.data.id}`} value={`${Number(v).toLocaleString()}${valueSuffix || ""}`} />,
      e
    );
  };
  return (
    <g
      transform={`translate(${bar.x},${bar.y})`}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.85)"; e.currentTarget.style.transition = "filter 0.15s ease"; showTip(e); }}
      onMouseMove={showTip}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; hideTooltip(); }}
      style={{ cursor: "pointer" }}
    >
      <path d={roundedRectPath(bar.width, bar.height, corners)} fill={bar.color} />
    </g>
  );
}

export function GroupedBarChart({ data, keys, indexBy = "label", title, subtitle, stacked = false, layout = "vertical", colors, showValueLabels = true, valueSuffix = "" }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);
  const isStacked = stacked;
  const paletteColors = colors || CHART_COLORS;
  // 차트 폭 추적 — X축 라벨 ellipsis 폭 계산용
  const containerRef = useRef(null);
  const [chartW, setChartW] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setChartW(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  // 음수 데이터 자동 지원 — 데이터 min/max 계산해서 명시적으로 전달
  const allValues = data.flatMap((d) => actualKeys.map((k) => Number(d[k]) || 0));
  const rawMin = Math.min(...allValues, 0);
  const rawMax = Math.max(...allValues, 0);
  const padPct = 0.15;
  const range = rawMax - rawMin || 1;
  const dataMin = rawMin < 0 ? Math.floor(rawMin - range * padPct) : 0;
  const dataMax = Math.ceil(rawMax + range * padPct);
  const hasNegative = rawMin < 0;
  // 음수 데이터 — 0과 음수 구간을 포함한 tick 배열을 명시적으로 생성
  const niceStep = (() => {
    const mag = Math.pow(10, Math.floor(Math.log10(range)));
    const norm = range / mag;
    if (norm <= 2) return mag / 5;
    if (norm <= 5) return mag / 2;
    return mag;
  })();
  const tickValues = (() => {
    if (!hasNegative) return undefined;
    const lo = Math.floor(dataMin / niceStep) * niceStep;
    const hi = Math.ceil(dataMax / niceStep) * niceStep;
    const arr = [];
    for (let v = lo; v <= hi; v += niceStep) arr.push(v);
    return arr;
  })();
  // X축 라벨 — 상단에 Solid Secondary 뱃지 형태로 렌더
  const XAxisLayer = ({ bars }) => {
    const groups = {};
    bars.forEach((bar) => {
      const idx = bar.data.indexValue;
      if (!groups[idx]) groups[idx] = [];
      groups[idx].push(bar);
    });
    // 뱃지: bg #F0F0F2 (gray100) / text #7B7E85 (gray800) / radius 8 / padding 4px 10px
    const fontSize = 13;
    const charW = 8; // 대략 한글 14px 폭
    const padX = 10;
    const padY = 4;
    const badgeH = fontSize + padY * 2 + 4; // 4px line-height 여유
    const badgeY = -badgeH - 4; // 플롯 영역 위 4px
    return (
      <g>
        {Object.entries(groups).map(([idx, gb]) => {
          const minX = Math.min(...gb.map((b) => b.x));
          const maxX = Math.max(...gb.map((b) => b.x + b.width));
          const cx = (minX + maxX) / 2;
          const text = String(idx);
          const badgeW = Math.max(text.length * charW + padX * 2, 40);
          return (
            <g key={idx}>
              <rect
                x={cx - badgeW / 2}
                y={badgeY}
                width={badgeW}
                height={badgeH}
                rx={8}
                ry={8}
                fill="#F0F0F2"
              />
              <text
                x={cx}
                y={badgeY + badgeH / 2}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize, fontWeight: 500, fill: "#7B7E85", fontFamily: "Pretendard, sans-serif" }}
              >
                {text}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // 값 라벨 — 막대가 충분히 크면 안쪽(흰/그레이), 작으면 외부(어두운 색)
  // 스택 모드는 위/아래가 다른 세그먼트이므로 작을 땐 외부 표시 대신 숨김
  // 그레이 배경에는 흰 글자 가독성 떨어지므로 GRAY500 으로 (HBar/StackedHBar 일관성)
  // 외부 표시 라벨 — 호버 시 툴팁 디스패치
  const ExternalLabel = ({ bar, v, x, y, isNeg }) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();
    const showTip = (e) => {
      showTooltipFromEvent(
        <Tooltip label={`${bar.data.indexValue} — ${bar.data.id}`} value={`${Number(v).toLocaleString()}${valueSuffix || ""}`} />,
        e
      );
    };
    return (
      <text
        x={x} y={y} textAnchor="middle" dominantBaseline={isNeg ? "hanging" : "auto"}
        onMouseEnter={showTip}
        onMouseMove={showTip}
        onMouseLeave={hideTooltip}
        style={{ fontSize: 12, fontWeight: 600, fill: GRAY990, fontFamily: "Pretendard, sans-serif", cursor: "pointer", pointerEvents: "auto" }}
      >
        {v.toLocaleString()}{valueSuffix}
      </text>
    );
  };
  const ValueLabelsLayer = ({ bars }) => (
    <g>
      {bars.map((bar) => {
        const v = bar.data.value;
        if (v == null) return null;
        const isNeg = v < 0;
        const x = bar.x + bar.width / 2;
        const tooSmall = bar.height < 24;
        const c = (bar.color || "").toLowerCase();
        const isGrayBar = c === "#e6e7e9" || c === "#e0e0e2" || c === GRAY200.toLowerCase() || c === GRAY100.toLowerCase();
        const insideTextColor = isGrayBar ? GRAY500 : WHITE;
        if (tooSmall) {
          if (isStacked) return null;
          // grouped 모드: 막대 외부 표시 — 호버 시 툴팁 가능
          const y = isNeg ? bar.y + bar.height + 14 : bar.y - 6;
          return <ExternalLabel key={bar.key} bar={bar} v={v} x={x} y={y} isNeg={isNeg} />;
        }
        // 안쪽
        const y = isNeg ? bar.y + bar.height - 8 : bar.y + 14;
        return (
          <text key={bar.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 12, fontWeight: 600, fill: insideTextColor, fontFamily: "Pretendard, sans-serif", pointerEvents: "none" }}>
            {v.toLocaleString()}{valueSuffix}
          </text>
        );
      })}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {(title || subtitle) && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {title && (
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>
              {(() => {
                if (typeof title === "string") {
                  const m = title.match(/^(.*?)\s*(\(.+\))\s*$/);
                  if (m) {
                    return (<>{m[1]}<span style={{ fontWeight: 400, color: GRAY990, marginLeft: 6 }}>{m[2]}</span></>);
                  }
                }
                return title;
              })()}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: GRAY800, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%", height: 380 }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={paletteColors}
          groupMode={isStacked ? "stacked" : "grouped"}
          layout={layout}
          margin={{ top: 30, right: 20, bottom: 100, left: 72 }}
          padding={0.25}
          innerPadding={isStacked ? 0 : 4}
          borderRadius={0}
          barComponent={(props) => (
            <GroupedBarItem {...props} isStacked={isStacked} actualKeys={actualKeys} valueSuffix={valueSuffix} />
          )}
          enableLabel={false}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          minValue={dataMin}
          maxValue={dataMax}
          markers={hasNegative ? [{ axis: "y", value: 0, lineStyle: { stroke: "#CACCCF", strokeWidth: 1 } }] : []}
          axisBottom={hasNegative ? null : {
            tickSize: 0,
            tickPadding: 16,
            renderTick: (tick) => {
              const MARGIN_L = 72, MARGIN_R = 20;
              const PADDING = 0.25;
              const plotW = Math.max(chartW - MARGIN_L - MARGIN_R, 0);
              // d3 scaleBand: step = plotW / (n + padding), bandwidth = step × (1 - padding)
              const step = plotW > 0 ? plotW / (data.length + PADDING) : 80;
              const barW = step * (1 - PADDING);
              // 라벨은 bar 폭보다 약간 넓게 (+ 2px) 해서 내부 텍스트가 동일하게 보이도록
              const boxW = Math.max(barW + 2, 40);
              return (
                <g transform={`translate(${tick.x},${tick.y})`}>
                  <foreignObject x={-boxW / 2} y={10} width={boxW} height={40}>
                    <div style={{
                      width: "100%",
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: 500,
                      color: GRAY800,
                      fontFamily: "Pretendard, sans-serif",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={String(tick.value)}>
                      {tick.value}
                    </div>
                  </foreignObject>
                </g>
              );
            },
          }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: tickValues || 5, format: (v) => `${v.toLocaleString()}${valueSuffix}` }}
          layers={(() => {
            const baseLayers = ["grid", "axes", "bars", "markers"];
            if (showValueLabels) baseLayers.push(ValueLabelsLayer);
            if (hasNegative) baseLayers.push(XAxisLayer);
            baseLayers.push("legends");
            return baseLayers;
          })()}
          enableGridX={false}
          enableGridY
          gridYValues={tickValues || 5}
          onMouseEnter={(_datum, event) => {
            const el = event.currentTarget;
            el.style.filter = "brightness(0.85)";
            el.style.transition = "filter 0.15s ease";
          }}
          onMouseLeave={(_datum, event) => {
            const el = event.currentTarget;
            el.style.filter = "none";
          }}
          tooltip={({ id, value, indexValue }) => (
            <Tooltip label={`${indexValue} — ${id}`} value={`${value.toLocaleString()}${valueSuffix}`} />
          )}
        />
      </div>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: -30 }}>
        {actualKeys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: paletteColors[i % paletteColors.length] }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800, fontFamily: "Pretendard, sans-serif" }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DIVERGING STACKED BAR — NPS 분포 (비추천자/중립/추천자)
//   data: [{ label, 추천자, 중립, 비추천자 }] — 각 값은 %
//   0을 중심으로: 비추천자 = 좌측(음수), 추천자 = 우측(양수), 중립은 좌우 반씩 나눠 0을 감쌈
// ═══════════════════════════════════════════════════════════════════════
export function DivergingBarChart({
  data,
  title,
  valueSuffix = "%",
  colors = { detractor: "#FF6467", neutral: "#E6E7E9", promoter: "#7CCF00" },
  height = 380,
}) {
  const transformed = useMemo(() => data.map((d) => {
    const p = Number(d.추천자) || 0;
    const n = Number(d.중립) || 0;
    const dr = Number(d.비추천자) || 0;
    return {
      label: d.label,
      비추천자: -dr,
      중립_left: -(n / 2),
      중립_right: n / 2,
      추천자: p,
      _detractor: dr,
      _neutral: n,
      _promoter: p,
    };
  }), [data]);

  // keys 순서 = 스택 순서. 0에 가까운 쪽부터 바깥쪽으로:
  //   좌측: 중립_left(0에 붙음) → 비추천자(바깥)
  //   우측: 중립_right(0에 붙음) → 추천자(바깥)
  const keys = ["중립_left", "비추천자", "중립_right", "추천자"];

  // 축 범위 계산 — 좌/우 최대 막대 길이를 기준으로 대칭 범위
  const maxMag = Math.max(
    ...transformed.flatMap((d) => [Math.abs(d.비추천자 + d.중립_left), d.중립_right + d.추천자]),
    10
  );
  const tickStep = 20;
  const bound = Math.ceil(maxMag / tickStep) * tickStep;
  const tickValues = [];
  for (let v = -bound; v <= bound; v += tickStep) tickValues.push(v);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "Pretendard, sans-serif" }}>
      {title && (
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>
          {title}
        </div>
      )}
      <div style={{ width: "100%", height }}>
        <ResponsiveBar
          data={transformed}
          keys={keys}
          indexBy="label"
          colors={({ id }) => {
            if (id === "비추천자") return colors.detractor;
            if (id === "추천자") return colors.promoter;
            return colors.neutral;
          }}
          groupMode="stacked"
          layout="horizontal"
          margin={{ top: 10, right: 40, bottom: 48, left: 96 }}
          padding={0.3}
          borderRadius={2}
          minValue={-bound}
          maxValue={bound}
          enableLabel={false}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          markers={[{ axis: "x", value: 0, lineStyle: { stroke: GRAY300, strokeWidth: 1 } }]}
          axisBottom={{
            tickSize: 0, tickPadding: 10,
            tickValues,
            format: (v) => `${Math.abs(v)}${valueSuffix}`,
          }}
          axisLeft={{ tickSize: 0, tickPadding: 12 }}
          enableGridX
          gridXValues={tickValues}
          enableGridY={false}
          tooltip={({ id, indexValue, data: datum }) => {
            let origVal; let label;
            if (id === "비추천자") { origVal = datum._detractor; label = "비추천자"; }
            else if (id === "추천자") { origVal = datum._promoter; label = "추천자"; }
            else { origVal = datum._neutral; label = "중립"; }
            return <Tooltip label={`${indexValue} — ${label}`} value={`${origVal}${valueSuffix}`} />;
          }}
        />
      </div>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { label: "비추천자", color: colors.detractor },
          { label: "중립", color: colors.neutral },
          { label: "추천자", color: colors.promoter },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// KPI TREND CARD — 좌측 KPI 텍스트 블록 + 우측 미니 추이 라인/영역 차트
//   title/subtitle, value(big), delta({ value, positive }), data=[{x,y}]
//   variant: "blue"(상승 긍정) | "red"(하락 부정)
// ═══════════════════════════════════════════════════════════════════════
export function KPITrendCard({
  title,
  subtitle,
  value,
  delta,
  data,
  variant = "blue",
  suffix = "",
  style,
}) {
  const isRed = variant === "red";
  const BLUE500 = "#2B7FFF";
  // 차트 데이터 color — 레드는 Red 400(#FF6467) 사용 (그래프 전용 규칙)
  const lineColor = isRed ? "#FF6467" : BLUE500;
  const gradFromOpacity = 0.22;
  const gradId = useMemo(() => `kpi-trend-grad-${Math.random().toString(36).slice(2, 9)}`, []);
  const ys = (data || []).map((d) => Number(d.y) || 0);
  const yMax = Math.max(...ys, 0);
  const yNiceMax = Math.ceil(yMax * 1.1);
  const deltaColor = delta?.positive ? BLUE500 : RED500;
  const [hoverPoint, setHoverPoint] = useState(null);

  return (
    <div style={{
      display: "flex",
      gap: 0,
      alignItems: "stretch",
      background: "#fff",
      border: `1px solid ${GRAY200}`,
      borderRadius: 16,
      padding: 24,
      fontFamily: "Pretendard, sans-serif",
      ...style,
    }}>
      {/* Left: KPI text */}
      <div style={{ flex: "4 4 0", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {title && <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: GRAY800 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: "26px", color: GRAY990 }}>{value}</div>
          {delta && (
            <div>
              <span style={{ fontSize: 14, fontWeight: 400, color: GRAY800 }}>이전 기간 대비 </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: deltaColor }}>{delta.value}</span>
            </div>
          )}
        </div>
      </div>
      {/* Right: mini trend chart */}
      <div style={{ flex: "6 6 0", minWidth: 0, height: 180 }}>
        <ResponsiveLine
          data={[{ id: "series", data: (data || []).map((d) => ({ x: d.x, y: d.y })) }]}
          colors={[lineColor]}
          margin={{ top: 16, right: 48, bottom: 28, left: 24 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: yNiceMax }}
          curve="monotoneX"
          enableArea
          areaOpacity={1}
          defs={[{
            id: gradId,
            type: "linearGradient",
            colors: [
              { offset: 0, color: lineColor, opacity: gradFromOpacity },
              { offset: 100, color: lineColor, opacity: 0 },
            ],
          }]}
          fill={[{ match: "*", id: gradId }]}
          axisLeft={null}
          axisRight={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: 3,
            format: (v) => `${v}${suffix}`,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            // 라벨 수 최대 4개로 제한 — 첫/마지막 포함해서 균등 샘플링
            tickValues: (() => {
              const labels = (data || []).map((d) => d.x);
              const n = labels.length;
              if (n <= 4) return labels;
              const targetCount = 4;
              const stepIdx = (n - 1) / (targetCount - 1);
              const picked = [];
              for (let i = 0; i < targetCount; i++) {
                picked.push(labels[Math.round(i * stepIdx)]);
              }
              return [...new Set(picked)];
            })(),
          }}
          axisTop={null}
          enableGridX={false}
          enableGridY={false}
          enablePoints={false}
          useMesh
          onMouseMove={(point) => setHoverPoint(point)}
          onMouseLeave={() => setHoverPoint(null)}
          theme={{
            ...baseTheme,
            axis: {
              ...baseTheme.axis,
              ticks: {
                ...baseTheme.axis.ticks,
                text: { fontSize: 12, fill: GRAY800, fontFamily: "Pretendard, sans-serif" },
              },
            },
          }}
          lineWidth={1}
          layers={[
            "grid", "markers", "axes", "areas", "crosshair", "lines",
            ({ xScale, yScale }) => {
              if (!hoverPoint) return null;
              const cx = xScale(hoverPoint.data.x);
              const cy = yScale(hoverPoint.data.y);
              return (
                <circle
                  cx={cx} cy={cy} r={5}
                  fill={lineColor}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ pointerEvents: "none" }}
                />
              );
            },
            "slices", "mesh", "legends",
          ]}
          tooltip={({ point }) => (
            <Tooltip label={String(point.data.xFormatted)} value={`${point.data.yFormatted}${suffix}`} />
          )}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TIMELINE BAR CHART — 시계열 지표 (이탈율 등)
//   data: [{ label, value, type }] — type: "past"(회색) | "current"(파랑+배경) | "forecast"(빨강+배경)
//   current/forecast 막대는 연한 배경 패널로 강조 + 상단에 타입 라벨 노출
//   VBarChart 와 동일한 라운드 탑 막대 + 그리드 스타일
// ═══════════════════════════════════════════════════════════════════════
export function TimelineBarChart({
  data,
  title,
  valueSuffix = "",
  height = 340,
  colors = {
    past:     { bar: "#E6E7E9", bg: "transparent",            tagText: "" },
    current:  { bar: "#2B7FFF", bg: "rgba(43,127,255,0.08)",  tagText: "현재이탈률" },
    forecast: { bar: "#FF6467", bg: "rgba(255,100,103,0.10)", tagText: "예상이탈률" },
  },
}) {
  const values = data.map((d) => Number(d.value) || 0);
  const maxV = Math.max(...values, 0);
  const tickStep = maxV > 40 ? 10 : 5;
  // 최대값 이상으로는 tick·그리드 라인 생성 안 함 (빈 여백에 선만 뜨는 현상 방지)
  const yMax = Math.ceil(maxV / tickStep) * tickStep;
  const tickValues = [];
  for (let v = 0; v <= yMax; v += tickStep) tickValues.push(v);

  // 배경 패널 레이어 — current/forecast 막대 뒤에 항상 연한 색 패널 렌더 (플롯 전체 높이)
  const HighlightBgLayer = ({ bars, innerHeight, xScale }) => {
    const band = xScale.bandwidth ? xScale.bandwidth() : 0;
    const step = xScale.step ? xScale.step() : band * 1.3;
    const padSide = (step - band) / 2;
    return (
      <g>
        {bars.map((bar) => {
          const type = bar.data.data.type || "past";
          const spec = colors[type];
          if (!spec || spec.bg === "transparent") return null;
          const x = bar.x - padSide;
          const w = band + padSide * 2;
          return (
            <rect
              key={`bg-${bar.key}`}
              x={x}
              y={0}
              width={w}
              height={innerHeight}
              fill={spec.bg}
              rx={0}
            />
          );
        })}
      </g>
    );
  };

  // 라벨 레이어 — 값은 막대 내부 상단에 표시 (HBarChart Inline Value 와 동일한 규칙: 회색 막대 GRAY500, 컬러 막대 WHITE)
  //                타입 라벨(현재이탈률/예상이탈률)은 막대 위 외부에 색상 텍스트로
  const LabelLayer = ({ bars }) => (
    <g>
      {bars.map((bar) => {
        const type = bar.data.data.type || "past";
        const spec = colors[type] || colors.past;
        const v = bar.data.value;
        const cx = bar.x + bar.width / 2;
        const valueY = bar.y + 14;
        const tagY = bar.y - 12;
        const barC = (spec.bar || "").toLowerCase();
        const isGrayBar = barC === "#e6e7e9" || barC === "#e0e0e2" || barC === GRAY200.toLowerCase() || barC === GRAY100.toLowerCase();
        const valueColor = isGrayBar ? GRAY500 : WHITE;
        return (
          <g key={`lbl-${bar.key}`}>
            {spec.tagText && (
              <text
                x={cx} y={tagY}
                textAnchor="middle"
                style={{ fontSize: 12, fontWeight: 600, fill: spec.bar, fontFamily: "Pretendard, sans-serif" }}
              >
                {spec.tagText}
              </text>
            )}
            <text
              x={cx} y={valueY}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: 16,
                fontWeight: 600,
                fill: valueColor,
                fontFamily: "Pretendard, sans-serif",
                pointerEvents: "none",
              }}
            >
              {`${v}${valueSuffix}`}
            </text>
          </g>
        );
      })}
    </g>
  );

  // VBarChart 와 같은 라운드 탑 막대 + 호버 인덱스 업데이트
  const TimelineBarItem = ({ bar }) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();
    const type = bar.data.data.type || "past";
    const spec = colors[type] || colors.past;
    const R = Math.max(0, Math.min(8, bar.width / 2, bar.height / 2));
    const corners = { tl: R, tr: R, br: 0, bl: 0 };
    const showTip = (e) => {
      showTooltipFromEvent(
        <Tooltip
          label={`${bar.data.indexValue}${spec.tagText ? ` · ${spec.tagText}` : ""}`}
          value={`${bar.data.value}${valueSuffix}`}
        />,
        e
      );
    };
    return (
      <g
        transform={`translate(${bar.x},${bar.y})`}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = "brightness(0.88)";
          e.currentTarget.style.transition = "filter 0.15s ease";
          showTip(e);
        }}
        onMouseMove={showTip}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = "none";
          hideTooltip();
        }}
        style={{ cursor: "pointer" }}
      >
        <path d={roundedRectPath(bar.width, bar.height, corners)} fill={bar.color} />
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "Pretendard, sans-serif" }}>
      {title && (
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>
          {title}
        </div>
      )}
      <div style={{ width: "100%", height }}>
        <ResponsiveBar
          data={data}
          keys={["value"]}
          indexBy="label"
          colors={({ data: d }) => (colors[d.type || "past"] || colors.past).bar}
          padding={0.35}
          margin={{ top: 48, right: 24, bottom: 50, left: 60 }}
          minValue={0}
          maxValue={yMax}
          enableLabel={false}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues }}
          enableGridX={false}
          enableGridY
          gridYValues={tickValues}
          barComponent={TimelineBarItem}
          layers={["grid", HighlightBgLayer, "axes", "bars", LabelLayer]}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RADAR CHART
// ═══════════════════════════════════════════════════════════════════════
export function RadarChart({ data, keys, indexBy = "category", title, color = "#2B7FFF" }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveRadar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          maxValue={100}
          margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
          colors={[color]}
          fillOpacity={0.2}
          borderWidth={2}
          borderColor={color}
          dotSize={8}
          dotColor={WHITE}
          dotBorderWidth={2}
          dotBorderColor={color}
          gridLevels={4}
          gridShape="linear"
          gridLabelOffset={24}
          enableDotLabel={false}
          isInteractive
          animate
          motionConfig="gentle"
          theme={{
            ...baseTheme,
            grid: { line: { stroke: GRAY200, strokeWidth: 1 } },
          }}
          sliceTooltip={({ index, data: sliceData }) => (
            <div style={tooltipBox}>
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{index}</span>
              {sliceData.map((d, i) => (
                <span key={i} style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{d.formattedValue || d.value}%</span>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PSM 가격 수요 곡선 그래프
// ═══════════════════════════════════════════════════════════════════════
// PSM 4곡선 색 — CHART_COLORS 팔레트 순서(1·2·3·4번)
// Too Cheap=Blue500, Cheap=Lime500, Expensive=DeepPurple400, Too Expensive=Blue300
const PSM_COLORS = CHART_COLORS.slice(0, 4);
const PSM_DASH = [null, "8 4", "8 4", null];
const PSM_LABELS = ["Too Cheap", "Cheap", "Expensive", "Too Expensive"];

function PSMIntersectionDots({ intersections, xScale, yScale }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <g>
      {/* 1단계: 호버된 dot 의 X/Y 점선 가이드 (다른 요소 위에 올 수 있도록 먼저 렌더) */}
      {hoveredIdx !== null && (() => {
        const pt = intersections[hoveredIdx];
        const cx = xScale(pt.x), cy = yScale(pt.y);
        const yBase = yScale(0);
        const xBase = xScale.range ? xScale.range()[0] : 0;
        return (
          <g style={{ pointerEvents: "none" }}>
            <line x1={cx} y1={cy} x2={cx} y2={yBase}
              stroke={GRAY500} strokeDasharray="3 4" strokeWidth={1} />
            <line x1={xBase} y1={cy} x2={cx} y2={cy}
              stroke={GRAY500} strokeDasharray="3 4" strokeWidth={1} />
          </g>
        );
      })()}
      {/* 2단계: 모든 dot 원 */}
      {intersections.map((pt, i) => {
        const cx = xScale(pt.x), cy = yScale(pt.y);
        const isH = hoveredIdx === i;
        return (
          <g key={`dot-${i}`}>
            <circle cx={cx} cy={cy} r={isH ? 7 : 6} fill={WHITE} stroke={GRAY800} strokeWidth={1.5}
              style={{ cursor: "pointer", transition: "r 0.15s ease" }}
              onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
            <circle cx={cx} cy={cy} r={16} fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
          </g>
        );
      })}
      {/* 3단계: 호버된 tooltip */}
      {hoveredIdx !== null && (() => {
        const pt = intersections[hoveredIdx];
        const cx = xScale(pt.x), cy = yScale(pt.y);
        return (
          <foreignObject x={cx - 140} y={cy - 75} width={280} height={66} style={{ overflow: "visible", pointerEvents: "none" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ ...tooltipBox, padding: "10px 12px" }}>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{pt.fullLabel || pt.label}</span>
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{pt.price}</span>
              </div>
            </div>
          </foreignObject>
        );
      })()}
    </g>
  );
}

// 두 곡선의 교차점을 선형 보간으로 자동 계산
function findCrossing(seriesA, seriesB) {
  const dA = seriesA.data, dB = seriesB.data;
  for (let i = 0; i < dA.length - 1; i++) {
    const b1 = dB.find(d => d.x === dA[i].x);
    const b2 = dB.find(d => d.x === dA[i + 1].x);
    if (!b1 || !b2) continue;
    const d1 = dA[i].y - b1.y, d2 = dA[i + 1].y - b2.y;
    if (d1 * d2 <= 0 && d1 !== d2) {
      const t = d1 / (d1 - d2);
      return { x: Math.round(dA[i].x + t * (dA[i + 1].x - dA[i].x)), y: Math.round((dA[i].y + t * (dA[i + 1].y - dA[i].y)) * 10) / 10 };
    }
  }
  return null;
}

export function PSMChart({ data, title, intersections: manualPts }) {
  // data: [0]Too Cheap, [1]Cheap, [2]Expensive, [3]Too Expensive
  const auto = data.length === 4 ? [
    { label: "PMC", fullLabel: "PMC (Point of Marginal Cheapness)", color: "#8EC5FF", ...findCrossing(data[0], data[2]) },
    { label: "OPP", fullLabel: "OPP (Optimal Price Point)", color: "#2B7FFF", ...findCrossing(data[0], data[3]) },
    { label: "IPP", fullLabel: "IPP (Indifference Price Point)", color: "#7CCF00", ...findCrossing(data[1], data[2]) },
    { label: "PME", fullLabel: "PME (Point of Marginal Expensiveness)", color: "#8A77E0", ...findCrossing(data[3], data[1]) },
  ].filter(p => p.x != null).map(p => ({ ...p, price: `$${p.x?.toLocaleString()}` })) : [];
  const intersections = (manualPts && manualPts.length > 0) ? manualPts : auto;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveLine
          data={data}
          colors={PSM_COLORS}
          curve="monotoneX"
          lineWidth={2.5}
          enableArea={false}
          margin={{ top: 20, right: 40, bottom: 40, left: 60 }}
          xScale={{ type: "linear", min: "auto", max: "auto" }}
          yScale={{ type: "linear", min: 0, max: 100 }}
          enablePoints={false}
          enableGridX
          enableGridY
          gridYValues={[0, 25, 50, 75, 100]}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12, tickValues: 10 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: [0, 25, 50, 75, 100], format: v => `${v}%` }}
          useMesh={false}
          enableCrosshair={false}
          isInteractive={false}
          layers={[
            "grid", "markers", "axes",
            ({ xScale, innerHeight }) => {
              if (intersections.length < 2) return null;
              const xs = intersections.map(p => xScale(p.x)).sort((a, b) => a - b);
              return <rect x={xs[0]} y={0} width={xs[xs.length - 1] - xs[0]} height={innerHeight} fill="#EFF6FF" opacity={0.5} />;
            },
            ({ series, lineGenerator }) => series.map((s, i) => (
              <path key={s.id} d={lineGenerator(s.data.map(d => ({ x: d.position.x, y: d.position.y })))}
                fill="none" stroke={PSM_COLORS[i]} strokeWidth={2.5}
                strokeDasharray={PSM_DASH[i] || "none"} strokeLinecap="round" />
            )),
            ({ xScale, yScale }) => (
              <PSMIntersectionDots intersections={intersections} xScale={xScale} yScale={yScale} />
            ),
          ]}
        />
      </div>
      {/* 커스텀 범례 - 선 스타일(실선/점선) */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
        {PSM_LABELS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width={32} height={3}>
              <line x1={0} y1={1.5} x2={32} y2={1.5}
                stroke={PSM_COLORS[i]} strokeWidth={2.5}
                strokeDasharray={PSM_DASH[i] || "none"} strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: GRAY990, fontFamily: "Pretendard, sans-serif" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FUNNEL CHART (퍼널 차트 – 단계별 전환율 + 이탈율)
//   steps: [{ label, value, sublabel? }]
//   각 단계별 바 높이가 값에 비례, 단계 간 흐름 영역 표시, 이탈율 계산
// ═══════════════════════════════════════════════════════════════════════

const BLUE_SCALE = [
  T.blue600 || "#155DFC",
  T.blue500 || "#2B7FFF",
  T.blue400 || "#51A2FF",
  T.blue300 || "#8EC5FF",
  T.blue200 || "#BEDBFF",
  T.blue100 || "#DBEAFE",
];

export function FunnelChart({
  title,
  steps = [],
  height: chartHeight = 440,
  groupLabel = "전환",
  style,
}) {
  const FF = "Pretendard, sans-serif";
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(800);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [hoveredHatch, setHoveredHatch] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const hatchId = "funnel-dropoff-hatch";

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(containerRef.current);
    setContainerW(containerRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // 값 계산
  const maxVal = steps.length > 0 ? steps[0].value : 1;
  const stepsData = useMemo(() => steps.map((s, i) => {
    const prev = i > 0 ? steps[i - 1].value : s.value;
    const pct = maxVal > 0 ? (s.value / maxVal * 100) : 0;
    const convRate = prev > 0 ? (s.value / prev * 100) : 100;
    const dropoff = prev > 0 ? ((prev - s.value) / prev * 100) : 0;
    const dropoffCount = i > 0 ? prev - s.value : 0;
    const totalDropPct = 100 - pct;
    const totalDropCount = maxVal - s.value;
    return { ...s, pct, convRate, dropoff, dropoffCount, totalDropPct, totalDropCount, index: i };
  }), [steps, maxVal]);

  // 레이아웃 (Amplitude Closed Funnel 스타일)
  const margin = { top: 40, right: 32, bottom: 80, left: 56 };
  const plotW = containerW - margin.left - margin.right;
  const plotH = chartHeight - margin.top - margin.bottom;
  const stepCount = stepsData.length;
  // 바 너비: 슬롯의 65%, 나머지는 간격
  const stepW = stepCount > 0 ? plotW / stepCount : 0;
  const barW = stepW * 0.65;
  const barPad = (stepW - barW) / 2;

  // 0~100% 스케일 기준 높이
  const getBarH = (pct) => (pct / 100) * plotH;

  const blueColor = T.blue500 || "#2B7FFF";
  const blueLight = T.blue50 || "#EFF6FF";
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div ref={containerRef} style={{ fontFamily: FF, width: "100%", ...style }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", marginBottom: 16 }}>{title}</div>}

      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${containerW} ${chartHeight}`} width="100%" style={{ display: "block", overflow: "visible" }}>
          <defs><HatchPattern id={hatchId} /></defs>

          {/* Y축: 그리드 라인 + % 라벨 (0, 25, 50, 75, 100) */}
          {gridLines.map(p => {
            const y = margin.top + plotH - getBarH(p);
            return (
              <g key={`grid-${p}`}>
                <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y}
                  stroke={GRAY200}
                  strokeWidth={1}
                />
                <text x={margin.left - 12} y={y + 4} textAnchor="end"
                  style={{ fontSize: 12, fontWeight: 400, fill: GRAY800, fontFamily: FF }}>
                  {p}%
                </text>
              </g>
            );
          })}

          {/* 바 (빗금 이탈 + 솔리드 실값) + 상단 % pill 배지 */}
          {stepsData.map((s, i) => {
            const x = margin.left + i * stepW + barPad;
            const cx = x + barW / 2;
            const barH = getBarH(s.pct);
            const y = margin.top + plotH - barH;
            const hatchH = plotH - barH;
            const hatchY = margin.top;
            const isH = hoveredStep === i;
            const isHatchHovered = hoveredHatch === i;
            const updateTooltipPos = (e) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            };

            // pill 배지 위치: 블루 바 상단에 반쯤 걸치게 (Amplitude 스타일)
            const pillW = 62, pillH = 24;
            const pillY = y - pillH / 2; // 바 상단 y를 중심으로 배지가 반쯤 위에, 반쯤 아래에 겹침
            const pillX = cx - pillW / 2;

            // 상단 라운드: 빗금 영역이 보이면 빗금에, 100%면 솔리드 블루에
            const hatchVisible = hatchH > 2;
            const hatchR = hatchVisible ? Math.max(0, Math.min(8, barW / 2, hatchH / 2)) : 0;
            const solidR = !hatchVisible ? Math.max(0, Math.min(8, barW / 2, barH / 2)) : 0;
            const hatchCorners = { tl: hatchR, tr: hatchR, br: 0, bl: 0 };
            const solidCorners = { tl: solidR, tr: solidR, br: 0, bl: 0 };
            return (
              <g key={`bar-${i}`}>
                {/* 빗금 이탈 영역 (호버 시 바 툴팁과 통합) */}
                {hatchVisible && (
                  <path d={roundedRectPath(barW, hatchH, hatchCorners)}
                    transform={`translate(${x},${hatchY})`}
                    fill={`url(#${hatchId})`}
                    onMouseEnter={(e) => { setHoveredStep(i); setHoveredHatch(null); updateTooltipPos(e); }}
                    onMouseMove={updateTooltipPos}
                    onMouseLeave={() => setHoveredStep(null)}
                    style={{ cursor: "default", transition: "opacity 0.2s", opacity: isH ? 0.85 : 1 }}
                  />
                )}
                {/* 솔리드 바 (실값) */}
                <path d={roundedRectPath(barW, barH, solidCorners)}
                  transform={`translate(${x},${y})`}
                  fill={blueColor}
                  onMouseEnter={(e) => { setHoveredStep(i); setHoveredHatch(null); updateTooltipPos(e); }}
                  onMouseMove={updateTooltipPos}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{ transition: "height 0.4s ease, y 0.4s ease", cursor: "default" }}
                />
                {isH && (
                  <path d={roundedRectPath(barW, barH, solidCorners)}
                    transform={`translate(${x},${y})`}
                    fill="rgba(0,0,0,0.08)" style={{ pointerEvents: "none" }}
                  />
                )}

                {/* % pill 배지 */}
                <g style={{ pointerEvents: "none" }}>
                  <rect x={pillX} y={pillY} width={pillW} height={pillH}
                    rx={4} fill={blueLight} stroke={blueColor} strokeOpacity={0.2}
                  />
                  <text x={cx} y={pillY + pillH / 2 + 4} textAnchor="middle"
                    style={{ fontSize: 12, fontWeight: 700, fill: blueColor, fontFamily: FF }}>
                    {s.pct.toFixed(2)}%
                  </text>
                </g>

                {/* 하단: 번호 + 단계명 (모두 플레인 텍스트) */}
                <text x={cx} y={margin.top + plotH + 26} textAnchor="middle"
                  style={{ fontSize: 13, fontWeight: isH ? 600 : 500, fill: isH ? GRAY990 : GRAY800, fontFamily: FF }}>
                  {i + 1}. {s.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 범례: 전환(솔리드) + 이탈(빗금) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 8, fontFamily: FF }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: blueColor, display: "inline-block" }} />
            <span style={{ fontSize: 13, fontWeight: 400, color: GRAY800 }}>{groupLabel}</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: `repeating-linear-gradient(45deg, ${GRAY100}, ${GRAY100} 2px, ${GRAY200} 2px, ${GRAY200} 3.5px)`,
              display: "inline-block",
              border: `1px solid ${GRAY200}`,
            }} />
            <span style={{ fontSize: 13, fontWeight: 400, color: GRAY800 }}>이탈</span>
          </span>
        </div>

        {/* 호버 툴팁 (바 + 빗금 통합, 컬러 강조 없음) */}
        {hoveredStep !== null && (() => {
          const s = stepsData[hoveredStep];
          const rows = [
            { label: "유저 수", value: s.value.toLocaleString() },
            { label: "전환율", value: `${s.pct.toFixed(1)}%`, color: blueColor },
            ...(s.index > 0 ? [{ label: "직전 대비 이탈", value: `-${s.dropoffCount.toLocaleString()} (${s.dropoff.toFixed(1)}%)`, color: RED500 }] : []),
          ];
          return (
            <div style={{
              position: "absolute",
              left: Math.min(tooltipPos.x + 16, containerW - 220),
              top: tooltipPos.y - 80,
              ...tooltipBox,
              padding: "10px 12px",
              alignItems: "stretch",
              zIndex: 10,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>
                Step {s.index + 1}: {s.label}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "max-content max-content", columnGap: 16, rowGap: 4 }}>
                {rows.map((r, i) => (
                  <React.Fragment key={i}>
                    <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: GRAY800 }}>{r.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: r.color || GRAY990, justifySelf: "end" }}>{r.value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// COMBO CHART (Bar + Line, Dual Y-Axis)
//   좌측 Y축: 바 (주 지표), 우측 Y축: 선 (비교 지표)
//   Usage:
//     <ComboChart
//       data={[{ label: "2016", bar: 955, line: 125 }, ...]}
//       barKey="bar" lineKey="line"
//       barLabel="매출액(억원)" lineLabel="직원수(명)"
//       barAxisLabel="매출액" lineAxisLabel="직원수"
//     />
// ═══════════════════════════════════════════════════════════════════════
export function ComboChart({
  title,
  data = [],
  barKey = "bar",
  lineKey = "line",
  barLabel = "bar",
  lineLabel = "line",
  barAxisLabel,
  lineAxisLabel,
  barColor,
  lineColor,
  height: chartHeight = 420,
  style,
}) {
  const FF = "Pretendard, sans-serif";
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(800);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(containerRef.current);
    setContainerW(containerRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const BAR = barColor || T.blue500 || "#2B7FFF";
  const LINE = lineColor || "#7CCF00"; // Lime 500 (CHART_COLORS[1])

  // 축 범위: 깔끔한 눈금으로 올림 처리 (실제 값 범위 기반, 0에 붙지 않음)
  const barValues = data.map(d => +d[barKey]).filter(v => Number.isFinite(v));
  const lineValues = data.map(d => +d[lineKey]).filter(v => Number.isFinite(v));
  const rawBarMin = barValues.length ? Math.min(...barValues) : 0;
  const rawBarMax = barValues.length ? Math.max(...barValues) : 1;
  const rawLineMin = lineValues.length ? Math.min(...lineValues) : 0;
  const rawLineMax = lineValues.length ? Math.max(...lineValues) : 1;
  // 여유 패딩 (데이터 범위의 10%)
  const barPadding = Math.max((rawBarMax - rawBarMin) * 0.1, 1);
  const linePadding = Math.max((rawLineMax - rawLineMin) * 0.1, 1);
  const barMin = rawBarMin - barPadding;
  const barMax = rawBarMax + barPadding;
  const lineMin = rawLineMin - linePadding;
  const lineMax = rawLineMax + linePadding;

  function niceScale(min, max, ticks = 5) {
    const range = max - min || 1;
    const roughStep = range / ticks;
    const pow = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const norm = roughStep / pow;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * pow;
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const tickList = [];
    for (let v = niceMin; v <= niceMax + step * 0.001; v += step) tickList.push(+v.toFixed(6));
    return { min: niceMin, max: niceMax, ticks: tickList };
  }

  const barScale = niceScale(barMin, barMax);
  const lineScale = niceScale(lineMin, lineMax);

  // 레이아웃
  const margin = { top: 32, right: 68, bottom: 70, left: 68 };
  const plotW = Math.max(200, containerW - margin.left - margin.right);
  const plotH = chartHeight - margin.top - margin.bottom;
  const n = data.length;
  const slotW = n > 0 ? plotW / n : 0;
  const barW = slotW * 0.5;

  const yBar = (v) => margin.top + plotH - ((v - barScale.min) / (barScale.max - barScale.min || 1)) * plotH;
  const yLine = (v) => margin.top + plotH - ((v - lineScale.min) / (lineScale.max - lineScale.min || 1)) * plotH;
  const xCat = (i) => margin.left + i * slotW + slotW / 2;

  // 베이스라인: 스케일 최소값 기준 (0이 아닌 실제 축 하단)
  const barBaseline = margin.top + plotH;

  return (
    <div ref={containerRef} style={{ fontFamily: FF, width: "100%", ...style }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", marginBottom: 16 }}>{title}</div>}

      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${containerW} ${chartHeight}`} width="100%" style={{ display: "block", overflow: "visible" }}>
          {/* 좌측 Y축 (바) 그리드 + 라벨 */}
          {barScale.ticks.map((t, i) => {
            const y = yBar(t);
            return (
              <g key={`by-${i}`}>
                <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y} stroke={GRAY200} strokeWidth={1} />
                <text x={margin.left - 10} y={y + 4} textAnchor="end" style={{ fontSize: 11, fill: GRAY800, fontFamily: FF }}>{t}</text>
              </g>
            );
          })}
          {/* 우측 Y축 (선) 라벨 */}
          {lineScale.ticks.map((t, i) => {
            const y = yLine(t);
            return (
              <text key={`ly-${i}`} x={margin.left + plotW + 10} y={y + 4} textAnchor="start"
                style={{ fontSize: 11, fill: GRAY800, fontFamily: FF }}>{t}</text>
            );
          })}

          {/* 축 라벨 */}
          {barAxisLabel && (
            <text x={margin.left - 48} y={margin.top - 14} textAnchor="start"
              style={{ fontSize: 11, fontWeight: 500, fill: GRAY800, fontFamily: FF }}>{barAxisLabel}</text>
          )}
          {lineAxisLabel && (
            <text x={margin.left + plotW + 10} y={margin.top - 14} textAnchor="start"
              style={{ fontSize: 11, fontWeight: 500, fill: GRAY800, fontFamily: FF }}>{lineAxisLabel}</text>
          )}

          {/* 바 */}
          {data.map((d, i) => {
            const v = +d[barKey];
            if (!Number.isFinite(v)) return null;
            const y = yBar(v);
            const h = Math.abs(barBaseline - y);
            const x = xCat(i) - barW / 2;
            const isH = hoveredIdx === i;
            const isNegBar = y > barBaseline;
            const barR = Math.max(0, Math.min(8, barW / 2, h / 2));
            const barCorners = isNegBar
              ? { tl: 0, tr: 0, br: barR, bl: barR }
              : { tl: barR, tr: barR, br: 0, bl: 0 };
            return (
              <g key={`bar-${i}`}>
                <path d={roundedRectPath(barW, h, barCorners)}
                  transform={`translate(${x},${Math.min(y, barBaseline)})`}
                  fill={BAR}
                  onMouseEnter={(e) => {
                    setHoveredIdx(i);
                    const r = containerRef.current?.getBoundingClientRect();
                    if (r) setTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                  }}
                  onMouseMove={(e) => {
                    const r = containerRef.current?.getBoundingClientRect();
                    if (r) setTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                  }}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "default" }}
                />
                {/* 호버: 바 위에 블랙 오버레이 (FunnelChart와 동일) */}
                {isH && (
                  <rect x={x} y={Math.min(y, barBaseline)} width={barW} height={h}
                    fill="rgba(0,0,0,0.12)" style={{ pointerEvents: "none" }}
                  />
                )}
              </g>
            );
          })}

          {/* 선 + 호버 가능한 점 */}
          {(() => {
            const pts = data
              .map((d, i) => ({ i, v: +d[lineKey] }))
              .filter(p => Number.isFinite(p.v));
            if (pts.length < 2) return null;
            const path = pts.map((p, idx) => `${idx === 0 ? "M" : "L"} ${xCat(p.i)} ${yLine(p.v)}`).join(" ");
            return (
              <>
                <path d={path} fill="none" stroke={LINE} strokeWidth={2.5} style={{ pointerEvents: "none" }} />
                {pts.map(p => {
                  const isH = hoveredIdx === p.i;
                  const updatePos = (e) => {
                    const r = containerRef.current?.getBoundingClientRect();
                    if (r) setTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                  };
                  return (
                    <g key={`lp-${p.i}`}>
                      {/* 히트 영역 (투명, 큰 반경) */}
                      <circle cx={xCat(p.i)} cy={yLine(p.v)} r={14}
                        fill="transparent"
                        onMouseEnter={(e) => { setHoveredIdx(p.i); updatePos(e); }}
                        onMouseMove={updatePos}
                        onMouseLeave={() => setHoveredIdx(null)}
                        style={{ cursor: "default" }}
                      />
                      {/* 실제 렌더 원 */}
                      <circle cx={xCat(p.i)} cy={yLine(p.v)}
                        r={isH ? 7 : 6}
                        fill={WHITE} stroke={LINE} strokeWidth={2.5}
                        style={{ transition: "r 0.15s", pointerEvents: "none" }}
                      />
                    </g>
                  );
                })}
              </>
            );
          })()}

          {/* X축 카테고리 라벨 */}
          {data.map((d, i) => (
            <text key={`x-${i}`} x={xCat(i)} y={margin.top + plotH + 18} textAnchor="middle"
              style={{ fontSize: 12, fill: GRAY800, fontFamily: FF }}>
              {d.label}
            </text>
          ))}
        </svg>

        {/* 범례 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 4, fontFamily: FF }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 10, background: BAR, display: "inline-block", borderRadius: 2 }} />
            <span style={{ fontSize: 12, color: GRAY800 }}>{barLabel}</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width={22} height={12} style={{ display: "inline-block", flexShrink: 0 }}>
              <line x1={0} y1={6} x2={22} y2={6} stroke={LINE} strokeWidth={2.5} />
              <circle cx={11} cy={6} r={5} fill={WHITE} stroke={LINE} strokeWidth={2.5} />
            </svg>
            <span style={{ fontSize: 12, color: GRAY800 }}>{lineLabel}</span>
          </span>
        </div>

        {/* 툴팁 */}
        {hoveredIdx !== null && (() => {
          const d = data[hoveredIdx];
          return (
            <div style={{
              position: "absolute",
              left: Math.min(tooltipPos.x + 16, containerW - 220),
              top: tooltipPos.y - 60,
              background: WHITE,
              border: `1px solid ${GRAY200}`,
              borderRadius: 6,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              padding: "10px 12px",
              zIndex: 10,
              pointerEvents: "none",
              fontFamily: "Pretendard, sans-serif",
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800, marginBottom: 6 }}>{d.label}</div>
              <div style={{ display: "grid", gridTemplateColumns: "max-content max-content", columnGap: 16, rowGap: 4, alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 20, display: "inline-flex", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ width: 16, height: 10, background: BAR, display: "inline-block", borderRadius: 2 }} />
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800 }}>{barLabel}</span>
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990, justifySelf: "end" }}>{d[barKey]}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <svg width={20} height={12} style={{ display: "inline-block", flexShrink: 0 }}>
                    <line x1={0} y1={6} x2={20} y2={6} stroke={LINE} strokeWidth={2.5} />
                    <circle cx={10} cy={6} r={5} fill={WHITE} stroke={LINE} strokeWidth={2.5} />
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800 }}>{lineLabel}</span>
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990, justifySelf: "end" }}>{d[lineKey]}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
