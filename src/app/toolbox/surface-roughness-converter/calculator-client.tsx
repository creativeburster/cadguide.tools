'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

type InputType = 'Ra' | 'Rz' | 'Rt';

// Conversion ratios (approximate, based on ISO 4287 / DIN 4768)
// Rz ≈ 4× to 10× Ra depending on process; we use the widely accepted Rz ≈ 4.5×Ra for grinding, 6×Ra for milling
// Rt ≈ 1.25× Rz (Rt is the total roughness range)
const RZ_TO_RA = 1 / 4.5;
const RT_TO_RZ = 1 / 1.25;
const RT_TO_RA = RZ_TO_RA * RT_TO_RZ;

// ISO 1302 N-grade mapping based on Ra values
const N_GRADES = [
  { nGrade: 'N12', raMax: 50, raMin: 25 },
  { nGrade: 'N11', raMax: 25, raMin: 12.5 },
  { nGrade: 'N10', raMax: 12.5, raMin: 6.3 },
  { nGrade: 'N9', raMax: 6.3, raMin: 3.2 },
  { nGrade: 'N8', raMax: 3.2, raMin: 1.6 },
  { nGrade: 'N7', raMax: 1.6, raMin: 0.8 },
  { nGrade: 'N6', raMax: 0.8, raMin: 0.4 },
  { nGrade: 'N5', raMax: 0.4, raMin: 0.2 },
  { nGrade: 'N4', raMax: 0.2, raMin: 0.1 },
  { nGrade: 'N3', raMax: 0.1, raMin: 0.05 },
  { nGrade: 'N2', raMax: 0.05, raMin: 0.025 },
  { nGrade: 'N1', raMax: 0.025, raMin: 0.006 },
];

// Manufacturing process capability ranges (Ra in µm)
const PROCESS_RANGES = [
  { process: 'Flame Cutting', raMin: 12.5, raMax: 50, color: '#ef4444' },
  { process: 'Sawing', raMin: 3.2, raMax: 25, color: '#f97316' },
  { process: 'Rough Milling', raMin: 3.2, raMax: 12.5, color: '#f59e0b' },
  { process: 'Fine Milling', raMin: 0.8, raMax: 3.2, color: '#eab308' },
  { process: 'Drilling', raMin: 1.6, raMax: 6.3, color: '#84cc16' },
  { process: 'Turning (Rough)', raMin: 3.2, raMax: 12.5, color: '#f59e0b' },
  { process: 'Turning (Fine)', raMin: 0.4, raMax: 3.2, color: '#22c55e' },
  { process: 'Grinding (Rough)', raMin: 0.8, raMax: 3.2, color: '#eab308' },
  { process: 'Grinding (Fine)', raMin: 0.1, raMax: 0.8, color: '#10b981' },
  { process: 'Lapping', raMin: 0.05, raMax: 0.4, color: '#06b6d4' },
  { process: 'Polishing', raMin: 0.025, raMax: 0.2, color: '#3b82f6' },
  { process: 'EDM', raMin: 1.6, raMax: 12.5, color: '#f97316' },
];

export default function SurfaceRoughnessClient() {
  const [inputType, setInputType] = useState<InputType>('Ra');
  const [inputValue, setInputValue] = useState<number>(1.6);

  const conversions = useMemo(() => {
    let ra: number, rz: number, rt: number;

    switch (inputType) {
      case 'Ra':
        ra = inputValue;
        rz = inputValue / RZ_TO_RA;
        rt = rz / RT_TO_RZ;
        break;
      case 'Rz':
        rz = inputValue;
        ra = inputValue * RZ_TO_RA;
        rt = inputValue / RT_TO_RZ;
        break;
      case 'Rt':
        rt = inputValue;
        rz = inputValue * RT_TO_RZ;
        ra = rz * RZ_TO_RA;
        break;
    }

    const nGrade = N_GRADES.find(n => ra >= n.raMin && ra < n.raMax) || (ra < 0.006 ? { nGrade: 'N1' } : { nGrade: 'N12' });

    return { ra, rz, rt, nGrade: nGrade.nGrade };
  }, [inputType, inputValue]);

  const downloadCsv = () => {
    const csv = [
      ['Surface Roughness Converter Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Input Type', inputType],
      ['Input Value (µm)', inputValue],
      ['', ''],
      ['Converted Values', ''],
      ['Ra (µm)', conversions.ra.toFixed(4)],
      ['Rz (µm)', conversions.rz.toFixed(4)],
      ['Rt (µm)', conversions.rt.toFixed(4)],
      ['ISO N-Grade', conversions.nGrade],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surface-roughness-conversion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Input Value</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Parameter Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Ra', 'Rz', 'Rt'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setInputType(type)}
                  className={`h-12 rounded-xl text-lg font-black border transition-all ${
                    inputType === type
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">{inputType} Value (µm)</label>
            <input
              type="number"
              step="0.01"
              value={inputValue}
              onChange={e => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[0.025, 0.1, 0.4, 0.8, 1.6, 3.2, 6.3, 12.5, 25].map(v => (
                <button
                  key={v}
                  onClick={() => { setInputValue(v); setInputType('Ra'); }}
                  className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all"
                >
                  Ra {v}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-base font-bold text-blue-600">ISO N-Grade</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{conversions.nGrade}</p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Converted Values</h2>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {([
                { label: 'Ra', value: conversions.ra, desc: 'Arithmetic Mean', highlight: inputType === 'Ra' },
                { label: 'Rz', value: conversions.rz, desc: 'Mean Roughness Depth', highlight: inputType === 'Rz' },
                { label: 'Rt', value: conversions.rt, desc: 'Total Roughness Range', highlight: inputType === 'Rt' },
              ]).map(item => (
                <div
                  key={item.label}
                  className={`rounded-2xl p-6 border transition-all ${
                    item.highlight ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`text-2xl font-black ${item.highlight ? 'text-blue-600' : 'text-slate-900'}`}>
                    {item.value.toFixed(4)}
                    <span className="text-base text-slate-400 font-bold ml-1">µm</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-1 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-base">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-black text-slate-400 uppercase tracking-wider text-sm mb-2">Conversion Factors</p>
                <p className="text-slate-600 font-medium">Rz ≈ 4.5 × Ra (grinding)</p>
                <p className="text-slate-600 font-medium">Rt ≈ 1.25 × Rz</p>
                <p className="text-slate-600 font-medium">Rz ≈ 6 × Ra (milling)</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-black text-slate-400 uppercase tracking-wider text-sm mb-2">ISO 1302 Symbol</p>
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 60 40" className="w-16 h-10">
                    <path d="M 5 30 L 25 30 L 35 10 L 55 10" fill="none" stroke="#1e40af" strokeWidth="2" />
                    <text x="30" y="28" className="fill-blue-600 text-sm font-bold">{conversions.nGrade}</text>
                  </svg>
                  <p className="text-slate-600 font-medium">Surface lay symbol with N-grade</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Capability Chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Manufacturing Process Capability (Ra range)</h3>
            <div className="space-y-2">
              {PROCESS_RANGES.map(p => {
                const isInRange = conversions.ra >= p.raMin && conversions.ra <= p.raMax;
                // Log scale positioning: map 0.025–50 to 0–100%
                const logMin = Math.log10(0.025);
                const logMax = Math.log10(50);
                const leftPct = ((Math.log10(p.raMin) - logMin) / (logMax - logMin)) * 100;
                const widthPct = ((Math.log10(p.raMax) - Math.log10(p.raMin)) / (logMax - logMin)) * 100;
                return (
                  <div key={p.process} className="flex items-center gap-3">
                    <span className="text-base font-bold text-slate-600 w-28 shrink-0">{p.process}</span>
                    <div className="flex-1 relative h-7 bg-slate-50 rounded-lg">
                      <div
                        className={`absolute h-full rounded-lg flex items-center justify-center text-[9px] font-black text-white transition-all ${isInRange ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: p.color, opacity: isInRange ? 1 : 0.5 }}
                      >
                        {p.raMin}–{p.raMax}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-sm font-bold text-slate-400">
              <span>0.025</span><span>0.1</span><span>0.4</span><span>1.6</span><span>6.3</span><span>25</span><span>50 µm</span>
            </div>
            <p className="text-sm text-slate-400 mt-2 font-medium">Highlighted processes can achieve your target Ra of {conversions.ra.toFixed(3)} µm.</p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
