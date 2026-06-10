import { Hero } from '../Hero';
import { Themes } from '../Themes';
import { Services } from '../Services';
import { LatestContent, type LatestArticle, type FeaturedVideo } from '../LatestContent';

interface HomePageProps {
  articles: LatestArticle[];
  video?: FeaturedVideo;
}

export function HomePage({ articles, video }: HomePageProps) {
  return (
    <main>
      <Hero />
      <Themes />
      <Services />
      <LatestContent articles={articles} video={video} />
    </main>
  );
}
