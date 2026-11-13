import type { CollectionEntry } from 'astro:content';

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

export function postSlug(id: string): string {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
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
