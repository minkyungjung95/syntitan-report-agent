import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  TextBlock,
  DataTable,
  UserCard,
  StrategyRoadmapTable,
} from "./report-components";
import { VBarChart, HBarChart, GroupedBarChart } from "./charts";
import { StarRateFilledIcon, DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

// ─── Data (sample-coupang.json 원문) ────────────────────────────────────────

const TOTAL_REVIEWS = 1000;

const ratingDistribution = [
  { label: "1점", value: 6.0, count: 60 },
  { label: "2점", value: 1.9, count: 19 },
  { label: "3점", value: 5.7, count: 57 },
  { label: "4점", value: 8.9, count: 89 },
  { label: "5점", value: 77.5, count: 775 },
];

// 부정 영향이 큰 순서 (내림차순)
const topicImpactData = [
  { label: "배송/CS (18.2%)", 긍정: 71, 중립: 10, 부정: 19 },
  { label: "지퍼/잠금장치 (26.5%)", 긍정: 84, 중립: 6, 부정: 10 },
  { label: "파손/내구성 (24.6%)", 긍정: 86, 중립: 5, 부정: 9 },
  { label: "디자인/색상 (44.0%)", 긍정: 94, 중립: 3, 부정: 3 },
  { label: "가성비 (52.8%)", 긍정: 94, 중립: 4, 부정: 2 },
  { label: "바퀴/이동성 (49.4%)", 긍정: 94, 중립: 4, 부정: 2 },
  { label: "내구성 (41.5%)", 긍정: 95, 중립: 4, 부정: 1 },
  { label: "수납/용량 (29.5%)", 긍정: 97, 중립: 3, 부정: 0 },
];

// 부정 리뷰 중 각 영역 언급률 (기타는 맨 아래 hatched)
const negativeBreakdown = [
  { id: "배송/CS", value: 44.3, count: 35 },
  { id: "파손/내구성", value: 39.2, count: 31 },
  { id: "지퍼/잠금장치", value: 35.4, count: 28 },
  { id: "기타", value: 16.5, count: 13, hatched: true },
];

// 긍정 리뷰 중 각 영역 언급률
const positiveBreakdown = [
  { id: "가성비", value: 57.2, count: 494 },
  { id: "바퀴/이동성", value: 56.0, count: 484 },
  { id: "디자인/색상", value: 48.4, count: 418 },
  { id: "내구성", value: 45.6, count: 394 },
  { id: "기타", value: 20.8, count: 180, hatched: true },
];

export default function CoupangReviewReport() {
  return (
    <PageWrapper>
      <ContentHeader
        title="리뷰 데이터 분석 리포트 — 쿠팡 캐리어"
        description="쿠팡 캐리어 리뷰 1,000건을 별점·감성·영역별로 분석했습니다."
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text="Sample_voc_data.csv"
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
            title="전체 만족도는 높지만, 소수 부정 리뷰가 배송/CS와 지퍼/잠금장치에 집중되어 있어 이 두 영역만 개선해도 부정률을 절반 줄일 수 있습니다"
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "총 리뷰", value: "1,000건" },
              { label: "평균 별점", value: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <StarRateFilledIcon size={24} color="#2B7FFF" />
                  4.5<span style={{ fontWeight: 400, color: "#7B7E85" }}> / 5.0</span>
                </span>
              ) },
            ]}
            findings={{
              title: "Key Findings",
              items: [
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
                  colors={["#DBEAFE", "#BEDBFF", "#8EC5FF", "#51A2FF", "#2B7FFF"]}
                  valueFormat={(v) => `${v}%`}
                  data={ratingDistribution}
                  keys={["value"]}
                  indexBy="label"
                  height={320}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 3: 영역별 긍정/부정 */}
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
                  subtitle="영역별로 100% 환산한 비율"
                  stacked
                  valueSuffix="%"
                  data={topicImpactData}
                  keys={["부정", "중립", "긍정"]}
                  colors={["#FF6467", "#E6E7E9", "#7CCF00"]}
                  indexBy="label"
                />
              </ContentCard>
              <ContentCard padding={0}>
                <DataTable
                  columns={[
                    { key: "area", label: "영역", align: "center" },
                    { key: "share", label: "전체 리뷰 비중", align: "center", divider: true, width: "18%" },
                    { key: "positive", label: "긍정", align: "center", width: "18%", divider: true, highlight: "green", highlightWhen: (row) => {
                      const top2 = [...topicImpactData].sort((a,b) => b.긍정 - a.긍정).slice(0, 2).map(x => x.긍정);
                      return top2.includes(row.posRaw);
                    } },
                    { key: "neutral",  label: "중립", align: "center", width: "18%", divider: true },
                    { key: "negative", label: "부정", align: "center", width: "18%", divider: true, highlight: "red", highlightWhen: (row) => {
                      const top2 = [...topicImpactData].sort((a,b) => b.부정 - a.부정).slice(0, 2).map(x => x.부정);
                      return top2.includes(row.negRaw);
                    } },
                  ]}
                  data={topicImpactData.map((d) => {
                    const m = d.label.match(/^(.*?)\s*\(([\d.]+)%\)\s*$/);
                    const pct = m ? Number(m[2]) : null;
                    const count = pct != null ? Math.round(TOTAL_REVIEWS * pct / 100) : null;
                    return {
                      area: m ? m[1] : d.label,
                      share: pct != null ? `${pct}% (${count.toLocaleString()}건)` : "-",
                      positive: `${d.긍정}%`,
                      neutral: `${d.중립}%`,
                      negative: `${d.부정}%`,
                      posRaw: d.긍정,
                      negRaw: d.부정,
                    };
                  })}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4 + 5: 부정/긍정 심층 분석 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gridTemplateRows: "auto 1fr",
          gridAutoRows: "auto 1fr",
          columnGap: 24,
          rowGap: 24,
        }}>
          {/* 부정 심층 */}
          <div style={{ display: "grid", gridTemplateRows: "subgrid", gridRow: "span 2", rowGap: 0, alignItems: "stretch" }}>
            <SectionHeading
              overline="부정 심층 분석"
              title="부정 리뷰 대부분이 배송/CS(44%)·지퍼/잠금장치(35%)·파손/내구성(39%) 세 영역에 집중되며, 제품 설계보다 품질 관리와 배송 과정의 문제입니다"
              style={{ paddingLeft: 8, paddingRight: 20 }}
            />
            <ReportSection>
              <SectionCard style={{ flex: 1 }}>
                <ContentCard padding={40}>
                  <HBarChart
                    title="부정 리뷰 중 각 영역 언급률"
                    valueInside
                    minRows={positiveBreakdown.length}
                    data={negativeBreakdown.map((d) => ({ label: d.id, value: d.value, count: d.count, color: d.hatched ? "#E6E7E9" : undefined }))}
                  />
                </ContentCard>
                <ContentCard style={{ flex: 1 }}>
                  <TextBlock title="해석" bordered={false}>
                    영역별로 보면 배송/CS는 배송 중 파손과 교환/환불 과정의 불편이 핵심이고, 지퍼/잠금장치는 초기 불량이 많아 출고 전 검수가 미흡한 것으로 보이며, 파손/내구성은 사용 직후 스크래치·깨짐이 발생하는 사례입니다.
                  </TextBlock>
                </ContentCard>
                <ContentCard padding={0}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <UserCard
                      type="quote"
                      sentiment="negative"
                      name="배송/CS"
                      subtitle="1점 · 공감 598"
                      quote="이렇게 대놓고 소비자를 우롱하는 상세페이지에 솔직히 놀랐습니다. 막상 받아보니 실물은 단 0.00001mg 의 PC소재가 함유되어있지않은 저가형 순수 ABS 덩어리입니다."
                    />
                    <UserCard
                      type="quote"
                      sentiment="negative"
                      name="파손/내구성"
                      subtitle="1점 · 공감 30"
                      quote="짐을 반정도 밖에 채우지 않았는데 저절로 캐리어 외벽이 갈라져버리네요. 구매후 처음 사용한건데 정말 당황스러웠습니다."
                    />
                    <UserCard
                      type="quote"
                      sentiment="negative"
                      name="지퍼/잠금장치"
                      subtitle="1점 · 공감 63"
                      quote="해외여행에서 3일째 되는 날 비밀번호 바꾸지도 않았는데 갑자기 안 열렸습니다. 캐리어 안에 여권이 있어 여행지에서 이러지도 못하고 전화, 보이스톡 해도 판매자는 연락이 안되었습니다."
                    />
                  </div>
                </ContentCard>
              </SectionCard>
            </ReportSection>
          </div>
          {/* 긍정 심층 */}
          <div style={{ display: "grid", gridTemplateRows: "subgrid", gridRow: "span 2", rowGap: 0, alignItems: "stretch" }}>
            <SectionHeading
              overline="긍정 심층 분석"
              title="긍정 리뷰의 57%가 가성비를 언급하며, 가격 대비 디자인·바퀴·내구성이 만족의 핵심입니다"
              style={{ paddingLeft: 8, paddingRight: 20 }}
            />
            <ReportSection>
              <SectionCard style={{ flex: 1 }}>
                <ContentCard padding={40}>
                  <HBarChart
                    title="긍정 리뷰 중 각 영역 언급률"
                    valueInside
                    data={positiveBreakdown.map((d) => ({ label: d.id, value: d.value, count: d.count, color: d.hatched ? "#E6E7E9" : undefined }))}
                  />
                </ContentCard>
                <ContentCard style={{ flex: 1 }}>
                  <TextBlock title="해석" bordered={false}>
                    상위 네 영역 모두 가성비 인식 위에 성립합니다 — 가성비는 가격 대비 전반적 품질이 좋다는 종합 평가이고, 바퀴/이동성은 부드럽게 잘 굴러간다는 실사용 만족이며, 디자인/색상은 외관과 색상 선택지가, 내구성은 기본 품질이 만족의 요인입니다. 다만 가성비 기반 만족은 가격이 오르면 흔들릴 수 있어 현재 가격대를 유지하는 것이 중요합니다.
                  </TextBlock>
                </ContentCard>
                <ContentCard padding={0}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <UserCard
                      type="quote"
                      sentiment="positive"
                      name="가성비"
                      subtitle="5점 · 공감 266"
                      quote="가성비: 합리적인 가격으로 뛰어난 성능을 제공합니다. 특히, 디자인 대비 가격이 매우 매력적입니다. 튼튼하고 디자인도 깔끔해서 마음에 들어요!"
                    />
                    <UserCard
                      type="quote"
                      sentiment="positive"
                      name="바퀴/이동성"
                      subtitle="5점 · 공감 136"
                      quote="바퀴가 아주 부드럽고 회전이 잘 되다보니 실외에서 편하게 움직일 수 있을 것 같아요. 바퀴가 부드러운 것도 그렇고 여름에는 실버가 최고 ♡"
                    />
                    <UserCard
                      type="quote"
                      sentiment="positive"
                      name="디자인/색상"
                      subtitle="5점 · 공감 107"
                      quote="디자인이 너무 세련되고 감성적이었어요. 다양한 색상으로 제공되어서 내 취향에 맞는 캐리어를 고를 수 있었답니다. 화사한 색상들이 많아서 여행 가는 기분을 더욱 고조시켜주더라고요."
                    />
                  </div>
                </ContentCard>
              </SectionCard>
            </ReportSection>
          </div>
        </div>

        {/* Section 6: 개선 로드맵 */}
        <div>
          <SectionHeading
            overline="개선 로드맵"
            title="배송 품질 관리와 지퍼/잠금장치 출고 검수를 강화하면, 부정률 7.9%를 4% 이하로 줄일 수 있습니다"
            description="부정의 대부분이 제품 설계가 아닌 품질 관리 과정에서 발생하므로, 출고 전 검수와 배송 포장을 개선하면 빠르게 효과를 볼 수 있습니다. 현재 가성비·디자인·바퀴 등 긍정 요인은 유지하면서 부정만 줄이는 방향입니다."
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
