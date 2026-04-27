# Onda 2 — Infra de Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adicionar infra Cloudflare-native para captura de leads — endpoint server-side, persistência em D1, envio transacional via Resend, anti-spam básico — e conectar os formulários de Newsletter (Hero + Footer) ao endpoint.

**Architecture:** Astro muda de `output: 'static'` para `output: 'hybrid'` via `@astrojs/cloudflare` adapter. Páginas de conteúdo continuam pre-renderizadas; apenas `/api/subscribe` é SSR no Worker. D1 (`leads` table) armazena assinatura com `source` e `tag`. Anti-spam: honeypot + rate limit em KV.

**Tech Stack:** `@astrojs/cloudflare`, `resend` SDK, Cloudflare D1 (SQLite), Cloudflare KV (rate limit), Zod (validação).

**Spec de origem:** §3.1, §3.2, §4 Onda 2 do spec de launch readiness.

**Out of scope:** páginas `/mentoria` e `/cursos` (Onda 3), double opt-in (Onda 6), Turnstile (Onda 6), análise de leads (futuro).

---

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `astro.config.mjs` | Modify | Adicionar `@astrojs/cloudflare`, `output: 'hybrid'` |
| `package.json` | Modify | Deps `@astrojs/cloudflare`, `resend`, `zod` (zod já está como dep transitiva via astro:content; adicionar explícito) |
| `wrangler.jsonc` | Modify | Adicionar `d1_databases` + `kv_namespaces` bindings |
| `migrations/0001_create_leads.sql` | Create | Schema D1 (tabela `leads`) |
| `src/lib/email.ts` | Create | Wrapper Resend para envio de confirmação |
| `src/lib/leads.ts` | Create | Operações na tabela `leads` (insert + duplicate check) |
| `src/lib/rate-limit.ts` | Create | Rate limit baseado em KV (X requests / Y minutos por IP-hash) |
| `src/pages/api/subscribe.ts` | Create | POST endpoint de captura |
| `src/components/SubscribeForm.tsx` | Create | Island compartilhado pra formulários (Hero, Footer, futuras /mentoria e /cursos) |
| `src/components/Hero.tsx` | Modify | Substituir o input/botão atual pelo `<SubscribeForm tag="newsletter" source="hero">` |
| `src/components/Footer.tsx` | Modify | Substituir input/botão pelo `<SubscribeForm tag="newsletter" source="footer">` |
| `src/env.d.ts` | Modify | Tipos de env (RESEND_API_KEY, LEADS_DB, RATE_LIMIT_KV) |
| `.dev.vars.example` | Create | Template de variáveis pra `wrangler dev` |

---

## Tasks

### Task 1: Branch + dependências

- [ ] **Step 1:** Verifique branch (já está em `feat/onda-2-lead-capture`).
- [ ] **Step 2:** `pnpm astro add cloudflare --yes` (instala `@astrojs/cloudflare` e configura adapter automaticamente).
- [ ] **Step 3:** `pnpm add resend zod`.
- [ ] **Step 4:** Verifique `astro.config.mjs` — deve ter `import cloudflare from '@astrojs/cloudflare'` e `adapter: cloudflare()`. Mude `output: 'static'` para `output: 'hybrid'`.
- [ ] **Step 5:** `pnpm build` — deve gerar `dist/` com pages estáticas + um `_worker.js` (mas só renderiza `/api/*` em runtime; outras rotas ficam pre-rendered).
- [ ] **Step 6:** Commit:
```
git add astro.config.mjs package.json pnpm-lock.yaml
git commit -m "feat(infra): adiciona @astrojs/cloudflare adapter; output hybrid"
```

### Task 2: D1 migration + wrangler bindings

- [ ] **Step 1:** Criar `migrations/0001_create_leads.sql`:

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'newsletter',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash TEXT,
  user_agent TEXT,
  confirmed_at TEXT
);
CREATE UNIQUE INDEX idx_leads_email_tag ON leads(email, tag);
```

- [ ] **Step 2:** Editar `wrangler.jsonc` para adicionar `d1_databases` e `kv_namespaces` (placeholders — owner cria via `wrangler d1 create gusflopes-leads` e `wrangler kv namespace create gusflopes-rate-limit` depois e cola os IDs reais):

```jsonc
{
  // ...existente...
  "d1_databases": [
    {
      "binding": "LEADS_DB",
      "database_name": "gusflopes-leads",
      "database_id": "TODO_owner_run_wrangler_d1_create"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "RATE_LIMIT_KV",
      "id": "TODO_owner_run_wrangler_kv_namespace_create"
    }
  ]
}
```

- [ ] **Step 3:** Commit:
```
git add migrations/0001_create_leads.sql wrangler.jsonc
git commit -m "feat(infra): D1 migration leads table + bindings placeholders em wrangler.jsonc"
```

### Task 3: Tipos de ambiente

- [ ] Atualizar `src/env.d.ts` para tipar `LEADS_DB`, `RATE_LIMIT_KV`, `RESEND_API_KEY` no contexto Astro/Cloudflare.

```typescript
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  LEADS_DB: D1Database;
  RATE_LIMIT_KV: KVNamespace;
  RESEND_API_KEY: string;
}
```

- [ ] Commit: `git add src/env.d.ts && git commit -m "feat(types): adiciona tipos para bindings Cloudflare"`

### Task 4: Helpers (`src/lib/{email,leads,rate-limit}.ts`)

- [ ] Criar `src/lib/email.ts`:

```typescript
import { Resend } from 'resend';

const FROM = 'Gustavo Lopes <gustavo@gusflopes.dev>';

export async function sendConfirmation(args: {
  apiKey: string;
  to: string;
  tag: string;
}) {
  const resend = new Resend(args.apiKey);

  const subject = subjectForTag(args.tag);
  const body = bodyForTag(args.tag);

  return resend.emails.send({
    from: FROM,
    to: args.to,
    subject,
    html: body,
  });
}

function subjectForTag(tag: string) {
  if (tag.startsWith('mentoria')) return 'Você está na lista da próxima turma de mentoria';
  if (tag.startsWith('curso')) return 'Você está na lista da próxima turma do curso';
  return 'Confirmado: você assinou a newsletter de gusflopes.dev';
}

function bodyForTag(tag: string) {
  const intro = tag.startsWith('mentoria')
    ? 'Você acabou de entrar na lista de espera da próxima turma de mentoria.'
    : tag.startsWith('curso')
    ? 'Você acabou de entrar na lista de espera do próximo curso.'
    : 'Você acabou de assinar a newsletter de gusflopes.dev.';
  return `<p>${intro}</p><p>Quando abrir vagas, você é avisado primeiro.</p><p>— Gustavo</p>`;
}
```

- [ ] Criar `src/lib/leads.ts`:

```typescript
export interface InsertLeadInput {
  db: D1Database;
  email: string;
  source: string;
  tag: string;
  ipHash: string | null;
  userAgent: string | null;
}

export async function insertLead(input: InsertLeadInput): Promise<{ created: boolean }> {
  const result = await input.db
    .prepare(
      `INSERT OR IGNORE INTO leads (email, source, tag, ip_hash, user_agent, confirmed_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    )
    .bind(input.email, input.source, input.tag, input.ipHash, input.userAgent)
    .run();
  return { created: result.meta.changes > 0 };
}
```

(Single opt-in: `confirmed_at` preenche no insert. Double opt-in fica para Onda 6.)

- [ ] Criar `src/lib/rate-limit.ts`:

```typescript
const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

export async function checkRateLimit(args: {
  kv: KVNamespace;
  ipHash: string;
}): Promise<{ allowed: boolean }> {
  const key = `rl:${args.ipHash}`;
  const current = await args.kv.get(key);
  const count = current ? parseInt(current, 10) : 0;
  if (count >= MAX_REQUESTS) {
    return { allowed: false };
  }
  await args.kv.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });
  return { allowed: true };
}

export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + 'gusflopes-salt');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}
```

- [ ] Build + commit:
```
git add src/lib/email.ts src/lib/leads.ts src/lib/rate-limit.ts
git commit -m "feat(lib): helpers email (Resend), leads (D1), rate-limit (KV)"
```

### Task 5: Endpoint `/api/subscribe`

- [ ] Criar `src/pages/api/subscribe.ts`:

```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { insertLead } from '../../lib/leads';
import { sendConfirmation } from '../../lib/email';
import { checkRateLimit, hashIp } from '../../lib/rate-limit';

export const prerender = false;

const SubscribeSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().min(1).max(64),
  tag: z.string().min(1).max(64).default('newsletter'),
  hp_field: z.string().optional(),
});

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const env = (locals as App.Locals).runtime?.env;
  if (!env) {
    return json({ ok: false, error: 'runtime indisponível' }, 500);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'body inválido' }, 400);
  }

  const parsed = SubscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: 'dados inválidos' }, 400);
  }
  const { email, source, tag, hp_field } = parsed.data;

  // Honeypot — preenchido = bot, retorna 200 silencioso
  if (hp_field && hp_field.trim().length > 0) {
    return json({ ok: true });
  }

  const ip = clientAddress ?? request.headers.get('cf-connecting-ip') ?? '0.0.0.0';
  const ipHash = await hashIp(ip);

  const rl = await checkRateLimit({ kv: env.RATE_LIMIT_KV, ipHash });
  if (!rl.allowed) {
    return json({ ok: false, error: 'muitas tentativas, tente novamente em alguns minutos' }, 429);
  }

  const userAgent = request.headers.get('user-agent');
  const { created } = await insertLead({
    db: env.LEADS_DB,
    email,
    source,
    tag,
    ipHash,
    userAgent,
  });

  if (created && env.RESEND_API_KEY) {
    try {
      await sendConfirmation({ apiKey: env.RESEND_API_KEY, to: email, tag });
    } catch (err) {
      console.error('[subscribe] erro Resend', err);
      // Não falha o request — lead já está em D1
    }
  }

  return json({ ok: true });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
```

- [ ] Build + commit:
```
git add src/pages/api/subscribe.ts
git commit -m "feat(api): endpoint /api/subscribe com Zod + honeypot + rate-limit + D1 insert + Resend"
```

### Task 6: SubscribeForm island

- [ ] Criar `src/components/SubscribeForm.tsx`:

```tsx
import React, { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  tag: string;
  source: string;
  placeholder?: string;
  cta?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function SubscribeForm({
  tag,
  source,
  placeholder = 'seu@email.com',
  cta = 'Assinar',
  successMessage = 'Pronto! Confira seu email pra confirmar.',
  errorMessage = 'Não consegui registrar. Tenta de novo em instantes?',
  className,
  inputClassName,
  buttonClassName,
}: Props) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setFeedback(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source, tag, hp_field: hp }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus('error');
        setFeedback(data.error ?? errorMessage);
        return;
      }
      setStatus('success');
      setFeedback(successMessage);
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback(errorMessage);
    }
  };

  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      {/* honeypot — nunca exibido */}
      <input
        type="text"
        name="hp_field"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-10000px', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={inputClassName}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={buttonClassName}
        >
          {status === 'loading' ? 'Enviando...' : cta}
        </button>
      </div>
      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm mt-2 ${
            status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-slate-400'
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
```

- [ ] Build + commit:
```
git add src/components/SubscribeForm.tsx
git commit -m "feat(forms): SubscribeForm island com honeypot + estados visuais"
```

### Task 7: Conectar Hero e Footer ao SubscribeForm

- [ ] Ler `src/components/Hero.tsx` e identificar o input + botão atual de newsletter; substituir pelo `<SubscribeForm tag="newsletter" source="hero" cta="Assinar Newsletter" />`. Preservar o estilo visual (passar `inputClassName` e `buttonClassName` com classes Tailwind atuais).
- [ ] Mesmo procedimento em `src/components/Footer.tsx` — `<SubscribeForm tag="newsletter" source="footer" cta="Assinar" />`.
- [ ] Build + commit:
```
git add src/components/Hero.tsx src/components/Footer.tsx
git commit -m "feat(forms): Hero e Footer usam SubscribeForm conectado a /api/subscribe"
```

### Task 8: Documentação para owner (.dev.vars.example + README seção)

- [ ] Criar `.dev.vars.example`:

```
# Resend API key — criar conta em resend.com, gerar key e:
#   pnpm wrangler secret put RESEND_API_KEY
# (durante desenvolvimento local, copia este arquivo para .dev.vars)
RESEND_API_KEY=re_xxxxxxxx
```

- [ ] Adicionar `.dev.vars` ao `.gitignore` (se ainda não estiver).
- [ ] Atualizar README.md com seção curta sobre setup do D1+KV+Resend (`wrangler d1 create`, `wrangler kv namespace create`, `wrangler secret put`).
- [ ] Commit:
```
git add .dev.vars.example .gitignore README.md
git commit -m "docs(infra): instruções para owner criar D1, KV e secret Resend"
```

### Task 9: Gate final + push + PR

- [ ] `pnpm build` verde
- [ ] curl em `/api/subscribe` deve responder `{"ok":false,"error":"runtime indisponível"}` ou similar quando rodando preview puro (sem bindings); isso é esperado — owner valida com `wrangler dev` quando bindings reais estiverem configurados.
- [ ] `git push -u origin feat/onda-2-lead-capture`
- [ ] `gh pr create` com base `feat/onda-1-foundation` (ou main, dependendo de qual onda foi mergeada antes)

---

## TODOs explícitos para o owner

1. **D1:** `pnpm wrangler d1 create gusflopes-leads` → copiar database_id para `wrangler.jsonc`
2. **D1 migration:** `pnpm wrangler d1 migrations apply gusflopes-leads --remote` (e `--local` para dev)
3. **KV namespace:** `pnpm wrangler kv namespace create gusflopes-rate-limit` → copiar id para `wrangler.jsonc`
4. **Resend account:** criar em resend.com, verificar domínio (gusflopes.dev), gerar API key
5. **Secret:** `pnpm wrangler secret put RESEND_API_KEY` (cola a key)
6. **Local dev:** copiar `.dev.vars.example` para `.dev.vars` e preencher; rodar `pnpm wrangler dev`
