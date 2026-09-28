import React from 'react';

// Hand-pressed cinnabar seals. Shape carries the state so it reads without colour:
// round = delivered, square = in progress, filled square = signature.

const SIZES = { xs: 30, sm: 48, md: 72, lg: 96 };

// Small deterministic hash so each seal gets its own tilt and ink gaps,
// stable between builds.
function hash(text) {
  let value = 2166136261;
  for (const char of text) value = Math.imul(value ^ char.codePointAt(0), 16777619);
  return value >>> 0;
}

function random(seed) {
  let state = seed || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822507) >>> 0;
    state = Math.imul(state ^ (state >>> 13), 3266489909) >>> 0;
    return ((state ^ (state >>> 16)) >>> 0) / 4294967296;
  };
}

// A circle whose radius drifts slightly, like a rubber stamp pressed unevenly.
function roughCircle(radius, rand) {
  const steps = 36;
  const phase = rand() * Math.PI * 2;
  const points = Array.from({ length: steps }, (_, index) => {
    const angle = (index / steps) * Math.PI * 2;
    const r = radius + Math.sin(angle * 3 + phase) * 0.55 + (rand() - 0.5) * 0.5;
    return [50 + r * Math.cos(angle), 50 + r * Math.sin(angle)];
  });
  return `M${points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}Z`;
}

function roughSquare(inset, rand) {
  const jitter = () => (rand() - 0.5) * 0.9;
  const a = inset;
  const b = 100 - inset;
  return `M${a + jitter()},${a + jitter()}L${b + jitter()},${a + jitter()}L${b + jitter()},${b + jitter()}L${a + jitter()},${b + jitter()}Z`;
}

// Specks where the ink did not take; rendered as holes through a mask.
function inkGaps(rand, count) {
  return Array.from({ length: count }, () => ({
    cx: 12 + rand() * 76,
    cy: 12 + rand() * 76,
    r: 0.4 + rand() * 0.9,
  }));
}

function SealArt({ kind, label, date, rand, maskId }) {
  const gaps = inkGaps(rand, kind === 'signature' ? 7 : 8);
  const mask = (
    <mask id={maskId}>
      <rect width="100" height="100" fill="#fff" />
      {gaps.map((gap, index) => <circle key={index} {...gap} fill="#000" />)}
    </mask>
  );

  if (kind === 'signature') {
    return (
      <>
        <defs>{mask}</defs>
        <g mask={`url(#${maskId})`}>
          <path d={roughSquare(6, rand)} fill="currentColor" />
          <text x="50" y="66" textAnchor="middle" className="seal__monogram" fill="var(--color-paper)">JW</text>
        </g>
      </>
    );
  }

  const round = kind === 'delivered';
  const bandInset = round ? 11.5 : 14;
  return (
    <>
      <defs>
        {mask}
        <path id={`${maskId}-arc`} d="M21,52 A29,29 0 0 1 79,52" />
      </defs>
      <g mask={`url(#${maskId})`} fill="none" stroke="currentColor">
        <path d={round ? roughCircle(46, rand) : roughSquare(5, rand)} strokeWidth="5" />
        <path d={round ? roughCircle(40, rand) : roughSquare(11.5, rand)} strokeWidth="2" />
        <path d={`M${bandInset},41H${100 - bandInset}M${bandInset},60H${100 - bandInset}`} strokeWidth="2" />
        {round ? (
          <text className="seal__label" fill="currentColor" stroke="none">
            <textPath href={`#${maskId}-arc`} startOffset="50%" textAnchor="middle">{label}</textPath>
          </text>
        ) : (
          <text x="50" y="33" textAnchor="middle" className="seal__label" fill="currentColor" stroke="none">{label}</text>
        )}
        <text x="50" y="54.6" textAnchor="middle" className="seal__date" fill="currentColor" stroke="none">{date ?? ''}</text>
        <text x="50" y={round ? 77 : 80} textAnchor="middle" className="seal__initials" fill="currentColor" stroke="none">JW</text>
      </g>
    </>
  );
}

/**
 * `instance` distinguishes repeated seals on one page (unique SVG ids, own tilt).
 * `printed` draws the shape in form ink for legends: never stamped, never animated.
 * @param {{ kind: 'delivered'|'progress'|'signature', label: string, date?: string, size?: 'xs'|'sm'|'md'|'lg', instance?: string, printed?: boolean }} props
 */
export function Seal({ kind, label, date, size = 'md', instance = '', printed = false }) {
  const seed = hash(`${kind}|${label}|${date ?? ''}|${instance}`);
  const rand = random(seed);
  const tilt = ((seed % 900) / 100 - 4.5).toFixed(2);
  const maskId = `seal-${seed.toString(36)}`;
  const px = SIZES[size];
  return (
    <span
      data-seal={printed ? undefined : ''}
      className={`seal seal--${kind}${printed ? ' seal--printed' : ''}`}
      style={{ '--seal-tilt': printed ? '0deg' : `${tilt}deg`, '--seal-size': `${px}px` }}
    >
      <svg aria-hidden="true" viewBox="0 0 100 100" width={px} height={px} lang={/[A-Za-z]/.test(label) ? 'en' : 'zh-TW'}>
        <SealArt kind={kind} label={label} date={date} rand={rand} maskId={maskId} />
      </svg>
      {!printed && <span className="sr-only">{date ? `${label} ${date}` : label}</span>}
    </span>
  );
}
