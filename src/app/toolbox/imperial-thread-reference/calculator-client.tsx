'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'unc', name: '🔩 UNC (Coarse)' },
  { id: 'unf', name: '🔩 UNF (Fine)' },
  { id: 'clearance', name: '⭕ Clearance Holes' },
  { id: 'data', name: '📐 Thread Specs' },
];

const SHORTCUTS = [
  // UNC threads (coarse)
  { keys: '#0-80', command: 'Ø0.060" · 80 TPI · Tap #56 (0.0465")', category: 'unc', description: 'Smallest UNC thread. Used in miniature instruments, electronics, and watchmaking. Tap drill #56 = 1.181mm. Very delicate — use care when tapping.' },
  { keys: '#1-64', command: 'Ø0.073" · 64 TPI · Tap #53 (0.0595")', category: 'unc', description: 'Small UNC thread. Used in precision instruments and small assemblies. Tap drill #53 = 1.511mm.' },
  { keys: '#2-56', command: 'Ø0.086" · 56 TPI · Tap #50 (0.070")', category: 'unc', description: 'Very common small thread in US. Used in electronics, model making, and small hardware. Tap drill #50 = 1.778mm.' },
  { keys: '#3-48', command: 'Ø0.099" · 48 TPI · Tap #47 (0.0785")', category: 'unc', description: 'Small UNC thread. Less common than #2-56 or #4-40. Tap drill #47 = 1.994mm.' },
  { keys: '#4-40', command: 'Ø0.112" · 40 TPI · Tap #43 (0.089")', category: 'unc', description: 'Most common small US thread. Used everywhere in electronics, consumer products, and small hardware. Tap drill #43 = 2.261mm.' },
  { keys: '#5-40', command: 'Ø0.125" · 40 TPI · Tap #38 (0.1015")', category: 'unc', description: 'Less common size. Used in specialized hardware. Tap drill #38 = 2.578mm. Close to 1/8" diameter.' },
  { keys: '#6-32', command: 'Ø0.138" · 32 TPI · Tap #36 (0.1065")', category: 'unc', description: 'Extremely common in US. Used in electrical boxes, computers, and general hardware. Tap drill #36 = 2.705mm. Sheet metal screw equivalent available.' },
  { keys: '#8-32', command: 'Ø0.164" · 32 TPI · Tap #29 (0.136")', category: 'unc', description: 'Very common medium-small thread. Used in electronics, machinery, and consumer products. Tap drill #29 = 3.454mm.' },
  { keys: '#10-24', command: 'Ø0.190" · 24 TPI · Tap #25 (0.1495")', category: 'unc', description: 'Common medium thread. Used in general hardware, brackets, and machinery. Tap drill #25 = 3.797mm. Coarse version of #10.' },
  { keys: '#12-24', command: 'Ø0.216" · 24 TPI · Tap #16 (0.177")', category: 'unc', description: 'Less common size between #10 and 1/4. Used in specialized hardware. Tap drill #16 = 4.496mm.' },
  { keys: '1/4-20', command: 'Ø0.250" · 20 TPI · Tap #7 (0.201")', category: 'unc', description: 'One of the most common US threads. Used in machinery, automotive, and construction. Tap drill #7 = 5.105mm. Close to M6 in size.' },
  { keys: '5/16-18', command: 'Ø0.3125" · 18 TPI · Tap F (0.257")', category: 'unc', description: 'Common structural thread. Used in machinery, automotive, and structural connections. Tap drill F = 6.528mm. Close to M8 in size.' },
  { keys: '3/8-16', command: 'Ø0.375" · 16 TPI · Tap 5/16" (0.3125")', category: 'unc', description: 'Very common heavy-duty thread. Used in machinery, automotive, and construction. Tap drill 5/16" = 7.938mm. Close to M10 in size.' },
  { keys: '7/16-14', command: 'Ø0.4375" · 14 TPI · Tap U (0.368")', category: 'unc', description: 'Heavy machinery thread. Tap drill U = 9.347mm. Used in automotive and heavy equipment.' },
  { keys: '1/2-13', command: 'Ø0.500" · 13 TPI · Tap 27/64" (0.4219")', category: 'unc', description: 'Major structural thread. Used in construction, machinery, and heavy equipment. Tap drill 27/64" = 10.716mm. Close to M12 in size.' },
  { keys: '9/16-12', command: 'Ø0.5625" · 12 TPI · Tap 31/64" (0.4844")', category: 'unc', description: 'Heavy structural thread. Less common than 1/2-13. Tap drill 31/64" = 12.303mm.' },
  { keys: '5/8-11', command: 'Ø0.625" · 11 TPI · Tap 17/32" (0.5313")', category: 'unc', description: 'Heavy-duty structural thread. Used in construction and heavy machinery. Tap drill 17/32" = 13.494mm. Close to M16 in size.' },
  { keys: '3/4-10', command: 'Ø0.750" · 10 TPI · Tap 21/32" (0.6563")', category: 'unc', description: 'Major structural thread. Used in heavy construction, machinery, and pressure vessels. Tap drill 21/32" = 16.669mm.' },
  { keys: '7/8-9', command: 'Ø0.875" · 9 TPI · Tap 49/64" (0.7656")', category: 'unc', description: 'Very heavy structural thread. Tap drill 49/64" = 19.447mm. Used in heavy machinery and structural connections.' },
  { keys: '1-8', command: 'Ø1.000" · 8 TPI · Tap 7/8" (0.875")', category: 'unc', description: 'Large structural thread. Tap drill 7/8" = 22.225mm. Used in heavy construction and large machinery.' },
  { keys: '1-1/8-7', command: 'Ø1.125" · 7 TPI · Tap 63/64" (0.9844")', category: 'unc', description: 'Very large thread. Tap drill 63/64" = 25.003mm. Used in heavy structural and industrial applications.' },
  { keys: '1-1/4-7', command: 'Ø1.250" · 7 TPI · Tap 1-7/64" (1.1094")', category: 'unc', description: 'Large structural thread. Tap drill 1-7/64" = 28.179mm. Used in heavy construction and large equipment.' },
  { keys: '1-1/2-6', command: 'Ø1.500" · 6 TPI · Tap 1-11/32" (1.3438")', category: 'unc', description: 'Largest commonly used UNC thread. Tap drill 1-11/32" = 34.131mm. Used in heavy structural connections.' },

  // UNF threads (fine)
  { keys: '#0-80', command: 'Ø0.060" · 80 TPI · Tap #56 (0.0465")', category: 'unf', description: 'Same as UNC for #0 — only one thread series at this size. 80 TPI is the standard for #0.' },
  { keys: '#1-72', command: 'Ø0.073" · 72 TPI · Tap #53 (0.0595")', category: 'unf', description: 'Fine thread version of #1. More TPI than #1-64. Used where finer adjustment or better locking needed. Tap drill #53.' },
  { keys: '#2-64', command: 'Ø0.086" · 64 TPI · Tap #50 (0.070")', category: 'unf', description: 'Fine thread version of #2. 64 TPI vs 56 TPI (UNC). Tap drill #50 = 1.778mm.' },
  { keys: '#3-56', command: 'Ø0.099" · 56 TPI · Tap #45 (0.082")', category: 'unf', description: 'Fine thread version of #3. 56 TPI vs 48 TPI (UNC). Tap drill #45 = 2.083mm.' },
  { keys: '#4-48', command: 'Ø0.112" · 48 TPI · Tap #42 (0.0935")', category: 'unf', description: 'Fine thread version of #4. 48 TPI vs 40 TPI (UNC). Used in precision instruments. Tap drill #42 = 2.375mm.' },
  { keys: '#5-44', command: 'Ø0.125" · 44 TPI · Tap #37 (0.104")', category: 'unf', description: 'Fine thread version of #5. 44 TPI vs 40 TPI (UNC). Tap drill #37 = 2.642mm.' },
  { keys: '#6-40', command: 'Ø0.138" · 40 TPI · Tap #33 (0.113")', category: 'unf', description: 'Fine thread version of #6. 40 TPI vs 32 TPI (UNC). Used where vibration resistance matters. Tap drill #33 = 2.870mm.' },
  { keys: '#8-36', command: 'Ø0.164" · 36 TPI · Tap #29 (0.136")', category: 'unf', description: 'Fine thread version of #8. 36 TPI vs 32 TPI (UNC). Used in precision assemblies. Tap drill #29 = 3.454mm.' },
  { keys: '#10-32', command: 'Ø0.190" · 32 TPI · Tap #21 (0.159")', category: 'unf', description: 'Very common fine thread. Used in electronics, machinery, and precision hardware. 32 TPI vs 24 TPI (UNC). Tap drill #21 = 4.039mm.' },
  { keys: '#12-28', command: 'Ø0.216" · 28 TPI · Tap #16 (0.177")', category: 'unf', description: 'Fine thread version of #12. 28 TPI vs 24 TPI (UNC). Less common. Tap drill #16 = 4.496mm.' },
  { keys: '1/4-28', command: 'Ø0.250" · 28 TPI · Tap #3 (0.213")', category: 'unf', description: 'Common fine thread. Used in hydraulic fittings, precision instruments, and automotive. 28 TPI vs 20 TPI (UNC). Tap drill #3 = 5.410mm.' },
  { keys: '5/16-24', command: 'Ø0.3125" · 24 TPI · Tap I (0.272")', category: 'unf', description: 'Fine thread for 5/16". Used in hydraulic fittings and precision assemblies. 24 TPI vs 18 TPI (UNC). Tap drill I = 6.909mm.' },
  { keys: '3/8-24', command: 'Ø0.375" · 24 TPI · Tap Q (0.332")', category: 'unf', description: 'Common fine thread. Used in hydraulic fittings, automotive, and precision machinery. 24 TPI vs 16 TPI (UNC). Tap drill Q = 8.433mm.' },
  { keys: '7/16-20', command: 'Ø0.4375" · 20 TPI · Tap 25/64" (0.3906")', category: 'unf', description: 'Fine thread for 7/16". 20 TPI vs 14 TPI (UNC). Tap drill 25/64" = 9.922mm. Used in automotive and hydraulic applications.' },
  { keys: '1/2-20', command: 'Ø0.500" · 20 TPI · Tap 29/64" (0.4531")', category: 'unf', description: 'Fine thread for 1/2". Very common in hydraulic fittings (JIC). 20 TPI vs 13 TPI (UNC). Tap drill 29/64" = 11.509mm.' },
  { keys: '9/16-18', command: 'Ø0.5625" · 18 TPI · Tap 33/64" (0.5156")', category: 'unf', description: 'Fine thread for 9/16". 18 TPI vs 12 TPI (UNC). Tap drill 33/64" = 13.097mm. Used in heavy hydraulic systems.' },
  { keys: '5/8-18', command: 'Ø0.625" · 18 TPI · Tap 37/64" (0.5781")', category: 'unf', description: 'Fine thread for 5/8". Common in hydraulic fittings. 18 TPI vs 11 TPI (UNC). Tap drill 37/64" = 14.684mm.' },
  { keys: '3/4-16', command: 'Ø0.750" · 16 TPI · Tap 11/16" (0.6875")', category: 'unf', description: 'Fine thread for 3/4". Used in hydraulic and high-pressure applications. 16 TPI vs 10 TPI (UNC). Tap drill 11/16" = 17.463mm.' },
  { keys: '7/8-14', command: 'Ø0.875" · 14 TPI · Tap 49/64" (0.7656")', category: 'unf', description: 'Fine thread for 7/8". 14 TPI vs 9 TPI (UNC). Tap drill 49/64" = 19.447mm. Used in heavy machinery.' },
  { keys: '1-12', command: 'Ø1.000" · 12 TPI · Tap 59/64" (0.9219")', category: 'unf', description: 'Fine thread for 1". 12 TPI vs 8 TPI (UNC). Tap drill 59/64" = 23.416mm. Used in precision heavy machinery.' },
  { keys: '1-1/8-12', command: 'Ø1.125" · 12 TPI · Tap 1-3/64" (1.0469")', category: 'unf', description: 'Fine thread for 1-1/8". 12 TPI vs 7 TPI (UNC). Tap drill 1-3/64" = 26.591mm.' },
  { keys: '1-1/4-12', command: 'Ø1.250" · 12 TPI · Tap 1-11/64" (1.1719")', category: 'unf', description: 'Fine thread for 1-1/4". 12 TPI vs 7 TPI (UNC). Tap drill 1-11/64" = 29.769mm.' },
  { keys: '1-1/2-12', command: 'Ø1.500" · 12 TPI · Tap 1-23/64" (1.3594")', category: 'unf', description: 'Fine thread for 1-1/2". 12 TPI vs 6 TPI (UNC). Tap drill 1-23/64" = 34.528mm. Used in large precision assemblies.' },

  // Clearance holes
  { keys: '#4 Close', command: 'Ø 0.125" (1/8")', category: 'clearance', description: 'Close fit clearance for #4 screw. 1/8" = 3.175mm. Used where precise alignment is required.' },
  { keys: '#4 Normal', command: 'Ø 0.1406" (9/64")', category: 'clearance', description: 'Normal fit clearance for #4 screw. 9/64" = 3.572mm. Standard clearance for general use.' },
  { keys: '#6 Close', command: 'Ø 0.1406" (9/64")', category: 'clearance', description: 'Close fit clearance for #6 screw. 9/64" = 3.572mm.' },
  { keys: '#6 Normal', command: 'Ø 0.1563" (5/32")', category: 'clearance', description: 'Normal fit clearance for #6 screw. 5/32" = 3.969mm.' },
  { keys: '#8 Close', command: 'Ø 0.1563" (5/32")', category: 'clearance', description: 'Close fit clearance for #8 screw. 5/32" = 3.969mm.' },
  { keys: '#8 Normal', command: 'Ø 0.1875" (3/16")', category: 'clearance', description: 'Normal fit clearance for #8 screw. 3/16" = 4.763mm.' },
  { keys: '#10 Close', command: 'Ø 0.1875" (3/16")', category: 'clearance', description: 'Close fit clearance for #10 screw. 3/16" = 4.763mm.' },
  { keys: '#10 Normal', command: 'Ø 0.2188" (7/32")', category: 'clearance', description: 'Normal fit clearance for #10 screw. 7/32" = 5.556mm.' },
  { keys: '1/4 Close', command: 'Ø 0.250" (1/4")', category: 'clearance', description: 'Close fit clearance for 1/4" bolt. Exact size — requires precise drilling. 6.350mm.' },
  { keys: '1/4 Normal', command: 'Ø 0.2813" (9/32")', category: 'clearance', description: 'Normal fit clearance for 1/4" bolt. 9/32" = 7.144mm.' },
  { keys: '5/16 Close', command: 'Ø 0.3125" (5/16")', category: 'clearance', description: 'Close fit clearance for 5/16" bolt. Exact size. 7.938mm.' },
  { keys: '5/16 Normal', command: 'Ø 0.3438" (11/32")', category: 'clearance', description: 'Normal fit clearance for 5/16" bolt. 11/32" = 8.731mm.' },
  { keys: '3/8 Close', command: 'Ø 0.375" (3/8")', category: 'clearance', description: 'Close fit clearance for 3/8" bolt. Exact size. 9.525mm.' },
  { keys: '3/8 Normal', command: 'Ø 0.4063" (13/32")', category: 'clearance', description: 'Normal fit clearance for 3/8" bolt. 13/32" = 10.319mm.' },
  { keys: '1/2 Close', command: 'Ø 0.500" (1/2")', category: 'clearance', description: 'Close fit clearance for 1/2" bolt. Exact size. 12.700mm.' },
  { keys: '1/2 Normal', command: 'Ø 0.5313" (17/32")', category: 'clearance', description: 'Normal fit clearance for 1/2" bolt. 17/32" = 13.494mm.' },
  { keys: '5/8 Close', command: 'Ø 0.625" (5/8")', category: 'clearance', description: 'Close fit clearance for 5/8" bolt. Exact size. 15.875mm.' },
  { keys: '5/8 Normal', command: 'Ø 0.6563" (21/32")', category: 'clearance', description: 'Normal fit clearance for 5/8" bolt. 21/32" = 16.669mm.' },
  { keys: '3/4 Close', command: 'Ø 0.750" (3/4")', category: 'clearance', description: 'Close fit clearance for 3/4" bolt. Exact size. 19.050mm.' },
  { keys: '3/4 Normal', command: 'Ø 0.8125" (13/16")', category: 'clearance', description: 'Normal fit clearance for 3/4" bolt. 13/16" = 20.638mm.' },

  // Thread specifications
  { keys: 'Class 2A/2B', command: 'Standard External/Internal', category: 'data', description: 'Most common tolerance class for general applications. 2A = external (bolt), 2B = internal (nut). Provides reasonable fit with manufacturing economy. Default for commercial fasteners.' },
  { keys: 'Class 3A/3B', command: 'Precision Tolerance', category: 'data', description: 'Tighter tolerance for precision applications. 3A = external, 3B = internal. Used in aerospace, instrumentation, and where precise fit is critical. No allowance for plating.' },
  { keys: 'Class 1A/1B', command: 'Rough Tolerance', category: 'data', description: 'Wide tolerance for rough applications. 1A = external, 1B = internal. Used for quick assembly where fit is not critical. Rare in modern practice.' },
  { keys: '75% Engagement', command: 'Standard Tap Drill', category: 'data', description: '75% thread engagement is standard for UNC/UNF tapping. Balances strength and ease of tapping. Tap drill formula: Major Ø − (1/TPI). Example: 1/4-20 → 0.250 − 0.050 = 0.200" → #7 drill.' },
  { keys: '50% Engagement', command: 'Reduced Tap Drill', category: 'data', description: '50% thread engagement for hard or tough materials. Easier tapping, less tap breakage. Acceptable for most non-critical applications. Use one drill size larger than 75%.' },
];

const TIPS = [
  {
    title: 'UNC vs UNF — when to use which',
    content: 'UNC (coarse) is the default for general fastening — stronger threads, easier assembly, less prone to cross-threading, and better for soft or brittle materials. UNF (fine) is used for: (1) thin walls where thread depth is limited, (2) adjustment and locking applications (finer pitch = more friction), (3) vibration resistance (finer threads resist loosening), (4) hydraulic and pressure fittings (more thread engagement per unit length). Most US automotive and machinery uses UNC; aerospace uses more UNF.'
  },
  {
    title: 'Tap drill formula for imperial threads',
    content: 'For UNC/UNF threads, tap drill = Major Diameter − (1/TPI). Example: 1/4-20 UNC → 0.250 − (1/20) = 0.250 − 0.050 = 0.200" → use #7 drill (0.201"). For 10-32 UNF → 0.190 − (1/32) = 0.190 − 0.03125 = 0.159" → use #21 drill (0.159"). This gives approximately 75% thread engagement. For hard materials, use one size larger for easier tapping.'
  },
];

export default function ImperialThreadClient() {
  return (
    <ShortcutCheatsheetClient
      title="UNC/UNF Imperial Thread"
      subtitle="Complete UNC (coarse) and UNF (fine) thread reference: #0 through 1-1/2 in. with TPI, tap drill sizes, clearance holes, and thread specifications."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
