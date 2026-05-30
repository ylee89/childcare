/**
 * Feel Friends — prototype & docs test suite
 *
 * Runs the prototype's real DOM + JS via jsdom and asserts that every screen,
 * navigation path, and interaction handler behaves. Also validates the docs:
 * all relative links resolve and the file set is complete.
 *
 * Run:  node tests/prototype.test.js
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const failures = [];

function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
}
function section(t) { console.log('\n' + t); }

// ---------------------------------------------------------------------------
// 1. Load the prototype into a real DOM and run its scripts
// ---------------------------------------------------------------------------
section('1. Prototype loads & boots');

const htmlPath = path.join(ROOT, 'prototype', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// capture alert() calls so handlers that alert don't blow up
const alerts = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(win) { win.alert = (m) => alerts.push(m); }
});
const { window } = dom;
const { document } = window;

ok('DOM constructed', !!document);
ok('global go() defined', typeof window.go === 'function');
ok('exactly one .screen is active on boot',
   document.querySelectorAll('.screen.active').length === 1);
ok('home is the active boot screen',
   document.querySelector('.screen.active').id === 's-home');

// ---------------------------------------------------------------------------
// 2. Every screen exists and navigation reaches each one
// ---------------------------------------------------------------------------
section('2. Screens & navigation');

const expectedScreens = ['s-home','s-checkin','s-emotion','s-story','s-brave',
  's-empathy','s-choice','s-sticker','s-calm','s-dash'];
expectedScreens.forEach(id =>
  ok('screen exists: ' + id, !!document.getElementById(id)));

// Drive go() to each screen and confirm it becomes the single active screen
expectedScreens.forEach(id => {
  window.go(id);
  const actives = document.querySelectorAll('.screen.active');
  ok('go("' + id + '") activates only that screen',
     actives.length === 1 && actives[0].id === id);
});

// Every go('x') referenced in the source points at a real screen
const goTargets = [...html.matchAll(/go\('([^']+)'\)/g)].map(m => m[1]);
const uniqueGo = [...new Set(goTargets)];
uniqueGo.forEach(t =>
  ok('go() target resolves: ' + t, !!document.getElementById(t)));

// ---------------------------------------------------------------------------
// 3. Every onclick / pointer handler references a defined function
// ---------------------------------------------------------------------------
section('3. Inline handlers reference defined globals');

const handlerAttrs = ['onclick','onpointerdown','onpointerup','onpointerleave'];
const calledFns = new Set();
handlerAttrs.forEach(attr => {
  document.querySelectorAll('[' + attr + ']').forEach(el => {
    const code = el.getAttribute(attr);
    // pull leading identifiers that look like fn calls
    [...code.matchAll(/([a-zA-Z_]\w*)\s*\(/g)].forEach(m => calledFns.add(m[1]));
  });
});
const builtins = new Set(['alert','go']); // go already checked; alert stubbed
calledFns.forEach(fn => {
  if (builtins.has(fn)) return;
  ok('handler fn defined: ' + fn + '()', typeof window[fn] === 'function');
});

// ---------------------------------------------------------------------------
// 4. Mood check-in: 10 emotions render and respond
// ---------------------------------------------------------------------------
section('4. Mood check-in (Emotion Explorer self-awareness)');

const EMOS = ['happy','sad','angry','frustrated','nervous','scared','proud','lonely','excited','confused'];
const moodFaces = document.querySelectorAll('#moodgrid .face');
ok('10 emotion faces rendered', moodFaces.length === 10, 'got ' + moodFaces.length);
const moodLabels = [...moodFaces].map(f => f.querySelector('small').textContent);
ok('all 10 canonical emotions present',
   EMOS.every(e => moodLabels.includes(e)), 'missing: ' + EMOS.filter(e=>!moodLabels.includes(e)));
// tap one and confirm validating (non-corrective) message
moodFaces[2].click(); // angry
const ciToast = document.getElementById('checkinToast');
ok('check-in shows a validating message', ciToast.style.display === 'block' && /okay to feel/i.test(ciToast.textContent));

// ---------------------------------------------------------------------------
// 5. Face Match: no-fail loop (correct collects, wrong redirects gently)
// ---------------------------------------------------------------------------
section('5. Face Match no-fail behaviour');

window.go('s-emotion'); // triggers newMatchRound()
const targetText = document.getElementById('target').textContent.trim();
const targetEmo = targetText.split(' ').pop().toLowerCase();
let faces = [...document.querySelectorAll('#matchFaces .face')];
ok('round renders 4 face options', faces.length === 4, 'got ' + faces.length);
ok('target is among the options',
   faces.some(f => f.querySelector('small').textContent === targetEmo));

// click a WRONG face -> gentle warn toast, NO score concept, round not advanced
const wrong = faces.find(f => f.querySelector('small').textContent !== targetEmo);
wrong.click();
const mToast = document.getElementById('matchToast');
ok('wrong tap gives gentle redirect (warn, not failure)',
   mToast.classList.contains('warn') && !/wrong|no!|incorrect/i.test(mToast.textContent));

// click the CORRECT face -> positive toast + a progress dot lights up
const before = document.querySelectorAll('#matchDots .dot.on').length;
const right = faces.find(f => f.querySelector('small').textContent === targetEmo);
right.click();
ok('correct tap is celebrated', !document.getElementById('matchToast').classList.contains('warn'));
ok('progress dot advances on success',
   document.querySelectorAll('#matchDots .dot.on').length === before + 1);
ok('progress uses dots, never a numeric score',
   document.querySelectorAll('#matchDots .dot').length === 5 &&
   !/\bscore\b|\d+\s*\/\s*\d+/i.test(document.getElementById('s-emotion').textContent));

// ---------------------------------------------------------------------------
// 6. Story Adventures: choices produce consequences + replay, no shaming
// ---------------------------------------------------------------------------
section('6. Story Adventures consequence + replay');

window.go('s-story');
ok('story offers 3 choices', document.querySelectorAll('#storyStage .choice').length === 3);
window.storyOutcome('grab'); // the "less helpful" choice
const stageTxt = document.getElementById('storyStage').textContent;
ok('less-helpful choice plays a non-shaming consequence',
   /try another way/i.test(stageTxt) && !/bad job|wrong|fail/i.test(stageTxt));
ok('a "try another way" replay is offered',
   [...document.querySelectorAll('#storyStage .choice')].some(c => /try another way/i.test(c.textContent)));
window.resetStory();
ok('resetStory restores the original 3 choices',
   document.querySelectorAll('#storyStage .choice').length === 3);

// ---------------------------------------------------------------------------
// 7. Brave Voice: record interaction is celebrated & stays local
// ---------------------------------------------------------------------------
section('7. Brave Voice practice');

window.go('s-brave');
window.micStart();
ok('mic enters recording state', document.getElementById('micBtn').classList.contains('rec'));
window.micStop();
const bToast = document.getElementById('braveToast');
ok('practice is praised for using the voice', /brave voice/i.test(bToast.textContent));
ok('messaging reassures recording stays on-device', /device/i.test(bToast.textContent));

// ---------------------------------------------------------------------------
// 8. Empathy Lab: correct feeling identification guided gently
// ---------------------------------------------------------------------------
section('8. Empathy Lab');

window.go('s-empathy');
const empFaces = [...document.querySelectorAll('#empFaces .face')];
ok('empathy offers feeling choices', empFaces.length === 4);
empFaces.find(f => f.querySelector('small').textContent === 'sad').click();
ok('identifying "sad" prompts a helping action',
   /help/i.test(document.getElementById('empToast').textContent));

// ---------------------------------------------------------------------------
// 9. Good Choice: positive reinforcement, gentle re-try
// ---------------------------------------------------------------------------
section('9. Good Choice Challenge');

window.go('s-choice');
window.choiceOut(true);
ok('positive choice reinforced warmly', !document.getElementById('choiceToast').classList.contains('warn'));
window.choiceOut(false);
ok('other choice invites a re-try, no punishment',
   document.getElementById('choiceToast').classList.contains('warn') &&
   /again/i.test(document.getElementById('choiceToast').textContent));

// ---------------------------------------------------------------------------
// 10. Calm Corner: breathing starts/stops, distinct calm styling, no fanfare
// ---------------------------------------------------------------------------
section('10. Calm Corner regulation');

window.go('s-calm');
ok('calm menu visible on entry', document.getElementById('calmMenu').style.display !== 'none');
window.startBalloon();
ok('balloon activity shows', document.getElementById('calmBalloon').style.display === 'block');
ok('breathing label set', /breathe/i.test(document.getElementById('breathLabel').textContent));
window.stopBalloon();
ok('stopping returns to calm menu', document.getElementById('calmBalloon').style.display === 'none');

// ---------------------------------------------------------------------------
// 11. Safety invariants in Child Mode (the whole point of the app)
// ---------------------------------------------------------------------------
section('11. Child-safe invariants');

const childIds = ['s-home','s-checkin','s-emotion','s-story','s-brave','s-empathy','s-choice','s-sticker','s-calm'];
const childHtml = childIds.map(id => document.getElementById(id).innerHTML).join('\n');
ok('no <a href> external links anywhere in child screens',
   !/<a\s+[^>]*href=/i.test(childHtml));
ok('no http(s):// links in child screens', !/https?:\/\//i.test(childHtml));
ok('no ad / purchase / buy language in child screens',
   !/\b(buy now|purchase|advertisement|in-app|subscribe now)\b/i.test(childHtml));
// persistent nav present on the main play screens
['s-emotion','s-story','s-brave','s-empathy','s-choice','s-sticker'].forEach(id => {
  const s = document.getElementById(id);
  ok(id + ' has persistent Home + Calm nav',
     !!s.querySelector('.nav .home') && !!s.querySelector('.nav .calm'));
});
// parent gate key is present but understated on home
ok('home has an understated grown-up key', !!document.querySelector('#s-home .keybtn'));

// ---------------------------------------------------------------------------
// 12. Touch-target sizing tokens honour the 88pt child minimum
// ---------------------------------------------------------------------------
section('12. Design-system touch targets');
ok('--touch token is 88px in prototype CSS', /--touch:\s*88px/.test(html));
ok('persistent nav buttons are 64px', /\.nav\s+\.home,\.nav\s+\.calm\{[^}]*width:64px/.test(html));

// ---------------------------------------------------------------------------
// 13. Documentation: required files exist
// ---------------------------------------------------------------------------
section('13. Documentation completeness');

const requiredDocs = [
  'README.md',
  'docs/01-information-architecture.md',
  'docs/02-user-flows.md',
  'docs/03-wireframes.md',
  'docs/04-design-system.md',
  'docs/05-gamification-strategy.md',
  'docs/06-mvp-feature-list.md',
  'docs/07-future-roadmap.md',
  'docs/08-content-library.md',
  'docs/09-safety-privacy-accessibility.md',
  'docs/10-reference-breathe-think-do.md',
  'prototype/index.html',
];
requiredDocs.forEach(f =>
  ok('exists: ' + f, fs.existsSync(path.join(ROOT, f))));

// ---------------------------------------------------------------------------
// 14. Documentation: every relative markdown link resolves
// ---------------------------------------------------------------------------
section('14. Markdown internal links resolve');

const mdFiles = ['README.md', ...fs.readdirSync(path.join(ROOT,'docs')).map(f=>'docs/'+f)];
let linkCount = 0;
mdFiles.forEach(rel => {
  const dir = path.dirname(path.join(ROOT, rel));
  const txt = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  [...txt.matchAll(/\]\(([^)]+)\)/g)].forEach(m => {
    let target = m[1].trim();
    if (/^https?:|^#|^mailto:/i.test(target)) return; // skip external/anchors
    target = target.split('#')[0];
    if (!target) return;
    linkCount++;
    const resolved = path.resolve(dir, target);
    ok('[' + rel + '] link -> ' + m[1], fs.existsSync(resolved));
  });
});
ok('found a meaningful number of internal links', linkCount >= 10, 'count=' + linkCount);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(54));
console.log('RESULT: ' + pass + ' passed, ' + fail + ' failed  (' + (pass+fail) + ' assertions)');
if (fail) { console.log('\nFailures:'); failures.forEach(f => console.log('  - ' + f)); }
console.log('='.repeat(54));
process.exit(fail ? 1 : 0);
