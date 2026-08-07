import { useState } from "react";
import { T } from "./tokens.jsx";
import { Btn } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CrmCampaignInput — CRM Agent 실행 전 입력 화면
 *
 *  설계 원칙: 업로드한 CSV 에서 뽑을 수 있는 값은 묻지 않는다.
 *    데이터에 있음  → 세그먼트 · 방문 주기 · 발송 이력 · 과거 전환율 · 수신동의
 *    데이터에 없음  → 브랜드가 뭘 파는지 · 지금 걸린 혜택 · 평소 쓰는 말투
 *  타겟 세그먼트와 발송 순서는 입력이 아니라 출력 — 에이전트가 골라준다.
 * ═══════════════════════════════════════════════════════════════════════════ */

const F = "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif";
const BLUE = "#2B7FFF";
const BLUE_SOFT = "#EFF6FF";
const BLUE_LINE = "#BEDBFF";

/* ── 업종 — 호칭(환자/고객/회원)과 광고 표현 규정이 갈리는 기준 ── */
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

export default function CrmCampaignInput() {
  const [industry, setIndustry] = useState("");
  const [brand, setBrand] = useState("");
  const [about, setAbout] = useState("");
  const [event, setEvent] = useState("");
  const [tone, setTone] = useState("");

  // 업종·브랜드명·소개까지 있어야 문구를 쓸 수 있음. 이벤트·말투는 있으면 더 정확해지는 값
  const ready = !!industry && !!brand && about.trim().length > 0;

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
              CRM 캠페인
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: T.gray800 }}>
              고객 데이터로 세그먼트를 나누고, 세그먼트마다 캠페인과 메시지를 설계해 발송 전에 성과를 예측합니다.
            </span>
          </div>

          {/* 안내 — 목적이 타겟 추천을 좌우함 */}
          <div style={{
            background: BLUE_SOFT, border: `1px solid ${BLUE_LINE}`, borderRadius: 10,
            padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <span style={{ color: BLUE, fontSize: 13, fontWeight: 700, lineHeight: "20px" }}>✦</span>
            <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#1447E6" }}>
              보낼 고객군과 발송 순서는 앞서 선택한 데이터셋에서 자동으로 계산합니다.
              여기서는 브랜드와 혜택만 알려주시면 됩니다.
            </span>
          </div>

          {/* 1. 업종 · 브랜드명 — 톤과 표기의 기준 */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="업종" required hint="호칭과 표현 규정이 업종마다 다릅니다">
                <Select
                  value={industry}
                  onChange={setIndustry}
                  placeholder="업종을 선택하세요"
                  options={INDUSTRIES}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <Field label="브랜드명" required hint="메시지 맨 앞에 표시되는 이름입니다">
                <TextInput
                  placeholder="예) 더뷰클리닉"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* 2. 브랜드 소개 — 무엇을 파는 곳인지 알아야 혜택과 소재를 고를 수 있음 */}
          <Field label="브랜드 소개" required hint="주력 상품·서비스와 주 고객층을 적어주세요">
            <TextArea
              rows={3}
              value={about}
              onChange={setAbout}
              placeholder="예) 리프팅·피부 관리 중심 클리닉입니다. 30~40대 여성 고객이 많고 6~8주 주기로 재방문합니다."
            />
          </Field>

          {/* 3. 진행 중인 이벤트 — 있으면 메시지 혜택 문구에 그대로 들어감 */}
          <Field label="진행 중인 이벤트" hint="기간과 혜택을 함께 적으면 메시지에 그대로 반영합니다">
            <TextArea
              rows={2}
              value={event}
              onChange={setEvent}
              placeholder="예) 7월 31일까지 리프팅 재방문 시 10% 할인 · 10만원 이상 결제 시 적용"
            />
          </Field>

          {/* 4. 말투 예시 — 실제 보낸 문장이 있으면 어투를 그대로 따라 씀 */}
          <Field label="말투 예시" hint="평소 보내시는 문구를 붙여넣으면 같은 어투로 씁니다">
            <TextArea
              rows={3}
              value={tone}
              onChange={setTone}
              placeholder="실제로 보내셨던 메시지를 그대로 붙여넣어 주세요 (30자 이상)"
            />
          </Field>

          {/* 실행 */}
          <Btn
            variant="solid-primary"
            size="lg"
            disabled={!ready}
            onClick={() => { window.location.hash = "#/crm"; }}
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          >
            분석 시작
          </Btn>
        </div>
      </div>
    </div>
  );
}
