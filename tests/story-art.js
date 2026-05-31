// Capture the new illustrated Story Adventures scenes + outcomes.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = path.join(__dirname, 'story-art'); fs.mkdirSync(OUT, { recursive: true });
const cand = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(p => p && fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch(cand.length ? { executablePath: cand[0] } : {});
  const ctx = await browser.newContext({ viewport: { width: 412, height: 880 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => { localStorage.clear(); window.speechSynthesis && (window.speechSynthesis.speak = () => {}); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('.textinput', 'Aria');
  await page.locator('.chip', { hasText: '5-6' }).click();
  await page.locator('.pill-btn', { hasText: "Let's go" }).click();
  await page.waitForSelector('.moodgrid');
  const go = (r, p) => page.evaluate(([x, y]) => window.FeelFriends.go(x, y), [r, p]);

  const shot = async (n) => { await sleep(300); const s = await page.$('.scene'); await s.screenshot({ path: path.join(OUT, n + '.png') }); console.log('shot', n); };

  for (const id of ['sharing', 'pushed', 'excluded', 'help']) {
    await go('story', { id }); await page.waitForSelector('.scene.illus svg'); await shot('scene-' + id);
  }
  // outcomes
  await go('story', { id: 'sharing' }); await page.waitForSelector('.choice');
  await page.locator('.choice', { hasText: 'take turns' }).click(); await page.waitForSelector('.scene.illus svg'); await shot('outcome-good');
  await go('story', { id: 'sharing' }); await page.waitForSelector('.choice');
  await page.locator('.choice', { hasText: 'No! Mine' }).click(); await page.waitForSelector('.scene.illus svg'); await shot('outcome-reflect');

  // also a full-screen of the choices view for context
  await go('story', { id: 'pushed' }); await page.waitForSelector('.choice');
  await sleep(300); await page.screenshot({ path: path.join(OUT, 'full-pushed.png') });
  console.log('shot full-pushed');

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
