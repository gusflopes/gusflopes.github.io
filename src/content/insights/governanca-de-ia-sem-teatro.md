---
title: "Governança de IA sem teatro: controles que um time de engenharia consegue operar"
excerpt: "Entre o comitê que bloqueia tudo e o uso indiscriminado, existe um caminho: controles automatizáveis, auditáveis e proporcionais ao risco de cada caso de uso."
date: "2026-03-10"
duration: "12 min"
category: "IA"
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1080&q=80"
---

Quase toda empresa que visito está em um de dois extremos. No primeiro, existe um comitê de governança de IA que se reúne uma vez por mês, exige um formulário de catorze páginas para qualquer caso de uso e acumula uma fila de seis meses de pedidos parados — enquanto isso, os times usam IA do mesmo jeito, só que escondidos. No segundo extremo não existe nada: ninguém sabe quantos sistemas em produção chamam um LLM, com qual prompt, com qual versão de modelo, processando dados de quem.

Os dois cenários falham pelo mesmo motivo: tratam governança como evento, não como sistema. O comitê mensal é um evento. O formulário é um evento. E eventos não escalam para uma realidade em que um time de produto muda um prompt três vezes por semana. Minha posição, depois de mais de um ano implantando IA em ambientes regulados, é direta: governança boa é a que roda no pipeline. O resto é cerimônia.

## O que o AI Act ensina mesmo a quem não vende para a Europa

Poucos dos meus clientes precisam de conformidade formal com o EU AI Act. Mesmo assim, recomendo que todo arquiteto leia ao menos a estrutura da lei, porque ela acerta em uma coisa que a maioria das políticas internas erra: **o risco está no caso de uso, não na tecnologia**.

O mesmo modelo que completa código no IDE de um desenvolvedor pode, em outro contexto, resumir o histórico de um cliente para uma decisão de crédito. Tecnologia idêntica, riscos incomparáveis. O AI Act — cujas obrigações para sistemas de alto risco entram em vigor em agosto deste ano — organiza tudo em camadas: práticas proibidas, alto risco com controles pesados, risco limitado com deveres de transparência, e o resto com exigências mínimas.

A lição prática é a proporcionalidade. Internamente, uso uma classificação de três níveis que cabe em uma página:

- **Baixo**: produtividade interna, sem dados de cliente. Copilot no IDE, resumo de documentação. Controle: termos de uso e telemetria.
- **Médio**: toca dados de cliente, mas a decisão final é humana e informada. RAG sobre base de conhecimento, triagem assistida. Controle: guardrails de runtime, evals contínuos, logging completo.
- **Alto**: a saída do modelo influencia diretamente decisão que afeta pessoas — crédito, elegibilidade, detecção de fraude. Controle: tudo do nível médio, mais revisão humana obrigatória e trilha de auditoria por interação.

Essa tabela vive em um repositório, versionada, com dono. Não em um PDF no SharePoint que ninguém abre desde a última auditoria.

## Inventário: modelos, prompts e versões são artefatos de engenharia

Ninguém governa o que não consegue listar. A primeira pergunta de qualquer auditor — interno ou externo — é "quais sistemas de IA vocês têm em produção?", e a maioria das empresas responde com silêncio constrangedor.

O inventário que funciona não é uma planilha: é um registro com a mesma disciplina que aplicamos a qualquer dependência crítica. Para cada sistema, quero saber o identificador do modelo **com versão pinada** (não "GPT-4o", mas o snapshot exato), o prompt versionado em arquivo no repositório com code review e changelog, o tier de risco, o dono, e os datasets de avaliação associados.

Prompt em variável de ambiente editada à mão é o equivalente moderno do `web.config` alterado em produção via RDP. Upgrade de modelo é pull request: muda o pin, roda a suíte de evals, compara, aprova. Quando o provedor anuncia depreciação de uma versão, o inventário responde em minutos quem é impactado — sem ele, a resposta leva semanas e vem errada.

## Guardrails em runtime: política como código

Política escrita em wiki descreve intenção. Política implementada como código define comportamento. Em sistemas .NET, a abstração `IChatClient` do Microsoft.Extensions.AI dá um ponto de corte natural: um `DelegatingChatClient` aplica as regras antes e depois de cada chamada, para qualquer sistema registrado no DI — sem depender da boa vontade de cada time.

```csharp
public sealed class PolicyEnforcingChatClient(
    IChatClient inner,
    IPiiDetector pii,
    IAuditLog audit) : DelegatingChatClient(inner)
{
    public override async Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> messages,
        ChatOptions? options = null,
        CancellationToken ct = default)
    {
        var findings = await pii.ScanAsync(messages, ct);
        if (findings.Any(f => f.Severity >= PiiSeverity.Restricted))
            throw new PolicyViolationException(findings);

        var response = await base.GetResponseAsync(messages, options, ct);

        await audit.RecordAsync(new AiInteraction(
            SystemId: "credit-summary-v3",
            ModelId: response.ModelId,
            PromptVersion: options?.AdditionalProperties?["prompt-version"]?.ToString(),
            PiiFindings: findings,
            Timestamp: DateTimeOffset.UtcNow), ct);

        return response;
    }
}
```

A detecção de PII não precisa ser inventada em casa: Presidio resolve bem o caso geral, e os serviços gerenciados de nuvem cobrem o resto. O que importa é o desenho — entrada filtrada, saída inspecionada, interação registrada com modelo, versão de prompt e achados. Quando o jurídico pergunta "como vocês garantem que dado sensível não vai para o modelo?", a resposta é um trecho de código e um dashboard, não uma promessa.

> Governança que não roda no pipeline é opinião. O comportamento do sistema em produção é definido pelo código que executa, não pela ata da reunião.

## Evals como evidência de conformidade

Existe uma sobreposição quase perfeita entre o que um auditor quer e o que um bom time de engenharia já deveria ter: evidência contínua de que o sistema se comporta como especificado. Avaliação de qualidade de LLM — groundedness, taxa de recusa, vazamento de dados, regressão em casos dourados — deixou de ser pesquisa e virou disciplina de pipeline.

A mecânica é a mesma de testes de integração: cada mudança de prompt ou de modelo dispara a suíte, e thresholds bloqueiam o deploy.

```yaml
# ci/eval-gate.yml
evals:
  - suite: groundedness
    dataset: datasets/credit-faq-v7.jsonl
    threshold: 0.92
  - suite: pii-leakage
    dataset: datasets/redteam-pii.jsonl
    max_failures: 0
block_deploy_on_failure: true
```

O detalhe que transforma isso em governança: **os resultados são versionados junto com o código**. Cada execução gera um relatório imutável, associado ao commit, ao pin de modelo e à versão do prompt. Isso é trilha de auditoria de verdade. Quem está olhando para a ISO/IEC 42001 vai notar que a norma pede exatamente monitoramento contínuo com evidência — e um histórico de evals responde isso melhor do que qualquer ata de comitê.

## Human-in-the-loop calibrado por risco, não por burocracia

Revisão humana é um dial, não um checkbox. No tier baixo, amostragem posterior basta. No médio, revisão dirigida: casos abaixo de um limiar de confiança ou sinalizados pelos guardrails vão para fila humana. No alto, aprovação obrigatória antes de qualquer efeito — mas com uma interface que mostra as fontes e a justificativa, porque revisor que aprova duzentos itens por dia clicando no mesmo botão não é controle, é teatro com crachá.

E meça a taxa de discordância dos revisores. Se ninguém nunca discorda do modelo, ou o sistema está excelente ou a revisão é fictícia — e são os evals que dizem qual dos dois.

## O arquiteto na ponte entre jurídico, segurança e engenharia

Jurídico fala em risco regulatório, segurança fala em superfície de ataque, engenharia fala em latência e custo. Ninguém está errado; estão falando idiomas diferentes sobre o mesmo sistema. O trabalho do arquiteto é traduzir: transformar "minimização de dados" em detector de PII no decorator e mascaramento na retenção de logs; transformar "supervisão humana efetiva" em limiar de confiança e fila de revisão com SLA.

A tradução de mão dupla é o que destrava: em vez de pedir permissão ao jurídico, levo opções com custo e risco quantificado. O comitê não desaparece — muda de função. Vira instância de exceção: aprova a tabela de tiers, valida os thresholds, e só é acionado quando um caso de uso não se encaixa nas regras existentes. Todo o resto roda no pipeline, todos os dias, sem reunião.

É isso que separa governança de teatro: se a sua política de IA não pode ser expressa como código, testes e thresholds que bloqueiam deploy, ela não existe na prática — existe só na apresentação. Comece pelo inventário, classifique por risco, automatize os controles do tier mais alto primeiro. O comitê mensal agradece por finalmente ter pauta de verdade.

Escrevo sobre esse tipo de decisão — a que fica entre o slide e o deploy — na minha newsletter. Assine se esse for o seu dia a dia também.
