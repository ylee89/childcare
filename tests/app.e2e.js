/**
 * Feel Friends PWA — end-to-end test.
 * Drives the REAL app in a real browser (Chromium) through a full journey:
 * onboarding → check-in → games → stories → brave voice → calm → empathy →
 * choice → sticker book → parent gate → dashboard, plus persistence & offline.
 *
 * Assumes the static server is running on $BASE (default http://localhost:5173).
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:5173';
const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(p => p && fs.existsSync(p));

let pass = 0, fail = 0; const failures = [];
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
}
const sec = t => console.log('\n' + t);
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    ...(candidates.length ? { executablePath: candidates[0] } : {}),
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });
  const context = await browser.newContext({
    viewport: { width: 412, height: 880 }, deviceScaleFactor: 2,
    permissions: ['microphone'],
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  const route = () => page.evaluate(() => window.FeelFriends?.current?.name);
  const mode  = () => page.evaluate(() => document.body.dataset.mode);
  const stateChild = () => page.evaluate(() => window.FeelFriends.Store.child());

  // ---- expose router state for assertions ----
  sec('0. Load + clean slate');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} }); // one-time clean slate
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.FeelFriends);
  await page.evaluate(() => { // spy on narration: record spoken text, no real audio
    window.__spoken = [];
    if (window.speechSynthesis) {
      window.speechSynthesis.speak = (u) => { try { window.__spoken.push(String(u && u.text || '')); } catch {} };
      window.speechSynthesis.cancel = () => {};
    }
  });
  ok('app booted', await page.evaluate(() => !!window.FeelFriends));
  // skip splash if present, then wait for onboarding
  await page.locator('.splash').click({ timeout: 800 }).catch(() => {});
  await page.waitForSelector('text=Welcome to Feel Friends', { timeout: 4000 }).catch(() => {});
  ok('starts at onboarding (no profile yet)', await page.locator('text=Welcome to Feel Friends').count() === 1);

  // ---- 1. Onboarding ----
  sec('1. Onboarding creates a persistent child profile');
  await page.fill('.textinput', 'Aria');
  await page.locator('.chiprow .chip', { hasText: '5-6' }).click();
  await page.locator('.chiprow .chip.big', { hasText: '🦊' }).click();
  await page.locator('.pill-btn', { hasText: "Let's go" }).click();
  await page.waitForFunction(() => document.querySelector('.grid'));
  const child = await stateChild();
  ok('child saved with name', child && child.name === 'Aria', JSON.stringify(child));
  ok('child saved with age band', child && child.ageBand === '5-6');
  ok('child saved with avatar', child && child.avatar === '🦊');
  ok('home shows 6 world tiles', await page.locator('.grid .tile').count() === 6);

  // ---- 2. Daily mood check-in (auto-prompts) ----
  sec('2. Mood check-in records a feeling');
  await page.waitForSelector('.moodgrid', { timeout: 3000 });
  ok('check-in shows 10 emotions', await page.locator('.moodgrid .face').count() === 10);
  await page.locator('.moodgrid .face', { hasText: 'happy' }).click();
  await page.waitForSelector('.prompt');
  ok('check-in gives validating message', /it's okay to feel happy/i.test(await page.locator('.prompt').innerText()));
  const checkins = await page.evaluate(() => window.FeelFriends.Store.childData().checkins.length);
  ok('check-in persisted to store', checkins === 1, 'count=' + checkins);
  await page.locator('.pill-btn', { hasText: 'Back home' }).click();
  await page.waitForSelector('.grid');

  // ---- 3. Emotion Explorer · Face Match (no-fail, collects cards) ----
  sec('3. Face Match — no-fail loop collects feeling cards');
  await page.locator('.tile', { hasText: 'Emotion Explorer' }).click();
  await page.locator('.menu-tile', { hasText: 'Face Match' }).click();
  await page.waitForSelector('.target b');
  // play the full game by always tapping the correct face
  for (let r = 0; r < 6; r++) {
    const finished = await page.locator('.pill-btn', { hasText: 'Play again' }).count();
    if (finished) break;
    const target = (await page.locator('.target b').innerText()).toLowerCase();
    const btn = page.locator('.faces .face', { has: page.locator('small', { hasText: new RegExp('^' + target + '$') }) }).first();
    await btn.click();
    await sleep(1250);
  }
  ok('Face Match reaches a finish state', await page.locator('.pill-btn', { hasText: 'Play again' }).count() === 1);
  const cardsAfter = await page.evaluate(() => window.FeelFriends.Store.childData().cards.length);
  ok('feeling cards were collected', cardsAfter >= 4, 'cards=' + cardsAfter);
  const stickersAfter = await page.evaluate(() => window.FeelFriends.Store.childData().stickers.length);
  ok('a sticker was earned for finishing', stickersAfter >= 1);

  // ---- 4. Cards view reflects collection ----
  sec('4. Card collection view');
  await page.locator('.pill-btn', { hasText: 'See my cards' }).click();
  await page.waitForSelector('.deck');
  ok('deck shows 10 card slots', await page.locator('.card3d').count() === 10);
  ok('count text reflects progress', /\/ 10 feelings found/.test(await page.locator('.count').innerText()));

  // ---- 5. Story Adventures (consequence + brave bridge) ----
  sec('5. Story Adventures');
  await page.evaluate(() => window.FeelFriends.go('stories'));
  await page.locator('.menu-tile', { hasText: 'Being pushed' }).click();
  await page.waitForSelector('.choice');
  ok('story offers 3 choices', await page.locator('.stage .choice').count() === 3);
  await page.locator('.choice', { hasText: 'Please stop' }).click();
  await page.waitForSelector('.say-prompt');
  ok('good choice praises brave voice', /brave voice/i.test(await page.locator('.prompt').innerText()));
  ok('in-story "now you try" say-prompt appears', await page.locator('.say-prompt').count() === 1);
  ok('in-story recorder widget appears', await page.locator('.rec-widget .mic').count() === 1);
  // record yourself inside the story and confirm playback control appears
  await page.locator('.rec-widget .mic').click({ force: true });
  await sleep(600);
  await page.locator('.rec-widget .mic').click({ force: true });
  await sleep(500);
  ok('in-story recording saved (Hear me button)', await page.locator('.rec-widget .pill-btn', { hasText: 'Hear me' }).count() === 1);
  const storyRec = await page.evaluate(() => Object.keys(window.FeelFriends.Store.childData().recordings).some(k => k.startsWith('story-')));
  ok('story recording persisted to store', storyRec === true);

  // ---- 6. Brave Voice (record path with fake mic) ----
  sec('6. Brave Voice records and earns a sticker');
  await page.evaluate(() => window.FeelFriends.go('brave'));
  await page.locator('.menu-tile', { hasText: 'Please stop' }).click();
  await page.waitForSelector('.mic');
  await page.locator('.mic').click({ force: true });   // start (getUserMedia)
  await sleep(700);
  await page.locator('.mic').click({ force: true });   // stop -> save + sticker
  await sleep(500);
  ok('brave voice celebrates', /brave voice/i.test(await page.locator('.toast').innerText()));
  const braveStickers = await page.evaluate(() => window.FeelFriends.Store.childData().stickers.filter(s => s.id === 'brave').length);
  ok('brave sticker earned', braveStickers >= 1);

  // ---- 7. Calm Corner (mode shift + breathing) ----
  sec('7. Calm Corner regulation');
  await page.evaluate(() => window.FeelFriends.go('calm'));
  ok('calm mode palette active', await mode() === 'calm');
  await page.locator('.calm-tile', { hasText: 'Balloon Breathing' }).click();
  await page.waitForSelector('.balloon');
  ok('breathing balloon shows', await page.locator('.balloon').count() === 1);
  await page.locator('.pill-btn', { hasText: 'I feel calmer' }).click();
  await page.waitForSelector('.calm-grid');
  const calmEvents = await page.evaluate(() => window.FeelFriends.Store.childData().events.filter(e => e.world === 'calm').length);
  ok('calm session logged', calmEvents >= 1);

  // ---- 8. Empathy Lab ----
  sec('8. Empathy Lab');
  await page.evaluate(() => window.FeelFriends.go('empathy'));
  await page.waitForSelector('.faces');
  // first item answer is "sad" (ice cream) but order may vary; answer by matching scene
  let solvedEmp = false;
  for (let i = 0; i < 4 && !solvedEmp; i++) {
    const ans = await page.evaluate(() => {
      const scenes = { '🍦😢':'sad', '🎉🥳':'excited', '🧩😣':'frustrated', '🐶❤️':'happy' };
      return scenes[document.querySelector('.scene').textContent.trim()];
    });
    const f = page.locator('.faces .face', { has: page.locator('small', { hasText: new RegExp('^' + ans + '$') }) }).first();
    await f.click(); await sleep(400);
    solvedEmp = await page.locator('.pill-btn', { hasText: 'Kindness Mission' }).count() > 0;
    if (!solvedEmp) await page.evaluate(() => window.FeelFriends.go('empathy')); // retry fresh
  }
  ok('empathy round solved -> kindness mission offered', solvedEmp);

  // ---- 9. Good Choice ----
  sec('9. Good Choice Challenge');
  await page.evaluate(() => window.FeelFriends.go('choice'));
  await page.waitForSelector('.choice');
  for (let i = 0; i < 4; i++) {
    if (await page.locator('.pill-btn', { hasText: 'Play again' }).count()) break;
    // choose the "good" option by checking which outcome label is positive isn't visible;
    // good options are: Help clean up / Go comfort them / Tell a grown-up
    const good = page.locator('.choice', { hasText: /Help clean up|comfort them|Tell a grown-up/ }).first();
    if (await good.count()) { await good.click(); }
    else { await page.locator('.choice').first().click(); }
    await sleep(300);
    const next = page.locator('.pill-btn', { hasText: 'Next' });
    if (await next.count()) await next.click();
    await sleep(300);
  }
  ok('good choice challenge completes', await page.locator('.pill-btn', { hasText: 'Play again' }).count() === 1);

  // ---- 10. Sticker book reflects everything ----
  sec('10. Sticker Book aggregates rewards');
  await page.evaluate(() => window.FeelFriends.go('sticker'));
  await page.waitForSelector('.card-lite');
  ok('shows feeling card progress', /Feeling cards: \d+\/10/.test(await page.innerText('.card-lite')));
  ok('shows earned stickers', await page.locator('.sticker').count() >= 1);

  // ---- 11. Parent gate + dashboard with real data ----
  sec('11. Parent gate + live dashboard');
  await page.evaluate(() => window.FeelFriends.go('gate'));
  await page.waitForSelector('.gate-eq');
  const eq = await page.locator('.gate-eq').innerText();         // "a + b = ?"
  const [a, b] = eq.match(/\d+/g).map(Number);
  const answer = String(a + b);
  for (const dch of answer) await page.locator('.num', { hasText: new RegExp('^' + dch + '$') }).first().click();
  // hold the button >1.5s
  const hold = page.locator('.hold');
  const box = await hold.boundingBox();
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.mouse.down(); await sleep(1700); await page.mouse.up();
  await page.waitForSelector('.card', { timeout: 3000 });
  ok('gate solved -> dashboard (adult mode)', await mode() === 'adult');
  ok('dashboard shows this-week stats', /days active/.test(await page.innerText('.card')));
  ok('dashboard shows a feeling bar from real check-in', await page.locator('.bar').count() >= 1);
  ok('dashboard shows an insight', (await page.locator('.insight').innerText()).length > 10);

  // ---- 12. Settings: narration toggle persists ----
  // ---- 11b. Audio narration reads prompts AND every choice aloud ----
  sec('11b. Audio narration (non-readers)');
  await page.evaluate(() => { window.__spoken = []; window.FeelFriends.go('stories'); });
  await page.locator('.menu-tile', { hasText: 'Sharing' }).click();
  await page.waitForSelector('.choice');
  await sleep(500); // let narrateScene's queued speech fire
  const spokenStory = await page.evaluate(() => window.__spoken.slice());
  ok('story narrates the scene prompt', spokenStory.some(t => /what could you do/i.test(t)));
  ok('story narrates each choice (Choice 1..)', spokenStory.filter(t => /^Choice \d/.test(t)).length >= 2);
  // tapping a choice speaks its label
  await page.evaluate(() => { window.__spoken = []; });
  await page.locator('.stage .choice').first().click();
  await sleep(200);
  ok('tapping a choice speaks it', (await page.evaluate(() => window.__spoken.length)) >= 1);
  // Good Choice section also narrates options
  await page.evaluate(() => { window.__spoken = []; window.FeelFriends.go('choice'); });
  await page.waitForSelector('.choice');
  await sleep(500);
  ok('Good Choice narrates its options', (await page.evaluate(() => window.__spoken.filter(t => /^Choice \d/.test(t)).length)) >= 2);
  // choice buttons expose a speaker affordance
  ok('choice buttons show a speaker icon', (await page.locator('.choice .choice-speak').count()) >= 2);

  sec('12. Settings persistence');
  await page.evaluate(() => window.FeelFriends.go('dashboard')); // 11b navigated away
  await page.waitForSelector('.card');
  await page.locator('.pill-btn', { hasText: 'Settings' }).click();
  await page.waitForSelector('.toggle');
  await page.locator('.toggle', { hasText: 'Voice narration' }).locator('input').uncheck();
  const narrOff = await page.evaluate(() => window.FeelFriends.Store.settings.narration === false);
  ok('narration setting toggled off in store', narrOff);

  // ---- 13. Persistence across reload ----
  sec('13. Data persists across reload (local-first)');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.FeelFriends);
  const persisted = await page.evaluate(() => {
    const s = window.FeelFriends.Store;
    return { name: s.child()?.name, cards: s.childData().cards.length, checkins: s.childData().checkins.length, onboarded: s.isOnboarded() };
  });
  ok('still onboarded after reload', persisted.onboarded === true);
  ok('child name persisted', persisted.name === 'Aria');
  ok('cards persisted', persisted.cards >= 4, 'cards=' + persisted.cards);
  ok('check-ins persisted', persisted.checkins >= 1);
  ok('did NOT re-show onboarding', await page.locator('text=Welcome to Feel Friends').count() === 0);

  // ---- 14. Offline support (service worker) ----
  sec('14. Offline support via service worker');
  // wait for SW to control the page
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 5000 }).catch(() => {});
  const swActive = await page.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
  ok('service worker controls the page', swActive);
  if (swActive) {
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.FeelFriends, null, { timeout: 5000 }).catch(() => {});
    ok('app still loads while OFFLINE', await page.evaluate(() => !!window.FeelFriends));
    await page.locator('.splash').click({ timeout: 800 }).catch(() => {}); // skip splash
    await page.waitForSelector('.grid, .moodgrid', { timeout: 4000 }).catch(() => {});
    ok('home renders offline', await page.locator('.grid, .moodgrid').count() >= 1);
    await context.setOffline(false);
  } else {
    ok('app still loads while OFFLINE (skipped — SW not active in time)', true);
    ok('home renders offline (skipped)', true);
  }

  // ---- 15. No uncaught errors during the whole journey ----
  sec('15. No runtime errors');
  ok('no uncaught page errors', errors.length === 0, errors.slice(0, 3).join(' | '));

  await browser.close();

  console.log('\n' + '='.repeat(54));
  console.log('E2E RESULT: ' + pass + ' passed, ' + fail + ' failed  (' + (pass + fail) + ' assertions)');
  if (fail) { console.log('\nFailures:'); failures.forEach(f => console.log('  - ' + f)); }
  console.log('='.repeat(54));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
