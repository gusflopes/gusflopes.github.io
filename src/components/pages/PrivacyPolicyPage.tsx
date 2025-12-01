import React from 'react';

export function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-slate-950">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 font-bold">
            Política de Privacidade
          </h1>
          <p className="text-slate-400 font-sans text-sm uppercase tracking-wider">
            Última atualização: Dezembro/2025
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none font-sans text-slate-300 leading-relaxed">
          <p className="text-xl text-slate-200 mb-8 font-serif italic">
            Bem-vindo(a) ao Gusflopes.dev. A sua privacidade é prioridade. Esta política descreve como coleto, uso e protejo suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD) e alinhado às boas práticas internacionais (GDPR).
          </p>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">1. Quem controla seus dados</h2>
            <p>
              O controlador dos dados coletados neste site é Gustavo Lopes. Para dúvidas relacionadas a dados, entre em contato pelo e-mail: <a href="mailto:gustavo@gusflopes.dev" className="text-orange-400 hover:text-orange-300 transition-colors">gustavo@gusflopes.dev</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">2. Quais dados coletamos</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong className="text-white">Dados fornecidos voluntariamente:</strong> Nome e endereço de e-mail, coletados apenas quando você se inscreve na Newsletter ou preenche o formulário de contato.
              </li>
              <li>
                <strong className="text-white">Dados de navegação (Cookies):</strong> Informações anônimas coletadas via Google Analytics (ou similar) para entender como você usa o site, tempo de permanência e artigos mais lidos. Isso ajuda a melhorar o conteúdo técnico oferecido.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong className="text-white">Newsletter:</strong> Para enviar insights sobre Arquitetura de Software, DDD, IA e atualizações de carreira. (Você pode se descadastrar a qualquer momento através do link no rodapé dos e-mails).
              </li>
              <li>
                <strong className="text-white">Contato:</strong> Para responder às suas solicitações de consultoria, palestras ou dúvidas técnicas.
              </li>
              <li>
                <strong className="text-white">Melhoria contínua:</strong> Para analisar métricas de acesso e otimizar a performance do site.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">4. Compartilhamento de dados</h2>
            <p>
              Seus dados nunca serão vendidos. Eles podem ser compartilhados apenas com ferramentas essenciais para a operação deste site (ex: provedor de disparo de e-mails como Mailchimp/Substack e Google Analytics), que possuem suas próprias políticas de segurança rigorosas.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">5. Seus Direitos</h2>
            <p>
              Você tem o direito de solicitar o acesso, a correção ou a exclusão total dos seus dados pessoais da minha base a qualquer momento. Basta enviar um e-mail para <a href="mailto:gustavo@gusflopes.dev" className="text-orange-400 hover:text-orange-300 transition-colors">gustavo@gusflopes.dev</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl text-white font-bold mb-4 font-serif">6. Transferência Internacional</h2>
            <p>
              Como utilizo ferramentas globais, alguns dados podem ser processados em servidores fora do Brasil, garantindo sempre que esses parceiros sigam padrões internacionais de segurança de dados.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
