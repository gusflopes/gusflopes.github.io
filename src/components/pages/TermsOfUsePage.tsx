import React from 'react';

export function TermsOfUsePage() {
  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-slate-950">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 font-bold">
            Termos de Uso
          </h1>
          <p className="text-slate-400 font-sans text-sm uppercase tracking-wider">
            Última atualização: Dezembro/2025
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none font-sans text-slate-300 leading-relaxed">
          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">1. Aceitação</h2>
            <p>
              Ao acessar e utilizar o site <strong>Gusflopes.dev</strong>, você concorda com estes termos. O conteúdo deste site tem caráter educacional e informativo, focado em Engenharia de Software, Arquitetura e Liderança Técnica.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">2. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo original (textos, artigos, design, logotipos e vídeos) é de propriedade exclusiva de Gustavo Lopes, salvo indicação em contrário.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong className="text-white">Compartilhamento:</strong> Você é encorajado a compartilhar os links dos artigos e insights, desde que dê os devidos créditos (atribuição) ao autor e ao site original.
              </li>
              <li>
                <strong className="text-white">Reprodução:</strong> É proibida a cópia integral ou reprodução dos artigos em outros sites sem prévia autorização por escrito.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">3. Uso de Código e Exemplos Técnicos (Isenção de Responsabilidade)</h2>
            <p>
              Este site frequentemente compartilha snippets de código, diagramas de arquitetura (DDD, C4 Model) e exemplos de implementação.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong className="text-white">"As Is":</strong> Todo o código e informação técnica são fornecidos "como estão", para fins puramente educacionais.
              </li>
              <li>
                <strong className="text-white">Responsabilidade:</strong> Embora eu me esforce para garantir a precisão e segurança das informações, não me responsabilizo por eventuais danos, bugs ou perdas de dados decorrentes do uso direto desses códigos em seus ambientes de produção. Cabe a você, como engenheiro, validar e testar qualquer solução antes de implementá-la.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">4. Links Externos</h2>
            <p>
              O site pode conter links para sites de terceiros (ferramentas, documentações oficiais, etc.). Não possuo controle sobre o conteúdo ou políticas de privacidade desses sites externos.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">5. Alterações</h2>
            <p>
              Estes termos podem ser atualizados a qualquer momento para refletir mudanças na legislação ou no conteúdo do site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">6. Foro</h2>
            <p>
              Fica eleito o foro da comarca de São Paulo, Brasil, para dirimir quaisquer dúvidas oriundas destes termos.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
