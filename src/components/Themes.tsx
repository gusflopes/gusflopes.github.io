import React from 'react';
import { Code2, Bot, BrainCircuit, Building2, Cloud } from 'lucide-react';
import bgImage from '../assets/326189a758fea0fe0e2da42349b6da943b29ba51.png';

export function Themes() {
  const themes = [
    {
      icon: <Code2 size={32} />,
      title: ".NET & Software Architecture",
      description: "Arquitetura que escala o negócio, não apenas requisições. Sistemas distribuídos robustos, preparados para alta disponibilidade e evolução constante."
    },
    {
      icon: <Bot size={32} />,
      title: "Inovação & IA",
      description: "Metodologia 'Prototype First'. Acelerando a validação de hipóteses e MVPs utilizando Agentes de IA e automação inteligente para reduzir o time-to-market."
    },
    {
      icon: <BrainCircuit size={32} />,
      title: "Domain-Driven Design",
      description: "Modelagem estratégica onde o código fala a língua do negócio. Uso de Event Storming para descomplicar domínios complexos e definir Bounded Contexts precisos."
    },
    {
      icon: <Building2 size={32} />,
      title: "Governance & Strategic Alignment",
      description: "Visão analítica única: background jurídico e contábil aplicado à mitigação de riscos, Compliance e alinhamento real entre custos de nuvem (FinOps) e valor entregue."
    },
    {
      icon: <Cloud size={32} />,
      title: "Platform & DevOps Engineering",
      description: "Developer Experience (DX) que impulsiona a cultura de entrega. Foco em DORA metrics de elite através de plataformas self-service que os desenvolvedores amam usar."
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
            Visão Holística e Execução Técnica
          </h2>
          <p className="font-sans text-lg text-slate-200 font-medium leading-relaxed drop-shadow-md">
            A intersecção rara entre <span className="text-orange-400 font-bold">excelência em código</span> e <span className="text-orange-400 font-bold">estratégia de negócio</span>. 
            Especialização vertical em .NET com a amplitude horizontal necessária para conectar tecnologia a resultados.
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
                  <div className="mt-auto text-orange-500 font-bold text-sm uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                    Saiba mais
                  </div>
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
                  <div className="mt-auto text-orange-500 font-bold text-sm uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                    Saiba mais
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
