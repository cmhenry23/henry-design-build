/**
 * Server-side parsing for `data:image/...;base64,...` URLs sent up from the
 * browser. Shared by every route that accepts an uploaded image (the photo
 * customizer, the AI rendering route's custom-material reference photos).
 */

const MIME_TYPES: Record<string, string> = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/** The three formats the browser-side resizer ever produces, and both Claude and Gemini accept. */
export const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** ~8 MB of actual image bytes, expressed as a base64 string length. */
export const MAX_IMAGE_B64_LEN = 8 * 1024 * 1024 * 1.37;

export interface ParsedImage {
  mimeType: string;
  data: string;
}

export function parseImageDataUrl(dataUrl: string): ParsedImage | null {
  const match = /^data:image\/(jpeg|jpg|png|webp);base64,([\s\S]+)$/.exec(dataUrl.trim());
  if (!match) return null;
  const mimeType = MIME_TYPES[match[1]];
  if (!mimeType) return null;
  return { mimeType, data: match[2] };
}
