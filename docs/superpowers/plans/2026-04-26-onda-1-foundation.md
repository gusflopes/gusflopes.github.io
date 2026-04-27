# Onda 1 — Foundation Técnico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a base técnica e de SEO que permite que o site `gusflopes.dev` seja indexado, compartilhado em redes sociais com preview rico, e renderize artigos via MDX — sem ainda introduzir SSR ou captura de leads.

**Architecture:** Mudanças adicionam integrações Astro (`@astrojs/sitemap`, `@astrojs/mdx`), introduzem layout SEO parametrizável via props no `Default.astro`, e substituem o componente React `RadarArticlePage` por um shell Astro que recebe o conteúdo do artigo via slot. Limpeza paralela: remoção de aliases versionados (legado Figma) que poluem `astro.config.mjs` e os imports de `src/components/ui/*`.

**Tech Stack:** Astro 6 + `@astrojs/react` 5 + Tailwind 4 + `@tailwindcss/typography` (novo) + `@astrojs/mdx` (novo) + `@astrojs/sitemap` (novo). Cloudflare Web Analytics via `<script>` no `<head>`.

**Spec de origem:** `docs/superpowers/specs/2026-04-26-launch-readiness-design.md` §4 Onda 1.

**Out of scope desta onda:** captura de leads (Onda 2), `/mentoria` e `/cursos` (Onda 3), conteúdo real dos artigos em escala (Onda 4 — aqui só validação de pipeline com 1 arquivo), code copy real, share/bookmark, social URLs reais (Onda 5), GA4 + cookie banner (Onda 6).

**Convenção de execução:** trabalhar em branch `feat/onda-1-foundation`. Não fazer push em `main` (auto-deploy Cloudflare). PR final consolida a onda.

---

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `astro.config.mjs` | Modify | Adicionar integrações sitemap+mdx; remover bloco de ~35 aliases versionados |
| `package.json` / `pnpm-lock.yaml` | Modify (via `astro add`) | Dependências `@astrojs/sitemap`, `@astrojs/mdx`, `@tailwindcss/typography` |
| `src/index.css` | Modify | Plugar `@tailwindcss/typography` via `@plugin` |
| `public/robots.txt` | Create | Permitir indexação geral, apontar para sitemap |
| `public/favicon.svg` | Create | Favicon vetorial primário (placeholder com monograma "GF") |
| `public/favicon.ico` | Create | Fallback Safari/legacy (32x32) |
| `public/apple-touch-icon.png` | Create | iOS home screen (180x180) |
| `public/og-default.png` | Create | OG image fallback (1200x630, placeholder) |
| `src/lib/seo.ts` | Create | Helpers `buildPersonJsonLd`, `buildArticleJsonLd`, constantes do site |
| `src/layouts/Default.astro` | Modify | Aceitar props SEO completas, renderizar OG + Twitter Card + canonical + JSON-LD |
| `src/pages/index.astro` | Modify | Passar props SEO específicas da home |
| `src/pages/radar.astro` | Modify | Props SEO (listagem) |
| `src/pages/insights.astro` | Modify | Props SEO (listagem) |
| `src/pages/privacy.astro` | Modify | Props SEO (`noindex` opcional) |
| `src/pages/terms.astro` | Modify | Props SEO (`noindex` opcional) |
| `src/pages/insights/article.astro` | Modify | Props SEO básicas (rota fica fixa até Onda 4) |
| `src/pages/radar/article/[id].astro` | Modify | Usar `render(entry)`, passar entry pra shell, props SEO `article` |
| `src/components/article/RadarArticleShell.astro` | Create | Shell Astro com header sticky, hero do artigo, image, slot, author footer |
| `src/components/article/AuthorAvatar.astro` | Create | Componente que renderiza avatar (placeholder ou real quando existir) |
| `src/assets/author-placeholder.png` | Create | Placeholder gradient renderizado em PNG (256x256) |
| `src/components/pages/RadarArticlePage.tsx` | Delete | Substituído pelo shell Astro |
| `src/content/radar/1.md` → `src/content/radar/1.mdx` | Rename + Modify | Body real (smoke test do pipeline MDX) |
| `src/components/ui/*.tsx` (~41 arquivos) | Modify (codemod) | Remover sufixo `@<version>` dos imports |

---

## Task 1: Setup de branch e baseline

**Files:**
- Modify: nenhum (operação git)

- [ ] **Step 1: Confirmar working tree limpa**

Run: `git status`
Expected: `nothing to commit, working tree clean`. Se houver mudanças não commitadas, parar e investigar com o owner.

- [ ] **Step 2: Criar branch da onda**

Run: `git checkout -b feat/onda-1-foundation`
Expected: `Switched to a new branch 'feat/onda-1-foundation'`

- [ ] **Step 3: Confirmar baseline funcional**

Run: `pnpm install && pnpm build`
Expected: build sem erros. Se falhar, parar e investigar antes de prosseguir — toda Onda 1 assume baseline verde.

- [ ] **Step 4: Capturar status do build baseline**

Run: `pnpm build 2>&1 | tail -30`
Anotar mentalmente:
- Quantas páginas geradas
- Tamanho do bundle
- Warnings (deve haver zero, ou apenas warnings preexistentes que vamos manter sob observação)

---

## Task 2: Adicionar `@astrojs/sitemap`

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`, `pnpm-lock.yaml` (via comando `astro add`)

- [ ] **Step 1: Instalar integração**

Run: `pnpm astro add sitemap`
Expected: prompt aceitar (`y`) para modificar `astro.config.mjs` e instalar dependência. Saída termina com sucesso.

- [ ] **Step 2: Confirmar integração no config**

Run: `grep -n sitemap astro.config.mjs`
Expected: linha de import `import sitemap from '@astrojs/sitemap';` e entrada `sitemap()` no array `integrations`.

Se o `astro add` não inseriu corretamente (raro), aplicar manualmente:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gusflopes.dev',
  output: 'static',
  integrations: [react(), sitemap()],
  // ... resto inalterado
});
```

- [ ] **Step 3: Confirmar build gera sitemap**

Run: `pnpm build && ls dist/sitemap-*.xml`
Expected: `dist/sitemap-index.xml` e `dist/sitemap-0.xml` aparecem na listagem.

- [ ] **Step 4: Verificar conteúdo do sitemap**

Run: `cat dist/sitemap-0.xml | grep -c '<loc>'`
Expected: número ≥ 7 (as 7 rotas existentes; pode ser mais se contar o artigo dinâmico já renderizado).

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml
git commit -m "feat(seo): adiciona @astrojs/sitemap"
```

---

## Task 3: Criar `robots.txt`

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Criar arquivo**

Conteúdo de `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://gusflopes.dev/sitemap-index.xml
```

- [ ] **Step 2: Confirmar build copia para `dist/`**

Run: `pnpm build && cat dist/robots.txt`
Expected: imprime o conteúdo acima.

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): adiciona robots.txt apontando para sitemap"
```

---

## Task 4: Adicionar favicons

**Files:**
- Create: `public/favicon.svg`
- Create: `public/favicon.ico`
- Create: `public/apple-touch-icon.png`
- Modify: `src/layouts/Default.astro`

- [ ] **Step 1: Criar `public/favicon.svg` (placeholder com monograma)**

Conteúdo de `public/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0F172A"/>
  <text x="50%" y="50%" font-family="Georgia, serif" font-size="32" font-weight="700" fill="#F97316" text-anchor="middle" dominant-baseline="central">GF</text>
</svg>
```

- [ ] **Step 2: Criar fallbacks ICO e PNG**

Sem ferramenta de imagem, gerar via uma ferramenta CLI ou aceitar copiar o SVG temporariamente:

Opção A — usando ImageMagick se disponível:
```bash
cd public
magick -background none -density 300 favicon.svg -resize 32x32 favicon.ico
magick -background none -density 300 favicon.svg -resize 180x180 apple-touch-icon.png
```

Opção B — placeholder mínimo: copiar o SVG como blob para os dois arquivos. Browsers que pedem `.ico` ou `.png` vão receber o SVG e a maioria renderiza. NÃO é correto, mas elimina o 404 e fica como TODO técnico:

```bash
cp public/favicon.svg public/favicon.ico
cp public/favicon.svg public/apple-touch-icon.png
```

Documentar no commit message qual abordagem foi usada. Owner pode fornecer arquivos finais depois.

- [ ] **Step 3: Adicionar links no `<head>` do `Default.astro`**

Em `src/layouts/Default.astro`, dentro do `<head>` (após o `<meta name="viewport">`), adicionar:

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

- [ ] **Step 4: Verificar via build + curl local**

Run: `pnpm build && pnpm preview &` (em outro terminal): `curl -I http://localhost:3001/favicon.svg`
Expected: HTTP 200 e `Content-Type: image/svg+xml`. Encerrar `pnpm preview` depois (`fg` + Ctrl-C ou `kill %1`).

- [ ] **Step 5: Commit**

```bash
git add public/favicon.svg public/favicon.ico public/apple-touch-icon.png src/layouts/Default.astro
git commit -m "feat(seo): adiciona favicon SVG/ICO e apple-touch-icon"
```

---

## Task 5: Criar `src/lib/seo.ts` com helpers e constantes

**Files:**
- Create: `src/lib/seo.ts`

- [ ] **Step 1: Criar arquivo com helpers**

Conteúdo de `src/lib/seo.ts`:

```typescript
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
```

- [ ] **Step 2: Confirmar TypeScript valida**

Run: `pnpm astro check 2>&1 | tail -20`
Expected: zero erros em `src/lib/seo.ts` (pode haver erros preexistentes em outros arquivos — só verificar que NÃO há novos).

Se `astro check` não estiver no scripts, instalar: `pnpm add -D @astrojs/check typescript`. Caso contrário, aceitar `pnpm build` como verificação (o adapter Astro tipa via JIT).

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo.ts
git commit -m "feat(seo): adiciona helpers SEO e JSON-LD em src/lib/seo.ts"
```

---

## Task 6: Refatorar `Default.astro` para emitir SEO completa

**Files:**
- Modify: `src/layouts/Default.astro`

- [ ] **Step 1: Estender `SeoProps` para aceitar `jsonLd` extra**

Atualizar `src/lib/seo.ts` para aceitar JSON-LD por página (ex: Article).

Adicionar como **última propriedade** dentro do `interface SeoProps` (antes do `}` que fecha a interface):

```typescript
  jsonLd?: Record<string, unknown>;
```

- [ ] **Step 2: Substituir o frontmatter e `<head>` do `Default.astro` por versão completa**

Substituir TODO o conteúdo de `src/layouts/Default.astro` por:

```astro
---
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { resolveSeo, buildPersonJsonLd, type SeoProps } from '../lib/seo';
import '../index.css';

interface Props extends SeoProps {}

const props = Astro.props as Props;
const pathname = Astro.url.pathname;
const seo = resolveSeo(props, pathname);
const personJsonLd = buildPersonJsonLd();
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={seo.description} />
    <title>{seo.title}</title>

    <link rel="canonical" href={seo.canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    {props.noindex && <meta name="robots" content="noindex, nofollow" />}

    <meta property="og:type" content={seo.type} />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
    <meta property="og:image" content={seo.image} />
    <meta property="og:url" content={seo.canonical} />
    <meta property="og:site_name" content="gusflopes.dev" />
    <meta property="og:locale" content="pt_BR" />

    {props.type === 'article' && props.article?.publishedTime && (
      <meta property="article:published_time" content={props.article.publishedTime} />
    )}
    {props.type === 'article' && props.article?.modifiedTime && (
      <meta property="article:modified_time" content={props.article.modifiedTime} />
    )}
    {props.type === 'article' && props.article?.author && (
      <meta property="article:author" content={props.article.author} />
    )}
    {props.type === 'article' && props.article?.section && (
      <meta property="article:section" content={props.article.section} />
    )}
    {props.type === 'article' && props.article?.tags?.map((tag) => (
      <meta property="article:tag" content={tag} />
    ))}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seo.title} />
    <meta name="twitter:description" content={seo.description} />
    <meta name="twitter:image" content={seo.image} />
    <meta name="twitter:site" content="@gusflopes" />
    <meta name="twitter:creator" content="@gusflopes" />

    <script type="application/ld+json" set:html={JSON.stringify(personJsonLd)} />
    {Astro.props.jsonLd && (
      <script type="application/ld+json" set:html={JSON.stringify(Astro.props.jsonLd)} />
    )}
  </head>
  <body class="bg-slate-950 min-h-screen text-slate-200 overflow-x-hidden font-sans selection:bg-orange-500/30">
    <Header pathname={pathname} client:load />
    <slot />
    <Footer client:load />
  </body>
</html>
```

- [ ] **Step 3: Build sem erros**

Run: `pnpm build`
Expected: build verde. Se TypeScript reclamar de `Astro.props.jsonLd`, conferir que `SeoProps` foi atualizado.

- [ ] **Step 4: Verificar HTML gerado da home**

Run: `cat dist/index.html | grep -E '(og:|twitter:|canonical|application/ld\+json)' | head -20`
Expected: aparecem as tags OG, Twitter, canonical e ao menos um bloco `<script type="application/ld+json">` (Person).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Default.astro src/lib/seo.ts
git commit -m "feat(seo): Default.astro emite OG, Twitter Card, canonical, JSON-LD Person"
```

---

## Task 7: Atualizar páginas estáticas com props SEO específicas

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/radar.astro`
- Modify: `src/pages/insights.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/terms.astro`
- Modify: `src/pages/insights/article.astro`

- [ ] **Step 1: Atualizar `src/pages/index.astro`**

No frontmatter, passar props específicas pra `<Default>`. Substituir uso atual `<Default title="...">` por:

```astro
<Default
  title="Engenharia, Arquitetura, IA"
  description="Notas autorais e curadoria sobre arquitetura de software, .NET, DevOps e IA aplicada — por Gustavo Lopes."
>
  <HomePage client:load />
</Default>
```

(Manter o resto do arquivo inalterado.)

- [ ] **Step 2: Atualizar `src/pages/radar.astro`**

Substituir `<Default title="...">` por:

```astro
<Default
  title="Radar — Curadoria e leituras"
  description="Curadoria de artigos, vídeos e ferramentas que merecem atenção em arquitetura, IA e engenharia."
>
  <RadarPage items={items} client:load />
</Default>
```

- [ ] **Step 3: Atualizar `src/pages/insights.astro`**

```astro
<Default
  title="Insights — Notas autorais"
  description="Notas longas e ensaios autorais sobre engenharia de software, liderança técnica e IA aplicada."
>
  <InsightsPage articles={articles} client:load />
</Default>
```

- [ ] **Step 4: Atualizar `src/pages/privacy.astro`**

```astro
<Default
  title="Política de Privacidade"
  description="Como coletamos, usamos e protegemos dados em gusflopes.dev."
  noindex={true}
>
  <PrivacyPolicyPage client:load />
</Default>
```

- [ ] **Step 5: Atualizar `src/pages/terms.astro`**

```astro
<Default
  title="Termos de Uso"
  description="Termos de uso de gusflopes.dev."
  noindex={true}
>
  <TermsOfUsePage client:load />
</Default>
```

- [ ] **Step 6: Atualizar `src/pages/insights/article.astro`** (rota fixa, vira dinâmica na Onda 4)

```astro
<Default
  title="Insights — Artigo"
  description="Notas autorais sobre engenharia, arquitetura e IA."
  type="article"
>
  <ArticlePage2 client:load />
</Default>
```

- [ ] **Step 7: Build verde**

Run: `pnpm build`
Expected: zero erros. Páginas geradas.

- [ ] **Step 8: Verificar uma página individual**

Run: `cat dist/radar/index.html | grep 'og:title'`
Expected: `<meta property="og:title" content="Radar — Curadoria e leituras — gusflopes.dev" />`

- [ ] **Step 9: Commit**

```bash
git add src/pages/*.astro src/pages/insights/article.astro
git commit -m "feat(seo): páginas estáticas passam título e descrição específicos"
```

---

## Task 8: Atualizar página de artigo dinâmica `[id].astro` com SEO de Article

**Files:**
- Modify: `src/pages/radar/article/[id].astro`

(Conteúdo MDX vira slot na Task 12 — esta task só atualiza props SEO usando frontmatter da entry.)

- [ ] **Step 1: Substituir conteúdo do `[id].astro`**

Substituir TODO o conteúdo de `src/pages/radar/article/[id].astro` por:

```astro
---
import { getCollection } from 'astro:content';
import Default from '../../../layouts/Default.astro';
import { RadarArticlePage } from '../../../components/pages/RadarArticlePage';
import { buildArticleJsonLd, SITE } from '../../../lib/seo';

export async function getStaticPaths() {
  const entries = await getCollection('radar');
  return entries
    .filter((entry) => !entry.data.isExternal)
    .map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { data } = entry;

const articleJsonLd = buildArticleJsonLd({
  title: data.title,
  description: data.excerpt,
  url: `${SITE.url}/radar/article/${entry.id}`,
  image: data.image,
  datePublished: data.date,
  section: data.category,
});
---

<Default
  title={data.title}
  description={data.excerpt}
  image={data.image}
  type="article"
  article={{
    publishedTime: data.date,
    author: SITE.author.name,
    section: data.category,
  }}
  jsonLd={articleJsonLd}
>
  <RadarArticlePage id={entry.id} client:load />
</Default>
```

(`RadarArticlePage` ainda é o componente React atual. A substituição pelo shell Astro acontece nas Tasks 11-12.)

- [ ] **Step 2: Build verde**

Run: `pnpm build`
Expected: páginas dinâmicas geradas (3 IDs: 1, 5, 6). Sem erros.

- [ ] **Step 3: Verificar HTML do artigo gerado**

Run: `cat dist/radar/article/1/index.html | grep -E '(og:type|article:|application/ld\+json)' | head -10`
Expected: `og:type="article"`, `article:published_time`, dois blocos JSON-LD (Person + Article).

- [ ] **Step 4: Commit**

```bash
git add src/pages/radar/article/[id].astro
git commit -m "feat(seo): artigos do radar emitem OG article + JSON-LD Article"
```

---

## Task 9: Adicionar `@astrojs/mdx`

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`, `pnpm-lock.yaml`
- Modify: `src/content.config.ts`

- [ ] **Step 1: Instalar integração**

Run: `pnpm astro add mdx`
Expected: aceitar prompts (`y`). Saída sucesso.

- [ ] **Step 2: Confirmar config**

Run: `grep -n mdx astro.config.mjs`
Expected: `import mdx from '@astrojs/mdx';` e `mdx()` no array `integrations`.

- [ ] **Step 3: Estender o pattern do glob loader para incluir `.mdx`**

Modificar `src/content.config.ts` substituindo `pattern: '**/*.md'` por `pattern: '**/*.{md,mdx}'` em ambas as coleções (`radar` e `insights`):

```typescript
const radar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/radar' }),
  // schema inalterado
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  // schema inalterado
});
```

- [ ] **Step 4: Build verde**

Run: `pnpm build`
Expected: build sucesso, conteúdo `.md` ainda funciona normalmente.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/content.config.ts package.json pnpm-lock.yaml
git commit -m "feat(content): adiciona @astrojs/mdx e estende glob para .mdx"
```

---

## Task 10: Adicionar Tailwind Typography plugin

**Files:**
- Modify: `package.json`
- Modify: `src/index.css`

- [ ] **Step 1: Instalar plugin**

Run: `pnpm add -D @tailwindcss/typography`
Expected: dependência adicionada.

- [ ] **Step 2: Plugar no `src/index.css` (Tailwind 4 source-based)**

Abrir `src/index.css`. Logo após `@import "tailwindcss";` (provavelmente na primeira linha), adicionar:

```css
@plugin "@tailwindcss/typography";
```

(Se a estrutura atual do `index.css` usa `@import` no topo, esse `@plugin` precisa vir depois do `@import`. Verificar com `head -5 src/index.css` se necessário.)

- [ ] **Step 3: Build verde**

Run: `pnpm build`
Expected: sucesso.

- [ ] **Step 4: Smoke test rápido das classes prose**

Editar temporariamente `src/pages/index.astro` adicionando `<div class="prose prose-invert"><h2>Test</h2><p>Hello</p></div>` em qualquer lugar. Run: `pnpm dev`. Abrir browser em `localhost:3001`. Confirmar que h2 e p ganharam estilo (size, spacing, etc.). Reverter o teste antes de commit.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/index.css
git commit -m "feat(content): adiciona @tailwindcss/typography plugin para artigos MDX"
```

---

## Task 11: Criar `RadarArticleShell.astro` (shell do artigo em Astro puro)

**Files:**
- Create: `src/components/article/RadarArticleShell.astro`
- Create: `src/components/article/AuthorAvatar.astro`
- Create: `src/assets/author-placeholder.png` (gerado via script ou copiado)

- [ ] **Step 1: Criar diretório e o componente AuthorAvatar**

Run: `mkdir -p src/components/article`

Conteúdo de `src/components/article/AuthorAvatar.astro`:

```astro
---
interface Props {
  size?: number;
  className?: string;
}
const { size = 96, className = '' } = Astro.props;
---

<div
  class:list={[
    'rounded-full overflow-hidden shrink-0 border-4 border-slate-700 shadow-lg bg-gradient-to-tr from-orange-500 to-purple-900',
    className,
  ]}
  style={`width: ${size}px; height: ${size}px;`}
  aria-label="Foto do autor (placeholder)"
></div>
```

(Componente fica como placeholder gradient. Quando owner fornecer foto real, swap interno: aceita prop `src` opcional e renderiza `<img>` em vez do gradient.)

- [ ] **Step 2: Criar `src/components/article/RadarArticleShell.astro`**

Conteúdo:

```astro
---
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Linkedin, Github, Twitter } from 'lucide-react';
import AuthorAvatar from './AuthorAvatar.astro';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { SITE } from '../../lib/seo';

interface Props {
  data: {
    title: string;
    excerpt: string;
    date: string;
    duration: string;
    category: string;
    image: string;
  };
}

const { data } = Astro.props;
---

<div class="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden selection:bg-orange-500/30 selection:text-white">

  <!-- Background Elements -->
  <div class="fixed inset-0 pointer-events-none z-0">
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
  </div>

  <!-- Sticky article header -->
  <div class="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/radar" class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
        <ArrowLeft size={14} />
        Voltar para o Radar
      </a>
      <div class="flex gap-4">
        <button class="p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-colors" aria-label="Compartilhar">
          <Share2 size={16} />
        </button>
        <button class="p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-colors" aria-label="Salvar">
          <Bookmark size={16} />
        </button>
      </div>
    </div>
  </div>

  <article class="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">

    <!-- Article Header -->
    <header class="mb-12 text-center md:text-left">
      <div class="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-500 mb-6 justify-center md:justify-start">
        <span>{data.category}</span>
        <span class="w-1 h-1 bg-slate-700 rounded-full"></span>
        <span class="text-slate-400 flex items-center gap-1">
          <Calendar size={12} /> {data.date}
        </span>
        <span class="w-1 h-1 bg-slate-700 rounded-full"></span>
        <span class="text-slate-400 flex items-center gap-1">
          <Clock size={12} /> {data.duration}
        </span>
      </div>

      <h1 class="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
        {data.title}
      </h1>

      <p class="font-sans text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
        {data.excerpt}
      </p>
    </header>

    <!-- Featured Image -->
    <div class="mb-16 rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-[21/9] relative group">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60"></div>
      <ImageWithFallback
        src={data.image}
        alt={data.title}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
      />
    </div>

    <!-- MDX content slot -->
    <div class="prose prose-invert prose-lg md:prose-xl max-w-none font-sans text-slate-300 leading-loose prose-headings:font-serif prose-headings:font-medium prose-headings:text-white prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-white">
      <slot />
    </div>

    <!-- Author Footer -->
    <div class="mt-24 pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
      <AuthorAvatar size={96} />
      <div>
        <h4 class="font-sans font-bold text-orange-500 uppercase tracking-widest text-xs mb-2">Sobre o Autor</h4>
        <p class="font-serif text-3xl md:text-4xl text-white mb-2">{SITE.author.name}</p>
        <p class="text-sm text-slate-400 font-mono max-w-lg leading-relaxed mb-4">
          Tech Lead e arquiteto de software. Notas sobre engenharia, arquitetura e IA aplicada.
        </p>
        <div class="flex items-center gap-4 justify-center md:justify-start">
          <a href="#" class="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn (placeholder)">
            <Linkedin size={20} />
          </a>
          <a href="#" class="text-slate-400 hover:text-white transition-colors" aria-label="GitHub (placeholder)">
            <Github size={20} />
          </a>
          <a href="#" class="text-slate-400 hover:text-white transition-colors" aria-label="Twitter (placeholder)">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </div>

  </article>
</div>
```

(Os 3 ícones sociais ficam `href="#"` propositalmente — fix vai pra Onda 5. Marcado com `aria-label` indicando placeholder.)

- [ ] **Step 3: Build verde**

Run: `pnpm build`
Expected: sucesso. (O shell ainda não está sendo usado — só foi criado.)

- [ ] **Step 4: Commit**

```bash
git add src/components/article/RadarArticleShell.astro src/components/article/AuthorAvatar.astro
git commit -m "feat(article): cria shell Astro RadarArticleShell e AuthorAvatar placeholder"
```

---

## Task 12: Refatorar `[id].astro` para usar shell + slot

**Files:**
- Modify: `src/pages/radar/article/[id].astro`
- Delete: `src/components/pages/RadarArticlePage.tsx`

- [ ] **Step 1: Substituir `[id].astro` por versão com `render(entry)` + slot**

Substituir TODO o conteúdo de `src/pages/radar/article/[id].astro` por:

```astro
---
import { getCollection, render } from 'astro:content';
import Default from '../../../layouts/Default.astro';
import RadarArticleShell from '../../../components/article/RadarArticleShell.astro';
import { buildArticleJsonLd, SITE } from '../../../lib/seo';

export async function getStaticPaths() {
  const entries = await getCollection('radar');
  return entries
    .filter((entry) => !entry.data.isExternal)
    .map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { data } = entry;
const { Content } = await render(entry);

const articleJsonLd = buildArticleJsonLd({
  title: data.title,
  description: data.excerpt,
  url: `${SITE.url}/radar/article/${entry.id}`,
  image: data.image,
  datePublished: data.date,
  section: data.category,
});
---

<Default
  title={data.title}
  description={data.excerpt}
  image={data.image}
  type="article"
  article={{
    publishedTime: data.date,
    author: SITE.author.name,
    section: data.category,
  }}
  jsonLd={articleJsonLd}
>
  <RadarArticleShell data={data}>
    <Content />
  </RadarArticleShell>
</Default>
```

- [ ] **Step 2: Build verde**

Run: `pnpm build`
Expected: sucesso. Páginas dinâmicas geradas (`/radar/article/1`, `/5`, `/6`). Conteúdo dentro do `<slot />` é o body atual (`Conteúdo do artigo será migrado...`) — placeholder mas renderizado pelo pipeline correto.

- [ ] **Step 3: Verificar uma página gerada visualmente**

Run: `pnpm preview` (em outro terminal): `curl -s http://localhost:3001/radar/article/1 | grep -E '(<h1|prose|Conteúdo do artigo)' | head -5`
Expected: `<h1>` com título do artigo, classe `prose`, e o texto placeholder do markdown atual aparece dentro.

- [ ] **Step 4: Deletar `RadarArticlePage.tsx`**

Run: `git rm src/components/pages/RadarArticlePage.tsx`
Expected: arquivo removido do índice.

- [ ] **Step 5: Build novamente verde após delete**

Run: `pnpm build`
Expected: sucesso. Não pode haver imports remanescentes.

- [ ] **Step 6: Commit**

```bash
git add src/pages/radar/article/[id].astro src/components/pages/RadarArticlePage.tsx
git commit -m "refactor(article): radar artigo usa shell Astro + render(entry); remove RadarArticlePage.tsx"
```

---

## Task 13: Smoke test do pipeline MDX (`1.md` → `1.mdx` com body real)

**Files:**
- Rename + Modify: `src/content/radar/1.md` → `src/content/radar/1.mdx`

- [ ] **Step 1: Renomear e substituir conteúdo**

Run: `git mv src/content/radar/1.md src/content/radar/1.mdx`

Substituir TODO o conteúdo de `src/content/radar/1.mdx` por:

```mdx
---
title: "Desacoplando Monólitos com DDD: Guia Prático"
excerpt: "Como identificar Bounded Contexts e migrar sistemas legados sem parar a operação. Um guia passo a passo para arquitetos."
date: "25 Out, 2023"
duration: "8 min"
category: "Arquitetura"
type: "article"
isExternal: false
link: "/radar/article/1"
source: "Local"
image: "https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFyY2hpdGVjdHVyZSUyMGRpYWdyYW0lMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjBjb2RlJTIwbW9uaXRvcnxlbnwxfHx8fDE3NjQ1NDUxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
---

A complexidade no desenvolvimento de software não é acidental; é uma consequência direta da complexidade do domínio que estamos tentando modelar. Quando tratamos essa complexidade apenas com ferramentas técnicas, falhamos. O verdadeiro desafio é linguístico e estrutural.

## Os Princípios Core do DDD

Domain-Driven Design não é apenas um conjunto de padrões (Repository, Entity, Value Object); é uma filosofia centrada na complexidade do núcleo do negócio. Ao focar em uma linguagem onipresente e contextos delimitados (*Bounded Contexts*), podemos criar modelos que são um reflexo verdadeiro do negócio.

> "O coração do software é sua capacidade de resolver problemas relacionados ao domínio para seu usuário. Todas as outras funcionalidades, vitais como possam ser, suportam este propósito primário."

Frequentemente, nos perdemos em detalhes de implementação (Kubernetes, Kafka, Redis) antes mesmo de entendermos o fluxo de valor. Isso gera o que chamamos de "Arquitetura Acidental".

## Estratégias de Estrangulamento

Para migrar de um monólito para microsserviços (ou melhor, para um sistema distribuído modular), a abordagem Big Bang raramente funciona. O padrão Strangler Fig é essencial.

A ideia é criar novas funcionalidades nas bordas do sistema, interceptando chamadas e redirecionando para novos serviços, "estrangulando" lentamente o legado até que ele possa ser desligado.

```ts
const handleRequest = (req) => {
  if (shouldRouteToNewService(req)) {
    return NewService.process(req);
  }
  return LegacyMonolith.process(req);
};
```

Esta simplicidade no código esconde uma complexidade orquestrada. Ao retornar a plataforma de dados junto com os times, garantimos que a estrutura organizacional (Lei de Conway) seja respeitada pelo código.
```

(Esse é texto extraído do componente React anterior, agora vivendo como conteúdo do artigo. NÃO substitui Onda 4 — Onda 4 produzirá artigos novos com texto realmente atualizado. Aqui é só smoke test.)

- [ ] **Step 2: Build verde**

Run: `pnpm build`
Expected: sucesso. O frontmatter Zod valida (todos campos presentes). MDX compila o body.

- [ ] **Step 3: Verificar render com `pnpm preview`**

Run: `pnpm preview` (em outro terminal): abrir `http://localhost:3001/radar/article/1` no browser. Verificar manualmente:
- Título aparece no hero
- Imagem aparece
- Body markdown ganhou estilo via `prose` (h2 com fonte serif, parágrafos com line-height correta, blockquote com borda esquerda, code block formatado)
- Author footer renderiza
- Sticky header funciona ao scrollar

Se algo não estiver renderizando, inspecionar:
- `<div class="prose prose-invert prose-lg ...">` está envolvendo o slot
- `@plugin "@tailwindcss/typography"` foi adicionado em `src/index.css`

Encerrar `pnpm preview` (Ctrl-C).

- [ ] **Step 4: Commit**

```bash
git add src/content/radar/1.mdx
git commit -m "feat(content): migra 1.mdx com body real para smoke test do pipeline MDX"
```

---

## Task 14: Cleanup dos aliases versionados

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/components/ui/*.tsx` (~41 arquivos)

- [ ] **Step 1: Codemod nos imports `from '<pkg>@<version>'`**

Aplicar `sed` em todos os arquivos `.tsx` em `src/components/ui/`. Usa `|` como separador para evitar escape do `/` em paths npm escopados:

```bash
find src/components/ui -name '*.tsx' -print0 | xargs -0 sed -i -E 's|from "([^"]+)@[0-9][^"]*"|from "\1"|g'
```

**Explicação do regex:**
- `s|...|...|g` — separador `|` (em vez de `/`) para não conflitar com `/` em nomes de pacote
- `from "([^"]+)` — grupo 1 captura nome do pacote (qualquer coisa entre aspas)
- `@[0-9][^"]*"` — `@` seguido de versão começando com dígito até a aspas
- Substitui por `from "\1"` (mantém só o nome do pacote)

Aspas simples evitam interpolação de shell. `[0-9]` no início da versão impede falso match em paths como `@scope/pkg` (que não tem `@digit`).

- [ ] **Step 2: Verificar zero imports versionados restantes**

Run: `grep -rE 'from "[^"]+@[0-9]' src/components/ui/`
Expected: zero matches (saída vazia, exit code 1).

- [ ] **Step 3: Remover bloco de aliases do `astro.config.mjs`**

Substituir o conteúdo de `astro.config.mjs` por:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://gusflopes.dev',
  output: 'static',
  integrations: [react(), sitemap(), mdx()],
  server: { port: 3001 },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
```

(Mantém apenas o alias `@` → `./src`. Tudo o que era versionado vira import normal e Vite resolve via `node_modules`.)

- [ ] **Step 4: Build verde**

Run: `pnpm build`
Expected: sucesso. Se algum arquivo escapou do sed (ex: import na mesma linha quebra de outra forma), o build vai reclamar com `Cannot find module 'X@version'`. Nesse caso, achar com `grep -rE "@[0-9]" src/components/ui/` e corrigir manualmente.

- [ ] **Step 5: `pnpm dev` smoke test**

Run: `pnpm dev` (em outro terminal): `curl -s http://localhost:3001/ | head -20` — só pra confirmar que o servidor sobe sem erro de import. Encerrar.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs src/components/ui
git commit -m "chore(deps): remove aliases versionados (legado Figma export); imports limpos em ui/*"
```

---

## Task 15: Cloudflare Web Analytics

**Files:**
- Modify: `src/layouts/Default.astro`

- [ ] **Step 1: Owner cria propriedade no dashboard CWA**

(Operação manual fora do código.)

Owner abre `https://dash.cloudflare.com/?to=/:account/web-analytics`, cria uma propriedade pra `gusflopes.dev`, copia o **token** (string opaca, ~32 chars). Token CWA NÃO é secret — pode ficar hardcoded ou em variável de ambiente pública.

Se o owner ainda não criou, deixar a string como placeholder `'YOUR_CWA_TOKEN'` e abrir TODO técnico — site funciona sem o script (só não captura métricas).

- [ ] **Step 2: Adicionar script no `Default.astro`**

No final do `<body>` (logo antes de `</body>` em `src/layouts/Default.astro`), adicionar:

```astro
    <!-- Cloudflare Web Analytics -->
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "YOUR_CWA_TOKEN"}'
    ></script>
```

Substituir `YOUR_CWA_TOKEN` pelo token real quando o owner fornecer.

- [ ] **Step 3: Build verde**

Run: `pnpm build`
Expected: sucesso. Inspecionar `dist/index.html` no fim do `<body>`:

```bash
grep -A 3 'cloudflareinsights' dist/index.html
```

Expected: tag `<script>` aparece.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Default.astro
git commit -m "feat(analytics): adiciona Cloudflare Web Analytics beacon"
```

---

## Task 16: Atualizar README e NEXT_STEPS para refletir Onda 1

**Files:**
- Modify: `NEXT_STEPS.md`
- Modify: `README.md` (apenas se descrever rotas/features tocadas)

- [ ] **Step 1: Marcar itens da Onda 1 como concluídos no `NEXT_STEPS.md`**

No `NEXT_STEPS.md`, mover itens **6 (SEO/social meta tags)**, **7 (favicon)**, **10 (aliases versionados)** da seção "Importante / Cleanup técnico" para uma seção nova "Concluído na Onda 1 (`feat/onda-1-foundation`)" no topo do documento. O resto continua valendo para Ondas 2-5.

Texto sugerido pra inserir no topo da seção "Crítico":

```markdown
## Concluído na Onda 1 (foundation técnico)

- ✅ SEO/meta tags (OG, Twitter, canonical, JSON-LD Person/Article) — `src/layouts/Default.astro` + `src/lib/seo.ts`
- ✅ Favicon SVG/ICO + apple-touch-icon
- ✅ `sitemap.xml` via `@astrojs/sitemap` + `robots.txt`
- ✅ MDX pipeline (`@astrojs/mdx`) + Tailwind Typography plugin
- ✅ `RadarArticleShell.astro` + render via slot (substitui RadarArticlePage.tsx)
- ✅ Cleanup de aliases versionados (Figma legado)
- ✅ Cloudflare Web Analytics

Detalhes da execução em `docs/superpowers/plans/2026-04-26-onda-1-foundation.md`.
```

- [ ] **Step 2: Commit**

```bash
git add NEXT_STEPS.md
git commit -m "docs: marca itens concluídos da Onda 1 em NEXT_STEPS"
```

---

## Task 17: Gate final da Onda 1

**Files:** nenhum (verificações)

- [ ] **Step 1: Build limpo**

Run: `pnpm build 2>&1 | tee /tmp/build-onda-1.log`
Expected: zero `error`, zero novos `warning` em relação ao baseline da Task 1. Páginas geradas:

- `/` (index)
- `/radar`
- `/radar/article/1`, `/5`, `/6`
- `/insights`
- `/insights/article`
- `/privacy`
- `/terms`
- `/sitemap-index.xml` + `/sitemap-0.xml`
- `/robots.txt`
- `/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`

Run: `ls dist/ && ls dist/radar/article/`
Expected: confirmação visual.

- [ ] **Step 2: Lighthouse SEO ≥ 90 nas rotas-chave**

Run: `pnpm preview` (em outro terminal). Para cada uma das URLs abaixo, rodar Lighthouse audit (Chrome DevTools → Lighthouse → SEO category):

- `http://localhost:3001/`
- `http://localhost:3001/radar`
- `http://localhost:3001/insights`
- `http://localhost:3001/radar/article/1`

Expected: SEO score ≥ 90 em todas.

(Alternativa CLI: `pnpm dlx @lhci/cli@latest collect --url=http://localhost:3001/ --url=http://localhost:3001/radar --url=http://localhost:3001/insights --url=http://localhost:3001/radar/article/1 --settings.onlyCategories=seo`. Pode exigir Chrome instalado localmente.)

Se score < 90 em alguma rota, identificar o que está faltando (provavelmente: descrição muito curta, ausência de canonical, OG image inválida) e corrigir antes de fechar a onda.

- [ ] **Step 3: OG válido em rota-chave**

Manualmente: abrir `https://www.opengraph.xyz/url/https%3A%2F%2Fgusflopes.dev%2F` (após push do branch ainda não funciona; testar localmente com `curl`):

```bash
curl -s http://localhost:3001/ | grep -E 'og:(title|description|image|type|url)' | sort -u
```

Expected: 5 linhas, valores não vazios. Imagem aponta para `http://localhost:3001/og-default.png` ou para o image específico da página.

Repetir para `/radar/article/1`:

```bash
curl -s http://localhost:3001/radar/article/1 | grep -E 'og:(title|description|image|type)|article:' | sort -u
```

Expected: `og:type="article"`, `article:published_time`, etc.

- [ ] **Step 4: Favicon sem 404**

Em `pnpm preview`:

```bash
curl -I http://localhost:3001/favicon.svg
curl -I http://localhost:3001/favicon.ico
curl -I http://localhost:3001/apple-touch-icon.png
```

Expected: três respostas com HTTP 200.

- [ ] **Step 5: Cloudflare Web Analytics**

Owner verifica: dashboard CWA registra ao menos 1 pageview após push para preview Cloudflare. Esse step só é validável após o branch estar deployado em ambiente Cloudflare Workers — não bloqueia merge se o token ainda for placeholder; vira TODO técnico documentado.

- [ ] **Step 6: Console limpo no browser**

Abrir cada uma das 7 rotas no Chrome (`pnpm preview`), inspecionar console DevTools.
Expected: zero erros vermelhos, zero `404` em Network panel (exceto recursos externos esperados como Unsplash, que não são problema da Onda 1).

- [ ] **Step 7: Encerrar a onda**

```bash
git log --oneline feat/onda-1-foundation ^main
```

Expected: lista limpa de commits da onda (1 por task; ~16 commits).

Push do branch para o remoto:

```bash
git push -u origin feat/onda-1-foundation
```

Cloudflare gera **preview URL** (`<hash>-gusflopes-website.gusflopes86.workers.dev`). Owner valida visualmente antes do merge.

- [ ] **Step 8: PR**

```bash
gh pr create --title "Onda 1: foundation técnico (SEO, MDX, favicons, aliases cleanup, CWA)" --body "$(cat <<'EOF'
## Summary

Implementa a Onda 1 do plano de launch readiness (`docs/superpowers/specs/2026-04-26-launch-readiness-design.md`):

- SEO completo: OG, Twitter Card, canonical, JSON-LD Person/Article
- Favicon SVG + fallbacks ICO/apple-touch
- `sitemap.xml` (`@astrojs/sitemap`) + `robots.txt`
- MDX pipeline (`@astrojs/mdx`) + Tailwind Typography
- `RadarArticleShell.astro` substitui `RadarArticlePage.tsx`; render via slot
- Cleanup de ~35 aliases versionados (legado Figma)
- Cloudflare Web Analytics

Plan executado: `docs/superpowers/plans/2026-04-26-onda-1-foundation.md`.

## Test plan

- [ ] `pnpm build` verde
- [ ] Lighthouse SEO ≥ 90 em `/`, `/radar`, `/insights`, `/radar/article/1`
- [ ] OG tags válidas (testar em opengraph.xyz após preview deploy)
- [ ] Sitemap lista todas as rotas em `<URL preview>/sitemap-0.xml`
- [ ] Favicon sem 404
- [ ] Console limpo nas 7 rotas
- [ ] CWA captura pageview no dashboard (após token real ser configurado)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## TODOs técnicos resultantes (não-bloqueantes)

Documentar no commit final ou em issue separada:

1. **Foto real do autor** — substituir gradient placeholder em `AuthorAvatar.astro` quando owner enviar `author.jpg`
2. **OG image padrão** — `public/og-default.png` é placeholder; criar imagem 1200x630 oficial
3. **Token CWA real** — substituir `YOUR_CWA_TOKEN` em `Default.astro`
4. **Favicon definitivo** — placeholder atual é monograma "GF"; owner pode querer marca pessoal própria
5. **Migrar restante das coleções `radar` (5 arquivos) e `insights` (6 arquivos) para MDX** — fica para Onda 4 quando conteúdo real for produzido

---

## Spec coverage check

Confronto com §4 Onda 1 do spec:

| Requisito do spec | Task |
|---|---|
| OG, Twitter Card, canonical, JSON-LD Person+Article | T5, T6, T7, T8 |
| `<html lang="pt-BR">` mantido | T6 (preserva) |
| Favicon SVG + ICO + apple-touch | T4 |
| `pnpm astro add sitemap` + `site:` | T2 |
| `public/robots.txt` apontando pra sitemap | T3 |
| `pnpm astro add mdx` | T9 |
| `[id].astro` usa `render(entry)` | T12 |
| `RadarArticlePage.tsx` refatorado pra shell + slot | T11 + T12 (substituído por shell Astro, T12 deleta o tsx) |
| Refactor `ArticlePage2`/`/insights/article` | NÃO — fica pra Onda 4 conforme spec |
| 1 artigo de cada coleção com body real | T13 (apenas radar/1.mdx; insights vai pra Onda 4) |
| Cleanup aliases — sed em `src/components/ui/*` | T14 |
| Remover bloco em `astro.config.mjs` | T14 |
| Avatar do autor (`src/assets/author.jpg`) — placeholder | T11 (AuthorAvatar.astro com gradient placeholder; arquivo PNG real é TODO) |
| Substituir `<div className="bg-gradient-to-tr ...">` em RadarArticlePage | T11 (no shell novo já usa `AuthorAvatar`) |
| Cloudflare Web Analytics script | T15 |

**Gates do spec:**

| Gate | Task |
|---|---|
| Build sem warnings | T17 step 1 |
| Lighthouse SEO ≥ 90 | T17 step 2 |
| OG válido | T17 step 3 |
| Sitemap lista todas as rotas | T2 step 4 + T17 step 1 |
| Favicon sem 404 | T17 step 4 |
| CWA dashboard pageview | T17 step 5 (TODO se token placeholder) |

Sem gaps detectados.
