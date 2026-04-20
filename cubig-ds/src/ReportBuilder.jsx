import { useState, useRef, useEffect } from "react";
import { T } from "./tokens.jsx";
import { Btn } from "./ui-components.jsx";
import { ReportRenderer } from "./reportRenderer.jsx";
import sampleReport from "./data/customer-support.json";

const F = "Pretendard, sans-serif";

const SCHEMA_HINT = `{
  "meta": {
    "title": "리포트 제목",
    "subtitle": "부제 (옵션)",
    "createdAt": "2025-04-20"
  },
  "sections": [
    {
      "id": "summary",
      "componentType": "ExecutiveSummary",
      "label": "Executive Summary",             // SectionHeading title (border 밖)
      "data": {
        "description": "섹션 한 줄 설명",       // SectionHeading description (border 밖) — 필수
        "topMetrics": [
          { "label": "총 건수", "value": "1,234" },
          { "label": "평균", "value": "89%" }
        ],
        "keyFindings": ["Finding 1", "Finding 2"]
      }
    }
  ]
}

섹션 구조 (모든 section에 공통):
  SectionHeading(label + data.description, border 밖)
    → ReportSection (border)
      → SectionCard (gray50)
        → ContentCard (white) → 실제 콘텐츠

필수 필드:
- section.label           → 섹션 대제목 (border 밖)
- section.data.description → 섹션 한 줄 설명 (border 밖, 대제목 아래)

지원 componentType:
- ExecutiveSummary, ExecutiveSummaryCard
- MetricHighlight, InfoCardRow, TextBlock
- DataTable, FunnelChart, StackedBarChart
- DonutChart, PieChart, LineChart, BarChart, HBarChart, RadarChart, ComboChart
- InsightCard, StrategyTable, UserCardRow
- ExecutionRoadmap, WeeklyPlanTable, Composite

데이터 검증 규칙:
- 빈 셀(—, N/A)이 과반인 테이블은 만들지 않음 → TextBlock으로 대체
- data가 비었거나 value가 모두 0인 차트는 만들지 않음 → 섹션 생략 또는 TextBlock
- VBarChart: keys 의 모든 필드가 data[0]에 존재해야 함 (아니면 막대 안 그려짐)
- LineChart: 각 series에 최소 2개 이상의 {x,y} 포인트 필요`;

const STORAGE_KEY = "cubig-report-builder-json";

export default function ReportBuilder() {
  // localStorage에서 복원
  const [jsonText, setJsonText] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || ""; } catch { return ""; }
  });
  const [report, setReport] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const fileInputRef = useRef(null);

  // 자동 저장 (500ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (jsonText) {
          localStorage.setItem(STORAGE_KEY, jsonText);
          setSavedAt(new Date());
        }
      } catch (e) { /* quota exceeded 등 무시 */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [jsonText]);

  const parseAndRender = (text) => {
    try {
      const parsed = JSON.parse(text);
      setReport(parsed);
      setError(null);
    } catch (e) {
      setError(`JSON 파싱 에러: ${e.message}`);
      setReport(null);
    }
  };

  const handleRender = () => parseAndRender(jsonText);

  const handleLoadSample = () => {
    const text = JSON.stringify(sampleReport, null, 2);
    setJsonText(text);
    parseAndRender(text);
  };

  const handleClear = () => {
    setJsonText("");
    setReport(null);
    setError(null);
    setSavedAt(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setError("JSON 파일만 업로드 가능합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setJsonText(text);
      parseAndRender(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: "flex", height: "calc(100vh - 60px)",
      fontFamily: F, background: T.gray50,
      overflow: "hidden",
    }}>
      {/* Left Panel — JSON Input */}
      <div style={{
        width: 420, flexShrink: 0,
        background: T.white, borderRight: `1px solid ${T.gray200}`,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.gray200}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.gray990 }}>📄 리포트 빌더</div>
            {savedAt && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: T.gray800 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green600 }} />
                자동 저장됨
              </div>
            )}
          </div>
          <div style={{ fontSize: 13, color: T.gray800, lineHeight: "20px" }}>
            JSON 파일을 업로드하거나 붙여넣으면 DS 컴포넌트로 리포트가 생성됩니다. 입력 내용은 브라우저에 자동 저장되며 새로고침해도 유지됩니다.
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            margin: "16px 24px",
            border: `2px dashed ${dragOver ? T.blue500 : T.gray200}`,
            borderRadius: 12,
            padding: "24px 16px",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver ? (T.blue50 || "#EFF6FF") : T.gray25,
            transition: "all 0.15s ease",
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray990, marginBottom: 4 }}>
            JSON 파일 드래그 또는 클릭
          </div>
          <div style={{ fontSize: 12, color: T.gray800 }}>.json 확장자만 지원</div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Action buttons */}
        <div style={{ padding: "0 24px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn variant="outline-primary" size="sm" radius="sm" onClick={handleLoadSample}>
            샘플 불러오기
          </Btn>
          <Btn variant="outline-secondary" size="sm" radius="sm" onClick={handleClear}>
            지우기
          </Btn>
          {report && (
            <Btn variant="outline-secondary" size="sm" radius="sm" onClick={handleDownload}>
              ↓ 다운로드
            </Btn>
          )}
        </div>

        {/* JSON Textarea */}
        <div style={{ flex: 1, padding: "0 24px 16px", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.gray800, marginBottom: 8 }}>
            JSON 내용
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={SCHEMA_HINT}
            style={{
              flex: 1, minHeight: 0,
              padding: 12,
              border: `1px solid ${error ? T.red500 : T.gray200}`,
              borderRadius: 8,
              fontFamily: "Menlo, Monaco, Consolas, monospace",
              fontSize: 12, lineHeight: "18px",
              color: T.gray990,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <div style={{
              marginTop: 8, padding: "8px 12px",
              background: "#FEF2F2", color: "#B91C1C",
              borderRadius: 8, fontSize: 12, lineHeight: "18px",
            }}>{error}</div>
          )}
        </div>

        {/* Render Button */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${T.gray200}` }}>
          <Btn variant="solid-primary" size="lg" radius="sm" onClick={handleRender} style={{ width: "100%" }}>
            리포트 렌더
          </Btn>
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div style={{
        flex: 1, minWidth: 0, overflow: "auto",
        background: T.gray25,
      }}>
        {report ? (
          <ReportRenderer report={report} />
        ) : (
          <div style={{
            height: "100%", display: "flex",
            alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12,
            color: T.gray400, fontSize: 14,
          }}>
            <div style={{ fontSize: 48 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: T.gray800 }}>
              JSON을 업로드하거나 샘플을 불러와주세요
            </div>
            <div style={{ fontSize: 13, color: T.gray400 }}>
              좌측 패널에서 "샘플 불러오기"를 눌러 예시 리포트를 확인할 수 있습니다.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
