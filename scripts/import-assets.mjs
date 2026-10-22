// Copia las imágenes originales de /Proyectos y la foto a src/assets con nombres limpios.
// Los originales no se versionan; correr `npm run assets` solo si cambian.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'Proyectos';
const DEST = 'src/assets/proyectos';

const map = {
  'Brandbook OI': 'outrix-intelligence',
  'Creacion de Contenido': 'creacion-de-posts',
  'Diseño de logotipos tipograficos conceptuales': 'logotipos-tipograficos',
  'Rediseño de identidad visual': 'rediseno-samy',
};

const num = (f) => Number((f.match(/(\d+)-80/) || [])[1] ?? 0);

for (const [folder, slug] of Object.entries(map)) {
  const dir = path.join(SRC, folder);
  const out = path.join(DEST, slug);
  fs.mkdirSync(out, { recursive: true });
  const files = fs.readdirSync(dir).filter((f) => /^Mesa de trabajo .*\.jpg$/i.test(f)).sort((a, b) => num(a) - num(b));
  files.forEach((f, i) => fs.copyFileSync(path.join(dir, f), path.join(out, `${String(i + 1).padStart(2, '0')}.jpg`)));
  console.log(`${slug}: ${files.length} imágenes`);
}

// Portada fotográfica del brandbook
await sharp(path.join(SRC, 'Brandbook OI', 'pomelli_photoshoot-1.png'))
  .jpeg({ quality: 88 })
  .toFile(path.join(DEST, 'outrix-intelligence', 'portada.jpg'));

// Foto de perfil: se recorta el borde inferior para quitar el sello de la esquina
await sharp('me.png')
  .extract({ left: 0, top: 0, width: 880, height: 1100 })
  .jpeg({ quality: 90 })
  .toFile('src/assets/daniela.jpg');

console.log('Listo');
