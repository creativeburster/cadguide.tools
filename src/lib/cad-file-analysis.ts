// Client-side CAD/mesh file parsing and rule-based validation.
// Everything here runs in the browser on the user's own file; nothing is uploaded.
// All checks are deterministic rules on parsed geometry/metadata — no check
// returns "pass" unless the rule was actually evaluated against file content.

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info';

export interface ValidationCheck {
  name: string;
  status: CheckStatus;
  detail: string;
}

export interface ValidationReport {
  format: string;
  supported: boolean;
  checks: ValidationCheck[];
  stats: { label: string; value: string }[];
}

export interface AnalysisOptions {
  /** Smallest cutter diameter available for CNC checks (mm). */
  minToolDia?: number;
  /** Gap tolerance for open-contour detection (drawing units). */
  gapTol?: number;
}

// ---------------------------------------------------------------------------
// DXF parsing (ASCII DXF only)
// ---------------------------------------------------------------------------

export interface DxfEntity {
  type: string;
  layer: string;
  pairs: [number, string][];
  vertices?: { x: number; y: number; bulge: number }[];
  /** True when the entity lives in paper space (group 67 = 1) or a *Paper_Space block. */
  paper: boolean;
}

export interface DxfLayer {
  name: string;
  color: number;
  linetype: string;
}

export interface DxfDoc {
  header: Record<string, string[]>;
  layers: DxfLayer[];
  entities: DxfEntity[];
  /** VIEWPORT entities found anywhere (ENTITIES or layout blocks). */
  viewports: DxfEntity[];
}

export function isBinaryDxf(bytes: Uint8Array): boolean {
  const sig = 'AutoCAD Binary DXF';
  for (let i = 0; i < sig.length; i++) if (bytes[i] !== sig.charCodeAt(i)) return false;
  return true;
}

export function parseDxf(text: string): DxfDoc | null {
  const lines = text.split(/\r?\n/);
  const pairs: [number, string][] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const codeStr = lines[i].trim();
    if (codeStr === '') {
      if (i >= lines.length - 3) break;
      return null;
    }
    const code = Number(codeStr);
    if (!Number.isInteger(code)) return null;
    pairs.push([code, lines[i + 1].trim()]);
  }
  if (!pairs.some(([c, v]) => c === 0 && v === 'SECTION')) return null;

  const doc: DxfDoc = { header: {}, layers: [], entities: [], viewports: [] };
  let section = '';
  let blockName = '';
  let i = 0;
  let currentPolyline: DxfEntity | null = null;

  while (i < pairs.length) {
    const [code, value] = pairs[i];
    if (code === 0 && value === 'SECTION') {
      section = pairs[i + 1]?.[0] === 2 ? pairs[i + 1][1] : '';
      i += 2;
      continue;
    }
    if (code === 0 && value === 'ENDSEC') {
      section = '';
      i++;
      continue;
    }

    if (section === 'HEADER') {
      if (code === 9) {
        const name = value;
        const vals: string[] = [];
        i++;
        while (i < pairs.length && pairs[i][0] !== 9 && pairs[i][0] !== 0) {
          vals.push(pairs[i][1]);
          i++;
        }
        doc.header[name] = vals;
        continue;
      }
      i++;
      continue;
    }

    if (section === 'TABLES' && code === 0 && value === 'LAYER') {
      const layer: DxfLayer = { name: '', color: 7, linetype: 'CONTINUOUS' };
      i++;
      while (i < pairs.length && pairs[i][0] !== 0) {
        const [c, v] = pairs[i];
        if (c === 2) layer.name = v;
        else if (c === 62) layer.color = Number(v);
        else if (c === 6) layer.linetype = v;
        i++;
      }
      if (layer.name) doc.layers.push(layer);
      continue;
    }

    if ((section === 'ENTITIES' || section === 'BLOCKS') && code === 0) {
      if (section === 'BLOCKS' && value === 'BLOCK') {
        blockName = '';
        i++;
        while (i < pairs.length && pairs[i][0] !== 0) {
          if (pairs[i][0] === 2) blockName = pairs[i][1];
          i++;
        }
        continue;
      }
      if (section === 'BLOCKS' && value === 'ENDBLK') {
        blockName = '';
        i++;
        while (i < pairs.length && pairs[i][0] !== 0) i++;
        continue;
      }
      const ent: DxfEntity = { type: value, layer: '0', pairs: [], paper: false };
      i++;
      while (i < pairs.length && pairs[i][0] !== 0) {
        const p = pairs[i];
        if (p[0] === 8) ent.layer = p[1];
        if (p[0] === 67 && p[1] === '1') ent.paper = true;
        ent.pairs.push(p);
        i++;
      }
      if (/^\*paper_space/i.test(blockName)) ent.paper = true;

      if (ent.type === 'VIEWPORT') {
        doc.viewports.push(ent);
        continue;
      }
      // Only model/paper-space entities are analysed; block definitions are
      // used for viewports only (to avoid double-counting block geometry).
      if (section === 'BLOCKS' && !/^\*paper_space/i.test(blockName)) continue;

      if (ent.type === 'POLYLINE') {
        ent.vertices = [];
        currentPolyline = ent;
        doc.entities.push(ent);
        continue;
      }
      if (ent.type === 'VERTEX' && currentPolyline) {
        currentPolyline.vertices!.push({
          x: num(ent, 10),
          y: num(ent, 20),
          bulge: num(ent, 42),
        });
        continue;
      }
      if (ent.type === 'SEQEND') {
        currentPolyline = null;
        continue;
      }
      if (ent.type === 'LWPOLYLINE') {
        ent.vertices = [];
        let cur: { x: number; y: number; bulge: number } | null = null;
        for (const [c, v] of ent.pairs) {
          if (c === 10) {
            cur = { x: Number(v), y: 0, bulge: 0 };
            ent.vertices.push(cur);
          } else if (c === 20 && cur) cur.y = Number(v);
          else if (c === 42 && cur) cur.bulge = Number(v);
        }
      }
      doc.entities.push(ent);
      continue;
    }
    i++;
  }
  return doc;
}

export function num(e: DxfEntity, code: number, fallback = 0): number {
  const p = e.pairs.find(([c]) => c === code);
  if (!p) return fallback;
  const n = Number(p[1]);
  return Number.isFinite(n) ? n : fallback;
}

export function str(e: DxfEntity, code: number): string | undefined {
  return e.pairs.find(([c]) => c === code)?.[1];
}

function hdrNum(doc: DxfDoc, name: string): number | undefined {
  const v = doc.header[name]?.[0];
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const INSUNITS: Record<number, string> = {
  0: 'Unitless', 1: 'Inches', 2: 'Feet', 4: 'Millimeters', 5: 'Centimeters', 6: 'Meters', 14: 'Decimeters',
};

// ---------------------------------------------------------------------------
// 2D geometry helpers
// ---------------------------------------------------------------------------

export interface Seg {
  kind: 'line' | 'arc';
  x1: number; y1: number; x2: number; y2: number;
  // arc only
  cx?: number; cy?: number; r?: number; a1?: number; a2?: number;
}

export interface Curve {
  entity: DxfEntity;
  closed: boolean;
  start?: [number, number];
  end?: [number, number];
}

const deg = (d: number) => (d * Math.PI) / 180;

/** Endpoint-level description of every open/closed 2D curve in model space. */
export function curvesOf(doc: DxfDoc): Curve[] {
  const out: Curve[] = [];
  for (const e of doc.entities) {
    if (e.paper) continue;
    switch (e.type) {
      case 'LINE':
        out.push({ entity: e, closed: false, start: [num(e, 10), num(e, 20)], end: [num(e, 11), num(e, 21)] });
        break;
      case 'ARC': {
        const cx = num(e, 10), cy = num(e, 20), r = num(e, 40);
        const a1 = deg(num(e, 50)), a2 = deg(num(e, 51));
        out.push({
          entity: e, closed: false,
          start: [cx + r * Math.cos(a1), cy + r * Math.sin(a1)],
          end: [cx + r * Math.cos(a2), cy + r * Math.sin(a2)],
        });
        break;
      }
      case 'CIRCLE':
        out.push({ entity: e, closed: true });
        break;
      case 'LWPOLYLINE':
      case 'POLYLINE': {
        const v = e.vertices || [];
        const flag = num(e, 70);
        if (v.length < 2) break;
        const first = v[0], last = v[v.length - 1];
        const closedFlag = (flag & 1) === 1;
        const coincident = Math.hypot(first.x - last.x, first.y - last.y) < 1e-9;
        out.push({
          entity: e,
          closed: closedFlag || coincident,
          start: [first.x, first.y],
          end: [last.x, last.y],
        });
        break;
      }
      case 'SPLINE': {
        const flag = num(e, 70);
        const xs: number[] = [], ys: number[] = [];
        for (const [c, val] of e.pairs) {
          if (c === 10) xs.push(Number(val));
          if (c === 20) ys.push(Number(val));
        }
        if (xs.length < 2) break;
        out.push({
          entity: e,
          closed: (flag & 1) === 1,
          start: [xs[0], ys[0]],
          end: [xs[xs.length - 1], ys[ys.length - 1]],
        });
        break;
      }
      case 'ELLIPSE': {
        const s = num(e, 41, 0), en = num(e, 42, Math.PI * 2);
        const full = Math.abs(en - s - Math.PI * 2) < 1e-6;
        if (full) out.push({ entity: e, closed: true });
        else {
          const cx = num(e, 10), cy = num(e, 20), mx = num(e, 11), my = num(e, 21), ratio = num(e, 40, 1);
          const pt = (t: number): [number, number] => {
            const ux = mx, uy = my, vx = -my * ratio, vy = mx * ratio;
            return [cx + ux * Math.cos(t) + vx * Math.sin(t), cy + uy * Math.cos(t) + vy * Math.sin(t)];
          };
          out.push({ entity: e, closed: false, start: pt(s), end: pt(en) });
        }
        break;
      }
    }
  }
  return out;
}

interface EndpointAnalysis {
  danglingEnds: [number, number][];
  microGaps: { a: [number, number]; b: [number, number]; gap: number }[];
}

function analyseEndpoints(curves: Curve[], snapTol: number, gapTol: number): EndpointAnalysis {
  const open = curves.filter((c) => !c.closed && c.start && c.end);
  const nodes: { p: [number, number]; deg: number }[] = [];
  const grid = new Map<string, number[]>();
  const cell = Math.max(snapTol * 10, 1e-6);
  const keyOf = (x: number, y: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
  const findOrAdd = (p: [number, number]) => {
    const gx = Math.floor(p[0] / cell), gy = Math.floor(p[1] / cell);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const ids = grid.get(`${gx + dx},${gy + dy}`);
      if (!ids) continue;
      for (const id of ids) {
        const n = nodes[id];
        if (Math.hypot(n.p[0] - p[0], n.p[1] - p[1]) <= snapTol) { n.deg++; return; }
      }
    }
    nodes.push({ p, deg: 1 });
    const k = keyOf(p[0], p[1]);
    (grid.get(k) || grid.set(k, []).get(k)!).push(nodes.length - 1);
  };
  for (const c of open) { findOrAdd(c.start!); findOrAdd(c.end!); }
  const dangling = nodes.filter((n) => n.deg === 1).map((n) => n.p);
  const microGaps: EndpointAnalysis['microGaps'] = [];
  const limit = Math.min(dangling.length, 4000);
  const used = new Set<number>();
  for (let a = 0; a < limit; a++) {
    if (used.has(a)) continue;
    let best = -1, bestD = Infinity;
    for (let b = a + 1; b < limit; b++) {
      if (used.has(b)) continue;
      const d = Math.hypot(dangling[a][0] - dangling[b][0], dangling[a][1] - dangling[b][1]);
      if (d < bestD) { bestD = d; best = b; }
    }
    if (best >= 0 && bestD > snapTol && bestD <= gapTol) {
      used.add(a); used.add(best);
      microGaps.push({ a: dangling[a], b: dangling[best], gap: bestD });
    }
  }
  return { danglingEnds: dangling, microGaps };
}

function extentOf(doc: DxfDoc): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const add = (x: number, y: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  };
  for (const e of doc.entities) {
    if (e.paper) continue;
    if (e.type === 'LINE') { add(num(e, 10), num(e, 20)); add(num(e, 11), num(e, 21)); }
    else if (e.type === 'CIRCLE' || e.type === 'ARC') {
      const r = num(e, 40); add(num(e, 10) - r, num(e, 20) - r); add(num(e, 10) + r, num(e, 20) + r);
    } else if (e.vertices) for (const v of e.vertices) add(v.x, v.y);
    else if (e.type === 'TEXT' || e.type === 'MTEXT' || e.type === 'INSERT' || e.type === 'POINT') add(num(e, 10), num(e, 20));
  }
  return Number.isFinite(minX) ? { minX, minY, maxX, maxY } : null;
}

/** Convert all supported 2D entities into renderable line/arc segments (model space). */
export function segmentsOf(doc: DxfDoc, includePaper = false): Seg[] {
  const segs: Seg[] = [];
  const pushPoly = (v: { x: number; y: number; bulge: number }[], closed: boolean) => {
    const n = v.length;
    const count = closed ? n : n - 1;
    for (let k = 0; k < count; k++) {
      const a = v[k], b = v[(k + 1) % n];
      if (Math.abs(a.bulge) < 1e-9) {
        segs.push({ kind: 'line', x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      } else {
        const theta = 4 * Math.atan(a.bulge);
        const chord = Math.hypot(b.x - a.x, b.y - a.y);
        const r = chord / (2 * Math.sin(Math.abs(theta) / 2));
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const h = Math.sqrt(Math.max(0, r * r - (chord / 2) ** 2));
        const dir = Math.sign(a.bulge) * (Math.abs(theta) > Math.PI ? -1 : 1);
        const nx = -(b.y - a.y) / chord, ny = (b.x - a.x) / chord;
        const cx = mx + dir * h * nx, cy = my + dir * h * ny;
        let a1 = Math.atan2(a.y - cy, a.x - cx), a2 = Math.atan2(b.y - cy, b.x - cx);
        if (a.bulge < 0) [a1, a2] = [a2, a1];
        segs.push({ kind: 'arc', x1: a.x, y1: a.y, x2: b.x, y2: b.y, cx, cy, r, a1, a2 });
      }
    }
  };
  for (const e of doc.entities) {
    if (e.paper && !includePaper) continue;
    switch (e.type) {
      case 'LINE':
        segs.push({ kind: 'line', x1: num(e, 10), y1: num(e, 20), x2: num(e, 11), y2: num(e, 21) });
        break;
      case 'CIRCLE': {
        const cx = num(e, 10), cy = num(e, 20), r = num(e, 40);
        segs.push({ kind: 'arc', x1: cx + r, y1: cy, x2: cx + r, y2: cy, cx, cy, r, a1: 0, a2: Math.PI * 2 });
        break;
      }
      case 'ARC': {
        const cx = num(e, 10), cy = num(e, 20), r = num(e, 40);
        const a1 = deg(num(e, 50)), a2 = deg(num(e, 51));
        segs.push({ kind: 'arc', x1: cx + r * Math.cos(a1), y1: cy + r * Math.sin(a1), x2: cx + r * Math.cos(a2), y2: cy + r * Math.sin(a2), cx, cy, r, a1, a2 });
        break;
      }
      case 'LWPOLYLINE':
      case 'POLYLINE':
        if (e.vertices && e.vertices.length > 1) pushPoly(e.vertices, (num(e, 70) & 1) === 1);
        break;
      case 'SPLINE': {
        // Render the control/fit polygon as an approximation.
        const xs: number[] = [], ys: number[] = [];
        for (const [c, v] of e.pairs) { if (c === 10 || c === 11) xs.push(Number(v)); if (c === 20 || c === 21) ys.push(Number(v)); }
        for (let k = 0; k + 1 < Math.min(xs.length, ys.length); k++) segs.push({ kind: 'line', x1: xs[k], y1: ys[k], x2: xs[k + 1], y2: ys[k + 1] });
        break;
      }
    }
  }
  return segs;
}

// ---------------------------------------------------------------------------
// STL / OBJ mesh parsing
// ---------------------------------------------------------------------------

export interface Mesh {
  /** Flat array of triangle vertex coordinates: 9 floats per triangle. */
  tris: Float32Array;
  /** Stored facet normals (STL only), 3 floats per triangle; zeros when absent. */
  normals: Float32Array;
  format: string;
}

export function parseStl(buffer: ArrayBuffer): Mesh | null {
  const view = new DataView(buffer);
  if (buffer.byteLength >= 84) {
    const n = view.getUint32(80, true);
    if (84 + n * 50 === buffer.byteLength) {
      const tris = new Float32Array(n * 9);
      const normals = new Float32Array(n * 3);
      for (let t = 0; t < n; t++) {
        const o = 84 + t * 50;
        for (let k = 0; k < 3; k++) normals[t * 3 + k] = view.getFloat32(o + k * 4, true);
        for (let k = 0; k < 9; k++) tris[t * 9 + k] = view.getFloat32(o + 12 + k * 4, true);
      }
      return { tris, normals, format: 'Binary STL' };
    }
  }
  const text = new TextDecoder().decode(new Uint8Array(buffer));
  if (!/^\s*solid/i.test(text) || !/facet/i.test(text)) return null;
  const verts: number[] = [];
  const norms: number[] = [];
  const facetRe = /facet\s+normal\s+(\S+)\s+(\S+)\s+(\S+)([\s\S]*?)endfacet/gi;
  const vRe = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/gi;
  let m: RegExpExecArray | null;
  while ((m = facetRe.exec(text)) !== null) {
    const vs: number[] = [];
    let vm: RegExpExecArray | null;
    vRe.lastIndex = 0;
    while ((vm = vRe.exec(m[4])) !== null) vs.push(Number(vm[1]), Number(vm[2]), Number(vm[3]));
    if (vs.length === 9) {
      verts.push(...vs);
      norms.push(Number(m[1]), Number(m[2]), Number(m[3]));
    }
  }
  if (!verts.length) return null;
  return { tris: new Float32Array(verts), normals: new Float32Array(norms), format: 'ASCII STL' };
}

export function parseObj(text: string): Mesh | null {
  const v: number[][] = [];
  const out: number[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('v ')) {
      const p = line.split(/\s+/);
      v.push([Number(p[1]), Number(p[2]), Number(p[3])]);
    } else if (line.startsWith('f ')) {
      const idx = line.split(/\s+/).slice(1).map((tok) => {
        const i = parseInt(tok.split('/')[0], 10);
        return i < 0 ? v.length + i : i - 1;
      });
      for (let k = 1; k + 1 < idx.length; k++) {
        for (const id of [idx[0], idx[k], idx[k + 1]]) {
          const p = v[id];
          if (!p) return null;
          out.push(p[0], p[1], p[2]);
        }
      }
    }
  }
  if (!out.length) return null;
  return { tris: new Float32Array(out), normals: new Float32Array(out.length / 3), format: 'Wavefront OBJ' };
}

export interface MeshStats {
  triangles: number;
  vertices: number;
  degenerate: number;
  duplicateTris: number;
  boundaryEdges: number;
  nonManifoldEdges: number;
  inconsistentEdges: number;
  flippedNormals: number;
  normalsStored: boolean;
  bbox: { min: [number, number, number]; max: [number, number, number] };
  volume: number;
  area: number;
  overhangArea: number;
}

export function meshStats(mesh: Mesh): MeshStats {
  const t = mesh.tris;
  const n = t.length / 9;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < t.length; i += 3) for (let k = 0; k < 3; k++) {
    min[k] = Math.min(min[k], t[i + k]); max[k] = Math.max(max[k], t[i + k]);
  }
  const diag = Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]) || 1;
  const q = diag * 1e-6;
  const vid = new Map<string, number>();
  const idOf = (x: number, y: number, z: number) => {
    const k = `${Math.round(x / q)},${Math.round(y / q)},${Math.round(z / q)}`;
    let id = vid.get(k);
    if (id === undefined) { id = vid.size; vid.set(k, id); }
    return id;
  };
  const undirected = new Map<string, number>();
  const directed = new Map<string, number>();
  const triKeys = new Set<string>();
  let degenerate = 0, duplicateTris = 0, flipped = 0, volume = 0, area = 0, overhang = 0;
  let normalsStored = false;
  const minZ = min[2];
  for (let f = 0; f < n; f++) {
    const o = f * 9;
    const ax = t[o], ay = t[o + 1], az = t[o + 2];
    const bx = t[o + 3], by = t[o + 4], bz = t[o + 5];
    const cx = t[o + 6], cy = t[o + 7], cz = t[o + 8];
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    const a = idOf(ax, ay, az), b = idOf(bx, by, bz), c = idOf(cx, cy, cz);
    if (len < q * q || a === b || b === c || a === c) { degenerate++; continue; }
    area += len / 2;
    volume += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
    // Overhang: faces pointing more than 45° below horizontal, excluding faces on the build plate.
    const nzUnit = nz / len;
    const faceMinZ = Math.min(az, bz, cz);
    if (nzUnit < -Math.SQRT1_2 && faceMinZ - minZ > diag * 1e-4) overhang += len / 2;
    const sn0 = mesh.normals[f * 3], sn1 = mesh.normals[f * 3 + 1], sn2 = mesh.normals[f * 3 + 2];
    if (sn0 !== 0 || sn1 !== 0 || sn2 !== 0) {
      normalsStored = true;
      if (sn0 * nx + sn1 * ny + sn2 * nz < 0) flipped++;
    }
    const sorted = [a, b, c].sort((x, y) => x - y).join(',');
    if (triKeys.has(sorted)) duplicateTris++;
    else triKeys.add(sorted);
    for (const [p, r] of [[a, b], [b, c], [c, a]]) {
      const uk = p < r ? `${p},${r}` : `${r},${p}`;
      undirected.set(uk, (undirected.get(uk) || 0) + 1);
      const dk = `${p},${r}`;
      directed.set(dk, (directed.get(dk) || 0) + 1);
    }
  }
  let boundary = 0, nonManifold = 0, inconsistent = 0;
  for (const cnt of undirected.values()) {
    if (cnt === 1) boundary++;
    else if (cnt > 2) nonManifold++;
  }
  for (const cnt of directed.values()) if (cnt > 1) inconsistent++;
  return {
    triangles: n, vertices: vid.size, degenerate, duplicateTris,
    boundaryEdges: boundary, nonManifoldEdges: nonManifold, inconsistentEdges: inconsistent,
    flippedNormals: flipped, normalsStored, bbox: { min, max }, volume, area, overhangArea: overhang,
  };
}

// ---------------------------------------------------------------------------
// Validator specs
// ---------------------------------------------------------------------------

export type ValidatorInput = 'dxf' | 'mesh' | 'bim';

export const VALIDATOR_SPECS: Record<string, { input: ValidatorInput; accept: string; hint: string }> = {
  '3d-print-manufacturability-checker': { input: 'mesh', accept: '.stl,.obj', hint: 'STL (ASCII/Binary) or OBJ mesh, units assumed mm' },
  'stl-mesh-quality-checker': { input: 'mesh', accept: '.stl,.obj', hint: 'STL (ASCII/Binary) or OBJ mesh' },
  'non-manifold-mesh-checker': { input: 'mesh', accept: '.stl,.obj', hint: 'STL (ASCII/Binary) or OBJ mesh' },
  'dxf-drawing-standards-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF (save DWG as DXF first)' },
  'gdt-annotation-completeness-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF with dimensions and feature control frames' },
  'cnc-machinability-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF part profile (model space)' },
  'drawing-scale-consistency-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF including layouts/viewports' },
  'cad-open-contour-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF profile geometry' },
  'duplicate-overlapping-lines-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF geometry' },
  'cad-dimension-override-checker': { input: 'dxf', accept: '.dxf', hint: 'ASCII DXF with DIMENSION entities' },
  'bim-naming-convention-checker': { input: 'bim', accept: '.ifc,.dxf', hint: 'IFC (STEP Physical File) or ASCII DXF; file name is checked against ISO 19650-2 field pattern' },
};

const c = (name: string, status: CheckStatus, detail: string): ValidationCheck => ({ name, status, detail });

export function runValidator(slug: string, buffer: ArrayBuffer, fileName: string, opts: AnalysisOptions = {}): ValidationReport {
  const spec = VALIDATOR_SPECS[slug];
  const bytes = new Uint8Array(buffer);
  if (!spec) return { format: 'Unknown', supported: false, checks: [c('Validator', 'info', 'No rule set is registered for this tool.')], stats: [] };

  if (spec.input === 'mesh') {
    const lower = fileName.toLowerCase();
    const mesh = lower.endsWith('.obj') ? parseObj(new TextDecoder().decode(bytes)) : parseStl(buffer);
    if (!mesh) return unsupported('Mesh', 'File could not be parsed as STL or OBJ. Binary STL size must equal 84 + 50 × triangle count.');
    return meshReport(slug, mesh);
  }

  const head = new TextDecoder().decode(bytes.slice(0, 64));
  if (spec.input === 'bim' && /ISO-10303-21/.test(head)) {
    return ifcNamingReport(new TextDecoder().decode(bytes), fileName);
  }
  if (head.startsWith('AC10')) return unsupported('DWG (binary)', 'DWG is a proprietary binary format that cannot be parsed in the browser. Save As → ASCII DXF and load that file.');
  if (isBinaryDxf(bytes)) return unsupported('Binary DXF', 'Binary DXF is not supported. Save As → DXF with the ASCII option.');
  const doc = parseDxf(new TextDecoder().decode(bytes));
  if (!doc) return unsupported('Unknown', 'File is not a readable ASCII DXF (expected group-code/value line pairs with SECTION markers).');

  switch (slug) {
    case 'dxf-drawing-standards-checker': return dxfStandardsReport(doc);
    case 'gdt-annotation-completeness-checker': return gdtReport(doc);
    case 'cnc-machinability-checker': return cncReport(doc, opts);
    case 'drawing-scale-consistency-checker': return scaleReport(doc);
    case 'cad-open-contour-checker': return openContourReport(doc, opts);
    case 'duplicate-overlapping-lines-checker': return duplicateReport(doc);
    case 'cad-dimension-override-checker': return dimOverrideReport(doc);
    case 'bim-naming-convention-checker': return dxfNamingReport(doc, fileName);
  }
  return unsupported('DXF', 'No rule set registered.');
}

function unsupported(format: string, detail: string): ValidationReport {
  return { format, supported: false, checks: [c('File format', 'fail', detail)], stats: [] };
}

function entityCounts(doc: DxfDoc) {
  const counts: Record<string, number> = {};
  for (const e of doc.entities) counts[e.type] = (counts[e.type] || 0) + 1;
  return counts;
}

function baseDxfStats(doc: DxfDoc) {
  const counts = entityCounts(doc);
  const units = hdrNum(doc, '$INSUNITS');
  return [
    { label: 'DXF version', value: doc.header['$ACADVER']?.[0] || 'not declared' },
    { label: 'Units ($INSUNITS)', value: units === undefined ? 'not declared' : INSUNITS[units] || `code ${units}` },
    { label: 'Entities', value: String(doc.entities.length) },
    { label: 'Layers (table)', value: String(doc.layers.length) },
    { label: 'Top entity types', value: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} ${v}`).join(', ') || '—' },
  ];
}

// ----- DXF: drawing standards ------------------------------------------------

const ISO_3098_HEIGHTS = [1.8, 2.5, 3.5, 5, 7, 10, 14, 20];

function dxfStandardsReport(doc: DxfDoc): ValidationReport {
  const checks: ValidationCheck[] = [];
  const units = hdrNum(doc, '$INSUNITS');
  checks.push(units === undefined || units === 0
    ? c('Drawing units declared', 'fail', '$INSUNITS is missing or 0 (unitless). Downstream CAM/BIM imports will guess the scale.')
    : c('Drawing units declared', 'pass', `$INSUNITS = ${INSUNITS[units] || units}.`));

  const model = doc.entities.filter((e) => !e.paper);
  const onZero = model.filter((e) => e.layer === '0' && e.type !== 'INSERT' && e.type !== 'VIEWPORT').length;
  checks.push(onZero === 0
    ? c('No geometry on layer 0', 'pass', 'All model-space geometry is on named layers.')
    : c('No geometry on layer 0', 'warn', `${onZero} entities are drawn directly on layer 0. Layer 0 should be reserved for block definitions.`));

  const onDefpoints = model.filter((e) => e.layer.toUpperCase() === 'DEFPOINTS' && e.type !== 'DIMENSION').length;
  checks.push(onDefpoints === 0
    ? c('No plottable geometry on Defpoints', 'pass', 'Defpoints contains no user geometry.')
    : c('No plottable geometry on Defpoints', 'warn', `${onDefpoints} entities sit on Defpoints and will never print.`));

  const hardColor = model.filter((e) => { const v = str(e, 62); return v !== undefined && v !== '256' && v !== '0'; }).length;
  const hardLt = model.filter((e) => { const v = str(e, 6); return v !== undefined && v.toUpperCase() !== 'BYLAYER' && v.toUpperCase() !== 'BYBLOCK'; }).length;
  const pct = model.length ? (hardColor / model.length) * 100 : 0;
  checks.push(hardColor === 0
    ? c('Colours controlled ByLayer', 'pass', 'No entity overrides the layer colour.')
    : c('Colours controlled ByLayer', pct > 10 ? 'warn' : 'info', `${hardColor} entities (${pct.toFixed(1)}%) carry a hard-coded colour override.`));
  checks.push(hardLt === 0
    ? c('Linetypes controlled ByLayer', 'pass', 'No entity overrides the layer linetype.')
    : c('Linetypes controlled ByLayer', 'warn', `${hardLt} entities carry a hard-coded linetype override.`));

  const dimscale = hdrNum(doc, '$DIMSCALE') || 1;
  const heights = model.filter((e) => e.type === 'TEXT' || e.type === 'MTEXT').map((e) => num(e, 40)).filter((h) => h > 0);
  const distinct = Array.from(new Set(heights.map((h) => +h.toFixed(3))));
  if (!heights.length) checks.push(c('Text heights (ISO 3098)', 'info', 'No TEXT/MTEXT entities found.'));
  else {
    const nonStd = distinct.filter((h) => !ISO_3098_HEIGHTS.some((s) => Math.abs(h / dimscale - s) < 0.01 || Math.abs(h - s) < 0.01));
    checks.push(nonStd.length === 0
      ? c('Text heights (ISO 3098)', 'pass', `All ${distinct.length} text heights match the ISO 3098 series (direct or × DIMSCALE ${dimscale}).`)
      : c('Text heights (ISO 3098)', 'warn', `${nonStd.length} of ${distinct.length} distinct heights are outside the ISO 3098 series: ${nonStd.slice(0, 8).join(', ')}.`));
    if (distinct.length > 6) checks.push(c('Text height variety', 'warn', `${distinct.length} different text heights are used; most standards limit a sheet to 3–4.`));
  }
  return { format: 'ASCII DXF', supported: true, checks, stats: baseDxfStats(doc) };
}

// ----- DXF: GD&T -------------------------------------------------------------

function gdtReport(doc: DxfDoc): ValidationReport {
  const checks: ValidationCheck[] = [];
  const fcfs = doc.entities.filter((e) => e.type === 'TOLERANCE');
  const dims = doc.entities.filter((e) => e.type === 'DIMENSION');
  const datumInserts = doc.entities.filter((e) => e.type === 'INSERT' && /datum/i.test(str(e, 2) || ''));
  const referenced = new Set<string>();
  let fcfWithDatum = 0;
  for (const f of fcfs) {
    const text = str(f, 1) || '';
    const parts = text.split('%%v').slice(2).map((p) => p.replace(/\{[^}]*\}/g, '').replace(/[^A-Z]/g, ''));
    const letters = parts.filter((p) => /^[A-Z]{1,2}$/.test(p));
    letters.forEach((l) => l.split('').forEach((ch) => referenced.add(ch)));
    if (letters.length) fcfWithDatum++;
  }
  // Datum identifiers drawn as FCFs with only a letter, or as text inside datum blocks
  const datumLetterFcfs = fcfs.filter((f) => /^(\{[^}]*\})?[A-Z]$/.test((str(f, 1) || '').replace(/%%v/g, '').trim()));

  checks.push(dims.length
    ? c('Dimensions present', 'pass', `${dims.length} DIMENSION entities found.`)
    : c('Dimensions present', 'fail', 'No DIMENSION entities — dimensions may be exploded into lines/text, which breaks associativity.'));
  checks.push(fcfs.length
    ? c('Feature control frames present', 'pass', `${fcfs.length} TOLERANCE (feature control frame) entities found.`)
    : c('Feature control frames present', 'fail', 'No TOLERANCE entities. Geometric tolerances drawn as plain text/blocks cannot be verified.'));
  if (fcfs.length) {
    checks.push(fcfWithDatum
      ? c('Datum references in FCFs', 'pass', `${fcfWithDatum} of ${fcfs.length} frames reference datums: ${Array.from(referenced).sort().join(', ')}.`)
      : c('Datum references in FCFs', 'warn', 'No frame references a datum. Orientation/location tolerances (⊥ ∥ ⌖ etc.) require datums per ASME Y14.5 / ISO 1101.'));
  }
  if (referenced.size) {
    const defined = datumInserts.length + datumLetterFcfs.length;
    checks.push(defined
      ? c('Datum feature symbols placed', 'pass', `${defined} datum feature symbol(s) detected (blocks named *DATUM* or letter-only frames).`)
      : c('Datum feature symbols placed', 'warn', `Frames reference ${Array.from(referenced).join(', ')} but no datum feature symbol was detected. Heuristic: symbols are recognised as INSERTs whose block name contains "DATUM" or letter-only TOLERANCE frames.`));
  }
  checks.push(c('Scope note', 'info', 'Checks are structural (entity presence and references). Tolerance values and functional adequacy still need engineering review.'));
  return {
    format: 'ASCII DXF', supported: true, checks,
    stats: [...baseDxfStats(doc), { label: 'Datums referenced', value: Array.from(referenced).sort().join(', ') || 'none' }],
  };
}

// ----- DXF: CNC machinability ------------------------------------------------

function cncReport(doc: DxfDoc, opts: AnalysisOptions): ValidationReport {
  const toolDia = Math.max(0.1, opts.minToolDia ?? 6);
  const toolR = toolDia / 2;
  const checks: ValidationCheck[] = [];
  const model = doc.entities.filter((e) => !e.paper);
  const smallArcs = model.filter((e) => e.type === 'ARC' && num(e, 40) < toolR);
  const smallHoles = model.filter((e) => e.type === 'CIRCLE' && num(e, 40) * 2 < toolDia);
  checks.push(smallArcs.length === 0
    ? c(`Arc radii ≥ cutter radius (${toolR} mm)`, 'pass', 'No arc is tighter than the smallest cutter.')
    : c(`Arc radii ≥ cutter radius (${toolR} mm)`, 'fail', `${smallArcs.length} arcs have R < ${toolR} mm (smallest R ${Math.min(...smallArcs.map((e) => num(e, 40))).toFixed(3)}). If these are internal corners they cannot be milled with a Ø${toolDia} tool.`));
  checks.push(smallHoles.length === 0
    ? c(`Hole diameters ≥ Ø${toolDia} mm`, 'pass', 'All circles can be interpolated with the selected cutter.')
    : c(`Hole diameters ≥ Ø${toolDia} mm`, 'warn', `${smallHoles.length} circles are smaller than Ø${toolDia} mm — they need drilling or a smaller end mill.`));

  // Concave sharp corners on closed polylines (no fillet / bulge).
  let sharpConcave = 0;
  for (const e of model) {
    if ((e.type !== 'LWPOLYLINE' && e.type !== 'POLYLINE') || !e.vertices || e.vertices.length < 3) continue;
    if ((num(e, 70) & 1) !== 1) continue;
    const v = e.vertices;
    let area = 0;
    for (let k = 0; k < v.length; k++) { const a = v[k], b = v[(k + 1) % v.length]; area += a.x * b.y - b.x * a.y; }
    const orient = Math.sign(area);
    for (let k = 0; k < v.length; k++) {
      const p = v[(k - 1 + v.length) % v.length], q = v[k], r = v[(k + 1) % v.length];
      if (Math.abs(p.bulge) > 1e-9 || Math.abs(q.bulge) > 1e-9) continue;
      const cross = (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
      if (Math.sign(cross) === -orient && Math.abs(cross) > 1e-9) sharpConcave++;
    }
  }
  checks.push(sharpConcave === 0
    ? c('Concave corners filleted', 'pass', 'No unfilleted concave corners on closed polylines.')
    : c('Concave corners filleted', 'warn', `${sharpConcave} concave sharp corners found on closed polylines. On an outer profile these are internal corners that will be left with a radius = cutter radius.`));

  const ext = extentOf(doc);
  const size = ext ? Math.hypot(ext.maxX - ext.minX, ext.maxY - ext.minY) : 1;
  const ep = analyseEndpoints(curvesOf(doc), size * 1e-7 + 1e-6, opts.gapTol ?? Math.max(0.001, size * 1e-3));
  checks.push(ep.danglingEnds.length === 0
    ? c('Closed toolpath contours', 'pass', 'Every open curve connects end-to-end.')
    : c('Closed toolpath contours', 'warn', `${ep.danglingEnds.length} dangling endpoints — CAM will not be able to chain these into closed profiles.`));
  const textCount = model.filter((e) => e.type === 'TEXT' || e.type === 'MTEXT').length;
  if (textCount) checks.push(c('Annotation in model space', 'info', `${textCount} text entities in model space; move them to a non-cutting layer before CAM import.`));
  return { format: 'ASCII DXF', supported: true, checks, stats: [...baseDxfStats(doc), { label: 'Cutter used for checks', value: `Ø${toolDia} mm` }] };
}

// ----- DXF: scale consistency -----------------------------------------------

function scaleReport(doc: DxfDoc): ValidationReport {
  const checks: ValidationCheck[] = [];
  const dimscale = hdrNum(doc, '$DIMSCALE');
  const ltscale = hdrNum(doc, '$LTSCALE');
  const psltscale = hdrNum(doc, '$PSLTSCALE');
  const vps = doc.viewports.filter((v) => num(v, 69) !== 1 && num(v, 45) > 0);
  const scales = vps.map((v) => num(v, 41) / num(v, 45));
  const fmt = (s: number) => (s >= 1 ? `${s.toFixed(3)}:1` : `1:${(1 / s).toFixed(2)}`);
  const distinct = Array.from(new Set(scales.map((s) => +s.toPrecision(4))));

  if (!vps.length) checks.push(c('Layout viewports', 'info', 'No floating VIEWPORT entities found; only model-space scale variables can be checked.'));
  else checks.push(distinct.length === 1
    ? c('Viewport scales', 'pass', `${vps.length} viewport(s), all at ${fmt(distinct[0])}.`)
    : c('Viewport scales', 'warn', `${vps.length} viewports use ${distinct.length} different scales: ${distinct.slice(0, 6).map(fmt).join(', ')}. Confirm each detail is labelled with its own scale.`));

  if (dimscale === 0) checks.push(c('$DIMSCALE', 'pass', 'DIMSCALE = 0 — dimensions scale to the viewport automatically.'));
  else if (dimscale !== undefined && distinct.length === 1) {
    const expected = 1 / distinct[0];
    const ok = Math.abs(dimscale - expected) / expected < 0.05 || dimscale === 1;
    checks.push(ok
      ? c('$DIMSCALE vs viewport scale', 'pass', `DIMSCALE ${dimscale} is consistent with the viewport scale${dimscale === 1 ? ' (or dimensions are placed in paper space / annotative)' : ''}.`)
      : c('$DIMSCALE vs viewport scale', 'warn', `DIMSCALE is ${dimscale} but the viewport scale implies ${expected.toFixed(2)}. Model-space dimensions will print at the wrong size.`));
  } else checks.push(c('$DIMSCALE', 'info', `DIMSCALE = ${dimscale ?? 'not declared'}.`));

  if (ltscale !== undefined) {
    checks.push(psltscale === 1 && ltscale !== 1
      ? c('Linetype scaling', 'info', `PSLTSCALE = 1 with LTSCALE = ${ltscale}: paper-space linetypes scale per viewport; verify dash appearance in each viewport.`)
      : c('Linetype scaling', 'pass', `LTSCALE = ${ltscale}, PSLTSCALE = ${psltscale ?? 'n/a'}.`));
  }

  const dimStyles = new Set(doc.entities.filter((e) => e.type === 'DIMENSION').map((e) => str(e, 3) || 'STANDARD'));
  if (dimStyles.size > 1) checks.push(c('Dimension styles in use', 'info', `${dimStyles.size} dimension styles: ${Array.from(dimStyles).slice(0, 6).join(', ')}.`));
  return { format: 'ASCII DXF', supported: true, checks, stats: [...baseDxfStats(doc), { label: 'Viewport scales', value: distinct.map(fmt).join(', ') || '—' }] };
}

// ----- DXF: open contours ---------------------------------------------------

function openContourReport(doc: DxfDoc, opts: AnalysisOptions): ValidationReport {
  const curves = curvesOf(doc);
  const ext = extentOf(doc);
  const size = ext ? Math.hypot(ext.maxX - ext.minX, ext.maxY - ext.minY) : 1;
  const snap = size * 1e-7 + 1e-6;
  const gapTol = opts.gapTol ?? Math.max(0.001, size * 1e-3);
  const ep = analyseEndpoints(curves, snap, gapTol);
  const polyOpen = curves.filter((cv) => (cv.entity.type === 'LWPOLYLINE' || cv.entity.type === 'POLYLINE') && !cv.closed).length;
  const checks: ValidationCheck[] = [
    ep.danglingEnds.length === 0
      ? c('Dangling endpoints', 'pass', 'All curve endpoints connect to another curve.')
      : c('Dangling endpoints', 'fail', `${ep.danglingEnds.length} endpoints connect to nothing. First: ${ep.danglingEnds.slice(0, 3).map((p) => `(${p[0].toFixed(3)}, ${p[1].toFixed(3)})`).join(', ')}.`),
    ep.microGaps.length === 0
      ? c(`Micro-gaps (≤ ${gapTol.toPrecision(3)})`, 'pass', 'No near-miss gaps found.')
      : c(`Micro-gaps (≤ ${gapTol.toPrecision(3)})`, 'fail', `${ep.microGaps.length} near-miss gaps — invisible on screen but block HATCH / BOUNDARY / CAM chaining. Largest ${Math.max(...ep.microGaps.map((g) => g.gap)).toExponential(2)} at (${ep.microGaps[0].a[0].toFixed(3)}, ${ep.microGaps[0].a[1].toFixed(3)}). Fix with JOIN / PEDIT with fuzz distance.`),
    polyOpen === 0
      ? c('Polylines closed', 'pass', 'Every polyline is closed or has coincident ends.')
      : c('Polylines closed', 'warn', `${polyOpen} polylines are open.`),
  ];
  return {
    format: 'ASCII DXF', supported: true, checks,
    stats: [...baseDxfStats(doc), { label: 'Curves analysed', value: String(curves.length) }, { label: 'Snap tolerance', value: snap.toExponential(2) }],
  };
}

// ----- DXF: duplicates/overlaps ---------------------------------------------

function duplicateReport(doc: DxfDoc): ValidationReport {
  const lines = doc.entities.filter((e) => !e.paper && e.type === 'LINE').map((e) => ({
    x1: num(e, 10), y1: num(e, 20), x2: num(e, 11), y2: num(e, 21), layer: e.layer,
  }));
  const ext = extentOf(doc);
  const size = ext ? Math.hypot(ext.maxX - ext.minX, ext.maxY - ext.minY) : 1;
  const tol = Math.max(1e-6, size * 1e-7);
  const r = (v: number) => Math.round(v / tol);
  const seen = new Set<string>();
  let dupLines = 0;
  for (const l of lines) {
    const a = `${r(l.x1)},${r(l.y1)}`, b = `${r(l.x2)},${r(l.y2)}`;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (seen.has(key)) dupLines++; else seen.add(key);
  }
  // Collinear overlaps
  const groups = new Map<string, { t1: number; t2: number }[]>();
  for (const l of lines) {
    const dx = l.x2 - l.x1, dy = l.y2 - l.y1;
    const len = Math.hypot(dx, dy);
    if (len < tol) continue;
    let ux = dx / len, uy = dy / len;
    if (ux < -1e-12 || (Math.abs(ux) < 1e-12 && uy < 0)) { ux = -ux; uy = -uy; }
    const offset = l.x1 * -uy + l.y1 * ux;
    const key = `${Math.round(Math.atan2(uy, ux) * 1e6)}|${Math.round(offset / (tol * 10))}`;
    const t1 = l.x1 * ux + l.y1 * uy, t2 = l.x2 * ux + l.y2 * uy;
    (groups.get(key) || groups.set(key, []).get(key)!).push({ t1: Math.min(t1, t2), t2: Math.max(t1, t2) });
  }
  let overlaps = 0;
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    g.sort((a, b) => a.t1 - b.t1);
    let end = g[0].t2;
    for (let k = 1; k < g.length; k++) {
      if (g[k].t1 < end - tol) overlaps++;
      end = Math.max(end, g[k].t2);
    }
  }
  const circSeen = new Set<string>();
  let dupCircles = 0;
  for (const e of doc.entities) {
    if (e.paper || (e.type !== 'CIRCLE' && e.type !== 'ARC')) continue;
    const key = `${e.type}|${r(num(e, 10))}|${r(num(e, 20))}|${r(num(e, 40))}|${Math.round(num(e, 50) * 1000)}|${Math.round(num(e, 51) * 1000)}`;
    if (circSeen.has(key)) dupCircles++; else circSeen.add(key);
  }
  const checks: ValidationCheck[] = [
    dupLines === 0 ? c('Exact duplicate lines', 'pass', `${lines.length} LINE entities checked, no duplicates.`)
      : c('Exact duplicate lines', 'fail', `${dupLines} LINE entities are exact duplicates (either direction). Run OVERKILL.`),
    overlaps - dupLines <= 0 ? c('Collinear overlapping lines', 'pass', 'No partially overlapping collinear lines.')
      : c('Collinear overlapping lines', 'warn', `${overlaps - dupLines} collinear lines partially overlap another line — causes double cuts on lasers/plotters.`),
    dupCircles === 0 ? c('Duplicate circles/arcs', 'pass', 'No stacked circles or arcs.')
      : c('Duplicate circles/arcs', 'fail', `${dupCircles} circles/arcs are stacked on an identical copy.`),
  ];
  return { format: 'ASCII DXF', supported: true, checks, stats: [...baseDxfStats(doc), { label: 'Comparison tolerance', value: tol.toExponential(2) }] };
}

// ----- DXF: dimension overrides ---------------------------------------------

function stripMtext(s: string): string {
  return s.replace(/\\[ACcFfHhQqTtWw][^;]*;/g, '').replace(/\\[PpLlOoKk~]/g, ' ').replace(/[{}]/g, '').replace(/%%[cdp]/gi, '');
}

function dimOverrideReport(doc: DxfDoc): ValidationReport {
  const dims = doc.entities.filter((e) => e.type === 'DIMENSION');
  let overridden = 0, fake = 0, frozenEqual = 0, textOnly = 0;
  const examples: string[] = [];
  for (const d of dims) {
    const text = str(d, 1);
    if (!text || text.includes('<>')) continue;
    overridden++;
    const meas = num(d, 42, NaN);
    const m = stripMtext(text).match(/-?\d+(?:[.,]\d+)?/);
    if (!m) { textOnly++; continue; }
    const val = Number(m[0].replace(',', '.'));
    if (Number.isFinite(meas)) {
      const lfac = hdrNum(doc, '$DIMLFAC') || 1;
      const actual = Math.abs(meas * lfac);
      const isAngle = (num(d, 70) & 7) === 2 || (num(d, 70) & 7) === 5;
      const actualCmp = isAngle ? (actual * 180) / Math.PI : actual;
      if (Math.abs(val - actualCmp) > Math.max(0.01, actualCmp * 0.005)) {
        fake++;
        if (examples.length < 5) examples.push(`"${stripMtext(text).trim()}" vs measured ${actualCmp.toFixed(3)}`);
      } else frozenEqual++;
    }
  }
  const checks: ValidationCheck[] = [];
  if (!dims.length) checks.push(c('Dimensions found', 'info', 'No DIMENSION entities in the file.'));
  else {
    checks.push(fake === 0
      ? c('Overridden values match geometry', 'pass', 'No dimension shows a number that differs from the measured geometry.')
      : c('Overridden values match geometry', 'fail', `${fake} dimensions display a value different from the true measurement: ${examples.join('; ')}.`));
    checks.push(frozenEqual === 0
      ? c('Hard-typed numeric values', 'pass', 'No dimension has a typed number replacing the live measurement.')
      : c('Hard-typed numeric values', 'warn', `${frozenEqual} dimensions show a typed number that currently matches the geometry but will not update if the geometry changes.`));
    if (textOnly) checks.push(c('Text-only overrides', 'info', `${textOnly} dimensions replace the value with non-numeric text (e.g. "TYP", "REF").`));
    checks.push(c('Associativity', overridden ? 'info' : 'pass', `${dims.length - overridden} of ${dims.length} dimensions use the live measured value (<> or empty override).`));
  }
  return { format: 'ASCII DXF', supported: true, checks, stats: [...baseDxfStats(doc), { label: 'Dimensions', value: String(dims.length) }, { label: 'Text overrides', value: String(overridden) }] };
}

// ----- Naming conventions ---------------------------------------------------

// ISO 19650-2 (UK National Annex) container ID: Project-Originator-Volume-Level-Type-Role-Number
const ISO19650_RE = /^[A-Z0-9]{2,6}-[A-Z0-9]{3,6}-[A-Z0-9]{1,2}-[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z]{1,2}-\d{4,6}$/;
// US National CAD Standard / AIA layer format: Discipline(1-2)-Major(4)[-Minor(4)][-Minor(4)][-Status(1)]
const AIA_RE = /^[A-Z][A-Z-]?-[A-Z0-9]{4}(-[A-Z0-9]{4}){0,2}(-[A-Z0-9])?$/;

function fileNameCheck(fileName: string): ValidationCheck {
  const base = fileName.replace(/\.[^.]+$/, '').toUpperCase();
  return ISO19650_RE.test(base)
    ? c('File name (ISO 19650-2 UK NA fields)', 'pass', `"${base}" matches Project-Originator-Volume-Level-Type-Role-Number.`)
    : c('File name (ISO 19650-2 UK NA fields)', 'warn', `"${base}" does not follow Project-Originator-Volume-Level-Type-Role-Number (e.g. PRJ01-ARC-ZZ-01-M3-A-0001).`);
}

function dxfNamingReport(doc: DxfDoc, fileName: string): ValidationReport {
  const names = doc.layers.map((l) => l.name).filter((n) => n !== '0' && n.toUpperCase() !== 'DEFPOINTS');
  const bad = names.filter((n) => !AIA_RE.test(n));
  const lower = names.filter((n) => n !== n.toUpperCase());
  const checks: ValidationCheck[] = [fileNameCheck(fileName)];
  if (!names.length) checks.push(c('Layer names (US NCS / AIA)', 'info', 'Only layers 0/Defpoints exist.'));
  else checks.push(bad.length === 0
    ? c('Layer names (US NCS / AIA)', 'pass', `All ${names.length} layers follow Discipline-Major[-Minor][-Status].`)
    : c('Layer names (US NCS / AIA)', bad.length / names.length > 0.2 ? 'fail' : 'warn', `${bad.length} of ${names.length} layers do not match the NCS pattern: ${bad.slice(0, 10).join(', ')}${bad.length > 10 ? '…' : ''}.`));
  if (lower.length) checks.push(c('Upper-case layer names', 'warn', `${lower.length} layer names contain lower-case characters.`));
  const used = new Set(doc.entities.map((e) => e.layer));
  const empty = names.filter((n) => !used.has(n));
  if (empty.length) checks.push(c('Unused layers', 'info', `${empty.length} layers contain no model/paper entities (PURGE candidates).`));
  return { format: 'ASCII DXF', supported: true, checks, stats: [...baseDxfStats(doc)] };
}

function splitStepArgs(s: string): string[] {
  const out: string[] = [];
  let depth = 0, cur = '', inStr = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      cur += ch;
      if (ch === "'") { if (s[i + 1] === "'") { cur += "'"; i++; } else inStr = false; }
      continue;
    }
    if (ch === "'") { inStr = true; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const IFC_PRODUCTS = /^IFC(WALL|WALLSTANDARDCASE|SLAB|COLUMN|BEAM|DOOR|WINDOW|STAIR|STAIRFLIGHT|ROOF|RAILING|COVERING|MEMBER|PLATE|CURTAINWALL|FOOTING|PILE|RAMP|BUILDINGELEMENTPROXY|FURNISHINGELEMENT|FLOWTERMINAL|FLOWSEGMENT|PIPESEGMENT|DUCTSEGMENT|PIPEFITTING|DUCTFITTING|SPACE|BUILDINGSTOREY|CABLESEGMENT|LIGHTFIXTURE|SANITARYTERMINAL)$/;

function ifcNamingReport(text: string, fileName: string): ValidationReport {
  const schema = text.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i)?.[1] || 'unknown';
  const re = /^#(\d+)\s*=\s*(IFC[A-Z0-9]+)\s*\(([\s\S]*?)\);\s*$/gm;
  const guids = new Map<string, number>();
  let products = 0, unnamed = 0, proxies = 0, defaultNamed = 0;
  const storeys: string[] = [];
  const spacesMissingNumber: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const type = m[2].toUpperCase();
    if (!IFC_PRODUCTS.test(type)) continue;
    const args = splitStepArgs(m[3]);
    products++;
    const guid = args[0]?.replace(/'/g, '') || '';
    guids.set(guid, (guids.get(guid) || 0) + 1);
    const name = args[2] && args[2] !== '$' ? args[2].replace(/^'|'$/g, '') : '';
    if (!name) unnamed++;
    if (type === 'IFCBUILDINGELEMENTPROXY') proxies++;
    if (/^(Generic|Default|Basic Wall:Generic|Unnamed|Element)\b/i.test(name)) defaultNamed++;
    if (type === 'IFCBUILDINGSTOREY') storeys.push(name || '(unnamed)');
    if (type === 'IFCSPACE' && !name) spacesMissingNumber.push(Number(m[1]));
  }
  const dupGuids = Array.from(guids.entries()).filter(([g, n]) => g && n > 1).length;
  const checks: ValidationCheck[] = [fileNameCheck(fileName)];
  if (!products) {
    checks.push(c('IFC products', 'fail', 'No IfcProduct instances recognised — file may be truncated or use a non-standard encoding.'));
  } else {
    checks.push(dupGuids === 0 ? c('Unique GlobalIds', 'pass', `${products} products, all GlobalIds unique.`)
      : c('Unique GlobalIds', 'fail', `${dupGuids} GlobalIds are reused — breaks clash detection and model federation.`));
    const pctUnnamed = (unnamed / products) * 100;
    checks.push(unnamed === 0 ? c('Elements named', 'pass', 'Every product has a Name attribute.')
      : c('Elements named', pctUnnamed > 5 ? 'fail' : 'warn', `${unnamed} products (${pctUnnamed.toFixed(1)}%) have an empty Name.`));
    checks.push(proxies === 0 ? c('Classified elements (no proxies)', 'pass', 'No IfcBuildingElementProxy instances.')
      : c('Classified elements (no proxies)', proxies / products > 0.05 ? 'warn' : 'info', `${proxies} elements exported as IfcBuildingElementProxy — check the IFC export class mapping.`));
    if (defaultNamed) checks.push(c('Default/generic names', 'warn', `${defaultNamed} elements still carry generic/default names.`));
    checks.push(storeys.length ? c('Building storeys', 'info', `${storeys.length} storeys: ${storeys.slice(0, 10).join(', ')}.`)
      : c('Building storeys', 'warn', 'No IfcBuildingStorey found — spatial structure is incomplete.'));
    if (spacesMissingNumber.length) checks.push(c('Space numbers', 'warn', `${spacesMissingNumber.length} IfcSpace instances have no Name (room number).`));
  }
  return {
    format: `IFC (${schema})`, supported: true, checks,
    stats: [{ label: 'Schema', value: schema }, { label: 'Products', value: String(products) }, { label: 'Storeys', value: String(storeys.length) }],
  };
}

// ----- Mesh reports ---------------------------------------------------------

function meshReport(slug: string, mesh: Mesh): ValidationReport {
  const s = meshStats(mesh);
  const dims = [0, 1, 2].map((k) => s.bbox.max[k] - s.bbox.min[k]);
  const checks: ValidationCheck[] = [];
  const watertight = s.boundaryEdges === 0 && s.nonManifoldEdges === 0;
  checks.push(s.boundaryEdges === 0 ? c('Watertight (no boundary edges)', 'pass', 'Every edge is shared by two faces.')
    : c('Watertight (no boundary edges)', 'fail', `${s.boundaryEdges} open boundary edges — mesh has holes.`));
  checks.push(s.nonManifoldEdges === 0 ? c('Manifold edges', 'pass', 'No edge is shared by more than two faces.')
    : c('Manifold edges', 'fail', `${s.nonManifoldEdges} non-manifold edges (shared by 3+ faces).`));
  checks.push(s.inconsistentEdges === 0 ? c('Consistent face winding', 'pass', 'Adjacent faces have compatible orientation.')
    : c('Consistent face winding', 'fail', `${s.inconsistentEdges} edges are traversed in the same direction by two faces — some faces are flipped.`));
  checks.push(s.degenerate === 0 ? c('Degenerate triangles', 'pass', 'No zero-area triangles.')
    : c('Degenerate triangles', 'warn', `${s.degenerate} zero-area / collapsed triangles.`));
  checks.push(s.duplicateTris === 0 ? c('Duplicate triangles', 'pass', 'No duplicated faces.')
    : c('Duplicate triangles', 'warn', `${s.duplicateTris} duplicated faces.`));
  if (s.normalsStored) checks.push(s.flippedNormals === 0 ? c('Stored normals agree with winding', 'pass', 'Facet normals match vertex order.')
    : c('Stored normals agree with winding', 'warn', `${s.flippedNormals} facet normals point opposite to the vertex winding.`));
  if (watertight) checks.push(s.volume > 0 ? c('Outward orientation', 'pass', `Signed volume positive (${s.volume.toFixed(2)} unit³).`)
    : c('Outward orientation', 'fail', 'Signed volume is negative — the whole mesh is inside-out.'));

  if (slug === '3d-print-manufacturability-checker') {
    const big = dims.some((d) => d > 256);
    checks.push(big ? c('Fits common build volume (256 mm)', 'warn', `Bounding box ${dims.map((d) => d.toFixed(1)).join(' × ')} exceeds 256 mm on at least one axis (assuming mm units).`)
      : c('Fits common build volume (256 mm)', 'pass', `Bounding box ${dims.map((d) => d.toFixed(1)).join(' × ')} mm.`));
    const tiny = Math.min(...dims) < 0.8;
    checks.push(tiny ? c('Minimum overall thickness', 'warn', `Smallest bounding dimension ${Math.min(...dims).toFixed(2)} mm is below a 0.8 mm (2 × 0.4 mm nozzle) wall.`)
      : c('Minimum overall thickness', 'pass', 'Overall part thickness exceeds two nozzle widths. (Local wall thickness is not measured.)'));
    const pct = s.area ? (s.overhangArea / s.area) * 100 : 0;
    checks.push(pct > 5 ? c('Overhangs > 45°', 'warn', `${pct.toFixed(1)}% of the surface area overhangs more than 45° in the current orientation — supports likely required.`)
      : c('Overhangs > 45°', 'pass', `${pct.toFixed(1)}% of the surface overhangs more than 45°.`));
  }
  return {
    format: mesh.format, supported: true, checks,
    stats: [
      { label: 'Triangles', value: s.triangles.toLocaleString() },
      { label: 'Unique vertices', value: s.vertices.toLocaleString() },
      { label: 'Bounding box', value: dims.map((d) => d.toFixed(2)).join(' × ') },
      { label: 'Surface area', value: s.area.toFixed(2) },
      { label: 'Volume', value: watertight ? Math.abs(s.volume).toFixed(2) : 'n/a (not watertight)' },
    ],
  };
}

// ---------------------------------------------------------------------------
// Viewer helpers
// ---------------------------------------------------------------------------

export interface StepMeta {
  kind: 'STEP' | 'IGES';
  fields: { label: string; value: string }[];
  entityCounts: [string, number][];
}

export function parseStepIgesMeta(text: string): StepMeta | null {
  if (/ISO-10303-21/.test(text.slice(0, 200))) {
    const get = (re: RegExp) => text.match(re)?.[1];
    const fn = text.match(/FILE_NAME\s*\(([\s\S]*?)\);/i);
    const fnArgs = fn ? splitStepArgs(fn[1]) : [];
    const clean = (v?: string) => (v ? v.replace(/^\(|\)$/g, '').replace(/'/g, '').trim() || '—' : '—');
    const counts = new Map<string, number>();
    const re = /^#\d+\s*=\s*([A-Z_0-9]+)\s*\(/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) counts.set(m[1], (counts.get(m[1]) || 0) + 1);
    const products = Array.from(text.matchAll(/=\s*PRODUCT\s*\(\s*'([^']*)'/g)).map((x) => x[1]).slice(0, 10);
    return {
      kind: 'STEP',
      fields: [
        { label: 'Schema', value: get(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i) || '—' },
        { label: 'Description', value: clean(get(/FILE_DESCRIPTION\s*\(\s*\(([^)]*)\)/i)) },
        { label: 'File name', value: clean(fnArgs[0]) },
        { label: 'Timestamp', value: clean(fnArgs[1]) },
        { label: 'Author', value: clean(fnArgs[2]) },
        { label: 'Organization', value: clean(fnArgs[3]) },
        { label: 'Preprocessor', value: clean(fnArgs[4]) },
        { label: 'Originating system', value: clean(fnArgs[5]) },
        { label: 'Products', value: products.join(', ') || '—' },
        { label: 'Solid bodies (MANIFOLD_SOLID_BREP)', value: String(counts.get('MANIFOLD_SOLID_BREP') || 0) },
      ],
      entityCounts: Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15),
    };
  }
  // IGES: fixed 80-column records, column 73 = section letter
  const lines = text.split(/\r?\n/).filter((l) => l.length >= 73);
  if (!lines.length || !/[SGDPT]/.test(lines[0][72])) return null;
  const global = lines.filter((l) => l[72] === 'G').map((l) => l.slice(0, 72)).join('');
  // Tokenise the Global section: parameters may be Hollerith strings (nHxxxx);
  // parameters 1 and 2 redefine the parameter / record delimiters.
  let pd = ',', rd = ';';
  const params: string[] = [];
  let i = 0;
  while (i < global.length && params.length < 30) {
    let value = '';
    const hm = global.slice(i).match(/^\s*(\d+)H/);
    if (hm) {
      const n = Number(hm[1]);
      const start = i + hm[0].length;
      value = global.slice(start, start + n);
      i = start + n;
      while (i < global.length && global[i] !== pd && global[i] !== rd) i++;
    } else {
      while (i < global.length && global[i] !== pd && global[i] !== rd) value += global[i++];
    }
    params.push(value.trim());
    if (params.length === 1 && value.length === 1) pd = value;
    if (params.length === 2 && value.length === 1) rd = value;
    const delim = global[i];
    i++;
    if (delim === rd) break;
  }
  const unitsMap: Record<string, string> = { '1': 'Inches', '2': 'Millimeters', '4': 'Feet', '6': 'Meters', '10': 'Centimeters' };
  const dir = lines.filter((l) => l[72] === 'D');
  const counts = new Map<string, number>();
  for (let k = 0; k < dir.length; k += 2) {
    const t = dir[k].slice(0, 8).trim();
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  const typeNames: Record<string, string> = { '100': 'Circular arc', '102': 'Composite curve', '110': 'Line', '126': 'B-spline curve', '128': 'B-spline surface', '142': 'Curve on surface', '144': 'Trimmed surface', '186': 'Manifold solid B-rep', '314': 'Color', '402': 'Associativity', '406': 'Property', '502': 'Vertex list', '504': 'Edge list', '508': 'Loop', '510': 'Face', '514': 'Shell' };
  return {
    kind: 'IGES',
    fields: [
      { label: 'Product ID (sender)', value: params[2] || '—' },
      { label: 'File name', value: params[3] || '—' },
      { label: 'Native system', value: params[4] || '—' },
      { label: 'Preprocessor', value: params[5] || '—' },
      { label: 'Units', value: unitsMap[params[13]] || params[14] || '—' },
      { label: 'Created', value: params[17] || '—' },
      { label: 'Author', value: params[20] || '—' },
      { label: 'Organization', value: params[21] || '—' },
    ],
    entityCounts: Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => [`${k} ${typeNames[k] || ''}`.trim(), v]),
  };
}

export interface GcodeMove { x1: number; y1: number; x2: number; y2: number; rapid: boolean; z: number }

/** Parse G0/G1/G2/G3 moves (absolute/incremental, XY plane) into straight segments for plotting. */
export function parseGcode(text: string): { moves: GcodeMove[]; stats: { label: string; value: string }[] } {
  let x = 0, y = 0, z = 0, mode = 0, abs = true, inch = false;
  const moves: GcodeMove[] = [];
  let cutLen = 0, rapidLen = 0, lines = 0, maxF = 0;
  const tools = new Set<string>();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\(.*?\)/g, '').replace(/;.*$/, '').toUpperCase().trim();
    if (!line) continue;
    lines++;
    const words = Array.from(line.matchAll(/([A-Z])\s*(-?\d*\.?\d+)/g)).map((w) => [w[1], Number(w[2])] as [string, number]);
    let nx = x, ny = y, nz = z, i = 0, j = 0, r: number | undefined, hasMove = false;
    for (const [w, v] of words) {
      if (w === 'G') {
        if ([0, 1, 2, 3].includes(v)) mode = v;
        else if (v === 90) abs = true;
        else if (v === 91) abs = false;
        else if (v === 20) inch = true;
        else if (v === 21) inch = false;
      } else if (w === 'X') { nx = abs ? v : x + v; hasMove = true; }
      else if (w === 'Y') { ny = abs ? v : y + v; hasMove = true; }
      else if (w === 'Z') { nz = abs ? v : z + v; hasMove = true; }
      else if (w === 'I') i = v;
      else if (w === 'J') j = v;
      else if (w === 'R') r = v;
      else if (w === 'F') maxF = Math.max(maxF, v);
      else if (w === 'T') tools.add(`T${v}`);
    }
    if (!hasMove) continue;
    if (mode === 2 || mode === 3) {
      let cx: number, cy: number;
      if (r !== undefined) {
        const d = Math.hypot(nx - x, ny - y);
        const h = Math.sqrt(Math.max(0, r * r - (d / 2) ** 2));
        const mx = (x + nx) / 2, my = (y + ny) / 2;
        const sgn = (mode === 2 ? 1 : -1) * (r < 0 ? -1 : 1);
        cx = mx + (sgn * h * (y - ny)) / (d || 1);
        cy = my + (sgn * h * (nx - x)) / (d || 1);
      } else { cx = x + i; cy = y + j; }
      const rad = Math.hypot(x - cx, y - cy);
      let a1 = Math.atan2(y - cy, x - cx), a2 = Math.atan2(ny - cy, nx - cx);
      if (mode === 2) { if (a2 >= a1 - 1e-9) a2 -= Math.PI * 2; } else if (a2 <= a1 + 1e-9) a2 += Math.PI * 2;
      const steps = Math.max(4, Math.ceil(Math.abs(a2 - a1) / (Math.PI / 36)));
      let px = x, py = y;
      for (let s = 1; s <= steps; s++) {
        const a = a1 + ((a2 - a1) * s) / steps;
        const qx = s === steps ? nx : cx + rad * Math.cos(a), qy = s === steps ? ny : cy + rad * Math.sin(a);
        moves.push({ x1: px, y1: py, x2: qx, y2: qy, rapid: false, z: nz });
        px = qx; py = qy;
      }
      cutLen += Math.abs(a2 - a1) * rad;
    } else {
      moves.push({ x1: x, y1: y, x2: nx, y2: ny, rapid: mode === 0, z: nz });
      const d = Math.hypot(nx - x, ny - y, nz - z);
      if (mode === 0) rapidLen += d; else cutLen += d;
    }
    x = nx; y = ny; z = nz;
  }
  const u = inch ? 'in' : 'mm';
  return {
    moves,
    stats: [
      { label: 'Program lines', value: String(lines) },
      { label: 'Motion segments', value: String(moves.length) },
      { label: 'Feed (cutting) length', value: `${cutLen.toFixed(1)} ${u}` },
      { label: 'Rapid length', value: `${rapidLen.toFixed(1)} ${u}` },
      { label: 'Max feed F', value: maxF ? String(maxF) : '—' },
      { label: 'Tools called', value: Array.from(tools).join(', ') || '—' },
    ],
  };
}

/** Intersect a triangle mesh with the horizontal plane z = h. */
export function sliceMesh(mesh: Mesh, h: number): [number, number, number, number][] {
  const t = mesh.tris;
  const out: [number, number, number, number][] = [];
  for (let o = 0; o < t.length; o += 9) {
    const pts: [number, number][] = [];
    for (let e = 0; e < 3; e++) {
      const a = o + e * 3, b = o + ((e + 1) % 3) * 3;
      const za = t[a + 2] - h, zb = t[b + 2] - h;
      if ((za < 0 && zb >= 0) || (za >= 0 && zb < 0)) {
        const k = za / (za - zb);
        pts.push([t[a] + (t[b] - t[a]) * k, t[a + 1] + (t[b + 1] - t[a + 1]) * k]);
      }
    }
    if (pts.length === 2) out.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
  }
  return out;
}

/** Basic, safe SVG optimisation: strip comments, metadata, editor namespaces and round numbers. */
export function optimizeSvg(svg: string, precision = 2): string {
  let out = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/<(sodipodi|inkscape):[^>]*\/>/gi, '')
    .replace(/<(sodipodi|inkscape):[\s\S]*?<\/\1:[^>]*>/gi, '')
    .replace(/\s(sodipodi|inkscape):[a-z-]+="[^"]*"/gi, '')
    .replace(/\sxmlns:(sodipodi|inkscape)="[^"]*"/gi, '');
  out = out.replace(/(-?\d*\.\d+)/g, (m) => String(+Number(m).toFixed(precision)));
  out = out.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
  return out;
}

/** Remove scripts, event handlers and external references before previewing an untrusted SVG. */
export function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(href|xlink:href)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, '');
}
