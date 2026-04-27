# gusflopes.dev — Website

Site em **Astro 6** com React 18 islands (Radix UI + Tailwind 4 + framer-motion). Roteamento file-based; conteúdo em Content Collections com schema Zod. Deploy via Cloudflare Workers (Static Assets).

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm build      # gera ./dist
pnpm preview    # serve o build local
```

## Deploy

A Cloudflare está conectada ao repositório (modo *Connect to Git*). Comandos rodados pela build platform da Cloudflare:

| Branch | Comando | Efeito |
|---|---|---|
| `main` (produção) | `npx wrangler deploy` | Sobe e **promove** para produção (URL custom + worker padrão) |
| qualquer outra branch | `npx wrangler versions upload` | Sobe uma **versão de preview** sem promover |

Build command em ambos os casos: `pnpm run build`.

### URLs

- **Produção**: `https://gusflopes.dev` (custom domain) e `https://gusflopes-website.gusflopes86.workers.dev`.
- **Preview de branches/PRs**: `https://<version-hash>-gusflopes-website.gusflopes86.workers.dev` — cada push em uma branch não-produção gera uma versão nova com URL única (hash dos primeiros caracteres do ID da versão).

### Fluxo de preview por PR

1. `git checkout -b minha-feature` → trabalho local → `git push -u origin minha-feature`.
2. Cloudflare detecta o push, roda `pnpm build`, depois `wrangler versions upload`.
3. Sai uma URL `<hash>-gusflopes-website.gusflopes86.workers.dev` — visível no dashboard do Worker (*Deployments*) e, se a integração GitHub estiver instalada, comentada automaticamente no PR.
4. Cada commit novo na branch gera uma versão nova com hash novo (a anterior continua acessível).
5. Quando der merge em `main`, a Cloudflare roda `wrangler deploy` e promove para produção.

Para promover uma versão de preview sem merge (rollback rápido, hotfix em outra branch): no dashboard do Worker → *Deployments* → escolher a versão → *Deploy*.

### Deploy manual de emergência

```bash
pnpm wrangler login    # uma vez por máquina
pnpm deploy            # build + wrangler deploy (vai direto para produção)
```

## Configuração Cloudflare

O projeto é um **Worker** com Static Assets, configurado por [`wrangler.jsonc`](./wrangler.jsonc):

- `assets.directory: "./dist"` — Astro build output.
- `assets.not_found_handling: "single-page-application"` — paths não encontrados servem `index.html` com 200, fazendo o `BrowserRouter` resolver `/radar`, `/insights` etc. no client.
- `observability.logs.enabled: true` — logs ativos (sem traces). Como o Worker não tem `main`/fetch handler, hoje captura pouca coisa; só fica útil se um dia adicionar lógica de Worker.

Sem código de Worker (`main`), apenas assets estáticos. Para adicionar API/SSR no futuro, é só criar `src/worker.ts` e referenciar em `main` no `wrangler.jsonc`.

### Settings do projeto no dashboard (referência)

- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`
- Non-production branch deploy command: `npx wrangler versions upload`
- Path: `/`

## Setup inicial (uma vez só)

1. **Criar projeto Workers** — dashboard Cloudflare → *Workers & Pages* → *Create* → *Import a repository* → selecionar este repo. Build command: `pnpm build`. Deploy command padrão (`npx wrangler deploy`).
2. **Custom domain** — no Worker → *Settings* → *Domains & Routes* → *Add* → *Custom domain* → `gusflopes.dev` (e `www.gusflopes.dev` se quiser). A Cloudflare reescreve os DNS records automaticamente.

## Migrar para deploy via GitHub Actions (opcional, no futuro)

Há um workflow de exemplo em `.github/workflows-drafts/deploy.yml` para o caso de querer rodar testes/lint antes de cada deploy. Para ativar:

1. Mover para `.github/workflows/deploy.yml`.
2. Adicionar secrets no repo: `CLOUDFLARE_API_TOKEN` (com permissão `Workers Scripts: Edit`) e `CLOUDFLARE_ACCOUNT_ID`.
3. No dashboard Workers, desconectar o Git para evitar deploys duplicados (o Worker continua existindo, agora alimentado pelo workflow).
