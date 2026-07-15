'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download, Gauge, ArrowRight } from 'lucide-react';

type GearType = 'spur' | 'planetary';

export default function GearRatioClient() {
  const [gearType, setGearType] = useState<GearType>('spur');
  const [inputRPM, setInputRPM] = useState(1800);
  const [inputTorque, setInputTorque] = useState(50);
  const [efficiency, setEfficiency] = useState(98);

  // Spur gear
  const [driverTeeth, setDriverTeeth] = useState(20);
  const [drivenTeeth, setDrivenTeeth] = useState(60);
  const [module, setModule] = useState(2.0);

  // Planetary
  const [sunTeeth, setSunTeeth] = useState(18);
  const [ringTeeth, setRingTeeth] = useState(54);

  const result = useMemo(() => {
    let ratio = 1;
    let outputRPM = inputRPM;
    let outputTorque = inputTorque;
    let centerDistance = 0;

    if (gearType === 'spur') {
      ratio = drivenTeeth / driverTeeth;
      outputRPM = inputRPM / ratio;
      outputTorque = inputTorque * ratio * (efficiency / 100);
      centerDistance = module * (driverTeeth + drivenTeeth) / 2;
    } else {
      // Planetary: sun input, carrier output, ring fixed
      ratio = 1 + ringTeeth / sunTeeth;
      outputRPM = inputRPM / ratio;
      outputTorque = inputTorque * ratio * (efficiency / 100);
    }

    return {
      ratio,
      outputRPM,
      outputTorque,
      centerDistance,
      reduction: ratio > 1 ? `${ratio.toFixed(3)}:1 reduction` : `${(1/ratio).toFixed(3)}:1 overdrive`,
    };
  }, [gearType, inputRPM, inputTorque, efficiency, driverTeeth, drivenTeeth, module, sunTeeth, ringTeeth]);

  const downloadReport = () => {
    const lines = [
      ['Gear Ratio Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Gear Type', gearType],
      ['Input Speed (RPM)', inputRPM],
      ['Input Torque (Nm)', inputTorque],
      ['Efficiency (%)', efficiency],
      ['', ''],
      gearType === 'spur' ? ['Driver Teeth', driverTeeth] : ['Sun Teeth', sunTeeth],
      gearType === 'spur' ? ['Driven Teeth', drivenTeeth] : ['Ring Teeth', ringTeeth],
      ['', ''],
      ['Gear Ratio', result.ratio.toFixed(4)],
      ['Output Speed (RPM)', result.outputRPM.toFixed(2)],
      ['Output Torque (Nm)', result.outputTorque.toFixed(2)],
      gearType === 'spur' ? ['Center Distance (mm)', result.centerDistance.toFixed(2)] : ['', ''],
    ];
    const csv = lines.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gear-ratio-report.csv';
    a.click();
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Gear Type</label>
            <div className="grid grid-cols-2 gap-2">
              {([['spur', 'Spur Pair'], ['planetary', 'Planetary']] as const).map(([id, label]) => (
                <button key={id} onClick={() => setGearType(id)}
                  className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${gearType === id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Input Speed (RPM)</label>
            <input type="number" value={inputRPM} onChange={e => setInputRPM(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Input Torque (Nm)</label>
            <input type="number" value={inputTorque} onChange={e => setInputTorque(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Efficiency (%)</label>
            <input type="number" value={efficiency} onChange={e => setEfficiency(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          {gearType === 'spur' ? (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Driver Teeth (z₁)</label>
                <input type="number" value={driverTeeth} onChange={e => setDriverTeeth(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Driven Teeth (z₂)</label>
                <input type="number" value={drivenTeeth} onChange={e => setDrivenTeeth(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Module (mm)</label>
                <input type="number" step="0.1" value={module} onChange={e => setModule(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Sun Teeth (zₛ)</label>
                <input type="number" value={sunTeeth} onChange={e => setSunTeeth(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Ring Teeth (zᵣ)</label>
                <input type="number" value={ringTeeth} onChange={e => setRingTeeth(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div className="text-base text-slate-400 font-medium bg-slate-50 rounded-xl p-3 border border-slate-100">
                Ring fixed, sun input, carrier output. Planet teeth = (ring - sun) / 2 = {((ringTeeth - sunTeeth) / 2).toFixed(0)} teeth.
              </div>
            </>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Gauge className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button onClick={downloadReport} className="flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Gear Ratio</div>
                <div className="text-3xl font-black text-blue-700">{result.ratio.toFixed(3)}<span className="text-lg text-blue-400">:1</span></div>
                <div className="text-base text-blue-600 font-medium mt-1">{result.reduction}</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Output Speed</div>
                <div className="text-3xl font-black text-green-700">{result.outputRPM.toFixed(1)}<span className="text-lg text-green-400"> RPM</span></div>
                <div className="text-base text-green-600 font-medium mt-1">From {inputRPM} RPM input</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Output Torque</div>
                <div className="text-3xl font-black text-orange-700">{result.outputTorque.toFixed(1)}<span className="text-lg text-orange-400"> Nm</span></div>
                <div className="text-base text-orange-600 font-medium mt-1">From {inputTorque} Nm input</div>
              </div>
              {gearType === 'spur' && (
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Center Distance</div>
                  <div className="text-3xl font-black text-purple-700">{result.centerDistance.toFixed(1)}<span className="text-lg text-purple-400"> mm</span></div>
                  <div className="text-base text-purple-600 font-medium mt-1">a = m(z₁+z₂)/2</div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {gearType === 'spur'
                  ? 'Ratio = z₂/z₁. Output RPM = Input RPM / Ratio. Output Torque = Input Torque × Ratio × Efficiency. Center distance = m × (z₁ + z₂) / 2.'
                  : 'Planetary ratio (ring fixed) = 1 + zᵣ/zₛ. Output RPM = Input RPM / Ratio. Output Torque = Input Torque × Ratio × Efficiency.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
