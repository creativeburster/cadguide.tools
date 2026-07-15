'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'ipe', name: '📐 IPE Beams' },
  { id: 'hea', name: '📐 HEA Sections' },
  { id: 'heb', name: '📐 HEB Sections' },
  { id: 'ub', name: '📐 UB Sections' },
  { id: 'uc', name: '📐 UC Sections' },
  { id: 'channel', name: '📐 Channels (UPE/PFC)' },
];

const SHORTCUTS = [
  // IPE Beams
  { keys: 'IPE 80', command: 'h=80 · b=46 · A=7.64cm² · 6.0kg/m · Iy=80.1cm⁴ · Wy=20.0cm³', category: 'ipe', description: 'Smallest IPE section. Used for light framing, supports, and non-structural applications. Web thickness 3.8mm, flange thickness 5.2mm.' },
  { keys: 'IPE 100', command: 'h=100 · b=55 · A=10.3cm² · 8.1kg/m · Iy=171cm⁴ · Wy=34.2cm³', category: 'ipe', description: 'Light beam for small spans and secondary framing. Web 4.1mm, flange 5.7mm.' },
  { keys: 'IPE 120', command: 'h=120 · b=64 · A=13.2cm² · 10.4kg/m · Iy=318cm⁴ · Wy=53.0cm³', category: 'ipe', description: 'Light structural beam. Used for floor joists and secondary framing. Web 4.4mm, flange 6.3mm.' },
  { keys: 'IPE 140', command: 'h=140 · b=73 · A=16.4cm² · 12.9kg/m · Iy=541cm⁴ · Wy=77.3cm³', category: 'ipe', description: 'Common light beam for residential and light commercial framing. Web 4.7mm, flange 6.9mm.' },
  { keys: 'IPE 160', command: 'h=160 · b=82 · A=20.1cm² · 15.8kg/m · Iy=869cm⁴ · Wy=109cm³', category: 'ipe', description: 'Medium light beam. Used for floor beams and roof purlins. Web 5.0mm, flange 7.4mm.' },
  { keys: 'IPE 180', command: 'h=180 · b=91 · A=23.9cm² · 18.8kg/m · Iy=1317cm⁴ · Wy=146cm³', category: 'ipe', description: 'Medium beam for floor and roof structures. Web 5.3mm, flange 8.0mm.' },
  { keys: 'IPE 200', command: 'h=200 · b=100 · A=28.5cm² · 22.4kg/m · Iy=1943cm⁴ · Wy=194cm³', category: 'ipe', description: 'Very common medium beam. Used for floor beams, lintels, and general structural framing. Web 5.6mm, flange 8.5mm.' },
  { keys: 'IPE 240', command: 'h=240 · b=120 · A=39.1cm² · 30.7kg/m · Iy=3892cm⁴ · Wy=324cm³', category: 'ipe', description: 'Standard structural beam for medium spans. Web 6.2mm, flange 9.8mm. Common in commercial buildings.' },
  { keys: 'IPE 270', command: 'h=270 · b=135 · A=45.9cm² · 36.1kg/m · Iy=5790cm⁴ · Wy=429cm³', category: 'ipe', description: 'Medium-heavy beam for floor and roof structures. Web 6.6mm, flange 10.2mm.' },
  { keys: 'IPE 300', command: 'h=300 · b=150 · A=53.8cm² · 42.2kg/m · Iy=8356cm⁴ · Wy=557cm³', category: 'ipe', description: 'One of the most used IPE sections. General structural beam for floors, roofs, and frames. Web 7.1mm, flange 10.7mm.' },
  { keys: 'IPE 360', command: 'h=360 · b=170 · A=72.7cm² · 57.1kg/m · Iy=16270cm⁴ · Wy=904cm³', category: 'ipe', description: 'Heavy beam for larger spans and higher loads. Web 8.0mm, flange 12.7mm. Common in industrial buildings.' },
  { keys: 'IPE 400', command: 'h=400 · b=180 · A=84.5cm² · 66.3kg/m · Iy=23130cm⁴ · Wy=1160cm³', category: 'ipe', description: 'Heavy structural beam for long spans and heavy loads. Web 8.6mm, flange 13.5mm.' },
  { keys: 'IPE 450', command: 'h=450 · b=190 · A=98.8cm² · 77.6kg/m · Iy=33740cm⁴ · Wy=1500cm³', category: 'ipe', description: 'Very heavy beam for major structural applications. Web 9.4mm, flange 14.6mm.' },
  { keys: 'IPE 500', command: 'h=500 · b=200 · A=115.5cm² · 90.7kg/m · Iy=48200cm⁴ · Wy=1930cm³', category: 'ipe', description: 'Extra heavy beam for large-span structures and bridge components. Web 10.2mm, flange 16.0mm.' },
  { keys: 'IPE 600', command: 'h=600 · b=220 · A=156.0cm² · 122kg/m · Iy=92080cm⁴ · Wy=3070cm³', category: 'ipe', description: 'Largest standard IPE. Used for major structural spans, bridges, and heavy industrial frames. Web 12.0mm, flange 19.0mm.' },

  // HEA Sections (wide flange H-sections, lighter)
  { keys: 'HEA 100', command: 'h=96 · b=100 · A=21.2cm² · 16.7kg/m · Iy=349cm⁴ · Wy=72.8cm³', category: 'hea', description: 'Light H-section. Used for columns and beams where width is needed. Web 5.0mm, flange 8.0mm.' },
  { keys: 'HEA 120', command: 'h=114 · b=120 · A=25.3cm² · 19.9kg/m · Iy=606cm⁴ · Wy=106cm³', category: 'hea', description: 'Light H-section for columns and bracing. Web 5.0mm, flange 8.0mm.' },
  { keys: 'HEA 140', command: 'h=133 · b=140 · A=31.4cm² · 24.7kg/m · Iy=1033cm⁴ · Wy=155cm³', category: 'hea', description: 'Common column section for low-rise buildings. Web 5.5mm, flange 8.5mm.' },
  { keys: 'HEA 160', command: 'h=152 · b=160 · A=38.8cm² · 30.4kg/m · Iy=1673cm⁴ · Wy=220cm³', category: 'hea', description: 'Column section for medium loads. Web 6.0mm, flange 9.0mm.' },
  { keys: 'HEA 180', command: 'h=171 · b=180 · A=45.3cm² · 35.5kg/m · Iy=2510cm⁴ · Wy=294cm³', category: 'hea', description: 'Standard column for commercial buildings. Web 6.5mm, flange 9.5mm.' },
  { keys: 'HEA 200', command: 'h=190 · b=200 · A=53.8cm² · 42.3kg/m · Iy=3692cm⁴ · Wy=389cm³', category: 'hea', description: 'Very common column section. Also used as beam where flange width needed. Web 6.5mm, flange 10.0mm.' },
  { keys: 'HEA 240', command: 'h=230 · b=240 · A=79.5cm² · 62.5kg/m · Iy=7763cm⁴ · Wy=674cm³', category: 'hea', description: 'Heavy column for multi-story buildings. Web 7.5mm, flange 12.0mm.' },
  { keys: 'HEA 280', command: 'h=270 · b=280 · A=97.3cm² · 76.4kg/m · Iy=13670cm⁴ · Wy=1013cm³', category: 'hea', description: 'Major column section for high loads. Web 8.0mm, flange 13.0mm.' },
  { keys: 'HEA 300', command: 'h=290 · b=300 · A=112.5cm² · 88.3kg/m · Iy=18260cm⁴ · Wy=1260cm³', category: 'hea', description: 'Large column for heavy structures. Web 8.5mm, flange 14.0mm.' },
  { keys: 'HEA 400', command: 'h=390 · b=300 · A=159.0cm² · 125kg/m · Iy=45070cm⁴ · Wy=2310cm³', category: 'hea', description: 'Very large column for major structures. Web 11.0mm, flange 19.0mm.' },

  // HEB Sections (wide flange H-sections, heavier)
  { keys: 'HEB 100', command: 'h=100 · b=100 · A=26.0cm² · 20.4kg/m · Iy=449cm⁴ · Wy=89.9cm³', category: 'heb', description: 'Standard H-section. Heavier than HEA 100. Used for columns and beams. Web 6.0mm, flange 10.0mm.' },
  { keys: 'HEB 120', command: 'h=120 · b=120 · A=34.0cm² · 26.7kg/m · Iy=864cm⁴ · Wy=144cm³', category: 'heb', description: 'Common column section for light commercial. Web 6.5mm, flange 11.0mm.' },
  { keys: 'HEB 140', command: 'h=140 · b=140 · A=43.0cm² · 33.7kg/m · Iy=1510cm⁴ · Wy=216cm³', category: 'heb', description: 'Column section for medium loads. Web 7.0mm, flange 12.0mm.' },
  { keys: 'HEB 160', command: 'h=160 · b=160 · A=54.3cm² · 42.6kg/m · Iy=2490cm⁴ · Wy=311cm³', category: 'heb', description: 'Standard column for commercial buildings. Web 8.0mm, flange 13.0mm.' },
  { keys: 'HEB 180', command: 'h=180 · b=180 · A=65.3cm² · 51.2kg/m · Iy=3830cm⁴ · Wy=426cm³', category: 'heb', description: 'Heavy column section. Web 8.5mm, flange 14.0mm.' },
  { keys: 'HEB 200', command: 'h=200 · b=200 · A=78.1cm² · 61.3kg/m · Iy=5690cm⁴ · Wy=569cm³', category: 'heb', description: 'One of the most common H-sections. Used for columns and beams. Web 9.0mm, flange 15.0mm.' },
  { keys: 'HEB 240', command: 'h=240 · b=240 · A=106.0cm² · 83.2kg/m · Iy=11260cm⁴ · Wy=938cm³', category: 'heb', description: 'Major column and beam section. Web 10.0mm, flange 17.0mm.' },
  { keys: 'HEB 300', command: 'h=300 · b=300 · A=149.1cm² · 117kg/m · Iy=25170cm⁴ · Wy=1680cm³', category: 'heb', description: 'Large column for heavy structures. Web 11.0mm, flange 19.0mm. Very common in multi-story buildings.' },
  { keys: 'HEB 400', command: 'h=400 · b=300 · A=197.8cm² · 155kg/m · Iy=57680cm⁴ · Wy=2880cm³', category: 'heb', description: 'Very large section for major structural elements. Web 13.5mm, flange 24.0mm.' },

  // UB Sections (British Universal Beams)
  { keys: 'UB 203×102×23', command: 'h=203.2 · b=101.8 · A=29.4cm² · 23.0kg/m · Iy=2100cm⁴ · Wy=207cm³', category: 'ub', description: 'Small British Universal Beam. Used for floor joists and light framing. Web 5.8mm, flange 8.0mm.' },
  { keys: 'UB 203×133×25', command: 'h=203.2 · b=133.2 · A=32.3cm² · 25.0kg/m · Iy=2350cm⁴ · Wy=231cm³', category: 'ub', description: 'Small UB with wider flange. Better lateral stability. Web 5.8mm, flange 7.8mm.' },
  { keys: 'UB 254×102×25', command: 'h=257.0 · b=101.9 · A=32.3cm² · 25.2kg/m · Iy=3400cm⁴ · Wy=265cm³', category: 'ub', description: 'Medium UB for floor beams. Web 6.0mm, flange 8.4mm.' },
  { keys: 'UB 254×146×37', command: 'h=259.6 · b=147.3 · A=47.3cm² · 37.0kg/m · Iy=5540cm⁴ · Wy=427cm³', category: 'ub', description: 'Common medium UB. Good for floor and roof beams. Web 6.3mm, flange 12.7mm.' },
  { keys: 'UB 305×127×37', command: 'h=304.4 · b=123.3 · A=47.3cm² · 37.0kg/m · Iy=7150cm⁴ · Wy=470cm³', category: 'ub', description: 'Medium UB for general structural use. Web 7.0mm, flange 10.7mm.' },
  { keys: 'UB 305×165×54', command: 'h=307.0 · b=165.6 · A=68.6cm² · 54.0kg/m · Iy=11600cm⁴ · Wy=757cm³', category: 'ub', description: 'Heavy medium UB with wide flange. Good lateral stability. Web 8.0mm, flange 13.7mm.' },
  { keys: 'UB 356×171×51', command: 'h=355.0 · b=171.5 · A=65.0cm² · 51.0kg/m · Iy=14100cm⁴ · Wy=795cm³', category: 'ub', description: 'Large UB for floor and roof beams. Web 6.9mm, flange 11.5mm.' },
  { keys: 'UB 406×178×54', command: 'h=402.6 · b=177.7 · A=68.7cm² · 54.0kg/m · Iy=18700cm⁴ · Wy=929cm³', category: 'ub', description: 'Large UB for longer spans. Web 7.7mm, flange 10.9mm.' },
  { keys: 'UB 457×191×67', command: 'h=453.4 · b=189.9 · A=85.4cm² · 67.1kg/m · Iy=29400cm⁴ · Wy=1300cm³', category: 'ub', description: 'Heavy UB for major structural beams. Web 8.5mm, flange 12.7mm.' },
  { keys: 'UB 533×210×82', command: 'h=528.3 · b=208.8 · A=105.0cm² · 82.2kg/m · Iy=47500cm⁴ · Wy=1800cm³', category: 'ub', description: 'Very heavy UB for long-span beams. Web 9.6mm, flange 13.2mm.' },
  { keys: 'UB 610×229×113', command: 'h=607.3 · b=228.2 · A=144.0cm² · 113kg/m · Iy=87000cm⁴ · Wy=2870cm³', category: 'ub', description: 'Extra heavy UB for major structural spans. Web 11.2mm, flange 17.3mm.' },

  // UC Sections (British Universal Columns)
  { keys: 'UC 152×152×37', command: 'h=161.3 · b=154.4 · A=47.3cm² · 37.0kg/m · Iy=2220cm⁴ · Wy=275cm³', category: 'uc', description: 'Small Universal Column. Used for columns in low-rise buildings. Web 8.0mm, flange 11.5mm.' },
  { keys: 'UC 203×203×60', command: 'h=209.6 · b=206.2 · A=75.8cm² · 60.0kg/m · Iy=6110cm⁴ · Wy_583cm³', category: 'uc', description: 'Common medium column section. Used in multi-story buildings. Web 9.4mm, flange 14.2mm.' },
  { keys: 'UC 203×203×86', command: 'h=219.1 · b=208.8 · A=110.0cm² · 86.0kg/m · Iy=9460cm⁴ · Wy=864cm³', category: 'uc', description: 'Heavy UC for columns with high axial loads. Web 12.7mm, flange 20.5mm.' },
  { keys: 'UC 254×254×73', command: 'h=254.1 · b=254.6 · A=93.1cm² · 73.0kg/m · Iy=11400cm⁴ · Wy=897cm³', category: 'uc', description: 'Standard column for medium-rise buildings. Web 8.6mm, flange 14.2mm.' },
  { keys: 'UC 254×254×107', command: 'h=266.7 · b=258.3 · A=136.0cm² · 107kg/m · Iy=17500cm⁴ · Wy=1310cm³', category: 'uc', description: 'Heavy column section for high axial loads. Web 12.8mm, flange 20.5mm.' },
  { keys: 'UC 305×305×97', command: 'h=307.9 · b=305.3 · A=123.0cm² · 97.0kg/m · Iy=22300cm⁴ · Wy=1450cm³', category: 'uc', description: 'Large column for multi-story buildings. Web 9.9mm, flange 15.4mm.' },
  { keys: 'UC 305×305×158', command: 'h=327.1 · b=311.2 · A=201.0cm² · 158kg/m · Iy=38800cm⁴ · Wy=2370cm³', category: 'uc', description: 'Very heavy column for major structures. Web 15.8mm, flange 25.0mm.' },
  { keys: 'UC 356×368×202', command: 'h=374.6 · b=373.0 · A=257.0cm² · 202kg/m · Iy=62900cm⁴ · Wy=3360cm³', category: 'uc', description: 'Extra heavy column for very high loads. Web 16.5mm, flange 30.0mm.' },

  // Channels (UPE European / PFC British)
  { keys: 'UPE 80', command: 'h=80 · b=50 · A=11.0cm² · 8.64kg/m · Iy=117cm⁴ · Wy=29.3cm³', category: 'channel', description: 'Small European channel. Used for brackets, supports, and light framing. Web 4.5mm, flange 8.0mm.' },
  { keys: 'UPE 100', command: 'h=100 · b=55 · A=13.5cm² · 10.6kg/m · Iy=206cm⁴ · Wy=41.2cm³', category: 'channel', description: 'Light channel for secondary framing. Web 5.0mm, flange 8.5mm.' },
  { keys: 'UPE 140', command: 'h=140 · b=65 · A=20.1cm² · 15.8kg/m · Iy=541cm⁴ · Wy=77.3cm³', category: 'channel', description: 'Medium channel for structural supports. Web 6.0mm, flange 10.0mm.' },
  { keys: 'UPE 200', command: 'h=200 · b=75 · A=32.2cm² · 25.3kg/m · Iy=1910cm⁴ · Wy=191cm³', category: 'channel', description: 'Large channel for structural applications. Web 8.0mm, flange 11.0mm.' },
  { keys: 'PFC 150×75×18', command: 'h=150 · b=75 · A=22.9cm² · 18.0kg/m · Iy=820cm⁴ · Wy=109cm³', category: 'channel', description: 'British Parallel Flange Channel. Used for supports, brackets, and edge beams. Web 5.5mm, flange 10.0mm.' },
  { keys: 'PFC 200×75×23', command: 'h=200 · b=75 · A=29.7cm² · 23.0kg/m · Iy=1950cm⁴ · Wy_195cm³', category: 'channel', description: 'Large British channel for structural supports. Web 6.0mm, flange 12.5mm.' },
  { keys: 'PFC 230×75×26', command: 'h=230 · b=75 · A=33.0cm² · 26.0kg/m · Iy=3060cm⁴ · Wy=266cm³', category: 'channel', description: 'Heavy British channel for edge beams and supports. Web 6.5mm, flange 12.5mm.' },
];

const TIPS = [
  {
    title: 'IPE vs HEA/HEB — when to use which',
    content: 'IPE sections are optimized for bending (deep web, narrow flanges) — use them as beams. HEA/HEB sections have wide flanges and are optimized for compression — use them as columns. HEB is heavier than HEA for the same nominal size. For combined axial + bending (e.g., portal frame columns), HEB is often preferred because its wide flanges provide better lateral buckling resistance.'
  },
  {
    title: 'Cross-section properties for structural design',
    content: 'Iy (moment of inertia about strong axis) determines bending stiffness and deflection. Wy (section modulus) determines bending resistance: M_Rd = Wy × f_y / γ_M0. For shear resistance, check web area (h_w × t_w). For lateral-torsional buckling, the flange width and thickness are critical. Always verify properties against the latest section tables from your steel supplier — values may vary slightly by manufacturer.'
  },
];

export default function SteelSectionClient() {
  return (
    <ShortcutCheatsheetClient
      title="Steel Section Properties"
      subtitle="European (IPE, HEA, HEB, UPE) and British (UB, UC, PFC) hot-rolled steel section properties: dimensions, area, weight, I, and W."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
