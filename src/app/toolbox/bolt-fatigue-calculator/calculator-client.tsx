'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

type FatigueCriterion = 'soderberg' | 'goodman';

interface FatiguePreset {
  label: string;
  sa: string;
  sm: string;
  se: string;
  sy: string;
  sut: string;
  criterion: FatigueCriterion;
}

// Property class yield (Sy) and tensile (Sut) values per ISO 898-1:
// Class 8.8: Sy = 640 MPa, Sut = 800 MPa
// Class 10.9: Sy = 940 MPa, Sut = 1040 MPa
// Class 4.6: Sy = 240 MPa, Sut = 400 MPa
const PRESETS: FatiguePreset[] = [
  {
    label: 'ISO 898-1 Class 8.8 (Default)',
    sa: '40',
    sm: '320',
    se: '100',
    sy: '640',
    sut: '800',
    criterion: 'soderberg',
  },
  {
    label: 'ISO 898-1 Class 10.9 (Safe)',
    sa: '10',
    sm: '470',
    se: '100',
    sy: '940',
    sut: '1040',
    criterion: 'soderberg',
  },
  {
    label: 'ISO 898-1 Class 4.6 (Overloaded)',
    sa: '60',
    sm: '180',
    se: '80',
    sy: '240',
    sut: '400',
    criterion: 'soderberg',
  },
];

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits: number): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BoltFatigueCalculatorClient() {
  const [criterion, setCriterion] = useState<FatigueCriterion>('soderberg');
  const [saStr, setSaStr] = useState('40');
  const [smStr, setSmStr] = useState('320');
  const [seStr, setSeStr] = useState('100');
  const [syStr, setSyStr] = useState('640');
  const [sutStr, setSutStr] = useState('800');

  const applyPreset = (p: FatiguePreset) => {
    setCriterion(p.criterion);
    setSaStr(p.sa);
    setSmStr(p.sm);
    setSeStr(p.se);
    setSyStr(p.sy);
    setSutStr(p.sut);
  };

  const handleReset = () => {
    applyPreset(PRESETS[0]);
  };

  const result = useMemo(() => {
    const sa = parseNum(saStr);
    const sm = parseNum(smStr);
    const se = parseNum(seStr);
    const sy = parseNum(syStr);
    const sut = parseNum(sutStr);

    const valid =
      Number.isFinite(sa) &&
      Number.isFinite(sm) &&
      Number.isFinite(se) &&
      Number.isFinite(sy) &&
      Number.isFinite(sut) &&
      sa >= 0 &&
      sm >= 0 &&
      sa + sm > 0 &&
      se > 0 &&
      sy > 0 &&
      sut > 0 &&
      sy <= sut;

    if (!valid) {
      return {
        valid: false,
        nActive: NaN,
        nSoderberg: NaN,
        nGoodman: NaN,
        status: '—',
      };
    }

    // Unit derivation:
    // sigma_a, sigma_m, S_e, S_y, S_ut are all in MPa (N/mm^2).
    // Ratios sigma_a / S_e, sigma_m / S_y, and sigma_m / S_ut are dimensionless (MPa / MPa = 1).
    // Soderberg line: 1 / n_S = (sigma_a / S_e) + (sigma_m / S_y)
    // Goodman line:   1 / n_G = (sigma_a / S_e) + (sigma_m / S_ut)
    const invSoderberg = sa / se + sm / sy;
    const invGoodman = sa / se + sm / sut;
    const nSoderberg = 1 / invSoderberg;
    const nGoodman = 1 / invGoodman;
    const nActive = criterion === 'soderberg' ? nSoderberg : nGoodman;

    // Typical design thresholds (adjust per project specification): n >= 1.5 Safe, n >= 1.0 Marginal
    const status = nActive >= 1.5 ? 'Safe' : nActive >= 1.0 ? 'Marginal' : 'Unsafe';

    return {
      valid: true,
      nActive,
      nSoderberg,
      nGoodman,
      status,
    };
  }, [criterion, saStr, smStr, seStr, syStr, sutStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Bolt Fatigue Life Safety Factor Report',
      '# Standards: ISO 898-1 (Mechanical Properties of Carbon & Alloy Steel Fasteners) | Soderberg & Goodman Mean-Stress Fatigue Relations',
      '# Formula: Soderberg: 1/n_S = sigma_a/Se + sigma_m/Sy | Goodman: 1/n_G = sigma_a/Se + sigma_m/Sut',
      'Criterion,Alternating_Stress_MPa,Mean_Stress_MPa,Endurance_Limit_Se_MPa,Yield_Strength_Sy_MPa,Ultimate_Strength_Sut_MPa,Active_Safety_Factor,Soderberg_Factor,Goodman_Factor,Status',
      `${criterion},${saStr.trim()},${smStr.trim()},${seStr.trim()},${syStr.trim()},${sutStr.trim()},${formatFixed(result.nActive, 3)},${formatFixed(result.nSoderberg, 3)},${formatFixed(result.nGoodman, 3)},${result.status}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-fatigue-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              ISO 898-1 Property Class Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Fatigue Criterion
            </label>
            <select
              data-testid="select-criterion"
              value={criterion}
              onChange={(e) => setCriterion(e.target.value as FatigueCriterion)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              <option value="soderberg">Soderberg Line (Uses Yield Strength Sy)</option>
              <option value="goodman">Goodman Line (Uses Ultimate Strength Sut)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Alternating Stress σ_a (MPa)
            </label>
            <input
              type="text"
              data-testid="input-sa"
              value={saStr}
              onChange={(e) => setSaStr(e.target.value)}
              placeholder="40"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Mean Stress σ_m (MPa)
            </label>
            <input
              type="text"
              data-testid="input-sm"
              value={smStr}
              onChange={(e) => setSmStr(e.target.value)}
              placeholder="320"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">
              Endurance Limit S_e (MPa)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Typical value (accounting for thread notch factor K_f); verify by test data.
            </p>
            <input
              type="text"
              data-testid="input-se"
              value={seStr}
              onChange={(e) => setSeStr(e.target.value)}
              placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
                Yield S_y (MPa)
              </label>
              <input
                type="text"
                data-testid="input-sy"
                value={syStr}
                onChange={(e) => setSyStr(e.target.value)}
                placeholder="640"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
                Ultimate S_ut (MPa)
              </label>
              <input
                type="text"
                data-testid="input-sut"
                value={sutStr}
                onChange={(e) => setSutStr(e.target.value)}
                placeholder="800"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="reset-btn"
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              data-testid="export-csv-btn"
              onClick={handleExportCsv}
              disabled={!result.valid}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                  Active Safety Factor ({criterion === 'soderberg' ? 'Soderberg' : 'Goodman'})
                </div>
                <div data-testid="result-n" className="text-3xl font-black text-blue-700">
                  {formatFixed(result.nActive, 3)}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-2">
                  Assessment Status
                </div>
                <div data-testid="result-status" className="text-3xl font-black text-emerald-700">
                  {result.status}
                </div>
                <div className="text-xs text-emerald-700/80 mt-1">
                  n ≥ 1.5 Safe · n ≥ 1.0 Marginal (typical design values; adjust per project specification)
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Soderberg Safety Factor (n_S)
                </div>
                <div data-testid="result-soderberg" className="text-2xl font-black text-slate-800">
                  {formatFixed(result.nSoderberg, 3)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Goodman Safety Factor (n_G)
                </div>
                <div data-testid="result-goodman" className="text-2xl font-black text-slate-800">
                  {formatFixed(result.nGoodman, 3)}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-700">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Soderberg Line: 1 / n_S = (σ_a / S_e) + (σ_m / S_y) &nbsp;|&nbsp; Goodman Line: 1 / n_G = (σ_a / S_e) + (σ_m / S_ut)
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6">
                Reference: ISO 898-1 fastener property classes (Class 4.6: S_y = 240 MPa, S_ut = 400 MPa; Class 8.8: S_y = 640 MPa, S_ut = 800 MPa; Class 10.9: S_y = 940 MPa, S_ut = 1040 MPa). Status thresholds — Safe (n ≥ 1.5), Marginal (1.0 ≤ n &lt; 1.5), Unsafe (n &lt; 1.0) — are typical design values; adjust per project specification.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
