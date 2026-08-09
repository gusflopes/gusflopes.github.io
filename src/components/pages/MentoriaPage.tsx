import React from 'react';
import { ProdutoLanding, type LandingSection } from '../produto/ProdutoLanding';

const sections: LandingSection[] = [
  {
    heading: 'Com que tipo de problema isso funciona',
    kind: 'bullets',
    body: [
      'Transição de outra carreira para engenharia, com a bagagem anterior sendo tratada como dívida quando ela é vantagem — desde que você saiba converter.',
      'Engenheiro pleno que entrega bem e não sabe o que falta para sênior, porque ninguém nunca disse em voz alta.',
      'Primeira vez liderando tecnicamente: escrever o código ficou fácil, sustentar a decisão na reunião não.',
      'A bifurcação entre trilha técnica e gestão, e a suspeita de que a resposta depende de coisas que ninguém explicita.',
      'Preparar uma conversa difícil — promoção, mudança de time, saída — ensaiando o argumento com alguém que já sentou dos dois lados da mesa.',
    ],
  },
  {
    heading: 'Como a conversa acontece',
    kind: 'steps',
    body: [
      'Você escreve primeiro, por e-mail, contando onde está e o que travou. Escrever obriga a nomear o problema — e é assim que eu descubro se sou a pessoa certa.',
      'Se fizer sentido, marcamos a primeira conversa. Se não fizer, eu digo e explico por quê: te fazer perder tempo é pior do que não ter a conversa.',
      'A cadência a gente combina caso a caso. Não vendo pacote fechado de sessões, porque a frequência que serve para uma transição de carreira não é a mesma que serve para preparar uma conversa de promoção.',
      'Entre um encontro e outro, a régua é você ter feito alguma coisa: mandado o e-mail, escrito o documento, tido a conversa. Sem isso a sessão seguinte vira desabafo — desabafo é legítimo, mas não é o que você está pagando.',
    ],
  },
  {
    heading: 'O que a mentoria não é',
    kind: 'bullets',
    body: [
      'Não é revisão de código nem aula particular de tecnologia. Se o que falta é conhecimento específico, um curso estruturado cobre isso melhor do que uma conversa periódica — mentoria serve para decidir, não para aprender uma tecnologia.',
      'Não é indicação de vaga. Não tenho vaga para oferecer e não vou fingir que rede de contato é o produto.',
      'Não é garantia de promoção, aumento ou mudança de emprego. Nada do que eu faço controla a decisão que outra pessoa toma sobre a sua carreira.',
      'Não é terapia. Quando o que aparece na conversa é claramente outra coisa, eu falo isso em vez de seguir cobrando.',
      'Não é serviço contratado por empresa. Quem paga é você, a pauta é sua, e eu não comento o seu caso com ninguém: não vira exemplo em aula, não vira post, e não fica anotação com o seu nome.',
    ],
  },
  {
    heading: 'De onde eu falo',
    kind: 'prose',
    body: [
      'Eu fiz essa transição. Foram dez anos de Direito Tributário antes de escrever código para viver, o que significa que já ouvi as duas versões: a de que a experiência anterior não conta e a de que ela é o diferencial. Nenhuma das duas é verdade sozinha. O que decide é conseguir converter a bagagem em algo que o time reconheça como útil na terça-feira.',
      'Hoje sou Tech Lead e Staff Engineer em financial services, com três squads. Isso importa aqui por um motivo prático: as conversas sobre senioridade que a gente vai ter são as mesmas que eu tenho do outro lado da mesa, com quem reporta para mim.',
    ],
  },
  {
    heading: 'Valor e disponibilidade',
    kind: 'prose',
    body: [
      'Duração da sessão e quantas pessoas eu consigo atender ao mesmo tempo dependem de quanta agenda sobra fora do trabalho — por isso ainda não estão publicados aqui.',
      'O valor eu digo na primeira resposta, antes de marcar qualquer coisa: você não precisa contar a sua situação para descobrir o preço, e ele não muda conforme quem pergunta. Se naquele momento eu não tiver agenda, a resposta vai ser "agora não" — e ela vem rápido.',
    ],
  },
];

export function MentoriaPage() {
  return (
    <ProdutoLanding
      tone="tecnico"
      eyebrow="Mentoria individual"
      title="Uma conversa recorrente sobre a decisão que você está adiando."
      lead="Mentoria um a um para engenheiro em transição — de outra área para tecnologia, de pleno para sênior, de quem entrega para quem responde pela decisão. Não é aula e não tem currículo pronto: a pauta é o que está travado na sua semana."
      prerequisite='Individual, e não serve para todo mundo. O corte é este: você já escreve código no trabalho, mesmo que há pouco tempo, mesmo vindo de outra carreira. Quem ainda está estudando para conseguir a primeira vaga é mais bem servido por um curso estruturado — inclusive não o meu, que assume que você já programa — do que por uma conversa periódica comigo. E eu digo isso já na primeira resposta.'
      sections={sections}
      cta={{
        heading: 'Escrever antes de decidir',
        body: 'O primeiro passo é um e-mail e ele não compromete nada. Conte onde você está na carreira, o que travou e o que você já tentou. Se eu não for a pessoa certa, eu digo — e, quando eu souber, aponto o caminho que me parece melhor.',
        label: 'Mandar o primeiro e-mail',
        mailtoSubject: 'Mentoria — onde estou e o que travou',
      }}
    />
  );
}
