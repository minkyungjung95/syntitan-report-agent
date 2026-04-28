import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel 시스템 환경 변수를 빌드 타임에 클라이언트로 주입
    __VERCEL_ENV__: JSON.stringify(process.env.VERCEL_ENV || 'local'),
    __VERCEL_BRANCH__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_REF || 'local'),
  },
  server: {
    host: true,
    allowedHosts: [".trycloudflare.com", ".ngrok-free.app", ".ngrok.io"],
  },
})
