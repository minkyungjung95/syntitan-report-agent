import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  PersonaCard,
  TextBlock,
  StrategyRoadmapTable,
  ExecutiveSummaryCard,
} from "./report-components";
import { HBarChart, VBarChart } from "./charts";

// ─── Data Transforms ────────────────────────────────────────────────────────
// HBarChart 기본 색상 규칙에 따름 — 1번 Blue500, 2번 Lime500, 3번 이후 Gray200
const ratingDistribution = [
  { label: "5점", value: 77.5, count: 775 },
  { label: "4점", value: 8.9, count: 89 },
  { label: "3점", value: 5.7, count: 57 },
  { label: "2점", value: 1.9, count: 19 },
  { label: "1점", value: 6.0, count: 60 },
];

// 영역별 감성 (부정 영향이 큰 순서)
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

// 부정 리뷰 영역별 비중 (HBarChart — 각 영역의 % 언급률)
const negativeBreakdown = [
  { label: "배송/CS", value: 44.3, count: 35 },
  { label: "파손/내구성", value: 39.2, count: 31 },
  { label: "지퍼/잠금장치", value: 35.4, count: 28 },
  { label: "기타", value: 16.5, count: 13 },
];

// 긍정 리뷰 영역별 비중
const positiveBreakdown = [
  { label: "가성비", value: 57.2, count: 494 },
  { label: "바퀴/이동성", value: 56.0, count: 484 },
  { label: "디자인/색상", value: 48.4, count: 418 },
  { label: "내구성", value: 45.6, count: 394 },
  { label: "기타", value: 20.8, count: 180 },
];

export default function CoupangReviewReport() {
  return (
    <PageWrapper>
      <ReportPage>

        {/* Section 1: Executive Summary */}
        <ExecutiveSummaryCard
          title="Executive Summary"
          summaryItems={[
            { label: "총 리뷰", value: "1,000건" },
            { label: "평균 별점", value: "4.5 / 5.0" },
            { label: "5점 비율", value: "77.5% (775건)" },
            { label: "부정 비율 (1-2점)", value: "7.9% (79건)" },
          ]}
          findings={{
            title: "핵심 발견",
            items: [
              "평균 4.5점으로 전반적 만족도가 높고, 5점 리뷰가 77.5%로 압도적입니다.",
              "부정은 전체의 7.9%(79건)에 불과하지만 배송/CS(44%)와 지퍼/잠금장치(35%)에 집중됩니다.",
              "부정 리뷰 중 가장 많은 공감(598)을 받은 리뷰는 상세페이지와 실제 재질이 다르다는 내용으로, 제품 신뢰에 직접 영향을 미칩니다.",
              "가성비·디자인·바퀴 이동성이 만족의 핵심이며, 긍정의 57%가 가성비를 언급합니다.",
            ],
          }}
        />

        {/* Section 2: 리뷰 현황 — 별점 분포 */}
        <div>
          <SectionHeading
            title="5점 리뷰가 77.5%로 압도적, 부정은 7.9%지만 불만의 강도가 높습니다"
            description="4-5점이 86.4%로 전반적 만족도가 높습니다. 다만 1점 리뷰가 6.0%(60건)로 2점(1.9%)보다 3배 많아, 불만이 있으면 곧장 최저점을 주는 경향이 있습니다."
          />
          <ReportSection>
            <ContentHeader title="별점 분포" />
            <SectionCard>
              <ContentCard padding={40}>
                <HBarChart data={ratingDistribution} maxValue={100} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 3: 별점 분석 — 두 그룹의 리뷰 패턴 */}
        <div>
          <SectionHeading
            title="5점 리뷰는 평균 343자로 구체적, 1-2점 리뷰는 평균 148자로 짧고 강한 불만"
            description="긍정 리뷰는 여러 장점을 구체적으로 나열하는 반면, 부정 리뷰는 한두 가지 결정적 문제에 집중합니다. 특히 1점 리뷰 중 공감 598을 받은 리뷰가 있어, 소수 부정이라도 다른 구매자에게 미치는 영향이 큽니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={24}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <PersonaCard
                    name="여러 장점을 구체적으로 나열하는 사람들"
                    subtitle="4-5점 그룹 (864건, 86.4%)"
                    metrics={[
                      { key: "평균 리뷰 길이", value: "327자" },
                      { key: "공통 언급", value: "가성비·디자인·바퀴" },
                      { key: "핵심 감정", value: "종합 만족" },
                    ]}
                  />
                  <PersonaCard
                    name="한두 가지 결정적 문제에 집중하는 사람들"
                    subtitle="1-2점 그룹 (79건, 7.9%)"
                    metrics={[
                      { key: "평균 리뷰 길이", value: "148자" },
                      { key: "공통 언급", value: "지퍼·배송·잠금장치" },
                      { key: "핵심 감정", value: "교환/환불 불만" },
                    ]}
                  />
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4: 영역별 감성 분석 — StackedBar */}
        <div>
          <SectionHeading
            title="배송/CS(부정 19%)와 지퍼/잠금장치(부정 10%)가 다른 영역 대비 눈에 띄게 낮습니다"
            description="가성비·디자인·바퀴·수납·내구성은 긍정이 94~97%로 매우 높습니다. 반면 배송/CS는 부정이 19%로 가장 높고, 지퍼/잠금장치도 10%로 다른 영역 대비 눈에 띕니다. 이 두 영역이 전체 부정의 대부분을 차지합니다."
          />
          <ReportSection>
            <ContentHeader title="영역별 감성 분포 (부정 영향이 큰 순서)" />
            <SectionCard>
              <ContentCard padding={40}>
                <VBarChart
                  stacked={true}
                  data={topicImpactData}
                  keys={["긍정", "중립", "부정"]}
                  indexBy="label"
                  height={400}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 5: 부정 심층 분석 */}
        <div>
          <SectionHeading
            title="부정 리뷰의 79%가 배송/CS·지퍼/잠금장치·파손/내구성 세 영역에 집중"
            description="세 영역의 공통점은 제품 설계가 아니라 품질 관리 과정에서 발생하는 문제라는 점입니다. 배송/CS는 배송 중 파손과 교환/환불 과정의 불편이 핵심이고, 지퍼/잠금장치는 초기 불량이 많아 출고 전 검수가 미흡한 것으로 보이며, 파손/내구성은 사용 직후 스크래치·깨짐이 발생하는 사례입니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <HBarChart
                  title="부정 리뷰 영역별 언급 비율"
                  data={negativeBreakdown}
                  maxValue={100}
                />
              </ContentCard>
              <ContentCard>
                <TextBlock title="해석" bordered={false}>
                  배송/CS(44.3%, 35건)는 배송 중 파손과 교환·환불 과정의 불편이 핵심이고, 파손/내구성(39.2%, 31건)은 사용 직후 스크래치·깨짐이 발생하는 사례, 지퍼/잠금장치(35.4%, 28건)는 초기 불량이 많아 출고 전 검수가 미흡한 것으로 보입니다. 세 영역 모두 제품 설계가 아닌 품질 관리 과정의 문제이므로, 검수·포장 개선으로 빠르게 효과를 볼 수 있습니다.
                </TextBlock>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 6: 긍정 심층 분석 */}
        <div>
          <SectionHeading
            title="긍정 리뷰의 57%가 가성비를 언급, 가격 대비 디자인·바퀴·수납이 만족의 핵심"
            description="세 영역 모두 '이 가격에 이 정도면 충분하다'는 가성비 인식 위에 성립합니다. 다만 가성비 기반 만족은 가격이 오르면 흔들릴 수 있어, 현재 가격대를 유지하는 것이 중요합니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <HBarChart
                  title="긍정 리뷰 영역별 언급 비율"
                  data={positiveBreakdown}
                  maxValue={100}
                />
              </ContentCard>
              <ContentCard>
                <TextBlock title="해석" bordered={false}>
                  가성비(57.2%, 494건)는 가격 대비 전반적 품질이 좋다는 종합 평가이고, 바퀴/이동성(56.0%, 484건)은 부드럽게 잘 굴러간다는 실사용 만족이며, 디자인/색상(48.4%, 418건)은 예쁜 외관과 색상 선택지가 만족의 요인입니다. 현재 가격대를 유지하면서 품질을 개선하면 긍정 요인을 지킬 수 있습니다.
                </TextBlock>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 7: 개선 로드맵 */}
        <div>
          <SectionHeading
            title="배송 품질 관리와 지퍼/잠금장치 출고 검수 강화로 부정률 7.9% → 4% 이하"
            description="부정의 대부분이 제품 설계가 아닌 품질 관리 과정에서 발생하므로, 출고 전 검수와 배송 포장을 개선하면 빠르게 효과를 볼 수 있습니다. 현재 가성비·디자인·바퀴 등 긍정 요인은 유지하면서 부정만 줄이는 방향입니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <StrategyRoadmapTable periods={[
                  {
                    badge: "Immediate", period: "1-2주 내",
                    rows: [
                      {
                        strategy: "배송 포장 강화",
                        objective: "배송 중 파손(부정 리뷰의 44%)을 줄이기",
                        actionPlan: "모서리 보호재 추가, 캐리어 전용 배송 박스 적용",
                        expectedImpact: "배송/CS 부정 비율 19% → 8%",
                      },
                      {
                        strategy: "지퍼/잠금장치 출고 전 검수",
                        objective: "초기 불량(부정 리뷰의 35%)을 줄이기",
                        actionPlan: "지퍼 개폐·다이얼 잠금 동작 테스트를 출고 필수 항목에 추가",
                        expectedImpact: "지퍼/잠금장치 부정 비율 10% → 3%",
                      },
                    ],
                  },
                  {
                    badge: "Short-term", period: "1-3개월",
                    rows: [
                      {
                        strategy: "교환/환불 프로세스 개선",
                        objective: "불량 발생 시 CS 경험을 개선하여 부정 강도를 낮추기",
                        actionPlan: "불량 접수 시 즉시 교환 발송, 사진 확인만으로 교환 승인",
                        expectedImpact: "CS 관련 부정 리뷰 강도 완화",
                      },
                      {
                        strategy: "상세페이지 재질 표기 정확성 확보",
                        objective: "공감 598 리뷰에서 지적된 재질 표기 문제를 해소",
                        actionPlan: "ABS·PC 혼합 비율을 정확히 표기, 실제 재질 사진 추가",
                        expectedImpact: "제품 신뢰 관련 부정 리뷰 감소",
                      },
                    ],
                  },
                  {
                    badge: "Mid-term", period: "3-6개월",
                    rows: [
                      {
                        strategy: "가성비 포지셔닝 유지",
                        objective: "긍정의 57%를 차지하는 가성비 인식을 유지",
                        actionPlan: "현재 가격대 유지하면서 품질 개선, 3년 AS 정책을 리뷰 유도에 활용",
                        expectedImpact: "전체 부정률 7.9% → 4% 이하 달성",
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
