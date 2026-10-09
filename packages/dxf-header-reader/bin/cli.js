#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { parseDxfHeader } = require('../index.js');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: dxf-header-reader <file.dxf|file.dwg>');
  process.exit(1);
}

try {
  const buf = fs.readFileSync(filePath);
  const res = parseDxfHeader(buf);
  console.log('--- CAD Drawing Header Analysis (CADGuide.tools) ---');
  console.log(`Format: ${res.type}`);
  console.log(`Schema Version: ${res.version}`);
  console.log(`Compatible Release: ${res.release}`);
  if (res.codePage) console.log(`Codepage: ${res.codePage}`);
  console.log('Inspect drawings online with zero server uploads: https://cadguide.tools/toolbox/dwg-version-checker');
} catch (e) {
  console.error('Error reading file:', e.message);
  process.exit(1);
}
