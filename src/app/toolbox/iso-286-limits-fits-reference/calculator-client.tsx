'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'fits', name: '🔧 Common Fits' },
  { id: 'it', name: '📏 IT Tolerance Grades (μm)' },
  { id: 'shaft', name: '↘️ Shaft Deviations' },
  { id: 'hole', name: '↗️ Hole Deviations' },
];

const SHORTCUTS = [
  // Common fit combinations
  { keys: 'H11/c11', command: 'Loose Running', category: 'fits', description: 'Large clearance for wide temperature variations, heavy loads, or dirty environments. Example: agricultural machinery, textile equipment.' },
  { keys: 'H9/d9', command: 'Free Running', category: 'fits', description: 'Large running clearance. Not for high precision. Example: general machinery where temperature and load vary significantly.' },
  { keys: 'H8/f7', command: 'Close Running', category: 'fits', description: 'Moderate running clearance with good accuracy. Example: electric motors, pumps, gearboxes, compressors.' },
  { keys: 'H8/g7', command: 'Sliding', category: 'fits', description: 'Very small clearance for precise sliding without rotation. Example: valve spools, machine tool slides, guiding bushes.' },
  { keys: 'H7/h6', command: 'Locational Clearance', category: 'fits', description: 'Zero to very small clearance. Freely assembled and disassembled. Example: locating pins, dowel pins, plug gauges.' },
  { keys: 'H7/k6', command: 'Locational Transition', category: 'fits', description: 'Slight interference or clearance. Accurate location with possible disassembly. Example: gears on shafts, couplings, pulleys.' },
  { keys: 'H7/n6', command: 'Locational Transition', category: 'fits', description: 'More interference than H7/k6. Accurate location, disassembly requires force. Example: bearing inner races on shafts.' },
  { keys: 'H7/p6', command: 'Locational Interference', category: 'fits', description: 'Light press fit. For parts requiring precise alignment without heavy loads. Example: bearing bushes, locating plugs.' },
  { keys: 'H7/s6', command: 'Medium Drive', category: 'fits', description: 'Medium press fit. Requires heating of hole or cooling of shaft. Semi-permanent assembly. Example: gear wheels, bearing races.' },
  { keys: 'H7/u6', command: 'Force Fit', category: 'fits', description: 'Heavy press fit. Permanent assembly — disassembly may damage parts. Example: turbine wheels, heavy-duty couplings, locomotive wheels.' },

  // IT tolerance grades (μm) for common size ranges
  { keys: 'IT5', command: '≤3mm: 4μm · 3-6: 5μm · 6-10: 6μm · 10-18: 8μm · 18-30: 9μm · 30-50: 11μm', category: 'it', description: 'Used for high-precision measuring tools, gauges, and very accurate machine parts. Equivalent to grades for precision grinding.' },
  { keys: 'IT6', command: '≤3mm: 6μm · 3-6: 8μm · 6-10: 9μm · 10-18: 11μm · 18-30: 13μm · 30-50: 16μm', category: 'it', description: 'Most common grade for machine parts. Used for bearings, gears, and fits requiring good accuracy. H7/h6 fit uses IT7 hole + IT6 shaft.' },
  { keys: 'IT7', command: '≤3mm: 10μm · 3-6: 12μm · 6-10: 15μm · 10-18: 18μm · 18-30: 21μm · 30-50: 25μm', category: 'it', description: 'Standard hole basis grade. Used for general machine fits, bearing housings, and mating parts with moderate accuracy requirements.' },
  { keys: 'IT8', command: '≤3mm: 14μm · 3-6: 18μm · 6-10: 22μm · 10-18: 27μm · 18-30: 33μm · 30-50: 39μm', category: 'it', description: 'Used for free-running fits and less critical mating parts. Suitable for agricultural and general engineering applications.' },
  { keys: 'IT9', command: '≤3mm: 25μm · 3-6: 30μm · 6-10: 36μm · 10-18: 43μm · 18-30: 52μm · 30-50: 62μm', category: 'it', description: 'Rougher tolerance for non-critical dimensions. Used for structural parts, housings, and components where fit is not critical.' },
  { keys: 'IT10', command: '≤3mm: 40μm · 3-6: 48μm · 6-10: 58μm · 10-18: 70μm · 18-30: 84μm · 30-50: 100μm', category: 'it', description: 'Used for loose fits, stamped parts, and rough machined components. Common in sheet metal and structural fabrication.' },
  { keys: 'IT11', command: '≤3mm: 60μm · 3-6: 75μm · 6-10: 90μm · 10-18: 110μm · 18-30: 130μm · 30-50: 160μm', category: 'it', description: 'Wide tolerance for rough fits. Used with H11/c11 loose running fit. Common in castings and rough-machined parts.' },

  // Shaft fundamental deviations (lowercase letters)
  { keys: 'a, b', command: 'Shaft: Large Clearance', category: 'shaft', description: 'Upper deviation below zero line by large amount. Creates very loose clearance fits with H holes. Rarely used for precision.' },
  { keys: 'c', command: 'Shaft: Large Clearance', category: 'shaft', description: 'Upper deviation below zero. Used for loose running fits (H11/c11). Suitable for dirty environments and thermal expansion.' },
  { keys: 'd', command: 'Shaft: Free Running', category: 'shaft', description: 'Upper deviation below zero. Used for free running fits (H9/d9). Good for general machinery with moderate speed.' },
  { keys: 'e', command: 'Shaft: Running', category: 'shaft', description: 'Upper deviation below zero. Used for running fits (H8/e8). Common in bearings and rotating assemblies.' },
  { keys: 'f', command: 'Shaft: Close Running', category: 'shaft', description: 'Upper deviation below zero. Used for close running fits (H8/f7). Standard for electric motor bearings.' },
  { keys: 'g', command: 'Shaft: Sliding', category: 'shaft', description: 'Upper deviation slightly below zero. Used for sliding fits (H8/g7). Precise sliding without rotation.' },
  { keys: 'h', command: 'Shaft: Reference (Zero)', category: 'shaft', description: 'Upper deviation at zero line. The reference shaft for hole-basis system. Creates clearance or transition fits depending on IT grade.' },
  { keys: 'j, js', command: 'Shaft: Transition', category: 'shaft', description: 'Deviations straddle the zero line symmetrically (js) or slightly positive (j). Creates transition fits with H holes.' },
  { keys: 'k', command: 'Shaft: Transition', category: 'shaft', description: 'Lower deviation slightly above zero. Creates transition fit with H7 (H7/k6). Accurate location, removable.' },
  { keys: 'm, n', command: 'Shaft: Transition', category: 'shaft', description: 'Lower deviation above zero. Creates transition to light interference fits. More accurate location than k.' },
  { keys: 'p', command: 'Shaft: Interference', category: 'shaft', description: 'Lower deviation above zero. Creates light interference fit with H7 (H7/p6). Press fit for bushes and bearings.' },
  { keys: 'r', command: 'Shaft: Interference', category: 'shaft', description: 'Lower deviation above zero. Medium interference. Used for permanent assemblies with moderate torque transmission.' },
  { keys: 's', command: 'Shaft: Medium Drive', category: 'shaft', description: 'Lower deviation above zero. Creates medium drive fit (H7/s6). Requires thermal assembly. Semi-permanent.' },
  { keys: 't, u', command: 'Shaft: Force Fit', category: 'shaft', description: 'Lower deviation well above zero. Heavy interference. Permanent assembly — disassembly risks damage. Used for wheels and heavy couplings.' },
  { keys: 'v, x, y, z, za, zb, zc', command: 'Shaft: Heavy Force', category: 'shaft', description: 'Very large interference. Used for extremely permanent assemblies. Assembly by heating hole or cooling shaft with liquid nitrogen.' },

  // Hole fundamental deviations (uppercase letters)
  { keys: 'H', command: 'Hole: Reference (Zero)', category: 'hole', description: 'Lower deviation at zero line. The reference hole for hole-basis fits. Most common system — reamer/hole tolerance is harder to change than shaft.' },
  { keys: 'G', command: 'Hole: Sliding', category: 'hole', description: 'Lower deviation slightly above zero. Creates sliding fit with h shaft (G7/h6). Used for precise sliding.' },
  { keys: 'F', command: 'Hole: Close Running', category: 'hole', description: 'Lower deviation above zero. Creates close running fit with h shaft (F8/h7). Alternative to H8/f7 for shaft-basis system.' },
  { keys: 'E, D', command: 'Hole: Free Running', category: 'hole', description: 'Lower deviation above zero. Creates free running fits. Used in shaft-basis system for general machinery.' },
  { keys: 'K', command: 'Hole: Transition', category: 'hole', description: 'Deviations straddle zero. Creates transition fit with h6 shaft (K7/h6). Equivalent to H7/k6 in hole-basis.' },
  { keys: 'N', command: 'Hole: Transition', category: 'hole', description: 'Upper deviation below zero. Creates transition to interference fit with h6 shaft (N7/h6).' },
  { keys: 'P', command: 'Hole: Interference', category: 'hole', description: 'Upper deviation below zero. Creates interference fit with h6 shaft (P7/h6). Equivalent to H7/p6 in hole-basis.' },
];

const TIPS = [
  {
    title: 'Hole-basis vs Shaft-basis system',
    content: 'The hole-basis system (H holes) is preferred because hole tolerances are harder to adjust — they require reamers or boring bars. The shaft-basis system (h shafts) is used when a standard shaft diameter must be maintained, e.g., with bought-in shafting or when multiple parts mount on one shaft.'
  },
  {
    title: 'Reading a fit specification',
    content: 'A fit like Ø50 H7/g6 means: 50mm basic size, hole tolerance = H7 (lower deviation 0, upper deviation +25μm for IT7 at 30-50mm), shaft tolerance = g6 (upper deviation -9μm, lower deviation -25μm for g6 at 30-50mm). Maximum clearance = 25+25 = 50μm, minimum clearance = 0+9 = 9μm.'
  },
];

export default function Iso286ReferenceClient() {
  return (
    <ShortcutCheatsheetClient
      title="ISO 286 Limits & Fits"
      subtitle="Searchable ISO 286-1/2 reference: IT tolerance grades, fundamental deviations, and common fit combinations."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
