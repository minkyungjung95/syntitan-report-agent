import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  StrategyCard,
  SignalCard,
  DataTable,
  StrategyRoadmapTable,
} from "./report-components";
import { DonutChart, MultiLineChart, VBarChart, CHART_COLORS } from "./charts";
import { DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  AdPerformanceReport — 광고 성과 분석 리포트 (ROAS 없는 케이스)
 *
 *  FE 핸드오프 가이드 (개발자 폴더 구조 권장):
 *    src/components/report/AdPerformanceReport/
 *      ├── index.tsx                       ← 메인 (이 파일의 AdPerformanceReport)
 *      ├── ExecutiveSummary.tsx            ← (Section 1) 총괄 요약 + Key Findings
 *      ├── MediaCostMix.tsx                ← (Section 2) 매체 비용 구성 DonutChart
 *      ├── EfficiencyKpis.tsx              ← (Section 3) 핵심 효율 KPI SignalCard 3개
 *      ├── MediaComparison.tsx             ← (Section 4) 매체별 효율 비교 DataTable
 *      ├── CampaignPerformance.tsx         ← (Section 5+6) 캠페인 CPA 랭킹 + 통합 테이블
 *      ├── WeeklyTrend.tsx                 ← (Section 7) 주별 CPA 추이 MultiLineChart
 *      └── StrategyRoadmap.tsx             ← (Section 8) 개선 로드맵
 *
 *  데이터 소스: 인라인 데이터 (원본: public/json/광고성과분석 1.json)
 *  공통 컴포넌트: ContentHeader / SectionHeading / ExecutiveSummaryCard / SectionCard /
 *                SignalCard / StrategyCard / StrategyRoadmapTable /
 *                DonutChart / MultiLineChart / VBarChart / DataTable
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── Data (광고성과분석 1.json 원문) ─────────────────────────────────────────

// Section 3: 매체 비용 구성 — DonutChart
const mediaCostData = [
  { id: "구글", value: 59.9, count: 113352959 },
  { id: "네이버", value: 26.6, count: 50335995 },
  { id: "메타", value: 11.0, count: 20792104 },
  { id: "카카오", value: 2.5,  count: 4688628 },
];

// Section 4: 매체 효율 단면 — DataTable (행=매체, 컬럼=지표)
// 헤드라인 메시지(카카오 광고비 대비 성과 최하위)와 일치하는 카카오 worst 지표만 레드 강조
// CPC는 카카오가 오히려 가장 낮아(좋음) 강조 제외
const ctrHL = (row) => row.media === "카카오" ? "red" : false;
const cvrHL = (row) => row.media === "카카오" ? "red" : false;
const cpaHL = (row) => row.media === "카카오" ? "red" : false;
const mediaBreakdownColumns = [
  { key: "media", label: "매체", align: "left" },
  { key: "cost", label: "총 비용", align: "center" },
  { key: "ctr",  label: "CTR (클릭률)",       align: "center", highlightWhen: ctrHL },
  { key: "cpc",  label: "CPC (클릭당 비용)",   align: "center" },
  { key: "cvr",  label: "CVR (전환율)",       align: "center", highlightWhen: cvrHL },
  { key: "cpa",  label: "CPA (전환당 비용)",   align: "center", highlightWhen: cpaHL },
];
const mediaBreakdownData = [
  { media: "구글",   cost: "113,352,959원", ctr: "6.65%", cpc: "931원", cvr: "6.85%", cpa: "13,598원" },
  { media: "네이버", cost: "50,335,995원",  ctr: "4.91%", cpc: "822원", cvr: "4.58%", cpa: "17,951원" },
  { media: "메타",   cost: "20,792,104원",  ctr: "1.88%", cpc: "585원", cvr: "3.69%", cpa: "15,860원" },
  { media: "카카오", cost: "4,688,628원",   ctr: "0.91%", cpc: "396원", cvr: "1.20%", cpa: "33,019원" },
];

// Section 5+6: 캠페인 CPA 랭킹 — VBarChart (CPA 오름차순, 상위 5 그린 / 하위 5 레드)
// Red 400(#FF6467)이 레드의 가장 진한 톤 — 프로젝트 기본 레드 기준
const LIME500 = "#7CCF00";
const RED400 = "#FF6467";
const campaignCpaRanking = [
  { label: "구글 브랜드검색",          cpa: 12735 },
  { label: "구글 디스플레이 리마케팅", cpa: 12891 },
  { label: "메타 봄신상 리타겟팅",     cpa: 14245 },
  { label: "메타 브랜드인지 영상",     cpa: 15539 },
  { label: "구글 경쟁사키워드",        cpa: 15721 },
  { label: "네이버 쇼핑검색",          cpa: 16842 },
  { label: "메타 신규유입",            cpa: 18054 },
  { label: "네이버 파워링크 브랜드",   cpa: 19234 },
  { label: "카카오 친구메시지",        cpa: 31807 },
  { label: "카카오 비즈보드",          cpa: 34773 },
];
const campaignCpaColors = [
  LIME500, LIME500, LIME500, LIME500, LIME500,
  RED400,  RED400,  RED400,  RED400,  RED400,
];

// Section 5+6: 통합 캠페인 테이블 (10개, CPA 오름차순, 상위 5 그린 / 하위 5 레드)
const TOP_CAMPAIGN_NAMES = new Set([
  "구글 브랜드검색", "구글 디스플레이 리마케팅", "메타 봄신상 리타겟팅", "메타 브랜드인지 영상", "구글 경쟁사키워드",
]);
const campaignCpaHL = (row) => TOP_CAMPAIGN_NAMES.has(row.name) ? "green" : "red";
const campaignColumns = [
  { key: "name", label: "캠페인",                align: "left" },
  { key: "cost", label: "총 비용",                  align: "center" },
  { key: "ctr",  label: "CTR (클릭률)",          align: "center" },
  { key: "cvr",  label: "CVR (전환율)",          align: "center" },
  { key: "conv", label: "전환수",                align: "center" },
  { key: "cpa",  label: "CPA (전환당 비용)",     align: "center", highlightWhen: campaignCpaHL },
];
const campaignData = [
  { name: "구글 브랜드검색",          cost: "39,301,659원", ctr: "6.69%", cvr: "6.95%", conv: "3,086건", cpa: "12,735원" },
  { name: "구글 디스플레이 리마케팅", cost: "38,646,763원", ctr: "6.84%", cvr: "7.02%", conv: "2,998건", cpa: "12,891원" },
  { name: "메타 봄신상 리타겟팅",     cost: "6,666,786원",  ctr: "2.01%", cvr: "4.01%", conv: "468건",   cpa: "14,245원" },
  { name: "메타 브랜드인지 영상",     cost: "6,759,451원",  ctr: "1.78%", cvr: "3.59%", conv: "435건",   cpa: "15,539원" },
  { name: "구글 경쟁사키워드",        cost: "35,404,537원", ctr: "6.37%", cvr: "6.49%", conv: "2,252건", cpa: "15,721원" },
  { name: "네이버 쇼핑검색",          cost: "25,312,809원", ctr: "4.91%", cvr: "4.65%", conv: "1,503건", cpa: "16,842원" },
  { name: "메타 신규유입",            cost: "7,365,867원",  ctr: "1.86%", cvr: "3.47%", conv: "408건",   cpa: "18,054원" },
  { name: "네이버 파워링크 브랜드",   cost: "25,023,186원", ctr: "4.92%", cvr: "4.50%", conv: "1,301건", cpa: "19,234원" },
  { name: "카카오 친구메시지",        cost: "2,671,797원",  ctr: "0.98%", cvr: "1.29%", conv: "84건",    cpa: "31,807원" },
  { name: "카카오 비즈보드",          cost: "2,016,831원",  ctr: "0.84%", cvr: "1.09%", conv: "58건",    cpa: "34,773원" },
];

// Section 7: 주별 CPA 추이 — MultiLineChart (매체별) + 전체 평균 벤치마크
const weeklyTrendData = [
  { id: "구글",   data: [
    { x: "1주 차", y: 13900 }, { x: "2주 차", y: 13600 }, { x: "3주 차", y: 11400 }, { x: "4주 차", y: 15500 },
  ]},
  { id: "네이버", data: [
    { x: "1주 차", y: 19500 }, { x: "2주 차", y: 15100 }, { x: "3주 차", y: 18500 }, { x: "4주 차", y: 18900 },
  ]},
  { id: "메타",   data: [
    { x: "1주 차", y: 15500 }, { x: "2주 차", y: 15800 }, { x: "3주 차", y: 16000 }, { x: "4주 차", y: 16100 },
  ]},
  { id: "카카오", data: [
    { x: "1주 차", y: 50000 }, { x: "2주 차", y: 31100 }, { x: "3주 차", y: 19800 }, { x: "4주 차", y: 45500 },
  ]},
  { id: "전체 평균", data: [
    { x: "1주 차", y: 15000 }, { x: "2주 차", y: 15000 }, { x: "3주 차", y: 15000 }, { x: "4주 차", y: 15000 },
  ]},
];

export default function AdPerformanceReport() {
  return (
    <PageWrapper>
      <ContentHeader
        title="광고 성과 분석"
        description="2025년 3월 구글·네이버·메타·카카오 4개 매체의 광고 성과를 분석했습니다."
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text="ad_performance_202503.csv"
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
            title="평균 CPA 뒤에 카카오·메타 두 매체의 구조적 비효율이 숨어 있으며, 세 가지 조치만으로 전체 CPA를 17% 낮출 수 있습니다"
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "총 광고비", value: "1.89억원" },
              { label: "총 전환",   value: "12,593건" },
              { label: "평균 CPA",  value: "15,022원" },
            ]}
            findings={{
              title: "Key Findings",
              items: [
                "광고비 1.89억 원으로 전환 12,593건을 확보했고 평균 CPA는 15,022원 수준이지만, 매체 간 CPA 편차가 2.4배로 벌어져 있습니다.",
                "구글이 전체 광고비의 59.9%를 차지하며 효율도 최고인 반면, 카카오는 CPA가 가장 높아 광고비 대비 성과가 최하위입니다.",
                "3월 후반에는 카카오 CPA 급등과 메타 CTR 하락이 겹쳐 월말 효율 악화 신호도 뚜렷합니다.",
                "카카오 2개 캠페인을 정리해 확보한 예산을 구글로 재배분하고 메타 소재를 교체하면, 전체 CPA를 목표 12,500원 수준까지 낮출 수 있습니다.",
              ],
            }}
          />
        </div>

        {/* Section 2: 매체 비용 구성 — DonutChart (PM JSON 순서) */}
        <div>
          <SectionHeading
            overline="매체 비용 구성"
            title="구글이 전체 광고비의 59.9%를 차지하며 단일 매체 의존도가 높아, 매체 구성을 다양화해야 합니다"
            description="광고비는 구글·네이버 두 매체에 86.5%가 집중되어 있고, 메타·카카오의 비중은 크지 않습니다. 단일 매체 비중이 60%에 달하면 해당 매체의 단가·정책이 흔들릴 때 전체 성과가 곧바로 따라 움직이므로, 네이버에 집행 비중을 더 실어 구글 의존도를 낮춰야 합니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <DonutChart
                  title="매체별 비용 구성 (2025-03)"
                  size={220}
                  legendPosition="right"
                  data={mediaCostData}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 3: 핵심 효율 KPI — SignalCard 3개 */}
        <div>
          <SectionHeading
            overline="핵심 효율 KPI"
            title="3개 핵심 지표가 매체별로 2~7배까지 벌어져 있어, 평균값만 보면 매체별 효율 차이를 놓치게 됩니다"
            description="매체 유형이 효율을 가릅니다. 검색형인 구글·네이버는 CTR·CVR이 모두 상위권이고 배너·메시지형인 메타·카카오는 모두 하위권이라, 어느 매체에 집행하느냐가 그 캠페인의 기본 성과를 좌우합니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
                <StrategyCard
                  badge={{ text: "평균 CPA", type: "Solid", size: "Medium", variant: "Info" }}
                  price="15,022원"
                  priceLabel="매체별 13,598원~33,019원, 편차 2.4배"
                  bordered={false}
                  style={{ background: "#FFFFFF" }}
                >
                  구글이 가장 낮고 카카오가 가장 높아, 1건 전환 단가가 매체별로 크게 갈립니다.
                </StrategyCard>
                <StrategyCard
                  badge={{ text: "평균 CTR", type: "Solid", size: "Medium", variant: "Info" }}
                  price="3.67%"
                  priceLabel="매체별 0.91%~6.65%, 편차 7.3배"
                  bordered={false}
                  style={{ background: "#FFFFFF" }}
                >
                  매체 유형이 노출→클릭 단계에 가장 크게 반영되는 지표로, 세 지표 중 편차가 가장 큽니다.
                </StrategyCard>
                <StrategyCard
                  badge={{ text: "평균 CVR", type: "Solid", size: "Medium", variant: "Info" }}
                  price="5.47%"
                  priceLabel="매체별 1.20%~6.85%, 편차 5.7배"
                  bordered={false}
                  style={{ background: "#FFFFFF" }}
                >
                  클릭→전환 단계에서도 매체 유형 패턴이 그대로 이어져, 유형 간 성과 차이가 유지됩니다.
                </StrategyCard>
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4: 매체별 효율 비교 — DataTable (PM 새 이름) */}
        <div>
          <SectionHeading
            overline="매체별 효율 비교"
            title="카카오는 비용 점유율이 2.5%에 불과하지만 매체 중 CPA가 가장 높아, 광고비 대비 성과가 최하위입니다"
            description="구글은 모든 지표에서 가장 좋은 성과를 내고 있고, 네이버는 CPC가 높은 편이라 키워드 입찰 단가를 다시 맞춰야 합니다. 메타는 CTR이 낮지만 CPC가 싸서 CPA가 평균 수준에 머물고, 카카오는 모든 지표가 가장 낮아 쓰는 돈이 적더라도 다른 매체로 옮기는 게 낫습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <DataTable columns={mediaBreakdownColumns} data={mediaBreakdownData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 5+6: 캠페인 단위 성과 — 메인 헤드라인 + 차트 + 좌우 두 카드(우수/낮은) + 통합 테이블 */}
        <div>
          <SectionHeading
            overline="캠페인 단위 성과"
            title="효율 상·하위 캠페인을 함께 보면 예산 재배분 방향이 드러납니다"
          />
          <ReportSection>
            {/* 한 SectionCard 안에 차트 → 두 SignalCard(우수/낮은) → 통합 테이블 */}
            <SectionCard>
              <ContentCard padding={40}>
                <VBarChart
                  title="캠페인 CPA 랭킹 (CPA 낮은 순, 단위: 원)"
                  data={campaignCpaRanking}
                  keys={["cpa"]}
                  indexBy="label"
                  colors={campaignCpaColors}
                  valueFormat={(v) => v.toLocaleString()}
                  height={420}
                  hideLegend
                />
              </ContentCard>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                <SignalCard
                  bordered={false}
                  showDivider={false}
                  variant="Positive"
                  badgePrefix="효율 우수 캠페인"
                  title="효율이 가장 높은 캠페인 5개는 모두 구글 검색·리타겟팅과 메타 리타겟팅 계열이라, 예산 확대 후보로 추릴 수 있습니다"
                  items={[
                    "상위 5개 모두 이미 브랜드를 알고 있거나 한 번 방문했던 사용자를 다시 겨냥하는 브랜드검색·리타겟팅 계열이라, 예산을 더 실어도 효율이 크게 떨어질 가능성이 낮습니다.",
                    "상위 두 캠페인은 각각 월 3,000건 안팎의 전환을 내고 있어 규모도 큽니다.",
                  ]}
                />
                <SignalCard
                  bordered={false}
                  showDivider={false}
                  variant="Negative"
                  badgePrefix="효율 낮은 캠페인"
                  title="효율이 낮은 캠페인은 매체마다 원인이 달라, 카카오·네이버·메타에 각각 다른 조치가 필요합니다"
                  items={[
                    "카카오 친구메시지·비즈보드는 CTR과 CVR이 모두 1% 전후로 다른 캠페인들보다 훨씬 낮아 중단 대상입니다.",
                    "네이버 파워링크 브랜드는 자사 브랜드 검색 광고인데도 쇼핑검색(16,842원)보다 CPA가 높은 19,234원이라 입찰가와 키워드를 점검해야 합니다.",
                    "메타 신규유입은 메타 안에서 리타겟팅 계열(CVR 4% 안팎)보다 낮은 3.47%에 그쳐 타겟 사용자를 다시 잡아야 합니다.",
                  ]}
                />
              </div>
              <ContentCard padding={0}>
                <DataTable columns={campaignColumns} data={campaignData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 7: 주별 CPA 추이 — MultiLineChart */}
        <div>
          <SectionHeading
            overline="주별 추이"
            title="4주 차에 카카오 CPA가 45,500원까지 다시 뛰어 전체 평균의 3배까지 벌어지면서, 월 후반으로 갈수록 효율이 뚜렷하게 나빠지고 있습니다"
            description="전체 CPA는 3주 차까지 내려갔다가 4주 차에 다시 올랐고, 이 상승은 대부분 카카오에서 발생했습니다. 메타는 15,500~16,100원 구간에서 완만한 상승세를 이어가고 있어 큰 변동은 없지만 개선 신호도 보이지 않습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <MultiLineChart
                  title="매체별 주별 CPA 추이 (단위: 원)"
                  curve="linear"
                  data={weeklyTrendData}
                  height={420}
                  colors={[...CHART_COLORS.slice(0, 4), "#B6B8BD"]}
                  valueFormat={(v) => Number(v).toLocaleString()}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 8: 예산 재배분 로드맵 — StrategyRoadmapTable */}
        <div>
          <SectionHeading
            overline="예산 재배분 로드맵"
            title="카카오의 비효율 캠페인을 정리해 그 예산을 구글로 옮기고 메타 소재를 함께 교체하면, 전체 CPA를 15,022원에서 12,500원까지 낮출 수 있습니다"
            description="비효율은 두 군데에서 나오고 있습니다. 카카오는 매체·캠페인 모두 지표가 가장 낮고, 메타는 CTR이 4주 내내 내려갔습니다. 가장 먼저 카카오 캠페인 2개를 정리해 얻은 약 335만 원을 이미 효율이 확인된 구글 디스플레이 리마케팅으로 일단 옮기고, 메타 브랜드인지 영상 소재를 교체합니다. 이어서 네이버 브랜드 키워드 구조를 정비하고, 길게는 매체별 비중을 다시 조정해 구글에 집중된 59.9%를 45%까지 낮춥니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <StrategyRoadmapTable periods={[
                  {
                    badge: "즉시", period: "1주 이내",
                    rows: [
                      {
                        strategy: "카카오 2개 캠페인 예산 축소 및 구글 재배분",
                        objective: "카카오 비효율 캠페인 정리로 확보한 약 335만 원을 효율 매체로 이동, 순증 전환 160건 확보",
                        actionPlan: "카카오 비즈보드 봄기획전 집행 중단 (월 약 202만 원 회수, 전환 58건 감소)\n친구메시지 예산 50% 축소 (월 약 134만 원 회수, 전환 42건 감소)\n확보한 약 335만 원을 구글 디스플레이 리마케팅(CPA 12,891원)으로 이동하여 전환 약 260건 추가",
                        expectedImpact: "월 전환 12,593건 → 12,753건 (+160건 순증)\n카카오 CPA 33,019원 구간 제거",
                      },
                      {
                        strategy: "메타 브랜드인지 영상 소재 A/B 교체",
                        objective: "메타 CTR을 4주 차 1.65%에서 2주 차 수준(2.18%)으로 회복",
                        actionPlan: "신규 영상 3종 제작·동시 집행\n기존 소재는 노출 점유 30% 이하로 제한",
                        expectedImpact: "메타 전체 CTR 1.88% → 2.10%\n월 전환 1,311 → 1,460건",
                      },
                    ],
                  },
                  {
                    badge: "단기", period: "1개월 이내",
                    rows: [
                      {
                        strategy: "네이버 브랜드 키워드 구조 재설계",
                        objective: "파워링크 브랜드 CPA를 19,234원에서 쇼핑검색 수준(16,842원)까지 개선",
                        actionPlan: "브랜드 키워드 입찰가 재책정, 경쟁사 브랜드 침투 방어 영역만 유지\n검색 쿼리 리포트로 비효율 쿼리 제외",
                        expectedImpact: "네이버 CPA 17,951원 → 16,500원\n월 전환 1,301 → 1,510건",
                      },
                    ],
                  },
                  {
                    badge: "중기", period: "3개월 이내",
                    rows: [
                      {
                        strategy: "매체 믹스 재설계 및 벤치마크 기반 예산 가이드 수립",
                        objective: "전체 CPA 15,022원 → 12,500원, CTR 3.67% → 4.5%",
                        actionPlan: "구글·네이버·메타·카카오 매체별 목표 CPA·CTR 벤치마크 수립\n월별 매체 믹스 리뷰 사이클 정착, 벤치마크 미달 캠페인 자동 경고 규칙 도입",
                        expectedImpact: "월 전환 12,593 → 15,000건\n단일 매체 의존도 59.9% → 45%로 분산",
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
