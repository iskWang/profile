import { createHash } from 'node:crypto';

export const pageTitles = {
  '/zh-tw': 'Josh Wang | 軟體開發者',
  '/en': 'Josh Wang | Software Developer',
  '/zh-tw/blog': '部落格 — Josh Wang',
  '/en/blog': 'Blog — Josh Wang',
} as const;

// A changed headline gets a fresh URL even when a platform cached the old PNG.
export function shareImagePath(path: string, title: string) {
  const revision = createHash('sha256').update(title).digest('hex').slice(0, 12);
  return `/og/v1${path}-${revision}.png`;
}
