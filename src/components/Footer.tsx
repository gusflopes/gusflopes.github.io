import React from 'react';
import { Twitter, Linkedin, Github, Youtube, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoLight from '../assets/cfa6876664fcc921be5a7c0a58c353ea12577968.png?url';

interface FooterProps {
  /** Resolvido no build pelo layout Astro — evita divergência entre SSR e hidratação. */
  year?: number;
}

export function Footer({ year = 2026 }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <ImageWithFallback 
                src={logoLight} 
                alt="Gusflopes.dev" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Engenharia de agentes de IA dentro de empresa que já existe — legado, rede fechada e
              operação que precisa decidir hoje.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-slate-400 hover:text-orange-400 transition-colors">Home</a></li>
              <li><a href="/radar" className="text-slate-400 hover:text-orange-400 transition-colors">Radar</a></li>
              <li><a href="/#trajetoria" className="text-slate-400 hover:text-orange-400 transition-colors">Trajetória</a></li>
              <li><a href="/cursos" className="text-slate-400 hover:text-orange-400 transition-colors">Curso online</a></li>
              <li><a href="/workshops" className="text-slate-400 hover:text-orange-400 transition-colors">Workshop e grupo de estudo</a></li>
              <li><a href="/mentoria" className="text-slate-400 hover:text-orange-400 transition-colors">Mentoria individual</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:gustavo@gusflopes.dev" className="text-slate-400 hover:text-orange-400 transition-colors">gustavo@gusflopes.dev</a></li>
              <li className="text-slate-400">Brasil | Global</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="https://www.linkedin.com/in/gusflopes/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="https://github.com/gusflopes" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
              <a href="https://www.youtube.com/@hubdev-tech" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-slate-400 hover:text-white transition-colors"><Youtube size={20} /></a>
              <a href="https://x.com/gusflopes" target="_blank" rel="noreferrer" aria-label="X" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">
              Engenharia de agentes em ambiente corporativo, escrita para quem constrói. Ainda não
              existe lista automatizada — me escreva e eu aviso quando o primeiro texto sair.
            </p>
            <a
              href="mailto:gustavo@gusflopes.dev?subject=Newsletter%20%E2%80%94%20me%20avise%20quando%20sair"
              className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 hover:gap-3 transition-all"
            >
              Me avise quando sair <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {year} Gusflopes.dev
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="/privacy" className="hover:text-slate-300">Política de Privacidade</a>
            <a href="/terms" className="hover:text-slate-300">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
