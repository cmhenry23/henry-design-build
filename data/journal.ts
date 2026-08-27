/**
 * Real posts, written for the four regions this business actually builds
 * in (confirmed against the real Instagram bio: "London•Tobermory•Grand
 * bend•Muskoka"). No PLACEHOLDER flag here on purpose — unlike
 * testimonials.ts or furniture.ts, this content was supplied by Ryan
 * directly (blog 1.zip), not invented to show off the layout.
 *
 * Publish dates were not supplied with the source files — they're set
 * here to a plausible recent cadence. Update them to the real publish
 * dates if these ever go out through another channel first.
 */

export type JournalBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string. */
  date: string;
  category: string;
  body: JournalBlock[];
  cover: { src: string; alt: string };
  /** Sign-off line, shown set apart from the body. */
  closing: string;
}

export const journalPosts: JournalPost[] = [
  {
    slug: 'renovating-a-muskoka-cottage',
    title: 'Renovating a Muskoka Cottage: Honouring the Past While Building for the Future',
    excerpt:
      'Balancing four-season comfort with the details — the stone fireplace, the knotty pine — that make a family cottage worth keeping.',
    date: '2026-08-26',
    category: 'Renovations',
    body: [
      {
        type: 'p',
        text: 'Muskoka cottages carry a lot of history — many have been in the same family for generations, passed down along with decades of memories on the dock. Renovating one of these properties is a balancing act: respecting what makes the place special while bringing it up to the standard today’s owners expect.',
      },
      { type: 'h2', text: 'The Classic Muskoka Renovation Challenge' },
      {
        type: 'p',
        text: 'Older Muskoka cottages were often built for summer use only — thin walls, minimal insulation, small windows, and modest kitchens designed for a simpler era of cottage life. Today’s owners increasingly want:',
      },
      {
        type: 'ul',
        items: [
          'Four-season capability, so the cottage can be used well beyond the July long weekend',
          'Larger, more open living spaces that still feel like a cottage, not a suburban home transplanted to the lake',
          'Updated kitchens and bathrooms without losing the knotty pine, stone fireplaces, and other details that make the place feel like this cottage',
          'Better water access and outdoor living, from boathouses to expanded docks to screened Muskoka rooms',
        ],
      },
      { type: 'h2', text: 'Structural Realities of Older Cottages' },
      {
        type: 'p',
        text: 'Many Muskoka properties are built on rock, with foundations and additions layered on over decades by different builders with different standards. A thorough structural assessment before renovating is essential — what looks like a simple addition can turn into a much bigger project once you understand what the existing structure can actually support.',
      },
      { type: 'h2', text: 'Respecting Muskoka’s Character' },
      {
        type: 'p',
        text: 'Renovating in Muskoka isn’t just a technical exercise. Owners are often deeply attached to specific details — a stone fireplace built by a grandfather, original wood panelling, a particular view from the porch. A good renovation partner listens to what actually matters to the family before reaching for a sledgehammer, and finds ways to modernize systems and comfort without erasing what made the cottage worth keeping in the first place.',
      },
      { type: 'h2', text: 'Common Muskoka Projects' },
      {
        type: 'ul',
        items: [
          'Converting a three-season cottage to full four-season use',
          'Boathouse renovations and rebuilds',
          'Additions that expand living and sleeping space while matching the existing style',
          'Kitchen and bathroom updates that respect a cottage’s original character',
        ],
      },
      { type: 'h2', text: 'Building for the Next Generation' },
      {
        type: 'p',
        text: 'The best Muskoka renovations aren’t just about today’s comfort — they’re about setting the property up so it can be passed down and enjoyed for another generation. That takes a builder who understands both the technical realities of older lakeside construction and the emotional weight these places carry for the families who own them.',
      },
    ],
    closing: 'Have a family cottage in Muskoka that needs some love? Let’s talk about what’s possible.',
    cover: {
      src: '/portfolio/real-fireplace-mantel.jpg',
      alt: 'A fieldstone fireplace with a hand-hewn timber mantel',
    },
  },
  {
    slug: 'building-on-the-bruce-peninsula',
    title: 'Building on the Bruce Peninsula: What Makes a Tobermory Project Different',
    excerpt:
      'Rock, remote access and environmental protections make a Bruce Peninsula build its own kind of project.',
    date: '2026-08-12',
    category: 'Site & foundation',
    body: [
      {
        type: 'p',
        text: 'Tobermory sits at the tip of the Bruce Peninsula, and building here is a different exercise than building almost anywhere else in southwestern Ontario. Between the rock, the remote access, and the region’s environmental protections, a Tobermory project takes a builder who’s prepared for the specifics of the area.',
      },
      { type: 'h2', text: 'Building on the Escarpment' },
      {
        type: 'p',
        text: 'The Bruce Peninsula sits on the Niagara Escarpment, which means shallow soil over limestone bedrock in many areas. This changes how foundations get designed and built — blasting or specialized footing systems are sometimes needed where a standard basement dig isn’t possible. Knowing what’s under a lot before you finalize a design saves significant cost and time surprises later.',
      },
      { type: 'h2', text: 'Access and Logistics' },
      {
        type: 'p',
        text: 'Many properties around Tobermory are on rural roads, private lanes, or waterfront lots with limited access. Material delivery, equipment access, and trade scheduling all need to be planned around this — a project timeline here isn’t the same as a timeline for a lot in town with a paved driveway and easy truck access.',
      },
      { type: 'h2', text: 'Environmental Considerations' },
      {
        type: 'p',
        text: 'The Bruce Peninsula includes environmentally protected areas, and lots near the escarpment, wetlands, or shoreline may fall under additional conservation authority approvals on top of standard municipal permitting. This is worth understanding at the very start of a project, since it can affect where a building can be sited on a lot and how long approvals take.',
      },
      { type: 'h2', text: 'What People Build in Tobermory' },
      {
        type: 'ul',
        items: [
          'Off-grid or partially off-grid cottages designed for seasonal or year-round use',
          'Rock-and-timber builds that lean into the peninsula’s natural landscape rather than fighting it',
          'Smaller, efficient footprints on lots where the buildable area is limited by rock or setbacks',
          'Renovations to older cottages that need better insulation and updated systems for shoulder-season or winter use',
        ],
      },
      { type: 'h2', text: 'A Builder Who Knows the Peninsula' },
      {
        type: 'p',
        text: 'Building in Tobermory rewards a builder who has actually worked with the peninsula’s rock, remoteness, and regulatory layers — not one applying a standard southern Ontario build process to a very different site. If you’re considering a project up here, the conversation should start with a proper look at the lot itself.',
      },
    ],
    closing: 'Have a lot on the peninsula? We can help you understand what it will take to build there.',
    cover: {
      src: '/portfolio/real-log-stair.jpg',
      alt: 'Hand-peeled log stair with treads cantilevered off a single scribed post against a cedar wall',
    },
  },
  {
    slug: 'building-a-cottage-in-grand-bend',
    title: 'Building a Cottage in Grand Bend: Sand, Sun, and Smart Design',
    excerpt:
      'Sandy soil, lake wind and sun exposure all shape what makes a Grand Bend build actually hold up.',
    date: '2026-07-29',
    category: 'Cottage building',
    body: [
      {
        type: 'p',
        text: 'Grand Bend draws people for the beach, the sunsets over Lake Huron, and the laid-back cottage-town feel — but building a home or cottage here means designing for a very specific environment. Sandy soil, lake wind, and seasonal use all shape the decisions that go into a well-built Grand Bend property.',
      },
      { type: 'h2', text: 'Designing for the Lake' },
      { type: 'p', text: 'A Grand Bend build is different from an inland home in a few key ways:' },
      {
        type: 'ul',
        items: [
          'Wind and sun exposure: west-facing lake views mean incredible sunsets, but also strong prevailing winds and intense afternoon sun. Overhangs, covered porches, and window placement all need to account for this.',
          'Sandy soil conditions: much of the Grand Bend area sits on sandy, well-draining soil, which affects foundation design and requires a builder who understands local ground conditions rather than applying a generic approach.',
          'Moisture and humidity: lakeside living means more exposure to moisture. Material choices — from exterior cladding to interior finishes — need to hold up over years of humid summers and freeze-thaw winters.',
        ],
      },
      { type: 'h2', text: 'Year-Round vs. Seasonal Use' },
      {
        type: 'p',
        text: 'Many Grand Bend properties started as seasonal cottages and are now being converted into year-round homes, while others are being built new with four-season living in mind from the start. That decision affects almost everything: insulation levels, heating systems, window performance, and even how you plan for winterizing plumbing if the home won’t be occupied through the coldest months.',
      },
      { type: 'h2', text: 'Popular Grand Bend Projects' },
      {
        type: 'ul',
        items: [
          'New cottage builds designed to maximize lake views while managing wind exposure',
          'Additions that expand a modest existing cottage into a full-time residence',
          'Open-concept renovations that bring more natural light and better sightlines to the water',
          'Outdoor living spaces — decks, screened porches, and outdoor kitchens built for beach-town entertaining',
        ],
      },
      { type: 'h2', text: 'Building With the Long Game in Mind' },
      {
        type: 'p',
        text: 'A cottage or home in Grand Bend needs to be built for the environment it’s actually in, not a generic build plan. Working with a builder who’s spent time in the region — and understands how sand, wind, and lake moisture affect construction decisions — makes a real difference in how the home performs ten and twenty years down the road.',
      },
    ],
    closing: 'Planning a build near the lake? Let’s talk about what your Grand Bend property needs.',
    cover: {
      src: '/portfolio/real-cabin-exterior.jpg',
      alt: 'A dark board-and-batten cabin exterior with a light blue door, photographed at dusk',
    },
  },
  {
    slug: 'renovating-your-london-home',
    title: 'Renovating Your London Home: What to Know Before You Start',
    excerpt:
      'Character homes, permits, and what to expect renovating in Old North, Wortley Village and beyond.',
    date: '2026-07-15',
    category: 'Renovations',
    body: [
      {
        type: 'p',
        text: 'London, Ontario is full of character homes — from the century-old properties in Old North and Wortley Village to the mid-century bungalows spread across the city’s established neighbourhoods. That character is part of what makes London great, but it also means renovation projects here come with their own set of quirks.',
      },
      { type: 'h2', text: 'Know Your Home’s Era Before You Plan' },
      {
        type: 'p',
        text: 'A 1920s character home in Old North and a 1960s bungalow in Byron are going to behave very differently once you open up a wall. Older London homes often have plaster walls, knob-and-tube wiring remnants, or original brick that’s worth preserving rather than covering up. Newer post-war homes tend to have more straightforward mechanical systems but may need updated insulation to meet today’s comfort standards.',
      },
      {
        type: 'p',
        text: 'Before any renovation, it’s worth having a builder walk through with you to flag what’s original, what’s already been touched, and what surprises might be hiding behind the drywall. This isn’t about scaring you off a project — it’s about budgeting realistically from day one.',
      },
      { type: 'h2', text: 'Permits and the City of London' },
      {
        type: 'p',
        text: 'Renovation permits in London are typically required for structural changes, additions, new electrical or plumbing work, and anything that changes the footprint of your home. Kitchen refreshes and cosmetic updates usually don’t need one, but a kitchen renovation that moves plumbing or knocks out a wall usually does. A good builder handles this process for you, but it’s worth understanding upfront so your timeline accounts for it — permit review can add a few weeks depending on the scope.',
      },
      { type: 'h2', text: 'Popular Renovation Projects We See in London' },
      {
        type: 'ul',
        items: [
          'Kitchen renovations that open sightlines into adjoining living spaces, especially in older homes with more closed-off floor plans',
          'Basement finishing, turning underused space into a family room, home office, or secondary suite',
          'Second-storey additions on bungalows where the lot doesn’t allow for a horizontal addition',
          'Whole-home updates on older character homes that preserve original details (trim, hardwood, brick) while modernizing kitchens, bathrooms, and mechanicals',
        ],
      },
      { type: 'h2', text: 'Working With a Local Builder' },
      {
        type: 'p',
        text: 'Renovating isn’t just about the finished look — it’s about a builder who understands London’s housing stock, has relationships with local trades and suppliers, and can navigate the city’s permitting process without adding months to your timeline. If you’re just starting to think through a renovation, the best first step is a conversation about your space, your goals, and what’s realistic for your budget and timeline.',
      },
    ],
    closing: 'Thinking about a renovation in London? We’d love to talk through your project.',
    cover: {
      src: '/portfolio/real-kitchen-dining.jpg',
      alt: 'Open kitchen and dining room with a live-edge table, leather chairs and pendant lighting over the island',
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
