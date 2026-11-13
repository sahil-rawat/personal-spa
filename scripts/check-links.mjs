// Verifies every internal href/src in dist/ points at a file that exists.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) { console.error('Run `npm run build` first.'); process.exit(1); }

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

const exists = (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!clean || clean === '/') return true;
  const base = path.join(dist, clean);
  return [base, path.join(base, 'index.html'), base + '.html'].some(
    (f) => fs.existsSync(f) && fs.statSync(f).isFile()
  );
};

const broken = new Map();
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8').replace(/<pre[\s\S]*?<\/pre>/g, ''); // ignore code samples
  for (const m of html.matchAll(/\b(?:href|src)="(\/[^"/][^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith('/pagefind/') || url.startsWith('/cdn-cgi/')) continue;
    if (!exists(url)) {
      const list = broken.get(url) ?? [];
      list.push(path.relative(dist, file));
      broken.set(url, list);
    }
  }
}

if (broken.size) {
  for (const [url, pages] of broken) console.error(`BROKEN ${url}\n   in ${pages.slice(0, 3).join(', ')}${pages.length > 3 ? ` (+${pages.length - 3})` : ''}`);
  console.error(`\n${broken.size} broken internal link(s).`);
  process.exit(1);
}
console.log('All internal links OK.');
