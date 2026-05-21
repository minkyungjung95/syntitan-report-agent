import { useEffect, useState } from "react";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  TextBlock,
  InfoCard, InfoCardRow,
  PersonaCard,
  DataTable,
  UserCard,
  StrategyCard,
  ExecutionRoadmap,
} from "./report-components";
import { DonutChart, VBarChart } from "./charts";
import { DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge, Modal, TabBar, ModalUserCard, ModalField, ModalStat, ModalGrid } from "./ui-components.jsx";
import { T } from "./tokens.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  AudienceStrategyReport — 오디언스 전략 리포트
 *
 *  데이터 소스: public/json/audience-strategy.json
 *  탭 2개:
 *    1) 분석 리포트 — 12 sections (신뢰도/요약/효과/액션/투자/페르소나/구조/성장/시나리오/로드맵)
 *    2) 오디언스 확장 — 2 sections (확장 기회 카드 + 비교 테이블)
 *  세그먼트별 상세 모달 4개 (페르소나 클릭 시 노출)
 * ═══════════════════════════════════════════════════════════════════════════ */

const COLOR_MAP = {
  blue: "#2B7FFF",
  green: "#7CCF00",
  yellow: "#FDC700",
  gray: "#C5C6CA",
  red: "#FB2C36",
  lightBlue: "#8EC5FF",
};

// metric color 토큰 → Badge variant
const colorToVariant = {
  blue: "Info",
  green: "Positive",
  yellow: "Cautionary",
  gray: "Secondary",
  red: "Negative",
};

export default function AudienceStrategyReport() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    fetch("/json/audience-strategy.json")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error("Failed to load audience-strategy.json", e));
  }, []);

  if (!data) {
    return (
      <PageWrapper>
        <div style={{ padding: 40, fontFamily: "Pretendard, sans-serif", color: "#7B7E85" }}>Loading...</div>
      </PageWrapper>
    );
  }

  const { meta, tabs, segmentDetailModals } = data;
  const tab = tabs[activeTab];

  const findModal = (segId) => (segmentDetailModals || []).find((m) => m.segmentId === segId);

  return (
    <PageWrapper>
      <ContentHeader
        title={meta.reportTitle}
        description={meta.reportSubtitle}
        badges={
          <>
            <Badge type="Outline" variant="Secondary" size="Large" text={meta.sourceFile}
              leadingIcon={<DatabaseIcon size={14} color="#7B7E85" />} />
            <Badge type="Outline" variant="Secondary" size="Large" text={`Version ${meta.version}`} />
          </>
        }
        actions={
          <>
            <Btn variant="solid-secondary" size="md"><DownloadIcon size={20} />Download PDF</Btn>
            <Btn variant="solid-primary" size="md">Create Discussion Room</Btn>
          </>
        }
        style={{ marginBottom: 32 }}
      />

      {/* Top tabs */}
      <div style={{ marginBottom: 32 }}>
        <TabBar tabs={tabs.map((t) => t.tabName)} activeIndex={activeTab} onChange={setActiveTab} />
      </div>

      <ReportPage>
        {tab.sections.map((s) => renderSection(s, {
          setSelectedSegment,
          findModal,
        }))}
      </ReportPage>

      {/* 세그먼트 상세 모달 */}
      <Modal
        open={!!selectedSegment}
        onClose={() => setSelectedSegment(null)}
        title={
          selectedSegment && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>{selectedSegment.modalTitle || "상세 분석"}</span>
              <Badge type="Solid" variant="Secondary" size="Small" text={selectedSegment.personaName} />
            </div>
          )
        }
        size="lg"
        actionType="single"
        confirmLabel="Close"
        onConfirm={() => setSelectedSegment(null)}
      >
        {selectedSegment && <SegmentDetailModalContent segment={selectedSegment} />}
      </Modal>
    </PageWrapper>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 섹션 라우터
// ────────────────────────────────────────────────────────────────────────────
function renderSection(s, ctx) {
  const key = s.id;
  switch (s.componentType) {
    case "MetricCard":            return <MetricCardSection key={key} s={s} />;
    case "ExecutiveSummary":      return <ExecSummarySection key={key} s={s} />;
    case "MetricHighlight":       return <MetricHighlightSection key={key} s={s} />;
    case "RecommendedActions":    return <RecommendedActionsSection key={key} s={s} />;
    case "PersonaClusters":       return <PersonaClustersSection key={key} s={s} ctx={ctx} />;
    case "StructureAnalysis":     return <StructureAnalysisSection key={key} s={s} />;
    case "GrowthPotential":       return <GrowthPotentialSection key={key} s={s} />;
    case "ScenarioComparison":    return <ScenarioComparisonSection key={key} s={s} />;
    case "ScenarioMetrics":       return <ScenarioMetricsSection key={key} s={s} />;
    case "Recommendation":        return <RecommendationSection key={key} s={s} />;
    case "ExecutionRoadmap":      return <ExecutionRoadmapSection key={key} s={s} />;
    case "MarketExpansionOpportunities": return <MarketExpansionSection key={key} s={s} ctx={ctx} />;
    case "SegmentComparisonTable": return <SegmentComparisonSection key={key} s={s} />;
    default: return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 1. MetricCard — 신뢰도 4개, 초기 투자 3개 등 단순 metric 묶음
// ────────────────────────────────────────────────────────────────────────────
function MetricCardSection({ s }) {
  return (
    <div>
      {s.sectionName && <SectionHeading overline={s.sectionName} />}
      <InfoCardRow style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))` }}>
        {s.data.items.map((it, i) => (
          <InfoCard
            key={i}
            label={it.label}
            value={it.value}
            suffix={it.unit}
            description={it.subtext}
            variant="solid"
          />
        ))}
      </InfoCardRow>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. ExecutiveSummary — mainTarget 뱃지 + description + keyFindings
// ────────────────────────────────────────────────────────────────────────────
function ExecSummarySection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline="Executive Summary" title={s.headline} />
      <ExecutiveSummaryCard
        title={null}
        summaryItems={[
          { label: d.mainTargetBadge, value: d.mainTargetName },
        ]}
        findings={{ title: "Key Findings", items: d.keyFindings }}
      />
      {d.description && (
        <div style={{ marginTop: 16 }}>
          <TextBlock title="개요" items={[d.description]} bordered={false} style={{ background: T.gray50, borderRadius: 16, padding: 24 }} />
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3. MetricHighlight — 색상 강조 metric 6개
// ────────────────────────────────────────────────────────────────────────────
function MetricHighlightSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <ContentCard padding={24}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {d.items.map((it, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, padding: 16, borderRadius: 12, background: T.gray50 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLOR_MAP[it.color] || COLOR_MAP.gray }} />
                  <span style={{ fontSize: 13, color: T.gray800, fontWeight: 400 }}>{it.label}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLOR_MAP[it.color] || T.gray990 }}>{it.value}</div>
                {it.subtext && <div style={{ fontSize: 12, color: T.gray800 }}>{it.subtext}</div>}
              </div>
            ))}
          </div>
        </ContentCard>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 4. RecommendedActions — 4 액션 카드
// ────────────────────────────────────────────────────────────────────────────
function RecommendedActionsSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 8 }}>
          {d.actions.map((a) => (
            <ContentCard key={a.number} padding={24}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Badge type="Solid" variant="Info" size="Small" text={`Action ${a.number}`} />
                  <span style={{ fontSize: 18, fontWeight: 700, color: T.gray990, lineHeight: "26px" }}>{a.title}</span>
                </div>
                <div style={{ fontSize: 14, color: T.gray800, lineHeight: "22px" }}>{a.objective}</div>
                <div style={{ height: 1, background: T.gray100 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: T.gray800, marginBottom: 4 }}>실행</div>
                  <div style={{ fontSize: 14, color: T.gray990, lineHeight: "22px" }}>{a.execution}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#2B7FFF", marginBottom: 4 }}>기대 효과</div>
                  <div style={{ fontSize: 14, color: T.gray990, lineHeight: "22px" }}>{a.expectedEffects}</div>
                </div>
              </div>
            </ContentCard>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 5. PersonaClusters — 4 페르소나 카드 (PersonaCard 컴포넌트 사용)
// ────────────────────────────────────────────────────────────────────────────
function PersonaClustersSection({ s, ctx }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
          {d.items.map((p, i) => (
            <ContentCard key={i} padding={0}>
              <PersonaCard
                name={p.name}
                subtitle={p.size}
                metrics={p.metrics.map((m) => ({ key: m.label, value: m.value }))}
              />
            </ContentCard>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 6. StructureAnalysis — 도넛 2개 + 비교 테이블 + key insights
// ────────────────────────────────────────────────────────────────────────────
function StructureAnalysisSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <ContentCard padding={24}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {d.donutCharts.map((dc, i) => (
              <div key={i} style={{ flex: "1 1 360px", minWidth: 320 }}>
                <DonutChart
                  title={dc.title}
                  size={200}
                  legendPosition="bottom"
                  data={dc.segments.map((seg) => ({
                    id: seg.label,
                    value: seg.percentage,
                    color: COLOR_MAP[seg.color],
                  }))}
                />
              </div>
            ))}
          </div>
        </ContentCard>
        <ContentCard padding={0}>
          <DataTable
            columns={[
              { key: "segment", label: "세그먼트", align: "left" },
              { key: "customerShare", label: "고객 수 비중", align: "center" },
              { key: "revenueShare", label: "매출 기여 비중", align: "center" },
            ]}
            data={d.segmentStats}
          />
        </ContentCard>
        {d.keyInsights && (
          <ContentCard padding={0}>
            <TextBlock title="Key Insight" items={[d.keyInsights]} bordered={false} />
          </ContentCard>
        )}
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 7. GrowthPotential — VBarChart + 4 strategy cards
// ────────────────────────────────────────────────────────────────────────────
function GrowthPotentialSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <ContentCard padding={24}>
          <VBarChart
            title="단기(3개월) 매출 성장 잠재력"
            data={d.growthBars.map((b) => ({
              label: b.segment,
              value: b.value,
              color: COLOR_MAP[b.color],
            }))}
            keys={["value"]}
            indexBy="label"
            height={240}
            hideLegend
            valueFormat={(v) => `${v}${d.growthBars[0]?.unit || ""}`}
          />
        </ContentCard>
        <ContentCard padding={0}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 8 }}>
            {d.strategyCards.map((c, i) => (
              <StrategyCard
                key={i}
                badge={{ text: c.segment, type: "Solid", variant: "Secondary", size: "Small" }}
                price={c.category}
                bordered
                style={{ background: T.white }}
              >
                <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  {c.bullets.map((b, bi) => (
                    <li key={bi} style={{ fontSize: 14, color: T.gray990, lineHeight: "22px" }}>{b}</li>
                  ))}
                </ul>
              </StrategyCard>
            ))}
          </div>
        </ContentCard>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 8. ScenarioComparison — 3 시나리오 비교 (보수/기준/공격)
// ────────────────────────────────────────────────────────────────────────────
function ScenarioComparisonSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 8 }}>
          {d.scenarios.map((sc, i) => {
            const recommended = !!sc.recommended;
            return (
              <ContentCard key={i} padding={24} style={recommended ? { outline: `2px solid #2B7FFF`, outlineOffset: -2 } : undefined}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge type="Solid" variant={recommended ? "Info" : "Secondary"} size="Small" text={sc.labelKo || sc.label} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: T.gray800, marginBottom: 2 }}>자원 배분</div>
                    <div style={{ fontSize: 14, color: T.gray990 }}>{sc.focus}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: T.gray800, marginBottom: 2 }}>전략 방향</div>
                    <div style={{ fontSize: 14, color: T.gray990 }}>{sc.strategicFocus}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: T.gray800, marginBottom: 2 }}>기대 결과</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.gray990 }}>{sc.expectedResult}</div>
                  </div>
                  <div style={{ height: 1, background: T.gray100 }} />
                  <div style={{ fontSize: 13, color: T.gray800 }}>{sc.risk}</div>
                </div>
              </ContentCard>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 9. ScenarioMetrics — VBarChart (시나리오별 통합 ROI 비교)
// ────────────────────────────────────────────────────────────────────────────
function ScenarioMetricsSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={d.title} />
      <SectionCard>
        <ContentCard padding={24}>
          <VBarChart
            data={d.bars.map((b) => ({
              label: b.scenario,
              value: b.value,
              color: COLOR_MAP[b.color],
            }))}
            keys={["value"]}
            indexBy="label"
            height={240}
            hideLegend
            valueFormat={(v) => `${v}${d.bars[0]?.unit || "%"}`}
          />
        </ContentCard>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 10. Recommendation — 단일 텍스트 권고
// ────────────────────────────────────────────────────────────────────────────
function RecommendationSection({ s }) {
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} />
      <SectionCard>
        <ContentCard padding={0}>
          <TextBlock title="권고 사유" items={[s.data.description]} bordered={false} />
        </ContentCard>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 11. ExecutionRoadmap — 30일 4주 실행 로드맵
// ────────────────────────────────────────────────────────────────────────────
function ExecutionRoadmapSection({ s }) {
  const d = s.data;
  // JSON weeks → ExecutionRoadmap weeks 매핑
  const mapped = (d.weeks || []).map((w) => ({
    tab: w.weekLabel,
    weekLabel: w.weekTitle,
    items: (w.tasks || []).map((t) => ({
      title: t.title,
      priority: t.priority,
      bullets: [
        t.owner && `담당: ${t.owner}`,
        t.description,
        t.deliverable && `산출물: ${t.deliverable}`,
      ].filter(Boolean),
    })),
  }));
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.subSectionName} description={d.description} />
      <SectionCard>
        <ContentCard padding={24}>
          <ExecutionRoadmap title="30일 실행 계획" subtitle="주차별 액션·책임" weeks={mapped} />
        </ContentCard>
        {d.expectedOutcomes && (
          <>
            <ContentCard padding={24}>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.gray990 }}>{d.expectedOutcomes.title}</div>
            </ContentCard>
            <ContentCard padding={0}>
              <InfoCardRow style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
                {d.expectedOutcomes.metrics.map((m, i) => (
                  <InfoCard key={i} label={m.label} value={m.value} description={m.subtext} variant="outline" />
                ))}
              </InfoCardRow>
            </ContentCard>
          </>
        )}
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 12. MarketExpansionOpportunities — 클릭 가능한 4 카드 → 모달
// ────────────────────────────────────────────────────────────────────────────
function MarketExpansionSection({ s, ctx }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} title={s.headline} description={d.description} />
      <SectionCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {d.opportunities.map((o) => {
            const open = () => {
              const modalData = ctx.findModal?.(o.segmentId);
              if (modalData) ctx.setSelectedSegment(modalData);
            };
            return (
              <ContentCard key={o.segmentId} padding={24}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR_MAP[o.color] || COLOR_MAP.gray }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.gray990 }}>{o.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: T.gray990 }}>{o.users}</div>
                    <div style={{ fontSize: 13, color: T.gray800 }}>({o.share})</div>
                  </div>
                  <Btn variant="solid-secondary" size="md" onClick={open}>View Detail</Btn>
                </div>
              </ContentCard>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 13. SegmentComparisonTable — DataTable로 5행×5열 비교
// ────────────────────────────────────────────────────────────────────────────
function SegmentComparisonSection({ s }) {
  const d = s.data;
  return (
    <div>
      <SectionHeading overline={s.sectionName} />
      <SectionCard>
        <ContentCard padding={0}>
          <DataTable
            columns={d.columns.map((c, i) => ({
              key: c.key,
              label: c.label,
              align: i === 0 ? "left" : "center",
            }))}
            data={d.rows}
          />
        </ContentCard>
      </SectionCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 모달 내부 컨텐츠 — 페르소나 별 상세 (탭 + sub-tab 구조)
// ────────────────────────────────────────────────────────────────────────────
function SegmentDetailModalContent({ segment }) {
  const [tabIdx, setTabIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const tabs = segment.tabs || [];
  const currentTab = tabs[tabIdx] || {};
  const subTabs = currentTab.subTabs || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Persona Card */}
      <ModalUserCard name={segment.personaName} subtitle={segment.personaDescription} />

      {/* Top Tabs */}
      <TabBar
        tabs={tabs.map((t) => t.tabLabel)}
        activeIndex={tabIdx}
        onChange={(i) => { setTabIdx(i); setSubIdx(0); }}
      />

      {/* Tab Body */}
      {currentTab.id === "customer-overview" && currentTab.data && (
        <CustomerOverviewBlock data={currentTab.data} />
      )}

      {subTabs.length > 0 && (
        <>
          <TabBar tabs={subTabs.map((s) => s.label)} activeIndex={subIdx} onChange={setSubIdx} />
          <SubTabBlock sub={subTabs[subIdx]} />
        </>
      )}
    </div>
  );
}

function CustomerOverviewBlock({ data }) {
  const o = data.overview;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <ModalGrid columns={3}>
        <ModalStat label="규모" value={o.size.value} unit={o.size.unit} style={{ border: "none" }} />
        <ModalStat label="평균 연령" value={o.averageAge.value} unit={o.averageAge.unit} style={{ border: "none" }} />
        <ModalStat label="여성/남성" value={`${o.genderDistribution.female} / ${o.genderDistribution.male}`} unit={o.genderDistribution.unit} style={{ border: "none" }} />
      </ModalGrid>
    </div>
  );
}

function SubTabBlock({ sub }) {
  if (!sub) return null;
  const d = sub.data || {};

  // 구매 행동 지표 — items 배열
  if (Array.isArray(d.items) && d.items[0]?.value !== undefined) {
    return (
      <div style={{ background: T.gray50, borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {d.items.map((it, i) => (
          <ModalField key={i} label={it.label} style={{ border: "none" }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.gray990 }}>{it.value}</span>
              {it.subtext && <span style={{ fontSize: 13, color: T.gray800, marginLeft: 8 }}>({it.subtext})</span>}
            </div>
          </ModalField>
        ))}
      </div>
    );
  }

  // 선호도와 패턴 — 다수 카테고리 블록
  const blocks = Object.entries(d).filter(([_, v]) => v && typeof v === "object" && Array.isArray(v.items));
  if (blocks.length > 0) {
    return (
      <div style={{ background: T.gray50, borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {blocks.map(([key, block]) => (
          <ModalField key={key} label={block.title} style={{ border: "none" }}>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              {block.items.map((it, i) => (
                <li key={i} style={{ fontSize: 14, color: T.gray990 }}>
                  {it.label || it.value} {it.percentage != null && <span style={{ color: T.gray800 }}>({it.percentage}%)</span>}
                  {it.note && <span style={{ color: T.gray800 }}> {it.note}</span>}
                  {it.description && <span style={{ color: T.gray800 }}> — {it.description}</span>}
                </li>
              ))}
            </ul>
          </ModalField>
        ))}
      </div>
    );
  }

  // 이탈 위험 + 성장 기회 등
  if (d.churnRisk) {
    return (
      <div style={{ background: T.gray50, borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        <ModalField label={`${d.churnRisk.title} (${d.churnRisk.score} / ${d.churnRisk.maxScore})`} style={{ border: "none" }}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {d.churnRisk.earlyWarningSignals?.items.map((s, i) => (
              <li key={i} style={{ fontSize: 14, color: T.gray990 }}>{s.label} {s.note && <span style={{ color: T.gray800 }}>{s.note}</span>}</li>
            ))}
          </ul>
        </ModalField>
        {d.growthOpportunities && (
          <ModalField label={`${d.growthOpportunities.title} — ${d.growthOpportunities.subtitle}`} style={{ border: "none" }}>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {d.growthOpportunities.items.map((it, i) => (
                <li key={i} style={{ fontSize: 14, color: T.gray990 }}>{it}</li>
              ))}
            </ul>
          </ModalField>
        )}
      </div>
    );
  }

  // DO / DON'T
  if (d.dos) {
    return (
      <div style={{ background: T.gray50, borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        <ModalField label={d.dos.title} style={{ border: "none" }}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {d.dos.items.map((it, i) => <li key={i} style={{ fontSize: 14, color: T.gray990 }}>{it}</li>)}
          </ul>
        </ModalField>
        <ModalField label={d.donts.title} style={{ border: "none" }}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {d.donts.items.map((it, i) => <li key={i} style={{ fontSize: 14, color: T.gray990 }}>{it}</li>)}
          </ul>
        </ModalField>
      </div>
    );
  }

  // sample-customers
  if (Array.isArray(d.items) && d.items[0]?.bullets) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {d.items.map((c, i) => (
          <UserCard
            key={i}
            type="stats"
            name={`Customer ${c.id}`}
            details={c.bullets.map((b) => ({ key: b.label, value: b.value }))}
          />
        ))}
      </div>
    );
  }

  // 핵심 가치관 (coreValues)
  if (d.coreValues) {
    return (
      <div style={{ background: T.gray50, borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        <ModalField label={d.coreValues.title} style={{ border: "none" }}>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {d.coreValues.items.map((it, i) => (
              <li key={i} style={{ fontSize: 14, color: T.gray990 }}>
                {it.value}
                {it.description && <span style={{ color: T.gray800 }}> — {it.description}</span>}
              </li>
            ))}
          </ul>
        </ModalField>
        {d.purchaseConsistency && (
          <ModalField label={`${d.purchaseConsistency.title} (score: ${d.purchaseConsistency.score}, ${d.purchaseConsistency.level})`} style={{ border: "none" }}>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {d.purchaseConsistency.bullets.map((b, i) => (
                <li key={i} style={{ fontSize: 14, color: T.gray990 }}>
                  {b.value}
                  {b.description && <span style={{ color: T.gray800 }}> — {b.description}</span>}
                </li>
              ))}
            </ul>
          </ModalField>
        )}
      </div>
    );
  }

  return null;
}
