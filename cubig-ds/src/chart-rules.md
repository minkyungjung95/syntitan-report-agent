# SynTitan Report - Chart Design Rules (Agent 참조용)

## 1. 색상 팔레트 (Chart Color Sequence)

차트 데이터 시리즈에 사용하는 색상 순서. 데이터가 늘어나면 순서대로 할당한다.

| 순서 | 이름 | Hex | 용도 |
|------|------|-----|------|
| 1번 | Blue 500 | `#2B7FFF` | 주요 데이터 / 1st series |
| 2번 | Lime 500 | `#7CCF00` | 보조 데이터 / 2nd series |
| 3번 | DeepPurple 400 | `#9F8DEB` | 3rd series |
| 4번 | Blue 300 | `#8EC5FF` | 4th series |
| 5번 | Teal 500 | `#00BBA7` | 5th series |
| 6번 | Yellow 400 | `#FDC700` | 6th series |

### 막대 그래프 전용 색상
- 1번 (강조): Blue 500 `#2B7FFF`
- 2번 (강조): Lime 500 `#7CCF00`
- 비활성/기타: Gray 200 `#E6E7E9`

### Hover 시 색상 규칙
- 기준색 + `#000000` 15% 블렌딩 (어둡게)
- 비선택 항목은 opacity 0.3~0.5로 fade

---

## 2. 타이포그래피 (Chart Text)

| 요소 | Font | Size | Weight | Line-Height | Color |
|------|------|------|--------|-------------|-------|
| 차트 타이틀 | Pretendard | 16px | 600 (SemiBold) | 24px | `#171719` (gray990) |
| 축 라벨 (Axis) | Pretendard | 12px | 400 (Regular) | 16px | `#7B7E85` (gray800) |
| 축 값 (Tick) | Pretendard | 12px | 400 | 16px | `#7B7E85` |
| 범례 라벨 | Pretendard | 14px | 500 (Medium) | 20px | `#171719` |
| 범례 값 (%) | Pretendard | 14px | 600 (SemiBold) | 20px | `#171719` |
| 범례 값 (수량) | Pretendard | 14px | 400 | 20px | `#7B7E85` |
| 바 위 퍼센트 | Pretendard | 14px | 600 | 20px | 시리즈 컬러 |
| 바 위 수량 | Pretendard | 14px | 400 | 20px | `#7B7E85` |
| 툴팁 타이틀 | Pretendard | 12px | 400 | 16px | `#7B7E85` |
| 툴팁 값 | Pretendard | 14px | 600 | 20px | `#171719` |

---

## 3. 차트 타입별 규칙

### 3-1. Donut Chart (원그래프)
- **타입**: Nivo `<ResponsivePie>`
- **innerRadius**: 0.6 (도넛 두께)
- **padAngle**: 2
- **cornerRadius**: 0
- **크기**: 180x180px (기본)
- **범례 위치**: 차트 우측, 세로 정렬
- **범례 형식**: `[Dot] [Label]  [%] ([count])`
  - Dot: 10x10 원, 시리즈 컬러 fill
  - 라벨~% 간격: 고정 너비 정렬
- **Hover**: 선택 슬라이스 확대, 나머지 fade, 툴팁 표시
- **툴팁**: 라벨 + `\n` + `%값(수량)` , bg: white, shadow, rounded 6px, padding 8px

### 3-2. Horizontal Bar (가로 막대)
- **타입**: Nivo `<ResponsiveBar>` layout="horizontal"
- **바 높이**: 약 28~32px
- **바 간격**: 항목간 gap 16px
- **바 radius**: 0 (직각)
- **배경 트랙**: Gray 200 `#E6E7E9` (전체 폭 100% 배경바)
- **라벨 위치**: 바 우측 외부에 `%값 (count)` 표시
- **Y축 라벨**: 좌측에 카테고리명 (fontSize 14, gray990)
- **색상**: 데이터 값에 따라 Blue 500 또는 Lime 500, 낮은값은 Gray 200
- **Hover**: 기준색 + #000000 15% 블렌딩

### 3-3. Vertical Bar (세로 막대)
- **타입**: Nivo `<ResponsiveBar>` layout="vertical"
- **바 너비**: 컨테이너에 맞게 자동, 최소 40px
- **바 radius**: 0
- **상단 라벨**: 바 위에 `$값` 또는 `%값`
- **하단 라벨**: X축에 카테고리명
- **배경**: 사선 패턴(hatching) 또는 Gray 100 배경
- **색상**: 카테고리별 Blue 500, Lime 500, Blue 300 등 순차 할당
- **Hover**: 툴팁으로 상세 정보 표시

### 3-4. Stacked Bar (100% 누적 막대)
- **타입**: Nivo `<ResponsiveBar>` groupMode="stacked"
- **layout**: horizontal
- **전체 폭**: 100%
- **각 세그먼트**: 시리즈 색상 순서대로
- **라벨**: 각 세그먼트 내부 또는 외부에 % 표시
- **우측**: 전체 합계 `100% (count)` 표시

### 3-5. Line/Area Chart (라인/영역)
- **타입**: Nivo `<ResponsiveLine>`
- **curve**: "monotoneX" (부드러운 곡선)
- **lineWidth**: 2
- **enableArea**: true (영역 채우기)
- **areaOpacity**: 0.15
- **포인트**: enablePoints, pointSize: 8, pointBorderWidth: 2
- **색상**: Red 계열 `#FB2C36` (영역: red + opacity 0.1)
- **Hover 포인트**: Orange `#FF6900` 원, 크기 10px
- **축**: X축(시간), Y축(값), gridY 표시, gridX 숨김
- **다중 라인**: 각 시리즈에 다른 선 스타일 (실선/점선/파선)

---

## 4. 공통 규칙

### Grid & Axis
- gridY: `#F0F0F2` (gray100), strokeWidth 1
- gridX: 기본 숨김
- axisBottom: tickSize 0, tickPadding 12
- axisLeft: tickSize 0, tickPadding 12

### Margin
- 기본: `{ top: 20, right: 20, bottom: 40, left: 60 }`
- 범례 포함 시: right를 240~280으로 확장

### Tooltip
- background: `#FFFFFF`
- border: `1px solid #E6E7E9`
- borderRadius: 6px
- padding: `8px 12px`
- boxShadow: `0 4px 16px rgba(0,0,0,0.08)`
- font: Pretendard

### Animation
- motionConfig: "gentle"
- animate: true

### Responsive
- 항상 `Responsive` 래퍼 사용 (ResponsivePie, ResponsiveBar, ResponsiveLine)
- 부모 컨테이너의 width/height로 크기 제어
