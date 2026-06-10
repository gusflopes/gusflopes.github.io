# Próximos passos — pós-evolução de marca (feat/brand-evolution)

Estado das grandes fases:

- [x] **Migração Astro (fases 1–5)** — shell, rotas, Content Collections, Tailwind 4, cleanup
- [x] **Evolução de marca** — conteúdo real, render de markdown, rota dinâmica de insights, SEO/OG/RSS/sitemap, newsletter, socials
- [ ] **Fase 6 (SSR / Edge)** — deliberadamente não executada (ver justificativa no fim deste doc)

---

## Resolvido nesta iteração (verificado no código)

### Conteúdo dos artigos agora é markdown real das coleções

- `src/pages/radar/article/[id].astro` e `src/pages/insights/article/[id].astro` usam `render(entry)` + `<Content />` do Astro, passado como `children` para os shells React (`RadarArticlePage`, `InsightArticlePage`). Nenhum body hardcoded sobrou (`ArticlePage2.tsx` foi deletado). Não foi preciso MDX — `.md` puro com code blocks via Shiki atende.
- Tipografia do body via `@tailwindcss/typography` (`@plugin` em `src/index.css`) com classes `prose prose-invert` customizadas nos shells.

### `/insights/article/[id]` é rota dinâmica

- `src/pages/insights/article.astro` (rota fixa) foi removida; `[id].astro` com `getStaticPaths` derivando da coleção `insights`. Links em `InsightsPage.tsx` apontam para `/insights/article/${article.id}`.

### Conteúdo real nas coleções (Dez/2025 → Jun/2026)

- **Radar**: 12 itens (8 externos com `target="_blank"`, 4 locais que geram página estática).
- **Insights**: 8 artigos autorais com code blocks.
- Schema Zod atualizado em `src/content.config.ts` (data ISO `YYYY-MM-DD`, formatação pt-BR em `src/lib/format.ts`).

### SEO / meta / infraestrutura de descoberta

- `Default.astro`: canonical, Open Graph completo (`og:type=article` + `article:published_time` + `article:author` em artigos), Twitter Card, `theme-color`, `lang="pt-BR"`.
- `public/favicon.svg`, `public/og-default.png` (fallback de OG image), `public/robots.txt`.
- Sitemap via `@astrojs/sitemap` (`site` configurado no `astro.config.mjs`) + `<link rel="sitemap">`.
- RSS em `/rss.xml` (`src/pages/rss.xml.ts`, `@astrojs/rss`): insights + radar locais, ordenado por data, `<language>pt-BR</language>` + `<link rel="alternate">` no layout.

### Newsletter, contato e socials

- `src/config/site.ts` é a fonte única de verdade (site, autor, socials, newsletter).
- `NewsletterForm.tsx` (variantes hero/footer): POST padrão para endpoint embed-subscribe do Buttondown, com honeypot e reset de estado via `pageshow`. Usado no `Hero` e no `Footer`.
- Header "Contato" → `mailto:gustavo@gusflopes.dev`. Footer e author footer dos artigos com GitHub/LinkedIn reais (sem mais `href="#"`); ícones de redes inexistentes (YouTube, Twitter) removidos.
- Share nos artigos: Web Share API com fallback `navigator.clipboard` + feedback "Link copiado". Botão Bookmark e Copy-code fake removidos.

### Paginação fake de `/insights`

- Removida. A página usa busca textual + filtro por categoria client-side; com 8 artigos não há necessidade de paginação real.

---

## Pendências de configuração (bloqueiam funcionalidade, não build)

### 1. Confirmar conta no Buttondown

`src/config/site.ts` aponta para `https://buttondown.com/api/emails/embed-subscribe/gusflopes` (com `TODO` no código). Sem a conta criada com esse username, o submit do form falha. Criar a conta — ou trocar a `action` pelo endpoint do provedor escolhido (o form faz POST padrão com campo `email`).

### 2. Confirmar handle do LinkedIn

`socials.linkedin = "https://www.linkedin.com/in/gusflopes"` é suposição (TODO em `src/config/site.ts`). Confirmar o handle real ou ajustar.

---

## Importante — qualidade que afeta o produto

### 3. Imagens locais otimizadas com `<Image />`

Todas as imagens de conteúdo ainda vêm de `images.unsplash.com` (20 referências no frontmatter; schema usa `z.string().url()`). `ImageWithFallback` é `<img>` puro, sem `loading="lazy"` nem srcset. Caminho: baixar para `src/assets/`, trocar o schema para o helper `image()` do Astro e renderizar com `astro:assets` `<Image />`. Atenção: os cards são React islands — pode exigir pré-otimizar no `.astro` e passar URLs processadas via props.

### 4. Foto real do autor

O author footer de `RadarArticlePage.tsx` (~linha 124) e `InsightArticlePage.tsx` (~linha 122) ainda usa `<div>` com gradient placeholder no lugar do avatar. Adicionar `src/assets/author.jpg` e substituir nos dois shells (e considerar usar também no Hero/seção About).

### 5. OG image própria

`public/og-default.png` existe, mas artigos usam a imagem Unsplash como `og:image`. Considerar OG images geradas por artigo (satori/`astro-og-canvas`) com a identidade da marca (slate-950 + laranja + serif).

### 6. Página `/sobre` dedicada

Nav aponta para `/#about` (seção da home). Uma página própria permite bio expandida, trajetória, foto e JSON-LD `Person` — importante para o posicionamento de especialista. Mesmo raciocínio para `/trabalhe-comigo` (hoje `/#consulting`): landing focada em conversão para consultoria de adoção de IA.

### 7. Copy button em code blocks

Os 8 insights têm code blocks (Shiki, tema default). O botão "copiar" do design antigo era fake e foi removido — vale reintroduzir de verdade: island pequeno (ou script vanilla no shell) que injeta botão de copy em `pre > code`. Aproveitar para alinhar o tema do Shiki à paleta (ex.: `markdown.shikiConfig.theme` no `astro.config.mjs`).

### 8. Dados estruturados (JSON-LD)

Nenhuma página emite JSON-LD. Adicionar `Article` (com author/datePublished) nas páginas de artigo e `Person`/`WebSite` na home — barato e relevante para a estratégia de autoridade.

---

## Cleanup técnico (sem urgência)

### 9. Aliases versionados (herança Figma export)

Continuam: `astro.config.mjs` mantém ~35 aliases `'<pkg>@<versão>' → '<pkg>'`, usados por 41 arquivos em `src/components/ui/*`. Codemod com sed (`'<pkg>@<version>'` → `'<pkg>'`) e apagar o bloco do config.

### 10. Poda de `src/components/ui/`

São 48 primitives, mas o app usa pouquíssimos (button, input e dependências). Remover os não usados reduz superfície de manutenção (e elimina boa parte do item 9 de graça).

### 11. Taxonomia radar × insights

Reavaliar quando o volume crescer: hoje "radar" (curadoria, maioria externa) e "insights" (autoral) estão claros, mas itens locais do radar e insights se sobrepõem conceitualmente. Considerar consolidar em `posts` com `type: article|video|external` se a distinção começar a confundir.

### 12. Páginas de "vibe" opcionais

`/uses`, `/now` — comuns em sites pessoais, opcionais. Só fazer se alimentarem a marca.

---

## Evolução editorial / audiência (próximo ciclo)

- **Página de confirmação/obrigado da newsletter** — hoje o POST cai na página de confirmação do Buttondown; configurar redirect para uma `/obrigado` própria mantém o leitor no site.
- **Arquivo de edições da newsletter** — quando a newsletter tiver edições enviadas, considerar espelhá-las numa rota `/newsletter` (coleção própria ou link para o arquivo do Buttondown).
- **Analytics** — não há nenhum analytics no site. Cloudflare Web Analytics é o caminho de menor atrito (sem cookie banner) para medir o funil conteúdo → assinatura.
- **Cadência de conteúdo** — o pitch promete análise quinzenal; o conteúdo retroativo sustenta isso até Jun/2026. Manter a cadência a partir de agora.

---

## Por que a fase 6 (SSR) continua não feita

O site segue 100% estático (`output: 'static'`). O único form com submit real — newsletter — faz POST direto para o provedor (Buttondown), sem precisar de backend próprio. Adicionar `@astrojs/cloudflare` + `output: "server"` introduziria adaptador SSR, cold start no Worker (versus assets do edge cache) e uma camada de runtime sem benefício atual.

Casos que justificariam revisitar: form de contato/briefing server-side, gated content para assinantes, A/B testing, webhooks. O caminho está pronto: adicionar a integration e mudar o output. O `wrangler.jsonc` já tem `observability.logs.enabled: true` esperando.
