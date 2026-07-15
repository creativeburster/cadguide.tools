'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'linear', name: '📏 Linear Tolerances' },
  { id: 'angular', name: '📐 Angular Tolerances' },
  { id: 'geo', name: '⫶ Geometrical Tolerances' },
  { id: 'usage', name: '💡 Usage Guide' },
];

const SHORTCUTS = [
  // Linear tolerances (ISO 2768-1) — per size range, per class
  { keys: '0.5–3mm', command: 'f: ±0.05 · m: ±0.1 · c: ±0.2 · v: ±0.5', category: 'linear', description: 'Smallest dimension range. Fine class ±0.05mm for precision parts. Medium ±0.1mm is the default for most drawings. Coarse ±0.2mm for non-critical features.' },
  { keys: '3–6mm', command: 'f: ±0.05 · m: ±0.1 · c: ±0.3 · v: ±0.8', category: 'linear', description: 'Small dimensions. Fine and medium remain the same as 0.5-3mm. Coarse increases to ±0.3mm. Very coarse ±0.8mm for rough castings.' },
  { keys: '6–30mm', command: 'f: ±0.1 · m: ±0.2 · c: ±0.5 · v: ±1.2', category: 'linear', description: 'Common range for most machined parts. Medium ±0.2mm is standard for general engineering. Fine ±0.1mm for precision fits.' },
  { keys: '30–120mm', command: 'f: ±0.15 · m: ±0.3 · c: ±0.8 · v: ±2.0', category: 'linear', description: 'Medium size range. Medium ±0.3mm covers most general machinery. Fine ±0.15mm for precision components. Coarse ±0.8mm for structural parts.' },
  { keys: '120–400mm', command: 'f: ±0.2 · m: ±0.5 · c: ±1.2 · v: ±3.0', category: 'linear', description: 'Large dimensions. Medium ±0.5mm standard for large machined parts. Coarse ±1.2mm for structural and welded fabrications.' },
  { keys: '400–1000mm', command: 'f: ±0.3 · m: ±0.8 · c: ±2.0 · v: ±4.0', category: 'linear', description: 'Very large dimensions. Medium ±0.8mm for large fabrications. Coarse ±2.0mm for structural steel. Very coarse ±4.0mm for large castings.' },
  { keys: '1000–2000mm', command: 'f: ±0.5 · m: ±1.2 · c: ±3.0 · v: ±6.0', category: 'linear', description: 'Extra large dimensions. Fine ±0.5mm rarely used at this scale. Medium ±1.2mm for large precision fabrications. Coarse ±3.0mm for structural.' },
  { keys: '2000–4000mm', command: 'f: — · m: ±2.0 · c: ±4.0 · v: ±8.0', category: 'linear', description: 'Largest range covered by ISO 2768. Fine class not defined. Medium ±2.0mm for large welded structures. Very coarse ±8.0mm for very large castings.' },

  // Angular tolerances (ISO 2768-1)
  { keys: '≤10°', command: 'f: ±1° · m: ±1° · c: ±1°30′ · v: ±3°', category: 'angular', description: 'Small angles up to 10°. Fine and medium both ±1°. Coarse ±1°30′. Very coarse ±3° for rough angular features.' },
  { keys: '10–50°', command: 'f: ±0°30′ · m: ±0°30′ · c: ±1° · v: ±2°', category: 'angular', description: 'Medium angles. Fine and medium ±0°30′. Coarse ±1°. Very coarse ±2°. Applied to angles on drawings without individual tolerance.' },
  { keys: '50–120°', command: 'f: ±0°20′ · m: ±0°20′ · c: ±0°30′ · v: ±1°', category: 'angular', description: 'Large angles. Fine and medium ±0°20′. Coarse ±0°30′. Very coarse ±1°. Common for chamfers and bevels.' },
  { keys: '120–400°', command: 'f: ±0°10′ · m: ±0°10′ · c: ±0°15′ · v: ±0°30′', category: 'angular', description: 'Very large angles (reflex). Fine and medium ±0°10′. Coarse ±0°15′. Very coarse ±0°30′. Rare in practice.' },
  { keys: 'Length ≤10mm', command: 'f: ±1° · m: ±1° · c: ±1°30′ · v: ±3°', category: 'angular', description: 'Angular tolerance depends on the shorter side length of the angle. For short sides ≤10mm, tolerances are wider due to measurement difficulty.' },
  { keys: 'Length 10–50mm', command: 'f: ±0°30′ · m: ±0°30′ · c: ±1° · v: ±2°', category: 'angular', description: 'For angle sides 10-50mm. Medium ±0°30′ is standard for chamfers and bevels on typical machined parts.' },
  { keys: 'Length 50–120mm', command: 'f: ±0°20′ · m: ±0°20′ · c: ±0°30′ · v: ±1°', category: 'angular', description: 'For angle sides 50-120mm. Medium ±0°20′ for general engineering. Fine ±0°20′ same as medium.' },
  { keys: 'Length 120–400mm', command: 'f: ±0°10′ · m: ±0°10′ · c: ±0°15′ · v: ±0°30′', category: 'angular', description: 'For angle sides 120-400mm. Tolerances tighten with longer sides because angular error translates to larger linear deviation.' },

  // Geometrical tolerances (ISO 2768-2)
  { keys: 'Flatness ≤100mm', command: 'f: 0.02 · m: 0.05 · c: 0.1 · v: 0.2', category: 'geo', description: 'Flatness tolerance for surfaces up to 100mm. Values in mm. Fine 0.02mm for precision ground surfaces. Medium 0.05mm for general machined faces.' },
  { keys: 'Flatness 100–300mm', command: 'f: 0.05 · m: 0.1 · c: 0.2 · v: 0.5', category: 'geo', description: 'Flatness for 100-300mm surfaces. Medium 0.1mm standard for machined mounting surfaces. Coarse 0.2mm for non-critical faces.' },
  { keys: 'Flatness 300–1000mm', command: 'f: 0.1 · m: 0.2 · c: 0.4 · v: 0.8', category: 'geo', description: 'Flatness for 300-1000mm surfaces. Medium 0.2mm for large machine bases. Coarse 0.4mm for structural mounting surfaces.' },
  { keys: 'Straightness ≤100mm', command: 'f: 0.02 · m: 0.05 · c: 0.1 · v: 0.2', category: 'geo', description: 'Straightness for edges/lines up to 100mm. Same values as flatness. Fine 0.02mm for precision guides. Medium 0.05mm for general edges.' },
  { keys: 'Straightness 100–300mm', command: 'f: 0.05 · m: 0.1 · c: 0.2 · v: 0.5', category: 'geo', description: 'Straightness for 100-300mm. Medium 0.1mm for general machined edges. Coarse 0.2mm for non-critical features.' },
  { keys: 'Perpendicularity ≤100mm', command: 'f: 0.05 · m: 0.1 · c: 0.2 · v: 0.5', category: 'geo', description: 'Perpendicularity for features up to 100mm. Medium 0.1mm for general machined corners. Fine 0.05mm for precision square features.' },
  { keys: 'Perpendicularity 100–300mm', command: 'f: 0.1 · m: 0.2 · c: 0.4 · v: 0.8', category: 'geo', description: 'Perpendicularity for 100-300mm. Medium 0.2mm for standard machined brackets. Coarse 0.4mm for structural brackets.' },
  { keys: 'Symmetry ≤100mm', command: 'f: 0.05 · m: 0.1 · c: 0.2 · v: 0.5', category: 'geo', description: 'Symmetry tolerance for features up to 100mm. Medium 0.1mm for general symmetric features. Fine 0.05mm for precision.' },
  { keys: 'Circular runout ≤100mm', command: 'f: 0.02 · m: 0.05 · c: 0.1 · v: 0.2', category: 'geo', description: 'Circular runout for diameters up to 100mm. Fine 0.02mm for precision shafts. Medium 0.05mm for general rotating parts.' },
  { keys: 'Circular runout 100–300mm', command: 'f: 0.05 · m: 0.1 · c: 0.2 · v: 0.5', category: 'geo', description: 'Circular runout for 100-300mm diameters. Medium 0.1mm for general shafts and journals. Coarse 0.2mm for non-critical rotations.' },

  // Usage guide
  { keys: 'Drawing indication', command: 'ISO 2768-mK', category: 'usage', description: 'General tolerance class indicated in title block or near drawing. Format: ISO 2768-mK where m = linear/angular class (f/m/c/v) and K = geometrical class (A/B/C/D). Example: ISO 2768-mK means medium linear + class K geometrical.' },
  { keys: 'Class A (geo)', command: 'Geometrical — Fine', category: 'usage', description: 'ISO 2768-2 geometrical class A corresponds to fine tolerances. Used for precision instruments and measuring equipment. Equivalent to f class for linear.' },
  { keys: 'Class B (geo)', command: 'Geometrical — Medium', category: 'usage', description: 'ISO 2768-2 geometrical class B corresponds to medium tolerances. Default for general engineering. Equivalent to m class for linear.' },
  { keys: 'Class C (geo)', command: 'Geometrical — Coarse', category: 'usage', description: 'ISO 2768-2 geometrical class C corresponds to coarse tolerances. Used for structural and non-critical parts. Equivalent to c class for linear.' },
  { keys: 'Class D (geo)', command: 'Geometrical — Very Coarse', category: 'usage', description: 'ISO 2768-2 geometrical class D corresponds to very coarse tolerances. Used for castings, forgings, and rough fabrications. Equivalent to v class for linear.' },
  { keys: 'When to specify', command: 'Individual > General', category: 'usage', description: 'General tolerances apply ONLY when no individual tolerance is indicated. If a dimension has its own tolerance (e.g., 50±0.01), the individual tolerance takes precedence. General tolerances cover the rest.' },
  { keys: 'New vs old', command: 'ISO 2768 replaces DIN 7168', category: 'usage', description: 'ISO 2768 superseded DIN 7168. The old German standard used the same f/m/c/g classes (g = very coarse, now v in ISO). Many European drawings still reference DIN 7168 — values are identical.' },
];

const TIPS = [
  {
    title: 'Medium (m) is the default — don\'t over-specify',
    content: 'ISO 2768-m is the most common general tolerance class. It covers the vast majority of machined parts. Only use fine (f) when precision is truly required — it increases cost significantly. Coarse (c) is appropriate for structural and non-critical features. Always indicate the class in the drawing title block.'
  },
  {
    title: 'General tolerances reduce drawing clutter',
    content: 'The purpose of ISO 2768 is to avoid specifying tolerances on every dimension. Only dimensions that need tighter or different tolerances get individual indications. All other dimensions are covered by the general tolerance class in the title block. This makes drawings cleaner and easier to read. Example: title block says "ISO 2768-mK", a dimension marked 50 is ±0.3mm, but 50±0.01 overrides to the tighter tolerance.'
  },
];

export default function Iso2768ReferenceClient() {
  return (
    <ShortcutCheatsheetClient
      title="ISO 2768 General Tolerances"
      subtitle="ISO 2768-1/2 general tolerances for linear dimensions, angular dimensions, and geometrical tolerances across four accuracy classes."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
