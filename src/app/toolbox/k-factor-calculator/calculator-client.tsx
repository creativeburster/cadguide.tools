'use client';

import { useState, useEffect, useRef } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Info, Download, HelpCircle, Layers, FileText, Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  material: string;
  thickness: string;
  radius: string;
  angle: string;
  flange1: string;
  flange2: string;
  kFactor: string;
}

const PRESETS: Preset[] = [
  { id: 'preset-mild-1mm', name: '1.0mm Mild Steel (Press Brake)', material: 'Mild Steel', thickness: '1.0', radius: '1.0', angle: '90', flange1: '50', flange2: '50', kFactor: '0.44' },
  { id: 'preset-mild-2mm', name: '2.0mm Mild Steel (Press Brake)', material: 'Mild Steel', thickness: '2.0', radius: '2.0', angle: '90', flange1: '50', flange2: '50', kFactor: '0.44' },
  { id: 'preset-ss-15mm', name: '1.5mm Stainless Steel', material: 'Stainless Steel', thickness: '1.5', radius: '2.0', angle: '90', flange1: '40', flange2: '60', kFactor: '0.38' },
  { id: 'preset-al-12mm', name: '1.2mm Aluminum (5052)', material: 'Aluminum', thickness: '1.2', radius: '1.5', angle: '90', flange1: '35', flange2: '45', kFactor: '0.40' },
  { id: 'preset-cu-3mm', name: '3.0mm Copper (Soft)', material: 'Copper/Brass', thickness: '3.0', radius: '3.0', angle: '90', flange1: '60', flange2: '60', kFactor: '0.45' },
];

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parseNonNeg(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

export default function KFactorCalculatorClient() {
  const [material, setMaterial] = useState<string>('Mild Steel');
  const [referenceMode, setReferenceMode] = useState<'apex' | 'tangent'>('apex');
  const [kMode, setKMode] = useState<'custom' | 'empirical'>('custom');

  const [thicknessStr, setThicknessStr] = useState<string>('2.0');
  const [radiusStr, setRadiusStr] = useState<string>('2.0');
  const [angleStr, setAngleStr] = useState<string>('90');
  const [flange1Str, setFlange1Str] = useState<string>('50');
  const [flange2Str, setFlange2Str] = useState<string>('50');
  const [customKStr, setCustomKStr] = useState<string>('0.44');

  const [isFlattened, setIsFlattened] = useState<boolean>(false);
  const [flattenProgress, setFlattenProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const target = isFlattened ? 1 : 0;
    const animate = () => {
      let stop = false;
      setFlattenProgress((prev) => {
        if (Math.abs(prev - target) < 0.01) {
          stop = true;
          return target;
        }
        return prev + (target - prev) * 0.15;
      });
      if (!stop) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isFlattened]);

  const thickness = parsePos(thicknessStr);
  const radius = parseNonNeg(radiusStr);
  const angle = parsePos(angleStr);
  const flange1 = parsePos(flange1Str);
  const flange2 = parsePos(flange2Str);
  const customK = parsePos(customKStr);

  const angleValid = angle !== null && angle > 0 && angle < 180;
  const kValid = kMode === 'empirical' || (customK !== null && customK > 0 && customK <= 1);
  const isValid =
    thickness !== null &&
    radius !== null &&
    angleValid &&
    flange1 !== null &&
    flange2 !== null &&
    kValid;

  let empiricalK = 0.4;
  if (thickness !== null && radius !== null) {
    const ratio = radius / thickness;
    if (ratio <= 0.6) empiricalK = 0.33;
    else if (ratio <= 1.0) empiricalK = 0.4;
    else if (ratio <= 1.5) empiricalK = 0.43;
    else if (ratio <= 2.0) empiricalK = 0.45;
    else if (ratio <= 3.0) empiricalK = 0.47;
    else empiricalK = 0.5;
  }

  const activeK = kMode === 'empirical' ? empiricalK : (customK ?? 0.44);

  let ba: number | null = null;
  let os: number | null = null;
  let bd: number | null = null;
  let flatLength: number | null = null;

  if (isValid && thickness !== null && radius !== null && angle !== null && flange1 !== null && flange2 !== null) {
    const alphaRad = (angle * Math.PI) / 180;
    ba = alphaRad * (radius + activeK * thickness);
    os = Math.tan(alphaRad / 2) * (radius + thickness);
    bd = 2 * os - ba;
    if (referenceMode === 'apex') {
      flatLength = flange1 + flange2 - bd;
    } else {
      flatLength = flange1 + flange2 + ba;
    }
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  // Safe numeric fallbacks solely for rendering the non-NaN SVG diagram
  const sT = thickness ?? 2.0;
  const sR = radius ?? 2.0;
  const sA = angleValid && angle !== null ? angle : 90;
  const sF1 = flange1 ?? 50;
  const sF2 = flange2 ?? 50;
  const sK = Number.isFinite(activeK) && activeK > 0 && activeK <= 1 ? activeK : 0.44;
  const sAlphaRad = (sA * Math.PI) / 180;
  const sBA = sAlphaRad * (sR + sK * sT);
  const sOS = Math.tan(sAlphaRad / 2) * (sR + sT);
  const sFlat = referenceMode === 'apex' ? sF1 + sF2 - (2 * sOS - sBA) : sF1 + sF2 + sBA;
  const sTan1 = referenceMode === 'apex' ? Math.max(0, sF1 - sOS) : sF1;
  const sTan2 = referenceMode === 'apex' ? Math.max(0, sF2 - sOS) : sF2;

  const cx = 140;
  const cy = 200;
  const visR = sR * 7;
  const visT = sT * 7;
  const thetaEnd = (90 - sA) * (Math.PI / 180);
  const scaleFactor = 120 / Math.max(sF1, sF2, 20);
  const lt1 = sTan1 * scaleFactor;
  const lt2 = sTan2 * scaleFactor;
  const baVis = sBA * 7;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const lp = (p0: { x: number; y: number }, p1: { x: number; y: number }, t: number) => ({
    x: lerp(p0.x, p1.x, t),
    y: lerp(p0.y, p1.y, t),
  });

  const p = flattenProgress;
  const iS0 = { x: cx - visR - lt1, y: cy + visR };
  const iT0 = { x: cx, y: cy + visR };
  const iE0 = { x: cx + visR * Math.cos(thetaEnd), y: cy + visR * Math.sin(thetaEnd) };
  const iEnd0 = { x: iE0.x + lt2 * Math.sin(thetaEnd), y: iE0.y - lt2 * Math.cos(thetaEnd) };

  const oS0 = { x: cx - visR - lt1, y: cy + visR + visT };
  const oT0 = { x: cx, y: cy + visR + visT };
  const oE0 = { x: cx + (visR + visT) * Math.cos(thetaEnd), y: cy + (visR + visT) * Math.sin(thetaEnd) };
  const oEnd0 = { x: oE0.x + lt2 * Math.sin(thetaEnd), y: oE0.y - lt2 * Math.cos(thetaEnd) };

  const nS0 = { x: cx - visR - lt1, y: cy + visR + sK * visT };
  const nT0 = { x: cx, y: cy + visR + sK * visT };
  const nE0 = { x: cx + (visR + sK * visT) * Math.cos(thetaEnd), y: cy + (visR + sK * visT) * Math.sin(thetaEnd) };
  const nEnd0 = { x: nE0.x + lt2 * Math.sin(thetaEnd), y: nE0.y - lt2 * Math.cos(thetaEnd) };

  const innerStart = lp(iS0, iS0, p);
  const innerT1 = lp(iT0, iT0, p);
  const innerArcEnd = lp(iE0, { x: iT0.x + baVis, y: iT0.y }, p);
  const innerEnd = lp(iEnd0, { x: iT0.x + baVis + lt2, y: iT0.y }, p);

  const outerStart = lp(oS0, oS0, p);
  const outerT1 = lp(oT0, oT0, p);
  const outerArcEnd = lp(oE0, { x: oT0.x + baVis, y: oT0.y }, p);
  const outerEnd = lp(oEnd0, { x: oT0.x + baVis + lt2, y: oT0.y }, p);

  const neutralStart = lp(nS0, nS0, p);
  const neutralT1 = lp(nT0, nT0, p);
  const neutralArcEnd = lp(nE0, { x: nT0.x + baVis, y: nT0.y }, p);
  const neutralEnd = lp(nEnd0, { x: nT0.x + baVis + lt2, y: nT0.y }, p);

  const curR = lerp(visR, 200000, p);
  const curROut = lerp(visR + visT, 200000, p);
  const curRN = lerp(visR + sK * visT, 200000, p);

  const handleApplyPreset = (preset: Preset) => {
    setMaterial(preset.material);
    setThicknessStr(preset.thickness);
    setRadiusStr(preset.radius);
    setAngleStr(preset.angle);
    setFlange1Str(preset.flange1);
    setFlange2Str(preset.flange2);
    setCustomKStr(preset.kFactor);
    setKMode('custom');
  };

  const handleReset = () => {
    setReferenceMode('apex');
    setKMode('custom');
    handleApplyPreset(PRESETS[1]);
  };

  const handleCopy = async () => {
    if (!isValid || ba === null || bd === null || os === null || flatLength === null) return;
    const text = [
      'Sheet Metal K-Factor & Bend Allowance Summary',
      `T=${thickness} mm, R=${radius} mm, Angle=${angle} deg, K=${activeK.toFixed(4)} (${referenceMode})`,
      `Flat Pattern Length: ${flatLength.toFixed(3)} mm`,
      `BA=${ba.toFixed(3)} mm, BD=${bd.toFixed(3)} mm, OS=${os.toFixed(3)} mm`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const downloadCsv = () => {
    if (!isValid || ba === null || bd === null || os === null || flatLength === null) return;
    const csvContent = [
      ['parameter', 'value', 'unit'],
      ['material', material, 'grade'],
      ['bending_angle', String(angle), 'deg'],
      ['sheet_thickness', String(thickness), 'mm'],
      ['inner_radius', String(radius), 'mm'],
      ['k_factor', activeK.toFixed(4), 'ratio'],
      ['reference_mode', referenceMode, 'mode'],
      ['flange_1', String(flange1), 'mm'],
      ['flange_2', String(flange2), 'mm'],
      ['bend_allowance', ba.toFixed(4), 'mm'],
      ['outside_setback', os.toFixed(4), 'mm'],
      ['bend_deduction', bd.toFixed(4), 'mm'],
      ['flat_pattern_length', flatLength.toFixed(4), 'mm'],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `k-factor-calculation-report-${material.replace(/\s+|\//g, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadSvg = () => {
    const svgEl = document.getElementById('k-factor-svg');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `k-factor-bend-radius-${sR}mm-thickness-${sT}mm.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> Presets &amp; Bending Templates
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-testid={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="px-4 py-2 rounded-xl text-base font-bold bg-slate-50 border border-slate-100 text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Bending Parameters</h2>
            <p className="text-base text-slate-400 font-semibold">
              Adjust sliders or input exact values to update flat pattern geometry.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-base font-black text-slate-500 uppercase tracking-wider">Dimension Reference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="mode-apex"
                  onClick={() => setReferenceMode('apex')}
                  className={`py-2 px-3 rounded-xl text-base font-black border transition-all ${
                    referenceMode === 'apex'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Outside Flange (Apex)
                </button>
                <button
                  type="button"
                  data-testid="mode-tangent"
                  onClick={() => setReferenceMode('tangent')}
                  className={`py-2 px-3 rounded-xl text-base font-black border transition-all ${
                    referenceMode === 'tangent'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tangent (Straight)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-base font-bold text-slate-700">
                <span className="uppercase tracking-wider">Sheet Thickness (T)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid="input-thickness"
                    value={thicknessStr}
                    onChange={(e) => setThicknessStr(e.target.value)}
                    className="w-20 h-9 text-center rounded-lg bg-slate-50 border border-slate-200 focus:outline-none font-bold"
                  />
                  <span>mm</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={Math.min(10, Math.max(0.5, sT))}
                onChange={(e) => setThicknessStr(e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-base font-bold text-slate-700">
                <span className="uppercase tracking-wider">Inside Radius (R)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid="input-radius"
                    value={radiusStr}
                    onChange={(e) => setRadiusStr(e.target.value)}
                    className="w-20 h-9 text-center rounded-lg bg-slate-50 border border-slate-200 focus:outline-none font-bold"
                  />
                  <span>mm</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.1"
                value={Math.min(15, Math.max(0.5, sR))}
                onChange={(e) => setRadiusStr(e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-base font-bold text-slate-700">
                <span className="uppercase tracking-wider">Bending Angle (deg)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid="input-angle"
                    value={angleStr}
                    onChange={(e) => setAngleStr(e.target.value)}
                    className="w-20 h-9 text-center rounded-lg bg-slate-50 border border-slate-200 focus:outline-none font-bold"
                  />
                  <span>deg</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="170"
                step="1"
                value={Math.min(170, Math.max(10, sA))}
                onChange={(e) => setAngleStr(e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Flange 1 (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-flange1"
                  value={flange1Str}
                  onChange={(e) => setFlange1Str(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-base"
                />
              </div>
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Flange 2 (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-flange2"
                  value={flange2Str}
                  onChange={(e) => setFlange2Str(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-base"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-base font-black text-slate-500 uppercase tracking-wider">K-Factor Calculation</label>
                <div className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  <Info className="w-3 h-3" /> Empirical R/T Rule
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="kmode-custom"
                  onClick={() => setKMode('custom')}
                  className={`py-2 px-3 rounded-xl text-base font-black border transition-all ${
                    kMode === 'custom'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Custom Manual K
                </button>
                <button
                  type="button"
                  data-testid="kmode-empirical"
                  onClick={() => setKMode('empirical')}
                  className={`py-2 px-3 rounded-xl text-base font-black border transition-all ${
                    kMode === 'empirical'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Empirical R/T Auto
                </button>
              </div>

              {kMode === 'custom' ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-base font-bold text-slate-700">
                    <span className="text-slate-400">Manual K-Factor Value (0–1]</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      data-testid="input-kfactor"
                      value={customKStr}
                      onChange={(e) => setCustomKStr(e.target.value)}
                      className="w-20 h-9 text-center rounded-lg bg-slate-50 border border-slate-200 focus:outline-none font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between text-base font-bold text-slate-700">
                  <div>
                    <div className="text-slate-400">Empirical R/T Auto K:</div>
                    <div className="text-blue-600 text-lg font-black mt-0.5">K = {empiricalK.toFixed(2)}</div>
                  </div>
                  <div className="text-right text-sm text-slate-400 font-semibold max-w-[160px] leading-relaxed">
                    Based on R/T ratio: {(sR / sT).toFixed(2)}.
                  </div>
                </div>
              )}
            </div>

            {!isValid && (
              <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Thickness and flanges must be &gt; 0, radius &ge; 0, angle in (0, 180) deg, and K in (0, 1].</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-testid="btn-reset"
                onClick={handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                type="button"
                data-testid="btn-copy"
                onClick={handleCopy}
                className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" /> Bending Profile Visualizer
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlattened(!isFlattened)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-base font-black transition-all ${
                    isFlattened
                      ? 'bg-emerald-600 border border-emerald-600 text-white'
                      : 'bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {isFlattened ? 'Bend Profile' : 'Flatten Profile'}
                </button>
                <button
                  type="button"
                  onClick={downloadSvg}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-bold bg-slate-50 border border-slate-100 text-slate-600 hover:bg-blue-50"
                >
                  <Download className="w-3.5 h-3.5" /> SVG
                </button>
              </div>
            </div>

            <div className="w-full flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-950 p-4 relative min-h-[300px]">
              <svg id="k-factor-svg" viewBox="0 0 420 350" className="w-full max-w-[420px] h-auto drop-shadow-lg font-sans">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#0f172a" rx="24" />
                <rect width="100%" height="100%" fill="url(#grid)" rx="24" />

                <path
                  d={`M ${innerStart.x} ${innerStart.y} L ${innerT1.x} ${innerT1.y} A ${curR} ${curR} 0 0 0 ${innerArcEnd.x} ${innerArcEnd.y} L ${innerEnd.x} ${innerEnd.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${outerStart.x} ${outerStart.y} L ${outerT1.x} ${outerT1.y} A ${curROut} ${curROut} 0 0 0 ${outerArcEnd.x} ${outerArcEnd.y} L ${outerEnd.x} ${outerEnd.y}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line x1={innerStart.x} y1={innerStart.y} x2={outerStart.x} y2={outerStart.y} stroke="#818cf8" strokeWidth="2.5" />
                <line x1={innerEnd.x} y1={innerEnd.y} x2={outerEnd.x} y2={outerEnd.y} stroke="#818cf8" strokeWidth="2.5" />
                <path
                  d={`M ${neutralStart.x} ${neutralStart.y} L ${neutralT1.x} ${neutralT1.y} A ${curRN} ${curRN} 0 0 0 ${neutralArcEnd.x} ${neutralArcEnd.y} L ${neutralEnd.x} ${neutralEnd.y}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4,4"
                />

                <text x="20" y="35" fill="#475569" className="text-sm font-black uppercase tracking-widest font-mono">
                  CADGuide.tools // Bending Blueprint
                </text>
                <text x="20" y="318" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  T={sT.toFixed(1)} mm | R={sR.toFixed(1)} mm | K={sK.toFixed(2)} | L={sFlat.toFixed(2)} mm
                </text>
              </svg>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Calculated Results</h3>
              <button
                type="button"
                data-testid="btn-download"
                onClick={downloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> CSV Report
              </button>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <div className="text-base font-bold text-slate-400 uppercase tracking-widest">Flat Pattern Blank Length (L)</div>
              <div className="text-4xl md:text-5xl font-black tracking-tight text-blue-400">
                <span data-testid="result-flat-length">{fmt(flatLength, 3)}</span>{' '}
                <span className="text-lg md:text-xl text-slate-300">mm</span>
              </div>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                Formula: {referenceMode === 'apex' ? 'F1 + F2 - BD (Apex Legs - Bend Deduction)' : 'L1 + L2 + BA (Tangents + Bend Allowance)'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-slate-800/40 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bend Allowance (BA)</div>
                <div className="text-xl font-black text-white">
                  <span data-testid="result-ba">{fmt(ba, 3)}</span> mm
                </div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-slate-800/40 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bend Deduction (BD)</div>
                <div className="text-xl font-black text-white">
                  <span data-testid="result-bd">{fmt(bd, 3)}</span> mm
                </div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-slate-800/40 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outside Setback (OS)</div>
                <div className="text-xl font-black text-white">
                  <span data-testid="result-os">{fmt(os, 3)}</span> mm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Bending Engineering Reference
        </h3>
        <div className="grid md:grid-cols-2 gap-8 text-base text-slate-600">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wide mb-2">Core Bending Equations</h4>
            <p className="mb-2">BA = (Angle_rad) * (R + K * T)</p>
            <p className="mb-2">OS = tan(Angle / 2) * (R + T)</p>
            <p>BD = 2 * OS - BA</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wide mb-2">Neutral Axis Shift Notes</h4>
            <p>Typical air-bending K-factors range from ~0.33 (tight V-die radius) up to 0.50 (large radius R &gt; 3*T).</p>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
