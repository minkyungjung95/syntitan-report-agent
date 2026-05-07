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
      { key: "personasurvey", title: "Persona Survey", ko: "페르소나 서베이", Body: PersonaSurveyBody },
    ],
  },
  {
    name: "Sales",
    bg: "#C3EADA",
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
    agents: [
      { key: "lead_scoring_agent", title: "Lead Scoring Agent", ko: "리드 스코어링 에이전트", Body: LeadScoringBody },
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
      { key: "process_efficiency", title: "Process Efficiency Analyzer", ko: "업무/프로세스 효율 분석", Body: ProcessEfficiencyBody },
      { key: "operational_kpi_analyzer", title: "Operational KPI Analyzer", ko: "운영 KPI 분석", Body: OperationalKPIBody },
    ],
  },
  {
    name: "Marketing",
    bg: "#DEEFBE",
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
    agents: [
      { key: "audiencestrategy", title: "Audience Strategy", ko: "오디언스 전략", Body: AudienceStrategyBody },
      { key: "content_performance_optimizer", title: "Content Performance Optimizer", ko: "콘텐츠 퍼포먼스 최적화", Body: ContentOptimizerBody },
      { key: "press_release_simulation", title: "Press Release Simulation", ko: "보도자료 시뮬레이션", Body: PressReleaseSimulationBody },
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
  const GREEN = "#3DB58A";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>$2.4M</div>
        <div style={{ background: "#E8F7F1", color: GREEN, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↑ 12%</div>
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="pipeAreaA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.22" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,32 C20,30 40,24 60,21 C80,18 95,17 110,16 L110,40 L0,40 Z" fill="url(#pipeAreaA)" />
          <path d="M0,32 C20,30 40,24 60,21 C80,18 95,17 110,16" fill="none" stroke={GREEN} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M110,16 C135,12 165,7 200,3" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.35" />
        </svg>
        <div style={{
          position: "absolute",
          left: "55%",
          top: "40%",
          transform: "translate(-50%,-50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#FFFFFF",
          border: `1.5px solid ${GREEN}`,
          boxSizing: "border-box",
        }} />
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>$145</div>
        <div style={{ background: "#EFEBFF", color: PURPLE, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>+18%</div>
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="priceAreaA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PURPLE} stopOpacity="0.22" />
              <stop offset="100%" stopColor={PURPLE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M5,38 C40,20 80,5 100,5 C120,5 160,20 195,38 L195,40 L5,40 Z" fill="url(#priceAreaA)" />
          <path d="M5,38 C40,20 80,5 100,5 C120,5 160,20 195,38" fill="none" stroke={PURPLE} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div style={{
          position: "absolute",
          left: "50%",
          top: 5,
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#FFFFFF",
          border: `2px solid ${PURPLE}`,
          boxSizing: "border-box",
        }} />
      </div>
    </div>
  );
}

/* =========================================================
 *  06. Process Efficiency Analyzer (Operations) – Before/After 시간 비교
 * ========================================================= */
function ProcessEfficiencyBody() {
  const ORANGE = "#D38330";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ fontSize: 7.5, color: ALT, fontFamily: "Pretendard, sans-serif", width: 30 }}>Before</div>
        <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#F5F5F5" }}>
          <div style={{ width: "92%", height: "100%", background: "#E6E7E9", borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 9, fontWeight: 600, color: "#9CA0A8", fontFamily: "Pretendard, sans-serif", width: 26, textAlign: "right" }}>8.2d</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ fontSize: 7.5, color: ALT, fontFamily: "Pretendard, sans-serif", width: 30 }}>After</div>
        <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#F5F5F5" }}>
          <div style={{ width: "52%", height: "100%", background: ORANGE, borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 9, fontWeight: 600, color: ORANGE, fontFamily: "Pretendard, sans-serif", width: 26, textAlign: "right" }}>4.5d</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          background: "#FFFFFF",
          border: `1px solid ${ORANGE}`,
          color: ORANGE,
          fontSize: 9,
          fontWeight: 700,
          padding: "1.5px 6px",
          borderRadius: 5,
          fontFamily: "Pretendard, sans-serif",
          lineHeight: "11px",
          letterSpacing: "-0.1px",
        }}>↓ 45%</div>
      </div>
    </div>
  );
}

/* =========================================================
 *  07. Operational KPI Analyzer (Operations) – 2단 KPI 타일 (큰 숫자)
 * ========================================================= */
function OperationalKPIBody() {
  const ORANGE = "#D38330";
  const tiles = [
    { value: "94%", trend: "▲" },
    { value: "2.4d", trend: "▼" },
  ];
  return (
    <div style={{ display: "flex", gap: 7, width: "100%", height: "100%" }}>
      {tiles.map((t, i) => (
        <div key={i} style={{
          flex: 1,
          background: "#FBF6EE",
          borderRadius: 8,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          minWidth: 0,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>{t.value}</div>
          <div style={{ fontSize: 12, color: ORANGE, fontWeight: 700, lineHeight: "14px" }}>{t.trend}</div>
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
    <div style={{ display: "flex", alignItems: "stretch", height: 74, width: "100%", position: "relative" }}>
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

        {/* 이상치 영역 (흐린 레드 박스) */}
        <div style={{
          position: "absolute",
          left: "37%",
          top: 0,
          width: "12%",
          height: "100%",
          background: "rgba(255, 100, 103, 0.13)",
          borderRadius: 3,
        }} />

        {/* SVG 라인 (베이스라인 부드러운 웨이브 + 한 지점 스파이크) */}
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-hidden="true"
        >
          <path
            d="M5,50 C25,48 45,52 65,50 C72,50 76,50 80,50 L84,22 L88,50 C100,50 115,52 135,50 C155,48 175,52 195,50"
            fill="none"
            stroke={LINE}
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 스파이크 정점 레드 점 (x=84/200=42%, y=22/60=36.7%) */}
        <div style={{
          position: "absolute",
          left: "42%",
          top: "36.7%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: RED,
          border: "2px solid #FFFFFF",
          transform: "translate(-50%,-50%)",
          boxSizing: "border-box",
        }} />

        {/* 점 위 경고 뱃지 (레드 fill + 화이트 삼각형 아이콘만) */}
        <div style={{
          position: "absolute",
          left: "42%",
          top: 0,
          transform: "translate(-50%, 0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: RED,
          padding: "3px 5px",
          borderRadius: 999,
          lineHeight: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
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
  const GREEN = "#76B82A";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#171719", fontFamily: "Pretendard, sans-serif", lineHeight: "24px", letterSpacing: "-0.4px" }}>+24%</div>
        <div style={{ background: "#EEF6E0", color: GREEN, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, fontFamily: "Pretendard, sans-serif", lineHeight: "13px" }}>↑ this week</div>
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
          <path d="M0,30 L25,28 L50,32 L75,24 L100,26 L125,18 L150,14 L175,10 L200,5" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
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
      height: "100%",
      background: "#F7F7F7",
      borderRadius: 6,
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
        }}>PRESS RELEASE</div>
        <div style={{ width: 4, height: 4, borderRadius: 999, background: "#DCDDDF" }} />
      </div>

      {/* 헤드라인 (gray-300, 본문보다 한 단계 진함) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ height: 8, width: "100%", borderRadius: 999, background: "#DCDDDF" }} />
        <div style={{ height: 8, width: "68%", borderRadius: 999, background: "#DCDDDF" }} />
      </div>

      {/* 본문 (gray-200 / gray-100) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ height: 5, width: "100%", borderRadius: 999, background: "#E6E7E9" }} />
        <div style={{ height: 5, width: "82%", borderRadius: 999, background: "#F0F0F2" }} />
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
