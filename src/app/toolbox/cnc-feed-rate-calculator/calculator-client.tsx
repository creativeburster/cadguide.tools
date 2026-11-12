'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Info, RotateCcw, AlertTriangle } from 'lucide-react';

interface MillingPreset {
  id: string;
  label: string;
  vc: string;
  fz: string;
  diameter: string;
  flutes: string;
  ap: string;
  ae: string;
}

// Typical starting example values only — always consult cutting tool manufacturer catalog recommendations
const PRESETS: MillingPreset[] = [
  {
    id: 'aluminum-6061-default',
    label: 'Aluminum 6061-T6 Slotting (Default)',
    vc: '300',
    fz: '0.12',
    diameter: '6',
    flutes: '2',
    ap: '3',
    ae: '6',
  },
  {
    id: 'carbon-steel-1045',
    label: 'Carbon Steel (AISI 1045) Side Milling',
    vc: '90',
    fz: '0.06',
    diameter: '10',
    flutes: '4',
    ap: '5',
    ae: '2',
  },
  {
    id: 'stainless-304',
    label: 'Stainless Steel (304) Peripheral',
    vc: '50',
    fz: '0.04',
    diameter: '8',
    flutes: '4',
    ap: '4',
    ae: '1.6',
  },
  {
    id: 'titanium-ti6al4v',
    label: 'Titanium (Ti-6Al-4V) Light Radial',
    vc: '40',
    fz: '0.05',
    diameter: '12',
    flutes: '4',
    ap: '6',
    ae: '1.2',
  },
];

function parseStrictNum(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

export default function CNCFeedRateClient() {
  const [vcStr, setVcStr] = useState('300');
  const [fzStr, setFzStr] = useState('0.12');
  const [diameterStr, setDiameterStr] = useState('6');
  const [flutesStr, setFlutesStr] = useState('2');
  const [apStr, setApStr] = useState('3');
  const [aeStr, setAeStr] = useState('6');

  const applyPreset = (p: MillingPreset) => {
    setVcStr(p.vc);
    setFzStr(p.fz);
    setDiameterStr(p.diameter);
    setFlutesStr(p.flutes);
    setApStr(p.ap);
    setAeStr(p.ae);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const calc = useMemo(() => {
    const vc = parseStrictNum(vcStr);
    const fz = parseStrictNum(fzStr);
    const D = parseStrictNum(diameterStr);
    const z = parseStrictNum(flutesStr);
    const ap = parseStrictNum(apStr);
    const ae = parseStrictNum(aeStr);

    if (
      !Number.isFinite(vc) ||
      !Number.isFinite(fz) ||
      !Number.isFinite(D) ||
      !Number.isFinite(z) ||
      !Number.isFinite(ap) ||
      !Number.isFinite(ae)
    ) {
      return {
        valid: false as const,
        error: 'Enter valid finite numbers for cutting speed, chip load, cutter diameter, flutes, and cut depths.',
      };
    }

    if (vc <= 0 || vc > 5000) {
      return { valid: false as const, error: 'Cutting speed V_c must be > 0 and ≤ 5,000 m/min.' };
    }
    if (fz <= 0 || fz > 5) {
      return { valid: false as const, error: 'Feed per tooth f_z must be > 0 and ≤ 5.0 mm/tooth.' };
    }
    if (D <= 0 || D > 1000) {
      return { valid: false as const, error: 'Cutter diameter D must be > 0 and ≤ 1,000 mm.' };
    }
    if (!Number.isInteger(z) || z < 1 || z > 64) {
      return { valid: false as const, error: 'Number of flutes z must be an integer between 1 and 64.' };
    }
    if (ap <= 0 || ap > 500) {
      return { valid: false as const, error: 'Axial depth of cut a_p must be > 0 and ≤ 500 mm.' };
    }
    if (ae <= 0 || ae > D) {
      return {
        valid: false as const,
        error: 'Radial width of cut a_e must be > 0 and cannot exceed cutter diameter D.',
      };
    }

    // Step-by-step unit derivation (m/min -> mm/min):
    // 1. Convert surface cutting speed V_c [m/min] to [mm/min] by multiplying by 1000 [mm/m]:
    //    v_surface = 1000 * V_c [mm/min]
    // 2. Divide by cutter circumference per revolution (pi * D [mm/rev]) to obtain spindle speed n [rev/min = RPM]:
    //    n = (1000 * V_c) / (pi * D) [RPM]
    // 3. Table feed rate F [mm/min] = f_z [mm/tooth] * z [teeth/rev] * n [rev/min]
    // 4. Geometric material removal rate MRR [cm^3/min] = (a_p [mm] * a_e [mm] * F [mm/min]) / 1000 [mm^3/cm^3]
    const rpm = (1000 * vc) / (Math.PI * D);
    const feedRate = fz * z * rpm;
    const mrrCm3 = (ap * ae * feedRate) / 1000;

    return {
      valid: true as const,
      vc,
      fz,
      D,
      z,
      ap,
      ae,
      rpm,
      feedRate,
      mrrCm3,
    };
  }, [vcStr, fzStr, diameterStr, flutesStr, apStr, aeStr]);

  const downloadCsv = () => {
    if (!calc.valid) return;
    const rows = [
      ['# CNC Milling Feed Rate & Spindle Speed Report', ''],
      ['# Unit Derivation', 'n [RPM] = (1000 [mm/m] * V_c [m/min]) / (pi * D [mm/rev]); F [mm/min] = f_z * z * n'],
      ['# Advisory', 'Typical parameters are starting examples only; consult cutting tool manufacturer recommendations'],
      ['Cutting Speed V_c (m/min)', String(calc.vc)],
      ['Feed per Tooth f_z (mm/tooth)', String(calc.fz)],
      ['Cutter Diameter D (mm)', String(calc.D)],
      ['Number of Flutes z', String(calc.z)],
      ['Axial Depth of Cut a_p (mm)', String(calc.ap)],
      ['Radial Width of Cut a_e (mm)', String(calc.ae)],
      ['Spindle Speed n (RPM)', calc.rpm.toFixed(1)],
      ['Table Feed Rate F (mm/min)', calc.feedRate.toFixed(1)],
      ['Material Removal Rate MRR (cm^3/min)', calc.mrrCm3.toFixed(2)],
    ];

    const csv = rows.map((r) => r.join(',')).join('\r\n') + '\r\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cnc-feed-rate-calculation.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Presets with Mandatory Manufacturer Advisory */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Example Material Presets (Editable)
          </div>
          <span
            data-testid="manufacturer-advisory"
            className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full"
          >
            Typical example values only — please consult your cutting tool manufacturer&apos;s recommended parameters
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="feed-vc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Cutting Speed V_c (m/min)
            </label>
            <input
              id="feed-vc"
              data-testid="input-cutting-speed"
              type="text"
              inputMode="decimal"
              value={vcStr}
              onChange={(e) => setVcStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="feed-fz" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Chip Load / Feed per Tooth f_z (mm/tooth)
            </label>
            <input
              id="feed-fz"
              data-testid="input-chip-load"
              type="text"
              inputMode="decimal"
              value={fzStr}
              onChange={(e) => setFzStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="feed-dia" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Tool Dia D (mm)
              </label>
              <input
                id="feed-dia"
                data-testid="input-tool-diameter"
                type="text"
                inputMode="decimal"
                value={diameterStr}
                onChange={(e) => setDiameterStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="feed-flutes" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Flutes z
              </label>
              <input
                id="feed-flutes"
                data-testid="input-flutes"
                type="text"
                inputMode="numeric"
                value={flutesStr}
                onChange={(e) => setFlutesStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="feed-ap" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Axial Cut a_p (mm)
              </label>
              <input
                id="feed-ap"
                data-testid="input-axial-doc"
                type="text"
                inputMode="decimal"
                value={apStr}
                onChange={(e) => setApStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="feed-ae" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Radial Cut a_e (mm)
              </label>
              <input
                id="feed-ae"
                data-testid="input-radial-woc"
                type="text"
                inputMode="decimal"
                value={aeStr}
                onChange={(e) => setAeStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Machining Kinematics Results</h2>
              <button
                type="button"
                data-testid="export-csv-button"
                disabled={!calc.valid}
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!calc.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{calc.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-85 mb-1">Spindle Speed (n)</p>
                <p className="text-3xl font-black">
                  <span data-testid="result-rpm">{calc.valid ? calc.rpm.toFixed(1) : '—'}</span>
                  <span className="text-base font-bold ml-2 opacity-85">RPM</span>
                </p>
                <p className="text-xs mt-2 opacity-80">n = (1000 · V_c) / (π · D)</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-85 mb-1">Table Feed Rate (F)</p>
                <p className="text-3xl font-black">
                  <span data-testid="result-feed-rate">{calc.valid ? calc.feedRate.toFixed(1) : '—'}</span>
                  <span className="text-base font-bold ml-2 opacity-85">mm/min</span>
                </p>
                <p className="text-xs mt-2 opacity-80">F = f_z · z · n</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Chip Load (f_z)</p>
                <p className="text-2xl font-black text-slate-900">
                  <span data-testid="result-chip-load">{calc.valid ? calc.fz.toFixed(3) : '—'}</span>
                  <span className="text-sm text-slate-500 font-bold ml-1.5">mm/tooth</span>
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Material Removal Rate (MRR)
                </p>
                <p className="text-2xl font-black text-slate-900">
                  <span data-testid="result-mrr">{calc.valid ? calc.mrrCm3.toFixed(2) : '—'}</span>
                  <span className="text-sm text-slate-500 font-bold ml-1.5">cm³/min</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">MRR = (a_p · a_e · F) / 1000</p>
              </div>
            </div>

            {/* Unit Derivation Box */}
            <div
              data-testid="unit-derivation-box"
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed"
            >
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                Step-by-Step Unit Derivation (m/min → mm/min)
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 font-medium">
                <li>
                  <strong>Surface Speed Conversion:</strong> Convert cutting speed <code>V_c [m/min]</code> into
                  millimeters per minute using the exact metric factor <code>1 m = 1000 mm</code>:{' '}
                  <code>1000 · V_c [mm/min]</code>.
                </li>
                <li>
                  <strong>Spindle Rotational Speed:</strong> One spindle revolution sweeps cutter circumference{' '}
                  <code>π · D [mm/rev]</code>, so{' '}
                  <code>n = (1000 · V_c [mm/min]) / (π · D [mm/rev]) = [rev/min = RPM]</code>.
                </li>
                <li>
                  <strong>Linear Table Feed Rate:</strong> Multiplying chip load per tooth by tooth count and spindle
                  speed gives <code>F = f_z [mm/tooth] × z [teeth/rev] × n [rev/min] = [mm/min]</code>.
                </li>
                <li>
                  <strong>Volumetric Removal Rate:</strong>{' '}
                  <code>MRR = (a_p [mm] × a_e [mm] × F [mm/min]) / 1000 [mm³/cm³] = [cm³/min]</code>.
                </li>
              </ol>
              <p className="text-slate-500 pt-1">
                <strong>Tooling Note:</strong> Preset <code>V_c</code> and <code>f_z</code> values are illustrative
                starting examples only. Always refer to your cutting tool manufacturer&apos;s catalog for coating-,
                helix-, overhang-, and radial chip-thinning adjustments.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
