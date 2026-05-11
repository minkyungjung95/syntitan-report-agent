import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  DataTable,
  SignalCard,
  StrategyRoadmapTable,
} from "./report-components";
import { GroupedBarChart, LineChart, ComboChart, VBarChart, CHART_COLORS } from "./charts";
import { DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CsTicketReport — 고객센터 티켓 분석 리포트
 *
 *  FE 핸드오프 가이드 (개발자 폴더 구조 권장):
 *    src/components/report/CsTicketReport/
 *      ├── index.tsx                       ← 메인 (이 파일의 CsTicketReport)
 *      ├── ExecutiveSummary.tsx            ← (Section 1) 총괄 요약 + Key Findings
 *      ├── KpiTrend.tsx                    ← (Section 2+3) NPS·처리시간 LineChart 2개
 *      ├── CategoryAnalysis.tsx            ← (Section 4) 카테고리 ComboChart
 *      ├── ChannelAnalysis.tsx             ← (Section 5) 채널 VBarChart 3개
 *      ├── SatisfactionDistribution.tsx    ← (Section 6) 카테고리별 만족도 StackedBar
 *      ├── RootCauseSignals.tsx            ← (Section 7) 근본 원인 SignalCard 3개
 *      └── StrategyRoadmap.tsx             ← (Section 8) 개선 로드맵
 *
 *  데이터 소스: public/json/customer-support.json (또는 인라인 데이터)
 *  공통 컴포넌트: ContentHeader / SectionHeading / ExecutiveSummaryCard / SectionCard /
 *                SignalCard / StrategyRoadmapTable / LineChart / ComboChart / VBarChart / DataTable
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── Data (JSON 원문 그대로) ────────────────────────────────────────────────

const npsTrendData = [
  { id: "NPS", data: [
    { x: "1월", y: -20 },
    { x: "2월", y: -18 },
    { x: "3월", y: -16 },
  ]},
];

const resolutionTimeTrendData = [
  { id: "처리시간", data: [
    { x: "1월", y: 19.2 },
    { x: "2월", y: 18.4 },
    { x: "3월", y: 17.8 },
  ]},
];

// 카테고리 분석 — ComboChart (bar=처리시간, line=NPS): 처리시간 길수록 NPS 낮아지는 상관관계
// 처리시간 내림차순 정렬
const categoryComboData = [
  { label: "기능 오류", bar: 32.5, line: -58 },
  { label: "결제/환불", bar: 22.1, line: -32 },
  { label: "사용 방법", bar: 14.8, line: -8  },
  { label: "일반 문의", bar: 9.2,  line: 18  },
  { label: "계정/인증", bar: 7.6,  line: 28  },
];

// 카테고리 분석 상세 테이블 — 카테고리 행 + 지표 컬럼
const isTopNegativeCategory = (row) => row.category === "결제/환불" || row.category === "기능 오류";
const categoryColumns = [
  { key: "category", label: "카테고리" },
  { key: "count",    label: "건수",          align: "center" },
  { key: "share",    label: "비중",          align: "center" },
  { key: "time",     label: "평균 처리시간",  align: "center", highlight: "red", highlightWhen: isTopNegativeCategory },
  { key: "delay",    label: "24h 초과 지연율", align: "center" },
  { key: "nps",      label: "NPS",           align: "center", highlight: "red", highlightWhen: isTopNegativeCategory },
];
const categoryData = [
  { category: "결제/환불", count: "380", share: "31.7%", time: "22.1시간", delay: "35%", nps: "-32" },
  { category: "기능 오류", count: "290", share: "24.2%", time: "32.5시간", delay: "55%", nps: "-58" },
  { category: "사용 방법", count: "240", share: "20.0%", time: "14.8시간", delay: "15%", nps: "-8"  },
  { category: "계정/인증", count: "180", share: "15.0%", time: "7.6시간",  delay: "5%",  nps: "+28" },
  { category: "일반 문의", count: "110", share: "9.1%",  time: "9.2시간",  delay: "8%",  nps: "+18" },
];

// 채널 분석 — 처리시간 + 지연율 + NPS 세 VBarChart (NPS 차트 기본 팔레트와 통일)
// 순서: 이메일 → 앱 → 채팅 → 전화 — 모든 차트 동일
const channelTimeData = [
  { label: "이메일", value: 28 },
  { label: "앱",    value: 18 },
  { label: "채팅",  value: 8  },
  { label: "전화",  value: 3  },
];
const channelNpsData = [
  { label: "이메일", value: -35 },
  { label: "앱",    value: -10 },
  { label: "채팅",  value: 12  },
  { label: "전화",  value: 18  },
];

// 채널 분석 상세 테이블 — 채널 행(색상 스와치 포함) + 지표 컬럼
const isAsyncChannel = (row) => row.channelName === "이메일" || row.channelName === "앱";
const channelSwatch = (name, color) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
    <span>{name}</span>
  </div>
);
const channelColumns = [
  { key: "channel", label: "채널" },
  { key: "count",   label: "건수",           align: "center" },
  { key: "share",   label: "비중",           align: "center" },
  { key: "time",    label: "평균 처리시간",   align: "center", highlight: "red", highlightWhen: isAsyncChannel },
  { key: "delay",   label: "24h 초과 지연율", align: "center" },
  { key: "nps",     label: "NPS",            align: "center", highlight: "red", highlightWhen: isAsyncChannel },
];
const channelData = [
  { channelName: "이메일", channel: channelSwatch("이메일", CHART_COLORS[0]), count: "420", share: "35.0%", time: "28시간", delay: "65%", nps: "-35" },
  { channelName: "앱",    channel: channelSwatch("앱",    CHART_COLORS[1]), count: "120", share: "10.0%", time: "18시간", delay: "52%", nps: "-10" },
  { channelName: "채팅",  channel: channelSwatch("채팅",  CHART_COLORS[2]), count: "360", share: "30.0%", time: "8시간",  delay: "18%", nps: "+12" },
  { channelName: "전화",  channel: channelSwatch("전화",  CHART_COLORS[3]), count: "300", share: "25.0%", time: "3시간",  delay: "8%",  nps: "+18" },
];

// NPS 분포 — 전체 → 긍정 → 부정 순
const npsDistributionData = [
  { label: "전체",       추천자: 26, 중립: 30, 비추천자: 44 },
  { label: "계정/인증",   추천자: 48, 중립: 32, 비추천자: 20 },
  { label: "일반 문의",   추천자: 42, 중립: 34, 비추천자: 24 },
  { label: "사용 방법",   추천자: 30, 중립: 32, 비추천자: 38 },
  { label: "결제/환불",   추천자: 16, 중립: 28, 비추천자: 56 },
  { label: "기능 오류",   추천자: 10, 중립: 22, 비추천자: 68 },
];

export default function CsTicketReport() {
  return (
    <PageWrapper>
      <ContentHeader
        title="고객 문의/티켓 분석"
        description="최근 3개월 CS 티켓 1,200건을 카테고리·해결시간·NPS 축으로 분석했습니다."
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text="Sample_ticket_data.csv"
              leadingIcon={<DatabaseIcon size={14} color="#7B7E85" />}
            />
            <Badge type="Outline" variant="Secondary" size="Large" text="Version 1" />
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
            title="만족도 하락의 원인은 인력 부족이 아니라 카테고리 특성을 무시한 일괄 처리이며, 구조만 바꿔도 회복할 수 있습니다"
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "총 티켓", value: "1,200건" },
              { label: "평균 NPS", value: "-18" },
              { label: "평균 처리시간", value: "17.8시간" },
            ]}
            findings={{
              title: "Key Findings",
              items: [
                "2026년 1~3월 CS 티켓 1,200건을 분석한 결과 전체 NPS는 -18로 마이너스 구간에 머물러 있습니다.",
                "기능 오류·결제/환불 두 카테고리와 비동기 채널(이메일·앱)에서 처리 지연과 불만이 집중됩니다.",
                "카테고리 특성과 무관하게 동일한 SLA를 적용하는 구조가 근본 원인입니다.",
                "두 카테고리에 우선 SLA를 적용하고 카테고리별 차등 SLA로 전환하면 추가 인력 없이도 NPS를 플러스로 바꿀 수 있습니다.",
              ],
            }}
          />
        </div>

        {/* Section 2 + 3: 주요 지표 추이 — NPS 와 처리시간 두 LineChart 좌우 배치 */}
        <div>
          <SectionHeading
            overline="주요 지표 추이"
            title="NPS와 처리시간 모두 3개월간 정체 상태로, 소폭 개선은 있으나 구조적 변화는 없습니다"
            description="NPS는 -20에서 -16으로 회복 중이나 여전히 0 기준선 아래에 머물러 있고, 평균 처리시간도 19.2시간에서 17.8시간으로 1.4시간만 줄었을 뿐입니다. 카테고리별 처리시간 편차도 최대 4배 수준 그대로입니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <ContentCard padding={40} style={{ flex: "1 1 380px", minWidth: 380 }}>
                  <LineChart
                    title="월별 NPS 추이"
                    variant="blue"
                    enableArea
                    metricType="nps"
                    data={npsTrendData}
                  />
                </ContentCard>
                <ContentCard padding={40} style={{ flex: "1 1 380px", minWidth: 380 }}>
                  <LineChart
                    title="월별 평균 처리시간"
                    variant="blue"
                    enableArea
                    metricType="time"
                    valueSuffix="시간"
                    data={resolutionTimeTrendData}
                  />
                </ContentCard>
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4: 카테고리 분석 — ComboChart (처리시간 bar + NPS line) */}
        <div>
          <SectionHeading
            overline="카테고리 분석"
            title="기능 오류와 결제/환불 두 카테고리가 전체 NPS를 끌어내리고 있으며, 지연율도 다른 카테고리보다 3~7배 높습니다"
            description="전체 NPS 하락을 두 카테고리가 주도합니다. 기능 오류가 처리시간·지연율·NPS 모든 지표에서 가장 심각하고, 결제/환불이 그 뒤를 잇습니다. 두 카테고리가 전체 티켓의 56%를 차지하면서 처리 지연과 만족도 하락의 주요 원인입니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <ComboChart
                  title="카테고리별 평균 처리시간 vs NPS"
                  data={categoryComboData}
                  barKey="bar"
                  lineKey="line"
                  barLabel="평균 처리시간(h)"
                  lineLabel="NPS"
                  barAxisLabel="평균 처리시간"
                  lineAxisLabel="NPS"
                />
              </ContentCard>
              <ContentCard padding={0}>
                <DataTable columns={categoryColumns} data={categoryData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 5: 채널 분석 — 3 VBarCharts (처리시간 / 지연율 / NPS) */}
        <div>
          <SectionHeading
            overline="채널 분석"
            title="비동기 채널(이메일·앱)의 처리시간이 실시간 채널(전화·채팅)보다 3~9배 길고 NPS도 마이너스입니다"
            description="실시간 채널인 전화·채팅은 접수 즉시 응대되어 처리시간이 3~8시간으로 짧고 NPS도 플러스입니다. 반면 비동기 채널인 이메일·앱은 답변 우선순위가 낮아지면서 처리시간이 18~28시간으로 길어지고 NPS가 마이너스입니다. 이메일의 지연율 65%가 채널 중 가장 높아 개선 효과가 가장 큰 지점입니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
                    <div style={{ flex: "1 1 0", minWidth: 0 }}>
                      <VBarChart
                        title="채널별 평균 처리시간"
                        valueFormat={(v) => `${v}h`}
                        data={channelTimeData}
                        keys={["value"]}
                        indexBy="label"
                        height={280}
                        hideLegend
                      />
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: 0 }}>
                      <VBarChart
                        title="채널별 NPS"
                        data={channelNpsData}
                        keys={["value"]}
                        indexBy="label"
                        height={280}
                        hideLegend
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    {channelTimeData.map((d, i) => (
                      <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span style={{ fontSize: 12, color: "#1F1F1F" }}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContentCard>
              <ContentCard padding={0}>
                <DataTable columns={channelColumns} data={channelData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 6: 카테고리별 만족도 분포 — StackedBar */}
        <div>
          <SectionHeading
            overline="카테고리별 만족도 분포"
            title="처리가 빠른 카테고리는 비추천자가 20%대, 처리가 느린 카테고리는 60% 이상으로 2~3배 차이가 납니다"
            description="비추천자는 모든 카테고리에 있지만, 처리 속도에 따라 비율이 크게 달라집니다. 처리시간이 10시간 이내인 계정/인증·일반 문의는 비추천자가 20~24%에 그치는 반면, 22시간 이상 걸리는 기능 오류·결제/환불은 56~68%까지 올라갑니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <GroupedBarChart
                  title="카테고리별 NPS 분포 (추천자/중립/비추천자)"
                  stacked
                  valueSuffix="%"
                  data={npsDistributionData}
                  keys={["비추천자", "중립", "추천자"]}
                  colors={["#FF6467", "#E6E7E9", "#7CCF00"]}
                  indexBy="label"
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 7: 근본 원인 — 3개 SignalCard */}
        <div>
          <SectionHeading
            overline="근본 원인"
            title="카테고리 특성을 고려하지 않는 일괄 처리 구조가 근본 원인입니다"
            description="두 카테고리(기능 오류·결제/환불)에 쏠린 불만, 처리시간이 길수록 만족도가 떨어지는 패턴, 카테고리 특성을 무시한 일괄 SLA 세 가지 원인이 맞물려 있습니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
                <SignalCard
                  number={1}
                  title="기능 오류와 결제/환불 두 카테고리가 전체 NPS를 끌어내리고 있습니다."
                  items={[
                    "두 카테고리만 개선해도 전체 NPS가 회복될 만큼 나머지와 격차가 크며,두 카테고리만 개선해도 전체 NPS가 회복될 만큼 나머지와 격차가 큽니다.",
                    "전담 자원과 우선순위 체계가 없어 처리 지연이 만족도 하락으로 이어집니다.",
                  ]}
                  bordered={false}
                />
                <SignalCard
                  number={2}
                  title="처리시간이 곧 만족도입니다."
                  items={[
                    "모든 카테고리에서 처리시간이 길수록 NPS가 낮아지는 패턴이 반복됩니다.",
                    "처리시간이 22시간을 넘어가면 비추천자 비율이 56~68%까지 급격히 올라갑니다.",
                  ]}
                  bordered={false}
                />
                <SignalCard
                  number={3}
                  title="카테고리마다 특성이 다른데 SLA는 동일하게 적용되고 있습니다."
                  items={[
                    "처리시간이 4배 이상 차이 나는 카테고리들이 공통 대기열에서 동일한 순서로 처리됩니다.",
                    "복잡한 카테고리일수록 처리가 늦어지고 있습니다.",
                  ]}
                  bordered={false}
                />
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 7: 개선 로드맵 — StrategyRoadmapTable */}
        <div>
          <SectionHeading
            overline="개선 로드맵"
            title="두 카테고리 우선 처리와 카테고리별 차등 SLA만으로 NPS를 -18에서 0 이상으로 회복할 수 있습니다"
            description="기능 오류·결제/환불에 우선 SLA를 적용해 단기적으로 개선한 후, 카테고리별 차등 SLA로 전체 격차를 좁히면 NPS를 플러스로 바꿀 수 있습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <StrategyRoadmapTable periods={[
                  {
                    badge: "즉시", period: "1주 이내",
                    rows: [
                      {
                        strategy: "기능 오류·결제/환불 티켓에 우선 SLA 적용",
                        objective: "만족도가 가장 낮은 두 카테고리의 처리시간을 단축",
                        actionPlan: "두 카테고리 접수 시 우선순위 자동 부여\n24시간 이내 처리 SLA 신설\n영업일 접수분은 당일 1차 응답",
                        expectedImpact: "두 카테고리의 처리시간을 절반으로 단축\n지연율을 절반으로 감소\n전체 NPS를 0선까지 회복",
                      },
                      {
                        strategy: "SLA 위반 임박 시 자동 알림",
                        objective: "SLA 위반 전에 대응할 수 있는 체계를 구축",
                        actionPlan: "티켓별 잔여 SLA 실시간 추적\n8시간 도달 시 담당자 알림\n24시간 도달 시 팀장 자동 에스컬레이션",
                        expectedImpact: "지연 발생률을 절반으로 감소\n결제/환불 NPS 개선",
                      },
                    ],
                  },
                  {
                    badge: "단기", period: "1개월 이내",
                    rows: [
                      {
                        strategy: "카테고리별 차등 SLA 도입",
                        objective: "카테고리 특성에 맞게 SLA를 재설계",
                        actionPlan: "일괄 SLA를 카테고리별 차등으로 전환\n단순 카테고리는 짧은 SLA로, 복잡한 카테고리는 현실적 목표로 조정",
                        expectedImpact: "카테고리 간 격차를 축소\n비추천자 비율을 감소",
                      },
                      {
                        strategy: "장기 미해결 티켓 우선 정리",
                        objective: "쌓여 있는 미해결 티켓을 정리해 만족도를 회복",
                        actionPlan: "72시간 초과 미해결 티켓 주간 추출\n카테고리별 담당팀에 배분\n매일 진척도 확인",
                        expectedImpact: "미해결 티켓을 절반으로 감소\n장기 미해결로 인한 만족도 저하를 완화",
                      },
                    ],
                  },
                  {
                    badge: "중기", period: "3개월 이내",
                    rows: [
                      {
                        strategy: "분기 단위 NPS·지연율 정기 모니터링",
                        objective: "개선된 지표가 다시 나빠지지 않도록 관리",
                        actionPlan: "분기별 NPS·처리시간·카테고리 격차 추적\nNPS 마이너스 전환 카테고리 발생 시 자동 알림\n원인 분석 프로세스와 연동",
                        expectedImpact: "NPS 플러스 구간을 안정적으로 유지\n악화된 카테고리를 조기에 감지",
                      },
                    ],
                  },
                ]} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

      </ReportPage>
    </PageWrapper>
  );
}
