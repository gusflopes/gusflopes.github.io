import { useState, type ReactNode } from 'react';
import { ArrowLeft, Calendar, Check, Clock, Github, Linkedin, Share2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { author, socials } from '../../config/site';

export interface RadarArticlePageProps {
  title: string;
  excerpt: string;
  category: string;
  dateFormatted: string;
  duration: string;
  image: string;
  /** Corpo do artigo já renderizado (markdown via <Content /> no .astro). */
  children?: ReactNode;
}

export function RadarArticlePage({
  title,
  excerpt,
  category,
  dateFormatted,
  duration,
  image,
  children,
}: RadarArticlePageProps) {
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
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden selection:bg-orange-500/30 selection:text-white">

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header / Navigation */}
      <div className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
           <a href="/radar" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
             <ArrowLeft size={14} />
             Voltar para o Radar
           </a>
           <button
             onClick={handleShare}
             aria-label="Compartilhar artigo"
             className="flex items-center gap-2 p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-colors"
           >
             {linkCopied ? <Check size={16} className="text-orange-500" /> : <Share2 size={16} />}
             {linkCopied && (
               <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 pr-1">
                 Link copiado
               </span>
             )}
           </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">

        {/* Article Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-500 mb-6 justify-center md:justify-start">
            <span>{category}</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> {dateFormatted}
            </span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={12} /> {duration} leitura
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
            {title}
          </h1>

          <p className="font-sans text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
            {excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-[21/9] relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60"></div>
           <ImageWithFallback
             src={image}
             alt={title}
             className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
           />
        </div>

        {/* Content Body — markdown renderizado via slot */}
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none font-sans text-slate-300 leading-loose prose-headings:font-serif prose-headings:font-medium prose-headings:text-white prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-white prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-slate-900/50 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:shadow-inner prose-blockquote:font-serif prose-blockquote:text-slate-200">
          {children}
        </div>

        {/* Author Footer */}
        <div className="mt-24 pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden shrink-0 border-4 border-slate-700 shadow-lg">
              {/* Placeholder for author avatar */}
              <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-purple-900"></div>
           </div>
           <div>
             <h4 className="font-sans font-bold text-orange-500 uppercase tracking-widest text-xs mb-2">Sobre o Autor</h4>
             <p className="font-serif text-3xl md:text-4xl text-white mb-2">{author.name}</p>
             <p className="text-sm text-slate-400 font-mono max-w-lg leading-relaxed mb-4">
               {author.bio}
             </p>
             <div className="flex items-center gap-4 justify-center md:justify-start">
               <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors">
                 <Linkedin size={20} />
               </a>
               <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-white transition-colors">
                 <Github size={20} />
               </a>
             </div>
           </div>
        </div>

      </article>
    </div>
  );
}
