# Próximos passos pós-migração para Astro

Status atual:

- [x] **Fase 1** — Astro shell (Astro substituiu Vite como build tool, app entrava como single client island)
- [x] **Fase 2** — Per-route Astro pages com islands; `react-router-dom` removido
- [x] **Fase 3** — Content Collections (Zod) para radar e insights
- [x] **Fase 4** — Tailwind 4 source-based via `@tailwindcss/vite`
- [x] **Fase 5** — Cleanup de artefatos legados; `dist/` no `.gitignore`
- [ ] **Fase 6** — SSR / Edge functions: **não executada por design** (ver abaixo)

## Iterações restantes

### Conteúdo dos artigos individuais → MDX renderizado

Os componentes [`RadarArticlePage`](./src/components/pages/RadarArticlePage.tsx) e [`ArticlePage2`](./src/components/pages/ArticlePage2.tsx) ainda têm o conteúdo do artigo (`<p>`, `<blockquote>`, `<pre><code>`, etc) **hardcoded** no JSX — eles renderizam o mesmo placeholder "Domain-Driven Design" para qualquer ID.

Próximo passo:

1. Adicionar `@astrojs/mdx` integration.
2. Trocar `*.md` por `*.mdx` em `src/content/radar/` e `src/content/insights/` e mover o conteúdo do artigo para o body do MDX.
3. Em `src/pages/radar/article/[id].astro`, usar `entry.render()` para renderizar o body como `<Content />`.
4. Os componentes React ficam só com a "moldura" (header sticky, autor footer, share buttons) e recebem um `<slot>` ou children. Ou viram puro Astro layout, com a interatividade (botão Copy) extraída para um island menor.
5. Redirecionar `/insights/article` (sem ID) para uma rota dinâmica `/insights/article/[id]` ao invés da rota fixa atual.

### Limpeza dos aliases versionados (Figma export)

`astro.config.mjs` ainda mantém ~30 aliases tipo `'vaul@1.1.2': 'vaul'`. São herança do export do Figma e afetam **~45 arquivos** em `src/components/ui/*` (acordion.tsx, alert-dialog.tsx, etc). Caminho:

1. Para cada arquivo: trocar `from 'vaul@1.1.2'` → `from 'vaul'`, `from '@radix-ui/react-dialog@1.1.6'` → `from '@radix-ui/react-dialog'`, etc.
2. Apagar o bloco de aliases versionados do `astro.config.mjs`.
3. Manter só `'@': './src'` (o atalho geral).

Codemod com `sed` resolve em uma rodada — o padrão é regular: `'<pkg>@<version>'` vira `'<pkg>'`. A grep do bloco anterior mostra os arquivos afetados.

### Content Collections para o body dos insights

Mesmo movimento da seção anterior, mas para `/insights/article` (hoje rota fixa, sem ID).

### Imagens otimizadas (`<Image />` do Astro)

Hoje todas as `<img>` (Hero background, cards, autor avatars) usam URLs externas do Unsplash (parâmetros `?w=1080&q=80`). Migrar para o componente `<Image />` do Astro daria:

- Otimização automática (formato AVIF/WebP, srcset responsivo)
- Lazy loading nativo
- Layout shift (CLS) controlado

Mas como os componentes são React islands e `<Image />` é Astro-only, o caminho seria mover essas imagens para os layouts/`*.astro` ou usar `astro:assets` via getImage() retornando URLs otimizadas para os componentes React.

Skip if not blocking — Unsplash já entrega imagens otimizadas no CDN.

## Por que a fase 6 (SSR) não foi feita

A fase 6 original estava marcada como **opcional** e dependia de existir um caso de uso real para código de Worker server-side: forms com submit, A/B testing por região, caching dinâmico, webhooks.

Hoje o site é 100% conteúdo estático. Adicionar `@astrojs/cloudflare` + `output: "server"` + um `src/worker.ts` introduz:

- Adaptador SSR no bundle
- Cold start no Worker (versus assets servidos do edge cache)
- Manutenção de uma camada de runtime sem benefício

Quando aparecer uma feature que precise (ex: form de contato com server-side submit, edge logging, geo-personalização), o caminho está pronto — basta adicionar a integration e mudar o output. O `wrangler.jsonc` já tem `observability.logs.enabled: true` esperando.
