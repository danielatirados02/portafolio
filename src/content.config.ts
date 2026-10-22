import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada proyecto es un .md en src/content/proyectos.
// `folder` apunta a src/assets/proyectos/<folder>, de donde sale la galería.
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      category: z.string(),
      year: z.string(),
      summary: z.string(),
      cover: image(),
      coverAlt: z.string(),
      coverPosition: z.enum(['top', 'center']).default('top'),
      folder: z.string(),
      tags: z.array(z.string()).default([]),
      order: z.number(),
      dashboard: z.boolean().default(false),
      galleryLabels: z.array(z.string()).default([]),
    }),
});

export const collections = { proyectos };
