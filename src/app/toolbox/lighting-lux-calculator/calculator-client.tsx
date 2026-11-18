'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Sun, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INT_RE = /^\d+$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parsePosInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 1 ? v : null;
}

export default function LightingLuxCalculatorClient() {
  const [areaStr, setAreaStr] = useState('60');
  const [countStr, setCountStr] = useState('12');
  const [lumensStr, setLumensStr] = useState('3600');
  const [wattsStr, setWattsStr] = useState('32');
  const [ufStr, setUfStr] = useState('0.72');
  const [mfStr, setMfStr] = useState('0.8');
  const [copied, setCopied] = useState(false);

  const area = parsePos(areaStr);
  const count = parsePosInt(countStr);
  const lumens = parsePos(lumensStr);
  const watts = parsePos(wattsStr);
  const uf = parsePos(ufStr);
  const mf = parsePos(mfStr);

  const factorsOk = uf !== null && uf > 0 && uf <= 1 && mf !== null && mf > 0 && mf <= 1;
  const isValid = area !== null && count !== null && lumens !== null && watts !== null && factorsOk;

  let illuminanceLux: number | null = null;
  let totalWatts: number | null = null;
  let lpd: number | null = null;
  let efficacy: number | null = null;

  if (isValid && area !== null && count !== null && lumens !== null && watts !== null && uf !== null && mf !== null) {
    illuminanceLux = (count * lumens * uf * mf) / area;
    totalWatts = count * watts;
    lpd = totalWatts / area;
    efficacy = (count * lumens) / totalWatts;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (a: string, c: string, l: string, w: string, u: string, m: string) => {
    setAreaStr(a);
    setCountStr(c);
    setLumensStr(l);
    setWattsStr(w);
    setUfStr(u);
    setMfStr(m);
  };

  const handleReset = () => applyPreset('60', '12', '3600', '32', '0.72', '0.8');

  const handleCopy = async () => {
    if (!isValid || illuminanceLux === null || totalWatts === null || lpd === null) return;
    const text = [
      'Room Illuminance (Lumen Method) Summary',
      `Area: ${area} m2, Fixtures: ${count} x ${lumens} lm (${watts} W), UF=${uf}, MF=${mf}`,
      `Maintained Illuminance: ${illuminanceLux.toFixed(1)} lux`,
      `Total Power: ${totalWatts.toFixed(1)} W (LPD: ${lpd.toFixed(2)} W/m2)`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || illuminanceLux === null || totalWatts === null || lpd === null || efficacy === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['room_area', String(area), 'm2'],
      ['fixture_count', String(count), 'pcs'],
      ['lumens_per_fixture', String(lumens), 'lm'],
      ['watts_per_fixture', String(watts), 'W'],
      ['utilization_factor', String(uf), 'ratio'],
      ['maintenance_factor', String(mf), 'ratio'],
      ['maintained_illuminance_lux', illuminanceLux.toFixed(3), 'lux'],
      ['total_power_w', totalWatts.toFixed(2), 'W'],
      ['lighting_power_density_w_m2', lpd.toFixed(3), 'W/m2'],
      ['luminaire_efficacy_lm_w', efficacy.toFixed(2), 'lm/W'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lighting-lux-lumen-method.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Sun className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Space &amp; Fixture Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-office-60m2"
                onClick={() => applyPreset('60', '12', '3600', '32', '0.72', '0.8')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-green-50 text-slate-700 border border-slate-200"
              >
                Design Office (60 m2, 12x 3600 lm, 32 W)
              </button>
              <button
                type="button"
                data-testid="preset-warehouse-400m2"
                onClick={() => applyPreset('400', '16', '18000', '140', '0.68', '0.75')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-green-50 text-slate-700 border border-slate-200"
              >
                High-Bay Workshop (400 m2, 16x 18000 lm)
              </button>
              <button
                type="button"
                data-testid="preset-lab-25m2"
                onClick={() => applyPreset('25', '6', '4000', '34', '0.75', '0.85')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-green-50 text-slate-700 border border-slate-200"
              >
                Inspection Bench (25 m2, 6x 4000 lm)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Floor Area (m2)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-area"
                  value={areaStr}
                  onChange={e => setAreaStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Fixtures N</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-count"
                  value={countStr}
                  onChange={e => setCountStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Lumens / Fix</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-lumens"
                  value={lumensStr}
                  onChange={e => setLumensStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Watts / Fix</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-watts"
                  value={wattsStr}
                  onChange={e => setWattsStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Util Factor UF (0–1]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-uf"
                  value={ufStr}
                  onChange={e => setUfStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Maint Factor MF (0–1]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-mf"
                  value={mfStr}
                  onChange={e => setMfStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Area, lumens, watts must be &gt; 0, fixture count an integer &ge; 1, and UF/MF in (0, 1].</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-green-50 text-green-700 hover:bg-green-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Lumen Method Illuminance &amp; LPD</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                E = (N * Phi * UF * MF) / Area, LPD = (N * W) / Area
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-sm font-black text-green-600 uppercase tracking-wider mb-1">Maintained Illuminance</div>
                <div className="text-3xl font-black text-green-900">
                  <span data-testid="result-lux">{fmt(illuminanceLux, 1)}</span>{' '}
                  <span className="text-lg text-green-600">lux</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Lighting Power Density</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-lpd">{fmt(lpd, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">W/m2</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Total Connected Load</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-power">{fmt(totalWatts, 1)}</span>{' '}
                  <span className="text-lg text-orange-600">W</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Luminaire Efficacy</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-efficacy">{fmt(efficacy, 1)}</span>{' '}
                  <span className="text-lg text-slate-500">lm/W</span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
