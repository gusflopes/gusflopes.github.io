# Instruções para o Projeto gusflopes.dev

Site em **Astro 6** com React 18 islands (Radix UI + Tailwind 4 + framer-motion). Roteamento file-based via `src/pages/*.astro`. Conteúdo em `src/content/*.md` validado por schemas Zod (Content Collections). Deploy via Cloudflare Workers (Static Assets).

## Stack

- **Build**: Astro 6.1.x + `@astrojs/react` 5 + `@tailwindcss/vite` 4 (porta dev `3001`)
- **UI**: Radix UI primitives + Tailwind 4 (source-based, `src/index.css`) + `lucide-react` + `framer-motion`
- **Roteamento**: Astro file-based (`src/pages/*.astro`); cada componente React entra como `client:load` island
- **Conteúdo**: Astro Content Collections (radar e insights) com schemas Zod em `src/content.config.ts`
- **Deploy**: Cloudflare Workers Static Assets (sem código de Worker, só assets em `./dist`)

## Rotas

| Path | Página Astro | Componente React (island) |
|---|---|---|
| `/` | `src/pages/index.astro` | `HomePage` |
| `/radar` | `src/pages/radar.astro` | `RadarPage` (recebe `items` da coleção) |
| `/radar/article/[id]` | `src/pages/radar/article/[id].astro` | `RadarArticlePage` (recebe `id`) |
| `/insights` | `src/pages/insights.astro` | `InsightsPage` (recebe `articles` da coleção) |
| `/insights/article/[id]` | `src/pages/insights/article/[id].astro` | `InsightArticlePage` (shell; corpo via slot) |
| `/privacy` | `src/pages/privacy.astro` | `PrivacyPolicyPage` |
| `/terms` | `src/pages/terms.astro` | `TermsOfUsePage` |
| `/rss.xml` | `src/pages/rss.xml.ts` | — (feed das duas coleções) |

`Header` (recebe `pathname` via prop) e `Footer` ficam no layout `src/layouts/Default.astro`. Header se auto-esconde em páginas de artigo (`/radar/article/*`, `/insights/article/*`).

As rotas de artigo são dinâmicas: `getStaticPaths()` deriva os IDs (slugs dos arquivos `.md`) das coleções — no radar, filtrando `isExternal: false`. O corpo markdown é renderizado via `render(entry)` (`astro:content`) e injetado no shell React (`RadarArticlePage`/`InsightArticlePage`) por slot; o frontmatter chega via props. O layout aceita props de SEO (`title`, `description`, `image`, `type`, `publishedDate`) e monta OG/Twitter/canonical; sitemap via `@astrojs/sitemap`.

## Comandos úteis

- `pnpm dev` — Astro dev server em `http://localhost:3001`
- `pnpm build` — `astro build` em `./dist`
- `pnpm preview` — serve o build local
- `pnpm deploy` — build + `wrangler deploy` (precisa `pnpm wrangler login`)

## Conteúdo

Para adicionar um item ao Radar:

```bash
echo '---
title: "..."
excerpt: "..."
date: "YYYY-MM-DD"
duration: "N min"
category: "Arquitetura" | ".NET" | "DevOps" | "Carreira" | "IA"
type: "article" | "video"
isExternal: false
link: "/radar/article/<slug>"
source: "Local"
image: "https://..."
---

Corpo do artigo em markdown.' > src/content/radar/<slug>.md
```

Arquivos nomeados pelo slug kebab-case. Datas em ISO no frontmatter; a exibição pt-BR ("10 Jun, 2026") é feita por `src/lib/format.ts`. Build valida frontmatter contra o schema Zod em `src/content.config.ts`. Se `isExternal: false`, o build gera automaticamente uma página estática em `/radar/article/<slug>` com o corpo renderizado; se `true`, o card aponta para o `link` externo.

Para insights, mesmo padrão em `src/content/insights/` (sem `type`/`isExternal`/`link`/`source`; tem `duration`).

## Deploy & Preview URLs

Cloudflare em modo *Connect to Git*:

- **Push em `main`** → `npx wrangler deploy` → produção (`gusflopes.dev` + `gusflopes-website.gusflopes86.workers.dev`)
- **Push em outra branch** → `npx wrangler versions upload` → preview em `<hash>-gusflopes-website.gusflopes86.workers.dev`

Cada commit em branch não-produção gera versão nova. Para promover sem merge: dashboard do Worker → *Deployments* → versão → *Deploy*. Detalhes no `README.md`.

## Arquivos importantes

- `src/pages/` — uma `.astro` por rota; importa o componente React e passa props
- `src/layouts/Default.astro` — layout compartilhado (`<head>`, Header, slot, Footer)
- `src/content/` — markdown com frontmatter; schema em `src/content.config.ts`
- `src/components/` — Hero, Themes, Services, LatestContent, NewsletterForm, primitives Radix em `ui/`
- `src/components/pages/` — componentes-página React; recebem dados via props
- `src/config/site.ts` — fonte única de nome, e-mail, socials e newsletter (action do provedor; TODOs pendentes do dono)
- `src/lib/format.ts` — formatação/ordenação de datas ISO em pt-BR
- `src/index.css` — Tailwind 4 source (`@import "tailwindcss"` + `@theme` com font-sans/serif/mono + `@plugin "@tailwindcss/typography"`)
- `astro.config.mjs` — Astro config; `@tailwindcss/vite` plugado; aliases versionados (`vaul@1.1.2 → vaul` etc — herança Figma) ainda existem
- `wrangler.jsonc` — config do Worker Static Assets
- `NEXT_STEPS.md` — iterações futuras (MDX renderizado, cleanup de aliases, imagens otimizadas)

## MCP Server Playwright

Configurado via Docker, no arquivo `.mcp.json` na raiz do repositório (MCP servers escopados ao projeto):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp/playwright"]
    }
  }
}
```

Para automação Playwright: usar o Task tool com `subagent_type: "general-purpose"`. URL local: `http://localhost:3001`.
