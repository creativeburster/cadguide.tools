'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Plus, Trash2, RotateCcw, ClipboardList, Info } from 'lucide-react';

type ProfileType =
  | 'i-beam'
  | 'angle'
  | 'channel'
  | 'round-tube'
  | 'square-tube'
  | 'flat-bar'
  | 'round-bar'
  | 'hex-bar';

const PROFILES: { id: ProfileType; name: string; icon: string }[] = [
  { id: 'i-beam', name: 'I-Beam / H-Beam', icon: 'I' },
  { id: 'angle', name: 'Angle (L-Section)', icon: 'L' },
  { id: 'channel', name: 'Channel (U-Section)', icon: 'U' },
  { id: 'round-tube', name: 'Round Tube / Pipe', icon: 'O' },
  { id: 'square-tube', name: 'Square / Rect Tube', icon: '[]' },
  { id: 'flat-bar', name: 'Flat Bar / Plate', icon: '=' },
  { id: 'round-bar', name: 'Round Solid Bar', icon: 'D' },
  { id: 'hex-bar', name: 'Hexagon Bar', icon: 'HEX' },
];

// Densities sourced from Engineering ToolBox Metal Alloys Densities (d_50.html)
const MATERIALS: { id: string; name: string; density: number }[] = [
  { id: 'steel', name: 'Steel (7850 kg/m3)', density: 7850 },
  { id: 'stainless', name: 'Stainless Steel (7900 kg/m3; range 7480-8000)', density: 7900 },
  { id: 'aluminum', name: 'Aluminum (2712 kg/m3)', density: 2712 },
  { id: 'titanium', name: 'Titanium (4500 kg/m3)', density: 4500 },
];

interface BomRow {
  id: string;
  partTag: string;
  materialName: string;
  profileName: string;
  specSummary: string;
  lengthM: number;
  qty: number;
  unitWeightKgM: number;
  totalWeightKg: number;
  totalSurfaceM2: number;
  unitCostPerKg: number;
  totalCost: number;
}

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export default function SteelSectionWeightClient() {
  const [profile, setProfile] = useState<ProfileType>('i-beam');
  const [materialId, setMaterialId] = useState<string>('steel');
  const [customDensityStr, setCustomDensityStr] = useState<string>('7850');
  const [lengthStr, setLengthStr] = useState<string>('6');
  const [quantityStr, setQuantityStr] = useState<string>('1');
  const [unitPriceStr, setUnitPriceStr] = useState<string>('1.25');
  const [partTag, setPartTag] = useState<string>('B-101');

  // I-beam dimensions
  const [hStr, setHStr] = useState('200');
  const [bStr, setBStr] = useState('100');
  const [twStr, setTwStr] = useState('5.7');
  const [tfStr, setTfStr] = useState('8.5');

  // Angle dimensions
  const [a1Str, setA1Str] = useState('50');
  const [a2Str, setA2Str] = useState('50');
  const [tStr, setTStr] = useState('5');

  // Channel dimensions
  const [chStr, setChStr] = useState('200');
  const [cbStr, setCbStr] = useState('75');
  const [ctwStr, setCtwStr] = useState('5');
  const [ctfStr, setCtfStr] = useState('9');

  // Round tube
  const [odStr, setOdStr] = useState('60');
  const [wtStr, setWtStr] = useState('4');

  // Square tube
  const [swStr, setSwStr] = useState('40');
  const [shStr, setShStr] = useState('40');
  const [stStr, setStStr] = useState('3');

  // Flat bar
  const [fwStr, setFwStr] = useState('50');
  const [ftStr, setFtStr] = useState('6');

  // Round solid bar
  const [rbDiaStr, setRbDiaStr] = useState('40');

  // Hex solid bar (across flats AF)
  const [hexAfStr, setHexAfStr] = useState('30');

  const [bomRows, setBomRows] = useState<BomRow[]>([]);

  const calc = useMemo(() => {
    const length = parseFinite(lengthStr);
    const quantity = parseFinite(quantityStr);
    const unitPricePerKg = parseFinite(unitPriceStr);
    const customDensity = parseFinite(customDensityStr);
    const foundMat = MATERIALS.find(m => m.id === materialId);
    const activeDensity = foundMat ? foundMat.density : customDensity;

    if (length === null || quantity === null || unitPricePerKg === null || activeDensity === null) {
      return { valid: false as const, error: 'Enter numeric values for section dimensions, density, length, quantity, and unit price.' };
    }
    if (length < 0 || quantity < 0 || activeDensity <= 0 || unitPricePerKg < 0) {
      return { valid: false as const, error: 'Density must be > 0; length, quantity, and price must be >= 0.' };
    }

    let area = 0; // mm2
    let perimeter = 0; // mm
    let specSummary = '';
    let svgGeom:
      | { kind: 'i-beam'; h: number; b: number; tw: number; tf: number }
      | { kind: 'angle'; a1: number; a2: number; t: number }
      | { kind: 'channel'; ch: number; cb: number; ctw: number; ctf: number }
      | { kind: 'round-tube'; od: number; wt: number }
      | { kind: 'square-tube'; sw: number; sh: number; st: number }
      | { kind: 'flat-bar'; fw: number; ft: number }
      | { kind: 'round-bar'; rbDia: number }
      | { kind: 'hex-bar'; hexAf: number } = { kind: 'i-beam', h: 200, b: 100, tw: 5.7, tf: 8.5 };

    switch (profile) {
      case 'i-beam': {
        const h = parseFinite(hStr);
        const b = parseFinite(bStr);
        const tw = parseFinite(twStr);
        const tf = parseFinite(tfStr);
        if (h === null || b === null || tw === null || tf === null || h <= 0 || b <= 0 || tw <= 0 || tf <= 0) {
          return { valid: false as const, error: 'All I-Beam dimensions (H, B, tw, tf) must be > 0.' };
        }
        if (h < 2 * tf || b < tw) {
          return { valid: false as const, error: 'Require H >= 2*tf and B >= tw for a valid I-Beam cross-section.' };
        }
        const innerH = Math.max(0, h - 2 * tf);
        area = 2 * b * tf + innerH * tw;
        perimeter = 4 * b + 2 * h - 2 * tw;
        specSummary = `H${h}xB${b}xtw${tw}xtf${tf}`;
        svgGeom = { kind: 'i-beam', h, b, tw, tf };
        break;
      }
      case 'angle': {
        const a1 = parseFinite(a1Str);
        const a2 = parseFinite(a2Str);
        const t = parseFinite(tStr);
        if (a1 === null || a2 === null || t === null || a1 <= 0 || a2 <= 0 || t <= 0 || t > a1 || t > a2) {
          return { valid: false as const, error: 'Angle legs and thickness must be > 0 with t <= leg lengths.' };
        }
        area = a1 * t + (a2 - t) * t;
        perimeter = 2 * (a1 + a2);
        specSummary = `L${a1}x${a2}x${t}`;
        svgGeom = { kind: 'angle', a1, a2, t };
        break;
      }
      case 'channel': {
        const ch = parseFinite(chStr);
        const cb = parseFinite(cbStr);
        const ctw = parseFinite(ctwStr);
        const ctf = parseFinite(ctfStr);
        if (ch === null || cb === null || ctw === null || ctf === null || ch <= 0 || cb <= 0 || ctw <= 0 || ctf <= 0) {
          return { valid: false as const, error: 'All Channel dimensions (H, B, tw, tf) must be > 0.' };
        }
        if (ch < 2 * ctf || cb < ctw) {
          return { valid: false as const, error: 'Require H >= 2*tf and B >= tw for a valid Channel cross-section.' };
        }
        const innerH = Math.max(0, ch - 2 * ctf);
        area = 2 * cb * ctf + innerH * ctw;
        perimeter = 4 * cb + 2 * ch - 2 * ctw;
        specSummary = `U${ch}x${cb}xtw${ctw}xtf${ctf}`;
        svgGeom = { kind: 'channel', ch, cb, ctw, ctf };
        break;
      }
      case 'round-tube': {
        const od = parseFinite(odStr);
        const wt = parseFinite(wtStr);
        if (od === null || wt === null || od <= 0 || wt <= 0 || 2 * wt > od) {
          return { valid: false as const, error: 'Round tube OD and wall thickness must be > 0 with 2*wt <= OD.' };
        }
        const id = Math.max(0, od - 2 * wt);
        area = (Math.PI / 4) * (od * od - id * id);
        perimeter = Math.PI * od;
        specSummary = `D${od}x${wt}`;
        svgGeom = { kind: 'round-tube', od, wt };
        break;
      }
      case 'square-tube': {
        const sw = parseFinite(swStr);
        const sh = parseFinite(shStr);
        const st = parseFinite(stStr);
        if (sw === null || sh === null || st === null || sw <= 0 || sh <= 0 || st <= 0 || 2 * st > sw || 2 * st > sh) {
          return { valid: false as const, error: 'Rectangular tube W, H, t must be > 0 with 2*t <= min(W, H).' };
        }
        const innerW = Math.max(0, sw - 2 * st);
        const innerH = Math.max(0, sh - 2 * st);
        area = sw * sh - innerW * innerH;
        perimeter = 2 * (sw + sh);
        specSummary = `RHS-${sw}x${sh}x${st}`;
        svgGeom = { kind: 'square-tube', sw, sh, st };
        break;
      }
      case 'flat-bar': {
        const fw = parseFinite(fwStr);
        const ft = parseFinite(ftStr);
        if (fw === null || ft === null || fw <= 0 || ft <= 0) {
          return { valid: false as const, error: 'Flat bar width and thickness must be > 0.' };
        }
        area = fw * ft;
        perimeter = 2 * (fw + ft);
        specSummary = `PL-${fw}x${ft}`;
        svgGeom = { kind: 'flat-bar', fw, ft };
        break;
      }
      case 'round-bar': {
        const rbDia = parseFinite(rbDiaStr);
        if (rbDia === null || rbDia <= 0) {
          return { valid: false as const, error: 'Round bar diameter must be > 0.' };
        }
        area = (Math.PI / 4) * rbDia * rbDia;
        perimeter = Math.PI * rbDia;
        specSummary = `D${rbDia}-Solid`;
        svgGeom = { kind: 'round-bar', rbDia };
        break;
      }
      case 'hex-bar': {
        const hexAf = parseFinite(hexAfStr);
        if (hexAf === null || hexAf <= 0) {
          return { valid: false as const, error: 'Hex bar across-flats AF must be > 0.' };
        }
        area = (Math.sqrt(3) / 2) * hexAf * hexAf;
        perimeter = 2 * Math.sqrt(3) * hexAf;
        specSummary = `HEX-AF${hexAf}`;
        svgGeom = { kind: 'hex-bar', hexAf };
        break;
      }
    }

    const areaM2 = area / 1_000_000;
    const perimeterM = perimeter / 1000;
    const weightPerMeter = areaM2 * activeDensity;
    const totalWeight = weightPerMeter * length * quantity;
    const surfacePerMeter = perimeterM;
    const totalSurface = surfacePerMeter * length * quantity + 2 * areaM2 * quantity;
    const estimatedCost = totalWeight * unitPricePerKg;

    return {
      valid: true as const,
      length,
      quantity,
      unitPricePerKg,
      activeDensity,
      areaNum: area,
      area: area.toFixed(1),
      weightPerMeterNum: weightPerMeter,
      weightPerMeter: weightPerMeter.toFixed(3),
      totalWeightNum: totalWeight,
      totalWeight: totalWeight.toFixed(2),
      surfacePerMeterNum: surfacePerMeter,
      surfacePerMeter: surfacePerMeter.toFixed(4),
      totalSurfaceNum: totalSurface,
      totalSurface: totalSurface.toFixed(3),
      estimatedCostNum: estimatedCost,
      estimatedCost: estimatedCost.toFixed(2),
      specSummary,
      svgGeom,
    };
  }, [
    profile, materialId, customDensityStr, lengthStr, quantityStr, unitPriceStr,
    hStr, bStr, twStr, tfStr, a1Str, a2Str, tStr, chStr, cbStr, ctwStr, ctfStr,
    odStr, wtStr, swStr, shStr, stStr, fwStr, ftStr, rbDiaStr, hexAfStr,
  ]);

  const addToBom = () => {
    if (!calc.valid) return;
    const matName = MATERIALS.find(m => m.id === materialId)?.name.split(' (')[0] || 'Custom Material';
    const profName = PROFILES.find(p => p.id === profile)?.name || profile;
    const newRow: BomRow = {
      id: `bom-${Date.now()}-${bomRows.length}`,
      partTag: partTag.trim() || `M-${bomRows.length + 1}`,
      materialName: matName,
      profileName: profName,
      specSummary: calc.specSummary,
      lengthM: calc.length,
      qty: calc.quantity,
      unitWeightKgM: calc.weightPerMeterNum,
      totalWeightKg: calc.totalWeightNum,
      totalSurfaceM2: calc.totalSurfaceNum,
      unitCostPerKg: calc.unitPricePerKg,
      totalCost: calc.estimatedCostNum,
    };
    setBomRows(prev => [...prev, newRow]);
    setPartTag(`B-${101 + bomRows.length + 1}`);
  };

  const removeBomRow = (id: string) => {
    setBomRows(prev => prev.filter(r => r.id !== id));
  };

  const bomSummary = useMemo(() => {
    const totalQty = bomRows.reduce((s, r) => s + r.qty, 0);
    const totalMassKg = bomRows.reduce((s, r) => s + r.totalWeightKg, 0);
    const totalAreaM2 = bomRows.reduce((s, r) => s + r.totalSurfaceM2, 0);
    const totalCostVal = bomRows.reduce((s, r) => s + r.totalCost, 0);
    return { totalQty, totalMassKg, totalAreaM2, totalCostVal };
  }, [bomRows]);

  const resetDefaults = () => {
    setProfile('i-beam');
    setMaterialId('steel');
    setCustomDensityStr('7850');
    setHStr('200');
    setBStr('100');
    setTwStr('5.7');
    setTfStr('8.5');
    setChStr('200');
    setCbStr('75');
    setCtwStr('5');
    setCtfStr('9');
    setLengthStr('6');
    setQuantityStr('1');
    setUnitPriceStr('1.25');
  };

  const downloadCsv = () => {
    if (!calc.valid) return;
    const matObj = MATERIALS.find(m => m.id === materialId);
    const baseLines = [
      ['# Metal Section Weight & BOM Cost Report', ''],
      ['Profile Type', PROFILES.find(p => p.id === profile)?.name || ''],
      ['Material', matObj?.name || `${calc.activeDensity} kg/m3`],
      ['Specification', calc.specSummary],
      ['Length (m)', calc.length],
      ['Quantity', calc.quantity],
      ['Cross-Section Area (mm2)', calc.areaNum.toFixed(2)],
      ['Weight per Meter (kg/m)', calc.weightPerMeterNum.toFixed(6)],
      ['Total Weight (kg)', calc.totalWeightNum.toFixed(4)],
      ['Surface Area per Meter (m2/m)', calc.surfacePerMeterNum.toFixed(4)],
      ['Total Surface Area (m2)', calc.totalSurfaceNum.toFixed(6)],
      ['Estimated Material Cost ($)', calc.estimatedCostNum.toFixed(2)],
    ].map(r => r.join(','));

    if (bomRows.length > 0) {
      baseLines.push('');
      baseLines.push('# Accumulated Multi-Shape BOM Schedule');
      baseLines.push('Tag,Material,Profile,Dimension Spec,Length (m),Qty,Unit Weight (kg/m),Total Weight (kg),Paint Area (m2),Unit Price ($/kg),Subtotal Cost ($)');
      for (const r of bomRows) {
        baseLines.push(
          `${r.partTag},"${r.materialName}","${r.profileName}","${r.specSummary}",${r.lengthM},${r.qty},${r.unitWeightKgM.toFixed(3)},${r.totalWeightKg.toFixed(3)},${r.totalSurfaceM2.toFixed(4)},${r.unitCostPerKg.toFixed(2)},${r.totalCost.toFixed(2)}`
        );
      }
      baseLines.push(
        `TOTAL,,,,,${bomSummary.totalQty},,${bomSummary.totalMassKg.toFixed(3)},${bomSummary.totalAreaM2.toFixed(4)},,${bomSummary.totalCostVal.toFixed(2)}`
      );
    }

    const blob = new Blob([baseLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steel-section-weight-bom.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Quick Presets:</span>
        <button
          type="button"
          data-testid="preset-ipe200"
          onClick={resetDefaults}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          I-Beam 200x100x5.7x8.5 (6m)
        </button>
        <button
          type="button"
          data-testid="preset-stainless-tube"
          onClick={() => {
            setProfile('square-tube');
            setMaterialId('stainless');
            setSwStr('50');
            setShStr('50');
            setStStr('3');
            setLengthStr('6');
            setQuantityStr('4');
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Stainless Square Tube (50x50x3 mm, 4 pcs)
        </button>
        <button
          type="button"
          data-testid="preset-al-bar"
          onClick={() => {
            setProfile('round-bar');
            setMaterialId('aluminum');
            setRbDiaStr('60');
            setLengthStr('3');
            setQuantityStr('2');
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Aluminum Round Bar (D60 mm x 3m, 2 pcs)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile &amp; Material</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Material &amp; Density</label>
            <select
              data-testid="select-material"
              value={materialId}
              onChange={e => setMaterialId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {MATERIALS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
              <option value="custom">Custom Density (kg/m3)</option>
            </select>
            {materialId === 'custom' && (
              <div className="mt-2">
                <TextInput label="Custom Density (kg/m3)" testId="input-custom-density" value={customDensityStr} onChange={setCustomDensityStr} />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Profile Shape</label>
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`profile-${p.id}`}
                  onClick={() => setProfile(p.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    profile === p.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-mono">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {profile === 'i-beam' && (
            <>
              <TextInput label="Height H (mm)" testId="input-h" value={hStr} onChange={setHStr} />
              <TextInput label="Flange Width B (mm)" testId="input-b" value={bStr} onChange={setBStr} />
              <TextInput label="Web Thickness tw (mm)" testId="input-tw" value={twStr} onChange={setTwStr} />
              <TextInput label="Flange Thickness tf (mm)" testId="input-tf" value={tfStr} onChange={setTfStr} />
            </>
          )}

          {profile === 'angle' && (
            <>
              <TextInput label="Leg 1 (mm)" testId="input-a1" value={a1Str} onChange={setA1Str} />
              <TextInput label="Leg 2 (mm)" testId="input-a2" value={a2Str} onChange={setA2Str} />
              <TextInput label="Thickness t (mm)" testId="input-t" value={tStr} onChange={setTStr} />
            </>
          )}

          {profile === 'channel' && (
            <>
              <TextInput label="Height H (mm)" testId="input-ch" value={chStr} onChange={setChStr} />
              <TextInput label="Flange Width B (mm)" testId="input-cb" value={cbStr} onChange={setCbStr} />
              <TextInput label="Web Thickness tw (mm)" testId="input-ctw" value={ctwStr} onChange={setCtwStr} />
              <TextInput label="Flange Thickness tf (mm)" testId="input-ctf" value={ctfStr} onChange={setCtfStr} />
            </>
          )}

          {profile === 'round-tube' && (
            <>
              <TextInput label="Outer Diameter OD (mm)" testId="input-od" value={odStr} onChange={setOdStr} />
              <TextInput label="Wall Thickness (mm)" testId="input-wt" value={wtStr} onChange={setWtStr} />
            </>
          )}

          {profile === 'square-tube' && (
            <>
              <TextInput label="Width W (mm)" testId="input-sw" value={swStr} onChange={setSwStr} />
              <TextInput label="Height H (mm)" testId="input-sh" value={shStr} onChange={setShStr} />
              <TextInput label="Wall Thickness t (mm)" testId="input-st" value={stStr} onChange={setStStr} />
            </>
          )}

          {profile === 'flat-bar' && (
            <>
              <TextInput label="Width W (mm)" testId="input-fw" value={fwStr} onChange={setFwStr} />
              <TextInput label="Thickness t (mm)" testId="input-ft" value={ftStr} onChange={setFtStr} />
            </>
          )}

          {profile === 'round-bar' && <TextInput label="Diameter D (mm)" testId="input-rb-dia" value={rbDiaStr} onChange={setRbDiaStr} />}

          {profile === 'hex-bar' && <TextInput label="Across Flats AF (mm)" testId="input-hex-af" value={hexAfStr} onChange={setHexAfStr} />}

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <TextInput label="Length (m)" testId="input-length" value={lengthStr} onChange={setLengthStr} />
            <TextInput label="Quantity" testId="input-qty" value={quantityStr} onChange={setQuantityStr} />
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">BOM Tag</label>
              <input
                type="text"
                data-testid="input-tag"
                value={partTag}
                onChange={e => setPartTag(e.target.value)}
                placeholder="B-101"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <TextInput label="Price ($/kg)" testId="input-price" value={unitPriceStr} onChange={setUnitPriceStr} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Weight &amp; Surface Results</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="add-to-bom-btn"
                  onClick={addToBom}
                  disabled={!calc.valid}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add to BOM Table
                </button>
                <button
                  type="button"
                  data-testid="export-csv-btn"
                  onClick={downloadCsv}
                  disabled={!calc.valid}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {!calc.valid && (
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {calc.error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Weight per Meter</p>
                <p data-testid="output-weight-per-meter" className="text-2xl font-black">
                  {calc.valid ? calc.weightPerMeter : '—'}
                  {calc.valid && <span className="text-sm font-bold ml-1.5 opacity-80">kg/m</span>}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">
                  Total Weight ({calc.valid ? `${calc.quantity} pcs x ${calc.length}m` : '-'})
                </p>
                <p data-testid="output-total-weight" className="text-2xl font-black">
                  {calc.valid ? calc.totalWeight : '—'}
                  {calc.valid && <span className="text-sm font-bold ml-1.5 opacity-80">kg</span>}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Est. Material Cost</p>
                <p data-testid="output-estimated-cost" className="text-2xl font-black">
                  {calc.valid ? `$${calc.estimatedCost}` : '—'}
                  {calc.valid && <span className="text-xs font-bold ml-1.5 opacity-75">(@ ${calc.unitPricePerKg}/kg)</span>}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cross-Section Area', value: calc.valid ? calc.area : '—', unit: 'mm2', testId: 'output-area' },
                { label: 'Surface per Meter', value: calc.valid ? calc.surfacePerMeter : '—', unit: 'm2/m', testId: 'output-surface-per-m' },
                { label: 'Total Surface Area', value: calc.valid ? calc.totalSurface : '—', unit: 'm2', testId: 'output-total-surface' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p data-testid={item.testId} className="text-lg font-black text-slate-900">
                    {item.value}
                    {calc.valid && <span className="text-sm text-slate-400 font-bold ml-1">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Alloy densities sourced from Engineering ToolBox ({' '}
                <a href="https://www.engineeringtoolbox.com/metal-alloys-densities-d_50.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                  Metal Alloys Densities d_50
                </a>
                ): Steel 7850 kg/m3, Stainless Steel 7480-8000 kg/m3, Aluminum 2712 kg/m3, Titanium 4500 kg/m3.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Multi-Shape Metal BOM &amp; Costing Schedule ({bomRows.length} items)</h3>
              </div>
              {bomRows.length > 0 && (
                <button type="button" onClick={() => setBomRows([])} className="text-xs font-bold text-red-500 hover:underline cursor-pointer">
                  Clear BOM
                </button>
              )}
            </div>

            {bomRows.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400 font-medium">
                Click &quot;Add to BOM Table&quot; to accumulate multiple section shapes and export the combined BOM CSV.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-black">
                      <th className="py-2.5 px-2">Tag</th>
                      <th className="py-2.5 px-2">Shape &amp; Spec</th>
                      <th className="py-2.5 px-2">Material</th>
                      <th className="py-2.5 px-2 text-right">Qty</th>
                      <th className="py-2.5 px-2 text-right">Mass (kg)</th>
                      <th className="py-2.5 px-2 text-right">Area (m2)</th>
                      <th className="py-2.5 px-2 text-right">Cost ($)</th>
                      <th className="py-2.5 px-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bomRows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 font-black text-slate-800">{row.partTag}</td>
                        <td className="py-2.5 px-2 text-slate-700 font-bold">
                          {row.profileName} <span className="text-slate-400 font-normal">({row.specSummary}, {row.lengthM}m)</span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-500">{row.materialName}</td>
                        <td className="py-2.5 px-2 text-right font-bold">{row.qty}</td>
                        <td className="py-2.5 px-2 text-right font-black text-slate-900">{row.totalWeightKg.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-right text-slate-600">{row.totalSurfaceM2.toFixed(3)}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-blue-700">${row.totalCost.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-right">
                          <button type="button" onClick={() => removeBomRow(row.id)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-black text-slate-900">
                      <td colSpan={3} className="py-3 px-2 uppercase">Project BOM Total</td>
                      <td className="py-3 px-2 text-right">{bomSummary.totalQty} pcs</td>
                      <td data-testid="bom-total-weight" className="py-3 px-2 text-right text-emerald-700">
                        {bomSummary.totalMassKg.toFixed(2)} kg
                      </td>
                      <td className="py-3 px-2 text-right">{bomSummary.totalAreaM2.toFixed(3)} m2</td>
                      <td className="py-3 px-2 text-right text-blue-700">${bomSummary.totalCostVal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4">
              Cross-Section Geometry Preview ({calc.valid ? calc.specSummary : 'Invalid Input'})
            </h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-full max-w-[180px]">
                {calc.valid && calc.svgGeom.kind === 'i-beam' && (
                  <>
                    <rect x={100 - calc.svgGeom.b / 2} y={100 - calc.svgGeom.h / 2} width={calc.svgGeom.b} height={calc.svgGeom.tf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - calc.svgGeom.tw / 2} y={100 - calc.svgGeom.h / 2 + calc.svgGeom.tf} width={calc.svgGeom.tw} height={Math.max(0, calc.svgGeom.h - 2 * calc.svgGeom.tf)} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - calc.svgGeom.b / 2} y={100 + calc.svgGeom.h / 2 - calc.svgGeom.tf} width={calc.svgGeom.b} height={calc.svgGeom.tf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {calc.valid && calc.svgGeom.kind === 'angle' && (
                  <path
                    d={`M ${100 - calc.svgGeom.a1 / 2} ${100 - calc.svgGeom.a2 / 2} L ${100 + calc.svgGeom.a1 / 2} ${100 - calc.svgGeom.a2 / 2} L ${100 + calc.svgGeom.a1 / 2} ${100 - calc.svgGeom.a2 / 2 + calc.svgGeom.t} L ${100 - calc.svgGeom.a1 / 2 + calc.svgGeom.t} ${100 - calc.svgGeom.a2 / 2 + calc.svgGeom.t} L ${100 - calc.svgGeom.a1 / 2 + calc.svgGeom.t} ${100 + calc.svgGeom.a2 / 2} L ${100 - calc.svgGeom.a1 / 2} ${100 + calc.svgGeom.a2 / 2} Z`}
                    fill="#3b82f6"
                    opacity="0.3"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                )}
                {calc.valid && calc.svgGeom.kind === 'channel' && (
                  <>
                    <rect x={100 - calc.svgGeom.cb / 2} y={100 - calc.svgGeom.ch / 2} width={calc.svgGeom.cb} height={calc.svgGeom.ctf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - calc.svgGeom.cb / 2} y={100 - calc.svgGeom.ch / 2 + calc.svgGeom.ctf} width={calc.svgGeom.ctw} height={Math.max(0, calc.svgGeom.ch - 2 * calc.svgGeom.ctf)} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - calc.svgGeom.cb / 2} y={100 + calc.svgGeom.ch / 2 - calc.svgGeom.ctf} width={calc.svgGeom.cb} height={calc.svgGeom.ctf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {calc.valid && calc.svgGeom.kind === 'round-tube' && (
                  <>
                    <circle cx="100" cy="100" r={Math.min(85, calc.svgGeom.od / 2)} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r={Math.max(1, Math.min(85, calc.svgGeom.od / 2) - calc.svgGeom.wt)} fill="white" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {calc.valid && calc.svgGeom.kind === 'square-tube' && (
                  <>
                    <rect x={100 - calc.svgGeom.sw / 2} y={100 - calc.svgGeom.sh / 2} width={calc.svgGeom.sw} height={calc.svgGeom.sh} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - calc.svgGeom.sw / 2 + calc.svgGeom.st} y={100 - calc.svgGeom.sh / 2 + calc.svgGeom.st} width={Math.max(1, calc.svgGeom.sw - 2 * calc.svgGeom.st)} height={Math.max(1, calc.svgGeom.sh - 2 * calc.svgGeom.st)} fill="white" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {calc.valid && calc.svgGeom.kind === 'flat-bar' && (
                  <rect x={100 - calc.svgGeom.fw / 2} y={100 - calc.svgGeom.ft / 2} width={calc.svgGeom.fw} height={calc.svgGeom.ft} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                )}
                {calc.valid && calc.svgGeom.kind === 'round-bar' && (
                  <circle cx="100" cy="100" r={Math.min(80, calc.svgGeom.rbDia / 2)} fill="#3b82f6" opacity="0.45" stroke="#2563eb" strokeWidth="2" />
                )}
                {calc.valid && calc.svgGeom.kind === 'hex-bar' && (
                  <polygon points="100,35 156,67.5 156,132.5 100,165 44,132.5 44,67.5" fill="#3b82f6" opacity="0.45" stroke="#2563eb" strokeWidth="2" />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}

function TextInput({ label, testId, value, onChange }: { label: string; testId: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
      <input
        type="text"
        data-testid={testId}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
      />
    </div>
  );
}
