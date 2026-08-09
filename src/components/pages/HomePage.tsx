import React from 'react';
import { Hero } from '../Hero';
import { Provas } from '../Provas';
import { Trajetoria } from '../Trajetoria';
import { Formacao } from '../Formacao';

export function HomePage() {
  return (
    <main>
      <Hero />
      <Provas />
      <Trajetoria />
      <Formacao />
    </main>
  );
}
