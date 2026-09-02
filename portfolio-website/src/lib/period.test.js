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
