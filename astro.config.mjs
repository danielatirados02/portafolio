// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE y BASE se ajustan al usuario y nombre del repositorio de GitHub Pages.
// Para un repo <usuario>.github.io usar base: '/'.
export default defineConfig({
  site: 'https://danielatirados02.github.io',
  base: '/portafolio',
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
