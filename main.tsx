import { motion } from "framer-motion";
import { Bot, Brain, Building, Cloud, Code, ExternalLink, FileText, Github, Linkedin, Play, TerminalSquare, Youtube } from "lucide-react";
import React from "react";
import { createRoot } from "react-dom/client";

/**
 * gusflopes.dev – Single‑file landing page
 * -------------------------------------------------------------
 * • Replace BACKGROUND_URL with the path/URL for your wallpaper
 * • Tailwind, Framer Motion, Lucide icons (works in this canvas)
 * • "Glass" terminal with transparency & subtle noise
 * • Minimal sections you can expand: Hero, Highlights, Projects, Blog, Footer
 */

const BACKGROUND_URL = "./wallpaper.jpg"; // e.g. "/images/gus-wallpaper.jpg"

// Import insights data
import insightsData from './insights-data.json';

// Type for insights data
type InsightData = {
  type: 'article' | 'video' | 'substack';
  date: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  isExternal: boolean;
};

const typedInsightsData = insightsData as InsightData[];

const nav = [
  { label: "Insights", href: "#content" },
  { label: "Stack", href: "#about" },
  { label: "Cases", href: "#projects" },
  { label: "Conectar", href: "#contact" },
];

export default function GusFLopesLanding() {
  const [showHeader, setShowHeader] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowHeader(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const targetPosition = element.offsetTop - 80; // Offset para o header fixo
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000; // 1 segundo
      let start: number | null = null;

      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function easeInOutQuad(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 bg-transparent selection:bg-[#d4863a]/40 selection:text-white">
      {/* Background image + overlay */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(26,29,36,0.05), rgba(30,58,95,0.10)), url(${BACKGROUND_URL})`,
          backgroundAttachment: 'fixed'
        }}
      />
      {/* subtle pattern to add texture over the image */}
      <div aria-hidden className="fixed inset-0 -z-10 mix-blend-overlay opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-20 backdrop-blur-lg supports-[backdrop-filter]:bg-[#1e3a5f]/90 border-b border-[#d4863a]/40 shadow-xl transition-all duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <TerminalSquare className="h-6 w-6" />
              <span className="font-semibold tracking-wide">gusflopes.dev</span>
            </a>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {nav.map((n) => (
                <button
                  key={n.href}
                  onClick={() => smoothScrollTo(n.href.replace('#', ''))}
                  className="hover:text-[#f4a661] text-white/80 transition-colors"
                >
                  {n.label}
                </button>
              ))}
              <div className="hidden md:flex items-center gap-4">
                <a aria-label="GitHub" href="https://github.com/gusflopes" className="hover:text-[#f4a661] text-white/80"><Github className="h-5 w-5" /></a>
                <a aria-label="LinkedIn" href="https://www.linkedin.com/in/gusflopes" className="hover:text-[#f4a661] text-white/80"><Linkedin className="h-5 w-5" /></a>
                <a aria-label="YouTube" href="https://www.youtube.com/@devHub" className="hover:text-[#f4a661] text-white/80"><Youtube className="h-5 w-5" /></a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Headline + copy */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg"
              >
                Arquitetura de Software, IA & DevOps
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 text-lg sm:text-xl text-white/90 max-w-prose drop-shadow-md"
              >
                Olá, eu sou <span className="text-white">Gus F. Lopes</span>. Compartilho projetos,
                artigos e ferramentas sobre tecnologia, inteligência artificial, desenvolvimento
                e arquitetura de software — com um olhar prático para engenharia de plataformas e DevOps.
              </motion.p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Tecnologia",
                  "IA",
                  "Arquitetura de Software",
                  "DevOps",
                  "Cloud",
                  "Observability",
                ].map((t) => (
                  <span key={t} className="rounded-full border border-[#4a7ba7]/25 bg-[#2d5a87]/15 px-4 py-2 text-sm text-[#f5f1ea] backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => smoothScrollTo('content')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d4863a] hover:bg-[#c47b47] px-6 py-3 text-lg font-medium shadow-lg shadow-[#d4863a]/30"
                >
                  Ver Conteúdo Recente
                </button>
                <button
                  onClick={() => smoothScrollTo('about')}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#4a7ba7]/30 bg-[#2d5a87]/20 hover:bg-[#2d5a87]/40 px-6 py-3 text-lg font-medium"
                >
                  Conhecer Assuntos
                </button>
              </div>
            </div>

            {/* Glass Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <TerminalMock />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm font-medium">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Content (Articles & Videos) */}
      <section id="content" className="relative py-20 bg-gradient-to-br from-[#1a1d24]/60 via-[#1e3a5f]/40 to-[#1a1d24]/60">
        <div className="absolute inset-0 opacity-80" style={{
          backgroundImage: `
            radial-gradient(circle at 10px 10px, rgba(244,166,97,0.5) 2px, transparent 2px),
            radial-gradient(circle at 30px 10px, rgba(244,166,97,0.2) 1px, transparent 1px),
            radial-gradient(circle at 10px 30px, rgba(244,166,97,0.3) 1px, transparent 1px),
            radial-gradient(circle at 30px 30px, rgba(244,166,97,0.6) 2px, transparent 2px),
            radial-gradient(circle at 50px 10px, rgba(244,166,97,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50px 30px, rgba(244,166,97,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 40px"
        }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Header title="Insights Recentes" subtitle="Artigos, vídeos e insights sobre tecnologia, IA e arquitetura de software." />

          {/* Bento Grid */}
          <div className="mt-8 grid grid-cols-3 auto-rows-fr gap-6" style={{ minHeight: '600px' }}>
            {/* Card 1 - Horizontal Hero (2x2) */}
            <HeroCardHorizontal
              insight={typedInsightsData[0]}
              index={0}
            />

            {/* Card 2 - Small (1x1) */}
            <InsightCard
              insight={typedInsightsData[1]}
              size="small"
              index={1}
            />

            {/* Card 3 - Small (1x1) */}
            <InsightCard
              insight={typedInsightsData[2]}
              size="small"
              index={2}
            />

            {/* Card 4 - Small (1x1) */}
            <InsightCard
              insight={typedInsightsData[3]}
              size="small"
              index={3}
            />

            {/* Card 5 - Medium (2x1) */}
            <InsightCard
              insight={typedInsightsData[4]}
              size="medium"
              index={4}
            />
          </div>

          {/* Ver Mais Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => smoothScrollTo('projects')}
              className="inline-flex items-center gap-2 rounded-xl border border-[#4a7ba7]/40 bg-[#2d5a87]/20 hover:bg-[#2d5a87]/40 px-8 py-4 text-lg font-medium transition-all hover:scale-105"
            >
              <FileText className="h-5 w-5" />
              Ver Mais Insights
            </button>
          </div>
        </div>
      </section>

      {/* Stack Showcase */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f5f1ea] mb-4">
              Engenharia de Software Multidisciplinar
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              A intersecção única entre <span className="text-[#f4a661] font-semibold">excelência técnica</span> e
              <span className="text-[#f4a661] font-semibold"> visão de negócio</span>.
              Especialização vertical em .NET + amplitude horizontal que conecta tecnologia e valor.
            </p>
          </div>

          {/* Olympic Circles Layout */}
          <div className="relative">
            {/* Container for Olympic-style layout */}
            <div className="flex flex-col items-center gap-8 lg:gap-12 min-h-[600px] py-8">

              {/* Top Row: 2 circles (.NET and Innovation) */}
              <div className="flex justify-center gap-16 lg:gap-24">
                <StackCard stack={stacksData.find(s => s.id === 'dotnet')!} index={0} isCircle={true} />
                <StackCard stack={stacksData.find(s => s.id === 'innovation')!} index={1} isCircle={true} />
              </div>

              {/* Bottom Row: 3 circles (DDD, Business, Platform) */}
              <div className="flex justify-center gap-12 lg:gap-16">
                <StackCard stack={stacksData.find(s => s.id === 'ddd')!} index={2} isCircle={true} />
                <StackCard stack={stacksData.find(s => s.id === 'business')!} index={3} isCircle={true} />
                <StackCard stack={stacksData.find(s => s.id === 'platform')!} index={4} isCircle={true} />
              </div>
            </div>


            {/* Mobile Layout */}
            <div className="lg:hidden grid grid-cols-1 gap-6 mt-8">
              {stacksData.map((stack, index) => (
                <StackCard key={stack.id} stack={stack} index={index} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Insights & CTA */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#1a1d24]/60 via-[#1e3a5f]/40 to-[#1a1d24]/60">
        <div className="absolute inset-0 opacity-80" style={{
          backgroundImage: `
            radial-gradient(circle at 10px 10px, rgba(244,166,97,0.5) 2px, transparent 2px),
            radial-gradient(circle at 30px 10px, rgba(244,166,97,0.2) 1px, transparent 1px),
            radial-gradient(circle at 10px 30px, rgba(244,166,97,0.3) 1px, transparent 1px),
            radial-gradient(circle at 30px 30px, rgba(244,166,97,0.6) 2px, transparent 2px),
            radial-gradient(circle at 50px 10px, rgba(244,166,97,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50px 30px, rgba(244,166,97,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 40px"
        }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#1e3a5f]/40 rounded-3xl p-8 lg:p-12 border border-[#4a7ba7]/30 shadow-2xl backdrop-blur-sm"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f5f1ea] mb-6">
              A Ponte Entre Mundos
            </h2>
            <p className="text-lg text-[#f5f1ea]/90 leading-relaxed max-w-2xl mx-auto mb-6">
              Não sou apenas um programador que aprendeu negócios, nem um empresário que programa.
              Sou a <span className="text-[#f4a661] font-semibold">ponte multidisciplinar</span> entre mundos:
              advogado + contador + engenheiro de software aplicando <span className="text-[#f4a661] font-semibold">DORA metrics</span>
              e <span className="text-[#f4a661] font-semibold">Team Topologies</span> para gerar valor real.
            </p>
            <p className="text-base text-[#f5f1ea]/80 leading-relaxed max-w-xl mx-auto mb-8">
              Da metodologia <strong>Prototype First</strong> com n8n ao caminho para <strong>Microsoft MVP</strong> em .NET,
              construo sistemas que escalam negócios através de <strong>Domain-Driven Design</strong> aplicado e
              <strong>Engineering Excellence</strong> que conecta tecnologia e impacto financeiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => smoothScrollTo('contact')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#d4863a] hover:bg-[#c47b47] px-6 py-3 text-lg font-medium shadow-lg shadow-[#d4863a]/40 transition-all hover:scale-105"
              >
                Vamos Conversar
              </button>
              <button
                onClick={() => smoothScrollTo('content')}
                className="inline-flex items-center gap-2 rounded-xl border border-[#4a7ba7]/40 bg-[#2d5a87]/20 hover:bg-[#2d5a87]/40 px-6 py-3 text-lg font-medium transition-all"
              >
                Explorar Conteúdo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Header title="Projetos em destaque" subtitle="Algumas coisas que construí, brinquei ou escalei." />
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}
                title={`Projeto ${i + 1}`}
                description="Breve descrição do problema, stack e impacto. Substitua pelo seu conteúdo real."
                tags={["TypeScript", "LLM", "Kubernetes"]}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-20 bg-gradient-to-br from-[#1a1d24]/60 via-[#1e3a5f]/40 to-[#1a1d24]/60">
        <div className="absolute inset-0 opacity-80" style={{
          backgroundImage: `
            radial-gradient(circle at 10px 10px, rgba(244,166,97,0.5) 2px, transparent 2px),
            radial-gradient(circle at 30px 10px, rgba(244,166,97,0.2) 1px, transparent 1px),
            radial-gradient(circle at 10px 30px, rgba(244,166,97,0.3) 1px, transparent 1px),
            radial-gradient(circle at 30px 30px, rgba(244,166,97,0.6) 2px, transparent 2px),
            radial-gradient(circle at 50px 10px, rgba(244,166,97,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50px 30px, rgba(244,166,97,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 40px"
        }} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Header title="Vamos conversar" subtitle="Aberto a colaborações, consultoria e bons papos sobre tecnologia." />
          <div className="mt-8 flex items-center justify-center gap-6">
            <a aria-label="GitHub" href="https://github.com/gusflopes" className="rounded-xl border border-[#4a7ba7]/30 bg-[#2d5a87]/20 hover:bg-[#2d5a87]/40 px-6 py-3 text-lg inline-flex items-center gap-2"><Github className="h-6 w-6" />GitHub</a>
            <a aria-label="LinkedIn" href="https://www.linkedin.com/in/gusflopes" className="rounded-xl border border-[#4a7ba7]/30 bg-[#2d5a87]/20 hover:bg-[#2d5a87]/40 px-6 py-3 text-lg inline-flex items-center gap-2"><Linkedin className="h-6 w-6" />LinkedIn</a>
            <a aria-label="YouTube" href="https://www.youtube.com/@devHub" className="rounded-xl border border-[#4a7ba7]/30 bg-[#2d5a87]/20 hover:bg-[#2d5a87]/40 px-6 py-3 text-lg inline-flex items-center gap-2"><Youtube className="h-6 w-6" />devHub</a>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} gusflopes.dev · Feito com arte + engenharia
      </footer>
    </div>
  );
}

// Render the component
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<GusFLopesLanding />);
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

interface StackData {
  id: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  expertiseLevel: 'Expert' | 'Advanced' | 'Intermediate';
  color: string;
  bgColor: string;
  position: string;
}

const stacksData: StackData[] = [
  {
    id: 'business',
    icon: <Building className="h-8 w-8" />,
    title: 'Business & Technology Bridge',
    tagline: 'Visão 360° de advogado + contador + programador aplicada em DORA metrics e Team Topologies',
    description: 'O hub central que une mundos: background multidisciplinar (advogado + contador + programador) aplicando DORA metrics, Team Topologies e estratégia de negócio. Engineering Excellence como ferramenta para gerar valor real.',
    technologies: ['Business Analysis', 'DORA Metrics', 'Team Topologies', 'Financial Engineering', 'Technical Leadership'],
    expertiseLevel: 'Expert',
    color: '#f5f1ea',
    bgColor: 'from-orange-500/20 to-yellow-500/20',
    position: 'business'
  },
  {
    id: 'dotnet',
    icon: <Code className="h-8 w-8" />,
    title: '.NET & Software Architecture',
    tagline: 'Arquitetura que escala negócios, não apenas requisições, permitindo inovação rápida e segura',
    description: 'Especialização vertical profunda: C#, ASP.NET Core, Clean Architecture, Modular Monoliths. Caminho para Microsoft MVP através de contribuições técnicas reais e impacto na comunidade.',
    technologies: ['C#', 'ASP.NET Core', 'Clean Architecture', 'Entity Framework', 'Performance'],
    expertiseLevel: 'Expert',
    color: '#f5f1ea',
    bgColor: 'from-blue-500/20 to-blue-600/20',
    position: 'dotnet'
  },
  {
    id: 'ddd',
    icon: <Brain className="h-8 w-8" />,
    title: 'Domain-Driven Design',
    tagline: 'Código que reflete perfeitamente o negócio através de Event Storming e bounded contexts reais',
    description: 'DDD prático em contextos empresariais reais. Event Storming, bounded contexts que fazem sentido, e patterns que conectam modelo de domínio com implementação .NET elegante.',
    technologies: ['Strategic DDD', 'Tactical DDD', 'Event Storming', 'Bounded Contexts', 'Domain Events'],
    expertiseLevel: 'Expert',
    color: '#f5f1ea',
    bgColor: 'from-purple-500/20 to-indigo-500/20',
    position: 'ddd'
  },
  {
    id: 'platform',
    icon: <Cloud className="h-8 w-8" />,
    title: 'Platform & DevOps Engineering',
    tagline: 'Developer experience que aumenta DORA metrics através de plataformas que devs amam usar',
    description: 'AWS-first com Platform as Product mindset. Team Topologies platform patterns, DORA metrics implementation, IaC com Terraform. Infraestrutura que gera produtividade e business value.',
    technologies: ['AWS', 'Terraform', 'Kubernetes', 'OpenTelemetry', 'Platform Patterns'],
    expertiseLevel: 'Advanced',
    color: '#f5f1ea',
    bgColor: 'from-orange-600/20 to-red-500/20',
    position: 'platform'
  },
  {
    id: 'innovation',
    icon: <Bot className="h-8 w-8" />,
    title: 'Inovação & IA',
    tagline: 'Metodologia Prototype First: validação de protótipos funcionais com IA & low-code, permitindo investimento seguro em tecnologia',
    description: 'Metodologia "Prototype First": validação rápida com n8n + IA, MVP focado em resolver problema de negócio real. Tecnologia escalamos depois que entendemos o valor. Filosofia de hackathons aplicada.',
    technologies: ['Prototype First', 'n8n', 'LLMs & RAG', 'MVP Validation', 'Lean Startup'],
    expertiseLevel: 'Advanced',
    color: '#f5f1ea',
    bgColor: 'from-cyan-500/20 to-blue-400/20',
    position: 'innovation'
  }
];

function StackCard({ stack, index, isCircle = false }: { stack: StackData; index: number; isCircle?: boolean }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const getExpertiseBadgeColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'Advanced': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`stack-card-${stack.position} relative group`}
    >
      <motion.div
        whileHover={isCircle ? {} : {
          scale: 1.03,
          rotateY: 5,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
        }}
        transition={{ duration: 0.3 }}
        className={`
          ${isCircle ? 'rounded-full w-80 h-80 overflow-hidden' : 'rounded-3xl h-full'} border border-[#4a7ba7]/50 backdrop-blur-md shadow-2xl shadow-black/30
          bg-gradient-to-br ${stack.bgColor} ${isCircle ? 'p-6' : 'p-6'} cursor-pointer
          hover:border-[${stack.color}]/70 transition-all duration-300
          ${isCircle ? 'flex flex-col items-center justify-center text-center' : ''}
        `}
        style={{
          background: isCircle
            ? `linear-gradient(135deg, ${stack.color}20, ${stack.color}35)`
            : `linear-gradient(135deg, ${stack.color}08, ${stack.color}15)`
        }}
      >
        {isCircle ? (
          /* Circular Layout */
          <>
            {/* Icon */}
            <div
              className="p-4 rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: `${stack.color}50`,
                color: stack.color
              }}
            >
              <div className="h-16 w-16 flex items-center justify-center">
                {stack.icon}
              </div>
            </div>

            {/* Content that changes on hover */}
            <div className="text-center transition-all duration-300 ease-in-out max-w-full">
              {!isHovered ? (
                /* Default Content */
                <>
                  {/* Title */}
                  <h3 className="font-bold text-lg text-white mb-3 leading-tight">
                    {stack.title}
                  </h3>

                  {/* Enhanced Tagline */}
                  <p className="text-sm text-white/90 font-medium leading-relaxed px-2">
                    {stack.tagline}
                  </p>
                </>
              ) : (
                /* Hover Content - All Technologies */
                <div className="flex flex-wrap justify-center gap-1 px-4 max-w-full">
                  {stack.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-full text-xs font-medium border border-white/30 bg-white/20 text-white backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Rectangular Layout */
          <>
            {/* Header com ícone e título */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${stack.color}20`,
                    color: stack.color
                  }}
                >
                  {stack.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#f5f1ea] group-hover:text-[#f4a661] transition-colors">
                    {stack.title}
                  </h3>
                  <p className="text-sm text-white/70 mt-1">{stack.tagline}</p>
                </div>
              </div>

              {/* Expertise Badge */}
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium border
                ${getExpertiseBadgeColor(stack.expertiseLevel)}
              `}>
                {stack.expertiseLevel}
              </span>
            </div>

            {/* Descrição */}
            <p className="text-white/80 text-base leading-relaxed mb-6">
              {stack.description}
            </p>

            {/* Tecnologias */}
            <div className="flex flex-wrap gap-2">
              {stack.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#4a7ba7]/25 bg-[#2d5a87]/15 text-[#f5f1ea]/90 hover:bg-[#2d5a87]/25 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Connection indicator para Business Hub */}
        {stack.id === 'business' && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute -inset-1 ${isCircle ? 'rounded-full' : 'rounded-3xl'}`}
            style={{
              background: `linear-gradient(45deg, ${stack.color}30, transparent, ${stack.color}30)`,
              filter: 'blur(2px)',
              zIndex: -1
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function Card({ title, description, tags, href }: { title: string; description: string; tags: string[]; href: string }) {
  return (
    <a href={href} className="group rounded-2xl border border-[#4a7ba7]/20 bg-[#1e3a5f]/10 p-5 backdrop-blur-sm shadow-xl shadow-black/20 hover:bg-[#2d5a87]/20 transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-xl tracking-tight group-hover:text-[#f4a661]">{title}</h3>
      </div>
      <p className="mt-3 text-base text-white/80 leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-[#4a7ba7]/25 bg-[#2d5a87]/15 px-3 py-1 text-sm text-[#f5f1ea]/90">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

interface InsightCardProps {
  insight: {
    type: 'article' | 'video' | 'substack';
    date: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    link: string;
    isExternal: boolean;
  };
  size: 'large' | 'medium' | 'small';
  index: number;
}

function InsightCard({ insight, size, index }: InsightCardProps) {
  const { type, date, title, description, tags, imageUrl, link, isExternal } = insight;

  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'substack':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'video':
        return 'Vídeo';
      case 'substack':
        return 'Substack';
      default:
        return 'Artigo';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'medium':
        return 'col-span-2 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const getImageHeight = () => {
    switch (size) {
      case 'large':
        return 'h-[450px]'; // Hero image dominante para o card 2x2 (~75% da altura de 600px)
      case 'medium':
        return 'h-40'; // Médio para o card 2x1
      default:
        return 'h-40'; // Altura fixa adequada para os cards 1x1
    }
  };

  const getContentPadding = () => {
    switch (size) {
      case 'large':
        return 'p-6';
      case 'medium':
        return 'p-4';
      default:
        return 'p-4';
    }
  };

  const getMinHeight = () => {
    switch (size) {
      case 'large':
        return 'min-h-[600px]'; // Card grande 2x2
      case 'medium':
        return 'min-h-[280px]'; // Card médio 2x1
      default:
        return 'min-h-[320px]'; // Card pequeno 1x1 - altura suficiente para imagem + conteúdo
    }
  };

  const CardComponent = isExternal ? 'a' : 'button';
  const cardProps = isExternal
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick: () => window.location.href = link };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`${getSizeClasses()}`}
    >
      <CardComponent
        {...cardProps}
        className={`group relative rounded-2xl border border-[#4a7ba7]/30 bg-[#1e3a5f]/20 backdrop-blur-md shadow-2xl shadow-black/30 hover:bg-[#2d5a87]/30 transition-all duration-300 overflow-hidden h-full flex flex-col text-left w-full ${getMinHeight()}`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${getImageHeight()}`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e3a5f]/90 backdrop-blur-sm border border-[#4a7ba7]/30">
            {getIcon()}
            <span className="text-xs font-medium text-[#f4a661]">{getTypeLabel()}</span>
          </div>

          {/* External Link Icon */}
          {isExternal && (
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-[#1e3a5f]/90 backdrop-blur-sm border border-[#4a7ba7]/30">
              <ExternalLink className="h-3 w-3 text-[#f4a661]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 flex flex-col ${getContentPadding()}`}>
          {/* Date */}
          <span className="text-xs text-[#f5f1ea]/60 font-medium mb-2">
            {new Date(date).toLocaleDateString('pt-BR')}
          </span>

          {/* Title */}
          <h3 className={`font-semibold tracking-tight group-hover:text-[#f4a661] mb-2 ${
            size === 'large' ? 'text-xl' : 'text-lg'
          }`}>
            {title}
          </h3>

          {/* Description */}
          <p
            className={`text-white/80 leading-relaxed mb-4 flex-1 ${
              size === 'large' ? 'text-base' : 'text-sm'
            }`}
            style={size !== 'large' ? {
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            } : {}}
          >
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {tags.slice(0, size === 'large' ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#4a7ba7]/25 bg-[#2d5a87]/15 px-2.5 py-1 text-xs text-[#f5f1ea]/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardComponent>
    </motion.div>
  );
}


// Componente alternativo para teste - Layout Horizontal
function HeroCardHorizontal({ insight, index }: { insight: InsightData; index: number }) {
  const { type, date, title, description, tags, imageUrl, link, isExternal } = insight;

  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'substack':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'video':
        return 'Vídeo';
      case 'substack':
        return 'Substack';
      default:
        return 'Artigo';
    }
  };

  const CardComponent = isExternal ? 'a' : 'button';
  const cardProps = isExternal
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick: () => window.location.href = link };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="col-span-2 row-span-2"
    >
      <CardComponent
        {...cardProps}
        className="group relative rounded-2xl border border-[#4a7ba7]/30 bg-[#1e3a5f]/20 backdrop-blur-md shadow-2xl shadow-black/30 hover:bg-[#2d5a87]/30 transition-all duration-300 overflow-hidden h-full flex text-left w-full min-h-[600px]"
      >
        {/* Image - Left Side (50%) */}
        <div className="relative w-1/2 h-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e3a5f]/90 backdrop-blur-sm border border-[#4a7ba7]/30">
            {getIcon()}
            <span className="text-sm font-medium text-[#f4a661]">{getTypeLabel()}</span>
          </div>

          {/* External Link Icon */}
          {isExternal && (
            <div className="absolute top-4 right-4 p-2 rounded-full bg-[#1e3a5f]/90 backdrop-blur-sm border border-[#4a7ba7]/30">
              <ExternalLink className="h-4 w-4 text-[#f4a661]" />
            </div>
          )}
        </div>

        {/* Content - Right Side (50%) */}
        <div className="w-1/2 h-full flex flex-col justify-center p-8">
          {/* Date */}
          <span className="text-sm text-[#f5f1ea]/60 font-medium mb-3">
            {new Date(date).toLocaleDateString('pt-BR')}
          </span>

          {/* Title */}
          <h3 className="font-bold text-2xl tracking-tight group-hover:text-[#f4a661] mb-4 leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/80 leading-relaxed mb-6 text-lg">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#4a7ba7]/25 bg-[#2d5a87]/15 px-3 py-1.5 text-sm text-[#f5f1ea]/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardComponent>
    </motion.div>
  );
}

function TerminalMock() {
  // A minimal fake terminal with typewriter effect
  const [text, setText] = React.useState("");
  const script = `echo \"Bem-vindo ao meu portfólio\"\ncat stack.txt\n - TypeScript, Go, Python\n - Kubernetes, Terraform\n - LLMs, RAG, Observability\nopen https://gusflopes.dev/projetos`;
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setText(script.slice(0, i++));
      if (i > script.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-3 h-10 bg-[#1e3a5f]/80 backdrop-blur supports-[backdrop-filter]:bg-[#1e3a5f]/50 border-b border-[#4a7ba7]/30">
        <span className="h-3 w-3 rounded-full bg-[#d4863a]" />
        <span className="h-3 w-3 rounded-full bg-[#f4a661]" />
        <span className="h-3 w-3 rounded-full bg-[#4a7ba7]" />
        <span className="ml-3 text-xs text-[#f5f1ea]/70">gusflopes@node: ~</span>
      </div>
      {/* Terminal body */}
      <div className="relative p-4 sm:p-6 md:p-8 bg-[#1a1d24]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1e3a5f]/40">
        {/* subtle grain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(244,166,97,0.1) 1px, transparent 1px)`,
            backgroundSize: "16px 16px"
          }}
        />
        <pre className="relative z-10 font-mono text-[13px] leading-6 text-[#f4a661] whitespace-pre-wrap">
          <span className="text-[#4a7ba7] font-semibold">gusflopes_dev</span>
          <span className="text-[#f5f1ea]/80"> $ </span>
          <span className="text-[#f5f1ea]">{text}</span>
          <span className="animate-pulse">▊</span>
        </pre>
      </div>
    </div>
  );
}
