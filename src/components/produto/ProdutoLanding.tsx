import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type SectionKind = 'prose' | 'bullets' | 'steps' | 'faq';

export interface LandingSection {
  heading: string;
  kind: SectionKind;
  /** prose: parágrafos · bullets/steps: itens · faq: pares "Pergunta :: Resposta" */
  body: string[];
}

export interface ProdutoLandingProps {
  eyebrow: string;
  title: string;
  lead: string;
  prerequisite: string;
  sections: LandingSection[];
  cta: {
    heading: string;
    body: string;
    label: string;
    mailtoSubject: string;
  };
  /**
   * Registro da página (spec §7 — "o design system não muda, o registro pode mudar").
   * `tecnico`: voz display, serif 700, eyebrow em mono — leitor que escreve código.
   * `aberto`: voz editorial, serif 500, eyebrow em sans — leitor que decide e não programa.
   */
  tone?: 'tecnico' | 'aberto';
}

const MAILTO = 'gustavo@gusflopes.dev';

export function ProdutoLanding({
  eyebrow,
  title,
  lead,
  prerequisite,
  sections,
  cta,
  tone = 'tecnico',
}: ProdutoLandingProps) {
  const isAberto = tone === 'aberto';

  const eyebrowClass = isAberto
    ? 'block mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-orange-400'
    : 'block mb-4 font-mono text-xs uppercase tracking-[0.2em] text-orange-400';
  const h1Class = isAberto
    ? 'font-serif text-4xl md:text-6xl text-white leading-tight mb-6'
    : 'font-serif text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6';
  const h2Class = isAberto
    ? 'font-serif text-3xl md:text-4xl text-white leading-tight mb-6'
    : 'font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-6';

  const href = `mailto:${MAILTO}?subject=${encodeURIComponent(cta.mailtoSubject)}`;

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-orange-500/30 selection:text-white pt-24">
      <div className="pointer-events-none absolute z-0 top-40 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <a
          href="/#formacao"
          className="inline-flex items-center gap-2 mb-12 font-sans text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={14} /> Formação
        </a>

        <span className={eyebrowClass}>{eyebrow}</span>
        <h1 className={h1Class}>{title}</h1>
        <p className="font-sans text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mb-12">
          {lead}
        </p>

        <div className="mb-16 rounded-r-lg border-l-4 border-orange-500 bg-slate-900/50 p-8 font-sans text-base md:text-lg text-slate-200 leading-relaxed">
          {prerequisite}
        </div>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className={h2Class}>{section.heading}</h2>

              {section.kind === 'prose' && (
                <div className="space-y-6">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="font-sans text-lg text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {section.kind === 'bullets' && (
                <ul className="space-y-4">
                  {section.body.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-sans text-base md:text-lg text-slate-300 leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                      ></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.kind === 'steps' && (
                <ol className="space-y-6">
                  {section.body.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="shrink-0 font-mono text-xs text-orange-400 pt-2 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-base md:text-lg text-slate-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {section.kind === 'faq' && (
                <dl className="space-y-8">
                  {section.body.map((pair, i) => {
                    const [question, ...rest] = pair.split(' :: ');
                    return (
                      <div key={i}>
                        <dt className="font-serif text-xl text-white leading-snug mb-2">
                          {question}
                        </dt>
                        <dd className="font-sans text-base md:text-lg text-slate-300 leading-relaxed">
                          {rest.join(' :: ')}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 rounded-xl bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] p-8 md:p-12">
          <h2 className={h2Class + ' mb-0'}>{cta.heading}</h2>
          <p className="font-sans text-lg text-slate-300 leading-relaxed">{cta.body}</p>
          <a
            href={href}
            className="inline-flex items-center gap-2 font-sans font-bold text-lg text-white bg-orange-500 hover:bg-orange-600 px-8 h-14 rounded-md shadow-lg shadow-orange-900/50 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-500/50"
          >
            {cta.label} <ArrowRight size={18} />
          </a>
          <p className="font-mono text-xs text-slate-500">{MAILTO}</p>
        </div>
      </div>
    </main>
  );
}
