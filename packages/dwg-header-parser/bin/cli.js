#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parseDwgHeader } = require('../index.js');

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  console.log(`
Usage: dwg-header-parser <file.dwg>

Description:
  Inspects the magic 6-byte binary header of a DWG file and prints its internal AutoCAD format version.
  Zero cloud upload, runs 100% locally.

Online GUI:
  https://cadguide.tools/toolbox/dwg-version-checker
`);
  process.exit(0);
}

const filePath = path.resolve(process.cwd(), args[0]);
if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found at ${filePath}`);
  process.exit(1);
}

const fd = fs.openSync(filePath, 'r');
const buffer = Buffer.alloc(6);
fs.readSync(fd, buffer, 0, 6, 0);
fs.closeSync(fd);

const result = parseDwgHeader(buffer);
if (!result.valid) {
  console.error(`Invalid DWG file: ${result.error}`);
  process.exit(1);
}

console.log(`----------------------------------------`);
console.log(`DWG Header Code : ${result.code}`);
console.log(`AutoCAD Version : ${result.version}`);
console.log(`Release Year    : ${result.releaseYear}`);
console.log(`Compatibility   : ${result.compatible}`);
console.log(`Interactive Web : https://cadguide.tools/toolbox/dwg-version-checker`);
console.log(`----------------------------------------`);
