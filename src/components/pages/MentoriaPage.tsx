import React from 'react';
import { Compass, Target, Users, MessageCircle } from 'lucide-react';
import { SubscribeForm } from '../SubscribeForm';

const audiences = [
  {
    icon: Target,
    title: 'Devs em transição pra senior/staff',
    description:
      'Quem está topando responsabilidades arquiteturais e precisa de um peer que já passou pela curva.',
  },
  {
    icon: Compass,
    title: 'Tech leads recém-promovidos',
    description:
      'Quem precisa equilibrar código, decisão de arquitetura e influência no time sem virar gerente.',
  },
  {
    icon: Users,
    title: 'Engenheiros que querem refinar foco',
    description:
      'Quem quer destravar uma direção técnica clara — DDD, .NET escala, IA aplicada — em vez de generalismo.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Discovery call',
    description:
      'Conversa de 30 minutos pra entender onde você está e o que quer destravar. Se fizer sentido, montamos um plano.',
  },
  {
    number: '02',
    title: 'Plano individual',
    description:
      '8 sessões em 3 meses. Cada sessão tem objetivo claro: arquitetura de um sistema real, refactor de código seu, decisão de carreira específica.',
  },
  {
    number: '03',
    title: 'Acompanhamento contínuo',
    description:
      'Entre sessões, canal direto pra dúvidas pontuais. Não é grupo de Discord — é WhatsApp comigo.',
  },
];

const faqs = [
  {
    q: 'Quando abre vagas?',
    a: 'Vou abrir 4-6 vagas por trimestre. Quem está na lista é avisado primeiro, antes de qualquer divulgação pública.',
  },
  {
    q: 'Tem pré-requisito?',
    a: 'Idealmente: ao menos 4 anos de experiência em desenvolvimento. Não é obrigatório, mas a conversa flui melhor.',
  },
  {
    q: 'É em português?',
    a: 'Sim, sessões em português. Materiais às vezes em inglês quando a fonte original é melhor.',
  },
  {
    q: 'Posso cancelar?',
    a: 'Sim, sem multa, com aviso de uma sessão de antecedência. Reembolso proporcional para sessões não realizadas.',
  },
];

export function MentoriaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="mb-24">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
            Mentoria 1-on-1
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
            Acompanhamento técnico para destravar a próxima curva
          </h1>
          <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
            8 sessões em 3 meses. Plano individual, exercícios práticos, decisões reais. Para quem
            quer sair do generalismo e construir uma direção técnica afiada.
          </p>
        </section>

        {/* Para quem é */}
        <section className="mb-24">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">Para quem é</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-orange-500/30 transition-colors"
                >
                  <Icon className="text-orange-500 mb-4" size={32} />
                  <h3 className="font-serif text-xl text-white mb-3">{a.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{a.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Como funciona */}
        <section className="mb-24">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">Como funciona</h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div
                key={s.number}
                className="flex gap-6 items-start border-l-4 border-orange-500/30 pl-6"
              >
                <div className="text-orange-500 font-mono text-2xl font-bold shrink-0">
                  {s.number}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lista de espera */}
        <section className="mb-24">
          <div className="bg-gradient-to-br from-orange-500/10 to-purple-900/10 border border-orange-500/20 rounded-2xl p-8 md:p-12">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
              Próxima turma
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Lista de espera — primeira turma online
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Quando abrir vagas, quem está nesta lista é avisado primeiro. Sem spam, sem
              divulgação pública antes — você é o primeiro a saber.
            </p>
            <SubscribeForm
              tag="mentoria-turma-1"
              source="mentoria"
              placeholder="seu@email.com"
              cta="Quero saber da próxima turma"
              successMessage="Pronto. Você é avisado primeiro quando abrir vagas."
              inputClassName="bg-slate-950/60 border border-slate-700 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1"
              buttonClassName="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md px-6 py-3 disabled:opacity-50 shrink-0"
            />
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12 flex items-center gap-3">
            <MessageCircle className="text-orange-500" size={32} />
            Dúvidas frequentes
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <details key={f.q} className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 group">
                <summary className="font-serif text-xl text-white cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-orange-500 text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-slate-400 mt-4 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
