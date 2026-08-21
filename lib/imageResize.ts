'use client';

/**
 * Client-side image downscale, shared by every upload surface (the photo
 * customizer, the material dropzone). Keeps payloads small and every
 * uploaded photo a predictable size regardless of what the visitor's phone
 * camera produced.
 */

export interface ResizeOptions {
  /** Longest edge after resize, in pixels. */
  maxEdge?: number;
  quality?: number;
}

export function resizeToDataUrl(file: File, opts: ResizeOptions = {}): Promise<string> {
  const maxEdge = opts.maxEdge ?? 1600;
  const quality = opts.quality ?? 0.85;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('could not read that image'));
    };
    img.src = objectUrl;
  });
}
