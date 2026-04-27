# Launch Readiness — gusflopes.dev

**Status:** design proposto, aguardando aprovação para detalhamento de implementação
**Data:** 2026-04-26
**Autor:** Gustavo Flopes (com Claude)
**Documento de referência prévio:** `NEXT_STEPS.md`

---

## 1. Objetivo

Tornar o site `gusflopes.dev` "pronto" no sentido específico do owner, em três camadas:

1. **Vitrine para cursos e mentorias** (prioridade primária). Alguém que chega via LinkedIn ou referência precisa sair com a impressão certa e ter caminhos claros para entrar na lista de espera.
2. **Consolidação técnica** que sustente a cadência de **um post por semana** sem fricção (escrever em Obsidian/VS Code, exportar markdown, publicar via PR).
3. **Base para lançamento ativo no futuro**, quando houver massa crítica de conteúdo (~10 artigos). O lançamento em si — campanha em LinkedIn, X, newsletter blast — fica fora deste spec.

Este spec **não** descreve uma vitrine de consultoria B2B tradicional (cases, depoimentos, formulário de briefing pesado). O modelo é educator/creator: produto principal é educação, conteúdo constrói autoridade que justifica o produto.

## 2. Estado atual

Site Astro 6 + React islands, deploy via Cloudflare Workers Static Assets. Migração de Vite/React-Router → Astro file-based concluída (Fases 1-5 do `NEXT_STEPS.md`). Sete rotas funcionais; conteúdo das coleções `radar` e `insights` com frontmatter real mas body em placeholder. `RadarArticlePage` e `ArticlePage2` renderizam o mesmo conteúdo DDD hardcoded ignorando o `id`. Sem favicon, sem OG tags, sem analytics, sem captura de leads funcional.

Detalhamento do gap em `NEXT_STEPS.md` (11 itens) + audit complementar:

- **Adicional 1:** zero analytics no site embora `Privacy.astro` cite Google Analytics
- **Adicional 2:** sem `sitemap.xml` nem `robots.txt`
- **Adicional 3:** sem favicon mesmo em `public/` (404 em todas as rotas)
- **Adicional 4:** newsletter forms em Hero, Footer e (futuro) páginas produto não têm provedor configurado
- **Adicional 5:** todos os 12 arquivos `.md` de conteúdo têm body placeholder

## 3. Decisões arquiteturais

### 3.1 Lead capture — Cloudflare-native

**Escolha:** Resend (envio de email) + Cloudflare D1 (storage de leads) + endpoint Astro server (`src/pages/api/subscribe.ts`).

**Por quê:** owner quer controle dos dados para usar com IA depois (segmentação, análise, automação). Substack foi rejeitado porque fragmentaria o site. Provedores hospedados (ConvertKit, Buttondown) foram preteridos pelo mesmo motivo.

**Implicação principal:** ativa a **Fase 6** do `NEXT_STEPS.md` com caso de uso real. Adiciona `@astrojs/cloudflare` adapter e muda o output do Astro de `static` para `server` (ou `hybrid` se quiser pre-render seletivo, ver §5.2).

**Schema D1 inicial:**

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  source TEXT NOT NULL,           -- 'footer' | 'hero' | 'mentoria' | 'cursos'
  tag TEXT,                       -- 'newsletter' | 'mentoria-turma-1' | 'curso-turma-1'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash TEXT,                   -- SHA-256(IP + salt) para análise sem armazenar IP cru
  user_agent TEXT,
  confirmed_at TEXT               -- preenchido quando double-opt-in confirma
);
CREATE UNIQUE INDEX idx_leads_email_tag ON leads(email, tag);
```

`source` permite analítica de origem ("quantos leads vieram do footer da home?"). `tag` permite segmentação na hora de mandar email ("quem está na lista da turma 1 de mentoria"). A constraint composta `(email, tag)` evita duplicatas no mesmo bucket mas permite o mesmo email assinar newsletter geral E lista de mentoria.

### 3.2 Analytics — CWA agora, GA4 depois

Cloudflare Web Analytics no `Default.astro` (script no `<head>`) sem cookie banner. Métricas suficientes para fase atual: pageviews, top pages, referrers, países.

Migração para GA4 quando precisar de eventos custom (cliques em CTA, scroll depth, conversion funnel). Junto com GA4 vem cookie banner LGPD — `Privacy.astro` já cita GA, então a migração é "ligar o que está documentado" + adicionar banner.

### 3.3 Render de artigos — `@astrojs/mdx`

`pnpm astro add mdx`. Migrar `src/content/{radar,insights}/*.md` para `.mdx` quando o body começar a ter componentes (call-out, embed, code blocks customizados). Migração pode ser preguiçosa: arquivos .md continuam funcionando, só os que precisarem de componentes viram .mdx.

`RadarArticlePage.tsx` e `ArticlePage2.tsx` viram **shells** que recebem o conteúdo via `<slot />` da página Astro:

```astro
---
// src/pages/radar/article/[id].astro
const entry = await getEntry('radar', id);
const { Content } = await render(entry);
---
<Default title={entry.data.title}>
  <RadarArticleShell entry={entry.data} client:load>
    <Content />
  </RadarArticleShell>
</Default>
```

A interatividade (botão Copy code) é extraída para um island menor `<CopyCodeButton>` se precisar reagir; o resto do shell pode ser Astro puro.

### 3.4 Workflow editorial

Owner escreve em Obsidian ou VS Code. Saída desejada: arquivo `.md` ou `.mdx` no diretório certo da coleção, com frontmatter validado pelo schema Zod existente em `src/content.config.ts`.

Não vamos automatizar bridge Obsidian↔repo neste spec. Workflow manual:

1. Escreve em Obsidian/VSC
2. Copia para `src/content/insights/<slug>.md`
3. Adiciona frontmatter (template em `docs/superpowers/templates/insight.md` — criar na Onda 4)
4. `pnpm dev` valida; `pnpm build` confirma; commit + push
5. Cloudflare Workers Static Assets faz o deploy

## 4. Plano em 6 ondas

Cada onda é independente o suficiente para ser implementada como um plan separado (via `writing-plans` depois). Gates entre ondas garantem que o site **nunca regride** de uma fase pra outra — se a Onda 3 quebrar, o site permanece no estado pós-Onda 2 funcional.

### Onda 1 — Foundation técnico

**Estimativa:** 1-2 dias de trabalho focado.

**Entregáveis:**

1. **SEO e meta tags** parametrizáveis no `Default.astro`:
   - Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
   - Twitter Card (`twitter:card`, `twitter:title`, `twitter:image`)
   - Canonical URL (derivado de `Astro.url.pathname`)
   - JSON-LD `Person` (sitewide) e `Article` (por artigo, derivado do frontmatter)
   - `<html lang="pt-BR">` (já existe, manter)
   - Defaults com fallback para layout-level se a página não fornecer

2. **Favicon e ícones:**
   - `public/favicon.svg` (SVG primário)
   - `public/favicon.ico` (fallback Safari/legacy)
   - `public/apple-touch-icon.png` (180x180)
   - Links no `<head>` do `Default.astro`
   - Design: pode ser monograma "GF" ou marca simples; placeholder aceitável, swap depois

3. **Sitemap e robots:**
   - `pnpm astro add sitemap` (`@astrojs/sitemap`)
   - `astro.config.mjs` ganha integração + `site: 'https://gusflopes.dev'`
   - `public/robots.txt` aponta para `/sitemap-index.xml`

4. **MDX rendering (estrutura, sem migrar conteúdo ainda):**
   - `pnpm astro add mdx`
   - `src/pages/radar/article/[id].astro` usa `render(entry)` em vez de passar id estático
   - `RadarArticlePage.tsx` refatorado para shell + slot
   - Refactor equivalente para `ArticlePage2.tsx` fica na **Onda 4** porque a rota `/insights/article` ainda é fixa (vira dinâmica na Onda 4 quando conteúdo real entrar)
   - **Validação de pipeline:** 1 artigo da coleção `radar` ganha body real (smoke test do MDX render). NÃO é a entrega de conteúdo — é só prova de que o pipeline funciona end-to-end. A produção em escala (3 insights + 2 radar) é entregável da Onda 4.

5. **Cleanup de aliases versionados:**
   - Codemod com `find + sed` em `src/components/ui/*.tsx`: `from '<pkg>@<version>'` → `from '<pkg>'`
   - Remove o bloco de ~35 aliases em `astro.config.mjs`
   - Build precisa passar

6. **Cloudflare Web Analytics:**
   - Script CWA no `<head>` do `Default.astro` (token via env ou hardcoded — token CWA não é secret)
   - Verificar que dashboard começa a registrar

7. **Avatar do autor:**
   - `src/assets/author.jpg` (placeholder por enquanto — gradient atual ou foto stub)
   - Substituir o `<div className="bg-gradient-to-tr ...">` em `RadarArticlePage` e `ArticlePage2`
   - TODO técnico documentado para swap quando owner fornecer foto real

**Gate Onda 1 → Onda 2:**

- `pnpm build` sem warnings
- Lighthouse SEO ≥ 90 em todas as 7 rotas
- Open Graph válido (testar em opengraph.xyz pelo menos `/`, `/radar`, `/insights`, e um artigo)
- `sitemap-index.xml` lista todas as 7+ rotas
- Favicon aparece (sem 404 em DevTools Network)
- CWA dashboard mostra ao menos 1 pageview

---

### Onda 2 — Infra lead capture

**Estimativa:** 2-3 dias.

**Entregáveis:**

1. **Cloudflare adapter:**
   - `pnpm astro add cloudflare`
   - `astro.config.mjs`: `output: 'server'` (ou `hybrid` se decidirmos pre-render rotas estáticas — ver §5.2)
   - `wrangler.jsonc`: `main` aponta para o entry SSR gerado pelo adapter; `compatibility_flags: ["nodejs_compat"]` se necessário
   - Build local + `wrangler dev` confirmando que rotas estáticas continuam servindo

2. **D1 binding:**
   - `wrangler.jsonc` ganha `d1_databases` com binding `LEADS_DB`
   - `pnpm wrangler d1 create gusflopes-leads`
   - `migrations/0001_create_leads.sql` (schema da §3.1)
   - `pnpm wrangler d1 migrations apply gusflopes-leads --local` e `--remote`

3. **Resend integration:**
   - `pnpm add resend`
   - `wrangler secret put RESEND_API_KEY` (documentado, **owner pluga depois** — não bloqueia implementação)
   - `src/lib/email.ts` com função `sendConfirmation(email, tag)` usando Resend SDK
   - Template HTML mínimo (markdown→HTML inline) para email de confirmação

4. **Endpoint `/api/subscribe`:**
   - `src/pages/api/subscribe.ts` POST
   - Body validation com Zod (`email`, `source`, `tag`)
   - Honeypot field (`hp_field` deve vir vazio; preenchido = bot, retorna 200 silencioso)
   - Rate limit por IP via Cloudflare KV ou CF Turnstile (decidir na implementação; Turnstile mais robusto, KV mais simples)
   - Insert em D1 com `INSERT OR IGNORE` (constraint composta cuida de duplicata)
   - Dispara `sendConfirmation` se insert criou linha nova
   - Resposta JSON `{ ok: true }` ou `{ ok: false, error: '...' }`

5. **SubscribeForm island:**
   - `src/components/SubscribeForm.tsx`
   - Props: `tag`, `source`, `placeholder`, `cta` (texto do botão)
   - Estados: idle | loading | success | error
   - Mensagens em pt-BR
   - Honeypot field renderizado como hidden + `tabindex={-1}` + `autocomplete="off"`

6. **Conectar Newsletter existente:**
   - `Hero.tsx` newsletter usa `<SubscribeForm tag="newsletter" source="hero" />`
   - `Footer.tsx` newsletter usa `<SubscribeForm tag="newsletter" source="footer" />`

**Gate Onda 2 → Onda 3:**

- `curl -X POST` em `/api/subscribe` com body válido retorna 200 e cria linha em D1 (`pnpm wrangler d1 execute gusflopes-leads --command "SELECT * FROM leads"`)
- Mesmo curl com payload duplicado retorna 200 mas não cria linha nova
- Honeypot preenchido retorna 200 sem inserção
- Form do Footer e do Hero disparam o endpoint com `source` correto
- Email de confirmação chega (após plug do RESEND_API_KEY pelo owner — gate parcial: estrutura validada mesmo sem email real)

---

### Onda 3 — Páginas produto (`/mentoria` e `/cursos`)

**Estimativa:** 1 dia (após Onda 2 estar pronta).

**Entregáveis:**

1. **`/mentoria`:**
   - `src/pages/mentoria.astro`
   - Componente island `src/components/pages/MentoriaPage.tsx`
   - Estrutura proposta: hero (headline + subheadline + CTA), "para quem é" (3-4 perfis), "como funciona" (3 passos), bloco de lista de espera (`<SubscribeForm tag="mentoria-turma-1" source="mentoria" cta="Quero saber da próxima turma" />`), FAQ curto (3-5 perguntas)
   - **Copy:** owner quer validar variantes (ver §6)

2. **`/cursos`:**
   - `src/pages/cursos.astro`
   - Componente island `src/components/pages/CursosPage.tsx`
   - Estrutura: hero, "o que vai cobrir" (bullets), "para quem é", lista de espera (`tag="curso-turma-1"`)
   - Mais minimalista que `/mentoria` porque produto está mais cedo no funil
   - **Copy:** mesmo tratamento de variantes

3. **Header atualizado:**
   - `Header.tsx` ganha 2 itens novos no nav: "Mentoria" e "Cursos"
   - Botão "Contato" do Header continua sem destino — fica para Onda 5 (decisão simples: `mailto:` ou Calendly)

4. **Navegação mobile:** confirmar que menu mobile (se existir) ganha os dois itens.

**Gate Onda 3 → Onda 4:**

- `/mentoria` e `/cursos` acessíveis e renderizam sem erro
- Submit de email fake em ambas as páginas cria linha em D1 com `tag` correta
- Header tem 2 itens novos visíveis em desktop e mobile
- Lighthouse SEO ≥ 90 nas duas páginas novas

---

### Onda 4 — Conteúdo inicial

**Estimativa:** 1 semana de produção real (depende do owner escrever).

**Entregáveis:**

1. **3 artigos `insights` com conteúdo real:**
   - Owner traz rascunhos do Obsidian/VSC
   - Frontmatter completo (title, excerpt, date, duration, category, type, isExternal=false, link, source, image)
   - Body em MDX se houver componentes (call-out, blocos especiais); markdown puro está OK
   - `image:` pode usar Unsplash inicialmente (otimização vai pra Onda 6)

2. **2 itens `radar` com link externo real:**
   - `isExternal: true`, `link: <url-externa>`
   - Frontmatter mínimo + 1-2 parágrafos de comentário curatorial
   - Demonstra o uso "curadoria" da coleção

3. **`/insights/article` migra pra dinâmica:**
   - `src/pages/insights/article.astro` → `src/pages/insights/article/[id].astro`
   - `getStaticPaths()` deriva da coleção `insights` filtrando `isExternal: false`
   - Links em `InsightsPage.tsx` mudam de `href="/insights/article"` (fixo) para `href={`/insights/article/${article.id}`}`
   - `ArticlePage2.tsx` recebe entry via slot (mesma refactor da Onda 1 para `RadarArticlePage`)

4. **Categorias revisadas:**
   - Schema Zod em `src/content.config.ts` lista `Arquitetura, .NET, DevOps, Carreira, IA`
   - Confirmar com owner se categoriais ainda fazem sentido para os 3+2 artigos novos
   - Se ajustar, atualizar schema + migrar arquivos existentes (frontmatter)

5. **Template de artigo:**
   - `docs/superpowers/templates/insight.md` — frontmatter padrão + estrutura mínima sugerida (intro, dev, conclusão com CTA)
   - `docs/superpowers/templates/radar.md` — mesma coisa para itens curados

**Gate Onda 4 → Onda 5:**

- 3 artigos insights publicados em produção, acessíveis via `/insights/article/<id>`
- 2 itens radar publicados, links externos funcionam
- `sitemap-index.xml` em produção lista todas as URLs novas
- OG tag de cada artigo mostra imagem + título correto (via opengraph.xyz)

---

### Onda 5 — Polimento UX

**Estimativa:** 1 dia.

**Entregáveis:**

1. **Code copy real:**
   - `RadarArticlePage` e `ArticlePage2` (ou o `<CopyCodeButton>` extraído na Onda 1)
   - `await navigator.clipboard.writeText(snippet)` antes do `setCopied(true)`
   - Fallback para browsers antigos: `document.execCommand('copy')` em `<textarea>` invisível

2. **Share via Web Share API:**
   - Se `navigator.share` disponível: usa API nativa (mobile e Safari)
   - Fallback: copia URL para clipboard com feedback visual
   - Bookmark **removido** (não vale o esforço sem persistência server-side)

3. **Botão "Contato" do Header:**
   - `<a href="mailto:gustavo@gusflopes.dev">` (decisão simples por agora)
   - Calendly entra na Onda 6 quando primeira turma de mentoria fechar

4. **Social URLs reais:**
   - `Footer.tsx`: substituir os 4 `href="#"` por:
     - LinkedIn: `https://www.linkedin.com/in/gusflopes/`
     - GitHub: `https://github.com/gusflopes`
     - YouTube: `https://www.youtube.com/@hubdev-tech`
     - Twitter/X: `https://x.com/gusflopes`
   - Considerar adicionar Substack: `https://substack.com/@gusflopes`
   - `RadarArticlePage` autor footer: mesmas URLs

5. **Paginação fake do `/insights`:**
   - Remover (com 6 artigos não justifica)
   - Quando atingir 12+ artigos, implementar via query param + `client:load` real

**Gate Onda 5 → Onda 6:**

- Zero `href="#"` em produção (`grep -r 'href="#"' src/` retorna vazio)
- Console limpo em todas as 9 rotas (7 originais + `/mentoria` + `/cursos`)
- Code copy testado em Chrome e Safari

---

### Onda 6 — Pós-launch (sem deadline)

Itens que melhoram o site mas não bloqueiam "pronto":

1. Migração CWA → GA4 + cookie banner LGPD (Privacy.astro já cita GA, alinhar)
2. `/sobre` página própria (bio expandida, foto, CV, links)
3. Calendly direto em `/mentoria` quando primeira turma fechar (ou agendamento próprio via Cal.com self-hosted)
4. Imagens Unsplash → `src/assets/` com `image()` helper do Astro (otimização nativa, srcset, lazy loading controlado)
5. Schema.org `BreadcrumbList` em páginas internas
6. Reuso: bot que pega novos artigos publicados e prepara excerpt + link para newsletter blast
7. **Foto real do autor** (substitui placeholder da Onda 1)

## 5. Decisões pendentes (a resolver durante implementação)

### 5.1 Domínio do email transacional

Resend exige domain verification. Owner precisa decidir se usa subdomínio (`mail.gusflopes.dev`) ou domínio raiz (`gusflopes.dev`). Resolver na Onda 2.

### 5.2 `output: server` vs `output: hybrid`

`server` torna toda rota SSR por padrão; `hybrid` permite pre-render em rotas com `export const prerender = true`. Como 95% do site é estático, `hybrid` é provavelmente melhor — só `/api/subscribe` precisa ser SSR. Confirmar com benchmark de cold start na Onda 2.

### 5.3 Anti-spam: KV vs Turnstile

KV: 1-3 linhas de código, suficiente para volume baixo. Turnstile: requer widget no client, mais robusto, gratuito mas adiciona overhead. Decidir na Onda 2 baseado em quanto spam aparece nos primeiros dias.

### 5.4 Cookie banner para CWA

CWA não usa cookies por padrão (privacy-friendly), mas owner pode querer banner mínimo de "este site usa CWA, sem cookies, dados anônimos" para conformidade explícita. Decidir antes de Onda 2 ir pra produção.

### 5.5 Single vs double opt-in

Schema D1 inclui `confirmed_at` antecipando double-opt-in (lead recebe email, clica, vira `confirmed`). Isso é boa prática de email marketing (reduz bounce, melhora reputação do domínio Resend) mas adiciona complexidade: rota `/api/confirm/<token>`, geração de token, expiração.

**Recomendação para MVP:** começar com **single opt-in** — `confirmed_at = created_at` no insert, sem flow de confirmação. Migrar para double opt-in na Onda 6 quando volume justificar. Coluna fica no schema desde o início para não migrar depois.

Decidir ANTES da Onda 2 implementar; afeta o template do email de confirmação (single = "obrigado por assinar", double = "clique aqui para confirmar").

## 6. Geração de copy paralela (variantes em worktrees)

Para `/mentoria` e `/cursos`, copy é o único impedimento real do owner. Estratégia: gerar 2-3 variantes em paralelo, owner escolhe.

**Convenção:** `.worktrees/<topic>-<variant>/` na raiz do repo. Adicionar `.worktrees/` ao `.gitignore`.

**Mecanismo:** `Agent` tool com `isolation: "worktree"` cria worktree gerenciado automaticamente; várias agents na mesma mensagem geram variantes simultâneas. Cada agent retorna o path do worktree.

**Variantes a gerar para `/mentoria`** (exemplo):

- **V1 — Acolhedor/peer:** "Acompanhamento técnico para quem está em transição pra senior/staff. Não é mentor que sabe tudo, é peer que já passou pela curva."
- **V2 — Direto/resultado:** "Mentoria 1-on-1 focada em destravar a próxima promoção. 8 sessões, plano individual, exercícios práticos."
- **V3 — Aspiracional/identidade:** "Para devs que querem ir além do código: arquitetura, liderança técnica, posicionamento profissional."

Owner valida em PR review (cada variante é um PR ou um diff anotado).

## 7. Plano de produção de conteúdo

Documento separado, mas core está aqui para fechar o spec.

### 7.1 Cadência

**Meta:** 1 post `insights` por semana + 2-3 itens `radar` (curadoria) por semana. Radar é barato (~30min: link + 2 parágrafos de comentário); insights é o esforço pesado (3-6h por artigo).

### 7.2 Pipeline editorial

```
[Ideia em Obsidian] → [Rascunho em Obsidian/VSC] → [Revisão self/Claude] →
[Export markdown] → [Frontmatter validado] → [PR + preview Cloudflare] →
[Merge] → [Deploy automático] → [Newsletter blast no domingo seguinte]
```

Newsletter blast inicial = manual (semana de calibração); pode automatizar na Onda 6 depois que tiver volume.

### 7.3 Inventário de temas (próximos 3 artigos)

Owner lista temas brutos (Obsidian/Notion). Dado o foco do produto (mentoria para devs sêniores em transição), priorizar artigos que:

- Demonstram autoridade técnica em um nicho específico (ex: arquitetura .NET, DDD aplicado, observability)
- Conversam com a dor da audiência alvo (ex: "como liderar tecnicamente sem virar gerente", "quando refatorar vs reescrever")
- Têm CTA natural para mentoria/curso ("se isso ressoou, entre na lista de espera de [produto]")

**Categorias atuais no schema** (`src/content.config.ts`): `Arquitetura`, `.NET`, `DevOps`, `Carreira`, `IA`.

**Categorias propostas pelo owner** (a revisar em detalhe na Onda 4):

- Arquitetura de Software *(rename de "Arquitetura")*
- DevOps *(mantém)*
- AI Engineering *(rename de "IA", posicionamento mais técnico)*
- Product Engineering *(novo)*
- Domain Driven Design *(novo)*
- .NET *(mantém)*
- Engenharia de Dados *(novo, candidato — owner ainda em dúvida)*

`Carreira` sai da lista (ou vira tag/cross-cutting em vez de categoria principal). Mudança de schema requer migração dos 12 arquivos existentes (`category:` no frontmatter) ou aceite de que aqueles eram placeholders e podem ser deletados/reescritos junto com a entrega de conteúdo real.

Decisão final na **Onda 4**, antes do owner exportar os primeiros rascunhos.

### 7.4 Anatomia do artigo padrão

```markdown
---
title: "..."
excerpt: "..." # 140-200 chars, vira meta description
date: "YYYY-MM-DD"
duration: "Xmin"
category: "Arquitetura" | ".NET" | "DevOps" | "Carreira" | "IA"
type: "article"
isExternal: false
link: "/insights/article/<slug>"
source: "Local"
image: "https://images.unsplash.com/..." # Onda 6: trocar por src/assets/
---

# Hook (1-2 parágrafos)

Por que esse artigo existe. Qual a dor.

## Desenvolvimento (corpo do artigo)

Substância. 1500-2500 palavras alvo. Bullets, code blocks, exemplos concretos.

## Fechamento

Síntese + CTA suave: "Se você está [situação alvo], entrei a lista de espera
de [produto]. Vou abrir [N] vagas em [trimestre]."
```

### 7.5 Distribuição

- **Semanas 1-4 pós-launch:** sem divulgação ativa. Site é referência ("manda link" quando alguém pergunta).
- **Semanas 5-12:** newsletter para a lista capturada. Sem post em LinkedIn ainda.
- **Semana 12+ (massa crítica de ~10 artigos):** começa a postar trechos no LinkedIn semanalmente. Twitter opcional.

### 7.6 Métricas de sucesso

- **Leads capturados/semana** (D1 query): primeiro KPI. Meta inicial: 5 leads/semana até Sprint 4 pós-launch.
- **Pageviews** (CWA): contexto, não meta.
- **Conversão por origem** (D1 com `source`): qual página/posição converte melhor.
- **Crescimento da lista de espera por produto** (D1 com `tag`): feedback de demanda — se `mentoria-turma-1` cresce mais rápido que `curso-turma-1`, prioriza abrir mentoria primeiro.

## 8. Pendências explícitas do owner

Não-bloqueantes (preferência expressa em 2026-04-26):

| Item | Onda | Estado | Como destrava |
|---|---|---|---|
| Foto real do autor | 1 | Placeholder gradient/foto stub | Owner envia `author.jpg`, swap em PR de 1 linha |
| Resend API key | 2 | Implementação completa, secret vazia | Owner cria conta, faz `wrangler secret put RESEND_API_KEY` |
| Resend domain verification | 2 | Pendente | Owner adiciona DNS records que Resend dashboard fornece |
| Copy `/mentoria` e `/cursos` | 3 | Variantes geradas em worktrees | Owner escolhe variante em PR review |
| Rascunhos dos 3 artigos | 4 | Em Obsidian/VSC do owner | Owner exporta MD, cola em `src/content/insights/<slug>.md` |
| Decisão Calendly | 6 | Mailto provisório na Onda 5 | Owner decide ferramenta + cria conta |

## 9. Out of scope deste spec

- Migração para framework diferente (Next.js, etc.)
- E-commerce/Stripe (cursos serão pagos via plataforma externa quando lançarem — Hotmart, Kiwify, Ticto, etc.)
- Internacionalização (i18n EN/PT) — owner decidiu pt-BR para SEO
- Sistema de comentários nos artigos
- Search interno
- RSS feed (pode entrar na Onda 6 se demanda aparecer; `@astrojs/rss` é trivial)
- Bridge automatizado Obsidian↔repo

## 10. Próximos passos

1. **Owner aprova este spec** (revisão deste documento)
2. **Invocar `writing-plans`** para detalhar Onda 1 em plano de implementação executável
3. Implementar Onda 1; ao gate, mover para plano da Onda 2; e assim por diante
4. Specs/plans separados para Onda 2-6 conforme cada uma chega na vez
