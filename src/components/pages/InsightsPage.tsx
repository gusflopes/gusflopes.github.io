import { useState } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export interface InsightArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

interface InsightsPageProps {
  articles: InsightArticle[];
}

export function InsightsPage({ articles }: InsightsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ["Todos", "Arquitetura", ".NET", "DevOps", "Carreira", "IA"];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 relative overflow-hidden selection:bg-orange-200 selection:text-orange-900">
      
      {/* Artistic Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Organic Fluid Backgrounds - "Polimórfia" Interpretation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse duration-[10000ms]"></div>
          <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-slate-300/40 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute -bottom-40 right-1/3 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* Header - Artistic/Typography Focused */}
        <div className="mb-12 text-center relative">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
             <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight relative inline-block">
               Insights Técnicos
               <span className="absolute -right-6 -top-1 text-orange-500">
                 <Sparkles size={20} strokeWidth={1.5} />
               </span>
             </h1>
             <p className="font-sans text-base text-slate-500 font-light">
               Arquitetura profunda, filosofia de código e engenharia.
             </p>
           </motion.div>
        </div>

        {/* Filters - Minimalist Pill */}
        <div className="sticky top-4 z-40 flex justify-center mb-20 pointer-events-none">
           <div className="bg-white/80 backdrop-blur-lg shadow-sm border border-white/20 rounded-full p-1 pl-4 pr-1 flex items-center gap-4 pointer-events-auto">
              <span className="text-slate-400 hidden md:block">
                <Search size={16} />
              </span>
              <input 
                className="bg-transparent border-none outline-none w-32 md:w-64 text-sm text-slate-700 placeholder:text-slate-400 font-sans"
                placeholder="Filtrar ideias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar">
                {categories.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Masonry-ish Artistic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {filteredArticles.map((article, idx) => (
            <a
              key={article.id}
              href="/insights/article"
              className={`group block ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
            <motion.article 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col h-full"
            >
              {/* Image Container with Morphing Mask Effect */}
              <div className="relative mb-8 overflow-hidden rounded-lg aspect-[4/3]">
                <div className="absolute inset-0 bg-orange-500/10 mix-blend-multiply z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <ImageWithFallback 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                
                {/* Floating Category Tag */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-slate-900 z-20">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                {/* Date - Added as requested */}
                <div className="mb-3 font-mono text-xs text-slate-400 uppercase tracking-wider">
                    {article.date}
                </div>

                <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {article.title}
                </h2>
                <p className="font-sans text-slate-500 leading-relaxed mb-6 font-light group-hover:text-slate-700 transition-colors">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest group/btn w-fit">
                  Ler Artigo
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                </div>
              </div>
            </motion.article>
            </a>
          ))}
        </div>

        {/* Pagination - Technical Editorial Style */}
        {filteredArticles.length > 0 && (
          <div className="mt-32 flex justify-center items-center gap-12 font-mono text-xs tracking-[0.2em] uppercase font-medium">
             <button className="group flex items-center gap-2 text-slate-300 cursor-not-allowed" disabled>
               <span className="group-hover:-translate-x-1 transition-transform duration-300">&larr;</span>
               Prev
             </button>
             
             <div className="flex items-center gap-6 text-slate-400">
               <span className="text-slate-900 border-b border-orange-500 pb-1">01</span>
               <span className="hover:text-slate-900 cursor-pointer transition-colors">02</span>
               <span className="hover:text-slate-900 cursor-pointer transition-colors">03</span>
               <span className="text-slate-200 font-light">|</span>
               <span className="hover:text-slate-900 cursor-pointer transition-colors">08</span>
             </div>

             <button className="group flex items-center gap-2 text-slate-900 hover:text-orange-600 transition-colors">
               Next
               <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
             </button>
          </div>
        )}

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-32 opacity-50">
            <p className="font-serif text-2xl italic">O silêncio faz parte da música.</p>
            <p className="font-sans text-sm mt-2">Nenhum artigo encontrado.</p>
          </div>
        )}

      </div>
    </div>
  );
}
