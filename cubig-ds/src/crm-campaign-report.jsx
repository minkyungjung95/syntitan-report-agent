import { useEffect, useState } from "react";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
  ExecutiveSummaryCard,
  DataTable,
  InfoCard,
  InfoCardRow,
} from "./report-components";
import { DonutChart, KPITrendCard, FlowTable } from "./charts";
import { DownloadIcon, DatabaseIcon, PersonIcon, ArrowUpIcon, CheckCircleIcon, FlagIcon } from "./tokens.jsx";
import { Btn, Badge } from "./ui-components.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  CrmCampaignReport — CRM Agent (세그먼트 자동 생성 · 캠페인 추천 · 메시지 품질)
 *
 *  데이터 소스: public/json/crm-campaign.json (fetch)
 *
 *  차트 사용 (rule 11 — 동일 타입 3회 이상 반복 금지):
 *    DonutChart 1 · KPITrendCard 1 · FlowTable 1
 *    DataTable 1 (세그먼트 구성)
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
async function copyText(text, notify) {
  try {
    await navigator.clipboard.writeText(text);
    notify?.("메시지를 복사했습니다");
  } catch (e) {
    console.error("클립보드 복사 실패", e);
    notify?.("복사에 실패했습니다");
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
function CampaignBlock({ message, campaign, color, onToast }) {

  return (
    <ContentCard padding={24} style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* 우선순위는 블록 자체에 — 별도 순위 섹션을 두면 같은 숫자를 두 번 보게 됨 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            padding: "2px 8px", borderRadius: 6, background: "#F0F0F2", color: "#62646A",
            fontSize: 12, fontWeight: 600, lineHeight: "18px", flexShrink: 0,
          }}>
            {message.rank}순위
          </span>
          {/* 세그먼트 색은 도넛과 동일 — 배지 variant 색을 쓰면 차트와 따로 놀아 매칭이 안 됨 */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "2px 8px", borderRadius: 6, background: "#F7F7F8",
            fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#171719",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color ?? GRAY, flexShrink: 0 }} />
            {message.segment}
          </span>
        </div>
        {/* 라벨 없이 문구만 두면 이게 캠페인 이름인지 안 읽힘 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* 한 줄 제목 먼저 — 긴 설명만 있으면 무슨 캠페인인지 훑어서 안 잡힘 */}
          <span style={{ fontSize: 15, fontWeight: 600, lineHeight: "23px", color: "#171719" }}>
            {campaign["캠페인명"]}
          </span>
          <span style={{ fontSize: 15, fontWeight: 400, lineHeight: "24px", color: "#3B3D42" }}>
            {campaign["캠페인 내용"]}
          </span>
          {/* 채널·비용은 성과가 아니라 발송 조건 — 캠페인 아래 메타 한 줄로 */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#7B7E85" }}>
            {channelIcon(campaign["캠페인 채널"])}
            {CHANNEL_LABEL[campaign["캠페인 채널"]] ?? campaign["캠페인 채널"]}
          </span>
        </div>
      </div>
      <div style={{
        flex: "1 1 320px", minWidth: 280,
        paddingLeft: 24, borderLeft: "1px solid #F0F0F2",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {/* 복사 버튼은 실제 발송 원문 우측 상단 — 무엇을 복사하는지 바로 보이는 위치 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#7B7E85" }}>발송 메시지</span>
          <Btn variant="solid-secondary" size="sm" onClick={() => copyText(message.template, onToast)}>
            <CopyGlyph size={14} />
            복사
          </Btn>
        </div>
        {/* 텍스트만 흘리면 "실제로 나가는 문자"로 안 읽힘 — 수신 말풍선 형태로 */}
        <div style={{
          background: "#F7F7F8",
          border: "1px solid #F0F0F2",
          borderRadius: "4px 14px 14px 14px",
          padding: "16px 18px",
          fontSize: 15, fontWeight: 400, lineHeight: "25px", color: "#171719",
          whiteSpace: "pre-line",
        }}>
          {renderTemplate(message.template, message.sampleVars)}
        </div>
      </div>
    </ContentCard>
  );
}

/* ── 세그먼트 구성 — 도넛 + 범례를 겸하는 판정 기준 목록 (색 dot 으로 차트와 연결) ── */
function SegmentDonut({ segments, definition }) {
  const criteriaOf = (name) =>
    definition.data.groups.find((g) => g.title === name)?.criteria || "";

  return (
    <ContentCard padding={40}>
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap",
        alignItems: "center", justifyContent: "center", paddingLeft: 20,
      }}>
        {/* 도넛 컬럼은 내용만큼만 — 넓게 늘리면 범례와 사이가 벌어짐 */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <DonutChart
            title={segments.data.donut.title}
            size={220}
            hideLegend
            data={segments.data.donut.segments.map((s) => ({
              id: s.label,
              value: s.percentage,
              color: s.color,
            }))}
          />
        </div>
        <div style={{ flex: "0 1 420px", minWidth: 300, display: "flex", flexDirection: "column", gap: 12 }}>
          {segments.data.donut.segments.map((s) => (
            <div key={s.label} style={{ display: "flex", gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: s.color,
                flexShrink: 0, marginTop: 6,
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 14, lineHeight: "21px" }}>
                  <span style={{ fontWeight: 600, color: "#171719" }}>{s.label}</span>
                  <span style={{ color: "#62646A" }}>
                    {s.percentage}% · {s.count.toLocaleString()}명
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 400, lineHeight: "18px", color: "#9EA1A7" }}>
                  {criteriaOf(s.label)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentCard>
  );
}

export default function CrmCampaignReport() {
  const [data, setData] = useState(null);
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };
  useEffect(() => {
    fetch("/json/crm-campaign.json", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error("Failed to load crm-campaign.json", e));
  }, []);

  if (!data) {
    return (
      <PageWrapper>
        <div style={{ padding: 40, fontFamily: "Pretendard, sans-serif", color: "#7B7E85" }}>Loading...</div>
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
    segment: <span style={{ fontWeight: 700 }}>합계</span>,
    total: `${segTotals.total.toLocaleString()}명`,
    sendable: `${segTotals.sendable.toLocaleString()}명`,
    cycle: `${Math.round(segTotals.cycleSum / segTotals.cycleCnt)}일 (방문 2회 이상 ${segTotals.cycleCnt.toLocaleString()}명)`,
  });

  // 과거 회차가 3개(이번 제외 2회) 이하면 추이로 볼 만한 게 없음
  const trends = (priority.data.trends ?? []).filter((tr) => (tr.data?.length ?? 0) >= 4);

  // 순위별 묶음 — 발송 가능 → 전환율 → 예상 전환 흐름을 한 행에
  const num = (s) => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
  const flowGroups = [...new Set(messages.data.items.map((m) => m.rank))].sort().map((rank) => ({
    label: `${rank}순위`,
    rows: messages.data.items
      .filter((m) => m.rank === rank)
      // 같은 순위 안에서는 전환율 높은 순 — 병목이 그룹 맨 아래로 내려감
      .sort(
        (a, b) =>
          parseFloat(campaignBySegment[b.segment]["예상 전환율"]) -
          parseFloat(campaignBySegment[a.segment]["예상 전환율"])
      )
      .map((m) => {
        const c = campaignBySegment[m.segment];
        return {
          label: m.segment,
          description: c["리프트"] ? `리프트 ${c["리프트"]}` : "리프트 산출 불가",
          left: num(c["발송 가능 인원"]).toLocaleString(),
          rate: parseFloat(c["예상 전환율"]),
          right: num(c["예상 전환 고객"]).toLocaleString(),
        };
      }),
  }));
  return (
    <PageWrapper>
      <ContentHeader
        title={
          <span
            onClick={() => { window.location.hash = "#/crm-input"; }}
            title="입력 화면으로 이동"
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
            <Badge type="Outline" variant="Secondary" size="Large" text={`버전 ${meta.version}`} />
          </>
        }
        actions={
          <>
            <Btn variant="solid-secondary" size="md">
              <DownloadIcon size={20} />
              PDF 다운로드
            </Btn>
            <Btn
              variant="solid-primary"
              size="md"
              onClick={() =>
                downloadSendList(
                  messages.data.items,
                  campaignBySegment,
                  `crm-발송리스트_${meta.createdAt.slice(0, 10)}.csv`
                )
              }
            >
              <DownloadIcon size={20} />
              발송 리스트 다운로드
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
              <InputCard icon={<BuildingGlyph />} label="업종" value={meta.input.industry} />
              <InputCard icon={<TagGlyph />} label="브랜드명" value={meta.input.brand} />
              <InputCard icon={<FlagIcon size={18} color="#7B7E85" />} label="캠페인 목적" value={meta.input.goals.join(" · ")} />
              <InputCard icon={<SmsGlyph size={18} />} label="사용 채널" value={meta.input.channels.join(" · ")} />
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
            {/* 판정 기준은 도넛 범례에 함께 — 색으로 차트와 바로 연결되고 별도 각주가 필요 없음 */}
            <SegmentDonut segments={segments} definition={definition} />
            <ContentCard padding={0}>
              <DataTable
                columns={segments.data.table.columns.map((c, i) => ({
                  ...c,
                  align: i === 0 ? "left" : "center",
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
            {/* 세그먼트별 캠페인 = 설계·성과·발송 메시지를 한 블록에 (표/메시지 분리하면 매칭이 안 읽힘) */}
            {messages.data.items.map((item) => (
              <CampaignBlock
                key={item.segment}
                message={item}
                campaign={campaignBySegment[item.segment]}
                color={segColor[item.segment]}
                onToast={showToast}
              />
            ))}
          </SectionCard>
        </div>

        {/* Section 4 — 예상 성과: 5개 캠페인을 모두 실행했을 때의 총정리 (합계 지표 + 캠페인별 합산표 + 발송 리스트) */}
        <div>
          <SectionHeading overline={priority.sectionName} title={priority.headline} />
          {/* 다른 섹션과 같이 회색 박스로 묶음 */}
          <SectionCard>
            {/* 비용 카드와 전환 추이를 2단으로 — 세로로 쌓으면 추이 카드 좌측이 비어 보임 */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "stretch" }}>
              <ContentCard padding={24} style={{ flex: "1 1 260px", minWidth: 0 }}>
                <InfoCardRow>
                  {priority.data.totals.map((m, i) => (
                    <InfoCard key={i} variant="solid" label={m.label} value={m.value} description={m.description} />
                  ))}
                </InfoCardRow>
              </ContentCard>

              <div style={{ flex: "2 1 460px", minWidth: 0, display: "flex" }}>
                {trends.length > 0 ? (
                  trends.map((tr, i) => (
                    <KPITrendCard
                      key={i}
                      title={tr.title}
                      subtitle={tr.subtitle}
                      value={tr.value}
                      delta={tr.delta}
                      variant={tr.variant}
                      suffix={tr.suffix}
                      data={tr.data}
                      style={{ border: "none", borderRadius: 16, flex: 1 }}
                    />
                  ))
                ) : (
                  <ContentCard padding={20} style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 400, lineHeight: "20px", color: "#7B7E85" }}>
                      과거 발송 회차가 3회 미만이라 전환율 추이는 계산하지 않았습니다. 이번 발송분이 쌓이면 다음 리포트부터 비교됩니다.
                    </span>
                  </ContentCard>
                )}
              </div>
            </div>

            {/* 발송 가능 → 전환율 → 예상 전환. 모수와 결과가 한 행에 있어 비율만 보는 막대보다 정확 */}
            <ContentCard padding={0} style={{ padding: "28px 24px" }}>
              <FlowTable groups={flowGroups} columns={{ left: "발송 가능", right: "예상 전환" }} rateSuffix="%" />
            </ContentCard>
          </SectionCard>
        </div>

      </ReportPage>
      <Toast message={toast} />
    </PageWrapper>
  );
}
