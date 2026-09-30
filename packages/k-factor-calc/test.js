'use strict';
const assert = require('assert');
const { calculateSheetMetalBend } = require('./index.js');

const res = calculateSheetMetalBend({
  thickness: 2.0,
  insideRadius: 2.0,
  angleDegrees: 90,
  kFactor: 0.44
});

assert.strictEqual(res.thickness, 2.0);
assert.strictEqual(res.insideRadius, 2.0);
assert.strictEqual(res.angleDegrees, 90);
assert.ok(res.bendAllowance > 4.5 && res.bendAllowance < 4.6);
assert.ok(res.bendDeduction > 3.4 && res.bendDeduction < 3.5);

console.log('All @willsunagency/k-factor-calc tests passed!');
