'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  Mountain,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const SAMPLE_TERRAIN_PTS = `0.000 0.000 100.000
10.000 0.000 101.200
20.000 0.000 102.500
0.000 10.000 103.800
10.000 10.000 104.200
20.000 10.000 106.000`;

const SAMPLE_SLOPE_PTS = `0 0 10.0
5 0 12.0
10 0 14.0
15 0 16.0`;

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function parseAsciiPoints(pointText: string, intervalStr: string) {
  const interval = parsePositive(intervalStr);
  if (!Number.isFinite(interval)) {
    return { valid: false as const, error: 'Contour elevation interval delta_Z must be > 0 (m).' };
  }

  const lines = pointText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith(';'));

  if (lines.length === 0) {
    return { valid: false as const, error: 'Provide at least one X Y Z point coordinate row.' };
  }

  const pts: Array<{ x: number; y: number; z: number; bandIdx: number }> = [];
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const line of lines) {
    const tokens = line.split(/[\s,;]+/).filter(Boolean);
    if (tokens.length < 3) {
      return { valid: false as const, error: `Invalid XYZ row: "${line}". Expected at least 3 numeric columns.` };
    }
    const x = Number(tokens[0]);
    const y = Number(tokens[1]);
    const z = Number(tokens[2]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      return { valid: false as const, error: `Non-numeric coordinate in row: "${line}".` };
    }
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
    pts.push({ x, y, z, bandIdx: 0 });
  }

  const bandCounts: Record<string, number> = {};
  const dxfLines = [
    '0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1027', '9', '$INSUNITS', '70', '6', '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
  ];

  for (const pt of pts) {
    const bandStart = Math.floor(pt.z / interval) * interval;
    const bandEnd = bandStart + interval;
    const layer = `ELEV_${bandStart.toFixed(2)}_TO_${bandEnd.toFixed(2)}`;
    bandCounts[layer] = (bandCounts[layer] || 0) + 1;
    dxfLines.push(
      '0', 'POINT', '8', layer,
      '10', pt.x.toFixed(4), '20', pt.y.toFixed(4), '30', pt.z.toFixed(4)
    );
  }
  dxfLines.push('0', 'ENDSEC', '0', 'EOF');

  const bandRows = Object.entries(bandCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([layer, count]) => ({ layer, count }));

  return {
    valid: true as const,
    pointCount: pts.length,
    minZ,
    maxZ,
    reliefZ: maxZ - minZ,
    spanX: maxX - minX,
    spanY: maxY - minY,
    bandCount: bandRows.length,
    bandRows,
    dxfText: dxfLines.join('\n'),
  };
}

export default function OnlinePointCloudLasToDxfContourClient() {
  const [pointText, setPointText] = useState(SAMPLE_TERRAIN_PTS);
  const [intervalStr, setIntervalStr] = useState('2.0');
  const [lasHeaderStatus, setLasHeaderStatus] = useState('No binary .las read (optional LASF header byte inspection)');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => parseAsciiPoints(pointText, intervalStr), [pointText, intervalStr]);

  const handleLocalLasInspect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size >= 112) {
      const buf = await file.slice(0, 128).arrayBuffer();
      const dv = new DataView(buf);
      const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
      if (magic === 'LASF') {
        const verMajor = dv.getUint8(24);
        const verMinor = dv.getUint8(25);
        const fmtId = dv.getUint8(104);
        const ptCount = dv.getUint32(107, true);
        setLasHeaderStatus(`${file.name}: LASF v${verMajor}.${verMinor}, Format ${fmtId}, Points=${ptCount} (0 bytes uploaded)`);
        return;
      }
    }
    const text = await file.slice(0, 512 * 1024).text();
    setLasHeaderStatus(`${file.name}: loaded as ASCII XYZ (${file.size} bytes local)`);
    setPointText(text);
  };

  const resetDefaults = () => {
    setPointText(SAMPLE_TERRAIN_PTS);
    setIntervalStr('2.0');
    setLasHeaderStatus('No binary .las read (optional LASF header byte inspection)');
  };

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      'Local Point Cloud Elevation Band Summary',
      `Points: ${result.pointCount} | X Span: ${result.spanX.toFixed(4)} m | Y Span: ${result.spanY.toFixed(4)} m`,
      `Min Z: ${result.minZ.toFixed(4)} m | Max Z: ${result.maxZ.toFixed(4)} m | Relief: ${result.reliefZ.toFixed(4)} m`,
      `Elevation Bands: ${result.bandCount}`,
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

  const downloadText = (content: string, filename: string, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([toSafeAscii(content) + '\r\n'], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const csvText = result.valid
    ? [
        'ElevationBandLayer,PointCount',
        ...result.bandRows.map((r) => `${r.layer},${r.count}`),
        `TOTAL_POINTS,${result.pointCount}`,
      ].join('\r\n')
    : '';

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local LAS Header &amp; Elevation-Banded DXF POINT Exporter:</span> Inspects ASPRS `.las` (`LASF`) binary headers locally (`0 bytes uploaded`), classifies ASCII `X Y Z` coordinates into elevation bands, and exports layered 3D `POINT` `.dxf` (`$INSUNITS=6` meters). Full binary TIN contour triangulation from large LiDAR files runs offline in desktop tools such as CloudCompare or Civil 3D.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-terrain"
          onClick={() => {
            setPointText(SAMPLE_TERRAIN_PTS);
            setIntervalStr('2.0');
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: 6 Survey Grid Points (Z 100..106 m, Interval 2.0 m)
        </button>
        <button
          type="button"
          data-testid="preset-slope"
          onClick={() => {
            setPointText(SAMPLE_SLOPE_PTS);
            setIntervalStr('2.0');
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: 4 Linear Slope Points (Z 10..16 m, Relief 6 m)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">Point Cloud &amp; Contour Band</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Read .las / .xyz
              <input type="file" accept=".las,.xyz,.pts,.csv,.txt" onChange={handleLocalLasInspect} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-slate-500 font-mono break-all">{lasHeaderStatus}</div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Contour Band Interval delta_Z (m)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-interval"
              value={intervalStr}
              onChange={(e) => setIntervalStr(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <textarea
            data-testid="input-points"
            rows={10}
            value={pointText}
            onChange={(e) => setPointText(e.target.value)}
            spellCheck={false}
            placeholder="X Y Z (one point per line)"
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
          />

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Elevation Summary &amp; Exports</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={() => result.valid && downloadText(csvText, 'point_cloud_elevation_bands.csv', 'text/csv;charset=utf-8')}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  type="button"
                  data-testid="btn-download-dxf"
                  onClick={() => result.valid && downloadText(result.dxfText, 'elevation_banded_points.dxf')}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .DXF
                </button>
              </div>
            </div>

            {!result.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Points Parsed</div>
                    <div data-testid="out-points" className="text-2xl font-black text-blue-900 mt-1">{result.pointCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Elevation Relief</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      <span data-testid="out-relief">{result.reliefZ.toFixed(4)}</span> m
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Elevation Bands</div>
                    <div data-testid="out-bands" className="text-2xl font-black text-slate-900 mt-1">{result.bandCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Min / Max Z (m)</div>
                    <div className="text-sm font-black text-slate-900 mt-2">
                      {result.minZ.toFixed(2)} .. {result.maxZ.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <th className="py-2 pr-4">DXF Contour Band Layer</th>
                        <th className="py-2 pl-4">Points in Band</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.bandRows.map((r) => (
                        <tr key={r.layer} className="border-b border-slate-100 font-semibold text-slate-800">
                          <td className="py-2 pr-4 font-mono">{r.layer}</td>
                          <td className="py-2 pl-4">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  ASPRS LAS binaries use magic bytes `LASF` (versions up to 1.4 R15). Exported `.dxf` places each 3D `POINT` onto its elevation band layer in meter coordinates (`$INSUNITS=6`).
                </span>
              </div>
              <a
                href="https://en.wikipedia.org/wiki/LAS_file_format"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                ASPRS LAS File Format Specification (Wikipedia) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
