# Instruções para o Projeto gusflopes.dev

Site em **Astro 6** servindo um SPA React 18 (Radix UI + Tailwind 4 + framer-motion). Roteamento client-side com `react-router-dom`. Deploy via Cloudflare Workers (Static Assets).

## Estado atual da arquitetura

A migração para Astro foi **fase 1 (shell)**: Astro substituiu o Vite como build tool, mas o site continua sendo um SPA React montado como island `client:only="react"` numa única página (`src/pages/index.astro`). React Router cuida de todas as rotas no client; o `not_found_handling: "single-page-application"` no Worker faz qualquer URL cair no `index.html` para o roteador resolver.

Próximas fases (per-route Astro pages, Content Collections, Tailwind 4 source-based, SSR opcional) estão mapeadas em [`NEXT_STEPS.md`](./NEXT_STEPS.md).

## Stack

- **Build**: Astro 6.1.x + `@astrojs/react` 5 (porta dev `3001`).
- **UI**: Radix UI primitives + Tailwind 4 (CSS pré-compilado em `src/index.css`) + `lucide-react` para ícones + `framer-motion` para animações.
- **Roteamento**: `react-router-dom` v7 (`BrowserRouter`) — temporário, sairá na fase 2.
- **Deploy**: Cloudflare Workers Static Assets (sem código de Worker, só assets em `./dist`).

## Rotas

Definidas em `src/App.tsx` (consumidas pelo island único em `src/pages/index.astro`):

| Path | Componente |
|---|---|
| `/` | `HomePage` |
| `/radar` | `RadarPage` |
| `/radar/article/:id` | `RadarArticlePage` |
| `/insights` | `InsightsPage` |
| `/insights/article` | `ArticlePage2` |
| `/privacy` | `PrivacyPolicyPage` |
| `/terms` | `TermsOfUsePage` |

`Header` e `Footer` ficam fora das `Routes`. `ScrollToTop` reseta o scroll a cada navegação.

## Comandos úteis

- `pnpm dev` — Astro dev server em `http://localhost:3001`
- `pnpm build` — `astro build` em `./dist`
- `pnpm preview` — serve o build local
- `pnpm deploy` — build + `wrangler deploy` (promove direto para produção, precisa `pnpm wrangler login` antes)

## Deploy & Preview URLs

Cloudflare em modo *Connect to Git*. Fluxo:

- **Push em `main`** → `npx wrangler deploy` → produção (`gusflopes.dev` + `gusflopes-website.gusflopes86.workers.dev`).
- **Push em outra branch** → `npx wrangler versions upload` → preview em `<hash>-gusflopes-website.gusflopes86.workers.dev`.

Cada commit em branch não-produção gera versão nova. Para promover sem merge: dashboard do Worker → *Deployments* → versão → *Deploy*. Detalhes no `README.md`.

## Arquivos importantes

- `src/pages/index.astro` — Astro entry; mounta `<App />` como island
- `src/App.tsx` — `BrowserRouter` + rotas
- `src/components/` — Header, Footer, páginas em `pages/`, primitives Radix em `ui/`
- `src/index.css` — Tailwind 4 pré-compilado (~39KB) + variáveis de tema
- `astro.config.mjs` — Astro config; bloco `vite` mantém aliases versionados (`vaul@1.1.2 → vaul`, etc — herança do export Figma) e aliases de assets `figma:asset/*`
- `wrangler.jsonc` — config do Worker Static Assets
- `NEXT_STEPS.md` — plano das fases 2–6 da migração

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

Para automação Playwright: usar o Task tool com `subagent_type: "general-purpose"`. O agente tem acesso às ferramentas do MCP Playwright via Docker. URL local: `http://localhost:3001`.
