/**
 * One-time image generator for the pre-rendered asset sets.
 *
 *   npm run images              both sets, skipping what already exists
 *   npm run images -- --set=styles
 *   npm run images -- --only=craftsman --force
 *
 * Renders each item once, writes it to public/<set>/, and you commit the
 * result. The chat then serves them as static files — free, instant, and
 * identical for every visitor. Only the whole-project render is made live,
 * because that one genuinely depends on the brief.
 *
 * Palettes are deliberately absent: a palette is a set of hex values, so it is
 * drawn as CSS. Generating it would give you an approximation of a colour we
 * already know exactly.
 *
 * Cost: ~$0.13 per image. Re-runs skip what exists, so fixing one bad tile
 * costs one image.
 */
import { GoogleGenAI } from '@google/genai';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const setArg = args.find((a) => a.startsWith('--set='))?.split('=')[1];
const model = args.find((a) => a.startsWith('--model='))?.split('=')[1] ?? 'gemini-3-pro-image';

/** Each set: where the data lives, what it exports, where images go, shape. */
const SETS = {
  materials: {
    file: 'data/materials.ts',
    exportName: 'MATERIALS',
    cutAt: 'export function materialsFor',
    dir: 'public/materials',
    aspect: '1:1',
  },
  styles: {
    file: 'data/styles.ts',
    exportName: 'STYLES',
    cutAt: 'export function stylesFor',
    dir: 'public/styles',
    aspect: '4:3',
  },
};

/** Read a list straight out of the TS source — one definition, no drift. */
function load({ file, exportName, cutAt }) {
  let src = readFileSync(join(REPO, file), 'utf8');
  src = src
    .slice(0, src.indexOf(cutAt))
    .replace(/^export type[\s\S]*?;$/gm, '')
    .replace(/^export interface [\s\S]*?^}/gm, '')
    .replace(/export const/g, 'const')
    .replace(/:\s*(Material|DesignStyle)\[\]/g, '');
  return new Function(`${src}\nreturn ${exportName};`)();
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    '\nGEMINI_API_KEY is not set.\n\n' +
      '  Put it in .env.local (gitignored) and run:  npm run images\n' +
      '  or:  GEMINI_API_KEY=... node tools/generate-images.mjs\n'
  );
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const chosen = setArg ? [setArg] : Object.keys(SETS);

let made = 0;
let skipped = 0;
const failed = [];

for (const setName of chosen) {
  const set = SETS[setName];
  if (!set) {
    console.error(`Unknown set "${setName}". Known: ${Object.keys(SETS).join(', ')}`);
    process.exit(1);
  }

  const items = load(set).filter((i) => (only ? i.id === only : true));
  if (!items.length) continue;

  const outDir = join(REPO, set.dir);
  mkdirSync(outDir, { recursive: true });
  console.log(`\n${setName}  (${set.aspect})`);

  for (const item of items) {
    const file = join(outDir, `${item.id}.jpg`);
    if (existsSync(file) && !force) {
      skipped++;
      continue;
    }

    process.stdout.write(`  ${item.id.padEnd(24)} `);
    try {
      const interaction = await ai.interactions.create({
        model,
        input: item.prompt,
        response_format: {
          type: 'image',
          mime_type: 'image/jpeg',
          aspect_ratio: set.aspect,
          image_size: '1K',
        },
      });

      const data = interaction.output_image?.data;
      if (!data) {
        console.log(`no image${interaction.output_text ? ` — ${interaction.output_text.slice(0, 50)}` : ''}`);
        failed.push(item.id);
        continue;
      }

      const bytes = Buffer.from(data, 'base64');
      writeFileSync(file, bytes);
      console.log(`ok  (${(bytes.length / 1024).toFixed(0)} KB)`);
      made++;
    } catch (error) {
      const m = error instanceof Error ? error.message : String(error);
      console.log(`failed — ${m.slice(0, 70)}`);
      failed.push(item.id);
    }
  }
}

console.log(
  `\n${made} generated, ${skipped} already present` +
    (failed.length ? `, ${failed.length} failed: ${failed.join(', ')}` : '')
);
if (made > 0) console.log('\nCommit the new files so they ship with the site.\n');
if (failed.length) process.exitCode = 1;
