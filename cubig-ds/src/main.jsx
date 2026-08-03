import { StrictMode, lazy, Suspense, useState, useEffect, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 환경별 파비콘 — production/preview/local 시각적 구분
;(() => {
  // eslint-disable-next-line no-undef
  const env = typeof __VERCEL_ENV__ !== 'undefined' ? __VERCEL_ENV__ : 'local'
  const color = env === 'production' ? '#171719'   // 검정 (안정)
              : env === 'preview'    ? '#F97316'   // 주황 (개발 중)
              :                        '#2B7FFF'   // 파랑 (로컬)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}"/></svg>`
  let link = document.querySelector("link[rel='icon']")
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link) }
  link.type = 'image/svg+xml'
  link.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  // 탭 제목에도 환경 prefix
  if (env !== 'production') {
    const prefix = env === 'preview' ? '[DEV] ' : '[LOCAL] '
    document.title = prefix + (document.title || 'Vite App')
  }
})()

const CoupangReviewReport = lazy(() => import('./coupang-review-report'))
const ChatgptReviewReport = lazy(() => import('./chatgpt-review-report'))
const CsTicketReport = lazy(() => import('./cs-ticket-report'))
const AdPerformanceReport = lazy(() => import('./ad-performance-report'))
const AdRoasReport = lazy(() => import('./ad-roas-report'))
const ChurnPredictionReport = lazy(() => import('./churn-prediction-report'))
const PersonaSurveyReport = lazy(() => import('./persona-survey-report'))
const AudienceStrategyReport = lazy(() => import('./audience-strategy-report'))
const NewPricingProductReport = lazy(() => import('./new-pricing-product-report'))
const PrImpactReport = lazy(() => import('./pr-impact-report'))
const CrmCampaignReport = lazy(() => import('./crm-campaign-report'))
const CrmCampaignInput = lazy(() => import('./crm-input'))
const AuditLog = lazy(() => import('./syntitan-UI/audit-log.jsx'))
const SyntitanPrototype = lazy(() => import('./syntitan-prototype.jsx'))

/* 흰 화면 대신 에러를 화면에 그대로 보여줌 — 콘솔 없이도 원인 확인 */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (!this.state.err) return this.props.children
    return (
      <pre style={{
        margin: 24, padding: 20, background: '#FEE9E9', color: '#8B0000',
        borderRadius: 12, fontSize: 13, lineHeight: '20px', whiteSpace: 'pre-wrap',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}>
        {String(this.state.err && this.state.err.stack || this.state.err)}
      </pre>
    )
  }
}

const readRoute = () => window.location.hash.replace(/^#\/?/, '')

function Root() {
  // 해시가 바뀌면 다시 그려야 폼 → 리포트 이동이 동작함
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === 'coupang') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <CoupangReviewReport />
      </Suspense>
    )
  }

  if (route === 'chatgpt') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <ChatgptReviewReport />
      </Suspense>
    )
  }

  if (route === 'cs') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <CsTicketReport />
      </Suspense>
    )
  }

  if (route === 'ad') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <AdPerformanceReport />
      </Suspense>
    )
  }

  if (route === 'ad-roas') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <AdRoasReport />
      </Suspense>
    )
  }

  if (route === 'churn') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <ChurnPredictionReport />
      </Suspense>
    )
  }

  if (route === 'persona') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <PersonaSurveyReport />
      </Suspense>
    )
  }

  if (route === 'audience') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <AudienceStrategyReport />
      </Suspense>
    )
  }

  if (route === 'pricing') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <NewPricingProductReport />
      </Suspense>
    )
  }

  if (route === 'pr-impact') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <PrImpactReport />
      </Suspense>
    )
  }

  if (route === 'crm') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <CrmCampaignReport />
      </Suspense>
    )
  }

  if (route === 'crm-input') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <CrmCampaignInput />
      </Suspense>
    )
  }

  if (route === 'audit') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <AuditLog />
      </Suspense>
    )
  }

  if (route === 'syntitan') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <SyntitanPrototype />
        </div>
      </Suspense>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
)
