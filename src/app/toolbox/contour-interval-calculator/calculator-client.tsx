'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parsePositiveInt(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isInteger(n) && n >= 1 ? n : Number.NaN;
}

function fmt(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}

export default function ContourIntervalCalculatorClient() {
  const [mapScaleStr, setMapScaleStr] = useState('1000');
  const [elevRangeStr, setElevRangeStr] = useState('50');
  const [ciStr, setCiStr] = useState('1.0');
  const [slopePctStr, setSlopePctStr] = useState('10');
  const [indexMultStr, setIndexMultStr] = useState('5');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setMapScaleStr('1000');
    setElevRangeStr('50');
    setCiStr('1.0');
    setSlopePctStr('10');
    setIndexMultStr('5');
    setCopied(false);
  };

  const result = useMemo(() => {
    const M = parsePositive(mapScaleStr);
    const dH = parsePositive(elevRangeStr);
    const CI = parsePositive(ciStr);
    const S = parsePositive(slopePctStr);
    const kIndex = parsePositiveInt(indexMultStr);

    if (!Number.isFinite(M) || !Number.isFinite(dH) || !Number.isFinite(CI) || !Number.isFinite(S) || !Number.isFinite(kIndex)) {
      return { valid: false as const };
    }

    const spanCount = dH / CI;
    const contourLines = Math.floor(dH / CI) + 1;
    const indexInterval = kIndex * CI;
    const groundSpacingM = CI / (S / 100);
    const mapSpacingMm = (groundSpacingM * 1000) / M;
    const crowded = mapSpacingMm < 0.5;

    return {
      valid: true as const,
      M,
      dH,
      CI,
      S,
      kIndex,
      spanCount,
      contourLines,
      indexInterval,
      groundSpacingM,
      mapSpacingMm,
      crowded,
    };
  }, [mapScaleStr, elevRangeStr, ciStr, slopePctStr, indexMultStr]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const text = [
      `Contour Interval & Map Spacing Summary (1:${result.M})`,
      `Elevation Range: ${result.dH} m | Contour Interval (CI): ${result.CI} m | Index Interval (x${result.kIndex}): ${result.indexInterval.toFixed(2)} m`,
      `Contour Intervals Spanned: ${result.spanCount.toFixed(2)} | Discrete Boundary Lines: ${result.contourLines}`,
      `Ground Horizontal Spacing (@ ${result.S}% slope): ${result.groundSpacingM.toFixed(2)} m | Paper Map Spacing: ${result.mapSpacingMm.toFixed(2)} mm`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!result.valid) return;
    const rows = [
      'parameter,value,unit,notes',
      `map_scale_denom,${result.M},1:M,Representative map scale denominator`,
      `elevation_range,${result.dH},m,Total vertical relief`,
      `contour_interval,${result.CI},m,Vertical difference between adjacent contours`,
      `index_contour_interval,${result.indexInterval.toFixed(3)},m,${result.kIndex}x intermediate interval`,
      `interval_spans,${result.spanCount.toFixed(2)},-,dH / CI`,
      `contour_lines,${result.contourLines},lines,floor(dH / CI) + 1`,
      `ground_spacing,${result.groundSpacingM.toFixed(3)},m,CI / (slope_pct / 100)`,
      `map_spacing,${result.mapSpacingMm.toFixed(3)},mm,(ground_spacing * 1000) / M`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contour-interval-geometry.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick CI Presets (m)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['0.5', '1.0', '2.0', '5.0', '10.0'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  data-testid={`preset-ci-${preset}`}
                  onClick={() => setCiStr(preset)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-black border ${
                    ciStr === preset
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  {preset} m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Map Scale Denominator (1:M)
            </label>
            <input
              data-testid="input-scale"
              type="text"
              inputMode="decimal"
              value={mapScaleStr}
              onChange={(e) => setMapScaleStr(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Elevation Range ΔH (m)
            </label>
            <input
              data-testid="input-range"
              type="text"
              inputMode="decimal"
              value={elevRangeStr}
              onChange={(e) => setElevRangeStr(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Contour Interval CI (m)
            </label>
            <input
              data-testid="input-ci"
              type="text"
              inputMode="decimal"
              value={ciStr}
              onChange={(e) => setCiStr(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Ground Slope (%)
              </label>
              <input
                data-testid="input-slope"
                type="text"
                inputMode="decimal"
                value={slopePctStr}
                onChange={(e) => setSlopePctStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Index Multiplier
              </label>
              <input
                data-testid="input-index-mult"
                type="text"
                inputMode="numeric"
                value={indexMultStr}
                onChange={(e) => setIndexMultStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Cartographic Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {result.valid && result.crowded && (
              <div
                data-testid="crowding-warning"
                className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs font-bold text-amber-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Paper contour line spacing ({result.mapSpacingMm.toFixed(2)} mm) is tighter than 0.50 mm on the sheet — contours may visually coalesce at 1:{result.M}. Consider increasing CI or enlarging the plot scale.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Contour Lines (ΔH / CI)</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-lines" className="text-3xl font-black text-blue-800">
                    {result.valid ? result.contourLines : '—'}
                  </span>
                  <span className="text-sm font-bold text-blue-500">lines</span>
                </div>
                <div data-testid="result-spans" className="text-xs font-bold text-blue-600 mt-1">
                  {result.valid ? `${result.spanCount.toFixed(2)} intervals spanned` : '—'}
                </div>
              </div>

              <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                <div className="text-xs font-black text-teal-600 uppercase tracking-wider mb-1">Index Contour Interval</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-index-ci" className="text-3xl font-black text-teal-800">
                    {result.valid ? fmt(result.indexInterval, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-teal-600">m</span>
                </div>
                <div className="text-xs font-bold text-teal-700 mt-1">
                  {result.valid ? `Every ${result.kIndex}th contour line` : '—'}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Ground Horizontal Spacing</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-ground-spacing" className="text-3xl font-black text-emerald-800">
                    {result.valid ? fmt(result.groundSpacingM, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">m</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Plotted Sheet Spacing</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-map-spacing" className="text-3xl font-black text-orange-800">
                    {result.valid ? fmt(result.mapSpacingMm, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-orange-500">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Topographic Geometry:</strong>{' '}
                <code>Ground_Spacing = CI / (Slope% / 100)</code> and <code>Sheet_Spacing (mm) = (Ground_Spacing × 1000) / Scale_Denominator</code>. Contour interval is the constant elevation difference between adjacent contour lines.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
