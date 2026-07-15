'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'coarse', name: '🔩 Coarse Pitch (M)' },
  { id: 'fine', name: '🔩 Fine Pitch (MF)' },
  { id: 'clearance', name: '⭕ Clearance Holes' },
  { id: 'data', name: '📐 Thread Specs' },
];

const SHORTCUTS = [
  // Coarse pitch threads (M = metric coarse)
  { keys: 'M1.6', command: 'Pitch 0.35 · Tap Ø 1.25mm', category: 'coarse', description: 'Smallest standard metric thread. Used in miniature instruments and electronics. Tap drill: 1.25mm (#55 drill approx).' },
  { keys: 'M2', command: 'Pitch 0.4 · Tap Ø 1.6mm', category: 'coarse', description: 'Small precision thread. Used in electronics, optical instruments, and model making. Tap drill: 1.6mm (#52 drill).' },
  { keys: 'M2.5', command: 'Pitch 0.45 · Tap Ø 2.05mm', category: 'coarse', description: 'Common in electronics and small assemblies. Tap drill: 2.05mm (#46 drill approx).' },
  { keys: 'M3', command: 'Pitch 0.5 · Tap Ø 2.5mm', category: 'coarse', description: 'Very common small thread. Used in electronics, brackets, and general hardware. Tap drill: 2.5mm (#39 drill). 75% thread engagement.' },
  { keys: 'M4', command: 'Pitch 0.7 · Tap Ø 3.3mm', category: 'coarse', description: 'Common in consumer products and light machinery. Tap drill: 3.3mm (#30 drill). 75% thread engagement.' },
  { keys: 'M5', command: 'Pitch 0.8 · Tap Ø 4.2mm', category: 'coarse', description: 'Widely used in automotive, electronics, and general engineering. Tap drill: 4.2mm (#19 drill). 75% thread engagement.' },
  { keys: 'M6', command: 'Pitch 1.0 · Tap Ø 5.0mm', category: 'coarse', description: 'Most common metric thread. Used everywhere in machinery, automotive, and construction. Tap drill: 5.0mm (#9 drill or 5mm). 75% thread engagement.' },
  { keys: 'M8', command: 'Pitch 1.25 · Tap Ø 6.8mm', category: 'coarse', description: 'Standard for medium-duty fastening. Used in furniture, machinery, automotive. Tap drill: 6.8mm (#H drill). 75% thread engagement.' },
  { keys: 'M10', command: 'Pitch 1.5 · Tap Ø 8.5mm', category: 'coarse', description: 'Common structural and machinery thread. Tap drill: 8.5mm (Q drill). 75% thread engagement.' },
  { keys: 'M12', command: 'Pitch 1.75 · Tap Ø 10.2mm', category: 'coarse', description: 'Heavy-duty fastening for structural and automotive applications. Tap drill: 10.2mm (#X drill or 10.2mm).' },
  { keys: 'M14', command: 'Pitch 2.0 · Tap Ø 12.0mm', category: 'coarse', description: 'Used in automotive and heavy machinery. Tap drill: 12.0mm. Note: M14 is less common than M12/M16.' },
  { keys: 'M16', command: 'Pitch 2.0 · Tap Ø 14.0mm', category: 'coarse', description: 'Major structural and machinery fastening. Tap drill: 14.0mm. Very common in construction equipment.' },
  { keys: 'M20', command: 'Pitch 2.5 · Tap Ø 17.5mm', category: 'coarse', description: 'Heavy structural fastening. Used in construction, bridges, heavy machinery. Tap drill: 17.5mm.' },
  { keys: 'M24', command: 'Pitch 3.0 · Tap Ø 21.0mm', category: 'coarse', description: 'Very heavy-duty fastening. Used in large structures and equipment. Tap drill: 21.0mm.' },
  { keys: 'M30', command: 'Pitch 3.5 · Tap Ø 26.5mm', category: 'coarse', description: 'Extra heavy-duty. Used in heavy machinery, pressure vessels, and structural connections. Tap drill: 26.5mm.' },
  { keys: 'M36', command: 'Pitch 4.0 · Tap Ø 32.0mm', category: 'coarse', description: 'Large structural fastening. Used in heavy construction and mining equipment. Tap drill: 32.0mm.' },
  { keys: 'M42', command: 'Pitch 4.5 · Tap Ø 37.5mm', category: 'coarse', description: 'Very large fastening for heavy industrial applications. Tap drill: 37.5mm.' },
  { keys: 'M48', command: 'Pitch 5.0 · Tap Ø 43.0mm', category: 'coarse', description: 'Largest commonly referenced metric coarse thread. Used in major structural connections. Tap drill: 43.0mm.' },

  // Fine pitch threads (MF = metric fine)
  { keys: 'M8×1.0', command: 'Fine · Tap Ø 7.0mm', category: 'fine', description: 'Fine pitch M8. Used where finer adjustment or better sealing needed. Common in hydraulic fittings and precision instruments.' },
  { keys: 'M10×1.25', command: 'Fine · Tap Ø 8.8mm', category: 'fine', description: 'Fine pitch M10. Used in automotive spark plugs, hydraulic fittings, and precision assemblies. Tap drill: 8.8mm.' },
  { keys: 'M10×1.0', command: 'Fine · Tap Ø 9.0mm', category: 'fine', description: 'Extra fine M10. Used in optical instruments and measuring equipment. Tap drill: 9.0mm.' },
  { keys: 'M12×1.5', command: 'Fine · Tap Ø 10.5mm', category: 'fine', description: 'Fine pitch M12. Common in hydraulic systems and automotive applications. Tap drill: 10.5mm.' },
  { keys: 'M12×1.25', command: 'Fine · Tap Ø 10.8mm', category: 'fine', description: 'Extra fine M12. Used in precision instruments and spark plug threads. Tap drill: 10.8mm.' },
  { keys: 'M16×1.5', command: 'Fine · Tap Ø 14.5mm', category: 'fine', description: 'Fine pitch M16. Very common in hydraulic fittings and automotive wheel studs. Tap drill: 14.5mm.' },
  { keys: 'M20×1.5', command: 'Fine · Tap Ø 18.5mm', category: 'fine', description: 'Fine pitch M20. Standard for hydraulic fittings and high-pressure connections. Tap drill: 18.5mm.' },
  { keys: 'M20×2.0', command: 'Fine · Tap Ø 18.0mm', category: 'fine', description: 'Medium fine M20. Used in heavy machinery where both strength and precision needed. Tap drill: 18.0mm.' },
  { keys: 'M24×2.0', command: 'Fine · Tap Ø 22.0mm', category: 'fine', description: 'Fine pitch M24. Used in heavy hydraulic systems and large precision assemblies. Tap drill: 22.0mm.' },
  { keys: 'M30×2.0', command: 'Fine · Tap Ø 28.0mm', category: 'fine', description: 'Fine pitch M30. Common in high-pressure hydraulic fittings and aerospace. Tap drill: 28.0mm.' },

  // Clearance holes
  { keys: 'M3 Close', command: 'Ø 3.2mm', category: 'clearance', description: 'Close fit clearance hole for M3 bolt. Used where precise alignment is required. ISO 273 fit: close.' },
  { keys: 'M3 Normal', command: 'Ø 3.4mm', category: 'clearance', description: 'Normal fit clearance hole for M3 bolt. Standard clearance for general applications. ISO 273 fit: medium.' },
  { keys: 'M4 Close', command: 'Ø 4.3mm', category: 'clearance', description: 'Close fit clearance hole for M4 bolt. ISO 273 fit: close.' },
  { keys: 'M4 Normal', command: 'Ø 4.5mm', category: 'clearance', description: 'Normal fit clearance hole for M4 bolt. ISO 273 fit: medium.' },
  { keys: 'M5 Close', command: 'Ø 5.3mm', category: 'clearance', description: 'Close fit clearance hole for M5 bolt. ISO 273 fit: close.' },
  { keys: 'M5 Normal', command: 'Ø 5.5mm', category: 'clearance', description: 'Normal fit clearance hole for M5 bolt. ISO 273 fit: medium.' },
  { keys: 'M6 Close', command: 'Ø 6.4mm', category: 'clearance', description: 'Close fit clearance hole for M6 bolt. Used where alignment matters. ISO 273 fit: close.' },
  { keys: 'M6 Normal', command: 'Ø 6.6mm', category: 'clearance', description: 'Normal fit clearance hole for M6 bolt. Most common clearance for M6. ISO 273 fit: medium.' },
  { keys: 'M8 Close', command: 'Ø 8.4mm', category: 'clearance', description: 'Close fit clearance hole for M8 bolt. ISO 273 fit: close.' },
  { keys: 'M8 Normal', command: 'Ø 9.0mm', category: 'clearance', description: 'Normal fit clearance hole for M8 bolt. ISO 273 fit: medium.' },
  { keys: 'M10 Close', command: 'Ø 10.5mm', category: 'clearance', description: 'Close fit clearance hole for M10 bolt. ISO 273 fit: close.' },
  { keys: 'M10 Normal', command: 'Ø 11.0mm', category: 'clearance', description: 'Normal fit clearance hole for M10 bolt. ISO 273 fit: medium.' },
  { keys: 'M12 Close', command: 'Ø 13.0mm', category: 'clearance', description: 'Close fit clearance hole for M12 bolt. ISO 273 fit: close.' },
  { keys: 'M12 Normal', command: 'Ø 13.5mm', category: 'clearance', description: 'Normal fit clearance hole for M12 bolt. ISO 273 fit: medium.' },
  { keys: 'M16 Close', command: 'Ø 17.0mm', category: 'clearance', description: 'Close fit clearance hole for M16 bolt. ISO 273 fit: close.' },
  { keys: 'M16 Normal', command: 'Ø 17.5mm', category: 'clearance', description: 'Normal fit clearance hole for M16 bolt. ISO 273 fit: medium.' },
  { keys: 'M20 Close', command: 'Ø 21.0mm', category: 'clearance', description: 'Close fit clearance hole for M20 bolt. ISO 273 fit: close.' },
  { keys: 'M20 Normal', command: 'Ø 22.0mm', category: 'clearance', description: 'Normal fit clearance hole for M20 bolt. ISO 273 fit: medium.' },

  // Thread specifications
  { keys: 'Thread Class 6H', command: 'Hole Tolerance', category: 'data', description: 'Standard internal thread tolerance for general applications. Used with 6g external thread for normal fits. ISO 965-1.' },
  { keys: 'Thread Class 6g', command: 'Shaft Tolerance', category: 'data', description: 'Standard external thread tolerance. Default for most commercial metric bolts. Provides 6μm plating allowance. ISO 965-1.' },
  { keys: 'Thread Class 4H/4h', command: 'Precision Tolerance', category: 'data', description: 'Tighter tolerance for precision applications. Used in aerospace and high-precision assemblies. ISO 965-1.' },
  { keys: 'Thread Class 7H/8g', command: 'Rough Tolerance', category: 'data', description: 'Wider tolerance for rough applications. Used in structural steel and general construction. ISO 965-1.' },
  { keys: '75% Engagement', command: 'Standard Tap Drill', category: 'data', description: '75% thread engagement is the standard for most tapping applications. Balances strength and ease of tapping. Higher % = stronger but harder to tap.' },
  { keys: '50% Engagement', command: 'Reduced Tap Drill', category: 'data', description: '50% thread engagement is sufficient for most low-stress applications in soft materials. Easier to tap, less tap breakage. Not recommended for hard materials.' },
];

const TIPS = [
  {
    title: 'Tap drill formula: Major Ø − Pitch',
    content: 'For metric threads, tap drill diameter = major diameter minus pitch. Example: M10×1.5 → 10 − 1.5 = 8.5mm. This gives approximately 75% thread engagement, which is the standard for most applications. For hard or brittle materials, use a slightly larger drill (lower engagement) to reduce tap breakage.'
  },
  {
    title: 'Coarse vs Fine pitch selection',
    content: 'Coarse pitch (M) is the default for general fastening — stronger, easier to assemble, and more tolerant of damage. Fine pitch (MF) is used for: (1) thin walls where full thread depth is limited, (2) adjustment/locking applications, (3) hydraulic/pressure fittings where sealing matters, and (4) vibration resistance (finer threads resist loosening better).'
  },
];

export default function ThreadReferenceClient() {
  return (
    <ShortcutCheatsheetClient
      title="ISO Metric Thread"
      subtitle="Complete ISO metric thread reference: M1.6–M48 coarse/fine pitch, tap drill sizes, clearance holes, and thread specifications."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
