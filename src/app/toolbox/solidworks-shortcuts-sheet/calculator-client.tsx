'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Search,
  Printer,
  MousePointer,
  Keyboard,
  Info,
  Maximize2,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ShortcutItem {
  keys: string;
  command: string;
  category: 'system' | 'sketch' | 'part' | 'assembly' | 'drawing';
  description: string;
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  // System shortcuts
  { keys: 'Ctrl + N', command: 'New file', category: 'system', description: 'New part, Assembly or drawing file. ' },
  { keys: 'Ctrl + O', command: 'Open file', category: 'system', description: 'Browse and open existing models. ' },
  { keys: 'Ctrl + S', command: 'Save file', category: 'system', description: 'Quickly save the current document. ' },
  { keys: 'Ctrl + Q', command: 'Force Rebuild', category: 'system', description: 'The most hard-core shortcut keys, Force a complete rebuild of all entities in the feature tree to resolve abnormal model display errors. ' },
  { keys: 'Ctrl + B', command: 'Rebuild', category: 'system', description: 'Rebuild the currently changed features and assemblies. ' },
  { keys: 'S', command: 'Quick pop-up menu', category: 'system', description: 'The essence of SolidWorks efficiency, Pop up a highly customizable shortcut bar at the mouse point (sketch, Features and assembly vary) . ' },
  { keys: 'D', command: 'Confirmation Corner', category: 'system', description: 'Directly confirm/Cancel the check mark and move it to the mouse cursor to quickly exit the current sketch or feature editing.. ' },
  { keys: 'F', command: 'Full page display (Zoom to Fit)', category: 'system', description: 'Center and zoom all entities in the view to full screen display. ' },
  { keys: 'G', command: 'Partial magnifying glass (Magnifier)', category: 'system', description: 'Pop up the partial magnifying glass at the mouse position, Select fine faces and edges without scaling the viewport. ' },
  { keys: 'Space (Spacebar)', command: 'View orientation menu (Orientation)', category: 'system', description: 'Bring up the View Oriented Cube panel and double-click Quick Slice. ' },
  
  // Views
  { keys: 'Ctrl + 1', command: 'Front View', category: 'part', description: 'Switch to front projection direction. ' },
  { keys: 'Ctrl + 2', command: 'Back View', category: 'part', description: 'Switch to forward rear projection direction. ' },
  { keys: 'Ctrl + 3', command: 'Left View', category: 'part', description: 'Switch to left projection direction. ' },
  { keys: 'Ctrl + 4', command: 'Right View', category: 'part', description: 'Switch to the right projection direction' },
  { keys: 'Ctrl + 5', command: 'Top View', category: 'part', description: 'Switch to the top view direction. ' },
  { keys: 'Ctrl + 6', command: 'Bottom View', category: 'part', description: 'Switch to bottom view direction. ' },
  { keys: 'Ctrl + 7', command: 'Isometric View', category: 'part', description: 'Switch to standard isometric three-dimensional oblique projection. ' },
  { keys: 'Ctrl + 8', command: 'Normal To', category: 'part', description: 'Align the currently selected sketch plane or solid plane to the screen. ' },
  
  // Sketching shortcuts
  { keys: 'Esc', command: 'Deselect/Exit tool', category: 'sketch', description: 'Exit the current drawing tool and return to the normal frame selection mouse. ' },
  { keys: 'Enter', command: 'Repeat the last command', category: 'sketch', description: 'Reactivate the sketch or drawing command used in the previous round. ' },
  { keys: 'L', command: 'Draw a straight line (Line)', category: 'sketch', description: 'Draw a line on the currently active sketch surface. ' },
  { keys: 'Ctrl + Drag', command: 'Copy entities at equal intervals', category: 'sketch', description: 'Select the sketch object and hold down Ctrl Drag to clone the entity as is. ' },
  
  // Assembly shortcuts
  { keys: 'Tab', command: 'Hide hover component (Hide)', category: 'assembly', description: 'Click when the mouse is hovering over any part of the assembly Tab, Can hide it silently in an instant, exposing internal parts. ' },
  { keys: 'Shift + Tab', command: 'Show hidden components (Show)', category: 'assembly', description: 'Move the mouse to the blank space where the part is hidden, Hold down Shift+Tab to resurface. ' },
  { keys: 'Alt + Drag', command: 'Smart Mates', category: 'assembly', description: 'Hold Alt Use the key to drag the part axis hole to another part, and the coaxial center will be automatically created./Coinciding with each other, extremely efficient! ' },
  { keys: 'Ctrl + Drag (Component)', command: 'Quickly copy parts', category: 'assembly', description: 'Drag parts within the assembly and hold down Ctrl to directly drag out the copy. ' },
  
  // Drawing shortcuts
  { keys: 'R', command: 'List of recent documents', category: 'system', description: 'Calling up the list of recently used historical project documents on the main interface. ' },
  { keys: 'C', command: 'Collapse feature tree (Collapse)', category: 'system', description: 'One-click FeatureManager The complex assembly feature tree on the left is collapsed. ' },
  { keys: 'Alt + Click', command: 'Unlock dimension alignment', category: 'drawing', description: 'When marking dimensions in drawings, Alt-Move to bypass automatic grid-aligned attachments. ' },
  { keys: 'Shift + Click', command: 'Dimension tangent point lock', category: 'drawing', description: 'Press and hold when dimensioning arcs and circles Shift, The maximum/minimum tangent spacing of the dimension can be locked. ' }
];

// Mouse Gesture Definition (4-direction and 8-direction presets for SW)
const GESTURE_PRESETS = {
  4: {
    sketch: [
      { dir: 'up', command: 'Smart size', symbol: '📏' },
      { dir: 'right', command: 'circle', symbol: '⚪' },
      { dir: 'down', command: 'Rectangle', symbol: '⬜' },
      { dir: 'left', command: 'straight line', symbol: '➖' }
    ],
    part: [
      { dir: 'up', command: 'Look up', symbol: '⬆️' },
      { dir: 'right', command: 'Right view', symbol: '➡️' },
      { dir: 'down', command: 'Forward view', symbol: '⬇️' },
      { dir: 'left', command: 'left view', symbol: '⬅️' }
    ],
    assembly: [
      { dir: 'up', command: 'Look up', symbol: '⬆️' },
      { dir: 'right', command: 'Right view', symbol: '➡️' },
      { dir: 'down', command: 'Forward view', symbol: '⬇️' },
      { dir: 'left', command: 'left view', symbol: '⬅️' }
    ],
    drawing: [
      { dir: 'up', command: 'Smart size', symbol: '📏' },
      { dir: 'right', command: 'Projected view', symbol: '🖼️' },
      { dir: 'down', command: 'hatch', symbol: '📐' },
      { dir: 'left', command: 'Notes/Text', symbol: '📝' }
    ]
  },
  8: {
    sketch: [
      { dir: 'up', command: 'Smart size', symbol: '📏' },
      { dir: 'ur', command: 'Tangent arc', symbol: '↩️' },
      { dir: 'right', command: 'circle', symbol: '⚪' },
      { dir: 'dr', command: 'Three-point arc', symbol: '↪️' },
      { dir: 'down', command: 'Corner rectangle', symbol: '⬜' },
      { dir: 'dl', command: 'Construction line', symbol: '📇' },
      { dir: 'left', command: 'Draw a straight line', symbol: '➖' },
      { dir: 'ul', command: 'Isometric entity', symbol: '⛓️' }
    ],
    part: [
      { dir: 'up', command: 'Look up', symbol: '⬆️' },
      { dir: 'ur', command: 'Isometric', symbol: '💎' },
      { dir: 'right', command: 'Right view', symbol: '➡️' },
      { dir: 'dr', command: 'Right lower squint', symbol: '📐' },
      { dir: 'down', command: 'Forward view', symbol: '⬇️' },
      { dir: 'dl', command: 'Lower left squint', symbol: '📏' },
      { dir: 'left', command: 'left view', symbol: '⬅️' },
      { dir: 'ul', command: 'Face it', symbol: '🎯' }
    ],
    assembly: [
      { dir: 'up', command: 'Look up', symbol: '⬆️' },
      { dir: 'ur', command: 'Isometric', symbol: '💎' },
      { dir: 'right', command: 'Right view', symbol: '➡️' },
      { dir: 'dr', command: 'Move component', symbol: '🚗' },
      { dir: 'down', command: 'Forward view', symbol: '⬇️' },
      { dir: 'dl', command: 'Rotate component', symbol: '🔄' },
      { dir: 'left', command: 'left view', symbol: '⬅️' },
      { dir: 'ul', command: 'Add match', symbol: '🔗' }
    ],
    drawing: [
      { dir: 'up', command: 'Smart size', symbol: '📏' },
      { dir: 'ur', command: 'Section view', symbol: '✂️' },
      { dir: 'right', command: 'Projected view', symbol: '🖼️' },
      { dir: 'dr', command: 'Partial enlargement', symbol: '🔍' },
      { dir: 'down', command: 'Centerline', symbol: '🎯' },
      { dir: 'dl', command: 'center mark', symbol: '🔘' },
      { dir: 'left', command: 'text comment', symbol: '📝' },
      { dir: 'ul', command: 'Table/BOM', symbol: '📊' }
    ]
  }
};

export default function SolidWorksShortcutsClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'system' | 'sketch' | 'part' | 'assembly' | 'drawing'>('all');
  
  // Mouse gesture configurations
  const [gestureMode, setGestureMode] = useState<4 | 8>(8);
  const [gestureEnv, setGestureEnv] = useState<'sketch' | 'part' | 'assembly' | 'drawing'>('sketch');
  const [hoveredGesture, setHoveredGesture] = useState<string | null>(null);

  // Search filter implementation
  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.keys.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const activeGestures = useMemo(() => {
    return GESTURE_PRESETS[gestureMode][gestureEnv];
  }, [gestureMode, gestureEnv]);

  // Active hover info retrieval
  const activeHoverInfo = useMemo(() => {
    if (!hoveredGesture) return null;
    return activeGestures.find((g) => g.dir === hoveredGesture);
  }, [hoveredGesture, activeGestures]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Top interactive SVG mouse gesture wheel */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">SolidWorks Mouse gesture dynamic roulette</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              Interactive Mouse Gestures Wheel Map
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGestureMode(4)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                gestureMode === 4
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              4 Directional gestures
            </button>
            <button
              onClick={() => setGestureMode(8)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                gestureMode === 8
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              8 Directional gestures
            </button>
          </div>
        </div>

        {/* Roulette main image and control layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Roulette environment switching */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Choose a gesture work environment</span>
            <div className="grid grid-cols-2 gap-3">
              {(['sketch', 'part', 'assembly', 'drawing'] as const).map((env) => {
                const label = env === 'sketch' ? '📐 Sketch environment': env === 'part' ? '⚙️ Part modeling' : env === 'assembly' ? '🔗 Assembly' : '📝 Drawing';
                return (
                  <button
                    key={env}
                    onClick={() => {
                      setGestureEnv(env);
                      setHoveredGesture(null);
                    }}
                    className={`py-3 px-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                      gestureEnv === env
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    {label}
                  </button>
);
              })}
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-5 mt-2 flex gap-3 text-xs leading-relaxed text-slate-400">
              <Compass className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-300">What are mouse gestures? </p>
                <p className="mt-1">In SolidWorks, Hold down the<b>right mouse button and drag in a specific direction</b>, You can quickly activate the corresponding command. Hover the mouse on the right SVG Explore configurations on the roulette wheel. </p>
              </div>
            </div>
          </div>

          {/* Right: SVG dynamic gesture wheel */}
          <div className="flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-[200px] h-[200px] relative">
              <svg viewBox="0 0 200 200" className="w-full h-full select-none">
                <defs>
                  <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0c1017" />
                  </radialGradient>
                </defs>

                {/* Background Ring */}
                <circle cx="100" cy="100" r="90" fill="url(#wheelGlow)" stroke="#334155" strokeWidth="2" />
                <circle cx="100" cy="100" r="45" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

                {/* 4-direction Sector Triggers */}
                {gestureMode === 4 && (
                  <>
                    {/* Up */}
                    <path
                      d="M 68.3 68.3 A 45 45 0 0 1 131.7 68.3 L 163.6 36.4 A 90 90 0 0 0 36.4 36.4 Z"
                      fill={hoveredGesture === 'up' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'up' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('up')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Right */}
                    <path
                      d="M 131.7 68.3 A 45 45 0 0 1 131.7 131.7 L 163.6 163.6 A 90 90 0 0 0 163.6 36.4 Z"
                      fill={hoveredGesture === 'right' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'right' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('right')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Down */}
                    <path
                      d="M 131.7 131.7 A 45 45 0 0 1 68.3 131.7 L 36.4 163.6 A 90 90 0 0 0 163.6 163.6 Z"
                      fill={hoveredGesture === 'down' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'down' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('down')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Left */}
                    <path
                      d="M 68.3 131.7 A 45 45 0 0 1 68.3 68.3 L 36.4 36.4 A 90 90 0 0 0 36.4 163.6 Z"
                      fill={hoveredGesture === 'left' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'left' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('left')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                  </>
)}

                {/* 8-direction Sector Triggers (using standard octant polygon approximate bounds for performance) */}
                {gestureMode === 8 && (
                  <>
                    {/* Up: -22.5 to 22.5 deg */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(-22.5, 100, 100)"
                      fill={hoveredGesture === 'up' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'up' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('up')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* UR */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(22.5, 100, 100)"
                      fill={hoveredGesture === 'ur' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'ur' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('ur')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Right */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(67.5, 100, 100)"
                      fill={hoveredGesture === 'right' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'right' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('right')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* DR */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(112.5, 100, 100)"
                      fill={hoveredGesture === 'dr' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'dr' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('dr')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Down */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(157.5, 100, 100)"
                      fill={hoveredGesture === 'down' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'down' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('down')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* DL */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(202.5, 100, 100)"
                      fill={hoveredGesture === 'dl' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'dl' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('dl')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Left */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(247.5, 100, 100)"
                      fill={hoveredGesture === 'left' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'left' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('left')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* UL */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(292.5, 100, 100)"
                      fill={hoveredGesture === 'ul' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'ul' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('ul')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                  </>
)}

                {/* Symbols overlay */}
                {activeGestures.map((gesture) => {
                  let x = 100;
                  let y = 100;
                  const d = 70; // radius offset for symbol
                  
                  if (gesture.dir === 'up') y = 100 - d;
                  else if (gesture.dir === 'down') y = 100 + d;
                  else if (gesture.dir === 'left') x = 100 - d;
                  else if (gesture.dir === 'right') x = 100 + d;
                  else if (gesture.dir === 'ur') { x = 100 + d * 0.7; y = 100 - d * 0.7; }
                  else if (gesture.dir === 'dr') { x = 100 + d * 0.7; y = 100 + d * 0.7; }
                  else if (gesture.dir === 'dl') { x = 100 - d * 0.7; y = 100 + d * 0.7; }
                  else if (gesture.dir === 'ul') { x = 100 - d * 0.7; y = 100 - d * 0.7; }

                  return (
                    <text
                      key={gesture.dir}
                      x={x}
                      y={y + 3}
                      fontSize="9"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {gesture.symbol}
                    </text>
);
                })}
              </svg>

              {/* Center Overlay Display */}
              <div className="absolute inset-0 m-auto w-[82px] h-[82px] rounded-full flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                {activeHoverInfo ? (
                  <>
                    <span className="text-[14px] leading-none mb-1">{activeHoverInfo.symbol}</span>
                    <span className="text-[9px] font-black text-blue-400 tracking-tight leading-tight w-full truncate">
                      {activeHoverInfo.command}
                    </span>
                  </>
) : (
                  <>
                    <MousePointer className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
                    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Hover me
                    </span>
                  </>
)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Shortcut search and multi-tab filter list */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Controlling layout: Search and print buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6 print:hidden">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for keys or commands (such as: Ctrl, Rebuild, Line)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print shortcut key list (A4)
          </button>
        </div>

        {/* Filter category tags */}
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          {(['all', 'system', 'sketch', 'part', 'assembly', 'drawing'] as const).map((cat) => {
            const label = cat === 'all' ? 'All' : cat === 'system' ? '💻 system' : cat === 'sketch' ? '📐 sketch' : cat === 'part' ? '⚙️ part' : cat === 'assembly' ? '🔗 Assembly' : '📝 Drawing';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 border-slate-950 text-white font-bold'
                    : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
);
          })}
        </div>

        {/* Shortcut key to render table */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-[180px]">Shortcut hotkeys</th>
                <th className="py-3 px-4 w-[200px]">Trigger command</th>
                <th className="py-3 px-4">Use function description</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortcuts.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40 print:hover:bg-transparent">
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black tracking-tight text-[10px] shadow-sm select-all">
                      {item.keys}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-black text-sm">{item.command}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium leading-relaxed">{item.description}</td>
                </tr>
))}
              {filteredShortcuts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    No shortcut key matching this keyword was found, please try other words. 
                  </td>
                </tr>
)}
            </tbody>
          </table>
        </div>

        {/* @media print Print-specific CSS rules */}
        <style jsx global>{`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
            .print\\:border-none {
              border: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            /* A4 Landscape setting */
            @page {
              size: A4 landscape;
              margin: 1.5cm 1cm 1.5cm 1cm;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}</style>

      </div>

      {/* Geek Productivity Guide Cards */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 print:hidden">
        <div>
          <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            SolidWorks Advanced efficiency tips
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            SolidWorks Advanced Productivity Strategies Guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-500">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">1. The perfect combination of mouse gestures and shortcut toolbar</h4>
            <p>
              In SolidWorks, It is strongly recommended to configure mouse gestures to 8 directions, and put the most frequent "draw straight line"", "Circle", "Smart Size", "Crop" and"face up to "put it in". Incorporate less frequent but critical construction tools such as Stretch, cut off, stake out, datum) put in <b>`S Key Shortcut Panel`</b> Medium. In this way, when you are designing, you can right-drag with the right mouse to complete the sketch., Just press the S key with your left hand to generate a three-dimensional body with one click, Realize that "both hands do not leave the center of gravity of the keyboard and mouse""Extremely fast experience. 
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">2. Forced rebuild (Ctrl+Q) vs. normal rebuild (Ctrl+B) The difference</h4>
            <p>
              Regular Rebuild (Ctrl+B) rebuilds the generated solid only on the currently modified sketch feature, Although the calculation speed is fast, when there are many assembly relationships,, It is easy to cause coordination errors or some sketch relationships cannot be updated. And<b>Forced rebuild (Ctrl+Q) </b>clears the memory cache directly, Starting from the topmost plane of the FeatureManager feature tree, Decompile and rebuild the chassis line by line for all assembly primitives and geometric constraints. Whenever the dimensions are changed but the entity remains unchanged, Or if the assembly drawing is missing, press Ctrl+Q It is the most direct and thorough self-healing command. 
            </p>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
);
}
