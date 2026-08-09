import React from 'react';
import { Hero } from '../Hero';
import { Provas } from '../Provas';
import { Trajetoria } from '../Trajetoria';
import { LatestContent } from '../LatestContent';

export function HomePage() {
  return (
    <main>
      <Hero />
      <Provas />
      <Trajetoria />
      <LatestContent />
    </main>
  );
}
