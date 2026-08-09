import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Produto {
  title: string;
  whatItIs: string;
  forWhom: string;
  prerequisite: string;
  ctaLabel: string;
  href: string;
}

const produtos: Produto[] = [
  {
    title: 'Curso online',
    whatItIs:
      'Programa técnico sobre colocar agente de IA em produção dentro de sistema que já existe — extração de legado, ferramenta com permissão, eval antes do deploy.',
    forWhom: 'Para engenheiros e tech leads que vão assinar embaixo da decisão de arquitetura.',
    prerequisite: 'Você escreve código',
    ctaLabel: 'Ver o programa',
    href: '/cursos',
  },
  {
    title: 'Workshop e grupo de estudo',
    whatItIs:
      'Encontros ao vivo para entender o que um agente de IA faz de verdade, onde ele erra e o que perguntar antes de aprovar um projeto.',
    forWhom:
      'Para quem decide, contrata ou aprova sem escrever código — gestão, negócio, colegas de MBA.',
    prerequisite: 'Sem pré-requisito técnico',
    ctaLabel: 'Ver o formato',
    href: '/workshops',
  },
  {
    title: 'Mentoria individual',
    whatItIs: 'Conversa recorrente, um a um, sobre a decisão de carreira que está travada agora.',
    forWhom: 'Para engenheiros em transição de área ou empurrando a carreira para senioridade.',
    prerequisite: 'Individual · já na profissão',
    ctaLabel: 'Ver como funciona',
    href: '/mentoria',
  },
];

export function Formacao() {
  return (
    <section id="formacao" className="relative bg-slate-900 py-24 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 max-w-3xl">
          <span className="block mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-400">
            Formação
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
            Três formatos, três públicos que não se misturam.
          </h2>
          <p className="font-sans text-lg text-slate-300 leading-relaxed">
            O pré-requisito está no card, de propósito: você não deveria precisar clicar para
            descobrir que a página não é para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
          {produtos.map((produto) => (
            <a
              key={produto.href}
              href={produto.href}
              className="group flex h-full flex-col rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-500/50"
            >
              <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-3 group-hover:text-orange-400 transition-colors">
                {produto.title}
              </h3>
              <p className="font-sans text-base text-slate-300 leading-relaxed mb-4">
                {produto.whatItIs}
              </p>
              <p className="font-sans text-base text-slate-400 leading-relaxed mb-6">
                {produto.forWhom}
              </p>

              <span className="mt-auto mb-4 w-fit inline-flex items-center rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {produto.prerequisite}
              </span>

              <span className="inline-flex items-center gap-2 group-hover:gap-3 transition-all font-sans text-xs font-bold uppercase tracking-widest text-orange-400 group-hover:text-orange-300">
                {produto.ctaLabel} <ArrowRight size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
