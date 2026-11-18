'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const STRICT_INT_RE = /^[+-]?\d+$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function parseStrictIntAtLeast(raw: string, minVal: number): number {
  const s = raw.trim();
  if (!STRICT_INT_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= minVal ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'mn2-20deg', label: 'mn=2mm, z=24, beta=20deg, alpha_n=20deg', mn: '2', z: '24', beta: '20', alphan: '20', ft: '1000' },
  { id: 'mn3-15deg', label: 'mn=3mm, z=30, beta=15deg, Ft=1500N', mn: '3', z: '30', beta: '15', alphan: '20', ft: '1500' },
  { id: 'spur-0deg', label: 'Spur Special Case (beta=0deg, mn=2.5mm)', mn: '2.5', z: '20', beta: '0', alphan: '20', ft: '800' },
];

export default function HelicalGearCalculatorClient() {
  const [mnStr, setMnStr] = useState('2');
  const [zStr, setZStr] = useState('24');
  const [betaStr, setBetaStr] = useState('20');
  const [alphanStr, setAlphanStr] = useState('20');
  const [ftStr, setFtStr] = useState('1000');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setMnStr(p.mn);
    setZStr(p.z);
    setBetaStr(p.beta);
    setAlphanStr(p.alphan);
    setFtStr(p.ft);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const mn = parseStrictPositive(mnStr);
    const z = parseStrictIntAtLeast(zStr, 4);
    const betaDeg = parseStrictFinite(betaStr);
    const alphanDeg = parseStrictFinite(alphanStr);
    const ft = parseStrictNonNegative(ftStr);

    if (
      !Number.isFinite(mn) ||
      !Number.isFinite(z) ||
      !Number.isFinite(betaDeg) ||
      betaDeg < 0 ||
      betaDeg >= 60 ||
      !Number.isFinite(alphanDeg) ||
      alphanDeg < 10 ||
      alphanDeg > 35 ||
      !Number.isFinite(ft)
    ) {
      return {
        valid: false as const,
        errorMsg:
          'Enter valid parameters: module mn > 0, integer teeth z >= 4, helix angle 0 <= beta < 60 deg, normal pressure angle 10-35 deg, tangential force Ft >= 0.',
      };
    }

    const betaRad = (betaDeg * Math.PI) / 180;
    const alphanRad = (alphanDeg * Math.PI) / 180;
    const cosB = Math.cos(betaRad);
    const mt = mn / cosB;
    const d = mt * z;
    const da = d + 2 * mn;
    const zv = z / Math.pow(cosB, 3);
    const alphaTRad = Math.atan(Math.tan(alphanRad) / cosB);
    const alphaTDeg = (alphaTRad * 180) / Math.PI;
    const fa = ft * Math.tan(betaRad);
    const fr = ft * Math.tan(alphaTRad);

    return {
      valid: true as const,
      mn,
      z,
      betaDeg,
      alphanDeg,
      ft,
      mt,
      d,
      da,
      zv,
      alphaTDeg,
      fa,
      fr,
    };
  }, [mnStr, zStr, betaStr, alphanStr, ftStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Helical Gear Geometry & Force Summary (mn=${result.mn} mm, z=${result.z}, beta=${result.betaDeg} deg)`,
      `Transverse Module m_t = ${result.mt.toFixed(4)} mm`,
      `Pitch Diameter d = ${result.d.toFixed(3)} mm | Addendum Dia d_a = ${result.da.toFixed(3)} mm`,
      `Virtual Teeth z_v = ${result.zv.toFixed(3)} | Transverse Pressure Angle = ${result.alphaTDeg.toFixed(3)} deg`,
      `Axial Force F_a = ${result.fa.toFixed(2)} N | Radial Force F_r = ${result.fr.toFixed(2)} N`,
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
      ['Normal Module mn', String(result.mn), 'mm'],
      ['Teeth z', String(result.z), 'teeth'],
      ['Helix Angle beta', String(result.betaDeg), 'deg'],
      ['Normal Pressure Angle alpha_n', String(result.alphanDeg), 'deg'],
      ['Tangential Force Ft', String(result.ft), 'N'],
      ['Transverse Module mt', result.mt.toFixed(6), 'mm'],
      ['Pitch Diameter d', result.d.toFixed(4), 'mm'],
      ['Addendum Diameter da', result.da.toFixed(4), 'mm'],
      ['Virtual Teeth zv', result.zv.toFixed(4), 'teeth'],
      ['Transverse Pressure Angle alpha_t', result.alphaTDeg.toFixed(4), 'deg'],
      ['Axial Force Fa', result.fa.toFixed(4), 'N'],
      ['Radial Force Fr', result.fr.toFixed(4), 'N'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'helical-gear-geometry.csv';
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
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Presets</div>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Normal Module m_n (mm)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-mn"
              value={mnStr}
              onChange={(e) => setMnStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Teeth (z)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-z"
                value={zStr}
                onChange={(e) => setZStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Helix Angle beta (deg)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-beta"
                value={betaStr}
                onChange={(e) => setBetaStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Normal Pressure alpha_n (deg)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-alphan"
                value={alphanStr}
                onChange={(e) => setAlphanStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Tangential Force Ft (N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-ft"
                value={ftStr}
                onChange={(e) => setFtStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Helical Gear Geometry &amp; Mesh Forces</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {!result.valid && (
              <div
                data-testid="validation-error"
                className="mb-6 flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Transverse Module m_t</div>
                <div className="text-2xl font-black text-blue-800">
                  <span data-testid="result-mt">{result.valid ? result.mt.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">mm</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <div className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-1">Pitch Diameter d</div>
                <div className="text-2xl font-black text-indigo-800">
                  <span data-testid="result-d">{result.valid ? result.d.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-indigo-500 ml-1">mm</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">Virtual Teeth z_v</div>
                <div className="text-2xl font-black text-purple-800">
                  <span data-testid="result-zv">{result.valid ? result.zv.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-purple-500 ml-1">eq. teeth</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Axial Thrust Force F_a</div>
                <div className="text-2xl font-black text-emerald-800">
                  <span data-testid="result-fa">{result.valid ? result.fa.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">N</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Radial Force F_r</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-fr">{result.valid ? result.fr.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-orange-500 ml-1">N</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Addendum Dia d_a</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-da">{result.valid ? result.da.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">mm</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  m_t = m_n / cos(beta) · d = m_t * z · d_a = d + 2 * m_n · z_v = z / cos^3(beta) · F_a = F_t * tan(beta) · F_r = F_t * tan(alpha_n) / cos(beta)
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
