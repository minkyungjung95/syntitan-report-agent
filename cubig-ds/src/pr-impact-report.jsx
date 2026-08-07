import { useEffect, useState } from "react";
import {
  PageWrapper, ReportPage, SectionHeading, SectionCard, ContentCard, ContentHeader,
} from "./report-components";
import { Btn, Badge } from "./ui-components.jsx";
import { CHART_COLORS, DonutChart } from "./charts";
import { DownloadIcon, DatabaseIcon, CheckCircleIcon, T } from "./tokens.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
 *  PrImpactReport — 보도자료 영향 시뮬레이션 리포트
 *
 *  데이터 소스: public/json/pr-impact.json
 *  섹션 componentType:
 *    ExecutiveSummary / KeyFindings / DataTable(6지표·페르소나) /
 *    UserCard(페르소나 반응) / KeyFindings(보도자료 원문) / InsightCard(수정 제안)
 * ═══════════════════════════════════════════════════════════════════════════ */

// "▲ +0.5 (54.5 → 55.0)" → { head:"▲ +0.5", range:"54.5 → 55.0", dir:"up|down|flat" }
function parseDelta(value) {
  const s = String(value || "").trim();
  const rm = s.match(/\(([^)]*)\)/);
  const range = rm ? rm[1].trim() : "";
  const head = s.replace(/\([^)]*\)/, "").trim();
  const first = head.charAt(0);
  const dir = first === "▲" ? "up" : first === "▼" ? "down" : "flat";
  return { head, range, dir };
}

const dirColor = (dir) => dir === "up" ? T.green500 : dir === "down" ? T.red500 : T.gray400;

// 대상(행) × 지표(열) 2줄 매트릭스 — 셀: { top, topColor, bottom, bottomColor }
function Matrix({ indicators, rows }) {
  const th = {
    padding: "12px 16px", fontSize: 14, fontWeight: 400, color: T.gray800,
    whiteSpace: "nowrap", borderBottom: `1px solid ${T.gray200}`,
  };
  return (
    <div style={{ width: "100%", overflowX: "auto", fontFamily: "Pretendard, sans-serif" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: T.gray25 }}>
            <th style={{ ...th, textAlign: "left", borderTopLeftRadius: 16 }}>대상</th>
            {indicators.map((ind, i) => (
              <th key={i} style={{ ...th, textAlign: "center", borderTopRightRadius: i === indicators.length - 1 ? 16 : 0 }}>{ind}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const last = ri === rows.length - 1;
            return (
              <tr key={ri}>
                <td style={{ padding: "16px", fontSize: 14, fontWeight: 600, color: T.gray990, whiteSpace: "nowrap", borderBottom: last ? "none" : `1px solid ${T.gray100}` }}>{row.label}</td>
                {row.cells.map((c, ci) => (
                  <td key={ci} style={{ padding: "14px 16px", textAlign: "center", borderBottom: last ? "none" : `1px solid ${T.gray100}`, borderLeft: `1px solid ${T.gray100}` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.topColor, lineHeight: "20px" }}>{c.top}</div>
                    {c.bottom && <div style={{ fontSize: 12, fontWeight: 400, color: c.bottomColor, lineHeight: "16px", marginTop: 2, whiteSpace: "nowrap" }}>{c.bottom}</div>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// "\n\n" 로 나뉜 텍스트를 문단 배열로
function paragraphs(text) {
  return String(text || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

// 「...」 안의 첫 인용구 추출
function extractQuote(text) {
  const m = String(text || "").match(/「([^」]*)」/);
  return m ? m[1] : null;
}

// 수정 제안 항목을 "원문(수정 대상) → 수정 제안 + 진단 + 예상 효과" 로 분해
function parseRevision(it) {
  const desc = String(it.description || "");
  const interp = String(it.interpretation || "");

  // 원문(수정 대상) 문구 + 진단 (인용구를 뺀 나머지)
  const origQuote = extractQuote(desc);
  let diagnosis = desc;
  if (origQuote) {
    diagnosis = desc
      .replace(/^.*?「[^」]*」/, "")           // 앞부분 + 원문 인용구 제거
      .replace(/^[\s,]*[은는이가을를도만로]?\s*/, "") // 앞 조사 정리
      .trim();
    if (diagnosis) diagnosis = "이 표현은 " + diagnosis;
  }

  // 수정 제안 문구 + 방법(howto) + 예상 효과
  const revQuote = extractQuote(interp);
  let impact = null;
  let head = interp;
  const im = interp.match(/예상\s*효과\s*[:：]\s*([\s\S]*)$/);
  if (im) { impact = im[1].trim(); head = interp.slice(0, im.index); }
  let howto = null;
  if (revQuote) {
    howto = head
      .replace(/^[\s\S]*?「[^」]*」/, "")       // 수정 인용구까지 제거
      .replace(/[.\s]*$/, "")                  // 끝 마침표 정리
      .replace(/^[처럼를을로과와,\s]+/, "")     // 앞 조사 정리
      .trim() || null;
  }

  return { origQuote, diagnosis, revQuote, howto, impact };
}

// 번호 (원문 하이라이트 ↔ 수정 제안 카드 연결용)
const NUM = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];


// 진단 태그 톤 — 카테고리별 색: 정확·신뢰(red) / 전달·품질(amber) / 읽힘·오해(gray)
const TAG_TONE = {
  red: { fg: "#C10007", under: "#EF9A9A", chipBg: "#FEECEC", chipFg: "#C10007" },
  amber: { fg: "#B45309", under: "#F3C969", chipBg: "#FEF3C7", chipFg: "#B45309" },
  gray: { fg: T.gray700, under: T.gray400, chipBg: T.gray100, chipFg: T.gray700 },
};

// 배지 카테고리 → 톤 (정확·신뢰 / 읽힘·오해 / 전달·품질)
function tagTone(badge) {
  const s = String(badge || "");
  if (/신뢰|정확|책임|구체/.test(s)) return "red";
  if (/형평|갈등|오독|오해|읽/.test(s)) return "gray";
  return "amber";
}

// 진단 태그 칩
function TagChip({ label, tone = "amber" }) {
  const c = TAG_TONE[tone] || TAG_TONE.amber;
  return (
    <span style={{
      flexShrink: 0, background: c.chipBg, color: c.chipFg,
      fontSize: 12, fontWeight: 600, lineHeight: "18px",
      padding: "3px 10px", borderRadius: 7, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// 복사 아이콘
function CopyIcon({ size = 15, color = "#7B7E85" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
function PinIcon({ size = 16, color = "#7B7E85" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6-5.686-6-10a6 6 0 0 1 12 0c0 4.314-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></svg>);
}
function BuildingIcon({ size = 16, color = "#7B7E85" }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /></svg>);
}

// 지역/기관 요약 카드
function InfoCard({ icon, label, value }) {
  return (
    <div style={{ flex: "1 1 240px", minWidth: 220, border: `1px solid ${T.gray200}`, borderRadius: 12, padding: "16px 18px", background: T.white, display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 400, color: T.gray700 }}>{icon}<span>{label}</span></div>
      <div style={{ fontSize: 16, fontWeight: 600, color: T.gray990, lineHeight: "22px" }}>{value}</div>
    </div>
  );
}

// 페르소나 주요 지표 변화 (▲▼ + 값)
function MetricDelta({ indicator, value }) {
  const up = value > 0, flat = value === 0;
  const color = up ? T.green600 : flat ? T.gray400 : T.red500;
  const arrow = up ? "▲" : flat ? "–" : "▼";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, lineHeight: "20px" }}>
      <span style={{ color: T.gray800, flex: 1, minWidth: 0 }}>{indicator}</span>
      <span style={{ color, fontWeight: 700, flexShrink: 0 }}>{arrow} {flat ? "±0" : `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`}</span>
    </div>
  );
}

// 인라인 번호 마크 — 유형색 밑줄 + (n), hover 시 툴팁(유형·근거 또는 기대효과)
function HighlightMark({ n, tone = "amber", tip, children }) {
  const [open, setOpen] = useState(false);
  const c = TAG_TONE[tone] || TAG_TONE.amber;
  return (
    <span
      style={{ position: "relative", cursor: tip ? "help" : "default", color: c.fg, borderBottom: `1.5px solid ${c.chipFg}`, fontWeight: 500, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}
      onMouseEnter={() => tip && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <sup style={{ fontSize: 10, fontWeight: 700, color: c.fg, marginLeft: 1 }}>({n})</sup>
      {open && tip && (
        <span style={{ position: "absolute", left: 0, top: "calc(100% + 8px)", zIndex: 50, width: 300, maxWidth: "72vw", background: T.gray990, color: T.white, fontSize: 12.5, fontWeight: 400, lineHeight: "18px", padding: "11px 13px", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", whiteSpace: "normal", textAlign: "left" }}>{tip}</span>
      )}
    </span>
  );
}

// 텍스트에서 marks(quote) 위치를 찾아 HighlightMark 로 감싼 노드 배열
function renderWithMarks(text, marks) {
  let rest = String(text || "");
  const nodes = [];
  let key = 0;
  const active = (marks || []).filter((m) => m.quote);
  while (rest.length) {
    let best = null;
    for (const m of active) {
      const idx = rest.indexOf(m.quote);
      if (idx !== -1 && (best === null || idx < best.idx)) best = { idx, m };
    }
    if (!best) { nodes.push(rest); break; }
    if (best.idx > 0) nodes.push(rest.slice(0, best.idx));
    nodes.push(<HighlightMark key={key++} n={best.m.n} tone={best.m.tone} tip={best.m.tip}>{best.m.quote}</HighlightMark>);
    rest = rest.slice(best.idx + best.m.quote.length);
  }
  return nodes;
}

const AP_BTN = "#3F8F00";   // 수정 요약 체크 색

// ── 페르소나 통계 (도넛) ─────────────────────────────────────────────────

// "상생협력 +0.12, 윤리경영 −0.30" → [{ indicator, value }]
function parseContribs(str) {
  return String(str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^(.+?)\s*([+\-−]?\s*\d*\.?\d+)\s*$/);
      if (!m) return null;
      return { indicator: m[1].trim(), value: parseFloat(m[2].replace(/\s/g, "").replace("−", "-")) };
    })
    .filter(Boolean);
}

// 비중 도넛 + 인구 속성 범례
function ShareDonut({ personas }) {
  const data = personas.map((p) => ({ id: p.name, value: p.share, color: p.color }));
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
      <div style={{ flexShrink: 0 }}>
        <DonutChart data={data} size={200} hideLegend />
      </div>
      <div style={{ flex: "0 1 340px", minWidth: 260, display: "flex", flexDirection: "column", gap: 12 }}>
        {personas.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.gray990, lineHeight: "20px" }}>{p.name}</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: T.gray700, lineHeight: "16px" }}>{p.demo}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.gray990, flexShrink: 0 }}>{p.share}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrImpactReport() {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyText = (text) => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else done();
  };
  useEffect(() => {
    fetch("/json/pr-impact.json", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error("Failed to load pr-impact.json", e));
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
  const keyFindings = findSection("key-findings");
  const indicator = findSection("indicator-change");
  const personaStats = findSection("persona-stats");
  const reactions = findSection("persona-reactions");
  const pressRelease = findSection("press-release-original");
  const revisions = findSection("revision-suggestions");

  // ── 6지표 변화 — 대상(행) × 지표(열) 전치 ──
  const indicatorLabels = indicator.data.rows.map((r) => r.metric);
  // 평가 요약 표: 위=예측 후 점수, 아래=변화량(색)
  const execRows = indicator.data.columns.map((col, ci) => ({
    label: col.label,
    cells: indicator.data.rows.map((r) => {
      const d = parseDelta(r.values[ci]);
      const after = (d.range.split("→")[1] || "").trim();
      return { top: after || "–", topColor: T.gray990, bottom: d.dir === "flat" ? "–" : d.head, bottomColor: dirColor(d.dir) };
    }),
  }));

  // ── 페르소나 통계 (그래프용 파싱: 비중 + 인구 속성 + 지표 기여) ──
  const personas = personaStats.data.rows.map((r, i) => ({
    name: r.metric,
    share: parseFloat(String(r.values[0]).replace(/[^\d.]/g, "")) || 0,
    demo: r.values[1],
    contribs: parseContribs(r.values[2]),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // 수정 제안 항목을 원문에 등장하는 순서대로 정렬 → 번호(①②)가 원문 읽는 순서와 일치
  const pressText = pressRelease.data.text || "";
  const orderedRevisions = revisions.data.items
    .map((it) => {
      const quote = extractQuote(it.description);
      const pos = quote ? pressText.indexOf(quote) : -1;
      return { it, quote, pos: pos === -1 ? Infinity : pos };
    })
    .sort((a, b) => a.pos - b.pos);

  // 수정 제안 파싱 데이터 (원문 등장 순서 = 번호 순서)
  const revData = orderedRevisions.map((o, i) => {
    const r = parseRevision(o.it);
    return {
      n: NUM[i], badge: o.it.badge, title: o.it.title, tone: tagTone(o.it.badge),
      origQuote: o.quote, revQuote: r.revQuote,
      diagnosis: r.diagnosis, impact: r.impact,
      isAdd: /추가/.test(o.it.interpretation || ""),
    };
  });

  // 원문 열 마크(유형·근거 툴팁) / 수정 제안 열 마크(기대효과 툴팁) + 수정 반영 전문
  const origMarks = revData.map((d) => ({
    quote: d.origQuote, n: d.n, tone: d.tone,
    tip: (
      <span>
        <span style={{ display: "inline-block", marginBottom: 7 }}><TagChip label={d.badge} tone={d.tone} /></span>
        <span style={{ display: "block", color: T.white }}>{d.diagnosis}</span>
      </span>
    ),
  }));
  let appliedText = pressText;
  revData.forEach((d) => { if (d.origQuote && d.revQuote) appliedText = appliedText.replace(d.origQuote, d.revQuote); });
  const revMarks = revData.map((d) => ({
    quote: d.revQuote, n: d.n, tone: d.tone,
    tip: (
      <span>
        <span style={{ display: "block", fontWeight: 600, color: T.white, marginBottom: 3 }}>기대효과</span>
        <span style={{ display: "block", color: "#DBEAFE" }}>{d.impact}</span>
      </span>
    ),
  }));

  // 페르소나 반응 표 — 통계 페르소나(유형·비중·지표 기여) + 반응 인용(순서 매칭)
  const personaRows = personas.map((p, i) => ({ ...p, quote: (reactions.data.items[i] || {}).description || "" }));

  return (
    <PageWrapper>
      <ContentHeader
        title={meta.agentName}
        description={meta.surveyInput.note}
        badges={
          <>
            <Badge
              type="Outline"
              variant="Secondary"
              size="Large"
              text="pr-impact.json"
              leadingIcon={<DatabaseIcon size={14} color="#7B7E85" />}
            />
            <Badge type="Outline" variant="Secondary" size="Large" text="Version 1.0" />
            <Badge type="Solid" variant="Cautionary" size="Large" text="시뮬레이션 예측" />
          </>
        }
        actions={
          <>
            <Btn variant="solid-secondary" size="md">
              <DownloadIcon size={20} />
              PDF 다운로드
            </Btn>
            <Btn variant="solid-primary" size="md">토론방 만들기</Btn>
          </>
        }
        style={{ marginBottom: 60 }}
      />

      <ReportPage>

        {/* Section 1: 평가 요약 — 헤드라인 + 지역/기관 카드 + 핵심 발견 */}
        <div>
          <SectionHeading overline="평가 요약" title={exec.headline} />
          <SectionCard>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <InfoCard icon={<PinIcon />} label="지역" value={meta.surveyInput.region} />
              <InfoCard icon={<BuildingIcon />} label="기관명" value={meta.surveyInput.institution} />
            </div>
            <ContentCard padding={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <CheckCircleIcon size={20} color={T.gray990} />
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: T.gray990 }}>핵심 발견</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                {paragraphs(keyFindings.data.text).map((p, i) => (
                  <li key={i} style={{ fontSize: 15, fontWeight: 400, lineHeight: "24px", color: T.gray800 }}>{p}</li>
                ))}
              </ul>
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 2: 6지표 변화 */}
        <div>
          <SectionHeading overline="6지표 변화" title={indicator.headline} />
          <SectionCard>
            <ContentCard padding={24}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.gray990 }}>6지표 예측 요약</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: T.gray800 }}>각 셀 · 예측 후 점수 / 변화량 (▲ 증가 · ▼ 감소 · – 변화 없음)</div>
              </div>
              <Matrix indicators={indicatorLabels} rows={execRows} />
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 3: 페르소나 반응 — 페르소나 통계(도넛) + 반응·지표 표 */}
        <div>
          <SectionHeading overline="페르소나 반응" title={reactions.headline} />
          <SectionCard>
            <ContentCard padding={32}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.gray990, marginBottom: 16 }}>페르소나 통계</div>
              <ShareDonut personas={personas} />
            </ContentCard>
            <ContentCard padding={0}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16, padding: "12px 20px", borderBottom: `1px solid ${T.gray200}`, background: T.gray25, fontSize: 13, fontWeight: 500, color: T.gray800, borderRadius: "16px 16px 0 0" }}>
                <span>유형 및 페르소나 실제 반응</span><span>주요 지표 변화</span>
              </div>
              {personaRows.map((p, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16, padding: "16px 20px", borderBottom: i < personaRows.length - 1 ? `1px solid ${T.gray100}` : "none", alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 26, height: 26, borderRadius: "50%", background: p.color + "26", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.gray990, lineHeight: "18px" }}>{p.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 400, color: T.gray700, lineHeight: "16px" }}>{p.demo}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 400, lineHeight: "21px", color: T.gray800 }}>{p.quote}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.contribs.map((c, ci) => <MetricDelta key={ci} indicator={c.indicator} value={c.value} />)}
                  </div>
                </div>
              ))}
            </ContentCard>
          </SectionCard>
        </div>

        {/* Section 4: 보도자료 수정 제안 — 원문 | 수정 제안 2열 (번호 마크 + hover) */}
        <div>
          <SectionHeading overline="보도자료 수정 제안" title={revisions.headline} description="번호 표시에 마우스를 올리면 유형·근거(원문)와 기대효과(수정 제안)가 나옵니다." />
          <SectionCard>
            <div style={{ display: "flex", alignItems: "stretch", gap: 12, flexWrap: "wrap" }}>
              {/* 원문 */}
              <div style={{ flex: "1 1 380px", minWidth: 320, background: T.white, border: `1px solid ${T.gray200}`, borderRadius: 16, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "13px 20px", borderBottom: `1px solid ${T.gray100}`, background: T.gray25, borderRadius: "16px 16px 0 0", fontSize: 15, fontWeight: 600, color: T.gray990 }}>원문</div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  {paragraphs(pressText).map((p, i, arr) => (
                    <div key={i} style={{ fontSize: i === 0 ? 15 : 14, fontWeight: i === 0 ? 700 : 400, lineHeight: i === 0 ? "26px" : "2", color: i === 0 ? T.gray990 : T.gray800 }}>
                      {i === 0 ? p : renderWithMarks(p, origMarks)}
                    </div>
                  ))}
                </div>
              </div>

              {/* 수정 제안 */}
              <div style={{ flex: "1 1 380px", minWidth: 320, background: T.white, border: `1px solid ${T.gray200}`, borderRadius: 16, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "11px 16px 11px 20px", borderBottom: `1px solid ${T.gray100}`, background: T.gray25, borderRadius: "16px 16px 0 0" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.gray990 }}>수정 제안</span>
                  <button onClick={() => copyText(appliedText)} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${copied ? T.green500 : T.gray200}`, background: T.white, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: "Pretendard, sans-serif", fontSize: 13, fontWeight: 500, color: copied ? T.green600 : T.gray800 }}>
                    <CopyIcon size={15} color={copied ? "#00A63E" : "#7B7E85"} />{copied ? "복사됨" : "전문 복사"}
                  </button>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  {paragraphs(appliedText).map((p, i) => (
                    <div key={i} style={{ fontSize: i === 0 ? 15 : 14, fontWeight: i === 0 ? 700 : 400, lineHeight: i === 0 ? "26px" : "2", color: i === 0 ? T.gray990 : T.gray800 }}>
                      {i === 0 ? p : renderWithMarks(p, revMarks)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Section 5: 수정 요약 */}
        <div>
          <SectionCard>
            <ContentCard padding={24}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CheckCircleIcon size={20} color={AP_BTN} />
                <span style={{ fontSize: 16, fontWeight: 600, color: T.gray990 }}>수정 요약</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 400, lineHeight: "24px", color: T.gray800 }}>
                이 보도자료에서 {revData.length}건의 개선 지점을 발견했습니다. {revisions.headline}
              </p>
            </ContentCard>
          </SectionCard>
        </div>

      </ReportPage>
    </PageWrapper>
  );
}
