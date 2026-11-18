'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface PressFitResult {
  valid: boolean;
  error?: string;
  contactPressureMpa: number;
  assemblyForceKn: number;
  torqueCapacityNm: number;
  hubInnerHoopMpa: number;
  shaftOuterHoopMpa: number;
}

function solvePressFit(
  deltaMmStr: string,
  dMmStr: string,
  doMmStr: string,
  diMmStr: string,
  lenMmStr: string,
  eHubGpaStr: string,
  nuHubStr: string,
  eShaftGpaStr: string,
  nuShaftStr: string,
  muStr: string
): PressFitResult {
  if ([deltaMmStr, dMmStr, doMmStr, diMmStr, lenMmStr, eHubGpaStr, nuHubStr, eShaftGpaStr, nuShaftStr, muStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All Lame cylinder geometry, elastic, and friction parameters are required.', contactPressureMpa: 0, assemblyForceKn: 0, torqueCapacityNm: 0, hubInnerHoopMpa: 0, shaftOuterHoopMpa: 0 };
  }
  const delta = Number(deltaMmStr);
  const d = Number(dMmStr);
  const Do = Number(doMmStr);
  const di = Number(diMmStr);
  const L = Number(lenMmStr);
  const Eh = Number(eHubGpaStr) * 1000; // MPa
  const nuh = Number(nuHubStr);
  const Es = Number(eShaftGpaStr) * 1000; // MPa
  const nus = Number(nuShaftStr);
  const mu = Number(muStr);

  if (![delta, d, Do, di, L, Eh, nuh, Es, nus, mu].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', contactPressureMpa: 0, assemblyForceKn: 0, torqueCapacityNm: 0, hubInnerHoopMpa: 0, shaftOuterHoopMpa: 0 };
  }
  if (delta <= 0 || d <= 0 || L <= 0 || Eh <= 0 || Es <= 0 || mu <= 0) {
    return { valid: false, error: 'Interference, diameter, engagement length, elastic moduli, and friction must be > 0.', contactPressureMpa: 0, assemblyForceKn: 0, torqueCapacityNm: 0, hubInnerHoopMpa: 0, shaftOuterHoopMpa: 0 };
  }
  if (di < 0 || di >= d || Do <= d) {
    return { valid: false, error: 'Geometry must satisfy 0 <= shaft inner diameter < interface diameter < hub outer diameter.', contactPressureMpa: 0, assemblyForceKn: 0, torqueCapacityNm: 0, hubInnerHoopMpa: 0, shaftOuterHoopMpa: 0 };
  }
  if (nuh <= 0 || nuh >= 0.5 || nus <= 0 || nus >= 0.5) {
    return { valid: false, error: 'Poisson ratios must satisfy 0 < nu < 0.5.', contactPressureMpa: 0, assemblyForceKn: 0, torqueCapacityNm: 0, hubInnerHoopMpa: 0, shaftOuterHoopMpa: 0 };
  }

  const hubFactor = ((Do * Do + d * d) / (Do * Do - d * d) + nuh) / Eh;
  const shaftFactor = ((d * d + di * di) / (d * d - di * di) - nus) / Es;
  const p = delta / d / (hubFactor + shaftFactor); // MPa
  const assemblyForceKn = (mu * p * Math.PI * d * L) / 1000; // kN
  const torqueCapacityNm = (assemblyForceKn * 1000 * (d / 1000)) / 2; // N*m
  const hubInnerHoopMpa = p * ((Do * Do + d * d) / (Do * Do - d * d));
  const shaftOuterHoopMpa = -p * ((d * d + di * di) / (d * d - di * di));

  return { valid: true, contactPressureMpa: p, assemblyForceKn, torqueCapacityNm, hubInnerHoopMpa, shaftOuterHoopMpa };
}

export default function PressFitCalculatorClient() {
  const [deltaStr, setDeltaStr] = useState('0.05');
  const [dStr, setDStr] = useState('50');
  const [doStr, setDoStr] = useState('90');
  const [diStr, setDiStr] = useState('0');
  const [lenStr, setLenStr] = useState('40');
  const [eHubStr, setEHubStr] = useState('200');
  const [nuHubStr, setNuHubStr] = useState('0.3');
  const [eShaftStr, setEShaftStr] = useState('200');
  const [nuShaftStr, setNuShaftStr] = useState('0.3');
  const [muStr, setMuStr] = useState('0.15');

  const res = solvePressFit(deltaStr, dStr, doStr, diStr, lenStr, eHubStr, nuHubStr, eShaftStr, nuShaftStr, muStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Lame Interference Fit Report', ''],
      ['Diametral Interference delta (mm)', deltaStr],
      ['Nominal Fit Diameter d (mm)', dStr],
      ['Hub Outer Diameter Do (mm)', doStr],
      ['Shaft Inner Bore di (mm)', diStr],
      ['Engagement Length L (mm)', lenStr],
      ['Hub Modulus / Poisson (GPa / -)', `${eHubStr} / ${nuHubStr}`],
      ['Shaft Modulus / Poisson (GPa / -)', `${eShaftStr} / ${nuShaftStr}`],
      ['Friction Coefficient mu', muStr],
      ['Interface Contact Pressure (MPa)', res.contactPressureMpa.toFixed(4)],
      ['Axial Press/Slip Force (kN)', res.assemblyForceKn.toFixed(4)],
      ['Slip Torque Capacity (N*m)', res.torqueCapacityNm.toFixed(4)],
      ['Hub Bore Hoop Tensile Stress (MPa)', res.hubInnerHoopMpa.toFixed(4)],
      ['Shaft OD Hoop Compressive Stress (MPa)', res.shaftOuterHoopMpa.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lame-press-fit.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Interference delta (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-delta" value={deltaStr} onChange={(e) => setDeltaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Fit Dia d (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-d" value={dStr} onChange={(e) => setDStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Hub OD D_o (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-do" value={doStr} onChange={(e) => setDoStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Shaft ID d_i (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-di" value={diStr} onChange={(e) => setDiStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Length L (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-len" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Friction mu</label>
              <input type="text" inputMode="decimal" data-testid="input-mu" value={muStr} onChange={(e) => setMuStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Hub E (GPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-ehub" value={eHubStr} onChange={(e) => setEHubStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Hub nu</label>
              <input type="text" inputMode="decimal" data-testid="input-nuhub" value={nuHubStr} onChange={(e) => setNuHubStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Shaft E (GPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-eshaft" value={eShaftStr} onChange={(e) => setEShaftStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Shaft nu</label>
              <input type="text" inputMode="decimal" data-testid="input-nushaft" value={nuShaftStr} onChange={(e) => setNuShaftStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDeltaStr('0.05'); setDStr('50'); setDoStr('90'); setDiStr('0'); setLenStr('40');
              setEHubStr('200'); setNuHubStr('0.3'); setEShaftStr('200'); setNuShaftStr('0.3'); setMuStr('0.15');
            }}
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Lame Interference Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Contact Pressure p</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-pressure">{res.contactPressureMpa.toFixed(4)}<span className="text-lg text-blue-400"> MPa</span></div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Assembly / Slip Force</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-force">{res.assemblyForceKn.toFixed(4)}<span className="text-lg text-emerald-500"> kN</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Torque Capacity</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-torque">{res.torqueCapacityNm.toFixed(2)} N*m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Hub Bore Hoop Stress</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-hub-hoop">{res.hubInnerHoopMpa.toFixed(2)} MPa</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Shaft OD Compressive</div>
                    <div className="text-xl font-black text-slate-900">{res.shaftOuterHoopMpa.toFixed(2)} MPa</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Exact thick-walled Lame interference fit solution (Wikipedia Interference Fit &amp; Cylinder Stress). Verify hub inner hoop tensile stress remains safely below yield.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
