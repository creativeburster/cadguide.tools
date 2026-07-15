'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, ArrowRight } from 'lucide-react';

type Scale = 'HRC' | 'HRB' | 'HV' | 'HB';

const CONVERSION_TABLE: { HRC: number; HV: number; HB: number; HRB: number | null; tensile: number | null }[] = [
  { HRC: 65, HV: 856, HB: 739, HRB: null, tensile: null },
  { HRC: 60, HV: 697, HB: 600, HRB: null, tensile: 2160 },
  { HRC: 55, HV: 595, HB: 512, HRB: null, tensile: 1835 },
  { HRC: 50, HV: 513, HB: 441, HRB: null, tensile: 1580 },
  { HRC: 45, HV: 449, HB: 385, HRB: null, tensile: 1380 },
  { HRC: 40, HV: 394, HB: 337, HRB: null, tensile: 1215 },
  { HRC: 35, HV: 345, HB: 296, HRB: null, tensile: 1060 },
  { HRC: 30, HV: 302, HB: 259, HRB: null, tensile: 930 },
  { HRC: 25, HV: 266, HB: 228, HRB: null, tensile: 820 },
  { HRC: 20, HV: 234, HB: 200, HRB: null, tensile: 720 },
  { HRC: 15, HV: 207, HB: 177, HRB: 100, tensile: 640 },
  { HRC: 10, HV: 184, HB: 158, HRB: 97, tensile: 560 },
  { HRC: 5, HV: 164, HB: 141, HRB: 93, tensile: 490 },
  { HRC: 0, HV: 147, HB: 126, HRB: 88, tensile: 430 },
  { HRC: -5, HV: 130, HB: 112, HRB: 82, tensile: 380 },
  { HRC: -10, HV: 115, HB: 99, HRB: 75, tensile: 340 },
];

function interpolate(x: number, xArr: number[], yArr: number[]): number {
  if (x <= xArr[0]) return yArr[0];
  if (x >= xArr[xArr.length - 1]) return yArr[yArr.length - 1];
  for (let i = 0; i < xArr.length - 1; i++) {
    if (x >= xArr[i] && x <= xArr[i + 1]) {
      const t = (x - xArr[i]) / (xArr[i + 1] - xArr[i]);
      return yArr[i] + t * (yArr[i + 1] - yArr[i]);
    }
  }
  return yArr[0];
}

export default function HardnessConverterClient() {
  const [inputScale, setInputScale] = useState<Scale>('HRC');
  const [inputValue, setInputValue] = useState(45);

  const result = useMemo(() => {
    const hrcArr = CONVERSION_TABLE.map(r => r.HRC);
    const hvArr = CONVERSION_TABLE.map(r => r.HV);
    const hbArr = CONVERSION_TABLE.map(r => r.HB);
    const tensileArr = CONVERSION_TABLE.map(r => r.tensile ?? 0);

    let hrc: number;
    if (inputScale === 'HRC') {
      hrc = inputValue;
    } else if (inputScale === 'HV') {
      hrc = interpolate(inputValue, [...hvArr].reverse(), [...hrcArr].reverse());
    } else if (inputScale === 'HB') {
      hrc = interpolate(inputValue, [...hbArr].reverse(), [...hrcArr].reverse());
    } else {
      const hrbArr = CONVERSION_TABLE.map(r => r.HRB ?? 0);
      hrc = interpolate(inputValue, [...hrbArr].reverse(), [...hrcArr].reverse());
    }

    const hv = interpolate(hrc, hrcArr, hvArr);
    const hb = interpolate(hrc, hrcArr, hbArr);
    const tensile = interpolate(hrc, hrcArr, tensileArr);
    const hrb = hrc < 15 ? interpolate(hrc, hrcArr, CONVERSION_TABLE.map(r => r.HRB ?? 0)) : null;

    return { hrc, hv, hb, hrb, tensile };
  }, [inputScale, inputValue]);

  const scales: { id: Scale; name: string }[] = [
    { id: 'HRC', name: 'Rockwell C' },
    { id: 'HV', name: 'Vickers' },
    { id: 'HB', name: 'Brinell' },
    { id: 'HRB', name: 'Rockwell B' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Input</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Hardness Scale</label>
            <div className="grid grid-cols-2 gap-2">
              {scales.map(s => (
                <button key={s.id} onClick={() => setInputScale(s.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${inputScale === s.id ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Value ({inputScale})</label>
            <input type="number" step="0.1" value={inputValue} onChange={e => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Converted Values</h2>

            <div className="space-y-3">
              {[
                { label: 'Rockwell C (HRC)', value: result.hrc, unit: 'HRC', color: 'blue' },
                { label: 'Vickers (HV)', value: result.hv, unit: 'HV', color: 'purple' },
                { label: 'Brinell (HB)', value: result.hb, unit: 'HB', color: 'orange' },
                { label: 'Rockwell B (HRB)', value: result.hrb, unit: 'HRB', color: 'teal' },
                { label: 'Est. Tensile Strength', value: result.tensile, unit: 'N/mm²', color: 'red' },
              ].map(r => (
                <div key={r.label} className={`flex items-center justify-between rounded-2xl p-4 border ${
                  r.value === null ? 'bg-slate-50 border-slate-100 opacity-50' :
                  r.color === 'blue' ? 'bg-blue-50 border-blue-100' :
                  r.color === 'purple' ? 'bg-purple-50 border-purple-100' :
                  r.color === 'orange' ? 'bg-orange-50 border-orange-100' :
                  r.color === 'teal' ? 'bg-teal-50 border-teal-100' :
                  'bg-red-50 border-red-100'
                }`}>
                  <span className="text-sm font-black text-slate-700">{r.label}</span>
                  <span className="text-xl font-black text-slate-900">
                    {r.value === null ? 'N/A' : r.value < 100 ? r.value.toFixed(1) : r.value.toFixed(0)}
                    <span className="text-sm text-slate-400 ml-1">{r.unit}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Conversions are approximate for carbon and alloy steels. Actual values may vary by material composition, test method, and specimen preparation. Tensile strength estimate: σu ≈ 3.45 × HB (for steel).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
