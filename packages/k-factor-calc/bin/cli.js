#!/usr/bin/env node
'use strict';

const { calculateSheetMetalBend, MATERIAL_K_FACTORS } = require('../index.js');

const args = process.argv.slice(2);
if (args.length < 4 || args.includes('-h') || args.includes('--help')) {
  console.log(`
Usage: k-factor-calc <thickness> <radius> <angle_deg> <k_factor>

Example:
  k-factor-calc 2.0 2.0 90 0.44

Online Interactive Calculator:
  https://cadguide.tools/toolbox/k-factor-calculator
`);
  process.exit(0);
}

const thickness = parseFloat(args[0]);
const insideRadius = parseFloat(args[1]);
const angleDegrees = parseFloat(args[2]);
const kFactor = parseFloat(args[3]);

try {
  const res = calculateSheetMetalBend({ thickness, insideRadius, angleDegrees, kFactor });
  console.log('----------------------------------------');
  console.log('Sheet Metal Bend Calculation Report');
  console.log('----------------------------------------');
  console.log(`Thickness (T)       : ${res.thickness}`);
  console.log(`Inside Radius (R)   : ${res.insideRadius}`);
  console.log(`Bend Angle          : ${res.angleDegrees}°`);
  console.log(`K-Factor            : ${res.kFactor}`);
  console.log(`Bend Allowance (BA) : ${res.bendAllowance}`);
  console.log(`Outside Setback     : ${res.outsideSetback}`);
  console.log(`Bend Deduction (BD) : ${res.bendDeduction}`);
  console.log(`Neutral Axis Shift  : ${res.neutralAxisOffset}`);
  console.log('----------------------------------------');
  console.log('Online Tool: https://cadguide.tools/toolbox/k-factor-calculator');
  console.log('----------------------------------------');
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
