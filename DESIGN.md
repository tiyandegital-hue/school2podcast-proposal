# DESIGN.md — Concept demo for School2Podcast
Built by Tiyan Digital for lead: School2Podcast (Threads @school2podcast, post 2026-10-31: "I need website developer my budget $450").
Framing: this site IS the pitch — a working concept demo showing the quality bar Tiyan Digital would build the podcast's real site to. All episode/host content is marked SAMPLE.

## Frontmatter
- canvas: #FAF4E9 · paper: #F3ECDC · ink: #1A1410 · body: #4C4234 · muted: #7D7060
- accent: #D9481C (broadcast vermilion — all CTA work) · accent-deep: #B23712 (filled buttons, AA on cream) · accent-ink: #FFF7EE
- hairline: rgba(26,20,16,.16) · dark: #17110C (ending scenes)
- Type: Fraunces variable (display 500/600 + italic) · Inter variable (body) · ui-monospace (labels)
- Radius: 14px cards / 999px pills · Depth: hairlines only, zero shadows · Accent <5% of any screen

## Overview
"Chalkroom Broadcast" — warm paper, ink, one broadcast-red. An editorial newsroom feel for an education podcast. Proof-by-craft: the site itself demonstrates the player UI, episode archive, and subscribe flows the real build would ship.

## Psychology brief
- Visitor: the founder, skimming ~11 vendor pitches; secondary: a curious listener.
- Pain: every vendor says "professional"; fear of a template-looking site and of paying $450 for one.
- One action: start a conversation (contact page / reply to the pitch).
- Trust gap: claims are cheap → the demo must PROVE craft at first glance; no invented numbers anywhere.
- Emotion: warm confidence — "this studio thinks like an editor, not a template shop."

## Niche research (2026-10-31 sources: colorlib, onpodium, createtoday, sitebuilderreport)
Patterns adopted: latest episode above the fold with an on-page player (SERP's Up / WTF with Marc Maron); all listening platforms visible early (DistilCast); ONE bold signature color from cover art run through every CTA (createtoday: pink/lime/teal leaders); marquee topic tickers; per-episode artwork in an editorial archive; dark ending scenes (Joe Rogan / Sober Podcast). Not adopted: dark-everything (warm paper is the differentiator here); invented social-proof strips (honesty law).

## Page list (9, multipage only)
1. index.html — Home
2. episodes.html — Archive (search + topic filter)
3. episode.html — Sample episode detail
4. about.html — About the show / host (placeholders)
5. listen.html — Subscribe / platforms
6. contact.html — Work-with-us / guest pitch form
7. privacy.html — Privacy (preview template)
8. terms.html — Terms (preview template)
9. 404.html

## Signature idea (ONE, Home: the "On-Air Console")
A working demo player card beside the hero headline: cover art, pulsing REC dot, 40-bar CSS waveform, play/pause toggling simulated playback (timer counts, bars animate; paused = frozen), episode progress bar. A sticky mini-player bar appears when the hero console scrolls out of view, sharing the same state. Labelled "Demo player — UI preview". This is the page's one live thing (Taste rule).
- Spec: console radius 18px, paper surface, hairline border; waveform 40 bars, flex, height var --h (JS-generated, 12–96%), animation: barpulse 1.1s ease-in-out infinite alternate, delay = -(i*0.07s); paused state sets animation-play-state: paused. Timer mm:ss via setInterval 1000ms, duration 1920s (32:00, labelled sample). Buttons ≥48px. prefers-reduced-motion: bars static, no autoplay of motion.

## Supporting techniques (quiet, ≤4)
1. Topic marquee strip (CSS linear 28s, duplicated content, aria-hidden dup, paused on reduced motion).
2. Masked line-rise headline entrances (overflow-hidden masks, 110ms stagger, expo.out cubic-bezier(0.16,1,0.3,1)); `.js` gates hidden state → no-JS/rest always visible.
3. Scroll reveals: opacity 0→1 + translateY(24px), 0.8s expo.out, stagger 0.1s via IntersectionObserver.
4. Dark ending scenes: proof card section + footer on #17110C.

## Layout ideas per page
- Home: left-column hero (kicker, H1, sub, CTAs) + On-Air Console right → marquee → latest 3 episode cards → platforms strip → about preview split (ep-tape art) → proof card (bluedhaka.com, dark) → newsletter form → dark footer ending.
- Episodes: header + search + filter chips → 6-card editorial grid (image top, mono topic, title, meta).
- Episode: breadcrumb → console card (large) → two-col: show notes (sample) + sidebar (details, share/copy-link).
- About: story (SAMPLE) → host placeholder card → "what the show covers" chips → CTA.
- Listen: platform cards (real links: Apple Podcasts, Spotify, Pocket Casts) + RSS note "goes live at launch".
- Contact: form left (name, email, topic select, message, consent checkbox, demo notice) + "what happens next" right.
- Privacy/Terms: prose page, "preview template" notice.
- 404: designed scene on dark: giant Fraunces "404", "This page didn't make the syllabus."

## Type numbers
- H1: clamp(2.8rem, 6.2vw, 5.25rem), Fraunces 560, lh 0.98, tracking -0.03em, 2–3 hand-broken lines.
- H2: clamp(1.9rem, 3.6vw, 2.9rem), lh 1.04, -0.02em. H3: 1.3rem. Body: 1.0625rem/1.65. Small: 0.875rem.
- Mono labels: 0.6875rem, uppercase, +0.22em, 60% ink. Emphasis via italic serif, never bold. Headlines ≤2 lines at every width.

## Colour numbers
- 1 bg + 1 ink + greys + 1 accent. Hierarchy via opacity (100/80/60/40), borders 10–20% ink. Selection: accent-deep bg, cream text. No gradients-as-visual, no glow, no blobs.
- Contrast: accent-deep #B23712 on cream ≈ 5.6:1 (buttons ✓); body #4C4234 on canvas ≈ 8.9:1 ✓; muted #7D7060 on canvas ≈ 4.7:1 ✓ (small text use); accent #D9481C reserved for large text/decor (≥3:1 ✓).

## Motion numbers
- Entrance: nav → kicker → H1 → sub → CTA → console, 0.12s steps from 0.05s, done by ~1.3s. Base: opacity 0→1 + translateY(24px), 0.8s expo.out. Hover ≤1.03/200ms, :active 0.97.
- reduced-motion: all static, marquee paused, waveform frozen, no line-rise.

## Honesty (design material)
- ONE swappable constant: `SITE_NAME = "School2Podcast"` in js/site.js, applied to `[data-site]` spans; no-JS fallback = literal name in HTML.
- `.ph` SAMPLE badge on every invented block: all 6 episodes, host bio, show story, durations, topics. No stats section at all (no download counts, no ratings).
- Proof: ONE real card — bluedhaka.com, "full e-commerce website, designed + built by Tiyan Digital", live link. No other claims.
- Player: "Demo player — UI preview" label; simulated timer; durations labelled sample.
- Forms: demo notice ("Preview form — submissions are simulated"), real consent checkbox, JS thank-you state only.
- Images: generated originals for this proposal (images/CREDITS.md); no stock people, no endorsements.
- Legal: Privacy + Terms as "preview templates". No cookies/analytics/fonts CDN on this demo → no banner. Privacy discloses self-hosted fonts only.

## Known gaps
- No real audio, no RSS feed, no platform URLs yet — platform cards link to platform homepages as placeholders until the show claims its listings.
- No live-browser visual QA possible in this environment — static overflow audit done; recommend a desktop+phone visual pass before outreach.
