'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Plus, Trash2, RotateCcw, ClipboardList } from 'lucide-react';

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
  { id: 'square-tube', name: 'Square / Rect Tube', icon: '□' },
  { id: 'flat-bar', name: 'Flat Bar / Plate', icon: '—' },
  { id: 'round-bar', name: 'Round Solid Bar', icon: '●' },
  { id: 'hex-bar', name: 'Hexagon Bar', icon: '⬡' },
];

const MATERIALS: { id: string; name: string; density: number }[] = [
  { id: 'carbon-steel', name: 'Carbon Steel S235/A36 (7850 kg/m³)', density: 7850 },
  { id: 'ss-304', name: 'Stainless Steel 304 (7930 kg/m³)', density: 7930 },
  { id: 'ss-316', name: 'Stainless Steel 316L (7980 kg/m³)', density: 7980 },
  { id: 'al-6061', name: 'Aluminum 6061-T6 (2700 kg/m³)', density: 2700 },
  { id: 'al-5052', name: 'Aluminum 5052-H32 (2680 kg/m³)', density: 2680 },
  { id: 'brass-c360', name: 'Brass C36000 (8500 kg/m³)', density: 8500 },
  { id: 'copper-c110', name: 'Copper C11000 (8960 kg/m³)', density: 8960 },
  { id: 'ti-gr5', name: 'Titanium Grade 5 Ti-6Al-4V (4430 kg/m³)', density: 4430 },
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

export default function SteelWeightClient() {
  const [profile, setProfile] = useState<ProfileType>('i-beam');
  const [materialId, setMaterialId] = useState<string>('carbon-steel');
  const [customDensity, setCustomDensity] = useState<number>(7850);
  const [length, setLength] = useState(6); // meters
  const [quantity, setQuantity] = useState(1);
  const [unitPricePerKg, setUnitPricePerKg] = useState<number>(1.25); // $/kg
  const [partTag, setPartTag] = useState<string>('B-101');

  // I-beam dimensions (Default: IPE 200)
  const [h, setH] = useState(200);
  const [b, setB] = useState(100);
  const [tw, setTw] = useState(5.7);
  const [tf, setTf] = useState(8.5);

  // Angle dimensions
  const [a1, setA1] = useState(50);
  const [a2, setA2] = useState(50);
  const [t, setT] = useState(5);

  // Channel dimensions
  const [ch, setCh] = useState(200);
  const [cb, setCb] = useState(75);
  const [ctw, setCtw] = useState(5);
  const [ctf, setCtf] = useState(9);

  // Round tube
  const [od, setOd] = useState(60);
  const [wt, setWt] = useState(4);

  // Square tube
  const [sw, setSw] = useState(40);
  const [sh, setSh] = useState(40);
  const [st, setSt] = useState(3);

  // Flat bar
  const [fw, setFw] = useState(50);
  const [ft, setFt] = useState(6);

  // Round solid bar
  const [rbDia, setRbDia] = useState(40);

  // Hex solid bar (across flats AF)
  const [hexAf, setHexAf] = useState(30);

  // Multi-row BOM schedule
  const [bomRows, setBomRows] = useState<BomRow[]>([]);

  const activeDensity = useMemo(() => {
    const found = MATERIALS.find(m => m.id === materialId);
    return found ? found.density : Math.max(1, customDensity);
  }, [materialId, customDensity]);

  const calc = useMemo(() => {
    let area = 0; // mm²
    let perimeter = 0; // mm
    let specSummary = '';

    switch (profile) {
      case 'i-beam': {
        const innerH = Math.max(1, h - 2 * tf);
        area = 2 * b * tf + innerH * tw;
        perimeter = 2 * (b + h) + 2 * (innerH + 2 * (b - tw) / 2);
        specSummary = `H${h}×B${b}×tw${tw}×tf${tf}`;
        break;
      }
      case 'angle': {
        area = a1 * t + (a2 - t) * t;
        perimeter = 2 * (a1 + a2);
        specSummary = `L${a1}×${a2}×${t}`;
        break;
      }
      case 'channel': {
        const innerH = Math.max(1, ch - 2 * ctf);
        area = 2 * cb * ctf + innerH * ctw;
        perimeter = 2 * cb + ch + 2 * innerH;
        specSummary = `U${ch}×${cb}×tw${ctw}×tf${ctf}`;
        break;
      }
      case 'round-tube': {
        const id = Math.max(0, od - 2 * wt);
        area = (Math.PI / 4) * (od * od - id * id);
        perimeter = Math.PI * od;
        specSummary = `Ø${od}×${wt}`;
        break;
      }
      case 'square-tube': {
        const innerW = Math.max(0, sw - 2 * st);
        const innerH = Math.max(0, sh - 2 * st);
        area = sw * sh - innerW * innerH;
        perimeter = 2 * (sw + sh);
        specSummary = `RHS ${sw}×${sh}×${st}`;
        break;
      }
      case 'flat-bar': {
        area = fw * ft;
        perimeter = 2 * (fw + ft);
        specSummary = `PL ${fw}×${ft}`;
        break;
      }
      case 'round-bar': {
        area = (Math.PI / 4) * rbDia * rbDia;
        perimeter = Math.PI * rbDia;
        specSummary = `Ø${rbDia} Solid`;
        break;
      }
      case 'hex-bar': {
        // Area of regular hexagon given Across Flats (AF = s): A = (sqrt(3)/2) * s^2
        area = (Math.sqrt(3) / 2) * hexAf * hexAf;
        perimeter = 2 * Math.sqrt(3) * hexAf;
        specSummary = `HEX AF${hexAf}`;
        break;
      }
    }

    const areaM2 = area / 1_000_000;
    const perimeterM = perimeter / 1000;
    const weightPerMeter = areaM2 * activeDensity;
    const totalWeight = weightPerMeter * length * quantity;
    const surfacePerMeter = perimeterM;
    const totalSurface = surfacePerMeter * length * quantity + 2 * areaM2 * quantity;
    const estimatedCost = totalWeight * Math.max(0, unitPricePerKg);

    return {
      areaNum: area,
      area: area.toFixed(0),
      weightPerMeterNum: weightPerMeter,
      weightPerMeter: weightPerMeter.toFixed(2),
      totalWeightNum: totalWeight,
      totalWeight: totalWeight.toFixed(2),
      surfacePerMeter: surfacePerMeter.toFixed(4),
      totalSurfaceNum: totalSurface,
      totalSurface: totalSurface.toFixed(3),
      estimatedCostNum: estimatedCost,
      estimatedCost: estimatedCost.toFixed(2),
      specSummary,
    };
  }, [
    profile, h, b, tw, tf, a1, a2, t, ch, cb, ctw, ctf,
    od, wt, sw, sh, st, fw, ft, rbDia, hexAf,
    length, quantity, activeDensity, unitPricePerKg
  ]);

  const addToBom = () => {
    const matName = MATERIALS.find(m => m.id === materialId)?.name.split(' (')[0] || 'Custom Alloy';
    const profName = PROFILES.find(p => p.id === profile)?.name || profile;
    const newRow: BomRow = {
      id: `bom-${Date.now()}`,
      partTag: partTag.trim() || `M-${bomRows.length + 1}`,
      materialName: matName,
      profileName: profName,
      specSummary: calc.specSummary,
      lengthM: length,
      qty: quantity,
      unitWeightKgM: calc.weightPerMeterNum,
      totalWeightKg: calc.totalWeightNum,
      totalSurfaceM2: calc.totalSurfaceNum,
      unitCostPerKg: unitPricePerKg,
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
    setMaterialId('carbon-steel');
    setH(200);
    setB(100);
    setTw(5.7);
    setTf(8.5);
    setLength(6);
    setQuantity(1);
    setUnitPricePerKg(1.25);
  };

  const downloadCsv = () => {
    const matObj = MATERIALS.find(m => m.id === materialId);
    const baseLines = [
      ['# Metal Section Weight & BOM Cost Report', ''],
      ['Profile Type', PROFILES.find(p => p.id === profile)?.name || ''],
      ['Material', matObj?.name || `${activeDensity} kg/m³`],
      ['Specification', calc.specSummary],
      ['Length (m)', length],
      ['Quantity', quantity],
      ['Cross-Section Area (mm²)', calc.area],
      ['Weight per Meter (kg/m)', calc.weightPerMeter],
      ['Total Weight (kg)', calc.totalWeight],
      ['Surface Area per Meter (m²/m)', calc.surfacePerMeter],
      ['Total Surface Area (m²)', calc.totalSurface],
      ['Estimated Material Cost ($)', calc.estimatedCost],
    ].map(r => r.join(','));

    if (bomRows.length > 0) {
      baseLines.push('');
      baseLines.push('# Accumulated Multi-Shape BOM Schedule');
      baseLines.push('Tag,Material,Profile,Dimension Spec,Length (m),Qty,Unit Weight (kg/m),Total Weight (kg),Paint Area (m²),Unit Price ($/kg),Subtotal Cost ($)');
      for (const r of bomRows) {
        baseLines.push(
          `${r.partTag},"${r.materialName}","${r.profileName}","${r.specSummary}",${r.lengthM},${r.qty},${r.unitWeightKgM.toFixed(2)},${r.totalWeightKg.toFixed(2)},${r.totalSurfaceM2.toFixed(3)},${r.unitCostPerKg.toFixed(2)},${r.totalCost.toFixed(2)}`
        );
      }
      baseLines.push(
        `TOTAL,,,,${bomSummary.totalQty},${bomSummary.totalMassKg.toFixed(2)},${bomSummary.totalAreaM2.toFixed(3)},,${bomSummary.totalCostVal.toFixed(2)}`
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
      {/* Quick Section Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Standard Profiles:</span>
        <button
          type="button"
          data-testid="preset-ipe200"
          onClick={resetDefaults}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          IPE 200 Steel Beam (200×100×5.7×8.5, 6m)
        </button>
        <button
          type="button"
          data-testid="preset-ss304-tube"
          onClick={() => {
            setProfile('square-tube');
            setMaterialId('ss-304');
            setSw(50);
            setSh(50);
            setSt(3);
            setLength(6);
            setQuantity(4);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          SS304 Square Tube (50×50×3 mm, 4 pcs)
        </button>
        <button
          type="button"
          data-testid="preset-al6061-bar"
          onClick={() => {
            setProfile('round-bar');
            setMaterialId('al-6061');
            setRbDia(60);
            setLength(3);
            setQuantity(2);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Al 6061 Round Bar (Ø60 mm × 3m, 2 pcs)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile & Alloy</h2>
            </div>
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Material Alloy Selector */}
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Material Alloy & Density</label>
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
              <option value="custom">Custom Density (kg/m³)</option>
            </select>
            {materialId === 'custom' && (
              <div className="mt-2">
                <NumInput label="Custom Density (kg/m³)" value={customDensity} onChange={setCustomDensity} step={10} />
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
                  onClick={() => setProfile(p.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    profile === p.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Section Dimension Inputs */}
          {profile === 'i-beam' && (
            <>
              <NumInput label="Height H (mm)" value={h} onChange={setH} step={1} />
              <NumInput label="Flange Width B (mm)" value={b} onChange={setB} step={1} />
              <NumInput label="Web Thickness tw (mm)" value={tw} onChange={setTw} step={0.1} />
              <NumInput label="Flange Thickness tf (mm)" value={tf} onChange={setTf} step={0.1} />
            </>
          )}

          {profile === 'angle' && (
            <>
              <NumInput label="Leg 1 (mm)" value={a1} onChange={setA1} step={1} />
              <NumInput label="Leg 2 (mm)" value={a2} onChange={setA2} step={1} />
              <NumInput label="Thickness t (mm)" value={t} onChange={setT} step={0.5} />
            </>
          )}

          {profile === 'channel' && (
            <>
              <NumInput label="Height H (mm)" value={ch} onChange={setCh} step={1} />
              <NumInput label="Flange Width B (mm)" value={cb} onChange={setCb} step={1} />
              <NumInput label="Web Thickness tw (mm)" value={ctw} onChange={setCtw} step={0.5} />
              <NumInput label="Flange Thickness tf (mm)" value={ctf} onChange={setCtf} step={0.5} />
            </>
          )}

          {profile === 'round-tube' && (
            <>
              <NumInput label="Outer Diameter OD (mm)" value={od} onChange={setOd} step={1} />
              <NumInput label="Wall Thickness (mm)" value={wt} onChange={setWt} step={0.5} />
            </>
          )}

          {profile === 'square-tube' && (
            <>
              <NumInput label="Width W (mm)" value={sw} onChange={setSw} step={1} />
              <NumInput label="Height H (mm)" value={sh} onChange={setSh} step={1} />
              <NumInput label="Wall Thickness t (mm)" value={st} onChange={setSt} step={0.5} />
            </>
          )}

          {profile === 'flat-bar' && (
            <>
              <NumInput label="Width W (mm)" value={fw} onChange={setFw} step={1} />
              <NumInput label="Thickness t (mm)" value={ft} onChange={setFt} step={0.5} />
            </>
          )}

          {profile === 'round-bar' && (
            <NumInput label="Diameter D (mm)" value={rbDia} onChange={setRbDia} step={1} />
          )}

          {profile === 'hex-bar' && (
            <NumInput label="Across Flats AF (mm)" value={hexAf} onChange={setHexAf} step={1} />
          )}

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <NumInput label="Length (m)" value={length} onChange={setLength} step={0.1} />
            <NumInput label="Quantity" value={quantity} onChange={setQuantity} step={1} />
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">BOM Tag</label>
              <input
                type="text"
                value={partTag}
                onChange={e => setPartTag(e.target.value)}
                placeholder="B-101"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <NumInput label="Price ($/kg)" value={unitPricePerKg} onChange={setUnitPricePerKg} step={0.1} />
          </div>
        </div>

        {/* Results & BOM Schedule Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Weight & Surface Results</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="add-to-bom-btn"
                  onClick={addToBom}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add to BOM Table
                </button>
                <button
                  type="button"
                  data-testid="export-csv-btn"
                  onClick={downloadCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Weight per Meter</p>
                <p data-testid="output-weight-per-meter" className="text-2xl font-black">
                  {calc.weightPerMeter}
                  <span className="text-sm font-bold ml-1.5 opacity-80">kg/m</span>
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">
                  Total Weight ({quantity} pcs × {length}m)
                </p>
                <p data-testid="output-total-weight" className="text-2xl font-black">
                  {calc.totalWeight}
                  <span className="text-sm font-bold ml-1.5 opacity-80">kg</span>
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Est. Material Cost</p>
                <p data-testid="output-estimated-cost" className="text-2xl font-black">
                  ${calc.estimatedCost}
                  <span className="text-xs font-bold ml-1.5 opacity-75">(@ ${unitPricePerKg}/kg)</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cross-Section Area', value: calc.area, unit: 'mm²', testId: 'output-area' },
                { label: 'Surface per Meter', value: calc.surfacePerMeter, unit: 'm²/m', testId: 'output-surface-per-m' },
                { label: 'Total Surface Area', value: calc.totalSurface, unit: 'm²', testId: 'output-total-surface' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p data-testid={item.testId} className="text-lg font-black text-slate-900">
                    {item.value}
                    <span className="text-sm text-slate-400 font-bold ml-1">{item.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Shape BOM Schedule Table */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Multi-Shape Metal BOM & Costing Schedule ({bomRows.length} items)
                </h3>
              </div>
              {bomRows.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBomRows([])}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Clear All Rows
                </button>
              )}
            </div>

            {bomRows.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center text-xs font-medium text-slate-500">
                Click <strong>&ldquo;+ Add to BOM Table&rdquo;</strong> above to accumulate multiple steel/aluminum profiles (beams, tubes, plates, bars) into a unified project weight & cost takeoff schedule.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-black">
                      <th className="py-2.5 px-2">Tag</th>
                      <th className="py-2.5 px-2">Alloy</th>
                      <th className="py-2.5 px-2">Spec</th>
                      <th className="py-2.5 px-2 text-right">Len × Qty</th>
                      <th className="py-2.5 px-2 text-right">Weight (kg)</th>
                      <th className="py-2.5 px-2 text-right">Paint (m²)</th>
                      <th className="py-2.5 px-2 text-right">Cost ($)</th>
                      <th className="py-2.5 px-1"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {bomRows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 font-black text-slate-900">{row.partTag}</td>
                        <td className="py-2.5 px-2">{row.materialName}</td>
                        <td className="py-2.5 px-2 font-mono">{row.specSummary}</td>
                        <td className="py-2.5 px-2 text-right">{row.lengthM}m × {row.qty}</td>
                        <td className="py-2.5 px-2 text-right text-emerald-700">{row.totalWeightKg.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-right">{row.totalSurfaceM2.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-right text-blue-700">${row.totalCost.toFixed(2)}</td>
                        <td className="py-2.5 px-1 text-right">
                          <button
                            type="button"
                            onClick={() => removeBomRow(row.id)}
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
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
                      <td className="py-3 px-2 text-right">{bomSummary.totalAreaM2.toFixed(2)} m²</td>
                      <td className="py-3 px-2 text-right text-blue-700">${bomSummary.totalCostVal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* SVG Cross-Section Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4">Cross-Section Geometry Preview ({calc.specSummary})</h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-full max-w-[180px]">
                {profile === 'i-beam' && (
                  <>
                    <rect x={100 - b / 2} y={100 - h / 2} width={b} height={tf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - tw / 2} y={100 - h / 2 + tf} width={tw} height={h - 2 * tf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - b / 2} y={100 + h / 2 - tf} width={b} height={tf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {profile === 'angle' && (
                  <path d={`M ${100 - a1 / 2} ${100 - a2 / 2} L ${100 + a1 / 2} ${100 - a2 / 2} L ${100 + a1 / 2} ${100 - a2 / 2 + t} L ${100 - a1 / 2 + t} ${100 - a2 / 2 + t} L ${100 - a1 / 2 + t} ${100 + a2 / 2} L ${100 - a1 / 2} ${100 + a2 / 2} Z`} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                )}
                {profile === 'channel' && (
                  <>
                    <rect x={100 - cb / 2} y={100 - ch / 2} width={cb} height={ctf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - ctw / 2} y={100 - ch / 2 + ctf} width={ctw} height={ch - 2 * ctf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - cb / 2} y={100 + ch / 2 - ctf} width={cb} height={ctf} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {profile === 'round-tube' && (
                  <>
                    <circle cx="100" cy="100" r={Math.min(85, od / 2)} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r={Math.max(1, Math.min(85, od / 2) - wt)} fill="white" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {profile === 'square-tube' && (
                  <>
                    <rect x={100 - sw / 2} y={100 - sh / 2} width={sw} height={sh} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x={100 - sw / 2 + st} y={100 - sh / 2 + st} width={Math.max(1, sw - 2 * st)} height={Math.max(1, sh - 2 * st)} fill="white" stroke="#3b82f6" strokeWidth="1.5" />
                  </>
                )}
                {profile === 'flat-bar' && (
                  <rect x={100 - fw / 2} y={100 - ft / 2} width={fw} height={ft} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                )}
                {profile === 'round-bar' && (
                  <circle cx="100" cy="100" r={Math.min(80, rbDia / 2)} fill="#3b82f6" opacity="0.45" stroke="#2563eb" strokeWidth="2" />
                )}
                {profile === 'hex-bar' && (
                  <polygon
                    points="100,35 156,67.5 156,132.5 100,165 44,132.5 44,67.5"
                    fill="#3b82f6"
                    opacity="0.45"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
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

function NumInput({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  return (
    <div>
      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
      />
    </div>
  );
}
