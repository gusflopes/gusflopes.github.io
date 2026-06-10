import React from 'react';
import { Linkedin, Github } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewsletterForm } from './NewsletterForm';
import { site, socials, newsletter } from '../config/site';
import logoLight from '../assets/cfa6876664fcc921be5a7c0a58c353ea12577968.png?url';

export function Footer() {
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
              IA de piloto a produção em ambientes enterprise — sobre fundações de .NET, sistemas distribuídos e governança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-slate-400 hover:text-orange-400 transition-colors">Home</a></li>
              <li><a href="/radar" className="text-slate-400 hover:text-orange-400 transition-colors">Radar</a></li>
              <li><a href="/insights" className="text-slate-400 hover:text-orange-400 transition-colors">Insights</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={`mailto:${site.email}`} className="text-slate-400 hover:text-orange-400 transition-colors">{site.email}</a></li>
              <li className="text-slate-400">Brasil | Global</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Gustavo Lopes"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Gustavo Lopes"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">{newsletter.name}</h4>
            <p className="text-slate-400 text-sm mb-4">{newsletter.pitch}</p>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Gusflopes.dev. Todos os direitos reservados.
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
