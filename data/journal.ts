/**
 * Real posts, written for the four regions this business actually builds
 * in (confirmed against the real Instagram bio: "London•Tobermory•Grand
 * bend•Muskoka"). No PLACEHOLDER flag here on purpose — unlike
 * testimonials.ts or furniture.ts, this content was supplied by Ryan
 * directly (blog 1.zip, then a second batch in blog2.zip — cost/market
 * pieces rather than per-region narrative posts), not invented to show
 * off the layout.
 *
 * Publish dates were not supplied with the source files — they're set
 * here to a plausible recent cadence. Update them to the real publish
 * dates if these ever go out through another channel first.
 *
 * Cover photos are licensed stock (Unsplash License — free for commercial
 * use, no attribution required), living in /public/journal/, not real HDB
 * job photos. That's a deliberate split from /public/portfolio/, which is
 * exclusively real completed work — these posts are commentary on regions
 * and costs, not a specific project, so a stock photo illustrating the
 * subject is honest where a portfolio photo would misleadingly imply "we
 * built this."
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
    slug: 'kitchen-renovation-costs-by-region',
    title: 'What Does a Kitchen Renovation Cost? A Regional Breakdown',
    excerpt:
      'Ontario baseline numbers for 2026, and what actually changes the price in London, Grand Bend, Tobermory and Muskoka.',
    date: '2026-08-30',
    category: 'Planning & budget',
    body: [
      {
        type: 'p',
        text: 'Kitchen renovation is consistently the project homeowners ask us about first — and consistently the one where cost expectations and reality are furthest apart. Here’s a realistic 2026 breakdown, along with what’s different about pricing a kitchen renovation in London versus Grand Bend, Tobermory, or Muskoka.',
      },
      { type: 'h2', text: 'Ontario Baseline Numbers' },
      {
        type: 'p',
        text: 'Before getting into regional differences, it helps to know the general Ontario ranges for 2026:',
      },
      {
        type: 'ul',
        items: [
          'Cosmetic refresh (new counters, backsplash, paint, hardware, no layout change): roughly $15,000–$25,000',
          'Mid-range renovation (new cabinets, countertops, flooring, some plumbing/electrical work): roughly $45,000–$65,000 for a standard 10’×12’ kitchen',
          'Full gut renovation (layout changes, custom cabinetry, premium finishes, moved plumbing): $80,000–$150,000+',
        ],
      },
      {
        type: 'p',
        text: 'Cabinetry and countertops typically make up close to half of a mid-range budget, and any work that moves plumbing or takes out a load-bearing wall adds a meaningful chunk on top — often $3,000–$8,000 for plumbing relocation and $8,000–$20,000+ for structural wall removal with engineering and permits included.',
      },
      { type: 'h2', text: 'London: Closest to Baseline Pricing' },
      {
        type: 'p',
        text: 'London tracks closest to the general Ontario mid-range numbers, since it has strong trade availability and reasonable material access. A typical mid-range kitchen renovation here lands in the $45,000–$65,000 range, with older character homes (Old North, Wortley Village) sometimes running higher due to plaster wall repairs, outdated wiring that needs upgrading, or non-standard room dimensions that rule out stock cabinetry.',
      },
      { type: 'h2', text: 'Grand Bend: Moisture and Seasonal-Use Considerations Add Cost' },
      {
        type: 'p',
        text: 'A Grand Bend kitchen renovation starts from similar baseline numbers but often lands 10–20% higher once you account for materials suited to a humid, lake-adjacent environment — better moisture-resistant cabinet construction, corrosion-resistant hardware, and ventilation upgrades. Cottages being converted from seasonal to year-round use also frequently need mechanical and insulation work bundled into the kitchen renovation, which pushes the effective project cost up even when the kitchen finishes themselves are mid-range.',
      },
      { type: 'h2', text: 'Tobermory: Remote Access Drives the Premium' },
      {
        type: 'p',
        text: 'Tobermory sees the widest gap between "sticker price" finishes and actual project cost, almost entirely due to logistics. Material delivery to the peninsula, limited local trade availability (meaning trades often travel from Owen Sound, Wiarton, or further), and rock conditions that can complicate any plumbing rerouting all add cost on top of the base renovation numbers. A mid-range kitchen renovation that might run $50,000 in London can often run 20–35% higher in Tobermory once travel time, delivery logistics, and scheduling around a short building season are factored in.',
      },
      { type: 'h2', text: 'Muskoka: Baseline Costs, Elevated Finish Expectations' },
      {
        type: 'p',
        text: 'Muskoka’s underlying labour and material costs aren’t dramatically different from the rest of cottage country, but finish expectations often are — many Muskoka kitchen renovations lean toward higher-end cabinetry, natural stone, and premium appliances that reflect the region’s luxury cottage market. It’s less that the same kitchen costs more here, and more that the "typical" Muskoka kitchen renovation is specified at a higher tier from the outset, often landing in the $80,000–$150,000+ range for a full renovation on a waterfront cottage.',
      },
      { type: 'h2', text: 'The Number That Actually Matters' },
      {
        type: 'p',
        text: 'Every range above is a starting point for budgeting conversations, not a quote. The only way to get a real number is a proper site visit — measuring the space, understanding what’s behind the walls, and talking through what finishes actually matter to you. That’s always where we start.',
      },
    ],
    closing: 'Thinking about a kitchen renovation in any of these areas? Let’s talk about what your space and your goals actually need.',
    cover: {
      src: '/journal/modern-kitchen-renovation.jpg',
      alt: 'A sleek modern kitchen with matte black cabinetry, a black island and pendant lighting',
    },
  },
  {
    slug: 'build-vs-renovate-costs',
    title: 'Build New or Renovate? What the 2026 Numbers Actually Say',
    excerpt:
      'Custom-build costs, renovation costs by scope, and the real decision factors behind Ontario’s current build-vs-renovate math.',
    date: '2026-08-29',
    category: 'Planning & budget',
    body: [
      {
        type: 'p',
        text: 'It’s one of the first questions almost every homeowner asks us: should I renovate what I have, or tear down and start fresh? The honest answer is that it depends on your existing structure, your goals, and your budget — but the current cost picture in Ontario makes the trade-offs clearer than they’ve been in a while.',
      },
      { type: 'h2', text: 'What a New Custom Build Costs in 2026' },
      {
        type: 'p',
        text: 'Custom home construction in Ontario is running roughly $300 to $600 per square foot for construction alone in most regions outside the GTA core, with mid-range quality builds commonly landing between $340 and $475 per square foot. That’s before land, permits, development charges, and site work — which typically add another 10 to 30 percent on top of the construction number, depending on the lot.',
      },
      {
        type: 'p',
        text: 'For a 2,500-square-foot home, that puts all-in construction costs somewhere between $750,000 and $1.5 million before you factor in the cost of the land itself — a number that varies enormously between a serviced London lot and a rural or waterfront property near Grand Bend, Tobermory, or Muskoka.',
      },
      { type: 'h2', text: 'What a Major Renovation Costs' },
      {
        type: 'p',
        text: 'A whole-home renovation is harder to put a single number on than new construction, because so much depends on what’s already there. As a rough planning guide:',
      },
      {
        type: 'ul',
        items: [
          'Cosmetic updates (finishes, fixtures, no structural changes): often $50–$150 per square foot',
          'Mid-scope renovations (some layout changes, updated systems): often $150–$300 per square foot',
          'Major renovations (structural changes, additions, full mechanical overhauls): can approach or exceed new-build costs per square foot, especially on older homes with unexpected structural or code-compliance surprises',
        ],
      },
      {
        type: 'p',
        text: 'That last point is the one that catches people off guard: a gut renovation on a century home with knob-and-tube wiring, no insulation, and a foundation that needs work can end up costing more per square foot than building new, once every system has to be brought up to current code.',
      },
      { type: 'h2', text: 'The Real Decision Factors' },
      {
        type: 'p',
        text: 'Cost per square foot is only part of the picture. The renovate-vs-build decision usually comes down to:',
      },
      {
        type: 'ul',
        items: [
          'Structural condition: a sound structure with good bones favours renovating. Significant foundation, framing, or moisture issues shift the math toward rebuilding.',
          'Lot restrictions: on tight urban lots or environmentally sensitive rural and waterfront lots (common around Tobermory and Muskoka), your existing footprint may have grandfathered rights that a new build wouldn’t retain.',
          'Emotional and family value: especially for cottages, the existing structure often carries decades of family history that a rebuild can’t replicate — this is a real factor, not just a sentimental one, and it belongs in the decision alongside the numbers.',
          'Timeline: renovations can sometimes be faster than a full build, though a major renovation with permits and structural work can take just as long as new construction.',
        ],
      },
      { type: 'h2', text: 'Getting a Real Number' },
      {
        type: 'p',
        text: 'Every one of these ranges is a planning tool, not a quote. The only way to know what your specific project will cost is a proper assessment of your existing structure (if there is one), your lot, and your goals. That’s the conversation worth having before you commit to either path.',
      },
    ],
    closing: 'Weighing renovating your current home or cottage against building new? Let’s look at your specific property and figure out which path actually makes sense.',
    cover: {
      src: '/journal/new-home-construction-framing.jpg',
      alt: 'A construction worker framing the roof of a new home under a clear blue sky',
    },
  },
  {
    slug: 'real-estate-snapshot-2026',
    title: 'Real Estate Snapshot 2026: London, Grand Bend, Tobermory & Muskoka',
    excerpt:
      'An honest look at where each of the four markets we build in actually stands, current as of mid-to-late 2026.',
    date: '2026-08-28',
    category: 'Market notes',
    body: [
      {
        type: 'p',
        text: 'If you’re weighing a renovation, a new build, or a move, it helps to understand what’s actually happening in each market. Here’s an honest look at where things stand across the four regions we build and renovate in, current as of mid-to-late 2026.',
      },
      { type: 'h2', text: 'London: A Stable, More Affordable Market' },
      {
        type: 'p',
        text: 'London has settled into a balanced-to-buyer’s market after a few volatile years. Average home prices have been sitting in the $600,000–$640,000 range through 2026, with the benchmark price closer to $555,000–$560,000 — both essentially flat to slightly down year over year. Listings have climbed noticeably, giving buyers more choice and more negotiating room than they’ve had in several years.',
      },
      {
        type: 'p',
        text: 'What this means for renovators: with resale prices stable and inventory up, a well-executed renovation is a reliable way to add value without waiting on price appreciation to do the work for you. It’s also a market where buyers are comparing move-in-ready homes against fixer-uppers, so a quality renovation can be the difference between a fast sale and a stale listing.',
      },
      { type: 'h2', text: 'Grand Bend: Correcting After a Pandemic Surge, Still Lake-Premium' },
      {
        type: 'p',
        text: 'Grand Bend prices pulled back somewhat through 2025, with average residential prices easing from the mid-$800,000s toward the current range, while listing prices for the broader market (including higher-end waterfront) can run well past $1 million. The area has permanently shifted from a purely seasonal market toward more year-round living, driven by remote-work flexibility and buyers who decided lake life could be their everyday life, not just a summer one.',
      },
      {
        type: 'p',
        text: 'What this means for renovators: with more owners converting seasonal cottages into full-time residences, insulation upgrades, four-season mechanical systems, and additions are in high demand. A property renovated for year-round comfort stands out in a market where buyers increasingly want exactly that.',
      },
      { type: 'h2', text: 'Tobermory: A Small, Thin Market Where Data Is Limited' },
      {
        type: 'p',
        text: 'Tobermory’s real estate market is genuinely small — often just a handful of active listings at any given time, with average asking prices in the $750,000 to $1.5 million range depending on waterfront access and lot size. Because so few properties trade in any given month, pricing here is less about broad trend lines and more about the specifics of each lot: shoreline, rock conditions, and access.',
      },
      {
        type: 'p',
        text: 'What this means for renovators: with limited turnover, most owners hold onto Tobermory properties for the long term rather than flipping them, which makes durability and long-term livability — not resale timing — the priority for most renovation and build decisions here.',
      },
      { type: 'h2', text: 'Muskoka: A Two-Speed Market' },
      {
        type: 'p',
        text: 'Muskoka’s cottage market has been correcting since its 2022 peak, with median waterfront prices easing into the $800,000–$950,000 range broadly, while the ultra-luxury tier on Lakes Muskoka, Rosseau, and Joseph continues to hold firm — average waterfront pricing on the "Big Three" lakes remains in the multi-million-dollar range. Inventory is elevated and properties are taking longer to sell than the historical norm, giving buyers real negotiating leverage outside the top tier.',
      },
      {
        type: 'p',
        text: 'What this means for renovators: in a market where buyers have more choice and more patience, a dated cottage competes poorly against a well-renovated one. At the same time, the luxury segment’s resilience shows that quality, character, and four-season capability continue to command a premium even when the broader market softens.',
      },
      { type: 'h2', text: 'The Common Thread' },
      {
        type: 'p',
        text: 'Across all four regions, 2026 buyers have more inventory, more time, and more negotiating power than they did a few years ago. That shifts the value proposition: a property that’s move-in ready, energy-efficient, and thoughtfully updated stands out far more in today’s market than it would have during the frantic bidding wars of 2021 and 2022. Whether you’re renovating to sell or to enjoy for years to come, quality work matters more in a patient market, not less.',
      },
    ],
    closing: 'Market data is general and changes month to month — if you’re weighing the value of a renovation against current conditions on your specific street or lake, we’re happy to talk through what we’re seeing locally.',
    cover: {
      src: '/journal/ontario-real-estate-aerial.jpg',
      alt: 'Aerial view of a dense residential neighbourhood of detached houses, streets and driveways',
    },
  },
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
      src: '/journal/muskoka-cottage-lake-dock.jpg',
      alt: 'Two Muskoka chairs on a wooden dock overlooking a calm lake at sunset',
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
      src: '/journal/bruce-peninsula-rocky-shoreline.jpg',
      alt: 'A stone cairn on the white dolomite rock shoreline of Georgian Bay near the Bruce Peninsula, turquoise water and forest behind it',
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
      src: '/journal/grand-bend-lake-huron-dunes.jpg',
      alt: 'Sandy dunes with beach grass overlooking Lake Huron under a partly cloudy sky',
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
      src: '/journal/london-ontario-character-home.jpg',
      alt: 'A blue Victorian-style character home with a wraparound covered porch on a leafy residential street',
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
