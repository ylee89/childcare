# Feel Friends — Project Memory

A social-emotional learning (SEL) **PWA** for kids ages 3–6. Vanilla JS, no
build step. Lives in `app/`. Repo: `ylee89/childcare` (public).

## Live & deploy
- **Live URL:** https://ylee89.github.io/childcare/  (GitHub Pages)
- **Pages source = `gh-pages` branch root** (NOT GitHub Actions — the Actions
  workflow was removed because it failed/spammed emails).
- **Deploy command** (run from repo root, after merging to `main`):
  ```
  git checkout main && git reset --hard origin/main
  git branch -D gh-pages-local 2>/dev/null
  git subtree split --prefix app -b gh-pages-local
  git push origin gh-pages-local:gh-pages -f
  git branch -D gh-pages-local
  ```
- After each app change, **bump SW cache** `const CACHE` in `app/sw.js`
  (currently **v14**) so returning users update.
- Repo is **public** so Pages works on the free plan. No secrets in code.
- Tell user to **hard-refresh** + tap once (audio unlock) after deploy.

## Branches & workflow
- Dev branch: **`claude/funny-bell-jVMH6`** (kept == `main`).
- Pattern each task: create `pr-<topic>` branch from `main` → push → open PR →
  merge → deploy gh-pages → `git reset --hard origin/main` on dev + force-push.
- Stale merged PR branches (`pr1..pr5`, `pr-*`) remain on remote; git delete is
  blocked in this env and MCP has no branch-delete tool. Harmless; user can
  delete via GitHub branches page.
- Commit author: `Claude <noreply@anthropic.com>`. Never push to other branches.

## Architecture (`app/`)
- `index.html` — entry; registers `sw.js`.
- `js/app.js` — router + all screens (DOM via `h()` helper). `window.FeelFriends
  = { go, Store, current }` exposed for tests. Splash → boot → onboarding/home.
- `js/store.js` — local-first state in localStorage (profiles, checkins, cards,
  stickers, events, recordings). Nothing uploaded.
- `js/audio.js` — Web Speech narration + WebAudio SFX. KEY details below.
- `js/content.js` — SEL curriculum data (10 emotions, STORIES, PHRASES, EMPATHY,
  CHOICES, MISSIONS).
- `js/illustrations.js` — inline SVG: `storyScene(id)`, `storyOutcomeArt(good)`,
  `mascot(size)`. Cute CREATURE characters (bear/bunny/fox/cat) + mascot "Lumi"
  (blue droplet + heart antenna). Story scenes have environments (playroom,
  kitchen w/ cookie jar, pastel slide). Tappable to hear story (no play button).
- `css/styles.css`, `sw.js`, `manifest.webmanifest`, `icons/`.
- `server.js` — zero-dep static server (`node server.js <port>`), serves `app/`.

## Audio (most-edited; user kept hitting "no sound")
- `Audio.speak(text)` → routes through `Audio.speakSeq([...])`.
- `speakSeq` uses **onend-chaining** (speak next only after prev ends) — Safari/
  iOS drop utterances queued back-to-back after `cancel()`.
- **Autoplay unlock:** audio is blocked until first user gesture; `unlock()` on
  first pointer/touch/key primes speechSynthesis (silent utterance) + resumes
  WebAudio; pre-gesture narration is queued in `pendingSpeak` and replayed.
- **Kid pitch:** default `pitch=1.35`, `rate=0.92`.
- **Voice pick (`pickVoice`)**: scores voices, **strongly prefers `localService`
  (+8)**, de-prioritises non-local Google network voices (-3) because Chrome's
  remote "Google …" voices often emit NO audio (this was the user's bug). Falls
  back to `voice=null` (engine default) if no good local match.
- `Audio.voiceInfo()` powers the **Settings → "🔊 Test voice"** diagnostic
  (shows narration on/off, unlocked, voice count, chosen voice).

## Features built (all live)
- 6 child worlds: Emotion Explorer (mood check-in, Face Match, Name That Feeling,
  flippable cards), Story Adventures, Brave Voice (mic record/playback, local
  only), Calm Corner (balloon breathing, glitter jar, counting, quiet), Empathy
  Lab, Good Choice. Parent gate (hold+math) → Dashboard + Settings.
- **Accessibility:** every choice auto-narrated then tappable to re-read (🔊);
  story script read aloud; in-story record-yourself widget. Non-readers covered.
- Branding: splash + home wordmark + mascot Lumi.

## Testing (run before every merge)
- Unit/docs: `node tests/prototype.test.js` → **132 assertions**.
- E2E (real Chromium): start `node server.js <port>` then
  `BASE=http://localhost:<port> node tests/app.e2e.js` → **56 assertions**.
  - Chromium path: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
    (playwright npm installed; managed browser version mismatch, use this path).
  - e2e stubs speechSynthesis (records text + fires onend); also has a
    call-through "autoplay unlock" contract test (0 utterances before gesture).
- `npm run test:e2e` self-server wrapper gets killed by this sandbox — run
  server + e2e as two separate steps instead.
- **Env gotcha:** `pkill` returns exit 1 when no match → poisons chained/parallel
  Bash. Run git/deploy steps in SMALL sequential commands; guard pkill with
  `|| true`. Don't reset --hard before committing in-progress work.

## Docs
- `docs/01..10` = full design package (IA, flows, wireframes, design system,
  gamification, MVP, roadmap, content, safety/privacy/a11y, Sesame benchmark).
- `README.md` has preview galleries (`tests/brand/*`, `tests/app-screens/*`).

## Open follow-ups / ideas
- Optional server-side neural TTS as a parent-enabled online voice (not default).
- AI Story Generator (designed, not built).
- User confirmed Pages OK with code public; child data stays on-device.
