import {
  PageWrapper, ReportPage, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  StrategyCard,
  SignalCard,
  DataTable,
  StrategyRoadmapHorizontal,
} from "./report-components";
import { DonutChart, MultiLineChart, VBarChart, GroupedBarChart, CHART_COLORS } from "./charts";
import { DownloadIcon, DatabaseIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  AdRoasReport — 광고 ROAS 분석 리포트 (ROAS 포함 케이스)
 *
 *  FE 핸드오프 가이드 (개발자 폴더 구조 권장):
 *    src/components/report/AdRoasReport/
 *      ├── index.tsx                       ← 메인 (이 파일의 AdRoasReport)
 *      ├── ExecutiveSummary.tsx            ← (Section 1) 총괄 요약 + Key Findings
 *      ├── MediaCostMix.tsx                ← (Section 2) 매체 비용 구성
 *      ├── RevenueContribution.tsx         ← (Section 3) 매체별 매출 기여도
 *      ├── EfficiencyKpis.tsx              ← (Section 4) 핵심 효율 KPI
 *      ├── MediaComparison.tsx             ← (Section 5) 매체별 효율 비교 DataTable
 *      ├── CampaignPerformance.tsx         ← (Section 6+7) 캠페인 통합 (ROAS 내림차순)
 *      ├── WeeklyTrend.tsx                 ← (Section 8) 주별 ROAS 추이
 *      └── StrategyRoadmap.tsx             ← (Section 9) 개선 로드맵
 *
 *  데이터 소스: 인라인 데이터 (원본: public/json/광고ROAS분석.json)
 *  공통 컴포넌트: ContentHeader / SectionHeading / ExecutiveSummaryCard / SectionCard /
 *                SignalCard / StrategyCard / StrategyRoadmapHorizontal /
 *                DonutChart / MultiLineChart / VBarChart / GroupedBarChart / DataTable
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── Data (광고ROAS분석.json 원문) ─────────────────────────────────────────

// Section 2: 매체 비용 구성
const mediaCostData = [
  { id: "구글",   value: 59.9, count: 113352959 },
  { id: "네이버", value: 26.6, count: 50335995 },
  { id: "메타",   value: 11.0, count: 20792104 },
  { id: "카카오", value: 2.5,  count: 4688628 },
];

// Section 3: 매체별 매출 기여도 — 비용 점유율 vs 매출 점유율 비교
// 매출이 비용보다 길면 효율적(구글), 짧으면 비효율(메타·카카오)
const mediaShareCompareData = [
  { label: "구글",   "비용 점유율": 59.9, "매출 점유율": 67.9 },
  { label: "네이버", "비용 점유율": 26.6, "매출 점유율": 24.1 },
  { label: "메타",   "비용 점유율": 11.0, "매출 점유율": 7.4 },
  { label: "카카오", "비용 점유율": 2.5,  "매출 점유율": 0.7 },
];

// Section 5: 매체별 효율 비교 — DataTable (행=매체, 컬럼=지표)
// 헤드라인 메시지(메타·카카오의 회수율이 평균에 한참 못 미친다)에 맞춰 ROAS 컬럼의 메타/카카오 셀만 레드 강조
const roasWorstHL = (row) => row.media === "메타" || row.media === "카카오" ? "red" : false;
const mediaBreakdownColumns = [
  { key: "media",   label: "매체",  align: "left" },
  { key: "ctr",     label: "CTR",   align: "center" },
  { key: "cvr",     label: "CVR",   align: "center" },
  { key: "cpa",     label: "CPA",   align: "center" },
  { key: "revenue", label: "매출",  align: "center" },
  { key: "roas",    label: "ROAS",  align: "center", highlightWhen: roasWorstHL },
];
const mediaBreakdownData = [
  { media: "구글",   ctr: "6.65%", cvr: "6.85%", cpa: "13,598원", revenue: "490,339,000원", roas: "432%" },
  { media: "네이버", ctr: "4.91%", cvr: "4.58%", cpa: "17,951원", revenue: "173,848,000원", roas: "345%" },
  { media: "메타",   ctr: "1.88%", cvr: "3.69%", cpa: "15,860원", revenue: "53,464,000원",  roas: "257%" },
  { media: "카카오", ctr: "0.91%", cvr: "1.20%", cpa: "33,019원", revenue: "4,754,000원",   roas: "101%" },
];

// Section 6+7: 캠페인 통합 (ROAS 내림차순)
const TOP_CAMPAIGNS_ROAS = new Set([
  "구글 브랜드검색", "구글 디스플레이 리마케팅", "네이버 쇼핑검색", "메타 봄신상 리타겟팅", "구글 경쟁사키워드",
]);
const campaignRoasHL = (row) => TOP_CAMPAIGNS_ROAS.has(row.name) ? "green" : "red";
const campaignColumns = [
  { key: "name",    label: "캠페인",                align: "left" },
  { key: "cost",    label: "총 비용",                align: "center" },
  { key: "cpa",     label: "CPA (전환당 비용)",       align: "center" },
  { key: "conv",    label: "전환수",                align: "center" },
  { key: "revenue", label: "매출",                  align: "center" },
  { key: "roas",    label: "ROAS (광고비 대비 매출)", align: "center", highlightWhen: campaignRoasHL },
];
const campaignData = [
  { name: "구글 브랜드검색",          cost: "39,301,659원", cpa: "12,735원", conv: "3,086건", revenue: "188,648,000원", roas: "480%" },
  { name: "구글 디스플레이 리마케팅", cost: "38,646,763원", cpa: "12,891원", conv: "2,998건", revenue: "177,775,000원", roas: "460%" },
  { name: "네이버 쇼핑검색",          cost: "25,312,809원", cpa: "16,842원", conv: "1,503건", revenue: "103,783,000원", roas: "410%" },
  { name: "메타 봄신상 리타겟팅",     cost: "6,666,786원",  cpa: "14,245원", conv: "468건",   revenue: "25,334,000원",  roas: "380%" },
  { name: "구글 경쟁사키워드",        cost: "35,404,537원", cpa: "15,721원", conv: "2,252건", revenue: "123,916,000원", roas: "350%" },
  { name: "네이버 파워링크 브랜드",   cost: "25,023,186원", cpa: "19,234원", conv: "1,301건", revenue: "70,065,000원",  roas: "280%" },
  { name: "메타 브랜드인지 영상",     cost: "6,759,451원",  cpa: "15,539원", conv: "435건",   revenue: "14,871,000원",  roas: "220%" },
  { name: "메타 신규유입",            cost: "7,365,867원",  cpa: "18,054원", conv: "408건",   revenue: "13,259,000원",  roas: "180%" },
  { name: "카카오 친구메시지",        cost: "2,671,797원",  cpa: "31,807원", conv: "84건",    revenue: "2,939,000원",   roas: "110%" },
  { name: "카카오 비즈보드",          cost: "2,016,831원",  cpa: "34,773원", conv: "58건",    revenue: "1,815,000원",   roas: "90%" },
];

// VBarChart — 캠페인 ROAS 랭킹 (높은 순, 상위 5 라임 / 하위 5 Red400)
const LIME500 = "#7CCF00";
const RED400 = "#FF6467";
const campaignRoasRanking = [
  { label: "구글 브랜드검색",          cpa: 480 },
  { label: "구글 디스플레이 리마케팅", cpa: 460 },
  { label: "네이버 쇼핑검색",          cpa: 410 },
  { label: "메타 봄신상 리타겟팅",     cpa: 380 },
  { label: "구글 경쟁사키워드",        cpa: 350 },
  { label: "네이버 파워링크 브랜드",   cpa: 280 },
  { label: "메타 브랜드인지 영상",     cpa: 220 },
  { label: "메타 신규유입",            cpa: 180 },
  { label: "카카오 친구메시지",        cpa: 110 },
  { label: "카카오 비즈보드",          cpa: 90 },
];
const campaignRoasColors = [
  LIME500, LIME500, LIME500, LIME500, LIME500,
  RED400,  RED400,  RED400,  RED400,  RED400,
];

// Section 8: 주별 ROAS 추이
const weeklyTrendData = [
  { id: "구글",   data: [
    { x: "1주 차", y: 440 }, { x: "2주 차", y: 450 }, { x: "3주 차", y: 470 }, { x: "4주 차", y: 410 },
  ]},
  { id: "네이버", data: [
    { x: "1주 차", y: 320 }, { x: "2주 차", y: 380 }, { x: "3주 차", y: 340 }, { x: "4주 차", y: 340 },
  ]},
  { id: "메타",   data: [
    { x: "1주 차", y: 290 }, { x: "2주 차", y: 270 }, { x: "3주 차", y: 260 }, { x: "4주 차", y: 220 },
  ]},
  { id: "카카오", data: [
    { x: "1주 차", y: 130 }, { x: "2주 차", y: 150 }, { x: "3주 차", y: 200 }, { x: "4주 차", y: 80 },
  ]},
  { id: "전체 평균", data: [
    { x: "1주 차", y: 382 }, { x: "2주 차", y: 382 }, { x: "3주 차", y: 382 }, { x: "4주 차", y: 382 },
  ]},
];

export default function AdRoasReport() {
  return (
    <PageWrapper>
      <ContentHeader
        title="광고 ROAS 성과 분석"
        description="2025년 3월 구글·네이버·메타·카카오 4개 매체의 광고 성과를 매출 기준으로 분석했습니다."
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text="ad_roas_202503.csv"
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
            title="비용을 들인 매체와 매출이 나오는 매체가 4개 모두에서 어긋나 있어, 비효율이 집중된 카카오·메타 캠페인만 정리해도 전체 ROAS를 의미 있게 올릴 수 있습니다"
          />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "총 광고비", value: "1.89억원" },
              { label: "총 매출",   value: "7.22억원" },
              { label: "평균 ROAS", value: "382%" },
            ]}
            findings={{
              title: "Key Findings",
              items: [
                "광고비 1.89억 원으로 매출 7.22억 원을 만들어 평균 ROAS는 382%지만, 매체별 격차가 4.3배에 달합니다.",
                "구글은 비용 점유율(59.9%)보다 매출 점유율(67.9%)이 더 높아 가장 효율적인 반면, 카카오는 비용 2.5% 대비 매출이 0.7%에 그쳐 광고비조차 회수하지 못합니다.",
                "월 후반(4주차)에 카카오는 80%, 메타는 220%까지 ROAS가 떨어져 두 매체의 회수율 악화가 가속되고 있습니다.",
                "카카오 비효율 캠페인을 정리하고 메타 소재를 교체하면 즉시·단기 누적으로 전체 ROAS를 382% → 403%까지 올릴 수 있습니다.",
              ],
            }}
          />
        </div>

        {/* Section 2: 매체 비용 구성 */}
        <div>
          <SectionHeading
            overline="매체 비용 구성"
            title="구글에 광고비의 59.9%가 집중되어 있어 단일 매체 의존도가 큽니다"
            description="광고비는 구글·네이버 두 매체에 86.5%가 집중되어 있고, 메타·카카오의 비중은 크지 않습니다. 단일 매체 비중이 60%에 달하면 해당 매체의 단가·정책이 흔들릴 때 전체 성과가 바로 따라 움직일 위험이 있습니다."
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

        {/* Section 3: 매체별 매출 기여도 */}
        <div>
          <SectionHeading
            overline="매체별 매출 기여도"
            title="구글은 비용 점유율보다 매출 점유율이 더 높아 가장 효율적이지만, 카카오는 그 반대로 광고비조차 회수하지 못하고 있습니다"
            description="구글은 비용 점유율보다 매출 점유율이 더 높아 가장 효율적인 매체이고, 카카오는 비용 2.5% 대비 매출이 0.7%에 그쳐 광고비조차 회수하지 못하고 있습니다. 메타도 비용 점유율보다 매출이 작아 회수가 부족하고, 네이버는 두 점유율이 비슷해 균형점에 가깝습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <GroupedBarChart
                  title="매체별 비용 점유율 vs 매출 점유율 (2025-03, 단위: %)"
                  subtitle="매출 막대가 비용 막대보다 길면 효율적, 짧으면 광고비 회수 부족"
                  data={mediaShareCompareData}
                  keys={["비용 점유율", "매출 점유율"]}
                  indexBy="label"
                  colors={["#8EC5FF", "#2B7FFF"]}
                  valueSuffix="%"
                  groupTooltip
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 4: 핵심 효율 KPI */}
        <div>
          <SectionHeading
            overline="핵심 효율 KPI"
            title="ROAS·CPA·CVR 3개 지표가 매체별로 2~6배까지 벌어져 있어, 평균값만 보면 매체별 수익성 격차를 놓치게 됩니다"
            description="수익성·비용 효율·전환율이 모두 매체 유형에 따라 갈립니다. 검색·리타겟팅 중심인 구글·네이버는 ROAS·CVR이 모두 상위권이고, 배너·메시지형인 메타·카카오는 모두 하위권이라, 매체 유형이 그 캠페인의 회수율을 좌우합니다."
          />
          <ReportSection>
            <SectionCard>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
                <StrategyCard
                  badge={{ text: "평균 ROAS", type: "Solid", size: "Medium", variant: "Info" }}
                  price="382%"
                  priceLabel="매체별 101%~432%, 편차 4.3배"
                  bordered={false}
                  style={{ background: "#FFFFFF" }}
                >
                  구글이 가장 높고 카카오는 광고비조차 회수하지 못하는 수준이라, 매출 회수 능력이 매체별로 크게 갈립니다.
                </StrategyCard>
                <StrategyCard
                  badge={{ text: "평균 CPA", type: "Solid", size: "Medium", variant: "Info" }}
                  price="15,022원"
                  priceLabel="매체별 13,598원~33,019원, 편차 2.4배"
                  bordered={false}
                  style={{ background: "#FFFFFF" }}
                >
                  구글이 가장 낮고 카카오가 가장 높지만, ROAS 격차(4.3배)에 비하면 CPA 격차는 좁아 비용만 봐서는 진짜 격차가 안 보입니다.
                </StrategyCard>
                <StrategyCard
                  badge={{ text: "평균 CVR", type: "Solid", size: "Medium", variant: "Info" }}
                  price="5.47%"
                  priceLabel="매체별 1.20%~6.85%, 편차 5.7배"
                  bordered={false}
                  style={{ background: "#FFFFFF" }}
                >
                  클릭에서 전환으로 이어지는 단계에서도 매체 유형 패턴이 그대로 따라가, 결국 ROAS 격차의 한 축을 만듭니다.
                </StrategyCard>
              </div>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 5: 매체별 효율 비교 — DataTable (행=지표, 열=매체) */}
        <div>
          <SectionHeading
            overline="매체별 효율 비교"
            title="카카오는 광고비조차 회수하지 못하는 수준이고 메타도 평균을 크게 밑돌아, 두 매체의 회수율이 평균에 한참 못 미칩니다"
            description="구글은 모든 지표에서 가장 좋은 성과를 내 ROAS 432%로 가장 높고, 네이버는 평균에 가까워 안정적입니다. 메타는 CTR이 낮은 데다 ROAS도 평균을 밑돌아 전체를 끌어내리고 있고, 카카오는 모든 지표가 최하위라 광고비도 회수하지 못해 다른 매체로 옮기는 게 낫습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={0}>
                <DataTable columns={mediaBreakdownColumns} data={mediaBreakdownData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 6+7: 캠페인 단위 성과 — 차트 + 우수/낮은 SignalCard + 통합 테이블 */}
        <div>
          <SectionHeading
            overline="캠페인 단위 성과"
            title="수익성 상·하위 캠페인을 함께 보면 ROAS 격차의 원인과 재배분 방향이 드러납니다"
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <VBarChart
                  title="캠페인 ROAS 랭킹 (ROAS 높은 순, 단위: %)"
                  data={campaignRoasRanking}
                  keys={["cpa"]}
                  indexBy="label"
                  colors={campaignRoasColors}
                  valueFormat={(v) => `${v}%`}
                  height={420}
                  hideLegend
                />
                <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 16, fontFamily: "Pretendard, sans-serif" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7CCF00" }} />
                    <span style={{ fontSize: 13, color: "#171719", fontWeight: 500 }}>수익성 우수 캠페인</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF6467" }} />
                    <span style={{ fontSize: 13, color: "#171719", fontWeight: 500 }}>수익성 낮은 캠페인</span>
                  </div>
                </div>
              </ContentCard>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                <SignalCard
                  bordered={false}
                  showDivider={false}
                  variant="Positive"
                  badgePrefix="수익성 우수 캠페인"
                  title="수익성이 높은 캠페인 가운데 네이버 쇼핑검색은 CPA가 평균보다 높은데도 ROAS는 평균을 크게 웃돌아, CPA만 봐서는 놓치게 되는 객단가 효과를 보여줍니다"
                  items={[
                    "상위 5개 중 4개는 이미 브랜드를 알거나 한 번 방문했던 사용자를 다시 겨냥하는 브랜드검색·리타겟팅 계열이라, 객단가가 높고 회수율이 안정적입니다.",
                    "특히 네이버 쇼핑검색은 CPA가 평균보다 높아 비용 효율로는 평범해 보이지만, 구매 의도가 분명한 사용자라 객단가가 커져 수익성 상위에 올라옵니다.",
                  ]}
                />
                <SignalCard
                  bordered={false}
                  showDivider={false}
                  variant="Negative"
                  badgePrefix="수익성 낮은 캠페인"
                  title="효율이 낮은 캠페인은 카카오·메타 두 매체에 집중되어 있고, CPA로는 평범해 보이는 일부 캠페인도 ROAS는 평균을 크게 밑돕니다"
                  items={[
                    "카카오 비즈보드·친구메시지는 광고비조차 회수하지 못해 즉시 정리 대상입니다.",
                    "메타 신규유입은 메타 안에서도 회수율이 가장 낮아 타겟을 다시 잡아야 하고, 메타 브랜드인지 영상은 CPA로는 평균 수준이지만 ROAS는 평균을 크게 밑돌아 비용 효율과 수익성이 어긋나는 대표 사례입니다.",
                    "네이버 파워링크 브랜드는 CPA도 평균보다 높고 ROAS도 부진해 입찰가와 키워드를 모두 점검해야 합니다.",
                  ]}
                />
              </div>
              <ContentCard padding={0}>
                <DataTable columns={campaignColumns} data={campaignData} />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 8: 주별 ROAS 추이 — MultiLineChart */}
        <div>
          <SectionHeading
            overline="주별 추이"
            title="4주 차에 카카오 ROAS가 80%까지 떨어지고 메타도 220%로 내려와, 월 후반으로 갈수록 두 매체의 회수율이 뚜렷하게 나빠지고 있습니다"
            description="전체 ROAS는 2주 차에 정점을 찍었다가 3·4주 차에 다시 내려왔는데, 4주 차 하락은 대부분 카카오의 급락과 메타의 추가 하락에서 발생했습니다. 메타는 4주 내내 완만한 하락세를 이어가고 있어 소재 피로 신호가 누적되고 있습니다."
          />
          <ReportSection>
            <SectionCard>
              <ContentCard padding={40}>
                <MultiLineChart
                  title="매체별 주별 ROAS 추이 (단위: %)"
                  curve="linear"
                  data={weeklyTrendData}
                  height={420}
                  colors={[...CHART_COLORS.slice(0, 4), "#B6B8BD"]}
                />
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Section 9: 예산 재배분 로드맵 */}
        <div>
          <SectionHeading
            overline="예산 재배분 로드맵"
            title="카카오·메타·네이버 비효율 캠페인을 차례로 정리하고 재설계하면, 즉시·단기 액션 누적으로 전체 ROAS를 382%에서 403%까지 올릴 수 있습니다"
            description="비효율은 두 군데에서 나오고 있습니다. 카카오는 두 캠페인 모두 ROAS가 광고비를 회수하지 못하는 수준이고, 메타는 신규유입·브랜드인지 영상의 ROAS가 평균을 크게 밑돕니다. 가장 먼저 카카오 두 캠페인을 정리해 약 335만 원을 ROAS 460%가 검증된 구글 디스플레이 리마케팅으로 옮기고, 메타 두 캠페인의 소재·타겟을 교체합니다. 이어서 네이버 파워링크 브랜드 키워드 구조를 정비하고, 길게는 매체별 ROAS 벤치마크를 세워 분기마다 점검합니다."
          />
          <ReportSection>
            <StrategyRoadmapHorizontal periods={[
                  {
                    badge: "즉시", period: "1주 이내",
                    rows: [
                      {
                        strategy: "카카오 캠페인 2개 예산 축소 및 구글 재배분",
                        objective: "카카오 비효율 캠페인 약 335만 원을 ROAS가 검증된 구간으로 이동",
                        actionPlan: "카카오 비즈보드 집행 중단\n친구메시지 예산 50% 축소 후 재평가\n확보한 약 335만 원을 구글 디스플레이 리마케팅으로 이동",
                        expectedImpact: "월 매출 7.22억 → 7.34억 원 (+1,200만 원)\n전체 ROAS 382% → 388%",
                      },
                      {
                        strategy: "메타 브랜드인지 영상 소재 A/B 교체",
                        objective: "메타 브랜드인지 영상 ROAS를 220%에서 메타 평균(257%) 위 290%까지 회복",
                        actionPlan: "신규 영상 3종 제작·동시 집행\n기존 소재는 노출 점유 30% 이하로 제한",
                        expectedImpact: "메타 ROAS 257% → 280%\n월 매출 5,346만 → 5,820만 원 (+474만 원)",
                      },
                    ],
                  },
                  {
                    badge: "단기", period: "1개월 이내",
                    rows: [
                      {
                        strategy: "메타 신규유입 타겟 재정의",
                        objective: "메타 신규유입 ROAS를 180%에서 메타 평균(257%) 수준인 260%까지 회복",
                        actionPlan: "신규유입 타겟을 자사 고객 유사 타겟과 경쟁사 사이트 방문자로 좁힘\n전환 데이터 기반 자동 입찰 전략 적용",
                        expectedImpact: "메타 신규유입 ROAS 180% → 260%\n월 매출 1,326 → 1,915만 원 (+589만 원)",
                      },
                      {
                        strategy: "네이버 브랜드 키워드 구조 재설계",
                        objective: "파워링크 브랜드 ROAS를 280%에서 쇼핑검색 수준(410%)까지 개선",
                        actionPlan: "브랜드 키워드 입찰가 재책정\n경쟁사 브랜드 침투 방어 영역만 유지\n검색 쿼리 리포트로 비효율 쿼리 제외",
                        expectedImpact: "네이버 ROAS 345% → 380%\n월 매출 1.74억 → 1.91억 원",
                      },
                    ],
                  },
                  {
                    badge: "중기", period: "3개월 이내",
                    rows: [
                      {
                        strategy: "매체별 ROAS 벤치마크 수립 및 분기 점검",
                        objective: "즉시·단기 액션 4건의 누적 효과를 안정화하고 추가 비효율 캠페인을 분기마다 정리해 ROAS를 자체 운영 체계로 유지",
                        actionPlan: "구글·네이버·메타·카카오 매체별 목표 ROAS·CPA 벤치마크 수립\n월별 매체 비중·ROAS 점검 주기 정착\n벤치마크 미달 캠페인 자동 경고 규칙 도입",
                        expectedImpact: "전체 ROAS 382% → 403%\n월 매출 7.22억 → 7.62억 원 (+4,000만 원, 즉시·단기 누적)",
                      },
                    ],
                  },
                ]} />
          </ReportSection>
        </div>

      </ReportPage>
    </PageWrapper>
  );
}
