/**
 * Configuração central do site gusflopes.dev.
 * Fonte única de verdade para nome, contato, redes sociais e newsletter.
 * Importada pelos componentes React (Header, Footer, Hero, NewsletterForm, Services).
 */

export const site = {
  name: "Gustavo Lopes",
  shortName: "gusflopes.dev",
  url: "https://gusflopes.dev",
  email: "gustavo@gusflopes.dev",
  description:
    "Adoção de IA enterprise sobre fundações de .NET, arquitetura distribuída e governança que resiste a auditoria.",
} as const;

export const author = {
  name: "Gustavo Lopes",
  role: "Tech Lead & Arquiteto de Software",
  bio: "Gustavo Lopes é Tech Lead e Arquiteto de Software, especializado em levar IA de piloto a produção em ambientes enterprise. Trabalha com .NET e sistemas distribuídos e ajuda empresas a adotar copilotos, agentes e RAG com a mesma disciplina de engenharia exigida de qualquer sistema crítico. Escreve quinzenalmente sobre engenharia de software, IA aplicada e .NET na newsletter Em Produção.",
} as const;

export const socials = {
  // Perfil verificado.
  github: "https://github.com/gusflopes",
  // TODO(gusflopes): confirmar o handle real do LinkedIn — "gusflopes" é uma
  // suposição baseada nos demais perfis; ajustar aqui se for diferente.
  linkedin: "https://www.linkedin.com/in/gusflopes",
} as const;

export const newsletter = {
  name: "Em Produção",
  pitch:
    "Análise quinzenal sobre IA aplicada, .NET e arquitetura — o que sobrevive ao contato com sistemas reais, dados proprietários e compliance. Sem hype, com código.",
  ctaLabel: "Assinar Em Produção",
  // TODO(gusflopes): criar a conta no Buttondown (https://buttondown.com) com o
  // username "gusflopes" — ou trocar esta action pelo endpoint do provedor
  // escolhido (o formulário faz POST padrão com o campo "email").
  action: "https://buttondown.com/api/emails/embed-subscribe/gusflopes",
} as const;
