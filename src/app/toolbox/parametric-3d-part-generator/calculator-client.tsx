'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Download, Box, Sliders, Sparkles } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { meshStats } from '@/lib/cad-file-analysis';
import {
  generateParametricPart,
  exportMeshToBinaryStl,
  exportMeshToObj,
  exportPolygonToDxf,
  exportPolygonToStepAp214,
} from '@/lib/open-source-cad-engines';

function downloadData(content: string | ArrayBuffer, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Parametric3dPartGeneratorClient() {
  const [kind, setKind] = useState<'spur-gear' | 'pipe-flange' | 'l-bracket'>('spur-gear');
  const [moduleVal, setModuleVal] = useState<number>(2.5);
  const [teeth, setTeeth] = useState<number>(24);
  const [pressureAngle, setPressureAngle] = useState<number>(20);
  const [thickness, setThickness] = useState<number>(14);
  const [boreDia, setBoreDia] = useState<number>(18);
  const [outerDia, setOuterDia] = useState<number>(165);
  const [boltCircleDia, setBoltCircleDia] = useState<number>(125);
  const [boltCount, setBoltCount] = useState<number>(8);
  const [boltHoleDia, setBoltHoleDia] = useState<number>(14);
  const [legA, setLegA] = useState<number>(90);
  const [legB, setLegB] = useState<number>(65);
  const [width, setWidth] = useState<number>(50);

  const [yaw, setYaw] = useState<number>(36);
  const [pitch, setPitch] = useState<number>(30);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generated = useMemo(
    () =>
      generateParametricPart({
        kind,
        module: moduleVal,
        teeth,
        pressureAngle,
        thickness,
        boreDia,
        outerDia,
        boltCircleDia,
        boltCount,
        boltHoleDia,
        legA,
        legB,
        width,
      }),
    [
      kind,
      moduleVal,
      teeth,
      pressureAngle,
      thickness,
      boreDia,
      outerDia,
      boltCircleDia,
      boltCount,
      boltHoleDia,
      legA,
      legB,
      width,
    ]
  );

  const stats = useMemo(() => meshStats(generated.mesh), [generated.mesh]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

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

    const yr = (yaw * Math.PI) / 180;
    const pr = (pitch * Math.PI) / 180;
    const cyaw = Math.cos(yr), syaw = Math.sin(yr);
    const cp = Math.cos(pr), sp = Math.sin(pr);

    const project = (x: number, y: number, z: number): [number, number, number] => {
      const dx = x - cx, dy = y - cy, dz = z - cz;
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
      faces.push({ pts: [[p0[0], p0[1]], [p1[0], p1[1]], [p2[0], p2[1]]], depth, shade });
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
  }, [generated, stats, yaw, pitch]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Parametric Feature Tree Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Select Mechanical Part Family
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setKind('spur-gear')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black border ${
                  kind === 'spur-gear' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                Spur Gear
              </button>
              <button
                type="button"
                onClick={() => setKind('pipe-flange')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black border ${
                  kind === 'pipe-flange' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                Pipe Flange
              </button>
              <button
                type="button"
                onClick={() => setKind('l-bracket')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black border ${
                  kind === 'l-bracket' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                L-Bracket
              </button>
            </div>
          </div>

          {kind === 'spur-gear' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Module m (mm): {moduleVal}</label>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.25"
                  value={moduleVal}
                  onChange={(e) => setModuleVal(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Number of Teeth (z): {teeth}</label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  step="1"
                  value={teeth}
                  onChange={(e) => setTeeth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Pressure Angle α (°): {pressureAngle}°</label>
                <select
                  value={pressureAngle}
                  onChange={(e) => setPressureAngle(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  <option value={20}>20° (ISO 53 / AGMA Standard)</option>
                  <option value={14.5}>14.5° (Legacy Machinery)</option>
                  <option value={25}>25° (High Torque Heavy Duty)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Face Width (mm)</label>
                  <input
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Shaft Bore Ø (mm)</label>
                  <input
                    type="number"
                    value={boreDia}
                    onChange={(e) => setBoreDia(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {kind === 'pipe-flange' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Outer OD (mm)</label>
                  <input
                    type="number"
                    value={outerDia}
                    onChange={(e) => setOuterDia(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Inner Bore ID (mm)</label>
                  <input
                    type="number"
                    value={boreDia}
                    onChange={(e) => setBoreDia(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">BCD (mm)</label>
                  <input
                    type="number"
                    value={boltCircleDia}
                    onChange={(e) => setBoltCircleDia(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Bolts</label>
                  <input
                    type="number"
                    value={boltCount}
                    onChange={(e) => setBoltCount(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Hole Ø</label>
                  <input
                    type="number"
                    value={boltHoleDia}
                    onChange={(e) => setBoltHoleDia(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {kind === 'l-bracket' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Leg A (mm)</label>
                  <input
                    type="number"
                    value={legA}
                    onChange={(e) => setLegA(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Leg B (mm)</label>
                  <input
                    type="number"
                    value={legB}
                    onChange={(e) => setLegB(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Thickness t (mm)</label>
                  <input
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Extrusion Width (mm)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() =>
                downloadData(
                  exportMeshToBinaryStl(generated.mesh),
                  `parametric-${kind}.stl`,
                  'application/octet-stream'
                )
              }
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Watertight 3D .STL</span>
            </button>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  downloadData(
                    exportPolygonToStepAp214(generated.outerRing, kind === 'l-bracket' ? width : thickness, kind.toUpperCase()),
                    `parametric-${kind}.step`
                  )
                }
                className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-black"
              >
                .STEP AP214
              </button>
              <button
                type="button"
                onClick={() => downloadData(exportMeshToObj(generated.mesh), `parametric-${kind}.obj`)}
                className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black"
              >
                .OBJ Mesh
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadData(exportPolygonToDxf(generated.outerRing, generated.holes), `parametric-${kind}-2d.dxf`)
                }
                className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black"
              >
                2D .DXF Cut
              </button>
            </div>
          </div>
        </div>

        {/* Right 3D Viewport & Metrology Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 border-b border-slate-800 pb-3">
              <span className="font-bold">Live 3D Parametric Solid Viewport</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5">
                  <span>Yaw</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={yaw}
                    onChange={(e) => setYaw(Number(e.target.value))}
                    className="w-24"
                  />
                </label>
                <label className="flex items-center gap-1.5">
                  <span>Pitch</span>
                  <input
                    type="range"
                    min="-85"
                    max="85"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-24"
                  />
                </label>
              </div>
            </div>
            <canvas ref={canvasRef} width={640} height={340} className="w-full h-80 rounded-2xl" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {generated.specs.map((sp) => (
              <div key={sp.label} className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">{sp.label}</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{sp.value}</div>
              </div>
            ))}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
