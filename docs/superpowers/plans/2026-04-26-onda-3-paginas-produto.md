# Onda 3 — Páginas Produto Implementation Plan

**Goal:** Criar páginas dedicadas `/mentoria` e `/cursos` com lista de espera funcional (conectada ao `/api/subscribe` da Onda 2). Atualizar o Header com 2 itens novos.

**Architecture:** Cada página é `.astro` com `prerender = true` (estática) + island React `MentoriaPage` ou `CursosPage` que monta o conteúdo. SubscribeForm reusado da Onda 2 com `tag` e `source` específicos.

**Tech Stack:** Astro pages + React island + SubscribeForm (existente).

**Spec:** §4 Onda 3.

**Out of scope:** copy variants em worktrees (owner ajusta depois), pricing público, Calendly (Onda 6).

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/pages/mentoria.astro` | Create | Rota estática /mentoria com SEO próprio + MentoriaPage island |
| `src/pages/cursos.astro` | Create | Rota estática /cursos com SEO próprio + CursosPage island |
| `src/components/pages/MentoriaPage.tsx` | Create | Hero + "para quem é" + "como funciona" + lista de espera + FAQ curto |
| `src/components/pages/CursosPage.tsx` | Create | Hero + "o que vai cobrir" + lista de espera |
| `src/components/Header.tsx` | Modify | Adiciona 2 nav items: "Mentoria", "Cursos" |

## Tasks

### Task 1: Página `/mentoria`

- [ ] Criar `src/components/pages/MentoriaPage.tsx` com estrutura definida no spec.
- [ ] Criar `src/pages/mentoria.astro` com SEO + `<MentoriaPage client:load />`.
- [ ] Build verde.
- [ ] Commit.

### Task 2: Página `/cursos`

- [ ] Criar `src/components/pages/CursosPage.tsx`.
- [ ] Criar `src/pages/cursos.astro`.
- [ ] Build verde.
- [ ] Commit.

### Task 3: Header com novos itens

- [ ] Adicionar "Mentoria" e "Cursos" em `navItems`.
- [ ] Remover "Trabalhe Comigo" (apontava pra `/#consulting` que ainda é stub).
- [ ] Build + commit.

### Task 4: Push + PR

- [ ] `git push -u origin feat/onda-3-paginas-produto`
- [ ] `gh pr create --base feat/onda-2-lead-capture`
