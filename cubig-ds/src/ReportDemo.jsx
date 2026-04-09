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
  ScenarioComparisonCard, StrategyCard,
  RespondentCard, ActionList, TaskItem,

  LegendTag, ExpectedResultsGrid,
} from "./report-components";

const F = "Pretendard, sans-serif";
const Section = ({ children }) => <div style={{ marginBottom: 60 }}>{children}</div>;
const Label = ({ children }) => <div style={{ fontSize: 11, fontWeight: 600, color: T.gray400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily: F }}>{children}</div>;
const Row = ({ children, gap = 16 }) => <div style={{ display: "flex", gap, flexWrap: "wrap", marginBottom: 16 }}>{children}</div>;

export default function ReportDemo() {
  return (
    <PageWrapper>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: T.gray990, margin: 0, fontFamily: F }}>Report Components</h1>
        <p style={{ fontSize: 14, color: T.gray800, marginTop: 8, fontFamily: F }}>Showcase of all report template components</p>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 1. LAYOUT STRUCTURE                                */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>1. Layout — Full Structure</Label>
        <SectionHeading title="Section Title 1" description="Section description text goes here. This appears outside the border." />
        <ReportSection>
          <ContentHeader title="Content Title 1" description="Content description appears inside the border, above the gray area." />
          <SectionCard>
            <ContentCard>
              <div style={{ padding: 24, height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                Content Area A
              </div>
            </ContentCard>
            <ContentCard>
              <div style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "center", color: T.gray400, fontSize: 14, fontFamily: F }}>
                Content Area B (8px gap)
              </div>
            </ContentCard>
          </SectionCard>
        </ReportSection>

        <div style={{ height: 32 }} />

        <Label>1-1. Layout — Multiple ContentCards in one SectionCard</Label>
        <SectionHeading title="Section Title 2" />
        <ReportSection>
          <SectionCard>
            <ContentCard>
              <div style={{ padding: 24, color: T.gray400, fontSize: 14, fontFamily: F }}>Block 1</div>
            </ContentCard>
            <ContentCard>
              <div style={{ padding: 24, color: T.gray400, fontSize: 14, fontFamily: F }}>Block 2</div>
            </ContentCard>
            <ContentCard>
              <div style={{ padding: 24, color: T.gray400, fontSize: 14, fontFamily: F }}>Block 3</div>
            </ContentCard>
          </SectionCard>
        </ReportSection>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 2. INFO CARDS                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>2. InfoCard — Solid</Label>
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
        <Label>2-1. InfoCard — Outline</Label>
        <InfoCardRow>
          <InfoCard variant="outline" label="Label" value="Value" />
          <InfoCard variant="outline" label="Label + Description" value="+24%" description="Previous: 18%" />
          <InfoCard variant="outline" label="Label Only" value="$1,200" />
        </InfoCardRow>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 3. PERSONA CARDS                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>3. PersonaCard — With Metrics</Label>
        <Row>
          <PersonaCard name="Persona Name A" subtitle="12,000 people (45.2%)" metrics={[
            { key: "Metric 1", value: "Value 1" },
            { key: "Metric 2", value: "Value 2" },
            { key: "Metric 3", value: "Value 3" },
            { key: "Metric 4", value: "Value 4" },
          ]} />
          <PersonaCard name="Persona Name B" subtitle="8,500 people (32.1%)" metrics={[
            { key: "Metric 1", value: "Value 1" },
            { key: "Metric 2", value: "Value 2" },
            { key: "Metric 3", value: "Value 3" },
            { key: "Metric 4", value: "Value 4" },
          ]} />
        </Row>

        <Label>3-1. PersonaSummaryCard — With Bullets</Label>
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

      {/* ═══════════════════════════════════════════════════ */}
      {/* 3-2. STAT ROW                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>3-2. StatRow</Label>
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

      {/* ═══════════════════════════════════════════════════ */}
      {/* 4. MINI STAT GRID                                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>4. MiniStatGrid</Label>
        <MiniStatGrid items={[
          { label: "Category A", value: "44.2K", sub: "25.9% of total" },
          { label: "Category B", value: "33.1K", sub: "19.4% of total" },
          { label: "Category C", value: "28.5K", sub: "16.7% of total" },
          { label: "Category D", value: "12.8K", sub: "7.5% of total" },
        ]} />
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 5. INSIGHTS                                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>5. KeyFindings</Label>
        <KeyFindings items={[
          "Key finding item 1",
          "Key finding item 2",
          "Key finding item 3",
        ]} />
        <div style={{ height: 16 }} />
        <Label>5-1. Interpretation</Label>
        <Interpretation title="Interpretation">
          Interpretation paragraph text goes here. This is a longer form description that provides context and analysis.
        </Interpretation>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 6. TABLES                                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>6. Tables (in ReportSection structure)</Label>
        <SectionHeading title="Section Title" description="Tables wrapped in the standard layout structure." />
        <ReportSection>
          <SectionCard>
            <ContentCard>
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
          <SectionCard>
            <ContentCard>
              <DefinitionTable items={[
                { color: CHART_COLORS[3], abbr: "ABC", fullName: "Full Name Description", definition: "Definition text", note: "*Additional note", price: "$1,328.95" },
                { color: CHART_COLORS[0], abbr: "DEF", fullName: "Full Name Description", definition: "Definition text", price: "$1,421.79" },
                { color: CHART_COLORS[1], abbr: "GHI", fullName: "Full Name Description", definition: "Definition text", price: "$1,562.50" },
                { color: CHART_COLORS[2], abbr: "JKL", fullName: "Full Name Description", definition: "Definition text", note: "*Additional note", price: "$1,675.00" },
              ]} />
            </ContentCard>
          </SectionCard>
        </ReportSection>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 7. SIGNAL & SCENARIO CARDS                         */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>7. SignalCard</Label>
        <Row>
          <SignalCard number={1} title="Signal Title 1" items={["Detail item 1", "Detail item 2"]} alert="Alert message text" alertVariant="Negative" />
          <SignalCard number={2} title="Signal Title 2" items={["Detail item 1", "Detail item 2"]} alert="Alert message text" alertVariant="Negative" />
          <SignalCard number={3} title="Signal Title 3" items={["Detail item 1", "Detail item 2"]} alert="Alert message text" alertVariant="Cautionary" />
        </Row>

      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 8. SCENARIO COMPARISON                             */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>8. ScenarioComparisonCard</Label>
        <ScenarioComparisonCard scenarios={[
          {
            badge: "Option A", title: "Scenario Title 1", subtitle: "Subtitle",
            sections: [
              { label: "Section Label 1", content: "Section content text" },
              { label: "Section Label 2", content: "Section content text" },
            ],
            footer: "Footer summary text."
          },
          {
            badge: "Recommended", title: "Scenario Title 2", subtitle: "Subtitle", recommended: true,
            sections: [
              { label: "Section Label 1", content: "Section content text" },
              { label: "Section Label 2", content: "Section content text" },
            ],
            footer: "Footer summary text."
          },
          {
            badge: "Option C", title: "Scenario Title 3", subtitle: "Subtitle",
            sections: [
              { label: "Section Label 1", content: "Section content text" },
              { label: "Section Label 2", content: "Section content text" },
            ],
            footer: "Footer summary text."
          },
        ]} />
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 9. INSIGHT & STRATEGY CARDS                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>9. InsightCard</Label>
        <InsightCard title="Insight Title">
          Insight body text. Detailed analysis and recommendation paragraph.
        </InsightCard>

        <div style={{ height: 24 }} />
        <Label>9-1. StrategyCard</Label>
        <Row>
          <StrategyCard badge={{ text: "Strategy A", variant: "Info" }} price="$1,181" priceLabel="Price basis label">
            Strategy description text.
          </StrategyCard>
          <StrategyCard badge={{ text: "Strategy B", variant: "Brand" }} price="$1,311" priceLabel="Price basis label">
            Strategy description text.
          </StrategyCard>
          <StrategyCard badge={{ text: "Strategy C", variant: "Primary" }} price="$1,408" priceLabel="Price basis label">
            Strategy description text.
          </StrategyCard>
        </Row>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 10. RESPONDENT CARDS                               */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>10. RespondentCard</Label>
        <Row>
          <RespondentCard name="Respondent A" profile="Profile description" response="Response summary text goes here." />
          <RespondentCard name="Respondent B" profile="Profile description" response="Response summary text goes here." />
        </Row>
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 11. ACTION LIST & TASK ITEMS                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>11. ActionList</Label>
        <ActionList items={[
          { title: "Action Item 1", priority: "High", columns: [
            { label: "Column A", content: "Content text" },
            { label: "Column B", content: "Content text" },
            { label: "Column C", content: "Content text" },
          ]},
          { title: "Action Item 2", priority: "Medium", columns: [
            { label: "Column A", content: "Content text" },
            { label: "Column B", content: "Content text" },
            { label: "Column C", content: "Content text" },
          ]},
        ]} />

        <div style={{ height: 24 }} />
        <Label>11-1. TaskItem</Label>
        <TaskItem title="Task Title 1" priority="High" items={["Detail 1", "Detail 2", "Detail 3"]} />
        <TaskItem title="Task Title 2" priority="Medium" items={["Detail 1", "Detail 2", "Detail 3"]} />
      </Section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 12. COMMON UI                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <Section>
        <Label>12. LegendTag</Label>
        <Row gap={24}>
          <LegendTag color={CHART_COLORS[0]} label="Legend A" value="56.3%" />
          <LegendTag color={CHART_COLORS[1]} label="Legend B" value="28.1%" />
          <LegendTag color={CHART_COLORS[2]} label="Legend C" value="15.6%" />
        </Row>

        <div style={{ height: 16 }} />
        <Label>12-1. ExpectedResultsGrid</Label>
        <ContentCard style={{ padding: 16 }}>
          <ExpectedResultsGrid items={[
            { label: "Result A", value: "Value description" },
            { label: "Result B", value: "Value description" },
            { label: "Result C", value: "Value description" },
            { label: "Result D", value: "Value description" },
          ]} />
        </ContentCard>
      </Section>
    </PageWrapper>
  );
}
