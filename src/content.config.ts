import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Categorias: legados ('Arquitetura', '.NET', 'DevOps', 'Carreira', 'IA') mantidos
// pra retrocompat com .md existentes. Novos artigos devem preferir as
// categorias atualizadas ('Arquitetura de Software', 'AI Engineering', etc.).
// Consolidação final acontece quando todos os artigos forem migrados pra MDX
// com conteúdo real (Onda 4 real / produção de conteúdo).
const CATEGORIES = [
  'Arquitetura',
  'Arquitetura de Software',
  '.NET',
  'DevOps',
  'Carreira',
  'IA',
  'AI Engineering',
  'Product Engineering',
  'Domain Driven Design',
  'Engenharia de Dados',
] as const;

const radar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/radar' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    duration: z.string(),
    category: z.enum(CATEGORIES),
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
    duration: z.string().optional(),
    category: z.enum(CATEGORIES),
    image: z.string().url(),
  }),
});

export const collections = { radar, insights };
