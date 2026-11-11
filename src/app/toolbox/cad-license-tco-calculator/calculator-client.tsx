'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Scale, ExternalLink, Download, RotateCcw } from 'lucide-react';

interface VendorPricingLink {
  slug: string;
  name: string;
  licensingModel: string;
  pricingUrl: string;
}

/**
 * Direct links to official vendor pricing / store pages.
 * Regional subscription and perpetual license prices vary by country, currency,
 * tax, and reseller, so no vendor price is hardcoded here.
 */
const VENDOR_PRICING_LINKS: VendorPricingLink[] = [
  {
    slug: 'autocad',
    name: 'Autodesk AutoCAD',
    licensingModel: 'Subscription',
    pricingUrl: 'https://www.autodesk.com/products/autocad/subscribe',
  },
  {
    slug: 'bricscad',
    name: 'BricsCAD',
    licensingModel: 'Perpetual / Subscription',
    pricingUrl: 'https://www.bricsys.com/en-us/store',
  },
  {
    slug: 'gstarcad',
    name: 'GstarCAD',
    licensingModel: 'Perpetual / Subscription',
    pricingUrl: 'https://www.gstarcad.net/buy/',
  },
  {
    slug: 'zwcad',
    name: 'ZWCAD',
    licensingModel: 'Perpetual / Subscription',
    pricingUrl: 'https://www.zwsoft.com/product/zwcad/pricing',
  },
  {
    slug: 'rhino-3d',
    name: 'McNeel Rhino 3D',
    licensingModel: 'Perpetual + Paid Upgrades',
    pricingUrl: 'https://www.rhino3d.com/buy/',
  },
  {
    slug: 'solidworks',
    name: 'Dassault SolidWorks',
    licensingModel: 'Subscription / Term / Perpetual',
    pricingUrl: 'https://www.solidworks.com/how-to-buy',
  },
  {
    slug: 'freecad',
    name: 'FreeCAD',
    licensingModel: 'Open Source ($0 License)',
    pricingUrl: 'https://www.freecad.org/',
  },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const val = Number(trimmed);
  return Number.isFinite(val) ? val : NaN;
}

export default function CadLicenseTcoCalculatorClient() {
  // Sample / illustrative planning inputs (all user-editable)
  const [seatsStr, setSeatsStr] = useState<string>('10');
  const [yearsStr, setYearsStr] = useState<string>('3');
  const [subFeeAStr, setSubFeeAStr] = useState<string>('1800');
  const [escalationAStr, setEscalationAStr] = useState<string>('5');
  const [perpFeeBStr, setPerpFeeBStr] = useState<string>('1200');
  const [maintRateBStr, setMaintRateBStr] = useState<string>('20');
  const [trainingPerSeatStr, setTrainingPerSeatStr] = useState<string>('300');
  const [hardwarePerSeatStr, setHardwarePerSeatStr] = useState<string>('500');

  const applyPreset = (preset: 'default-3yr' | 'enterprise-5yr' | 'pilot-1yr') => {
    if (preset === 'default-3yr') {
      setSeatsStr('10');
      setYearsStr('3');
      setSubFeeAStr('1800');
      setEscalationAStr('5');
      setPerpFeeBStr('1200');
      setMaintRateBStr('20');
      setTrainingPerSeatStr('300');
      setHardwarePerSeatStr('500');
    } else if (preset === 'enterprise-5yr') {
      setSeatsStr('25');
      setYearsStr('5');
      setSubFeeAStr('2000');
      setEscalationAStr('4');
      setPerpFeeBStr('1500');
      setMaintRateBStr('18');
      setTrainingPerSeatStr('400');
      setHardwarePerSeatStr('800');
    } else {
      setSeatsStr('5');
      setYearsStr('1');
      setSubFeeAStr('1500');
      setEscalationAStr('0');
      setPerpFeeBStr('1500');
      setMaintRateBStr('20');
      setTrainingPerSeatStr('0');
      setHardwarePerSeatStr('0');
    }
  };

  const handleReset = () => {
    applyPreset('default-3yr');
  };

  /**
   * Step-by-step TCO unit derivation (Currency unit = illustrative USD or local currency):
   * Given team seats S (integer >= 1), evaluation horizon Y (integer 1..10 years),
   * one-time training cost C_train [currency/seat], and workstation hardware cost C_hw [currency/seat]:
   *
   * 1. Option A (Annual Subscription with compound escalation e_A [%/yr]):
   *    - Year y software cost per seat (y = 1..Y):
   *      c_{A,y} = P_{sub,A} * (1 + e_A / 100)^(y - 1) [currency/(seat*yr)]
   *    - Total Y-year software cost per seat:
   *      C_{soft,A/seat} = sum_{y=1..Y} c_{A,y} [currency/seat]
   *    - Total Y-year TCO per seat:
   *      C_{TCO,A/seat} = C_{soft,A/seat} + C_train + C_hw [currency/seat]
   *    - Team Y-year TCO:
   *      TCO_A = S * C_{TCO,A/seat} [currency]
   *
   * 2. Option B (Year-1 Perpetual Buyout P_{perp,B} + Years 2..Y Annual Maintenance m_B [%/yr]):
   *    - Year 1 software cost per seat: c_{B,1} = P_{perp,B} [currency/seat]
   *    - Year y (y >= 2) maintenance cost per seat: c_{B,y} = P_{perp,B} * (m_B / 100) [currency/(seat*yr)]
   *    - Total Y-year software cost per seat:
   *      C_{soft,B/seat} = P_{perp,B} + (Y - 1) * P_{perp,B} * (m_B / 100) [currency/seat]
   *    - Total Y-year TCO per seat:
   *      C_{TCO,B/seat} = C_{soft,B/seat} + C_train + C_hw [currency/seat]
   *    - Team Y-year TCO:
   *      TCO_B = S * C_{TCO,B/seat} [currency]
   *
   * 3. Net Difference & Relative TCO Reduction:
   *    - Net Savings = |TCO_A - TCO_B| [currency]
   *    - Savings % = (|TCO_A - TCO_B| / max(TCO_A, TCO_B)) * 100 [%] (0% when max = 0)
   */
  const calc = useMemo(() => {
    const S = parseStrictNumber(seatsStr);
    const Y = parseStrictNumber(yearsStr);
    const pSubA = parseStrictNumber(subFeeAStr);
    const escA = parseStrictNumber(escalationAStr);
    const pPerpB = parseStrictNumber(perpFeeBStr);
    const maintB = parseStrictNumber(maintRateBStr);
    const cTrain = parseStrictNumber(trainingPerSeatStr);
    const cHw = parseStrictNumber(hardwarePerSeatStr);

    if (
      !Number.isFinite(S) ||
      !Number.isFinite(Y) ||
      !Number.isFinite(pSubA) ||
      !Number.isFinite(escA) ||
      !Number.isFinite(pPerpB) ||
      !Number.isFinite(maintB) ||
      !Number.isFinite(cTrain) ||
      !Number.isFinite(cHw) ||
      S < 1 ||
      !Number.isInteger(S) ||
      Y < 1 ||
      Y > 10 ||
      !Number.isInteger(Y) ||
      pSubA < 0 ||
      escA < 0 ||
      escA > 100 ||
      pPerpB < 0 ||
      maintB < 0 ||
      maintB > 100 ||
      cTrain < 0 ||
      cHw < 0
    ) {
      return { isValid: false as const };
    }

    const yearlySubPerSeat: number[] = [];
    let softPerSeatA = 0;
    for (let y = 1; y <= Y; y++) {
      const cy = pSubA * Math.pow(1 + escA / 100, y - 1);
      yearlySubPerSeat.push(cy);
      softPerSeatA += cy;
    }

    const yearlyPerpPerSeat: number[] = [];
    let softPerSeatB = 0;
    for (let y = 1; y <= Y; y++) {
      const cy = y === 1 ? pPerpB : pPerpB * (maintB / 100);
      yearlyPerpPerSeat.push(cy);
      softPerSeatB += cy;
    }

    const nonLicensePerSeat = cTrain + cHw;
    const tcoPerSeatA = softPerSeatA + nonLicensePerSeat;
    const tcoPerSeatB = softPerSeatB + nonLicensePerSeat;
    const totalTeamA = tcoPerSeatA * S;
    const totalTeamB = tcoPerSeatB * S;
    const diff = totalTeamA - totalTeamB;
    const absSavings = Math.abs(diff);
    const maxTotal = Math.max(totalTeamA, totalTeamB);
    const savingsPct = maxTotal > 0 ? (absSavings / maxTotal) * 100 : 0;

    if (
      !Number.isFinite(tcoPerSeatA) ||
      !Number.isFinite(tcoPerSeatB) ||
      !Number.isFinite(totalTeamA) ||
      !Number.isFinite(totalTeamB) ||
      !Number.isFinite(savingsPct)
    ) {
      return { isValid: false as const };
    }

    const lowerLabel =
      Math.abs(diff) < 0.005
        ? 'Equal TCO'
        : diff > 0
          ? 'Option B (Perpetual + Maintenance)'
          : 'Option A (Subscription)';

    return {
      isValid: true as const,
      S,
      Y,
      pSubA,
      escA,
      pPerpB,
      maintB,
      cTrain,
      cHw,
      yearlySubPerSeat,
      yearlyPerpPerSeat,
      softPerSeatA,
      softPerSeatB,
      tcoPerSeatA,
      tcoPerSeatB,
      totalTeamA,
      totalTeamB,
      diff,
      absSavings,
      savingsPct,
      lowerLabel,
    };
  }, [
    seatsStr,
    yearsStr,
    subFeeAStr,
    escalationAStr,
    perpFeeBStr,
    maintRateBStr,
    trainingPerSeatStr,
    hardwarePerSeatStr,
  ]);

  const handleDownloadCsv = () => {
    if (!calc.isValid) return;
    const header = [
      'Seats',
      'Years',
      'Sub_Fee_A_per_Seat_Yr',
      'Escalation_A_pct',
      'Perp_Buyout_B_per_Seat',
      'Maintenance_B_pct',
      'Training_per_Seat',
      'Hardware_per_Seat',
      'Option_A_TCO_per_Seat',
      'Option_A_Team_TCO',
      'Option_B_TCO_per_Seat',
      'Option_B_Team_TCO',
      'Absolute_Difference',
      'Savings_pct',
    ].join(',');

    const row = [
      calc.S,
      calc.Y,
      calc.pSubA.toFixed(2),
      calc.escA.toFixed(2),
      calc.pPerpB.toFixed(2),
      calc.maintB.toFixed(2),
      calc.cTrain.toFixed(2),
      calc.cHw.toFixed(2),
      calc.tcoPerSeatA.toFixed(2),
      calc.totalTeamA.toFixed(2),
      calc.tcoPerSeatB.toFixed(2),
      calc.totalTeamB.toFixed(2),
      calc.absSavings.toFixed(2),
      calc.savingsPct.toFixed(2),
    ].join(',');

    const csv = `${header}\n${row}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cad-license-tco-comparison.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Sample Inputs Panel */}
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Sample TCO Inputs
                </h2>
                <p className="text-xs font-semibold text-amber-600">
                  Illustrative figures — enter quotes from vendor store
                </p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Sample Scenarios
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-default-3yr"
                onClick={() => applyPreset('default-3yr')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                10 Seats · 3 Yr
              </button>
              <button
                type="button"
                data-testid="preset-enterprise-5yr"
                onClick={() => applyPreset('enterprise-5yr')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                25 Seats · 5 Yr
              </button>
              <button
                type="button"
                data-testid="preset-pilot-1yr"
                onClick={() => applyPreset('pilot-1yr')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                5 Seats · 1 Yr
              </button>
            </div>
          </div>

          {/* Shared Team Scope */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
              1. Team Scope &amp; Implementation Costs (Sample Input)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Team Seats S (int ≥ 1)
                </label>
                <input
                  type="text"
                  data-testid="input-seats"
                  value={seatsStr}
                  onChange={(e) => setSeatsStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Horizon Y (1–10 years)
                </label>
                <input
                  type="text"
                  data-testid="input-years"
                  value={yearsStr}
                  onChange={(e) => setYearsStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Training / Seat (Sample USD)
                </label>
                <input
                  type="text"
                  data-testid="input-training"
                  value={trainingPerSeatStr}
                  onChange={(e) => setTrainingPerSeatStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Hardware / Seat (Sample USD)
                </label>
                <input
                  type="text"
                  data-testid="input-hardware"
                  value={hardwarePerSeatStr}
                  onChange={(e) => setHardwarePerSeatStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Option A: Subscription */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider">
              2. Option A — Subscription Model (Sample Input)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Annual Sub. / Seat (Sample USD/yr)
                </label>
                <input
                  type="text"
                  data-testid="input-sub-fee-a"
                  value={subFeeAStr}
                  onChange={(e) => setSubFeeAStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Escalation Rate (%/yr, typical 5)
                </label>
                <input
                  type="text"
                  data-testid="input-escalation-a"
                  value={escalationAStr}
                  onChange={(e) => setEscalationAStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Option B: Perpetual + Maintenance */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="text-xs font-black text-violet-600 uppercase tracking-wider">
              3. Option B — Perpetual + Maintenance (Sample Input)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Perpetual License / Seat (Sample USD)
                </label>
                <input
                  type="text"
                  data-testid="input-perp-fee-b"
                  value={perpFeeBStr}
                  onChange={(e) => setPerpFeeBStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Annual Maint. Yr 2..Y (%, typical 20)
                </label>
                <input
                  type="text"
                  data-testid="input-maint-rate-b"
                  value={maintRateBStr}
                  onChange={(e) => setMaintRateBStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70">
            <div className="flex items-start gap-2 text-xs text-amber-900 leading-relaxed">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Sample Inputs Only:</strong> CAD vendor prices vary by country, currency, local tax, and term
                promotions. Check the official vendor pricing links on the right and enter your actual regional quotes.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Results & Official Vendor Pricing Links */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Multi-Year TCO Projection
                </h2>
              </div>
              <button
                type="button"
                data-testid="btn-download-csv"
                disabled={!calc.isValid}
                onClick={handleDownloadCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A Card */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 border-t-4 border-t-blue-500 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Option A: Subscription</h3>
                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Recurring
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Software / Seat</div>
                    <div className="text-lg font-black font-mono text-slate-800">
                      <span data-testid="out-soft-seat-a">
                        {calc.isValid ? calc.softPerSeatA.toFixed(2) : '—'}
                      </span>{' '}
                      <span className="text-xs text-slate-400">USD</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Full TCO / Seat</div>
                    <div className="text-lg font-black font-mono text-slate-800">
                      <span data-testid="out-tco-seat-a">
                        {calc.isValid ? calc.tcoPerSeatA.toFixed(2) : '—'}
                      </span>{' '}
                      <span className="text-xs text-slate-400">USD</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <div className="text-xs font-bold text-blue-500 uppercase mb-1">
                    Option A Team Total TCO
                  </div>
                  <div className="text-2xl font-black font-mono text-blue-700">
                    <span data-testid="out-total-a">
                      {calc.isValid ? calc.totalTeamA.toFixed(2) : '—'}
                    </span>{' '}
                    <span className="text-sm font-bold text-blue-400">USD</span>
                  </div>
                </div>
                {calc.isValid && (
                  <div className="flex flex-wrap gap-1.5">
                    {calc.yearlySubPerSeat.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-0.5"
                      >
                        Y{idx + 1}: {c.toFixed(2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Option B Card */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 border-t-4 border-t-violet-500 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Option B: Perpetual + Maint.</h3>
                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    Buyout + Maint.
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Software / Seat</div>
                    <div className="text-lg font-black font-mono text-slate-800">
                      <span data-testid="out-soft-seat-b">
                        {calc.isValid ? calc.softPerSeatB.toFixed(2) : '—'}
                      </span>{' '}
                      <span className="text-xs text-slate-400">USD</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Full TCO / Seat</div>
                    <div className="text-lg font-black font-mono text-slate-800">
                      <span data-testid="out-tco-seat-b">
                        {calc.isValid ? calc.tcoPerSeatB.toFixed(2) : '—'}
                      </span>{' '}
                      <span className="text-xs text-slate-400">USD</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-violet-100">
                  <div className="text-xs font-bold text-violet-500 uppercase mb-1">
                    Option B Team Total TCO
                  </div>
                  <div className="text-2xl font-black font-mono text-violet-700">
                    <span data-testid="out-total-b">
                      {calc.isValid ? calc.totalTeamB.toFixed(2) : '—'}
                    </span>{' '}
                    <span className="text-sm font-bold text-violet-400">USD</span>
                  </div>
                </div>
                {calc.isValid && (
                  <div className="flex flex-wrap gap-1.5">
                    {calc.yearlyPerpPerSeat.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-0.5"
                      >
                        Y{idx + 1}: {c.toFixed(2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Banner */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lower Total Cost Option
                </div>
                <div data-testid="out-lower-option" className="text-base font-black text-emerald-400 mt-0.5">
                  {calc.isValid ? calc.lowerLabel : '—'}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Net Difference
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    <span data-testid="out-net-savings">
                      {calc.isValid ? calc.absSavings.toFixed(2) : '—'}
                    </span>{' '}
                    <span className="text-xs text-slate-400">USD</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Relative Savings
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-400">
                    <span data-testid="out-savings-pct">
                      {calc.isValid ? calc.savingsPct.toFixed(2) : '—'}
                    </span>
                    <span className="text-xs text-emerald-300">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800">TCO Accounting Equations &amp; Units:</div>
              <p>
                <strong>Option A (Subscription):</strong>{' '}
                <code>TCO_A = S × [ Σ_(y=1..Y) P_sub × (1 + e/100)^(y−1) + C_train + C_hw ]</code> (USD).
              </p>
              <p>
                <strong>Option B (Perpetual + Maintenance):</strong>{' '}
                <code>TCO_B = S × [ P_perp + (Y − 1) × P_perp × (m/100) + C_train + C_hw ]</code> (USD), where Year 1 is
                the initial perpetual buyout and Years <code>2..Y</code> apply the optional annual maintenance rate.
              </p>
              <p className="text-slate-500">
                Licensing structure references: Bricsys Help Center (<em>License types: Perpetual license &amp; BricsCAD
                Maintenance vs Subscription license</em>), GstarCAD Store, and McNeel Rhino Store.
              </p>
            </div>
          </div>

          {/* Official Vendor Pricing Pages Directory */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Check Official Regional CAD Pricing Pages
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify live local currency subscription and perpetual quotes directly on each vendor&apos;s official website:
              </p>
            </div>
            <div
              data-testid="vendor-pricing-links"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {VENDOR_PRICING_LINKS.map((v) => (
                <a
                  key={v.slug}
                  href={v.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all group"
                >
                  <div>
                    <div className="text-sm font-black text-slate-900 group-hover:text-blue-700">
                      {v.name}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {v.licensingModel}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
