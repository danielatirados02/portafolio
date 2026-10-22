# Portafolio · Daniela Tirado

Sitio personal de **Daniela Tirado**, líder de marketing, marca y contenido. Reúne su trayectoria, sus estudios, cinco casos de estudio (branding, diseño de contenido, logotipos, rebranding y gestión de redes) y un dashboard con las métricas reales de la página de Facebook *Animal Lovers*.

**Sitio publicado:** https://danielatirados02.github.io/portafolio/

## Stack

| Pieza | Uso |
|---|---|
| [Astro 5](https://astro.build) | Generador de sitio estático. Cada página se compila a HTML sin JavaScript innecesario. |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos. Los colores y tipografías de marca viven en `src/styles/global.css` (`@theme`). |
| `astro:assets` + sharp | Optimiza las imágenes a WebP en varios tamaños con carga diferida. |
| [Chart.js 4](https://www.chartjs.org) | Gráficas del dashboard de métricas. |
| Fontsource | Playfair Display y DM Sans autoalojadas, sin depender de Google Fonts. |
| GitHub Actions + Pages | Publicación automática en cada push a `main`. |

Este sitio reemplaza un prototipo en un solo HTML que cargaba Tailwind desde su CDN de pruebas, usaba imágenes de stock y datos ficticios.

## Identidad visual

| Token | Color | Uso |
|---|---|---|
| `brand-dark` | `#0F172A` azul medianoche | Texto, fondos oscuros, botones |
| `brand-accent` | `#D58B9E` palo de rosa | Titulares grandes, botones, acentos |
| `brand-deep` | `#A8506A` palo de rosa oscuro | Texto pequeño en rosa (cumple contraste AA) |
| `brand-light` | `#FDF2F8` rosa nube | Fondo general |
| `chart-rose` / `chart-blue` | `#C25A78` / `#3F64A8` | Series de las gráficas (paleta validada para daltonismo) |

Tipografías: **Playfair Display** para títulos y **DM Sans** para texto.

## Estructura

```
src/
  assets/                 foto de perfil e imágenes de cada proyecto (una carpeta por proyecto)
  components/             secciones de la página (Hero, About, Trajectory, Contact, Gallery...)
    metrics/              KpiStrip y Dashboard (gráficas de Facebook)
  content/proyectos/      un archivo .md por proyecto: textos y metadatos
  content.config.ts       esquema de los proyectos
  data/site.ts            datos personales, experiencia, estudios y herramientas
  data/facebook/raw/      exportaciones CSV de Meta Business Suite
  data/facebook/metrics.json  métricas procesadas (generado)
  lib/metrics.ts          cálculos y formato de números del dashboard
  layouts/Base.astro      <head>, SEO, navegación y pie de página
  pages/index.astro       página principal
  pages/proyectos/[slug].astro  página de detalle de cada proyecto
scripts/
  build-metrics.mjs       convierte los CSV de Meta en metrics.json
  import-assets.mjs       copia las imágenes originales a src/assets
```

## Desarrollo local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev       # servidor local en http://localhost:4321/portafolio
npm run build     # compila el sitio en dist/
npm run preview   # sirve la versión compilada
```

## Tareas frecuentes

**Cambiar datos personales, experiencia, estudios o herramientas:** editar `src/data/site.ts`.

**Agregar un proyecto:**

1. Crear la carpeta `src/assets/proyectos/<slug>/` con las imágenes (se ordenan por nombre: `01.jpg`, `02.jpg`...).
2. Crear `src/content/proyectos/<slug>.md` con este encabezado y el texto debajo:

   ```markdown
   ---
   title: Nombre del proyecto
   client: Cliente
   category: Branding
   year: '2026'
   summary: Una o dos frases para la tarjeta.
   cover: ../../assets/proyectos/<slug>/01.jpg
   coverAlt: Descripción de la imagen de portada
   coverPosition: top   # o center
   folder: <slug>
   tags: [Etiqueta 1, Etiqueta 2]
   order: 5             # posición en la lista
   ---

   ## El reto
   ...
   ```

**Actualizar el CV descargable:** reemplazar `public/cv/CV_Daniela_Tirado.pdf` por la nueva versión con el mismo nombre. Los botones «Descargar CV» del menú, la portada y la sección de contacto apuntan a ese archivo (ruta definida en `person.cv` de `src/data/site.ts`).

**Enlace externo de un proyecto:** agregar en el encabezado del `.md` la línea `website: { url: 'https://...', label: 'Texto del botón' }`.

**Actualizar las métricas de Facebook:**

1. Exportar desde Meta Business Suite los CSV de visualizaciones, interacciones, seguidores, visitas, público y formatos.
2. Reemplazar los archivos de `src/data/facebook/raw/` con los mismos nombres.
3. Ejecutar `npm run metrics` y revisar el resumen que imprime en consola.
4. Si cambia el mes de inicio de la gestión, ajustar `startMonth` en `scripts/build-metrics.mjs`.

## Publicación

Cada push a `main` ejecuta `.github/workflows/deploy.yml`, que compila el sitio y lo publica en GitHub Pages. En la configuración del repositorio, *Settings → Pages → Source* debe estar en **GitHub Actions**.

Si cambia el nombre del repositorio o el usuario, actualizar `site` y `base` en `astro.config.mjs`.

## Fuentes de datos

Las métricas del dashboard salen de la exportación de Meta Business Suite de la página [Animal Lovers](https://www.facebook.com/ConejosCute), del 1 de enero al 31 de diciembre de 2025. Los meses de enero a mayo corresponden al periodo anterior a la gestión de Daniela, que empezó en junio de 2025.
