# 10 · Reference Benchmark — *Breathe, Think, Do with Sesame*

The user pointed to **Breathe, Think, Do with Sesame** (Sesame Workshop) as a
similar, existing app. It's the best-known free SEL app for this age and a
strong benchmark. This doc captures what it does, what's worth borrowing, and
how Feel Friends is positioned differently.

> *Note:* details below reflect the app's well-documented public design as of
> the knowledge cutoff; verify specifics against the live app before building.

---

## 1. What *Breathe, Think, Do* does

- **Audience:** ages ~2–5; made by Sesame Workshop, **free**, English + Spanish.
- **Core loop — the "Breathe, Think, Do" strategy.** The child helps a cute
  monster through a frustrating everyday challenge in three steps:
  1. **Breathe** — calm the body with **belly breathing** (the monster's tummy
     rises/falls; tap to breathe). *Regulate first.*
  2. **Think** — consider a few **plans** to solve the problem.
  3. **Do** — **try a plan** and watch it work out.
- **5 challenges:** getting dressed, saying goodbye (separation), going to
  sleep, fixing a fallen tower, and a puzzle (trying again / persistence).
- **Supports:** parent/caregiver tips, goal-setting language, encouraging VO,
  laughter and warmth, very simple tap interactions, replayable.
- **Philosophy:** model **self-regulation → problem-solving → action**, with no
  fail state, lots of warmth, and grown-up guidance baked in.

---

## 2. What's worth borrowing (and where it lives in Feel Friends)

| Strength of Breathe, Think, Do | How Feel Friends adopts it |
|---|---|
| **"Regulate before you solve"** sequencing (breathe *first*) | This is our exact rationale for making the **Calm Corner reachable from every screen** and suggesting it before tough moments. We can also offer an explicit **Breathe → Think → Do flow inside Story Adventures** (see §4). |
| **Belly/balloon breathing** as the calming primitive | Directly mirrored by our **Balloon Breathing** in Calm Corner. |
| **No-fail, warm, replayable** challenges | Core to our [user-flow rules](02-user-flows.md): gentle redirects, replays, never punished. |
| **Strong caregiver tips & involvement** | Our **Parent Dashboard + suggested activities** and **co-play roadmap item** extend this. |
| **Free, accessible, bilingual, simple taps** | We keep a **generous free core**, plan **localization** (roadmap Phase 3), and use **giant single-tap targets**. |
| **A lovable guide character** | Our **Feel Friends crew** (Mochi/Pip/Fen/Luna) plays this role. |

---

## 3. How Feel Friends is different / broader

Breathe, Think, Do is excellent but narrow — it teaches **one strategy** across
**five everyday self-control challenges**. Feel Friends is a broader **SEL
platform**:

| Dimension | Breathe, Think, Do | **Feel Friends** |
|---|---|---|
| Primary goal | Self-control + problem-solving (one strategy) | Full SEL: **recognize + name emotions, communicate, set boundaries, regulate, empathize, choose** |
| Emotion vocabulary | Mostly frustration/calm | **10 named emotions** with a collectible, teaching card deck |
| Boundaries / assertiveness | Not a focus | **Brave Voice** — explicit assertive-phrase practice ("Please stop." etc.) + optional recording |
| Social conflict scenarios | Everyday tasks (dressing, sleep) | **Peer-conflict** focus: sharing, being pushed, exclusion, teasing, turn-taking, asking for help |
| Empathy / perspective-taking | Implicit | **Empathy Lab** — explicit "how does this friend feel?" + kindness missions |
| Personalization | Fixed challenges | **AI Story Generator** — parent-authored, child-named social stories |
| Insight for grown-ups | Tips | **Parent Dashboard** — emotion trends, areas to support, weekly reports |
| Regulation access | Within the 3-step flow | **Always-on Calm Corner** (one tap from anywhere, mid-activity) |
| Reward model | Intrinsic, warm | Same ethos, made explicit: **completable collection, no streaks/timers/loot** (see [gamification](05-gamification-strategy.md)) |

**Positioning in one line:** *Breathe, Think, Do teaches a child to calm down
and solve a problem; Feel Friends teaches the whole emotional toolkit —
naming feelings, speaking up, calming down, understanding others, and choosing
well — and gives parents insight into how it's going.*

---

## 4. Concrete idea adopted from the benchmark — the "Calm → Think → Do" arc

We'll explicitly fold Sesame's proven 3-step sequence into **Story Adventures**
(and surface it as language elsewhere), because "regulate first, then choose"
is exactly the habit we want to build:

```
Story Adventure (e.g. "being pushed")
  1. CALM   → if the scene is upsetting, Luna offers a quick balloon breath
              (links to Calm Corner) before choosing — "Let's calm our body first."
  2. THINK  → "What could you do?" present the choices (our existing step)
  3. DO     → pick a response → watch the consequence → reflect
```

This keeps Feel Friends' breadth while inheriting Breathe, Think, Do's most
research-backed mechanic. It's a small addition to the existing Story Adventures
flow and a natural tie-in between the **Calm Corner** and **Story/Choice** worlds.

---

## 5. Other respected references (for the team)

Worth studying alongside Sesame for tone, safety, and SEL grounding:

- **Sesame Workshop** more broadly (emotional vocabulary, inclusion, free
  caregiver resources).
- **Daniel Tiger's Neighborhood** (PBS) — emotion-regulation *songs/strategies*
  ("When you feel so mad that you want to roar, take a deep breath and count to
  four"), great for catchy, memorable coping scripts.
- **Inside Out** (Pixar) — naming and normalizing core emotions for kids.
- **CASEL framework** — the SEL competency model to align curriculum &
  the dashboard's "skills" against (self-awareness, self-management, social
  awareness, relationship skills, responsible decision-making) — note how our
  six worlds map cleanly onto these five competencies.

CASEL ↔ Feel Friends mapping:

| CASEL competency | Feel Friends world(s) |
|---|---|
| Self-awareness | Emotion Explorer (check-in, cards) |
| Self-management | Calm Corner |
| Social awareness | Empathy Lab |
| Relationship skills | Brave Voice, Story Adventures |
| Responsible decision-making | Good Choice Challenge, Story Adventures |
