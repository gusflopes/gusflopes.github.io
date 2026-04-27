export const SITE = {
  name: 'gusflopes.dev',
  url: 'https://gusflopes.dev',
  defaultTitle: 'gusflopes.dev — Engenharia, Arquitetura, IA',
  defaultDescription:
    'Engenharia de software, arquitetura, IA e DevOps por Gustavo Lopes.',
  defaultOgImage: '/og-default.png',
  twitter: '@gusflopes',
  locale: 'pt_BR',
  author: {
    name: 'Gustavo Lopes',
    url: 'https://gusflopes.dev',
    email: 'gustavo@gusflopes.dev',
    sameAs: [
      'https://www.linkedin.com/in/gusflopes/',
      'https://github.com/gusflopes',
      'https://www.youtube.com/@hubdev-tech',
      'https://x.com/gusflopes',
      'https://substack.com/@gusflopes',
    ],
  },
} as const;

export type SeoType = 'website' | 'article';

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: SeoType;
  canonical?: string;
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, unknown>;
}

export function resolveSeo(props: SeoProps, pathname: string) {
  const title = props.title
    ? `${props.title} — ${SITE.name}`
    : SITE.defaultTitle;
  const description = props.description ?? SITE.defaultDescription;
  const image = new URL(props.image ?? SITE.defaultOgImage, SITE.url).toString();
  const canonical = new URL(props.canonical ?? pathname, SITE.url).toString();
  const type = props.type ?? 'website';
  return { title, description, image, canonical, type };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.author.name,
    url: SITE.author.url,
    email: SITE.author.email,
    sameAs: SITE.author.sameAs,
  };
}

export function buildArticleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    url: args.url,
    image: args.image,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    articleSection: args.section,
    author: {
      '@type': 'Person',
      name: SITE.author.name,
      url: SITE.author.url,
    },
    publisher: {
      '@type': 'Person',
      name: SITE.author.name,
      url: SITE.author.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': args.url,
    },
  };
}
