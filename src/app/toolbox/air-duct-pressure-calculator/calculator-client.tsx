'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, Wind, Gauge } from 'lucide-react';

interface MaterialRoughness {
  name: string;
  roughnessMm: number;
  desc: string;
}

const DUCT_MATERIALS: MaterialRoughness[] = [
  { name: 'Galvanized Sheet Steel', roughnessMm: 0.09, desc: 'Standard rigid commercial HVAC ductwork' },
  { name: 'Smooth Plastic / Spiral Metal', roughnessMm: 0.03, desc: 'High-grade spiral or seamless PVC' },
  { name: 'Flexible Ducting (Fully Extended)', roughnessMm: 3.00, desc: 'Corrugated flex duct per ASHRAE Fundamentals' },
  { name: 'Fibrous Glass Liner', roughnessMm: 1.50, desc: 'Internally lined duct for acoustic attenuation' },
];

export default function AirDuctPressureCalculatorClient() {
  const [lengthM, setLengthM] = useState('20');
  const [diameterMm, setDiameterMm] = useState('300');
  const [velocityMs, setVelocityMs] = useState('5.0');
  const [materialIdx, setMaterialIdx] = useState(0);
  const [fittingK, setFittingK] = useState('2.0'); // Sum of fitting loss coefficients (elbows, tees, dampers)

  const roughnessMm = DUCT_MATERIALS[materialIdx].roughnessMm;

  const results = useMemo(() => {
    const L = Math.max(0, parseFloat(lengthM) || 0); // meters
    const D = Math.max(10, parseFloat(diameterMm) || 300) / 1000; // convert mm to meters
    const v = Math.max(0.1, parseFloat(velocityMs) || 0); // m/s
    const eps = (roughnessMm || 0.09) / 1000; // convert mm to meters
    const K = Math.max(0, parseFloat(fittingK) || 0);

    // Standard Air Properties at 20°C, 101.325 kPa:
    // Density rho = 1.204 kg/m³
    // Dynamic viscosity mu = 1.825e-5 Pa·s
    // Kinematic viscosity nu = 1.516e-5 m²/s
    const rho = 1.204;
    const nu = 1.516e-5;

    // Reynolds Number: Re = (v * D) / nu
    const reynolds = (v * D) / nu;

    // Darcy-Weisbach Friction Factor f:
    // For laminar flow (Re <= 2300): f = 64 / Re
    // For turbulent flow (Re > 2300): Swamee-Jain explicit Colebrook-White approximation
    let f = 0.02;
    if (reynolds <= 2300) {
      f = reynolds > 0 ? 64 / reynolds : 0.064;
    } else {
      const term1 = eps / (3.7 * D);
      const term2 = 5.74 / Math.pow(reynolds, 0.9);
      const logVal = Math.log10(term1 + term2);
      f = 0.25 / (logVal * logVal);
    }

    // Dynamic Velocity Pressure: Pv = 0.5 * rho * v² (Pa)
    const velocityPressurePa = 0.5 * rho * v * v;

    // Major Friction Pressure Loss: Pf = f * (L / D) * Pv (Pa)
    const frictionLossPa = D > 0 ? f * (L / D) * velocityPressurePa : 0;

    // Minor Dynamic Fitting Loss: Pd = K * Pv (Pa)
    const dynamicLossPa = K * velocityPressurePa;

    // Total Pressure Drop
    const totalLossPa = frictionLossPa + dynamicLossPa;

    // Unit Conversions:
    // 1 Pa = 0.00401865 in. w.g. (inches of water gauge)
    // 1 in. w.g. = 248.84 Pa
    // 1 mm H2O = 9.80665 Pa
    const PA_TO_INWG = 0.00401865;
    const frictionInWg = frictionLossPa * PA_TO_INWG;
    const dynamicInWg = dynamicLossPa * PA_TO_INWG;
    const totalInWg = totalLossPa * PA_TO_INWG;

    // Duct Flow Volumetric Rate:
    // Area = (pi / 4) * D²
    const crossSectionAreaM2 = (Math.PI / 4) * D * D;
    const flowRateM3s = crossSectionAreaM2 * v;
    const flowRateM3h = flowRateM3s * 3600;
    const flowRateCfm = flowRateM3s * 2118.88; // 1 m³/s = 2118.88 CFM

    return {
      reynolds,
      f,
      velocityPressurePa,
      frictionLossPa,
      dynamicLossPa,
      totalLossPa,
      frictionInWg,
      dynamicInWg,
      totalInWg,
      crossSectionAreaM2,
      flowRateM3h,
      flowRateCfm,
      isLaminar: reynolds <= 2300,
    };
  }, [lengthM, diameterMm, velocityMs, roughnessMm, fittingK]);

  const downloadCsv = () => {
    const rows = [
      ['HVAC Ductwork Pressure Drop Calculation Report', ''],
      ['Governing Method', 'Darcy-Weisbach Equation with Swamee-Jain Friction Factor'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Duct Length (m)', lengthM],
      ['Internal Diameter (mm)', diameterMm],
      ['Air Velocity (m/s)', velocityMs],
      ['Duct Material', DUCT_MATERIALS[materialIdx].name],
      ['Absolute Roughness (mm)', roughnessMm],
      ['Fitting Loss Coefficient (K)', fittingK],
      ['', ''],
      ['Aerodynamic & Hydraulic Outputs', ''],
      ['Reynolds Number (Re)', Math.round(results.reynolds)],
      ['Flow Regime', results.isLaminar ? 'Laminar (Re ≤ 2300)' : 'Turbulent (Re > 2300)'],
      ['Darcy Friction Factor (f)', results.f.toFixed(4)],
      ['Volumetric Airflow (m³/h)', results.flowRateM3h.toFixed(1)],
      ['Volumetric Airflow (CFM)', results.flowRateCfm.toFixed(1)],
      ['Velocity Pressure (Pa)', results.velocityPressurePa.toFixed(2)],
      ['Friction Pressure Loss (Pa)', results.frictionLossPa.toFixed(2)],
      ['Friction Pressure Loss (in. w.g.)', results.frictionInWg.toFixed(4)],
      ['Dynamic Fitting Loss (Pa)', results.dynamicLossPa.toFixed(2)],
      ['Dynamic Fitting Loss (in. w.g.)', results.dynamicInWg.toFixed(4)],
      ['Total Pressure Drop (Pa)', results.totalLossPa.toFixed(2)],
      ['Total Pressure Drop (in. w.g.)', results.totalInWg.toFixed(4)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hvac-duct-pressure-drop.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Duct Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">ASHRAE friction & fitting kinematics</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Duct Material & Roughness</label>
            <select
              value={materialIdx}
              onChange={e => setMaterialIdx(parseInt(e.target.value))}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all cursor-pointer"
            >
              {DUCT_MATERIALS.map((m, i) => (
                <option key={m.name} value={i}>
                  {m.name} (ε = {m.roughnessMm} mm)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Length (m)</label>
                <input
                  type="number"
                  step="1"
                  data-testid="duct-input-length"
                  value={lengthM}
                  onChange={e => setLengthM(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Diameter (mm)</label>
                <input
                  type="number"
                  step="25"
                  value={diameterMm}
                  onChange={e => setDiameterMm(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Velocity (m/s)</label>
                <input
                  type="number"
                  step="0.5"
                  data-testid="duct-input-velocity"
                  value={velocityMs}
                  onChange={e => setVelocityMs(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Fittings ΣK</label>
                <input
                  type="number"
                  step="0.5"
                  value={fittingK}
                  onChange={e => setFittingK(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 font-medium space-y-1">
              <div>Volumetric Flow: <strong className="text-slate-800">{results.flowRateM3h.toFixed(0)} m³/h</strong> ({results.flowRateCfm.toFixed(0)} CFM)</div>
              <div>Friction Factor f: <strong className="text-slate-800">{results.f.toFixed(4)}</strong> (Swamee-Jain)</div>
            </div>
          </div>

          <button
            onClick={() => {
              setLengthM('20');
              setDiameterMm('300');
              setVelocityMs('5.0');
              setMaterialIdx(0);
              setFittingK('2.0');
            }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Total Ductwork Pressure Loss</h2>
                  <p className="text-xs text-slate-500 font-medium">Friction + minor fitting resistance</p>
                </div>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Result Banner Dual Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-green-100 mb-1">
                  <Gauge className="w-4 h-4" />
                  <span>Total Loss (Metric SI)</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="duct-total-loss-pa">{results.totalLossPa.toFixed(1)}</span> <span className="text-xl font-bold">Pa</span>
                </div>
                <div className="text-xs text-green-100/90 mt-2 font-medium">
                  {results.frictionLossPa.toFixed(1)} Pa friction + {results.dynamicLossPa.toFixed(1)} Pa dynamic
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>Total Loss (Imperial HVAC)</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="duct-total-loss-inwg">{results.totalInWg.toFixed(3)}</span> <span className="text-xl font-bold">in. w.g.</span>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-medium">
                  {results.frictionInWg.toFixed(3)} in. w.g. friction + {results.dynamicInWg.toFixed(3)} in. w.g. dynamic
                </div>
              </div>
            </div>

            {/* Breakdown Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Friction Loss (ΔPf)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="duct-friction-pa">{results.frictionLossPa.toFixed(1)}</span> <span className="text-xs text-slate-500 font-bold">Pa</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{results.frictionInWg.toFixed(3)} in. w.g. ({((results.frictionLossPa / Math.max(0.1, results.totalLossPa)) * 100).toFixed(0)}%)</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dynamic Loss (ΔPd)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="duct-dynamic-pa">{results.dynamicLossPa.toFixed(1)}</span> <span className="text-xs text-slate-500 font-bold">Pa</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{results.dynamicInWg.toFixed(3)} in. w.g. (ΣK = {fittingK})</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Velocity Pressure (Pv)</div>
                <div className="text-2xl font-black text-slate-900">{results.velocityPressurePa.toFixed(1)} <span className="text-xs text-slate-500 font-bold">Pa</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Re = <span data-testid="duct-reynolds">{Math.round(results.reynolds).toLocaleString()}</span> ({results.isLaminar ? 'Laminar' : 'Turbulent'})</div>
              </div>
            </div>

            {/* Engineering Methodology Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Darcy-Weisbach Standard Formulation:</strong> Friction loss is computed as <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">ΔPf = f × (L / D) × 0.5 × ρ × v²</code> with friction factor <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">f</code> derived from Swamee-Jain equation using relative roughness <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">ε / D</code> and Reynolds number. Minor loss is calculated as <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">ΔPd = K × 0.5 × ρ × v²</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
