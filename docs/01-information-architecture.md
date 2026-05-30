# 01 · Information Architecture

This document defines how Feel Friends is organized: the modes, the navigation
model, the screen map, and the underlying data model.

---

## 1. Two modes, one app

Feel Friends has a hard split between **Child Mode** and **Grown-Up Mode**.
This separation is the backbone of the IA and the safety model.

```
                        ┌─────────────────────────┐
                        │      App Launch          │
                        └────────────┬─────────────┘
                                     │
                     who is using the app right now?
                                     │
           ┌─────────────────────────┴──────────────────────────┐
           ▼                                                     ▼
   ┌───────────────┐                                   ┌──────────────────┐
   │  CHILD MODE    │                                   │  GROWN-UP MODE    │
   │  (default)     │                                   │  (parent gated)   │
   │                │   ── parent gate (math/hold) ──▶  │                   │
   │ Play, learn,   │                                   │ Dashboard,        │
   │ collect.       │ ◀── auto-return / "Done" ──────── │ settings, reports │
   └───────────────┘                                   └──────────────────┘
```

- **Child Mode is the default.** The app always opens here so a child can
  hand-off or self-start without help.
- **Grown-Up Mode is gated** by a parent gate (e.g. "hold the button for 3
  seconds" + a simple multiplication question that a young child can't solve).
  See [`09-safety-privacy-accessibility.md`](09-safety-privacy-accessibility.md).
- There is **no open text entry, chat, store, or external link** anywhere in
  Child Mode.

---

## 2. Top-level screen map

```
Feel Friends
│
├── Onboarding (first run, grown-up assisted)
│   ├── Welcome / what this app does
│   ├── Create parent account (or "skip for now" → local only)
│   ├── Add child profile (name, age band 3-4 / 4-5 / 5-6, avatar)
│   ├── Permissions (mic optional, notifications optional)
│   └── Download core lessons for offline
│
├── CHILD MODE
│   ├── Home — "Friendly Town" map (hub)
│   │   ├── Daily Mood Check-in (gentle prompt, dismissible)
│   │   └── 6 world entrances + Sticker Book + Calm Corner shortcut
│   │
│   ├── 1. Emotion Explorer
│   │   ├── Mood Check-in
│   │   ├── Face Match game
│   │   ├── Name That Feeling game
│   │   ├── Feeling Sounds / situations game
│   │   └── Emotion Card Collection (deck of 10)
│   │
│   ├── 2. Story Adventures
│   │   ├── Story picker (6 situations)
│   │   └── Story player (scene → choice → consequence → reflect)
│   │
│   ├── 3. Brave Voice
│   │   ├── Phrase picker (4 core phrases + situational)
│   │   ├── Practice (listen → echo → optional record/playback)
│   │   └── "Try it in a story" link-out to matching Story Adventure
│   │
│   ├── 4. Calm Corner  (also reachable from anywhere via floating button)
│   │   ├── Balloon Breathing
│   │   ├── Glitter Jar
│   │   ├── Counting Calm (5-4-3-2-1)
│   │   └── Quiet Listen (mindfulness sound moment)
│   │
│   ├── 5. Empathy Lab
│   │   ├── "How does this friend feel?"
│   │   ├── Perspective swap scenes
│   │   └── Kindness Missions (offline, real-world prompts)
│   │
│   ├── 6. Good Choice Challenge
│   │   ├── Quick scenario rounds
│   │   └── Animated outcome + encouragement
│   │
│   └── Sticker Book / My Collection
│       ├── Emotion cards collected
│       ├── Stickers earned
│       └── Friends met (characters)
│
└── GROWN-UP MODE  (parent gated)
    ├── Dashboard home (per child)
    │   ├── This week summary
    │   ├── Emotion trends (from mood check-ins)
    │   ├── Skills progress by world
    │   └── "Areas needing support" + suggested activities
    ├── Weekly Report (view / export / email opt-in)
    ├── AI Story Generator
    │   ├── New story (child name + situation + tone)
    │   ├── Review & narrate
    │   └── My Stories (saved, playable in Child Mode)
    ├── Children (add / edit / switch profiles)
    ├── Settings
    │   ├── Audio & narration (voice, volume, captions)
    │   ├── Accessibility (text size, reduce motion, high contrast)
    │   ├── Microphone & recording (on/off, auto-delete)
    │   ├── Session limits (gentle daily play cap, optional)
    │   ├── Offline content (manage downloads)
    │   └── Privacy & data (export, delete, what we collect)
    └── About / Help / For Educators
```

---

## 3. Navigation model

### Child Mode — spatial, not menu-driven

Young children navigate by **place and picture**, not lists or tabs.

- **Home is a friendly town map** ("Friendly Town"). Each world is a building
  or landmark a child taps to enter.
- **One primary action per screen.** No nested menus more than 2 levels deep
  from Home.
- **Persistent, oversized "Home" affordance** (a house icon, bottom-left) on
  every child screen — always returns to the town map.
- **Persistent "Calm Corner" floating button** (a soft breathing bubble,
  bottom-right) is reachable from *every* child screen, including mid-activity.
  Regulation tools must never be more than one tap away.
- **No bottom tab bar in Child Mode.** Tabs require reading and abstract
  categorization that 3–5 year-olds don't have yet. The map is the navigation.
- **Back = a big arrow** top-left, always in the same place.

### Grown-Up Mode — conventional and efficient

Adults get a familiar pattern:

- **Bottom tab bar:** Dashboard · Stories · Children · Settings.
- Standard lists, cards, charts, and forms. Reading expected.
- Visually calmer/more "adult" palette so the mode switch is obvious.

---

## 4. Content hierarchy & terminology

| Concept | Definition | Example |
|---|---|---|
| **World** | A top-level feature area in Child Mode | Calm Corner |
| **Activity** | A single playable unit inside a world | Balloon Breathing |
| **Round / Scene** | One step within an activity | One story choice point |
| **Emotion** | One of the 10 core feelings | "frustrated" |
| **Card** | A collectible representing an emotion | Frustrated card |
| **Sticker** | A non-scored reward for participation | "Brave Voice" sticker |
| **Friend** | A recurring character/guide | Mochi the bear |
| **Check-in** | A daily mood self-report | "Today I feel…" |

### The 10 core emotions (canonical set & order)

`happy · sad · angry · frustrated · nervous · scared · proud · lonely · excited · confused`

This ordering and naming is used **everywhere** — cards, check-ins, games,
reports — for consistency. Each emotion has: a name, a friend/face, a color,
a sound, a short kid-definition, and an example situation. Full definitions in
[`08-content-library.md`](08-content-library.md).

---

## 5. Data model (conceptual)

Designed **local-first**: everything a child does is stored on-device and works
offline. Cloud sync is optional and tied to the parent account.

```
ParentAccount
  id, email (optional), authProvider, createdAt
  settings { audio, accessibility, microphone, sessionLimit, notifications }
  └── ChildProfile (1..n)
        id, displayName, ageBand (3-4 | 4-5 | 5-6), avatarId, createdAt
        progress { perWorld completion %, lastPlayedAt }
        ├── MoodCheckIn (0..n)        { date, emotion, intensity?, note? }
        ├── ActivityEvent (0..n)      { activityId, world, startedAt, completedAt, choices[] }
        ├── CollectionState           { emotionCardsOwned[], stickersOwned[], friendsMet[] }
        ├── VoiceRecording (0..n)     { phraseId, localFileRef, createdAt, autoDeleteAt }
        └── GeneratedStory (0..n)     { title, body, narrationRef, createdBy=parent, situationTags[] }
```

**Privacy notes baked into the model:**

- `note` on a check-in and `VoiceRecording` are the most sensitive items.
  Voice recordings are **local-only by default**, never uploaded, and support
  auto-delete.
- `ChildProfile.displayName` is a **first name or nickname only** — no
  requirement for real identity. Age is a *band*, not a birthdate.
- Analytics for the dashboard are **derived on-device** from `MoodCheckIn` and
  `ActivityEvent`; no raw child interaction data needs to leave the device.

See [`09-safety-privacy-accessibility.md`](09-safety-privacy-accessibility.md)
for the full privacy/COPPA-aware stance.

---

## 6. Offline architecture

- **Core lesson bundle** (all 6 worlds' base activities, the 10 emotion cards,
  all narration audio for them, breathing/glitter animations) is downloaded
  during onboarding and on app updates. This is the offline guarantee.
- **Online-only features** are clearly marked and confined to Grown-Up Mode:
  the **AI Story Generator** (needs a server call) and **cloud sync / emailed
  reports**. Child Mode never *requires* connectivity.
- Generated stories, once created and narrated by a parent, are saved into the
  local bundle and become offline-playable in Child Mode.
