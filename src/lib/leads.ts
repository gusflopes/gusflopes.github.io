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
  return { created: (result.meta?.changes ?? 0) > 0 };
}
