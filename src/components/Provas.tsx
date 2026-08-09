import React from 'react';
import bgImage from '../assets/326189a758fea0fe0e2da42349b6da943b29ba51.png?url';

interface Prova {
  tag: string;
  title: string;
  body: string;
  mechanism: string;
}

const provas: Prova[] = [
  {
    tag: 'Prova 01',
    title: 'Última milha enterprise',
    body:
      'O que separa demo de produção não é o modelo. É extrair delta de um SQL Server de 2009 sem derrubar o transacional, expor regra de negócio como ferramenta que o agente chama com segurança, e passar pelo crivo do time de segurança.',
    mechanism:
      'Extração incremental, camada colunar consultada em milissegundos, contrato MCP, RBAC e mascaramento de PII.',
  },
  {
    tag: 'Prova 02',
    title: 'Tradução de domínio',
    body:
      'Dez anos como tributarista e administrador judicial foram dez anos convertendo regra tácita e contestada em estrutura que sobrevive a auditoria. É a mesma operação que transforma regra de negócio em ferramenta com critério de aceite por escrito — só muda o artefato final.',
    mechanism:
      'Hoje: sistema de pricing no varejo automotivo, três squads, decisão técnica indistinguível de decisão comercial.',
  },
  {
    tag: 'Prova 03',
    title: 'Prova por instrumentação',
    body:
      'IA em operação exige prova, não promessa. Agente só vai a produção passando em suíte de evals contra critérios definidos por escrito. Depois disso, cada interação gera registro auditável: qual pergunta, qual ferramenta, qual latência, qual custo por interação.',
    mechanism: 'Confiança aqui é critério de aceite, não adjetivo.',
  },
];

export function Provas() {
  return (
    <section id="provas" className="relative py-24 px-6 flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0 bg-fixed"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="mb-16 max-w-3xl">
          <span className="block mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-400 drop-shadow-md">
            Como eu trabalho
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            Três provas, cada uma com o mecanismo à vista.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
          {provas.map((prova) => (
            <div key={prova.tag} className="group relative h-full">
              <div className="h-full w-full flex flex-col items-start text-left rounded-xl bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/90 hover:border-orange-400 hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]">
                <span className="block mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-400">
                  {prova.tag}
                </span>
                <h3 className="font-serif text-xl font-bold text-white leading-tight mb-4">
                  {prova.title}
                </h3>
                <p className="font-sans text-base text-slate-300 leading-relaxed mb-6">
                  {prova.body}
                </p>
                <p className="mt-auto w-full border-t border-slate-800 pt-6 font-sans text-sm text-slate-400 leading-relaxed">
                  {prova.mechanism}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
