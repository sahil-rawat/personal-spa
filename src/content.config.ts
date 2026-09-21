import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // Use the glob loader pointing to your markdown files
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    categories: z.union([
      z.array(z.string()),
      z.string().transform((val) => [val]),
    ]).default(['Software & Systems']),
    tags: z.union([
      z.array(z.string()),
      z.string().transform((val) => [val]),
    ]).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };