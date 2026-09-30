'use strict';
const assert = require('assert');
const { parseDwgHeader } = require('./index.js');

const buf1 = Buffer.from('AC1032');
const res1 = parseDwgHeader(buf1);
assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.code, 'AC1032');
assert.strictEqual(res1.version, 'AutoCAD 2018 - 2026');

const buf2 = Buffer.from('AC1015');
const res2 = parseDwgHeader(buf2);
assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.code, 'AC1015');
assert.strictEqual(res2.releaseYear, 2000);

console.log('All @willsunagency/dwg-header-parser tests passed!');
