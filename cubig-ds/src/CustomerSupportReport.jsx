import React from "react";
import reportData from "./data/customer-support.json";
import {
  PageWrapper, ReportPage, SectionHeading, ReportSection,
  SectionCard, ContentCard, ContentArea, ContentHeader,
  MiniStatGrid, DataTable, InsightContent, InfoCard, InfoCardRow,
  TextBlock, KeyFindings,
} from "./report-components.jsx";
import { FunnelChart, StackedHBar } from "./charts.jsx";
import { Badge } from "./ui-components.jsx";
import { T } from "./tokens.jsx";

const F = "Pretendard, sans-serif";

export default function CustomerSupportReport() {
  const { meta, sections } = reportData;

  const renderSection = (section) => {
    switch (section.componentType) {

      /* ─── Executive Summary ─── */
      case "ExecutiveSummary": {
        const topMetrics = section.data.topMetrics.map(m => ({
          label: m.label, value: m.value,
        }));
        return (
          <ReportSection>
            <SectionHeading title={section.label} description={section.data.description} />
            <InfoCardRow>
              {topMetrics.map((m, i) => (
                <InfoCard key={i} label={m.label} value={m.value} variant="solid" />
              ))}
            </InfoCardRow>
            <KeyFindings title="Key Findings" items={section.data.keyFindings} />
          </ReportSection>
        );
      }

      /* ─── Metric Highlight (3-col outline cards) ─── */
      case "MetricHighlight": {
        return (
          <ReportSection>
            <SectionHeading title={section.label} />
            <InfoCardRow>
              {section.data.items.map((it, i) => (
                <InfoCard key={i} label={it.label} value={it.value} description={`${it.sub} — ${it.description}`} variant="solid" />
              ))}
            </InfoCardRow>
          </ReportSection>
        );
      }

      /* ─── Data Table ─── */
      case "DataTable": {
        const columns = [
          { key: "metric", label: "지표" },
          ...section.data.columns.map(c => ({ key: c.label, label: c.label, align: "center" })),
        ];
        const data = section.data.rows.map(r => {
          const rowData = { metric: r.metric };
          section.data.columns.forEach((c, idx) => {
            rowData[c.label] = r.values[idx];
          });
          return rowData;
        });
        return (
          <ReportSection>
            <SectionHeading title={section.label} />
            <DataTable columns={columns} data={data} />
          </ReportSection>
        );
      }

      /* ─── Funnel Chart ─── */
      case "FunnelChart": {
        const steps = section.data.stages.map(s => ({
          label: s.label, value: s.value,
        }));
        return (
          <ReportSection>
            <SectionHeading title={section.label} />
            <FunnelChart title={section.data.title} steps={steps} />
          </ReportSection>
        );
      }

      /* ─── Stacked Bar Chart ─── */
      case "StackedBarChart": {
        if (!section.data.items || section.data.items.length === 0) return null;
        const keys = section.data.categories;
        const data = section.data.items.map(it => {
          const row = { label: it.label || "Total" };
          it.values.forEach((v, i) => { row[keys[i]] = v; });
          return row;
        });
        return (
          <ReportSection>
            <SectionHeading title={section.label} />
            <StackedHBar title={section.data.title || section.label} data={data} keys={keys} />
          </ReportSection>
        );
      }

      /* ─── Insight Cards (원인 분석) ─── */
      case "InsightCard": {
        return (
          <ReportSection>
            <SectionHeading title={section.label} />
            <ContentArea wrap={true} gap={8}>
              {section.data.items.map((it, i) => (
                <ContentCard key={i} padding={24} style={{ border: `1px solid ${T.gray200}`, borderRadius: 16, flex: "1 1 300px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Badge type="Outline" variant="Info" size="Medium" text={it.badge} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990, marginBottom: 12, fontFamily: F }}>
                    {it.value}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray800, marginBottom: 12, fontFamily: F }}>
                    {it.description}
                  </div>
                  <div style={{ padding: "12px 16px", background: T.gray50, borderRadius: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.gray800, lineHeight: "22px", fontFamily: F }}>
                      <span style={{ fontWeight: 600, color: T.gray990 }}>해석:</span> {it.interpretation}
                    </div>
                  </div>
                </ContentCard>
              ))}
            </ContentArea>
          </ReportSection>
        );
      }

      /* ─── Strategy Table (Immediate / Short / Mid) ─── */
      case "StrategyTable": {
        const terms = [
          { key: "immediate", label: "Immediate Actions (즉시)", variant: "Negative" },
          { key: "short", label: "Short-term (단기)", variant: "Cautionary" },
          { key: "mid", label: "Mid-term (중기)", variant: "Info" },
        ];
        return (
          <ReportSection>
            <SectionHeading title={section.label} />
            {terms.map(({ key: term, label: termLabel, variant }) => {
              if (!section.data[term]) return null;
              return (
                <div key={term} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <ContentHeader title={termLabel} />
                  <ContentArea wrap={true} gap={8}>
                    {section.data[term].map((plan, i) => (
                      <ContentCard key={i} padding={24} style={{ border: `1px solid ${T.gray200}`, borderRadius: 16, flex: "1 1 400px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                          <Badge type="Solid" variant={variant} size="Medium" text={plan.strategy} />
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: T.gray990, marginBottom: 12, fontFamily: F }}>
                          {plan.objective}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", gap: 8, fontFamily: F }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T.gray990, flexShrink: 0, width: 52 }}>Action</span>
                            <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800, lineHeight: "22px" }}>{plan.actionPlan}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, fontFamily: F }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T.gray990, flexShrink: 0, width: 52 }}>Impact</span>
                            <span style={{ fontSize: 14, fontWeight: 400, color: T.gray800, lineHeight: "22px" }}>{plan.expectedImpact}</span>
                          </div>
                        </div>
                      </ContentCard>
                    ))}
                  </ContentArea>
                </div>
              );
            })}
          </ReportSection>
        );
      }

      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0", color: T.gray990, fontFamily: F }}>
          {meta?.agentName || "고객 문의/티켓 분석 리포트"}
        </h1>
        <p style={{ fontSize: 14, color: T.gray800, margin: 0, fontFamily: F }}>
          생성일: {new Date(meta?.createdAt || Date.now()).toLocaleDateString()}
        </p>
      </div>
      <ReportPage>
        {sections.map(section => (
          <React.Fragment key={section.id}>
            {renderSection(section)}
          </React.Fragment>
        ))}
      </ReportPage>
    </PageWrapper>
  );
}
