'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, Download, Ruler } from 'lucide-react';

interface RisePreset {
  name: string;
  rise: string;
  desc: string;
}

const RISE_PRESETS: RisePreset[] = [
  { name: 'Single Curb / 1 Step', rise: '7', desc: 'Standard exterior sidewalk or curb step' },
  { name: '2 Steps Entrance', rise: '14', desc: 'Residential threshold or low porch' },
  { name: 'Standard 4 Steps / Porch', rise: '28', desc: 'Single continuous run threshold' },
  { name: 'Commercial Entrance (Multi-tier)', rise: '42', desc: 'Requires intermediate resting landing' },
  { name: 'Loading Dock / High Plinth', rise: '60', desc: 'Multi-switchback accessible ramp' },
];

export default function AdaRampSlopeCalculatorClient() {
  const [totalRise, setTotalRise] = useState('28'); // inches
  const [slopeRatio, setSlopeRatio] = useState('12'); // 1:12
  const [maxRisePerRun, setMaxRisePerRun] = useState('30'); // inches (ADA max is 30")
  const [activePreset, setActivePreset] = useState<number | null>(2);

  const applyPreset = (idx: number) => {
    setTotalRise(RISE_PRESETS[idx].rise);
    setActivePreset(idx);
  };

  const results = useMemo(() => {
    const riseIn = Math.max(0, parseFloat(totalRise) || 0);
    const slopeX = Math.max(1, parseFloat(slopeRatio) || 12);
    const maxRunRise = Math.max(6, parseFloat(maxRisePerRun) || 30);

    // ADA slope ratio calculation: 1:X (Rise : Run)
    // Run (ft) = (Rise in inches * X) / 12 inches per ft
    const runFt = (riseIn * slopeX) / 12;

    // Slope angle in degrees and percentage
    const slopeAngleDeg = (Math.atan(1 / slopeX) * 180) / Math.PI;
    const slopePercent = (1 / slopeX) * 100;

    // ADA 405.2: max running slope 1:12. ADA 405.6: max rise per ramp run 30 inches.
    const requiredRuns = Math.max(1, Math.ceil(riseIn / maxRunRise));
    const intermediateLandings = Math.max(0, requiredRuns - 1);

    // ADA 405.7.3: landing clear length 60 inches (5 ft) min.
    // Top and bottom landings (also 60" long) are excluded from this run footprint.
    const landingLengthFt = intermediateLandings * 5;
    const totalFootprintFt = runFt + landingLengthFt;

    // ADA 405.8: handrails required on both sides when rise > 6 inches.
    // ADA 505.3 / 505.10.1: handrails continuous across intermediate landings,
    // with 12" horizontal extensions at the top and bottom only.
    const handrailsRequired = riseIn > 6;
    const totalHandrailFt = handrailsRequired ? 2 * (totalFootprintFt + 2) : 0;

    const slopeOk = slopeX >= 12;
    const riseOk = maxRunRise <= 30;
    const isCompliant = slopeOk && riseOk;

    return {
      riseIn,
      slopeX,
      slopePercent,
      slopeAngleDeg,
      runFt,
      requiredRuns,
      intermediateLandings,
      totalFootprintFt,
      totalHandrailFt,
      handrailsRequired,
      slopeOk,
      riseOk,
      isCompliant,
    };
  }, [totalRise, slopeRatio, maxRisePerRun]);

  const downloadCsv = () => {
    const rows = [
      ['ADA Ramp Slope & Dimensional Compliance Report', ''],
      ['Standard', '2010 ADA Standards for Accessible Design Section 405'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Total Vertical Rise (inches)', totalRise],
      ['Slope Ratio', `1:${slopeRatio}`],
      ['Max Rise per Continuous Run (inches)', maxRisePerRun],
      ['', ''],
      ['Compliance & Dimensional Outputs', ''],
      ['Horizontal Ramp Run (feet)', results.runFt.toFixed(2)],
      ['Ramp Slope (%)', `${results.slopePercent.toFixed(2)}%`],
      ['Ramp Incline Angle (degrees)', `${results.slopeAngleDeg.toFixed(2)}°`],
      ['Required Ramp Runs', results.requiredRuns],
      ['Intermediate 60"x60" Landings', results.intermediateLandings],
      ['Total Footprint with Landings (feet)', results.totalFootprintFt.toFixed(2)],
      ['Minimum Dual Handrail Length (feet)', results.totalHandrailFt.toFixed(2)],
      ['ADA Status', results.isCompliant ? 'COMPLIANT (slope 1:12 or gentler, rise per run 30 in max)' : `NON-COMPLIANT (${!results.slopeOk ? 'slope steeper than 1:12' : 'rise per run over 30 in'})`],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ada-ramp-slope-compliance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Ramp Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">ADA Section 405 slope constraints</p>
            </div>
          </div>

          {/* Vertical Rise Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Common Rise Thresholds</label>
            <div className="space-y-1.5">
              {RISE_PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    activePreset === idx
                      ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-black text-slate-500">{p.rise}&quot; rise</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Total Vertical Rise (inches)
              </label>
              <input
                type="number"
                step="0.5"
                data-testid="input-rise"
                value={totalRise}
                onChange={e => { setTotalRise(e.target.value); setActivePreset(null); }}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Slope Ratio (1:X)
              </label>
              <select
                data-testid="select-slope"
                value={slopeRatio}
                onChange={e => setSlopeRatio(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all cursor-pointer"
              >
                <option value="12">1:12 (8.33% / 4.76° — Maximum Permissible ADA)</option>
                <option value="16">1:16 (6.25% / 3.58° — Recommended Comfortable)</option>
                <option value="20">1:20 (5.00% / 2.86° — Gentle Accessible Walkway)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Max Rise per Run (inches)
              </label>
              <input
                type="number"
                step="1"
                data-testid="input-max-rise"
                value={maxRisePerRun}
                onChange={e => setMaxRisePerRun(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">ADA Section 405.6 limits rise to 30&quot; max per single run</span>
            </div>
          </div>

          <button
            data-testid="btn-reset"
            onClick={() => { setTotalRise('28'); setSlopeRatio('12'); setMaxRisePerRun('30'); setActivePreset(2); }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Dimensional Compliance Results</h2>
                  <p className="text-xs text-slate-500 font-medium">Layout footprint & continuous handrails</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  data-testid="btn-export-csv"
                  onClick={downloadCsv}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <div data-testid="badge-compliance" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                  results.isCompliant
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {results.isCompliant ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>{results.isCompliant ? 'ADA COMPLIANT' : !results.slopeOk ? 'EXCEEDS MAX SLOPE' : 'RUN RISE OVER 30"'}</span>
                </div>
              </div>
            </div>

            {/* Primary Result Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-200 mb-1">
                  <Ruler className="w-4 h-4" />
                  <span>Total Ramp Horizontal Run</span>
                </div>
                <div className="text-4xl font-black"><span data-testid="result-run-ft">{results.runFt.toFixed(1)}</span> <span className="text-xl font-bold">ft</span></div>
                <div className="text-xs text-blue-200/90 mt-2 font-medium">
                  {results.slopePercent.toFixed(2)}% gradient ({results.slopeAngleDeg.toFixed(2)}°) • 1:{results.slopeX} slope ratio
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs">
                <div className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  Total Footprint with Landings
                </div>
                <div className="text-4xl font-black"><span data-testid="result-footprint-ft">{results.totalFootprintFt.toFixed(1)}</span> <span className="text-xl font-bold">ft</span></div>
                <div className="text-xs text-slate-300 mt-2 font-medium">
                  Includes {results.intermediateLandings} intermediate 60&quot;-long landing(s); top &amp; bottom landings not included
                </div>
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Intermediate Landings</div>
                <div className="text-2xl font-black text-slate-900"><span data-testid="result-landings">{results.intermediateLandings}</span> <span className="text-xs text-slate-500 font-bold">platform(s)</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Required when rise exceeds 30&quot;</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Min Dual Handrails</div>
                <div className="text-2xl font-black text-slate-900"><span data-testid="result-handrails">{results.handrailsRequired ? results.totalHandrailFt.toFixed(1) : '0'}</span> <span className="text-xs text-slate-500 font-bold">linear ft</span></div>
                <div className="text-[11px] text-slate-400 mt-1">{results.handrailsRequired ? 'Both sides, continuous over landings, 12" extensions top & bottom' : 'Not required: rise is 6" or less (Sec 405.8)'}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Required Runs</div>
                <div className="text-2xl font-black text-slate-900"><span data-testid="result-required-runs">{results.requiredRuns}</span> <span className="text-xs text-slate-500 font-bold">ramp run(s)</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Maximum 30&quot; rise per run</div>
              </div>
            </div>

            {/* ADA Code Compliance Checklist */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>ADA Chapter 4 (Accessible Routes) Governing Requirements</span>
              </div>
              <ul className="text-xs text-slate-600 leading-relaxed font-medium space-y-1 list-disc pl-5">
                <li><strong>Clear Width (Sec 405.5):</strong> The clear width of a ramp run and landings shall be 36 inches (915 mm) minimum between handrails.</li>
                <li><strong>Landings (Sec 405.7):</strong> Level landings (slope &lt; 1:48) are required at the top and bottom of each ramp run, at least as wide as the ramp and 60&quot; long; where a ramp changes direction the landing must be at least 60&quot; × 60&quot;.</li>
                <li><strong>Handrails (Sec 405.8):</strong> Required on both sides for any ramp with a rise greater than 6 inches (150 mm), mounted between 34&quot; and 38&quot; above walking surface.</li>
              </ul>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
