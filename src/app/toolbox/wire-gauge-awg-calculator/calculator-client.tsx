'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info } from 'lucide-react';

const AWG_TABLE: { awg: string; diameter: number; ampacityCu: number; ampacityAl: number }[] = [
  { awg: '4/0', diameter: 11.684, ampacityCu: 310, ampacityAl: 240 },
  { awg: '3/0', diameter: 10.403, ampacityCu: 262, ampacityAl: 200 },
  { awg: '2/0', diameter: 9.266, ampacityCu: 225, ampacityAl: 170 },
  { awg: '1/0', diameter: 8.252, ampacityCu: 195, ampacityAl: 150 },
  { awg: '1', diameter: 7.348, ampacityCu: 165, ampacityAl: 125 },
  { awg: '2', diameter: 6.544, ampacityCu: 140, ampacityAl: 105 },
  { awg: '4', diameter: 5.189, ampacityCu: 105, ampacityAl: 80 },
  { awg: '6', diameter: 4.115, ampacityCu: 75, ampacityAl: 55 },
  { awg: '8', diameter: 3.264, ampacityCu: 55, ampacityAl: 40 },
  { awg: '10', diameter: 2.588, ampacityCu: 40, ampacityAl: 30 },
  { awg: '12', diameter: 2.053, ampacityCu: 30, ampacityAl: 22 },
  { awg: '14', diameter: 1.628, ampacityCu: 20, ampacityAl: 15 },
  { awg: '16', diameter: 1.291, ampacityCu: 13, ampacityAl: 10 },
  { awg: '18', diameter: 1.024, ampacityCu: 9, ampacityAl: 7 },
  { awg: '20', diameter: 0.812, ampacityCu: 6, ampacityAl: 5 },
  { awg: '22', diameter: 0.644, ampacityCu: 4, ampacityAl: 3 },
  { awg: '24', diameter: 0.511, ampacityCu: 2.5, ampacityAl: 2 },
];

export default function WireGaugeClient() {
  const [awgIdx, setAwgIdx] = useState(10);
  const [material, setMaterial] = useState<'copper' | 'aluminum'>('copper');

  const result = useMemo(() => {
    const entry = AWG_TABLE[awgIdx];
    const D = entry.diameter;
    const area = Math.PI * D * D / 4;
    const rhoCu = 0.01724;
    const rhoAl = 0.0282;
    const rho = material === 'copper' ? rhoCu : rhoAl;
    const resistance = rho / area * 1000;
    const ampacity = material === 'copper' ? entry.ampacityCu : entry.ampacityAl;

    return { D, area, resistance, ampacity, label: `AWG ${entry.awg}` };
  }, [awgIdx, material]);


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">AWG Size</label>
            <select value={awgIdx} onChange={e => setAwgIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold">
              {AWG_TABLE.map((r, i) => (
                <option key={i} value={i}>AWG {r.awg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Conductor Material</label>
            <div className="grid grid-cols-2 gap-2">
              {(['copper', 'aluminum'] as const).map(m => (
                <button key={m} onClick={() => setMaterial(m)}
                  className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${material === m ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                  {m === 'copper' ? 'Copper' : 'Aluminum'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-base text-slate-400 font-medium bg-slate-50 rounded-xl p-3 border border-slate-100">
            AWG formula: D = 0.127 × 92^((36-AWG)/39) mm. Each 3-gauge decrease doubles the cross-sectional area.
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Results — {result.label}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Diameter</div>
                <div className="text-3xl font-black text-orange-700">{result.D.toFixed(3)}<span className="text-lg text-orange-400"> mm</span></div>
                <div className="text-base text-orange-600 font-medium mt-1">{(result.D / 25.4).toFixed(4)} in</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Cross-Section Area</div>
                <div className="text-3xl font-black text-blue-700">{result.area.toFixed(3)}<span className="text-lg text-blue-400"> mm²</span></div>
                <div className="text-base text-blue-600 font-medium mt-1">{(result.area * 1973).toFixed(0)} cmil</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Resistance</div>
                <div className="text-3xl font-black text-purple-700">{result.resistance.toFixed(4)}<span className="text-lg text-purple-400"> Ω/km</span></div>
                <div className="text-base text-purple-600 font-medium mt-1">{(result.resistance / 3.281).toFixed(5)} Ω/ft</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-base font-black text-red-400 uppercase tracking-wider mb-2">Ampacity (60°C)</div>
                <div className="text-3xl font-black text-red-700">{result.ampacity}<span className="text-lg text-red-400"> A</span></div>
                <div className="text-base text-red-600 font-medium mt-1">NEC Table 310.16 (approx.)</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'AWG: American Wire Gauge. Smaller number = thicker wire. Each 3 AWG decrease doubles area. Each 6 AWG decrease doubles diameter. Ampacity values are approximate for 60°C rated insulation in free air — consult NEC for specific installations.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
