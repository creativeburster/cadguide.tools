'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

// Frequency correction table verified from Engineering ToolBox (d_1409.html)
const OCTAVE_CORRECTIONS = [
  { hz: 63, corr: -13 },
  { hz: 125, corr: -9 },
  { hz: 250, corr: -5 },
  { hz: 500, corr: -1 },
  { hz: 1000, corr: 3 },
  { hz: 2000, corr: 7 },
  { hz: 4000, corr: 11 },
  { hz: 8000, corr: 15 },
];

const MASS_PRESETS = [
  { id: 'gypsum', label: '16mm Gypsum (25 kg/m2)', m: '25' },
  { id: 'brick', label: 'Brick Wall (200 kg/m2)', m: '200' },
  { id: 'concrete', label: 'Concrete 100mm (240 kg/m2)', m: '240' },
  { id: 'slab', label: 'Heavy Slab (350 kg/m2)', m: '350' },
];

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

const DEFAULT_INPUTS = ['240', '500', '0'];

export default function SoundTransmissionClassCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const mass = parseFinite(inputs[0]);
    const freq = parseFinite(inputs[1]);
    const adj = parseFinite(inputs[2]);

    if (mass === null || freq === null || adj === null) {
      return { valid: false as const, error: 'Enter numeric values for surface mass density, frequency, and cavity/decoupling adjustment.' };
    }
    if (mass <= 0 || freq <= 0) {
      return { valid: false as const, error: 'Surface mass density m and frequency f must both be > 0.' };
    }

    // Random-incidence acoustic Mass Law: TL = 20 * log10(m * f) - 47.3 (dB)
    const tlFreq = 20 * Math.log10(mass * freq) - 47.3;
    const tl500 = 20 * Math.log10(mass * 500) - 47.3;
    const estStc = tl500 + adj;

    const bandRows = OCTAVE_CORRECTIONS.map(b => ({
      hz: b.hz,
      corr: b.corr,
      tlBand: tl500 + b.corr,
    }));

    return { valid: true as const, mass, freq, adj, tlFreq, tl500, estStc, bandRows };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Acoustic Mass-Law Sound Transmission Loss Estimation Report',
      '# Formula: TL_mass = 20*log10(m*f) - 47.3 ; Octave frequency correction per Engineering ToolBox (d_1409.html)',
      'Parameter,Value,Unit',
      `Surface Mass Density m,${result.mass},kg/m2`,
      `Evaluation Frequency f,${result.freq},Hz`,
      `User Cavity/Decoupling Offset,${result.adj},dB`,
      `Mass-Law TL at Evaluation Freq f,${result.tlFreq.toFixed(6)},dB`,
      `Mass-Law Mean TL (500 Hz Reference),${result.tl500.toFixed(6)},dB`,
      `Estimated Single-Number Rating (Est_STC),${result.estStc.toFixed(6)},dB`,
      '',
      'Octave Frequency (Hz),ETB Correction (dB),Corrected Wall Attenuation (dB)',
      ...result.bandRows.map(r => `${r.hz},${r.corr},${r.tlBand.toFixed(3)}`),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acoustic-mass-law-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
                <p className="text-xs text-slate-500 font-medium">Diffuse-Field Mass Law</p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Reference Wall Mass Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {MASS_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => updateInput(0, p.m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    inputs[0] === p.m
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Surface Mass Density m (kg/m&sup2;)</label>
            <input type="text" data-testid="input-mass" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Evaluation Frequency f (Hz)</label>
            <input type="text" data-testid="input-freq" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">User Cavity / Assembly Offset (dB)</label>
            <input type="text" data-testid="input-adj" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Acoustic Estimates</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                disabled={!result.valid}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Estimated Rating (500 Hz + Offset)</div>
                <div data-testid="output-stc" className="text-3xl font-black text-blue-900">
                  {result.valid ? result.estStc.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-blue-500 ml-1">dB</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Mass-Law TL at f</div>
                <div data-testid="output-tlf" className="text-3xl font-black text-slate-800">
                  {result.valid ? result.tlFreq.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">dB</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Mean TL at 500 Hz</div>
                <div data-testid="output-tl500" className="text-3xl font-black text-slate-800">
                  {result.valid ? result.tl500.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">dB</span>}
                </div>
              </div>
            </div>

            {result.valid && (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black">
                    <tr>
                      <th className="py-2.5 px-3">Octave Band (Hz)</th>
                      {result.bandRows.map(b => (
                        <th key={b.hz} className="py-2.5 px-2 text-right">{b.hz}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono font-bold text-slate-700">
                    <tr>
                      <td className="py-2 px-3 font-sans text-slate-500">Correction (dB)</td>
                      {result.bandRows.map(b => (
                        <td key={b.hz} className="py-2 px-2 text-right">{b.corr > 0 ? `+${b.corr}` : b.corr}</td>
                      ))}
                    </tr>
                    <tr className="bg-blue-50/40 text-blue-900">
                      <td className="py-2 px-3 font-sans font-black">Est. Attenuation (dB)</td>
                      {result.bandRows.map(b => (
                        <td key={b.hz} className="py-2 px-2 text-right">{b.tlBand.toFixed(1)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Mass-law screening estimate: TL = 20 &middot; log10(m &middot; f) &minus; 47.3 dB with Engineering ToolBox (d_1409.html) frequency corrections. Analytical approximation only, not a certified laboratory STC test rating.
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
