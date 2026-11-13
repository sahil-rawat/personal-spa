import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { postSlug, postDescription } from '../lib/posts';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  return rss({
    title: 'Sahil Singh Rawat',
    description: 'Articles on distributed systems, JVM internals, and application security.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: postDescription(post),
      link: `/posts/${postSlug(post.id)}/`,
    })),
  });
}
