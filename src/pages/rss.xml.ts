import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const insights = await getCollection('insights');
  const radar = await getCollection('radar', ({ data }) => !data.isExternal);

  const items: RSSFeedItem[] = [
    ...insights.map((entry) => ({
      title: entry.data.title,
      description: entry.data.excerpt,
      pubDate: new Date(`${entry.data.date}T12:00:00.000Z`),
      link: `/insights/article/${entry.id}`,
      categories: [entry.data.category],
    })),
    ...radar.map((entry) => ({
      title: entry.data.title,
      description: entry.data.excerpt,
      pubDate: new Date(`${entry.data.date}T12:00:00.000Z`),
      // Para itens locais (isExternal: false) o frontmatter aponta para a rota
      // local /radar/article/<id>; o fallback deriva a mesma rota do id.
      link: entry.data.link || `/radar/article/${entry.id}`,
      categories: [entry.data.category],
    })),
  ].sort((a, b) => (b.pubDate as Date).getTime() - (a.pubDate as Date).getTime());

  return rss({
    title: 'Em Produção — gusflopes.dev',
    description:
      'Análise quinzenal sobre IA aplicada, .NET e arquitetura — o que sobrevive ao contato com sistemas reais, dados proprietários e compliance. Sem hype, com código. Por Gustavo Lopes, Tech Lead e Arquiteto de Software.',
    site: context.site ?? 'https://gusflopes.dev',
    items,
    customData: '<language>pt-BR</language>',
  });
}
