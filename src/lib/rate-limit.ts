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
