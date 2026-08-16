/**
 * ══════════════════════════════════════════════════════════════════
 *  ⚠  PLACEHOLDER TESTIMONIALS — NOT REAL CLIENT REVIEWS  ⚠
 * ══════════════════════════════════════════════════════════════════
 *
 * These quotes were WRITTEN AS EXAMPLES to show the layout. They are
 * not from real clients. Publishing invented reviews on a live
 * business site is misleading to customers and, in Canada, is
 * prohibited under the Competition Act.
 *
 * BEFORE LAUNCH, do one of these two things:
 *
 *   1. Replace every entry below with a real quote from a real
 *      client who has agreed to be quoted by name, then set
 *      `PLACEHOLDER = false` to remove the warning banner.
 *
 *   2. Delete the entries, leave the array empty, and the
 *      testimonials section will hide itself automatically.
 *
 * Good ways to collect real ones: ask at final walkthrough, follow
 * up by text a week after handover, or point clients at a Google
 * Business review link and quote from there with permission.
 */

export const PLACEHOLDER = true;

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
      'We had three quotes and Ryan was the only one who came out, sat at our table, and asked what we actually wanted before talking about price. That set the tone for the whole build.',
    name: 'PLACEHOLDER — client name',
    detail: 'PLACEHOLDER — project type and town',
    project: 'cedar-sauna-cabin',
    rating: 5,
  },
  {
    quote:
      'The site was cleaner at the end of each day than our house is on a normal Tuesday. We lived here through the whole renovation and it never once felt like a construction zone.',
    name: 'PLACEHOLDER — client name',
    detail: 'PLACEHOLDER — project type and town',
    project: 'forest-kitchen',
    rating: 5,
  },
  {
    quote:
      'He talked us out of two things we wanted because they would not have lasted. I have never had a contractor argue against spending our money before.',
    name: 'PLACEHOLDER — client name',
    detail: 'PLACEHOLDER — project type and town',
    project: 'guest-bath-reset',
    rating: 5,
  },
  {
    quote:
      'The log stair is the first thing every single person comments on. Nobody believes it was built on site by one guy.',
    name: 'PLACEHOLDER — client name',
    detail: 'PLACEHOLDER — project type and town',
    project: 'cedar-sauna-cabin',
    rating: 5,
  },
  {
    quote:
      'Six months later we found one small thing that needed adjusting. He came back the same week and fixed it, no invoice, no fuss.',
    name: 'PLACEHOLDER — client name',
    detail: 'PLACEHOLDER — project type and town',
    project: 'aubergine-bath',
    rating: 5,
  },
];
