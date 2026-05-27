import { useEffect, useState } from "react";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  TextBlock,
  InfoCard, InfoCardRow,
  DataTable,
  QATable,
  PriceRangeBar,
  StrategyCard,
} from "./report-components";
import { DonutChart, PSMChart } from "./charts";
import { DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";
import { T } from "./tokens.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  NewPricingProductReport — 신제품 가격 전략 리포트 (OLED 65" TV)
 *
 *  데이터: public/json/new-pricing-product.json
 *  Sections (6):
 *    1) product-brief         — DefinitionTable (입력) + QATable (Q&A)
 *    2) executive-summary     — ExecutiveSummaryCard
 *    3) persona-profile       — DonutChart × 3 + InfoCardRow (metric stats)
 *    4) psm-analysis          — PSMChart (4 곡선) + 교차점 InfoCards
 *    5) pricing-strategy      — PriceRangeBar (PMC/OPP/IPP/PME) + 3 insight cards
 *    6) price-range-options   — StrategyCard 3개 (진입/메인/프리미엄)
 * ═══════════════════════════════════════════════════════════════════════════ */

const COLOR_MAP = {
  blue: "#2B7FFF",
  green: "#7CCF00",
  yellow: "#FDC700",
  gray: "#C5C6CA",
  red: "#FB2C36",
  lightBlue: "#8EC5FF",
  lightGreen: "#B6E274",
  purple: "#9F8DEB",
};

// 가격 문자열 "$1,328.95" → 1328.95
const parseUSD = (s) => parseFloat(String(s).replace(/[$,]/g, "")) || 0;

export default function NewPricingProductReport() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/json/new-pricing-product.json")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error("Failed to load new-pricing-product.json", e));
  }, []);

  if (!data) {
    return (
      <PageWrapper>
        <div style={{ padding: 40, fontFamily: "Pretendard, sans-serif", color: "#7B7E85" }}>Loading...</div>
      </PageWrapper>
    );
  }

  const { meta, sections } = data;
  const find = (id) => sections.find((s) => s.id === id);

  const brief = find("product-brief");
  const exec = find("executive-summary");
  const persona = find("persona-profile");
  const psm = find("psm-analysis");
  const strategy = find("pricing-strategy");
  const options = find("price-range-options");

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
        style={{ marginBottom: 60 }}
      />

      <ReportPage>

        {/* Section 1: Product Brief — DefinitionTable + QATable */}
        <div>
          <SectionHeading overline={brief.sectionName} description={brief.data.description} />
          <SectionCard>
            <ContentCard padding={0}>
              <DataTable
                columns={[
                  { label: "항목", key: "label", width: "40%" },
                  { label: "입력값", key: "value" },
                ]}
                data={brief.data.inputs.map((it) => ({ label: it.label, value: it.value }))}
              />
            </ContentCard>
            <ContentCard padding={0}>
              <QATable
                columns={["질문", "답변"]}
                rows={brief.data.questionnaire.map((q) => ({ question: q.question, answer: q.answer }))}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 2: Executive Summary */}
        <div>
          <SectionHeading overline="Executive Summary" title={exec.headline} />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[]}
            findings={{ title: "Key Findings", items: exec.data.keyFindings }}
          />
          {exec.data.description && (
            <div style={{ marginTop: 16 }}>
              <TextBlock title="개요" items={[exec.data.description]} bordered={false} style={{ background: T.gray50, borderRadius: 16, padding: 24 }} />
            </div>
          )}
        </div>

        {/* Section 3: Persona Profile — 3 DonutChart + metric stats */}
        <div>
          <SectionHeading overline={persona.sectionName} title={persona.headline} description={persona.data.description} />
          <SectionCard>
            <ContentCard padding={24}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                {persona.data.donutCharts.map((dc, i) => (
                  <div key={i} style={{ flex: "1 1 280px", minWidth: 240 }}>
                    <DonutChart
                      title={dc.title}
                      size={180}
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
              <InfoCardRow style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
                {persona.data.metricStats.map((m, i) => (
                  <InfoCard
                    key={i}
                    label={m.label}
                    value={m.value}
                    suffix={m.unit}
                    description={m.subtext}
                    variant="solid"
                  />
                ))}
              </InfoCardRow>
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 4: PSM Analysis — PSMChart + 교차점 InfoCards */}
        <div>
          <SectionHeading overline={psm.sectionName} title={psm.headline} description={psm.data.description} />
          <SectionCard>
            <ContentCard padding={24}>
              <PSMChart
                title={psm.subSectionName}
                data={psm.data.psmCurve.lines.map((ln) => ({
                  id: ln.label,
                  data: ln.points.map((p) => ({ x: p.x, y: p.y })),
                }))}
              />
            </ContentCard>
            {psm.data.intersections && (
              <ContentCard padding={0}>
                <InfoCardRow style={{ gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}>
                  {psm.data.intersections.map((it, i) => (
                    <InfoCard
                      key={i}
                      label={`${it.label} (${it.fullName || ""})`}
                      value={it.value}
                      description={it.description}
                      variant="outline"
                    />
                  ))}
                </InfoCardRow>
              </ContentCard>
            )}
          </SectionCard>
        </div>

        {/* Section 5: Pricing Strategy — PriceRangeBar + 3 insight cards */}
        <div>
          <SectionHeading overline={strategy.sectionName} title={strategy.headline} description={strategy.data.description} />
          <SectionCard>
            <ContentCard padding={0}>
              <PriceRangeBar
                points={strategy.data.priceLadder.points.map((p) => ({
                  label: p.label,
                  value: parseUSD(p.value),
                  display: p.value,
                  desc: p.subtext,
                  color: COLOR_MAP[p.color],
                }))}
                leftZone={strategy.data.priceLadder.leftZoneLabel}
                rightZone={strategy.data.priceLadder.rightZoneLabel}
              />
            </ContentCard>
            <ContentCard padding={0}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 8 }}>
                {strategy.data.insightCards.map((c, i) => {
                  const variant = c.icon === "warning" ? "Cautionary" : c.icon === "strategy" ? "Positive" : "Info";
                  return (
                    <ContentCard key={i} padding={24}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Badge type="Solid" variant={variant} size="Small" text={c.label} />
                        <div style={{ fontSize: 16, fontWeight: 700, color: T.gray990, lineHeight: "24px" }}>{c.title}</div>
                        <div style={{ fontSize: 14, color: T.gray800, lineHeight: "22px" }}>{c.description}</div>
                      </div>
                    </ContentCard>
                  );
                })}
              </div>
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 6: Price Range Options — StrategyCard 3개 */}
        <div>
          <SectionHeading overline={options.sectionName} title={options.headline} description={options.data.description} />
          <SectionCard>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8, alignItems: "stretch" }}>
              {options.data.options.map((opt, i) => (
                <StrategyCard
                  key={i}
                  badge={{ text: opt.label, type: "Solid", variant: "Secondary", size: "Small" }}
                  price={opt.price}
                  priceLabel={opt.anchor}
                  bordered={false}
                  style={{ background: T.white }}
                >
                  {opt.description}
                </StrategyCard>
              ))}
            </div>
          </SectionCard>
        </div>

      </ReportPage>
    </PageWrapper>
  );
}
