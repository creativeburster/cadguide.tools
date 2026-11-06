'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, Gauge, RotateCw } from 'lucide-react';

const COMMON_LEAD_PRESETS = [
  { label: '5 mm (Fine Pitch / Precision)', lead: '5' },
  { label: '10 mm (Standard Industrial)', lead: '10' },
  { label: '20 mm (High Speed Linear)', lead: '20' },
  { label: '25 mm (Fast Positioning)', lead: '25' },
];

export default function BallScrewCalculatorClient() {
  const [axialLoad, setAxialLoad] = useState('5000'); // N
  const [lead, setLead] = useState('10'); // mm
  const [forwardEta, setForwardEta] = useState('0.9'); // forward efficiency
  const [backEta, setBackEta] = useState('0.8'); // backdrive efficiency
  const [speedRpm, setSpeedRpm] = useState('1000'); // RPM

  const results = useMemo(() => {
    const F = Math.max(0, parseFloat(axialLoad) || 0); // N
    const l_mm = Math.max(0.1, parseFloat(lead) || 10); // mm
    const l_m = l_mm / 1000; // meters
    const eta1 = Math.min(0.99, Math.max(0.1, parseFloat(forwardEta) || 0.9)); // forward
    const eta2 = Math.min(0.99, Math.max(0.1, parseFloat(backEta) || 0.8)); // backdrive
    const n = Math.max(0, parseFloat(speedRpm) || 0); // RPM

    // Drive Torque T1 (Nm): T = F * lead / (2 * pi * eta1)
    const driveTorque = (F * l_m) / (2 * Math.PI * eta1);

    // Drive Power P (W): P = T * omega = T * (2 * pi * n / 60)
    const drivePower = (driveTorque * 2 * Math.PI * n) / 60;

    // Backdriving Torque Tb (Nm): Tb = (F * lead * eta2) / (2 * pi)
    // Note: Backdrive efficiency eta2 is lower than forward efficiency eta1
    const backdriveTorque = (F * l_m * eta2) / (2 * Math.PI);

    // Linear Velocity: v (mm/s) = n * lead / 60; v (m/min) = n * lead / 1000
    const linearSpeedMmS = (n * l_mm) / 60;
    const linearSpeedMMin = (n * l_mm) / 1000;

    return {
      F,
      l_mm,
      eta1,
      eta2,
      n,
      driveTorque,
      drivePower,
      backdriveTorque,
      linearSpeedMmS,
      linearSpeedMMin,
    };
  }, [axialLoad, lead, forwardEta, backEta, speedRpm]);

  const downloadCsv = () => {
    const rows = [
      ['Ball Screw Drive Torque & Power Sizing Report', ''],
      ['Standard', 'ISO 3408-1 / DIN 69051 Ball Screws'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Design Input Parameters', ''],
      ['Axial Thrust Load (N)', results.F.toString()],
      ['Screw Lead / Pitch (mm)', results.l_mm.toString()],
      ['Forward Drive Efficiency (eta1)', results.eta1.toString()],
      ['Backdriving Efficiency (eta2)', results.eta2.toString()],
      ['Rotational Speed (RPM)', results.n.toString()],
      ['', ''],
      ['Kinematic & Torque Outputs', ''],
      ['Direct Drive Torque (Nm)', results.driveTorque.toFixed(3)],
      ['Drive Mechanical Power (W)', results.drivePower.toFixed(2)],
      ['Backdrive Holding Torque (Nm)', results.backdriveTorque.toFixed(3)],
      ['Linear Travel Speed (mm/s)', results.linearSpeedMmS.toFixed(2)],
      ['Linear Travel Speed (m/min)', results.linearSpeedMMin.toFixed(2)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ball-screw-sizing-${results.F}N-lead${results.l_mm}mm.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setAxialLoad('5000');
    setLead('10');
    setForwardEta('0.9');
    setBackEta('0.8');
    setSpeedRpm('1000');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Drive Parameters Input */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Kinematic Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">ISO 3408 transmission sizing</p>
            </div>
          </div>

          {/* Lead Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Common Screw Lead Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_LEAD_PRESETS.map((p) => (
                <button
                  key={p.lead}
                  data-testid={`preset-lead-${p.lead}`}
                  onClick={() => setLead(p.lead)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    lead === p.lead
                      ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-slate-900 font-black">{p.lead} mm</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.label.split('(')[1]?.replace(')', '') || ''}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Axial Thrust Load (N)
              </label>
              <input
                type="number"
                step="50"
                data-testid="input-axial-load"
                value={axialLoad}
                onChange={e => setAxialLoad(e.target.value)}
                placeholder="5000"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Screw Lead / Pitch (mm)
              </label>
              <input
                type="number"
                step="1"
                data-testid="input-lead"
                value={lead}
                onChange={e => setLead(e.target.value)}
                placeholder="10"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Forward Eff. (η₁)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="0.99"
                  data-testid="input-forward-eta"
                  value={forwardEta}
                  onChange={e => setForwardEta(e.target.value)}
                  placeholder="0.90"
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Typically 0.90–0.95</span>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Backdrive Eff. (η₂)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="0.99"
                  data-testid="input-back-eta"
                  value={backEta}
                  onChange={e => setBackEta(e.target.value)}
                  placeholder="0.80"
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Typically 0.80–0.90</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Rotational Speed (RPM)
              </label>
              <input
                type="number"
                step="50"
                data-testid="input-speed-rpm"
                value={speedRpm}
                onChange={e => setSpeedRpm(e.target.value)}
                placeholder="1000"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            data-testid="btn-reset"
            onClick={handleReset}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Torque, Power & Linear Speed Outputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Transmission Performance</h2>
                  <p className="text-xs text-slate-500 font-medium">Torque, power demand & linear travel velocity</p>
                </div>
              </div>

              <button
                data-testid="btn-export-csv"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Output Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-200 mb-1">
                  <RotateCw className="w-4 h-4" />
                  <span>Required Drive Torque (T₁)</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="result-drive-torque">{results.driveTorque.toFixed(3)}</span>{' '}
                  <span className="text-xl font-bold">Nm</span>
                </div>
                <div className="text-xs text-blue-200/90 mt-2 font-medium">
                  Direct motor shaft torque demand at η₁ = {results.eta1}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-200 mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Drive Motor Power</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="result-drive-power">{results.drivePower.toFixed(2)}</span>{' '}
                  <span className="text-xl font-bold">W</span>
                </div>
                <div className="text-xs text-emerald-200/90 mt-2 font-medium">
                  {(results.drivePower / 745.7).toFixed(2)} HP continuous motor sizing requirement
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Backdrive Holding Torque (T_b)
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-backdrive-torque">{results.backdriveTorque.toFixed(3)}</span>{' '}
                  <span className="text-xs text-slate-500 font-bold">Nm</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Torque generated when axial force backdrives the screw (η₂ = {results.eta2})
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span>Linear Travel Speed</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-linear-speed-mms">{results.linearSpeedMmS.toFixed(1)}</span>{' '}
                  <span className="text-xs text-slate-500 font-bold">mm/s</span>{' '}
                  <span className="text-sm font-bold text-slate-400">
                    (<span data-testid="result-linear-speed-mmin">{results.linearSpeedMMin.toFixed(1)}</span> m/min)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Linear traverse rate: v = (n × lead) / 60 mm/s
                </div>
              </div>
            </div>

            {/* Engineering Standard Explanatory Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>ISO 3408 / DIN 69051 Ball Screw Engineering Principles</span>
              </div>
              <ul className="text-xs text-slate-600 leading-relaxed font-medium space-y-1 list-disc pl-5">
                <li><strong>Drive Torque:</strong> Calculated via T1 = (F &times; lead) / (2&pi; &times; &eta;1), representing input motor torque under forward conversion.</li>
                <li><strong>Backdrive Torque:</strong> Calculated via Tb = (F &times; lead &times; &eta;2) / (2&pi;). Due to high forward efficiency (&gt;90%), ball screws are not self-locking; a brake motor or holding brake is mandatory for vertical Z-axis loads.</li>
                <li><strong>Efficiency Variation:</strong> Forward efficiency &eta;1 and reverse backdriving efficiency &eta;2 vary with lead angle and lubrication. Consult catalog specifications (THK, NSK, HIWIN) for exact application ratings.</li>
              </ul>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
