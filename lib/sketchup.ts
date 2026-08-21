/**
 * Turns a resolved brief into a SketchUp Ruby script — a real, to-scale 3D
 * massing model a visitor can open and keep building on.
 *
 * WHY A SCRIPT, NOT A LIVE 3D EMBED
 * ──────────────────────────────────
 * SketchUp has no public API for a third-party site to spin up a parametric
 * 3D model in someone else's account, and embedding a real SketchUp model
 * here would mean showing a stock model as if it were Ryan's actual work —
 * which it wouldn't be. A generated .rb file is honest: it's plainly a
 * starting shape, built from the visitor's own numbers, that they open in
 * SketchUp themselves.
 *
 * WHY DETERMINISTIC, NOT MODEL-WRITTEN
 * ──────────────────────────────────────
 * Same rule as `calculateEstimate()` and `<CabinPreview>`: a visitor's
 * choices produce the geometry, not a language model improvising Ruby. That
 * means the script is exactly as trustworthy as the rest of the Design
 * Studio, and it can't hallucinate a broken API call.
 *
 * The geometry is deliberately simple — walls, a gable roof, an optional
 * deck and loft marker. No punched windows or doors: reliably creating
 * holes in a face from a generated script is the kind of thing worth
 * testing interactively in SketchUp, not shipping sight-unseen. Every
 * operation here (add_face, pushpull, material=) is basic, well-documented
 * Ruby API surface, and the whole thing runs inside begin/rescue so a
 * visitor sees a plain message instead of a stack trace if anything about
 * their SketchUp setup doesn't like it.
 */

import { footprintFor } from '@/lib/geometry';
import { site } from '@/data/site';
import type { resolveBrief } from '@/lib/brief';
import { BUILD_TYPES, FINISH_LEVELS } from '@/lib/estimate';

type Resolved = ReturnType<typeof resolveBrief>;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Ruby float literal — SketchUp's `.feet` needs a plain number, not scientific notation. */
function rb(n: number) {
  return n.toFixed(2);
}

export function buildSketchUpScript(resolved: Resolved, projectId: string): string {
  const type = BUILD_TYPES.find((t) => t.id === resolved.buildType)!;
  const finish = FINISH_LEVELS.find((f) => f.id === resolved.finish)!;
  const { width, depth, wallHeight } = footprintFor(resolved.sqft, resolved.buildType);
  const rise = resolved.pitch.value * (width / 2);
  const hasDeck = resolved.addOns.includes('deck');
  const hasLoft = resolved.addOns.includes('loft');

  const [wr, wg, wb] = hexToRgb(resolved.cladding.hex);
  const [rr, rg, rb_] = hexToRgb(resolved.roof.hex);

  const groupName = `${projectId} — ${type.label}`.replace(/"/g, "'");
  const deckDepth = Math.min(9, depth * 0.35);

  const lines: string[] = [];
  lines.push('# ' + '='.repeat(60));
  lines.push(`# ${site.name} — Design Studio export`);
  lines.push(`# Project reference: ${projectId}`);
  lines.push(`# ${type.label} · ${resolved.sqft.toLocaleString()} sq ft · ${finish.label} finish`);
  lines.push(`# Generated ${new Date().toISOString().slice(0, 10)}`);
  lines.push('#');
  lines.push('# This builds a rough MASSING model — overall shape and scale,');
  lines.push('# not a finished design. No windows or doors are cut in; add');
  lines.push('# those yourself once the shape looks right.');
  lines.push('#');
  lines.push('# To run it: open SketchUp (Pro or Studio — the Ruby Console isn\'t');
  lines.push('# available on the free web app), go to Window > Ruby Console,');
  lines.push('# paste this file\'s contents in, and press Enter.');
  lines.push('#');
  lines.push(`# Footprint: ${rb(width)} ft x ${rb(depth)} ft, ${rb(wallHeight)} ft walls,`);
  lines.push(`# ${resolved.pitch.label.toLowerCase()} roof pitch, ${resolved.cladding.label.toLowerCase()} cladding,`);
  lines.push(`# ${resolved.roof.label.toLowerCase()} roof.`);
  lines.push('#' + '='.repeat(60));
  lines.push('');
  lines.push('begin');
  lines.push('  model = Sketchup.active_model');
  lines.push(`  model.start_operation('${site.shortName} Design Studio import', true)`);
  lines.push('  entities = model.active_entities');
  lines.push('  group = entities.add_group');
  lines.push(`  group.name = "${groupName}"`);
  lines.push('  ents = group.entities');
  lines.push('');
  lines.push(`  w = ${rb(width)}.feet`);
  lines.push(`  d = ${rb(depth)}.feet`);
  lines.push(`  h = ${rb(wallHeight)}.feet`);
  lines.push(`  rise = ${rb(rise)}.feet`);
  lines.push('  ridge_z = h + rise');
  lines.push('');
  lines.push('  wall_color = [' + [wr, wg, wb].join(', ') + ']');
  lines.push('  roof_color = [' + [rr, rg, rb_].join(', ') + ']');
  lines.push('');
  lines.push('  # Floor');
  lines.push('  floor = ents.add_face([');
  lines.push('    Geom::Point3d.new(0, 0, 0), Geom::Point3d.new(w, 0, 0),');
  lines.push('    Geom::Point3d.new(w, d, 0), Geom::Point3d.new(0, d, 0)');
  lines.push('  ])');
  lines.push('');
  lines.push('  # Walls — front, back, left, right');
  lines.push('  wall_faces = []');
  lines.push('  wall_faces << ents.add_face([Geom::Point3d.new(0,0,0), Geom::Point3d.new(w,0,0), Geom::Point3d.new(w,0,h), Geom::Point3d.new(0,0,h)])');
  lines.push('  wall_faces << ents.add_face([Geom::Point3d.new(w,d,0), Geom::Point3d.new(0,d,0), Geom::Point3d.new(0,d,h), Geom::Point3d.new(w,d,h)])');
  lines.push('  wall_faces << ents.add_face([Geom::Point3d.new(0,d,0), Geom::Point3d.new(0,0,0), Geom::Point3d.new(0,0,h), Geom::Point3d.new(0,d,h)])');
  lines.push('  wall_faces << ents.add_face([Geom::Point3d.new(w,0,0), Geom::Point3d.new(w,d,0), Geom::Point3d.new(w,d,h), Geom::Point3d.new(w,0,h)])');
  lines.push('  wall_faces.each do |f|');
  lines.push('    f.material = wall_color');
  lines.push('    f.back_material = wall_color');
  lines.push('  end');
  lines.push('');
  lines.push('  # Roof — two pitched planes meeting at a centred ridge, plus gable ends');
  lines.push('  roof_faces = []');
  lines.push('  roof_faces << ents.add_face([Geom::Point3d.new(0,0,h), Geom::Point3d.new(0,d,h), Geom::Point3d.new(w/2.0,d,ridge_z), Geom::Point3d.new(w/2.0,0,ridge_z)])');
  lines.push('  roof_faces << ents.add_face([Geom::Point3d.new(w/2.0,0,ridge_z), Geom::Point3d.new(w/2.0,d,ridge_z), Geom::Point3d.new(w,d,h), Geom::Point3d.new(w,0,h)])');
  lines.push('  roof_faces.each do |f|');
  lines.push('    f.material = roof_color');
  lines.push('    f.back_material = roof_color');
  lines.push('  end');
  lines.push('  ents.add_face([Geom::Point3d.new(0,0,h), Geom::Point3d.new(w,0,h), Geom::Point3d.new(w/2.0,0,ridge_z)])');
  lines.push('  ents.add_face([Geom::Point3d.new(w,d,h), Geom::Point3d.new(0,d,h), Geom::Point3d.new(w/2.0,d,ridge_z)])');
  lines.push('');

  if (hasDeck) {
    lines.push('  # Deck — a low platform in front of the building');
    lines.push(`  deck_depth = ${rb(deckDepth)}.feet`);
    lines.push('  deck = ents.add_face([');
    lines.push('    Geom::Point3d.new(0, 0, 0), Geom::Point3d.new(w, 0, 0),');
    lines.push('    Geom::Point3d.new(w, -deck_depth, 0), Geom::Point3d.new(0, -deck_depth, 0)');
    lines.push('  ])');
    lines.push('  deck.pushpull(0.5.feet) if deck');
    lines.push('');
  }

  if (hasLoft) {
    lines.push('  # Loft — a floor plane marker partway up, over the back half of the building');
    lines.push('  loft_z = h * 0.62');
    lines.push('  ents.add_face([');
    lines.push('    Geom::Point3d.new(w*0.5, 0, loft_z), Geom::Point3d.new(w, 0, loft_z),');
    lines.push('    Geom::Point3d.new(w, d, loft_z), Geom::Point3d.new(w*0.5, d, loft_z)');
    lines.push('  ])');
    lines.push('');
  }

  lines.push('  # Reference label, sitting in front of the building');
  lines.push(`  ents.add_text("${groupName}\\n${resolved.sqft.toLocaleString()} sq ft (rough massing)", Geom::Point3d.new(w/2.0, -3.feet, 0), Geom::Vector3d.new(0,0,1))`);
  lines.push('');
  lines.push('  model.commit_operation');
  lines.push(
    `  UI.messagebox("Massing model built — ${rb(width)}' x ${rb(depth)}', ${rb(wallHeight)}' walls. This is a rough starting shape, not a finished design.")`
  );
  lines.push('rescue => e');
  lines.push('  model.abort_operation rescue nil');
  lines.push(
    `  UI.messagebox("Something went wrong building the model: #{e.message}\\n\\nThis script is a rough starting point from the ${site.name} Design Studio — email ${site.email} if it keeps failing.")`
  );
  lines.push('end');

  return lines.join('\n');
}

export function sketchupFilename(projectId: string): string {
  return `${projectId.toLowerCase()}-design-studio.rb`;
}
