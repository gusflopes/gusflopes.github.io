# Instruções para o Projeto gusflopes.dev

SPA em Vite + React 18 + Radix UI + Tailwind + framer-motion. Roteamento client-side com `react-router-dom` (`BrowserRouter`).

## Stack

- **Build**: Vite 6 + `@vitejs/plugin-react-swc` (porta dev `3001`).
- **UI**: Radix UI primitives + Tailwind (utility classes em `index.css`) + `lucide-react` para ícones + `framer-motion` para animações.
- **Roteamento**: `react-router-dom` v7 (`BrowserRouter`).
- **Deploy**: Cloudflare Workers Static Assets (sem código de Worker, só assets em `./dist`).

## Rotas

Definidas em `src/App.tsx`:

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

- `pnpm dev` — dev server em `http://localhost:3001`
- `pnpm build` — build de produção em `./dist`
- `pnpm preview` — serve o build local
- `pnpm deploy` — build + `wrangler deploy` (promove direto para produção, precisa `pnpm wrangler login` antes)

## Deploy & Preview URLs

A Cloudflare está em modo *Connect to Git*. O fluxo de deploy:

- **Push em `main`** → `npx wrangler deploy` → promove para produção (`gusflopes.dev` + `gusflopes-website.gusflopes86.workers.dev`).
- **Push em qualquer outra branch** → `npx wrangler versions upload` → cria versão de preview com URL `<hash>-gusflopes-website.gusflopes86.workers.dev`.

Cada commit em branch não-produção gera versão nova; PRs recebem comentário automático com a URL via integração GitHub. Para promover uma versão sem merge: dashboard do Worker → *Deployments* → versão → *Deploy*.

Detalhes completos no `README.md`.

## Arquivos importantes

- `src/main.tsx` — entrypoint React (`createRoot(...).render(<App />)`)
- `src/App.tsx` — `BrowserRouter` + rotas
- `src/components/` — Header, Footer, páginas em `pages/`, primitives Radix em `ui/`
- `src/index.css` — Tailwind + variáveis de tema
- `vite.config.ts` — porta 3001, aliases versionados (`vaul@1.1.2 → vaul`, etc — herança do Figma export)
- `wrangler.jsonc` — config do Worker Static Assets (`assets.directory`, `not_found_handling: single-page-application`, observability)
- `public/wallpaper.jpg` — imagem de fundo do hero

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
