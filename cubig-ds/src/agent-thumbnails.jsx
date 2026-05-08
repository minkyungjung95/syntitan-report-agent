/* =========================================================
 *  Design System – Agent Thumbnails (카테고리별)
 *  - 외곽 430 x 150, radius 20
 *  - 내부 흰 카드 266 x 130, top-only radius 14
 *  - 카테고리: Customer Success / Sales / Finance / Operations / Marketing
 *  - 부정 케이스(Churn 등): 레드
 *  - 총 12 에이전트
 * ========================================================= */

const ALT = "#7B7E85"; // fg/neutral/alternative

/* ─────────────────────── 카테고리 구조 ─────────────────────── */
const CATEGORIES = [
  {
    name: "Customer Success",
    bg: "linear-gradient(180deg, #C3D0EA 0%, #D4DBE8 100%)",
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
    agents: [
      { key: "personasurvey",  title: "Persona Survey",  ko: "페르소나 서베이", Body: PersonaSurveyBody },
      { key: "review_analysis", title: "Review Analysis", ko: "리뷰 분석",       Body: ReviewAnalysisBody },
    ],
  },
  {
    name: "Sales",
    bg: "#C3EADA",
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
    agents: [
      { key: "pipeline_forecasting_agent", title: "Pipeline Forecasting Agent", ko: "파이프라인 예측 에이전트", Body: PipelineForecastBody },
    ],
  },
  {
    name: "Finance",
    bg: "linear-gradient(180deg, #D6DAFF 0%, #D2D3F2 100%)",
    cardBg: "#FFFFFF",
    agents: [
      { key: "newproductpricingstrategy", title: "New Product Pricing Strategy", ko: "신제품 가격 전략", Body: PricingStrategyBody },
      { key: "pricing_optimization_agent", title: "Pricing Optimization Agent", ko: "가격 최적화 에이전트", Body: PricingOptimizationBody },
    ],
  },
  {
    name: "Operations",
    bg: "#FFEDD6",
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
    agents: [
      { key: "process_efficiency",       title: "Process Efficiency Analyzer", ko: "업무/프로세스 효율 분석", Body: ProcessEfficiencyBody },
      { key: "operational_kpi_analyzer", title: "Operational KPI Analyzer",    ko: "운영 KPI 분석",          Body: OperationalKPIBody },
      { key: "cs_ticket_analysis",       title: "CS Ticket Analysis",          ko: "고객센터 티켓 분석",      Body: CsTicketBody },
    ],
  },
  {
    name: "Marketing",
    bg: "#DEEFBE",
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
    agents: [
      { key: "audiencestrategy",              title: "Audience Strategy",              ko: "오디언스 전략",          Body: AudienceStrategyBody },
      { key: "content_performance_optimizer", title: "Content Performance Optimizer",  ko: "콘텐츠 퍼포먼스 최적화", Body: ContentOptimizerBody },
      { key: "press_release_simulation",      title: "Press Release Simulation",       ko: "보도자료 시뮬레이션",     Body: PressReleaseSimulationBody },
      { key: "ad_performance_analysis",       title: "Ad Performance Analysis",        ko: "광고 성과 분석",         Body: AdPerformanceBody },
    ],
  },
  {
    name: "부정적인 것 관련 (예외 케이스)",
    bg: "#FFEDE9",
    cardBg: "#FFFFFF",
    agents: [
      { key: "churnprediction", title: "Churn Prediction", ko: "이탈 예측", Body: ChurnPredictionBody },
      { key: "anomaly_detection", title: "Anomaly Detection", ko: "이상 탐지", Body: AnomalyDetectionBody },
    ],
  },
];

export default function AgentThumbnails() {
  return (
    <div>
      <div style={S.header}>
        <div style={S.h1}>Agent Thumbnails</div>
        <div style={S.sub}>카테고리별 컬러 · 부정 케이스는 레드 · 총 12개</div>
      </div>
      {CATEGORIES.map((cat) => (
        <section key={cat.name} style={S.section}>
          <div style={S.sectionTitle}>{cat.name}</div>
          <div style={S.thumbGrid}>
            {cat.agents.map((a) => (
              <div key={a.key} style={S.thumbCard}>
                <AgentThumb agent={{ ...a, bg: cat.bg, cardBg: cat.cardBg }} />
                <div style={S.thumbLabel}>
                  <span>{a.key}</span>
                  {a.ko && <span style={S.thumbLabelKo}> · {a.ko}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* =========================================================
 *  Shared Thumbnail Shell (430 x 150)
 * ========================================================= */
function AgentThumb({ agent }) {
  return (
    <div style={{ ...THUMB.outer, background: agent.bg }}>
      <div style={{ ...THUMB.card, background: agent.cardBg }}>
        <div style={THUMB.title}>{agent.title}</div>
        {agent.Body && (
          <div style={THUMB.bodyArea}>
            <agent.Body />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 *  01. Persona Survey – 라디오 버튼 리스트
 * ========================================================= */
function PersonaSurveyBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
      <div style={ROW.selected}>
        <div style={ROW.radioOuterSelected}>
          <div style={ROW.radioDot} />
        </div>
        <div style={{ height: 8, width: 60, borderRadius: 999, background: "#BEDBFF" }} />
      </div>
      <div style={ROW.normal}>
        <div style={ROW.radioOuter} />
        <div style={{ height: 8, width: 130, borderRadius: 999, background: "#EAEBED" }} />
      </div>
      <div style={{ ...ROW.normal, opacity: 0.8 }}>
        <div style={ROW.radioOuter} />
        <div style={{ height: 8, width: 100, borderRadius: 999, background: "#EAEBED" }} />
      </div>
    </div>
  );
}

const ROW = {
  selected: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 9px",
    borderRadius: 7,
    background: "#EFF6FF",
    border: "1px solid #51A2FF",
  },
  normal: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 9px",
    borderRadius: 7,
    background: "#F7F7F7",
  },
  radioOuter: {
    width: 14, height: 14, borderRadius: 999, border: "1px solid #E6E7E9",
    background: "transparent", flexShrink: 0,
  },
  radioOuterSelected: {
    width: 14, height: 14, borderRadius: 999, background: "#51A2FF", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  radioDot: { width: 7, height: 7, borderRadius: 999, background: "#FFFFFF" },
};

/* =========================================================
 *  02. Lead Scoring Agent (Sales) – 토스 스타일 리드 점수
 * ========================================================= */
function LeadScoringBody() {
  const GREEN = "#3DB58A";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "28px", letterSpacing: "-0.5px" }}>92</div>
        <div style={{ background: "#E8F7F1", color: GREEN, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↑ 8</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ height: 5, background: "#F0F0F2", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: "92%", height: "100%", background: GREEN, borderRadius: 999 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { w: "62%", op: 0.5 },
            { w: "48%", op: 0.3 },
            { w: "38%", op: 0.18 },
          ].map((r, i) => (
            <div key={i} style={{ height: 3, width: r.w, background: GREEN, opacity: r.op, borderRadius: 999 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  03. Pipeline Forecasting Agent (Sales) – 토스 스타일 매출 예측
 * ========================================================= */
function PipelineForecastBody() {
  const GREEN = "#5BC09E";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>$2.4M</div>
        <div style={{ background: "#E8F7F1", color: GREEN, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↑ 12%</div>
      </div>

      {/* 3-bar growth chart — Q3, Q4, Q1 forecast (솔리드 + 증가 점선/화살표) */}
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <svg viewBox="0 0 200 50" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
          <defs>
            <marker id="pipeArrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <polygon points="0,0 5,2.5 0,5" fill={GREEN} />
            </marker>
          </defs>

          {/* 3 bars */}
          <rect x="22"  y="30" width="32" height="20" fill={GREEN} rx="1.5" />
          <rect x="84"  y="20" width="32" height="30" fill={GREEN} rx="1.5" />
          <rect x="146" y="6"  width="32" height="44" fill={GREEN} rx="1.5" />

          {/* 점선: bar1 top → bar2 top (양쪽 막대에 붙임) */}
          <line x1="54" y1="30" x2="84" y2="20" stroke={GREEN} strokeWidth="1" strokeDasharray="2 2" opacity="0.9" />

          {/* 증가 화살표: bar2 top에서 시작, bar3 top 직전에서 끝 — 우측만 여백 */}
          <line x1="116" y1="20" x2="142" y2="9" stroke={GREEN} strokeWidth="0.9" markerEnd="url(#pipeArrow)" />
        </svg>
      </div>
    </div>
  );
}

/* =========================================================
 *  04. New Product Pricing Strategy (Finance) – 가격 카드 + 바
 * ========================================================= */
function PricingStrategyBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <div style={{ display: "flex", gap: 5, alignItems: "stretch" }}>
        <div style={PRICE.cardPlain}>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Star fill="#E6E7E9" />
            <Star fill="#E6E7E9" />
          </div>
          <div style={PRICE.price}>$120</div>
        </div>
        <div style={PRICE.cardRec}>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} fill="#D0C9FF" />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={PRICE.price}>$150</div>
            <div style={PRICE.badge}>Recommended</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {[
          { dot: "rgba(234,235,237,0.9)", bar: "rgba(234,235,237,0.9)", w: 153 },
          { dot: "rgba(234,235,237,0.6)", bar: "rgba(234,235,237,0.6)", w: 79 },
          { dot: "rgba(234,235,237,0.6)", bar: "rgba(234,235,237,0.6)", w: 142 },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0", opacity: 0.7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: r.dot }} />
            <div style={{ height: 8, width: r.w, borderRadius: 999, background: r.bar }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PRICE = {
  cardPlain: {
    flex: "0 0 auto",
    width: 88,
    background: "#FBFBFB",
    border: "1px solid #F0F0F2",
    borderRadius: 10,
    padding: "8px 8px 6px",
    display: "flex", flexDirection: "column",
    gap: 3,
  },
  cardRec: {
    flex: "1 1 0",
    minWidth: 0,
    background: "#F7F5FF",
    border: "1px solid #B5ABF2",
    borderRadius: 10,
    padding: "8px 8px 6px",
    display: "flex", flexDirection: "column",
    justifyContent: "center",
    gap: 3,
  },
  price: {
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 18.9,
    fontWeight: 600,
    color: "#171719",
    lineHeight: "25.8px",
  },
  badge: {
    background: "#EFEBFF",
    border: "none",
    borderRadius: 7,
    padding: "1.7px 5px",
    fontFamily: "Pretendard, sans-serif",
    fontSize: 9.5,
    fontWeight: 500,
    color: "#8A77E0",
    lineHeight: "12px",
    whiteSpace: "nowrap",
  },
};

function Star({ fill }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <polygon points="12,3 14.7,9 21,9.6 16.3,13.9 17.6,20 12,16.8 6.4,20 7.7,13.9 3,9.6 9.3,9" />
    </svg>
  );
}

/* =========================================================
 *  05. Pricing Optimization Agent (Finance) – 토스 스타일 최적가
 * ========================================================= */
function PricingOptimizationBody() {
  const PURPLE = "#8A77E0";
  const LIGHT = "#EFEBFF";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", height: "100%" }}>
      {/* Top: 최적 가격 + delta — 수직 중앙 정렬 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>$145</div>
        <div style={{ background: LIGHT, color: PURPLE, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>+18%</div>
      </div>

      {/* Sweet-spot 게이지: 트랙 + 최적 zone + 핀 */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
        <div style={{ position: "relative", height: 10 }}>
          {/* 트랙 */}
          <div style={{ position: "absolute", inset: 0, background: LIGHT, borderRadius: 999 }} />
          {/* 최적 zone (45~70%) — 핀과 zone 톤 차이 유지 */}
          <div style={{ position: "absolute", left: "45%", right: "30%", top: 0, bottom: 0, background: "#B5ABF2", borderRadius: 999 }} />
          {/* 핀 — 최적가 위치 */}
          <div style={{
            position: "absolute",
            left: "58%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 16, height: 16,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: `2.5px solid ${PURPLE}`,
            boxShadow: "0 1px 3px rgba(138,119,224,0.3)",
            boxSizing: "border-box",
          }} />
        </div>

        {/* 틱 라벨 */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: ALT, fontFamily: "Pretendard, sans-serif", letterSpacing: 0.3 }}>
          <span>Low</span>
          <span style={{ fontWeight: 700, color: PURPLE }}>Optimal</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  06. Process Efficiency Analyzer (Operations) – Before/After 시간 비교
 * ========================================================= */
function ProcessEfficiencyBody() {
  const ORANGE = "#FFB86A";
  const TRACK = "#FFF7ED";
  const GRAY_TRACK = "#F0F0F2";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", height: "100%" }}>
      {/* 헤더: 큰 숫자(개선 결과) + 변화량 뱃지 (다른 썸네일과 동일 패턴) */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>4.5d</div>
        <div style={{ background: TRACK, color: ORANGE, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↓ 45%</div>
      </div>

      {/* Before/After 비교 — 라벨/숫자 폰트 키우고 트랙은 가로 축소 */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ fontSize: 11, color: ALT, fontFamily: "Pretendard, sans-serif", width: 40 }}>Before</div>
          <div style={{ flex: 1, height: 8, borderRadius: 999, background: GRAY_TRACK }}>
            <div style={{ width: "92%", height: "100%", background: "#DCDDDF", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA0A8", fontFamily: "Pretendard, sans-serif", width: 34, textAlign: "right" }}>8.2d</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ fontSize: 11, color: ALT, fontFamily: "Pretendard, sans-serif", width: 40 }}>After</div>
          <div style={{ flex: 1, height: 8, borderRadius: 999, background: GRAY_TRACK }}>
            <div style={{ width: "52%", height: "100%", background: ORANGE, borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: ORANGE, fontFamily: "Pretendard, sans-serif", width: 34, textAlign: "right" }}>4.5d</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  07. Operational KPI Analyzer (Operations) – 2단 KPI 타일 (큰 숫자)
 * ========================================================= */
function OperationalKPIBody() {
  const ORANGE = "#FFB86A";
  const BG = "#F7F7F8";
  const tiles = [
    { label: "UTIL",    value: "94%",  d: "M2,11 C5,9 8,10 11,7 C14,5 17,6 20,4 C23,2 25,3 26,2" },
    { label: "THROUGH", value: "1.2k", d: "M2,12 C5,10 8,10 11,7 C14,5 17,5 20,3 C23,2 25,2 26,1" },
    { label: "CYCLE",   value: "2.4d", d: "M2,2 C5,3 8,3 11,5 C14,7 17,7 20,9 C23,11 25,11 26,12" },
  ];
  return (
    <div style={{ display: "flex", gap: 5, width: "100%", height: "100%" }}>
      {tiles.map((t, i) => (
        <div key={i} style={{
          flex: 1, minWidth: 0,
          background: BG,
          borderRadius: 7,
          padding: "8px 8px 6px",
          display: "flex", flexDirection: "column",
          gap: 2,
          fontFamily: "Pretendard, sans-serif",
        }}>
          {/* 스켈레톤 라벨 라인 (텍스트 플레이스홀더 느낌) */}
          <div style={{ height: 4, width: 22, borderRadius: 999, background: "#E6E7E9", marginBottom: 3 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#171719", lineHeight: 1, letterSpacing: "-0.3px" }}>{t.value}</div>
          <svg viewBox="0 0 28 14" preserveAspectRatio="none" style={{ width: "100%", height: 28, marginTop: "auto" }} aria-hidden="true">
            <defs>
              <linearGradient id={`opKpiArea${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity="0.5" />
                <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${t.d} L26,14 L2,14 Z`} fill={`url(#opKpiArea${i})`} />
            <path d={t.d} fill="none" stroke={ORANGE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
 *  08. Anomaly Detection (부정 케이스) – Churn 스타일 그리드 + 스무스 라인 + 이상치 박스
 * ========================================================= */
function AnomalyDetectionBody() {
  const LINE = "#FFA2A2";
  const RED = "#FF6467";

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 6, height: 74, width: "100%", position: "relative" }}>
      {/* Y축 라벨 (Churn과 동일) */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "Pretendard, sans-serif", fontSize: 7, color: ALT, textAlign: "right", lineHeight: "5px" }}>
        <span>100%</span>
        <span>0%</span>
      </div>

      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        {/* 그리드 (Churn과 동일) */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ flex: 1, display: "flex" }}>
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #E6E7E9",
                borderLeft: "0.5px dashed #E6E7E9",
                borderBottom: row === 2 ? "0.5px dashed #E6E7E9" : "none",
              }} />
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #E6E7E9",
                borderLeft: "0.5px dashed #E6E7E9",
                borderRight: "0.5px dashed #E6E7E9",
                borderBottom: row === 2 ? "0.5px dashed #E6E7E9" : "none",
              }} />
            </div>
          ))}
        </div>

        {/* SVG 영역 그라데이션 + 라인 (베이스라인 부드러운 웨이브 + 한 지점 스파이크) */}
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="anomalyArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA2A2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFA2A2" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M5,50 C25,48 45,52 65,50 C85,50 95,52 105,50 L110,22 L115,50 C125,50 140,52 155,50 L160,41 L165,50 C180,50 190,52 195,50 L195,60 L5,60 Z"
            fill="url(#anomalyArea)"
          />
          <path
            d="M5,50 C25,48 45,52 65,50 C85,50 95,52 105,50 L110,22 L115,50 C125,50 140,52 155,50 L160,41 L165,50 C180,50 190,52 195,50"
            fill="none"
            stroke={LINE}
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 스파이크 정점 위 경고 뱃지 — 다른 썸네일과 같은 평면 스타일 (보더/그림자 제거) */}
        <div style={{
          position: "absolute",
          left: "55%",
          top: "28%",
          transform: "translate(-50%, -100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: RED,
          padding: "3px 6px",
          borderRadius: 999,
          lineHeight: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <polygon points="6,1.5 11,10.5 1,10.5" fill="#FFFFFF" />
            <rect x="5.4" y="4.5" width="1.2" height="3" fill={RED} rx="0.4" />
            <rect x="5.4" y="8.4" width="1.2" height="1.3" fill={RED} rx="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  09. Audience Strategy (Marketing) – 2 카드 (좌 그린, 우 그레이)
 * ========================================================= */
function AudienceStrategyBody() {
  return (
    <div style={{ display: "flex", gap: 8, height: 78, width: "100%" }}>
      <div style={{ ...AUD.card, background: "#F7FFEC", border: "1px solid #B6E274" }}>
        <IdentityPlatformIcon fill="#B6E274" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <div style={{ height: 8, width: 23, borderRadius: 999, background: "rgba(216,242,166,0.8)" }} />
          <div style={{ height: 8, width: "100%", borderRadius: 999, background: "rgba(216,242,166,0.6)" }} />
        </div>
      </div>
      <div style={{ ...AUD.card, background: "#F7F7F7" }}>
        <IdentityPlatformIcon fill="#CACCCF" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <div style={{ height: 8, width: 23, borderRadius: 999, background: "#EAEBED" }} />
          <div style={{ height: 8, width: "100%", borderRadius: 999, background: "rgba(234,235,237,0.6)" }} />
        </div>
      </div>
    </div>
  );
}

const AUD = {
  card: {
    flex: "1 1 0",
    minWidth: 0,
    height: "100%",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
};

function IdentityPlatformIcon({ fill }) {
  return (
    <svg width="20" height="20" viewBox="0 0 14.1667 16.0288" fill="none" aria-hidden="true">
      <path
        d="M6.29646 14.3542C6.54215 14.5047 6.80444 14.5779 7.08333 14.5738C7.36222 14.5694 7.62451 14.4919 7.87021 14.3413L11.5496 12.0929C10.8819 11.6442 10.1697 11.3036 9.41271 11.0713C8.65576 10.8389 7.87931 10.7227 7.08333 10.7227C6.28736 10.7227 5.50882 10.8402 4.74771 11.0752C3.98646 11.3103 3.265 11.6453 2.58333 12.08L6.29646 14.3542ZM7.08333 8.63938C7.83542 8.63938 8.47486 8.37604 9.00167 7.84938C9.52833 7.32257 9.79167 6.68313 9.79167 5.93104C9.79167 5.17896 9.52833 4.53951 9.00167 4.01271C8.47486 3.48604 7.83542 3.22271 7.08333 3.22271C6.33125 3.22271 5.69181 3.48604 5.165 4.01271C4.63833 4.53951 4.375 5.17896 4.375 5.93104C4.375 6.68313 4.63833 7.32257 5.165 7.84938C5.69181 8.37604 6.33125 8.63938 7.08333 8.63938ZM6.29646 15.8027L0.719583 12.3877C0.490972 12.251 0.313889 12.0683 0.188333 11.8396C0.0627776 11.611 0 11.3642 0 11.0994V4.92938C0 4.66451 0.0627776 4.41778 0.188333 4.18917C0.313889 3.96042 0.490972 3.77771 0.719583 3.64104L6.29646 0.226041C6.54215 0.0753467 6.80444 0 7.08333 0C7.36222 0 7.62451 0.0753467 7.87021 0.226041L13.4471 3.64104C13.6757 3.77771 13.8528 3.96042 13.9783 4.18917C14.1039 4.41778 14.1667 4.66451 14.1667 4.92938V11.0994C14.1667 11.3642 14.1039 11.611 13.9783 11.8396C13.8528 12.0683 13.6757 12.251 13.4471 12.3877L7.87021 15.8027C7.62451 15.9534 7.36222 16.0288 7.08333 16.0288C6.80444 16.0288 6.54215 15.9534 6.29646 15.8027Z"
        fill={fill}
      />
    </svg>
  );
}

/* =========================================================
 *  10. Content Performance Optimizer (Marketing) – 토스 스타일 인게이지먼트
 * ========================================================= */
function ContentOptimizerBody() {
  const GREEN = "#9AE600";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>+24%</div>
        <div style={{ background: "#EEF6E0", color: "#5EA500", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↑ this week</div>
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="contentAreaA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.25" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,30 L25,28 L50,32 L75,24 L100,26 L125,18 L150,14 L175,10 L200,5 L200,40 L0,40 Z" fill="url(#contentAreaA)" />
          <path d="M0,30 L25,28 L50,32 L75,24 L100,26 L125,18 L150,14 L175,10 L200,5" fill="none" stroke="#9AE600" strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

/* =========================================================
 *  11. Press Release Simulation (Marketing) – 신문 기사 느낌 (은은한 그레이)
 * ========================================================= */
function PressReleaseSimulationBody() {
  return (
    <div style={{
      width: "100%",
      marginBottom: -14,
      alignSelf: "stretch",
      background: "#F7F7F7",
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxSizing: "border-box",
    }}>
      {/* 신문 masthead — PRESS RELEASE + 날짜 dot */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 5,
        borderBottom: "1px solid #F0F0F2",
      }}>
        <div style={{
          fontSize: 8,
          fontWeight: 800,
          color: "#B4B7BC",
          fontFamily: "Pretendard, sans-serif",
          letterSpacing: "0.7px",
        }}>HEADLINE</div>
        <div style={{ width: 4, height: 4, borderRadius: 999, background: "#DCDDDF" }} />
      </div>

      {/* 헤드라인 (맨 위 한 줄만 살짝 진한 톤) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ height: 8, width: "100%", borderRadius: 999, background: "#E6E7E9" }} />
        <div style={{ height: 8, width: "68%", borderRadius: 999, background: "#F0F0F2" }} />
      </div>

      {/* 본문 (3번째까지는 동일, 마지막 라인 opacity 50%) — 헤드라인 그룹과 간격 더 띄움 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
        <div style={{ height: 8, width: "100%", borderRadius: 999, background: "#F0F0F2" }} />
        <div style={{ height: 8, width: "82%", borderRadius: 999, background: "#F0F0F2", opacity: 0.5 }} />
      </div>
    </div>
  );
}

/* =========================================================
 *  12. Churn Prediction (부정 케이스) – 라인 차트 (레드)
 * ========================================================= */
function ChurnPredictionBody() {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 6, height: 74, width: "100%", position: "relative" }}>
      {/* Y축 라벨 */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "Pretendard, sans-serif", fontSize: 7, color: ALT, textAlign: "right", lineHeight: "5px" }}>
        <span>100%</span>
        <span>0%</span>
      </div>

      {/* 차트 */}
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        {/* 그리드 */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ flex: 1, display: "flex" }}>
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #E6E7E9",
                borderLeft: "0.5px dashed #E6E7E9",
                borderBottom: row === 2 ? "0.5px dashed #E6E7E9" : "none",
              }} />
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #E6E7E9",
                borderLeft: "0.5px dashed #E6E7E9",
                borderRight: "0.5px dashed #E6E7E9",
                borderBottom: row === 2 ? "0.5px dashed #E6E7E9" : "none",
              }} />
            </div>
          ))}
        </div>

        {/* Area + Line */}
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="churnArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA2A2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFA2A2" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M15,44 C50,38 80,20 100,16 C140,9 170,8 190,7 L190,60 L15,60 Z"
            fill="url(#churnArea)"
          />
          <path
            d="M15,44 C50,38 80,20 100,16 C140,9 170,8 190,7"
            fill="none"
            stroke="#FFA2A2"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 데이터 포인트 3개: HTML로 그려서 종횡비 영향 없이 원형 유지 */}
        {[
          { l: "7.5%",  t: "73.3%" },
          { l: "50%",   t: "26.7%" },
          { l: "95%",   t: "11.7%" },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.l,
              top: p.t,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "1.5px solid #FFA2A2",
              transform: "translate(-50%,-50%)",
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
 *  13. Ad Performance (Marketing) – 막대 + 목표선
 * ========================================================= */
function AdPerformanceBody() {
  const GREEN = "#B6E274";
  const LIGHT = "#D8F2A6";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>4.8</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: ALT, fontFamily: "Pretendard, sans-serif" }}>ROAS</div>
        </div>
        <div style={{ background: "#EDF9D5", color: "#5EA500", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↑ 0.6x</div>
      </div>
      <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", alignItems: "flex-end", gap: 4 }}>
        {(() => {
          const heights = [35, 50, 28, 62, 45, 92, 55];
          const sorted = [...heights].sort((a, b) => b - a);
          const [t1, t2, t3] = sorted; // 1·2·3등 높이
          return heights.map((h, i) => {
            const bg = h === t1 ? GREEN : (h === t2 || h === t3) ? LIGHT : "#ECFCCA";
            return <div key={i} style={{ flex: 1, height: `${h}%`, background: bg, borderRadius: 2 }} />;
          });
        })()}
        {/* 목표선 (대시) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "32%", borderTop: `1px dashed ${GREEN}`, opacity: 0.7, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/* =========================================================
 *  14. CS Ticket Analysis (Operations) – 카테고리별 가로 바
 * ========================================================= */
function CsTicketBody() {
  const ORANGE = "#FFB86A";
  const TRACK = "#FFF7ED";
  const BUBBLE_LIGHT = "#FFEDD4";
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 9, justifyContent: "center" }}>
      {/* 상담사 응답 (좌 상단) — 말풍선 연한 오렌지 + 안에 라인 오렌지 */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: ORANGE, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* 헤드폰 아이콘 (헤드밴드 + 양쪽 귀컵) */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 14a7 7 0 0 1 14 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <rect x="4" y="13" width="4.5" height="7" rx="1.5" fill="#fff" />
            <rect x="15.5" y="13" width="4.5" height="7" rx="1.5" fill="#fff" />
          </svg>
        </div>
        <div style={{ background: TRACK, borderRadius: "12px 12px 12px 3px", padding: "8px 11px", display: "flex", flexDirection: "column", gap: 4, maxWidth: "62%" }}>
          <div style={{ height: 5, width: 82, background: BUBBLE_LIGHT, borderRadius: 999 }} />
          <div style={{ height: 5, width: 66, background: BUBBLE_LIGHT, borderRadius: 999 }} />
        </div>
      </div>

      {/* 고객 메시지 (우 하단) — Audience Strategy 우측 카드 회색 톤과 매칭 */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, justifyContent: "flex-end" }}>
        <div style={{ background: "#F7F7F7", borderRadius: "12px 12px 3px 12px", padding: "8px 11px", display: "flex", flexDirection: "column", gap: 4, maxWidth: "62%" }}>
          <div style={{ height: 5, width: 92, background: "#EAEBED", borderRadius: 999 }} />
          <div style={{ height: 5, width: 62, background: "rgba(234,235,237,0.6)", borderRadius: 999 }} />
        </div>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#F7F7F7", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* 고객(사람 실루엣) 아이콘 */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8.5" r="4" fill="#CACCCF" />
            <path d="M4 21v-2a4.5 4.5 0 0 1 4.5-4.5h7A4.5 4.5 0 0 1 20 19v2z" fill="#CACCCF" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  15. Review Analysis (Customer Success) – 평균 별점 + 분포 바
 * ========================================================= */
function ReviewAnalysisBody() {
  const BLUE = "#51A2FF";
  const LIGHT = "#BEDBFF";
  const rows = [
    { star: 5, w: "80%" },
    { star: 4, w: "55%" },
    { star: 3, w: "30%" },
    { star: 2, w: "15%" },
    { star: 1, w: "8%"  },
  ];
  return (
    <div style={{ display: "flex", gap: 22, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      {/* 좌: 평균 별점 — 숫자/별 모두 중앙정렬 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: 1, letterSpacing: "-0.5px" }}>4.6</div>
        <div style={{ display: "flex", gap: 1 }}>
          {[1,2,3,4,5].map(i => <Star key={i} fill={i <= 4 ? BLUE : "#E6E7E9"} />)}
        </div>
      </div>
      {/* 우: 분포 바 — 세로 두께 키움, 가로 길이 축소 */}
      <div style={{ flex: "0 0 120px", maxWidth: 120, display: "flex", flexDirection: "column", gap: 4 }}>
        {rows.map((r) => (
          <div key={r.star} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ fontSize: 11, color: ALT, fontFamily: "Pretendard, sans-serif", width: 10 }}>{r.star}</div>
            <div style={{ flex: 1, height: 6, background: "#F0F0F2", borderRadius: 999 }}>
              <div style={{ width: r.w, height: "100%", background: r.star >= 4 ? BLUE : LIGHT, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Thumbnail shell styles ---------- */
const THUMB = {
  outer: {
    position: "relative",
    width: 430,
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
  },
  card: {
    position: "absolute",
    left: "50%",
    bottom: 0,
    transform: "translateX(-50%)",
    width: 266,
    height: 130,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: "14px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflow: "hidden",
  },
  title: {
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 11.18,
    fontWeight: 500,
    color: ALT,
    lineHeight: "15.48px",
  },
  bodyArea: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    width: "100%",
  },
};

/* ---------- Page styles ---------- */
const S = {
  page: {
    padding: "28px 32px",
    background: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Pretendard, Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#101828",
  },
  header: { marginBottom: 24 },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: "#667085" },

  section: { marginBottom: 36 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#101828",
    marginBottom: 14,
    letterSpacing: "-0.2px",
  },
  thumbGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 24,
  },
  thumbCard: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  thumbLabel: {
    fontSize: 12,
    color: "#7B7E85",
    fontWeight: 500,
    fontFamily: "Pretendard, sans-serif",
  },
  thumbLabelKo: {
    color: "#A8ABB1",
    fontWeight: 400,
  },

  placeholder: {
    padding: "48px 16px",
    textAlign: "center",
    color: "#98A2B3",
    fontSize: 13,
    border: "1px dashed #EAECF0",
    borderRadius: 10,
  },
};
