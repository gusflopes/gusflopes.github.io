# Próximos passos pós-migração para Astro

Estado da migração:

- [x] **Fase 1** — Astro shell
- [x] **Fase 2** — Per-route Astro pages com islands; `react-router-dom` removido
- [x] **Fase 3** — Content Collections (Zod) para radar e insights
- [x] **Fase 4** — Tailwind 4 source-based via `@tailwindcss/vite`
- [x] **Fase 5** — Cleanup de artefatos legados
- [ ] **Fase 6** — SSR / Edge functions: deliberadamente não executada (sem caso de uso hoje; ver "Por que a fase 6 não foi feita" no fim deste doc)

Tudo testado via build local + Chrome DevTools MCP em todas as 7 rotas. Console limpo. Visual idêntico ao site pré-migração.

A próxima seção lista o que **identifiquei navegando o site real**, ordenado por criticidade.

---

## Crítico — funcionalidade quebrada ou incompleta

### 1. Conteúdo dos artigos é hardcoded placeholder

`src/components/pages/RadarArticlePage.tsx` e `src/components/pages/ArticlePage2.tsx` renderizam **o mesmo conteúdo "Domain-Driven Design"** independente de qual artigo o usuário clicou. O `id` que o componente recebe é literalmente ignorado para o body.

**O que precisa:**

1. Adicionar `@astrojs/mdx` (`pnpm astro add mdx`).
2. Renomear `src/content/{radar,insights}/*.md` para `*.mdx` e mover o conteúdo (`<p>`, `<h2>`, `<blockquote>`, blocos de código) para o body de cada arquivo.
3. Em `src/pages/radar/article/[id].astro`:
   ```astro
   ---
   const entry = await getEntry('radar', id);
   const { Content } = await entry.render();
   ---
   <Default title={entry.data.title}>
     <ArticleShell entry={entry.data} client:load>
       <Content />
     </ArticleShell>
   </Default>
   ```
4. `RadarArticlePage.tsx` vira um "shell" que só renderiza Header sticky/avatar/share buttons + recebe children como prop, OU vira um Astro layout puro com a interatividade (botão Copy) extraída para um island menor (`<CopyCodeButton>`).
5. Espelha o mesmo movimento para insights (próximo item).

### 2. `/insights/article` é rota fixa, não dinâmica

Hoje só existe `src/pages/insights/article.astro` — uma rota única que renderiza sempre o mesmo `ArticlePage2`. Os links em `InsightsPage.tsx` apontam todos para `/insights/article` (sem ID).

**O que precisa:**

1. Renomear `src/pages/insights/article.astro` → `src/pages/insights/article/[id].astro`.
2. Adicionar `getStaticPaths` derivando da coleção `insights`.
3. Em `InsightsPage.tsx`, mudar `href="/insights/article"` para `href={`/insights/article/${article.id}`}`.
4. Casar com o passo 1 (MDX render).

### 3. Article pages: Code Copy button não copia de fato

`RadarArticlePage.tsx:11-14` e `ArticlePage2.tsx:9-12` — `handleCopy` só seta `setCopied(true)` e timeout. Faltou `navigator.clipboard.writeText(code)`.

**Fix:** atribuir o snippet a uma constante e fazer `await navigator.clipboard.writeText(snippet)` antes do setCopied.

### 4. Botões/forms sem handler

Identificados navegando:

- **Header → "Contato"** (botão laranja): sem `onClick` em `Header.tsx:60-65`. Decidir: leva para `mailto:gustavo@gusflopes.dev`? Para `/#consulting`? Para Calendly?
- **Footer → Newsletter** (input + "Assinar"): sem `onSubmit` em `Footer.tsx:54-65`. Decidir provedor (Buttondown, ConvertKit, Mailchimp) ou remover.
- **Hero → Newsletter** (input + "Assinar Newsletter"): mesmo problema, em `Hero.tsx`.
- **Footer → social icons** (`Linkedin`, `Github`, `Youtube`, `Twitter`): todos com `href="#"`. Substituir pelos perfis reais ou remover ícones que não tem perfil.
- **Article pages → Share / Bookmark**: botões `<button>` sem handler. Implementar Web Share API ou remover.
- **Article author footer → social icons** em `RadarArticlePage.tsx:159-167`: também `href="#"`.

### 5. `/insights` paginação é fake

`InsightsPage.tsx:189-207` mostra "Prev | 01 02 03 | 08 | Next" mas é UI estática. Pra 6 artigos hoje a paginação nem precisa existir; remover ou implementar via query param + `client:load` real.

---

## Importante — qualidade que afeta o produto

### 6. SEO / social meta tags

`Default.astro` só tem `<title>` e `<description>`. Faltam:

- Open Graph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
- Twitter Card (`twitter:card`, `twitter:title`, etc.)
- Canonical URL

Cada página deveria poder passar `image` e `type` para o layout. Article pages precisam de `og:type="article"` + `article:published_time` + `article:author`.

### 7. Sem favicon

Único 404 visível em todas as rotas é `/favicon.ico`. Adicionar `public/favicon.svg` (Astro suporta `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` no `Default.astro`).

### 8. Imagens externas Unsplash sem otimização

Listagens (radar, insights, articles) carregam direto de `images.unsplash.com/...?w=1080&q=80`. Funciona, mas:

- Sem `loading="lazy"` controlado pelo Astro
- Sem srcset responsivo
- Dependência de domínio externo (single point of failure)

**Caminho:** baixar as imagens para `src/assets/`, referenciar via Content Collections com schema usando `image()` helper do Astro, e renderizar com `<Image />`. Casa com o passo 1.

### 9. Avatar do autor é placeholder gradient

Em ambas as article pages, `<div className="bg-gradient-to-tr from-orange-500 to-purple-900">` no lugar de uma foto real. Adicionar uma foto de perfil em `src/assets/author.jpg` ou similar.

---

## Cleanup técnico (sem urgência)

### 10. Aliases versionados (herança Figma export)

`astro.config.mjs` ainda mantém ~30 aliases tipo `'vaul@1.1.2': 'vaul'`. Afeta ~45 arquivos em `src/components/ui/*` que importam `from 'vaul@1.1.2'` etc.

**Caminho:** codemod com sed em `src/components/ui/*.tsx`. Padrão regular `'<pkg>@<version>'` → `'<pkg>'`. Depois apaga o bloco do astro.config.

### 11. Outras pages que podem fazer sentido

Dependendo da estratégia editorial:

- `/sobre` — hoje é uma seção scrollada na home (`#about`). Considerar página própria com bio expandida, currículo, fotos.
- `/consulting` ou `/trabalhe-comigo` — também só seção (`#consulting`). Página própria permite landing page focada em conversão (cases, depoimentos, formulário de briefing).
- `/posts` ou unificar com `/insights` — decidir taxonomia: "radar" e "insights" são distintos? Considerar consolidar em uma única coleção `posts` com `type: article|video|external`.
- `/uses`, `/now`, `/colofon` — páginas de "vibe" comuns em sites pessoais. Opcional.

---

## Por que a fase 6 (SSR) não foi feita

A fase 6 dependia de existir caso de uso real para código de Worker server-side: forms com submit, A/B testing por região, caching dinâmico, webhooks.

Hoje o site é 100% conteúdo estático. Adicionar `@astrojs/cloudflare` + `output: "server"` introduziria adaptador SSR no bundle, cold start no Worker (versus assets servidos do edge cache) e manutenção de uma camada de runtime sem benefício.

Quando os itens 4 (Newsletter form com submit real, contato server-side) ou similares aparecerem, o caminho está pronto: adicionar a integration e mudar o output. O `wrangler.jsonc` já tem `observability.logs.enabled: true` esperando.
