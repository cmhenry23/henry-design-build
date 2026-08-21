'use client';

import { useId } from 'react';
import { footprintFor } from '@/lib/geometry';
import type { BuildTypeId } from '@/lib/estimate';
import type { PreviewScene } from '@/components/visualizer/CabinPreview';

/**
 * A top-down schematic — rough room breakdown, not a real floor plan.
 *
 * Same honesty rule as <CabinPreview>: this exists so a visitor can picture
 * how the square footage actually divides up, not to represent a finished
 * layout. Dimensions come from `footprintFor()`, the same function the
 * SketchUp export uses, so the two never disagree.
 */
export default function FloorPlan({
  buildType,
  sqft,
  scene,
  windows,
  hasDeck,
  hasLoft,
}: {
  buildType: BuildTypeId;
  sqft: number;
  scene: PreviewScene;
  windows: number;
  hasDeck: boolean;
  hasLoft: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const { width, depth } = footprintFor(sqft, buildType);

  // Feet → SVG units. Fit the longer dimension into a fixed viewBox with margin.
  const PAD = 70;
  const MAX_W = 760;
  const MAX_H = 420;
  const scale = Math.min((MAX_W - PAD * 2) / width, (MAX_H - PAD * 2) / depth);
  const w = width * scale;
  const d = depth * scale;
  const deckDepth = hasDeck ? Math.min(9, depth * 0.35) * scale : 0;
  const VB_W = w + PAD * 2;
  const VB_H = d + PAD * 2 + deckDepth;
  const x0 = PAD;
  const y0 = PAD;

  const stroke = '#14110F';
  const fill = '#FFFFFF';
  const accent = '#4C7DA8';
  const wallW = 3;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Rough floor plan, approximately ${width} by ${depth} feet, ${sqft} square feet.`}
    >
      <rect width={VB_W} height={VB_H} fill="#EAEAEE" />

      {/* Deck, drawn in front of the building */}
      {hasDeck && (
        <g>
          <rect
            x={x0}
            y={y0 + d}
            width={w}
            height={deckDepth}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text
            x={x0 + w / 2}
            y={y0 + d + deckDepth / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill={stroke}
            opacity="0.55"
            style={{ fontFamily: 'inherit', letterSpacing: '0.08em' }}
          >
            DECK
          </text>
        </g>
      )}

      {/* Outer walls */}
      <rect x={x0} y={y0} width={w} height={d} fill={fill} stroke={stroke} strokeWidth={wallW} />

      {/* Interior zones */}
      {scene === 'exterior' && <ExteriorZones x0={x0} y0={y0} w={w} d={d} buildType={buildType} stroke={stroke} />}
      {scene === 'kitchen' && <KitchenZones x0={x0} y0={y0} w={w} d={d} stroke={stroke} />}
      {scene === 'bath' && <BathZones x0={x0} y0={y0} w={w} d={d} stroke={stroke} />}
      {scene === 'room' && (
        <text
          x={x0 + w / 2}
          y={y0 + d / 2}
          textAnchor="middle"
          fontSize="13"
          fill={stroke}
          opacity="0.4"
          style={{ letterSpacing: '0.1em' }}
        >
          RENOVATED AREA
        </text>
      )}

      {/* Door — a gap in the front wall with a swing arc */}
      <g>
        <rect x={x0 + w / 2 - 14} y={y0 + d - wallW / 2} width={28} height={wallW} fill={fill} />
        <path
          d={`M ${x0 + w / 2 - 14} ${y0 + d} A 28 28 0 0 1 ${x0 + w / 2 + 14} ${y0 + d - 28}`}
          fill="none"
          stroke={stroke}
          strokeWidth={1}
          opacity="0.5"
        />
      </g>

      {/* Windows — ticks along the front wall */}
      {Array.from({ length: windows }).map((_, i) => {
        const slot = w / (windows + 1);
        const x = x0 + slot * (i + 1);
        if (Math.abs(x - (x0 + w / 2)) < 22) return null; // clear the door
        return (
          <rect
            key={i}
            x={x - 7}
            y={y0 - 2}
            width={14}
            height={wallW + 4}
            fill={accent}
            opacity="0.8"
          />
        );
      })}

      {/* Loft — dashed overlay, offset up-left to read as "above" */}
      {hasLoft && (
        <g opacity="0.55">
          <rect
            x={x0 + w * 0.55}
            y={y0 + 6}
            width={w * 0.4}
            height={d * 0.4}
            fill="none"
            stroke={stroke}
            strokeWidth={1.25}
            strokeDasharray="5 4"
          />
          <text
            x={x0 + w * 0.75}
            y={y0 + 6 + (d * 0.4) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill={stroke}
            style={{ letterSpacing: '0.06em' }}
          >
            LOFT ABOVE
          </text>
        </g>
      )}

      {/* Dimensions */}
      <DimLine
        x1={x0}
        y1={y0 - 22}
        x2={x0 + w}
        y2={y0 - 22}
        label={`${width.toLocaleString()} ft`}
        color={accent}
      />
      <DimLine
        x1={x0 - 22}
        y1={y0}
        x2={x0 - 22}
        y2={y0 + d}
        label={`${depth.toLocaleString()} ft`}
        color={accent}
        vertical
      />

      {/* Scale bar — a real 10 ft reference */}
      <g transform={`translate(${x0}, ${VB_H - 24})`}>
        <line x1={0} y1={0} x2={10 * scale} y2={0} stroke={stroke} strokeWidth={2} />
        <line x1={0} y1={-4} x2={0} y2={4} stroke={stroke} strokeWidth={2} />
        <line x1={10 * scale} y1={-4} x2={10 * scale} y2={4} stroke={stroke} strokeWidth={2} />
        <text x={10 * scale + 8} y={4} fontSize="10" fill={stroke} opacity="0.6">
          10 ft
        </text>
      </g>
    </svg>
  );
}

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  color,
  vertical = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  color: string;
  vertical?: boolean;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g opacity="0.8">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} stroke={color} strokeWidth={1} />
      <line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} stroke={color} strokeWidth={1} />
      <text
        x={midX}
        y={midY}
        transform={vertical ? `rotate(-90 ${midX} ${midY})` : undefined}
        textAnchor="middle"
        dy={vertical ? -5 : -5}
        fontSize="11"
        fill={color}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

/** Cottage/tiny/sauna: an open front zone, private zone behind. */
function ExteriorZones({
  x0,
  y0,
  w,
  d,
  buildType,
  stroke,
}: {
  x0: number;
  y0: number;
  w: number;
  d: number;
  buildType: BuildTypeId;
  stroke: string;
}) {
  const label = (text: string, x: number, y: number) => (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="11"
      fill={stroke}
      opacity="0.55"
      style={{ letterSpacing: '0.04em' }}
    >
      {text}
    </text>
  );

  if (buildType === 'sauna') {
    const split = w * 0.62;
    return (
      <>
        <line x1={x0 + split} y1={y0} x2={x0 + split} y2={y0 + d} stroke={stroke} strokeWidth={1.5} />
        {label('SAUNA', x0 + split / 2, y0 + d / 2)}
        {label('CHANGE', x0 + split + (w - split) / 2, y0 + d / 2)}
      </>
    );
  }

  const openDepth = d * 0.56;
  const rearY = y0 + openDepth;
  const rearH = d - openDepth;

  if (buildType === 'tiny') {
    const bathW = Math.min(w * 0.32, 90);
    return (
      <>
        {label('LIVING / SLEEP', x0 + w / 2, y0 + openDepth / 2)}
        <line x1={x0} y1={rearY} x2={x0 + w} y2={rearY} stroke={stroke} strokeWidth={1.5} />
        <line x1={x0 + w - bathW} y1={rearY} x2={x0 + w - bathW} y2={y0 + d} stroke={stroke} strokeWidth={1.5} />
        {label('BATH', x0 + w - bathW / 2, rearY + rearH / 2)}
        {label('SLEEP NOOK', x0 + (w - bathW) / 2, rearY + rearH / 2)}
      </>
    );
  }

  // cottage / reno-as-exterior
  const bathW = Math.min(w * 0.24, 80);
  const bedSplit = x0 + (w - bathW) / 2;

  return (
    <>
      {label('LIVING / KITCHEN', x0 + w / 2, y0 + openDepth / 2)}
      <line x1={x0} y1={rearY} x2={x0 + w} y2={rearY} stroke={stroke} strokeWidth={1.5} />
      <line x1={bedSplit} y1={rearY} x2={bedSplit} y2={y0 + d} stroke={stroke} strokeWidth={1.5} />
      <line
        x1={bedSplit + bathW}
        y1={rearY}
        x2={bedSplit + bathW}
        y2={y0 + d}
        stroke={stroke}
        strokeWidth={1.5}
      />
      {label('BEDROOM', x0 + (bedSplit - x0) / 2, rearY + rearH / 2)}
      {label('BATH', bedSplit + bathW / 2, rearY + rearH / 2)}
      {label('BEDROOM', bedSplit + bathW + (x0 + w - (bedSplit + bathW)) / 2, rearY + rearH / 2)}
    </>
  );
}

function KitchenZones({
  x0,
  y0,
  w,
  d,
  stroke,
}: {
  x0: number;
  y0: number;
  w: number;
  d: number;
  stroke: string;
}) {
  const counterDepth = Math.min(d * 0.22, 28);
  const islandW = w * 0.42;
  const islandD = Math.min(d * 0.3, 40);
  return (
    <>
      {/* Counter run along the back wall */}
      <rect
        x={x0 + 6}
        y={y0 + 6}
        width={w - 12}
        height={counterDepth}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      {/* Island, centred, floating in the room */}
      <rect
        x={x0 + (w - islandW) / 2}
        y={y0 + d * 0.55}
        width={islandW}
        height={islandD}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <text
        x={x0 + w / 2}
        y={y0 + d * 0.55 + islandD / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        fill={stroke}
        opacity="0.55"
      >
        ISLAND
      </text>
      <text x={x0 + w / 2} y={y0 + 6 + counterDepth / 2} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={stroke} opacity="0.55">
        COUNTER RUN
      </text>
    </>
  );
}

function BathZones({
  x0,
  y0,
  w,
  d,
  stroke,
}: {
  x0: number;
  y0: number;
  w: number;
  d: number;
  stroke: string;
}) {
  const vanityW = Math.min(w * 0.4, 60);
  const tubW = Math.min(w * 0.45, 70);
  return (
    <>
      <rect x={x0 + 6} y={y0 + 6} width={vanityW} height={22} fill="none" stroke={stroke} strokeWidth={1.5} />
      <text x={x0 + 6 + vanityW / 2} y={y0 + 17} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={stroke} opacity="0.55">
        VANITY
      </text>
      <rect
        x={x0 + w - tubW - 6}
        y={y0 + d - Math.min(d * 0.4, 70) - 6}
        width={tubW}
        height={Math.min(d * 0.4, 70)}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <text
        x={x0 + w - tubW / 2 - 6}
        y={y0 + d - Math.min(d * 0.4, 70) / 2 - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fill={stroke}
        opacity="0.55"
      >
        TUB / SHOWER
      </text>
    </>
  );
}
