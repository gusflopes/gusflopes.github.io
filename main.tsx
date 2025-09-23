import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, TerminalSquare, Cpu, Boxes, Settings } from "lucide-react";

/**
 * gusflopes.dev – Single‑file landing page
 * -------------------------------------------------------------
 * • Replace BACKGROUND_URL with the path/URL for your wallpaper
 * • Tailwind, Framer Motion, Lucide icons (works in this canvas)
 * • "Glass" terminal with transparency & subtle noise
 * • Minimal sections you can expand: Hero, Highlights, Projects, Blog, Footer
 */

const BACKGROUND_URL = "/wallpaper.jpg"; // e.g. "/images/gus-wallpaper.jpg"

const nav = [
  { label: "Sobre", href: "#about" },
  { label: "Projetos", href: "#projects" },
  { label: "Artigos", href: "#blog" },
  { label: "Contato", href: "#contact" },
];

export default function GusFLopesLanding() {
  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 selection:bg-orange-400/40 selection:text-white">
      {/* Background image + overlay */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(2,6,23,0.70), rgba(2,6,23,0.70)), url(${BACKGROUND_URL})`,
        }}
      />
      {/* subtle pattern to add texture over the image */}
      <div aria-hidden className="fixed inset-0 -z-10 mix-blend-overlay opacity-40" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <TerminalSquare className="h-6 w-6" />
              <span className="font-semibold tracking-wide">gusflopes.dev</span>
            </a>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {nav.map((n) => (
                <a key={n.href} href={n.href} className="hover:text-white/90 text-white/70 transition-colors">
                  {n.label}
                </a>
              ))}
              <div className="hidden md:flex items-center gap-4">
                <a aria-label="GitHub" href="https://github.com/gusflopes" className="hover:text-white/90 text-white/70"><Github className="h-5 w-5" /></a>
                <a aria-label="LinkedIn" href="https://www.linkedin.com/in/gusflopes" className="hover:text-white/90 text-white/70"><Linkedin className="h-5 w-5" /></a>
                <a aria-label="E-mail" href="#contact" className="hover:text-white/90 text-white/70"><Mail className="h-5 w-5" /></a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Headline + copy */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              >
                Arquitetura de Software, IA & DevOps
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-4 text-base sm:text-lg text-white/80 max-w-prose"
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
                  <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#projects" className="inline-flex items-center gap-2 rounded-xl bg-orange-500/90 hover:bg-orange-500 px-4 py-2 font-medium shadow-lg shadow-orange-500/20">
                  Ver Projetos
                </a>
                <a href="#blog" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 font-medium">
                  Ler Artigos
                </a>
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
      </section>

      {/* Highlights */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Feature
              icon={<Cpu className="h-6 w-6" />}
              title="IA aplicada"
              desc="Modelagem, avaliação e integração de LLMs, geração aumentada por recuperação (RAG) e agentes em produção." />
            <Feature
              icon={<Boxes className="h-6 w-6" />}
              title="Arquitetura & Plataforma"
              desc="Sistemas distribuídos, microsserviços, mensageria, observabilidade e boas práticas de engenharia." />
            <Feature
              icon={<Settings className="h-6 w-6" />}
              title="DevOps & Cloud"
              desc="Automação, CI/CD, infraestrutura como código e cultura de confiabilidade." />
          </div>
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

      {/* Blog */}
      <section id="blog" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Header title="Últimos artigos" subtitle="Ideias, estudos e lições aprendidas." />
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}
                title={`Post ${i + 1}`}
                description="Resumo do artigo para atrair o clique. Ligue aos temas de IA, arquitetura e DevOps."
                tags={["Arquitetura", "DevEx", "Cloud"]}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Header title="Vamos conversar" subtitle="Aberto a colaborações, consultoria e bons papos sobre tecnologia." />
          <div className="mt-6 flex items-center justify-center gap-4">
            <a aria-label="GitHub" href="https://github.com/gusflopes" className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 inline-flex items-center gap-2"><Github className="h-5 w-5" />GitHub</a>
            <a aria-label="LinkedIn" href="https://www.linkedin.com/in/gusflopes" className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 inline-flex items-center gap-2"><Linkedin className="h-5 w-5" />LinkedIn</a>
            <a aria-label="E-mail" href="mailto:hello@gusflopes.dev" className="rounded-xl bg-orange-500/90 hover:bg-orange-500 px-4 py-2 inline-flex items-center gap-2 font-medium shadow-lg shadow-orange-500/20"><Mail className="h-5 w-5" />E-mail</a>
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
const root = createRoot(document.getElementById('root'));
root.render(<GusFLopesLanding />);

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-white/70 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm shadow-xl shadow-black/10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-white/70 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Card({ title, description, tags, href }: { title: string; description: string; tags: string[]; href: string }) {
  return (
    <a href={href} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm shadow-xl shadow-black/10 hover:bg-white/[0.06] transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-lg tracking-tight group-hover:text-white">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/80">
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
      <div className="flex items-center gap-2 px-3 h-10 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 border-b border-white/10">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 text-xs text-white/60">gusflopes@node: ~</span>
      </div>
      {/* Terminal body */}
      <div className="relative p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/40">
        {/* subtle grain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "16px 16px"
          }}
        />
        <pre className="relative z-10 font-mono text-[13px] leading-6 text-green-200/90 whitespace-pre-wrap">
          <span className="text-emerald-400 font-semibold">gusflopes_dev</span>
          <span className="text-white/70"> $ </span>
          <span className="text-white/90">{text}</span>
          <span className="animate-pulse">▊</span>
        </pre>
      </div>
    </div>
  );
}
