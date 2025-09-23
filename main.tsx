import { motion } from "framer-motion";
import { Boxes, Cpu, Github, Linkedin, Settings, TerminalSquare, Youtube } from "lucide-react";
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
          <Header title="Conteúdo Recente" subtitle="Artigos, vídeos e insights sobre tecnologia, IA e arquitetura de software." />
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ContentCard key={i}
                title={i === 0 ? "Como Implementar RAG em Produção" : i === 1 ? "Palestra: Arquitetura de Microsserviços" : "DevOps e Observabilidade"}
                description={i === 0 ? "Guia prático para implementar Retrieval-Augmented Generation em ambientes de produção." : i === 1 ? "Vídeo da minha apresentação sobre padrões e boas práticas em microsserviços." : "Estratégias para implementar observabilidade efetiva em sistemas distribuídos."}
                type={i === 1 ? "video" : "article"}
                date="2025-01-15"
                tags={i === 0 ? ["IA", "RAG", "Python"] : i === 1 ? ["Arquitetura", "Microsserviços", "YouTube"] : ["DevOps", "Observabilidade", "Monitoring"]}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Feature
              icon={<Cpu className="h-8 w-8" />}
              title="IA aplicada"
              desc="Modelagem, avaliação e integração de LLMs, geração aumentada por recuperação (RAG) e agentes em produção."
              index={0} />
            <Feature
              icon={<Boxes className="h-8 w-8" />}
              title="Arquitetura & Plataforma"
              desc="Sistemas distribuídos, microsserviços, mensageria, observabilidade e boas práticas de engenharia."
              index={1} />
            <Feature
              icon={<Settings className="h-8 w-8" />}
              title="DevOps & Cloud"
              desc="Automação, CI/CD, infraestrutura como código e cultura de confiabilidade."
              index={2} />
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
              Construindo o Futuro da Tecnologia
            </h2>
            <p className="text-lg text-[#f5f1ea]/90 leading-relaxed max-w-2xl mx-auto mb-6">
              Acredito que a verdadeira inovação acontece na <span className="text-[#f4a661] font-semibold">intersecção entre arte e engenharia</span>.
              Cada sistema que construo, cada arquitetura que projeto, e cada solução que desenvolvo reflete essa filosofia:
              tecnologia que não apenas funciona, mas inspira.
            </p>
            <p className="text-base text-[#f5f1ea]/80 leading-relaxed max-w-xl mx-auto mb-8">
              Através de conteúdo prático e insights reais, compartilho o que aprendo navegando entre IA,
              arquitetura de software e DevOps — sempre com foco em criar valor e impacto duradouro.
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

function Feature({ icon, title, desc, index }: { icon: React.ReactNode; title: string; desc: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
      }}
      className="rounded-2xl border border-[#4a7ba7]/20 bg-[#1e3a5f]/10 p-8 lg:p-10 backdrop-blur-sm shadow-xl shadow-black/20"
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-[#d4863a]/20 flex items-center justify-center text-[#f4a661]">{icon}</div>
        <h3 className="font-semibold text-lg lg:text-xl text-[#f4a661]">{title}</h3>
      </div>
      <p className="mt-4 text-white/90 text-base lg:text-lg leading-relaxed">{desc}</p>
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

function ContentCard({ title, description, type, date, tags, href }: {
  title: string;
  description: string;
  type: 'article' | 'video';
  date: string;
  tags: string[];
  href: string
}) {
  return (
    <a href={href} className="group rounded-2xl border border-[#4a7ba7]/30 bg-[#1e3a5f]/20 p-6 backdrop-blur-md shadow-2xl shadow-black/30 hover:bg-[#2d5a87]/30 transition">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          {type === 'video' ? (
            <svg className="h-5 w-5 text-[#f4a661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-[#f4a661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="text-xs text-[#f5f1ea]/70 font-medium">
            {type === 'video' ? 'Vídeo' : 'Artigo'} • {new Date(date).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
      <h3 className="font-semibold text-lg tracking-tight group-hover:text-[#f4a661] mb-2">{title}</h3>
      <p className="text-base text-white/80 leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-[#4a7ba7]/25 bg-[#2d5a87]/15 px-3 py-1 text-sm text-[#f5f1ea]/90">
            {t}
          </span>
        ))}
      </div>
    </a>
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
