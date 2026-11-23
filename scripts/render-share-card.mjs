import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { mascotOverlay } from './share-card-art.mjs';

const require = createRequire(import.meta.url);
const FONT_CSS = pathToFileURL(require.resolve('@fontsource/noto-sans-tc/800.css'));
const CARD = { width: 1200, height: 630 };
const fontFiles = new Map();
let subsetsPromise;
let mascotPromise;

function parseRange(ranges) {
  return ranges.split(',').map((range) => {
    const [from, to = from] = range.trim().replace(/^U\+/, '').split('-').map((value) => Number.parseInt(value, 16));
    return [from, to];
  });
}

function rangesMatch(ranges, codePoint) {
  return ranges.some(([from, to]) => codePoint >= from && codePoint <= to);
}

async function fontSubsets() {
  subsetsPromise ??= readFile(FONT_CSS, 'utf8').then((css) => [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)]
    .map(([, block]) => ({
      range: parseRange(block.match(/unicode-range:\s*([^;]+);/)?.[1] ?? ''),
      file: block.match(/url\(\.\/files\/([^\)]+\.woff)\)/)?.[1],
    })).filter(({ file }) => file));
  return subsetsPromise;
}

async function fontsFor(title) {
  const subsets = await fontSubsets();
  const needed = new Set([...title, ...'joshwang.dev'].map((char) => char.codePointAt(0)));
  const chosen = new Map();
  for (const cp of needed) {
    const subset = subsets.find(({ range }) => rangesMatch(range, cp));
    if (subset) chosen.set(subset.file, subset);
  }
  return Promise.all([...chosen.values()].map(async ({ file }) => {
    let data = fontFiles.get(file);
    if (!data) {
      data = readFile(new URL(`files/${file}`, FONT_CSS));
      fontFiles.set(file, data);
    }
    // Satori keys faces by family and weight; a shared family hides the other subsets.
    return { name: file.slice(0, -'.woff'.length), data: await data, weight: 800, style: 'normal' };
  }));
}

function cardMarkup(title, fontSize, fontFamily) {
  return {
    type: 'div',
    props: {
      style: { width: CARD.width, height: CARD.height, display: 'flex', position: 'relative', backgroundColor: '#f7f5ef', color: '#171b21', fontFamily, fontWeight: 800 },
      children: [
        { type: 'div', props: { style: { position: 'absolute', left: 88, top: 80, width: 1024, height: 355, display: 'flex', alignItems: 'center' }, children: {
          type: 'div', props: { id: 'share-title', style: { width: '100%', fontSize, lineHeight: 1.18, wordBreak: 'break-word' }, children: title },
        } } },
        { type: 'div', props: { style: { position: 'absolute', left: 88, top: 500, width: 72, height: 6, backgroundColor: '#007e73', borderRadius: 3 } } },
        { type: 'div', props: { style: { position: 'absolute', left: 88, top: 545, fontSize: 23, fontWeight: 800 }, children: 'joshwang.dev' } },
      ],
    },
  };
}

export async function renderShareCard({ title, lang }) {
  if (typeof title !== 'string' || !title.trim()) throw new TypeError('title must be a non-empty string');
  if (lang !== 'zh-tw' && lang !== 'en') throw new TypeError('lang must be "zh-tw" or "en"');

  const fonts = await fontsFor(title);
  const fontFamily = fonts.map(({ name }) => name).join(', ');
  let svg;
  let titleLayout;
  for (let size = 76; size >= 38; size -= 2) {
    titleLayout = undefined;
    svg = await satori(cardMarkup(title, size, fontFamily), {
      ...CARD,
      fonts,
      onNodeDetected(node) {
        if (node.props.id === 'share-title') titleLayout = node;
      },
    });
    if (titleLayout && titleLayout.width <= 1024 && titleLayout.height <= 355) break;
    svg = undefined;
  }
  if (!svg) throw new RangeError('Share-card title does not fit in the available title area');

  mascotPromise ??= mascotOverlay();
  return sharp(Buffer.from(svg)).composite([await mascotPromise]).removeAlpha().png().toBuffer();
}

