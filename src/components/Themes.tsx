import React from 'react';
import { BrainCircuit, Network, Code2 } from 'lucide-react';
import bgImage from '../assets/326189a758fea0fe0e2da42349b6da943b29ba51.png?url';

export function Themes() {
  const themes = [
    {
      icon: <BrainCircuit size={32} />,
      title: "IA Aplicada ao Enterprise",
      description: "Copilotos, agentes e RAG do piloto à produção: arquiteturas de referência, avaliação contínua (evals), guardrails e governança proporcional ao risco. IA tratada como sistema crítico, não como experimento."
    },
    {
      icon: <Network size={32} />,
      title: "Engenharia de Software Sênior",
      description: "Sistemas distribuídos, DDD e fronteiras bem desenhadas — a base que determina se a IA entra com segurança ou vira passivo técnico. Arquitetura que sobrevive a escala, auditoria e troca de fornecedor."
    },
    {
      icon: <Code2 size={32} />,
      title: ".NET em Profundidade",
      description: ".NET 10, C# 14, performance e Microsoft.Extensions.AI: a plataforma que sustenta o backoffice das grandes empresas agora tem stack de IA nativo. Modernização de legado por caminho incremental, não big bang."
    }
  ];

  return (
    <section id="about" className="relative py-24 px-6 min-h-[800px] flex items-center justify-center overflow-hidden">
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
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Três pilares, uma disciplina
          </h2>
          <p className="font-sans text-lg text-slate-200 font-medium leading-relaxed drop-shadow-md">
            IA só chega à produção quando a engenharia já estava lá. Trabalho e escrevo na intersecção entre <span className="text-orange-400 font-bold">IA aplicada</span>, <span className="text-orange-400 font-bold">arquitetura de software</span> e <span className="text-orange-400 font-bold">.NET</span> — com o rigor que sistemas críticos exigem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {themes.map((theme, index) => (
            <div key={index} className="group relative h-full">
              <div className="h-full w-full rounded-xl bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] flex flex-col items-start text-left p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/90 hover:border-orange-400 hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]">
                <div className="mb-6 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {theme.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-4 leading-tight">
                  {theme.title}
                </h3>
                <p className="font-sans text-base text-slate-300 leading-relaxed">
                  {theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
