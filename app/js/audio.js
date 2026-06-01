// Feel Friends — audio: real voice narration (Web Speech API) + gentle SFX.
import { Store } from './store.js';

let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices();
  // prefer a warm English voice; fall back to first available
  voice = vs.find(v => /en(-|_)?(US|GB)/i.test(v.lang) && /female|samantha|karen|google/i.test(v.name))
       || vs.find(v => /^en/i.test(v.lang)) || vs[0] || null;
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

// Browsers block audio until the user interacts with the page (and iOS only
// allows speech started *within* a user-gesture handler). We "unlock" on the
// first tap: resume the WebAudio context and prime speechSynthesis. Until then,
// auto-narration is queued and replayed once unlocked.
let unlocked = false;
let pendingSpeak = null;
function unlock() {
  if (unlocked) return;
  unlocked = true;
  try {
    if (Audio._ctx && Audio._ctx.state === 'suspended') Audio._ctx.resume();
  } catch {}
  try {
    // prime the speech engine with a silent utterance inside the gesture
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    speechSynthesis.speak(u);
  } catch {}
  // replay whatever wanted to speak before the first tap (e.g. splash greeting)
  if (pendingSpeak) {
    const p = pendingSpeak; pendingSpeak = null;
    setTimeout(() => Audio.speak(p), 150); // let priming settle first
  }
}
if (typeof window !== 'undefined') {
  ['pointerdown', 'touchend', 'mousedown', 'keydown'].forEach(ev =>
    window.addEventListener(ev, unlock, { once: false, passive: true }));
}

export const Audio = {
  get unlocked() { return unlocked; },
  /** Speak text aloud (child-directed narration). Returns immediately. */
  speak(text, { rate = 0.95, pitch = 1.15 } = {}) {
    if (!Store.settings.narration || !('speechSynthesis' in window) || !text) return;
    // before the first user gesture, remember the latest line to play on unlock
    if (!unlocked) { pendingSpeak = text; return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      if (voice) u.voice = voice;
      u.rate = rate; u.pitch = pitch; u.volume = 1;
      speechSynthesis.speak(u);
    } catch {}
  },
  stop() { try { speechSynthesis.cancel(); } catch {} },

  /** Speak a list of phrases one after another (e.g. script then each choice). */
  speakSeq(items, { rate = 0.95, pitch = 1.15 } = {}) {
    if (!Store.settings.narration || !('speechSynthesis' in window)) return;
    const list = (Array.isArray(items) ? items : [items]).filter(Boolean);
    if (!list.length) return;
    if (!unlocked) { pendingSpeak = list[0]; return; } // queue first line until gesture
    try {
      speechSynthesis.cancel();
      list.forEach((text) => {
        const u = new SpeechSynthesisUtterance(String(text));
        if (voice) u.voice = voice;
        u.rate = rate; u.pitch = pitch; u.volume = 1;
        speechSynthesis.speak(u); // queued; engine plays them in order
      });
    } catch {}
  },

  // --- WebAudio SFX (no asset files; soft synthesized tones) ---
  _ctx: null,
  _ac() { return this._ctx || (this._ctx = new (window.AudioContext || window.webkitAudioContext)()); },
  _tone(freqs, dur = 0.18, type = 'sine', gain = 0.08) {
    if (!Store.settings.sfx) return;
    try {
      const ac = this._ac(); const now = ac.currentTime;
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.value = f;
        const t = now + i * 0.09;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(gain, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(ac.destination);
        o.start(t); o.stop(t + dur + 0.02);
      });
    } catch {}
  },
  chime() { this._tone([523.25, 659.25, 783.99], 0.22); },   // happy C-E-G
  boop()  { this._tone([392.0], 0.14, 'triangle', 0.05); },  // gentle, neutral (never harsh)
  pop()   { this._tone([659.25, 880.0], 0.16); },
};
