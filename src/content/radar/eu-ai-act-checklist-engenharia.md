---
title: "EU AI Act em vigor por fases: checklist de engenharia para quem atende o mercado europeu"
excerpt: "Com as obrigações para sistemas de alto risco se aproximando, o AI Act deixou de ser assunto exclusivo do jurídico. O que times de engenharia precisam ter pronto — e o que dá para automatizar."
date: "2026-05-19"
duration: "7 min"
category: "IA"
type: "article"
isExternal: false
link: "/radar/article/eu-ai-act-checklist-engenharia"
source: "Local"
image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1080&q=80"
---

Nas últimas semanas, dois clientes meus que vendem SaaS B2B para a Europa receberam o mesmo questionário de procurement: classificação de risco sob o AI Act, política de logging de decisões automatizadas, documentação técnica do modelo. Nenhum dos dois tinha resposta pronta. E o detalhe incômodo: quem precisava responder não era o jurídico — era a engenharia.

## A linha do tempo: o que já vale e o que chega em agosto

O AI Act entrou em vigor em agosto de 2024, mas aplica-se em fases. Em maio de 2026, o quadro é este:

- **Desde fevereiro de 2025**: práticas proibidas (scoring social, manipulação subliminar, scraping indiscriminado de faces) e obrigação de letramento em IA para quem opera sistemas.
- **Desde agosto de 2025**: obrigações para provedores de modelos de propósito geral (GPAI) — documentação, política de copyright, sumário de dados de treino.
- **2 de agosto de 2026**: a fase que importa para a maioria de nós. Entram as obrigações completas para sistemas de **alto risco** do Anexo III e os requisitos de transparência do Artigo 50 para chatbots e conteúdo sintético.

Bruxelas discute adiar parte do cronograma de alto risco via Digital Omnibus, mas planejar contando com adiamento é aposta, não estratégia. As multas chegam a 7% do faturamento global — procurement europeu já age como se agosto fosse certo.

## Classificação de risco: o mapeamento que ninguém fez

O primeiro item do checklist não é técnico, é de inventário: listar cada caso de uso de IA em produção e mapear contra as categorias do Act. Na prática:

- **Alto risco (Anexo III)**: triagem de currículos, scoring de crédito, decisões em educação, infraestrutura crítica. Se o seu copiloto de RH ranqueia candidatos, ele está aqui — mesmo que um humano "revise" no final.
- **Risco limitado**: chatbots e geradores de conteúdo voltados ao usuário. Obrigação principal: disclosure.
- **Risco mínimo**: a maioria dos copilotos internos de produtividade. Respire.

O erro comum é classificar pelo modelo ("usamos GPT-4, é GPAI") em vez de pelo **caso de uso**. O Act regula o que o sistema faz, não qual LLM está embaixo.

## Documentação e logging: evidência sai do pipeline, não do Word

Para alto risco, os Artigos 11 e 12 exigem documentação técnica (Anexo IV) e registro automático de eventos com retenção mínima de seis meses. A boa notícia: quase tudo isso é telemetria que um time disciplinado já deveria emitir. Em .NET, um log estruturado por decisão resolve o grosso do Artigo 12:

```csharp
public sealed record AiDecisionLog(
    string TraceId,
    string ModelId,               // versão exata, nunca alias "latest"
    string PromptTemplateVersion, // ex: "triagem-cv/v3"
    string InputHash,             // SHA-256 do input — não o input (GDPR)
    string Outcome,
    bool HumanReviewed,
    DateTimeOffset Timestamp);

logger.LogInformation("AiDecision {@Decision}",
    new AiDecisionLog(Activity.Current!.TraceId.ToString(), modelId,
        promptVersion, inputHash, outcome, humanReviewed, DateTimeOffset.UtcNow));
```

Versão de prompt em source control, model ID pinado, eval suite rodando no CI com relatório versionado: isso **é** a documentação técnica do Anexo IV nascendo do pipeline. Quem trata prompt como string solta no código vai sofrer; quem já versiona, está a meio caminho.

> Conformidade com o AI Act é 50% telemetria, versionamento e documentação gerada por pipeline. Se o seu time precisa de um projeto de compliance para produzir isso, o problema não é regulatório — é de maturidade de engenharia.

## Transparência: o disclosure que custa uma linha

O Artigo 50 exige que usuários saibam quando interagem com IA e que conteúdo sintético seja marcado. Para copilotos e chatbots, é um banner e metadados na resposta — custo de implementação próximo de zero, custo reputacional de não ter: alto. Coloque agora, mesmo fora da Europa.

## Conformidade como vantagem comercial

O efeito Bruxelas já apareceu nos questionários: clientes enterprise fora da Europa copiam os requisitos do Act porque é o framework mais concreto disponível. No Brasil, o PL 2338 caminha na mesma direção. Quem chega na RFP com classificação de risco documentada, logs auditáveis e eval reports versionados não está "em conformidade" — está vendendo confiança que o concorrente não tem como demonstrar.

Meu take: pare de tratar o AI Act como custo jurídico e trate como especificação de observabilidade. Metade do checklist é engenharia que você já deveria estar fazendo; a outra metade é a engenharia virando evidência.

*Esse tipo de checklist prático sai primeiro na **Em Produção**, minha newsletter — assine na home.*
