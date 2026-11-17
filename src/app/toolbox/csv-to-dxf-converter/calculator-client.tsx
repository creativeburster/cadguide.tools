'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { FileCode2, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const DEFAULT_CSV = [
  'PointID,Easting,Northing,Elevation',
  'P1,100.0,200.0,15.5',
  'P2,150.0,200.0,16.0',
  'P3,150.0,240.0,16.2',
  'P4,100.0,240.0,15.8',
].join('\n');

interface ParsedPoint {
  rowNumber: number;
  x: number;
  y: number;
  z: number;
  label: string;
}

function parseStrictFinite(raw: string | undefined): number {
  if (raw === undefined) return Number.NaN;
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseColIndex(raw: string, allowMinusOne = false): number {
  const t = raw.trim();
  if (!/^-?\d+$/.test(t)) return Number.NaN;
  const n = Number(t);
  if (allowMinusOne) return n >= -1 ? n : Number.NaN;
  return n >= 0 ? n : Number.NaN;
}

function sanitizeAscii(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, '').trim() || 'PT';
}

function splitCsvLine(line: string, delimiter: string): string[] {
  if (delimiter !== ',') {
    return line.split(delimiter).map((s) => s.trim());
  }
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function buildDxf(
  points: ParsedPoint[],
  options: {
    mode: 'points' | 'polyline' | 'both';
    layerName: string;
    includeLabels: boolean;
    textHeight: number;
    closePolyline: boolean;
  }
): string {
  const layer = sanitizeAscii(options.layerName || 'SURVEY_POINTS').replace(/\s+/g, '_');
  const lines: string[] = [
    '0',
    'SECTION',
    '2',
    'HEADER',
    '9',
    '$ACADVER',
    '1',
    'AC1009',
    '0',
    'ENDSEC',
    '0',
    'SECTION',
    '2',
    'TABLES',
    '0',
    'TABLE',
    '2',
    'LAYER',
    '70',
    '1',
    '0',
    'LAYER',
    '2',
    layer,
    '70',
    '0',
    '62',
    '7',
    '6',
    'CONTINUOUS',
    '0',
    'ENDTAB',
    '0',
    'ENDSEC',
    '0',
    'SECTION',
    '2',
    'ENTITIES',
  ];

  if (options.mode === 'points' || options.mode === 'both') {
    for (const p of points) {
      lines.push(
        '0',
        'POINT',
        '8',
        layer,
        '10',
        p.x.toFixed(6),
        '20',
        p.y.toFixed(6),
        '30',
        p.z.toFixed(6)
      );
    }
  }

  if (options.includeLabels) {
    const offset = options.textHeight * 0.35;
    for (const p of points) {
      lines.push(
        '0',
        'TEXT',
        '8',
        `${layer}_LABELS`,
        '10',
        (p.x + offset).toFixed(6),
        '20',
        (p.y + offset).toFixed(6),
        '30',
        p.z.toFixed(6),
        '40',
        options.textHeight.toFixed(4),
        '1',
        sanitizeAscii(p.label)
      );
    }
  }

  if ((options.mode === 'polyline' || options.mode === 'both') && points.length >= 2) {
    lines.push(
      '0',
      'POLYLINE',
      '8',
      layer,
      '66',
      '1',
      '10',
      '0.0',
      '20',
      '0.0',
      '30',
      '0.0',
      '70',
      String(8 | (options.closePolyline ? 1 : 0))
    );
    for (const p of points) {
      lines.push(
        '0',
        'VERTEX',
        '8',
        layer,
        '10',
        p.x.toFixed(6),
        '20',
        p.y.toFixed(6),
        '30',
        p.z.toFixed(6),
        '70',
        '32'
      );
    }
    lines.push('0', 'SEQEND', '8', layer);
  }

  lines.push('0', 'ENDSEC', '0', 'EOF');
  return lines.join('\r\n') + '\r\n';
}

export default function CSVToDXFClient() {
  const [csvText, setCsvText] = useState(DEFAULT_CSV);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [xColStr, setXColStr] = useState('1');
  const [yColStr, setYColStr] = useState('2');
  const [zColStr, setZColStr] = useState('3');
  const [labelColStr, setLabelColStr] = useState('0');
  const [mode, setMode] = useState<'points' | 'polyline' | 'both'>('both');
  const [layerName, setLayerName] = useState('SURVEY_POINTS');
  const [scaleStr, setScaleStr] = useState('1');
  const [textHeightStr, setTextHeightStr] = useState('1.5');
  const [includeLabels, setIncludeLabels] = useState(true);
  const [closePolyline, setClosePolyline] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setCsvText(DEFAULT_CSV);
    setHasHeader(true);
    setDelimiter(',');
    setXColStr('1');
    setYColStr('2');
    setZColStr('3');
    setLabelColStr('0');
    setMode('both');
    setLayerName('SURVEY_POINTS');
    setScaleStr('1');
    setTextHeightStr('1.5');
    setIncludeLabels(true);
    setClosePolyline(false);
    setCopied(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCsvText(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const parsed = useMemo(() => {
    const xIdx = parseColIndex(xColStr);
    const yIdx = parseColIndex(yColStr);
    const zIdx = parseColIndex(zColStr, true);
    const lIdx = parseColIndex(labelColStr, true);
    const scale = parsePositive(scaleStr);
    const textHeight = parsePositive(textHeightStr);

    if (
      !Number.isInteger(xIdx) ||
      !Number.isInteger(yIdx) ||
      !Number.isInteger(zIdx) ||
      !Number.isInteger(lIdx) ||
      !Number.isFinite(scale) ||
      !Number.isFinite(textHeight)
    ) {
      return { valid: false as const, points: [] as ParsedPoint[], skipped: 0, reason: 'Invalid column mapping, scale, or text height.' };
    }

    const rawLines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const startIdx = hasHeader && rawLines.length > 0 ? 1 : 0;
    const points: ParsedPoint[] = [];
    let skipped = 0;

    for (let i = startIdx; i < rawLines.length; i++) {
      const cols = splitCsvLine(rawLines[i], delimiter);
      const xRaw = parseStrictFinite(cols[xIdx]);
      const yRaw = parseStrictFinite(cols[yIdx]);
      let zRaw = 0;
      let zValid = true;
      if (zIdx >= 0) {
        if (cols[zIdx] === undefined || cols[zIdx].trim() === '') {
          zValid = false;
        } else {
          zRaw = parseStrictFinite(cols[zIdx]);
          if (!Number.isFinite(zRaw)) zValid = false;
        }
      }

      if (!Number.isFinite(xRaw) || !Number.isFinite(yRaw) || !zValid) {
        skipped++;
        continue;
      }

      const rawLabel = lIdx >= 0 && cols[lIdx] ? cols[lIdx] : `P${points.length + 1}`;
      points.push({
        rowNumber: i + 1,
        x: xRaw * scale,
        y: yRaw * scale,
        z: zRaw * scale,
        label: sanitizeAscii(rawLabel),
      });
    }

    if (points.length === 0) {
      return {
        valid: false as const,
        points,
        skipped,
        reason: skipped > 0 ? `0 valid points (${skipped} row(s) skipped due to missing or non-numeric coordinates).` : 'Enter at least one valid coordinate row.',
      };
    }

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const zs = points.map((p) => p.z);

    const dX = Math.max(...xs) - Math.min(...xs);
    const dY = Math.max(...ys) - Math.min(...ys);
    const dZ = Math.max(...zs) - Math.min(...zs);

    let pathLength = 0;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      pathLength += Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    }
    if (closePolyline && points.length >= 3) {
      const a = points[points.length - 1];
      const b = points[0];
      pathLength += Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    }

    const dxfContent = buildDxf(points, {
      mode,
      layerName,
      includeLabels,
      textHeight,
      closePolyline,
    });

    return {
      valid: true as const,
      points,
      skipped,
      dX,
      dY,
      dZ,
      pathLength,
      dxfContent,
    };
  }, [csvText, hasHeader, delimiter, xColStr, yColStr, zColStr, labelColStr, mode, layerName, scaleStr, textHeightStr, includeLabels, closePolyline]);

  const handleCopyDxf = async () => {
    if (!parsed.valid) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(parsed.dxfContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadDxf = () => {
    if (!parsed.valid) return;
    const blob = new Blob([parsed.dxfContent], { type: 'application/dxf;charset=ascii;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey_points.dxf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">CSV Coordinate to ASCII DXF Converter</h2>
            <p className="text-sm font-medium text-slate-500">
              Strict coordinate validation — invalid or empty rows are skipped, never coerced to 0
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label htmlFor="csv-input" className="text-sm font-black text-slate-700">
                CSV / Coordinate Table Input
              </label>
              <label className="text-xs font-black text-blue-600 hover:underline cursor-pointer">
                Upload .csv/.txt
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              id="csv-input"
              data-testid="input-csv"
              rows={7}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid="toggle-header"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded border-slate-300"
              />
              First row is header
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid="toggle-labels"
                checked={includeLabels}
                onChange={(e) => setIncludeLabels(e.target.checked)}
                className="rounded border-slate-300"
              />
              Include 3D TEXT Labels
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid="toggle-close"
                checked={closePolyline}
                onChange={(e) => setClosePolyline(e.target.checked)}
                className="rounded border-slate-300"
              />
              Close Polyline
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="col-x" className="block text-xs font-black text-slate-600 mb-1">X Col (0-idx)</label>
              <input
                id="col-x"
                data-testid="input-x-col"
                type="text"
                value={xColStr}
                onChange={(e) => setXColStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="col-y" className="block text-xs font-black text-slate-600 mb-1">Y Col (0-idx)</label>
              <input
                id="col-y"
                data-testid="input-y-col"
                type="text"
                value={yColStr}
                onChange={(e) => setYColStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="col-z" className="block text-xs font-black text-slate-600 mb-1">Z Col (-1 none)</label>
              <input
                id="col-z"
                data-testid="input-z-col"
                type="text"
                value={zColStr}
                onChange={(e) => setZColStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="col-label" className="block text-xs font-black text-slate-600 mb-1">Label (-1 auto)</label>
              <input
                id="col-label"
                data-testid="input-label-col"
                type="text"
                value={labelColStr}
                onChange={(e) => setLabelColStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="dxf-layer" className="block text-xs font-black text-slate-600 mb-1">DXF Layer</label>
              <input
                id="dxf-layer"
                data-testid="input-layer"
                type="text"
                value={layerName}
                onChange={(e) => setLayerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="dxf-scale" className="block text-xs font-black text-slate-600 mb-1">Coordinate Scale</label>
              <input
                id="dxf-scale"
                data-testid="input-scale"
                type="text"
                inputMode="decimal"
                value={scaleStr}
                onChange={(e) => setScaleStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="dxf-text-h" className="block text-xs font-black text-slate-600 mb-1">Text Height</label>
              <input
                id="dxf-text-h"
                data-testid="input-text-height"
                type="text"
                inputMode="decimal"
                value={textHeightStr}
                onChange={(e) => setTextHeightStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['points', 'polyline', 'both'] as const).map((m) => (
              <button
                key={m}
                type="button"
                data-testid={`mode-${m}`}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                  mode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {m === 'points' ? 'POINT Entities' : m === 'polyline' ? '3D POLYLINE' : 'POINT + 3D POLYLINE'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              data-testid="download-dxf-button"
              disabled={!parsed.valid}
              onClick={handleDownloadDxf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-black transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download ASCII DXF
            </button>
            <button
              type="button"
              data-testid="copy-summary-button"
              disabled={!parsed.valid}
              onClick={handleCopyDxf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-black transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy DXF Text'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!parsed.valid && (
              <div data-testid="error-banner" className="rounded-2xl p-4 bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{parsed.reason}</span>
              </div>
            )}

            {parsed.valid && parsed.skipped > 0 && (
              <div data-testid="warning-skipped" className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Skipped {parsed.skipped} row(s) containing missing or non-numeric coordinates instead of inserting 0.0 placeholders.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="text-xs font-black text-blue-800 uppercase mb-1">Valid Survey Points</div>
                <div data-testid="result-point-count" className="text-3xl font-black text-slate-900">
                  {parsed.valid ? parsed.points.length : '—'}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-black text-slate-500 uppercase mb-1">Skipped Invalid Rows</div>
                <div data-testid="result-skipped-count" className="text-3xl font-black text-slate-900">
                  {parsed.skipped}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Bounding Extents (dX × dY × dZ)</div>
                <div data-testid="result-extents" className="text-lg font-black text-slate-900 font-mono">
                  {parsed.valid
                    ? `${parsed.dX.toFixed(2)} × ${parsed.dY.toFixed(2)} × ${parsed.dZ.toFixed(2)}`
                    : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">3D Polyline Length</div>
                <div data-testid="result-length" className="text-2xl font-black text-slate-900 font-mono">
                  {parsed.valid ? parsed.pathLength.toFixed(3) : '—'}
                </div>
              </div>
            </div>

            {parsed.valid && (
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4">
                <div className="text-[11px] font-black text-slate-400 uppercase mb-2">
                  Generated DXF Preview (First 24 lines)
                </div>
                <pre data-testid="dxf-preview" className="text-[11px] text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                  {parsed.dxfContent.split('\r\n').slice(0, 24).join('\n')}
                </pre>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>AutoCAD DXF Entities Basis:</strong>{' '}
                Writes pure ASCII AC1009 DXF entities with <code>POINT</code> (group codes 10, 20, 30), 3D <code>TEXT</code> labels (group codes 10, 20, 30, 40 height, 1 string), and 3D <code>POLYLINE</code> (group code 70 bit 8 + <code>VERTEX</code> + <code>SEQEND</code>).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
