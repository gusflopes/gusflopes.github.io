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
    "Engenharia de software, arquitetura, IA e DevOps por Gustavo Lopes.",
} as const;

export const author = {
  name: "Gustavo Lopes",
  role: "Tech Lead & Arquiteto de Software",
  bio: "Tech Lead & Arquiteto de Software. Especialista em traduzir complexidade de negócio em sistemas escaláveis através de DDD, Cloud e Estratégia.",
} as const;

export const socials = {
  // Perfil verificado.
  github: "https://github.com/gusflopes",
  // TODO(gusflopes): confirmar o handle real do LinkedIn — "gusflopes" é uma
  // suposição baseada nos demais perfis; ajustar aqui se for diferente.
  linkedin: "https://www.linkedin.com/in/gusflopes",
} as const;

export const newsletter = {
  name: "Newsletter",
  pitch:
    "Curadoria estratégica sobre o futuro da Engenharia de Software.",
  ctaLabel: "Assinar Newsletter",
  // TODO(gusflopes): criar a conta no Buttondown (https://buttondown.com) com o
  // username "gusflopes" — ou trocar esta action pelo endpoint do provedor
  // escolhido (o formulário faz POST padrão com o campo "email").
  action: "https://buttondown.com/api/emails/embed-subscribe/gusflopes",
} as const;
