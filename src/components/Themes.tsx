import React from 'react';
import { Code2, Bot, BrainCircuit, Building2, Cloud } from 'lucide-react';
import bgImage from '../assets/326189a758fea0fe0e2da42349b6da943b29ba51.png?url';

export function Themes() {
  const themes = [
    {
      icon: <Code2 size={32} />,
      title: "Domínio & Arquitetura",
      description: "DDD, arquitetura de software e .NET para traduzir regras de negócio complexas em sistemas claros, resilientes e preparados para evoluir."
    },
    {
      icon: <Bot size={32} />,
      title: "Dados & IA Aplicada",
      description: "Data Mesh, agentes e IA aplicada com contexto, governança e propósito. Tecnologia emergente tratada como capacidade de negócio, não como demonstração."
    },
    {
      icon: <BrainCircuit size={32} />,
      title: "Fluxo & Entrega",
      description: "DevOps e DORA Metrics para tornar o trabalho visível, reduzir atritos e melhorar continuamente a capacidade de entregar software com qualidade."
    },
    {
      icon: <Building2 size={32} />,
      title: "Estratégia & Governança",
      description: "Decisões tecnológicas conectadas a valor, risco e sustentabilidade. Uma perspectiva formada também por Direito, Contabilidade e Gestão Financeira."
    },
    {
      icon: <Cloud size={32} />,
      title: "Times & Plataformas",
      description: "Team Topologies e Platform Engineering para criar limites claros, reduzir carga cognitiva e dar mais autonomia aos times de produto."
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
            Engenharia é mais do que código
          </h2>
          <p className="font-sans text-lg text-slate-200 font-medium leading-relaxed drop-shadow-md">
            Minha trajetória entre <span className="text-orange-400 font-bold">Direito, Contabilidade, gestão e tecnologia</span> moldou uma visão sistêmica da engenharia de software.
            Analiso domínio, arquitetura, times e fluxo de entrega como partes do mesmo problema: criar capacidade para o negócio evoluir.
          </p>
          <p className="font-sans text-base text-slate-300 leading-relaxed mt-5 drop-shadow-md">
            Hoje, aplico essa perspectiva como líder técnico no sistema de precificação de locação veicular de uma plataforma de mobilidade do Grupo Volkswagen.
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center">
          {/* Top Row - 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {themes.slice(0, 3).map((theme, index) => (
              <div key={index} className="group relative h-full">
                <div className="h-full w-full rounded-xl bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] flex flex-col items-start text-left p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/90 hover:border-orange-400 hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]">
                  <div className="mb-6 text-orange-400 group-hover:text-orange-300 transition-colors">
                    {theme.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-4 leading-tight">
                    {theme.title}
                  </h3>
                  <p className="font-sans text-base text-slate-300 leading-relaxed mb-6">
                    {theme.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl md:mt-2">
            {themes.slice(3, 5).map((theme, index) => (
              <div key={index + 3} className="group relative h-full">
                <div className="h-full w-full rounded-xl bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] flex flex-col items-start text-left p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/90 hover:border-orange-400 hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]">
                  <div className="mb-6 text-orange-400 group-hover:text-orange-300 transition-colors">
                    {theme.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-4 leading-tight">
                    {theme.title}
                  </h3>
                  <p className="font-sans text-base text-slate-300 leading-relaxed mb-6">
                    {theme.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
