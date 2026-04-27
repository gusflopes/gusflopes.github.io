import React from 'react';
import { SubscribeForm } from './SubscribeForm';
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
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            A Ponte entre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              Negócios e Engenharia Avançada
            </span>
          </h1>
          
          <p className="font-sans text-xl md:text-2xl text-orange-100 font-medium max-w-2xl drop-shadow-md">
            <span className="text-orange-400">DDD</span>, <span className="text-orange-400">Cloud Native</span> e <span className="text-orange-400">Estratégia de IA</span> para resultados reais.
          </p>
          
          <p className="font-sans text-lg text-gray-300 max-w-xl leading-relaxed">
            Alinhando objetivos de negócio e excelência técnica para entregar software que gera valor contínuo.
          </p>
          
          <div className="pt-4 w-full max-w-lg">
            <SubscribeForm
              tag="newsletter"
              source="hero"
              placeholder="Digite seu e-mail..."
              cta="Assinar Newsletter"
              inputClassName="font-sans bg-slate-950/50 border border-slate-600 text-white placeholder:text-slate-400 h-14 text-lg focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none rounded-md px-4 flex-1"
              buttonClassName="font-sans bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 h-14 rounded-lg text-lg shadow-lg shadow-orange-900/20 transition-all hover:scale-105 shrink-0 disabled:opacity-50 disabled:hover:scale-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
