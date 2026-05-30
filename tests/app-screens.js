// Capture screenshots of the REAL running app (requires server on $BASE).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = path.join(__dirname, 'app-screens');
fs.mkdirSync(OUT, { recursive: true });
const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(p => p && fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch(candidates.length ? { executablePath: candidates[0] } : {});
  const ctx = await browser.newContext({ viewport: { width: 412, height: 880 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());

  const shot = async (name) => { await sleep(350); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const go = (r) => page.evaluate((x) => window.FeelFriends.go(x), r);

  // onboarding
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('.textinput', 'Aria');
  await page.locator('.chip', { hasText: '5-6' }).click();
  await page.locator('.chip.big', { hasText: '🦊' }).click();
  await shot('01-onboarding');
  await page.locator('.pill-btn', { hasText: "Let's go" }).click();
  await page.waitForSelector('.moodgrid');
  await shot('02-checkin');
  await page.locator('.moodgrid .face', { hasText: 'happy' }).click();
  await page.waitForSelector('.grid', { timeout: 2000 }).catch(() => {});
  await page.locator('.pill-btn', { hasText: 'Back home' }).click().catch(() => {});
  await page.waitForSelector('.grid');
  await shot('03-home');

  // seed some data so dashboard looks alive
  await page.evaluate(() => {
    const S = window.FeelFriends.Store;
    ['happy','frustrated','excited','happy','sad'].forEach(e => S.checkIn(e));
    ['happy','sad','angry','frustrated','proud'].forEach(c => S.collectCard(c));
    S.logEvent('stories','sharing',{good:true}); S.logEvent('calm','session');
    S.earnSticker('story','Story Solver'); S.earnSticker('brave','Brave Voice'); S.earnSticker('emotion','Feelings Finder');
  });

  await go('facematch'); await page.waitForSelector('.target'); await shot('04-facematch');
  await go('cards'); await page.waitForSelector('.deck'); await shot('05-cards');
  await go('stories'); await page.waitForSelector('.menu'); await shot('06-stories');
  await page.locator('.menu-tile', { hasText: 'Being pushed' }).click(); await page.waitForSelector('.choice'); await shot('07-story');
  await go('brave'); await page.locator('.menu-tile', { hasText: 'Please stop' }).click(); await page.waitForSelector('.mic'); await shot('08-brave');
  await go('calm'); await page.locator('.calm-tile', { hasText: 'Balloon' }).click(); await page.waitForSelector('.balloon'); await shot('09-calm');
  await go('empathy'); await page.waitForSelector('.faces'); await shot('10-empathy');
  await go('choice'); await page.waitForSelector('.choice'); await shot('11-choice');
  await go('sticker'); await page.waitForSelector('.card-lite'); await shot('12-sticker');
  await go('dashboard'); await page.waitForSelector('.card'); await shot('13-dashboard');

  await browser.close();
})();
