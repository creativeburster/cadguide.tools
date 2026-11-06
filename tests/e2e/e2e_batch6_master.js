/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 6 (Tools 26 to 30)
 *
 * Validates:
 * 26. belt-tension-calculator (Euler-Eytelwein friction model, Te/T1/T2/T0/Fb hand calculations, presets, input defenses, csv export)
 * 27. bend-allowance-calculator (DIN 6935 / SolidWorks BA/BD/OSSB/FlatLength hand calculations, OSSB tan(A/2) fix, presets, input defenses, csv export)
 * 28. bending-allowance-table-calculator (Material K-factors, BA/BD lookup matrix, active cell highlight, presets, input defenses, csv export)
 * 29. bending-force-calculator (Amada/Trumpf air bending force F & tonnage Ft, V/t ratio, presets, input defenses, csv export)
 * 30. bernoulli-equation-calculator (Incompressible fluid energy conservation P2/head/q1/q2, presets, input defenses, csv export)
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function assertClose(actual, expected, maxRelError = 0.001, context = '') {
  const diff = Math.abs(actual - expected);
  const relError = expected === 0 ? diff : diff / Math.abs(expected);
  if (relError > maxRelError) {
    throw new Error(
      `[${context}] Value mismatch: actual ${actual} vs expected ${expected} (relative error ${(relError * 100).toFixed(4)}% > ${(maxRelError * 100).toFixed(4)}%)`
    );
  }
}

async function verifyNoNaNOrInfinity(page, context) {
  const text = await page.innerText('body');
  if (text.includes('NaN')) {
    throw new Error(`[${context}] Found NaN text on page!`);
  }
  if (text.includes('Infinity')) {
    throw new Error(`[${context}] Found Infinity text on page!`);
  }
}

async function runBatch6Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 6 (Tools 26 to 30)');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const results = [];

  const runSubTest = async (name, testFn) => {
    process.stdout.write(`Testing [${name}] ... `);
    try {
      await testFn(page);
      console.log('✓ [PASS]');
      results.push({ name, status: 'PASS' });
    } catch (err) {
      console.log('✗ [FAIL]');
      console.error(`  Error: ${err.message}`);
      results.push({ name, status: 'FAIL', error: err.message });
    }
  };

  try {
    // -------------------------------------------------------------------------
    // Tool 26: belt-tension-calculator
    // -------------------------------------------------------------------------
    await runSubTest('26. belt-tension-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/belt-tension-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-power"]');

      // 1. Default Hand-Calculation Verification (Euler-Eytelwein law)
      // P = 5 kW, v = 10 m/s, u = 0.3, theta = 2.8 rad
      // Hand calc:
      //   Te = 1000 * 5 / 10 = 500.00 N
      //   exp(u * theta) = exp(0.3 * 2.8) = exp(0.84) = 2.3163666
      //   T1 = 500 * 2.3163666 / 1.3163666 = 879.833 N -> 879.83 N
      //   T2 = 500 / 1.3163666 = 379.833 N -> 379.83 N
      //   T0 = (T1 + T2) / 2 = 629.833 N -> 629.83 N
      //   Fb = 2 * 629.833 * sin(1.4 rad) = 2 * 629.833 * 0.9854497 = 1241.343 N -> 1241.34 N
      const te = parseFloat(await p.innerText('[data-testid="result-te"]'));
      const t1 = parseFloat(await p.innerText('[data-testid="result-t1"]'));
      const t2 = parseFloat(await p.innerText('[data-testid="result-t2"]'));
      const t0 = parseFloat(await p.innerText('[data-testid="result-t0"]'));
      const fb = parseFloat(await p.innerText('[data-testid="result-fb"]'));

      assertClose(te, 500.00, 0.001, 'Default Te');
      assertClose(t1, 879.83, 0.001, 'Default T1');
      assertClose(t2, 379.83, 0.001, 'Default T2');
      assertClose(t0, 629.83, 0.001, 'Default T0');
      assertClose(fb, 1241.34, 0.001, 'Default Fb');

      // 2. Preset Branch: Compact High-Speed (3 kW, 15 m/s, u=0.35, theta=2.6)
      // Hand calc:
      //   Te = 3000 / 15 = 200.00 N
      //   exp(0.35 * 2.6) = exp(0.91) = 2.4843225
      //   T1 = 200 * 2.4843225 / 1.4843225 = 334.7416 N -> 334.74 N
      //   T2 = 200 / 1.4843225 = 134.7416 N -> 134.74 N
      await p.click('[data-testid="preset-compact"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-te"]');
        return el && el.textContent.trim() === '200.00';
      });
      const compactT1 = parseFloat(await p.innerText('[data-testid="result-t1"]'));
      const compactT2 = parseFloat(await p.innerText('[data-testid="result-t2"]'));
      assertClose(compactT1, 334.74, 0.001, 'Compact Preset T1');
      assertClose(compactT2, 134.74, 0.001, 'Compact Preset T2');

      // 3. Reset Button Verification
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-te"]');
        return el && el.textContent.trim() === '500.00';
      });

      // 4. Input Robustness: Empty, 'abc', '12abc'
      const powerInput = p.locator('[data-testid="input-power"]');
      const speedInput = p.locator('[data-testid="input-speed"]');

      // Empty power
      await powerInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-te"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Belt Tension empty power');

      // 'abc' power
      await powerInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-te"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Belt Tension abc power');

      // '12abc' speed
      await powerInput.fill('5');
      await speedInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-te"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Belt Tension 12abc speed');

      // Restore
      await speedInput.fill('10');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-te"]').textContent.trim() === '500.00');

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Euler-Eytelwein') || !csvText.includes('ISO 4183')) {
        throw new Error('Belt Tension CSV missing standard header');
      }
      if (!csvText.includes('500.00') || !csvText.includes('879.83')) {
        throw new Error('Belt Tension CSV missing expected numerical values');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 27: bend-allowance-calculator
    // -------------------------------------------------------------------------
    await runSubTest('27. bend-allowance-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bend-allowance-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-thickness"]');

      // 1. Default Hand-Calculation Verification (DIN 6935 / SolidWorks K-Factor)
      // T = 2.0 mm, R = 3.0 mm, A = 90 deg, K = 0.33, L1 = 50 mm, L2 = 50 mm
      // Hand calc:
      //   A_rad = 90 * pi / 180 = pi / 2 = 1.5707963
      //   BA = (pi / 2) * (3.0 + 0.33 * 2.0) = 1.5707963 * 3.66 = 5.7491145 mm -> 5.749 mm
      //   OSSB = (3.0 + 2.0) * tan(45 deg) = 5.000 mm -> 5.000 mm
      //   BD = 2 * 5.000 - 5.7491145 = 4.2508855 mm -> 4.251 mm
      //   Lflat = 50 + 50 - 4.2508855 = 95.7491145 mm -> 95.749 mm
      const ba = parseFloat(await p.innerText('[data-testid="result-ba"]'));
      const bd = parseFloat(await p.innerText('[data-testid="result-bd"]'));
      const ossb = parseFloat(await p.innerText('[data-testid="result-ossb"]'));
      const flat = parseFloat(await p.innerText('[data-testid="result-flat-length"]'));

      assertClose(ba, 5.749, 0.001, 'Default BA');
      assertClose(bd, 4.251, 0.001, 'Default BD');
      assertClose(ossb, 5.000, 0.001, 'Default OSSB');
      assertClose(flat, 95.749, 0.001, 'Default Flat Pattern Length');

      // 2. Preset Branch: Mild Steel (1.5 mm, R=2.0 mm, 90 deg, K=0.40, L1=40, L2=40)
      // Hand calc:
      //   BA = (pi / 2) * (2.0 + 0.40 * 1.5) = 1.5707963 * 2.6 = 4.08407 mm -> 4.084 mm
      //   OSSB = (2.0 + 1.5) * 1.0 = 3.500 mm
      //   BD = 2 * 3.500 - 4.08407 = 2.91593 mm -> 2.916 mm
      //   Lflat = 40 + 40 - 2.91593 = 77.084 mm
      await p.click('[data-testid="preset-mild-steel"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-ba"]');
        return el && el.textContent.trim() === '4.084';
      });
      const steelBd = parseFloat(await p.innerText('[data-testid="result-bd"]'));
      const steelFlat = parseFloat(await p.innerText('[data-testid="result-flat-length"]'));
      assertClose(steelBd, 2.916, 0.001, 'Mild Steel Preset BD');
      assertClose(steelFlat, 77.084, 0.001, 'Mild Steel Preset Flat');

      // 3. Reset Button Verification
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-ba"]');
        return el && el.textContent.trim() === '5.749';
      });

      // 4. Input Robustness: Empty, 'abc', '12abc'
      const thickInput = p.locator('[data-testid="input-thickness"]');
      const angleInput = p.locator('[data-testid="input-angle"]');

      await thickInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bend Allowance empty thickness');

      await thickInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bend Allowance abc thickness');

      await thickInput.fill('2.0');
      await angleInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bend Allowance 12abc angle');

      // Restore
      await angleInput.fill('90');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '5.749');

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('DIN 6935') || !csvText.includes('SolidWorks')) {
        throw new Error('Bend Allowance CSV missing standard header');
      }
      if (!csvText.includes('5.749') || !csvText.includes('95.749')) {
        throw new Error('Bend Allowance CSV missing expected numerical values');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 28: bending-allowance-table-calculator
    // -------------------------------------------------------------------------
    await runSubTest('28. bending-allowance-table-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bending-allowance-table-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="select-material"]');

      // 1. Default Hand-Calculation Verification
      // Steel (K=0.44), T = 2 mm, Angle = 90 deg, R = 3 mm
      // Hand calc:
      //   K = 0.44
      //   BA = (pi / 2) * (3.0 + 0.44 * 2.0) = 1.5707963 * 3.88 = 6.0946897 mm -> 6.095 mm
      //   OSSB = (3.0 + 2.0) * tan(45) = 5.000 mm
      //   BD = 2 * 5.000 - 6.0946897 = 3.9053103 mm -> 3.905 mm
      const kVal = parseFloat(await p.innerText('[data-testid="result-k"]'));
      const ba = parseFloat(await p.innerText('[data-testid="result-ba"]'));
      const bd = parseFloat(await p.innerText('[data-testid="result-bd"]'));

      assertClose(kVal, 0.44, 0.001, 'Default K-Factor');
      assertClose(ba, 6.095, 0.001, 'Default BA');
      assertClose(bd, 3.905, 0.001, 'Default BD');

      // 2. Matrix Table Data Content Assertion (Angle=90, R=1.0 vs R=3.0)
      // For R=1.0, 90 deg: BA = (pi / 2) * (1.0 + 0.44 * 2.0) = 1.5707963 * 1.88 = 2.953 mm
      const tableText = await p.innerText('table');
      if (!tableText.includes('2.953') || !tableText.includes('6.095')) {
        throw new Error('Bend Allowance Matrix missing calculated cells for 90 deg');
      }

      // 3. Preset Branch: Aluminum 5052 (3 mm, 60 deg, R=3 mm, K=0.33)
      // Hand calc:
      //   BA = (60 * pi / 180) * (3.0 + 0.33 * 3.0) = 1.04719755 * 3.99 = 4.178318 mm -> 4.178 mm
      await p.click('[data-testid="preset-aluminum-3mm"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-ba"]');
        return el && el.textContent.trim() === '4.178';
      });
      const alumK = parseFloat(await p.innerText('[data-testid="result-k"]'));
      assertClose(alumK, 0.33, 0.001, 'Aluminum Preset K-Factor');

      // 4. Reset Button Verification
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-ba"]');
        return el && el.textContent.trim() === '6.095';
      });

      // 5. Input Robustness: Empty, 'abc', '12abc'
      const thickInput = p.locator('[data-testid="input-thickness"]');
      const radiusInput = p.locator('[data-testid="input-radius"]');

      await thickInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bend Table empty thickness');

      await thickInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bend Table abc thickness');

      await thickInput.fill('2');
      await radiusInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bend Table 12abc radius');

      // Restore
      await radiusInput.fill('3');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-ba"]').textContent.trim() === '6.095');

      // 6. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('DIN 6935') || !csvText.includes('Full Bend Allowance Matrix')) {
        throw new Error('Bend Table CSV missing standard or matrix header');
      }
      if (!csvText.includes('6.095') || !csvText.includes('3.905')) {
        throw new Error('Bend Table CSV missing expected numerical values');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 29: bending-force-calculator
    // -------------------------------------------------------------------------
    await runSubTest('29. bending-force-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bending-force-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-strength"]');

      // 1. Default Hand-Calculation Verification (Amada / Trumpf Air Bending)
      // sigma = 450 MPa, L = 1000 mm, t = 3 mm, V = 24 mm
      // Hand calc:
      //   F = (1.42 * 450 * 1000 * 3^2) / (24 * 1000) = (1.42 * 450 * 9) / 24 = 5751 / 24 = 239.625 kN
      //   Ft = 239.625 / 9.80665 = 24.43495 ton -> 24.435 ton
      //   FPerMeter = 239.625 kN/m
      const f = parseFloat(await p.innerText('[data-testid="result-force"]'));
      const ft = parseFloat(await p.innerText('[data-testid="result-tonnage"]'));
      const fPerMeter = parseFloat(await p.innerText('[data-testid="result-force-per-meter"]'));

      assertClose(f, 239.625, 0.001, 'Default Bending Force (kN)');
      assertClose(ft, 24.435, 0.001, 'Default Press Tonnage (ton)');
      assertClose(fPerMeter, 239.625, 0.001, 'Default Force Per Meter');

      // 2. Preset Branch: Stainless 304 (600 MPa, 1000 mm, 2 mm, V=16 mm)
      // Hand calc:
      //   F = (1.42 * 600 * 1000 * 4) / (16 * 1000) = 3408 / 16 = 213.000 kN
      //   Ft = 213.000 / 9.80665 = 21.71995 ton -> 21.720 ton
      await p.click('[data-testid="preset-stainless-304"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-force"]');
        return el && el.textContent.trim() === '213.000';
      });
      const stainlessFt = parseFloat(await p.innerText('[data-testid="result-tonnage"]'));
      assertClose(stainlessFt, 21.720, 0.001, 'Stainless Preset Tonnage');

      // 3. Reset Button Verification
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-force"]');
        return el && el.textContent.trim() === '239.625';
      });

      // 4. Input Robustness: Empty, 'abc', '12abc'
      const strengthInput = p.locator('[data-testid="input-strength"]');
      const dieInput = p.locator('[data-testid="input-die-opening"]');

      await strengthInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bending Force empty strength');

      await strengthInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bending Force abc strength');

      await strengthInput.fill('450');
      await dieInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bending Force 12abc die');

      // Restore
      await dieInput.fill('24');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.trim() === '239.625');

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Air Bending Force') || !csvText.includes('Amada / Trumpf')) {
        throw new Error('Bending Force CSV missing standard header');
      }
      if (!csvText.includes('239.625') || !csvText.includes('24.435')) {
        throw new Error('Bending Force CSV missing expected numerical values');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 30: bernoulli-equation-calculator
    // -------------------------------------------------------------------------
    await runSubTest('30. bernoulli-equation-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bernoulli-equation-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-p1"]');

      // 1. Default Hand-Calculation Verification (Incompressible Bernoulli Law)
      // P1 = 200 kPa = 200000 Pa, v1 = 2 m/s, z1 = 0 m, v2 = 5 m/s, z2 = 3 m, rho = 1000 kg/m3, g = 9.80665 m/s2
      // Hand calc:
      //   delta_dyn = 0.5 * 1000 * (4 - 25) = 500 * (-21) = -10500 Pa = -10.500 kPa
      //   delta_pot = 1000 * 9.80665 * (0 - 3) = -29419.95 Pa = -29.420 kPa
      //   P2 = 200000 - 10500 - 29419.95 = 160080.05 Pa -> 160.080 kPa
      //   q1 = 0.5 * 1000 * 4 = 2000 Pa -> 2.000 kPa
      //   q2 = 0.5 * 1000 * 25 = 12500 Pa -> 12.500 kPa
      //   H = 200000 / (1000 * 9.80665) + 4 / (2 * 9.80665) + 0 = 20.3943 + 0.2039 = 20.598 m
      const p2 = parseFloat(await p.innerText('[data-testid="result-p2"]'));
      const head = parseFloat(await p.innerText('[data-testid="result-head"]'));
      const q1 = parseFloat(await p.innerText('[data-testid="result-q1"]'));
      const q2 = parseFloat(await p.innerText('[data-testid="result-q2"]'));

      assertClose(p2, 160.080, 0.001, 'Default P2 (kPa)');
      assertClose(head, 20.598, 0.001, 'Default Total Head (m)');
      assertClose(q1, 2.000, 0.001, 'Default q1 (kPa)');
      assertClose(q2, 12.500, 0.001, 'Default q2 (kPa)');

      // 2. Preset Branch: Venturi Meter Constriction (P1=300, v1=1.5, z1=0, v2=6, z2=0, rho=1000)
      // Hand calc:
      //   delta_dyn = 0.5 * 1000 * (1.5^2 - 6^2) = 500 * (2.25 - 36) = 500 * (-33.75) = -16875 Pa = -16.875 kPa
      //   P2 = 300 - 16.875 = 283.125 kPa
      await p.click('[data-testid="preset-venturi-meter"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-p2"]');
        return el && el.textContent.trim() === '283.125';
      });

      // 3. Reset Button Verification
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-p2"]');
        return el && el.textContent.trim() === '160.080';
      });

      // 4. Input Robustness: Empty, 'abc', '12abc'
      const p1Input = p.locator('[data-testid="input-p1"]');
      const v2Input = p.locator('[data-testid="input-v2"]');

      await p1Input.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-p2"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bernoulli empty P1');

      await p1Input.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-p2"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bernoulli abc P1');

      await p1Input.fill('200');
      await v2Input.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-p2"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bernoulli 12abc v2');

      // Restore
      await v2Input.fill('5');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-p2"]').textContent.trim() === '160.080');

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Bernoulli Fluid Dynamics') || !csvText.includes('NASA Glenn')) {
        throw new Error('Bernoulli CSV missing standard header');
      }
      if (!csvText.includes('160.080') || !csvText.includes('20.598')) {
        throw new Error('Bernoulli CSV missing expected numerical values');
      }
    });

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF BATCH 6 (TOOLS 26 TO 30) E2E TESTS:');
  console.log('================================================================');
  results.forEach(r => {
    const mark = r.status === 'PASS' ? '✓ [PASS]' : '✗ [FAIL]';
    console.log(`${mark} ${r.name}${r.error ? ': ' + r.error : ''}`);
  });
  console.log('================================================================\n');

  const failedCount = results.filter(r => r.status === 'FAIL').length;
  if (failedCount > 0) {
    process.exit(1);
  }
}

runBatch6Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
