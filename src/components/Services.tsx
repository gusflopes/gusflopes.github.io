import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { MonitorPlay, Users, ArrowRight, BookOpen } from 'lucide-react';
import { site } from '../config/site';

export function Services() {
  const services = [
    {
      icon: <Users className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Consultoria Estratégica",
      description: "Diagnóstico de arquitetura, fluxo de entrega e desenho organizacional para transformar desafios de negócio em decisões técnicas claras e executáveis.",
      action: "AGENDAR DIAGNÓSTICO",
      link: `mailto:${site.email}?subject=${encodeURIComponent('Consultoria Estratégica — Agendar diagnóstico')}`
    },
    {
      icon: <MonitorPlay className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Mentoria & Formação",
      description: "Desenvolvimento de engenheiros e lideranças técnicas por meio de discussões práticas sobre arquitetura, DDD, plataformas e tomada de decisão.",
      action: "VER PROGRAMAS",
      link: `mailto:${site.email}?subject=${encodeURIComponent('Mentoria & Cursos')}`
    },
    /* 
    {
      icon: <Mic className="w-10 h-10 text-orange-400 mb-4" />,
      title: "Speaking & Palestras",
      description: "Compartilhando visão de futuro em conferências e eventos corporativos. Keynotes sobre Inovação, Cultura DevOps e o impacto real da IA na Engenharia de Software.",
      action: "CONVIDAR PARA EVENTO"
    },
    */
    /*
    {
      icon: <Users className="w-10 h-10 text-orange-400 mb-4" />, // Usar um ícone diferente se quiser, ex: Presentation ou Easel
      title: "Workshops In-Company",
      description: "Treinamentos práticos e imersivos para elevar a régua técnica do seu time. Sessões focadas em DDD, Event Storming e modernização de legado.",
      action: "VER TEMAS"
    },
    */
    {
      icon: <BookOpen className="w-10 h-10 text-orange-400 mb-4" />, // Import BookOpen
      title: "Conteúdo & Insights",
      description: "Artigos e análises sobre arquitetura, engenharia de software e IA aplicada para quem busca profundidade, contexto e ideias úteis além do hype.",
      action: "ACESSAR O RADAR",
      link: "/radar"
    }
  ];

  return (
    <section id="consulting" className="bg-slate-950 py-20 px-6 relative">
      <div id="courses" className="absolute top-0"></div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Como posso ajudar</h2>
          <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <a href={service.link || "#"}>
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
