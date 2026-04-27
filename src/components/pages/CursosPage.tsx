import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { SubscribeForm } from '../SubscribeForm';

const coverage = [
  'Arquitetura de Software aplicada — Bounded Contexts, decisões de modularização, comunicação entre serviços',
  'DDD na prática — modelagem do domínio sem perder produtividade no entrega',
  '.NET escalável — patterns que funcionam em sistemas grandes (não tutoriais hello-world)',
  'AI Engineering — orquestração de modelos, RAG, observabilidade de prompts',
  'Decisões técnicas que importam — o que documentar, o que automatizar, quando refatorar',
];

const audience = [
  'Devs sêniores que querem profundidade em vez de tutoriais superficiais',
  'Tech leads precisando alinhar time em conceitos centrais',
  'Engenheiros que buscam um curso BR-first com material denso e aplicado',
];

export function CursosPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="mb-24">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles size={16} /> Em construção — primeira turma online
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
            Cursos densos para engenharia de software aplicada
          </h1>
          <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
            Material BR-first, pensado para devs que já estão há anos no jogo e querem profundidade
            em arquitetura, DDD, .NET escalável e AI Engineering. Lista de espera para a primeira
            turma — quem está aqui é avisado antes de qualquer divulgação pública.
          </p>
        </section>

        {/* O que vai cobrir */}
        <section className="mb-24">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">
            O que vai cobrir
          </h2>
          <ul className="space-y-4">
            {coverage.map((item) => (
              <li key={item} className="flex gap-4 items-start">
                <CheckCircle2 className="text-orange-500 mt-1 shrink-0" size={20} />
                <span className="text-slate-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-500 text-sm mt-8 italic">
            Estrutura final será refinada com o feedback de quem entrar na lista.
          </p>
        </section>

        {/* Para quem é */}
        <section className="mb-24">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">Para quem é</h2>
          <ul className="space-y-3">
            {audience.map((item) => (
              <li
                key={item}
                className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 text-slate-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Lista de espera */}
        <section>
          <div className="bg-gradient-to-br from-orange-500/10 to-purple-900/10 border border-orange-500/20 rounded-2xl p-8 md:p-12">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
              Lista de espera
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Quero saber quando a primeira turma abrir
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Sem spam. Apenas um email com data, formato e preço quando estiver tudo pronto. Você
              decide na hora.
            </p>
            <SubscribeForm
              tag="curso-turma-1"
              source="cursos"
              placeholder="seu@email.com"
              cta="Quero entrar na lista"
              successMessage="Pronto. Você é o primeiro a saber quando abrir."
              inputClassName="bg-slate-950/60 border border-slate-700 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1"
              buttonClassName="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md px-6 py-3 disabled:opacity-50 shrink-0"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
