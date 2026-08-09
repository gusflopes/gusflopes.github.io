import React from 'react';
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
        <div className="max-w-4xl space-y-6">
          <span className="block font-mono text-xs uppercase tracking-[0.2em] text-orange-400 drop-shadow-md">
            Engenharia de agentes · Sistemas legados
          </span>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            Agentes de IA em sistema legado, rede fechada e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              empresa de verdade
            </span>.
          </h1>

          <p className="font-sans text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow-md">
            Tech Lead e Staff Engineer em financial services, no varejo automotivo. Antes disso,
            dez anos como advogado tributarista. Escrevo sobre o que separa uma demo de IA de um
            agente que a operação usa na segunda-feira.
          </p>
        </div>
      </div>
    </section>
  );
}
