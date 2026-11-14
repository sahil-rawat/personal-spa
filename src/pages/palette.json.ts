import { getPosts, postUrl, isoDay } from '../lib/posts';

export async function GET() {
  const posts = await getPosts();
  const data = posts.map((p) => ({
    t: p.data.title,
    u: postUrl(p),
    g: p.data.tags,
    d: isoDay(p.data.date),
  }));
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
