import { useState, type ReactNode } from 'react';
import { ArrowLeft, Calendar, Check, Clock, Share2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { author } from '../../config/site';

export interface InsightArticlePageProps {
  title: string;
  excerpt: string;
  category: string;
  dateFormatted: string;
  duration: string;
  image: string;
  /** Corpo do artigo já renderizado (markdown via <Content /> no .astro). */
  children?: ReactNode;
}

export function InsightArticlePage({
  title,
  excerpt,
  category,
  dateFormatted,
  duration,
  image,
  children,
}: InsightArticlePageProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // Usuário cancelou o share: não sobrescrever o clipboard como efeito colateral.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // Share falhou de verdade (ex.: NotAllowedError) — cai para o fallback de copiar.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard indisponível (contexto não seguro) — sem ação
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 relative overflow-hidden selection:bg-orange-200 selection:text-orange-900">

      {/* Artistic Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Header / Navigation */}
      <div className="sticky top-0 z-40 w-full bg-[#F5F5F0]/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
           <a href="/insights" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors">
             <ArrowLeft size={14} />
             Voltar
           </a>
           <button
             onClick={handleShare}
             aria-label="Compartilhar artigo"
             className="flex items-center gap-2 p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
           >
             {linkCopied ? <Check size={16} className="text-orange-600" /> : <Share2 size={16} />}
             {linkCopied && (
               <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 pr-1">
                 Link copiado
               </span>
             )}
           </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">

        {/* Article Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-600 mb-6 justify-center md:justify-start">
            <span>{category}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> {dateFormatted}
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={12} /> {duration} leitura
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-8">
            {title}
          </h1>

          <p className="font-sans text-xl text-slate-600 font-light leading-relaxed max-w-2xl">
            {excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-sm border border-slate-200/50 aspect-[21/9] relative group">
           <ImageWithFallback
             src={image}
             alt={title}
             className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
           />
        </div>

        {/* Content Body — markdown renderizado via slot */}
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none font-sans text-slate-700 leading-loose prose-headings:font-serif prose-headings:font-medium prose-headings:text-slate-900 prose-a:text-orange-600 hover:prose-a:text-orange-500 prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-white prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:shadow-sm prose-blockquote:font-serif prose-blockquote:text-slate-800">
          {children}
        </div>

        {/* Author Footer */}
        <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-lg">
              {/* Placeholder for author avatar */}
              <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-purple-600"></div>
           </div>
           <div>
             <h4 className="font-sans font-bold text-orange-600 uppercase tracking-widest text-xs mb-2">Sobre o Autor</h4>
             <p className="font-serif text-3xl md:text-4xl text-slate-900 mb-2">{author.name}</p>
             <p className="text-sm text-slate-600 font-mono max-w-lg leading-relaxed">
               {author.bio}
             </p>
           </div>
        </div>

      </article>
    </div>
  );
}
