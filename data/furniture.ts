/**
 * ══════════════════════════════════════════════════════════════════
 *  ⚠  PLACEHOLDER LISTINGS — NOT REAL ITEMS FOR SALE  ⚠
 * ══════════════════════════════════════════════════════════════════
 *
 * These entries were WRITTEN AS EXAMPLES to show the page's layout —
 * the pieces, prices and photos are not real. Publishing invented
 * items for sale on a live site is actively misleading: a visitor
 * could try to buy something that doesn't exist.
 *
 * BEFORE LAUNCH, do one of these two things:
 *
 *   1. Replace every entry below with a real piece Papa actually has
 *      for sale — real photos in /public/shop/, a real price, a real
 *      description — then set `PLACEHOLDER = false` to remove the
 *      warning banner on the page.
 *
 *   2. Delete the entries, leave the array empty, and the shop page
 *      will say so rather than show anything.
 *
 * No photos exist yet for any entry — `photos: []` renders a plain
 * "photo coming soon" placeholder rather than a fabricated image, on
 * purpose. Never generate a fake product photo for a real listing.
 */

export const PLACEHOLDER = true;

export type FurnitureStatus = 'available' | 'sold';

export interface FurniturePhoto {
  src: string;
  alt: string;
}

export interface FurnitureItem {
  slug: string;
  name: string;
  /** CAD. */
  price: number;
  status: FurnitureStatus;
  category: string;
  condition: string;
  /** e.g. `48" W x 30" D x 30" H`. */
  dimensions: string;
  description: string;
  photos: FurniturePhoto[];
}

export const categories = ['Tables', 'Chairs & Seating', 'Storage', 'Outdoor'] as const;

export const furniture: FurnitureItem[] = [
  {
    slug: 'placeholder-harvest-table',
    name: 'PLACEHOLDER — Solid pine harvest table',
    price: 450,
    status: 'available',
    category: 'Tables',
    condition: 'PLACEHOLDER — e.g. Vintage, refinished',
    dimensions: 'PLACEHOLDER — e.g. 72" W x 36" D x 30" H',
    description:
      'PLACEHOLDER DESCRIPTION. Replace with a real, honest description of the actual piece — wood species, age, any repairs, what makes it worth the price.',
    photos: [],
  },
  {
    slug: 'placeholder-rocking-chair',
    name: 'PLACEHOLDER — Cedar rocking chair',
    price: 120,
    status: 'available',
    category: 'Chairs & Seating',
    condition: 'PLACEHOLDER — e.g. Handmade, new',
    dimensions: 'PLACEHOLDER — e.g. 26" W x 34" D x 42" H',
    description:
      'PLACEHOLDER DESCRIPTION. Replace with a real, honest description of the actual piece.',
    photos: [],
  },
  {
    slug: 'placeholder-storage-bench',
    name: 'PLACEHOLDER — Entryway storage bench',
    price: 200,
    status: 'sold',
    category: 'Storage',
    condition: 'PLACEHOLDER — e.g. Like new',
    dimensions: 'PLACEHOLDER — e.g. 48" W x 18" D x 20" H',
    description:
      'PLACEHOLDER DESCRIPTION. Shown here as an example of how a sold item displays — replace or remove.',
    photos: [],
  },
];

export function getFurnitureItem(slug: string) {
  return furniture.find((f) => f.slug === slug);
}
