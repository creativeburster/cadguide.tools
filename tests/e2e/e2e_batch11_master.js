/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 11 (Tools 51 to 55)
 *
 * Validates:
 * 51. casting-shrinkage-calculator (Patternmaker shrink-rule S & L_pattern, 3D CAD uniform scale factor, inverse contraction size, alloy presets, input defenses, CSV export, negative assertions)
 * 52. ceiling-grid-calculator (Modular 600x600 & 600x1200 metric ceiling tile count, floating-point safe ceil, editable main tee spacing/bar lengths, input defenses, CSV export, negative assertions)
 * 53. centrifugal-force-calculator (Uniform circular motion omega, tangential speed v, F_c = m*r*omega^2, RCF in g, kg/g & m/mm unit conversions, input defenses, CSV export, negative assertions)
 * 54. chain-drive-length-calculator (ISO 606 / ASME B29.1 pitches, exact theoretical length, even pitch rounding, linear length, adjusted center distance C_actual, sprocket overlap guard, CSV export, negative assertions)
 * 55. channel-flow-manning-calculator (SI Manning open-channel uniform flow for rectangular & trapezoidal sections with side slope z, surface presets, input defenses, CSV export, negative assertions)
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

async function verifyNegativeTermsOnToolPage(page, forbiddenTerms, context) {
  const scopedText = await page.evaluate(() => {
    const mains = Array.from(document.querySelectorAll('main'));
    const root = mains[mains.length - 1] || document.body;
    const clone = root.cloneNode(true);
    clone
      .querySelectorAll(
        '[data-testid="toolbox-preset-bar"], a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]'
      )
      .forEach((el) => el.remove());
    return clone.textContent || '';
  });
  for (const term of forbiddenTerms) {
    if (scopedText.includes(term)) {
      throw new Error(`[${context}] Found forbidden unrelated standard/term "${term}" in tool container!`);
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

async function runBatch11Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 11 (Tools 51 to 55)');
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
    // Tool 51: casting-shrinkage-calculator
    // -------------------------------------------------------------------------
    await runSubTest('51. casting-shrinkage-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/casting-shrinkage-calculator`,
        '[data-testid="input-dimension"]'
      );

      // 1. Default Hand-Calculation (L = 200 mm, Gray Cast Iron s = 1.0%)
      //   S         = 200 * (1.0 / 100)       = 2.000 mm
      //   L_pattern = 200 * (1 + 0.01)        = 202.000 mm
      //   k_scale   = 1 + 0.01                = 1.0100
      //   L_inverse = 200 / (1 - 0.01)        = 202.0202... -> 202.020 mm
      assertClose(await readNumberTestId(p, 'out-shrinkage-allowance'), 2.0, 0.001, 'casting default S');
      assertClose(await readNumberTestId(p, 'out-pattern-size'), 202.0, 0.001, 'casting default L_pat');
      assertClose(await readNumberTestId(p, 'out-scale-factor'), 1.01, 0.001, 'casting default k_scale');
      assertClose(await readNumberTestId(p, 'out-inverse-size'), 202.02, 0.001, 'casting default L_inv');

      // 2. CSV Export verification (exact headers and numeric rows)
      const [csvDl] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvText = fs.readFileSync(await csvDl.path(), 'utf-8');
      const expectedRows = [
        '"Parameter","Value","Unit","Notes"',
        '"Target Cooled Casting Dimension (L)","200.000","mm","Room-temperature casting target"',
        '"Linear Shrinkage Allowance (S)","2.000","mm","S = L * (s / 100)"',
        '"Pattern / Cavity Size (Shrink Rule)","202.000","mm","L_pattern = L * (1 + s / 100)"',
        '"3D CAD Uniform Scale Factor","1.0100","-","k_scale = 1 + s / 100"',
        '"Pattern Size (Inverse Contraction)","202.020","mm","L_inverse = L / (1 - s / 100)"',
      ];
      for (const row of expectedRows) {
        if (!csvText.includes(row)) {
          throw new Error(`Missing expected CSV row in casting-shrinkage-allowance.csv: ${row}`);
        }
      }

      // 3. Presets & Alloy dropdown verification
      //   Preset Carbon Steel: L = 500 mm, s = 2.0% -> S = 10.000, L_pat = 510.000, k = 1.0200, L_inv = 500/0.98 = 510.204
      await p.click('[data-testid="preset-carbon-steel"]');
      assertClose(await readNumberTestId(p, 'out-shrinkage-allowance'), 10.0, 0.001, 'casting steel S');
      assertClose(await readNumberTestId(p, 'out-pattern-size'), 510.0, 0.001, 'casting steel L_pat');
      assertClose(await readNumberTestId(p, 'out-scale-factor'), 1.02, 0.001, 'casting steel k_scale');
      assertClose(await readNumberTestId(p, 'out-inverse-size'), 510.204, 0.001, 'casting steel L_inv');

      //   Preset Aluminum: L = 150 mm, s = 1.3% -> S = 1.950, L_pat = 151.950, k = 1.0130, L_inv = 150/0.987 = 151.976
      await p.click('[data-testid="preset-aluminum"]');
      assertClose(await readNumberTestId(p, 'out-shrinkage-allowance'), 1.95, 0.001, 'casting aluminum S');
      assertClose(await readNumberTestId(p, 'out-pattern-size'), 151.95, 0.001, 'casting aluminum L_pat');
      assertClose(await readNumberTestId(p, 'out-scale-factor'), 1.013, 0.001, 'casting aluminum k');
      assertClose(await readNumberTestId(p, 'out-inverse-size'), 151.976, 0.001, 'casting aluminum L_inv');

      //   Dropdown Ductile Iron (0.8%) on L = 150 mm -> S = 1.200, L_pat = 151.200
      await p.selectOption('[data-testid="select-material"]', 'ductile_iron');
      assertClose(await readNumberTestId(p, 'out-shrinkage-allowance'), 1.2, 0.001, 'casting ductile S');
      assertClose(await readNumberTestId(p, 'out-pattern-size'), 151.2, 0.001, 'casting ductile L_pat');

      // 4. Input Defenses across >= 2 inputs ("", "abc", "12abc", boundary <= 0 or >= 50)
      for (const bad of ['', 'abc', '12abc', '0', '-50']) {
        await p.fill('[data-testid="input-dimension"]', bad);
        assertEqual(await readTextTestId(p, 'out-pattern-size'), '—', `casting bad L "${bad}"`);
        await verifyNoNaNOrInfinity(p, `casting bad L "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0', '55']) {
        await p.fill('[data-testid="input-shrinkage-rate"]', bad);
        assertEqual(await readTextTestId(p, 'out-pattern-size'), '—', `casting bad s "${bad}"`);
        await verifyNoNaNOrInfinity(p, `casting bad s "${bad}"`);
      }

      // 5. Reset & Negative Assertions (removed unrelated standards)
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-pattern-size'), 202.0, 0.001, 'casting after reset');
      await verifyNegativeTermsOnToolPage(
        p,
        ['ISO 286-1', 'ASME B4.1', 'ASME Y14.5', 'ISO 1101', 'DIN 6935', 'ISO 2768', 'G41/G42'],
        '51. casting-shrinkage-calculator'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 52: ceiling-grid-calculator
    // -------------------------------------------------------------------------
    await runSubTest('52. ceiling-grid-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/ceiling-grid-calculator`,
        '[data-testid="input-room-length"]'
      );

      // 1. Default Hand-Calculation (L = 12 m, W = 8 m, 600x600 -> 0.36 m², w = 10%, s_main = 1.2, L_main = 3.6, L_wall = 3.0)
      //   Area         = 12 * 8 = 96.00 m²
      //   Perimeter    = 2 * (12 + 8) = 40.00 m
      //   Tiles        = ceil((96 / 0.36) * 1.10) = ceil(293.3333) = 294 pcs
      //   Wall Angle   = ceil(40 / 3.0) = ceil(13.3333) = 14 bars
      //   Main Runners = ceil(96 / (1.2 * 3.6)) = ceil(22.2222) = 23 runners
      assertClose(await readNumberTestId(p, 'out-tiles-needed'), 294, 0.001, 'ceiling default tiles');
      assertClose(await readNumberTestId(p, 'out-ceiling-area'), 96.0, 0.001, 'ceiling default area');
      assertClose(await readNumberTestId(p, 'out-perimeter'), 40.0, 0.001, 'ceiling default perimeter');
      assertClose(await readNumberTestId(p, 'out-wall-angle'), 14, 0.001, 'ceiling default wall bars');
      assertClose(await readNumberTestId(p, 'out-main-runners'), 23, 0.001, 'ceiling default main runners');

      // 2. CSV Export verification
      const [csvDl] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvText = fs.readFileSync(await csvDl.path(), 'utf-8');
      const expectedRows = [
        '"Parameter","Value","Unit","Notes"',
        '"Finished Ceiling Area (A)","96.00","m²","A = L * W"',
        '"Total Ceiling Tiles Required","294","pcs","ceil((A / A_tile) * (1 + w / 100))"',
        '"Wall Angle Trim Bars","14","bars","ceil(P / L_wall)"',
        '"Main T-Bar Runners (Area Estimate)","23","runners","ceil(A / (s_main * L_main))"',
      ];
      for (const row of expectedRows) {
        if (!csvText.includes(row)) {
          throw new Error(`Missing expected CSV row in ceiling-grid-takeoff.csv: ${row}`);
        }
      }

      // 3. Presets & Floating-point safe ceil verification
      //   600x1200 module (0.72 m²) -> ceil((96 / 0.72) * 1.10) = ceil(146.6667) = 147 pcs
      await p.click('[data-testid="preset-office-1200"]');
      assertClose(await readNumberTestId(p, 'out-tiles-needed'), 147, 0.001, 'ceiling 600x1200 tiles');

      //   Exact 6x6 m, 600x600 (0.36 m²), 0% waste -> 36 / 0.36 = 100 exact pcs (no 101 float bump!)
      await p.click('[data-testid="preset-exact-6x6"]');
      assertClose(await readNumberTestId(p, 'out-ceiling-area'), 36.0, 0.001, 'ceiling 6x6 area');
      assertClose(await readNumberTestId(p, 'out-tiles-needed'), 100, 0.001, 'ceiling 6x6 exact 100 tiles');
      assertClose(await readNumberTestId(p, 'out-wall-angle'), 8, 0.001, 'ceiling 6x6 exact 8 wall bars');
      assertClose(await readNumberTestId(p, 'out-main-runners'), 9, 0.001, 'ceiling 6x6 9 main runners');

      //   Editable typical spacing: change s_main to 1.5 m -> ceil(36 / (1.5 * 3.6)) = ceil(6.6667) = 7
      await p.fill('[data-testid="input-main-spacing"]', '1.5');
      assertClose(await readNumberTestId(p, 'out-main-runners'), 7, 0.001, 'ceiling custom main spacing');

      // 4. Input Defenses across >= 2 inputs
      for (const bad of ['', 'abc', '12abc', '0', '-4']) {
        await p.fill('[data-testid="input-room-length"]', bad);
        assertEqual(await readTextTestId(p, 'out-tiles-needed'), '—', `ceiling bad length "${bad}"`);
        await verifyNoNaNOrInfinity(p, `ceiling bad length "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '-1', '120']) {
        await p.fill('[data-testid="input-waste-pct"]', bad);
        assertEqual(await readTextTestId(p, 'out-tiles-needed'), '—', `ceiling bad waste "${bad}"`);
        await verifyNoNaNOrInfinity(p, `ceiling bad waste "${bad}"`);
      }

      // 5. Reset & Negative Assertions (removed concrete/ADA standards & mislabeled "Imperial Module")
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-tiles-needed'), 294, 0.001, 'ceiling after reset');
      await verifyNegativeTermsOnToolPage(
        p,
        ['ACI 318', 'Eurocode 2', 'EN 1992', 'IBC 2024', 'ASCE 7', 'ADA 2010', 'Imperial Module'],
        '52. ceiling-grid-calculator'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 53: centrifugal-force-calculator
    // -------------------------------------------------------------------------
    await runSubTest('53. centrifugal-force-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/centrifugal-force-calculator`,
        '[data-testid="input-mass"]'
      );

      // 1. Default Hand-Calculation (m = 2 kg, r = 0.3 m, N = 1500 RPM)
      //   omega = 2 * pi * 1500 / 60 = 50 * pi = 157.0796 -> 157.080 rad/s
      //   v     = 50 * pi * 0.3      = 15 * pi = 47.1239  -> 47.124 m/s
      //   F_c   = 2 * 0.3 * (50*pi)^2 = 1500 * pi^2       = 14804.4066 -> 14804.41 N
      //   RCF   = (0.3 * 2500 * pi^2) / 9.80665           = 754.8147   -> 754.81 g
      assertClose(await readNumberTestId(p, 'out-centrifugal-force'), 14804.41, 0.001, 'cf default F_c');
      assertClose(await readNumberTestId(p, 'out-angular-velocity'), 157.08, 0.001, 'cf default omega');
      assertClose(await readNumberTestId(p, 'out-linear-speed'), 47.124, 0.001, 'cf default v');
      assertClose(await readNumberTestId(p, 'out-rcf-g'), 754.81, 0.001, 'cf default RCF');

      // 2. CSV Export verification
      const [csvDl] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvText = fs.readFileSync(await csvDl.path(), 'utf-8');
      const expectedRows = [
        '"Parameter","Value","Unit","Notes"',
        '"Angular Velocity (omega)","157.080","rad/s","omega = 2 * pi * N / 60"',
        '"Tangential Linear Speed (v)","47.124","m/s","v = omega * r"',
        '"Centrifugal / Centripetal Force (F_c)","14804.41","N","F_c = m * r * omega^2"',
        '"Relative Centrifugal Acceleration (RCF)","754.81","g","RCF = (r * omega^2) / 9.80665"',
      ];
      for (const row of expectedRows) {
        if (!csvText.includes(row)) {
          throw new Error(`Missing expected CSV row in centrifugal-force-results.csv: ${row}`);
        }
      }

      // 3. Unit Conversion & Presets verification
      //   Preset Spindle Chuck: m = 500 g (0.5 kg), r = 100 mm (0.1 m), N = 3000 RPM
      //   omega = 100 * pi = 314.159 rad/s, v = 10 * pi = 31.416 m/s
      //   F_c   = 0.5 * 0.1 * (100*pi)^2 = 500 * pi^2 = 4934.80 N
      //   RCF   = (0.1 * 10000 * pi^2) / 9.80665 = 1006.42 g
      await p.click('[data-testid="preset-spindle-chuck"]');
      assertClose(await readNumberTestId(p, 'out-centrifugal-force'), 4934.8, 0.001, 'cf g/mm F_c');
      assertClose(await readNumberTestId(p, 'out-angular-velocity'), 314.159, 0.001, 'cf g/mm omega');
      assertClose(await readNumberTestId(p, 'out-linear-speed'), 31.416, 0.001, 'cf g/mm v');
      assertClose(await readNumberTestId(p, 'out-rcf-g'), 1006.42, 0.001, 'cf g/mm RCF');

      // 4. Input Defenses across >= 2 inputs
      for (const bad of ['', 'abc', '12abc', '0', '-2']) {
        await p.fill('[data-testid="input-mass"]', bad);
        assertEqual(await readTextTestId(p, 'out-centrifugal-force'), '—', `cf bad mass "${bad}"`);
        await verifyNoNaNOrInfinity(p, `cf bad mass "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0', '-500']) {
        await p.fill('[data-testid="input-rpm"]', bad);
        assertEqual(await readTextTestId(p, 'out-centrifugal-force'), '—', `cf bad rpm "${bad}"`);
        await verifyNoNaNOrInfinity(p, `cf bad rpm "${bad}"`);
      }

      // 5. Reset & Negative Assertions (removed shaft/keyway standards)
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-centrifugal-force'), 14804.41, 0.001, 'cf after reset');
      await verifyNegativeTermsOnToolPage(
        p,
        ['ASME B106.1M', 'DIN 6885', 'ISO 773', 'ISO 1940-1'],
        '53. centrifugal-force-calculator'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 54: chain-drive-length-calculator
    // -------------------------------------------------------------------------
    await runSubTest('54. chain-drive-length-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/chain-drive-length-calculator`,
        '[data-testid="input-center-distance"]'
      );

      // 1. Default Hand-Calculation (C = 500 mm, P = 12.7 mm, N1 = 17, N2 = 51)
      //   C_p       = 500 / 12.7 = 39.3700787
      //   L_p,exact = 34 + 78.7401575 + (34^2) / (4 * pi^2 * 39.3700787) = 113.4839 -> 113.48 pitches
      //   L_p,even  = 114 pitches (integer string "114", no decimal ".00")
      //   L_mm      = 114 * 12.7 = 1447.80 mm
      //   C_actual  = (12.7 / 8) * [160 + sqrt(160^2 - (8/pi^2)*34^2)] = 503.308 -> 503.31 mm
      assertEqual(await readTextTestId(p, 'out-even-links'), '114', 'chain default integer even links');
      assertClose(await readNumberTestId(p, 'out-chain-length-mm'), 1447.8, 0.001, 'chain default L_mm');
      assertClose(await readNumberTestId(p, 'out-exact-links'), 113.48, 0.001, 'chain default L_p,exact');
      assertClose(await readNumberTestId(p, 'out-actual-center'), 503.31, 0.001, 'chain default C_actual');

      // 2. CSV Export verification
      const [csvDl] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvText = fs.readFileSync(await csvDl.path(), 'utf-8');
      const expectedRows = [
        '"Parameter","Value","Unit","Notes"',
        '"Exact Theoretical Length (L_p,exact)","113.48","pitches","(N1+N2)/2 + 2C/P + (N2-N1)^2 / (4*pi^2*(C/P))"',
        '"Recommended Even Chain Links (L_p,even)","114","pitches","Rounded up to next even pitch count (no offset link)"',
        '"Total Chain Linear Length","1447.80","mm","L_p,even * P"',
        '"Adjusted Center Distance (C_actual)","503.31","mm","Exact center distance corresponding to L_p,even"',
        '"Standards Reference","ISO 606:2015 / ASME B29.1","-","Roller chain pitch standards & two-sprocket length equation"',
      ];
      for (const row of expectedRows) {
        if (!csvText.includes(row)) {
          throw new Error(`Missing expected CSV row in chain-drive-length.csv: ${row}`);
        }
      }

      // 3. Presets verification
      //   10B/#50 · 19:38 (C = 600, P = 15.875, N1 = 19, N2 = 38):
      //     L_p,exact = 104.33, L_p,even = 106, L_mm = 1682.75, C_actual = 613.28 mm
      await p.click('[data-testid="preset-10b-2to1"]');
      assertEqual(await readTextTestId(p, 'out-even-links'), '106', 'chain 10B even links');
      assertClose(await readNumberTestId(p, 'out-exact-links'), 104.33, 0.001, 'chain 10B exact links');
      assertClose(await readNumberTestId(p, 'out-chain-length-mm'), 1682.75, 0.001, 'chain 10B L_mm');
      assertClose(await readNumberTestId(p, 'out-actual-center'), 613.28, 0.001, 'chain 10B C_actual');

      //   12B/#60 · 20:20 equal sprockets (C = 400, P = 19.05, N1 = 20, N2 = 20):
      //     L_p,exact = 61.99, L_p,even = 62, L_mm = 1181.10, C_actual = 400.05 mm
      await p.click('[data-testid="preset-12b-equal"]');
      assertEqual(await readTextTestId(p, 'out-even-links'), '62', 'chain 12B even links');
      assertClose(await readNumberTestId(p, 'out-chain-length-mm'), 1181.1, 0.001, 'chain 12B L_mm');
      assertClose(await readNumberTestId(p, 'out-actual-center'), 400.05, 0.001, 'chain 12B C_actual');

      // 4. Input Defenses & Sprocket Overlap Guard (C <= R_p1 + R_p2 or non-integer teeth)
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0', '100']) {
        await p.fill('[data-testid="input-center-distance"]', bad);
        assertEqual(await readTextTestId(p, 'out-even-links'), '—', `chain bad C "${bad}"`);
        await verifyNoNaNOrInfinity(p, `chain bad C "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '17.5', '4']) {
        await p.fill('[data-testid="input-teeth-1"]', bad);
        assertEqual(await readTextTestId(p, 'out-even-links'), '—', `chain bad N1 "${bad}"`);
        await verifyNoNaNOrInfinity(p, `chain bad N1 "${bad}"`);
      }

      // 5. Reset & Negative Assertions (removed gear, belt, and ball-screw standards)
      await p.click('[data-testid="btn-reset"]');
      assertEqual(await readTextTestId(p, 'out-even-links'), '114', 'chain after reset');
      await verifyNegativeTermsOnToolPage(
        p,
        ['ISO 6336', 'AGMA 2001', 'ISO 4183', 'RMA IP-20', 'ISO 3408'],
        '54. chain-drive-length-calculator'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 55: channel-flow-manning-calculator
    // -------------------------------------------------------------------------
    await runSubTest('55. channel-flow-manning-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/channel-flow-manning-calculator`,
        '[data-testid="input-width"]'
      );

      // 1. Default Hand-Calculation (Rectangular: b = 2 m, y = 1 m, S = 0.001, n = 0.015)
      //   A   = 2 * 1 = 2.000 m²
      //   P   = 2 + 2 * 1 = 4.000 m
      //   R_h = 2 / 4 = 0.500 m
      //   v   = (1 / 0.015) * (0.5)^(2/3) * sqrt(0.001) = 1.32807 -> 1.328 m/s
      //   Q   = 2 * 1.32807 = 2.65615 -> 2.656 m³/s
      assertClose(await readNumberTestId(p, 'out-flow-rate'), 2.656, 0.001, 'manning default Q');
      assertClose(await readNumberTestId(p, 'out-velocity'), 1.328, 0.001, 'manning default v');
      assertClose(await readNumberTestId(p, 'out-hydraulic-radius'), 0.5, 0.001, 'manning default R_h');
      assertClose(await readNumberTestId(p, 'out-flow-area'), 2.0, 0.001, 'manning default A');
      assertClose(await readNumberTestId(p, 'out-wetted-perimeter'), 4.0, 0.001, 'manning default P');

      // 2. CSV Export verification
      const [csvDl] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]'),
      ]);
      const csvText = fs.readFileSync(await csvDl.path(), 'utf-8');
      const expectedRows = [
        '"Parameter","Value","Unit","Notes"',
        '"Flow Area (A)","2.000","m²","A = b * y"',
        '"Wetted Perimeter (P)","4.000","m","P = b + 2 * y"',
        '"Hydraulic Radius (R_h)","0.500","m","R_h = A / P"',
        '"Mean Velocity (v)","1.328","m/s","v = (1 / n) * R_h^(2/3) * S^(1/2)"',
        '"Volumetric Flow Rate (Q)","2.656","m³/s","Q = A * v"',
      ];
      for (const row of expectedRows) {
        if (!csvText.includes(row)) {
          throw new Error(`Missing expected CSV row in channel-flow-manning.csv: ${row}`);
        }
      }

      // 3. Trapezoidal Branch Verification (verifies fix of old 0.5*b*y triangle bug!)
      //   Preset Trap z=1.5: b = 2 m, y = 1 m, z = 1.5, S = 0.001, n = 0.015
      //     A   = (2 + 1.5 * 1) * 1 = 3.500 m²
      //     P   = 2 + 2 * 1 * sqrt(1 + 2.25) = 2 + 2 * 1.8027756 = 5.60555 -> 5.606 m
      //     R_h = 3.5 / 5.60555 = 0.624381 -> 0.624 m
      //     v   = (1 / 0.015) * (0.624381)^(2/3) * sqrt(0.001) = 1.54010 -> 1.540 m/s
      //     Q   = 3.5 * 1.54010 = 5.39035 -> 5.390 m³/s
      await p.click('[data-testid="preset-trap-concrete"]');
      assertClose(await readNumberTestId(p, 'out-flow-area'), 3.5, 0.001, 'manning trap A');
      assertClose(await readNumberTestId(p, 'out-wetted-perimeter'), 5.606, 0.001, 'manning trap P');
      assertClose(await readNumberTestId(p, 'out-hydraulic-radius'), 0.624, 0.001, 'manning trap R_h');
      assertClose(await readNumberTestId(p, 'out-velocity'), 1.54, 0.001, 'manning trap v');
      assertClose(await readNumberTestId(p, 'out-flow-rate'), 5.390, 0.001, 'manning trap Q');

      //   Preset Earth z=2.0: b = 3 m, y = 1.2 m, z = 2, S = 0.002, n = 0.025
      //     A = (3 + 2.4) * 1.2 = 6.480 m², P = 3 + 2.4 * sqrt(5) = 8.367 m, R_h = 0.775 m, v = 1.509 m/s, Q = 9.776 m³/s
      await p.click('[data-testid="preset-trap-earth"]');
      assertClose(await readNumberTestId(p, 'out-flow-area'), 6.48, 0.001, 'manning earth A');
      assertClose(await readNumberTestId(p, 'out-wetted-perimeter'), 8.367, 0.001, 'manning earth P');
      assertClose(await readNumberTestId(p, 'out-hydraulic-radius'), 0.775, 0.001, 'manning earth R_h');
      assertClose(await readNumberTestId(p, 'out-velocity'), 1.509, 0.001, 'manning earth v');
      assertClose(await readNumberTestId(p, 'out-flow-rate'), 9.776, 0.001, 'manning earth Q');

      // 4. Input Defenses across >= 2 inputs (including trapezoidal side slope z)
      for (const bad of ['', 'abc', '12abc', '0', '-1.5']) {
        await p.fill('[data-testid="input-side-slope"]', bad);
        assertEqual(await readTextTestId(p, 'out-flow-rate'), '—', `manning bad z "${bad}"`);
        await verifyNoNaNOrInfinity(p, `manning bad z "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0', '-2']) {
        await p.fill('[data-testid="input-width"]', bad);
        assertEqual(await readTextTestId(p, 'out-flow-rate'), '—', `manning bad width "${bad}"`);
        await verifyNoNaNOrInfinity(p, `manning bad width "${bad}"`);
      }
      await p.click('[data-testid="btn-reset"]');
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-manning-n"]', bad);
        assertEqual(await readTextTestId(p, 'out-flow-rate'), '—', `manning bad n "${bad}"`);
        await verifyNoNaNOrInfinity(p, `manning bad n "${bad}"`);
      }

      // 5. Reset & Negative Assertions (removed wastewater/plumbing template standards)
      await p.click('[data-testid="btn-reset"]');
      assertClose(await readNumberTestId(p, 'out-flow-rate'), 2.656, 0.001, 'manning after reset');
      await verifyNegativeTermsOnToolPage(
        p,
        ['WEF Manual', 'MOP 8', 'Metcalf & Eddy', 'ASCE/EWRI', 'International Plumbing Code'],
        '55. channel-flow-manning-calculator'
      );
    });
  } finally {
    await browser.close();
  }

  console.log('================================================================');
  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.error(`Batch 11 E2E FAILED (${failed.length}/${results.length} failed)`);
    process.exit(1);
  }
  console.log(`ALL ${results.length} BATCH 11 TOOLS PASSED MASTER E2E VERIFICATION.`);
}

runBatch11Tests().catch((err) => {
  console.error('Fatal error in Batch 11 E2E runner:', err);
  process.exit(1);
});
