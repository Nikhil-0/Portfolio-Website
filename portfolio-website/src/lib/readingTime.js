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
