'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Printer } from 'lucide-react';

interface ShortcutItem {
  keys: string;
  command: string;
  category: 'general' | 'surface' | 'alignment' | 'profile' | 'corridor' | 'pipe' | 'view';
  description: string;
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  // General Civil 3D
  { keys: 'AES', command: 'Toolspace', category: 'general', description: 'Open the Civil 3D Toolspace palette.' },
  { keys: 'AEC', command: 'Content Catalog', category: 'general', description: 'Open the Civil 3D content catalog.' },
  { keys: 'AUS', command: 'Survey', category: 'general', description: 'Open the Survey Toolspace tab.' },
  { keys: 'AUB', command: 'Toolbox', category: 'general', description: 'Open the Civil 3D Toolbox palette.' },
  { keys: 'AUS', command: 'Settings', category: 'general', description: 'Open Settings tab in Toolspace.' },
  { keys: 'AUP', command: 'Prospector', category: 'general', description: 'Open Prospector tab in Toolspace.' },
  { keys: 'AUS', command: 'Survey Tab', category: 'general', description: 'Switch to Survey tab.' },
  { keys: 'Ctrl + Shift + T', command: 'Toolspace Toggle', category: 'general', description: 'Toggle Toolspace visibility.' },
  { keys: 'Ctrl + Shift + P', command: 'Prospector Toggle', category: 'general', description: 'Toggle Prospector palette.' },
  { keys: 'Ctrl + Shift + I', command: 'Inquiry', category: 'general', description: 'Open the Inquiry tool for geometric queries.' },
  { keys: 'Ctrl + Shift + L', command: 'Layer Manager', category: 'general', description: 'Open Civil 3D layer manager.' },
  { keys: 'AUL', command: 'Linetype', category: 'general', description: 'Open linetype manager for civil objects.' },

  // Surface
  { keys: 'AES', command: 'Create Surface', category: 'surface', description: 'Create a new TIN surface from point data.' },
  { keys: 'AESD', command: 'Surface Properties', category: 'surface', description: 'Open surface properties dialog for editing.' },
  { keys: 'AESA', command: 'Add Points', category: 'surface', description: 'Add point data to an existing surface.' },
  { keys: 'AESB', command: 'Surface Boundary', category: 'surface', description: 'Add a boundary to a surface.' },
  { keys: 'AESK', command: 'Surface Breakline', category: 'surface', description: 'Add a breakline to a surface.' },
  { keys: 'AESM', command: 'Surface Mask', category: 'surface', description: 'Create a surface mask to hide portions.' },
  { keys: 'AESP', command: 'Paste Surface', category: 'surface', description: 'Paste one surface into another for combined model.' },
  { keys: 'AESV', command: 'Volume Surface', category: 'surface', description: 'Create a volume (TIN volume) surface between two surfaces.' },
  { keys: 'AESW', command: 'Surface Watershed', category: 'surface', description: 'Generate watershed analysis on a surface.' },

  // Alignment
  { keys: 'AAL', command: 'Create Alignment', category: 'alignment', description: 'Create a new alignment from polyline or layout.' },
  { keys: 'AALP', command: 'Alignment Layout', category: 'alignment', description: 'Open alignment layout tools for curve design.' },
  { keys: 'AALC', command: 'Alignment Curve', category: 'alignment', description: 'Add a curve (free, floating, fixed) to alignment.' },
  { keys: 'AALS', command: 'Alignment Station', category: 'alignment', description: 'Edit alignment station equations.' },
  { keys: 'AALR', command: 'Alignment Report', category: 'alignment', description: 'Generate alignment stationing report.' },
  { keys: 'AALG', command: 'Alignment from GIS', category: 'alignment', description: 'Import alignment from GIS shapefile.' },
  { keys: 'AALO', command: 'Alignment Offset', category: 'alignment', description: 'Create an offset alignment for widening.' },

  // Profile
  { keys: 'APR', command: 'Create Profile', category: 'profile', description: 'Create a surface profile along an alignment.' },
  { keys: 'APRL', command: 'Profile Layout', category: 'profile', description: 'Open profile layout tools for vertical curve design.' },
  { keys: 'APRV', command: 'Profile View', category: 'profile', description: 'Create a profile view for plotting.' },
  { keys: 'APRC', command: 'Profile Curve', category: 'profile', description: 'Add a vertical curve (parabolic, circular) to profile.' },
  { keys: 'APRS', command: 'Profile Station', category: 'profile', description: 'Edit profile station and elevation data.' },
  { keys: 'APRB', command: 'Profile Band', category: 'profile', description: 'Add profile view bands (station, elevation).' },
  { keys: 'APRS', command: 'Superimpose', category: 'profile', description: 'Superimpose one profile onto another for comparison.' },

  // Corridor
  { keys: 'ACO', command: 'Create Corridor', category: 'corridor', description: 'Create a corridor from alignment, profile, and assembly.' },
  { keys: 'ACOA', command: 'Corridor Assembly', category: 'corridor', description: 'Create or edit a corridor assembly.' },
  { keys: 'ACOS', command: 'Corridor Section', category: 'corridor', description: 'Open corridor section editor for cross-section review.' },
  { keys: 'ACOT', command: 'Corridor Target', category: 'corridor', description: 'Set corridor targeting (surface, alignment, profile).' },
  { keys: 'ACOF', command: 'Corridor Frequency', category: 'corridor', description: 'Edit corridor section frequency settings.' },
  { keys: 'ACOC', command: 'Corridor Code', category: 'corridor', description: 'Edit corridor point/line/shape codes.' },
  { keys: 'ACOR', command: 'Corridor Render', category: 'corridor', description: 'Generate corridor rendering or material assignment.' },

  // Pipe Network
  { keys: 'APN', command: 'Pipe Network', category: 'pipe', description: 'Create a new pipe network from parts list.' },
  { keys: 'APNP', command: 'Pipe Parts List', category: 'pipe', description: 'Edit pipe network parts list and sizes.' },
  { keys: 'APNS', command: 'Pipe Structure', category: 'pipe', description: 'Add a structure (manhole, inlet) to pipe network.' },
  { keys: 'APNL', command: 'Pipe Layout', category: 'pipe', description: 'Open pipe layout tools for network design.' },
  { keys: 'APNV', command: 'Pipe Profile', category: 'pipe', description: 'Draw pipe network in profile view.' },
  { keys: 'APNR', command: 'Pipe Report', category: 'pipe', description: 'Generate pipe network quantity and flow report.' },

  // View
  { keys: 'Ctrl + Shift + 3', command: '3D View', category: 'view', description: 'Switch to 3D orbit view for surface inspection.' },
  { keys: 'Ctrl + Shift + 2', command: 'Plan View', category: 'view', description: 'Switch to 2D plan view.' },
  { keys: 'Ctrl + Shift + S', command: 'Section View', category: 'view', description: 'Open section viewer for corridor cross-sections.' },
  { keys: 'Ctrl + Shift + O', command: 'Object Viewer', category: 'view', description: 'Open the Civil 3D object viewer for selected object.' },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'general', name: 'General' },
  { id: 'surface', name: 'Surface' },
  { id: 'alignment', name: 'Alignment' },
  { id: 'profile', name: 'Profile' },
  { id: 'corridor', name: 'Corridor' },
  { id: 'pipe', name: 'Pipe Network' },
  { id: 'view', name: 'View' },
];

export default function Civil3DShortcutsClient() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = useMemo(() => {
    return SHORTCUTS_DATA.filter(item => {
      const matchSearch = !search ||
        item.keys.toLowerCase().includes(search.toLowerCase()) ||
        item.command.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCat === 'all' || item.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [search, activeCat]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm print:hidden">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search Civil 3D shortcuts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-black bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          <Printer className="w-4 h-4" />
          Print A4 Cheat Sheet
        </button>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCat === cat.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
        {filtered.map((item, i) => (
          <div
            key={i}
            className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all print:border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <code className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-base font-mono font-black">
                {item.keys}
              </code>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{item.category}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.command}</h3>
            <p className="text-base text-slate-500 mt-1 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">
          No shortcuts found matching your search.
        </div>
      )}

      <RelatedTools compact />
    </div>
  );
}
