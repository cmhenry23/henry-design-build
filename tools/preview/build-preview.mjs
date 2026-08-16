/**
 * Builds a single self-contained HTML file — every image, font and script
 * inlined — from the real site data, for sharing a clickable preview with
 * someone who can't run the dev server.
 *
 * Run `npm run build` first: this reads the woff2 subsets that next/font
 * emits into .next/static/media.
 *
 *   node tools/preview/build-preview.mjs
 *   -> tools/preview/preview.html
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolved from this file's own location, so the script works from any
// checkout and any working directory.
const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');

const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString('base64')}`;

/* ── Fonts (variable latin subsets emitted by next/font) ── */
const FONTS = {
  archivo: b64(join(REPO, '.next/static/media/1a4aa50920b5315c-s.p.woff2'), 'font/woff2'),
  inter: b64(join(REPO, '.next/static/media/e4af272ccee01ff0-s.p.woff2'), 'font/woff2'),
};

/* ── Images ──
   Base64 inflates by ~33%, and the whole bundle has to stay comfortably under
   the hosting size limit, so the preview carries a capped set of photos per
   project rather than the full gallery. Pass --full to embed everything (fine
   for opening the file locally, usually too large to publish). */
const FULL = process.argv.includes('--full');
const PHOTOS_PER_PROJECT = FULL ? Infinity : 3;

/* ── Pull the real data out of the TS sources ──
   These files are plain data with no imports beyond types, so stripping
   the type layer and evaluating gives us exactly what the site renders. */
function evalTs(file, names, cutAt) {
  let src = readFileSync(join(REPO, file), 'utf8');
  if (cutAt) src = src.slice(0, src.indexOf(cutAt));
  src = src
    .replace(/^import[\s\S]*?;$/gm, '')
    .replace(/^export (interface|type) [\s\S]*?^}/gm, '')
    .replace(/^export type .*?;$/gm, '')
    .replace(/export function[\s\S]*$/m, '')
    .replace(/export const/g, 'const')
    .replace(/:\s*(Config|Project\[\]|ProjectCategory\[\]|BuildType\[\]|FinishLevel\[\]|SiteAccess\[\]|AddOn\[\]|Testimonial\[\])/g, '')
    .replace(/\bas const\b/g, '')
    .replace(/\bas string\b/g, '')
    .replace(/\bas SeasonId\b/g, '')
    .replace(/\bas BuildTypeId\b/g, '')
    .replace(/\bas FinishLevelId\b/g, '')
    .replace(/\bas SiteAccessId\b/g, '');
  const fn = new Function(`${src}\nreturn {${names.join(',')}};`);
  return fn();
}

const proj = evalTs('data/projects.ts', ['projects'], 'export function getProject');
const est = evalTs(
  'lib/estimate.ts',
  ['BUILD_TYPES', 'FINISH_LEVELS', 'SITE_ACCESS', 'SEASONS', 'ADD_ONS', 'CLADDINGS', 'ROOFS', 'PITCHES'],
  '/* ── The calculation ── */'
);
const tst = evalTs('data/testimonials.ts', ['testimonials']);
const st = evalTs('data/site.ts', ['services']);

const PROJECTS = proj.projects.map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  location: p.location.replace(/^TODO: confirm ?/, 'Location TBC'),
  year: p.year.replace(/^TODO: confirm ?/, 'Year TBC'),
  summary: p.summary,
  highlights: p.highlights,
  cover: p.cover.src,
  coverAlt: p.cover.alt,
  photos: p.photos
    .slice(0, PHOTOS_PER_PROJECT)
    .map((ph) => ({ src: ph.src, alt: ph.alt, caption: ph.caption })),
}));

// Embed only what the trimmed set actually references, plus the hero.
const imgDir = join(REPO, 'public/portfolio');
const needed = new Set(['/portfolio/cabin-exterior-dusk.jpg', '/portfolio/cabin-timber-frame.jpg']);
for (const p of PROJECTS) {
  needed.add(p.cover);
  for (const ph of p.photos) needed.add(ph.src);
}
const IMG = {};
for (const ref of needed) {
  IMG[ref] = b64(join(imgDir, ref.replace('/portfolio/', '')), 'image/jpeg');
}
const skipped = readdirSync(imgDir).filter((f) => f.endsWith('.jpg')).length - needed.size;
if (skipped > 0) console.log(`note: ${skipped} photos omitted from the bundle (run with --full to include all)`);

const DATA = `
const IMG = ${JSON.stringify(IMG)};
const PROJECTS = ${JSON.stringify(PROJECTS)};
const SERVICES = ${JSON.stringify(st.services)};
const TESTIMONIALS = ${JSON.stringify(tst.testimonials)};
const BUILD_TYPES = ${JSON.stringify(est.BUILD_TYPES)};
const FINISH_LEVELS = ${JSON.stringify(est.FINISH_LEVELS)};
const SITE_ACCESS = ${JSON.stringify(est.SITE_ACCESS)};
const SEASONS = ${JSON.stringify(est.SEASONS)};
const ADD_ONS = ${JSON.stringify(est.ADD_ONS)};
const CLADDINGS = ${JSON.stringify(est.CLADDINGS)};
const ROOFS = ${JSON.stringify(est.ROOFS)};
const PITCHES = ${JSON.stringify(est.PITCHES)};
`;

let html = readFileSync(join(HERE, 'template.html'), 'utf8');
html = html
  .replace('{{FONT:archivo}}', FONTS.archivo)
  .replace('{{FONT:inter}}', FONTS.inter)
  .replace(/\{\{IMG:([a-z0-9-]+)\}\}/g, (_, name) => IMG[`/portfolio/${name}.jpg`])
  .replace('{{DATA}}', DATA);

const out = join(HERE, 'preview.html');
writeFileSync(out, html);
console.log('projects:', PROJECTS.length, '| photos:', Object.keys(IMG).length, '| testimonials:', tst.testimonials.length);
console.log('size:', (Buffer.byteLength(html) / 1024 / 1024).toFixed(2), 'MB ->', out);
