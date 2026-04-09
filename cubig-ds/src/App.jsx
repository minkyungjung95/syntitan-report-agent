import { useState, lazy, Suspense } from "react";
import { DonutChart, SemiDonutChart, HBarChart, VBarChart, StackedHBar, LineChart, LabeledLineChart, FlowTable, QuadrantChart, CHART_COLORS } from "./charts";
import { T, InfoIcon, WarnIcon, CloseIcon, PlusIcon, DownIcon, ChevronR, StarIcon } from "./tokens.jsx";
import { Btn, Badge, Callout, Chip, ChipTabs, TabBar, BTN_STYLES, BADGE_COLORS, BADGE_SIZE, BADGE_RADIUS } from "./ui-components.jsx";
const ReportDemo = lazy(() => import("./ReportDemo"));

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
const CALLOUT_KEYS = ["Primary","Secondary","Positive","Negative","Cautionary","Info","Brand"];
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
  const [page, setPage] = useState("charts");

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

  // chip
  const [chipType, setChipType] = useState("Solid");
  const [chipSize, setChipSize] = useState("Medium");
  const [chipLabel, setChipLabel] = useState("텍스트");
  const [chipActive, setChipActive] = useState(false);
  const [chipDisabled, setChipDisabled] = useState(false);
  const [chipTrailing, setChipTrailing] = useState(false);

  const PAGES = ["charts","button","badge","callout","chip","tab","report"];
  const PAGE_LABELS = { charts:"Charts", button:"Button", badge:"Badge", callout:"Callout", chip:"Chip", tab:"Tab", report:"Report" };
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
          <Card title="Chip Matrix" subtitle="hover로 상태 확인 가능">
            <div style={{ overflowX:"auto" }}>
              <table style={{ borderCollapse:"collapse", minWidth:520 }}>
                <thead><tr>{["Size","Solid","Solid Active","Solid Disabled","Outline","Outline Active","Outline Disabled","With ×"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{CHIP_SIZE_KEYS.map(sz=>(
                  <tr key={sz}>
                    <td style={{...td,color:T.gray800,fontSize:12,fontWeight:600}}>{sz}</td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"}/></td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"} active/></td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"} disabled/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"}/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} active/></td>
                    <td style={td}><Chip type="Outline" size={sz} label={chipLabel||"텍스트"} disabled/></td>
                    <td style={td}><Chip type="Solid"   size={sz} label={chipLabel||"텍스트"} showTrailing/></td>
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

          {/* Semi Donut */}
          <Card title="Semi Donut Chart (반원)" subtitle="감성 분석, 만족도 등 비율 분포에 적합">
            <SemiDonutChart
              title="Sentiment Analysis"
              data={[
                { id: "Positive", value: 65, description: "간편하고 빠른 결제 시스템에 높은 만족도를 보임." },
                { id: "Neutral", value: 18, description: "결제 과정의 편리함과 속도가 긍정적으로 평가되나, 얼굴 인식 오류와 보안 우려가 지적됨." },
                { id: "Negative", value: 7, description: "전반적으로 불편함을 느끼며, 인증 과정에서의 부담감도 지적됨." },
                { id: "Unclassified", value: 8, hatched: true },
              ]}
              size={320}
            />
          </Card>

          {/* Flow Table */}
          <Card title="Flow Table (전환율 테이블)" subtitle="기능별 사용 경험 → 전환율 → 현재 사용률 흐름">
            <FlowTable
              columns={{ left: "사용해 본 기능", right: "사용 중인 기능" }}
              groups={[
                { label: "자동기능", rows: [
                  { label: "자동 감지 기능", description: "세척량, 오염도, 식재료 등 스스로 감지", left: "35.5", rate: 84.6, right: "30.0" },
                  { label: "자동 추천 기능", description: "세척 코스, 요리 모드, 레시피 등 추천", left: "35.5", rate: 69.2, right: "24.5" },
                  { label: "자동 실행 기능", description: "추천/예약 설정을 알아서 실행", left: "29.1", rate: 82.8, right: "24.1" },
                ]},
                { label: "원격제어", rows: [
                  { label: "음성 제어/조작", left: "28.2", rate: 67.7, right: "19.1" },
                  { label: "원격 제어/조작", description: "모바일 앱 등", left: "44.1", rate: 77.3, right: "34.1" },
                  { label: "다른 기기와의 연결 기능", description: "연동 및 통합 제어", left: "30.9", rate: 67.6, right: "20.9" },
                ]},
                { label: "상태 알림", rows: [
                  { label: "고장 발생/관리 필요 시 알림", left: "26.4", rate: 79.3, right: "20.9" },
                  { label: "사용 기록/상태를 보여주는 리포트 제공", left: "26.8", rate: 71.2, right: "19.1" },
                ]},
                { label: "맞춤 기능", rows: [
                  { label: "사용자 맞춤형 학습 기능", description: "사용 습관, 환경 등", left: "22.7", rate: 72.0, right: "16.4" },
                ]},
              ]}
            />
          </Card>

          {/* Horizontal Bar */}
          <Card title="Horizontal Bar" subtitle="가로 막대 - 카테고리 비교에 적합">
            <HBarChart
              title="Satisfaction Level Distribution"
              maxValue={100}
              data={[
                { label:"Very High", value:32, count:9999 },
                { label:"High", value:32, count:9999 },
                { label:"Medium", value:14, count:123 },
                { label:"Low", value:10, count:99 },
                { label:"Very Low", value:0, count:0 },
              ]}
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
            />
          </Card>

          {/* Vertical Bar - Single */}
          <Card title="Vertical Bar (Single)" subtitle="단일 막대 - 항목별 비교">
            <VBarChart
              title="Churn Rate by Cluster"
              height={280}
              data={[
                { label:"Premium Enthusiasts", value:65 },
                { label:"Dormant Potential", value:60 },
                { label:"Value Optimizers", value:55 },
                { label:"Occasional Buyers", value:45 },
              ]}
              keys={["value"]}
            />
          </Card>

          {/* Vertical Bar - Stacked */}
          <Card title="Vertical Bar (Stacked)" subtitle="스택형 세로 막대 - 여러 시리즈 누적">
            <VBarChart
              title="Food Consumption by Country"
              stacked
              height={360}
              data={[
                { label:"AD", donut:40, fries:77, kebab:22, sandwich:35, burger:193, "hot dog":77 },
                { label:"AE", donut:164, fries:141, kebab:169, sandwich:111, burger:77, "hot dog":111 },
                { label:"AF", donut:70, fries:127, kebab:140, sandwich:111, burger:190, "hot dog":71 },
                { label:"AG", donut:113, fries:55, kebab:86, sandwich:134, burger:180, "hot dog":139 },
                { label:"AI", donut:121, fries:138, kebab:74, sandwich:106, burger:135, "hot dog":89 },
                { label:"AL", donut:172, fries:89, kebab:85, sandwich:80, burger:21, "hot dog":187 },
                { label:"AM", donut:136, fries:83, kebab:184, sandwich:24, burger:110, "hot dog":136 },
              ]}
              keys={["hot dog","burger","sandwich","kebab","fries","donut"]}
            />
          </Card>

          {/* Vertical Bar - Grouped */}
          <Card title="Vertical Bar (Grouped)" subtitle="그룹형 세로 막대 - 항목 간 비교">
            <VBarChart
              title="Satisfaction Score by Category"
              height={300}
              data={[
                { label:"디자인", "만족도":82, "기대치":70 },
                { label:"성능", "만족도":68, "기대치":85 },
                { label:"가격", "만족도":75, "기대치":60 },
                { label:"서비스", "만족도":90, "기대치":78 },
                { label:"편의성", "만족도":72, "기대치":65 },
              ]}
              keys={["만족도","기대치"]}
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

          {/* Labeled Line Chart */}
          <Card title="Labeled Line Chart" subtitle="데이터 포인트 라벨 + 하단 테이블 + 어노테이션">
            <LabeledLineChart
              title="AI 생성 정보/리뷰성 콘텐츠 신뢰도"
              subtitle="[Base: 본 조사 1, 전체 응답자, N=3000, 평가형 5점, %]"
              highlightFirst
              series={[
                { id: "신뢰도 높음", color: "#2B7FFF", data: [
                  { x: "전체", y: 27.6 }, { x: "15~24세", y: 25.5 }, { x: "24~34세", y: 28.7 },
                  { x: "35~44세", y: 28.0 }, { x: "45~54세", y: 25.7 }, { x: "55~59세", y: 31.1 },
                ]},
                { id: "신뢰도 낮음", color: "#B0B3B8", labelColor: "#7B7E85", data: [
                  { x: "전체", y: 35.2 }, { x: "15~24세", y: 39.7 }, { x: "24~34세", y: 34.7 },
                  { x: "35~44세", y: 36.4 }, { x: "45~54세", y: 34.5 }, { x: "55~59세", y: 30.1 },
                ]},
              ]}
              categories={[
                { label: "전체", count: 3000 },
                { label: "15~24세", count: 466 },
                { label: "24~34세", count: 654 },
                { label: "35~44세", count: 667 },
                { label: "45~54세", count: 795 },
                { label: "55~59세", count: 418 },
              ]}
              annotations={[{ fromSeries: 1, toSeries: 0, index: 1 }]}
            />
          </Card>

          <Card title="Quadrant Chart (Segment Matrix)" subtitle="2×2 매트릭스 - 세그먼트 분석에 적합">
            <QuadrantChart
              title="Segment Matrix"
              subtitle="[Base: Survey respondents, N=1,000]"
              yAxis={{ label: "Expectation", low: "Low", high: "High" }}
              xAxis={{ label: "Concern", low: "Low", high: "High" }}
              quadrants={[
                { label: "Cautious Adopter", value: "39.7", tag: "High expectation, High concern", color: "#C8F7D5", labelColor: "#171719" },
                { label: "Positive Adopter", value: "41.1", tag: "High expectation, Low concern", color: "#00C950", labelColor: "#fff" },
                { label: "Negative Perceiver", value: "5.4", tag: "Low expectation, High concern", color: "#FFD6D6", labelColor: "#E7000B" },
                { label: "Low Interest", value: "13.8", tag: "Low expectation, Low concern", color: T.gray100, labelColor: T.gray800 },
              ]}
            />
          </Card>


        </>}

        {page==="report" && <Suspense fallback={<div style={{padding:40,color:T.gray800}}>Loading...</div>}><ReportDemo /></Suspense>}
      </div>
    </div>
  );
}
