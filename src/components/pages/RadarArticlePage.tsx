import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Copy, Check, Linkedin, Github, Twitter } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface RadarArticlePageProps {
  id?: string;
}

export function RadarArticlePage({ id: _id }: RadarArticlePageProps = {}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
           <div className="flex gap-4">
             <button className="p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-colors">
               <Share2 size={16} />
             </button>
             <button className="p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-colors">
               <Bookmark size={16} />
             </button>
           </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">
        
        {/* Article Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-500 mb-6 justify-center md:justify-start">
            <span>Arquitetura</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> 25 Out, 2023
            </span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={12} /> 12 min leitura
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
            Desacoplando Monólitos com <span className="italic text-slate-500">Domain-Driven Design</span>
          </h1>

          <p className="font-sans text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
            Como identificar Bounded Contexts e migrar sistemas legados sem parar a operação. Um guia passo a passo para arquitetos modernos.
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-[21/9] relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60"></div>
           <ImageWithFallback 
             src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFyY2hpdGVjdHVyZSUyMGRpYWdyYW0lMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjBjb2RlJTIwbW9uaXRvcnxlbnwxfHx8fDE3NjQ1NDUxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
             alt="Abstract Architecture"
             className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
           />
        </div>

        {/* Content Body */}
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none font-sans text-slate-300 leading-loose prose-headings:font-serif prose-headings:font-medium prose-headings:text-white prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-white">
          
          <p>
            A complexidade no desenvolvimento de software não é acidental; é uma consequência direta da complexidade do domínio que estamos tentando modelar. Quando tratamos essa complexidade apenas com ferramentas técnicas, falhamos. O verdadeiro desafio é linguístico e estrutural.
          </p>

          <h2 className="mt-12 mb-6 text-2xl tracking-tight">Os Princípios Core do DDD</h2>
          
          <p>
            Domain-Driven Design não é apenas um conjunto de padrões (Repository, Entity, Value Object); é uma filosofia centrada na complexidade do núcleo do negócio. Ao focar em uma linguagem onipresente e contextos delimitados (*Bounded Contexts*), podemos criar modelos que são um reflexo verdadeiro do negócio.
          </p>

          {/* Quote Block - Dark Theme */}
          <blockquote className="not-italic border-l-4 border-orange-500 bg-slate-900/50 p-8 my-10 rounded-r-lg shadow-inner relative overflow-hidden">
             <div className="absolute -top-2 right-6 opacity-10 text-white select-none pointer-events-none">
               <span className="font-serif text-8xl leading-none">”</span>
             </div>
             <p className="font-serif text-xl md:text-2xl italic text-slate-200 m-0 z-10 relative">
               "O coração do software é sua capacidade de resolver problemas relacionados ao domínio para seu usuário. Todas as outras funcionalidades, vitais como podem ser, suportam este propósito primário."
             </p>
          </blockquote>

          <p>
            Frequentemente, nos perdemos em detalhes de implementação (Kubernetes, Kafka, Redis) antes mesmo de entendermos o fluxo de valor. Isso gera o que chamamos de "Arquitetura Acidental".
          </p>

          <h2 className="mt-12 mb-6 text-2xl tracking-tight">Estratégias de Estrangulamento</h2>
          
          <p>
            Para migrar de um monólito para microsserviços (ou melhor, para um sistema distribuído modular), a abordagem Big Bang raramente funciona. O padrão Strangler Fig é essencial.
          </p>
          <p>
            A ideia é criar novas funcionalidades nas bordas do sistema, interceptando chamadas e redirecionando para novos serviços, "estrangulando" lentamente o legado até que ele possa ser desligado.
          </p>

          {/* Code Block - Dark Theme */}
          <div className="not-prose my-8 rounded-lg overflow-hidden bg-[#0F172A] shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] border border-slate-800 text-sm font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">strangler-pattern.ts</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 rounded bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-slate-300 leading-relaxed">
                <code>
<span className="text-purple-400">const</span> <span className="text-blue-400">handleRequest</span> = (<span className="text-orange-400">req</span>) ={'>'} {'{'}
{'\n'}  <span className="text-purple-400">if</span> (<span className="text-blue-400">shouldRouteToNewService</span>(req)) {'{'}
{'\n'}    <span className="text-purple-400">return</span> <span className="text-green-400">NewService</span>.<span className="text-yellow-400">process</span>(req);
{'\n'}  {'}'}
{'\n'}  <span className="text-purple-400">return</span> <span className="text-green-400">LegacyMonolith</span>.<span className="text-yellow-400">process</span>(req);
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
        <div className="mt-24 pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden shrink-0 border-4 border-slate-700 shadow-lg">
              {/* Placeholder for author avatar */}
              <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-purple-900"></div>
           </div>
           <div>
             <h4 className="font-sans font-bold text-orange-500 uppercase tracking-widest text-xs mb-2">Sobre o Autor</h4>
             <p className="font-serif text-3xl md:text-4xl text-white mb-2">Gustavo Lopes</p>
             <p className="text-sm text-slate-400 font-mono max-w-lg leading-relaxed mb-4">
               Tech Lead & Arquiteto de Software. Especialista em traduzir complexidade de negócio em sistemas escaláveis através de DDD, Cloud e Estratégia.
             </p>
             <div className="flex items-center gap-4 justify-center md:justify-start">
               <a href="#" className="text-slate-400 hover:text-white transition-colors">
                 <Linkedin size={20} />
               </a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors">
                 <Github size={20} />
               </a>
               <a href="#" className="text-slate-400 hover:text-white transition-colors">
                 <Twitter size={20} />
               </a>
             </div>
           </div>
        </div>

      </article>
    </div>
  );
}
