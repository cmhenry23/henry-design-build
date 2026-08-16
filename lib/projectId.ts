/**
 * Human-readable project reference, e.g. HDB-2608-K7QR.
 *
 * Format: HDB-YYMM-XXXX
 *   YYMM  the month the enquiry came in — lets Ryan sort a pile of these by age
 *   XXXX  Crockford base-32 (no I, L, O, U — nothing to misread over the phone)
 *
 * Derived from the brief plus a timestamp, so two people describing the same
 * cottage on the same day still get different references.
 */

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function hash(input: string) {
  // FNV-1a — small, dependency-free, and good enough for a reference code.
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function makeProjectId(seed: string, at: Date = new Date()) {
  const yy = String(at.getFullYear()).slice(2);
  const mm = String(at.getMonth() + 1).padStart(2, '0');

  let h = hash(`${seed}|${at.getTime()}`);
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length) || hash(code);
  }

  return `HDB-${yy}${mm}-${code}`;
}
