# 09 · Safety, Privacy & Accessibility

Feel Friends is used by children as young as three. Safety, privacy, and
accessibility are **product requirements**, not afterthoughts. This document is
the standard every feature is checked against.

---

## 1. Child-safe experience (Child Mode)

In Child Mode there is **none of the following**:

- ❌ Advertising of any kind.
- ❌ In-app purchases or any spending surface.
- ❌ Open text chat, messaging, or user-to-user contact.
- ❌ External links, web views, or "open in browser."
- ❌ Social features, public profiles, sharing, or leaderboards.
- ❌ Data collection used for advertising or sold to third parties.
- ❌ Frightening, violent, or distressing content; no flashing visuals.

And **always**:

- ✅ A **parent gate** (hold 3s + simple arithmetic) protecting *all* of
  Grown-Up Mode (settings, dashboard, recordings, purchases, AI generator).
- ✅ No-fail interactions: gentle redirects, never punishment.
- ✅ Calm, predictable navigation a non-reader can use via icons + narration.

---

## 2. Privacy & data (COPPA / GDPR-K aware)

Designed for **data minimization** and **local-first** by default.

### What we collect
- **Child:** first name/nickname (optional — defaults to "Friend"), **age band**
  (not birthdate), avatar choice, and on-device learning activity (check-ins,
  progress, collections). **No real identity, no precise birthdate, no
  contact info, no location, no photos required.**
- **Parent:** email **only if** they create a cloud account (they can skip and
  run fully local).

### Where it lives
- **On-device by default.** The full core experience — including the dashboard's
  derived insights — works with **zero data leaving the device**.
- **Cloud sync is opt-in** and tied to the parent account; used only for
  backup/multi-device, never advertising.

### Sensitive items
- **Voice recordings** (Brave Voice): **local-only by default, never uploaded**,
  with playback/delete controls and an **auto-delete** option. Never analyzed by
  AI. Mic is **opt-in** and the app is fully functional without it.
- **Mood notes / check-ins:** stored locally; visible only behind the parent
  gate.

### Parent rights & controls (in Grown-Up Mode)
- **Export** all of a child's data; **delete** a child profile and all its data;
  view a **plain-language "what we collect"** page.
- Toggle microphone, recordings auto-delete, notifications, and cloud sync.

### Legal posture
- **Verifiable parental consent** model for account creation and any online
  feature (AI generator, sync), per COPPA. Default-off for anything online.
- **No behavioral advertising, no data sale, no third-party ad SDKs.**
- Third-party processors (if any, e.g. for sync or the LLM) are bound by data
  protection terms and never receive more than the minimum required.

> Target compliance: **COPPA** (US), **GDPR / GDPR-K & UK Age-Appropriate Design
> Code** (EU/UK), and platform kids-category rules (Apple Kids Category, Google
> Designed for Families / Teacher Approved).

---

## 3. AI Story Generator safety (v1.1)

The only generative surface, and it is tightly contained:

1. **Parent-gated & parent-initiated.** Never runs in Child Mode; a child can't
   trigger generation.
2. **Constrained generation.** System prompt enforces age-appropriate, gentle,
   non-frightening, SEL-positive output; restricted to the child's first name +
   parent's situation + one of the 10 emotions (see content guardrails in
   [`08-content-library.md`](08-content-library.md)).
3. **Safety filtering.** Output is screened for unsafe/inappropriate content
   before it's shown; failures regenerate or surface a friendly "let's try a
   different idea."
4. **Mandatory parent review.** The parent reads (and may edit) the full story
   *before* it can be saved. **Nothing auto-publishes to a child.**
5. **Data minimization.** Only the necessary fields are sent to the model; no
   child interaction history or recordings are sent. Requests aren't used to
   train models.
6. **Offline after save.** Once reviewed and saved, the story is local and
   playable offline; no further network needed.

---

## 4. Accessibility (WCAG 2.1 AA baseline)

| Area | Commitment |
|---|---|
| **Perceivable** | AA contrast (AAA option); every emotion conveyed by face + label + sound + color (never color alone); captions for all narration; scalable text to 200%. |
| **Operable** | Giant (≥88pt) forgiving touch targets; no precise gestures; no time limits anywhere; `Reduce Motion`; no content flashes >3×/sec. |
| **Understandable** | One task per screen; consistent layout & navigation; plain, kind language; auto-narration + tap-to-re-read so non-readers and pre-literate users are fully served. |
| **Robust** | Screen-reader labels (VoiceOver/TalkBack); standard platform a11y APIs; tested with assistive tech. |

**Accessibility settings (Grown-Up Mode):** text size, high contrast, reduce
motion, narration on/off + speed, captions, SFX/volume.

**Beyond AA (roadmap):** switch control, AAC-friendly modes, customizable symbol
sets, dyslexia-friendly options (Phase 4).

---

## 5. Content & wellbeing safeguards

- All scenarios are **age-appropriate** and reviewed for emotional safety; hard
  topics (being pushed, excluded, teased) resolve toward coping and safety, and
  always point a child toward **a trusted grown-up** for unsafe situations.
- The app **does not diagnose**. The Parent Dashboard offers *observations and
  gentle suggestions*, with clear language that it is **not** medical or
  psychological advice, and signposts professional help for serious concerns.
- **Crisis framing:** content consistently models "tell a grown-up you trust"
  for anything scary or unsafe — reinforcing real-world help-seeking over
  in-app dependence.

---

## 6. Pre-release safety checklist (run every release)

- [ ] No ads / IAP / external links / chat reachable in Child Mode.
- [ ] Parent gate protects all of Grown-Up Mode.
- [ ] Core experience works fully offline (airplane-mode test).
- [ ] No child PII leaves device without explicit parent consent action.
- [ ] Voice recordings remain local; mic optional; auto-delete works.
- [ ] AI generator: parent-gated, filtered, parent-reviewed before child sees.
- [ ] Accessibility audit passes AA (contrast, captions, reduce-motion, screen
      reader, text scaling).
- [ ] No content flashes >3×/sec; no frightening content.
- [ ] Gamification has no streaks/timers/random rewards/leaderboards.
- [ ] Data export & delete function correctly.
