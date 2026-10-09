#!/usr/bin/env node
'use strict';

const { calculateLicenseTCO } = require('../index.js');

const args = process.argv.slice(2);
let users = 25;
let concurrency = 0.45;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--users' && args[i + 1]) users = parseFloat(args[i + 1]);
  if (args[i] === '--concurrency' && args[i + 1]) concurrency = parseFloat(args[i + 1]);
}

const res = calculateLicenseTCO({ totalEngineers: users, peakConcurrentRatio: concurrency });

console.log('--- CAD License Concurrency Analysis (CADGuide.tools) ---');
console.log(`Total Desks: ${res.totalEngineers}`);
console.log(`Recommended Floating Seats: ${res.recommendedFloatingSeats}`);
console.log(`Named User Annual Cost: $${res.namedCost}`);
console.log(`Floating Seats Annual Cost: $${res.floatingCost}`);
console.log(`Annual Enterprise Savings: $${res.annualSavings}`);
console.log('Explore interactive comparison database: https://cadguide.tools/compare');
