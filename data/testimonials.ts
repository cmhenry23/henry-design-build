/**
 * ══════════════════════════════════════════════════════════════════
 *  REAL TESTIMONIALS — pulled from Henry Design Build's own Google
 *  Business Profile (5.0★, googled and confirmed by Ryan directly —
 *  see site.googleReviews in data/site.ts for the live link).
 * ══════════════════════════════════════════════════════════════════
 *
 * All 3 of the profile's reviews are in here. Two (the first and second
 * below) were trimmed at a clean sentence boundary where Google's own
 * review widget truncates the text server-side — an ellipsis marks the
 * cut, nothing after it is invented.
 *
 * Only first names are shown, per Ryan's call. The second review posted
 * publicly under the Google display name "MCC 968" — Ryan confirmed
 * that's Randy, a real client, so it's shown here as Randy rather than
 * that display name.
 *
 * As more reviews come in, add them here the same way — real quote,
 * first name as confirmed, and only a `project` link where the review
 * itself names the actual build.
 */

export const PLACEHOLDER = false;

export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Cottage build, Haliburton" */
  detail: string;
  project?: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Ryan completed multiple projects for us — custom cabin, bunkie, sauna…',
    name: 'Chris',
    detail: 'Custom cabin, bunkie & sauna build — Google review',
    project: 'cedar-sauna-cabin',
    rating: 5,
  },
  {
    quote:
      'Had Ryan from Henry Design Build design and build my garage storage system earlier this year and we were VERY impressed! His design met all of our requirements and budget. He is professional, honest and produced a quality product.',
    name: 'Randy',
    detail: 'Garage storage system, design & build — Google review',
    rating: 5,
  },
  {
    quote:
      'Ryan Henry offers reasonable pricing, delivers high-quality work, is trustworthy, and maintains good communication. Highly recommended!',
    name: 'Mihaela',
    detail: 'Google review',
    rating: 5,
  },
];
