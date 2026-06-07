const fs = require('fs');
const path = require('path');

const toolboxDataPath = path.join(__dirname, '..', 'src', 'lib', 'toolbox-data.ts');

const keywordsEnrichment = {
  'limits-and-fits-calculator': [
    'engineering tolerance calculator ISO 2768',
    'shaft and hole fit calculator for CAD',
    'ISO 286 tolerance limits online',
    'hole and shaft clearance fit table',
    'limits and fits metric calculator'
  ],
  'thread-drill-size-calculator': [
    'thread size calculator metric imperial',
    'tap drill size calculator online',
    'metric thread tolerance chart',
    'internal thread pitch diameter calculator'
  ],
  'screw-torque-preload-calculator': [
    'bolt tightening torque standards calculator',
    'mechanical screw preload tension calculator',
    'VDI 2230 bolt torque guide',
    'high-tensile fasteners torque values chart'
  ],
  'weld-strength-calculator': [
    'weld strength calculator AISC ASD',
    'fillet weld throat thickness calculator',
    'steel joint fillet weld load capacity',
    'effective throat weld sizing standard'
  ],
  'spring-force-rate-calculator': [
    'helical compression spring rate calculator',
    'spring stiffness calculation online',
    'solid height limit spring deflection force',
    'torsional shear stress wahl factor'
  ],
  'duct-size-friction-loss-calculator': [
    'hvac air duct sizing tool friction loss',
    'rectangular duct equivalent diameter calculator',
    'ashrae duct velocity limits online',
    'colebrook equation air duct pressure drop'
  ],
  'cad-limits-checker': [
    'paper size to scale converter ANSI ISO',
    'AutoCAD limits and grid boundaries calculator',
    'A3 layout model space coordinates',
    'zoom all limits autocad script generator'
  ],
  'cad-hatch-scale-optimizer': [
    'hatch density limit exceeded fix',
    'maxhatch limit autocad crash warning',
    'cad hatch scale factor optimizer',
    'solid hatch pattern scale generator'
  ],
  'viewport-scale-factor-converter': [
    'AutoCAD scale factor calculator online',
    'drawing scale converter for architectural plans',
    'plot scale calculator for CAD printing',
    'viewport zoom xp factor converter'
  ],
  'ctb-plot-style-pen-visualizer': [
    'CAD line weight calculator for printing',
    'CTB file settings calculator for AutoCAD',
    'plot style pen thickness visualizer',
    'color dependent plot style table reader'
  ],
  'online-step-to-stl-slicer-helper': [
    'step to stl converter mesh resolution',
    '3d printing chordal deviation slicer',
    'convert step to stl online watertight',
    'parametric stp to polygonal mesh'
  ],
  'pdf-plot-chinese-gibberish-resolver': [
    'missing lines fix PDF export from CAD',
    'autocad pdf print chinese question mark',
    'gibberish font characters plotter PC3',
    'font capture pdf translation error'
  ],
  'color-rgb-to-aci-matchbox': [
    'rgb hex to aci index color converter',
    'closest matching ACI code calculator',
    'color distance delta E calculation CAD',
    'aci lines weights index matching'
  ],
  'missing-font-shx-resolver': [
    'AutoCAD font question mark fix LISP',
    'missing shx font download alternative',
    'gbcbig shx substitution setup',
    'hztxt missing text style rebuild'
  ]
};

const runEnrichment = () => {
  if (!fs.existsSync(toolboxDataPath)) {
    console.error('CRITICAL: toolbox-data.ts not found!');
    process.exit(1);
  }

  let content = fs.readFileSync(toolboxDataPath, 'utf8');
  let updateCount = 0;

  Object.entries(keywordsEnrichment).forEach(([slug, newKeywords]) => {
    // Regex to locate the keywords array of a specific slug item in the TS file
    // e.g. slug: 'limits-and-fits-calculator',[\s\S]*?keywords:\s*\[([\s\S]*?)\]
    const regex = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?keywords:\\s*\\[)([\\s\\S]*?)(\\])`);
    const match = content.match(regex);
    
    if (match) {
      const prefix = match[1];
      const existingRaw = match[2];
      const suffix = match[3];

      // Parse existing keywords array contents
      const existingArray = existingRaw
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(s => s.length > 0);

      // Merge and deduplicate
      const mergedArray = Array.from(new Set([...existingArray, ...newKeywords]));
      const formattedKeywords = '\n      ' + mergedArray.map(k => `'${k}'`).join(',\n      ') + '\n    ';
      const replacement = `${prefix}${formattedKeywords}${suffix}`;

      content = content.replace(regex, replacement);
      console.log(`Enriched keywords for slug: ${slug} (Added ${mergedArray.length - existingArray.length} keywords)`);
      updateCount++;
    } else {
      console.log(`Could not find keywords section for slug: ${slug}`);
    }
  });

  fs.writeFileSync(toolboxDataPath, content, 'utf8');
  console.log(`Successfully completed! Total slugs updated: ${updateCount}`);
};

runEnrichment();
