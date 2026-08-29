'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { footprintFor } from '@/lib/geometry';
import type { BuildTypeId } from '@/lib/estimate';
import type { PreviewScene } from '@/components/visualizer/CabinPreview';

/**
 * A top-down schematic — rough room breakdown, not a real floor plan.
 *
 * Same honesty rule as <CabinPreview>: this exists so a visitor can picture
 * how the square footage actually divides up, not to represent a finished
 * layout. The overall footprint comes from `footprintFor()`, the same
 * function the SketchUp export uses, so the two never disagree.
 *
 * For the exterior scene (cottage/tiny/sauna), the interior partitions are
 * genuinely editable: drag a wall to resize the rooms either side of it,
 * tap a wall (without dragging) to remove it, or add a new one. Dimensions
 * are computed live from wherever the walls actually are, not fixed text.
 *
 * On top of that — for every scene — the toolbar below lets a visitor drop
 * in a room, a window, a run of cabinets or a fireplace (or type their own
 * label for anything else — a mudroom, a pantry, whatever) and drag it
 * anywhere on the plan, or resize it from its bottom-right corner. These
 * are a separate, freeform layer from the structural walls above: they
 * don't cut into the room breakdown, they're just markers you can place,
 * move and resize.
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

  // Freeform items — rooms, windows, cabinets, fireplaces, or anything
  // typed into the toolbar's own prompt — dropped in and dragged into
  // place. Reset whenever the build type changes, so leftover items from a
  // kitchen don't linger on a cottage.
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [customLabel, setCustomLabel] = useState('');
  useEffect(() => setItems([]), [buildType]);

  function addItem(type: ItemType, label?: string) {
    const def = ITEM_DEFS[type];
    setItems((prev) => {
      const n = prev.length;
      const xFt = clamp(width / 2 + ((n % 3) - 1) * (def.wFt + 3), def.wFt / 2 + 1, width - def.wFt / 2 - 1);
      const yFt = clamp(
        depth / 2 + Math.floor(n / 3) * (def.hFt + 3) - depth / 4,
        def.hFt / 2 + 1,
        depth - def.hFt / 2 - 1
      );
      const id = `${type}-${Date.now()}-${n}`;
      return [...prev, { id, type, xFt, yFt, wFt: def.wFt, hFt: def.hFt, label }];
    });
  }

  function handleAddCustom(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = customLabel.trim();
    if (!trimmed) return;
    addItem('custom', trimmed.slice(0, 24));
    setCustomLabel('');
  }

  function moveItem(id: string, xFt: number, yFt: number) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, xFt, yFt } : it)));
  }

  /** Resizes from the bottom-right corner, so the top-left corner stays put. */
  function resizeItem(id: string, wFt: number, hFt: number) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const leftFt = it.xFt - it.wFt / 2;
        const topFt = it.yFt - it.hFt / 2;
        return { ...it, wFt, hFt, xFt: leftFt + wFt / 2, yFt: topFt + hFt / 2 };
      })
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  /** Rotating a top-down rectangle 90° is just swapping its width and depth. */
  function rotateItem(id: string) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const newWFt = it.hFt;
        const newHFt = it.wFt;
        return {
          ...it,
          wFt: newWFt,
          hFt: newHFt,
          xFt: clamp(it.xFt, newWFt / 2, width - newWFt / 2),
          yFt: clamp(it.yFt, newHFt / 2, depth - newHFt / 2),
        };
      })
    );
  }

  function renameItem(id: string, label: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, label } : it)));
  }

  // Double-tap/double-click an item to rename it in place — see the
  // <foreignObject> input rendered inline in <DraggableItem> below.
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <>
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Floor plan, approximately ${width} by ${depth} feet, ${sqft} square feet${
        scene === 'exterior' ? '. Interior walls are draggable — resize, add or remove them.' : ''
      }${items.length ? `. ${items.length} item${items.length > 1 ? 's' : ''} placed on the plan — drag to move, tap to remove.` : ''}`}
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
      {scene === 'exterior' && (
        <InteractiveExteriorZones
          key={buildType}
          x0={x0}
          y0={y0}
          w={w}
          d={d}
          buildType={buildType}
          stroke={stroke}
          accent={accent}
          scale={scale}
        />
      )}
      {scene === 'kitchen' && <KitchenZones x0={x0} y0={y0} w={w} d={d} stroke={stroke} scale={scale} />}
      {scene === 'bath' && <BathZones x0={x0} y0={y0} w={w} d={d} stroke={stroke} scale={scale} />}
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

      {/* Overall dimensions */}
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

      {/* Freeform items, dropped in from the toolbar — drawn last so they
          sit on top of the structural walls and fixtures above. */}
      {items.map((item) => (
        <DraggableItem
          key={item.id}
          item={item}
          x0={x0}
          y0={y0}
          scale={scale}
          width={width}
          depth={depth}
          editing={editingId === item.id}
          onMove={(xFt, yFt) => moveItem(item.id, xFt, yFt)}
          onResize={(wFt, hFt) => resizeItem(item.id, wFt, hFt)}
          onRotate={() => rotateItem(item.id)}
          onRemove={() => removeItem(item.id)}
          onStartEdit={() => setEditingId(item.id)}
          onRename={(label) => {
            renameItem(item.id, label);
            setEditingId(null);
          }}
          onCancelEdit={() => setEditingId(null)}
        />
      ))}
    </svg>

    <div className="border-t border-ink/10 bg-white/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink/45">
          Add to the plan
        </span>
        {(Object.keys(ITEM_DEFS) as ItemType[])
          .filter((type) => type !== 'custom')
          .map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addItem(type)}
              className="border border-ink/20 bg-white px-3 py-1.5 text-xs font-medium text-ink/75 transition-colors hover:border-ink hover:bg-ink hover:text-bone"
            >
              + {ITEM_DEFS[type].label}
            </button>
          ))}
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setItems([])}
            className="ml-auto text-xs text-ink/40 underline underline-offset-2 hover:text-ink/70"
          >
            Clear added items
          </button>
        )}
      </div>

      <form onSubmit={handleAddCustom} className="mt-2.5 flex items-center gap-2">
        <input
          type="text"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          placeholder="Or type something else to add — e.g. Mudroom, Pantry, Deck"
          maxLength={24}
          className="min-w-0 flex-1 border border-ink/20 bg-white px-3 py-1.5 text-xs placeholder:text-ink/35 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={!customLabel.trim()}
          className="border border-ink/20 bg-white px-3 py-1.5 text-xs font-medium text-ink/75 transition-colors hover:border-ink hover:bg-ink hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add
        </button>
      </form>

      <p className="mt-2 text-[0.68rem] leading-relaxed text-ink/40">
        Drag the corner to resize, tap the ⟳ to rotate it 90°, or double-click it to rename it —
        dimensions update as you go.
      </p>
    </div>
    </>
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

/**
 * A draggable partition. Tracks pointer movement itself via
 * `ownerSVGElement`/`viewBox.baseVal`, so it needs no ref passed down from
 * the parent — converting client coordinates to SVG user-space only needs
 * the element's own nearest `<svg>` ancestor. A pointerdown→pointerup with
 * near-zero movement is treated as a tap (removes the wall, if removable)
 * rather than a drag.
 */
function WallHandle({
  x,
  y,
  orientation,
  onDrag,
  onRemove,
  removable,
  ariaLabel,
}: {
  x: number;
  y: number;
  orientation: 'h' | 'v';
  onDrag: (svgPos: number) => void;
  onRemove?: () => void;
  removable: boolean;
  ariaLabel: string;
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const nudge = orientation === 'v' ? 6 : 6;

  function svgPosFromEvent(e: React.PointerEvent<SVGGElement>) {
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return orientation === 'v'
      ? ((e.clientX - rect.left) / rect.width) * vb.width + vb.x
      : ((e.clientY - rect.top) / rect.height) * vb.height + vb.y;
  }

  function handlePointerDown(e: React.PointerEvent<SVGGElement>) {
    e.stopPropagation();
    // Capture can throw (e.g. no active pointer with this id) in edge cases
    // across browsers/devices — never let that skip recording the drag
    // start, or both dragging and tap-to-remove would silently break.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* proceed uncaptured */
    }
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
  }

  function handlePointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    onDrag(svgPosFromEvent(e));
  }

  function handlePointerUp(e: React.PointerEvent<SVGGElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* wasn't captured — nothing to release */
    }
    if (!movedRef.current && removable) onRemove?.();
    startRef.current = null;
  }

  function handleKeyDown(e: React.KeyboardEvent<SVGGElement>) {
    if (orientation === 'v' && e.key === 'ArrowLeft') onDrag(x - nudge);
    else if (orientation === 'v' && e.key === 'ArrowRight') onDrag(x + nudge);
    else if (orientation === 'h' && e.key === 'ArrowUp') onDrag(y - nudge);
    else if (orientation === 'h' && e.key === 'ArrowDown') onDrag(y + nudge);
    else if ((e.key === 'Delete' || e.key === 'Backspace') && removable) onRemove?.();
    else return;
    e.preventDefault();
  }

  return (
    <g
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-orientation={orientation === 'v' ? 'vertical' : 'horizontal'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{ cursor: orientation === 'v' ? 'ew-resize' : 'ns-resize', touchAction: 'none' }}
    >
      <circle cx={x} cy={y} r="16" fill="#000" opacity="0.001" />
      <circle cx={x} cy={y} r="7" fill="#4C7DA8" stroke="#fff" strokeWidth="1.5" />
      {removable && (
        <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9" fill="#fff" pointerEvents="none">
          ×
        </text>
      )}
    </g>
  );
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const feet = (px: number, scale: number) => Math.max(1, Math.round(px / scale));

/* ── Freeform items — added from the toolbar, dragged anywhere on the plan ── */

type ItemType = 'room' | 'window' | 'cabinets' | 'fireplace' | 'custom';

interface PlacedItem {
  id: string;
  type: ItemType;
  /** Centre, in feet from the building's top-left corner. */
  xFt: number;
  yFt: number;
  wFt: number;
  hFt: number;
  /** Set for items typed into the toolbar's prompt — overrides the type's default label. */
  label?: string;
}

const ITEM_DEFS: Record<ItemType, { wFt: number; hFt: number; label: string; fill: string; stroke: string }> = {
  room: { wFt: 10, hFt: 10, label: 'Room', fill: '#FFFFFF', stroke: '#14110F' },
  window: { wFt: 3, hFt: 0.6, label: 'Window', fill: '#4C7DA8', stroke: '#14110F' },
  cabinets: { wFt: 8, hFt: 2, label: 'Cabinets', fill: '#E8DFCF', stroke: '#14110F' },
  fireplace: { wFt: 4, hFt: 2, label: 'Fireplace', fill: '#B7A99A', stroke: '#14110F' },
  custom: { wFt: 8, hFt: 8, label: 'Room', fill: '#FFFFFF', stroke: '#14110F' },
};

/**
 * A dropped-in item, freely draggable in two dimensions (unlike
 * `WallHandle`, which only slides along one axis) and resizable from its
 * bottom-right corner. Same tap-to-remove interaction as everything else
 * here: drag the body to move it, drag the corner to resize it, tap the
 * body with no movement to remove it.
 */
function DraggableItem({
  item,
  x0,
  y0,
  scale,
  width,
  depth,
  editing,
  onMove,
  onResize,
  onRotate,
  onRemove,
  onStartEdit,
  onRename,
  onCancelEdit,
}: {
  item: PlacedItem;
  x0: number;
  y0: number;
  scale: number;
  width: number;
  depth: number;
  editing: boolean;
  onMove: (xFt: number, yFt: number) => void;
  onResize: (wFt: number, hFt: number) => void;
  onRotate: () => void;
  onRemove: () => void;
  onStartEdit: () => void;
  onRename: (label: string) => void;
  onCancelEdit: () => void;
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const resizingRef = useRef(false);
  const def = ITEM_DEFS[item.type];
  const label = item.label ?? def.label;
  const showDetail = item.type !== 'window';

  const cx = x0 + item.xFt * scale;
  const cy = y0 + item.yFt * scale;
  const w = item.wFt * scale;
  const h = item.hFt * scale;

  function handlePointerDown(e: React.PointerEvent<SVGGElement>) {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* proceed uncaptured */
    }
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
  }

  function handlePointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const svgX = ((e.clientX - rect.left) / rect.width) * vb.width + vb.x;
    const svgY = ((e.clientY - rect.top) / rect.height) * vb.height + vb.y;
    const xFt = clamp((svgX - x0) / scale, item.wFt / 2, width - item.wFt / 2);
    const yFt = clamp((svgY - y0) / scale, item.hFt / 2, depth - item.hFt / 2);
    onMove(xFt, yFt);
  }

  function handlePointerUp(e: React.PointerEvent<SVGGElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* wasn't captured — nothing to release */
    }
    if (!movedRef.current) onRemove();
    startRef.current = null;
  }

  function handleKeyDown(e: React.KeyboardEvent<SVGGElement>) {
    const nudge = 0.5;
    if (e.key === 'ArrowLeft') onMove(clamp(item.xFt - nudge, item.wFt / 2, width - item.wFt / 2), item.yFt);
    else if (e.key === 'ArrowRight') onMove(clamp(item.xFt + nudge, item.wFt / 2, width - item.wFt / 2), item.yFt);
    else if (e.key === 'ArrowUp') onMove(item.xFt, clamp(item.yFt - nudge, item.hFt / 2, depth - item.hFt / 2));
    else if (e.key === 'ArrowDown') onMove(item.xFt, clamp(item.yFt + nudge, item.hFt / 2, depth - item.hFt / 2));
    else if (e.key === 'Delete' || e.key === 'Backspace') onRemove();
    else return;
    e.preventDefault();
  }

  // Resize handle — a separate control at the bottom-right corner. It stops
  // propagation on pointerdown so dragging it never also triggers the move
  // handlers above; the top-left corner stays fixed while it drags.
  function handleResizeDown(e: React.PointerEvent<SVGGElement>) {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* proceed uncaptured */
    }
    resizingRef.current = true;
  }

  function handleResizeMove(e: React.PointerEvent<SVGGElement>) {
    if (!resizingRef.current) return;
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const svgX = ((e.clientX - rect.left) / rect.width) * vb.width + vb.x;
    const svgY = ((e.clientY - rect.top) / rect.height) * vb.height + vb.y;
    const leftFt = item.xFt - item.wFt / 2;
    const topFt = item.yFt - item.hFt / 2;
    const wFt = clamp((svgX - x0) / scale - leftFt, 1, width - leftFt);
    const hFt = clamp((svgY - y0) / scale - topFt, 0.5, depth - topFt);
    onResize(wFt, hFt);
  }

  function handleResizeUp(e: React.PointerEvent<SVGGElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* wasn't captured — nothing to release */
    }
    resizingRef.current = false;
  }

  function handleResizeKeyDown(e: React.KeyboardEvent<SVGGElement>) {
    const nudge = 0.5;
    const leftFt = item.xFt - item.wFt / 2;
    const topFt = item.yFt - item.hFt / 2;
    if (e.key === 'ArrowRight') onResize(clamp(item.wFt + nudge, 1, width - leftFt), item.hFt);
    else if (e.key === 'ArrowLeft') onResize(clamp(item.wFt - nudge, 1, width - leftFt), item.hFt);
    else if (e.key === 'ArrowDown') onResize(item.wFt, clamp(item.hFt + nudge, 0.5, depth - topFt));
    else if (e.key === 'ArrowUp') onResize(item.wFt, clamp(item.hFt - nudge, 0.5, depth - topFt));
    else return;
    e.preventDefault();
  }

  return (
    <g>
      <g
        role="button"
        tabIndex={0}
        aria-label={`${label} — drag to move, activate to remove, or double-click to rename it`}
        onPointerDown={editing ? undefined : handlePointerDown}
        onPointerMove={editing ? undefined : handlePointerMove}
        onPointerUp={editing ? undefined : handlePointerUp}
        onKeyDown={editing ? undefined : handleKeyDown}
        onDoubleClick={onStartEdit}
        style={{ cursor: editing ? 'text' : 'grab', touchAction: 'none' }}
      >
        <rect
          x={cx - w / 2}
          y={cy - h / 2}
          width={w}
          height={h}
          rx="2"
          fill={def.fill}
          stroke={def.stroke}
          strokeWidth="1.5"
          opacity="0.95"
        />
        {item.type === 'cabinets' && (
          <g stroke={def.stroke} strokeOpacity="0.3" strokeWidth="1">
            {Array.from({ length: Math.max(2, Math.round(item.wFt / 2)) }).map((_, i, arr) => (
              <line
                key={i}
                x1={cx - w / 2 + ((i + 1) * w) / (arr.length + 1)}
                y1={cy - h / 2}
                x2={cx - w / 2 + ((i + 1) * w) / (arr.length + 1)}
                y2={cy + h / 2}
              />
            ))}
          </g>
        )}
        {showDetail && !editing && (
          <>
            <text
              x={cx}
              y={cy - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={def.stroke}
              opacity="0.75"
              pointerEvents="none"
              style={{ letterSpacing: '0.04em' }}
            >
              {label.toUpperCase()}
            </text>
            <text
              x={cx}
              y={cy + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fill={def.stroke}
              opacity="0.5"
              pointerEvents="none"
            >
              {Math.max(1, Math.round(item.wFt))}&apos; × {Math.max(1, Math.round(item.hFt))}&apos;
            </text>
          </>
        )}
      </g>

      {editing && (
        <foreignObject x={cx - w / 2} y={cy - 11} width={Math.max(w, 70)} height="22">
          <input
            type="text"
            defaultValue={label}
            autoFocus
            maxLength={24}
            onFocus={(e) => e.currentTarget.select()}
            // Commit directly on Enter rather than routing through blur() —
            // a synthetic blur inside an SVG <foreignObject> doesn't
            // reliably reach React's onBlur here. onBlur is kept as a
            // fallback for genuinely clicking/tapping away.
            onBlur={(e) => onRename(e.currentTarget.value.trim() || label)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onRename(e.currentTarget.value.trim() || label);
              } else if (e.key === 'Escape') {
                onCancelEdit();
              }
              e.stopPropagation();
            }}
            style={{
              width: '100%',
              height: '100%',
              fontSize: '9px',
              textAlign: 'center',
              border: `1.5px solid ${def.stroke}`,
              outline: 'none',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          />
        </foreignObject>
      )}

      {!editing && (
        <g
          role="slider"
          tabIndex={0}
          aria-label={`Resize ${label}`}
          onPointerDown={handleResizeDown}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeUp}
          onKeyDown={handleResizeKeyDown}
          style={{ cursor: 'nwse-resize', touchAction: 'none' }}
        >
          <rect x={cx + w / 2 - 11} y={cy + h / 2 - 11} width="16" height="16" fill="#000" opacity="0.001" />
          <path
            d={`M ${cx + w / 2 - 7} ${cy + h / 2} L ${cx + w / 2} ${cy + h / 2 - 7} L ${cx + w / 2} ${cy + h / 2} Z`}
            fill={def.stroke}
            opacity="0.55"
          />
        </g>
      )}

      {!editing && (
        <g
          role="button"
          tabIndex={0}
          aria-label={`Rotate ${label} 90 degrees`}
          onClick={(e) => {
            e.stopPropagation();
            onRotate();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onRotate();
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle cx={cx + w / 2 - 3} cy={cy - h / 2 + 3} r="9" fill="#fff" stroke={def.stroke} strokeWidth="1.25" />
          <text
            x={cx + w / 2 - 3}
            y={cy - h / 2 + 3.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill={def.stroke}
            pointerEvents="none"
          >
            ⟳
          </text>
        </g>
      )}
    </g>
  );
}

const REAR_LABELS: Record<string, string[]> = {
  cottage: ['BEDROOM', 'BATH', 'BEDROOM', 'STORAGE'],
  reno: ['BEDROOM', 'BATH', 'BEDROOM', 'STORAGE'],
  tiny: ['SLEEP NOOK', 'BATH', 'SLEEP NOOK'],
};

const FRONT_LABEL: Record<string, string> = {
  cottage: 'LIVING / KITCHEN',
  reno: 'LIVING / KITCHEN',
  tiny: 'LIVING / SLEEP',
};

/**
 * Cottage/tiny/reno: an open front zone over a rear zone split into rooms.
 * Sauna: one full-height wall, sauna on one side and the change room on the
 * other. Every wall here is draggable; the ones in the rear zone can also
 * be tapped to remove, or added to, up to a sensible cap.
 */
function InteractiveExteriorZones({
  x0,
  y0,
  w,
  d,
  buildType,
  stroke,
  accent,
  scale,
}: {
  x0: number;
  y0: number;
  w: number;
  d: number;
  buildType: BuildTypeId;
  stroke: string;
  accent: string;
  scale: number;
}) {
  const isSauna = buildType === 'sauna';
  const [frontFrac, setFrontFrac] = useState(0.56);
  const [vSplits, setVSplits] = useState<number[]>(() =>
    isSauna ? [0.62] : buildType === 'tiny' ? [0.72] : [0.38, 0.62]
  );

  const label = (text: string, x: number, y: number, key: string) => (
    <text
      key={key}
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="11"
      fill={stroke}
      opacity="0.6"
      style={{ letterSpacing: '0.04em' }}
    >
      {text}
    </text>
  );

  const dim = (text: string, x: number, y: number, key: string) => (
    <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={accent} opacity="0.85">
      {text}
    </text>
  );

  function dragVSplit(index: number, svgX: number) {
    setVSplits((prev) => {
      const lo = index === 0 ? x0 + w * 0.06 : x0 + prev[index - 1] * w + w * 0.06;
      const hi = index === prev.length - 1 ? x0 + w * 0.94 : x0 + prev[index + 1] * w - w * 0.06;
      const next = [...prev];
      next[index] = clamp((svgX - x0) / w, (lo - x0) / w, (hi - x0) / w);
      return next;
    });
  }

  function removeVSplit(index: number) {
    setVSplits((prev) => prev.filter((_, i) => i !== index));
  }

  function addVSplit() {
    setVSplits((prev) => {
      if (prev.length >= 3) return prev;
      const bounds = [0, ...prev, 1];
      let widest = 0;
      let widestGap = 0;
      for (let i = 0; i < bounds.length - 1; i++) {
        const gap = bounds[i + 1] - bounds[i];
        if (gap > widestGap) {
          widestGap = gap;
          widest = i;
        }
      }
      if (widestGap < 0.16) return prev; // no room left to split cleanly
      const mid = (bounds[widest] + bounds[widest + 1]) / 2;
      return [...prev, mid].sort((a, b) => a - b);
    });
  }

  if (isSauna) {
    const splitX = x0 + vSplits[0] * w;
    return (
      <g>
        <line x1={splitX} y1={y0} x2={splitX} y2={y0 + d} stroke={stroke} strokeWidth={1.5} />
        {label('SAUNA', x0 + (splitX - x0) / 2, y0 + d / 2, 'l1')}
        {dim(`${feet(splitX - x0, scale)}' × ${feet(d, scale)}'`, x0 + (splitX - x0) / 2, y0 + d / 2 + 14, 'd1')}
        {label('CHANGE', splitX + (x0 + w - splitX) / 2, y0 + d / 2, 'l2')}
        {dim(`${feet(x0 + w - splitX, scale)}' × ${feet(d, scale)}'`, splitX + (x0 + w - splitX) / 2, y0 + d / 2 + 14, 'd2')}
        <WallHandle
          x={splitX}
          y={y0 + d / 2}
          orientation="v"
          onDrag={(x) => dragVSplit(0, x)}
          removable={false}
          ariaLabel="Wall between sauna and change room — drag to resize"
        />
      </g>
    );
  }

  const rearY = y0 + frontFrac * d;
  const rearH = d - frontFrac * d;
  const bounds = [0, ...vSplits, 1];
  const labels = REAR_LABELS[buildType] ?? REAR_LABELS.cottage;

  return (
    <g>
      {label(FRONT_LABEL[buildType] ?? 'LIVING', x0 + w / 2, y0 + (rearY - y0) / 2 - 6, 'front-l')}
      {dim(`${feet(w, scale)}' × ${feet(rearY - y0, scale)}'`, x0 + w / 2, y0 + (rearY - y0) / 2 + 10, 'front-d')}

      <line x1={x0} y1={rearY} x2={x0 + w} y2={rearY} stroke={stroke} strokeWidth={1.5} />
      <WallHandle
        x={x0 + w / 2}
        y={rearY}
        orientation="h"
        onDrag={(y) => setFrontFrac(clamp((y - y0) / d, 0.28, 0.8))}
        removable={false}
        ariaLabel="Wall between the front room and the rooms behind it — drag to resize"
      />

      {bounds.slice(0, -1).map((start, i) => {
        const end = bounds[i + 1];
        const cx = x0 + ((start + end) / 2) * w;
        const roomW = (end - start) * w;
        return (
          <g key={i}>
            {label(labels[i % labels.length], cx, rearY + rearH / 2 - 6, `r${i}-l`)}
            {dim(`${feet(roomW, scale)}' × ${feet(rearH, scale)}'`, cx, rearY + rearH / 2 + 10, `r${i}-d`)}
          </g>
        );
      })}

      {vSplits.map((frac, i) => (
        <g key={i}>
          <line x1={x0 + frac * w} y1={rearY} x2={x0 + frac * w} y2={y0 + d} stroke={stroke} strokeWidth={1.5} />
          <WallHandle
            x={x0 + frac * w}
            y={rearY + rearH / 2}
            orientation="v"
            onDrag={(x) => dragVSplit(i, x)}
            onRemove={() => removeVSplit(i)}
            removable
            ariaLabel={`Interior wall — drag to resize, or activate to remove it`}
          />
        </g>
      ))}

      {vSplits.length < 3 && (
        <g
          role="button"
          tabIndex={0}
          aria-label="Add a wall, splitting the widest room in two"
          onClick={addVSplit}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), addVSplit())}
          style={{ cursor: 'pointer' }}
          transform={`translate(${x0 + w - 20}, ${rearY + 20})`}
        >
          <circle r="11" fill="#fff" stroke={accent} strokeWidth="1.5" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke={accent} strokeWidth="1.75" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke={accent} strokeWidth="1.75" />
        </g>
      )}
    </g>
  );
}

/* ── Kitchen: counter run + island, with real dimensions ── */

function KitchenZones({
  x0,
  y0,
  w,
  d,
  stroke,
  scale,
}: {
  x0: number;
  y0: number;
  w: number;
  d: number;
  stroke: string;
  scale: number;
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
        y={y0 + d * 0.55 + islandD / 2 - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        fill={stroke}
        opacity="0.55"
      >
        ISLAND
      </text>
      <text
        x={x0 + w / 2}
        y={y0 + d * 0.55 + islandD / 2 + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fill={stroke}
        opacity="0.4"
      >
        {feet(islandW, scale)}&apos; × {feet(islandD, scale)}&apos;
      </text>
      <text x={x0 + w / 2} y={y0 + 6 + counterDepth / 2} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={stroke} opacity="0.55">
        COUNTER RUN — {feet(w - 12, scale)}&apos;
      </text>
    </>
  );
}

/* ── Bathroom: vanity + tub/shower, with real dimensions ── */

function BathZones({
  x0,
  y0,
  w,
  d,
  stroke,
  scale,
}: {
  x0: number;
  y0: number;
  w: number;
  d: number;
  stroke: string;
  scale: number;
}) {
  const vanityW = Math.min(w * 0.4, 60);
  const tubW = Math.min(w * 0.45, 70);
  const tubD = Math.min(d * 0.4, 70);
  return (
    <>
      <rect x={x0 + 6} y={y0 + 6} width={vanityW} height={22} fill="none" stroke={stroke} strokeWidth={1.5} />
      <text x={x0 + 6 + vanityW / 2} y={y0 + 15} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={stroke} opacity="0.55">
        VANITY
      </text>
      <text x={x0 + 6 + vanityW / 2} y={y0 + 25} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={stroke} opacity="0.4">
        {feet(vanityW, scale)}&apos; × {feet(22, scale)}&apos;
      </text>
      <rect
        x={x0 + w - tubW - 6}
        y={y0 + d - tubD - 6}
        width={tubW}
        height={tubD}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <text
        x={x0 + w - tubW / 2 - 6}
        y={y0 + d - tubD / 2 - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fill={stroke}
        opacity="0.55"
      >
        TUB / SHOWER
      </text>
      <text
        x={x0 + w - tubW / 2 - 6}
        y={y0 + d - tubD / 2 + 3}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fill={stroke}
        opacity="0.4"
      >
        {feet(tubW, scale)}&apos; × {feet(tubD, scale)}&apos;
      </text>
    </>
  );
}
