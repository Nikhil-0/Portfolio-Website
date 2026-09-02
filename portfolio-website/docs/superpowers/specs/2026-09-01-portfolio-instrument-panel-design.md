# Portfolio Instrument Panel — Design Spec

**Date:** 2026-09-01
**Status:** Approved for planning
**Scope:** Visual, layout, and motion overhaul of the personal portfolio site.

---

## 1. Goal

Present existing content — SP Group and Accenture internships, a Google
apprenticeship, a trading engine, a multi-agent AI system, NTU Computer
Science, National Service, a choir gold in Berlin — with the confidence it
earns. The current site is competent and polite. It underplays the material.

The target reader is a recruiter or engineering hiring manager giving the site
roughly ninety seconds. The site must, in that time, establish that its author
is technically serious and has taste.

### Direction

A **blueprint / instrument panel** aesthetic: the page reads as an engineering
drawing. Technicality comes from structure, measurement, and annotation — a
graticule, hairline rules, mono indices, tabular figures, corner-bracket frames
— never from imitating hardware.

Explicitly rejected: terminal and console skeuomorphism (prompt carets,
typewriter reveals, boot sequences, blinking cursors). The blog posts run past
three hundred words and project descriptions are dense; monospace body text and
typed-out reveals would look the part and cost readers. A boot sequence spends
attention before the visitor has seen the name.

Also rejected: dashboard metrics that do not exist. Every number, span, and
readout on the site must derive from real data in `src/data/` or from the
runtime (current time, word counts). Nothing is invented.

### Constraints

- **Copy is frozen.** No text in `src/data/` changes. Layout, hierarchy,
  component structure, CSS, and motion are all in scope.
- **Existing conventions hold.** Space Grotesk for display, IBM Plex Mono for
  data, accent colour reserved for interactive elements, timeline-versus-grid
  distinction between page types.
- **Data-driven pages stay data-driven.** Adding an entry to a data file must
  continue to require no component edits.
- Light and dark themes both fully supported.
- `prefers-reduced-motion` honoured everywhere, without exception.

### Non-goals

- No CMS, no backend, no analytics.
- No content additions. If a section looks thin, it stays thin.
- No routing changes. The five existing routes plus the 404 remain as they are.
- No smooth-scroll library. Native scrolling is preserved deliberately.

---

## 2. Dependency decision

Add exactly one runtime dependency: **`motion`** (the Motion package, formerly
Framer Motion), ~35KB gzipped.

It earns its place on three things that are genuinely painful to hand-roll:
`AnimatePresence` for route exit animations, spring physics with correct
interruption behaviour, and `useReducedMotion` wired into the same system that
drives everything else.

**Declined:**

- **GSAP** — redundant alongside Motion for this workload; adds a second
  animation paradigm and a second mental model for no gain here.
- **Lenis / smooth-scroll** — scroll hijacking fights trackpads and mice, and
  is the most common way a portfolio feels *worse* the moment a visitor
  actually uses it. Native scroll is a feature.

CSS handles what CSS does well: hover and focus states, the theme transition,
and the graticule. JavaScript animation is reserved for orchestration —
staggers, scroll-triggered reveals, route transitions.

---

## 3. Design system

### 3.1 Token architecture

`src/styles/theme.css` is restructured into two layers. Components reference
only the semantic layer; no component stylesheet contains a raw colour value.

**Layer 1 — primitives.** Raw ramps, theme-independent names:
`--graphite-900` through `--graphite-100`, `--cyan-300/400/600`,
`--mint-400`, `--paper-50/100/200`, `--ink-900`.

**Layer 2 — semantics.** Redefined per theme:

| Token | Role |
|---|---|
| `--color-bg` | Page ground |
| `--color-surface` | Panel fill |
| `--color-surface-2` | Recessed fill (tags, wells) |
| `--grid-line` | Background graticule — very low alpha |
| `--rule` | Hairline structural rules |
| `--rule-strong` | Emphasised rules, panel borders |
| `--color-text` | Body text |
| `--color-text-muted` | Metadata, captions |
| `--color-accent` | Interactive only — links, hover, focus |
| `--color-accent-strong` | Interactive, pressed or emphasised |
| `--color-live` | Active/current state — status dot, "now" marker |
| `--color-highlight` | Awards and honours |

`--color-live` is a new semantic and is deliberately distinct from
`--color-accent`. Accent means *you can act on this*; live means *this is
currently true*. Conflating them is what makes status indicators read as
buttons.

**Dark theme:** ground drops from `#16191d` to roughly `#0b0e11` so the
graticule and the accent both have room to read. Cyan is retained and
tightened.

**Light theme:** true drafting paper — warm off-white ground, near-black ink,
graticule in pale blue. Not merely the dark theme inverted.

### 3.2 Typography

| Role | Face | Treatment |
|---|---|---|
| Hero name | Space Grotesk 700 | `clamp(2.75rem, 10vw, 6.5rem)`, tracking `-0.04em`, two lines |
| Section heading | Space Grotesk 600 | `clamp(1.75rem, 4vw, 2.75rem)`, tracking `-0.03em` |
| Entry title | Space Grotesk 600 | `1.15rem`–`1.35rem` |
| Body prose | System sans | `1rem`, line-height 1.65, measure capped at 68ch |
| Instrument voice | IBM Plex Mono 500 | Uppercase, tracking `0.1em`, `0.72rem` |

The **instrument voice** covers every index, rail label, period, tag,
coordinate, caption, and status readout. All of it carries
`font-variant-numeric: tabular-nums`, so dates and spans align exactly down a
column. Tabular figures are most of what makes a panel read as measured rather
than merely decorated.

**Body prose deliberately stays a system sans.** Display and mono carry the
character. Prose stays readable. This is the single most important restraint in
the whole direction.

### 3.3 Grid and form

- 12-column layout, 8px baseline, content max-width 1200px (up from 1080px).
- A faint full-bleed graticule sits behind all content, rendered as a fixed CSS
  `background-image` of two repeating linear gradients. Zero DOM cost, zero
  animation cost.
- **Corner-bracket frames** replace plain rounded borders on images and
  interactive panels — four short hairlines at the corners rather than a
  continuous outline.
- Radii tighten from `12px` to `4px` (`--radius`) and `2px` (`--radius-sm`).
  Instruments have crisp corners.
- Focus rings become crosshair-style: a 2px accent outline with a 3px offset.

---

## 4. Layout

### 4.1 Chrome

**Header** becomes a fixed instrument bar:

- Left: name, with mono role beneath.
- Centre: indexed navigation.
- Right: a **live Singapore clock** (ticking, `Asia/Singapore`, tabular
  figures), theme toggle, mobile menu button.
- The bottom hairline doubles as a scroll-progress rule.
- Condenses on scroll past ~80px.

The existing mobile menu — portal, focus trap, Escape handling, scroll lock —
is **preserved as-is**. It is correct, accessible, and must not regress. Only
its styling and enter/exit animation change.

**Footer** becomes a status block: contact actions, social links, and a small
mono build readout.

### 4.2 Home

1. **Hero** — two columns. Portrait in a corner-marked frame with a mono
   caption. Name at display scale across two lines. Tagline. A status rail
   carrying location, timezone, and the current SP Group role behind a pulsing
   `--color-live` dot. Primary actions below.

2. **Career spine** — the showpiece. A precise graticule spanning the earliest
   to the latest date present in the data, with a "now" marker at the current
   date.

   **Track composition is constrained by what the data actually contains.**
   An audit of `src/data/` gives:

   | Source | Dates available | Renders as |
   |---|---|---|
   | `experience` | `"Jun 2019"`, `"May 2026 - Jul 2026"`, `"Jul 2026 - Present"` | Spans, plus a point for the single-month entry |
   | `education` | `"Completed 2018"`, `"Completed 2021"`, `"Expected 2028"` | **Milestone points** — these are endpoints, not ranges |
   | `activities` | None. Stages carry labels only (`"Secondary School"`, `"National Service"`, …) | **Excluded** |

   The spine therefore ships with **two tracks**: Experience (spans and points)
   and Education (milestones). Activities are omitted rather than dated by
   inference — deriving stage years from adjacent education dates would be
   invention, which §1 forbids, and a recruiter who spots one wrong year
   discounts everything else on the page.

   The component reads all three sources and renders a track per source that
   yields at least one parseable date, so the Activities track appears
   automatically if real dates are ever added to `activities.js`. No component
   change would be required.

   Hovering a span or milestone raises it and reveals its label. Rotates to a
   vertical layout below 768px. Any entry whose period cannot be parsed is
   omitted rather than rendered at a guessed position.

3. **Recent experience** — spec-sheet rows.

4. **Explore** — four indexed panels.

### 4.3 Projects & Experience

- **Experience:** a measured rail — index, period in tabular mono, title, org,
  description, technology tags.
- **Projects:** numbered panels in a grid, with Trading Engine promoted to a
  full-width feature row. Promotion is driven by array position, not a new data
  field.
- **Certifications:** a dense indexed matrix with **issuer filter chips**,
  derived by deduplicating the `issuer` field. Twelve loose cards become
  something a visitor can navigate. Entries with an empty issuer group under an
  "Other" chip. Filtering is client-side, animates via Motion layout
  transitions, and defaults to showing all.

### 4.4 Education

Timeline with logos in bracket-framed cells and periods on a measured rail in
tabular mono.

### 4.5 Holistic Development

Indexed chapters per life stage. Activity panels get bracket-framed logos, the
existing award badge restyled, and photo galleries upgraded to horizontal
filmstrips feeding the **existing** `Lightbox` component. Lightbox behaviour is
unchanged; only its styling and transitions are updated.

### 4.6 Blog

Expand-in-place is retained. The current `<details>` element is replaced with a
Motion-driven disclosure so the open and close can animate height correctly,
with `aria-expanded` and `aria-controls` wired manually to preserve the
accessibility the native element provided.

Each post shows a **reading-time estimate** computed from the word count of its
sections at 220 words per minute — derived, not invented.

### 4.7 404

Restyled to match the direction, using the existing inline copy moved into the
stylesheet. No copy change.

---

## 5. Components

### 5.1 New components

| Component | Responsibility |
|---|---|
| `Reveal` | Wraps children; fades and rises them once on scroll entry. Accepts a stagger index. The single entry point for all scroll motion. |
| `PageTransition` | Wraps `Routes`; drives exit and enter transitions and resets scroll on navigation. |
| `Panel` | The bracket-framed surface primitive. Replaces ad-hoc `.card` usage. |
| `CareerSpine` | The home-page timeline visualisation. |
| `StatusRail` | Location, timezone, live dot, current role. |
| `LiveClock` | Ticking `Asia/Singapore` time. Cleans up its interval on unmount. |
| `FilterChips` | Controlled filter control for certifications. |
| `Disclosure` | Accessible animated expand/collapse for blog posts. |

Each is independently understandable, takes props rather than reading data
files directly (except `CareerSpine`, which composes across three data files
and owns that composition), and has no knowledge of where it is used.

### 5.2 New utilities

| Module | Responsibility |
|---|---|
| `src/lib/period.js` | Parses the period strings used across the data files (`"Jul 2026 - Present"`, `"Expected 2028"`, `"Completed 2018"`, `"Mar - Apr 2025"`, `"2025"`) into `{ start, end, ongoing }`. Returns `null` on anything unrecognised. |
| `src/lib/readingTime.js` | Word count to minutes for blog posts. |

`period.js` is the one piece of genuine logic in this work and the one place a
silent failure could put wrong information on the page. It must return `null`
rather than guess, and callers must skip null results. It warrants unit tests
covering every format currently present in the data files, plus unparseable
input.

### 5.3 Modified

Every component in `src/components/` is restyled. Structural changes are
confined to `Header` (instrument bar), `HomePage` (hero and spine),
`ProjectsAndExperience` (rail, feature row, filters), and `Blog` (disclosure).
`Education`, `HolisticDevelopment`, `Footer`, `SocialMediaLinks`, `TagList`,
`SectionHeading`, `ImageGallery`, and `Lightbox` change presentation only.

---

## 6. Motion

### 6.1 Tokens

Three durations — 180ms (state), 260ms (transition), 400ms (reveal) — and two
springs: a firm one for interface response, a softer one for entrances. Defined
once; nothing is hand-tuned per component.

### 6.2 Behaviour

| Element | Behaviour |
|---|---|
| Route change | Exit fade + 4px, enter fade + 8px rise, 260ms |
| Section entry | Once-only `useInView`, 12px rise, 40ms stagger |
| Hairline rules | Draw left-to-right via `scaleX`, 400ms |
| Career spine | Spans grow from their origin, staggered by track |
| Panel hover | 2px lift, corner brackets scale in, border to accent |
| Press | `scale(0.99)`, 120ms |
| Theme switch | Circular reveal via View Transitions API, crossfade fallback |
| Header | Condenses on scroll; progress rule tracks position |
| Mobile menu | Panel slides from the right, backdrop fades |

### 6.3 Rules

- **Only `transform` and `opacity` animate.** No animated `width`, `height`,
  `top`, or `box-shadow`. The blog disclosure is the sole exception and uses
  Motion's measured height animation.
- **Nothing above the fold waits on scroll.** The hero animates on mount.
- **Reveals fire once.** Content does not re-animate when scrolled back to.
- **`useReducedMotion` collapses every reveal** to a plain opacity fade with
  zero translation. The existing `prefers-reduced-motion` CSS block remains as
  the backstop for anything CSS-driven.
- **Motion is feedback, not decoration.** Anything that does not clarify a
  state change, a spatial relationship, or a causal link is cut.

---

## 7. Testing and verification

No test infrastructure currently exists. This work adds the minimum that pays
for itself:

- **Unit tests for `period.js`** covering every format present in the data
  files today, plus unparseable input returning `null`. This is the only module
  where a silent bug produces confidently wrong output.
- **Unit test for `readingTime.js`.**
- `npm run lint` passes with `--max-warnings 0`, as configured.
- `npm run build` succeeds.

Manual verification, as a checklist:

1. Every route renders in both themes.
2. Keyboard traversal of the whole site: focus is always visible, the mobile
   menu traps and restores focus, the lightbox and disclosure are operable.
3. `prefers-reduced-motion: reduce` set at OS level — no translation anywhere.
4. Narrow viewport (360px): the career spine is vertical, nothing overflows
   horizontally.
5. Theme toggle in a browser without View Transitions support falls back
   cleanly.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Period parsing produces wrong spine positions | Return `null` and omit rather than guess; unit tests over every real format |
| Direction reads as gimmick | Prose stays system sans; no terminal skeuomorphism; motion is feedback only |
| Motion bundle cost | Single dependency, tree-shaken imports, verified in the build output |
| Accessibility regression in the rebuilt header and blog disclosure | Existing focus trap preserved verbatim; disclosure wires ARIA manually; keyboard pass is a required verification step |
| Graticule harms text contrast | Very low alpha, tested against text in both themes |

---

## 9. Known content issues (flagged, not changed)

Copy is out of scope. Recorded here so they are not lost:

- `src/data/projects.js` — the Google CSSIx entry reads "Selected for an the
  sole cohort"; a typo.
- `src/data/profile.js` — the bio ("Hi there! I'm so glad you're here!") is
  warmer in register than the instrument-panel direction and will sit slightly
  oddly against it. Retained verbatim by explicit decision.
