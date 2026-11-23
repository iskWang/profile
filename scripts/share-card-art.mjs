import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Share-card mascot: the line-art cat (public/cat-mascot.webp, 700x691, ink in
// the alpha channel) as teal lines, peeking up from the bottom-right edge.
// Crop (source px, measured on alpha): x 8..412 drops the tail; y 12..247 spans
// ear tips (y16) to just under the nose (y246), so no mouth, chin or body.
// Eyes (y185..226) end >=15px above the cut, so a 2:1 crop still shows them.
const CROP = { left: 8, top: 12, width: 404, height: 235 };
const OUT_WIDTH = 307;
const TEAL = [0x00, 0x9b, 0x8f]; // --color-teal in src/index.css, as sRGB
const CARD = { height: 630, rightEdge: 1128 };

export async function mascotOverlay() {
  // Repo-root relative: Astro bundles this file into dist/.prerender/chunks/.
  const src = await readFile('public/cat-mascot.webp');
  const { data, info } = await sharp(src)
    .extract(CROP)
    .resize({ width: OUT_WIDTH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    data[i] = TEAL[0];
    data[i + 1] = TEAL[1];
    data[i + 2] = TEAL[2];
  }

  const input = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();

  return {
    input,
    left: CARD.rightEdge - info.width,
    top: CARD.height - info.height,
  };
}
