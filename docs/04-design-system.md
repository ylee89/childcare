# 04 · Design System

The visual and interaction language of Feel Friends. Built for small hands,
non-readers, and big feelings. Bright and friendly — but calm, never frantic.

---

## 1. Brand & tone

- **Personality:** warm, gentle, encouraging, playful, safe. A kind friend, not
  a hyperactive cartoon.
- **Voice (copy):** short, kind, first-person-friendly. "It's okay to feel
  sad." "You used your brave voice!" Never corrective, never clinical.
- **The Feel Friends crew (mascots/guides):**
  - 🐻 **Mochi** — the warm host, greets at Home, leads check-ins.
  - 🐰 **Pip** — energetic, hosts Good Choice Challenge & games.
  - 🦊 **Fen** — thoughtful, hosts Story Adventures & Empathy Lab.
  - 🦉 **Luna** — calm, hosts the Calm Corner (soft voice, slow movement).
  Each emotion also has a little face character for the card deck.

---

## 2. Color

### Core UI palette

| Token | Hex | Use |
|---|---|---|
| `--ff-cream` | `#FFF8EF` | App background (Child Mode), warm & low-glare |
| `--ff-ink` | `#3A3A4A` | Primary text (never pure black — softer) |
| `--ff-sky` | `#7CC6FE` | Primary brand / interactive accents |
| `--ff-sun` | `#FFD56B` | Highlights, rewards, sun/greeting |
| `--ff-coral` | `#FF8C7A` | Warm accent, hearts, kindness |
| `--ff-mint` | `#9BE3B4` | Success/positive confirmation |
| `--ff-lilac` | `#C3B5F2` | Empathy, secondary accent |
| `--ff-cloud` | `#FFFFFF` | Cards / tiles surface |

### Calm Corner palette (mode shift)

Deliberately desaturated and dim to signal "slow down."

| Token | Hex | Use |
|---|---|---|
| `--ff-calm-bg` | `#26304A` | Deep, soft night-blue background |
| `--ff-calm-surface` | `#33405E` | Cards in calm mode |
| `--ff-calm-glow` | `#A9C6FF` | Gentle glow / breathing cues |
| `--ff-calm-text` | `#EAF1FF` | Text on calm background |

### Grown-Up Mode palette (mode shift)

Cleaner, more "adult/utility," so the switch is unmistakable.

| Token | Hex | Use |
|---|---|---|
| `--ff-adult-bg` | `#F4F6FA` | Dashboard background |
| `--ff-adult-surface` | `#FFFFFF` | Cards |
| `--ff-adult-primary` | `#4A6FA5` | Buttons, links |
| `--ff-adult-ink` | `#2A3140` | Text |

### Emotion colors (canonical — reused everywhere)

Each of the 10 emotions has one fixed color so children build a consistent
color↔feeling association across cards, check-ins, and charts.

| Emotion | Token | Hex |
|---|---|---|
| happy | `--emo-happy` | `#FFD56B` (sunny yellow) |
| sad | `--emo-sad` | `#7CA9E0` (soft blue) |
| angry | `--emo-angry` | `#FF6B5E` (warm red) |
| frustrated | `--emo-frustrated` | `#FF9F5A` (orange) |
| nervous | `--emo-nervous` | `#B7E07C` (yellow-green) |
| scared | `--emo-scared` | `#9B8CE0` (violet) |
| proud | `--emo-proud` | `#FFB36B` (golden) |
| lonely | `--emo-lonely` | `#8FB0C9` (muted slate-blue) |
| excited | `--emo-excited` | `#FF8FC7` (bright pink) |
| confused | `--emo-confused` | `#C0B7A8` (warm grey) |

> Color is **never the only signal**. Every emotion also has a distinct face,
> a label, and a sound (accessibility + colorblind safety — see §9).

### Contrast

All text/background pairs meet **WCAG AA** (≥ 4.5:1 for body, ≥ 3:1 for large
text and essential icons). A **High Contrast** setting boosts to AAA.

---

## 3. Typography

- **Display / headings:** a rounded, friendly sans (e.g. *Baloo 2*, *Quicksand*,
  or *Fredoka*). Rounded terminals feel soft and safe.
- **Body / UI & dashboard:** a highly legible humanist sans (e.g. *Nunito* or
  system *SF/Roboto*).
- **Letterforms for early readers:** prefer fonts with a **single-story `a`/`g`**
  for the small amount of text kids do see (matches how they learn to write).

### Type scale (mobile, child mode)

| Role | Size / line | Weight |
|---|---|---|
| Screen title | 28 / 34 | 700 |
| Big prompt (narrated) | 24 / 32 | 700 |
| Emotion label | 20 / 26 | 700 |
| Body (rare) | 18 / 26 | 500 |
| Caption (grown-up) | 14 / 20 | 500 |

Minimum on-screen text size is **18pt** in Child Mode. Text scales with OS
Dynamic Type up to 200%.

---

## 4. Spacing, shape & layout

- **Spacing scale (8pt base):** 4, 8, 12, 16, 24, 32, 48, 64.
- **Corner radius:** generous and soft — tiles `24px`, buttons `999px` (pill),
  cards `20px`. No sharp corners anywhere in Child Mode.
- **Layout grid:** single-column priority; child world tiles in a forgiving
  2-column grid with ≥ 24px gutters.
- **Safe areas:** respect notches/home indicators; persistent 🏠/🫧 sit above
  the home indicator.

---

## 5. Touch targets (critical for ages 3–6)

Fine-motor control is still developing, so targets are **much larger** than
adult guidelines:

| Element | Minimum size | Spacing |
|---|---|---|
| Primary tappable (world tile, choice, face) | **88 × 88 pt** | ≥ 24 pt apart |
| Persistent Home / Calm bubble | 64 × 64 pt | pinned, isolated |
| Grown-up Mode controls | 48 × 48 pt (adult standard) | ≥ 8 pt |

- **Forgiving hit areas:** invisible padding extends the tap zone ~12pt beyond
  the visual.
- **Debounce / no double-fire:** ignore accidental rapid double-taps and
  multi-finger mashing.
- **No tiny gestures:** no pinch, no precise drag, no long swipe chains.
  Interactions are **tap** and a single **tap-and-hold** (mic, glitter shake).

---

## 6. Core components

A short catalog (props/states summarized). All have a **narrated** state.

| Component | Description | States |
|---|---|---|
| **WorldTile** | Big icon+label entry to a world | rest, pressed, locked(none in MVP) |
| **EmotionFace** | Round face for an emotion | rest, selected, correct-wiggle, dim/unknown |
| **ChoiceBubble** | Full-width illustrated story choice | rest, pressed, chosen |
| **MicBubble** | Tap-and-hold record control | idle, recording(waveform), playback, disabled→"I said it!" |
| **BreathOrb / Balloon** | Animated breathing pacer | inhale, hold, exhale (timed, looping) |
| **GlitterJar** | Shake/tap settle animation | settling, settled |
| **StickerSlot** | Collected/uncollected reward | empty, earned(pop-in) |
| **CardTile** | Emotion card, flippable | silhouette(unknown), front, back(definition) |
| **NarratorButton** | Re-read this screen | idle, speaking |
| **HomeButton** / **CalmBubble** | Persistent nav | rest, active |
| **ParentGate** | Hold + math challenge | default, holding, success, retry |
| **ProgressDots** | Round indicator (NOT a score) | filled/empty |
| **InsightCard** (grown-up) | Plain-language support tip | — |
| **TrendChart** (grown-up) | Simple bars/rings | — |

> **Never** use score numbers, timers, percentages, or red error states in
> Child Mode components.

---

## 7. Iconography & illustration

- **Style:** rounded, thick-stroke, flat-with-soft-shadow, high color contrast.
- **Faces:** clear, slightly exaggerated expressions so emotions read instantly
  to a 3-year-old. Consistent face structure across the 10 emotions (same
  character family), varying only expression — this teaches "same person,
  different feeling."
- **Diversity:** human characters and situations represent varied skin tones,
  abilities, family structures, and cultures by default.
- **Asset format:** vector (SVG) UI + Lottie/Rive for animation, so everything
  scales crisply and ships small for offline.

---

## 8. Motion & sound

### Motion principles

- **Purposeful, gentle, and slow-ish.** Ease-out, 200–400ms for UI; breathing
  animations run on real, calming timings (inhale ~4s / exhale ~6s).
- **No flashing** (epilepsy-safe: nothing flashes > 3×/sec), no jarring shakes,
  no aggressive bounce.
- **Reward motion is warm, not explosive.** A sticker "pops in" with a soft
  spring; we avoid slot-machine-style confetti storms.
- **`Reduce Motion`** setting (and OS-level respect): swaps animations for
  simple cross-fades; breathing becomes a calm pulsing opacity instead of
  motion.

### Sound & narration

- **Narration is first-class.** Every screen auto-narrates its prompt on entry;
  tapping any element re-reads it. Professional, warm child-directed VO for all
  core content (multiple character voices). On-device TTS only as an
  accessibility fallback / for AI-generated stories the parent didn't record.
- **SFX:** soft, musical, low-volume. Distinct **positive chime** for
  correct/collect; a **neutral soft "boop"** for redirects — *never* a harsh
  buzzer.
- **Audio is optional & controllable:** master volume, narration on/off,
  SFX on/off, and **captions** for narration (for Deaf/HoH children and
  shared/quiet environments).
- **Calm Corner audio** is a separate, softer ambient layer; entering it
  fades the bright SFX out.

---

## 9. Accessibility (built in, not bolted on)

- **WCAG 2.1 AA** baseline for the whole app; AAA contrast option.
- **Screen reader** support (VoiceOver/TalkBack) with meaningful labels — though
  our **built-in narration** means a non-reader doesn't need a screen reader to
  operate the app.
- **Colorblind-safe:** every emotion encoded by face + label + sound + color,
  never color alone.
- **Motor:** giant targets, generous spacing, tap-and-hold tolerance, no
  precise gestures, adjustable hold duration for the mic.
- **Cognitive:** one task per screen, consistent layout, predictable
  navigation, no time pressure anywhere.
- **Settings:** text size, Reduce Motion, High Contrast, narration speed,
  captions, SFX/volume — all in Grown-Up Mode.
- **No flashing content;** respects `prefers-reduced-motion`.

Full policy in [`09-safety-privacy-accessibility.md`](09-safety-privacy-accessibility.md).

---

## 10. Design tokens (starter set)

```jsonc
{
  "color": {
    "cream": "#FFF8EF", "ink": "#3A3A4A", "cloud": "#FFFFFF",
    "sky": "#7CC6FE", "sun": "#FFD56B", "coral": "#FF8C7A",
    "mint": "#9BE3B4", "lilac": "#C3B5F2",
    "calm": { "bg": "#26304A", "surface": "#33405E", "glow": "#A9C6FF", "text": "#EAF1FF" },
    "adult": { "bg": "#F4F6FA", "surface": "#FFFFFF", "primary": "#4A6FA5", "ink": "#2A3140" },
    "emotion": {
      "happy": "#FFD56B", "sad": "#7CA9E0", "angry": "#FF6B5E",
      "frustrated": "#FF9F5A", "nervous": "#B7E07C", "scared": "#9B8CE0",
      "proud": "#FFB36B", "lonely": "#8FB0C9", "excited": "#FF8FC7", "confused": "#C0B7A8"
    }
  },
  "space": { "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32, "xxl": 48, "xxxl": 64 },
  "radius": { "button": 999, "card": 20, "tile": 24 },
  "touch": { "childMin": 88, "persistentNav": 64, "adultMin": 48, "hitSlop": 12 },
  "type": {
    "title": { "size": 28, "line": 34, "weight": 700 },
    "prompt": { "size": 24, "line": 32, "weight": 700 },
    "label": { "size": 20, "line": 26, "weight": 700 },
    "body":  { "size": 18, "line": 26, "weight": 500 },
    "caption": { "size": 14, "line": 20, "weight": 500 }
  },
  "motion": { "uiMs": 300, "breatheInMs": 4000, "breatheOutMs": 6000, "easing": "ease-out" }
}
```

These tokens are mirrored as CSS custom properties in the
[`../prototype/index.html`](../prototype/index.html) prototype.
