import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const radar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/radar' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    duration: z.string(),
    category: z.enum(['Arquitetura', '.NET', 'DevOps', 'Carreira', 'IA']),
    type: z.enum(['article', 'video']),
    isExternal: z.boolean(),
    link: z.string(),
    source: z.string(),
    image: z.string().url(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    category: z.enum(['Arquitetura', '.NET', 'DevOps', 'Carreira', 'IA']),
    image: z.string().url(),
  }),
});

export const collections = { radar, insights };
