/**
 * ────────────────────────────────────────────────────────────────
 * SITE CONFIG — Ryan, edit this file first.
 * ────────────────────────────────────────────────────────────────
 * Everything marked TODO is a placeholder that must be replaced
 * with real information before this site goes live.
 */

export const site = {
  name: 'Henry Design Build',
  shortName: 'HDB',
  tagline: 'Where your vision becomes home',
  subTagline: 'Real craftsmanship.',
  url: 'https://www.henrydb.ca',

  email: 'henrydesignbuild4@gmail.com',

  // Confirmed current by Ryan (Sept 2026).
  phone: '(226) 224-8633' as string,

  instagram: 'https://www.instagram.com/henry_designbuild/',
  instagramHandle: '@henry_designbuild',

  // TODO: replace with the real service area. Used in copy + SEO.
  serviceArea: 'Ontario cottage country and the surrounding region',
  serviceAreaShort: 'Ontario',

  // Towns named in the journal's own market/build posts — shown in the
  // footer and on the contact page so a visitor from one of these towns
  // sees themselves reflected. Add to or trim this list as your real
  // service area changes.
  serviceTowns: ['London', 'Grand Bend', 'Tobermory', 'Muskoka'] as string[],

  founded: 2020,
  yearsExperience: '5+',

  // Only real, confirmable credentials belong here — each one prints as a
  // small trust badge (footer, homepage, about). Flip one to false and it
  // just disappears, nothing prints "no". Confirmed by Ryan (Sept 2026):
  // Red Seal, insured, and Wedi (waterproofing system) certified.
  credentials: {
    redSeal: true,
    insured: true,
    wedi: true as boolean,
  },

  // Real Google Business Profile — 5.0 stars / 3 reviews, checked Sept
  // 2026. Update `count`/`rating` here as more reviews come in; there's no
  // API wired up to pull it live.
  googleReviews: {
    url: 'https://share.google/VQ2sqRIASpskSkQHC',
    rating: 5.0,
    count: 3,
  },

  owner: {
    name: 'Ryan Henry',
    role: 'Founder & Red Seal Carpenter',
  },

  // Ryan's brother — runs sales and works the tools alongside him.
  partner: {
    name: 'Cam Henry',
    role: 'Head of Sales & Carpenter',
  },
} as const;

// "Design Studio" (/visualizer) is deliberately not a top-level nav item —
// it's the same configurator that lives inside /start, just without the
// chat intake. Keeping both in the nav made a first-time visitor choose
// between two doors into the same room. /visualizer still works and is
// still linked from "Design your build" buttons across the site — it's
// just not competing with Start for top billing.
export const nav = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/start', label: 'Design Studio' },
  { href: '/about', label: 'About' },
  { href: '/journal', label: 'Journal' },
  { href: '/papas-shop', label: "Papa's Shop" },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const;

export const services = [
  {
    title: 'Custom cottages',
    body: 'Four-season cabins, bunkies and boathouses built for the way a family actually uses the lake — and detailed so they still look right in thirty years.',
  },
  {
    title: 'Tiny homes & bunkies',
    body: 'Small footprints, no wasted inches. Guest bunkies, studio builds and backyard suites finished to the same standard as the main house.',
  },
  {
    title: 'Kitchens & baths',
    body: 'The two rooms that decide how a house feels. Full gut-and-rebuild including layout, cabinetry, tile, waterproofing and finish carpentry.',
  },
  {
    title: 'Custom carpentry',
    body: 'Built-ins, staircases, mantels and site-built millwork — the details that separate a house from a home, made to fit the space exactly.',
  },
  {
    title: 'Outdoor living spaces',
    body: 'Decks, covered porches and three-season rooms built to extend the house outward, not just add square footage.',
  },
  {
    title: 'Renovations & restoration',
    body: 'From a single accent wall to a whole-floor rework. Old houses get repaired properly rather than papered over.',
  },
] as const;

export const processSteps = [
  {
    step: '01',
    title: 'First meeting',
    body: 'Invite us to your home. We want to hear your ideas and get to know you. From there we go over the proposed scope of work, your budget, and give you options we know you will love.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'We give you an estimate on the cost of the scope of work. We want to hear your questions and any more ideas you may have. Then we go through samples and options together, and plan a starting date.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'We prepare your house for the work being done, ensuring comfort, cleanliness and peace of mind throughout. Then we get to work — keeping you updated with transparent communication for the entirety of your experience.',
  },
  {
    step: '04',
    title: 'Done',
    body: 'Time to move back in, and we are still of help. We make sure your home is put together completely, so you can go back to making memories in a home that is unmistakably yours.',
  },
] as const;

export const faqs = [
  {
    q: 'What services does Henry offer?',
    a: 'We offer a range of solutions designed to meet your needs — whether you want to transform your home on a budget with something as simple as an accent wall, or you are looking to build the cottage of your dreams. We take care of every detail, so you never need another contractor.',
  },
  {
    q: 'How do I get started?',
    a: 'Getting started is simple. Reach out through our contact form or schedule a call — we will walk you through the next steps and answer any questions along the way.',
  },
  {
    q: 'What makes Henry different?',
    a: 'We believe you are not a customer — you are another human with a dream to make your house a home. We take pride in making that process not just stress-free, but memorable. We love the work we do, and it shows in every detail.',
  },
  {
    q: 'What does your process look like?',
    a: 'Four stages: first meeting, design, build, done. You can read the detail of each stage on our About page — but the short version is that we stay hands-on with your project from the first conversation to the final walkthrough.',
  },
  {
    q: 'Do you work from your own drawings, or can I bring an architect?',
    a: 'Both. Plenty of our work starts as a sketch on a kitchen table, and plenty arrives as a full architectural set. If your project needs stamped drawings or engineering, we will tell you early and help coordinate it.',
  },
  {
    q: 'How accurate is the Design Studio estimate?',
    a: 'It is a planning range, not a quote. It is built to tell you whether a project is in the neighbourhood of your budget before you spend time on drawings. Real numbers come after we walk the site — site access, foundations, servicing and finish choices move the total more than square footage does.',
  },
] as const;
