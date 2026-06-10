---
title: ".NET 10 em sistemas enterprise: o guia de migração que eu queria ter lido"
excerpt: ".NET 10 é LTS, chegou em novembro com ganhos reais de performance e o ecossistema de IA mais maduro da plataforma. O que avaliar antes de migrar um sistema que não pode parar."
date: "2025-12-02"
duration: "12 min"
category: ".NET"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1080&q=80"
---

Três semanas atrás, na .NET Conf, a Microsoft lançou o .NET 10 como versão LTS, com suporte até novembro de 2028. Na mesma semana, recebi a pergunta que todo arquiteto da plataforma vai ouvir nos próximos meses: "a gente migra agora ou espera?". O sistema em questão era o core de operações de um cliente do setor financeiro, parte em .NET 6 — fora de suporte desde o fim de 2024 — e parte em .NET 8, que perde suporte em novembro de 2026.

A resposta curta: migra, sim, mas não do jeito que você está pensando. A resposta longa é este artigo.

## O que o .NET 10 entrega de verdade em workloads corporativos

A cada major eu refaço o mesmo exercício: separar melhoria de slide do que aparece no gráfico de latência. No .NET 10, três coisas passaram no filtro.

**JIT mais agressivo com escape analysis.** O compilador agora aloca na stack arrays pequenos de tamanho fixo e objetos que não escapam do método, e devirtualiza chamadas de interface em cenários comuns como enumeração de arrays. Em código de API típico — muito LINQ, muito objeto de vida curta — isso reduz pressão de alocação sem você mudar uma linha. É o tipo de ganho que aparece direto no percentil 99.

**GC mais previsível sob carga variável.** O DATAS, padrão desde o .NET 9, continuou sendo refinado. Para quem roda em Kubernetes com limites de memória apertados, o heap se adaptando à carga real — em vez de reservar memória pelo número de cores — é a diferença entre um cluster dimensionado por pico e um dimensionado por uso.

**Native AOT mais viável.** A cobertura de bibliotecas compatíveis cresceu o suficiente para que workers e APIs minimalistas compilem AOT sem sessão de exorcismo. Cold start menor e footprint reduzido importam quando você paga por instância.

O ganho real no seu sistema, ninguém pode te dizer de antemão — nem a Microsoft, nem eu. Os posts oficiais de performance mostram melhorias consistentes em microbenchmarks; o seu sistema não é um microbenchmark. Suba um canário com o runtime novo, espelhe tráfego de produção e meça.

## C# 14: features boas, adoção cara

O C# 14 trouxe duas features que eu gosto e uma lição que times grandes insistem em ignorar.

*Extension members* finalmente permitem propriedades de extensão, não só métodos:

```csharp
public static class OrderExtensions
{
    extension(Order order)
    {
        public bool IsOverdue =>
            order.DueDate < DateTimeOffset.UtcNow && order.Status != OrderStatus.Paid;

        public decimal OutstandingAmount =>
            order.Total - order.PaidAmount;
    }
}
```

Para quem mantém camadas de domínio sobre modelos que não pode alterar — contratos gerados, entidades de pacotes internos — isso limpa muito código. E o `field` nas propriedades elimina o backing field declarado só para validar um setter.

Agora, o custo: feature nova de linguagem é decisão de governança, não de gosto pessoal. Em um time de quarenta pessoas, sintaxe nova sem combinado vira ruído de code review e estilo inconsistente entre squads. Minha regra: atualizar a `LangVersion` junto com o runtime, mas liberar features via `.editorconfig` e analyzers, uma por vez, com exemplo canônico no guia interno. Adotar C# 14 inteiro de uma vez em codebase grande é trocar previsibilidade por novidade.

## Migração incremental: zero big bang

A migração que dá errado é quase sempre a mesma: uma branch `upgrade-net10` que vive três meses, acumula conflito e vira deploy de sexta-feira com o sistema inteiro trocando de runtime.

O caminho que funciona em sistemas distribuídos é serviço a serviço, com três mecanismos:

1. **Ordem por risco invertido.** Comece pelos serviços de menor criticidade e maior cobertura de testes. Eles são o laboratório de breaking changes — os problemas encontrados ali vão se repetir nos serviços críticos, só que com a resposta já conhecida.
2. **Testes de contrato antes de tudo.** Se os serviços não têm contrato verificável — Pact, snapshot de respostas com `WebApplicationFactory`, validação de schema OpenAPI no pipeline — escreva isso *antes* de trocar o TFM. O risco real de um upgrade de runtime não é o código que não compila; é a serialização que mudou de comportamento em silêncio.
3. **Feature flags na infraestrutura, não só no código.** Instância canário com .NET 10 atrás do mesmo load balancer, recebendo 5% do tráfego, com comparação de métricas automatizada. Se o p99 ou a taxa de erro divergirem, rollback é mexer em peso de roteamento, não reverter deploy.

> Upgrade de runtime não é projeto, é rotina. Se migrar de versão LTS exige seis meses e um comitê, o problema não é o .NET — é a ausência de testes de contrato e de pipeline confiável, e essa conta chega em qualquer mudança.

Quem vem do .NET 6 não precisa parar no 8: o salto direto para o 10 é suportado e mais barato do que duas migrações. Mas leia os breaking changes das versões intermediárias, porque eles se acumulam.

## Breaking changes que doem em produção

Os que mais vejo morder, em APIs e workers:

- **Containers: porta e usuário.** Desde o .NET 8, as imagens oficiais expõem a porta 8080 e rodam como não-root por padrão. Quem vem do .NET 6 com probes do Kubernetes apontando para a porta 80 descobre isso com o pod em `CrashLoopBackOff`. A base Debian das imagens também mudou — revalide pacotes nativos do Dockerfile.
- **System.Text.Json mais rígido.** Membros `required`, tipos polimórficos e leitura mais estrita mudaram entre o 6 e o 10. Payloads que desserializavam "no jeitinho" passam a lançar exceção — em geral o comportamento novo está certo, mas o cliente legado não sabe disso.
- **Globalization em Linux.** Migrar de Windows para container Linux junto com o upgrade traz o ICU no pacote: ordenação e comparação de strings mudam. Já vi `ORDER BY` em memória divergir do banco por causa disso.
- **EF Core 10.** A tradução de queries evolui a cada major; consultas que funcionavam podem gerar SQL diferente ou passar a avaliar no cliente. Capture o SQL gerado nos testes de integração e compare antes e depois.
- **Obsoletions virando erro.** Com `TreatWarningsAsErrors`, APIs obsoletas quebram o build. Bom sinal — mas planeje as substituições, não silencie com `NoWarn`.

Nada disso é exótico e tudo está documentado. O problema é que ninguém lê a lista inteira — por isso o serviço-laboratório existe.

## Microsoft.Extensions.AI: a razão estratégica para migrar

Se performance e LTS são as razões táticas, esta é a estratégica. O `Microsoft.Extensions.AI` amadureceu e dá à plataforma uma abstração nativa para LLMs com a filosofia de `ILogger`: você programa contra `IChatClient` e decide o fornecedor na composição.

```csharp
builder.Services
    .AddChatClient(sp =>
        new AzureOpenAIClient(endpoint, credential)
            .GetChatClient(deploymentName)
            .AsIChatClient())
    .UseDistributedCache()
    .UseFunctionInvocation()
    .UseOpenTelemetry();
```

Trocar Azure OpenAI por Anthropic ou por um modelo local via Ollama é trocar a primeira linha do builder. Cache, tool calling e telemetria continuam intactos, porque são middleware sobre a abstração — o mesmo padrão de pipeline do ASP.NET Core.

Nos projetos de adoção de IA que conduzo em ambientes corporativos, acoplamento a fornecedor é a objeção número um de arquitetura — antes de custo, antes de segurança. Ter a resposta na biblioteca padrão da plataforma, com OpenTelemetry de fábrica, muda a conversa com o comitê. Quem está no .NET 6 não tem acesso confortável a esse ecossistema; quem está no 10, tem.

## Checklist de go/no-go para o primeiro trimestre de 2026

Antes de aprovar a migração de um sistema crítico, eu quero "sim" em todas estas:

- [ ] Inventário de serviços com TFM, dependências NuGet e data de EOL
- [ ] Testes de contrato (ou snapshot de API) rodando no pipeline dos serviços críticos
- [ ] Lista de breaking changes 6→8→9→10 revisada contra o código, não por amostragem
- [ ] Pipeline capaz de buildar e implantar as duas versões de runtime lado a lado
- [ ] Canário com roteamento percentual e comparação automatizada de p99 e taxa de erro
- [ ] Janela de estabilização por serviço e critério de rollback por escrito
- [ ] Terceiros (APM, SDKs internos, mensageria) com suporte declarado ao .NET 10

Se algum item falhar, o trabalho do trimestre é esse item — não a migração.

Meu take: migre para o .NET 10, e migre em 2026 — pelo LTS até 2028, pelos ganhos de runtime que você vai medir, e principalmente porque a fundação de IA da plataforma agora é nativa e agnóstica de fornecedor. Mas migre como engenheiro sênior: serviço a serviço, contrato testado, canário medido, rollback barato. Big bang de runtime é dívida com data de cobrança marcada.

Escrevo na minha newsletter sobre engenharia, .NET e adoção de IA em sistemas que não podem parar — se este artigo te poupou uma reunião, ela vai te poupar várias.
