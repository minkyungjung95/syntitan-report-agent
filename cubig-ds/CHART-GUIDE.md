# SynTitan Chart Guide

> 차트 컴포넌트 디자인 규칙 + 트렌드 차트 Y축 스케일링 규칙 통합 문서.
> 에이전트(JSON 생성) → 렌더러(React 컴포넌트) → 디자인 QA 파이프라인에서 공유합니다.

---

# Part 1 — 차트 디자인 규칙

## 1. 색상 팔레트 (Chart Color Sequence)

차트 데이터 시리즈에 사용하는 색상 순서. 데이터 시리즈가 늘어나면 순서대로 할당합니다.

| 순서 | 이름 | Hex | 용도 |
|---|---|---|---|
| 1 | Blue 500 | `#2B7FFF` | 주요 데이터 / 1st series |
| 2 | Lime 500 | `#7CCF00` | 보조 데이터 / 2nd series |
| 3 | DeepPurple 400 | `#9F8DEB` | 3rd series |
| 4 | Blue 300 | `#8EC5FF` | 4th series |
| 5 | Teal 500 | `#00BBA7` | 5th series |
| 6 | Yellow 400 | `#FDC700` | 6th series |
| — | Red 400 | `#FF6467` | 부정일 경우 (경고·리스크·감소 지표 강조) |

### 막대 그래프 전용 색상
- 1st (강조): `Blue 500 #2B7FFF`
- 2nd (강조): `Lime 500 #7CCF00`
- 비활성/기타: `Gray 200 #E6E7E9`

### 감성(Sentiment) 고정 색상
- 긍정 / Positive / Promoter: `Lime 500 #7CCF00`
- 중립 / Neutral: `Gray 200 #E6E7E9`
- 부정 / Negative / Detractor: `Red 400 #FF6467` (또는 `#F87171`)

### Hover 규칙
- 기준색에 `#000000` 15% 블렌딩 (`filter: brightness(0.85)`) 으로 어둡게
- 비선택 항목 opacity 0.3~0.5 로 fade

---

## 2. 타이포그래피 (Chart Text)

| 요소 | Font | Size | Weight | Line-Height | Color |
|---|---|---|---|---|---|
| 차트 타이틀 | Pretendard | 18px | 600 (SemiBold) | 26px | `#171719` (gray990) |
| 차트 타이틀 괄호 부연 | Pretendard | 18px | 400 (Regular) | 26px | `#171719` |
| 축 라벨 (axisBottom/axisLeft) | Pretendard | 12px | 400 (Regular) | 16px | `#7B7E85` (gray800) |
| 축 값 (Tick) | Pretendard | 12px | 400 | 16px | `#7B7E85` |
| 범례 라벨 | Pretendard | 14px | 500 (Medium) | 20px | `#171719` |
| 범례 값 (%) | Pretendard | 14px | 600 (SemiBold) | 20px | `#171719` |
| 범례 값 (수량) | Pretendard | 14px | 400 | 20px | `#7B7E85` |
| 바 위/내부 퍼센트 | Pretendard | 16px | 600 | 24px | 컬러바 → WHITE / 회색바 → `#B6B8BD` (GRAY500) |
| 바 위 수량 (보조) | Pretendard | 14px | 400 | 20px | `#7B7E85` |
| 툴팁 라벨 | Pretendard | 12px | 400 | 16px | `#7B7E85` |
| 툴팁 값 | Pretendard | 14px | 600 | 20px | `#171719` |

---

## 3. 차트 타입별 규칙

### 3-1. Donut Chart
- **타입**: Nivo `<ResponsivePie>`
- **innerRadius**: 0.6
- **padAngle**: 2, **cornerRadius**: 0
- **기본 크기**: 180×180px
- **범례**: 차트 우측 세로, `[Dot 10×10] [Label]  [%] ([count])` — 라벨~% 간격 고정 너비 정렬
- **Hover**: 선택 슬라이스 확대 + 나머지 fade + 툴팁

### 3-2. Horizontal Bar (`HBarChart`)
- **타입**: Nivo `<ResponsiveBar>` `layout="horizontal"`
- **바 높이**: 28~32px, 바 간격 16px
- **배경 트랙**: Gray 200 `#E6E7E9` 100% 폭
- **라벨**: inline value 모드에서 바 내부 상단 `%값`, 외부 라벨 모드에서 바 우측 외부 `%값 (count)`
- **라벨 색**: 컬러바 WHITE / 회색바 GRAY500 (`#B6B8BD`)
- **Y축**: 좌측 카테고리명, 14/400, `#171719`
- **색상**: 값에 따라 Blue 500 / Lime 500, 낮은 값은 Gray 200

### 3-3. Vertical Bar (`VBarChart`)
- **타입**: Nivo `<ResponsiveBar>` `layout="vertical"`
- **바 너비**: 자동, 최소 40px
- **바 상단 corner**: R=8 (rounded top), 하단 corner: 0
- **라벨**: 바 내부 상단 (y=14), 폰트 16/600
- **라벨 색**: 컬러바 WHITE / 회색바 GRAY500
- **축**: `axisBottom tickSize: 0`, `axisLeft tickSize: 0`
- **음수 데이터 지원**: Y축 `minValue` 자동 계산, 0선은 연한 회색 마커

### 3-4. Timeline Bar (`TimelineBarChart`)
과거/현재/미래 예측 3단계 시계열 지표용 (이탈율 등).
- **`type` 별 스타일**:
  - `past` → Gray 200 `#E6E7E9` 바
  - `current` → Blue 500 `#2B7FFF` 바 + 연파랑 배경 패널 (`rgba(43,127,255,0.08)`) + "현재이탈률" 텍스트 태그 (막대 위)
  - `forecast` → Red 400 `#FF6467` 바 + 연빨강 배경 패널 (`rgba(255,100,103,0.10)`) + "예상이탈률" 태그
- 배경 패널은 플롯 전체 높이로 깔림
- 값 라벨은 막대 내부 상단 (VBarChart 와 동일 규칙)

### 3-5. Stacked Bar (100% 누적)
- **타입**: Nivo `<ResponsiveBar>` `groupMode="stacked"`
- **방향**: 가로(`horizontal`) 또는 세로(`vertical`) 모두 가능
- **전체 폭 100%**, 각 세그먼트는 시리즈 색상 순서대로
- **라벨**: 각 세그먼트 내부 `%` (세그먼트 5% 이상일 때만 노출)

### 3-6. Diverging Stacked Bar
NPS 분포(추천자/중립/비추천자) 같은 Likert 스케일용.
- **축 0 중앙**: 비추천자는 좌측 음수 방향, 추천자는 우측 양수 방향
- **중립**: 0 주위로 좌우 반씩 분할하여 배치
- **색상**: 비추천자 `#FF6467`, 중립 `#E6E7E9`, 추천자 `#7CCF00`

### 3-7. Line / Area Chart (`LineChart`)
- **타입**: Nivo `<ResponsiveLine>`
- **curve**: `monotoneX` (부드러운 곡선)
- **lineWidth**: 2
- **enableArea**: true, **areaOpacity**: 0.15
- **variant**: `"blue"` (기본, 상승·긍정) · `"red"` (하락·부정)
- **포인트**: `pointSize: 8`, `pointBorderWidth: 2`
- **Hover 포인트**: 동일 시리즈 컬러 + 흰 테두리 2px
- **Grid**: gridY 만 표시, gridX 숨김
- **다중 라인**: 시리즈별 실선/점선/파선으로 구분

### 3-8. Multi Line (`MultiLineChart`)
- **팔레트**: `CHART_COLORS` (PSM 시리즈와 동일)
- **포인트**: 항상 표시 (pointSize 10, 흰 fill + 회색 테두리)
- **음수 데이터**: Y축 `scaleMin` 자동 계산 (`min(0, dataMin)`)

### 3-9. KPI Trend Card (`KPITrendCard`)
좌측 KPI 텍스트 블록 + 우측 미니 추이 라인 카드.
- **좌측 타이포**: 타이틀 16/600, 디스크립션 14/400, big value 18~20/700, 델타 14 (긍정 → Blue 500, 부정 → Red 500)
- **우측 차트**: ResponsiveLine + area gradient (라인 컬러 opacity 22% → 0% fade)
- **축**: 좌측 Y 숨김, 우측 Y 표시 (3 tick), 하단 X 표시
- **호버**: 5px 원형 마커 (라인 컬러 + 흰 테두리 2px)

### 3-10. ComboChart
- Bar + Line 조합. 이중 Y축 지원 (barAxisLabel / lineAxisLabel)
- 처리시간(bar) vs NPS(line) 처럼 상관관계 표시용

---

## 4. 공통 규칙

### Grid & Axis
- **gridY**: `#F0F0F2` (Gray 100), strokeWidth 1
- **gridX**: 기본 숨김
- **axisBottom**: `tickSize: 0`, `tickPadding: 12`
- **axisLeft**: `tickSize: 0`, `tickPadding: 12`

### Margin (기본값)
- `{ top: 20, right: 20, bottom: 40, left: 60 }`
- 범례 포함 시: `right` 를 240~280 으로 확장

### Tooltip
```
background:    #FFFFFF
border:        1px solid #E6E7E9
borderRadius:  6px
padding:       8px 12px
boxShadow:     0 4px 16px rgba(0,0,0,0.08)
font:          Pretendard
```

### Animation
- `animate: true`, `motionConfig: "gentle"`

### Responsive
- 항상 `Responsive` 래퍼 사용 (`ResponsivePie`, `ResponsiveBar`, `ResponsiveLine`)
- 부모 컨테이너의 width/height 로 크기 제어

---

# Part 2 — 트렌드 차트 Y축 자동 스케일링

> 시계열 트렌드 차트(`TrendLineChart`, `LineChart` 등)의 Y축 도메인을 데이터 기반으로 자동 계산하는 규칙. 에이전트 → JSON → 렌더러 파이프라인 전체에서 공유하는 스펙.

## 1. 배경 · 의도

리포트에 어떤 수치가 들어올지 미리 알 수 없습니다 (NPS 가 -90일 수도, +50일 수도). 고정 스케일(예: -100~100)을 쓰면 변화량이 안 보이고, 데이터 min/max만 쓰면 미세한 변화가 과장됩니다.

두 가지가 동시에 성립해야 합니다:
- **데이터가 뷰를 결정한다** — Y축 범위는 데이터 min/max 에서 계산
- **변화량이 작아도 과장되지 않는다** — 메트릭별 최소 표시 폭 보장

## 2. 디자인 원칙

1. **데이터가 뷰를 결정한다** — Y축 도메인의 유일한 입력은 `series.values`
2. **변화량이 작아도 과장되지 않는다** — 메트릭별 `minDisplayRange` 로 최소 표시 폭 보장
3. **기준선은 얹히기만 한다** — 0, SLA 등 기준선은 계산된 도메인 안에 있을 때만 차트에 점선. 밖이면 설명 텍스트로 이동
4. **Nice number 로 마무리** — 축 라벨은 1/2/5/10/20/50/100 단위로 반올림

## 3. 메트릭별 파라미터

| 메트릭 | `minDisplayRange` | `theoreticalBounds` | 대표 기준선 |
|---|---|---|---|
| `nps` | 10 | [-100, 100] | 0 (중립선) |
| `csat` | 0.5 | [1, 5] | 업계 평균 (고객사 제공 시) |
| `time` | `max(2, dataMax × 0.2)` | [0, ∞] | SLA (입력에 있을 때) |
| `percent` | 5 | [0, 100] | 목표치 |
| `count` | `max(dataMax × 0.2, 1)` | [0, ∞] | — |

> `minDisplayRange` = "이 정도 변화면 가파르게 느껴야 한다" 의 임계치. 메트릭 의미에 맞게 디자이너가 튜닝.

## 4. 계산 수식

```text
dataMin, dataMax = min/max of data
dataRange        = dataMax - dataMin

minRange         = METRIC_CONFIG[metricType].minDisplayRange
effectiveRange   = max(dataRange, minRange)
center           = (dataMin + dataMax) / 2
padding          = effectiveRange * 0.15

rawMin = center - effectiveRange/2 - padding
rawMax = center + effectiveRange/2 + padding

step   = niceStep(effectiveRange)
yMin   = max(niceFloor(rawMin, step), theoreticalMin)
yMax   = min(niceCeil (rawMax, step), theoreticalMax)

visibleRefs      = refs where yMin <= ref.value <= yMax
outOfRangeRefs   = refs where ref.value < yMin or ref.value > yMax
```

### `niceStep`

| 범위 | 스텝 |
|---|---|
| ≤5 | 1 |
| ≤10 | 2 |
| ≤25 | 5 |
| ≤50 | 10 |
| ≤100 | 20 |
| ≤250 | 50 |
| 그 외 | 100 |

## 5. TypeScript 구현 스펙

```ts
interface ScaleInput {
  data: number[];
  metricType: "nps" | "csat" | "time" | "percent" | "count";
  references?: { label: string; value: number; contextText?: string }[];
}

interface ScaleOutput {
  yMin: number;
  yMax: number;
  tickStep: number;
  visibleRefs: Reference[];      // 도메인 안 — 점선으로 표시
  outOfRangeRefs: Reference[];   // 도메인 밖 — description에 contextText 합성
}

const METRIC_CONFIG = {
  nps:     { minDisplayRange: 10,  bounds: [-100, 100] },
  csat:    { minDisplayRange: 0.5, bounds: [1, 5] },
  time:    { minDisplayRange: (max: number) => Math.max(2, max * 0.2), bounds: [0, Infinity] },
  percent: { minDisplayRange: 5,   bounds: [0, 100] },
  count:   { minDisplayRange: (max: number) => Math.max(max * 0.2, 1), bounds: [0, Infinity] },
};

function computeYScale(input: ScaleInput): ScaleOutput {
  const dataMin = Math.min(...input.data);
  const dataMax = Math.max(...input.data);
  const dataRange = dataMax - dataMin;

  const { minDisplayRange, bounds } = METRIC_CONFIG[input.metricType];
  const minRange = typeof minDisplayRange === "function"
    ? minDisplayRange(dataMax)
    : minDisplayRange;

  const effectiveRange = Math.max(dataRange, minRange);
  const center = (dataMin + dataMax) / 2;
  const padding = effectiveRange * 0.15;

  const rawMin = center - effectiveRange / 2 - padding;
  const rawMax = center + effectiveRange / 2 + padding;

  const step = niceStep(effectiveRange);
  const yMin = Math.max(niceFloor(rawMin, step), bounds[0]);
  const yMax = Math.min(niceCeil(rawMax, step), bounds[1]);

  const refs = input.references ?? [];
  return {
    yMin, yMax, tickStep: step,
    visibleRefs: refs.filter(r => r.value >= yMin && r.value <= yMax),
    outOfRangeRefs: refs.filter(r => r.value < yMin || r.value > yMax),
  };
}

function niceStep(range: number): number {
  if (range <= 5)   return 1;
  if (range <= 10)  return 2;
  if (range <= 25)  return 5;
  if (range <= 50)  return 10;
  if (range <= 100) return 20;
  if (range <= 250) return 50;
  return 100;
}

function niceFloor(v: number, step: number) { return Math.floor(v / step) * step; }
function niceCeil (v: number, step: number) { return Math.ceil (v / step) * step; }
```

## 6. 샘플 JSON 스키마

### 6.1 필드

```jsonc
{
  "componentType": "TrendLineChart",
  "data": {
    "chartTitle": "월별 NPS 추이",
    "xLabels": ["1월", "2월", "3월"],
    "series": [
      {
        "id": "NPS",
        "values": [-20, -18, -16],
        "metricType": "nps",                              // ★ 스케일링 규칙 선택 키
        "unit": "pt"                                       // ★ 축·툴팁 라벨 접미사
      }
    ],
    "references": [
      {
        "label": "중립선",
        "value": 0,
        "contextText": "추천자와 비추천자가 같은 지점"     // ★ 도메인 밖일 때 설명에 자동 삽입
      }
    ],
    "description": "..."
  }
}
```

### 6.2 필드별 렌더링 책임

| JSON 필드 | 렌더링 책임 |
|---|---|
| `series.values` | Y축 도메인 계산의 유일한 입력 |
| `series.metricType` | `METRIC_CONFIG[type]`에서 `minDisplayRange`·`bounds` 조회 |
| `series.unit` | 축 라벨·툴팁 접미사 |
| `references[].value` | 도메인 안 → 점선+라벨 / 밖 → 생략 |
| `references[].contextText` | 도메인 밖일 때 description 끝에 자동 덧붙임 |
| `description` | 항상 표시. 컴포넌트가 out-of-range refs 의 contextText 를 자동 합성 |

## 7. 에이전트 작성 규칙

에이전트 프롬프트에 다음을 반영:

```
TrendLineChart의 series 작성 시:

1. 각 series에 반드시 metricType 지정 (nps | csat | time | percent | count)
2. unit 명시 (pt, 점, h, %, 건 등)
3. 한 차트의 모든 series는 같은 metricType이어야 함
   → 다른 지표(예: NPS + 해결시간)는 차트를 분리
4. references는 "표시 희망" 기준선. 컴포넌트가 도메인 밖이면 자동으로 차트에서 생략
   → contextText를 함께 넣어두면 생략 시 description에 자동 합성됨
5. headline/description에는 reference 해석을 항상 텍스트로 포함
   (차트에 그려지는지 여부와 무관하게 맥락을 텍스트가 전달)
```

## 8. 테스트 케이스

| # | metricType | data | references | 기대 출력 |
|---|---|---|---|---|
| 1 | nps | `[-20, -18, -16]` | `[{value:0}]` | yMin=-25, yMax=-10, step=5, outOfRange=[0] |
| 2 | nps | `[-92, -90, -88]` | `[{value:0}]` | yMin=-100, yMax=-80, step=5, outOfRange=[0] |
| 3 | nps | `[-5, 0, 5]` | `[{value:0}]` | yMin=-7, yMax=7, step=2, visible=[0] |
| 4 | nps | `[-18, -18, -18]` (무변화) | `[{value:0}]` | yMin=-25, yMax=-10, step=5, outOfRange=[0] |
| 5 | time | `[18, 19.2, 17.8]` | `[{value:24}]` | yMin=16, yMax=21, step=1, outOfRange=[24] |
| 6 | time | `[20, 24, 28]` | `[{value:24}]` | yMin=18, yMax=30, step=2, visible=[24] |
| 7 | time | `[0.5, 0.8, 1.2]` | `[{value:24}]` | yMin=0, yMax=2.5, outOfRange=[24] |
| 8 | percent | `[45, 47, 49]` | `[{value:50}]` | yMin=42, yMax=54, step=2, visible=[50] |

## 9. 시각 검증 체크리스트

디자이너·QA 리뷰용:

- [ ] 테스트 #4 같은 무변화 데이터가 **수평에 가깝게** 보이는가 (수직 변동 5% 이하)
- [ ] 테스트 #1에서 데이터 선이 차트 상단 1/3 영역에 위치해 "개선 중" 느낌이 오는가
- [ ] 테스트 #6에서 SLA 기준선이 차트 중앙 근처에 점선으로 보이고, 데이터 선이 그 위아래로 교차하는가
- [ ] 테스트 #2, #7처럼 기준선이 도메인 밖일 때, 차트 아래 description 에 contextText 가 자동 합성되어 나타나는가
- [ ] Y축 라벨이 -37, -22 같은 애매한 숫자 없이 나이스 스텝(1/2/5/10/20/50/100)으로만 나오는가

## 10. 변화량별 시각 인상 (NPS, minDisplayRange=10 기준)

| 실제 변화 | 도메인 폭 | 화면 높이 비율 | 인상 |
|---|---|---|---|
| 0.2pt | 15 | 1.3% | 수평, "변화 없음" |
| 1pt | 15 | 6.7% | 미세한 기울기 |
| 3pt | 15 | 20% | 뚜렷하지만 완만 |
| 5pt | 15 | 33% | 확실한 방향성 |
| 10pt | 15 | 67% | 가파른 변화 |
| 20pt | 30 (eff=20) | 67% | 가파르지만 과장 X |

## 11. 안티패턴

### ❌ 여러 메트릭을 한 차트에 섞기

```jsonc
// headline에는 NPS + 해결시간인데 series에는 NPS만 있음
{
  "headline": "NPS -20→-16, 해결시간 19.2→17.8h",
  "data": { "series": [{ "id": "NPS", "metricType": "nps", ... }] }
}
```

단위·스케일이 다른 지표를 한 headline에 묶으면 차트가 이를 표현할 수 없습니다. 차트 2개로 분리하거나 headline을 한 지표로 좁히세요.

### ✓ 차트 분리

```jsonc
// 차트 1: NPS
{
  "id": "nps-trend",
  "headline": "NPS가 -20에서 -16으로 소폭 개선됐지만 여전히 마이너스 구간",
  "data": {
    "series": [{ "id": "NPS", "values": [-20,-18,-16], "metricType": "nps", "unit": "pt" }],
    "references": [{ "label": "중립선", "value": 0, "contextText": "0을 넘어야 추천자 우세" }]
  }
},
// 차트 2: 해결시간
{
  "id": "resolution-time-trend",
  "headline": "평균 해결시간 19.2→17.8h로 정체",
  "data": {
    "series": [{ "id": "평균 해결시간", "values": [19.2,18.5,17.8], "metricType": "time", "unit": "h" }],
    "references": [{ "label": "SLA", "value": 24, "contextText": "SLA 24h 기준" }]
  }
}
```

---

# 관련 파일

- `src/charts.jsx` — 차트 컴포넌트 구현체
- `src/report-components.jsx` — 리포트 레이아웃 컴포넌트
- `src/tokens.jsx` — 색상·타이포 토큰
- `cubig-report-agent.md` — 리포트 AI 에이전트 가이드 (JSON → 컴포넌트 매핑)
- `CUBIG-DS-GUIDE.md` — 전체 디자인 시스템 가이드
- `리포트 테스트/sample-*.json` — 각 리포트 타입별 샘플 데이터
