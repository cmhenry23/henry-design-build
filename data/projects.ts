/**
 * ────────────────────────────────────────────────────────────────
 * PORTFOLIO DATA
 * ────────────────────────────────────────────────────────────────
 * Every photo here came from the existing henrydb.ca portfolio.
 * The photos are real. The project NAMES, LOCATIONS, DATES, SCOPE
 * NOTES and SPEC LISTS were written from what is visible in each
 * photo — Ryan should correct anything that is wrong and fill in
 * the fields marked TODO.
 *
 * To add a project: copy a block, drop new photos into
 * /public/portfolio/, and add an entry to this array.
 */

export type ProjectCategory = 'Cottages & Cabins' | 'Kitchens' | 'Bathrooms' | 'Craft & Detail';

export const categories: ProjectCategory[] = [
  'Cottages & Cabins',
  'Kitchens',
  'Bathrooms',
  'Craft & Detail',
];

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  /** Portrait photos get a taller cell in the masonry grid. */
  portrait?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** TODO: confirm — inferred from the photos. */
  location: string;
  /** TODO: confirm — inferred from the photos. */
  year: string;
  summary: string;
  /** Two or three paragraphs telling the story of the build. */
  story: string[];
  /** Short spec rows shown in the project sidebar. */
  specs: { label: string; value: string }[];
  /** Pull-quote style highlights. */
  highlights: string[];
  cover: Photo;
  photos: Photo[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'cedar-sauna-cabin',
    title: 'The Cedar Sauna Cabin',
    category: 'Cottages & Cabins',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'A four-season cabin built from the gravel up — timber frame, cedar-lined sauna, log stair and loft. Framed, clad, wired and finished by the same hands.',
    story: [
      'This one started as a gravel pad and a stack of lumber in the trees. No sub-trades rotating through, no crew that changes every week — the same hands that squared the deck also hung the door and hand-peeled the log rail.',
      'The exterior went dark on purpose. Charcoal board cladding and a steep gable let the building disappear into the treeline in summer and read as a clean silhouette against snow in winter. Inside, the move reverses completely: wall-to-wall cedar, warm and bright, so the cabin feels twice its actual size.',
      'The sauna is the heart of it. Clear cedar benches, a long picture window aimed straight at the bush, and a slate floor that can take water forever. The log stair to the loft is the piece people stop and touch — full rounds notched and scribed on site, treads cantilevered off a single peeled post.',
    ],
    specs: [
      { label: 'Scope', value: 'Full build — foundation to finish' },
      { label: 'Structure', value: 'Timber frame + conventional stud walls' },
      { label: 'Cladding', value: 'Charcoal board cladding, steep gable roof' },
      { label: 'Interior', value: 'Clear cedar walls and ceiling throughout' },
      { label: 'Feature', value: 'Cedar sauna, log stair, sleeping loft' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Hand-peeled and scribed log stair and railing',
      'Cedar sauna with full-width picture window',
      'Large-format slate flooring on a heated wet-area build-up',
      'Site-milled cedar window jambs and sills',
    ],
    cover: {
      src: '/portfolio/cabin-exterior-dusk.jpg',
      alt: 'Dark charcoal-clad cabin with a steep gable roof and a white craftsman door, photographed at dusk in the trees',
      caption: 'Charcoal cladding and a steep gable — the cabin at blue hour.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/cabin-exterior-dusk.jpg',
        alt: 'Dark charcoal-clad cabin with steep gable roof and white craftsman door at dusk',
        caption: 'Charcoal cladding and a steep gable — the cabin at blue hour.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-sauna-benches.jpg',
        alt: 'Cedar sauna interior with two-tier benches and a long horizontal window looking onto snowy woods',
        caption: 'Clear cedar benches and a window aimed straight at the bush.',
      },
      {
        src: '/portfolio/cabin-log-stair.jpg',
        alt: 'Cedar-lined room with log treads cantilevered off a single peeled post above a slate floor',
        caption: 'Treads cantilevered off one peeled post — no stringer, no visible steel.',
      },
      {
        src: '/portfolio/cabin-log-railing.jpg',
        alt: 'Close view of a log railing with peeled rails and dark-stained balusters against cedar walls',
        caption: 'Peeled rails against blackened balusters. Every joint scribed on site.',
      },
      {
        src: '/portfolio/cabin-loft.jpg',
        alt: 'Sleeping loft with wide-plank floors, cedar cathedral ceiling and a log railing',
        caption: 'The loft — wide plank floors under a cedar cathedral ceiling.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-window-trim.jpg',
        alt: 'Cedar window with a deep site-built jamb and sill, hand tools resting on the sill',
        caption: 'Deep cedar jambs and a sill thick enough to sit on.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-stone-fireplace.jpg',
        alt: 'Fieldstone fireplace surround with a hand-hewn blackened mantel against a cedar wall',
        caption: 'Fieldstone surround under a hand-hewn, blackened mantel.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-slate-floor.jpg',
        alt: 'Large-format dark slate tile floor',
        caption: 'Large-format slate — built to take water for the life of the building.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-framing.jpg',
        alt: 'Framed wall standing on a new deck on a gravel pad in the woods, with a dog resting nearby',
        caption: 'Day one on the pad. The site supervisor took his role seriously.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-timber-frame.jpg',
        alt: 'Timber frame cabin shell with roof sheathing on, ladders leaning against it, surrounded by evergreens',
        caption: 'Frame up and sheathed, chasing the weather.',
        portrait: true,
      },
    ],
    featured: true,
  },
  {
    slug: 'forest-kitchen',
    title: 'The Forest Kitchen',
    category: 'Kitchens',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'A closed-off galley opened into one long room — island, dining, and a hidden coffee pantry, all pointed at the window and the trees behind it.',
    story: [
      'The original layout wasted the best thing the house had: a window with nothing but forest behind it. We took the wall out, ran the working counter along the glass, and put the sink where you actually want to stand.',
      'Deep grey shaker doors, honed quartz with a soft grey vein, and matte black hardware do the heavy lifting. The tile is a hand-glazed thin brick — the slight waver in the glaze is the point, and it is why the wall reads warm instead of clinical under the pot lights.',
      'Around the corner, the butler’s pantry takes the countertop clutter out of the main room. Walnut floating shelves, LED strip tucked in the front edge, and enough landing space that the coffee maker and the mixer never have to move.',
    ],
    specs: [
      { label: 'Scope', value: 'Full gut and rebuild, wall removal' },
      { label: 'Cabinetry', value: 'Deep grey shaker, full-height pantry wall' },
      { label: 'Counters', value: 'Honed quartz, waterfall-free square edge' },
      { label: 'Backsplash', value: 'Hand-glazed thin brick, full height' },
      { label: 'Flooring', value: 'Wide-plank maple, site finished' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Load-bearing wall removed and beam concealed in the ceiling',
      'Butler’s pantry with integrated LED under walnut shelving',
      'Induction cooktop with a concealed-liner chimney hood',
      'Wide-plank maple flooring run continuously through both rooms',
    ],
    cover: {
      src: '/portfolio/kitchen-galley.jpg',
      alt: 'Long grey shaker kitchen with quartz island, pendant lights and a window onto forest',
      caption: 'The working run moved to the glass. The island does the rest.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/kitchen-galley.jpg',
        alt: 'Long grey shaker kitchen with quartz island, glass pendants, black hardware and a forest window',
        caption: 'The working run moved to the glass. The island does the rest.',
        portrait: true,
      },
      {
        src: '/portfolio/kitchen-dining.jpg',
        alt: 'Open kitchen and dining room with a long maple table, dark leather chairs and a chimney hood',
        caption: 'One room now. The wall that used to split these two is gone.',
        portrait: true,
      },
      {
        src: '/portfolio/kitchen-hood-run.jpg',
        alt: 'Kitchen counter run with black chimney hood, induction cooktop, black apron sink and thin brick tile',
        caption: 'Induction, a black apron sink, and thin brick run wall to ceiling.',
        portrait: true,
      },
      {
        src: '/portfolio/kitchen-pantry-nook.jpg',
        alt: 'Butler pantry coffee nook with walnut floating shelves, LED strip lighting and glossy white tile',
        caption: 'The pantry nook — where the counter clutter goes to live.',
        portrait: true,
      },
      {
        src: '/portfolio/kitchen-maple-floor.jpg',
        alt: 'Close view of wide-plank maple hardwood flooring with natural character marks',
        caption: 'Wide-plank maple, character grade. The marks are why we chose it.',
        portrait: true,
      },
    ],
    featured: true,
  },
  {
    slug: 'aubergine-bath',
    title: 'The Aubergine Bath',
    category: 'Bathrooms',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'A small bathroom that stopped apologising for being small. Deep plum walls, reeded glass, book-matched marble-look porcelain and a fluted vanity.',
    story: [
      'Small bathrooms usually get painted white in the hope they will feel bigger. They don’t — they just feel like small white bathrooms. So we went the other way.',
      'Deep aubergine on the walls, large-format marble-look porcelain wrapping the tub surround and the floor, and reeded glass on the tub enclosure to hold the light without showing the whole room at once. The fluted vanity in muted green and the ribbed glass shades pick up the same vertical rhythm.',
      'Underneath all of it is the part nobody photographs: cement board, banded seams and a properly built waterproof envelope, with the niche framed and sealed before a single tile went on. That is the difference between a bathroom that lasts five years and one that lasts twenty-five.',
    ],
    specs: [
      { label: 'Scope', value: 'Full gut to studs, new waterproofing' },
      { label: 'Walls', value: 'Deep aubergine, satin finish' },
      { label: 'Tile', value: 'Large-format marble-look porcelain, floor and surround' },
      { label: 'Enclosure', value: 'Reeded glass with matte black hardware' },
      { label: 'Vanity', value: 'Fluted front, integrated quartz top' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Full cement-board and banded-seam waterproofing envelope',
      'Recessed shower niche framed, sealed and tiled seamlessly',
      'Reeded glass enclosure and matched ribbed lighting',
      'Large-format porcelain with minimal grout lines',
    ],
    cover: {
      src: '/portfolio/bath-aubergine-vanity.jpg',
      alt: 'Deep plum bathroom with reeded glass tub enclosure, fluted green vanity and ribbed glass wall lights',
      caption: 'Plum walls, reeded glass, fluted vanity. Small, and not sorry about it.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/bath-aubergine-vanity.jpg',
        alt: 'Deep plum bathroom with reeded glass tub enclosure, fluted green vanity, ribbed glass lights and a large mirror',
        caption: 'Plum walls, reeded glass, fluted vanity. Small, and not sorry about it.',
        portrait: true,
      },
      {
        src: '/portfolio/bath-aubergine-marble.jpg',
        alt: 'Marble-look porcelain tile floor and tub surround with reeded glass and a frosted window',
        caption: 'Large-format porcelain, minimal grout, book-matched at the corner.',
        portrait: true,
      },
      {
        src: '/portfolio/bath-guest-waterproofing.jpg',
        alt: 'Bathroom wall in progress showing cement board, banded seams and a framed recessed niche',
        caption: 'The part nobody photographs — and the part that decides how long it lasts.',
        portrait: true,
      },
    ],
  },
  {
    slug: 'guest-bath-reset',
    title: 'The Guest Bath Reset',
    category: 'Bathrooms',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'A tired guest bath and adjoining room taken back to studs and rebuilt bright, square and durable — on a budget that stayed put.',
    story: [
      'Not every project is a showpiece. This one was a straightforward brief: make the guest bath clean, bright and dead square, and don’t spend money where it won’t show.',
      'So the budget went into the things you can’t redo later — new waterproofing, a properly framed and sealed niche, level floors and real tile prep — and the visible finishes stayed simple. A white shaker vanity, brushed nickel, soft grey plank-look floor tile, and a warm off-white subway running the full height of the surround.',
      'The result is a room that will still look right in fifteen years, and a client who spent their money on the parts that mattered.',
    ],
    specs: [
      { label: 'Scope', value: 'Guest bath + adjoining room, gut and rebuild' },
      { label: 'Vanity', value: 'White shaker with quartz top' },
      { label: 'Tile', value: 'Grey plank-look floor, warm subway surround' },
      { label: 'Fixtures', value: 'Brushed nickel throughout' },
      { label: 'Focus', value: 'Substrate, waterproofing and levelling' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Budget concentrated in substrate and waterproofing',
      'Recessed niche framed and sealed before tile',
      'Floors levelled and squared before finish work',
      'Simple, durable finishes chosen to age well',
    ],
    cover: {
      src: '/portfolio/bath-guest-vanity.jpg',
      alt: 'Bright renovated bathroom with a white shaker vanity, grey tile floor and warm subway tile shower',
      caption: 'Bright, square, and built to be boring in the best way.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/bath-guest-vanity.jpg',
        alt: 'Bright renovated bathroom with white shaker vanity, grey plank tile floor and warm subway tile shower surround',
        caption: 'Bright, square, and built to be boring in the best way.',
        portrait: true,
      },
      {
        src: '/portfolio/bath-guest-waterproofing.jpg',
        alt: 'Cement board wall with taped seams and a framed recessed shower niche before tiling',
        caption: 'Niche framed and sealed. Tile is the easy part.',
        portrait: true,
      },
    ],
  },
  {
    slug: 'hand-hewn-mantel',
    title: 'The Hand-Hewn Mantel',
    category: 'Craft & Detail',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'One beam, a jack plane, a slick and an afternoon. The mantel that ended up over the cabin fireplace.',
    story: [
      'A mantel is the kind of thing you can buy for two hundred dollars and nobody will ever look at twice. Or you can make one.',
      'This started as a rough timber on a pair of sawhorses. The face was hewn by hand with a slick and a chisel so the scallops catch light unevenly, then blackened and burnished so the texture reads from across the room while the top stays clean and flat enough to set something on.',
      'It is not the most expensive thing in that cabin. It is the thing everyone puts their hand on.',
    ],
    specs: [
      { label: 'Scope', value: 'One-off hand-hewn mantel' },
      { label: 'Method', value: 'Hand-hewn with slick and chisel' },
      { label: 'Finish', value: 'Blackened and burnished face, natural top' },
      { label: 'Installed', value: 'Cedar Sauna Cabin fireplace' },
    ],
    highlights: [
      'Hewn entirely by hand — no router, no texture roller',
      'Blackened face against a clean natural top edge',
      'Sized and scribed to the fieldstone surround on site',
    ],
    cover: {
      src: '/portfolio/mantel-hand-hewn.jpg',
      alt: 'A blackened hand-hewn timber mantel on sawhorses surrounded by hand tools, a level and wood shavings',
      caption: 'Hand plane, slick, level, and a lot of shavings.',
    },
    photos: [
      {
        src: '/portfolio/mantel-hand-hewn.jpg',
        alt: 'Blackened hand-hewn timber mantel on sawhorses surrounded by hand tools, a level and wood shavings',
        caption: 'Hand plane, slick, level, and a lot of shavings.',
      },
      {
        src: '/portfolio/cabin-stone-fireplace.jpg',
        alt: 'The finished mantel installed above a fieldstone fireplace against a cedar wall',
        caption: 'Installed. Scribed to the stone, no gaps, no caulk line.',
        portrait: true,
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Every photo across every project, for the "All work" masonry view. */
export function allPhotos() {
  return projects.flatMap((p) =>
    p.photos.map((photo) => ({ ...photo, project: p.title, slug: p.slug, category: p.category }))
  );
}
