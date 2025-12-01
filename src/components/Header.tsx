import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/cfa6876664fcc921be5a7c0a58c353ea12577968.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isArticlePage2 = location.pathname === '/insights/article';
  const isRadarArticlePage = location.pathname.includes('/radar/article/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/', type: 'page' },
    { label: 'Radar', path: '/radar', type: 'page' },
    { label: 'Insights', path: '/insights', type: 'page' },
    { label: 'Trabalhe Comigo', path: 'consulting', type: 'section' },
    { label: 'Sobre', path: 'about', type: 'section' },
  ];

  const handleNavigation = (e: React.MouseEvent, item: { label: string, path: string, type: string }) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (item.type === 'page') {
      navigate(item.path);
      if (item.path === '/' && isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Section navigation
      if (!isHome) {
        navigate('/', { state: { scrollTo: item.path } });
      } else {
        const element = document.getElementById(item.path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Handle scroll from other pages
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear state to avoid scrolling on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (isArticlePage2 || isRadarArticlePage) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link to="/">
            <ImageWithFallback 
              src={logo} 
              alt="Gusflopes.dev" 
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.type === 'page' ? item.path : `/#${item.path}`}
              onClick={(e) => handleNavigation(e, item)}
              className={`font-sans text-sm font-medium uppercase tracking-wide transition-colors ${
                (location.pathname === item.path)
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md p-6 border-b border-slate-800 animate-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.type === 'page' ? item.path : `/#${item.path}`}
                className={`font-sans text-lg font-medium ${
                    (location.pathname === item.path)
                      ? 'text-orange-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                onClick={(e) => handleNavigation(e, item)}
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
