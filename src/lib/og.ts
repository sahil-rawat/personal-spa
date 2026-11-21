import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const fontDir = path.join(process.cwd(), 'node_modules/@fontsource/inter/files');
const fonts = [
  { name: 'Inter', data: fs.readFileSync(path.join(fontDir, 'inter-latin-400-normal.woff')), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: fs.readFileSync(path.join(fontDir, 'inter-latin-700-normal.woff')), weight: 700 as const, style: 'normal' as const },
];

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

export async function renderOg(opts: { title: string; eyebrow?: string; footer?: string }): Promise<Uint8Array> {
  const { title, eyebrow = 'ARTICLE', footer = 'sahilsinghrawat.com' } = opts;
  const size = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;

  const tree = el('div', {
    width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between',
    padding: '72px', background: '#fcfcfb', color: '#111110', fontFamily: 'Inter',
    borderTop: '10px solid #ffe45c',
  }, [
    el('div', { fontSize: 26, color: '#6b6b66', letterSpacing: 1, fontWeight: 400 }, eyebrow),
    el('div', { fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }, title),
    el('div', { justifyContent: 'space-between', fontSize: 28, color: '#6b6b66' }, [
      el('div', { color: '#111110', fontWeight: 700 }, 'sahil.'),
      el('div', {}, footer),
    ]),
  ]);

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg).render().asPng();
}
