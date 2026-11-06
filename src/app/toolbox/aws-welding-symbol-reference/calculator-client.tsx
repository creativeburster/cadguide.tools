'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'groove', name: '🔧 Groove Welds' },
  { id: 'basic', name: '🔩 Basic Welds' },
  { id: 'supp', name: '➕ Supplementary' },
  { id: 'process', name: '⚙️ Process & Tail' },
];

const SHORTCUTS = [
  // Groove welds (AWS A2.4 standard groove joint edge preparations)
  { keys: '||', command: 'Square Groove', category: 'groove', description: 'Square-edged butt joint with no bevel (symbol: two parallel vertical lines). Used on thin material (≤5mm) where full penetration is achievable without bevel preparation.' },
  { keys: 'V', command: 'V-Groove', category: 'groove', description: 'Single-V groove. Both edges beveled at 30° (60° included angle). Most common groove weld for plates 6-25mm thick. Requires back-gouging for full penetration.' },
  { keys: 'X', command: 'Double-V Groove', category: 'groove', description: 'V-groove on both sides (symbol: X-shape). Used for thick plates (>25mm). Less distortion and less weld metal than single-V. Requires welding from both sides.' },
  { keys: '|/', command: 'Bevel Groove', category: 'groove', description: 'Single-bevel groove. One edge beveled (45°), other square (symbol: vertical line on left, angled line on right). Common in T-joints and corner joints.' },
  { keys: 'K', command: 'Double-Bevel Groove', category: 'groove', description: 'Bevel on both sides (symbol: K-shape with vertical line on left). Used for thick plates where access from both sides is available.' },
  { keys: 'U', command: 'U-Groove', category: 'groove', description: 'Single-U groove. Curved bevel with parallel sides (symbol: U-shape). Used for thick sections (>25mm). Less weld metal than V-groove but more expensive to prepare.' },
  { keys: 'J', command: 'J-Groove', category: 'groove', description: 'Single-J groove. One edge curved (J-shape), other square. Used for thick T-joints and corner joints where only one member can be prepared.' },
  { keys: ')(', command: 'Flare-V Groove', category: 'groove', description: 'Groove formed by two curved surfaces (symbol: two curved lines facing outward). No bevel preparation needed — joint geometry creates the groove.' },
  { keys: '|(', command: 'Flare-Bevel Groove', category: 'groove', description: 'Groove between a curved surface and a flat surface (symbol: vertical line on left, curved line on right). Common in structural tube-to-plate connections.' },

  // Basic weld types (AWS A2.4 standard basic weld symbols)
  { keys: '⊿', command: 'Fillet Weld', category: 'basic', description: 'Triangular cross-section weld joining two surfaces at right angles (symbol: right-triangle with vertical leg on left). Most common weld type. Equal or unequal legs.' },
  { keys: '[ ]', command: 'Plug / Slot Weld', category: 'basic', description: 'Weld deposited in a circular hole or elongated slot (symbol: rectangle on reference line). Hole diameter or slot width and depth specified on symbol.' },
  { keys: '⌒⌒', command: 'Surfacing Weld', category: 'basic', description: 'Weld deposited on a surface to build up dimensions, provide wear resistance, or restore worn parts (symbol: two side-by-side arcs on reference line). Also called hardfacing.' },
  { keys: '◯ with =', command: 'Seam Weld', category: 'basic', description: 'Continuous weld between overlapping members (symbol: circle traversed by two parallel lines, RSEW process in tail). Used for sheet metal joints requiring sealing.' },
  { keys: '⨂', command: 'Stud Weld', category: 'basic', description: 'Weld joining a metal stud to a workpiece (symbol: circle with an X inside, per AWS A2.4 Figure 10-34). Uses specialized equipment (SW process).' },

  // Supplementary symbols (AWS A2.4 Figure 10-2)
  { keys: '○', command: 'Weld All Around', category: 'supp', description: 'Circle at the junction of arrow and reference line. Indicates weld continues all around the joint perimeter. Used for pipe-to-plate and box section connections.' },
  { keys: '⚑', command: 'Field Weld', category: 'supp', description: 'Flag at the junction of arrow and reference line (symbol: triangular flag). Indicates weld is to be made in the field (on-site), not in the shop.' },
  { keys: '●', command: 'Melt-Through', category: 'supp', description: 'Visible root reinforcement produced in a joint welded from one side (symbol: solid shaded semicircle on the opposite side of reference line).' },
  { keys: '▭ (backing)', command: 'Backing', category: 'supp', description: 'Backing symbol (rectangle on opposite side of reference line) indicates backing material placed at the root to support molten metal.' },
  { keys: '▭ (spacer)', command: 'Spacer', category: 'supp', description: 'Spacer symbol (rectangle placed directly on reference line) indicates a spacer between weld joint members.' },
  { keys: '⌒', command: 'Convex Contour', category: 'supp', description: 'Convex contour symbol (convex arc) indicates the weld face must be convex (bulging outward). Used when additional weld metal is desired for strength.' },
  { keys: '—', command: 'Flush Contour', category: 'supp', description: 'Flush contour symbol (horizontal flat line) indicates the weld face must be flush (flat). Common for aesthetic or mating surfaces.' },
  { keys: '︶', command: 'Concave Contour', category: 'supp', description: 'Concave contour symbol (concave arc) indicates the weld face must be concave (curved inward) to minimize stress concentration at toes.' },
  { keys: 'G', command: 'Grind Finish', category: 'supp', description: 'Letter G above contour symbol specifies finishing by grinding. Used for flush contour on critical welds.' },
  { keys: 'C', command: 'Chisel Finish', category: 'supp', description: 'Letter C above contour symbol specifies finishing by chipping. Used for rough finishing of large welds.' },
  { keys: 'M', command: 'Machine Finish', category: 'supp', description: 'Letter M above contour symbol specifies finishing by machining (milling, turning, planing).' },
  { keys: 'R', command: 'Roll Finish', category: 'supp', description: 'Letter R above contour symbol specifies finishing by rolling. Used for pipe welds requiring smooth contour.' },
  { keys: 'H', command: 'Hammer Finish', category: 'supp', description: 'Letter H above contour symbol specifies finishing by hammering.' },
  { keys: 'P', command: 'Planish Finish', category: 'supp', description: 'Letter P above contour symbol specifies finishing by planishing.' },

  // Process and tail specifications (AWS A2.4 tail designations)
  { keys: 'SMAW', command: 'Shielded Metal Arc Welding', category: 'process', description: 'Stick welding. Manual process using flux-coated electrodes. No shielding gas required. Process code in tail of welding symbol.' },
  { keys: 'GMAW', command: 'Gas Metal Arc Welding', category: 'process', description: 'MIG/MAG welding. Wire-fed process with shielding gas. High deposition rate. Common in fabrication shops. Process code in tail: GMAW or MIG.' },
  { keys: 'GTAW', command: 'Gas Tungsten Arc Welding', category: 'process', description: 'TIG welding. Uses non-consumable tungsten electrode. Highest quality, lowest deposition. Used for precision welds and thin materials. Process code in tail: GTAW or TIG.' },
  { keys: 'FCAW', command: 'Flux-Cored Arc Welding', category: 'process', description: 'Similar to GMAW but uses flux-cored wire. Self-shielded or gas-shielded. High deposition rate with better penetration than GMAW. Common in construction.' },
  { keys: 'SAW', command: 'Submerged Arc Welding', category: 'process', description: 'Automatic/semi-automatic process using granular flux. Very high deposition rate. Used for thick plate welding in shipbuilding and structural fabrication.' },
  { keys: 'ESW', command: 'Electroslag Welding', category: 'process', description: 'Vertical-up process for very thick plates (25-500mm). Uses molten slag pool. Extremely high deposition. Used in heavy structural fabrication.' },
  { keys: 'SW', command: 'Stud Welding', category: 'process', description: 'Specialized process for welding studs to plates. Uses drawn-arc or capacitor-discharge method. Common in structural steel and deck construction.' },
];

const TIPS = [
  {
    title: 'Arrow side vs Other side',
    content: 'The key rule: a weld symbol placed BELOW the reference line is for the ARROW side of the joint. A symbol placed ABOVE the reference line is for the OTHER side. Symbols on BOTH sides mean the weld is on both sides of the joint. The arrow always points to the joint, not necessarily to the side being welded.',
  },
  {
    title: 'Reading the tail for process specs',
    content: 'The tail of the welding symbol (forked end) contains process specifications, reference codes, or special notes. Common entries: GTAW (TIG), GMAW (MIG), SMAW (stick), FCAW (flux-cored). If no process is specified, the contractor selects the appropriate method. A tail with no note means no special process requirement.',
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
      mode="reference"
      columnHeaders={['Symbol / Notation', 'Weld / Process Type', 'Standard Application & Notes']}
      searchPlaceholder="Search welding symbols (e.g. Fillet, V-Groove, SMAW, Field Weld)..."
    />
  );
}
