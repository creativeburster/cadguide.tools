'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Printer, MousePointer } from 'lucide-react';

interface ShortcutItem {
  keys: string;
  command: string;
  category: 'system' | 'sketch' | 'part' | 'assembly' | 'drawing' | 'view';
  description: string;
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  // System
  { keys: 'Ctrl + N', command: 'New', category: 'system', description: 'Create a new part, assembly, or drawing file.' },
  { keys: 'Ctrl + O', command: 'Open', category: 'system', description: 'Open an existing NX file.' },
  { keys: 'Ctrl + S', command: 'Save', category: 'system', description: 'Save the current file.' },
  { keys: 'Ctrl + Shift + A', command: 'Save As', category: 'system', description: 'Save the current file with a new name.' },
  { keys: 'Ctrl + Z', command: 'Undo', category: 'system', description: 'Undo the last operation.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'system', description: 'Redo the last undone operation.' },
  { keys: 'Ctrl + W', command: 'Close', category: 'system', description: 'Close the current window.' },
  { keys: 'Ctrl + M', command: 'Modeling', category: 'system', description: 'Switch to Modeling application.' },
  { keys: 'Ctrl + Alt + M', command: 'Manufacturing', category: 'system', description: 'Switch to CAM Manufacturing application.' },
  { keys: 'Ctrl + Alt + D', command: 'Drafting', category: 'system', description: 'Switch to Drafting application.' },
  { keys: 'Ctrl + Alt + S', command: 'Simulation', category: 'system', description: 'Switch to Simulation/CAE application.' },
  { keys: 'Ctrl + Alt + V', command: 'Visualize', category: 'system', description: 'Switch to Visualize/Render application.' },

  // View
  { keys: 'F', command: 'Fit', category: 'view', description: 'Zoom to fit all geometry in the viewport.' },
  { keys: 'Ctrl + F', command: 'Fit View', category: 'view', description: 'Fit the view to selected objects.' },
  { keys: 'Home', command: 'Trimetric', category: 'view', description: 'Switch to standard trimetric view.' },
  { keys: 'End', command: 'Isometric', category: 'view', description: 'Switch to isometric view.' },
  { keys: 'Ctrl + Shift + Z', command: 'Zoom In', category: 'view', description: 'Zoom in on the viewport.' },
  { keys: 'Ctrl + Shift + X', command: 'Zoom Out', category: 'view', description: 'Zoom out of the viewport.' },
  { keys: 'Ctrl + Shift + C', command: 'Center', category: 'view', description: 'Center the view on a selected point.' },
  { keys: 'W', command: 'Wireframe', category: 'view', description: 'Toggle wireframe/shaded display.' },
  { keys: 'Ctrl + Shift + V', command: 'Perspective', category: 'view', description: 'Toggle perspective/orthographic view.' },

  // Sketch
  { keys: 'S', command: 'Sketch', category: 'sketch', description: 'Start a new sketch on a selected plane or face.' },
  { keys: 'X', command: 'Extrude', category: 'sketch', description: 'Extrude a sketch curve or face.' },
  { keys: 'Shift + X', command: 'Revolve', category: 'sketch', description: 'Revolve a sketch curve around an axis.' },
  { keys: 'Q', command: 'Finish Sketch', category: 'sketch', description: 'Exit the sketcher and return to modeling.' },
  { keys: 'D', command: 'Dimension', category: 'sketch', description: 'Create a dimensional constraint on sketch geometry.' },
  { keys: 'G', command: 'Geometric Constraint', category: 'sketch', description: 'Apply a geometric constraint (coincident, tangent, etc.).' },
  { keys: 'Alt + D', command: 'Auto Dimension', category: 'sketch', description: 'Automatically create dimensions for unconstrained geometry.' },
  { keys: 'Ctrl + T', command: 'Transform', category: 'sketch', description: 'Open the transform dialog for move, rotate, copy.' },

  // Part Design
  { keys: 'X', command: 'Extrude', category: 'part', description: 'Create an extruded feature from a sketch or face.' },
  { keys: 'Shift + X', command: 'Revolve', category: 'part', description: 'Create a revolved feature.' },
  { keys: 'H', command: 'Hole', category: 'part', description: 'Create a hole feature (simple, counterbore, countersink).' },
  { keys: 'B', command: 'Blend/Edge', category: 'part', description: 'Create an edge blend (fillet).' },
  { keys: 'C', command: 'Chamfer', category: 'part', description: 'Create a chamfer on selected edges.' },
  { keys: 'T', command: 'Trim', category: 'part', description: 'Trim a body or sheet with a tool body or plane.' },
  { keys: 'O', command: 'Offset Surface', category: 'part', description: 'Create an offset surface from a face.' },
  { keys: 'Shift + B', command: 'Boolean', category: 'part', description: 'Open boolean operations (unite, subtract, intersect).' },
  { keys: 'M', command: 'Move Face', category: 'part', description: 'Move a face using synchronous technology.' },
  { keys: 'P', command: 'Pattern', category: 'part', description: 'Create a pattern of features (linear, circular, mirror).' },
  { keys: 'Shift + D', command: 'Delete', category: 'part', description: 'Delete a selected feature or body.' },
  { keys: 'Ctrl + B', command: 'Blank', category: 'part', description: 'Blank (hide) a selected body or feature.' },
  { keys: 'Ctrl + Shift + B', command: 'Unblank All', category: 'part', description: 'Show all blanked bodies and features.' },
  { keys: 'Ctrl + E', command: 'Expression', category: 'part', description: 'Open the expressions editor for parametric formulas.' },

  // Assembly
  { keys: 'A', command: 'Assemblies', category: 'assembly', description: 'Open the assembly navigator.' },
  { keys: 'Ctrl + A', command: 'Add Component', category: 'assembly', description: 'Add an existing component to the assembly.' },
  { keys: 'M', command: 'Mate Constraint', category: 'assembly', description: 'Create a mating constraint between components.' },
  { keys: 'Alt + M', command: 'Align', category: 'assembly', description: 'Create an align constraint.' },
  { keys: 'Ctrl + Alt + T', command: 'Touch Constraint', category: 'assembly', description: 'Create a touch (contact) constraint.' },
  { keys: 'Ctrl + Alt + L', command: 'Assembly Layout', category: 'assembly', description: 'Open assembly layout editor.' },
  { keys: 'Ctrl + Shift + U', command: 'Unsuppress', category: 'assembly', description: 'Unsuppress a suppressed component.' },
  { keys: 'Ctrl + Shift + S', command: 'Suppress', category: 'assembly', description: 'Suppress a selected component.' },

  // Drawing
  { keys: 'Ctrl + Shift + D', command: 'Drafting', category: 'drawing', description: 'Enter the drafting application.' },
  { keys: 'Ctrl + Shift + B', command: 'Base View', category: 'drawing', description: 'Place a base view on the drawing sheet.' },
  { keys: 'Ctrl + Shift + P', command: 'Projected View', category: 'drawing', description: 'Create a projected view from a base view.' },
  { keys: 'Ctrl + Shift + D', command: 'Detail View', category: 'drawing', description: 'Create a detail (enlarged) view.' },
  { keys: 'Ctrl + Shift + C', command: 'Section View', category: 'drawing', description: 'Create a cross-section view.' },
  { keys: 'Ctrl + Shift + N', command: 'Annotation', category: 'drawing', description: 'Open annotation tools (notes, labels, symbols).' },
  { keys: 'Ctrl + Shift + T', command: 'Tolerance', category: 'drawing', description: 'Open tolerance annotation tools.' },
];

const GESTURES = [
  { dir: 'up', command: 'Extrude', symbol: '⬆️' },
  { dir: 'right', command: 'Sketch', symbol: '➡️' },
  { dir: 'down', command: 'Fit', symbol: '⬇️' },
  { dir: 'left', command: 'Undo', symbol: '⬅️' },
  { dir: 'up-right', command: 'Blend', symbol: '↗️' },
  { dir: 'down-right', command: 'Hole', symbol: '↘️' },
  { dir: 'down-left', command: 'Chamfer', symbol: '↙️' },
  { dir: 'up-left', command: 'Dimension', symbol: '↖️' },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'system', name: 'System' },
  { id: 'view', name: 'View' },
  { id: 'sketch', name: 'Sketch' },
  { id: 'part', name: 'Part Design' },
  { id: 'assembly', name: 'Assembly' },
  { id: 'drawing', name: 'Drawing' },
];

export default function NXShortcutsClient() {
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
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm print:hidden">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search NX shortcuts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          <Printer className="w-4 h-4" />
          Print A4 Cheat Sheet
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 print:hidden">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              activeCat === cat.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
        {filtered.map((item, i) => (
          <div
            key={i}
            className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all print:border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <code className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-mono font-black">
                {item.keys}
              </code>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{item.category}</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.command}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Mouse Gesture Guide */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm print:hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <MousePointer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Mouse Gesture Guide (8-Direction)</h2>
            <p className="text-xs text-slate-500 font-medium">Hold right mouse button + drag direction to trigger command</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-[280px] h-[280px]">
            {/* Center mouse icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg z-10">
              <MousePointer className="w-6 h-6" />
            </div>
            {/* Direction buttons */}
            {GESTURES.map(g => {
              const positions: Record<string, { top: string; left: string }> = {
                'up': { top: '0%', left: '50%' },
                'right': { top: '50%', left: '100%' },
                'down': { top: '100%', left: '50%' },
                'left': { top: '50%', left: '0%' },
                'up-right': { top: '15%', left: '85%' },
                'down-right': { top: '85%', left: '85%' },
                'down-left': { top: '85%', left: '15%' },
                'up-left': { top: '15%', left: '15%' },
              };
              const pos = positions[g.dir];
              return (
                <div
                  key={g.dir}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white border-2 border-slate-100 rounded-2xl flex flex-col items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <span className="text-xl">{g.symbol}</span>
                  <span className="text-[9px] font-black text-slate-600 group-hover:text-blue-600">{g.command}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
