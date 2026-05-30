# 06 · MVP Feature List

The MVP proves the core hypothesis: **young children can learn to recognize,
name, and regulate emotions and practice social skills through short, narrated,
no-fail play — and parents find the resulting insight valuable.**

We scope the MVP to deliver that loop end-to-end with depth in a few worlds
rather than thin coverage of all eight features.

---

## MVP scope at a glance

| # | Feature | MVP? | Notes |
|---|---|---|---|
| — | Onboarding + parent gate + child profile | ✅ Must | Local-first; SSO optional |
| 1 | Emotion Explorer | ✅ Must (core) | Check-in, Face Match, Name That Feeling, full 10-card deck |
| 2 | Story Adventures | ✅ Must (core) | 4 of 6 situations at launch |
| 3 | Brave Voice | ✅ Must (core) | 4 phrases; recording optional |
| 4 | Calm Corner | ✅ Must (core) | Balloon Breathing + Glitter Jar |
| 5 | Empathy Lab | 🔶 Lite | 1 game ("How does this friend feel?") |
| 6 | Good Choice Challenge | 🔶 Lite | 3 scenarios |
| 7 | Parent Dashboard | ✅ Must (lite) | Check-in trends + activity summary + tips |
| 8 | AI Story Generator | 🔷 Post-MVP | Online, sensitive — fast-follow, not v1 |
| — | Offline core lessons | ✅ Must | Everything above except dashboard sync/AI |
| — | Accessibility baseline | ✅ Must | Narration, big targets, captions, reduce-motion |
| — | Reward system (cards + stickers) | ✅ Must | Per gamification doc |

Legend: ✅ Must · 🔶 included in lite form · 🔷 deferred

---

## MVP — detailed "definition of done"

### 0. Foundations (must)
- [ ] Child Mode / Grown-Up Mode split with **parent gate** (hold + math).
- [ ] **Onboarding**: create-or-skip account, add child (name optional, age
      band, avatar), optional mic + notification permission, offline download.
- [ ] **Local-first data**: profiles, progress, check-ins, collections, stored
      on-device and fully functional offline.
- [ ] **Narration engine**: auto-narrate on screen entry + tap-to-re-read,
      with captions and on/off controls.
- [ ] **Persistent nav**: Home button + Calm Corner bubble on every child
      screen.
- [ ] **Design system v1** implemented (tokens, core components, motion,
      reduce-motion, high-contrast, text scaling).

### 1. Emotion Explorer (core)
- [ ] **Daily Mood Check-in** — 10 emotions, optional intensity, validating
      response, soft Calm Corner suggestion for hard feelings, fully skippable.
- [ ] **Face Match** game — no-fail, gentle redirect, scales rounds by age band.
- [ ] **Name That Feeling** — situation → pick the feeling.
- [ ] **Emotion Card Collection** — all 10 cards, flippable with kid-definition,
      example, and "what helps," fully narrated.

### 2. Story Adventures (core)
- [ ] **4 situations at launch**: toy sharing, being pushed, being excluded,
      asking for help. *(teasing + taking turns follow fast.)*
- [ ] Each: animated scene → 2–3 narrated choices → real consequence →
      reflection → replay option. No shaming.
- [ ] "Practice the brave words" hand-off into Brave Voice.

### 3. Brave Voice (core)
- [ ] **4 phrases**: "Please stop." / "I don't like that." / "Can I have help?"
      / "Can I play too?"
- [ ] Model → echo. **Optional recording** (local-only, playback, delete);
      graceful "I said it!" echo mode when mic is off/declined.

### 4. Calm Corner (core)
- [ ] **Balloon Breathing** (paced 4s in / 6s out, narrated, no timer/score).
- [ ] **Glitter Jar** (shake/tap → settle).
- [ ] Reachable from the floating bubble on **every** child screen, mid-activity.
- [ ] Distinct calm palette/audio; no reward fanfare on exit.

### 5. Empathy Lab (lite)
- [ ] **"How does this friend feel?"** + one kindness response + one offline
      Kindness Mission.

### 6. Good Choice Challenge (lite)
- [ ] **3 scenarios** with 2 choices each, animated outcomes, positive framing.

### 7. Parent Dashboard (must, lite)
- [ ] Per-child **this-week summary** (days active, worlds visited, check-ins).
- [ ] **Emotion trend** from check-ins (simple, honest bars; no diagnosis).
- [ ] **Skills progress** rings (exploring → confident framing).
- [ ] **One "areas to support" insight** with a suggested activity link.
- [ ] All derived on-device; cloud sync optional.

### Reward system (must)
- [ ] Emotion Cards (10, completable) + skill Stickers (participation) +
      Friends-met. **No** scores/streaks/timers/leaderboards/IAP/ads.

### Accessibility & safety (must)
- [ ] WCAG AA contrast, captions, screen-reader labels, reduce-motion,
      high-contrast, text scaling, big forgiving targets.
- [ ] No ads, no IAP in child mode, no external links, no open chat, no child
      PII required. Privacy policy + data export/delete in Grown-Up Mode.

---

## Explicitly OUT of MVP (and why)

- **AI Story Generator** — high value but online-dependent and the most
  safety-sensitive surface; deserves dedicated review. Fast-follow (v1.1).
- **Remaining 2 story situations** (teasing, taking turns) — fast-follow.
- **Counting Calm & Quiet Listen** in Calm Corner — two activities is enough to
  validate; add in v1.1.
- **Multi-device cloud sync, emailed weekly reports** — local-first first;
  sync/email is a v1.1 convenience.
- **Educator/classroom mode, multiple-child analytics, localization** — see
  roadmap.
- **Voice analysis/AI feedback on recordings** — out of scope and
  privacy-heavy; recordings stay local and unanalyzed.

---

## MVP success criteria (exit checklist)

- [ ] A non-reading 4-year-old can, **unaided after one adult setup**, do a
      mood check-in, play a story, practice a brave phrase, and use a breathing
      exercise — using narration + icons only.
- [ ] Everything in the core loop works **fully offline** in airplane mode.
- [ ] A parent can pass the gate, see this week's emotions, and act on one
      concrete suggestion.
- [ ] Zero scores, streaks, timers, ads, IAP, or external links reachable in
      Child Mode (verified by checklist).
- [ ] Accessibility audit (contrast, narration, reduce-motion, screen reader)
      passes AA.
- [ ] No child PII leaves the device without explicit parent action.
