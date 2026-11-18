'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Check, Copy, Download, Info, RotateCcw, Settings, Zap } from 'lucide-react';

type ProcessMode = 'milling' | 'turning' | 'drilling';

interface MrrPreset {
  id: string;
  label: string;
  mode: ProcessMode;
  woc: string;
  doc: string;
  feed: string;
  vc: string;
  fRev: string;
  drillDia: string;
  density: string;
  kc: string;
}

const PRESETS: MrrPreset[] = [
  {
    id: 'milling-default',
    label: 'Milling 10x2 @ 500',
    mode: 'milling',
    woc: '10',
    doc: '2',
    feed: '500',
    vc: '200',
    fRev: '0.25',
    drillDia: '12',
    density: '7.85',
    kc: '1800',
  },
  {
    id: 'turning-steel',
    label: 'Turning Steel Vc200',
    mode: 'turning',
    woc: '10',
    doc: '2.0',
    feed: '500',
    vc: '200',
    fRev: '0.25',
    drillDia: '12',
    density: '7.85',
    kc: '2100',
  },
  {
    id: 'drilling-12mm',
    label: 'Drilling Ø12mm',
    mode: 'drilling',
    woc: '10',
    doc: '2',
    feed: '500',
    vc: '60',
    fRev: '0.20',
    drillDia: '12',
    density: '7.85',
    kc: '1800',
  },
];

const parsePos = (raw: string): number | null => {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const fmt = (n: number | null, dec = 4) => (n === null || !Number.isFinite(n) ? '—' : n.toFixed(dec));

export default function MrrCalculatorClient() {
  const [mode, setMode] = useState<ProcessMode>('milling');
  const [wocStr, setWocStr] = useState('10');
  const [docStr, setDocStr] = useState('2');
  const [feedStr, setFeedStr] = useState('500');
  const [vcStr, setVcStr] = useState('200');
  const [fRevStr, setFRevStr] = useState('0.25');
  const [drillDiaStr, setDrillDiaStr] = useState('12');
  const [densityStr, setDensityStr] = useState('7.85');
  const [kcStr, setKcStr] = useState('1800');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: MrrPreset) => {
    setMode(p.mode);
    setWocStr(p.woc);
    setDocStr(p.doc);
    setFeedStr(p.feed);
    setVcStr(p.vc);
    setFRevStr(p.fRev);
    setDrillDiaStr(p.drillDia);
    setDensityStr(p.density);
    setKcStr(p.kc);
  };

  const calc = useMemo(() => {
    const rho = parsePos(densityStr);
    const kc = parsePos(kcStr);
    if (rho === null || kc === null) {
      return { valid: false as const, error: 'Enter positive material density and assumed specific cutting force kc.' };
    }

    let mrrCm3 = 0;
    if (mode === 'milling') {
      const ae = parsePos(wocStr);
      const ap = parsePos(docStr);
      const vf = parsePos(feedStr);
      if (ae === null || ap === null || vf === null) {
        return { valid: false as const, error: 'Enter positive width of cut, depth of cut, and feed rate.' };
      }
      mrrCm3 = (ae * ap * vf) / 1000;
    } else if (mode === 'turning') {
      const vc = parsePos(vcStr);
      const f = parsePos(fRevStr);
      const ap = parsePos(docStr);
      if (vc === null || f === null || ap === null) {
        return { valid: false as const, error: 'Enter positive cutting speed Vc, feed per rev, and depth of cut.' };
      }
      mrrCm3 = vc * f * ap;
    } else {
      const d = parsePos(drillDiaStr);
      const vc = parsePos(vcStr);
      const fr = parsePos(fRevStr);
      if (d === null || vc === null || fr === null) {
        return { valid: false as const, error: 'Enter positive drill diameter, cutting speed Vc, and feed per rev.' };
      }
      const n = (1000 * vc) / (Math.PI * d);
      const vf = n * fr;
      mrrCm3 = ((Math.PI * d * d) / 4) * (vf / 1000);
    }

    const mrrMm3 = mrrCm3 * 1000;
    const massRateG = mrrCm3 * rho;
    const powerKw = (mrrMm3 * kc) / 60e6;
    return { valid: true as const, error: '', mrrCm3, mrrMm3, massRateG, powerKw };
  }, [mode, wocStr, docStr, feedStr, vcStr, fRevStr, drillDiaStr, densityStr, kcStr]);

  const handleCopy = async () => {
    if (!calc.valid) return;
    const summary = `Mode=${mode} | Q=${calc.mrrCm3.toFixed(4)} cm3/min (${calc.mrrMm3.toFixed(2)} mm3/min) | MassRate=${calc.massRateG.toFixed(4)} g/min | Power=${calc.powerKw.toFixed(5)} kW`;
    try {
      await navigator.clipboard?.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['metric', 'value', 'unit'],
      ['process_mode', mode, 'enum'],
      ['mrr_cm3_min', calc.mrrCm3.toFixed(4), 'cm3/min'],
      ['mrr_mm3_min', calc.mrrMm3.toFixed(2), 'mm3/min'],
      ['mass_removal_rate', calc.massRateG.toFixed(4), 'g/min'],
      ['net_cutting_power_kw', calc.powerKw.toFixed(5), 'kW'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mrr-${mode}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Machining Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Milling, Turning, or Drilling</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="mrr-mode" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Operation Mode
            </label>
            <select
              id="mrr-mode"
              data-testid="select-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as ProcessMode)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 cursor-pointer"
            >
              <option value="milling">Milling (ae x ap x vf)</option>
              <option value="turning">Turning (Vc x f x ap)</option>
              <option value="drilling">Drilling (pi*D^2/4 x vf)</option>
            </select>
          </div>

          {mode === 'milling' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="mrr-woc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Width of Cut ae (mm)
                </label>
                <input
                  id="mrr-woc"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-woc"
                  value={wocStr}
                  onChange={(e) => setWocStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="mrr-doc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Depth of Cut ap (mm)
                </label>
                <input
                  id="mrr-doc"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-doc"
                  value={docStr}
                  onChange={(e) => setDocStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="mrr-feed" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Feed Rate vf (mm/min)
                </label>
                <input
                  id="mrr-feed"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-feed"
                  value={feedStr}
                  onChange={(e) => setFeedStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          )}

          {mode === 'turning' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="mrr-vc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Cutting Speed Vc (m/min)
                </label>
                <input
                  id="mrr-vc"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-vc"
                  value={vcStr}
                  onChange={(e) => setVcStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="mrr-frev" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Feed per Rev f (mm/rev)
                </label>
                <input
                  id="mrr-frev"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-frev"
                  value={fRevStr}
                  onChange={(e) => setFRevStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="mrr-tdoc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Depth of Cut ap (mm)
                </label>
                <input
                  id="mrr-tdoc"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-doc"
                  value={docStr}
                  onChange={(e) => setDocStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          )}

          {mode === 'drilling' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="mrr-dd" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Drill Diameter D (mm)
                </label>
                <input
                  id="mrr-dd"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-drill-dia"
                  value={drillDiaStr}
                  onChange={(e) => setDrillDiaStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="mrr-dvc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Cutting Speed Vc (m/min)
                </label>
                <input
                  id="mrr-dvc"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-vc"
                  value={vcStr}
                  onChange={(e) => setVcStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="mrr-dfr" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Feed per Rev f (mm/rev)
                </label>
                <input
                  id="mrr-dfr"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-frev"
                  value={fRevStr}
                  onChange={(e) => setFRevStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mrr-rho" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Density (g/cm³)
              </label>
              <input
                id="mrr-rho"
                type="text"
                inputMode="decimal"
                data-testid="input-density"
                value={densityStr}
                onChange={(e) => setDensityStr(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="mrr-kc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Assumed kc (N/mm²)
              </label>
              <input
                id="mrr-kc"
                type="text"
                inputMode="decimal"
                data-testid="input-kc"
                value={kcStr}
                onChange={(e) => setKcStr(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Removal Rate &amp; Power</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? `MODE: ${mode}` : 'INVALID INPUT'}
              </span>
            </div>

            {!calc.valid && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                {calc.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Volumetric MRR (cm³/min)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-mrr-cm3">{fmt(calc.valid ? calc.mrrCm3 : null, 4)}</span>
                  <span className="text-base text-blue-500 ml-1.5">cm³/min</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-1">Volumetric MRR (mm³/min)</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-mrr-mm3">{fmt(calc.valid ? calc.mrrMm3 : null, 2)}</span>
                  <span className="text-base text-green-500 ml-1.5">mm³/min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Mass Removal Rate</div>
                <div className="text-xl font-black text-purple-800">
                  <span data-testid="result-mass-rate">{fmt(calc.valid ? calc.massRateG : null, 4)}</span>
                  <span className="text-xs text-purple-600 ml-1">g/min</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Net Cutting Power</div>
                <div className="text-xl font-black text-orange-800">
                  <span data-testid="result-power">{fmt(calc.valid ? calc.powerKw : null, 5)}</span>
                  <span className="text-xs text-orange-600 ml-1">kW</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Milling: Q = ae·ap·vf / 1000; Turning: Q = Vc·f·ap; Drilling: Q = (π·D²/4)·(1000·Vc/(π·D))·fr / 1000. Net power Pc = Q_mm3·kc / 6×10⁷ (divide by machine drive efficiency for spindle input power).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
