'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { meshStats } from '@/lib/cad-file-analysis';
import {
  generateParametricPart,
  exportMeshToBinaryStl,
  exportMeshToObj,
  exportPolygonToDxf,
  exportPolygonToStepAp214,
} from '@/lib/open-source-cad-engines';

type PartKind = 'spur-gear' | 'pipe-flange' | 'l-bracket';

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function parseRangeVal(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function downloadData(content: string | ArrayBuffer, filename: string, mime = 'text/plain;charset=utf-8') {
  const payload = typeof content === 'string' ? toSafeAscii(content) + '\r\n' : content;
  const blob = new Blob([payload], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function evaluateParametricGeometry(args: {
  kind: PartKind;
  moduleStr: string;
  teethStr: string;
  pressureAngleStr: string;
  thicknessStr: string;
  boreDiaStr: string;
  outerDiaStr: string;
  boltCircleDiaStr: string;
  boltCountStr: string;
  boltHoleDiaStr: string;
  legAStr: string;
  legBStr: string;
  widthStr: string;
}) {
  const { kind } = args;
  const thickness = parsePositive(args.thicknessStr);
  if (!Number.isFinite(thickness)) {
    return { valid: false as const, error: 'Extrusion / flange thickness must be > 0 mm.' };
  }

  if (kind === 'spur-gear') {
    const m = parsePositive(args.moduleStr);
    const z = parsePosInt(args.teethStr);
    const alpha = parsePositive(args.pressureAngleStr);
    const bore = parsePositive(args.boreDiaStr);
    if (!Number.isFinite(m) || !Number.isFinite(z) || !Number.isFinite(alpha) || !Number.isFinite(bore)) {
      return { valid: false as const, error: 'Gear module, bore diameter, and pressure angle must be > 0; teeth z must be an integer.' };
    }
    if (z < 6 || z > 120) {
      return { valid: false as const, error: 'Spur gear tooth count z must be between 6 and 120.' };
    }
    const rootDia = m * z - 2.5 * m;
    if (rootDia <= 4 || bore >= rootDia * 0.85) {
      return {
        valid: false as const,
        error: `Shaft bore (${bore} mm) must be < 85% of gear root diameter (${rootDia.toFixed(2)} mm).`,
      };
    }
    const generated = generateParametricPart({
      kind: 'spur-gear',
      module: m,
      teeth: z,
      pressureAngle: alpha,
      thickness,
      boreDia: bore,
    });
    const stats = meshStats(generated.mesh);
    const stlBuffer = exportMeshToBinaryStl(generated.mesh);
    return {
      valid: true as const,
      kind,
      generated,
      stats,
      stlByteLength: stlBuffer.byteLength,
      triCount: Math.floor(generated.mesh.tris.length / 9),
      pitchDiaMm: m * z,
      extrusionMm: thickness,
    };
  }

  if (kind === 'pipe-flange') {
    const outerDia = parsePositive(args.outerDiaStr);
    const boreDia = parsePositive(args.boreDiaStr);
    const boltCircleDia = parsePositive(args.boltCircleDiaStr);
    const boltCount = parsePosInt(args.boltCountStr);
    const boltHoleDia = parsePositive(args.boltHoleDiaStr);

    if (
      !Number.isFinite(outerDia) ||
      !Number.isFinite(boreDia) ||
      !Number.isFinite(boltCircleDia) ||
      !Number.isFinite(boltCount) ||
      !Number.isFinite(boltHoleDia)
    ) {
      return { valid: false as const, error: 'Flange diameters must be > 0 mm and bolt count must be an integer >= 1.' };
    }
    if (boltCount < 3 || boltCount > 24) {
      return { valid: false as const, error: 'Flange bolt count must be between 3 and 24.' };
    }
    if (boreDia + 4 >= boltCircleDia - boltHoleDia || boltCircleDia + boltHoleDia >= outerDia - 2) {
      return {
        valid: false as const,
        error: 'Geometric envelope violated: require Bore ID < BCD - Hole Dia and BCD + Hole Dia < Flange OD.',
      };
    }

    const generated = generateParametricPart({
      kind: 'pipe-flange',
      outerDia,
      boreDia,
      boltCircleDia,
      boltCount,
      boltHoleDia,
      thickness,
    });
    const stats = meshStats(generated.mesh);
    const stlBuffer = exportMeshToBinaryStl(generated.mesh);
    return {
      valid: true as const,
      kind,
      generated,
      stats,
      stlByteLength: stlBuffer.byteLength,
      triCount: Math.floor(generated.mesh.tris.length / 9),
      pitchDiaMm: boltCircleDia,
      extrusionMm: thickness,
    };
  }

  // l-bracket
  const legA = parsePositive(args.legAStr);
  const legB = parsePositive(args.legBStr);
  const width = parsePositive(args.widthStr);
  if (!Number.isFinite(legA) || !Number.isFinite(legB) || !Number.isFinite(width)) {
    return { valid: false as const, error: 'Bracket leg lengths, thickness, and width must be > 0 mm.' };
  }
  if (legA <= thickness + 5 || legB <= thickness + 5) {
    return { valid: false as const, error: 'Bracket Leg A and Leg B must each exceed wall thickness t by at least 5 mm.' };
  }
  const generated = generateParametricPart({
    kind: 'l-bracket',
    legA,
    legB,
    thickness,
    width,
  });
  const stats = meshStats(generated.mesh);
  const stlBuffer = exportMeshToBinaryStl(generated.mesh);
  return {
    valid: true as const,
    kind,
    generated,
    stats,
    stlByteLength: stlBuffer.byteLength,
    triCount: Math.floor(generated.mesh.tris.length / 9),
    pitchDiaMm: legA + legB,
    extrusionMm: width,
  };
}

export default function Parametric3dPartGeneratorClient() {
  const [kind, setKind] = useState<PartKind>('spur-gear');
  const [moduleStr, setModuleStr] = useState('2.5');
  const [teethStr, setTeethStr] = useState('24');
  const [pressureAngleStr, setPressureAngleStr] = useState('20');
  const [thicknessStr, setThicknessStr] = useState('14');
  const [boreDiaStr, setBoreDiaStr] = useState('18');
  const [outerDiaStr, setOuterDiaStr] = useState('165');
  const [boltCircleDiaStr, setBoltCircleDiaStr] = useState('125');
  const [boltCountStr, setBoltCountStr] = useState('8');
  const [boltHoleDiaStr, setBoltHoleDiaStr] = useState('14');
  const [legAStr, setLegAStr] = useState('90');
  const [legBStr, setLegBStr] = useState('65');
  const [widthStr, setWidthStr] = useState('50');
  const [yawStr, setYawStr] = useState('36');
  const [pitchStr, setPitchStr] = useState('30');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const evalRes = useMemo(
    () =>
      evaluateParametricGeometry({
        kind,
        moduleStr,
        teethStr,
        pressureAngleStr,
        thicknessStr,
        boreDiaStr,
        outerDiaStr,
        boltCircleDiaStr,
        boltCountStr,
        boltHoleDiaStr,
        legAStr,
        legBStr,
        widthStr,
      }),
    [
      kind,
      moduleStr,
      teethStr,
      pressureAngleStr,
      thicknessStr,
      boreDiaStr,
      outerDiaStr,
      boltCircleDiaStr,
      boltCountStr,
      boltHoleDiaStr,
      legAStr,
      legBStr,
      widthStr,
    ]
  );

  const applyGearDefault = () => {
    setKind('spur-gear');
    setModuleStr('2.5');
    setTeethStr('24');
    setPressureAngleStr('20');
    setThicknessStr('14');
    setBoreDiaStr('18');
  };

  const applyFlangePreset = () => {
    setKind('pipe-flange');
    setOuterDiaStr('165');
    setBoreDiaStr('65');
    setBoltCircleDiaStr('125');
    setBoltCountStr('8');
    setBoltHoleDiaStr('14');
    setThicknessStr('18');
  };

  const applyBracketPreset = () => {
    setKind('l-bracket');
    setLegAStr('90');
    setLegBStr('65');
    setThicknessStr('8');
    setWidthStr('50');
  };

  useEffect(() => {
    if (!evalRes.valid) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const { generated, stats } = evalRes;
    const t = generated.mesh.tris;
    const cx = (stats.bbox.min[0] + stats.bbox.max[0]) / 2;
    const cy = (stats.bbox.min[1] + stats.bbox.max[1]) / 2;
    const cz = (stats.bbox.min[2] + stats.bbox.max[2]) / 2;
    const span = Math.max(
      stats.bbox.max[0] - stats.bbox.min[0],
      stats.bbox.max[1] - stats.bbox.min[1],
      stats.bbox.max[2] - stats.bbox.min[2],
      1
    );
    const scale = (Math.min(w, h) * 0.68) / span;

    const yaw = Number.isFinite(parseRangeVal(yawStr)) ? parseRangeVal(yawStr) : 36;
    const pitch = Number.isFinite(parseRangeVal(pitchStr)) ? parseRangeVal(pitchStr) : 30;
    const yr = (yaw * Math.PI) / 180;
    const pr = (pitch * Math.PI) / 180;
    const cyaw = Math.cos(yr),
      syaw = Math.sin(yr);
    const cp = Math.cos(pr),
      sp = Math.sin(pr);

    const project = (x: number, y: number, z: number): [number, number, number] => {
      const dx = x - cx,
        dy = y - cy,
        dz = z - cz;
      const x1 = dx * cyaw - dy * syaw;
      const y1 = dx * syaw + dy * cyaw;
      const z2 = dz * cp - y1 * sp;
      const depth = dz * sp + y1 * cp;
      return [w / 2 + x1 * scale, h / 2 - z2 * scale, depth];
    };

    const faces: { pts: [number, number][]; depth: number; shade: number }[] = [];
    const numTris = Math.floor(t.length / 9);
    for (let f = 0; f < numTris; f++) {
      const o = f * 9;
      const p0 = project(t[o], t[o + 1], t[o + 2]);
      const p1 = project(t[o + 3], t[o + 4], t[o + 5]);
      const p2 = project(t[o + 6], t[o + 7], t[o + 8]);
      const depth = (p0[2] + p1[2] + p2[2]) / 3;
      const nx = generated.mesh.normals[f * 3] || 0;
      const ny = generated.mesh.normals[f * 3 + 1] || 0;
      const nz = generated.mesh.normals[f * 3 + 2] || 1;
      const shade = Math.max(0.32, Math.min(1, Math.abs(nx * 0.4 + ny * 0.35 + nz * 0.85)));
      faces.push({
        pts: [
          [p0[0], p0[1]],
          [p1[0], p1[1]],
          [p2[0], p2[1]],
        ],
        depth,
        shade,
      });
    }
    faces.sort((a, b) => a.depth - b.depth);

    for (const f of faces) {
      ctx.beginPath();
      ctx.moveTo(f.pts[0][0], f.pts[0][1]);
      ctx.lineTo(f.pts[1][0], f.pts[1][1]);
      ctx.lineTo(f.pts[2][0], f.pts[2][1]);
      ctx.closePath();
      ctx.fillStyle = `rgb(${Math.round(59 * f.shade)},${Math.round(130 * f.shade)},${Math.round(246 * f.shade)})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.22)';
      ctx.lineWidth = 0.45;
      ctx.stroke();
    }
  }, [evalRes, yawStr, pitchStr]);

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      `Parametric 3D Part Summary (${evalRes.kind})`,
      `Triangle Count: ${evalRes.triCount} | Binary STL Size: ${evalRes.stlByteLength} bytes`,
      ...evalRes.generated.specs.map((s) => `${s.label}: ${s.value}`),
    ].join('\n');
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!evalRes.valid) return;
    const lines = [
      'Property,Value',
      `PartKind,${evalRes.kind}`,
      `TriangleCount,${evalRes.triCount}`,
      `BinaryStlBytes,${evalRes.stlByteLength}`,
      ...evalRes.generated.specs.map((s) => `${toSafeAscii(s.label).replace(/,/g, ';')},${toSafeAscii(s.value).replace(/,/g, ';')}`),
    ];
    downloadData(lines.join('\r\n'), `parametric_${evalRes.kind}_specs.csv`, 'text/csv;charset=utf-8');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-gear"
          onClick={applyGearDefault}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: Spur Gear (m=2.5, z=24, b=14, bore=18)
        </button>
        <button
          type="button"
          data-testid="preset-flange"
          onClick={applyFlangePreset}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Pipe Flange (OD=165, ID=65, BCD=125, 8x14)
        </button>
        <button
          type="button"
          data-testid="preset-bracket"
          onClick={applyBracketPreset}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 3: L-Bracket (90x65x8 mm, W=50 mm)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Part Family</label>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={applyGearDefault}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              data-testid="kind-spur-gear"
              onClick={() => setKind('spur-gear')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black border ${
                kind === 'spur-gear' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
              }`}
            >
              Spur Gear
            </button>
            <button
              type="button"
              data-testid="kind-pipe-flange"
              onClick={() => setKind('pipe-flange')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black border ${
                kind === 'pipe-flange' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
              }`}
            >
              Pipe Flange
            </button>
            <button
              type="button"
              data-testid="kind-l-bracket"
              onClick={() => setKind('l-bracket')}
              className={`py-2.5 px-2 rounded-xl text-xs font-black border ${
                kind === 'l-bracket' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
              }`}
            >
              L-Bracket
            </button>
          </div>

          {kind === 'spur-gear' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Module m (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-module" value={moduleStr} onChange={(e) => setModuleStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Teeth z</label>
                  <input type="text" inputMode="numeric" data-testid="input-teeth" value={teethStr} onChange={(e) => setTeethStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Pressure Angle (deg)</label>
                <select value={pressureAngleStr} onChange={(e) => setPressureAngleStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold">
                  <option value="20">20 deg (Standard Involute)</option>
                  <option value="14.5">14.5 deg (Legacy Profile)</option>
                  <option value="25">25 deg (Heavy Duty Profile)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Face Width (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-thickness" value={thicknessStr} onChange={(e) => setThicknessStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Shaft Bore Dia (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-bore" value={boreDiaStr} onChange={(e) => setBoreDiaStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
              </div>
            </div>
          )}

          {kind === 'pipe-flange' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Outer OD (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-outer-dia" value={outerDiaStr} onChange={(e) => setOuterDiaStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Inner Bore ID (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-bore" value={boreDiaStr} onChange={(e) => setBoreDiaStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">BCD (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-bcd" value={boltCircleDiaStr} onChange={(e) => setBoltCircleDiaStr(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Bolts</label>
                  <input type="text" inputMode="numeric" data-testid="input-bolt-count" value={boltCountStr} onChange={(e) => setBoltCountStr(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Hole Dia</label>
                  <input type="text" inputMode="decimal" data-testid="input-bolt-hole" value={boltHoleDiaStr} onChange={(e) => setBoltHoleDiaStr(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Flange Thickness (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-thickness" value={thicknessStr} onChange={(e) => setThicknessStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
              </div>
            </div>
          )}

          {kind === 'l-bracket' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Leg A (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-leg-a" value={legAStr} onChange={(e) => setLegAStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Leg B (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-leg-b" value={legBStr} onChange={(e) => setLegBStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Thickness t (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-thickness" value={thicknessStr} onChange={(e) => setThicknessStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Width W (mm)</label>
                  <input type="text" inputMode="decimal" data-testid="input-width" value={widthStr} onChange={(e) => setWidthStr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              type="button"
              data-testid="btn-download-stl"
              disabled={!evalRes.valid}
              onClick={() =>
                evalRes.valid &&
                downloadData(exportMeshToBinaryStl(evalRes.generated.mesh), `parametric-${evalRes.kind}.stl`, 'application/octet-stream')
              }
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Binary .STL</span>
            </button>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                data-testid="btn-download-step"
                disabled={!evalRes.valid}
                onClick={() =>
                  evalRes.valid &&
                  downloadData(
                    exportPolygonToStepAp214(evalRes.generated.outerRing, evalRes.extrusionMm, evalRes.kind.toUpperCase()),
                    `parametric-${evalRes.kind}.step`
                  )
                }
                className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-black disabled:opacity-50"
              >
                .STEP AP214
              </button>
              <button
                type="button"
                data-testid="btn-download-obj"
                disabled={!evalRes.valid}
                onClick={() =>
                  evalRes.valid && downloadData(exportMeshToObj(evalRes.generated.mesh), `parametric-${evalRes.kind}.obj`)
                }
                className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black disabled:opacity-50"
              >
                .OBJ Mesh
              </button>
              <button
                type="button"
                data-testid="btn-download-dxf"
                disabled={!evalRes.valid}
                onClick={() =>
                  evalRes.valid &&
                  downloadData(exportPolygonToDxf(evalRes.generated.outerRing, evalRes.generated.holes), `parametric-${evalRes.kind}-2d.dxf`)
                }
                className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black disabled:opacity-50"
              >
                2D .DXF
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!evalRes.valid}
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Specs'}
              </button>
              <button
                type="button"
                data-testid="btn-download-csv"
                disabled={!evalRes.valid}
                onClick={handleDownloadCsv}
                className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!evalRes.valid ? (
            <div data-testid="validation-error" className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{evalRes.error}</span>
            </div>
          ) : (
            <>
              <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 border-b border-slate-800 pb-3">
                  <span className="font-bold">Live 3D Parametric Solid Viewport</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5">
                      <span>Yaw</span>
                      <input type="range" min="-180" max="180" value={yawStr} onChange={(e) => setYawStr(e.target.value)} className="w-24" />
                    </label>
                    <label className="flex items-center gap-1.5">
                      <span>Pitch</span>
                      <input type="range" min="-85" max="85" value={pitchStr} onChange={(e) => setPitchStr(e.target.value)} className="w-24" />
                    </label>
                  </div>
                </div>
                <canvas ref={canvasRef} width={640} height={340} className="w-full h-80 rounded-2xl" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="text-[11px] font-black text-blue-500 uppercase">Mesh Triangles</div>
                  <div data-testid="out-tris" className="text-lg font-black text-blue-900 mt-0.5">{evalRes.triCount}</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="text-[11px] font-black text-emerald-600 uppercase">Binary STL Size</div>
                  <div className="text-lg font-black text-emerald-900 mt-0.5">
                    <span data-testid="out-stl-bytes">{evalRes.stlByteLength}</span> B
                  </div>
                </div>
                {evalRes.generated.specs.map((sp, i) => (
                  <div key={sp.label} className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="text-[11px] font-black text-slate-400 uppercase">{sp.label}</div>
                    <div data-testid={`out-spec-${i}`} className="text-lg font-black text-slate-900 mt-0.5">{sp.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-black text-slate-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Open Export Format Specifications (Wikipedia):</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href="https://en.wikipedia.org/wiki/ISO_10303-21" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    ISO 10303-21 (STEP) <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://en.wikipedia.org/wiki/STL_(file_format)" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    Binary STL <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    Wavefront OBJ <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://en.wikipedia.org/wiki/AutoCAD_DXF" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    AutoCAD DXF <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          )}

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
