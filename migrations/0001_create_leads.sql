-- Migration: 0001_create_leads
-- Cria a tabela `leads` com índice único composto (email, tag).
-- Aplicar:
--   pnpm wrangler d1 migrations apply gusflopes-leads --local   (dev)
--   pnpm wrangler d1 migrations apply gusflopes-leads --remote  (prod)

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
