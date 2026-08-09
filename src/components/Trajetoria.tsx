import React from 'react';

export function Trajetoria() {
  return (
    <section id="trajetoria" className="relative bg-slate-950 py-24 px-6 overflow-hidden">
      {/* Âncora legada: links externos para /#about continuam caindo aqui */}
      <div id="about" className="absolute -top-20"></div>

      <div className="pointer-events-none absolute z-0 top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl">
          <span className="block mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-400">
            Trajetória
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-8">
            Direito primeiro, engenharia depois — e a segunda usa a primeira todo dia.
          </h2>

          <div className="space-y-6">
            <p className="font-sans text-lg text-slate-300 leading-relaxed">
              Comecei em Direito e Contabilidade. Fui advogado tributarista, presidi a Comissão de
              Direito Tributário da OAB/MS e atuei como administrador judicial em recuperação
              judicial — empresa quebrando, credor de um lado, juízo do outro e nenhuma resposta
              óbvia disponível. Dez anos assim ensinam uma coisa específica: operar sob pressão
              regulatória, com stakeholders que querem coisas incompatíveis entre si, e ainda
              assim entregar uma estrutura que sobreviva a quem for conferir depois.
            </p>
            <p className="font-sans text-lg text-slate-300 leading-relaxed">
              Em 2018 eu não deixei o Direito — adicionei engenharia. Vieram a pós em Engenharia de
              Software e o MBA em Liderança e Tecnologia, e junto com eles uma descoberta que não
              estava no programa de nenhum dos dois: a vantagem não era escrever código, era que
              quase ninguém no time entendia o problema de negócio no nível em que ele precisava
              ser entendido para virar software correto. Converter regra tácita em estrutura
              defensável já era o meu trabalho havia dez anos. Só mudou o artefato final.
            </p>
            <p className="font-sans text-lg text-slate-300 leading-relaxed">
              Hoje sou Tech Lead e Staff Engineer em financial services, com três squads e o
              sistema de pricing do varejo automotivo — um domínio onde decisão técnica e decisão
              comercial são a mesma decisão. Fui mentor de tecnologia no Porto Hack Santos 2025,
              edição com foco em IA. Escrevo e ensino engenharia de agentes.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 font-mono text-xs text-slate-400 leading-relaxed">
            <span className="uppercase tracking-[0.2em] text-slate-300">Formação acadêmica</span>
            <p className="mt-3">
              Direito · Contabilidade · Pós em Direito Tributário (IBET) · MBA em Finanças (FGV) ·
              Pós em Engenharia de Software · MBA em Liderança e Tecnologia (Ibmec)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
