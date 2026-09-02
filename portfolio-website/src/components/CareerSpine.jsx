import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'motion/react';
import { parsePeriod, periodBounds } from '../lib/period';
import { DUR_REVEAL, EASE_OUT } from '../lib/motion';
import { experience } from '../data/projects';
import { education } from '../data/education';
import { stages } from '../data/activities';
import '../styles/CareerSpine.css';

const YEAR = 365.25 * 24 * 60 * 60 * 1000;

// The axis will not begin before this year, however far back the data reaches.
// Secondary school starts in 2015, but stretching the axis back to meet it
// compresses every year that matters into the right-hand half of the chart.
// Entries that begin earlier are CLIPPED to this floor rather than dropped, so
// their recent portion still reads — and their tooltip still shows the true,
// unclipped period, because the label comes from the raw data string.
const DOMAIN_FLOOR_YEAR = 2018;

// `.spine__tip` is left-anchored to its bar (`left: 0`) so it grows
// rightward, which overflows the page for any bar positioned in the right
// portion of the lane — e.g. the NTU education bar at ~90.9% start, whose
// tooltip ("Nanyang Technological University") measured 115px of horizontal
// overflow past a 1249px viewport. Because `size` is always clamped to
// `100 - start` (see buildTrack's caller below), a bar's right edge can
// never exceed the lane's right edge — so right-anchoring the tip instead
// (`right: 0`, growing leftward) for bars past this threshold guarantees the
// tip's right edge stays within the lane, and therefore within the page, in
// both the hidden (opacity: 0) and revealed (hover/focus) states, since an
// absolutely positioned element's box contributes to scrollable overflow
// regardless of its opacity.
//
// 60% is a safety margin, not a tight fit: the narrowest desktop lane (a
// viewport just above the 768px mobile breakpoint) is ~577px, so even at
// the threshold a flipped tip has ~346px of run-leftward before it would
// reach the lane's left edge — comfortably more than the ~265px the longest
// tooltip line ("Nanyang Technological University") measures at the tip's
// font size. See CareerSpine.css `.spine__bar--tip-end`.
const TIP_FLIP_START_PCT = 60;

// Must match the `@media (max-width: 768px)` breakpoint in CareerSpine.css,
// where the bar's tooltip becomes visible, static, full-width card content.
const NARROW_QUERY = '(max-width: 768px)';

/**
 * Tracks whether the viewport matches NARROW_QUERY, following the same
 * matchMedia + subscribe/cleanup pattern as src/hooks/useTheme.js.
 *
 * Below this breakpoint the bar's tooltip is always-visible card content
 * (not a hover affordance), so it must never be a child of a scaleX(0)
 * transform — that would visibly squash and restretch its text on every
 * scroll reveal. See Finding 1, fix round 1.
 */
function useNarrowViewport() {
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(NARROW_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(NARROW_QUERY);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return narrow;
}

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
  const narrow = useNarrowViewport();
  // Below 768px the tooltip is always-visible card content, not a hover
  // affordance riding a scaleX reveal — flatten it to an opacity-only
  // animation there too, exactly as the reduced-motion path already does.
  const flatten = reduced || narrow;

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

    // Pad to whole years so the axis lands on round numbers, but never start
    // earlier than the floor (see DOMAIN_FLOOR_YEAR).
    const firstYear = Math.max(new Date(min).getUTCFullYear(), DOMAIN_FLOOR_YEAR);
    const lastYear = new Date(max).getUTCFullYear();
    const domainStart = Date.UTC(firstYear, 0, 1);
    const domainEnd = Date.UTC(lastYear + 1, 0, 1);
    const span = domainEnd - domainStart;

    const pct = (t) => ((t - domainStart) / span) * 100;

    const years = [];
    for (let y = firstYear; y <= lastYear + 1; y += 1) years.push(y);

    const positioned = tracks
      .map((track) => ({
        ...track,
        entries: track.entries
          // An entry that ends before the floor has no visible portion at all.
          .filter((entry) => entry.bounds.end >= domainStart)
          .map((entry) => {
            // Clip to the floor: a bar that starts earlier begins at the axis.
            const start = Math.max(0, pct(entry.bounds.start));
            // A point still needs a visible footprint; give it two months.
            const rawSize = pct(entry.bounds.end) - start;
            const floor = (YEAR / 6 / span) * 100;
            // Never let the floor push the bar past the chart's right edge.
            const size = Math.min(Math.max(rawSize, floor), 100 - start);
            return { ...entry, start, size };
          }),
      }))
      .filter((track) => track.entries.length > 0);

    if (positioned.length === 0) return null;

    return {
      tracks: positioned,
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
              {track.entries.map((entry, i) => {
                // The tip already carries the entry label and its period;
                // only add the detail (e.g. employer) when it says something
                // the period string doesn't — Education's detail is the
                // period itself, and showing it twice would be noise.
                const hasExtraDetail = entry.detail && entry.detail !== entry.period.label;
                // aria-label REPLACES the accessible name, so it must carry
                // everything a sighted user gets from the tooltip, plus the
                // track context a plain-text sibling label can't reach by
                // tabbing alone.
                const accessibleName = [
                  track.label,
                  entry.label,
                  hasExtraDetail ? entry.detail : null,
                  entry.period.label,
                ]
                  .filter(Boolean)
                  .join(', ');

                // Bars in the right portion of the lane right-anchor their
                // tooltip instead of left-anchoring it, so the tip grows
                // leftward and can never push past the lane's right edge.
                // See TIP_FLIP_START_PCT above.
                const tipFlipped = entry.start >= TIP_FLIP_START_PCT;

                return (
                  <Motion.span
                    className={`spine__bar${entry.period.ongoing ? ' spine__bar--live' : ''}${tipFlipped ? ' spine__bar--tip-end' : ''}`}
                    key={entry.key}
                    style={{ '--start': `${entry.start}%`, '--size': `${entry.size}%` }}
                    tabIndex={0}
                    role="img"
                    aria-label={accessibleName}
                    initial={{ scaleX: flatten ? 1 : 0, opacity: flatten ? 0 : 1 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{
                      duration: reduced ? 0 : DUR_REVEAL,
                      ease: EASE_OUT,
                      delay: reduced ? 0 : i * 0.06,
                    }}
                  >
                    <span className="spine__tip">
                      {entry.label}
                      {hasExtraDetail && (
                        <span className="spine__tip-org">{entry.detail}</span>
                      )}
                      <span className="spine__tip-detail">{entry.period.label}</span>
                    </span>
                  </Motion.span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
