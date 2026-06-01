// Feel Friends — application shell, router, and screens (vanilla, no build).
import { Store } from './store.js';
import { Audio } from './audio.js';
import {
  EMOTIONS, emo, SITUATIONS, STORIES, PHRASES, phrase,
  EMPATHY, CHOICES, MISSIONS, AVATARS, AGE_BANDS,
} from './content.js';
import { storyScene, storyOutcomeArt, mascot } from './illustrations.js';

const root = document.getElementById('app');

/* ---------- tiny DOM helper ---------- */
function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  kids.flat().forEach(k => e.append(k?.nodeType ? k : document.createTextNode(k ?? '')));
  return e;
}
const sample = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/* ---------- router ---------- */
const routes = {};
const route = (name, fn) => (routes[name] = fn);
let current = null;

function go(name, params = {}) {
  Audio.stop();
  current = { name, params };
  root.innerHTML = '';
  document.body.dataset.mode =
    name === 'calm' ? 'calm' : (name === 'dashboard' || name === 'settings' || name === 'gate') ? 'adult' : 'child';
  const view = (routes[name] || routes.home)(params);
  root.append(view);
  root.scrollTop = 0;
}
window.FeelFriends = { go, Store, get current() { return current; } }; // for tests / debugging

/* ---------- shared layout pieces ---------- */
function topbar(title, { back = null, gate = true } = {}) {
  return h('div', { class: 'topbar' },
    back ? h('button', { class: 'back', 'aria-label': 'Back', onclick: () => go(back) }, '←') : h('span'),
    h('h1', {}, title),
    gate ? h('button', { class: 'keybtn', 'aria-label': 'Grown-ups', onclick: () => go('gate') }, '🔑') : h('span'));
}
function persistentNav() {
  return h('nav', { class: 'nav' },
    h('button', { class: 'home', 'aria-label': 'Home', onclick: () => go('home') }, '🏠'),
    h('button', { class: 'calm', 'aria-label': 'Calm Corner', onclick: () => go('calm') }, '🫧'));
}
// narrate prompt text and return the element.
// speak=false makes it tap-to-read only (use when another call narrates it),
// so we never double-fire speech and cut the line off.
function narrated(text, cls = 'prompt', speak = true) {
  const e = h('div', { class: cls, onclick: () => Audio.speak(text) }, text);
  if (speak) setTimeout(() => Audio.speak(text), 120);
  return e;
}
function toast(parent, text, kind = '') {
  let t = parent.querySelector('.toast');
  if (!t) { t = h('div', { class: 'toast' }); parent.append(t); }
  t.className = 'toast ' + kind;
  t.textContent = text;
  t.style.display = 'block';
  return t;
}

// A choice button that reads its own label aloud when tapped, then runs onPick.
// `spoken` lets us narrate something cleaner than the visible label if needed.
function choiceButton(emoji, label, onPick, spoken) {
  return h('button', { class: 'choice', onclick: () => {
    Audio.speak(spoken || label);
    onPick();
  } }, h('span', { class: 'ce' }, emoji), label,
    h('span', { class: 'choice-speak', 'aria-hidden': 'true' }, '🔊'));
}

// Auto-narrate a scene: read the prompt, then each choice label in order, so a
// non-reader hears every option. Call after appending the buttons.
function narrateScene(promptText, choiceLabels) {
  const items = [promptText, ...choiceLabels.map((l, i) => `Choice ${i + 1}. ${l}`)];
  setTimeout(() => Audio.speakSeq(items), 200);
}

// Reusable inline voice recorder. Lets a child record themselves, play it back,
// and delete it. Falls back to "say it out loud" echo mode without a mic.
// key: storage id for the recording. label: what to say/practise.
function recorderWidget(key, label, onDone) {
  const wrap = h('div', { class: 'rec-widget' });
  const status = h('div', { class: 'mic-label' }, 'tap to record');
  const micBtn = h('button', { class: 'mic small', 'aria-label': 'Record yourself' }, '🎤');
  const controls = h('div', { class: 'rowbtns' });
  wrap.append(h('div', { class: 'center' }, micBtn, status, controls));

  let mediaRecorder = null, chunks = [], stream = null;

  function showSaved() {
    const rec = Store.recording(key);
    controls.innerHTML = '';
    if (rec) {
      const audioEl = new window.Audio(rec.dataUrl);
      controls.append(
        h('button', { class: 'pill-btn', onclick: () => audioEl.play() }, '▶ Hear me'),
        h('button', { class: 'pill-btn ghost', onclick: () => { Store.deleteRecording(key); showSaved(); } }, '🗑 Delete'));
    }
  }
  async function startRec() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const r = new FileReader();
        r.onload = () => { Store.saveRecording(key, r.result); showSaved(); };
        r.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      micBtn.classList.add('rec'); status.textContent = 'listening… (tap to stop)';
    } catch { echoMode(); }
  }
  function stopRec() {
    micBtn.classList.remove('rec'); status.textContent = 'tap to record';
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    Audio.chime();
    if (onDone) onDone(true);
  }
  function echoMode() {
    micBtn.textContent = '🔊';
    status.textContent = 'Say it out loud!';
    micBtn.onclick = () => { Audio.speak(label); if (onDone) onDone(false); };
  }
  if (navigator.mediaDevices && window.MediaRecorder) {
    micBtn.onclick = () => (micBtn.classList.contains('rec') ? stopRec() : startRec());
  } else { echoMode(); }
  showSaved();
  return wrap;
}

/* ===================================================================== */
/* ONBOARDING                                                            */
/* ===================================================================== */
route('onboarding', () => {
  let name = '', ageBand = '4-5', avatar = '🐻';
  const wrap = h('div', { class: 'screen pad' });
  const avatarRow = h('div', { class: 'chiprow' });
  AVATARS.forEach(a => {
    const b = h('button', { class: 'chip big' + (a === avatar ? ' on' : ''), onclick: () => {
      avatar = a; [...avatarRow.children].forEach(c => c.classList.remove('on')); b.classList.add('on');
    } }, a);
    avatarRow.append(b);
  });
  const ageRow = h('div', { class: 'chiprow' });
  AGE_BANDS.forEach(ab => {
    const b = h('button', { class: 'chip' + (ab === ageBand ? ' on' : ''), onclick: () => {
      ageBand = ab; [...ageRow.children].forEach(c => c.classList.remove('on')); b.classList.add('on');
    } }, ab);
    ageRow.append(b);
  });
  const nameInput = h('input', { class: 'textinput', type: 'text', maxlength: '16',
    placeholder: 'First name (or leave blank)', oninput: e => name = e.target.value });

  wrap.append(
    h('div', { class: 'mascot' }, '🐻'),
    h('h1', { class: 'center-title' }, 'Welcome to Feel Friends'),
    h('p', { class: 'sub' }, 'Made for ages 3–6. A grown-up helps set up — just once.'),
    h('label', { class: 'flabel' }, "Child's name"), nameInput,
    h('label', { class: 'flabel' }, 'Age'), ageRow,
    h('label', { class: 'flabel' }, 'Pick a friend'), avatarRow,
    h('button', { class: 'pill-btn block', onclick: () => {
      Store.addChild({ name: name.trim(), ageBand, avatar });
      go('home');
    } }, "Let's go! 💛"),
  );
  return wrap;
});

/* ===================================================================== */
/* HOME — Friendly Town                                                   */
/* ===================================================================== */
route('home', () => {
  const child = Store.child();
  const wrap = h('div', { class: 'screen' });
  const worlds = [
    ['emotion', '😊', 'Emotion Explorer', 't-emotion'],
    ['stories', '📖', 'Story Adventures', 't-story'],
    ['brave',   '🗣️', 'Brave Voice', 't-brave'],
    ['empathy', '💜', 'Empathy Lab', 't-empathy'],
    ['choice',  '✅', 'Good Choice', 't-choice'],
    ['sticker', '📚', 'Sticker Book', 't-sticker'],
  ];
  const grid = h('div', { class: 'grid' });
  worlds.forEach(([r, ico, label, cls]) =>
    grid.append(h('button', { class: 'tile ' + cls, onclick: () => { Audio.speak(label); go(r); } },
      h('span', { class: 'ico' }, ico), label)));

  wrap.append(
    h('div', { class: 'topbar' },
      h('div', { class: 'greet' }, `☀️ Hi, ${child?.name || 'Friend'}!`),
      h('button', { class: 'keybtn', onclick: () => go('gate') }, '🔑')),
    h('div', { class: 'mascot', onclick: () => Audio.speak(`Hi ${child?.name || 'friend'}! What would you like to do?`) }, child?.avatar || '🐻'),
    h('div', { class: 'brand', onclick: () => Audio.speak('Feel Friends') },
      h('span', { class: 'brand-logo', html: mascot(34) }),
      h('span', { class: 'brand-name' }, 'Feel Friends')),
    grid, persistentNav(),
  );
  // gentle daily check-in suggestion (skippable)
  if (!Store.todaysCheckIn()) setTimeout(() => go('checkin'), 350);
  return wrap;
});

/* ===================================================================== */
/* MOOD CHECK-IN                                                          */
/* ===================================================================== */
route('checkin', () => {
  const wrap = h('div', { class: 'screen pad' });
  const grid = h('div', { class: 'moodgrid' });
  EMOTIONS.forEach(e => {
    grid.append(h('button', { class: 'face', style: `--c:${e.color}`, onclick: () => {
      Store.checkIn(e.key);
      Store.collectCard(e.key);
      Audio.chime();
      step2(e);
    } }, h('span', { class: 'fe' }, e.emoji), h('small', {}, e.key)));
  });
  wrap.append(
    h('div', { class: 'topbar' }, h('span'), h('span'),
      h('button', { class: 'keybtn', onclick: () => go('home') }, '☁️ later')),
    narrated('How are you feeling today?'),
    grid,
    h('button', { class: 'pill-btn ghost block', onclick: () => go('home') }, 'All done'),
  );
  function step2(e) {
    wrap.innerHTML = '';
    const msg = `You feel ${e.key}. It's okay to feel ${e.key}.`;
    wrap.append(
      h('div', { class: 'mascot', style: `background:${e.color}` }, e.emoji),
      narrated(msg),
      h('div', { class: 'rowbtns' },
        h('button', { class: 'pill-btn ghost', onclick: () => go('home') }, 'Back home'),
        ...(['sad','angry','scared','nervous','lonely','frustrated'].includes(e.key)
          ? [h('button', { class: 'pill-btn mint', onclick: () => go('calm') }, 'Visit Calm Corner 🫧')]
          : [])),
    );
  }
  return wrap;
});

/* ===================================================================== */
/* EMOTION EXPLORER                                                       */
/* ===================================================================== */
route('emotion', () => {
  const wrap = h('div', { class: 'screen pad' });
  wrap.append(
    topbar('Emotion Explorer', { back: 'home' }),
    narrated('Pick a feelings game!'),
    h('div', { class: 'menu' },
      menuTile('😊', 'Mood Check-in', () => go('checkin')),
      menuTile('🔎', 'Face Match', () => go('facematch')),
      menuTile('💭', 'Name That Feeling', () => go('nametfeeling')),
      menuTile('🃏', 'My Feeling Cards', () => go('cards'))),
    persistentNav());
  return wrap;
});
function menuTile(ico, label, onclick) {
  return h('button', { class: 'menu-tile', onclick: () => { Audio.speak(label); onclick(); } },
    h('span', { class: 'ico' }, ico), label);
}

route('facematch', () => {
  const wrap = h('div', { class: 'screen pad' });
  const rounds = Store.child()?.ageBand === '3-4' ? 3 : 5;
  let done = 0;
  const head = narrated('Find the friend who feels…');
  const target = h('div', { class: 'target' });
  const faces = h('div', { class: 'faces' });
  const dots = h('div', { class: 'dots' });
  wrap.append(topbar('Face Match', { back: 'emotion' }), head, target, faces, dots, persistentNav());

  function drawDots() {
    dots.innerHTML = '';
    for (let i = 0; i < rounds; i++) dots.append(h('span', { class: 'dot' + (i < done ? ' on' : '') }));
  }
  function round() {
    const t = sample(EMOTIONS, 1)[0];
    const opts = shuffle([t, ...sample(EMOTIONS.filter(e => e.key !== t.key), 3)]);
    target.innerHTML = '';
    target.append(h('span', { class: 'tface' }, t.emoji), h('b', {}, t.key.toUpperCase()));
    Audio.speak(`Find the friend who feels ${t.key}`);
    faces.innerHTML = '';
    opts.forEach(o => {
      const b = h('button', { class: 'face', style: `--c:${o.color}`, onclick: () => {
        if (o.key === t.key) {
          b.classList.add('wiggle'); Audio.chime();
          Store.collectCard(o.key); Store.logEvent('emotion', 'facematch', { emotion: o.key });
          toast(wrap, `Yes! That's ${o.key}! ⭐ Card collected.`, 'ok');
          done = Math.min(done + 1, rounds); drawDots();
          setTimeout(() => { if (done < rounds) round(); else finish(); }, 1100);
        } else {
          Audio.boop();
          toast(wrap, `That friend feels ${o.key}. Can you find ${t.key}?`, 'warn');
        }
      } }, h('span', { class: 'fe' }, o.emoji), h('small', {}, o.key));
      faces.append(b);
    });
  }
  function finish() {
    Store.earnSticker('emotion', 'Feelings Finder');
    Audio.pop();
    toast(wrap, 'You found all the feelings! ⭐ Sticker earned.', 'ok');
    faces.innerHTML = '';
    faces.append(h('button', { class: 'pill-btn', onclick: () => { done = 0; drawDots(); round(); } }, 'Play again'),
      h('button', { class: 'pill-btn ghost', onclick: () => go('cards') }, 'See my cards'));
  }
  drawDots(); round();
  return wrap;
});

route('nametfeeling', () => {
  const wrap = h('div', { class: 'screen pad' });
  let done = 0; const total = 4;
  const promptEl = h('div', { class: 'prompt' });
  const faces = h('div', { class: 'faces' });
  wrap.append(topbar('Name That Feeling', { back: 'emotion' }), promptEl, faces, persistentNav());
  function round() {
    const s = sample(SITUATIONS, 1)[0];
    const correct = emo(s.answer);
    const opts = shuffle([correct, ...sample(EMOTIONS.filter(e => e.key !== correct.key), 3)]);
    promptEl.textContent = s.text; Audio.speak(s.text + ' How do they feel?');
    faces.innerHTML = '';
    opts.forEach(o => {
      const b = h('button', { class: 'face', style: `--c:${o.color}`, onclick: () => {
        if (o.key === correct.key) {
          Audio.chime(); Store.collectCard(o.key); Store.logEvent('emotion', 'nametfeeling', { emotion: o.key });
          toast(wrap, `Yes — that feels ${o.key}! ⭐`, 'ok');
          done++; setTimeout(() => { if (done < total) round(); else { Store.earnSticker('emotion','Feeling Namer'); toast(wrap,'Great naming! ⭐ Sticker earned.','ok'); } }, 1000);
        } else { Audio.boop(); toast(wrap, `Hmm, look again. Could it be something else?`, 'warn'); }
      } }, h('span', { class: 'fe' }, o.emoji), h('small', {}, o.key));
      faces.append(b);
    });
  }
  round();
  return wrap;
});

route('cards', () => {
  const wrap = h('div', { class: 'screen pad' });
  const deck = h('div', { class: 'deck' });
  EMOTIONS.forEach(e => {
    const owned = Store.hasCard(e.key);
    const c = h('button', { class: 'card3d' + (owned ? '' : ' locked'), style: `--c:${e.color}`, onclick: () => {
      if (owned) { c.classList.toggle('flip'); if (c.classList.contains('flip')) Audio.speak(`${e.key}. ${e.def} ${e.helps}`); }
      else Audio.speak('Keep playing to find this feeling card.');
    } },
      h('div', { class: 'c-front' }, h('span', { class: 'fe' }, owned ? e.emoji : '❓'), h('small', {}, owned ? e.key : '???')),
      h('div', { class: 'c-back' }, h('b', {}, e.key), h('p', {}, e.def), h('p', { class: 'helps' }, '💡 ' + e.helps)));
    deck.append(c);
  });
  const n = Store.childData().cards.length;
  wrap.append(topbar('My Feeling Cards', { back: 'emotion' }),
    h('div', { class: 'count' }, `${n} / 10 feelings found`), deck, persistentNav());
  return wrap;
});

/* ===================================================================== */
/* STORY ADVENTURES                                                       */
/* ===================================================================== */
route('stories', () => {
  const wrap = h('div', { class: 'screen pad' });
  const list = h('div', { class: 'menu' });
  STORIES.forEach(s => list.append(menuTile(s.emoji, s.title, () => go('story', { id: s.id }))));
  wrap.append(topbar('Story Adventures', { back: 'home' }), narrated('Pick a story.'), list, persistentNav());
  return wrap;
});

route('story', ({ id }) => {
  const story = STORIES.find(s => s.id === id) || STORIES[0];
  const wrap = h('div', { class: 'screen pad' });
  const stage = h('div', { class: 'stage' });
  wrap.append(topbar(story.title, { back: 'stories' }), stage, persistentNav());

  // the full content script: story scene + the question, read as one line
  const prompt = story.scene + ' What could you do?';
  function ask() {
    stage.innerHTML = '';
    // animation "scene" with a video-style play button overlaid; tap to (re)play
    const scene = h('div', { class: 'scene illus has-play', onclick: () => Audio.speak(prompt),
      html: storyScene(story.id) });
    scene.append(
      h('button', { class: 'play-overlay', 'aria-label': 'Play story',
        onclick: (e) => { e.stopPropagation(); Audio.speak(prompt); } }, '▶'));
    stage.append(
      scene,
      h('div', { class: 'prompt script-text', onclick: () => Audio.speak(prompt) }, prompt));
    story.choices.forEach(c => stage.append(
      choiceButton(c.emoji, c.label, () => outcome(c))));
    // read the full script first, then every choice aloud, for non-readers
    narrateScene(prompt, story.choices.map(c => c.label));
  }
  function outcome(c) {
    Store.logEvent('stories', story.id, { good: c.good });
    if (c.good) Audio.chime(); else Audio.boop();
    stage.innerHTML = '';
    stage.append(
      h('div', { class: 'scene illus', html: storyOutcomeArt(c.good) }),
      narrated(c.outcome));

    if (c.good) {
      Store.earnSticker('story', 'Story Solver');
      // let the child say the brave words and record themselves to hear it back
      if (c.bravePhrase) {
        const p = phrase(c.bravePhrase);
        stage.append(
          h('div', { class: 'say-prompt', onclick: () => Audio.speak(`Now you try. Say: ${p.text}`) },
            `Now you try! Say: “${p.text}” 💪`),
          recorderWidget('story-' + story.id + '-' + c.bravePhrase, p.text, () => {
            toast(wrap, 'You used your brave voice! 💪 (stays on this device)', 'ok');
          }));
        setTimeout(() => Audio.speakSeq([c.outcome, `Now you try. Say: ${p.text}`]), 200);
      }
    }
    stage.append(choiceButton('↺', 'Try another way', ask, 'Try another way'));
    if (c.good) stage.append(choiceButton('✅', 'Keep going', () => go('stories'), 'Keep going'));
  }
  ask();
  return wrap;
});

/* ===================================================================== */
/* BRAVE VOICE                                                            */
/* ===================================================================== */
route('brave', () => {
  const wrap = h('div', { class: 'screen pad' });
  const list = h('div', { class: 'menu' });
  PHRASES.forEach(p => list.append(menuTile('🗣️', `"${p.text}"`, () => go('brave-practice', { id: p.id }))));
  wrap.append(topbar('Brave Voice', { back: 'home' }), narrated('Pick a brave phrase to practice.'), list, persistentNav());
  return wrap;
});

route('brave-practice', ({ id }) => {
  const p = phrase(id) || PHRASES[0];
  const wrap = h('div', { class: 'screen pad' });
  wrap.append(topbar('Brave Voice', { back: 'brave' }));
  wrap.append(narrated(`Mochi says: ${p.text}`));
  wrap.append(h('p', { class: 'sub', onclick: () => Audio.speak(p.when) }, p.when));

  const status = h('div', { class: 'mic-label' }, 'tap to try');
  const micBtn = h('button', { class: 'mic' }, '🎤');
  const controls = h('div', { class: 'rowbtns' });
  wrap.append(h('div', { class: 'center' },
    h('div', { class: 'try' }, 'Now you try! 💪'),
    micBtn, status, controls), persistentNav());

  let mediaRecorder = null, chunks = [], stream = null, micOK = true;

  function showSaved() {
    const rec = Store.recording(p.id);
    controls.innerHTML = '';
    if (rec) {
      const audioEl = new window.Audio(rec.dataUrl);
      controls.append(
        h('button', { class: 'pill-btn', onclick: () => audioEl.play() }, '▶ Hear me'),
        h('button', { class: 'pill-btn ghost', onclick: () => { Store.deleteRecording(p.id); showSaved(); } }, '🗑 Delete'));
    }
  }

  async function startRec() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const r = new FileReader();
        r.onload = () => { Store.saveRecording(p.id, r.result); showSaved(); };
        r.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      micBtn.classList.add('rec'); status.textContent = 'listening… (tap to stop)';
    } catch {
      micOK = false; echoMode();
    }
  }
  function stopRec() {
    micBtn.classList.remove('rec'); status.textContent = 'tap to try';
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    Store.logEvent('brave', p.id, { recorded: true });
    Store.earnSticker('brave', 'Brave Voice');
    Audio.chime();
    toast(wrap, 'You used your brave voice! 💪 (stays on this device)', 'ok');
  }
  function echoMode() {
    micBtn.textContent = '🔊';
    status.textContent = 'Say it out loud with Mochi!';
    micBtn.onclick = () => {
      Audio.speak(p.text);
      Store.logEvent('brave', p.id, { recorded: false });
      Store.earnSticker('brave', 'Brave Voice');
      setTimeout(() => toast(wrap, 'You used your brave voice! 💪', 'ok'), 600);
    };
  }

  if (navigator.mediaDevices && window.MediaRecorder) {
    micBtn.onclick = () => (micBtn.classList.contains('rec') ? stopRec() : startRec());
  } else {
    echoMode();
  }
  showSaved();
  return wrap;
});

/* ===================================================================== */
/* CALM CORNER                                                            */
/* ===================================================================== */
route('calm', () => {
  const wrap = h('div', { class: 'screen pad calm' });
  wrap.append(
    h('div', { class: 'topbar' }, h('button', { class: 'back', onclick: () => go('home') }, '←'),
      h('h1', {}, 'Calm Corner'), h('span')),
    narrated('Pick a calm thing.'),
    h('div', { class: 'calm-grid' },
      calmTile('🎈', 'Balloon Breathing', balloon),
      calmTile('✨', 'Glitter Jar', glitter),
      calmTile('🔢', 'Counting Calm', counting),
      calmTile('🎧', 'Quiet Listen', quiet)));
  const stageHost = h('div', { class: 'calm-stage' });
  wrap.append(stageHost);

  function calmTile(ico, label, fn) {
    return h('button', { class: 'calm-tile', onclick: () => { Audio.speak(label); fn(); } },
      h('span', { class: 'ico' }, ico), label);
  }
  function clearMenu(title) {
    wrap.querySelectorAll('.prompt,.calm-grid').forEach(n => n.remove());
    stageHost.innerHTML = '';
  }
  function backBtn() {
    return h('button', { class: 'pill-btn mint', onclick: () => { Audio.stop(); Store.logEvent('calm', 'session'); go('calm'); } }, 'I feel calmer');
  }

  function balloon() {
    clearMenu();
    const bal = h('div', { class: 'balloon' });
    const label = h('div', { class: 'breath-label' }, 'Breathe in…');
    stageHost.append(bal, label, backBtn());
    let inhale = true;
    const cycle = () => {
      if (Store.settings.reduceMotion) bal.style.opacity = inhale ? '1' : '.5';
      else bal.classList.toggle('in', inhale);
      label.textContent = inhale ? 'Breathe in…' : '…and out…';
      Audio.speak(inhale ? 'Breathe in' : 'and out', { rate: 0.8 });
      inhale = !inhale;
    };
    cycle();
    const timer = setInterval(cycle, 5000);
    stageHost.dataset.cleanup = '1';
    stageHost._timer = timer;
  }
  function glitter() {
    clearMenu();
    const canvas = h('canvas', { class: 'glitter', width: '300', height: '380' });
    stageHost.append(h('div', { class: 'breath-label' }, 'Shake it up, then watch it settle ✨'), canvas, backBtn());
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let parts = Array.from({ length: 120 }, () => ({
      x: Math.random() * W, y: Math.random() * H, vy: Math.random() * 2 + 0.3,
      r: Math.random() * 3 + 1, c: ['#FFD56B','#FF8FC7','#7CC6FE','#9BE3B4'][Math.floor(Math.random()*4)] }));
    canvas.onclick = () => { parts.forEach(p => { p.y = Math.random() * H * 0.4; p.vy = Math.random()*2+0.3; }); Audio.pop(); };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(0,0,W,H);
      parts.forEach(p => {
        if (p.y < H - p.r) p.y += p.vy; else p.vy = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = p.c; ctx.fill();
      });
      stageHost._raf = requestAnimationFrame(draw);
    }
    draw();
  }
  function counting() {
    clearMenu();
    const steps = ['Find 5 things you can SEE 👀','Find 4 things you can HEAR 👂','Find 3 things you can TOUCH ✋','Take 2 slow breaths 🌬️','Give yourself 1 big hug 🤗'];
    let i = 0;
    const label = h('div', { class: 'breath-label' });
    const next = h('button', { class: 'pill-btn mint', onclick: () => {
      i++; if (i < steps.length) { label.textContent = steps[i]; Audio.speak(steps[i]); }
      else { Store.logEvent('calm', 'counting'); go('calm'); }
    } }, 'Next');
    label.textContent = steps[0]; Audio.speak(steps[0]);
    stageHost.append(label, next);
  }
  function quiet() {
    clearMenu();
    stageHost.append(h('div', { class: 'breath-label' }, 'Close your eyes and just listen 🎧'), backBtn());
    Audio.speak('Close your eyes, and just listen. You are safe and calm.', { rate: 0.8 });
  }
  return wrap;
});

/* ===================================================================== */
/* EMPATHY LAB                                                            */
/* ===================================================================== */
route('empathy', () => {
  const wrap = h('div', { class: 'screen pad' });
  const stage = h('div', {});
  wrap.append(topbar('Empathy Lab', { back: 'home' }), stage, persistentNav());
  let idx = 0;
  function round() {
    const item = EMPATHY[idx % EMPATHY.length];
    const correct = emo(item.answer);
    const opts = shuffle([correct, ...sample(EMOTIONS.filter(e => e.key !== correct.key), 3)]);
    const prompt = item.text + ' How do they feel?';
    stage.innerHTML = '';
    const f = h('div', { class: 'faces' });
    opts.forEach(o => f.append(h('button', { class: 'face', style: `--c:${o.color}`, onclick: () => {
      Audio.speak(o.key); // read the chosen feeling so non-readers hear it
      if (o.key === correct.key) {
        Audio.chime(); Store.logEvent('empathy', 'feel', { emotion: o.key }); Store.earnSticker('empathy', 'Kind Heart');
        stage.innerHTML = '';
        stage.append(h('div', { class: 'scene' }, item.emoji), narrated(`Yes — they feel ${o.key}. ${item.help}`),
          h('button', { class: 'pill-btn', onclick: () => { idx++; round(); } }, 'Next friend'),
          h('button', { class: 'pill-btn ghost', onclick: mission }, 'Kindness Mission 🌟'));
      } else { Audio.boop(); toast(wrap, 'Look at their face… try again.', 'warn'); }
    } }, h('span', { class: 'fe' }, o.emoji), h('small', {}, o.key))));
    stage.append(h('div', { class: 'scene' }, item.emoji), narrated(prompt), f);
    // read the prompt then each feeling option aloud
    narrateScene(prompt, opts.map(o => o.key));
  }
  function mission() {
    const m = sample(MISSIONS, 1)[0];
    stage.innerHTML = '';
    stage.append(h('div', { class: 'scene' }, '🌟'), narrated('Your kindness mission: ' + m),
      h('button', { class: 'pill-btn mint', onclick: () => { Store.completeMission(m); Audio.pop(); toast(wrap,'Mission accepted! Try it today. 💛','ok'); } }, "I'll do it!"),
      h('button', { class: 'pill-btn ghost', onclick: () => { idx++; round(); } }, 'Back'));
  }
  round();
  return wrap;
});

/* ===================================================================== */
/* GOOD CHOICE                                                            */
/* ===================================================================== */
route('choice', () => {
  const wrap = h('div', { class: 'screen pad' });
  const stage = h('div', {});
  wrap.append(topbar('Good Choice', { back: 'home' }), stage, persistentNav());
  let idx = 0, score = 0;
  function round() {
    const c = CHOICES[idx % CHOICES.length];
    const opts = shuffle([{ ...c.good, good: true }, { ...c.bad, good: false }]);
    stage.innerHTML = '';
    stage.append(h('div', { class: 'scene' }, c.emoji), narrated(c.text));
    opts.forEach(o => stage.append(choiceButton(o.emoji, o.label, () => {
      Store.logEvent('choice', 'round', { good: o.good });
      if (o.good) { Audio.chime(); score++; show(o.outcome, true); }
      else { Audio.boop(); show(o.outcome, false); }
    })));
    // read the situation then each choice aloud
    narrateScene(c.text, opts.map(o => o.label));
  }
  function show(text, good) {
    stage.innerHTML = '';
    const btns = good
      ? [h('button', { class: 'pill-btn', onclick: () => { idx++; if (idx >= CHOICES.length) finish(); else round(); } }, 'Next')]
      : [h('button', { class: 'pill-btn ghost', onclick: round }, 'Try again')];
    stage.append(h('div', { class: 'scene' }, good ? '🌟' : '🤔'), narrated(text), ...btns);
  }
  function finish() {
    Store.earnSticker('choice', 'Good Chooser');
    stage.innerHTML = '';
    stage.append(h('div', { class: 'scene' }, '🏆'), narrated('You made great choices! ⭐ Sticker earned.'),
      h('button', { class: 'pill-btn', onclick: () => { idx = 0; round(); } }, 'Play again'));
  }
  round();
  return wrap;
});

/* ===================================================================== */
/* STICKER BOOK                                                           */
/* ===================================================================== */
route('sticker', () => {
  const wrap = h('div', { class: 'screen pad' });
  const d = Store.childData();
  const stickerEmoji = { emotion:'⭐', story:'📖', brave:'💪', empathy:'💜', choice:'✅', calm:'🎈' };
  const counts = {};
  d.stickers.forEach(s => counts[s.id] = (counts[s.id] || 0) + 1);
  const shelf = h('div', { class: 'shelf' });
  if (d.stickers.length === 0) shelf.append(h('p', { class: 'sub' }, 'Play the worlds to earn stickers!'));
  Object.entries(counts).forEach(([id, n]) =>
    shelf.append(h('div', { class: 'sticker' }, h('span', { class: 'se' }, stickerEmoji[id] || '⭐'), h('small', {}, '×' + n))));

  wrap.append(topbar('My Collection', { back: 'home' }),
    h('div', { class: 'card-lite' }, h('h3', {}, `Feeling cards: ${d.cards.length}/10`),
      h('div', { class: 'mini-deck' }, ...EMOTIONS.map(e => h('span', { class: 'mini' + (Store.hasCard(e.key) ? '' : ' off') }, Store.hasCard(e.key) ? e.emoji : '❓')))),
    h('div', { class: 'card-lite' }, h('h3', {}, 'Stickers I earned'), shelf),
    h('div', { class: 'card-lite' }, h('h3', {}, 'Friends I met'),
      h('div', { class: 'friends' }, '🐻 Mochi  🐰 Pip  🦊 Fen  🦉 Luna')),
    persistentNav());
  return wrap;
});

/* ===================================================================== */
/* PARENT GATE                                                            */
/* ===================================================================== */
route('gate', () => {
  const wrap = h('div', { class: 'screen pad gate' });
  const a = 2 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 6);
  let entry = '', held = false, holdTimer = null;
  const display = h('div', { class: 'gate-eq' }, `${a} + ${b} = ?`);
  const answerEl = h('div', { class: 'gate-answer' }, '_');
  const pad = h('div', { class: 'numpad' });
  [1,2,3,4,5,6,7,8,9,0].forEach(n =>
    pad.append(h('button', { class: 'num', onclick: () => { entry = (entry + n).slice(0, 2); answerEl.textContent = entry || '_'; } }, n)));
  const hold = h('button', { class: 'hold' }, '⏱ Hold to enter');

  function check() {
    if (held && parseInt(entry, 10) === a + b) { go('dashboard'); }
    else { toast(wrap, "Let's try again.", 'warn'); entry = ''; answerEl.textContent = '_'; held = false; hold.classList.remove('on'); }
  }
  hold.addEventListener('pointerdown', () => { holdTimer = setTimeout(() => { held = true; hold.classList.add('on'); check(); }, 1500); });
  ['pointerup','pointerleave'].forEach(ev => hold.addEventListener(ev, () => clearTimeout(holdTimer)));

  wrap.append(
    h('div', { class: 'topbar' }, h('button', { class: 'back', onclick: () => go('home') }, '←'), h('h1', {}, 'Ask a grown-up 🔒'), h('span')),
    h('p', { class: 'sub' }, 'Hold the button and solve this:'),
    display, answerEl, pad, hold);
  return wrap;
});

/* ===================================================================== */
/* PARENT DASHBOARD                                                       */
/* ===================================================================== */
route('dashboard', () => {
  const wrap = h('div', { class: 'screen pad adult' });
  const child = Store.child();
  const s = Store.weekSummary();
  const maxEmo = Math.max(1, ...Object.values(s.emoCount));
  const emoBars = h('div', {});
  EMOTIONS.filter(e => s.emoCount[e.key]).sort((a,b)=>s.emoCount[b.key]-s.emoCount[a.key]).forEach(e =>
    emoBars.append(h('div', { class: 'bar' }, h('span', { class: 'blabel' }, e.key),
      h('i', { style: `width:${(s.emoCount[e.key]/maxEmo)*140}px;background:${e.color}` }))));
  if (!Object.keys(s.emoCount).length) emoBars.append(h('p', { class: 'sub' }, 'No mood check-ins yet this week.'));

  const childSwitch = h('select', { class: 'switcher', onchange: e => { Store.setActiveChild(e.target.value); go('dashboard'); } },
    ...Store.state.children.map(c => h('option', { value: c.id, selected: c.id === child.id }, `${c.avatar} ${c.name}`)));

  wrap.append(
    h('div', { class: 'topbar' }, h('button', { class: 'back', onclick: () => go('home') }, '←'), h('h1', {}, 'Dashboard'), childSwitch),
    h('div', { class: 'card' }, h('h3', {}, 'This week'),
      h('p', { class: 'stat' }, `${s.days} days active · ${s.worlds} worlds · ${s.checkins} check-ins`)),
    h('div', { class: 'card' }, h('h3', {}, 'Feelings this week'), emoBars),
    h('div', { class: 'card' }, h('h3', {}, 'Progress'),
      h('p', { class: 'stat' }, `🃏 ${s.cards}/10 feeling cards · ⭐ ${s.stickers} stickers`)),
    h('div', { class: 'card' }, h('h3', {}, '💡 Areas to support'),
      h('div', { class: 'insight' }, Store.insight()),
      h('button', { class: 'pill-btn adult block', onclick: () => go('brave') }, 'Open Brave Voice →')),
    h('div', { class: 'card' }, h('h3', {}, 'Settings & data'),
      h('button', { class: 'pill-btn ghost block', onclick: () => go('settings') }, 'Settings')),
  );
  return wrap;
});

/* ===================================================================== */
/* SETTINGS                                                               */
/* ===================================================================== */
route('settings', () => {
  const wrap = h('div', { class: 'screen pad adult' });
  const tog = (label, key) => {
    const input = h('input', { type: 'checkbox', ...(Store.settings[key] ? { checked: 'checked' } : {}),
      onchange: e => Store.setSetting(key, e.target.checked) });
    return h('label', { class: 'toggle' }, input, label);
  };
  wrap.append(
    h('div', { class: 'topbar' }, h('button', { class: 'back', onclick: () => go('dashboard') }, '←'), h('h1', {}, 'Settings'), h('span')),
    h('div', { class: 'card' }, h('h3', {}, 'Audio & accessibility'),
      tog('Voice narration', 'narration'), tog('Sound effects', 'sfx'), tog('Reduce motion', 'reduceMotion')),
    h('div', { class: 'card' }, h('h3', {}, 'Privacy & data'),
      h('p', { class: 'sub' }, 'All data is stored on this device. Nothing is uploaded.'),
      h('button', { class: 'pill-btn ghost block', onclick: () => {
        const blob = new Blob([JSON.stringify(Store.state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const a = h('a', { href: url, download: 'feel-friends-data.json' });
        document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      } }, 'Export my data'),
      h('button', { class: 'pill-btn danger block', onclick: () => {
        if (confirm('Delete ALL data and start over?')) { Store.reset(); go('onboarding'); }
      } }, 'Delete all data')),
  );
  return wrap;
});

/* ---------- splash + boot ---------- */
function splash() {
  document.body.dataset.mode = 'child';
  const s = h('div', { class: 'splash' },
    h('div', { class: 'splash-mascot', html: mascot(132) }),
    h('div', { class: 'splash-name' }, 'Feel Friends'),
    h('div', { class: 'splash-tag' }, 'Big feelings are okay 💛'));
  root.innerHTML = '';
  root.append(s);
  let done = false;
  const finish = () => { if (done) return; done = true; boot(); };
  s.addEventListener('click', finish); // tap to skip
  setTimeout(() => Audio.speak('Feel Friends'), 250);
  setTimeout(() => { s.classList.add('out'); }, 1500);
  setTimeout(finish, 1950);
}
function boot() {
  go(Store.isOnboarded() ? 'home' : 'onboarding');
}
splash();
