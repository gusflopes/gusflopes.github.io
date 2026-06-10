---
title: "Microsoft.Extensions.AI na prática: a camada que desacopla seu código .NET do fornecedor de LLM"
excerpt: "A abstração oficial de IA do .NET merece o mesmo status que ILogger: como estruturar chat, embeddings e tool calling sem casar com um provedor."
date: "2026-05-05"
duration: "11 min"
category: ".NET"
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1080&q=80"
---

Nos últimos doze meses participei de três projetos .NET com LLM em produção, e os três passaram pelo mesmo rito de passagem: trocar de fornecedor de modelo. Um começou na API da OpenAI e migrou para Azure OpenAI quando o jurídico exigiu residência de dados e contrato enterprise. Outro saiu do Azure para um modelo aberto em GPU própria quando a fatura de inferência virou pauta de diretoria. O terceiro roda os dois ao mesmo tempo — modelo grande para casos ambíguos, modelo pequeno e barato para o volume. Em dois deles, a migração custou semanas, porque o código de negócio chamava o SDK do fornecedor diretamente. No terceiro, custou um trecho de configuração e um deploy.

A diferença foi `Microsoft.Extensions.AI`. E a minha posição é direta: essa biblioteca merece, na sua arquitetura, o mesmo status que `ILogger` conquistou há uma década. Ninguém sério referencia Serilog no código de domínio; referencia a abstração e pluga o provider na composição. Com LLMs, o mesmo raciocínio vale — só que os incentivos para errar são maiores, porque o SDK do fornecedor é sedutor e os exemplos da internet quase sempre acoplam tudo.

## `IChatClient` e `IEmbeddingGenerator`: o contrato que faltava

O coração do pacote são duas interfaces. `IChatClient` modela conversação: recebe uma lista de `ChatMessage`, devolve resposta completa ou streaming, aceita `ChatOptions` com temperatura, ferramentas e formato de saída. `IEmbeddingGenerator<string, Embedding<float>>` modela vetorização para busca semântica e RAG. Só isso — e é exatamente por ser pouco que funciona.

OpenAI, Azure OpenAI, Azure AI Foundry, Ollama e ONNX local têm implementações maduras; qualquer SDK proprietário vira `IChatClient` com um adapter de poucas linhas. O código que monta prompt, orquestra ferramentas e interpreta resposta não sabe — e não deve saber — quem está do outro lado. Na prática, isso transforma a escolha de modelo em decisão de **deployment**, não de **código**. É a diferença entre renegociar contrato com calma e refazer regressão em vinte serviços.

> Código de domínio que importa SDK de fornecedor de LLM é o novo código de domínio que importa driver de banco: funciona perfeitamente até a primeira decisão comercial que você não controla.

Em times que estão adotando IA agora, eu trato isso como regra de arquitetura com enforcement: teste de arquitetura (ArchUnitNET ou um Roslyn analyzer simples) que falha o build se algum projeto fora da camada de composição referenciar pacote de fornecedor. Parece burocracia; é o que mantém a opcionalidade viva daqui a dezoito meses.

## Middleware: caching, telemetria e rate limiting como decorators

A segunda ideia boa da biblioteca é copiar o modelo de pipeline do `HttpClient`. Um `IChatClient` pode envolver outro, e o `ChatClientBuilder` monta a cadeia de decorators na injeção de dependência:

```csharp
builder.Services.AddChatClient(sp =>
        new AzureOpenAIClient(new Uri(endpoint), new DefaultAzureCredential())
            .GetChatClient("gpt-4.1")
            .AsIChatClient())
    .UseDistributedCache()
    .UseFunctionInvocation()
    .UseOpenTelemetry(sourceName: "Pedidos.IA")
    .UseLogging();
```

Cada `Use*` é um decorator com responsabilidade única: cache distribuído para respostas idênticas (em cenários de classificação e extração, a taxa de acerto surpreende), execução automática de ferramentas, traces, logs. Concerns transversais saem do código de orquestração e viram infraestrutura declarada num lugar só.

E quando o built-in não basta, herdar de `DelegatingChatClient` resolve. Rate limiting é o exemplo que mais implemento: provedores impõem limites de tokens por minuto, e estourar isso em produção gera retry storm. Um decorator com `System.Threading.RateLimiting` na frente do client real segura a fila de forma transparente — sem que nenhum caso de uso saiba que isso existe. Já escrevi decorators para redação de PII antes do envio do prompt e para fallback entre modelos quando o primário degrada. Todos testáveis isoladamente, todos invisíveis ao domínio.

## Tool calling tipado: de reflection a source generators

Tool calling é onde a maioria dos times se queima escrevendo schema JSON na mão. Com `AIFunctionFactory`, um método C# vira ferramenta — assinatura e `[Description]` geram o schema automaticamente:

```csharp
[Description("Consulta o status de um pedido pelo código")]
static Task<StatusPedido> ConsultarPedidoAsync(
    [Description("Código no formato PED-9999")] string codigo,
    CancellationToken ct) => /* ... */;

var resposta = await chatClient.GetResponseAsync(
    "Onde está o pedido PED-1042?",
    new ChatOptions { Tools = [AIFunctionFactory.Create(ConsultarPedidoAsync)] });
```

Com `UseFunctionInvocation()` na pipeline, o loop de "modelo pede ferramenta, executo, devolvo resultado" é responsabilidade do middleware. Seu código declara capacidades; a mecânica fica fora dele.

A implementação original usa reflection, o que incomoda em dois pontos: custo de inspeção e incompatibilidade com Native AOT, cada vez mais relevante no .NET 10. A direção do ecossistema é clara — o SDK de MCP para C# já gera schemas via source generators a partir de atributos, e o mesmo movimento alcança as `AIFunction`. O contrato que você escreve hoje permanece; o que muda é o compilador assumindo o trabalho em build, com erro de compilação em vez de surpresa em runtime quando um tipo não é serializável.

## OpenTelemetry: GenAI como cidadão do seu APM

`UseOpenTelemetry()` emite spans seguindo as convenções semânticas de GenAI do OpenTelemetry: `gen_ai.request.model`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, operação, sistema de origem. Isso significa que a chamada ao LLM aparece no **mesmo trace distribuído** que o HTTP request e a query SQL — no Application Insights, Grafana ou Datadog que você já opera, sem ferramenta nova de "LLM observability".

Dois efeitos práticos que observei em um cliente do setor de logística: primeiro, custo por feature deixou de ser estimativa e virou query sobre tokens agregados por span; segundo, a latência de IA entrou no mesmo SLO dashboard do resto do sistema, o que mudou a conversa com o time de plataforma. Atenção redobrada ao flag de dados sensíveis: gravar prompts inteiros no trace é útil em homologação e um incidente de LGPD esperando data em produção. Habilite por ambiente, nunca por padrão.

## Testabilidade: mockar o modelo, testar a orquestração

A objeção clássica — "como testar código que depende de LLM?" — confunde duas coisas. Qualidade de resposta do modelo se mede com evals (e `Microsoft.Extensions.AI.Evaluation` existe para isso). Mas a **orquestração** — o prompt foi montado com o contexto certo? a ferramenta correta foi exposta? o fallback disparou quando o client lançou exceção? — é código seu, determinístico, e se testa com teste unitário comum.

Como `IChatClient` é uma interface pequena, um fake com respostas roteirizadas cobre quase tudo:

- devolver um `ChatResponse` fixo e assertar o pós-processamento;
- devolver uma chamada de ferramenta e verificar que o handler certo executou com os argumentos certos;
- lançar exceção de rate limit e assertar que o decorator de fallback trocou de modelo.

Nada disso toca rede, nada exige API key no CI, nada flakeia. Nos projetos em que cheguei com a suíte já acoplada ao SDK do fornecedor, esses testes simplesmente não existiam — não por preguiça, mas porque a arquitetura os tornava caros demais. A abstração é o que torna o teste barato.

## O take

Acople-se à abstração, não ao fornecedor. `Microsoft.Extensions.AI` é para LLMs o que `ILogger` foi para logging: o contrato neutro que transforma uma dependência volátil em detalhe de composição. O mercado de modelos vai continuar trocando de líder a cada seis meses; seu domínio não precisa participar dessa dança. Quem fizer esse desacoplamento agora vai trocar de modelo por configuração enquanto o vizinho ainda estima a reescrita.

Escrevo quinzenalmente sobre engenharia de software e adoção de IA em ambientes enterprise na **Em Produção** — se esse tipo de discussão te interessa, assine.
