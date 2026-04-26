# gusflopes.dev — Website

SPA em Vite + React 18 + Radix UI + Tailwind. Deploy via Cloudflare Workers (Static Assets).

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm build      # gera ./dist
pnpm preview    # serve o build local
```

## Deploy

A Cloudflare está conectada ao repositório (modo *Connect to Git* / Workers). Cada push em `main` dispara um build e deploy automaticamente — sem GitHub Actions, sem secrets.

Preview deploys saem de cada branch/PR.

Deploy manual de emergência (precisa `pnpm wrangler login`):

```bash
pnpm deploy     # build + wrangler deploy
```

## Configuração Cloudflare

O projeto é um **Worker** com Static Assets, configurado por [`wrangler.jsonc`](./wrangler.jsonc):

- `assets.directory: "./dist"` — Vite build output que vai para o edge.
- `assets.not_found_handling: "single-page-application"` — paths não encontrados servem `index.html` com 200, fazendo o `BrowserRouter` resolver `/radar`, `/insights` etc. no client.

Sem código de Worker (`main`), apenas assets estáticos. Se quiser adicionar API/SSR no futuro, é só criar `src/worker.ts` e referenciar em `main` no `wrangler.jsonc`.

## Setup inicial (uma vez só)

1. **Criar projeto Workers** — dashboard Cloudflare → *Workers & Pages* → *Create* → *Import a repository* → selecionar este repo. Build command: `pnpm build`. Deploy command: `npx wrangler deploy` (padrão).
2. **Custom domain** — no Worker → *Settings* → *Domains & Routes* → *Add* → *Custom domain* → `gusflopes.dev` (e `www.gusflopes.dev`). A Cloudflare reescreve os DNS records automaticamente.

## Migrar para deploy via GitHub Actions (opcional, no futuro)

Há um workflow de exemplo em `.github/workflows-drafts/deploy.yml` para o caso de querer rodar testes/lint antes de cada deploy. Para ativar:

1. Mover para `.github/workflows/deploy.yml`.
2. Adicionar secrets no repo: `CLOUDFLARE_API_TOKEN` (com permissão `Workers Scripts: Edit`) e `CLOUDFLARE_ACCOUNT_ID`.
3. No dashboard Workers, desconectar o Git para evitar deploys duplicados (o Worker continua existindo, agora alimentado pelo workflow).
