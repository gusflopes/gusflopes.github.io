---
title: "Bounded Contexts viraram fronteiras de contexto: DDD na era dos LLMs"
excerpt: "A disciplina que usamos para delimitar modelos de domínio é exatamente a que falta nos projetos de IA: agentes precisam de fronteiras, linguagem onipresente e contratos explícitos."
date: "2026-02-10"
duration: "11 min"
category: "Arquitetura"
image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=80"
---

Revisei nos últimos meses uma quantidade razoável de arquiteturas de agentes em clientes enterprise, e o erro mais comum não é técnico — é de modelagem. O time conecta o agente a quarenta ferramentas, dá acesso ao wiki inteiro via RAG, despeja o schema do banco no system prompt e espera que o modelo se vire. O resultado é sempre o mesmo: o agente que tem acesso a tudo decide mal sobre qualquer coisa.

A parte irônica é que nós, da comunidade de arquitetura, já resolvemos esse problema uma vez. Chamamos a solução de Bounded Context. Só esquecemos de aplicá-la quando o componente novo do sistema passou a ser um modelo de linguagem.

## Contexto é recurso escasso — e agente onisciente é agente confuso

Janela de contexto grande não significa atenção infinita. Na prática, o que observo em produção: quando trinta ou quarenta schemas de ferramentas competem pela atenção do modelo, a taxa de seleção errada de tool sobe de forma visível; instruções importantes se diluem no meio de instruções irrelevantes; e o retrieval traz documentos de outro subdomínio usando as mesmas palavras com significados diferentes. "Conta" no contexto de cobrança não é "conta" no contexto de identidade — e o modelo, sem fronteira, mistura os dois com a maior confiança do mundo.

Nós já vimos esse filme. É o big ball of mud, agora com inferência. O modelo de dados único da empresa inteira falhou para times humanos por causa de termos ambíguos, regras que só valem em parte do negócio e acoplamento entre coisas que mudam por motivos diferentes. Falha para LLMs exatamente pelo mesmo motivo. Eric Evans escreveu a resposta em 2003; ela continua valendo quando quem consome o modelo é uma rede neural.

## O Bounded Context como unidade de design de agente

A mudança de postura que proponho aos times é simples: parar de desenhar "o agente da empresa" e começar a desenhar agentes por contexto. O agente de faturamento enxerga ferramentas de faturamento, dados de faturamento e o glossário de faturamento. Nada além disso.

O mapeamento entre os dois mundos é quase literal:

- **Bounded Context** → escopo do agente: system prompt, conjunto de tools e fontes de dados delimitados por uma fronteira de significado;
- **Context Map** → orquestração entre agentes: quem chama quem, com qual contrato, em qual direção;
- **Ubiquitous Language** → vocabulário dos prompts e dos schemas de tool calling;
- **Anti-corruption Layer** → validação da saída estruturada antes de ela tocar o domínio;
- **Aggregates** → as unidades transacionais que uma tool call pode modificar de uma vez.

Na prática, um agente com oito ferramentas coesas supera consistentemente um com quarenta. E quando o caso de uso atravessa contextos — cobrança precisa consultar cadastro, por exemplo —, a resposta não é engordar o agente: é orquestrar dois agentes com um contrato explícito entre eles. Exatamente o que faríamos com dois serviços. MCP, inclusive, empurra nessa direção: um servidor MCP bem desenhado é a interface publicada de um contexto, não um saco de endpoints.

> Um agente bem delimitado é um Bounded Context com inferência dentro. Quem passou a última década aprendendo a delimitar contextos tem uma vantagem injusta nesta.

## Linguagem onipresente é engenharia de prompt que o negócio entende

Aqui está algo que pouca gente internalizou: o nome dos campos no schema de tool calling **é** prompt. Se o negócio fala "apólice", "sinistro" e "regulação", e a sua tool se chama `process_claim_v2` com um parâmetro `policy_ref_id`, você está pedindo para o modelo traduzir entre dois vocabulários a cada inferência — e cada tradução é uma chance de erro.

LLMs completam padrões. Quando o vocabulário do system prompt, dos nomes de ferramentas, dos parâmetros e dos documentos recuperados é consistente, a inferência fica ancorada. Quando cada camada usa um dialeto, o modelo colapsa distinções que o negócio levou décadas para separar — "cancelamento com estorno" e "cancelamento sem estorno" viram a mesma coisa, e alguém do financeiro vai descobrir isso do pior jeito.

O glossário do contexto, aquele artefato que muitos times de DDD tratavam como burocracia, virou insumo direto de engenharia: ele define como as tools se chamam, como os campos se chamam e quais termos o prompt usa. Manter a linguagem onipresente deixou de ser higiene de documentação e passou a ser otimização de acurácia.

## Anti-corruption layer: a saída do LLM não é o seu domínio

Saídas estruturadas (structured outputs) resolvem a forma, não o significado. O modelo devolve JSON válido contra o schema — e dentro dele uma categoria que não existe, uma estimativa negativa ou uma referência a uma apólice que não cobre aquele sinistro. Tratar essa saída como comando confiável é o equivalente moderno de aceitar input de usuário sem validação.

A postura correta é tratar o LLM como tratamos qualquer sistema externo que não controlamos: tudo que vem dele atravessa uma anti-corruption layer que valida invariantes e traduz a proposta em um comando de domínio de verdade.

```csharp
// A saída do LLM nunca toca o domínio diretamente.
public sealed record TriagemSinistroProposta(
    string NumeroApolice,
    string CategoriaSugerida,
    decimal? EstimativaDano,
    string Justificativa);

public sealed class TriagemSinistroAcl
{
    private static readonly string[] CategoriasValidas =
        ["colisao", "roubo_furto", "danos_terceiros", "eventos_naturais"];

    public Result<ClassificarSinistro> Traduzir(
        TriagemSinistroProposta proposta, Apolice apolice)
    {
        if (!CategoriasValidas.Contains(proposta.CategoriaSugerida))
            return Result<ClassificarSinistro>.Falha(
                "Categoria fora do vocabulário do contexto.");

        if (proposta.EstimativaDano is < 0 or > 5_000_000m)
            return Result<ClassificarSinistro>.Falha(
                "Estimativa fora dos limites do domínio.");

        if (!apolice.Cobre(proposta.CategoriaSugerida))
            return Result<ClassificarSinistro>.Falha(
                "Apólice não cobre a categoria sugerida.");

        // Só aqui a proposta vira um comando de domínio.
        return Result<ClassificarSinistro>.Ok(new ClassificarSinistro(
            apolice.Numero,
            proposta.CategoriaSugerida,
            proposta.EstimativaDano));
    }
}
```

Note o detalhe: o tipo que vem do modelo se chama *proposta*. Esse nome não é estético — ele comunica ao time que aquilo é uma sugestão de um sistema probabilístico, não um fato. Em ambientes regulados, essa camada resolve de quebra o problema de auditoria: o que entra no domínio são comandos validados e logados, nunca texto de modelo. Quando o compliance pergunta "o que a IA pode fazer no sistema?", a resposta é a lista de comandos que a ACL emite. Curta, explícita, auditável.

## Event Storming para descobrir onde a IA entra de verdade

A pergunta "onde dá pra usar IA aqui?" rende respostas ruins, porque convida o negócio a imaginar chatbots. A pergunta certa surge de mapear o fluxo de eventos — e Event Storming continua sendo a melhor técnica que conheço para isso.

No workshop, em vez de procurar features de IA, procuro três padrões:

1. **Decisões tomadas lendo texto não estruturado** — e-mails, PDFs, laudos, históricos de atendimento. Onde um humano interpreta texto para emitir um evento, há candidato a inferência.
2. **Hotspots cujo gargalo é interpretação**, não capacidade de processamento. Fila que cresce porque alguém precisa "ler e decidir" é fila que um modelo pode triar.
3. **Eventos pivotais que dependem de julgamento repetitivo de baixo risco**, onde errar custa pouco e um humano revisa depois.

Esses pontos viram passos de inferência *dentro* de um processo que continua modelado e determinístico no restante. A IA entra como um estágio do fluxo, com entrada e saída contratadas — não como um substituto mágico do fluxo inteiro. E o bônus é considerável: o mesmo workshop produz a linguagem onipresente que vai virar o vocabulário dos prompts e dos schemas. Duas entregas pelo preço de uma tarde com o negócio.

## O take

Se você passou os últimos dez anos delimitando contextos, definindo contratos e protegendo invariantes, você não chegou atrasado à era dos agentes — chegou na frente. A diferença entre uma demo impressionante e um sistema de IA que sobrevive em produção é, na maioria dos casos que acompanho, modelagem de domínio: fronteiras claras de contexto, vocabulário consistente e uma camada anticorrupção entre a inferência e o que realmente importa. O modelo é a parte commodity; o desenho da fronteira é onde mora o valor.

Escrevo a cada duas semanas sobre engenharia de software e adoção de IA em ambientes enterprise na minha newsletter — se essa conversa te interessa, ela continua por lá.
