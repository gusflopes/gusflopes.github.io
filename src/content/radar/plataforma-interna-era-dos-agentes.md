---
title: "Engenharia de plataforma na era dos agentes: o golden path agora precisa de MCP"
excerpt: "Agentes de código viraram usuários da sua plataforma interna — e o golden path desenhado para humanos não serve para eles. O que muda em CI/CD, observabilidade e custo."
date: "2026-02-24"
duration: "7 min"
category: "DevOps"
type: "article"
isExternal: false
link: "/radar/article/plataforma-interna-era-dos-agentes"
source: "Local"
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80"
---

Em um cliente do varejo, o time de plataforma notou algo curioso na telemetria: uma fatia crescente das chamadas ao service catalog e aos templates internos não vinha de gente navegando no portal — vinha de agentes de código rodando no Copilot e no Claude Code dos desenvolvedores. A plataforma interna ganhou um novo tipo de usuário, e ninguém desenhou nada para ele.

O golden path clássico — portal bonito, wiki com screenshots, template no Backstage, runbook no Confluence — foi pensado para um humano com paciência e contexto acumulado. Agente não tem nem um nem outro. Ele não "lê a wiki": ou a informação chega estruturada na janela de contexto, ou ele inventa. E agente inventando convenção de infraestrutura é o jeito mais caro de descobrir que sua documentação era ruim.

## Agentes são a nova persona da plataforma

O que um agente precisa para usar bem a sua plataforma é exatamente o que você deveria ter construído desde o início:

- **Documentação versionada junto ao código**, em markdown, sem depender de screenshot de portal que mudou há dois releases.
- **Templates parametrizáveis por CLI ou API**, não wizard clicável. Se o scaffolding só funciona apertando botão, ele não existe para o agente.
- **Contratos explícitos**: OpenAPI nos serviços internos, schemas nos eventos, convenções escritas em vez de combinadas no corredor.

Meu teste prático: se um agente não consegue criar um serviço novo do zero ao deploy sem alguém intervir, um dev júnior recém-chegado também sofre. O agente só tornou o problema impossível de ignorar.

## MCP server como interface oficial do golden path

A peça que destravou isso nos projetos em que atuo foi expor a plataforma via MCP. Em vez de torcer para o agente achar o template certo, publicamos um servidor MCP que é a interface oficial do golden path. Com o SDK C# oficial, a tool é quase boilerplate:

```csharp
[McpServerToolType]
public static class GoldenPathTools
{
    [McpServerTool]
    [Description("Cria um serviço novo a partir do template oficial da plataforma.")]
    public static async Task<string> ScaffoldService(
        string serviceName,
        [Description("Template: minimal-api, worker ou grpc")] string template,
        IScaffoldingService scaffolding,
        CancellationToken ct)
    {
        var result = await scaffolding.CreateFromTemplateAsync(serviceName, template, ct);
        return $"Serviço criado em {result.RepositoryUrl}. " +
               "Pipeline, observabilidade e alertas já configurados.";
    }
}
```

O valor não está no código, está no contrato. Scaffolding, consulta ao catálogo, criação de pipeline, provisionamento de banco — tudo vira tool com schema explícito, validação e log de auditoria. O agente para de adivinhar e passa a operar dentro do trilho. E há um efeito colateral excelente: para escrever a tool, o time de plataforma é obrigado a transformar conhecimento tribal em API.

> Plataforma boa para agentes é plataforma boa para humanos com contratos explícitos. Se o seu golden path só funciona com contexto tribal, ele nunca foi golden path — era um atalho documentado pela metade.

## CI/CD quando o volume de PRs triplica

Time que adota agente de verdade produz muito mais PRs — menores, mais frequentes e nem sempre melhores. O pipeline que segurava vinte PRs por dia engasga com sessenta. O que tenho visto funcionar:

- **Merge queue obrigatória.** Com esse volume, "rebase e torce" vira loteria de conflito.
- **Gates que bloqueiam, não que avisam.** Análise estática, cobertura em código novo e verificação de convenções precisam falhar o build. Warning é ruído que agente ignora tão bem quanto humano.
- **Caça implacável a teste flaky.** Um teste intermitente que irritava antes agora trava uma fila inteira de merges, várias vezes por dia.

Review humano continua existindo — mas reservado para decisão de design, não para apontar nome de variável. Isso é trabalho dos gates.

## Token é custo de plataforma, não despesa de ferramenta

Consumo de tokens em escala de organização é o novo custo de cloud: cresce em silêncio até alguém levar susto na fatura. O movimento é o mesmo do FinOps de dez anos atrás — quota por time, dashboards de consumo e showback ligando gasto a repositório e squad. Não defendo chargeback punitivo: visibilidade basta, times se autorregulam quando enxergam o próprio número. E o MCP server ajuda de novo, porque cada chamada de tool é um ponto natural de medição e atribuição.

O take: agentes não pedem uma plataforma nova, pedem a plataforma que você sempre deveria ter tido — contratos explícitos, automação de ponta a ponta, custo observável. Quem expõe o golden path via MCP transforma cada dev com agente em multiplicador; quem não expõe transforma cada agente em gerador de desvio de padrão.

É sobre esse tipo de decisão — plataforma, agentes e o que sobrevive ao contato com enterprise — que escrevo na newsletter **Em Produção**.
