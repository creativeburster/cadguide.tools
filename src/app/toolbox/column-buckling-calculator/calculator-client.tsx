'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Settings,
  Info,
  Shield,
  AlertTriangle,
  Copy,
  Check,
  Download,
  RotateCcw,
} from 'lucide-react';

interface MaterialPreset {
  id: string;
  name: string;
  eGpa: string;
  fyMpa: string;
}

const MATERIAL_PRESETS: MaterialPreset[] = [
  { id: 'steel-a36', name: 'Structural Steel A36 (E=200 GPa, Fy=250 MPa)', eGpa: '200', fyMpa: '250' },
  { id: 'steel-a992', name: 'Structural Steel A992 (E=200 GPa, Fy=345 MPa)', eGpa: '200', fyMpa: '345' },
  { id: 'al-6061', name: 'Aluminum 6061-T6 (E=69 GPa, Fy=276 MPa)', eGpa: '69', fyMpa: '276' },
  { id: 'ss-304', name: 'Stainless 304 (E=193 GPa, Fy=215 MPa)', eGpa: '193', fyMpa: '215' },
  { id: 'timber', name: 'Structural Timber (E=11 GPa, Fy=40 MPa)', eGpa: '11', fyMpa: '40' },
];

interface EndConditionPreset {
  id: string;
  name: string;
  kTheoretical: string;
  kRecommended: string;
}

const END_CONDITIONS: EndConditionPreset[] = [
  { id: 'pinned-pinned', name: 'Pinned-Pinned (Both ends pinned)', kTheoretical: '1.0', kRecommended: '1.0' },
  { id: 'fixed-fixed', name: 'Fixed-Fixed (Both ends fixed)', kTheoretical: '0.5', kRecommended: '0.65' },
  { id: 'fixed-pinned', name: 'Fixed-Pinned (One fixed, one pinned)', kTheoretical: '0.7', kRecommended: '0.80' },
  { id: 'cantilever', name: 'Fixed-Free (Cantilever)', kTheoretical: '2.0', kRecommended: '2.10' },
];

function parsePositive(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return Number.NaN;
  const val = Number(trimmed);
  if (!Number.isFinite(val) || val <= 0) return Number.NaN;
  return val;
}

function fmt(val: number, decimals = 2): string {
  if (!Number.isFinite(val)) return '—';
  return val.toFixed(decimals);
}

export default function ColumnBucklingClient() {
  const [matId, setMatId] = useState<string>('steel-a36');
  const [eGpaStr, setEGpaStr] = useState<string>('200');
  const [fyMpaStr, setFyMpaStr] = useState<string>('250');

  const [endId, setEndId] = useState<string>('pinned-pinned');
  const [kMode, setKMode] = useState<'theoretical' | 'recommended'>('theoretical');
  const [kStr, setKStr] = useState<string>('1.0');

  const [lengthStr, setLengthStr] = useState<string>('2000');
  const [section, setSection] = useState<'rect' | 'circular'>('rect');
  const [bStr, setBStr] = useState<string>('40');
  const [hStr, setHStr] = useState<string>('60');
  const [dStr, setDStr] = useState<string>('50');
  const [phiStr, setPhiStr] = useState<string>('0.90');

  const [copied, setCopied] = useState<boolean>(false);

  const handleMaterialChange = (id: string) => {
    setMatId(id);
    const preset = MATERIAL_PRESETS.find((m) => m.id === id);
    if (preset) {
      setEGpaStr(preset.eGpa);
      setFyMpaStr(preset.fyMpa);
    }
  };

  const handleEndConditionChange = (id: string, mode: 'theoretical' | 'recommended' = kMode) => {
    setEndId(id);
    const preset = END_CONDITIONS.find((c) => c.id === id);
    if (preset) {
      setKStr(mode === 'theoretical' ? preset.kTheoretical : preset.kRecommended);
    }
  };

  const handleKModeChange = (mode: 'theoretical' | 'recommended') => {
    setKMode(mode);
    const preset = END_CONDITIONS.find((c) => c.id === endId);
    if (preset) {
      setKStr(mode === 'theoretical' ? preset.kTheoretical : preset.kRecommended);
    }
  };

  const handleReset = () => {
    setMatId('steel-a36');
    setEGpaStr('200');
    setFyMpaStr('250');
    setEndId('pinned-pinned');
    setKMode('theoretical');
    setKStr('1.0');
    setLengthStr('2000');
    setSection('rect');
    setBStr('40');
    setHStr('60');
    setDStr('50');
    setPhiStr('0.90');
    setCopied(false);
  };

  const result = useMemo(() => {
    const eGpa = parsePositive(eGpaStr);
    const fy = parsePositive(fyMpaStr);
    const K = parsePositive(kStr);
    const L = parsePositive(lengthStr);
    const phi = parsePositive(phiStr);

    let I = Number.NaN;
    let A = Number.NaN;
    if (section === 'rect') {
      const b = parsePositive(bStr);
      const h = parsePositive(hStr);
      if (Number.isFinite(b) && Number.isFinite(h)) {
        I = Math.min(b * Math.pow(h, 3), h * Math.pow(b, 3)) / 12;
        A = b * h;
      }
    } else {
      const d = parsePositive(dStr);
      if (Number.isFinite(d)) {
        I = (Math.PI * Math.pow(d, 4)) / 64;
        A = (Math.PI * d * d) / 4;
      }
    }

    if (
      !Number.isFinite(eGpa) ||
      !Number.isFinite(fy) ||
      !Number.isFinite(K) ||
      !Number.isFinite(L) ||
      !Number.isFinite(phi) ||
      phi > 1 ||
      !Number.isFinite(I) ||
      !Number.isFinite(A)
    ) {
      return { valid: false as const };
    }

    const E = eGpa * 1000; // GPa -> MPa (N/mm^2)
    const r = Math.sqrt(I / A);
    const KL = K * L;
    const slenderness = KL / r;

    // 1. Ideal Euler elastic critical load & stress
    const PeN = (Math.PI * Math.PI * E * I) / (KL * KL);
    const PeKn = PeN / 1000;
    const Fe = (Math.PI * Math.PI * E) / (slenderness * slenderness);
    const PyN = A * fy;
    const PyKn = PyN / 1000;
    const eulerExceedsYield = PeN > PyN;

    // 2. AISC 360 Chapter E (Section E3) flexural buckling stress & LRFD capacity
    const slendernessLimit = 4.71 * Math.sqrt(E / fy);
    const isInelastic = slenderness <= slendernessLimit;
    const Fcr = isInelastic ? Math.pow(0.658, fy / Fe) * fy : 0.877 * Fe;
    const PnKn = (Fcr * A) / 1000;
    const phiPnKn = phi * PnKn;

    return {
      valid: true as const,
      E,
      fy,
      K,
      L,
      phi,
      I,
      A,
      r,
      KL,
      slenderness,
      slendernessLimit,
      isInelastic,
      Fe,
      PeKn,
      PyKn,
      eulerExceedsYield,
      Fcr,
      PnKn,
      phiPnKn,
    };
  }, [eGpaStr, fyMpaStr, kStr, lengthStr, section, bStr, hStr, dStr, phiStr]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const summary = [
      `Column Buckling Summary`,
      `Effective Length KL = ${result.KL.toFixed(1)} mm (K = ${result.K}, L = ${result.L} mm)`,
      `Slenderness KL/r = ${result.slenderness.toFixed(2)} (AISC 360 limit 4.71*sqrt(E/Fy) = ${result.slendernessLimit.toFixed(2)})`,
      `Ideal Euler Pe = ${result.PeKn.toFixed(2)} kN (Fe = ${result.Fe.toFixed(2)} MPa, Yield Py = ${result.PyKn.toFixed(2)} kN)`,
      `AISC 360 E3 (${result.isInelastic ? 'Inelastic' : 'Elastic'}): Fcr = ${result.Fcr.toFixed(2)} MPa, Pn = ${result.PnKn.toFixed(2)} kN, phi*Pn = ${result.phiPnKn.toFixed(2)} kN`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!result.valid) return;
    const rows = [
      'parameter,value,unit,notes',
      `E,${(result.E / 1000).toFixed(2)},GPa,Elastic modulus`,
      `Fy,${result.fy.toFixed(2)},MPa,Yield strength`,
      `K,${result.K.toFixed(3)},-,Effective length factor`,
      `L,${result.L.toFixed(2)},mm,Unbraced column length`,
      `A,${result.A.toFixed(2)},mm2,Gross cross-section area`,
      `I_min,${result.I.toFixed(2)},mm4,Governing minimum moment of inertia`,
      `r_min,${result.r.toFixed(3)},mm,Governing radius of gyration sqrt(I/A)`,
      `KL_over_r,${result.slenderness.toFixed(3)},-,Slenderness ratio`,
      `AISC_limit,${result.slendernessLimit.toFixed(3)},-,4.71*sqrt(E/Fy)`,
      `Euler_Pe,${result.PeKn.toFixed(3)},kN,pi^2*E*I/(K*L)^2`,
      `Euler_Fe,${result.Fe.toFixed(3)},MPa,pi^2*E/(K*L/r)^2`,
      `Yield_Py,${result.PyKn.toFixed(3)},kN,A*Fy squash load limit`,
      `AISC_Fcr,${result.Fcr.toFixed(3)},MPa,${result.isInelastic ? '0.658^(Fy/Fe)*Fy' : '0.877*Fe'}`,
      `AISC_Pn,${result.PnKn.toFixed(3)},kN,Nominal compressive strength Fcr*A`,
      `AISC_phi_Pn,${result.phiPnKn.toFixed(3)},kN,LRFD design strength (phi=${result.phi})`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'column-buckling-aisc360-euler.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Column Parameters</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Material Preset
            </label>
            <select
              data-testid="select-material"
              value={matId}
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              {MATERIAL_PRESETS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
              <option value="custom">Custom Material</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Elastic Modulus E (GPa)
              </label>
              <input
                data-testid="input-e"
                type="text"
                inputMode="decimal"
                value={eGpaStr}
                onChange={(e) => {
                  setMatId('custom');
                  setEGpaStr(e.target.value);
                }}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Yield Stress Fy (MPa)
              </label>
              <input
                data-testid="input-fy"
                type="text"
                inputMode="decimal"
                value={fyMpaStr}
                onChange={(e) => {
                  setMatId('custom');
                  setFyMpaStr(e.target.value);
                }}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              End Condition &amp; K Factor
            </label>
            <select
              data-testid="select-end"
              value={endId}
              onChange={(e) => handleEndConditionChange(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 mb-2"
            >
              {END_CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (K_th={c.kTheoretical} / K_rec={c.kRecommended})
                </option>
              ))}
              <option value="custom">Custom K Factor</option>
            </select>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                data-testid="k-mode-theoretical"
                onClick={() => handleKModeChange('theoretical')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  kMode === 'theoretical'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Theoretical K
              </button>
              <button
                type="button"
                data-testid="k-mode-recommended"
                onClick={() => handleKModeChange('recommended')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  kMode === 'recommended'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                AISC Rec. K
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Effective K
                </label>
                <input
                  data-testid="input-k"
                  type="text"
                  inputMode="decimal"
                  value={kStr}
                  onChange={(e) => {
                    setEndId('custom');
                    setKStr(e.target.value);
                  }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  AISC φc (&le;1.0)
                </label>
                <input
                  data-testid="input-phi"
                  type="text"
                  inputMode="decimal"
                  value={phiStr}
                  onChange={(e) => setPhiStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Unbraced Length L (mm)
            </label>
            <input
              data-testid="input-length"
              type="text"
              inputMode="decimal"
              value={lengthStr}
              onChange={(e) => setLengthStr(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Cross-Section
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['rect', 'circular'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  data-testid={`section-${s}`}
                  onClick={() => setSection(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-black border transition-all ${
                    section === s
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s === 'rect' ? 'Rectangular' : 'Solid Circular'}
                </button>
              ))}
            </div>

            {section === 'rect' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Width b (mm)
                  </label>
                  <input
                    data-testid="input-b"
                    type="text"
                    inputMode="decimal"
                    value={bStr}
                    onChange={(e) => setBStr(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Depth h (mm)
                  </label>
                  <input
                    data-testid="input-h"
                    type="text"
                    inputMode="decimal"
                    value={hStr}
                    onChange={(e) => setHStr(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Diameter d (mm)
                </label>
                <input
                  data-testid="input-d"
                  type="text"
                  inputMode="decimal"
                  value={dStr}
                  onChange={(e) => setDStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Ideal Euler &amp; AISC 360 Chapter E Results
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Ideal Euler Buckling Load Pe
                </div>
                <div data-testid="result-euler-pe" className="text-3xl font-black text-emerald-800">
                  {result.valid ? `${fmt(result.PeKn, 2)} kN` : '—'}
                </div>
                <div data-testid="result-euler-fe" className="text-xs font-bold text-emerald-700 mt-1">
                  {result.valid
                    ? `Fe = ${fmt(result.Fe, 2)} MPa • Yield Py = ${fmt(result.PyKn, 2)} kN`
                    : 'Enter positive finite numeric parameters'}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                  AISC 360 Design Capacity φcPn
                </div>
                <div data-testid="result-aisc-phipn" className="text-3xl font-black text-blue-800">
                  {result.valid ? `${fmt(result.phiPnKn, 2)} kN` : '—'}
                </div>
                <div data-testid="result-aisc-regime" className="text-xs font-bold text-blue-700 mt-1">
                  {result.valid
                    ? `${result.isInelastic ? 'Inelastic (Eq. E3-2)' : 'Elastic (Eq. E3-3)'} • Fcr = ${fmt(result.Fcr, 2)} MPa • Pn = ${fmt(result.PnKn, 2)} kN`
                    : '—'}
                </div>
              </div>
            </div>

            {result.valid && result.eulerExceedsYield && (
              <div
                data-testid="yield-warning"
                className="mb-4 rounded-2xl p-4 border bg-amber-50 border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Pure Euler Pe ({fmt(result.PeKn, 2)} kN) exceeds yield squash load A·Fy ({fmt(result.PyKn, 2)} kN). Ideal elastic buckling is non-governing for stocky columns; inelastic buckling or yielding (AISC 360 Eq. E3-2) governs.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Slenderness KL/r</div>
                <div data-testid="result-slenderness" className="text-lg font-black text-slate-800">
                  {result.valid ? fmt(result.slenderness, 1) : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">4.71√(E/Fy)</div>
                <div data-testid="result-limit" className="text-lg font-black text-slate-800">
                  {result.valid ? fmt(result.slendernessLimit, 1) : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Min Radius r</div>
                <div data-testid="result-radius" className="text-lg font-black text-slate-800">
                  {result.valid ? `${fmt(result.r, 2)} mm` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Area A / Min I</div>
                <div data-testid="result-section" className="text-sm font-black text-slate-800">
                  {result.valid ? `${fmt(result.A, 0)} mm² / ${fmt(result.I, 0)} mm⁴` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                <div>
                  <strong>Governing Equations:</strong> Ideal Euler{' '}
                  <code>Pe = π²EI/(KL)²</code>, <code>Fe = π²E/(KL/r)²</code>,{' '}
                  <code>r = √(I/A)</code>. Per AISC 360 Chapter E (Section E3): for{' '}
                  <code>KL/r ≤ 4.71√(E/Fy)</code>, <code>Fcr = [0.658^(Fy/Fe)]·Fy</code>; for{' '}
                  <code>KL/r &gt; 4.71√(E/Fy)</code>, <code>Fcr = 0.877·Fe</code>; LRFD design strength{' '}
                  <code>φcPn = 0.90·Fcr·Ag</code>. Recommended design K factors (Pinned 1.0, Fixed-Fixed 0.65, Fixed-Pinned 0.80, Cantilever 2.10) account for practical end-restraint tolerances.
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
