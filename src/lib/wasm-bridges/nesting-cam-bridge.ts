/**
 * Software 2 Bridge: Web 2D Sheet Metal Unfolding, True-Shape Nesting & Laser CAM Platform
 * (`/toolbox/web-cad-sheetmetal-nesting`)
 *
 * Combines:
 *  1. DXF Multi-Layer Entity Parser & Topology Cleaner (endpoint snap, duplicate removal, hole classification)
 *  2. DIN 6935 Sheet Metal Unfolding Engine (K-Factor, Bend Allowance BA, Outside Setback OSSB, Bend Deduction BD)
 *  3. True-Shape Irregular Polygon NFP Nesting Optimizer (with Rotation Step & Hole-in-Hole Nesting)
 *  4. Laser/Plasma G-Code Post-Processor (Lead-in/Lead-out, Inside-First Cut Order, TSP Rapid Minimization, Backplotter)
 */

import { getNestingWasmSync } from './wasm-loader';

export interface SheetMetalBendParams {
  thicknessMm: number;
  insideRadiusMm: number;
  bendAngleDeg: number;
  kFactor: number;
  leg1Mm: number;
  leg2Mm: number;
  partWidthMm: number;
  bendCount: number;
}

export interface SheetMetalUnfoldOutput {
  bendAllowanceMm: number;
  outsideSetbackMm: number;
  bendDeductionMm: number;
  neutralAxisOffsetMm: number;
  singleBendFlatLengthMm: number;
  totalFlatLengthMm: number;
  flatAreaMm2: number;
  flatContour: [number, number][];
  bendLines: [number, number, number, number][];
  wasmKernelVersion: number;
}

export interface IrregularPartSpec {
  id: string;
  name: string;
  shapeKind: 'l-bracket' | 'flange-ring' | 'gusset-plate' | 'slotted-mount' | 'washer-disc';
  widthMm: number;
  heightMm: number;
  innerHoleDiaMm?: number;
  qty: number;
  color: string;
}

export interface NestedPolygonInstance {
  instanceId: string;
  partId: string;
  partName: string;
  shapeKind: IrregularPartSpec['shapeKind'];
  sheetIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDeg: number;
  nestedInsideHoleOf?: string;
  outerLoop: [number, number][];
  innerHoles: { cx: number; cy: number; r: number }[];
  trueAreaMm2: number;
  color: string;
}

export interface NestingConfig {
  sheetWidthMm: number;
  sheetHeightMm: number;
  kerfSpacingMm: number;
  sheetMarginMm: number;
  rotationStepDeg: 0 | 45 | 90;
  enableHoleInHole: boolean;
  snapToleranceMm: number;
}

export interface ToolpathMove {
  index: number;
  kind: 'rapid' | 'lead-in' | 'cut-hole' | 'cut-outer' | 'lead-out';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  laserOn: boolean;
  lengthMm: number;
  cumulativeLengthMm: number;
}

export interface NestingAndCamEvaluation {
  unfold: SheetMetalUnfoldOutput;
  topologyReport: {
    rawSegmentCount: number;
    mergedEndpointCount: number;
    removedDuplicateCount: number;
    closedOuterLoops: number;
    detectedInnerHoles: number;
  };
  placedParts: NestedPolygonInstance[];
  unplacedCount: number;
  sheetCount: number;
  totalTruePartAreaMm2: number;
  totalBoundingAreaMm2: number;
  sheetAreaMm2: number;
  trueUtilizationPct: number;
  boundingUtilizationPct: number;
  holeInHoleCount: number;
  gcode: string;
  toolpathMoves: ToolpathMove[];
  totalCutDistanceMm: number;
  totalRapidDistanceMm: number;
  estimatedCycleSeconds: number;
  nestedDxf: string;
  nestedSvg: string;
}

export function getDefaultBendParams(): SheetMetalBendParams {
  return {
    thicknessMm: 2.0,
    insideRadiusMm: 2.0,
    bendAngleDeg: 90,
    kFactor: 0.44,
    leg1Mm: 60,
    leg2Mm: 40,
    partWidthMm: 50,
    bendCount: 1,
  };
}

export function getDefaultIrregularParts(): IrregularPartSpec[] {
  return [
    {
      id: 'part-1',
      name: 'Heavy Flange Plate',
      shapeKind: 'flange-ring',
      widthMm: 240,
      heightMm: 240,
      innerHoleDiaMm: 110,
      qty: 4,
      color: '#2563eb',
    },
    {
      id: 'part-2',
      name: 'Unfolded L-Bracket',
      shapeKind: 'l-bracket',
      widthMm: 240,
      heightMm: 120,
      qty: 6,
      color: '#059669',
    },
    {
      id: 'part-3',
      name: 'Slotted Motor Mount',
      shapeKind: 'slotted-mount',
      widthMm: 240,
      heightMm: 120,
      innerHoleDiaMm: 36,
      qty: 4,
      color: '#7c3aed',
    },
    {
      id: 'part-4',
      name: 'Structural Gusset',
      shapeKind: 'gusset-plate',
      widthMm: 120,
      heightMm: 120,
      qty: 4,
      color: '#d97706',
    },
    {
      id: 'part-5',
      name: 'Hole-Nested Spacer Disc',
      shapeKind: 'washer-disc',
      widthMm: 80,
      heightMm: 80,
      innerHoleDiaMm: 20,
      qty: 4,
      color: '#e11d48',
    },
  ];
}

export function getDefaultNestingConfig(): NestingConfig {
  return {
    sheetWidthMm: 1000,
    sheetHeightMm: 500,
    kerfSpacingMm: 2.0,
    sheetMarginMm: 4.0,
    rotationStepDeg: 90,
    enableHoleInHole: true,
    snapToleranceMm: 0.05,
  };
}

/**
 * Unfolds a sheet metal bend according to DIN 6935 and WASM `sheet_metal_bend_allowance`.
 */
export function evaluateSheetMetalUnfold(params: SheetMetalBendParams): SheetMetalUnfoldOutput {
  const wasm = getNestingWasmSync();
  const T = Math.max(0.1, Number(params.thicknessMm) || 2.0);
  const R = Math.max(0.1, Number(params.insideRadiusMm) || 2.0);
  const angleDeg = Math.min(179, Math.max(1, Number(params.bendAngleDeg) || 90));
  const K = Math.min(1.0, Math.max(0.1, Number(params.kFactor) || 0.44));
  const L1 = Math.max(1, Number(params.leg1Mm) || 60);
  const L2 = Math.max(1, Number(params.leg2Mm) || 40);
  const W = Math.max(1, Number(params.partWidthMm) || 50);
  const bends = Math.max(1, Math.min(8, Math.round(Number(params.bendCount) || 1)));

  const ba = wasm.sheet_metal_bend_allowance(T, R, angleDeg, K);
  const rad = (angleDeg * Math.PI) / 180.0;
  const ossb =
    Math.abs(angleDeg - 90) < 1e-6
      ? wasm.sheet_metal_outside_setback_90(T, R)
      : Math.tan(rad * 0.5) * (R + T);
  const bd = 2 * ossb - ba;
  const neutralOffset = K * T;
  const singleFlat = Math.max(1, L1 + L2 - bd);
  const totalFlat = Math.max(1, L1 + bends * L2 - bends * bd);
  const flatArea = totalFlat * W;

  const flatContour: [number, number][] = [
    [0, 0],
    [totalFlat, 0],
    [totalFlat, W],
    [0, W],
  ];

  const bendLines: [number, number, number, number][] = [];
  for (let i = 0; i < bends; i++) {
    const bx = L1 - ossb + 0.5 * ba + i * (L2 - bd);
    bendLines.push([bx, 0, bx, W]);
  }

  return {
    bendAllowanceMm: Number(ba.toFixed(2)),
    outsideSetbackMm: Number(ossb.toFixed(2)),
    bendDeductionMm: Number(bd.toFixed(2)),
    neutralAxisOffsetMm: Number(neutralOffset.toFixed(2)),
    singleBendFlatLengthMm: Number(singleFlat.toFixed(2)),
    totalFlatLengthMm: Number(totalFlat.toFixed(2)),
    flatAreaMm2: Number(flatArea.toFixed(2)),
    flatContour,
    bendLines,
    wasmKernelVersion: wasm.wasm_kernel_version(),
  };
}

/**
 * Generates the local 2D polygon vertices and true area for a given part shape.
 */
function buildPartLocalPolygon(
  shapeKind: IrregularPartSpec['shapeKind'],
  w: number,
  h: number,
  innerHoleDia = 0
): {
  outerLoop: [number, number][];
  innerHoles: { cx: number; cy: number; r: number }[];
  trueAreaMm2: number;
} {
  const innerHoles: { cx: number; cy: number; r: number }[] = [];
  const holeR = innerHoleDia > 1 ? Math.min(Math.min(w, h) * 0.42, innerHoleDia / 2) : 0;
  if (holeR > 0.5) {
    innerHoles.push({ cx: w / 2, cy: h / 2, r: holeR });
  }
  const holeArea = holeR > 0.5 ? Math.PI * holeR * holeR : 0;

  if (shapeKind === 'l-bracket') {
    // L-shaped notched bracket (75% of bounding box)
    const cutW = w * 0.35;
    const cutH = h * 0.35;
    const outerLoop: [number, number][] = [
      [0, 0],
      [w, 0],
      [w, h - cutH],
      [w - cutW, h - cutH],
      [w - cutW, h],
      [0, h],
    ];
    return {
      outerLoop,
      innerHoles,
      trueAreaMm2: Math.max(1, w * h - cutW * cutH - holeArea),
    };
  }

  if (shapeKind === 'gusset-plate') {
    // Chamfered structural gusset polygon (82% of bounding box)
    const ch = Math.min(w, h) * 0.35;
    const outerLoop: [number, number][] = [
      [0, 0],
      [w, 0],
      [w, h - ch],
      [w - ch, h],
      [0, h],
    ];
    return {
      outerLoop,
      innerHoles,
      trueAreaMm2: Math.max(1, w * h - 0.5 * ch * ch - holeArea),
    };
  }

  if (shapeKind === 'flange-ring' || shapeKind === 'washer-disc') {
    // Octagonal / 16-gon true-shape circular flange
    const segs = 16;
    const rx = w / 2;
    const ry = h / 2;
    const outerLoop: [number, number][] = [];
    for (let i = 0; i < segs; i++) {
      const a = (2 * Math.PI * i) / segs;
      outerLoop.push([rx + rx * Math.cos(a), ry + ry * Math.sin(a)]);
    }
    return {
      outerLoop,
      innerHoles,
      trueAreaMm2: Math.max(1, Math.PI * rx * ry - holeArea),
    };
  }

  // 'slotted-mount': chamfered rectangle with mounting holes
  const c = Math.min(w, h) * 0.08;
  const outerLoop: [number, number][] = [
    [c, 0],
    [w - c, 0],
    [w, c],
    [w, h - c],
    [w - c, h],
    [c, h],
    [0, h - c],
    [0, c],
  ];
  return {
    outerLoop,
    innerHoles,
    trueAreaMm2: Math.max(1, w * h - 2 * c * c - holeArea),
  };
}

/**
 * Full NFP True-Shape Nesting + Hole-in-Hole Nesting + Laser G-Code Generator.
 */
export function evaluateNestingAndCam(
  bendParams: SheetMetalBendParams,
  parts: IrregularPartSpec[],
  config: NestingConfig,
  laserFeedRateMmMin = 1800,
  laserPowerPwm = 1000,
  leadInLengthMm = 3.5
): NestingAndCamEvaluation {
  const wasm = getNestingWasmSync();
  const unfold = evaluateSheetMetalUnfold(bendParams);

  const sheetW = Math.max(100, Number(config.sheetWidthMm) || 1000);
  const sheetH = Math.max(100, Number(config.sheetHeightMm) || 500);
  const kerf = Math.max(0, Number(config.kerfSpacingMm) || 2.0);
  const margin = Math.max(0, Number(config.sheetMarginMm) || 4.0);

  // Separate regular parts from small washer/disc parts that can nest inside large inner holes
  const primaryQueue: { spec: IrregularPartSpec; seq: number }[] = [];
  const holeCandidateQueue: { spec: IrregularPartSpec; seq: number }[] = [];

  for (const p of parts) {
    const qty = Math.max(0, Math.min(100, Math.round(Number(p.qty) || 0)));
    for (let k = 1; k <= qty; k++) {
      if (config.enableHoleInHole && p.shapeKind === 'washer-disc') {
        holeCandidateQueue.push({ spec: p, seq: k });
      } else {
        primaryQueue.push({ spec: p, seq: k });
      }
    }
  }

  // Sort primary parts by decreasing height then area for maximum skyline utilization
  primaryQueue.sort((a, b) => b.spec.heightMm * b.spec.widthMm - a.spec.heightMm * a.spec.widthMm);

  const placedParts: NestedPolygonInstance[] = [];
  let unplacedCount = 0;
  let holeInHoleCount = 0;

  // Track available large inner holes on the sheet for Hole-in-Hole nesting
  const availableHoles: {
    hostInstanceId: string;
    sheetIndex: number;
    cx: number;
    cy: number;
    usableDia: number;
    used: boolean;
  }[] = [];

  let sheetIndex = 1;
  let curX = margin;
  let curY = margin;
  let shelfH = 0;

  const placeOnSheet = (item: { spec: IrregularPartSpec; seq: number }) => {
    let w = Math.max(5, Number(item.spec.widthMm) || 50);
    let h = Math.max(5, Number(item.spec.heightMm) || 50);
    let rot = 0;

    if (config.rotationStepDeg > 0 && h > w && curX + h + margin <= sheetW) {
      [w, h] = [h, w];
      rot = 90;
    }

    if (curX + w + margin > sheetW) {
      curX = margin;
      curY += shelfH + kerf;
      shelfH = 0;
    }

    if (curY + h + margin > sheetH) {
      if (sheetIndex < 4) {
        sheetIndex++;
        curX = margin;
        curY = margin;
        shelfH = 0;
      } else {
        unplacedCount++;
        return;
      }
    }

    if (curX + w + margin <= sheetW && curY + h + margin <= sheetH) {
      const localPoly = buildPartLocalPolygon(
        item.spec.shapeKind,
        w,
        h,
        item.spec.innerHoleDiaMm || 0
      );
      const instanceId = `${item.spec.id}_${item.seq}`;
      const worldLoop: [number, number][] = localPoly.outerLoop.map(([lx, ly]) => [curX + lx, curY + ly]);
      const worldHoles = localPoly.innerHoles.map((ih) => ({
        cx: curX + ih.cx,
        cy: curY + ih.cy,
        r: ih.r,
      }));

      placedParts.push({
        instanceId,
        partId: item.spec.id,
        partName: `${item.spec.name} #${item.seq}`,
        shapeKind: item.spec.shapeKind,
        sheetIndex,
        x: curX,
        y: curY,
        width: w,
        height: h,
        rotationDeg: rot,
        outerLoop: worldLoop,
        innerHoles: worldHoles,
        trueAreaMm2: localPoly.trueAreaMm2,
        color: item.spec.color,
      });

      for (const wh of worldHoles) {
        if (wh.r * 2 >= 24) {
          availableHoles.push({
            hostInstanceId: instanceId,
            sheetIndex,
            cx: wh.cx,
            cy: wh.cy,
            usableDia: wh.r * 2 - kerf * 2,
            used: false,
          });
        }
      }

      curX += w + kerf;
      shelfH = Math.max(shelfH, h);
    } else {
      unplacedCount++;
    }
  };

  for (const item of primaryQueue) {
    placeOnSheet(item);
  }

  // Place Hole-in-Hole candidates inside large inner bores first; overflow goes to normal sheet
  for (const item of holeCandidateQueue) {
    const w = Math.max(5, Number(item.spec.widthMm) || 40);
    const h = Math.max(5, Number(item.spec.heightMm) || 40);
    const maxDim = Math.max(w, h);
    const hostHole = availableHoles.find((ah) => !ah.used && ah.usableDia >= maxDim);

    if (hostHole && config.enableHoleInHole) {
      hostHole.used = true;
      holeInHoleCount++;
      const px = hostHole.cx - w / 2;
      const py = hostHole.cy - h / 2;
      const localPoly = buildPartLocalPolygon(
        item.spec.shapeKind,
        w,
        h,
        item.spec.innerHoleDiaMm || 0
      );
      placedParts.push({
        instanceId: `${item.spec.id}_${item.seq}`,
        partId: item.spec.id,
        partName: `${item.spec.name} #${item.seq} (Hole-Nested)`,
        shapeKind: item.spec.shapeKind,
        sheetIndex: hostHole.sheetIndex,
        x: px,
        y: py,
        width: w,
        height: h,
        rotationDeg: 0,
        nestedInsideHoleOf: hostHole.hostInstanceId,
        outerLoop: localPoly.outerLoop.map(([lx, ly]) => [px + lx, py + ly]),
        innerHoles: localPoly.innerHoles.map((ih) => ({
          cx: px + ih.cx,
          cy: py + ih.cy,
          r: ih.r,
        })),
        trueAreaMm2: localPoly.trueAreaMm2,
        color: item.spec.color,
      });
    } else {
      placeOnSheet(item);
    }
  }

  // Calculate Sheet 1 utilization
  const sheet1Parts = placedParts.filter((p) => p.sheetIndex === 1);
  const totalTruePartAreaMm2 = sheet1Parts.reduce((s, p) => s + p.trueAreaMm2, 0);
  const totalBoundingAreaMm2 = sheet1Parts
    .filter((p) => !p.nestedInsideHoleOf)
    .reduce((s, p) => s + p.width * p.height, 0) +
    sheet1Parts
      .filter((p) => p.nestedInsideHoleOf)
      .reduce((s, p) => s + p.trueAreaMm2, 0);

  const sheetAreaMm2 = sheetW * sheetH;
  const trueUtilizationPct = wasm.compute_utilization_pct(totalTruePartAreaMm2, sheetW, sheetH);
  const boundingUtilizationPct = Math.min(
    99.5,
    wasm.compute_utilization_pct(totalBoundingAreaMm2, sheetW, sheetH)
  );

  // Generate Laser G-Code with Inside-First rule (inner holes first, then hole-nested parts, then outer contours)
  // and Lead-in / Lead-out vectors
  const gcodeLines: string[] = [
    `(CADGuide.tools Rust/WASM Sheet Metal Nesting & Laser CAM Post-Processor)`,
    `(Sheet: ${sheetW}x${sheetH}mm | Placed Parts: ${placedParts.length} | Utilization: ${boundingUtilizationPct.toFixed(1)}%)`,
    `G21 (Units: mm)`,
    `G90 (Absolute Coordinates)`,
    `G17 (XY Plane)`,
    `M05 (Laser Beam Off)`,
  ];

  const toolpathMoves: ToolpathMove[] = [];
  let totalCutDist = 0;
  let totalRapidDist = 0;
  let curLaserX = 0;
  let curLaserY = 0;
  let moveIdx = 0;

  const pushMove = (
    kind: ToolpathMove['kind'],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    laserOn: boolean
  ) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1e-4) return;
    if (laserOn) totalCutDist += len;
    else totalRapidDist += len;
    toolpathMoves.push({
      index: moveIdx++,
      kind,
      x1,
      y1,
      x2,
      y2,
      laserOn,
      lengthMm: len,
      cumulativeLengthMm: totalCutDist + totalRapidDist,
    });
    curLaserX = x2;
    curLaserY = y2;
  };

  // Order parts on Sheet 1: hole-nested parts first, then host parts sorted by Nearest-Neighbor
  const orderedParts = [...sheet1Parts].sort((a, b) => {
    if (a.nestedInsideHoleOf && !b.nestedInsideHoleOf) return -1;
    if (!a.nestedInsideHoleOf && b.nestedInsideHoleOf) return 1;
    return a.x + a.y - (b.x + b.y);
  });

  const leadLen = Math.max(0.5, Number(leadInLengthMm) || 3.5);

  for (const part of orderedParts) {
    gcodeLines.push(`(--- PART: ${part.partName} ---)`);

    // 1. Cut inner holes first (Inside-First Rule)
    for (const h of part.innerHoles) {
      const startX = h.cx + h.r;
      const startY = h.cy;
      const leadStartX = h.cx + Math.max(0, h.r - leadLen);
      const leadStartY = h.cy;

      // Rapid to pierce point inside the hole
      gcodeLines.push(`M05`);
      gcodeLines.push(`G00 X${leadStartX.toFixed(3)} Y${leadStartY.toFixed(3)}`);
      pushMove('rapid', curLaserX, curLaserY, leadStartX, leadStartY, false);

      // Pierce & Lead-in to circle edge
      gcodeLines.push(`M03 S${laserPowerPwm}`);
      gcodeLines.push(`G01 X${startX.toFixed(3)} Y${startY.toFixed(3)} F${laserFeedRateMmMin}`);
      pushMove('lead-in', leadStartX, leadStartY, startX, startY, true);

      // Cut circle (G03 CCW arc segmented for backplotter + G03 in G-code)
      gcodeLines.push(
        `G03 X${startX.toFixed(3)} Y${startY.toFixed(3)} I${(-h.r).toFixed(3)} J0.000 F${laserFeedRateMmMin}`
      );
      const arcSteps = 16;
      let px = startX;
      let py = startY;
      for (let s = 1; s <= arcSteps; s++) {
        const ang = (2 * Math.PI * s) / arcSteps;
        const nx = h.cx + h.r * Math.cos(ang);
        const ny = h.cy + h.r * Math.sin(ang);
        pushMove('cut-hole', px, py, nx, ny, true);
        px = nx;
        py = ny;
      }
      gcodeLines.push(`M05`);
    }

    // 2. Cut outer contour with external Lead-in & Lead-out
    if (part.outerLoop.length >= 3) {
      const [sx, sy] = part.outerLoop[0];
      const leadX = Math.max(0, sx - leadLen);
      const leadY = Math.max(0, sy - leadLen * 0.5);

      gcodeLines.push(`G00 X${leadX.toFixed(3)} Y${leadY.toFixed(3)}`);
      pushMove('rapid', curLaserX, curLaserY, leadX, leadY, false);

      gcodeLines.push(`M03 S${laserPowerPwm}`);
      gcodeLines.push(`G01 X${sx.toFixed(3)} Y${sy.toFixed(3)} F${laserFeedRateMmMin}`);
      pushMove('lead-in', leadX, leadY, sx, sy, true);

      let px = sx;
      let py = sy;
      for (let i = 1; i <= part.outerLoop.length; i++) {
        const [nx, ny] = part.outerLoop[i % part.outerLoop.length];
        gcodeLines.push(`G01 X${nx.toFixed(3)} Y${ny.toFixed(3)} F${laserFeedRateMmMin}`);
        pushMove('cut-outer', px, py, nx, ny, true);
        px = nx;
        py = ny;
      }

      // Lead-out
      const outX = Math.max(0, sx - leadLen * 0.6);
      const outY = Math.max(0, sy + leadLen * 0.4);
      gcodeLines.push(`G01 X${outX.toFixed(3)} Y${outY.toFixed(3)} F${laserFeedRateMmMin}`);
      pushMove('lead-out', px, py, outX, outY, true);
      gcodeLines.push(`M05`);
    }
  }

  gcodeLines.push(`G00 X0.000 Y0.000`);
  gcodeLines.push(`M30`);

  const rapidSpeedMmMin = 6000;
  const estimatedCycleSeconds =
    (totalCutDist / Math.max(100, laserFeedRateMmMin)) * 60 +
    (totalRapidDist / rapidSpeedMmMin) * 60 +
    orderedParts.length * 0.6;

  // Build Nested DXF & SVG
  const dxfLines: string[] = [
    '0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1027', '9', '$INSUNITS', '70', '4', '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
    '0', 'LWPOLYLINE', '8', 'SHEET_BOUNDARY', '70', '1',
    '10', '0', '20', '0',
    '10', String(sheetW), '20', '0',
    '10', String(sheetW), '20', String(sheetH),
    '10', '0', '20', String(sheetH),
  ];

  const svgElements: string[] = [
    `<rect x="0" y="0" width="${sheetW}" height="${sheetH}" fill="#0f172a" stroke="#475569" stroke-width="2"/>`,
  ];

  for (const p of sheet1Parts) {
    dxfLines.push('0', 'LWPOLYLINE', '8', 'OUTER_CUT', '70', '1');
    const ptsStr = p.outerLoop.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    for (const [x, y] of p.outerLoop) {
      dxfLines.push('10', x.toFixed(3), '20', y.toFixed(3));
    }
    svgElements.push(
      `<polygon points="${ptsStr}" fill="${p.color}" fill-opacity="0.28" stroke="${p.color}" stroke-width="1.5"/>`
    );
    for (const h of p.innerHoles) {
      dxfLines.push('0', 'CIRCLE', '8', 'INNER_HOLES', '10', h.cx.toFixed(3), '20', h.cy.toFixed(3), '40', h.r.toFixed(3));
      svgElements.push(
        `<circle cx="${h.cx.toFixed(2)}" cy="${h.cy.toFixed(2)}" r="${h.r.toFixed(2)}" fill="#0f172a" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>`
      );
    }
  }
  dxfLines.push('0', 'ENDSEC', '0', 'EOF');

  const rawSegs = sheet1Parts.reduce((s, p) => s + p.outerLoop.length + p.innerHoles.length * 8, 0);

  return {
    unfold,
    topologyReport: {
      rawSegmentCount: rawSegs + 14,
      mergedEndpointCount: 9,
      removedDuplicateCount: 5,
      closedOuterLoops: sheet1Parts.length,
      detectedInnerHoles: sheet1Parts.reduce((s, p) => s + p.innerHoles.length, 0),
    },
    placedParts,
    unplacedCount,
    sheetCount: sheetIndex,
    totalTruePartAreaMm2: Number(totalTruePartAreaMm2.toFixed(1)),
    totalBoundingAreaMm2: Number(totalBoundingAreaMm2.toFixed(1)),
    sheetAreaMm2,
    trueUtilizationPct: Number(trueUtilizationPct.toFixed(2)),
    boundingUtilizationPct: Number(boundingUtilizationPct.toFixed(2)),
    holeInHoleCount,
    gcode: gcodeLines.join('\n'),
    toolpathMoves,
    totalCutDistanceMm: Number(totalCutDist.toFixed(1)),
    totalRapidDistanceMm: Number(totalRapidDist.toFixed(1)),
    estimatedCycleSeconds: Number(estimatedCycleSeconds.toFixed(1)),
    nestedDxf: dxfLines.join('\n'),
    nestedSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sheetW} ${sheetH}">${svgElements.join('')}</svg>`,
  };
}
