'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface PowerScrewResult {
  valid: boolean;
  error?: string;
  leadAngleDeg: number;
  effFrictionAngleDeg: number;
  torqueRaiseNm: number;
  torqueLowerNm: number;
  efficiencyPct: number;
  isSelfLocking: boolean;
}

function solvePowerScrew(
  loadNStr: string,
  meanDiaMmStr: string,
  leadMmStr: string,
  muStr: string,
  threadHalfAngleDegStr: string,
  collarMuStr: string,
  collarDiaMmStr: string
): PowerScrewResult {
  if ([loadNStr, meanDiaMmStr, leadMmStr, muStr, threadHalfAngleDegStr, collarMuStr, collarDiaMmStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All screw geometry, friction, and load inputs are required.', leadAngleDeg: 0, effFrictionAngleDeg: 0, torqueRaiseNm: 0, torqueLowerNm: 0, efficiencyPct: 0, isSelfLocking: false };
  }
  const F = Number(loadNStr);
  const dm = Number(meanDiaMmStr) / 1000;
  const l = Number(leadMmStr) / 1000;
  const mu = Number(muStr);
  const alphaDeg = Number(threadHalfAngleDegStr);
  const muC = Number(collarMuStr);
  const dc = Number(collarDiaMmStr) / 1000;

  if (![F, dm, l, mu, alphaDeg, muC, dc].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', leadAngleDeg: 0, effFrictionAngleDeg: 0, torqueRaiseNm: 0, torqueLowerNm: 0, efficiencyPct: 0, isSelfLocking: false };
  }
  if (F <= 0 || dm <= 0 || l <= 0 || mu < 0 || muC < 0 || dc < 0) {
    return { valid: false, error: 'Load, mean diameter, and lead must be > 0; friction coefficients and collar diameter must be >= 0.', leadAngleDeg: 0, effFrictionAngleDeg: 0, torqueRaiseNm: 0, torqueLowerNm: 0, efficiencyPct: 0, isSelfLocking: false };
  }
  if (alphaDeg < 0 || alphaDeg >= 45) {
    return { valid: false, error: 'Thread half-angle must satisfy 0 <= alpha < 45 deg.', leadAngleDeg: 0, effFrictionAngleDeg: 0, torqueRaiseNm: 0, torqueLowerNm: 0, efficiencyPct: 0, isSelfLocking: false };
  }

  const tanLambda = l / (Math.PI * dm);
  const leadAngleRad = Math.atan(tanLambda);
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const muEff = mu / Math.cos(alphaRad);
  const effFrictionAngleRad = Math.atan(muEff);

  if (1 - muEff * tanLambda <= 0) {
    return { valid: false, error: 'Friction * tan(lambda) >= 1 causes screw wedging; decrease lead or friction.', leadAngleDeg: 0, effFrictionAngleDeg: 0, torqueRaiseNm: 0, torqueLowerNm: 0, efficiencyPct: 0, isSelfLocking: false };
  }

  const collarTorque = 0.5 * F * muC * dc;
  const torqueRaiseNm = 0.5 * F * dm * ((tanLambda + muEff) / (1 - muEff * tanLambda)) + collarTorque;
  const torqueLowerNm = 0.5 * F * dm * ((muEff - tanLambda) / (1 + muEff * tanLambda)) + collarTorque;
  const efficiencyPct = ((F * l) / (2 * Math.PI * torqueRaiseNm)) * 100;
  const isSelfLocking = effFrictionAngleRad > leadAngleRad;

  return {
    valid: true,
    leadAngleDeg: (leadAngleRad * 180) / Math.PI,
    effFrictionAngleDeg: (effFrictionAngleRad * 180) / Math.PI,
    torqueRaiseNm,
    torqueLowerNm,
    efficiencyPct,
    isSelfLocking,
  };
}

export default function PowerScrewCalculatorClient() {
  const [loadStr, setLoadStr] = useState('5000');
  const [dmStr, setDmStr] = useState('20');
  const [leadStr, setLeadStr] = useState('5');
  const [muStr, setMuStr] = useState('0.15');
  const [alphaStr, setAlphaStr] = useState('15');
  const [muCStr, setMuCStr] = useState('0');
  const [dcStr, setDcStr] = useState('25');

  const res = solvePowerScrew(loadStr, dmStr, leadStr, muStr, alphaStr, muCStr, dcStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Power Screw Torque & Self-Locking Report', ''],
      ['Axial Load F (N)', loadStr],
      ['Mean Diameter dm (mm)', dmStr],
      ['Lead l (mm)', leadStr],
      ['Thread Friction mu', muStr],
      ['Thread Half-Angle alpha (deg)', alphaStr],
      ['Collar Friction mu_c', muCStr],
      ['Collar Mean Diameter dc (mm)', dcStr],
      ['Lead Angle (deg)', res.leadAngleDeg.toFixed(4)],
      ['Effective Friction Angle (deg)', res.effFrictionAngleDeg.toFixed(4)],
      ['Raising Torque (N*m)', res.torqueRaiseNm.toFixed(4)],
      ['Lowering Torque (N*m)', res.torqueLowerNm.toFixed(4)],
      ['Mechanical Efficiency (%)', res.efficiencyPct.toFixed(4)],
      ['Thread Self-Locking', res.isSelfLocking ? 'YES (phi_eff > lambda)' : 'NO (back-drivable)'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'power-screw-torque.csv';
    a.click();
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

          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setAlphaStr('0')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200">Square (0 deg)</button>
            <button type="button" onClick={() => setAlphaStr('15')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200">Metric Trap (15 deg)</button>
            <button type="button" onClick={() => setAlphaStr('14.5')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200">ACME (14.5 deg)</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Axial Load F (N)</label>
              <input type="text" inputMode="decimal" data-testid="input-load" value={loadStr} onChange={(e) => setLoadStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Mean Dia d_m (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dm" value={dmStr} onChange={(e) => setDmStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Lead l (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-lead" value={leadStr} onChange={(e) => setLeadStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Thread Friction mu</label>
              <input type="text" inputMode="decimal" data-testid="input-mu" value={muStr} onChange={(e) => setMuStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">Half-Angle (deg)</label>
              <input type="text" inputMode="decimal" data-testid="input-alpha" value={alphaStr} onChange={(e) => setAlphaStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">Collar mu_c</label>
              <input type="text" inputMode="decimal" data-testid="input-muc" value={muCStr} onChange={(e) => setMuCStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">Collar dc (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dc" value={dcStr} onChange={(e) => setDcStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setLoadStr('5000'); setDmStr('20'); setLeadStr('5'); setMuStr('0.15'); setAlphaStr('15'); setMuCStr('0'); setDcStr('25'); }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Torque to Raise</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-raise">
                      {res.torqueRaiseNm.toFixed(4)}<span className="text-lg text-blue-400"> N*m</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Torque to Lower</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-lower">
                      {res.torqueLowerNm.toFixed(4)}<span className="text-lg text-emerald-500"> N*m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Efficiency</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-efficiency">{res.efficiencyPct.toFixed(3)} %</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Lead Angle</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-lead-angle">{res.leadAngleDeg.toFixed(3)} deg</div>
                  </div>
                  <div className={`rounded-2xl p-4 border ${res.isSelfLocking ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <div className="text-xs font-black uppercase mb-1">Self-Lock Status</div>
                    <div className="text-base font-black" data-testid="res-lock">{res.isSelfLocking ? 'Self-Locking' : 'Back-Drivable'}</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Wikipedia Leadscrew model: mu_eff = mu / cos(alpha); T_raise = 0.5*F*dm*(tan(lambda)+mu_eff)/(1-mu_eff*tan(lambda)) + 0.5*F*mu_c*dc. Self-locking occurs when atan(mu_eff) &gt; lambda.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
