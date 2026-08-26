/**
 * ══════════════════════════════════════════════════════════════════
 *  ⚠  PLACEHOLDER POSTS — NOT REAL ARTICLES  ⚠
 * ══════════════════════════════════════════════════════════════════
 *
 * These entries were WRITTEN AS EXAMPLES to show the page's layout —
 * the topics and text are illustrative, not things Ryan or Cam have
 * actually published. The cover photos are real (pulled from
 * data/projects.ts), since there's no reason to fake those.
 *
 * BEFORE LAUNCH, do one of these two things:
 *
 *   1. Replace the body text below with real writing — from Ryan,
 *      from Cam, or from site visits and client questions that come
 *      up often — then set `PLACEHOLDER = false`.
 *
 *   2. Delete the entries, leave the array empty, and the journal
 *      page will say so rather than show anything.
 */

export const PLACEHOLDER = true;

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string. */
  date: string;
  category: string;
  body: string[];
  cover: { src: string; alt: string };
}

export const journalPosts: JournalPost[] = [
  {
    slug: 'placeholder-what-moves-the-number',
    title: 'PLACEHOLDER — What Actually Moves the Number',
    excerpt:
      'PLACEHOLDER EXCERPT. Square footage gets the blame, but it is rarely the reason a build costs what it costs.',
    date: '2026-03-01',
    category: 'Planning',
    body: [
      'PLACEHOLDER BODY TEXT. Replace with a real piece — the kind of thing you find yourself explaining to every client at the first meeting anyway.',
      'A second paragraph goes here. Two or three short paragraphs is plenty; this is a journal entry, not a brochure.',
    ],
    cover: {
      src: '/portfolio/real-kitchen-island.jpg',
      alt: 'Dark grey shaker kitchen with a white quartz island, pendant lights and an apron sink',
    },
  },
  {
    slug: 'placeholder-building-on-rock',
    title: 'PLACEHOLDER — Building on Rock in Cottage Country',
    excerpt:
      'PLACEHOLDER EXCERPT. A foundation on the Canadian Shield is a different problem than a foundation anywhere else.',
    date: '2026-01-14',
    category: 'Site & foundation',
    body: [
      'PLACEHOLDER BODY TEXT. Replace with real detail about site access, blasting, rock cuts, or whatever actually comes up on Muskoka/Haliburton-area lots.',
    ],
    cover: {
      src: '/portfolio/real-cabin-exterior.jpg',
      alt: 'A dark board-and-batten cabin exterior with a light blue door, photographed at dusk',
    },
  },
  {
    slug: 'placeholder-reeded-glass',
    title: 'PLACEHOLDER — The Case for Reeded Glass',
    excerpt:
      'PLACEHOLDER EXCERPT. A material note on why a small bathroom got fluted glass instead of clear.',
    date: '2025-11-02',
    category: 'Materials',
    body: [
      'PLACEHOLDER BODY TEXT. Replace with a real, specific note about a material choice and why it earned its place.',
    ],
    cover: {
      src: '/portfolio/real-bath-aubergine-full.jpg',
      alt: 'Deep plum bathroom with a dark vanity, reeded glass tub enclosure and warm vanity lighting',
    },
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}

/**
 * Parses a `YYYY-MM-DD` string as local midnight rather than UTC midnight.
 * `new Date('2026-03-01')` alone reads as UTC, which prints a day early in
 * any timezone behind UTC (e.g. Newfoundland) — this is why.
 */
export function parsePostDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}
