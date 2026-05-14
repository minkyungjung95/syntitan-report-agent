#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────────────────
 * build-component-catalog.mjs
 *
 * report-components.jsx + charts.jsx + ui-components.jsx 의 export 함수를
 * 파싱해서 컴포넌트 카탈로그를 생성한다.
 *
 *   {
 *     "<ComponentName>": {
 *       source: "report-components.jsx",
 *       props: ["title", "description", "data", ...],
 *       defaults: { padding: "0", legendPosition: '"right"' },
 *       category: "report" | "chart" | "ui"
 *     }
 *   }
 *
 * 사용:
 *   node scripts/build-component-catalog.mjs
 *   → scripts/component-catalog.json 생성
 *
 * 카탈로그는 리포트 생성/검증 시 단일 source of truth.
 * 컴포넌트 시그니처 변경 시 재실행.
 * ──────────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "..", "src");
const OUT_FILE = path.join(__dirname, "component-catalog.json");

const SOURCES = [
  { file: "report-components.jsx", category: "report" },
  { file: "charts.jsx", category: "chart" },
  { file: "ui-components.jsx", category: "ui" },
];

// "export function Name({ a, b = 1, c = "x", ...rest })" → { name, props, defaults }
// 객체 디스트럭처링이 한 줄로 끝나거나 여러 줄에 걸칠 수 있어 multi-line aware regex 사용.
function parseExports(source) {
  const results = [];
  // export function FOO(arg)  /  export function FOO({...})
  const re = /export\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(([^)]*)\)/gs;
  let m;
  while ((m = re.exec(source)) !== null) {
    const name = m[1];
    const rawArgs = m[2];
    const propInfo = parseDestructure(rawArgs);
    results.push({ name, ...propInfo });
  }
  return results;
}

// "{ a, b = 1, c = "x" }" 형태에서 props·defaults 추출.
// 객체 디스트럭처링이 아니면(positional arg) props: ["__arg0"]로 표기.
function parseDestructure(rawArgs) {
  const trimmed = stripComments(rawArgs).trim();
  if (!trimmed.startsWith("{")) {
    // positional argument
    return { props: trimmed ? [trimmed.split(/\s*[:=,]\s*/)[0]] : [], defaults: {} };
  }
  // 중괄호 안 내용만 추출
  const inner = trimmed.slice(1, trimmed.lastIndexOf("}")).trim();
  if (!inner) return { props: [], defaults: {} };

  const props = [];
  const defaults = {};
  // 깊이 0에서 콤마로 분리 (괄호·중괄호·대괄호 깊이 추적)
  let depth = 0, buf = "";
  const tokens = [];
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      tokens.push(buf.trim());
      buf = "";
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) tokens.push(buf.trim());

  for (const tok of tokens) {
    if (tok.startsWith("...")) {
      props.push(tok); // ...rest
      continue;
    }
    const eqIdx = findTopLevelEq(tok);
    if (eqIdx === -1) {
      props.push(tok);
    } else {
      const propName = tok.slice(0, eqIdx).trim();
      const defaultVal = tok.slice(eqIdx + 1).trim();
      props.push(propName);
      defaults[propName] = defaultVal;
    }
  }
  return { props, defaults };
}

// 라인 코멘트(`// ...`) + 블록 코멘트(`/* ... */`) 제거. 문자열 안 `//` 는 보호.
function stripComments(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    // 블록 코멘트
    if (ch === "/" && s[i + 1] === "*") {
      const end = s.indexOf("*/", i + 2);
      i = end === -1 ? s.length : end + 2;
      continue;
    }
    // 라인 코멘트
    if (ch === "/" && s[i + 1] === "/") {
      const nl = s.indexOf("\n", i + 2);
      i = nl === -1 ? s.length : nl;
      continue;
    }
    // 문자열 — 따옴표 종류별 그대로 통과
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      out += ch; i++;
      while (i < s.length && s[i] !== q) {
        if (s[i] === "\\") { out += s[i] + (s[i+1] || ""); i += 2; continue; }
        out += s[i]; i++;
      }
      if (i < s.length) { out += s[i]; i++; }
      continue;
    }
    out += ch; i++;
  }
  return out;
}

function findTopLevelEq(s) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    else if (ch === "=" && depth === 0 && s[i + 1] !== "=" && s[i - 1] !== "=") {
      return i;
    }
  }
  return -1;
}

function build() {
  const catalog = {};
  let total = 0;
  for (const { file, category } of SOURCES) {
    const fp = path.join(SRC_DIR, file);
    if (!fs.existsSync(fp)) {
      console.warn(`[skip] ${file} not found`);
      continue;
    }
    const rawSrc = fs.readFileSync(fp, "utf-8");
    const src = stripComments(rawSrc); // 주석 안 `)` 가 regex 캡처를 끊는 문제 방지
    const exports = parseExports(src);
    for (const e of exports) {
      catalog[e.name] = {
        source: file,
        category,
        props: e.props,
        defaults: e.defaults,
      };
      total++;
    }
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(catalog, null, 2));
  console.log(`✓ ${total} components → ${path.relative(process.cwd(), OUT_FILE)}`);
}

build();
