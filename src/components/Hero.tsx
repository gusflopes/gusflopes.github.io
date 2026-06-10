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
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            IA em produção não é demo. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              É engenharia.
            </span>
          </h1>

          <p className="font-sans text-xl md:text-2xl text-orange-100 font-medium max-w-2xl drop-shadow-md">
            Adoção de IA enterprise sobre fundações de <span className="text-orange-400">.NET</span>, <span className="text-orange-400">arquitetura distribuída</span> e <span className="text-orange-400">governança</span> que resiste a auditoria.
          </p>

          <p className="font-sans text-lg text-gray-300 max-w-xl leading-relaxed">
            A cada duas semanas escrevo sobre o que funciona — e o que quebra — quando copilotos, agentes e RAG encontram sistemas legados, dados proprietários e compliance. Sem hype, com código: assine a <span className="text-orange-400 font-semibold">Em Produção</span>.
          </p>

          <div className="pt-4 w-full max-w-lg">
            <NewsletterForm variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
