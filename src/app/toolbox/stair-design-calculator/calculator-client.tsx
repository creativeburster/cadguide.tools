'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

type UnitMode = 'metric' | 'imperial';

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

const DEFAULT_METRIC = ['2800', '175', '280', '190', '250'];
const DEFAULT_IMPERIAL = ['108', '7.25', '11', '7.75', '10'];

export default function StairDesignCalculatorClient() {
  const [unit, setUnit] = useState<UnitMode>('metric');
  const [inputs, setInputs] = useState<string[]>(DEFAULT_METRIC);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const switchUnit = (nextUnit: UnitMode) => {
    if (nextUnit === unit) return;
    setUnit(nextUnit);
    setInputs(nextUnit === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const resetDefaults = () => {
    setUnit('metric');
    setInputs(DEFAULT_METRIC);
  };

  const unitLabel = unit === 'metric' ? 'mm' : 'in';

  const result = useMemo(() => {
    const totalRise = parseFinite(inputs[0]);
    const idealRiser = parseFinite(inputs[1]);
    const tread = parseFinite(inputs[2]);
    const maxRiserLimit = parseFinite(inputs[3]);
    const minTreadLimit = parseFinite(inputs[4]);

    if (totalRise === null || idealRiser === null || tread === null || maxRiserLimit === null || minTreadLimit === null) {
      return { valid: false as const, error: 'Enter numeric values in all stair geometry and user limit fields.' };
    }
    if (totalRise <= 0 || idealRiser <= 0 || tread <= 0 || maxRiserLimit <= 0 || minTreadLimit <= 0) {
      return { valid: false as const, error: 'All stair dimensions and user riser/tread limits must be > 0.' };
    }
    if (idealRiser > totalRise) {
      return { valid: false as const, error: 'Target ideal riser cannot exceed total floor-to-floor rise.' };
    }

    const numRisers = Math.max(1, Math.ceil(totalRise / idealRiser));
    const actualRiser = totalRise / numRisers;
    const numTreads = Math.max(1, numRisers - 1);
    const totalRun = numTreads * tread;
    const angleDeg = (Math.atan(actualRiser / tread) * 180) / Math.PI;
    const blondel = 2 * actualRiser + tread;
    const stringer = Math.hypot(totalRise, totalRun);

    const riserOk = actualRiser <= maxRiserLimit;
    const treadOk = tread >= minTreadLimit;
    const withinUserLimits = riserOk && treadOk;

    return {
      valid: true as const,
      totalRise,
      idealRiser,
      tread,
      maxRiserLimit,
      minTreadLimit,
      numRisers,
      actualRiser,
      numTreads,
      totalRun,
      angleDeg,
      blondel,
      stringer,
      riserOk,
      treadOk,
      withinUserLimits,
    };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Staircase Geometry & Blondel Proportion Report',
      `# Unit System: ${unit} (${unitLabel}) ; Formulas: nR = ceil(rise/idealRiser), R = rise/nR, nT = nR-1, run = nT*T, 2R+T, stringer = hypot(rise,run)`,
      'Parameter,Value,Unit',
      `Total Floor-to-Floor Rise,${result.totalRise},${unitLabel}`,
      `Target Ideal Riser,${result.idealRiser},${unitLabel}`,
      `Tread Run Depth T,${result.tread},${unitLabel}`,
      `User Max Riser Limit,${result.maxRiserLimit},${unitLabel}`,
      `User Min Tread Limit,${result.minTreadLimit},${unitLabel}`,
      `Number of Risers nR,${result.numRisers},risers`,
      `Actual Riser Height R,${result.actualRiser.toFixed(6)},${unitLabel}`,
      `Number of Treads nT,${result.numTreads},treads`,
      `Total Horizontal Run,${result.totalRun.toFixed(6)},${unitLabel}`,
      `Pitch Angle,${result.angleDeg.toFixed(6)},deg`,
      `Blondel Step Formula (2R + T),${result.blondel.toFixed(6)},${unitLabel}`,
      `Diagonal Stringer Length,${result.stringer.toFixed(6)},${unitLabel}`,
      `User Limits Check,${result.withinUserLimits ? 'PASS' : 'CHECK_LIMITS'},-`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stair-design-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
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

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              data-testid="unit-metric"
              onClick={() => switchUnit('metric')}
              className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer ${
                unit === 'metric' ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Metric (mm)
            </button>
            <button
              type="button"
              data-testid="unit-imperial"
              onClick={() => switchUnit('imperial')}
              className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer ${
                unit === 'imperial' ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Imperial (in)
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Total Rise ({unitLabel})</label>
              <input type="text" data-testid="input-rise" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Target Ideal Riser ({unitLabel})</label>
              <input type="text" data-testid="input-ideal-riser" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Tread Run Depth T ({unitLabel})</label>
              <input type="text" data-testid="input-tread" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Max Riser ({unitLabel})</label>
                <input type="text" data-testid="input-max-riser" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Min Tread ({unitLabel})</label>
                <input type="text" data-testid="input-min-tread" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Stair Geometry</h2>
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
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Actual Riser R ({result.valid ? result.numRisers : '-'} steps)</div>
                <div data-testid="output-riser-h" className="text-2xl font-black text-orange-900">
                  {result.valid ? result.actualRiser.toFixed(3) : '—'}
                  {result.valid && <span className="text-base text-orange-600 ml-1">{unitLabel}</span>}
                </div>
                <div data-testid="output-risers" className="text-xs font-bold text-orange-700 mt-1">
                  {result.valid ? `${result.numRisers} risers` : '—'}
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Total Horizontal Run</div>
                <div data-testid="output-run" className="text-2xl font-black text-blue-900">
                  {result.valid ? result.totalRun.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-blue-600 ml-1">{unitLabel}</span>}
                </div>
                <div data-testid="output-treads" className="text-xs font-bold text-blue-700 mt-1">
                  {result.valid ? `${result.numTreads} treads` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Pitch Angle</div>
                <div data-testid="output-angle" className="text-2xl font-black text-slate-800">
                  {result.valid ? result.angleDeg.toFixed(3) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">deg</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Blondel Step (2R + T)</div>
                <div data-testid="output-blondel" className="text-2xl font-black text-green-900">
                  {result.valid ? result.blondel.toFixed(3) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">{unitLabel}</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Stringer Length</div>
                <div data-testid="output-stringer" className="text-2xl font-black text-slate-800">
                  {result.valid ? result.stringer.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">{unitLabel}</span>}
                </div>
              </div>
              <div className={`rounded-2xl p-5 border ${result.valid && result.withinUserLimits ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">User Threshold Check</div>
                <div data-testid="output-status" className={`text-lg font-black ${result.valid && result.withinUserLimits ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {result.valid ? (result.withinUserLimits ? 'Within User Limits' : 'Exceeds User Limits') : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Ergonomic proportion 2R + T originated with Nicolas-Francois Blondel in <em>Cours d&apos;architecture</em> (1675&ndash;1683) (Wikipedia:{' '}
                  <a href="https://en.wikipedia.org/wiki/Stairs" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                    Stairs
                  </a>
                  ). Configure max riser and min tread thresholds to verify compliance with your local building authority code.
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
