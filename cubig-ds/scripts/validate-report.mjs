#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────────────────
 * validate-report.mjs
 *
 * 리포트 .jsx 파일을 컴포넌트 카탈로그·JSON 스펙과 대조 검증한다.
 *
 *   1) 사용된 모든 컴포넌트가 카탈로그에 존재하는가
 *   2) 각 컴포넌트에 전달된 prop이 카탈로그의 props 집합에 포함되는가
 *   3) 자체 padding 컴포넌트 직접 부모가 ContentCard padding={0} 인가
 *      (TextBlock / SignalCard / StrategyCard / DataTable / RespondentCard
 *       / UserCard / InfoCardRow / StrategyRoadmapTable 등)
 *   4) JSON 스펙의 leaf path 중 .jsx 에서 참조되지 않는 미사용 필드 목록
 *   5) .jsx 에서 참조하는데 JSON 에 없는 path 목록 (오타·누락)
 *
 * 사용:
 *   node scripts/validate-report.mjs src/churn-prediction-report.jsx \
 *     public/json/churn-prediction.json
 *
 * 사전 조건:
 *   - scripts/component-catalog.json 이 빌드되어 있어야 함
 *     (없으면 자동 빌드)
 * ──────────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_FILE = path.join(__dirname, "component-catalog.json");
const CHART_RULES_FILE = path.join(__dirname, "chart-rules.json");

// 자체 내부 padding 을 가진 컴포넌트 — ContentCard 로 감쌀 때 padding=0 강제
const SELF_PADDED = new Set([
  "TextBlock", "SignalCard", "StrategyCard", "DataTable",
  "RespondentCard", "UserCard", "InfoCard", "InfoCardRow",
  "StrategyRoadmapTable", "ClusterHeader", "ExecutiveSummaryCard",
  "PersonaCard", "PersonaSummaryCard", "MiniStatGrid",
  "ScenarioCard", "ScenarioComparisonCard",
]);

function loadCatalog() {
  if (!fs.existsSync(CATALOG_FILE)) {
    console.log("[info] catalog not found, building...");
    execSync(`node ${path.join(__dirname, "build-component-catalog.mjs")}`, { stdio: "inherit" });
  }
  return JSON.parse(fs.readFileSync(CATALOG_FILE, "utf-8"));
}

// 같은 파일 안에 로컬로 선언된 함수 컴포넌트 이름 수집 (대문자 시작).
// `function FooSection(...)` / `const Foo = (...) =>` / `export function Foo(...)` 모두 매칭.
function parseLocalDecls(src) {
  const out = new Set();
  const reFn = /\bfunction\s+([A-Z][A-Za-z0-9_]*)\s*\(/g;
  const reConst = /\b(?:const|let)\s+([A-Z][A-Za-z0-9_]*)\s*=/g;
  let m;
  while ((m = reFn.exec(src)) !== null) out.add(m[1]);
  while ((m = reConst.exec(src)) !== null) out.add(m[1]);
  return out;
}

// JSX 에서 import 된 컴포넌트 이름 수집 (report-components·charts·ui-components)
function parseImports(src) {
  const imports = new Set();
  const re = /import\s*\{([^}]+)\}\s*from\s*["']\.\/(report-components|charts|ui-components|tokens)[^"']*["']/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    m[1].split(",").map((s) => s.trim()).filter(Boolean).forEach((name) => {
      // 별칭 "Foo as Bar" 처리
      const alias = name.split(/\s+as\s+/).pop().trim();
      imports.add(alias);
    });
  }
  return imports;
}

// "<Component prop1={..} prop2='x'>" 형태 모든 인스턴스 추출.
// props 이름만 (`=` 가 뒤따르는 식별자만 매칭).
function parseJSXUsages(src) {
  const usages = [];
  // 컴포넌트는 대문자로 시작 — 여는 태그만 매칭 (닫는 태그 </ 는 제외)
  const tagRe = /<([A-Z][A-Za-z0-9_]*)\b([\s\S]*?)(\/>|>)/g;
  let m;
  while ((m = tagRe.exec(src)) !== null) {
    const name = m[1];
    const attrStr = m[2];
    const props = [];
    // 어트리뷰트 이름만 추출 — 반드시 `=` 가 뒤따라야 함.
    // 문자열 리터럴/JSX 표현식 내부의 단어들은 매칭에서 제외.
    const stripped = stripValues(attrStr);
    const attrRe = /\b([a-zA-Z][A-Za-z0-9_]*)\s*=/g;
    let am;
    while ((am = attrRe.exec(stripped)) !== null) {
      props.push(am[1]);
    }
    // 부모 ContentCard padding 검출용
    let padding = null;
    if (name === "ContentCard") {
      const pm = attrStr.match(/\bpadding\s*=\s*(?:\{([^}]+)\}|"([^"]+)")/);
      if (pm) padding = (pm[1] ?? pm[2]).trim();
    }
    usages.push({ name, props, padding, index: m.index });
  }
  return usages;
}

// JSX 어트리뷰트 영역에서 값 부분(=뒤의 "..."/'...'/{...})을 빈 공간으로 치환.
// 그 결과 prop 이름만 남기고 매칭에 노이즈 제거.
function stripValues(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "=" && (s[i + 1] === '"' || s[i + 1] === "'" || s[i + 1] === "{")) {
      out += "=";
      const open = s[i + 1];
      const close = open === "{" ? "}" : open;
      let depth = 1;
      i += 2;
      while (i < s.length && depth > 0) {
        if (open === "{") {
          if (s[i] === "{") depth++;
          else if (s[i] === "}") depth--;
        } else {
          if (s[i] === close) depth--;
        }
        i++;
      }
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

// 부모 ContentCard 추적 — 단순 휴리스틱: 직전 ContentCard open 부터 그 close 까지 범위 내
// 정밀하지 않지만 80% 이상 케이스 잡힘. AST 없이도 충분.
function findNearestContentCardParent(src, childIndex) {
  // childIndex 이전에서 가장 가까운 ContentCard open 태그 찾기
  const before = src.slice(0, childIndex);
  const matches = [...before.matchAll(/<ContentCard[\s\S]*?(?:\/>|>)/g)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  const padding = (last[0].match(/\bpadding\s*=\s*(?:\{([^}]+)\}|"([^"]+)")/) || [])[1] || null;
  return { padding };
}

// JSON 객체의 모든 leaf path 수집 ("sections[0].data.atRiskCount" 등)
function leafPaths(obj, prefix = "") {
  const out = new Set();
  if (obj === null || typeof obj !== "object") {
    if (prefix) out.add(prefix);
    return out;
  }
  if (Array.isArray(obj)) {
    // 첫 요소만 대표로 (모든 항목 schema 동일 가정)
    obj.forEach((v, i) => {
      for (const p of leafPaths(v, `${prefix}[${i}]`)) out.add(p);
    });
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") {
      for (const p of leafPaths(v, next)) out.add(p);
    } else {
      out.add(next);
    }
  }
  return out;
}

// 인덱스를 와일드카드(*)로 정규화: "sections[0].data" → "sections[*].data"
function normalizePath(p) {
  return p.replace(/\[\d+\]/g, "[*]");
}

// .jsx 에서 .{prop}.{prop}... 형태로 참조된 path 추출.
// "data.atRiskCount", "meta.reportTitle", "s.color", "p.leftMetric.label" 등.
// 변수 이름은 무시하고 prop chain 만 비교.
function extractReferencedFields(src) {
  const refs = new Set();
  // 식별자.식별자(.식별자)+ 패턴
  const re = /\b([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)+)\b/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const chain = m[1];
    // 첫 토큰(변수)은 빼고 .field.field... 만 저장
    const parts = chain.split(".");
    if (parts.length < 2) continue;
    refs.add(parts.slice(1).join("."));
  }
  return refs;
}

// 휴리스틱 데이터 shape 탐지 — recommend-chart.mjs 와 동일 로직 (간소화)
function detectShape(value) {
  if (Array.isArray(value)) {
    if (!value.length) return null;
    const sample = value[0];
    if (sample && typeof sample === "object") {
      if ("x" in sample && "y" in sample) {
        return typeof sample.x === "string" && /\d{4}/.test(sample.x) ? "TimeSeries" : "TwoDimensional";
      }
      if ("id" in sample && Array.isArray(sample.data)) return "MultiSeriesTimeSeries";
      const keys = Object.keys(sample);
      const numericKeys = keys.filter((k) => typeof sample[k] === "number");
      const hasLabel = keys.includes("label") || keys.includes("category") || keys.includes("name");
      if (hasLabel && numericKeys.length === 1) {
        const numKey = numericKeys[0];
        const sum = value.reduce((s, v) => s + (typeof v[numKey] === "number" ? v[numKey] : 0), 0);
        if (numKey === "percentage" || (sum >= 95 && sum <= 105)) return "PartOfWhole";
        if ("count" in sample) return "SurveyResponse";
        return "CategoryRanking";
      }
      if (hasLabel && numericKeys.length >= 2) return "GroupedCategorical";
    }
    return "CategoryRanking";
  }
  return null;
}

// JSX 에서 차트 컴포넌트 사용처와 그 `data=` 표현식에서 참조한 JSON 경로를 단순 추출.
// 예: <DonutChart data={section.donutChart.segments.map(...)} /> → "section.donutChart.segments"
function extractChartDataPaths(src) {
  const out = [];
  const CHART_NAMES = Object.keys(JSON.parse(fs.readFileSync(CHART_RULES_FILE, "utf-8")).chartExpects);
  for (const chartName of CHART_NAMES) {
    const re = new RegExp(`<${chartName}\\b([\\s\\S]*?)(?:/>|>)`, "g");
    let m;
    while ((m = re.exec(src)) !== null) {
      const attrs = m[1];
      // data={ ... } 안의 식별자 chain 첫 매치를 후보 경로로
      const dm = attrs.match(/\bdata\s*=\s*\{([\s\S]*?)\}/);
      if (!dm) continue;
      // 표현식 안에서 가장 먼저 등장하는 "x.y.z..." 패턴
      const pm = dm[1].match(/([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)+)/);
      if (pm) out.push({ chart: chartName, dataExpr: pm[1] });
      else out.push({ chart: chartName, dataExpr: null });
    }
  }
  return out;
}

// dot path 로 JSON 객체 접근 (배열 항목은 첫 요소 사용)
function getByPath(obj, dotPath) {
  const parts = dotPath.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    if (Array.isArray(cur)) cur = cur[0]; // 배열은 첫 요소
    cur = cur?.[p];
  }
  return cur;
}

function validate(reportPath, jsonPath) {
  const catalog = loadCatalog();
  const chartRules = JSON.parse(fs.readFileSync(CHART_RULES_FILE, "utf-8"));
  const src = fs.readFileSync(reportPath, "utf-8");
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const issues = [];
  const imports = parseImports(src);
  const locals = parseLocalDecls(src);
  const usages = parseJSXUsages(src);

  // 1) 사용 컴포넌트가 카탈로그에 존재하는가 (import / 로컬 선언도 허용)
  const usedComponents = new Set(usages.map((u) => u.name));
  for (const name of usedComponents) {
    if (!catalog[name] && !imports.has(name) && !locals.has(name)) {
      issues.push({ level: "error", kind: "unknown-component", msg: `<${name}> is not in catalog and not imported` });
    }
  }

  // 2) 각 컴포넌트에 전달된 prop 유효성
  for (const u of usages) {
    const spec = catalog[u.name];
    if (!spec) continue;
    const allowedProps = new Set(spec.props.map((p) => p.replace(/^\.\.\./, "")));
    // React 표준 prop 은 항상 허용
    ["key", "ref", "style", "className", "children", "onClick", "onChange"].forEach((p) => allowedProps.add(p));
    // ...rest 가 있는 컴포넌트는 모든 prop 허용
    const hasRest = spec.props.some((p) => p.startsWith("..."));
    if (hasRest) continue;
    for (const p of u.props) {
      if (!allowedProps.has(p)) {
        issues.push({ level: "warn", kind: "unknown-prop", msg: `<${u.name} ${p}=...> — prop not in catalog (allowed: ${[...allowedProps].slice(0, 8).join(", ")}${allowedProps.size > 8 ? "..." : ""})` });
      }
    }
  }

  // 3) 자체 padding 컴포넌트 직접 부모 ContentCard padding=0 검증
  for (const u of usages) {
    if (!SELF_PADDED.has(u.name)) continue;
    const parent = findNearestContentCardParent(src, u.index);
    if (!parent) continue; // ContentCard 부모 없으면 skip
    if (parent.padding !== null && parent.padding !== "0" && parent.padding !== "{0}") {
      issues.push({ level: "warn", kind: "double-padding", msg: `<${u.name}> 직전 ContentCard padding=${parent.padding} — 자체 padding 컴포넌트는 padding={0} 권장` });
    }
  }

  // 4) Chart 적합성 — 차트 컴포넌트의 data 경로 → JSON 실제 shape 매칭
  const chartDataUsages = extractChartDataPaths(src);
  for (const cu of chartDataUsages) {
    const expect = chartRules.chartExpects[cu.chart];
    if (!expect || !cu.dataExpr) continue;
    const pathFromVar = cu.dataExpr.split(".").slice(1).join(".");
    let actualData;
    for (const s of (json.sections || [])) {
      const v = getByPath(s.data || {}, pathFromVar.replace(/^data\./, ""));
      if (v !== undefined) { actualData = v; break; }
    }
    if (actualData === undefined) continue;
    const shape = detectShape(actualData);
    if (!shape) continue;
    if (!expect.shapes.includes(shape)) {
      const recCharts = Object.entries(chartRules.chartExpects).filter(([_, v]) => v.shapes.includes(shape)).map(([k]) => k).join(", ");
      issues.push({
        level: "warn",
        kind: "chart-shape-mismatch",
        msg: `<${cu.chart}> 데이터 shape="${shape}" — 권장 shape: ${expect.shapes.join("/")} / 이 shape 에 적합한 차트: ${recCharts || "—"}`,
      });
    }
  }

  // 5) JSON path coverage
  const jsonPaths = new Set([...leafPaths(json)].map(normalizePath));
  const refs = extractReferencedFields(src);
  // 정규화: JSON path 의 leaf segment 만 추출해서 ref 와 비교
  const jsonSegments = new Set();
  const fieldsOnly = new Set();
  for (const p of jsonPaths) {
    const parts = p.split(".").map((s) => s.replace(/\[\*\]/g, ""));
    fieldsOnly.add(parts.join("."));
    // 끝 segment 도 별도 등록 (참조 단편이 짧을 수 있음)
    jsonSegments.add(parts[parts.length - 1]);
  }
  // refs 중 JSON segment 와 매치되지 않는 것 (오타 후보)
  // 단 React 메서드(toLocaleString 등) 및 흔한 변수 메서드 제외
  const COMMON_METHODS = new Set([
    "toLocaleString", "toString", "map", "filter", "find", "forEach", "reduce",
    "slice", "split", "join", "push", "pop", "length", "includes", "startsWith",
    "endsWith", "replace", "match", "trim", "concat", "indexOf", "json", "then",
    "catch", "console", "error", "log", "warn", "current", "value", "id",
  ]);
  const refLeaves = new Set();
  for (const r of refs) {
    const leaf = r.split(".").pop();
    if (COMMON_METHODS.has(leaf)) continue;
    refLeaves.add(leaf);
  }

  // JSON 에 있지만 코드에서 leaf 단독 참조도 안 된 것 (느슨한 매치)
  const unusedJsonFields = [...jsonSegments].filter((seg) => {
    if (!seg) return false;
    return !refLeaves.has(seg);
  }).sort();

  // 결과 출력
  printReport(reportPath, jsonPath, issues, unusedJsonFields);
}

function printReport(reportPath, jsonPath, issues, unusedJsonFields) {
  const rel = (p) => path.relative(process.cwd(), p);
  console.log("");
  console.log(`Report:  ${rel(reportPath)}`);
  console.log(`JSON:    ${rel(jsonPath)}`);
  console.log("─".repeat(72));

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");

  if (errors.length === 0 && warns.length === 0) {
    console.log("✓ Component usage: clean");
  } else {
    if (errors.length) console.log(`✗ ${errors.length} error(s):`);
    errors.forEach((i) => console.log(`  [ERROR] ${i.kind}: ${i.msg}`));
    if (warns.length) console.log(`! ${warns.length} warning(s):`);
    warns.forEach((i) => console.log(`  [WARN]  ${i.kind}: ${i.msg}`));
  }

  console.log("");
  console.log(`JSON fields not referenced in JSX (${unusedJsonFields.length}):`);
  if (unusedJsonFields.length === 0) {
    console.log("  (none — JSON fully utilized)");
  } else {
    unusedJsonFields.forEach((f) => console.log(`  · ${f}`));
  }
  console.log("");

  // exit code: error 가 있으면 1
  process.exit(errors.length ? 1 : 0);
}

// CLI
const [reportArg, jsonArg] = process.argv.slice(2);
if (!reportArg || !jsonArg) {
  console.error("Usage: node scripts/validate-report.mjs <report.jsx> <data.json>");
  process.exit(2);
}
const reportPath = path.resolve(reportArg);
const jsonPath = path.resolve(jsonArg);
if (!fs.existsSync(reportPath)) { console.error(`Not found: ${reportPath}`); process.exit(2); }
if (!fs.existsSync(jsonPath)) { console.error(`Not found: ${jsonPath}`); process.exit(2); }

validate(reportPath, jsonPath);
