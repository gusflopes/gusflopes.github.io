import React from 'react';
import { NewsletterForm } from './NewsletterForm';
import bgImage from '../assets/326189a758fea0fe0e2da42349b6da943b29ba51.png?url';

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0 bg-fixed"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay Gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl space-y-6">
          <p className="font-sans text-sm md:text-base font-bold uppercase tracking-[0.2em] text-orange-400 drop-shadow-md">
            Estratégia · Arquitetura · Fluxo · IA aplicada
          </p>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            Engenharia e negócio, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              partes do mesmo sistema
            </span>
          </h1>

          <p className="font-sans text-xl md:text-2xl text-orange-100 font-medium max-w-2xl drop-shadow-md">
            Arquitetura, plataformas e IA aplicada para transformar complexidade em sistemas que evoluem.
          </p>

          <p className="font-sans text-lg text-gray-300 max-w-xl leading-relaxed">
            Conecto decisões técnicas aos objetivos da organização para ampliar autonomia, melhorar o fluxo de entrega e gerar valor continuamente.
          </p>

          <div className="pt-4 w-full max-w-lg">
            <p className="font-sans text-sm text-slate-300 mb-3">
              Análises sobre engenharia de software, estratégia e o impacto real da IA.
            </p>
            <NewsletterForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
