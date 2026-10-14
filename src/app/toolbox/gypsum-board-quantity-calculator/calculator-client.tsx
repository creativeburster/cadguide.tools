'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function GypsumBoardQuantityCalculatorClient() {
  const [inputs, setInputs] = useState(["50","12","10"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const A = parseFloat(inputs[0]) || 0; // Surface area in m²
    const th = parseFloat(inputs[1]) || 12.5; // Board thickness in mm
    const waste = (parseFloat(inputs[2]) || 10) / 100;

    const sheetArea = 1.2 * 2.4; // 2.88 m² standard sheet
    const N = Math.ceil((A * (1 + waste)) / sheetArea);

    // Fastener density & screw sizing by board thickness (ASTM C840 / GA-216):
    // Standard boards (<=12.5mm) use 25mm (1") screws at ~30 screws/sheet
    // Fire/Thick boards (>12.5mm) require 32mm (1-1/4") screws with tighter spacing (~36 screws/sheet)
    const screwsPerSheet = th > 13 ? 36 : 30;
    const screwSpec = th > 13 ? '32mm (1-1/4") Bugle Head' : '25mm (1") Bugle Head';
    const screws = N * screwsPerSheet;

    // Joint tape per sheet perimeter perimeter contact (~5.5m per sheet)
    const tape = Math.ceil(N * 5.2);

    // Dead load weight estimation (density ~ 780 kg/m³ for gypsum core):
    const areaDensityKgM2 = th * 0.78;
    const totalWeightKg = Math.round(N * sheetArea * areaDensityKgM2);

    return { N, screws, tape, totalWeightKg, screwSpec, th };
  }, [inputs]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(6);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Area (m2)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="50"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Board Thickness (mm)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="12"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Waste Factor (%)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="10"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["50","12","10"])}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Total Sheets (1.2×2.4m)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.N)}<span className="text-lg text-blue-400"> sheets</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Drywall Screws</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.screws)}<span className="text-lg text-green-400"> pcs</span></div>
                <div className="text-xs text-green-600 font-medium mt-1">{result.screwSpec}</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Joint Compound Tape</div>
                <div className="text-3xl font-black text-orange-700">{formatNum(result.tape)}<span className="text-lg text-orange-400"> m</span></div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Estimated Dead Load</div>
                <div className="text-3xl font-black text-purple-700">{formatNum(result.totalWeightKg)}<span className="text-lg text-purple-400"> kg</span></div>
                <div className="text-xs text-purple-600 font-medium mt-1">For {result.th}mm thickness</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                N = ceil(A · (1 + waste) / 2.88m²) • Screws & dead weight calculated per ASTM C840 / GA-216 specifications
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
