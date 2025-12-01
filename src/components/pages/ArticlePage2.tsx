import { ArrowLeft, Bookmark, Calendar, Check, Clock, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function ArticlePage2() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
           <Link to="/insights" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors">
             <ArrowLeft size={14} />
             Voltar
           </Link>
           <div className="flex gap-4">
             <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
               <Share2 size={16} />
             </button>
             <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
               <Bookmark size={16} />
             </button>
           </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">
        
        {/* Article Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-600 mb-6 justify-center md:justify-start">
            <span>Arquitetura</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> 12 Out, 2024
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={12} /> 8 min leitura
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-8">
            Desacoplando Monólitos com <span className="italic text-slate-500">Domain-Driven Design</span>
          </h1>

          <p className="font-sans text-xl text-slate-600 font-light leading-relaxed max-w-2xl">
            Uma abordagem estratégica para decompor complexidade sem paralisar o negócio, focando na linguagem onipresente e contextos delimitados.
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-sm border border-slate-200/50 aspect-[21/9] relative group">
           <ImageWithFallback 
             src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFyY2hpdGVjdHVyZSUyMGRpYWdyYW0lMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjBjb2RlJTIwbW9uaXRvcnxlbnwxfHx8fDE3NjQ1NDUxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
             alt="Abstract Architecture"
             className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
           />
        </div>

        {/* Content Body */}
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none font-sans text-slate-700 leading-loose prose-headings:font-serif prose-headings:font-medium">
          
          <p>
            A complexidade no desenvolvimento de software não é acidental; é uma consequência direta da complexidade do domínio que estamos tentando modelar. Quando tratamos essa complexidade apenas com ferramentas técnicas, falhamos. O verdadeiro desafio é linguístico e estrutural.
          </p>

          <h2 className="text-slate-900 mt-12 mb-6 text-2xl tracking-tight">Os Princípios Core do DDD</h2>
          
          <p>
            Domain-Driven Design não é apenas um conjunto de padrões (Repository, Entity, Value Object); é uma filosofia centrada na complexidade do núcleo do negócio. Ao focar em uma linguagem onipresente e contextos delimitados (*Bounded Contexts*), podemos criar modelos que são um reflexo verdadeiro do negócio.
          </p>

          {/* Quote Block - Styled as per request (adapted to light theme) */}
          <blockquote className="not-italic border-l-4 border-orange-500 bg-white p-8 my-10 rounded-r-lg shadow-sm relative overflow-hidden">
             <div className="absolute -top-2 right-6 opacity-10 text-slate-900 select-none pointer-events-none">
               <span className="font-serif text-8xl leading-none">”</span>
             </div>
             <p className="font-serif text-xl md:text-2xl italic text-slate-800 m-0 z-10 relative">
               "O coração do software é sua capacidade de resolver problemas relacionados ao domínio para seu usuário. Todas as outras funcionalidades, vitais como podem ser, suportam este propósito primário."
             </p>
          </blockquote>

          <p>
            Frequentemente, nos perdemos em detalhes de implementação (Kubernetes, Kafka, Redis) antes mesmo de entendermos o fluxo de valor. Isso gera o que chamamos de "Arquitetura Acidental".
          </p>

          <h2 className="text-slate-900 mt-12 mb-6 text-2xl tracking-tight">Fronteiras Aprimoradas por IA</h2>
          
          <p>
            A topologia de um sistema moderno não é estática. Com a introdução de agentes de IA, nossas fronteiras de contexto precisam ser mais permeáveis, porém mais seguras. Abaixo, um exemplo de como definimos uma topologia flexível:
          </p>

          {/* Code Block - Styled as per request (Dark Contrast) */}
          <div className="not-prose my-8 rounded-lg overflow-hidden bg-[#0F172A] shadow-xl border border-slate-800 text-sm font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">topology.ts</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 rounded bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-slate-300 leading-relaxed">
                <code>
<span className="text-purple-400">export default</span> <span className="text-blue-400">Topology</span> {'{'}
{'\n'}  <span className="text-purple-400">return</span> (
{'\n'}    <span className="text-green-400">dataPlatform</span>, 
{'\n'}    <span className="text-orange-400">teams</span>
{'\n'}  );
{'\n'}{'}'}
                </code>
              </pre>
            </div>
          </div>

          <p>
            Esta simplicidade no código esconde uma complexidade orquestrada. Ao retornar a plataforma de dados junto com os times, garantimos que a estrutura organizacional (Lei de Conway) seja respeitada pelo código.
          </p>

        </div>

        {/* Author Footer */}
        <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-lg">
              {/* Placeholder for author avatar */}
              <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-purple-600"></div>
           </div>
           <div>
             <h4 className="font-sans font-bold text-orange-600 uppercase tracking-widest text-xs mb-2">Sobre o Autor</h4>
             <p className="font-serif text-3xl md:text-4xl text-slate-900 mb-2">Gustavo Lopes</p>
             <p className="text-sm text-slate-600 font-mono max-w-md">Engenheiro de Software & Arquiteto de Soluções focado em sistemas distribuídos.</p>
           </div>
        </div>

      </article>
    </div>
  );
}
