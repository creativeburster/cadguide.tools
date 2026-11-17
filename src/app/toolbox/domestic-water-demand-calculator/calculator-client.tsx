'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Droplets, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Engineering ToolBox verified Hunter WSFU-to-GPM lookup curve nodes:
// Source: https://www.engineeringtoolbox.com/wsfu-gpm-d_1074.html
const NO_FLUSH_TABLE: [number, number][] = [
  [1, 3],
  [2, 5],
  [4, 8],
  [8, 12.8],
  [15, 17.5],
  [30, 23.3],
  [50, 29.1],
];

const WITH_FLUSH_TABLE: [number, number][] = [
  [5, 15],
  [7, 19.8],
  [10, 27],
  [15, 31],
  [20, 35],
  [30, 42],
  [50, 50],
];

const GAL_TO_LITERS = 3.785411784;

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function interpolateWsfuToGpm(pts: [number, number][], wsfu: number): number | null {
  const minW = pts[0][0];
  const maxW = pts[pts.length - 1][0];
  if (wsfu < minW || wsfu > maxW) return null;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (wsfu >= x0 && wsfu <= x1) {
      if (x1 === x0) return y0;
      return y0 + ((y1 - y0) * (wsfu - x0)) / (x1 - x0);
    }
  }
  return pts[pts.length - 1][1];
}

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function DomesticWaterDemandClient() {
  const [systemType, setSystemType] = useState<'without_flush' | 'with_flush'>('without_flush');
  const [wsfuStr, setWsfuStr] = useState('15');
  const [maxVelStr, setMaxVelStr] = useState('2.0');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setSystemType('without_flush');
    setWsfuStr('15');
    setMaxVelStr('2.0');
    setCopied(false);
  };

  const result = useMemo(() => {
    const wsfu = parsePositive(wsfuStr);
    const maxVel = parsePositive(maxVelStr);

    if (!Number.isFinite(wsfu) || !Number.isFinite(maxVel)) {
      return {
        valid: false as const,
        reason: 'Enter positive numeric values for WSFU and maximum design velocity (m/s).',
      };
    }

    const pts = systemType === 'without_flush' ? NO_FLUSH_TABLE : WITH_FLUSH_TABLE;
    const minW = pts[0][0];
    const maxW = pts[pts.length - 1][0];
    const gpm = interpolateWsfuToGpm(pts, wsfu);

    if (gpm === null) {
      return {
        valid: false as const,
        reason: `Out of verified table range: ${minW}–${maxW} WSFU for ${
          systemType === 'without_flush' ? 'systems without flush valves' : 'systems with flush valves'
        }.`,
      };
    }

    const litersPerSec = (gpm * GAL_TO_LITERS) / 60;
    const m3PerHr = litersPerSec * 3.6;
    const m3PerSec = litersPerSec / 1000;
    const ft3PerMin = gpm * 0.1336805556; // 1 US gal = 231 in3 = 231/1728 ft3

    // Required minimum circular pipe inner diameter: Q = A * v => D = sqrt(4*Q / (pi * v))
    const minPipeIdMm = Math.sqrt((4 * m3PerSec) / (Math.PI * maxVel)) * 1000;

    return {
      valid: true as const,
      wsfu,
      maxVel,
      gpm,
      litersPerSec,
      m3PerHr,
      ft3PerMin,
      minPipeIdMm,
    };
  }, [systemType, wsfuStr, maxVelStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Domestic Water (${systemType === 'without_flush' ? 'Without Flush Valves' : 'With Flush Valves'}): ${result.wsfu} WSFU -> Peak=${result.gpm.toFixed(2)} GPM (${result.litersPerSec.toFixed(3)} L/s, ${result.m3PerHr.toFixed(3)} m3/h) | Min Pipe ID @ ${result.maxVel} m/s = ${result.minPipeIdMm.toFixed(2)} mm`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['system_type', systemType, '-'],
      ['wsfu', String(result.wsfu), 'WSFU'],
      ['peak_flow_gpm', result.gpm.toFixed(3), 'GPM'],
      ['peak_flow_l_s', result.litersPerSec.toFixed(4), 'L/s'],
      ['peak_flow_m3_h', result.m3PerHr.toFixed(4), 'm3/h'],
      ['max_design_velocity', result.maxVel.toFixed(2), 'm/s'],
      ['min_pipe_id', result.minPipeIdMm.toFixed(2), 'mm'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domestic_water_demand.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTable = systemType === 'without_flush' ? NO_FLUSH_TABLE : WITH_FLUSH_TABLE;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">WSFU Peak Domestic Water Demand &amp; Pipe ID</h2>
            <p className="text-sm font-medium text-slate-500">
              Piecewise linear interpolation over verified Hunter WSFU-to-GPM lookup nodes
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1.5">Flush System Type</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="btn-without-flush"
                onClick={() => setSystemType('without_flush')}
                className={`p-3 rounded-xl text-left text-xs font-black border cursor-pointer ${
                  systemType === 'without_flush'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Without Flush Valves (Flush Tanks • Valid 1–50 WSFU)
              </button>
              <button
                type="button"
                data-testid="btn-with-flush"
                onClick={() => setSystemType('with_flush')}
                className={`p-3 rounded-xl text-left text-xs font-black border cursor-pointer ${
                  systemType === 'with_flush'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                With Flush Valves (Flushometers • Valid 5–50 WSFU)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="water-wsfu" className="block text-sm font-black text-slate-700 mb-1.5">
              Total Water Supply Fixture Units (WSFU)
            </label>
            <input
              id="water-wsfu"
              data-testid="input-wsfu"
              type="text"
              inputMode="decimal"
              value={wsfuStr}
              onChange={(e) => setWsfuStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="water-vel" className="block text-sm font-black text-slate-700 mb-1.5">
              Max Allowable Pipe Velocity v_max (m/s)
            </label>
            <input
              id="water-vel"
              data-testid="input-velocity"
              type="text"
              inputMode="decimal"
              value={maxVelStr}
              onChange={(e) => setMaxVelStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!result.valid && (
              <div data-testid="warning-range" className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{result.reason}</span>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="text-xs font-black text-orange-800 uppercase tracking-wider mb-1">
                Peak Probable Demand Flow
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-gpm" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.gpm, 2) : '—'}
                </span>
                <span className="text-lg font-bold text-orange-700">GPM</span>
              </div>
              <div data-testid="result-flow-si" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.litersPerSec.toFixed(3)} L/s • ${result.m3PerHr.toFixed(3)} m³/h • ${result.ft3PerMin.toFixed(2)} ft³/min` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Flow Rate (m³/h)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-m3h" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.m3PerHr, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">m³/h</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Minimum Pipe Inner Dia</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-pipe-id" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.minPipeIdMm, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="text-xs font-black text-slate-500 uppercase mb-2">
                Active Verified Lookup Nodes ({systemType === 'without_flush' ? 'Without Flush Valves' : 'With Flush Valves'})
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTable.map(([w, g]) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWsfuStr(String(w))}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-orange-50 text-xs font-mono font-bold text-slate-700 cursor-pointer"
                  >
                    {w} WSFU → {g} GPM
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Verified Hunter Table &amp; Continuity Basis:</strong>{' '}
                Interpolates strictly within the published Engineering ToolBox WSFU-vs-GPM reference nodes (1–50 WSFU without flush valves; 5–50 WSFU with flush valves) rather than extrapolating or using linear mock offsets. Pipe diameter uses continuity <code>D = √(4Q / (π·v_max))</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
