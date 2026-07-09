'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Printer } from 'lucide-react';

interface GDTSymbol {
  name: string;
  symbol: string;
  category: 'form' | 'profile' | 'orientation' | 'location' | 'runout';
  zone: string;
  datum: string;
  description: string;
}

const DATA: GDTSymbol[] = [
  // Form
  { name: 'Straightness', symbol: '—', category: 'form', zone: 'Two parallel lines / cylinders', datum: 'No datum', description: 'Controls how straight a line element of a surface or axis must be. Applied to edges, axes, or generator lines.' },
  { name: 'Flatness', symbol: '⏥', category: 'form', zone: 'Two parallel planes', datum: 'No datum', description: 'Controls how flat a surface must be. All points must lie between two parallel planes separated by the tolerance.' },
  { name: 'Circularity', symbol: '○', category: 'form', zone: 'Two concentric circles', datum: 'No datum', description: 'Controls roundness of a cross-section. Each circular cross-section must lie between two concentric circles.' },
  { name: 'Cylindricity', symbol: '⌭', category: 'form', zone: 'Two concentric cylinders', datum: 'No datum', description: 'Controls roundness, straightness, and taper of a cylinder simultaneously. The entire surface must lie between two coaxial cylinders.' },

  // Profile
  { name: 'Profile of a Line', symbol: '⌒', category: 'profile', zone: 'Two parallel curves', datum: 'Optional datum', description: 'Controls a 2D cross-sectional profile against a true profile. Each line cross-section is evaluated independently.' },
  { name: 'Profile of a Surface', symbol: '⌓', category: 'profile', zone: 'Two parallel surfaces', datum: 'Optional datum', description: 'Controls a 3D surface against its true profile. The entire surface must lie within the tolerance zone.' },

  // Orientation
  { name: 'Angularity', symbol: '∠', category: 'orientation', zone: 'Two parallel planes at angle', datum: 'Requires datum', description: 'Controls a surface or axis at a specified angle (other than 90°) to a datum.' },
  { name: 'Perpendicularity', symbol: '⊥', category: 'orientation', zone: 'Two parallel planes / cylinder', datum: 'Requires datum', description: 'Controls a surface or axis at 90° to a datum. Very common for mounting faces and pins.' },
  { name: 'Parallelism', symbol: '∥', category: 'orientation', zone: 'Two parallel planes', datum: 'Requires datum', description: 'Controls a surface or axis parallel to a datum plane or axis.' },

  // Location
  { name: 'Position', symbol: '⊕', category: 'location', zone: 'Cylinder (axis) / sphere', datum: 'Requires datum', description: 'Controls the location of a feature (hole, pin, slot) relative to datums. Most common GD&T control. Supports MMC/LMC modifiers.' },
  { name: 'Concentricity', symbol: '◎', category: 'location', zone: 'Cylinder coaxial with datum', datum: 'Requires datum', description: 'Controls the median points of a feature to be coaxial with a datum axis. Difficult to inspect — use position or runout instead.' },
  { name: 'Symmetry', symbol: '⌯', category: 'location', zone: 'Two parallel planes about datum', datum: 'Requires datum', description: 'Controls median points of opposing surfaces to be symmetric about a datum plane. Rarely used — position is preferred.' },

  // Runout
  { name: 'Circular Runout', symbol: '↗', category: 'runout', zone: 'Two concentric circles (per section)', datum: 'Requires datum', description: 'Controls circular elements of a surface relative to a datum axis. Each cross-section checked independently during rotation.' },
  { name: 'Total Runout', symbol: '⌰', category: 'runout', zone: 'Two concentric cylinders', datum: 'Requires datum', description: 'Controls the entire surface relative to a datum axis. Combines circularity, cylindricity, straightness, and taper in one control.' },
];

const MATERIAL_MODIFIERS = [
  { symbol: 'Ⓜ', name: 'Maximum Material Condition (MMC)', description: 'Bonus tolerance available as feature departs from MMC. Used for mating fit and gauging.' },
  { symbol: 'Ⓛ', name: 'Least Material Condition (LMC)', description: 'Bonus tolerance available as feature departs from LMC. Used for wall thickness and minimum material.' },
  { symbol: 'Ⓢ', name: 'Regardless of Feature Size (RFS)', description: 'No bonus tolerance. Tolerance applies at any feature size. Default in ASME Y14.5-2009.' },
  { symbol: 'Ⓟ', name: 'Projected Tolerance Zone', description: 'Tolerance zone extends above the surface. Used for mating threaded holes and pins.' },
  { symbol: 'Ⓕ', name: 'Free State', description: 'Applies to non-rigid parts in unrestrained condition. Common for thin-walled and flexible parts.' },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'form', name: 'Form' },
  { id: 'profile', name: 'Profile' },
  { id: 'orientation', name: 'Orientation' },
  { id: 'location', name: 'Location' },
  { id: 'runout', name: 'Runout' },
];

export default function GDTSymbolClient() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = useMemo(() => {
    return DATA.filter(item => {
      const matchSearch = !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCat === 'all' || item.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [search, activeCat]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm print:hidden">
        <div className="relative w-full md:max-w-md">
          <input type="text" placeholder="Search GD&T symbols..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 transition-all">
          <Printer className="w-4 h-4" />
          Print A4 Cheat Sheet
        </button>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${activeCat === cat.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>{cat.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
        {filtered.map((item, i) => (
          <div key={i} className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all print:border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black">
                {item.symbol}
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{item.category}</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] font-bold text-slate-400"><span className="text-slate-500">Zone:</span> {item.zone}</p>
              <p className="text-[10px] font-bold text-slate-400"><span className="text-slate-500">Datum:</span> {item.datum}</p>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Material Condition Modifiers */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-4">Material Condition Modifiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MATERIAL_MODIFIERS.map((m, i) => (
            <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-lg font-black">{m.symbol}</div>
                <p className="text-xs font-black text-slate-900">{m.name}</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
