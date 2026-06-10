---
title: "Retrospectiva 2025: agentes saíram do hype, mas ainda não saíram do sandbox"
excerpt: "Balanço técnico do ano em que todo fornecedor anunciou agentes: o que chegou a produção de verdade, o que ficou em piloto e os padrões que se firmaram."
date: "2025-12-30"
duration: "7 min"
category: "IA"
type: "article"
isExternal: false
link: "/radar/article/retrospectiva-2025-agentes-fora-do-hype"
source: "Local"
image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1080&q=80"
---

Passei 2025 respondendo à mesma pergunta em comitês de arquitetura: "dá para colocar um agente nisso?". A resposta quase sempre foi "dá — mas não do jeito que a demo sugere". No fechamento do ano, vale separar o que mudou de verdade do que continua sendo slide de keynote.

## O ano em que concorrentes assinaram o mesmo protocolo

O fato técnico mais importante de 2025 não foi nenhum modelo. Foi o Model Context Protocol virar ponto de convergência: a Anthropic publicou o padrão, a OpenAI aderiu em março, Google e Microsoft vieram na sequência — incluindo suporte no Windows anunciado na Build. Pela primeira vez nessa corrida, integrar uma ferramenta a um assistente deixou de ser trabalho refeito por fornecedor.

Isso mudou meu desenho de soluções: o conector que expõe um ERP a um copiloto interno hoje funciona em qualquer cliente MCP. Mas trouxe superfície de ataque nova. Servidor MCP é dependência como outra qualquer — exige revisão, versão pinada e privilégio mínimo. Tool poisoning deixou de ser papel acadêmico este ano.

## Coding agents: ganho real, métrica errada

Nos times enterprise que acompanho, Copilot e Claude Code viraram rotina. O ganho é real em scaffolding, testes e migrações mecânicas — e evapora em código de domínio complexo sem suíte de testes. O estudo da METR em julho foi o balde de água fria necessário: desenvolvedores experientes ficaram cerca de 19% mais lentos usando IA em bases que dominavam, convencidos de que estavam mais rápidos. Percepção de produtividade não é produtividade.

O padrão que vi funcionar: autonomia proporcional à qualidade do harness. Primeiro CI forte, testes confiáveis e revisão obrigatória; autonomia depois. Sem isso, o agente só acelera a produção de entropia.

## Incidentes públicos: a aula mais cara do ano

O caso do agente que apagou um banco de produção em pleno code freeze — e depois "explicou" que entrou em pânico — resumiu o problema do ano. Não faltou capacidade ao modelo; sobrou permissão. Os incidentes de 2025 convergem para a mesma lista:

- credenciais de produção nunca no ambiente do agente;
- ação destrutiva atrás de aprovação humana, sem exceção;
- trilha auditável de cada tool call, não só do resultado final.

> Agente em produção não é um problema de modelo. É um problema de permissão: o que ele pode fazer importa mais do que qual LLM o executa.

## A infraestrutura silenciosa que amadureceu

Enquanto os agentes ocupavam o palco, o que amadureceu de verdade foi o encanamento: structured outputs com schema garantido, tool calling paralelo, abstrações estáveis nos SDKs. No .NET, o Microsoft.Extensions.AI — estável desde meados do ano — deixou isso com cara de código normal:

```csharp
[Description("Reprocessa uma nota fiscal rejeitada pela SEFAZ.")]
async Task<Protocolo> ReprocessarNota(
    [Description("Chave de acesso da NF-e (44 dígitos)")] string chaveAcesso,
    CancellationToken ct)
{
    Nota nota = await _notas.ObterAsync(chaveAcesso, ct);
    // enfileira em vez de executar: nenhum efeito destrutivo direto
    return await _fila.EnfileirarReprocessamentoAsync(nota, ct);
}

var options = new ChatOptions
{
    Tools = [AIFunctionFactory.Create(ReprocessarNota)],
    ResponseFormat = ChatResponseFormat.ForJsonSchema(
        AIJsonUtilities.CreateJsonSchema(typeof(TriagemNota)))
};
```

Schema validado na borda elimina a classe inteira de bugs do "modelo devolveu quase-JSON". Em 2023 isso era regex e oração; em 2025 virou contrato. É a parte menos glamourosa do stack — e a que mais destravou casos de uso reais.

## 2026: autonomia progressiva ou demo eterna

Minhas apostas para o ano que entra: **autonomia progressiva** como padrão de projeto — o agente começa read-only e ganha permissão de escrita com histórico, como um dev júnior em onboarding — e **governança** virando critério de compra. O cliente enterprise de 2026 não vai perguntar qual modelo você usa; vai pedir política de permissões, evals contínuos e plano de rollback.

2025 consolidou os protocolos e as ferramentas. 2026 vai separar quem opera agentes — com guardrails, auditoria e evals — de quem só demonstra agentes em ambiente controlado. Pretendo estar do lado de quem opera.

É esse acompanhamento que faço mês a mês na minha newsletter — se este balanço te interessou, 2026 vai dar muito assunto.
