'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface SepticTankResult {
  valid: boolean;
  error?: string;
  vLiqM3: number;
  vSludgeM3: number;
  vEffM3: number;
  vTotalM3: number;
  planAreaM2: number;
  widthM: number;
  lengthM: number;
  totalDepthM: number;
}

function solveSepticTank(
  usersStr: string,
  flowStr: string,
  tdStr: string,
  sludgeStr: string,
  intervalStr: string,
  freeboardStr: string,
  depthStr: string,
  lwStr: string
): SepticTankResult {
  const err = (msg: string): SepticTankResult => ({
    valid: false,
    error: msg,
    vLiqM3: 0,
    vSludgeM3: 0,
    vEffM3: 0,
    vTotalM3: 0,
    planAreaM2: 0,
    widthM: 0,
    lengthM: 0,
    totalDepthM: 0,
  });

  if ([usersStr, flowStr, tdStr, sludgeStr, intervalStr, freeboardStr, depthStr, lwStr].some((s) => s.trim() === '')) {
    return err('All occupancy, hydraulic detention, sludge accumulation, and geometry inputs are required.');
  }

  const P = Number(usersStr);
  const q = Number(flowStr);
  const td = Number(tdStr);
  const rs = Number(sludgeStr);
  const Ty = Number(intervalStr);
  const fbPct = Number(freeboardStr);
  const hLiq = Number(depthStr);
  const lw = Number(lwStr);

  if (![P, q, td, rs, Ty, fbPct, hLiq, lw].every(Number.isFinite)) {
    return err('All inputs must be valid finite numbers.');
  }
  if (P <= 0 || q <= 0 || td <= 0 || rs < 0 || Ty < 0 || fbPct < 0 || hLiq <= 0 || lw <= 0) {
    return err('Users, unit flow, detention days, liquid depth, and L:W ratio must be > 0; sludge/freeboard >= 0.');
  }

  const vLiqM3 = (P * q * td) / 1000;
  const vSludgeM3 = (P * rs * Ty) / 1000;
  const vEffM3 = vLiqM3 + vSludgeM3;
  const vTotalM3 = vEffM3 * (1 + fbPct / 100);
  const planAreaM2 = vEffM3 / hLiq;
  const widthM = Math.sqrt(planAreaM2 / lw);
  const lengthM = widthM * lw;
  const totalDepthM = hLiq * (1 + fbPct / 100);

  return {
    valid: true,
    vLiqM3,
    vSludgeM3,
    vEffM3,
    vTotalM3,
    planAreaM2,
    widthM,
    lengthM,
    totalDepthM,
  };
}

export default function SepticTankCalculatorClient() {
  const [usersStr, setUsersStr] = useState('4');
  const [flowStr, setFlowStr] = useState('150');
  const [tdStr, setTdStr] = useState('2');
  const [sludgeStr, setSludgeStr] = useState('40');
  const [intervalStr, setIntervalStr] = useState('2');
  const [freeboardStr, setFreeboardStr] = useState('20');
  const [depthStr, setDepthStr] = useState('1.5');
  const [lwStr, setLwStr] = useState('2.5');

  const res = solveSepticTank(usersStr, flowStr, tdStr, sludgeStr, intervalStr, freeboardStr, depthStr, lwStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Septic Tank Volume & Dimensions Sizing Report', ''],
      ['Connected Users P (persons)', usersStr],
      ['Daily Wastewater Flow per Person q (L/person*d)', flowStr],
      ['Hydraulic Detention Time td (days)', tdStr],
      ['Sludge Accumulation Rate rs (L/person*yr)', sludgeStr],
      ['Desludging Interval Ty (years)', intervalStr],
      ['Freeboard Allowance (%)', freeboardStr],
      ['Effective Liquid Depth h (m)', depthStr],
      ['Length-to-Width Aspect Ratio (L:W)', lwStr],
      ['Liquid Detention Volume V_liq (m^3)', res.vLiqM3.toFixed(4)],
      ['Sludge Storage Volume V_sludge (m^3)', res.vSludgeM3.toFixed(4)],
      ['Effective Net Volume V_eff (m^3)', res.vEffM3.toFixed(4)],
      ['Total Tank Volume with Freeboard V_total (m^3)', res.vTotalM3.toFixed(4)],
      ['Plan Footprint Area (m^2)', res.planAreaM2.toFixed(4)],
      ['Internal Tank Width W (m)', res.widthM.toFixed(4)],
      ['Internal Tank Length L (m)', res.lengthM.toFixed(4)],
      ['Total Internal Depth with Freeboard (m)', res.totalDepthM.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'septic-tank-sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Tank Design Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Users (persons)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-users"
                value={usersStr}
                onChange={(e) => setUsersStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Flow (L/p*d)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-flow"
                value={flowStr}
                onChange={(e) => setFlowStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Detention (days)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-td"
                value={tdStr}
                onChange={(e) => setTdStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Sludge (L/p*yr)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sludge"
                value={sludgeStr}
                onChange={(e) => setSludgeStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Desludge (years)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-interval"
                value={intervalStr}
                onChange={(e) => setIntervalStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Freeboard (%)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-freeboard"
                value={freeboardStr}
                onChange={(e) => setFreeboardStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Liquid Depth (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-depth"
                value={depthStr}
                onChange={(e) => setDepthStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">L:W Ratio</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-lw"
                value={lwStr}
                onChange={(e) => setLwStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setUsersStr('4');
              setFlowStr('150');
              setTdStr('2');
              setSludgeStr('40');
              setIntervalStr('2');
              setFreeboardStr('20');
              setDepthStr('1.5');
              setLwStr('2.5');
            }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Tank Capacity &amp; Rectangular Dimensions</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Total Volume (w/ Freeboard)</div>
                  <div className="text-2xl font-black text-blue-800" data-testid="res-vtotal">{res.vTotalM3.toFixed(3)} m3</div>
                  <div className="text-xs font-bold text-blue-700 mt-1" data-testid="res-veff">Net V_eff: {res.vEffM3.toFixed(3)} m3</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Liquid / Sludge Storage</div>
                  <div className="text-xl font-black text-emerald-800" data-testid="res-vliq">{res.vLiqM3.toFixed(3)} m3</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1" data-testid="res-vsludge">Sludge: {res.vSludgeM3.toFixed(3)} m3</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Tank Width W</div>
                  <div className="text-2xl font-black text-orange-800" data-testid="res-width">{res.widthM.toFixed(4)} m</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Tank Length L</div>
                  <div className="text-2xl font-black text-purple-800" data-testid="res-length">{res.lengthM.toFixed(4)} m</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sm:col-span-2">
                  <div className="text-xs font-black text-slate-500 uppercase mb-1">Plan Footprint &amp; Total Depth</div>
                  <div className="text-xl font-black text-slate-800" data-testid="res-depth">
                    {res.planAreaM2.toFixed(3)} m2 / {res.totalDepthM.toFixed(3)} m deep
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                V_liq = P*q*td/1000; V_sludge = P*rs*Ty/1000; V_eff = V_liq + V_sludge; V_total = V_eff*(1 + Freeboard%/100); W = sqrt(V_eff/(h*LW)), L = W*LW.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
