import { useState } from "react";
// public/ 에서 fetch 하면 Vite 가 ETag 캐싱해 값이 갱신되지 않음 — 번들에 넣어 HMR 이 바로 반영하게 함
import reportKo from "../public/json/crm-campaign.json";
import reportEn from "../public/json/crm-campaign.en.json";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  DataTable,
  InfoCard,
  InfoCardRow,
} from "./report-components";
import { GroupedBarChart, StackedHBar } from "./charts";
import { T, DownloadIcon, DatabaseIcon, PersonIcon, ArrowUpIcon, CheckCircleIcon, FlagIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CrmCampaignReport — CRM Agent (세그먼트 자동 생성 · 캠페인 추천 · 메시지 품질)
 *
 *  데이터 소스: public/json/crm-campaign.json (fetch)
 *
 *  차트 사용 (rule 11 — 동일 타입 3회 이상 반복 금지):
 *    DonutChart 1
 *    DataTable 2 (세그먼트 구성 · 세그먼트별 예상 성과)
 * ═══════════════════════════════════════════════════════════════════════════ */

const GRAY = "#E6E7E9";

/* ── 채널 약어는 CRM 처음 하는 사람에겐 안 읽힘 — 화면에서만 풀어 씀(CSV 는 원문 유지) ── */
const CHANNEL_LABEL = {
  SMS: "단문 문자(SMS)",
  LMS: "장문 문자(LMS)",
};

const KakaoGlyph = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#FEE500" />
    <path
      d="M12 6C8.41 6 5.5 8.24 5.5 11c0 1.77 1.2 3.32 3.01 4.2l-.68 2.5c-.06.22.18.4.38.28l2.98-1.96c.26.02.53.04.81.04 3.59 0 6.5-2.24 6.5-5S15.59 6 12 6z"
      fill="#3C1E1E"
    />
  </svg>
);

const SmsGlyph = ({ size = 14, color = "#7B7E85" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8.2l-4.3 3v-3H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5z"
      stroke={color} strokeWidth="1.8" strokeLinejoin="round"
    />
  </svg>
);

const channelIcon = (ch) => (ch.includes("알림톡") ? <KakaoGlyph /> : <SmsGlyph />);
const OUTLINE = "#E6E7E9";

/* ── Key Findings 그룹 아이콘 — JSON 의 icon 키 → 아이콘 컴포넌트 ── */
const FINDING_ICONS = {
  person: <PersonIcon size={18} color="#171719" />,
  flag: <FlagIcon size={18} color="#171719" />,
  trend: <ArrowUpIcon size={18} color="#171719" />,
  check: <CheckCircleIcon size={18} color="#171719" />,
};

/* ── 복사 아이콘 (tokens.jsx 미포함 — 카드 전용) ── */
const CopyGlyph = ({ size = 14, color = "#171719" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="5.75" y="5.75" width="8.5" height="8.5" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M10.25 3.75V3.5a1.75 1.75 0 0 0-1.75-1.75H3.5A1.75 1.75 0 0 0 1.75 3.5v5a1.75 1.75 0 0 0 1.75 1.75h.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── 추천 메시지 라벨 아이콘 — 이 블록이 "실제로 나가는 문자"임을 표시 ── */
const ChatGlyph = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1.5" width="14" height="11" rx="3" fill={T.green500} />
    <path d="M5 14.5v-3l2.6 1.5L5 14.5Z" fill={T.green500} />
    <path d="M4.6 5.4h6.8M4.6 8.4h4.4" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);


/* ── 화면에 직접 박히는 문자열 — JSON 밖에 있는 라벨은 여기서 언어를 가름 ── */
const UI = {
  ko: {
    toInput: "입력 화면으로 이동", version: "버전", pdf: "PDF 다운로드",
    download: "발송 리스트 다운로드", fileName: "crm-발송리스트",
    rank: (n) => `${n}순위`, message: "메시지", copy: "복사",
    copied: "메시지를 복사했습니다", copyFail: "복사에 실패했습니다",
    sent: "발송", cost: "비용", conv: "예상 전환", lift: "리프트",
    total: "합계", na: "산정 불가",
    chartTitle: "CRM 캠페인 예상 성과",
    chartSub: "과거 발송 이력의 수신·미수신 고객 전환율 차이를 발송 대상에 적용한 예상치입니다.",
    without: "캠페인 안 했을 때", with_: "캠페인 했을 때",
    segTotal: (n) => `고객 세그먼트 (총 ${n}명)`,
    unit: "명", loading: "불러오는 중...",
    inputBrand: "업종 · 브랜드명", inputAbout: "브랜드 소개",
    colSegment: "고객 세그먼트", colRank: "순위", colCampaign: "캠페인 · 채널", colSend: "발송 대상",
    colConv: "예상 전환", colMessage: "메시지", outOf: "중",
  },
  en: {
    toInput: "Go to input screen", version: "Version", pdf: "Download PDF",
    download: "Download send list", fileName: "crm-send-list",
    rank: (n) => `#${n}`, message: "Message", copy: "Copy",
    copied: "Message copied", copyFail: "Copy failed",
    sent: "Sent", cost: "Cost", conv: "Est. conv.", lift: "Lift",
    total: "Total", na: "N/A",
    chartTitle: "CRM campaign — projected performance",
    chartSub: "Projected from the conversion gap between customers who did and did not receive past sends, applied to the reachable customers.",
    without: "Without campaign", with_: "With campaign",
    segTotal: (n) => `Customer segments (total ${n})`,
    unit: "", loading: "Loading...",
    inputBrand: "Industry · Brand", inputAbout: "About the brand",
    colSegment: "Segment", colRank: "Priority", colCampaign: "Campaign · Channel", colSend: "Reachable",
    colConv: "Est. conversions", colMessage: "Message", outOf: "sent",
  },
};

/* ── 한/영 전환 ── */
function LangSwitch({ lang, onChange }) {
  return (
    <span style={{ display: "inline-flex", border: `1px solid ${T.gray200}`, borderRadius: 8, overflow: "hidden" }}>
      {["ko", "en"].map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          style={{
            padding: "7px 14px", border: "none", cursor: "pointer",
            background: lang === k ? T.gray990 : "#FFFFFF",
            color: lang === k ? "#FFFFFF" : T.gray800,
            fontSize: 13, fontWeight: 600, lineHeight: "20px",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          {k === "ko" ? "한국어" : "English"}
        </button>
      ))}
    </span>
  );
}

/* ── 표 헤더 도움말 — 산정 조건이 길면 헤더가 두 줄로 늘어나 열 폭이 흔들림.
     조건은 접어두고 필요한 사람만 열어보게 ── */
function HeaderHint({ label, hint }) {
  // 표 래퍼가 overflow 를 잡고 있어 absolute 로 띄우면 잘림 — 화면 좌표로 고정 배치
  const [pos, setPos] = useState(null);
  const show = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.bottom + 8 });
  };
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
      onMouseEnter={show}
      onMouseLeave={() => setPos(null)}
    >
      {label}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ cursor: "help", flexShrink: 0 }}>
        <circle cx="7" cy="7" r="5.6" stroke={T.gray400} strokeWidth="1.2" />
        <path d="M7 6.1v4" stroke={T.gray400} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="7" cy="4.2" r="0.75" fill={T.gray400} />
      </svg>
      {pos && (
        <span style={{
          position: "fixed", top: pos.y, left: pos.x, transform: "translateX(-50%)",
          width: 260, padding: "10px 12px", zIndex: 100,
          background: T.gray990, color: "#FFFFFF", borderRadius: 8,
          fontSize: 12, fontWeight: 400, lineHeight: "18px",
          textAlign: "left", whiteSpace: "normal",
          boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
          pointerEvents: "none",
        }}>
          {hint}
        </span>
      )}
    </span>
  );
}

/* ── 리프트 상승 표시 — 값 앞에 붙는 삼각형 ── */
const TriangleUpGlyph = ({ size = 9, color = T.blue500 }) => (
  <svg width={size} height={size} viewBox="0 0 9 9" fill="none">
    <path d="M4.5 1.5 8 7H1L4.5 1.5Z" fill={color} />
  </svg>
);

/* ── 메시지 본문의 예약 링크·전화번호를 클릭 가능하게 (복사되는 원문은 그대로 유지) ── */
const LINK_RE = /((?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?|\d{2,4}-\d{3,4}-\d{3,4})/gi;

function linkify(text) {
  const nodes = [];
  let last = 0;
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const raw = m[0];
    const isTel = /^\d/.test(raw);
    nodes.push(
      <a
        key={m.index}
        href={isTel ? `tel:${raw.replace(/-/g, "")}` : raw.startsWith("http") ? raw : `https://${raw}`}
        target={isTel ? undefined : "_blank"}
        rel="noreferrer"
        style={{ color: "#2B7FFF", textDecoration: "underline", textUnderlineOffset: 2 }}
      >
        {raw}
      </a>
    );
    last = m.index + raw.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ── 메시지 템플릿 — #{변수} 자리를 예시값으로 채우면서 개인화 구간을 눈에 띄게 ── */
const VAR_RE = /#\{([^}]+)\}/g;

function renderTemplate(template, vars) {
  const nodes = [];
  let last = 0;
  let m;
  VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(template)) !== null) {
    if (m.index > last) nodes.push(...linkify(template.slice(last, m.index)));
    nodes.push(
      <span
        key={m.index}
        title={`개인화 변수 #{${m[1]}}`}
        style={{
          background: "#EFF6FF", color: "#1447E6", fontWeight: 600,
          borderRadius: 4, padding: "0 3px",
        }}
      >
        {vars[m[1]] ?? m[1]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < template.length) nodes.push(...linkify(template.slice(last)));
  return nodes;
}

/* ── 발송 리스트 CSV — 고객 한 명이 한 행. 발송 시스템에 그대로 업로드하는 형식 ──
     발송메시지는 치환 완료본 — 템플릿ID·치환변수만으로도 발송은 되지만,
     실제로 뭐가 나가는지 파일 안에서 바로 확인할 수 있어야 함.
     BOM 을 붙여 Excel 에서 한글이 깨지지 않게 함 ── */
const CSV_HEADER = [
  "고객ID", "고객명", "연락처", "세그먼트", "우선순위", "채널", "템플릿ID",
  "발송예정일시", "홀드아웃", "경과일", "경과개월", "만료일", "총횟수", "잔여횟수", "쿠폰코드",
  "발송메시지",
];

/* 샘플 고객 생성 — 실제 파이프라인에서는 CRM DB 조회 결과가 들어옴.
   시드 기반이라 같은 리포트에서 언제 받아도 같은 명단이 나옴 */
const SURNAME = "김이박최정강조윤장임한오서신권황안송전홍".split("");
const GIVEN1 = "민서지현예수하은주도윤채소유".split("");
const GIVEN2 = "경우진아연서준호빈영희정수".split("");

function seeded(n) {
  let x = (n * 1103515245 + 12345) & 0x7fffffff;
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function buildSendRows(messages, campaignBySegment) {
  const num = (s) => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
  const rows = [];
  let seq = 0;

  messages.forEach((m, si) => {
    const c = campaignBySegment[m.segment] || {};
    const total = num(c["발송 가능 인원"]);
    const rand = seeded(si + 1);
    const base = m.sampleVars || {};

    for (let i = 0; i < total; i++) {
      seq += 1;
      const r1 = rand(), r2 = rand(), r3 = rand();
      const name =
        SURNAME[Math.floor(r1 * SURNAME.length)] +
        GIVEN1[Math.floor(r2 * GIVEN1.length)] +
        GIVEN2[Math.floor(r3 * GIVEN2.length)];
      const phone = `010-****-${String(1000 + Math.floor(r1 * 9000)).slice(0, 4)}`;

      // 개인별로 흔들리는 값 — 세그먼트 평균 기준 ±20%
      const vary = (v, pct = 0.2) => Math.max(1, Math.round(v * (1 - pct + rand() * pct * 2)));
      const vars = {
        이름: name,
        경과일: base.경과일 ? String(vary(Number(base.경과일))) : "",
        경과개월: base.경과개월 ? String(vary(Number(base.경과개월), 0.3)) : "",
        만료일: base.만료일 || "",
        총횟수: base.총횟수 || "",
        잔여횟수: base.잔여횟수 ? String(Math.max(1, Math.round(rand() * Number(base.총횟수 || 5)))) : "",
        쿠폰코드: base.쿠폰코드 ? `CPN-${String(100000 + seq).slice(-6)}` : "",
      };

      rows.push([
        `C${String(100000 + seq).slice(-6)}`,
        name,
        phone,
        m.segment,
        `${m.rank}순위`,
        c["캠페인 채널"],
        m.templateId,
        m.sendAt,
        i % 10 === 9 ? "Y" : "N", // 세그먼트별 10% 홀드아웃(미발송 대조군)
        vars.경과일, vars.경과개월, vars.만료일, vars.총횟수, vars.잔여횟수, vars.쿠폰코드,
        m.template.replace(VAR_RE, (_, k) => vars[k] ?? ""),
      ]);
    }
  });

  return rows;
}

function downloadSendList(messages, campaignBySegment, fileName) {
  const rows = [CSV_HEADER, ...buildSendRows(messages, campaignBySegment)];
  const csv = rows
    .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── 클립보드 복사 — 버튼 라벨은 그대로 두고 토스트로 알림 ── */
async function copyText(text, notify, t) {
  try {
    await navigator.clipboard.writeText(text);
    notify?.(t.copied);
  } catch (e) {
    console.error("클립보드 복사 실패", e);
    notify?.(t.copyFail);
  }
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", left: "50%", bottom: 32, transform: "translateX(-50%)",
      background: "#171719", color: "#FFFFFF", borderRadius: 10,
      padding: "12px 18px", fontSize: 14, fontWeight: 500, lineHeight: "21px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.22)", zIndex: 100,
      fontFamily: "Pretendard, sans-serif", pointerEvents: "none",
    }}>
      {message}
    </div>
  );
}

/* ── 실행 조건 — 사용자가 입력 화면에서 넣은 값. 리포트를 다시 열었을 때 전제를 알 수 있게 ── */
const BuildingGlyph = ({ size = 18, color = "#7B7E85" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="3" width="16" height="18" rx="1.5" stroke={color} strokeWidth="1.7" />
    <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
const TagGlyph = ({ size = 18, color = "#7B7E85" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.5 11.4V4.5a1 1 0 0 1 1-1h6.9a1 1 0 0 1 .7.3l8.1 8.1a1 1 0 0 1 0 1.4l-6.9 6.9a1 1 0 0 1-1.4 0L3.8 12.1a1 1 0 0 1-.3-.7z"
      stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.4" fill={color} />
  </svg>
);

function InputCard({ icon, label, value }) {
  return (
    <div style={{
      flex: "1 1 240px", minWidth: 0,
      background: "#FFFFFF", border: `1px solid ${OUTLINE}`, borderRadius: 16,
      padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 12,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 10, background: "#F7F7F8",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#7B7E85" }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 600, lineHeight: "23px", color: "#171719" }}>{value}</span>
      </span>
    </div>
  );
}

/* ── 캠페인 블록 — 한 세그먼트의 "무엇을 · 누구에게 · 어떤 메시지로 · 어떤 효과"를 한 행에 ──
     좌: 캠페인 설계 + 예상 성과 / 우: 실제 발송 메시지 원문 + 복사 ── */
/* ── 추천 캠페인 표 — 한 행이 한 세그먼트, 4열.
     발송 대상은 예상 전환의 모수라 같은 칸에 (N명 중)으로 붙이고,
     비용은 성과가 아니라 채널에 따르는 값이라 메시지 카드 헤더로 옮김 ── */
const CG = "184px minmax(220px, 1fr) 168px minmax(300px, 1.05fr)";
/* 열 구분선은 셀 padding 안쪽에 — grid gap 으로 띄우면 선을 그을 자리가 없음 */
const DIV = (i) => (i === 0 ? {} : { borderLeft: `1px solid ${T.gray100}` });
const isKakaoCh = (ch) => /알림톡|친구톡|Alimtalk|Friend/.test(ch);

/* 상위 3개만 색을 줘서 "이번에 이거부터"가 표를 훑는 순간 잡히게.
   1순위는 채움, 2·3순위는 테두리, 4순위 이하는 회색 — 우선순위가 색의 세기로 읽힘 */
const RANK_STYLE = (rank) =>
  rank === 1 ? { bg: T.green500, fg: "#FFFFFF", bd: T.green500 }
  : rank <= 3 ? { bg: "#FFFFFF", fg: "#00A344", bd: "#7BF1A8" }
  : { bg: T.gray50, fg: "#9EA1A7", bd: T.gray200 };
const RANK_ROW_BG = (rank) => (rank <= 3 ? "rgba(0, 201, 80, 0.07)" : "transparent");

function CampaignTable({ messages, campaignBySegment, onToast, meta, t }) {
  const H = [t.colSegment, t.colCampaign, t.colConv, t.colMessage];

  return (
    <ContentCard padding={0} style={{ overflow: "hidden" }}>
      <div style={{
        display: "grid", gridTemplateColumns: CG,
        padding: "14px 0", background: T.gray25,
        borderBottom: `1px solid ${T.gray200}`,
        fontSize: 14, fontWeight: 400, lineHeight: "20px", color: T.gray800, textAlign: "center",
      }}>
        {H.map((h, i) => <span key={h} style={{ ...DIV(i), padding: "0 20px" }}>{h}</span>)}
      </div>

      {messages.map((message, ri) => {
        const c = campaignBySegment[message.segment];
        const kakao = isKakaoCh(c["캠페인 채널"]);
        return (
          <div
            key={message.segment}
            style={{
              display: "grid", gridTemplateColumns: CG,
              padding: "24px 0", alignItems: "stretch",
              borderTop: ri === 0 ? "none" : `1px solid ${T.gray100}`,
              overflow: "hidden",
            }}
          >
            {/* 1열 — 순위 칩 + 세그먼트. 상위 3순위는 칸 전체에 옅은 초록 */}
            <span style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              justifyContent: "center",
              margin: "-24px 0", padding: "24px 20px", background: RANK_ROW_BG(message.rank),
            }}>
              <span style={{
                padding: "3px 10px", borderRadius: 999,
                background: RANK_STYLE(message.rank).bg,
                color: RANK_STYLE(message.rank).fg,
                border: `1px solid ${RANK_STYLE(message.rank).bd}`,
                fontSize: 12, fontWeight: 600, lineHeight: "18px", whiteSpace: "nowrap",
              }}>
                {t.rank(message.rank)}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, lineHeight: "23px", color: "#171719", textAlign: "center" }}>
                {message.segment}
              </span>
            </span>

            {/* 2열 — 혜택을 칩으로 꺼내야 "무슨 캠페인인지"가 문장을 안 읽고도 잡힘 */}
            <span style={{ ...DIV(1), display: "flex", flexDirection: "column", gap: 8, minWidth: 0, padding: "0 20px", justifyContent: "center" }}>
              <span style={{ fontSize: 17, fontWeight: 700, lineHeight: "25px", color: "#171719" }}>
                {c["캠페인명"]}
              </span>
              {c["혜택"]?.length > 0 && (
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {c["혜택"].map((b) => (
                    <span key={b} style={{
                      padding: "3px 9px", borderRadius: 6,
                      background: "#EFF6FF", color: "#1447E6",
                      fontSize: 12, fontWeight: 600, lineHeight: "18px", whiteSpace: "nowrap",
                    }}>
                      {b}
                    </span>
                  ))}
                </span>
              )}
              <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: "#62646A" }}>
                {c["캠페인 내용"]}
              </span>
            </span>

            {/* 3열 — 전환 수는 모수와 함께 있어야 4.8%가 뭘 나눈 값인지 읽힘 */}
            <span style={{ ...DIV(2), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 20px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 15, fontWeight: 700, lineHeight: "23px", color: T.green500,
              }}>
                <TriangleUpGlyph color={T.green500} />
                {c["예상 전환 고객"]}({c["예상 전환율"]})
              </span>
              <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: "#62646A" }}>
                {c["발송 가능 인원"]} {t.outOf}
              </span>
            </span>

            {/* 4열 — 실제로 나가는 원문. 비용은 채널에 딸린 값이라 헤더 우측에 */}
            <span style={{ ...DIV(3), display: "block", minWidth: 0, padding: "0 20px" }}>
              <div style={{ border: `1px solid ${T.gray200}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  padding: "10px 14px",
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, lineHeight: "21px", color: "#3B3D42" }}>
                    <ChatGlyph size={16} />
                    {t.message} ({c["캠페인 채널"]})
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#9EA1A7" }}>
                      {t.cost} : {c["발송 비용"]}
                    </span>
                    <Btn variant="solid-secondary" size="sm" onClick={() => copyText(message.template, onToast, t)}>
                      <CopyGlyph size={13} />
                      {t.copy}
                    </Btn>
                  </span>
                </div>
                {kakao && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", background: "#FEE500",
                    fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#3C1E1E",
                  }}>
                    <KakaoGlyph size={13} />
                    {meta?.input?.brand}
                  </div>
                )}
                <div style={{
                  margin: "0 14px 14px", padding: "14px 16px",
                  background: T.gray50, borderRadius: 10,
                  fontSize: 14, fontWeight: 400, lineHeight: "23px", color: "#171719",
                  whiteSpace: "pre-line",
                }}>
                  {renderTemplate(message.template, message.sampleVars)}
                  {message.buttons?.length > 0 && (
                    <span style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                      {message.buttons.map((b) => (
                        <span key={b} style={{
                          flex: "1 1 auto", padding: "7px 10px", borderRadius: 8, background: "#FFFFFF",
                          border: `1px solid ${T.gray200}`, textAlign: "center",
                          fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#3C1E1E",
                        }}>
                          {b}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </span>
          </div>
        );
      })}
    </ContentCard>
  );
}

/* ── 리프트 결과 — 메시지를 받지 않은 대조군 전환율(비포) 대비
     수신군 전환율(애프터)을 나란히. 두 막대 사이 간격이 곧 리프트.
     전환율 하나만 있으면 "원래 올 사람"과 구분이 안 돼 성과가 과대해 보임 ── */
function LiftBeforeAfter({ campaigns, t }) {
  const n = (s) => parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
  const rows = campaigns.map((c) => {
    const after = n(c["예상 전환율"]);
    const lift = n(c["리프트"]);
    return {
      세그먼트: c.segment,
      [t.without]: Number((after - lift).toFixed(1)),
      [t.with_]: after,
      sendable: n(c["발송 가능 인원"]),
      converted: n(c["예상 전환 고객"]),
      gain: Math.round((n(c["발송 가능 인원"]) * lift) / 100),
    };
  });
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  const sendable = sum("sendable");
  const gain = sum("gain");
  const after = (sum("converted") / sendable) * 100;
  const before = ((sum("converted") - gain) / sendable) * 100;

  return (
    <ContentCard padding={28}>
      {/* 합산 수치는 위 예상 리프트 카드가 담당 — 여기선 세그먼트별 근거만 */}
      <GroupedBarChart
        title={t.chartTitle}
        // "예상치"와 "과거 발송 이력" 두 단어는 남겨야 확정 성과로 안 읽힘
        subtitle={t.chartSub}
        data={rows}
        indexBy="세그먼트"
        keys={[t.without, t.with_]}
        colors={[T.gray400, T.blue500]}
        valueSuffix="%"
        groupTooltip
      />
    </ContentCard>
  );
}

/* ── 세그먼트 구성 — 도넛 + 범례를 겸하는 판정 기준 목록 (색 dot 으로 차트와 연결) ── */
function SegmentBar({ segments, t }) {
  // 판정 기준은 아래 표의 '정의' 열이 담당 — 여기서 반복하면 같은 글을 두 번 읽게 됨
  const segs = segments.data.donut.segments;
  const total = segs.reduce((a, x) => a + x.count, 0);
  const row = { label: "" };
  segs.forEach((x) => { row[`${x.label} ${x.percentage}% (${x.count.toLocaleString()}명)`] = x.count; });

  return (
    <ContentCard padding={40}>
      <StackedHBar
        title={t.segTotal(total.toLocaleString())}
        data={[row]}
        keys={Object.keys(row).filter((k) => k !== "label")}
        colors={segs.map((x) => x.color)}
      />
    </ContentCard>
  );
}


export default function CrmCampaignReport() {
  const [lang, setLang] = useState("ko");
  const t = UI[lang];
  const data = lang === "en" ? reportEn : reportKo;
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };
  if (!data) {
    return (
      <PageWrapper>
        <div style={{ padding: 40, fontFamily: "Pretendard, sans-serif", color: "#7B7E85" }}>{t.loading}</div>
      </PageWrapper>
    );
  }

  const { meta, sections } = data;
  const findSection = (id) => sections.find((s) => s.id === id);

  const exec = findSection("executive-summary");
  const segments = findSection("customer-segments");
  const definition = findSection("segment-definition");
  const campaigns = findSection("recommended-campaigns");
  const messages = findSection("campaign-messages");
  const priority = findSection("execution-priority");

  // 캠페인(설계·성과) ↔ 메시지(원문)를 세그먼트명으로 조인
  const campaignBySegment = Object.fromEntries(
    campaigns.data.table.campaigns.map((c) => [c.segment, c])
  );

  // 표의 고객군 앞에 도넛과 같은 색 dot — 차트↔표 매칭
  const segColor = Object.fromEntries(
    segments.data.donut.segments.map((s) => [s.label, s.color])
  );
  const cnt = (s) => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
  // 합계 — 주기는 '산정 불가' 세그먼트를 뺀 가중평균이라 표 값에서 그대로 도출됨
  const segTotals = segments.data.table.rows.reduce(
    (a, r) => {
      a.total += cnt(r.total);
      a.sendable += cnt(r.sendable);
      const c = parseInt(r.cycle, 10);
      if (!Number.isNaN(c)) { a.cycleSum += c * cnt(r.total); a.cycleCnt += cnt(r.total); }
      return a;
    },
    { total: 0, sendable: 0, cycleSum: 0, cycleCnt: 0 }
  );

  const segmentRows = segments.data.table.rows.map((r) => ({
    ...r,
    // 값이 없는 칸은 숫자와 같은 무게로 보이면 안 됨
    cycle: /^(산정 불가|N\/A|-)$/.test(r.cycle)
      ? <span style={{ color: T.gray400 }}>-</span>
      : r.cycle,
    segment: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: segColor[r.segment] ?? GRAY, flexShrink: 0,
        }} />
        {r.segment}
      </span>
    ),
  }));
  segmentRows.push({
    segment: <span style={{ fontWeight: 700 }}>{t.total}</span>,
    total: `${segTotals.total.toLocaleString()}${t.unit}`,
    sendable: `${segTotals.sendable.toLocaleString()}${t.unit}`,
    cycle: lang === "en" ? `${Math.round(segTotals.cycleSum / segTotals.cycleCnt)} days` : `${Math.round(segTotals.cycleSum / segTotals.cycleCnt)}일`,
  });

  return (
    <PageWrapper>
      <ContentHeader
        title={
          <span
            onClick={() => { window.location.hash = "#/crm-input"; }}
            title={t.toInput}
            style={{ cursor: "pointer" }}
          >
            {meta.reportTitle}
          </span>
        }
        description={meta.reportSubtitle}
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text={meta.sourceFile}
              leadingIcon={<DatabaseIcon size={14} color="#7B7E85" />}
            />
            <Badge type="Outline" variant="Secondary" size="Large" text={`${t.version} ${meta.version}`} />
          </>
        }
        actions={
          <>
            <LangSwitch lang={lang} onChange={setLang} />
            <Btn variant="solid-secondary" size="md">
              <DownloadIcon size={20} />
              {t.pdf}
            </Btn>
            <Btn
              variant="solid-primary"
              size="md"
              onClick={() =>
                downloadSendList(
                  messages.data.items,
                  campaignBySegment,
                  `${t.fileName}_${meta.createdAt.slice(0, 10)}.csv`
                )
              }
            >
              <DownloadIcon size={20} />
              {t.download}
            </Btn>
          </>
        }
        style={{ marginBottom: 60 }}
      />

      <ReportPage>

        {/* Section 1 — Executive Summary */}
        <div>
          <SectionHeading overline={exec.sectionName} title={exec.headline} />
          {meta.input && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch", marginBottom: 8 }}>
              {/* 브랜드가 뭘 파는 곳인지가 문구의 전제 — 홈페이지·목적 카드는 폼에서 빠져 함께 제거 */}
              <InputCard
                icon={<BuildingGlyph />}
                label={t.inputBrand}
                value={`${meta.input.industry} · ${meta.input.brand}`}
              />
              <InputCard icon={<TagGlyph />} label={t.inputAbout} value={meta.input.about ?? "-"} />
            </div>
          )}
          <ExecutiveSummaryCard
            title={null}
            findings={{
              groups: exec.data.keyFindingGroups?.map((g) => ({
                ...g,
                icon: FINDING_ICONS[g.icon],
              })),
            }}
          />
        </div>

        {/* Section 2 — 고객 세그먼트: Donut(구성비) + DataTable + 판정 기준 각주
             실 발송 대상 규모는 아래 표에 이미 있어 별도 차트로 중복 표현하지 않음 */}
        <div>
          <SectionHeading overline={segments.sectionName} title={segments.headline} />
          <SectionCard>
            {/* 구성비는 단일 스택 바 — 5개 조각을 도넛으로 나누면 작은 세그먼트가 안 읽힘 */}
            <SegmentBar segments={segments} t={t} />
            <ContentCard padding={0}>
              <DataTable
                columns={segments.data.table.columns.map((c) => ({
                  ...c,
                  // 산정 조건이 붙는 열은 헤더에 도움말 아이콘으로
                  label: c.hint ? <HeaderHint label={c.label} hint={c.hint} /> : c.label,
                  // 고객군·정의는 글이라 좌측, 나머지 숫자는 가운데
                  align: c.key === "segment" || c.key === "criteria" ? "left" : "center",
                }))}
                data={segmentRows}
              />
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 3 — 추천 캠페인: 우선순위 순으로 정렬된 세그먼트별 블록(순위·설계·성과·메시지) */}
        <div>
          <SectionHeading overline={campaigns.sectionName} title={campaigns.headline} />
          <SectionCard>
            {/* 세그먼트별 캠페인 = 설계·성과·발송 메시지를 한 행에 (블록 나열하면 열이 안 맞음) */}
            <CampaignTable
              messages={messages.data.items}
              campaignBySegment={campaignBySegment}
              onToast={showToast}
              meta={meta}
              t={t}
            />
          </SectionCard>
        </div>

        {/* Section 4 — 예상 성과: 5개 캠페인을 모두 실행했을 때의 총정리 (합계 지표 + 캠페인별 합산표 + 발송 리스트) */}
        <div>
          <SectionHeading overline={priority.sectionName} title={priority.headline} />
          {/* 다른 섹션과 같이 회색 박스로 묶음 */}
          <SectionCard>
            {/* 전환을 주인공으로 — 세 카드가 같은 무게면 뭘 봐야 할지 안 잡힘 */}
            <ContentCard padding={28}>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {priority.data.totals.map((m, i) => (
                  <div
                    key={m.label}
                    style={{
                      flex: i === 0 ? "1 1 260px" : "1 1 200px",
                      minWidth: 0,
                      display: "flex", flexDirection: "column", gap: 4,
                      paddingLeft: i === 0 ? 0 : 32,
                      borderLeft: i === 0 ? "none" : "1px solid #F0F0F2",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, lineHeight: "20px", color: "#7B7E85" }}>
                      {m.label}
                    </span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: i === 0 ? 34 : 24,
                      fontWeight: 700,
                      lineHeight: i === 0 ? "44px" : "34px",
                      color: i === 0 ? "#2B7FFF" : "#171719",
                    }}>
                      {/* ▲ 는 변화량에만 — 총 전환(732명)은 상태값이라 붙이면 "732명 늘었다"로 읽힘 */}
                      {/(리프트|늘어나는)/.test(m.label) && <TriangleUpGlyph size={i === 0 ? 14 : 11} />}
                      {m.value}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "21px", color: "#3B3D42" }}>
                      {m.sub}
                    </span>
                    {m.detail && (
                      <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#9EA1A7" }}>
                        {m.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ContentCard>
            {/* 전환율만 있으면 "원래 올 사람"과 구분이 안 됨 — 대조군을 같이 세워야 리프트가 읽힘 */}
            <LiftBeforeAfter campaigns={campaigns.data.table.campaigns} t={t} />
          </SectionCard>
        </div>

      </ReportPage>
      <Toast message={toast} />
    </PageWrapper>
  );
}
