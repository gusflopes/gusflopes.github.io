import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

type Status = 'idle' | 'shared' | 'copied' | 'error';

interface Props {
  className?: string;
  iconClassName?: string;
  size?: number;
  ariaLabel?: string;
}

export function ShareButton({
  className,
  iconClassName,
  size = 16,
  ariaLabel = 'Compartilhar',
}: Props) {
  const [status, setStatus] = useState<Status>('idle');

  const onClick = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus('shared');
        setTimeout(() => setStatus('idle'), 2000);
        return;
      } catch (err) {
        if ((err as DOMException).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={status === 'copied' ? 'Link copiado' : ariaLabel}
      title={status === 'copied' ? 'Link copiado!' : 'Compartilhar'}
    >
      {status === 'copied' || status === 'shared' ? (
        <Check size={size} className={iconClassName} />
      ) : (
        <Share2 size={size} className={iconClassName} />
      )}
    </button>
  );
}
