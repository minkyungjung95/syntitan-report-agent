import { useState, useRef, useEffect, useMemo } from "react";
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
  padding: "4px 8px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  fontFamily: "Pretendard, sans-serif",
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
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
    <div style={{ display: "flex", flexDirection: "column", gap: isBottom ? 24 : 60, alignItems: "center" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ display: "flex", flexDirection: isBottom ? "column" : "row", alignItems: "center", justifyContent: "center", gap: isBottom ? 24 : 40 }}>
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
              <Tooltip label={datum.id} value={`${((datum.value / total) * 100).toFixed(0)}% (${datum.value.toLocaleString()})`} />
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
            <div key={d.id} style={{ display: "flex", alignItems: "center", fontFamily: "Pretendard, sans-serif", whiteSpace: "nowrap" }}>
              {d.hatched ? (
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: `repeating-linear-gradient(45deg, ${GRAY100}, ${GRAY100} 2px, ${GRAY200} 2px, ${GRAY200} 4px)` }} />
              ) : (
                <LegendDot color={donutColors[i]} />
              )}
              <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800, marginLeft: 8 }}>{d.id}</span>
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
    <div style={{ display: "flex", flexDirection: "column", gap: isBottom ? 24 : 60, alignItems: "center" }}>
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
            theme={baseTheme}
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

      {/* 구분선 */}
      <div style={{ height: 1.5, background: GRAY200, margin: "24px 0 0" }} />

      {/* 범례 테이블 (2컬럼 grid: 라벨 | 설명) */}
      <div>
        {data.map((d, i) => {
          const color = d.hatched ? GRAY200 : getColor(d, i);
          const labelColor = color === GRAY200 ? GRAY800 : color;
          return (
            <div key={d.id}
              style={{
                display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center",
                padding: "12px 0", borderBottom: `1px solid ${GRAY200}`,
              }}
            >
              {/* 컬러 마커 + 라벨 */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0, background: d.hatched ? `repeating-linear-gradient(45deg, ${GRAY200}, ${GRAY200} 2px, ${GRAY300} 2px, ${GRAY300} 4px)` : color }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: GRAY990, lineHeight: "24px" }}>{d.id}</span>
              </div>
              {/* 설명 */}
              {d.description ? (
                <div style={{ fontSize: 14, fontWeight: 400, color: GRAY800, lineHeight: "22px" }}>{d.description}</div>
              ) : <div />}
            </div>
          );
        })}
      </div>
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
function HBarItem({ label, value, count, barColor, maxPct }) {
  const [hovered, setHovered] = useState(false);
  const pct = maxPct > 0 ? (value / maxPct) * 100 : 0;
  const displayColor = hovered ? darken(barColor, 0.1) : barColor;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 16, height: 56, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label */}
      <div style={{ width: 120, minWidth: 120, flexShrink: 0, display: "flex", alignItems: "center", height: 48 }}>
        <span style={{
          fontSize: 16, fontWeight: 500, lineHeight: "24px", color: GRAY990,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
        }}>{label}</span>
      </div>
      {/* Container */}
      <div style={{
        flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 16,
        borderLeft: `1px solid ${GRAY200}`, padding: "12px 12px 12px 0",
        position: "relative",
      }}>
        {/* Bar area */}
        <div style={{ flex: 1, minWidth: 0, position: "relative", height: 48 }}>
          {/* Bar */}
          <div style={{
            width: `${Math.max(pct, 0.5)}%`, height: 48,
            background: displayColor,
            borderRadius: "0 2px 2px 0",
            transition: "width 0.6s ease, background 0.15s ease",
          }} />
          {/* Hover overlay on bar only */}
          {hovered && pct > 0 && (
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: `${Math.max(pct, 0.5)}%`, height: 48,
              background: "rgba(0,0,0,0.10)",
              borderRadius: "0 2px 2px 0", pointerEvents: "none",
            }} />
          )}
        </div>
        {/* Counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990 }}>{value}%</span>
          {count != null && <span style={{ fontSize: 18, fontWeight: 400, lineHeight: "26px", color: GRAY800 }}>({count.toLocaleString()})</span>}
        </div>
        {/* Tooltip: 바 중앙 위 2px */}
        {hovered && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 2px)", left: 0,
            width: `${Math.max(pct, 0.5)}%`, minWidth: 60,
            display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 10,
          }}>
            <Tooltip label={label} value={`${value}%${count != null ? ` (${count.toLocaleString()})` : ""}`} />
          </div>
        )}
      </div>
    </div>
  );
}

export function HBarChart({ data, title, maxValue = 100 }) {
  const max = maxValue;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {data.map((d, i) => {
          let barColor;
          if (d.color) barColor = d.color;
          else if (i === 0) barColor = CHART_COLORS[0]; // Blue 500 — 1번 항목
          else if (i === 1) barColor = CHART_COLORS[1]; // Lime 500 — 2번 항목
          else barColor = GRAY200;                      // 3번 이후 회색
          return <HBarItem key={d.label} label={d.label} value={d.value} count={d.count} barColor={barColor} maxPct={max} />;
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3. VERTICAL BAR (Nivo) - 각 바에 다른 색상
// ═══════════════════════════════════════════════════════════════════════
export function VBarChart({ data, keys, indexBy = "label", title, groupMode = "grouped", layout = "vertical", stacked = false, valueFormat, height = 320 }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);
  const [hoverActive, setHoverActive] = useState(false);
  const isStacked = stacked || groupMode === "stacked";
  const isSingleKey = actualKeys.length === 1;
  const colorMap = {};
  actualKeys.forEach((k, i) => { colorMap[k] = CHART_COLORS[i % CHART_COLORS.length]; });

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 60, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div ref={containerRef} style={{ width: "100%", height }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={isSingleKey ? (({ index }) => CHART_COLORS[index % CHART_COLORS.length]) : (({ id }) => colorMap[id] || CHART_COLORS[0])}
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
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: 5 }}
          enableGridX={false}
          enableGridY
          gridYValues={5}
          onMouseEnter={(_datum, event) => {
            setHoverActive(true);
            const el = event.currentTarget;
            el.style.filter = "brightness(0.85)";
            el.style.transition = "filter 0.15s ease";
          }}
          onMouseLeave={(_datum, event) => {
            setHoverActive(false);
            const el = event.currentTarget;
            el.style.filter = "none";
          }}
          tooltip={({ id, indexValue, value }) => (
            <Tooltip label={isSingleKey ? indexValue : `${indexValue} — ${id}`} value={valueFormat ? valueFormat(value) : value} />
          )}
        />
      </div>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: -30 }}>
        {isSingleKey ? data.map((d, i) => (
          <div key={d[indexBy]} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{d[indexBy]}</span>
          </div>
        )) : actualKeys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 5. STACKED HORIZONTAL BAR (100%) - 라운드 없음
// ═══════════════════════════════════════════════════════════════════════
// 커스텀 바 컴포넌트 — useTooltip 훅은 Nivo 컨텍스트 내부에서만 동작하므로 별도 컴포넌트로 분리
function StackedHBarItem({ bar, hoveredId, setHoveredId }) {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const myId = `${bar.data.indexValue}__${bar.data.id}`;
  const isThisHovered = myId === hoveredId;
  const showTooltip = (e) => {
    showTooltipFromEvent(
      <Tooltip label={`${bar.data.indexValue} — ${bar.data.id}`} value={`${bar.data.value}%`} />,
      e
    );
  };
  return (
    <g
      transform={`translate(${bar.x},${bar.y})`}
      onMouseEnter={(e) => { setHoveredId(myId); showTooltip(e); }}
      onMouseMove={showTooltip}
      onMouseLeave={() => { setHoveredId(null); hideTooltip(); }}
      style={{ cursor: "pointer" }}
    >
      <rect
        width={bar.width} height={bar.height}
        fill={bar.color}
        style={{
          filter: isThisHovered ? "brightness(0.85)" : "none",
          transition: "filter 0.15s ease",
        }}
      />
      {bar.data.value > 5 && (
        <text x={bar.width / 2} y={bar.height / 2} textAnchor="middle" dominantBaseline="central"
          fill={WHITE} fontSize={12} fontFamily="Pretendard, sans-serif" fontWeight={500} style={{ pointerEvents: "none" }}>
          {bar.data.value}%
        </text>
      )}
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
        // 전체 폭(라벨 + 차트) 기준으로 제목 중앙 정렬
        <div style={{ width: "100%", fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>
          {title}
        </div>
      )}
      {/* 라벨(가변) + 차트(flex:1) 레이아웃 — 라벨 길이에 따라 자동 조정 */}
      <div style={{ display: "flex", width: "100%", gap: 0, alignItems: "stretch" }}>
        {/* 왼쪽 라벨 — 컨텐츠 크기만큼 (고정 아님) */}
        {(() => {
          const mTop = 4, mBot = 4;
          return (
            <div style={{ flex: "0 0 auto", maxWidth: 240, display: "flex", flexDirection: "column-reverse", paddingRight: 12, paddingTop: mTop, paddingBottom: mBot }}>
              {data.map((d, i) => (
                <div key={i} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end",
                  minWidth: 0,
                }}>
                  <span title={d[indexBy]} style={{
                    fontSize: 14, fontWeight: 500, color: GRAY990, fontFamily: "Pretendard, sans-serif",
                    textAlign: "right", whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}>{d[indexBy]}</span>
                </div>
              ))}
            </div>
          );
        })()}
        {/* 오른쪽 그래프 — 남은 공간 전부 사용 */}
        <div style={{ flex: 1, minWidth: 0, height: Math.max(60 * data.length + 20, 140) }}>
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
            <StackedHBarItem bar={props.bar} hoveredId={hoveredId} setHoveredId={setHoveredId} />
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
function LineTooltip({ point, valueLabel, valuePrefix, badge, badgeVariant = "red" }) {
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
      gap: 6,
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{point.data.x}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990 }}>
          {valuePrefix}{valueLabel || point.data.yFormatted}
        </span>
        {badge && (
          <span style={{
            display: "inline-flex", alignItems: "center",
            height: 28, padding: "4px 8px", borderRadius: 8,
            background: badgeColors.bg, color: badgeColors.color,
            fontSize: 14, fontWeight: 500, lineHeight: "20px",
          }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export function LineChart({ data, title, enableArea = true, curve = "monotoneX", variant = "blue", valuePrefix = "", badgeFormatter, badgeLabel }) {
  const isRed = variant === "red";
  const lineColor = isRed ? RED500 : CHART_COLORS[0];

  // Y축: 5단계 통일
  const allY = data.flatMap(s => s.data.map(d => d.y));
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const yFormat = isRed ? (v => `${v}%`) : undefined;

  // areaBaselineValue를 yScale min과 일치시켜 넘침 방지
  const scaleMin = isRed ? 0 : yMin;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 60, fontFamily: "Pretendard, sans-serif" }}>
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
          yScale={{ type: "linear", min: scaleMin, max: "auto" }}
          enablePoints
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={lineColor}
          pointColor={WHITE}
          enableGridX={false}
          enableGridY
          gridYValues={5}
          animate
          motionConfig="gentle"
          theme={{
            ...baseTheme,
            crosshair: { line: { stroke: isRed ? RED500 : GRAY800, strokeWidth: 1, strokeOpacity: 0.8 } },
          }}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: 5, format: yFormat }}
          useMesh
          enableCrosshair
          crosshairType="x"
          tooltip={({ point }) => {
            let badge = null;
            if (isRed) {
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
                valuePrefix={valuePrefix || (isRed ? "이탈률 " : "")}
                valueLabel={isRed ? `${point.data.yFormatted}%` : undefined}
                badge={badge}
                badgeVariant="red"
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

  const margin = { top: 40, right: 40, bottom: 10, left: 40 };
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
          {/* 호버 하이라이트 컬럼 */}
          {hoveredCol !== null && (
            <rect
              x={toX(hoveredCol) - hlW / 2}
              y={margin.top - 4}
              width={hlW}
              height={plotH + 8}
              rx={4} ry={4}
              fill={T.gray50 || "#F7F8F9"}
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
                  // 라벨 위치: 첫 번째 시리즈는 항상 아래, 나머지는 위
                  const labelAbove = series.length === 1 ? true : si > 0;
                  const ly = labelAbove ? p.y - 20 : p.y + 26;

                  return (
                    <g key={p.di}
                      onMouseEnter={() => setHovered({ si, di: p.di })}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "default" }}
                    >
                      <circle cx={p.x} cy={p.y} r={isH ? 6 : 5} fill={WHITE} stroke={s.color} strokeWidth={2}
                        style={{ transition: "r 0.15s" }} />
                      <text x={p.x} y={ly} textAnchor="middle" dominantBaseline="auto"
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
            color: GRAY990,
            border: `1px solid ${GRAY200}`,
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FF,
            zIndex: 10,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 13, color: GRAY990 }}>
              {categories[hoveredCol]?.label}
              {categories[hoveredCol]?.count != null && (
                <span style={{ fontWeight: 400, color: GRAY800, marginLeft: 4 }}>
                  ({categories[hoveredCol].count.toLocaleString()})
                </span>
              )}
            </div>
            {series.map((s, si) => (
              <div key={si} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ color: GRAY800 }}>{s.id}</span>
                <span style={{ marginLeft: "auto", fontWeight: 700, paddingLeft: 12, color: GRAY990 }}>{s.data[hoveredCol]?.y}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 테이블 */}
      {categories && (
        <div style={{ borderTop: `2px solid ${GRAY990}`, marginTop: 8, padding: `0 ${(margin.right / totalW) * 100}% 0 ${(margin.left / totalW) * 100}%` }}>
          {/* 카테고리 라벨 */}
          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", padding: "10px 0 4px" }}>
            {categories.map((c, i) => (
              <span key={i} style={{ flex: "0 0 auto", width: 0, display: "flex", justifyContent: "center", whiteSpace: "nowrap", fontSize: 14, fontWeight: 500, color: GRAY990 }}>{c.label}</span>
            ))}
          </div>
          {/* 건수 */}
          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", padding: "2px 0 8px" }}>
            {categories.map((c, i) => (
              <span key={i} style={{ flex: "0 0 auto", width: 0, display: "flex", justifyContent: "center", whiteSpace: "nowrap", fontSize: 13, fontWeight: 400, color: GRAY800 }}>({c.count?.toLocaleString()})</span>
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
            <div style={{ display: "grid", gridTemplateColumns: COL, gap: 0, alignItems: "end", padding: "10px 0", borderBottom: `2px solid ${GRAY990}` }}>
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
                      onMouseEnter={() => setHovered(i)}
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
                      {/* 호버 팝업 툴팁: 사분면 우측 상단 코너에 고정 */}
                      {isHovered && (
                        <div style={{
                          position: "absolute",
                          top: 12, right: 12,
                          zIndex: 9999, pointerEvents: "none",
                        }}>
                          <div style={{ ...tooltipBox, padding: "8px 14px", alignItems: "flex-start", gap: 4, whiteSpace: "nowrap" }}>
                            {q.tag && (
                              <span style={{ fontSize: 12, fontWeight: 500, color: GRAY800 }}>{q.tag}</span>
                            )}
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: GRAY990 }}>{q.label}</span>
                              <span style={{ fontSize: 16, fontWeight: 700, color: GRAY990 }}>
                                {q.value}<span style={{ fontSize: 12, fontWeight: 400 }}>%</span>
                              </span>
                            </div>
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
export function GroupedBarChart({ data, keys, indexBy = "label", title, stacked = false, layout = "vertical" }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);
  const isStacked = stacked;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 60, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={CHART_COLORS}
          groupMode={isStacked ? "stacked" : "grouped"}
          layout={layout}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.25}
          innerPadding={isStacked ? 0 : 4}
          borderRadius={0}
          enableLabel={false}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: 5 }}
          enableGridX={false}
          enableGridY
          gridYValues={5}
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
            <Tooltip label={`${indexValue} — ${id}`} value={value} />
          )}
        />
      </div>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: -30 }}>
        {actualKeys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800, fontFamily: "Pretendard, sans-serif" }}>{k}</span>
          </div>
        ))}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 60, fontFamily: "Pretendard, sans-serif" }}>
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
const PSM_COLORS = ["#00A63E", "#FDC700", "#8A77E0", "#FF6467"];
const PSM_DASH = [null, "8 4", "8 4", null];
const PSM_LABELS = ["Too Cheap", "Cheap", "Expensive", "Too Expensive"];

function PSMIntersectionDots({ intersections, xScale, yScale }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <g>
      {/* 1단계: 모든 dot 원 먼저 렌더 */}
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
      {/* 2단계: 호버된 tooltip만 모든 dot 위에 렌더 */}
      {hoveredIdx !== null && (() => {
        const pt = intersections[hoveredIdx];
        const cx = xScale(pt.x), cy = yScale(pt.y);
        return (
          <foreignObject x={cx - 140} y={cy - 75} width={280} height={66} style={{ overflow: "visible", pointerEvents: "none" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ ...tooltipBox, padding: "6px 12px" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 60, fontFamily: "Pretendard, sans-serif" }}>
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

            return (
              <g key={`bar-${i}`}>
                {/* 빗금 이탈 영역 (호버 시 바 툴팁과 통합) */}
                {hatchH > 2 && (
                  <rect x={x} y={hatchY} width={barW} height={hatchH}
                    fill={`url(#${hatchId})`}
                    onMouseEnter={(e) => { setHoveredStep(i); setHoveredHatch(null); updateTooltipPos(e); }}
                    onMouseMove={updateTooltipPos}
                    onMouseLeave={() => setHoveredStep(null)}
                    style={{ cursor: "default", transition: "opacity 0.2s", opacity: isH ? 0.85 : 1 }}
                  />
                )}
                {/* 솔리드 바 (실값) */}
                <rect x={x} y={y} width={barW} height={barH}
                  fill={blueColor}
                  onMouseEnter={(e) => { setHoveredStep(i); setHoveredHatch(null); updateTooltipPos(e); }}
                  onMouseMove={updateTooltipPos}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{ transition: "height 0.4s ease, y 0.4s ease", cursor: "default" }}
                />
                {isH && (
                  <rect x={x} y={y} width={barW} height={barH}
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
          const Row = ({ label, value, color }) => (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <span style={{ fontSize: 13, color: GRAY800 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: color || GRAY990 }}>{value}</span>
            </div>
          );
          return (
            <div style={{
              position: "absolute",
              left: Math.min(tooltipPos.x + 16, containerW - 220),
              top: tooltipPos.y - 80,
              ...tooltipBox,
              padding: "10px 14px",
              zIndex: 10,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: GRAY990, marginBottom: 6 }}>
                Step {s.index + 1}: {s.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Row label="유저 수" value={s.value.toLocaleString()} />
                <Row label="전환율" value={`${s.pct.toFixed(1)}%`} color={blueColor} />
                {s.index > 0 && (
                  <Row label="직전 대비 이탈" value={`-${s.dropoffCount.toLocaleString()} (${s.dropoff.toFixed(1)}%)`} color={RED500} />
                )}
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
            <text x={margin.left - 48} y={margin.top - 10} textAnchor="start"
              style={{ fontSize: 11, fontWeight: 500, fill: GRAY800, fontFamily: FF }}>{barAxisLabel}</text>
          )}
          {lineAxisLabel && (
            <text x={margin.left + plotW + 10} y={margin.top - 10} textAnchor="start"
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
            return (
              <g key={`bar-${i}`}>
                <rect x={x} y={Math.min(y, barBaseline)} width={barW} height={h}
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
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "10px 14px",
              zIndex: 10,
              pointerEvents: "none",
              minWidth: 160,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: GRAY990, marginBottom: 6 }}>{d.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 12, height: 10, background: BAR, display: "inline-block", borderRadius: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: GRAY800 }}>{barLabel}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: GRAY990 }}>{d[barKey]}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <svg width={20} height={12} style={{ display: "inline-block", flexShrink: 0 }}>
                      <line x1={0} y1={6} x2={20} y2={6} stroke={LINE} strokeWidth={2.5} />
                      <circle cx={10} cy={6} r={5} fill={WHITE} stroke={LINE} strokeWidth={2.5} />
                    </svg>
                    <span style={{ fontSize: 13, color: GRAY800 }}>{lineLabel}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: GRAY990 }}>{d[lineKey]}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
