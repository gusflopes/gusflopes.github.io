import React from 'react';
import { Hero } from '../Hero';
import { Themes } from '../Themes';
import { Services } from '../Services';
import { LatestContent } from '../LatestContent';

export function HomePage() {
  return (
    <main>
      <Hero />
      <Themes />
      <Services />
      <LatestContent />
    </main>
  );
}
