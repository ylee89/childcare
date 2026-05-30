# 02 · User Flows

Flows are grouped by audience. Child flows are designed to be completable by a
non-reader with narration only. Grown-up flows assume reading literacy.

Legend: `▶` step · `◆` decision · `★` reward/feedback moment · `↩` exit/return

---

## A. First-run onboarding (grown-up assisted)

This is the only flow that *requires* an adult. It is intentionally short
(< 2 minutes) so a parent can set up and hand the device to the child.

```
▶ Splash + warm welcome animation (Mochi waves)
▶ "Made for ages 3–6. A grown-up helps set up — just once."
◆ Has account?
   ├─ No  ▶ Create account: email + password OR Apple/Google SSO
   │        ▶ OR "Skip — use on this device only" (local profile, no PII)
   └─ Yes ▶ Sign in
▶ Add a child:
   ▶ First name / nickname (optional — can be "Friend")
   ▶ Age band: [3–4] [4–5] [5–6]   ← tunes difficulty & content
   ▶ Pick an avatar friend
◆ Microphone for Brave Voice recording?  [Allow] [Not now]  (fully optional)
◆ Gentle reminders?                        [Allow] [Not now]  (notifications)
▶ Download core lessons for offline play  (progress bar, ~ size shown)
★ "All set! Hand me to your little one 💛"  → enters CHILD MODE
```

Design notes: SSO/skip first so the email step is never a hard wall. Mic and
notifications are *opt-in*, requested with plain-language reasons, and the app
is fully functional if both are declined.

---

## B. Child Mode — entering & the daily loop

```
▶ App opens → CHILD MODE → Home (Friendly Town map)
◆ First open today?
   ├─ Yes ▶ Daily Mood Check-in gently slides up (narrated):
   │         "Hi! How are you feeling today?"
   │         ▶ Child taps one of 10 emotion faces
   │         ◆ optional: "a little" / "a lot" (size taps, no numbers)
   │         ★ "Thanks for sharing. It's okay to feel <emotion>."
   │         ◆ if sad/angry/scared/nervous/lonely → soft suggestion:
   │              "Want to visit the Calm Corner?" [Yes] [Maybe later]
   │         ↩ returns to Home (check-in is dismissible, never forced)
   └─ No  ▶ straight to Home
▶ Child taps any world building to play
   … plays one or more activities …
★ Earns a sticker / collects a card on participation (see gamification)
↩ Big Home button returns to map at any time
↩ Calm Corner floating bubble available on every screen
```

Key rule: **the check-in can always be skipped** (tap the map behind it or a
clear "later" cloud). We never block play to extract a mood.

---

## C. Emotion Explorer — Face Match (representative game flow)

```
▶ Enter Emotion Explorer → choose "Face Match" (picture button)
▶ Narrator: "Find the friend who feels HAPPY."  (target emotion spoken + shown as icon)
▶ 3–4 large face cards appear
◆ Child taps a face
   ├─ Correct ★ face does a happy wiggle + chime; "Yes! That's happy!"
   └─ Other   ▶ gentle redirect, NO buzzer, NO score loss:
                "That friend feels sad. Can you find HAPPY?" → try again
▶ Repeat 3–5 rounds (count scales by age band)
★ Round complete → collect/animate the matched Emotion Card into the deck
↩ Auto-return to Emotion Explorer menu; "Play again?" optional
```

This "no wrong answer, gentle redirect" pattern is the **template for all
recognition games**.

---

## D. Story Adventures — interactive scenario

```
▶ Enter Story Adventures → pick a situation (illustrated tiles):
     sharing · being pushed · being left out · being teased · taking turns · asking for help
▶ Animated scene plays, fully narrated (e.g. another child grabs a toy)
▶ Narrator: "What could you do?"
▶ 2–3 illustrated choice bubbles (each also narrated on tap-and-hold preview)
◆ Child picks a response
   → Animated CONSEQUENCE plays for that choice (realistic, age-appropriate)
   → Reflection: "How do you think your friend felt?" (links to feeling faces)
◆ Choice quality:
   ├─ Helpful/assertive choice ★ warm outcome + "Great thinking!"
   └─ Less-helpful choice      ▶ neutral, non-shaming outcome +
                                  "Hmm, that didn't feel good. Want to try again?"
                                  [Try another way] [Keep going]
★ Story complete → sticker + optional "Practice the brave words" → jumps to Brave Voice
↩ Return to story picker
```

Design notes: even "wrong" choices play out so children learn **consequences**,
but the framing is curiosity ("that didn't feel good") not punishment. Replays
are always offered and never penalized.

---

## E. Brave Voice — assertive phrase practice

```
▶ Enter Brave Voice → choose a phrase card:
     "Please stop."  ·  "I don't like that."  ·  "Can I have help?"  ·  "Can I play too?"
▶ Watch a friend model the phrase (animation + clear, confident audio)
▶ "Now you try!"  (big mouth/sound-wave visual)
◆ Microphone enabled?
   ├─ Yes ▶ tap-and-hold the BIG mic bubble to record
   │        ▶ playback: child hears themselves; friend cheers
   │        ◆ [Keep] [Record again] [Delete]   (recordings local-only)
   └─ No  ▶ "echo mode": child says it aloud with the friend, taps "I said it!"
★ "You used your brave voice! 💪"  → Brave Voice sticker
↩ "Try it in a story?" → optional jump to a matching Story Adventure
```

---

## F. Calm Corner — regulation (reachable from anywhere)

Entry points: Home, the floating bubble on any screen, or a suggestion after a
hard mood check-in / tough story moment.

```
▶ Enter Calm Corner → soft, dim, slow ambient scene (palette + audio shift)
▶ Pick an activity (or "Surprise me"):
     🎈 Balloon Breathing · ✨ Glitter Jar · 🔢 Counting Calm · 🎧 Quiet Listen
─ Balloon Breathing ─
   ▶ "Breathe in…" balloon inflates slowly (4s) with rising tone
   ▶ "…and out…" balloon deflates (6s) with falling tone
   ▶ repeat 3–5 cycles; pure pacing, no scoring, no timer pressure
─ Glitter Jar ─
   ▶ child shakes device / taps to stir glitter; watches it settle
   ▶ narrator (optional, soft): "When the glitter settles, our mind feels calm too."
★ On finishing: "You took good care of your feelings." (calm, low-key — NOT a fanfare)
↩ "Ready to go back?" → returns to wherever they came from (preserves context)
```

Design notes: Calm Corner deliberately **breaks the reward pattern** — no loud
chimes, no points. The reward is the calm itself. It can be entered and exited
at any time, including mid-story, without losing progress.

---

## G. Empathy Lab — perspective taking

```
▶ Enter Empathy Lab → "How does this friend feel?"
▶ Scene with a character in a situation (e.g. friend dropped their ice cream)
▶ Child taps the matching feeling face
   ★ "Yes — they feel sad. What could we do to help?"
▶ Kindness choice (share, comfort, invite) → warm animated outcome
▶ "Kindness Mission" (offline, real-world): "Today, give someone a smile 😊"
↩ Return to Empathy Lab
```

---

## H. Good Choice Challenge — quick decisions

```
▶ Enter → fast, friendly scenario round (e.g. "It's clean-up time but you want to keep playing")
▶ 2 illustrated choices
◆ Pick
   ├─ Positive ★ animated good outcome + cheerful confirmation
   └─ Other    ▶ playful "what happens next" + "want to choose again?"
▶ 3–5 rounds, light and quick
★ Challenge sticker
↩ Return
```

---

## I. Parent gate (mode switch)

```
▶ Tap the small "Grown-Ups" key icon (top-right, deliberately understated)
▶ Gate screen: "Ask a grown-up"
   ▶ Hold the button for 3 seconds  AND
   ▶ Solve a simple problem ("What is 4 + 7?") via number pad
◆ Correct & held?
   ├─ Yes → GROWN-UP MODE
   └─ No  → "Let's try again" → back to gate (no lockout, no scary errors)
```

The gate is a *speed bump for kids*, not security against adults. It keeps
settings, recordings, reports, and the AI generator out of small hands.

---

## J. Parent Dashboard (grown-up)

```
▶ Enter Grown-Up Mode → Dashboard (defaults to most-recent child)
◆ Multiple children? → child switcher (top)
▶ This week card: days active, worlds visited, check-ins logged
▶ Emotion trend: simple stacked view of moods over the week
     (e.g. "More 'frustrated' than usual midweek")
▶ Skills by world: gentle progress rings (not %, framed as "exploring → confident")
▶ Areas needing support:
     plain-language insight + 1–2 suggested activities/stories
     e.g. "Aria chose to walk away in conflict stories. Try the 'Brave Voice'
           phrase 'I don't like that.' together."
▶ Actions: [View weekly report] [Generate a story about this] [Adjust settings]
↩ Tabs: Dashboard · Stories · Children · Settings
```

---

## K. AI Story Generator (grown-up, online)

```
▶ Grown-Up Mode → Stories → "New Story"
▶ Form (plain language, no prompt-engineering needed):
     • Child: <select profile> → inserts their name
     • Situation: pick a template OR describe in a sentence
         ("Maya is nervous about the first day of swim class")
     • Feeling focus: pick from the 10 emotions (optional)
     • Tone: gentle / playful / reassuring
◆ Online?
   ├─ No  → "Connect to the internet to make a new story." (saved drafts still available)
   └─ Yes → ▶ Generate (server-side, child-safe constrained) → spinner
▶ REVIEW screen (parent reads the full story before any child sees it):
     [Edit text] [Regenerate] [Add narration ▸ record or auto-voice] [Save]
★ Saved → appears in "My Stories", now offline-playable in Child Mode's
     Story Adventures under a "Just for you" shelf
↩ Back to Stories list
```

Safety: generation is **always parent-initiated and parent-reviewed**. Output
is constrained to age-appropriate, non-frightening, SEL-positive content, and
**never auto-surfaces to a child** without the review/save step. See
[`09-safety-privacy-accessibility.md`](09-safety-privacy-accessibility.md).

---

## Cross-cutting flow rules

1. **Every child screen** has a fixed Home button (bottom-left) and Calm Corner
   bubble (bottom-right).
2. **Nothing is ever "failed."** Redirects, not buzzers. Replays, not penalties.
3. **Narration auto-plays** on screen entry; a tap on any element re-reads it.
4. **Sessions are interruptible.** Quitting mid-activity loses nothing critical;
   collections/progress persist locally.
5. **Mode switches are obvious** via palette, sound, and a transition card so a
   child always knows when they've left "their" part of the app.
