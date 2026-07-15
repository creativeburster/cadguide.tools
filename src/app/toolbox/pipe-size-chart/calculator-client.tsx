'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'sch40', name: '📏 Schedule 40 (Standard)' },
  { id: 'sch80', name: '📏 Schedule 80 (XS)' },
  { id: 'sch10', name: '📏 Schedule 10 (Thin)' },
  { id: 'sch160', name: '📏 Schedule 160 (XXS)' },
  { id: 'conversion', name: '🔄 NPS ↔ DN Conversion' },
];

const SHORTCUTS = [
  // Schedule 40 — most common
  { keys: 'NPS 1/8" Sch40', command: 'DN6 · OD10.3mm · Wall1.73 · ID6.84 · 0.36kg/m', category: 'sch40', description: 'Smallest standard pipe. Used for instrument tubing and small connections. Sch 40 = standard weight for this size.' },
  { keys: 'NPS 1/4" Sch40', command: 'DN8 · OD13.7mm · Wall2.24 · ID9.22 · 0.63kg/m', category: 'sch40', description: 'Small pipe for instrument air and low-flow applications. OD is 13.7mm (0.540"), not 0.250".' },
  { keys: 'NPS 3/8" Sch40', command: 'DN10 · OD17.1mm · Wall2.31 · ID12.48 · 0.84kg/m', category: 'sch40', description: 'Small pipe for plumbing and low-pressure applications. OD 17.1mm (0.675").' },
  { keys: 'NPS 1/2" Sch40', command: 'DN15 · OD21.3mm · Wall2.77 · ID15.76 · 1.27kg/m', category: 'sch40', description: 'Very common pipe size. Used for water lines, gas lines, and general plumbing. OD 21.3mm (0.840"). Note: NPS 1/2" OD is larger than NPS 3/8" OD.' },
  { keys: 'NPS 3/4" Sch40', command: 'DN20 · OD26.7mm · Wall2.87 · ID20.96 · 1.69kg/m', category: 'sch40', description: 'Common residential plumbing size. OD 26.7mm (1.050"). Used for water supply lines and heating systems.' },
  { keys: 'NPS 1" Sch40', command: 'DN25 · OD33.4mm · Wall3.38 · ID26.64 · 2.50kg/m', category: 'sch40', description: 'Very common pipe. OD 33.4mm (1.315") — NOT 25.4mm. Used for water, gas, steam, and general industrial piping.' },
  { keys: 'NPS 1-1/4" Sch40', command: 'DN32 · OD42.2mm · Wall3.56 · ID35.08 · 3.39kg/m', category: 'sch40', description: 'Medium pipe. OD 42.2mm (1.660"). Used for plumbing and medium-flow applications.' },
  { keys: 'NPS 1-1/2" Sch40', command: 'DN40 · OD48.3mm · Wall3.68 · ID40.94 · 4.05kg/m', category: 'sch40', description: 'Common medium pipe. OD 48.3mm (1.900"). Used for water supply, heating, and process piping.' },
  { keys: 'NPS 2" Sch40', command: 'DN50 · OD60.3mm · Wall3.91 · ID52.48 · 5.44kg/m', category: 'sch40', description: 'One of the most common pipe sizes. OD 60.3mm (2.375"). Used for water mains, steam lines, and industrial process piping.' },
  { keys: 'NPS 2-1/2" Sch40', command: 'DN65 · OD73.0mm · Wall5.16 · ID62.68 · 8.63kg/m', category: 'sch40', description: 'Medium-large pipe. OD 73.0mm (2.875"). Note: wall thickness jumps significantly at this size.' },
  { keys: 'NPS 3" Sch40', command: 'DN80 · OD88.9mm · Wall5.49 · ID77.92 · 11.29kg/m', category: 'sch40', description: 'Common industrial pipe. OD 88.9mm (3.500"). Used for process piping, water distribution, and fire protection.' },
  { keys: 'NPS 4" Sch40', command: 'DN100 · OD114.3mm · Wall6.02 · ID102.26 · 16.07kg/m', category: 'sch40', description: 'Very common industrial pipe. OD 114.3mm (4.500"). Used for water mains, process piping, and HVAC.' },
  { keys: 'NPS 6" Sch40', command: 'DN150 · OD168.3mm · Wall7.11 · ID154.08 · 28.23kg/m', category: 'sch40', description: 'Large industrial pipe. OD 168.3mm (6.625"). Used for water distribution, process piping, and structural applications.' },
  { keys: 'NPS 8" Sch40', command: 'DN200 · OD219.1mm · Wall8.18 · ID202.74 · 42.55kg/m', category: 'sch40', description: 'Large pipe for industrial and municipal applications. OD 219.1mm (8.625"). Used for water mains and process piping.' },
  { keys: 'NPS 10" Sch40', command: 'DN250 · OD273.0mm · Wall9.27 · ID254.46 · 60.31kg/m', category: 'sch40', description: 'Very large pipe. OD 273.0mm (10.750"). Used for municipal water and large industrial applications.' },
  { keys: 'NPS 12" Sch40', command: 'DN300 · OD323.8mm · Wall10.31 · ID303.18 · 80.33kg/m', category: 'sch40', description: 'Large municipal/industrial pipe. OD 323.8mm (12.750"). Note: NPS 12" and above, OD ≈ NPS in inches.' },

  // Schedule 80 (Extra Strong / XS)
  { keys: 'NPS 1/2" Sch80', command: 'DN15 · OD21.3mm · Wall3.73 · ID13.84 · 1.62kg/m', category: 'sch80', description: 'Sch 80 for 1/2" pipe. Thicker wall than Sch 40 (3.73 vs 2.77mm). Used for higher pressure applications. ID reduced to 13.84mm.' },
  { keys: 'NPS 3/4" Sch80', command: 'DN20 · OD26.7mm · Wall3.91 · ID18.88 · 2.19kg/m', category: 'sch80', description: 'Sch 80 for 3/4" pipe. Wall 3.91mm vs 2.87mm (Sch 40). Higher pressure rating. ID 18.88mm.' },
  { keys: 'NPS 1" Sch80', command: 'DN25 · OD33.4mm · Wall4.55 · ID24.30 · 3.24kg/m', category: 'sch80', description: 'Sch 80 for 1" pipe. Wall 4.55mm vs 3.38mm (Sch 40). Significantly higher pressure capacity. ID 24.30mm.' },
  { keys: 'NPS 1-1/2" Sch80', command: 'DN40 · OD48.3mm · Wall5.08 · ID38.14 · 5.41kg/m', category: 'sch80', description: 'Sch 80 for 1-1/2" pipe. Wall 5.08mm. Used for high-pressure process piping. ID 38.14mm.' },
  { keys: 'NPS 2" Sch80', command: 'DN50 · OD60.3mm · Wall5.54 · ID49.22 · 7.47kg/m', category: 'sch80', description: 'Sch 80 for 2" pipe. Wall 5.54mm vs 3.91mm (Sch 40). Common for high-pressure steam and chemical lines.' },
  { keys: 'NPS 3" Sch80', command: 'DN80 · OD88.9mm · Wall7.62 · ID73.66 · 15.27kg/m', category: 'sch80', description: 'Sch 80 for 3" pipe. Wall 7.62mm. Used for high-pressure industrial applications. ID 73.66mm.' },
  { keys: 'NPS 4" Sch80', command: 'DN100 · OD114.3mm · Wall8.56 · ID97.18 · 22.32kg/m', category: 'sch80', description: 'Sch 80 for 4" pipe. Wall 8.56mm. Used for high-pressure process piping and chemical applications.' },
  { keys: 'NPS 6" Sch80', command: 'DN150 · OD168.3mm · Wall10.97 · ID146.36 · 38.47kg/m', category: 'sch80', description: 'Sch 80 for 6" pipe. Wall 10.97mm. Heavy wall for high-pressure applications. ID 146.36mm.' },
  { keys: 'NPS 8" Sch80', command: 'DN200 · OD219.1mm · Wall12.70 · ID193.70 · 62.54kg/m', category: 'sch80', description: 'Sch 80 for 8" pipe. Wall 12.70mm. Used for high-pressure municipal and industrial piping.' },

  // Schedule 10 (thin wall)
  { keys: 'NPS 1/2" Sch10', command: 'DN15 · OD21.3mm · Wall1.65 · ID18.00 · 0.80kg/m', category: 'sch10', description: 'Sch 10 for 1/2" pipe. Thin wall (1.65mm). Used for low-pressure applications and where weight savings matter. Stainless steel common.' },
  { keys: 'NPS 3/4" Sch10', command: 'DN20 · OD26.7mm · Wall1.65 · ID23.40 · 1.02kg/m', category: 'sch10', description: 'Sch 10 for 3/4" pipe. Thin wall. Used for low-pressure fluid transport and food industry.' },
  { keys: 'NPS 1" Sch10', command: 'DN25 · OD33.4mm · Wall1.65 · ID30.10 · 1.29kg/m', category: 'sch10', description: 'Sch 10 for 1" pipe. Very thin wall. Common in stainless steel for food, pharmaceutical, and chemical applications.' },
  { keys: 'NPS 2" Sch10', command: 'DN50 · OD60.3mm · Wall2.11 · ID56.08 · 3.03kg/m', category: 'sch10', description: 'Sch 10 for 2" pipe. Thin wall. Used for low-pressure systems, drainage, and stainless steel process piping.' },
  { keys: 'NPS 3" Sch10', command: 'DN80 · OD88.9mm · Wall2.11 · ID84.68 · 4.52kg/m', category: 'sch10', description: 'Sch 10 for 3" pipe. Thin wall. Common in stainless steel for food and chemical industries.' },
  { keys: 'NPS 4" Sch10', command: 'DN100 · OD114.3mm · Wall2.11 · ID110.08 · 5.84kg/m', category: 'sch10', description: 'Sch 10 for 4" pipe. Thin wall. Used for low-pressure stainless steel piping systems.' },
  { keys: 'NPS 6" Sch10', command: 'DN150 · OD168.3mm · Wall2.77 · ID162.76 · 11.29kg/m', category: 'sch10', description: 'Sch 10 for 6" pipe. Thin wall. Used for large-diameter low-pressure applications.' },

  // Schedule 160 (Double Extra Strong / XXS for small sizes)
  { keys: 'NPS 1/2" Sch160', command: 'DN15 · OD21.3mm · Wall4.78 · ID11.74 · 1.95kg/m', category: 'sch160', description: 'Sch 160 for 1/2" pipe. Very thick wall (4.78mm). Used for very high pressure. ID only 11.74mm — significant flow reduction.' },
  { keys: 'NPS 1" Sch160', command: 'DN25 · OD33.4mm · Wall6.35 · ID20.70 · 4.24kg/m', category: 'sch160', description: 'Sch 160 for 1" pipe. Wall 6.35mm. Very high pressure rating. ID reduced to 20.70mm. Used in high-pressure hydraulic and chemical systems.' },
  { keys: 'NPS 2" Sch160', command: 'DN50 · OD60.3mm · Wall8.74 · ID42.82 · 11.11kg/m', category: 'sch160', description: 'Sch 160 for 2" pipe. Wall 8.74mm. Very heavy wall. ID 42.82mm. Used for extreme pressure applications.' },
  { keys: 'NPS 3" Sch160', command: 'DN80 · OD88.9mm · Wall11.13 · ID66.64 · 21.77kg/m', category: 'sch160', description: 'Sch 160 for 3" pipe. Wall 11.13mm. Extremely heavy wall. Used for very high pressure steam and chemical processes.' },
  { keys: 'NPS 4" Sch160', command: 'DN100 · OD114.3mm · Wall13.49 · ID87.32 · 33.32kg/m', category: 'sch160', description: 'Sch 160 for 4" pipe. Wall 13.49mm. Very heavy wall for extreme pressure. ID 87.32mm.' },
  { keys: 'NPS 6" Sch160', command: 'DN150 · OD168.3mm · Wall18.26 · ID131.78 · 67.56kg/m', category: 'sch160', description: 'Sch 160 for 6" pipe. Wall 18.26mm. Extremely heavy. Used in high-pressure power plant and refinery piping.' },

  // NPS to DN conversion
  { keys: 'NPS 1/8"', command: 'DN6 · OD10.3mm (0.405")', category: 'conversion', description: 'NPS 1/8" = DN6. OD = 10.3mm. Note: NPS is nominal — actual OD is larger than the nominal size for sizes ≤ 12".' },
  { keys: 'NPS 1/4"', command: 'DN8 · OD13.7mm (0.540")', category: 'conversion', description: 'NPS 1/4" = DN8. OD = 13.7mm. The actual OD is more than double the nominal 1/4" (6.35mm).' },
  { keys: 'NPS 3/8"', command: 'DN10 · OD17.1mm (0.675")', category: 'conversion', description: 'NPS 3/8" = DN10. OD = 17.1mm. DN10 is the metric designation used in European standards.' },
  { keys: 'NPS 1/2"', command: 'DN15 · OD21.3mm (0.840")', category: 'conversion', description: 'NPS 1/2" = DN15. OD = 21.3mm. One of the most referenced conversions. DN15 is used in EN/DIN standards.' },
  { keys: 'NPS 3/4"', command: 'DN20 · OD26.7mm (1.050")', category: 'conversion', description: 'NPS 3/4" = DN20. OD = 26.7mm. Common residential plumbing size worldwide.' },
  { keys: 'NPS 1"', command: 'DN25 · OD33.4mm (1.315")', category: 'conversion', description: 'NPS 1" = DN25. OD = 33.4mm. Note: OD is 1.315", not 1.000". This is the most common source of confusion in pipe sizing.' },
  { keys: 'NPS 1-1/4"', command: 'DN32 · OD42.2mm (1.660")', category: 'conversion', description: 'NPS 1-1/4" = DN32. OD = 42.2mm. DN32 is used in EN standards.' },
  { keys: 'NPS 1-1/2"', command: 'DN40 · OD48.3mm (1.900")', category: 'conversion', description: 'NPS 1-1/2" = DN40. OD = 48.3mm. Common in heating and plumbing systems.' },
  { keys: 'NPS 2"', command: 'DN50 · OD60.3mm (2.375")', category: 'conversion', description: 'NPS 2" = DN50. OD = 60.3mm. One of the most common industrial pipe sizes. DN50 is the European equivalent.' },
  { keys: 'NPS 2-1/2"', command: 'DN65 · OD73.0mm (2.875")', category: 'conversion', description: 'NPS 2-1/2" = DN65. OD = 73.0mm. Less common than 2" or 3".' },
  { keys: 'NPS 3"', command: 'DN80 · OD88.9mm (3.500")', category: 'conversion', description: 'NPS 3" = DN80. OD = 88.9mm. Very common industrial size. DN80 in European standards.' },
  { keys: 'NPS 4"', command: 'DN100 · OD114.3mm (4.500")', category: 'conversion', description: 'NPS 4" = DN100. OD = 114.3mm. One of the most common large pipe sizes. DN100 is the European equivalent.' },
  { keys: 'NPS 6"', command: 'DN150 · OD168.3mm (6.625")', category: 'conversion', description: 'NPS 6" = DN150. OD = 168.3mm. Common for water distribution and structural applications.' },
  { keys: 'NPS 8"', command: 'DN200 · OD219.1mm (8.625")', category: 'conversion', description: 'NPS 8" = DN200. OD = 219.1mm. Large industrial and municipal pipe.' },
  { keys: 'NPS 10"', command: 'DN250 · OD273.0mm (10.750")', category: 'conversion', description: 'NPS 10" = DN250. OD = 273.0mm. Used for large water mains and industrial piping.' },
  { keys: 'NPS 12"', command: 'DN300 · OD323.8mm (12.750")', category: 'conversion', description: 'NPS 12" = DN300. OD = 323.8mm. For NPS ≥ 14", OD ≈ NPS in inches. NPS 12" is the last size where OD differs significantly.' },
  { keys: 'NPS 14"', command: 'DN350 · OD355.6mm (14.000")', category: 'conversion', description: 'NPS 14" = DN350. OD = 355.6mm = exactly 14". From NPS 14" onward, OD = NPS in inches.' },
  { keys: 'NPS 16"', command: 'DN400 · OD406.4mm (16.000")', category: 'conversion', description: 'NPS 16" = DN400. OD = 406.4mm = exactly 16". Large municipal and industrial pipe.' },
  { keys: 'NPS 20"', command: 'DN500 · OD508.0mm (20.000")', category: 'conversion', description: 'NPS 20" = DN500. OD = 508.0mm = exactly 20". Used for major water and oil pipelines.' },
  { keys: 'NPS 24"', command: 'DN600 · OD609.6mm (24.000")', category: 'conversion', description: 'NPS 24" = DN600. OD = 609.6mm = exactly 24". Large-diameter pipeline for water, oil, and gas.' },
];

const TIPS = [
  {
    title: 'NPS is NOT the actual diameter',
    content: 'The most common mistake in pipe sizing: NPS (Nominal Pipe Size) is NOT the outside diameter. For NPS ≤ 12", the OD is always larger than the nominal size. Example: NPS 2" pipe has OD 2.375" (60.3mm), not 2.000". For NPS ≥ 14", the OD equals NPS in inches (NPS 14" = OD 14.000"). The nominal size is a historical designation — always look up the actual OD from a pipe chart.'
  },
  {
    title: 'Selecting the right Schedule',
    content: 'Schedule 40 is the default for general applications (water, gas, low-pressure steam). Schedule 80 (XS) is used for higher pressure — wall is ~50% thicker. Schedule 10 is used for thin-wall stainless steel piping in food/pharma. Schedule 160 is for very high pressure (hydraulic, high-pressure steam). Pressure rating also depends on material: carbon steel Sch 40 NPS 2" is rated ~140 bar, while PVC Sch 40 NPS 2" is only rated ~15 bar at 20°C.'
  },
];

export default function PipeSizeClient() {
  return (
    <ShortcutCheatsheetClient
      title="Pipe Size Chart"
      subtitle="Complete pipe size chart: NPS to DN conversion, outside diameter, wall thickness for Schedule 10-160, inside diameter, and weight per meter."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
