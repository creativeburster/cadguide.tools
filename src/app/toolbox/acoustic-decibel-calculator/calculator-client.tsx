'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Volume2, ShieldAlert, Download, Plus, Trash2 } from 'lucide-react';

interface SoundPreset {
  name: string;
  spl: number;
  desc: string;
  category: string;
}

const SOUND_PRESETS: SoundPreset[] = [
  { name: 'Quiet Library', spl: 40, desc: 'Quiet background reading room', category: 'Indoor' },
  { name: 'Normal Conversation', spl: 60, desc: 'Face-to-face speech at 1 meter', category: 'Indoor' },
  { name: 'Busy Open Office', spl: 70, desc: 'Telephones, typing, and HVAC hum', category: 'Workplace' },
  { name: 'Heavy City Traffic', spl: 85, desc: 'Roadside vehicle traffic at 10m', category: 'Outdoor' },
  { name: 'Power Drill / Workshop', spl: 95, desc: 'Woodworking tools at operator ear', category: 'Industrial' },
  { name: 'Chainsaw / Loud Factory', spl: 105, desc: 'Heavy manufacturing equipment', category: 'Industrial' },
  { name: 'Rock Concert / Siren', spl: 115, desc: 'Amplified sound system within 5m', category: 'Extreme' },
];

export default function AcousticDecibelCalculatorClient() {
  const [sourceSpl, setSourceSpl] = useState('85'); // dB
  const [d1, setD1] = useState('1'); // meters (reference distance)
  const [d2, setD2] = useState('10'); // meters (target listener distance)
  const [activePreset, setActivePreset] = useState<number | null>(3);

  // Multi-source decibel addition state
  const [sources, setSources] = useState<string[]>(['85', '85']);

  const applyPreset = (idx: number) => {
    setSourceSpl(SOUND_PRESETS[idx].spl.toString());
    setActivePreset(idx);
  };

  const addSource = () => {
    if (sources.length < 8) {
      setSources([...sources, '80']);
    }
  };

  const removeSource = (idx: number) => {
    if (sources.length > 2) {
      setSources(sources.filter((_, i) => i !== idx));
    }
  };

  const updateSourceVal = (idx: number, val: string) => {
    const next = [...sources];
    next[idx] = val;
    setSources(next);
  };

  // Addition calculation: L_total = 10 * log10(sum(10^(Li/10)))
  const combinedSpl = useMemo(() => {
    let sumPower = 0;
    sources.forEach(s => {
      const val = parseFloat(s);
      if (!isNaN(val) && val > 0) {
        sumPower += Math.pow(10, val / 10);
      }
    });
    if (sumPower <= 0) return 0;
    return 10 * Math.log10(sumPower);
  }, [sources]);

  const results = useMemo(() => {
    const spl1 = Math.max(0, parseFloat(sourceSpl) || 0);
    const dist1 = Math.max(0.1, parseFloat(d1) || 1);
    const dist2 = Math.max(0.1, parseFloat(d2) || 1);

    // Reference sound pressure in air: p0 = 20 µPa = 20e-6 Pa
    const p0 = 20e-6;

    // Convert SPL to root-mean-square acoustic pressure: p = p0 * 10^(SPL / 20)
    const p1 = p0 * Math.pow(10, spl1 / 20);

    // Inverse Square Law in free field: attenuation = 20 * log10(d2 / d1)
    // Every doubling of distance drops SPL by 6.02 dB
    const attenuation = 20 * Math.log10(dist2 / dist1);
    const spl2 = Math.max(0, spl1 - attenuation);
    const p2 = p0 * Math.pow(10, spl2 / 20);

    // NIOSH criterion: 85 dBA for 8 hours; 3 dB exchange rate
    // T_max = 8 / (2^((SPL - 85) / 3)) hours
    // NIOSH REL formula applies on both sides of 85 dBA (e.g. 82 dBA → 16 h, 88 dBA → 4 h)
    const oshaHours = 8 / Math.pow(2, (spl2 - 85) / 3);
    let exposureStatus: string;
    if (spl2 >= 100) {
      exposureStatus = 'Above REL: allowed exposure under 15 min/day, hearing protection advised';
    } else if (spl2 >= 85) {
      exposureStatus = 'At/above NIOSH REL: limit daily exposure, hearing protection advised';
    } else {
      exposureStatus = 'Below NIOSH REL for an 8-hour day';
    }

    return {
      spl1,
      spl2,
      attenuation,
      p1,
      p2,
      oshaHours: oshaHours >= 24 ? '> 24 hrs' : oshaHours < 0.05 ? '< 3 mins' : `${oshaHours.toFixed(1)} hrs`,
      exposureStatus,
      distanceRatio: dist2 / dist1,
    };
  }, [sourceSpl, d1, d2]);

  const downloadCsv = () => {
    const rows = [
      ['Acoustic Distance Attenuation & Decibel Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Part 1: Distance Attenuation Parameters', ''],
      ['Source Sound Pressure Level (dB)', sourceSpl],
      ['Reference Distance d1 (m)', d1],
      ['Listener Distance d2 (m)', d2],
      ['', ''],
      ['Acoustic Evaluation', ''],
      ['SPL at Reference Distance (dB)', results.spl1.toFixed(1)],
      ['Distance Attenuation (dB)', results.attenuation.toFixed(2)],
      ['Resulting SPL at Target Distance (dB)', results.spl2.toFixed(1)],
      ['Acoustic Pressure at Source (Pa)', results.p1.toFixed(4)],
      ['Acoustic Pressure at Listener (Pa)', results.p2.toFixed(4)],
      ['NIOSH Recommended Safe Exposure Duration', results.oshaHours],
      ['Hearing Conservation Status', results.exposureStatus],
      ['', ''],
      ['Part 2: Multi-Source Decibel Addition', ''],
      ...sources.map((s, idx) => [`Source ${idx + 1} Level (dB)`, s]),
      ['Combined Resulting Sound Pressure Level (dB)', combinedSpl.toFixed(1)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acoustic-decibel-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Sound Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Free-field inverse-square model</p>
            </div>
          </div>

          {/* Environmental Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Common Sound Sources</label>
            <div className="space-y-1.5">
              {SOUND_PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    activePreset === idx
                      ? 'bg-green-50 border-green-300 text-green-800 shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-black text-slate-500">{p.spl} dB</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Source Level at d₁ (dB SPL)
              </label>
              <input
                type="number"
                step="1"
                value={sourceSpl}
                onChange={e => { setSourceSpl(e.target.value); setActivePreset(null); }}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Ref Dist d₁ (m)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={d1}
                  onChange={e => setD1(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Target Dist d₂ (m)
                </label>
                <input
                  type="number"
                  step="1"
                  value={d2}
                  onChange={e => setD2(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSourceSpl('85'); setD1('1'); setD2('10'); setActivePreset(3); }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Sound Attenuation Analysis</h2>
                  <p className="text-xs text-slate-500 font-medium">Free-field spherical propagation</p>
                </div>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Result Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-green-100 mb-1">
                  <Volume2 className="w-4 h-4" />
                  <span>Resulting SPL at {d2}m (d₂)</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="acoustic-distance-spl">{results.spl2.toFixed(1)}</span> <span className="text-xl font-bold">dB</span>
                </div>
                <div className="text-xs text-green-100/90 mt-2 font-medium">
                  Attenuated by {results.attenuation.toFixed(1)} dB over {results.distanceRatio.toFixed(1)}× distance increase
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>NIOSH Recommended Exposure (REL)</span>
                </div>
                <div className="text-3xl font-black">
                  <span data-testid="acoustic-niosh-hours">{results.oshaHours}</span>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-medium">
                  {results.exposureStatus} (3 dB exchange rate standard)
                </div>
              </div>
            </div>

            {/* Secondary Acoustic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Attenuation</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="acoustic-attenuation">{results.attenuation.toFixed(2)}</span> <span className="text-xs text-slate-500 font-bold">dB</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">~6.02 dB drop per doubling of distance</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Source Pressure (p₁)</div>
                <div className="text-2xl font-black text-slate-900">{results.p1.toFixed(3)} <span className="text-xs text-slate-500 font-bold">Pa</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Relative to 20 µPa auditory threshold</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Pressure (p₂)</div>
                <div className="text-2xl font-black text-slate-900">{results.p2.toFixed(4)} <span className="text-xs text-slate-500 font-bold">Pa</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Acoustic wave pressure at listener</div>
              </div>
            </div>

            {/* Standards & Physics Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Acoustic Inverse-Square Formula:</strong> Sound pressure level drops according to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">SPL₂ = SPL₁ - 20 × log₁₀(d₂ / d₁)</code> in an open, free-field environment without boundary reflections. Indoors, beyond the room&apos;s critical distance the reverberant field dominates and the level drops much less than 6 dB per doubling. The NIOSH exposure estimate assumes the entered level is A-weighted (dBA) and constant over the day.
              </div>
            </div>
          </div>

          {/* Section 2: Multi-Source Decibel Addition */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Decibel Addition (Multiple Noise Sources)</h2>
                  <p className="text-xs text-slate-500 font-medium">Incoherent logarithmic sound energy summation</p>
                </div>
              </div>
              <button
                onClick={addSource}
                disabled={sources.length >= 8}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Source
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Input Sources List */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Individual Sound Sources (dB SPL)
                </label>
                {sources.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 w-16 shrink-0">Source {idx + 1}</span>
                    <input
                      type="number"
                      step="0.5"
                      value={s}
                      data-testid={`acoustic-source-${idx}`}
                      onChange={e => updateSourceVal(idx, e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                    />
                    <span className="text-xs font-bold text-slate-400">dB</span>
                    {sources.length > 2 && (
                      <button
                        onClick={() => removeSource(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove source"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Combined Result Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-blue-200">
                  Combined Total Sound Level
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="acoustic-combined-spl">{combinedSpl.toFixed(1)}</span> <span className="text-xl font-bold">dB</span>
                </div>
                <p className="text-xs text-blue-200/90 font-medium leading-relaxed pt-2 border-t border-blue-500/30">
                  Calculated from {sources.length} uncorrelated acoustic sources via <code className="bg-blue-800/60 px-1 py-0.5 rounded">L_total = 10 × log₁₀(Σ 10^(Lᵢ/10))</code>.
                  Two equal levels increase the total by 3.01 dB.
                </p>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
