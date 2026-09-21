import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // Loads all markdown files from src/content/posts/
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };