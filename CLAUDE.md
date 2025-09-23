# Instruções para o Projeto gusflopes.dev

## MCP Server Playwright
Este projeto usa um MCP Server Playwright configurado via Docker:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/playwright"
      ]
    }
  }
}
```

## Como usar o Playwright
- **SEMPRE** usar o Task tool com `subagent_type: "general-purpose"`
- O agente tem acesso às ferramentas do MCP Playwright via Docker
- URL do site: http://localhost:3001
- Porta mudou de 3000 para 3001 devido conflito com Grafana

## Estrutura atual esperada do site
1. Hero Section (viewport completo com wallpaper)
2. Conteúdo Recente (artigos e vídeos)
3. Assuntos (IA, Arquitetura, DevOps)
4. Insights & CTA (fundo escuro)
5. Projetos
6. Footer/Contato

## Arquivos principais
- `main.tsx` - Componente principal
- `wallpaper.jpg` - Imagem de fundo
- `vite.config.ts` - Configuração do Vite (porta 3001)

## Comandos úteis
- `pnpm dev` - Servidor de desenvolvimento
- `pnpm build` - Build de produção