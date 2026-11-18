'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Activity, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function LiquefactionPotentialCalculatorClient() {
  const [amaxStr, setAmaxStr] = useState('0.35');
  const [mwStr, setMwStr] = useState('7.5');
  const [n160Str, setN160Str] = useState('15');
  const [sigmaVStr, setSigmaVStr] = useState('160');
  const [sigmaVeffStr, setSigmaVeffStr] = useState('85');
  const [rdStr, setRdStr] = useState('0.95');
  const [copied, setCopied] = useState(false);

  const amax = parsePos(amaxStr);
  const mw = parsePos(mwStr);
  const n160 = parsePos(n160Str);
  const sigmaV = parsePos(sigmaVStr);
  const sigmaVeff = parsePos(sigmaVeffStr);
  const rd = parsePos(rdStr);

  const nOk = n160 !== null && n160 > 0 && n160 < 30;
  const stressOk = sigmaV !== null && sigmaVeff !== null && sigmaV >= sigmaVeff;
  const rdOk = rd !== null && rd > 0 && rd <= 1;

  const isValid = amax !== null && mw !== null && nOk && stressOk && rdOk;

  let csr: number | null = null;
  let crr75: number | null = null;
  let msf: number | null = null;
  let crr: number | null = null;
  let fs: number | null = null;

  if (isValid && amax !== null && mw !== null && n160 !== null && sigmaV !== null && sigmaVeff !== null && rd !== null) {
    csr = 0.65 * amax * (sigmaV / sigmaVeff) * rd;
    crr75 = 1 / (34 - n160) + n160 / 135 + 50 / Math.pow(10 * n160 + 45, 2) - 1 / 200;
    msf = Math.pow(mw / 7.5, -2.56);
    crr = crr75 * msf;
    fs = crr / csr;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (a: string, m: string, n: string, sv: string, sve: string, r: string) => {
    setAmaxStr(a);
    setMwStr(m);
    setN160Str(n);
    setSigmaVStr(sv);
    setSigmaVeffStr(sve);
    setRdStr(r);
  };

  const handleReset = () => applyPreset('0.35', '7.5', '15', '160', '85', '0.95');

  const handleCopy = async () => {
    if (!isValid || csr === null || crr === null || msf === null || fs === null) return;
    const text = [
      'Simplified SPT Soil Liquefaction Evaluation (Seed & Idriss / Youd et al. 2001)',
      `a_max=${amax} g, M_w=${mw}, (N1)60cs=${n160}, sigma_v=${sigmaV} kPa, sigma'_v=${sigmaVeff} kPa, r_d=${rd}`,
      `CSR: ${csr.toFixed(4)}, CRR_adj: ${crr.toFixed(4)}, MSF: ${msf.toFixed(3)}`,
      `Factor of Safety FS: ${fs.toFixed(3)}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || csr === null || crr75 === null || msf === null || crr === null || fs === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['pga_amax_g', String(amax), 'g'],
      ['moment_magnitude_mw', String(mw), 'Mw'],
      ['corrected_spt_n1_60cs', String(n160), 'blows'],
      ['total_overburden_sigma_v', String(sigmaV), 'kPa'],
      ['effective_overburden_sigma_veff', String(sigmaVeff), 'kPa'],
      ['stress_reduction_rd', String(rd), 'ratio'],
      ['csr', csr.toFixed(5), 'ratio'],
      ['crr_7_5', crr75.toFixed(5), 'ratio'],
      ['msf', msf.toFixed(4), 'ratio'],
      ['crr_adjusted', crr.toFixed(5), 'ratio'],
      ['factor_of_safety_fs', fs.toFixed(4), 'ratio'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liquefaction-potential-youd-2001.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Seismic &amp; Soil Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-moderate-sand"
                onClick={() => applyPreset('0.35', '7.5', '15', '160', '85', '0.95')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Medium Sand (0.35 g, Mw 7.5, N=15)
              </button>
              <button
                type="button"
                data-testid="preset-dense-m65"
                onClick={() => applyPreset('0.25', '6.5', '22', '140', '80', '0.92')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Dense Sand (0.25 g, Mw 6.5, N=22)
              </button>
              <button
                type="button"
                data-testid="preset-loose-highg"
                onClick={() => applyPreset('0.45', '7.8', '9', '180', '90', '0.94')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Loose Saturated Sand (0.45 g, Mw 7.8, N=9)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">PGA a_max (g)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-amax"
                  value={amaxStr}
                  onChange={e => setAmaxStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Magnitude Mw</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-mw"
                  value={mwStr}
                  onChange={e => setMwStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">(N1)60cs (&lt; 30)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-n160"
                  value={n160Str}
                  onChange={e => setN160Str(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">r_d (0–1]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-rd"
                  value={rdStr}
                  onChange={e => setRdStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Total Stress sv (kPa)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-sv"
                  value={sigmaVStr}
                  onChange={e => setSigmaVStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Eff Stress sv&apos; (kPa)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-sveff"
                  value={sigmaVeffStr}
                  onChange={e => setSigmaVeffStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ensure a_max, Mw &gt; 0, (N1)60cs in (0, 30), sigma_v &ge; sigma_v&apos; &gt; 0, and r_d in (0, 1].</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Youd et al. (2001) NCEER Evaluation</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                CSR = 0.65 * a_max * (sigma_v / sigma_v&apos;) * r_d, FS = (CRR_7.5 * MSF) / CSR
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Factor of Safety (FS)</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-fs">{fmt(fs, 4)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Cyclic Stress Ratio (CSR)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-csr">{fmt(csr, 4)}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Adjusted Resistance (CRR)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-crr">{fmt(crr, 4)}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Magnitude Scaling Factor</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-msf">{fmt(msf, 4)}</span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
