const { detectCADFormat } = require('./index');
const assert = require('assert');

// 1. DWG AC1032
const dwgBuf = Buffer.from('AC1032\x00\x00\x00\x00some_drawing_data');
const resDWG = detectCADFormat(dwgBuf);
assert.strictEqual(resDWG.detected, true);
assert.strictEqual(resDWG.format, 'DWG');
assert.strictEqual(resDWG.magic, 'AC1032');
assert.strictEqual(resDWG.version, '2018-2026');

// 2. STEP
const stepBuf = Buffer.from('ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(...);');
const resSTEP = detectCADFormat(stepBuf);
assert.strictEqual(resSTEP.detected, true);
assert.strictEqual(resSTEP.format, 'STEP');

// 3. ASCII DXF
const dxfBuf = Buffer.from('  0\nSECTION\n  2\nHEADER\n  9\n$ACADVER\n  1\nAC1027\n  0\nENDSEC');
const resDXF = detectCADFormat(dxfBuf);
assert.strictEqual(resDXF.detected, true);
assert.strictEqual(resDXF.format, 'DXF');
assert.strictEqual(resDXF.variant, 'ascii');

console.log('All @willsunagency/cad-format-detector tests passed!');
