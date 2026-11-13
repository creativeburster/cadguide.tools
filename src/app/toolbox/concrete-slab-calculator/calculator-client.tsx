'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Settings,
  Zap,
  Info,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface SupportCondition {
  id: string;
  label: string;
  spanRatio: number; // ACI 318 Table 7.3.1.1 divisor (20, 24, 28, 10)
  defaultMomentCoeff: string; // w_u * l^2 / C (8 for simple, 2 for cantilever)
}

const SUPPORT_CONDITIONS: SupportCondition[] = [
  { id: 'simply-supported', label: 'Simply Supported (l / 20)', spanRatio: 20, defaultMomentCoeff: '8' },
  { id: 'one-end-cont', label: 'One End Continuous (l / 24)', spanRatio: 24, defaultMomentCoeff: '10' },
  { id: 'both-ends-cont', label: 'Both Ends Continuous (l / 28)', spanRatio: 28, defaultMomentCoeff: '11' },
  { id: 'cantilever', label: 'Cantilever (l / 10)', spanRatio: 10, defaultMomentCoeff: '2' },
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

export default function ConcreteSlabCalculatorClient() {
  const [supportId, setSupportId] = useState<string>('simply-supported');
  const [spanMStr, setSpanMStr] = useState<string>('4');
  const [thicknessMmStr, setThicknessMmStr] = useState<string>('200');
  const [coverMmStr, setCoverMmStr] = useState<string>('25');
  const [wuStr, setWuStr] = useState<string>('12');
  const [momentDenomStr, setMomentDenomStr] = useState<string>('8');
  const [fcStr, setFcStr] = useState<string>('28');
  const [fyStr, setFyStr] = useState<string>('420');
  const [phiStr, setPhiStr] = useState<string>('0.90');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSupportChange = (id: string) => {
    setSupportId(id);
    const cond = SUPPORT_CONDITIONS.find((c) => c.id === id);
    if (cond) {
      setMomentDenomStr(cond.defaultMomentCoeff);
    }
  };

  const handleReset = () => {
    setSupportId('simply-supported');
    setSpanMStr('4');
    setThicknessMmStr('200');
    setCoverMmStr('25');
    setWuStr('12');
    setMomentDenomStr('8');
    setFcStr('28');
    setFyStr('420');
    setPhiStr('0.90');
    setCopied(false);
  };

  const result = useMemo(() => {
    const cond = SUPPORT_CONDITIONS.find((c) => c.id === supportId) ?? SUPPORT_CONDITIONS[0];
    const spanM = parsePositive(spanMStr);
    const hMm = parsePositive(thicknessMmStr);
    const coverMm = parsePositive(coverMmStr);
    const wu = parsePositive(wuStr);
    const denom = parsePositive(momentDenomStr);
    const fc = parsePositive(fcStr);
    const fy = parsePositive(fyStr);
    const phi = parsePositive(phiStr);

    if (
      !Number.isFinite(spanM) ||
      !Number.isFinite(hMm) ||
      !Number.isFinite(coverMm) ||
      !Number.isFinite(wu) ||
      !Number.isFinite(denom) ||
      !Number.isFinite(fc) ||
      !Number.isFinite(fy) ||
      !Number.isFinite(phi) ||
      phi > 1 ||
      hMm <= coverMm
    ) {
      return { valid: false as const };
    }

    const spanMm = spanM * 1000;
    const bMm = 1000; // 1 m unit strip width
    const dMm = hMm - coverMm;

    // 1. ACI 318M Table 7.3.1.1 minimum thickness for normalweight one-way slab
    // Base ratios apply for fy = 420 MPa; ACI 318M metric modifier (0.4 + fy/700)
    const fyFactor = 0.4 + fy / 700;
    const hMinMm = (spanMm / cond.spanRatio) * fyFactor;
    const thicknessOk = hMm >= hMinMm;

    // 2. Factored bending moment Mu = w_u * l^2 / C (kN*m per m width)
    const MuKnm = (wu * spanM * spanM) / denom;
    const MuNmm = MuKnm * 1e6;

    // 3. ACI 318 Whitney rectangular stress block flexural reinforcement (per 1000 mm strip)
    const disc = 1 - (2 * MuNmm) / (phi * 0.85 * fc * bMm * dMm * dMm);
    const flexuralCapacityExceeded = disc <= 0;

    let AsReq = Number.NaN;
    let aMm = Number.NaN;
    let phiMnKnm = Number.NaN;

    // Minimum flexural reinforcement per ACI 318-19 Section 7.6.1.1:
    // As,min = 0.0018 * Ag = 0.0018 * b * h
    const rhoMin = 0.0018;
    const AsMin = rhoMin * bMm * hMm;
    let AsDesign = Number.NaN;

    if (!flexuralCapacityExceeded) {
      const rhoReq = ((0.85 * fc) / fy) * (1 - Math.sqrt(disc));
      AsReq = rhoReq * bMm * dMm;
      AsDesign = Math.max(AsReq, AsMin);
      aMm = (AsDesign * fy) / (0.85 * fc * bMm);
      phiMnKnm = (phi * AsDesign * fy * (dMm - aMm / 2)) / 1e6;
    }

    return {
      valid: true as const,
      cond,
      spanM,
      hMm,
      dMm,
      fyFactor,
      hMinMm,
      thicknessOk,
      MuKnm,
      flexuralCapacityExceeded,
      AsReq,
      AsMin,
      AsDesign,
      aMm,
      phiMnKnm,
      fc,
      fy,
      phi,
    };
  }, [supportId, spanMStr, thicknessMmStr, coverMmStr, wuStr, momentDenomStr, fcStr, fyStr, phiStr]);

  const handleCopySummary = async () => {
    if (!result.valid || result.flexuralCapacityExceeded) return;
    const text = [
      `ACI 318 One-Way Solid Slab Check (${result.cond.label})`,
      `Clear Span l = ${result.spanM.toFixed(2)} m | fy = ${result.fy.toFixed(0)} MPa | f'c = ${result.fc.toFixed(0)} MPa`,
      `Minimum Thickness h_min = ${result.hMinMm.toFixed(1)} mm (fy factor = ${result.fyFactor.toFixed(3)}) vs Adopted h = ${result.hMm.toFixed(1)} mm`,
      `Factored Moment Mu = ${result.MuKnm.toFixed(3)} kN*m/m | Effective Depth d = ${result.dMm.toFixed(1)} mm`,
      `Required As = ${result.AsReq.toFixed(2)} mm2/m | Min As (ACI 318-19 7.6.1.1) = ${result.AsMin.toFixed(2)} mm2/m | Governing As = ${result.AsDesign.toFixed(2)} mm2/m`,
      `Design Moment Capacity phi*Mn = ${result.phiMnKnm.toFixed(3)} kN*m/m (a = ${result.aMm.toFixed(2)} mm)`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!result.valid || result.flexuralCapacityExceeded) return;
    const rows = [
      'parameter,value,unit,notes',
      `support_condition,${result.cond.label},-,ACI 318 Table 7.3.1.1`,
      `clear_span,${result.spanM.toFixed(3)},m,Normalweight nonprestressed one-way slab`,
      `fy_factor,${result.fyFactor.toFixed(4)},-,0.4 + fy/700`,
      `h_min_aci318,${result.hMinMm.toFixed(2)},mm,(l/${result.cond.spanRatio})*(0.4 + fy/700)`,
      `adopted_h,${result.hMm.toFixed(2)},mm,Adopted slab thickness`,
      `effective_depth_d,${result.dMm.toFixed(2)},mm,h - cover_offset`,
      `Mu,${result.MuKnm.toFixed(3)},kN*m/m,wu*l^2/C per 1000 mm strip`,
      `As_required,${result.AsReq.toFixed(2)},mm2/m,Flexural demand`,
      `As_min,${result.AsMin.toFixed(2)},mm2/m,ACI 318-19 Section 7.6.1.1 (0.0018*b*h)`,
      `As_design,${result.AsDesign.toFixed(2)},mm2/m,max(As_required;As_min)`,
      `stress_block_a,${result.aMm.toFixed(3)},mm,As_design*fy/(0.85*fc*b)`,
      `phi_Mn,${result.phiMnKnm.toFixed(3)},kN*m/m,Design flexural strength phi=${result.phi}`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aci318-one-way-slab-design.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Slab Inputs</h2>
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
              Support Condition (ACI 318 Table 7.3.1.1)
            </label>
            <select
              data-testid="select-support"
              value={supportId}
              onChange={(e) => handleSupportChange(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              {SUPPORT_CONDITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Clear Span l (m)
              </label>
              <input
                data-testid="input-span"
                type="text"
                inputMode="decimal"
                value={spanMStr}
                onChange={(e) => setSpanMStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Adopted h (mm)
              </label>
              <input
                data-testid="input-thickness"
                type="text"
                inputMode="decimal"
                value={thicknessMmStr}
                onChange={(e) => setThicknessMmStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Cover + d_bar/2 (mm)
              </label>
              <input
                data-testid="input-cover"
                type="text"
                inputMode="decimal"
                value={coverMmStr}
                onChange={(e) => setCoverMmStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Factored wu (kN/m²)
              </label>
              <input
                data-testid="input-wu"
                type="text"
                inputMode="decimal"
                value={wuStr}
                onChange={(e) => setWuStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Moment Coeff C (wu·l²/C)
              </label>
              <input
                data-testid="input-moment-denom"
                type="text"
                inputMode="decimal"
                value={momentDenomStr}
                onChange={(e) => setMomentDenomStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Strength Factor φ
              </label>
              <input
                data-testid="input-phi"
                type="text"
                inputMode="decimal"
                value={phiStr}
                onChange={(e) => setPhiStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Concrete f&apos;c (MPa)
              </label>
              <input
                data-testid="input-fc"
                type="text"
                inputMode="decimal"
                value={fcStr}
                onChange={(e) => setFcStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Rebar Yield fy (MPa)
              </label>
              <input
                data-testid="input-fy"
                type="text"
                inputMode="decimal"
                value={fyStr}
                onChange={(e) => setFyStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  ACI 318 One-Way Slab Thickness &amp; Flexural Design
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid || result.flexuralCapacityExceeded}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid || result.flexuralCapacityExceeded}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {result.valid && result.flexuralCapacityExceeded && (
              <div
                data-testid="flexural-overflow-warning"
                className="mb-4 rounded-2xl p-4 border bg-red-50 border-red-200 flex items-start gap-2.5 text-sm font-bold text-red-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>
                  Moment demand Mu ({result.MuKnm.toFixed(2)} kN·m/m) exceeds singly-reinforced Whitney block limit for d = {result.dMm.toFixed(1)} mm and f&apos;c = {result.fc} MPa. Increase slab thickness h or f&apos;c.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  ACI 318 Min Thickness h_min
                </div>
                <div data-testid="result-hmin" className="text-2xl font-black text-emerald-800">
                  {result.valid ? `${fmt(result.hMinMm, 1)} mm` : '—'}
                </div>
                <div data-testid="result-hmin-status" className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  {result.valid ? (
                    result.thicknessOk ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Adopted h ({fmt(result.hMm, 0)} mm) &ge; h_min (Deflection calc waived)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-amber-800">
                          Adopted h ({fmt(result.hMm, 0)} mm) &lt; h_min — explicit deflection check required
                        </span>
                      </>
                    )
                  ) : (
                    '—'
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Factored Design Moment Mu
                </div>
                <div data-testid="result-mu" className="text-2xl font-black text-blue-800">
                  {result.valid ? `${fmt(result.MuKnm, 2)} kN·m/m` : '—'}
                </div>
                <div className="text-xs font-bold text-blue-700 mt-1">
                  {result.valid ? `Effective depth d = ${fmt(result.dMm, 1)} mm (1 m strip)` : '—'}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  Governing Steel Area As (1 m strip)
                </div>
                <div data-testid="result-as-design" className="text-2xl font-black text-orange-800">
                  {result.valid && !result.flexuralCapacityExceeded ? `${fmt(result.AsDesign, 2)} mm²/m` : '—'}
                </div>
                <div data-testid="result-as-breakdown" className="text-xs font-bold text-orange-700 mt-1">
                  {result.valid && !result.flexuralCapacityExceeded
                    ? `Req As = ${fmt(result.AsReq, 2)} • Min As = ${fmt(result.AsMin, 2)} mm²/m`
                    : '—'}
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
                  Design Flexural Capacity φMn
                </div>
                <div data-testid="result-phimn" className="text-2xl font-black text-purple-800">
                  {result.valid && !result.flexuralCapacityExceeded ? `${fmt(result.phiMnKnm, 2)} kN·m/m` : '—'}
                </div>
                <div className="text-xs font-bold text-purple-700 mt-1">
                  {result.valid && !result.flexuralCapacityExceeded
                    ? `Stress block a = ${fmt(result.aMm, 2)} mm • fy mod = ${result.fyFactor.toFixed(3)}`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                <div>
                  <strong>Scope &amp; ACI 318 Equations:</strong> Valid for normalweight, nonprestressed solid one-way slabs without attachments damaged by large deflections. Per ACI 318M Table 7.3.1.1, baseline <code>h_min</code> uses <code>ℓ/20</code>, <code>ℓ/24</code>, <code>ℓ/28</code>, or <code>ℓ/10</code> multiplied by <code>(0.4 + fy/700)</code> for <code>fy</code> in MPa (ACI 318 US customary edition specifies <code>(0.4 + fy/100,000)</code> for <code>fy</code> in psi). Flexural reinforcement solves Whitney stress block{' '}
                  <code>a = As·fy/(0.85·f&apos;c·b)</code>, <code>φMn = φ·As·fy·(d − a/2)</code>, and ACI 318-19 Section 7.6.1.1 minimum{' '}
                  <code>As,min = 0.0018·b·h</code>.
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
