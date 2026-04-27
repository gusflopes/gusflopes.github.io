import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from '../assets/cfa6876664fcc921be5a7c0a58c353ea12577968.png';

interface HeaderProps {
  pathname: string;
}

export function Header({ pathname }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === '/';
  const isArticlePage2 = pathname === '/insights/article';
  const isRadarArticlePage = pathname.includes('/radar/article/');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isArticlePage2 || isRadarArticlePage) return null;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Radar', href: '/radar' },
    { label: 'Insights', href: '/insights' },
    { label: 'Trabalhe Comigo', href: '/#consulting' },
    { label: 'Sobre', href: '/#about' },
  ];

  const handleClick = (e: React.MouseEvent, href: string) => {
    setIsMenuOpen(false);
    if (href === '/' && isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <a href="/" onClick={(e) => handleClick(e, '/')}>
            <ImageWithFallback src={logo} alt="Gusflopes.dev" className="h-12 w-auto" />
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className={`font-sans text-sm font-medium uppercase tracking-wide transition-colors ${
                pathname === item.href
                  ? 'text-orange-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          <Button
            variant="outline"
            className="font-sans border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent rounded-full px-6"
          >
            Contato
          </Button>
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md p-6 border-b border-slate-800 animate-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`font-sans text-lg font-medium ${
                  pathname === item.href
                    ? 'text-orange-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            <Button className="font-sans bg-orange-500 text-white hover:bg-orange-600 w-full">
              Contato
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
