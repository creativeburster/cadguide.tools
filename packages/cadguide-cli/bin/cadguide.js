#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseDWGHeader, calculateKFactor } = require('../index.js');

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
============================================================
  🤖 CADGuide CLI - Offline CAD Tools & Calculators
  🌐 https://cadguide.tools
============================================================

Usage:
  cadguide dwg <filepath.dwg>            Inspect AutoCAD DWG header version
  cadguide kfactor <t> <r> [angle] [k]   Calculate sheet metal K-Factor
  cadguide compare <cad_a> <cad_b>       Get comparative benchmark URL
  cadguide --version                     Display version

Examples:
  npx cadguide-cli dwg ./sample.dwg
  npx cadguide-cli kfactor 2.0 2.0 90 0.44
`);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  const pkg = require('../package.json');
  console.log(`cadguide-cli v${pkg.version}`);
  process.exit(0);
}

if (command === 'dwg' || command.endsWith('.dwg')) {
  const targetFile = command === 'dwg' ? args[1] : command;
  if (!targetFile) {
    console.error('❌ Error: Please specify a DWG file path. Example: cadguide dwg drawing.dwg');
    process.exit(1);
  }
  
  const fullPath = path.resolve(process.cwd(), targetFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: File not found: ${fullPath}`);
    process.exit(1);
  }
  
  try {
    const fd = fs.openSync(fullPath, 'r');
    const buffer = Buffer.alloc(6);
    fs.readSync(fd, buffer, 0, 6, 0);
    fs.closeSync(fd);
    
    const info = parseDWGHeader(buffer);
    console.log(`
============================================================
  🔍 CADGuide DWG Binary Header Inspector
  🌐 https://cadguide.tools/toolbox/dwg-version-checker
============================================================
File: ${path.basename(fullPath)}
Magic Code: ${info.magicCode}
Compatible CAD Releases: ${info.releases}
Internal Format Era: ${info.releaseYear}
Format Status: ${info.isModernFormat ? 'Modern 64-bit Object Streams (Supported)' : 'Legacy Format'}
============================================================
✅ Verified locally with 0 cloud uploads. 100% private.
`);
  } catch (err) {
    console.error(`❌ Error inspecting DWG: ${err.message}`);
    process.exit(1);
  }
} else if (command === 'kfactor') {
  const t = parseFloat(args[1]);
  const r = parseFloat(args[2]);
  const a = args[3] ? parseFloat(args[3]) : 90;
  const k = args[4] ? parseFloat(args[4]) : 0.44;
  
  if (isNaN(t) || isNaN(r)) {
    console.error('❌ Error: Thickness and Inside Radius are required numbers. Example: cadguide kfactor 2.0 2.0');
    process.exit(1);
  }
  
  const res = calculateKFactor(t, r, a, k);
  console.log(`
============================================================
  📐 CADGuide Sheet Metal K-Factor Calculator
  🌐 https://cadguide.tools/toolbox/k-factor-calculator
============================================================
Inputs: Thickness=${res.thickness}mm, Radius=${res.radius}mm, Angle=${res.angle}°, K-Factor=${res.kFactor}
------------------------------------------------------------
Bend Allowance (BA)  : ${res.bendAllowance} mm
Outside Setback (OSB): ${res.outsideSetback} mm
Bend Deduction (BD)  : ${res.bendDeduction} mm
============================================================
`);
} else if (command === 'compare') {
  const cadA = args[1] || 'autocad';
  const cadB = args[2] || 'gstarcad';
  console.log(`🔗 Compare ${cadA} vs ${cadB} side-by-side at:`);
  console.log(`👉 https://cadguide.tools/compare/${cadA}-vs-${cadB}`);
} else {
  console.error(`❌ Unknown command: ${command}. Run 'cadguide --help' for usage.`);
  process.exit(1);
}
