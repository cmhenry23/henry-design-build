'use client';

import { useId } from 'react';

/**
 * A live front-elevation drawing that redraws as the configurator changes.
 * Pure SVG — no canvas, no 3D library, no external assets, so it stays
 * crisp at any size and costs nothing to load.
 *
 * This is deliberately a stylised sketch, not a rendering. It is here to
 * make choices feel real, not to represent a finished design.
 */

/**
 * Which room to draw. Every interior build type used to share one kitchen
 * scene, so asking for a bathroom got you a picture of a kitchen — hence the
 * scene is now explicit rather than a single `isInterior` boolean.
 */
export type PreviewScene = 'exterior' | 'kitchen' | 'bath' | 'room';

interface PreviewProps {
  cladding: { hex: string; trim: string; label: string };
  roof: { hex: string; ribbed: boolean; label: string };
  pitch: number;
  sqft: number;
  sizeRatio: number; // 0..1 within the build type's range
  windows: number;
  hasDeck: boolean;
  hasLoft: boolean;
  hasFireplace: boolean;
  scene: PreviewScene;
}

export default function CabinPreview({
  cladding,
  roof,
  pitch,
  sqft,
  sizeRatio,
  windows,
  hasDeck,
  hasLoft,
  hasFireplace,
  scene,
}: PreviewProps) {
  // Namespaces the gradient and clipPath ids. Without this, two previews on the
  // same page (the intake brief card and the configurator) would share the
  // first one's clip paths and draw each other's geometry.
  const uid = useId().replace(/:/g, '');

  if (scene === 'kitchen') {
    return <KitchenPreview cladding={cladding} sqft={sqft} sizeRatio={sizeRatio} />;
  }
  if (scene === 'bath') {
    return <BathPreview cladding={cladding} sqft={sqft} sizeRatio={sizeRatio} />;
  }
  if (scene === 'room') {
    return <RoomPreview cladding={cladding} sqft={sqft} sizeRatio={sizeRatio} />;
  }

  const VB_W = 800;
  const VB_H = 520;
  const groundY = 430;

  // Building geometry
  const bodyW = 210 + sizeRatio * 330; // 210 → 540
  const wallH = 110 + sizeRatio * 55; // 110 → 165
  const cx = VB_W / 2;
  const left = cx - bodyW / 2;
  const right = cx + bodyW / 2;
  const wallTop = groundY - wallH;
  const ridgeY = wallTop - (bodyW / 2) * pitch;
  const eaveOverhang = 16;

  // Cladding board lines
  const boardLines: number[] = [];
  for (let y = wallTop + 11; y < groundY; y += 11) boardLines.push(y);

  // Roof rib lines (standing seam), drawn parallel to the slope
  const ribs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  if (roof.ribbed) {
    const steps = 13;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      ribs.push({
        x1: cx - (bodyW / 2 + eaveOverhang) * t,
        y1: wallTop + ((bodyW / 2 + eaveOverhang) * t * pitch * 0.98),
        x2: cx,
        y2: ridgeY,
      });
      ribs.push({
        x1: cx + (bodyW / 2 + eaveOverhang) * t,
        y1: wallTop + ((bodyW / 2 + eaveOverhang) * t * pitch * 0.98),
        x2: cx,
        y2: ridgeY,
      });
    }
  }

  // Windows flanking a centred door
  const doorW = 42;
  const doorH = 84;
  const winW = 34;
  const winH = 46;
  const perSide = Math.max(0, Math.round(windows / 2));
  const sideSpan = (bodyW - doorW) / 2 - 26;
  const winSlot = perSide > 0 ? sideSpan / perSide : 0;

  const leftWindows = Array.from({ length: perSide }, (_, i) => {
    const slotCenter = left + 18 + winSlot * (i + 0.5);
    return Math.min(slotCenter, cx - doorW / 2 - winW - 10);
  });
  const rightWindows = leftWindows.map((x) => cx + (cx - x) - winW);

  const deckTop = groundY + 4;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Sketch of a building with ${cladding.label.toLowerCase()} cladding and a ${roof.label.toLowerCase()} roof, approximately ${sqft} square feet${hasDeck ? ', with a deck' : ''}${hasLoft ? ', with a loft window' : ''}${hasFireplace ? ', with a chimney' : ''}.`}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2733" />
          <stop offset="55%" stopColor="#31414C" />
          <stop offset="100%" stopColor="#5B6559" />
        </linearGradient>
        <linearGradient id={`glow-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2C879" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E8A94F" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`roofShade-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <clipPath id={`wallClip-${uid}`}>
          <rect x={left} y={wallTop} width={bodyW} height={wallH} />
        </clipPath>
        <clipPath id={`roofClip-${uid}`}>
          <polygon
            points={`${cx},${ridgeY} ${right + eaveOverhang},${wallTop + eaveOverhang * pitch} ${left - eaveOverhang},${wallTop + eaveOverhang * pitch}`}
          />
        </clipPath>
      </defs>

      {/* Sky and moon */}
      <rect width={VB_W} height={VB_H} fill={`url(#sky-${uid})`} />
      <circle cx="655" cy="88" r="26" fill="#F6F2EB" opacity="0.14" />

      {/* Far treeline */}
      <g opacity="0.45" fill="#16211C">
        {Array.from({ length: 30 }).map((_, i) => {
          const x = i * 28 - 10;
          const h = 74 + ((i * 37) % 62);
          return <polygon key={i} points={`${x},${groundY} ${x + 15},${groundY - h} ${x + 30},${groundY}`} />;
        })}
      </g>
      {/* Near treeline */}
      <g opacity="0.75" fill="#0E1714">
        {Array.from({ length: 20 }).map((_, i) => {
          const x = i * 43 - 20;
          const h = 100 + ((i * 53) % 86);
          return <polygon key={i} points={`${x},${groundY + 8} ${x + 22},${groundY - h} ${x + 44},${groundY + 8}`} />;
        })}
      </g>

      {/* Ground */}
      <rect x="0" y={groundY} width={VB_W} height={VB_H - groundY} fill="#232B24" />
      <rect x="0" y={groundY} width={VB_W} height="3" fill="#000" opacity="0.3" />

      {/* Deck — railing splits either side of the door so the entry stays clear */}
      {hasDeck && (
        <g>
          <rect
            x={left - 46}
            y={deckTop}
            width={bodyW + 92}
            height="9"
            fill={cladding.hex}
            opacity="0.85"
          />
          <rect x={left - 46} y={deckTop + 9} width={bodyW + 92} height="20" fill="#000" opacity="0.35" />
          {Array.from({ length: 9 })
            .map((_, i) => left - 44 + i * ((bodyW + 88) / 9))
            .filter((x) => Math.abs(x - cx) > doorW)
            .map((x) => (
              <rect
                key={x}
                x={x}
                y={deckTop - 30}
                width="3"
                height="30"
                fill={cladding.trim}
                opacity="0.55"
              />
            ))}
          <rect
            x={left - 46}
            y={deckTop - 33}
            width={bodyW / 2 + 46 - doorW}
            height="4"
            fill={cladding.trim}
            opacity="0.75"
          />
          <rect
            x={cx + doorW}
            y={deckTop - 33}
            width={bodyW / 2 + 46 - doorW}
            height="4"
            fill={cladding.trim}
            opacity="0.75"
          />
          {/* Steps down from the doorway */}
          <rect x={cx - doorW / 2 - 6} y={deckTop + 9} width={doorW + 12} height="7" fill={cladding.hex} opacity="0.7" />
          <rect x={cx - doorW / 2 - 12} y={deckTop + 16} width={doorW + 24} height="7" fill={cladding.hex} opacity="0.55" />
        </g>
      )}

      {/* Walls */}
      <rect x={left} y={wallTop} width={bodyW} height={wallH} fill={cladding.hex} />
      <g clipPath={`url(#wallClip-${uid})`} stroke="#000" strokeOpacity="0.14" strokeWidth="1">
        {boardLines.map((y) => (
          <line key={y} x1={left} y1={y} x2={right} y2={y} />
        ))}
      </g>
      {/* Corner trim boards */}
      <rect x={left} y={wallTop} width="9" height={wallH} fill={cladding.trim} opacity="0.9" />
      <rect x={right - 9} y={wallTop} width="9" height={wallH} fill={cladding.trim} opacity="0.9" />

      {/* Chimney */}
      {hasFireplace && (
        <g>
          <rect x={right - 62} y={ridgeY + 4} width="28" height={wallTop - ridgeY + 30} fill="#6E6660" />
          <rect x={right - 66} y={ridgeY} width="36" height="10" fill="#57504B" />
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={right - 62}
              y1={ridgeY + 16 + i * 13}
              x2={right - 34}
              y2={ridgeY + 16 + i * 13}
              stroke="#000"
              strokeOpacity="0.2"
            />
          ))}
        </g>
      )}

      {/* Roof */}
      <polygon
        points={`${cx},${ridgeY} ${right + eaveOverhang},${wallTop + eaveOverhang * pitch} ${left - eaveOverhang},${wallTop + eaveOverhang * pitch}`}
        fill={roof.hex}
      />
      <g clipPath={`url(#roofClip-${uid})`}>
        {roof.ribbed &&
          ribs.map((r, i) => (
            <line
              key={i}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke="#fff"
              strokeOpacity="0.11"
              strokeWidth="1.5"
            />
          ))}
        {!roof.ribbed &&
          Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={left - eaveOverhang}
              y1={ridgeY + ((wallTop - ridgeY) / 12) * i + 6}
              x2={right + eaveOverhang}
              y2={ridgeY + ((wallTop - ridgeY) / 12) * i + 6}
              stroke="#000"
              strokeOpacity="0.16"
              strokeWidth="2"
            />
          ))}
        <polygon
          points={`${cx},${ridgeY} ${right + eaveOverhang},${wallTop + eaveOverhang * pitch} ${left - eaveOverhang},${wallTop + eaveOverhang * pitch}`}
          fill={`url(#roofShade-${uid})`}
        />
      </g>
      {/* Fascia */}
      <line
        x1={left - eaveOverhang}
        y1={wallTop + eaveOverhang * pitch}
        x2={cx}
        y2={ridgeY}
        stroke={cladding.trim}
        strokeWidth="5"
      />
      <line
        x1={right + eaveOverhang}
        y1={wallTop + eaveOverhang * pitch}
        x2={cx}
        y2={ridgeY}
        stroke={cladding.trim}
        strokeWidth="5"
      />

      {/* Gable / loft window */}
      {hasLoft && ridgeY < wallTop - 46 && (
        <g>
          <rect x={cx - 22} y={wallTop - 40} width="44" height="30" fill={cladding.trim} />
          <rect x={cx - 18} y={wallTop - 36} width="36" height="22" fill={`url(#glow-${uid})`} />
          <line x1={cx} y1={wallTop - 36} x2={cx} y2={wallTop - 14} stroke={cladding.trim} strokeWidth="2.5" />
        </g>
      )}

      {/* Windows */}
      {[...leftWindows, ...rightWindows].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={groundY - 96} width={winW + 6} height={winH + 6} fill={cladding.trim} />
          <rect x={x} y={groundY - 93} width={winW} height={winH} fill={`url(#glow-${uid})`} />
          <line
            x1={x + winW / 2}
            y1={groundY - 93}
            x2={x + winW / 2}
            y2={groundY - 93 + winH}
            stroke={cladding.trim}
            strokeWidth="2"
          />
          {/* Light spilling onto the ground */}
          <polygon
            points={`${x},${groundY} ${x + winW},${groundY} ${x + winW + 16},${groundY + 26} ${x - 16},${groundY + 26}`}
            fill="#F2C879"
            opacity="0.07"
          />
        </g>
      ))}

      {/* Door */}
      <rect
        x={cx - doorW / 2 - 4}
        y={groundY - doorH - 4}
        width={doorW + 8}
        height={doorH + 4}
        fill={cladding.trim}
        stroke="#000"
        strokeOpacity="0.25"
      />
      <rect
        x={cx - doorW / 2}
        y={groundY - doorH}
        width={doorW}
        height={doorH}
        fill="#F2F0EC"
        stroke="#000"
        strokeOpacity="0.22"
      />
      <rect x={cx - doorW / 2 + 7} y={groundY - doorH + 9} width={doorW - 14} height="20" fill="#2B2E33" />
      <line
        x1={cx - doorW / 2 + 7}
        y1={groundY - doorH + 19}
        x2={cx + doorW / 2 - 7}
        y2={groundY - doorH + 19}
        stroke="#F2F0EC"
        strokeWidth="1.5"
      />
      <line
        x1={cx}
        y1={groundY - doorH + 9}
        x2={cx}
        y2={groundY - doorH + 29}
        stroke="#F2F0EC"
        strokeWidth="1.5"
      />
      <circle cx={cx + doorW / 2 - 8} cy={groundY - doorH / 2 + 6} r="2.5" fill="#8A8F94" />

      {/* Sconce */}
      <circle cx={cx} cy={wallTop + 22} r="4" fill="#F2C879" opacity="0.9" />
      <circle cx={cx} cy={wallTop + 22} r="13" fill="#F2C879" opacity="0.14" />

      {/* Scale figure — gives the size slider meaning */}
      <g opacity="0.5" fill="#0B0F0D" transform={`translate(${right + 52}, ${groundY})`}>
        <circle cx="0" cy="-62" r="6" />
        <rect x="-5" y="-55" width="10" height="30" rx="4" />
        <rect x="-5" y="-26" width="4" height="26" rx="2" />
        <rect x="1" y="-26" width="4" height="26" rx="2" />
      </g>
    </svg>
  );
}

/**
 * Swatch names are written for exterior cladding ("Charcoal board"), which
 * reads oddly on indoor joinery. Drop the material noun for interior scenes.
 */
function joinery(label: string) {
  return label.toLowerCase().replace(/ (board|white)$/, '');
}

/* ── Kitchen: counter run, chimney hood, island, pendants ── */

function KitchenPreview({
  cladding,
  sqft,
  sizeRatio,
}: {
  cladding: { hex: string; trim: string; label: string };
  sqft: number;
  sizeRatio: number;
}) {
  const uid = useId().replace(/:/g, '');
  const VB_W = 800;
  const VB_H = 520;
  const floorY = 400;
  const roomW = 460 + sizeRatio * 260;
  const cx = VB_W / 2;
  const left = cx - roomW / 2;
  const right = cx + roomW / 2;
  const ceilY = 70;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Sketch of a renovated kitchen roughly ${sqft} square feet, with ${joinery(cladding.label)} cabinetry, a chimney hood, an island and pendant lighting.`}
    >
      <defs>
        <linearGradient id={`wallGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6E1D8" />
          <stop offset="100%" stopColor="#CFC8BC" />
        </linearGradient>
        <linearGradient id={`winGlow-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BBD3D8" />
          <stop offset="100%" stopColor="#8FA98C" />
        </linearGradient>
        <linearGradient id={`floorGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6A177" />
          <stop offset="100%" stopColor="#A9855C" />
        </linearGradient>
      </defs>

      <rect width={VB_W} height={VB_H} fill="#1B1917" />

      {/* Back wall */}
      <rect x={left} y={ceilY} width={roomW} height={floorY - ceilY} fill={`url(#wallGrad-${uid})`} />

      {/* Tile splash band */}
      <rect x={left} y={floorY - 168} width={roomW} height="84" fill="#F1EDE6" />
      <g stroke="#000" strokeOpacity="0.07" strokeWidth="1">
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1={left}
            y1={floorY - 168 + i * 12}
            x2={right}
            y2={floorY - 168 + i * 12}
          />
        ))}
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={left + i * (roomW / 22) + ((i % 2) * roomW) / 44}
            y1={floorY - 168}
            x2={left + i * (roomW / 22) + ((i % 2) * roomW) / 44}
            y2={floorY - 84}
          />
        ))}
      </g>

      {/* Window */}
      <rect x={cx - 90} y={floorY - 166} width="180" height="80" fill={cladding.trim} />
      <rect x={cx - 82} y={floorY - 158} width="164" height="64" fill={`url(#winGlow-${uid})`} />
      <line x1={cx} y1={floorY - 158} x2={cx} y2={floorY - 94} stroke={cladding.trim} strokeWidth="4" />

      {/* Base cabinets */}
      <rect x={left} y={floorY - 84} width={roomW} height="84" fill={cladding.hex} />
      <rect x={left} y={floorY - 92} width={roomW} height="10" fill="#F1EDE6" />
      <g stroke="#000" strokeOpacity="0.18" strokeWidth="1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={left + (i + 1) * (roomW / 7)}
            y1={floorY - 82}
            x2={left + (i + 1) * (roomW / 7)}
            y2={floorY}
          />
        ))}
      </g>
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x={left + i * (roomW / 7) + roomW / 21}
          y={floorY - 62}
          width={roomW / 10}
          height="4"
          rx="2"
          fill="#1B1917"
          opacity="0.7"
        />
      ))}

      {/* Upper shelf */}
      <rect x={left + 26} y={floorY - 232} width={roomW * 0.32} height="9" fill="#7A5433" />
      <rect x={left + 26} y={floorY - 202} width={roomW * 0.32} height="9" fill="#7A5433" />
      <rect x={left + 26} y={floorY - 223} width={roomW * 0.32} height="3" fill="#F2C879" opacity="0.55" />

      {/* Range hood */}
      <polygon
        points={`${right - 130},${floorY - 168} ${right - 46},${floorY - 168} ${right - 62},${floorY - 210} ${right - 114},${floorY - 210}`}
        fill="#2B2E33"
      />
      <rect x={right - 96} y={floorY - 262} width="28" height="54" fill="#2B2E33" />

      {/* Island */}
      <rect x={cx - 150} y={floorY + 40} width="300" height="14" fill="#F1EDE6" />
      <rect x={cx - 142} y={floorY + 54} width="284" height="66" fill={cladding.hex} />
      <g stroke="#000" strokeOpacity="0.18" strokeWidth="1.5">
        <line x1={cx - 47} y1={floorY + 56} x2={cx - 47} y2={floorY + 120} />
        <line x1={cx + 47} y1={floorY + 56} x2={cx + 47} y2={floorY + 120} />
      </g>

      {/* Floor */}
      <rect x="0" y={floorY} width={VB_W} height={VB_H - floorY} fill={`url(#floorGrad-${uid})`} />
      <g stroke="#000" strokeOpacity="0.13" strokeWidth="1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 100 - 60} y1={VB_H} x2={cx - 200 + i * 60} y2={floorY} />
        ))}
      </g>
      <rect x="0" y={floorY} width={VB_W} height={VB_H - floorY} fill="#1B1917" opacity="0.12" />

      {/* Pendants */}
      {[-90, 0, 90].map((dx) => (
        <g key={dx}>
          <line x1={cx + dx} y1={ceilY} x2={cx + dx} y2={floorY - 14} stroke="#2B2E33" strokeWidth="2" />
          <circle cx={cx + dx} cy={floorY - 6} r="11" fill="#F2C879" opacity="0.9" />
          <circle cx={cx + dx} cy={floorY - 6} r="26" fill="#F2C879" opacity="0.12" />
        </g>
      ))}
    </svg>
  );
}

/* ── Bathroom: vanity, mirror, sconce, tub behind a reeded glass screen ──
   Drawn after the Aubergine Bath project — deep wall colour, large-format
   porcelain, reeded glass in a black frame, and a recessed niche. */

function BathPreview({
  cladding,
  sqft,
  sizeRatio,
}: {
  cladding: { hex: string; trim: string; label: string };
  sqft: number;
  sizeRatio: number;
}) {
  const uid = useId().replace(/:/g, '');
  const VB_W = 800;
  const VB_H = 520;
  const floorY = 405;
  const ceilY = 60;
  const roomW = 430 + sizeRatio * 250;
  const cx = VB_W / 2;
  const left = cx - roomW / 2;
  const right = cx + roomW / 2;

  // Tub + screen on the left, vanity on the right.
  const tubW = roomW * 0.46;
  const tubLeft = left + 14;
  const tubRight = tubLeft + tubW;
  const vanityW = Math.min(roomW * 0.34, 190);
  const vanityLeft = right - vanityW - 18;

  const tileRows = 5;
  const tileCols = 4;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Sketch of a renovated bathroom roughly ${sqft} square feet, with a ${joinery(cladding.label)} vanity, a tiled tub surround behind a reeded glass screen, and a mirror over the sink.`}
    >
      <defs>
        <linearGradient id={`bathWall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3446" />
          <stop offset="100%" stopColor="#3A2838" />
        </linearGradient>
        <linearGradient id={`marble-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2EEE9" />
          <stop offset="55%" stopColor="#E4DED6" />
          <stop offset="100%" stopColor="#EFEAE3" />
        </linearGradient>
        <linearGradient id={`bathFloor-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0DAD2" />
          <stop offset="100%" stopColor="#C3BBB1" />
        </linearGradient>
        <linearGradient id={`reeded-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCE4E2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#C2CCCB" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect width={VB_W} height={VB_H} fill="#1B1917" />

      {/* Painted walls */}
      <rect x={left} y={ceilY} width={roomW} height={floorY - ceilY} fill={`url(#bathWall-${uid})`} />

      {/* Tiled wet wall behind the tub */}
      <rect x={tubLeft} y={ceilY + 20} width={tubW} height={floorY - ceilY - 20} fill={`url(#marble-${uid})`} />
      <g stroke="#B9B0A6" strokeOpacity="0.55" strokeWidth="1.2">
        {Array.from({ length: tileRows }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={tubLeft}
            y1={ceilY + 20 + ((floorY - ceilY - 20) / tileRows) * (i + 1)}
            x2={tubRight}
            y2={ceilY + 20 + ((floorY - ceilY - 20) / tileRows) * (i + 1)}
          />
        ))}
        {Array.from({ length: tileCols }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={tubLeft + (tubW / tileCols) * (i + 1)}
            y1={ceilY + 20}
            x2={tubLeft + (tubW / tileCols) * (i + 1)}
            y2={floorY}
          />
        ))}
      </g>

      {/* Recessed niche */}
      <rect x={tubLeft + tubW * 0.16} y={floorY - 190} width={tubW * 0.42} height="54" fill="#CFC7BC" />
      <rect x={tubLeft + tubW * 0.16 + 4} y={floorY - 186} width={tubW * 0.42 - 8} height="46" fill="#B4ABA0" />
      <rect x={tubLeft + tubW * 0.16 + 4} y={floorY - 164} width={tubW * 0.42 - 8} height="3" fill="#8E867C" />

      {/* Tub */}
      <rect x={tubLeft} y={floorY - 78} width={tubW} height="78" fill="#F6F3EF" />
      <rect x={tubLeft} y={floorY - 78} width={tubW} height="8" fill="#FFFFFF" />
      <rect x={tubLeft + 6} y={floorY - 68} width={tubW - 12} height="62" fill="#EAE5DE" />

      {/* Reeded glass screen in a black frame */}
      <rect x={tubLeft} y={floorY - 250} width={tubW} height="176" fill={`url(#reeded-${uid})`} />
      <g stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.5">
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={tubLeft + (tubW / 22) * i + 3}
            y1={floorY - 250}
            x2={tubLeft + (tubW / 22) * i + 3}
            y2={floorY - 74}
          />
        ))}
      </g>
      <rect x={tubLeft - 4} y={floorY - 254} width={tubW + 8} height="8" fill="#22221F" />
      <rect x={tubLeft - 4} y={floorY - 254} width="7" height="184" fill="#22221F" />
      <rect x={tubRight - 3} y={floorY - 254} width="7" height="184" fill="#22221F" />
      <rect x={tubLeft + tubW / 2 - 3} y={floorY - 250} width="5" height="176" fill="#22221F" opacity="0.85" />
      <rect x={tubLeft + tubW * 0.18} y={floorY - 168} width={tubW * 0.3} height="5" rx="2.5" fill="#22221F" />

      {/* Vanity — cladding colour stands in for the cabinetry */}
      <rect x={vanityLeft} y={floorY - 96} width={vanityW} height="96" fill={cladding.hex} />
      <rect x={vanityLeft - 5} y={floorY - 106} width={vanityW + 10} height="12" fill="#F4F1EC" />
      {/* Fluted front */}
      <g stroke="#000" strokeOpacity="0.16" strokeWidth="1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={i}
            x1={vanityLeft + (vanityW / 9) * (i + 0.5)}
            y1={floorY - 92}
            x2={vanityLeft + (vanityW / 9) * (i + 0.5)}
            y2={floorY}
          />
        ))}
      </g>
      {/* Basin + tap */}
      <rect x={vanityLeft + vanityW * 0.22} y={floorY - 104} width={vanityW * 0.56} height="9" rx="3" fill="#E7E2DA" />
      <rect x={vanityLeft + vanityW / 2 - 2} y={floorY - 128} width="4" height="24" fill="#2B2E33" />
      <rect x={vanityLeft + vanityW / 2 - 2} y={floorY - 130} width="22" height="4" fill="#2B2E33" />

      {/* Mirror + sconce */}
      <rect x={vanityLeft + 6} y={floorY - 262} width={vanityW - 12} height="118" fill="#22221F" />
      <rect x={vanityLeft + 12} y={floorY - 256} width={vanityW - 24} height="106" fill="#5C6A6B" opacity="0.55" />
      <rect x={vanityLeft + 12} y={floorY - 256} width={vanityW - 24} height="34" fill="#7E8C8B" opacity="0.35" />
      {[0.3, 0.5, 0.7].map((t) => (
        <g key={t}>
          <circle cx={vanityLeft + vanityW * t} cy={floorY - 282} r="8" fill="#F2C879" opacity="0.92" />
          <circle cx={vanityLeft + vanityW * t} cy={floorY - 282} r="20" fill="#F2C879" opacity="0.13" />
        </g>
      ))}
      <rect x={vanityLeft + vanityW * 0.28} y={floorY - 292} width={vanityW * 0.44} height="3" fill="#2B2E33" />

      {/* Floor */}
      <rect x="0" y={floorY} width={VB_W} height={VB_H - floorY} fill={`url(#bathFloor-${uid})`} />
      <g stroke="#8E867C" strokeOpacity="0.35" strokeWidth="1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={i * 130 - 90} y1={VB_H} x2={cx - 150 + i * 55} y2={floorY} />
        ))}
        <line x1="0" y1={floorY + 42} x2={VB_W} y2={floorY + 42} />
        <line x1="0" y1={floorY + 92} x2={VB_W} y2={floorY + 92} />
      </g>
      <rect x="0" y={floorY} width={VB_W} height={VB_H - floorY} fill="#1B1917" opacity="0.1" />
    </svg>
  );
}

/* ── Generic room: the neutral scene for a whole-home renovation ── */

function RoomPreview({
  cladding,
  sqft,
  sizeRatio,
}: {
  cladding: { hex: string; trim: string; label: string };
  sqft: number;
  sizeRatio: number;
}) {
  const uid = useId().replace(/:/g, '');
  const VB_W = 800;
  const VB_H = 520;
  const floorY = 400;
  const ceilY = 62;
  const roomW = 470 + sizeRatio * 250;
  const cx = VB_W / 2;
  const left = cx - roomW / 2;
  const right = cx + roomW / 2;

  const winW = roomW * 0.26;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Sketch of a renovated room roughly ${sqft} square feet, with two trimmed windows, ${joinery(cladding.label)} built-in shelving and wide plank floors.`}
    >
      <defs>
        <linearGradient id={`roomWall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFEBE3" />
          <stop offset="100%" stopColor="#D8D2C8" />
        </linearGradient>
        <linearGradient id={`roomWin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BBD3D8" />
          <stop offset="100%" stopColor="#8FA98C" />
        </linearGradient>
        <linearGradient id={`roomFloor-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6A177" />
          <stop offset="100%" stopColor="#A9855C" />
        </linearGradient>
      </defs>

      <rect width={VB_W} height={VB_H} fill="#1B1917" />
      <rect x={left} y={ceilY} width={roomW} height={floorY - ceilY} fill={`url(#roomWall-${uid})`} />

      {/* Ceiling line + cornice */}
      <rect x={left} y={ceilY} width={roomW} height="9" fill="#F6F3EE" />

      {/* Two trimmed windows */}
      {[left + roomW * 0.1, right - roomW * 0.1 - winW].map((x, i) => (
        <g key={i}>
          <rect x={x - 7} y={floorY - 232} width={winW + 14} height="152" fill="#F6F3EE" />
          <rect x={x} y={floorY - 225} width={winW} height="138" fill={`url(#roomWin-${uid})`} />
          <line
            x1={x + winW / 2}
            y1={floorY - 225}
            x2={x + winW / 2}
            y2={floorY - 87}
            stroke="#F6F3EE"
            strokeWidth="4"
          />
          <line x1={x} y1={floorY - 156} x2={x + winW} y2={floorY - 156} stroke="#F6F3EE" strokeWidth="4" />
          <rect x={x - 12} y={floorY - 80} width={winW + 24} height="9" fill="#F6F3EE" />
        </g>
      ))}

      {/* Built-in shelving between the windows — cladding colour as the joinery */}
      <rect x={cx - roomW * 0.13} y={floorY - 210} width={roomW * 0.26} height="210" fill={cladding.hex} />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={i}
          x={cx - roomW * 0.13}
          y={floorY - 210 + 44 * (i + 1)}
          width={roomW * 0.26}
          height="6"
          fill="#F4F1EC"
          opacity="0.75"
        />
      ))}
      <rect x={cx - roomW * 0.13} y={floorY - 216} width={roomW * 0.26} height="9" fill="#F4F1EC" />

      {/* Baseboard */}
      <rect x={left} y={floorY - 16} width={roomW} height="16" fill="#F6F3EE" />

      {/* Floor */}
      <rect x="0" y={floorY} width={VB_W} height={VB_H - floorY} fill={`url(#roomFloor-${uid})`} />
      <g stroke="#000" strokeOpacity="0.13" strokeWidth="1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 100 - 60} y1={VB_H} x2={cx - 200 + i * 60} y2={floorY} />
        ))}
      </g>
      <rect x="0" y={floorY} width={VB_W} height={VB_H - floorY} fill="#1B1917" opacity="0.12" />

      {/* Ceiling fixture */}
      <line x1={cx} y1={ceilY + 9} x2={cx} y2={ceilY + 42} stroke="#2B2E33" strokeWidth="2" />
      <circle cx={cx} cy={ceilY + 48} r="11" fill="#F2C879" opacity="0.9" />
      <circle cx={cx} cy={ceilY + 48} r="26" fill="#F2C879" opacity="0.12" />
    </svg>
  );
}
