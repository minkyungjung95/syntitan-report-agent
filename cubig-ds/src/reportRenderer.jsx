import React from "react";
import {
  PageWrapper, ReportPage, SectionHeading, ReportSection,
  SectionCard, ContentCard, ContentArea, ContentHeader,
  MiniStatGrid, DataTable, QATable, InsightContent, InfoCard, InfoCardRow,
  TextBlock, KeyFindings, SignalCard, ExecutiveSummaryCard, ExecutionRoadmap, WeeklyPlanTable,
} from "./report-components.jsx";
import {
  DonutChart, PieChart, LineChart, VBarChart, HBarChart,
  StackedHBar, FunnelChart, SankeyChart, RadarChart,
} from "./charts.jsx";
import { Badge } from "./ui-components.jsx";
import { T } from "./tokens.jsx";

const F = "Pretendard, sans-serif";

/**
 * JSON → DS 컴포넌트 매핑 렌더러
 *
 * 지원 section.componentType:
 *  - ExecutiveSummary       요약 지표 + Key Findings
 *  - MetricHighlight        InfoCardRow (solid)
 *  - InfoCardRow            label/value/description 카드 row
 *  - TextBlock              제목 + bullet list or 본문
 *  - DataTable              columns + rows
 *  - FunnelChart            퍼널
 *  - StackedBarChart        누적 수평 바
 *  - DonutChart             도넛
 *  - PieChart               파이
 *  - LineChart              라인
 *  - BarChart               세로 바 (단일/그룹/스택)
 *  - HBarChart              수평 바
 *  - RadarChart             레이더
 *  - SankeyChart            산키
 *  - InsightCard            카드 리스트 (Badge + value + desc + 해석)
 *  - StrategyTable          Immediate/Short/Mid 전략 카드
 *  - ExecutionRoadmap       주차별 탭 로드맵
 *  - WeeklyPlanTable        주차별 테이블
 */
export function renderSection(section) {
  switch (section.componentType) {

    case "ExecutiveSummary": {
      const topMetrics = (section.data.topMetrics || []).map(m => ({ label: m.label, value: m.value }));
      return (
        <ReportSection>
          <SectionHeading title={section.label} description={section.data.description} />
          {topMetrics.length > 0 && (
            <InfoCardRow>
              {topMetrics.map((m, i) => (
                <InfoCard key={i} label={m.label} value={m.value} variant="solid" />
              ))}
            </InfoCardRow>
          )}
          {section.data.keyFindings && (
            <KeyFindings title="Key Findings" items={section.data.keyFindings} />
          )}
        </ReportSection>
      );
    }

    case "ExecutiveSummaryCard": {
      return (
        <ExecutiveSummaryCard
          title={section.label || "Executive Summary"}
          summaryItems={section.data.summaryItems || []}
          findings={section.data.findings}
        />
      );
    }

    case "MetricHighlight":
    case "InfoCardRow": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <InfoCardRow>
            {(section.data.items || []).map((it, i) => (
              <InfoCard
                key={i}
                label={it.label}
                value={it.value}
                suffix={it.suffix}
                description={it.description || (it.sub ? `${it.sub}${it.description ? ` — ${it.description}` : ""}` : undefined)}
                variant={it.variant || section.data.variant || "solid"}
              />
            ))}
          </InfoCardRow>
        </ReportSection>
      );
    }

    case "TextBlock": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <TextBlock title={section.data.title} items={section.data.items} bordered={true}>
            {section.data.body}
          </TextBlock>
        </ReportSection>
      );
    }

    case "DataTable": {
      const cols = section.data.columns || [];
      // 두 가지 포맷 지원:
      //  1) rows: [{ metric, values: [...] }]
      //  2) data: [{ key: value, ... }]
      let columns, data;
      if (section.data.rows) {
        columns = [
          { key: "metric", label: section.data.indexLabel || "지표" },
          ...cols.map(c => ({ key: c.label || c.key, label: c.label || c.key, align: "center" })),
        ];
        data = section.data.rows.map(r => {
          const row = { metric: r.metric };
          cols.forEach((c, idx) => { row[c.label || c.key] = r.values[idx]; });
          return row;
        });
      } else {
        columns = cols;
        data = section.data.data || [];
      }
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <DataTable columns={columns} data={data} />
        </ReportSection>
      );
    }

    case "FunnelChart": {
      const steps = (section.data.stages || section.data.steps || []).map(s => ({
        label: s.label, value: s.value,
      }));
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <FunnelChart title={section.data.title} steps={steps} />
        </ReportSection>
      );
    }

    case "StackedBarChart":
    case "StackedHBar": {
      if (!section.data.items || section.data.items.length === 0) return null;
      const keys = section.data.categories || section.data.keys || [];
      const data = section.data.items.map(it => {
        const row = { label: it.label || "Total" };
        (it.values || []).forEach((v, i) => { row[keys[i]] = v; });
        return row;
      });
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <StackedHBar title={section.data.title || section.label} data={data} keys={keys} />
        </ReportSection>
      );
    }

    case "DonutChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <DonutChart title={section.data.title} data={section.data.data || []} size={section.data.size || 240} />
        </ReportSection>
      );
    }

    case "PieChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <PieChart title={section.data.title} data={section.data.data || []} size={section.data.size || 240} />
        </ReportSection>
      );
    }

    case "LineChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <LineChart
            title={section.data.title}
            variant={section.data.variant}
            enableArea={section.data.enableArea}
            data={section.data.data || []}
          />
        </ReportSection>
      );
    }

    case "BarChart":
    case "VBarChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <VBarChart
            title={section.data.title}
            data={section.data.data || []}
            keys={section.data.keys}
            indexBy={section.data.indexBy || "label"}
            groupMode={section.data.groupMode || "grouped"}
            stacked={section.data.stacked}
          />
        </ReportSection>
      );
    }

    case "HBarChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <HBarChart
            title={section.data.title}
            data={section.data.data || []}
            maxValue={section.data.maxValue}
          />
        </ReportSection>
      );
    }

    case "RadarChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <RadarChart
            title={section.data.title}
            data={section.data.data || []}
            keys={section.data.keys}
            indexBy={section.data.indexBy || "label"}
          />
        </ReportSection>
      );
    }

    case "SankeyChart": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <SankeyChart title={section.data.title} data={section.data.data} />
        </ReportSection>
      );
    }

    case "InsightCard": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <ContentArea wrap={true} gap={8}>
            {(section.data.items || []).map((it, i) => (
              <ContentCard key={i} padding={24} style={{ border: `1px solid ${T.gray200}`, borderRadius: 16, flex: "1 1 300px" }}>
                {it.badge && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Badge type="Outline" variant={it.badgeVariant || "Info"} size="Medium" text={it.badge} />
                  </div>
                )}
                {it.value && (
                  <div style={{ fontSize: 18, fontWeight: 600, lineHeight: "26px", color: T.gray990, marginBottom: 12, fontFamily: F }}>
                    {it.value}
                  </div>
                )}
                {it.description && (
                  <div style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray800, marginBottom: 12, fontFamily: F }}>
                    {it.description}
                  </div>
                )}
                {it.interpretation && (
                  <div style={{ padding: "12px 16px", background: T.gray50, borderRadius: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.gray800, lineHeight: "22px", fontFamily: F }}>
                      <span style={{ fontWeight: 600, color: T.gray990 }}>해석:</span> {it.interpretation}
                    </div>
                  </div>
                )}
              </ContentCard>
            ))}
          </ContentArea>
        </ReportSection>
      );
    }

    case "StrategyTable": {
      const terms = [
        { key: "immediate", label: "Immediate Actions (즉시)", variant: "Negative" },
        { key: "short", label: "Short-term (단기)", variant: "Cautionary" },
        { key: "mid", label: "Mid-term (중기)", variant: "Info" },
      ];
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
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

    case "ExecutionRoadmap": {
      return (
        <ExecutionRoadmap
          title={section.data.title || section.label}
          subtitle={section.data.subtitle}
          weeks={section.data.weeks || []}
        />
      );
    }

    case "WeeklyPlanTable": {
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} />}
          <WeeklyPlanTable weeks={section.data.weeks || []} columns={section.data.columns} />
        </ReportSection>
      );
    }

    /* ─── Composite: 여러 컴포넌트를 SectionCard wrap으로 묶기 ─── */
    /* 7가지 권장 조합:
       1) SignalCard + 그래프
       2) InsightContent + 그래프
       3) 그래프 + TextBlock
       4) 그래프 + Tables
       5) InfoCard + Tables
       6) TextBlock only (단일도 래핑 가능)
       7) TextBlock + InfoCard
       (그래프는 DS의 모든 차트 지원, items 개수 제한 없음)
    */
    case "Composite": {
      const items = section.data?.items || [];
      // 각 item을 하위 section처럼 처리, 단 ReportSection 바깥 래핑은 하지 않음
      const renderInnerItem = (item, idx) => {
        const inner = renderSectionInner(item);
        return (
          <ContentCard key={idx} padding={item.padding || 24} style={item.style}>
            {inner}
          </ContentCard>
        );
      };
      return (
        <ReportSection>
          {section.label && <SectionHeading title={section.label} description={section.data?.description} />}
          <SectionCard>
            {items.map(renderInnerItem)}
          </SectionCard>
        </ReportSection>
      );
    }

    default:
      return (
        <ReportSection>
          <div style={{ padding: 24, background: T.red50 || "#FEF2F2", borderRadius: 12, color: T.red700 || "#B91C1C", fontFamily: F, fontSize: 14 }}>
            ⚠ Unknown componentType: <b>{section.componentType}</b>
          </div>
        </ReportSection>
      );
  }
}

/**
 * Composite 내부 용 — 최상위 래핑(ReportSection) 없이 순수 컴포넌트만 반환
 */
function renderSectionInner(section) {
  switch (section.componentType) {
    case "InfoCardRow":
    case "MetricHighlight": {
      return (
        <InfoCardRow>
          {(section.data.items || []).map((it, i) => (
            <InfoCard key={i} label={it.label} value={it.value} suffix={it.suffix}
              description={it.description} variant={it.variant || section.data.variant || "solid"} />
          ))}
        </InfoCardRow>
      );
    }
    case "TextBlock": {
      return <TextBlock title={section.data.title} items={section.data.items} bordered={false}>{section.data.body}</TextBlock>;
    }
    case "KeyFindings": {
      return <KeyFindings title={section.data.title || "Key Findings"} items={section.data.items} bordered={false} />;
    }
    case "DataTable": {
      const cols = section.data.columns || [];
      let columns, data;
      if (section.data.rows) {
        columns = [
          { key: "metric", label: section.data.indexLabel || "지표" },
          ...cols.map(c => ({ key: c.label || c.key, label: c.label || c.key, align: "center" })),
        ];
        data = section.data.rows.map(r => {
          const row = { metric: r.metric };
          cols.forEach((c, idx) => { row[c.label || c.key] = r.values[idx]; });
          return row;
        });
      } else {
        columns = cols;
        data = section.data.data || [];
      }
      return <DataTable columns={columns} data={data} />;
    }
    case "QATable": {
      return <QATable columns={section.data.columns} rows={section.data.rows} bordered={false} />;
    }
    case "DonutChart":
      return <DonutChart title={section.data.title} data={section.data.data || []} size={section.data.size || 240} />;
    case "PieChart":
      return <PieChart title={section.data.title} data={section.data.data || []} size={section.data.size || 240} />;
    case "LineChart":
      return <LineChart title={section.data.title} variant={section.data.variant} enableArea={section.data.enableArea} data={section.data.data || []} />;
    case "BarChart":
    case "VBarChart":
      return <VBarChart title={section.data.title} data={section.data.data || []} keys={section.data.keys} indexBy={section.data.indexBy || "label"} groupMode={section.data.groupMode || "grouped"} stacked={section.data.stacked} />;
    case "HBarChart":
      return <HBarChart title={section.data.title} data={section.data.data || []} maxValue={section.data.maxValue} />;
    case "StackedBarChart":
    case "StackedHBar": {
      if (!section.data.items) return null;
      const keys = section.data.categories || section.data.keys || [];
      const data = section.data.items.map(it => {
        const row = { label: it.label || "Total" };
        (it.values || []).forEach((v, i) => { row[keys[i]] = v; });
        return row;
      });
      return <StackedHBar title={section.data.title || section.label} data={data} keys={keys} />;
    }
    case "FunnelChart": {
      const steps = (section.data.stages || section.data.steps || []).map(s => ({ label: s.label, value: s.value }));
      return <FunnelChart title={section.data.title} steps={steps} />;
    }
    case "RadarChart":
      return <RadarChart title={section.data.title} data={section.data.data || []} keys={section.data.keys} indexBy={section.data.indexBy || "label"} />;
    case "SankeyChart":
      return <SankeyChart title={section.data.title} data={section.data.data} />;
    case "SignalCardRow": {
      // signals: [{number, title, items, alert, alertVariant}]
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {(section.data.signals || []).map((s, i) => (
            <SignalCard key={i} number={s.number} title={s.title} items={s.items || []}
              alert={s.alert} alertVariant={s.alertVariant || "Cautionary"} bordered={true} />
          ))}
        </div>
      );
    }
    case "InsightRow": {
      // insights: [{icon, header, title, description}] (vertical) or [{label, value, items}] (horizontal)
      const layout = section.data.layout || "vertical";
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(section.data.insights || []).map((it, i) => (
            <InsightContent
              key={i}
              layout={layout}
              wrap={true}
              icon={it.icon}
              header={it.header}
              title={it.title}
              description={it.description}
              label={it.label}
              value={it.value}
              items={it.items}
              style={{ border: `1px solid ${T.gray200}` }}
            />
          ))}
        </div>
      );
    }
    default:
      return (
        <div style={{ padding: 16, background: "#FEF2F2", color: "#B91C1C", borderRadius: 8, fontSize: 13 }}>
          ⚠ Unknown inner componentType: <b>{section.componentType}</b>
        </div>
      );
  }
}


/**
 * 전체 리포트 렌더러 (JSON 최상위 → 제목 + sections)
 */
export function ReportRenderer({ report }) {
  if (!report) return null;
  const { meta = {}, sections = [] } = report;
  return (
    <PageWrapper>
      {meta.title && (
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0", color: T.gray990, fontFamily: F }}>
            {meta.title || meta.agentName}
          </h1>
          {(meta.subtitle || meta.createdAt) && (
            <p style={{ fontSize: 14, color: T.gray800, margin: 0, fontFamily: F }}>
              {meta.subtitle || (meta.createdAt && `생성일: ${new Date(meta.createdAt).toLocaleDateString()}`)}
            </p>
          )}
        </div>
      )}
      <ReportPage>
        {sections.map((section, i) => (
          <React.Fragment key={section.id || i}>
            {renderSection(section)}
          </React.Fragment>
        ))}
      </ReportPage>
    </PageWrapper>
  );
}
