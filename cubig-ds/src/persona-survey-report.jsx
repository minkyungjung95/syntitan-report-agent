import { useEffect, useState } from "react";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  TextBlock,
  UserCard,
} from "./report-components";
// 모달 패턴 (Synthetic Respondent Samples) — ModalUserCard + ModalField 는 ui-components.jsx 의 모달 전용 블록
import { DonutChart, HBarChart } from "./charts";
import { DownloadIcon, DatabaseIcon, IdentityPlatformOutlineIcon } from "./tokens.jsx";
import { Btn, Badge, Modal, ModalUserCard, ModalField } from "./ui-components.jsx";
import { T } from "./tokens.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  PersonaSurveyReport — 페르소나 서베이 리포트
 *
 *  FE 핸드오프 가이드 (개발자 폴더 구조 권장):
 *    src/components/report/PersonaSurveyReport/
 *      ├── index.tsx                       ← 메인
 *      ├── ExecutiveSummary.tsx            ← (Section 1) Executive Summary
 *      ├── DemographicBreakdown.tsx        ← (Section 2) DonutChart x2
 *      ├── QuestionAnalysis.tsx            ← (Section 3) HBarChart + TextBlock + RespondentCard
 *      └── CorrelationAnalysis.tsx         ← (Section 4) 패턴 카드 3개
 *
 *  데이터 소스: public/json/persona-survey.json
 *  컴포넌트: ContentHeader / SectionHeading / ExecutiveSummaryCard / SectionCard /
 *           ContentCard / TextBlock / RespondentCard / DonutChart / HBarChart
 * ═══════════════════════════════════════════════════════════════════════════ */

// JSON color token → hex
const COLOR_MAP = {
  blue: "#2B7FFF",
  lightBlue: "#8EC5FF",
  green: "#7CCF00",
  lightGreen: "#B6E274",
  yellow: "#FDC700",
  red: "#FB2C36",
  gray: "#C5C6CA",
};

// 설문 응답 룰: value 상위 2개만 색상(blue, green), 나머지는 gray
// 동일 value 처리: 먼저 등장한 인덱스 우선
function topTwoColors(items, getValue = (it) => it.value) {
  const indexed = items.map((it, i) => ({ i, v: getValue(it) }));
  const sorted = [...indexed].sort((a, b) => b.v - a.v);
  const top1 = sorted[0]?.i;
  const top2 = sorted[1]?.i;
  return items.map((_, i) =>
    i === top1 ? "#2B7FFF" :
    i === top2 ? "#7CCF00" :
    "#C5C6CA"
  );
}

export default function PersonaSurveyReport() {
  const [data, setData] = useState(null);
  const [selectedRespondent, setSelectedRespondent] = useState(null);
  useEffect(() => {
    fetch("/json/persona-survey.json")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error("Failed to load persona-survey.json", e));
  }, []);

  const openRespondent = (r) => {
    setSelectedRespondent(r);
  };

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
  const demo = findSection("demographic-breakdown");
  const detail = findSection("detailed-question-analysis");
  const corr = findSection("correlation-analysis");

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
          <SectionHeading
            overline="Executive Summary"
            title={`총 ${exec.data.topMetrics.find((m) => m.label === "Number of respondents")?.value ?? ""} 응답 기반의 핵심 요약`}
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={exec.data.topMetrics.map((m) => ({ label: m.label, value: m.value }))}
            findings={{
              title: "Key Findings",
              items: exec.data.keyFindings,
            }}
          />
        </div>

        {/* Section 2: Demographic Breakdown — DonutChart 2개 (CHART_COLORS 팔레트 순서대로) */}
        <div>
          <SectionHeading overline="Demographic Breakdown" title={demo?.headline} description={demo?.data?.description} />
          <SectionCard>
            <ContentCard padding={24}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                {demo.data.donutCharts.map((dc, i) => (
                  <div key={i} style={{ flex: "1 1 360px", minWidth: 320 }}>
                    <DonutChart
                      title={dc.title}
                      size={200}
                      legendPosition="bottom"
                      data={dc.segments.map((s) => ({
                        id: s.label,
                        value: s.percentage,
                      }))}
                    />
                  </div>
                ))}
              </div>
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 3: Detailed Question Analysis — 질문별로 SectionCard 1개씩 */}
        <div>
          <SectionHeading overline="Detailed Question Analysis" title={detail?.headline} description={detail?.data?.description} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {detail.data.questions.map((q, qi) => (
              <SectionCard key={qi}>
                {/* 응답 분포 HBarChart — title을 질문으로, 상위 2개만 색상(blue, green), 나머지 gray */}
                <ContentCard padding={40}>
                  {(() => {
                    const colors = topTwoColors(q.responseChart.items);
                    return (
                      <HBarChart
                        title={`Q${qi + 1}. ${q.question}`}
                        valueInside
                        data={q.responseChart.items.map((it, idx) => ({
                          label: it.label,
                          value: it.value,
                          count: it.count,
                          color: colors[idx],
                        }))}
                      />
                    );
                  })()}
                </ContentCard>

                {/* 해석 */}
                {q.interpretation && (
                  <ContentCard padding={0}>
                    <TextBlock title="AI 해석" items={[q.interpretation]} bordered={false} />
                  </ContentCard>
                )}

                {/* 가상 응답자 카드 — UserCard type="detail" 2x2 그리드 (SectionCard 회색 위에 직접 배치하여 카드 경계 노출) */}
                {q.syntheticRespondents && q.syntheticRespondents.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8 }}>
                    {q.syntheticRespondents.map((r) => (
                      <UserCard
                        key={r.id}
                        type="detail"
                        name={r.name}
                        subtitle={`${r.gender} · ${r.age}세 · ${r.job}`}
                        description={r.responseSummary}
                        onButtonClick={() => openRespondent(r)}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>
            ))}
          </div>
        </div>

        {/* Section 4: Correlation Analysis — 패턴별 SectionCard 래핑 (다른 섹션과 일관) */}
        <div>
          <SectionHeading overline="Correlation Analysis" title={corr?.headline} description={corr?.data?.description} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {corr.data.patterns.map((p, i) => {
              const overlapColor = p.overlap?.color === "red" ? "#FB2C36" : p.overlap?.color === "green" ? "#00C950" : "#2B7FFF";
              return (
                <SectionCard key={i}>
                  {/* 패턴 헤더 — ContentCard padding=24 */}
                  <ContentCard padding={24}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div>
                        <Badge type="Outline" variant="Info" size="Small" text={p.patternLabel} />
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990 }}>{p.patternTitle}</div>
                    </div>
                  </ContentCard>

                  {/* 메트릭 영역 — ContentCard padding=32, 좌 · + · 우 · 중복 */}
                  <ContentCard padding={32}>
                    <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
                      <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "0 8px" }}>
                        <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800 }}>{p.leftMetric.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990 }}>{p.leftMetric.value}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: "36px", color: T.gray990 }}>{p.leftMetric.percentage}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 500, color: T.gray500, padding: "0 8px" }}>+</div>
                      <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "0 8px" }}>
                        <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800 }}>{p.rightMetric.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: T.gray990 }}>{p.rightMetric.value}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: "36px", color: T.gray990 }}>{p.rightMetric.percentage}</div>
                      </div>
                      <div style={{ flex: 1.4, background: T.gray50, borderRadius: 16, padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: T.gray800 }}>{p.overlap.label}</div>
                        <div>
                          <span style={{ fontSize: 28, fontWeight: 700, lineHeight: "36px", color: overlapColor }}>{p.overlap.value}</span>
                          {p.overlap.count && (
                            <span style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", color: T.gray800, marginLeft: 8 }}>({p.overlap.count})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </ContentCard>

                  {/* 해석 — ContentCard padding=0 + TextBlock bordered=false */}
                  <ContentCard padding={0}>
                    <TextBlock title="해석" items={[p.interpretation]} bordered={false} />
                  </ContentCard>
                </SectionCard>
              );
            })}
          </div>
        </div>

      </ReportPage>

      {/* View Detail 모달 — DS Pattern 1: Synthetic Respondent Samples
            (ModalUserCard + gray50 박스 + ModalField 반복) */}
      <Modal
        open={!!selectedRespondent}
        onClose={() => setSelectedRespondent(null)}
        title={
          selectedRespondent && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>Synthetic Respondent Samples</span>
              <Badge type="Solid" variant="Cautionary" size="Small" text={selectedRespondent.badge} />
            </div>
          )
        }
        size="lg"
        actionType="single"
        confirmLabel="Close"
        onConfirm={() => setSelectedRespondent(null)}
      >
        {selectedRespondent && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ModalUserCard
              icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name={selectedRespondent.name}
              subtitle={`${selectedRespondent.gender} · ${selectedRespondent.age}세 · ${selectedRespondent.job}`}
            />
            <div style={{
              display: "flex", flexDirection: "column", gap: 8, padding: 8,
              borderRadius: 16, background: T.gray50,
            }}>
              {selectedRespondent.detail.tabs.map((t, i) => (
                <ModalField key={i} label={t.label} style={{ border: "none" }}>
                  {t.content}
                </ModalField>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
