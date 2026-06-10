import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface LatestArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
}

export interface FeaturedVideo {
  title: string;
  excerpt: string;
  image: string;
  link: string;
  isExternal: boolean;
}

interface LatestContentProps {
  articles: LatestArticle[];
  video?: FeaturedVideo;
}

export function LatestContent({ articles, video }: LatestContentProps) {
  if (articles.length === 0 && !video) {
    return null;
  }

  return (
    <section className="bg-slate-900 py-20 px-6 pb-24 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Articles Column */}
          {articles.length > 0 && (
            <div>
              <h3 className="font-serif text-2xl font-bold text-white mb-8 border-l-4 border-orange-500 pl-4 drop-shadow-lg">
                Últimos Insights & Conteúdos
              </h3>
              <div className="space-y-6">
                {articles.map((article) => (
                  <Card key={article.id} className="bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/40 overflow-hidden group hover:border-orange-400 shadow-[0_0_10px_-3px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-orange-900/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <span className="font-sans text-orange-400 text-xs font-bold uppercase tracking-wider mb-2 block drop-shadow-sm">
                            {article.category}
                          </span>
                          <h4 className="font-serif text-white font-bold text-lg mb-2 group-hover:text-orange-300 transition-colors leading-tight">
                            {article.title}
                          </h4>
                        </div>
                        <Button asChild variant="link" className="font-sans text-slate-300 hover:text-white p-0 w-fit flex items-center gap-2 mt-4 font-medium">
                          <a href={article.link}>
                            Ler Mais <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Video Column */}
          {video && (
            <div>
              <h3 className="font-serif text-2xl font-bold text-white mb-8 border-l-4 border-orange-500 pl-4 drop-shadow-lg">
                Vídeo em Destaque
              </h3>
              <a
                href={video.link}
                {...(video.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block h-[calc(100%-4rem)]"
              >
                <Card className="bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/60 overflow-hidden group h-full shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)] hover:border-orange-400 hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.4)] transition-all duration-300">
                  <div className="relative h-full min-h-[300px]">
                    <ImageWithFallback
                      src={video.image}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-slate-950/80 to-transparent">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-900/50 group-hover:scale-110 transition-transform cursor-pointer">
                        <Play fill="white" className="text-white ml-1" size={32} />
                      </div>
                      <h4 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                        {video.title}
                      </h4>
                      <p className="font-sans text-slate-300 max-w-md">
                        {video.excerpt}
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
