export const meta = {
  name: 'evolucao-marca-gusflopes',
  description: 'Audita o site, define estratégia de marca pessoal, implementa melhorias e gera conteúdo inicial para gusflopes.dev',
  phases: [
    { title: 'Auditoria', detail: 'leitores paralelos: código, UX/copy, SEO/conteúdo' },
    { title: 'Estratégia', detail: '3 estrategistas independentes + 3 juízes + síntese' },
    { title: 'Fundação', detail: 'render markdown, rotas dinâmicas, SEO/RSS, copy de marca' },
    { title: 'Conteúdo', detail: 'curadoria de imagens e links reais + um agente por artigo' },
    { title: 'Verificação', detail: 'build, painel de revisão, correções' },
  ],
}

const ROOT = '/Users/gusflopes/source/gusflopes/gusflopes-website'
const TODAY = (args && args.today) || '2026-06-10'
const CATEGORIES = ['Arquitetura', '.NET', 'DevOps', 'Carreira', 'IA']

const CONTEXTO = [
  'Site pessoal gusflopes.dev de Gustavo Lopes (Tech Lead & Arquiteto de Software). Repositório em ' + ROOT + ', branch feat/brand-evolution (você pode editar arquivos diretamente, NUNCA rode git commit/push).',
  'Stack: Astro 6 + React 18 islands (Radix UI, Tailwind 4 via @tailwindcss/vite), conteúdo em Content Collections (src/content/{radar,insights}, schema Zod em src/content.config.ts), deploy Cloudflare Workers Static Assets. Idioma do site: pt-BR. Identidade visual: dark (slate-950) com acento laranja, headlines serif — deve ser MANTIDA (melhorias pontuais, não redesign).',
  'OBJETIVO DO DONO: página pessoal para promover a marca pessoal, publicar artigos e notícias técnicas, evoluir para newsletter e construir audiência. Foco editorial: Engenharia de Software, IA e .NET. Objetivo comercial: promover adoção de IA em clientes enterprise, posicionando Gustavo como ESPECIALISTA em adoção de IA combinada com engenharia de software sênior.',
  'Hoje é ' + TODAY + '. O site deve parecer no ar há ~6 meses (conteúdo retroativo de Dez/2025 até hoje).',
  'NÃO toque em: CLAUDE.md, .claude, .mcp.json, pnpm-workspace.yaml. NÃO rode pnpm add/install (dependências já instaladas: @astrojs/rss, @astrojs/sitemap, @tailwindcss/typography).',
].join('\n')

const CONTRATO = [
  'CONTRATO DE FRONTMATTER (combinado entre todos os agentes — siga exatamente):',
  '- radar: title, excerpt, date ("YYYY-MM-DD"), duration ("N min"), category (exatamente um de: ' + CATEGORIES.join(', ') + '), type ("article"|"video"), isExternal (boolean), link, source, image (URL absoluta).',
  '- insights: title, excerpt, date ("YYYY-MM-DD"), duration ("N min"), category (mesmo enum), image (URL absoluta).',
  '- Datas ISO YYYY-MM-DD no frontmatter; a formatação pt-BR de exibição (ex: "10 Jun, 2026") acontece no código de renderização.',
  '- Arquivos nomeados por slug kebab-case: src/content/insights/<slug>.md e src/content/radar/<slug>.md.',
  '- Contrato de SEO entre páginas e layout: o layout src/layouts/Default.astro aceita props { title, description, image, type, publishedDate } — páginas passam, layout renderiza as meta tags.',
].join('\n')

const FINDING = {
  type: 'object',
  properties: {
    area: { type: 'string' },
    severity: { type: 'string', enum: ['critico', 'importante', 'menor'] },
    description: { type: 'string' },
    files: { type: 'array', items: { type: 'string' } },
  },
  required: ['area', 'severity', 'description'],
}

const AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    currentCopy: { type: 'string', description: 'resumo fiel da copy/estrutura atual das seções analisadas, para uso dos estrategistas' },
    findings: { type: 'array', items: FINDING },
  },
  required: ['summary', 'currentCopy', 'findings'],
}

const CAL_ITEM = {
  type: 'object',
  properties: {
    slug: { type: 'string', description: 'kebab-case, sem acentos' },
    title: { type: 'string' },
    excerpt: { type: 'string', description: '1-2 frases pt-BR' },
    category: { type: 'string', enum: CATEGORIES },
    date: { type: 'string', description: 'YYYY-MM-DD entre 2025-12-01 e ' + TODAY },
    duration: { type: 'string', description: 'ex: "9 min"' },
    outline: { type: 'array', items: { type: 'string' }, description: '4-6 bullets técnicos do que o artigo cobre' },
    keyTakeaway: { type: 'string' },
  },
  required: ['slug', 'title', 'excerpt', 'category', 'date', 'duration', 'outline', 'keyTakeaway'],
}

const STRATEGY_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    positioningStatement: { type: 'string' },
    heroCopy: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        highlight: { type: 'string', description: 'trecho da headline que recebe o gradiente laranja' },
        subheadline: { type: 'string' },
        supporting: { type: 'string' },
      },
      required: ['headline', 'highlight', 'subheadline', 'supporting'],
    },
    themePillars: {
      type: 'array',
      items: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } }, required: ['title', 'description'] },
    },
    servicesCopy: {
      type: 'array',
      items: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } }, required: ['title', 'description'] },
    },
    aboutBio: { type: 'string', description: 'bio do autor, 2-3 frases, usada no footer de artigos e seção sobre' },
    newsletter: {
      type: 'object',
      properties: { name: { type: 'string' }, pitch: { type: 'string' }, ctaLabel: { type: 'string' } },
      required: ['name', 'pitch', 'ctaLabel'],
    },
    contentCalendar: {
      type: 'object',
      properties: {
        insights: { type: 'array', items: CAL_ITEM, description: 'exatamente 8 artigos longform próprios' },
        radarLocal: { type: 'array', items: CAL_ITEM, description: 'exatamente 4 artigos locais do radar' },
      },
      required: ['insights', 'radarLocal'],
    },
    siteChanges: {
      type: 'array',
      items: { type: 'object', properties: { change: { type: 'string' }, priority: { type: 'string' } }, required: ['change'] },
    },
  },
  required: ['lens', 'positioningStatement', 'heroCopy', 'themePillars', 'servicesCopy', 'aboutBio', 'newsletter', 'contentCalendar', 'siteChanges'],
}

const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lens: { type: 'string' },
          alinhamento: { type: 'number' },
          diferenciacao: { type: 'number' },
          viabilidade: { type: 'number' },
          comentario: { type: 'string' },
        },
        required: ['lens', 'alinhamento', 'diferenciacao', 'viabilidade', 'comentario'],
      },
    },
    vencedora: { type: 'string' },
    melhoresIdeiasDasOutras: { type: 'array', items: { type: 'string' } },
  },
  required: ['scores', 'vencedora'],
}

const IMPL_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    filesTouched: { type: 'array', items: { type: 'string' } },
    pendencias: { type: 'array', items: { type: 'string' }, description: 'coisas que o dono do site precisa decidir/confirmar' },
  },
  required: ['summary', 'filesTouched', 'pendencias'],
}

const IMAGES_SCHEMA = {
  type: 'object',
  properties: {
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          themes: { type: 'array', items: { type: 'string' }, description: 'tags usando o enum de categorias: ' + CATEGORIES.join(', ') },
        },
        required: ['url', 'themes'],
      },
    },
  },
  required: ['images'],
}

const EXTERNAL_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          excerpt: { type: 'string' },
          date: { type: 'string' },
          duration: { type: 'string' },
          category: { type: 'string', enum: CATEGORIES },
          type: { type: 'string', enum: ['article', 'video'] },
          link: { type: 'string' },
          source: { type: 'string' },
        },
        required: ['title', 'excerpt', 'date', 'duration', 'category', 'type', 'link', 'source'],
      },
    },
  },
  required: ['items'],
}

const WRITE_SCHEMA = {
  type: 'object',
  properties: { file: { type: 'string' }, slug: { type: 'string' }, words: { type: 'number' } },
  required: ['file', 'slug', 'words'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: { success: { type: 'boolean' }, attempts: { type: 'number' }, notes: { type: 'string' } },
  required: ['success', 'attempts', 'notes'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['critico', 'importante', 'menor'] },
          file: { type: 'string' },
          description: { type: 'string' },
          suggestion: { type: 'string' },
        },
        required: ['severity', 'description', 'suggestion'],
      },
    },
  },
  required: ['summary', 'findings'],
}

const FIX_SCHEMA = {
  type: 'object',
  properties: {
    applied: { type: 'array', items: { type: 'string' } },
    skipped: { type: 'array', items: { type: 'string' } },
    rebuildSuccess: { type: 'boolean' },
  },
  required: ['applied', 'skipped', 'rebuildSuccess'],
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// ============ FASE 1: AUDITORIA ============
phase('Auditoria')
log('Auditando código, UX/copy e SEO em paralelo...')

const audits = await parallel([
  () => agent([
    CONTEXTO,
    'Você é um auditor de CÓDIGO/ARQUITETURA. Leia (somente leitura, não edite nada): NEXT_STEPS.md, astro.config.mjs, src/content.config.ts, src/pages/** (todas as rotas), src/layouts/Default.astro, src/components/pages/** e src/components/LatestContent.tsx.',
    'Produza: (1) mapa conciso da arquitetura atual de rotas/dados; (2) verificação de quais itens do NEXT_STEPS.md ainda procedem; (3) findings adicionais de código que o NEXT_STEPS não cobre (bugs, dados hardcoded que deviam vir das coleções, props ignoradas, etc.).',
    'No campo currentCopy, resuma como os dados fluem hoje (o que é hardcoded vs o que vem das coleções).',
  ].join('\n\n'), { label: 'audit:codigo', schema: AUDIT_SCHEMA }),
  () => agent([
    CONTEXTO,
    'Você é um auditor de UX e COPY. Leia (somente leitura, não edite nada): src/components/Hero.tsx, Themes.tsx, Services.tsx, Header.tsx, Footer.tsx, LatestContent.tsx e src/components/pages/{HomePage,RadarPage,InsightsPage,RadarArticlePage,ArticlePage2}.tsx.',
    'Produza: (1) no campo currentCopy, transcrição/resumo FIEL de toda a copy atual por seção (headline do hero, pilares de temas, serviços, footer, CTAs) — os estrategistas vão trabalhar em cima disso sem ler o código; (2) findings de UX: elementos mortos (botões sem handler, links href="#", forms sem submit, paginação fake), hierarquia, microcopy, consistência de tom; (3) avalie o quão bem a copy atual comunica o posicionamento desejado (especialista em adoção de IA enterprise + engenharia .NET) e onde ela falha.',
  ].join('\n\n'), { label: 'audit:ux-copy', schema: AUDIT_SCHEMA }),
  () => agent([
    CONTEXTO,
    'Você é um auditor de SEO e CONTEÚDO. Leia (somente leitura, não edite nada): src/layouts/Default.astro, src/pages/**, src/content/radar/*.md, src/content/insights/*.md, src/content.config.ts, e verifique a existência de favicon/robots/sitemap/RSS em public/ e src/pages/.',
    'Produza findings sobre: meta tags ausentes (OG, twitter card, canonical), favicon, sitemap, RSS, semântica de headings, taxonomia/frontmatter das coleções (datas como string de exibição impedem ordenação, falta de slug significativo nos nomes de arquivo, corpos placeholder), e qualquer outro gap de SEO/distribuição para um site de conteúdo que quer crescer audiência.',
    'No campo currentCopy, resuma o estado do conteúdo atual (quantos itens, categorias, qualidade dos corpos).',
  ].join('\n\n'), { label: 'audit:seo-conteudo', schema: AUDIT_SCHEMA }),
])

const auditsOk = audits.filter(Boolean)
const digestAuditoria = auditsOk
  .map((a, i) => '--- AUDITORIA ' + (i + 1) + ' ---\nRESUMO: ' + a.summary + '\nESTADO ATUAL: ' + a.currentCopy + '\nFINDINGS:\n' + a.findings.map(f => '[' + f.severity + '] ' + f.area + ': ' + f.description).join('\n'))
  .join('\n\n')
log('Auditoria concluída: ' + auditsOk.reduce((n, a) => n + a.findings.length, 0) + ' findings em ' + auditsOk.length + ' frentes')

// ============ FASE 2: ESTRATÉGIA ============
phase('Estratégia')
log('3 estrategistas independentes elaborando propostas...')

const LENTES = [
  { key: 'autoridade', brief: 'LENTE: AUTORIDADE TÉCNICA. Priorize credibilidade e profundidade — o site deve fazer um CTO/diretor de engenharia enterprise pensar "essa pessoa entende de verdade de IA aplicada e de engenharia .NET séria". Posicionamento de especialista, conteúdo denso, prova de competência.' },
  { key: 'audiencia', brief: 'LENTE: CRESCIMENTO DE AUDIÊNCIA. Priorize a máquina de conteúdo + newsletter — taxonomia clara, cadência realista, títulos que dão vontade de clicar e assinar, newsletter com proposta de valor explícita e nome próprio. O site é um funil de assinantes.' },
  { key: 'conversao', brief: 'LENTE: CONVERSÃO COMERCIAL. Priorize transformar visitantes em conversas de consultoria — serviços articulados como ofertas de adoção de IA enterprise, CTAs de contato claros, copy orientada a dor de negócio (produtividade, governança, ROI de IA), prova social estrutural.' },
]

const briefEstrategista = (lente) => [
  CONTEXTO,
  CONTRATO,
  lente.brief,
  'Auditorias do site atual:\n' + digestAuditoria,
  'TAREFA: produza uma estratégia COMPLETA de evolução do site segundo sua lente. Restrições:',
  '- Manter a identidade visual e a estrutura de seções existente (Hero com form de newsletter, Temas/pilares, Serviços, Últimos conteúdos, Radar = curadoria/notícias, Insights = artigos longform próprios). Você define COPY e CONTEÚDO, não redesign estrutural.',
  '- heroCopy: headline forte (highlight é o trecho que recebe gradiente laranja — deve ser substring exata da headline), subheadline e supporting em pt-BR. Evite clichês de IA e buzzword vazio; concretude vende.',
  '- themePillars: 3 pilares alinhados a Engenharia de Software, IA e .NET. servicesCopy: 3-4 ofertas orientadas a adoção de IA enterprise (ex: assessment de adoção, copilotos/agentes em produção, modernização .NET com IA, capacitação de times).',
  '- newsletter: dê NOME próprio à newsletter (memorável, pt-BR ou bilíngue curto), pitch de 1-2 frases e label do CTA.',
  '- contentCalendar: EXATAMENTE 8 insights (artigos longform próprios) + 4 radarLocal (artigos locais mais curtos de análise/curadoria). Datas espalhadas de 2025-12-01 até ' + TODAY + ' com cadência realista (~2/mês), nenhuma data futura. Distribuição de categorias coerente com o foco (IA dominante, .NET e Arquitetura fortes, no máximo 1 Carreira). Títulos ESPECÍFICOS (ex: "Copilotos internos com dados proprietários: o que aprendi em 3 rollouts" e não "O futuro da IA"). Temas devem refletir o estado da arte até a data de cada artigo (ex: .NET 10 GA em nov/2025, agentes de IA, MCP, RAG em produção, governança de IA, GitHub Copilot/Claude em times enterprise).',
  '- aboutBio: bio de autor que sustenta o posicionamento sem inventar credenciais verificáveis falsas (sem números de clientes inventados, sem empresas nomeadas).',
  '- siteChanges: mudanças priorizadas que sua estratégia exige no site.',
].join('\n\n')

const strategies = (await parallel(
  LENTES.map(l => () => agent(briefEstrategista(l), { label: 'estrategia:' + l.key, schema: STRATEGY_SCHEMA }))
)).filter(Boolean)

log(strategies.length + ' estratégias prontas; painel de juízes avaliando...')

const briefJuiz = (foco) => [
  CONTEXTO,
  'Você é um JUIZ de estratégia de marca pessoal para um site de especialista técnico. Seu foco de avaliação: ' + foco,
  'Avalie as ' + strategies.length + ' estratégias abaixo. Dê notas 1-10 em alinhamento (com o objetivo do dono), diferenciacao (vs outros sites de dev/consultores de IA) e viabilidade (executável hoje, conteúdo crível). Aponte a vencedora pelo campo lens e liste as melhores ideias das perdedoras que valem enxertar.',
  'ESTRATÉGIAS:\n' + JSON.stringify(strategies, null, 1),
].join('\n\n')

const judges = (await parallel([
  () => agent(briefJuiz('o leitor-alvo: um decisor técnico enterprise (CTO, head de engenharia) avaliando se essa pessoa é a especialista certa para guiar adoção de IA.'), { label: 'juiz:decisor', schema: JUDGE_SCHEMA }),
  () => agent(briefJuiz('crescimento de audiência: o que faz um dev/arquiteto assinar a newsletter e voltar toda semana; títulos, taxonomia e proposta de valor do conteúdo.'), { label: 'juiz:audiencia', schema: JUDGE_SCHEMA }),
  () => agent(briefJuiz('credibilidade e risco: o que soa inflado, genérico ou inventado; o calendário é tecnicamente plausível e datado de forma coerente; a copy é executável sem prova social que não existe.'), { label: 'juiz:credibilidade', schema: JUDGE_SCHEMA }),
])).filter(Boolean)

const final = await agent([
  CONTEXTO,
  CONTRATO,
  'Você é o SINTETIZADOR. Abaixo estão 3 estratégias independentes e os pareceres de 3 juízes. Produza a estratégia FINAL única: parta da vencedora apontada pelos juízes, enxerte as melhores ideias das outras, e corrija tudo que os juízes marcaram como inflado/genérico/incoerente.',
  'Regras da síntese: mesmas restrições dadas aos estrategistas (8 insights + 4 radarLocal exatos; datas 2025-12-01 a ' + TODAY + ' sem datas futuras e bem espalhadas; highlight é substring exata da headline; categorias do enum; slugs kebab-case sem acento; sem credenciais inventadas). Defina lens como "sintese".',
  'ESTRATÉGIAS:\n' + JSON.stringify(strategies, null, 1),
  'PARECERES DOS JUÍZES:\n' + JSON.stringify(judges, null, 1),
].join('\n\n'), { label: 'sintese-final', schema: STRATEGY_SCHEMA })

if (!final) throw new Error('Síntese de estratégia falhou')

final.contentCalendar.insights = (final.contentCalendar.insights || []).slice(0, 8).map(i => ({ ...i, slug: slugify(i.slug || i.title) }))
final.contentCalendar.radarLocal = (final.contentCalendar.radarLocal || []).slice(0, 4).map(i => ({ ...i, slug: slugify(i.slug || i.title) }))
log('Estratégia final: "' + final.positioningStatement.slice(0, 120) + '..." | Newsletter: ' + final.newsletter.name + ' | Calendário: ' + final.contentCalendar.insights.length + ' insights + ' + final.contentCalendar.radarLocal.length + ' radar locais')

const resumoEstrategia = [
  'ESTRATÉGIA APROVADA (aplique fielmente):',
  'Posicionamento: ' + final.positioningStatement,
  'Hero: headline="' + final.heroCopy.headline + '" | highlight="' + final.heroCopy.highlight + '" | sub="' + final.heroCopy.subheadline + '" | supporting="' + final.heroCopy.supporting + '"',
  'Pilares: ' + final.themePillars.map(p => p.title + ' — ' + p.description).join(' || '),
  'Serviços: ' + final.servicesCopy.map(s => s.title + ' — ' + s.description).join(' || '),
  'Bio do autor: ' + final.aboutBio,
  'Newsletter: "' + final.newsletter.name + '" — ' + final.newsletter.pitch + ' (CTA: "' + final.newsletter.ctaLabel + '")',
].join('\n')

// ============ FASES 3+4 EM PARALELO: FUNDAÇÃO + CONTEÚDO ============
log('Iniciando implementação (3 agentes) e produção de conteúdo (curadoria + redatores) em paralelo...')

const trilhoFundacao = async () => {
  const resultados = await parallel([
    // C1 — infraestrutura de conteúdo
    () => agent([
      CONTEXTO,
      CONTRATO,
      resumoEstrategia,
      'Você é o implementador de INFRAESTRUTURA DE CONTEÚDO. Outros agentes estão editando outros arquivos em paralelo. Você possui EXCLUSIVAMENTE: src/content.config.ts, src/pages/** (EXCETO não crie src/pages/rss.xml.ts — é de outro agente), src/components/pages/**, src/components/LatestContent.tsx, src/index.css e novos arquivos em src/lib/. NÃO edite src/components/{Hero,Themes,Services,Header,Footer}.tsx, src/layouts/Default.astro, astro.config.mjs nem public/.',
      'Leia NEXT_STEPS.md (itens 1, 2, 3, 5) e implemente:',
      '1. Schemas Zod conforme o CONTRATO (date ISO YYYY-MM-DD validada com regex; adicionar duration em insights).',
      '2. APAGUE os 12 placeholders src/content/radar/{1..6}.md e src/content/insights/{1..6}.md. NÃO crie conteúdo novo — redatores estão criando arquivos <slug>.md em paralelo seguindo o CONTRATO. Escreva o código contra o CONTRATO, não contra os arquivos presentes no momento.',
      '3. Corpo dos artigos renderizado de verdade: em src/pages/radar/article/[id].astro use getStaticPaths + render(entry) (Astro 6: import { render } from "astro:content"; a API antiga entry.render() não existe mais — confirme a forma correta nos types de node_modules/astro se precisar). Converta RadarArticlePage.tsx num SHELL genérico que recebe frontmatter via props (title, excerpt, category, dateFormatted, duration, image) e o corpo via children (slot) — mantenha o visual atual (header sticky com voltar, hero image, blockquote/prose styling, author footer com a bio da estratégia), removendo todo o conteúdo DDD hardcoded.',
      '4. Mesma coisa para insights: renomeie src/pages/insights/article.astro para src/pages/insights/article/[id].astro com getStaticPaths da coleção insights; transforme ArticlePage2.tsx num shell análogo (renomeie para InsightArticlePage.tsx); atualize os links em InsightsPage.tsx para /insights/article/<id>.',
      '5. Estilo do corpo markdown: adicione @plugin "@tailwindcss/typography"; no src/index.css e aplique classes prose prose-invert no wrapper do corpo (siga o estilo prose já usado no shell atual). Code blocks vêm do Shiki do Astro — garanta que fiquem legíveis no tema dark (pode configurar shikiConfig? NÃO — astro.config.mjs é de outro agente; se precisar de tema Shiki, estilize via CSS no index.css; o tema default github-dark costuma bastar).',
      '6. RadarPage.tsx, InsightsPage.tsx e LatestContent.tsx: todos os dados vêm das coleções via props (nada de arrays hardcoded). Crie src/lib/format.ts com formatador de data pt-BR (ISO -> "10 Jun, 2026"). Ordene tudo por date desc. index.astro busca as coleções e passa os itens mais recentes para HomePage -> LatestContent (HomePage.tsx é seu; Hero/Themes/Services continuam imports sem props). Em RadarPage, itens isExternal abrem o link externo em nova aba; itens locais vão para /radar/article/<id>.',
      '7. Remova a paginação fake do InsightsPage.',
      '8. Botões Share/Bookmark dos shells de artigo: implemente Share com Web Share API + fallback de copiar link (estado "copiado"); remova o Bookmark.',
      '9. Páginas passam props de SEO ao layout: <Default title description image type="article" publishedDate> nas páginas de artigo; title/description decentes nas demais. O layout aceitará essas props (outro agente está implementando — apenas passe-as).',
      '10. NÃO rode pnpm build (o conteúdo está sendo regenerado em paralelo, o build vai falhar por motivos alheios a você). Valide por leitura cuidadosa e astro check se quiser (pode falhar pelas coleções vazias — ignore erros de conteúdo ausente).',
      'Reporte summary, filesTouched e pendências.',
    ].join('\n\n'), { label: 'impl:conteudo', phase: 'Fundação', schema: IMPL_SCHEMA }),

    // C2 — marca e copy
    () => agent([
      CONTEXTO,
      resumoEstrategia,
      'Você é o implementador de MARCA/COPY. Outros agentes editam outros arquivos em paralelo. Você possui EXCLUSIVAMENTE: src/components/Hero.tsx, Themes.tsx, Services.tsx, Header.tsx, Footer.tsx, e os novos src/config/site.ts e src/components/NewsletterForm.tsx. NÃO edite src/components/pages/**, src/components/LatestContent.tsx, src/pages/**, src/layouts/**, src/content*, astro.config.mjs, src/index.css.',
      'Implemente:',
      '1. src/config/site.ts: constantes do site — nome, domínio https://gusflopes.dev, email de contato gustavo@gusflopes.dev (já usado no footer atual), socials { github: "https://github.com/gusflopes" (verificado), linkedin: "https://www.linkedin.com/in/gusflopes" com comentário TODO para o dono confirmar o handle }, newsletter { name, pitch, ctaLabel da estratégia, action: "https://buttondown.com/api/emails/embed-subscribe/gusflopes" com comentário TODO: criar conta no Buttondown ou trocar o provedor }.',
      '2. NewsletterForm.tsx: componente reutilizável (prop variant: "hero" | "footer" para tamanhos) — form HTML com method POST para a action do config, input email required com placeholder pt-BR, botão com o ctaLabel, estado de submitting, honeypot simples opcional. Sem fetch/JS de rede: POST de formulário padrão (Buttondown embed-subscribe aceita). Estilo consistente com o atual (Input/Button de ui/).',
      '3. Hero.tsx: aplicar heroCopy da estratégia (highlight é substring exata da headline — mantenha o gradiente laranja nela) e substituir o par Input+Button atual pelo NewsletterForm variant hero, mantendo o restante do visual.',
      '4. Themes.tsx e Services.tsx: aplicar pilares e serviços da estratégia mantendo a estrutura visual existente (leia os componentes primeiro; adapte ícones lucide se houver).',
      '5. Header.tsx: botão "Contato" vira link mailto do config; garanta que a lógica de auto-esconder em páginas de artigo cubra por PREFIXO tanto /radar/article/ quanto /insights/article/ (a rota de insights vira /insights/article/<id>).',
      '6. Footer.tsx: pitch da newsletter da estratégia + NewsletterForm variant footer; socials reais do config (remova ícones sem perfil: Youtube e Twitter saem); © 2026; email do config; demais links mantidos.',
      '7. NÃO mude exports nem assinaturas públicas: Hero/Themes/Services continuam exports nomeados sem props; Header mantém a prop pathname.',
      '8. NÃO rode pnpm build (conteúdo sendo regenerado em paralelo).',
      'Capriche na copy: pt-BR, concreta, sem clichê de IA. Reporte summary, filesTouched e pendências (ex: confirmar handle LinkedIn, criar conta Buttondown, confirmar mailbox gustavo@gusflopes.dev).',
    ].join('\n\n'), { label: 'impl:marca', phase: 'Fundação', schema: IMPL_SCHEMA }),

    // C3 — SEO, layout, RSS, sitemap
    () => agent([
      CONTEXTO,
      CONTRATO,
      resumoEstrategia,
      'Você é o implementador de SEO/DISTRIBUIÇÃO. Outros agentes editam outros arquivos em paralelo. Você possui EXCLUSIVAMENTE: src/layouts/Default.astro, astro.config.mjs, public/** e o novo src/pages/rss.xml.ts (único arquivo que você pode criar em src/pages/). NÃO edite outros arquivos de src/pages, src/components/**, src/content*, src/index.css.',
      'Dependências JÁ instaladas: @astrojs/rss, @astrojs/sitemap. Implemente:',
      '1. astro.config.mjs: adicionar site: "https://gusflopes.dev" e a integration sitemap() (mantenha os aliases existentes intactos).',
      '2. Default.astro: aceitar props { title, description, image, type, publishedDate } com defaults sensatos; título no padrão "<title> — gusflopes.dev" (home só "gusflopes.dev — <tagline curta da estratégia>"); meta description; canonical via new URL(Astro.url.pathname, Astro.site); Open Graph completo (og:title, og:description, og:type [website|article], og:url, og:image absoluta, og:locale pt_BR); twitter:card summary_large_image; article:published_time e article:author quando type=article; link rel=alternate type=application/rss+xml para /rss.xml; link do favicon; theme-color #0f172a. Header/Footer e body permanecem como estão.',
      '3. public/favicon.svg: monograma "g." minimalista — texto serif branco/laranja (#f97316) sobre rounded square #0f172a, SVG enxuto e legível em 16px.',
      '4. Imagem OG default: copie o asset src/assets/326189a758fea0fe0e2da42349b6da943b29ba51.png para public/og-default.png (via cp) e use como fallback de og:image.',
      '5. src/pages/rss.xml.ts: feed RSS com @astrojs/rss combinando as coleções insights e radar (somente isExternal=false do radar), title/description alinhados à newsletter da estratégia, link dos itens para as rotas locais, pubDate a partir do date ISO do CONTRATO. As coleções estão sendo regeneradas em paralelo — escreva o código contra o CONTRATO sem depender dos arquivos atuais.',
      '6. public/robots.txt permitindo tudo + referência ao sitemap (https://gusflopes.dev/sitemap-index.xml).',
      '7. NÃO rode pnpm build (conteúdo em regeneração paralela).',
      'Reporte summary, filesTouched e pendências.',
    ].join('\n\n'), { label: 'impl:seo', phase: 'Fundação', schema: IMPL_SCHEMA }),
  ])
  return resultados.filter(Boolean)
}

const trilhoConteudo = async () => {
  // Preparação: imagens verificadas + curadoria de links externos reais
  const [pool, externos] = await parallel([
    () => agent([
      CONTEXTO,
      'Você é o curador de IMAGENS. Monte um pool de NO MÍNIMO 18 imagens do Unsplash VERIFICADAS para ilustrar artigos técnicos (temas: IA/redes neurais, código, arquitetura de software/estruturas abstratas, datacenter/cloud, times de engenharia/escritório, circuitos, geometria abstrata dark).',
      'Método: gere candidatas no formato https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1080&q=80 (IDs reais que você conheça; pode usar WebSearch/WebFetch em páginas unsplash.com/photos/<slug> para descobrir URLs images.unsplash.com reais). Exemplo de URL válida conhecida: https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?w=1080&q=80',
      'VERIFICAÇÃO OBRIGATÓRIA: para cada candidata rode curl -s -o /dev/null -w "%{http_code}" "<url>" e SÓ inclua no resultado as que retornarem 200. Continue gerando candidatas até ter >= 18 aprovadas e visualmente diversas.',
      'Tagueie cada imagem com 1-3 temas usando EXATAMENTE estes valores: ' + CATEGORIES.join(', ') + '. Distribua bem (toda categoria precisa de >= 3 imagens). Não edite nenhum arquivo.',
    ].join('\n\n'), { label: 'prep:imagens', phase: 'Conteúdo', schema: IMAGES_SCHEMA }),
    () => agent([
      CONTEXTO,
      'Você é o curador do RADAR EXTERNO. Encontre EXATAMENTE 8 conteúdos externos REAIS (6-7 artigos + 1-2 vídeos) publicados entre 2025-11-01 e ' + TODAY + ', alinhados ao foco do site: adoção de IA em engenharia/enterprise (agentes, copilotos, MCP, governança), .NET 10/C# 14/Aspire, arquitetura de software.',
      'Use WebSearch para descobrir e WebFetch (ou curl -sI) para VERIFICAR que cada link responde (status < 400). Para vídeos do YouTube valide via https://www.youtube.com/oembed?url=<video-url>&format=json. NÃO inclua nada que você não verificou.',
      'Para cada item: title (idioma original), excerpt em pt-BR (1-2 frases — por que vale a leitura), date = data real de publicação (YYYY-MM-DD; se só souber mês, use dia 15), duration estimada ("7 min" leitura ou duração real do vídeo), category do enum, type, link verificado, source = nome real da publicação (ex: "Microsoft DevBlogs", "Anthropic", "InfoQ", "martinfowler.com", "YouTube — NDC").',
      'Priorize fontes respeitadas e variadas (máx 2 por fonte). Não edite nenhum arquivo.',
    ].join('\n\n'), { label: 'prep:radar-externo', phase: 'Conteúdo', schema: EXTERNAL_SCHEMA }),
  ])

  const imagens = (pool && pool.images) ? pool.images.filter(i => i.url && i.url.startsWith('https://images.unsplash.com/')) : []
  const usadas = new Set()
  const pickImage = (category) => {
    if (!imagens.length) return 'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?w=1080&q=80'
    const candidata = imagens.find(i => i.themes.includes(category) && !usadas.has(i.url)) || imagens.find(i => !usadas.has(i.url)) || imagens[0]
    usadas.add(candidata.url)
    return candidata.url
  }
  log('Pool de imagens: ' + imagens.length + ' verificadas | Radar externo: ' + (externos ? externos.items.length : 0) + ' links reais')

  const VOZ = [
    'VOZ E QUALIDADE DO TEXTO:',
    '- pt-BR, primeira pessoa, voz de arquiteto de software sênior pragmático que está fazendo adoção de IA em ambientes enterprise no dia a dia. Opinião própria, sem cima-do-muro.',
    '- Tecnicamente correto e datado com coerência: um artigo com date X não pode citar fatos posteriores a X. Estado da arte plausível para a data (ex: .NET 10 GA nov/2025, C# 14, agentes/MCP, RAG em produção, Copilot/Claude em times enterprise).',
    '- PROIBIDO: clichês de IA ("no cenário atual", "é importante ressaltar", "em um mundo cada vez mais", "desbloquear o potencial"), listas de marketing vazias, inventar clientes/empresas nomeadas ou métricas fabricadas precisas. Casos genéricos ("um cliente do setor financeiro") são ok.',
    '- Estrutura: abertura com problema real (sem "Introdução"), h2/h3 descritivos, >= 1 bloco de código com syntax correta quando fizer sentido (de preferência C#/.NET; yaml/json ok), 1 blockquote com uma tese forte sua, listas onde natural. Fechar com take claro + 1 linha sutil convidando para a newsletter "' + final.newsletter.name + '".',
  ].join('\n')

  const promptArtigo = (item, collection, imageUrl) => {
    const file = ROOT + '/src/content/' + collection + '/' + item.slug + '.md'
    const fmLinhas = [
      'title: ' + JSON.stringify(item.title),
      'excerpt: ' + JSON.stringify(item.excerpt),
      'date: "' + item.date + '"',
      'duration: "' + item.duration + '"',
      'category: "' + item.category + '"',
    ]
    if (collection === 'radar') {
      fmLinhas.push('type: "article"', 'isExternal: false', 'link: "/radar/article/' + item.slug + '"', 'source: "Local"')
    }
    fmLinhas.push('image: "' + imageUrl + '"')
    return [
      CONTEXTO,
      'Você é REDATOR. Escreva o artigo completo abaixo e salve-o em ' + file + ' (crie o arquivo; não toque em nenhum outro).',
      'FRONTMATTER EXATO (copie literalmente, entre ---):\n---\n' + fmLinhas.join('\n') + '\n---',
      'ESPECIFICAÇÃO: ' + (collection === 'insights' ? 'artigo longform de 900-1400 palavras.' : 'análise curta e afiada de 500-800 palavras (item local do Radar).'),
      'Outline a cobrir: ' + item.outline.join(' | '),
      'Take principal: ' + item.keyTakeaway,
      VOZ,
      'O corpo é markdown puro (sem JSX/HTML). Retorne {file, slug, words}.',
    ].join('\n\n')
  }

  const pecasLocais = [
    ...final.contentCalendar.insights.map(i => ({ item: i, collection: 'insights' })),
    ...final.contentCalendar.radarLocal.map(i => ({ item: i, collection: 'radar' })),
  ]
  const escritos = (await parallel(
    pecasLocais.map(p => () => agent(promptArtigo(p.item, p.collection, pickImage(p.item.category)), {
      label: 'redator:' + p.collection + '/' + p.item.slug,
      phase: 'Conteúdo',
      schema: WRITE_SCHEMA,
    }))
  )).filter(Boolean)

  let externosEscritos = null
  if (externos && externos.items.length) {
    const itensExternos = externos.items.slice(0, 8).map(it => ({ ...it, slug: slugify(it.title), image: pickImage(it.category) }))
    externosEscritos = await agent([
      CONTEXTO,
      CONTRATO,
      'Você é o escriba do RADAR EXTERNO. Para CADA item do JSON abaixo, crie o arquivo ' + ROOT + '/src/content/radar/<slug>.md com frontmatter exato: title, excerpt, date, duration, category, type, isExternal: true, link (a URL externa), source, image — todos vindos do JSON. Corpo: uma única linha em pt-BR resumindo por que vale o clique (não é renderizado como página local).',
      'Atenção a escaping YAML (use aspas duplas em todos os valores string). Não toque em nenhum outro arquivo.',
      'ITENS:\n' + JSON.stringify(itensExternos, null, 1),
      'Retorne {file: "lista resumida", slug: "n/a", words: <total de arquivos criados>}.',
    ].join('\n\n'), { label: 'escriba:radar-externo', phase: 'Conteúdo', schema: WRITE_SCHEMA })
  }
  return { escritos, externosEscritos, totalImagens: imagens.length, totalExternos: externos ? Math.min(externos.items.length, 8) : 0 }
}

const [fundacao, conteudo] = await parallel([trilhoFundacao, trilhoConteudo])

const pendencias = (fundacao || []).flatMap(r => r.pendencias || [])
log('Fundação: ' + ((fundacao || []).length) + '/3 implementadores ok | Conteúdo: ' + (conteudo ? conteudo.escritos.length : 0) + ' artigos locais + ' + (conteudo ? conteudo.totalExternos : 0) + ' externos')

// ============ FASE 5: VERIFICAÇÃO ============
phase('Verificação')
log('Integrando: build até ficar verde...')

const build = await agent([
  CONTEXTO,
  CONTRATO,
  'Você é o INTEGRADOR. Três implementadores e ~13 redatores acabaram de editar o repositório em paralelo. Rode pnpm build em ' + ROOT + ' e corrija TODOS os erros até o build passar (máx 8 iterações): erros de schema/frontmatter dos .md, imports quebrados, renomes inconsistentes (ex: ArticlePage2 -> InsightArticlePage), props divergentes entre páginas e layout/shells, API de render de content collections do Astro 6, links internos para rotas renomeadas, sobras dos placeholders antigos.',
  'Você pode editar qualquer arquivo do repo, mas faça a correção MÍNIMA que preserva a intenção de cada agente (leia o código vizinho antes de mudar contratos). Se dois agentes divergiram num contrato (ex: nome de prop), escolha o do layout/página Astro e ajuste o resto.',
  'Depois do build verde, rode também pnpm exec astro check 2>/dev/null || true e corrija apenas erros (não warnings) razoáveis de corrigir.',
  'Reporte success, attempts e notes (o que precisou consertar).',
].join('\n\n'), { label: 'integrador:build', schema: BUILD_SCHEMA })

if (!build || !build.success) {
  log('ATENÇÃO: build não ficou verde — revisores vão atuar mesmo assim')
}

log('Painel de revisão em paralelo...')
const reviews = (await parallel([
  () => agent([
    CONTEXTO,
    'Você é REVISOR DE CÓDIGO adversarial. Rode git diff main --stat e depois examine o diff completo (git diff main) em ' + ROOT + '. Procure: bugs reais, props/contratos inconsistentes, dados ainda hardcoded que deviam vir das coleções, ordenação de datas errada (datas são strings ISO), links internos quebrados (rotas renomeadas), regressões de acessibilidade, estados de form quebrados, lógica de esconder Header em páginas de artigo. NÃO edite nada; apenas reporte findings com severidade honesta (na dúvida, rebaixe).',
  ].join('\n\n'), { label: 'rev:codigo', schema: REVIEW_SCHEMA }),
  () => agent([
    CONTEXTO,
    CONTRATO,
    'Você é REVISOR DE CONTEÚDO adversarial. Leia TODOS os arquivos de src/content/insights/ e src/content/radar/ em ' + ROOT + '. Verifique: frontmatter válido contra o CONTRATO (categorias exatas do enum, datas ISO <= ' + TODAY + ' e >= 2025-12-01, YAML bem escapado); qualidade do pt-BR (gramática, clichês de IA, tom consistente de um único autor); coerência temporal (artigo não cita fato posterior à sua data); código dos artigos compila mentalmente; claims técnicos falsos ou credenciais inventadas; títulos duplicados; imagens: rode curl -s -o /dev/null -w "%{http_code}" em CADA url de image e reporte as que não retornarem 200. Para radar externo: spot-check 3 links. NÃO edite nada; reporte findings.',
  ].join('\n\n'), { label: 'rev:conteudo', schema: REVIEW_SCHEMA }),
  () => agent([
    CONTEXTO,
    'Você é REVISOR DE SITE (smoke test). Em ' + ROOT + ': rode pnpm build (deve passar; se falhar, reporte como crítico e pare), depois suba o preview em background com pnpm exec astro preview --port 4173 & e aguarde ~3s. Com curl, verifique: / , /radar , /insights , /privacy , /terms , /rss.xml , /robots.txt , /favicon.svg , /sitemap-index.xml retornam 200; pelo menos 3 páginas de artigo geradas (descubra os slugs em dist/radar/article/ e dist/insights/article/) retornam 200 e contêm o título do artigo no HTML; o HTML da home contém a headline nova do hero e o form de newsletter (action do Buttondown); grep nos href do HTML da home/radar/insights por links internos que não existam em dist/ (404 em potencial); as meta og:title/og:image aparecem nas páginas de artigo. Ao final, mate o processo do preview (kill). NÃO edite nada; reporte findings.',
  ].join('\n\n'), { label: 'rev:site', schema: REVIEW_SCHEMA }),
])).filter(Boolean)

const todosFindings = reviews.flatMap(r => r.findings)
const relevantes = todosFindings.filter(f => f.severity !== 'menor')
log('Revisão: ' + todosFindings.length + ' findings (' + relevantes.length + ' relevantes). Aplicando correções...')

const correcao = await agent([
  CONTEXTO,
  CONTRATO,
  'Você é o CORRETOR FINAL. Abaixo estão os findings de 3 revisores (código, conteúdo, smoke test do site). Para cada um: verifique se procede lendo o arquivo; se proceder, corrija; se for especulativo/errado/cosmético-irrelevante, pule e justifique. Findings de severidade "menor" só corrija se for trivial e seguro.',
  'FINDINGS:\n' + JSON.stringify(todosFindings, null, 1),
  'Ao final, rode pnpm build em ' + ROOT + ' e garanta que continua verde (corrija se quebrou algo). Reporte applied, skipped e rebuildSuccess.',
].join('\n\n'), { label: 'corretor-final', schema: FIX_SCHEMA })

const docs = await agent([
  CONTEXTO,
  'Atualize ' + ROOT + '/NEXT_STEPS.md para refletir o estado pós-evolução: confira no código o que de fato foi resolvido (render markdown real das coleções, rota dinâmica de insights, SEO/OG/favicon/RSS/sitemap, newsletter form com provider, socials, conteúdo real nas coleções) e marque/remova os itens resolvidos, mantendo os que continuam pendentes e adicionando novos próximos passos que você identificar no código (ex: confirmar conta Buttondown, confirmar handle LinkedIn, imagens locais otimizadas com <Image/>, foto real do autor, página /sobre dedicada). Seja fiel ao código, não ao que os agentes disseram. Edite SOMENTE o NEXT_STEPS.md.',
].join('\n\n'), { label: 'docs:next-steps' })

return {
  posicionamento: final.positioningStatement,
  newsletter: final.newsletter,
  heroHeadline: final.heroCopy.headline,
  calendario: {
    insights: final.contentCalendar.insights.map(i => i.date + ' [' + i.category + '] ' + i.title),
    radarLocal: final.contentCalendar.radarLocal.map(i => i.date + ' [' + i.category + '] ' + i.title),
  },
  conteudo: {
    artigosLocais: conteudo ? conteudo.escritos.length : 0,
    radarExternos: conteudo ? conteudo.totalExternos : 0,
    imagensVerificadas: conteudo ? conteudo.totalImagens : 0,
  },
  fundacao: (fundacao || []).map(r => r.summary),
  pendenciasDoDono: pendencias,
  build: build,
  revisao: { totalFindings: todosFindings.length, relevantes: relevantes.length, resumos: reviews.map(r => r.summary) },
  correcao: correcao,
  docsAtualizado: !!docs,
}