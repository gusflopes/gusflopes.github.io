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

  if (hp_field && hp_field.trim().length > 0) {
    return json({ ok: true });
  }

  const ip = clientAddress ?? request.headers.get('cf-connecting-ip') ?? '0.0.0.0';
  const ipHash = await hashIp(ip);

  const rl = await checkRateLimit({ kv: env.RATE_LIMIT_KV, ipHash });
  if (!rl.allowed) {
    return json(
      { ok: false, error: 'muitas tentativas, tente novamente em alguns minutos' },
      429,
    );
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
