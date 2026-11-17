'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, AlertTriangle, CheckCircle, RotateCcw, Copy, Check, Download } from 'lucide-react';

interface MaterialPreset {
  id: string;
  name: string;
  sut: string;
  sePrime: string;
  fLowCycle: string;
  hasEndurance: boolean;
}

const MATERIALS: MaterialPreset[] = [
  { id: 'steel-600', name: 'Carbon Steel Ref (Sut=600 MPa, Se\'=300 MPa)', sut: '600', sePrime: '300', fLowCycle: '0.85', hasEndurance: true },
  { id: 'steel-800', name: 'Alloy Steel Ref (Sut=800 MPa, Se\'=400 MPa)', sut: '800', sePrime: '400', fLowCycle: '0.82', hasEndurance: true },
  { id: 'al-6061', name: 'Aluminum 6061-T6 Ref (5e8 cycles S\'_f=96 MPa)', sut: '310', sePrime: '96', fLowCycle: '0.90', hasEndurance: false },
];

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function FatigueLifeClient() {
  const [matId, setMatId] = useState('steel-600');
  const [sutStr, setSutStr] = useState('600');
  const [sePrimeStr, setSePrimeStr] = useState('300');
  const [fStr, setFStr] = useState('0.85');
  const [kaStr, setKaStr] = useState('0.85');
  const [kbStr, setKbStr] = useState('0.90');
  const [sigmaAStr, setSigmaAStr] = useState('280');
  const [sigmaMStr, setSigmaMStr] = useState('50');
  const [hasEndurance, setHasEndurance] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectMaterial = (id: string) => {
    const m = MATERIALS.find((x) => x.id === id);
    if (!m) return;
    setMatId(m.id);
    setSutStr(m.sut);
    setSePrimeStr(m.sePrime);
    setFStr(m.fLowCycle);
    setHasEndurance(m.hasEndurance);
    setCopied(false);
  };

  const resetDefaults = () => {
    selectMaterial('steel-600');
    setKaStr('0.85');
    setKbStr('0.90');
    setSigmaAStr('280');
    setSigmaMStr('50');
  };

  const result = useMemo(() => {
    const Sut = parseStrictPositive(sutStr);
    const SePrime = parseStrictPositive(sePrimeStr);
    const f = parseStrictPositive(fStr);
    const ka = parseStrictPositive(kaStr);
    const kb = parseStrictPositive(kbStr);
    const sigmaA = parseStrictPositive(sigmaAStr);
    const sigmaM = parseStrictNonNegative(sigmaMStr);

    if (
      !Number.isFinite(Sut) ||
      !Number.isFinite(SePrime) ||
      !Number.isFinite(f) ||
      !Number.isFinite(ka) ||
      !Number.isFinite(kb) ||
      !Number.isFinite(sigmaA) ||
      !Number.isFinite(sigmaM)
    ) {
      return { valid: false as const, errorMsg: 'Enter valid positive numbers for strengths, Marin factors, and stress amplitude, and non-negative mean stress.' };
    }
    if (f > 1 || ka > 1 || kb > 1) {
      return { valid: false as const, errorMsg: 'Fatigue fraction f and modification factors ka, kb must be <= 1.0.' };
    }
    if (sigmaM >= Sut) {
      return { valid: false as const, errorMsg: 'Mean tensile stress sigma_m must be strictly less than ultimate strength Sut (static failure if sigma_m >= Sut).' };
    }

    const Se = SePrime * ka * kb;
    const S1000 = f * Sut;
    if (S1000 <= Se) {
      return { valid: false as const, errorMsg: '10^3-cycle strength f*Sut must exceed endurance limit Se to form a downward Basquin S-N curve.' };
    }

    // Two-point log-linear Basquin equation anchored at (10^3, f*Sut) and (10^6, Se):
    // b = -log10(S1000 / Se) / 3, a = S1000^2 / Se
    const b = -Math.log10(S1000 / Se) / 3;
    const a = (S1000 * S1000) / Se;

    // Modified Goodman equivalent fully-reversed alternating stress
    const sigmaAEq = sigmaM > 0 ? sigmaA / (1 - sigmaM / Sut) : sigmaA;

    let status = 'Finite Life Region';
    let infinite = false;
    let cyclesN = Math.pow(sigmaAEq / a, 1 / b);

    if (sigmaAEq >= Sut) {
      status = 'Exceeds Ultimate Tensile Strength (Immediate Yield/Fracture)';
    } else if (hasEndurance && sigmaAEq <= Se) {
      infinite = true;
      cyclesN = 1e6;
      status = 'Endurance Limit Runout (>= 1,000,000 cycles)';
    }

    return {
      valid: true as const,
      Sut,
      Se,
      S1000,
      ka,
      kb,
      f,
      sigmaA,
      sigmaM,
      sigmaAEq,
      a,
      b,
      cyclesN,
      infinite,
      status,
    };
  }, [sutStr, sePrimeStr, fStr, kaStr, kbStr, sigmaAStr, sigmaMStr, hasEndurance]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Basquin S-N & Modified Goodman Fatigue Estimate`,
      `Sut=${result.Sut} MPa, Se=${result.Se.toFixed(2)} MPa, S1000=${result.S1000.toFixed(2)} MPa`,
      `a=${result.a.toFixed(3)} MPa, b=${result.b.toFixed(6)}`,
      `sigma_a=${result.sigmaA} MPa, sigma_m=${result.sigmaM} MPa -> Goodman sigma_a_eq=${result.sigmaAEq.toFixed(2)} MPa`,
      `Predicted Life: ${result.infinite ? '>= 1000000 (Runout)' : Math.round(result.cyclesN)} cycles (${result.status})`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Material Preset', matId, '-'],
      ['Ultimate Tensile Strength Sut', String(result.Sut), 'MPa'],
      ['Modified Endurance Limit Se', result.Se.toFixed(2), 'MPa'],
      ['1000-Cycle Strength f*Sut', result.S1000.toFixed(2), 'MPa'],
      ['Basquin Coefficient a', result.a.toFixed(3), 'MPa'],
      ['Basquin Exponent b', result.b.toFixed(6), '-'],
      ['Goodman Equivalent Stress', result.sigmaAEq.toFixed(2), 'MPa'],
      ['Predicted Fatigue Life N', result.infinite ? '>= 1000000' : String(Math.round(result.cyclesN)), 'cycles'],
      ['Assessment', result.status, '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fatigue-life-sn.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Preset material values are illustrative S-N textbook estimates. Actual fatigue endurance limits vary widely with heat treatment, notch sensitivity, residual stress, and specimen testing.
        </span>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="select-material" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Material Reference Preset
            </label>
            <select
              id="select-material"
              data-testid="select-material"
              value={matId}
              onChange={(e) => selectMaterial(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
            >
              {MATERIALS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {[
            { id: 'sut', label: 'Ultimate Tensile Strength Sut (MPa)', val: sutStr, set: setSutStr },
            { id: 'se-prime', label: 'Base Endurance Limit Se_prime (MPa)', val: sePrimeStr, set: setSePrimeStr },
            { id: 'f', label: '10^3-Cycle Strength Fraction f', val: fStr, set: setFStr },
            { id: 'ka', label: 'Surface Finish Factor ka', val: kaStr, set: setKaStr },
            { id: 'kb', label: 'Size Factor kb', val: kbStr, set: setKbStr },
            { id: 'sigma-a', label: 'Alternating Stress sigma_a (MPa)', val: sigmaAStr, set: setSigmaAStr },
            { id: 'sigma-m', label: 'Mean Stress sigma_m (MPa)', val: sigmaMStr, set: setSigmaMStr },
          ].map((fld) => (
            <div key={fld.id}>
              <label htmlFor={`input-${fld.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {fld.label}
              </label>
              <input
                id={`input-${fld.id}`}
                data-testid={`input-${fld.id}`}
                type="text"
                value={fld.val}
                onChange={(e) => fld.set(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    result.valid && result.infinite ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {result.valid && result.infinite ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Fatigue Life Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className={`rounded-2xl p-6 border ${result.valid && result.infinite ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Predicted Fatigue Life N</div>
              <div className="text-4xl font-black text-slate-900">
                <span data-testid="result-cycles">
                  {result.valid ? (result.infinite ? '>= 1,000,000' : Math.round(result.cyclesN).toString()) : '—'}
                </span>{' '}
                <span className="text-base font-bold text-slate-500">cycles</span>
              </div>
              <div data-testid="result-status" className="text-sm font-bold text-slate-700 mt-1">
                {result.valid ? result.status : '—'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-slate-500 font-bold">Modified Se</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-se">{result.valid ? result.Se.toFixed(2) : '—'}</span> MPa
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-slate-500 font-bold">S_1000 (f*Sut)</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-s1000">{result.valid ? result.S1000.toFixed(2) : '—'}</span> MPa
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-slate-500 font-bold">Goodman Eq. Stress</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-sigma-eq">{result.valid ? result.sigmaAEq.toFixed(2) : '—'}</span> MPa
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-slate-500 font-bold">Basquin Exponent b</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-b">{result.valid ? result.b.toFixed(6) : '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Two-point log-linear Basquin model anchored at (10^3, S_1000 = f*Sut) and (10^6, Se = ka*kb*Se_prime): b = -log10(S_1000/Se)/3, a = S_1000^2/Se, and Goodman sigma_a_eq = sigma_a / (1 - sigma_m/Sut), giving N = (sigma_a_eq / a)^(1/b).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
