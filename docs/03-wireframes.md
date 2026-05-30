# 03 · Wireframes

Low-fidelity, annotated layouts for the key screens. These are **structural**:
they show hierarchy, touch-target scale, and persistent affordances — not final
visuals (see [`04-design-system.md`](04-design-system.md) for those).

A **clickable HTML version** of several of these screens lives in
[`../prototype/index.html`](../prototype/index.html).

### Conventions used below

- Frame ≈ a 9:19.5 phone in portrait.
- `[ ]` tappable target · big targets are drawn large on purpose.
- 🏠 = persistent Home button · 🫧 = persistent Calm Corner bubble.
- All text shown is **also narrated**; non-readers rely on icons + audio.

---

## 1. Child Home — "Friendly Town" (the hub)

```
┌─────────────────────────────────┐
│  ☀️  Good morning!        [🔑]   │  ← greeting (narrated). 🔑 = tiny, muted
│                                  │     "Grown-Ups" gate, top-right corner
│        ╭───────────────╮         │
│        │  Mochi 🐻 waves │        │  ← guide character, sets warm tone
│        ╰───────────────╯         │
│                                  │
│   ┌────────┐      ┌────────┐     │  ← world buildings as BIG tappable
│   │  😊     │      │  📖     │     │     tiles (min 88×88pt targets,
│   │ Emotion │      │ Story   │     │     generous spacing)
│   │ Explorer│      │Adventure│     │
│   └────────┘      └────────┘     │
│   ┌────────┐      ┌────────┐     │
│   │  🗣️     │      │  💜     │     │
│   │ Brave   │      │ Empathy │     │
│   │ Voice   │      │  Lab    │     │
│   └────────┘      └────────┘     │
│   ┌────────┐      ┌────────┐     │
│   │  ✅     │      │  📚     │     │
│   │ Good    │      │ Sticker │     │
│   │ Choice  │      │  Book   │     │
│   └────────┘      └────────┘     │
│                                  │
│  🏠 (active)              🫧 Calm │  ← persistent bar: Home (here, lit)
└─────────────────────────────────┘     + floating Calm Corner bubble
```

Annotations:
- The town is **scrollable/parallax** but the 6 worlds + Sticker Book fit the
  first view. No reading required to navigate — each tile is icon-led.
- The 🔑 grown-up key is small and visually quiet so children ignore it.
- The mood check-in (below) overlays this screen on first open of the day.

---

## 2. Daily Mood Check-in (overlay on Home)

```
┌─────────────────────────────────┐
│            (Home dimmed)         │
│  ╭─────────────────────────────╮ │
│  │  How are you feeling today?  │ │  ← narrated question, Mochi asks
│  │                              │ │
│  │  😊   😢   😠   😣   😰      │ │  ← 10 emotion faces, large,
│  │ happy sad angry frust nervous│ │     2 rows, label under each
│  │                              │ │
│  │  😨   😌   😞   🤩   😕      │ │
│  │ scared proud lonely excit conf│ │
│  │                              │ │
│  │         [ ☁️ later ]          │ │  ← always skippable
│  ╰─────────────────────────────╯ │
└─────────────────────────────────┘
        ↓ after a tap
┌─────────────────────────────────┐
│  ╭─────────────────────────────╮ │
│  │   You feel  😠 angry         │ │
│  │  "It's okay to feel angry."  │ │  ← validating, never corrective
│  │                              │ │
│  │   A little 🔵   A lot 🔵🔵    │ │  ← optional intensity (size, no numbers)
│  │                              │ │
│  │   "Want to visit the         │ │  ← only for hard feelings
│  │    Calm Corner?" [Yes][Later]│ │
│  ╰─────────────────────────────╯ │
└─────────────────────────────────┘
```

---

## 3. Emotion Explorer — Face Match game

```
┌─────────────────────────────────┐
│ [←]   Face Match          [🔑]   │
│                                  │
│   Find the friend who feels…     │  ← narrated prompt
│            😊  HAPPY              │  ← target shown big + spoken
│                                  │
│   ┌─────────┐     ┌─────────┐    │
│   │   😢     │     │   😊     │    │  ← large face cards (4 max),
│   │         │     │         │    │     tap to choose
│   └─────────┘     └─────────┘    │
│   ┌─────────┐     ┌─────────┐    │
│   │   😠     │     │   😨     │    │
│   │         │     │         │    │
│   └─────────┘     └─────────┘    │
│                                  │
│   ●●●○○  (rounds, dots not score) │  ← progress dots, never a number/score
│                                  │
│  🏠                         🫧    │
└─────────────────────────────────┘
```

Correct → card wiggles + chime, collected into deck. Other → the tapped face
says its own feeling, then re-prompts. No buzzer, no minus.

---

## 4. Emotion Card Collection (deck)

```
┌─────────────────────────────────┐
│ [←]   My Feelings Cards   [🔑]   │
│                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │  ← collected = full color
│  │😊 │ │😢 │ │😠 │ │ ?  │    │     not yet = silhouette "?"
│  │happy│ │sad │ │angry│ │ ?? │    │
│  └────┘ └────┘ └────┘ └────┘    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │😣 │ │ ?  │ │😨 │ │ ?  │    │
│  │frust│ │ ?? │ │scar│ │ ?? │    │
│  └────┘ └────┘ └────┘ └────┘    │
│  ┌────┐ ┌────┐                  │
│  │🤩 │ │😕 │   8 / 10 found     │  ← count framed as discovery,
│  │excit│ │conf│                  │     not a quota/score
│  └────┘ └────┘                  │
│                                  │
│  🏠                         🫧    │
└─────────────────────────────────┘
```

Tapping a collected card flips it: shows the friend's face, the feeling word,
a kid-definition ("Frustrated is when something is hard and you want to give
up"), an example, and a "what helps" tip — all narrated.

---

## 5. Story Adventures — story player

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│ [←]   Sharing            [🔑]    │    │ [←]                      [🔑]    │
│                                  │    │                                  │
│   ╭───────────────────────────╮  │    │  ╭─────────────────────────────╮ │
│   │                           │  │    │  │   (consequence animation)   │ │
│   │   ANIMATED SCENE          │  │    │  │                             │ │
│   │   (friend grabs toy)      │  │ →  │  │  You said "Can I have it     │ │
│   │                           │  │    │  │   back, please?"            │ │
│   ╰───────────────────────────╯  │    │  ╰─────────────────────────────╯ │
│                                  │    │                                  │
│   "What could you do?"           │    │  "Your friend gave it back! 😊"  │
│                                  │    │  "How did that feel?"            │
│  ┌────────────────────────────┐  │    │                                  │
│  │ 🗣️ "Can I have it back?"     │  │    │  [▶ Keep going] [↺ Try another]  │
│  └────────────────────────────┘  │    │                                  │
│  ┌────────────────────────────┐  │    │  🏠                         🫧    │
│  │ 😠 grab it back             │  │    └─────────────────────────────────┘
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │     • Choices are full-width, illustrated,
│  │ 😢 walk away sad            │  │       and narrated on tap-and-hold.
│  └────────────────────────────┘  │     • Every choice plays out a real,
│  🏠                         🫧    │       non-shaming consequence.
└─────────────────────────────────┘
```

---

## 6. Brave Voice — practice + record

```
┌─────────────────────────────────┐
│ [←]   Brave Voice         [🔑]   │
│                                  │
│   ╭───────────────────────────╮  │
│   │   Mochi 🐻 says it first:  │  │  ← model the phrase (animation+audio)
│   │   "Please stop."          │  │
│   ╰───────────────────────────╯  │
│                                  │
│        Now you try! 💪            │
│                                  │
│        ┌───────────────┐         │
│        │      🎤        │         │  ← BIG tap-and-hold mic bubble
│        │  hold to talk │         │     (only if mic permission granted)
│        └───────────────┘         │
│           ～～～～～                │  ← live waveform while holding
│                                  │
│   [▶ hear me]  [↺ again]  [🗑]    │  ← playback / re-record / delete
│                                  │     (recordings local-only)
│   "Try it in a story?" →          │  ← optional jump to Story Adventures
│  🏠                         🫧    │
└─────────────────────────────────┘
```

If mic is off: the mic bubble becomes an "I said it!" button (echo mode).

---

## 7. Calm Corner (note the shifted, dimmer styling)

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ [←]   Calm Corner                │   │ [←]   Balloon Breathing          │
│   (soft dim background, slow      │   │   (full-bleed calm scene)        │
│    ambient sound)                 │   │                                  │
│                                  │   │            ___                   │
│   Pick a calm thing:             │   │          (     )                 │  ← balloon
│                                  │   │         (       )                │     inflates
│   ┌────────┐    ┌────────┐       │ → │          (     )                 │     /deflates
│   │  🎈     │    │  ✨     │       │   │           ‾‾‾                    │     to pacing
│   │ Balloon │    │ Glitter │       │   │                                  │
│   │ Breath  │    │  Jar    │       │   │      "Breathe in…"               │  ← narrated,
│   └────────┘    └────────┘       │   │       ●●●○○  (cycles)             │     no timer #
│   ┌────────┐    ┌────────┐       │   │                                  │
│   │  🔢     │    │  🎧     │       │   │   [ I feel calmer ]              │  ← gentle exit,
│   │Counting │    │ Quiet   │       │   │                                  │     no fanfare
│   │  Calm   │    │ Listen  │       │   │  🏠                              │
│   └────────┘    └────────┘       │   └─────────────────────────────────┘
│                                  │
│  🏠                              │   Note: NO 🫧 bubble here (you're already
└─────────────────────────────────┘   in it) and NO reward chime on completion.
```

---

## 8. Sticker Book / My Collection

```
┌─────────────────────────────────┐
│ [←]   My Collection       [🔑]   │
│                                  │
│  [ Cards ] [ Stickers ] [Friends]│  ← 3 simple picture-tabs
│                                  │
│   Stickers I earned:             │
│   ⭐ 🌈 🦋 💪 💜 🎈 ⭐ ...        │  ← a warm, growing shelf — purely
│                                  │     for delight, never a leaderboard
│   ╭───────────────────────────╮  │
│   │  Friends I've met:         │  │
│   │  🐻 Mochi   🐰 Pip         │  │  ← characters unlocked by visiting
│   │  🦊 Fen     🦉 ???         │  │     worlds (mystery = "keep exploring")
│   ╰───────────────────────────╯  │
│  🏠                         🫧    │
└─────────────────────────────────┘
```

---

## 9. Parent gate

```
┌─────────────────────────────────┐
│            Ask a grown-up 🔒      │
│                                  │
│   Hold the button & solve this:  │
│                                  │
│            4  +  7  =  ?         │  ← randomized, age-out-of-reach
│                                  │
│        ┌───┐ ┌───┐ ┌───┐         │
│        │ 1 │ │ 2 │ │ 3 │         │  ← number pad
│        ├───┤ ├───┤ ├───┤         │
│        │ 4 │ │ 5 │ │ 6 │         │
│        ├───┤ ├───┤ ├───┤         │
│        │ 7 │ │ 8 │ │ 9 │         │
│        └───┘ └───┘ └───┘         │
│                                  │
│   ┌────────────────────────────┐ │
│   │   ⏱ hold to continue        │ │  ← must hold 3s AND enter answer
│   └────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 10. Parent Dashboard (Grown-Up Mode — note conventional layout)

```
┌─────────────────────────────────┐
│  ☰  Dashboard      [Aria ▾]      │  ← child switcher top-right
│                                  │
│  ┌─────────────────────────────┐ │
│  │ This week                    │ │
│  │ 4 days active · 5 worlds      │ │
│  │ 6 mood check-ins             │ │
│  └─────────────────────────────┘ │
│                                  │
│  Feelings this week              │
│  ┌─────────────────────────────┐ │
│  │  happy ████████              │ │  ← simple, honest bars/trend.
│  │  frust ████                  │ │     No alarming "diagnosis."
│  │  excit ███                   │ │
│  │  sad   ██                    │ │
│  └─────────────────────────────┘ │
│                                  │
│  Skills                          │
│  Emotion ◔  Stories ◑  Calm ◕    │  ← "exploring→confident" rings
│  Brave ◔   Empathy ◑  Choice ◔   │
│                                  │
│  💡 Areas to support             │
│  ┌─────────────────────────────┐ │
│  │ Aria often walks away in     │ │
│  │ conflict stories. Try        │ │
│  │ practicing "I don't like     │ │
│  │ that." together in Brave     │ │
│  │ Voice.  [Open activity →]    │ │
│  └─────────────────────────────┘ │
│                                  │
│  [ View weekly report ]          │
│  [ Generate a story about this ] │
│                                  │
│  Dashboard · Stories · Kids · ⚙  │  ← bottom tabs (grown-up only)
└─────────────────────────────────┘
```

---

## 11. AI Story Generator (Grown-Up Mode)

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ [←]  New Story                   │   │ [←]  Review Story                │
│                                  │   │                                  │
│  Who is it for?                  │   │  "Maya and the Big Pool"         │
│  [ Aria ▾ ]                      │   │  ╭─────────────────────────────╮ │
│                                  │   │  │ Maya felt nervous about her  │ │
│  What's happening?               │   │  │ first swim class. Her tummy  │ │
│  ┌─────────────────────────────┐ │ → │  │ felt wobbly… (full story,    │ │
│  │ Maya is nervous about her    │ │   │  │ parent reads it all here)    │ │
│  │ first swim class.            │ │   │  ╰─────────────────────────────╯ │
│  └─────────────────────────────┘ │   │                                  │
│                                  │   │  [ ✏ Edit ]  [ ↺ Regenerate ]    │
│  Feeling focus: [ nervous ▾ ]    │   │  [ 🎙 Add narration ]            │
│  Tone: (gentle) playful  calm    │   │  [ ✓ Save to Aria's stories ]    │
│                                  │   │                                  │
│  [ ✨ Make story ]  (needs wifi)  │   │  Parent reviews BEFORE any child │
│                                  │   │  can see it. Then it's offline.  │
│  Dashboard · Stories · Kids · ⚙  │   └─────────────────────────────────┘
└─────────────────────────────────┘
```

---

## Responsive / device notes

- **Phone-first** portrait is the primary canvas (above). 
- **Tablet:** the Friendly Town map gets more breathing room and parallax;
  worlds may show as a larger illustrated scene. Touch targets stay ≥ 88pt.
- **Landscape:** supported for tablets and for the breathing/glitter activities
  (nice for a propped-up device); Home reflows worlds into 3-across.
- **One-hand reach** isn't a goal for kids (they two-hand a propped device),
  but for the **parent gate and dashboard** primary actions sit in the lower
  60% of the screen for thumb reach.
