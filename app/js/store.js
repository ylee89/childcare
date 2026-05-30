// Feel Friends — persistent state (local-first, offline).
// All child data lives on-device in localStorage. Nothing is uploaded.

const KEY = 'feelfriends.v1';

const DEFAULT = {
  onboarded: false,
  settings: { narration: true, sfx: true, reduceMotion: false },
  children: [],
  activeChildId: null,
  // data[childId] = { checkins, cards, stickers, events, missions, recordings }
  data: {},
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    return Object.assign(structuredClone(DEFAULT), JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT);
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { console.warn('persist failed', e); }
}

const uid = () => 'c' + Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

function blankChildData() {
  return { checkins: [], cards: [], stickers: [], events: [], missions: [], recordings: {} };
}

export const Store = {
  get state() { return state; },
  get settings() { return state.settings; },

  isOnboarded() { return state.onboarded && !!state.activeChildId; },

  addChild({ name, ageBand, avatar }) {
    const id = uid();
    state.children.push({ id, name: name || 'Friend', ageBand, avatar, createdAt: Date.now() });
    state.data[id] = blankChildData();
    state.activeChildId = id;
    state.onboarded = true;
    persist();
    return id;
  },

  child(id = state.activeChildId) { return state.children.find(c => c.id === id) || null; },
  childData(id = state.activeChildId) { return state.data[id] || (state.data[id] = blankChildData()); },
  setActiveChild(id) { state.activeChildId = id; persist(); },

  setSetting(k, v) { state.settings[k] = v; persist(); },

  // --- learning events ---
  checkIn(emotion, intensity = null) {
    const d = this.childData();
    d.checkins.push({ date: today(), at: Date.now(), emotion, intensity });
    persist();
  },
  todaysCheckIn() {
    return this.childData().checkins.find(c => c.date === today()) || null;
  },

  collectCard(emotionKey) {
    const d = this.childData();
    if (!d.cards.includes(emotionKey)) { d.cards.push(emotionKey); persist(); return true; }
    return false;
  },
  hasCard(k) { return this.childData().cards.includes(k); },

  earnSticker(id, label) {
    const d = this.childData();
    d.stickers.push({ id, label, at: Date.now() });
    if (d.stickers.length > 200) d.stickers = d.stickers.slice(-200);
    persist();
  },

  logEvent(world, activity, detail = {}) {
    const d = this.childData();
    d.events.push({ world, activity, at: Date.now(), date: today(), ...detail });
    if (d.events.length > 500) d.events = d.events.slice(-500);
    persist();
  },

  completeMission(text) {
    const d = this.childData();
    d.missions.push({ text, date: today(), at: Date.now() });
    persist();
  },

  saveRecording(phraseId, dataUrl) {
    this.childData().recordings[phraseId] = { dataUrl, at: Date.now() };
    persist();
  },
  deleteRecording(phraseId) {
    delete this.childData().recordings[phraseId];
    persist();
  },
  recording(phraseId) { return this.childData().recordings[phraseId] || null; },

  // --- parent dashboard analytics (derived on-device) ---
  weekSummary(id = state.activeChildId) {
    const d = this.childData(id);
    const since = Date.now() - 7 * 864e5;
    const recent = d.events.filter(e => e.at >= since);
    const checks = d.checkins.filter(c => c.at >= since);
    const days = new Set(recent.map(e => e.date)).size;
    const worlds = new Set(recent.map(e => e.world)).size;

    const emoCount = {};
    checks.forEach(c => emoCount[c.emotion] = (emoCount[c.emotion] || 0) + 1);

    const worldCount = {};
    recent.forEach(e => worldCount[e.world] = (worldCount[e.world] || 0) + 1);

    return { days, worlds, checkins: checks.length, emoCount, worldCount,
             cards: d.cards.length, stickers: d.stickers.length };
  },

  // plain-language insight for the parent
  insight(id = state.activeChildId) {
    const d = this.childData(id);
    if (d.events.length === 0)
      return "No activity yet. Hand the app to your little one and explore the worlds together!";
    const since = Date.now() - 7 * 864e5;
    const checks = d.checkins.filter(c => c.at >= since);
    const hard = checks.filter(c => ['sad','angry','scared','nervous','lonely','frustrated'].includes(c.emotion));
    if (hard.length >= 3)
      return `${this.child(id).name} logged several hard feelings this week. Try a Calm Corner breathing activity together, and talk about what helped.`;
    if (d.cards.length < 10)
      return `${this.child(id).name} has discovered ${d.cards.length} of 10 feeling cards. Play Face Match in Emotion Explorer to meet the rest.`;
    return `${this.child(id).name} is exploring lots of feelings — great! Try the Brave Voice phrases together in real situations this week.`;
  },

  reset() { state = structuredClone(DEFAULT); persist(); },
};

export { today };
