'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

const STEEL_DENSITY = 7850; // kg/m³

type ProfileType = 'i-beam' | 'angle' | 'channel' | 'round-tube' | 'square-tube' | 'flat-bar';

const PROFILES: { id: ProfileType; name: string; icon: string }[] = [
  { id: 'i-beam', name: 'I-Beam / H-Beam', icon: 'I' },
  { id: 'angle', name: 'Angle (L-Section)', icon: 'L' },
  { id: 'channel', name: 'Channel (U-Section)', icon: 'U' },
  { id: 'round-tube', name: 'Round Tube / Pipe', icon: 'O' },
  { id: 'square-tube', name: 'Square / Rect Tube', icon: '□' },
  { id: 'flat-bar', name: 'Flat Bar / Plate', icon: '—' },
];

export default function SteelWeightClient() {
  const [profile, setProfile] = useState<ProfileType>('i-beam');
  const [length, setLength] = useState(6); // meters
  const [quantity, setQuantity] = useState(1);

  // I-beam dimensions
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

  const calc = useMemo(() => {
    let area = 0; // mm²
    let perimeter = 0; // mm

    switch (profile) {
      case 'i-beam': {
        const innerH = Math.max(1, h - 2 * tf);
        area = 2 * b * tf + innerH * tw;
        perimeter = 2 * (b + h) + 2 * (innerH + 2 * (b - tw) / 2);
        break;
      }
      case 'angle': {
        area = a1 * t + (a2 - t) * t;
        perimeter = 2 * (a1 + a2);
        break;
      }
      case 'channel': {
        const innerH = Math.max(1, ch - 2 * ctf);
        area = 2 * cb * ctf + innerH * ctw;
        perimeter = 2 * cb + ch + 2 * innerH;
        break;
      }
      case 'round-tube': {
        const id = Math.max(1, od - 2 * wt);
        area = (Math.PI / 4) * (od * od - id * id);
        perimeter = Math.PI * od;
        break;
      }
      case 'square-tube': {
        const innerW = Math.max(1, sw - 2 * st);
        const innerH = Math.max(1, sh - 2 * st);
        area = sw * sh - innerW * innerH;
        perimeter = 2 * (sw + sh);
        break;
      }
      case 'flat-bar': {
        area = fw * ft;
        perimeter = 2 * (fw + ft);
        break;
      }
    }

    // Convert mm² to m² for area, mm to m for perimeter
    const areaM2 = area / 1_000_000;
    const perimeterM = perimeter / 1000;

    // Weight per meter = area (m²) × density (kg/m³) × 1m
    const weightPerMeter = areaM2 * STEEL_DENSITY;

    // Total weight
    const totalWeight = weightPerMeter * length * quantity;

    // Surface area per meter (approximate: perimeter × 1m + 2 × end area)
    const surfacePerMeter = perimeterM; // m²/m
    const totalSurface = surfacePerMeter * length * quantity + 2 * areaM2 * quantity;

    return {
      area: area.toFixed(0),
      weightPerMeter: weightPerMeter.toFixed(2),
      totalWeight: totalWeight.toFixed(2),
      surfacePerMeter: surfacePerMeter.toFixed(4),
      totalSurface: totalSurface.toFixed(3),
    };
  }, [profile, h, b, tw, tf, a1, a2, t, ch, cb, ctw, ctf, od, wt, sw, sh, st, fw, ft, length, quantity]);

  const downloadCsv = () => {
    const csv = [
      ['Steel Section Weight Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Profile Type', PROFILES.find(p => p.id === profile)?.name || ''],
      ['Length (m)', length],
      ['Quantity', quantity],
      ['', ''],
      ['Cross-Section Area (mm²)', calc.area],
      ['Weight per Meter (kg/m)', calc.weightPerMeter],
      ['Total Weight (kg)', calc.totalWeight],
      ['Surface Area per Meter (m²/m)', calc.surfacePerMeter],
      ['Total Surface Area (m²)', calc.totalSurface],
      ['', ''],
      ['Steel Density', '7850 kg/m³'],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steel-weight-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile & Dimensions</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Profile Type</label>
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-black border transition-all ${
                    profile === p.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* I-Beam inputs */}
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

          <div className="pt-4 border-t border-slate-50 space-y-4">
            <NumInput label="Length (m)" value={length} onChange={setLength} step={0.1} />
            <NumInput label="Quantity" value={quantity} onChange={setQuantity} step={1} />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Weight Results</h2>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Weight per Meter</p>
                <p className="text-3xl font-black">{calc.weightPerMeter}<span className="text-lg font-bold ml-2 opacity-80">kg/m</span></p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Total Weight ({quantity} pcs × {length}m)</p>
                <p className="text-3xl font-black">{calc.totalWeight}<span className="text-lg font-bold ml-2 opacity-80">kg</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cross-Section Area', value: calc.area, unit: 'mm²' },
                { label: 'Surface per Meter', value: calc.surfacePerMeter, unit: 'm²/m' },
                { label: 'Total Surface Area', value: calc.totalSurface, unit: 'm²' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}<span className="text-base text-slate-400 font-bold ml-1">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Cross-Section Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Cross-Section Preview</h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
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
                    <circle cx="100" cy="100" r={od / 2} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r={Math.max(1, od / 2 - wt)} fill="white" stroke="#3b82f6" strokeWidth="1.5" />
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
              </svg>
            </div>
            <p className="text-center text-sm text-slate-400 mt-2 font-medium">Scale: 1 unit = 1 mm (not to scale)</p>
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
      <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
      />
    </div>
  );
}
