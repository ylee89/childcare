// Capture splash screen + home wordmark.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = path.join(__dirname, 'brand'); fs.mkdirSync(OUT, { recursive: true });
const cand = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(p => p && fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch(cand.length ? { executablePath: cand[0] } : {});
  const ctx = await browser.newContext({ viewport: { width: 412, height: 880 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  // seed an onboarded profile so home shows after splash
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.speechSynthesis && (window.speechSynthesis.speak = () => {}); });
  // capture splash quickly on a fresh load
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await sleep(500);
  await page.screenshot({ path: path.join(OUT, '01-splash.png') });
  console.log('shot splash');
  // ensure a profile exists, then go home
  await sleep(1800);
  await page.evaluate(() => {
    const S = window.FeelFriends.Store;
    if (!S.isOnboarded()) S.addChild({ name: 'Aria', ageBand: '5-6', avatar: '🦊' });
    S.checkIn('happy'); // mark today's check-in done so home shows directly
    window.FeelFriends.go('home');
  });
  await page.waitForSelector('.brand');
  await sleep(400);
  await page.screenshot({ path: path.join(OUT, '02-home.png') });
  console.log('shot home');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
