# Portfolio Instrument Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's visual language and motion as a blueprint/instrument-panel system, so existing content reads as confidently as it deserves.

**Architecture:** A two-layer CSS token system (primitives → semantics) drives every component. Motion is centralised in two React primitives — `Reveal` for scroll entry and `PageTransition` for routes — so no component hand-rolls animation. Two pure utility modules (`period.js`, `readingTime.js`) derive the only computed data on the site, and both are unit-tested because they are the only places a silent bug produces confidently wrong output.

**Tech Stack:** React 19, Vite 7, React Router 7, `motion` (Framer Motion), plain CSS with custom properties, Vitest for unit tests.

**Spec:** `docs/superpowers/specs/2026-09-01-portfolio-instrument-panel-design.md`

## Global Constraints

- **DO NOT COMMIT OR PUSH. Ever.** The repository owner handles all git operations. Leave every change in the working tree. This overrides the commit steps that normally end a task; each task here ends with a verification step instead.
- **Copy is frozen.** No string inside `src/data/` may be edited, reworded, or added to. Layout, hierarchy, component structure, CSS, and motion are in scope.
- **Nothing is invented.** Every date, span, count, and readout must derive from `src/data/` or the runtime. If data is missing, omit the element.
- Body prose stays a system sans (`--font-sans`). Monospace is for the instrument voice only — indices, periods, labels, tags, captions, status readouts.
- `--color-accent` is for interactive affordances only. `--color-live` marks current state. Never substitute one for the other.
- Animate `transform`, `opacity`, and paint-only properties (`color`, `border-color`, `background-color`, `filter`, `clip-path`). **Never** animate `width`, `height`, `top`, `left`, `margin`, `padding`, or `box-shadow` — these force layout on every frame. The blog disclosure's height animation is the single documented exception, and it is why `Disclosure` exists as its own component rather than a CSS transition.
- `prefers-reduced-motion` must be honoured by every animation, via `useReducedMotion()` in JS and the existing media block in CSS.
- No component stylesheet may contain a raw colour value. Reference semantic tokens only.
- `npm run lint` must pass with `--max-warnings 0` (the configured value) at the end of every task.
- Existing header focus-trap, Escape handling, and scroll-lock behaviour must not regress.
- Add exactly one runtime dependency: `motion`. No GSAP, no scroll-hijacking library.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/lib/period.js` | Parse period strings into structured dates; compute numeric bounds |
| `src/lib/readingTime.js` | Word count → minutes for blog posts |
| `src/lib/period.test.js` | Unit tests for the parser |
| `src/lib/readingTime.test.js` | Unit tests for reading time |
| `src/components/Reveal.jsx` | Scroll-entry animation primitive |
| `src/components/PageTransition.jsx` | Route enter/exit animation + scroll reset |
| `src/components/Panel.jsx` | Bracket-framed surface primitive |
| `src/components/LiveClock.jsx` | Ticking Asia/Singapore readout |
| `src/components/StatusRail.jsx` | Location, timezone, live role indicator |
| `src/components/CareerSpine.jsx` | Home-page timeline visualisation |
| `src/components/FilterChips.jsx` | Controlled filter control |
| `src/components/Disclosure.jsx` | Accessible animated expand/collapse |
| `src/styles/motion.css` | Motion tokens + keyframes |
| `src/styles/Panel.css` | Panel + corner-bracket styling |
| `src/styles/CareerSpine.css` | Spine layout |
| `src/styles/StatusRail.css` | Status rail + live dot |
| `src/styles/FilterChips.css` | Chip styling |

**Modified:** `src/styles/theme.css` (restructured), every file in `src/components/`, every file in `src/styles/`, `src/App.jsx`, `src/main.jsx`, `package.json`, `vite.config.js`.

**Untouched:** everything in `src/data/`, `src/hooks/`, `src/assets/`, `public/`.

---

## Task 1: Test infrastructure and the period parser

The parser is built first because `CareerSpine` (Task 9) cannot be written without it, and because it is the only module where a bug puts wrong information in front of a reader.

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/lib/period.js`
- Test: `src/lib/period.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `parsePeriod(raw: string) => Period | null` where
    `Period = { kind: 'span' | 'point', start: Endpoint, end: Endpoint | null, ongoing: boolean, label: string }`
    and `Endpoint = { year: number, month: number | null }` with `month` 0-indexed.
  - `periodBounds(period: Period | null, now?: Date) => { start: number, end: number } | null` — epoch milliseconds.

- [ ] **Step 1: Install Vitest**

```bash
npm install --save-dev vitest@^3
```

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Enable globals in the Vite config**

In `vite.config.js`, add a `test` key to the `defineConfig` object, alongside the existing `base`, `plugins`, and `resolve` keys:

```js
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
```

- [ ] **Step 4: Write the failing tests**

Create `src/lib/period.test.js`. These cases cover every format currently present in `src/data/`, plus the failure paths.

```js
import { describe, expect, it } from 'vitest';
import { parsePeriod, periodBounds } from './period';

describe('parsePeriod', () => {
  it('parses an ongoing span with a month', () => {
    expect(parsePeriod('Jul 2026 - Present')).toEqual({
      kind: 'span',
      start: { year: 2026, month: 6 },
      end: null,
      ongoing: true,
      label: 'Jul 2026 - Present',
    });
  });

  it('parses a closed span with months on both sides', () => {
    expect(parsePeriod('May 2026 - Jul 2026')).toEqual({
      kind: 'span',
      start: { year: 2026, month: 4 },
      end: { year: 2026, month: 6 },
      ongoing: false,
      label: 'May 2026 - Jul 2026',
    });
  });

  it('borrows the trailing year when the first month omits it', () => {
    expect(parsePeriod('Mar - Apr 2025')).toEqual({
      kind: 'span',
      start: { year: 2025, month: 2 },
      end: { year: 2025, month: 3 },
      ongoing: false,
      label: 'Mar - Apr 2025',
    });
  });

  it('parses an en-dash span', () => {
    const result = parsePeriod('Oct – Nov 2025');
    expect(result.start).toEqual({ year: 2025, month: 9 });
    expect(result.end).toEqual({ year: 2025, month: 10 });
  });

  it('parses a single month and year as a point', () => {
    expect(parsePeriod('Jun 2019')).toEqual({
      kind: 'point',
      start: { year: 2019, month: 5 },
      end: { year: 2019, month: 5 },
      ongoing: false,
      label: 'Jun 2019',
    });
  });

  it('parses a bare year as a point with no month', () => {
    expect(parsePeriod('2025')).toEqual({
      kind: 'point',
      start: { year: 2025, month: null },
      end: { year: 2025, month: null },
      ongoing: false,
      label: '2025',
    });
  });

  it('strips the "Expected" qualifier', () => {
    expect(parsePeriod('Expected 2028').start).toEqual({ year: 2028, month: null });
  });

  it('strips the "Completed" qualifier', () => {
    expect(parsePeriod('Completed 2018').start).toEqual({ year: 2018, month: null });
  });

  it.each([
    [undefined],
    [null],
    [''],
    ['   '],
    ['sometime soon'],
    ['Smorgasbord 2025'],
    ['2020 - 2021 - 2022'],
    ['Present'],
  ])('returns null for unparseable input: %s', (input) => {
    expect(parsePeriod(input)).toBeNull();
  });
});

describe('periodBounds', () => {
  it('returns null for a null period', () => {
    expect(periodBounds(null)).toBeNull();
  });

  it('uses the end of the closing month', () => {
    const bounds = periodBounds(parsePeriod('May 2026 - Jul 2026'));
    expect(bounds.start).toBe(Date.UTC(2026, 4, 1));
    expect(bounds.end).toBe(Date.UTC(2026, 7, 0));
  });

  it('uses the supplied now for an ongoing span', () => {
    const now = new Date(Date.UTC(2026, 8, 1));
    const bounds = periodBounds(parsePeriod('Jul 2026 - Present'), now);
    expect(bounds.end).toBe(now.getTime());
  });

  it('spans a whole year when no month is given', () => {
    const bounds = periodBounds(parsePeriod('2025'));
    expect(bounds.start).toBe(Date.UTC(2025, 0, 1));
    expect(bounds.end).toBe(Date.UTC(2025, 12, 0));
  });
});
```

- [ ] **Step 5: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./period"`.

- [ ] **Step 6: Implement the parser**

Create `src/lib/period.js`:

```js
// ---------------------------------------------------------------------------
// Parses the period strings used across src/data/ into structured dates.
//
// Supported forms (every form currently present in the data files):
//   "Jul 2026 - Present"   ongoing span
//   "May 2026 - Jul 2026"  closed span
//   "Mar - Apr 2025"       closed span, year borrowed from the tail
//   "Jun 2019"             point, month precision
//   "2025"                 point, year precision
//   "Expected 2028"        point, qualifier stripped
//   "Completed 2018"       point, qualifier stripped
//
// Returns null for anything else. Callers MUST skip nulls rather than
// substitute a guess: a wrong date on the page is worse than a missing one.
// ---------------------------------------------------------------------------

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const QUALIFIER = /^(expected|completed|since)\s+/i;
const ENDPOINT = /^([A-Za-z]{3,9})?\s*(\d{4})?$/;

const PRESENT = Symbol('present');

/** Parses one side of a range. Returns an Endpoint, PRESENT, or null. */
function parseEndpoint(text, fallbackYear) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (/^present$/i.test(trimmed)) return PRESENT;

  const match = trimmed.match(ENDPOINT);
  if (!match) return null;

  const [, monthWord, yearText] = match;
  if (!monthWord && !yearText) return null;

  let month = null;
  if (monthWord) {
    const key = monthWord.slice(0, 3).toLowerCase();
    if (!(key in MONTHS)) return null;
    month = MONTHS[key];
  }

  const year = yearText ? Number(yearText) : fallbackYear;
  if (!Number.isInteger(year)) return null;

  return { year, month };
}

export function parsePeriod(raw) {
  if (typeof raw !== 'string') return null;

  // Normalise every dash variant to a plain hyphen before splitting.
  const cleaned = raw.replace(/[‐-―]/g, '-').trim();
  if (!cleaned) return null;

  const parts = cleaned.replace(QUALIFIER, '').split(/\s*-\s*/);

  if (parts.length === 1) {
    const point = parseEndpoint(parts[0], null);
    if (!point || point === PRESENT) return null;
    return { kind: 'point', start: point, end: point, ongoing: false, label: raw };
  }

  if (parts.length !== 2) return null;

  // "Mar - Apr 2025": the head has no year, so it borrows the tail's.
  const tail = parseEndpoint(parts[1], null);
  const fallbackYear = tail && tail !== PRESENT ? tail.year : null;
  const head = parseEndpoint(parts[0], fallbackYear);

  if (!head || head === PRESENT) return null;
  if (tail === PRESENT) {
    return { kind: 'span', start: head, end: null, ongoing: true, label: raw };
  }
  if (!tail) return null;

  return { kind: 'span', start: head, end: tail, ongoing: false, label: raw };
}

/**
 * Converts a period to epoch-millisecond bounds for positioning on a scale.
 * A missing month means the widest reading: January for a start, the end of
 * December for an end.
 */
export function periodBounds(period, now = new Date()) {
  if (!period) return null;

  const start = Date.UTC(period.start.year, period.start.month ?? 0, 1);

  let end;
  if (period.ongoing || !period.end) {
    end = now.getTime();
  } else {
    // Day 0 of the following month is the last day of this one.
    end = Date.UTC(period.end.year, (period.end.month ?? 11) + 1, 0);
  }

  return { start, end: Math.max(start, end) };
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all cases green.

- [ ] **Step 8: Verify lint is clean**

Run: `npm run lint`
Expected: exit 0, no output. **Do not commit.**

---

## Task 2: Reading-time utility

**Files:**
- Create: `src/lib/readingTime.js`
- Test: `src/lib/readingTime.test.js`

**Interfaces:**
- Consumes: Vitest setup from Task 1.
- Produces: `readingTime(sections: Array<{ body: string | string[] }>, wpm?: number) => number` — whole minutes, minimum 1.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/readingTime.test.js`:

```js
import { describe, expect, it } from 'vitest';
import { readingTime } from './readingTime';

const words = (n) => Array.from({ length: n }, () => 'word').join(' ');

describe('readingTime', () => {
  it('returns a minimum of one minute for short content', () => {
    expect(readingTime([{ body: 'three short words' }])).toBe(1);
  });

  it('rounds to the nearest minute at 220 wpm', () => {
    expect(readingTime([{ body: words(660) }])).toBe(3);
  });

  it('counts array bodies as well as string bodies', () => {
    expect(readingTime([{ body: [words(220), words(220)] }])).toBe(2);
  });

  it('sums across sections', () => {
    expect(readingTime([{ body: words(220) }, { body: words(220) }])).toBe(2);
  });

  it('returns 1 for an empty section list', () => {
    expect(readingTime([])).toBe(1);
  });

  it('ignores a missing body', () => {
    expect(readingTime([{ heading: 'Only a heading' }])).toBe(1);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./readingTime"`.

- [ ] **Step 3: Implement**

Create `src/lib/readingTime.js`:

```js
// ---------------------------------------------------------------------------
// Estimated reading time for a blog post, derived from its own word count.
// 220 wpm is a common prose reading rate. Always at least one minute, so a
// short post reads "1 MIN" rather than "0 MIN".
// ---------------------------------------------------------------------------

const WORDS_PER_MINUTE = 220;

export function readingTime(sections, wpm = WORDS_PER_MINUTE) {
  const text = (sections ?? [])
    .flatMap((section) => {
      const { body } = section ?? {};
      if (!body) return [];
      return Array.isArray(body) ? body : [body];
    })
    .join(' ');

  const count = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(count / wpm));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — both test files green.

- [ ] **Step 5: Verify lint**

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 3: Token architecture

Everything downstream references these tokens, so this lands before any component work. The site will look partially rebuilt at the end of this task — that is expected and is corrected by Tasks 5 onward.

**Files:**
- Modify: `src/styles/theme.css` (full rewrite of the token blocks and shared building blocks)
- Create: `src/styles/motion.css`
- Modify: `src/main.jsx:5-7` (import `motion.css`)

**Interfaces:**
- Consumes: nothing.
- Produces: the semantic token set below, plus `.page`, `.section`, `.eyebrow`, `.meta`, `.tag`, `.btn`, `.award-badge`, `.muted`, `.visually-hidden`, `.instrument`, `.index-label`, `.rule` as shared classes. Every later task uses these names.

- [ ] **Step 1: Replace the token blocks in `src/styles/theme.css`**

Replace everything from the opening `:root {` through the closing brace of `:root[data-theme='light'] {` with:

```css
:root {
  /* ---- Layer 1: primitives. Never referenced by components. ---- */
  --graphite-900: #0b0e11;
  --graphite-800: #111519;
  --graphite-700: #171c22;
  --graphite-600: #1e242c;
  --graphite-500: #2a323c;
  --graphite-400: #3b4652;
  --graphite-300: #5d6b7a;
  --graphite-200: #94a3b1;
  --graphite-100: #dfe5ea;

  --paper-50: #fbfaf7;
  --paper-100: #f2f1ec;
  --paper-200: #e4e3dc;
  --paper-300: #cfd2cb;
  --ink-900: #12151a;
  --ink-600: #4d5866;

  --cyan-300: #6fe3ff;
  --cyan-400: #18c4ec;
  --cyan-600: #0a7d9c;
  --cyan-800: #063a4a;
  --mint-400: #55d6a0;
  --mint-600: #1f8f63;

  /* ---- Layer 2: semantics. Dark is the default theme. ---- */
  --color-bg: var(--graphite-900);
  --color-surface: var(--graphite-800);
  --color-surface-2: var(--graphite-700);
  --grid-line: rgba(147, 197, 218, 0.05);
  --rule: var(--graphite-500);
  --rule-strong: var(--graphite-400);
  --color-text: #e8ecef;
  --color-text-muted: var(--graphite-200);
  --color-accent: var(--cyan-400);
  --color-accent-strong: var(--cyan-300);
  --color-accent-contrast: #04222b;
  --color-live: var(--mint-400);
  --color-highlight: var(--mint-400);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 12px 32px rgba(0, 0, 0, 0.45);

  /* ---- Shared scale ---- */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  --font-display: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas,
    'Liberation Mono', monospace;

  --radius: 4px;
  --radius-sm: 2px;
  --content-width: 1200px;
  --measure: 68ch;
  --grid-unit: 8px;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4.5rem;

  --transition: 160ms ease;

  color-scheme: dark;
}

:root[data-theme='light'] {
  --color-bg: var(--paper-50);
  --color-surface: #ffffff;
  --color-surface-2: var(--paper-100);
  --grid-line: rgba(31, 78, 110, 0.07);
  --rule: var(--paper-300);
  --rule-strong: #b3b8b0;
  --color-text: var(--ink-900);
  --color-text-muted: var(--ink-600);
  --color-accent: var(--cyan-600);
  --color-accent-strong: #075e78;
  --color-accent-contrast: #ffffff;
  --color-live: var(--mint-600);
  --color-highlight: var(--mint-600);
  --shadow-sm: 0 1px 2px rgba(20, 30, 45, 0.08);
  --shadow-md: 0 12px 32px rgba(20, 30, 45, 0.12);

  color-scheme: light;
}
```

- [ ] **Step 2: Add the graticule and typography base**

In the same file, replace the existing `html` and `body` rules with:

```css
html {
  height: 100%;
  background-color: var(--color-bg);
}

body {
  margin: 0;
  min-height: 100%;
  font-family: var(--font-sans);
  color: var(--color-text);
  background-color: var(--color-bg);
  background-image:
    repeating-linear-gradient(
      to right,
      var(--grid-line) 0 1px,
      transparent 1px calc(var(--grid-unit) * 8)
    ),
    repeating-linear-gradient(
      to bottom,
      var(--grid-line) 0 1px,
      transparent 1px calc(var(--grid-unit) * 8)
    );
  background-attachment: fixed;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  transition: background-color var(--transition), color var(--transition);
}
```

- [ ] **Step 3: Add the instrument voice and structural classes**

Append to `src/styles/theme.css`:

```css
/* --------------------------------------------------------------------------
   Instrument voice — every index, label, period, tag, caption and readout.
   Tabular figures are what make columns of dates align exactly; without them
   the panel reads as decorated rather than measured.
   -------------------------------------------------------------------------- */
.instrument,
.eyebrow,
.meta,
.tag,
.index-label {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 500;
}

.index-label {
  color: var(--color-text-muted);
}

/* A hairline structural rule. Animated by drawing scaleX from 0 to 1. */
.rule {
  height: 1px;
  background-color: var(--rule);
  transform-origin: left center;
}

.page {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-5);
}

.section + .section {
  margin-top: var(--space-8);
}

.prose {
  max-width: var(--measure);
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 0;
}
```

- [ ] **Step 4: Delete the old page-entry animation**

The `.page { animation: page-in ... }` declaration and the `@keyframes page-in` block are superseded by `PageTransition` in Task 4. Remove both from `src/styles/theme.css`. Leaving them causes a double animation on every navigation.

- [ ] **Step 5: Update the section heading rule**

Replace the existing `.section-heading` and `.section-heading::after` rules with:

```css
.section-heading {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 var(--space-6);
}

.section-heading::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--rule);
  transform: translateY(-0.35em);
}
```

- [ ] **Step 6: Create the motion tokens**

Create `src/styles/motion.css`:

```css
/* ==========================================================================
   Motion tokens. Three durations and two springs, defined once. Nothing in
   the codebase should hand-tune a duration or an easing curve.
   ========================================================================== */

:root {
  --dur-state: 180ms;      /* hover, focus, press — immediate feedback */
  --dur-transition: 260ms; /* route changes, disclosure */
  --dur-reveal: 400ms;     /* scroll entry, rules drawing */

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.85); }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-state: 0.01ms;
    --dur-transition: 0.01ms;
    --dur-reveal: 0.01ms;
  }
}
```

- [ ] **Step 7: Import the motion tokens**

In `src/main.jsx`, add the import immediately after the `theme.css` import so motion tokens resolve against the theme:

```js
import './styles/theme.css';
import './styles/motion.css';
import './index.css';
```

- [ ] **Step 8: Verify**

Run: `npm run dev` and load `http://localhost:5173`.
Expected: the site renders with the new ground colour, the graticule is faintly visible, headings are noticeably larger, and both themes toggle without a flash of unstyled colour. Layout will look rough in places — that is corrected in later tasks.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 4: Motion primitives

Two components own all motion on the site. No other component may import from `motion` directly, except three documented exceptions: `Header` (Task 6, for `useScroll`), `CareerSpine` (Task 9, for per-bar entrance staggering) and `Disclosure` (Task 15, for the height animation).

**Files:**
- Modify: `package.json` (add `motion`)
- Create: `src/components/Reveal.jsx`
- Create: `src/components/PageTransition.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `<Reveal as="div" index={0} className="" children />` — fades and rises children once on scroll entry. `index` multiplies a 40ms stagger. `as` selects the rendered element.
  - `<PageTransition>{routes}</PageTransition>` — wraps `<Routes>`, animates route changes, resets scroll to top on navigation.

- [ ] **Step 1: Install Motion**

```bash
npm install motion@^12
```

- [ ] **Step 2: Write the Reveal primitive**

Create `src/components/Reveal.jsx`:

```jsx
import React from 'react';
import * as motionLib from 'motion/react';

const { motion, useReducedMotion } = motionLib;

const STAGGER_MS = 40;

/**
 * Fades and rises its children once, the first time they enter the viewport.
 *
 * Reveals fire once and do not replay on scroll-back — replaying draws
 * attention to content the reader has already accepted.
 *
 * With reduced motion, the rise is dropped entirely and only opacity changes.
 */
export default function Reveal({
  as = 'div',
  index = 0,
  className,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: reduced ? 0 : 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: reduced ? 0 : (index * STAGGER_MS) / 1000,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 3: Write the PageTransition primitive**

Create `src/components/PageTransition.jsx`:

```jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as motionLib from 'motion/react';

const { AnimatePresence, motion, useReducedMotion } = motionLib;

/**
 * Animates route changes and resets scroll position on navigation.
 *
 * React Router does not restore scroll by itself; without the effect below,
 * navigating from the bottom of a long page lands you at the bottom of the
 * next one.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : -4 }}
        transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Wire PageTransition into the app**

In `src/App.jsx`, import it and wrap the `<Routes>` element. The `location` prop on `<Routes>` is required — without it, React Router swaps the route content before the exit animation finishes and the outgoing page vanishes instantly.

```jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import PageTransition from './components/PageTransition';
```

Then, inside the component:

```jsx
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  usePageTitle();

  return (
    <div className="app-container">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsAndExperience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/holistic-development" element={<HolisticDevelopment />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, then click between Home, Projects, Education, and Blog.
Expected: each route fades out and the next fades in with a small rise; scroll resets to the top on every navigation; no flicker or double-animation.

Enable "Reduce motion" in your OS accessibility settings and navigate again.
Expected: routes cross-fade with no vertical movement.

Run: `npm run lint` and `npm test`
Expected: both exit 0. **Do not commit.**

---

## Task 5: Panel primitive and corner brackets

Replaces the current `.card` / `.card--interactive` pair with a single primitive. The corner brackets are the signature form of the whole direction, so they are defined once here and never re-implemented.

**Files:**
- Create: `src/components/Panel.jsx`
- Create: `src/styles/Panel.css`
- Modify: `src/styles/theme.css` (remove `.card`, `.card--interactive`; restyle `.tag`, `.btn`, `.award-badge`)

**Interfaces:**
- Consumes: tokens from Task 3.
- Produces: `<Panel as="article" interactive={false} className="" children />`. `as` selects the element; `interactive` adds hover/press affordances. Later tasks use `<Panel>` in place of `className="card"`.

- [ ] **Step 1: Write the Panel component**

Create `src/components/Panel.jsx`:

```jsx
import React from 'react';
import '../styles/Panel.css';

/**
 * The bracket-framed surface used for every card-like element on the site.
 *
 * `interactive` is for panels the reader can act on — it adds the lift, the
 * bracket expansion and the accent border. A panel that is purely presentational
 * must not receive it, or the site starts promising affordances it does not have.
 */
export default function Panel({
  as: Tag = 'div',
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const classes = ['panel', interactive && 'panel--interactive', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Write the Panel styles**

Create `src/styles/Panel.css`. The eight gradients draw four corner brackets; there is no continuous border. `--bracket` is the arm length and `--bracket-color` the ink, so both can be overridden per usage.

```css
.panel {
  --bracket: 14px;
  --bracket-weight: 1px;
  --bracket-color: var(--rule-strong);

  position: relative;
  padding: var(--space-5);
  background-color: var(--color-surface);
  isolation: isolate;
}

/* The bracket set lives on an overlay so it can be transformed independently
   of the panel's content. Scaling the overlay pushes the corners outward. */
.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0),
    linear-gradient(var(--bracket-color) 0 0);
  background-repeat: no-repeat;
  background-size:
    var(--bracket) var(--bracket-weight),
    var(--bracket-weight) var(--bracket),
    var(--bracket) var(--bracket-weight),
    var(--bracket-weight) var(--bracket),
    var(--bracket) var(--bracket-weight),
    var(--bracket-weight) var(--bracket),
    var(--bracket) var(--bracket-weight),
    var(--bracket-weight) var(--bracket);
  background-position:
    left top, left top,
    right top, right top,
    left bottom, left bottom,
    right bottom, right bottom;
  transition: transform var(--dur-state) var(--ease-out);
}

.panel--interactive {
  transition: transform var(--dur-state) var(--ease-out);
}

.panel--interactive:hover,
.panel--interactive:focus-within {
  --bracket-color: var(--color-accent);
  transform: translateY(-2px);
}

.panel--interactive:hover::before,
.panel--interactive:focus-within::before {
  transform: scale(1.012);
}

.panel--interactive:active {
  transform: scale(0.99);
  transition-duration: 120ms;
}
```

- [ ] **Step 3: Remove the superseded card classes**

Delete the `.card` and `.card--interactive` rule blocks from `src/styles/theme.css`. Every consumer is migrated in Tasks 6–16. Leaving them invites new code to use the old primitive.

- [ ] **Step 4: Restyle tags, buttons and the award badge**

In `src/styles/theme.css`, replace the `.tag`, `.btn` and `.award-badge` rule blocks with:

```css
.tag {
  padding: 0.2rem 0.5rem;
  background-color: var(--color-surface-2);
  border: 1px solid var(--rule);
  color: var(--color-text-muted);
  white-space: nowrap;
  transition: border-color var(--dur-state), color var(--dur-state);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--rule-strong);
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color var(--dur-state), color var(--dur-state),
    background-color var(--dur-state), transform var(--dur-state);
}

.btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
}

.btn:active {
  transform: scale(0.98);
}

.btn--primary {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-contrast);
}

.btn--primary:hover {
  background-color: var(--color-accent-strong);
  border-color: var(--color-accent-strong);
  color: var(--color-accent-contrast);
}

.award-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  color: var(--color-highlight);
  background-color: color-mix(in srgb, var(--color-highlight) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-highlight) 35%, transparent);
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`.
Expected: cards across the site lose their rounded borders. They will look unstyled until their pages are migrated — that is expected. Buttons are now mono, uppercase, and square-cornered in both themes.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 6: Header instrument bar and live clock

**Files:**
- Create: `src/components/LiveClock.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/components/NavigationBar.jsx`
- Modify: `src/styles/header.css`
- Modify: `src/styles/NavigationBar.css`

**Interfaces:**
- Consumes: `Panel` (Task 5), tokens (Task 3).
- Produces: `<LiveClock />` — a `<time>` element showing Singapore time, updating every second.

**Header is a documented exception to the "no direct motion imports" rule:** it uses `useScroll` for the progress rule.

- [ ] **Step 1: Write the LiveClock**

Create `src/components/LiveClock.jsx`:

```jsx
import React, { useEffect, useState } from 'react';

const FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Singapore',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/**
 * Singapore local time, ticking. Real data, not decoration — it is the one
 * readout on the page that changes while you look at it, which is what sells
 * the panel as live rather than printed.
 */
export default function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className="instrument live-clock" dateTime={now.toISOString()}>
      SGT {FORMATTER.format(now)}
    </time>
  );
}
```

- [ ] **Step 2: Add the scroll-progress rule to the Header**

In `src/components/Header.jsx`, add these imports:

```jsx
import * as motionLib from 'motion/react';
import LiveClock from './LiveClock';

const { motion, useScroll } = motionLib;
```

Inside the component, above the return:

```jsx
  const { scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
```

- [ ] **Step 3: Restructure the header markup**

Replace the opening `<header>` and `.header-content` block in `src/components/Header.jsx` with the following. **Do not touch the three `useEffect` blocks that implement the mobile-menu focus trap, Escape handling and scroll lock, and do not change the `createPortal` block below** — only its class names may change.

```jsx
    <header className={`site-header${condensed ? ' site-header--condensed' : ''}`}>
      <div className="header-content">
        <div className="site-title">
          <Link to="/">{profile.name}</Link>
          <span className="instrument site-title__role">{profile.current}</span>
        </div>

        <NavigationBar className="navbar--desktop" />

        <div className="header-actions">
          <LiveClock />
          <SocialMediaLinks className="social-media-links--desktop" />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            ref={toggleRef}
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <motion.div
        className="site-header__progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </header>
```

- [ ] **Step 4: Add indices to the navigation**

In `src/components/NavigationBar.jsx`, render a zero-padded index before each label. The index is derived from array position, so `src/data/nav.js` is untouched:

```jsx
        {navLinks.map((link, i) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              <span className="nav-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {link.label}
            </NavLink>
          </li>
        ))}
```

- [ ] **Step 5: Style the header**

Replace the contents of `src/styles/header.css` with rules implementing: a sticky bar (`position: sticky; top: 0; z-index: 50`) with a `backdrop-filter: blur(12px)` and a translucent `--color-bg` background; a `1px` bottom rule in `--rule`; `.site-header--condensed` reducing vertical padding via `padding-block` and gaining `--shadow-sm`; `.site-title` as a display-face name with `.site-title__role` beneath in the instrument voice and `--color-text-muted`; and `.site-header__progress` as a `2px` bar pinned to the bottom edge, `background-color: var(--color-accent)`, `transform-origin: left center`, `transform: scaleX(0)`.

Restyle the mobile menu classes in place — `.mobile-menu__panel` gains a left `1px` rule and `--color-surface` background; the backdrop gains `backdrop-filter: blur(4px)`. **The markup and behaviour stay exactly as they are.**

Transitions on `.site-header` must use `padding-block` and `background-color` only — do not transition `height`.

- [ ] **Step 6: Style the navigation**

In `src/styles/NavigationBar.css`, set nav links in the instrument voice, with `.nav-index` in `--color-text-muted` at `0.62rem`, offset above the baseline via `vertical-align: super`. The active link uses `--color-accent` and gains a `1px` underline drawn with a `::after` at `transform: scaleX(1)`; inactive links keep the `::after` at `scaleX(0)` and transition it on hover.

- [ ] **Step 7: Verify**

Run: `npm run dev`.
Expected checklist:
1. The clock ticks and reads Singapore time.
2. Scrolling fills the progress rule left-to-right; it reaches full width at the page bottom.
3. The header condenses past 80px without the content jumping.
4. **Tab through the header, open the mobile menu at a narrow width, Tab through it, press Escape.** Focus must stay trapped inside the panel while open, and return to the menu button on close. This is a regression check on existing behaviour.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 7: Footer status block

**Files:**
- Modify: `src/components/Footer.jsx`
- Modify: `src/styles/Footer.css`
- Modify: `src/components/SocialMediaLinks.jsx`
- Modify: `src/styles/SocialMediaLinks.css`

**Interfaces:**
- Consumes: tokens (Task 3), `Reveal` (Task 4).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Restructure the footer**

Rewrite `src/components/Footer.jsx` so the footer reads as a terminating status block. Keep every existing string; only structure and class names change.

```jsx
import React from 'react';
import { FiMail } from 'react-icons/fi';
import SocialMediaLinks from './SocialMediaLinks';
import { profile } from '../data/profile';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__rule" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__block">
          <span className="index-label">Contact</span>
          <div className="site-footer__contact">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>
              <FiMail aria-hidden="true" />
              Get in touch
            </a>
            {profile.showResume && (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                Download résumé
              </a>
            )}
          </div>
        </div>

        <div className="site-footer__block">
          <span className="index-label">Elsewhere</span>
          <SocialMediaLinks />
        </div>

        <div className="site-footer__block">
          <span className="index-label">Build</span>
          <p className="instrument site-footer__copy">
            © {new Date().getFullYear()} {profile.name} · React · Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Style the footer**

Rewrite `src/styles/Footer.css`: `.site-footer__inner` is a three-column grid at `minmax(0, 1fr)` each with `gap: var(--space-6)`, collapsing to one column below 720px, constrained to `--content-width` and centred. `.site-footer__block` stacks its label above its content with `gap: var(--space-3)`. `.site-footer__rule` is a full-width `1px` line in `--rule`. `.site-footer__copy` uses `--color-text-muted` and `text-transform: none`.

- [ ] **Step 3: Restyle social links**

In `src/styles/SocialMediaLinks.css`, render each link as a `36px` square with a `1px` `--rule` border, `--color-text-muted` icon, transitioning `border-color` and `color` to `--color-accent` on hover over `var(--dur-state)`. No `transform` on hover — the footer is not a call to action and should not bounce.

- [ ] **Step 4: Verify**

Run: `npm run dev`, scroll to the footer on every route.
Expected: three labelled columns on desktop, stacked below 720px; social icons are square-framed and highlight on hover; both themes read correctly.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 8: Home hero and status rail

**Files:**
- Create: `src/components/StatusRail.jsx`
- Create: `src/styles/StatusRail.css`
- Modify: `src/components/HomePage.jsx` (hero section only)
- Modify: `src/styles/HomePage.css`

**Interfaces:**
- Consumes: `LiveClock` (Task 6), tokens (Task 3).
- Produces: `<StatusRail />` — reads `profile` directly and renders location, timezone, and the current role behind a live dot.

- [ ] **Step 1: Write the StatusRail**

Create `src/components/StatusRail.jsx`:

```jsx
import React from 'react';
import { profile } from '../data/profile';
import '../styles/StatusRail.css';

/**
 * The hero's live readout. Renders only what `profile` actually provides —
 * if `current` is absent the whole live indicator is omitted rather than
 * showing a dot with nothing behind it.
 */
export default function StatusRail() {
  return (
    <dl className="status-rail">
      <div className="status-rail__item">
        <dt className="index-label">Location</dt>
        <dd className="instrument">{profile.location} · UTC+8</dd>
      </div>

      {profile.current && (
        <div className="status-rail__item">
          <dt className="index-label">Status</dt>
          <dd className="instrument status-rail__live">
            <span className="status-rail__dot" aria-hidden="true" />
            {profile.current}
          </dd>
        </div>
      )}
    </dl>
  );
}
```

- [ ] **Step 2: Style the status rail**

Create `src/styles/StatusRail.css`:

```css
.status-rail {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin: var(--space-6) 0 0;
  padding: var(--space-4) 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

.status-rail__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.status-rail__item dd {
  margin: 0;
  color: var(--color-text);
  text-transform: none;
  letter-spacing: 0.04em;
}

.status-rail__live {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-rail__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--color-live);
  animation: live-pulse 2.4s var(--ease-in-out) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .status-rail__dot {
    animation: none;
  }
}
```

- [ ] **Step 3: Rebuild the hero markup**

In `src/components/HomePage.jsx`, replace the `<section className="hero">` block. Every string is unchanged; `profile.bio` keeps its exact wording.

```jsx
      <section className="hero">
        <div className="hero__text">
          <p className="index-label hero__eyebrow">
            {profile.location} — Portfolio / 2026
          </p>
          <h1 className="hero__name">
            <span>{profile.name.split(' ')[0]}</span>
            <span>{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__bio prose">{profile.bio}</p>
          <StatusRail />
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/projects">
              View my work <FiArrowRight aria-hidden="true" />
            </Link>
            <a className="btn" href={`mailto:${profile.email}`}>
              <FiMail aria-hidden="true" /> Email me
            </a>
            {profile.showResume && (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                Résumé
              </a>
            )}
          </div>
        </div>

        <figure className="hero__figure">
          <div className="hero__frame">
            <img
              className="hero__portrait"
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              width="320"
              height="400"
              fetchpriority="high"
            />
          </div>
          <figcaption className="instrument hero__caption">
            Fig. 01 — {profile.name}
          </figcaption>
        </figure>
      </section>
```

Add the import: `import StatusRail from './StatusRail';`

- [ ] **Step 4: Style the hero**

In `src/styles/HomePage.css`, replace the hero rules:

```css
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: var(--space-8);
  align-items: start;
  padding-bottom: var(--space-8);
}

.hero__eyebrow {
  margin: 0 0 var(--space-5);
}

.hero__name {
  display: flex;
  flex-direction: column;
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 10vw, 6.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.92;
  margin: 0 0 var(--space-5);
}

.hero__tagline {
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2.2vw, 1.4rem);
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--space-4);
  max-width: 34ch;
}

.hero__bio {
  color: var(--color-text-muted);
  margin: 0;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.hero__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Corner-marked frame: four brackets, no continuous border. */
.hero__frame {
  position: relative;
  padding: var(--space-3);
}

.hero__frame::before,
.hero__frame::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--rule-strong);
  border-style: solid;
}

.hero__frame::before {
  top: 0;
  left: 0;
  border-width: 1px 0 0 1px;
}

.hero__frame::after {
  bottom: 0;
  right: 0;
  border-width: 0 1px 1px 0;
}

.hero__portrait {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  transition: filter var(--dur-transition) var(--ease-out);
}

.hero__figure:hover .hero__portrait {
  filter: grayscale(0) contrast(1);
}

.hero__caption {
  color: var(--color-text-muted);
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-6);
  }

  .hero__figure {
    order: -1;
    max-width: 240px;
  }
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`.
Expected: the name is set at display scale on two lines; the portrait sits in a bracket frame and desaturates until hovered; the status rail shows location, UTC+8, and a pulsing dot beside the SP Group role. At 360px width the portrait moves above the text and nothing overflows horizontally.

With reduced motion enabled, the dot does not pulse.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 9: Career spine

The showpiece. Read spec §4.2 before starting — in particular the table showing which data files actually carry dates. **Activities have no dates and must not be given any.** The component is written so the Activities track appears automatically if real dates are ever added to `activities.js`, and stays absent until then.

**Files:**
- Create: `src/components/CareerSpine.jsx`
- Create: `src/styles/CareerSpine.css`
- Modify: `src/components/HomePage.jsx` (insert the section after the hero)

**Interfaces:**
- Consumes: `parsePeriod`, `periodBounds` (Task 1); `Reveal` (Task 4).
- Produces: `<CareerSpine />` — self-contained; reads the three data files itself.

- [ ] **Step 1: Write the component**

Create `src/components/CareerSpine.jsx`:

```jsx
import React, { useMemo } from 'react';
import * as motionLib from 'motion/react';
import { parsePeriod, periodBounds } from '../lib/period';
import { experience } from '../data/projects';
import { education } from '../data/education';
import { stages } from '../data/activities';
import '../styles/CareerSpine.css';

const { motion, useReducedMotion } = motionLib;

const YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Turns a list of raw items into positioned spine entries, dropping anything
 * whose period cannot be parsed.
 *
 * Dropping is deliberate: a guessed date on a career timeline is worse than a
 * missing one, because a reader who spots one wrong year stops trusting the
 * rest of the page.
 */
function buildTrack(label, items, now) {
  const entries = items
    .map((item, i) => {
      const period = parsePeriod(item.period);
      const bounds = periodBounds(period, now);
      if (!period || !bounds) return null;
      return {
        key: `${label}-${i}-${item.label}`,
        label: item.label,
        detail: item.detail,
        period,
        bounds,
      };
    })
    .filter(Boolean);

  return entries.length > 0 ? { label, entries } : null;
}

export default function CareerSpine() {
  const reduced = useReducedMotion();

  const model = useMemo(() => {
    const now = new Date();

    const tracks = [
      buildTrack(
        'Experience',
        experience.map((e) => ({ period: e.period, label: e.title, detail: e.org })),
        now,
      ),
      buildTrack(
        'Education',
        education.map((e) => ({ period: e.period, label: e.school, detail: e.period })),
        now,
      ),
      // Activities carry no dates today, so this track resolves to null and is
      // dropped. Add real periods to activities.js and it appears by itself.
      buildTrack(
        'Activities',
        stages.flatMap((stage) =>
          stage.activities.map((a) => ({ period: a.period, label: a.org, detail: stage.label })),
        ),
        now,
      ),
    ].filter(Boolean);

    if (tracks.length === 0) return null;

    const all = tracks.flatMap((track) => track.entries);
    const min = Math.min(...all.map((e) => e.bounds.start));
    const max = Math.max(...all.map((e) => e.bounds.end));

    // Pad to whole years so the axis lands on round numbers.
    const firstYear = new Date(min).getUTCFullYear();
    const lastYear = new Date(max).getUTCFullYear();
    const domainStart = Date.UTC(firstYear, 0, 1);
    const domainEnd = Date.UTC(lastYear + 1, 0, 1);
    const span = domainEnd - domainStart;

    const pct = (t) => ((t - domainStart) / span) * 100;

    const years = [];
    for (let y = firstYear; y <= lastYear + 1; y += 1) years.push(y);

    return {
      tracks: tracks.map((track) => ({
        ...track,
        entries: track.entries.map((entry) => {
          const start = pct(entry.bounds.start);
          // A point still needs a visible footprint; give it two months.
          const rawSize = pct(entry.bounds.end) - start;
          const size = Math.max(rawSize, (YEAR / 6 / span) * 100);
          return { ...entry, start, size };
        }),
      })),
      years,
      nowPct: pct(now.getTime()),
      showNow: now.getTime() >= domainStart && now.getTime() <= domainEnd,
    };
  }, []);

  if (!model) return null;

  return (
    <section className="section spine" aria-labelledby="spine-heading">
      <div className="section-head">
        <h2 className="section-heading section-heading--bare" id="spine-heading">
          Timeline
        </h2>
      </div>

      <div className="spine__chart">
        <div className="spine__axis" aria-hidden="true">
          {model.years.map((year) => (
            <span
              key={year}
              className="instrument spine__year"
              style={{ '--at': `${((year - model.years[0]) / (model.years.length - 1)) * 100}%` }}
            >
              {year}
            </span>
          ))}
        </div>

        {model.tracks.map((track) => (
          <div className="spine__track" key={track.label}>
            <span className="index-label spine__track-label">{track.label}</span>
            <div className="spine__lane">
              {model.showNow && (
                <span
                  className="spine__now"
                  style={{ '--at': `${model.nowPct}%` }}
                  aria-hidden="true"
                />
              )}
              {track.entries.map((entry, i) => (
                <motion.span
                  className={`spine__bar${entry.period.ongoing ? ' spine__bar--live' : ''}`}
                  key={entry.key}
                  style={{ '--start': `${entry.start}%`, '--size': `${entry.size}%` }}
                  tabIndex={0}
                  initial={{ scaleX: reduced ? 1 : 0, opacity: reduced ? 0 : 1 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{
                    duration: reduced ? 0 : 0.4,
                    ease: [0.22, 1, 0.36, 1],
                    delay: reduced ? 0 : i * 0.06,
                  }}
                >
                  <span className="spine__tip">
                    {entry.label}
                    <span className="spine__tip-detail">{entry.period.label}</span>
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Style the spine**

Create `src/styles/CareerSpine.css`:

```css
.spine__chart {
  position: relative;
  border-top: 1px solid var(--rule);
  padding-top: var(--space-5);
}

.spine__axis {
  position: relative;
  height: 1.2rem;
  margin-bottom: var(--space-4);
}

.spine__year {
  position: absolute;
  left: var(--at);
  transform: translateX(-50%);
  color: var(--color-text-muted);
}

.spine__track {
  display: grid;
  grid-template-columns: 8rem minmax(0, 1fr);
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--rule);
}

.spine__lane {
  position: relative;
  height: 2rem;
}

.spine__now {
  position: absolute;
  left: var(--at);
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--color-live);
  opacity: 0.7;
}

.spine__bar {
  position: absolute;
  left: var(--start);
  width: var(--size);
  top: 50%;
  height: 10px;
  margin-top: -5px;
  transform-origin: left center;
  background-color: var(--color-accent);
  opacity: 0.75;
  cursor: default;
  transition: opacity var(--dur-state), height var(--dur-state);
}

.spine__bar--live {
  background-color: var(--color-live);
}

.spine__bar:hover,
.spine__bar:focus-visible {
  opacity: 1;
}

.spine__tip {
  position: absolute;
  left: 0;
  bottom: calc(100% + 6px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-surface);
  border: 1px solid var(--rule-strong);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--color-text);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-state) var(--ease-out);
  z-index: 2;
}

.spine__tip-detail {
  color: var(--color-text-muted);
}

.spine__bar:hover .spine__tip,
.spine__bar:focus-visible .spine__tip {
  opacity: 1;
}

/* Below 768px the lane grows a fixed height per entry and bars stack, so the
   spine stays legible instead of compressing a decade into 320px. */
@media (max-width: 768px) {
  .spine__axis {
    display: none;
  }

  .spine__track {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-2);
  }

  .spine__lane {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .spine__now {
    display: none;
  }

  .spine__bar {
    position: relative;
    left: auto;
    width: 100%;
    top: auto;
    height: auto;
    margin-top: 0;
    padding: var(--space-2) var(--space-3);
    background-color: var(--color-surface-2);
    border-left: 3px solid var(--color-accent);
    opacity: 1;
  }

  .spine__bar--live {
    border-left-color: var(--color-live);
    background-color: var(--color-surface-2);
  }

  .spine__tip {
    position: static;
    opacity: 1;
    padding: 0;
    background: none;
    border: 0;
    white-space: normal;
  }
}
```

- [ ] **Step 3: Insert the spine into the home page**

In `src/components/HomePage.jsx`, add `import CareerSpine from './CareerSpine';` and place `<CareerSpine />` immediately after the closing `</section>` of the hero, before the "Recent experience" section.

- [ ] **Step 4: Verify the rendered data against the source**

This is the most important verification in the plan. Open the home page and check the spine against `src/data/` by eye:

1. **Experience track shows three bars:** Google (Jun 2019), Accenture (May–Jul 2026), SP Group (Jul 2026 → now, in the live colour).
2. **Education track shows three markers** at 2018, 2021 and 2028.
3. **There is no Activities track.** If one appears, `parsePeriod` is returning non-null for `undefined` — stop and fix Task 1.
4. **The "now" line sits at the current date**, to the right of the SP Group bar's start.
5. Hover and keyboard-focus each bar; the label and the original period string appear.
6. At 360px width the spine becomes a stacked list with readable labels and no horizontal overflow.

Run: `npm run lint` and `npm test`
Expected: both exit 0. **Do not commit.**

---

## Task 10: Home page remaining sections

**Files:**
- Modify: `src/components/HomePage.jsx`
- Modify: `src/components/EntryCard.jsx`
- Modify: `src/styles/HomePage.css`
- Modify: `src/styles/EntryCard.css`

**Interfaces:**
- Consumes: `Panel` (Task 5), `Reveal` (Task 4).
- Produces: `EntryCard` now renders through `Panel` and accepts an optional `index` prop rendered as a zero-padded label.

- [ ] **Step 1: Migrate EntryCard onto Panel**

In `src/components/EntryCard.jsx`, replace the `<article className={...card...}>` wrapper with `Panel`, and add the index:

```jsx
import Panel from './Panel';

export default function EntryCard({ entry, index }) {
  const primary = entry.links && entry.links.length > 0 ? entry.links[0] : null;

  return (
    <Panel as="article" interactive={Boolean(primary)} className="entry-card">
      <header className="entry-card__head">
        {typeof index === 'number' && (
          <span className="index-label entry-card__index">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <h3 className="entry-card__title">
          {primary ? (
            <a
              className="entry-card__title-link"
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.title}
              <FiArrowUpRight aria-hidden="true" />
            </a>
          ) : (
            entry.title
          )}
        </h3>
        {entry.period && <span className="meta entry-card__period">{entry.period}</span>}
      </header>
      {entry.org && <p className="entry-card__org instrument">{entry.org}</p>}
      <p className="entry-card__description prose">{entry.description}</p>
      <TagList items={entry.tech} label="Technologies used" />
      {entry.links && entry.links.length > 0 && (
        <div className="entry-card__links">
          {entry.links.map((link) => (
            <a
              key={link.href}
              className="btn"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} <FiExternalLink aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </Panel>
  );
}
```

Remove the now-unused `card` class references from `src/styles/EntryCard.css` and restyle: `.entry-card__head` is a flex row with the index first, title next, and period pushed right via `margin-left: auto`; `.entry-card__org` uses `--color-text-muted`; `.entry-card__title` uses `--font-display` at `1.2rem`.

- [ ] **Step 2: Wrap the remaining home sections in Reveal**

In `src/components/HomePage.jsx`, wrap the "Recent experience" and "Explore" sections. Pass `index` so entries stagger:

```jsx
      {featuredExperience.length > 0 && (
        <Reveal as="section" className="section">
          <div className="section-head">
            <h2 className="section-heading section-heading--bare">Recent experience</h2>
            <Link className="section-head__link instrument" to="/projects">
              All projects &amp; experience <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="entry-list">
            {featuredExperience.map((entry, i) => (
              <Reveal key={entry.title} index={i}>
                <EntryCard entry={entry} index={i} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal as="section" className="section">
        <h2 className="section-heading">Explore</h2>
        <ul className="explore-grid">
          {explore.map((item, i) => (
            <Reveal as="li" key={item.to} index={i}>
              <Link className="explore-card" to={item.to}>
                <Panel interactive className="explore-card__panel">
                  <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="explore-card__label">
                    {item.label}
                    <FiArrowUpRight aria-hidden="true" />
                  </span>
                  <span className="explore-card__blurb muted">{item.blurb}</span>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Reveal>
```

Add imports for `Reveal` and `Panel`.

- [ ] **Step 3: Style the explore grid**

In `src/styles/HomePage.css`, set `.explore-grid` to `display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-4); list-style: none; margin: 0; padding: 0;`. `.explore-card` removes link underlines and inherits colour. `.explore-card__panel` stacks its three children with `gap: var(--space-3)` and a `min-height` of `9rem`. `.explore-card__label` uses `--font-display` at `1.1rem` with the icon pushed to the right via `justify-content: space-between`. `.section-head` is a flex row, `align-items: baseline`, `justify-content: space-between`.

- [ ] **Step 4: Verify**

Run: `npm run dev`.
Expected: experience cards and explore panels fade and rise in sequence as you scroll, once only — scrolling back up and down again does not replay them. Panels lift and their brackets expand on hover. With reduced motion enabled everything appears with no vertical movement.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 11: Projects & Experience — rail and feature row

**Files:**
- Modify: `src/components/ProjectsAndExperience.jsx` (experience and projects sections only)
- Modify: `src/styles/timeline.css`
- Modify: `src/styles/ProjectsAndExperience.css`

**Interfaces:**
- Consumes: `Panel`, `Reveal`, `EntryCard` with `index` (Task 10).
- Produces: nothing consumed later.

- [ ] **Step 1: Rebuild the experience rail**

Replace the experience `<section>` in `src/components/ProjectsAndExperience.jsx`. The existing `railLines` helper stays as-is — it splits the period across lines for the rail.

```jsx
        <Reveal as="section" className="section">
          <SectionHeading>Experience</SectionHeading>
          <div className="timeline">
            {experience.map((entry, i) => (
              <Reveal className="timeline__item" key={entry.title + entry.org} index={i}>
                <div className="timeline__rail">
                  <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                  {railLines(entry.period).map((line, j) => (
                    <div className="instrument" key={j}>{line}</div>
                  ))}
                </div>
                <div className="timeline__body">
                  <h3 className="timeline__title">{entry.title}</h3>
                  {entry.org && <p className="timeline__org instrument">{entry.org}</p>}
                  <p className="prose">{entry.description}</p>
                  <TagList items={entry.tech} label="Technologies used" />
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
```

- [ ] **Step 2: Restyle the timeline**

In `src/styles/timeline.css`: `.timeline__item` becomes `display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: var(--space-6); padding: var(--space-6) 0; border-top: 1px solid var(--rule);`. `.timeline__rail` stacks its children with `gap: var(--space-2)` and uses `--color-text-muted`. `.timeline__title` uses `--font-display` at `clamp(1.15rem, 2.2vw, 1.45rem)`. `.timeline__org` uses `--color-accent` and `text-transform: uppercase`. Below 720px, collapse to a single column and let the rail sit above the body.

- [ ] **Step 3: Promote the first project to a feature row**

Replace the projects `<section>`:

```jsx
      <Reveal as="section" className="section">
        <SectionHeading>Projects</SectionHeading>
        <div className="entry-list entry-list--grid">
          {projects.map((entry, i) => (
            <Reveal
              key={entry.title}
              index={i}
              className={i === 0 ? 'entry-list__feature' : undefined}
            >
              <EntryCard entry={entry} index={i} />
            </Reveal>
          ))}
        </div>
      </Reveal>
```

In `src/styles/ProjectsAndExperience.css`, set `.entry-list--grid` to `display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4);` and `.entry-list__feature { grid-column: 1 / -1; }`. Promotion is by array position — no new data field, so `projects.js` stays untouched.

- [ ] **Step 4: Verify**

Run: `npm run dev` and open `/projects`.
Expected: experience entries sit against a measured rail with zero-padded indices and periods in tabular mono; Trading Engine spans the full grid width; the remaining projects flow in a responsive grid; entries stagger in on scroll.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 12: Certifications matrix and filter chips

**Files:**
- Create: `src/components/FilterChips.jsx`
- Create: `src/styles/FilterChips.css`
- Modify: `src/components/ProjectsAndExperience.jsx` (certifications section)
- Modify: `src/styles/ProjectsAndExperience.css`

**Interfaces:**
- Consumes: `Panel` (Task 5), `Reveal` (Task 4).
- Produces: `<FilterChips options={string[]} value={string} onChange={(next: string) => void} label={string} />` — a controlled radio group. `ALL` is the sentinel for no filter.

- [ ] **Step 1: Write FilterChips**

Create `src/components/FilterChips.jsx`:

```jsx
import React from 'react';
import '../styles/FilterChips.css';

export const ALL = 'All';

/**
 * A controlled single-select filter, rendered as a radio group so keyboard
 * users get arrow-key navigation for free and screen readers announce the
 * selection state. Deliberately not a row of buttons.
 */
export default function FilterChips({ options, value, onChange, label }) {
  return (
    <fieldset className="filter-chips">
      <legend className="visually-hidden">{label}</legend>
      {[ALL, ...options].map((option) => (
        <label
          key={option}
          className={`filter-chip${value === option ? ' filter-chip--on' : ''}`}
        >
          <input
            type="radio"
            name={label}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="visually-hidden"
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}
```

- [ ] **Step 2: Style the chips**

Create `src/styles/FilterChips.css`:

```css
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  border: 0;
  margin: 0 0 var(--space-5);
  padding: 0;
}

.filter-chip {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--rule);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color var(--dur-state), color var(--dur-state),
    background-color var(--dur-state);
}

.filter-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
}

.filter-chip--on {
  border-color: var(--color-accent);
  background-color: var(--color-accent);
  color: var(--color-accent-contrast);
}

/* The native input is visually hidden, so the focus ring has to be drawn
   on the label instead or keyboard users lose the selection outline. */
.filter-chip:has(:focus-visible) {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```

- [ ] **Step 3: Rebuild the certifications section**

In `src/components/ProjectsAndExperience.jsx`, add `useMemo` and `useState` to the React import, plus `import FilterChips, { ALL } from './FilterChips';`. Inside the component, above the return:

```jsx
  const [issuer, setIssuer] = useState(ALL);

  // Issuers are derived from the data, so adding a certification with a new
  // issuer adds a chip with no component change.
  const issuers = useMemo(
    () => [...new Set(certifications.map((c) => c.issuer).filter(Boolean))].sort(),
    [],
  );

  const visibleCertifications = useMemo(
    () =>
      issuer === ALL
        ? certifications
        : certifications.filter((c) => c.issuer === issuer),
    [issuer],
  );
```

Replace the certifications section body: render `<FilterChips options={issuers} value={issuer} onChange={setIssuer} label="Filter certifications by issuer" />` above the list, map over `visibleCertifications` instead of `certifications`, and swap the `card` classes for `<Panel>`:

```jsx
            return (
              <li key={cert.title}>
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certification-card__link"
                  >
                    <Panel interactive className="certification-card">{inner}</Panel>
                  </a>
                ) : (
                  <Panel className="certification-card">{inner}</Panel>
                )}
              </li>
            );
```

Note that certifications with an empty `issuer` (the Python certification) are reachable only via the `All` chip — they have no issuer to group under, and inventing one would violate the no-invention constraint.

- [ ] **Step 4: Style the matrix**

In `src/styles/ProjectsAndExperience.css`, set `.certifications-grid` to `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-3); list-style: none; margin: 0; padding: 0;`. `.certification-card` stacks a framed image, a display-face title and the mono issuer with `gap: var(--space-3)`. `.certification-card__frame` gets `aspect-ratio: 16 / 10; overflow: hidden; background-color: var(--color-surface-2);` and `.certification-card__image` gets `width: 100%; height: 100%; object-fit: contain;`.

- [ ] **Step 5: Verify**

Run: `npm run dev` and open `/projects`.
Expected checklist:
1. Chips read `All`, `Amazon Web Services`, `Bloomberg`, `Google`, `Oracle` — derived and alphabetised.
2. Selecting `Oracle` leaves five certifications; `All` restores twelve.
3. Arrow keys move between chips and change the selection; the focus ring is visible on the chip, not lost on the hidden input.
4. Cards keep a consistent height regardless of image aspect ratio.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 13: Education

**Files:**
- Modify: `src/components/Education.jsx`
- Modify: `src/styles/Education.css`

**Interfaces:**
- Consumes: `Reveal` (Task 4), the timeline styles (Task 11).
- Produces: nothing consumed later.

- [ ] **Step 1: Rebuild the markup**

Replace the body of `src/components/Education.jsx`:

```jsx
import React from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { education } from '../data/education';
import '../styles/timeline.css';
import '../styles/Education.css';

export default function Education() {
  return (
    <div className="page">
      <Reveal as="section" className="section">
        <SectionHeading>Education</SectionHeading>
        <div className="timeline">
          {education.map((item, i) => (
            <Reveal className="timeline__item" key={item.school} index={i}>
              <div className="timeline__rail">
                <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                <span className="instrument">{item.period}</span>
              </div>
              <div className="timeline__body">
                <div className="education-card__head">
                  <span className="education-card__frame">
                    <img
                      src={item.logo}
                      alt=""
                      className="education-card__logo"
                      width="44"
                      height="44"
                      loading="lazy"
                    />
                  </span>
                  <h3 className="timeline__title">{item.school}</h3>
                </div>
                <p className="prose">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 2: Style the logo frame**

Replace `src/styles/Education.css`:

```css
.education-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

/* Bracket-framed logo cell: two corner marks rather than a full border, so it
   matches the hero frame without competing with the logo inside it. */
.education-card__frame {
  position: relative;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background-color: var(--color-surface-2);
}

.education-card__frame::before,
.education-card__frame::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--rule-strong);
  border-style: solid;
}

.education-card__frame::before {
  top: 0;
  left: 0;
  border-width: 1px 0 0 1px;
}

.education-card__frame::after {
  bottom: 0;
  right: 0;
  border-width: 0 1px 1px 0;
}

.education-card__logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev` and open `/education`.
Expected: three entries on a measured rail with indices and periods in tabular mono; logos sit in bracketed cells; entries stagger in on scroll.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 14: Holistic Development, gallery and lightbox

**Files:**
- Modify: `src/components/HolisticDevelopment.jsx`
- Modify: `src/styles/HolisticDevelopment.css`
- Modify: `src/components/ImageGallery.jsx`
- Modify: `src/styles/ImageGallery.css`
- Modify: `src/styles/Lightbox.css`

**Interfaces:**
- Consumes: `Panel` (Task 5), `Reveal` (Task 4).
- Produces: nothing consumed later.

**`src/components/Lightbox.jsx` is not modified.** Its keyboard handling and focus management are correct; only its stylesheet changes.

- [ ] **Step 1: Rebuild the activity list**

In `src/components/HolisticDevelopment.jsx`, wrap each stage in a `Reveal`, add a stage index, and migrate the activity card onto `Panel`:

```jsx
      {stages.map((stage, stageIndex) => (
        <Reveal as="section" key={stage.label} className="section" index={stageIndex}>
          <SectionHeading>
            <span className="index-label holistic__stage-index">
              {String(stageIndex + 1).padStart(2, '0')}
            </span>
            {stage.label}
          </SectionHeading>
          <div className="activity-list">
            {stage.activities.map((activity, i) => (
              <Reveal key={activity.org} index={i}>
                <Panel as="article" className="activity-card">
                  <span className="activity-card__frame">
                    <img
                      src={activity.logo}
                      alt=""
                      className="activity-card__logo"
                      width="72"
                      height="72"
                      loading="lazy"
                    />
                  </span>
                  <div className="activity-card__body">
                    <h3>{activity.org}</h3>
                    {activity.role && (
                      <p className="instrument activity-card__role">{activity.role}</p>
                    )}
                    {activity.award && (
                      <p className="award-badge">
                        <FiAward aria-hidden="true" />
                        {activity.award}
                      </p>
                    )}
                    <p className="activity-card__description prose">{activity.description}</p>
                    <ImageGallery images={activity.images} />
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </Reveal>
      ))}
```

Add imports for `Reveal` and `Panel`.

**Check `SectionHeading.jsx`** — if it renders `{children}` directly into a heading it needs no change. If it wraps children in a way that would break the added index span, adjust it to render children as-is.

- [ ] **Step 2: Turn the gallery into a filmstrip**

In `src/components/ImageGallery.jsx`, keep the existing lightbox wiring untouched and change only the container class and the thumbnail markup so each image sits in a fixed-height strip cell. In `src/styles/ImageGallery.css`:

```css
.image-gallery {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: var(--space-2) 0;
  margin: 0;
  list-style: none;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.image-gallery__item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.image-gallery__button {
  display: block;
  padding: 0;
  border: 1px solid var(--rule);
  background: none;
  cursor: pointer;
  transition: border-color var(--dur-state), transform var(--dur-state) var(--ease-out);
}

.image-gallery__button:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.image-gallery__image {
  display: block;
  width: 160px;
  height: 108px;
  object-fit: cover;
}
```

- [ ] **Step 3: Restyle the activity card and lightbox**

In `src/styles/HolisticDevelopment.css`, set `.activity-card` to a two-column grid (`72px minmax(0, 1fr)`, `gap: var(--space-5)`), collapsing to one column below 640px. `.activity-card__frame` reuses the bracket treatment from Task 13 at 72px. `.activity-card__role` uses `--color-accent`.

In `src/styles/Lightbox.css`, replace rounded corners with square ones, set the backdrop to `rgba(0, 0, 0, 0.85)` with `backdrop-filter: blur(6px)`, and give the close and navigation controls the `1px` `--rule-strong` bordered square treatment used elsewhere.

- [ ] **Step 4: Verify**

Run: `npm run dev` and open `/holistic-development`.
Expected: four indexed stages; activity panels with bracketed logos; galleries scroll horizontally with snap. **Open a lightbox, press Escape, and Tab through its controls** — behaviour must be unchanged from before this task.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 15: Blog disclosure and reading time

**Files:**
- Create: `src/components/Disclosure.jsx`
- Modify: `src/components/Blog.jsx`
- Modify: `src/styles/Blog.css`

**Interfaces:**
- Consumes: `readingTime` (Task 2), `Panel` (Task 5), `Reveal` (Task 4).
- Produces: `<Disclosure id={string} summary={node} children />` — an accessible animated expand/collapse.

**Disclosure is the documented exception to the transform/opacity rule:** it animates height, because a disclosure that does not animate its height either jumps or requires a fixed height it cannot know.

- [ ] **Step 1: Write the Disclosure**

Create `src/components/Disclosure.jsx`. The native `<details>` element cannot animate its own height, so ARIA is wired manually to preserve what `<details>` provided for free.

```jsx
import React, { useId, useState } from 'react';
import * as motionLib from 'motion/react';
import { FiChevronDown } from 'react-icons/fi';

const { AnimatePresence, motion, useReducedMotion } = motionLib;

export default function Disclosure({ summary, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={`disclosure ${className}`.trim()}>
      <button
        type="button"
        id={buttonId}
        className="disclosure__summary instrument"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {summary}
        <FiChevronDown
          className={`disclosure__chevron${open ? ' disclosure__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="disclosure__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="disclosure__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Use it in the blog**

In `src/components/Blog.jsx`, add `import Disclosure from './Disclosure';`, `import Panel from './Panel';`, `import Reveal from './Reveal';` and `import { readingTime } from '../lib/readingTime';`. Replace the `<details>` block and the card wrapper:

```jsx
        <div className="post-list">
          {posts.map((post, i) => (
            <Reveal key={post.id} index={i}>
              <Panel as="article" id={post.id} className="post">
                <header className="post__head">
                  <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="post__title">{post.title}</h3>
                  <span className="instrument post__meta">
                    {post.date} · {readingTime(post.sections)} min read
                  </span>
                </header>
                <p className="post__summary prose">{post.summary}</p>
                <TagList items={post.tags} label="Topics" />

                <Disclosure summary="Read the full post">
                  <div className="post__body prose">
                    {post.sections.map((section) => (
                      <Section key={section.heading} heading={section.heading} body={section.body} />
                    ))}
                    {post.link && (
                      <a
                        className="btn"
                        href={post.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.link.label} <FiExternalLink aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </Disclosure>
              </Panel>
            </Reveal>
          ))}
        </div>
```

- [ ] **Step 3: Style the disclosure and posts**

Append to `src/styles/Blog.css`:

```css
.disclosure__summary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: var(--space-4);
  padding: 0.5rem 0;
  border: 0;
  background: none;
  color: var(--color-accent);
  cursor: pointer;
  transition: color var(--dur-state);
}

.disclosure__summary:hover {
  color: var(--color-accent-strong);
}

.disclosure__chevron {
  transition: transform var(--dur-transition) var(--ease-out);
}

.disclosure__chevron--open {
  transform: rotate(180deg);
}

.disclosure__inner {
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule);
  margin-top: var(--space-2);
}

.post__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.post__meta {
  margin-left: auto;
  color: var(--color-text-muted);
}

.post__title {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.4vw, 1.5rem);
  margin: 0;
}

.post-section__heading {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: var(--space-5) 0 var(--space-2);
}
```

Remove any `details`/`summary` selectors left in the file — they no longer match anything.

- [ ] **Step 4: Verify**

Run: `npm run dev` and open `/blog`.
Expected checklist:
1. Both posts show a reading time. Check it: the trading-engine post is roughly 450 words, so it should read `2 min read`. If it reads `1 min` or `10 min`, `readingTime` is receiving the wrong shape.
2. Expanding animates height smoothly; collapsing reverses it; the chevron rotates.
3. **Tab to the toggle and press Enter and Space** — both must work, and `aria-expanded` must flip. Inspect the element to confirm.
4. With reduced motion enabled the panel appears instantly with no height animation.
5. Deep-linking to `/blog#building-a-trading-engine` still scrolls to the post.

Run: `npm run lint` and `npm test`
Expected: both exit 0. **Do not commit.**

---

## Task 16: 404 page and theme transition

**Files:**
- Modify: `src/components/NotFound.jsx`
- Modify: `src/components/ThemeToggle.jsx`
- Modify: `src/styles/ThemeToggle.css`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: tokens (Task 3).
- Produces: nothing consumed later.

- [ ] **Step 1: Restyle the 404**

Rewrite `src/components/NotFound.jsx`, moving the inline styles into classes. The three existing strings are unchanged.

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found">
      <p className="index-label">Error 404</p>
      <h1 className="not-found__title">Page not found</h1>
      <p className="muted prose">
        The page you were looking for doesn&apos;t exist or has moved.
      </p>
      <p>
        <Link className="btn btn--primary" to="/">
          Back to home
        </Link>
      </p>
    </div>
  );
}
```

Add to `src/index.css`:

```css
.not-found {
  min-height: 50vh;
}

.not-found__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  letter-spacing: -0.03em;
  margin: var(--space-3) 0 var(--space-4);
}
```

- [ ] **Step 2: Add the circular theme reveal**

Wrap the toggle in a view transition. Feature-detect — Firefox does not support the API and must fall back to a plain toggle, not a broken one.

Replace `src/components/ThemeToggle.jsx`:

```jsx
import React, { useRef } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import '../styles/ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const ref = useRef(null);

  const handleClick = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduced) {
      onToggle();
      return;
    }

    // Anchor the reveal on the button so the new theme appears to spread from
    // the control the reader just pressed.
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      document.documentElement.style.setProperty('--vt-x', `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty('--vt-y', `${rect.top + rect.height / 2}px`);
    }

    document.startViewTransition(() => onToggle());
  };

  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  );
}
```

- [ ] **Step 3: Style the transition**

Append to `src/styles/ThemeToggle.css`:

```css
.theme-toggle {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--rule);
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color var(--dur-state), color var(--dur-state);
}

.theme-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* The outgoing snapshot stays put while the incoming one is clipped open from
   the toggle, so the new theme reads as spreading rather than cross-fading. */
::view-transition-old(root) {
  animation: none;
  z-index: 0;
}

::view-transition-new(root) {
  animation: theme-reveal 420ms var(--ease-out);
  z-index: 1;
}

@keyframes theme-reveal {
  from {
    clip-path: circle(0 at var(--vt-x, 50%) var(--vt-y, 50%));
  }
  to {
    clip-path: circle(150vmax at var(--vt-x, 50%) var(--vt-y, 50%));
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-new(root) {
    animation: none;
  }
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`.
Expected:
1. In Chrome or Edge, the theme spreads outward in a circle from the toggle.
2. In Firefox, the theme switches instantly with no error in the console.
3. With reduced motion enabled, the switch is instant in every browser.
4. Navigating to `/does-not-exist` shows the styled 404 with a working link home.

Run: `npm run lint`
Expected: exit 0. **Do not commit.**

---

## Task 17: Verification pass

No new code. This task exists because the preceding sixteen changed every surface on the site, and the failure modes that matter — a broken focus trap, a contrast regression, a horizontal scrollbar at 360px — are invisible in a diff.

**Files:** none created or modified, unless a defect is found.

- [ ] **Step 1: Automated checks**

```bash
npm test
npm run lint
npm run build
```

Expected: all three exit 0. The build must emit no warnings about unresolved imports. Note the bundle size — `motion` should add roughly 35KB gzipped over the pre-change baseline. If it added substantially more, check for a namespace import pulling in more than intended.

- [ ] **Step 2: Route and theme sweep**

Visit `/`, `/projects`, `/education`, `/holistic-development`, `/blog`, and `/nonsense`, in both themes. Confirm on each: no raw `.card` styling survives, the graticule is visible but never competes with text, and every heading uses the display face.

- [ ] **Step 3: Keyboard traversal**

Tab through the entire site without touching the mouse.

1. Focus is visible at every stop — no invisible focus anywhere.
2. The mobile menu traps focus while open and returns focus to the menu button on close.
3. The lightbox opens, closes on Escape, and returns focus.
4. Blog disclosures respond to Enter and Space.
5. Certification chips respond to arrow keys.
6. Career spine bars are focusable and reveal their labels on focus.

- [ ] **Step 4: Reduced motion**

Enable "Reduce motion" at OS level and reload. Confirm: no element translates, the live dot does not pulse, route changes cross-fade only, the theme switch is instant, and the blog disclosure opens without a height animation.

- [ ] **Step 5: Responsive**

At 360px, 768px and 1440px widths, confirm on every route: no horizontal scrollbar, the career spine is a stacked list below 768px, the hero portrait moves above the text below 860px, and the footer collapses to one column below 720px.

- [ ] **Step 6: Contrast**

Using browser devtools, sample body text, muted metadata, and tag text against their backgrounds in both themes. Body text must meet 4.5:1. Muted text at `0.72rem` is small text and must also meet 4.5:1 — if `--color-text-muted` falls short in either theme, darken or lighten it and re-verify. The graticule must not drop any text below threshold.

- [ ] **Step 7: Report**

Report to the repository owner: which checks passed, which failed, and the measured bundle delta. **Do not commit.** All work stays in the working tree.

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task: §2 dependency → Task 4; §3.1 tokens → Task 3; §3.2 typography → Tasks 3, 5; §3.3 grid and brackets → Tasks 3, 5; §4.1 chrome → Tasks 6, 7; §4.2 home → Tasks 8, 9, 10; §4.3 projects → Tasks 11, 12; §4.4 education → Task 13; §4.5 holistic → Task 14; §4.6 blog → Task 15; §4.7 404 → Task 16; §5 components → Tasks 4, 5, 6, 8, 9, 12, 15; §6 motion → Tasks 3, 4, and each page task; §7 testing → Tasks 1, 2, 17.

**Known deviations from the spec, recorded deliberately:**

1. **The mobile career spine is a stacked list, not a rotated axis.** Spec §4.2 says "rotates to a vertical layout"; a true rotated time axis at 360px compresses a decade into a column too narrow to label. The stacked list preserves the information and drops the scale. This is a downgrade in fidelity and an upgrade in legibility.
2. **`--color-highlight` and `--color-live` share a value** in both themes. They are separate tokens because they mean different things and may diverge; today they do not.
3. **The Activities spine track ships absent**, per the corrected spec §4.2 — the data has no dates.
