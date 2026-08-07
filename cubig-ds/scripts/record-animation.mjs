// scripts/record-animation.mjs
// Headless로 단일 카드 애니메이션을 정확히 1040×520 H.264 mp4로 녹화.
// 사용 예:
//   node scripts/record-animation.mjs balance ../motion/07_class-balance.mp4
//   node scripts/record-animation.mjs feature ../motion/01_feature-derivation.mp4
//
// 사전: Vite dev server가 http://localhost:5173 에서 동작 중이어야 함.

import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const hash = process.argv[2] ?? 'balance';
const outPath = path.resolve(process.argv[3] ?? `${hash}-animation.mp4`);
const tmpDir = `/tmp/pw-rec-${hash}-${Date.now()}`;
mkdirSync(tmpDir, { recursive: true });

const url = `http://localhost:5173/animations/feature-derivation.html?clean=1#${hash}`;
// 11.484s = 기존 mp4와 동일 duration. 시작 1초는 transform:scale 적용 전 프레임이 섞일 수 있어 trim.
const SETTLE_MS = 1200;          // transform 적용 후 안정화 대기 (이 구간은 trim)
const TARGET_DURATION = 11.484;  // reference (01_feature-derivation.mp4)와 동일
const RECORD_MS = 1000 + Math.ceil(TARGET_DURATION * 1000) + 500; // settle + target + 여유

console.log(`▶ recording '${hash}' → ${outPath}`);
console.log(`  url: ${url}`);

// viewport 1040×520에서 .stage(520×260 디자인)를 transform:scale(2)로 정확히 채우기
// — recordVideo.size는 viewport와 같게 유지해야 좌상단 잘림 문제 없음
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1040, height: 520 },
  deviceScaleFactor: 1,
  recordVideo: { dir: tmpDir, size: { width: 1040, height: 520 } },
  colorScheme: 'light',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });

// 원본 카드 비율(73% × 65%) 매칭 — stage 520×260 + scale 1.82
// (stage 사이즈를 바꾸면 카드 컨텐츠가 숨는 이슈가 있어, stage는 그대로 두고 scale만 줄임.
//  viewport 1040×520보다 작게 그려지고 주변은 body bg #F5F7F9가 채움 → 원본과 동일 룩)
await page.evaluate(() => {
  const STAGE_W = 520, STAGE_H = 260;
  const SCALE = 1.82; // 416 × 1.82 = 757 (원본 카드 너비 ~758과 일치)
  const stage = document.querySelector('.stage');
  if (stage) {
    Object.assign(stage.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: STAGE_W + 'px',
      height: STAGE_H + 'px',
      minHeight: 'unset',
      padding: '0',
      margin: '0',
      transformOrigin: 'center center',
      transform: `translate(-50%, -50%) scale(${SCALE})`,
      boxSizing: 'border-box',
    });
  }
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.background = '#F5F7F9';
});

await page.waitForTimeout(400);
await page.waitForTimeout(RECORD_MS);
await page.close();
await ctx.close();
await browser.close();

// Playwright가 저장한 webm 찾기
const webms = readdirSync(tmpDir).filter(f => f.endsWith('.webm'));
if (!webms.length) {
  console.error('❌ no webm produced');
  process.exit(1);
}
const webm = path.join(tmpDir, webms[0]);

console.log(`▶ converting webm → mp4 (H.264, yuv420p, bt470bg primaries, 60fps, trim ${SETTLE_MS/1000}s + ${TARGET_DURATION}s)`);
// 원본 mp4 metadata: yuv420p(tv, bt470bg/unknown/unknown)
// → primaries만 bt470bg로 명시, trc/colorspace는 명시 X(=unspecified) → player가 height(520<720)로 BT.601 디코드
// → ffmpeg가 webm 디코드 후 BT.601 yuv로 저장한 값과 정확히 매칭, 톤 시프트 없음
const ff = spawnSync(ffmpegPath, [
  '-y',
  '-ss', String(SETTLE_MS / 1000),       // settle 구간 trim (앞 1.2초)
  '-i', webm,
  '-t', String(TARGET_DURATION),          // 정확히 11.484s
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '20',                            // reference 비트레이트(~377kb/s) 근처로 품질 ↑
  '-pix_fmt', 'yuv420p',
  '-vf', 'scale=1040:520:flags=lanczos',
  // 원본 metadata: yuv420p(tv, bt470bg/unknown/unknown)
  '-colorspace', 'bt470bg',
  '-color_primaries', 'unspecified',
  '-color_trc', 'unspecified',
  '-color_range', 'tv',
  '-r', '60',                              // reference와 동일 60fps
  '-movflags', '+faststart',
  outPath,
], { stdio: 'inherit' });

// 임시 정리
try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}

if (ff.status !== 0) {
  console.error('❌ ffmpeg failed');
  process.exit(ff.status);
}
console.log(`✓ saved: ${outPath}`);
