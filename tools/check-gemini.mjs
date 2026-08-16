/**
 * Gemini pre-flight check.
 *
 *   GEMINI_API_KEY=... node tools/check-gemini.mjs
 *
 * Answers three questions separately, because from inside the app they all
 * fail the same way:
 *
 *   1. Is the key valid at all?          (a cheap text call)
 *   2. Can it reach the image model?     (one real image generation)
 *   3. If not — why?                     (billing / quota / access / model id)
 *
 * Costs ~$0.13 if step 2 succeeds. Nothing if it fails.
 *
 * Flags:
 *   --model=x   test a different image model (default gemini-3-pro-image)
 *   --save      write the test image to tools/check-gemini-output.jpg
 */
import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const model = args.find((a) => a.startsWith('--model='))?.split('=')[1] ?? 'gemini-3-pro-image';
const save = args.includes('--save');

/**
 * Wrapped in a function so failures `return` a code rather than calling
 * process.exit() — exiting while a request handle is still in flight trips a
 * libuv assertion on Windows.
 */
async function main() {
  const key = process.env.GEMINI_API_KEY;

  console.log('\nGemini pre-flight\n─────────────────');

  if (!key) {
    console.log('✗  GEMINI_API_KEY is not set in this shell.\n');
    console.log('   Vercel env vars do not apply locally. Either:');
    console.log('     GEMINI_API_KEY=... node tools/check-gemini.mjs');
    console.log('   or put it in .env.local and use:');
    console.log('     npx dotenv-cli -e .env.local -- node tools/check-gemini.mjs\n');
    return 1;
  }

  console.log(`   key: ${key.slice(0, 8)}…${key.slice(-4)}  (${key.length} chars)`);
  console.log(`   image model: ${model}\n`);

  const ai = new GoogleGenAI({ apiKey: key });

  /* ── 1. Is the key valid? ── */
  process.stdout.write('1. Key valid ............ ');
  try {
    const r = await ai.models.generateContent({
      model: 'gemini-3.1-flash',
      contents: 'Reply with the single word: ok',
    });
    console.log(`yes  (replied "${(r.text ?? '').trim().slice(0, 20)}")`);
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    console.log('NO\n');
    console.log(`   ${m.slice(0, 300)}\n`);
    if (/API[_ ]?key|UNAUTHENTICATED|API_KEY_INVALID/i.test(m)) {
      console.log('   DIAGNOSIS: the key itself is wrong or revoked.');
      console.log('   → Regenerate at https://aistudio.google.com/apikey\n');
    }
    return 1;
  }

  /* ── 2. Can it generate an image? ── */
  process.stdout.write('2. Image generation ..... ');
  try {
    const interaction = await ai.interactions.create({
      model,
      input:
        'Tight close-up of clear western red cedar tongue-and-groove boards, honey-toned, natural daylight. No text, no people.',
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: '1:1',
        image_size: '1K',
      },
    });

    const data = interaction.output_image?.data;
    if (!data) {
      console.log('no image returned\n');
      console.log(
        `   Model replied with text instead: ${interaction.output_text?.slice(0, 200) ?? '(nothing)'}`
      );
      console.log('   → Usually a safety block on the prompt, not a config problem.\n');
      return 1;
    }

    const bytes = Buffer.from(data, 'base64');
    console.log(`YES  (${(bytes.length / 1024).toFixed(0)} KB)`);

    if (save) {
      const out = join(HERE, 'check-gemini-output.jpg');
      writeFileSync(out, bytes);
      console.log(`   saved: ${out}`);
    }

    console.log('\n✓  Everything works. Image generation is live on this key.\n');
    console.log('   Next: generate the material library (~$2, one time):');
    console.log('     GEMINI_API_KEY=... node tools/materials/generate.mjs\n');
    return 0;
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    console.log('NO\n');
    console.log(`   ${m.slice(0, 300)}\n`);

    if (/quota|RESOURCE_EXHAUSTED|billing|429/i.test(m)) {
      console.log('   DIAGNOSIS: the key works, but this model has no quota on your plan.');
      console.log('   Image generation is a PAID model — free-tier quota for it is zero,');
      console.log('   so even the first request fails as "quota exceeded".\n');
      console.log('   → Enable billing:            https://console.cloud.google.com/billing');
      console.log('   → Then confirm a real limit: https://ai.dev/rate-limit\n');
    } else if (/not found|NOT_FOUND|unsupported|invalid model/i.test(m)) {
      console.log(`   DIAGNOSIS: model id "${model}" is not available to this key.`);
      console.log('   → Try:  node tools/check-gemini.mjs --model=gemini-3.1-flash-image\n');
    } else if (/PERMISSION_DENIED|403/i.test(m)) {
      console.log('   DIAGNOSIS: key is valid but not permitted to use this model.');
      console.log('   → Check API restrictions on the key in the Google Cloud console.\n');
    }
    return 1;
  }
}

process.exitCode = await main();
