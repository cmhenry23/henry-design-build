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
    title: 'The Cabin',
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
      src: '/portfolio/real-cabin-exterior.jpg',
      alt: 'Dark board-and-batten cabin exterior with a light blue craftsman door, photographed at dusk',
      caption: 'Dark cladding, a bright blue door — the cabin at dusk.',
    },
    photos: [
      {
        src: '/portfolio/real-cabin-exterior.jpg',
        alt: 'Dark board-and-batten cabin exterior with a light blue craftsman door at dusk',
        caption: 'Dark cladding, a bright blue door — the cabin at dusk.',
      },
      {
        src: '/portfolio/real-log-stair.jpg',
        alt: 'Hand-peeled log stair with treads cantilevered off a single scribed post against a cedar wall',
        caption: 'Treads cantilevered off one peeled post — no stringer, no visible steel.',
        portrait: true,
      },
      {
        src: '/portfolio/real-fireplace-mantel.jpg',
        alt: 'Fieldstone fireplace surround with a hand-hewn blackened mantel against a cedar wall',
        caption: 'Fieldstone surround under a hand-hewn, blackened mantel.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-sauna-benches.jpg',
        alt: 'Cedar sauna interior with two-tier benches and a long horizontal window looking onto snowy woods',
        caption: 'Clear cedar benches and a window aimed straight at the bush.',
      },
      {
        src: '/portfolio/cabin-loft.jpg',
        alt: 'Sleeping loft with wide-plank floors, cedar cathedral ceiling and a log railing',
        caption: 'The loft — wide plank floors under a cedar cathedral ceiling.',
        portrait: true,
      },
      {
        src: '/portfolio/cabin-slate-floor.jpg',
        alt: 'Large-format dark slate tile floor',
        caption: 'Large-format slate — built to take water for the life of the building.',
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
      'Dark grey shaker doors, white quartz with a soft vein, and matte black hardware do the heavy lifting. A full-height white subway tile keeps the wall bright without competing with the cabinetry.',
      'Around the corner, a butler’s pantry takes the countertop clutter out of the main room — grey cabinetry, a beverage fridge, and enough landing space that the coffee maker and the mixer never have to move.',
    ],
    specs: [
      { label: 'Scope', value: 'Full gut and rebuild, wall removal' },
      { label: 'Cabinetry', value: 'Dark grey shaker, full-height pantry wall' },
      { label: 'Counters', value: 'White quartz, waterfall-free square edge' },
      { label: 'Backsplash', value: 'White subway tile, full height' },
      { label: 'Flooring', value: 'Wide-plank hardwood, site finished' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Load-bearing wall removed and beam concealed in the ceiling',
      'Butler’s pantry with a built-in beverage fridge',
      'Full-height subway tile from counter to ceiling',
      'Wide-plank flooring run continuously through both rooms',
    ],
    cover: {
      src: '/portfolio/real-kitchen-island.jpg',
      alt: 'Dark grey shaker kitchen with a white quartz island, pendant lights and an apron sink',
      caption: 'The island does the heavy lifting — apron sink, seating, storage.',
    },
    photos: [
      {
        src: '/portfolio/real-kitchen-island.jpg',
        alt: 'Dark grey shaker kitchen with a white quartz island, pendant lights and an apron sink',
        caption: 'The island does the heavy lifting — apron sink, seating, storage.',
      },
      {
        src: '/portfolio/real-kitchen-cabinets.jpg',
        alt: 'Dark shaker cabinetry with a black chimney hood over an induction cooktop and white subway tile backsplash',
        caption: 'A black hood and full-height subway tile do the rest.',
      },
      {
        src: '/portfolio/real-kitchen-dining.jpg',
        alt: 'Open kitchen and dining room with a live-edge table, leather chairs and pendant lighting over the island',
        caption: 'One room now. The wall that used to split these two is gone.',
        portrait: true,
      },
      {
        src: '/portfolio/real-kitchen-sink-window.jpg',
        alt: 'Dark apron-front sink under a window looking onto forest, with a black chimney hood behind',
        caption: 'The sink went where you actually want to stand — at the glass.',
      },
      {
        src: '/portfolio/real-kitchen-pantry.jpg',
        alt: 'Butler pantry with grey cabinetry, a built-in beverage fridge and a subway-tile backsplash',
        caption: 'The pantry nook — where the counter clutter goes to live.',
      },
      {
        src: '/portfolio/real-kitchen-nook-shelf.jpg',
        alt: 'Floating wood shelves over a coffee station, backed by white tile with integrated lighting',
        caption: 'Floating shelves, tucked lighting, a landing spot for the coffee maker.',
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
      src: '/portfolio/real-bath-aubergine-full.jpg',
      alt: 'Deep plum bathroom with a dark vanity, reeded glass tub enclosure and warm vanity lighting',
      caption: 'Plum walls, reeded glass, a dark vanity. Small, and not sorry about it.',
    },
    photos: [
      {
        src: '/portfolio/real-bath-aubergine-full.jpg',
        alt: 'Deep plum bathroom with a dark vanity, reeded glass tub enclosure and warm vanity lighting',
        caption: 'Plum walls, reeded glass, a dark vanity. Small, and not sorry about it.',
      },
      {
        src: '/portfolio/real-bath-aubergine-tub.jpg',
        alt: 'Reeded glass tub enclosure beside a dark vanity in a deep plum bathroom',
        caption: 'The tub and the vanity, sharing one wall of aubergine.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-aubergine-shower.jpg',
        alt: 'Marble-look tile tub surround with matte black fixtures and a frosted window',
        caption: 'Marble-look tile, matte black fixtures, a frosted window onto the yard.',
        portrait: true,
      },
    ],
  },
  {
    slug: 'jack-and-jill-bath',
    title: 'The Jack-and-Jill Bath',
    category: 'Bathrooms',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'A shared bath between two bedrooms, rebuilt with a full-length arched mirror, warm grey plank tile and a tub-and-shower combo finished top to bottom in white subway tile.',
    story: [
      'Bathrooms that serve two rooms take more traffic than any other room in the house, so this one was built to survive it — square corners, a floor that reads the same from every angle, and fixtures picked for how they hold up rather than how they photograph on day one.',
      'A full-length arched mirror does the work of making a narrow room feel wider, warm grey plank tile runs floor to ceiling without a seam out of line, and the tub surround is wrapped in white subway tile with a full-height run instead of stopping short at shoulder height.',
      'Black fixtures throughout keep it from reading as generic-builder-white, and a separate toilet nook behind its own door means the room does its job for two people getting ready at once without anyone waiting in line.',
    ],
    specs: [
      { label: 'Scope', value: 'Full gut and rebuild, shared bath' },
      { label: 'Tile', value: 'Warm grey plank, floor to ceiling' },
      { label: 'Surround', value: 'White subway tile, full-height tub surround' },
      { label: 'Fixtures', value: 'Matte black throughout' },
      { label: 'Layout', value: 'Separate toilet nook for simultaneous use' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Full-length arched mirror to open up a narrow room',
      'Full-height white subway tile tub surround',
      'Separate toilet nook behind its own door',
      'Warm grey plank tile run floor to ceiling',
    ],
    cover: {
      src: '/portfolio/real-bath-jackjill-tub.jpg',
      alt: 'Tub-and-shower combo with a full-height white subway tile surround, black fixtures and a frosted window',
      caption: 'Full-height subway tile and black fixtures — built for two people, every morning.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/real-bath-jackjill-tub.jpg',
        alt: 'Tub-and-shower combo with a full-height white subway tile surround, black fixtures and a frosted window',
        caption: 'Full-height subway tile and black fixtures — built for two people, every morning.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-jackjill-hall.jpg',
        alt: 'Full-length arched mirror on a grey wall beside a hallway with warm grey plank tile leading to a separate toilet nook',
        caption: 'A full-length mirror and a separate toilet nook — built for two people at once.',
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
      'So the budget went into the things you can’t redo later — new waterproofing, a properly framed and sealed niche, level floors and real tile prep — and the visible finishes stayed simple. A white vanity, a round mirror, grey tile laid on the diagonal, and a full-height tile shower surround.',
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
      src: '/portfolio/real-bath-white-floor.jpg',
      alt: 'Bright white bathroom with a round black-framed mirror over a white shaker vanity and grey plank tile floor',
      caption: 'Bright, square, and built to be boring in the best way.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/real-bath-white-floor.jpg',
        alt: 'Bright white bathroom with a round black-framed mirror over a white shaker vanity and grey plank tile floor',
        caption: 'Bright, square, and built to be boring in the best way.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-white-vanity.jpg',
        alt: 'White shaker vanity with a round mirror, seen from the adjoining hallway with grey plank tile underfoot',
        caption: 'Round mirror, white shaker, grey plank tile — nothing trying too hard.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-white-shower.jpg',
        alt: 'Full-height white subway tile shower surround with a framed, sealed niche beside the vanity',
        caption: 'Full-height subway tile, with a niche framed and sealed before a single tile went on.',
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
      { label: 'Installed', value: 'The Cabin fireplace' },
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
