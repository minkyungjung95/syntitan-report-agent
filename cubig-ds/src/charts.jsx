import { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveRadar } from "@nivo/radar";

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
            cornerRadius={0}
            borderWidth={0}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            activeOuterRadiusOffset={0}
            activeInnerRadiusOffset={0}
            onMouseEnter={(_datum, event) => {
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
export function VBarChart({ data, keys, indexBy = "label", title, groupMode = "grouped", layout = "vertical", stacked = false }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 16, fontWeight: 600, color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={({ index }) => CHART_COLORS[index % CHART_COLORS.length]}
          groupMode={stacked ? "stacked" : groupMode}
          layout={layout}
          margin={{ top: 30, right: 20, bottom: 50, left: layout === "horizontal" ? 120 : 60 }}
          padding={0.3}
          borderRadius={4}
          maxValue={100}
          enableLabel
          label={d => `${d.value}%`}
          labelTextColor={WHITE}
          labelSkipWidth={30}
          labelSkipHeight={16}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: [0, 50, 100], format: v => `${v}%` }}
          enableGridX={false}
          gridYValues={[0, 50, 100]}
          tooltip={({ indexValue, value }) => (
            <Tooltip label={indexValue} value={`${value}%`} />
          )}
        />
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

