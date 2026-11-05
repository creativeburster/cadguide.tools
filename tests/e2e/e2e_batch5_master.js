/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 5 (Tools 21 to 25)
 *
 * Validates:
 * 21. autolisp-function-reference (AutoLISP syntax, purged duplicate angle, reference mode headers, search filter)
 * 22. aws-welding-symbol-reference (AWS A2.4 symbol dictionary, reference mode headers, groove/basic/supplementary/process search)
 * 23. bearing-life-calculator (ISO 281:2007 L10/L10h hand calculations, ball vs roller exponent, presets, empty defense, csv)
 * 24. bearing-static-load-calculator (ISO 76:2006 P0r=max(X0*Fr+Y0*Fa, Fr) & C0=s0*P0 hand calculations, presets, empty defense, csv)
 * 25. belt-drive-length-calculator (ISO 4183/RMA IP-20 pitch length, center distance quadratic solve, wrap angles, presets, empty defense, csv)
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function assertClose(actual, expected, maxRelError = 0.01, context = '') {
  const diff = Math.abs(actual - expected);
  const relError = expected === 0 ? diff : diff / Math.abs(expected);
  if (relError > maxRelError) {
    throw new Error(
      `[${context}] Value mismatch: actual ${actual} vs expected ${expected} (relative error ${(relError * 100).toFixed(3)}% > ${(maxRelError * 100).toFixed(3)}%)`
    );
  }
}

async function runMasterSuite() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 5 (Tools 21 to 25)');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(20000);

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
    // Tool 21: autolisp-function-reference
    // -------------------------------------------------------------------------
    await runSubTest('21. autolisp-function-reference', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/autolisp-function-reference`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="shortcut-search-input"]');

      const bodyText = await p.innerText('body');

      // 1. Negative assertion: Verify duplicate "Angle in Radians" command is purged
      if (bodyText.includes('Angle in Radians')) {
        throw new Error('Found purged duplicate "Angle in Radians" on page!');
      }

      // 2. Search core functions verified from Autodesk official materials
      const searchInput = p.locator('[data-testid="shortcut-search-input"]');

      // defun
      await searchInput.fill('defun');
      await p.waitForTimeout(150);
      let pageText = await p.innerText('body');
      if (!pageText.includes('defun') || !pageText.includes('Define Function')) {
        throw new Error('defun function missing or not found in search');
      }

      // entget
      await searchInput.fill('entget');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('(entget ename)') || !pageText.includes('DXF group codes')) {
        throw new Error('entget function missing or not found in search');
      }

      // ssget
      await searchInput.fill('ssget');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('(ssget mode pt1 pt2)') || !pageText.includes('Selection Set')) {
        throw new Error('ssget function missing or not found in search');
      }

      // polar
      await searchInput.fill('polar');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('(polar pt ang dist)') || !pageText.includes('Polar Point')) {
        throw new Error('polar function missing or not found in search');
      }

      // 3. Category filter switching
      await searchInput.fill('');
      const mathBtn = p.locator('button:has-text("Math & Logic")').first();
      if (await mathBtn.isVisible()) {
        await mathBtn.click();
        await p.waitForTimeout(150);
        const mathText = await p.innerText('body');
        if (!mathText.includes('Addition') || !mathText.includes('Increment')) {
          throw new Error('Math category filter failed to show math functions');
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 22: aws-welding-symbol-reference
    // -------------------------------------------------------------------------
    await runSubTest('22. aws-welding-symbol-reference', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/aws-welding-symbol-reference`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="shortcut-search-input"]');

      const searchInput = p.locator('[data-testid="shortcut-search-input"]');

      // 1. Search authentic AWS A2.4 symbols: Fillet Weld
      await searchInput.fill('Fillet Weld');
      await p.waitForTimeout(150);
      let pageText = await p.innerText('body');
      if (!pageText.includes('Fillet Weld') || !pageText.includes('Triangular cross-section')) {
        throw new Error('Fillet Weld missing from welding symbol reference');
      }

      // 2. Search Groove types
      await searchInput.fill('V-Groove');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('V-Groove') || !pageText.includes('beveled')) {
        throw new Error('V-Groove missing from welding symbol reference');
      }

      // 3. Search Supplementary symbols: Melt-Through
      await searchInput.fill('Melt-Through');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('Melt-Through') || !pageText.includes('root reinforcement')) {
        throw new Error('Melt-Through missing from welding symbol reference');
      }

      // 4. Search Process & Tail: SMAW
      await searchInput.fill('SMAW');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('Shielded Metal Arc Welding') || !pageText.includes('Stick welding')) {
        throw new Error('SMAW missing from welding process reference');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 23: bearing-life-calculator
    // -------------------------------------------------------------------------
    await runSubTest('23. bearing-life-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bearing-life-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-c"]');

      // 1. Default hand-calculation verification (ISO 281:2007)
      // C = 50 kN, P = 5 kN, Speed = 1500 RPM, Type = ball (p = 3)
      // Hand calc:
      //   L10 = (C / P)^3 = (50 / 5)^3 = 10^3 = 1000.00 Mr
      //   L10h = (10^6 / (60 * n)) * L10 = (10^6 / (60 * 1500)) * 1000 = 1000000000 / 90000 = 11111.11 -> 11111 hours
      const l10Default = parseFloat(await p.innerText('[data-testid="result-l10"]'));
      const l10hDefault = parseFloat(await p.innerText('[data-testid="result-l10h"]'));
      assertClose(l10Default, 1000.00, 0.001, 'Default L10 (ball)');
      assertClose(l10hDefault, 11111, 0.001, 'Default L10h (ball)');

      // 2. Roller bearing branch hand-calculation
      // Switch type to roller (p = 10/3)
      // Hand calc:
      //   L10 = (50 / 5)^(10/3) = 10^(3.333333) = 2154.43469 -> 2154 Mr
      //   L10h = (10^6 / (60 * 1500)) * 2154.43469 = 23938.16 -> 23938 hours
      await p.selectOption('[data-testid="select-type"]', 'roller');
      await p.waitForFunction(() => {
        const el = document.querySelector('[data-testid="result-l10"]');
        return el && parseFloat(el.innerText) > 2000;
      });
      const l10Roller = parseFloat(await p.innerText('[data-testid="result-l10"]'));
      const l10hRoller = parseFloat(await p.innerText('[data-testid="result-l10h"]'));
      assertClose(l10Roller, 2154, 0.01, 'Roller bearing L10');
      assertClose(l10hRoller, 23938, 0.01, 'Roller bearing L10h');

      // 3. Preset testing: Industrial Gearbox (Roller)
      // C = 120 kN, P = 25 kN, n = 900 RPM, p = 10/3
      // Hand calc:
      //   ratio = 120 / 25 = 4.8
      //   L10 = 4.8^(10/3) = 186.554 Mr -> 186.55 Mr
      //   L10h = (10^6 / (60 * 900)) * 186.554 = 186554000 / 54000 = 3454.7 -> 3455 hours
      await p.click('[data-testid="btn-preset-gearbox"]');
      await p.waitForFunction(() => {
        const cInp = document.querySelector('[data-testid="input-c"]');
        const el = document.querySelector('[data-testid="result-l10"]');
        return cInp && cInp.value === '120' && el && parseFloat(el.innerText) < 500;
      });
      const l10Gearbox = parseFloat(await p.innerText('[data-testid="result-l10"]'));
      const l10hGearbox = parseFloat(await p.innerText('[data-testid="result-l10h"]'));
      assertClose(l10Gearbox, 186.55, 0.01, 'Gearbox preset L10');
      assertClose(l10hGearbox, 3455, 0.01, 'Gearbox preset L10h');

      // 4. Empty / illegal input defense (no NaN / no Infinity)
      await p.fill('[data-testid="input-c"]', '');
      await p.waitForTimeout(100);
      const emptyL10 = await p.innerText('[data-testid="result-l10"]');
      const emptyL10h = await p.innerText('[data-testid="result-l10h"]');
      if (emptyL10 !== '—' || emptyL10h !== '—') {
        throw new Error(`Expected '—' on empty input, got L10=${emptyL10}, L10h=${emptyL10h}`);
      }

      // Check whole page for NaN / Infinity
      const fullText = await p.innerText('body');
      if (fullText.includes('NaN') || fullText.includes('Infinity')) {
        throw new Error('Found NaN or Infinity on bearing-life calculator page after empty input!');
      }

      // 5. Reset button restoration
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const cInp = document.querySelector('[data-testid="input-c"]');
        return cInp && cInp.value === '50';
      });
      const resetL10 = parseFloat(await p.innerText('[data-testid="result-l10"]'));
      assertClose(resetL10, 1000.00, 0.001, 'Reset restored L10');

      // 6. CSV Export download and content verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const downloadPath = await download.path();
      const csvContent = fs.readFileSync(downloadPath, 'utf-8');
      if (!csvContent.includes('ISO 281:2007') || !csvContent.includes('Basic Rating Life L10')) {
        throw new Error('Bearing life CSV content missing ISO 281 standard or headers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 24: bearing-static-load-calculator
    // -------------------------------------------------------------------------
    await runSubTest('24. bearing-static-load-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bearing-static-load-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-fr"]');

      // 1. Default hand-calculation verification (ISO 76:2006)
      // Fr = 10 kN, Fa = 2 kN, X0 = 0.6, Y0 = 0.5, s0 = 1.5
      // Hand calc:
      //   X0*Fr + Y0*Fa = 0.6*10 + 0.5*2 = 6 + 1 = 7 kN
      //   P0 = max(7, Fr=10) = 10.000 kN
      //   C0 = s0 * P0 = 1.5 * 10 = 15.000 kN
      const p0Default = parseFloat(await p.innerText('[data-testid="result-p0"]'));
      const c0Default = parseFloat(await p.innerText('[data-testid="result-c0"]'));
      assertClose(p0Default, 10.000, 0.001, 'Default P0 (radial dominating)');
      assertClose(c0Default, 15.000, 0.001, 'Default C0');

      // 2. High axial load branch (where X0*Fr + Y0*Fa > Fr)
      // Change Fa = 15 kN
      // Hand calc:
      //   X0*Fr + Y0*Fa = 0.6*10 + 0.5*15 = 6 + 7.5 = 13.5 kN
      //   P0 = max(13.5, 10) = 13.500 kN
      //   C0 = 1.5 * 13.5 = 20.250 kN
      const faInput = p.locator('[data-testid="input-fa"]');
      await faInput.fill('15');
      await faInput.blur();
      await p.waitForTimeout(200);
      const p0Axial = parseFloat(await p.innerText('[data-testid="result-p0"]'));
      const c0Axial = parseFloat(await p.innerText('[data-testid="result-c0"]'));
      assertClose(p0Axial, 13.500, 0.001, 'High axial P0');
      assertClose(c0Axial, 20.250, 0.001, 'High axial C0');

      // 3. Safety factor preset testing: Shock loads (s0 = 2.0)
      // With Fa reset to 2 kN (P0 = 10 kN), C0 = 2.0 * 10 = 20.000 kN
      await p.fill('[data-testid="input-fa"]', '2');
      await p.click('[data-testid="btn-preset-shock"]');
      await p.waitForFunction(() => {
        const s0Inp = document.querySelector('[data-testid="input-s0"]');
        return s0Inp && s0Inp.value === '2.0';
      });
      const c0Shock = parseFloat(await p.innerText('[data-testid="result-c0"]'));
      assertClose(c0Shock, 20.000, 0.001, 'Shock load C0');

      // 4. Empty / illegal input defense (no NaN / no Infinity)
      await p.fill('[data-testid="input-fr"]', '');
      await p.waitForTimeout(100);
      const emptyP0 = await p.innerText('[data-testid="result-p0"]');
      const emptyC0 = await p.innerText('[data-testid="result-c0"]');
      if (emptyP0 !== '—' || emptyC0 !== '—') {
        throw new Error(`Expected '—' on empty Fr, got P0=${emptyP0}, C0=${emptyC0}`);
      }
      const pageText = await p.innerText('body');
      if (pageText.includes('NaN') || pageText.includes('Infinity')) {
        throw new Error('Found NaN or Infinity on bearing-static calculator page after empty input!');
      }

      // 5. Reset button restoration
      await p.click('[data-testid="btn-reset"]');
      await p.waitForFunction(() => {
        const frInp = document.querySelector('[data-testid="input-fr"]');
        return frInp && frInp.value === '10';
      });
      const resetP0 = parseFloat(await p.innerText('[data-testid="result-p0"]'));
      const resetC0 = parseFloat(await p.innerText('[data-testid="result-c0"]'));
      assertClose(resetP0, 10.000, 0.001, 'Reset restored P0');
      assertClose(resetC0, 15.000, 0.001, 'Reset restored C0');

      // 6. CSV Export download
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const downloadPath = await download.path();
      const csvContent = fs.readFileSync(downloadPath, 'utf-8');
      if (!csvContent.includes('ISO 76:2006') || !csvContent.includes('Equivalent Static Load P0')) {
        throw new Error('Bearing static CSV content missing ISO 76 standard or headers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 25: belt-drive-length-calculator
    // -------------------------------------------------------------------------
    await runSubTest('25. belt-drive-length-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/belt-drive-length-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-d1"]');

      // 1. Default hand-calculation verification (ISO 4183 / RMA IP-20 / BANDO manual)
      // Mode: beltLength
      // D1 = 100 mm, D2 = 300 mm, C = 500 mm, Input RPM = 1450
      // Hand calc:
      //   L = 2*500 + (π/2)*(100+300) + (300 - 100)^2 / (4*500)
      //     = 1000 + 200*π + 40000 / 2000
      //     = 1000 + 628.3185 + 20 = 1648.3185 -> 1648.3 mm
      //   Speed Ratio = 300 / 100 = 3.00:1
      //   Output RPM = 1450 / 3 = 483.33 -> 483 RPM
      //   Wrap driver: 180° - 2*asin(200 / 1000)*(180/π) = 180° - 23.074° = 156.926° -> 156.9°
      //   Wrap driven: 180° + 23.074° = 203.074° -> 203.1°
      const beltLenDefault = parseFloat(await p.innerText('[data-testid="result-primary-value"]'));
      const outputRpmDefault = parseFloat(await p.innerText('[data-testid="result-output-rpm"]'));
      const ratioDefault = parseFloat(await p.innerText('[data-testid="result-speed-ratio"]'));
      const driverWrapDefault = parseFloat(await p.innerText('[data-testid="result-driver-wrap"]'));
      const drivenWrapDefault = parseFloat(await p.innerText('[data-testid="result-driven-wrap"]'));

      assertClose(beltLenDefault, 1648.3, 0.001, 'Default Belt Length');
      assertClose(outputRpmDefault, 483, 0.01, 'Default Output RPM');
      assertClose(ratioDefault, 3.00, 0.001, 'Default Speed Ratio');
      assertClose(driverWrapDefault, 156.9, 0.002, 'Default Driver Wrap');
      assertClose(drivenWrapDefault, 203.1, 0.002, 'Default Driven Wrap');

      // 2. Solve for Center Distance mode (reverse calculation)
      // Click Center Dist mode with hydration retry defense
      const centerDistBtn = p.locator('[data-testid="btn-mode-center-dist"]');
      await centerDistBtn.click();
      try {
        await p.waitForSelector('[data-testid="input-belt-length"]', { timeout: 3000 });
      } catch {
        // Retry click in case of dev server initial hydration lag
        await centerDistBtn.click();
        await p.waitForSelector('[data-testid="input-belt-length"]', { timeout: 15000 });
      }

      // Input L = 1648.3 mm (from previous result) with D1=100, D2=300
      // Hand calc should yield C ≈ 500.0 mm
      await p.fill('[data-testid="input-belt-length"]', '1648.3');
      await p.waitForTimeout(150);
      const solvedC = parseFloat(await p.innerText('[data-testid="result-primary-value"]'));
      assertClose(solvedC, 500.0, 0.01, 'Reverse calculated Center Distance');

      // 3. Preset testing: 1:1 Direct drive
      // D1 = 150 mm, D2 = 150 mm, C = 450 mm, Input RPM = 1450
      // Switch back to beltLength mode with hydration defense
      const beltLenBtn = p.locator('[data-testid="btn-mode-belt-length"]');
      await beltLenBtn.click();
      try {
        await p.waitForSelector('[data-testid="input-center-dist"]', { timeout: 3000 });
      } catch {
        await beltLenBtn.click();
        await p.waitForSelector('[data-testid="input-center-dist"]', { timeout: 15000 });
      }
      await p.click('[data-testid="btn-preset-1-1"]');
      await p.waitForTimeout(150);

      // Hand calc:
      //   L = 2*450 + (π/2)*(150+150) + 0 = 900 + 150*π = 900 + 471.239 = 1371.2 mm
      //   Speed Ratio = 1.00:1, Output RPM = 1450, Wrap = 180.0°
      const len1to1 = parseFloat(await p.innerText('[data-testid="result-primary-value"]'));
      const ratio1to1 = parseFloat(await p.innerText('[data-testid="result-speed-ratio"]'));
      const wrap1to1 = parseFloat(await p.innerText('[data-testid="result-driver-wrap"]'));
      assertClose(len1to1, 1371.2, 0.001, '1:1 Preset Belt Length');
      assertClose(ratio1to1, 1.00, 0.001, '1:1 Preset Ratio');
      assertClose(wrap1to1, 180.0, 0.001, '1:1 Preset Wrap Angle');

      // 4. Empty / illegal input defense (no NaN / no Infinity)
      await p.fill('[data-testid="input-d1"]', '');
      await p.waitForTimeout(100);
      const emptyVal = await p.innerText('[data-testid="result-primary-value"]');
      if (emptyVal !== '—') {
        throw new Error(`Expected '—' on empty D1, got ${emptyVal}`);
      }
      const pageText = await p.innerText('body');
      if (pageText.includes('NaN') || pageText.includes('Infinity')) {
        throw new Error('Found NaN or Infinity on belt-drive calculator page after empty input!');
      }

      // 5. Reset button restoration
      await p.click('[data-testid="btn-reset"]');
      await p.waitForTimeout(100);
      const resetLen = parseFloat(await p.innerText('[data-testid="result-primary-value"]'));
      assertClose(resetLen, 1648.3, 0.001, 'Reset restored Belt Length');

      // 6. CSV Export download
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const downloadPath = await download.path();
      const csvContent = fs.readFileSync(downloadPath, 'utf-8');
      if (!csvContent.includes('Belt Drive Calculator Report') || !csvContent.includes('Driver Pulley D1 (mm)')) {
        throw new Error('Belt drive CSV content missing title or headers');
      }
    });

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF BATCH 5 (TOOLS 21 TO 25) E2E TESTS:');
  console.log('================================================================');
  let passCount = 0;
  for (const r of results) {
    const mark = r.status === 'PASS' ? '✓ [PASS]' : '✗ [FAIL]';
    console.log(`${mark} ${r.name}: ${r.status === 'PASS' ? 'All assertions verified' : r.error}`);
    if (r.status === 'PASS') passCount++;
  }
  console.log('================================================================\n');

  if (passCount !== results.length) {
    process.exit(1);
  }
}

runMasterSuite().catch((err) => {
  console.error('Fatal error running Master Suite:', err);
  process.exit(1);
});
