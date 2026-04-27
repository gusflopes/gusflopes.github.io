/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  ASSETS: Fetcher;
  LEADS_DB: D1Database;
  RATE_LIMIT_KV: KVNamespace;
  RESEND_API_KEY: string;
}
