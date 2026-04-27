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
      <input
        type="text"
        name="hp_field"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
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
        <button type="submit" disabled={status === 'loading'} className={buttonClassName}>
          {status === 'loading' ? 'Enviando...' : cta}
        </button>
      </div>
      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm mt-2 ${
            status === 'success'
              ? 'text-green-400'
              : status === 'error'
              ? 'text-red-400'
              : 'text-slate-400'
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
