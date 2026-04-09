import { useState } from "react";
import { DonutChart, HBarChart, VBarChart, GroupedBarChart, StackedHBar, LineChart, RadarChart, PSMChart, CHART_COLORS } from "./charts";

// ─── Design Tokens (컬러칩 HTML 1:1 매핑) ────────────────────────────────
const T = {
  // ── palette/gray (18단계) ──
  gray25:"#FBFBFB", gray50:"#F7F7F8", gray100:"#F0F0F2",
  gray200:"#E6E7E9", gray300:"#DCDDDF", gray400:"#CACCCF",
  gray500:"#B6B8BD", gray600:"#A2A4AA", gray700:"#8F9298",
  gray800:"#7B7E85", gray850:"#666970", gray900:"#525459",
  gray925:"#404145", gray950:"#303135", gray975:"#222325",
  gray990:"#171719", gray1000:"#0F0F10",
  white:"#FFFFFF", black:"#000000", strong:"#0F0F10",

  // ── palette/red ──
  red50:"#FEF2F2", red100:"#FFE2E2", red200:"#FFC9C9",
  red300:"#FFA2A2", red400:"#FF6467", red500:"#FB2C36",
  red600:"#E7000B", red700:"#C10007", red800:"#9F0712",
  red900:"#82181A", red950:"#460809",

  // ── palette/orange ──
  orange50:"#FFF7ED", orange100:"#FFEDD4", orange200:"#FFD6A8",
  orange300:"#FFB86A", orange400:"#FF8904", orange500:"#FF6900",
  orange600:"#F54900", orange700:"#CA3500", orange800:"#9F2D00",
  orange900:"#7E2A0C", orange950:"#441306",
  orange:"#FF6900", // alias

  // ── palette/yellow ──
  yellow50:"#FEFCE8", yellow100:"#FEF9C2", yellow200:"#FFF085",
  yellow300:"#FFDF20", yellow400:"#FDC700", yellow500:"#F0B100",
  yellow600:"#D08700", yellow700:"#A65F00", yellow800:"#894B00",
  yellow900:"#733E0A", yellow950:"#432004",

  // ── palette/lime ──
  lime50:"#F7FEE7", lime100:"#ECFCCA", lime200:"#D8F999",
  lime300:"#BBF451", lime400:"#9AE600", lime500:"#7CCF00",
  lime600:"#5EA500", lime700:"#497D00", lime800:"#3C6300",
  lime900:"#35530E", lime950:"#192E03",

  // ── palette/green ──
  green50:"#F0FDF4", green100:"#DCFCE7", green200:"#B9F8CF",
  green300:"#7BF1A8", green400:"#05DF72", green500:"#00C950",
  green600:"#00A63E", green700:"#008236", green800:"#016630",
  green900:"#0D542B", green950:"#032E15",

  // ── palette/blue ──
  blue50:"#EFF6FF", blue500:"#2B7FFF", blue600:"#155DFC",

  // ── palette/purple ──
  purple50:"#FAF5FF", purple100:"#F3E8FF", purple500:"#AD46FF",
  purple700:"#8200DB", purple800:"#6E11B0", purple900:"#59168B",

  // ── palette/deeppurple ──
  dp100:"#EFEBFF", dp300:"#B5ABF2", dp500:"#8A77E0",
  dp600:"#7A65D0", dp700:"#6C58BE",
};

// ─── Typography Tokens ────────────────────────────────────────────────
const TYPO = {
  display5: { size:80, lh:88, ls:-0.5 },
  display4: { size:64, lh:80, ls:-0.5 },
  display3: { size:56, lh:72, ls:-0.5 },
  display2: { size:48, lh:64, ls:-0.5 },
  display1: { size:40, lh:52, ls:-0.5 },
  title4:   { size:36, lh:48, ls:-0.5 },
  title3:   { size:32, lh:42, ls:-0.5 },
  title2:   { size:28, lh:40, ls:0 },
  title1:   { size:24, lh:34, ls:0 },
  heading3: { size:22, lh:30, ls:0 },
  heading2: { size:20, lh:28, ls:0 },
  heading1: { size:18, lh:26, ls:0 },
  body3:    { size:16, lh:24, ls:0 },
  body2:    { size:14, lh:20, ls:0 },
  body1:    { size:13, lh:18, ls:0 },
  caption2: { size:12, lh:16, ls:0 },
  caption1: { size:11, lh:14, ls:0 },
};
const FONT_WEIGHT = { regular:400, medium:500, semibold:600, bold:700 };

// 타이포 스타일 헬퍼: typo(TYPO.body2, "medium") => { fontSize, lineHeight, letterSpacing, fontWeight, fontFamily }
function typo(t, weight="medium") {
  return {
    fontFamily: "Pretendard, sans-serif",
    fontSize: t.size,
    lineHeight: `${t.lh}px`,
    letterSpacing: `${t.ls}px`,
    fontWeight: FONT_WEIGHT[weight] || 500,
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────
const InfoIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox={size<=16?"0 0 16 16":size<=20?"0 0 20 20":"0 0 24 24"} fill={color} style={{flexShrink:0}}>
    {size<=16 ? <path d="M8 11.167a.5.5 0 0 0 .5-.5V7.833a.5.5 0 1 0-1 0v2.834a.5.5 0 0 0 .5.5Zm0-4.974a.54.54 0 0 0 .384-.154.527.527 0 0 0 .154-.385.537.537 0 0 0-.538-.538.537.537 0 0 0-.538.538c0 .153.051.28.154.385A.527.527 0 0 0 8 6.192ZM8 14.333a6.333 6.333 0 1 1 0-12.667 6.333 6.333 0 0 1 0 12.667Zm0-1a5.333 5.333 0 1 0 0-10.667 5.333 5.333 0 0 0 0 10.667Z"/>
    : size<=20 ? <path d="M10 13.958a.625.625 0 0 0 .625-.625V9.792a.625.625 0 1 0-1.25 0v3.541a.625.625 0 0 0 .625.625Zm0-6.218a.674.674 0 0 0 .48-.193.664.664 0 0 0 .193-.48.674.674 0 0 0-.673-.674.674.674 0 0 0-.673.673c0 .19.064.35.193.48A.66.66 0 0 0 10 7.74ZM10 17.917a7.917 7.917 0 1 1 0-15.834 7.917 7.917 0 0 1 0 15.834Zm0-1.25a6.667 6.667 0 1 0 0-13.334 6.667 6.667 0 0 0 0 13.334Z"/>
    : <path d="M12 16.75a.75.75 0 0 0 .75-.75v-4.25a.75.75 0 1 0-1.5 0V16a.75.75 0 0 0 .75.75Zm0-7.462a.808.808 0 0 0 .576-.232.79.79 0 0 0 .232-.576.808.808 0 0 0-.808-.808.808.808 0 0 0-.808.808c0 .229.077.42.232.576A.79.79 0 0 0 12 9.288ZM12 21.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Zm0-1.5a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>}
  </svg>
);
const CheckIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox={size<=16?"0 0 16 16":"0 0 20 20"} fill={color} style={{flexShrink:0}}>
    {size<=16 ? <path d="M7.137 8.931 6.022 7.832a.482.482 0 0 0-.603.457l1.346 1.346a.54.54 0 0 0 .744 0l3.059-3.06a.482.482 0 0 0-.603-.457L7.137 8.931ZM8 14.067a6.067 6.067 0 1 1 0-12.134 6.067 6.067 0 0 1 0 12.134Zm0-.867a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4Z"/>
    : <path d="M8.921 11.164 7.527 9.79a.482.482 0 0 0-.754.459l1.683 1.683a.54.54 0 0 0 .93 0l4.289-4.289a.482.482 0 0 0-.754-.459L8.921 11.164ZM10 17.583a7.583 7.583 0 1 1 0-15.167 7.583 7.583 0 0 1 0 15.167Zm0-1.083a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"/>}
  </svg>
);
const WarnIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox={size<=16?"0 0 16 16":size<=20?"0 0 20 20":"0 0 24 24"} fill={color} style={{flexShrink:0}}>
    {size<=16 ? <path d="M2.332 13.267h11.336a.4.4 0 0 0 .347-.6L8.347 3.012a.4.4 0 0 0-.694 0L1.985 12.667a.4.4 0 0 0 .347.6ZM8.432 11.2H7.566v-1.067h.866V11.2Zm0-2.133H7.566v-2.4h.866v2.4Z"/>
    : size<=20 ? <path d="M2.915 16.583a.584.584 0 0 1-.586-.335.594.594 0 0 1 .006-.668L9.427 3.776a.59.59 0 0 1 1.146 0l7.092 11.781a.594.594 0 0 1-.58 1.026H2.915ZM3.646 15.5h12.708L10 4.917 3.646 15.5Zm6.35-1.16a.59.59 0 0 0 .594-.595.59.59 0 0 0-.594-.584.59.59 0 0 0-.583.584.59.59 0 0 0 .583.595Zm0-2.18a.545.545 0 0 0 .546-.542V8.702a.547.547 0 0 0-1.092 0v2.917a.545.545 0 0 0 .546.541Z"/>
    : <path d="M3.498 19.9a.742.742 0 0 1-.72-.412.73.73 0 0 1 .024-.819L11.313 4.531a.724.724 0 0 1 1.374 0l8.511 14.138a.73.73 0 0 1-.697 1.231H3.498ZM4.375 18.6h15.25L12 5.9 4.375 18.6Zm7.62-1.392a.708.708 0 0 0 .713-.713.708.708 0 0 0-.713-.713.708.708 0 0 0-.703.713c0 .198.066.363.199.495a.68.68 0 0 0 .505.218Zm0-2.616a.649.649 0 0 0 .655-.65v-3.5a.655.655 0 0 0-1.31 0v3.5a.649.649 0 0 0 .655.65Z"/>}
  </svg>
);
const ErrorIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox={size<=20?"0 0 20 20":"0 0 24 24"} fill={color} style={{flexShrink:0}}>
    {size<=20 ? <path d="M10 13.776a.59.59 0 0 0 .59-.586.59.59 0 0 0-.585-.59.59.59 0 0 0-.595.585.59.59 0 0 0 .59.59Zm0-2.712a.545.545 0 0 0 .542-.541V6.606a.547.547 0 0 0-1.084 0v3.917a.545.545 0 0 0 .542.541ZM10 17.583a7.583 7.583 0 1 1 .007-15.167A7.583 7.583 0 0 1 10 17.583Z"/>
    : <path d="M11.995 16.531a.708.708 0 0 0 .713-.713.708.708 0 0 0-.713-.703.708.708 0 0 0-.703.702c0 .199.066.364.199.496a.68.68 0 0 0 .504.218Zm0-3.254a.65.65 0 0 0 .655-.65V7.927a.655.655 0 0 0-1.3 0v4.7a.65.65 0 0 0 .645.65ZM12 21.1a9.1 9.1 0 1 1 .009-18.2A9.1 9.1 0 0 1 12 21.1Z"/>}
  </svg>
);
const CancelIcon = ({ size=20, color }) => (
  <svg width={size} height={size} viewBox={size<=20?"0 0 20 20":"0 0 24 24"} fill={color} style={{flexShrink:0}}>
    {size<=20 ? <path d="m10 10.774 2.561 2.561a.482.482 0 0 0 .774-.459L10.774 9.99l2.561-2.551a.482.482 0 0 0-.774-.459L10 9.226 7.439 6.665a.482.482 0 0 0-.754.459L9.226 10l-2.561 2.561a.482.482 0 0 0 .754.455L10 10.774ZM10 17.583a7.583 7.583 0 1 1 .007-15.167A7.583 7.583 0 0 1 10 17.583Zm0-1.083a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"/>
    : <path d="m12 12.929 3.073 3.073a.577.577 0 0 0 .929-.551L12.929 12l3.073-3.074a.577.577 0 0 0-.929-.551L12 11.071 8.927 7.998a.577.577 0 0 0-.904.551L11.071 12l-3.073 3.073a.577.577 0 0 0 .927.545L12 12.929ZM12 21.1a9.1 9.1 0 1 1 .009-18.2A9.1 9.1 0 0 1 12 21.1Zm0-1.3a7.8 7.8 0 1 0 0-15.6 7.8 7.8 0 0 0 0 15.6Z"/>}
  </svg>
);
const DatabaseIcon = ({ size=24, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{flexShrink:0}}>
    <path d="M12 20.5c-2.427 0-4.45-.343-6.07-1.028C4.31 18.787 3.5 17.931 3.5 16.904V7c0-.965.83-1.79 2.489-2.474C7.648 3.842 9.651 3.5 12 3.5c2.349 0 4.353.342 6.012 1.026C19.671 5.21 20.5 6.035 20.5 7v9.904c0 1.027-.81 1.883-2.43 2.568-1.62.685-3.643 1.028-6.07 1.028Zm0-11.542c1.458 0 2.925-.206 4.403-.618 1.478-.412 2.334-.857 2.568-1.334-.229-.49-1.076-.946-2.541-1.37C14.964 5.212 13.487 5 12 5c-1.485 0-2.956.206-4.415.618-1.458.412-2.317.862-2.576 1.349.253.5 1.105.957 2.557 1.37 1.452.414 2.93.62 4.434.62ZM12 13.962c.694 0 1.369-.034 2.025-.1a15.41 15.41 0 0 0 3.562-1.025 8.47 8.47 0 0 0 1.413-.389V8.9a8.47 8.47 0 0 1-1.414.644c-.518.19-1.079.349-1.681.477a15.36 15.36 0 0 1-3.905.493c-.706 0-1.395-.035-2.065-.105a13.883 13.883 0 0 1-3.56-.969A10.083 10.083 0 0 1 5 8.9v3.548a8.47 8.47 0 0 0 1.376.64c.514.186 1.068.343 1.663.472.595.128 1.227.227 1.897.297.67.07 1.358.105 2.064.105ZM12 19c.812 0 1.608-.054 2.39-.161a12.63 12.63 0 0 0 2.135-.438c.641-.185 1.182-.4 1.622-.645.44-.245.725-.502.853-.771v-3.037a8.47 8.47 0 0 1-1.414.644c-.518.19-1.079.349-1.681.477a15.36 15.36 0 0 1-3.905.493c-.706 0-1.395-.035-2.065-.105a13.883 13.883 0 0 1-3.56-.969A10.083 10.083 0 0 1 5 13.948V17c.128.276.41.532.845.768.435.237.974.448 1.615.633a12.63 12.63 0 0 0 2.14.438c.787.107 1.588.161 2.4.161Z"/>
  </svg>
);
const PersonIcon = ({ size=24, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{flexShrink:0}}>
    <path d="M12 11.692c-.965 0-1.79-.342-2.474-1.026A3.37 3.37 0 0 1 8.5 8.192c0-.965.342-1.79 1.026-2.474A3.37 3.37 0 0 1 12 4.692c.965 0 1.79.342 2.474 1.026A3.37 3.37 0 0 1 15.5 8.192c0 .965-.342 1.79-1.026 2.474A3.37 3.37 0 0 1 12 11.692ZM4.5 17.788v-.704c0-.49.133-.943.399-1.36.266-.418.621-.739 1.066-.963a14.634 14.634 0 0 1 2.991-1.09A12.302 12.302 0 0 1 12 13.308c1.023 0 2.037.121 3.043.364a14.634 14.634 0 0 1 2.991 1.09c.445.224.801.545 1.067.963.266.417.399.87.399 1.36v.704a1.47 1.47 0 0 1-.443.924 1.47 1.47 0 0 1-1.038.443H5.98a1.47 1.47 0 0 1-1.038-.443 1.47 1.47 0 0 1-.443-.924Z"/>
  </svg>
);
const IdentityIcon = ({ size=24, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{flexShrink:0}}>
    <path d="M11.056 19.608a1.05 1.05 0 0 1-.944-.016 1.101 1.101 0 0 1-.512-.652l6.36-2.046A10.118 10.118 0 0 1 12 15.25c-.955 0-1.89.14-2.803.423a10.118 10.118 0 0 0-3.597 1.206l4.456 2.729ZM12 12.75c.903 0 1.67-.316 2.302-.948A3.137 3.137 0 0 0 15.25 9.5a3.137 3.137 0 0 0-.948-2.302A3.137 3.137 0 0 0 12 6.25a3.137 3.137 0 0 0-2.302.948A3.137 3.137 0 0 0 8.75 9.5c0 .903.316 1.67.948 2.302A3.137 3.137 0 0 0 12 12.75Zm-.944 8.596L4.364 17.248a1.192 1.192 0 0 1-.638-.658A1.233 1.233 0 0 1 3.5 15.702V8.298c0-.319.075-.616.226-.89A1.18 1.18 0 0 1 4.364 6.752l6.692-4.098a1.192 1.192 0 0 1 1.888 0l6.692 4.098c.285.164.512.383.638.658a1.233 1.233 0 0 1 .226.888v7.404c0 .319-.075.616-.226.89a1.18 1.18 0 0 1-.638.656l-6.692 4.098a1.05 1.05 0 0 1-.888.27Z"/>
  </svg>
);
const StarAiIcon = ({ size=16, color }) => {
  if (size <= 16) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={color} style={{flexShrink:0}}>
      <path d="M3.266 1.833a.476.476 0 0 1 .918 0 4.09 4.09 0 0 0 2.191 3.236.476.476 0 0 1 0 .936 4.09 4.09 0 0 0-2.191 3.236.476.476 0 0 1-.918 0 4.09 4.09 0 0 0-2.191-3.236.476.476 0 0 1 0-.936A4.09 4.09 0 0 0 3.266 1.833Z"/>
      <path d="M9.449 4.968a.758.758 0 0 1 1.441 0 7.03 7.03 0 0 0 3.439 5.048.758.758 0 0 1 0 1.49 7.03 7.03 0 0 0-3.439 5.048.758.758 0 0 1-1.441 0 7.03 7.03 0 0 0-3.439-5.048.758.758 0 0 1 0-1.49 7.03 7.03 0 0 0 3.439-5.048Z"/>
    </svg>
  );
  if (size <= 20) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill={color} style={{flexShrink:0}}>
      <path d="M4.083 2.29a.595.595 0 0 1 1.147 0 5.113 5.113 0 0 0 2.739 4.045.595.595 0 0 1 0 1.171 5.113 5.113 0 0 0-2.739 4.045.595.595 0 0 1-1.147 0 5.113 5.113 0 0 0-2.739-4.045.595.595 0 0 1 0-1.17A5.113 5.113 0 0 0 4.083 2.29Z"/>
      <path d="M11.811 6.21a.947.947 0 0 1 1.801 0 8.787 8.787 0 0 0 4.299 6.31.947.947 0 0 1 0 1.864 8.787 8.787 0 0 0-4.299 6.31.947.947 0 0 1-1.801 0 8.787 8.787 0 0 0-4.299-6.31.947.947 0 0 1 0-1.863 8.787 8.787 0 0 0 4.299-6.31Z"/>
    </svg>
  );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color} style={{flexShrink:0}}>
      <path d="M4.899 2.749a.714.714 0 0 1 1.377 0 6.136 6.136 0 0 0 3.287 4.854.714.714 0 0 1 0 1.405 6.136 6.136 0 0 0-3.287 4.854.714.714 0 0 1-1.377 0 6.136 6.136 0 0 0-3.287-4.854.714.714 0 0 1 0-1.405 6.136 6.136 0 0 0 3.287-4.854Z"/>
      <path d="M14.174 7.452a1.137 1.137 0 0 1 2.161 0 10.544 10.544 0 0 0 5.159 7.572 1.137 1.137 0 0 1 0 2.237 10.544 10.544 0 0 0-5.159 7.572 1.137 1.137 0 0 1-2.161 0 10.544 10.544 0 0 0-5.159-7.572 1.137 1.137 0 0 1 0-2.236 10.544 10.544 0 0 0 5.159-7.573Z"/>
    </svg>
  );
};
const CloseIcon = ({ size=12, color }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M2 2L10 10M10 2L2 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const PlusIcon  = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const DownIcon  = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M10 4v8M6 9l4 4 4-4M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevronR  = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const StarIcon  = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 12 12" fill={color}><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.44L6 8.885 2.91 10.51l.59-3.44L1 4.635l3.455-.505L6 1z"/></svg>;

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════════════════
const BTN_SIZE = {
  lg: { h:48, px:16, py:12, fs:16, lh:24, br:8 },
  md: { h:40, px:16, py:10, fs:14, lh:22, br:8 },
  sm: { h:32, px:12, py:6,  fs:14, lh:22, br:8 },
};
const BTN_RADIUS = { sm:8, md:12, full:9999 };

const BTN_STYLES = {
  "solid-primary":   { bg:T.gray990,    text:T.white,       border:T.gray950,   hBg:T.gray950,    aBg:T.gray800,    dBg:T.gray200,    dText:T.gray400,    dBorder:T.gray200 },
  "solid-secondary": { bg:T.white,      text:T.gray990,     border:T.gray200,   hBg:T.gray50,     hBorder:T.gray300,aBg:T.gray100,    dBg:T.gray50,     dText:T.gray400,    dBorder:T.gray100 },
  "solid-brand":     { bg:T.purple800,  text:T.white,       border:T.purple800, hBg:T.purple700,  aBg:T.purple900,  dBg:T.gray50,     dText:T.gray300,    dBorder:T.gray200 },
  "solid-positive":  { bg:T.green600,   text:T.white,       border:T.green600,  hBg:T.green500,   aBg:T.green400,   dBg:T.gray50,     dText:T.gray300,    dBorder:T.gray200 },
  "solid-negative":  { bg:T.red500,     text:T.white,       border:T.red500,    hBg:T.red600,     aBg:T.red600,     dBg:T.gray50,     dText:T.gray300,    dBorder:T.gray200 },
  "solid-tertiary":  { bg:"transparent",text:T.gray990,     border:"transparent",hBg:T.gray100,   aBg:T.gray200,    dText:T.gray300 },
  "outline-primary": { bg:"transparent",text:T.gray990,     border:T.gray800,   hBg:T.gray50,     aBg:T.gray100,    dText:T.gray300,  dBorder:T.gray200 },
  "outline-brand":   { bg:"transparent",text:T.purple800,   border:T.purple500, hBg:T.purple50,   dText:T.purple500,dBorder:T.purple100,dOpacity:0.5 },
  "outline-positive":{ bg:"transparent",text:T.green600,    border:T.green500,  hBg:T.green50,    dOpacity:0.4 },
  "outline-negative":{ bg:"transparent",text:T.red500,      border:T.red500,    hBg:T.red50,      dOpacity:0.4 },
  "text-secondary":  { bg:"transparent",text:T.gray800,     border:"transparent",hText:T.gray990,  dText:T.gray300,  isText:true },
  "text-brand":      { bg:"transparent",text:T.purple800,   border:"transparent",hText:T.purple700,dOpacity:0.4,     isText:true },
};

function Btn({ variant="solid-primary", size="lg", radius="sm", disabled=false, icon=false, children, style:extStyle }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const s = BTN_SIZE[size] || BTN_SIZE.lg;
  const v = BTN_STYLES[variant] || BTN_STYLES["solid-primary"];
  const br = BTN_RADIUS[radius] ?? 8;

  let bg     = v.bg     || "transparent";
  let text   = v.text   || T.gray990;
  let border = v.border || "transparent";
  let opacity = 1;

  if (disabled) {
    bg     = v.dBg     || v.bg     || "transparent";
    text   = v.dText   || v.text;
    border = v.dBorder || v.border || "transparent";
    opacity = v.dOpacity || 1;
  } else if (press) {
    bg     = v.aBg     || v.bg;
    text   = v.aText   || v.text;
  } else if (hov) {
    bg     = v.hBg     || v.bg;
    text   = v.hText   || v.text;
    border = v.hBorder || v.border || "transparent";
  }

  const px = v.isText ? 8 : s.px;

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        gap:4, border:`1px solid ${border}`, borderRadius: br,
        height: s.h, width: icon ? s.h : undefined,
        padding: icon ? 0 : `${s.py}px ${px}px`,
        fontSize:s.fs, lineHeight:`${s.lh}px`, fontWeight:500,
        fontFamily:"Pretendard, sans-serif", letterSpacing:0,
        background:bg, color:text, opacity,
        cursor:disabled ? "not-allowed" : "pointer",
        whiteSpace:"nowrap", userSelect:"none",
        transition:"background .15s, border-color .15s, color .15s",
        ...extStyle,
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BADGE (피그마 스펙 기반)
// ═══════════════════════════════════════════════════════════════════════════
const BADGE_SIZE = {
  Small:  { h:20, px:6, py:2, fs:12, lh:16 },
  Medium: { h:24, px:6, py:4, fs:12, lh:16 },
  Large:  { h:28, px:8, py:4, fs:14, lh:20 },
};
const BADGE_RADIUS = { Small:8, Large:9999 };

const BADGE_COLORS = {
  Solid: {
    Primary:    { bg:T.gray100,  text:T.strong },
    Secondary:  { bg:T.gray100,  text:T.gray800 },
    Brand:      { bg:T.dp100,    text:T.dp700 },
    Positive:   { bg:T.green50,  text:T.green500 },
    Negative:   { bg:T.red50,    text:T.red500 },
    Cautionary: { bg:T.yellow50, text:T.yellow400 },
    Info:       { bg:T.blue50,   text:T.blue500 },
  },
  Strong: {
    Primary:    { bg:T.gray950,    text:T.white },
    Secondary:  { bg:T.gray800,    text:T.white },
    Brand:      { bg:T.dp500,      text:T.white },
    Positive:   { bg:T.green600,   text:T.white },
    Negative:   { bg:T.red500,     text:T.white },
    Cautionary: { bg:T.yellow400,  text:T.strong },
    Info:       { bg:T.blue600,    text:T.white },
  },
  Outline: {
    Primary:    { border:T.gray200,  text:T.strong },
    Secondary:  { border:T.gray400,  text:T.gray800 },
    Brand:      { border:T.dp300,    text:T.dp600 },
    Positive:   { border:T.green500, text:T.green500 },
    Negative:   { border:T.red500,   text:T.red500 },
    Cautionary: { border:T.yellow400,text:T.yellow400 },
    Info:       { border:T.blue500,  text:T.blue500 },
  },
};

function Badge({ type="Solid", variant="Primary", size="Medium", radius="Small", text="텍스트", leadingIcon=false, trailingIcon=false }) {
  const s = BADGE_SIZE[size] || BADGE_SIZE.Medium;
  const r = BADGE_RADIUS[radius] ?? 8;
  const colors = (BADGE_COLORS[type] || BADGE_COLORS.Solid)[variant] || BADGE_COLORS.Solid.Primary;

  const isOutline = type === "Outline";
  const bg = isOutline ? "transparent" : (colors.bg || "transparent");
  const borderColor = isOutline ? (colors.border || T.gray200) : "transparent";

  return (
    <div style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      height:s.h, padding:`${s.py}px ${s.px}px`,
      background:bg,
      border: isOutline ? `1px solid ${borderColor}` : "1px solid transparent",
      borderRadius:r,
      overflow:"hidden",
      fontFamily:"Pretendard, sans-serif",
      boxSizing:"border-box",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:2, height:"100%" }}>
        {leadingIcon && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"2px 0" }}>
            <StarIcon size={size==="Large"?14:12} color={colors.text}/>
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{
            fontWeight:500, fontSize:s.fs, lineHeight:`${s.lh}px`,
            color:colors.text, whiteSpace:"nowrap", letterSpacing:0,
          }}>{text}</span>
        </div>
        {trailingIcon && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"2px 0" }}>
            <CloseIcon size={size==="Large"?12:10} color={colors.text}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CALLOUT
// ═══════════════════════════════════════════════════════════════════════════
const CALLOUT = {
  Primary:    { bg:T.gray50,     border:"transparent", icon:T.strong,   title:T.strong,   desc:T.gray800,  IconComp:InfoIcon },
  Secondary:  { bg:T.gray50,     border:"transparent", icon:T.gray800,  title:T.gray800,  desc:T.gray800,  IconComp:InfoIcon },
  Positive:   { bg:T.green50,    border:"transparent", icon:T.green500, title:T.green500, desc:T.gray800,  IconComp:CheckIcon },
  Negative:   { bg:T.red50,      border:"transparent", icon:T.red500,   title:T.red500,   desc:T.gray800,  IconComp:ErrorIcon },
  Cautionary: { bg:T.orange50,   border:"transparent", icon:T.orange,   title:T.orange,   desc:T.gray800,  IconComp:WarnIcon },
  Info:       { bg:T.blue50,     border:"transparent", icon:T.blue500,  title:T.blue500,  desc:T.gray800,  IconComp:InfoIcon },
  Brand:      { bg:T.purple50,   border:"transparent", icon:T.dp500,    title:T.dp500,    desc:T.gray800,  IconComp:StarAiIcon },
};
const CALLOUT_SZ = {
  Small:  { px:"12px", py:"10px", tsz:"13px", tlh:"18px", tw:500, dsz:"11px", dlh:"15px", dw:400, isz:14, gap:"6px" },
  Medium: { px:"12px", py:"14px", tsz:"14px", tlh:"20px", tw:600, dsz:"12px", dlh:"16px", dw:400, isz:16, gap:"8px" },
};

function Callout({ variant="Primary", size="Medium", title="텍스트를 입력해 주세요.", description="안내 텍스트를 입력해 주세요.", showDesc=true, showIcon=true, width=240 }) {
  const v = CALLOUT[variant] || CALLOUT.Primary;
  const s = CALLOUT_SZ[size] || CALLOUT_SZ.Medium;
  const Icon = v.IconComp;
  return (
    <div style={{ display:"flex", background:v.bg, border:`1px solid ${v.border!=="transparent"?v.border:"transparent"}`, borderRadius:8, padding:`${s.py} ${s.px}`, width, minWidth:200, boxSizing:"border-box", fontFamily:"Pretendard, sans-serif" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:s.gap, width:"100%" }}>
        {showIcon && <div style={{paddingTop:"2px"}}><Icon size={s.isz} color={v.icon}/></div>}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          <span style={{ fontSize:s.tsz, lineHeight:s.tlh, fontWeight:s.tw, color:v.title, wordBreak:"break-word" }}>{title}</span>
          {showDesc && <span style={{ fontSize:s.dsz, lineHeight:s.dlh, fontWeight:s.dw, color:v.desc, wordBreak:"break-word" }}>{description}</span>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHIP
// ═══════════════════════════════════════════════════════════════════════════
const CHIP_SZ = {
  "X-Small":{ h:"24px", px:"8px",  fs:"12px", lh:"16px", isz:10 },
  "Small":  { h:"32px", px:"10px", fs:"13px", lh:"18px", isz:12 },
  "Medium": { h:"36px", px:"12px", fs:"14px", lh:"20px", isz:14 },
  "Large":  { h:"40px", px:"14px", fs:"14px", lh:"20px", isz:14 },
};
function chipCol(type, state, disabled, active) {
  const solid = type==="Solid";
  if (disabled) return { bg:solid?T.gray100:"transparent", text:T.gray400, border:solid?"transparent":T.gray200 };
  if (active)   return { bg:solid?T.gray950:"transparent", text:solid?T.white:T.gray990, border:solid?"transparent":T.gray800 };
  if (state==="Hovered") return { bg:solid?T.gray200:T.gray50,  text:T.gray990, border:solid?"transparent":T.gray300 };
  if (state==="Pressed") return { bg:solid?T.gray300:T.gray100, text:T.gray990, border:solid?"transparent":T.gray300 };
  return { bg:solid?T.gray100:"transparent", text:T.gray800, border:solid?"transparent":T.gray200 };
}
function Chip({ type="Solid", size="Medium", disabled=false, active=false, label="텍스트", showTrailing=false, onClick, forceState }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const s = CHIP_SZ[size] || CHIP_SZ.Medium;
  let st = "Default";
  if (forceState) st = forceState;
  else if (press && !disabled && !active) st = "Pressed";
  else if (hov && !disabled && !active) st = "Hovered";
  const col = chipCol(type, st, disabled, active);
  return (
    <div onClick={!disabled?onClick:undefined}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPress(false);}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:4, height:s.h, padding:`0 ${s.px}`, background:col.bg, border:`1px solid ${col.border!=="transparent"?col.border:"transparent"}`, borderRadius:9999, fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:s.fs, lineHeight:s.lh, color:col.text, opacity:disabled?0.5:1, cursor:disabled?"not-allowed":"pointer", whiteSpace:"nowrap", userSelect:"none", boxSizing:"border-box", transition:"all .12s" }}>
      {label}
      {showTrailing && !disabled && <span style={{display:"flex",alignItems:"center",marginLeft:2}}><CloseIcon size={s.isz} color={col.text}/></span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB
// ═══════════════════════════════════════════════════════════════════════════
function TabItem({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ position:"relative", display:"flex", alignItems:"center", height:40, padding:"8px 0", cursor:"pointer", flexShrink:0, userSelect:"none" }}>
      <span style={{ fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:16, lineHeight:"24px", color:active?T.gray990:T.gray800, whiteSpace:"nowrap", transition:"color .15s" }}>{label}</span>
      {active && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:T.gray990, borderRadius:1 }}/>}
    </div>
  );
}
function TabBar({ tabs, activeIndex, onChange }) {
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", gap:24 }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:T.gray200 }}/>
      {tabs.map((t,i) => <TabItem key={i} label={t} active={activeIndex===i} onClick={()=>onChange(i)}/>)}
    </div>
  );
}
function ChipTabs({ tabs, activeIndex, onChange, size="Medium", type="Solid" }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      {tabs.map((t,i) => <Chip key={i} label={t} type={type} size={size} active={activeIndex===i} onClick={()=>onChange(i)}/>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function PillBtn({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:"4px 12px", borderRadius:9999, border:"none", cursor:"pointer", fontSize:12, fontFamily:"Pretendard, sans-serif", fontWeight:500, background:active?(color||T.gray990):T.gray100, color:active?T.white:T.gray990, transition:"all .15s" }}>{label}</button>
  );
}
function Toggle({ label, on, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:"5px 14px", borderRadius:9999, border:`1px solid ${on?T.gray990:T.gray200}`, background:on?T.gray990:T.white, color:on?T.white:T.gray800, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"Pretendard, sans-serif" }}>{on?"✓ ":""}{label}</button>
  );
}
function Card({ title, subtitle, children }) {
  return (
    <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:24, marginBottom:20 }}>
      <h2 style={{ fontSize:14, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>{title}</h2>
      {subtitle?<p style={{ fontSize:12, color:T.gray800, margin:"0 0 20px" }}>{subtitle}</p>:<div style={{marginBottom:20}}/>}
      {children}
    </div>
  );
}
function RowGroup({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>{label}</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{children}</div>
    </div>
  );
}
function Row({ children, wrap=false }) {
  return <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:wrap?"wrap":"nowrap", marginBottom:12 }}>{children}</div>;
}
function Col({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
      {label && <span style={{ fontSize:11, color:T.gray800, fontWeight:400 }}>{label}</span>}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════
const CALLOUT_KEYS = Object.keys(CALLOUT);
const CHIP_SIZE_KEYS = ["X-Small","Small","Medium","Large"];
const CHIP_TYPES = ["Solid","Outline"];
const BADGE_VARIANT_KEYS = ["Primary","Secondary","Brand","Positive","Negative","Cautionary","Info"];
const BADGE_TYPE_KEYS = ["Solid","Outline","Strong"];
const BADGE_SIZE_KEYS = ["Small","Medium","Large"];
const BADGE_RADIUS_KEYS = ["Small","Large"];
const VARIANT_ACCENT = { Primary:T.gray990, Secondary:T.gray800, Brand:T.dp600, Positive:T.green600, Negative:T.red500, Info:T.blue500, Cautionary:T.orange };

const th = { padding:"8px 14px", textAlign:"left", fontSize:12, fontWeight:600, color:"#7B7E85", borderBottom:"1px solid #E6E7E9", whiteSpace:"nowrap" };
const td = { padding:"10px 14px", borderBottom:"1px solid #F0F0F2", verticalAlign:"middle" };

export default function App() {
  const [page, setPage] = useState("button");

  // button
  const [btnVariant, setBtnVariant] = useState("solid-primary");
  const [btnSize, setBtnSize] = useState("lg");
  const [btnRadius, setBtnRadius] = useState("sm");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnIcon, setBtnIcon] = useState(false);

  // badge
  const [badgeType, setBadgeType] = useState("Solid");
  const [badgeVariant, setBadgeVariant] = useState("Primary");
  const [badgeSize, setBadgeSize] = useState("Medium");
  const [badgeRadius, setBadgeRadius] = useState("Small");
  const [badgeText, setBadgeText] = useState("텍스트");
  const [badgeLeading, setBadgeLeading] = useState(false);
  const [badgeTrailing, setBadgeTrailing] = useState(false);

  // tab
  const [tabItems] = useState(["홈","소개","서비스","포트폴리오","문의"]);
  const [activeTab, setActiveTab] = useState(0);
  const [chipTabItems] = useState(["전체","디자인","개발","마케팅"]);
  const [activeChipTab, setActiveChipTab] = useState(0);
  const [chipTabSize, setChipTabSize] = useState("Medium");
  const [chipTabType, setChipTabType] = useState("Solid");

  // callout
  const [cVariant, setCVariant] = useState("Primary");
  const [cSize, setCSize] = useState("Medium");
  const [cTitle, setCTitle] = useState("텍스트를 입력해 주세요.");
  const [cDesc, setCDesc] = useState("안내 텍스트를 입력해 주세요.");
  const [cShowDesc, setCShowDesc] = useState(true);
  const [cShowIcon, setCShowIcon] = useState(true);

  // typography
  const [selWeight, setSelWeight] = useState(500);
  const [iconSize, setIconSize] = useState(24);

  // chip
  const [chipType, setChipType] = useState("Solid");
  const [chipSize, setChipSize] = useState("Medium");
  const [chipLabel, setChipLabel] = useState("텍스트");
  const [chipActive, setChipActive] = useState(false);
  const [chipDisabled, setChipDisabled] = useState(false);
  const [chipTrailing, setChipTrailing] = useState(false);

  const PAGES = ["button","badge","callout","chip","tab","icons","typography","charts"];
  const PAGE_LABELS = { button:"Button", badge:"Badge", callout:"Callout", chip:"Chip", tab:"Tab", icons:"Icons", typography:"Typography", charts:"Charts" };
  const BTN_VARIANTS = Object.keys(BTN_STYLES);
  const RADII = ["sm","md","full"];
  const SIZES_BTN = ["lg","md","sm"];

  return (
    <div style={{ minHeight:"100vh", background:T.gray50, fontFamily:"Pretendard, sans-serif", boxSizing:"border-box" }}>

      {/* Top Nav */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.gray200}`, padding:"0 24px", display:"flex", alignItems:"center", gap:0, position:"sticky", top:0, zIndex:10 }}>
        <span style={{ fontSize:13, fontWeight:700, color:T.gray990, marginRight:24, padding:"12px 0", flexShrink:0 }}>CUBIG DS</span>
        {PAGES.map(p => (
          <button key={p} onClick={()=>setPage(p)} style={{ height:44, padding:"0 16px", border:"none", background:"none", cursor:"pointer", fontFamily:"Pretendard, sans-serif", fontWeight:500, fontSize:14, color:page===p?T.gray990:T.gray800, borderBottom:page===p?`2px solid ${T.gray990}`:"2px solid transparent", transition:"all .15s" }}>
            {PAGE_LABELS[p]}
          </button>
        ))}
      </div>

      <div style={{ padding:"28px 24px", maxWidth:960, margin:"0 auto" }}>

        {/* ══ BUTTON ══ */}
        {page==="button" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Button</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Solid · Outline · Text · Icon 버튼 컴포넌트입니다.</p>
          </div>

          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:110 }}>
            <Btn variant={btnVariant} size={btnSize} radius={btnRadius} disabled={btnDisabled} icon={btnIcon}>
              {btnIcon ? <PlusIcon size={btnSize==="sm"?16:btnSize==="md"?20:24}/> : "텍스트"}
            </Btn>
          </div>
          <Card title="Button 커스텀">
            <RowGroup label="Variant">
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {BTN_VARIANTS.map(v => <PillBtn key={v} label={v} active={btnVariant===v} onClick={()=>setBtnVariant(v)}/>)}
              </div>
            </RowGroup>
            <RowGroup label="Size">
              {SIZES_BTN.map(s => <PillBtn key={s} label={s.toUpperCase()} active={btnSize===s} onClick={()=>setBtnSize(s)}/>)}
            </RowGroup>
            <RowGroup label="Radius">
              {RADII.map(r => <PillBtn key={r} label={r} active={btnRadius===r} onClick={()=>setBtnRadius(r)}/>)}
            </RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Disabled" on={btnDisabled} onClick={()=>setBtnDisabled(p=>!p)}/>
              <Toggle label="Icon Only" on={btnIcon} onClick={()=>setBtnIcon(p=>!p)}/>
            </div>
          </Card>

          <Card title="Solid">
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 16px" }}>Primary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-primary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-primary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-primary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-primary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius MD"><Btn variant="solid-primary" size="lg" radius="md">텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-primary" size="lg" radius="full">텍스트</Btn></Col></Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>Secondary</p>
            <Row wrap><Col label="Large"><Btn variant="solid-secondary" size="lg">텍스트</Btn></Col><Col label="Medium"><Btn variant="solid-secondary" size="md">텍스트</Btn></Col><Col label="Small"><Btn variant="solid-secondary" size="sm">텍스트</Btn></Col><Col label="Disabled"><Btn variant="solid-secondary" size="lg" disabled>텍스트</Btn></Col><Col label="Radius Full"><Btn variant="solid-secondary" size="lg" radius="full">텍스트</Btn></Col></Row>
            <p style={{ fontSize:12, color:T.gray800, margin:"12px 0 16px" }}>Brand / Positive / Negative / Tertiary</p>
            <Row wrap><Col label="Brand"><Btn variant="solid-brand" size="lg">텍스트</Btn></Col><Col label="Positive"><Btn variant="solid-positive" size="lg">텍스트</Btn></Col><Col label="Negative"><Btn variant="solid-negative" size="lg">텍스트</Btn></Col><Col label="Tertiary"><Btn variant="solid-tertiary" size="lg">텍스트</Btn></Col><Col label="Brand disabled"><Btn variant="solid-brand" size="lg" disabled>텍스트</Btn></Col><Col label="Positive disabled"><Btn variant="solid-positive" size="lg" disabled>텍스트</Btn></Col><Col label="Negative disabled"><Btn variant="solid-negative" size="lg" disabled>텍스트</Btn></Col></Row>
          </Card>

          <Card title="Outline">
            <Row wrap>
              <Col label="Primary"><Btn variant="outline-primary" size="lg">텍스트</Btn></Col>
              <Col label="Brand"><Btn variant="outline-brand" size="lg">텍스트</Btn></Col>
              <Col label="Positive"><Btn variant="outline-positive" size="lg">텍스트</Btn></Col>
              <Col label="Negative"><Btn variant="outline-negative" size="lg">텍스트</Btn></Col>
              <Col label="Primary disabled"><Btn variant="outline-primary" size="lg" disabled>텍스트</Btn></Col>
              <Col label="Brand disabled"><Btn variant="outline-brand" size="lg" disabled>텍스트</Btn></Col>
            </Row>
            <Row wrap>
              <Col label="MD"><Btn variant="outline-primary" size="md">텍스트</Btn></Col>
              <Col label="SM"><Btn variant="outline-primary" size="sm">텍스트</Btn></Col>
              <Col label="Radius MD"><Btn variant="outline-primary" size="lg" radius="md">텍스트</Btn></Col>
              <Col label="Radius Full"><Btn variant="outline-brand" size="lg" radius="full">텍스트</Btn></Col>
            </Row>
          </Card>

          <Card title="Text">
            <Row wrap>
              <Col label="Secondary LG"><Btn variant="text-secondary" size="lg">텍스트</Btn></Col>
              <Col label="Secondary MD"><Btn variant="text-secondary" size="md">텍스트</Btn></Col>
              <Col label="Secondary SM"><Btn variant="text-secondary" size="sm">텍스트</Btn></Col>
              <Col label="Brand"><Btn variant="text-brand" size="lg">텍스트</Btn></Col>
              <Col label="Disabled"><Btn variant="text-secondary" size="lg" disabled>텍스트</Btn></Col>
            </Row>
          </Card>

          <Card title="아이콘 포함">
            <Row wrap>
              <Col label="Leading"><Btn variant="solid-primary" size="lg"><PlusIcon size={20}/>추가하기</Btn></Col>
              <Col label="Trailing"><Btn variant="solid-secondary" size="lg">다운로드<DownIcon size={20}/></Btn></Col>
              <Col label="Both"><Btn variant="solid-brand" size="lg"><PlusIcon size={20}/>예약하기<ChevronR size={16}/></Btn></Col>
              <Col label="Outline+icon"><Btn variant="outline-primary" size="md"><PlusIcon size={16}/>추가</Btn></Col>
            </Row>
          </Card>

          <Card title="아이콘 전용">
            <Row wrap>
              <Col label="Primary LG"><Btn variant="solid-primary" size="lg" icon><PlusIcon size={24}/></Btn></Col>
              <Col label="Secondary MD"><Btn variant="solid-secondary" size="md" icon><PlusIcon size={20}/></Btn></Col>
              <Col label="Brand SM"><Btn variant="solid-brand" size="sm" icon><PlusIcon size={16}/></Btn></Col>
              <Col label="Outline LG"><Btn variant="outline-primary" size="lg" icon radius="md"><PlusIcon size={24}/></Btn></Col>
              <Col label="Negative SM"><Btn variant="solid-negative" size="sm" icon><CloseIcon size={14} color={T.white}/></Btn></Col>
            </Row>
          </Card>

          <div style={{ background:T.gray990, borderRadius:12, padding:20, display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn variant="solid-secondary" size="lg">Secondary</Btn>
            <Btn variant="outline-primary" size="lg" style={{ color:T.white, borderColor:T.gray800 }}>Outline</Btn>
            <Btn variant="solid-brand" size="lg">Brand</Btn>
            <Btn variant="text-secondary" size="lg" style={{ color:"#A2A4AA" }}>Text</Btn>
          </div>
        </>}

        {/* ══ BADGE ══ */}
        {page==="badge" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Badge</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Solid · Outline · Strong 타입의 라벨/상태 표시 컴포넌트입니다.</p>
          </div>

          {/* Preview */}
          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:100 }}>
            <Badge type={badgeType} variant={badgeVariant} size={badgeSize} radius={badgeRadius} text={badgeText||"텍스트"} leadingIcon={badgeLeading} trailingIcon={badgeTrailing}/>
          </div>

          <Card title="Badge 커스텀">
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>Text</p>
              <input value={badgeText} onChange={e=>setBadgeText(e.target.value)} style={{ border:`1px solid ${T.gray200}`, borderRadius:8, padding:"6px 12px", fontSize:14, fontFamily:"Pretendard, sans-serif", outline:"none", color:T.gray990, width:200 }}/>
            </div>
            <RowGroup label="Type">{BADGE_TYPE_KEYS.map(v=><PillBtn key={v} label={v} active={badgeType===v} onClick={()=>setBadgeType(v)}/>)}</RowGroup>
            <RowGroup label="Variant">{BADGE_VARIANT_KEYS.map(v=><PillBtn key={v} label={v} active={badgeVariant===v} color={VARIANT_ACCENT[v]} onClick={()=>setBadgeVariant(v)}/>)}</RowGroup>
            <RowGroup label="Size">{BADGE_SIZE_KEYS.map(v=><PillBtn key={v} label={v} active={badgeSize===v} onClick={()=>setBadgeSize(v)}/>)}</RowGroup>
            <RowGroup label="Radius">{BADGE_RADIUS_KEYS.map(v=><PillBtn key={v} label={v} active={badgeRadius===v} onClick={()=>setBadgeRadius(v)}/>)}</RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Leading Icon" on={badgeLeading} onClick={()=>setBadgeLeading(p=>!p)}/>
              <Toggle label="Trailing Icon" on={badgeTrailing} onClick={()=>setBadgeTrailing(p=>!p)}/>
            </div>
          </Card>

          {/* Solid */}
          <Card title="Solid" subtitle="연한 배경 + 컬러 텍스트">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Variant","Small","Medium","Large","Radius Large","With Icons"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{BADGE_VARIANT_KEYS.map(v=>(
                  <tr key={v}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{v}</td>
                    <td style={td}><Badge type="Solid" variant={v} size="Small"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Medium"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Large"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Medium" radius="Large"/></td>
                    <td style={td}><Badge type="Solid" variant={v} size="Medium" leadingIcon trailingIcon/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>

          {/* Strong */}
          <Card title="Strong" subtitle="진한 배경 + 흰 텍스트">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Variant","Small","Medium","Large","Radius Large","With Icons"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{BADGE_VARIANT_KEYS.map(v=>(
                  <tr key={v}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{v}</td>
                    <td style={td}><Badge type="Strong" variant={v} size="Small"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Medium"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Large"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Medium" radius="Large"/></td>
                    <td style={td}><Badge type="Strong" variant={v} size="Medium" leadingIcon trailingIcon/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>

          {/* Outline */}
          <Card title="Outline" subtitle="테두리만 + 컬러 텍스트">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Variant","Small","Medium","Large","Radius Large","With Icons"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{BADGE_VARIANT_KEYS.map(v=>(
                  <tr key={v}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{v}</td>
                    <td style={td}><Badge type="Outline" variant={v} size="Small"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Medium"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Large"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Medium" radius="Large"/></td>
                    <td style={td}><Badge type="Outline" variant={v} size="Medium" leadingIcon trailingIcon/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ══ CALLOUT ══ */}
        {page==="callout" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Callout</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>안내 메시지를 표시하는 컴포넌트입니다.</p>
          </div>
          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:110 }}>
            <Callout variant={cVariant} size={cSize} title={cTitle} description={cDesc} showDesc={cShowDesc} showIcon={cShowIcon}/>
          </div>
          <Card title="Callout 커스텀">
            {[["Title",cTitle,setCTitle],["Description",cDesc,setCDesc]].map(([fl,fv,fs])=>(
              <div key={fl} style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>{fl}</p>
                <input value={fv} onChange={e=>fs(e.target.value)} style={{ border:`1px solid ${T.gray200}`, borderRadius:8, padding:"6px 12px", fontSize:14, fontFamily:"Pretendard, sans-serif", outline:"none", color:T.gray990, width:"100%", maxWidth:360, boxSizing:"border-box" }}/>
              </div>
            ))}
            <RowGroup label="Size">{["Small","Medium"].map(v=><PillBtn key={v} label={v} active={cSize===v} onClick={()=>setCSize(v)}/>)}</RowGroup>
            <RowGroup label="Variant">{CALLOUT_KEYS.map(v=><PillBtn key={v} label={v} active={cVariant===v} color={VARIANT_ACCENT[v]} onClick={()=>setCVariant(v)}/>)}</RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Description" on={cShowDesc} onClick={()=>setCShowDesc(p=>!p)}/>
              <Toggle label="Leading Icon" on={cShowIcon} onClick={()=>setCShowIcon(p=>!p)}/>
            </div>
          </Card>
          <Card title="Variant × Size (전체)">
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {CALLOUT_KEYS.map(v=>(
                <div key={v} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <span style={{ fontSize:11, color:T.gray800, fontWeight:600 }}>{v}</span>
                  {["Small","Medium"].map(s=><Callout key={s} variant={v} size={s} title="텍스트를 입력해 주세요." description="안내 텍스트를 입력해 주세요." showDesc showIcon={cShowIcon} width={220}/>)}
                </div>
              ))}
            </div>
          </Card>
        </>}

        {/* ══ CHIP ══ */}
        {page==="chip" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Chip</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>클릭 가능한 선택·필터 컴포넌트입니다.</p>
          </div>
          <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.gray200}`, padding:"40px 24px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", minHeight:100 }}>
            <Chip type={chipType} size={chipSize} disabled={chipDisabled} active={chipActive} label={chipLabel||"텍스트"} showTrailing={chipTrailing}/>
          </div>
          <Card title="Chip 커스텀">
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, color:T.gray800, margin:"0 0 8px", fontWeight:500 }}>Label</p>
              <input value={chipLabel} onChange={e=>setChipLabel(e.target.value)} style={{ border:`1px solid ${T.gray200}`, borderRadius:8, padding:"6px 12px", fontSize:14, fontFamily:"Pretendard, sans-serif", outline:"none", color:T.gray990, width:200 }}/>
            </div>
            <RowGroup label="Type">{CHIP_TYPES.map(v=><PillBtn key={v} label={v} active={chipType===v} onClick={()=>setChipType(v)}/>)}</RowGroup>
            <RowGroup label="Size">{CHIP_SIZE_KEYS.map(v=><PillBtn key={v} label={v} active={chipSize===v} onClick={()=>setChipSize(v)}/>)}</RowGroup>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Toggle label="Active" on={chipActive} onClick={()=>setChipActive(p=>!p)}/>
              <Toggle label="Disabled" on={chipDisabled} onClick={()=>setChipDisabled(p=>!p)}/>
              <Toggle label="Trailing ×" on={chipTrailing} onClick={()=>setChipTrailing(p=>!p)}/>
            </div>
          </Card>
          <Card title="Solid Chip" subtitle="Default · Hovered · Pressed · Active · Disabled">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Size","Default","Hovered","Pressed","Active","Disabled"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{CHIP_SIZE_KEYS.map(sz=>(
                  <tr key={sz}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{sz}</td>
                    <td style={td}><Chip type="Solid" size={sz} label={chipLabel||"텍스트"} forceState="Default"/></td>
                    <td style={td}><Chip type="Solid" size={sz} label={chipLabel||"텍스트"} forceState="Hovered"/></td>
                    <td style={td}><Chip type="Solid" size={sz} label={chipLabel||"텍스트"} forceState="Pressed"/></td>
                    <td style={td}><Chip type="Solid" size={sz} label={chipLabel||"텍스트"} active/></td>
                    <td style={td}><Chip type="Solid" size={sz} label={chipLabel||"텍스트"} disabled/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
          <Card title="Outline Chip" subtitle="Default · Hovered · Pressed · Active · Disabled">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Size","Default","Hovered","Pressed","Active","Disabled"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{CHIP_SIZE_KEYS.map(sz=>(
                  <tr key={sz}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{sz}</td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} forceState="Default"/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} forceState="Hovered"/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} forceState="Pressed"/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} active/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} disabled/></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ══ TAB ══ */}
        {page==="tab" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Tab</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Tab Bar와 Chip Tabs 두 가지 탭 패턴입니다.</p>
          </div>
          <Card title="Tab Bar" subtitle="탭을 클릭해 보세요.">
            <TabBar tabs={tabItems} activeIndex={activeTab} onChange={setActiveTab}/>
            <div style={{ marginTop:20, padding:14, background:T.gray50, borderRadius:8, fontSize:14, color:T.gray990 }}>선택된 탭: <strong>{tabItems[activeTab]}</strong></div>
          </Card>
          <Card title="Chip Tabs">
            <RowGroup label="Size">{CHIP_SIZE_KEYS.map(s=><PillBtn key={s} label={s} active={chipTabSize===s} onClick={()=>setChipTabSize(s)}/>)}</RowGroup>
            <RowGroup label="Type">{CHIP_TYPES.map(t=><PillBtn key={t} label={t} active={chipTabType===t} onClick={()=>setChipTabType(t)}/>)}</RowGroup>
            <ChipTabs tabs={chipTabItems} activeIndex={activeChipTab} onChange={setActiveChipTab} size={chipTabSize} type={chipTabType}/>
            <div style={{ marginTop:16, padding:14, background:T.gray50, borderRadius:8, fontSize:14, color:T.gray990 }}>선택된 항목: <strong>{chipTabItems[activeChipTab]}</strong></div>
          </Card>
        </>}

        {/* ══ ICONS ══ */}
        {page==="icons" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Icons</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>리포트 및 컴포넌트에 사용되는 아이콘입니다.</p>
          </div>

          {(() => {
            const ICON_LIST = [
              { name:"Info", C:InfoIcon },
              { name:"CircleCheck", C:CheckIcon },
              { name:"Error", C:ErrorIcon },
              { name:"Warning", C:WarnIcon },
              { name:"Cancel", C:CancelIcon },
              { name:"Star AI", C:StarAiIcon },
              { name:"Database", C:DatabaseIcon },
              { name:"Person", C:PersonIcon },
              { name:"Identity", C:IdentityIcon },
            ];
            return <>
              <Card title="All Icons" subtitle="사이즈 필터로 16 · 20 · 24px 확인">
                <div style={{ display:"flex", gap:6, marginBottom:20 }}>
                  {[16,20,24].map(sz=>(
                    <button key={sz} onClick={()=>setIconSize(sz)} style={{
                      padding:"4px 14px", borderRadius:9999, border:"none", cursor:"pointer",
                      fontSize:12, fontWeight:500, fontFamily:"Pretendard, sans-serif",
                      background:iconSize===sz?T.gray990:T.gray100,
                      color:iconSize===sz?T.white:T.gray990,
                    }}>{sz}px</button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                  {ICON_LIST.map(item=>(
                    <div key={item.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, minWidth:80 }}>
                      <div style={{ width:48, height:48, borderRadius:12, background:T.gray50, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <item.C size={iconSize} color={T.gray990}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, color:T.gray990 }}>{item.name}</span>
                      <span style={{ fontSize:10, color:T.gray800 }}>{iconSize}px</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="컬러 변형" subtitle="아이콘 색상은 컨텍스트에 따라 변경">
                <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                  {[
                    { label:"Default", color:T.gray990 },
                    { label:"Alternative", color:T.gray800 },
                    { label:"Brand", color:T.dp500 },
                    { label:"Positive", color:T.green500 },
                    { label:"Negative", color:T.red500 },
                    { label:"Info", color:T.blue500 },
                    { label:"Cautionary", color:T.orange },
                  ].map(c=>(
                    <div key={c.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div style={{ display:"flex", gap:8 }}>
                        {ICON_LIST.slice(0,6).map(ic=><ic.C key={ic.name} size={20} color={c.color}/>)}
                      </div>
                      <span style={{ fontSize:11, color:T.gray800 }}>{c.label}</span>
                      <code style={{ fontSize:10, color:T.gray800, background:T.gray50, padding:"1px 4px", borderRadius:3 }}>{c.color}</code>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="UI Icons" subtitle="버튼/칩 등에 사용되는 아이콘 (stroke 스타일)">
                <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
                  {[
                    { name:"Plus", icon:<PlusIcon size={24}/> },
                    { name:"Download", icon:<DownIcon size={24}/> },
                    { name:"Chevron Right", icon:<ChevronR size={24}/> },
                    { name:"Close", icon:<CloseIcon size={24} color={T.gray990}/> },
                  ].map(item=>(
                    <div key={item.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, minWidth:80 }}>
                      <div style={{ width:48, height:48, borderRadius:12, background:T.gray50, display:"flex", alignItems:"center", justifyContent:"center", color:T.gray990 }}>{item.icon}</div>
                      <span style={{ fontSize:13, fontWeight:600, color:T.gray990 }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>;
          })()}
        </>}

        {/* ══ TYPOGRAPHY ══ */}
        {page==="typography" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Typography</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>Pretendard 폰트 기반 타이포그래피 스케일입니다.</p>
          </div>

          {(() => {
            const TYPO_SCALE = [
              { name:"Display 5", token:"t17", size:80, lh:88, ls:-0.5 },
              { name:"Display 4", token:"t16", size:64, lh:80, ls:-0.5 },
              { name:"Display 3", token:"t15", size:56, lh:72, ls:-0.5 },
              { name:"Display 2", token:"t14", size:48, lh:64, ls:-0.5 },
              { name:"Display 1", token:"t13", size:40, lh:52, ls:-0.5 },
              { name:"Title 4",   token:"t12", size:36, lh:48, ls:-0.5 },
              { name:"Title 3",   token:"t11", size:32, lh:42, ls:-0.5 },
              { name:"Title 2",   token:"t10", size:28, lh:40, ls:0 },
              { name:"Title 1",   token:"t9",  size:24, lh:34, ls:0 },
              { name:"Heading 3", token:"t8",  size:22, lh:30, ls:0 },
              { name:"Heading 2", token:"t7",  size:20, lh:28, ls:0 },
              { name:"Heading 1", token:"t6",  size:18, lh:26, ls:0 },
              { name:"Body 3",    token:"t5",  size:16, lh:24, ls:0 },
              { name:"Body 2",    token:"t4",  size:14, lh:20, ls:0 },
              { name:"Body 1",    token:"t3",  size:13, lh:18, ls:0 },
              { name:"Caption 2", token:"t2",  size:12, lh:16, ls:0 },
              { name:"Caption 1", token:"t1",  size:11, lh:14, ls:0 },
            ];
            const WEIGHTS = [
              { label:"Regular", value:400 },
              { label:"Medium", value:500 },
              { label:"SemiBold", value:600 },
              { label:"Bold", value:700 },
            ];
            return <>
              {/* Spec Table */}
              <Card title="타이포 스케일" subtitle="17단계 · 4 weights · Pretendard">
                <div style={{ display:"flex", gap:6, marginBottom:20 }}>
                  {WEIGHTS.map(w=>(
                    <button key={w.value} onClick={()=>setSelWeight(w.value)} style={{
                      padding:"4px 14px", borderRadius:9999, border:"none", cursor:"pointer",
                      fontSize:12, fontWeight:500, fontFamily:"Pretendard, sans-serif",
                      background:selWeight===w.value?T.gray990:T.gray100,
                      color:selWeight===w.value?T.white:T.gray990,
                    }}>{w.label} ({w.value})</button>
                  ))}
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ borderCollapse:"collapse", width:"100%" }}>
                    <thead><tr>{["Name","Token","Size","Line-Height","Tracking","Preview"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                    <tbody>{TYPO_SCALE.map(t=>(
                      <tr key={t.token}>
                        <td style={{...td,fontSize:13,fontWeight:600,color:T.gray990}}>{t.name}</td>
                        <td style={{...td,fontSize:12,color:T.gray800}}><code style={{background:T.gray50,padding:"1px 4px",borderRadius:3,fontSize:11}}>{t.token}</code></td>
                        <td style={{...td,fontSize:12,color:T.gray800}}>{t.size}px</td>
                        <td style={{...td,fontSize:12,color:T.gray800}}>{t.lh}px</td>
                        <td style={{...td,fontSize:12,color:T.gray800}}>{t.ls}px</td>
                        <td style={{...td,maxWidth:400,overflow:"hidden"}}>
                          <span style={{
                            fontFamily:"Pretendard, sans-serif",
                            fontSize: Math.min(t.size, 40),
                            fontWeight: selWeight,
                            lineHeight: `${t.lh}px`,
                            letterSpacing: `${t.ls}px`,
                            color: T.gray990,
                            whiteSpace:"nowrap",
                          }}>{t.name}</span>
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </Card>

              {/* Full Preview */}
              <Card title="프리뷰" subtitle="실제 크기로 렌더링 (큰 사이즈는 축소 표시)">
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {TYPO_SCALE.map(t=>(
                    <div key={t.token} style={{ display:"flex", alignItems:"baseline", gap:20, padding:"8px 0", borderBottom:`1px solid ${T.gray100}` }}>
                      <span style={{ fontSize:11, color:T.gray800, minWidth:80, flexShrink:0 }}>{t.name}</span>
                      <span style={{ fontSize:11, color:T.gray400, minWidth:50, flexShrink:0 }}>{t.size}/{t.lh}</span>
                      <span style={{
                        fontFamily:"Pretendard, sans-serif",
                        fontSize: t.size,
                        fontWeight: selWeight,
                        lineHeight: `${t.lh}px`,
                        letterSpacing: `${t.ls}px`,
                        color: T.gray990,
                        whiteSpace:"nowrap",
                        overflow:"hidden",
                        textOverflow:"ellipsis",
                        maxWidth:"100%",
                      }}>
                        {t.size >= 40 ? t.name : `${t.name} / ${WEIGHTS.find(w=>w.value===selWeight)?.label}`}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </>;
          })()}
        </>}

        {/* ══ CHARTS ══ */}
        {page==="charts" && <>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:12, color:T.gray800, margin:"0 0 2px" }}>CUBIG Design System</p>
            <h1 style={{ fontSize:20, fontWeight:700, color:T.gray990, margin:"0 0 4px" }}>Charts (Nivo)</h1>
            <p style={{ fontSize:13, color:T.gray800 }}>리포트에 사용되는 Nivo 기반 차트 컴포넌트입니다.</p>
          </div>

          {/* Color Palette */}
          <Card title="Chart 색상 팔레트" subtitle="데이터 시리즈에 순서대로 적용">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              {["Blue 500","Lime 500","DeepPurple 400","Blue 300","Teal 500","Yellow 400"].map((name,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background:T.white, border:`1px solid ${T.gray200}`, borderRadius:8 }}>
                  <div style={{ width:16, height:16, borderRadius:4, background:CHART_COLORS[i] }}/>
                  <span style={{ fontSize:12, color:T.gray990, fontWeight:500 }}>{i+1}번</span>
                  <span style={{ fontSize:11, color:T.gray800 }}>{name}</span>
                  <code style={{ fontSize:11, color:T.gray800, background:T.gray50, padding:"1px 4px", borderRadius:3 }}>{CHART_COLORS[i]}</code>
                </div>
              ))}
            </div>
          </Card>

          {/* Donut */}
          <Card title="Donut Chart" subtitle="원그래프 - 비율 표시에 적합">
            <div style={{ display:"flex", gap:40, flexWrap:"wrap" }}>
              <DonutChart
                title="Response Rate by Age Group"
                data={[
                  { id:"Age 15-19", value:1200 },
                  { id:"Age 20-24", value:360 },
                  { id:"Age 25-29", value:450 },
                  { id:"Age 30-39", value:240 },
                  { id:"Age 40-49", value:750 },
                  { id:"Age 50-59", value:240 },
                ]}
              />
              <DonutChart
                title="Response Distribution by Gender"
                data={[
                  { id:"Male", value:2800 },
                  { id:"Female", value:2200 },
                ]}
              />
            </div>
          </Card>

          {/* Horizontal Bar */}
          <Card title="Horizontal Bar" subtitle="가로 막대 - 카테고리 비교에 적합">
            <HBarChart
              title="Satisfaction Level Distribution"
              maxValue={100}
              data={[
                { label:"Very High", value:32, count:9999 },
                { label:"High", value:30, count:9999 },
                { label:"Medium", value:20, count:123 },
                { label:"Low", value:12, count:99 },
                { label:"Very Low", value:6, count:30 },
              ]}
            />
          </Card>

          {/* Grouped Bar (Nivo) */}
          <Card title="Grouped Bar" subtitle="그룹형 세로 막대 - 여러 시리즈 비교">
            <GroupedBarChart
              title="Cluster Comparison"
              data={[
                { label:"Q1", revenue:120, cost:80, profit:40 },
                { label:"Q2", revenue:180, cost:95, profit:85 },
                { label:"Q3", revenue:220, cost:110, profit:110 },
                { label:"Q4", revenue:280, cost:130, profit:150 },
              ]}
              keys={["revenue","cost","profit"]}
            />
          </Card>

          {/* Stacked Bar (Nivo) */}
          <Card title="Stacked Bar" subtitle="스택형 세로 막대 - 구성비 누적">
            <GroupedBarChart
              title="Revenue Breakdown"
              stacked
              data={[
                { label:"Q1", product:60, service:35, other:25 },
                { label:"Q2", product:80, service:55, other:45 },
                { label:"Q3", product:90, service:70, other:60 },
                { label:"Q4", product:110, service:90, other:80 },
              ]}
              keys={["product","service","other"]}
            />
          </Card>

          {/* Stacked Horizontal Bar */}
          <Card title="Stacked Horizontal Bar" subtitle="100% 누적 막대 - 구성비 비교">
            <StackedHBar
              title="Feature Importance by Segment"
              data={[
                { label:"Concerns about company size", seg1:30, seg2:45, seg3:15, seg4:10 },
                { label:"Interest in premium features", seg1:20, seg2:35, seg3:25, seg4:20 },
              ]}
              keys={["seg1","seg2","seg3","seg4"]}
              keyLabels={{ seg1:"Premium", seg2:"Value", seg3:"Dormant", seg4:"Occasional" }}
            />
          </Card>

          {/* Vertical Bar */}
          <Card title="Vertical Bar" subtitle="세로 막대 - 클러스터/시나리오 비교 (2~5개 필터)">
            <VBarChart
              title="Period Avg Churn Rate"
              data={[
                { label:"Premium Enthusiasts", value:90 },
                { label:"Dormant Potential", value:100 },
                { label:"Value Optimizers", value:80 },
                { label:"Occasional Buyers", value:60 },
                { label:"New Users", value:45 },
              ]}
            />
          </Card>

          {/* Line / Area - Blue */}
          <Card title="Line / Area Chart (Blue)" subtitle="블루 라인 차트 - 시계열 추이">
            <LineChart
              title="Monthly Revenue Trend"
              variant="blue"
              enableArea
              data={[{
                id: "Revenue",
                data: [
                  { x:"2024-01", y:1200 },
                  { x:"2024-02", y:1800 },
                  { x:"2024-03", y:2400 },
                  { x:"2024-04", y:3200 },
                  { x:"2024-05", y:2800 },
                  { x:"2024-06", y:3600 },
                ],
              }]}
            />
          </Card>

          {/* Line / Area - Red */}
          <Card title="Line / Area Chart (Red)" subtitle="레드 라인 차트 - 위험 지표 추이">
            <LineChart
              title="Churn Rate Trend"
              variant="red"
              enableArea
              data={[{
                id: "Churn Rate",
                data: [
                  { x:"2024-01", y:5 },
                  { x:"2024-02", y:8 },
                  { x:"2024-03", y:12 },
                  { x:"2024-04", y:18 },
                  { x:"2024-05", y:22 },
                  { x:"2024-06", y:28 },
                ],
              }]}
            />
          </Card>

          {/* Radar */}
          <Card title="Radar Chart" subtitle="레이더 차트 - 다차원 지표 비교">
            <RadarChart
              title="Data Quality Score"
              data={[
                { category:"Privacy", score:85 },
                { category:"Traceability", score:72 },
                { category:"Operational\nReliability", score:68 },
                { category:"Conciseness", score:90 },
                { category:"Contextuality", score:78 },
                { category:"Integrity", score:82 },
              ]}
              keys={["score"]}
            />
          </Card>

          {/* PSM Chart */}
          <Card title="PSM Chart" subtitle="가격 수요 곡선 - 교차점 기반 최적 가격 분석">
            <PSMChart
              title="PSM 가격 수요 곡선 기반 주요 교차점 그래프"
              data={[
                { id:"Too Cheap", data:[{x:900,y:85},{x:1000,y:75},{x:1100,y:60},{x:1200,y:48},{x:1300,y:35},{x:1400,y:25},{x:1500,y:18},{x:1600,y:12},{x:1700,y:8},{x:1800,y:5},{x:1900,y:3},{x:2000,y:2},{x:2100,y:1},{x:2200,y:0.5},{x:2300,y:0},{x:2500,y:0},{x:2700,y:0}] },
                { id:"Cheap", data:[{x:900,y:92},{x:1000,y:85},{x:1100,y:75},{x:1200,y:62},{x:1300,y:50},{x:1400,y:38},{x:1500,y:28},{x:1600,y:20},{x:1700,y:14},{x:1800,y:10},{x:1900,y:7},{x:2000,y:5},{x:2100,y:3},{x:2200,y:2},{x:2300,y:1},{x:2500,y:0.5},{x:2700,y:0}] },
                { id:"Expensive", data:[{x:900,y:5},{x:1000,y:8},{x:1100,y:12},{x:1200,y:18},{x:1300,y:25},{x:1400,y:35},{x:1500,y:45},{x:1600,y:55},{x:1700,y:62},{x:1800,y:70},{x:1900,y:78},{x:2000,y:83},{x:2100,y:88},{x:2200,y:92},{x:2300,y:95},{x:2500,y:97},{x:2700,y:98}] },
                { id:"Too Expensive", data:[{x:900,y:2},{x:1000,y:3},{x:1100,y:5},{x:1200,y:8},{x:1300,y:12},{x:1400,y:18},{x:1500,y:22},{x:1600,y:28},{x:1700,y:35},{x:1800,y:42},{x:1900,y:50},{x:2000,y:58},{x:2100,y:65},{x:2200,y:72},{x:2300,y:78},{x:2500,y:85},{x:2700,y:90}] },
              ]}
              intersections={[
                { label:"PMC", fullLabel:"PMC (Point of Marginal Cheapness)", price:"$1,181.82", x:1200, y:50, color:"#8EC5FF" },
                { label:"OPP", fullLabel:"OPP (Optimal Price Point)", price:"$1,181.82", x:1500, y:22, color:"#2B7FFF" },
                { label:"IPP", fullLabel:"IPP (Indifference Price Point)", price:"$1,181.82", x:1700, y:55, color:"#7CCF00" },
                { label:"PME", fullLabel:"PME (Point of Marginal Expensiveness)", price:"$1,181.82", x:1900, y:50, color:"#8A77E0" },
              ]}
            />
          </Card>

        </>}
      </div>
    </div>
  );
}
