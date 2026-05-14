#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────────────────
 * recommend-chart.mjs
 *
 * JSON 파일을 받아 각 섹션의 data shape 을 분석하고, 적합한 차트 후보를
 * chart-rules.json 의 룰셋에 따라 추천한다.
 *
 * 사용:
 *   node scripts/recommend-chart.mjs public/json/churn-prediction.json
 *
 * 출력: 섹션별 (shape → 추천 차트 + 비적합 경고).
 * ──────────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_FILE = path.join(__dirname, "chart-rules.json");

const RULES = JSON.parse(fs.readFileSync(RULES_FILE, "utf-8"));

// 휴리스틱 shape 탐지 — 객체 또는 배열을 받아 가장 매칭되는 shape 이름 반환.
function detectShape(value, fieldName = "") {
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    const sample = value[0];

    // {x, y} or {x: date, y: number} → time series
    if (sample && typeof sample === "object" && "x" in sample && "y" in sample) {
      const xIsDate = typeof sample.x === "string" && /\d{4}/.test(sample.x);
      return xIsDate ? "TimeSeries" : "TwoDimensional";
    }

    // {id, data: [...]} → multi-series time series
    if (sample && typeof sample === "object" && "id" in sample && Array.isArray(sample.data)) {
      return "MultiSeriesTimeSeries";
    }

    // {category, ...} or {label, ...keys} → radar / grouped categorical
    if (sample && typeof sample === "object") {
      const keys = Object.keys(sample);
      const hasLabelOrCategory = keys.includes("label") || keys.includes("category") || keys.includes("name");
      const numericKeys = keys.filter((k) => typeof sample[k] === "number");

      // {label, value} or {label, percentage} → check sum for part-of-whole vs ranking
      if (hasLabelOrCategory && numericKeys.length === 1) {
        const numKey = numericKeys[0];
        const sum = value.reduce((s, v) => s + (typeof v[numKey] === "number" ? v[numKey] : 0), 0);
        // percentage 필드 우선 — 합이 100 근처면 PartOfWhole
        if (numKey === "percentage" || (sum >= 95 && sum <= 105)) {
          return "PartOfWhole";
        }
        // 설문 응답 — count/응답률 패턴 (label 이 응답 옵션, value 가 %)
        const hasCount = "count" in sample;
        if (hasCount) return "SurveyResponse";
        return "CategoryRanking";
      }

      // {label, value1, value2, ...} → grouped categorical
      if (hasLabelOrCategory && numericKeys.length >= 2) {
        return "GroupedCategorical";
      }

      // {label, start, end} → timeline
      if (keys.includes("start") && keys.includes("end")) {
        return "Timeline";
      }
    }

    // 일반 배열
    return "CategoryRanking";
  }

  // 객체 — scalar metric 모음 또는 KPI
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.includes("current") && keys.includes("previous")) return "KPITrend";
    if (keys.some((k) => Array.isArray(value[k]))) {
      // 중첩 배열 — 안쪽으로 재귀
      const arrKey = keys.find((k) => Array.isArray(value[k]));
      return detectShape(value[arrKey], arrKey);
    }
    return "ScalarMetrics";
  }

  return null;
}

// 추천 차트 + 경고 메시지 생성
function recommendForShape(shape, data) {
  const def = RULES.shapes[shape];
  if (!def) return { charts: [], warns: [] };
  const charts = def.recommend || [];
  const warns = [];

  // 경고 룰 평가
  if (def.warnIf) {
    if (def.warnIf.tooManySegments && Array.isArray(data) && data.length > def.warnIf.tooManySegments.threshold) {
      warns.push(def.warnIf.tooManySegments.msg);
    }
    if (def.warnIf.tooFew && Array.isArray(data) && data.length <= def.warnIf.tooFew.threshold) {
      warns.push(def.warnIf.tooFew.msg);
    }
    if (def.warnIf.single && Array.isArray(data) && data.length === def.warnIf.single.threshold) {
      warns.push(def.warnIf.single.msg);
    }
    if (def.warnIf.tooManySeries && Array.isArray(data) && data.length > def.warnIf.tooManySeries.threshold) {
      warns.push(def.warnIf.tooManySeries.msg);
    }
  }
  return { charts, warns };
}

// 섹션 내부에서 차트화 가능한 sub-field 들 발견
function findChartableFields(section) {
  const out = [];
  const data = section.data || {};
  // 1) 알려진 차트 데이터 필드 우선 검사
  const KNOWN = [
    "donutChart", "donutCharts", "barChart", "barCharts",
    "responseChart", "trendChart", "timeline", "comparisonTable",
    "segments", "bars", "items", "points", "metrics", "scenarios",
  ];
  for (const key of KNOWN) {
    if (key in data) {
      const v = data[key];
      // donutCharts: array of donut configs
      if (Array.isArray(v) && key.endsWith("Charts")) {
        v.forEach((sub, i) => {
          const inner = sub.segments || sub.bars || sub.points || sub.items || sub;
          out.push({ field: `${key}[${i}]`, value: inner });
        });
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        // donutChart: { segments: [...] }
        const inner = v.segments || v.bars || v.points || v.items || v.rows || v;
        out.push({ field: key, value: inner });
      } else {
        out.push({ field: key, value: v });
      }
    }
  }
  return out;
}

function analyze(jsonPath) {
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const sections = json.sections || [];

  console.log("");
  console.log(`JSON:  ${path.relative(process.cwd(), jsonPath)}`);
  console.log("─".repeat(72));

  if (!sections.length) {
    console.log("(no sections found)");
    return;
  }

  for (const s of sections) {
    console.log("");
    console.log(`§ ${s.id}  ${s.sectionName ? `(${s.sectionName})` : ""}`);
    if (s.componentType) console.log(`  componentType: ${s.componentType}`);

    const fields = findChartableFields(s);
    if (!fields.length) {
      // scalar metric 묶음일 가능성
      const shape = detectShape(s.data);
      const rec = shape ? recommendForShape(shape, s.data) : null;
      if (rec && rec.charts.length) {
        console.log(`  shape: ${shape}`);
        console.log(`  추천: ${rec.charts.join(" / ")}`);
      } else {
        console.log("  (차트화 가능한 필드 없음 — 카드/텍스트 섹션으로 추정)");
      }
      continue;
    }
    for (const f of fields) {
      const shape = detectShape(f.value, f.field);
      const rec = shape ? recommendForShape(shape, f.value) : null;
      console.log(`  ├ ${f.field}: shape=${shape || "?"}`);
      if (rec && rec.charts.length) {
        console.log(`  │   → 추천: ${rec.charts.join(" / ")}`);
      }
      if (rec && rec.warns.length) {
        for (const w of rec.warns) console.log(`  │   ⚠ ${w}`);
      }
    }
  }
  console.log("");
}

const [arg] = process.argv.slice(2);
if (!arg) {
  console.error("Usage: node scripts/recommend-chart.mjs <data.json>");
  process.exit(2);
}
const jsonPath = path.resolve(arg);
if (!fs.existsSync(jsonPath)) { console.error(`Not found: ${jsonPath}`); process.exit(2); }
analyze(jsonPath);
