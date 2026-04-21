import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  TextBlock,
  StrategyRoadmapTable,
} from "./report-components";
import { VBarChart, DonutChart, GroupedBarChart } from "./charts";

// ─── Data (JSON 원문 그대로) ────────────────────────────────────────────────

const ratingDistribution = [
  { label: "5점", value: 77.5, count: 775 },
  { label: "4점", value: 8.9, count: 89 },
  { label: "3점", value: 5.7, count: 57 },
  { label: "2점", value: 1.9, count: 19 },
  { label: "1점", value: 6.0, count: 60 },
];

const topicImpactData = [
  { label: "수납/용량 (29.5%)", 긍정: 97, 중립: 3, 부정: 0 },
  { label: "내구성 (41.5%)", 긍정: 95, 중립: 4, 부정: 1 },
  { label: "디자인/색상 (44.0%)", 긍정: 94, 중립: 3, 부정: 3 },
  { label: "가성비 (52.8%)", 긍정: 94, 중립: 4, 부정: 2 },
  { label: "바퀴/이동성 (49.4%)", 긍정: 94, 중립: 4, 부정: 2 },
  { label: "파손/내구성 (24.6%)", 긍정: 86, 중립: 5, 부정: 9 },
  { label: "지퍼/잠금장치 (26.5%)", 긍정: 84, 중립: 6, 부정: 10 },
  { label: "배송/CS (18.2%)", 긍정: 71, 중립: 10, 부정: 19 },
];

// JSON items 순서 그대로 (배송/CS → 지퍼/잠금장치 → 파손/내구성 → 기타)
// isOther: true → hatched (빗금) 패턴으로 렌더
const negativeBreakdown = [
  { id: "배송/CS", value: 44.3 },
  { id: "지퍼/잠금장치", value: 35.4 },
  { id: "파손/내구성", value: 39.2 },
  { id: "기타", value: 16.5, hatched: true },
];

const positiveBreakdown = [
  { id: "가성비", value: 57.2 },
  { id: "바퀴/이동성", value: 56.0 },
  { id: "디자인/색상", value: 48.4 },
  { id: "내구성", value: 45.6 },
  { id: "기타", value: 20.8, hatched: true },
];

export default function CoupangReviewReport() {
  return (
    <PageWrapper>
      {/* 상단 리포트 헤더 — title = meta.agentName */}
      <ContentHeader
        title="리뷰 데이터 분석 리포트 — 쿠팡 캐리어"
        style={{ marginBottom: 40 }}
      />

      <ReportPage>

        {/* Section 1: Executive Summary — headline → title, description 첫 문장 → SectionHeading.description, 나머지 → findings.items */}
        <div>
          <SectionHeading
            overline="Executive Summary"
            title="전체 만족도는 높지만, 소수 부정 리뷰가 배송/CS와 지퍼/잠금장치에 집중되어 있어 이 두 영역만 개선해도 부정률을 절반 줄일 수 있습니다"
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "총 리뷰", value: "1,000건" },
              { label: "평균 별점", value: "4.5 / 5.0" },
              { label: "부정 비율 (1-2점)", value: "7.9% (79건)" },
            ]}
            findings={{
              title: "Key Findings",
              items: [
                "쿠팡 캐리어 리뷰 1,000건을 별점·감성·영역별로 분석했습니다.",
                "평균 4.5점으로 전반적 만족도가 높고, 5점 리뷰가 77.5%를 차지합니다.",
                "가성비·디자인·바퀴 이동성이 만족의 핵심이며, 부정은 전체의 7.9%(79건)에 불과하지만 배송/CS(44%)와 지퍼/잠금장치(35%)에 집중됩니다.",
                "부정 리뷰 중 가장 많은 공감(598)을 받은 리뷰는 상세페이지와 실제 재질이 다르다는 내용으로, 제품 신뢰에 직접 영향을 미칩니다.",
                "배송 품질 관리와 지퍼/잠금장치 품질 검수를 강화하면 부정률을 절반 가까이 줄일 수 있습니다.",
              ],
            }}
          />
        </div>

        {/* Section 2: 리뷰 현황 */}
        <div>
          <SectionHeading
            overline="리뷰 현황"
            title="5점 리뷰가 77.5%로 압도적이며, 부정(1-2점)은 7.9%에 불과하지만 불만의 강도가 높습니다"
            description="4-5점이 86.4%로 전반적 만족도가 높습니다. 다만 1점 리뷰가 6.0%(60건)로 2점(1.9%)보다 3배 많아, 불만이 있으면 곧장 최저점을 주는 경향이 있습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <VBarChart
                  title="별점 분포"
                  data={ratingDistribution}
                  keys={["value"]}
                  indexBy="label"
                  height={320}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 3: 영역별 긍정/부정 — sectionName 변경 (이전 "영역별 감성 분석" → "영역별 긍정/부정") */}
        <div>
          <SectionHeading
            overline="영역별 긍정/부정"
            title="대부분 영역에서 긍정이 90% 이상이지만, 배송/CS(부정 19%)와 지퍼/잠금장치(부정 10%)는 눈에 띄게 낮습니다"
            description="가성비·디자인·바퀴·수납·내구성은 긍정이 94~97%로 매우 높습니다. 반면 배송/CS는 부정이 19%로 가장 높고, 지퍼/잠금장치도 10%로 다른 영역 대비 눈에 띕니다. 이 두 영역이 전체 부정의 대부분을 차지합니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <GroupedBarChart
                  title="영역별 감성 분포 (부정 영향이 큰 순서)"
                  stacked
                  data={topicImpactData}
                  keys={["부정", "중립", "긍정"]}
                  colors={["#FF6467", "#E6E7E9", "#7CCF00"]}
                  indexBy="label"
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4 + 5: 부정/긍정 심층 분석 — 좌우 가로 배치 (헤딩/본문 행 정렬) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridTemplateRows: "auto 1fr",
          columnGap: 16,
          rowGap: 0,
          alignItems: "stretch",
        }}>
          {/* 부정 심층 — 헤딩 (row 1, col 1) */}
          <SectionHeading
            overline="부정 심층 분석"
            title="부정 리뷰의 79%가 배송/CS·지퍼/잠금장치·파손/내구성 세 영역에 집중되며, 제품 자체보다 품질 관리와 배송 과정의 문제입니다"
            style={{ gridColumn: 1, gridRow: 1 }}
          />
          {/* 긍정 심층 — 헤딩 (row 1, col 2) */}
          <SectionHeading
            overline="긍정 심층 분석"
            title="긍정 리뷰의 57%가 가성비를 언급하며, 가격 대비 디자인·바퀴·수납이 만족의 핵심입니다"
            style={{ gridColumn: 2, gridRow: 1 }}
          />
          {/* 부정 심층 — 본문 (row 2, col 1) */}
          <ReportSection style={{ gridColumn: 1, gridRow: 2 }}>
            <SectionCard style={{ flex: 1 }}>
              <ContentCard padding={40}>
                <DonutChart title="부정 리뷰 영역별 비중" size={200} data={negativeBreakdown} legendPosition="bottom" />
              </ContentCard>
              <ContentCard style={{ flex: 1 }}>
                <TextBlock title="해석" bordered={false}>
                  부정 리뷰는 지퍼 고장·배송 파손·잠금장치 불량 등 한두 가지 결정적 문제에 집중하며, 교환/환불 경험과 함께 강한 부정을 표현합니다. 세 영역의 공통점은 제품 설계가 아니라 품질 관리 과정에서 발생하는 문제라는 점입니다 — 배송/CS는 배송 중 파손과 교환/환불 과정의 불편이 핵심이고, 지퍼/잠금장치는 초기 불량이 많아 출고 전 검수가 미흡한 것으로 보이며, 파손/내구성은 사용 직후 스크래치·깨짐이 발생하는 사례입니다.
                </TextBlock>
              </ContentCard>
            </SectionCard>
          </ReportSection>
          {/* 긍정 심층 — 본문 (row 2, col 2) */}
          <ReportSection style={{ gridColumn: 2, gridRow: 2 }}>
            <SectionCard style={{ flex: 1 }}>
              <ContentCard padding={40}>
                <DonutChart title="긍정 리뷰 영역별 비중" size={200} data={positiveBreakdown} legendPosition="bottom" />
              </ContentCard>
              <ContentCard style={{ flex: 1 }}>
                <TextBlock title="해석" bordered={false}>
                  긍정 리뷰는 가성비·디자인·바퀴·수납 등 여러 항목을 함께 언급하며, '이 가격에 이 정도면 충분하다'는 종합 만족이 핵심입니다. 세 영역 모두 이 가성비 인식 위에 성립합니다 — 가성비는 가격 대비 전반적 품질이 좋다는 종합 평가이고, 바퀴/이동성은 부드럽게 잘 굴러간다는 실사용 만족이며, 디자인/색상은 예쁜 외관과 색상 선택지가 만족의 요인입니다. 다만 가성비 기반 만족은 가격이 오르면 흔들릴 수 있어, 현재 가격대를 유지하는 것이 중요합니다.
                </TextBlock>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 6: 개선 로드맵 */}
        <div>
          <SectionHeading
            overline="개선 로드맵"
            title="배송 품질 관리와 지퍼/잠금장치 출고 검수를 강화하면, 부정률 7.9%를 4% 이하로 줄일 수 있습니다"
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <StrategyRoadmapTable periods={[
                  {
                    badge: "즉시", period: "1주 이내",
                    rows: [
                      {
                        strategy: "배송 포장 강화",
                        objective: "배송 중 파손(부정 리뷰의 44%)을 줄이기",
                        actionPlan: "모서리 보호재 추가\n캐리어 전용 배송 박스 적용",
                        expectedImpact: "배송/CS 관련 부정 비율 19%→8%",
                      },
                      {
                        strategy: "지퍼/잠금장치 출고 전 검수",
                        objective: "초기 불량(부정 리뷰의 35%)을 줄이기",
                        actionPlan: "지퍼 개폐·다이얼 잠금 동작 테스트를 출고 필수 항목에 추가",
                        expectedImpact: "지퍼/잠금장치 부정 비율 10%→3%",
                      },
                    ],
                  },
                  {
                    badge: "단기", period: "1개월 이내",
                    rows: [
                      {
                        strategy: "교환/환불 프로세스 개선",
                        objective: "불량 발생 시 CS 경험을 개선하여 부정 강도를 낮추기",
                        actionPlan: "불량 접수 시 즉시 교환 발송\n사진 확인만으로 교환 승인 (반품 먼저 요구하지 않기)",
                        expectedImpact: "CS 관련 부정 리뷰 강도 완화",
                      },
                      {
                        strategy: "상세페이지 재질 표기 정확성 확보",
                        objective: "공감 598 리뷰에서 지적된 재질 표기 문제를 해소",
                        actionPlan: "ABS·PC 혼합 비율을 정확히 표기\n실제 재질 사진 추가",
                        expectedImpact: "제품 신뢰 관련 부정 리뷰 감소",
                      },
                    ],
                  },
                  {
                    badge: "중기", period: "3개월 이내",
                    rows: [
                      {
                        strategy: "가성비 포지셔닝 유지",
                        objective: "긍정의 57%를 차지하는 가성비 인식을 유지",
                        actionPlan: "현재 가격대 유지하면서 품질 개선\n3년 AS 정책을 리뷰 유도에 활용",
                        expectedImpact: "전체 부정률 7.9%→4% 이하 달성",
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
