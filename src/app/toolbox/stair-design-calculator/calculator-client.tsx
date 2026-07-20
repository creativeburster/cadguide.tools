'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StairDesignCalculatorClient() {
  const [totalRise, setTotalRise] = useState('2800');
  const [idealRiser, setIdealRiser] = useState('175');
  const [treadDepth, setTreadDepth] = useState('280');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const result = useMemo(() => {
    const rise = parseFloat(totalRise);
    const ideal = parseFloat(idealRiser);
    const tread = parseFloat(treadDepth);

    if (!rise || !ideal || !tread || rise <= 0 || ideal <= 0 || tread <= 0) {
      return null;
    }

    const numRisers = Math.ceil(rise / ideal);
    const actualRiser = rise / numRisers;
    const numTreads = numRisers - 1;
    const totalRun = numTreads * tread;
    const stairAngle = Math.atan(actualRiser / tread) * (180 / Math.PI);
    const comfortRatio = 2 * actualRiser + tread;

    let ibcRiserOK = true;
    let ibcTreadOK = true;
    let comfortOK = true;

    if (unit === 'metric') {
      ibcRiserOK = actualRiser <= 196;
      ibcTreadOK = tread >= 280;
      comfortOK = comfortRatio >= 600 && comfortRatio <= 650;
    } else {
      ibcRiserOK = actualRiser <= 7.75;
      ibcTreadOK = tread >= 10;
      comfortOK = comfortRatio >= 24 && comfortRatio <= 25;
    }

    return {
      numRisers,
      actualRiser,
      numTreads,
      totalRun,
      stairAngle,
      comfortRatio,
      ibcRiserOK,
      ibcTreadOK,
      comfortOK,
    };
  }, [totalRise, idealRiser, treadDepth, unit]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 1000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(1);
    if (Math.abs(n) >= 10) return n.toFixed(2);
    return n.toFixed(3);
  };

  const u = unit === 'metric' ? 'mm' : 'in';

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

          <div className="flex gap-2">
            <button
              onClick={() => { setUnit('metric'); setTotalRise('2800'); setIdealRiser('175'); setTreadDepth('280'); }}
              className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'metric' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}
            >Metric (mm)</button>
            <button
              onClick={() => { setUnit('imperial'); setTotalRise('110'); setIdealRiser('7'); setTreadDepth('11'); }}
              className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'imperial' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}
            >Imperial (in)</button>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Total Rise ({u})</label>
            <input type="text" value={totalRise} onChange={e => setTotalRise(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Ideal Riser Height ({u})</label>
            <input type="text" value={idealRiser} onChange={e => setIdealRiser(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Tread Depth ({u})</label>
            <input type="text" value={treadDepth} onChange={e => setTreadDepth(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => { setTotalRise(unit === 'metric' ? '2800' : '110'); setIdealRiser(unit === 'metric' ? '175' : '7'); setTreadDepth(unit === 'metric' ? '280' : '11'); }}
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

            {result ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Risers</div>
                    <div className="text-3xl font-black text-blue-700">{result.numRisers}</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Riser Height</div>
                    <div className="text-3xl font-black text-green-700">{formatNum(result.actualRiser)}<span className="text-lg text-green-400"> {u}</span></div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Treads</div>
                    <div className="text-3xl font-black text-purple-700">{result.numTreads}</div>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <div className="text-base font-black text-amber-400 uppercase tracking-wider mb-2">Total Run</div>
                    <div className="text-3xl font-black text-amber-700">{formatNum(result.totalRun)}<span className="text-lg text-amber-400"> {u}</span></div>
                  </div>
                  <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                    <div className="text-base font-black text-rose-400 uppercase tracking-wider mb-2">Stair Angle</div>
                    <div className="text-3xl font-black text-rose-700">{formatNum(result.stairAngle)}<span className="text-lg text-rose-400">°</span></div>
                  </div>
                  <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-100">
                    <div className="text-base font-black text-cyan-400 uppercase tracking-wider mb-2">2R + T</div>
                    <div className="text-3xl font-black text-cyan-700">{formatNum(result.comfortRatio)}<span className="text-lg text-cyan-400"> {u}</span></div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${result.ibcRiserOK ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    {result.ibcRiserOK ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                    <span className={`text-base font-bold ${result.ibcRiserOK ? 'text-green-700' : 'text-red-700'}`}>
                      IBC Riser Limit: {unit === 'metric' ? '196mm' : '7.75in'} max — {result.ibcRiserOK ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${result.ibcTreadOK ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    {result.ibcTreadOK ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                    <span className={`text-base font-bold ${result.ibcTreadOK ? 'text-green-700' : 'text-red-700'}`}>
                      IBC Tread Minimum: {unit === 'metric' ? '280mm' : '10in'} min — {result.ibcTreadOK ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${result.comfortOK ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    {result.comfortOK ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    <span className={`text-base font-bold ${result.comfortOK ? 'text-green-700' : 'text-amber-700'}`}>
                      Comfort Ratio 2R+T: {unit === 'metric' ? '600-650mm' : '24-25in'} ideal — {result.comfortOK ? 'GOOD' : 'Check proportion'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold">Enter valid dimensions to calculate</div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                risers = ceil(rise / ideal), tread = risers − 1, angle = atan(riser / tread), 2R+T comfort rule
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
