---
title: "Onde o LLM entra na sua arquitetura: 4 padrões de integração e quando usar cada um"
excerpt: "Gateway centralizado, feature embarcada, worker assíncrono ou agente com ferramentas? Um mapa de decisão para integrar LLMs em sistemas existentes sem criar um monólito de prompts."
date: "2026-01-13"
duration: "9 min"
category: "Arquitetura"
image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=80"
---

A primeira chamada para um LLM em um sistema enterprise quase nunca passa por revisão de arquitetura. Alguém adiciona um SDK, cola um prompt numa string, abre o PR numa sexta-feira — e funciona. Seis meses depois há prompts espalhados por doze serviços, ninguém sabe quanto aquilo custa por mês, e trocar de modelo virou um projeto de refatoração de três sprints. Vi esse filme se repetir ao longo de 2025 em times muito bons, e a causa raiz é sempre a mesma: tratar o LLM como biblioteca, quando ele se comporta como uma dependência externa cara, lenta e não determinística.

A boa notícia é que a indústria já convergiu para um conjunto pequeno de padrões de integração. São quatro. A maioria dos sistemas que ajudo a evoluir acaba usando dois ou três deles ao mesmo tempo — o erro não é escolher o padrão "errado", é não escolher nenhum.

## Padrão 1 — AI Gateway: roteamento, rate limit e custo num lugar só

O gateway é um proxy entre os seus serviços e os provedores de modelo. Toda chamada de LLM da organização passa por ele, e é ali que vivem as preocupações transversais:

- **Roteamento de modelos**: fallback automático quando um provedor degrada, troca de modelo sem redeploy, testes A/B entre versões.
- **Rate limiting por consumidor**: o time de marketing não derruba a cota do time de operações.
- **Controle de custo**: budget por equipe e por feature, com alerta antes de estourar — não uma fatura surpresa no fim do mês.
- **Cache, mascaramento de PII e logging centralizado** de cada request e response.

Ferramentas como LiteLLM e o AI Gateway da Cloudflare resolvem isso bem; em ambientes Azure-first, o API Management com as políticas de GenAI (limite de tokens, métricas por subscription) é o caminho natural e passa mais fácil pelo time de segurança.

Quando usar: assim que houver **mais de um time ou serviço** consumindo LLM. Quando não usar: um único produto com uma única feature de IA — aí o gateway é burocracia antecipada.

## Padrão 2 — Feature embarcada: o LLM atrás de uma interface do seu domínio

Aqui o LLM é detalhe de implementação de um bounded context. A interface fala a língua do negócio — sumarizar chamado, classificar documento — e não a língua do modelo. Prompt, temperatura e nome do modelo são tão privados quanto uma query SQL.

```csharp
public interface ISumarizadorDeChamados
{
    Task<ResumoChamado> SumarizarAsync(Chamado chamado, CancellationToken ct);
}

internal sealed class SumarizadorViaLlm(IChatClient chat) : ISumarizadorDeChamados
{
    public async Task<ResumoChamado> SumarizarAsync(Chamado chamado, CancellationToken ct)
    {
        var resposta = await chat.GetResponseAsync<ResumoChamado>(
            $"""
            Resuma o chamado abaixo em até três frases, em pt-BR,
            e classifique a urgência como Baixa, Media ou Alta.

            {chamado.Descricao}
            """,
            cancellationToken: ct);

        return resposta.Result;
    }
}
```

No .NET, o `IChatClient` do Microsoft.Extensions.AI já abstrai o provedor — mas isso não substitui a abstração de domínio, que é responsabilidade sua. Com a interface no lugar, o consumidor é testável com um stub, o prompt é versionado junto do contexto que o usa, e amanhã essa implementação pode virar um modelo menor, um cache ou até uma regra determinística sem que o resto do sistema perceba.

Quando usar: features síncronas onde o usuário está esperando — com streaming na UI para mascarar a latência.

## Padrão 3 — Worker assíncrono: quando ninguém está esperando a resposta

Boa parte das cargas de LLM em empresa não tem usuário olhando: enriquecimento de cadastro, classificação de documentos recebidos, geração de embeddings para o RAG, resumos noturnos de tickets. Para tudo isso, o padrão é fila e processamento em lote: uma mensagem entra no Service Bus ou SQS, um `BackgroundService` consome, chama o modelo, persiste o resultado.

As vantagens são concretas. Retry de falha transitória sai de graça. O throughput é controlado por você, não pelo rate limit do provedor no pior momento possível. E as batch APIs dos principais provedores cobram cerca de metade do preço da chamada síncrona — em volume, isso decide o business case sozinho. Num projeto recente de um cliente da área de saúde, mover a classificação de documentos do fluxo síncrono para um worker em lote cortou o custo da feature quase pela metade e ainda eliminou os timeouts que assombravam o time.

Quando usar: sempre que a latência aceitável for de minutos, não de segundos. É o padrão mais subestimado dos quatro.

## Padrão 4 — Agente com ferramentas via MCP: poder com escopo mínimo

O agente é o padrão da moda e o mais perigoso: o modelo decide, em tempo de execução, quais ferramentas chamar e em que ordem. O MCP virou o padrão de fato para expor essas ferramentas — com SDK oficial em C#, dá para servir tools de um sistema .NET existente em poucas horas.

O problema raramente é fazer funcionar; é fazer funcionar com governança. Minhas regras, aprendidas em produção:

- **Escopo mínimo**: o agente recebe as ferramentas daquele caso de uso, não "a API inteira via MCP".
- **Read-only por padrão**; ações que mutam estado exigem aprovação humana ou ficam fora.
- **Auditoria de toda chamada de tool**: quem, quando, com quais argumentos, com qual resultado.

E sobre quantidade: 40 tools deixam o agente mais burro que 8. Cada definição de ferramenta ocupa contexto, descrições parecidas competem entre si, e a taxa de erro na seleção cresce junto com o catálogo. Oito ferramentas bem nomeadas e bem descritas superam quarenta genéricas em qualquer avaliação que eu já tenha rodado. Curadoria de tools é trabalho de arquitetura, não de estagiário.

> LLM não é biblioteca. É um gateway de pagamento: caro por transação, fora do seu controle, sujeito a falha — e ninguém em sã consciência espalharia chamadas diretas ao adquirente por todos os controllers do sistema.

## Como decidir: quatro perguntas antes do primeiro prompt

1. **Latência** — tem usuário esperando? Feature embarcada com streaming. Ninguém esperando? Worker assíncrono, sem discussão.
2. **Custo por chamada** — alto volume? Gateway com budget e cache na frente, batch API sempre que possível.
3. **Criticidade** — se o output estiver errado, qual o estrago? Acima de um certo limiar, human-in-the-loop; acima de outro, LLM não entra.
4. **Auditabilidade** — ambiente regulado pede o log centralizado do gateway e a trilha de auditoria de tools do agente desde o dia um, não como retrofit.

Os padrões se compõem: gateway na frente de tudo, feature embarcada para o síncrono, worker para o lote, e agente apenas onde a tarefa é genuinamente aberta.

## Quando não usar agente (provavelmente o seu caso)

Se o fluxo cabe num diagrama com if/else, escreva o if/else. Usar um agente para um processo conhecido é pagar tokens para o modelo redescobrir o seu fluxograma a cada execução — com chance não nula de redescobrir errado. Um workflow determinístico que chama o LLM apenas nos pontos que exigem linguagem natural é mais barato, mais rápido e, principalmente, debugável.

E o anti-padrão que mais encontro em campo não é agente demais: é prompt espalhado. Strings hardcoded em controller, o mesmo prompt duplicado com pequenas variações em três serviços, zero versionamento, zero teste. Prompt é artefato crítico de configuração: centralize por bounded context, versione junto do código que o usa e tenha ao menos um conjunto mínimo de evals rodando no CI antes de trocar uma vírgula.

O take, então, é direto: trate o LLM como você trata um gateway de pagamento. Uma porta de entrada controlada, interfaces de domínio na frente, processamento assíncrono onde der, autonomia só com auditoria — e código determinístico para tudo que não precisa de um modelo. O resto é monólito de prompts esperando para acontecer.

Se você está levando LLMs para produção em sistemas que não podem parar, é exatamente sobre isso que escrevo na minha newsletter — assine e acompanhe.
