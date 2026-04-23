import { useState } from "react";
import { T, InfoFillIcon, CheckCircleIcon, CheckCircleOutlineIcon, IdentityPlatformIcon, IdentityPlatformOutlineIcon, PersonIcon } from "./tokens.jsx";
import { CHART_COLORS, DonutChart, LineChart, VBarChart, FunnelChart } from "./charts";
import {
  PageWrapper, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  InfoCard, InfoCardRow,
  PersonaCard, PersonaSummaryCard, MiniStatGrid,
  TextBlock, KeyFindings, Interpretation, InsightCard,
  DataTable, DefinitionTable, QATable,
  StatRowGroup, StatRow, SignalCard,
  StrategyCard,
  InsightContent,
  ContentArea,
  UserCard,
  RespondentCard,
  StrategyRoadmapTable,
  ExpectedResultsGrid,
  ExecutionRoadmap,
  ExecutiveSummaryCard,
  WeeklyPlanTable,
  ClusterProfileTable,
} from "./report-components";

const F = "Pretendard, sans-serif";
const Section = ({ children }) => <div style={{ marginBottom: 60 }}>{children}</div>;
const Label = ({ children, style }) => <div style={{ fontSize: 11, fontWeight: 600, color: T.gray400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily: F, ...style }}>{children}</div>;
const Row = ({ children, gap = 16 }) => <div style={{ display: "flex", gap, flexWrap: "wrap", marginBottom: 16 }}>{children}</div>;
const PillFilter = ({ options, value, onChange, style }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 20, ...style }}>
    {options.map(o => (
      <button key={o.value} onClick={() => onChange(o.value)} style={{
        padding: "4px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
        fontSize: 12, fontWeight: 500, fontFamily: F,
        background: value === o.value ? T.gray990 : T.gray100,
        color: value === o.value ? T.white : T.gray990,
      }}>{o.label}</button>
    ))}
  </div>
);
const Toggle = ({ value, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 500, color: T.gray800, fontFamily: F, cursor: "pointer", marginLeft: "auto", whiteSpace: "nowrap" }}>
    <div onClick={() => onChange(!value)} style={{
      width: 36, height: 20, borderRadius: 10, padding: 2,
      background: value ? T.gray990 : T.gray300,
      transition: "background 0.2s", cursor: "pointer",
      display: "flex", alignItems: "center",
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: 8, background: T.white,
        transform: value ? "translateX(16px)" : "translateX(0)",
        transition: "transform 0.2s",
      }} />
    </div>
    {label}
  </label>
);

export default function ReportDemo() {
  const [contentCount, setContentCount] = useState(1);
  return (
    <PageWrapper>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: T.gray990, margin: 0, fontFamily: F }}>Report Components</h1>
        <p style={{ fontSize: 14, color: T.gray800, marginTop: 8, fontFamily: F }}>Showcase of all report template components</p>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 1. LAYOUT — Section Title                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label style={{ marginBottom: 40 }}>1. Layout — Section Title</Label>

        {/* Variant A: Overline + Title + Description + Content Area */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>With Content Area</div>
          <ContentHeader overline="Overline" title="Content Title" description="Content description appears inside the border, above the gray area." />
          <SectionCard>
            <ContentCard>
              <div style={{ padding: 24, height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                Content Area
              </div>
            </ContentCard>
          </SectionCard>
        </div>

        {/* Variant B: Overline + Title + Description (Content Area 없음) */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Header Only</div>
          <ContentHeader overline="Overline" title="Content Title" description="Content description appears inside the border, above the gray area." />
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 1-1. LAYOUT — Content Area 개수 (1~4)              */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>1-1. Layout — Content Area 개수</Label>
        <PillFilter
          options={[
            { value: 1, label: "1개" },
            { value: 2, label: "2개" },
            { value: 3, label: "3개" },
            { value: 4, label: "4개" },
          ]}
          value={contentCount}
          onChange={setContentCount}
        />
        <SectionCard>
          {Array.from({ length: contentCount }, (_, i) => (
            <ContentCard key={i}>
              <div style={{ padding: 24, height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                Content Area {String.fromCharCode(65 + i)}
              </div>
            </ContentCard>
          ))}
        </SectionCard>
      </Section>


      <Section>
        <Label>1. TextBlock — With Bullets</Label>
        <SectionCard>
          <ContentCard>
            <TextBlock title="Key Findings" bordered={false} items={[
              "핵심 발견 사항 1: 고객 세션 간격이 평균 4.2일에서 8.7일로 증가했습니다.",
              "핵심 발견 사항 2: 자산 연결 기능 사용률이 3.2%로 크게 하락했습니다.",
              "핵심 발견 사항 3: 최근 2주간 고객 지원 티켓이 4건 발생하며 불만이 증가하고 있습니다.",
            ]} />
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>1. TextBlock — Without Bullets</Label>
        <SectionCard>
          <ContentCard>
            <TextBlock title="Interpretation" bordered={false}>
              분석 결과, 해당 고객군은 초기 온보딩 이후 핵심 기능에 대한 재참여율이 현저히 낮은 것으로 나타났습니다. 특히 자산 연결 기능의 미활용이 이탈 신호의 주요 원인으로 작용하고 있으며, 세션 간격 증가와 지원 요청 빈도 상승이 이를 뒷받침합니다. 단계별 개입 전략을 통해 복귀율 개선이 가능할 것으로 판단됩니다.
            </TextBlock>
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>2. SignalCard — With Callout</Label>
        <SectionCard>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { number: 1, title: "고객 세션 간격 급증", items: ["최근 30일 평균 세션 간격 4.2일 → 8.7일로 증가", "주간 활성 세션 수 57% 감소", "마지막 접속 후 12일 경과"], alert: "세션 간격 임계치 초과" },
              { number: 2, title: "자산 연결 기능 미활용", items: ["자산 연결 기능 사용률 3.2%로 하락", "최초 온보딩 이후 기능 재사용 없음"], alert: "핵심 기능 이탈 위험" },
              { number: 3, title: "고객 지원 요청 증가", items: ["최근 2주간 지원 티켓 4건 발생", "평균 응답 대기 시간 48시간 초과", "부정적 피드백 비율 67%"], alert: "고객 만족도 하락 감지" },
            ].map((s, i) => (
              <SignalCard key={i} number={s.number} title={s.title} items={s.items} alert={s.alert} alertVariant="Cautionary" bordered={false} />
            ))}
          </div>
        </SectionCard>
      </Section>

      <Section>
        <Label>2. SignalCard — Without Callout (default Info / 부정 내용은 Negative)</Label>
        <SectionCard>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
            {[
              { number: 1, variant: "Negative", title: "기능 오류·결제/환불 두 카테고리가 전체 NPS를 끌어내림", items: ["전체 NPS 하락의 주요 원인이 두 카테고리에 집중됨", "전담 자원·우선순위 체계 부재로 처리 지연·SLA 위반 누적"] },
              { number: 2, title: "해결시간이 곧 만족도", items: ["모든 카테고리에서 해결시간이 길수록 NPS 하락", "임계 시간을 넘기면 만족도가 급격히 떨어짐"] },
              { number: 3, title: "카테고리 특성과 무관한 일괄 SLA 적용", items: ["해결시간 4배 격차 카테고리들이 같은 큐에서 처리됨", "복잡한 카테고리일수록 SLA 위반이 구조적으로 발생"] },
            ].map((s, i) => (
              <SignalCard key={i} number={s.number} variant={s.variant} title={s.title} items={s.items} bordered={false} />
            ))}
          </div>
        </SectionCard>
      </Section>

      <Section>
        <Label>2. SignalCard — Without Callout (StrategyCard 스타일)</Label>
        <SectionCard>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { badge: { text: "Low-Price Strategy", type: "Solid", size: "Medium", variant: "Positive" }, price: "$1,181.82", priceLabel: "PMC-Based Price", desc: "원가 기반의 최저가 전략으로, 시장 진입 초기 점유율 확보에 적합합니다. 경쟁사 대비 가격 우위를 통해 빠른 고객 확보가 가능합니다." },
              { badge: { text: "Balanced Strategy", type: "Solid", size: "Medium", variant: "Info" }, price: "$1,311.48", priceLabel: "IPP-Based Price", desc: "업계 평균과 고객 기대를 반영한 균형 전략입니다. 수익성과 경쟁력을 동시에 확보하며 안정적인 시장 포지셔닝이 가능합니다." },
              { badge: { text: "Premium Strategy", type: "Solid", size: "Medium", variant: "Secondary" }, price: "$1,408.00", priceLabel: "PME-Based Price", desc: "프리미엄 포지셔닝을 통한 고수익 전략입니다. 브랜드 가치와 차별화된 서비스를 기반으로 높은 마진율을 확보합니다." },
            ].map((s, i) => (
              <StrategyCard key={i} badge={s.badge} price={s.price} priceLabel={s.priceLabel} bordered={false} style={{ background: T.white }}>
                {s.desc}
              </StrategyCard>
            ))}
          </div>
        </SectionCard>
      </Section>

      <Section>
        <Label>2-2. InsightContent (Content Area) — Vertical</Label>
        <ContentArea wrap={true}>
          {[
            { icon: <CheckCircleOutlineIcon size={20} color={T.gray800} />, header: "Current Price Position", title: "가격 설정 시 OLED·게이밍·AI 업스케일링을 묶은 '하이엔드 경험'이라는 포지셔닝을 지키는지의 기준 필요", description: "만약 내부적으로 $1,500 전후를 목표 가격으로 논의 중이라면, 이는 '프리미엄이지만 과도하지 않은' 포지션에 해당하며, 상위 소득군의 Expensive 평균보다도 충분히 낮아 상단 수요층에는 매력적으로 보일 가능성이 큽니다." },
            { icon: <CheckCircleOutlineIcon size={20} color={T.gray800} />, header: "Strategic Direction", title: "메인 가격 전략은 프리미엄 중심으로 두되, 단기 침투는 가격 인하가 아닌 한시적 프로모션·번들·할부조건 강화로 대응", description: "PSM 구조상 OPP가 허용 범위의 상단부에, IPP가 그보다 약 9% 낮은 지점에 위치한다는 점은 이 제품이 '본질적으로 프리미엄 전략에 더 적합한 상품'임을 시사합니다." },
            { icon: <CheckCircleOutlineIcon size={20} color={T.gray800} />, header: "Price Resistance Zone", title: "$1,675(PME) 구간은 정가를 두더라도 실제 결제 체감가로는 피해야 할 가격 저항 벨트로 보는 것이 안전", description: "실무적으로는 권장소비자가를 $1,599~$1,649 수준에 두고, 카드 할인/포인트/캐시백/오프라인 협상 가격 등을 통해 실결제가 $1,500 안팎으로 떨어지도록 설계하면, 표면상 프리미엄 이미지는 유지하면서도 소비자 체감 저항을 효과적으로 흡수할 수 있습니다." },
          ].map((it, i) => (
            <InsightContent
              key={i}
              layout="vertical"
              wrap={true}
              icon={it.icon}
              header={it.header}
              title={it.title}
              description={it.description}
            />
          ))}
        </ContentArea>
      </Section>

      <Section>
        <Label>2-2. InsightContent (Content Area) — Horizontal</Label>
        <ContentArea wrap={true}>
          {[
            { label: "고유 고객 수", value: "24명", items: [
              "전체 고객 대비 약 30%를 차지하는 대규모 이탈 위험 고객군으로, 서비스 안정성에 중대한 영향을 미침",
              "24명으로 전체 80명 중 상당 비중 차지",
              "대규모 군집인 만큼 개별 맞춤형보다는 군집 특성 기반의 전략 수립이 효과적",
            ]},
            { label: "고객 1인당 평균 이벤트 수", value: "20.2건", items: [
              "중간 수준의 활동량으로 초기 관심은 있으나 습관화 실패 가능성 높음",
              "20.2건으로 중간 범위에 해당, 장기 이용 후 이탈 가능성 시사",
              "이벤트 수는 있으나 자산 연결 기능 체험 부족, 온보딩 및 기능 유도 강화 필요",
            ]},
            { label: "세션 간 평균 간격", value: "5.25일", items: [
              "주 1회 이하 접속 빈도로 이탈 가능성 증가 구간",
              "전체 평균 대비 117.8% 수준으로 재방문 주기 다소 길어짐",
              "접속 빈도 증가를 위한 리마인더 및 개인화 알림 전략 필요",
            ]},
          ].map((it, i) => (
            <InsightContent
              key={i}
              layout="horizontal"
              wrap={true}
              label={it.label}
              value={it.value}
              items={it.items}
            />
          ))}
        </ContentArea>
      </Section>

      <Section>
        <Label>5. MiniStatGrid</Label>
        <MiniStatGrid items={[
          { label: "Category A", value: "44.2K", sub: "25.9% of total" },
          { label: "Category B", value: "33.1K", sub: "19.4% of total" },
          { label: "Category C", value: "28.5K", sub: "16.7% of total" },
          { label: "Category D", value: "12.8K", sub: "7.5% of total" },
        ]} />
      </Section>

      <Section>
        <Label>6. Tables — DataTable</Label>

        {/* 기본 — highlight 없음 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Default</div>
          <SectionCard>
            <ContentCard padding={0}>
              <DataTable
                columns={[
                  { key: "label", label: "Label" },
                  { key: "col1", label: "Column 1", align: "center" },
                  { key: "col2", label: "Column 2", align: "center" },
                  { key: "col3", label: "Column 3", align: "center" },
                ]}
                data={[
                  { label: "Row 1", col1: "56.3%", col2: "56.3%", col3: "56.3%" },
                  { label: "Row 2", col1: "90%", col2: "90%", col3: "90%" },
                  { label: "Row 3", col1: "86.8%", col2: "91.9%", col3: "85.15%" },
                ]}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* 컬럼 강조 — column.highlight: true (Blue) */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Column highlight — Blue (column.highlight: true)</div>
          <SectionCard>
            <ContentCard padding={0}>
              <DataTable
                columns={[
                  { key: "label", label: "Label" },
                  { key: "col1", label: "Column 1", align: "center", highlight: true },
                  { key: "col2", label: "Column 2", align: "center" },
                  { key: "col3", label: "Column 3", align: "center" },
                ]}
                data={[
                  { label: "Row 1", col1: "56.3%", col2: "56.3%", col3: "56.3%" },
                  { label: "Row 2", col1: "90%", col2: "90%", col3: "90%" },
                  { label: "Row 3", col1: "86.8%", col2: "91.9%", col3: "85.15%" },
                ]}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* 컬럼 강조 — column.highlight: "red" */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Column highlight — Red (column.highlight: "red") · 부정 지표 강조</div>
          <SectionCard>
            <ContentCard padding={0}>
              <DataTable
                columns={[
                  { key: "label", label: "Label" },
                  { key: "col1", label: "Column 1", align: "center", highlight: "red" },
                  { key: "col2", label: "Column 2", align: "center", highlight: "red" },
                  { key: "col3", label: "Column 3", align: "center" },
                ]}
                data={[
                  { label: "Row 1", col1: "-32", col2: "-58", col3: "-8" },
                  { label: "Row 2", col1: "35%", col2: "55%", col3: "15%" },
                  { label: "Row 3", col1: "22.1시간", col2: "32.5시간", col3: "14.8시간" },
                ]}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* 컬럼 강조 — column.highlight: "green" */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Column highlight — Green (column.highlight: "green") · 긍정 지표 강조</div>
          <SectionCard>
            <ContentCard padding={0}>
              <DataTable
                columns={[
                  { key: "label", label: "Label" },
                  { key: "col1", label: "Column 1", align: "center", highlight: "green" },
                  { key: "col2", label: "Column 2", align: "center", highlight: "green" },
                  { key: "col3", label: "Column 3", align: "center" },
                ]}
                data={[
                  { label: "Row 1", col1: "+42", col2: "+58", col3: "+12" },
                  { label: "Row 2", col1: "88%", col2: "92%", col3: "55%" },
                  { label: "Row 3", col1: "4.7 / 5.0", col2: "4.9 / 5.0", col3: "4.1 / 5.0" },
                ]}
              />
            </ContentCard>
          </SectionCard>
        </div>

      </Section>

      <Section>
        <Label>6. Tables — QATable (2-col)</Label>
        <SectionCard>
          <ContentCard padding={0}>
            <QATable
              bordered={false}
              columns={["Question", "Answer"]}
              rows={[
                { question: "Q. Describe the product in one sentence, focusing on its key function or differentiator", answer: "65-inch OLED with self-lit pixels, Dolby Vision IQ, 120Hz for gaming, AI 4K upscaling" },
                { question: "Q. Who is the target customer, and what challenges are they facing?", answer: "Home entertainment enthusiasts frustrated by LCD blooming, motion blur, and limited smart TV ecosystems" },
                { question: "Q. How does the product solve the customer's problem?", answer: "Perfect blacks via OLED, smooth 120Hz gaming, webOS 24 with built-in AI recommendations" },
                { question: "Q. Enter any competitor products you would like us to reference.", answer: "Sansung 65-inch OLED 4K Smart TV" },
              ]}
            />
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>6. Tables — DefinitionTable</Label>
        <SectionCard>
          <ContentCard padding={0}>
            <DefinitionTable items={[
              { color: CHART_COLORS[3], abbr: "ABC", fullName: "Full Name Description", definition: "Definition text", note: "*Additional note", price: "$1,328.95" },
              { color: CHART_COLORS[0], abbr: "DEF", fullName: "Full Name Description", definition: "Definition text", price: "$1,421.79" },
              { color: CHART_COLORS[1], abbr: "GHI", fullName: "Full Name Description", definition: "Definition text", price: "$1,562.50" },
              { color: CHART_COLORS[2], abbr: "JKL", fullName: "Full Name Description", definition: "Definition text", note: "*Additional note", price: "$1,675.00" },
            ]} />
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>6. Tables — StrategyRoadmapTable</Label>
        <SectionCard>
          <ContentCard padding={0}>
            <StrategyRoadmapTable periods={[
              {
                badge: "Immediate", period: "within 1 week",
                rows: [
                  { strategy: "긴급 윈백 캠페인", objective: "이탈 경과일 180일 미만 고객 대상 자산 연결 기능 체험 인센티브 제공", actionPlan: "개인화 푸시 알림 및 리마인더 발송, 체험 가이드 제공", expectedImpact: "복귀율 20% 이상 증가" },
                ],
              },
              {
                badge: "Short-term", period: "within 1 month",
                rows: [
                  { strategy: "세션 간격 알림 시스템 도입", objective: "세션 간격 4일 초과 시 자동 리마인드 발송", actionPlan: "앱 푸시, 이메일, SMS 등 다채널 알림", expectedImpact: "세션 간격 증가율 30% 감소" },
                  { strategy: "온보딩 플로우 재설계", objective: "다양한 기능 체험 유도 및 탐색 지원", actionPlan: "기능별 추천 콘텐츠 및 가이드 제공", expectedImpact: "기능 사용 다양성 유지 및 증가" },
                ],
              },
              {
                badge: "Mid-term", period: "within 3 months",
                rows: [
                  { strategy: "고객 지원 및 피드백 활성화", objective: "고객 불만 및 지원 요청 조기 탐지", actionPlan: "지원 채널 모니터링 강화 및 신속 대응", expectedImpact: "고객 만족도 향상 및 이탈 신호 조기 포착" },
                ],
              },
            ]} />
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>6. Tables — WeeklyPlanTable</Label>
        <SectionCard>
          <ContentCard padding={0}>
            <WeeklyPlanTable weeks={[
              {
                weekLabel: "Week 1",
                subtitle: "Foundation Setup & Design",
                items: [
                  { priority: "High", task: "Premium Membership Design Completed", owner: "Product Planning Team + CRM Team", define: "Annual fees and enrollment criteria; specify IT system requirements", output: "PB product planning document" },
                  { task: "PB Product Initial Lineup Finalized", owner: "Product Planning Team + CRM Team", define: "Annual fees and enrollment criteria; specify IT system requirements", output: "PB product planning document" },
                  { task: "IT System Development Scope Definition", owner: "Product Planning Team + CRM Team", define: "Annual fees and enrollment criteria; specify IT system requirements", output: "PB product planning document" },
                ],
              },
              {
                weekLabel: "Week 2",
                subtitle: "Foundation Setup & Design",
                items: [
                  { priority: "High", task: "Membership API Development", owner: "Engineering Team", define: "Backend API endpoints and DB schema", output: "Working API endpoints" },
                  { task: "PB Product Sourcing Confirmed", owner: "Merchandising Team", define: "Vendor contracts and pricing finalized", output: "Signed vendor agreements" },
                  { task: "QA Test Plan Created", owner: "QA Team", define: "Test scenarios for membership flow", output: "Test plan document" },
                ],
              },
              {
                weekLabel: "Week 3",
                subtitle: "Foundation Setup & Design",
                items: [
                  { priority: "High", task: "Pilot Group Rollout", owner: "Operations Team", define: "1,000 pilot users selected and onboarded", output: "Pilot user cohort" },
                  { task: "Marketing Campaign Drafted", owner: "Marketing Team", define: "Channel strategy and creative assets", output: "Campaign brief" },
                  { task: "CS Training Completed", owner: "CS Team", define: "FAQ and escalation procedures", output: "Training materials" },
                ],
              },
              {
                weekLabel: "Week 4",
                subtitle: "Foundation Setup & Design",
                items: [
                  { priority: "High", task: "Public Launch", owner: "Marketing Team", define: "Full-scale rollout with PR announcement", output: "Live product" },
                  { task: "Performance Dashboard Live", owner: "Data Team", define: "KPI tracking and alerts configured", output: "Dashboard URL" },
                  { task: "Post-Launch Review Scheduled", owner: "All Teams", define: "Retrospective meeting and report", output: "Review document" },
                ],
              },
            ]} />
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>6. Tables — ClusterProfileTable</Label>
        <SectionCard>
          <ContentCard padding={0}>
            <ClusterProfileTable
              data={{
                clusters: [
                  { keywords: ["30대 초중반", "재미있고", "트렌디한 사람"] },
                  { keywords: ["20대 초중반", "트렌디하고", "사교적인 여성"] },
                  { keywords: ["20대 초중반", "매니아스럽고", "트렌디한 여성"] },
                ],
                categories: [
                  {
                    label: "성별",
                    ranks: ["1순위", "2순위"],
                    values: [["중성", "남성"], ["여성", "중성"], ["여성", "중성"]],
                  },
                  {
                    label: "연령",
                    ranks: ["1순위", "2순위", "3순위"],
                    values: [
                      ["30대 초중반", "20대 초중반", "20대 후반"],
                      ["20대 초중반", "20대 후반", "30대 초중반"],
                      ["20대 초중반", "10대 후반", "20대 후반"],
                    ],
                  },
                  {
                    label: "성격",
                    ranks: ["1순위", "2순위", "3순위", "4순위"],
                    values: [
                      ["재미있는", "트렌디한", "창의적인", "도전적인"],
                      ["트렌디한", "사교적인", "허세가 많은", "재미있는"],
                      ["매니아스러운", "트렌디한", "참견을 잘하는", "산만한"],
                    ],
                  },
                ],
              }}
            />
          </ContentCard>
        </SectionCard>
      </Section>

      <Section>
        <Label>7. ExecutiveSummaryCard</Label>

        {/* Variant A: summaryItems 있는 케이스 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>With Summary Items</div>
          <ContentHeader overline="Overline" title="Content Title" description="Content description appears inside the border, above the gray area." />
          <ExecutiveSummaryCard
            title={null}
            summaryItems={[
              { label: "Survey Topic", value: "New premium membership launch response survey" },
              { label: "Number of respondents", value: "5,000" },
            ]}
            findings={{
              title: "Key Findings",
              items: [
                "Subscription intent : High or higher (68%)",
                "Most desired benefit : Ad-free viewing (72%)",
                "Main concern : Price burden (45%)",
                "Reasonable price : $10-15 (52%)",
              ],
            }}
          />
        </div>

        {/* Variant B: summaryItems 없는 케이스 (findings 만, Executive Summary 타이틀 제거) */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Findings Only (데이터에 지표 없을 때)</div>
          <ContentHeader overline="Overline" title="Content Title" description="Content description appears inside the border, above the gray area." />
          <ExecutiveSummaryCard
            title={null}
            findings={{
              title: "Key Findings",
              items: [
                "Subscription intent : High or higher (68%)",
                "Most desired benefit : Ad-free viewing (72%)",
                "Main concern : Price burden (45%)",
                "Reasonable price : $10-15 (52%)",
              ],
            }}
          />
        </div>
      </Section>

      <Section>
        <Label>8. ExecutionRoadmap</Label>
        <ContentHeader overline="Overline" title="Content Title" description="Content description appears inside the border, above the gray area." />
        <ExecutionRoadmap
          weeks={[
            {
              tab: "Week 1",
              weekLabel: "Week 1 (D+1 to D+7): Foundation Setup & Design",
              items: [
                {
                  title: "Premium Membership Design Completed",
                  priority: "High",
                  bullets: [
                    "Owner: Product Team",
                    "Define: Tier structure, benefits matrix, pricing",
                    "Output: Membership spec document",
                  ],
                },
                {
                  title: "PB Product Initial Lineup Finalized",
                  priority: "Medium",
                  bullets: [
                    "Owner: Merchandising Team",
                    "Define: 20 SKUs across 5 categories",
                    "Output: Product spec sheet",
                  ],
                },
                {
                  title: "IT System Development Scope Definition",
                  priority: "High",
                  bullets: [
                    "Owner: Engineering Team",
                    "Define: Backend API, membership DB schema",
                    "Output: Technical requirements document",
                    "Dependency: Membership Design Completion",
                  ],
                },
              ],
            },
            {
              tab: "Week 2",
              weekLabel: "Week 2 (D+8 to D+14): Development & Validation",
              items: [
                {
                  title: "Membership API Development",
                  priority: "High",
                  bullets: [
                    "Owner: Engineering Team",
                    "Output: Working API endpoints",
                  ],
                },
              ],
            },
            {
              tab: "Week 3",
              weekLabel: "Week 3 (D+15 to D+21): Pilot Launch",
              items: [
                {
                  title: "Pilot Group Rollout",
                  priority: "Medium",
                  bullets: [
                    "Owner: Operations Team",
                    "Output: 1,000 pilot users onboarded",
                  ],
                },
              ],
            },
            {
              tab: "Week 4",
              weekLabel: "Week 4 (D+22 to D+30): Full Launch",
              items: [
                {
                  title: "Public Launch",
                  priority: "High",
                  bullets: [
                    "Owner: Marketing Team",
                    "Output: Full-scale rollout with PR announcement",
                  ],
                },
              ],
            },
          ]}
        />
      </Section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 9. COMPOSITE PATTERNS — 7 권장 조합                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Section>
        <Label>9. 래핑 조합 예시 (Composite Patterns)</Label>
        <div style={{ fontSize: 13, color: T.gray800, marginBottom: 16 }}>
          여러 컴포넌트를 SectionCard로 묶는 권장 조합 7가지
        </div>

        {/* 9-1. SignalCard + 그래프 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>① SignalCard + 그래프</div>
          <SectionCard>
            <div style={{ display: "flex", gap: 8 }}>
              <SignalCard number={1} title="days_inactive 증가" items={["days_inactive 평균 약 190.47일", "7일 기준 CHURN에 앞서 30일·60일 구간에서 단계별 개입 전략이 필요합니다."]} alert="원인: 장기간 재접속 유인이 부족, 가치 체험 실패 누적" alertVariant="Cautionary" bordered={false} />
              <SignalCard number={2} title="total_sessions (세션 수) 저하" items={["total_sessions 평균 6.25회 (user_stats 전체 평균), 군집 평균 5.84회", "세션 증대를 위한 주기적 리마인더와 가치형 알림 필요"]} alert="원인: 재참여 유인 부족(콘텐츠·알림 미흡)" alertVariant="Cautionary" bordered={false} />
              <SignalCard number={3} title="asset_link (자산 연결) 사용 저조" items={["asset_link 이벤트 28건(6.22%)", "첫 세션 내 asset_link 필수화 또는 인센티브 제공 필요"]} alert="원인: 전환 유도 UI/CTA 부재 또는 가치 제시 미약" alertVariant="Cautionary" bordered={false} />
            </div>
            <ContentCard padding={40}>
              <LineChart title="Projected Churn Rate" variant="red" enableArea data={[{ id: "Churn Rate", data: [
                { x: "2024-05", y: 75 }, { x: "2024-06", y: 82 }, { x: "2024-07", y: 93 }, { x: "2024-08", y: 97 }, { x: "2024-09", y: 100 },
              ]}]} />
            </ContentCard>
            <ContentCard>
              <TextBlock title="Projected Churn Rate" bordered={false}>
                동일 추세 지속시 3개월 후 이탈률 100% 예상, 6개월 후 이탈률 100% 예상됩니다.
              </TextBlock>
            </ContentCard>
          </SectionCard>
        </div>

        {/* 9-2. InsightContent + 그래프 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>② InsightContent + 그래프</div>
          <SectionCard>
            <ContentCard padding={40}>
              <LineChart title="Subscription Intent Trend" variant="red" enableArea data={[{ id: "Intent", data: [
                { x: "2024-05", y: 70 }, { x: "2024-06", y: 80 }, { x: "2024-07", y: 92 }, { x: "2024-08", y: 96 }, { x: "2024-09", y: 100 },
              ]}]} />
            </ContentCard>
            <InsightContent layout="vertical" wrap={true}
              icon={<CheckCircleOutlineIcon size={20} color={T.gray800} />} header="Current Price Position"
              title="가격 설정 시 OLED·게이밍·AI 업스케일링을 묶은 '하이엔드 경험'이라는 포지셔닝을 지키는지의 기준 필요"
              description="만약 내부적으로 $1,500 전후를 목표 가격으로 논의 중이라면..." />
            <InsightContent layout="vertical" wrap={true}
              icon={<CheckCircleOutlineIcon size={20} color={T.gray800} />} header="Strategic Direction"
              title="메인 가격 전략은 프리미엄 중심으로 두되, 단기 침투는 가격 인하가 아닌 한시적 프로모션"
              description="PSM 구조상 OPP가 허용 범위의 상단부에, IPP가 그보다 약 9% 낮은 지점에 위치한다는 점..." />
            <InsightContent layout="vertical" wrap={true}
              icon={<CheckCircleOutlineIcon size={20} color={T.gray800} />} header="Price Resistance Zone"
              title="$1,675(PME) 구간은 정가를 두더라도 실제 결제 체감가로는 피해야 할 가격 저항 벨트로 보는 것이 안전"
              description="실무적으로는 권장소비자가를 $1,599~$1,649 수준에 두고..." />
          </SectionCard>
        </div>

        {/* 9-3. 그래프 + TextBlock */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>③ 그래프 + TextBlock</div>
          <SectionCard>
            <ContentCard padding={40}>
              <div style={{ display: "flex", gap: 32, justifyContent: "space-around" }}>
                <DonutChart title="Response Rate by Age Group" size={200} data={[
                  { id: "Age 15-19", value: 25 }, { id: "Age 20-24", value: 10 }, { id: "Age 30-39", value: 15 },
                  { id: "Age 40-49", value: 45 }, { id: "Age 50-59", value: 5 },
                ]} />
                <DonutChart title="Response Distribution by Gender" size={200} data={[
                  { id: "Male", value: 56 }, { id: "Female", value: 44 },
                ]} />
              </div>
            </ContentCard>
            <ContentCard>
              <TextBlock title="Interpretation" bordered={false}>
                A total of 3,400 users (72%) expressed interest in subscribing. This suggests low resistance to the membership itself and indicates strong potential for actual conversion depending on the benefits offered.
              </TextBlock>
            </ContentCard>
          </SectionCard>
        </div>

        {/* 9-4. 그래프 + Tables */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>④ 그래프 + Tables</div>
          <SectionCard>
            <ContentCard padding={40}>
              <div style={{ display: "flex", gap: 32, justifyContent: "space-around", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <DonutChart title="Cluster Distribution" size={180} legendPosition="bottom" data={[
                    { id: "이탈 위험 집중 군집 (30대)", value: 45 },
                    { id: "이탈 고위험 소수 군집 (40대 남성)", value: 35 },
                    { id: "활동성 유지 대다수 군집 (40대 중심)", value: 20 },
                  ]} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <VBarChart title="Period Avg Churn Rate" height={240} data={[
                    { label: "이탈 위험 집중 군집", churn: 90 },
                    { label: "이탈 고위험 소수", churn: 100 },
                    { label: "활동성 유지 대다수", churn: 80 },
                  ]} keys={["churn"]} />
                </div>
              </div>
            </ContentCard>
            <ContentCard padding={0}>
              <DataTable columns={[
                { key: "metric", label: "" },
                { key: "g1", label: "이탈 위험 집중 군집 (30대)", align: "center" },
                { key: "g2", label: "이탈 고위험 소수 군집 (40대 남성)", align: "center" },
                { key: "g3", label: "활동성 유지 대다수 군집 (40대 중심)", align: "center" },
              ]} data={[
                { metric: "Cluster distribution", g1: "56.3% (45)", g2: "56.3% (45)", g3: "56.3% (45)" },
                { metric: "Churn rate", g1: "90%", g2: "90%", g3: "90%" },
                { metric: "Monthly average churn rate", g1: "86.8%", g2: "91.9%", g3: "85.15%" },
                { metric: "Cluster summary", g1: "20.2건", g2: "22.2건", g3: "18.1건" },
              ]} />
            </ContentCard>
          </SectionCard>
        </div>

        {/* 9-5. InfoCard + Tables */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>⑤ InfoCard + Tables</div>
          <SectionCard>
            <InfoCardRow>
              <InfoCard variant="outline" label="New product category" value="Electronics / Computers" />
              <InfoCard variant="outline" label="Product type" value="OLED 65-inch 4K Smart TV" />
              <InfoCard variant="outline" label="Expected price range (USD)" value="$1200 ~ $1800" />
            </InfoCardRow>
            <ContentCard padding={0}>
              <QATable bordered={false} columns={["Question", "Answer"]} rows={[
                { question: "Q. Describe the product in one sentence, focusing on its key function or differentiator", answer: "65-inch OLED with self-lit pixels, Dolby Vision IQ, 120Hz for gaming, AI 4K upscaling" },
                { question: "Q. Who is the target customer, and what challenges are they facing?", answer: "Home entertainment enthusiasts frustrated by LCD blooming, motion blur, and limited smart TV ecosystems" },
                { question: "Q. How does the product solve the customer's problem?", answer: "Perfect blacks via OLED, smooth 120Hz gaming, webOS 24 with built-in AI recommendations" },
              ]} />
            </ContentCard>
          </SectionCard>
        </div>

        {/* 9-6. TextBlock only */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>⑥ TextBlock only</div>
          <SectionCard>
            <ContentCard>
              <TextBlock title="Key Findings" bordered={false} items={["Content", "Content", "Content", "Content"]} />
            </ContentCard>
          </SectionCard>
        </div>

        {/* 9-7. TextBlock + InfoCard */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>⑦ TextBlock + InfoCard</div>
          <SectionCard>
            <InfoCardRow>
              <InfoCard variant="outline" label="New product category" value="Electronics / Computers" />
              <InfoCard variant="outline" label="Product type" value="OLED 65-inch 4K Smart TV" />
              <InfoCard variant="outline" label="Expected price range (USD)" value="$1200 ~ $1800" />
            </InfoCardRow>
            <ContentCard>
              <TextBlock title="Key Findings" bordered={false} items={["Content", "Content", "Content", "Content"]} />
            </ContentCard>
          </SectionCard>
        </div>
      </Section>

      <Section>
        <Label>UserCard (5 Types)</Label>

        <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Simple</div>
        <SectionCard style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
            <UserCard type="simple" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="최은영" subtitle="여성, 29세, 마케터"
              description='"매우 높음"으로 응답했습니다. 경쟁사 프리미엄 멤버십을 비교 중이며, 광고 제거와 콘텐츠 품질에 매우 민감합니다.' />
            <UserCard type="simple" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="박지훈" subtitle="남성, 34세, 개발자"
              description='"높음"으로 응답. 콘텐츠 다운로드와 여러 기기 지원에 관심이 많으며 주말 장시간 시청 패턴을 보입니다.' />
            <UserCard type="simple" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="김서연" subtitle="여성, 26세, 디자이너"
              description='"보통"으로 응답. 가격 민감도가 높지만 UI/UX 품질을 중요하게 여기며 트라이얼 체험을 선호합니다.' />
          </div>
        </SectionCard>

        <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Compact + CTA</div>
        <SectionCard style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
            <UserCard type="compact" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Premium Enthusiasts"
              stats={[{ value: "54.2K", label: "users" }, { value: "45.2%", label: "of total" }]}
              buttonLabel="View Detail" onButtonClick={() => alert("View Detail: Premium Enthusiasts")} />
            <UserCard type="compact" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Value Optimizers"
              stats={[{ value: "32.1K", label: "users" }, { value: "26.8%", label: "of total" }]}
              buttonLabel="View Detail" onButtonClick={() => alert("View Detail: Value Optimizers")} />
            <UserCard type="compact" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Occasional Buyers"
              stats={[{ value: "31.1K", label: "users" }, { value: "25.9%", label: "of total" }]}
              buttonLabel="View Detail" onButtonClick={() => alert("View Detail: Occasional Buyers")} />
          </div>
        </SectionCard>

        <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Stats</div>
        <SectionCard style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
            <UserCard type="stats" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Premium Enthusiasts" badge="54,200 people (45.2%)"
              details={[
                { key: "Avg Purchase", value: "₩421,000" },
                { key: "Frequency", value: "2.3 / month" },
                { key: "LTV (12m)", value: "₩8,450,000" },
                { key: "Churn Risk", value: "Score 12 (Low)" },
              ]} />
            <UserCard type="stats" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Value Optimizers" badge="32,100 people (26.8%)"
              details={[
                { key: "Avg Purchase", value: "₩185,000" },
                { key: "Frequency", value: "1.1 / month" },
                { key: "LTV (12m)", value: "₩2,420,000" },
                { key: "Churn Risk", value: "Score 67 (High)" },
              ]} />
            <UserCard type="stats" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Occasional Buyers" badge="13,800 people (11.5%)"
              details={[
                { key: "Avg Purchase", value: "₩89,000" },
                { key: "Frequency", value: "1.2 / quarter" },
                { key: "LTV (12m)", value: "₩1,120,000" },
                { key: "Churn Risk", value: "Score 78 (High)" },
              ]} />
          </div>
        </SectionCard>

        <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Detail + CTA</div>
        <SectionCard style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
            <UserCard type="detail" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Kang Taehoon" subtitle="Male, Age 27, Game Developer"
              description={'"Ad-free viewing", "Extra connections", "Offline download" 선택. 출퇴근 지하철 루틴으로 다운로드 콘텐츠 시청.'}
              buttonLabel="View Detail" onButtonClick={() => alert("View Detail: Kang Taehoon")} />
            <UserCard type="detail" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Lee Minjung" subtitle="Female, Age 31, Marketing Lead"
              description={'"4K 스트리밍", "동시 접속" 선호. 가족 공유 계정에서 개인 프로필로 전환 고려 중.'}
              buttonLabel="View Detail" onButtonClick={() => alert("View Detail: Lee Minjung")} />
            <UserCard type="detail" icon={<IdentityPlatformOutlineIcon size={24} color={T.gray800} />}
              name="Park Jisoo" subtitle="Female, Age 24, Student"
              description={'"학생 할인", "모바일 플랜" 관심. 광고 시청 대신 저가 플랜 제공 시 전환 가능성 높음.'}
              buttonLabel="View Detail" onButtonClick={() => alert("View Detail: Park Jisoo")} />
          </div>
        </SectionCard>

        <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Quote (말풍선 유저 의견) · sentiment 로 아이콘 자동 선택</div>
        <SectionCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 8, alignItems: "stretch" }}>
            <UserCard type="quote" sentiment="negative"
              name="콘텐츠 품질" subtitle="1점 · 공감 99"
              quote="진짜 피드백도 몇번이고 드렸었는데 아예 들으시지도 않고 그대로입니다. 그냥 앱 삭제하겠습니다." />
            <UserCard type="quote" sentiment="negative"
              name="가격/한도" subtitle="1점 · 공감 43"
              quote="무료 로그인 유저들 이미지 제작할때 한도 다 쓰고 풀리는 시간이 정해져있지 않아서 매우 불편하다. 개발진들이 열리는 시간 기준을 따로 해놨으면 한다." />
            <UserCard type="quote" sentiment="negative"
              name="기능/UX" subtitle="1점 · 공감 3"
              quote="지난번 업데이트 때부터 블루투스 키보드 연결안 되더니 이번 업데이트때도 해결이 안됐어요. 제대로 쓰지를 못해서 유료결제까지 취소했습니다." />
          </div>
        </SectionCard>
      </Section>

      <Section>
        <Label>1. InfoCard — Outline</Label>
        <SectionCard>
          <InfoCardRow>
            <InfoCard variant="outline" label="Label" value="Value" />
            <InfoCard variant="outline" label="Label + Description" value="+24%" description="Previous: 18%" />
            <InfoCard variant="outline" label="Label Only" value="$1,200" />
          </InfoCardRow>
        </SectionCard>
      </Section>

    </PageWrapper>
  );
}
