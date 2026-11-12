/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 10 (Tools 46 to 50)
 *
 * Validates:
 * 46. cad-license-tco-calculator (Sample-input subscription vs perpetual TCO formulas, training & hardware, vendor official pricing links, embed route, input defenses, CSV export, negative assertions)
 * 47. cad-limits-checker (Model-space LIMITS X_max/Y_max, GRID/SNAP spacing, ISO 216 & ARCH presets, LIMCHECK, pure-ASCII .scr download, input defenses, negative assertions)
 * 48. cad-scale-list-reset-helper (-SCALELISTEDIT & ACAD_SCALELIST pure-ASCII AutoLISP generation, custom n:m scale factor, presets, input defenses, .lsp download, negative assertions)
 * 49. cam-profile-calculator (SHM, Cycloidal with beta_rad^2 denominator, Uniform Velocity, rpm->rad/s & deg->rad conversions, input defenses, CSV export, negative assertions)
 * 50. capacitor-reactance-calculator (X_C = 1/(2*pi*f*C), tau = R*C, f_c = 1/(2*pi*R*C), |Z|, pF/nF/uF/mF & Hz/kHz/MHz & ohm/kohm conversions, input defenses, CSV export, negative assertions)
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

function assertEqual(actual, expected, context = '') {
  if (actual !== expected) {
    throw new Error(`[${context}] Expected "${expected}", got "${actual}"`);
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

async function verifyNegativeTermsInContainer(page, forbiddenTerms, context) {
  const inputsText = await page.locator('[data-testid="calculator-inputs"]').innerText();
  const resultsText = await page.locator('[data-testid="calculator-results"]').innerText();
  const combined = `${inputsText}\n${resultsText}`;
  for (const term of forbiddenTerms) {
    if (combined.includes(term)) {
      throw new Error(`[${context}] Found forbidden unrelated standard/term "${term}" in calculator container!`);
    }
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

async function readNumberTestId(page, testId) {
  const raw = (await page.locator(`[data-testid="${testId}"]`).innerText()).trim();
  return Number(raw);
}

async function readTextTestId(page, testId) {
  return (await page.locator(`[data-testid="${testId}"]`).innerText()).trim();
}

async function runBatch10Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 10 (Tools 46 to 50)');
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
    // Tool 46: cad-license-tco-calculator (+ /embed/cad-license-tco-calculator)
    // -------------------------------------------------------------------------
    await runSubTest('46. cad-license-tco-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cad-license-tco-calculator`, '[data-testid="input-seats"]');

      // 1. Default Hand-Calculation (S=10 seats, Y=3 yrs, P_sub=1800, esc=5%, P_perp=1200, maint=20%, train=300, hw=500)
      //   Option A software/seat = 1800 + 1800*1.05 + 1800*1.05^2 = 1800 + 1890 + 1984.50 = 5674.50 USD
      //   Option A TCO/seat      = 5674.50 + 300 + 500 = 6474.50 USD
      //   Option A Team TCO      = 10 * 6474.50 = 64745.00 USD
      //   Option B software/seat = 1200 + 2 * (1200 * 0.20) = 1200 + 480 = 1680.00 USD
      //   Option B TCO/seat      = 1680.00 + 300 + 500 = 2480.00 USD
      //   Option B Team TCO      = 10 * 2480.00 = 24800.00 USD
      //   Net Difference         = 64745.00 - 24800.00 = 39945.00 USD
      //   Relative Savings       = (39945.00 / 64745.00) * 100 = 61.69588% -> 61.70%
      assertClose(await readNumberTestId(p, 'out-soft-seat-a'), 5674.5, 0.001, 'tco default soft A');
      assertClose(await readNumberTestId(p, 'out-tco-seat-a'), 6474.5, 0.001, 'tco default full seat A');
      assertClose(await readNumberTestId(p, 'out-total-a'), 64745.0, 0.001, 'tco default team A');
      assertClose(await readNumberTestId(p, 'out-soft-seat-b'), 1680.0, 0.001, 'tco default soft B');
      assertClose(await readNumberTestId(p, 'out-tco-seat-b'), 2480.0, 0.001, 'tco default full seat B');
      assertClose(await readNumberTestId(p, 'out-total-b'), 24800.0, 0.001, 'tco default team B');
      assertClose(await readNumberTestId(p, 'out-net-savings'), 39945.0, 0.001, 'tco default savings');
      assertClose(await readNumberTestId(p, 'out-savings-pct'), 61.7, 0.001, 'tco default pct');
      assertEqual(await readTextTestId(p, 'out-lower-option'), 'Option B (Perpetual + Maintenance)', 'tco default winner');

      // Verify vendor official pricing links exist and point to external https vendor pages
      const hrefs = await p
        .locator('[data-testid="vendor-pricing-links"] a')
        .evaluateAll((els) => els.map((a) => a.getAttribute('href') || ''));
      if (hrefs.length < 6 || !hrefs.some((h) => h.includes('autodesk.com')) || !hrefs.some((h) => h.includes('rhino3d.com'))) {
        throw new Error(`Expected official vendor pricing links, got: ${JSON.stringify(hrefs)}`);
      }

      // 2. CSV Download Verification on default values
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-csv"]'),
      ]);
      const csvPath = await download.path();
      const csvLines = fs.readFileSync(csvPath, 'utf-8').trim().split(/\r?\n/);
      assertEqual(
        csvLines[0],
        'Seats,Years,Sub_Fee_A_per_Seat_Yr,Escalation_A_pct,Perp_Buyout_B_per_Seat,Maintenance_B_pct,Training_per_Seat,Hardware_per_Seat,Option_A_TCO_per_Seat,Option_A_Team_TCO,Option_B_TCO_per_Seat,Option_B_Team_TCO,Absolute_Difference,Savings_pct',
        'tco csv header'
      );
      assertEqual(
        csvLines[1],
        '10,3,1800.00,5.00,1200.00,20.00,300.00,500.00,6474.50,64745.00,2480.00,24800.00,39945.00,61.70',
        'tco csv data row'
      );

      // 3. Preset 2: 25 Seats · 5 Yr (S=25, Y=5, P_sub=2000, esc=4%, P_perp=1500, maint=18%, train=400, hw=800)
      //   softA = 2000 * (1 + 1.04 + 1.0816 + 1.124864 + 1.16985856) = 10832.64512 -> 10832.65
      //   seatA = 12032.64512 -> 12032.65, totalA = 25 * 12032.64512 = 300816.128 -> 300816.13
      //   softB = 1500 + 4 * 270 = 2580.00, seatB = 3780.00, totalB = 94500.00
      //   diff = 206316.13, pct = 68.59%
      await p.click('[data-testid="preset-enterprise-5yr"]');
      assertClose(await readNumberTestId(p, 'out-total-a'), 300816.13, 0.001, 'tco 5yr total A');
      assertClose(await readNumberTestId(p, 'out-total-b'), 94500.0, 0.001, 'tco 5yr total B');
      assertClose(await readNumberTestId(p, 'out-net-savings'), 206316.13, 0.001, 'tco 5yr diff');
      assertClose(await readNumberTestId(p, 'out-savings-pct'), 68.59, 0.001, 'tco 5yr pct');

      // 4. Preset 3: 5 Seats · 1 Yr (Equal TCO branch, then Option A cheaper branch)
      await p.click('[data-testid="preset-pilot-1yr"]');
      assertClose(await readNumberTestId(p, 'out-total-a'), 7500.0, 0.001, 'tco 1yr total A');
      assertClose(await readNumberTestId(p, 'out-total-b'), 7500.0, 0.001, 'tco 1yr total B');
      assertEqual(await readTextTestId(p, 'out-lower-option'), 'Equal TCO', 'tco 1yr tie');

      await p.fill('[data-testid="input-sub-fee-a"]', '900');
      assertClose(await readNumberTestId(p, 'out-total-a'), 4500.0, 0.001, 'tco sub lower A');
      assertEqual(await readTextTestId(p, 'out-lower-option'), 'Option A (Subscription)', 'tco sub winner');

      // 5. Strict Input Defenses across >= 2 inputs ("", "abc", "12abc", fractional seats, out-of-range years)
      for (const bad of ['', 'abc', '12abc', '2.5']) {
        await p.fill('[data-testid="input-seats"]', bad);
        assertEqual(await readTextTestId(p, 'out-total-a'), '—', `tco bad seats "${bad}"`);
        await verifyNoNaNOrInfinity(p, `tco bad seats "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '-100']) {
        await p.fill('[data-testid="input-sub-fee-a"]', bad);
        assertEqual(await readTextTestId(p, 'out-total-a'), '—', `tco bad subFee "${bad}"`);
        await verifyNoNaNOrInfinity(p, `tco bad subFee "${bad}"`);
      }

      // 6. Reset verification & negative assertions
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-total-a'), 64745.0, 0.001, 'tco after reset');
      await verifyNegativeTermsInContainer(
        p,
        ['ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', 'ISO 19650', 'live catalog pricing'],
        '46. cad-license-tco-calculator'
      );

      // 7. Chrome-free /embed/cad-license-tco-calculator route smoke check
      await openToolPage(p, `${BASE_URL}/embed/cad-license-tco-calculator`, '[data-testid="input-seats"]');
      assertClose(await readNumberTestId(p, 'out-total-a'), 64745.0, 0.001, 'tco embed total A');
      await verifyNoNaNOrInfinity(p, 'tco embed route');
    });

    // -------------------------------------------------------------------------
    // Tool 47: cad-limits-checker
    // -------------------------------------------------------------------------
    await runSubTest('47. cad-limits-checker', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cad-limits-checker`, '[data-testid="input-sheet-width"]');

      // 1. Default Hand-Calculation (ISO A3: 420 x 297 mm, Landscape, unit=mm, S=100, p_grid=10 mm, N_sub=5, LIMCHECK=0)
      //   X_max = (420 * 100) / 1 = 42000.00 mm
      //   Y_max = (297 * 100) / 1 = 29700.00 mm
      //   GRID  = (10 * 100) / 1  = 1000.00 mm
      //   SNAP  = 1000.00 / 5     = 200.00 mm
      assertClose(await readNumberTestId(p, 'out-model-width'), 42000.0, 0.001, 'limits default X_max');
      assertClose(await readNumberTestId(p, 'out-model-height'), 29700.0, 0.001, 'limits default Y_max');
      assertClose(await readNumberTestId(p, 'out-grid-spacing'), 1000.0, 0.001, 'limits default GRID');
      assertClose(await readNumberTestId(p, 'out-snap-spacing'), 200.0, 0.001, 'limits default SNAP');

      // 2. Download .scr verification (pure ASCII + exact AutoCAD command sequence)
      const [scrDownload] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-scr"]'),
      ]);
      const scrContent = fs.readFileSync(await scrDownload.path(), 'utf-8');
      if (!/^[\x00-\x7F]+$/.test(scrContent)) {
        throw new Error('configure_limits.scr contains non-ASCII characters!');
      }
      const expectedScr = [
        'LIMITS',
        '0,0',
        '42000.00,29700.00',
        'LIMCHECK',
        '0',
        'GRID',
        '1000.00',
        'SNAP',
        '200.00',
        'ZOOM',
        'All',
      ].join('\n') + '\n';
      assertEqual(scrContent, expectedScr, 'limits .scr verbatim content');

      // 3. Preset 2: A1 · 1:200 (m) -> 841 x 594 mm, Landscape, unit=m (k_u=1000), S=200, LIMCHECK=1
      //   X_max = (841 * 200) / 1000 = 168.20 m, Y_max = (594 * 200) / 1000 = 118.80 m
      //   GRID  = (10 * 200) / 1000 = 2.00 m, SNAP = 2.00 / 5 = 0.40 m
      await p.click('[data-testid="preset-a1-m-200"]');
      assertClose(await readNumberTestId(p, 'out-model-width'), 168.2, 0.001, 'limits A1 m X_max');
      assertClose(await readNumberTestId(p, 'out-model-height'), 118.8, 0.001, 'limits A1 m Y_max');
      assertClose(await readNumberTestId(p, 'out-grid-spacing'), 2.0, 0.001, 'limits A1 m GRID');
      assertClose(await readNumberTestId(p, 'out-snap-spacing'), 0.4, 0.001, 'limits A1 m SNAP');
      const scrPreviewA1 = await readTextTestId(p, 'out-script-preview');
      if (!scrPreviewA1.includes('LIMCHECK\n1')) {
        throw new Error('Expected LIMCHECK 1 in A1 preset script preview');
      }

      // 4. Preset 3: ARCH D · 1:50 Portrait (914.4 x 609.6 mm -> Portrait X=609.6, Y=914.4, S=50, N_sub=4)
      //   X_max = 609.6 * 50 = 30480.00 mm, Y_max = 914.4 * 50 = 45720.00 mm
      //   GRID = 10 * 50 = 500.00 mm, SNAP = 500 / 4 = 125.00 mm
      await p.click('[data-testid="preset-archd-mm-50"]');
      assertClose(await readNumberTestId(p, 'out-model-width'), 30480.0, 0.001, 'limits ARCH D portrait X');
      assertClose(await readNumberTestId(p, 'out-model-height'), 45720.0, 0.001, 'limits ARCH D portrait Y');
      assertClose(await readNumberTestId(p, 'out-grid-spacing'), 500.0, 0.001, 'limits ARCH D GRID');
      assertClose(await readNumberTestId(p, 'out-snap-spacing'), 125.0, 0.001, 'limits ARCH D SNAP');

      // 5. Input Defenses across >= 2 inputs ("", "abc", "12abc", non-integer snap subdivisions)
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-sheet-width"]', bad);
        assertEqual(await readTextTestId(p, 'out-model-width'), '—', `limits bad width "${bad}"`);
        await verifyNoNaNOrInfinity(p, `limits bad width "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '2.5']) {
        await p.fill('[data-testid="input-snap-subdiv"]', bad);
        assertEqual(await readTextTestId(p, 'out-snap-spacing'), '—', `limits bad subdiv "${bad}"`);
        await verifyNoNaNOrInfinity(p, `limits bad subdiv "${bad}"`);
      }

      // 6. Reset & Negative Assertions
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-model-width'), 42000.0, 0.001, 'limits after reset');
      await verifyNegativeTermsInContainer(
        p,
        ['ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', 'ISO 19650'],
        '47. cad-limits-checker'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 48: cad-scale-list-reset-helper
    // -------------------------------------------------------------------------
    await runSubTest('48. cad-scale-list-reset-helper', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cad-scale-list-reset-helper`, '[data-testid="input-paper-units"]');

      // 1. Default Hand-Calculation (10 metric scales + custom 1:25 -> count = 11, factor = 1/25 = 0.0400)
      assertClose(await readNumberTestId(p, 'out-scale-count'), 11, 0.001, 'scalelist default count');
      assertEqual(await readTextTestId(p, 'out-custom-ratio'), '1:25', 'scalelist default ratio');
      assertClose(await readNumberTestId(p, 'out-custom-factor'), 0.04, 0.001, 'scalelist default factor');

      // 2. Download reset_scalelist.lsp verification (100% pure ASCII + exact AutoLISP commands)
      const [lspDownload] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-lsp"]'),
      ]);
      const lspContent = fs.readFileSync(await lspDownload.path(), 'utf-8');
      if (!/^[\x00-\x7F]+$/.test(lspContent)) {
        throw new Error('reset_scalelist.lsp contains non-ASCII characters (such as emoji)!');
      }
      const requiredTokens = [
        ';; WARNING: Back up the drawing before running;',
        '(defun c:ResetScaleList',
        '(setvar "CMDECHO" 0)',
        '(dictremove (namedobjdict) "ACAD_SCALELIST")',
        '(command "-SCALELISTEDIT" "Reset" "Yes" "Exit")',
        '(dictsearch (namedobjdict) "ACAD_SCALELIST")',
        '(command "-SCALELISTEDIT" "Add" sName sRatio "Exit")',
        '(_cadguide_add_scale "1:1" "1:1")',
        '(_cadguide_add_scale "1:100" "1:100")',
        '(_cadguide_add_scale "1:25" "1:25")',
        '(setvar "CMDECHO" 1)',
      ];
      for (const token of requiredTokens) {
        if (!lspContent.includes(token)) {
          throw new Error(`Missing expected AutoLISP token in reset_scalelist.lsp: ${token}`);
        }
      }
      const resetCallCount = lspContent.split('(command "-SCALELISTEDIT" "Reset" "Yes" "Exit")').length - 1;
      assertEqual(resetCallCount, 1, 'scalelist single -SCALELISTEDIT Reset call');
      const resultsText = await p.locator('[data-testid="calculator-results"]').innerText();
      if (!resultsText.includes('Backup Warning:')) {
        throw new Error('Expected Backup Warning notice on cad-scale-list-reset-helper page');
      }

      // 3. Presets: Metric Only (10) & Imperial Arch (5)
      await p.click('[data-testid="preset-metric-only"]');
      assertClose(await readNumberTestId(p, 'out-scale-count'), 10, 0.001, 'scalelist metric-only count');

      await p.click('[data-testid="preset-imperial-arch"]');
      assertClose(await readNumberTestId(p, 'out-scale-count'), 5, 0.001, 'scalelist imperial count');
      const impPreview = await readTextTestId(p, 'out-lisp-code');
      if (!impPreview.includes('(_cadguide_add_scale "1/8\\"=1\'" "1:96")')) {
        throw new Error('Expected escaped 1/8"=1\' imperial scale entry in LISP output');
      }

      // 4. Input Defenses across 2 inputs ("", "abc", "12abc", "-5") when custom scale enabled
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '-5']) {
        await p.fill('[data-testid="input-paper-units"]', bad);
        assertEqual(await readTextTestId(p, 'out-scale-count'), '—', `scalelist bad paper "${bad}"`);
        assertEqual(await readTextTestId(p, 'out-custom-factor'), '—', `scalelist bad paper factor "${bad}"`);
        await verifyNoNaNOrInfinity(p, `scalelist bad paper "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-drawing-units"]', bad);
        assertEqual(await readTextTestId(p, 'out-scale-count'), '—', `scalelist bad drawing "${bad}"`);
        assertEqual(await readTextTestId(p, 'out-custom-factor'), '—', `scalelist bad drawing factor "${bad}"`);
        await verifyNoNaNOrInfinity(p, `scalelist bad drawing "${bad}"`);
      }

      // 5. Reset & Negative Assertions
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-scale-count'), 11, 0.001, 'scalelist after reset');
      await verifyNegativeTermsInContainer(
        p,
        ['ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', 'ISO 19650', 'CleanDwg'],
        '48. cad-scale-list-reset-helper'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 49: cam-profile-calculator
    // -------------------------------------------------------------------------
    await runSubTest('49. cam-profile-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cam-profile-calculator`, '[data-testid="input-lift"]');

      // 1. Default Hand-Calculation (SHM: h=20 mm, beta=90 deg = pi/2 rad, theta=45 deg, u=0.5, N=60 rpm -> omega=2*pi=6.283 rad/s)
      //   s = (20 / 2) * (1 - cos(pi/2)) = 10.000 mm
      //   v = (pi * 20 * 2*pi) / (2 * (pi/2)) * sin(pi/2) = 40*pi = 125.6637 -> 125.66 mm/s
      //   a = 0.00 mm/s^2
      //   v_max = 125.66 mm/s, a_max = (pi^2 * 20 * 4*pi^2) / (2 * pi^2 / 4) = 160*pi^2 = 1579.1367 -> 1579.14 mm/s^2
      assertClose(await readNumberTestId(p, 'out-displacement'), 10.0, 0.001, 'cam default s');
      assertClose(await readNumberTestId(p, 'out-velocity'), 125.66, 0.001, 'cam default v');
      assertClose(await readNumberTestId(p, 'out-acceleration'), 0.0, 0.001, 'cam default a');
      assertClose(await readNumberTestId(p, 'out-omega'), 6.283, 0.001, 'cam default omega');
      assertClose(await readNumberTestId(p, 'out-vmax'), 125.66, 0.001, 'cam default vmax');
      assertClose(await readNumberTestId(p, 'out-amax'), 1579.14, 0.001, 'cam default amax');

      // 2. CSV Download Verification on default values
      const [csvDownload] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-csv"]'),
      ]);
      const csvLines = fs.readFileSync(await csvDownload.path(), 'utf-8').trim().split(/\r?\n/);
      assertEqual(
        csvLines[0],
        'Motion_Law,Total_Lift_mm,Rise_Angle_deg,Cam_Angle_deg,Cam_Speed_rpm,Angular_Velocity_rad_s,Displacement_mm,Velocity_mm_s,Acceleration_mm_s2,Peak_Rise_Velocity_mm_s,Peak_Interior_Acceleration_mm_s2',
        'cam csv header'
      );
      assertEqual(
        csvLines[1],
        '"Simple Harmonic Motion (SHM)",20.000,90.00,45.00,60.00,6.283,10.000,125.66,0.00,125.66,1579.14',
        'cam csv row'
      );

      // 3. Preset 2: Cycloidal Quarter-Rise (h=20, beta=90 deg = pi/2 rad, theta=22.5 deg, u=0.25, N=60 rpm -> omega=2*pi)
      //   s = 20 * (0.25 - 1/(2*pi)) = 1.81690 -> 1.817 mm
      //   v = (20 * 2*pi / (pi/2)) * (1 - cos(pi/2)) = 80.00 mm/s
      //   a = (2*pi * 20 * 4*pi^2) / (pi^2 / 4) * sin(pi/2) = 640*pi = 2010.619 -> 2010.62 mm/s^2
      //   v_max = 160.00 mm/s, a_max = 2010.62 mm/s^2
      await p.click('[data-testid="preset-cycloidal-quarter"]');
      assertClose(await readNumberTestId(p, 'out-displacement'), 1.817, 0.001, 'cam cycloidal s');
      assertClose(await readNumberTestId(p, 'out-velocity'), 80.0, 0.001, 'cam cycloidal v');
      assertClose(await readNumberTestId(p, 'out-acceleration'), 2010.62, 0.001, 'cam cycloidal a');
      assertClose(await readNumberTestId(p, 'out-vmax'), 160.0, 0.001, 'cam cycloidal vmax');
      assertClose(await readNumberTestId(p, 'out-amax'), 2010.62, 0.001, 'cam cycloidal amax');

      // 4. Preset 3: Uniform Velocity 120 rpm (h=15, beta=120 deg = 2*pi/3 rad, theta=60 deg, u=0.5, omega=4*pi=12.566 rad/s)
      //   s = 7.500 mm, v = (15 * 4*pi) / (2*pi/3) = 90.00 mm/s, a = 0.00 mm/s^2
      await p.click('[data-testid="preset-uniform-120"]');
      assertClose(await readNumberTestId(p, 'out-displacement'), 7.5, 0.001, 'cam uniform s');
      assertClose(await readNumberTestId(p, 'out-velocity'), 90.0, 0.001, 'cam uniform v');
      assertClose(await readNumberTestId(p, 'out-acceleration'), 0.0, 0.001, 'cam uniform a');
      assertClose(await readNumberTestId(p, 'out-omega'), 12.566, 0.001, 'cam uniform omega');

      // 5. Input Defenses across >= 2 inputs ("", "abc", "12abc", and theta > beta boundary)
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '-5']) {
        await p.fill('[data-testid="input-lift"]', bad);
        assertEqual(await readTextTestId(p, 'out-displacement'), '—', `cam bad lift "${bad}"`);
        await verifyNoNaNOrInfinity(p, `cam bad lift "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '120']) {
        // 120 > rise angle 90 -> out of rise phase
        await p.fill('[data-testid="input-cam-angle"]', bad);
        assertEqual(await readTextTestId(p, 'out-displacement'), '—', `cam bad theta "${bad}"`);
        await verifyNoNaNOrInfinity(p, `cam bad theta "${bad}"`);
      }

      // 6. Reset & Negative Assertions
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-displacement'), 10.0, 0.001, 'cam after reset');
      await verifyNegativeTermsInContainer(
        p,
        ['ISO 6336', 'AGMA 2001', 'ISO 4183', 'RMA IP-20', 'ISO 606', 'ASME B29.1', 'ISO 3408'],
        '49. cam-profile-calculator'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 50: capacitor-reactance-calculator
    // -------------------------------------------------------------------------
    await runSubTest('50. capacitor-reactance-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/capacitor-reactance-calculator`, '[data-testid="input-capacitance"]');

      // 1. Default Hand-Calculation (C = 100 uF = 1e-4 F, f = 50 Hz, R = 1000 ohm)
      //   X_C = 1 / (2 * pi * 50 * 1e-4) = 100 / pi = 31.8309886 -> 31.831 ohm
      //   tau = 1000 * 1e-4 * 1000 = 100.000 ms
      //   f_c = 1 / (2 * pi * 1000 * 1e-4) = 5 / pi = 1.591549 -> 1.592 Hz
      //   |Z| = sqrt(1000^2 + 31.8309886^2) = 1000.5065 -> 1000.506 ohm
      assertClose(await readNumberTestId(p, 'out-xc'), 31.831, 0.001, 'cap default Xc');
      assertClose(await readNumberTestId(p, 'out-tau'), 100.0, 0.001, 'cap default tau');
      assertClose(await readNumberTestId(p, 'out-fc'), 1.592, 0.001, 'cap default fc');
      assertClose(await readNumberTestId(p, 'out-impedance'), 1000.506, 0.001, 'cap default Z');

      // 2. CSV Download Verification on default values
      const [csvDownload] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-csv"]'),
      ]);
      const csvLines = fs.readFileSync(await csvDownload.path(), 'utf-8').trim().split(/\r?\n/);
      assertEqual(
        csvLines[0],
        'Capacitance_Input,Capacitance_Unit,Capacitance_F,Frequency_Input,Frequency_Unit,Frequency_Hz,Resistance_Input,Resistance_Unit,Resistance_ohm,Reactance_Xc_ohm,Time_Constant_ms,Cutoff_Frequency_Hz,Series_Impedance_Z_ohm',
        'cap csv header'
      );
      assertEqual(
        csvLines[1],
        '100,uF,1.000000e-4,50,Hz,50.000,1000,ohm,1000.000,31.831,100.000,1.592,1000.506',
        'cap csv row'
      );

      // 3. Preset 2: 100 nF · 1 kHz · 10 kohm (C = 1e-7 F, f = 1000 Hz, R = 10000 ohm)
      //   X_C = 1 / (2 * pi * 1000 * 1e-7) = 5000 / pi = 1591.549 ohm
      //   tau = 10000 * 1e-7 * 1000 = 1.000 ms
      //   f_c = 1 / (2 * pi * 0.001) = 500 / pi = 159.155 Hz
      //   |Z| = sqrt(10000^2 + 1591.5494^2) = 10125.859 ohm
      await p.click('[data-testid="preset-audio-1khz"]');
      assertClose(await readNumberTestId(p, 'out-xc'), 1591.549, 0.001, 'cap audio Xc');
      assertClose(await readNumberTestId(p, 'out-tau'), 1.0, 0.001, 'cap audio tau');
      assertClose(await readNumberTestId(p, 'out-fc'), 159.155, 0.001, 'cap audio fc');
      assertClose(await readNumberTestId(p, 'out-impedance'), 10125.859, 0.001, 'cap audio Z');

      // 4. Unit Selector Branch: pF + MHz + ohm (C = 100 pF = 1e-10 F, f = 10 MHz = 1e7 Hz, R = 50 ohm)
      //   X_C = 1 / (2 * pi * 1e7 * 1e-10) = 1000 / (2 * pi) = 159.155 ohm
      //   |Z| = sqrt(50^2 + 159.15494^2) = 166.824 ohm
      await p.selectOption('[data-testid="select-cap-unit"]', 'pF');
      await p.fill('[data-testid="input-capacitance"]', '100');
      await p.selectOption('[data-testid="select-freq-unit"]', 'MHz');
      await p.fill('[data-testid="input-frequency"]', '10');
      await p.selectOption('[data-testid="select-res-unit"]', 'ohm');
      await p.fill('[data-testid="input-resistance"]', '50');
      assertClose(await readNumberTestId(p, 'out-xc'), 159.155, 0.001, 'cap pF/MHz Xc');
      assertClose(await readNumberTestId(p, 'out-impedance'), 166.824, 0.001, 'cap pF/MHz Z');

      // 5. Input Defenses across >= 2 inputs ("", "abc", "12abc", "0")
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-capacitance"]', bad);
        assertEqual(await readTextTestId(p, 'out-xc'), '—', `cap bad C "${bad}"`);
        await verifyNoNaNOrInfinity(p, `cap bad C "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '-50']) {
        await p.fill('[data-testid="input-frequency"]', bad);
        assertEqual(await readTextTestId(p, 'out-xc'), '—', `cap bad f "${bad}"`);
        await verifyNoNaNOrInfinity(p, `cap bad f "${bad}"`);
      }

      // 6. Reset & Negative Assertions
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-xc'), 31.831, 0.001, 'cap after reset');
      await verifyNegativeTermsInContainer(
        p,
        ['NFPA 70', 'IEC 60364', 'IEC 60909', 'IEEE Std 1584', 'IPC-2221', 'IPC-2152'],
        '50. capacitor-reactance-calculator'
      );
    });
  } finally {
    await browser.close();
  }

  console.log('================================================================');
  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.error(`Batch 10 E2E FAILED (${failed.length}/${results.length} failed)`);
    process.exit(1);
  }
  console.log(`ALL ${results.length} BATCH 10 TOOLS PASSED MASTER E2E VERIFICATION.`);
}

runBatch10Tests().catch((err) => {
  console.error('Fatal error in Batch 10 E2E runner:', err);
  process.exit(1);
});
