import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Maps the many hand-typed frontmatter categories onto a small, consistent set.
const CATEGORY_MAP: Record<string, string> = {
  languages: 'Programming',
  devlopment: 'Development',
  development: 'Development',
  bugbounty: 'Bug Bounty',
  'penetration testing': 'Penetration Testing',
  'reverse engineering': 'Malware & Reverse Engineering',
  recon: 'Recon & OSINT',
  research: 'Research',
  intro: 'General',
};

export function normalizeCategory(raw?: string): string {
  if (!raw) return 'General';
  return CATEGORY_MAP[raw.trim().toLowerCase()] ?? raw.trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function postSlug(id: string): string {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

export function postUrl(post: Post): string {
  return `/posts/${postSlug(post.id)}/`;
}

export function isoDay(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Plain-text excerpt from Markdown: drops images, links, code fences and markup. */
export function excerpt(body = '', max = 160): string {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function postDescription(post: Post): string {
  return post.data.description || excerpt(post.body);
}

/** All published posts, newest first. Drafts are hidden in production builds. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id)
  );
}

/** Posts of a series in reading order (oldest first). */
export function seriesParts(posts: Post[], series: string): Post[] {
  return posts
    .filter((p) => p.data.series === series)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.id.localeCompare(b.id));
}

export function allSeries(posts: Post[]): string[] {
  return [...new Set(posts.map((p) => p.data.series).filter((s): s is string => !!s))];
}

export function allTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, { tag: string; count: number }>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      const key = slugify(t);
      if (!key) continue;
      const cur = map.get(key);
      if (cur) cur.count++;
      else map.set(key, { tag: t.toLowerCase(), count: 1 });
    }
  }
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Related posts ranked by shared tags/category/series; falls back to newest. */
export function relatedPosts(current: Post, posts: Post[], limit = 3): Post[] {
  const tags = new Set(current.data.tags.map((t) => t.toLowerCase()));
  const cat = normalizeCategory(current.data.categories?.[0]);
  return posts
    .filter((p) => p.id !== current.id && !(current.data.series && p.data.series === current.data.series))
    .map((p) => {
      let score = 0;
      for (const t of p.data.tags) if (tags.has(t.toLowerCase())) score += 2;
      if (normalizeCategory(p.data.categories?.[0]) === cat) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, limit)
    .map((x) => x.p);
}
