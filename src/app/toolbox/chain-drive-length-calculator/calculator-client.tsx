'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

interface ChainPitchPreset {
  code: string;
  label: string;
  pitchMm: string;
}

const CHAIN_SERIES: ChainPitchPreset[] = [
  { code: '06B_35', label: 'ISO 06B / ANSI #35 — 9.525 mm (3/8 in)', pitchMm: '9.525' },
  { code: '08B_40', label: 'ISO 08B / ANSI #40 — 12.7 mm (1/2 in)', pitchMm: '12.7' },
  { code: '10B_50', label: 'ISO 10B / ANSI #50 — 15.875 mm (5/8 in)', pitchMm: '15.875' },
  { code: '12B_60', label: 'ISO 12B / ANSI #60 — 19.05 mm (3/4 in)', pitchMm: '19.05' },
  { code: '16B_80', label: 'ISO 16B / ANSI #80 — 25.4 mm (1 in)', pitchMm: '25.4' },
  { code: 'custom', label: 'Custom Pitch (Edit below)', pitchMm: '' },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
}

export default function ChainDriveLengthCalculatorClient() {
  const [centerDistStr, setCenterDistStr] = useState<string>('500');
  const [chainCode, setChainCode] = useState<string>('08B_40');
  const [pitchStr, setPitchStr] = useState<string>('12.7');
  const [teeth1Str, setTeeth1Str] = useState<string>('17');
  const [teeth2Str, setTeeth2Str] = useState<string>('51');

  const handleChainCodeChange = (nextCode: string) => {
    setChainCode(nextCode);
    const found = CHAIN_SERIES.find((item) => item.code === nextCode);
    if (found && found.pitchMm !== '') {
      setPitchStr(found.pitchMm);
    }
  };

  const handlePitchInput = (val: string) => {
    setPitchStr(val);
    const matched = CHAIN_SERIES.find(
      (item) => item.code !== 'custom' && Number(item.pitchMm) === parseStrictNumber(val)
    );
    setChainCode(matched ? matched.code : 'custom');
  };

  const applyPreset = (c: string, code: string, p: string, n1: string, n2: string) => {
    setCenterDistStr(c);
    setChainCode(code);
    setPitchStr(p);
    setTeeth1Str(n1);
    setTeeth2Str(n2);
  };

  const handleReset = () => {
    applyPreset('500', '08B_40', '12.7', '17', '51');
  };

  /**
   * Roller Chain Length & Center Distance Equations (ISO 606 / ASME B29.1 drives):
   * 1. Center distance in pitches: C_p = C / P
   * 2. Sprocket pitch radii clearance check:
   *    R_p1 = P / (2 * sin(pi / N_1)), R_p2 = P / (2 * sin(pi / N_2))
   *    Requires C > R_p1 + R_p2 (non-overlapping sprockets).
   * 3. Exact chain length in pitches:
   *    L_p,exact = (N_1 + N_2) / 2 + 2 * C_p + ((N_2 - N_1)^2) / (4 * pi^2 * C_p)
   * 4. Recommended even number of pitches (avoids offset / half links):
   *    L_p,even = 2 * ceil((L_p,exact - 1e-9) / 2)
   * 5. Total linear chain length: L_mm = L_p,even * P
   * 6. Adjusted center distance for L_p,even:
   *    C_actual = (P / 8) * [ (2 * L_p,even - N_1 - N_2) + sqrt((2 * L_p,even - N_1 - N_2)^2 - (8 / pi^2) * (N_2 - N_1)^2) ]
   */
  const calc = useMemo(() => {
    const C = parseStrictNumber(centerDistStr);
    const P = parseStrictNumber(pitchStr);
    const N1 = parseStrictNumber(teeth1Str);
    const N2 = parseStrictNumber(teeth2Str);

    if (
      !Number.isFinite(C) ||
      !Number.isFinite(P) ||
      !Number.isFinite(N1) ||
      !Number.isFinite(N2) ||
      C <= 0 ||
      P <= 0 ||
      !Number.isInteger(N1) ||
      !Number.isInteger(N2) ||
      N1 < 6 ||
      N2 < 6
    ) {
      return { isValid: false as const };
    }

    const rp1 = P / (2 * Math.sin(Math.PI / N1));
    const rp2 = P / (2 * Math.sin(Math.PI / N2));
    if (C <= rp1 + rp2) {
      return { isValid: false as const };
    }

    const Cp = C / P;
    const diff = N2 - N1;
    const lpExact = (N1 + N2) / 2 + 2 * Cp + (diff * diff) / (4 * Math.PI * Math.PI * Cp);
    const lpEven = Math.ceil((lpExact - 1e-9) / 2) * 2;
    const linearLengthMm = lpEven * P;

    const termA = 2 * lpEven - N1 - N2;
    const discriminant = termA * termA - (8 / (Math.PI * Math.PI)) * (diff * diff);
    if (discriminant <= 0) {
      return { isValid: false as const };
    }
    const cActual = (P / 8) * (termA + Math.sqrt(discriminant));

    return {
      isValid: true as const,
      C,
      P,
      N1,
      N2,
      lpExact,
      lpEven,
      linearLengthMm,
      cActual,
    };
  }, [centerDistStr, pitchStr, teeth1Str, teeth2Str]);

  const handleExportCsv = () => {
    if (!calc.isValid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Target Center Distance (C)', calc.C.toFixed(2), 'mm', 'Nominal shaft-to-shaft spacing'],
      ['Chain Pitch (P)', calc.P.toFixed(3), 'mm', 'Pin-to-pin pitch (ISO 606 / ASME B29.1)'],
      ['Sprocket 1 Teeth (N1)', String(calc.N1), 'teeth', 'Integer tooth count >= 6'],
      ['Sprocket 2 Teeth (N2)', String(calc.N2), 'teeth', 'Integer tooth count >= 6'],
      ['Exact Theoretical Length (L_p,exact)', calc.lpExact.toFixed(2), 'pitches', '(N1+N2)/2 + 2C/P + (N2-N1)^2 / (4*pi^2*(C/P))'],
      ['Recommended Even Chain Links (L_p,even)', String(calc.lpEven), 'pitches', 'Rounded up to next even pitch count (no offset link)'],
      ['Total Chain Linear Length', calc.linearLengthMm.toFixed(2), 'mm', 'L_p,even * P'],
      ['Adjusted Center Distance (C_actual)', calc.cActual.toFixed(2), 'mm', 'Exact center distance corresponding to L_p,even'],
      ['Standards Reference', 'ISO 606:2015 / ASME B29.1', '-', 'Roller chain pitch standards & two-sprocket length equation'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chain-drive-length.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Sprocket &amp; Chain Inputs</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ISO 606 / ASME B29.1 Pitch Sizing
                </p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-08b-3to1"
                onClick={() => applyPreset('500', '08B_40', '12.7', '17', '51')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                08B/#40 · 17:51
              </button>
              <button
                type="button"
                data-testid="preset-10b-2to1"
                onClick={() => applyPreset('600', '10B_50', '15.875', '19', '38')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                10B/#50 · 19:38
              </button>
              <button
                type="button"
                data-testid="preset-12b-equal"
                onClick={() => applyPreset('400', '12B_60', '19.05', '20', '20')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                12B/#60 · 20:20
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Standard Chain Series (ISO 606 / ASME B29.1)
              </label>
              <select
                data-testid="select-chain-code"
                value={chainCode}
                onChange={(e) => handleChainCodeChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              >
                {CHAIN_SERIES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Center Distance C (mm)
                </label>
                <input
                  type="text"
                  data-testid="input-center-distance"
                  value={centerDistStr}
                  onChange={(e) => setCenterDistStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Chain Pitch P (mm)
                </label>
                <input
                  type="text"
                  data-testid="input-pitch"
                  value={pitchStr}
                  onChange={(e) => handlePitchInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Sprocket 1 Teeth N₁ (≥ 6)
                </label>
                <input
                  type="text"
                  data-testid="input-teeth-1"
                  value={teeth1Str}
                  onChange={(e) => setTeeth1Str(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Sprocket 2 Teeth N₂ (≥ 6)
                </label>
                <input
                  type="text"
                  data-testid="input-teeth-2"
                  value={teeth2Str}
                  onChange={(e) => setTeeth2Str(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-export-csv"
            disabled={!calc.isValid}
            onClick={handleExportCsv}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-black flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Chain Length CSV
          </button>
        </div>

        {/* Right Column: Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Chain Pitch Count &amp; Center Distance Fit
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Recommended Even Links (L_p,even)
                </div>
                <div className="text-3xl font-black font-mono text-blue-800">
                  <span data-testid="out-even-links">
                    {calc.isValid ? String(calc.lpEven) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-blue-500">pitches</span>
                </div>
                <div className="text-[11px] font-semibold text-blue-600 mt-1">
                  Even pitch count avoids offset (half) connecting links
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Total Chain Linear Length
                </div>
                <div className="text-3xl font-black font-mono text-emerald-800">
                  <span data-testid="out-chain-length-mm">
                    {calc.isValid ? calc.linearLengthMm.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-emerald-600">mm</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                  L_mm = L_p,even × P
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Calculated Theoretical Pitches
                </div>
                <div className="text-2xl font-black font-mono text-slate-800">
                  <span data-testid="out-exact-links">
                    {calc.isValid ? calc.lpExact.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-slate-500">pitches</span>
                </div>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
                  Adjusted Center Distance (C_actual)
                </div>
                <div className="text-2xl font-black font-mono text-amber-800">
                  <span data-testid="out-actual-center">
                    {calc.isValid ? calc.cActual.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-amber-600">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Roller Chain Length Formulas &amp; Standards (ISO 606 / ASME B29.1):</span>
              </div>
              <p className="font-mono text-slate-700">
                L_p,exact = (N₁ + N₂)/2 + 2C/P + (N₂ − N₁)² / [4π²(C/P)], L_p,even = 2 × ceil(L_p,exact / 2)
              </p>
              <p className="font-mono text-slate-700">
                C_actual = (P / 8) × [(2L_p,even − N₁ − N₂) + √((2L_p,even − N₁ − N₂)² − (8/π²)(N₂ − N₁)²)]
              </p>
              <p className="text-slate-500">
                Interchangeability note: Although BS/European <strong>ISO 606</strong> chains (e.g. 08B-1) and American{' '}
                <strong>ASME B29.1</strong> chains (e.g. ANSI #40) share identical pin-to-pin pitches (12.70 mm), their
                roller diameters and inner plate widths differ; do not mix ISO B-series chains with ANSI sprockets.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
