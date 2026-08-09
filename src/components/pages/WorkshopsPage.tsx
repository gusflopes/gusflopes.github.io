import React from 'react';
import { ProdutoLanding, type LandingSection } from '../produto/ProdutoLanding';

const sections: LandingSection[] = [
  {
    heading: 'A pergunta que o encontro responde',
    kind: 'prose',
    body: [
      'Uma demonstração de IA é fácil de deixar bonita. Alguém abre a tela, digita uma pergunta, a resposta sai em três segundos e a sala inteira concorda. Meses depois, o mesmo sistema responde errado sobre o contrato de um cliente grande e ninguém consegue explicar por quê.',
      'A distância entre esses dois momentos não é sorte e não é matemática avançada: é um conjunto pequeno de decisões que dá para entender sem programar — de onde a resposta veio, o que o sistema faz quando não sabe, quem conferiu antes de ir ao ar e o que é medido depois. O encontro é sobre essas decisões: o que perguntar antes de aprovar, o que exigir por escrito, e que tipo de resposta de fornecedor deveria acender uma luz amarela.',
    ],
  },
  {
    heading: 'Como funciona um encontro',
    kind: 'steps',
    body: [
      'Começamos por um caso que todo mundo reconhece: um assistente que responde perguntas sobre os documentos da própria empresa. Fácil de imaginar, difícil de acertar.',
      'Abrimos a caixa. De onde a resposta veio, por que às vezes ela inventa, e qual a diferença entre o sistema dizer "não sei" e o sistema chutar com confiança.',
      'Traduzimos isso em perguntas que você faz na próxima reunião — para o time interno ou para o fornecedor — e no que a resposta deveria conter para você ficar tranquilo.',
      'Fechamos no que dá para medir. Não métrica de engenheiro: quantas vezes o sistema respondeu "não sei" em vez de chutar, quanto custou cada pergunta, quantas respostas alguém conferiu na mão. Números que cabem num slide e que você consegue defender quando alguém questionar.',
    ],
  },
  {
    heading: 'Para quem é',
    kind: 'bullets',
    body: [
      'Gestores que precisam aprovar ou barrar um projeto de IA sem ter como checar o que o time técnico está afirmando.',
      'Pessoas de negócio que saem da reunião com a decisão tomada e a explicação faltando.',
      'Quem fez ou está fazendo MBA, viu IA aparecer em três disciplinas seguidas e quer ver a coisa funcionando por dentro pelo menos uma vez.',
      'Quem contrata fornecedor de IA e quer avaliar a proposta, não a demonstração.',
    ],
  },
  {
    heading: 'O que você não vai encontrar aqui',
    kind: 'bullets',
    body: [
      'Slide de tendência, previsão sobre a próxima década e gráfico de adoção de mercado.',
      'Código na tela. Se aparecer algo em tela preta, é porque estou mostrando um erro — e vou traduzir.',
      'Venda de ferramenta. Não represento fornecedor nenhum e o encontro não termina em recomendação de produto.',
      'Sala com gente de uma empresa só. A inscrição é sua, e o grupo é misto de propósito: a dúvida de quem trabalha em outro setor costuma ser a que destrava a sua.',
    ],
  },
  {
    heading: 'Formato e datas',
    kind: 'prose',
    body: [
      'São dois formatos, e eu vou abrir um de cada vez: um encontro único, de uma tarde, para quem quer só a base; e um grupo de estudo com poucos encontros espaçados, para quem tem uma decisão em andamento e precisa voltar com ela.',
      'O grupo é pequeno por decisão minha. Com gente demais, ninguém faz a pergunta que estava com vergonha de fazer — e essa costuma ser a melhor pergunta do encontro.',
      'Data exata, duração e valor ainda não estão definidos. Estou montando a primeira turma agora e prefiro combinar isso com quem já levantou a mão a anunciar um calendário que vou mudar depois. Quem entra na lista recebe a proposta de formato antes de ela virar página.',
    ],
  },
];

export function WorkshopsPage() {
  return (
    <ProdutoLanding
      tone="aberto"
      eyebrow="Encontros ao vivo"
      title="O que perguntar antes de aprovar um projeto de IA."
      lead="Um encontro ao vivo, em grupo pequeno, para quem aprova projeto de IA, contrata fornecedor ou responde por um time que já usa essas ferramentas — e quer conseguir separar o que funciona do que só demonstra bem."
      prerequisite="Sem pré-requisito técnico. Você não vai escrever código, não vai instalar nada e não precisa saber o que é uma API. Se você já usou um chat de IA alguma vez, é o suficiente."
      sections={sections}
      cta={{
        heading: 'Entrar na lista da primeira turma',
        body: 'Ainda não há data marcada. Me escreva contando o que você faz e qual pergunta sobre IA você não conseguiu responder sozinho — é isso que define o exemplo que eu vou usar no encontro.',
        label: 'Quero saber quando abrir',
        mailtoSubject: 'Lista de espera — Workshop de IA para quem decide',
      }}
    />
  );
}
