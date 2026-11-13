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
    padding: '72px', background: '#090a0f', color: '#f1f5f9', fontFamily: 'Inter',
    borderTop: '8px solid #38bdf8',
  }, [
    el('div', { fontSize: 28, color: '#38bdf8', letterSpacing: 4, fontWeight: 700 }, eyebrow.toUpperCase()),
    el('div', { fontSize: size, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1 }, title),
    el('div', { justifyContent: 'space-between', fontSize: 28, color: '#94a3b8' }, [
      el('div', {}, 'Sahil Singh Rawat'),
      el('div', {}, footer),
    ]),
  ]);

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg).render().asPng();
}
