'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'symbols', name: '🔣 ISO 1302 Symbols' },
  { id: 'ra', name: '📏 Ra Values & Processes' },
  { id: 'rz', name: '📏 Rz Values' },
  { id: 'apps', name: '🏭 Typical Applications' },
];

const SHORTCUTS = [
  // ISO 1302 symbols
  { keys: '✓', command: 'Material Removal Required', category: 'symbols', description: 'Basic symbol with check mark. Indicates material must be removed (machining) to achieve the surface. Most common symbol on engineering drawings.' },
  { keys: '✓̅', command: 'Material Removal Prohibited', category: 'symbols', description: 'Circle inside the check mark. Indicates no material may be removed — surface is to remain as-is (cast, forged, etc.). Used on as-cast or as-forged surfaces.' },
  { keys: '✓', command: 'Material Removal Permitted', category: 'symbols', description: 'Basic triangle symbol without check mark. Default — any manufacturing method is allowed to achieve the specified roughness.' },
  { keys: '✓ =', command: 'Surface Lay Parallel', category: 'symbols', description: 'Equal sign added to symbol. Indicates surface lay (direction of predominant texture) is parallel to the plane of projection. Common for turned surfaces.' },
  { keys: '✓ ⊥', command: 'Surface Lay Perpendicular', category: 'symbols', description: 'Perpendicular symbol added. Indicates lay is perpendicular to the plane of projection. Common for surfaces machined with a perpendicular pass.' },
  { keys: '✓ ×', command: 'Surface Lay Crossed', category: 'symbols', description: 'X symbol added. Indicates lay is crossed in two directions. Common for lapped or super-finished surfaces with multidirectional marks.' },
  { keys: '✓ M', command: 'Surface Lay Multidirectional', category: 'symbols', description: 'M symbol added. Indicates lay is multidirectional. Common for surfaces finished by processes that produce random or multi-directional marks.' },
  { keys: '✓ C', command: 'Surface Lay Circular', category: 'symbols', description: 'C symbol added. Indicates lay is approximately circular relative to the center of the surface. Common for faced surfaces on a lathe.' },
  { keys: '✓ R', command: 'Surface Lay Radial', category: 'symbols', description: 'R symbol added. Indicates lay is approximately radial relative to the center. Common for ground or turned radii.' },
  { keys: '✓ P', command: 'Surface Lay Particulate', category: 'symbols', description: 'P symbol added. Indicates lay is particulate or non-directional. Common for EDM, shot-peened, or sandblasted surfaces.' },

  // Ra values and manufacturing processes
  { keys: 'Ra 0.012', command: 'Super Precision', category: 'ra', description: 'Achieved by: lapping, super-finishing. Used for gauge blocks, optical surfaces, precision measuring instruments. Most expensive surface finish.' },
  { keys: 'Ra 0.025', command: 'Ultra Fine', category: 'ra', description: 'Achieved by: lapping, honing, super-finishing. Used for precision bearings, hydraulic valve spools, optical components.' },
  { keys: 'Ra 0.05', command: 'Very Fine', category: 'ra', description: 'Achieved by: honing, fine lapping, polishing. Used for bearing surfaces, hydraulic cylinders, precision guides.' },
  { keys: 'Ra 0.1', command: 'Fine Polished', category: 'ra', description: 'Achieved by: honing, fine grinding, polishing. Used for hydraulic cylinder bores, bearing journals, precision guides.' },
  { keys: 'Ra 0.2', command: 'Fine Grind', category: 'ra', description: 'Achieved by: fine grinding, honing. Used for precision bearings, seal surfaces, gauge surfaces, sliding contacts.' },
  { keys: 'Ra 0.4', command: 'Grinding', category: 'ra', description: 'Achieved by: grinding, fine turning, broaching. Used for bearing surfaces, shaft journals, precision sliding surfaces. Common for mating parts.' },
  { keys: 'Ra 0.8', command: 'Standard Machined', category: 'ra', description: 'Achieved by: grinding, milling, turning, broaching. Most common specified finish for general machine parts. Used for mating surfaces, seal surfaces.' },
  { keys: 'Ra 1.6', command: 'Standard', category: 'ra', description: 'Achieved by: milling, turning, reaming, broaching. Standard finish for most machined parts. Used for non-critical mating surfaces and general components.' },
  { keys: 'Ra 3.2', command: 'Rough Machined', category: 'ra', description: 'Achieved by: milling, turning, drilling. Used for non-mating surfaces, bracket faces, general purpose surfaces. Most economical machined finish.' },
  { keys: 'Ra 6.3', command: 'Coarse Machined', category: 'ra', description: 'Achieved by: rough milling, rough turning, sawing. Used for non-critical surfaces, internal bores, rough brackets. Very economical.' },
  { keys: 'Ra 12.5', command: 'Very Rough', category: 'ra', description: 'Achieved by: rough turning, milling, planing. Used for rough non-functional surfaces. Common for first-operation machining.' },
  { keys: 'Ra 25', command: 'As-Cast / Flame Cut', category: 'ra', description: 'Achieved by: flame cutting, rough casting, forging. Used for structural surfaces, weld preparations, non-machined surfaces.' },
  { keys: 'Ra 50+', command: 'Raw Surface', category: 'ra', description: 'As-cast, as-forged, or flame-cut surfaces. No machining. Used for structural steel, castings, and forgings where surface finish is not critical.' },

  // Rz values (10-point height)
  { keys: 'Rz 0.16', command: 'Equivalent Ra 0.025', category: 'rz', description: 'Rz ≈ 5-10× Ra depending on process. Rz 0.16μm corresponds to ultra-fine lapping. Used in precision optics and gauge blocks.' },
  { keys: 'Rz 0.8', command: 'Equivalent Ra 0.1-0.2', category: 'rz', description: 'Rz 0.8μm corresponds to fine grinding/honing. Used for bearing races and precision sliding surfaces.' },
  { keys: 'Rz 3.2', command: 'Equivalent Ra 0.4-0.8', category: 'rz', description: 'Rz 3.2μm corresponds to ground or fine machined surfaces. Common for precision machine parts.' },
  { keys: 'Rz 6.3', command: 'Equivalent Ra 1.6', category: 'rz', description: 'Rz 6.3μm corresponds to standard machined surfaces. Most commonly specified Rz value in European drawings.' },
  { keys: 'Rz 16', command: 'Equivalent Ra 3.2', category: 'rz', description: 'Rz 16μm corresponds to rough machined surfaces. Used for non-critical machined parts.' },
  { keys: 'Rz 25', command: 'Equivalent Ra 6.3', category: 'rz', description: 'Rz 25μm corresponds to coarse machined surfaces. Used for rough operations and non-functional surfaces.' },
  { keys: 'Rz 100', command: 'Equivalent Ra 25', category: 'rz', description: 'Rz 100μm corresponds to as-cast or flame-cut surfaces. Used for structural and raw surfaces.' },

  // Typical applications
  { keys: 'Ra 0.4', command: 'Bearing Journals', category: 'apps', description: 'Bearing journals and shaft seats for rolling element bearings. Requires fine grinding. Tolerance grade IT5 or better.' },
  { keys: 'Ra 0.8', command: 'Seal Surfaces', category: 'apps', description: 'O-ring grooves, hydraulic seal surfaces, and gasket faces. Requires ground or fine turned finish to prevent leakage.' },
  { keys: 'Ra 0.8', command: 'Mating Surfaces', category: 'apps', description: 'Surface for precision mating parts — dowel pins, locating surfaces, precision fits. Requires grinding or fine milling.' },
  { keys: 'Ra 1.6', command: 'General Machined', category: 'apps', description: 'Default surface finish for most machined parts. Non-critical mating surfaces, bracket faces, housing bores.' },
  { keys: 'Ra 3.2', command: 'Non-Mating', category: 'apps', description: 'Non-mating machined surfaces. External surfaces, visible but non-functional faces. Most economical finish for general use.' },
  { keys: 'Ra 6.3', command: 'Internal Bores', category: 'apps', description: 'Non-critical internal bores, rough drilled holes, and non-functional surfaces. Used where sealing or mating is not required.' },
  { keys: 'Ra 12.5', command: 'Structural', category: 'apps', description: 'Structural and non-functional surfaces. Rough machined faces, bracket mounting surfaces, and first-operation surfaces.' },
  { keys: 'Ra 25', command: 'As-Cast/Forged', category: 'apps', description: 'Unmachined surfaces on castings and forgings. Structural surfaces, weld prep areas, and non-functional external surfaces.' },
];

const TIPS = [
  {
    title: 'Ra vs Rz — which to specify?',
    content: 'Ra (arithmetic mean) is the most common parameter in North America and Asia. Rz (10-point height) is preferred in Germany and parts of Europe. Rz is typically 5-10× Ra for the same surface. When converting: Ra 0.8 ≈ Rz 4-6, Ra 1.6 ≈ Rz 6-10, Ra 3.2 ≈ Rz 12-20. Always specify which parameter you are using on drawings.'
  },
  {
    title: 'Cost impact of surface finish',
    content: 'Surface finish cost increases exponentially with tighter Ra values. Ra 3.2 (rough machined) costs roughly 1×, Ra 0.8 (ground) costs 3-5×, and Ra 0.025 (lapped) costs 20-50×. Always specify the roughest acceptable finish — over-specifying is one of the most common and expensive mistakes in engineering drawings.'
  },
];

export default function SurfaceRoughnessClient() {
  return (
    <ShortcutCheatsheetClient
      title="Surface Roughness"
      subtitle="ISO 1302 surface texture symbols, Ra/Rz standard values, manufacturing process capabilities, and typical applications."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
