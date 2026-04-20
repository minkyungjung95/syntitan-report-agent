# CUBIG Design System Guide

> React + Vite 기반 디자인 시스템. Figma Variables 1:1 매핑.
> Font: **Pretendard** (ko) / **DM Sans** (en)

---

## 1. 프로젝트 구조

```
cubig-ds/
├── src/
│   ├── tokens.jsx          # 컬러 팔레트, 시맨틱 토큰, 아이콘
│   ├── ui-components.jsx   # Btn, Badge, Callout, Chip, TabBar, Divider
│   ├── charts.jsx          # Nivo 차트 (Donut, Pie, Bar, Line, Radar, Sankey 등)
│   ├── report-components.jsx  # 리포트 전용 레이아웃/카드/테이블 컴포넌트
│   ├── App.jsx             # DS 데모 (토큰, 버튼, 뱃지, 칩, 차트 탭)
│   └── ReportDemo.jsx      # 리포트 컴포넌트 데모
```

---

## 2. 토큰 시스템 (`tokens.jsx`)

### 2-1. 컬러 팔레트 (`T`)

163색 전체 — gray(18단계), neutral(11), red/orange/yellow/lime/green/emerald/teal/cyan/blue/purple/pink(각 11단계), deep purple(10단계)

```jsx
import { T } from "./tokens.jsx";

T.gray990   // "#171719" (텍스트 primary)
T.gray800   // "#7B7E85" (텍스트 secondary)
T.gray200   // "#E6E7E9" (border)
T.gray100   // "#F0F0F2" (bg subtle)
T.gray50    // "#F7F7F8" (bg lighter)
T.gray25    // "#FBFBFB" (bg lightest)
T.white     // "#FFFFFF"
T.red500    // "#FB2C36"
T.blue500   // "#2B7FFF"
T.green600  // "#00A63E"
```

### 2-2. 시맨틱 토큰 (`Semantic`)

```jsx
import { Semantic } from "./tokens.jsx";

Semantic.Info       // { bg, border, text, icon } — blue
Semantic.Positive   // green
Semantic.Cautionary // yellow
Semantic.Negative   // red
Semantic.Primary    // gray990 계열
Semantic.Secondary  // gray800 계열
```

### 2-3. 사이징 토큰

```jsx
import { Radius, Gap, Opacity } from "./tokens.jsx";

Radius[2]    // 8px
Radius[4]    // 16px
Radius.full  // 9999px (pill)
Gap[4]       // 16px
Opacity[5]   // 50%
```

### 2-4. Shadow 토큰 (Light)

| 토큰명 | 값 | 용도 |
|---|---|---|
| `shadow-xs-light` | `0px 1px 2px rgba(0,0,0,0.06)` | 버튼 호버 등 미세 인터랙션 |
| `shadow-sm-light` | `0px 2px 12px rgba(0,0,0,0.06)` | 기본 컴포넌트 계층 |
| `shadow-md-light` | `0px 4px 16px rgba(0,0,0,0.08)` | 중간 강도 계층 |
| `shadow-lg-light` | `0px 6px 20px rgba(0,0,0,0.10)` | 상위 계층 (카드, 모달) |

### 2-5. 아이콘

| 아이콘 | 크기 | 스타일 |
|---|---|---|
| `InfoIcon` / `InfoFillIcon` | 16 | outline / fill |
| `WarnIcon` / `WarnFillIcon` | 16 | outline / fill |
| `ErrorFillIcon` | 16 | fill |
| `StarAiFillIcon` | 16 | fill |
| `CloseIcon` | 12 | line |
| `PlusIcon` / `DownIcon` | 20 | line |
| `StarIcon` | 12 | fill |
| `CheckCircleIcon` | 20 | fill |
| `PersonIcon` | 24 | outline (stroke) |
| `IdentityPlatformIcon` | 24 | fill (hexagon + person) |
| `IdentityPlatformOutlineIcon` | 24 | outline (hexagon + person) |
| `MoneyIcon` | 20 | outline |
| `FlagIcon` | 20 | outline |
| `PrivacyIcon` | 20 | outline |
| `ArrowUpIcon` | 16 | green |
| `ArrowDownIcon` | 16 | red |

모든 아이콘은 `size`, `color` prop 지원.

---

## 3. UI 컴포넌트 (`ui-components.jsx`)

### 3-1. Btn (버튼)

```jsx
<Btn variant="solid-primary" size="lg" radius="sm" onClick={fn}>텍스트</Btn>
```

| Prop | 값 | 기본값 |
|---|---|---|
| `variant` | `solid-primary`, `solid-secondary`, `outline-primary`, `outline-secondary`, `text-primary`, `text-secondary` | `solid-primary` |
| `size` | `sm` (32h), `md` (40h), `lg` (48h) | `lg` |
| `radius` | `sm` (8), `md` (12), `full` (9999) | `sm` |
| `disabled` | boolean | false |
| `icon` | boolean (아이콘 전용) | false |
| `onClick` | function | - |

### 3-2. Badge

```jsx
<Badge type="Solid" variant="Info" size="Medium" text="텍스트" />
<Badge type="Outline" variant="Positive" size="Large" text="Medium" />
```

| Prop | 값 |
|---|---|
| `type` | `Solid`, `Outline` |
| `variant` | `Primary`, `Secondary`, `Info`, `Positive`, `Cautionary`, `Negative`, `Neutral` |
| `size` | `Small` (20h), `Medium` (24h), `Large` (28h) |
| `radius` | `Small` (8), `Large` (pill) |

### 3-3. Callout

```jsx
<Callout variant="Info" title="안내" description="설명 텍스트" />
```

| Prop | 값 |
|---|---|
| `variant` | `Primary`, `Info`, `Positive`, `Cautionary`, `Negative` |
| `size` | `Small`, `Medium` |
| `showDesc` / `showIcon` | boolean |

### 3-4. Chip

```jsx
<Chip type="Solid" size="Medium" active={true} label="필터" onClick={fn} />
```

| Prop | 값 |
|---|---|
| `type` | `Solid`, `Outline` |
| `size` | `Small`, `Medium`, `Large` |
| `active` / `disabled` | boolean |

### 3-5. ChipTabs / TabBar

```jsx
<ChipTabs tabs={["Tab1","Tab2"]} activeIndex={0} onChange={setIdx} />
<TabBar tabs={["A","B","C"]} activeIndex={idx} onChange={setIdx} />
```

---

## 4. 차트 컴포넌트 (`charts.jsx`)

`CHART_COLORS` 배열 제공 (10색, 데이터 시리즈에 순서대로 적용).

| 컴포넌트 | 설명 | 주요 Props |
|---|---|---|
| `DonutChart` | 도넛 차트 (호버 시 하이라이트) | `data, title, size` |
| `PieChart` | 파이 차트 | `data, title, size, showInnerLabels` |
| `SemiDonutChart` | 반원 게이지 | `data, title, ...` |
| `HBarChart` | 수평 바 | `data, title, maxValue` |
| `VBarChart` | 수직/수평 바 (grouped/stacked) | `data, keys, indexBy, groupMode, stacked` |
| `StackedHBar` | 누적 수평 바 | `data, keys, indexBy, title` |
| `GroupedBarChart` | 그룹/스택 바 | `data, keys, indexBy, stacked, layout` |
| `LineChart` | 라인/에어리어 (blue/red) | `data, title, variant, enableArea` |
| `LabeledLineChart` | 데이터 라벨 + 하단 테이블 | `title, series, categories, ...` |
| `RadarChart` | 레이더 | `data, keys, indexBy, title` |
| `PSMChart` | 가격 민감도 (4선 교차) | `data, title, intersections` |
| `FunnelChart` | 퍼널 | `data, title, ...` |
| `SankeyChart` | 산키 다이어그램 | `data, title, ...` |
| `FlowTable` | 전환율 테이블 (미니바+뱃지) | `data, ...` |
| `QuadrantChart` | 4사분면 스캐터 | `data, ...` |
| `ClusterProfileTable` | 클러스터 프로파일 테이블 | `title, data` |

### LineChart variant="red" (이탈률 차트)

```jsx
<LineChart
  title="Churn Rate Trend"
  variant="red"
  enableArea
  data={[{
    id: "Churn Rate",
    data: [
      { x: "2024-05", y: 77, churn: -12 },
      { x: "2024-06", y: 83, churn: -15 },
      // churn 필드 → 호버 시 "-12명 이탈" 빨간 뱃지 표시
    ],
  }]}
/>
```

---

## 5. 리포트 컴포넌트 (`report-components.jsx`)

### 5-1. 레이아웃

| 컴포넌트 | 설명 | 주요 Props |
|---|---|---|
| `PageWrapper` | 최상위 래퍼 (max-width 1200, 패딩) | `children` |
| `ReportPage` | 리포트 페이지 래퍼 | `children` |
| `ReportSection` | 섹션 (gap 기본 24) | `children, gap` |
| `SectionCard` | gray50 배경 카드 (radius 20, padding 8) | `children` |
| `ContentCard` | white 배경 카드 (border, radius 16) | `children, padding` |
| `ContentArea` | wrap on/off 토글 지원 | `children, wrap, gap` |
| `SectionHeading` | 섹션 제목 + 설명 | `title, description` |
| `ContentHeader` | 콘텐츠 헤더 (18 SemiBold + gray800 설명) | `title, description` |
| `Divider` | 구분선 (수평/수직) | `spacing, vertical` |

### 5-2. 카드 계열

> **디자인 규칙**: `InfoCard variant="outline"`은 **Executive Summary (최상단 요약 섹션)에서만** 사용한다. 그 외 섹션에서는 `variant="solid"` 사용.

| 컴포넌트 | 용도 | 주요 Props |
|---|---|---|
| `InfoCard` | 라벨+값 카드 (solid/outline, lg/md) | `label, value, suffix, description, variant, size` |
| `InfoCardRow` | InfoCard 가로 배열 래퍼 | `children` |
| `UserCard` | 페르소나 카드 3종 | `type("simple"/"stats"/"detail"), icon, name, subtitle, badge, description, details, buttonLabel, onButtonClick` |
| `PersonaCard` | 페르소나 + 메트릭 리스트 | `name, subtitle, metrics, icon` |
| `InsightCard` | 아이콘 + 제목 + 아이템 | `icon, title, items` |
| `SignalCard` | 번호 + 제목 + 불릿 + 알럿 | `number, title, items, alert, alertVariant` |
| `StrategyCard` | 전략 카드 (뱃지+가격) | `badge, price, priceLabel, children, bordered` |
| `RespondentCard` | 응답자 카드 | `name, profile, response, onViewDetail` |
| `ScenarioCard` | 시나리오 카드 (메트릭+컬러바) | `title, badge, metrics, color, footer` |
| `GrowthCard` | 성장 수치 카드 | `label, amount, color, percentage` |

### 5-3. InsightContent (세로/가로 레이아웃)

```jsx
// 세로형
<InsightContent layout="vertical"
  icon={<MoneyIcon />} iconWrap header="Label"
  title="제목" description="설명" />

// 가로형
<InsightContent layout="horizontal"
  label="라벨" value="값" items={["항목1","항목2"]} />
```

### 5-4. ContentArea (Wrap 토글)

```jsx
<ContentArea wrap={true} gap={8}>   {/* gray50 bg + padding 8 + rounded 20 */}
  <SomeCard />
</ContentArea>

<ContentArea wrap={false}>   {/* 카드별 개별 border */}
  <SomeCard />
</ContentArea>
```

### 5-5. 테이블 계열

| 컴포넌트 | 설명 | 주요 Props |
|---|---|---|
| `DataTable` | 범용 데이터 테이블 | `columns, data` |
| `QATable` | Q&A 2컬럼 테이블 | `columns, rows, bordered` |
| `GroupedTable` | 그룹별 테이블 | `columns, groups` |
| `DefinitionTable` | 용어 정의 테이블 | `items` |
| `StrategyRoadmapTable` | 기간별 전략 로드맵 | `periods` |

### 5-6. ExecutiveSummaryCard (Executive Summary)

```jsx
<ExecutiveSummaryCard
  title="Executive Summary"
  summaryItems={[
    { label: "Survey Topic", value: "Premium membership survey" },
    { label: "Number of respondents", value: "5,000" },
  ]}
  findings={{
    title: "Key Findings",
    items: [
      "Subscription intent : High or higher (68%)",
      "Most desired benefit : Ad-free viewing (72%)",
    ],
  }}
/>
```

- 외곽: white bg, 1px gray200 border, radius 16, padding 40, shadow-xs-light
- 내부: ContentArea wrap (gray50 bg) 안에 요약 카드 row + Key Findings
- summaryItems: 상단 요약 정보 (label + value)
- findings: 체크 아이콘 + 제목 + bullet list

### 5-7. ExecutionRoadmap (위클리 실행 로드맵)

```jsx
<ExecutionRoadmap
  title="30-Day Execution Roadmap"
  subtitle="(Baseline Scenario)"
  weeks={[
    {
      tab: "Week 1",
      weekLabel: "Week 1 (D+1 to D+7): Foundation Setup",
      items: [
        {
          title: "Premium Membership Design",
          priority: "High",   // "High"→Info(blue), "Medium"→Positive(green)
          bullets: ["Owner: Product Team", "Output: Spec document"],
        },
      ],
    },
    // ...Week 2, 3, 4
  ]}
/>
```

- 내부 탭 상태 관리 (Pill 칩)
- 외곽: white bg, 1px gray200 border, radius 16, padding 40, shadow-xs-light
- Priority: `Badge type="Outline"` 자동 매핑

### 5-7. 기타

| 컴포넌트 | 용도 |
|---|---|
| `TextBlock` / `KeyFindings` / `Interpretation` | 텍스트 블록 (아이콘+제목+불릿) |
| `MiniStatGrid` | 2열 미니 통계 그리드 |
| `StatRowGroup` / `StatRow` | 통계 행 그룹 |
| `ClusterHeader` | 클러스터 헤더 (뱃지+이름+설명) |
| `ActionList` | 액션 리스트 (체크 아이콘) |
| `TaskItem` | 태스크 항목 (priority 뱃지) |
| `AlertBanner` | 경고 배너 |
| `LegendTag` | 범례 태그 (컬러닷+라벨+값) |
| `WeekTabs` | 주차별 탭 |
| `ExpectedResultsGrid` | 기대 결과 그리드 |

---

## 6. 데모 페이지 구성

### App.jsx 탭

| 탭 | 내용 |
|---|---|
| `colors` | 팔레트 163색 + 시맨틱 + 사이징 토큰 + Chart Colors + Shadow 토큰 |
| `button` | Btn 커스텀 + Solid/Outline/Text/Icon 전체 매트릭스 |
| `badge` | Badge Solid/Outline 전체 variant/size 매트릭스 |
| `callout` | Callout 커스텀 + variant 매트릭스 |
| `chip` | Chip Solid/Outline + ChipTabs 데모 |
| `charts` | 전체 차트 컴포넌트 데모 (Donut~Sankey) |
| `report` | ReportDemo 컴포넌트 (별도 파일) |

### ReportDemo.jsx 탭

**래핑 컴포넌트** 탭:
- InsightContent (Vertical/Horizontal 탭 + Wrap 토글)
- QATable (Wrap 토글 시 bordered 제어)
- ExecutionRoadmap (Week 1~4 탭)

**단일 컴포넌트** 탭:
- UserCard 3 Types (Simple/Stats/Detail+CTA 탭, 각 3단 그리드)
- InfoCard Solid / Outline
- PersonaCard
- MiniStatGrid
- TextBlock / KeyFindings
- DataTable / DefinitionTable
- SignalCard / StrategyCard
- RespondentCard / StrategyRoadmapTable

---

## 7. 실행 방법

```bash
cd cubig-ds
npm install
npm run dev          # http://localhost:5173/
npm run dev -- --host --port 5188   # 네트워크 접속용
npm run build        # dist/ 생성
```

---

## 8. 래핑 규칙 (Wrapping Rules)

| 상황 | 래핑 | 예시 |
|---|---|---|
| 단일 컴포넌트 | **래핑 없음** — ReportSection 안에 직접 배치 | InfoCardRow, DataTable, FunnelChart, StackedHBar |
| 복수 컴포넌트 그룹 | **ContentArea wrap=true** (gray50 bg) | InsightCard 3장, StrategyTable 항목들 |
| InfoCard Outline | **Executive Summary 섹션에서만** 사용 | 최상단 요약 지표 |

```jsx
// ✅ 단일 컴포넌트 — SectionCard/ContentArea 래핑 없음
<ReportSection>
  <SectionHeading title="Monthly Metrics" />
  <DataTable columns={cols} data={rows} />
</ReportSection>

// ✅ 복수 컴포넌트 — ContentArea wrap
<ReportSection>
  <SectionHeading title="Root Cause Analysis" />
  <ContentArea wrap={true} gap={8}>
    <ContentCard>...</ContentCard>
    <ContentCard>...</ContentCard>
    <ContentCard>...</ContentCard>
  </ContentArea>
</ReportSection>
```

---

## 9. 컴포넌트 사용 패턴 요약

```jsx
import { T, PersonIcon, MoneyIcon } from "./tokens.jsx";
import { Btn, Badge, Chip, Callout } from "./ui-components.jsx";
import { DonutChart, LineChart, CHART_COLORS } from "./charts.jsx";
import {
  PageWrapper, SectionCard, ContentCard, ContentArea,
  InfoCard, InfoCardRow, UserCard, InsightContent,
  DataTable, QATable, ExecutionRoadmap,
} from "./report-components.jsx";
```
