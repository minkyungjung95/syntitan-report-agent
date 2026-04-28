import { Fragment, useMemo, useState } from "react";
import LNB from "./lnb.jsx";

/* =========================================================
 *  B2B Audit Log (Owner / Admin only)
 *  - 인증 · 데이터셋 · 전처리 · 릴리즈 · Agent · Report · 권한
 *  - 기간 / 사용자 / 카테고리 필터 + CSV 내보내기
 *  - 전처리 완료 이벤트는 행 클릭 시 상세 패널 확장
 * ========================================================= */

const CATEGORIES = [
  { key: "auth", label: "인증" },
  { key: "dataset", label: "데이터셋" },
  { key: "preprocess", label: "전처리" },
  { key: "release", label: "릴리즈" },
  { key: "agent", label: "Agent" },
  { key: "report", label: "Report" },
  { key: "permission", label: "권한" },
];

const RESULT_BADGE = {
  성공: { bg: "#ECFDF3", fg: "#027A48", bd: "#ABEFC6" },
  실패: { bg: "#FEF3F2", fg: "#B42318", bd: "#FECDCA" },
};

/* ---------- 샘플 데이터 ---------- */
const SEED_LOGS = [
  {
    id: 1,
    ts: "2026-04-06 14:23:05",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "auth",
    event: "로그인 성공",
    target: "—",
    detail: "웹에서 로그인",
    result: "성공",
    ip: "211.234.56.78",
  },
  {
    id: 2,
    ts: "2026-04-06 14:25:12",
    user: { name: "—", email: "minsu@company.com" },
    category: "auth",
    event: "로그인 실패",
    target: "—",
    detail: "비밀번호 불일치",
    result: "실패",
    ip: "211.234.56.78",
  },
  {
    id: 3,
    ts: "2026-04-06 18:00:33",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "auth",
    event: "로그아웃",
    target: "—",
    detail: "—",
    result: "성공",
    ip: "211.234.56.78",
  },
  {
    id: 4,
    ts: "2026-04-06 10:15:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "dataset",
    event: "업로드",
    target: "고객_이탈_2024Q4",
    detail: "파일 크기: 24.3MB · 행: 50,000 · 컬럼: 32 → 스냅샷 생성 · v1 릴리즈",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 5,
    ts: "2026-04-06 10:32:17",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "dataset",
    event: "조회",
    target: "고객_이탈_2024Q4",
    detail: "—",
    result: "성공",
    ip: "211.234.56.78",
  },
  {
    id: 6,
    ts: "2026-04-06 11:05:44",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "dataset",
    event: "이름 변경",
    target: "고객_이탈_2024Q4",
    detail: "고객_이탈_raw → 고객_이탈_2024Q4",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 7,
    ts: "2026-04-06 16:45:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "dataset",
    event: "삭제",
    target: "테스트_데이터_v2",
    detail: "—",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 8,
    ts: "2026-04-06 11:20:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "실행 시작",
    target: "고객_이탈_2024Q4",
    detail: "Missing Value Treatment",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 9,
    ts: "2026-04-06 11:23:47",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Missing Value Treatment · 스냅샷: a3f8c2d",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Missing Value Treatment",
      snapshot: "a3f8c2da3f8c2da3f8c2da3f8c2da3f8c2d",
      rows: [
        { label: "결측값 보정", value: "총 410개 보정 — 성별 230개, 나이 180개" },
        { label: "신호 컬럼 추가", value: "2개 컬럼 추가 — 성별_결측여부, 나이_결측여부" },
      ],
    },
  },
  {
    id: 10,
    ts: "2026-04-06 14:10:22",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "preprocess",
    event: "실패",
    target: "매출_2024",
    detail: "모듈: Outlier, Distribution & Category Refinement · 컬럼 '과금액' 데이터 타입 불일치",
    result: "실패",
    ip: "211.234.56.78",
  },
  {
    id: 101,
    ts: "2026-04-07 09:32:10",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Outlier, Distribution & Category Refinement · 스냅샷: b7e19a4",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Outlier, Distribution & Category Refinement",
      snapshot: "b7e19a4b7e19a4b7e19a4b7e19a4b7e19a4b",
      rows: [
        { label: "이상값 처리", value: "총 210개 처리 — 과금액 200개, 나이 10개" },
        { label: "범주 통합", value: "거주지 — 152개 → 100개" },
        { label: "스케일 조정", value: "2개 컬럼 조정 — 나이, 과금액" },
      ],
    },
  },
  {
    id: 102,
    ts: "2026-04-07 10:15:42",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Low-Signal Column Removal · 스냅샷: c2d4f81",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Low-Signal Column Removal",
      snapshot: "c2d4f81c2d4f81c2d4f81c2d4f81c2d4f81c",
      rows: [
        { label: "컬럼 제거", value: "2개 컬럼 제거 — 아이디_생성일, 과금액_구간" },
      ],
    },
  },
  {
    id: 103,
    ts: "2026-04-07 11:02:55",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Row Augmentation & Class Balancing · 스냅샷: d5a9b33",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Row Augmentation & Class Balancing",
      snapshot: "d5a9b33d5a9b33d5a9b33d5a9b33d5a9b33d",
      rows: [
        { label: "행 증강", value: "9,999개 → 12,500개" },
        { label: "컬럼 증강", value: "2개 추가 — 가입 경과 일수, 나이_구간" },
      ],
    },
  },
  {
    id: 104,
    ts: "2026-04-07 11:45:20",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Context Enrichment · 스냅샷: e81c0f2",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Context Enrichment",
      snapshot: "e81c0f2e81c0f2e81c0f2e81c0f2e81c0f2e",
      rows: [
        { label: "라벨 부여", value: "7개 컬럼에 라벨 부여" },
      ],
    },
  },
  {
    id: 105,
    ts: "2026-04-07 13:22:08",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Sensitive Data Detection & Masking · 스냅샷: f93e5c1",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Sensitive Data Detection & Masking",
      snapshot: "f93e5c1f93e5c1f93e5c1f93e5c1f93e5c1f",
      rows: [
        { label: "민감정보 처리", value: "2개 타입 마스킹 처리 — Full Name, Phone Number" },
      ],
    },
  },
  {
    id: 11,
    ts: "2026-04-06 15:00:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "release",
    event: "릴리즈 생성",
    target: "고객_이탈_2024Q4",
    detail: 'v2 · "Q4 최종본"',
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 12,
    ts: "2026-04-06 15:30:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "agent",
    event: "실행 시작",
    target: "고객_이탈_2024Q4 (v2)",
    detail: "이탈 예측 분석",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 13,
    ts: "2026-04-06 15:45:22",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "agent",
    event: "실행 완료",
    target: "고객_이탈_2024Q4 (v2)",
    detail: "신제품 가격 전략",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 14,
    ts: "2026-04-06 15:30:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "report",
    event: "리포트 조회",
    target: "[Churn Prediction] ecommerce",
    detail: "—",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 15,
    ts: "2026-04-06 15:45:22",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "report",
    event: "리포트 다운로드",
    target: "[Churn Prediction] ecommerce",
    detail: "—",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 16,
    ts: "2026-04-06 09:00:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "사용자 초대",
    target: "newuser@company.com",
    detail: "Member 역할로 초대",
    result: "성공",
    ip: "10.0.1.10",
  },
  {
    id: 17,
    ts: "2026-04-06 09:15:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "역할 변경",
    target: "박지영",
    detail: "Member → Admin",
    result: "성공",
    ip: "10.0.1.10",
  },
  {
    id: 18,
    ts: "2026-04-06 09:20:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "데이터셋 권한 변경",
    target: "고객_이탈_2024Q4",
    detail: "김민수에게 편집 권한 부여",
    result: "성공",
    ip: "10.0.1.10",
  },
  {
    id: 19,
    ts: "2026-04-06 17:00:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "사용자 제거",
    target: "formeruser@company.com",
    detail: "조직에서 제거",
    result: "성공",
    ip: "10.0.1.10",
  },
];

const PAGE_SIZE = 50;

/* ---------- util ---------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label ?? key;

function toCSV(rows) {
  const head = ["일시", "사용자", "이메일", "카테고리", "이벤트 유형", "대상 리소스", "내용", "결과", "IP"];
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const body = rows.map((r) =>
    [r.ts, r.user.name, r.user.email, catLabel(r.category), r.event, r.target, r.detail, r.result, r.ip]
      .map(esc)
      .join(",")
  );
  return [head.map(esc).join(","), ...body].join("\n");
}

/* ========================================================= */
export default function AuditLog() {
  const [from, setFrom] = useState(daysAgoISO(30));
  const [to, setTo] = useState(todayISO());
  const [userFilter, setUserFilter] = useState([]); // [] = 전체
  const [categoryFilter, setCategoryFilter] = useState(CATEGORIES.map((c) => c.key));
  const [page, setPage] = useState(1);
  const [modalRow, setModalRow] = useState(null);  // 전처리 완료 상세 모달
  const [popover, setPopover] = useState(null);    // "category" | "user" | "period" | null
  const [calOpen, setCalOpen] = useState(null);    // "from" | "to" | null (기간 팝오버 내부)
  const [userSearch, setUserSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueUsers = useMemo(() => {
    const map = new Map();
    SEED_LOGS.forEach((l) => {
      if (!map.has(l.user.email)) map.set(l.user.email, l.user);
    });
    return [...map.values()];
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SEED_LOGS.filter((l) => {
      const d = l.ts.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (userFilter.length && !userFilter.includes(l.user.email)) return false;
      if (!categoryFilter.includes(l.category)) return false;
      if (q) {
        const hay = [
          l.user.name, l.user.email, l.event, l.target, l.detail, l.ip,
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [from, to, userFilter, categoryFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setFrom(daysAgoISO(30));
    setTo(todayISO());
    setUserFilter([]);
    setCategoryFilter(CATEGORIES.map((c) => c.key));
    setPage(1);
  };

  const exportCSV = () => {
    const blob = new Blob(["\uFEFF" + toCSV(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCategory = (key) => {
    setPage(1);
    setCategoryFilter((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleUser = (email) => {
    setPage(1);
    setUserFilter((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  return (
    <>
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
      <LNB active="report" />
      <div style={S.pageOuter}>
        <div style={S.page}>
      {/* ---------- Header ---------- */}
      <div style={S.header}>
        <div>
          <div style={S.h1}>감사 로그</div>
          <div style={S.sub}>조직 내 모든 활동을 시간순으로 추적합니다. 보관 기간: 최근 365일 (기본 조회: 최근 30일)</div>
        </div>
        <button style={S.btnPrimary} onClick={exportCSV}>
          <IconDownload /> CSV 내보내기
        </button>
      </div>

      {/* ---------- Toolbar (개별 필터 드롭다운 + 검색) ---------- */}
      <div style={S.toolbar}>
        {/* 카테고리 */}
        <div style={{ position: "relative" }}>
          <button
            style={{ ...S.toolBtn, ...(popover === "category" ? S.toolBtnActive : {}) }}
            onClick={() => setPopover(popover === "category" ? null : "category")}
          >
            <IconFilter /> 카테고리
            {categoryFilter.length < CATEGORIES.length && (
              <span style={S.countBadge}>{categoryFilter.length}</span>
            )}
          </button>
          {popover === "category" && (
            <div style={S.popover}>
              <label style={{ ...S.checkRow, borderBottom: "1px solid #F2F4F7", marginBottom: 4, paddingBottom: 10 }}>
                <input
                  type="checkbox"
                  checked={categoryFilter.length === CATEGORIES.length}
                  onChange={(e) =>
                    setCategoryFilter(e.target.checked ? CATEGORIES.map((c) => c.key) : [])
                  }
                />
                <span style={{ fontSize: 13, color: "#101828", fontWeight: 500 }}>전체선택</span>
              </label>
              {CATEGORIES.map((c) => (
                <label key={c.key} style={S.checkRow}>
                  <input
                    type="checkbox"
                    checked={categoryFilter.includes(c.key)}
                    onChange={() => {
                      setPage(1);
                      setCategoryFilter((prev) =>
                        prev.includes(c.key) ? prev.filter((k) => k !== c.key) : [...prev, c.key]
                      );
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#101828" }}>{c.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 사용자 */}
        <div style={{ position: "relative" }}>
          <button
            style={{ ...S.toolBtn, ...(popover === "user" ? S.toolBtnActive : {}) }}
            onClick={() => setPopover(popover === "user" ? null : "user")}
          >
            <IconUser /> 사용자
            {userFilter.length > 0 && <span style={S.countBadge}>{userFilter.length}</span>}
          </button>
          {popover === "user" && (
            <div style={{ ...S.popover, width: 300 }}>
              <div style={S.popoverSearch}>
                <IconSearch />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="사용자 검색"
                  style={S.popoverSearchInput}
                />
              </div>
              <label style={{ ...S.checkRow, borderBottom: "1px solid #F2F4F7", marginBottom: 4, paddingBottom: 10 }}>
                <input
                  type="checkbox"
                  checked={userFilter.length === 0}
                  onChange={(e) => setUserFilter(e.target.checked ? [] : [])}
                />
                <span style={{ fontSize: 13, color: "#101828", fontWeight: 500 }}>전체선택</span>
              </label>
              <div style={{ maxHeight: 260, overflowY: "auto" }}>
                {uniqueUsers
                  .filter((u) => {
                    const q = userSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (u.name || "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                  })
                  .map((u) => (
                    <label key={u.email} style={S.checkRow}>
                      <input
                        type="checkbox"
                        checked={userFilter.includes(u.email)}
                        onChange={() => {
                          setPage(1);
                          setUserFilter((prev) =>
                            prev.includes(u.email)
                              ? prev.filter((e) => e !== u.email)
                              : [...prev, u.email]
                          );
                        }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={S.avatar}>
                          {(u.name || u.email || "?").trim().charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: "#101828", fontWeight: 500 }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: "#667085" }}>{u.email}</div>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 기간 */}
        <div style={{ position: "relative" }}>
          <button
            style={{ ...S.toolBtn, ...(popover === "period" ? S.toolBtnActive : {}) }}
            onClick={() => setPopover(popover === "period" ? null : "period")}
          >
            <IconCalendar /> 기간
          </button>
          {popover === "period" && (
            <div style={{ ...S.popover, width: 380, padding: 16 }}>
              {/* 프리셋 칩 */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {[
                  { label: "오늘", days: 0 },
                  { label: "7일", days: 7 },
                  { label: "30일", days: 30 },
                  { label: "90일", days: 90 },
                  { label: "1년", days: 365 },
                ].map((p) => {
                  const isActive = from === daysAgoISO(p.days) && to === todayISO();
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setFrom(daysAgoISO(p.days));
                        setTo(todayISO());
                        setPage(1);
                      }}
                      style={{ ...S.chip, ...(isActive ? S.chipActive : {}) }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              {/* 커스텀 range */}
              <div style={{ fontSize: 12, color: "#344054", fontWeight: 500, marginBottom: 6 }}>
                직접 지정
              </div>
              <div style={S.dateRow}>
                <DateField
                  value={from}
                  open={calOpen === "from"}
                  onOpen={() => setCalOpen(calOpen === "from" ? null : "from")}
                  onChange={(v) => {
                    setFrom(v);
                    setPage(1);
                    setCalOpen(null);
                  }}
                />
                <span style={{ color: "#667085" }}>—</span>
                <DateField
                  value={to}
                  open={calOpen === "to"}
                  onOpen={() => setCalOpen(calOpen === "to" ? null : "to")}
                  onChange={(v) => {
                    setTo(v);
                    setPage(1);
                    setCalOpen(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 검색 */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}><IconSearch /></span>
          <input
            type="text"
            placeholder="사용자, 이벤트, 리소스, 내용 검색"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={S.searchInput}
          />
          {searchQuery && (
            <button style={S.searchClear} onClick={() => setSearchQuery("")} aria-label="검색 지우기">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel 제거 — 모달로 이동 */}

      {/* ---------- Table ---------- */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <colgroup>
            <col style={{ width: 160 }} />
            <col style={{ width: 180 }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 200 }} />
            <col />
            <col style={{ width: 80 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 28 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={S.th}>일시</th>
              <th style={S.th}>사용자</th>
              <th style={S.th}>카테고리</th>
              <th style={S.th}>이벤트 유형</th>
              <th style={S.th}>대상 리소스</th>
              <th style={S.th}>내용</th>
              <th style={S.th}>결과</th>
              <th style={S.th}>IP</th>
              <th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} style={S.empty}>
                  조건에 해당하는 로그가 없습니다.
                </td>
              </tr>
            )}
            {pageRows.map((r) => {
              const hasDetail = r.category === "preprocess" && r.event === "완료" && r.meta;
              return (
                <Fragment key={r.id}>
                  <tr
                    style={{
                      ...S.tr,
                      cursor: hasDetail ? "pointer" : "default",
                    }}
                    onClick={() => hasDetail && setModalRow(r)}
                  >
                    <td style={S.td}>{r.ts}</td>
                    <td style={S.td}>
                      <div style={{ fontSize: 13, color: "#101828" }}>{r.user.name}</div>
                      <div style={{ fontSize: 12, color: "#667085" }}>{r.user.email}</div>
                    </td>
                    <td style={S.td}>{catLabel(r.category)}</td>
                    <td style={S.td}>{r.event}</td>
                    <td style={S.td}>
                      <span style={S.resource}>{r.target}</span>
                    </td>
                    <td style={{ ...S.td, color: r.result === "실패" ? "#B42318" : "#475467", fontWeight: r.result === "실패" ? 500 : 400 }}>{r.detail}</td>
                    <td style={S.td}>
                      <ResultBadge value={r.result} />
                    </td>
                    <td style={{ ...S.td, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
                      {r.ip}
                    </td>
                    <td style={S.td}>
                      {hasDetail && (
                        <span style={{ display: "inline-block", color: "#98A2B3" }}>▸</span>
                      )}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---------- Pagination ---------- */}
      <div style={S.pager}>
        <div style={{ color: "#667085", fontSize: 13 }}>
          총 <b style={{ color: "#101828" }}>{filtered.length.toLocaleString()}</b>건 · 페이지 {page} / {totalPages}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={S.pagerBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>
            이전
          </button>
          <button style={S.pagerBtn} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            다음
          </button>
        </div>
      </div>
        </div>
      </div>
    </div>

    {/* 전처리 완료 상세 모달 */}
    {modalRow && (
      <DetailModal row={modalRow} onClose={() => setModalRow(null)} />
    )}

    {/* 외부 클릭 닫기 오버레이 */}
    {popover && (
      <div
        onClick={() => setPopover(null)}
        style={{ position: "fixed", inset: 0, zIndex: 5 }}
      />
    )}
    </>
  );
}

/* ========================================================= */
function ResultBadge({ value }) {
  const t = RESULT_BADGE[value] ?? RESULT_BADGE["성공"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {value}
    </span>
  );
}

function DetailPanel({ meta }) {
  return (
    <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 10, columnGap: 16 }}>
      <div style={S.detailKey}>모듈</div>
      <div style={S.detailVal}>{meta.module}</div>

      <div style={S.detailKey}>스냅샷 해시</div>
      <div style={{ ...S.detailVal, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, wordBreak: "break-all" }}>
        {meta.snapshot}
      </div>

      {meta.rows.map((r, i) => (
        <Fragment key={i}>
          <div style={S.detailKey}>{r.label}</div>
          <div style={S.detailVal}>{r.value}</div>
        </Fragment>
      ))}
    </div>
  );
}

/* =========================================================
 *  DetailModal (전처리 완료 상세)
 * ========================================================= */
function DetailModal({ row, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,15,16,0.4)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 32px rgba(15,15,16,0.16)",
          fontFamily: "Pretendard, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#667085", marginBottom: 4 }}>
              {row.ts} · {row.user.name}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#101828" }}>
              전처리 완료 — {row.target}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", padding: 0, color: "#667085", flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div style={{ height: 1, background: "#EAECF0" }} />

        {/* Body */}
        <div style={{ padding: "16px 24px 24px", display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 12, columnGap: 16 }}>
          <div style={S.detailKey}>모듈</div>
          <div style={{ ...S.detailVal, fontWeight: 600 }}>{row.meta.module}</div>

          <div style={S.detailKey}>스냅샷 해시</div>
          <div style={{ ...S.detailVal, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, wordBreak: "break-all", color: "#475467" }}>
            {row.meta.snapshot}
          </div>

          {row.meta.rows.map((r, i) => (
            <Fragment key={i}>
              <div style={S.detailKey}>{r.label}</div>
              <div style={S.detailVal}>{r.value}</div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  DateField + Calendar (Figma 스타일)
 * ========================================================= */
/* =========================================================
 *  FilterModal — 기간 / 사용자 / 카테고리 (draft state)
 * ========================================================= */
function FilterModal({ from, to, userFilter, categoryFilter, uniqueUsers, onClose, onApply }) {
  const [dFrom, setDFrom] = useState(from);
  const [dTo, setDTo] = useState(to);
  const [dUser, setDUser] = useState(userFilter);
  const [dCategory, setDCategory] = useState(categoryFilter);
  const [cal, setCal] = useState(null);
  const [userOpen, setUserOpen] = useState(false);

  const toggleUser = (email) =>
    setDUser((p) => (p.includes(email) ? p.filter((e) => e !== email) : [...p, email]));
  const toggleCat = (key) =>
    setDCategory((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const resetAll = () => {
    setDFrom(daysAgoISO(30));
    setDTo(todayISO());
    setDUser([]);
    setDCategory(CATEGORIES.map((c) => c.key));
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,15,16,0.4)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, maxHeight: "88vh",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 12px 40px rgba(15,15,16,0.18)",
          display: "flex", flexDirection: "column",
          fontFamily: "Pretendard, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EAECF0" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#101828" }}>필터</div>
          <button
            onClick={onClose}
            aria-label="닫기"
            style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", padding: 0, color: "#667085" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body (스크롤) */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 기간 */}
          <div>
            <div style={S.filterSectionLabel}>기간</div>
            <div style={S.dateRow}>
              <DateField value={dFrom} open={cal === "from"} onOpen={() => setCal(cal === "from" ? null : "from")} onChange={(v) => { setDFrom(v); setCal(null); }} />
              <span style={{ color: "#667085" }}>—</span>
              <DateField value={dTo} open={cal === "to"} onOpen={() => setCal(cal === "to" ? null : "to")} onChange={(v) => { setDTo(v); setCal(null); }} />
            </div>
          </div>

          {/* 사용자 */}
          <div>
            <div style={S.filterSectionLabel}>사용자</div>
            <div style={{ position: "relative" }}>
              <button style={{ ...S.select, width: "100%" }} onClick={() => setUserOpen((o) => !o)}>
                <span>
                  {dUser.length === 0
                    ? "전체 사용자"
                    : dUser.length === 1
                    ? uniqueUsers.find((u) => u.email === dUser[0])?.name ?? dUser[0]
                    : `${dUser.length}명 선택`}
                </span>
                <IconChevron />
              </button>
              {userOpen && (
                <div style={{ ...S.dropdown, width: "100%" }}>
                  <div style={S.dropdownHeader}>
                    <button style={S.linkBtn} onClick={() => setDUser([])}>전체 해제</button>
                  </div>
                  {uniqueUsers.map((u) => (
                    <label key={u.email} style={S.checkRow}>
                      <input type="checkbox" checked={dUser.includes(u.email)} onChange={() => toggleUser(u.email)} />
                      <span style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "#101828" }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: "#667085" }}>{u.email}</div>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <div style={S.filterSectionLabel}>카테고리</div>
            <div style={S.chipRow}>
              {CATEGORIES.map((c) => {
                const active = dCategory.includes(c.key);
                return (
                  <button key={c.key} onClick={() => toggleCat(c.key)} style={{ ...S.chip, ...(active ? S.chipActive : {}) }}>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #EAECF0", gap: 8 }}>
          <button onClick={resetAll} style={S.linkBtnFooter}>전체 해제</button>
          <button
            onClick={() => onApply({ from: dFrom, to: dTo, userFilter: dUser, categoryFilter: dCategory })}
            style={S.btnPrimary}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}

function DateField({ value, open, onOpen, onChange }) {
  return (
    <div style={{ position: "relative" }}>
      <button onClick={onOpen} style={S.dateInput}>
        {value || "날짜 선택"}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 50,
            background: "#FFFFFF",
            border: "1px solid #EAECF0",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
            padding: 20,
            minWidth: 320,
          }}
        >
          <Calendar value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

function Calendar({ value, onChange }) {
  const today = new Date();
  const initial = value ? new Date(value + "T00:00:00") : today;
  const [viewY, setViewY] = useState(initial.getFullYear());
  const [viewM, setViewM] = useState(initial.getMonth()); // 0-11

  const firstDay = new Date(viewY, viewM, 1);
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const firstWeekday = firstDay.getDay(); // 0=Sun
  const daysInPrev = new Date(viewY, viewM, 0).getDate();

  const cells = [];
  // prev month fills
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({ d, inMonth: false, y: viewM === 0 ? viewY - 1 : viewY, m: viewM === 0 ? 11 : viewM - 1 });
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, inMonth: true, y: viewY, m: viewM });
  while (cells.length < 42) {
    const d = cells.length - (firstWeekday + daysInMonth) + 1;
    cells.push({ d, inMonth: false, y: viewM === 11 ? viewY + 1 : viewY, m: viewM === 11 ? 0 : viewM + 1 });
  }

  const selected = value ? value : null;
  const fmt = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const prevMonth = () => {
    if (viewM === 0) { setViewY(viewY - 1); setViewM(11); } else setViewM(viewM - 1);
  };
  const nextMonth = () => {
    if (viewM === 11) { setViewY(viewY + 1); setViewM(0); } else setViewM(viewM + 1);
  };

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div style={{ fontFamily: "Pretendard, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#101828" }}>
          {viewY}년 {viewM + 1}월
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={prevMonth} style={S.calNav} aria-label="이전 달">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={nextMonth} style={S.calNav} aria-label="다음 달">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {weekdays.map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: 13, color: "#98A2B3", padding: "6px 0" }}>
            {w}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 }}>
        {cells.map((c, i) => {
          const dateStr = fmt(c.y, c.m, c.d);
          const isSelected = selected === dateStr;
          return (
            <button
              key={i}
              onClick={() => onChange(dateStr)}
              style={{
                height: 36,
                border: "none",
                background: isSelected ? "#101828" : "transparent",
                color: isSelected ? "#FFFFFF" : c.inMonth ? "#101828" : "#D0D5DD",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isSelected ? 600 : 400,
                fontFamily: "Pretendard, -apple-system, sans-serif",
                cursor: "pointer",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#F7F7F8"; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
            >
              {c.d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- icons ---------- */
function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="21" y2="21"/>
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <line x1="8" y1="3" x2="8" y2="7"/>
      <line x1="16" y1="3" x2="16" y2="7"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

/* ---------- styles ---------- */
const S = {
  pageOuter: {
    flex: 1,
    minWidth: 0,
    padding: "28px 32px",
    background: "#FFFFFF",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Pretendard, Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#101828",
  },
  page: {
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: "#667085" },

  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    background: "#101828",
    color: "#fff",
    border: "1px solid #101828",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "8px 14px",
    background: "#fff",
    color: "#344054",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    alignSelf: "flex-end",
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 10,
  },
  toolBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    background: "#fff",
    color: "#344054",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Pretendard, -apple-system, sans-serif",
    height: 36,
    position: "relative",
  },
  toolBtnActive: {
    background: "#F9FAFB",
    borderColor: "#101828",
    color: "#101828",
  },
  filterDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#101828",
    marginLeft: 2,
  },
  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18,
    height: 18,
    padding: "0 5px",
    background: "#101828",
    color: "#FFFFFF",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 2,
  },
  popover: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    zIndex: 20,
    minWidth: 220,
    background: "#FFFFFF",
    border: "1px solid #EAECF0",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
    padding: 8,
  },
  popoverSearch: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 8px",
    border: "1px solid #EAECF0",
    borderRadius: 8,
    marginBottom: 8,
    color: "#667085",
  },
  popoverSearchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
    color: "#101828",
    fontFamily: "Pretendard, -apple-system, sans-serif",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#F2F4F7",
    color: "#475467",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  searchWrap: {
    position: "relative",
    flex: 1,
    minWidth: 220,
    maxWidth: 360,
    marginLeft: "auto",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#667085",
    display: "inline-flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    height: 36,
    padding: "0 32px 0 36px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    fontSize: 13,
    color: "#101828",
    background: "#fff",
    fontFamily: "Pretendard, -apple-system, sans-serif",
    outline: "none",
  },
  searchClear: {
    position: "absolute",
    right: 4,
    top: "50%",
    transform: "translateY(-50%)",
    width: 24, height: 24,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#98A2B3",
    fontSize: 18,
    lineHeight: 1,
    borderRadius: 4,
  },

  filterPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 16,
    border: "1px solid #EAECF0",
    borderRadius: 10,
    background: "#FFFFFF",
    marginBottom: 16,
  },
  filterRow: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  filterRowLabel: { fontSize: 12, fontWeight: 500, color: "#344054", width: 72, flexShrink: 0 },
  filterLabel: { fontSize: 12, fontWeight: 500, color: "#344054" },
  filterSectionLabel: { fontSize: 15, fontWeight: 700, color: "#101828", marginBottom: 12 },
  linkBtnFooter: {
    background: "transparent",
    border: "none",
    color: "#101828",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 4px",
    textDecoration: "underline",
    textUnderlineOffset: 2,
    fontFamily: "Pretendard, -apple-system, sans-serif",
  },
  dateRow: { display: "flex", alignItems: "center", gap: 6 },
  dateInput: {
    padding: "7px 12px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    fontSize: 13,
    color: "#101828",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "Pretendard, -apple-system, sans-serif",
    minWidth: 130,
    textAlign: "left",
  },
  calNav: {
    width: 28,
    height: 28,
    border: "none",
    background: "transparent",
    borderRadius: 6,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475467",
  },

  select: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minWidth: 180,
    padding: "7px 12px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    background: "#fff",
    fontSize: 13,
    color: "#101828",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    width: 260,
    background: "#fff",
    border: "1px solid #EAECF0",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
    zIndex: 20,
    padding: 6,
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "4px 8px",
    borderBottom: "1px solid #F2F4F7",
    marginBottom: 4,
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#475467",
    fontSize: 12,
    cursor: "pointer",
    padding: 0,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },

  chipRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    padding: "6px 12px",
    border: "1px solid #101828",
    borderRadius: 999,
    background: "#fff",
    color: "#101828",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  chipActive: {
    background: "#101828",
    color: "#fff",
    borderColor: "#101828",
  },

  tableWrap: {
    border: "1px solid #EAECF0",
    borderRadius: 10,
    overflowX: "auto",
    background: "#fff",
  },
  table: { width: "100%", minWidth: 1100, borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" },
  th: {
    padding: "10px 12px",
    textAlign: "left",
    background: "#F9FAFB",
    borderBottom: "1px solid #EAECF0",
    fontSize: 12,
    fontWeight: 500,
    color: "#475467",
  },
  tr: { borderBottom: "1px solid #F2F4F7" },
  td: {
    padding: "12px",
    verticalAlign: "top",
    color: "#101828",
    wordBreak: "break-word",
  },
  resource: {
    padding: "2px 8px",
    background: "#F2F4F7",
    borderRadius: 6,
    fontSize: 12,
    color: "#344054",
  },
  empty: {
    padding: "48px 16px",
    textAlign: "center",
    color: "#98A2B3",
    fontSize: 13,
  },

  detailKey: { fontSize: 12, color: "#667085" },
  detailVal: { fontSize: 13, color: "#101828" },

  pager: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  pagerBtn: {
    padding: "6px 12px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    background: "#fff",
    color: "#344054",
    fontSize: 13,
    cursor: "pointer",
  },
};
