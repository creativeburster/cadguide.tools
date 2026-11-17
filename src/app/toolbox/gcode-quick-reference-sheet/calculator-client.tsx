'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Printer, Copy, Check, Download, Info } from 'lucide-react';

interface CodeItem {
  code: string;
  name: string;
  category: 'motion' | 'canned' | 'plane' | 'comp' | 'units' | 'spindle' | 'coolant' | 'program' | 'feed' | 'tool' | 'misc';
  groupLabel: string;
  description: string;
}

const DATA: CodeItem[] = [
  // Motion (LinuxCNC G-code quick reference)
  { code: 'G0', name: 'Coordinated Motion at Rapid Rate', category: 'motion', groupLabel: 'Motion', description: 'Rapid positioning move along programmed axes. Feed rate F is ignored.' },
  { code: 'G1', name: 'Coordinated Motion at Feed Rate', category: 'motion', groupLabel: 'Motion', description: 'Straight-line linear move at the active programmed feed rate F.' },
  { code: 'G2', name: 'Coordinated Helical Motion CW', category: 'motion', groupLabel: 'Motion', description: 'Clockwise circular or helical interpolation in the selected plane using I/J/K offsets or radius R.' },
  { code: 'G3', name: 'Coordinated Helical Motion CCW', category: 'motion', groupLabel: 'Motion', description: 'Counter-clockwise circular or helical interpolation in the selected plane.' },
  { code: 'G4', name: 'Dwell', category: 'motion', groupLabel: 'Motion', description: 'Pause axis motion for P seconds before continuing program execution.' },

  // Canned Cycles (G73, G80-G86 verified in LinuxCNC docs)
  { code: 'G73', name: 'Drilling Cycle with Chip Breaking', category: 'canned', groupLabel: 'Canned Cycle', description: 'High-speed peck drilling with incremental Q depth and small chip-break retraction.' },
  { code: 'G80', name: 'Cancel Canned Motion Modes', category: 'canned', groupLabel: 'Canned Cycle', description: 'Cancel any active canned cycle and return to normal modal motion behavior.' },
  { code: 'G81', name: 'Drilling Cycle', category: 'canned', groupLabel: 'Canned Cycle', description: 'Feed to programmed Z depth from R plane, then rapid retract out of hole.' },
  { code: 'G82', name: 'Drilling Cycle with Dwell', category: 'canned', groupLabel: 'Canned Cycle', description: 'Feed to Z depth, dwell for P seconds at hole bottom, then rapid retract.' },
  { code: 'G83', name: 'Peck Drilling Cycle', category: 'canned', groupLabel: 'Canned Cycle', description: 'Deep-hole peck drilling with incremental Z cuts (Q) and full retraction between pecks.' },
  { code: 'G84', name: 'Right-Hand Tapping Cycle with Dwell', category: 'canned', groupLabel: 'Canned Cycle', description: 'Right-hand tapping cycle coordinated with R, Z, and feed rate.' },
  { code: 'G85', name: 'Boring Cycle, No Dwell, Feed Out', category: 'canned', groupLabel: 'Canned Cycle', description: 'Feed down to Z depth and feed back out to R plane without dwelling.' },
  { code: 'G86', name: 'Boring Cycle, Stop, Rapid Out', category: 'canned', groupLabel: 'Canned Cycle', description: 'Feed to Z depth, dwell P seconds, stop spindle, and rapid retract out.' },

  // Plane Select
  { code: 'G17', name: 'XY Plane Select (Default)', category: 'plane', groupLabel: 'Plane', description: 'Select the XY plane perpendicular to Z-axis for arcs and cutter compensation.' },
  { code: 'G18', name: 'ZX Plane Select', category: 'plane', groupLabel: 'Plane', description: 'Select the ZX plane perpendicular to Y-axis for arcs and canned cycles.' },
  { code: 'G19', name: 'YZ Plane Select', category: 'plane', groupLabel: 'Plane', description: 'Select the YZ plane perpendicular to X-axis for arcs and canned cycles.' },

  // Cutter & Tool Length Compensation (G40, G41, G42, G43, G49 verified)
  { code: 'G40', name: 'Cancel Cutter Compensation', category: 'comp', groupLabel: 'Compensation', description: 'Turn cutter radius compensation off before next linear exit move.' },
  { code: 'G41', name: 'Cutter Compensation Left', category: 'comp', groupLabel: 'Compensation', description: 'Offset tool path to the left of programmed contour using tool diameter D.' },
  { code: 'G42', name: 'Cutter Compensation Right', category: 'comp', groupLabel: 'Compensation', description: 'Offset tool path to the right of programmed contour using tool diameter D.' },
  { code: 'G43', name: 'Tool Length Offset from Tool Table', category: 'comp', groupLabel: 'Compensation', description: 'Apply stored tool length offset (H word) from active tool table.' },
  { code: 'G49', name: 'Cancel Tool Length Offset', category: 'comp', groupLabel: 'Compensation', description: 'Cancel active tool length compensation and zero length offset.' },

  // Units
  { code: 'G20', name: 'Set Units to Inches', category: 'units', groupLabel: 'Units', description: 'Interpret length coordinates and linear feeds in inches.' },
  { code: 'G21', name: 'Set Units to Millimeters', category: 'units', groupLabel: 'Units', description: 'Interpret length coordinates and linear feeds in millimeters.' },

  // Feed Modes
  { code: 'G94', name: 'Units per Minute Feed Mode', category: 'feed', groupLabel: 'Feed Mode', description: 'Interpret F-word as distance units per minute (in/min or mm/min).' },
  { code: 'G95', name: 'Units per Revolution Feed Mode', category: 'feed', groupLabel: 'Feed Mode', description: 'Interpret F-word as distance units per spindle revolution (in/rev or mm/rev).' },

  // Spindle Speed Control Mode
  { code: 'G96', name: 'Constant Surface Speed Mode', category: 'spindle', groupLabel: 'Spindle Mode', description: 'Vary spindle RPM dynamically with X position to hold programmed surface speed S.' },
  { code: 'G97', name: 'RPM Spindle Speed Mode', category: 'spindle', groupLabel: 'Spindle Mode', description: 'Direct constant spindle rotation speed S in revolutions per minute.' },

  // Distance, Return & Work Coordinate Systems
  { code: 'G28', name: 'Go to Predefined Position 1', category: 'misc', groupLabel: 'Positioning', description: 'Rapid move to predefined machine home position stored in #5161-#5166.' },
  { code: 'G30', name: 'Go to Predefined Position 2', category: 'misc', groupLabel: 'Positioning', description: 'Rapid move to secondary predefined position (commonly tool-change location).' },
  { code: 'G53', name: 'Move in Machine Coordinates', category: 'misc', groupLabel: 'Coordinates', description: 'Non-modal move using absolute machine coordinates for the current block only.' },
  { code: 'G54', name: 'Select Coordinate System 1', category: 'misc', groupLabel: 'Work Offset', description: 'Activate workpiece coordinate system 1 (#5221-#5230).' },
  { code: 'G55', name: 'Select Coordinate System 2', category: 'misc', groupLabel: 'Work Offset', description: 'Activate workpiece coordinate system 2 (#5241-#5250).' },
  { code: 'G56', name: 'Select Coordinate System 3', category: 'misc', groupLabel: 'Work Offset', description: 'Activate workpiece coordinate system 3 (#5261-#5270).' },
  { code: 'G57', name: 'Select Coordinate System 4', category: 'misc', groupLabel: 'Work Offset', description: 'Activate workpiece coordinate system 4 (#5281-#5290).' },
  { code: 'G58', name: 'Select Coordinate System 5', category: 'misc', groupLabel: 'Work Offset', description: 'Activate workpiece coordinate system 5 (#5301-#5310).' },
  { code: 'G59', name: 'Select Coordinate System 6', category: 'misc', groupLabel: 'Work Offset', description: 'Activate workpiece coordinate system 6 (#5321-#5330).' },
  { code: 'G90', name: 'Absolute Distance Mode', category: 'misc', groupLabel: 'Distance Mode', description: 'Coordinate axis words represent absolute positions in the active coordinate system.' },
  { code: 'G91', name: 'Incremental Distance Mode', category: 'misc', groupLabel: 'Distance Mode', description: 'Coordinate axis words represent incremental displacements from current position.' },
  { code: 'G92', name: 'Coordinate System Offset', category: 'misc', groupLabel: 'Work Offset', description: 'Apply temporary coordinate system origin shift relative to current controlled point.' },
  { code: 'G98', name: 'Canned Cycle Retract to Initial Z', category: 'canned', groupLabel: 'Canned Retract', description: 'Retract Z-axis back to original Z height (OLD_Z) if above R plane.' },
  { code: 'G99', name: 'Canned Cycle Retract to R Plane', category: 'canned', groupLabel: 'Canned Retract', description: 'Retract Z-axis only to the programmed R clearance plane between holes.' },

  // M-Codes (LinuxCNC M-code quick reference)
  { code: 'M0', name: 'Program Pause', category: 'program', groupLabel: 'M-Code Program', description: 'Temporarily pause a running program until operator presses cycle resume.' },
  { code: 'M1', name: 'Optional Program Pause', category: 'program', groupLabel: 'M-Code Program', description: 'Pause program only when Optional Stop switch is active in machine controller.' },
  { code: 'M2', name: 'Program End', category: 'program', groupLabel: 'M-Code Program', description: 'End program execution; pressing Cycle Start restarts from beginning of file.' },
  { code: 'M3', name: 'Spindle Turn CW', category: 'spindle', groupLabel: 'M-Code Spindle', description: 'Start spindle clockwise at the currently programmed S speed.' },
  { code: 'M4', name: 'Spindle Turn CCW', category: 'spindle', groupLabel: 'M-Code Spindle', description: 'Start spindle counter-clockwise at the currently programmed S speed.' },
  { code: 'M5', name: 'Spindle Stop', category: 'spindle', groupLabel: 'M-Code Spindle', description: 'Stop spindle rotation.' },
  { code: 'M6', name: 'Tool Change', category: 'tool', groupLabel: 'M-Code Tool', description: 'Execute tool change to the tool slot selected by T.' },
  { code: 'M7', name: 'Mist Coolant On', category: 'coolant', groupLabel: 'M-Code Coolant', description: 'Turn on mist coolant control output pin.' },
  { code: 'M8', name: 'Flood Coolant On', category: 'coolant', groupLabel: 'M-Code Coolant', description: 'Turn on flood coolant control output pin.' },
  { code: 'M9', name: 'All Coolant Off', category: 'coolant', groupLabel: 'M-Code Coolant', description: 'Turn off both mist (M7) and flood (M8) coolant outputs.' },
  { code: 'M19', name: 'Orient Spindle', category: 'spindle', groupLabel: 'M-Code Spindle', description: 'Rotate and hold spindle at specified angular position R (0-360 deg).' },
  { code: 'M30', name: 'Program End & Exchange Shuttle', category: 'program', groupLabel: 'M-Code Program', description: 'Exchange pallet shuttles if configured and end program, ready to restart.' },
  { code: 'M98', name: 'Call Subprogram', category: 'program', groupLabel: 'M-Code Program', description: 'Invoke main/sub-program subroutine call with repeat count L.' },
  { code: 'M99', name: 'Return From Subprogram', category: 'program', groupLabel: 'M-Code Program', description: 'Return execution from subprogram back to the calling program line.' },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'motion', name: 'Motion' },
  { id: 'canned', name: 'Canned Cycles' },
  { id: 'comp', name: 'Compensation' },
  { id: 'plane', name: 'Plane' },
  { id: 'units', name: 'Units' },
  { id: 'feed', name: 'Feed' },
  { id: 'spindle', name: 'Spindle' },
  { id: 'coolant', name: 'Coolant' },
  { id: 'program', name: 'Program' },
  { id: 'tool', name: 'Tool' },
  { id: 'misc', name: 'Coordinates / Misc' },
];

function normalizeCodeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/^([gm])0+(\d+)$/, '$1$2');
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function GCodeClient() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const raw = search.trim().toLowerCase();
    const norm = normalizeCodeQuery(search);
    return DATA.filter((item) => {
      const codeNorm = item.code.toLowerCase();
      const matchSearch =
        !raw ||
        codeNorm.includes(raw) ||
        codeNorm.includes(norm) ||
        item.name.toLowerCase().includes(raw) ||
        item.description.toLowerCase().includes(raw);
      const matchCat = activeCat === 'all' || item.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [search, activeCat]);

  const handleCopy = async () => {
    const text = filtered.map((c) => `${c.code} - ${c.name}: ${c.description}`).join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    const rows = [
      ['Code', 'Name', 'Category', 'Description'],
      ...filtered.map((item) => [item.code, item.name, item.groupLabel, item.description]),
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linuxcnc-gcode-mcode-reference.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm print:hidden">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            data-testid="input-search"
            placeholder="Search G0, G43, M3, canned, spindle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-500 px-2">
            Showing <span data-testid="result-count">{filtered.length}</span> / {DATA.length} codes
          </span>
          <button
            type="button"
            data-testid="btn-copy"
            disabled={filtered.length === 0}
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy List'}
          </button>
          <button
            type="button"
            data-testid="btn-download"
            disabled={filtered.length === 0}
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <Printer className="w-4 h-4" />
            Print A4
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            data-testid={`cat-${cat.id}`}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${
              activeCat === cat.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
        {filtered.map((item) => (
          <div
            key={item.code}
            data-testid={`code-card-${item.code}`}
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all print:border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <code className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-base font-mono font-black">{item.code}</code>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{item.groupLabel}</span>
            </div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <p className="text-sm text-slate-600 mt-1 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-bold bg-white rounded-3xl border border-slate-200">
          No codes found matching your search.
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2 print:hidden">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Code definitions verified against official{' '}
          <a
            href="https://linuxcnc.org/docs/html/gcode/g-code.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline font-semibold"
          >
            LinuxCNC G-Code Documentation
          </a>{' '}
          and{' '}
          <a
            href="https://linuxcnc.org/docs/html/gcode/m-code.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline font-semibold"
          >
            LinuxCNC M-Code Documentation
          </a>
          . Controller-specific modal groups and custom canned cycles vary by CNC builder manual.
        </span>
      </div>

      <RelatedTools compact />
    </div>
  );
}
