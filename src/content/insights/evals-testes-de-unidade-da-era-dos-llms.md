---
title: "Evals são os testes de unidade da era dos LLMs (e quase ninguém escreve)"
excerpt: "Feature com LLM sem eval é deploy no escuro: você não sabe se a troca de modelo ou de prompt melhorou ou quebrou tudo. Como construir avaliação que cabe no CI e no orçamento."
date: "2026-04-07"
duration: "10 min"
category: "IA"
image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1080&q=80"
---

A regressão mais cara que acompanhei em um sistema com LLM não veio de um bug — veio de uma melhoria. O time tinha uma feature de triagem de chamados estável há meses. Alguém ajustou o prompt para corrigir uma reclamação pontual, testou meia dúzia de exemplos no playground, o PR passou na revisão. Nas duas semanas seguintes, o sistema classificou errado uma categoria inteira de chamados que antes acertava. Ninguém percebeu na hora porque não tinha como perceber: não existia nada que dissesse "isso funcionava ontem e parou hoje".

Esse padrão se repete em praticamente todo time que conheço com IA em produção. Levamos vinte anos para internalizar que mudança de código sem teste é aposta. Mas prompt — que define o comportamento do sistema tanto quanto qualquer `if` — segue sendo editado no improviso e validado no olho.

## Por que "parece bom" não escala

LLMs falham de um jeito diferente de código tradicional. Código quebra de forma binária e barulhenta: exceção, stack trace, alerta no Slack. Um modelo de linguagem degrada de forma contínua e silenciosa: a resposta continua bem escrita, gramaticalmente impecável, com cara de certa — e errada. Não há exceção para capturar.

E as fontes de regressão se multiplicam:

- **Mudança de prompt.** Cada ajuste que corrige um caso pode quebrar cinco outros que ninguém reavaliou.
- **Upgrade de modelo.** Provedores depreciam versões em ciclos de poucos meses. Quando o modelo que você usa for desligado, a migração não vai ser opcional — e o modelo novo se comporta diferente em pontos que você não previu.
- **Mudança de contexto.** Em pipelines RAG, alterar chunking, embedding ou o top-k muda a entrada do modelo sem que ninguém toque no prompt.

Validar três exemplos no playground não cobre nada disso. É o equivalente a rodar a aplicação uma vez na máquina local e declarar o refactoring seguro.

> Prompt é código e modelo é dependência. Se mudança de código exige teste e atualização de dependência exige validação, a mudança de prompt sem eval é a única alteração do seu sistema que chega em produção sem nenhuma evidência de que funciona.

## Golden set: comece com 100 casos, não com um projeto

A objeção que mais escuto é "não temos tempo de montar uma suíte de avaliação". A resposta é que ninguém precisa de uma suíte completa no primeiro dia — precisa de um golden set: um arquivo versionado com casos representativos e o resultado esperado de cada um.

Para montar um sem virar projeto de seis meses:

1. **Extraia da produção, não da imaginação.** Pegue logs reais: os casos mais frequentes, os que geraram reclamação, os que o modelo já errou.
2. **Cubra as quatro famílias**: caminho feliz, casos de borda (entrada ambígua, texto truncado, mistura de idiomas), casos adversariais (tentativa de injection, pedido fora de escopo) e casos em que a resposta certa é recusar.
3. **Marque os críticos.** Em um cliente do setor financeiro, "nunca inventar valor de contrato" não é um caso com peso maior na média — é um caso que bloqueia merge sozinho.
4. **Pare em ~100.** Cem casos bem escolhidos pegam a esmagadora maioria das regressões e dá para montar em uma ou duas semanas com quem conhece o domínio. Depois o conjunto cresce organicamente: todo incidente em produção vira caso novo, exatamente como bug vira teste de regressão.

## LLM-as-judge: funciona, mas exige calibração

Parte do golden set se valida com código puro: a saída é JSON válido? O campo `categoria` está no enum? O valor citado existe no documento de origem? Faça essas checagens determinísticas primeiro — são grátis e não alucinam.

O que sobra é subjetivo: fidelidade à fonte, tom, completude. Aí entra o LLM-as-judge — um segundo modelo que recebe entrada, saída e uma rubrica explícita, e devolve um score. Três regras que aprendi pagando o preço:

- **Rubrica explícita, critérios independentes.** "A resposta é boa?" gera ruído. "A resposta cita apenas valores presentes no contexto? (sim/não)" gera sinal.
- **Calibre contra humanos antes de confiar.** Separe 30 a 50 casos, avalie manualmente, compare com o juiz. Concordância baixa quase sempre é rubrica vaga — reescreva e repita. E recalibre sempre que trocar o modelo do juiz.
- **Conheça os vieses.** Juízes tendem a preferir respostas mais longas e respostas da própria família de modelos. Usar como juiz um modelo diferente do avaliado reduz o segundo problema.

Sobre custo: rodar 100 casos com um modelo pequeno como juiz custa centavos de dólar por execução. Mesmo usando um modelo de ponta, é ordens de grandeza mais barato do que uma hora de incidente em produção. Custo não é argumento contra eval; é argumento a favor.

## Evals no CI: prompt mudou, pipeline roda

Aqui é onde a maioria dos times para no meio do caminho — e onde está o ganho real. O prompt sai do dashboard do fornecedor e vai para o repositório. Qualquer PR que toque em prompt, configuração de modelo ou no próprio golden set dispara a suíte:

```yaml
on:
  pull_request:
    paths:
      - "src/Prompts/**"
      - "src/AI/ModelOptions.cs"
      - "evals/**"
```

E o eval vira um teste como outro qualquer — no nosso caso, xUnit em cima do `IChatClient` do Microsoft.Extensions.AI:

```csharp
[Fact]
public async Task Prompt_de_triagem_mantem_qualidade_no_golden_set()
{
    var casos = GoldenSet.Carregar("evals/triagem/golden-set.json");
    var resultados = new List<ResultadoEval>();

    foreach (var caso in casos)
    {
        var resposta = await _chatClient.GetResponseAsync(
            PromptLibrary.TriagemChamados.Render(caso.Entrada));

        // Determinístico primeiro: schema e enum não alucinam
        var saida = JsonSerializer.Deserialize<TriagemSaida>(resposta.Text);
        Assert.NotNull(saida);

        // Juiz só para o que é subjetivo
        resultados.Add(await _juiz.AvaliarAsync(caso, saida));
    }

    Assert.True(
        resultados.Where(r => r.Caso.Critico).All(r => r.Aprovado),
        "Caso crítico regrediu — merge bloqueado.");

    var scoreMedio = resultados.Average(r => r.Score);
    Assert.True(scoreMedio >= 0.85,
        $"Score médio {scoreMedio:P0} abaixo do mínimo de 85%.");
}
```

Dois limiares, propositalmente diferentes: casos críticos exigem 100%, o restante trabalha com média mínima — porque LLM tem variância, e tratar todo caso como crítico só ensina o time a ignorar pipeline vermelho. Troca de modelo passa pelo mesmo caminho: muda a configuração no PR, a suíte roda contra o modelo novo, e a decisão de migrar deixa de ser "parece ok" para virar um diff de scores.

## Produção é o eval que nunca termina

O golden set protege o merge; não protege contra o que muda depois dele. Modelos servidos por trás de um alias mudam de comportamento sem aviso, o perfil das entradas reais deriva com o tempo, e o caso que você não previu sempre chega. Três mecanismos baratos:

- **Amostragem contínua**: uma fração do tráfego real passa pelo juiz de forma assíncrona, e o score médio vira métrica de série temporal — com alerta de queda, como qualquer SLO.
- **Feedback do usuário como eval grátis**: o thumbs down não é métrica de vaidade invertida; é candidato a caso novo no golden set.
- **Replay periódico**: rodar o golden set contra o ambiente de produção toda semana pega drift de modelo que nenhum deploy seu causou.

## Evals como evidência: o que a governança vai pedir

Há um efeito colateral que vale mais do que parece em ambiente enterprise: a trilha de auditoria. Quando o comitê de risco — ou o regulador — perguntar "como vocês sabem que esse sistema funciona e quem aprovou essa mudança de comportamento?", um golden set versionado no git, com resultado de eval anexado a cada PR e métrica de qualidade histórica em produção, é uma resposta documentada. "O arquiteto testou no playground" não é. Para quem precisa aprovar adoção de IA com jurídico e compliance, esse argumento destrava mais conversa do que qualquer benchmark público.

O take, sem rodeio: trate prompt e escolha de modelo como código. Toda mudança passa por um golden set versionado, no CI, com limiar que bloqueia merge — sem isso, cada "melhoria" é uma aposta sem registro, e você só descobre que perdeu quando o cliente avisa.

Quinzenalmente eu destrincho esse tipo de prática — IA com disciplina de engenharia — na minha newsletter. Se o tema te interessa, vale assinar.
