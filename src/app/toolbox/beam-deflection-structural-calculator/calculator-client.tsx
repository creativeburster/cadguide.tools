'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  HelpCircle, Info, Copy, Check, AlertTriangle, CheckCircle, Settings, Activity, Sliders, Shield, Download
} from 'lucide-react';

// Materials configuration
const MATERIALS = [
  { name: 'Structural Steel (A36 / S275)', E: 200, yield: 250 }, // E in GPa, yield in MPa
  { name: 'Aluminum 6061-T6', E: 70, yield: 276 },
  { name: 'Structural Timber / Softwood', E: 11, yield: 12 },
  { name: 'Custom Material', E: 200, yield: 250 },
];

// Profile types
const PROFILE_TYPES = [
  { id: 'i-beam', name: 'I-Beam (Universal Beam / W-Shape)' },
  { id: 'box', name: 'Box Section (RHS / Hollow Section)' },
  { id: 'solid-rect', name: 'Solid Rectangular Section' },
  { id: 'pipe', name: 'Round Hollow Pipe (CHS)' },
];

// Support & load setups
const LOAD_CONDITIONS = [
  { id: 'ss-point', name: 'Simply Supported + Center Point Load (P)', support: 'simply', load: 'point' },
  { id: 'ss-dist', name: 'Simply Supported + Uniform Load (w)', support: 'simply', load: 'distributed' },
  { id: 'cant-point', name: 'Cantilever + End Point Load (P)', support: 'cantilever', load: 'point' },
  { id: 'cant-dist', name: 'Cantilever + Uniform Load (w)', support: 'cantilever', load: 'distributed' },
  { id: 'ff-point', name: 'Fixed-Fixed + Center Point Load (P)', support: 'fixed', load: 'point' },
  { id: 'ff-dist', name: 'Fixed-Fixed + Uniform Load (w)', support: 'fixed', load: 'distributed' },
];

export default function BeamDeflectionClient() {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [customE, setCustomE] = useState('200'); // GPa
  const [customYield, setCustomYield] = useState('250'); // MPa

  const [profileType, setProfileType] = useState('i-beam');
  const [loadConditionIdx, setLoadConditionIdx] = useState(0);

  // General Inputs
  const [lengthStr, setLengthStr] = useState('4.0'); // m
  const [loadValueStr, setLoadValueStr] = useState('10.0'); // kN or kN/m

  // Profile dimensions (mm)
  const [dimHStr, setDimHStr] = useState('200'); // Height
  const [dimBStr, setDimBStr] = useState('100'); // Width
  const [dimTwStr, setDimTwStr] = useState('6');  // Web thickness
  const [dimTfStr, setDimTfStr] = useState('8');  // Flange thickness
  const [dimTStr, setDimTStr] = useState('5');    // Box/Pipe wall thickness
  const [copied, setCopied] = useState(false);

  // Numerical conversions with fallback for calculation
  const length = parseFloat(lengthStr) || 0;
  const loadValue = parseFloat(loadValueStr) || 0;
  const dimH = parseFloat(dimHStr) || 0;
  const dimB = parseFloat(dimBStr) || 0;
  const dimTw = parseFloat(dimTwStr) || 0;
  const dimTf = parseFloat(dimTfStr) || 0;
  const dimT = parseFloat(dimTStr) || 0;

  // Active Material properties
  const material = useMemo(() => {
    const isCustom = materialIdx === 3;
    const cE = parseFloat(customE) || 200;
    const cY = parseFloat(customYield) || 250;
    return {
      name: MATERIALS[materialIdx].name,
      E: isCustom ? cE : MATERIALS[materialIdx].E,
      yield: isCustom ? cY : MATERIALS[materialIdx].yield,
    };
  }, [materialIdx, customE, customYield]);

  // Support & Load properties
  const loadSetup = useMemo(() => {
    return LOAD_CONDITIONS[loadConditionIdx];
  }, [loadConditionIdx]);

  // Geometric Calculations (Ix: mm^4, Wx: mm^3)
  const geoProperties = useMemo(() => {
    let Ix = 0;
    let Wx = 0;
    let area = 0;

    const H = Math.max(1, dimH);
    const B = Math.max(1, dimB);
    const tw = Math.min(B - 1, Math.max(1, dimTw));
    const tf = Math.min(H / 2 - 1, Math.max(1, dimTf));
    const t = Math.min(Math.min(B / 2 - 1, H / 2 - 1), Math.max(1, dimT));

    if (profileType === 'i-beam') {
      const innerH = H - 2 * tf;
      Ix = (B * Math.pow(H, 3) - (B - tw) * Math.pow(innerH, 3)) / 12;
      Wx = Ix / (H / 2);
      area = 2 * B * tf + innerH * tw;
    } else if (profileType === 'box') {
      const innerB = B - 2 * t;
      const innerH = H - 2 * t;
      Ix = (B * Math.pow(H, 3) - innerB * Math.pow(innerH, 3)) / 12;
      Wx = Ix / (H / 2);
      area = B * H - innerB * innerH;
    } else if (profileType === 'solid-rect') {
      Ix = (B * Math.pow(H, 3)) / 12;
      Wx = (B * Math.pow(H, 2)) / 6;
      area = B * H;
    } else if (profileType === 'pipe') {
      const D = B;
      const innerD = Math.max(1, D - 2 * t);
      Ix = (Math.PI * (Math.pow(D, 4) - Math.pow(innerD, 4))) / 64;
      Wx = Ix / (D / 2);
      area = (Math.PI * (Math.pow(D, 2) - Math.pow(innerD, 2))) / 4;
    }

    return { Ix, Wx, area, effectiveH: profileType === 'pipe' ? B : H };
  }, [profileType, dimH, dimB, dimTw, dimTf, dimT]);

  // Load and stress math calculations
  const structuralOutputs = useMemo(() => {
    const L = Math.max(0.1, length);
    const L_mm = L * 1000;
    const P_N = loadValue * 1000; // if point load
    const w_Nmm = loadValue;      // 1 kN/m = 1 N/mm

    const E_Nmm2 = material.E * 1000; // GPa to MPa (N/mm2)
    const I = Math.max(1, geoProperties.Ix);
    const W = Math.max(1, geoProperties.Wx);

    let maxMoment = 0; // N*mm
    let maxDeflection = 0; // mm

    const support = loadSetup.support;
    const loadType = loadSetup.load;

    if (support === 'simply') {
      if (loadType === 'point') {
        maxMoment = (P_N * L_mm) / 4;
        maxDeflection = (P_N * Math.pow(L_mm, 3)) / (48 * E_Nmm2 * I);
      } else {
        maxMoment = (w_Nmm * Math.pow(L_mm, 2)) / 8;
        maxDeflection = (5 * w_Nmm * Math.pow(L_mm, 4)) / (384 * E_Nmm2 * I);
      }
    } else if (support === 'cantilever') {
      if (loadType === 'point') {
        maxMoment = P_N * L_mm;
        maxDeflection = (P_N * Math.pow(L_mm, 3)) / (3 * E_Nmm2 * I);
      } else {
        maxMoment = (w_Nmm * Math.pow(L_mm, 2)) / 2;
        maxDeflection = (w_Nmm * Math.pow(L_mm, 4)) / (8 * E_Nmm2 * I);
      }
    } else if (support === 'fixed') {
      if (loadType === 'point') {
        maxMoment = (P_N * L_mm) / 8;
        maxDeflection = (P_N * Math.pow(L_mm, 3)) / (192 * E_Nmm2 * I);
      } else {
        maxMoment = (w_Nmm * Math.pow(L_mm, 2)) / 12;
        maxDeflection = (w_Nmm * Math.pow(L_mm, 4)) / (384 * E_Nmm2 * I);
      }
    }

    const maxStress = maxMoment / W;
    const safetyFactor = maxStress > 0 ? material.yield / maxStress : 999;

    const limitL360 = L_mm / 360;
    const limitL240 = L_mm / 240;
    const limitL180 = L_mm / 180;

    let targetLimit = limitL240;
    if (support === 'cantilever') {
      targetLimit = limitL180;
    } else if (materialIdx === 2) {
      targetLimit = limitL360;
    }

    const isDeflectionSafe = maxDeflection <= targetLimit;
    const isStressSafe = maxStress <= material.yield;

    return {
      L_mm,
      maxMoment,
      maxDeflection,
      maxStress,
      safetyFactor,
      limitL360,
      limitL240,
      limitL180,
      targetLimit,
      isDeflectionSafe,
      isStressSafe,
    };
  }, [length, loadValue, material, loadSetup, geoProperties, materialIdx]);

  // Bending curve coordinates for SVG
  const curvePath = useMemo(() => {
    const pointsCount = 40;
    const pts: string[] = [];
    const L = (length || 4.0) * 1000;
    const maxDef = structuralOutputs.maxDeflection;

    const support = loadSetup.support;
    const loadType = loadSetup.load;

    const getDeflectionAtX = (x: number) => {
      if (maxDef === 0) return 0;
      const E_Nmm2 = material.E * 1000;
      const I = geoProperties.Ix;
      const P = loadValue * 1000;
      const w = loadValue;

      if (support === 'simply') {
        if (loadType === 'point') {
          const xx = x > L / 2 ? L - x : x;
          return (P * xx * (3 * L * L - 4 * xx * xx)) / (48 * E_Nmm2 * I);
        } else {
          return (w * x * (Math.pow(L, 3) - 2 * L * x * x + Math.pow(x, 3))) / (24 * E_Nmm2 * I);
        }
      } else if (support === 'cantilever') {
        if (loadType === 'point') {
          return (P * x * x * (3 * L - x)) / (6 * E_Nmm2 * I);
        } else {
          return (w * x * x * (6 * L * L - 4 * L * x + x * x)) / (24 * E_Nmm2 * I);
        }
      } else {
        if (loadType === 'point') {
          const xx = x > L / 2 ? L - x : x;
          return (P * xx * xx * (3 * L - 4 * xx)) / (48 * E_Nmm2 * I);
        } else {
          return (w * x * x * Math.pow(L - x, 2)) / (24 * E_Nmm2 * I);
        }
      }
    };

    const maxVal = getDeflectionAtX(support === 'cantilever' ? L : L / 2) || 1;

    for (let i = 0; i <= pointsCount; i++) {
      const fraction = i / pointsCount;
      const x = fraction * L;
      const def = getDeflectionAtX(x);
      const ratio = def / maxVal;

      const svgX = 40 + fraction * 320;
      const svgY = 70 + ratio * 28;
      pts.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
    }

    return pts.join(' ');
  }, [length, loadValue, material, loadSetup, geoProperties, structuralOutputs.maxDeflection]);

  const handleCopySummary = () => {
    const summary = [
      `Steel Beam Deflection & Stress Report — CADGuide.tools`,
      `Support Type: ${loadSetup.name}`,
      `Profile: ${profileType.toUpperCase()} (${geoProperties.effectiveH}x${dimB} mm)`,
      `Span Length: ${length} m`,
      `Applied Load: ${loadValue} ${loadSetup.load === 'point' ? 'kN' : 'kN/m'}`,
      `Material: ${material.name}`,
      `---------------------------------------`,
      `Moment of Inertia (Ix): ${geoProperties.Ix.toExponential(4)} mm⁴`,
      `Section Modulus (Wx): ${geoProperties.Wx.toExponential(4)} mm³`,
      `Max Bending Moment: ${(structuralOutputs.maxMoment / 1e6).toFixed(3)} kN·m`,
      `Max Bending Stress: ${structuralOutputs.maxStress.toFixed(2)} MPa (Yield: ${material.yield} MPa)`,
      `Max Deflection: ${structuralOutputs.maxDeflection.toFixed(2)} mm (Limit: ${structuralOutputs.targetLimit.toFixed(2)} mm)`,
      `Safety Factor: ${structuralOutputs.safetyFactor.toFixed(2)}`,
      `Structural Assessment: ${structuralOutputs.isStressSafe && structuralOutputs.isDeflectionSafe ? 'SAFE' : 'DANGER'}`,
    ].join('\n');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Parameter', 'Value', 'Unit'];
    const rows = [
      ['Support & Load Setup', `"${loadSetup.name}"`, '—'],
      ['Profile Type', profileType.toUpperCase(), '—'],
      ['Height (H)', dimHStr, 'mm'],
      ['Width (B)', dimBStr, 'mm'],
      ['Span Length (L)', lengthStr, 'm'],
      ['Applied Load', loadValueStr, loadSetup.load === 'point' ? 'kN' : 'kN/m'],
      ['Material', `"${material.name}"`, '—'],
      ['Elastic Modulus (E)', material.E.toString(), 'GPa'],
      ['Yield Strength', material.yield.toString(), 'MPa'],
      ['Moment of Inertia (Ix)', geoProperties.Ix.toExponential(4), 'mm⁴'],
      ['Section Modulus (Wx)', geoProperties.Wx.toExponential(4), 'mm³'],
      ['Max Bending Moment', (structuralOutputs.maxMoment / 1e6).toFixed(3), 'kN·m'],
      ['Max Deflection', structuralOutputs.maxDeflection.toFixed(2), 'mm'],
      ['Max Bending Stress', structuralOutputs.maxStress.toFixed(1), 'MPa'],
      ['Safety Factor', structuralOutputs.safetyFactor.toFixed(2), '—'],
      ['Structural Status', structuralOutputs.isStressSafe && structuralOutputs.isDeflectionSafe ? 'SAFE' : 'LIMIT EXCEEDED', '—']
    ];

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `beam-deflection-report-${profileType}-${lengthStr}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Cross section scaling
  const sectionDrawParams = useMemo(() => {
    const H = Math.max(1, dimH || 200);
    const B = Math.max(1, dimB || 100);
    const maxDim = Math.max(H, B);
    const scale = 110 / maxDim;

    const w = B * scale;
    const h = H * scale;
    const cx = 100;
    const cy = 100;

    return { w, h, cx, cy, scale };
  }, [dimH, dimB]);

  return (
    <div className="space-y-12">
      {/* Dynamic Graphic Panels Row */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Load & Deflection Curve Diagram */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" /> Beam Bending & Load Curve
            </h2>
            <p className="text-base text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Exaggerated deflection line based on Euler-Bernoulli beam theory
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 p-4 min-h-[220px]">
            <svg viewBox="0 0 400 150" className="w-full max-w-[400px] h-auto" aria-label="Beam Bending Diagram">
              <defs>
                <pattern id="gridBeam" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="150" fill="url(#gridBeam)" rx="12" />

              {/* Supports Drawing */}
              {loadSetup.support === 'simply' && (
                <>
                  <polygon points="35,70 45,70 40,63" fill="#64748b" stroke="#475569" strokeWidth="1" />
                  <line x1="30" y1="71" x2="50" y2="71" stroke="#475569" strokeWidth="2" />
                  <polygon points="355,70 365,70 360,63" fill="#64748b" stroke="#475569" strokeWidth="1" />
                  <circle cx="360" cy="72" r="2.5" fill="#475569" />
                  <line x1="350" y1="75" x2="370" y2="75" stroke="#475569" strokeWidth="2" />
                </>
              )}

              {loadSetup.support === 'cantilever' && (
                <>
                  <line x1="40" y1="35" x2="40" y2="105" stroke="#334155" strokeWidth="4" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={i}
                      x1="34"
                      y1={35 + i * 10}
                      x2="40"
                      y2={41 + i * 10}
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                  ))}
                </>
              )}

              {loadSetup.support === 'fixed' && (
                <>
                  <line x1="40" y1="35" x2="40" y2="105" stroke="#334155" strokeWidth="4" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={i} x1="34" y1={35 + i * 10} x2="40" y2={41 + i * 10} stroke="#64748b" strokeWidth="1.5" />
                  ))}
                  <line x1="360" y1="35" x2="360" y2="105" stroke="#334155" strokeWidth="4" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={i} x1="360" y1={35 + i * 10} x2="366" y2={41 + i * 10} stroke="#64748b" strokeWidth="1.5" />
                  ))}
                </>
              )}

              <line x1="40" y1="56" x2="360" y2="56" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5 3" opacity="0.5" />

              {loadSetup.load === 'point' ? (
                <>
                  {loadSetup.support === 'cantilever' ? (
                    <>
                      <line x1="360" y1="20" x2="360" y2="52" stroke="#3b82f6" strokeWidth="3" />
                      <polygon points="356,48 364,48 360,56" fill="#3b82f6" />
                      <text x="360" y="14" fill="#3b82f6" fontSize="10" fontWeight="900" textAnchor="middle">
                        P = {loadValue} kN
                      </text>
                    </>
                  ) : (
                    <>
                      <line x1="200" y1="20" x2="200" y2="52" stroke="#3b82f6" strokeWidth="3" />
                      <polygon points="196,48 204,48 200,56" fill="#3b82f6" />
                      <text x="200" y="14" fill="#3b82f6" fontSize="10" fontWeight="900" textAnchor="middle">
                        P = {loadValue} kN
                      </text>
                    </>
                  )}
                </>
              ) : (
                <>
                  {Array.from({ length: 9 }).map((_, i) => {
                    const startX = 40 + i * 40;
                    return (
                      <g key={i}>
                        <line x1={startX} y1="35" x2={startX} y2="52" stroke="#3b82f6" strokeWidth="1.5" />
                        <polygon points={`${startX - 3},49 ${startX + 3},49 ${startX},55`} fill="#3b82f6" />
                      </g>
                    );
                  })}
                  <line x1="40" y1="35" x2="360" y2="35" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="200" y="26" fill="#3b82f6" fontSize="10" fontWeight="900" textAnchor="middle">
                    w = {loadValue} kN/m
                  </text>
                </>
              )}

              <polyline
                points={curvePath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <line x1="40" y1="125" x2="360" y2="125" stroke="#64748b" strokeWidth="1" />
              <line x1="40" y1="120" x2="40" y2="130" stroke="#64748b" strokeWidth="1" />
              <line x1="360" y1="120" x2="360" y2="130" stroke="#64748b" strokeWidth="1" />
              <text x="200" y="140" fill="#475569" fontSize="10" fontWeight="black" textAnchor="middle">
                L = {length} m
              </text>
            </svg>
          </div>

          {/* Verification / Alert card */}
          {(() => {
            const isDefSafe = structuralOutputs.isDeflectionSafe;
            const isStrSafe = structuralOutputs.isStressSafe;
            const status = isDefSafe && isStrSafe ? 'safe' : (!isDefSafe && !isStrSafe ? 'danger' : 'warning');
            
            return (
              <div
                data-testid="res-status-assessment"
                className={`border rounded-2xl p-5 flex items-center gap-4 ${
                  status === 'safe'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : status === 'danger'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                {status === 'safe' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className={`w-6 h-6 shrink-0 ${status === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
                )}
                <div>
                  <div className="font-black text-lg uppercase tracking-wide">
                    {status === 'safe' && 'Structural Assessment: SAFE'}
                    {status === 'danger' && 'Structural Assessment: DANGER (Bearing capacity & stiffness exceeded)'}
                    {status === 'warning' && (!isDefSafe ? 'Assessment: DEFLECTION LIMIT EXCEEDED' : 'Assessment: FLEXURAL STRESS EXCEEDED')}
                  </div>
                  <p className="text-base text-slate-500 font-semibold mt-0.5 leading-relaxed">
                    {status === 'safe' && `Bending stress (${structuralOutputs.maxStress.toFixed(1)} MPa) and deflection (${structuralOutputs.maxDeflection.toFixed(2)} mm) are well within AISC design limits for ${material.name}.`}
                    {status === 'danger' && `Both bending stress (${structuralOutputs.maxStress.toFixed(1)} MPa) and deflection exceed code serviceability limits. Upsize beam profile or shorten span.`}
                    {status === 'warning' && (!isDefSafe
                      ? `Bending stress is safe, but deflection (${structuralOutputs.maxDeflection.toFixed(2)} mm) exceeds the L/${materialIdx === 2 ? 360 : 240} serviceability limit of ${structuralOutputs.targetLimit.toFixed(2)} mm.`
                      : `Deflection is within limit, but bending stress (${structuralOutputs.maxStress.toFixed(1)} MPa) exceeds the yield strength limit of ${material.yield} MPa.`)}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Profile Cross-Section SVG Drawer */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" /> Beam Profile Cross-Section
            </h2>
            <p className="text-base text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Real-time scaled cross section visualizer with key variables
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 p-4 min-h-[220px]">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto" aria-label="Beam Cross Section Diagram">
              <rect width="200" height="200" fill="url(#gridBeam)" rx="12" />

              {profileType === 'solid-rect' && (
                <rect
                  x={sectionDrawParams.cx - sectionDrawParams.w / 2}
                  y={sectionDrawParams.cy - sectionDrawParams.h / 2}
                  width={sectionDrawParams.w}
                  height={sectionDrawParams.h}
                  fill="rgba(59, 130, 246, 0.15)"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              )}

              {profileType === 'box' && (
                <>
                  <rect
                    x={sectionDrawParams.cx - sectionDrawParams.w / 2}
                    y={sectionDrawParams.cy - sectionDrawParams.h / 2}
                    width={sectionDrawParams.w}
                    height={sectionDrawParams.h}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                  <rect
                    x={sectionDrawParams.cx - sectionDrawParams.w / 2 + dimT * sectionDrawParams.scale}
                    y={sectionDrawParams.cy - sectionDrawParams.h / 2 + dimT * sectionDrawParams.scale}
                    width={Math.max(2, sectionDrawParams.w - 2 * dimT * sectionDrawParams.scale)}
                    height={Math.max(2, sectionDrawParams.h - 2 * dimT * sectionDrawParams.scale)}
                    fill="#f8fafc"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                </>
              )}

              {profileType === 'i-beam' && (
                <path
                  d={`
                    M ${sectionDrawParams.cx - sectionDrawParams.w / 2} ${sectionDrawParams.cy - sectionDrawParams.h / 2}
                    h ${sectionDrawParams.w}
                    v ${dimTf * sectionDrawParams.scale}
                    h ${-(sectionDrawParams.w / 2 - dimTw * sectionDrawParams.scale / 2)}
                    v ${sectionDrawParams.h - 2 * dimTf * sectionDrawParams.scale}
                    h ${sectionDrawParams.w / 2 - dimTw * sectionDrawParams.scale / 2}
                    v ${dimTf * sectionDrawParams.scale}
                    h ${-sectionDrawParams.w}
                    v ${-dimTf * sectionDrawParams.scale}
                    h ${sectionDrawParams.w / 2 - dimTw * sectionDrawParams.scale / 2}
                    v ${-(sectionDrawParams.h - 2 * dimTf * sectionDrawParams.scale)}
                    h ${-(sectionDrawParams.w / 2 - dimTw * sectionDrawParams.scale / 2)}
                    z
                  `}
                  fill="rgba(59, 130, 246, 0.15)"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              )}

              {profileType === 'pipe' && (
                <>
                  <circle
                    cx={sectionDrawParams.cx}
                    cy={sectionDrawParams.cy}
                    r={sectionDrawParams.w / 2}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={sectionDrawParams.cx}
                    cy={sectionDrawParams.cy}
                    r={Math.max(1, (sectionDrawParams.w - 2 * dimT * sectionDrawParams.scale) / 2)}
                    fill="#f8fafc"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                </>
              )}

              <line x1={sectionDrawParams.cx - 6} y1={sectionDrawParams.cy} x2={sectionDrawParams.cx + 6} y2={sectionDrawParams.cy} stroke="#64748b" strokeWidth="1" />
              <line x1={sectionDrawParams.cx} y1={sectionDrawParams.cy - 6} x2={sectionDrawParams.cx} y2={sectionDrawParams.cy + 6} stroke="#64748b" strokeWidth="1" />

              <line
                x1={sectionDrawParams.cx - sectionDrawParams.w / 2}
                y1={sectionDrawParams.cy + sectionDrawParams.h / 2 + 12}
                x2={sectionDrawParams.cx + sectionDrawParams.w / 2}
                y2={sectionDrawParams.cy + sectionDrawParams.h / 2 + 12}
                stroke="#475569"
                strokeWidth="1"
              />
              <line x1={sectionDrawParams.cx - sectionDrawParams.w / 2} y1={sectionDrawParams.cy + sectionDrawParams.h / 2 + 8} x2={sectionDrawParams.cx - sectionDrawParams.w / 2} y2={sectionDrawParams.cy + sectionDrawParams.h / 2 + 16} stroke="#475569" strokeWidth="1" />
              <line x1={sectionDrawParams.cx + sectionDrawParams.w / 2} y1={sectionDrawParams.cy + sectionDrawParams.h / 2 + 8} x2={sectionDrawParams.cx + sectionDrawParams.w / 2} y2={sectionDrawParams.cy + sectionDrawParams.h / 2 + 16} stroke="#475569" strokeWidth="1" />
              <text x={sectionDrawParams.cx} y={sectionDrawParams.cy + sectionDrawParams.h / 2 + 25} fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">
                B = {dimB} mm
              </text>

              <line
                x1={sectionDrawParams.cx - sectionDrawParams.w / 2 - 12}
                y1={sectionDrawParams.cy - sectionDrawParams.h / 2}
                x2={sectionDrawParams.cx - sectionDrawParams.w / 2 - 12}
                y2={sectionDrawParams.cy + sectionDrawParams.h / 2}
                stroke="#475569"
                strokeWidth="1"
              />
              <line x1={sectionDrawParams.cx - sectionDrawParams.w / 2 - 16} y1={sectionDrawParams.cy - sectionDrawParams.h / 2} x2={sectionDrawParams.cx - sectionDrawParams.w / 2 - 8} y2={sectionDrawParams.cy - sectionDrawParams.h / 2} stroke="#475569" strokeWidth="1" />
              <line x1={sectionDrawParams.cx - sectionDrawParams.w / 2 - 16} y1={sectionDrawParams.cy + sectionDrawParams.h / 2} x2={sectionDrawParams.cx - sectionDrawParams.w / 2 - 8} y2={sectionDrawParams.cy + sectionDrawParams.h / 2} stroke="#475569" strokeWidth="1" />
              <text x={sectionDrawParams.cx - sectionDrawParams.w / 2 - 22} y={sectionDrawParams.cy + 3} fill="#475569" fontSize="8" fontWeight="bold" textAnchor="end">
                H = {profileType === 'pipe' ? dimB : dimH} mm
              </text>
            </svg>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] font-semibold text-slate-500 space-y-1">
            <div className="font-black text-slate-800 text-sm uppercase tracking-wider mb-1">
              Cross Section Properties:
            </div>
            <div className="flex justify-between font-mono">
              <span>Section Area (A):</span>
              <span className="text-slate-800 font-bold" data-testid="res-section-area">{geoProperties.area.toFixed(1)} mm²</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Moment of Inertia (Ix):</span>
              <span className="text-slate-800 font-bold" data-testid="res-ix">{geoProperties.Ix.toExponential(4)} mm⁴</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Section Modulus (Wx):</span>
              <span className="text-slate-800 font-bold" data-testid="res-wx">{geoProperties.Wx.toExponential(4)} mm³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configurations Panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile and Support Configuration */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" /> Beam Setup Parameters
            </h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Select support structure and profile geometries
            </p>
          </div>

          {/* Load Condition Selector */}
          <div className="space-y-2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wide">
              1. Support & Load Arrangement
            </label>
            <select
              data-testid="select-load-condition"
              value={loadConditionIdx}
              onChange={(e) => setLoadConditionIdx(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-blue-500 text-white"
            >
              {LOAD_CONDITIONS.map((c, i) => (
                <option key={c.id} value={i}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Section Selector */}
          <div className="space-y-2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wide">
              2. Beam Section Shape
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {PROFILE_TYPES.map((p) => (
                <button
                  key={p.id}
                  data-testid={`btn-profile-${p.id}`}
                  onClick={() => setProfileType(p.id)}
                  className={`py-3 px-2 rounded-xl text-base font-black border transition-all ${
                    profileType === p.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions Controls Based on Shape */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <div className="text-base font-black text-slate-400 uppercase tracking-wide">
              3. Cross Section Dimensions (mm)
            </div>

            {profileType === 'i-beam' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Height (H)</span>
                    <span className="font-mono text-blue-400">{dimHStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-h"
                    value={dimHStr}
                    onChange={(e) => setDimHStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Flange Width (B)</span>
                    <span className="font-mono text-blue-400">{dimBStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-b"
                    value={dimBStr}
                    onChange={(e) => setDimBStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Flange Thickness (tf)</span>
                    <span className="font-mono text-blue-400">{dimTfStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-tf"
                    value={dimTfStr}
                    onChange={(e) => setDimTfStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Web Thickness (tw)</span>
                    <span className="font-mono text-blue-400">{dimTwStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-tw"
                    value={dimTwStr}
                    onChange={(e) => setDimTwStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {profileType === 'box' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Outer Height (H)</span>
                    <span className="font-mono text-blue-400">{dimHStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-h"
                    value={dimHStr}
                    onChange={(e) => setDimHStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Outer Width (B)</span>
                    <span className="font-mono text-blue-400">{dimBStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-b"
                    value={dimBStr}
                    onChange={(e) => setDimBStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Wall Thickness (t)</span>
                    <span className="font-mono text-blue-400">{dimTStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-t"
                    value={dimTStr}
                    onChange={(e) => setDimTStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {profileType === 'solid-rect' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Height (H)</span>
                    <span className="font-mono text-blue-400">{dimHStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-h"
                    value={dimHStr}
                    onChange={(e) => setDimHStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Width (B)</span>
                    <span className="font-mono text-blue-400">{dimBStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-b"
                    value={dimBStr}
                    onChange={(e) => setDimBStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {profileType === 'pipe' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Outer Diameter (D)</span>
                    <span className="font-mono text-blue-400">{dimBStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-b"
                    value={dimBStr}
                    onChange={(e) => setDimBStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold flex justify-between">
                    <span>Wall Thickness (t)</span>
                    <span className="font-mono text-blue-400">{dimTStr} mm</span>
                  </label>
                  <input
                    type="number"
                    data-testid="input-dim-t"
                    value={dimTStr}
                    onChange={(e) => setDimTStr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Load values and Materials */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6 self-stretch">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" /> Physical Loads & Materials
              </h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Define structural parameters and forces
              </p>
            </div>

            {/* Span Length */}
            <div className="space-y-2">
              <label className="text-base font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Beam Span Length (L)</span>
                <span className="text-blue-400 font-mono text-lg">{lengthStr} m</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.1"
                value={length || 0.5}
                onChange={(e) => setLengthStr(e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="input-span-length"
                  value={lengthStr}
                  onChange={(e) => setLengthStr(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-mono font-bold focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>

            {/* Load Values */}
            <div className="space-y-2">
              <label className="text-base font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>
                  {loadSetup.load === 'point' ? 'Applied Point Force (P)' : 'Uniform Load (w)'}
                </span>
                <span className="text-blue-400 font-mono text-lg">
                  {loadValueStr} {loadSetup.load === 'point' ? 'kN' : 'kN/m'}
                </span>
              </label>
              <input
                type="range"
                min="0.5"
                max="200"
                step="0.5"
                value={loadValue || 0.5}
                onChange={(e) => setLoadValueStr(e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="input-load-value"
                  value={loadValueStr}
                  onChange={(e) => setLoadValueStr(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-mono font-bold focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>

            {/* Material Presets */}
            <div className="space-y-2">
              <label className="text-base font-black text-slate-400 uppercase tracking-wide">
                Material Grade Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MATERIALS.map((m, i) => (
                  <button
                    key={i}
                    data-testid={`btn-material-${i}`}
                    onClick={() => setMaterialIdx(i)}
                    className={`py-2.5 px-2 rounded-xl text-sm font-black border transition-all ${
                      materialIdx === i
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Material Fields */}
            {materialIdx === 3 && (
              <div className="grid grid-cols-2 gap-4 border border-slate-800 rounded-2xl p-4 bg-slate-950/20">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold">Elastic Modulus (GPa)</label>
                  <input
                    type="text"
                    data-testid="input-custom-e"
                    value={customE}
                    onChange={(e) => setCustomE(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-750 rounded-xl px-3 py-2 text-base font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400 font-bold">Yield Strength (MPa)</label>
                  <input
                    type="text"
                    data-testid="input-custom-yield"
                    value={customYield}
                    onChange={(e) => setCustomYield(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-750 rounded-xl px-3 py-2 text-base font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Block */}
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3.5 text-base">
            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">
              Bending deflection & stress report
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-750">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Max Moment</div>
                <div className="text-white font-black text-xl font-mono" data-testid="res-max-moment">
                  {(structuralOutputs.maxMoment / 1e6).toFixed(3)}
                  <span className="text-sm text-slate-400 ml-1">kN·m</span>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-750">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Max Deflection</div>
                <div
                  data-testid="res-max-deflection"
                  className={`font-black text-xl font-mono ${
                    structuralOutputs.isDeflectionSafe ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {structuralOutputs.maxDeflection.toFixed(2)}
                  <span className="text-sm text-slate-400 ml-1">mm</span>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-750">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Bending Stress</div>
                <div
                  data-testid="res-max-stress"
                  className={`font-black text-xl font-mono ${
                    structuralOutputs.isStressSafe ? 'text-white' : 'text-red-400'
                  }`}
                >
                  {structuralOutputs.maxStress.toFixed(1)}
                  <span className="text-sm text-slate-400 ml-1">MPa</span>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-750">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Safety Factor</div>
                <div
                  data-testid="res-safety-factor"
                  className={`font-black text-xl font-mono ${
                    structuralOutputs.isStressSafe ? 'text-blue-400' : 'text-red-400'
                  }`}
                >
                  {structuralOutputs.safetyFactor > 100 ? '99+' : structuralOutputs.safetyFactor.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Recommendation limit note */}
            <div className="bg-blue-950/20 rounded-xl p-3 border border-blue-900/30 text-[11px] font-semibold text-blue-200 leading-relaxed">
              Standard building code deflection limit for this configuration is <strong className="text-white">L/{loadSetup.support === 'cantilever' ? 180 : (materialIdx === 2 ? 360 : 240)} = {structuralOutputs.targetLimit.toFixed(2)} mm</strong>.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              data-testid="btn-copy-report"
              onClick={handleCopySummary}
              className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-black text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copied ? (
                <><Check className="w-4 h-4 text-green-600" /> Report Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Report</>
              )}
            </button>
            <button
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Structural Reference Guide */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Beam Deflection Engineering Guidelines (AISC 360 & Eurocode 3)
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-lg">
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">1. Bending Stresses & Moment of Inertia</h4>
            <div className="space-y-3 text-base text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Moment of Inertia (I<sub>x</sub>)</strong> measures a profile{"'"}s resistance to bending based purely on its geometric shape. An I-beam concentrates material in the top and bottom flanges away from the neutral axis, maximizing I<sub>x</sub> while minimizing weight.
              </p>
              <p>
                <strong>Maximum Bending Stress (σ<sub>max</sub>)</strong> occurs at the extreme outer fibers of the beam (furthest from the neutral axis). It is calculated as:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-center text-lg text-slate-800 font-black">
                {"\u03C3_max = M_max / W_x"}
              </div>
              <p>
                Where M<sub>max</sub> is the peak bending moment and W<sub>x</sub> is the elastic section modulus (W<sub>x</sub> = I<sub>x</sub> / y<sub>max</sub>). To prevent permanent structural deformation, this bending stress must not exceed the material{"'"}s yield strength.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">2. Standard Deflection Serviceability Limits</h4>
            <div className="space-y-3 text-base text-slate-500 font-semibold leading-relaxed">
              <p>
                In structural engineering, beam deflection is governed by <em>serviceability limits</em> to prevent unsightly sagging, cracking of plaster, or vibration. Deflection limits are defined as a fraction of the span length L:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-mono leading-relaxed">
                <li><strong className="text-slate-800">L/360</strong>: Strictest limit. Commonly used for floor joists supporting plaster ceilings to prevent cracking under live loads.</li>
                <li><strong className="text-slate-800">L/240</strong>: Standard limit for roof beams, rafters, and members supporting non-plaster ceilings under combined loads.</li>
                <li><strong className="text-slate-800">L/180</strong>: Frequently applied to cantilever beams or steel roof purlins where sagging has fewer cosmetic impacts.</li>
              </ul>
              <p>
                If your beam deflection exceeds these thresholds, the structure may be safe from structural failure but will violate building codes or trigger serviceability issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4.5 flex gap-3 text-base text-blue-700 leading-relaxed font-semibold">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase text-blue-800">AISC Steel Selection Tip:</span> When designing structural members using AISC standards, beam self-weight should be added to the uniformly distributed dead load. The self-weight can be computed by multiplying the cross-sectional area (A) by the density of steel (7850 kg/m³ or 0.00000785 g/mm³).
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
