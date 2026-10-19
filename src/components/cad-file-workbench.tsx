'use client';

// Real in-browser file workbench for validator / viewer / local-converter toolbox pages.
// Files are read with FileReader/File.arrayBuffer and never uploaded.

import React, { useMemo, useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, XCircle, Info, Download, FileCheck2 } from 'lucide-react';
import {
  VALIDATOR_SPECS, runValidator, parseDxf, segmentsOf, parseStl, parseObj, meshStats, parseGcode,
  sliceMesh, optimizeSvg, sanitizeSvg, parseStepIgesMeta, isBinaryDxf,
  type ValidationReport, type Mesh, type DxfDoc, type Seg,
} from '@/lib/cad-file-analysis';

type Mode =
  | 'validator' | 'dxf-view' | 'dxf-layers' | 'mesh-view' | 'gcode-view' | 'slice-view'
  | 'svg-view' | 'step-meta' | 'svg-raster' | 'svg-pdf' | 'dxf-info';

const MODE_BY_SLUG: Record<string, { mode: Mode; accept: string; hint: string }> = {
  'dxf-2d-viewer': { mode: 'dxf-view', accept: '.dxf', hint: 'ASCII DXF — LINE, ARC, CIRCLE, (LW)POLYLINE, SPLINE control polygon' },
  'dxf-layer-browser': { mode: 'dxf-layers', accept: '.dxf', hint: 'ASCII DXF' },
  'stl-3d-mesh-viewer': { mode: 'mesh-view', accept: '.stl', hint: 'ASCII or Binary STL' },
  'obj-3d-model-viewer': { mode: 'mesh-view', accept: '.obj', hint: 'Wavefront OBJ (geometry only)' },
  'gcode-toolpath-visualizer': { mode: 'gcode-view', accept: '.nc,.gcode,.ngc,.tap,.txt,.cnc', hint: 'G-code (G0/G1/G2/G3, G90/G91, XY plane)' },
  '3d-print-slice-previewer': { mode: 'slice-view', accept: '.stl,.obj', hint: 'STL or OBJ mesh' },
  'svg-viewer-optimizer': { mode: 'svg-view', accept: '.svg', hint: 'SVG file' },
  'step-iges-metadata-viewer': { mode: 'step-meta', accept: '.step,.stp,.iges,.igs', hint: 'STEP (ISO 10303-21) or IGES' },
  'svg-to-jpg-png-converter': { mode: 'svg-raster', accept: '.svg', hint: 'SVG file' },
  'svg-to-pdf-converter': { mode: 'svg-pdf', accept: '.svg', hint: 'SVG file' },
  'dxf-info-extractor': { mode: 'dxf-info', accept: '.dxf', hint: 'ASCII DXF' },
};

export function workbenchSupports(slug: string): boolean {
  return !!VALIDATOR_SPECS[slug] || !!MODE_BY_SLUG[slug];
}

const STATUS_STYLE: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
  pass: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" />, label: 'PASS' },
  warn: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <AlertTriangle className="w-4 h-4" />, label: 'WARN' },
  fail: { cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="w-4 h-4" />, label: 'FAIL' },
  info: { cls: 'bg-slate-50 text-slate-600 border-slate-200', icon: <Info className="w-4 h-4" />, label: 'INFO' },
};

function download(data: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function StatsGrid({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</div>
          <div className="text-sm font-bold text-slate-800 break-words">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function ReportView({ report }: { report: ValidationReport }) {
  const counts = report.checks.reduce<Record<string, number>>((a, ch) => ({ ...a, [ch.status]: (a[ch.status] || 0) + 1 }), {});
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className="px-3 py-1 rounded-full bg-slate-900 text-white">{report.format}</span>
        {(['fail', 'warn', 'pass', 'info'] as const).map((k) => counts[k] ? (
          <span key={k} className={`px-3 py-1 rounded-full border ${STATUS_STYLE[k].cls}`}>{counts[k]} {STATUS_STYLE[k].label}</span>
        ) : null)}
      </div>
      <ul className="space-y-2">
        {report.checks.map((ch, i) => (
          <li key={i} className={`flex gap-3 items-start border rounded-xl p-3 ${STATUS_STYLE[ch.status].cls}`}>
            <span className="mt-0.5 shrink-0">{STATUS_STYLE[ch.status].icon}</span>
            <div>
              <div className="text-sm font-black">{ch.name}</div>
              <div className="text-xs leading-relaxed text-slate-700">{ch.detail}</div>
            </div>
          </li>
        ))}
      </ul>
      {report.stats.length > 0 && <StatsGrid stats={report.stats} />}
    </div>
  );
}

function arcPath(s: Seg): string {
  const { cx = 0, cy = 0, r = 0 } = s;
  let a1 = s.a1 ?? 0, a2 = s.a2 ?? 0;
  while (a2 <= a1) a2 += Math.PI * 2;
  const sweep = a2 - a1;
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const p2 = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
  return `M${p1[0]} ${p1[1]}A${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${p2[0]} ${p2[1]}`;
}

function DxfSvg({ segs }: { segs: Seg[] }) {
  const shown = segs.slice(0, 60000);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of shown) {
    if (s.kind === 'arc' && s.r !== undefined && s.cx !== undefined && s.cy !== undefined) {
      minX = Math.min(minX, s.cx - s.r); maxX = Math.max(maxX, s.cx + s.r); minY = Math.min(minY, s.cy - s.r); maxY = Math.max(maxY, s.cy + s.r);
    } else {
      minX = Math.min(minX, s.x1, s.x2); maxX = Math.max(maxX, s.x1, s.x2); minY = Math.min(minY, s.y1, s.y2); maxY = Math.max(maxY, s.y1, s.y2);
    }
  }
  if (!Number.isFinite(minX)) return <p className="text-sm text-slate-500">No drawable model-space geometry found.</p>;
  const w = maxX - minX || 1, h = maxY - minY || 1, pad = Math.max(w, h) * 0.03;
  return (
    <svg viewBox={`${minX - pad} ${-(maxY + pad)} ${w + 2 * pad} ${h + 2 * pad}`} className="w-full h-[480px] bg-slate-950 rounded-2xl">
      <g transform="scale(1,-1)" fill="none" stroke="#7dd3fc" strokeWidth={1} vectorEffect="non-scaling-stroke">
        {shown.map((s, i) => s.kind === 'line'
          ? <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} vectorEffect="non-scaling-stroke" />
          : Math.abs((s.a2 ?? 0) - (s.a1 ?? 0) - Math.PI * 2) < 1e-9
            ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r} vectorEffect="non-scaling-stroke" />
            : <path key={i} d={arcPath(s)} vectorEffect="non-scaling-stroke" />)}
      </g>
    </svg>
  );
}

function MeshSvg({ mesh, yaw, pitch }: { mesh: Mesh; yaw: number; pitch: number }) {
  const polys = useMemo(() => {
    const t = mesh.tris;
    const n = t.length / 9;
    const step = Math.max(1, Math.ceil(n / 25000));
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < t.length; i += 3) { cx += t[i]; cy += t[i + 1]; cz += t[i + 2]; }
    const vc = t.length / 3; cx /= vc; cy /= vc; cz /= vc;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const proj = (x: number, y: number, z: number) => {
      x -= cx; y -= cy; z -= cz;
      const x1 = x * cyw - y * syw, y1 = x * syw + y * cyw;
      const y2 = y1 * cp - z * sp, z2 = y1 * sp + z * cp;
      return [x1, -z2, y2];
    };
    const out: { pts: string; depth: number; shade: number }[] = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let f = 0; f < n; f += step) {
      const o = f * 9;
      const a = proj(t[o], t[o + 1], t[o + 2]), b = proj(t[o + 3], t[o + 4], t[o + 5]), c = proj(t[o + 6], t[o + 7], t[o + 8]);
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz) || 1;
      const shade = Math.abs((nx * 0.3 + ny * -0.5 + nz * -0.8) / len);
      for (const p of [a, b, c]) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
      out.push({ pts: `${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`, depth: (a[2] + b[2] + c[2]) / 3, shade });
    }
    out.sort((p, q) => q.depth - p.depth);
    return { out, box: [minX, minY, maxX - minX || 1, maxY - minY || 1], sampled: step > 1 };
  }, [mesh, yaw, pitch]);
  const [x, y, w, h] = polys.box;
  const pad = Math.max(w, h) * 0.05;
  return (
    <div>
      <svg viewBox={`${x - pad} ${y - pad} ${w + 2 * pad} ${h + 2 * pad}`} className="w-full h-[480px] bg-slate-950 rounded-2xl">
        {polys.out.map((p, i) => {
          const l = Math.round(35 + p.shade * 50);
          return <polygon key={i} points={p.pts} fill={`hsl(205 70% ${l}%)`} stroke={`hsl(205 70% ${l}%)`} strokeWidth={0.5} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {polys.sampled && <p className="text-[11px] text-slate-500 mt-1">Large mesh: preview draws a uniform sample of ~25,000 triangles. Statistics use every triangle.</p>}
    </div>
  );
}

function buildJpegPdf(jpeg: Uint8Array, imgW: number, imgH: number, pageW: number, pageH: number): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let len = 0;
  const push = (d: Uint8Array | string) => { const b = typeof d === 'string' ? enc.encode(d) : d; chunks.push(b); len += b.length; };
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  const obj = (n: number, body: string) => { offsets[n] = len; push(`${n} 0 obj\n${body}\nendobj\n`); };
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
  const content = `q ${pageW.toFixed(2)} 0 0 ${pageH.toFixed(2)} 0 0 cm /Im0 Do Q`;
  obj(4, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  offsets[5] = len;
  push(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  push(jpeg);
  push('\nendstream\nendobj\n');
  const xref = len;
  let x = 'xref\n0 6\n0000000000 65535 f \n';
  for (let n = 1; n <= 5; n++) x += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`;
  push(`${x}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const out = new Uint8Array(len);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}

function svgSize(svg: string): { w: number; h: number } {
  const tag = svg.match(/<svg[^>]*>/i)?.[0] || '';
  const num = (attr: string) => { const m = tag.match(new RegExp(`\\s${attr}="([\\d.]+)(px|pt|mm|in)?"`)); if (!m) return 0; const v = Number(m[1]); return m[2] === 'mm' ? v * 3.7795 : m[2] === 'in' ? v * 96 : m[2] === 'pt' ? v * 1.3333 : v; };
  let w = num('width'), h = num('height');
  const vb = tag.match(/viewBox="([^"]+)"/i)?.[1].split(/[\s,]+/).map(Number);
  if ((!w || !h) && vb && vb.length === 4) { w = w || vb[2]; h = h || vb[3]; }
  return { w: w || 800, h: h || 600 };
}

async function rasterizeSvg(svg: string, scale: number, type: 'image/png' | 'image/jpeg'): Promise<{ blob: Blob; w: number; h: number }> {
  const { w, h } = svgSize(svg);
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('SVG could not be rendered by the browser.')); img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d')!;
    if (type === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Canvas export failed.'))), type, 0.92));
    return { blob, w: canvas.width, h: canvas.height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function CadFileWorkbench({ slug, title }: { slug: string; title: string }) {
  const vspec = VALIDATOR_SPECS[slug];
  const mspec = MODE_BY_SLUG[slug];
  const mode: Mode = vspec ? 'validator' : mspec.mode;
  const accept = vspec ? vspec.accept : mspec.accept;
  const hint = vspec ? vspec.hint : mspec.hint;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [toolDia, setToolDia] = useState(6);
  const [yaw, setYaw] = useState(35);
  const [pitch, setPitch] = useState(30);
  const [sliceT, setSliceT] = useState(50);
  const [rasterScale, setRasterScale] = useState(2);
  const [rasterType, setRasterType] = useState<'image/png' | 'image/jpeg'>('image/png');

  const text = useMemo(() => (buffer ? new TextDecoder().decode(new Uint8Array(buffer)) : ''), [buffer]);

  const report = useMemo<ValidationReport | null>(() => {
    if (mode !== 'validator' || !buffer) return null;
    try { return runValidator(slug, buffer, fileName, { minToolDia: toolDia }); }
    catch (e) { return { format: 'Error', supported: false, checks: [{ name: 'Parser', status: 'fail', detail: (e as Error).message }], stats: [] }; }
  }, [mode, buffer, slug, fileName, toolDia]);

  const dxf = useMemo<DxfDoc | null>(() => {
    if (!buffer || !['dxf-view', 'dxf-layers', 'dxf-info'].includes(mode)) return null;
    if (isBinaryDxf(new Uint8Array(buffer.slice(0, 32)))) return null;
    return parseDxf(text);
  }, [buffer, mode, text]);

  const mesh = useMemo<Mesh | null>(() => {
    if (!buffer || !['mesh-view', 'slice-view'].includes(mode)) return null;
    return fileName.toLowerCase().endsWith('.obj') ? parseObj(text) : parseStl(buffer);
  }, [buffer, mode, fileName, text]);

  const meshInfo = useMemo(() => (mesh ? meshStats(mesh) : null), [mesh]);
  const gcode = useMemo(() => (mode === 'gcode-view' && text ? parseGcode(text) : null), [mode, text]);
  const stepMeta = useMemo(() => (mode === 'step-meta' && text ? parseStepIgesMeta(text) : null), [mode, text]);
  const svgText = useMemo(() => (['svg-view', 'svg-raster', 'svg-pdf'].includes(mode) && text && /<svg[\s>]/i.test(text) ? sanitizeSvg(text) : ''), [mode, text]);
  const svgOptimized = useMemo(() => (mode === 'svg-view' && svgText ? optimizeSvg(svgText) : ''), [mode, svgText]);
  const svgPreviewUrl = useMemo(() => (svgText ? URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' })) : ''), [svgText]);

  const loadFile = async (f: File) => {
    setError(''); setBusy(true); setFileName(f.name);
    try {
      if (f.size > 150 * 1024 * 1024) throw new Error('File exceeds the 150 MB in-browser limit.');
      setBuffer(await f.arrayBuffer());
    } catch (e) {
      setError((e as Error).message); setBuffer(null);
    } finally { setBusy(false); }
  };

  const parseError = (() => {
    if (!buffer) return '';
    if (['dxf-view', 'dxf-layers', 'dxf-info'].includes(mode) && !dxf) {
      const head = new TextDecoder().decode(new Uint8Array(buffer.slice(0, 8)));
      return head.startsWith('AC10') ? 'This is a binary DWG file. Browsers cannot parse DWG — save it as ASCII DXF and load that.' : 'Not a readable ASCII DXF file.';
    }
    if (['mesh-view', 'slice-view'].includes(mode) && !mesh) return 'Mesh could not be parsed (expected ASCII/Binary STL or OBJ with v/f records).';
    if (mode === 'step-meta' && !stepMeta) return 'Not a STEP (ISO-10303-21) or fixed-format IGES file.';
    if (['svg-view', 'svg-raster', 'svg-pdf'].includes(mode) && !svgText) return 'No <svg> root element found.';
    if (mode === 'gcode-view' && gcode && gcode.moves.length === 0) return 'No G0/G1/G2/G3 motion with X/Y coordinates was found.';
    return '';
  })();

  const layerRows = useMemo(() => {
    if (!dxf) return [];
    const counts = new Map<string, number>();
    for (const e of dxf.entities) counts.set(e.layer, (counts.get(e.layer) || 0) + 1);
    const names = new Set([...dxf.layers.map((l) => l.name), ...counts.keys()]);
    return Array.from(names).map((n) => {
      const l = dxf.layers.find((x) => x.name === n);
      return { name: n, color: l?.color ?? 7, linetype: l?.linetype ?? '—', count: counts.get(n) || 0, off: (l?.color ?? 1) < 0 };
    }).sort((a, b) => b.count - a.count);
  }, [dxf]);

  const sliceData = useMemo(() => {
    if (mode !== 'slice-view' || !mesh || !meshInfo) return null;
    const z0 = meshInfo.bbox.min[2], z1 = meshInfo.bbox.max[2];
    const h = z0 + ((z1 - z0) * sliceT) / 100;
    return { h, segs: sliceMesh(mesh, h) };
  }, [mode, mesh, meshInfo, sliceT]);

  const exportRaster = async () => {
    try {
      const { blob } = await rasterizeSvg(svgText, rasterScale, rasterType);
      download(blob, fileName.replace(/\.svg$/i, '') + (rasterType === 'image/png' ? '.png' : '.jpg'), rasterType);
    } catch (e) { setError((e as Error).message); }
  };
  const exportPdf = async () => {
    try {
      const { w, h } = svgSize(svgText);
      const { blob, w: iw, h: ih } = await rasterizeSvg(svgText, rasterScale, 'image/jpeg');
      const pdf = buildJpegPdf(new Uint8Array(await blob.arrayBuffer()), iw, ih, w * 0.75, h * 0.75);
      download(pdf as unknown as BlobPart, fileName.replace(/\.svg$/i, '') + '.pdf', 'application/pdf');
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 font-medium">Accepted input: {hint}. The file is processed in your browser and is not uploaded.</p>
        </div>
      </div>

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.[0]) loadFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${buffer ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-slate-50/60 hover:border-blue-300'}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-blue-600 mb-3">
          {buffer ? <FileCheck2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
        </div>
        <p className="text-sm font-bold text-slate-900">{busy ? 'Reading file…' : fileName ? `${fileName} — click to choose another file` : 'Click to browse or drop a file here'}</p>
        <p className="text-xs text-slate-400">{accept.replace(/,/g, ' ')}</p>
      </div>

      {slug === 'cnc-machinability-checker' && (
        <label className="flex items-center gap-3 text-xs font-bold text-slate-700">
          Smallest available cutter Ø (mm)
          <input type="number" min={0.1} step={0.1} value={toolDia} onChange={(e) => setToolDia(Number(e.target.value) || 6)} className="w-24 px-2 py-1 border border-slate-200 rounded-lg" />
        </label>
      )}

      {(error || parseError) && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">{error || parseError}</div>}

      {report && <ReportView report={report} />}

      {mode === 'dxf-view' && dxf && (
        <div className="space-y-3">
          <DxfSvg segs={segmentsOf(dxf)} />
          <p className="text-[11px] text-slate-500">Model-space geometry only. TEXT, HATCH, DIMENSION and block INSERTs are not drawn; splines are shown as their control polygon.</p>
        </div>
      )}

      {(mode === 'dxf-layers' || mode === 'dxf-info') && dxf && (
        <div className="space-y-4">
          {mode === 'dxf-info' && (
            <>
              <StatsGrid stats={[
                { label: 'DXF version', value: dxf.header['$ACADVER']?.[0] || '—' },
                { label: 'Units ($INSUNITS)', value: dxf.header['$INSUNITS']?.[0] || '—' },
                { label: 'Entities', value: String(dxf.entities.length) },
                { label: 'Layers', value: String(layerRows.length) },
                { label: 'Extents min', value: dxf.header['$EXTMIN']?.slice(0, 2).map((v) => Number(v).toFixed(3)).join(', ') || '—' },
                { label: 'Extents max', value: dxf.header['$EXTMAX']?.slice(0, 2).map((v) => Number(v).toFixed(3)).join(', ') || '—' },
              ]} />
              <button
                onClick={() => {
                  const counts: Record<string, number> = {};
                  dxf.entities.forEach((e) => { counts[e.type] = (counts[e.type] || 0) + 1; });
                  download(JSON.stringify({ file: fileName, header: dxf.header, layers: layerRows, entityCounts: counts }, null, 2), fileName.replace(/\.dxf$/i, '') + '-info.json', 'application/json');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              ><Download className="w-4 h-4" /> Download JSON summary</button>
            </>
          )}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-black text-slate-700"><tr><th className="p-3">Layer</th><th className="p-3">ACI colour</th><th className="p-3">Linetype</th><th className="p-3">State</th><th className="p-3">Entities</th></tr></thead>
              <tbody>
                {layerRows.map((r) => (
                  <tr key={r.name} className="border-t border-slate-100"><td className="p-3 font-bold">{r.name}</td><td className="p-3">{Math.abs(r.color)}</td><td className="p-3">{r.linetype}</td><td className="p-3">{r.off ? 'Off' : 'On'}</td><td className="p-3">{r.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === 'mesh-view' && mesh && meshInfo && (
        <div className="space-y-4">
          <MeshSvg mesh={mesh} yaw={(yaw * Math.PI) / 180} pitch={(pitch * Math.PI) / 180} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
            <label>Rotate (yaw) {yaw}°<input type="range" min={-180} max={180} value={yaw} onChange={(e) => setYaw(Number(e.target.value))} className="w-full" /></label>
            <label>Tilt (pitch) {pitch}°<input type="range" min={-90} max={90} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full" /></label>
          </div>
          <StatsGrid stats={[
            { label: 'Format', value: mesh.format },
            { label: 'Triangles', value: meshInfo.triangles.toLocaleString() },
            { label: 'Bounding box', value: [0, 1, 2].map((k) => (meshInfo.bbox.max[k] - meshInfo.bbox.min[k]).toFixed(2)).join(' × ') },
            { label: 'Watertight', value: meshInfo.boundaryEdges === 0 && meshInfo.nonManifoldEdges === 0 ? 'Yes' : `No (${meshInfo.boundaryEdges} open, ${meshInfo.nonManifoldEdges} non-manifold edges)` },
            { label: 'Surface area', value: meshInfo.area.toFixed(2) },
            { label: 'Volume', value: meshInfo.boundaryEdges === 0 ? Math.abs(meshInfo.volume).toFixed(2) : 'n/a' },
          ]} />
        </div>
      )}

      {mode === 'slice-view' && sliceData && meshInfo && (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700">Slice height Z = {sliceData.h.toFixed(3)} ({sliceT}% of part height)
            <input type="range" min={0} max={100} step={0.5} value={sliceT} onChange={(e) => setSliceT(Number(e.target.value))} className="w-full" />
          </label>
          {(() => {
            const b = meshInfo.bbox; const w = b.max[0] - b.min[0] || 1, h = b.max[1] - b.min[1] || 1, pad = Math.max(w, h) * 0.05;
            return (
              <svg viewBox={`${b.min[0] - pad} ${-(b.max[1] + pad)} ${w + 2 * pad} ${h + 2 * pad}`} className="w-full h-[420px] bg-slate-950 rounded-2xl">
                <g transform="scale(1,-1)" stroke="#fbbf24" strokeWidth={1.5} fill="none">
                  {sliceData.segs.map((s, i) => <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} vectorEffect="non-scaling-stroke" />)}
                </g>
              </svg>
            );
          })()}
          <p className="text-[11px] text-slate-500">{sliceData.segs.length} contour segments at this layer. This is a geometric cross-section, not slicer G-code (no perimeters, infill or supports are generated).</p>
        </div>
      )}

      {mode === 'gcode-view' && gcode && gcode.moves.length > 0 && (() => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        gcode.moves.forEach((m) => { minX = Math.min(minX, m.x1, m.x2); maxX = Math.max(maxX, m.x1, m.x2); minY = Math.min(minY, m.y1, m.y2); maxY = Math.max(maxY, m.y1, m.y2); });
        const w = maxX - minX || 1, h = maxY - minY || 1, pad = Math.max(w, h) * 0.05;
        return (
          <div className="space-y-4">
            <svg viewBox={`${minX - pad} ${-(maxY + pad)} ${w + 2 * pad} ${h + 2 * pad}`} className="w-full h-[480px] bg-slate-950 rounded-2xl">
              <g transform="scale(1,-1)" fill="none">
                {gcode.moves.slice(0, 80000).map((m, i) => (
                  <line key={i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke={m.rapid ? '#f87171' : '#4ade80'} strokeDasharray={m.rapid ? '4 3' : undefined} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            </svg>
            <p className="text-[11px] text-slate-500">Top (XY) view. Green = feed moves (G1/G2/G3), red dashed = rapids (G0). Arcs are interpolated in 5° steps.</p>
            <StatsGrid stats={gcode.stats} />
          </div>
        );
      })()}

      {mode === 'step-meta' && stepMeta && (
        <div className="space-y-4">
          <StatsGrid stats={stepMeta.fields} />
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-black text-slate-700"><tr><th className="p-3">{stepMeta.kind === 'STEP' ? 'Entity type' : 'IGES entity'}</th><th className="p-3">Count</th></tr></thead>
              <tbody>{stepMeta.entityCounts.map(([k, v]) => <tr key={k} className="border-t border-slate-100"><td className="p-3 font-mono">{k}</td><td className="p-3">{v}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {['svg-view', 'svg-raster', 'svg-pdf'].includes(mode) && svgText && (
        <div className="space-y-4">
          {/* Rendered through <img>, so any remaining script cannot execute. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={svgPreviewUrl} alt={`Preview of ${fileName}`} className="w-full max-h-[480px] object-contain bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] rounded-2xl border border-slate-200" />
          {mode === 'svg-view' && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Original {(svgText.length / 1024).toFixed(1)} KB → optimised {(svgOptimized.length / 1024).toFixed(1)} KB ({svgText.length ? ((1 - svgOptimized.length / svgText.length) * 100).toFixed(1) : 0}% smaller)</span>
              <button onClick={() => download(svgOptimized, fileName.replace(/\.svg$/i, '') + '.min.svg', 'image/svg+xml')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"><Download className="w-4 h-4" /> Download optimised SVG</button>
            </div>
          )}
          {(mode === 'svg-raster' || mode === 'svg-pdf') && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2">Resolution
                <select value={rasterScale} onChange={(e) => setRasterScale(Number(e.target.value))} className="px-2 py-1 border border-slate-200 rounded-lg">
                  <option value={1}>1× (96 dpi)</option><option value={2}>2× (192 dpi)</option><option value={3.125}>3.125× (300 dpi)</option>
                </select>
              </label>
              {mode === 'svg-raster' && (
                <label className="flex items-center gap-2">Format
                  <select value={rasterType} onChange={(e) => setRasterType(e.target.value as 'image/png' | 'image/jpeg')} className="px-2 py-1 border border-slate-200 rounded-lg">
                    <option value="image/png">PNG (transparent)</option><option value="image/jpeg">JPG (white background)</option>
                  </select>
                </label>
              )}
              <button onClick={mode === 'svg-raster' ? exportRaster : exportPdf} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl"><Download className="w-4 h-4" /> {mode === 'svg-raster' ? 'Convert & download' : 'Create PDF'}</button>
            </div>
          )}
          {mode === 'svg-pdf' && <p className="text-[11px] text-slate-500">The PDF embeds a high-resolution raster of the SVG (page size taken from the SVG width/height). For a fully vector PDF, print the SVG to PDF from a browser or use Inkscape.</p>}
        </div>
      )}
    </section>
  );
}
