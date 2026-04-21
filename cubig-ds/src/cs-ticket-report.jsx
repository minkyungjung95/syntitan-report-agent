import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  TextBlock,
  DataTable,
  SignalCard,
  StrategyRoadmapTable,
} from "./report-components";
import { VBarChart, StackedHBar, LineChart } from "./charts";

// ─── Data (JSON 원문 그대로) ────────────────────────────────────────────────

const npsTrendData = [
  { id: "NPS", data: [
    { x: "1월", y: -20 },
    { x: "2월", y: -18 },
    { x: "3월", y: -16 },
  ]},
];

const resolutionTimeTrendData = [
  { id: "해결시간", data: [
    { x: "1월", y: 19.2 },
    { x: "2월", y: 18.4 },
    { x: "3월", y: 17.8 },
  ]},
];

// 카테고리별 비교 (DataTable: metric 행 + 5개 카테고리 컬럼)
// 기능 오류·결제/환불 두 컬럼은 highlight="red" 로 부정 강조 — 헤드라인의 핵심 메시지 시각화
const categoryColumns = [
  { key: "metric", label: "지표" },
  { key: "c0", label: "결제/환불", align: "center", highlight: "red" },
  { key: "c1", label: "기능 오류", align: "center", highlight: "red" },
  { key: "c2", label: "사용 방법", align: "center" },
  { key: "c3", label: "계정/인증", align: "center" },
  { key: "c4", label: "일반 문의", align: "center" },
];
const categoryData = [
  { metric: "건수",         c0: "380",      c1: "290",      c2: "240",      c3: "180",     c4: "110" },
  { metric: "비중",         c0: "31.7%",    c1: "24.2%",    c2: "20.0%",    c3: "15.0%",   c4: "9.1%" },
  { metric: "평균 해결시간", c0: "22.1시간", c1: "32.5시간", c2: "14.8시간", c3: "7.6시간", c4: "9.2시간" },
  { metric: "NPS",          c0: "-32",      c1: "-58",      c2: "-8",       c3: "+28",     c4: "+18" },
];

const slaItems = [
  { label: "기능 오류", value: 55, count: 160 },
  { label: "결제/환불", value: 35, count: 133 },
  { label: "사용 방법", value: 15, count: 36 },
  { label: "일반 문의", value: 8, count: 9 },
  { label: "계정/인증", value: 5, count: 9 },
];

// NPS 분포 — JSON categories=[추천자,중립,비추천자], colors=[green,gray,red]
// StackedHBar keys 순서를 [비추천자, 중립, 추천자] 로 두고 colors도 [red, gray, green] 매핑
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
        style={{ marginBottom: 40 }}
      />

      <ReportPage>

        {/* Section 1: Executive Summary */}
        <div>
          <SectionHeading
            overline="Executive Summary"
            title="고객 만족도가 낮은 건 인력 부족이 아니라 처리 구조 때문입니다"
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "총 티켓", value: "1,200건" },
              { label: "평균 NPS", value: "-18" },
              { label: "평균 해결시간", value: "17.8시간" },
            ]}
            findings={{
              title: "Key Findings",
              items: [
                "2026년 1~3월 CS 티켓 1,200건을 카테고리·해결시간·NPS 축으로 분석했습니다.",
                "기능 오류와 결제/환불 두 카테고리가 전체 NPS를 끌어내리고 있으며, 카테고리별로 SLA를 다르게 적용하면 회복할 수 있습니다.",
                "NPS는 -18로 마이너스 구간이고, 해결시간은 가장 짧은 카테고리(7.6시간)와 가장 긴 카테고리(32.5시간) 사이에 4배 이상 차이가 납니다.",
                "비추천자는 모든 카테고리에 있지만 정도가 다릅니다. 기능 오류(NPS -58)와 결제/환불(-32)이 전체를 끌어내리고, 계정/인증(+28)과 일반 문의(+18)는 상대적으로 나은 편입니다.",
                "해결시간이 길수록 만족도가 낮아지는 패턴이 일관되게 나타나며, 카테고리 특성과 무관하게 동일 기준으로 처리하는 구조가 근본 원인입니다.",
              ],
            }}
          />
        </div>

        {/* Section 2 + 3: 주요 지표 추이 — NPS 와 해결시간 두 LineChart 좌우 배치 */}
        <div>
          <SectionHeading
            overline="주요 지표 추이"
            title="NPS와 해결시간 모두 3개월간 정체 상태이며, 뚜렷한 개선 신호가 보이지 않습니다"
            description="3개월간 소폭 개선됐지만 핵심 문제는 달라지지 않았습니다. NPS는 -20에서 -16으로 회복했지만 여전히 마이너스 구간이고, 평균 해결시간이 17.8시간으로 줄었어도 카테고리 간 해결시간 4배 격차는 좁혀지지 않았습니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <ContentCard padding={40} style={{ flex: "1 1 380px", minWidth: 380 }}>
                  <LineChart title="월별 NPS 추이" variant="red" enableArea data={npsTrendData} />
                </ContentCard>
                <ContentCard padding={40} style={{ flex: "1 1 380px", minWidth: 380 }}>
                  <LineChart title="월별 평균 해결시간" variant="red" enableArea data={resolutionTimeTrendData} />
                </ContentCard>
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4: 카테고리 분석 — DataTable (테이블이라 description 은 SectionHeading 에) */}
        <div>
          <SectionHeading
            overline="카테고리 분석"
            title="기능 오류와 결제/환불이 전체 NPS를 끌어내리고, 나머지 카테고리와 86p 격차가 벌어집니다"
            description="전체 NPS 하락은 두 카테고리에 집중되어 있습니다. 기능 오류 NPS -58과 계정/인증 +28 사이에는 86p 격차가 있으며, 전체 티켓의 56%를 차지하는 이 두 카테고리가 전체 NPS를 끌어내리는 주요 원인입니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <DataTable columns={categoryColumns} data={categoryData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 5: SLA 위반 현황 — HBarChart (description 짧아서 SectionHeading 으로) */}
        <div>
          <SectionHeading
            overline="SLA 위반 현황"
            title="SLA 위반은 느린 카테고리에 집중되어 있고, 빠른 카테고리와 10배 차이가 납니다"
            description="SLA 위반은 두 카테고리에 쏠려 있습니다. 기능 오류 55%, 결제/환불 35%로 두 카테고리에서 위반이 집중되는 반면, 계정/인증과 일반 문의는 한 자릿수에 머물러 10배 이상 격차가 벌어집니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <VBarChart
                  title="카테고리별 SLA 위반율 (24h 초과 비율)"
                  data={slaItems}
                  keys={["value"]}
                  indexBy="label"
                  height={320}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 6: 처리 속도와 만족도 — StackedHBar (description 짧아서 SectionHeading 으로) */}
        <div>
          <SectionHeading
            overline="처리 속도와 만족도"
            title="모든 카테고리에 비추천자가 있지만, 처리 속도에 따라 비율이 크게 달라집니다"
            description="비추천자는 모든 카테고리에 있습니다. 다만 처리 속도에 따라 비율이 크게 달라지는데, 8시간 이내에 처리되는 계정/인증·일반 문의도 비추천자가 20~24%이고, 24시간을 넘기는 기능 오류·결제/환불은 56~68%까지 올라갑니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <StackedHBar
                  title="카테고리별 NPS 분포 (추천자/중립/비추천자)"
                  data={npsDistributionData}
                  keys={["비추천자", "중립", "추천자"]}
                  colors={["#FF6467", "#E6E7E9", "#7CCF00"]}
                  indexBy="label"
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 7: 근본 원인 — InsightCard 3개 가로 (3가지 구조적 문제) */}
        <div>
          <SectionHeading
            overline="근본 원인"
            title="카테고리 특성을 고려하지 않는 일괄 처리 구조가 문제의 출발점입니다"
            description="세 가지 구조적 문제가 겹치면서 현재 상황을 만들었습니다. 기능 오류·결제/환불이 전체를 끌어내리는 구조, 해결시간이 길수록 만족도가 떨어지는 패턴, 카테고리 특성과 무관한 일괄 SLA — 이 세 가지가 동시에 작용하고 있습니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
                <SignalCard
                  number={1}
                  variant="Negative"
                  title="기능 오류·결제/환불 두 카테고리가 전체 NPS를 끌어내림"
                  items={[
                    "첫째, 기능 오류와 결제/환불 두 카테고리가 전체 NPS를 끌어내리고 있습니다.",
                    "이 두 카테고리만 개선해도 전체 NPS가 회복될 수 있을 만큼 나머지와의 격차가 크며, 전담 자원이나 우선순위 체계가 없어 처리 지연과 SLA 위반이 누적되고 있습니다.",
                  ]}
                  bordered={false}
                />
                <SignalCard
                  number={2}
                  variant="Negative"
                  title="해결시간이 곧 만족도"
                  items={[
                    "둘째, 해결시간이 곧 만족도입니다.",
                    "모든 카테고리에서 해결시간이 길수록 NPS가 낮아지는 일관된 패턴이 나타나며, 일정 시간을 넘기면 만족도가 급격히 떨어집니다.",
                  ]}
                  bordered={false}
                />
                <SignalCard
                  number={3}
                  variant="Negative"
                  title="카테고리 특성과 무관한 일괄 SLA 적용"
                  items={[
                    "셋째, 카테고리마다 특성이 다른데 SLA는 동일하게 적용되고 있습니다.",
                    "해결시간이 4배 이상 차이 나는 카테고리들이 같은 큐에서 같은 순서로 처리되고 있어, 복잡한 카테고리일수록 SLA를 위반할 수밖에 없는 구조입니다.",
                  ]}
                  bordered={false}
                />
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 8: 개선 로드맵 — StrategyRoadmapTable */}
        <div>
          <SectionHeading
            overline="개선 로드맵"
            title="인력 증원 없이 구조 변경만으로 개선할 수 있습니다"
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <StrategyRoadmapTable periods={[
                  {
                    badge: "Immediate", period: "",
                    rows: [
                      {
                        strategy: "기능 오류·결제/환불 티켓에 우선 SLA 적용",
                        objective: "만족도가 가장 낮은 두 카테고리의 해결시간 단축",
                        actionPlan: "두 카테고리 접수 시 우선순위 자동 부여\n24시간 이내 처리 SLA 신설\n영업일 접수분은 당일 1차 응답",
                        expectedImpact: "두 카테고리 해결시간 절반 단축\nSLA 위반율 절반 감소\n전체 NPS 0선 회복",
                      },
                      {
                        strategy: "SLA 위반 임박 시 자동 알림",
                        objective: "위반이 발생하기 전에 대응할 수 있는 체계 구축",
                        actionPlan: "티켓별 잔여 SLA 실시간 추적\n8시간 도달 시 담당자 알림\n24시간 도달 시 팀장 자동 에스컬레이션",
                        expectedImpact: "SLA 위반 발생률 절반 감소\n결제/환불 NPS 개선",
                      },
                    ],
                  },
                  {
                    badge: "Short-term", period: "",
                    rows: [
                      {
                        strategy: "카테고리별 차등 SLA 도입",
                        objective: "카테고리 특성에 맞게 SLA를 재설계",
                        actionPlan: "일괄 SLA를 카테고리별 차등으로 전환\n단순 카테고리는 짧게, 복잡한 카테고리는 현실적 목표로 조정",
                        expectedImpact: "카테고리 간 격차 축소\n비추천자 비율 감소",
                      },
                      {
                        strategy: "장기 미해결 티켓 우선 정리",
                        objective: "쌓여 있는 미해결 티켓을 정리해 만족도 회복",
                        actionPlan: "72시간 초과 미해결 티켓 주간 추출\n카테고리별 담당팀에 배분\n매일 진척 확인",
                        expectedImpact: "미해결 티켓 절반 감소\n장기 미해결로 인한 만족도 저하 완화",
                      },
                    ],
                  },
                  {
                    badge: "Mid-term", period: "",
                    rows: [
                      {
                        strategy: "분기 단위 NPS·SLA 정기 모니터링",
                        objective: "개선된 지표가 다시 나빠지지 않도록 관리",
                        actionPlan: "분기별 NPS·해결시간·카테고리 격차 추적\nNPS 마이너스 전환 카테고리 발생 시 자동 알림\n원인 분석 프로세스 연동",
                        expectedImpact: "NPS 플러스 구간 안정 유지\n위기 카테고리 조기 감지",
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
