/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 7 (Tools 31 to 35)
 *
 * Validates:
 * 31. bevel-gear-calculator (KHK orthogonal straight bevel gear δ₁, δ₂, pd₁, pd₂, Cone Distance R, Ratio u, presets, input defenses, csv export)
 * 32. bim-clash-count-calculator (BIM coordination clash totals, resolution rate %, critical remaining, boundary defense r > total, presets, csv export)
 * 33. boiler-efficiency-calculator (Direct thermal efficiency Q_out, η_th, fuel consumption across gas/oil/coal LHV branches, presets, input defenses, csv export)
 * 34. bolt-circle-calculator (Circle chord length, arc spacing, angular pitch, first hole coordinates, presets, input defenses, csv export)
 * 35. bolt-circle-pattern-calculator (Full Cartesian hole coordinate generator, pitch radius, chord, step angle, center hole toggle, SVG safety, presets, csv export)
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

async function runBatch7Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 7 (Tools 31 to 35)');
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
    // Tool 31: bevel-gear-calculator
    // -------------------------------------------------------------------------
    await runSubTest('31. bevel-gear-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bevel-gear-calculator`, { waitUntil: 'networkidle' });
      await p.waitForSelector('[data-testid="input-module"]');

      // 1. Default Hand-Calculation Verification (KHK Straight Bevel Gear Σ = 90°)
      // Inputs: m = 3 mm, z1 = 20, z2 = 40
      // Hand calc:
      //   d1 = arctan(20 / 40) * 180 / pi = arctan(0.5) * 180 / pi = 26.56505 deg -> 26.565 deg
      //   d2 = 90 - 26.56505 = 63.43495 deg -> 63.435 deg
      //   pd1 = 3 * 20 = 60.000 mm
      //   pd2 = 3 * 40 = 120.000 mm
      //   R = 0.5 * 3 * sqrt(20^2 + 40^2) = 1.5 * sqrt(2000) = 1.5 * 44.72135955 = 67.08204 mm -> 67.082 mm
      //   ratio = 40 / 20 = 2.000
      const d1 = parseFloat(await p.innerText('[data-testid="result-d1"]'));
      const d2 = parseFloat(await p.innerText('[data-testid="result-d2"]'));
      const pd1 = parseFloat(await p.innerText('[data-testid="result-pd1"]'));
      const pd2 = parseFloat(await p.innerText('[data-testid="result-pd2"]'));
      const coneDist = parseFloat(await p.innerText('[data-testid="result-cone-dist"]'));
      const ratio = parseFloat(await p.innerText('[data-testid="result-ratio"]'));

      assertClose(d1, 26.565, 0.001, 'Default Pinion Cone Angle');
      assertClose(d2, 63.435, 0.001, 'Default Gear Cone Angle');
      assertClose(pd1, 60.000, 0.001, 'Default Pinion PD');
      assertClose(pd2, 120.000, 0.001, 'Default Gear PD');
      assertClose(coneDist, 67.082, 0.001, 'Default Cone Distance R');
      assertClose(ratio, 2.000, 0.001, 'Default Gear Ratio');

      // 2. Preset Branch: Miter Gear 1:1 (m=2.5, z1=24, z2=24)
      // Hand calc:
      //   d1 = arctan(24/24) = 45.000 deg, d2 = 45.000 deg
      //   pd1 = 2.5 * 24 = 60.000 mm, pd2 = 60.000 mm
      //   R = 0.5 * 2.5 * sqrt(576 + 576) = 1.25 * 33.941125 = 42.4264 mm -> 42.426 mm
      //   ratio = 1.000
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-d1"]');
        return el && el.textContent.includes('45.000');
      });
      const miterR = parseFloat(await p.innerText('[data-testid="result-cone-dist"]'));
      const miterRatio = parseFloat(await p.innerText('[data-testid="result-ratio"]'));
      assertClose(miterR, 42.426, 0.001, 'Miter Preset Cone Distance R');
      assertClose(miterRatio, 1.000, 0.001, 'Miter Preset Ratio');

      // 3. Reset Button Verification
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-d1"]');
        return el && el.textContent.includes('26.565');
      });

      // 4. Input Robustness: Empty, 'abc', '12abc' on at least 2 inputs
      const mInput = p.locator('[data-testid="input-module"]');
      const z1Input = p.locator('[data-testid="input-z1"]');

      await mInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-d1"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bevel Gear empty module');

      await mInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-d1"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bevel Gear abc module');

      await mInput.fill('3');
      await z1Input.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-d1"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bevel Gear 12abc z1');

      await z1Input.fill('20');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-d1"]').textContent.includes('26.565'));

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Pinion_Cone_Angle_deg') || !csvText.includes('Cone_Distance_R_mm')) {
        throw new Error('Bevel Gear CSV missing expected column headers');
      }
      if (!csvText.includes('26.565') || !csvText.includes('67.082') || !csvText.includes('120.000')) {
        throw new Error('Bevel Gear CSV missing expected numerical values');
      }

      // 6. Negative Assertion: Unrelated belt/chain/screw standards must NOT appear
      const coreText = (await p.innerText('[data-testid="calculator-inputs"]')) + ' ' + (await p.innerText('[data-testid="calculator-results"]'));
      if (coreText.includes('RMA IP-20') || coreText.includes('ASME B29.1') || coreText.includes('ISO 3408')) {
        throw new Error('Bevel Gear core contains unrelated belt/chain/ball-screw standard numbers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 32: bim-clash-count-calculator
    // -------------------------------------------------------------------------
    await runSubTest('32. bim-clash-count-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bim-clash-count-calculator`, { waitUntil: 'networkidle' });
      await p.waitForSelector('[data-testid="input-structural"]');

      // 1. Default Hand-Calculation Verification
      // Inputs: Structural = 50, MEP = 120, Arch = 30, Resolved = 180
      // Hand calc:
      //   Total = 50 + 120 + 30 = 200
      //   Resolution Rate = (180 / 200) * 100 = 90.00 %
      //   Critical Remaining = 200 - 180 = 20
      const total = parseFloat(await p.innerText('[data-testid="result-total"]'));
      const rate = parseFloat(await p.innerText('[data-testid="result-rate"]'));
      const critical = parseFloat(await p.innerText('[data-testid="result-critical"]'));

      assertClose(total, 200, 0.001, 'Default Total Clashes');
      assertClose(rate, 90.00, 0.001, 'Default Resolution Rate %');
      assertClose(critical, 20, 0.001, 'Default Critical Remaining');

      // 2. Preset Branch: Early SD Coordination (s=150, m=250, a=100, r=225)
      // Hand calc:
      //   Total = 150 + 250 + 100 = 500
      //   Rate = (225 / 500) * 100 = 45.00 %
      //   Critical Remaining = 500 - 225 = 275
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-total"]');
        return el && el.textContent.trim() === '500';
      });
      const sdRate = parseFloat(await p.innerText('[data-testid="result-rate"]'));
      const sdCritical = parseFloat(await p.innerText('[data-testid="result-critical"]'));
      assertClose(sdRate, 45.00, 0.001, 'Early SD Preset Rate');
      assertClose(sdCritical, 275, 0.001, 'Early SD Preset Critical Remaining');

      // 3. Reset Button Verification
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-total"]');
        return el && el.textContent.trim() === '200';
      });

      // 4. Input Robustness: Empty, 'abc', '12abc', and invalid r > total
      const sInput = p.locator('[data-testid="input-structural"]');
      const rInput = p.locator('[data-testid="input-resolved"]');

      await sInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'BIM Clash empty structural');

      await sInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'BIM Clash abc structural');

      await sInput.fill('50');
      await rInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'BIM Clash 12abc resolved');

      // Invalid physical condition: Resolved (250) > Total (200)
      await rInput.fill('250');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'BIM Clash resolved > total');

      // Restore
      await rInput.fill('180');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-total"]').textContent.trim() === '200');

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Total_Clashes') || !csvText.includes('Resolution_Rate_pct')) {
        throw new Error('BIM Clash CSV missing expected column headers');
      }
      if (!csvText.includes('200,90.00,20')) {
        throw new Error('BIM Clash CSV missing expected numerical row 200,90.00,20');
      }

      // 6. Negative Assertion: Unrelated STEP / 3D printing standards must NOT appear
      const coreText = (await p.innerText('[data-testid="calculator-inputs"]')) + ' ' + (await p.innerText('[data-testid="calculator-results"]'));
      if (coreText.includes('ISO 10303-21') || coreText.includes('52900')) {
        throw new Error('BIM Clash core contains unrelated STEP / Additive Manufacturing standard numbers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 33: boiler-efficiency-calculator
    // -------------------------------------------------------------------------
    await runSubTest('33. boiler-efficiency-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/boiler-efficiency-calculator`, { waitUntil: 'networkidle' });
      await p.waitForSelector('[data-testid="input-steam-flow"]');

      // 1. Default Hand-Calculation Verification (Direct Method)
      // Inputs: Steam Flow = 5000 kg/h, h_steam = 2700 kJ/kg, h_feed = 500 kJ/kg, Q_in = 3500 kW, Fuel = gas (LHV=35 MJ/m³)
      // Hand calc:
      //   Q_out = (5000 / 3600) * (2700 - 500) = 1.3888889 * 2200 = 3055.5556 kW -> 3055.56 kW
      //   eff = (3055.5556 / 3500) * 100 = 87.30159 % -> 87.302 %
      //   Hourly heat input = 3500 kW * 3.6 = 12600 MJ/h
      //   fuel (gas, LHV = 35 MJ/m³) = 12600 / 35 = 360.00 m³/h
      const qOut = parseFloat(await p.innerText('[data-testid="result-output"]'));
      const eff = parseFloat(await p.innerText('[data-testid="result-efficiency"]'));
      const fuel = parseFloat(await p.innerText('[data-testid="result-fuel"]'));

      assertClose(qOut, 3055.56, 0.001, 'Default Boiler Output kW');
      assertClose(eff, 87.302, 0.001, 'Default Boiler Efficiency %');
      assertClose(fuel, 360.00, 0.001, 'Default Natural Gas Consumption');

      // 2. Fuel Type Branch Switching (Oil vs Coal must produce distinct results!)
      // Oil (LHV = 42 MJ/kg): fuel = (3500 * 3.6) / 42 = 12600 / 42 = 300.00 kg/h
      await p.selectOption('[data-testid="select-fuel-type"]', 'oil');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-fuel"]');
        return el && el.textContent.includes('300.00');
      });
      const oilFuel = parseFloat(await p.innerText('[data-testid="result-fuel"]'));
      assertClose(oilFuel, 300.00, 0.001, 'Fuel Oil Consumption (LHV=42)');

      // Coal (LHV = 28 MJ/kg): fuel = (3500 * 3.6) / 28 = 12600 / 28 = 450.00 kg/h
      await p.selectOption('[data-testid="select-fuel-type"]', 'coal');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-fuel"]');
        return el && el.textContent.includes('450.00');
      });
      const coalFuel = parseFloat(await p.innerText('[data-testid="result-fuel"]'));
      assertClose(coalFuel, 450.00, 0.001, 'Coal Consumption (LHV=28)');

      // 3. Preset Branch: Fuel Oil 10 t/h Steam (flow=10000, h1=2750, h2=450, qIn=7500, oil LHV=42)
      // Hand calc:
      //   Q_out = (10000 / 3600) * (2750 - 450) = 2.777778 * 2300 = 6388.8889 kW -> 6388.89 kW
      //   eff = (6388.8889 / 7500) * 100 = 85.185185 % -> 85.185 %
      //   Hourly heat input = 7500 kW * 3.6 = 27000 MJ/h
      //   fuel = 27000 / 42 = 642.85714 kg/h -> 642.86 kg/h
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-output"]');
        return el && el.textContent.includes('6388.89');
      });
      const presetEff = parseFloat(await p.innerText('[data-testid="result-efficiency"]'));
      const presetFuel = parseFloat(await p.innerText('[data-testid="result-fuel"]'));
      assertClose(presetEff, 85.185, 0.001, '10 t/h Oil Preset Efficiency');
      assertClose(presetFuel, 642.86, 0.001, '10 t/h Oil Preset Fuel');

      // 3b. Preset Branch 2: Coal Fired 20 t/h Steam (flow=20000 kg/h, hSteam=2800 kJ/kg, hFeed=420 kJ/kg, qIn=16000 kW, coal LHV=28 MJ/kg)
      // Step-by-step unit & hand calc:
      //   Steam mass flow: 20000 kg/h / 3600 s/h = 5.5555556 kg/s
      //   Q_out = 5.5555556 kg/s * (2800 - 420) kJ/kg = 5.5555556 * 2380 = 13222.2222 kW -> 13222.22 kW
      //   eff = (13222.2222 kW / 16000 kW) * 100 = 82.638889 % -> 82.639 %
      //   Hourly heat input: 16000 kW * 3.6 (MJ/h)/kW = 57600 MJ/h
      //   Fuel consumption (coal LHV = 28 MJ/kg): 57600 MJ/h / 28 MJ/kg = 2057.14286 kg/h -> 2057.14 kg/h
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-output"]');
        return el && el.textContent.includes('13222.22');
      });
      const coalPresetQOut = parseFloat(await p.innerText('[data-testid="result-output"]'));
      const coalPresetEff = parseFloat(await p.innerText('[data-testid="result-efficiency"]'));
      const coalPresetFuel = parseFloat(await p.innerText('[data-testid="result-fuel"]'));
      assertClose(coalPresetQOut, 13222.22, 0.001, '20 t/h Coal Preset Output kW');
      assertClose(coalPresetEff, 82.639, 0.001, '20 t/h Coal Preset Efficiency %');
      assertClose(coalPresetFuel, 2057.14, 0.001, '20 t/h Coal Preset Fuel kg/h');

      // 4. Reset Button Verification
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-fuel"]');
        return el && el.textContent.includes('360.00');
      });

      // 5. Input Robustness: Empty, 'abc', '12abc'
      const flowInput = p.locator('[data-testid="input-steam-flow"]');
      const qInInput = p.locator('[data-testid="input-fuel-input"]');

      await flowInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-output"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Boiler empty steam flow');

      await flowInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-output"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Boiler abc steam flow');

      await flowInput.fill('5000');
      await qInInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-output"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Boiler 12abc fuel input');

      await qInInput.fill('3500');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-output"]').textContent.includes('3055.56'));

      // 6. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Boiler_Output_kW') || !csvText.includes('Efficiency_pct') || !csvText.includes('Fuel = Q_in × 3.6 / LHV')) {
        throw new Error('Boiler Efficiency CSV missing expected column headers or formula text');
      }
      if (!csvText.includes('3055.56') || !csvText.includes('87.302') || !csvText.includes('360.00')) {
        throw new Error('Boiler Efficiency CSV missing expected numerical values');
      }

      // 7. Negative Assertion: Unrelated HVAC duct / building U-value standards must NOT appear
      const coreText = (await p.innerText('[data-testid="calculator-inputs"]')) + ' ' + (await p.innerText('[data-testid="calculator-results"]'));
      if (coreText.includes('SMACNA') || coreText.includes('ISO 6946') || coreText.includes('ASHRAE Standard 62.1')) {
        throw new Error('Boiler Efficiency core contains unrelated HVAC duct / building envelope standard numbers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 34: bolt-circle-calculator
    // -------------------------------------------------------------------------
    await runSubTest('34. bolt-circle-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bolt-circle-calculator`, { waitUntil: 'networkidle' });
      await p.waitForSelector('[data-testid="input-bcd"]');

      // 1. Default Hand-Calculation Verification
      // Inputs: D = 200 mm (R = 100 mm), n = 8, startAngle = 0 deg
      // Hand calc:
      //   Chord = 2 * 100 * sin(pi / 8) = 200 * 0.38268343 = 76.536686 mm -> 76.537 mm
      //   Arc Spacing = pi * 200 / 8 = 25 * pi = 78.539816 mm -> 78.540 mm
      //   Angle Step = 360 / 8 = 45.000 deg
      //   First Hole (X1, Y1) = (100 * cos(0), 100 * sin(0)) = (100.000, 0.000) mm
      const chord = parseFloat(await p.innerText('[data-testid="result-chord"]'));
      const spacing = parseFloat(await p.innerText('[data-testid="result-spacing"]'));
      const angleStep = parseFloat(await p.innerText('[data-testid="result-angle-step"]'));
      const firstHoleText = await p.innerText('[data-testid="result-first-hole"]');

      assertClose(chord, 76.537, 0.001, 'Default Chord Distance');
      assertClose(spacing, 78.540, 0.001, 'Default Arc Perimeter Spacing');
      assertClose(angleStep, 45.000, 0.001, 'Default Angular Pitch');
      if (!firstHoleText.includes('(100.000, 0.000)')) {
        throw new Error(`Expected First Hole (100.000, 0.000), got: ${firstHoleText}`);
      }

      // 2. Preset Branch: Straddled 4-Bolt Cover (BCD=150, n=4, startAngle=45 deg)
      // Hand calc:
      //   R = 75 mm
      //   Chord = 150 * sin(45 deg) = 150 * 0.70710678 = 106.066017 mm -> 106.066 mm
      //   Arc = pi * 150 / 4 = 117.80972 mm -> 117.810 mm
      //   Angle Step = 360 / 4 = 90.000 deg
      //   X1 = 75 * cos(45 deg) = 53.033 mm, Y1 = 75 * sin(45 deg) = 53.033 mm
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-chord"]');
        return el && el.textContent.includes('106.066');
      });
      const pArc = parseFloat(await p.innerText('[data-testid="result-spacing"]'));
      const pStep = parseFloat(await p.innerText('[data-testid="result-angle-step"]'));
      const pFirst = await p.innerText('[data-testid="result-first-hole"]');
      assertClose(pArc, 117.810, 0.001, '4-Bolt Preset Arc Spacing');
      assertClose(pStep, 90.000, 0.001, '4-Bolt Preset Angular Step');
      if (!pFirst.includes('(53.033, 53.033)')) {
        throw new Error(`Expected 4-Bolt First Hole (53.033, 53.033), got: ${pFirst}`);
      }

      // 3. Reset Button Verification
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-chord"]');
        return el && el.textContent.includes('76.537');
      });

      // 4. Input Robustness: Empty, 'abc', '12abc'
      const bcdInput = p.locator('[data-testid="input-bcd"]');
      const countInput = p.locator('[data-testid="input-count"]');

      await bcdInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-chord"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bolt Circle empty BCD');

      await bcdInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-chord"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bolt Circle abc BCD');

      await bcdInput.fill('200');
      await countInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-chord"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bolt Circle 12abc count');

      await countInput.fill('8');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-chord"]').textContent.includes('76.537'));

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Chord_Distance_mm') || !csvText.includes('Arc_Perimeter_Spacing_mm')) {
        throw new Error('Bolt Circle CSV missing expected column headers');
      }
      if (!csvText.includes('76.537') || !csvText.includes('78.540') || !csvText.includes('100.000')) {
        throw new Error('Bolt Circle CSV missing expected numerical values');
      }

      // 6. Negative Assertion: Unrelated fastener strength standards must NOT appear
      const coreText = (await p.innerText('[data-testid="calculator-inputs"]')) + ' ' + (await p.innerText('[data-testid="calculator-results"]'));
      if (coreText.includes('VDI 2230') || coreText.includes('ISO 898-1')) {
        throw new Error('Bolt Circle core contains unrelated fastener strength standard numbers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 35: bolt-circle-pattern-calculator
    // -------------------------------------------------------------------------
    await runSubTest('35. bolt-circle-pattern-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bolt-circle-pattern-calculator`, { waitUntil: 'networkidle' });
      await p.waitForSelector('[data-testid="input-pcd"]');

      // 1. Default Hand-Calculation Verification
      // Inputs: PCD = 100 mm (R = 50.000 mm), N = 8, Start Angle = 0 deg, Hole Dia = 10 mm
      // Hand calc:
      //   Pitch Radius R = 100 / 2 = 50.000 mm
      //   Chord = 100 * sin(180 / 8 deg) = 100 * 0.38268343 = 38.268343 mm -> 38.268 mm
      //   Angular Step = 360 / 8 = 45.000 deg
      //   Hole #1 (0 deg): X = 50.000, Y = 0.000
      //   Hole #2 (45 deg): X = 50 * cos(45) = 35.355, Y = 50 * sin(45) = 35.355
      //   Hole #3 (90 deg): X = 0.000, Y = 50.000
      const radius = parseFloat(await p.innerText('[data-testid="result-radius"]'));
      const chord = parseFloat(await p.innerText('[data-testid="result-chord"]'));
      const step = parseFloat(await p.innerText('[data-testid="result-angle-step"]'));
      const hole1Text = await p.innerText('[data-testid="result-hole-1"]');
      const row2Text = await p.innerText('[data-testid="coord-row-2"]');
      const row3Text = await p.innerText('[data-testid="coord-row-3"]');

      assertClose(radius, 50.000, 0.001, 'Default Pitch Radius R');
      assertClose(chord, 38.268, 0.001, 'Default Chord Length');
      assertClose(step, 45.000, 0.001, 'Default Angular Step');
      if (!hole1Text.includes('(50.000, 0.000)')) {
        throw new Error(`Expected Hole #1 (50.000, 0.000), got: ${hole1Text}`);
      }
      if (!row2Text.includes('35.355') || !row2Text.includes('45.000°')) {
        throw new Error(`Row 2 coordinates mismatch: ${row2Text}`);
      }
      if (!row3Text.includes('0.000') || !row3Text.includes('50.000') || !row3Text.includes('90.000°')) {
        throw new Error(`Row 3 coordinates mismatch: ${row3Text}`);
      }

      // 2. Preset Branch: 6-Bolt Hex Flange (PCD=120, N=6, Start Angle=30 deg, Hole Dia=12)
      // Hand calc:
      //   R = 60.000 mm
      //   Chord = 120 * sin(30 deg) = 120 * 0.5 = 60.000 mm
      //   Step = 360 / 6 = 60.000 deg
      //   Hole #1 (30 deg): X1 = 60 * cos(30) = 51.9615 -> 51.962 mm, Y1 = 60 * sin(30) = 30.000 mm
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-chord"]');
        return el && el.textContent.includes('60.000');
      });
      const hexR = parseFloat(await p.innerText('[data-testid="result-radius"]'));
      const hexStep = parseFloat(await p.innerText('[data-testid="result-angle-step"]'));
      const hexHole1 = await p.innerText('[data-testid="result-hole-1"]');
      assertClose(hexR, 60.000, 0.001, '6-Bolt Hex Preset Radius');
      assertClose(hexStep, 60.000, 0.001, '6-Bolt Hex Preset Step');
      if (!hexHole1.includes('(51.962, 30.000)')) {
        throw new Error(`Expected 6-Bolt Hole #1 (51.962, 30.000), got: ${hexHole1}`);
      }

      // 3. Reset Button Verification
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-chord"]');
        return el && el.textContent.includes('38.268');
      });

      // 4. Input Robustness: Empty, 'abc', '12abc' (including SVG preview safety)
      const pcdInput = p.locator('[data-testid="input-pcd"]');
      const countInput = p.locator('[data-testid="input-bolt-count"]');

      await pcdInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-radius"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern empty PCD');

      await pcdInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-radius"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern abc PCD');

      await pcdInput.fill('100');
      await countInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-radius"]').textContent.trim().startsWith('—'));
      await verifyNoNaNOrInfinity(p, 'Bolt Pattern 12abc bolt count');

      await countInput.fill('8');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-chord"]').textContent.includes('38.268'));

      // 5. CSV Export Assertion
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvPath = await download.path();
      const csvText = fs.readFileSync(csvPath, 'utf8');
      if (!csvText.includes('Hole_Index,X_mm,Y_mm,Angle_deg') || !csvText.includes('Chord_Length_mm')) {
        throw new Error('Bolt Pattern CSV missing expected column headers');
      }
      if (!csvText.includes('1,50.000,0.000,0.000') || !csvText.includes('35.355,35.355,45.000')) {
        throw new Error('Bolt Pattern CSV missing expected coordinate rows');
      }

      // 6. Negative Assertion: Unrelated fastener strength standards must NOT appear
      const coreText = (await p.innerText('[data-testid="calculator-inputs"]')) + ' ' + (await p.innerText('[data-testid="calculator-results"]'));
      if (coreText.includes('VDI 2230') || coreText.includes('ISO 898-1')) {
        throw new Error('Bolt Pattern core contains unrelated fastener strength standard numbers');
      }
    });
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF BATCH 7 (TOOLS 31 TO 35) E2E TESTS:');
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

runBatch7Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
