import * as THREE from 'three';

/**
 * Draws printed-looking pages onto a canvas at runtime, so the open book has body text
 * without shipping any new image assets.
 *
 * The filler is Latin rather than English on purpose. At render size the text is a
 * grey texture and unreadable, but the book is a real title by a real author -- if
 * someone freezes a frame, invented English sentences could be mistaken for its actual
 * contents. Latin reads unambiguously as placeholder.
 */

const PAGE_W = 512;
const PAGE_H = 768;
const MARGIN_X = 54;
const MARGIN_TOP = 86;
const LINE_HEIGHT = 21;
const BODY_SIZE = 12.5;

const PAPER = '#F6EEDC';
const INK = 'rgba(58, 54, 44, 0.72)';
const INK_FAINT = 'rgba(58, 54, 44, 0.5)';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

/** Deterministic PRNG, so a page's text never reshuffles between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createPageTexture(seed: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;

  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(seed * 7919 + 13);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // A touch of warmth toward the gutter, so the paper is not a flat fill.
  const shade = ctx.createLinearGradient(0, 0, PAGE_W, 0);
  shade.addColorStop(0, 'rgba(120, 96, 54, 0.16)');
  shade.addColorStop(0.18, 'rgba(120, 96, 54, 0)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  const columnWidth = PAGE_W - MARGIN_X * 2;
  let y = MARGIN_TOP;

  // Every third page opens a chapter, which breaks up the wall of text.
  const isChapterOpener = seed % 3 === 0;
  if (isChapterOpener) {
    ctx.fillStyle = INK_FAINT;
    ctx.font = '600 11px Georgia, serif';
    ctx.fillText(`CHAPTER ${(seed % 9) + 1}`, MARGIN_X, y);

    ctx.fillStyle = INK;
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillText('Nulla Pariatur', MARGIN_X, y + 38);

    y += 78;
  }

  ctx.font = `${BODY_SIZE}px Georgia, serif`;

  let indent = isChapterOpener ? 0 : 18;
  while (y < PAGE_H - MARGIN_TOP) {
    // Build one justified-ish line a word at a time until the column is full.
    let line = '';
    let x = MARGIN_X + indent;
    const available = columnWidth - indent;

    while (true) {
      const word = WORDS[Math.floor(rand() * WORDS.length)];
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > available) break;
      line = candidate;
    }

    // End paragraphs on a short line, then indent the next one.
    const endsParagraph = rand() < 0.12;
    if (endsParagraph) {
      line = line.slice(0, Math.max(6, Math.floor(line.length * (0.3 + rand() * 0.4))));
    }

    ctx.fillStyle = INK;
    ctx.fillText(line, x, y);

    y += LINE_HEIGHT;
    indent = endsParagraph ? 18 : 0;
    if (endsParagraph) y += 4;
  }

  // Folio
  ctx.fillStyle = INK_FAINT;
  ctx.font = '11px Georgia, serif';
  const folio = String(24 + seed * 2);
  ctx.fillText(folio, PAGE_W / 2 - ctx.measureText(folio).width / 2, PAGE_H - 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
