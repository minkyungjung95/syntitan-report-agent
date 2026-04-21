import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard,
  PersonaCard,
  TextBlock,
  StrategyRoadmapTable,
  ExecutiveSummaryCard,
} from "./report-components";
import { HBarChart, DonutChart, StackedHBar } from "./charts";

// ─── Data ──────────────────────────────────────────────────────────────────

const ratingDistribution = [
  { label: "5점", value: 61.2, count: 306 },
  { label: "4점", value: 8.4, count: 42 },
  { label: "3점", value: 7.4, count: 37 },
  { label: "2점", value: 2.6, count: 13 },
  { label: "1점", value: 20.4, count: 102 },
];

// 영역별 감성 (부정 영향이 큰 순서)
const topicImpactData = [
  { label: "고객 지원 (3.2%)", 긍정: 81, 중립: 6, 부정: 13 },
  { label: "온보딩/학습 (2.8%)", 긍정: 50, 중립: 0, 부정: 50 },
  { label: "이미지/파일 (5.0%)", 긍정: 44, 중립: 12, 부정: 44 },
  { label: "로그인/계정 (5.6%)", 긍정: 25, 중립: 14, 부정: 61 },
  { label: "성능/안정성 (5.4%)", 긍정: 15, 중립: 11, 부정: 74 },
  { label: "기능/UX (7.8%)", 긍정: 21, 중립: 17, 부정: 62 },
  { label: "콘텐츠 품질 (9.0%)", 긍정: 38, 중립: 6, 부정: 56 },
  { label: "가격/한도 (11.2%)", 긍정: 30, 중립: 7, 부정: 63 },
];

// 부정 리뷰 영역별 비중 (합 100%) — 기타: isOther → hatched 빗금
const negativeBreakdown = [
  { id: "가격/한도", value: 24.9 },
  { id: "콘텐츠 품질", value: 17.7 },
  { id: "기능/UX", value: 17.0 },
  { id: "성능/안정성", value: 14.1 },
  { id: "기타", value: 26.3, hatched: true },
];

// 긍정 리뷰 영역별 비중 (합 100%)
const positiveBreakdown = [
  { label: "편리성", value: 58.6, count: 65 },
  { label: "학습/정보", value: 28.8, count: 32 },
  { label: "소통/감정", value: 12.6, count: 14 },
];

export default function ChatgptReviewReport() {
  return (
    <PageWrapper>
      <ReportPage>

        {/* Section 1: Executive Summary — overline(sectionName) + title(headline) + description(리드) + findings(나머지 문장 분리) */}
        <div>
          <SectionHeading
            overline="Executive Summary"
            title="불만이 쌓이는 이유는 사용 한도·오답 수정·업데이트 품질 세 영역에서 사용자 목소리가 반영되지 않기 때문입니다"
            description="ChatGPT 한국어 리뷰 500건을 별점·감성·영역별로 분석했습니다."
          />
          <ExecutiveSummaryCard
            title={null}
            findings={{
              title: "Key Findings",
              items: [
                "평균 3.89점이지만 1점과 5점에 81.6%가 몰려 있어, 평균 점수가 실제 만족도보다 높게 보입니다.",
                "불만이 있으면 88.7%가 곧장 1점을 주며, 1점 리뷰는 5점보다 3.7배 길고 구체적입니다.",
                "가격/한도·콘텐츠 품질·기능/UX 세 영역에 불만이 집중되고, 세 영역 모두 사용자가 문제를 지적해도 개선되지 않는 경험이 반복됩니다.",
                "사용 한도 초기화 시점 공개, 오답 수정 프로세스 개선, 업데이트 전 품질 검증 세 가지 조치로 불만 비율을 절반 가까이 줄일 수 있습니다.",
              ],
            }}
          />
        </div>

        {/* Section 2: 리뷰 현황 — 별점 분포 (HBarChart) */}
        <div>
          <SectionHeading
            title="평균 3.89점은 실제 만족도보다 높게 보이며, 실제로는 1점과 5점에 81.6%가 몰려 있습니다"
            description="불만이 있으면 88.7%가 곧장 1점을 선택하며, 2점은 13건에 불과합니다. 한번 불만을 느끼면 최저점을 주는 경향이 강하고, 중간 지대가 거의 없습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <HBarChart title="별점 분포" data={ratingDistribution} maxValue={100} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 3: 별점 분석 — 두 그룹의 리뷰 패턴 (PersonaCard x2) */}
        <div>
          <SectionHeading
            title="만족 리뷰는 가볍고 불만 리뷰는 구체적이며, 1점 리뷰가 평균 74자로 5점 리뷰보다 3.7배 깁니다"
            description="5점 리뷰의 37%가 '좋아요', '굿' 같은 5자 이하 반응인 반면, 1점 리뷰는 가격 한도·콘텐츠 품질·기능 변경 등 구체적인 이유를 적습니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <PersonaCard
                  name="불만을 구체적으로 쓰는 사람들"
                  subtitle="1점 그룹 (102건, 20.4%)"
                  metrics={[
                    { key: "평균 리뷰 길이", value: "74자" },
                    { key: "5자 이하 비율", value: "4.9%" },
                    { key: "공통 언급", value: "가격·품질·기능" },
                  ]}
                />
                <PersonaCard
                  name="가볍게 만족을 표현하는 사람들"
                  subtitle="5점 그룹 (306건, 61.2%)"
                  metrics={[
                    { key: "평균 리뷰 길이", value: "20자" },
                    { key: "5자 이하 비율", value: "37%" },
                    { key: "공통 언급", value: "좋아요·굿·굳" },
                  ]}
                />
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4: 영역별 감성 분석 (VBarChart stacked) */}
        <div>
          <SectionHeading
            title="가격/한도·콘텐츠 품질·기능/UX 세 영역에 부정 리뷰가 집중되며, 각 영역에서 부정 리뷰가 56~63%를 차지합니다"
            description="8개 영역 중 7개에서 불만이 나타나지만, 상위 세 영역과 나머지의 격차가 큽니다. 성능/안정성은 부정 74%이지만 전체 리뷰의 5.4%뿐이어서 영향은 제한적입니다. 반면 가격/한도·콘텐츠 품질·기능/UX는 비중과 부정 비율이 모두 높아 개선 효과가 가장 큽니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <StackedHBar
                  title="영역별 감성 분포 (부정 영향이 큰 순서)"
                  data={topicImpactData}
                  keys={["부정", "중립", "긍정"]}
                  colors={["#F87171", "#E6E7E9", "#7CCF00"]}
                  indexBy="label"
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 5: 부정 심층 분석 (DonutChart — 합 100%이므로 가능) */}
        <div>
          <SectionHeading
            title="부정 리뷰의 59.6%가 가격/한도·콘텐츠 품질·기능/UX 세 영역에 집중되며, 공통점은 사용자 피드백이 반영되지 않는 구조입니다"
            description="세 영역 모두 사용자가 문제를 지적해도 달라지지 않는다는 공통점이 있습니다. 가격/한도는 초기화 시점을 알 수 없어 결제 신뢰가 흔들리고, 콘텐츠 품질은 오답을 지적해도 고쳐지지 않아 유료 사용자가 이탈하며, 기능/UX는 업데이트 후 기존 기능이 깨져 부정이 누적됩니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <DonutChart title="부정 리뷰 영역별 비중" size={260} data={negativeBreakdown} legendPosition="right" />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 6: 긍정 심층 분석 (HBarChart — 3개 항목 간결 비교) */}
        <div>
          <SectionHeading
            title="긍정 리뷰의 58.6%가 편리성에 집중되며, AI 챗봇만 줄 수 있는 고유 가치가 만족의 핵심입니다"
            description="세 영역 모두 AI 챗봇이기 때문에 가능한 경험이라는 공통점이 있습니다. 편리성은 궁금한 걸 바로 물어볼 수 있다는 점, 학습/정보는 새로운 개념을 쉽게 배울 수 있다는 점, 소통/감정은 대화 상대가 된다는 점에서 만족도가 높습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <HBarChart title="긍정 리뷰 영역별 비중" data={positiveBreakdown} maxValue={100} />
              </ContentCard>
              <ContentCard>
                <TextBlock title="해석" bordered={false}>
                  편리성(58.6%, 65건)이 긍정의 대부분을 차지하고, 학습/정보(28.8%, 32건)·소통/감정(12.6%, 14건)이 뒤를 잇습니다. 다만 경쟁사 언급 11건 중 5건이 이탈 사례로, 오답 고집과 업데이트 문제가 개선되지 않으면 이 가치도 지킬 수 없습니다.
                </TextBlock>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 7: 개선 로드맵 (StrategyRoadmapTable) */}
        <div>
          <SectionHeading
            title="사용 한도 초기화 시점 공개·오답 수정 개선·업데이트 품질 검증 세 가지로, 전체 불만 비율 23%를 12%까지 줄일 수 있습니다"
            description="즉시 가능한 한도 초기화 잔여 시간 표시와 업데이트 긴급 복구로 빠르게 효과를 내고, 이후 오답 수정 절차와 품질 검증 체계를 갖추면 유료 사용자 이탈까지 방지할 수 있습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <StrategyRoadmapTable periods={[
                  {
                    badge: "Immediate", period: "1-2주 내",
                    rows: [
                      {
                        strategy: "사용 한도 초기화 시점 공개",
                        objective: "가격/한도 불만(56건)의 핵심 원인을 해소",
                        actionPlan: "이미지 생성·메시지 전송 한도가 언제 다시 채워지는지 앱 안에 잔여 시간을 표시",
                        expectedImpact: "한도 관련 불만 비율 63% → 25%",
                      },
                      {
                        strategy: "업데이트로 깨진 기능 긴급 복구",
                        objective: "설정 삭제·대화 끊김·키보드 미연결 문제를 해소",
                        actionPlan: "직전 업데이트로 깨진 기능(설정 버튼, 채팅 기록, 블루투스 키보드)을 우선 복구",
                        expectedImpact: "기능/UX 불만 비율 62% → 30%",
                      },
                    ],
                  },
                  {
                    badge: "Short-term", period: "1-3개월",
                    rows: [
                      {
                        strategy: "오답 수정 프로세스 개선",
                        objective: "콘텐츠 품질 불만 45건 중 오답을 수정하지 않는 문제를 완화",
                        actionPlan: "사용자가 오류를 지적하면 자체 검증 후 수정하는 프로세스 강화",
                        expectedImpact: "콘텐츠 품질 불만 비율 56% → 25%",
                      },
                      {
                        strategy: "업데이트 품질 검증 체크리스트",
                        objective: "업데이트 후 기능 훼손 발생률 감소",
                        actionPlan: "기존 기능 정상 동작 테스트를 업데이트 배포 필수 조건에 추가, 사용자 피드백 반영 프로세스 도입",
                        expectedImpact: "업데이트 후 기존 기능이 깨지는 문제 재발 방지",
                      },
                    ],
                  },
                  {
                    badge: "Mid-term", period: "3-6개월",
                    rows: [
                      {
                        strategy: "로그인/계정 UX 재설계",
                        objective: "계정 관련 불만 28건 해소",
                        actionPlan: "계정 전환·로그아웃 메뉴 접근성 개선, 구글 로그인 무한로딩 근본 해결",
                        expectedImpact: "계정 관련 불만 비율 61% → 20%",
                      },
                      {
                        strategy: "유료 사용자 품질 모니터링",
                        objective: "유료 사용자 이탈을 방지하고 경쟁사 대비 품질 우위를 유지",
                        actionPlan: "유료 사용자 리뷰 별도 트래킹, 핵심 시나리오별 품질 벤치마크 운영",
                        expectedImpact: "전체 불만 비율 23% → 12%",
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
