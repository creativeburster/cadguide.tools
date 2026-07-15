'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Printer } from 'lucide-react';

interface CodeItem {
  code: string;
  name: string;
  category: 'motion' | 'canned' | 'plane' | 'comp' | 'units' | 'spindle' | 'coolant' | 'program' | 'feed' | 'tool' | 'misc';
  modal: string;
  description: string;
}

const DATA: CodeItem[] = [
  // Motion
  { code: 'G00', name: 'Rapid Positioning', category: 'motion', modal: 'Group 01', description: 'Move at maximum traverse speed to target coordinates. No cutting.' },
  { code: 'G01', name: 'Linear Interpolation', category: 'motion', modal: 'Group 01', description: 'Cut in a straight line at programmed feed rate.' },
  { code: 'G02', name: 'Circular Interpolation CW', category: 'motion', modal: 'Group 01', description: 'Clockwise arc cut. Requires end point + radius (R) or center offsets (I, J, K).' },
  { code: 'G03', name: 'Circular Interpolation CCW', category: 'motion', modal: 'Group 01', description: 'Counter-clockwise arc cut. Same parameters as G02.' },
  { code: 'G04', name: 'Dwell', category: 'motion', modal: 'Group 00', description: 'Pause for specified time (P in ms or seconds). Non-modal.' },
  { code: 'G09', name: 'Exact Stop', category: 'motion', modal: 'Group 00', description: 'Decelerate to exact stop at end of block. Non-modal.' },

  // Canned cycles
  { code: 'G81', name: 'Drill Cycle', category: 'canned', modal: 'Group 09', description: 'Rapid to R-plane, feed to Z depth, rapid out. Simple drilling.' },
  { code: 'G82', name: 'Drill Cycle with Dwell', category: 'canned', modal: 'Group 09', description: 'Like G81 but pauses at bottom (P) for chip breaking. For spot drilling.' },
  { code: 'G83', name: 'Peck Drilling Cycle', category: 'canned', modal: 'Group 09', description: 'Deep hole drilling with peck retraction to R-plane. Q = peck depth.' },
  { code: 'G84', name: 'Tapping Cycle', category: 'canned', modal: 'Group 09', description: 'Rigid tapping: feed down, reverse spindle, feed out. Synchronized.' },
  { code: 'G85', name: 'Boring Cycle', category: 'canned', modal: 'Group 09', description: 'Boring with feed out. Smooth bore finish.' },
  { code: 'G86', name: 'Boring with Stop', category: 'canned', modal: 'Group 09', description: 'Boring: stop spindle at bottom, rapid retract. For rough boring.' },
  { code: 'G73', name: 'High-Speed Peck', category: 'canned', modal: 'Group 09', description: 'Peck drilling with small retraction (Q-delta). Faster than G83.' },
  { code: 'G80', name: 'Cancel Canned Cycle', category: 'canned', modal: 'Group 09', description: 'Cancel any active canned cycle. Return to normal motion.' },

  // Plane
  { code: 'G17', name: 'XY Plane Selection', category: 'plane', modal: 'Group 02', description: 'Select XY plane for circular interpolation and cutter comp.' },
  { code: 'G18', name: 'ZX Plane Selection', category: 'plane', modal: 'Group 02', description: 'Select ZX plane.' },
  { code: 'G19', name: 'YZ Plane Selection', category: 'plane', modal: 'Group 02', description: 'Select YZ plane.' },

  // Compensation
  { code: 'G40', name: 'Cancel Cutter Comp', category: 'comp', modal: 'Group 07', description: 'Cancel cutter radius compensation.' },
  { code: 'G41', name: 'Cutter Comp Left', category: 'comp', modal: 'Group 07', description: 'Compensate cutter radius to left of tool path (climb milling).' },
  { code: 'G42', name: 'Cutter Comp Right', category: 'comp', modal: 'Group 07', description: 'Compensate cutter radius to right of tool path (conventional milling).' },
  { code: 'G43', name: 'Tool Length Comp +', category: 'comp', modal: 'Group 08', description: 'Apply tool length offset in positive direction. H = tool offset register.' },
  { code: 'G44', name: 'Tool Length Comp -', category: 'comp', modal: 'Group 08', description: 'Apply tool length offset in negative direction. Rarely used.' },
  { code: 'G49', name: 'Cancel Tool Length Comp', category: 'comp', modal: 'Group 08', description: 'Cancel tool length compensation.' },

  // Units
  { code: 'G20', name: 'Inch Mode', category: 'units', modal: 'Group 06', description: 'All coordinates and feeds in inches. IPM for feed.' },
  { code: 'G21', name: 'Metric Mode', category: 'units', modal: 'Group 06', description: 'All coordinates and feeds in millimeters. mm/min for feed.' },

  // Feed
  { code: 'G94', name: 'Feed per Minute', category: 'feed', modal: 'Group 05', description: 'Feed rate in units per minute (mm/min or in/min).' },
  { code: 'G95', name: 'Feed per Revolution', category: 'feed', modal: 'Group 05', description: 'Feed rate in units per revolution (mm/rev or in/rev).' },

  // Spindle
  { code: 'G96', name: 'Constant Surface Speed', category: 'spindle', modal: 'Group 13', description: 'Maintain constant surface speed (m/min or ft/min). Spindle adjusts RPM with diameter.' },
  { code: 'G97', name: 'RPM Mode', category: 'spindle', modal: 'Group 13', description: 'Spindle speed in direct RPM. Default mode.' },

  // Positioning
  { code: 'G90', name: 'Absolute Positioning', category: 'misc', modal: 'Group 03', description: 'All coordinates relative to program zero (work offset).' },
  { code: 'G91', name: 'Incremental Positioning', category: 'misc', modal: 'Group 03', description: 'All coordinates relative to current tool position.' },
  { code: 'G28', name: 'Return to Home', category: 'misc', modal: 'Group 00', description: 'Rapid to machine home via intermediate point.' },
  { code: 'G30', name: 'Return to 2nd Home', category: 'misc', modal: 'Group 00', description: 'Rapid to secondary home position (tool changer).' },

  // Work offsets
  { code: 'G54', name: 'Work Offset 1', category: 'misc', modal: 'Group 14', description: 'Select work coordinate system 1.' },
  { code: 'G55', name: 'Work Offset 2', category: 'misc', modal: 'Group 14', description: 'Select work coordinate system 2.' },
  { code: 'G56', name: 'Work Offset 3', category: 'misc', modal: 'Group 14', description: 'Select work coordinate system 3.' },
  { code: 'G57', name: 'Work Offset 4', category: 'misc', modal: 'Group 14', description: 'Select work coordinate system 4.' },
  { code: 'G58', name: 'Work Offset 5', category: 'misc', modal: 'Group 14', description: 'Select work coordinate system 5.' },
  { code: 'G59', name: 'Work Offset 6', category: 'misc', modal: 'Group 14', description: 'Select work coordinate system 6.' },

  // M-Codes
  { code: 'M00', name: 'Program Stop', category: 'program', modal: 'Non-modal', description: 'Stop spindle, coolant, and motion. Operator must press cycle start to resume.' },
  { code: 'M01', name: 'Optional Stop', category: 'program', modal: 'Non-modal', description: 'Stop only if optional stop switch is on. Useful for inspection.' },
  { code: 'M02', name: 'Program End', category: 'program', modal: 'Non-modal', description: 'End program. No rewind. Reset to beginning.' },
  { code: 'M03', name: 'Spindle CW', category: 'spindle', modal: 'Non-modal', description: 'Start spindle clockwise (forward). S = RPM.' },
  { code: 'M04', name: 'Spindle CCW', category: 'spindle', modal: 'Non-modal', description: 'Start spindle counter-clockwise (reverse).' },
  { code: 'M05', name: 'Spindle Stop', category: 'spindle', modal: 'Non-modal', description: 'Stop spindle rotation.' },
  { code: 'M06', name: 'Tool Change', category: 'tool', modal: 'Non-modal', description: 'Execute tool change. T = tool number.' },
  { code: 'M07', name: 'Mist Coolant On', category: 'coolant', modal: 'Non-modal', description: 'Turn on mist coolant.' },
  { code: 'M08', name: 'Flood Coolant On', category: 'coolant', modal: 'Non-modal', description: 'Turn on flood coolant.' },
  { code: 'M09', name: 'Coolant Off', category: 'coolant', modal: 'Non-modal', description: 'Turn off all coolant.' },
  { code: 'M19', name: 'Spindle Orient', category: 'spindle', modal: 'Non-modal', description: 'Orient spindle to fixed angle for rigid tapping or tool change.' },
  { code: 'M30', name: 'Program End + Rewind', category: 'program', modal: 'Non-modal', description: 'End program and rewind to beginning. Reset all modal codes.' },
  { code: 'M98', name: 'Subprogram Call', category: 'program', modal: 'Non-modal', description: 'Call subprogram P####. L = number of repeats.' },
  { code: 'M99', name: 'Subprogram Return', category: 'program', modal: 'Non-modal', description: 'Return from subprogram to calling program.' },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'motion', name: 'Motion' },
  { id: 'canned', name: 'Canned Cycles' },
  { id: 'comp', name: 'Compensation' },
  { id: 'plane', name: 'Plane' },
  { id: 'units', name: 'Units' },
  { id: 'spindle', name: 'Spindle' },
  { id: 'coolant', name: 'Coolant' },
  { id: 'program', name: 'Program' },
  { id: 'misc', name: 'Positioning / Offsets' },
];

export default function GCodeClient() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = useMemo(() => {
    return DATA.filter(item => {
      const matchSearch = !search ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
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
          <input type="text" placeholder="Search G-code or M-code..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-black bg-blue-600 text-white hover:bg-blue-700 transition-all">
          <Printer className="w-4 h-4" />
          Print A4 Cheat Sheet
        </button>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${activeCat === cat.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>{cat.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
        {filtered.map((item, i) => (
          <div key={i} className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all print:border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <code className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-base font-mono font-black">{item.code}</code>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{item.modal}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <p className="text-base text-slate-500 mt-1 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-16 text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">No codes found matching your search.</div>}

      <RelatedTools compact />
    </div>
  );
}
