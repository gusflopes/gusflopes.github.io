# Onda 4 — Conteúdo (Estrutural) Implementation Plan

**Goal:** Tornar a infraestrutura de conteúdo dos `insights` simétrica à dos `radar` — rota dinâmica `/insights/article/[id]`, shell Astro substituindo o componente React, smoke test com 1 artigo real. Estende schema de categorias com as opções propostas pelo owner.

**Architecture:** Mesma decomposição usada para `radar` na Onda 1: `InsightsArticleShell.astro` recebe `data` + `<slot />`, página dinâmica usa `render(entry)`. `ArticlePage2.tsx` é deletado.

**Out of scope (real):** owner escreve os 3 artigos e migra .md → .mdx com conteúdo real depois. Esta onda apenas habilita a estrutura.

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/content.config.ts` | Modify | Estender enum `category` com novas opções, manter retrocompat |
| `src/components/article/InsightsArticleShell.astro` | Create | Shell Astro light theme (baseado em ArticlePage2) |
| `src/pages/insights/article/[id].astro` | Create | Rota dinâmica com getStaticPaths |
| `src/pages/insights/article.astro` | Delete | Rota fixa antiga |
| `src/components/pages/ArticlePage2.tsx` | Delete | Substituído pelo shell |
| `src/components/pages/InsightsPage.tsx` | Modify | href agora é `/insights/article/${id}` + categorias atualizadas |
| `src/content/insights/1.md` → `1.mdx` | Rename + body real | Smoke test (mesmo padrão da Onda 1 com radar) |
| `docs/superpowers/templates/insight.mdx` | Create | Template de frontmatter para futuros artigos |
| `docs/superpowers/templates/radar.mdx` | Create | Template para curadoria radar |

## Tasks

1. Estender schema (categorias)
2. Criar `InsightsArticleShell.astro`
3. Criar `[id].astro` dinâmica
4. Atualizar `InsightsPage.tsx` (links + categorias)
5. Deletar arquivos antigos
6. Smoke test em `1.mdx`
7. Templates pra futuros artigos
8. Push + PR
