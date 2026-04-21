import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const CoupangReviewReport = lazy(() => import('./coupang-review-report'))
const ChatgptReviewReport = lazy(() => import('./chatgpt-review-report'))
const CsTicketReport = lazy(() => import('./cs-ticket-report'))

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

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
