---
title: "Copiloto interno com dados proprietários: arquitetura de referência em .NET e Azure"
excerpt: "Como desenhar um copiloto corporativo que responde com os dados da empresa sem vazar os dados da empresa: camadas, identidade, retrieval com permissão e os trade-offs de cada decisão."
date: "2025-12-16"
duration: "12 min"
category: "IA"
image: "https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?auto=format&fit=crop&w=1080&q=80"
---

O pedido chega quase sempre com a mesma frase: "queremos um ChatGPT interno que conheça os nossos documentos". O piloto fica pronto em duas semanas, a demo impressiona a diretoria — e aí alguém de RH faz uma pergunta sobre reestruturação e o copiloto responde citando uma planilha de desligamentos que só três pessoas na empresa deveriam ver. Eu já vi essa cena de perto mais de uma vez. O modelo não errou. A arquitetura errou.

O diferencial de um copiloto interno não está no modelo que você escolhe. Está na camada de identidade, no retrieval com permissão e na governança que você constrói em volta dele. O resto deste artigo é sobre como montar essas camadas em .NET e Azure sem se enganar sobre os trade-offs.

## A topologia que tem se sustentado em produção

Depois de algumas iterações em clientes diferentes, a topologia que eu defendo tem quatro camadas, e a ordem importa:

1. **Gateway de IA** — um ponto único de entrada (Azure API Management ou um gateway dedicado em .NET) que autentica o usuário via Entra ID, aplica rate limit, registra prompts e respostas para auditoria e mascara dados sensíveis antes do log. É aqui que mora o kill switch quando algo dá errado.
2. **Orquestração** — um serviço .NET (hoje eu uso `Microsoft.Extensions.AI` com Semantic Kernel onde preciso de planejamento) que decide se a pergunta exige retrieval, monta o contexto, chama o modelo e pós-processa a resposta com citações.
3. **Retrieval** — Azure AI Search com índices segmentados por domínio de dados, pipeline de ingestão separado do caminho de consulta.
4. **Identidade ponta a ponta** — o token do usuário atravessa todas as camadas anteriores. Não é uma camada física; é uma propriedade do sistema inteiro.

A tentação de pular o gateway e chamar o endpoint do modelo direto do frontend é grande e sempre cobra caro depois. Sem o gateway, você não tem auditoria, não tem chargeback e não tem como cortar um abuso sem derrubar tudo.

## RAG com permissionamento: o índice precisa saber quem vê o quê

RAG "de tutorial" indexa tudo num índice único e busca por similaridade. Em ambiente corporativo isso é uma bomba-relógio, porque documentos têm dono, e permissão de leitura no SharePoint não se teletransporta para o índice vetorial sozinha.

Três decisões resolvem a maior parte do problema:

- **ACLs no índice**: cada chunk carrega os `group_ids` do Entra ID que podem lê-lo, capturados na ingestão e reprocessados quando a permissão de origem muda. Toda query — sem exceção — aplica um filtro de segurança sobre esse campo. Security trimming não é feature opcional; é pré-condição.
- **Chunking por tipo de documento**: contrato não se fatia como página de wiki. Para documentos jurídicos eu mantenho chunks por cláusula com o cabeçalho hierárquico preservado; para wikis, seções com overlap pequeno; para planilhas, serialização linha a linha com o header repetido. Chunking genérico de 512 tokens para tudo é a causa número um de resposta ruim que eu encontro em revisão de arquitetura.
- **Busca híbrida**: vetor puro falha exatamente onde empresa mais pergunta — siglas internas, códigos de produto, números de contrato, nomes próprios. Embedding aproxima semântica, mas "NF-4471" não tem semântica. A combinação de busca vetorial com BM25 e reranking semântico do AI Search resolve isso sem heroísmo.

## Azure OpenAI vs. APIs públicas: o que o jurídico vai perguntar

A discussão de qualidade de modelo é a menos importante aqui. Em dezembro de 2025, os modelos disponíveis no Azure OpenAI e nas APIs públicas são bons o suficiente para a esmagadora maioria dos casos de copiloto interno. As perguntas que decidem a escolha vêm do jurídico e da segurança:

- **Onde os dados são processados?** Azure OpenAI permite fixar a região de processamento e operar atrás de Private Endpoints, sem tráfego pela internet pública. Para cliente regulado no Brasil, isso encurta semanas de discussão.
- **Quem acessa os logs?** O abuse monitoring padrão da Microsoft retém prompts por um período para revisão humana — e existe processo formal para solicitar a desativação disso. O jurídico vai querer saber, e você precisa ter a resposta antes de ele perguntar.
- **Sob qual contrato?** A maioria das empresas que eu atendo já tem Enterprise Agreement com a Microsoft. Acrescentar Azure OpenAI a um DPA existente é ordem de grandeza mais simples do que abrir due diligence com um fornecedor novo.

Minha posição: para enterprise regulado, Azure OpenAI ganha por rede privada, residência e contrato — não por qualidade de modelo. Se o seu contexto não tem essas restrições, as APIs públicas com tier corporativo são perfeitamente defensáveis e geralmente recebem modelos novos antes.

## Propagação de identidade: o copiloto não pode ter superpoderes

O anti-pattern clássico: o serviço de orquestração usa um service principal com leitura sobre todos os dados e "filtra depois". Não filtra. Uma injeção de prompt bem construída, um bug no filtro, e o sistema responde com a permissão dele, não com a do usuário.

> Se o seu copiloto sabe mais do que o usuário que está perguntando, você não construiu um assistente — construiu um vazamento de dados com interface amigável.

A solução é o fluxo On-Behalf-Of: o token do usuário entra pelo gateway e é trocado a cada salto, de forma que a consulta ao índice carrega a identidade de quem perguntou. Em C#, o coração disso fica assim:

```csharp
// Orquestrador: troca o token do usuário (OBO) e consulta o índice
// aplicando security trimming pelos grupos do Entra ID.
var credential = new OnBehalfOfCredential(
    tenantId, clientId, clientSecret, userAssertion: incomingAccessToken);

var groupIds = await graphService.GetUserGroupIdsAsync(cancellationToken);
var securityFilter =
    $"group_ids/any(g: search.in(g, '{string.Join(',', groupIds)}'))";

var options = new SearchOptions
{
    Filter = securityFilter,
    QueryType = SearchQueryType.Semantic,
    SemanticSearch = new() { SemanticConfigurationName = "default" },
    Size = 8,
    VectorSearch = new()
    {
        Queries =
        {
            new VectorizableTextQuery(userQuestion)
            {
                KNearestNeighborsCount = 8,
                Fields = { "embedding" }
            }
        }
    }
};

SearchResults<KnowledgeChunk> results = await searchClient
    .SearchAsync<KnowledgeChunk>(userQuestion, options, cancellationToken);
```

O filtro não é pós-processamento: ele é aplicado pelo próprio índice, antes de qualquer chunk chegar perto do modelo. Documento que o usuário não pode ver nunca entra no contexto — e o que não entra no contexto não vaza.

## Contexto: mais não é melhor

Com janelas de centenas de milhares de tokens, a tentação é despejar tudo no prompt. Resista. Na prática, contexto demais degrada a resposta de três formas: o modelo se perde no meio do material (recuperação no meio de contexto longo continua sendo o ponto fraco), o custo por requisição explode e a latência vai junto.

O que funciona para mim: top-k pequeno (6 a 10 chunks) com reranking agressivo, em vez de top-50 "para garantir". Para o histórico de conversa, sumarização incremental — depois de quatro ou cinco turnos, os turnos antigos viram um resumo estruturado e só os dois últimos permanecem literais. E um orçamento explícito de tokens por requisição no orquestrador, que força a decisão de o que entra em vez de empilhar tudo e torcer.

## Custos: tokens viram fatura, e alguém paga

Copiloto interno sem gestão de custo morre no terceiro mês, quando a fatura surpreende o financeiro. Como o gateway já identifica usuário e departamento, ele é o lugar natural para medir consumo de tokens por área de negócio e alimentar chargeback. Quotas por área evitam que um time entusiasmado consuma o orçamento de todos, e a decisão entre throughput provisionado (PTU) e pay-as-you-go deve vir depois de medir o padrão real de uso — começar com PTU é pagar por capacidade que você ainda não entende.

---

Se eu pudesse deixar uma única ideia: pare de avaliar copiloto interno pela demo e comece a avaliar pelas perguntas chatas — quem pode ver o quê, com a permissão de quem o sistema responde, quanto custa por área e quem desliga quando algo dá errado. O modelo é a parte trocável da arquitetura; identidade, retrieval com permissão e governança são o produto.

É esse tipo de bastidor que eu compartilho na minha newsletter — se o assunto te interessa, vale assinar.
