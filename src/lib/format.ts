/**
 * Utilitários de formatação compartilhados entre páginas Astro e islands React.
 * Datas vivem como ISO (YYYY-MM-DD) no frontmatter; a exibição pt-BR acontece aqui.
 */

const MONTHS_PT_ABBR = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const;

/** Formata uma data ISO "YYYY-MM-DD" para exibição pt-BR: "10 Jun, 2026". */
export function formatDatePtBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) {
    return isoDate;
  }
  return `${day} ${MONTHS_PT_ABBR[month - 1]}, ${year}`;
}

/** Comparator para ordenar datas ISO em ordem decrescente (mais recente primeiro). */
export function compareIsoDateDesc(a: string, b: string): number {
  return b.localeCompare(a);
}
