# ChatGPT VOC 분석 리포트 생성 요청

아래 JSON 데이터를 **CUBIG Design System** 컴포넌트를 사용해서 React 리포트 페이지로 만들어주세요.

---

## 사용 가능한 컴포넌트

### 레이아웃 (report-components.jsx)
| 컴포넌트 | 용도 | 주요 Props |
|---|---|---|
| `PageWrapper` | 리포트 전체 감싸기 | `children` |
| `ReportPage` | 섹션 간 gap 70 | `children` |
| `SectionHeading` | 섹션 대제목 (border 밖) | `title`, `description` |
| `ReportSection` | border 박스 (padding 40, radius 20) | `children`, `gap` |
| `ContentHeader` | 콘텐츠 제목 (border 안) | `title`, `description` |
| `SectionCard` | 회색 배경 카드 (gap 8) | `children` |
| `ContentCard` | 흰 배경 카드 (radius 12) | `children`, `padding` |

### 정보 카드 (report-components.jsx)
| 컴포넌트 | 용도 | 주요 Props |
|---|---|---|
| `InfoCard` | 단일 지표 카드 | `label`, `value`, `suffix`, `description`, `variant("solid"/"outline")` |
| `InfoCardRow` | InfoCard 가로 배열 | `children` |
| `KeyFindings` | 핵심 발견 (넘버 불릿) | `items[]` |
| `Interpretation` | 해석 텍스트 블록 | `title`, `children` |
| `InsightCard` | 인사이트 카드 | `title`, `children`, `items` |
| `TextBlock` | 텍스트 블록 (bordered) | `title`, `icon`, `children`, `items[]` |

### 데이터 표시 (report-components.jsx)
| 컴포넌트 | 용도 | 주요 Props |
|---|---|---|
| `DataTable` | 데이터 테이블 | `columns[{key, label, align}]`, `data[]` |
| `SignalCard` | 시그널/경고 카드 | `number`, `title`, `items[]`, `alert`, `alertVariant` |
| `ActionList` | 액션 아이템 목록 | `items[{title, priority, columns[{label, content}]}]` |
| `PersonaCard` | 페르소나 프로필 | `name`, `subtitle`, `metrics[{key, value}]` |
| `StatRow` | 지표 행 | `label`, `value`, `items[]` |
| `StrategyCard` | 전략 카드 | `badge{text, variant}`, `price`, `children` |
| `ScenarioComparisonCard` | 시나리오 비교 | `scenarios[{badge, title, sections, footer, recommended}]` |

### 차트 (charts.jsx)
| 컴포넌트 | 용도 | 주요 Props |
|---|---|---|
| `DonutChart` | 도넛 그래프 | `data[{id, value}]`, `title`, `size` |
| `PieChart` | 원형 그래프 | `data[{id, value, color?, icon?}]`, `title`, `size` |
| `SemiDonutChart` | 반원 그래프 | `data[{id, value, description, hatched?}]`, `title`, `size` |
| `HBarChart` | 수평 바 차트 | `data[{label, value}]`, `title`, `maxValue` |
| `VBarChart` | 수직 바 차트 (stacked/grouped/single) | `data[]`, `keys[]`, `indexBy`, `title`, `groupMode`, `stacked` |
| `LineChart` | 라인/영역 차트 | `data[{id, data[{x, y}]}]`, `title`, `enableArea`, `variant` |
| `LabeledLineChart` | 라벨 라인 차트 + 하단 테이블 | `series[]`, `categories[]`, `annotations[]` |
| `FlowTable` | 전환율 테이블 | `groups[]`, `columns` |
| `QuadrantChart` | 2x2 매트릭스 | `quadrants[]`, `yAxis`, `xAxis`, `title` |
| `ClusterProfileTable` | 클러스터 프로필 비교 | `data{clusters[], categories[]}`, `title` |

### 색상 팔레트 (CHART_COLORS)
```
1번: #2B7FFF (Blue 500)
2번: #7CCF00 (Lime 500)
3번: #9F8DEB (DeepPurple 400)
4번: #8EC5FF (Blue 300)
5번: #00BBA7 (Teal 500)
6번: #FDC700 (Yellow 400)
```

### 토큰 (tokens.jsx - T 객체)
```
gray990: #171719, gray800: #62646A, gray400: #AEB0B6
gray200: #E0E0E2, gray100: #F0F0F2, gray50: #F7F7F8
blue50: #EFF6FF, white: #FFFFFF
```

---

## 섹션별 컴포넌트 매핑 가이드

### 1. Executive Summary
- **레이아웃**: `SectionHeading` → `ReportSection` → `SectionCard`
- **topMetrics**: `InfoCardRow` + `InfoCard` 4개 (label, value, sub를 description으로)
- **keyFindings**: `KeyFindings` 컴포넌트 (items 배열)

### 2. 감성 양극화 (sentiment-overview → MetricHighlight)
- **레이아웃**: `SectionHeading(label)` → `ReportSection`
- **items 3개**: `InfoCardRow` + `InfoCard(variant="outline")` 또는 `StatRow`
- 각 item의 description은 `Interpretation`으로

### 3. 양극화 해석 (polarization-interpretation → ClusterCard)
- **레이아웃**: `SectionHeading(label)` → `ReportSection`
- **items**: `PersonaCard` 또는 `SignalCard` 2개 가로 배열
  - badge → 뱃지 색상 매핑 (1점: #f87171, 5점: #7ccf00)
  - title, description 매핑

### 4. 토픽 영향도 (topic-impact → StackedBarChart)
- **레이아웃**: `SectionHeading(label)` → `ReportSection`
- **차트**: `VBarChart` (stacked 모드)
  - data: items 배열을 indexBy="label", keys=["긍정","중립","부정"]로 변환
  - colors: ["#7ccf00", "#e6e7e9", "#f87171"]

### 5. 부정 심층 분석 (negative-deep-dive → InsightCard)
- **레이아웃**: `SectionHeading(label)` → `ReportSection`
- **items 3개**: 각각 `TextBlock` 또는 `InsightCard`
  - badge → 제목에 포함
  - value → title
  - description + interpretation → children

### 6. 긍정 보호 (positive-protect → InsightCard)
- 5번과 동일 구조

### 7. 액션 플랜 (action-plan → StrategyTable)
- **레이아웃**: `SectionHeading(label)` → `ReportSection`
- **immediate/short/mid**: `ActionList` 3개 그룹
  - 각 항목: title=strategy, columns=[{label:"목표", content:objective}, {label:"실행계획", content:actionPlan}, {label:"기대효과", content:expectedImpact}]
- 또는 `DataTable`로 표 형태

---

## 입력 데이터 (JSON)

```json
{
  "meta": {
    "agentId": "chatgpt-voc-analysis",
    "agentName": "ChatGPT VOC 분석 리포트",
    "createdAt": "2026-04-10T00:00:00.000Z"
  },
  "executiveSummary": {
    "keyFindings": [
      "ChatGPT 한국어 리뷰 500건의 평균 별점은 3.89이지만, 1점(20.4%)과 5점(61.2%)에 81.6%가 집중된 극단적 양극화 구조입니다.",
      "5점의 37.3%가 5자 이하 단순 반응이고 1점은 평균 74자의 구체적 불만입니다.",
      "비중x부정률 영향도 기준: 무료/유료 한도(6.60), 응답 품질(6.40), UI/UX 업데이트(5.00) 순",
      "공통 원인은 '사용자가 통제할 수 없음'. 부정률 23%→12% 목표."
    ]
  },
  "sections": [
    {
      "id": "executive-summary",
      "label": "Executive Summary",
      "componentType": "ExecutiveSummary",
      "data": {
        "description": "2026년 3-4월 ChatGPT Google Play 한국어 리뷰 500건을 별점, 감성, 토픽 축으로 분석했습니다.",
        "topMetrics": [
          { "label": "총 리뷰", "value": "500건" },
          { "label": "평균 별점", "value": "3.89 / 5.0" },
          { "label": "양극화 (1+5점)", "value": "81.6%" },
          { "label": "부정 비율 (1-2점)", "value": "23.0%" }
        ],
        "keyFindings": [
          "ChatGPT 한국어 리뷰 500건의 평균 별점은 3.89이지만, 1점(20.4%)과 5점(61.2%)에 81.6%가 집중된 극단적 양극화 구조입니다.",
          "5점의 37.3%가 5자 이하 단순 반응이고 1점은 평균 74자의 구체적 불만입니다.",
          "비중x부정률 영향도 기준: 무료/유료 한도(6.60), 응답 품질(6.40), UI/UX 업데이트(5.00)",
          "공통 원인은 '사용자가 통제할 수 없음'. 부정률 23%→12% 달성 가능."
        ]
      }
    },
    {
      "id": "sentiment-overview",
      "label": "평균 3.89점, 표면 긍정 71% — 그러나 1점+5점에 81.6% 집중된 양극화 구조",
      "componentType": "MetricHighlight",
      "data": {
        "items": [
          { "label": "양극화 지수", "value": "81.6%", "sub": "1점(20.4%) + 5점(61.2%)", "description": "2-4점은 18.4%에 불과하며, '보통' 경험이 거의 존재하지 않는 극단적 양극화입니다." },
          { "label": "부정 비율", "value": "23.0%", "sub": "115건 (1-2점)", "description": "부정 리뷰 115건 중 102건(88.7%)이 1점입니다." },
          { "label": "공감 집중도", "value": "67%", "sub": "thumbs 3+ 중 1점 비율", "description": "공감수 3 이상 리뷰 15건 중 10건이 1점입니다." }
        ]
      }
    },
    {
      "id": "polarization-interpretation",
      "label": "5점의 37%는 '좋아요' 한 마디, 1점은 평균 74자 — 만족은 가볍고 불만은 구체적",
      "componentType": "ClusterCard",
      "data": {
        "items": [
          { "badge": "1점 그룹", "badgeColor": "#f87171", "title": "구체적 불만 기술자 — 102명 (20.4%)", "description": "리뷰 평균 74자로 5점 대비 3.7배 길게 작성합니다." },
          { "badge": "5점 그룹", "badgeColor": "#7ccf00", "title": "가벼운 만족 표현자 — 306명 (61.2%)", "description": "리뷰 평균 20자로 짧고 단순한 반응입니다." }
        ]
      }
    },
    {
      "id": "topic-impact",
      "label": "무료/유료 한도(6.60)·응답 품질(6.40)·UI 업데이트(5.00) — 비중x부정률 기준 개선 우선순위",
      "componentType": "StackedBarChart",
      "data": {
        "title": "토픽별 감성 분포 (비중x부정률 영향도순 정렬)",
        "categories": ["긍정", "중립", "부정"],
        "colors": ["#7ccf00", "#e6e7e9", "#f87171"],
        "items": [
          { "label": "무료/유료 한도 (10.4%)", "values": [31, 6, 63] },
          { "label": "응답 품질 (10.6%)", "values": [32, 8, 60] },
          { "label": "UI/UX 업데이트 (7.4%)", "values": [14, 19, 68] },
          { "label": "로그인/계정 (5.6%)", "values": [25, 14, 61] },
          { "label": "앱 성능/버그 (3.2%)", "values": [19, 6, 75] },
          { "label": "이미지/파일 (5.0%)", "values": [44, 12, 44] },
          { "label": "반복/맥락 무시 (3.6%)", "values": [33, 11, 56] },
          { "label": "검열/콘텐츠 제한 (1.6%)", "values": [12, 12, 75] }
        ]
      }
    },
    {
      "id": "negative-deep-dive",
      "label": "오답 고집·한도 리셋 불투명·업데이트 후 설정 삭제 — 세 불만의 공통점은 '사용자가 통제할 수 없음'",
      "componentType": "InsightCard",
      "data": {
        "items": [
          { "badge": "응답 품질", "value": "오답을 지적해도 수정하지 않고 반복 — 유료 사용자의 신뢰 붕괴", "description": "부정률 60%, 53건 중 32건이 1-2점입니다.", "interpretation": "응답 정확성은 AI 챗봇의 핵심 가치입니다." },
          { "badge": "한도 정책", "value": "무료 한도 리셋 시점이 불투명 — 사용자가 예측할 수 없는 제한", "description": "부정률 63%, 52건 중 33건이 1-2점입니다.", "interpretation": "한도 자체보다 '언제 풀리는지 모른다'가 핵심 불만입니다." },
          { "badge": "UI 변경", "value": "업데이트 후 설정·기록이 사라짐 — 가장 높은 공감(99)을 받은 불만", "description": "부정률 68%, 37건 중 25건이 1-2점입니다.", "interpretation": "업데이트가 개선이 아니라 퇴보로 인식되고 있습니다." }
        ]
      }
    },
    {
      "id": "positive-protect",
      "label": "학습 보조·말동무·편리성이 핵심 가치 — 그러나 경쟁사 언급 9건 중 대부분이 이탈 맥락",
      "componentType": "InsightCard",
      "data": {
        "items": [
          { "badge": "핵심 가치", "value": "학습 보조(31건)·편리성(60건)·말동무(14건)가 긍정의 3대 축", "description": "편리성/만족이 60건으로 가장 많고, 학습/정보 도움이 31건입니다.", "interpretation": "학습 보조와 말동무 기능은 AI 챗봇만의 고유 가치입니다." },
          { "badge": "이탈 신호", "value": "경쟁사 언급 9건 — Gemini 6회, Claude 1회, Grok 2회", "description": "경쟁사 언급 9건 중 부정 맥락이 4건, 비교 맥락이 3건입니다.", "interpretation": "9건은 적지만, 경쟁사를 구체적으로 지목하며 이탈을 권유하는 리뷰는 강한 신호입니다." }
        ]
      }
    },
    {
      "id": "action-plan",
      "label": "응답 정확성 강화 + 한도 정책 투명화 + 업데이트 QA로 부정률 23%→12%",
      "componentType": "StrategyTable",
      "data": {
        "immediate": [
          { "strategy": "한도 리셋 시점 투명화", "objective": "무료/유료 한도 불만 52건의 핵심 원인 해소", "actionPlan": "리셋 시점을 앱 내 명확히 표시", "expectedImpact": "한도 관련 부정률 63%→20%" },
          { "strategy": "업데이트 리그레션 핫픽스", "objective": "설정 삭제·기록 누락 해소", "actionPlan": "설정 버튼 삭제, 채팅 기록 누락 우선 복구", "expectedImpact": "UI 관련 부정률 68%→30%" }
        ],
        "short": [
          { "strategy": "오답 정정 메커니즘 개선", "objective": "응답 품질 불만 53건 완화", "actionPlan": "오류 지적 시 자체 검증 후 정정 프로세스 강화", "expectedImpact": "품질 관련 부정률 60%→30%" },
          { "strategy": "업데이트 QA 체크리스트 강화", "objective": "리그레션 발생률 감소", "actionPlan": "기존 기능 리그레션 테스트를 릴리즈 필수 조건 추가", "expectedImpact": "공감 99급 강한 부정 리뷰 방지" }
        ],
        "mid": [
          { "strategy": "로그인/계정 UX 재설계", "objective": "계정 관련 불만 28건 해소", "actionPlan": "계정 전환·로그아웃 접근성 개선", "expectedImpact": "계정 관련 부정률 61%→25%" },
          { "strategy": "유료 사용자 품질 모니터링", "objective": "유료 이탈 방지", "actionPlan": "유료 사용자 리뷰 별도 트래킹 + 품질 벤치마크", "expectedImpact": "종합 부정률 23%→12%" }
        ]
      }
    }
  ]
}
```

---

## 생성 규칙

1. **import**: `report-components.jsx`에서 레이아웃/카드 컴포넌트, `charts.jsx`에서 차트 컴포넌트를 import
2. **전체 구조**: `PageWrapper` > `ReportPage` > 각 섹션
3. **각 섹션**: `SectionHeading(label)` → `ReportSection` → `SectionCard` → `ContentCard` 순서
4. **색상**: CHART_COLORS 팔레트 순서대로 적용, 감성 색상은 긍정=#7ccf00, 중립=#e6e7e9, 부정=#f87171
5. **폰트**: Pretendard, sans-serif
6. **Stacked Bar Chart**: `VBarChart`에 `stacked={true}`, `layout="vertical"`, data를 `{label, 긍정, 중립, 부정}` 형태로 변환
7. **반응형**: 차트는 부모 width 100% 기준으로 자동 조절
8. **한국어**: 모든 텍스트는 원본 JSON의 한국어 그대로 사용
