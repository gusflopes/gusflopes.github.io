# Próximos passos pós-migração para Astro

Esta migração foi a **fase 1 (shell)**: Astro substituiu o Vite como orquestrador de build, mas o site segue sendo um SPA React mountado como `client:only="react"` numa única página (`src/pages/index.astro`). Roteamento continua via `react-router-dom`; o SPA fallback do Worker (`not_found_handling: "single-page-application"`) faz qualquer URL cair no `index.html` para o React Router resolver.

Os componentes e estilos não mudaram. O que mudou:

- `vite.config.ts` → `astro.config.mjs` (com os mesmos aliases preservados no bloco `vite`)
- `index.html` (raiz) → `src/pages/index.astro`
- `src/main.tsx` deletado (Astro hidrata o island sozinho)
- `tsconfig.json` agora estende `astro/tsconfigs/strict`
- `tsconfig.node.json` deletado
- Dev/build/preview agora rodam via `astro` CLI

## Fase 2 — Astro per-route pages (a melhor parte)

Hoje o build produz **uma única página** (`/`) com todo o React empacotado num único bundle. Pra colher os benefícios reais do Astro, cada rota vira uma `.astro` própria, com a árvore React entrando como island só onde faz sentido.

### Mapeamento

| Rota atual (React Router) | Arquivo Astro |
|---|---|
| `/` | `src/pages/index.astro` |
| `/radar` | `src/pages/radar.astro` |
| `/radar/article/:id` | `src/pages/radar/article/[id].astro` |
| `/insights` | `src/pages/insights.astro` |
| `/insights/article` | `src/pages/insights/article.astro` |
| `/privacy` | `src/pages/privacy.astro` |
| `/terms` | `src/pages/terms.astro` |

### Mudanças necessárias

**Componentes que importam `react-router-dom`** (precisam virar `<a href="...">` ou Astro layouts):

- `src/App.tsx` → some (cada `.astro` vira sua própria entry)
- `src/components/Header.tsx` — `Link`, `useLocation`, `useNavigate` (esse é o mais complicado: tem lógica de scroll para seções via `location.state`)
- `src/components/Footer.tsx` — 5 `<Link>` simples
- `src/components/Services.tsx` — 1 `<Link>`
- `src/components/utils/ScrollToTop.tsx` — fica obsoleto (navegação full-page já reseta scroll)
- `src/components/pages/RadarPage.tsx` — `<Link>` para artigos
- `src/components/pages/InsightsPage.tsx` — `<Link>` para artigo
- `src/components/pages/ArticlePage2.tsx` — `<Link>` de volta
- `src/components/pages/RadarArticlePage.tsx` — `<Link>` + `useParams` (`:id`)

**Estratégia:**

1. **Layout compartilhado**: `src/layouts/Default.astro` com `<head>`, fontes, e os componentes `Header` + `Footer` como islands `client:load`.
2. **Cada page** importa o componente de página existente (`HomePage`, `RadarPage`, etc.) como island. Páginas estáticas podem usar `client:visible` ou nem precisar de hydration se forem 100% estáticas.
3. **Header**: extrair a lógica de "navegação para seção a partir de outra página" para query params ou hash. Em vez de `navigate('/', { state: { scrollTo: 'consulting' }})`, usar `<a href="/#consulting">` + listener de hash.
4. **Dynamic params**: na rota `/radar/article/[id].astro`, ler `Astro.params.id` no frontmatter e passar como prop para o componente React.
5. **Deletar** `react-router-dom`, `App.tsx`, `ScrollToTop.tsx`.

### Ganhos esperados

- HTML servido por rota (SEO real, social cards corretos por página)
- Code splitting natural por rota
- Cada página pode ter `<head>` próprio (title, meta, og:image)
- Possibilidade de pre-renderizar conteúdo estático (artigos do radar, políticas) sem JavaScript
- Bundle inicial menor — componentes só hidratam onde precisam

## Fase 3 — Conteúdo via Content Collections

As páginas `/radar` e `/insights` exibem listas de artigos. Hoje os dados estão hardcoded nos componentes ou (legado) num `insights-data.json` na raiz.

Migrar para [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/):

- `src/content/radar/*.mdx` — cada artigo do radar como MDX
- `src/content/insights/*.mdx` — cada insight como MDX
- Schema Zod para validar frontmatter (title, date, tags, cover)
- Listagens (`/radar`, `/insights`) iteram a coleção em build time
- Páginas de artigo (`/radar/article/[slug]`) renderizam o MDX direto

Cancela o `insights-data.json` e os componentes `ArticlePage2` / `RadarArticlePage` viram só layouts para o MDX.

## Fase 4 — Tailwind 4 source-based

O `src/index.css` hoje é Tailwind 4.1.3 **pré-compilado** (39KB de output gerado e commitado). Não há fonte Tailwind no projeto. Trazer o pipeline:

1. `pnpm add -D tailwindcss @tailwindcss/vite`
2. Plugar `tailwindcss()` no `vite.plugins` do `astro.config.mjs` (igual o shelfye)
3. Substituir o `index.css` atual por uma fonte enxuta com `@import "tailwindcss"` + variáveis de tema customizadas
4. Tailwind 4 detecta as classes usadas no JSX e gera o CSS no build

Ganhos: não precisa mais commitar CSS gerado, alterar tema fica no source, dev mode com HMR.

## Fase 5 — Limpeza

- `dist/` no `.gitignore` (hoje está tracked — gera churn enorme com hashes do Astro a cada build). Comando: `git rm -r --cached dist && echo dist >> .gitignore`.
- Remover artefatos legados do projeto antigo na raiz: `build/`, `images/`, `posts/`, `wallpaper.jpg` (já tem em `public/`?), `insights-data.json`. Auditar antes de deletar.
- Limpar os aliases versionados no `astro.config.mjs` (`vaul@1.1.2 → vaul`, etc) — herança do export do Figma. Encontrar e ajustar os imports nos componentes pra usar o nome canônico.
- Remover diretórios não-fonte da raiz: `_archive/` (já existe?), `docs/private/`.

## Fase 6 — SSR / Edge functions (opcional)

Hoje o site é 100% estático (Workers Static Assets). Se um dia precisar de:

- Forms com submit server-side (newsletter, contato)
- A/B testing por região/país
- Caching dinâmico
- Webhooks

→ adicionar `main: "src/worker.ts"` no `wrangler.jsonc`, escrever um Worker fetch handler, e usar [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) para mudar `output` de `"static"` para `"server"` ou `"hybrid"`.
