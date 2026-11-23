import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { renderShareCard } from './render-share-card.mjs';

async function inkBounds(buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1, count = 0, outside = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    if (data[i] >= 100 || data[i + 1] >= 110 || data[i + 2] >= 120) continue;
    const title = x >= 88 && x < 1112 && y >= 80 && y < 435;
    if (title) {
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); count++;
      continue;
    }
    const domain = x >= 88 && x < 350 && y >= 520 && y < 590;
    const mascot = x >= 821 && y >= 390;
    if (!domain && !mascot && !(y >= 490)) outside++;
  }
  return { left, top, right, bottom, count, outside };
}

test('share card fits mixed, English, Chinese, and unbroken titles', async () => {
  const titles = [
    ['部落格 — Josh Wang & 好貴', 'zh-tw'],
    ['Ten Days in Chiang Mai: Trying Not to Be a Tourist, Only to Spend Everything I Saved on Grab and Walking', 'en'],
    ['這是一段純中文標題，用來確認中文字型和換行。', 'zh-tw'],
    ['ThisIsAVeryLongUnbrokenTokenThatMustWrapWithoutBeingCut'.repeat(2), 'en'],
  ];
  const bounds = await Promise.all(titles.map(async ([title, lang]) =>
    inkBounds(await renderShareCard({ title, lang }))));
  for (const box of bounds) {
    assert.ok(box.count > 100, 'title paints visible glyphs');
    assert.equal(box.outside, 0, 'title ink stays inside its area');
  }
  assert.notDeepEqual(bounds[0], bounds[1]);
});

test('Latin letters in a mixed CJK title do not collapse to identical missing-glyph boxes', async () => {
  const render = (title) => renderShareCard({ title, lang: 'zh-tw' });
  assert.notDeepEqual(await render('要 SSR A'), await render('要 SSR B'));
});

test('share card refuses titles that cannot fit even at minimum size', async () => {
  await assert.rejects(
    renderShareCard({ title: '界'.repeat(500), lang: 'zh-tw' }),
    { name: 'RangeError', message: 'Share-card title does not fit in the available title area' },
  );
});
