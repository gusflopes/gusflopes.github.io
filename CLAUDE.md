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
| `/insights/article` | `src/pages/insights/article.astro` | `ArticlePage2` |
| `/privacy` | `src/pages/privacy.astro` | `PrivacyPolicyPage` |
| `/terms` | `src/pages/terms.astro` | `TermsOfUsePage` |

`Header` (recebe `pathname` via prop) e `Footer` ficam no layout `src/layouts/Default.astro`. Header se auto-esconde em páginas de artigo (`/radar/article/*`, `/insights/article`).

`/radar/article/[id]` é dinâmica: `getStaticPaths()` deriva os IDs da coleção `radar`, filtrando `isExternal: false`. Hoje gera 3 páginas (1, 5, 6).

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
date: "..."
duration: "..."
category: "Arquitetura" | ".NET" | "DevOps" | "Carreira" | "IA"
type: "article" | "video"
isExternal: false
link: "/radar/article/<id>"
source: "Local"
image: "https://..."
---' > src/content/radar/<id>.md
```

Build valida frontmatter contra o schema Zod em `src/content.config.ts`. Se `isExternal: false`, o build gera automaticamente uma página estática em `/radar/article/<id>`.

Para insights, mesmo padrão em `src/content/insights/`.

## Deploy & Preview URLs

Cloudflare em modo *Connect to Git*:

- **Push em `main`** → `npx wrangler deploy` → produção (`gusflopes.dev` + `gusflopes-website.gusflopes86.workers.dev`)
- **Push em outra branch** → `npx wrangler versions upload` → preview em `<hash>-gusflopes-website.gusflopes86.workers.dev`

Cada commit em branch não-produção gera versão nova. Para promover sem merge: dashboard do Worker → *Deployments* → versão → *Deploy*. Detalhes no `README.md`.

## Arquivos importantes

- `src/pages/` — uma `.astro` por rota; importa o componente React e passa props
- `src/layouts/Default.astro` — layout compartilhado (`<head>`, Header, slot, Footer)
- `src/content/` — markdown com frontmatter; schema em `src/content.config.ts`
- `src/components/` — Hero, Themes, Services, LatestContent, primitives Radix em `ui/`
- `src/components/pages/` — componentes-página React; recebem dados via props
- `src/index.css` — Tailwind 4 source (`@import "tailwindcss"` + `@theme` com font-sans/serif/mono)
- `astro.config.mjs` — Astro config; `@tailwindcss/vite` plugado; aliases versionados (`vaul@1.1.2 → vaul` etc — herança Figma) ainda existem
- `wrangler.jsonc` — config do Worker Static Assets
- `NEXT_STEPS.md` — iterações futuras (MDX renderizado, cleanup de aliases, imagens otimizadas)

## MCP Server Playwright

Configurado via Docker:

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
