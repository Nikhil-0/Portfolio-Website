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
