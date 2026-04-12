import { useState } from "react";
import { T } from "./tokens.jsx";
import { CHART_COLORS } from "./charts";
import {
  PageWrapper, SectionHeading, ReportSection, SectionCard, ContentCard, ContentHeader,
  InfoCard, InfoCardRow,
  PersonaCard, PersonaSummaryCard, MiniStatGrid,
  TextBlock, KeyFindings, Interpretation, InsightCard,
  DataTable, DefinitionTable,
  StatRowGroup, StatRow, SignalCard,
  StrategyCard,
  RespondentCard,
  StrategyRoadmapTable,
  ExpectedResultsGrid,
} from "./report-components";

const F = "Pretendard, sans-serif";
const Section = ({ children }) => <div style={{ marginBottom: 60 }}>{children}</div>;
const Label = ({ children }) => <div style={{ fontSize: 11, fontWeight: 600, color: T.gray400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily: F }}>{children}</div>;
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
  const [tableType, setTableType] = useState("data");
  const [tableWrapped, setTableWrapped] = useState(false);
  const [signalStyle, setSignalStyle] = useState("callout");
  const [signalCount, setSignalCount] = useState("3");
  const [signalCallout, setSignalCallout] = useState("Cautionary");
  const [signalWrapped, setSignalWrapped] = useState(false);
  const [textBlockStyle, setTextBlockStyle] = useState("bullets");
  const [textBlockWrapped, setTextBlockWrapped] = useState(false);
  const [compTab, setCompTab] = useState("wrapped");
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
        <Label>1. Layout — Section Title</Label>

        {/* Case 1: Section Title + Description + Content Title + Description */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Section Title + Description + Content Title + Description</div>
          <SectionHeading title="Section Title" description="Section description text goes here. This appears outside the border." />
          <ReportSection>
            <ContentHeader title="Content Title" description="Content description appears inside the border, above the gray area." />
            <SectionCard>
              <ContentCard>
                <div style={{ padding: 24, height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                  Content Area
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Case 2: Section Title + Description only */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>Section Title + Description</div>
          <SectionHeading title="Section Title" description="Section description text goes here. This appears outside the border." />
          <ReportSection>
            <SectionCard>
              <ContentCard>
                <div style={{ padding: 24, height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                  Content Area
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
        </div>

        {/* Case 3: No Section Title — border only */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.blue500, marginBottom: 8, fontFamily: F }}>without Section Title</div>
          <ReportSection>
            <SectionCard>
              <ContentCard>
                <div style={{ padding: 24, height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                  Content Area
                </div>
              </ContentCard>
            </SectionCard>
          </ReportSection>
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

      {/* ═══════════════════════════════════════════════════ */}
      {/* COMPONENT TYPE TAB                                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.gray200}`, marginBottom: 40 }}>
        {[
          { value: "wrapped", label: "Content Area 내부 요소" },
          { value: "standalone", label: "단일 컴포넌트" },
        ].map(tab => (
          <button key={tab.value} onClick={() => setCompTab(tab.value)} style={{
            padding: "12px 24px", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: compTab === tab.value ? 600 : 400, fontFamily: F,
            color: compTab === tab.value ? T.gray990 : T.gray800,
            background: "transparent",
            borderBottom: compTab === tab.value ? `2px solid ${T.gray990}` : "2px solid transparent",
            marginBottom: -1,
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ▸ Content Area 내부 요소                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      {compTab === "wrapped" && <>

      <Section>
        <Label>1. TextBlock</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <PillFilter
            options={[
              { value: "bullets", label: "With Bullets" },
              { value: "paragraph", label: "Without Bullets" },
            ]}
            value={textBlockStyle}
            onChange={setTextBlockStyle}
            style={{ marginBottom: 0 }}
          />
          <Toggle value={textBlockWrapped} onChange={setTextBlockWrapped} label="Content Area 래핑" />
        </div>
        {(() => {
          const content = textBlockStyle === "bullets" ? (
            <TextBlock title="Key Findings" bordered={!textBlockWrapped} items={[
              "핵심 발견 사항 1: 고객 세션 간격이 평균 4.2일에서 8.7일로 증가했습니다.",
              "핵심 발견 사항 2: 자산 연결 기능 사용률이 3.2%로 크게 하락했습니다.",
              "핵심 발견 사항 3: 최근 2주간 고객 지원 티켓이 4건 발생하며 불만이 증가하고 있습니다.",
            ]} />
          ) : (
            <TextBlock title="Interpretation" bordered={!textBlockWrapped}>
              분석 결과, 해당 고객군은 초기 온보딩 이후 핵심 기능에 대한 재참여율이 현저히 낮은 것으로 나타났습니다. 특히 자산 연결 기능의 미활용이 이탈 신호의 주요 원인으로 작용하고 있으며, 세션 간격 증가와 지원 요청 빈도 상승이 이를 뒷받침합니다. 단계별 개입 전략을 통해 복귀율 개선이 가능할 것으로 판단됩니다.
            </TextBlock>
          );
          if (!textBlockWrapped) return content;
          return (
            <SectionCard>
              <ContentCard>{content}</ContentCard>
            </SectionCard>
          );
        })()}
      </Section>

      <Section>
        <Label>2. SignalCard</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <PillFilter
            options={[
              { value: "callout", label: "With Callout" },
              { value: "plain", label: "Without Callout" },
            ]}
            value={signalStyle}
            onChange={setSignalStyle}
            style={{ marginBottom: 0 }}
          />
          <PillFilter
            options={[
              { value: "2", label: "2 Cards" },
              { value: "3", label: "3 Cards" },
            ]}
            value={signalCount}
            onChange={setSignalCount}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          {signalStyle === "callout" && (
            <PillFilter
              options={[
                { value: "Primary", label: "Primary" },
                { value: "Secondary", label: "Secondary" },
                { value: "Positive", label: "Positive" },
                { value: "Negative", label: "Negative" },
                { value: "Cautionary", label: "Cautionary" },
                { value: "Info", label: "Info" },
              ]}
              value={signalCallout}
              onChange={setSignalCallout}
              style={{ marginBottom: 0 }}
            />
          )}
          <Toggle value={signalWrapped} onChange={setSignalWrapped} label="Content Area 래핑" />
        </div>
        {(() => {
          if (signalStyle === "callout") {
            const signalData = [
              { number: 1, title: "고객 세션 간격 급증", items: ["최근 30일 평균 세션 간격 4.2일 → 8.7일로 증가", "주간 활성 세션 수 57% 감소", "마지막 접속 후 12일 경과"], alert: "세션 간격 임계치 초과" },
              { number: 2, title: "자산 연결 기능 미활용", items: ["자산 연결 기능 사용률 3.2%로 하락", "최초 온보딩 이후 기능 재사용 없음"], alert: "핵심 기능 이탈 위험" },
              { number: 3, title: "고객 지원 요청 증가", items: ["최근 2주간 지원 티켓 4건 발생", "평균 응답 대기 시간 48시간 초과", "부정적 피드백 비율 67%"], alert: "고객 만족도 하락 감지" },
            ];
            const cards = signalCount === "2" ? signalData.slice(0, 2) : signalData;
            const cardContent = (
              <div style={{ display: "flex", gap: 8 }}>
                {cards.map((s, i) => (
                  <SignalCard key={i} number={s.number} title={s.title} items={s.items} alert={s.alert} alertVariant={signalCallout} bordered={!signalWrapped} />
                ))}
              </div>
            );
            if (!signalWrapped) return cardContent;
            return <SectionCard>{cardContent}</SectionCard>;
          }
          /* Without Callout — StrategyCard 스타일 */
          const strategyData = [
            { badge: { text: "Low-Price Strategy", type: "Solid", size: "Medium", variant: "Brand" }, price: "$1,181.82", priceLabel: "PMC-Based Price", desc: "원가 기반의 최저가 전략으로, 시장 진입 초기 점유율 확보에 적합합니다. 경쟁사 대비 가격 우위를 통해 빠른 고객 확보가 가능합니다." },
            { badge: { text: "Balanced Strategy", type: "Solid", size: "Medium", variant: "Info" }, price: "$1,311.48", priceLabel: "IPP-Based Price", desc: "업계 평균과 고객 기대를 반영한 균형 전략입니다. 수익성과 경쟁력을 동시에 확보하며 안정적인 시장 포지셔닝이 가능합니다." },
            { badge: { text: "Premium Strategy", type: "Solid", size: "Medium", variant: "Secondary" }, price: "$1,408.00", priceLabel: "PME-Based Price", desc: "프리미엄 포지셔닝을 통한 고수익 전략입니다. 브랜드 가치와 차별화된 서비스를 기반으로 높은 마진율을 확보합니다." },
          ];
          const cards = signalCount === "2" ? strategyData.slice(0, 2) : strategyData;
          const cardContent = (
            <div style={{ display: "flex", gap: 8 }}>
              {cards.map((s, i) => (
                <StrategyCard key={i} badge={s.badge} price={s.price} priceLabel={s.priceLabel} bordered={!signalWrapped} style={{ background: T.white }}>
                  {s.desc}
                </StrategyCard>
              ))}
            </div>
          );
          if (!signalWrapped) return cardContent;
          return <SectionCard>{cardContent}</SectionCard>;
        })()}
      </Section>

      <Section>
        <Label>3. PersonaSummaryCard</Label>
        <Row>
          <PersonaSummaryCard name="Group Name A" trait="Trait Label" items={[
            "Bullet point 1",
            "Bullet point 2",
            "Bullet point 3",
          ]} />
          <PersonaSummaryCard name="Group Name B" trait="Trait Label" items={[
            "Bullet point 1",
            "Bullet point 2",
            "Bullet point 3",
          ]} />
        </Row>
      </Section>

      <Section>
        <Label>4. StatRow</Label>
        <StatRowGroup>
          <StatRow label="Label A" value="24" items={[
            "Bullet description 1",
            "Bullet description 2",
            "Bullet description 3",
          ]} />
          <StatRow label="Label B" value="20.2" items={[
            "Bullet description 1",
            "Bullet description 2",
            "Bullet description 3",
          ]} />
          <StatRow label="Label C" value="5.25" items={[
            "Bullet description 1",
            "Bullet description 2",
            "Bullet description 3",
          ]} />
        </StatRowGroup>
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
        <Label>6. Tables</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <PillFilter
            options={[
              { value: "data", label: "DataTable" },
              { value: "def", label: "DefinitionTable" },
              { value: "roadmap", label: "StrategyRoadmapTable" },
            ]}
            value={tableType}
            onChange={setTableType}
            style={{ marginBottom: 0 }}
          />
          <Toggle value={tableWrapped} onChange={setTableWrapped} label="Content Area 래핑" />
        </div>
        {(() => {
          const tableContent = (
            <>
              {tableType === "data" && (
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
              )}
              {tableType === "def" && (
                <DefinitionTable items={[
                  { color: CHART_COLORS[3], abbr: "ABC", fullName: "Full Name Description", definition: "Definition text", note: "*Additional note", price: "$1,328.95" },
                  { color: CHART_COLORS[0], abbr: "DEF", fullName: "Full Name Description", definition: "Definition text", price: "$1,421.79" },
                  { color: CHART_COLORS[1], abbr: "GHI", fullName: "Full Name Description", definition: "Definition text", price: "$1,562.50" },
                  { color: CHART_COLORS[2], abbr: "JKL", fullName: "Full Name Description", definition: "Definition text", note: "*Additional note", price: "$1,675.00" },
                ]} />
              )}
              {tableType === "roadmap" && (
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
              )}
            </>
          );
          if (!tableWrapped) return tableContent;
          return (
            <SectionCard>
              <ContentCard padding={0}>
                {tableContent}
              </ContentCard>
            </SectionCard>
          );
        })()}
      </Section>

      <Section>
        <Label>7. ExpectedResultsGrid</Label>
        <ContentCard style={{ padding: 16 }}>
          <ExpectedResultsGrid items={[
            { label: "Result A", value: "Value description" },
            { label: "Result B", value: "Value description" },
            { label: "Result C", value: "Value description" },
            { label: "Result D", value: "Value description" },
          ]} />
        </ContentCard>
      </Section>

      </>}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ▸ 단일 컴포넌트                                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      {compTab === "standalone" && <>

      <Section>
        <Label>1. InfoCard — Solid</Label>
        <InfoCardRow>
          <InfoCard label="Label" value="Value" />
          <InfoCard label="Label + Description" value="Value" description="Description text" />
          <InfoCard label="Label + Suffix" value="2.9" suffix="/ 5.0" />
        </InfoCardRow>
        <div style={{ height: 16 }} />
        <InfoCardRow>
          <InfoCard label="Score A" value="7" suffix="/10" />
          <InfoCard label="Score B" value="8" suffix="/10" />
          <InfoCard label="Score C" value="5" suffix="/10" />
          <InfoCard label="Score D" value="2" suffix="/10" />
        </InfoCardRow>

        <div style={{ height: 24 }} />
        <Label>1-1. InfoCard — Outline</Label>
        <InfoCardRow>
          <InfoCard variant="outline" label="Label" value="Value" />
          <InfoCard variant="outline" label="Label + Description" value="+24%" description="Previous: 18%" />
          <InfoCard variant="outline" label="Label Only" value="$1,200" />
        </InfoCardRow>
      </Section>

      <Section>
        <Label>2. PersonaCard — With Metrics</Label>
        <Row>
          <PersonaCard name="Premium Enthusiasts" subtitle="54,200 people (45.2%)" metrics={[
            { key: "Average Purchase Amount", value: "₩421,000" },
            { key: "Purchase Frequency", value: "2.3 times per month" },
            { key: "LTV (12 months)", value: "₩8,450,000" },
            { key: "Churn Risk", value: "Score 12 (Low)" },
          ]} />
          <PersonaCard name="Value Optimizers" subtitle="32,100 people (26.8%)" metrics={[
            { key: "Average Purchase Amount", value: "₩185,000" },
            { key: "Purchase Frequency", value: "1.1 times per month" },
            { key: "LTV (12 months)", value: "₩2,420,000" },
            { key: "Churn Risk", value: "Score 67 (High)" },
          ]} />
        </Row>
      </Section>

      <Section>
        <Label>3. RespondentCard</Label>
        <Row>
          <RespondentCard name="Kim Seoyeon" profile="Female, Age 28, Marketing Manager" response={`Responded "Very High". Currently comparing competitor premium memberships, highly sensitive to ad removal and content quality. High conversion potential due to 40+ hours monthly streaming usage and ad fatigue.`} />
          <RespondentCard name="Park Jimin" profile="Male, Age 35, Software Engineer" response={`Responded "High". Primarily interested in exclusive content and early access features. Moderate price sensitivity but values ad-free experience and offline downloads.`} />
        </Row>
      </Section>

      </>}

    </PageWrapper>
  );
}
