import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  InfoCard, InfoCardRow,
  PersonaCard,
  KeyFindings, TextBlock, InsightCard,
  ActionList,
} from "./report-components";
import { VBarChart } from "./charts";
import { T } from "./tokens.jsx";

const F = "Pretendard, sans-serif";

// ─── Data Transform: StackedBarChart ─────────────────────────────────────
const topicImpactData = [
  { label: "무료/유료 한도 (10.4%)", "긍정": 31, "중립": 6, "부정": 63 },
  { label: "응답 품질 (10.6%)", "긍정": 32, "중립": 8, "부정": 60 },
  { label: "UI/UX 업데이트 (7.4%)", "긍정": 14, "중립": 19, "부정": 68 },
  { label: "로그인/계정 (5.6%)", "긍정": 25, "중립": 14, "부정": 61 },
  { label: "앱 성능/버그 (3.2%)", "긍정": 19, "중립": 6, "부정": 75 },
  { label: "이미지/파일 (5.0%)", "긍정": 44, "중립": 12, "부정": 44 },
  { label: "반복/맥락 무시 (3.6%)", "긍정": 33, "중립": 11, "부정": 56 },
  { label: "검열/콘텐츠 제한 (1.6%)", "긍정": 12, "중립": 12, "부정": 75 },
];

export default function ChatGPTVocAnalysisReport() {
  return (
    <PageWrapper style={{ maxWidth: 1660, padding: 32 }}>
      <ReportPage>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 1: Executive Summary                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="Executive Summary"
            description="2026년 3-4월 ChatGPT Google Play 한국어 리뷰 500건을 별점, 감성, 토픽 축으로 분석했습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={24}>
                <InfoCardRow>
                  <InfoCard label="총 리뷰" value="500건" />
                  <InfoCard label="평균 별점" value="3.89" suffix="/ 5.0" />
                  <InfoCard label="양극화 (1+5점)" value="81.6%" />
                  <InfoCard label="부정 비율 (1-2점)" value="23.0%" />
                </InfoCardRow>
              </ContentCard>
              <ContentCard>
                <KeyFindings
                  title="핵심 발견"
                  items={[
                    "ChatGPT 한국어 리뷰 500건의 평균 별점은 3.89이지만, 1점(20.4%)과 5점(61.2%)에 81.6%가 집중된 극단적 양극화 구조입니다.",
                    "5점의 37.3%가 5자 이하 단순 반응이고 1점은 평균 74자의 구체적 불만입니다.",
                    "비중x부정률 영향도 기준: 무료/유료 한도(6.60), 응답 품질(6.40), UI/UX 업데이트(5.00)",
                    "공통 원인은 '사용자가 통제할 수 없음'. 부정률 23%→12% 달성 가능.",
                  ]}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 2: 감성 양극화 — MetricHighlight                */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="평균 3.89점, 표면 긍정 71% — 그러나 1점+5점에 81.6% 집중된 양극화 구조"
          />
          <ReportSection>
            <SectionCard>
              {/* 지표 + 해석을 좌우 배치 */}
              <ContentCard padding={24}>
                <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
                  {/* 왼쪽: 지표 카드 세로 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "0 0 340px" }}>
                    <InfoCard variant="outline" label="양극화 지수" value="81.6%" description="1점(20.4%) + 5점(61.2%)" />
                    <InfoCard variant="outline" label="부정 비율" value="23.0%" description="115건 (1-2점)" />
                    <InfoCard variant="outline" label="공감 집중도" value="67%" description="thumbs 3+ 중 1점 비율" />
                  </div>
                  {/* 오른쪽: 해석 */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
                    <TextBlock title="양극화 지수 해석" bordered={false}>
                      2-4점은 18.4%에 불과하며, '보통' 경험이 거의 존재하지 않는 극단적 양극화입니다.
                    </TextBlock>
                    <TextBlock title="부정 비율 해석" bordered={false}>
                      부정 리뷰 115건 중 102건(88.7%)이 1점입니다.
                    </TextBlock>
                    <TextBlock title="공감 집중도 해석" bordered={false}>
                      공감수 3 이상 리뷰 15건 중 10건이 1점입니다.
                    </TextBlock>
                  </div>
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 3: 양극화 해석 — ClusterCard                    */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="5점의 37%는 '좋아요' 한 마디, 1점은 평균 74자 — 만족은 가볍고 불만은 구체적"
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={24}>
                <div style={{ display: "flex", gap: 16 }}>
                  <PersonaCard
                    name="구체적 불만 기술자"
                    subtitle="102명 (20.4%)"
                    metrics={[
                      { key: "별점", value: "1점" },
                      { key: "평균 리뷰 길이", value: "74자" },
                      { key: "5점 대비", value: "3.7배 길게 작성" },
                    ]}
                  />
                  <PersonaCard
                    name="가벼운 만족 표현자"
                    subtitle="306명 (61.2%)"
                    metrics={[
                      { key: "별점", value: "5점" },
                      { key: "평균 리뷰 길이", value: "20자" },
                      { key: "5자 이하 비율", value: "37.3%" },
                    ]}
                  />
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 4: 토픽 영향도 — StackedBarChart                */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="무료/유료 한도(6.60)·응답 품질(6.40)·UI 업데이트(5.00) — 비중x부정률 기준 개선 우선순위"
          />
          <ReportSection>
            <ContentHeader title="토픽별 감성 분포 (비중x부정률 영향도순 정렬)" />
            <SectionCard>
              <ContentCard padding={24}>
                <VBarChart
                  stacked={true}
                  data={topicImpactData}
                  keys={["긍정", "중립", "부정"]}
                  indexBy="label"
                  height={360}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 5: 부정 심층 분석 — InsightCard 3열              */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="오답 고집·한도 리셋 불투명·업데이트 후 설정 삭제 — 세 불만의 공통점은 '사용자가 통제할 수 없음'"
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={24}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <InsightCard title="응답 품질 — 오답을 지적해도 수정하지 않고 반복">
                      <div style={{ marginBottom: 8, fontSize: 14, color: T.gray800, fontFamily: F }}>
                        부정률 60%, 53건 중 32건이 1-2점입니다.
                      </div>
                      <div style={{ fontSize: 14, color: T.gray800, fontFamily: F }}>
                        유료 사용자의 신뢰 붕괴. 응답 정확성은 AI 챗봇의 핵심 가치입니다.
                      </div>
                    </InsightCard>
                  </div>
                  <div style={{ flex: 1 }}>
                    <InsightCard title="한도 정책 — 무료 한도 리셋 시점이 불투명">
                      <div style={{ marginBottom: 8, fontSize: 14, color: T.gray800, fontFamily: F }}>
                        부정률 63%, 52건 중 33건이 1-2점입니다.
                      </div>
                      <div style={{ fontSize: 14, color: T.gray800, fontFamily: F }}>
                        한도 자체보다 '언제 풀리는지 모른다'가 핵심 불만입니다.
                      </div>
                    </InsightCard>
                  </div>
                  <div style={{ flex: 1 }}>
                    <InsightCard title="UI 변경 — 업데이트 후 설정·기록 삭제">
                      <div style={{ marginBottom: 8, fontSize: 14, color: T.gray800, fontFamily: F }}>
                        부정률 68%, 37건 중 25건이 1-2점입니다.
                      </div>
                      <div style={{ fontSize: 14, color: T.gray800, fontFamily: F }}>
                        가장 높은 공감(99). 업데이트가 퇴보로 인식되고 있습니다.
                      </div>
                    </InsightCard>
                  </div>
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 6: 긍정 보호 — InsightCard 2열                  */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="학습 보조·말동무·편리성이 핵심 가치 — 그러나 경쟁사 언급 9건 중 대부분이 이탈 맥락"
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={24}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <InsightCard title="핵심 가치 — 학습 보조(31건)·편리성(60건)·말동무(14건)가 긍정의 3대 축">
                      <div style={{ marginBottom: 8, fontSize: 14, color: T.gray800, fontFamily: F }}>
                        편리성/만족이 60건으로 가장 많고, 학습/정보 도움이 31건입니다.
                      </div>
                      <div style={{ fontSize: 14, color: T.gray800, fontFamily: F }}>
                        학습 보조와 말동무 기능은 AI 챗봇만의 고유 가치입니다.
                      </div>
                    </InsightCard>
                  </div>
                  <div style={{ flex: 1 }}>
                    <InsightCard title="이탈 신호 — 경쟁사 언급 9건 — Gemini 6회, Claude 1회, Grok 2회">
                      <div style={{ marginBottom: 8, fontSize: 14, color: T.gray800, fontFamily: F }}>
                        경쟁사 언급 9건 중 부정 맥락이 4건, 비교 맥락이 3건입니다.
                      </div>
                      <div style={{ fontSize: 14, color: T.gray800, fontFamily: F }}>
                        9건은 적지만, 경쟁사를 구체적으로 지목하며 이탈을 권유하는 리뷰는 강한 신호입니다.
                      </div>
                    </InsightCard>
                  </div>
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* Section 7: 액션 플랜 — 3그룹 가로 배치                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading
            title="응답 정확성 강화 + 한도 정책 투명화 + 업데이트 QA로 부정률 23%→12%"
          />
          <ReportSection>
            <div style={{ display: "flex", gap: 16 }}>
              {/* 즉시 실행 */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <ContentHeader title="즉시 실행" description="1-2주 내" />
                <SectionCard style={{ flex: 1 }}>
                  <ContentCard padding={24} style={{ flex: 1 }}>
                    <ActionList items={[
                      {
                        title: "한도 리셋 시점 투명화",
                        priority: "High",
                        columns: [
                          { label: "목표", content: "무료/유료 한도 불만 52건의 핵심 원인 해소" },
                          { label: "실행계획", content: "리셋 시점을 앱 내 명확히 표시" },
                          { label: "기대효과", content: "한도 부정률 63%→20%" },
                        ],
                      },
                      {
                        title: "업데이트 리그레션 핫픽스",
                        priority: "High",
                        columns: [
                          { label: "목표", content: "설정 삭제·기록 누락 해소" },
                          { label: "실행계획", content: "설정 버튼 삭제, 채팅 기록 누락 복구" },
                          { label: "기대효과", content: "UI 부정률 68%→30%" },
                        ],
                      },
                    ]} />
                  </ContentCard>
                </SectionCard>
              </div>

              {/* 단기 */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <ContentHeader title="단기 (1-3개월)" description="품질 개선" />
                <SectionCard style={{ flex: 1 }}>
                  <ContentCard padding={24} style={{ flex: 1 }}>
                    <ActionList items={[
                      {
                        title: "오답 정정 메커니즘 개선",
                        priority: "High",
                        columns: [
                          { label: "목표", content: "응답 품질 불만 53건 완화" },
                          { label: "실행계획", content: "오류 지적 시 자체 검증 후 정정 강화" },
                          { label: "기대효과", content: "품질 부정률 60%→30%" },
                        ],
                      },
                      {
                        title: "업데이트 QA 체크리스트 강화",
                        priority: "Medium",
                        columns: [
                          { label: "목표", content: "리그레션 발생률 감소" },
                          { label: "실행계획", content: "리그레션 테스트를 릴리즈 필수 조건 추가" },
                          { label: "기대효과", content: "공감 99급 부정 리뷰 방지" },
                        ],
                      },
                    ]} />
                  </ContentCard>
                </SectionCard>
              </div>

              {/* 중기 */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <ContentHeader title="중기 (3-6개월)" description="구조적 개선" />
                <SectionCard style={{ flex: 1 }}>
                  <ContentCard padding={24} style={{ flex: 1 }}>
                    <ActionList items={[
                      {
                        title: "로그인/계정 UX 재설계",
                        priority: "Medium",
                        columns: [
                          { label: "목표", content: "계정 관련 불만 28건 해소" },
                          { label: "실행계획", content: "계정 전환·로그아웃 접근성 개선" },
                          { label: "기대효과", content: "계정 부정률 61%→25%" },
                        ],
                      },
                      {
                        title: "유료 사용자 품질 모니터링",
                        priority: "Medium",
                        columns: [
                          { label: "목표", content: "유료 이탈 방지" },
                          { label: "실행계획", content: "유료 리뷰 별도 트래킹 + 벤치마크" },
                          { label: "기대효과", content: "종합 부정률 23%→12%" },
                        ],
                      },
                    ]} />
                  </ContentCard>
                </SectionCard>
              </div>
            </div>
          </ReportSection>
        </div>

      </ReportPage>
    </PageWrapper>
  );
}
