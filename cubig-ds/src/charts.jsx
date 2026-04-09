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
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
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
        {/* Bar wrapper */}
        <div style={{
          width: `${Math.max(pct, 0.5)}%`, height: 48, flexShrink: 0,
          position: "relative", overflow: "hidden",
          borderRadius: "0 8px 8px 0",
        }}>
          <div style={{
            width: "100%", height: "100%",
            background: displayColor,
            transition: "background 0.15s ease",
          }} />
          {/* Hover overlay - 바 안에서만 표시 */}
          {hovered && pct > 0 && (
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              background: "rgba(0,0,0,0.10)",
              pointerEvents: "none",
            }} />
          )}
        </div>
        {/* Counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 20, fontWeight: 500, lineHeight: "28px", color: GRAY990 }}>{value}%</span>
          {count != null && <span style={{ fontSize: 18, fontWeight: 400, lineHeight: "26px", color: GRAY800 }}>({count.toLocaleString()})</span>}
        </div>
        {/* Tooltip: 바 위 6px */}
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
  const max = maxValue || 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
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
      {/* 항목 수 필터 (하단) */}
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
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3. VERTICAL BAR (커스텀 - 피그마 1:1)
//    - 바 너비 130px, 간격 50px
//    - 배경: gray50, 상단 라운드 16px
//    - 실제 바: 상단 라운드 10~12px, 색상 순차
//    - 상단 라벨: 20px SemiBold
//    - 하단 라벨: 카테고리명
//    - 2~5개 항목 필터
// ═══════════════════════════════════════════════════════════════════════
const VBAR_COLORS = ["#2B7FFF", "#7CCF00", "#8EC5FF", "#9F8DEB", "#00BBA7"];

// 사선 패턴 배경 (hatching) - SVG data URI
const HATCH_BG = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-5 25L25-5' stroke='%23E6E7E9' stroke-width='1'/%3E%3C/svg%3E")`;

function VBarItem({ label, value, barColor, maxValue, barHeight = 240 }) {
  const [hovered, setHovered] = useState(false);
  const h = maxValue > 0 ? (value / maxValue) * barHeight : 0;
  const displayColor = hovered ? darken(barColor, 0.1) : barColor;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", flex: 1, minWidth: 80, maxWidth: 160 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 상단 퍼센트 */}
      <span style={{ fontSize: 20, fontWeight: 600, lineHeight: "28px", color: GRAY990, fontFamily: "Pretendard, sans-serif" }}>{value}%</span>
      {/* 바 영역 */}
      <div style={{ width: "100%", height: barHeight, position: "relative", borderRadius: "16px 16px 0 0", background: `#F7F7F8 ${HATCH_BG}`, backgroundImage: HATCH_BG, backgroundColor: "#F7F7F8", overflow: "hidden" }}>
        {/* 실제 바 */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, width: "100%", height: Math.max(h, 2),
          background: displayColor, borderRadius: "10px 12px 0 0",
          transition: "height 0.6s ease, background 0.15s ease",
        }}>
          {/* 호버 오퍼시티 */}
          {hovered && (
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.10)", borderRadius: "10px 12px 0 0", pointerEvents: "none" }} />
          )}
        </div>
        {/* 툴팁: 바 색상 영역 중앙 (overflow 밖에서 표시) */}
        {hovered && (
          <div style={{
            position: "absolute", bottom: Math.max(h, 2) / 2, left: "50%", transform: "translate(-50%, 50%)",
            zIndex: 10, pointerEvents: "none",
          }}>
            <Tooltip label={label} value={`${value}%`} />
          </div>
        )}
      </div>
      {/* 하단 라벨 - 2줄 고정, 넘치면 ... */}
      <span style={{
        fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800,
        textAlign: "center", width: "100%", height: 40,
        fontFamily: "Pretendard, sans-serif",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden", textOverflow: "ellipsis",
      }}>{label}</span>
    </div>
  );
}

export function VBarChart({ data, title }) {
  // data: [{ label: "Cluster A", value: 90 }, ...]
  const [itemCount, setItemCount] = useState(data.length);
  const visibleData = data.slice(0, itemCount);
  const maxValue = Math.max(...visibleData.map(d => d.value), 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ display: "flex", gap: 40, alignItems: "flex-end", justifyContent: "center", width: "100%" }}>
        {visibleData.map((d, i) => (
          <VBarItem
            key={d.label}
            label={d.label}
            value={d.value}
            barColor={VBAR_COLORS[i % VBAR_COLORS.length]}
            maxValue={maxValue}
          />
        ))}
      </div>
      {/* 항목 수 필터 (하단) */}
      {data.length > 2 && (
        <div style={{ display: "flex", gap: 6 }}>
          {[2,3,4,5].filter(n => n <= data.length).map(n => (
            <button key={n} onClick={() => setItemCount(n)} style={{
              padding: "4px 12px", borderRadius: 9999, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 500, fontFamily: "Pretendard, sans-serif",
              background: itemCount === n ? GRAY990 : GRAY100,
              color: itemCount === n ? WHITE : GRAY990,
            }}>{n}개</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 4-1. GROUPED BAR (Nivo - 세로 그룹/스택 막대)
//    - 여러 시리즈를 그룹 또는 스택으로 비교
//    - grouped: 나란히, stacked: 쌓기
// ═══════════════════════════════════════════════════════════════════════
export function GroupedBarChart({ data, keys, indexBy = "label", title, stacked = false, layout = "vertical" }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={CHART_COLORS}
          groupMode={stacked ? "stacked" : "grouped"}
          layout={layout}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.25}
          innerPadding={4}
          borderRadius={4}
          enableLabel={false}
          animate
          motionConfig="gentle"
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12 }}
          enableGridX={false}
          enableGridY
          tooltip={({ id, value, indexValue, color }) => (
            <div style={tooltipBox}>
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{indexValue}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{id}: {value}</span>
              </div>
            </div>
          )}
          legends={[{
            dataFrom: "keys", anchor: "bottom", direction: "row", translateY: 50,
            itemWidth: 100, itemHeight: 20, symbolSize: 10, symbolShape: "circle",
          }]}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 5. STACKED HORIZONTAL BAR (100%) - 라운드 없음
// ═══════════════════════════════════════════════════════════════════════
export function StackedHBar({ data, keys, indexBy = "label", title, keyLabels }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ width: "100%", height: Math.max(80 * data.length + 80, 180) }}>
        <ResponsiveBar
          data={data}
          keys={actualKeys}
          indexBy={indexBy}
          colors={CHART_COLORS}
          groupMode="stacked"
          layout="horizontal"
          margin={{ top: 10, right: 20, bottom: 40, left: 180 }}
          padding={0.35}
          borderRadius={0}
          barComponent={({ bar, style }) => {
            // 각 바의 indexValue로 clipPath ID 생성
            const clipId = `clip-stacked-${bar.data.indexValue.replace(/\s/g, "-")}`;
            return (
              <g transform={`translate(${bar.x},${bar.y})`}>
                <rect
                  width={bar.width} height={bar.height}
                  fill={bar.color}
                  clipPath={`url(#${clipId})`}
                  style={{ ...style }}
                />
              </g>
            );
          }}
          layers={[
            "grid", "axes",
            // clipPath 정의 레이어
            ({ bars }) => {
              const groups = {};
              bars.forEach(bar => {
                const key = bar.data.indexValue;
                if (!groups[key]) groups[key] = { x: bar.x, right: bar.x + bar.width, y: bar.y, h: bar.height };
                groups[key].x = Math.min(groups[key].x, bar.x);
                groups[key].right = Math.max(groups[key].right, bar.x + bar.width);
                groups[key].y = Math.min(groups[key].y, bar.y);
                groups[key].h = Math.max(groups[key].h, bar.height);
              });
              return (
                <defs>
                  {Object.entries(groups).map(([key, g]) => (
                    <clipPath key={key} id={`clip-stacked-${key.replace(/\s/g, "-")}`}>
                      <rect x={g.x} y={g.y} width={g.right - g.x} height={g.h} rx={4} ry={4} />
                    </clipPath>
                  ))}
                </defs>
              );
            },
            "bars", "markers", "annotations", "legends", "totals",
          ]}
          enableLabel
          label={d => d.value > 5 ? `${d.value}%` : ""}
          labelTextColor={WHITE}
          animate
          motionConfig="gentle"
          theme={{
            ...baseTheme,
            axis: {
              ...baseTheme.axis,
              ticks: {
                text: {
                  fontSize: 14, fontWeight: 500, fill: GRAY990, fontFamily: "Pretendard, sans-serif",
                },
              },
            },
          }}
          axisBottom={{ tickSize: 0, tickPadding: 8 }}
          axisLeft={{
            tickSize: 0, tickPadding: 16,
            renderTick: ({ value, x, y }) => (
              <g transform={`translate(${x},${y})`}>
                <foreignObject x={-165} y={-12} width={150} height={24}>
                  <div style={{
                    fontSize: 14, fontWeight: 500, color: GRAY990, fontFamily: "Pretendard, sans-serif",
                    textAlign: "right", overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", lineHeight: "24px", width: 150,
                  }}>{value}</div>
                </foreignObject>
              </g>
            ),
          }}
          enableGridX={false}
          enableGridY={false}
          tooltip={({ id, value, indexValue, color }) => (
            <Tooltip label={`${indexValue} - ${keyLabels?.[id] || id}`} value={`${value}%`} />
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

  // Y축: 최소~최대를 4등분해서 5개 tick
  const allY = data.flatMap(s => s.data.map(d => d.y));
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const yStep = (yMax - yMin) / 4;
  const yTicks = [0,1,2,3,4].map(i => Math.round(yMin + yStep * i));
  const yFormat = isRed ? (v => `${v}%`) : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center", fontFamily: "Pretendard, sans-serif" }}>{title}</div>}
      <div style={{ width: "100%", height: 300, overflow: "hidden" }}>
        <ResponsiveLine
          data={data}
          colors={[lineColor]}
          curve={curve}
          lineWidth={2}
          enableArea={enableArea}
          areaOpacity={isRed ? 0.08 : 0.12}
          areaBaselineValue={yMin}
          margin={{ top: 30, right: 40, bottom: 50, left: 60 }}
          yScale={{ type: "linear", min: yMin, max: yMax }}
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
          theme={baseTheme}
          axisBottom={{ tickSize: 0, tickPadding: 12 }}
          axisLeft={{ tickSize: 0, tickPadding: 12, tickValues: 5, format: yFormat }}
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

// ═══════════════════════════════════════════════════════════════════════
// 7. RADAR CHART (피그마 1:1)
//    - 녹색(#00C950) 영역 + 테두리
//    - 원형 그리드, 4레벨
//    - 라벨: 외곽에 카테고리명
// ═══════════════════════════════════════════════════════════════════════
export function RadarChart({ data, keys, indexBy = "category", title, color = "#2B7FFF" }) {
  const actualKeys = keys || Object.keys(data[0] || {}).filter(k => k !== indexBy);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
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
// 8. PSM 가격 수요 곡선 그래프
// ═══════════════════════════════════════════════════════════════════════
const PSM_COLORS = ["#00A63E", "#FDC700", "#8A77E0", "#FF6467"];
const PSM_DASH = [null, "8 4", "8 4", null];

export function PSMChart({ data, title, intersections = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "Pretendard, sans-serif" }}>
      {title && <div style={{ fontSize: 18, fontWeight: 500, lineHeight: "26px", color: GRAY990, textAlign: "center" }}>{title}</div>}
      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveLine
          data={data}
          colors={PSM_COLORS}
          curve="monotoneX"
          lineWidth={2.5}
          enableArea={false}
          margin={{ top: 20, right: 40, bottom: 80, left: 60 }}
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
          useMesh
          enableCrosshair={false}
          tooltip={({ point }) => (
            <div style={tooltipBox}>
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: GRAY800 }}>{point.serieId}</span>
              <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{point.data.yFormatted}%</span>
            </div>
          )}
          legends={[{
            anchor: "bottom", direction: "row", translateY: 70,
            itemWidth: 140, itemHeight: 20, symbolSize: 10, symbolShape: "circle",
          }]}
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
            "slices", "mesh",
            ({ xScale, yScale }) => intersections.map((pt, i) => {
              const cx = xScale(pt.x), cy = yScale(pt.y);
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={6} fill={WHITE} stroke={GRAY800} strokeWidth={1.5} />
                  <foreignObject x={cx - 140} y={cy - 65} width={280} height={56} style={{ overflow: "visible" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ ...tooltipBox, padding: "6px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: pt.color || CHART_COLORS[i], flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: "18px", color: GRAY800 }}>{pt.fullLabel || pt.label}</span>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: GRAY990 }}>{pt.price}</span>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            }),
            "legends",
          ]}
        />
      </div>
    </div>
  );
}

