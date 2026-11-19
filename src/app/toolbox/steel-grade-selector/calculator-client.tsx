'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

interface GradeRef {
  id: string;
  label: string;
  fy: string;
  note: string;
}

const VERIFIED_GRADES: GradeRef[] = [
  { id: 'astm-a36-lt8', label: 'ASTM A36 (< 8 in / 203 mm)', fy: '250', note: 'Min yield 36 ksi (250 MPa), UTS 58-80 ksi (400-550 MPa)' },
  { id: 'astm-a36-gt8', label: 'ASTM A36 (> 8 in)', fy: '220', note: 'Thicker sections reference yield 220 MPa' },
  { id: 'en-s235', label: 'Structural S235', fy: '235', note: 'Common structural yield tier 235 MPa' },
  { id: 'en-s275', label: 'Structural S275', fy: '275', note: 'Common structural yield tier 275 MPa' },
  { id: 'en-s355', label: 'Structural S355', fy: '355', note: 'Common structural yield tier 355 MPa' },
  { id: 'en-s420', label: 'Structural S420', fy: '420', note: 'Common structural yield tier 420 MPa' },
  { id: 'en-s460', label: 'Structural S460', fy: '460', note: 'Common structural yield tier 460 MPa' },
];

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 10000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(2);
  if (Math.abs(n) >= 1) return n.toFixed(3);
  return n.toFixed(6);
}

const DEFAULT_INPUTS = ['250', '1.0', '1.5', '150'];

export default function SteelGradeSelectorClient() {
  const [selectedPreset, setSelectedPreset] = useState<string>('astm-a36-lt8');
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const applyPreset = (g: GradeRef) => {
    setSelectedPreset(g.id);
    updateInput(0, g.fy);
  };

  const resetDefaults = () => {
    setSelectedPreset('astm-a36-lt8');
    setInputs(DEFAULT_INPUTS);
  };

  const result = useMemo(() => {
    const fy = parseFinite(inputs[0]);
    const kt = parseFinite(inputs[1]);
    const sf = parseFinite(inputs[2]);
    const reqStress = parseFinite(inputs[3]);

    if (fy === null || kt === null || sf === null || reqStress === null) {
      return { valid: false as const, error: 'Enter numeric values for yield strength Fy, factor kt, safety factor SF, and required stress.' };
    }
    if (fy <= 0 || kt <= 0 || sf <= 0 || reqStress < 0) {
      return { valid: false as const, error: 'Yield strength Fy, derating factor kt, and safety factor SF must be > 0; required stress >= 0.' };
    }

    const fyEff = fy * kt;
    const sigmaAllow = fyEff / sf;
    const tauAllow = fyEff / (Math.sqrt(3) * sf);
    const utilization = (reqStress / sigmaAllow) * 100;
    const passes = reqStress <= sigmaAllow;

    return { valid: true as const, fy, kt, sf, reqStress, fyEff, sigmaAllow, tauAllow, utilization, passes };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const presetObj = VERIFIED_GRADES.find(g => g.id === selectedPreset);
    const lines = [
      '# Structural Steel Allowable Yield & Shear Stress Report',
      '# Formulas: Fy_eff = Fy * kt, sigma_allow = Fy_eff / SF, tau_allow = Fy_eff / (sqrt(3) * SF)',
      'Parameter,Value,Unit',
      `Selected Baseline Reference,${presetObj ? presetObj.label : 'Custom'},-`,
      `Nominal Yield Strength Fy,${result.fy},MPa`,
      `Temperature / Thickness Factor kt,${result.kt},-`,
      `Safety Factor SF,${result.sf},-`,
      `Applied Design Bending/Axial Stress,${result.reqStress},MPa`,
      `Effective Yield Strength Fy_eff,${result.fyEff.toFixed(6)},MPa`,
      `Allowable Normal Stress sigma_allow,${result.sigmaAllow.toFixed(6)},MPa`,
      `Allowable Von Mises Shear Stress tau_allow,${result.tauAllow.toFixed(6)},MPa`,
      `Stress Utilization Ratio,${result.utilization.toFixed(4)},%`,
      `Check Result,${result.passes ? 'PASS' : 'EXCEEDS_ALLOWABLE'},-`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steel-grade-allowable-stress.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Grades</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Verified Baseline Yield Tiers</label>
            <div className="flex flex-wrap gap-1.5">
              {VERIFIED_GRADES.map(g => (
                <button
                  key={g.id}
                  type="button"
                  data-testid={`preset-${g.id}`}
                  onClick={() => applyPreset(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    selectedPreset === g.id && inputs[0] === g.fy
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Nominal Yield Strength Fy (MPa)</label>
              <input type="text" data-testid="input-fy" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Temp / Thickness Factor kt (-)</label>
              <input type="text" data-testid="input-kt" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Safety Factor SF (-)</label>
              <input type="text" data-testid="input-sf" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Applied Design Stress (MPa)</label>
              <input type="text" data-testid="input-req-stress" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Allowable Stresses</h2>
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
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Effective Yield Fy_eff</div>
                <div data-testid="output-fy-eff" className="text-2xl font-black text-blue-800">
                  {result.valid ? formatNum(result.fyEff) : '—'}
                  {result.valid && <span className="text-base text-blue-500 ml-1">MPa</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Allowable Normal &sigma;_allow</div>
                <div data-testid="output-sigma-allow" className="text-2xl font-black text-green-800">
                  {result.valid ? formatNum(result.sigmaAllow) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">MPa</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Allowable Shear &tau;_allow</div>
                <div data-testid="output-tau-allow" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.tauAllow) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">MPa</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sm:col-span-2">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Utilization Ratio</div>
                <div data-testid="output-utilization" className="text-2xl font-black text-slate-800">
                  {result.valid ? result.utilization.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">%</span>}
                </div>
              </div>
              <div className={`rounded-2xl p-5 border ${result.valid && result.passes ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Design Status</div>
                <div data-testid="output-status" className={`text-xl font-black ${result.valid && result.passes ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {result.valid ? (result.passes ? 'Adequate' : 'Overstressed') : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Baseline yield figures verified from Wikipedia:{' '}
                  <a href="https://en.wikipedia.org/wiki/A36_steel" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                    A36 steel
                  </a>{' '}
                  (250 MPa &lt; 8 in, UTS 400&ndash;550 MPa) and{' '}
                  <a href="https://en.wikipedia.org/wiki/Structural_steel" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                    Structural steel
                  </a>{' '}
                  (235, 275, 355, 420, 460 MPa tiers). Von Mises shear limit uses &tau;_allow = Fy_eff / (&radic;3 &middot; SF).
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
