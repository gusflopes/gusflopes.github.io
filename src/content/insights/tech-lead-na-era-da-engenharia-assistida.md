---
title: "O tech lead na era da engenharia assistida: revisar máquinas é o novo trabalho"
excerpt: "Quando agentes escrevem boa parte do código, o gargalo muda de produção para julgamento. O que muda na prática para quem lidera times técnicos — e o que continua exatamente igual."
date: "2026-06-02"
duration: "10 min"
category: "Carreira"
image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1080&q=80"
---

Semana passada revisei um PR de mais de mil linhas que um agente escreveu em menos de uma hora. Compilava, os testes passavam, o estilo estava impecável. Levei uma tarde inteira para aprovar — e ainda assim devolvi com dois problemas que teriam ido para produção. Esse desequilíbrio resume o momento: a produção de código ficou absurdamente barata, e a conta foi transferida inteira para quem revisa e decide.

Trabalho com adoção de IA em times enterprise no dia a dia, a maioria em .NET, e a pergunta que mais escuto de tech leads não é "qual ferramenta usar". É "o que sobrou do meu trabalho?". A resposta curta: sobrou a parte cara. A IA elevou o piso da produção e subiu o preço do julgamento sênior. O trabalho do líder técnico agora é industrializar esse julgamento — transformá-lo de heroísmo individual em processo do time.

## O funil inverteu: produzir é barato, decidir é caro

O funil clássico de um time era: muita conversa, alguma especificação, e a maior parte do tempo escrevendo código. Com Copilot e Claude operando dentro do fluxo — e agentes conectados via MCP ao repositório, ao board e ao ambiente de testes — esse funil virou de cabeça para baixo. O tempo de digitação encolheu. O que cresceu foi tudo ao redor:

- **Especificar**: um agente executa exatamente o que você pediu, inclusive as ambiguidades. Especificação ruim agora vira código ruim em minutos, não em sprints.
- **Revisar**: o volume de código por revisor subiu. Se o seu processo de review era um gargalo antes, agora ele é *o* gargalo.
- **Decidir**: arquitetura, trade-offs, o que não construir. Nada disso a máquina decide por você — ela só torna cada decisão errada mais rápida de implementar.

Para o tech lead, isso significa realocar o próprio tempo de forma consciente. Eu passei a tratar a escrita de especificações e critérios de aceite como artefato de engenharia de primeira classe, com o mesmo rigor que antes reservava para código. É ali que o time ganha ou perde a semana.

## O erro plausível: como revisar código que parece certo

Código gerado erra diferente de código humano. Humano cansado esquece um null check, deixa um TODO, comete erro feio e visível. O agente produz erro *plausível*: bem formatado, com nomes bons, cobertura de teste e uma falha de raciocínio enterrada no meio. Um exemplo do tipo que já barrei mais de uma vez:

```csharp
public async Task<Result> ProcessarPagamentoAsync(PagamentoRequest request)
{
    var existente = await _repo.ObterPorChaveIdempotenciaAsync(request.ChaveIdempotencia);
    if (existente is not null)
        return Result.Duplicado(existente.Id);

    var pagamento = Pagamento.Criar(request.Valor, request.Moeda);
    await _repo.AdicionarAsync(pagamento);
    await _unitOfWork.CommitAsync();

    return Result.Sucesso(pagamento.Id);
}
```

Está limpo, está testado, e está errado. O check-then-insert sem constraint única no banco é uma condição de corrida clássica: duas requisições com a mesma chave de idempotência passam pela verificação ao mesmo tempo e o pagamento é processado duas vezes. Nenhum teste unitário pega isso. O agente "sabia" o padrão de idempotência, mas não sabia que o seu banco não tem o índice único — porque isso não estava no prompt.

Minhas heurísticas para review de código gerado, refinadas no atrito:

1. **Leia as fronteiras primeiro**: transação, concorrência, timezone, cultura, encoding. É onde o erro plausível mora, porque é onde o contexto implícito do sistema não estava no prompt.
2. **Desconfie de simetria perfeita**: código gerado adora tratar todos os casos com a mesma elegância — inclusive casos que não existem no seu domínio, enquanto ignora o caso esquisito que existe.
3. **Revise os testes contra a especificação, não contra o código**: agente gera teste que afirma o que o código *faz*, não o que ele *deveria* fazer. Teste verde de código errado é pior que ausência de teste.
4. **Procure a premissa que não estava no pedido**: todo trecho gerado assume algo sobre infraestrutura, volume ou ordem de eventos. Encontre a premissa e valide.

## Fundamentos não são nostalgia, são a alavanca

Existe um discurso de que arquitetura, modelagem de domínio e disciplina de testes ficaram menos relevantes porque "a IA resolve". Na prática observo o oposto. O agente amplifica o que encontra: num codebase com fronteiras claras, injeção de dependência bem feita e testes que expressam comportamento, o código gerado chega certo com frequência impressionante — o contexto correto está todo ali, legível. Num monólito acoplado, o mesmo agente gera código que perpetua e acelera o acoplamento.

Fundamentos viraram alavanca de produtividade da máquina, não só do humano. Quem domina o domínio escreve o prompt que importa e detecta o erro plausível em segundos. Quem não domina aprova PR bonito e descobre o problema no incidente.

> A IA não barateou o trabalho sênior. Ela barateou tudo o que fingia ser trabalho sênior — e deixou o julgamento de verdade mais caro do que nunca.

## O que o DORA mostra: throughput sobe, estabilidade paga a conta

Não é só impressão de quem revisa. O relatório DORA de 2024 trouxe um dado incômodo: adoção de IA correlacionada com *queda* de throughput e de estabilidade de entrega. A edição de 2025 mostrou o throughput finalmente subindo nos times mais maduros — mas a instabilidade continuou piorando junto com a adoção. Em outras palavras: estamos entregando mais e quebrando mais.

A leitura que faço é direta: o ganho de produção chegou antes do ganho de verificação. Times adotaram a parte fácil (gerar código) sem reforçar a parte difícil (validar código). Para o tech lead, isso define a pauta de métricas:

- **Change failure rate e tempo de recuperação** ganham peso sobre lead time. Velocidade sem estabilidade é só uma forma cara de gerar retrabalho.
- **Taxa de retrabalho pós-merge** é o termômetro do erro plausível passando pelo review.
- **Tamanho de PR** precisa de teto. Agente gera PR gigante com facilidade; PR gigante é onde o julgamento humano falha primeiro.

Se o seu time adotou IA e nenhuma métrica de estabilidade entrou no dashboard junto, a adoção está pela metade.

## A escada quebrada: formar juniores quando a IA faz trabalho de junior

O problema mais sério não aparece em métrica nenhuma deste trimestre. Juniores sempre aprenderam fazendo o trabalho que os agentes agora fazem: o CRUD, o bug pequeno, a tela repetitiva. Esses degraus eram chatos, mas eram onde se construía a intuição que depois vira julgamento sênior. Removê-los sem repor é quebrar a escada e fingir que o problema é do próximo gestor.

Não tenho solução completa, mas tenho práticas que estão funcionando nos times que acompanho:

- **Junior revisa máquina, sênior revisa junior.** Ler código criticamente vira a primeira habilidade da carreira, não a última. O junior aprende a achar o erro plausível com rede de proteção.
- **Rotação em incidentes e debugging**, sempre acompanhado. Produção é onde as premissas escondidas aparecem, e é insubstituível como escola.
- **Trabalho sem assistência, deliberado e dosado.** Não por nostalgia: porque depurar o que a máquina escreveu exige saber escrever sem ela.

Formar gente continua sendo trabalho do líder. A IA não assumiu essa parte — só tornou mais fácil ignorá-la até a fatura chegar.

## Industrializar o julgamento

O que mudou: o gargalo saiu da produção e foi para a revisão e a decisão. O que continua igual: alguém precisa responder pelo que vai para produção, e esse alguém não é o agente. O tech lead que prosperar nessa fase será o que transformar julgamento em sistema — especificações rigorosas, heurísticas de review explícitas e ensinadas, métricas de estabilidade com o mesmo status que velocidade, e uma escada nova para quem está começando. Revisar máquinas é o novo trabalho. Fazer isso em escala, sem virar o gargalo humano do time, é a nova senioridade.

*Escrevo sobre engenharia de software e adoção de IA em ambientes enterprise na newsletter **Em Produção** — se o tema te interessa, é por lá que a conversa continua.*
