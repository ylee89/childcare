// Capture INTERACTION states of the real running app (requires server on $BASE).
// Shows before/after of taps so we can verify interactions + layout pre-deploy.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = path.join(__dirname, 'app-interactions');
fs.mkdirSync(OUT, { recursive: true });
const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(p => p && fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    ...(candidates.length ? { executablePath: candidates[0] } : {}),
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 880 }, deviceScaleFactor: 2, permissions: ['microphone'] });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => { localStorage.clear(); window.speechSynthesis && (window.speechSynthesis.speak = () => {}); });

  const shot = async (name) => { await sleep(350); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name); };
  const go = (r, p) => page.evaluate(([x, y]) => window.FeelFriends.go(x, y), [r, p]);

  // create a profile
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('.textinput', 'Aria');
  await page.locator('.chip', { hasText: '5-6' }).click();
  await page.locator('.chip.big', { hasText: '🦊' }).click();
  await page.locator('.pill-btn', { hasText: "Let's go" }).click();
  await page.waitForSelector('.moodgrid');

  // 1. mood check-in: BEFORE
  await shot('01-checkin-before');
  // 1b. AFTER tapping "angry" -> validating message + calm suggestion
  await page.locator('.moodgrid .face', { hasText: 'angry' }).click();
  await page.waitForSelector('.prompt');
  await shot('02-checkin-after');
  await page.locator('.pill-btn', { hasText: 'Back home' }).click();
  await page.waitForSelector('.grid');

  // seed data for later screens
  await page.evaluate(() => { const S = window.FeelFriends.Store;
    ['happy','sad','angry','frustrated','proud'].forEach(c => S.collectCard(c)); });

  // 2. Face Match: correct-tap feedback (toast + dot)
  await go('facematch'); await page.waitForSelector('.target b');
  {
    const target = (await page.locator('.target b').innerText()).toLowerCase();
    await page.locator('.faces .face', { has: page.locator('small', { hasText: new RegExp('^' + target + '$') }) }).first().click();
    await shot('03-facematch-correct');
  }
  // 2b. wrong-tap gentle redirect
  await go('facematch'); await page.waitForSelector('.target b');
  {
    const target = (await page.locator('.target b').innerText()).toLowerCase();
    const wrong = page.locator('.faces .face', { has: page.locator('small', { hasText: new RegExp('^(?!' + target + '$).*') }) }).first();
    await wrong.click();
    await shot('04-facematch-redirect');
  }

  // 3. Card flipped (definition shown)
  await go('cards'); await page.waitForSelector('.deck');
  await page.locator('.card3d:not(.locked)').first().click();
  await shot('05-card-flipped');

  // 4. Story: choices, less-helpful consequence, good-choice bridge
  await go('story', { id: 'pushed' }); await page.waitForSelector('.choice');
  await shot('06-story-choices');
  await page.locator('.choice', { hasText: 'Push them back' }).click();
  await page.waitForSelector('.choice');
  await shot('07-story-consequence');
  await page.locator('.choice', { hasText: 'Try another way' }).click();
  await page.waitForSelector('.choice');
  await page.locator('.choice', { hasText: 'Please stop' }).click();
  await page.waitForSelector('.choice');
  await shot('08-story-good');

  // 5. Brave Voice: after recording -> celebrate + local note
  await go('brave-practice', { id: 'please-stop' }); await page.waitForSelector('.mic');
  await page.locator('.mic').click({ force: true }); await sleep(600);
  await page.locator('.mic').click({ force: true }); await sleep(500);
  await shot('09-brave-recorded');

  // 6. Calm: balloon mid-inhale (motion state)
  await go('calm'); await page.locator('.calm-tile', { hasText: 'Balloon' }).click();
  await page.waitForSelector('.balloon'); await sleep(1200);
  await shot('10-calm-breathing');

  // 7. Empathy: after correct -> kindness mission
  await go('empathy'); await page.waitForSelector('.faces');
  {
    const ans = await page.evaluate(() => ({'🍦😢':'sad','🎉🥳':'excited','🧩😣':'frustrated','🐶❤️':'happy'})[document.querySelector('.scene').textContent.trim()]);
    await page.locator('.faces .face', { has: page.locator('small', { hasText: new RegExp('^' + ans + '$') }) }).first().click();
    await shot('11-empathy-result');
  }

  // 8. Good Choice: positive outcome
  await go('choice'); await page.waitForSelector('.choice');
  {
    const good = page.locator('.choice', { hasText: /Help clean up|comfort them|Tell a grown-up/ }).first();
    if (await good.count()) await good.click(); else await page.locator('.choice').first().click();
    await shot('12-choice-outcome');
  }

  // 9. Parent gate (interaction: numpad)
  await go('gate'); await page.waitForSelector('.gate-eq');
  await page.locator('.num').first().click();
  await shot('13-parent-gate');

  // 10. Settings (toggles)
  await page.evaluate(() => { // jump straight in for the shot
    const a = 1, b = 1; // not used; go directly
    window.FeelFriends.go('settings');
  });
  await page.waitForSelector('.toggle');
  await shot('14-settings');

  await browser.close();
  console.log('done ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
