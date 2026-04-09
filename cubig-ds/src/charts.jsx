import { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveRadar } from "@nivo/radar";
import { T } from "./tokens.jsx";

// ─── Chart Color Palette ──────────────────────────────────────────────
export const CHART_COLORS = [
  "#2B7FFF", // 1. Blue 500
  "#7CCF00", // 2. Lime 500
  "#9F8DEB", // 3. DeepPurple 400
  "#8EC5FF", // 4. Blue 300
  "#00BBA7", // 5. Teal 500
  "#FDC700", // 6. Yellow 400
];

const GRAY200 = "#E6E7E9";
const GRAY100 = "#F0F0F2";
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
export function DonutChart({ data, title, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hoverActive, setHoverActive] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ width: size, height: size, flexShrink: 0 }}>
          <ResponsivePie
            data={data}
            colors={CHART_COLORS}
            innerRadius={0.6}
            padAngle={0}
            cornerRadius={hoverActive ? 6 : 0}
            borderWidth={0}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            activeOuterRadiusOffset={0}
            activeInnerRadiusOffset={0}
            onMouseEnter={(_datum, event) => {
              setHoverActive(true);
              const svg = event.currentTarget.closest("svg");
              if (!svg) return;
              svg.querySelectorAll("path").forEach(p => {
                p.style.transition = "opacity 0.15s ease";
                p.style.opacity = "0.2";
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
              <Tooltip label={datum.id} value={`${((datum.value / total) * 100).toFixed(0)}% (${datum.value.toLocaleString()})`} />
            )}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((d, i) => {
            const pct = ((d.value / total) * 100).toFixed(0);
            return (
              <div key={d.id} style={{ display: "flex", alignItems: "center", fontFamily: "Pretendard, sans-serif" }}>
                <LegendDot color={CHART_COLORS[i % CHART_COLORS.length]} />
                <span style={{ fontSize: 14, fontWeight: 500, color: GRAY800, minWidth: 80, marginLeft: 8 }}>{d.id}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: GRAY990, minWidth: 36, marginLeft: 8 }}>{pct}%</span>
                <span style={{ fontSize: 14, fontWeight: 400, color: GRAY800, marginLeft: 4 }}>({d.value.toLocaleString()})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 1-1. SEMI DONUT CHART (반원 도넛)
//    - 상단 반원, 슬라이스별 라벨(% + 건수)
//    - 하단 범례: 컬러 + 라벨명 + 설명
//    - hatched 패턴(Unclassified 등) 지원
// ═══════════════════════════════════════════════════════════════════════

// 빗금 패턴용 SVG 정의
function HatchPattern({ id, color = GRAY800 }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={GRAY100} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
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
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990, textAlign: "center", marginBottom: 16 }}>{title}</div>}

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
                <div style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0, background: d.hatched ? `repeating-linear-gradient(45deg, ${GRAY100}, ${GRAY100} 2px, ${GRAY200} 2px, ${GRAY200} 4px)` : color }} />
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
      style={{ display: "flex", alignItems: "center", gap: 60, height: 56, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label */}
      <div style={{ width: 220, minWidth: 220, flexShrink: 0, display: "flex", alignItems: "center", height: 48 }}>
        <span style={{
          fontSize: 16, fontWeight: 500, lineHeight: "24px", color: GRAY990,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
        }}>{label}</span>
      </div>
      {/* Container */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", gap: 16,
        borderLeft: `1px solid ${GRAY200}`, padding: "12px 12px 12px 0",
        position: "relative",
      }}>
        {/* Bar */}
        <div style={{
          width: `${Math.max(pct, 0.5)}%`, height: 48, flexShrink: 0,
          background: displayColor,
          borderRadius: "0 8px 8px 0",
          transition: "width 0.6s ease, background 0.15s ease",
        }} />
        {/* Hover overlay on bar only */}
        {hovered && pct > 0 && (
          <div style={{
            position: "absolute", top: 12, left: 0,
            width: `${Math.max(pct, 0.5)}%`, height: 48,
            background: "rgba(0,0,0,0.10)",
            borderRadius: "0 8px 8px 0", pointerEvents: "none",
          }} />
        )}
        {/* Counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 20, fontWeight: 500, lineHeight: "28px", color: GRAY990 }}>{value}%</span>
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

export function HBarChart({ data, title, maxValue }) {
  const [itemCount, setItemCount] = useState(data.length);
  const visibleData = data.slice(0, itemCount);
  const max = maxValue || Math.max(...visibleData.map(d => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990 }}>{title}</div>}
      {/* 항목 수 필터 */}
      <div style={{ display: "flex", gap: 6 }}>
        {[2,3,4,5,6].filter(n => n <= data.length).map(n => (
          <button key={n} onClick={() => setItemCount(n)} style={{
            padding: "4px 12px", borderRadius: 9999, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 500, fontFamily: "Pretendard, sans-serif",
            background: itemCount === n ? GRAY990 : GRAY100,
            color: itemCount === n ? WHITE : GRAY990,
          }}>{n}개</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {visibleData.map((d, i) => {
          let barColor;
          if (d.color) barColor = d.color;
          else if (i === 0) barColor = CHART_COLORS[1]; // Lime
          else if (i === 1) barColor = CHART_COLORS[0]; // Blue
          else barColor = GRAY200;
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={isSingleKey ? (({ index }) => CHART_COLORS[index % CHART_COLORS.length]) : (({ id }) => colorMap[id] || CHART_COLORS[0])}
          groupMode={isStacked ? "stacked" : groupMode}
          layout={layout}
          margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
          padding={0.25}
          borderRadius={hoverActive ? 6 : 0}
          enableLabel
          label={d => valueFormat ? valueFormat(d.value) : d.value}
          labelTextColor={WHITE}
          labelSkipWidth={24}
          labelSkipHeight={14}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12 }}
          enableGridX={false}
          enableGridY
          onMouseEnter={(_datum, event) => {
            setHoverActive(true);
            const svg = event.currentTarget.closest("svg");
            if (!svg) return;
            const bars = svg.querySelectorAll("g[transform] rect");
            bars.forEach(r => {
              const fill = r.getAttribute("fill");
              if (fill && fill !== "transparent" && !fill.startsWith("url")) {
                r.style.transition = "opacity 0.15s ease";
                r.style.opacity = "0.2";
              }
            });
            const el = event.currentTarget;
            el.style.opacity = "1";
            el.style.stroke = WHITE;
            el.style.strokeWidth = "3";
          }}
          onMouseLeave={(_datum, event) => {
            setHoverActive(false);
            const svg = event.currentTarget.closest("svg");
            if (!svg) return;
            svg.querySelectorAll("g[transform] rect").forEach(r => {
              r.style.opacity = "1";
              r.style.stroke = "none";
              r.style.strokeWidth = "0";
            });
          }}
          tooltip={({ id, indexValue, value }) => (
            <Tooltip label={isSingleKey ? indexValue : `${indexValue} — ${id}`} value={valueFormat ? valueFormat(value) : value} />
          )}
        />
      </div>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {isSingleKey ? data.map((d, i) => (
          <div key={d[indexBy]} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span style={{ fontSize: 12, color: GRAY990 }}>{d[indexBy]}</span>
          </div>
        )) : actualKeys.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length] }} />
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
export function StackedHBar({ data, keys, indexBy = "label", title }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: Math.max(80 * data.length + 80, 180) }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={CHART_COLORS}
          groupMode="stacked"
          layout="horizontal"
          margin={{ top: 10, right: 100, bottom: 40, left: 200 }}
          padding={0.35}
          borderRadius={0}
          enableLabel
          label={d => d.value > 5 ? `${d.value}%` : ""}
          labelTextColor={WHITE}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 8 }}
          axisLeft={{ tickSize: 0, tickPadding: 12 }}
          enableGridX={false}
          enableGridY={false}
          tooltip={({ id, value, indexValue }) => (
            <Tooltip label={indexValue} value={`${value}%`} />
          )}
        />
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
function LineTooltip({ point, valueLabel }) {
  return (
    <div style={tooltipBox}>
      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{point.data.x}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: GRAY990 }}>
          {valueLabel || point.data.yFormatted}
        </span>
      </div>
    </div>
  );
}

export function LineChart({ data, title, enableArea = true, curve = "monotoneX", variant = "blue" }) {
  const isRed = variant === "red";
  const lineColor = isRed ? RED500 : CHART_COLORS[0];

  // Y축: red는 최소/최대만, blue는 자동 5개
  const allY = data.flatMap(s => s.data.map(d => d.y));
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const yTickValues = isRed ? [yMin, yMax] : 5;
  const yFormat = isRed ? (v => `${v}%`) : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveLine
          data={data}
          colors={[lineColor]}
          curve={curve}
          lineWidth={2}
          enableArea={enableArea}
          areaOpacity={isRed ? 0.08 : 0.12}
          areaBaselineValue={0}
          margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
          yScale={{ type: "linear", min: isRed ? 0 : "auto", max: "auto" }}
          enablePoints
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={lineColor}
          pointColor={WHITE}
          enableGridX={false}
          enableGridY
          gridYValues={isRed ? [yMin, yMax] : undefined}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: yTickValues, format: yFormat }}
          useMesh
          enableCrosshair
          crosshairType="x"
          tooltip={({ point }) => <LineTooltip point={point} valueLabel={isRed ? `${point.data.yFormatted}%` : undefined} />}
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
  width: propW,
  height: chartH = 260,
  annotations,  // [{ fromIdx, toIdx, seriesIdx }]  점선 화살표
}) {
  const FF = "Pretendard, sans-serif";
  const [hovered, setHovered] = useState(null); // { si, di }
  const margin = { top: 30, right: 30, bottom: 10, left: 30 };
  const catCount = categories?.length || (series[0]?.data.length || 0);

  // 값 범위 계산
  const allY = series.flatMap(s => s.data.map(d => d.y));
  const minY = Math.floor(Math.min(...allY) - 3);
  const maxY = Math.ceil(Math.max(...allY) + 3);

  // SVG 영역 크기
  const totalW = propW || 600;
  const plotW = totalW - margin.left - margin.right;
  const plotH = chartH - margin.top - margin.bottom;

  const xStep = catCount > 1 ? plotW / (catCount - 1) : plotW;
  const toX = (i) => margin.left + i * xStep;
  const toY = (v) => margin.top + plotH - ((v - minY) / (maxY - minY)) * plotH;

  // 하이라이트 컬럼 너비
  const hlW = xStep * 0.8;

  return (
    <div style={{ fontFamily: FF }}>
      {title && <div style={{ fontSize: 20, fontWeight: 700, color: GRAY990, marginBottom: 2 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 14, fontWeight: 400, color: GRAY800, marginBottom: 20 }}>{subtitle}</div>}

      <div style={{ position: "relative" }}>
        {/* 범례 (우측 상단) */}
        <div style={{ position: "absolute", top: 0, right: 0, display: "flex", flexDirection: "column", gap: 8, zIndex: 2 }}>
          {series.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="30" height="12">
                <line x1="0" y1="6" x2="22" y2="6" stroke={s.color} strokeWidth="2.5" />
                <circle cx="11" cy="6" r="4" fill={WHITE} stroke={s.color} strokeWidth="2" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 500, color: GRAY990 }}>{s.id}</span>
            </div>
          ))}
        </div>

        <svg viewBox={`0 0 ${totalW} ${chartH}`} width="100%" style={{ display: "block", overflow: "visible" }}>
          {/* 하이라이트 컬럼 */}
          {highlightFirst && (
            <rect x={toX(0) - hlW / 2} y={margin.top - 10} width={hlW} height={plotH + 20} rx={4} fill={GRAY100} />
          )}

          {/* 라인 + 포인트 */}
          {series.map((s, si) => {
            const pts = s.data.map((d, di) => ({ x: toX(di), y: toY(d.y), val: d.y, di }));
            const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            const isOtherHovered = hovered !== null && hovered.si !== si;

            return (
              <g key={s.id} style={{ opacity: isOtherHovered ? 0.2 : 1, transition: "opacity 0.15s" }}>
                {/* 라인 */}
                <path d={linePath} fill="none" stroke={s.color} strokeWidth={2.5} />
                {/* 포인트 + 라벨 */}
                {pts.map((p) => {
                  const isH = hovered?.si === si && hovered?.di === p.di;
                  const lblColor = s.labelColor || s.color;
                  // 라벨 위치: 값이 큰 시리즈는 위, 작은 시리즈는 아래
                  const labelAbove = series.length === 1 || si === series.length - 1 ||
                    (series.length > 1 && s.data[p.di].y >= series[si === 0 ? 1 : 0].data[p.di]?.y);
                  const ly = labelAbove ? p.y - 14 : p.y + 20;

                  return (
                    <g key={p.di}
                      onMouseEnter={() => setHovered({ si, di: p.di })}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "default" }}
                    >
                      <circle cx={p.x} cy={p.y} r={isH ? 7 : 5} fill={WHITE} stroke={s.color} strokeWidth={isH ? 3 : 2} />
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
            return (
              <g key={`ann-${ai}`}>
                <line x1={x} y1={fromY + 8} x2={x} y2={toYPos - 8}
                  stroke={color} strokeWidth={1.5} strokeDasharray="4 3" />
                <polygon points={`${x - 4},${toYPos - 6} ${x + 4},${toYPos - 6} ${x},${toYPos - 1}`}
                  fill={color} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 하단 테이블 */}
      {categories && (
        <div style={{ borderTop: `1.5px solid ${GRAY990}`, marginTop: 8 }}>
          {/* 카테고리 라벨 */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${catCount}, 1fr)`, textAlign: "center", padding: "10px 0 4px" }}>
            {categories.map((c, i) => (
              <span key={i} style={{ fontSize: 14, fontWeight: i === 0 && highlightFirst ? 700 : 500, color: GRAY990 }}>{c.label}</span>
            ))}
          </div>
          {/* 건수 */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${catCount}, 1fr)`, textAlign: "center", padding: "2px 0 8px" }}>
            {categories.map((c, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 400, color: GRAY800 }}>({c.count?.toLocaleString()})</span>
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
      {title && <div style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990, marginBottom: 2 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800, marginBottom: 24 }}>{subtitle}</div>}

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
                  const isOtherHovered = hovered !== null && hovered !== i;
                  const isSmall = (i >= 2 && rB <= 0.35) || (i < 2 && rT <= 0.35);
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: q.color || T.gray100,
                        borderRadius: i === 1 ? "0 4px 0 0" : 0,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: 16, cursor: "default", overflow: "hidden",
                        transition: "opacity 0.2s, transform 0.2s",
                        opacity: isOtherHovered ? 0.4 : 1,
                        transform: isHovered ? "scale(1.01)" : "scale(1)",
                        position: "relative", zIndex: isHovered ? 2 : 1,
                      }}
                    >
                      {/* tag: 작은 영역이면 호버 시에만 표시 */}
                      {q.tag && (
                        <div style={{
                          background: T.white, borderRadius: 8, padding: "6px 12px", marginBottom: 10,
                          fontSize: 13, fontWeight: 400, color: T.gray800, lineHeight: "18px", textAlign: "center",
                          boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.06)",
                          transition: "box-shadow 0.2s, opacity 0.2s",
                          ...(isSmall && !isHovered ? { opacity: 0, position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none" } : {}),
                          ...(isSmall && isHovered ? { position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", zIndex: 10, opacity: 1 } : {}),
                        }}>
                          {q.tag}
                        </div>
                      )}
                      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: "24px", color: q.labelColor || T.gray990, textAlign: "center" }}>
                        {q.label}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: "36px", color: q.labelColor || T.gray990, textAlign: "center" }}>
                        {q.value}<span style={{ fontSize: 18, fontWeight: 400 }}>%</span>
                      </div>
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

