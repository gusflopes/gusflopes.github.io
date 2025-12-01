import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Calendar, Clock, ArrowRight, PlayCircle, ExternalLink, Youtube, FileText } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Link } from 'react-router-dom';

export function RadarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ["Todos", "Arquitetura", ".NET", "DevOps", "Carreira", "IA"];

  // Estrutura de dados enriquecida para suportar vídeos e links externos
  const items = [
    {
      id: 1,
      title: "Desacoplando Monólitos com DDD: Guia Prático",
      excerpt: "Como identificar Bounded Contexts e migrar sistemas legados sem parar a operação. Um guia passo a passo para arquitetos.",
      date: "25 Out, 2023",
      duration: "8 min",
      category: "Arquitetura",
      type: "article", // 'article' | 'video'
      isExternal: false,
      link: "/radar/article/1",
      source: "Local",
      image: "https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGFyY2hpdGVjdHVyZSUyMGRpYWdyYW0lMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjBjb2RlJTIwbW9uaXRvcnxlbnwxfHx8fDE3NjQ1NDUxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 2,
      title: "Keynote: O Futuro da Engenharia de Plataforma",
      excerpt: "Assista à apresentação completa sobre como LLMs estão mudando a forma como operamos infraestrutura e Kubernetes.",
      date: "12 Nov, 2023",
      duration: "45:20",
      category: "DevOps",
      type: "video",
      isExternal: true,
      link: "https://youtube.com",
      source: "YouTube",
      image: "https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF0Zm9ybSUyMGVuZ2luZWVyaW5nJTIwc2VydmVyJTIwZGF0YSUyMGNlbnRlcnxlbnwxfHx8fDE3NjQ1NDUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 3,
      title: "Anúncio Oficial: .NET 9 Preview 1",
      excerpt: "Microsoft libera primeira versão do novo framework com foco total em Cloud Native e otimizações de AOT.",
      date: "05 Dez, 2023",
      duration: "3 min",
      category: ".NET",
      type: "article",
      isExternal: true,
      link: "https://devblogs.microsoft.com",
      source: "Microsoft Blog",
      image: "https://images.unsplash.com/photo-1607799275518-d6c36367d919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBzY3JlZW4lMjBuZXR8ZW58MXx8fHwxNzY0NTQ1MjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 4,
      title: "Tech Leadership: Mentoria vs Gestão",
      excerpt: "Painel de discussão sobre os desafios de liderar times técnicos em ambientes de alta pressão.",
      date: "15 Jan, 2024",
      duration: "15:00",
      category: "Carreira",
      type: "video",
      isExternal: true,
      link: "https://youtube.com",
      source: "Podcast",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWV0aW5nJTIwdGVhbSUyMGxlYWRlcnNoaXB8ZW58MXx8fHwxNzY0NTQ1MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 5,
      title: "Otimizando Performance com Span<T>",
      excerpt: "Mergulhando fundo na alocação de memória no .NET para criar aplicações de alta performance e baixa latência.",
      date: "28 Jan, 2024",
      duration: "12 min",
      category: ".NET",
      type: "article",
      isExternal: false,
      link: "/radar/article/5",
      source: "Local",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBzY3JlZW4lMjBuZXR8ZW58MXx8fHwxNzY0NTQ1MjIzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 6,
      title: "RAG: Implementação Prática com Azure",
      excerpt: "Tutorial passo a passo de como configurar seu primeiro sistema RAG usando serviços gerenciados.",
      date: "10 Fev, 2024",
      duration: "22:15",
      category: "IA",
      type: "video",
      isExternal: false,
      link: "/radar/video/6",
      source: "Local",
      image: "https://images.unsplash.com/photo-1677442136019-21f48ed6d916?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwY2hpcCUyMG5ldXJvbnxlbnwxfHx8fDE3NjQ1NDUyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-16 text-center relative">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Radar Técnico
          </h1>
          <p className="font-sans text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Curadoria de artigos, vídeos e recursos sobre .NET, Arquitetura e IA.
          </p>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
            <Input 
              placeholder="Buscar no radar..." 
              className="pl-10 bg-slate-950 border-slate-700 focus:ring-orange-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  ${selectedCategory === cat 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                    : 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:border-orange-400'
                  } rounded-full px-4 py-1 h-8 text-xs uppercase tracking-wider font-bold transition-all
                `}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-slate-900/80 backdrop-blur-md border-2 border-slate-800 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 group overflow-hidden flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80"></div>
                  
                  <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 border-none text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-orange-900/50">
                    {item.category}
                  </Badge>

                  {/* Type Indicator (Video or Article) */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-slate-950/50 backdrop-blur-sm p-3 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-300">
                         <PlayCircle size={32} className="text-white fill-white/20" />
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6 flex-grow">
                  {/* Meta Header */}
                  <div className="flex items-center justify-between gap-4 text-xs text-slate-500 mb-4 font-mono">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {item.duration}
                        </span>
                    </div>
                    {item.isExternal && (
                         <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700 bg-slate-900/50">
                            {item.source}
                         </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-white mb-3 leading-tight group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 mt-auto">
                  {item.isExternal ? (
                      <Button asChild variant="link" className="p-0 text-orange-500 hover:text-orange-300 font-bold uppercase text-xs tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.type === 'video' ? 'Assistir Agora' : 'Ler na Fonte'} 
                            <ExternalLink size={14} />
                        </a>
                      </Button>
                  ) : (
                      <Button asChild variant="link" className="p-0 text-orange-500 hover:text-orange-300 font-bold uppercase text-xs tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                        <Link to={item.link}>
                            {item.type === 'video' ? 'Assistir Vídeo' : 'Ler Artigo'} 
                            <ArrowRight size={14} />
                        </Link>
                      </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500 font-sans">Nenhum item encontrado para sua busca.</p>
            <Button 
              variant="link" 
              className="text-orange-500 mt-2"
              onClick={() => {setSearchTerm(''); setSelectedCategory('Todos');}}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
