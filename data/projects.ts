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

export type ProjectCategory =
  | 'Cottages & Cabins'
  | 'Kitchens'
  | 'Bathrooms'
  | 'Decks & Exteriors'
  | 'Craft & Detail';

export const categories: ProjectCategory[] = [
  'Cottages & Cabins',
  'Kitchens',
  'Bathrooms',
  'Decks & Exteriors',
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
      'An open kitchen, dining room and hidden coffee pantry, built from the ground up around one thing: a window with nothing but forest behind it.',
    story: [
      'The site had one obvious asset before a single wall went up: a clear sightline into the trees. We designed the whole room around it from the drawings on — ran the working counter along the glass and put the sink exactly where you’d want to stand, with nothing splitting the kitchen from the dining room beside it.',
      'Dark grey shaker doors, white quartz with a soft vein, and matte black hardware do the heavy lifting. A full-height white subway tile keeps the wall bright without competing with the cabinetry.',
      'Around the corner, a butler’s pantry takes the countertop clutter out of the main room — grey cabinetry, a beverage fridge, and enough landing space that the coffee maker and the mixer never have to move.',
    ],
    specs: [
      { label: 'Scope', value: 'New build — kitchen, dining and pantry' },
      { label: 'Cabinetry', value: 'Dark grey shaker, full-height pantry wall' },
      { label: 'Counters', value: 'White quartz, waterfall-free square edge' },
      { label: 'Backsplash', value: 'White subway tile, full height' },
      { label: 'Flooring', value: 'Wide-plank hardwood, site finished' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Kitchen and dining framed as one open room from the first drawing',
      'Counter run and sink placed to put the forest view front and centre',
      'Butler’s pantry with a built-in beverage fridge',
      'Full-height subway tile from counter to ceiling',
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
        caption: 'Kitchen and dining, one continuous room from the first framing.',
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
    title: 'The Soul Bath',
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
      {
        src: '/portfolio/real-bath-aubergine-wide.jpg',
        alt: 'Wide view of the plum bathroom showing the fluted vanity, reeded glass tub enclosure and tiled niche together',
        caption: 'The whole room in one shot — vanity, tub and niche sharing the same wall.',
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
      'A shared bath connecting two bedrooms — full gut and rebuild, with a vanity hall linking a tub-and-toilet room on one side and a separate walk-in shower on the other, in warm grey plank tile and brushed nickel throughout.',
    story: [
      'Bathrooms that serve two bedrooms take more daily traffic than any other room in the house, so this one was laid out to handle it: a shared vanity hall in the middle, with a private tub-and-toilet room on one side and a separate walk-in shower on the other, so two people can get ready at once without waiting on each other.',
      'The hall does the quiet work — a tall mirror to open up the narrow run, a second round mirror over the vanity, and warm grey plank tile carried underfoot through the whole space so it reads as one room instead of three stitched together. Both wet rooms get the same full-height white subway tile, including a niche in the walk-in shower that was framed and sealed before a single tile went on.',
      'Brushed nickel throughout keeps the hardware consistent room to room, and the budget went where it doesn’t show — waterproofing, substrate and dead-level floors — so the parts nobody sees are the parts built to last the longest.',
    ],
    specs: [
      { label: 'Scope', value: 'Full gut and rebuild, shared jack-and-jill bath' },
      { label: 'Layout', value: 'Vanity hall linking two private wet rooms' },
      { label: 'Tile', value: 'Warm grey plank tile throughout, full-height subway surrounds' },
      { label: 'Fixtures', value: 'Brushed nickel throughout' },
      { label: 'Focus', value: 'Substrate, waterproofing and levelling' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Vanity hall linking two private wet rooms',
      'Framed, sealed niche in the walk-in shower',
      'Full-height white subway tile in both wet rooms',
      'Warm grey plank tile carried through the whole space',
    ],
    cover: {
      src: '/portfolio/real-bath-jackjill-tub.jpg',
      alt: 'Tub-and-shower combo with a full-height white subway tile surround, brushed nickel fixtures and a curved shower rod',
      caption: 'One of two private wet rooms sharing this bath — full-height subway tile, brushed nickel throughout.',
      portrait: true,
    },
    photos: [
      {
        src: '/portfolio/real-bath-jackjill-tub.jpg',
        alt: 'Tub-and-shower combo with a full-height white subway tile surround, brushed nickel fixtures and a curved shower rod',
        caption: 'One of two private wet rooms sharing this bath — full-height subway tile, brushed nickel throughout.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-jackjill-hall.jpg',
        alt: 'Tall mirror on a grey wall beside a hallway with warm grey plank tile leading to two doors',
        caption: 'The shared hall connecting both sides — one mirror, one tile, two private rooms.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-white-floor.jpg',
        alt: 'Bright bathroom vanity area with a round black-framed mirror over a white shaker vanity and grey plank tile floor',
        caption: 'The vanity, shared by both rooms — round mirror, white shaker, grey plank tile.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-white-vanity.jpg',
        alt: 'White shaker vanity with a round mirror, seen from the adjoining hallway with grey plank tile underfoot',
        caption: 'Same vanity, seen from the hall — nothing trying too hard.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-white-shower.jpg',
        alt: 'Full-height white subway tile shower surround with a framed, sealed niche, vanity visible through the doorway',
        caption: 'The walk-in shower on the other side — niche framed and sealed before a single tile went on.',
        portrait: true,
      },
      {
        src: '/portfolio/real-bath-white-window.jpg',
        alt: 'White shaker vanity seen from across the room with a window and round mirror, grey plank tile underfoot',
        caption: 'The vanity hall, full width — window light, round mirror, grey plank tile.',
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
        src: '/portfolio/mantel-build-fireplace-base.jpg',
        alt: 'Electric fireplace insert set on a rough fieldstone base against a bare cedar wall, with a level resting on top',
        caption: 'Before the stone went up — insert set on the base and squared off.',
        portrait: true,
      },
      {
        src: '/portfolio/mantel-build-stone-face.jpg',
        alt: 'Fieldstone being built up around a taped-off fireplace insert against a cedar wall',
        caption: 'The stone face going up around the taped-off insert.',
        portrait: true,
      },
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
  {
    slug: 'deck-rebuild',
    title: 'The Deck Rebuild',
    category: 'Decks & Exteriors',
    location: 'TODO: confirm location',
    year: 'TODO: confirm year',
    summary:
      'A weathered, splintering deck torn back to the frame and rebuilt from the ground up — same footprint, same view of the yard, none of the grey.',
    story: [
      'This one started with a deck that had done its job for years and was done doing it — grey, splintering boards, a railing that had seen better decades. Nothing about it was safe to leave as-is.',
      'We stripped it back and rebuilt it board by board on the same footprint, then stained it the same week so it would cure before the first season of real use. What used to disappear into the yard now anchors it.',
      'A deck rebuild is a long day of unglamorous work — pulling old fasteners, checking every joist, replacing what the old one was hiding — before a single new board goes down. That is the part that decides whether it lasts five years or twenty-five.',
    ],
    specs: [
      { label: 'Scope', value: 'Full deck tear-off and rebuild, same footprint' },
      { label: 'Structure', value: 'New joists and ledger, existing footings inspected and reused' },
      { label: 'Decking', value: 'Pressure-treated lumber, stained on site' },
      { label: 'Duration', value: 'TODO: add build duration' },
    ],
    highlights: [
      'Torn off and rebuilt on the original footprint',
      'Every joist and footing checked before new decking went down',
      'Stained the same week it was built, ahead of the first season',
    ],
    cover: {
      src: '/portfolio/real-deck-after.jpg',
      alt: 'Freshly stained backyard deck in warm evening light, wrapping around a brick bungalow',
      caption: 'Same footprint, new everything — stained and ready for the season.',
    },
    photos: [
      {
        src: '/portfolio/real-deck-before.jpg',
        alt: 'A weathered grey deck mid tear-off, with old railings and splintering boards',
        caption: 'Where it started — grey, splintering, and past its best years.',
      },
      {
        src: '/portfolio/real-deck-after.jpg',
        alt: 'Freshly stained backyard deck in warm evening light, wrapping around a brick bungalow',
        caption: 'Same footprint, new everything — stained and ready for the season.',
      },
      {
        src: '/portfolio/real-deck-after-detail.jpg',
        alt: 'Corner of the finished deck at golden hour with tools and a storage shed in the background',
        caption: 'Still wet from the last coat of stain.',
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
