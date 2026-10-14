import fs from 'fs';
import path from 'path';

const toolboxDir = path.resolve('src/app/toolbox');

const UPGRADES = {
  'bearing-life-calculator': {
    idx: 3,
    options: [
      { value: 'ball', label: 'Ball Bearing (p = 3)' },
      { value: 'roller', label: 'Roller Bearing (p = 10/3)' }
    ]
  },
  'boiler-efficiency-calculator': {
    idx: 4,
    options: [
      { value: 'gas', label: 'Natural Gas' },
      { value: 'oil', label: 'Fuel Oil' },
      { value: 'coal', label: 'Coal' }
    ]
  },
  'cable-sizing-calculator': {
    idx: 4,
    options: [
      { value: 'copper', label: 'Copper Conductor (Cu)' },
      { value: 'aluminum', label: 'Aluminum Conductor (Al)' }
    ]
  },
  'cam-profile-calculator': {
    idx: 3,
    options: [
      { value: 'shm', label: 'Simple Harmonic Motion (SHM)' },
      { value: 'uniform', label: 'Uniform Velocity' },
      { value: 'cycloidal', label: 'Cycloidal Motion' }
    ]
  },
  'casting-shrinkage-calculator': {
    idx: 1,
    options: [
      { value: 'cast_iron', label: 'Cast Iron (1.0%)' },
      { value: 'steel', label: 'Cast Steel (2.0%)' },
      { value: 'aluminum', label: 'Aluminum Alloy (1.3%)' },
      { value: 'brass', label: 'Brass / Bronze (1.5%)' }
    ]
  },
  'channel-flow-manning-calculator': {
    idx: 4,
    options: [
      { value: 'rectangular', label: 'Rectangular Flume' },
      { value: 'trapezoidal', label: 'Trapezoidal Channel' }
    ]
  },
  'contour-interval-calculator': {
    idx: 2,
    options: [
      { value: 'flat', label: 'Flat Terrain (1x)' },
      { value: 'rolling', label: 'Rolling Hills (1.5x)' },
      { value: 'mountain', label: 'Mountainous Slope (2x)' }
    ]
  },
  'duct-sizing-calculator': {
    idx: 2,
    options: [
      { value: 'circular', label: 'Circular Duct (Round)' },
      { value: 'rectangular', label: 'Rectangular Duct' }
    ]
  },
  'fsw-welding-calculator': {
    idx: 0,
    options: [
      { value: 'aluminum', label: 'Aluminum Alloy (k=50)' },
      { value: 'steel', label: 'Structural Steel (k=200)' },
      { value: 'copper', label: 'Copper / Brass (k=80)' }
    ]
  },
  'gear-module-pitch-calculator': {
    idx: 2,
    options: [
      { value: 'module', label: 'Metric Module (m)' },
      { value: 'dp', label: 'Diametral Pitch (DP)' }
    ]
  },
  'heat-treatment-time-calculator': [
    {
      idx: 1,
      options: [
        { value: 'carbon_steel', label: 'Plain Carbon Steel' },
        { value: 'alloy_steel', label: 'Low Alloy Steel' },
        { value: 'aluminum', label: 'Aluminum Alloy' }
      ]
    },
    {
      idx: 2,
      options: [
        { value: 'hardening', label: 'Austenitize & Quench (Hardening)' },
        { value: 'tempering', label: 'Tempering (Air Cool)' },
        { value: 'annealing', label: 'Full Annealing (Furnace Cool)' }
      ]
    }
  ],
  'ifc-element-quantity-calculator': {
    idx: 0,
    options: [
      { value: 'column', label: 'Concrete Column (2400 kg/m³)' },
      { value: 'steel', label: 'Structural Steel (7850 kg/m³)' }
    ]
  },
  'manometer-pressure-calculator': {
    idx: 2,
    options: [
      { value: 'u-tube', label: 'Vertical U-Tube Manometer' },
      { value: 'inclined', label: 'Inclined Manometer' }
    ]
  },
  'material-density-calculator': {
    idx: 0,
    options: [
      { value: 'steel', label: 'Carbon Steel (7850 kg/m³)' },
      { value: 'aluminum', label: 'Aluminum 6061 (2700 kg/m³)' },
      { value: 'copper', label: 'Copper (8960 kg/m³)' },
      { value: 'titanium', label: 'Titanium Grade 5 (4500 kg/m³)' }
    ]
  },
  'moment-inertia-shape-calculator': {
    idx: 0,
    options: [
      { value: 'rectangle', label: 'Solid Rectangle (b x h)' },
      { value: 'circle', label: 'Solid Circle (Ø D)' },
      { value: 'hollow_circle', label: 'Hollow Pipe (D_outer / d_inner)' }
    ]
  },
  'motor-starting-current-calculator': {
    idx: 5,
    options: [
      { value: 'three', label: '3-Phase AC (√3 Factor)' },
      { value: 'single', label: '1-Phase AC (Single Phase)' }
    ]
  },
  'natural-frequency-calculator': {
    idx: 0,
    options: [
      { value: 'spring', label: 'Linear Lumped Spring-Mass' },
      { value: 'cantilever', label: 'Cantilever Beam System' }
    ]
  },
  'planetary-gear-calculator': {
    idx: 3,
    options: [
      { value: 'ring-fixed', label: 'Ring Fixed (Sun In / Carrier Out)' },
      { value: 'sun-fixed', label: 'Sun Fixed (Ring In / Carrier Out)' },
      { value: 'carrier-fixed', label: 'Carrier Fixed (Sun In / Ring Out)' }
    ]
  },
  'polishing-time-calculator': {
    idx: 1,
    options: [
      { value: 'medium', label: 'Commercial Satin Finish (1x)' },
      { value: 'fine', label: 'Precision Fine Polish (1.5x)' },
      { value: 'mirror', label: 'Optical Mirror Buffing (2x)' }
    ]
  },
  'reaming-dimension-calculator': {
    idx: 2,
    options: [
      { value: 'steel', label: 'Carbon / Alloy Steel' },
      { value: 'cast_iron', label: 'Cast Iron' },
      { value: 'aluminum', label: 'Aluminum / Non-Ferrous' }
    ]
  },
  'rebar-spacing-calculator': {
    idx: 4,
    options: [
      { value: 'both', label: 'Bidirectional Mesh (X & Y)' },
      { value: 'single', label: 'Unidirectional Bar Run' }
    ]
  },
  'section-property-shape-calculator': {
    idx: 0,
    options: [
      { value: 'rectangle', label: 'Solid Rectangle' },
      { value: 'circle', label: 'Solid Circle' }
    ]
  },
  'steel-grade-selector': {
    idx: 0,
    options: [
      { value: 'Q235', label: 'Q235 (fy=235 MPa, fu=375 MPa)' },
      { value: 'Q345', label: 'Q345 (fy=345 MPa, fu=510 MPa)' },
      { value: 'Q390', label: 'Q390 (fy=390 MPa, fu=530 MPa)' },
      { value: 'Q420', label: 'Q420 (fy=420 MPa, fu=580 MPa)' },
      { value: 'A36', label: 'ASTM A36 (fy=250 MPa, fu=400 MPa)' },
      { value: 'A572', label: 'ASTM A572 Gr50 (fy=345 MPa, fu=450 MPa)' }
    ]
  },
  'steel-weight-calculator': {
    idx: 0,
    options: [
      { value: 'ibeam', label: 'I-Beam / Wide Flange' },
      { value: 'tube', label: 'Square / Rectangular Tube' },
      { value: 'angle', label: 'Structural Angle' }
    ]
  },
  'surface-hardness-converter': {
    idx: 1,
    options: [
      { value: 'HV', label: 'Vickers Hardness (HV)' },
      { value: 'HRC', label: 'Rockwell C (HRC)' },
      { value: 'HB', label: 'Brinell Hardness (HB)' },
      { value: 'HRB', label: 'Rockwell B (HRB)' }
    ]
  },
  'thermal-expansion-calculator': {
    idx: 0,
    options: [
      { value: 'steel', label: 'Structural Carbon Steel (12 µm/m·K)' },
      { value: 'aluminum', label: 'Aluminum Alloy (23 µm/m·K)' },
      { value: 'copper', label: 'Pure Copper (17 µm/m·K)' },
      { value: 'concrete', label: 'Reinforced Concrete (10 µm/m·K)' }
    ]
  },
  'thermal-expansion-pipe-calculator': {
    idx: 2,
    options: [
      { value: 'steel', label: 'Carbon Steel Pipe (12 µm/m·K)' },
      { value: 'copper', label: 'Copper Pipe (17 µm/m·K)' },
      { value: 'plastic', label: 'PVC / PEX Pipe (23 µm/m·K)' }
    ]
  },
  'transformer-calculator': {
    idx: 3,
    options: [
      { value: 'three', label: '3-Phase Transformer' },
      { value: 'single', label: '1-Phase Transformer' }
    ]
  },
  'voltage-drop-calculator': {
    idx: 4,
    options: [
      { value: 'single', label: 'Single Phase (2-wire, 2.0x)' },
      { value: 'three', label: 'Three Phase (3/4-wire, √3=1.732x)' }
    ]
  },
  'water-pipe-sizing-calculator': {
    idx: 2,
    options: [
      { value: 'pvc', label: 'PVC Pipe (Smooth f=0.015)' },
      { value: 'steel', label: 'Galvanized Steel / Iron (f=0.025)' }
    ]
  },
  'weir-flow-calculator': {
    idx: 0,
    options: [
      { value: 'rectangular', label: 'Rectangular Sharp-Crested Weir' },
      { value: 'v-notch', label: 'V-Notch (Triangular 90°) Weir' }
    ]
  }
};

let modifiedCount = 0;

for (const [slug, item] of Object.entries(UPGRADES)) {
  const filePath = path.join(toolboxDir, slug, 'calculator-client.tsx');
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const items = Array.isArray(item) ? item : [item];

  for (const { idx, options } of items) {
    // 匹配类似:
    // <input type="text" value={inputs[idx]} onChange={e => updateInput(idx, e.target.value)} ... />
    const inputRegex = new RegExp(`<input\\s+type="text"\\s+value=\\{inputs\\[${idx}\\]\\}\\s+onChange=\\{e\\s*=>\\s*updateInput\\(${idx},\\s*e\\.target\\.value\\)\\}[^>]*\\/>`, 'g');
    
    const optionsHtml = options.map(o => `              <option value="${o.value}">${o.label}</option>`).join('\n');
    const selectHtml = `<select value={inputs[${idx}]} onChange={e => updateInput(${idx}, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all">
${optionsHtml}
            </select>`;

    if (inputRegex.test(content)) {
      content = content.replace(inputRegex, selectHtml);
      modifiedCount++;
      console.log(`Updated ${slug} (Input[${idx}] -> select)`);
    } else {
      console.warn(`Could not match input[${idx}] in ${slug}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`Successfully upgraded ${modifiedCount} input fields to <select>!`);
