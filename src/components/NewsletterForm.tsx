import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { newsletter } from '../config/site';

interface NewsletterFormProps {
  /** "hero" usa campos grandes lado a lado; "footer" usa o layout compacto empilhado. */
  variant?: 'hero' | 'footer';
}

/**
 * Formulário de assinatura da newsletter Em Produção.
 * POST de formulário padrão (sem fetch) para o endpoint embed-subscribe
 * configurado em src/config/site.ts — compatível com o embed do Buttondown.
 */
export function NewsletterForm({ variant = 'hero' }: NewsletterFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const isHero = variant === 'hero';

  // Reseta o estado ao reexibir a página (inclui volta via bfcache após o POST),
  // para o botão não ficar permanentemente preso em "Enviando…".
  useEffect(() => {
    const reset = () => setSubmitting(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Honeypot: humanos não enxergam (nem preenchem) este campo.
    const honeypot = e.currentTarget.elements.namedItem('website');
    if (honeypot instanceof HTMLInputElement && honeypot.value) {
      e.preventDefault();
      return;
    }
    setSubmitting(true);
  };

  return (
    <form
      action={newsletter.action}
      method="post"
      onSubmit={handleSubmit}
      className={
        isHero
          ? 'flex flex-col sm:flex-row gap-3 w-full'
          : 'flex flex-col gap-2'
      }
    >
      <input type="hidden" name="embed" value="1" />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Input
        type="email"
        name="email"
        required
        placeholder="Seu melhor e-mail"
        aria-label={`E-mail para assinar a newsletter ${newsletter.name}`}
        className={
          isHero
            ? 'font-sans bg-slate-950/50 border-slate-600 text-white placeholder:text-slate-400 h-14 text-lg focus-visible:ring-orange-500'
            : 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-orange-500'
        }
      />
      <Button
        type="submit"
        disabled={submitting}
        className={
          isHero
            ? 'font-sans bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 h-14 rounded-lg text-lg shadow-lg shadow-orange-900/20 transition-all hover:scale-105 shrink-0'
            : 'bg-orange-500 hover:bg-orange-600 text-white font-bold w-full'
        }
      >
        {submitting ? 'Enviando…' : newsletter.ctaLabel}
      </Button>
    </form>
  );
}
