'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Sun, Copy, Check, Info, Zap, Download } from 'lucide-react';

interface PvResult {
  valid: boolean;
  error?: string;
  dcCapacityKw: number;
  ilr: number;
  vocMaxV: number;
  vmpStcV: number;
  voltageMarginPct: number;
  withinDcLimit: boolean;
  annualMwh: number;
  co2Tonnes: number;
}

function solvePvSizing(
  modWattStr: string,
  vocStcStr: string,
  vmpStcStr: string,
  betaVocStr: string,
  tMinCStr: string,
  nsStr: string,
  npStr: string,
  invAcKwStr: string,
  invVdcMaxStr: string,
  pshStr: string,
  prPctStr: string,
  efStr: string
): PvResult {
  if ([modWattStr, vocStcStr, vmpStcStr, betaVocStr, tMinCStr, nsStr, npStr, invAcKwStr, invVdcMaxStr, pshStr, prPctStr, efStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All PV module, string configuration, inverter, and site yield parameters are required.', dcCapacityKw: 0, ilr: 0, vocMaxV: 0, vmpStcV: 0, voltageMarginPct: 0, withinDcLimit: false, annualMwh: 0, co2Tonnes: 0 };
  }
  const pMod = Number(modWattStr);
  const voc = Number(vocStcStr);
  const vmp = Number(vmpStcStr);
  const beta = Number(betaVocStr);
  const tMin = Number(tMinCStr);
  const ns = Number(nsStr);
  const np = Number(npStr);
  const pInv = Number(invAcKwStr);
  const vMaxInv = Number(invVdcMaxStr);
  const psh = Number(pshStr);
  const pr = Number(prPctStr);
  const ef = Number(efStr);

  if (![pMod, voc, vmp, beta, tMin, ns, np, pInv, vMaxInv, psh, pr, ef].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', dcCapacityKw: 0, ilr: 0, vocMaxV: 0, vmpStcV: 0, voltageMarginPct: 0, withinDcLimit: false, annualMwh: 0, co2Tonnes: 0 };
  }
  if (pMod <= 0 || voc <= 0 || vmp <= 0 || !Number.isInteger(ns) || ns < 1 || !Number.isInteger(np) || np < 1 || pInv <= 0 || vMaxInv <= 0 || psh <= 0 || pr <= 0 || pr > 100 || ef < 0) {
    return { valid: false, error: 'Require positive powers/voltages/PSH, integer series/parallel counts >= 1, 0 < PR <= 100%, and EF >= 0.', dcCapacityKw: 0, ilr: 0, vocMaxV: 0, vmpStcV: 0, voltageMarginPct: 0, withinDcLimit: false, annualMwh: 0, co2Tonnes: 0 };
  }

  const dcCapacityKw = (ns * np * pMod) / 1000;
  const ilr = dcCapacityKw / pInv;
  const vocMaxV = ns * voc * (1 + (beta / 100) * (tMin - 25));
  if (vocMaxV <= 0) {
    return { valid: false, error: 'Computed cold open-circuit voltage is <= 0; check beta_Voc and minimum temperature.', dcCapacityKw: 0, ilr: 0, vocMaxV: 0, vmpStcV: 0, voltageMarginPct: 0, withinDcLimit: false, annualMwh: 0, co2Tonnes: 0 };
  }
  const vmpStcV = ns * vmp;
  const voltageMarginPct = (1 - vocMaxV / vMaxInv) * 100;
  const withinDcLimit = vocMaxV <= vMaxInv;
  const annualMwh = (dcCapacityKw * psh * 365 * (pr / 100)) / 1000;
  const co2Tonnes = annualMwh * ef;

  return { valid: true, dcCapacityKw, ilr, vocMaxV, vmpStcV, voltageMarginPct, withinDcLimit, annualMwh, co2Tonnes };
}

export default function PVInverterSizingClient() {
  const [copied, setCopied] = useState(false);
  const [modWattStr, setModWattStr] = useState('550');
  const [vocStcStr, setVocStcStr] = useState('49.8');
  const [vmpStcStr, setVmpStcStr] = useState('41.8');
  const [betaVocStr, setBetaVocStr] = useState('-0.26');
  const [tMinStr, setTMinStr] = useState('-10');
  const [nsStr, setNsStr] = useState('20');
  const [npStr, setNpStr] = useState('12');
  const [invAcStr, setInvAcStr] = useState('100');
  const [vMaxStr, setVMaxStr] = useState('1100');
  const [pshStr, setPshStr] = useState('4.3');
  const [prStr, setPrStr] = useState('82');
  const [efStr, setEfStr] = useState('0.475');

  const res = solvePvSizing(modWattStr, vocStcStr, vmpStcStr, betaVocStr, tMinStr, nsStr, npStr, invAcStr, vMaxStr, pshStr, prStr, efStr);

  const handleCopy = () => {
    if (!res.valid) return;
    const text = [
      'Solar PV Inverter Sizing Summary',
      `DC Capacity: ${res.dcCapacityKw.toFixed(2)} kWp (${nsStr}S x ${npStr}P x ${modWattStr} Wp)`,
      `Inverter AC: ${invAcStr} kWac | DC/AC ILR: ${res.ilr.toFixed(4)}`,
      `Cold Voc_max (@ ${tMinStr} degC): ${res.vocMaxV.toFixed(2)} V vs ${vMaxStr} V limit`,
      `Estimated Annual Yield (PR=${prStr}%): ${res.annualMwh.toFixed(2)} MWh/yr`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['PV Inverter Sizing Report', ''],
      ['Module Power (Wp)', modWattStr],
      ['STC Voc / Vmp (V)', `${vocStcStr} / ${vmpStcStr}`],
      ['Voc Temp Coeff (%/degC)', betaVocStr],
      ['Min Site Temp (degC)', tMinStr],
      ['String Series x Parallel', `${nsStr} x ${npStr}`],
      ['Inverter AC Power (kWac)', invAcStr],
      ['Inverter Max DC Voltage (V)', vMaxStr],
      ['DC Array Rating (kWp)', res.dcCapacityKw.toFixed(3)],
      ['DC/AC Loading Ratio (ILR)', res.ilr.toFixed(4)],
      ['Max Cold String Voc (V)', res.vocMaxV.toFixed(3)],
      ['STC String Vmp (V)', res.vmpStcV.toFixed(2)],
      ['DC Voltage Margin (%)', res.voltageMarginPct.toFixed(3)],
      ['Estimated Annual Energy (MWh/yr)', res.annualMwh.toFixed(4)],
      ['Estimated Grid CO2 Avoided (tCO2e/yr)', res.co2Tonnes.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pv-inverter-sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Sun className="w-5 h-5" /></div>
            <h2 className="text-lg font-black text-slate-900">Array &amp; Inverter Specs</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Mod Wp</label>
              <input type="text" inputMode="decimal" data-testid="input-mod-w" value={modWattStr} onChange={(e) => setModWattStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Voc (V)</label>
              <input type="text" inputMode="decimal" data-testid="input-voc" value={vocStcStr} onChange={(e) => setVocStcStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Vmp (V)</label>
              <input type="text" inputMode="decimal" data-testid="input-vmp" value={vmpStcStr} onChange={(e) => setVmpStcStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Series Modules Ns</label>
              <input type="text" inputMode="numeric" data-testid="input-ns" value={nsStr} onChange={(e) => setNsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Parallel Strings Np</label>
              <input type="text" inputMode="numeric" data-testid="input-np" value={npStr} onChange={(e) => setNpStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">beta Voc (%/degC)</label>
              <input type="text" inputMode="decimal" data-testid="input-beta" value={betaVocStr} onChange={(e) => setBetaVocStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Min Temp (degC)</label>
              <input type="text" inputMode="decimal" data-testid="input-tmin" value={tMinStr} onChange={(e) => setTMinStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Inverter AC (kW)</label>
              <input type="text" inputMode="decimal" data-testid="input-pinv" value={invAcStr} onChange={(e) => setInvAcStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Max DC Limit (V)</label>
              <input type="text" inputMode="decimal" data-testid="input-vmax" value={vMaxStr} onChange={(e) => setVMaxStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">PSH (h/d)</label>
              <input type="text" inputMode="decimal" data-testid="input-psh" value={pshStr} onChange={(e) => setPshStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">PR (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-pr" value={prStr} onChange={(e) => setPrStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">kgCO2/kWh</label>
              <input type="text" inputMode="decimal" data-testid="input-ef" value={efStr} onChange={(e) => setEfStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setModWattStr('550'); setVocStcStr('49.8'); setVmpStcStr('41.8'); setBetaVocStr('-0.26');
              setTMinStr('-10'); setNsStr('20'); setNpStr('12'); setInvAcStr('100');
              setVMaxStr('1100'); setPshStr('4.3'); setPrStr('82'); setEfStr('0.475');
            }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <h3 className="text-xl font-black text-white">Sizing &amp; Voltage Results</h3>
            <div className="flex gap-2">
              <button type="button" onClick={handleCopy} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold border border-slate-700 disabled:opacity-50">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-900 hover:bg-amber-400 rounded-lg text-xs font-black disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {!res.valid ? (
            <div data-testid="validation-error" className="rounded-2xl bg-red-950/70 border border-red-500 px-5 py-4 text-base font-bold text-red-200">{res.error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-800 rounded-2xl border border-slate-700">
                  <div className="text-xs font-bold uppercase text-slate-400">DC/AC Loading Ratio (ILR)</div>
                  <div className="text-4xl font-black text-amber-400 mt-1" data-testid="res-ilr">{res.ilr.toFixed(4)}</div>
                  <div className="text-xs text-slate-300 mt-1" data-testid="res-dc-kw">{res.dcCapacityKw.toFixed(2)} kWp DC / {invAcStr} kW AC</div>
                </div>
                <div className={`p-5 rounded-2xl border ${res.withinDcLimit ? 'bg-emerald-950/40 border-emerald-700' : 'bg-red-950/40 border-red-700'}`}>
                  <div className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Cold String Voc_max</div>
                  <div className="text-4xl font-black text-white mt-1" data-testid="res-voc-max">{res.vocMaxV.toFixed(2)} V</div>
                  <div className="text-xs mt-1 text-slate-300">
                    Limit {vMaxStr} V ({res.withinDcLimit ? `Margin ${res.voltageMarginPct.toFixed(2)}%` : 'EXCEEDS MAX DC'})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">STC String Vmp</div>
                  <div className="text-xl font-black text-white">{res.vmpStcV.toFixed(1)} V</div>
                </div>
                <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Annual Energy Yield</div>
                  <div className="text-xl font-black text-emerald-400" data-testid="res-mwh">{res.annualMwh.toFixed(2)} MWh/yr</div>
                </div>
                <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Estimated CO2 Offset</div>
                  <div className="text-xl font-black text-emerald-400">{res.co2Tonnes.toFixed(2)} t/yr</div>
                </div>
              </div>
            </>
          )}

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/70 flex items-start gap-2 text-xs text-slate-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Cold open-circuit string voltage rises at low ambient temperatures: Voc_max = Ns * Voc_STC * [1 + (beta_Voc / 100) * (T_min - 25)]. Verify clipping and local electrical requirements with inverter manufacturer datasheets.
            </span>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
