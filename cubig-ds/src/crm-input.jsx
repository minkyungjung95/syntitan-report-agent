import { useState } from "react";
import { T } from "./tokens.jsx";
import { Btn, Chip } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CrmCampaignInput — CRM Agent 실행 전 입력 화면
 *
 *  설계 원칙: 업로드한 CSV 에서 뽑을 수 있는 값은 묻지 않는다.
 *    데이터에 있음  → 세그먼트 · 방문 주기 · 발송 이력 · 인구통계 · 과거 전환율
 *    데이터에 없음  → 캠페인 의도 · 제공 가능한 혜택 · 예산/채널/시점 제약 · 브랜드
 *  타겟 세그먼트는 입력이 아니라 출력 — 목적을 받아 에이전트가 골라준다.
 * ═══════════════════════════════════════════════════════════════════════════ */

const F = "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif";
const BLUE = "#2B7FFF";
const BLUE_SOFT = "#EFF6FF";
const BLUE_LINE = "#BEDBFF";

/* ── 목적 프리셋 — 업종마다 쓰는 말이 다름. 업종 미선택 시 범용 세트 ── */
const GOALS_DEFAULT = [
  { key: "revisit", label: "재방문 늘리기" },
  { key: "first", label: "첫 방문 유도" },
  { key: "winback", label: "오래 안 온 고객 다시 부르기" },
  { key: "remain", label: "남은 혜택 사용 유도" },
  { key: "season", label: "시즌 · 신상품 프로모션" },
];

const GOALS_BY_INDUSTRY = {
  "병원 · 클리닉": [
    { key: "revisit", label: "재방문 늘리기" },
    { key: "first", label: "첫 상담 유도" },
    { key: "winback", label: "오래 안 오신 환자 다시 부르기" },
    { key: "remain", label: "남은 시술 예약 유도" },
    { key: "season", label: "신규 시술 · 시즌 프로모션" },
  ],
  "뷰티 · 미용": [
    { key: "revisit", label: "재방문 늘리기" },
    { key: "first", label: "첫 방문 유도" },
    { key: "winback", label: "오래 안 오신 고객 다시 부르기" },
    { key: "remain", label: "남은 횟수 예약 유도" },
    { key: "season", label: "시즌 · 신상품 프로모션" },
  ],
  "피트니스 · 레슨": [
    { key: "revisit", label: "재등록 유도" },
    { key: "first", label: "체험 · 상담 유도" },
    { key: "winback", label: "안 나오는 회원 복귀 유도" },
    { key: "remain", label: "남은 PT 예약 유도" },
    { key: "season", label: "시즌 프로모션" },
  ],
  "리테일 · 오프라인 매장": [
    { key: "revisit", label: "재방문 늘리기" },
    { key: "first", label: "첫 방문 유도" },
    { key: "winback", label: "오래 안 온 고객 다시 부르기" },
    { key: "remain", label: "멤버십 혜택 안내" },
    { key: "season", label: "시즌 · 신상품 프로모션" },
  ],
  "이커머스": [
    { key: "revisit", label: "재구매 유도" },
    { key: "first", label: "첫 구매 유도" },
    { key: "winback", label: "오래 안 온 고객 다시 부르기" },
    { key: "remain", label: "장바구니 이탈 고객 회수" },
    { key: "season", label: "시즌 · 신상품 프로모션" },
  ],
  "외식 · 카페": [
    { key: "revisit", label: "재방문 늘리기" },
    { key: "first", label: "첫 방문 유도" },
    { key: "winback", label: "오래 안 온 고객 다시 부르기" },
    { key: "remain", label: "발급 쿠폰 사용 유도" },
    { key: "season", label: "신메뉴 · 시즌 프로모션" },
  ],
  "교육 · 학원": [
    { key: "revisit", label: "재수강 유도" },
    { key: "first", label: "상담 · 체험 수업 유도" },
    { key: "winback", label: "그만둔 학생 복귀 유도" },
    { key: "remain", label: "남은 수업 수강 유도" },
    { key: "season", label: "신규 과정 안내" },
  ],
};

/* ── 업종 — 메시지 톤·소재와 표현 규정이 달라지는 값. 데이터로는 확정할 수 없음 ── */
const INDUSTRIES = [
  "병원 · 클리닉",
  "뷰티 · 미용",
  "피트니스 · 레슨",
  "리테일 · 오프라인 매장",
  "이커머스",
  "외식 · 카페",
  "교육 · 학원",
  "기타",
];

/* ── SMS/LMS 는 길이에 따라 자동으로 갈리므로 고를 값이 아님.
      승인·광고 가능 여부가 갈리는 건 알림톡뿐 ── */
const CHANNELS = [
  { key: "sms", label: "문자", desc: "45자 넘으면 장문(LMS)으로 자동 전환 · 20~50원" },
  { key: "alimtalk", label: "카카오 알림톡", desc: "채널 승인 필요 · 광고 불가 · 15원" },
];

/* ── 폼 요소 ── */
function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, lineHeight: "21px", color: T.gray990 }}>
          {label}
        </span>
        {required && <span style={{ color: "#FB2C36", fontSize: 13, lineHeight: "20px" }}>*</span>}
        {hint && (
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 400, lineHeight: "18px", color: T.gray800 }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  fontFamily: F,
  fontSize: 14,
  lineHeight: "22px",
  color: T.gray990,
  background: T.white,
  border: `1px solid ${T.gray200}`,
  borderRadius: 10,
  padding: "10px 12px",
  outline: "none",
};

function TextInput({ suffix, ...props }) {
  if (!suffix) return <input style={inputStyle} {...props} />;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input style={{ ...inputStyle, paddingRight: 44 }} {...props} />
      <span style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        fontFamily: F, fontSize: 13, color: T.gray800, pointerEvents: "none",
      }}>
        {suffix}
      </span>
    </div>
  );
}

function Select({ value, onChange, placeholder, options }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          appearance: "none",
          paddingRight: 36,
          color: value ? T.gray990 : T.gray400,
          cursor: "pointer",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <svg
        width="12" height="12" viewBox="0 0 12 12" fill="none"
        style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke={T.gray800} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function TextArea({ value, onChange, placeholder, max = 300, rows = 3 }) {
  return (
    <div style={{ position: "relative" }}>
      <textarea
        rows={rows}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, resize: "vertical", paddingBottom: 26 }}
      />
      <span style={{
        position: "absolute", left: 12, bottom: 10,
        fontFamily: F, fontSize: 12, color: T.gray400,
      }}>
        {value.length}/{max}
      </span>
    </div>
  );
}

function CheckRow({ checked, onToggle, label, desc }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        flex: "1 1 190px", minWidth: 0, textAlign: "left", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px", borderRadius: 10,
        background: checked ? BLUE_SOFT : T.white,
        border: `1px solid ${checked ? BLUE_LINE : T.gray200}`,
        fontFamily: F,
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 5, flexShrink: 0,
        background: checked ? BLUE : T.white,
        border: `1px solid ${checked ? BLUE : T.gray300}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2L4.8 8.5L9.5 3.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: T.gray990 }}>{label}</span>
        {desc && <span style={{ fontSize: 12, fontWeight: 400, color: T.gray800 }}>{desc}</span>}
      </span>
    </button>
  );
}

export default function CrmCampaignInput() {
  const [industry, setIndustry] = useState("");
  const [goals, setGoals] = useState([]);  // 한 번 발송에 목적이 여러 개 섞이는 게 실제 케이스
  const [detail, setDetail] = useState("");
  const [sender, setSender] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [channels, setChannels] = useState({ sms: true, alimtalk: true });

  const goalOptions = GOALS_BY_INDUSTRY[industry] ?? GOALS_DEFAULT;

  const ready = !!industry && goals.length > 0 && !!sender;

  return (
    <div style={{ minHeight: "100vh", background: T.gray50, padding: "40px 24px 80px", fontFamily: F }}>
      <div style={{
        maxWidth: 880, margin: "0 auto",
        background: T.white, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${T.gray200}`,
      }}>
        <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 타이틀 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 700, lineHeight: "28px", color: T.gray990 }}>
              CRM 캠페인 추천
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>
              누구에게 어떤 메시지를 보낼지 정하고, 발송 전에 전환율과 리프트를 예측합니다.
            </span>
          </div>

          {/* 안내 — 목적이 타겟 추천을 좌우함 */}
          <div style={{
            background: BLUE_SOFT, border: `1px solid ${BLUE_LINE}`, borderRadius: 10,
            padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <span style={{ color: BLUE, fontSize: 13, fontWeight: 700, lineHeight: "20px" }}>✦</span>
            <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#1447E6" }}>
              세그먼트 · 방문 주기 · 발송 이력은 앞서 선택한 데이터셋에서 자동으로 계산합니다.
              캠페인 목적을 구체적으로 적을수록 보낼 대상과 문구가 정확해집니다.
            </span>
          </div>

          {/* 1. 업종 · 브랜드명 — 톤과 표기의 기준 */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="업종" required hint="메시지 톤과 표현 규정이 달라집니다">
                <Select
                  value={industry}
                  onChange={(v) => { setIndustry(v); setGoals([]); }}
                  placeholder="업종을 선택하세요"
                  options={INDUSTRIES}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="브랜드명" required>
                <TextInput
                  placeholder="예) 더뷰클리닉"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* 2. 목적 — 업종 미선택이면 범용 칩, 업종을 고르면 그 업종 말로 바뀜 */}
          <Field label="이번 캠페인으로 만들고 싶은 결과" required hint="여러 개 고를 수 있어요">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {goalOptions.map((g) => (
                <Chip
                  key={g.key}
                  label={g.label}
                  size="Medium"
                  active={goals.includes(g.key)}
                  onClick={() =>
                    setGoals((s) => (s.includes(g.key) ? s.filter((k) => k !== g.key) : [...s, g.key]))
                  }
                />
              ))}
            </div>
            {/* 소재·혜택 제약이 여기서 들어와야 문구가 구체해짐 */}
            <TextArea
              rows={2}
              value={detail}
              onChange={setDetail}
              placeholder="밀고 싶은 상품이나 할인 폭을 적으면 문구가 정확해집니다 (선택)"
            />
          </Field>

          {/* 4. 사이트 — 브랜드 톤·상품명을 여기서 읽어 문구에 반영 */}
          <Field label="홈페이지 · SNS 주소 (선택)" hint="브랜드 톤과 상품 정보를 참고해 문구를 씁니다">
            <TextInput
              type="url"
              inputMode="url"
              placeholder="예) https://theview.kr · instagram.com/theview"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </Field>

          {/* 5. 채널 */}
          <Field label="사용 가능 채널 (선택)" hint="보낼 수 있는 채널만 남겨주세요">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CHANNELS.map((c) => (
                <CheckRow
                  key={c.key}
                  label={c.label}
                  desc={c.desc}
                  checked={channels[c.key]}
                  onToggle={() => setChannels((s) => ({ ...s, [c.key]: !s[c.key] }))}
                />
              ))}
            </div>
          </Field>

          {/* 실행 */}
          <Btn
            variant="solid-primary"
            size="lg"
            disabled={!ready}
            onClick={() => { window.location.hash = "#/crm"; }}
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          >
            캠페인 추천 받기
          </Btn>
        </div>
      </div>
    </div>
  );
}
