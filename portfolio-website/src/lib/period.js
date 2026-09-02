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
