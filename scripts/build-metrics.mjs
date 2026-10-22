// Convierte las exportaciones de Meta Business Suite (CSV UTF-16) en un JSON
// listo para el dashboard: totales mensuales, formatos de contenido y público.
// Uso: reemplazar los CSV en src/data/facebook/raw y correr `npm run metrics`.
import fs from 'node:fs';
import path from 'node:path';

const RAW = 'src/data/facebook/raw';
const OUT = 'src/data/facebook/metrics.json';

const read = (file) => fs.readFileSync(path.join(RAW, file), 'utf16le').replace(/^﻿/, '');
const cells = (line) => [...line.matchAll(/"([^"]*)"/g)].map((m) => m[1]);

// Agrupa el archivo en secciones: { "Título": [[celdas], ...] }
function sections(file) {
  const out = {};
  let current = null;
  for (const line of read(file).split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('sep=')) continue;
    const row = cells(line);
    if (row.length === 1 && isNaN(Number(row[0])) && !/^\d{4}-/.test(row[0])) {
      current = row[0];
      out[current] = [];
    } else if (current) {
      out[current].push(row);
    }
  }
  return out;
}

// Serie diaria -> suma por mes (YYYY-MM)
function monthly(file) {
  const [rows] = Object.values(sections(file));
  const byMonth = {};
  for (const [date, value] of rows) {
    if (!/^\d{4}-\d{2}/.test(date)) continue;
    const key = date.slice(0, 7);
    byMonth[key] = (byMonth[key] ?? 0) + Number(value);
  }
  return byMonth;
}

const series = {
  visualizaciones: monthly('visualizaciones.csv'),
  interacciones: monthly('interacciones.csv'),
  seguidores: monthly('seguidores.csv'),
  visitas: monthly('visitas.csv'),
};
const months = Object.keys(series.visualizaciones).sort();

const toPairs = (rows) => rows[0].map((label, i) => ({ label, value: Number(rows[1][i]) }));
const ageGender = (rows) =>
  rows.slice(1).map(([age, mujeres, hombres]) => ({ age, mujeres: Number(mujeres), hombres: Number(hombres) }));

const formatos = sections('formatos.csv');
const publico = sections('publico.csv');
const colombia = sections('publico-colombia.csv');

const data = {
  source: 'Meta Business Suite, exportación del 1 de enero al 31 de diciembre de 2025',
  page: { name: 'Animal Lovers', url: 'https://www.facebook.com/ConejosCute' },
  startMonth: '2025-06',
  months,
  series: Object.fromEntries(Object.entries(series).map(([k, v]) => [k, months.map((m) => v[m] ?? 0)])),
  formatos: {
    publicado: toPairs(formatos['Contenido publicado']),
    visualizaciones: toPairs(formatos['Visualizaciones']),
    interacciones: toPairs(formatos['Interacciones con el contenido']),
  },
  publico: {
    paises: toPairs(publico['Principales países']),
    edadSexo: ageGender(publico['Edad y sexo']),
    ciudades: toPairs(publico['Principales ciudades']),
  },
  publicoColombia: {
    edadSexo: ageGender(colombia['Edad y sexo']),
    ciudades: toPairs(colombia['Principales ciudades']),
  },
};

fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`Escrito ${OUT}: ${months.length} meses`);
for (const [k, v] of Object.entries(data.series)) console.log(k.padEnd(16), v.join(' '));
