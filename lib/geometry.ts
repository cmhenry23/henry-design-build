/**
 * Shared footprint math — the one place that turns "1,400 sq ft" into an
 * actual width × depth in feet.
 *
 * Both <FloorPlan> and the SketchUp export call this, so the plan on screen
 * and the model a visitor downloads always describe the same building.
 */

import type { BuildTypeId } from '@/lib/estimate';

/** Width-to-depth ratio per build type. Not a real plan — a reasonable guess. */
const ASPECT: Record<BuildTypeId, number> = {
  cottage: 1.35,
  tiny: 1.15,
  sauna: 1.45,
  kitchen: 1.6,
  bath: 1.2,
  reno: 1.4,
};

export interface Footprint {
  /** Feet, left-right as drawn. */
  width: number;
  /** Feet, front-back as drawn. */
  depth: number;
  /** Eave wall height in feet. A constant, not derived — this is a massing guess. */
  wallHeight: number;
}

/** Round to the nearest half foot so dimensions read like a person chose them. */
function roundHalf(n: number) {
  return Math.round(n * 2) / 2;
}

export function footprintFor(sqft: number, buildType: BuildTypeId): Footprint {
  const aspect = ASPECT[buildType] ?? 1.3;
  const depth = roundHalf(Math.sqrt(Math.max(sqft, 1) / aspect));
  const width = roundHalf(Math.max(sqft, 1) / Math.max(depth, 1));
  return { width, depth, wallHeight: 9 };
}
