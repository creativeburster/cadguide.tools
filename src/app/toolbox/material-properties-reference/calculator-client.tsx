'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'steel', name: '⚙️ Steels' },
  { id: 'aluminum', name: '🪙 Aluminum Alloys' },
  { id: 'copper', name: '🟤 Copper & Brass' },
  { id: 'titanium', name: '⚪ Titanium & Nickel' },
  { id: 'cast', name: '🔩 Cast Iron' },
  { id: 'plastic', name: '🧱 Engineering Plastics' },
];

const SHORTCUTS = [
  // Steels
  { keys: 'AISI 1018', command: 'ρ:7.87 · σy:370 · σu:440 · E:200 · ν:0.29 · α:11.9', category: 'steel', description: 'Low carbon mild steel. Most common general-purpose steel. Good weldability and machinability. Used for shafts, spindles, pins, rods, and general machine parts. Not for heat treatment (low carbon).' },
  { keys: 'AISI 1045', command: 'ρ:7.87 · σy:530 · σu:665 · E:200 · ν:0.29 · α:11.7', category: 'steel', description: 'Medium carbon steel. Higher strength than 1018. Can be flame or induction hardened. Used for gears, shafts, studs, and bolts. Good machinability, moderate weldability.' },
  { keys: 'AISI 4140', command: 'ρ:7.85 · σy:655 · σu:745 · E:200 · ν:0.29 · α:12.3', category: 'steel', description: 'Chromium-molybdenum alloy steel. High strength, good toughness, excellent fatigue resistance. Quench and temper to 28-32 HRC. Used for shafts, gears, spindles, tool holders.' },
  { keys: 'AISI 4340', command: 'ρ:7.85 · σy:710 · σu:780 · E:200 · ν:0.29 · α:12.3', category: 'steel', description: 'Nickel-chromium-molybdenum steel. Very high strength and toughness. Deep hardenability. Used for critical shafts, gears, and aerospace components. Can be heat treated to 50+ HRC.' },
  { keys: 'AISI 12L14', command: 'ρ:7.87 · σy:285 · σu:540 · E:200 · ν:0.29 · α:11.8', category: 'steel', description: 'Free-machining steel with lead. Excellent machinability (195% vs 1018). Lower strength and toughness. Used for high-volume turned parts where strength is not critical.' },
  { keys: 'AISI 303', command: 'ρ:8.00 · σy:240 · σu:620 · E:193 · ν:0.29 · α:17.3', category: 'steel', description: 'Austenitic free-machining stainless. Contains sulfur for machinability. Good corrosion resistance. Not for welding. Used for fittings, fasteners, and machined parts requiring corrosion resistance.' },
  { keys: 'AISI 304', command: 'ρ:8.00 · σy:215 · σu:505 · E:193 · ν:0.29 · α:17.3', category: 'steel', description: 'Most common stainless steel (18-8). Excellent corrosion resistance, good formability. Non-magnetic annealed. Used for food equipment, chemical tanks, fasteners, and architectural trim.' },
  { keys: 'AISI 316', command: 'ρ:8.00 · σy:290 · σu:580 · E:193 · ν:0.29 · α:15.9', category: 'steel', description: 'Marine grade stainless with molybdenum. Superior pitting corrosion resistance vs 304. Used in marine, chemical, and medical applications. Higher cost than 304.' },
  { keys: 'AISI 17-4 PH', command: 'ρ:7.80 · σy:1170 · σu:1310 · E:196 · ν:0.27 · α:10.8', category: 'steel', description: 'Precipitation hardening stainless. Very high strength with good corrosion resistance. Age harden at 480-620°C. Used in aerospace, nuclear, and high-strength corrosion applications.' },
  { keys: 'AISI D2', command: 'ρ:7.70 · σy:— · σu:— · E:210 · ν:0.29 · α:11.7', category: 'steel', description: 'Tool steel, high carbon high chromium. Excellent wear resistance and compressive strength. Hardened to 60-62 HRC. Used for dies, punches, cutting tools, and forming tools.' },
  { keys: 'Spring Steel 65Mn', command: 'ρ:7.85 · σy:430 · σu:980 · E:200 · ν:0.29 · α:11.1', category: 'steel', description: 'High carbon spring steel. Excellent elasticity and fatigue resistance. Oil quenched and tempered. Used for springs, clips, washers, and retaining rings.' },

  // Aluminum alloys
  { keys: '6061-T6', command: 'ρ:2.70 · σy:276 · σu:310 · E:69 · ν:0.33 · α:23.6', category: 'aluminum', description: 'Most versatile aluminum alloy. Good strength, weldability, machinability, and corrosion resistance. Used for frames, brackets, structural sections, and general fabrication. T6 temper.' },
  { keys: '6063-T6', command: 'ρ:2.70 · σy:215 · σu:240 · E:69 · ν:0.33 · α:23.4', category: 'aluminum', description: 'Architectural aluminum. Excellent extrudability and surface finish. Lower strength than 6061. Used for window frames, door frames, and architectural extrusions.' },
  { keys: '7075-T6', command: 'ρ:2.81 · σy:503 · σu:572 · E:72 · ν:0.33 · α:23.6', category: 'aluminum', description: 'Aerospace aluminum. Very high strength (stronger than many steels by weight). Poor weldability. Used for aircraft structures, gears, shafts, and high-stress components.' },
  { keys: '2024-T3', command: 'ρ:2.78 · σy:345 · σu:483 · E:73 · ν:0.33 · α:23.2', category: 'aluminum', description: 'Aerospace alloy with high fatigue resistance. Common in aircraft skin and wing structures. Poor corrosion resistance — usually clad (Alclad). Not weldable.' },
  { keys: '5052-H32', command: 'ρ:2.68 · σy:193 · σu:228 · E:70 · ν:0.33 · α:23.8', category: 'aluminum', description: 'Marine grade aluminum. Excellent corrosion resistance, especially in saltwater. Good formability. Used for fuel tanks, marine components, and sheet metal parts.' },
  { keys: '3003-H14', command: 'ρ:2.73 · σy:145 · σu:200 · E:69 · ν:0.33 · α:23.2', category: 'aluminum', description: 'General purpose aluminum. Excellent workability and weldability. Low strength. Used for sheet metal work, ducts, gutters, and chemical equipment.' },

  // Copper and brass
  { keys: 'Copper (C110)', command: 'ρ:8.89 · σy:69 · σu:220 · E:117 · ν:0.34 · α:17.0', category: 'copper', description: 'Pure electrolytic tough pitch copper (99.9% Cu). Excellent electrical and thermal conductivity. Used for electrical conductors, bus bars, heat exchangers, and roofing. Soft and ductile.' },
  { keys: 'Brass (C360)', command: 'ρ:8.50 · σy:310 · σu:469 · E:97 · ν:0.33 · α:20.5', category: 'copper', description: 'Free-machining brass (60% Cu, 36% Zn, 3% Pb). Excellent machinability (100% rating). Used for screw machine parts, fittings, valves, and decorative hardware.' },
  { keys: 'Bronze (C954)', command: 'ρ:7.50 · σy:290 · σu:655 · E:110 · ν:0.33 · α:18.0', category: 'copper', description: 'Aluminum bronze. High strength and excellent corrosion resistance. Used for bearings, bushings, marine hardware, and valve components. Good wear resistance.' },
  { keys: 'Copper Beryllium', command: 'ρ:8.25 · σy:1100 · σu:1200 · E:130 · ν:0.30 · α:17.0', category: 'copper', description: 'High strength copper alloy (C17200). Precipitation hardened. Excellent fatigue and corrosion resistance. Used for springs, electrical contacts, and non-sparking tools.' },

  // Titanium and nickel alloys
  { keys: 'Ti-6Al-4V (Grade 5)', command: 'ρ:4.43 · σy:880 · σu:950 · E:114 · ν:0.34 · α:8.6', category: 'titanium', description: 'Most common titanium alloy (90% Ti market). Excellent strength-to-weight ratio, corrosion resistance, and biocompatibility. Used in aerospace, medical implants, and high-performance engineering.' },
  { keys: 'Ti Grade 2 (CP)', command: 'ρ:4.51 · σy:275 · σu:345 · E:103 · ν:0.37 · α:8.6', category: 'titanium', description: 'Commercially pure titanium. Excellent corrosion resistance, especially in seawater. Lower strength than Ti-6Al-4V. Used for chemical processing, marine, and medical applications.' },
  { keys: 'Inconel 718', command: 'ρ:8.19 · σy:1034 · σu:1241 · E:200 · ν:0.29 · α:13.0', category: 'titanium', description: 'Nickel-chromium superalloy. Excellent high-temperature strength (up to 700°C). Used in gas turbines, jet engines, nuclear reactors, and cryogenic applications. Very difficult to machine.' },
  { keys: 'Monel 400', command: 'ρ:8.80 · σy:240 · σu:550 · E:179 · ν:0.32 · α:13.9', category: 'titanium', description: 'Nickel-copper alloy. Excellent corrosion resistance in marine and chemical environments. Used for valves, pumps, shafts, and marine fasteners. Good at sub-zero temperatures.' },
  { keys: 'Hastelloy C-276', command: 'ρ:8.89 · σy:283 · σu:655 · E:205 · ν:0.29 · α:11.2', category: 'titanium', description: 'Nickel-molybdenum-chromium alloy. Outstanding corrosion resistance in severe chemical environments. Used in chemical processing, pollution control, and waste treatment.' },

  // Cast iron
  { keys: 'Grey Cast Iron GG25', command: 'ρ:7.30 · σy:— · σu:250 · E:110 · ν:0.26 · α:11.0', category: 'cast', description: 'Grey cast iron (EN-GJL-250). Excellent compressive strength, vibration damping, and machinability. No yield point (brittle). Used for engine blocks, machine bases, and housings.' },
  { keys: 'Ductile Iron GGG40', command: 'ρ:7.30 · σy:250 · σu:400 · E:169 · ν:0.28 · α:12.5', category: 'cast', description: 'Ductile cast iron (EN-GJS-400-15). Has yield point and ductility (unlike grey iron). Good machinability. Used for crankshafts, gears, and pressure-containing parts.' },
  { keys: 'Ductile Iron GGG60', command: 'ρ:7.30 · σy:380 · σu:600 · E:174 · ν:0.28 · α:11.7', category: 'cast', description: 'High-strength ductile iron (EN-GJS-600-3). Higher strength than GGG40. Used for gears, crankshafts, and high-stress cast components.' },
  { keys: 'Malleable Iron', command: 'ρ:7.30 · σy:310 · σu:460 · E:170 · ν:0.27 · α:12.0', category: 'cast', description: 'Heat-treated cast iron with improved ductility. Used for pipe fittings, brackets, and components requiring impact resistance. Being replaced by ductile iron in many applications.' },

  // Engineering plastics
  { keys: 'Acetal (POM/Delrin)', command: 'ρ:1.41 · σy:69 · σu:72 · E:3.1 · ν:0.35 · α:85', category: 'plastic', description: 'Excellent dimensional stability, low friction, and good fatigue resistance. Used for gears, bearings, bushings, and precision parts. Easy to machine. No water absorption.' },
  { keys: 'Nylon 6/6', command: 'ρ:1.14 · σy:55 · σu:83 · E:2.8 · ν:0.41 · α:80', category: 'plastic', description: 'High strength, toughness, and wear resistance. Absorbs moisture (affects dimensions). Used for gears, bearings, fasteners, and structural components. Glass-filled grades much stronger.' },
  { keys: 'PEEK', command: 'ρ:1.32 · σy:100 · σu:100 · E:4.0 · ν:0.40 · α:47', category: 'plastic', description: 'High-performance thermoplastic. Excellent mechanical and chemical resistance up to 250°C. Used in aerospace, medical implants, and semiconductor equipment. Very expensive.' },
  { keys: 'PTFE (Teflon)', command: 'ρ:2.20 · σy:12 · σu:25 · E:0.5 · ν:0.46 · α:135', category: 'plastic', description: 'Lowest friction coefficient of any solid. Excellent chemical resistance. Very low strength. Used for seals, gaskets, bearings, and non-stick surfaces. Soft and cold-flows under load.' },
  { keys: 'Acrylic (PMMA)', command: 'ρ:1.18 · σy:72 · σu:75 · E:3.3 · ν:0.37 · α:70', category: 'plastic', description: 'Excellent optical clarity (92% light transmission). Good UV resistance. Brittle. Used for windows, lenses, display cases, and light guides. Easy to machine and polish.' },
  { keys: 'Polycarbonate (PC)', command: 'ρ:1.20 · σy:62 · σu:70 · E:2.6 · ν:0.37 · α:65', category: 'plastic', description: 'Extremely high impact resistance (250× acrylic). Good optical clarity. Used for safety glasses, machine guards, bulletproof glass, and electronic housings. Prone to stress cracking.' },
  { keys: 'ABS', command: 'ρ:1.05 · σy:42 · σu:45 · E:2.1 · ν:0.37 · α:95', category: 'plastic', description: 'Tough, impact-resistant, and easy to machine. Used for housings, automotive interior parts, and 3D printing. Good balance of strength, cost, and processability.' },
  { keys: 'UHMW-PE', command: 'ρ:0.93 · σy:23 · σu:42 · E:0.7 · ν:0.46 · α:150', category: 'plastic', description: 'Ultra-high molecular weight polyethylene. Excellent abrasion and impact resistance. Very low friction. Used for wear strips, chute liners, and marine dock fenders. Difficult to bond.' },
  { keys: 'Glass-Filled Nylon', command: 'ρ:1.50 · σy:130 · σu:180 · E:8.0 · ν:0.38 · α:40', category: 'plastic', description: 'Nylon with 30% glass fiber reinforcement. 2-3× stronger than unfilled nylon. Better dimensional stability and heat resistance. Used for structural brackets and gears under load.' },
];

const TIPS = [
  {
    title: 'Strength-to-weight ratio comparison',
    content: 'By absolute strength, steel is strongest. But by strength-to-weight ratio: Ti-6Al-4V (σy/ρ = 199 MPa·cm³/g) beats 4340 steel (90), 7075-T6 aluminum (179), and 17-4 PH stainless (150). For weight-critical designs, titanium and 7075 aluminum are often better choices than steel despite higher material cost. Always consider cost: steel is ~$1/kg, aluminum ~$3/kg, titanium ~$30/kg.'
  },
  {
    title: 'Thermal expansion in design',
    content: 'Aluminum expands 2× more than steel (23.6 vs 11.9 ×10⁻⁶/K). When combining aluminum and steel in assemblies, differential thermal expansion can cause stress, loosening, or binding. Design with expansion slots, use elastomeric gaskets, or select materials with similar expansion coefficients. For precision equipment, Invar (α = 1.3 ×10⁻⁶/K) is used where dimensional stability across temperature is critical.'
  },
];

export default function MaterialPropertiesClient() {
  return (
    <ShortcutCheatsheetClient
      title="Material Properties"
      subtitle="Mechanical properties of 40+ engineering materials: steels, aluminum, copper, titanium, nickel alloys, cast iron, and plastics."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
