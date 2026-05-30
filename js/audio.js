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

export const Audio = {
  /** Speak text aloud (child-directed narration). Returns immediately. */
  speak(text, { rate = 0.95, pitch = 1.15 } = {}) {
    if (!Store.settings.narration || !('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      if (voice) u.voice = voice;
      u.rate = rate; u.pitch = pitch; u.volume = 1;
      speechSynthesis.speak(u);
    } catch {}
  },
  stop() { try { speechSynthesis.cancel(); } catch {} },

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
