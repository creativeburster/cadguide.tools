'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'groove', name: '🔧 Groove Welds' },
  { id: 'basic', name: '🔩 Basic Welds' },
  { id: 'supp', name: '➕ Supplementary' },
  { id: 'process', name: '⚙️ Process & Tail' },
];

const SHORTCUTS = [
  // Groove welds
  { keys: '△', command: 'Square Groove', category: 'groove', description: 'Square-edged butt joint with no bevel. Used on thin material (≤5mm) where full penetration is achievable without bevel preparation.' },
  { keys: 'V', command: 'V-Groove', category: 'groove', description: 'Single-V groove. Both edges beveled at 30° (60° included angle). Most common groove weld for plates 6-25mm thick. Requires back-gouging for full penetration.' },
  { keys: 'V (double)', command: 'Double-V Groove', category: 'groove', description: 'V-groove on both sides. Used for thick plates (>25mm). Less distortion and less weld metal than single-V. Requires welding from both sides.' },
  { keys: '⌐', command: 'Bevel Groove', category: 'groove', description: 'Single-bevel groove. One edge beveled (45°), other square. Used when only one member can be prepared. Common in T-joints and corner joints.' },
  { keys: '⌐ (double)', command: 'Double-Bevel Groove', category: 'groove', description: 'Bevel on both sides. Used for thick plates where access from both sides is available. Less weld metal than double-V.' },
  { keys: 'U', command: 'U-Groove', category: 'groove', description: 'Single-U groove. Curved bevel with parallel sides. Used for thick sections (>25mm). Less weld metal than V-groove but more expensive to prepare.' },
  { keys: 'J', command: 'J-Groove', category: 'groove', description: 'Single-J groove. One edge curved (J-shape), other square. Used for thick T-joints and corner joints where only one member can be prepared.' },
  { keys: '▽', command: 'Flare-V Groove', category: 'groove', description: 'Groove formed by two curved surfaces (e.g., two round bars or formed plates). No bevel preparation needed — the joint geometry creates the groove.' },
  { keys: '⌒', command: 'Flare-Bevel Groove', category: 'groove', description: 'Groove between a curved surface and a flat surface. Common in sheet metal and structural tube-to-plate connections.' },

  // Basic weld types
  { keys: '△', command: 'Fillet Weld', category: 'basic', description: 'Triangular cross-section weld joining two surfaces at right angles. Most common weld type. Size = leg length. Equal leg fillet is standard; unequal legs used for non-symmetric loading.' },
  { keys: '○', command: 'Plug Weld', category: 'basic', description: 'Weld deposited in a circular hole in one member, fusing it to the other. Used for lap joints and repairing castings. Hole diameter and depth specified on symbol.' },
  { keys: '□', command: 'Slot Weld', category: 'basic', description: 'Weld deposited in an elongated slot. Similar to plug weld but elongated. Used for higher strength than plug welds. Slot length, width, and spacing specified.' },
  { keys: '⌒', command: 'Surfacing Weld', category: 'basic', description: 'Weld deposited on a surface to build up dimensions, provide wear resistance, or restore worn parts. Also called hardfacing or build-up weld. No joint required.' },
  { keys: '||', command: 'Seam Weld', category: 'basic', description: 'Continuous weld between overlapping members. In resistance welding, it is a continuous series of overlapping spot welds. Used for sheet metal joints requiring sealing.' },
  { keys: '×', command: 'Spot Weld', category: 'basic', description: 'Weld at a single point between overlapping members. Made by resistance welding (RSW) or arc welding. Diameter specified. Used in sheet metal assemblies.' },
  { keys: '↗', command: 'Edge Weld', category: 'basic', description: 'Weld along the edge of two or more parallel members. Used for sheet metal flanges and built-up sections. Full or partial length specified.' },
  { keys: '⌅', command: 'Stud Weld', category: 'basic', description: 'Weld joining a metal stud to a workpiece. Uses specialized equipment (SW process). Common in structural steel, shipbuilding, and automotive. No symbol on reference line — uses special stud weld symbol.' },

  // Supplementary symbols
  { keys: '○', command: 'Weld All Around', category: 'supp', description: 'Circle at the junction of arrow and reference line. Indicates weld continues all around the joint perimeter. Used for pipe-to-plate and box section connections.' },
  { keys: '⌑', command: 'Field Weld', category: 'supp', description: 'Flag at the junction of arrow and reference line. Indicates weld is to be made in the field (on-site), not in the shop. Critical for construction sequencing.' },
  { keys: '—', command: 'Melt-Through', category: 'supp', description: 'Horizontal line on the opposite side of the reference line from the weld symbol. Indicates full joint penetration with visible root reinforcement. Used for complete penetration groove welds.' },
  { keys: '⌒', command: 'Backing / Spacer', category: 'supp', description: 'Backing symbol (rectangle) indicates a backing material at the root. Spacer symbol (two rectangles) indicates a spacer between two partial penetration welds. Process specified in tail.' },
  { keys: '▽', command: 'Convex Contour', category: 'supp', description: 'Convex contour symbol indicates the weld face must be convex (bulging outward). Used when additional weld metal is desired for strength or to fill a gap.' },
  { keys: '—', command: 'Flush Contour', category: 'supp', description: 'Flush contour symbol (horizontal line) indicates the weld face must be flush (flat). Requires grinding or machining after welding. Common for visible surfaces.' },
  { keys: '⌒', command: 'Concave Contour', category: 'supp', description: 'Concave contour symbol indicates the weld face must be concave (curved inward). Rare — used for fillet welds where stress concentration at the toe must be minimized.' },
  { keys: 'G', command: 'Grind Finish', category: 'supp', description: 'G letter above contour symbol indicates the weld face must be finished by grinding. Used for flush contour on critical welds requiring smooth surface finish.' },
  { keys: 'C', command: 'Chisel Finish', category: 'supp', description: 'C letter above contour symbol indicates the weld face must be finished by chiseling. Used for rough finishing of large welds.' },
  { keys: 'M', command: 'Machine Finish', category: 'supp', description: 'M letter above contour symbol indicates the weld face must be finished by machining (milling, turning, planing). Used for precision surfaces.' },
  { keys: 'R', command: 'Roll Finish', category: 'supp', description: 'R letter above contour symbol indicates the weld face must be finished by rolling. Used for pressure vessel and pipe welds requiring smooth contour.' },
  { keys: 'U', command: 'Unspecified Finish', category: 'supp', description: 'No letter above contour symbol — finish method is unspecified. Contractor chooses appropriate method. Default when finish method is not critical.' },

  // Process and tail
  { keys: 'SMAW', command: 'Shielded Metal Arc Welding', category: 'process', description: 'Stick welding. Manual process using flux-coated electrodes. Most versatile and widely used. No shielding gas required. Process code in tail of welding symbol.' },
  { keys: 'GMAW', command: 'Gas Metal Arc Welding', category: 'process', description: 'MIG/MAG welding. Wire-fed process with shielding gas. High deposition rate. Common in fabrication shops. Process code in tail: GMAW or MIG.' },
  { keys: 'GTAW', command: 'Gas Tungsten Arc Welding', category: 'process', description: 'TIG welding. Uses non-consumable tungsten electrode. Highest quality, lowest deposition. Used for precision welds, thin materials, and non-ferrous metals. Process code in tail: GTAW or TIG.' },
  { keys: 'FCAW', command: 'Flux-Cored Arc Welding', category: 'process', description: 'Similar to GMAW but uses flux-cored wire. Self-shielded or gas-shielded. High deposition rate with better penetration than GMAW. Common in construction.' },
  { keys: 'SAW', command: 'Submerged Arc Welding', category: 'process', description: 'Automatic/semi-automatic process using granular flux. Very high deposition rate. Used for thick plate welding in shipbuilding and structural fabrication. Not visible arc.' },
  { keys: 'ESW', command: 'Electroslag Welding', category: 'process', description: 'Vertical-up process for very thick plates (25-500mm). Uses molten slag pool. Extremely high deposition. Used in heavy structural and pressure vessel fabrication.' },
  { keys: 'SW', command: 'Stud Welding', category: 'process', description: 'Specialized process for welding studs to plates. Uses drawn-arc or capacitor-discharge method. Common in structural steel and deck construction.' },
];

const TIPS = [
  {
    title: 'Arrow side vs Other side',
    content: 'The key rule: a weld symbol placed BELOW the reference line is for the ARROW side of the joint. A symbol placed ABOVE the reference line is for the OTHER side. Symbols on BOTH sides mean the weld is on both sides of the joint. The arrow always points to the joint, not necessarily to the side being welded.'
  },
  {
    title: 'Reading the tail for process specs',
    content: 'The tail of the welding symbol (forked end) contains process specifications, reference codes, or special notes. Common entries: GTAW (TIG), GMAW (MIG), SMAW (stick), FCAW (flux-cored). If no process is specified, the contractor selects the appropriate method. A tail with no note means no special process requirement.'
  },
];

export default function WeldingSymbolClient() {
  return (
    <ShortcutCheatsheetClient
      title="AWS Welding Symbols"
      subtitle="Complete AWS A2.4 welding symbol reference: groove types, fillet, plug, slot, surfacing, supplementary symbols, and process codes."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
