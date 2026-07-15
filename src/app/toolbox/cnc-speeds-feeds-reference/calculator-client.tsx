'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'hss', name: '🔧 HSS Tool Speeds' },
  { id: 'carbide', name: '⚙️ Carbide Tool Speeds' },
  { id: 'chipload', name: '📏 Chip Load (fz)' },
  { id: 'drilling', name: '🕳️ Drilling Speeds' },
  { id: 'tips', name: '💡 Material Tips' },
];

const SHORTCUTS = [
  // HSS cutting speeds (Vc in m/min)
  { keys: 'Aluminum — HSS', command: 'Vc: 150-300 m/min', category: 'hss', description: 'Soft aluminum alloys (6061, 6063). High cutting speed. Use coolant or air blast for chip evacuation. Watch for built-up edge — use polished tools.' },
  { keys: 'Brass — HSS', command: 'Vc: 60-100 m/min', category: 'hss', description: 'Free-machining brass (C360). Easy to machine. No coolant needed for light cuts. Watch for chip grabbing — use climb milling.' },
  { keys: 'Copper — HSS', command: 'Vc: 50-80 m/min', category: 'hss', description: 'Pure copper is gummy. Use sharp tools with high rake angles. Coolant recommended. Lower speeds for better surface finish.' },
  { keys: 'Mild Steel — HSS', command: 'Vc: 25-35 m/min', category: 'hss', description: 'Low carbon steel (AISI 1018, 1020). General purpose machining. Use coolant for longer tool life. Moderate feeds.' },
  { keys: 'Medium Steel — HSS', command: 'Vc: 20-28 m/min', category: 'hss', description: 'Medium carbon steel (AISI 1045). Harder than mild steel. Reduce speed by 20%. Coolant essential for good finish.' },
  { keys: 'Tool Steel — HSS', command: 'Vc: 15-22 m/min', category: 'hss', description: 'Tool steel (AISI O1, D2 annealed). Difficult to machine with HSS. Use carbide if possible. Heavy coolant flow required.' },
  { keys: 'Stainless 304 — HSS', command: 'Vc: 12-20 m/min', category: 'hss', description: 'Austenitic stainless (AISI 304). Work hardens — maintain feed to avoid rubbing. Coolant essential. Sharp tools critical.' },
  { keys: 'Stainless 316 — HSS', command: 'Vc: 10-16 m/min', category: 'hss', description: 'Marine grade stainless (AISI 316). Tougher than 304. Reduce speeds by 20%. Heavy coolant. Avoid dwelling.' },
  { keys: 'Cast Iron — HSS', command: 'Vc: 20-30 m/min', category: 'hss', description: 'Grey cast iron (GG25). Abrasive but free-cutting. No coolant (use air/compressed air) to prevent chip dust. Carbide preferred.' },
  { keys: 'Titanium — HSS', command: 'Vc: 8-15 m/min', category: 'hss', description: 'Ti-6Al-4V. Very difficult with HSS. Use carbide. High coolant pressure essential. Low speeds, maintain feed to avoid work hardening.' },
  { keys: 'Plastic (Acrylic) — HSS', command: 'Vc: 100-200 m/min', category: 'hss', description: 'Acrylic/PMMA. Sharp tools, high rake angles. No coolant — use compressed air. Watch for melting — reduce speed if edges look melted.' },
  { keys: 'Plastic (Delrin) — HSS', command: 'Vc: 120-250 m/min', category: 'hss', description: 'POM/Delrin. Easy to machine. Sharp tools. Air blast for chip clearing. Can run dry. Watch for thermal expansion.' },

  // Carbide cutting speeds (Vc in m/min)
  { keys: 'Aluminum — Carbide', command: 'Vc: 300-1000 m/min', category: 'carbide', description: 'Aluminum alloys (6061, 7075). Very high speeds with carbide. Use polished, uncoated carbide. No coolant needed for dry machining. Air blast for chip clearance.' },
  { keys: 'Brass — Carbide', command: 'Vc: 200-400 m/min', category: 'carbide', description: 'Free-machining brass. High speeds. Uncoated carbide. Dry machining typical. Watch chip color — blue/straw indicates good speed.' },
  { keys: 'Mild Steel — Carbide', command: 'Vc: 150-250 m/min', category: 'carbide', description: 'Low carbon steel. Use TiAlN coated carbide. Coolant optional for light cuts. Flood coolant for deep cuts. 3-5× faster than HSS.' },
  { keys: 'Medium Steel — Carbide', command: 'Vc: 120-200 m/min', category: 'carbide', description: 'Medium carbon steel. TiAlN coating. Coolant for heavy cuts. Good chip control essential.' },
  { keys: 'Tool Steel — Carbide', command: 'Vc: 60-120 m/min', category: 'carbide', description: 'Tool steel (annealed). TiAlN or AlTiN coating. Flood coolant. Rigid setup essential. Watch for chipping — reduce feed at entry/exit.' },
  { keys: 'Stainless 304 — Carbide', command: 'Vc: 100-180 m/min', category: 'carbide', description: 'Austenitic stainless. Use TiAlN coated carbide. High coolant pressure. Maintain chip load — never let tool rub. Climb milling preferred.' },
  { keys: 'Stainless 316 — Carbide', command: 'Vc: 80-140 m/min', category: 'carbide', description: 'Marine grade stainless. Harder than 304. TiAlN coating. Heavy coolant. Reduce speed 20% from 304 values.' },
  { keys: 'Cast Iron — Carbide', command: 'Vc: 100-250 m/min', category: 'carbide', description: 'Grey cast iron. CBN or ceramic for hard grades. Dry machining with air. Abrasive — expect tool wear from graphite flakes.' },
  { keys: 'Titanium — Carbide', command: 'Vc: 40-80 m/min', category: 'carbide', description: 'Ti-6Al-4V. Use uncoated or TiAlN carbide. High-pressure coolant (70+ bar). Low speed, high feed. Rigid setup. Chip evacuation critical.' },
  { keys: 'Inconel — Carbide', command: 'Vc: 30-60 m/min', category: 'carbide', description: 'Nickel superalloy (Inconel 718). Very difficult. Ceramic inserts for roughing. Carbide for finishing. High-pressure coolant. Very rigid setup.' },
  { keys: 'Plastic (Acrylic) — Carbide', command: 'Vc: 300-600 m/min', category: 'carbide', description: 'Acrylic/PMMA. Polished carbide, high rake. Air blast. Watch for melting — if edges are rough, reduce speed or add air cooling.' },
  { keys: 'Plastic (Delrin) — Carbide', command: 'Vc: 400-800 m/min', category: 'carbide', description: 'POM/Delrin. Very high speeds possible. Sharp polished carbide. Dry machining. Air for chip clearing.' },

  // Chip load (feed per tooth, fz in mm) for 6-10mm end mills
  { keys: 'Aluminum — fz', command: '0.05-0.15 mm/tooth', category: 'chipload', description: '6-10mm carbide end mill in aluminum. Higher fz for roughing, lower for finishing. 2-3 flute for slots, 1 flute for deep pocketing.' },
  { keys: 'Mild Steel — fz', command: '0.03-0.08 mm/tooth', category: 'chipload', description: '6-10mm carbide end mill in mild steel. 3-4 flute for steel. Reduce fz for thin walls. Maintain minimum chip to avoid rubbing.' },
  { keys: 'Stainless — fz', command: '0.02-0.06 mm/tooth', category: 'chipload', description: '6-10mm carbide end mill in stainless. Critical: never below 0.02mm — work hardening occurs. 4 flute carbide. Coolant on.' },
  { keys: 'Cast Iron — fz', command: '0.04-0.10 mm/tooth', category: 'chipload', description: '6-10mm carbide end mill in cast iron. 3-4 flute. Dry machining. Chips are powdery — use air to clear.' },
  { keys: 'Titanium — fz', command: '0.02-0.05 mm/tooth', category: 'chipload', description: '6-10mm carbide end mill in titanium. Very low fz. High-pressure coolant. 3-4 flute. Rigid setup. Climb milling only.' },
  { keys: 'Plastic — fz', command: '0.08-0.25 mm/tooth', category: 'chipload', description: '6-10mm carbide in plastic. High fz to get chips (not dust). 1-2 flute to prevent clogging. Air blast for cooling.' },
  { keys: 'Brass — fz', command: '0.05-0.12 mm/tooth', category: 'chipload', description: '6-10mm carbide in brass. 2-3 flute. Watch for chip grabbing in drilling — use peck drilling cycle.' },

  // Drilling speeds (Vc in m/min) — HSS twist drills
  { keys: 'Aluminum — Drill', command: 'Vc: 80-120 m/min (HSS)', category: 'drilling', description: 'Aluminum drilling. Use polished drills. Peck drilling for deep holes (>3×D). Coolant or air for chip evacuation. Point angle 118°.' },
  { keys: 'Mild Steel — Drill', command: 'Vc: 25-35 m/min (HSS)', category: 'drilling', description: 'Mild steel drilling. Standard 118° point. Coolant essential. Peck drilling for holes deeper than 3× diameter. Clear chips frequently.' },
  { keys: 'Stainless — Drill', command: 'Vc: 10-18 m/min (HSS)', category: 'drilling', description: 'Stainless drilling. 135° split point. Heavy coolant. Peck drilling mandatory — small pecks (1×D). Work hardens if tool rubs.' },
  { keys: 'Cast Iron — Drill', command: 'Vc: 20-35 m/min (HSS)', category: 'drilling', description: 'Cast iron drilling. 118° point. No coolant — use air. Chips are powdery. Drill tends to grab — use feed control.' },
  { keys: 'Titanium — Drill', command: 'Vc: 8-12 m/min (HSS)', category: 'drilling', description: 'Titanium drilling. 135° split point. High-pressure coolant. Very short pecks (0.5×D). Carbide drills recommended for production.' },
  { keys: 'Brass — Drill', command: 'Vc: 50-80 m/min (HSS)', category: 'drilling', description: 'Brass drilling. Modified point (rake thinned) to prevent grabbing. No coolant needed for shallow holes. Peck for deep holes.' },
  { keys: 'Plastic — Drill', command: 'Vc: 50-100 m/min (HSS)', category: 'drilling', description: 'Plastic drilling. Modified point (60-80° for acrylic). Slow feed to prevent cracking. Air cooling. Clear chips to prevent melting.' },

  // Material-specific tips
  { keys: 'Aluminum Tip', command: 'BUE Prevention', category: 'tips', description: 'Aluminum builds up on cutting edges (BUE). Use polished, uncoated carbide tools with high positive rake. Apply coolant or air blast. If BUE occurs, increase speed — counterintuitive but effective.' },
  { keys: 'Stainless Tip', command: 'Work Hardening', category: 'tips', description: 'Stainless work hardens rapidly. Never let the tool rub — always maintain chip load. Use climb milling. If tool dwell occurs, material hardens and tool fails. Sharp tools are essential.' },
  { keys: 'Titanium Tip', command: 'Heat Management', category: 'tips', description: 'Titanium has poor thermal conductivity — heat stays at the cutting edge. High-pressure coolant (70+ bar) is essential. Keep speeds low, feeds consistent. Use sharp tools. Never stop feed while tool is in cut.' },
  { keys: 'Cast Iron Tip', command: 'Abrasive Wear', category: 'tips', description: 'Grey cast iron contains graphite flakes that are abrasive. Use CBN or ceramic inserts for production. Dry machining — coolant can cause cracking via thermal shock. Air blast for chip/dust clearance.' },
  { keys: 'Inconel Tip', command: 'Rigidity Critical', category: 'tips', description: 'Nickel superalloys require extreme rigidity. Any vibration causes tool failure. Use shortest possible tool overhang. Ceramic inserts for roughing at 150-300 m/min. Carbide for finishing. High-pressure coolant mandatory.' },
  { keys: 'Plastic Tip', command: 'Melting Prevention', category: 'tips', description: 'Plastics melt rather than cut if speeds/feeds are wrong. Use sharp, polished tools with high rake angles. Air blast for cooling. If melting occurs: reduce RPM, increase feed, or add cooling. Acrylic needs special 60-80° drill points.' },
  { keys: 'Brass Tip', command: 'Chip Grabbing', category: 'tips', description: 'Brass drills tend to grab and pull into the work. Use drills with thinned rake (modified point) or reduce helix angle. Peck drilling cycle prevents grabbing. For tapping, use spiral flute taps designed for brass.' },
];

const TIPS = [
  {
    title: 'Speeds and feeds are starting points, not rules',
    content: 'These values are conservative starting points for rigid machines with good workholding. Always adjust based on: (1) machine rigidity — less rigid = lower speeds, (2) tool condition — dull tools need lower speeds, (3) depth of cut — deeper cuts need lower speeds, (4) coolant availability — dry machining needs lower speeds. Start at 70% of listed value and increase while monitoring spindle load and surface finish.'
  },
  {
    title: 'Chip color tells you if speed is right',
    content: 'For steel machining, chip color indicates cutting temperature: silver/pale straw = good (200-300°C), blue = hot but acceptable (300-400°C), black/blue = too hot — reduce speed. For aluminum, chips should be clean and bright. If chips are discolored or welded to the tool, reduce speed and check coolant. No chips (dust) means rubbing — increase feed.'
  },
];

export default function CncSpeedsFeedsClient() {
  return (
    <ShortcutCheatsheetClient
      title="CNC Speeds & Feeds"
      subtitle="Cutting speeds (Vc) and feed rates for HSS and carbide tools across 12+ materials, with chip load data, drilling speeds, and material-specific tips."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
