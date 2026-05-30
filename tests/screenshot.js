/**
 * Render the Feel Friends prototype and capture screenshots of key screens.
 * Output: tests/screens/*.png  +  a combined contact sheet via individual files.
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'screens');
fs.mkdirSync(OUT, { recursive: true });
const fileUrl = 'file://' + path.join(ROOT, 'prototype', 'index.html');

// [filename, screenId, setup function run in the page before shot]
const shots = [
  ['01-home',      's-home',     null],
  ['02-checkin',   's-checkin',  () => { document.querySelectorAll('#moodgrid .face')[2].click(); }],
  ['03-facematch', 's-emotion',  null],
  ['04-story',     's-story',    null],
  ['05-bravevoice','s-brave',    () => { window.micStart(); window.micStop(); }],
  ['06-empathy',   's-empathy',  () => { [...document.querySelectorAll('#empFaces .face')].find(f=>f.querySelector('small').textContent==='sad').click(); }],
  ['07-goodchoice','s-choice',   () => { window.choiceOut(true); }],
  ['08-sticker',   's-sticker',  null],
  ['09-calm',      's-calm',     () => { window.startBalloon(); }],
  ['10-dashboard', 's-dash',     null],
];

(async () => {
  // Prefer Playwright's managed Chromium; fall back to a provided binary
  // (e.g. CHROMIUM_PATH or a known pw-browsers location) when present.
  const candidates = [
    process.env.CHROMIUM_PATH,
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  ].filter(p => p && fs.existsSync(p));
  const browser = await chromium.launch(
    candidates.length ? { executablePath: candidates[0] } : {}
  );
  const page = await browser.newPage({ viewport: { width: 430, height: 860 }, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  for (const [name, id, setup] of shots) {
    await page.evaluate((sid) => window.go(sid), id);
    if (setup) await page.evaluate(setup);
    await page.waitForTimeout(250);
    const phone = await page.$('#phone');
    await phone.screenshot({ path: path.join(OUT, name + '.png') });
    console.log('captured', name);
  }

  // contact sheet: a single tall page with all phones side-by-side via a wrapper page
  await browser.close();
  console.log('done ->', OUT);
})();
