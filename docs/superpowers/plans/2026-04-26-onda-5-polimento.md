# Onda 5 — Polimento UX Implementation Plan

**Goal:** Eliminar todos os `href="#"` e botões sem handler do site. Implementar share/copy reais, conectar contato, social URLs reais. Limpar paginação fake do `/insights`.

**Spec:** §4 Onda 5.

## Tasks

### Task 1: CopyCodeButton + integração via MDX components

- [ ] Criar `src/components/article/CopyCodeButton.tsx` — island React que copia o conteúdo do `<pre>` adjacente para o clipboard via `navigator.clipboard.writeText`. Estados visuais (idle / copied).
- [ ] Atualizar `RadarArticleShell.astro` e `InsightsArticleShell.astro` pra mapear o `pre` do MDX num componente que injeta o botão (ou expor via slot — decisão: mais simples adicionar o botão como overlay com `position: absolute` em todos `pre` via CSS + delegação de evento global no shell).
  - Decisão escolhida: atributo `data-copy="true"` em `pre`, e um `<script>` no shell que adiciona o botão dinamicamente em runtime. Mais simples que mexer no MDX components map.

### Task 2: ShareButton + Bookmark removido

- [ ] Criar `src/components/article/ShareButton.tsx` — island React. Usa `navigator.share` se disponível, senão copia URL para clipboard com feedback.
- [ ] Substituir os botões `<button>` placeholder em ambos os shells por `<ShareButton client:load />`.
- [ ] Remover botão Bookmark dos shells (não vale o esforço sem persistência server-side).

### Task 3: Botão "Contato" do Header → mailto

- [ ] Substituir `<Button>Contato</Button>` por `<a href="mailto:gustavo@gusflopes.dev" class="...">Contato</a>` (mantendo styling).
- [ ] Mesmo no menu mobile.

### Task 4: Social URLs reais

- [ ] `Footer.tsx`: substituir os 4 `href="#"` por:
  - LinkedIn: `https://www.linkedin.com/in/gusflopes/`
  - GitHub: `https://github.com/gusflopes`
  - YouTube: `https://www.youtube.com/@hubdev-tech`
  - Twitter/X: `https://x.com/gusflopes`
  - (Substack opcional — adicionar 5º ícone? Decisão: não, manter simétrico)
- [ ] Em ambos os shells (`RadarArticleShell.astro`, `InsightsArticleShell.astro`): mesmas URLs.

### Task 5: Paginação fake removida

- [ ] Em `InsightsPage.tsx`, remover o bloco `Prev | 01 02 03 ... | 08 | Next` (linhas ~189-207).
- [ ] (Não substituir por nada — 6 artigos não justificam paginação.)

### Task 6: Push + PR

- [ ] git push -u origin feat/onda-5-polimento
- [ ] gh pr create --base feat/onda-4-conteudo-estrutura
