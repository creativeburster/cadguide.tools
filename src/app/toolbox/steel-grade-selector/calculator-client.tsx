'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function SteelGradeSelectorClient() {
  const [inputs, setInputs] = useState(["Q235","16"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const props: { [key: string]: { Sy: number; Su: number; el: number } } = {
      'Q235': { Sy: 235, Su: 375, el: 26 },
      'Q355': { Sy: 355, Su: 510, el: 22 }, // GB/T 1591-2018 current standard
      'Q345': { Sy: 345, Su: 510, el: 21 }, // Legacy GB
      'Q390': { Sy: 390, Su: 530, el: 20 },
      'Q420': { Sy: 420, Su: 580, el: 19 },
      'S235JR': { Sy: 235, Su: 360, el: 26 }, // EN 10025-2
      'S355JR': { Sy: 355, Su: 510, el: 22 }, // EN 10025-2
      'A36': { Sy: 250, Su: 400, el: 23 },
      'A572': { Sy: 345, Su: 450, el: 21 },
      'A992': { Sy: 345, Su: 450, el: 21 }, // Modern structural wide-flange
      'SS400': { Sy: 245, Su: 400, el: 21 }, // JIS G3101
    };
    const grade = (inputs[0] || 'Q235').toUpperCase().trim();
    const t = parseFloat(inputs[1]) || 16;
    const p = props[grade] || props['Q235'];
    
    // Engineering thickness reduction factor per GB 50017 / Eurocode 3
    let factor = 1.0;
    if (t > 63) factor = 0.88;
    else if (t > 40) factor = 0.91;
    else if (t > 16) factor = 0.95;

    return { Sy: p.Sy * factor, Su: p.Su, el: p.el };
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
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Steel Grade</label>
            <select value={inputs[0]} onChange={e => updateInput(0, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all">
              <option value="Q235">Q235 (GB/T 700 - fy=235 MPa, fu=375 MPa)</option>
              <option value="Q355">Q355 (GB/T 1591-2018 - fy=355 MPa, fu=510 MPa)</option>
              <option value="Q345">Q345 (Legacy GB - fy=345 MPa, fu=510 MPa)</option>
              <option value="Q390">Q390 (GB/T 1591 - fy=390 MPa, fu=530 MPa)</option>
              <option value="Q420">Q420 (GB/T 1591 - fy=420 MPa, fu=580 MPa)</option>
              <option value="S235JR">EN 10025-2 S235JR (fy=235 MPa, fu=360 MPa)</option>
              <option value="S355JR">EN 10025-2 S355JR (fy=355 MPa, fu=510 MPa)</option>
              <option value="A36">ASTM A36 (fy=250 MPa, fu=400 MPa)</option>
              <option value="A572">ASTM A572 Gr50 (fy=345 MPa, fu=450 MPa)</option>
              <option value="A992">ASTM A992 (fy=345 MPa, fu=450 MPa)</option>
              <option value="SS400">JIS G3101 SS400 (fy=245 MPa, fu=400 MPa)</option>
            </select>
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Thickness (mm)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="16"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["Q235","16"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Yield Strength</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.Sy)}<span className="text-lg text-blue-400"> MPa</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Tensile Strength</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.Su)}<span className="text-lg text-green-400"> MPa</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Elongation</div>
                <div className="text-3xl font-black text-orange-700">{formatNum(result.el)}<span className="text-lg text-orange-400"> %</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Properties from grade lookup table
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
