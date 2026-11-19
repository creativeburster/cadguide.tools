'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

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

const DEFAULT_INPUTS = ['800', '150', '300', '300', '0.85'];

export default function SpindlePowerCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const Fc = parseFinite(inputs[0]);
    const vc = parseFinite(inputs[1]);
    const Ff = parseFinite(inputs[2]);
    const vfMmMin = parseFinite(inputs[3]);
    const eta = parseFinite(inputs[4]);

    if (Fc === null || vc === null || Ff === null || vfMmMin === null || eta === null) {
      return { valid: false as const, error: 'Enter numeric values for cutting/feed forces, velocities, and drivetrain efficiency.' };
    }
    if (Fc < 0 || vc < 0 || Ff < 0 || vfMmMin < 0 || eta <= 0 || eta > 1) {
      return { valid: false as const, error: 'Forces and speeds must be >= 0; efficiency eta must be in (0, 1].' };
    }

    const PcNet = (Fc * vc) / 60000;
    const Pc = PcNet / eta;
    const vfMMin = vfMmMin / 1000;
    const Pf = (Ff * vfMMin) / (60000 * eta);
    const Pt = Pc + Pf;

    return { valid: true as const, Fc, vc, Ff, vfMmMin, eta, PcNet, Pc, Pf, Pt };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# CNC Spindle Cutting & Feed Power Report',
      '# Formulas: Pc_net = Fc*vc/60000, Pc = Pc_net/eta, Pf = Ff*(vf/1000)/(60000*eta), Pt = Pc + Pf',
      'Parameter,Value,Unit',
      `Tangential Cutting Force Fc,${result.Fc},N`,
      `Cutting Surface Speed vc,${result.vc},m/min`,
      `Feed Force Ff,${result.Ff},N`,
      `Linear Feed Rate vf,${result.vfMmMin},mm/min`,
      `Drivetrain Efficiency eta,${result.eta},-`,
      `Net Cutting Power Pc_net,${result.PcNet.toFixed(6)},kW`,
      `Motor Spindle Power Pc,${result.Pc.toFixed(6)},kW`,
      `Axis Feed Power Pf,${result.Pf.toFixed(6)},kW`,
      `Total Required Power Pt,${result.Pt.toFixed(6)},kW`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spindle-power-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Tangential Cutting Force Fc (N)</label>
            <input type="text" data-testid="input-fc" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Cutting Speed vc (m/min)</label>
            <input type="text" data-testid="input-vc" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Feed Force Ff (N)</label>
              <input type="text" data-testid="input-ff" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Feed Rate vf (mm/min)</label>
              <input type="text" data-testid="input-vf" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Spindle Efficiency &eta; (0&ndash;1)</label>
            <input type="text" data-testid="input-eta" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Motor Cutting Power (Pc)</div>
                <div data-testid="output-pc" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.Pc) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">kW</span>}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Total Required Power (Pt)</div>
                <div data-testid="output-pt" className="text-3xl font-black text-orange-800">
                  {result.valid ? formatNum(result.Pt) : '—'}
                  {result.valid && <span className="text-lg text-orange-600 ml-1">kW</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Net Cutting Power (Pc_net)</div>
                <div data-testid="output-pc-net" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.PcNet) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">kW</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Axis Feed Power (Pf)</div>
                <div data-testid="output-pf" className="text-2xl font-black text-green-800">
                  {result.valid ? formatNum(result.Pf) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">kW</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Mechanical power relation: Pc = (Fc &middot; vc) / (60000 &middot; &eta;), Pf = (Ff &middot; vf / 1000) / (60000 &middot; &eta;), Pt = Pc + Pf.
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
