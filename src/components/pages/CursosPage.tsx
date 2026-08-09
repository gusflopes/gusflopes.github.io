import React from 'react';
import { ProdutoLanding, type LandingSection } from '../produto/ProdutoLanding';

const sections: LandingSection[] = [
  {
    heading: 'O que o curso cobre',
    kind: 'bullets',
    body: [
      'Extração incremental sobre banco legado: change tracking, marca d’água, janela de reprocessamento e o que fazer quando o schema muda sem aviso.',
      'Camada de leitura separada do transacional — por que o agente não consulta a mesma base que fecha a venda, e como manter as duas coerentes.',
      'Regra de negócio exposta como ferramenta: contrato MCP, descrição que o modelo consegue interpretar e o custo concreto de uma ferramenta mal nomeada.',
      'Autorização na borda: RBAC por ferramenta, propagação da identidade de quem perguntou e mascaramento de PII antes de o dado sair do banco.',
      'Evals como portão de homologação: critério escrito antes do código, suíte rodando no pipeline, e o que fazer com o caso que passa em nove de cada dez execuções.',
      'Observabilidade por interação: qual pergunta, qual ferramenta, qual latência, quantos tokens, quanto custou — e o que isso muda numa reunião de pós-incidente.',
    ],
  },
  {
    heading: 'De onde sai esse programa',
    kind: 'prose',
    body: [
      'Sou Tech Lead e Staff Engineer em financial services, com três squads. O sistema que vira material do curso é o que eu mantenho em produção: banco legado, rede fechada, revisão de segurança no caminho do deploy. Nada aqui é exemplo montado para a aula — é o que quebrou primeiro.',
      'O desenho de cada módulo já está decidido: começa numa restrição de ambiente corporativo — dado que não pode sair do perímetro, banco que ninguém tem autorização para alterar, revisão de segurança antes do deploy — e termina em código rodando contra ela. Não existe projeto de brinquedo: o sistema que a gente monta ao longo do curso tem legado, tem dado sensível e tem critério de aceite escrito antes da primeira linha.',
      'Formato, carga horária e calendário ainda não estão fechados. Prefiro anunciar data quando ela estiver definida a publicar uma que eu vou acabar movendo — quem entrar na lista recebe essa decisão junto com a abertura da turma.',
    ],
  },
  {
    heading: 'O que você sai sabendo fazer',
    kind: 'bullets',
    body: [
      'Escolher entre busca semântica, ferramenta determinística e consulta direta sabendo defender a escolha para quem não aceita "porque é o padrão".',
      'Desenhar o contrato de uma ferramenta e medir o efeito da mudança na suíte de eval — a mesma pergunta, dois contratos, a diferença em número.',
      'Escrever a suíte de evals antes de escrever o agente, e usar ela para segurar um deploy.',
      'Instrumentar o agente de forma que "está caro" vire um número por interação em vez de uma sensação na reunião de custo.',
      'Sustentar a conversa com segurança e compliance com resposta técnica, não com adjetivo.',
    ],
  },
  {
    heading: 'O que o curso não é',
    kind: 'bullets',
    body: [
      'Não é introdução a IA generativa. Prompt aparece só onde ele muda um número de eval.',
      'Não é tour de framework. A biblioteca da moda troca; o problema de extrair dado de legado sem derrubar o transacional não.',
      'Não é turma fechada. A inscrição é individual, sai no seu nome, e quem paga é a pessoa que vai assistir.',
      'Não é promessa de vaga, promoção ou faixa salarial. O curso ensina a construir a coisa; o que você faz com isso é seu.',
    ],
  },
  {
    heading: 'Antes que você pergunte',
    kind: 'faq',
    body: [
      'Preciso saber .NET? :: Os exemplos saem daí e a linguagem você traduz sem esforço — contrato de ferramenta, autorização na borda e eval são iguais em qualquer stack. O que não traduz de graça é o módulo de extração: change tracking é mecanismo de SQL Server, e em Postgres ou MySQL a mesma coisa se faz por replicação lógica, com outra janela de retenção. Eu mostro o mapeamento, mas não finjo que é a mesma configuração.',
      'Preciso já ter colocado um agente em produção? :: Não. Precisa ter colocado alguma coisa em produção. O curso assume familiaridade com deploy, log e banco — não com agente.',
      'Data, preço, certificado? :: Nada disso está fechado, e é de propósito: eu fecho o programa antes de fechar o comercial. O que já está decidido são os seis temas acima, a inscrição individual e a turma pequena na primeira rodada. O resto sai de uma vez, para a lista, antes de virar página.',
    ],
  },
];

export function CursosPage() {
  return (
    <ProdutoLanding
      tone="tecnico"
      eyebrow="Curso online · Engenharia de agentes"
      title="Engenharia de agentes para quem vai responder pelo deploy."
      lead="Um curso sobre a parte que não cabe numa demonstração: tirar delta de um banco de 2009 sem derrubar o transacional, expor regra de negócio como ferramenta que o agente chama com permissão, e provar acurácia com eval antes de descobrir o erro pelo chamado do cliente."
      prerequisite="Para quem escreve código. O curso assume que você lê SQL, sabe o que acontece numa chamada HTTP autenticada e já brigou com um deploy. Não existe módulo de introdução a programação e eu não vou explicar o que é um LLM."
      sections={sections}
      cta={{
        heading: 'Entrar na lista da primeira turma',
        body: 'Ainda não há data nem preço. O que existe é o programa acima e a decisão de não abrir turma antes de ele estar fechado. Me escreva contando o que você constrói hoje e onde o agente que você tentou levar para produção emperrou — eu leio todos e uso as respostas para calibrar os módulos.',
        label: 'Entrar na lista',
        mailtoSubject: 'Lista de espera — Curso de engenharia de agentes',
      }}
    />
  );
}
