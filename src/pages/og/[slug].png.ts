import type { APIRoute } from 'astro';
import { getPosts, postSlug, normalizeCategory } from '../../lib/posts';
import { renderOg } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    { params: { slug: 'default' }, props: { title: 'Sahil Singh Rawat', eyebrow: 'Software Architect & Security Researcher' } },
    ...posts.map((p) => ({
      params: { slug: postSlug(p.id) },
      props: { title: p.data.title, eyebrow: normalizeCategory(p.data.categories?.[0]) },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as { title: string; eyebrow: string });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
