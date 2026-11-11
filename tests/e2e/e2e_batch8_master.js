/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 8 (Tools 36 to 40)
 *
 * Validates:
 * 36. bolt-fatigue-calculator (Soderberg & Goodman criteria, ISO 898-1 Class 8.8 / 10.9 / 4.6 presets, input defenses, CSV export, negative assertions)
 * 37. bolt-pattern-load-calculator (Collinear bolt group in-plane moment & direct shear rigid-body statics, presets, integer/boundary defenses, CSV export, negative assertions)
 * 38. brake-torque-calculator (Wheel braking torque, linear deceleration, level-road braking distance, presets, input defenses, CSV export, negative assertions)
 * 39. brick-block-quantity-calculator (US Modular Brick, UK Standard Brick, Metric CMU Block, Custom unit, editable width & cement factor, multi-wythe & opening deductions, CSV export, negative assertions)
 * 40. broaching-force-calculator (Broaching force & net cutting power with editable speed m/min, presets, input defenses, CSV export, negative assertions)
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function assertClose(actual, expected, maxRelError = 0.001, context = '') {
  if (!Number.isFinite(actual)) {
    throw new Error(`[${context}] Expected finite number ${expected}, got ${actual}`);
  }
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

async function openToolPage(page, url, readySelector) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(readySelector);
  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    return Object.keys(el).some((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
  }, readySelector);
}

async function runBatch8Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 8 (Tools 36 to 40)');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

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
    // Tool 36: bolt-fatigue-calculator
    // -------------------------------------------------------------------------
    await runSubTest('36. bolt-fatigue-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/bolt-fatigue-calculator`, '[data-testid="input-sa"]');

      // 1. Default Hand-Calculation (ISO 898-1 Class 8.8, Soderberg active)
      // Inputs: sigma_a = 40 MPa, sigma_m = 320 MPa, Se = 100 MPa, Sy = 640 MPa, Sut = 800 MPa
      // Unit derivation:
      //   All stresses are in MPa (N/mm^2), so stress ratios are dimensionless (MPa / MPa = 1).
      //   Soderberg: 1 / n_S = (40 / 100) + (320 / 640) = 0.400 + 0.500 = 0.900 -> n_S = 1 / 0.900 = 1.1111... -> 1.111
      //   Goodman:   1 / n_G = (40 / 100) + (320 / 800) = 0.400 + 0.400 = 0.800 -> n_G = 1 / 0.800 = 1.250
      //   Status (1.0 <= 1.111 < 1.5): 'Marginal'
      assertClose(parseFloat(await p.innerText('[data-testid="result-n"]')), 1.111, 0.001, 'Default Active Safety Factor');
      assertClose(parseFloat(await p.innerText('[data-testid="result-soderberg"]')), 1.111, 0.001, 'Default Soderberg Factor');
      assertClose(parseFloat(await p.innerText('[data-testid="result-goodman"]')), 1.250, 0.001, 'Default Goodman Factor');
      const defStatus = (await p.innerText('[data-testid="result-status"]')).trim();
      if (defStatus !== 'Marginal') {
        throw new Error(`Expected default status 'Marginal', got '${defStatus}'`);
      }

      // 2. Switch Criterion Branch to Goodman
      await p.selectOption('[data-testid="select-criterion"]', 'goodman');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '1.250');
      assertClose(parseFloat(await p.innerText('[data-testid="result-n"]')), 1.250, 0.001, 'Goodman Active Safety Factor');

      // 3. Preset 1: ISO 898-1 Class 10.9 (sa=10, sm=470, Se=100, Sy=940, Sut=1040, soderberg)
      // Hand calc:
      //   Soderberg: 1 / n_S = (10 / 100) + (470 / 940) = 0.100 + 0.500 = 0.600 -> n_S = 1.6667 -> 1.667 ('Safe')
      //   Goodman:   1 / n_G = (10 / 100) + (470 / 1040) = 0.100 + 0.451923 = 0.551923 -> n_G = 1.81185 -> 1.812
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Safe');
      assertClose(parseFloat(await p.innerText('[data-testid="result-n"]')), 1.667, 0.001, 'Class 10.9 Soderberg');
      assertClose(parseFloat(await p.innerText('[data-testid="result-goodman"]')), 1.812, 0.001, 'Class 10.9 Goodman');

      // 4. Preset 2: ISO 898-1 Class 4.6 Overloaded (sa=60, sm=180, Se=80, Sy=240, Sut=400, soderberg)
      // Hand calc:
      //   Soderberg: 1 / n_S = (60 / 80) + (180 / 240) = 0.750 + 0.750 = 1.500 -> n_S = 0.6667 -> 0.667 ('Unsafe')
      //   Goodman:   1 / n_G = (60 / 80) + (180 / 400) = 0.750 + 0.450 = 1.200 -> n_G = 0.8333 -> 0.833
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Unsafe');
      assertClose(parseFloat(await p.innerText('[data-testid="result-n"]')), 0.667, 0.001, 'Class 4.6 Soderberg');
      assertClose(parseFloat(await p.innerText('[data-testid="result-goodman"]')), 0.833, 0.001, 'Class 4.6 Goodman');

      // 5. Reset Button
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '1.111');

      // 6. Input Defenses on >= 2 inputs (empty, 'abc', '12abc', and invalid Sy > Sut)
      const saInput = p.locator('[data-testid="input-sa"]');
      const syInput = p.locator('[data-testid="input-sy"]');

      await saInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '—');
      if ((await p.innerText('[data-testid="result-status"]')).trim() !== '—') {
        throw new Error('Status must be "—" when input is empty, not Unsafe');
      }
      await verifyNoNaNOrInfinity(p, 'Bolt Fatigue empty sa');

      await saInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Fatigue abc sa');

      await saInput.fill('40');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '1.111');

      await syInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Fatigue 12abc sy');

      // Non-physical boundary: Sy (900 MPa) > Sut (800 MPa)
      await syInput.fill('900');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Fatigue Sy > Sut');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-n"]').textContent.trim() === '1.111');

      // 7. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Alternating_Stress_MPa,Mean_Stress_MPa') || !csvText.includes('ISO 898-1')) {
        throw new Error('Bolt Fatigue CSV missing expected headers');
      }
      if (!csvText.includes('soderberg,40,320,100,640,800,1.111,1.111,1.250,Marginal')) {
        throw new Error('Bolt Fatigue CSV missing expected numerical row');
      }

      // 8. Negative Assertions inside calculator-inputs and calculator-results
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['VDI 2230', 'ASME B1.1', 'ISO 68-1', 'ISO 273']) {
        if (coreText.includes(banned)) {
          throw new Error(`Bolt Fatigue core contains removed standard '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 37: bolt-pattern-load-calculator
    // -------------------------------------------------------------------------
    await runSubTest('37. bolt-pattern-load-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/bolt-pattern-load-calculator`, '[data-testid="input-moment"]');

      // 1. Default Hand-Calculation (M=5000 N·m, V=2000 N, n=4, s=100 mm)
      // Unit derivation:
      //   s = 100 mm / 1000 mm/m = 0.100 m
      //   y_max = (4 - 1) * 0.100 / 2 = 0.150 m
      //   sum(y_i^2) = 4 * 0.100^2 * (4^2 - 1) / 12 = 4 * 0.01 * 15 / 12 = 0.050 m^2
      //   F_m,max = (5000 N·m * 0.150 m) / 0.050 m^2 = 15000.00 N
      //   F_avg = 2000 N / 4 = 500.00 N
      //   F_max = 500.00 + 15000.00 = 15500.00 N
      //   F_min = 500.00 - 15000.00 = -14500.00 N
      assertClose(parseFloat(await p.innerText('[data-testid="result-fmax"]')), 15500.00, 0.001, 'Default F_max');
      assertClose(parseFloat(await p.innerText('[data-testid="result-fmin"]')), -14500.00, 0.001, 'Default F_min');
      assertClose(parseFloat(await p.innerText('[data-testid="result-favg"]')), 500.00, 0.001, 'Default F_avg');
      assertClose(parseFloat(await p.innerText('[data-testid="result-fm"]')), 15000.00, 0.001, 'Default F_m,max');

      // 2. Preset 1: 6-Bolt Heavy Gusset (M=12000 N·m, V=6000 N, n=6, s=80 mm)
      // Hand calc:
      //   s = 0.080 m, y_max = 5 * 0.080 / 2 = 0.200 m
      //   sum(y_i^2) = 6 * 0.0064 * 35 / 12 = 1.344 / 12 = 0.112 m^2
      //   F_m,max = 12000 * 0.200 / 0.112 = 21428.5714 N -> 21428.57 N
      //   F_avg = 6000 / 6 = 1000.00 N
      //   F_max = 22428.57 N, F_min = -20428.57 N
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.includes('22428.57'));
      assertClose(parseFloat(await p.innerText('[data-testid="result-fmax"]')), 22428.57, 0.001, '6-Bolt F_max');
      assertClose(parseFloat(await p.innerText('[data-testid="result-fmin"]')), -20428.57, 0.001, '6-Bolt F_min');
      assertClose(parseFloat(await p.innerText('[data-testid="result-favg"]')), 1000.00, 0.001, '6-Bolt F_avg');

      // 3. Preset 2: 2-Bolt Light Splice (M=600 N·m, V=1000 N, n=2, s=120 mm)
      // Hand calc:
      //   s = 0.120 m, y_max = 0.060 m, sum(y_i^2) = 2 * 0.0144 * 3 / 12 = 0.0072 m^2
      //   F_m,max = 600 * 0.060 / 0.0072 = 5000.00 N
      //   F_avg = 1000 / 2 = 500.00 N -> F_max = 5500.00 N, F_min = -4500.00 N
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.includes('5500.00'));
      assertClose(parseFloat(await p.innerText('[data-testid="result-fmax"]')), 5500.00, 0.001, '2-Bolt F_max');
      assertClose(parseFloat(await p.innerText('[data-testid="result-fmin"]')), -4500.00, 0.001, '2-Bolt F_min');

      // 4. Reset Button
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.includes('15500.00'));

      // 5. Input Defenses on >= 2 inputs (empty, 'abc', '12abc', non-integer bolt count, n < 2)
      const momentInput = p.locator('[data-testid="input-moment"]');
      const countInput = p.locator('[data-testid="input-count"]');

      await momentInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern Load empty moment');

      await momentInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern Load abc moment');

      await momentInput.fill('5000');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.includes('15500.00'));

      await countInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern Load 12abc count');

      // Non-integer bolt count 3.5 and single bolt n = 1 must return '—'
      await countInput.fill('3.5');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.trim() === '—');
      await countInput.fill('1');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern Load n=1');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fmax"]').textContent.includes('15500.00'));

      // 6. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Moment_Nm,Direct_Shear_N,Bolt_Count,Bolt_Spacing_mm')) {
        throw new Error('Bolt Pattern Load CSV missing expected headers');
      }
      if (!csvText.includes('5000,2000,4,100,15500.00,-14500.00,500.00,15000.00')) {
        throw new Error('Bolt Pattern Load CSV missing expected numerical row');
      }

      // 7. Negative Assertions inside calculator-inputs and calculator-results
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['VDI 2230', 'ISO 898-1', 'ASME B1.1', 'ISO 68-1']) {
        if (coreText.includes(banned)) {
          throw new Error(`Bolt Pattern Load core contains unrelated standard '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 38: brake-torque-calculator
    // -------------------------------------------------------------------------
    await runSubTest('38. brake-torque-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/brake-torque-calculator`, '[data-testid="input-force"]');

      // 1. Default Hand-Calculation (Fb=3000 N, R=0.3 m, m=1500 kg, v=80 km/h)
      // Unit derivation:
      //   v = 80 km/h / 3.6 (km/h)/(m/s) = 22.222222 m/s
      //   T = 3000 N * 0.3 m = 900.00 N·m
      //   a = 3000 N / 1500 kg = 2.000 m/s^2
      //   d = (22.222222 m/s)^2 / (2 * 2.000 m/s^2) = 493.82716 / 4 = 123.45679 m -> 123.46 m
      assertClose(parseFloat(await p.innerText('[data-testid="result-torque"]')), 900.00, 0.001, 'Default Brake Torque');
      assertClose(parseFloat(await p.innerText('[data-testid="result-decel"]')), 2.000, 0.001, 'Default Deceleration');
      assertClose(parseFloat(await p.innerText('[data-testid="result-distance"]')), 123.46, 0.001, 'Default Braking Distance');

      // 2. Preset 1: Passenger Car Emergency (Fb=12000 N, R=0.32 m, m=1600 kg, v=100 km/h)
      // Hand calc:
      //   v = 100 / 3.6 = 27.777778 m/s
      //   T = 12000 * 0.32 = 3840.00 N·m
      //   a = 12000 / 1600 = 7.500 m/s^2
      //   d = 771.604938 / 15 = 51.4403 m -> 51.44 m
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.includes('3840.00'));
      assertClose(parseFloat(await p.innerText('[data-testid="result-torque"]')), 3840.00, 0.001, 'Emergency Torque');
      assertClose(parseFloat(await p.innerText('[data-testid="result-decel"]')), 7.500, 0.001, 'Emergency Decel');
      assertClose(parseFloat(await p.innerText('[data-testid="result-distance"]')), 51.44, 0.001, 'Emergency Distance');

      // 3. Preset 2: Industrial AGV / Forklift (Fb=6000 N, R=0.20 m, m=3000 kg, v=18 km/h)
      // Hand calc:
      //   v = 18 / 3.6 = 5.000 m/s
      //   T = 6000 * 0.20 = 1200.00 N·m
      //   a = 6000 / 3000 = 2.000 m/s^2
      //   d = 25 / 4 = 6.25 m
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.includes('1200.00'));
      assertClose(parseFloat(await p.innerText('[data-testid="result-torque"]')), 1200.00, 0.001, 'AGV Torque');
      assertClose(parseFloat(await p.innerText('[data-testid="result-decel"]')), 2.000, 0.001, 'AGV Decel');
      assertClose(parseFloat(await p.innerText('[data-testid="result-distance"]')), 6.25, 0.001, 'AGV Distance');

      // 4. Reset Button
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.includes('900.00'));

      // 5. Input Defenses on >= 2 inputs (empty, 'abc', '12abc', Fb <= 0)
      const forceInput = p.locator('[data-testid="input-force"]');
      const massInput = p.locator('[data-testid="input-mass"]');

      await forceInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brake Torque empty force');

      await forceInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brake Torque abc force');

      await forceInput.fill('0');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-distance"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brake Torque zero force');

      await forceInput.fill('3000');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.includes('900.00'));

      await massInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-decel"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brake Torque 12abc mass');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-torque"]').textContent.includes('900.00'));

      // 6. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Braking_Force_N,Wheel_Radius_m,Vehicle_Mass_kg,Initial_Speed_kmh')) {
        throw new Error('Brake Torque CSV missing expected headers');
      }
      if (!csvText.includes('3000,0.3,1500,80,900.00,2.000,123.46')) {
        throw new Error('Brake Torque CSV missing expected numerical row');
      }

      // 7. Negative Assertions inside calculator-inputs and calculator-results
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['ASME B106.1M', 'DIN 6885', 'ISO 773', 'ISO 1940-1']) {
        if (coreText.includes(banned)) {
          throw new Error(`Brake Torque core contains unrelated shaft/keyway standard '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 39: brick-block-quantity-calculator
    // -------------------------------------------------------------------------
    await runSubTest('39. brick-block-quantity-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/brick-block-quantity-calculator`, '[data-testid="input-wall-length"]');

      // 1. Default Hand-Calculation (US Modular Brick 194×92×57 mm, Wall 5000×2700 mm, wythes=1, joint=10 mm, open=0, waste=5%, cement=6.5 bags/m³)
      // Unit derivation:
      //   A_net = (5000 mm * 2700 mm) / 10^6 mm^2/m^2 - 0 = 13.50 m^2
      //   Units/m^2 = 10^6 / ((194 + 10) * (57 + 10)) = 1,000,000 / (204 * 67) = 1,000,000 / 13,668 = 73.163594 -> 73.16
      //   Net units = 13.50 * 73.163594 * 1 = 987.7085; Total units = ceil(987.7085 * 1.05) = ceil(1037.094) = 1038
      //   t_wall = 92 mm / 1000 mm/m = 0.092 m -> V_wall = 13.50 * 0.092 = 1.242 m^3
      //   V_units = 987.708516 * (194 * 92 * 57 * 1e-9 m^3) = 987.708516 * 0.001017336 = 1.0048314 m^3
      //   V_mortar = (1.242 - 1.0048314) * 1.05 = 0.2371686 * 1.05 = 0.249027 m^3 -> 0.249 m^3
      //   Cement bags = ceil(0.249027 * 6.5) = ceil(1.6187) = 2
      assertClose(parseFloat(await p.innerText('[data-testid="result-area"]')), 13.50, 0.001, 'Default Wall Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-per-m2"]')), 73.16, 0.001, 'Default Units per m2');
      assertClose(parseFloat(await p.innerText('[data-testid="result-total-bricks"]')), 1038, 0.001, 'Default Total Units');
      assertClose(parseFloat(await p.innerText('[data-testid="result-mortar"]')), 0.249, 0.001, 'Default Mortar Volume');
      assertClose(parseFloat(await p.innerText('[data-testid="result-cement-bags"]')), 2, 0.001, 'Default Cement Bags');

      // 2. Preset Branch: UK Standard Brick (215×102.5×65 mm)
      // Hand calc:
      //   Units/m^2 = 1,000,000 / (225 * 75) = 1,000,000 / 16,875 = 59.259259 -> 59.26
      //   Net units = 13.50 * 59.259259 = 800.000; Total = ceil(800 * 1.05) = 840
      //   V_wall = 13.50 * 0.1025 = 1.38375 m^3; V_units = 800 * (215 * 102.5 * 65 * 1e-9) = 1.14595 m^3
      //   V_mortar = (1.38375 - 1.14595) * 1.05 = 0.23780 * 1.05 = 0.24969 m^3 -> 0.250 m^3; Bags = ceil(0.24969 * 6.5) = 2
      await p.selectOption('[data-testid="select-unit-type"]', 'uk_brick');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '840');
      assertClose(parseFloat(await p.innerText('[data-testid="result-per-m2"]')), 59.26, 0.001, 'UK Brick per m2');
      assertClose(parseFloat(await p.innerText('[data-testid="result-mortar"]')), 0.250, 0.001, 'UK Brick Mortar');

      // 3. Multi-wythe + Opening Deduction Branch (UK Brick, wythes=2, opening=3.5 m²)
      // Hand calc:
      //   A_net = 13.50 - 3.50 = 10.00 m^2
      //   Net units = 10.00 * 59.259259 * 2 = 1185.1852 -> Total = ceil(1185.1852 * 1.05) = 1245
      //   t_wall = (2 * 102.5 + 1 * 10) / 1000 = 0.215 m -> V_wall = 10.00 * 0.215 = 2.150 m^3
      //   V_units = 1185.185185 * 0.0014324375 = 1.6977037 m^3
      //   V_mortar = (2.150 - 1.6977037) * 1.05 = 0.4522963 * 1.05 = 0.474911 m^3 -> 0.475 m^3
      //   Bags = ceil(0.474911 * 6.5) = ceil(3.0869) = 4
      await p.fill('[data-testid="input-wythes"]', '2');
      await p.fill('[data-testid="input-opening"]', '3.5');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '1245');
      assertClose(parseFloat(await p.innerText('[data-testid="result-area"]')), 10.00, 0.001, 'Multi-wythe Net Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-mortar"]')), 0.475, 0.001, 'Multi-wythe Mortar');
      assertClose(parseFloat(await p.innerText('[data-testid="result-cement-bags"]')), 4, 0.001, 'Multi-wythe Cement Bags');

      // 4. Preset Branch: Metric CMU Block (390×190×190 mm) after Reset
      // Hand calc:
      //   Units/m^2 = 1,000,000 / (400 * 200) = 12.50
      //   Net units = 13.50 * 12.50 = 168.75 -> Total = ceil(168.75 * 1.05) = 178
      //   V_wall = 13.50 * 0.190 = 2.565 m^3; V_units = 168.75 * 0.014079 = 2.37583125 m^3
      //   V_mortar = (2.565 - 2.37583125) * 1.05 = 0.198627 m^3 -> 0.199 m^3; Bags = ceil(0.198627 * 6.5) = 2
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '1038');
      await p.selectOption('[data-testid="select-unit-type"]', 'cmu');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '178');
      assertClose(parseFloat(await p.innerText('[data-testid="result-per-m2"]')), 12.50, 0.001, 'CMU Units per m2');
      assertClose(parseFloat(await p.innerText('[data-testid="result-mortar"]')), 0.199, 0.001, 'CMU Mortar');

      // 5. Preset Branch: Custom Unit (200×100×60 mm)
      // Hand calc:
      //   Units/m^2 = 1,000,000 / (210 * 70) = 68.02721 -> 68.03
      //   Net = 13.50 * 68.02721 = 918.3673 -> Total = ceil(918.3673 * 1.05) = 965
      //   V_wall = 1.350 m^3; V_units = 918.36735 * 0.0012 = 1.102041 m^3
      //   V_mortar = 0.247959 * 1.05 = 0.260357 m^3 -> 0.260 m^3
      await p.selectOption('[data-testid="select-unit-type"]', 'custom');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '965');
      assertClose(parseFloat(await p.innerText('[data-testid="result-per-m2"]')), 68.03, 0.001, 'Custom Units per m2');
      assertClose(parseFloat(await p.innerText('[data-testid="result-mortar"]')), 0.260, 0.001, 'Custom Mortar');

      // 6. Reset Button
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '1038');

      // 7. Input Defenses on >= 2 inputs (empty, 'abc', '12abc', opening >= gross wall area)
      const wlInput = p.locator('[data-testid="input-wall-length"]');
      const wasteInput = p.locator('[data-testid="input-waste"]');
      const openInput = p.locator('[data-testid="input-opening"]');

      await wlInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brick empty wall length');

      await wlInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brick abc wall length');

      await wlInput.fill('5000');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '1038');

      // Verify wasteInput does NOT silently fallback via || 0 on '12abc'
      await wasteInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brick 12abc waste factor');

      await wasteInput.fill('5');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '1038');

      // Non-physical boundary: Opening Area (15 m²) > Gross Wall Area (13.50 m²)
      await openInput.fill('15');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-area"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Brick opening > gross area');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total-bricks"]').textContent.trim() === '1038');

      // 8. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Unit_Type,Wall_Length_mm,Wall_Height_mm,Wythes,Joint_mm,Unit_L_mm,Unit_W_mm,Unit_H_mm')) {
        throw new Error('Brick Quantity CSV missing expected headers');
      }
      if (!csvText.includes('us_modular,5000,2700,1,10,194,92,57,0,5,6.5,13.50,73.16,1038,0.249,2')) {
        throw new Error('Brick Quantity CSV missing expected numerical row');
      }

      // 9. Negative Assertions inside calculator-inputs and calculator-results
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['ACI 318', 'Eurocode 2', 'IBC 2024', 'ASCE 7', 'ADA 2010', 'King Brick']) {
        if (coreText.includes(banned)) {
          throw new Error(`Brick Quantity core contains removed/unrelated item '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 40: broaching-force-calculator
    // -------------------------------------------------------------------------
    await runSubTest('40. broaching-force-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/broaching-force-calculator`, '[data-testid="input-teeth"]');

      // 1. Default Hand-Calculation (z=5, b=10 mm, h=0.05 mm, tau=300 MPa, K=1.5, v=8 m/min)
      // Unit derivation:
      //   Chip area per tooth A_c = 10 mm * 0.05 mm = 0.50 mm^2
      //   Specific cutting resistance k_c = 300 N/mm^2 * 1.5 = 450 N/mm^2
      //   F = (5 * 0.50 mm^2 * 450 N/mm^2) / 1000 N/kN = 1125 N / 1000 = 1.125 kN
      //   v_ms = 8 m/min / 60 s/min = 0.133333 m/s
      //   P = 1.125 kN * (8 / 60) m/s = 9.000 / 60 = 0.150 kW
      assertClose(parseFloat(await p.innerText('[data-testid="result-force"]')), 1.125, 0.001, 'Default Broaching Force');
      assertClose(parseFloat(await p.innerText('[data-testid="result-power"]')), 0.150, 0.001, 'Default Cutting Power');

      // 2. Preset 1: Internal Spline — Alloy Steel (z=6, b=40, h=0.06, tau=450, K=4.0, v=6 m/min)
      // Hand calc:
      //   F = (6 * 40 * 0.06 * 450 * 4.0) / 1000 = 25920 / 1000 = 25.920 kN
      //   P = 25.920 * 6 / 60 = 2.592 kW
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.includes('25.920'));
      assertClose(parseFloat(await p.innerText('[data-testid="result-force"]')), 25.920, 0.001, 'Spline Broaching Force');
      assertClose(parseFloat(await p.innerText('[data-testid="result-power"]')), 2.592, 0.001, 'Spline Cutting Power');

      // 3. Preset 2: Surface Broach — Cast Iron (z=4, b=25, h=0.08, tau=220, K=2.5, v=12 m/min)
      // Hand calc:
      //   F = (4 * 25 * 0.08 * 220 * 2.5) / 1000 = 4400 / 1000 = 4.400 kN
      //   P = 4.400 * 12 / 60 = 0.880 kW
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.includes('4.400'));
      assertClose(parseFloat(await p.innerText('[data-testid="result-force"]')), 4.400, 0.001, 'Surface Broaching Force');
      assertClose(parseFloat(await p.innerText('[data-testid="result-power"]')), 0.880, 0.001, 'Surface Cutting Power');

      // 4. Reset Button
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.includes('1.125'));

      // 5. Input Defenses on >= 2 inputs (empty, 'abc', '12abc', speed <= 0)
      const teethInput = p.locator('[data-testid="input-teeth"]');
      const speedInput = p.locator('[data-testid="input-speed"]');

      await teethInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Broaching empty teeth');

      await teethInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Broaching abc teeth');

      await teethInput.fill('5');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-force"]').textContent.includes('1.125'));

      await speedInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-power"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Broaching 12abc speed');

      await speedInput.fill('0');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-power"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Broaching zero speed');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-power"]').textContent.includes('0.150'));

      // 6. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Teeth_Engaged_z,Cut_Width_mm,Rise_per_Tooth_mm,Shear_Strength_MPa,Cutting_Factor_K,Cutting_Speed_m_min')) {
        throw new Error('Broaching CSV missing expected headers');
      }
      if (!csvText.includes('5,10,0.05,300,1.5,8,1.125,0.150')) {
        throw new Error('Broaching CSV missing expected numerical row');
      }

      // 7. Negative Assertions inside calculator-inputs and calculator-results
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['ASHRAE', 'SMACNA', 'ISO 6946']) {
        if (coreText.includes(banned)) {
          throw new Error(`Broaching core contains unrelated HVAC standard '${banned}'`);
        }
      }
    });
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF BATCH 8 (TOOLS 36 TO 40) E2E TESTS:');
  console.log('================================================================');
  results.forEach((r) => {
    const mark = r.status === 'PASS' ? '✓ [PASS]' : '✗ [FAIL]';
    console.log(`${mark} ${r.name}${r.error ? ': ' + r.error : ''}`);
  });
  console.log('================================================================\n');

  const failedCount = results.filter((r) => r.status === 'FAIL').length;
  if (failedCount > 0) {
    process.exit(1);
  }
}

runBatch8Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
