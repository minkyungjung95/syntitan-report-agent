import React from "react";
import {
  PageWrapper, ReportPage, SectionHeading, ReportSection,
  SectionCard, ContentCard, ContentArea, ContentHeader,
  MiniStatGrid, DataTable, QATable, InsightContent, InfoCard, InfoCardRow,
  TextBlock, KeyFindings, SignalCard, ExecutiveSummaryCard, ExecutionRoadmap, WeeklyPlanTable,
  StrategyRoadmapTable, UserCard,
} from "./report-components.jsx";
import {
  DonutChart, PieChart, LineChart, VBarChart, HBarChart,
  StackedHBar, FunnelChart, RadarChart, ComboChart,
} from "./charts.jsx";
import { Badge } from "./ui-components.jsx";
import { T } from "./tokens.jsx";

const F = "Pretendard, sans-serif";

// ── 데이터 검증 헬퍼 ──
function isEmptyValue(v) {
  return v == null || v === "" || v === "—" || v === "-" || v === "N/A" || v === "n/a";
}

function isEmptyTable(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) return true;
  const keys = columns?.map(c => c.key || c.label) || Object.keys(rows[0] || {});
  if (keys.length === 0) return true;
  const totalCells = rows.length * keys.length;
  const emptyCells = rows.reduce((sum, r) => sum + keys.filter(k => isEmptyValue(r[k])).length, 0);
  return emptyCells / totalCells > 0.5;
}

function isEmptyChart(data) {
  if (!Array.isArray(data) || data.length === 0) return true;
  // 숫자 value가 하나라도 있는지 확인
  const hasValue = data.some(d => {
    if (typeof d.value === "number" && d.value !== 0) return true;
    if (Array.isArray(d.data) && d.data.some(p => typeof p.y === "number" && p.y !== 0)) return true;
    return Object.values(d).some(v => typeof v === "number" && v !== 0);
  });
  return !hasValue;
}

function EmptyStatePlaceholder({ label, reason }) {
  return (
    <div style={{
      padding: 32,
      background: T.gray50,
      border: `1px dashed ${T.gray300}`,
      borderRadius: 12,
      fontFamily: F,
      color: T.gray800,
      fontSize: 14,
      textAlign: "center",
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: T.gray990 }}>⚠ 데이터 없음 — {label || "섹션"}</div>
      <div>{reason || "데이터 연동 시 자동으로 표시됩니다."}</div>
    </div>
  );
}

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
 *  - ComboChart             바 + 선 (이중 Y축)
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
          <SectionCard>
            {topMetrics.length > 0 && (
              <InfoCardRow>
                {topMetrics.map((m, i) => (
                  <InfoCard key={i} label={m.label} value={m.value} variant="outline" />
                ))}
              </InfoCardRow>
            )}
            {section.data.keyFindings && (
              <ContentCard>
                <KeyFindings title="Key Findings" items={section.data.keyFindings} bordered={false} />
              </ContentCard>
            )}
          </SectionCard>
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
      const defaultVariant = section.componentType === "MetricHighlight" ? "outline" : "solid";
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <InfoCardRow>
              {(section.data.items || []).map((it, i) => (
                <InfoCard
                  key={i}
                  label={it.label}
                  value={it.value}
                  suffix={it.suffix}
                  description={it.description || it.sub}
                  variant={it.variant || section.data.variant || defaultVariant}
                />
              ))}
            </InfoCardRow>
          </SectionCard>
        </ReportSection>
      );
    }

    case "TextBlock": {
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
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
      const tableIsEmpty = isEmptyTable(data, columns);
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          {tableIsEmpty ? (
            <EmptyStatePlaceholder label={section.label || "테이블"} reason={section.data.emptyReason || "데이터 연동 시 자동으로 표시됩니다."} />
          ) : (
            <SectionCard>
              <ContentCard padding={0}>
                <DataTable columns={columns} data={data} />
              </ContentCard>
            </SectionCard>
          )}
        </ReportSection>
      );
    }

    case "FunnelChart": {
      const steps = (section.data.stages || section.data.steps || []).map(s => ({
        label: s.label, value: s.value,
      }));
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <ContentCard padding={32}>
              <FunnelChart title={section.data.title} steps={steps} />
            </ContentCard>
          </SectionCard>
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
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <ContentCard padding={32}>
              <StackedHBar title={section.data.title || section.label} data={data} keys={keys} />
            </ContentCard>
          </SectionCard>
        </ReportSection>
      );
    }

    case "DonutChart": {
      const d = section.data.data || [];
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          {isEmptyChart(d) ? (
            <EmptyStatePlaceholder label={section.label || "차트"} reason={section.data.emptyReason} />
          ) : (
            <SectionCard>
              <ContentCard padding={32}>
                <DonutChart title={section.data.title} data={d} size={section.data.size || 240} />
              </ContentCard>
            </SectionCard>
          )}
        </ReportSection>
      );
    }

    case "PieChart": {
      const d = section.data.data || [];
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          {isEmptyChart(d) ? (
            <EmptyStatePlaceholder label={section.label || "차트"} reason={section.data.emptyReason} />
          ) : (
            <SectionCard>
              <ContentCard padding={32}>
                <PieChart title={section.data.title} data={d} size={section.data.size || 240} />
              </ContentCard>
            </SectionCard>
          )}
        </ReportSection>
      );
    }

    case "LineChart": {
      const d = section.data.data || [];
      const hasPoints = d.some(s => Array.isArray(s.data) && s.data.length >= 2);
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          {!hasPoints ? (
            <EmptyStatePlaceholder label={section.label || "라인 차트"} reason={section.data.emptyReason || "각 series에 최소 2개 이상의 데이터 포인트가 필요합니다."} />
          ) : (
            <SectionCard>
              <ContentCard padding={32}>
                <LineChart
                  title={section.data.title}
                  variant={section.data.variant}
                  enableArea={section.data.enableArea}
                  data={d}
                />
              </ContentCard>
            </SectionCard>
          )}
        </ReportSection>
      );
    }

    case "BarChart":
    case "VBarChart": {
      const d = section.data.data || [];
      const keys = section.data.keys || [];
      const keysMatch = keys.length === 0 || (d[0] && keys.every(k => k in d[0]));
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          {isEmptyChart(d) || !keysMatch ? (
            <EmptyStatePlaceholder label={section.label || "막대 차트"} reason={section.data.emptyReason || (!keysMatch ? `keys(${keys.join(", ")}) 중 일부가 data에 없습니다.` : undefined)} />
          ) : (
            <SectionCard>
              <ContentCard padding={32}>
                <VBarChart
                  title={section.data.title}
                  data={d}
                  keys={keys}
                  indexBy={section.data.indexBy || "label"}
                  groupMode={section.data.groupMode || "grouped"}
                  stacked={section.data.stacked}
                />
              </ContentCard>
            </SectionCard>
          )}
        </ReportSection>
      );
    }

    case "HBarChart": {
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <ContentCard padding={32}>
              <HBarChart
                title={section.data.title}
                data={section.data.data || []}
                maxValue={section.data.maxValue}
              />
            </ContentCard>
          </SectionCard>
        </ReportSection>
      );
    }

    case "RadarChart": {
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <ContentCard padding={32}>
              <RadarChart
                title={section.data.title}
                data={section.data.data || []}
                keys={section.data.keys}
                indexBy={section.data.indexBy || "label"}
              />
            </ContentCard>
          </SectionCard>
        </ReportSection>
      );
    }

    case "ComboChart": {
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <ContentCard padding={32}>
              <ComboChart
                title={section.data.title}
                data={section.data.data || []}
                barKey={section.data.barKey || "bar"}
                lineKey={section.data.lineKey || "line"}
                barLabel={section.data.barLabel}
                lineLabel={section.data.lineLabel}
                barAxisLabel={section.data.barAxisLabel}
                lineAxisLabel={section.data.lineAxisLabel}
              />
            </ContentCard>
          </SectionCard>
        </ReportSection>
      );
    }

    case "InsightCard": {
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            {(section.data.items || []).map((it, i) => (
              <InsightContent
                key={i}
                layout="vertical"
                wrap={true}
                header={it.badge || it.header}
                title={it.value || it.title}
                description={[it.description, it.interpretation && `해석: ${it.interpretation}`].filter(Boolean).join("\n\n")}
              />
            ))}
          </SectionCard>
        </ReportSection>
      );
    }

    case "UserCardRow":
    case "UserCard": {
      const items = section.data.items || (section.data.type ? [section.data] : []);
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
            {items.map((it, i) => (
              <UserCard
                key={i}
                type={it.type || "simple"}
                name={it.name}
                subtitle={it.subtitle}
                badge={it.badge}
                description={it.description}
                details={it.details}
                stats={it.stats}
                buttonLabel={it.buttonLabel}
              />
            ))}
          </div>
        </ReportSection>
      );
    }

    case "StrategyTable":
    case "StrategyRoadmapTable": {
      // 두 포맷 지원:
      // 1) { immediate: [...], short: [...], mid: [...] }  ← 기존 StrategyTable
      // 2) { periods: [{ badge, period, rows: [...] }] }   ← StrategyRoadmapTable 네이티브
      let periods;
      if (section.data.periods) {
        periods = section.data.periods;
      } else {
        const terms = [
          { key: "immediate", badge: "Immediate", period: "즉시" },
          { key: "short", badge: "Short-term", period: "단기" },
          { key: "mid", badge: "Mid-term", period: "중기" },
        ];
        periods = terms
          .filter(t => Array.isArray(section.data[t.key]) && section.data[t.key].length > 0)
          .map(t => ({
            badge: t.badge,
            period: t.period,
            rows: section.data[t.key],
          }));
      }
      return (
        <ReportSection>
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
          <SectionCard>
            <ContentCard padding={0}>
              <StrategyRoadmapTable periods={periods} />
            </ContentCard>
          </SectionCard>
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
          {(section.label || section.data.description) && <SectionHeading title={section.label} description={section.data.description} />}
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
    case "UserCardRow":
    case "UserCard": {
      const items = section.data.items || (section.data.type ? [section.data] : []);
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
          {items.map((it, i) => (
            <UserCard
              key={i}
              type={it.type || "simple"}
              name={it.name}
              subtitle={it.subtitle}
              badge={it.badge}
              description={it.description}
              details={it.details}
              stats={it.stats}
              buttonLabel={it.buttonLabel}
            />
          ))}
        </div>
      );
    }
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
