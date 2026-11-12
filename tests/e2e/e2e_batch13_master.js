/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 13 (Tools 61 to 65)
 *
 * Validates:
 * 61. cloud-dwg-to-step-iges-converter (Honest browser limitation disclosure, official AutoCAD IMPORT vs EXPORT/IGESEXPORT/ACISOUT & INSUNITS 0..21 mapping, pure-ASCII .scr download, input defenses, negative assertions)
 * 62. cloud-dxf-to-gcode-laser-converter (Client-side ASCII DXF parser for LINE/CIRCLE/ARC/LWPOLYLINE, LinuxCNC & GRBL v1.1 G0/G1/G2/G3/M3/M4/M5/M2/G20/G21/G90/G17/G94, mandatory CAM & dry-run warning, unsupported entity & binary DXF handling, pure-ASCII .nc download, negative assertions)
 * 63. clutch-torque-calculator (T = mu*F*(R_m/1000)*n, Uniform Wear R_m=(R_o+R_i)/2 vs Uniform Pressure R_m=2/3*(R_o^3-R_i^3)/(R_o^2-R_i^2), editable mu with manufacturer datasheet note, presets, input defenses, CSV export, negative assertions)
 * 64. cnc-cycle-time-calculator (t = L/F [mm / (mm/min) = min], independent editable rapid distance/speed, tool changes/change time, and auxiliary time, presets, input defenses, CSV export, negative assertions)
 * 65. cnc-feed-rate-calculator (n = 1000*V_c/(pi*D), F = f_z*z*n, MRR = a_p*a_e*F/1000, full m/min -> mm/min unit derivation, cutting tool manufacturer advisory, presets, input defenses, CSV export, negative assertions)
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

function assertPureAscii(text, context = '') {
  if (!/^[\x00-\x7F]*$/.test(text)) {
    throw new Error(`[${context}] Downloaded script/file contains non-ASCII characters!`);
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

async function verifyNegativeTermsOnToolPage(page, forbiddenTerms, context) {
  const scopedText = await page.evaluate(() => {
    const inputsEl = document.querySelector('[data-testid="calculator-inputs"]');
    const resultsEl = document.querySelector('[data-testid="calculator-results"]');
    const guideEl = document.querySelector('#engineering-guide');
    const chunks = [];
    for (const root of [inputsEl, resultsEl, guideEl]) {
      if (!root) continue;
      const clone = root.cloneNode(true);
      clone
        .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
        .forEach((el) => el.remove());
      chunks.push(clone.textContent || '');
    }
    return chunks.join('\n');
  });
  for (const term of forbiddenTerms) {
    if (scopedText.includes(term)) {
      throw new Error(`[${context}] Found forbidden term "${term}" inside tool container!`);
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

async function downloadAndReadText(page, buttonSelector) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator(buttonSelector).click(),
  ]);
  const filePath = await download.path();
  const content = fs.readFileSync(filePath, 'utf-8');
  return { suggestedFilename: download.suggestedFilename(), content };
}

async function runBatch13Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 13 (Tools 61 to 65)');
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
    // Tool 61: cloud-dwg-to-step-iges-converter
    // -------------------------------------------------------------------------
    await runSubTest('61. cloud-dwg-to-step-iges-converter', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cloud-dwg-to-step-iges-converter`,
        '[data-testid="input-insunits-code"]'
      );

      // Honest browser disclosure & official AutoCAD STEP/IGES capability check
      const disclosure = await readTextTestId(p, 'honest-conversion-disclosure');
      if (
        !disclosure.includes('No Online DWG-to-STEP Conversion Performed Here') ||
        !disclosure.includes('STEP (*.ste; *.stp; *.step)') ||
        !disclosure.includes('not listed') ||
        !disclosure.includes('IGESEXPORT') ||
        !disclosure.includes('ACISOUT')
      ) {
        throw new Error('DWG-to-STEP/IGES page missing honest browser disclosure or AutoCAD IMPORT/EXPORT scope');
      }

      // Default Preset 1 (route = igesexport, INSUNITS = 4 Millimeters, solids = 12)
      assertEqual(await readTextTestId(p, 'result-export-route'), 'IGESEXPORT (*.igs, *.iges)', 'Tool 61 default route');
      assertEqual(await readTextTestId(p, 'result-insunits-summary'), '4 (Millimeters)', 'Tool 61 default INSUNITS');
      assertEqual(await readTextTestId(p, 'result-solid-count'), '12', 'Tool 61 default solid count');
      assertEqual(
        await readTextTestId(p, 'result-step-note'),
        'AutoCAD IMPORT reads STEP (*.ste; *.stp; *.step); STEP is not in AutoCAD EXPORT',
        'Tool 61 STEP note'
      );

      // Download pure-ASCII .SCR for IGESEXPORT
      const scr1 = await downloadAndReadText(p, '[data-testid="download-scr-button"]');
      assertEqual(scr1.suggestedFilename, 'autocad-3d-export-preflight.scr', 'Tool 61 .scr filename');
      assertPureAscii(scr1.content, 'Tool 61 .scr pure ASCII');
      if (
        !scr1.content.includes('INSUNITS 4') ||
        !scr1.content.includes('AUDIT Y') ||
        !scr1.content.includes('-PURGE A * N') ||
        !scr1.content.includes('IGESEXPORT')
      ) {
        throw new Error('Tool 61 IGESEXPORT .scr missing expected commands');
      }

      // Preset 2: ACISOUT (.sat) -> Desktop MCAD STEP
      await p.click('[data-testid="preset-metric-acis-step"]');
      assertEqual(
        await readTextTestId(p, 'result-export-route'),
        'ACISOUT (*.sat) -> Desktop MCAD STEP',
        'Tool 61 ACISOUT route'
      );
      assertEqual(await readTextTestId(p, 'result-solid-count'), '8', 'Tool 61 Preset 2 solids');
      const scr2 = await downloadAndReadText(p, '[data-testid="download-scr-button"]');
      assertPureAscii(scr2.content, 'Tool 61 ACISOUT .scr pure ASCII');
      if (!scr2.content.includes('ACISOUT')) {
        throw new Error('Tool 61 ACISOUT .scr missing ACISOUT command');
      }

      // Preset 3: Imperial Inches (INSUNITS = 1, solids = 24)
      await p.click('[data-testid="preset-imperial-igesexport"]');
      assertEqual(await readTextTestId(p, 'result-insunits-summary'), '1 (Inches)', 'Tool 61 Preset 3 Inches');
      assertEqual(await readTextTestId(p, 'result-solid-count'), '24', 'Tool 61 Preset 3 solids');

      // Input defenses on >= 2 inputs ('', 'abc', '12abc', out-of-range 99)
      for (const bad of ['', 'abc', '12abc', '99']) {
        await p.fill('[data-testid="input-insunits-code"]', bad);
        assertEqual(await readTextTestId(p, 'result-export-route'), '—', `Tool 61 insunits="${bad}" dash`);
        assertEqual(await readTextTestId(p, 'result-insunits-summary'), '—', `Tool 61 summary="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 61 insunits="${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0', '-5']) {
        await p.fill('[data-testid="input-solid-count"]', bad);
        assertEqual(await readTextTestId(p, 'result-solid-count'), '—', `Tool 61 solids="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 61 solids="${bad}"`);
      }

      await p.click('[data-testid="reset-button"]');
      assertEqual(await readTextTestId(p, 'result-solid-count'), '12', 'Tool 61 reset solid count');

      // Negative assertions (no self-assigned ratings, no utm_source, no unrelated BIM/AM standards, no removed vendor directory)
      await verifyNegativeTermsOnToolPage(
        p,
        [
          '9.8',
          '9.6',
          '9.2',
          'utm_source',
          'CAD Exchanger',
          'GrabCAD',
          'ISO/ASTM 52900',
          'AIA CAD Layer Guidelines',
          'ISO 19650',
        ],
        'Tool 61 negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 62: cloud-dxf-to-gcode-laser-converter
    // -------------------------------------------------------------------------
    await runSubTest('62. cloud-dxf-to-gcode-laser-converter', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cloud-dxf-to-gcode-laser-converter`,
        '[data-testid="input-feed-rate"]'
      );

      // Mandatory CAM verification & dry-run warning + honest scope check
      const safetyWarning = await readTextTestId(p, 'cam-safety-warning');
      if (
        !safetyWarning.includes('dedicated CAM software') ||
        !safetyWarning.includes('dry run') ||
        !safetyWarning.includes('G41') ||
        !safetyWarning.includes('SPLINE')
      ) {
        throw new Error('DXF-to-GCode page missing CAM/dry-run warning or unsupported feature disclosure');
      }

      // Default Preset 1 hand-calculation:
      // 4 LINEs forming 100x60 mm rectangle: perimeter = 2*(100 + 60) = 320.000 mm
      // 1 CIRCLE radius R = 10 mm: circumference = 2 * pi * 10 = 62.831853 mm
      // Total cut length L_cut = 320 + 62.831853 = 382.831853 -> 382.83 mm
      // Pure cutting time t_cut = (382.831853 mm / 1200 mm/min) * 60 s/min = 19.141593 -> 19.14 s
      assertEqual(await readTextTestId(p, 'result-entity-count'), '5', 'Tool 62 default entity count');
      assertClose(await readNumberTestId(p, 'result-cut-length'), 382.83, 0.001, 'Tool 62 default cut length');
      assertClose(await readNumberTestId(p, 'result-cut-time'), 19.14, 0.001, 'Tool 62 default cut time');

      // Download pure-ASCII .nc G-code
      const nc1 = await downloadAndReadText(p, '[data-testid="download-gcode-button"]');
      assertEqual(nc1.suggestedFilename, 'dxf-laser-contour.nc', 'Tool 62 .nc filename');
      assertPureAscii(nc1.content, 'Tool 62 .nc pure ASCII');
      for (const token of ['G21', 'G90', 'G17', 'G94', 'M5', 'G0 X60.000 Y30.000', 'M3 S1000', 'G2 X40.000 Y30.000 I-10.000 J0.000 F1200', 'G1 X100.000 Y0.000 F1200', 'M2']) {
        if (!nc1.content.includes(token)) {
          throw new Error(`Tool 62 Preset 1 .nc missing expected token "${token}"`);
        }
      }

      // Preset 2 hand-calculation (4 LINEs: 80 + 50 + 65 + 65 = 260 mm; 1 CCW ARC R=15 from 0 to 90 deg: 15*pi/2 = 23.561945 mm):
      // L_cut = 283.561945 -> 283.56 mm; F = 1500 mm/min -> t_cut = 283.561945 / 1500 * 60 = 11.342478 -> 11.34 s; M4 S800 + G3
      await p.click('[data-testid="preset-fillet-bracket-arc"]');
      assertEqual(await readTextTestId(p, 'result-entity-count'), '5', 'Tool 62 Preset 2 entity count');
      assertClose(await readNumberTestId(p, 'result-cut-length'), 283.56, 0.001, 'Tool 62 Preset 2 cut length');
      assertClose(await readNumberTestId(p, 'result-cut-time'), 11.34, 0.001, 'Tool 62 Preset 2 cut time');
      const preview2 = await readTextTestId(p, 'preview-gcode');
      if (!preview2.includes('M4 S800') || !preview2.includes('G3 X65.000 Y65.000 I-15.000 J0.000 F1500')) {
        throw new Error('Tool 62 Preset 2 preview missing M4 S800 or G3 CCW arc command');
      }

      // Preset 3 hand-calculation (1 closed 60x40 LWPOLYLINE: L_cut = 200.00 mm; F = 1000 -> t_cut = 12.00 s) + G20 branch
      await p.click('[data-testid="preset-closed-lwpolyline"]');
      assertEqual(await readTextTestId(p, 'result-entity-count'), '1', 'Tool 62 Preset 3 entity count');
      assertClose(await readNumberTestId(p, 'result-cut-length'), 200.0, 0.001, 'Tool 62 Preset 3 cut length');
      assertClose(await readNumberTestId(p, 'result-cut-time'), 12.0, 0.001, 'Tool 62 Preset 3 cut time');
      await p.selectOption('[data-testid="select-units"]', 'G20');
      const previewG20 = await readTextTestId(p, 'preview-gcode');
      if (!previewG20.includes('G20 ; Inches')) {
        throw new Error('Tool 62 G20 unit selection did not update G-code preamble');
      }

      // Unsupported SPLINE warning & Binary DXF rejection check
      await p.fill(
        '[data-testid="input-dxf-text"]',
        ['0', 'SECTION', '2', 'ENTITIES', '0', 'SPLINE', '8', '0', '0', 'LINE', '10', '0', '20', '0', '11', '10', '21', '0', '0', 'ENDSEC', '0', 'EOF'].join('\n')
      );
      const unsupWarn = await readTextTestId(p, 'unsupported-entities-warning');
      if (!unsupWarn.includes('SPLINE')) {
        throw new Error('Tool 62 did not warn on skipped SPLINE entity');
      }
      await p.fill('[data-testid="input-dxf-text"]', 'AutoCAD Binary DXF\r\n');
      assertEqual(await readTextTestId(p, 'result-entity-count'), '—', 'Tool 62 binary DXF dash');

      // Input defenses on feed rate & laser power
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0', '-10']) {
        await p.fill('[data-testid="input-feed-rate"]', bad);
        assertEqual(await readTextTestId(p, 'result-cut-length'), '—', `Tool 62 feed="${bad}" dash`);
        assertEqual(await readTextTestId(p, 'result-cut-time'), '—', `Tool 62 feed="${bad}" time dash`);
        await verifyNoNaNOrInfinity(p, `Tool 62 feed="${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '-1']) {
        await p.fill('[data-testid="input-laser-power"]', bad);
        assertEqual(await readTextTestId(p, 'result-cut-length'), '—', `Tool 62 power="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 62 power="${bad}"`);
      }

      await p.click('[data-testid="reset-button"]');
      assertClose(await readNumberTestId(p, 'result-cut-length'), 382.83, 0.001, 'Tool 62 reset cut length');

      // Negative assertions (no self-assigned scores, no utm_source, no removed directory tools, no unrelated GD&T/bending standards)
      await verifyNegativeTermsOnToolPage(
        p,
        [
          '9.9',
          '9.3',
          '9.5',
          'utm_source',
          'NC Viewer',
          'Carbide Create',
          'jscut',
          'ISO 286-1',
          'DIN 6935',
          'ISO 2768',
        ],
        'Tool 62 negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 63: clutch-torque-calculator
    // -------------------------------------------------------------------------
    await runSubTest('63. clutch-torque-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/clutch-torque-calculator`,
        '[data-testid="input-axial-force"]'
      );

      // Manufacturer datasheet note check
      const muNote = await readTextTestId(p, 'mu-typical-note');
      if (!muNote.includes('manufacturer')) {
        throw new Error('Clutch calculator missing friction lining manufacturer datasheet advisory');
      }

      // Default Preset 1 hand-calculation (Uniform Wear: F=2000 N, mu=0.25, R_o=60 mm, R_i=40 mm, n=2):
      // R_m = (60 + 40) / 2 = 50.000 mm
      // T = 0.25 * 2000 N * (50.000 / 1000 m) * 2 = 50.000 N*m
      // p_max = 2000 / (2 * pi * 40 * (60 - 40)) = 2000 / (1600 * pi) = 0.397887 -> 0.398 MPa
      assertClose(await readNumberTestId(p, 'result-mean-radius'), 50.0, 0.001, 'Tool 63 default UW R_m');
      assertClose(await readNumberTestId(p, 'result-torque'), 50.0, 0.001, 'Tool 63 default UW torque');
      assertClose(await readNumberTestId(p, 'result-lining-pressure'), 0.398, 0.002, 'Tool 63 default UW p_max');

      // Switch to Uniform Pressure assumption on same inputs:
      // R_m = (2/3) * (60^3 - 40^3) / (60^2 - 40^2) = (2/3) * 152000 / 2000 = 50.666667 -> 50.667 mm
      // T = 0.25 * 2000 * (50.666667 / 1000) * 2 = 50.666667 -> 50.667 N*m
      // p_avg = 2000 / (pi * (60^2 - 40^2)) = 2000 / (2000 * pi) = 0.318310 -> 0.318 MPa
      await p.selectOption('[data-testid="select-theory"]', 'uniform-pressure');
      assertClose(await readNumberTestId(p, 'result-mean-radius'), 50.667, 0.001, 'Tool 63 UP R_m');
      assertClose(await readNumberTestId(p, 'result-torque'), 50.667, 0.001, 'Tool 63 UP torque');
      assertClose(await readNumberTestId(p, 'result-lining-pressure'), 0.318, 0.002, 'Tool 63 UP p_avg');

      // Preset 2: Automotive Single-Plate Dry (Uniform Wear: F=4500, mu=0.35, R_o=115, R_i=75, n=2)
      // R_m = 95.000 mm; T = 0.35 * 4500 * 0.095 * 2 = 299.250 N*m; p_max = 4500 / (2*pi*75*40) = 0.238732 -> 0.239 MPa
      await p.click('[data-testid="preset-automotive-single-plate"]');
      assertClose(await readNumberTestId(p, 'result-mean-radius'), 95.0, 0.001, 'Tool 63 Preset 2 R_m');
      assertClose(await readNumberTestId(p, 'result-torque'), 299.25, 0.001, 'Tool 63 Preset 2 torque');
      assertClose(await readNumberTestId(p, 'result-lining-pressure'), 0.239, 0.003, 'Tool 63 Preset 2 p_max');

      // Preset 3: Wet Multi-Plate Oil (Uniform Wear: F=3000, mu=0.08, R_o=80, R_i=50, n=6)
      // R_m = 65.000 mm; T = 0.08 * 3000 * 0.065 * 6 = 93.600 N*m; p_max = 3000 / (2*pi*50*30) = 0.318310 -> 0.318 MPa
      await p.click('[data-testid="preset-wet-multi-plate"]');
      assertClose(await readNumberTestId(p, 'result-mean-radius'), 65.0, 0.001, 'Tool 63 Preset 3 R_m');
      assertClose(await readNumberTestId(p, 'result-torque'), 93.6, 0.001, 'Tool 63 Preset 3 torque');
      assertClose(await readNumberTestId(p, 'result-lining-pressure'), 0.318, 0.002, 'Tool 63 Preset 3 p_max');

      // Reset to defaults & test CSV export
      await p.click('[data-testid="reset-button"]');
      const csv = await downloadAndReadText(p, '[data-testid="export-csv-button"]');
      assertEqual(csv.suggestedFilename, 'clutch-torque-calculation.csv', 'Tool 63 CSV filename');
      assertPureAscii(csv.content, 'Tool 63 CSV pure ASCII');
      if (!csv.content.includes('50.000') || !csv.content.includes('0.398') || !csv.content.includes('Uniform Wear')) {
        throw new Error('Tool 63 CSV missing expected default values');
      }

      // Input defenses on >= 2 inputs ('', 'abc', '12abc', R_i >= R_o)
      for (const bad of ['', 'abc', '12abc', '0', '-50']) {
        await p.fill('[data-testid="input-axial-force"]', bad);
        assertEqual(await readTextTestId(p, 'result-torque'), '—', `Tool 63 force="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 63 force="${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0', '65']) {
        await p.fill('[data-testid="input-inner-radius"]', bad);
        assertEqual(await readTextTestId(p, 'result-torque'), '—', `Tool 63 R_i="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 63 R_i="${bad}"`);
      }

      await p.click('[data-testid="reset-button"]');
      // Negative assertions (no unrelated shaft/keyway/rotor balance standards)
      await verifyNegativeTermsOnToolPage(
        p,
        ['ASME B106.1M', 'DIN 6885', 'ISO 773', 'ISO 1940-1'],
        'Tool 63 negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 64: cnc-cycle-time-calculator
    // -------------------------------------------------------------------------
    await runSubTest('64. cnc-cycle-time-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cnc-cycle-time-calculator`,
        '[data-testid="input-cut-length"]'
      );

      // Default Preset 1 hand-calculation:
      // L_cut = 5000 mm, F_cut = 800 mm/min -> t_cut = 5000/800 = 6.25 min = 375.00 s
      // L_rapid = 500 mm, F_rapid = 10000 mm/min -> t_rapid = 500/10000 = 0.05 min = 3.00 s
      // N_tc = 3, t_tc = 5 s, t_aux = 0 s -> t_noncut = 3*5 + 0 = 15.00 s
      // Total = 375 + 3 + 15 = 393.00 s = 6.550 min; Output = 3600 / 393 = 9.160305 -> 9.16 parts/hr
      assertClose(await readNumberTestId(p, 'result-cutting-sec'), 375.0, 0.001, 'Tool 64 default cut sec');
      assertClose(await readNumberTestId(p, 'result-rapid-sec'), 3.0, 0.001, 'Tool 64 default rapid sec');
      assertClose(await readNumberTestId(p, 'result-noncut-sec'), 15.0, 0.001, 'Tool 64 default noncut sec');
      assertClose(await readNumberTestId(p, 'result-total-sec'), 393.0, 0.001, 'Tool 64 default total sec');
      assertClose(await readNumberTestId(p, 'result-total-min'), 6.55, 0.001, 'Tool 64 default total min');
      assertClose(await readNumberTestId(p, 'result-parts-per-hour'), 9.16, 0.001, 'Tool 64 default parts/hr');

      // CSV export on default values
      const csv = await downloadAndReadText(p, '[data-testid="export-csv-button"]');
      assertEqual(csv.suggestedFilename, 'cnc-cycle-time-calculation.csv', 'Tool 64 CSV filename');
      assertPureAscii(csv.content, 'Tool 64 CSV pure ASCII');
      if (!csv.content.includes('375.00') || !csv.content.includes('6.550') || !csv.content.includes('9.16')) {
        throw new Error('Tool 64 CSV missing expected default values');
      }

      // Preset 2 hand-calculation (18000/3600*60=300.00 s; 1200/24000*60=3.00 s; 2*3+10=16.00 s; total=319.00 s=5.317 min; 3600/319=11.29 parts/hr)
      await p.click('[data-testid="preset-hsm-aluminum-finishing"]');
      assertClose(await readNumberTestId(p, 'result-cutting-sec'), 300.0, 0.001, 'Tool 64 Preset 2 cut sec');
      assertClose(await readNumberTestId(p, 'result-rapid-sec'), 3.0, 0.001, 'Tool 64 Preset 2 rapid sec');
      assertClose(await readNumberTestId(p, 'result-noncut-sec'), 16.0, 0.001, 'Tool 64 Preset 2 noncut sec');
      assertClose(await readNumberTestId(p, 'result-total-min'), 5.317, 0.001, 'Tool 64 Preset 2 total min');
      assertClose(await readNumberTestId(p, 'result-parts-per-hour'), 11.29, 0.001, 'Tool 64 Preset 2 parts/hr');

      // Preset 3 hand-calculation (2400/600*60=240.00 s; rapid=0; noncut=0; total=4.000 min; 15.00 parts/hr)
      await p.click('[data-testid="preset-single-tool-contour"]');
      assertClose(await readNumberTestId(p, 'result-total-min'), 4.0, 0.001, 'Tool 64 Preset 3 total min');
      assertClose(await readNumberTestId(p, 'result-parts-per-hour'), 15.0, 0.001, 'Tool 64 Preset 3 parts/hr');

      // Input defenses on >= 2 inputs
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '-10']) {
        await p.fill('[data-testid="input-cut-length"]', bad);
        assertEqual(await readTextTestId(p, 'result-total-min'), '—', `Tool 64 cutLen="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 64 cutLen="${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0', '-200']) {
        await p.fill('[data-testid="input-cut-feed"]', bad);
        assertEqual(await readTextTestId(p, 'result-total-min'), '—', `Tool 64 cutFeed="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 64 cutFeed="${bad}"`);
      }

      await p.click('[data-testid="reset-button"]');
      await verifyNegativeTermsOnToolPage(
        p,
        ['ISO 286-1', 'ASME B4.1', 'DIN 6935', 'ISO 2768'],
        'Tool 64 negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 65: cnc-feed-rate-calculator
    // -------------------------------------------------------------------------
    await runSubTest('65. cnc-feed-rate-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cnc-feed-rate-calculator`,
        '[data-testid="input-cutting-speed"]'
      );

      // Cutting tool manufacturer advisory & step-by-step m/min -> mm/min derivation check
      const advisory = await readTextTestId(p, 'manufacturer-advisory');
      if (!advisory.includes('cutting tool manufacturer')) {
        throw new Error('CNC feed rate calculator missing cutting tool manufacturer advisory');
      }
      const deriv = await readTextTestId(p, 'unit-derivation-box');
      if (!deriv.includes('1 m = 1000 mm') || !deriv.includes('1000 · V_c')) {
        throw new Error('CNC feed rate calculator missing m/min -> mm/min unit derivation');
      }

      // Default Preset 1 hand-calculation (Aluminum 6061-T6: V_c = 300 m/min, f_z = 0.12 mm/tooth, D = 6 mm, z = 2, a_p = 3 mm, a_e = 6 mm):
      // n = (1000 * 300) / (pi * 6) = 300000 / 18.8495559 = 15915.4943 -> 15915.5 RPM
      // F = 0.12 * 2 * 15915.4943 = 3819.7186 -> 3819.7 mm/min
      // MRR = (3 * 6 * 3819.7186) / 1000 = 68.7549 -> 68.75 cm^3/min
      assertClose(await readNumberTestId(p, 'result-rpm'), 15915.5, 0.001, 'Tool 65 default RPM');
      assertClose(await readNumberTestId(p, 'result-feed-rate'), 3819.7, 0.001, 'Tool 65 default feed rate');
      assertClose(await readNumberTestId(p, 'result-chip-load'), 0.12, 0.001, 'Tool 65 default chip load');
      assertClose(await readNumberTestId(p, 'result-mrr'), 68.75, 0.001, 'Tool 65 default MRR');

      // CSV export check
      const csv = await downloadAndReadText(p, '[data-testid="export-csv-button"]');
      assertEqual(csv.suggestedFilename, 'cnc-feed-rate-calculation.csv', 'Tool 65 CSV filename');
      assertPureAscii(csv.content, 'Tool 65 CSV pure ASCII');
      if (!csv.content.includes('15915.5') || !csv.content.includes('3819.7') || !csv.content.includes('68.75')) {
        throw new Error('Tool 65 CSV missing expected default values');
      }

      // Preset 2: Carbon Steel AISI 1045 (V_c=90, f_z=0.06, D=10, z=4, a_p=5, a_e=2)
      // n = 90000 / (10*pi) = 2864.8 RPM; F = 0.24 * 2864.789 = 687.5 mm/min; MRR = 10 * 687.549 / 1000 = 6.88 cm^3/min
      await p.click('[data-testid="preset-carbon-steel-1045"]');
      assertClose(await readNumberTestId(p, 'result-rpm'), 2864.8, 0.001, 'Tool 65 Preset 2 RPM');
      assertClose(await readNumberTestId(p, 'result-feed-rate'), 687.5, 0.001, 'Tool 65 Preset 2 feed');
      assertClose(await readNumberTestId(p, 'result-mrr'), 6.88, 0.002, 'Tool 65 Preset 2 MRR');

      // Preset 3: Stainless 304 (V_c=50, f_z=0.04, D=8, z=4, a_p=4, a_e=1.6)
      // n = 50000 / (8*pi) = 1989.4 RPM; F = 0.16 * 1989.437 = 318.3 mm/min; MRR = 6.4 * 318.310 / 1000 = 2.04 cm^3/min
      await p.click('[data-testid="preset-stainless-304"]');
      assertClose(await readNumberTestId(p, 'result-rpm'), 1989.4, 0.001, 'Tool 65 Preset 3 RPM');
      assertClose(await readNumberTestId(p, 'result-feed-rate'), 318.3, 0.001, 'Tool 65 Preset 3 feed');
      assertClose(await readNumberTestId(p, 'result-mrr'), 2.04, 0.003, 'Tool 65 Preset 3 MRR');

      // Preset 4: Titanium Ti-6Al-4V (V_c=40, f_z=0.05, D=12, z=4, a_p=6, a_e=1.2)
      // n = 40000 / (12*pi) = 1061.0 RPM; F = 0.20 * 1061.033 = 212.2 mm/min; MRR = 7.2 * 212.207 / 1000 = 1.53 cm^3/min
      await p.click('[data-testid="preset-titanium-ti6al4v"]');
      assertClose(await readNumberTestId(p, 'result-rpm'), 1061.0, 0.001, 'Tool 65 Preset 4 RPM');
      assertClose(await readNumberTestId(p, 'result-feed-rate'), 212.2, 0.001, 'Tool 65 Preset 4 feed');
      assertClose(await readNumberTestId(p, 'result-mrr'), 1.53, 0.003, 'Tool 65 Preset 4 MRR');

      // Input defenses on >= 2 inputs ('', 'abc', '12abc', a_e > D)
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0', '-25']) {
        await p.fill('[data-testid="input-cutting-speed"]', bad);
        assertEqual(await readTextTestId(p, 'result-rpm'), '—', `Tool 65 Vc="${bad}" dash`);
        assertEqual(await readTextTestId(p, 'result-feed-rate'), '—', `Tool 65 Vc="${bad}" feed dash`);
        await verifyNoNaNOrInfinity(p, `Tool 65 Vc="${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0', '9.5']) {
        await p.fill('[data-testid="input-radial-woc"]', bad);
        assertEqual(await readTextTestId(p, 'result-rpm'), '—', `Tool 65 ae="${bad}" dash`);
        await verifyNoNaNOrInfinity(p, `Tool 65 ae="${bad}"`);
      }

      await p.click('[data-testid="reset-button"]');
      await verifyNegativeTermsOnToolPage(
        p,
        ['ISO 286-1', 'ASME B4.1', 'DIN 6935', 'ISO 2768', 'Est. Power'],
        'Tool 65 negative assertions'
      );
    });
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Batch 13 Summary: PASS=${passed}, FAIL=${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runBatch13Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
