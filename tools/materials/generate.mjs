/**
 * One-time material image generator.
 *
 * Renders every material in data/materials.ts once, writes them to
 * public/materials/, and you commit the results. After that the chat serves
 * them as static files — no API calls, no cost, no latency, and the same
 * cedar for every visitor.
 *
 *   GEMINI_API_KEY=... node tools/materials/generate.mjs
 *
 * Flags:
 *   --force    re-render images that already exist (default: skip them)
 *   --only=id  render a single material, e.g. --only=clear-cedar
 *   --model=x  override the model (default gemini-3-pro-image, Nano Banana Pro)
 *
 * Cost: ~$0.13 per image, so a full run of 16 is about $2. Re-runs skip what
 * already exists, so fixing one bad material costs one image.
 */
import { GoogleGenAI } from '@google/genai';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
const OUT = join(REPO, 'public/materials');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set.\n\n  GEMINI_API_KEY=... node tools/materials/generate.mjs\n');
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const model = args.find((a) => a.startsWith('--model='))?.split('=')[1] ?? 'gemini-3-pro-image';

/* Read the material list out of the TS source — one definition, no drift. */
function loadMaterials() {
  let src = readFileSync(join(REPO, 'data/materials.ts'), 'utf8');
  src = src
    .slice(0, src.indexOf('export function materialsFor'))
    .replace(/^export type[\s\S]*?;$/gm, '')
    .replace(/^export interface [\s\S]*?^}/gm, '')
    .replace(/export const/g, 'const')
    .replace(/:\s*Material\[\]/g, '');
  return new Function(`${src}\nreturn MATERIALS;`)();
}

const materials = loadMaterials().filter((m) => (only ? m.id === only : true));
if (!materials.length) {
  console.error(only ? `No material with id "${only}".` : 'No materials found.');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const ai = new GoogleGenAI({ apiKey });

let made = 0;
let skipped = 0;
const failed = [];

for (const m of materials) {
  const file = join(OUT, `${m.id}.jpg`);
  if (existsSync(file) && !force) {
    skipped++;
    continue;
  }

  process.stdout.write(`  ${m.id.padEnd(22)} `);
  try {
    const interaction = await ai.interactions.create({
      model,
      input: m.prompt,
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: '1:1',
        image_size: '1K',
      },
    });

    const data = interaction.output_image?.data;
    if (!data) {
      console.log(`no image returned${interaction.output_text ? ` — ${interaction.output_text.slice(0, 60)}` : ''}`);
      failed.push(m.id);
      continue;
    }

    const bytes = Buffer.from(data, 'base64');
    writeFileSync(file, bytes);
    console.log(`ok  (${(bytes.length / 1024).toFixed(0)} KB)`);
    made++;
  } catch (error) {
    console.log(`failed — ${error instanceof Error ? error.message.slice(0, 80) : error}`);
    failed.push(m.id);
  }
}

console.log(
  `\n${made} generated, ${skipped} already present${failed.length ? `, ${failed.length} failed: ${failed.join(', ')}` : ''}`
);
if (made > 0) console.log(`\nWritten to public/materials/ — commit these so they ship with the site.`);
if (failed.length) process.exitCode = 1;
