# gusflopes.dev — Website

SPA em Vite + React 18 + Radix UI + Tailwind. Deploy via Cloudflare Pages (Connect to GitHub).

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm build      # gera ./dist
pnpm preview    # serve o build local
```

## Deploy

A Cloudflare está conectada ao repositório (modo *Connect to GitHub*). Cada push em `main` dispara um build e deploy automaticamente — sem GitHub Actions, sem secrets.

Preview deploys saem de cada branch/PR.

Deploy manual de emergência (precisa `pnpm wrangler login`):

```bash
pnpm deploy     # build + wrangler pages deploy dist
```

## Setup inicial (uma vez só)

1. **Criar projeto Pages** — dashboard Cloudflare → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → selecionar este repositório.
2. **Configurar build**:
   - Framework preset: *None* (Vite)
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Environment variable: `NODE_VERSION=22` (e opcional `PNPM_VERSION=10`)
3. **Custom domain** — projeto Pages → *Custom domains* → adicionar `gusflopes.dev` (e `www.gusflopes.dev` se quiser). A Cloudflare reescreve os registros DNS, derrubando o apontamento atual pro GitHub Pages.

## SPA fallback

`public/_redirects` mapeia `/*` para `/index.html` (200) para que o `BrowserRouter` resolva rotas como `/radar`, `/insights`, `/privacy` no client.

## Migrar para Direct Upload (opcional, no futuro)

Se um dia precisar rodar testes/lint/build customizado no CI antes do deploy, há um workflow de exemplo em `.github/workflows-drafts/deploy.yml`. Para ativar:

1. Mover para `.github/workflows/deploy.yml`.
2. Adicionar secrets no repo: `CLOUDFLARE_API_TOKEN` (com permissão `Cloudflare Pages: Edit`) e `CLOUDFLARE_ACCOUNT_ID`.
3. No dashboard Pages, desconectar o GitHub para evitar deploys duplicados (o projeto continua existindo, agora alimentado via API pelo workflow).
