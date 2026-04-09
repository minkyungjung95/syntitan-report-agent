// ─── Design Tokens (컬러칩 HTML 1:1 매핑) ────────────────────────────────
export const T = {
  gray990:"#171719", gray950:"#303135", gray800:"#7B7E85",
  gray400:"#CACCCF", gray300:"#DCDDDF", gray200:"#E6E7E9",
  gray100:"#F0F0F2", gray50:"#F7F7F8", gray25:"#FAFAFA", white:"#FFFFFF",
  black:"#000000", strong:"#0F0F10",
  purple900:"#59168B", purple800:"#6E11B0", purple700:"#8200DB",
  purple500:"#AD46FF", purple100:"#F3E8FF", purple50:"#FAF5FF",
  dp700:"#6C58BE", dp600:"#7A65D0", dp500:"#8A77E0",
  dp300:"#B5ABF2", dp100:"#EFEBFF",
  green900:"#0D542B", green600:"#00A63E", green500:"#00C950",
  green400:"#05DF72", green50:"#F0FDF4",
  red900:"#82181A",  red600:"#E7000B",  red500:"#FB2C36", red50:"#FEF2F2",
  orange50:"#fff7ed", orange:"#ff6900",
  yellow400:"#FDC700", yellow50:"#FEFCE8",
  blue600:"#155DFC", blue500:"#2B7FFF", blue50:"#EFF6FF",
};

// ─── Icons (Stroke) ───────────────────────────────────────────────────────
export const InfoIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2"/>
    <rect x="7.3" y="6.8" width="1.4" height="4.6" rx="0.7" fill={color}/>
    <circle cx="8" cy="4.8" r="0.8" fill={color}/>
  </svg>
);
export const WarnIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
    <rect x="7.3" y="6.5" width="1.4" height="3.8" rx="0.7" fill={color}/>
    <circle cx="8" cy="11.5" r="0.8" fill={color}/>
  </svg>
);

// ─── Icons (Fill) ─────────────────────────────────────────────────────────
export const InfoFillIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <circle cx="8" cy="8" r="7.5" fill={color}/>
    <rect x="7.15" y="6.8" width="1.7" height="4.6" rx="0.85" fill="#fff"/>
    <circle cx="8" cy="4.8" r="1" fill="#fff"/>
  </svg>
);
export const WarnFillIcon = ({ size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <path d="M7.13 1.53a1 1 0 011.74 0l6.5 11.25A1 1 0 0114.5 14.5h-13a1 1 0 01-.87-1.5l6.5-11.47Z" fill={color}/>
    <rect x="7.15" y="6" width="1.7" height="4.2" rx="0.85" fill="#fff"/>
    <circle cx="8" cy="11.5" r="1" fill="#fff"/>
  </svg>
);
export const CloseIcon = ({ size=12, color }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M2 2L10 10M10 2L2 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
export const PlusIcon  = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
export const DownIcon  = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M10 4v8M6 9l4 4 4-4M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const ChevronR  = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const StarIcon  = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 12 12" fill={color}><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.44L6 8.885 2.91 10.51l.59-3.44L1 4.635l3.455-.505L6 1z"/></svg>;

// ─── Report Icons ─────────────────────────────────────────────────────────
export const CheckCircleIcon = ({ size=20, color=T.gray990 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}>
    <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.2"/>
    <path d="M6.5 10.5L9 13L13.5 7.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const CheckCircleFillIcon = ({ size=20, color=T.gray990 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}>
    <circle cx="10" cy="10" r="10" fill={color}/>
    <path d="M6.5 10.5L9 13L13.5 7.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const PersonIcon = ({ size=24, color=T.gray800 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
    <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
export const ArrowUpIcon = ({ size=16, color=T.green600 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <path d="M8 12V4M4.5 7L8 3.5L11.5 7" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const ArrowDownIcon = ({ size=16, color=T.red500 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <path d="M8 4V12M4.5 9L8 12.5L11.5 9" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
