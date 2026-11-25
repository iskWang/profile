/**
 * Split a title into clause segments at major punctuation boundaries
 * (CJK `，`, `：`, `；` or ASCII `, `, `: `, `; `) so renderers can
 * break cleanly between clauses instead of stranding characters right after a comma.
 *
 * @param {string} title
 * @returns {Array<{ text: string, hasTrailingSpace: boolean }>}
 */
export function splitTitleClauses(title) {
  if (typeof title !== 'string' || !title) return [];
  const clauses = [];
  const re = /(?:[^，：；,:;]|[,:;](?!\s))+(?:[，：；]|[,:;]\s+)?/g;
  for (const match of title.matchAll(re)) {
    const raw = match[0];
    const text = raw.trimEnd();
    const hasTrailingSpace = text.length < raw.length;
    if (text) clauses.push({ text, hasTrailingSpace });
  }
  return clauses.length > 0 ? clauses : [{ text: title, hasTrailingSpace: false }];
}
