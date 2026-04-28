import { StrictMode, lazy, Suspense } from 'react'
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
const AuditLog = lazy(() => import('./syntitan-UI/audit-log.jsx'))

function Root() {
  const route = window.location.hash.replace(/^#\/?/, '')

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

  if (route === 'audit') {
    return (
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>Loading...</div>}>
        <AuditLog />
      </Suspense>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
