import { useEffect, useState } from "react";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  DataTable,
  ClusterHeader,
  InsightContent,
  ContentArea,
  SignalCard,
  StrategyRoadmapTable,
  TextBlock,
} from "./report-components";
import { DonutChart, VBarChart, LineChart } from "./charts";
import { DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  ChurnPredictionReport — 고객 이탈 예측 (Global SVOD New Subscribers)
 *
 *  FE 핸드오프 가이드 (개발자 폴더 구조 권장):
 *    src/components/report/ChurnPredictionReport/
 *      ├── index.tsx                       ← 메인
 *      ├── ExecutiveSummary.tsx            ← (Section 1) Executive Summary
 *      ├── ClusterOverview.tsx             ← (Section 2) Donut + VBar + DataTable (Pattern ④)
 *      ├── HighRiskDeepDive.tsx            ← (Section 3) ClusterHeader + StatRow
 *      ├── SignalCards.tsx                 ← (Section 4) SignalCard + LineChart + TextBlock (Pattern ①)
 *      ├── StrategyTable.tsx               ← (Section 5) StrategyRoadmapTable
 *      └── RevenueScenario.tsx             ← (Section 6) StrategyCard 3단 (ad 리포트 패턴)
 *
 *  데이터 소스: public/json/churn-prediction.json (fetch)
 *  Composite Pattern 적용:
 *    Pattern ④ (그래프 + Tables) → Cluster Overview
 *    Pattern ① (SignalCard + 그래프 + TextBlock) → Signal Cards
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── Revenue Exposure 막대: 값은 막대 내부, 호버 시 상세 툴팁 ── */
function ScenarioBar({ s, ratio, barH, color }) {
  const [hover, setHover] = useState(false);
  const value = `$${s.monthlyRevenue.toLocaleString()}`;
  // 막대 색이 밝으면 내부 글자는 어둡게
  const isLight = (() => {
    const c = (color || "").replace("#", "");
    if (c.length < 6) return false;
    const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b > 160;
  })();
  const txtColor = isLight ? "#171719" : "#FFFFFF";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Badge type="Solid" variant="Secondary" size="Small" text={s.caseName} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: "#171719", fontWeight: 500 }}>{s.label}</span>
      </div>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          width: "calc(100% - 64px)",
          height: ratio * barH,
          background: color,
          borderRadius: "12px 12px 0 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          cursor: "default",
          transition: "filter 0.15s",
          filter: hover ? "brightness(0.93)" : "none",
        }}
      >
        <span style={{
          marginTop: 10,
          fontSize: 14,
          fontWeight: 700,
          color: txtColor,
          textShadow: isLight ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
        }}>{value}</span>
        {hover && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#171719",
            color: "#FFFFFF",
            padding: "7px 11px",
            borderRadius: 8,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            zIndex: 20,
            pointerEvents: "none",
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.85, marginTop: 2 }}>
              {s.retainedUsers.toLocaleString()} users · {s.caseName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChurnPredictionReport() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/json/churn-prediction.json")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error("Failed to load churn-prediction.json", e));
  }, []);

  if (!data) {
    return (
      <PageWrapper>
        <div style={{ padding: 40, fontFamily: "Pretendard, sans-serif", color: "#7B7E85" }}>Loading...</div>
      </PageWrapper>
    );
  }

  const { meta, sections } = data;
  const findSection = (id) => sections.find((s) => s.id === id);

  const exec = findSection("executive-summary");
  const clusterOverview = findSection("cluster-overview");
  const deepDive = findSection("high-risk-deep-dive");
  const signals = findSection("signal-cards");
  const strategy = findSection("strategy-table");
  const revenue = findSection("revenue-scenario");

  return (
    <PageWrapper>
      <ContentHeader
        title={meta.reportTitle}
        description={meta.reportSubtitle}
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text={meta.sourceFile}
              leadingIcon={<DatabaseIcon size={14} color="#7B7E85" />}
            />
            <Badge type="Outline" variant="Secondary" size="Large" text={`Version ${meta.version}`} />
          </>
        }
        actions={
          <>
            <Btn variant="solid-secondary" size="md">
              <DownloadIcon size={20} />
              Download PDF
            </Btn>
            <Btn variant="solid-primary" size="md">Create Discussion Room</Btn>
          </>
        }
        style={{ marginBottom: 60 }}
      />

      <ReportPage>

        {/* Section 1: Executive Summary */}
        <div>
          <SectionHeading overline="Executive Summary" title={exec?.headline} />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "At-risk subscribers", value: `${exec.data.atRiskCount.toLocaleString()}명` },
              { label: "Total customers",     value: `${exec.data.totalCustomers.toLocaleString()}명` },
              { label: "Overall churn rate",  value: `${exec.data.overallChurnRate}%` },
            ]}
            findings={{
              title: "Key Findings",
              items: exec.data.keyFindings,
            }}
          />
        </div>

        {/* Section 2: Cluster Overview — 차트 2개 + 공유 범례 + DataTable 모두 SectionCard로 묶음 */}
        <div>
          <SectionHeading overline="Cluster Overview" title={clusterOverview?.headline} description={clusterOverview?.data?.description} />
          <SectionCard>
            <ContentCard padding={24}>
              {(() => {
                const COLOR_MAP = { blue: "#2B7FFF", green: "#7CCF00", lightBlue: "#8EC5FF", gray: "#C5C6CA", red: "#FB2C36" };
                const segments = clusterOverview.data.donutChart.segments;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* 차트 2개 가로 배치 */}
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                      <div style={{ flex: "1 1 320px", minWidth: 280 }}>
                        <DonutChart
                          title={clusterOverview.data.donutChart.title}
                          size={200}
                          hideLegend
                          data={segments.map((s) => ({
                            id: s.label,
                            value: s.percentage,
                            color: COLOR_MAP[s.color],
                          }))}
                        />
                      </div>
                      <div style={{ flex: "1 1 360px", minWidth: 320 }}>
                        <VBarChart
                          title={clusterOverview.data.barChart.title}
                          data={clusterOverview.data.barChart.bars.map((b) => ({
                            label: b.label,
                            value: b.value,
                            color: COLOR_MAP[b.color],
                          }))}
                          keys={["value"]}
                          indexBy="label"
                          height={280}
                          hideLegend
                          valueFormat={(v) => `${v}%`}
                        />
                      </div>
                    </div>
                    {/* 통합 범례 — 두 차트 공통 색상 매핑 */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
                      {segments.map((s) => (
                        <div key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR_MAP[s.color], flexShrink: 0 }} />
                          <span style={{ fontSize: 14, fontWeight: 400, color: "#7B7E85" }}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </ContentCard>
            <ContentCard padding={0}>
              <DataTable
                columns={clusterOverview.data.comparisonTable.columns.map((c, i) => ({
                  key: c.key,
                  label: c.label,
                  align: i === 0 ? "left" : "center",
                }))}
                data={clusterOverview.data.comparisonTable.rows}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 3: High-Risk Cluster Deep Dive — ClusterHeader + InsightContent 3개 = 4단 */}
        <div>
          <SectionHeading overline="High-Risk Cluster Deep Dive" title={deepDive?.headline} description={deepDive?.data?.description} />
          <SectionCard>
            <ContentCard padding={0}>
              <ClusterHeader
                badge={{ text: deepDive.data.clusterBadge.label }}
                name={deepDive.data.clusterName}
                description={deepDive.data.clusterSummary}
              />
            </ContentCard>
            {deepDive.data.metrics.map((m, i) => (
              <InsightContent
                key={i}
                layout="horizontal"
                label={m.label}
                value={`${m.value}${m.unit ? ` ${m.unit}` : ""}`}
                items={m.bullets}
              />
            ))}
          </SectionCard>
        </div>

        {/* Section 4: Signal Cards — Pattern ① (SignalCard + 그래프 + TextBlock) */}
        <div>
          <SectionHeading overline="Churn Risk: Signals & Impact" title={signals?.headline} description={signals?.data?.description} />
          <SectionCard>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {signals.data.items.map((s, i) => (
                <SignalCard
                  key={i}
                  number={i + 1}
                  badgePrefix="Signal"
                  title={s.signalName}
                  items={s.bullets}
                  alert={s.warning}
                  alertVariant="Cautionary"
                  bordered={false}
                />
              ))}
            </div>

            {signals.data.trendChart && (
              <ContentCard padding={0} style={{ paddingTop: 24 }}>
                <LineChart
                  title={signals.data.trendChart.title}
                  variant="red"
                  enableArea
                  valueSuffix="%"
                  data={[{
                    id: "이탈률",
                    data: signals.data.trendChart.points.map((p) => ({ x: p.x, y: p.y })),
                  }]}
                />
              </ContentCard>
            )}

            {signals.data.projection && (
              <ContentCard padding={0}>
                <TextBlock
                  title={signals.data.projection.label}
                  items={[signals.data.projection.text]}
                  bordered={false}
                />
              </ContentCard>
            )}
          </SectionCard>
        </div>

        {/* Section 5: Strategy & Execution Plan */}
        <div>
          <SectionHeading
            overline="Strategy & Execution Plan"
            title={strategy?.headline}
            description={strategy?.data?.description}
          />
          <SectionCard>
            <ContentCard padding={0}>
              <StrategyRoadmapTable
                periods={strategy.data.phases.map((p) => ({
                  badge: p.phase,           // "Immediate" / "Short-term" / "Mid-term"
                  period: p.phaseLabel,     // "within 1 week" 등
                  rows: p.rows,
                }))}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 6: Revenue Exposure — StrategyCard 3단 (ad 리포트 패턴) */}
        <div>
          <SectionHeading overline="Revenue Exposure" title={revenue?.headline} description={revenue?.data?.description} />
          <SectionCard>
            {(() => {
              const colorMap = { blue: "#2B7FFF", green: "#7CCF00", gray: "#C5C6CA", lightBlue: "#8EC5FF", red: "#FB2C36" };
              return (
                <>
                  <ContentCard padding={24}>
                    {(() => {
                      const maxRev = Math.max(...revenue.data.scenarios.map((s) => s.monthlyRevenue));
                      const BAR_H = 200;
                      return (
                        // 각 컬럼이 (헤더 + 값 + 막대)를 자체 flex column으로 묶고,
                        // 부모 grid 의 alignItems:flex-end 로 컬럼들의 baseline 을 맞춤.
                        // 막대 길이가 짧으면 그 컬럼 전체 높이가 줄어들고, 상단 메트릭이 함께 내려옴.
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: 24, alignItems: "flex-end", padding: "0 36px" }}>
                          {revenue.data.scenarios.map((s, i) => (
                            <ScenarioBar
                              key={i}
                              s={s}
                              ratio={s.monthlyRevenue / maxRev}
                              barH={BAR_H}
                              color={colorMap[s.color] || colorMap.blue}
                            />
                          ))}
                        </div>
                      );
                    })()}
                  </ContentCard>
                  <ContentCard padding={0}>
                    <DataTable
                      columns={[
                        { key: "metric", label: "", align: "left" },
                        ...revenue.data.scenarios.map((s, i) => ({
                          key: `s${i}`,
                          label: s.label,
                          align: "center",
                        })),
                      ]}
                      data={[
                        {
                          metric: "ARPU",
                          ...Object.fromEntries(revenue.data.scenarios.map((s, i) => [`s${i}`, `$${s.arpu}`])),
                        },
                        {
                          metric: "Retained Users",
                          ...Object.fromEntries(revenue.data.scenarios.map((s, i) => [`s${i}`, `${s.retainedUsers.toLocaleString()}명`])),
                        },
                        {
                          metric: "Monthly Revenue",
                          ...Object.fromEntries(revenue.data.scenarios.map((s, i) => [`s${i}`, `$${s.monthlyRevenue.toLocaleString()}`])),
                        },
                        {
                          metric: "Annual Revenue",
                          ...Object.fromEntries(revenue.data.scenarios.map((s, i) => [`s${i}`, `$${s.annualRevenue.toLocaleString()}`])),
                        },
                        {
                          metric: "Description",
                          ...Object.fromEntries(revenue.data.scenarios.map((s, i) => [`s${i}`, s.description])),
                        },
                      ]}
                    />
                  </ContentCard>
                </>
              );
            })()}
          </SectionCard>
        </div>

      </ReportPage>
    </PageWrapper>
  );
}
