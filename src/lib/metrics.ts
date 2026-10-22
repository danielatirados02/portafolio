import data from '../data/facebook/metrics.json';

export type SeriesKey = keyof typeof data.series;

export const metrics = data;
export const startIndex = data.months.indexOf(data.startMonth);

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const avg = (arr: number[]) => sum(arr) / arr.length;

/** Compara el promedio mensual antes y después del inicio de la gestión. */
export function compare(key: SeriesKey) {
  const s = data.series[key];
  const before = s.slice(0, startIndex);
  const after = s.slice(startIndex);
  return {
    beforeAvg: avg(before),
    afterAvg: avg(after),
    afterTotal: sum(after),
    peak: Math.max(...after),
    peakMonth: data.months[startIndex + after.indexOf(Math.max(...after))],
  };
}

const nf = new Intl.NumberFormat('es-CO');
const nf1 = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 });
export const fmt = (n: number) => nf.format(Math.round(n));
/** 4.168.081 → «4,2 M», 162.916 → «162,9 mil», 950 → «950» */
export const compact = (n: number) =>
  n >= 1e6 ? `${nf1.format(n / 1e6)} M` : n >= 1e3 ? `${nf1.format(n / 1e3)} mil` : nf.format(Math.round(n));

const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const monthLabel = (ym: string) => `${monthNames[Number(ym.slice(5, 7)) - 1]} ${ym.slice(2, 4)}`;
export const monthLong = (ym: string) =>
  new Date(`${ym}-01T12:00:00`).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

export const seriesMeta: Record<SeriesKey, { label: string; hint: string }> = {
  visualizaciones: { label: 'Visualizaciones', hint: 'Veces que se mostró el contenido de la página' },
  interacciones: { label: 'Interacciones', hint: 'Reacciones, comentarios y veces compartido' },
  seguidores: { label: 'Seguidores nuevos', hint: 'Personas que empezaron a seguir la página' },
  visitas: { label: 'Visitas a la página', hint: 'Visitas al perfil de la página' },
};
