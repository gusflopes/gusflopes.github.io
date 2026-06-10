import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ClipboardCheck, Bot, RefreshCw, GraduationCap, ArrowRight } from 'lucide-react';
import { site } from '../config/site';

const contactLink = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export function Services() {
  const services = [
    {
      icon: <ClipboardCheck className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Assessment de Adoção de IA",
      description: "Diagnóstico técnico de prontidão: dados, segurança, casos de uso e maturidade do time. Você sai com um roadmap priorizado por risco e retorno — e com critérios claros de go/no-go por iniciativa.",
      action: "AGENDAR ASSESSMENT",
      link: contactLink("Assessment de Adoção de IA")
    },
    {
      icon: <Bot className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Copilotos e Agentes em Produção",
      description: "Arquitetura e implantação de copilotos internos e agentes sobre dados proprietários: RAG com permissionamento, MCP sobre sistemas existentes, avaliação contínua e observabilidade desde o primeiro deploy.",
      action: "DISCUTIR SEU CASO",
      link: contactLink("Copilotos e Agentes em Produção")
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Modernização .NET Assistida por IA",
      description: "Migração de sistemas legados para .NET 10 usando engenharia assistida por IA com revisão sênior: mais velocidade na conversão, sem abrir mão de testes, contratos e qualidade auditável.",
      action: "PLANEJAR MIGRAÇÃO",
      link: contactLink("Modernização .NET Assistida por IA")
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Capacitação de Times de Engenharia",
      description: "Treinamento prático em engenharia assistida por IA para times enterprise: Copilot e Claude no fluxo real de trabalho, revisão de código gerado, evals e padrões de uso seguro — medido por métricas de entrega contra baseline, não por percepção.",
      action: "TREINAR MEU TIME",
      link: contactLink("Capacitação de Times de Engenharia")
    }
  ];

  return (
    <section id="consulting" className="bg-slate-950 py-20 px-6 relative">
      <div id="courses" className="absolute top-0"></div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Trabalhe Comigo</h2>
          <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="h-full flex flex-col bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/60 shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)] hover:border-orange-400 hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.4)] hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader>
                <div className="p-3 bg-slate-950/50 w-fit rounded-xl border border-orange-500/30 group-hover:border-orange-500/60 transition-colors">
                  {service.icon}
                </div>
                <CardTitle className="font-serif text-2xl text-white mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-sans text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild variant="link" className="text-orange-400 hover:text-orange-300 p-0 flex items-center gap-2 group-hover:gap-3 transition-all font-bold uppercase tracking-wide text-sm">
                  <a href={service.link}>
                    {service.action} <ArrowRight size={16} />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
