import { useState } from "react";
import { T } from "./tokens.jsx";

const F = "Pretendard, sans-serif";

/* ── Vite glob: import all SVGs as URL strings ── */
const svgModules = import.meta.glob("./assets/icons/*.svg", { eager: true, query: "?url", import: "default" });

/* turn  "./assets/icons/icon_cancel-1.svg" → { file:"icon_cancel-1", url:"..." } */
const ALL_ICONS = Object.entries(svgModules).map(([path, url]) => {
  const file = path.split("/").pop().replace(".svg", "");
  return { file, url };
});

/* ── group by family ── */
function groupIcons(icons) {
  const families = {};
  icons.forEach(({ file, url }) => {
    let family, variant;
    if (file.startsWith("Size=")) {
      family = "star-ai (Size)";
      variant = file;            // "Size=16" etc
    } else {
      // "icon_cancel-2" → base="cancel", suffix="-2"
      const noPrefix = file.replace("icon_", "");
      // find the base name (everything before the first "-N" where N is a digit)
      const match = noPrefix.match(/^(.+?)(-\d+)?$/);
      family = match[1];
      variant = match[2] ? match[2].replace("-", "") : "0";
    }
    if (!families[family]) families[family] = [];
    families[family].push({ file, url, variant });
  });

  // sort variants by size (extract from svg) — just sort by variant number
  Object.values(families).forEach(arr =>
    arr.sort((a, b) => {
      const na = parseInt(a.variant) || 0;
      const nb = parseInt(b.variant) || 0;
      return na - nb;
    })
  );

  return families;
}

const FAMILIES = groupIcons(ALL_ICONS);

/* ── size labels extracted from file names (based on analysis) ── */
const SIZE_MAP = {
  // cancel: 0=20, 1=24, 2=16, 3=16, 4=20, 5=24
  // circlecheck: 0=16, 1=20, 2=24, 3=16, 4=24, 5=20
  // etc — we just show the icon, the size is visible
};

/* ══════════════════════════════════════════════════════════════
   IconsTab — main display component
   ══════════════════════════════════════════════════════════════ */
export function IconsTab() {
  const [copied, setCopied] = useState(null);
  const [search, setSearch] = useState("");

  const handleCopy = (name) => {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1200);
  };

  const filtered = search
    ? Object.fromEntries(Object.entries(FAMILIES).filter(([k]) => k.toLowerCase().includes(search.toLowerCase())))
    : FAMILIES;

  return (
    <div>
      {/* header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: T.gray990, margin: "0 0 8px", fontFamily: F }}>Icons</h1>
        <p style={{ fontSize: 13, color: T.gray800, margin: "0 0 16px", fontFamily: F }}>
          {ALL_ICONS.length}개 아이콘 &middot; 클릭하면 파일명 복사
        </p>
        <input
          placeholder="아이콘 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: 260, padding: "8px 14px", borderRadius: 10,
            border: `1px solid ${T.gray200}`, fontSize: 13,
            fontFamily: F, outline: "none", background: T.white,
          }}
        />
      </div>

      {/* families */}
      {Object.entries(filtered).map(([family, icons]) => (
        <div key={family} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: T.gray990, margin: "0 0 12px", fontFamily: F, textTransform: "capitalize" }}>
            {family}
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {icons.map(({ file, url }) => {
              const isCopied = copied === file;
              return (
                <div
                  key={file}
                  onClick={() => handleCopy(file)}
                  style={{
                    width: 110, padding: "16px 8px 10px",
                    background: isCopied ? T.gray100 : T.white,
                    borderRadius: 12,
                    border: `1px solid ${T.gray200}`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => { if (!isCopied) e.currentTarget.style.background = T.gray50; }}
                  onMouseLeave={e => { if (!isCopied) e.currentTarget.style.background = T.white; }}
                >
                  <img src={url} alt={file} style={{ width: 24, height: 24, objectFit: "contain" }} />
                  <span style={{
                    fontSize: 10, color: isCopied ? T.blue500 : T.gray800,
                    fontFamily: F, fontWeight: 500, textAlign: "center",
                    lineHeight: 1.3, wordBreak: "break-all",
                  }}>
                    {isCopied ? "Copied!" : file.replace("icon_", "")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {Object.keys(filtered).length === 0 && (
        <p style={{ color: T.gray400, fontSize: 14, fontFamily: F, padding: 40, textAlign: "center" }}>
          검색 결과 없음
        </p>
      )}
    </div>
  );
}
