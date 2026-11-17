'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'High G-Ratio Run (50000 / 500 mm3)', vw: '50000', vs: '500', pnet: '2.5', qw: '1200' },
  { id: 'high-wear', label: 'Heavy Wheel Wear (50000 / 1000 mm3)', vw: '50000', vs: '1000', pnet: '2.5', qw: '1200' },
  { id: 'creep-feed', label: 'High-Power Creep Feed (6.0 kW)', vw: '80000', vs: '800', pnet: '6.0', qw: '3600' },
];

export default function GrindingRatioCalculatorClient() {
  const [vwStr, setVwStr] = useState('50000');
  const [vsStr, setVsStr] = useState('500');
  const [pnetStr, setPnetStr] = useState('2.5');
  const [qwStr, setQwStr] = useState('1200');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setVwStr(p.vw);
    setVsStr(p.vs);
    setPnetStr(p.pnet);
    setQwStr(p.qw);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const vw = parseStrictPositive(vwStr);
    const vs = parseStrictPositive(vsStr);
    const pnet = parseStrictPositive(pnetStr);
    const qwMin = parseStrictPositive(qwStr);

    if (!Number.isFinite(vw) || !Number.isFinite(vs) || !Number.isFinite(pnet) || !Number.isFinite(qwMin)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive workpiece volume removed, wheel wear volume, net grinding power, and material removal rate.',
      };
    }

    const gRatio = vw / vs;
    const qwSec = qwMin / 60;
    const specificEnergy = (1000 * pnet) / qwSec;
    const totalEnergyKj = (specificEnergy * vw) / 1000;
    const efficiencyNote =
      gRatio >= 60
        ? 'High Volumetric Efficiency (G >= 60)'
        : gRatio >= 20
        ? 'Moderate Wheel Wear (20 <= G < 60)'
        : 'Elevated Wheel Wear (G < 20)';

    return {
      valid: true as const,
      vw,
      vs,
      pnet,
      qwMin,
      gRatio,
      qwSec,
      specificEnergy,
      totalEnergyKj,
      efficiencyNote,
    };
  }, [vwStr, vsStr, pnetStr, qwStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Grinding Ratio & Specific Energy Summary`,
      `Workpiece Removed Vw=${result.vw} mm3, Wheel Wear Vs=${result.vs} mm3, P_net=${result.pnet} kW, Qw=${result.qwMin} mm3/min`,
      `Grinding Ratio G = ${result.gRatio.toFixed(2)}`,
      `Material Removal Rate Qw_s = ${result.qwSec.toFixed(2)} mm3/s`,
      `Specific Grinding Energy u = ${result.specificEnergy.toFixed(2)} J/mm3`,
      `Total Net Grinding Energy = ${result.totalEnergyKj.toFixed(2)} kJ`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
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
      ['Parameter', 'Value', 'Unit'],
      ['Workpiece Volume Removed Vw', String(result.vw), 'mm3'],
      ['Wheel Wear Volume Vs', String(result.vs), 'mm3'],
      ['Net Spindle Grinding Power P_net', String(result.pnet), 'kW'],
      ['Volumetric Removal Rate Qw', String(result.qwMin), 'mm3/min'],
      ['Volumetric Grinding Ratio G = Vw/Vs', result.gRatio.toFixed(2), '-'],
      ['Removal Rate per Second Qw_s', result.qwSec.toFixed(2), 'mm3/s'],
      ['Specific Grinding Energy u = P_net / Qw_s', result.specificEnergy.toFixed(2), 'J/mm3'],
      ['Total Net Grinding Energy E_total', result.totalEnergyKj.toFixed(2), 'kJ'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grinding-ratio-specific-energy.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 hover:text-purple-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Measured Grinding Inputs</h2>
          </div>

          {[
            { id: 'vw', label: 'Workpiece Material Removed Vw (mm3)', val: vwStr, set: setVwStr },
            { id: 'vs', label: 'Wheel Abrasive Wear Vs (mm3)', val: vsStr, set: setVsStr },
            { id: 'pnet', label: 'Net Grinding Power P_net (kW)', val: pnetStr, set: setPnetStr },
            { id: 'qw', label: 'Material Removal Rate Qw (mm3/min)', val: qwStr, set: setQwStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                inputMode="decimal"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">G-Ratio &amp; Energy Metrics</h2>
                  <p className="text-xs font-bold text-slate-500" data-testid="result-grade">
                    {result.valid ? result.efficiencyNote : '—'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Grinding Ratio G = Vw / Vs</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-gratio">{result.valid ? result.gRatio.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-purple-500">mm3/mm3</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Specific Grinding Energy u</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-u">{result.valid ? result.specificEnergy.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">J/mm3</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Removal Rate Qw_s</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-qws">{result.valid ? result.qwSec.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">mm3/s</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Total Net Energy E_total</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-energy">{result.valid ? result.totalEnergyKj.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">kJ</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                First-principles physical definitions: Volumetric Grinding Ratio G = Vw / Vs, volumetric removal rate Qw_s = Qw / 60 (mm3/s), and specific grinding energy u = (1000 * P_net) / Qw_s (J/mm3) computed directly from measured net spindle power and removal rate.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
