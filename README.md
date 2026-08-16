# Henry Design Build — new website

A rebuild of [henrydb.ca](https://www.henrydb.ca) with three things the current
Squarespace site doesn't have:

1. **A real portfolio** — the 20 existing photos organised into five documented
   projects with stories, spec sheets, filtering, a photo wall and a lightbox,
   instead of an unlabelled image grid.
2. **A testimonials section** — built, styled and wired up, currently holding
   clearly-marked placeholders.
3. **The Design Studio** — a project configurator that draws a live sketch as
   visitors choose, produces a planning budget range, and emails the whole
   concept to Ryan.

Built with Next.js 14 (App Router), TypeScript and Tailwind. Fully static —
every page prerenders, so it can be hosted anywhere for essentially nothing.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3111.

Other commands:

```bash
npm run build
```

```bash
npm run typecheck
```

---

## ⚠ Before this goes live

Three things in this repo are **placeholders** and must be dealt with. Each one
shows a visible warning on the site until it's handled, so nothing ships by
accident.

### 1. Testimonials are invented examples

`data/testimonials.ts`

The five quotes are examples written to show the layout. They are **not real
client reviews**. Publishing invented reviews on a live business site misleads
customers and is prohibited under Canada's Competition Act.

Either replace them with real, permissioned quotes and set
`PLACEHOLDER = false`, or empty the array — the section hides itself when
there's nothing real to show.

### 2. Budget rates are guesses, not Ryan's numbers

`lib/estimate.ts`

The per-square-foot rates were seeded from published 2026 Ontario cost guides
($300–$600+/sq ft custom, $350–$500 three-season cottage, $500–$800+ four-season,
$900–$1,200+ estate). **They are not from Ryan's jobs.**

To fix: take the last three to five completed projects, divide the final invoice
by finished square footage, and put those numbers into the `rate` field of each
entry in `BUILD_TYPES`. Then check the tool against a project you've already
finished — if a known job doesn't land inside the range the tool produces, the
tool is wrong and it will cost you trust. Once it's right, set
`PLACEHOLDER_PRICING = false`.

The UI always presents the output as a range and always labels it a planning
estimate rather than a quote. Keep it that way.

### 3. Business details and project facts need confirming

- `data/site.ts` — email, phone and **service area** are marked `TODO`. The
  phone link disappears automatically while `phone` is an empty string.
- `data/projects.ts` — every project's **name, location, year and duration** was
  written from what's visible in the photos. Ryan should correct anything wrong
  and fill in the `TODO` fields.
- `app/about/page.tsx` — the About page currently uses a job photo where a
  portrait of Ryan should go. A photo of the person is the highest-converting
  image on that page.

---

## Structure

```
app/
  page.tsx                  Home
  portfolio/page.tsx        Portfolio index — filters + two view modes
  portfolio/[slug]/page.tsx Project case study (statically generated)
  visualizer/page.tsx       Design Studio
  about/  faq/  contact/
  sitemap.ts  robots.ts  not-found.tsx

components/
  SiteHeader / SiteFooter   Navigation and footer
  PortfolioBrowser          Filtering, case-study and photo-wall views
  ProjectGallery            Per-project masonry gallery
  Lightbox                  Keyboard-navigable photo viewer
  Testimonials              Rotating quotes with placeholder guard
  ContactForm               Enquiry form (see note below)
  visualizer/
    Configurator            All the controls plus the estimate panel
    CabinPreview            The live SVG sketch — pure SVG, no libraries

data/
  site.ts                   Business details, nav, services, process, FAQs
  projects.ts               Portfolio content
  testimonials.ts           Testimonial content

lib/
  estimate.ts               Rates, multipliers, add-ons, the calculation

public/portfolio/           The 20 photos, renamed descriptively
```

## Adding a project

1. Drop the photos into `public/portfolio/`.
2. Copy an existing block in `data/projects.ts` and fill it in.

That's it — the portfolio page, filters, counts, sitemap and "next project"
links all pick it up automatically.

## The contact form

`components/ContactForm.tsx` has no server behind it. On submit it opens the
visitor's own email client with everything pre-filled. That works on day one
with zero infrastructure and zero cost, but it depends on them having a mail
client set up and you get no record of submissions.

When you want real delivery, sign up for Formspree, Resend or Basin and replace
the body of `handleSubmit` with a POST to their endpoint. The field names are
already set up for it.

## Deploying

Push to GitHub, import the repo at [vercel.com/new](https://vercel.com/new), and
accept the defaults — Vercel detects Next.js automatically. No environment
variables are needed. Then point the `henrydb.ca` DNS at Vercel and cancel the
Squarespace plan.

Update `site.url` in `data/site.ts` if the domain ever changes; it feeds the
sitemap and social metadata.

## Photo credit

All 20 photographs are Henry Design Build's own work, taken from the existing
henrydb.ca portfolio.
