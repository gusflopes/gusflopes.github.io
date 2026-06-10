import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Data ISO no frontmatter; a formatação pt-BR acontece no código de renderização. */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date deve estar no formato ISO YYYY-MM-DD');

const category = z.enum(['Arquitetura', '.NET', 'DevOps', 'Carreira', 'IA']);

const radar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/radar' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: isoDate,
    duration: z.string(),
    category,
    type: z.enum(['article', 'video']),
    isExternal: z.boolean(),
    link: z.string(),
    source: z.string(),
    image: z.string().url(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: isoDate,
    duration: z.string(),
    category,
    image: z.string().url(),
  }),
});

export const collections = { radar, insights };
